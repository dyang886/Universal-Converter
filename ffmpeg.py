# import requests
# from tqdm import tqdm
# from bs4 import BeautifulSoup
# import zipfile
# import shutil
# import math
import os
import sys
import subprocess
from PIL import Image
import tempfile


def resource_path(relative_path):
    if hasattr(sys, "_MEIPASS"):
        return os.path.join(sys._MEIPASS, relative_path)
    return os.path.join(os.path.abspath("."), relative_path)


# import other
# _ = other.get_translator()
ffmpeg_path = resource_path("dependency/ffmpeg.exe")
temp_folder = tempfile.gettempdir()

# =============================================================
# General formats
# =============================================================

########## video formats ##########
video_formats = {
    ".mp4": {
        "video": {"H.264/MPEG-4": "libx264",
                  "H.265/HEVC": "libx265"},
        "audio": {"AAC": "aac",
                  "MP3": "libmp3lame",
                  "AC-3": "ac3"}
    },
    ".mov": {
        "video": {"H.264/MPEG-4": "libx264",
                  "ProRes": "prores",
                  "H.265/HEVC": "libx265"},
        "audio": {"AAC": "aac",
                  "ALAC": "alac",
                  "AC-3": "ac3"}
    },
    ".avi": {
        "video": {"Xvid": "libxvid",
                  "H.264/MPEG-4": "libx264",
                  "H.265/HEVC": "libx265"},
        "audio": {"MP3": "libmp3lame",
                  "AC-3": "ac3",
                  "WMA": "wmav2"}
    },
    ".mkv": {
        "video": {"H.264/MPEG-4": "libx264",
                  "H.265/HEVC": "libx265",
                  "VP9": "libvpx-vp9",
                  "VP8": "libvpx",
                  "AV1": "libaom-av1"},
        "audio": {"AAC": "aac",
                  "MP3": "libmp3lame",
                  "Opus": "libopus",
                  "Vorbis": "libvorbis",
                  "FLAC": "flac",
                  "ALAC": "alac",
                  "AC-3": "ac3"}
    },
    ".webm": {
        "video": {"VP9": "libvpx-vp9",
                  "VP8": "libvpx",
                  "AV1": "libaom-av1"},
        "audio": {"Opus": "libopus",
                  "Vorbis": "libvorbis"}
    },
    ".flv": {
        "video": {"H.263": "flv1"},
        "audio": {"MP3": "libmp3lame",
                  "ADPCM": "adpcm_swf",
                  "Nellymoser Asao": "nellymoser"}
    },
    ".wmv": {
        "video": {"MPEG-4 pt.2 MS v.3": "msmpeg4",
                  "Windows Media Video 8": "wmv2",
                  "Windows Media Video 7": "wmv1"},
        "audio": {"WMA": "wmav2"}
    }
}

########## audio formats ##########
audio_formats = {
    ".mp3": {
        "MP3": "libmp3lame"
    },
    ".aac": {
        "AAC": "aac"
    },
    ".mpeg": {
        "MP2": "mp2",
        "MP3": "libmp3lame"
    },
    ".wav": {
        "PCM 16-bit": "pcm_s16le",
        "PCM 24-bit": "pcm_s24le",
        "PCM 32-bit": "pcm_s32le"
    },
    ".flac": {
        "FLAC": "flac"
    },
    ".m4a": {
        "AAC": "aac",
        "ALAC": "alac"
    },
    ".ogg": {
        "Vorbis": "libvorbis",
        "Opus": "libopus"
    },
    ".wma": {
        "WMA": "wmav2"
    }
}

########## image formats ##########
image_formats = [".jpeg", ".png", ".webp", ".bmp", ".tiff", ".ico"]

# =============================================================
# Additional options
# =============================================================

