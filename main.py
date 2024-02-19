import gettext
import json
import locale
import os
import sys
import subprocess
from PIL import Image
import tempfile

import polib
from PyQt6.QtWidgets import QApplication, QDialog, QMessageBox, QMenu, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QPushButton, QComboBox, QLabel, QFileDialog, QListWidget
from PyQt6.QtCore import Qt, QMimeData, QEvent
from PyQt6.QtGui import QIcon, QDragEnterEvent, QDropEvent, QPalette, QColor, QPainter, QFontDatabase, QFont, QAction
import threading
import math
import subprocess

import style_sheet
import widgets


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        full_path = os.path.join(sys._MEIPASS, relative_path)
    else:
        full_path = os.path.join(os.path.abspath("."), relative_path)

    if not os.path.exists(full_path):
        resource_name = os.path.basename(relative_path)
        formatted_message = _("Couldn't find {missing_resource}. Please try reinstalling the application.").format(
            missing_resource=resource_name)
        QMessageBox.critical(
            None, _("Missing resource file"), formatted_message)
        sys.exit(1)

    return full_path


def apply_settings(settings):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f)


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
        "theme": "dark",
    }

    try:
        with open(SETTINGS_FILE, "r") as f:
            settings = json.load(f)
    except FileNotFoundError:
        settings = default_settings
    else:
        for key, value in default_settings.items():
            settings.setdefault(key, value)

    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f)

    return settings


def get_translator():
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


SETTINGS_FILE = os.path.join(
    os.environ["APPDATA"], "UC Settings/", "settings.json")

setting_path = os.path.join(
    os.environ["APPDATA"], "UC Settings/")
if not os.path.exists(setting_path):
    os.makedirs(setting_path)

settings = load_settings()
_ = get_translator()

language_options = {
    "English (US)": "en_US",
    "简体中文": "zh_CN",
    # "繁體中文": "zh_TW"
}

theme_options = {
    _("Dark"): "dark",
    _("Light"): "light"
}


