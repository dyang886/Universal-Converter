import gettext
import json
import locale
import os
import platform
import re
import sys
import subprocess
import tempfile

import polib
from PyQt6.QtWidgets import QApplication, QDialog, QColorDialog, QMessageBox, QTextEdit, QTabWidget, QListWidgetItem, QLineEdit, QCheckBox, QSlider, QLayout, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QPushButton, QComboBox, QLabel, QFileDialog, QListWidget
from PyQt6.QtCore import Qt, QEvent, QThread, pyqtSignal, QByteArray, QSize
from PyQt6.QtGui import QIcon, QDragEnterEvent, QDropEvent, QColor, QPainter, QFontDatabase, QFont, QAction, QTextCursor, QPixmap, QCursor
import subprocess

import style_sheet
import widgets
import other


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


def find_dependency_path(possible_paths):
    for path in possible_paths:
        if os.path.exists(path):
            return os.path.normpath(path)
    return ""


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
        "pandocPath": find_dependency_path([
            "C:/Program Files/Pandoc",
            os.path.join(os.environ.get("LOCALAPPDATA"), "Pandoc")
        ]),
        "calibrePath": find_dependency_path([
            "C:/Program Files/Calibre2"
        ]),
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

SETTINGS_FILE = os.path.join(
    settings_base_path, "UC Settings", "settings.json")
setting_path = os.path.join(settings_base_path, "UC Settings")

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

externalTools = {
    "None": "",
    "Pandoc": "pandoc",
    "Calibre": "calibre",
}


