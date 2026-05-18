use indexmap::IndexMap;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};

use tauri::AppHandle;
use tokio::fs;
use tokio::sync::Semaphore;
use tokio::task::JoinSet;
use uuid::Uuid;

use crate::routing::ConversionRouteKind;
use crate::{OcrControls, emit_cancelled, emit_delta, emit_error, emit_success, run_cli_command};

const POSTSCRIPT_DOCUMENT_EXTS: &[&str] = &["ai", "eps", "pdf", "ps"];
const PAGE_ENCODER_OUTPUT_EXTS: &[&str] = &["heic", "heif", "jxr", "wdp"];
#[rustfmt::skip]
const LIBREOFFICE_OUTPUT_EXTS: &[&str] = &[
    "csv", "doc", "docx", "epub", "htm", "html", "odp", "ods", "odt",
    "pdf", "ppt", "pptx", "rtf", "txt", "xls", "xlsx", "xhtml",
];
#[rustfmt::skip]
const PANDOC_INPUT_EXTS: &[&str] = &[
    "adoc", "asciidoc", "commonmark", "dbk", "djot", "docx", "dokuwiki",
    "epub", "fb2", "gfm", "htm", "html", "ipynb", "man", "md",
    "mediawiki", "muse", "odt", "opml", "org", "rst", "rtf", "tex",
    "textile", "txt", "typ", "xhtml",
];
#[rustfmt::skip]
const PANDOC_OUTPUT_EXTS: &[&str] = &[
    "adoc", "asciidoc", "commonmark", "dbk", "djot", "docx", "dokuwiki",
    "epub", "fb2", "gfm", "htm", "html", "ipynb", "man", "md",
    "mediawiki", "muse", "odt", "opml", "org", "rst", "rtf", "tex",
    "textile", "txt", "typ", "xhtml",
];

pub async fn run_conversion(
    handle: AppHandle, input_paths: Vec<String>, output_ext: String, route_kind: ConversionRouteKind, pack_ids: Vec<String>, output_group: String,
    options: IndexMap<String, String>, combine: bool, ocr: Option<OcrControls>, cancel_flag: Arc<AtomicBool>, max_threads: usize,
) -> Result<bool, String> {
    let batches: Vec<Vec<String>> = if combine {
        vec![input_paths]
    } else {
        input_paths.into_iter().map(|p| vec![p]).collect()
    };

    let semaphore = Arc::new(Semaphore::new(max_threads));
    let all_ok = Arc::new(AtomicBool::new(true));
    let mut join_set = JoinSet::new();

    for batch in batches {
        if cancel_flag.load(Ordering::Relaxed) {
            break;
        }

        let permit = Arc::clone(&semaphore).acquire_owned().await.unwrap();
        if cancel_flag.load(Ordering::Relaxed) {
            break;
        }

        let handle = handle.clone();
        let output_ext = output_ext.clone();
        let route_kind = route_kind.clone();
        let pack_ids = pack_ids.clone();
        let output_group = output_group.clone();
        let options = options.clone();
        let ocr = ocr.clone();
        let cancel = Arc::clone(&cancel_flag);
        let all_ok = Arc::clone(&all_ok);

        join_set.spawn(async move {
            let _permit = permit;
            if !convert_batch(
                &handle,
                batch,
                &output_ext,
                &route_kind,
                &pack_ids,
                &output_group,
                &options,
                ocr.as_ref(),
                &cancel,
            )
            .await
            {
                all_ok.store(false, Ordering::Relaxed);
            }
        });
    }

    while join_set.join_next().await.is_some() {}

    Ok(all_ok.load(Ordering::Relaxed))
}

async fn convert_batch(
    handle: &AppHandle, batch: Vec<String>, output_ext: &str, route_kind: &ConversionRouteKind, pack_ids: &[String], output_group: &str,
    options: &IndexMap<String, String>, ocr: Option<&OcrControls>, cancel_flag: &Arc<AtomicBool>,
) -> bool {
    let representative = PathBuf::from(&batch[0]);
    emit_delta(handle, &batch[0], &representative, String::new());

    let output = representative.with_file_name(format!(
        "{}_UCT.{}",
        representative.file_stem().unwrap_or_default().to_string_lossy(),
        output_ext
    ));

    let result = run_document_route(
        handle,
        &batch,
        output_ext,
        route_kind,
        pack_ids,
        output_group,
        options,
        ocr,
        cancel_flag,
        &output,
    )
    .await;

    match result {
        Ok(()) => {
            emit_success(handle, &batch[0], &representative);
            true
        }
        Err(e) if e == "cancelled" => {
            emit_cancelled(handle, &batch[0], &representative);
            false
        }
        Err(e) => {
            eprintln!("Document conversion failed: {}", e);
            emit_error(handle, &batch[0], &representative);
            false
        }
    }
}

