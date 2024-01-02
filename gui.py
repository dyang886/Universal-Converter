import os
import re
import sys
import tkinter as tk
from tkinter import ttk
from tkinter import filedialog
from tkinter import messagebox
from tkinter import PhotoImage
from tkinterdnd2 import DND_FILES, TkinterDnD
import sv_ttk
import threading
import math
import subprocess

import ffmpeg
import other

_ = other.get_translator()


class UniversalConverter(TkinterDnD.Tk):
    def __init__(self):
        super().__init__()

        # =============================================================
        # Initialization and data members
        # =============================================================
        self.settings = other.load_settings()

        self.title("Universal Converter")
        self.iconbitmap(resource_path("assets/logo.ico"))
        sv_ttk.set_theme(self.settings["theme"])

        self.file_paths = ""
        self.total_file_paths = []
        self.category = ""
        self.loading_animation_running = True
        self.settings_window = None
        self.combobox_width = 19
        self.entry_width = 23
        self.entry_splitted_width = 8
        self.scale_length = 180

        # =============================================================
        # Application main grids
        # =============================================================

        # Menu bar
        self.menuBar = tk.Frame(self, background="#2e2e2e")
        self.settingMenuBtn = tk.Menubutton(
            self.menuBar, text=_("Options"), background="#2e2e2e")
        self.settingsMenu = tk.Menu(self.settingMenuBtn, tearoff=0)
        self.settingsMenu.add_command(
            label=_("Settings"), command=self.open_settings)
        self.settingMenuBtn.config(menu=self.settingsMenu)
        self.settingMenuBtn.pack(side="left")
        self.menuBar.grid(row=0, column=0, sticky="ew")

        # create the main frame
        self.main_frame = ttk.Frame(self)
        self.main_frame.grid(row=1, column=0, padx=(30, 30), pady=(20, 40))
        # center main frame
        self.main_frame.grid_rowconfigure(0, weight=1)
        self.main_frame.grid_rowconfigure(1, weight=1)
        self.main_frame.grid_rowconfigure(2, weight=1)
        self.main_frame.grid_columnconfigure(0, weight=1)
        self.main_frame.grid_columnconfigure(1, weight=1)
        self.main_frame.grid_columnconfigure(2, weight=1)
        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # create left column
        self.left_frame = ttk.Frame(self.main_frame)
        self.left_frame.grid(row=1, column=0, padx=(10, 10))

        # create right column
        self.right_frame = ttk.Frame(self.main_frame)
        self.right_frame.grid(row=1, column=1, padx=(50, 0))

        # create left of right column
        self.l_right_frame = ttk.Frame(self.right_frame)
        self.l_right_frame.grid(row=1, column=0, padx=(10, 10))

        # create right of right column
        self.r_right_frame = ttk.Frame(self.right_frame)
        self.r_right_frame.grid(row=1, column=1, padx=(10, 10))

        # create prompt area
        self.prompt_frame = ttk.Frame(self.main_frame)
        self.prompt_frame.grid(row=2, column=0, pady=(40, 0))

        # =============================================================
        # Prompt section
        # =============================================================

        # loading frame
        # =============================================================
        self.loading_frame = ttk.Frame(self.prompt_frame)

        # loading label
        self.loading_label_text = tk.StringVar()
        self.loading_label = ttk.Label(
            self.loading_frame, textvariable=self.loading_label_text)
        self.loading_label.pack(side=tk.LEFT, padx=(0, 10))

        # loading canvas and lines
        self.loading_canvas = tk.Canvas(
            self.loading_frame, width=40, height=40)
        self.loading_canvas.pack(side=tk.LEFT)

        self.num_lines = 12
        radius = 10
        self.highlighted_lines = 3
        line_length = 6
        line_width = 2

        self.lines = []
        for i in range(self.num_lines):
            angle = 2 * math.pi * i / self.num_lines
            x1 = 20 + radius * math.cos(angle)
            y1 = 20 + radius * math.sin(angle)
            x2 = 20 + (radius + line_length) * math.cos(angle)
            y2 = 20 + (radius + line_length) * math.sin(angle)
            line = self.loading_canvas.create_line(
                x1, y1, x2, y2, width=line_width, fill="gray")
            self.lines.append(line)

        # success frame
        # =============================================================
        self.success_frame = ttk.Frame(self.prompt_frame)

        # success label
        self.success_label_text = tk.StringVar()
        self.success_label = ttk.Label(
            self.success_frame, text=_("Conversion successful"))
        self.success_label.pack(side=tk.LEFT, padx=(0, 10))

        # success image
        self.success_image = PhotoImage(
            file=resource_path("assets/success.png"))
        success_width = 30
        success_height = 30
        success_width_ratio = self.success_image.width() // success_width
        success_height_ratio = self.success_image.height() // success_height
        self.success_image = self.success_image.subsample(
            success_width_ratio, success_height_ratio)
        self.success_image_label = ttk.Label(
            self.success_frame, image=self.success_image)
        self.success_image_label.pack(side=tk.LEFT)

        # failure frame
        # =============================================================
        self.failure_frame = ttk.Frame(self.prompt_frame)

        # failure label
        self.failure_label_text = tk.StringVar()
        self.failure_label = ttk.Label(
            self.failure_frame, text=_("Conversion failed"))
        self.failure_label.pack(side=tk.LEFT, padx=(0, 10))

        # failure image
        self.failure_image = PhotoImage(
            file=resource_path("assets/failure.png"))
        failure_width = 30
        failure_height = 30
        failure_width_ratio = self.failure_image.width() // failure_width
        failure_height_ratio = self.failure_image.height() // failure_height
        self.failure_image = self.failure_image.subsample(
            failure_width_ratio, failure_height_ratio)
        self.failure_image_label = ttk.Label(
            self.failure_frame, image=self.failure_image)
        self.failure_image_label.pack(side=tk.LEFT)

        # terminal output frame
        # =============================================================
        self.output_frame = ttk.Labelframe(
            self.prompt_frame, text=_("Terminal Output"))
        self.output_frame.grid(row=1, column=0)

        self.output_text = tk.Text(
            self.output_frame, wrap=tk.WORD, width=100, height=6, state=tk.DISABLED)
        self.output_text.pack()

        # =============================================================
        # Left section: main application
        # =============================================================

        # drag and drop frame
        self.file_frame = ttk.Labelframe(
            self.left_frame, text=_("Drag and Drop Files Here"))
        self.file_frame.grid(row=0, column=0, columnspan=2, pady=(10, 40))

        # clear list button
        self.clear_list_button = ttk.Button(
            self.file_frame, text=_("Clear list"), command=self.clear_list)
        self.clear_list_button.grid(row=0, column=0, pady=(5, 5))

        # metadata button
        self.global_metadata_button = ttk.Button(
            self.file_frame, text=_("Metadata"), command=self.metadata)
        self.global_metadata_button.grid(row=0, column=1, pady=(5, 5))

        # listbox to display file names
        self.file_list = tk.Listbox(
            self.file_frame, width=37, height=9, font=("default", 11))
        self.file_list.grid(row=1, column=0, columnspan=2)

        # output format combobox label
        self.output_format_var = tk.StringVar(self)
        self.output_format_desc = ttk.Label(
            self.left_frame, text=_("Output format:"))
        self.output_format_desc.grid(
            row=1, column=0, padx=(20, 5), pady=10, sticky=tk.E)

        # output format combobox
        self.output_format_menu = ttk.Combobox(
            self.left_frame, width=8, textvariable=self.output_format_var, state="readonly")
        self.output_format_menu.grid(
            row=1, column=1, padx=(5, 20), pady=10, sticky=tk.W)

        # convert button
        self.convert_button = ttk.Button(
            self.left_frame, text=_("Convert"), command=self.convert_file_thread)
        self.convert_button.grid(row=2, column=0, columnspan=2, pady=10)

        # =============================================================
        # Right section: additional options
        # =============================================================

        # -------------------------------------------------------------
        # video codec options
        # -------------------------------------------------------------
        self.video_codec_frame = ttk.Frame(self.l_right_frame)

        # video codec label
        self.video_codec_label = ttk.Label(
            self.video_codec_frame, text=_("Video codec:"))
        self.video_codec_label.pack(anchor="w")

        # video codec combobox
        self.video_codec_var = tk.StringVar(self)
        self.video_codec_combobox = ttk.Combobox(
            self.video_codec_frame, textvariable=self.video_codec_var, state="readonly", width=self.combobox_width)
        self.video_codec_combobox.pack()

        # constant rate factor frame
        # =============================================================
        self.crf_frame = ttk.Frame(self.l_right_frame)

        # constant rate factor label
        self.crf_label = ttk.Label(
            self.crf_frame, text=_("Constant rate factor (CRF):"))
        self.crf_label.pack(anchor="w")

        # constant rate factor slide-bar
        self.crf_scale = ttk.Scale(
            self.crf_frame, length=self.scale_length, orient=tk.HORIZONTAL)
        self.crf_scale.pack(side=tk.LEFT, padx=(0, 10))

        # constant rate factor value label
        self.crf_value_label_text = tk.StringVar()
        self.crf_value_label = ttk.Label(
            self.crf_frame, textvariable=self.crf_value_label_text, width=4)
        self.crf_value_label.pack(side=tk.LEFT)

        # preset frame
        # =============================================================
        self.preset_frame = ttk.Frame(self.l_right_frame)

        # preset label
        self.preset_label = ttk.Label(self.preset_frame, text=_("Preset:"))
        self.preset_label.pack(anchor="w")

        # preset combobox
        self.preset_var = tk.StringVar(self)
        self.preset_combobox = ttk.Combobox(
            self.preset_frame, textvariable=self.preset_var, values=ffmpeg.widget_options["preset"], state="readonly", width=self.combobox_width)
        self.preset_combobox.pack(side=tk.LEFT)

        # tune frame
        # =============================================================
        self.tune_frame = ttk.Frame(self.l_right_frame)

        # tune label
        self.tune_label = ttk.Label(self.tune_frame, text=_("Tune:"))
        self.tune_label.pack(anchor="w")

        # tune combobox
        self.tune_var = tk.StringVar(self)
        self.tune_combobox = ttk.Combobox(
            self.tune_frame, textvariable=self.tune_var, values=[], state="readonly", width=self.combobox_width)
        self.tune_combobox.pack(side=tk.LEFT)

        # faststart frame
        # =============================================================
        self.faststart_frame = ttk.Frame(self.l_right_frame)

        # faststart label
        self.faststart_label = ttk.Label(
            self.faststart_frame, text=_("Faststart:"))
        self.faststart_label.pack(side=tk.LEFT, padx=(0, 10))

        # faststart checkbox
        self.faststart_var = tk.BooleanVar()
        self.faststart_checkbox = ttk.Checkbutton(
            self.faststart_frame, text="", variable=self.faststart_var)
        self.faststart_checkbox.pack(side=tk.LEFT)

        # speed frame
        # =============================================================
        self.speed_frame = ttk.Frame(self.l_right_frame)

        # speed label
        self.speed_label = ttk.Label(self.speed_frame, text=_("Speed:"))
        self.speed_label.pack(anchor="w")

        # speed slide-bar
        self.speed_scale = ttk.Scale(
            self.speed_frame, from_=-16, to_=16, length=self.scale_length, orient=tk.HORIZONTAL)
        self.speed_scale.pack(side=tk.LEFT, padx=(0, 10))

        # speed value label
        self.speed_value_label_text = tk.StringVar()
        self.speed_value_label = ttk.Label(
            self.speed_frame, textvariable=self.speed_value_label_text, width=4, anchor=tk.W)
        self.speed_value_label.pack(side=tk.LEFT)

        # sharpness frame
        # =============================================================
        self.sharpness_frame = ttk.Frame(self.l_right_frame)

        # sharpness label
        self.sharpness_label = ttk.Label(
            self.sharpness_frame, text=_("Sharpness:"))
        self.sharpness_label.pack(anchor="w")

        # sharpness slide-bar
        self.sharpness_scale = ttk.Scale(
            self.sharpness_frame, from_=-1, to_=7, length=self.scale_length, orient=tk.HORIZONTAL)
        self.sharpness_scale.pack(side=tk.LEFT, padx=(0, 10))

        # sharpness value label
        self.sharpness_value_label_text = tk.StringVar()
        self.sharpness_value_label = ttk.Label(
            self.sharpness_frame, textvariable=self.sharpness_value_label_text, width=4, anchor=tk.W)
        self.sharpness_value_label.pack(side=tk.LEFT)

        # motion estimation quality frame
        # =============================================================
        self.meq_frame = ttk.Frame(self.l_right_frame)

        # motion estimation quality label
        self.meq_label = ttk.Label(
            self.meq_frame, text=_("Motion estimation quality:"))
        self.meq_label.pack(anchor="w")

        # motion estimation quality slide-bar
        self.meq_scale = ttk.Scale(
            self.meq_frame, from_=0, to_=6, length=self.scale_length, orient=tk.HORIZONTAL)
        self.meq_scale.pack(side=tk.LEFT, padx=(0, 10))

        # motion estimation quality value label
        self.meq_value_label_text = tk.StringVar()
        self.meq_value_label = ttk.Label(
            self.meq_frame, textvariable=self.meq_value_label_text, width=4, anchor=tk.W)
        self.meq_value_label.pack(side=tk.LEFT)

        # global motion compensation label frame
        # =============================================================
        self.gmc_frame = ttk.Frame(self.l_right_frame)

        # global motion compensation label
        self.gmc_label = ttk.Label(
            self.gmc_frame, text=_("Global motion compensation:"))
        self.gmc_label.pack(side=tk.LEFT, padx=(0, 10))

        # global motion compensation checkbox
        self.gmc_var = tk.BooleanVar()
        self.gmc_checkbox = ttk.Checkbutton(
            self.gmc_frame, text="", variable=self.gmc_var)
        self.gmc_checkbox.pack(side=tk.LEFT)

        # lossless frame
        # =============================================================
        self.lossless_frame = ttk.Frame(self.l_right_frame)

        # lossless label
        self.lossless_label = ttk.Label(
            self.lossless_frame, text=_("Lossless:"))
        self.lossless_label.pack(side=tk.LEFT, padx=(0, 10))

        # lossless checkbox
        self.lossless_var = tk.BooleanVar()
        self.lossless_checkbox = ttk.Checkbutton(
            self.lossless_frame, text="", variable=self.lossless_var, command=self.check_crf_lossless_conflict)
        self.lossless_checkbox.pack(side=tk.LEFT)

        # adaptive quantization mode frame
        # =============================================================
        self.aqmode_frame = ttk.Frame(self.l_right_frame)

        # adaptive quantization mode label
        self.aqmode_label = ttk.Label(
            self.aqmode_frame, text=_("Adaptive quantization mode:"))
        self.aqmode_label.pack(anchor="w")

        # adaptive quantization mode combobox
        self.aqmode_var = tk.StringVar(self)
        self.aqmode_combobox = ttk.Combobox(
            self.aqmode_frame, textvariable=self.aqmode_var, values=list(ffmpeg.widget_options["aq_mode"].keys()), state="readonly", width=self.combobox_width)
        self.aqmode_combobox.pack(side=tk.LEFT)

        # motion estimation algorithm frame
        # =============================================================
        self.motionest_frame = ttk.Frame(self.l_right_frame)

        # motion estimation algorithm label
        self.motionest_label = ttk.Label(
            self.motionest_frame, text=_("Motion estimation algorithm:"))
        self.motionest_label.pack(anchor="w")

        # motion estimation algorithm combobox
        self.motionest_var = tk.StringVar(self)
        self.motionest_combobox = ttk.Combobox(
            self.motionest_frame, textvariable=self.motionest_var, values=list(ffmpeg.widget_options["motion_est"].keys()), state="readonly", width=self.combobox_width)
        self.motionest_combobox.pack(side=tk.LEFT)

        # -------------------------------------------------------------
        # audio codec options
        # -------------------------------------------------------------
        self.audio_codec_frame = ttk.Frame(self.r_right_frame)

        # audio codec label
        self.audio_codec_label = ttk.Label(
            self.audio_codec_frame, text=_("Audio codec:"))
        self.audio_codec_label.pack(anchor="w")

        # audio codec combobox
        self.audio_codec_var = tk.StringVar(self)
        self.audio_codec_combobox = ttk.Combobox(
            self.audio_codec_frame, textvariable=self.audio_codec_var, values=[], state="readonly", width=self.combobox_width)
        self.audio_codec_combobox.pack(side=tk.LEFT)

        # audio bitrate frame
        # =============================================================
        self.audio_bitrate_frame = ttk.Frame(self.r_right_frame)

        # audio bitrate label
        self.audio_bitrate_label = ttk.Label(
            self.audio_bitrate_frame, text=_("Audio bitrate:"))
        self.audio_bitrate_label.pack(anchor="w")

        # audio bitrate combobox
        self.audio_bitrate_var = tk.StringVar(self)
        self.audio_bitrate_combobox = ttk.Combobox(
            self.audio_bitrate_frame, textvariable=self.audio_bitrate_var, values=ffmpeg.widget_options["audio bitrate"], state="readonly", width=self.combobox_width)
        self.audio_bitrate_combobox.pack(side=tk.LEFT)

        # aac coding algorithm frame
        # =============================================================
        self.aac_coder_frame = ttk.Frame(self.r_right_frame)

        # aac coding algorithm label
        self.aac_coder_label = ttk.Label(
            self.aac_coder_frame, text=_("Coding algorithm:"))
        self.aac_coder_label.pack(anchor="w")

        # aac coding algorithm combobox
        self.aac_coder_var = tk.StringVar(self)
        self.aac_coder_combobox = ttk.Combobox(
            self.aac_coder_frame, textvariable=self.aac_coder_var, values=list(ffmpeg.widget_options["aac_coder"].keys()), state="readonly", width=self.combobox_width)
        self.aac_coder_combobox.pack(side=tk.LEFT)

        # LPC algorithm frame
        # =============================================================
        self.lpc_type_frame = ttk.Frame(self.r_right_frame)

        # LPC algorithm label
        self.lpc_type_label = ttk.Label(
            self.lpc_type_frame, text=_("LPC algorithm:"))
        self.lpc_type_label.pack(anchor="w")

        # LPC algorithm combobox
        self.lpc_type_var = tk.StringVar(self)
        self.lpc_type_combobox = ttk.Combobox(
            self.lpc_type_frame, textvariable=self.lpc_type_var, values=list(ffmpeg.widget_options["lpc_type"].keys()), state="readonly", width=self.combobox_width)
        self.lpc_type_combobox.pack(side=tk.LEFT)

        # stereo decorrelation mode frame
        # =============================================================
        self.ch_mode_frame = ttk.Frame(self.r_right_frame)

        # stereo decorrelation mode label
        self.ch_mode_label = ttk.Label(
            self.ch_mode_frame, text=_("Stereo decorrelation mode:"))
        self.ch_mode_label.pack(anchor="w")

        # stereo decorrelation mode combobox
        self.ch_mode_var = tk.StringVar(self)
        self.ch_mode_combobox = ttk.Combobox(
            self.ch_mode_frame, textvariable=self.ch_mode_var, values=list(ffmpeg.widget_options["ch_mode"].keys()), state="readonly", width=self.combobox_width)
        self.ch_mode_combobox.pack(side=tk.LEFT)

        # variable bit rate mode frame
        # =============================================================
        self.vbr_mode_frame = ttk.Frame(self.r_right_frame)

        # variable bit rate mode label
        self.vbr_mode_label = ttk.Label(
            self.vbr_mode_frame, text=_("Variable bit rate mode:"))
        self.vbr_mode_label.pack(anchor="w")

        # variable bit rate mode combobox
        self.vbr_mode_var = tk.StringVar(self)
        self.vbr_mode_combobox = ttk.Combobox(
            self.vbr_mode_frame, textvariable=self.vbr_mode_var, values=list(ffmpeg.widget_options["vbr"].keys()), state="readonly", width=self.combobox_width)
        self.vbr_mode_combobox.pack(side=tk.LEFT)

        # room type frame
        # =============================================================
        self.room_type_frame = ttk.Frame(self.r_right_frame)

        # room type label
        self.room_type_label = ttk.Label(
            self.room_type_frame, text=_("Room type:"))
        self.room_type_label.pack(anchor="w")

        # room type combobox
        self.room_type_var = tk.StringVar(self)
        self.room_type_combobox = ttk.Combobox(
            self.room_type_frame, textvariable=self.room_type_var, values=list(ffmpeg.widget_options["room_type"].keys()), state="readonly", width=self.combobox_width)
        self.room_type_combobox.pack(side=tk.LEFT)

        # mixing level frame
        # =============================================================
        self.mixing_level_frame = ttk.Frame(self.r_right_frame)

        # mixing level label
        self.mixing_level_label = ttk.Label(
            self.mixing_level_frame, text=_("Mixing level:"))
        self.mixing_level_label.pack(anchor="w")

        # mixing level slide-bar
        self.mixing_level_scale = ttk.Scale(
            self.mixing_level_frame, from_=80, to_=111, length=self.scale_length, orient=tk.HORIZONTAL)
        self.mixing_level_scale.pack(side=tk.LEFT, padx=(0, 10))

        # mixing level value label
        self.mixing_level_value_label_text = tk.StringVar()
        self.mixing_level_value_label = ttk.Label(
            self.mixing_level_frame, textvariable=self.mixing_level_value_label_text, width=4, anchor=tk.W)
        self.mixing_level_value_label.pack(side=tk.LEFT)

        # preferred stereo downmix mode frame
        # =============================================================
        self.dmix_frame = ttk.Frame(self.r_right_frame)

        # preferred stereo downmix mode label
        self.dmix_label = ttk.Label(
            self.dmix_frame, text=_("Preferred stereo downmix mode:"))
        self.dmix_label.pack(anchor="w")

        # preferred stereo downmix mode combobox
        self.dmix_var = tk.StringVar(self)
        self.dmix_combobox = ttk.Combobox(
            self.dmix_frame, textvariable=self.dmix_var, values=list(ffmpeg.widget_options["dmix_mode"].keys()), state="readonly", width=self.combobox_width)
        self.dmix_combobox.pack(side=tk.LEFT)

        # dolby surround mode frame
        # =============================================================
        self.dsur_frame = ttk.Frame(self.r_right_frame)

        # dolby surround mode label
        self.dsur_label = ttk.Label(
            self.dsur_frame, text=_("Dolby surround mode:"))
        self.dsur_label.pack(anchor="w")

        # dolby surround mode combobox
        self.dsur_var = tk.StringVar()
        self.dsur_combobox = ttk.Combobox(
            self.dsur_frame, textvariable=self.dsur_var, values=list(ffmpeg.widget_options["dsur_mode"].keys()), state="readonly", width=self.combobox_width)
        self.dsur_combobox.pack(side=tk.LEFT)

        # dolby surround EX mode frame
        # =============================================================
        self.dsurex_frame = ttk.Frame(self.r_right_frame)

        # dolby surround EX mode label
        self.dsurex_label = ttk.Label(
            self.dsurex_frame, text=_("Dolby surround EX mode:"))
        self.dsurex_label.pack(anchor="w")

        # dolby surround EX mode combobox
        self.dsurex_var = tk.StringVar()
        self.dsurex_combobox = ttk.Combobox(
            self.dsurex_frame, textvariable=self.dsurex_var, values=list(ffmpeg.widget_options["dsurex_mode"].keys()), state="readonly", width=self.combobox_width)
        self.dsurex_combobox.pack(side=tk.LEFT)

        # dolby headphone mode frame
        # =============================================================
        self.dheadphone_frame = ttk.Frame(self.r_right_frame)

        # dolby headphone mode label
        self.dheadphone_label = ttk.Label(
            self.dheadphone_frame, text=_("Dolby headphone mode:"))
        self.dheadphone_label.pack(anchor="w")

        # dolby headphone mode combobox
        self.dheadphone_var = tk.StringVar()
        self.dheadphone_combobox = ttk.Combobox(
            self.dheadphone_frame, textvariable=self.dheadphone_var, values=list(ffmpeg.widget_options["dheadphone_mode"].keys()), state="readonly", width=self.combobox_width)
        self.dheadphone_combobox.pack(side=tk.LEFT)

        # sample rate frame
        # =============================================================
        self.sample_rate_frame = ttk.Frame(self.r_right_frame)

        # sample rate label
        self.sample_rate_label = ttk.Label(
            self.sample_rate_frame, text=_("Sample rate:"))
        self.sample_rate_label.pack(anchor="w")

        # sample rate combobox
        self.sample_rate_var = tk.StringVar()
        self.sample_rate_combobox = ttk.Combobox(
            self.sample_rate_frame, textvariable=self.sample_rate_var, values=[], state="readonly", width=self.combobox_width)
        self.sample_rate_combobox.pack(side=tk.LEFT)

        # -------------------------------------------------------------
        # image options
        # -------------------------------------------------------------

        # image quality frame
        # =============================================================
        self.image_quality_frame = ttk.Frame(self.l_right_frame)

        # image quality label
        self.image_quality_label = ttk.Label(
            self.image_quality_frame, text=_("Quality:"))
        self.image_quality_label.pack(anchor="w")

        # image quality slide-bar
        self.image_quality_scale = ttk.Scale(
            self.image_quality_frame, from_=0, to_=31, length=self.scale_length, orient=tk.HORIZONTAL)
        self.image_quality_scale.pack(side=tk.LEFT, padx=(0, 10))

        # image quality value label
        self.image_quality_value_label_text = tk.StringVar()
        self.image_quality_value_label = ttk.Label(
            self.image_quality_frame, textvariable=self.image_quality_value_label_text, width=4, anchor=tk.W)
        self.image_quality_value_label.pack(side=tk.LEFT)

        # image scale frame
        # =============================================================
        self.image_scale_frame = ttk.Frame(self.l_right_frame)

        # image scale label
        self.image_scale_label = ttk.Label(
            self.image_scale_frame, text=_("Resize:"))
        self.image_scale_label.pack(anchor="w")

        # image scale entry (w)
        self.image_scale_w_var = tk.StringVar()
        self.image_scale_w_entry = ttk.Entry(
            self.image_scale_frame, textvariable=self.image_scale_w_var, width=self.entry_splitted_width)
        self.image_scale_w_entry.pack(side=tk.LEFT)

        self.image_scale_x = ttk.Label(self.image_scale_frame, text="x")
        self.image_scale_x.pack(side=tk.LEFT, padx=(15, 15))

        # image scale entry (h)
        self.image_scale_h_var = tk.StringVar()
        self.image_scale_h_entry = ttk.Entry(
            self.image_scale_frame, textvariable=self.image_scale_h_var, width=self.entry_splitted_width)
        self.image_scale_h_entry.pack(side=tk.LEFT)

        # image rotate frame
        # =============================================================
        self.image_rotate_frame = ttk.Frame(self.l_right_frame)

        # image rotate label
        self.image_rotate_label = ttk.Label(
            self.image_rotate_frame, text=_("Rotation:"))
        self.image_rotate_label.pack(anchor="w")

        # image rotate entry
        self.image_rotate_var = tk.StringVar()
        self.image_rotate_entry = ttk.Entry(
            self.image_rotate_frame, textvariable=self.image_rotate_var, width=self.entry_width)
        self.image_rotate_entry.pack(side=tk.LEFT)

        # image preset frame
        # =============================================================
        self.image_preset_frame = ttk.Frame(self.l_right_frame)

        # image preset label
        self.image_preset_label = ttk.Label(
            self.image_preset_frame, text=_("Preset:"))
        self.image_preset_label.pack(anchor="w")

        # image preset combobox
        self.image_preset_var = tk.StringVar(self)
        self.image_preset_combobox = ttk.Combobox(
            self.image_preset_frame, textvariable=self.image_preset_var, values=list(ffmpeg.widget_options["image_preset"].keys()), state="readonly", width=self.combobox_width)
        self.image_preset_combobox.pack(side=tk.LEFT)

        # webp quality frame
        # =============================================================
        self.webp_quality_frame = ttk.Frame(self.l_right_frame)

        # webp quality label
        self.webp_quality_label = ttk.Label(
            self.webp_quality_frame, text=_("Quality:"))
        self.webp_quality_label.pack(anchor="w")

        # webp quality slide-bar
        self.webp_quality_scale = ttk.Scale(
            self.webp_quality_frame, from_=0, to_=100, length=self.scale_length, orient=tk.HORIZONTAL)
        self.webp_quality_scale.pack(side=tk.LEFT, padx=(0, 10))

        # webp quality value label
        self.webp_quality_value_label_text = tk.StringVar()
        self.webp_quality_value_label = ttk.Label(
            self.webp_quality_frame, textvariable=self.webp_quality_value_label_text, width=4, anchor=tk.W)
        self.webp_quality_value_label.pack(side=tk.LEFT)

        # -------------------------------------------------------------
        # pdf options
        # -------------------------------------------------------------

        # combine pdf frame
        # =============================================================
        self.combine_pdf_frame = ttk.Frame(self.l_right_frame)

        # combine pdf label
        self.combine_pdf_label = ttk.Label(
            self.combine_pdf_frame, text=_("Combine files:"))
        self.combine_pdf_label.pack(side=tk.LEFT, padx=(0, 10))

        # combine pdf checkbox
        self.combine_pdf_var = tk.BooleanVar()
        self.combine_pdf_checkbox = ttk.Checkbutton(
            self.combine_pdf_frame, variable=self.combine_pdf_var)
        self.combine_pdf_checkbox.pack(side=tk.LEFT)

        # user password frame
        # =============================================================
        self.user_password_frame = ttk.Frame(self.l_right_frame)

        # user password label
        self.user_password_label = ttk.Label(
            self.user_password_frame, text=_("Set user password:"))
        self.user_password_label.pack(anchor="w")

        # user password entry
        self.user_password_var = tk.StringVar()
        self.user_password_entry = ttk.Entry(
            self.user_password_frame, textvariable=self.user_password_var, width=self.entry_width)
        self.user_password_entry.pack(side=tk.LEFT)

        # owner password frame
        # =============================================================
        self.owner_password_frame = ttk.Frame(self.l_right_frame)

        # owner password label
        self.owner_password_label = ttk.Label(
            self.owner_password_frame, text=_("Set owner password:"))
        self.owner_password_label.pack(anchor="w")

        # owner password entry
        self.owner_password_var = tk.StringVar()
        self.owner_password_entry = ttk.Entry(
            self.owner_password_frame, textvariable=self.owner_password_var, width=self.entry_width)
        self.owner_password_entry.pack(side=tk.LEFT)

        # metadata frame
        # =============================================================
        self.metadata_frame = ttk.Frame(self.l_right_frame)

        # metadata label
        self.metadata_label = ttk.Label(
            self.metadata_frame, text=_("Encrypt metadata:"))
        self.metadata_label.pack(side=tk.LEFT, padx=(0, 10))

        # metadata checkbox
        self.metadata_var = tk.BooleanVar()
        self.metadata_checkbox = ttk.Checkbutton(
            self.metadata_frame, variable=self.metadata_var)
        self.metadata_checkbox.pack(side=tk.LEFT)

        # permission frame
        # =============================================================
        self.permissions_frame = ttk.Labelframe(
            self.r_right_frame, text=_("Permissions"), padding=(20, 5, 10, 10))
        self.permissions_frame.grid_columnconfigure(0, pad=10)

        # accessibility label
        self.accessibility_label = ttk.Label(
            self.permissions_frame, text=_("Accessibility:"))
        self.accessibility_label.grid(row=0, column=0, sticky="w")

        # accessibility checkbox
        self.accessibility_var = tk.BooleanVar()
        self.accessibility_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.accessibility_var)
        self.accessibility_checkbox.grid(row=0, column=1)

        # extract label
        self.extract_label = ttk.Label(
            self.permissions_frame, text=_("Extract content:"))
        self.extract_label.grid(row=1, column=0, sticky="w")

        # extract checkbox
        self.extract_var = tk.BooleanVar()
        self.extract_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.extract_var)
        self.extract_checkbox.grid(row=1, column=1)

        # annotation label
        self.annotation_label = ttk.Label(
            self.permissions_frame, text=_("Modify annotation:"))
        self.annotation_label.grid(row=2, column=0, sticky="w")

        # annotation checkbox
        self.annotation_var = tk.BooleanVar()
        self.annotation_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.annotation_var)
        self.annotation_checkbox.grid(row=2, column=1)

        # assembly label
        self.assembly_label = ttk.Label(
            self.permissions_frame, text=_("Modify assembly:"))
        self.assembly_label.grid(row=3, column=0, sticky="w")

        # assembly checkbox
        self.assembly_var = tk.BooleanVar()
        self.assembly_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.assembly_var)
        self.assembly_checkbox.grid(row=3, column=1)

        # form label
        self.form_label = ttk.Label(
            self.permissions_frame, text=_("Modify form:"))
        self.form_label.grid(row=4, column=0, sticky="w")

        # form checkbox
        self.form_var = tk.BooleanVar()
        self.form_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.form_var)
        self.form_checkbox.grid(row=4, column=1)

        # other label
        self.other_label = ttk.Label(
            self.permissions_frame, text=_("Modify other:"))
        self.other_label.grid(row=5, column=0, sticky="w")

        # other checkbox
        self.other_var = tk.BooleanVar()
        self.other_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.other_var)
        self.other_checkbox.grid(row=5, column=1)

        # print at lower resolution label
        self.p_lower_label = ttk.Label(
            self.permissions_frame, text=_("Print at lower resolution:"))
        self.p_lower_label.grid(row=6, column=0, sticky="w")

        # print at lower resolution checkbox
        self.p_lower_var = tk.BooleanVar()
        self.p_lower_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.p_lower_var)
        self.p_lower_checkbox.grid(row=6, column=1)

        # print at higher resolution label
        self.p_higher_label = ttk.Label(
            self.permissions_frame, text=_("Print at higher resolution:"))
        self.p_higher_label.grid(row=7, column=0, sticky="w")

        # print at higher resolution checkbox
        self.p_higher_var = tk.BooleanVar()
        self.p_higher_checkbox = ttk.Checkbutton(
            self.permissions_frame, variable=self.p_higher_var)
        self.p_higher_checkbox.grid(row=7, column=1)

        # dpi frame
        # =============================================================
        self.dpi_frame = ttk.Frame(self.l_right_frame)

        # dpi label
        self.dpi_label = ttk.Label(
            self.dpi_frame, text=_("DPI:"))
        self.dpi_label.pack(anchor="w")

        # dpi entry
        self.dpi_var = tk.StringVar()
        self.dpi_entry = ttk.Entry(
            self.dpi_frame, textvariable=self.dpi_var, width=self.entry_width)
        self.dpi_entry.pack(side=tk.LEFT)

        # jpeg quality frame
        # =============================================================
        self.jpeg_quality_frame = ttk.Frame(self.l_right_frame)

        # jpeg quality label
        self.jpeg_quality_label = ttk.Label(
            self.jpeg_quality_frame, text=_("Image quality:"))
        self.jpeg_quality_label.pack(anchor="w")

        # jpeg quality slide-bar
        self.jpeg_quality_scale = ttk.Scale(
            self.jpeg_quality_frame, from_=0, to_=100, length=self.scale_length, orient=tk.HORIZONTAL)
        self.jpeg_quality_scale.pack(side=tk.LEFT, padx=(0, 10))

        # jpeg quality value label
        self.jpeg_quality_value_label_text = tk.StringVar()
        self.jpeg_quality_value_label = ttk.Label(
            self.jpeg_quality_frame, textvariable=self.jpeg_quality_value_label_text, width=4, anchor=tk.W)
        self.jpeg_quality_value_label.pack(side=tk.LEFT)

        # pdf optimize frame
        # =============================================================
        self.pdf_optimize_frame = ttk.Frame(self.l_right_frame)

        # pdf optimize label
        self.pdf_optimize_label = ttk.Label(
            self.pdf_optimize_frame, text=_("Optimize image size:"))
        self.pdf_optimize_label.pack(side=tk.LEFT, padx=(0, 10))

        # pdf optimize checkbox
        self.pdf_optimize_var = tk.BooleanVar()
        self.pdf_optimize_checkbox = ttk.Checkbutton(
            self.pdf_optimize_frame, variable=self.pdf_optimize_var)
        self.pdf_optimize_checkbox.pack(side=tk.LEFT)

        # =============================================================
        # Event binding
        # =============================================================

        # main application
        self.file_list.bind("<Button-1>", self.on_click)
        self.file_list.drop_target_register(DND_FILES)
        self.file_list.dnd_bind('<<Drop>>', self.on_drop)
        self.output_format_menu.bind(
            "<<ComboboxSelected>>", self.toggle_output_options)

        # additional options
        self.video_codec_combobox.bind(
            "<<ComboboxSelected>>", self.toggle_video_codec_options)
        self.audio_codec_combobox.bind(
            "<<ComboboxSelected>>", self.toggle_audio_codec_options)
        self.crf_scale.bind("<B1-Motion>", self.update_crf_value)
        self.crf_scale.bind("<ButtonRelease-1>",
                            self.check_crf_lossless_conflict)
        self.speed_scale.bind("<B1-Motion>", self.update_speed_value)
        self.sharpness_scale.bind("<B1-Motion>", self.update_sharpness_value)
        self.meq_scale.bind("<B1-Motion>", self.update_meq_value)
        self.mixing_level_scale.bind(
            "<B1-Motion>", self.update_mixing_level_value)
        self.image_quality_scale.bind(
            "<B1-Motion>", self.update_image_quality_value)
        self.webp_quality_scale.bind(
            "<B1-Motion>", self.update_webp_quality_value)
        self.jpeg_quality_scale.bind(
            "<B1-Motion>", self.update_jpeg_quality_value)

        # =============================================================
        # Codec widget mapping
        # =============================================================

        self.option_defaults = {
            self.video_codec_frame: (self.video_codec_var, ""),
            self.audio_codec_frame: (self.audio_codec_var, ""),

            # video options [2:13]
            self.crf_frame: (self.crf_scale, lambda: (self.crf_value_label_text.set(""), self.crf_scale.set(-1))),
            self.preset_frame: (self.preset_var, ""),
            self.tune_frame: (self.tune_var, ""),
            self.faststart_frame: (self.faststart_var, False),
            self.speed_frame: (self.speed_scale, lambda: (self.speed_value_label_text.set(""), self.speed_scale.set(1))),
            self.sharpness_frame: (self.sharpness_scale, lambda: (self.sharpness_value_label_text.set(""), self.sharpness_scale.set(-1))),
            self.meq_frame: (self.meq_scale, lambda: (self.meq_value_label_text.set(""), self.meq_scale.set(4))),
            self.gmc_frame: (self.gmc_var, False),
            self.lossless_frame: (self.lossless_var, False),
            self.aqmode_frame: (self.aqmode_var, ""),
            self.motionest_frame: (self.motionest_var, ""),

            # audio options [13:25]
            self.audio_bitrate_frame: (self.audio_bitrate_var, ""),
            self.aac_coder_frame: (self.aac_coder_var, ""),
            self.lpc_type_frame: (self.lpc_type_var, ""),
            self.ch_mode_frame: (self.ch_mode_var, ""),
            self.vbr_mode_frame: (self.vbr_mode_var, ""),
            self.room_type_frame: (self.room_type_var, ""),
            self.mixing_level_frame: (self.mixing_level_scale, lambda: (self.mixing_level_value_label_text.set(""), self.mixing_level_scale.set(0))),
            self.dmix_frame: (self.dmix_var, ""),
            self.dsur_frame: (self.dsur_var, ""),
            self.dsurex_frame: (self.dsurex_var, ""),
            self.dheadphone_frame: (self.dheadphone_var, ""),
            self.sample_rate_frame: (self.sample_rate_var, ""),

            # image options [25:31]
            self.image_quality_frame: (self.image_quality_scale, lambda: (
                self.image_quality_value_label_text.set(""), self.image_quality_scale.set(9))),
            self.image_scale_frame: (self.image_scale_frame, lambda: (
                self.image_scale_w_var.set(""), self.image_scale_h_var.set(""))),
            self.image_rotate_frame: (self.image_rotate_var, ""),
            self.webp_quality_frame: (self.webp_quality_scale, lambda: (
                self.webp_quality_value_label_text.set(""), self.webp_quality_scale.set(75))),
            self.lossless_frame: (self.lossless_var, False),
            self.image_preset_frame: (self.image_preset_var, ""),

            # pdf options [31:]
            self.combine_pdf_frame: (self.combine_pdf_var, False),
            self.user_password_frame: (self.user_password_var, ""),
            self.owner_password_frame: (self.owner_password_var, ""),
            self.metadata_frame: (self.metadata_var, False),
            self.permissions_frame: (self.permissions_frame, lambda: (self.accessibility_var.set(True), self.extract_var.set(True), self.annotation_var.set(
                True), self.assembly_var.set(True), self.form_var.set(True), self.other_var.set(True), self.p_lower_var.set(True), self.p_higher_var.set(True))),
            self.jpeg_quality_frame: (self.jpeg_quality_scale, lambda: (self.jpeg_quality_value_label_text.set(""), self.jpeg_quality_scale.set(75))),
            self.dpi_frame: (self.dpi_var, ""),
            self.pdf_optimize_frame: (self.pdf_optimize_var, False)
        }

        self.video_codecs = {
            "H.264/MPEG-4": [self.crf_frame, self.preset_frame, self.tune_frame],
            "H.265/HEVC": [self.crf_frame, self.preset_frame, self.tune_frame],
            "ProRes": [],
            "Xvid": [self.meq_frame, self.gmc_frame],
            "VP8": [self.crf_frame, self.speed_frame, self.sharpness_frame],
            "VP9": [self.crf_frame, self.speed_frame, self.sharpness_frame, self.lossless_frame],
            "AV1": [self.crf_frame, self.aqmode_frame],
            "H.263": [self.motionest_frame],
            "MPEG-4 pt.2 MS v.3": [self.motionest_frame],
            "Windows Media Video 8": [self.motionest_frame],
            "Windows Media Video 7": [self.motionest_frame]
        }

        self.audio_codecs = {
            "MP3": [self.audio_bitrate_frame],
            "AAC": [self.audio_bitrate_frame, self.aac_coder_frame],
            "FLAC": [self.audio_bitrate_frame, self.lpc_type_frame, self.ch_mode_frame],
            "MP2": [self.audio_bitrate_frame],
            "PCM 16-bit": [],
            "PCM 24-bit": [],
            "PCM 32-bit": [],
            "ALAC": [],
            "Vorbis": [self.audio_bitrate_frame],
            "Opus": [self.audio_bitrate_frame, self.vbr_mode_frame],
            "WMA": [self.audio_bitrate_frame],

            "AC-3": [self.audio_bitrate_frame, self.room_type_frame, self.mixing_level_frame, self.dmix_frame, self.dsur_frame, self.dsurex_frame, self.dheadphone_frame],
            "ADPCM": [self.audio_bitrate_frame, self.sample_rate_frame],
            "Nellymoser Asao": [self.audio_bitrate_frame, self.sample_rate_frame]
        }

        self.image_options = {
            ".jpeg": [self.image_quality_frame, self.image_scale_frame, self.image_rotate_frame],
            ".png": [self.image_scale_frame, self.image_rotate_frame],
            ".webp": [self.image_scale_frame, self.image_rotate_frame, self.image_preset_frame, self.webp_quality_frame, self.lossless_frame],
            ".bmp": [self.image_scale_frame, self.image_rotate_frame],
            ".tiff": [self.image_scale_frame, self.image_rotate_frame],
            ".ico": [self.image_rotate_frame]
        }

        self.pdf_options = {
            ".pdf": [self.combine_pdf_frame, self.user_password_frame, self.owner_password_frame, self.metadata_frame, self.permissions_frame],
            ".jpeg": [self.dpi_frame, self.jpeg_quality_frame, self.pdf_optimize_frame]
        }

        self.language_options = {
            "English (US)": "en_US",
            "简体中文": "zh_CN"
        }

        self.theme_options = {
            _("dark"): "dark",
            _("light"): "light"
        }

        self.right_frame.grid_forget()

    # =============================================================
    # Main application functions
    # =============================================================

    def open_settings(self):
        if self.settings_window is None or not self.settings_window.winfo_exists():
            self.settings_window = tk.Toplevel(self)
            self.settings_window.title(_("Settings"))
            self.settings_window.iconbitmap(
                resource_path("assets/setting.ico"))
            self.settings_window.columnconfigure(0, weight=1)
            self.settings_window.rowconfigure(0, weight=1)

            window_width, window_height = 300, 200
            self.settings_window.geometry(f"{window_width}x{window_height}")
            self.settings_window.resizable(False, False)

            # Center the settings window to be inside of main app window
            main_x = self.winfo_x()
            main_y = self.winfo_y()
            main_width = self.winfo_width()
            main_height = self.winfo_height()
            center_x = int(main_x + (main_width - window_width) / 2)
            center_y = int(main_y + (main_height - window_height) / 2)
            self.settings_window.geometry(f"+{center_x}+{center_y}")

            # languages frame
            # =============================================================
            self.languages_frame = ttk.Frame(self.settings_window)

            # languages label
            self.languages_label = ttk.Label(
                self.languages_frame, text=_("Language:"))
            self.languages_label.pack(anchor="w")

            # languages combobox
            self.languages_var = tk.StringVar()
            for key, value in self.language_options.items():
                if value == self.settings["language"]:
                    self.languages_var.set(key)

            self.languages_combobox = ttk.Combobox(
                self.languages_frame, textvariable=self.languages_var, values=list(self.language_options.keys()), state="readonly", width=20)
            self.languages_combobox.pack(side=tk.LEFT)

            # theme frame
            # =============================================================
            self.theme_frame = ttk.Frame(self.settings_window)

            # theme label
            self.theme_label = ttk.Label(
                self.theme_frame, text=_("Theme:"))
            self.theme_label.pack(anchor="w")

            # theme combobox
            self.theme_var = tk.StringVar()
            for key, value in self.theme_options.items():
                if value == self.settings["theme"]:
                    self.theme_var.set(key)

            self.theme_combobox = ttk.Combobox(
                self.theme_frame, textvariable=self.theme_var, values=list(self.theme_options.keys()), state="readonly", width=20)
            self.theme_combobox.pack(side=tk.LEFT)

            # apply button
            # =============================================================
            apply_button = ttk.Button(
                self.settings_window, text=_("Apply"), command=self.apply_settings)

            self.languages_frame.grid(row=0, column=0, pady=(20, 0))
            self.theme_frame.grid(row=1, column=0, pady=(10, 0))
            apply_button.grid(row=2, column=0, padx=(
                0, 20), pady=(20, 20), sticky=tk.E)

    def apply_settings(self):
        self.settings["language"] = self.language_options[self.languages_var.get()]
        self.settings["theme"] = self.theme_options[self.theme_var.get()]
        other.apply_settings(self.settings)
        messagebox.showinfo(_("Attention"), _(
            "Please restart the application to apply settings"))

    def update_file_list(self):
        for file in self.file_paths:
            self.total_file_paths.append(file)
            self.file_list.insert(tk.END, os.path.basename(file))

    def update_output_format_options(self):
        file_extensions = [os.path.splitext(
            file)[1] for file in self.file_paths]
        categories = []

        for ext in file_extensions:
            ext = ext.lower()
            if ext in list(ffmpeg.video_formats.keys()):
                categories.append("Video")
            elif ext in list(ffmpeg.audio_formats.keys()):
                categories.append("Audio")
            elif ext in ffmpeg.image_formats + [".jpg"]:
                categories.append("Image")
            elif ext in other.ncm_input:
                categories.append("NetEase")
            elif ext == ".pdf":
                categories.append("PDF")
            else:
                categories.append("Unknown")

        unique_categories = set(categories)

        if len(unique_categories) > 1:
            messagebox.showerror(
                _("Error"), _("Please select files from the same category"))
            self.output_format_var.set("")
            self.delete_inserted_files()
            return

        elif "Unknown" in unique_categories:
            messagebox.showerror(_("Error"), _(
                "Unsupported file type(s) selected"))
            self.output_format_var.set("")
            self.delete_inserted_files()
            return

        temp_category = unique_categories.pop()

        if self.category:
            if temp_category != self.category:
                messagebox.showerror(
                    _("Error"), _("Please select files from the same category"))
                self.output_format_var.set("")
                self.delete_inserted_files()
                return
        else:
            self.category = temp_category

        if self.category == "Video":
            self.output_format_options = list(ffmpeg.video_formats.keys())
        elif self.category == "Audio":
            self.output_format_options = list(ffmpeg.audio_formats.keys())
        elif self.category == "Image":
            self.output_format_options = ffmpeg.image_formats
        elif self.category == "NetEase":
            self.output_format_options = other.ncm_output
        elif self.category == "PDF":
            self.output_format_options = other.pdf_output

        self.output_format_menu['values'] = self.output_format_options
        self.output_format_var.set(self.output_format_options[0])

        self.toggle_output_options(event=None)

    def delete_inserted_files(self):
        for i in range(len(self.file_paths)):
            self.total_file_paths.pop()
            self.file_list.delete(tk.END)

    def reset(self):
        self.output_format_menu['values'] = []
        self.output_format_var.set("")
        self.category = ""

    def clear_list(self):
        self.total_file_paths.clear()
        self.file_list.delete(0, tk.END)
        self.reset()

    def on_click(self, event):
        self.file_paths = filedialog.askopenfilenames()
        if self.file_paths:
            self.update_file_list()
            self.update_output_format_options()
            self.success_frame.grid_forget()
            self.failure_frame.grid_forget()

    def on_drop(self, event):
        pattern = r'\{[^}]*\}|[^ ]*'
        self.file_paths = re.findall(pattern, event.data)
        self.file_paths = [path.strip('{}')
                           for path in self.file_paths if path]
        if self.file_paths:
            self.update_file_list()
            self.update_output_format_options()
            self.success_frame.grid_forget()
            self.failure_frame.grid_forget()

    def convert_file(self):
        self.success_frame.grid_forget()
        self.failure_frame.grid_forget()

        # preconditions before converting
        if not self.total_file_paths:
            return
        if not self.check_roomtype_mixinglevel_both_selected():
            return
        if not self.check_required_sample_rate():
            return

        output_format = self.output_format_var.get()

        # load the converting widget
        self.convert_button.configure(state=tk.DISABLED)
        self.loading_frame.grid(row=0, column=0)
        self.loading_label_text.set(_("Converting..."))
        self.start_loading_animation()

        try:
            if self.category == "PDF":
                stderr = other.pdf_convert(self.total_file_paths, output_format, self.combine_pdf_var.get(), self.user_password_var.get(), self.owner_password_var.get(), self.accessibility_var.get(), self.extract_var.get(), self.annotation_var.get(
                ), self.assembly_var.get(), self.form_var.get(), self.other_var.get(), self.p_lower_var.get(), self.p_higher_var.get(), self.metadata_var.get(), self.dpi_var.get(), self.jpeg_quality_value_label_text.get(), self.pdf_optimize_var.get())
                if type(stderr) == list:
                    self.insert_to_output_text(stderr)
                    for err in stderr:
                        if err:
                            raise RuntimeError(
                                _("Error during converting, please see terminal output for details"))

            else:
                for file_path in self.total_file_paths:
                    if self.category == "Video":
                        stderr = ffmpeg.ffmpeg_video(file_path, output_format, self.video_codec_var.get(), self.crf_value_label_text.get(), self.preset_var.get(), self.tune_var.get(), self.faststart_var.get(), self.speed_value_label_text.get(), self.sharpness_value_label_text.get(), self.meq_value_label_text.get(), self.gmc_var.get(), self.lossless_var.get(), self.aqmode_var.get(
                        ), self.motionest_var.get(), self.audio_codec_var.get(), self.audio_bitrate_var.get(), self.aac_coder_var.get(), self.lpc_type_var.get(), self.ch_mode_var.get(), self.vbr_mode_var.get(), self.room_type_var.get(), self.mixing_level_value_label_text.get(), self.dmix_var.get(), self.dsur_var.get(), self.dsurex_var.get(), self.dheadphone_var.get(), self.sample_rate_var.get())
                        self.insert_to_output_text([stderr])
                        if stderr.strip().endswith("Conversion failed!"):
                            raise RuntimeError(
                                _("Error during converting, please see terminal output for details"))

                    elif self.category == "Audio":
                        stderr = ffmpeg.ffmpeg_audio(file_path, output_format, self.audio_codec_var.get(), self.audio_bitrate_var.get(
                        ), self.aac_coder_var.get(), self.lpc_type_var.get(), self.ch_mode_var.get(), self.vbr_mode_var.get())
                        self.insert_to_output_text([stderr])
                        if stderr.strip().endswith("Conversion failed!"):
                            raise RuntimeError(
                                _("Error during converting, please see terminal output for details"))

                    elif self.category == "Image":
                        stderr = ffmpeg.ffmpeg_image(file_path, output_format, self.image_quality_value_label_text.get(), self.image_scale_w_var.get(), self.image_scale_h_var.get(
                        ), self.image_rotate_var.get(), self.lossless_var.get(), self.image_preset_var.get(), self.webp_quality_value_label_text.get())
                        if stderr != -1:
                            self.insert_to_output_text([stderr])
                            if stderr.strip().endswith("Conversion failed!"):
                                raise RuntimeError(
                                    _("Error during converting, please see terminal output for details"))

                    elif self.category == "NetEase":
                        other.ncm_convert(file_path)

        # conversion failed
        except Exception as e:
            messagebox.showerror(_("Error"), e)
            self.loading_frame.grid_forget()
            self.stop_loading_animation()
            self.convert_button.configure(state=tk.NORMAL)
            self.failure_frame.grid(row=0, column=0)
            return

        # conversion successful
        self.loading_frame.grid_forget()
        self.stop_loading_animation()
        self.clear_list()
        self.convert_button.configure(state=tk.NORMAL)
        self.success_frame.grid(row=0, column=0)

    def insert_to_output_text(self, text):
        self.output_text.config(state=tk.NORMAL)
        self.output_text.insert(tk.END, "\n")
        for t in text:
            self.output_text.insert(tk.END, t)
        self.output_text.see(tk.END)
        self.output_text.config(state=tk.DISABLED)

    # center prompt area based on number of columns in row 1 of main frame
    def update_prompt_frame_span(self):
        num_columns = len(self.main_frame.grid_slaves(row=1))
        self.prompt_frame.grid_configure(columnspan=num_columns)

    def convert_file_thread(self):
        conversion_thread = threading.Thread(target=self.convert_file)
        conversion_thread.start()

    def metadata(self):
        if not self.total_file_paths:
            return

        for file_path in self.total_file_paths:
            # known issue: exiftool can't process non ascii characters
            results = {}
            try:
                process = subprocess.Popen([resource_path("dependency/exiftool.exe"), file_path], stdout=subprocess.PIPE,
                                           stderr=subprocess.STDOUT, universal_newlines=True, creationflags=subprocess.CREATE_NO_WINDOW)
                for output in process.stdout:
                    results[output.split(": ")[0].strip()] = output.split(": ")[
                        1].strip()
            except (IndexError, UnicodeDecodeError):
                messagebox.showerror(_("Error"), _(
                    "Known issue: exiftool can't process non ascii characters in filename or in metadata, please try renaming the file"))
                break

            if self.category == "Video":
                data = ["File Name", "File Size", "Duration", "File Modification Date/Time", "File Access Date/Time", "File Creation Date/Time", "Image Width", "Image Height",
                        "File Type", "MIME Type", "Major Brand", "Format", "Bit Depth", "Video Frame Rate", "Audio Format", "Audio Channels", "Audio Sample Rate", "Audio Bits Per Sample"]
            elif self.category == "Audio":
                data = ["File Name", "File Size", "Duration", "File Modification Date/Time", "File Access Date/Time", "File Creation Date/Time",
                        "File Type", "MIME Type", "Audio Bitrate", "Sample Rate", "Channel Mode", "Album", "Artist", "Title", "Picture MIME Type"]
            elif self.category == "Image":
                data = ["File Name", "File Size", "File Modification Date/Time", "File Creation Date/Time",
                        "Image Width", "Image Height", "File Type", "MIME Type", "Color Type", "Bit Depth"]
            elif self.category == "NetEase":
                data = []
            elif self.category == "PDF":
                data = ["File Name", "File Size", "File Modification Date/Time", "File Access Date/Time",
                        "File Creation Date/Time", "File Type", "MIME Type", "Page Count", "Title", "Creator", "Author", "Company"]

            self.metadata_window = tk.Toplevel(self)
            self.metadata_window.title(_("Metadata"))
            self.metadata_window.iconbitmap(
                resource_path("assets/metadata.ico"))
            self.metadata_window.resizable(False, False)
            self.metadata_window.columnconfigure(0, weight=1)
            self.metadata_window.rowconfigure(0, weight=1)

            self.meta_frame = ttk.Frame(self.metadata_window)
            self.meta_frame.pack(padx=20, pady=20)

            row_num = 0
            for item in data:
                try:
                    self.meta_label_l = ttk.Label(
                        self.meta_frame, text=_(item))
                    self.meta_label_m = ttk.Label(self.meta_frame, text=" : ")
                    self.meta_label_r = ttk.Label(
                        self.meta_frame, text=results[item])

                    self.meta_label_l.grid(row=row_num, column=0, sticky='w')
                    self.meta_label_m.grid(row=row_num, column=1, sticky='w')
                    self.meta_label_r.grid(row=row_num, column=2, sticky='w')
                    self.meta_frame.grid_rowconfigure(row_num, pad=5)
                    row_num += 1
                except KeyError:
                    pass

    # =============================================================
    # Additional options functions
    # =============================================================

    def reset_widgets(self):
        for widget, (variable, default_value) in self.option_defaults.items():
            widget.forget()
            if callable(default_value):
                default_value()
            else:
                variable.set(default_value)

    def reset_selected_widget(self, widget):
        widget.forget()
        widget_to_reset, default_value = self.option_defaults[widget]
        if callable(default_value):
            default_value()
        else:
            widget_to_reset.set(default_value)

    def toggle_output_options(self, event):
        self.reset_widgets()
        self.right_frame.grid(row=1, column=1, padx=(50, 0))
        self.l_right_frame.grid(row=0, column=0, padx=(10, 10))
        self.r_right_frame.grid(row=0, column=1, padx=(10, 10))

        # set netease options (None)
        if self.category == "NetEase":
            self.right_frame.grid_forget()

        # set video codec options based on output format
        elif self.category == "Video":
            self.video_codec_frame.pack(pady=(10, 0), anchor=tk.W)
            self.video_codec_combobox["values"] = list(ffmpeg.video_formats[self.output_format_var.get(
            )]["video"].keys())

            self.audio_codec_frame.pack(pady=(10, 0), anchor=tk.W)
            self.audio_codec_combobox["values"] = list(ffmpeg.video_formats[self.output_format_var.get(
            )]["audio"].keys())

        # set audio codec options based on output format
        elif self.category == "Audio":
            self.audio_codec_frame.pack(pady=(10, 0), anchor=tk.W)
            self.audio_codec_combobox["values"] = list(
                ffmpeg.audio_formats[self.output_format_var.get()].keys())
            self.l_right_frame.grid_forget()

        # set image widgets based on output format
        elif self.category == "Image":
            # modify slicing when changing number of widgets
            temp = list(self.option_defaults.keys())[25:31]
            for widget in temp:
                self.reset_selected_widget(widget)
            widgets = self.image_options[self.output_format_var.get()]
            if widgets:
                for widget in widgets:
                    widget.pack(pady=(10, 0), anchor=tk.W)
                self.r_right_frame.grid_forget()
            else:
                self.right_frame.grid_forget()

        # set pdf options
        elif self.category == "PDF":
            temp = list(self.option_defaults.keys())[31:]
            for widget in temp:
                self.reset_selected_widget(widget)
            widgets = self.pdf_options[self.output_format_var.get()]
            for widget in widgets:
                widget.pack(pady=(10, 0), anchor=tk.W)
            if self.output_format_var.get() == ".jpeg":
                self.r_right_frame.grid_forget()

        self.update_prompt_frame_span()

    def toggle_video_codec_options(self, event):
        # modify slicing when changing number of widgets
        temp = list(self.option_defaults.keys())[2:13]
        for widget in temp:
            self.reset_selected_widget(widget)
        for widget in self.video_codecs[self.video_codec_var.get()]:
            widget.pack(pady=(10, 0), anchor=tk.W)

        # handle cases where same widget has different values based on video codec
        if self.output_format_var.get() in [".mp4", ".mov"]:
            self.faststart_frame.pack(pady=(10, 0), anchor=tk.W)
        if self.video_codec_var.get() in list(ffmpeg.widget_options["crf"].keys()):
            crf_range = ffmpeg.widget_options["crf"][self.video_codec_var.get(
            )]
            self.crf_scale.configure(from_=crf_range[0], to=crf_range[1])
        if self.video_codec_var.get() in list(ffmpeg.widget_options["tune"].keys()):
            self.tune_combobox["values"] = ffmpeg.widget_options["tune"][self.video_codec_var.get(
            )]

    def toggle_audio_codec_options(self, event):
        # modify slicing when changing number of widgets
        temp = list(self.option_defaults.keys())[13:25]
        for widget in temp:
            self.reset_selected_widget(widget)
        for widget in self.audio_codecs[self.audio_codec_var.get()]:
            widget.pack(pady=(10, 0), anchor=tk.W)

        # handle cases where same widget has different values based on audio codec
        if self.audio_codec_var.get() in list(ffmpeg.widget_options["sample_rate"].keys()):
            self.sample_rate_combobox["values"] = ffmpeg.widget_options["sample_rate"][self.audio_codec_var.get(
            )]

    def update_crf_value(self, event):
        self.crf_value_label_text.set(str(int(self.crf_scale.get())))

    def update_speed_value(self, event):
        self.speed_value_label_text.set(str(int(self.speed_scale.get())))

    def update_sharpness_value(self, event):
        self.sharpness_value_label_text.set(
            str(int(self.sharpness_scale.get())))

    def update_meq_value(self, event):
        self.meq_value_label_text.set(str(int(self.meq_scale.get())))

    def update_image_quality_value(self, event):
        self.image_quality_value_label_text.set(
            str(int(self.image_quality_scale.get())))

    def update_webp_quality_value(self, event):
        self.webp_quality_value_label_text.set(
            str(int(self.webp_quality_scale.get())))

    def update_mixing_level_value(self, event):
        self.mixing_level_value_label_text.set(
            str(int(self.mixing_level_scale.get())))

    def update_jpeg_quality_value(self, event):
        self.jpeg_quality_value_label_text.set(
            str(int(self.jpeg_quality_scale.get())))

    def check_crf_lossless_conflict(self, event=None):
        if self.crf_value_label_text.get() and self.lossless_var.get():
            messagebox.showerror(
                _("Error"), _("Lossless shouldn't be used with a CRF value"))
            self.crf_scale.set(23)
            self.crf_value_label_text.set("")
            self.lossless_var.set(False)

    def check_roomtype_mixinglevel_both_selected(self):
        if self.room_type_var.get() and not self.mixing_level_value_label_text.get():
            messagebox.showerror(
                _("Error"), _("Mixing level must be set if room type is set"))
            return False
        else:
            return True

    def check_required_sample_rate(self):
        sample_rate_dependent_codec = list(
            ffmpeg.widget_options["sample_rate"].keys())
        if self.audio_codec_var.get() in sample_rate_dependent_codec and not self.sample_rate_var.get():
            messagebox.showerror(_("Error"), _("Please select a sample rate"))
            return False
        return True

    # =============================================================
    # Prompt functions
    # =============================================================

    def update_loading_animation(self, step=0):
        if not self.loading_animation_running:
            return

        for i in range(self.num_lines):
            if i < step or i >= step + self.highlighted_lines:
                color = "gray"
            else:
                color = "blue"
            self.loading_canvas.itemconfigure(self.lines[i], fill=color)
        next_step = (step + 1) % (self.num_lines - self.highlighted_lines + 1)
        self.loading_canvas.after(
            100, self.update_loading_animation, next_step)

    def stop_loading_animation(self):
        self.loading_animation_running = False

    def start_loading_animation(self):
        self.loading_animation_running = True
        self.update_loading_animation()


def run_app():
    app = UniversalConverter()
    app.eval('tk::PlaceWindow . center')
    app.mainloop()


def resource_path(relative_path):
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath('.'), relative_path)