class FileSelection(QListWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.parent = parent
        self.setMinimumSize(400, 300)
        self.setAcceptDrops(True)
        self.setDragDropMode(QListWidget.DragDropMode.InternalMove)
        self.placeholderText = _("Drag and drop or click to select files")
        self.selected_files = []  # list of input file full paths
        self.file_type = ""
        color_set = {
            "dark": {
                "base_color": "#2a2a2a",
                "drag_color": "#3f3f3f",
                "text_color": "#ffffff"
            },
            "light": {
                "base_color": "#ffffff",
                "drag_color": "#e0e0e0",
                "text_color": "#000000"
            }
        }
        self.baseColor = color_set[settings["theme"]]["base_color"]
        self.dragColor = color_set[settings["theme"]]["drag_color"]
        self.textColor = color_set[settings["theme"]]["text_color"]
        self.updateStyleSheet(self.baseColor)

    def updateStyleSheet(self, background_color):
        self.setStyleSheet(f"""
            QListWidget {{
                border: 2px dotted #a8a8a8;
                background-color: {background_color};
                color: {self.textColor};
            }}
        """)

    def dragEnterEvent(self, event: QDragEnterEvent):
        if event.mimeData().hasUrls():
            self.updateStyleSheet(self.dragColor)
            event.acceptProposedAction()

    def dragLeaveEvent(self, event: QEvent):
        self.updateStyleSheet(self.baseColor)

    def dropEvent(self, event: QDropEvent):
        self.updateStyleSheet(self.baseColor)
        files = [url.toLocalFile() for url in event.mimeData().urls()]
        self.displayFiles(files)

    def paintEvent(self, event):
        super().paintEvent(event)
        if self.count() == 0:
            cur_file_type = ""
            painter = QPainter(self.viewport())
            painter.setPen(QColor('gray'))
            painter.drawText(
                self.rect(), Qt.AlignmentFlag.AlignCenter, self.placeholderText)

    def mousePressEvent(self, event):
        if not self.itemAt(event.pos()):
            self.selectFiles()
        super().mousePressEvent(event)

    def selectFiles(self):
        dialog = QFileDialog(self)
        dialog.setFileMode(QFileDialog.FileMode.ExistingFiles)
        if dialog.exec():
            fileNames = dialog.selectedFiles()
            self.displayFiles(fileNames)

    def clearFileList(self):
        self.selected_files = []
        self.file_type = ""
        self.clear()

    def displayFiles(self, files):
        error_messages = set()

        for file in files:
            cur_file_type = ""
            if file in self.selected_files:
                continue

            file_ext = os.path.splitext(file)[1].lower()
            for type, list in widgets.file_types.items():
                if file_ext in list:
                    cur_file_type = type
                    break

            if not self.file_type and cur_file_type:
                # if haven't determined file type, set it and output formats
                self.file_type = cur_file_type
                self.selected_files.append(file)
                self.addItem(os.path.basename(file))
                self.parent.formatCombo.clear()
                self.parent.formatCombo.addItem(_("Select Format"))
                self.parent.formatCombo.addItems(
                    widgets.file_types[self.file_type])
            elif cur_file_type == "":
                error_messages.add(
                    _("Selected files contain unsupported formats."))
            elif cur_file_type != self.file_type:
                error_messages.add(
                    _("Selected files should be in the same type."))
            else:
                self.selected_files.append(file)
                self.addItem(os.path.basename(file))

        if error_messages:
            QMessageBox.critical(
                self, _("Error"), "\n".join(error_messages))


class SettingsDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle(_("Settings"))
        self.setWindowIcon(QIcon(resource_path("assets/setting.ico")))
        settingsLayout = QVBoxLayout()
        settingsLayout.setSpacing(15)
        self.setLayout(settingsLayout)
        self.setMinimumWidth(370)

        settingsWidgetsLayout = QVBoxLayout()
        settingsWidgetsLayout.setContentsMargins(50, 30, 50, 20)
        settingsLayout.addLayout(settingsWidgetsLayout)

        # Theme selection
        themeLayout = QVBoxLayout()
        themeLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(themeLayout)
        themeLayout.addWidget(QLabel(_("Theme:")))
        self.themeCombo = QComboBox()
        self.themeCombo.addItems(theme_options.keys())
        self.themeCombo.setCurrentText(
            self.find_settings_key(settings["theme"], theme_options))
        themeLayout.addWidget(self.themeCombo)

        # Language selection
        languageLayout = QVBoxLayout()
        languageLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(languageLayout)
        languageLayout.addWidget(QLabel(_("Language:")))
        self.languageCombo = QComboBox()
        self.languageCombo.addItems(language_options.keys())
        self.languageCombo.setCurrentText(
            self.find_settings_key(settings["language"], language_options))
        languageLayout.addWidget(self.languageCombo)

        # Apply button
        applyButtonLayout = QHBoxLayout()
        applyButtonLayout.setContentsMargins(0, 0, 10, 10)
        applyButtonLayout.addStretch(1)
        settingsLayout.addLayout(applyButtonLayout)
        self.applyButton = QPushButton(_("Apply"))
        self.applyButton.setFixedWidth(100)
        self.applyButton.clicked.connect(self.apply_settings_page)
        applyButtonLayout.addWidget(self.applyButton)

    def find_settings_key(self, value, dict):
        return next(key for key, val in dict.items() if val == value)

    def apply_settings_page(self):
        settings["theme"] = theme_options[self.themeCombo.currentText()]
        settings["language"] = language_options[self.languageCombo.currentText()]
        apply_settings(settings)
        QMessageBox.information(self, _("Attention"), _(
            "Please restart the application to apply settings"))


class UniversalConverter(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Universal Converter")
        self.setWindowIcon(QIcon(resource_path("assets/logo.ico")))

        # Version, user prompts, and links
        self.appVersion = "1.0.0"
        self.githubLink = "https://github.com/dyang886/Universal-Converter"
        self.updateLink = "https://api.github.com/repos/dyang886/Universal-Converter/releases/latest"

        # Paths and variable management

        # Widget fonts
        self.font_config = {
            "en_US": "assets/NotoSans-Regular.ttf",
            "zh_CN": "assets/NotoSansSC-Regular.ttf",
            "zh_TW": "assets/NotoSansTC-Regular.ttf"
        }

        # Window references
        self.settings_window = None
        self.about_window = None

        # Main widget group
        centralWidget = QWidget(self)
        self.setCentralWidget(centralWidget)
        mainLayout = QHBoxLayout(centralWidget)
        mainLayout.setContentsMargins(20, 10, 20, 20)
        centralWidget.setLayout(mainLayout)
        self.init_settings()

        # Menu Setup
        menuFont = self.font()
        menuFont.setPointSize(9)
        menu = self.menuBar()
        menu.setFont(menuFont)

        optionMenu = menu.addMenu(_("Options"))
        settingsAction = QAction(_("Settings"), self)
        settingsAction.setFont(menuFont)
        settingsAction.triggered.connect(self.open_settings)
        optionMenu.addAction(settingsAction)

        # ===========================================================================
        # LEFT: file selection and output format choices
        # ===========================================================================
        leftWidget = QWidget()
        leftLayout = QVBoxLayout(leftWidget)
        leftLayout.setSpacing(15)
        leftWidget.setLayout(leftLayout)
        mainLayout.addWidget(leftWidget)

        # Upper buttons
        buttonsLayout = QHBoxLayout()
        buttonsLayout.setSpacing(10)

        selectButton = QPushButton(_("Select Files"))
        selectButton.clicked.connect(lambda: self.fileList.selectFiles())
        buttonsLayout.addWidget(selectButton)

        clearButton = QPushButton(_("Clear Files"))
        clearButton.clicked.connect(lambda: self.fileList.clearFileList())
        buttonsLayout.addWidget(clearButton)

        metadataButton = QPushButton(_("File Metadata"))
        metadataButton.clicked.connect(self.init_settings)
        buttonsLayout.addWidget(metadataButton)

        leftLayout.addLayout(buttonsLayout)

        # File selection window
        self.fileList = FileSelection(self)
        self.fileList.setFont(self.font())
        leftLayout.addWidget(self.fileList)

        # Output format selection
        formatLayout = QHBoxLayout()

        formatLayout.addWidget(QLabel(_("Output Format:")))
        self.formatCombo = QComboBox()
        self.formatCombo.addItem(_("Select Format"))
        self.formatCombo.currentIndexChanged.connect(
            self.onOutputFormatChanged)
        formatLayout.addWidget(self.formatCombo)
        formatLayout.setStretchFactor(self.formatCombo, 1)

        leftLayout.addLayout(formatLayout)

        # Convert button
        convertButton = QPushButton(_("Convert"))
        # self.convertButton.clicked.connect(convertFiles)
        leftLayout.addWidget(convertButton)

        # ===========================================================================
        # RIGHT: format specific options
        # ===========================================================================
        self.rightWidget = QWidget()
        self.rightWidget.setMinimumWidth(500)
        self.rightLayout = QVBoxLayout(self.rightWidget)
        self.rightLayout.setSpacing(15)
        self.rightWidget.setLayout(self.rightLayout)
        mainLayout.addWidget(self.rightWidget)
        self.rightWidget.hide()

        # Two columns for placing video and audio codecs
        codecLayout = QGridLayout()
        self.rightLayout.addLayout(codecLayout)

        # Video layout
        self.videoLayout = QVBoxLayout()
        self.videoLayout.setSpacing(15)
        codecLayout.addLayout(self.videoLayout, 0, 0)

        # Audio layout
        self.audioLayout = QVBoxLayout()
        self.audioLayout.setSpacing(15)
        codecLayout.addLayout(self.audioLayout, 0, 1)

        # Video codec selection
        v_codecLayout = QVBoxLayout()
        v_codecLayout.setSpacing(2)
        v_codecLayout.setAlignment(Qt.AlignmentFlag.AlignVCenter)
        self.videoLayout.addLayout(v_codecLayout)
        v_codecLayout.addWidget(QLabel(_("Video Codec:")))
        v_codecLayout.addWidget(QComboBox())

        # Audio codec selection
        a_codecLayout = QVBoxLayout()
        a_codecLayout.setSpacing(2)
        a_codecLayout.setAlignment(Qt.AlignmentFlag.AlignVCenter)
        self.audioLayout.addLayout(a_codecLayout)
        a_codecLayout.addWidget(QLabel(_("Audio Codec:")))
        a_codecLayout.addWidget(QComboBox())

    def onOutputFormatChanged(self):
        cur_file_type = self.fileList.file_type
        self.rightWidget.show()

        if cur_file_type == "video":
            pass
        elif cur_file_type == "audio":
            pass
        elif cur_file_type == "image":
            pass
        elif cur_file_type == "other":
            pass

    def init_settings(self):
        # Theme settings
        if settings["theme"] == "dark":
            style = style_sheet.dark
        elif settings["theme"] == "light":
            style = style_sheet.light

        # Language settings
        fontId = QFontDatabase.addApplicationFont(
            self.font_config[settings["language"]])
        fontFamilies = QFontDatabase.applicationFontFamilies(fontId)
        customFont = QFont(fontFamilies[0], 10)
        self.setFont(customFont)

        # ensure to set stylesheet after font settings
        self.setStyleSheet(style)

    def applyFontRecursively(self, widget, font):
        widget.setFont(font)
        for child in widget.findChildren(QWidget):
            self.applyFontRecursively(child, font)

    def open_settings(self):
        if self.settings_window is not None and self.settings_window.isVisible():
            self.settings_window.raise_()
            self.settings_window.activateWindow()
        else:
            self.settings_window = SettingsDialog(self)
            self.applyFontRecursively(self.settings_window, self.font())
            self.settings_window.show()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    mainWin = UniversalConverter()
    mainWin.show()
    sys.exit(app.exec())