async fn run_document_route(
    handle: &AppHandle, batch: &[String], output_ext: &str, route_kind: &ConversionRouteKind, pack_ids: &[String], output_group: &str,
    options: &IndexMap<String, String>, ocr: Option<&OcrControls>, cancel_flag: &Arc<AtomicBool>, output: &Path,
) -> Result<(), String> {
    let input_ext = path_extension(Path::new(&batch[0]));
    match route_kind {
        ConversionRouteKind::DocumentOcr => {
            if batch.len() > 1 {
                return Err("Combining OCR inputs is not supported yet.".to_string());
            }
            run_ocr_flow(handle, &batch[0], output_ext, ocr, cancel_flag, output, pack_ids).await
        }
        ConversionRouteKind::DocumentPostscript => {
            run_postscript_flow(
                handle,
                batch,
                &input_ext,
                output_ext,
                output_group,
                options,
                cancel_flag,
                output,
                pack_ids,
            )
            .await
        }
        ConversionRouteKind::DocumentPandoc => {
            if batch.len() > 1 {
                return Err("Combining Pandoc document inputs is not supported yet.".to_string());
            }
            run_pandoc_to_document_flow(handle, &batch[0], &input_ext, output_ext, cancel_flag, output, pack_ids).await
        }
        ConversionRouteKind::DocumentPandocToPdf => {
            if batch.len() > 1 {
                return Err("Combining Pandoc document inputs is not supported yet.".to_string());
            }
            run_pandoc_to_pdf_flow(handle, &batch[0], &input_ext, cancel_flag, output, pack_ids).await
        }
        ConversionRouteKind::DocumentPandocToImage => {
            if batch.len() > 1 {
                return Err("Combining Pandoc document inputs is not supported yet.".to_string());
            }
            run_pandoc_to_image_flow(handle, &batch[0], &input_ext, output_ext, options, cancel_flag, output, pack_ids).await
        }
        ConversionRouteKind::DocumentOfficeToDocument => {
            if batch.len() > 1 {
                return Err("Combining LibreOffice document inputs is not supported yet.".to_string());
            }
            run_libreoffice_to_document_flow(handle, &batch[0], output_ext, cancel_flag, output, pack_ids).await
        }
        ConversionRouteKind::DocumentOfficeToImage => {
            if batch.len() > 1 {
                return Err("Combining LibreOffice document inputs is not supported yet.".to_string());
            }
            run_libreoffice_to_image_flow(handle, &batch[0], &batch[0], output_ext, options, cancel_flag, output, pack_ids).await
        }
        _ => Err(format!("Unsupported document route for .{}", input_ext)),
    }
}

async fn run_ocr_flow(
    handle: &AppHandle, input_path: &str, output_ext: &str, ocr: Option<&OcrControls>, cancel_flag: &Arc<AtomicBool>, output: &Path,
    pack_ids: &[String],
) -> Result<(), String> {
    let ocr = ocr.ok_or_else(|| "OCR controls are missing.".to_string())?;
    if !ocr.enabled {
        return Err("OCR is not enabled.".to_string());
    }

    let subcommand = match output_ext.to_ascii_lowercase().as_str() {
        "pdf" => "pdf",
        "txt" => "text",
        _ => return Err(format!("OCR output .{} is not supported yet.", output_ext)),
    };

    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }
    if fs::try_exists(output).await.map_err(|e| e.to_string())? {
        fs::remove_file(output).await.map_err(|e| e.to_string())?;
    }

    let mut args = vec![subcommand.to_string()];
    args.extend(ocr.args.clone());
    args.push(input_path.to_string());
    args.push(output.to_string_lossy().to_string());
    run_cli_command(handle, input_path, "uct-ocr.exe", &args, cancel_flag, pack_ids).await
}

async fn run_pandoc_to_document_flow(
    handle: &AppHandle, input_path: &str, input_ext: &str, output_ext: &str, cancel_flag: &Arc<AtomicBool>, output: &Path, pack_ids: &[String],
) -> Result<(), String> {
    run_pandoc_export(handle, input_path, input_path, input_ext, output_ext, cancel_flag, output, pack_ids).await
}

