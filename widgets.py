from main import get_translator

_ = get_translator()

widget_options = {
    # video widgets
    "preset":
    [
        {"label": "Ultrafast", "value": "ultrafast"},
        {"label": "Superfast", "value": "superfast"},
        {"label": "Veryfast", "value": "veryfast"},
        {"label": "Faster", "value": "faster"},
        {"label": "Fast", "value": "fast"},
        {"label": "Medium", "value": "medium"},
        {"label": "Slow", "value": "slow"},
        {"label": "Slower", "value": "slower"},
        {"label": "Veryslow", "value": "veryslow"},
    ],
    "tune":
    {
        "H.264/MPEG-4":
        [
            {"label": "Film", "value": "film"},
            {"label": "Animation", "value": "animation"},
            {"label": "Grain", "value": "grain"},
            {"label": "Still Image", "value": "stillimage"},
            {"label": "Fast Decode", "value": "fastdecode"},
            {"label": "Zero Latency", "value": "zerolatency"},
        ],
        "H.265/HEVC":
        [
            {"label": "Animation", "value": "animation"},
            {"label": "Grain", "value": "grain"},
            {"label": "Fast Decode", "value": "fastdecode"},
            {"label": "Zero Latency", "value": "zerolatency"},
        ]
    },
    "aq_mode":
    [
        {"label": "None", "value": "0"},
        {"label": "Variance", "value": "1"},
        {"label": "Complexity", "value": "2"},
        {"label": "Cyclic", "value": "3"},
    ],
    "motion_est":
    [
        {"label": "Zero", "value": "0"},
        {"label": "EPZS", "value": "1"},
        {"label": "Xone", "value": "2"},
    ],

    # audio widgets
    "audio_bitrate":
    [
        {"label": "64 kbps", "value": "64k"},
        {"label": "128 kbps", "value": "128k"},
        {"label": "192 kbps", "value": "192k"},
        {"label": "256 kbps", "value": "256k"},
        {"label": "320 kbps", "value": "320k"},
    ],
    "aac_coder":
    [
        {"label": "Two Loop", "value": "1"},
        {"label": "Fast", "value": "2"},
    ],
    "lpc_type":
    [
        {"label": "None", "value": "0"},
        {"label": "Fixed", "value": "1"},
        {"label": "Levinson", "value": "2"},
        {"label": "Cholesky", "value": "3"},
    ],
    "ch_mode":
    [
        {"label": "Auto", "value": "-1"},
        {"label": "Independent", "value": "0"},
        {"label": "Left Side", "value": "1"},
        {"label": "Right Side", "value": "2"},
        {"label": "Mid Side", "value": "3"},
    ],
    "vbr":
    [
        {"label": "Constant Bit Rate", "value": "0"},
        {"label": "Variable Bit Rate", "value": "1"},
        {"label": "Constrained VBR", "value": "2"},
    ],
    "room_type":
    [
        {"label": "Not Indicated", "value": "0"},
        {"label": "Large Room", "value": "1"},
        {"label": "Small Room", "value": "2"},
    ],
    "dmix_mode":
    [
        {"label": "Not Indicated", "value": "0"},
        {"label": "Lt/Rt Downmix Preferred", "value": "1"},
        {"label": "Lo/Ro Downmix Preferred", "value": "2"},
        {"label": "Dolby Pro Logic II Downmix Preferred", "value": "3"},
    ],
    "dsur_mode":
    [
        {"label": "Not Indicated", "value": "0"},
        {"label": "Not Dolby Surround Encoded", "value": "1"},
        {"label": "Dolby Surround Encoded", "value": "2"},
    ],
    "dsurex_mode":
    [
        {"label": "Not Indicated", "value": "0"},
        {"label": "Not Dolby Surround EX Encoded", "value": "1"},
        {"label": "Dolby Surround EX Encoded", "value": "2"},
        {"label": "Dolby Pro Logic IIz-Encoded", "value": "3"},
    ],
    "dheadphone_mode":
    [
        {"label": "Not Indicated", "value": "0"},
        {"label": "Not Dolby Headphone Encoded", "value": "1"},
        {"label": "Dolby Headphone Encoded", "value": "2"},
    ],
    "sample_rate":
    {
        "ADPCM":
        [
            {"label": "11025 Hz", "value": "11025"},
            {"label": "22050 Hz", "value": "22050"},
            {"label": "44100 Hz", "value": "44100"},
        ],
        "Nellymoser Asao":
        [
            {"label": "8000 Hz", "value": "8000"},
            {"label": "16000 Hz", "value": "16000"},
            {"label": "11025 Hz", "value": "11025"},
            {"label": "22050 Hz", "value": "22050"},
            {"label": "44100 Hz", "value": "44100"},
        ]
    },

    # image widgets
    "image_preset":
    [
        {"label": "None", "value": "-1"},
        {"label": "Default", "value": "0"},
        {"label": "Picture", "value": "1"},
        {"label": "Photo", "value": "2"},
        {"label": "Drawing", "value": "3"},
        {"label": "Icon", "value": "4"},
        {"label": "Text", "value": "5"},
    ],
}

