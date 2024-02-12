import os
import sys
import json
import gettext
import polib
import subprocess
import pikepdf
import locale

ncm_input = [".ncm"]

ncm_output = [".mp3"]

pdf_output = [".pdf", ".jpeg"]

SETTINGS_FILE = os.path.join(
    os.environ["APPDATA"], "Universal Converter Settings/", "settings.json")

setting_path = os.path.join(
    os.environ["APPDATA"], "Universal Converter Settings/")
if not os.path.exists(setting_path):
    os.makedirs(setting_path)


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


def apply_settings(settings):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f)


def load_settings():
    try:
        with open(SETTINGS_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        system_locale = locale.getlocale()[0]
        locale_mapping = {
            "English_United States": "en_US",
            "Chinese (Simplified)_China": "zh_CN",
            "Chinese (Simplified)_Hong Kong SAR": "zh_CN",
            "Chinese (Simplified)_Macao SAR": "zh_CN"
        }
        app_locale = locale_mapping.get(system_locale, 'en_US')

        # Default settings
        default_settings = {
            "language": app_locale,
            "theme": "dark"
        }
        with open(SETTINGS_FILE, "w") as f:
            json.dump(default_settings, f)
        return default_settings


def get_translator():
    # compile .po files to .mo files
    for root, dirs, files in os.walk(resource_path("locale/")):
        for file in files:
            if file.endswith(".po"):
                po = polib.pofile(os.path.join(root, file))
                po.save_as_mofile(os.path.join(
                    root, os.path.splitext(file)[0] + ".mo"))

    # read settings and apply languages
    settings = load_settings()
    lang = settings["language"]
    gettext.bindtextdomain("Universal Converter", resource_path("locale/"))
    gettext.textdomain("Universal Converter")
    lang = gettext.translation(
        "Universal Converter", resource_path("locale/"), languages=[lang])
    lang.install()
    return lang.gettext


def ncm_convert(input_file):
    ncm_path = resource_path("dependency/ncmdump.exe")
    command = [ncm_path, input_file]
    subprocess.run(command, creationflags=subprocess.CREATE_NO_WINDOW)


def pdf_convert(input_paths, out_ext, combine, user_password, owner_password, access, extract, annotation, assembly, form, other, p_lower, p_higher, metadata, dpi, quality, optimize):
    _ = get_translator()

    if out_ext == ".pdf":
        output_pdfs = []
        pdf_tag = ".pdf"

        # if no options were selected, raise exception
        if user_password == "" and owner_password == "" and (access and extract and annotation and assembly and form and other and p_lower and p_higher) == True and (metadata or combine) == False:
            raise RuntimeError(_("No operations performed"))

        permissions = pikepdf.Permissions(
            accessibility=access,
            extract=extract,
            modify_annotation=annotation,
            modify_assembly=assembly,
            modify_form=form,
            modify_other=other,
            print_lowres=p_lower,
            print_highres=p_higher
        )

        if combine:
            output_pdf = pikepdf.Pdf.new()
            for pdf_file in input_paths:
                with pikepdf.open(pdf_file) as file:
                    for page in file.pages:
                        output_pdf.pages.append(page)
            combined_file_path, _ = os.path.splitext(input_paths[0])
            output_pdfs.append([output_pdf, combined_file_path + "_combined"])

        else:
            for pdf_file in input_paths:
                pdf = pikepdf.Pdf.open(pdf_file)
                pdf_path = os.path.splitext(pdf_file)[0]
                output_pdfs.append([pdf, pdf_path])

        if (user_password != "" or owner_password != "") or (access and extract and annotation and assembly and form and other and p_lower and p_higher) == False or metadata == True:
            pdf_tag = "_encrypted" + pdf_tag
            for pdf in output_pdfs:
                pdf[0].save(pdf[1] + pdf_tag, encryption=pikepdf.Encryption(
                    user=user_password, owner=owner_password, allow=permissions, metadata=metadata))

        else:
            for pdf in output_pdfs:
                pdf[0].save(pdf[1] + pdf_tag)

    elif out_ext == ".jpeg":
        result = []
        root_directory = os.path.split(input_paths[0])[0]
        root_directory += "/pdf_to_jpeg_converted/"
        if not os.path.exists(root_directory):
            os.makedirs(root_directory)

        for pdf in input_paths:
            pdf_name = os.path.split(pdf)[1]
            os.makedirs(root_directory +
                        os.path.splitext(pdf_name)[0], exist_ok=True)

            if optimize:
                optimize = "y"
            else:
                optimize = "n"
            if not quality:
                quality = "75"
            command = [resource_path("dependency/poppler/pdftoppm.exe")]
            if dpi:
                command += ["-r", dpi]  # max -r value 3089
            command += ["-jpeg"]
            command += ["-jpegopt", f"quality={quality},optimize={optimize}"]
            command += [pdf,
                        f"{root_directory + os.path.splitext(pdf_name)[0]}/{pdf_name[:-4]}"]

            process = subprocess.Popen(
                command, stderr=subprocess.PIPE, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
            result.append(process.communicate()[1])
        return result