async fn run_pandoc_to_pdf_flow(
    handle: &AppHandle, input_path: &str, input_ext: &str, cancel_flag: &Arc<AtomicBool>, output: &Path, pack_ids: &[String],
) -> Result<(), String> {
    let temp_dir = make_temp_dir().await?;
    let result = async {
        let intermediate_docx = temp_dir.join("pandoc-intermediate.docx");
        run_pandoc_export(
            handle,
            input_path,
            input_path,
            input_ext,
            "docx",
            cancel_flag,
            &intermediate_docx,
            pack_ids,
        )
        .await?;
        let intermediate_path = intermediate_docx.to_string_lossy().to_string();
        let generated = run_libreoffice_export(handle, &intermediate_path, input_path, "pdf", cancel_flag, &temp_dir, pack_ids).await?;
        move_generated_output(&generated, output).await
    }
    .await;
    cleanup_temp_dir(&temp_dir).await;
    result
}

async fn run_pandoc_to_image_flow(
    handle: &AppHandle, input_path: &str, input_ext: &str, output_ext: &str, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>,
    output: &Path, pack_ids: &[String],
) -> Result<(), String> {
    let temp_dir = make_temp_dir().await?;
    let result = async {
        let intermediate_docx = temp_dir.join("pandoc-intermediate.docx");
        run_pandoc_export(
            handle,
            input_path,
            input_path,
            input_ext,
            "docx",
            cancel_flag,
            &intermediate_docx,
            pack_ids,
        )
        .await?;
        let intermediate_path = intermediate_docx.to_string_lossy().to_string();
        run_libreoffice_to_image_flow(handle, &intermediate_path, input_path, output_ext, options, cancel_flag, output, pack_ids).await
    }
    .await;
    cleanup_temp_dir(&temp_dir).await;
    result
}

async fn run_pandoc_export(
    handle: &AppHandle, input_path: &str, log_path: &str, input_ext: &str, output_ext: &str, cancel_flag: &Arc<AtomicBool>, output: &Path,
    pack_ids: &[String],
) -> Result<(), String> {
    if !PANDOC_INPUT_EXTS.contains(&input_ext.to_ascii_lowercase().as_str()) {
        return Err(format!("Pandoc input .{} is not supported yet.", input_ext));
    }
    if !PANDOC_OUTPUT_EXTS.contains(&output_ext.to_ascii_lowercase().as_str()) {
        return Err(format!("Pandoc output .{} is not supported yet.", output_ext));
    }

    let from = pandoc_input_format(input_ext).ok_or_else(|| format!("Pandoc input .{} is not supported yet.", input_ext))?;
    let to = pandoc_output_format(output_ext).ok_or_else(|| format!("Pandoc output .{} is not supported yet.", output_ext))?;

    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }
    if fs::try_exists(output).await.map_err(|e| e.to_string())? {
        fs::remove_file(output).await.map_err(|e| e.to_string())?;
    }

    let mut args = vec![
        "--from".to_string(),
        from.to_string(),
        "--to".to_string(),
        to.to_string(),
        "--output".to_string(),
        output.to_string_lossy().to_string(),
    ];

    if pandoc_output_needs_standalone(output_ext) {
        args.push("--standalone".to_string());
    }

    args.push(input_path.to_string());
    run_cli_command(handle, log_path, "pandoc", &args, cancel_flag, pack_ids).await
}

async fn run_postscript_flow(
    handle: &AppHandle, batch: &[String], input_ext: &str, output_ext: &str, output_group: &str, options: &IndexMap<String, String>,
    cancel_flag: &Arc<AtomicBool>, output: &Path, pack_ids: &[String],
) -> Result<(), String> {
    match output_group {
        "image" if needs_page_encoder(output_ext) => {
            render_document_pages_to_encoded_images(handle, batch, output_ext, options, cancel_flag, output, &batch[0], pack_ids).await
        }
        "image" => run_magick_document(handle, batch, true, options, cancel_flag, output, &batch[0], pack_ids).await,
        "document" if is_postscript_document_ext(output_ext) => {
            run_magick_document(handle, batch, false, options, cancel_flag, output, &batch[0], pack_ids).await
        }
        _ => Err(format!("Document route .{} -> .{} is not supported yet.", input_ext, output_ext)),
    }
}

