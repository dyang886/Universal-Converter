import argparse
import io
import json
import os
import shutil
import sys
import tempfile
from contextlib import contextmanager, redirect_stderr
from pathlib import Path
from subprocess import PIPE, STDOUT, run

__version__ = "0.1.0"

IMAGE_INPUT_EXTS = {
    ".bmp", ".dib", ".gif", ".heic", ".heif", ".ico", ".jfif", ".jpeg", ".jpg", ".jxl",
    ".pbm", ".pcx", ".pgm", ".png", ".pnm", ".ppm", ".tif", ".tiff", ".webp",
}

PDF_INPUT_EXTS = {".pdf"}


def configure_stdio() -> None:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="uct-ocr",
        description="OCR helper CLI for Universal Converter.",
    )
    parser.add_argument("--version", action="version", version=f"uct-ocr {__version__}")

    subparsers = parser.add_subparsers(dest="command", required=True)

    pdf_parser = subparsers.add_parser("pdf", help="Create a searchable PDF from a PDF or image input.")
    add_common_ocr_args(pdf_parser)
    pdf_parser.add_argument("input", help="Input PDF or image path.")
    pdf_parser.add_argument("output", help="Output PDF path.")
    pdf_parser.set_defaults(handler=run_pdf)

    text_parser = subparsers.add_parser("text", help="Extract OCR text from a PDF or image input.")
    add_common_ocr_args(text_parser)
    text_parser.add_argument("input", help="Input PDF or image path.")
    text_parser.add_argument("output", help="Output text path.")
    text_parser.set_defaults(handler=run_text)

    langs_parser = subparsers.add_parser("langs", help="List available OCR language packs.")
    langs_parser.set_defaults(handler=run_langs)

    return parser


