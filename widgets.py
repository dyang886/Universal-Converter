from main import get_translator

_ = get_translator()

widget_options = {
    # general widgets
    "checkbox":
    {
        True: 1,
        False: 0,
    },

    # video widgets
    "preset":
    {
        "Ultrafast": "ultrafast",
        "Superfast": "superfast",
        "Veryfast": "veryfast",
        "Faster": "faster",
        "Fast": "fast",
        "Medium": "medium",
        "Slow": "slow",
        "Slower": "slower",
        "Veryslow": "veryslow"
    },
    "tune":
    {
        "H.264/MPEG-4":
        {
            "Film": "film",
            "Animation": "animation",
            "Grain": "grain",
            "Still Image": "stillimage",
            "Fast Decode": "fastdecode",
            "Zero Latency": "zerolatency"
        },
        "H.265/HEVC":
        {
            "Animation": "animation",
            "Grain": "grain",
            "Fast Decode": "fastdecode",
            "Zero Latency": "zerolatency"
        }
    },
    "aq_mode":
    {
        "None": "0",
        "Variance": "1",
        "Complexity": "2",
        "Cyclic": "3"
    },
    "motion_est":
    {
        "Zero": "0",
        "EPZS": "1",
        "Xone": "2"
    },

    # audio widgets
    "audio_bitrate":
    {
        "64 kbps": "64k",
        "128 kbps": "128k",
        "192 kbps": "192k",
        "256 kbps": "256k",
        "320 kbps": "320k"
    },
    "aac_coder":
    {
        "Two Loop": "1",
        "Fast": "2"
    },
    "lpc_type":
    {
        "None": "0",
        "Fixed": "1",
        "Levinson": "2",
        "Cholesky": "3"
    },
    "ch_mode":
    {
        "Auto": "-1",
        "Independent": "0",
        "Left Side": "1",
        "Right Side": "2",
        "Mid Side": "3"
    },
    "vbr":
    {
        "Constant Bit Rate": "0",
        "Variable Bit Rate": "1",
        "Constrained VBR": "2"
    },
    "room_type":
    {
        "Not Indicated": "0",
        "Large Room": "1",
        "Small Room": "2"
    },
    "dmix_mode":
    {
        "Not Indicated": "0",
        "Lt/Rt Downmix Preferred": "1",
        "Lo/Ro Downmix Preferred": "2",
        "Dolby Pro Logic II Downmix Preferred": "3"
    },
    "dsur_mode":
    {
        "Not Indicated": "0",
        "Not Dolby Surround Encoded": "1",
        "Dolby Surround Encoded": "2"
    },
    "dsurex_mode":
    {
        "Not Indicated": "0",
        "Not Dolby Surround EX Encoded": "1",
        "Dolby Surround EX Encoded": "2",
        "Dolby Pro Logic IIz-Encoded": "3"
    },
    "dheadphone_mode":
    {
        "Not Indicated": "0",
        "Not Dolby Headphone Encoded": "1",
        "Dolby Headphone Encoded": "2"
    },
    "sample_rate":
    {
        "ADPCM":
        {
            "11025 Hz": "11025",
            "22050 Hz": "22050",
            "44100 Hz": "44100"
        },
        "Nellymoser Asao":
        {
            "8000 Hz": "8000",
            "16000 Hz": "16000",
            "11025 Hz": "11025",
            "22050 Hz": "22050",
            "44100 Hz": "44100"
        }
    },

    # image widgets
    "image_preset":
    {
        "None": "-1",
        "Default": "0",
        "Picture": "1",
        "Photo": "2",
        "Drawing": "3",
        "Icon": "4",
        "Text": "5",
    },
}