widget_options = {
    # video widgets
    "crf": {"H.264/MPEG-4": (0, 51),
            "H.265/HEVC": (0, 51),
            "VP8": (0, 63),
            "VP9": (0, 63),
            "AV1": (0, 63)},
    "preset": ["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"],
    "tune": {"H.264/MPEG-4": ["film", "animation", "grain", "stillimage", "fastdecode", "zerolatency"],
             "H.265/HEVC": ["animation", "grain", "fastdecode", "zerolatency"]},
    "aq_mode": {"none": "0", "variance": "1", "complexity": "2", "cyclic": "3"},
    "motion_est": {"zero": "0", "epzs": "1", "xone": "2"},

    # audio widgets
    "audio bitrate": ["64k", "128k", "192k", "256k", "320k"],
    "aac_coder": {"twoloop": "1", "fast": "2"},
    "lpc_type": {"none": "0", "fixed": "1", "levinson": "2", "cholesky": "3"},
    "ch_mode": {"auto": "-1", "indep": "0", "left_side": "1", "right_side": "2", "mid_side": "3"},
    "vbr": {"constant bit rate": "0", "variable bit rate": "1", "constrained VBR": "2"},

    "room_type": {"not indicated": "0", "large room": "1", "small room": "2"},
    "dmix_mode": {"not indicated": "0", "Lt/Rt downmix preferred": "1", "Lo/Ro downmix preferred": "2", "dolby pro logic II downmix preferred": "3"},
    "dsur_mode": {"not indicated": "0", "dolby surround encoded": "2", "not dolby surround encoded": "1"},
    "dsurex_mode": {"not indicated": "0", "dolby surround EX encoded": "2", "not dolby surround EX encoded": "1", "dolby pro logic IIz-encoded": "3"},
    "dheadphone_mode": {"not indicated": "0", "dolby headphone encoded": "2", "not dolby headphone encoded": "1"},
    "sample_rate": {"ADPCM": ["11025 Hz", "22050 Hz", "44100 Hz"],
                    "Nellymoser Asao": ["8000 Hz", "16000 Hz", "11025 Hz", "22050 Hz", "44100 Hz"]},

    # image widgets
    "image_preset": {"none": "-1", "default": "0", "picture": "1", "photo": "2", "drawing": "3", "icon": "4", "text": "5"}
}


def ffmpeg_video(input_file, out_ext, vcodec, crf, preset, tune, faststart, speed, sharpness, meq, gmc, lossless, aqmode, motionest, acodec, abitrate, aaccoder, lpctype, chmode, vbr, roomtype, mixinglevel, dmix, dsur, dsurex, dheadphone, samplerate):
    out_file = os.path.splitext(input_file)[0] + "_converted" + out_ext

    command = [ffmpeg_path, "-i", input_file]

    if vcodec:
        command += ["-c:v", video_formats[out_ext]["video"][vcodec]]
    if crf:
        command += ["-crf", crf]
    if preset:
        command += ["-preset", preset]
    if tune:
        command += ["-tune", tune]
    if faststart:
        command += ["-movflags", "+faststart"]
    if speed:
        command += ["-speed", speed]
    if sharpness:
        command += ["-sharpness", sharpness]
    if meq:
        command += ["-me_quality", meq]
    if gmc:
        command += ["-gmc", "1"]
    if lossless:
        command += ["-lossless", "1"]
    if aqmode:
        command += ["-aq-mode", widget_options["aq_mode"][aqmode]]
    if motionest:
        command += ["-motion_est", widget_options["motion_est"][motionest]]

    if acodec:
        command += ["-c:a", video_formats[out_ext]["audio"][acodec]]
    if abitrate:
        command += ["-b:a", abitrate]
    if aaccoder:
        command += ["-aac_coder", widget_options["aac_coder"][aaccoder]]
    if lpctype:
        command += ["-lpc_type", widget_options["lpc_type"][lpctype]]
    if chmode:
        command += ["-ch_mode", widget_options["ch_mode"][chmode]]
    if vbr:
        command += ["-vbr", widget_options["vbr"][vbr]]
    if roomtype:
        command += ["-room_type", widget_options["room_type"][roomtype]]
    if mixinglevel:
        command += ["-mixing_level", mixinglevel]
    if dmix:
        command += ["-dmix_mode", widget_options["dmix_mode"][dmix]]
    if dsur:
        command += ["-dsur_mode", widget_options["dsur_mode"][dsur]]
    if dsurex:
        command += ["-dsurex_mode", widget_options["dsurex_mode"][dsurex]]
    if dheadphone:
        command += ["-dheadphone_mode",
                    widget_options["dheadphone_mode"][dheadphone]]
    if samplerate:
        command += ["-ar", samplerate.strip(" Hz")]

    command += ["-y", out_file]

    process = subprocess.Popen(command, stderr=subprocess.PIPE,
                               text=True, creationflags=subprocess.CREATE_NO_WINDOW)

    return process.communicate()[1]