# format template: "": {"arg": "", "label": _(""), "type": "", "options": },
widget_configs = {
    # video widgets (using ffmpeg)
    "crf_v1": {"arg": "-crf", "label": _("CRF (Constant Rate Factor)"), "type": "slidebar", "options": (0, 51)},
    "crf_v2": {"arg": "-crf", "label": _("CRF (Constant Rate Factor)"), "type": "slidebar", "options": (0, 63)},
    "preset": {"arg": "-preset", "label": _("Preset"), "type": "combobox", "options": widget_options["preset"]},
    "tune_h264": {"arg": "-tune", "label": _("Tune"), "type": "combobox", "options": widget_options["tune"]["H.264/MPEG-4"]},
    "tune_h265": {"arg": "-tune", "label": _("Tune"), "type": "combobox", "options": widget_options["tune"]["H.265/HEVC"]},
    "me_quality": {"arg": "-me_quality", "label": _("Motion Estimation Quality"), "type": "slidebar", "options": (0, 6)},
    "gmc": {"arg": "-gmc", "label": _("Global Motion Compensation"), "type": "checkbox", "options": False},
    "speed": {"arg": "-speed", "label": _("Speed"), "type": "slidebar", "options": (-16, 16)},
    "sharpness": {"arg": "-sharpness", "label": _("Sharpness"), "type": "slidebar", "options": (-1, 7)},
    "lossless": {"arg": "-lossless", "label": _("Lossless"), "type": "checkbox", "options": False},
    "aq-mode": {"arg": "-aq-mode", "label": _("Adaptive Quantization Mode"), "type": "combobox", "options": widget_options["aq_mode"]},
    "motion_est": {"arg": "-motion_est", "label": _("Motion Estimation Algorithm"), "type": "combobox", "options": widget_options["motion_est"]},

    # audio widgets (using ffmpeg)
    "audio_bitrate": {"arg": "-b:a", "label": _("Bitrate"), "type": "combobox", "options": widget_options["audio_bitrate"]},
    "aac_coder": {"arg": "-aac_coder", "label": _("AAC Coding Algorithm"), "type": "combobox", "options": widget_options["aac_coder"]},
    "room_type": {"arg": "-room_type", "label": _("Room Type"), "type": "combobox", "options": widget_options["room_type"]},
    "mixing_level": {"arg": "-mixing_level", "label": _("Mixing Level"), "type": "slidebar", "options": (80, 111)},
    "dmix_mode": {"arg": "-dmix_mode", "label": _("preferred Stereo Downmix Mode"), "type": "combobox", "options": widget_options["dmix_mode"]},
    "dsur_mode": {"arg": "-dsur_mode", "label": _("Dolby Surround Mode:"), "type": "combobox", "options": widget_options["dsur_mode"]},
    "dsurex_mode": {"arg": "-dsurex_mode", "label": _("Dolby Surround EX Mode:"), "type": "combobox", "options": widget_options["dsurex_mode"]},
    "dheadphone_mode": {"arg": "-dheadphone_mode", "label": _("Dolby Headphone Mode:"), "type": "combobox", "options": widget_options["dheadphone_mode"]},
    "vbr": {"arg": "-vbr", "label": _("Variable Bit Rate Mode"), "type": "combobox", "options": widget_options["vbr"]},
    "lpc_type": {"arg": "-lpc_type", "label": _("LPC Algorithm"), "type": "combobox", "options": widget_options["lpc_type"]},
    "ch_mode": {"arg": "-ch_mode", "label": _("Stereo Decorrelation Mode"), "type": "combobox", "options": widget_options["ch_mode"]},
    "sample_rate_v1": {"arg": "-ar", "label": _("Sample Rate"), "type": "combobox", "options": widget_options["sample_rate"]["ADPCM"]},
    "sample_rate_v2": {"arg": "-ar", "label": _("Sample Rate"), "type": "combobox", "options": widget_options["sample_rate"]["Nellymoser Asao"]},

    # image widgets (using imagemagick)
    "img_quality": {"arg": "-q:v", "label": _("Image Quality"), "type": "slidebar", "options": (0, 31)},
    "img_scale": {"arg": "-vf scale={arg0}:{arg1}", "label": _("Image Scale"), "type": "textinput_pair", "options": ("Image width", "Image height")},
    "img_rotate": {"label": _("Image Rotation"), "type": "textinput", "options": "Rotation angle (0-360°, clockwise)"},
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
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h264"],
                }
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h265"],
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
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h264"],
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
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h265"],
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
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h264"],
                }
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h265"],
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
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h264"],
                }
            },
            "H.265/HEVC":
            {
                "value": "libx265",
                "widgets":
                {
                    "crf": widget_configs["crf_v1"],
                    "preset": widget_configs["preset"],
                    "tune": widget_configs["tune_h265"],
                }
            },
            "VP9":
            {
                "value": "libvpx-vp9",
                "widgets":
                {
                    "crf": widget_configs["crf_v2"],
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
                    "crf": widget_configs["crf_v2"],
                    "speed": widget_configs["speed"],
                    "sharpness": widget_configs["sharpness"],
                }
            },
            "AV1":
            {
                "value": "libaom-av1",
                "widgets":
                {
                    "crf": widget_configs["crf_v2"],
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
                    "crf": widget_configs["crf_v2"],
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
                    "crf": widget_configs["crf_v2"],
                    "speed": widget_configs["speed"],
                    "sharpness": widget_configs["sharpness"],
                }
            },
            "AV1":
            {
                "value": "libaom-av1",
                "widgets":
                {
                    "crf": widget_configs["crf_v2"],
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
                    "sample_rate": widget_configs["sample_rate_v1"],
                }
            },
            "Nellymoser Asao":
            {
                "value": "nellymoser",
                "widgets":
                {
                    "audio_bitrate": widget_configs["audio_bitrate"],
                    "sample_rate": widget_configs["sample_rate_v2"],
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
            "img_scale": widget_configs["img_scale"],
            "img_rotate": widget_configs["img_rotate"],
        }
    },
    ".jxr":
    {
        "supports_alpha": True,
        "widgets": {}
    },
    ".png":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_scale": widget_configs["img_scale"],
            "img_rotate": widget_configs["img_rotate"],
        }
    },
    ".webp":
    {
        "supports_alpha": True,
        "widgets":
        {
            "img_scale": widget_configs["img_scale"],
            "img_rotate": widget_configs["img_rotate"],
        }
    },
    ".heic":
    {
        "supports_alpha": True,
        "widgets": {}
    },
    ".bmp":
    {
        "supports_alpha": False,
        "widgets": {}
    },
    ".tiff":
    {
        "supports_alpha": True,
        "widgets": {}
    },
    ".ico":
    {
        "supports_alpha": True,
        "widgets": {}
    },
    ".gif":
    {
        "supports_alpha": True,
        "widgets": {}
    }
}

file_types = {
    "video": video_formats.keys(),
    "audio": audio_formats.keys(),
    "image": image_formats.keys(),
    "pdf": [],
}