# format template: "": {"arg": "", "label": _(""), "type": "", "options": },
widget_configs = {
    # video widgets (using ffmpeg)
    "crf_v1": {"arg": "-crf", "label": _("CRF (Constant Rate Factor):"), "type": "slider", "options": (0, 51)},
    "crf_v2": {"arg": "-crf", "label": _("CRF (Constant Rate Factor):"), "type": "slider", "options": (0, 63)},
    "preset": {"arg": "-preset", "label": _("Preset:"), "type": "combobox", "options": widget_options["preset"]},
    "tune_h264": {"arg": "-tune", "label": _("Tune:"), "type": "combobox", "options": widget_options["tune"]["H.264/MPEG-4"]},
    "tune_h265": {"arg": "-tune", "label": _("Tune:"), "type": "combobox", "options": widget_options["tune"]["H.265/HEVC"]},
    "me_quality": {"arg": "-me_quality", "label": _("Motion Estimation Quality:"), "type": "slider", "options": (0, 6)},
    "gmc": {"arg": "-gmc", "label": _("Global Motion Compensation:"), "type": "checkbox", "options": widget_options["checkbox"], "default": False},
    "speed": {"arg": "-speed", "label": _("Speed:"), "type": "slider", "options": (-16, 16)},
    "sharpness": {"arg": "-sharpness", "label": _("Sharpness:"), "type": "slider", "options": (-1, 7)},
    "lossless": {"arg": "-lossless", "label": _("Lossless:"), "type": "checkbox", "options": widget_options["checkbox"], "default": False},
    "aq-mode": {"arg": "-aq-mode", "label": _("Adaptive Quantization Mode:"), "type": "combobox", "options": widget_options["aq_mode"]},
    "motion_est": {"arg": "-motion_est", "label": _("Motion Estimation Algorithm:"), "type": "combobox", "options": widget_options["motion_est"]},

    # audio widgets (using ffmpeg)
    "audio_bitrate": {"arg": "-b:a", "label": _("Bitrate:"), "type": "combobox", "options": widget_options["audio_bitrate"]},
    "aac_coder": {"arg": "-aac_coder", "label": _("AAC Coding Algorithm:"), "type": "combobox", "options": widget_options["aac_coder"]},
    "room_type": {"arg": "-room_type", "label": _("Room Type:"), "type": "combobox", "options": widget_options["room_type"]},
    "mixing_level": {"arg": "-mixing_level", "label": _("Mixing Level:"), "type": "slider", "options": (80, 111)},
    "dmix_mode": {"arg": "-dmix_mode", "label": _("preferred Stereo Downmix Mode:"), "type": "combobox", "options": widget_options["dmix_mode"]},
    "dsur_mode": {"arg": "-dsur_mode", "label": _("Dolby Surround Mode:"), "type": "combobox", "options": widget_options["dsur_mode"]},
    "dsurex_mode": {"arg": "-dsurex_mode", "label": _("Dolby Surround EX Mode:"), "type": "combobox", "options": widget_options["dsurex_mode"]},
    "dheadphone_mode": {"arg": "-dheadphone_mode", "label": _("Dolby Headphone Mode:"), "type": "combobox", "options": widget_options["dheadphone_mode"]},
    "vbr": {"arg": "-vbr", "label": _("Variable Bit Rate Mode:"), "type": "combobox", "options": widget_options["vbr"]},
    "lpc_type": {"arg": "-lpc_type", "label": _("LPC Algorithm:"), "type": "combobox", "options": widget_options["lpc_type"]},
    "ch_mode": {"arg": "-ch_mode", "label": _("Stereo Decorrelation Mode:"), "type": "combobox", "options": widget_options["ch_mode"]},
    "sample_rate_v1": {"arg": "-ar", "label": _("Sample Rate:"), "type": "combobox", "options": widget_options["sample_rate"]["ADPCM"]},
    "sample_rate_v2": {"arg": "-ar", "label": _("Sample Rate:"), "type": "combobox", "options": widget_options["sample_rate"]["Nellymoser Asao"]},

    # image widgets (using imagemagick)
    "img_quality": {"arg": "-quality", "label": _("Image Quality:"), "type": "slider", "options": (0, 100)},
    "img_resize": {"arg": "-resize", "value_template": "{arg0}x{arg1}", "label": _("Image Resize:"), "type": "textinput", "options": [_("Image width"), _("Image height")]},
    "img_rotate": {"arg": "-rotate", "label": _("Image Rotation:"), "type": "textinput", "options": [_("Rotation angle (0-360°, clockwise)")]},
    "img_sharpen": {"arg": "-sharpen", "value_template": "0x{arg0}", "label": _("Image Sharpness:"), "type": "slider", "options": (0, 100)},
    "img_blur": {"arg": "-blur", "value_template": "0x{arg0}", "label": _("Image Blur:"), "type": "slider", "options": (0, 100)},
    "img_brightness": {"arg": "-modulate", "label": _("Image Brightness (%):"), "type": "textinput", "options": [_("% of brightness (100 means no change)")]},
    "alpha_fill": {"arg": "-background", "label": _("Transparency Fill:"), "type": "textinput", "options": [_("Color hex value (defaults to white)")]},
    "gif_delay": {"arg": "-delay", "label": _("Frame Delay:"), "type": "textinput", "options": [_("Delay between frames (10 for 0.1s)")]},
    "gif_loop": {"arg": "-loop", "label": _("Loop Count:"), "type": "textinput", "options": [_("Number of loops (0 for infinite)")]},
}