async fn run_libreoffice_to_image_flow(
    handle: &AppHandle, input_path: &str, log_path: &str, output_ext: &str, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>,
    output: &Path, pack_ids: &[String],
) -> Result<(), String> {
    let temp_dir = make_temp_dir().await?;
    let result = async {
        let pdf = run_libreoffice_export(handle, input_path, log_path, "pdf", cancel_flag, &temp_dir, pack_ids).await?;
        let pdf_batch = vec![pdf.to_string_lossy().to_string()];

        if needs_page_encoder(output_ext) {
            render_document_pages_to_encoded_images(handle, &pdf_batch, output_ext, options, cancel_flag, output, log_path, pack_ids).await
        } else {
            run_magick_document(handle, &pdf_batch, true, options, cancel_flag, output, log_path, pack_ids).await
        }
    }
    .await;
    cleanup_temp_dir(&temp_dir).await;
    result
}

async fn run_libreoffice_to_document_flow(
    handle: &AppHandle, input_path: &str, output_ext: &str, cancel_flag: &Arc<AtomicBool>, output: &Path, pack_ids: &[String],
) -> Result<(), String> {
    if !is_libreoffice_output_ext(output_ext) {
        return Err(format!("LibreOffice document route -> .{} is not supported yet.", output_ext));
    }

    let temp_dir = make_temp_dir().await?;
    let result = async {
        let generated = run_libreoffice_export(handle, input_path, input_path, output_ext, cancel_flag, &temp_dir, pack_ids).await?;
        move_generated_output(&generated, output).await
    }
    .await;
    cleanup_temp_dir(&temp_dir).await;
    result
}

async fn run_libreoffice_export(
    handle: &AppHandle, input_path: &str, log_path: &str, output_ext: &str, cancel_flag: &Arc<AtomicBool>, temp_dir: &Path, pack_ids: &[String],
) -> Result<PathBuf, String> {
    let output_format = libreoffice_format_arg(output_ext).ok_or_else(|| format!("LibreOffice output .{} is not supported yet.", output_ext))?;
    let profile_dir = temp_dir.join("lo-profile");
    let output_dir = temp_dir.join("lo-output");
    fs::create_dir_all(&profile_dir).await.map_err(|e| e.to_string())?;
    fs::create_dir_all(&output_dir).await.map_err(|e| e.to_string())?;

    let args = vec![
        "--headless".to_string(),
        "--nologo".to_string(),
        "--nodefault".to_string(),
        "--nolockcheck".to_string(),
        "--nofirststartwizard".to_string(),
        format!("-env:UserInstallation={}", file_url(&profile_dir)),
        "--convert-to".to_string(),
        output_format.to_string(),
        "--outdir".to_string(),
        output_dir.to_string_lossy().to_string(),
        input_path.to_string(),
    ];

    run_cli_command(handle, log_path, "soffice.com", &args, cancel_flag, pack_ids).await?;
    find_libreoffice_output(&output_dir, input_path, output_ext).await
}

async fn run_magick_document(
    handle: &AppHandle, batch: &[String], raster_output: bool, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>, output: &Path,
    original_path: &str, pack_ids: &[String],
) -> Result<(), String> {
    let args = build_magick_document_args(batch, raster_output, options, &[], output.to_string_lossy().to_string());
    run_cli_command(handle, original_path, "magick", &args, cancel_flag, pack_ids).await
}

async fn render_document_pages_to_encoded_images(
    handle: &AppHandle, batch: &[String], output_ext: &str, options: &IndexMap<String, String>, cancel_flag: &Arc<AtomicBool>, output: &Path,
    original_path: &str, pack_ids: &[String],
) -> Result<(), String> {
    let temp_dir = make_temp_dir().await?;
    let result = async {
        let intermediate_ext = match output_ext.to_ascii_lowercase().as_str() {
            "heic" | "heif" => "png",
            "jxr" | "wdp" => "bmp",
            _ => return Err(format!("Unsupported document page encoder output: {}", output_ext)),
        };

        let intermediate_pattern = temp_dir.join(format!("page-%d.{}", intermediate_ext));
        let magick_output = if intermediate_ext == "bmp" {
            format!("BMP3:{}", intermediate_pattern.to_string_lossy())
        } else {
            intermediate_pattern.to_string_lossy().to_string()
        };
        let args = build_magick_document_args(batch, true, options, &["-quality"], magick_output);

        run_cli_command(handle, original_path, "magick", &args, cancel_flag, pack_ids).await?;

        let pages = collect_intermediate_pages(&temp_dir, intermediate_ext).await?;
        if pages.is_empty() {
            return Err("Document rasterization succeeded, but no page images were produced.".to_string());
        }

        for (index, page) in pages.iter().enumerate() {
            let final_output = page_output_path(output, output_ext, index, pages.len());
            encode_document_page(handle, original_path, page, &final_output, output_ext, options, cancel_flag, pack_ids).await?;
        }

        Ok(())
    }
    .await;
    cleanup_temp_dir(&temp_dir).await;
    result
}

