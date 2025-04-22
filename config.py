import gettext
import json
import locale
import os
import platform
import sys

import polib
from PyQt6.QtWidgets import QMessageBox


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        full_path = os.path.join(sys._MEIPASS, relative_path)
    else:
        full_path = os.path.join(os.path.abspath("."), relative_path)

    if not os.path.exists(full_path):
        resource_name = os.path.basename(relative_path)
        formatted_message = tr("Couldn't find {missing_resource}. Please try reinstalling the application.").format(missing_resource=resource_name)
        raise FileNotFoundError(formatted_message)

    return full_path


def find_dependency_path(possible_paths):
    for path in possible_paths:
        if os.path.exists(path):
            return os.path.normpath(path)
    return ""


def apply_settings(settings):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=4)


def load_settings():
    locale.setlocale(locale.LC_ALL, '')
    system_locale = locale.getlocale()[0]
    locale_mapping = {
        "English_United States": "en_US",
        "Chinese (Simplified)_China": "zh_CN",
        "Chinese (Simplified)_Hong Kong SAR": "zh_CN",
        "Chinese (Simplified)_Macao SAR": "zh_CN",
        "Chinese (Simplified)_Singapore": "zh_CN",
        "Chinese (Traditional)_Hong Kong SAR": "zh_TW",
        "Chinese (Traditional)_Macao SAR": "zh_TW",
        "Chinese (Traditional)_Taiwan": "zh_TW"
    }
    app_locale = locale_mapping.get(system_locale, 'en_US')

    default_settings = {
        "language": app_locale,
        "theme": "black",
        "pandocPath": find_dependency_path([
            "C:/Program Files/Pandoc",
            os.path.join(os.environ.get("LOCALAPPDATA", "/"), "Pandoc"),
            "/usr/local/bin/pandoc",
        ]),
        "calibrePath": find_dependency_path([
            "C:/Program Files/Calibre2",
            "/Applications/calibre.app",
        ]),
    }

    try:
        with open(SETTINGS_FILE, "r") as f:
            settings = json.load(f)
    except Exception as e:
        print("Error loading settings json" + str(e))
        settings = default_settings

    for key, value in default_settings.items():
        settings.setdefault(key, value)

    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=4)

    return settings


def get_translator():
    if not hasattr(sys, 'frozen'):
        for root, dirs, files in os.walk(resource_path("locale/")):
            for file in files:
                if file.endswith(".po"):
                    po = polib.pofile(os.path.join(root, file))
                    po.save_as_mofile(os.path.join(
                        root, os.path.splitext(file)[0] + ".mo"))

    lang = settings["language"]
    gettext.bindtextdomain("Universal Converter",
                           resource_path("locale/"))
    gettext.textdomain("Universal Converter")
    lang = gettext.translation(
        "Universal Converter", resource_path("locale/"), languages=[lang])
    lang.install()
    return lang.gettext


current_os = platform.system()
if current_os == 'Windows':
    settings_base_path = os.environ["APPDATA"]
elif current_os == 'Darwin':
    settings_base_path = os.path.expanduser("~/Library/Application Support/")
setting_path = os.path.join(settings_base_path, "UC Settings")
os.makedirs(setting_path, exist_ok=True)

SETTINGS_FILE = os.path.join(setting_path, "settings.json")

settings = load_settings()
tr = get_translator()

if settings["theme"] == "black":
    dropDownArrow_path = resource_path("assets/dropdown-white.png").replace("\\", "/")
    spinboxUpArrow_path = resource_path("assets/spinbox-up-white.png").replace("\\", "/")
    spinboxDownArrow_path = resource_path("assets/spinbox-down-white.png").replace("\\", "/")
elif settings["theme"] == "white":
    dropDownArrow_path = resource_path("assets/dropdown-black.png").replace("\\", "/")
    spinboxUpArrow_path = resource_path("assets/spinbox-up-black.png").replace("\\", "/")
    spinboxDownArrow_path = resource_path("assets/spinbox-down-black.png").replace("\\", "/")
upArrow_path = resource_path("assets/up.png").replace("\\", "/")
downArrow_path = resource_path("assets/down.png").replace("\\", "/")
leftArrow_path = resource_path("assets/left.png").replace("\\", "/")
rightArrow_path = resource_path("assets/right.png").replace("\\", "/")
eyeDropper_path = resource_path("assets/eye-dropper.svg")
rocket_path = resource_path("assets/rocket.svg")
ffmpeg_path = resource_path("dependency/ffmpeg.exe")
imageMagick_path = resource_path("dependency/imagemagick/magick.exe")
ncm_path = resource_path("dependency/ncmdump.exe")
exiftool_path = resource_path("dependency/exiftool.exe")
gs_directory = resource_path("dependency/ghostscript")
jxrlib_directory = resource_path("dependency/jxrlib")
os.environ["PATH"] = \
    gs_directory + os.pathsep + \
    jxrlib_directory + os.pathsep + \
    os.environ.get("PATH", "")