def add_common_ocr_args(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--lang", default="eng", help="OCR language list, such as eng or eng+chi_sim.")
    parser.add_argument("--deskew", action="store_true", help="Deskew pages before OCR when supported.")
    parser.add_argument("--rotate-pages", action="store_true", help="Auto-rotate pages when supported.")
    parser.add_argument(
        "--mode",
        choices=["skip", "force", "redo"],
        default="skip",
        help="How to handle existing text: skip pages with text, force OCR, or redo OCR.",
    )
    parser.add_argument("--image-dpi", type=int, help="Assumed DPI for image inputs without DPI metadata.")
    parser.add_argument("--pages", help="Page range accepted by OCRmyPDF, such as 1,3-5.")
    parser.add_argument("--jobs", type=int, help="Number of worker jobs.")
    parser.add_argument("--output-type", choices=["pdf", "pdfa", "pdfa-1", "pdfa-2", "pdfa-3"], help="PDF output type.")


def dependency_root() -> Path:
    if getattr(sys, "frozen", False) or "__compiled__" in globals():
        exe_dir = Path(sys.executable).resolve().parent
        return exe_dir.parent if exe_dir.name.lower() == "runtime" else exe_dir
    return Path(os.environ.get("UCT_OCR_HOME", Path(__file__).resolve().parent)).resolve()


def dependency_sibling_root() -> Path:
    root = dependency_root()
    return root.parent if root.name.lower() == "ocr" else root


def existing_path_from_env(name: str) -> Path | None:
    value = os.environ.get(name)
    if not value:
        return None
    path = Path(value)
    return path if path.exists() else None


def tesseract_exe() -> Path | None:
    env_path = existing_path_from_env("UCT_TESSERACT_EXE")
    if env_path:
        return env_path

    root = dependency_root()
    candidates = [
        root / "tesseract" / "tesseract.exe",
        root / "tesseract.exe",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate

    path_match = shutil.which("tesseract")
    return Path(path_match) if path_match else None


def tessdata_dir() -> Path | None:
    env_path = existing_path_from_env("UCT_TESSDATA_PREFIX") or existing_path_from_env("TESSDATA_PREFIX")
    if env_path:
        return env_path

    root = dependency_root()
    candidates = [
        root / "tessdata",
        root / "tesseract" / "tessdata",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate

    return None


def bundled_bin_dirs() -> list[Path]:
    root = dependency_root()
    sibling_root = dependency_sibling_root()
    return [
        root,
        root / "runtime",
        root / "tesseract",
        sibling_root / "ghostscript" / "bin",
    ]


def ocr_env() -> dict[str, str]:
    env = os.environ.copy()

    bin_dirs = [str(path) for path in bundled_bin_dirs() if path.exists()]
    if bin_dirs:
        env["PATH"] = os.pathsep.join([*bin_dirs, env.get("PATH", "")])

    data_dir = tessdata_dir()
    if data_dir:
        env["TESSDATA_PREFIX"] = str(data_dir)

    return env


def configure_process_environment() -> None:
    env = ocr_env()
    os.environ["PATH"] = env["PATH"]
    if "TESSDATA_PREFIX" in env:
        os.environ["TESSDATA_PREFIX"] = env["TESSDATA_PREFIX"]


def parse_languages(value: str) -> list[str]:
    languages = [part.strip() for part in value.replace(",", "+").split("+")]
    return [language for language in languages if language]


def validate_input_path(input_path: Path) -> None:
    if not input_path.exists():
        raise FileNotFoundError(f"Input file does not exist: {input_path}")
    if input_path.suffix.lower() not in PDF_INPUT_EXTS | IMAGE_INPUT_EXTS:
        raise ValueError(f"Unsupported OCR input format: {input_path.suffix or '(none)'}")


def ensure_output_path(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)


@contextmanager
def prepared_input_path(input_path: Path):
    if input_path.suffix.lower() not in IMAGE_INPUT_EXTS:
        yield input_path
        return

    try:
        from PIL import Image
    except ImportError:
        yield input_path
        return

    with Image.open(input_path) as image:
        has_alpha = image.mode in {"LA", "RGBA"} or (image.mode == "P" and "transparency" in image.info)
        if not has_alpha:
            yield input_path
            return

        with tempfile.TemporaryDirectory(prefix="uct-ocr-image-") as temp_dir:
            flattened_path = Path(temp_dir) / "flattened-input.png"
            rgba = image.convert("RGBA")
            flattened = Image.new("RGBA", rgba.size, "WHITE")
            flattened.alpha_composite(rgba)
            flattened.convert("RGB").save(flattened_path)
            yield flattened_path


def ocr_options(args: argparse.Namespace) -> dict:
    mode_options = {
        "skip": {"skip_text": True},
        "force": {"force_ocr": True},
        "redo": {"redo_ocr": True},
    }[args.mode]

    options = {
        "language": parse_languages(args.lang),
        "deskew": args.deskew or None,
        "rotate_pages": args.rotate_pages or None,
        **mode_options,
        "image_dpi": args.image_dpi,
        "pages": args.pages,
        "jobs": args.jobs,
        "output_type": args.output_type,
        "use_threads": True,
        "optimize": 0,
        "progress_bar": False,
    }
    return {key: value for key, value in options.items() if value is not None}


def run_ocr(input_path: Path, output_path: Path, args: argparse.Namespace, *, sidecar: Path | None = None) -> int:
    configure_process_environment()

    try:
        from ocrmypdf import ocr
    except ImportError as error:
        raise RuntimeError("OCRmyPDF is not installed in this OCR helper build.") from error

    captured_stderr = io.StringIO()
    with redirect_stderr(captured_stderr):
        exit_code = ocr(
            input_path,
            output_path,
            sidecar=sidecar,
            **ocr_options(args),
        )
    if int(exit_code) != 0:
        error_text = captured_stderr.getvalue().strip()
        if error_text:
            print(error_text, file=sys.stderr)
    return int(exit_code)


def run_pdf(args: argparse.Namespace) -> int:
    input_path = Path(args.input)
    output_path = Path(args.output)
    validate_input_path(input_path)
    ensure_output_path(output_path)

    with prepared_input_path(input_path) as prepared_input:
        code = run_ocr(prepared_input, output_path, args)
    if code == 0:
        print(json.dumps({"output": str(output_path)}, ensure_ascii=False))
    return code


def run_text(args: argparse.Namespace) -> int:
    input_path = Path(args.input)
    output_path = Path(args.output)
    validate_input_path(input_path)
    ensure_output_path(output_path)

    with tempfile.TemporaryDirectory(prefix="uct-ocr-") as temp_dir:
        temp_pdf = Path(temp_dir) / "ocr-output.pdf"
        with prepared_input_path(input_path) as prepared_input:
            code = run_ocr(prepared_input, temp_pdf, args, sidecar=output_path)

    if code == 0:
        print(json.dumps({"output": str(output_path)}, ensure_ascii=False))
    return code


def run_langs(args: argparse.Namespace) -> int:
    executable = tesseract_exe()
    if not executable:
        raise RuntimeError("Tesseract executable was not found.")

    result = run(
        [str(executable), "--list-langs"],
        env=ocr_env(),
        stdout=PIPE,
        stderr=STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if result.returncode != 0:
        raise RuntimeError(result.stdout.strip() or "Could not list Tesseract languages.")

    languages = []
    for line in result.stdout.splitlines():
        language = line.strip().replace("\\", "/")
        if not language or language.lower().startswith("list of available languages"):
            continue
        languages.append(language)

    print(json.dumps({"languages": languages}, ensure_ascii=False))
    return 0


def main(argv: list[str] | None = None) -> int:
    configure_stdio()
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        return args.handler(args)
    except Exception as error:
        print(str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