fn build_magick_document_args(
    batch: &[String], raster_output: bool, options: &IndexMap<String, String>, extra_excluded_options: &[&str], output: String,
) -> Vec<String> {
    let mut args = Vec::new();
    let mut excluded_options = extra_excluded_options.to_vec();

    if raster_output {
        push_document_raster_defaults(&mut args, options, &mut excluded_options);
    }

    args.extend(batch.iter().cloned());

    if raster_output {
        push_document_alpha_defaults(&mut args, options, &mut excluded_options);
    }

    append_options_except(&mut args, options, &excluded_options);
    args.push(output);
    args
}

fn push_document_raster_defaults(args: &mut Vec<String>, options: &IndexMap<String, String>, excluded_options: &mut Vec<&str>) {
    if let Some(density) = options.get("-density").filter(|value| !value.is_empty()) {
        append_option(args, "-density", density);
        excluded_options.push("-density");
    } else {
        args.extend(["-density".to_string(), "300".to_string()]);
    }
}

fn push_document_alpha_defaults(args: &mut Vec<String>, options: &IndexMap<String, String>, excluded_options: &mut Vec<&str>) {
    if let Some(background) = options.get("-background").filter(|value| !value.is_empty()) {
        append_option(args, "-background", background);
        excluded_options.push("-background");
    } else {
        args.extend(["-background".to_string(), "white".to_string()]);
    }

    if !has_option(options, "-alpha") && !has_option(options, "-flatten") {
        args.extend(["-alpha".to_string(), "remove".to_string(), "-alpha".to_string(), "off".to_string()]);
    }
}

fn is_postscript_document_ext(ext: &str) -> bool {
    POSTSCRIPT_DOCUMENT_EXTS.contains(&ext)
}

fn needs_page_encoder(output_ext: &str) -> bool {
    PAGE_ENCODER_OUTPUT_EXTS.contains(&output_ext.to_ascii_lowercase().as_str())
}

fn is_libreoffice_output_ext(ext: &str) -> bool {
    LIBREOFFICE_OUTPUT_EXTS.contains(&ext.to_ascii_lowercase().as_str())
}

fn pandoc_input_format(ext: &str) -> Option<&'static str> {
    match ext.to_ascii_lowercase().as_str() {
        "docx" => Some("docx"),
        "adoc" | "asciidoc" => Some("asciidoc"),
        "commonmark" => Some("commonmark"),
        "dbk" => Some("docbook"),
        "djot" => Some("djot"),
        "dokuwiki" => Some("dokuwiki"),
        "epub" => Some("epub"),
        "fb2" => Some("fb2"),
        "gfm" => Some("gfm"),
        "htm" | "html" | "xhtml" => Some("html"),
        "ipynb" => Some("ipynb"),
        "man" => Some("man"),
        "md" => Some("markdown"),
        "mediawiki" => Some("mediawiki"),
        "muse" => Some("muse"),
        "odt" => Some("odt"),
        "opml" => Some("opml"),
        "org" => Some("org"),
        "rst" => Some("rst"),
        "rtf" => Some("rtf"),
        "tex" => Some("latex"),
        "textile" => Some("textile"),
        "txt" => Some("markdown"),
        "typ" => Some("typst"),
        _ => None,
    }
}

