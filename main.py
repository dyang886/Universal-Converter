import os
import re
import sys
import subprocess
import tempfile

from PyQt6.QtWidgets import QApplication, QMessageBox, QTextEdit, QTabWidget, QLineEdit, QCheckBox, QSlider, QLayout, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QComboBox, QLabel
from PyQt6.QtCore import Qt, QByteArray, QSize
from PyQt6.QtGui import QIcon, QFontDatabase, QFont, QAction, QTextCursor, QPixmap, QCursor
import subprocess

from helper import *
import style_sheet


class UniversalConverter(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Universal Converter")
        self.setWindowIcon(QIcon(resource_path("assets/logo.ico")))

        # Version, user prompts, and links
        self.appVersion = "1.0.0"
        self.githubLink = "https://github.com/dyang886/Universal-Converter"
        self.updateLink = "https://api.github.com/repos/dyang886/Universal-Converter/releases/latest"
        self.bilibiliLink = "https://space.bilibili.com/256673766"

        # Variable management
        self.selectFormatText = tr("Select Output Format")
        self.selectionText = ""
        self.temp_dir = os.path.join(tempfile.gettempdir(), "UCTemp")

        self.updatePandocPath()
        self.updateCalibrePath()

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

        optionMenu = menu.addMenu(tr("Options"))
        settingsAction = QAction(tr("Settings"), self)
        settingsAction.setFont(menuFont)
        settingsAction.triggered.connect(self.open_settings)
        optionMenu.addAction(settingsAction)

        aboutAction = QAction(tr("About"), self)
        aboutAction.setFont(menuFont)
        aboutAction.triggered.connect(self.open_about)
        optionMenu.addAction(aboutAction)

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

        selectButton = CustomButton(tr("Select Files"))
        selectButton.clicked.connect(lambda: self.fileList.selectFiles())
        selectButton.setCursor(Qt.CursorShape.PointingHandCursor)
        buttonsLayout.addWidget(selectButton)

        clearButton = CustomButton(tr("Clear Files"))
        clearButton.clicked.connect(lambda: self.fileList.clearFileList())
        clearButton.setCursor(Qt.CursorShape.PointingHandCursor)
        buttonsLayout.addWidget(clearButton)

        self.metadataButton = CustomButton(tr("File Metadata"))
        self.metadataButton.clicked.connect(self.extractMetadata)
        self.metadataButton.setCursor(Qt.CursorShape.PointingHandCursor)
        buttonsLayout.addWidget(self.metadataButton)

        leftLayout.addLayout(buttonsLayout)

        # External tool selection
        exToolLayout = QHBoxLayout()

        exToolLayout.addWidget(QLabel(tr("Select External Tool:")))
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

        formatLayout.addWidget(QLabel(tr("Output Format:")))
        self.formatCombo = QComboBox()
        self.formatCombo.addItem(self.selectFormatText)
        self.formatCombo.currentIndexChanged.connect(
            self.onOutputFormatChange)
        formatLayout.addWidget(self.formatCombo)
        formatLayout.setStretchFactor(self.formatCombo, 1)

        leftLayout.addLayout(formatLayout)

        # Convert button
        self.convertButton = CustomButton(" " + tr("Convert"))
        self.convertButton.setIcon(self.setCustomIcon(rocket_path))
        self.convertButton.setIconSize(QSize(15, 15))
        self.convertButton.setCursor(
            QCursor(Qt.CursorShape.PointingHandCursor))
        self.convertButton.clicked.connect(self.convert)
        leftLayout.addWidget(self.convertButton)

        # ===========================================================================
        # RIGHT: options widgets tab and terminal output tab
        # ===========================================================================
        self.rightTab = QTabWidget()
        self.rightTab.setTabPosition(QTabWidget.TabPosition.North)
        self.rightTab.setMinimumWidth(500)
        mainLayout.addWidget(self.rightTab)

        # First tab: conversion customization widgets
        widgetsPanelTab = QWidget()
        self.rightTab.addTab(widgetsPanelTab, tr("Customization"))
        widgetsPanelLayout = QVBoxLayout(widgetsPanelTab)
        widgetsPanelTab.setLayout(widgetsPanelLayout)

        # Text to display when none showing
        self.widgetsPanelText = QLabel(tr("Customization Panel"))
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
        self.rightTab.addTab(terminalTab, tr("Terminal"))
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

                    colorPalette = CustomButton()
                    colorPalette.setIcon(self.setCustomIcon(eyeDropper_path))
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
        videoCodecLayout.addWidget(QLabel(tr("Video Codec:")))
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
        audioCodecLayout.addWidget(QLabel(tr("Audio Codec:")))
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
                commands.append([ncm_path, inputFile])
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
            QMessageBox.critical(None, tr("Error"), error)

    def constructFfmpegCommands(self, inputFiles, outputExt, widget_args, error_set):
        commands = []

        for inputFile in inputFiles:
            outputFile = os.path.splitext(
                inputFile)[0] + "_converted" + outputExt
            command = [ffmpeg_path, "-i", inputFile]
            for arg, value in widget_args.items():
                if arg and value:
                    command.extend([arg, str(value)])

            # Special cases and checks
            isError = False
            if outputExt == ".m4a":
                command.append("-vn")
            if widget_args.get("-crf") and widget_args.get("-lossless"):
                error_set.add(tr("Lossless shouldn't be used with a CRF value"))
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
            command = [imageMagick_path]

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
                command = [imageMagick_path, inputFile]
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
            self, tr("Error"),
            tr("{toolName} not installed or invalid installation path.").format(toolName=toolName)
            + "\n" +
            tr("Please navigate to 'Options -> Conversion Table' to install {toolName}").format(toolName=toolName)
            + "\n" +
            tr("and make sure {toolName} path is correct in 'Options -> Settings'.").format(toolName=toolName)
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
            self.updateTerminalOutput(tr("All files converted!"), "success")
            self.updateTerminalOutput("\n")
        elif exitCode == 1:
            self.updateTerminalOutput(
                tr("Please select an output format."), "error")
        elif exitCode == 2:
            self.updateTerminalOutput(tr("No files to convert."), "error")

    def onExternalToolsChange(self):
        self.fileList.clearFileList()
        self.fileList.file_type = externalTools[self.exToolCombo.currentText()]
        if self.fileList.file_type:
            self.formatCombo.addItems(
                widgets.external_file_types[self.fileList.file_type]["output"])

    def openColorPicker_lambda(self, lineEdit):
        return lambda: ColorPicker(lineEdit, self).openDialog()

    def updatePandocPath(self):
        if current_os == "Windows":
            self.pandoc_path = os.path.join(settings["pandocPath"], "pandoc.exe")
        elif current_os == "Darwin":
            self.pandoc_path = settings["pandocPath"]

        if os.path.exists(self.pandoc_path):
            return True
        return False

    def updateCalibrePath(self):
        if current_os == "Windows":
            self.calibre_path = os.path.join(
                settings["calibrePath"], "ebook-convert.exe")
        elif current_os == "Darwin":
            self.calibre_path = os.path.join(settings["calibrePath"], "Contents/MacOS/ebook-convert")

        if os.path.exists(self.calibre_path):
            return True
        return False

    def setCustomIcon(self, iconPath):
        with open(iconPath, 'r') as file:
            svg_content = file.read()

        if settings["theme"] == "black":
            svg_content = svg_content.replace(
                '<path ', '<path fill="#FFFFFF" ', 1)
        elif settings["theme"] == "white":
            pass

        byte_array = QByteArray(svg_content.encode('utf-8'))
        pixmap = QPixmap()
        pixmap.loadFromData(byte_array, format='SVG')
        return QIcon(pixmap)

    def init_settings(self):
        if settings["theme"] == "black":
            style = style_sheet.black
        elif settings["theme"] == "white":
            style = style_sheet.white

        style = style.format(
            drop_down_arrow=dropDownArrow_path,
            spin_box_up=spinboxUpArrow_path,
            spin_box_down=spinboxDownArrow_path,
            scroll_bar_top=upArrow_path,
            scroll_bar_bottom=downArrow_path,
            scroll_bar_left=leftArrow_path,
            scroll_bar_right=rightArrow_path,
        )
        self.setStyleSheet(style)

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
                    tr("Error creating hard link:"), "error")
                self.updateTerminalOutput(f"\n{e.stderr.decode("utf-8")}")
                self.metadataButton.setEnabled(True)
                return

            try:
                command = [exiftool_path, tempFilePath]
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
                    tr("Error extracting metadata from file:"), "error")
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

                    translated_key = tr(key) if tr(key) != key else key
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
            self.updateTerminalOutput(tr("No selected file."), "error")

        self.metadataButton.setEnabled(True)
    
    # ===========================================================================
    # Menu functions
    # ===========================================================================
    def open_settings(self):
        if self.settings_window is not None and self.settings_window.isVisible():
            self.settings_window.raise_()
            self.settings_window.activateWindow()
        else:
            self.settings_window = SettingsDialog(self)
            self.settings_window.show()

    def open_about(self):
        if self.about_window is not None and self.about_window.isVisible():
            self.about_window.raise_()
            self.about_window.activateWindow()
        else:
            self.about_window = AboutDialog(self)
            self.about_window.show()


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