video_formats = {
    ".mp4":
    {
        "video":
        {
            "H.264/MPEG-4":
            {
                "value": "libx264",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h264": widget_configs["tune_h264"],
                }
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h265": widget_configs["tune_h265"],
                }
            }
        },
        "audio":
        {
            "AAC":
            {
                "value": "aac",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "aac_coder": widget_configs["aac_coder"],
                }
            },
            "MP3":
            {
                "value": "libmp3lame",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            },
            "AC-3":
            {
                "value": "ac3",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "room_type": widget_configs["room_type"],
                    "mixing_level": widget_configs["mixing_level"],
                    "dmix_mode": widget_configs["dmix_mode"],
                    "dsur_mode": widget_configs["dsur_mode"],
                    "dsurex_mode": widget_configs["dsurex_mode"],
                    "dheadphone_mode": widget_configs["dheadphone_mode"],
                }
            }
        }
    },
    ".mov":
    {
        "video":
        {
            "H.264/MPEG-4":
            {
                "value": "libx264",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h264": widget_configs["tune_h264"],
                }
            },
            "ProRes":
            {
                "value": "prores",
                "widgets": {}
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h265": widget_configs["tune_h265"],
                }
            }
        },
        "audio": {
            "AAC":
            {
                "value": "aac",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "aac_coder": widget_configs["aac_coder"],
                }
            },
            "ALAC":
            {
                "value": "alac",
                "widgets": {}
            },
            "AC-3":
            {
                "value": "ac3",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "room_type": widget_configs["room_type"],
                    "mixing_level": widget_configs["mixing_level"],
                    "dmix_mode": widget_configs["dmix_mode"],
                    "dsur_mode": widget_configs["dsur_mode"],
                    "dsurex_mode": widget_configs["dsurex_mode"],
                    "dheadphone_mode": widget_configs["dheadphone_mode"],
                }
            }
        }
    },
    ".avi":
    {
        "video":
        {
            "Xvid":
            {
                "value": "libxvid",
                "widgets":
                {
                    "me_quality": widget_configs["me_quality"],
                    "gmc": widget_configs["gmc"],
                }
            },
            "H.264/MPEG-4":
            {
                "value": "libx264",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h264": widget_configs["tune_h264"],
                }
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h265": widget_configs["tune_h265"],
                }
            }
        },
        "audio":
        {
            "MP3":
            {
                "value": "libmp3lame",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            },
            "AC-3":
            {
                "value": "ac3",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "room_type": widget_configs["room_type"],
                    "mixing_level": widget_configs["mixing_level"],
                    "dmix_mode": widget_configs["dmix_mode"],
                    "dsur_mode": widget_configs["dsur_mode"],
                    "dsurex_mode": widget_configs["dsurex_mode"],
                    "dheadphone_mode": widget_configs["dheadphone_mode"],
                }
            },
            "WMA":
            {
                "value": "wmav2",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            }
        }
    },
    ".mkv":
    {
        "video":
        {
            "H.264/MPEG-4":
            {
                "value": "libx264",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h264": widget_configs["tune_h264"],
                }
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf_v1": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune_h265": widget_configs["tune_h265"],
                }
            },
            "VP9":
            {
                "value": "libvpx-vp9",
                "widgets":
                {
                    "crf_v2": widget_configs["crf_v2"],
                    "speed": widget_configs["speed"],
                    "sharpness": widget_configs["sharpness"],
                    "lossless": widget_configs["lossless"],
                }
            },
            "VP8":
            {
                "value": "libvpx",
                "widgets":
                {
                    "crf_v2": widget_configs["crf_v2"],
                    "speed": widget_configs["speed"],
                    "sharpness": widget_configs["sharpness"],
                }
            },
            "AV1":
            {
                "value": "libaom-av1",
                "widgets":
                {
                    "crf_v2": widget_configs["crf_v2"],
                    "aq-mode": widget_configs["aq-mode"],
                }
            }
        },
        "audio":
        {
            "AAC":
            {
                "value": "aac",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "aac_coder": widget_configs["aac_coder"],
                }
            },
            "MP3":
            {
                "value": "libmp3lame",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            },
            "Opus":
            {
                "value": "libopus",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "vbr": widget_configs["vbr"],
                }
            },
            "Vorbis":
            {
                "value": "libvorbis",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            },
            "FLAC":
            {
                "value": "flac",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "lpc_type": widget_configs["lpc_type"],
                    "ch_mode": widget_configs["ch_mode"],
                }
            },
            "ALAC":
            {
                "value": "alac",
                "widgets": {}
            },
            "AC-3":
            {
                "value": "ac3",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "room_type": widget_configs["room_type"],
                    "mixing_level": widget_configs["mixing_level"],
                    "dmix_mode": widget_configs["dmix_mode"],
                    "dsur_mode": widget_configs["dsur_mode"],
                    "dsurex_mode": widget_configs["dsurex_mode"],
                    "dheadphone_mode": widget_configs["dheadphone_mode"],
                }
            }
        }
    },
    ".webm":
    {
        "video":
        {
            "VP9":
            {
                "value": "libvpx-vp9",
                "widgets":
                {
                    "crf_v2": widget_configs["crf_v2"],
                    "speed": widget_configs["speed"],
                    "sharpness": widget_configs["sharpness"],
                    "lossless": widget_configs["lossless"],
                }
            },
            "VP8":
            {
                "value": "libvpx",
                "widgets":
                {
                    "crf_v2": widget_configs["crf_v2"],
                    "speed": widget_configs["speed"],
                    "sharpness": widget_configs["sharpness"],
                }
            },
            "AV1":
            {
                "value": "libaom-av1",
                "widgets":
                {
                    "crf_v2": widget_configs["crf_v2"],
                    "aq-mode": widget_configs["aq-mode"],
                }
            }
        },
        "audio":
        {
            "Opus":
            {
                "value": "libopus",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "vbr": widget_configs["vbr"],
                }
            },
            "Vorbis":
            {
                "value": "libvorbis",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            }
        }
    },
    ".flv":
    {
        "video":
        {
            "H.263":
            {
                "value": "flv1",
                "widgets":
                {
                    "motion_est": widget_configs["motion_est"],
                }
            }
        },
        "audio":
        {
            "MP3":
            {
                "value": "libmp3lame",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            },
            "ADPCM":
            {
                "value": "adpcm_swf",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "sample_rate_v1": widget_configs["sample_rate_v1"],
                }
            },
            "Nellymoser Asao":
            {
                "value": "nellymoser",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "sample_rate_v2": widget_configs["sample_rate_v2"],
                }
            }
        }
    },
    ".wmv":
    {
        "video":
        {
            "MPEG-4 pt.2 MS v.3":
            {
                "value": "msmpeg4",
                "widgets":
                {
                    "motion_est": widget_configs["motion_est"],
                }
            },
            "Windows Media Video 8":
            {
                "value": "wmv2",
                "widgets":
                {
                    "motion_est": widget_configs["motion_est"],
                }
            },
            "Windows Media Video 7":
            {
                "value": "wmv1",
                "widgets":
                {
                    "motion_est": widget_configs["motion_est"],
                }
            }
        },
        "audio":
        {
            "WMA":
            {
                "value": "wmav2",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                }
            }
        }
    }
}