fn pandoc_output_format(ext: &str) -> Option<&'static str> {
    match ext.to_ascii_lowercase().as_str() {
        "adoc" | "asciidoc" => Some("asciidoc"),
        "commonmark" => Some("commonmark"),
        "dbk" => Some("docbook"),
        "djot" => Some("djot"),
        "docx" => Some("docx"),
        "dokuwiki" => Some("dokuwiki"),
        "epub" => Some("epub"),
        "fb2" => Some("fb2"),
        "gfm" => Some("gfm"),
        "htm" | "html" => Some("html"),
        "ipynb" => Some("ipynb"),
        "man" => Some("man"),
        "md" => Some("markdown"),
        "mediawiki" => Some("mediawiki"),
        "muse" => Some("muse"),
        "odt" => Some("odt"),
        "opml" => Some("opml"),
        "org" => Some("org"),
        "rst" => Some("rst"),
        "rtf" => Some("rtf"),
        "tex" => Some("latex"),
        "textile" => Some("textile"),
        "txt" => Some("plain"),
        "typ" => Some("typst"),
        "xhtml" => Some("html4"),
        _ => None,
    }
}

fn pandoc_output_needs_standalone(ext: &str) -> bool {
    matches!(
        ext.to_ascii_lowercase().as_str(),
        "adoc" | "asciidoc" | "dbk" | "docx" | "epub" | "fb2" | "htm" | "html" | "odt" | "opml" | "rtf" | "tex" | "xhtml"
    )
}

fn libreoffice_format_arg(output_ext: &str) -> Option<&'static str> {
    match output_ext.to_ascii_lowercase().as_str() {
        "csv" => Some("csv"),
        "doc" => Some("doc"),
        "docx" => Some("docx"),
        "epub" => Some("epub"),
        "htm" | "html" => Some("html"),
        "odp" => Some("odp"),
        "ods" => Some("ods"),
        "odt" => Some("odt"),
        "pdf" => Some("pdf"),
        "ppt" => Some("ppt"),
        "pptx" => Some("pptx"),
        "rtf" => Some("rtf"),
        "txt" => Some("txt"),
        "xls" => Some("xls"),
        "xlsx" => Some("xlsx"),
        "xhtml" => Some("xhtml"),
        _ => None,
    }
}

fn path_extension(path: &Path) -> String {
    path.extension().and_then(|ext| ext.to_str()).unwrap_or_default().to_ascii_lowercase()
}

fn file_url(path: &Path) -> String {
    let path = path.to_string_lossy().replace('\\', "/");
    let mut encoded = String::new();

    for byte in path.bytes() {
        match byte {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'/' | b':' | b'-' | b'_' | b'.' | b'~' => encoded.push(byte as char),
            _ => encoded.push_str(&format!("%{:02X}", byte)),
        }
    }

    if encoded.starts_with('/') {
        format!("file://{}", encoded)
    } else {
        format!("file:///{}", encoded)
    }
}

async fn make_temp_dir() -> Result<PathBuf, String> {
    let temp_dir = std::env::temp_dir().join(Uuid::new_v4().to_string());
    fs::create_dir_all(&temp_dir).await.map_err(|e| e.to_string())?;
    Ok(temp_dir)
}

async fn cleanup_temp_dir(temp_dir: &Path) {
    if let Err(e) = fs::remove_dir_all(temp_dir).await {
        eprintln!("Failed to clean up temp directory '{}': {}", temp_dir.display(), e);
    }
}

async fn find_libreoffice_output(output_dir: &Path, input_path: &str, output_ext: &str) -> Result<PathBuf, String> {
    let input_stem = Path::new(input_path).file_stem().and_then(|stem| stem.to_str()).unwrap_or_default();
    let wanted_exts = libreoffice_output_extensions(output_ext);
    let mut entries = fs::read_dir(output_dir).await.map_err(|e| e.to_string())?;
    let mut fallback = None;

    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }

        let stem_matches = path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .is_some_and(|stem| stem.eq_ignore_ascii_case(input_stem));
        let ext_matches = path
            .extension()
            .and_then(|ext| ext.to_str())
            .is_some_and(|ext| wanted_exts.iter().any(|wanted| ext.eq_ignore_ascii_case(wanted)));

        if stem_matches && ext_matches {
            return Ok(path);
        }

        if fallback.is_none() && ext_matches {
            fallback = Some(path);
        }
    }

    fallback.ok_or_else(|| format!("LibreOffice did not produce a .{} output.", output_ext))
}

fn libreoffice_output_extensions(output_ext: &str) -> Vec<String> {
    match output_ext.to_ascii_lowercase().as_str() {
        "htm" => vec!["htm".to_string(), "html".to_string()],
        other => vec![other.to_string()],
    }
}