def ffmpeg_audio(input_file, out_ext, acodec, abitrate, aaccoder, lpctype, chmode, vbr):
    out_file = os.path.splitext(input_file)[0] + "_converted" + out_ext

    command = [ffmpeg_path, "-i", input_file]

    if acodec:
        command += ["-c:a", audio_formats[out_ext][acodec]]
    if abitrate:
        command += ["-b:a", abitrate]
    if aaccoder:
        command += ["-aac_coder", widget_options["aac_coder"][aaccoder]]
    if lpctype:
        command += ["-lpc_type", widget_options["lpc_type"][lpctype]]
    if chmode:
        command += ["-ch_mode", widget_options["ch_mode"][chmode]]
    if vbr:
        command += ["-vbr", widget_options["vbr"][vbr]]

    if out_ext == ".m4a":
        command += ["-vn"]

    command += ["-y", out_file]

    process = subprocess.Popen(command, stderr=subprocess.PIPE,
                               text=True, creationflags=subprocess.CREATE_NO_WINDOW)

    return process.communicate()[1]


def ffmpeg_image(input_file, out_ext, image_quality, scale_w, scale_h, rotate, lossless, preset, webp_quality):
    out_file = os.path.splitext(input_file)[0] + "_converted" + out_ext
    out_file_basename = os.path.basename(input_file)

    # fill transparancy
    if out_ext in [".jpeg", ".bmp"]:
        img = Image.open(input_file)
        try:
            img.load()
            background = Image.new("RGB", img.size, (255, 255, 255))
            # 3 is the alpha channel
            background.paste(img, mask=img.split()[3])
            os.makedirs(temp_folder, exist_ok=True)
            temp = os.path.join(temp_folder, out_file_basename)
            background.save(temp, out_ext.strip(".").upper(), quality=100)
            input_file = temp
        except IndexError:
            pass

    # rotation
    if rotate:
        img = Image.open(input_file)
        img_rotated = img.rotate(float(rotate)*-1, expand=True)
        os.makedirs(temp_folder, exist_ok=True)
        temp = os.path.join(temp_folder, out_file_basename)
        img_rotated.save(temp)
        input_file = temp

    if out_ext == ".ico":
        img = Image.open(input_file)
        img = img.convert("RGBA")
        img.save(out_file, format="ICO")
        temp = os.path.join(temp_folder, out_file_basename)
        if os.path.isfile(temp):
            os.remove(temp)
        return -1

    command = [ffmpeg_path, "-i", input_file]

    if image_quality:
        command += ["-q:v", image_quality]
    if not scale_w:
        scale_w = "-1"
    if not scale_h:
        scale_h = "-1"
    command += ["-vf", f"scale={scale_w}:{scale_h}"]
    if lossless:
        command += ["-lossless", "1"]
    if preset:
        command += ["-preset", widget_options["image_preset"][preset]]
    if webp_quality:
        command += ["-quality", webp_quality]

    command += ["-y", out_file]

    process = subprocess.Popen(command, stderr=subprocess.PIPE,
                               text=True, creationflags=subprocess.CREATE_NO_WINDOW)

    result = process.communicate()[1]
    temp = os.path.join(temp_folder, out_file_basename)
    if os.path.isfile(temp):
        os.remove(temp)

    return result