class FileSelection(QListWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.parent = parent
        self.setMinimumSize(400, 400)
        self.setAcceptDrops(True)
        self.setDragDropMode(QListWidget.DragDropMode.InternalMove)
        self.placeholderText = _("Drag and drop or click to select files")
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
        else:
            super().dragEnterEvent(event)

    def dragLeaveEvent(self, event: QEvent):
        self.updateStyleSheet(self.baseColor)
        super().dragLeaveEvent(event)

    def dropEvent(self, event: QDropEvent):
        if event.mimeData().hasUrls():
            self.updateStyleSheet(self.baseColor)
            files = [url.toLocalFile() for url in event.mimeData().urls()]
            self.displayFiles(files)
            event.acceptProposedAction()
        else:
            super().dropEvent(event)

    def paintEvent(self, event):
        super().paintEvent(event)
        if self.count() == 0:
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
        self.file_type = ""
        self.clear()
        self.parent.formatCombo.clear()
        self.parent.formatCombo.addItem(self.parent.selectFormatText)

    def getFilePaths(self):
        return [self.item(i).fullPath for i in range(self.count())]

    def displayFiles(self, files):
        error_messages = set()

        for file in files:
            cur_file_type = ""
            external_tools = [
                value for value in externalTools.values() if value]
            file_ext = os.path.splitext(file)[1].lower()
            currentFilePaths = [
                self.item(i).fullPath for i in range(self.count())]

            if file in currentFilePaths:
                continue

            if self.file_type in external_tools:
                if file_ext in widgets.external_file_types[self.file_type]["input"]:
                    cur_file_type = self.file_type
            else:
                for type, list in widgets.detected_file_types.items():
                    if file_ext in list:
                        cur_file_type = type
                        break

            if not self.file_type and cur_file_type:
                # if haven't determined file type, set file type and output formats
                self.file_type = cur_file_type
                fileName = os.path.basename(file)
                self.addItem(FileListItem(fileName, file))
                self.parent.formatCombo.clear()
                self.parent.formatCombo.addItem(self.parent.selectFormatText)
                self.parent.formatCombo.addItems(
                    widgets.displayed_file_types[self.file_type])
            elif cur_file_type == "":
                error_messages.add(
                    _("Selected files contain unsupported formats."))
            elif cur_file_type != self.file_type:
                error_messages.add(
                    _("Selected files should be in the same type."))
            else:
                fileName = os.path.basename(file)
                self.addItem(FileListItem(fileName, file))

        if error_messages:
            QMessageBox.critical(
                self, _("Error"), "\n".join(error_messages))


class ColorPicker:
    def __init__(self, lineEdit, parent=None):
        self.lineEdit = lineEdit
        self.parent = parent
        self.colorDialog = QColorDialog(self.parent)

    def openDialog(self):
        initial_color = QColor(self.lineEdit.text())
        if not initial_color.isValid():
            initial_color = QColor(Qt.GlobalColor.white)

        self.colorDialog.setCurrentColor(initial_color)
        self.changeLuminancePickerBackground()

        if self.colorDialog.exec():
            selected_color = self.colorDialog.currentColor()
            self.lineEdit.setText(selected_color.name())

    def changeLuminancePickerBackground(self):
        for child in self.colorDialog.findChildren(QWidget):
            if "QColorLuminancePicker" in child.metaObject().className():
                child.setStyleSheet("QWidget { background-color: #bababa; }")
                break


class CustomButton(QPushButton):
    def __init__(self, text, parent=None):
        super(CustomButton, self).__init__(text, parent)

    def setEnabled(self, enabled):
        super().setEnabled(enabled)
        if enabled:
            self.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        else:
            self.setCursor(QCursor(Qt.CursorShape.ForbiddenCursor))

    def enterEvent(self, event):
        if not self.isEnabled():
            QApplication.setOverrideCursor(
                QCursor(Qt.CursorShape.ForbiddenCursor))
        super().enterEvent(event)

    def leaveEvent(self, event):
        QApplication.restoreOverrideCursor()
        super().leaveEvent(event)


class FileListItem(QListWidgetItem):
    def __init__(self, text, fullPath):
        super().__init__(text)
        self.fullPath = fullPath


class CustomVBoxLayout(QVBoxLayout):
    def __init__(self):
        super().__init__()
        self.configName = None


class SubprocessThread(QThread):
    output_signal = pyqtSignal(str, int)
    finished_signal = pyqtSignal(int)

    def __init__(self, commands):
        super().__init__()
        self.commands = commands

    def run(self):
        if not self.commands:
            self.finished_signal.emit(2)
            return

        total_files = len(self.commands)
        for index, command in enumerate(self.commands, start=1):
            message = _("Processing {index} of {total_files} files...").format(
                index=index, total_files=total_files)
            formatted_message = f"""
                <p style='color: #4cc9f0;'>
                    ===================================================<br>
                    {message}<br>
                    ===================================================
                </p>
            """
            if index != 1:
                self.output_signal.emit("\n", 0)
            self.output_signal.emit(formatted_message, 1)
            self.output_signal.emit("\n\n", 0)

            print(f"Command {index}/{total_files}: {command}\n")

            process = subprocess.Popen(
                command, stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT, text=True,
                creationflags=subprocess.CREATE_NO_WINDOW,
                encoding="utf-8"
            )

            while True:
                line = process.stdout.readline()
                if not line:
                    break
                self.output_signal.emit(line, 0)

            process.stdout.close()
            process.wait()

        self.finished_signal.emit(0)


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

        # Pandoc path
        pandocLayout = QVBoxLayout()
        pandocLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(pandocLayout)
        pandocLayout.addWidget(QLabel(_("Pandoc Path:")))
        pandocPathLayout = QHBoxLayout()
        pandocPathLayout.setSpacing(5)
        pandocLayout.addLayout(pandocPathLayout)
        self.pandocLineEdit = QLineEdit()
        self.pandocLineEdit.setText(settings["pandocPath"])
        pandocPathLayout.addWidget(self.pandocLineEdit)
        pandocPathButton = QPushButton("...")
        pandocPathButton.clicked.connect(self.selectPandocPath)
        pandocPathLayout.addWidget(pandocPathButton)

        # Calibre path
        calibreLayout = QVBoxLayout()
        calibreLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(calibreLayout)
        calibreLayout.addWidget(QLabel(_("Calibre Path:")))
        calibrePathLayout = QHBoxLayout()
        calibrePathLayout.setSpacing(5)
        calibreLayout.addLayout(calibrePathLayout)
        self.calibreLineEdit = QLineEdit()
        self.calibreLineEdit.setText(settings["calibrePath"])
        calibrePathLayout.addWidget(self.calibreLineEdit)
        calibrePathButton = QPushButton("...")
        calibrePathButton.clicked.connect(self.selectCalibrePath)
        calibrePathLayout.addWidget(calibrePathButton)

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

    def selectPandocPath(self):
        initialPath = self.pandocLineEdit.text() or os.path.expanduser("~")
        directory = QFileDialog.getExistingDirectory(
            self, _("Select Pandoc Installation Path"), initialPath)
        if directory:
            self.pandocLineEdit.setText(os.path.normpath(directory))

    def selectCalibrePath(self):
        initialPath = self.calibreLineEdit.text() or os.path.expanduser("~")
        directory = QFileDialog.getExistingDirectory(
            self, _("Select Calibre Installation Path"), initialPath)
        if directory:
            self.calibreLineEdit.setText(os.path.normpath(directory))

    def apply_settings_page(self):
        settings["theme"] = theme_options[self.themeCombo.currentText()]
        settings["language"] = language_options[self.languageCombo.currentText()]
        settings["pandocPath"] = self.pandocLineEdit.text()
        settings["calibrePath"] = self.calibreLineEdit.text()
        apply_settings(settings)
        QMessageBox.information(self, _("Attention"), _(
            "Please restart the application to apply theme and language settings."))


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
        self.selectFormatText = _("Select Output Format")
        self.selectionText = ""
        self.temp_dir = os.path.join(tempfile.gettempdir(), "UCTemp")

        self.dropDownArrow_path = resource_path(
            "assets/dropdown.png").replace("\\", "/")
        self.spinboxUpArrow_path = resource_path(
            "assets/spinbox-up.png").replace("\\", "/")
        self.spinboxDownArrow_path = resource_path(
            "assets/spinbox-down.png").replace("\\", "/")
        self.eyeDropper_path = resource_path("assets/eye-dropper.svg")
        self.rocket_path = resource_path("assets/rocket.svg")

        self.ffmpeg_path = resource_path("dependency/ffmpeg.exe")
        self.imageMagick_path = resource_path(
            "dependency/imagemagick/magick.exe")
        self.ncm_path = resource_path("dependency/ncmdump.exe")
        self.exiftool_path = resource_path("dependency/exiftool.exe")
        self.updatePandocPath()
        self.updateCalibrePath()

        gs_directory = resource_path("dependency/ghostscript")
        jxrlib_directory = resource_path("dependency/jxrlib")
        os.environ["PATH"] = \
            gs_directory + os.pathsep + \
            jxrlib_directory + os.pathsep + \
            os.environ.get("PATH", "")

        # Window references
        self.settings_window = None
        self.about_window = None

        # Main widget group
        centralWidget = QWidget(self)
        self.setCentralWidget(centralWidget)
        mainLayout = QHBoxLayout(centralWidget)
        mainLayout.setContentsMargins(30, 20, 30, 30)
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
        leftLayout.setContentsMargins(0, 0, 20, 0)
        leftLayout.setSpacing(15)
        leftWidget.setLayout(leftLayout)
        mainLayout.addWidget(leftWidget)

        # Upper buttons
        buttonsLayout = QHBoxLayout()
        buttonsLayout.setSpacing(10)

        selectButton = QPushButton(_("Select Files"))
        selectButton.clicked.connect(lambda: self.fileList.selectFiles())
        selectButton.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        buttonsLayout.addWidget(selectButton)

        clearButton = QPushButton(_("Clear Files"))
        clearButton.clicked.connect(lambda: self.fileList.clearFileList())
        clearButton.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        buttonsLayout.addWidget(clearButton)

        self.metadataButton = CustomButton(_("File Metadata"))
        self.metadataButton.clicked.connect(self.extractMetadata)
        self.metadataButton.setCursor(
            QCursor(Qt.CursorShape.PointingHandCursor))
        buttonsLayout.addWidget(self.metadataButton)

        leftLayout.addLayout(buttonsLayout)

        # External tool selection
        exToolLayout = QHBoxLayout()

        exToolLayout.addWidget(QLabel(_("Select External Tool:")))
        self.exToolCombo = QComboBox()
        self.exToolCombo.addItems(externalTools.keys())
        self.exToolCombo.currentIndexChanged.connect(
            self.onExternalToolsChange)
        exToolLayout.addWidget(self.exToolCombo)
        exToolLayout.setStretchFactor(self.exToolCombo, 1)

        leftLayout.addLayout(exToolLayout)

        # File selection window
        self.fileList = FileSelection(self)
        leftLayout.addWidget(self.fileList)

        # Output format selection
        formatLayout = QHBoxLayout()

        formatLayout.addWidget(QLabel(_("Output Format:")))
        self.formatCombo = QComboBox()
        self.formatCombo.addItem(self.selectFormatText)
        self.formatCombo.currentIndexChanged.connect(
            self.onOutputFormatChange)
        formatLayout.addWidget(self.formatCombo)
        formatLayout.setStretchFactor(self.formatCombo, 1)

        leftLayout.addLayout(formatLayout)

        # Convert button
        self.convertButton = CustomButton(" " + _("Convert"))
        self.convertButton.setIcon(self.setFAIcon(self.rocket_path))
        self.convertButton.setIconSize(QSize(15, 15))
        self.convertButton.setCursor(
            QCursor(Qt.CursorShape.PointingHandCursor))
        self.convertButton.clicked.connect(self.convert)
        leftLayout.addWidget(self.convertButton)

        # ===========================================================================
        # RIGHT: options widgets tab and terminal output tab
        # ===========================================================================
        self.rightTab = QTabWidget()
        self.rightTab.setMinimumWidth(500)
        mainLayout.addWidget(self.rightTab)

        # First tab: conversion customization widgets
        widgetsPanelTab = QWidget()
        self.rightTab.addTab(widgetsPanelTab, _("Customization"))
        widgetsPanelLayout = QVBoxLayout(widgetsPanelTab)
        widgetsPanelTab.setLayout(widgetsPanelLayout)

        # Text to display when none showing
        self.widgetsPanelText = QLabel(_("Customization Panel"))
        self.widgetsPanelText.setAlignment(Qt.AlignmentFlag.AlignCenter)
        widgetsPanelFont = self.font()
        widgetsPanelFont.setPointSize(20)
        self.widgetsPanelText.setFont(widgetsPanelFont)
        widgetsPanelLayout.addWidget(self.widgetsPanelText)

        # Main layout to display customization widgets
        self.widgetsPanelGrid = QGridLayout()
        widgetsPanelLayout.addLayout(self.widgetsPanelGrid)

        # Second tab: terminal output
        terminalTab = QWidget()
        self.rightTab.addTab(terminalTab, _("Terminal"))
        terminalLayout = QVBoxLayout(terminalTab)
        self.terminalOutput = QTextEdit()
        self.terminalOutput.setReadOnly(True)
        terminalLayout.addWidget(self.terminalOutput)

    def onOutputFormatChange(self):
        """
        When output format changes, clear all widgets on the right panel and 
        set new ones based on current file type.
        """

        self.rightTab.setCurrentIndex(0)
        cur_ext = self.formatCombo.currentText()
        if cur_ext == self.selectFormatText or not cur_ext:
            self.clearContainer(self.widgetsPanelGrid)
            self.widgetsPanelText.show()
            return

        cur_file_type = self.fileList.file_type
        self.widgetsPanelText.hide()
        self.clearContainer(self.widgetsPanelGrid)

        if cur_file_type == "video":
            self.setVideoCodec()
            self.setAudioCodec()
            return

        elif cur_file_type == "audio":
            self.setAudioCodec()
            return

        # Set widgets container on (0, 0) of widgetsPanelGrid
        container = QWidget()
        container.setMaximumWidth(250)
        self.widgetsPanelGrid.addWidget(container, 0, 0)
        layout = QVBoxLayout()
        layout.setAlignment(Qt.AlignmentFlag.AlignVCenter)
        layout.setSpacing(15)
        container.setLayout(layout)

        if cur_file_type == "image":
            widgetList = widgets.image_formats[cur_ext]["widgets"]
            self.setWidgets(widgetList, layout)

        elif cur_file_type == "pdf":
            pass

        elif cur_file_type == "ncm":
            pass

        elif cur_file_type == "pandoc":
            widgetList = widgets.pandoc_formats[cur_ext]["widgets"]
            self.setWidgets(widgetList, layout)

        elif cur_file_type == "calibre":
            widgetList = widgets.calibre_formats[cur_ext]["widgets"]
            self.setWidgets(widgetList, layout)

    def onCodecChange(self, codecCombo, layout, isVideo):
        """
        When video/audio codec changes, clear all widgets under corresponding 
        codec combobox and set new ones based on selected codec.
        """

        # Delete all widgets beneath codec combobox
        for i in range(layout.count() - 1, 0, -1):
            self.clearContainer(layout.itemAt(i))

        cur_codec = codecCombo.currentText()
        if not cur_codec:
            return

        # Set widgets according to codec
        cur_ext = self.formatCombo.currentText()
        cur_file_type = self.fileList.file_type

        if cur_file_type == "video":
            if isVideo:
                widgetList = widgets.video_formats[cur_ext]["video"][cur_codec]["widgets"]
            else:
                widgetList = widgets.video_formats[cur_ext]["audio"][cur_codec]["widgets"]
        elif cur_file_type == "audio":
            widgetList = widgets.audio_formats[cur_ext][cur_codec]["widgets"]

        self.setWidgets(widgetList, layout)

    def setWidgets(self, widgetList, layout):
        """
        Set widgets to the right panel given a list of widgets dict.
        Each widget is set under a CustomVBoxLayout with a configName
        for easy looping when converting.
        """

        for configName, config in widgetList.items():
            # Set custom attribute "configName"
            widgetLayout = CustomVBoxLayout()
            widgetLayout.configName = configName
            widgetLayout.setSpacing(2)
            layout.addLayout(widgetLayout)

            if config["type"] == "combobox":
                label = QLabel(config["label"])
                widgetLayout.addWidget(label)

                combobox = QComboBox()
                widgetLayout.addWidget(combobox)
                combobox.addItem(self.selectionText)
                combobox.addItems([item for item in config["options"]])

            elif config["type"] == "slider":
                label = QLabel(config["label"])
                widgetLayout.addWidget(label)

                sliderLayout = QHBoxLayout()
                sliderLayout.setSpacing(10)
                widgetLayout.addLayout(sliderLayout)

                slider = QSlider(Qt.Orientation.Horizontal)
                sliderLayout.addWidget(slider)
                slider.setMinimum(config["options"][0])
                slider.setMaximum(config["options"][1])

                valueDisplayLabel = QLabel("")
                valueDisplayLabel.setObjectName("sliderValueLabel")
                sliderLayout.addWidget(valueDisplayLabel)
                slider.valueChanged.connect(
                    lambda value, label=valueDisplayLabel: label.setText(str(value)))

                def onRightClick(event, slider=slider, label=valueDisplayLabel):
                    slider.setValue(0)
                    label.setText("")
                valueDisplayLabel.contextMenuEvent = onRightClick

            elif config["type"] == "checkbox":
                checkboxLayout = QHBoxLayout()
                checkboxLayout.setSpacing(10)
                widgetLayout.addLayout(checkboxLayout)

                label = QLabel(config["label"])
                checkboxLayout.addWidget(label)

                checkbox = QCheckBox()
                checkbox.setChecked(config["default"])
                checkboxLayout.addWidget(checkbox)

            elif config["type"] == "textinput":
                if configName in ["alpha_fill"]:
                    labelLayout = QHBoxLayout()
                    widgetLayout.addLayout(labelLayout)

                    label = QLabel(config["label"])
                    labelLayout.addWidget(label)

                    colorPalette = QPushButton()
                    colorPalette.setIcon(self.setFAIcon(self.eyeDropper_path))
                    colorPalette.setIconSize(QSize(15, 15))
                    colorPalette.setStyleSheet("padding: 5px;")
                    labelLayout.addWidget(
                        colorPalette, alignment=Qt.AlignmentFlag.AlignLeft)

                    textInput = QLineEdit()
                    textInput.setPlaceholderText(config["options"][0])
                    textInput.setObjectName("0")
                    widgetLayout.addWidget(textInput)

                    colorPalette.clicked.connect(
                        self.openColorPicker_lambda(textInput))

                else:
                    label = QLabel(config["label"])
                    widgetLayout.addWidget(label)

                    textinputLayout = QHBoxLayout()
                    textinputLayout.setSpacing(10)
                    widgetLayout.addLayout(textinputLayout)

                    for index, placeholder in enumerate(config["options"]):
                        textInput = QLineEdit()
                        textInput.setPlaceholderText(placeholder)
                        textInput.setObjectName(str(index))
                        textinputLayout.addWidget(textInput)

    def setVideoCodec(self):
        videoContainer = QWidget()
        videoContainer.setFixedWidth(250)
        self.widgetsPanelGrid.addWidget(videoContainer, 0, 0)

        # Main layout for all video widgets
        videoLayout = QVBoxLayout(videoContainer)
        videoLayout.setAlignment(Qt.AlignmentFlag.AlignVCenter)
        videoLayout.setSpacing(15)

        videoCodecLayout = QVBoxLayout()
        videoCodecLayout.setSpacing(2)
        videoLayout.addLayout(videoCodecLayout)
        videoCodecLayout.addWidget(QLabel(_("Video Codec:")))
        self.videoCodecCombo = QComboBox()
        self.videoCodecCombo.currentIndexChanged.connect(
            lambda: self.onCodecChange(self.videoCodecCombo, videoLayout, True))
        videoCodecLayout.addWidget(self.videoCodecCombo)

        # Set codec options
        cur_ext = self.formatCombo.currentText()
        self.videoCodecCombo.addItem(self.selectionText)
        self.videoCodecCombo.addItems(
            widgets.video_formats[cur_ext]["video"].keys())

    def setAudioCodec(self):
        audioContainer = QWidget()
        audioContainer.setFixedWidth(250)
        self.widgetsPanelGrid.addWidget(audioContainer, 0, 1)

        # Main layout for all audio widgets
        audioLayout = QVBoxLayout(audioContainer)
        audioLayout.setAlignment(Qt.AlignmentFlag.AlignVCenter)
        audioLayout.setSpacing(15)

        audioCodecLayout = QVBoxLayout()
        audioCodecLayout.setSpacing(2)
        audioLayout.addLayout(audioCodecLayout)
        audioCodecLayout.addWidget(QLabel(_("Audio Codec:")))
        self.audioCodecCombo = QComboBox()
        self.audioCodecCombo.currentIndexChanged.connect(
            lambda: self.onCodecChange(self.audioCodecCombo, audioLayout, False))
        audioCodecLayout.addWidget(self.audioCodecCombo)

        # Set codec options
        cur_ext = self.formatCombo.currentText()
        cur_file_type = self.fileList.file_type
        self.audioCodecCombo.addItem(self.selectionText)
        if cur_file_type == "video":
            self.audioCodecCombo.addItems(
                widgets.video_formats[cur_ext]["audio"].keys())
        elif cur_file_type == "audio":
            self.audioCodecCombo.addItems(
                widgets.audio_formats[cur_ext].keys())

    def convert(self):
        """
        Retrieve all values from displayed widgets and perform conversion 
        with corresponding tools
        """

        self.convertButton.setDisabled(True)
        self.rightTab.setCurrentIndex(1)
        cur_file_type = self.fileList.file_type
        cur_ext = self.formatCombo.currentText()
        file_paths = self.fileList.getFilePaths()
        widget_args = {}
        error_set = set()
        if not cur_ext.startswith("."):
            self.onConversionFinished(1)
            return

        # loop through every CustomVBoxLayout
        def loop_layouts(layout):
            for i in range(layout.count()):
                layoutItem = layout.itemAt(i)

                if layoutItem.layout():
                    if isinstance(layoutItem.layout(), CustomVBoxLayout):
                        cLayout = layoutItem.layout()
                        widgetConfigs = widgets.widget_configs[cLayout.configName]

                        # Get the value from widgets
                        if widgetConfigs["type"] == "combobox":
                            widgetValue = self.findWidgetInstance(
                                cLayout, QComboBox).currentText()

                            if not widgetValue:
                                continue
                            value = widgetConfigs["options"][widgetValue]
                            widget_args[widgetConfigs["arg"]] = value

                        elif widgetConfigs["type"] == "slider":
                            widgetValue = self.findWidgetInstance(
                                cLayout, QLabel, "sliderValueLabel").text()

                            if widgetValue:
                                value_template = widgetConfigs.get(
                                    "value_template", "")
                                if value_template:
                                    widgetValue = value_template.format(
                                        arg0=widgetValue)
                                widget_args[widgetConfigs["arg"]] = widgetValue

                        elif widgetConfigs["type"] == "checkbox":
                            widgetValue = self.findWidgetInstance(
                                cLayout, QCheckBox).isChecked()
                            value = widgetConfigs["options"][widgetValue]
                            widget_args[widgetConfigs["arg"]] = value

                        elif widgetConfigs["type"] == "textinput":
                            value_template = widgetConfigs.get(
                                "value_template", "")
                            values = {}

                            if value_template:
                                # Means more than one textinput exist
                                all_values_present = True
                                for index in range(self.argsCount(value_template)):
                                    widgetValue = self.findWidgetInstance(
                                        cLayout, QLineEdit, str(index)).text()
                                    if widgetValue:
                                        values[f"arg{index}"] = widgetValue
                                    else:
                                        all_values_present = False
                                        break
                                if all_values_present:
                                    widget_args[widgetConfigs["arg"]
                                                ] = value_template.format(**values)
                            else:
                                widgetValue = self.findWidgetInstance(
                                    cLayout, QLineEdit).text()
                                widget_args[widgetConfigs["arg"]] = widgetValue

                elif layoutItem.widget():
                    if layoutItem.widget().layout():
                        loop_layouts(layoutItem.widget().layout())

        loop_layouts(self.widgetsPanelGrid)

        if cur_file_type == "video":
            vCodecSelection = self.videoCodecCombo.currentText()
            aCodecSelection = self.audioCodecCombo.currentText()

            if vCodecSelection:
                vCodec = widgets.video_formats[cur_ext]["video"][vCodecSelection]["value"]
                widget_args["-c:v"] = vCodec
            if aCodecSelection:
                aCodec = widgets.video_formats[cur_ext]["audio"][aCodecSelection]["value"]
                widget_args["-c:a"] = aCodec

            commands = self.constructFfmpegCommands(
                file_paths, cur_ext, widget_args, error_set)
            self.startSubprocess(commands)

        elif cur_file_type == "audio":
            aCodecSelection = self.audioCodecCombo.currentText()

            if aCodecSelection:
                aCodec = widgets.audio_formats[cur_ext][aCodecSelection]["value"]
                widget_args["-c:a"] = aCodec

            commands = self.constructFfmpegCommands(
                file_paths, cur_ext, widget_args, error_set)
            self.startSubprocess(commands)

        elif cur_file_type == "image":
            commands = self.constructImageMagickCommands(
                file_paths, cur_ext, widget_args, error_set)
            self.startSubprocess(commands)

        elif cur_file_type == "pdf":
            pass

        elif cur_file_type == "ncm":
            commands = []
            for inputFile in file_paths:
                commands.append([self.ncm_path, inputFile])
            self.startSubprocess(commands)

        elif cur_file_type == "pandoc":
            commands = self.constructPandocCommands(
                file_paths, cur_ext, widget_args, error_set)
            self.startSubprocess(commands)

        elif cur_file_type == "calibre":
            commands = self.constructCalibreCommands(
                file_paths, cur_ext, widget_args, error_set)
            self.startSubprocess(commands)

        for error in error_set:
            QMessageBox.critical(None, _("Error"), error)

    def constructFfmpegCommands(self, inputFiles, outputExt, widget_args, error_set):
        commands = []

        for inputFile in inputFiles:
            outputFile = os.path.splitext(
                inputFile)[0] + "_converted" + outputExt
            command = [self.ffmpeg_path, "-i", inputFile]
            for arg, value in widget_args.items():
                if arg and value:
                    command.extend([arg, str(value)])

            # Special cases and checks
            isError = False
            if outputExt == ".m4a":
                command.append("-vn")
            if widget_args.get("-crf") and widget_args.get("-lossless"):
                error_set.add(_("Lossless shouldn't be used with a CRF value"))
                isError = True
            if widget_args.get("-room_type") and not widget_args.get("-mixing_level"):
                error_set.add("Mixing level must be set if room type is set")
                isError = True
            if widget_args.get("-c:a") in ["adpcm_swf", "nellymoser"] and not widget_args.get("-ar"):
                error_set.add("Please select a sample rate")
                isError = True
            if isError:
                return False

            command += ["-y", outputFile]
            commands.append(command)

        return commands

    def constructImageMagickCommands(self, inputFiles, outputExt, widget_args, error_set):
        commands = []

        if outputExt == ".gif":
            outputFile = os.path.splitext(inputFiles[0])[
                0] + "_converted" + outputExt
            command = [self.imageMagick_path]

            for inputFile in inputFiles:
                delay_command = ["-delay", widget_args.get("-delay", "")]
                if delay_command[1]:
                    command.extend(delay_command)
                command.append(inputFile)

            for arg, value in widget_args.items():
                if arg and value:
                    if arg != "-delay":
                        command.extend([arg, str(value)])

            command += ["-alpha", "remove", outputFile]
            commands.append(command)

        else:
            for inputFile in inputFiles:
                outputFile = os.path.splitext(
                    inputFile)[0] + "_converted" + outputExt
                command = [self.imageMagick_path, inputFile]
                for arg, value in widget_args.items():
                    if arg and value:
                        command.extend([arg, str(value)])

                if not widgets.image_formats[outputExt].get("supports_alpha"):
                    command.extend(["-alpha", "remove"])
                if outputExt == ".ico":
                    command.extend(
                        ["-define", "icon:auto-resize=16,32,48,64,128,256"])

                command += [outputFile]
                commands.append(command)

        return commands

    def constructPandocCommands(self, inputFiles, outputExt, widget_args, error_set):
        if not self.updatePandocPath():
            self.externalToolNotFound("Pandoc")
            return []
        commands = []

        for inputFile in inputFiles:
            outputFile = os.path.splitext(
                inputFile)[0] + "_converted" + outputExt
            command = [self.pandoc_path, "-s", inputFile]
            for arg, value in widget_args.items():
                if arg and value:
                    command.extend([arg, str(value)])

            command += ["-o", outputFile]
            commands.append(command)

        return commands

    def constructCalibreCommands(self, inputFiles, outputExt, widget_args, error_set):
        if not self.updateCalibrePath():
            self.externalToolNotFound("Calibre")
            return []
        commands = []

        for inputFile in inputFiles:
            outputFile = os.path.splitext(
                inputFile)[0] + "_converted" + outputExt
            command = [self.calibre_path, inputFile]
            for arg, value in widget_args.items():
                if arg and value:
                    command.extend([arg, str(value)])

            command += [outputFile]
            commands.append(command)

        return commands
    
    def externalToolNotFound(self, toolName):
        QMessageBox.critical(
            self, _("Error"),
            _("{toolName} not installed or invalid installation path.").format(toolName=toolName)
            + "\n" +
            _("Please navigate to 'Options -> Conversion Table' to install {toolName}").format(toolName=toolName)
            + "\n" +
            _("and make sure {toolName} path is correct in 'Options -> Settings'.").format(toolName=toolName)
        )

    def findWidgetInstance(self, layout, QInstance, widgetName=None):
        for i in range(layout.count()):
            layoutItem = layout.itemAt(i)

            if layoutItem.widget():
                if isinstance(layoutItem.widget(), QInstance) and (widgetName is None or layoutItem.widget().objectName() == widgetName):
                    return layoutItem.widget()
                elif layoutItem.widget().layout():
                    foundWidget = self.findWidgetInstance(
                        layoutItem.widget().layout(), QInstance, widgetName)
                    if foundWidget:
                        return foundWidget

            elif layoutItem.layout():
                foundWidget = self.findWidgetInstance(
                    layoutItem.layout(), QInstance, widgetName)
                if foundWidget:
                    return foundWidget

    def clearContainer(self, container):
        # Clears all widgets or layouts from a given container
        if isinstance(container, QLayout):
            while container.count():
                layoutItem = container.takeAt(0)

                if layoutItem.widget():
                    layoutItem.widget().deleteLater()
                elif layoutItem.layout():
                    self.clearContainer(layoutItem.layout())
                    layoutItem.layout().deleteLater()

        elif isinstance(container, QWidget):
            container.deleteLater()

    def startSubprocess(self, commands):
        self.terminalOutput.clear()
        self.thread = SubprocessThread(commands)
        self.thread.output_signal.connect(self.updateTerminalOutput)
        self.thread.finished_signal.connect(self.onConversionFinished)
        self.thread.start()

    def updateTerminalOutput(self, text, textStyle=0, ScrollDown=1):
        if textStyle == 0:
            self.terminalOutput.insertPlainText(text)
        elif textStyle == 1:
            self.terminalOutput.insertHtml(text)
            # reset html color format
            self.terminalOutput.insertHtml(
                "<p style='color: #FFFFFF;'>&#8203;</p>")
        elif textStyle == "success":
            colored_text = f"<p style='color: green;'>{text}</p>"
            self.updateTerminalOutput(colored_text, 1)
        elif textStyle == "error":
            colored_text = f"<p style='color: red;'>{text}</p>"
            self.updateTerminalOutput(colored_text, 1)

        if ScrollDown:
            self.terminalOutput.moveCursor(QTextCursor.MoveOperation.End)

    def argsCount(self, formattedString):
        args = re.findall(r"\{arg(\d+)\}", formattedString)
        unique_args = set(map(int, args))
        return len(unique_args)

    def onConversionFinished(self, exitCode):
        self.convertButton.setEnabled(True)
        self.updateTerminalOutput("\n")

        if exitCode == 0:
            self.updateTerminalOutput(_("All files converted!"), "success")
            self.updateTerminalOutput("\n")
        elif exitCode == 1:
            self.updateTerminalOutput(
                _("Please select an output format."), "error")
        elif exitCode == 2:
            self.updateTerminalOutput(_("No files to convert."), "error")

    def onExternalToolsChange(self):
        self.fileList.clearFileList()
        self.fileList.file_type = externalTools[self.exToolCombo.currentText()]
        if self.fileList.file_type:
            self.formatCombo.addItems(
                widgets.external_file_types[self.fileList.file_type]["output"])

    def openColorPicker_lambda(self, lineEdit):
        return lambda: ColorPicker(lineEdit, self).openDialog()

    def updatePandocPath(self):
        self.pandoc_path = os.path.join(settings["pandocPath"], "pandoc.exe")
        if os.path.exists(self.pandoc_path):
            return True
        return False

    def updateCalibrePath(self):
        self.calibre_path = os.path.join(
            settings["calibrePath"], "ebook-convert.exe")
        if os.path.exists(self.calibre_path):
            return True
        return False

    def setFAIcon(self, iconPath):
        with open(iconPath, 'r') as file:
            svg_content = file.read()

        if settings["theme"] == "dark":
            svg_content = svg_content.replace(
                '<path ', '<path fill="#FFFFFF" ', 1)
        elif settings["theme"] == "light":
            pass

        byte_array = QByteArray(svg_content.encode('utf-8'))
        pixmap = QPixmap()
        pixmap.loadFromData(byte_array, format='SVG')
        return QIcon(pixmap)

    def init_settings(self):
        if settings["theme"] == "dark":
            style = style_sheet.dark
        elif settings["theme"] == "light":
            style = style_sheet.light

        style = style.format(
            drop_down_arrow=self.dropDownArrow_path,
            spin_box_up=self.spinboxUpArrow_path,
            spin_box_down=self.spinboxDownArrow_path
        )
        self.setStyleSheet(style)

    def open_settings(self):
        if self.settings_window is not None and self.settings_window.isVisible():
            self.settings_window.raise_()
            self.settings_window.activateWindow()
        else:
            self.settings_window = SettingsDialog(self)
            self.settings_window.show()

    def extractMetadata(self):
        self.metadataButton.setEnabled(False)
        self.rightTab.setCurrentIndex(1)
        self.terminalOutput.clear()
        selectedItem = self.fileList.currentItem()

        if selectedItem:
            os.makedirs(self.temp_dir, exist_ok=True)
            originalFilePath = selectedItem.fullPath
            tempFilePath = os.path.join(self.temp_dir, "tempfile")
            if os.path.exists(tempFilePath):
                os.unlink(tempFilePath)

            try:
                mklink_command = ["cmd", "/c", "mklink",
                                  "/H", tempFilePath, originalFilePath]
                subprocess.run(
                    mklink_command, check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    creationflags=subprocess.CREATE_NO_WINDOW
                )
            except subprocess.CalledProcessError as e:
                self.updateTerminalOutput(
                    _("Error creating hard link:"), "error")
                self.updateTerminalOutput(f"\n{e.stderr.decode("utf-8")}")
                self.metadataButton.setEnabled(True)
                return

            try:
                command = [self.exiftool_path, tempFilePath]
                process = subprocess.run(
                    command, check=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    creationflags=subprocess.CREATE_NO_WINDOW,
                    encoding="utf-8"
                )
                output = process.stdout
            except subprocess.CalledProcessError as e:
                self.updateTerminalOutput(
                    _("Error extracting metadata from file:"), "error")
                self.updateTerminalOutput(f"\n{e.stderr}")
                possibleErrorInStdout = re.search(r'^Error\s*:\s*(.*)', e.stdout, re.MULTILINE)
                if possibleErrorInStdout:
                    self.updateTerminalOutput(possibleErrorInStdout.group(1).strip())
                self.metadataButton.setEnabled(True)
                return

            os.unlink(tempFilePath)

            html_output = "<table>"
            for line in output.split("\n"):
                if ": " in line:
                    key, value = line.split(":", 1)
                    key = key.strip()
                    value = value.strip()
                    if key == "ExifTool Version Number":
                        continue
                    if key == "File Name":
                        value = os.path.basename(originalFilePath)
                    elif key == "Directory":
                        value = os.path.normpath(originalFilePath)

                    translated_key = _(key) if _(key) != key else key
                    html_output += f'''
                        <tr>
                        <td>{translated_key}</td>
                        <td>:</td>
                        <td>{value}</td>
                        </tr>
                    '''
            html_output += "</table>"
            self.updateTerminalOutput(html_output, 1, 0)

        else:
            self.updateTerminalOutput(_("No selected file."), "error")

        self.metadataButton.setEnabled(True)


if __name__ == "__main__":
    app = QApplication(sys.argv)

    # Language setting
    font_config = {
        "en_US": resource_path("assets/NotoSans-Regular.ttf"),
        "zh_CN": resource_path("assets/NotoSansSC-Regular.ttf"),
        "zh_TW": resource_path("assets/NotoSansTC-Regular.ttf")
    }
    fontId = QFontDatabase.addApplicationFont(
        font_config[settings["language"]])
    fontFamilies = QFontDatabase.applicationFontFamilies(fontId)
    customFont = QFont(fontFamilies[0], 10)
    app.setFont(customFont)

    mainWin = UniversalConverter()
    mainWin.show()

    # Center window
    qr = mainWin.frameGeometry()
    cp = mainWin.screen().availableGeometry().center()
    qr.moveCenter(cp)
    mainWin.move(qr.topLeft())

    sys.exit(app.exec())