audio_formats = {
    ".mp3":
    {
        "MP3":
        {
            "value": "libmp3lame",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
            }
        },
    },
    ".aac":
    {
        "AAC":
        {
            "value": "aac",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
                "aac_coder": widget_configs["aac_coder"],
            }
        },
    },
    ".mpeg":
    {
        "MP2":
        {
            "value": "mp2",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
            }
        },
        "MP3":
        {
            "value": "libmp3lame",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
            }
        }
    },
    ".wav":
    {
        "PCM 16-bit":
        {
            "value": "pcm_s16le",
            "widgets": {}
        },
        "PCM 24-bit":
        {
            "value": "pcm_s24le",
            "widgets": {}
        },
        "PCM 32-bit":
        {
            "value": "pcm_s32le",
            "widgets": {}
        }
    },
    ".flac":
    {
        "FLAC":
        {
            "value": "flac",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
                "lpc_type": widget_configs["lpc_type"],
                "ch_mode": widget_configs["ch_mode"],
            }
        }
    },
    ".m4a":
    {
        "AAC":
        {
            "value": "aac",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
                "aac_coder": widget_configs["aac_coder"],
            }
        },
        "ALAC":
        {
            "value": "alac",
            "widgets": {}
        }
    },
    ".ogg":
    {
        "Opus":
        {
            "value": "libopus",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
                "vbr": widget_configs["vbr"],
            }
        },
        "Vorbis":
        {
            "value": "libvorbis",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
            }
        }
    },
    ".wma":
    {
        "WMA":
        {
            "value": "wmav2",
            "widgets":
            {
                "audio_bitrate": widget_configs["audio_bitrate"],
            }
        }
    }
}