async fn move_generated_output(generated: &Path, output: &Path) -> Result<(), String> {
    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent).await.map_err(|e| e.to_string())?;
    }
    if fs::try_exists(output).await.map_err(|e| e.to_string())? {
        fs::remove_file(output).await.map_err(|e| e.to_string())?;
    }

    match fs::rename(generated, output).await {
        Ok(()) => Ok(()),
        Err(_) => {
            fs::copy(generated, output).await.map_err(|e| e.to_string())?;
            fs::remove_file(generated).await.map_err(|e| e.to_string())?;
            Ok(())
        }
    }
}

async fn collect_intermediate_pages(temp_dir: &Path, intermediate_ext: &str) -> Result<Vec<PathBuf>, String> {
    let mut entries = fs::read_dir(temp_dir).await.map_err(|e| e.to_string())?;
    let mut pages = Vec::new();

    while let Some(entry) = entries.next_entry().await.map_err(|e| e.to_string())? {
        let path = entry.path();
        let is_page = path
            .file_stem()
            .and_then(|stem| stem.to_str())
            .is_some_and(|stem| stem.starts_with("page-"))
            && path
                .extension()
                .and_then(|ext| ext.to_str())
                .is_some_and(|ext| ext.eq_ignore_ascii_case(intermediate_ext));

        if is_page {
            pages.push(path);
        }
    }

    pages.sort_by_key(|path| {
        path.file_stem()
            .and_then(|stem| stem.to_str())
            .and_then(|stem| stem.strip_prefix("page-"))
            .and_then(|index| index.parse::<usize>().ok())
            .unwrap_or(usize::MAX)
    });

    Ok(pages)
}

fn page_output_path(output: &Path, output_ext: &str, index: usize, total_pages: usize) -> PathBuf {
    if total_pages == 1 {
        return output.to_path_buf();
    }

    let stem = output.file_stem().unwrap_or_default().to_string_lossy();
    output.with_file_name(format!("{}-{}.{}", stem, index, output_ext))
}

async fn encode_document_page(
    handle: &AppHandle, original_path: &str, page: &Path, output: &Path, output_ext: &str, options: &IndexMap<String, String>,
    cancel_flag: &Arc<AtomicBool>, pack_ids: &[String],
) -> Result<(), String> {
    match output_ext.to_ascii_lowercase().as_str() {
        "heic" | "heif" => {
            let mut args = Vec::new();
            if let Some(quality) = options.get("-quality").filter(|value| !value.is_empty()) {
                args.extend(["-q".to_string(), quality.to_string()]);
            }
            args.extend(["-o".to_string(), output.to_string_lossy().to_string(), page.to_string_lossy().to_string()]);
            run_cli_command(handle, original_path, "heif-enc", &args, cancel_flag, pack_ids).await
        }
        "jxr" | "wdp" => {
            let mut args = vec![
                "-i".to_string(),
                page.to_string_lossy().to_string(),
                "-o".to_string(),
                output.to_string_lossy().to_string(),
            ];
            if let Some(quality) = jxr_quality_arg(options) {
                args.extend(["-q".to_string(), quality]);
            }
            run_cli_command(handle, original_path, "JXREncApp", &args, cancel_flag, pack_ids).await
        }
        _ => Err(format!("Unsupported document page encoder output: {}", output_ext)),
    }
}

fn jxr_quality_arg(options: &IndexMap<String, String>) -> Option<String> {
    let quality = options.get("-quality")?.parse::<f64>().ok()?;
    if quality >= 100.0 {
        return None;
    }

    Some(
        format!("{:.4}", (quality / 100.0).clamp(0.0, 0.9999))
            .trim_end_matches('0')
            .trim_end_matches('.')
            .to_string(),
    )
}

fn has_option(options: &IndexMap<String, String>, arg: &str) -> bool {
    options.keys().any(|key| key.split_whitespace().any(|part| part == arg))
}

fn append_option(args: &mut Vec<String>, key: &str, value: &str) {
    for part in key.split_whitespace() {
        args.push(part.trim_matches('"').trim_matches('\'').to_string());
    }
    if !value.is_empty() {
        for part in value.split_whitespace() {
            args.push(part.trim_matches('"').trim_matches('\'').to_string());
        }
    }
}

fn append_options_except(args: &mut Vec<String>, options: &IndexMap<String, String>, excluded_args: &[&str]) {
    for (key, value) in options {
        if key.split_whitespace().any(|part| excluded_args.contains(&part)) {
            continue;
        }
        append_option(args, key, value);
    }
}
