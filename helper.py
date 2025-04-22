import os
import subprocess

from PyQt6.QtWidgets import QApplication, QDialog, QColorDialog, QMessageBox, QListWidgetItem, QLineEdit, QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QComboBox, QLabel, QFileDialog, QListWidget
from PyQt6.QtCore import Qt, QEvent, QThread, pyqtSignal
from PyQt6.QtGui import QIcon, QDragEnterEvent, QDropEvent, QColor, QPainter, QPixmap
import subprocess

import widgets
from config import *


language_options = {
    "English (US)": "en_US",
    "简体中文": "zh_CN",
    # "繁體中文": "zh_TW"
}

theme_options = {
    tr("Black"): "black",
    tr("White"): "white"
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
        self.placeholderText = tr("Drag and drop or click to select files")
        self.file_type = ""
        color_set = {
            "black": {
                "base_color": "#2a2a2a",
                "drag_color": "#3f3f3f",
                "text_color": "#ffffff"
            },
            "white": {
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
                    tr("Selected files contain unsupported formats."))
            elif cur_file_type != self.file_type:
                error_messages.add(
                    tr("Selected files should be in the same type."))
            else:
                fileName = os.path.basename(file)
                self.addItem(FileListItem(fileName, file))

        if error_messages:
            QMessageBox.critical(
                self, tr("Error"), "\n".join(error_messages))


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
        self.setCursor(Qt.CursorShape.PointingHandCursor)

    def setEnabled(self, enabled):
        super().setEnabled(enabled)
        if enabled:
            self.setCursor(Qt.CursorShape.PointingHandCursor)
        else:
            self.setCursor(Qt.CursorShape.ForbiddenCursor)

    def enterEvent(self, event):
        if not self.isEnabled():
            QApplication.setOverrideCursor(Qt.CursorShape.ForbiddenCursor)
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
            message = tr("Processing {index} of {total_files} files...").format(
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
        self.setWindowTitle(tr("Settings"))
        self.setWindowIcon(QIcon(resource_path("assets/setting.ico")))
        settingsLayout = QVBoxLayout()
        settingsLayout.setSpacing(15)
        self.setLayout(settingsLayout)
        self.setMinimumWidth(400)

        settingsWidgetsLayout = QVBoxLayout()
        settingsWidgetsLayout.setContentsMargins(50, 30, 50, 20)
        settingsLayout.addLayout(settingsWidgetsLayout)

        # Theme selection
        themeLayout = QVBoxLayout()
        themeLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(themeLayout)
        themeLayout.addWidget(QLabel(tr("Theme:")))
        self.themeCombo = QComboBox()
        self.themeCombo.addItems(theme_options.keys())
        self.themeCombo.setCurrentText(
            self.find_settings_key(settings["theme"], theme_options))
        themeLayout.addWidget(self.themeCombo)

        # Language selection
        languageLayout = QVBoxLayout()
        languageLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(languageLayout)
        languageLayout.addWidget(QLabel(tr("Language:")))
        self.languageCombo = QComboBox()
        self.languageCombo.addItems(language_options.keys())
        self.languageCombo.setCurrentText(
            self.find_settings_key(settings["language"], language_options))
        languageLayout.addWidget(self.languageCombo)

        # Pandoc path
        pandocLayout = QVBoxLayout()
        pandocLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(pandocLayout)
        pandocLayout.addWidget(QLabel(tr("Pandoc Path:")))
        pandocPathLayout = QHBoxLayout()
        pandocPathLayout.setSpacing(5)
        pandocLayout.addLayout(pandocPathLayout)
        self.pandocLineEdit = QLineEdit()
        self.pandocLineEdit.setText(settings["pandocPath"])
        pandocPathLayout.addWidget(self.pandocLineEdit)
        pandocPathButton = CustomButton("...")
        pandocPathButton.clicked.connect(self.selectPandocPath)
        pandocPathLayout.addWidget(pandocPathButton)

        # Calibre path
        calibreLayout = QVBoxLayout()
        calibreLayout.setSpacing(2)
        settingsWidgetsLayout.addLayout(calibreLayout)
        calibreLayout.addWidget(QLabel(tr("Calibre Path:")))
        calibrePathLayout = QHBoxLayout()
        calibrePathLayout.setSpacing(5)
        calibreLayout.addLayout(calibrePathLayout)
        self.calibreLineEdit = QLineEdit()
        self.calibreLineEdit.setText(settings["calibrePath"])
        calibrePathLayout.addWidget(self.calibreLineEdit)
        calibrePathButton = CustomButton("...")
        calibrePathButton.clicked.connect(self.selectCalibrePath)
        calibrePathLayout.addWidget(calibrePathButton)

        # Apply button
        applyButtonLayout = QHBoxLayout()
        applyButtonLayout.setContentsMargins(0, 0, 10, 10)
        applyButtonLayout.addStretch(1)
        settingsLayout.addLayout(applyButtonLayout)
        self.applyButton = CustomButton(tr("Apply"))
        self.applyButton.setFixedWidth(100)
        self.applyButton.clicked.connect(self.apply_settings_page)
        applyButtonLayout.addWidget(self.applyButton)

    def find_settings_key(self, value, dict):
        return next(key for key, val in dict.items() if val == value)

    def selectPandocPath(self):
        initialPath = self.pandocLineEdit.text() or os.path.expanduser("~")
        directory = QFileDialog.getExistingDirectory(
            self, tr("Select Pandoc Installation Path"), initialPath)
        if directory:
            self.pandocLineEdit.setText(os.path.normpath(directory))

    def selectCalibrePath(self):
        initialPath = self.calibreLineEdit.text() or os.path.expanduser("~")
        directory = QFileDialog.getExistingDirectory(
            self, tr("Select Calibre Installation Path"), initialPath)
        if directory:
            self.calibreLineEdit.setText(os.path.normpath(directory))

    def apply_settings_page(self):
        original_theme = settings["theme"]
        original_language = settings["language"]

        settings["theme"] = theme_options[self.themeCombo.currentText()]
        settings["language"] = language_options[self.languageCombo.currentText()]
        settings["pandocPath"] = self.pandocLineEdit.text()
        settings["calibrePath"] = self.calibreLineEdit.text()
        apply_settings(settings)
        
        if original_theme != settings["theme"] or original_language != settings["language"]:
            msg_box = QMessageBox(
                QMessageBox.Icon.Question,
                tr("Attention"),
                tr("Do you want to restart the application now to apply theme or language settings?"),
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                self
            )
            
            yes_button = msg_box.button(QMessageBox.StandardButton.Yes)
            yes_button.setText(tr("Yes"))
            no_button = msg_box.button(QMessageBox.StandardButton.No)
            no_button.setText(tr("No"))
            reply = msg_box.exec()

            if reply == QMessageBox.StandardButton.Yes:
                os.execl(sys.executable, sys.executable, *map(lambda arg: f'"{arg}"', sys.argv))
        
        else:
            QMessageBox.information(self, tr("Success"), tr("Settings saved."))


class AboutDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle(tr("About"))
        self.setWindowIcon(QIcon(resource_path("assets/logo.ico")))
        aboutLayout = QVBoxLayout()
        aboutLayout.setSpacing(30)
        aboutLayout.setContentsMargins(40, 20, 40, 30)
        self.setLayout(aboutLayout)

        appLayout = QHBoxLayout()
        appLayout.setSpacing(20)
        aboutLayout.addLayout(appLayout)

        # App logo
        logoPixmap = QPixmap(resource_path("assets/logo.png"))
        scaledLogoPixmap = logoPixmap.scaled(120, 120, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
        logoLabel = QLabel()
        logoLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        logoLabel.setPixmap(scaledLogoPixmap)
        appLayout.addWidget(logoLabel)

        # App name and version
        appNameFont = self.font()
        appNameFont.setPointSize(18)
        appInfoLayout = QVBoxLayout()
        appInfoLayout.setAlignment(Qt.AlignmentFlag.AlignVCenter)
        appLayout.addLayout(appInfoLayout)

        appNameLabel = QLabel("Universal Converter")
        appNameLabel.setFont(appNameFont)
        appNameLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        appInfoLayout.addWidget(appNameLabel)
        appVersionLabel = QLabel(tr("Version: ") + self.parent().appVersion)
        appVersionLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        appInfoLayout.addWidget(appVersionLabel)

        # Links
        linksLayout = QVBoxLayout()
        linksLayout.setSpacing(10)
        aboutLayout.addLayout(linksLayout)

        githubUrl = self.parent().githubLink
        githubText = f'GitHub: <a href="{githubUrl}" style="text-decoration: none;">{githubUrl}</a>'
        githubLabel = QLabel(githubText)
        githubLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        githubLabel.setTextFormat(Qt.TextFormat.RichText)
        githubLabel.setOpenExternalLinks(True)
        linksLayout.addWidget(githubLabel)

        bilibiliUrl = self.parent().bilibiliLink
        text = tr("Bilibili author homepage:")
        bilibiliText = f'{text} <a href="{bilibiliUrl}" style="text-decoration: none;">{bilibiliUrl}</a>'
        bilibiliLabel = QLabel(bilibiliText)
        bilibiliLabel.setAlignment(Qt.AlignmentFlag.AlignCenter)
        bilibiliLabel.setTextFormat(Qt.TextFormat.RichText)
        bilibiliLabel.setOpenExternalLinks(True)
        linksLayout.addWidget(bilibiliLabel)

        self.setFixedSize(self.sizeHint())