image_formats = {
    ".jpeg":
    {
        "supports_alpha": False,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
            "alpha_fill": widget_configs["alpha_fill"],
        }
    },
    ".jxr":
    {
        "supports_alpha": False,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
            "alpha_fill": widget_configs["alpha_fill"],
        }
    },
    ".png":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".svg":
    {
        "supports_alpha": False,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
            "alpha_fill": widget_configs["alpha_fill"],
        }
    },
    ".webp":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".heic":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".bmp":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".tiff":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".eps":
    {
        "supports_alpha": False,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
            "alpha_fill": widget_configs["alpha_fill"],
        }
    },
    ".psd":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".ico":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
        }
    },
    ".gif":
    {
        "supports_alpha": False,
        "widgets":
        {
            "img_quality": widget_configs["img_quality"],
            "img_resize": widget_configs["img_resize"],
            "img_rotate": widget_configs["img_rotate"],
            "img_sharpen": widget_configs["img_sharpen"],
            "img_blur": widget_configs["img_blur"],
            "img_brightness": widget_configs["img_brightness"],
            "alpha_fill": widget_configs["alpha_fill"],
            "gif_delay": widget_configs["gif_delay"],
            "gif_loop": widget_configs["gif_loop"],
        }
    }
}

ncm_formats = {
    ".ncm":
    {
        "widgets": {}
    }
}

# Using values to set keys
detected_file_types = {
    "video": list(video_formats.keys()),
    "audio": list(audio_formats.keys()),
    "image": list(image_formats.keys()) + [".jpg", ".tif"],
    "ncm": list(ncm_formats.keys()),
    "doc": [".pdf"],
}

# Using keys to set values
displayed_file_types = {
    "video": list(video_formats.keys()),
    "audio": list(audio_formats.keys()),
    "image": list(image_formats.keys()),
    "ncm": [".mp3"],
    "doc": [],
}
