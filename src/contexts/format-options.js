// ffmpeg commands:
//     check all options for a encoder: -hide_banner -h encoder={}
//     list all codecs: -hide_banner -codecs

// ===========================================================================
// WIDGET OPTIONS
// Reusable dropdown option sets for select widgets.
// Shape: { "Display Label": "command_value" }
// ===========================================================================
export const widgetOptions = {
    // ====== video.general ======
    aspect_ratio: { "3:2": "3:2", "4:3": "4:3", "5:4": "5:4", "16:10": "16:10", "16:9": "16:9", "37:20 (1.85:1)": "37:20", "21:9 (2.35:1)": "21:9", "69:25 (2.76:1)": "69:25", "9:16": "9:16" },
    video_rotate: { "90° Clockwise": "transpose=1", "90° Counterclockwise": "transpose=2", "180°": "transpose=1,transpose=1" },
    video_flip: { "Horizontal Flip": "hflip", "Vertical Flip": "vflip" },

    // dnxhd
    profile_dnxhd: { "DNxHD": "dnxhd", "DNxHR LB": "dnxhr_lb", "DNxHR SQ": "dnxhr_sq", "DNxHR HQ": "dnxhr_hq", "DNxHR HQX": "dnxhr_hqx", "DNxHR 444": "dnxhr_444" },

    // ffv1
    coder_ffv1: { "Golomb Rice": "rice", "Range Coder (Default Table)": "range_def", "Range Coder (Custom Table)": "range_tab", "Range Coder (AC)": "ac" },

    // huffyuv
    pred_huffyuv: { "Left": "left", "Plane": "plane", "Median": "median" },

    // dvvideo
    resolution_dvvideo: { "720x480": "720x480", "720x576": "720x576", "960x720": "960x720", "1280x1080": "1280x1080", "1440x1080": "1440x1080" },
    framerate_dvvideo: { "30000/1001": "30000/1001", "25/1": "25/1", "60000/1001": "60000/1001", "50/1": "50/1" },

    // libx264, libx265
    preset: { "Ultrafast": "ultrafast", "Superfast": "superfast", "Veryfast": "veryfast", "Faster": "faster", "Fast": "fast", "Medium": "medium", "Slow": "slow", "Slower": "slower", "Veryslow": "veryslow", "Placebo": "placebo" },
    tune_h264: { "Film": "film", "Animation": "animation", "Grain": "grain", "Still Image": "stillimage", "Fast Decode": "fastdecode", "Zero Latency": "zerolatency" },
    tune_h265: { "Animation": "animation", "Grain": "grain", "Fast Decode": "fastdecode", "Zero Latency": "zerolatency" },
    profile_h264: { "Baseline": "baseline", "Main": "main", "High": "high", "High10": "high10", "High422": "high422", "High444": "high444" },
    profile_h265: { "Main": "main", "Main Intra": "main-intra", "Main Still Picture": "mainstillpicture", "Main 10": "main10", "Main 10 Intra": "main10-intra", "Main 12": "main12", "Main 12 Intra": "main12-intra", "Main 4:2:2 10": "main422-10", "Main 4:2:2 10 Intra": "main422-10-intra", "Main 4:2:2 12": "main422-12", "Main 4:2:2 12 Intra": "main422-12-intra", "Main 4:4:4 8-bit": "main444-8", "Main 4:4:4 Intra": "main444-intra", "Main 4:4:4 Still Picture": "main444-stillpicture", "Main 4:4:4 10": "main444-10", "Main 4:4:4 10 Intra": "main444-10-intra", "Main 4:4:4 12": "main444-12", "Main 4:4:4 12 Intra": "main444-12-intra", "Main 4:4:4 16 Intra": "main444-16-intra", "Main 4:4:4 16 Still Picture": "main444-16-stillpicture" },
    level: { "1.0": "1.0", "1.1": "1.1", "1.2": "1.2", "1.3": "1.3", "2.0": "2.0", "2.1": "2.1", "2.2": "2.2", "3.0": "3.0", "3.1": "3.1", "3.2": "3.2", "4.0": "4.0", "4.1": "4.1", "4.2": "4.2", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2" },
    aq_mode_h264: { "None": "none", "Variance": "variance", "Auto-variance": "autovariance", "Auto-variance Biased": "autovariance-biased" },
    weightp: { "None": "none", "Simple": "simple", "Smart": "smart" },
    b_pyramid: { "None": "none", "Strict": "strict", "Normal": "normal" },
    direct_pred: { "None": "none", "Spatial": "spatial", "Temporal": "temporal", "Auto": "auto" },
    nal_hrd: { "None": "none", "VBR": "vbr", "CBR": "cbr" },
    nal_hrd_mp4: { "None": "none", "VBR": "vbr" },
    avcintra_class: { "50": "50", "100": "100", "200": "200", "300": "300", "480": "480" },
    motion_est_h264: { "Diamond": "dia", "Hexagon": "hex", "Uneven Multi-hexagon": "umh", "Exhaustive": "esa", "Transformed Exhaustive": "tesa" },
    coder: { "Default": "default", "CAVLC / VLC": "cavlc", "CABAC / AC": "cabac" },

    // mpeg1, mpeg2
    b_strategy: { "I-frames": "0", "P-frames": "1", "B-frames": "2" },
    motion_est_mpeg: { "Zero": "zero", "EPZS": "epzs", "Xone": "xone" },
    mpv_flags: { "Skip RD": "skip_rd", "Strict GOP": "strict_gop", "QP RD": "qp_rd", "CBP RD": "cbp_rd", "Normalize AQ": "naq", "MV Zero": "mv0" },
    mpv_flags_amv: { "Skip RD": "skip_rd", "Strict GOP": "strict_gop", "QP RD": "qp_rd", "CBP RD": "cbp_rd", "Normalize AQ": "naq" },
    skip_cmp: { "SAD": "sad", "SSE": "sse", "SATD": "satd", "DCT": "dct", "PSNR": "psnr", "Bit": "bit", "RD": "rd", "Zero": "zero", "VSAD": "vsad", "VSSE": "vsse", "NSSE": "nsse", "DCT264": "dct264", "DCTMAX": "dctmax", "Chroma": "256", "MSAD": "msad" },
    seq_disp_ext: { "Auto": "auto", "Never": "never", "Always": "always" },
    video_format: { "Component": "component", "PAL": "pal", "NTSC": "ntsc", "SECAM": "secam", "MAC": "mac", "Unspecified": "unspecified" },
    // libxvid
    ssim_xvid: { "Off": "off", "Average": "avg", "Frame": "frame" },

    // mjpeg
    huffman: { "Default": "default", "Optimal": "optimal" },

    // av1
    aq_mode_av1: { "None": "none", "Variance": "variance", "Complexity": "complexity", "Cyclic Refresh": "cyclic" },
    usage: { "Good Quality": "good", "Realtime": "realtime", "All Intra": "allintra" },
    tune: { "PSNR": "psnr", "SSIM": "ssim" },

    // vp8, vp9
    arnr_type: { "Backward": "backward", "Forward": "forward", "Centered": "centered" },
    deadline: { "Best": "best", "Good": "good", "Realtime": "realtime" },
    error_resilient: { "Default": "default", "Partitions": "partitions" },
    vp8flags: { "Error Resilient": "error_resilient", "Alternate Reference": "altref" },
    aq_mode_vp9: { "None": "none", "Variance": "variance", "Complexity": "complexity", "Cyclic Refresh": "cyclic", "Equator 360": "equator360" },
    tune_content: { "Default": "default", "Screen": "screen", "Film": "film" },

    // h264_nvenc / hevc_nvenc / av1_nvenc (shared NVENC options)
    preset_nvenc_h264: { "Default": "default", "Slow (HQ 2-pass)": "slow", "Medium (HQ 1-pass)": "medium", "Fast (HP 1-pass)": "fast", "HP": "hp", "HQ": "hq", "BD": "bd", "Low Latency": "ll", "Low Latency HQ": "llhq", "Low Latency HP": "llhp", "Lossless": "lossless", "Lossless HP": "losslesshp", "P1 (Fastest)": "p1", "P2 (Faster)": "p2", "P3 (Fast)": "p3", "P4 (Medium)": "p4", "P5 (Slow)": "p5", "P6 (Slower)": "p6", "P7 (Slowest)": "p7" },
    tune_nvenc: { "High Quality": "hq", "Low Latency": "ll", "Ultra Low Latency": "ull", "Lossless": "lossless" },
    profile_h264_nvenc: { "Baseline": "baseline", "Main": "main", "High": "high", "High10": "high10", "High422": "high422", "High444p": "high444p" },
    level_nvenc_h264: { "Auto": "auto", "1.0b": "1b", "1.0": "1.0", "1.1": "1.1", "1.2": "1.2", "1.3": "1.3", "2.0": "2.0", "2.1": "2.1", "2.2": "2.2", "3.0": "3.0", "3.1": "3.1", "3.2": "3.2", "4.0": "4.0", "4.1": "4.1", "4.2": "4.2", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2", "6.0": "6.0", "6.1": "6.1", "6.2": "6.2" },
    rc_nvenc: { "Constant QP": "constqp", "Variable Bitrate": "vbr", "Constant Bitrate": "cbr", "CBR Low Delay HQ": "cbr_ld_hq", "CBR High Quality": "cbr_hq", "VBR High Quality": "vbr_hq" },
    multipass_nvenc: { "Disabled": "disabled", "Quarter Resolution": "qres", "Full Resolution": "fullres" },
    b_ref_mode_nvenc: { "Disabled": "disabled", "Each": "each", "Middle": "middle" },
    coder_nvenc: { "Default": "default", "Auto": "auto", "CABAC": "cabac", "CAVLC": "cavlc" },
    rgb_mode_nvenc: { "YUV 4:2:0": "yuv420", "YUV 4:4:4": "yuv444", "Disabled": "disabled" },
    tf_level_nvenc: { "Disabled": "-1", "0": "0", "4": "4" },
    lookahead_level_nvenc: { "Auto": "auto", "0": "0", "1": "1", "2": "2", "3": "3" },
    // hevc_nvenc specific
    profile_h265_nvenc: { "Main": "main", "Main 10": "main10", "REXT": "rext", "MV-HEVC": "mv" },
    level_nvenc_h265: { "Auto": "auto", "1.0": "1.0", "2.0": "2.0", "2.1": "2.1", "3.0": "3.0", "3.1": "3.1", "4.0": "4.0", "4.1": "4.1", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2", "6.0": "6.0", "6.1": "6.1", "6.2": "6.2" },
    tier_nvenc: { "Main": "main", "High": "high" },
    tune_nvenc_h265: { "High Quality": "hq", "Ultra High Quality": "uhq", "Low Latency": "ll", "Ultra Low Latency": "ull", "Lossless": "lossless" },
    split_encode_mode_nvenc: { "Disabled": "disabled", "Auto": "auto", "Forced": "forced", "2 Strips": "2", "3 Strips": "3" },
    // av1_nvenc specific
    preset_nvenc_av1: { "Default": "default", "Slow (HQ 2-pass)": "slow", "Medium (HQ 1-pass)": "medium", "Fast (HP 1-pass)": "fast", "P1 (Fastest)": "p1", "P2 (Faster)": "p2", "P3 (Fast)": "p3", "P4 (Medium)": "p4", "P5 (Slow)": "p5", "P6 (Slower)": "p6", "P7 (Slowest)": "p7" },
    level_nvenc_av1: { "Auto": "auto", "2.0": "2.0", "2.1": "2.1", "2.2": "2.2", "2.3": "2.3", "3.0": "3.0", "3.1": "3.1", "3.2": "3.2", "3.3": "3.3", "4.0": "4.0", "4.1": "4.1", "4.2": "4.2", "4.3": "4.3", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2", "5.3": "5.3", "6.0": "6.0", "6.1": "6.1", "6.2": "6.2", "6.3": "6.3", "7.0": "7.0", "7.1": "7.1", "7.2": "7.2", "7.3": "7.3" },
    tier_nvenc_av1: { "Main": "0", "High": "1" },
    rc_nvenc_av1: { "Constant QP": "constqp", "Variable Bitrate": "vbr", "Constant Bitrate": "cbr" },

    // h264_amf / hevc_amf / av1_amf (shared AMF options)
    usage_amf: { "Transcoding": "transcoding", "Ultra Low Latency": "ultralowlatency", "Low Latency": "lowlatency", "Webcam": "webcam", "High Quality": "high_quality", "Low Latency High Quality": "lowlatency_high_quality" },
    profile_h264_amf: { "Main": "main", "High": "high", "Constrained Baseline": "constrained_baseline", "Constrained High": "constrained_high" },
    level_amf_h264: { "Auto": "auto", "1.0": "1.0", "1.1": "1.1", "1.2": "1.2", "1.3": "1.3", "2.0": "2.0", "2.1": "2.1", "2.2": "2.2", "3.0": "3.0", "3.1": "3.1", "3.2": "3.2", "4.0": "4.0", "4.1": "4.1", "4.2": "4.2", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2", "6.0": "6.0", "6.1": "6.1", "6.2": "6.2" },
    preset_amf: { "Balanced": "balanced", "Speed": "speed", "Quality": "quality" },
    rc_amf: { "Constant QP": "cqp", "Constant Bitrate": "cbr", "VBR Peak": "vbr_peak", "VBR Latency": "vbr_latency", "Quality VBR": "qvbr", "HQ VBR": "hqvbr", "HQ CBR": "hqcbr" },
    coder_amf: { "Auto": "auto", "CAVLC": "cavlc", "CABAC": "cabac" },
    pa_activity_type_amf: { "Luma (Y)": "y", "Luma + Chroma (YUV)": "yuv" },
    pa_sensitivity_amf: { "Low": "low", "Medium": "medium", "High": "high" },
    pa_paq_mode_amf: { "None": "none", "CAQ": "caq" },
    pa_taq_mode_amf: { "None": "none", "Mode 1": "1", "Mode 2": "2" },
    pa_hmqb_mode_amf: { "None": "none", "Auto": "auto" },
    // hevc_amf / av1_amf
    bitdepth_amf: { "8-bit": "8", "10-bit": "10" },
    // hevc_amf specific
    profile_h265_amf: { "Main": "main", "Main 10": "main10" },
    tier_amf: { "Main": "main", "High": "high" },
    level_amf_h265: { "Auto": "auto", "1.0": "1.0", "2.0": "2.0", "2.1": "2.1", "3.0": "3.0", "3.1": "3.1", "4.0": "4.0", "4.1": "4.1", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2", "6.0": "6.0", "6.1": "6.1", "6.2": "6.2" },
    header_insertion_mode_amf: { "None": "none", "GOP": "gop", "IDR": "idr" },
    // av1_amf specific
    profile_av1_amf: { "Main": "main" },
    level_amf_av1: { "Auto": "auto", "2.0": "2.0", "2.1": "2.1", "2.2": "2.2", "2.3": "2.3", "3.0": "3.0", "3.1": "3.1", "3.2": "3.2", "3.3": "3.3", "4.0": "4.0", "4.1": "4.1", "4.2": "4.2", "4.3": "4.3", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2", "5.3": "5.3", "6.0": "6.0", "6.1": "6.1", "6.2": "6.2", "6.3": "6.3", "7.0": "7.0", "7.1": "7.1", "7.2": "7.2", "7.3": "7.3" },
    preset_av1_amf: { "High Quality": "high_quality", "Quality": "quality", "Balanced": "balanced", "Speed": "speed" },
    latency_av1_amf: { "None": "none", "Power Saving Real Time": "power_saving_real_time", "Real Time": "real_time", "Lowest Latency": "lowest_latency" },
    header_insertion_mode_av1_amf: { "None": "none", "GOP": "gop", "Frame": "frame" },
    aq_mode_amf: { "None": "none", "CAQ": "caq" },
    align_av1_amf: { "64x16": "64x16", "1080p": "1080p", "None": "none" },

    // h264_qsv / hevc_qsv (shared QSV options)
    preset_qsv: { "Very Fast": "veryfast", "Faster": "faster", "Fast": "fast", "Medium": "medium", "Slow": "slow", "Slower": "slower", "Very Slow": "veryslow" },
    profile_h264_qsv: { "Unknown": "unknown", "Baseline": "baseline", "Main": "main", "High": "high" },
    scenario_qsv: { "Unknown": "unknown", "Display Remoting": "displayremoting", "Video Conference": "videoconference", "Archive": "archive", "Live Streaming": "livestreaming", "Camera Capture": "cameracapture", "Video Surveillance": "videosurveillance", "Game Streaming": "gamestreaming", "Remote Gaming": "remotegaming" },
    skip_frame_qsv: { "No Skip": "no_skip", "Insert Dummy": "insert_dummy", "Insert Nothing": "insert_nothing", "BRC Only": "brc_only" },
    dual_gfx_qsv: { "Off": "off", "On": "on", "Adaptive": "adaptive" },
    look_ahead_downsampling_qsv: { "Auto": "auto", "Off": "off", "2x": "2x", "4x": "4x" },
    int_ref_type_qsv: { "None": "none", "Vertical": "vertical", "Horizontal": "horizontal", "Slice": "slice" },
    // hevc_qsv specific
    profile_h265_qsv: { "Unknown": "unknown", "Main": "main", "Main 10": "main10", "Main SP": "mainsp", "REXT": "rext", "SCC": "scc" },
    tier_qsv: { "Main": "main", "High": "high" },
    load_plugin_qsv: { "None": "none", "HEVC SW": "hevc_sw", "HEVC HW": "hevc_hw" },

    // ====== audio.general ======
    audio_bitrate: { "8 kbps": "8k", "16 kbps": "16k", "24 kbps": "24k", "32 kbps": "32k", "40 kbps": "40k", "48 kbps": "48k", "64 kbps": "64k", "80 kbps": "80k", "96 kbps": "96k", "112 kbps": "112k", "128 kbps": "128k", "160 kbps": "160k", "192 kbps": "192k", "224 kbps": "224k", "256 kbps": "256k", "320 kbps": "320k" },

    // nellymoser
    sample_rate_nellymoser: { "8000": "8000", "16000": "16000", "11025": "11025", "22050": "22050", "44100": "44100" },

    // adpcm_swf
    sample_rate_adpcm_swf: { "11025": "11025", "22050": "22050", "44100": "44100" },

    // amr_wb
    sample_rate_16000: { "16000": "16000" },

    // gsm, amr_nb, adpcm_g726
    sample_rate_8000: { "8000": "8000" },
    channel_layout_mono: { "mono": "mono" },

    // aac
    aac_coder: { "Two Loop": "twoloop", "Fast": "fast" },

    // flac
    lpc_type: { "None": "none", "Fixed": "fixed", "Levinson": "levinson", "Cholesky": "cholesky" },
    prediction_order_method: { "Estimation": "estimation", "2-Level": "2level", "4-Level": "4level", "8-Level": "8level", "Search": "search", "Log": "log" },
    ch_mode: { "Auto": "auto", "Independent": "indep", "Left Side": "left_side", "Right Side": "right_side", "Mid Side": "mid_side" },

    // opus
    application: { "VoIP": "voip", "Audio": "audio", "Low Delay": "lowdelay" },
    vbr: { "Constant Bitrate (CBR)": "off", "Variable Bitrate (VBR)": "on", "Constrained VBR": "constrained" },

    // ac3
    room_type: { "Not Indicated": "notindicated", "Large Room": "large", "Small Room": "small" },
    dsur_mode: { "Not Indicated": "notindicated", "Not Dolby Surround": "off", "Dolby Surround": "on" },
    dmix_mode: { "Not Indicated": "notindicated", "Lt/Rt Downmix": "ltrt", "Lo/Ro Downmix": "loro", "Dolby Pro Logic II": "dplii" },
    dsurex_mode: { "Not Indicated": "notindicated", "Not Dolby Surround EX": "off", "Dolby Surround EX": "on", "Dolby Pro Logic IIz": "dpliiz" },
    dheadphone_mode: { "Not Indicated": "notindicated", "Not Dolby Headphone": "off", "Dolby Headphone": "on" },
    ad_conv_type: { "Standard": "standard", "HDCD": "hdcd" },

    // truehd
    lpc_type_truehd: { "Levinson": "levinson", "Cholesky": "cholesky" },
    prediction_order_truehd: { "Estimation": "estimation", "Search": "search" },

    // ====== image.general ======
    alpha: { "Activate": "activate", "Associate": "associate", "Background": "background", "Copy": "copy", "Deactivate": "deactivate", "Disassociate": "disassociate", "Extract": "extract", "Off": "off", "Off if Opaque": "off-if-opaque", "On": "on", "Opaque": "opaque", "Remove": "remove", "Set": "set", "Shape": "shape", "Transparent": "transparent" },
    auto_threshold_method: { "Kapur": "Kapur", "OTSU": "OTSU", "Triangle": "Triangle" },
    colorspace: { "Adobe98": "Adobe98", "CAT02LMS": "CAT02LMS", "CIELab": "CIELab", "CMY": "CMY", "CMYK": "CMYK", "DisplayP3": "DisplayP3", "Gray": "Gray", "HCL": "HCL", "HCLp": "HCLp", "HSB": "HSB", "HSI": "HSI", "HSL": "HSL", "HSV": "HSV", "HWB": "HWB", "Jzazbz": "Jzazbz", "Lab": "Lab", "LCH": "LCH", "LCHab": "LCHab", "LCHuv": "LCHuv", "LinearGray": "LinearGray", "LMS": "LMS", "Log": "Log", "Luv": "Luv", "OHTA": "OHTA", "Oklab": "Oklab", "Oklch": "Oklch", "ProPhoto": "ProPhoto", "Rec601YCbCr": "Rec601YCbCr", "Rec709YCbCr": "Rec709YCbCr", "RGB": "RGB", "scRGB": "scRGB", "sRGB": "sRGB", "Transparent": "Transparent", "xyY": "xyY", "XYZ": "XYZ", "YCbCr": "YCbCr", "YDbDr": "YDbDr", "YCC": "YCC", "YIQ": "YIQ", "YPbPr": "YPbPr", "YUV": "YUV" },
    type_image: { "Bilevel": "Bilevel", "Grayscale": "Grayscale", "GrayscaleAlpha": "GrayscaleAlpha", "Palette": "Palette", "PaletteAlpha": "PaletteAlpha", "TrueColor": "TrueColor", "TrueColorAlpha": "TrueColorAlpha", "ColorSeparation": "ColorSeparation", "ColorSeparationAlpha": "ColorSeparationAlpha", "Optimize": "Optimize" },
    interlace: { "None": "None", "Line": "Line", "Plane": "Plane", "Partition": "Partition", "JPEG": "JPEG", "GIF": "GIF", "PNG": "PNG" },
    compress: { "None": "None", "BZip": "BZip", "Fax": "Fax", "Group4": "Group4", "JPEG": "JPEG", "JPEG2000": "JPEG2000", "Lossless": "Lossless", "LZW": "LZW", "RLE": "RLE", "Zip": "Zip" },
    gravity: { "NorthWest": "NorthWest", "North": "North", "NorthEast": "NorthEast", "West": "West", "Center": "Center", "East": "East", "SouthWest": "SouthWest", "South": "South", "SouthEast": "SouthEast" },
    grayscale_method: { "Rec601Luma": "Rec601Luma", "Rec601Luminance": "Rec601Luminance", "Rec709Luma": "Rec709Luma", "Rec709Luminance": "Rec709Luminance", "Brightness": "Brightness", "Lightness": "Lightness", "Average": "Average", "MS": "MS", "RMS": "RMS" },
    noise_type: { "Gaussian": "Gaussian", "Impulse": "Impulse", "Laplacian": "Laplacian", "Multiplicative": "Multiplicative", "Poisson": "Poisson", "Random": "Random", "Uniform": "Uniform" },
    font_weight: { "Thin (100)": "Thin", "ExtraLight (200)": "ExtraLight", "Light (300)": "Light", "Normal (400)": "Normal", "Medium (500)": "Medium", "DemiBold (600)": "DemiBold", "Bold (700)": "Bold", "ExtraBold (800)": "ExtraBold", "Heavy (900)": "Heavy" },
    font_style: { "Any": "Any", "Italic": "Italic", "Normal": "Normal", "Oblique": "Oblique" },
    dispose_method: { "Undefined": "Undefined", "None": "None", "Background": "Background", "Previous": "Previous" },
    dither_method: { "None": "None", "Riemersma": "Riemersma", "FloydSteinberg": "FloydSteinberg" },
    filter_type: { "Point": "Point", "Box": "Box", "Triangle": "Triangle", "Hermite": "Hermite", "Gaussian": "Gaussian", "Quadratic": "Quadratic", "Cubic": "Cubic", "CubicSpline": "CubicSpline", "Catrom": "Catrom", "Mitchell": "Mitchell", "Lanczos": "Lanczos", "Hamming": "Hamming", "Parzen": "Parzen", "Blackman": "Blackman", "Kaiser": "Kaiser", "Welsh": "Welsh", "Hanning": "Hanning", "Bartlett": "Bartlett", "Bohman": "Bohman", "Lagrange": "Lagrange" },
    virtual_pixel_method: { "background": "background", "black": "black", "checker-tile": "checker-tile", "dither": "dither", "edge": "edge", "gray": "gray", "horizontal-tile": "horizontal-tile", "horizontal-tile-edge": "horizontal-tile-edge", "mirror": "mirror", "random": "random", "tile": "tile", "transparent": "transparent", "vertical-tile": "vertical-tile", "vertical-tile-edge": "vertical-tile-edge", "white": "white" },
    units_type: { "Undefined": "Undefined", "PixelsPerInch": "PixelsPerInch", "PixelsPerCentimeter": "PixelsPerCentimeter" },
    font_stretch: { "Any": "Any", "Condensed": "Condensed", "Expanded": "Expanded", "ExtraCondensed": "ExtraCondensed", "ExtraExpanded": "ExtraExpanded", "Normal": "Normal", "SemiCondensed": "SemiCondensed", "SemiExpanded": "SemiExpanded", "UltraCondensed": "UltraCondensed", "UltraExpanded": "UltraExpanded" },
    rendering_intent: { "Absolute": "Absolute", "Perceptual": "Perceptual", "Relative": "Relative", "Saturation": "Saturation" },
    interpolate_method: { "average": "average", "average4": "average4", "average9": "average9", "average16": "average16", "background": "background", "bilinear": "bilinear", "blend": "blend", "catrom": "catrom", "integer": "integer", "mesh": "mesh", "nearest-neighbor": "nearest-neighbor", "spline": "spline" },
};

// ===========================================================================
// WIDGET DEFINITIONS
// Blueprints consumed by each codec's widgets[] array.
// Shape: { arg, labelKey, type, ...extras }
//
// Types:
//   checkbox          — toggle flag; emits `arg 1` (on) or `arg 0` (off)
//   checkbox-novalue  — presence flag; emits `arg` when checked, nothing when not
//   input-int         — integer field; options: [min, max]
//   input-flt         — float field;   options: [min, max]
//   input-txt         — free-text field
//   select            — dropdown;      options: widgetOptions ref | 'dynamic' (runtime-populated)
//   group             — multi-checkbox; joins selected items with separator and prepends prefix
//
// Extra fields:
//   prefix    — string prepended to the value before passing to FFmpeg (e.g. 'scale=')
//   suffix    — string appended to the value
//   separator — group join delimiter (default ',')
//   meta      — marks a UI-behavior widget that emits no FFmpeg arg
//   default   — initial value for widgets
//   hintKey   — translation key for hover help text; specialHintKeys values delegate to UI special-case logic
// ===========================================================================
export const specialHintKeys = {
    encryptedInput: '__encrypted_input__',
};

export const widgetDefinitions = {
    // ====== video.general ======
    disable_video: { arg: "-vn", labelKey: "advanced.video.disable_video", type: "checkbox-novalue" },
    disable_subtitle: { arg: "-sn", labelKey: "advanced.video.disable_subtitle", type: "checkbox-novalue" },
    pass: { arg: "-pass", labelKey: "advanced.video.pass", type: "input-int", options: [1, 3] },
    frame_size: { arg: "-vf", labelKey: "advanced.video.frame_size", type: "input-txt", prefix: 'scale=' },
    video_rotate: { arg: "-vf", labelKey: "advanced.video.video_rotate", type: "select", options: widgetOptions.video_rotate },
    video_flip: { arg: "-vf", labelKey: "advanced.video.video_flip", type: "select", options: widgetOptions.video_flip },
    video_bitrate: { arg: "-b:v", labelKey: "advanced.video.video_bitrate", type: "input-int", options: [0, 9.22337e+18] },
    vframes: { arg: "-vframes", labelKey: "advanced.video.vframes", type: "input-int", options: [-9223372036854775808, 9223372036854775808] },
    aspect_ratio: { arg: "-aspect", labelKey: "advanced.video.aspect_ratio", type: "select", options: widgetOptions.aspect_ratio },
    fast_start: { arg: "-movflags +faststart", labelKey: "advanced.video.fast_start", type: "checkbox-novalue" },

    // ====== video.codec_specific ======
    framerate: { arg: "-r", labelKey: "advanced.video.framerate", type: "input-int", options: [0, Infinity] },
    framerate_DYN: { arg: "-r", labelKey: "advanced.video.framerate", type: "select", options: 'dynamic' },
    pixel_format: { arg: "-pix_fmt", labelKey: "advanced.video.pixel_format", type: "select", options: 'dynamic' },

    //prores
    vendor: { arg: "-vendor", labelKey: "advanced.video.vendor", type: "input-txt" },

    // dnxhd
    nitris_compat: { arg: "-nitris_compat", labelKey: "advanced.video.nitris_compat", type: "checkbox" },
    ibias: { arg: "-ibias", labelKey: "advanced.video.ibias", type: "input-int", options: [-2147483648, 2147483647] },
    profile_dnxhd: { arg: "-profile", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_dnxhd },

    // ffv1
    slicecrc: { arg: "-slicecrc", labelKey: "advanced.video.slicecrc", type: "checkbox" },
    coder_ffv1: { arg: "-coder", labelKey: "advanced.video.coder", type: "select", options: widgetOptions.coder_ffv1 },
    context: { arg: "-context", labelKey: "advanced.video.context", type: "checkbox" },

    // huffyuv
    non_deterministic: { arg: "-non_deterministic", labelKey: "advanced.video.non_deterministic", type: "checkbox" },
    pred_huffyuv: { arg: "-pred", labelKey: "advanced.video.pred", type: "select", options: widgetOptions.pred_huffyuv },

    // dvvideo
    resolution_dvvideo: { arg: "-s:v", labelKey: "advanced.video.resolution", type: "select", options: widgetOptions.resolution_dvvideo },
    framerate_dvvideo: { arg: "-r", labelKey: "advanced.video.framerate", type: "select", options: widgetOptions.framerate_dvvideo },
    quant_deadzone: { arg: "-quant_deadzone", labelKey: "advanced.video.quant_deadzone", type: "input-int", options: [0, 1024] },

    // cinepak
    max_extra_cb_iterations: { arg: "-max_extra_cb_iterations", labelKey: "advanced.video.max_extra_cb_iterations", type: "input-int", options: [0, 2147483647] },
    skip_empty_cb: { arg: "-skip_empty_cb", labelKey: "advanced.video.skip_empty_cb", type: "checkbox" },
    max_strips: { arg: "-max_strips", labelKey: "advanced.video.max_strips", type: "input-int", options: [1, 32] },
    min_strips: { arg: "-min_strips", labelKey: "advanced.video.min_strips", type: "input-int", options: [1, 32] },
    strip_number_adaptivity: { arg: "-strip_number_adaptivity", labelKey: "advanced.video.strip_number_adaptivity", type: "input-int", options: [0, 31] },

    // rpza
    skip_frame_thresh: { arg: "-skip_frame_thresh", labelKey: "advanced.video.skip_frame_thresh", type: "input-int", options: [0, 24] },
    start_one_color_thresh: { arg: "-start_one_color_thresh", labelKey: "advanced.video.start_one_color_thresh", type: "input-int", options: [0, 24] },
    continue_one_color_thresh: { arg: "-continue_one_color_thresh", labelKey: "advanced.video.continue_one_color_thresh", type: "input-int", options: [0, 24] },
    sixteen_color_thresh: { arg: "-sixteen_color_thresh", labelKey: "advanced.video.sixteen_color_thresh", type: "input-int", options: [0, 24] },

    // libx264
    preset: { arg: "-preset", labelKey: "advanced.video.preset", type: "select", options: widgetOptions.preset },
    tune_h264: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_h264 },
    profile_h264: { arg: "-profile:v", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h264 },
    fastfirstpass: { arg: "-fastfirstpass", labelKey: "advanced.video.fastfirstpass", type: "checkbox" },
    codec_level: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level },
    wpredp: { arg: "-wpredp", labelKey: "advanced.video.wpredp", type: "input-txt" },
    a53cc: { arg: "-a53cc", labelKey: "advanced.video.a53cc", type: "checkbox" },
    x264opts: { arg: "-x264opts", labelKey: "advanced.video.x264opts", type: "input-txt" },
    crf_63: { arg: "-crf", labelKey: "advanced.video.crf", type: "input-flt", options: [0, 63] },
    crf_max: { arg: "-crf_max", labelKey: "advanced.video.crf_max", type: "input-flt", options: [0, 63] },
    qp: { arg: "-qp", labelKey: "advanced.video.qp", type: "input-int", options: [0, 2147483647] },
    aq_mode_h264: { arg: "-aq-mode", labelKey: "advanced.video.aq_mode", type: "select", options: widgetOptions.aq_mode_h264 },
    aq_strength: { arg: "-aq-strength", labelKey: "advanced.video.aq_strength", type: "input-flt", options: [0, 3.4e+38] },
    psy: { arg: "-psy", labelKey: "advanced.video.psy", type: "checkbox" },
    psy_rd: { arg: "-psy-rd", labelKey: "advanced.video.psy_rd", type: "input-txt" },
    rc_lookahead_frametype: { arg: "-rc-lookahead", labelKey: "advanced.video.rc_lookahead_frametype", type: "input-int", options: [0, 2147483647] },
    weightb: { arg: "-weightb", labelKey: "advanced.video.weightb", type: "checkbox" },
    weightp: { arg: "-weightp", labelKey: "advanced.video.weightp", type: "select", options: widgetOptions.weightp },
    ssim: { arg: "-ssim", labelKey: "advanced.video.ssim", type: "checkbox" },
    intra_refresh: { arg: "-intra-refresh", labelKey: "advanced.video.intra_refresh", type: "checkbox" },
    bluray_compat: { arg: "-bluray-compat", labelKey: "advanced.video.bluray_compat", type: "checkbox" },
    b_bias: { arg: "-b-bias", labelKey: "advanced.video.b_bias", type: "input-int", options: [-2147483648, 2147483647] },
    b_pyramid: { arg: "-b-pyramid", labelKey: "advanced.video.b_pyramid", type: "select", options: widgetOptions.b_pyramid },
    mixed_refs: { arg: "-mixed-refs", labelKey: "advanced.video.mixed_refs", type: "checkbox" },
    "8x8dct": { arg: "-8x8dct", labelKey: "advanced.video.8x8dct", type: "checkbox" },
    fast_pskip: { arg: "-fast-pskip", labelKey: "advanced.video.fast_pskip", type: "checkbox" },
    aud: { arg: "-aud", labelKey: "advanced.video.aud", type: "checkbox" },
    mbtree: { arg: "-mbtree", labelKey: "advanced.video.mbtree", type: "checkbox" },
    deblock: { arg: "-deblock", labelKey: "advanced.video.deblock", type: "input-txt" },
    cplxblur: { arg: "-cplxblur", labelKey: "advanced.video.cplxblur", type: "input-flt", options: [0, 3.4e+38] },
    partitions: { arg: "-partitions", labelKey: "advanced.video.partitions", type: "input-txt", hintKey: "advanced.hints.video.partitions" },
    direct_pred: { arg: "-direct-pred", labelKey: "advanced.video.direct_pred", type: "select", options: widgetOptions.direct_pred },
    slice_max_size: { arg: "-slice-max-size", labelKey: "advanced.video.slice_max_size", type: "input-int", options: [0, 2147483647] },
    nal_hrd_mp4: { arg: "-nal-hrd", labelKey: "advanced.video.nal_hrd", type: "select", options: widgetOptions.nal_hrd_mp4 },
    avcintra_class: { arg: "-avcintra-class", labelKey: "advanced.video.avcintra_class", type: "select", options: widgetOptions.avcintra_class },
    motion_est_h264: { arg: "-motion-est", labelKey: "advanced.video.motion_est", type: "select", options: widgetOptions.motion_est_h264 },
    forced_idr: { arg: "-forced-idr", labelKey: "advanced.video.forced_idr", type: "checkbox" },
    coder: { arg: "-coder", labelKey: "advanced.video.coder", type: "select", options: widgetOptions.coder },
    b_strategy: { arg: "-b_strategy", labelKey: "advanced.video.b_strategy", type: "select", options: widgetOptions.b_strategy },
    chromaoffset: { arg: "-chromaoffset", labelKey: "advanced.video.chromaoffset", type: "input-int", options: [-2147483648, 2147483647] },
    sc_threshold: { arg: "-sc_threshold", labelKey: "advanced.video.sc_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    noise_reduction: { arg: "-noise_reduction", labelKey: "advanced.video.noise_reduction", type: "input-int", options: [-2147483648, 2147483647] },
    udu_sei: { arg: "-udu_sei", labelKey: "advanced.video.udu_sei", type: "checkbox" },
    x264_params: { arg: "-x264-params", labelKey: "advanced.video.x264_params", type: "input-txt" },
    mb_info: { arg: "-mb_info", labelKey: "advanced.video.mb_info", type: "checkbox" },
    // libx265
    crf_51: { arg: "-crf", labelKey: "advanced.video.crf", type: "input-flt", options: [0, 51] },
    tune_h265: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_h265 },
    profile_h265: { arg: "-profile:v", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h265 },
    x265_params: { arg: "-x265-params", labelKey: "advanced.video.x265_params", type: "input-txt" },
    dolbyvision: { arg: "-dolbyvision", labelKey: "advanced.video.dolbyvision", type: "checkbox" },

    // mpeg1, mpeg2
    gop_timecode: { arg: "-gop_timecode", labelKey: "advanced.video.gop_timecode", type: "input-txt" },
    drop_frame_timecode: { arg: "-drop_frame_timecode", labelKey: "advanced.video.drop_frame_timecode", type: "checkbox" },
    scan_offset: { arg: "-scan_offset", labelKey: "advanced.video.scan_offset", type: "checkbox" },
    timecode_frame_start: { arg: "-timecode_frame_start", labelKey: "advanced.video.timecode_frame_start", type: "input-int", options: [0, 9223372036854775807] },
    b_sensitivity: { arg: "-b_sensitivity", labelKey: "advanced.video.b_sensitivity", type: "input-int", options: [1, 2147483647] },
    brd_scale: { arg: "-brd_scale", labelKey: "advanced.video.brd_scale", type: "input-int", options: [0, 3] },
    mpv_flags: { arg: "-mpv_flags", labelKey: "advanced.video.mpv_flags", type: "select", options: widgetOptions.mpv_flags },
    luma_elim_threshold: { arg: "-luma_elim_threshold", labelKey: "advanced.video.luma_elim_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    chroma_elim_threshold: { arg: "-chroma_elim_threshold", labelKey: "advanced.video.chroma_elim_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    quantizer_noise_shaping: { arg: "-quantizer_noise_shaping", labelKey: "advanced.video.quantizer_noise_shaping", type: "input-int", options: [0, 2147483647] },
    qsquish: { arg: "-qsquish", labelKey: "advanced.video.qsquish", type: "input-flt", options: [0, 99] },
    rc_qmod_amp: { arg: "-rc_qmod_amp", labelKey: "advanced.video.rc_qmod_amp", type: "input-flt", options: [-3.4e+38, 3.4e+38] },
    rc_qmod_freq: { arg: "-rc_qmod_freq", labelKey: "advanced.video.rc_qmod_freq", type: "input-int", options: [-2147483648, 2147483647] },
    rc_init_cplx: { arg: "-rc_init_cplx", labelKey: "advanced.video.rc_init_cplx", type: "input-flt", options: [-3.4e+38, 3.4e+38] },
    rc_eq: { arg: "-rc_eq", labelKey: "advanced.video.rc_eq", type: "input-txt", hintKey: "advanced.hints.video.rc_eq" },
    border_mask: { arg: "-border_mask", labelKey: "advanced.video.border_mask", type: "input-flt", options: [-3.4e+38, 3.4e+38] },
    lmin: { arg: "-lmin", labelKey: "advanced.video.lmin", type: "input-int", options: [0, 2147483647] },
    lmax: { arg: "-lmax", labelKey: "advanced.video.lmax", type: "input-int", options: [0, 2147483647] },
    skip_threshold: { arg: "-skip_threshold", labelKey: "advanced.video.skip_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    skip_factor: { arg: "-skip_factor", labelKey: "advanced.video.skip_factor", type: "input-int", options: [-2147483648, 2147483647] },
    skip_exp: { arg: "-skip_exp", labelKey: "advanced.video.skip_exp", type: "input-int", options: [-2147483648, 2147483647] },
    skip_cmp: { arg: "-skip_cmp", labelKey: "advanced.video.skip_cmp", type: "select", options: widgetOptions.skip_cmp },
    ps: { arg: "-ps", labelKey: "advanced.video.ps", type: "input-int", options: [-2147483648, 2147483647] },
    motion_est_mpeg: { arg: "-motion_est", labelKey: "advanced.video.motion_est", type: "select", options: widgetOptions.motion_est_mpeg },
    mepc: { arg: "-mepc", labelKey: "advanced.video.mepc", type: "input-int", options: [-2147483648, 2147483647] },
    mepre: { arg: "-mepre", labelKey: "advanced.video.mepre", type: "input-int", options: [-2147483648, 2147483647] },
    intra_penalty: { arg: "-intra_penalty", labelKey: "advanced.video.intra_penalty", type: "input-int", options: [0, 1.07374e+9] },
    // mpeg2 only
    intra_vlc: { arg: "-intra_vlc", labelKey: "advanced.video.intra_vlc", type: "checkbox" },
    non_linear_quant: { arg: "-non_linear_quant", labelKey: "advanced.video.non_linear_quant", type: "checkbox" },
    alternate_scan: { arg: "-alternate_scan", labelKey: "advanced.video.alternate_scan", type: "checkbox" },
    seq_disp_ext: { arg: "-seq_disp_ext", labelKey: "advanced.video.seq_disp_ext", type: "select", options: widgetOptions.seq_disp_ext },
    video_format: { arg: "-video_format", labelKey: "advanced.video.video_format", type: "select", options: widgetOptions.video_format },
    // mpeg4 only
    data_partitioning: { arg: "-data_partitioning", labelKey: "advanced.video.data_partitioning", type: "checkbox" },
    mpeg_quant: { arg: "-mpeg_quant", labelKey: "advanced.video.mpeg_quant", type: "checkbox" },

    // h263p
    umv_h263p: { arg: "-umv", labelKey: "advanced.video.umv", type: "checkbox" },
    aiv_h263p: { arg: "-aiv", labelKey: "advanced.video.aiv", type: "checkbox" },
    obmc_h263p: { arg: "-obmc", labelKey: "advanced.video.enable_obmc", type: "checkbox" },
    structured_slices_h263p: { arg: "-structured_slices", labelKey: "advanced.video.structured_slices", type: "checkbox" },

    // libxvid
    lumi_aq_xvid: { arg: "-lumi_aq", labelKey: "advanced.video.lumi_aq", type: "checkbox" },
    variance_aq_xvid: { arg: "-variance_aq", labelKey: "advanced.video.variance_aq", type: "checkbox" },
    ssim_xvid: { arg: "-ssim", labelKey: "advanced.video.ssim", type: "select", options: widgetOptions.ssim_xvid },
    ssim_acc_xvid: { arg: "-ssim_acc", labelKey: "advanced.video.ssim_acc", type: "input-int", options: [0, 4] },
    gmc_xvid: { arg: "-gmc", labelKey: "advanced.video.gmc", type: "checkbox" },
    me_quality_xvid: { arg: "-me_quality", labelKey: "advanced.video.me_quality", type: "input-int", options: [0, 6] },

    // amv
    mpv_flags_amv: { arg: "-mpv_flags", labelKey: "advanced.video.mpv_flags", type: "select", options: widgetOptions.mpv_flags_amv },

    // libtheora
    speed_level_theora: { arg: "-speed_level", labelKey: "advanced.video.speed_level", type: "input-int", options: [0, 2147483647] },

    // mjpeg
    huffman: { arg: "-huffman", labelKey: "advanced.video.huffman", type: "select", options: widgetOptions.huffman },
    force_duplicated_matrix: { arg: "-force_duplicated_matrix", labelKey: "advanced.video.force_duplicated_matrix", type: "checkbox" },

    // av1
    cpu_used_av1: { arg: "-cpu-used", labelKey: "advanced.video.cpu_used", type: "input-int", options: [0, 8] },
    auto_alt_ref: { arg: "-auto-alt-ref", labelKey: "advanced.video.auto_alt_ref", type: "input-int", options: [0, 2] },
    lag_in_frames: { arg: "-lag-in-frames", labelKey: "advanced.video.lag_in_frames", type: "input-int", options: [0, 2147483647] },
    arnr_max_frames: { arg: "-arnr-max-frames", labelKey: "advanced.video.arnr_max_frames", type: "input-int", options: [0, 15] },
    arnr_strength: { arg: "-arnr-strength", labelKey: "advanced.video.arnr_strength", type: "input-int", options: [0, 6] },
    aq_mode_av1: { arg: "-aq-mode", labelKey: "advanced.video.aq_mode", type: "select", options: widgetOptions.aq_mode_av1 },
    static_thresh: { arg: "-static-thresh", labelKey: "advanced.video.static_thresh", type: "input-int", options: [0, 2147483647] },
    drop_threshold: { arg: "-drop-threshold", labelKey: "advanced.video.drop_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    denoise_noise_level: { arg: "-denoise-noise-level", labelKey: "advanced.video.denoise_noise_level", type: "input-int", options: [0, 2147483647] },
    denoise_block_size: { arg: "-denoise-block-size", labelKey: "advanced.video.denoise_block_size", type: "input-int", options: [0, 2147483647] },
    undershoot_pct: { arg: "-undershoot-pct", labelKey: "advanced.video.undershoot_pct", type: "input-int", options: [0, 100] },
    overshoot_pct: { arg: "-overshoot-pct", labelKey: "advanced.video.overshoot_pct", type: "input-int", options: [0, 1000] },
    minsection_pct: { arg: "-minsection-pct", labelKey: "advanced.video.minsection_pct", type: "input-int", options: [0, 100] },
    maxsection_pct: { arg: "-maxsection-pct", labelKey: "advanced.video.maxsection_pct", type: "input-int", options: [0, 5000] },
    frame_parallel: { arg: "-frame-parallel", labelKey: "advanced.video.frame_parallel", type: "checkbox" },
    tiles: { arg: "-tiles", labelKey: "advanced.video.tiles", type: "input-txt" },
    tile_columns: { arg: "-tile-columns", labelKey: "advanced.video.tile_columns", type: "input-int", options: [0, 6] },
    tile_rows: { arg: "-tile-rows", labelKey: "advanced.video.tile_rows", type: "input-int", options: [0, 6] },
    row_mt: { arg: "-row-mt", labelKey: "advanced.video.row_mt", type: "checkbox" },
    enable_cdef: { arg: "-enable-cdef", labelKey: "advanced.video.enable_cdef", type: "checkbox" },
    enable_global_motion: { arg: "-enable-global-motion", labelKey: "advanced.video.enable_global_motion", type: "checkbox" },
    enable_intrabc: { arg: "-enable-intrabc", labelKey: "advanced.video.enable_intrabc", type: "checkbox" },
    enable_restoration: { arg: "-enable-restoration", labelKey: "advanced.video.enable_restoration", type: "checkbox" },
    usage: { arg: "-usage", labelKey: "advanced.video.usage", type: "select", options: widgetOptions.usage },
    tune: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune },
    still_picture: { arg: "-still-picture", labelKey: "advanced.video.still_picture", type: "checkbox" },
    enable_rect_partitions: { arg: "-enable-rect-partitions", labelKey: "advanced.video.enable_rect_partitions", type: "checkbox" },
    enable_1to4_partitions: { arg: "-enable-1to4-partitions", labelKey: "advanced.video.enable_1to4_partitions", type: "checkbox" },
    enable_ab_partitions: { arg: "-enable-ab-partitions", labelKey: "advanced.video.enable_ab_partitions", type: "checkbox" },
    enable_angle_delta: { arg: "-enable-angle-delta", labelKey: "advanced.video.enable_angle_delta", type: "checkbox" },
    enable_cfl_intra: { arg: "-enable-cfl-intra", labelKey: "advanced.video.enable_cfl_intra", type: "checkbox" },
    enable_filter_intra: { arg: "-enable-filter-intra", labelKey: "advanced.video.enable_filter_intra", type: "checkbox" },
    enable_intra_edge_filter: { arg: "-enable-intra-edge-filter", labelKey: "advanced.video.enable_intra_edge_filter", type: "checkbox" },
    enable_smooth_intra: { arg: "-enable-smooth-intra", labelKey: "advanced.video.enable_smooth_intra", type: "checkbox" },
    enable_paeth_intra: { arg: "-enable-paeth-intra", labelKey: "advanced.video.enable_paeth_intra", type: "checkbox" },
    enable_palette: { arg: "-enable-palette", labelKey: "advanced.video.enable_palette", type: "checkbox" },
    enable_flip_idtx: { arg: "-enable-flip-idtx", labelKey: "advanced.video.enable_flip_idtx", type: "checkbox" },
    enable_tx64: { arg: "-enable-tx64", labelKey: "advanced.video.enable_tx64", type: "checkbox" },
    reduced_tx_type_set: { arg: "-reduced-tx-type-set", labelKey: "advanced.video.reduced_tx_type_set", type: "checkbox" },
    use_intra_dct_only: { arg: "-use-intra-dct-only", labelKey: "advanced.video.use_intra_dct_only", type: "checkbox" },
    use_inter_dct_only: { arg: "-use-inter-dct-only", labelKey: "advanced.video.use_inter_dct_only", type: "checkbox" },
    use_intra_default_tx_only: { arg: "-use-intra-default-tx-only", labelKey: "advanced.video.use_intra_default_tx_only", type: "checkbox" },
    enable_ref_frame_mvs: { arg: "-enable-ref-frame-mvs", labelKey: "advanced.video.enable_ref_frame_mvs", type: "checkbox" },
    enable_reduced_reference_set: { arg: "-enable-reduced-reference-set", labelKey: "advanced.video.enable_reduced_reference_set", type: "checkbox" },
    enable_obmc: { arg: "-enable-obmc", labelKey: "advanced.video.enable_obmc", type: "checkbox" },
    enable_dual_filter: { arg: "-enable-dual-filter", labelKey: "advanced.video.enable_dual_filter", type: "checkbox" },
    enable_diff_wtd_comp: { arg: "-enable-diff-wtd-comp", labelKey: "advanced.video.enable_diff_wtd_comp", type: "checkbox" },
    enable_dist_wtd_comp: { arg: "-enable-dist-wtd-comp", labelKey: "advanced.video.enable_dist_wtd_comp", type: "checkbox" },
    enable_onesided_comp: { arg: "-enable-onesided-comp", labelKey: "advanced.video.enable_onesided_comp", type: "checkbox" },
    enable_interinter_wedge: { arg: "-enable-interinter-wedge", labelKey: "advanced.video.enable_interinter_wedge", type: "checkbox" },
    enable_interintra_wedge: { arg: "-enable-interintra-wedge", labelKey: "advanced.video.enable_interintra_wedge", type: "checkbox" },
    enable_masked_comp: { arg: "-enable-masked-comp", labelKey: "advanced.video.enable_masked_comp", type: "checkbox" },
    enable_interintra_comp: { arg: "-enable-interintra-comp", labelKey: "advanced.video.enable_interintra_comp", type: "checkbox" },
    enable_smooth_interintra: { arg: "-enable-smooth-interintra", labelKey: "advanced.video.enable_smooth_interintra", type: "checkbox" },
    aom_params: { arg: "-aom-params", labelKey: "advanced.video.aom_params", type: "input-txt" },
    preset_av1: { arg: "-preset", labelKey: "advanced.video.preset", type: "input-int", options: [-2, 13] },
    qp_av1: { arg: "-qp", labelKey: "advanced.video.qp_av1", type: "input-int", options: [0, 63] },
    svtav1_params: { arg: "-svtav1-params", labelKey: "advanced.video.svtav1_params", type: "input-txt" },
    // librav1e
    qp_rav1e: { arg: "-qp", labelKey: "advanced.video.qp", type: "input-int", options: [0, 255] },
    speed_rav1e: { arg: "-speed", labelKey: "advanced.video.speed", type: "input-int", options: [0, 10] },
    tiles_rav1e: { arg: "-tiles", labelKey: "advanced.video.tiles_rav1e", type: "input-int", options: [0, 9223372036854775807] },
    tile_rows_rav1e: { arg: "-tile-rows", labelKey: "advanced.video.tile_rows_rav1e", type: "input-int", options: [0, 9223372036854775807] },
    tile_columns_rav1e: { arg: "-tile-columns", labelKey: "advanced.video.tile_columns_rav1e", type: "input-int", options: [0, 9223372036854775807] },
    rav1e_params: { arg: "-rav1e-params", labelKey: "advanced.video.rav1e_params", type: "input-txt" },

    // vp8, vp9
    arnr_type: { arg: "-arnr-type", labelKey: "advanced.video.arnr_type", type: "select", options: widgetOptions.arnr_type },
    deadline: { arg: "-deadline", labelKey: "advanced.video.deadline", type: "select", options: widgetOptions.deadline },
    error_resilient: { arg: "-error-resilient", labelKey: "advanced.video.error_resilient", type: "select", options: widgetOptions.error_resilient },
    max_intra_rate: { arg: "-max-intra-rate", labelKey: "advanced.video.max_intra_rate", type: "input-int", options: [0, 2147483647] },
    noise_sensitivity: { arg: "-noise-sensitivity", labelKey: "advanced.video.noise_sensitivity", type: "input-int", options: [0, 4] },
    ts_parameters: { arg: "-ts-parameters", labelKey: "advanced.video.ts_parameters", type: "input-txt" },
    cpu_used_vpx: { arg: "-cpu-used", labelKey: "advanced.video.cpu_used", type: "input-int", options: [-16, 16] },
    screen_content_mode: { arg: "-screen-content-mode", labelKey: "advanced.video.screen_content_mode", type: "input-int", options: [0, 2] },
    speed: { arg: "-speed", labelKey: "advanced.video.speed", type: "input-int", options: [-16, 16] },
    quality_vpx: { arg: "-quality", labelKey: "advanced.video.quality", type: "select", options: widgetOptions.deadline },
    vp8flags: { arg: "-vp8flags", labelKey: "advanced.video.vp8flags", type: "select", options: widgetOptions.vp8flags },
    rc_lookahead_altref: { arg: "-rc_lookahead", labelKey: "advanced.video.rc_lookahead_altref", type: "input-int", options: [0, 25] },
    sharpness: { arg: "-sharpness", labelKey: "advanced.video.sharpness", type: "input-int", options: [0, 7] },
    // vp9 only
    auto_alt_ref_vp9: { arg: "-auto-alt-ref", labelKey: "advanced.video.auto_alt_ref", type: "input-int", options: [0, 6] },
    cpu_used_vp9: { arg: "-cpu-used", labelKey: "advanced.video.cpu_used", type: "input-int", options: [-8, 8] },
    lossless: { arg: "-lossless", labelKey: "advanced.video.lossless", type: "checkbox" },
    tile_rows_vp9: { arg: "-tile-rows", labelKey: "advanced.video.tile_rows", type: "input-int", options: [0, 2] },
    aq_mode_vp9: { arg: "-aq-mode", labelKey: "advanced.video.aq_mode", type: "select", options: widgetOptions.aq_mode_vp9 },
    level_vp9: { arg: "-level", labelKey: "advanced.video.level", type: "input-flt", options: [0, 6.2] },
    tune_content: { arg: "-tune-content", labelKey: "advanced.video.tune_content", type: "select", options: widgetOptions.tune_content },
    corpus_complexity: { arg: "-corpus-complexity", labelKey: "advanced.video.corpus_complexity", type: "input-int", options: [0, 10000] },
    enable_tpl: { arg: "-enable-tpl", labelKey: "advanced.video.enable_tpl", type: "checkbox" },
    min_gf_interval: { arg: "-min-gf-interval", labelKey: "advanced.video.min_gf_interval", type: "input-int", options: [0, 2147483647] },

    // h264_nvenc / hevc_nvenc / av1_nvenc
    preset_nvenc_h264: { arg: "-preset", labelKey: "advanced.video.preset", type: "select", options: widgetOptions.preset_nvenc_h264 },
    tune_nvenc: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_nvenc },
    profile_h264_nvenc: { arg: "-profile:v", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h264_nvenc },
    level_nvenc_h264: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level_nvenc_h264 },
    rc_nvenc: { arg: "-rc", labelKey: "advanced.video.rc_mode", type: "select", options: widgetOptions.rc_nvenc },
    qp_nvenc: { arg: "-qp", labelKey: "advanced.video.qp", type: "input-int", options: [0, 51] },
    cq_nvenc: { arg: "-cq", labelKey: "advanced.video.cq", type: "input-flt", options: [0, 51] },
    qmin_nvenc: { arg: "-qmin", labelKey: "advanced.video.qmin", type: "input-int", options: [0, 51] },
    qmax_nvenc: { arg: "-qmax", labelKey: "advanced.video.qmax", type: "input-int", options: [0, 51] },
    init_qpI: { arg: "-init_qpI", labelKey: "advanced.video.init_qpI", type: "input-int", options: [0, 51] },
    init_qpP: { arg: "-init_qpP", labelKey: "advanced.video.init_qpP", type: "input-int", options: [0, 51] },
    init_qpB: { arg: "-init_qpB", labelKey: "advanced.video.init_qpB", type: "input-int", options: [0, 51] },
    qp_cb_offset: { arg: "-qp_cb_offset", labelKey: "advanced.video.qp_cb_offset", type: "input-int", options: [-12, 12] },
    qp_cr_offset: { arg: "-qp_cr_offset", labelKey: "advanced.video.qp_cr_offset", type: "input-int", options: [-12, 12] },
    multipass_nvenc: { arg: "-multipass", labelKey: "advanced.video.multipass", type: "select", options: widgetOptions.multipass_nvenc },
    highbitdepth: { arg: "-highbitdepth", labelKey: "advanced.video.highbitdepth", type: "checkbox" },
    rc_lookahead_nvenc: { arg: "-rc-lookahead", labelKey: "advanced.video.rc_lookahead", type: "input-int", options: [0, 2147483647] },
    lookahead_level_nvenc: { arg: "-lookahead_level", labelKey: "advanced.video.lookahead_level", type: "select", options: widgetOptions.lookahead_level_nvenc },
    no_scenecut: { arg: "-no-scenecut", labelKey: "advanced.video.no_scenecut", type: "checkbox" },
    b_adapt: { arg: "-b_adapt", labelKey: "advanced.video.b_adapt", type: "checkbox" },
    spatial_aq: { arg: "-spatial-aq", labelKey: "advanced.video.spatial_aq", type: "checkbox" },
    temporal_aq: { arg: "-temporal-aq", labelKey: "advanced.video.temporal_aq", type: "checkbox" },
    aq_strength_nvenc: { arg: "-aq-strength", labelKey: "advanced.video.aq_strength_nvenc", type: "input-int", options: [1, 15] },
    b_ref_mode_nvenc: { arg: "-b_ref_mode", labelKey: "advanced.video.b_ref_mode", type: "select", options: widgetOptions.b_ref_mode_nvenc },
    coder_nvenc: { arg: "-coder", labelKey: "advanced.video.coder", type: "select", options: widgetOptions.coder_nvenc },
    weighted_pred: { arg: "-weighted_pred", labelKey: "advanced.video.weighted_pred", type: "checkbox" },
    zerolatency: { arg: "-zerolatency", labelKey: "advanced.video.zerolatency", type: "checkbox" },
    nonref_p: { arg: "-nonref_p", labelKey: "advanced.video.nonref_p", type: "checkbox" },
    strict_gop_nvenc: { arg: "-strict_gop", labelKey: "advanced.video.strict_gop", type: "checkbox" },
    cbr: { arg: "-cbr", labelKey: "advanced.video.cbr", type: "checkbox" },
    nvenc_2pass: { arg: "-2pass", labelKey: "advanced.video.2pass", type: "checkbox" },
    cbr_padding: { arg: "-cbr_padding", labelKey: "advanced.video.cbr_padding", type: "checkbox" },
    constrained_encoding: { arg: "-constrained-encoding", labelKey: "advanced.video.constrained_encoding", type: "checkbox" },
    single_slice_intra_refresh: { arg: "-single-slice-intra-refresh", labelKey: "advanced.video.single_slice_intra_refresh", type: "checkbox" },
    max_slice_size_nvenc: { arg: "-max_slice_size", labelKey: "advanced.video.max_slice_size", type: "input-int", options: [0, 2147483647] },
    surfaces: { arg: "-surfaces", labelKey: "advanced.video.surfaces", type: "input-int", options: [0, 64] },
    gpu: { arg: "-gpu", labelKey: "advanced.video.gpu", type: "input-int", options: [-2, 2147483647] },
    delay_nvenc: { arg: "-delay", labelKey: "advanced.video.delay_nvenc", type: "input-int", options: [0, 2147483647] },
    dpb_size: { arg: "-dpb_size", labelKey: "advanced.video.dpb_size", type: "input-int", options: [0, 2147483647] },
    rgb_mode_nvenc: { arg: "-rgb_mode", labelKey: "advanced.video.rgb_mode", type: "select", options: widgetOptions.rgb_mode_nvenc },
    tf_level_nvenc: { arg: "-tf_level", labelKey: "advanced.video.tf_level", type: "select", options: widgetOptions.tf_level_nvenc },
    extra_sei: { arg: "-extra_sei", labelKey: "advanced.video.extra_sei", type: "checkbox" },
    s12m_tc: { arg: "-s12m_tc", labelKey: "advanced.video.s12m_tc", type: "checkbox" },
    ldkfs: { arg: "-ldkfs", labelKey: "advanced.video.ldkfs", type: "input-int", options: [0, 255] },
    // hevc_nvenc specific
    profile_h265_nvenc: { arg: "-profile:v", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h265_nvenc },
    level_nvenc_h265: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level_nvenc_h265 },
    tier_nvenc: { arg: "-tier", labelKey: "advanced.video.tier", type: "select", options: widgetOptions.tier_nvenc },
    tune_nvenc_h265: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_nvenc_h265 },
    unidir_b_nvenc: { arg: "-unidir_b", labelKey: "advanced.video.unidir_b", type: "checkbox" },
    split_encode_mode_nvenc: { arg: "-split_encode_mode", labelKey: "advanced.video.split_encode_mode", type: "select", options: widgetOptions.split_encode_mode_nvenc },
    // av1_nvenc specific
    preset_nvenc_av1: { arg: "-preset", labelKey: "advanced.video.preset", type: "select", options: widgetOptions.preset_nvenc_av1 },
    level_nvenc_av1: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level_nvenc_av1 },
    tier_nvenc_av1: { arg: "-tier", labelKey: "advanced.video.tier", type: "select", options: widgetOptions.tier_nvenc_av1 },
    rc_nvenc_av1: { arg: "-rc", labelKey: "advanced.video.rc_mode", type: "select", options: widgetOptions.rc_nvenc_av1 },
    qp_av1_nvenc: { arg: "-qp", labelKey: "advanced.video.qp", type: "input-int", options: [0, 255] },
    cq_av1_nvenc: { arg: "-cq", labelKey: "advanced.video.cq", type: "input-flt", options: [0, 63] },
    qmin_av1_nvenc: { arg: "-qmin", labelKey: "advanced.video.qmin", type: "input-int", options: [0, 255] },
    qmax_av1_nvenc: { arg: "-qmax", labelKey: "advanced.video.qmax", type: "input-int", options: [0, 255] },
    init_qpI_av1_nvenc: { arg: "-init_qpI", labelKey: "advanced.video.init_qpI", type: "input-int", options: [0, 255] },
    init_qpP_av1_nvenc: { arg: "-init_qpP", labelKey: "advanced.video.init_qpP", type: "input-int", options: [0, 255] },
    init_qpB_av1_nvenc: { arg: "-init_qpB", labelKey: "advanced.video.init_qpB", type: "input-int", options: [0, 255] },
    tile_rows_av1_nvenc: { arg: "-tile-rows", labelKey: "advanced.video.tile_rows_av1_nvenc", type: "input-int", options: [0, 64] },
    tile_columns_av1_nvenc: { arg: "-tile-columns", labelKey: "advanced.video.tile_columns_av1_nvenc", type: "input-int", options: [0, 64] },
    timing_info_av1_nvenc: { arg: "-timing-info", labelKey: "advanced.video.timing_info", type: "checkbox" },

    // h264_amf / hevc_amf / av1_amf
    usage_amf: { arg: "-usage", labelKey: "advanced.video.usage_amf", type: "select", options: widgetOptions.usage_amf },
    profile_h264_amf: { arg: "-profile", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h264_amf },
    level_amf_h264: { arg: "-level", labelKey: "advanced.video.level_nvenc", type: "select", options: widgetOptions.level_amf_h264 },
    latency_amf: { arg: "-latency", labelKey: "advanced.video.latency_amf", type: "checkbox" },
    preset_amf: { arg: "-preset", labelKey: "advanced.video.preset_amf", type: "select", options: widgetOptions.preset_amf },
    rc_amf: { arg: "-rc", labelKey: "advanced.video.rc_mode", type: "select", options: widgetOptions.rc_amf },
    qvbr_quality_level_amf: { arg: "-qvbr_quality_level", labelKey: "advanced.video.qvbr_quality_level", type: "input-int", options: [0, 51] },
    qp_i_amf: { arg: "-qp_i", labelKey: "advanced.video.qp_i", type: "input-int", options: [0, 51] },
    qp_p_amf: { arg: "-qp_p", labelKey: "advanced.video.qp_p", type: "input-int", options: [0, 51] },
    qp_b_amf: { arg: "-qp_b", labelKey: "advanced.video.qp_b", type: "input-int", options: [0, 51] },
    enforce_hrd_amf: { arg: "-enforce_hrd", labelKey: "advanced.video.enforce_hrd", type: "checkbox" },
    filler_data_amf: { arg: "-filler_data", labelKey: "advanced.video.filler_data", type: "checkbox" },
    vbaq_amf: { arg: "-vbaq", labelKey: "advanced.video.vbaq", type: "checkbox" },
    frame_skipping_amf: { arg: "-frame_skipping", labelKey: "advanced.video.frame_skipping", type: "checkbox" },
    preencode_amf: { arg: "-preencode", labelKey: "advanced.video.preencode", type: "checkbox" },
    max_au_size_amf: { arg: "-max_au_size", labelKey: "advanced.video.max_au_size", type: "input-int", options: [0, 2147483647] },
    header_spacing_amf: { arg: "-header_spacing", labelKey: "advanced.video.header_spacing", type: "input-int", options: [0, 1000] },
    async_depth_amf: { arg: "-async_depth", labelKey: "advanced.video.async_depth", type: "input-int", options: [1, 16] },
    bf_delta_qp_amf: { arg: "-bf_delta_qp", labelKey: "advanced.video.bf_delta_qp", type: "input-int", options: [-10, 10] },
    bf_ref_amf: { arg: "-bf_ref", labelKey: "advanced.video.bf_ref", type: "checkbox" },
    bf_ref_delta_qp_amf: { arg: "-bf_ref_delta_qp", labelKey: "advanced.video.bf_ref_delta_qp", type: "input-int", options: [-10, 10] },
    max_b_frames_amf: { arg: "-max_b_frames", labelKey: "advanced.video.max_b_frames", type: "input-int", options: [0, 3] },
    bf_amf: { arg: "-bf", labelKey: "advanced.video.bf_amf", type: "input-int", options: [0, 3] },
    intra_refresh_mb_amf: { arg: "-intra_refresh_mb", labelKey: "advanced.video.intra_refresh_mb", type: "input-int", options: [0, 2147483647] },
    coder_amf: { arg: "-coder", labelKey: "advanced.video.coder_amf", type: "select", options: widgetOptions.coder_amf },
    hmqb_amf: { arg: "-high_motion_quality_boost_enable", labelKey: "advanced.video.hmqb", type: "checkbox" },
    me_half_pel_amf: { arg: "-me_half_pel", labelKey: "advanced.video.me_half_pel", type: "checkbox" },
    me_quarter_pel_amf: { arg: "-me_quarter_pel", labelKey: "advanced.video.me_quarter_pel", type: "checkbox" },
    smart_access_video_amf: { arg: "-smart_access_video", labelKey: "advanced.video.smart_access_video", type: "checkbox" },
    preanalysis_amf: { arg: "-preanalysis", labelKey: "advanced.video.preanalysis", type: "checkbox" },
    pa_activity_type_amf: { arg: "-pa_activity_type", labelKey: "advanced.video.pa_activity_type", type: "select", options: widgetOptions.pa_activity_type_amf },
    pa_scene_change_detection_amf: { arg: "-pa_scene_change_detection_enable", labelKey: "advanced.video.pa_scene_change_detection", type: "checkbox" },
    pa_scene_change_sensitivity_amf: { arg: "-pa_scene_change_detection_sensitivity", labelKey: "advanced.video.pa_scene_change_sensitivity", type: "select", options: widgetOptions.pa_sensitivity_amf },
    pa_static_scene_detection_amf: { arg: "-pa_static_scene_detection_enable", labelKey: "advanced.video.pa_static_scene_detection", type: "checkbox" },
    pa_static_scene_sensitivity_amf: { arg: "-pa_static_scene_detection_sensitivity", labelKey: "advanced.video.pa_static_scene_sensitivity", type: "select", options: widgetOptions.pa_sensitivity_amf },
    pa_initial_qp_scene_change_amf: { arg: "-pa_initial_qp_after_scene_change", labelKey: "advanced.video.pa_initial_qp_scene_change", type: "input-int", options: [0, 51] },
    pa_max_qp_force_skip_amf: { arg: "-pa_max_qp_before_force_skip", labelKey: "advanced.video.pa_max_qp_force_skip", type: "input-int", options: [0, 51] },
    pa_caq_strength_amf: { arg: "-pa_caq_strength", labelKey: "advanced.video.pa_caq_strength", type: "select", options: widgetOptions.pa_sensitivity_amf },
    pa_frame_sad_amf: { arg: "-pa_frame_sad_enable", labelKey: "advanced.video.pa_frame_sad", type: "checkbox" },
    pa_ltr_amf: { arg: "-pa_ltr_enable", labelKey: "advanced.video.pa_ltr", type: "checkbox" },
    pa_lookahead_depth_amf: { arg: "-pa_lookahead_buffer_depth", labelKey: "advanced.video.pa_lookahead_depth", type: "input-int", options: [0, 41] },
    pa_paq_mode_amf: { arg: "-pa_paq_mode", labelKey: "advanced.video.pa_paq_mode", type: "select", options: widgetOptions.pa_paq_mode_amf },
    pa_taq_mode_amf: { arg: "-pa_taq_mode", labelKey: "advanced.video.pa_taq_mode", type: "select", options: widgetOptions.pa_taq_mode_amf },
    pa_hmqb_mode_amf: { arg: "-pa_high_motion_quality_boost_mode", labelKey: "advanced.video.pa_hmqb_mode", type: "select", options: widgetOptions.pa_hmqb_mode_amf },
    pa_adaptive_mini_gop_amf: { arg: "-pa_adaptive_mini_gop", labelKey: "advanced.video.pa_adaptive_mini_gop", type: "checkbox" },
    // hevc_amf / av1_amf
    bitdepth_amf: { arg: "-bitdepth", labelKey: "advanced.video.bitdepth", type: "select", options: widgetOptions.bitdepth_amf },
    // hevc_amf specific
    profile_h265_amf: { arg: "-profile", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h265_amf },
    profile_tier_amf: { arg: "-profile_tier", labelKey: "advanced.video.tier", type: "select", options: widgetOptions.tier_amf },
    level_amf_h265: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level_amf_h265 },
    header_insertion_mode_amf: { arg: "-header_insertion_mode", labelKey: "advanced.video.header_insertion_mode", type: "select", options: widgetOptions.header_insertion_mode_amf },
    gops_per_idr_amf: { arg: "-gops_per_idr", labelKey: "advanced.video.gops_per_idr", type: "input-int", options: [0, 2147483647] },
    skip_frame_amf: { arg: "-skip_frame", labelKey: "advanced.video.frame_skipping", type: "checkbox" },
    min_qp_i_amf: { arg: "-min_qp_i", labelKey: "advanced.video.min_qp_i", type: "input-int", options: [0, 51] },
    max_qp_i_amf: { arg: "-max_qp_i", labelKey: "advanced.video.max_qp_i", type: "input-int", options: [0, 51] },
    min_qp_p_amf: { arg: "-min_qp_p", labelKey: "advanced.video.min_qp_p", type: "input-int", options: [0, 51] },
    max_qp_p_amf: { arg: "-max_qp_p", labelKey: "advanced.video.max_qp_p", type: "input-int", options: [0, 51] },
    // av1_amf specific
    profile_av1_amf: { arg: "-profile", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_av1_amf },
    level_amf_av1: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level_amf_av1 },
    preset_av1_amf: { arg: "-preset", labelKey: "advanced.video.preset_amf", type: "select", options: widgetOptions.preset_av1_amf },
    latency_av1_amf: { arg: "-latency", labelKey: "advanced.video.latency_mode", type: "select", options: widgetOptions.latency_av1_amf },
    qvbr_quality_level_av1_amf: { arg: "-qvbr_quality_level", labelKey: "advanced.video.qvbr_quality_level", type: "input-int", options: [0, 51] },
    header_insertion_mode_av1_amf: { arg: "-header_insertion_mode", labelKey: "advanced.video.header_insertion_mode", type: "select", options: widgetOptions.header_insertion_mode_av1_amf },
    max_b_frames_av1_amf: { arg: "-max_b_frames", labelKey: "advanced.video.max_b_frames", type: "input-int", options: [0, 3] },
    bf_av1_amf: { arg: "-bf", labelKey: "advanced.video.bf_amf", type: "input-int", options: [0, 3] },
    min_qp_i_av1_amf: { arg: "-min_qp_i", labelKey: "advanced.video.min_qp_i", type: "input-int", options: [0, 255] },
    max_qp_i_av1_amf: { arg: "-max_qp_i", labelKey: "advanced.video.max_qp_i", type: "input-int", options: [0, 255] },
    min_qp_p_av1_amf: { arg: "-min_qp_p", labelKey: "advanced.video.min_qp_p", type: "input-int", options: [0, 255] },
    max_qp_p_av1_amf: { arg: "-max_qp_p", labelKey: "advanced.video.max_qp_p", type: "input-int", options: [0, 255] },
    min_qp_b_av1_amf: { arg: "-min_qp_b", labelKey: "advanced.video.min_qp_b", type: "input-int", options: [0, 255] },
    max_qp_b_av1_amf: { arg: "-max_qp_b", labelKey: "advanced.video.max_qp_b", type: "input-int", options: [0, 255] },
    qp_i_av1_amf: { arg: "-qp_i", labelKey: "advanced.video.qp_i", type: "input-int", options: [0, 255] },
    qp_p_av1_amf: { arg: "-qp_p", labelKey: "advanced.video.qp_p", type: "input-int", options: [0, 255] },
    qp_b_av1_amf: { arg: "-qp_b", labelKey: "advanced.video.qp_b", type: "input-int", options: [0, 255] },
    aq_mode_av1_amf: { arg: "-aq_mode", labelKey: "advanced.video.aq_mode", type: "select", options: widgetOptions.aq_mode_amf },
    align_av1_amf: { arg: "-align", labelKey: "advanced.video.alignment_mode", type: "select", options: widgetOptions.align_av1_amf },
    pa_initial_qp_scene_change_av1_amf: { arg: "-pa_initial_qp_after_scene_change", labelKey: "advanced.video.pa_initial_qp_scene_change", type: "input-int", options: [0, 51] },
    pa_max_qp_force_skip_av1_amf: { arg: "-pa_max_qp_before_force_skip", labelKey: "advanced.video.pa_max_qp_force_skip", type: "input-int", options: [0, 51] },
    pa_lookahead_depth_av1_amf: { arg: "-pa_lookahead_buffer_depth", labelKey: "advanced.video.pa_lookahead_depth", type: "input-int", options: [0, 41] },

    // h264_qsv / hevc_qsv
    async_depth_qsv: { arg: "-async_depth", labelKey: "advanced.video.async_depth", type: "input-int", options: [1, 2147483647] },
    preset_qsv: { arg: "-preset", labelKey: "advanced.video.preset", type: "select", options: widgetOptions.preset_qsv },
    profile_h264_qsv: { arg: "-profile", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h264_qsv },
    low_power_qsv: { arg: "-low_power", labelKey: "advanced.video.low_power", type: "checkbox" },
    qsv_params: { arg: "-qsv_params", labelKey: "advanced.video.qsv_params", type: "input-txt" },
    rdo_qsv: { arg: "-rdo", labelKey: "advanced.video.rdo", type: "checkbox" },
    max_frame_size_qsv: { arg: "-max_frame_size", labelKey: "advanced.video.max_frame_size", type: "input-int", options: [0, 2147483647] },
    max_frame_size_i_qsv: { arg: "-max_frame_size_i", labelKey: "advanced.video.max_frame_size_i", type: "input-int", options: [0, 2147483647] },
    max_frame_size_p_qsv: { arg: "-max_frame_size_p", labelKey: "advanced.video.max_frame_size_p", type: "input-int", options: [0, 2147483647] },
    max_slice_size_qsv: { arg: "-max_slice_size", labelKey: "advanced.video.max_slice_size", type: "input-int", options: [0, 2147483647] },
    bitrate_limit_qsv: { arg: "-bitrate_limit", labelKey: "advanced.video.bitrate_limit", type: "checkbox" },
    mbbrc_qsv: { arg: "-mbbrc", labelKey: "advanced.video.mbbrc", type: "checkbox" },
    extbrc_qsv: { arg: "-extbrc", labelKey: "advanced.video.extbrc", type: "checkbox" },
    adaptive_i_qsv: { arg: "-adaptive_i", labelKey: "advanced.video.adaptive_i", type: "checkbox" },
    adaptive_b_qsv: { arg: "-adaptive_b", labelKey: "advanced.video.adaptive_b", type: "checkbox" },
    p_strategy_qsv: { arg: "-p_strategy", labelKey: "advanced.video.p_strategy", type: "input-int", options: [0, 2] },
    b_strategy_qsv: { arg: "-b_strategy", labelKey: "advanced.video.b_strategy_qsv", type: "checkbox" },
    dblk_idc_qsv: { arg: "-dblk_idc", labelKey: "advanced.video.dblk_idc", type: "input-int", options: [0, 2] },
    low_delay_brc_qsv: { arg: "-low_delay_brc", labelKey: "advanced.video.low_delay_brc", type: "checkbox" },
    max_qp_i_qsv: { arg: "-max_qp_i", labelKey: "advanced.video.max_qp_i", type: "input-int", options: [0, 51] },
    min_qp_i_qsv: { arg: "-min_qp_i", labelKey: "advanced.video.min_qp_i", type: "input-int", options: [0, 51] },
    max_qp_p_qsv: { arg: "-max_qp_p", labelKey: "advanced.video.max_qp_p", type: "input-int", options: [0, 51] },
    min_qp_p_qsv: { arg: "-min_qp_p", labelKey: "advanced.video.min_qp_p", type: "input-int", options: [0, 51] },
    max_qp_b_qsv: { arg: "-max_qp_b", labelKey: "advanced.video.max_qp_b", type: "input-int", options: [0, 51] },
    min_qp_b_qsv: { arg: "-min_qp_b", labelKey: "advanced.video.min_qp_b", type: "input-int", options: [0, 51] },
    scenario_qsv: { arg: "-scenario", labelKey: "advanced.video.scenario", type: "select", options: widgetOptions.scenario_qsv },
    avbr_accuracy_qsv: { arg: "-avbr_accuracy", labelKey: "advanced.video.avbr_accuracy", type: "input-int", options: [0, 65535] },
    avbr_convergence_qsv: { arg: "-avbr_convergence", labelKey: "advanced.video.avbr_convergence", type: "input-int", options: [0, 65535] },
    skip_frame_qsv: { arg: "-skip_frame", labelKey: "advanced.video.skip_frame", type: "select", options: widgetOptions.skip_frame_qsv },
    dual_gfx_qsv: { arg: "-dual_gfx", labelKey: "advanced.video.dual_gfx", type: "select", options: widgetOptions.dual_gfx_qsv },
    cavlc_qsv: { arg: "-cavlc", labelKey: "advanced.video.cavlc", type: "checkbox" },
    vcm_qsv: { arg: "-vcm", labelKey: "advanced.video.vcm", type: "checkbox" },
    idr_interval_qsv: { arg: "-idr_interval", labelKey: "advanced.video.idr_interval", type: "input-int", options: [0, 2147483647] },
    idr_interval_hevc_qsv: { arg: "-idr_interval", labelKey: "advanced.video.idr_interval", type: "input-int", options: [-1, 2147483647] },
    pic_timing_sei_qsv: { arg: "-pic_timing_sei", labelKey: "advanced.video.pic_timing_sei", type: "checkbox" },
    single_sei_nal_unit_qsv: { arg: "-single_sei_nal_unit", labelKey: "advanced.video.single_sei_nal_unit", type: "checkbox" },
    max_dec_frame_buffering_qsv: { arg: "-max_dec_frame_buffering", labelKey: "advanced.video.max_dec_frame_buffering", type: "input-int", options: [0, 65535] },
    look_ahead_qsv: { arg: "-look_ahead", labelKey: "advanced.video.look_ahead", type: "checkbox" },
    look_ahead_depth_qsv: { arg: "-look_ahead_depth", labelKey: "advanced.video.look_ahead_depth", type: "input-int", options: [0, 100] },
    look_ahead_downsampling_qsv: { arg: "-look_ahead_downsampling", labelKey: "advanced.video.look_ahead_downsampling", type: "select", options: widgetOptions.look_ahead_downsampling_qsv },
    int_ref_type_qsv: { arg: "-int_ref_type", labelKey: "advanced.video.int_ref_type", type: "select", options: widgetOptions.int_ref_type_qsv },
    int_ref_cycle_size_qsv: { arg: "-int_ref_cycle_size", labelKey: "advanced.video.int_ref_cycle_size", type: "input-int", options: [0, 65535] },
    int_ref_qp_delta_qsv: { arg: "-int_ref_qp_delta", labelKey: "advanced.video.int_ref_qp_delta", type: "input-int", options: [-32768, 32767] },
    recovery_point_sei_qsv: { arg: "-recovery_point_sei", labelKey: "advanced.video.recovery_point_sei", type: "checkbox" },
    int_ref_cycle_dist_qsv: { arg: "-int_ref_cycle_dist", labelKey: "advanced.video.int_ref_cycle_dist", type: "input-int", options: [0, 32767] },
    repeat_pps_qsv: { arg: "-repeat_pps", labelKey: "advanced.video.repeat_pps", type: "checkbox" },
    // hevc_qsv specific
    profile_h265_qsv: { arg: "-profile", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h265_qsv },
    tier_qsv: { arg: "-tier", labelKey: "advanced.video.tier", type: "select", options: widgetOptions.tier_qsv },
    gpb_qsv: { arg: "-gpb", labelKey: "advanced.video.gpb", type: "checkbox" },
    tile_cols_qsv: { arg: "-tile_cols", labelKey: "advanced.video.tile_cols_qsv", type: "input-int", options: [0, 65535] },
    tile_rows_qsv: { arg: "-tile_rows", labelKey: "advanced.video.tile_rows_qsv", type: "input-int", options: [0, 65535] },
    transform_skip_qsv: { arg: "-transform_skip", labelKey: "advanced.video.transform_skip", type: "checkbox" },
    load_plugin_qsv: { arg: "-load_plugin", labelKey: "advanced.video.load_plugin", type: "select", options: widgetOptions.load_plugin_qsv },
    load_plugins_qsv: { arg: "-load_plugins", labelKey: "advanced.video.load_plugins", type: "input-txt" },

    // ====== audio.general ======
    disable_audio: { arg: "-an", labelKey: "advanced.audio.disable_audio", type: "checkbox-novalue" },
    audio_volume: { arg: "-af", labelKey: "advanced.audio.audio_volume", type: "input-flt", options: [-Infinity, Infinity], prefix: 'volume=' },
    audio_speed: { arg: "-af", labelKey: "advanced.audio.audio_speed", type: "input-flt", options: [0.5, 100], prefix: 'atempo=' },
    audio_quality: { arg: "-aq", labelKey: "advanced.audio.audio_quality", type: "input-int", options: [-Infinity, Infinity] },
    audio_bitrate: { arg: "-b:a", labelKey: "advanced.audio.audio_bitrate", type: "select", options: widgetOptions.audio_bitrate },
    audio_channels: { arg: "-ac", labelKey: "advanced.audio.channels", type: "input-int", options: [-2147483648, 2147483647] },
    aframes: { arg: "-aframes", labelKey: "advanced.audio.aframes", type: "input-int", options: [-9223372036854775808, 9223372036854775808] },

    // ====== audio.codec_specific ======
    sample_rate: { arg: "-ar", labelKey: "advanced.audio.sample_rate", type: "select", options: 'dynamic' },
    sample_format: { arg: "-sample_fmt", labelKey: "advanced.audio.sample_format", type: "select", options: 'dynamic' },
    channel_layout: { arg: "-ch_layout", labelKey: "advanced.audio.channel_layout", type: "select", options: 'dynamic' },

    // alac
    min_prediction_order_alac: { arg: "-min_prediction_order", labelKey: "advanced.audio.min_prediction_order", type: "input-int", options: [1, 30] },
    max_prediction_order_alac: { arg: "-max_prediction_order", labelKey: "advanced.audio.max_prediction_order", type: "input-int", options: [1, 30] },

    // dca
    dca_adpcm: { arg: "-dca_adpcm", labelKey: "advanced.audio.dca_adpcm", type: "checkbox" },

    // vorbis
    iblock: { arg: "-iblock", labelKey: "advanced.audio.iblock", type: "input-flt", options: [-15, 0] },

    // nellymoser
    sample_rate_nellymoser: { arg: "-ar", labelKey: "advanced.audio.sample_rate", type: "select", options: widgetOptions.sample_rate_nellymoser },

    // adpcm_swf
    sample_rate_adpcm_swf: { arg: "-ar", labelKey: "advanced.audio.sample_rate", type: "select", options: widgetOptions.sample_rate_adpcm_swf },
    block_size: { arg: "-block_size", labelKey: "advanced.audio.block_size", type: "input-int", options: [32, 8192] },

    // amr_wb
    sample_rate_16000: { arg: "-ar", labelKey: "advanced.audio.sample_rate", type: "select", options: widgetOptions.sample_rate_16000 },

    // gsm, amr_nb, adpcm_g726
    sample_rate_8000: { arg: "-ar", labelKey: "advanced.audio.sample_rate", type: "select", options: widgetOptions.sample_rate_8000 },

    // adpcm_g726
    channel_layout_mono: { arg: "-ch_layout", labelKey: "advanced.audio.channel_layout", type: "select", options: widgetOptions.channel_layout_mono },
    code_size: { arg: "-code_size", labelKey: "advanced.audio.code_size", type: "input-int", options: [2, 5] },

    // mp3
    reservoir: { arg: "-reservoir", labelKey: "advanced.audio.reservoir", type: "checkbox" },
    joint_stereo: { arg: "-joint_stereo", labelKey: "advanced.audio.joint_stereo", type: "checkbox" },
    abr: { arg: "-abr", labelKey: "advanced.audio.abr", type: "checkbox" },
    copyright_flag: { arg: "-copyright", labelKey: "advanced.audio.copyright_flag", type: "checkbox" },
    original_flag: { arg: "-original", labelKey: "advanced.audio.original_flag", type: "checkbox" },

    // aac
    aac_coder: { arg: "-aac_coder", labelKey: "advanced.audio.aac_coder", type: "select", options: widgetOptions.aac_coder },
    aac_ms: { arg: "-aac_ms", labelKey: "advanced.audio.aac_ms", type: "checkbox" },
    aac_is: { arg: "-aac_is", labelKey: "advanced.audio.aac_is", type: "checkbox" },
    aac_pns: { arg: "-aac_pns", labelKey: "advanced.audio.aac_pns", type: "checkbox" },
    aac_tns: { arg: "-aac_tns", labelKey: "advanced.audio.aac_tns", type: "checkbox" },
    aac_ltp: { arg: "-aac_ltp", labelKey: "advanced.audio.aac_ltp", type: "checkbox" },
    aac_pred: { arg: "-aac_pred", labelKey: "advanced.audio.aac_pred", type: "checkbox" },
    aac_pce: { arg: "-aac_pce", labelKey: "advanced.audio.aac_pce", type: "checkbox" },

    // flac
    lpc_coeff_precision: { arg: "-lpc_coeff_precision", labelKey: "advanced.audio.lpc_coeff_precision", type: "input-int", options: [0, 15] },
    lpc_type: { arg: "-lpc_type", labelKey: "advanced.audio.lpc_type", type: "select", options: widgetOptions.lpc_type },
    lpc_passes: { arg: "-lpc_passes", labelKey: "advanced.audio.lpc_passes", type: "input-int", options: [1, 2147483647] },
    min_partition_order: { arg: "-min_partition_order", labelKey: "advanced.audio.min_partition_order", type: "input-int", options: [0, 8] },
    max_partition_order: { arg: "-max_partition_order", labelKey: "advanced.audio.max_partition_order", type: "input-int", options: [0, 8] },
    prediction_order_method: { arg: "-prediction_order_method", labelKey: "advanced.audio.prediction_order_method", type: "select", options: widgetOptions.prediction_order_method },
    ch_mode: { arg: "-ch_mode", labelKey: "advanced.audio.ch_mode", type: "select", options: widgetOptions.ch_mode },
    exact_rice_parameters: { arg: "-exact_rice_parameters", labelKey: "advanced.audio.exact_rice_parameters", type: "checkbox" },
    multi_dim_quant: { arg: "-multi_dim_quant", labelKey: "advanced.audio.multi_dim_quant", type: "checkbox" },
    min_prediction_order_flac: { arg: "-min_prediction_order", labelKey: "advanced.audio.min_prediction_order", type: "input-int", options: [0, 32] },
    max_prediction_order_flac: { arg: "-max_prediction_order", labelKey: "advanced.audio.max_prediction_order", type: "input-int", options: [0, 32] },

    // opus
    application: { arg: "-application", labelKey: "advanced.audio.application", type: "select", options: widgetOptions.application },
    frame_duration: { arg: "-frame_duration", labelKey: "advanced.audio.frame_duration", type: "input-flt", options: [2.5, 120] },
    packet_loss: { arg: "-packet_loss", labelKey: "advanced.audio.packet_loss", type: "input-int", options: [0, 100] },
    fec: { arg: "-fec", labelKey: "advanced.audio.fec", type: "checkbox" },
    vbr: { arg: "-vbr", labelKey: "advanced.audio.vbr", type: "select", options: widgetOptions.vbr },
    mapping_family: { arg: "-mapping_family", labelKey: "advanced.audio.mapping_family", type: "input-int", options: [0, 255] },
    apply_phase_inv: { arg: "-apply_phase_inv", labelKey: "advanced.audio.apply_phase_inv", type: "checkbox" },

    // ac3
    center_mixlev: { arg: "-center_mixlev", labelKey: "advanced.audio.center_mixlev", type: "input-flt", options: [0, 1] },
    surround_mixlev: { arg: "-surround_mixlev", labelKey: "advanced.audio.surround_mixlev", type: "input-flt", options: [0, 1] },
    mixing_level: { arg: "-mixing_level", labelKey: "advanced.audio.mixing_level", type: "input-int", options: [0, 111] },
    room_type: { arg: "-room_type", labelKey: "advanced.audio.room_type", type: "select", options: widgetOptions.room_type },
    per_frame_metadata: { arg: "-per_frame_metadata", labelKey: "advanced.audio.per_frame_metadata", type: "checkbox" },
    copyright_bit: { arg: "-copyright", labelKey: "advanced.audio.copyright_bit", type: "checkbox" },
    dialnorm: { arg: "-dialnorm", labelKey: "advanced.audio.dialnorm", type: "input-int", options: [-31, -1] },
    dsur_mode: { arg: "-dsur_mode", labelKey: "advanced.audio.dsur_mode", type: "select", options: widgetOptions.dsur_mode },
    original_bit: { arg: "-original", labelKey: "advanced.audio.original_bit", type: "checkbox" },
    dmix_mode: { arg: "-dmix_mode", labelKey: "advanced.audio.dmix_mode", type: "select", options: widgetOptions.dmix_mode },
    ltrt_cmixlev: { arg: "-ltrt_cmixlev", labelKey: "advanced.audio.ltrt_cmixlev", type: "input-flt", options: [0, 2] },
    ltrt_surmixlev: { arg: "-ltrt_surmixlev", labelKey: "advanced.audio.ltrt_surmixlev", type: "input-flt", options: [0, 2] },
    loro_cmixlev: { arg: "-loro_cmixlev", labelKey: "advanced.audio.loro_cmixlev", type: "input-flt", options: [0, 2] },
    loro_surmixlev: { arg: "-loro_surmixlev", labelKey: "advanced.audio.loro_surmixlev", type: "input-flt", options: [0, 2] },
    dsurex_mode: { arg: "-dsurex_mode", labelKey: "advanced.audio.dsurex_mode", type: "select", options: widgetOptions.dsurex_mode },
    dheadphone_mode: { arg: "-dheadphone_mode", labelKey: "advanced.audio.dheadphone_mode", type: "select", options: widgetOptions.dheadphone_mode },
    ad_conv_type: { arg: "-ad_conv_type", labelKey: "advanced.audio.ad_conv_type", type: "select", options: widgetOptions.ad_conv_type },
    stereo_rematrixing: { arg: "-stereo_rematrixing", labelKey: "advanced.audio.stereo_rematrixing", type: "checkbox" },
    channel_coupling: { arg: "-channel_coupling", labelKey: "advanced.audio.channel_coupling", type: "checkbox" },
    cpl_start_band: { arg: "-cpl_start_band", labelKey: "advanced.audio.cpl_start_band", type: "input-int", options: [0, 15] },

    // truehd
    max_interval: { arg: "-max_interval", labelKey: "advanced.audio.max_interval", type: "input-int", options: [8, 128] },
    lpc_type_truehd: { arg: "-lpc_type", labelKey: "advanced.audio.lpc_type", type: "select", options: widgetOptions.lpc_type_truehd },
    codebook_search: { arg: "-codebook_search", labelKey: "advanced.audio.codebook_search", type: "input-int", options: [1, 100] },
    prediction_order_truehd: { arg: "-prediction_order", labelKey: "advanced.audio.prediction_order_method", type: "select", options: widgetOptions.prediction_order_truehd },
    rematrix_precision: { arg: "-rematrix_precision", labelKey: "advanced.audio.rematrix_precision", type: "input-int", options: [0, 14] },

    // libspeex
    cbr_quality: { arg: "-cbr_quality", labelKey: "advanced.audio.cbr_quality", type: "input-int", options: [0, 10] },
    frames_per_packet: { arg: "-frames_per_packet", labelKey: "advanced.audio.frames_per_packet", type: "input-int", options: [1, 8] },
    vad: { arg: "-vad", labelKey: "advanced.audio.vad", type: "checkbox" },
    dtx: { arg: "-dtx", labelKey: "advanced.audio.dtx", type: "checkbox" },

    // wavpack
    optimize_mono: { arg: "-optimize_mono", labelKey: "advanced.audio.optimize_mono", type: "checkbox" },

    // encrypted
    qmc_mmkv: { arg: "--qmc-mmkv", labelKey: "advanced.audio.qmc_mmkv", type: "input-txt", hintKey: specialHintKeys.encryptedInput },
    qmc_mmkv_key: { arg: "--qmc-mmkv-key", labelKey: "advanced.audio.qmc_mmkv_key", type: "input-txt", hintKey: specialHintKeys.encryptedInput },
    kgg_db: { arg: "--kgg-db", labelKey: "advanced.audio.kgg_db", type: "input-txt", hintKey: specialHintKeys.encryptedInput },
    update_metadata: { arg: "--update-metadata", labelKey: "advanced.audio.update_metadata", type: "checkbox", hintKey: specialHintKeys.encryptedInput },

    // ====== image ======
    // Common ImageMagick Arguments
    quality: { arg: "-quality", labelKey: "advanced.image.quality", type: "input-int", options: [0, 100] },
    strip: { arg: "-strip", labelKey: "advanced.image.strip", type: "checkbox-novalue" },
    auto_orient: { arg: "-auto-orient", labelKey: "advanced.image.auto_orient", type: "checkbox-novalue" },
    flatten: { arg: "-flatten", labelKey: "advanced.image.flatten", type: "checkbox-novalue" },
    background: { arg: "-background", labelKey: "advanced.image.background", type: "input-txt" },
    resize: { arg: "-resize", labelKey: "advanced.image.resize", type: "input-txt" },
    scale: { arg: "-scale", labelKey: "advanced.image.scale", type: "input-txt" },
    thumbnail: { arg: "-thumbnail", labelKey: "advanced.image.thumbnail", type: "input-txt" },
    gravity: { arg: "-gravity", labelKey: "advanced.image.gravity", type: "select", options: widgetOptions.gravity },
    crop: { arg: "-crop", labelKey: "advanced.image.crop", type: "input-txt" },
    extent: { arg: "-extent", labelKey: "advanced.image.extent", type: "input-txt" },
    trim: { arg: "-trim", labelKey: "advanced.image.trim", type: "checkbox-novalue" },
    shave: { arg: "-shave", labelKey: "advanced.image.shave", type: "input-txt" },
    rotate: { arg: "-rotate", labelKey: "advanced.image.rotate", type: "input-flt", options: [-360, 360] },
    flip: { arg: "-flip", labelKey: "advanced.image.flip", type: "checkbox-novalue" },
    flop: { arg: "-flop", labelKey: "advanced.image.flop", type: "checkbox-novalue" },
    colorspace: { arg: "-colorspace", labelKey: "advanced.image.colorspace", type: "select", options: widgetOptions.colorspace },
    grayscale: { arg: "-grayscale", labelKey: "advanced.image.grayscale", type: "select", options: widgetOptions.grayscale_method },
    brightness_contrast: { arg: "-brightness-contrast", labelKey: "advanced.image.brightness_contrast", type: "input-txt" },
    normalize: { arg: "-normalize", labelKey: "advanced.image.normalize", type: "checkbox-novalue" },
    auto_gamma: { arg: "-auto-gamma", labelKey: "advanced.image.auto_gamma", type: "checkbox-novalue" },
    auto_level: { arg: "-auto-level", labelKey: "advanced.image.auto_level", type: "checkbox-novalue" },
    negate: { arg: "-negate", labelKey: "advanced.image.negate", type: "checkbox-novalue" },
    blur: { arg: "-blur", labelKey: "advanced.image.blur", type: "input-txt" },
    gaussian_blur: { arg: "-gaussian-blur", labelKey: "advanced.image.gaussian_blur", type: "input-txt" },
    sharpen: { arg: "-sharpen", labelKey: "advanced.image.sharpen", type: "input-txt" },
    unsharp: { arg: "-unsharp", labelKey: "advanced.image.unsharp", type: "input-txt" },
    depth: { arg: "-depth", labelKey: "advanced.image.depth", type: "input-int", options: [1, 32] },
    density: { arg: "-density", labelKey: "advanced.image.density", type: "input-txt" },
    compress: { arg: "-compress", labelKey: "advanced.image.compress", type: "select", options: widgetOptions.compress },
    type: { arg: "-type", labelKey: "advanced.image.type", type: "select", options: widgetOptions.type_image },
    interlace: { arg: "-interlace", labelKey: "advanced.image.interlace", type: "select", options: widgetOptions.interlace },
    sampling_factor: { arg: "-sampling-factor", labelKey: "advanced.image.sampling_factor", type: "input-txt" },
    foreground: { arg: "-foreground", labelKey: "advanced.image.foreground", type: "input-txt" },
    fill: { arg: "-fill", labelKey: "advanced.image.fill", type: "input-txt" },
    modulate: { arg: "-modulate", labelKey: "advanced.image.modulate", type: "input-txt" },
    gamma: { arg: "-gamma", labelKey: "advanced.image.gamma", type: "input-flt", options: [0.1, 10] },
    level: { arg: "-level", labelKey: "advanced.image.level", type: "input-txt" },
    equalize: { arg: "-equalize", labelKey: "advanced.image.equalize", type: "checkbox-novalue" },
    stroke: { arg: "-stroke", labelKey: "advanced.image.stroke", type: "input-txt" },
    strokewidth: { arg: "-strokewidth", labelKey: "advanced.image.strokewidth", type: "input-int", options: [1, 1000] },
    border: { arg: "-border", labelKey: "advanced.image.border", type: "input-txt" },
    bordercolor: { arg: "-bordercolor", labelKey: "advanced.image.bordercolor", type: "input-txt" },
    font: { arg: "-font", labelKey: "advanced.image.font", type: "input-txt" },
    pointsize: { arg: "-pointsize", labelKey: "advanced.image.pointsize", type: "input-int", options: [1, 1000] },

    // Rest of ImageMagick Arguments
    adaptive_blur: { arg: "-adaptive-blur", labelKey: "advanced.image.adaptive_blur", type: "input-txt" },
    adaptive_resize: { arg: "-adaptive-resize", labelKey: "advanced.image.adaptive_resize", type: "input-txt" },
    adaptive_sharpen: { arg: "-adaptive-sharpen", labelKey: "advanced.image.adaptive_sharpen", type: "input-txt" },
    affine: { arg: "-affine", labelKey: "advanced.image.affine", type: "input-txt" },
    alpha: { arg: "-alpha", labelKey: "advanced.image.alpha", type: "select", options: widgetOptions.alpha },
    annotate: { arg: "-annotate", labelKey: "advanced.image.annotate", type: "input-txt" },
    antialias: { arg: "+antialias", labelKey: "advanced.image.antialias", type: "checkbox-novalue" },
    attenuate: { arg: "-attenuate", labelKey: "advanced.image.attenuate", type: "input-flt", options: [0, 1] },
    auto_threshold: { arg: "-auto-threshold", labelKey: "advanced.image.auto_threshold", type: "select", options: widgetOptions.auto_threshold_method },
    liquid_rescale: { arg: "-liquid-rescale", labelKey: "advanced.image.liquid_rescale", type: "input-txt" },
    resample: { arg: "-resample", labelKey: "advanced.image.resample", type: "input-txt" },
    chop: { arg: "-chop", labelKey: "advanced.image.chop", type: "input-txt" },
    roll: { arg: "-roll", labelKey: "advanced.image.roll", type: "input-txt" },
    repage: { arg: "+repage", labelKey: "advanced.image.repage", type: "checkbox-novalue" },
    transpose: { arg: "-transpose", labelKey: "advanced.image.transpose", type: "checkbox-novalue" },
    transverse: { arg: "-transverse", labelKey: "advanced.image.transverse", type: "checkbox-novalue" },
    deskew: { arg: "-deskew", labelKey: "advanced.image.deskew", type: "input-txt" },
    threshold: { arg: "-threshold", labelKey: "advanced.image.threshold", type: "input-txt" },
    black_threshold: { arg: "-black-threshold", labelKey: "advanced.image.black_threshold", type: "input-txt" },
    white_threshold: { arg: "-white-threshold", labelKey: "advanced.image.white_threshold", type: "input-txt" },
    posterize: { arg: "-posterize", labelKey: "advanced.image.posterize", type: "input-int", options: [2, 256] },
    solarize: { arg: "-solarize", labelKey: "advanced.image.solarize", type: "input-txt" },
    colorize: { arg: "-colorize", labelKey: "advanced.image.colorize", type: "input-txt" },
    tint: { arg: "-tint", labelKey: "advanced.image.tint", type: "input-txt" },
    sigmoidal_contrast: { arg: "-sigmoidal-contrast", labelKey: "advanced.image.sigmoidal_contrast", type: "input-txt" },
    contrast_stretch: { arg: "-contrast-stretch", labelKey: "advanced.image.contrast_stretch", type: "input-txt" },
    bilateral_blur: { arg: "-bilateral-blur", labelKey: "advanced.image.bilateral_blur", type: "input-txt" },
    selective_blur: { arg: "-selective-blur", labelKey: "advanced.image.selective_blur", type: "input-txt" },
    motion_blur: { arg: "-motion-blur", labelKey: "advanced.image.motion_blur", type: "input-txt" },
    rotational_blur: { arg: "-rotational-blur", labelKey: "advanced.image.rotational_blur", type: "input-flt", options: [0, 360] },
    kuwahara: { arg: "-kuwahara", labelKey: "advanced.image.kuwahara", type: "input-txt" },
    median: { arg: "-median", labelKey: "advanced.image.median", type: "input-txt" },
    mean_shift: { arg: "-mean-shift", labelKey: "advanced.image.mean_shift", type: "input-txt" },
    despeckle: { arg: "-despeckle", labelKey: "advanced.image.despeckle", type: "checkbox-novalue" },
    enhance: { arg: "-enhance", labelKey: "advanced.image.enhance", type: "checkbox-novalue" },
    noise_add: { arg: "+noise", labelKey: "advanced.image.noise_add", type: "select", options: widgetOptions.noise_type },
    noise_reduce: { arg: "-noise", labelKey: "advanced.image.noise_reduce", type: "input-int", options: [1, 30] },
    edge: { arg: "-edge", labelKey: "advanced.image.edge", type: "input-flt", options: [0, 10] },
    canny: { arg: "-canny", labelKey: "advanced.image.canny", type: "input-txt" },
    morphology: { arg: "-morphology", labelKey: "advanced.image.morphology", type: "input-txt" },
    charcoal: { arg: "-charcoal", labelKey: "advanced.image.charcoal", type: "input-flt", options: [0, 10] },
    emboss: { arg: "-emboss", labelKey: "advanced.image.emboss", type: "input-txt" },
    sketch: { arg: "-sketch", labelKey: "advanced.image.sketch", type: "input-txt" },
    paint: { arg: "-paint", labelKey: "advanced.image.paint", type: "input-flt", options: [0, 30] },
    sepia_tone: { arg: "-sepia-tone", labelKey: "advanced.image.sepia_tone", type: "input-txt" },
    blue_shift: { arg: "-blue-shift", labelKey: "advanced.image.blue_shift", type: "input-flt", options: [0, 3] },
    vignette: { arg: "-vignette", labelKey: "advanced.image.vignette", type: "input-txt" },
    polaroid: { arg: "-polaroid", labelKey: "advanced.image.polaroid", type: "input-flt", options: [-360, 360] },
    implode: { arg: "-implode", labelKey: "advanced.image.implode", type: "input-flt", options: [-5, 5] },
    swirl: { arg: "-swirl", labelKey: "advanced.image.swirl", type: "input-flt", options: [-360, 360] },
    wave: { arg: "-wave", labelKey: "advanced.image.wave", type: "input-txt" },
    spread: { arg: "-spread", labelKey: "advanced.image.spread", type: "input-flt", options: [0, 100] },
    shade: { arg: "-shade", labelKey: "advanced.image.shade", type: "input-txt" },
    shadow: { arg: "-shadow", labelKey: "advanced.image.shadow", type: "input-txt" },
    raise: { arg: "-raise", labelKey: "advanced.image.raise", type: "input-int", options: [1, 100] },
    lower: { arg: "+raise", labelKey: "advanced.image.lower", type: "input-int", options: [1, 100] },
    undercolor: { arg: "-undercolor", labelKey: "advanced.image.undercolor", type: "input-txt" },
    style: { arg: "-style", labelKey: "advanced.image.style", type: "select", options: widgetOptions.font_style },
    weight: { arg: "-weight", labelKey: "advanced.image.weight", type: "select", options: widgetOptions.font_weight },
    family: { arg: "-family", labelKey: "advanced.image.family", type: "input-txt" },
    kerning: { arg: "-kerning", labelKey: "advanced.image.kerning", type: "input-flt", options: [-1000, 1000] },
    transparent: { arg: "-transparent", labelKey: "advanced.image.transparent", type: "input-txt" },
    opaque: { arg: "-opaque", labelKey: "advanced.image.opaque", type: "input-txt" },
    mattecolor: { arg: "-mattecolor", labelKey: "advanced.image.mattecolor", type: "input-txt" },
    fuzz: { arg: "-fuzz", labelKey: "advanced.image.fuzz", type: "input-txt" },
    comment: { arg: "-comment", labelKey: "advanced.image.comment", type: "input-txt" },
    label: { arg: "-label", labelKey: "advanced.image.label", type: "input-txt" },
    profile_apply: { arg: "-profile", labelKey: "advanced.image.profile_apply", type: "input-txt" },
    profile_remove: { arg: "+profile", labelKey: "advanced.image.profile_remove", type: "input-txt" },
    page: { arg: "-page", labelKey: "advanced.image.page", type: "input-txt" },
    loop: { arg: "-loop", labelKey: "advanced.image.loop", type: "input-int", options: [0, 65535] },
    delay: { arg: "-delay", labelKey: "advanced.image.delay", type: "input-txt" },
    dispose: { arg: "-dispose", labelKey: "advanced.image.dispose", type: "select", options: widgetOptions.dispose_method },
    coalesce: { arg: "-coalesce", labelKey: "advanced.image.coalesce", type: "checkbox-novalue" },
    layers: { arg: "-layers", labelKey: "advanced.image.layers", type: "input-txt" },
    channel: { arg: "-channel", labelKey: "advanced.image.channel", type: "input-txt" },
    distort: { arg: "-distort", labelKey: "advanced.image.distort", type: "input-txt" },
    evaluate: { arg: "-evaluate", labelKey: "advanced.image.evaluate", type: "input-txt" },
    convolve: { arg: "-convolve", labelKey: "advanced.image.convolve", type: "input-txt" },
    image_function: { arg: "-function", labelKey: "advanced.image.image_function", type: "input-txt" },
    fx: { arg: "-fx", labelKey: "advanced.image.fx", type: "input-txt" },
    dither: { arg: "-dither", labelKey: "advanced.image.dither", type: "select", options: widgetOptions.dither_method },
    ordered_dither: { arg: "-ordered-dither", labelKey: "advanced.image.ordered_dither", type: "input-txt" },
    statistic: { arg: "-statistic", labelKey: "advanced.image.statistic", type: "input-txt" },
    clahe: { arg: "-clahe", labelKey: "advanced.image.clahe", type: "input-txt" },
    kmeans: { arg: "-kmeans", labelKey: "advanced.image.kmeans", type: "input-txt" },
    lat: { arg: "-lat", labelKey: "advanced.image.lat", type: "input-txt" },
    color_matrix: { arg: "-color-matrix", labelKey: "advanced.image.color_matrix", type: "input-txt" },
    channel_fx: { arg: "-channel-fx", labelKey: "advanced.image.channel_fx", type: "input-txt" },
    separate: { arg: "-separate", labelKey: "advanced.image.separate", type: "checkbox-novalue" },
    colors: { arg: "-colors", labelKey: "advanced.image.colors", type: "input-int", options: [2, 65536] },
    monochrome: { arg: "-monochrome", labelKey: "advanced.image.monochrome", type: "checkbox-novalue" },
    unique_colors: { arg: "-unique-colors", labelKey: "advanced.image.unique_colors", type: "checkbox-novalue" },
    clamp: { arg: "-clamp", labelKey: "advanced.image.clamp", type: "checkbox-novalue" },
    white_balance: { arg: "-white-balance", labelKey: "advanced.image.white_balance", type: "checkbox-novalue" },
    linear_stretch: { arg: "-linear-stretch", labelKey: "advanced.image.linear_stretch", type: "input-txt" },
    level_colors: { arg: "-level-colors", labelKey: "advanced.image.level_colors", type: "input-txt" },
    wavelet_denoise: { arg: "-wavelet-denoise", labelKey: "advanced.image.wavelet_denoise", type: "input-txt" },
    random_threshold: { arg: "-random-threshold", labelKey: "advanced.image.random_threshold", type: "input-txt" },
    filter: { arg: "-filter", labelKey: "advanced.image.filter", type: "select", options: widgetOptions.filter_type },
    virtual_pixel: { arg: "-virtual-pixel", labelKey: "advanced.image.virtual_pixel", type: "select", options: widgetOptions.virtual_pixel_method },
    shear: { arg: "-shear", labelKey: "advanced.image.shear", type: "input-txt" },
    splice: { arg: "-splice", labelKey: "advanced.image.splice", type: "input-txt" },
    frame: { arg: "-frame", labelKey: "advanced.image.frame", type: "input-txt" },
    stretch: { arg: "-stretch", labelKey: "advanced.image.stretch", type: "select", options: widgetOptions.font_stretch },
    interline_spacing: { arg: "-interline-spacing", labelKey: "advanced.image.interline_spacing", type: "input-flt", options: [-1000, 1000] },
    interword_spacing: { arg: "-interword-spacing", labelKey: "advanced.image.interword_spacing", type: "input-flt", options: [-1000, 1000] },
    units: { arg: "-units", labelKey: "advanced.image.units", type: "select", options: widgetOptions.units_type },
    define: { arg: "-define", labelKey: "advanced.image.define", type: "input-txt" },
    draw: { arg: "-draw", labelKey: "advanced.image.draw", type: "input-txt" },
    contrast: { arg: "-contrast", labelKey: "advanced.image.contrast", type: "checkbox-novalue" },
    contrast_reduce: { arg: "+contrast", labelKey: "advanced.image.contrast_reduce", type: "checkbox-novalue" },
    transparent_color: { arg: "-transparent-color", labelKey: "advanced.image.transparent_color", type: "input-txt" },
    intent: { arg: "-intent", labelKey: "advanced.image.intent", type: "select", options: widgetOptions.rendering_intent },
    range_threshold: { arg: "-range-threshold", labelKey: "advanced.image.range_threshold", type: "input-txt" },
    interpolate: { arg: "-interpolate", labelKey: "advanced.image.interpolate", type: "select", options: widgetOptions.interpolate_method },
    combine_inputs: { type: 'checkbox-novalue', labelKey: 'advanced.image.combine_inputs', meta: true },
    ico_sizes: {
        type: 'group', arg: '-define', prefix: 'icon:auto-resize=', separator: ',', labelKey: 'advanced.image.ico_sizes',
        widgets: [
            { arg: '256', label: '256×256', type: 'checkbox-novalue', default: true },
            { arg: '128', label: '128×128', type: 'checkbox-novalue', default: true },
            { arg: '64', label: '64×64', type: 'checkbox-novalue', default: true },
            { arg: '48', label: '48×48', type: 'checkbox-novalue', default: true },
            { arg: '32', label: '32×32', type: 'checkbox-novalue', default: true },
            { arg: '24', label: '24×24', type: 'checkbox-novalue', default: false },
            { arg: '16', label: '16×16', type: 'checkbox-novalue', default: true },
        ],
    },
};

// ===========================================================================
// CODEC DEFINITIONS
// Reusable codec entries referenced by format videoCodecs/audioCodecs arrays.
// VC = video codecs, AC = audio codecs.
// Shape: { label, value (FFmpeg encoder name), widgets[] (widgetDefinition keys) }
// Keys are camelCase of the FFmpeg encoder name.
// ===========================================================================
const VC = {
    libx264: { label: 'H.264 (libx264)', value: 'libx264', widgets: ['framerate', 'pixel_format', 'preset', 'tune_h264', 'profile_h264', 'fastfirstpass', 'codec_level', 'wpredp', 'a53cc', 'x264opts', 'crf_63', 'crf_max', 'qp', 'aq_mode_h264', 'aq_strength', 'psy', 'psy_rd', 'rc_lookahead_frametype', 'weightb', 'weightp', 'ssim', 'intra_refresh', 'bluray_compat', 'b_bias', 'b_pyramid', 'mixed_refs', '8x8dct', 'fast_pskip', 'aud', 'mbtree', 'deblock', 'cplxblur', 'partitions', 'direct_pred', 'slice_max_size', 'nal_hrd_mp4', 'avcintra_class', 'motion_est_h264', 'forced_idr', 'coder', 'b_strategy', 'chromaoffset', 'sc_threshold', 'noise_reduction', 'udu_sei', 'x264_params', 'mb_info'] },
    h264Nvenc: { label: 'H.264 (NVENC)', value: 'h264_nvenc', widgets: ['framerate', 'pixel_format', 'preset_nvenc_h264', 'tune_nvenc', 'profile_h264_nvenc', 'level_nvenc_h264', 'rc_nvenc', 'qp_nvenc', 'cq_nvenc', 'qmin_nvenc', 'qmax_nvenc', 'init_qpI', 'init_qpP', 'init_qpB', 'qp_cb_offset', 'qp_cr_offset', 'multipass_nvenc', 'nvenc_2pass', 'highbitdepth', 'rc_lookahead_nvenc', 'lookahead_level_nvenc', 'no_scenecut', 'b_adapt', 'spatial_aq', 'temporal_aq', 'aq_strength_nvenc', 'b_ref_mode_nvenc', 'coder_nvenc', 'weighted_pred', 'zerolatency', 'nonref_p', 'strict_gop_nvenc', 'cbr', 'cbr_padding', 'constrained_encoding', 'forced_idr', 'intra_refresh', 'single_slice_intra_refresh', 'max_slice_size_nvenc', 'surfaces', 'gpu', 'delay_nvenc', 'dpb_size', 'rgb_mode_nvenc', 'tf_level_nvenc', 'extra_sei', 's12m_tc', 'ldkfs', 'aud', 'a53cc', 'udu_sei', 'bluray_compat'] },
    h264Amf: { label: 'H.264 (AMF)', value: 'h264_amf', widgets: ['framerate', 'pixel_format', 'usage_amf', 'profile_h264_amf', 'level_amf_h264', 'latency_amf', 'preset_amf', 'rc_amf', 'qvbr_quality_level_amf', 'qp_i_amf', 'qp_p_amf', 'qp_b_amf', 'enforce_hrd_amf', 'filler_data_amf', 'vbaq_amf', 'frame_skipping_amf', 'preencode_amf', 'max_au_size_amf', 'header_spacing_amf', 'async_depth_amf', 'bf_delta_qp_amf', 'bf_ref_amf', 'bf_ref_delta_qp_amf', 'max_b_frames_amf', 'bf_amf', 'intra_refresh_mb_amf', 'coder_amf', 'hmqb_amf', 'me_half_pel_amf', 'me_quarter_pel_amf', 'forced_idr', 'aud', 'smart_access_video_amf', 'preanalysis_amf', 'pa_activity_type_amf', 'pa_scene_change_detection_amf', 'pa_scene_change_sensitivity_amf', 'pa_static_scene_detection_amf', 'pa_static_scene_sensitivity_amf', 'pa_initial_qp_scene_change_amf', 'pa_max_qp_force_skip_amf', 'pa_caq_strength_amf', 'pa_frame_sad_amf', 'pa_ltr_amf', 'pa_lookahead_depth_amf', 'pa_paq_mode_amf', 'pa_taq_mode_amf', 'pa_hmqb_mode_amf', 'pa_adaptive_mini_gop_amf'] },
    h264Qsv: { label: 'H.264 (QSV)', value: 'h264_qsv', widgets: ['framerate', 'pixel_format', 'profile_h264_qsv', 'preset_qsv', 'scenario_qsv', 'low_power_qsv', 'async_depth_qsv', 'rdo_qsv', 'bitrate_limit_qsv', 'mbbrc_qsv', 'extbrc_qsv', 'low_delay_brc_qsv', 'max_frame_size_qsv', 'max_frame_size_i_qsv', 'max_frame_size_p_qsv', 'max_slice_size_qsv', 'max_qp_i_qsv', 'min_qp_i_qsv', 'max_qp_p_qsv', 'min_qp_p_qsv', 'max_qp_b_qsv', 'min_qp_b_qsv', 'avbr_accuracy_qsv', 'avbr_convergence_qsv', 'adaptive_i_qsv', 'adaptive_b_qsv', 'p_strategy_qsv', 'b_strategy_qsv', 'dblk_idc_qsv', 'skip_frame_qsv', 'look_ahead_qsv', 'look_ahead_depth_qsv', 'look_ahead_downsampling_qsv', 'int_ref_type_qsv', 'int_ref_cycle_size_qsv', 'int_ref_qp_delta_qsv', 'int_ref_cycle_dist_qsv', 'recovery_point_sei_qsv', 'cavlc_qsv', 'vcm_qsv', 'dual_gfx_qsv', 'idr_interval_qsv', 'pic_timing_sei_qsv', 'single_sei_nal_unit_qsv', 'max_dec_frame_buffering_qsv', 'repeat_pps_qsv', 'qsv_params', 'forced_idr', 'aud', 'a53cc'] },
    libx265: { label: 'H.265 (libx265)', value: 'libx265', widgets: ['framerate', 'pixel_format', 'crf_51', 'qp', 'forced_idr', 'preset', 'tune_h265', 'profile_h265', 'udu_sei', 'a53cc', 'x265_params', 'dolbyvision'] },
    hevcNvenc: { label: 'H.265 (NVENC)', value: 'hevc_nvenc', widgets: ['framerate', 'pixel_format', 'preset_nvenc_h264', 'tune_nvenc_h265', 'profile_h265_nvenc', 'level_nvenc_h265', 'tier_nvenc', 'rc_nvenc', 'qp_nvenc', 'cq_nvenc', 'qmin_nvenc', 'qmax_nvenc', 'init_qpI', 'init_qpP', 'init_qpB', 'qp_cb_offset', 'qp_cr_offset', 'multipass_nvenc', 'nvenc_2pass', 'highbitdepth', 'rc_lookahead_nvenc', 'lookahead_level_nvenc', 'no_scenecut', 'spatial_aq', 'temporal_aq', 'aq_strength_nvenc', 'b_ref_mode_nvenc', 'weighted_pred', 'unidir_b_nvenc', 'zerolatency', 'nonref_p', 'strict_gop_nvenc', 'cbr', 'cbr_padding', 'constrained_encoding', 'forced_idr', 'intra_refresh', 'single_slice_intra_refresh', 'max_slice_size_nvenc', 'surfaces', 'gpu', 'delay_nvenc', 'dpb_size', 'rgb_mode_nvenc', 'tf_level_nvenc', 'split_encode_mode_nvenc', 'extra_sei', 's12m_tc', 'ldkfs', 'aud', 'a53cc', 'udu_sei', 'bluray_compat'] },
    hevcAmf: { label: 'H.265 (AMF)', value: 'hevc_amf', widgets: ['framerate', 'pixel_format', 'usage_amf', 'bitdepth_amf', 'profile_h265_amf', 'profile_tier_amf', 'level_amf_h265', 'latency_amf', 'preset_amf', 'rc_amf', 'qvbr_quality_level_amf', 'qp_i_amf', 'qp_p_amf', 'min_qp_i_amf', 'max_qp_i_amf', 'min_qp_p_amf', 'max_qp_p_amf', 'enforce_hrd_amf', 'filler_data_amf', 'vbaq_amf', 'skip_frame_amf', 'preencode_amf', 'max_au_size_amf', 'header_insertion_mode_amf', 'gops_per_idr_amf', 'async_depth_amf', 'hmqb_amf', 'me_half_pel_amf', 'me_quarter_pel_amf', 'forced_idr', 'aud', 'smart_access_video_amf', 'preanalysis_amf', 'pa_activity_type_amf', 'pa_scene_change_detection_amf', 'pa_scene_change_sensitivity_amf', 'pa_static_scene_detection_amf', 'pa_static_scene_sensitivity_amf', 'pa_initial_qp_scene_change_amf', 'pa_max_qp_force_skip_amf', 'pa_caq_strength_amf', 'pa_frame_sad_amf', 'pa_ltr_amf', 'pa_lookahead_depth_amf', 'pa_paq_mode_amf', 'pa_taq_mode_amf', 'pa_hmqb_mode_amf', 'pa_adaptive_mini_gop_amf'] },
    hevcQsv: { label: 'H.265 (QSV)', value: 'hevc_qsv', widgets: ['framerate', 'pixel_format', 'profile_h265_qsv', 'tier_qsv', 'preset_qsv', 'scenario_qsv', 'low_power_qsv', 'async_depth_qsv', 'gpb_qsv', 'rdo_qsv', 'mbbrc_qsv', 'extbrc_qsv', 'low_delay_brc_qsv', 'max_frame_size_qsv', 'max_frame_size_i_qsv', 'max_frame_size_p_qsv', 'max_slice_size_qsv', 'max_qp_i_qsv', 'min_qp_i_qsv', 'max_qp_p_qsv', 'min_qp_p_qsv', 'max_qp_b_qsv', 'min_qp_b_qsv', 'avbr_accuracy_qsv', 'avbr_convergence_qsv', 'adaptive_i_qsv', 'adaptive_b_qsv', 'b_strategy_qsv', 'dblk_idc_qsv', 'skip_frame_qsv', 'dual_gfx_qsv', 'tile_cols_qsv', 'tile_rows_qsv', 'int_ref_type_qsv', 'int_ref_cycle_size_qsv', 'int_ref_qp_delta_qsv', 'int_ref_cycle_dist_qsv', 'recovery_point_sei_qsv', 'transform_skip_qsv', 'load_plugin_qsv', 'load_plugins_qsv', 'idr_interval_hevc_qsv', 'look_ahead_depth_qsv', 'pic_timing_sei_qsv', 'qsv_params', 'forced_idr', 'aud'] },
    libaomAv1: { label: 'AV1 (libaom)', value: 'libaom-av1', widgets: ['framerate', 'pixel_format', 'cpu_used_av1', 'auto_alt_ref', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'aq_mode_av1', 'crf_63', 'static_thresh', 'drop_threshold', 'denoise_noise_level', 'denoise_block_size', 'undershoot_pct', 'overshoot_pct', 'minsection_pct', 'maxsection_pct', 'frame_parallel', 'tiles', 'tile_columns', 'tile_rows', 'row_mt', 'enable_cdef', 'enable_global_motion', 'enable_intrabc', 'enable_restoration', 'usage', 'tune', 'still_picture', 'dolbyvision', 'enable_rect_partitions', 'enable_1to4_partitions', 'enable_ab_partitions', 'enable_angle_delta', 'enable_cfl_intra', 'enable_filter_intra', 'enable_intra_edge_filter', 'enable_smooth_intra', 'enable_paeth_intra', 'enable_palette', 'enable_flip_idtx', 'enable_tx64', 'reduced_tx_type_set', 'use_intra_dct_only', 'use_inter_dct_only', 'use_intra_default_tx_only', 'enable_ref_frame_mvs', 'enable_reduced_reference_set', 'enable_obmc', 'enable_dual_filter', 'enable_diff_wtd_comp', 'enable_dist_wtd_comp', 'enable_onesided_comp', 'enable_interinter_wedge', 'enable_interintra_wedge', 'enable_masked_comp', 'enable_interintra_comp', 'enable_smooth_interintra', 'aom_params'] },
    libsvtav1: { label: 'AV1 (SVT-AV1)', value: 'libsvtav1', widgets: ['framerate', 'pixel_format', 'preset_av1', 'crf_63', 'qp_av1', 'svtav1_params', 'dolbyvision'] },
    librav1e: { label: 'AV1 (librav1e)', value: 'librav1e', widgets: ['framerate', 'pixel_format', 'speed_rav1e', 'qp_rav1e', 'tiles_rav1e', 'tile_columns_rav1e', 'tile_rows_rav1e', 'rav1e_params'] },
    av1Nvenc: { label: 'AV1 (NVENC)', value: 'av1_nvenc', widgets: ['framerate', 'pixel_format', 'preset_nvenc_av1', 'tune_nvenc_h265', 'level_nvenc_av1', 'tier_nvenc_av1', 'rc_nvenc_av1', 'qp_av1_nvenc', 'cq_av1_nvenc', 'qmin_av1_nvenc', 'qmax_av1_nvenc', 'init_qpI_av1_nvenc', 'init_qpP_av1_nvenc', 'init_qpB_av1_nvenc', 'qp_cb_offset', 'qp_cr_offset', 'multipass_nvenc', 'highbitdepth', 'tile_rows_av1_nvenc', 'tile_columns_av1_nvenc', 'rc_lookahead_nvenc', 'lookahead_level_nvenc', 'no_scenecut', 'b_adapt', 'spatial_aq', 'temporal_aq', 'aq_strength_nvenc', 'weighted_pred', 'b_ref_mode_nvenc', 'zerolatency', 'nonref_p', 'strict_gop_nvenc', 'forced_idr', 'intra_refresh', 'timing_info_av1_nvenc', 'cbr_padding', 'surfaces', 'gpu', 'delay_nvenc', 'dpb_size', 'ldkfs', 'rgb_mode_nvenc', 'tf_level_nvenc', 'split_encode_mode_nvenc', 'extra_sei', 'a53cc', 's12m_tc'] },
    av1Amf: { label: 'AV1 (AMF)', value: 'av1_amf', widgets: ['framerate', 'pixel_format', 'usage_amf', 'bitdepth_amf', 'profile_av1_amf', 'level_amf_av1', 'preset_av1_amf', 'latency_av1_amf', 'rc_amf', 'qvbr_quality_level_av1_amf', 'qp_i_av1_amf', 'qp_p_av1_amf', 'qp_b_av1_amf', 'min_qp_i_av1_amf', 'max_qp_i_av1_amf', 'min_qp_p_av1_amf', 'max_qp_p_av1_amf', 'min_qp_b_av1_amf', 'max_qp_b_av1_amf', 'aq_mode_av1_amf', 'enforce_hrd_amf', 'filler_data_amf', 'skip_frame_amf', 'preencode_amf', 'header_insertion_mode_av1_amf', 'async_depth_amf', 'max_b_frames_av1_amf', 'bf_av1_amf', 'hmqb_amf', 'forced_idr', 'align_av1_amf', 'smart_access_video_amf', 'preanalysis_amf', 'pa_activity_type_amf', 'pa_scene_change_detection_amf', 'pa_scene_change_sensitivity_amf', 'pa_static_scene_detection_amf', 'pa_static_scene_sensitivity_amf', 'pa_initial_qp_scene_change_av1_amf', 'pa_max_qp_force_skip_av1_amf', 'pa_caq_strength_amf', 'pa_frame_sad_amf', 'pa_ltr_amf', 'pa_lookahead_depth_av1_amf', 'pa_paq_mode_amf', 'pa_taq_mode_amf', 'pa_hmqb_mode_amf', 'pa_adaptive_mini_gop_amf'] },
    libvpx: { label: 'VP8', value: 'libvpx', widgets: ['framerate', 'pixel_format', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'arnr_type', 'tune', 'deadline', 'error_resilient', 'max_intra_rate', 'crf_63', 'static_thresh', 'drop_threshold', 'noise_sensitivity', 'undershoot_pct', 'overshoot_pct', 'ts_parameters', 'auto_alt_ref', 'cpu_used_vpx', 'screen_content_mode', 'speed', 'quality_vpx', 'vp8flags', 'rc_lookahead_altref', 'sharpness'] },
    libvpxVp9: { label: 'VP9', value: 'libvpx-vp9', widgets: ['framerate', 'pixel_format', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'arnr_type', 'tune', 'deadline', 'error_resilient', 'max_intra_rate', 'crf_63', 'static_thresh', 'drop_threshold', 'noise_sensitivity', 'undershoot_pct', 'overshoot_pct', 'ts_parameters', 'auto_alt_ref_vp9', 'cpu_used_vp9', 'lossless', 'tile_columns', 'tile_rows_vp9', 'frame_parallel', 'aq_mode_vp9', 'level_vp9', 'row_mt', 'tune_content', 'corpus_complexity', 'enable_tpl', 'min_gf_interval', 'speed', 'quality_vpx', 'rc_lookahead_altref', 'sharpness'] },
    h263p: { label: 'H.263+', value: 'h263p', widgets: ['framerate', 'pixel_format', 'umv_h263p', 'aiv_h263p', 'obmc_h263p', 'structured_slices_h263p', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    mpeg4: { label: 'MPEG-4 Part 2', value: 'mpeg4', widgets: ['framerate', 'pixel_format', 'data_partitioning', 'alternate_scan', 'mpeg_quant', 'b_strategy', 'b_sensitivity', 'brd_scale', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    libxvid: { label: 'MPEG-4 Part 2 (Xvid)', value: 'libxvid', widgets: ['framerate', 'pixel_format', 'lumi_aq_xvid', 'variance_aq_xvid', 'ssim_xvid', 'ssim_acc_xvid', 'gmc_xvid', 'me_quality_xvid', 'mpeg_quant'] },
    mpeg2video: { label: 'MPEG-2 Video', value: 'mpeg2video', widgets: ['framerate_DYN', 'pixel_format', 'gop_timecode', 'drop_frame_timecode', 'scan_offset', 'timecode_frame_start', 'b_strategy', 'b_sensitivity', 'brd_scale', 'intra_vlc', 'non_linear_quant', 'alternate_scan', 'a53cc', 'seq_disp_ext', 'video_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_init_cplx', 'rc_eq', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    mpeg1video: { label: 'MPEG-1 Video', value: 'mpeg1video', widgets: ['framerate_DYN', 'pixel_format', 'gop_timecode', 'drop_frame_timecode', 'scan_offset', 'timecode_frame_start', 'b_strategy', 'b_sensitivity', 'brd_scale', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_init_cplx', 'rc_eq', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    mjpeg: { label: 'MJPEG', value: 'mjpeg', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'huffman', 'force_duplicated_matrix'] },
    prores: { label: 'Apple ProRes', value: 'prores', widgets: ['framerate', 'pixel_format', 'vendor'] },
    dnxhd: { label: 'DNxHD', value: 'dnxhd', widgets: ['framerate', 'pixel_format', 'nitris_compat', 'ibias', 'profile_dnxhd'] },
    ffv1: { label: 'FFV1', value: 'ffv1', widgets: ['framerate', 'pixel_format', 'slicecrc', 'coder_ffv1', 'context'] },
    huffyuv: { label: 'HuffYUV', value: 'huffyuv', widgets: ['framerate', 'pixel_format', 'non_deterministic', 'pred_huffyuv'] },
    dvvideo: { label: 'DV Video', value: 'dvvideo', widgets: ['resolution_dvvideo', 'framerate_dvvideo', 'pixel_format', 'quant_deadzone'] },
    amvVideo: { label: 'AMV Video', value: 'amv', widgets: ['framerate', 'pixel_format', 'mpv_flags_amv', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'noise_reduction', 'ps'] },
    qtrle: { label: 'QuickTime RLE', value: 'qtrle', widgets: ['framerate', 'pixel_format'] },
    cinepak: { label: 'Cinepak', value: 'cinepak', widgets: ['framerate', 'pixel_format', 'max_extra_cb_iterations', 'skip_empty_cb', 'max_strips', 'min_strips', 'strip_number_adaptivity'] },
    rpza: { label: 'QuickTime RPZA', value: 'rpza', widgets: ['framerate', 'pixel_format', 'skip_frame_thresh', 'start_one_color_thresh', 'continue_one_color_thresh', 'sixteen_color_thresh'] },
    wmv1: { label: 'WMV1', value: 'wmv1', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    wmv2: { label: 'WMV2', value: 'wmv2', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    msvideo1: { label: 'Microsoft Video 1', value: 'msvideo1', widgets: ['framerate', 'pixel_format'] },
    flv1: { label: 'Sorenson Spark', value: 'flv1', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    libtheora: { label: 'Theora', value: 'libtheora', widgets: ['framerate', 'pixel_format', 'speed_level_theora'] },
    rv10: { label: 'RealVideo 1.0', value: 'rv10', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
    rv20: { label: 'RealVideo 2.0', value: 'rv20', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
};
const AC = {
    aac: { label: 'AAC', value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
    libmp3lame: { label: 'MP3', value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
    mp2: { label: 'MP2', value: 'mp2', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
    ac3: { label: 'AC-3', value: 'ac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'center_mixlev', 'surround_mixlev', 'mixing_level', 'room_type', 'per_frame_metadata', 'copyright_bit', 'dialnorm', 'dsur_mode', 'original_bit', 'dmix_mode', 'ltrt_cmixlev', 'ltrt_surmixlev', 'loro_cmixlev', 'loro_surmixlev', 'dsurex_mode', 'dheadphone_mode', 'ad_conv_type', 'stereo_rematrixing'] },
    eac3: { label: 'E-AC-3', value: 'eac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'mixing_level', 'room_type', 'per_frame_metadata', 'copyright_bit', 'dialnorm', 'dsur_mode', 'original_bit', 'dmix_mode', 'ltrt_cmixlev', 'ltrt_surmixlev', 'loro_cmixlev', 'loro_surmixlev', 'dsurex_mode', 'dheadphone_mode', 'ad_conv_type', 'stereo_rematrixing', 'channel_coupling', 'cpl_start_band'] },
    truehd: { label: 'TrueHD', value: 'truehd', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'max_interval', 'lpc_coeff_precision', 'lpc_type_truehd', 'lpc_passes', 'codebook_search', 'prediction_order_truehd', 'rematrix_precision'] },
    mlp: { label: 'MLP', value: 'mlp', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'max_interval', 'lpc_coeff_precision', 'lpc_type_truehd', 'lpc_passes', 'codebook_search', 'prediction_order_truehd', 'rematrix_precision'] },
    dca: { label: 'DTS', value: 'dca', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'dca_adpcm'] },
    libopus: { label: 'Opus', value: 'libopus', widgets: ['sample_rate', 'sample_format', 'application', 'frame_duration', 'packet_loss', 'fec', 'vbr', 'mapping_family', 'apply_phase_inv'] },
    libvorbis: { label: 'Vorbis', value: 'libvorbis', widgets: ['sample_format', 'iblock'] },
    alac: { label: 'ALAC', value: 'alac', widgets: ['sample_format', 'channel_layout', 'min_prediction_order_alac', 'max_prediction_order_alac'] },
    flac: { label: 'FLAC', value: 'flac', widgets: ['sample_format', 'lpc_coeff_precision', 'lpc_type', 'lpc_passes', 'min_partition_order', 'max_partition_order', 'prediction_order_method', 'ch_mode', 'exact_rice_parameters', 'multi_dim_quant', 'min_prediction_order_flac', 'max_prediction_order_flac'] },
    tta: { label: 'TTA', value: 'tta', widgets: ['sample_format'] },
    wavpack: { label: 'WavPack', value: 'wavpack', widgets: ['sample_format', 'joint_stereo', 'optimize_mono'] },
    wmav1: { label: 'WMA v1', value: 'wmav1', widgets: ['sample_format'] },
    wmav2: { label: 'WMA v2', value: 'wmav2', widgets: ['sample_format'] },
    pcm_s16le: { label: 'PCM 16-bit LE', value: 'pcm_s16le', widgets: ['sample_format'] },
    pcm_s24le: { label: 'PCM 24-bit LE', value: 'pcm_s24le', widgets: ['sample_format'] },
    pcm_s32le: { label: 'PCM 32-bit LE', value: 'pcm_s32le', widgets: ['sample_format'] },
    pcm_f32le: { label: 'PCM Float 32-bit LE', value: 'pcm_f32le', widgets: ['sample_format'] },
    pcm_alaw: { label: 'PCM A-law', value: 'pcm_alaw', widgets: ['sample_format'] },
    pcm_mulaw: { label: 'PCM µ-law', value: 'pcm_mulaw', widgets: ['sample_format'] },
    pcm_s16be: { label: 'PCM 16-bit BE', value: 'pcm_s16be', widgets: ['sample_format'] },
    pcm_s24be: { label: 'PCM 24-bit BE', value: 'pcm_s24be', widgets: ['sample_format'] },
    pcm_s32be: { label: 'PCM 32-bit BE', value: 'pcm_s32be', widgets: ['sample_format'] },
    pcm_dvd: { label: 'PCM DVD', value: 'pcm_dvd', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
    adpcm_swf: { label: 'ADPCM (SWF)', value: 'adpcm_swf', widgets: ['sample_rate_adpcm_swf', 'sample_format', 'channel_layout', 'block_size'] },
    adpcm_ima_wav: { label: 'ADPCM IMA WAV', value: 'adpcm_ima_wav', widgets: ['sample_format', 'channel_layout', 'block_size'] },
    adpcm_ms: { label: 'ADPCM MS', value: 'adpcm_ms', widgets: ['sample_format', 'channel_layout', 'block_size'] },
    adpcm_ima_amv: { label: 'ADPCM IMA AMV', value: 'adpcm_ima_amv', widgets: ['sample_format', 'channel_layout', 'block_size'] },
    libspeex: { label: 'Speex', value: 'libspeex', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'abr', 'cbr_quality', 'frames_per_packet', 'vad', 'dtx'] },
    libopencore_amrnb: { label: 'AMR-NB', value: 'libopencore_amrnb', widgets: ['sample_rate_8000', 'sample_format', 'channel_layout_mono', 'dtx'] },
    libvo_amrwbenc: { label: 'AMR-WB', value: 'libvo_amrwbenc', widgets: ['sample_rate_16000', 'sample_format', 'channel_layout_mono', 'dtx'] },
    gsm_ms: { label: 'GSM-MS', value: 'gsm_ms', widgets: ['sample_rate_8000', 'sample_format', 'channel_layout'] },
    nellymoser: { label: 'Nellymoser', value: 'nellymoser', widgets: ['sample_rate_nellymoser', 'sample_format', 'channel_layout'] },
    g722: { label: 'G.722', value: 'g722', widgets: ['sample_format', 'channel_layout'] },
    g726: { label: 'G.726', value: 'g726', widgets: ['sample_rate_8000', 'sample_format', 'channel_layout_mono', 'code_size'] },
    real_144: { label: 'RealAudio 1.0', value: 'real_144', widgets: ['sample_rate_8000', 'sample_format', 'channel_layout_mono'] },
};

const outVideoFormats = [
    'mp4', 'mkv', 'webm', 'mov', 'avi', 'wmv', 'flv', 'm4v', 'ts', 'm2ts', 'mpeg', 'mpg', 'vob',
    '3gp', 'qt', 'ogv', 'f4v', 'asf', 'divx', 'mxf', 'swf', 'rm', 'rmvb', '3g2', 'ogx',
    'm2p', 'dat', 'mts', 'amv', 'dv', 'gxf'
];
const outAudioFormats = [
    'mp3', 'm4a', 'aac', 'flac', 'wav', 'ogg', 'opus', 'wma', 'aiff',
    'mp2', 'm2a', 'mpa', 'm4b',
    'oga', 'spx', 'amr',
    'caf', 'au', 'w64', 'aif', 'aifc', 'afc',
    'mka',
    'ac3', 'eac3', 'ec3', 'dts', 'thd', 'mlp',
    'wv', 'tta',
    'ra', 'voc', 'sox'
];
const outImageFormats = [
    'jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff',
    'heic', 'heif', 'avif', 'jxl', 'jp2', 'j2k', 'jxr', 'wdp',
    'svg', 'pdf', 'eps', 'ps', 'ai',
    'psd', 'exr', 'hdr', 'qoi', 'ico', 'cur',
    'tga', 'dds', 'pcx', 'dcx', 'dib',
    'pnm', 'ppm', 'pgm', 'pbm', 'xpm', 'xbm'
];
const generalVideoWidgets = ['disable_video', 'disable_subtitle', 'fast_start', 'pass', 'frame_size', 'video_rotate', 'video_flip', 'video_bitrate', 'vframes', 'aspect_ratio'];
const generalAudioWidgets = ['audio_volume', 'audio_speed', 'audio_quality', 'audio_bitrate', 'audio_channels', 'aframes'];
const generalImageWidgets = [
    'quality', 'strip', 'auto_orient', 'flatten', 'background', 'resize', 'scale', 'thumbnail',
    'gravity', 'crop', 'extent', 'trim', 'shave', 'rotate', 'flip', 'flop', 'colorspace', 'grayscale',
    'brightness_contrast', 'normalize', 'auto_gamma', 'auto_level', 'negate', 'blur', 'gaussian_blur',
    'sharpen', 'unsharp', 'depth', 'density', 'compress', 'type', 'interlace', 'sampling_factor',
    'foreground', 'fill', 'modulate', 'gamma', 'level', 'equalize', 'stroke', 'strokewidth', 'border',
    'bordercolor', 'font', 'pointsize', 'adaptive_blur', 'adaptive_resize', 'adaptive_sharpen', 'affine',
    'alpha', 'annotate', 'antialias', 'attenuate', 'auto_threshold', 'liquid_rescale', 'resample', 'chop',
    'roll', 'repage', 'transpose', 'transverse', 'deskew', 'threshold', 'black_threshold',
    'white_threshold', 'posterize', 'solarize', 'colorize', 'tint', 'sigmoidal_contrast',
    'contrast_stretch', 'bilateral_blur', 'selective_blur', 'motion_blur', 'rotational_blur',
    'kuwahara', 'median', 'mean_shift', 'despeckle', 'enhance', 'noise_add', 'noise_reduce', 'edge',
    'canny', 'morphology', 'charcoal', 'emboss', 'sketch', 'paint', 'sepia_tone', 'blue_shift',
    'vignette', 'polaroid', 'implode', 'swirl', 'wave', 'spread', 'shade', 'shadow', 'raise', 'lower',
    'undercolor', 'style', 'weight', 'family', 'kerning', 'transparent', 'opaque', 'mattecolor',
    'fuzz', 'comment', 'label', 'profile_apply', 'profile_remove', 'layers', 'channel', 'distort',
    'evaluate', 'convolve', 'image_function', 'fx', 'dither', 'ordered_dither', 'statistic', 'clahe',
    'kmeans', 'lat', 'color_matrix', 'channel_fx', 'separate', 'colors', 'monochrome', 'unique_colors',
    'clamp', 'white_balance', 'linear_stretch', 'level_colors', 'wavelet_denoise', 'random_threshold',
    'filter', 'virtual_pixel', 'shear', 'splice', 'frame', 'stretch', 'interline_spacing',
    'interword_spacing', 'units', 'define', 'draw', 'contrast', 'contrast_reduce', 'transparent_color',
    'intent', 'range_threshold', 'interpolate'
];

export const formatTags = {
    encrypted: 'encrypted',
};

// ===========================================================================
// FORMATS
// Main format table; each key is a file extension.
// Shape: { group, tool, outputs[], tags?, videoCodecs?, audioCodecs?, codecs?, widgets? }
//   group: 'video' | 'audio' | 'image'
//   tool:  'ffmpeg' | 'magick'
// ===========================================================================
export const formats = {
    // ====== Audio Formats ======
    mp3: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libmp3lame]
    },
    flac: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.flac]
    },
    wav: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16le, AC.pcm_s24le, AC.pcm_s32le, AC.pcm_f32le, AC.adpcm_ima_wav, AC.adpcm_ms, AC.pcm_alaw, AC.pcm_mulaw, AC.g722, AC.g726]
    },
    aac: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.aac]
    },
    ogg: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libvorbis, AC.libopus, AC.libspeex, AC.flac]
    },
    m4a: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.aac, AC.alac]
    },
    wma: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.wmav2, AC.wmav1]
    },
    aiff: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16be, AC.pcm_s24be, AC.pcm_s32be]
    },
    opus: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libopus]
    },
    mp2: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.mp2]
    },
    m2a: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.mp2]
    },
    mpa: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.mp2]
    },
    m4b: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.aac, AC.alac]
    },
    w64: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16le, AC.pcm_s24le, AC.pcm_s32le, AC.pcm_f32le]
    },
    aif: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16be, AC.pcm_s24be, AC.pcm_s32be]
    },
    aifc: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16be, AC.pcm_s24be, AC.pcm_s32be]
    },
    afc: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16be, AC.pcm_s24be, AC.pcm_s32be]
    },
    oga: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libvorbis, AC.libopus, AC.libspeex, AC.flac]
    },
    spx: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libspeex]
    },
    amr: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libopencore_amrnb, AC.libvo_amrwbenc]
    },
    au: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16be, AC.pcm_s24be, AC.pcm_s32be, AC.pcm_alaw, AC.pcm_mulaw]
    },
    caf: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.aac, AC.alac, AC.flac, AC.libopus, AC.pcm_s16be, AC.pcm_s24be, AC.pcm_s32be]
    },
    mka: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libopus, AC.libvorbis, AC.aac, AC.libmp3lame, AC.flac, AC.alac, AC.wavpack, AC.tta, AC.ac3, AC.eac3, AC.dca, AC.truehd, AC.mp2]
    },
    weba: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.libopus, AC.libvorbis]
    },
    ac3: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.ac3]
    },
    eac3: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.eac3]
    },
    ec3: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.eac3]
    },
    dts: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.dca]
    },
    truehd: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.truehd]
    },
    thd: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.truehd]
    },
    mlp: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.mlp]
    },
    tta: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.tta]
    },
    wv: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.wavpack]
    },
    ra: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.real_144, AC.libmp3lame, AC.ac3]
    },
    voc: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s16le, AC.pcm_alaw, AC.pcm_mulaw]
    },
    sox: {
        group: 'audio', tool: 'ffmpeg',
        outputs: outAudioFormats,
        widgets: generalAudioWidgets,
        codecs: [AC.pcm_s32le, AC.pcm_s16le]
    },
    // Encrypted audio formats (input only)
    qmc0: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key'] },
    qmc2: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key'] },
    qmc3: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key'] },
    qmcflac: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key'] },
    qmcogg: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key'] },
    tkm: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    bkcmp3: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    bkcflac: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    tm0: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    tm2: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    tm3: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    tm6: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    mflac: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    mgg: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    mflac0: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    mgg1: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    mggl: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    ofl_en: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    ncm: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    xm: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    kwm: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    kgm: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'kgg_db'] },
    vpr: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata', 'kgg_db'] },
    x2m: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    x3m: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },
    mg3d: { group: 'audio', tool: 'ffmpeg', outputs: outAudioFormats, tags: [formatTags.encrypted], widgets_input: ['update_metadata'] },

    // ====== Video Formats ======
    mp4: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.libaomAv1, VC.libsvtav1, VC.librav1e, VC.av1Nvenc, VC.av1Amf, VC.mpeg4, VC.mpeg2video, VC.mjpeg, VC.prores],
        audioCodecs: [AC.aac, AC.ac3, AC.eac3, AC.dca, AC.alac, AC.flac, AC.libopus, AC.libmp3lame]
    },
    mkv: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.libaomAv1, VC.libsvtav1, VC.librav1e, VC.av1Nvenc, VC.av1Amf, VC.libvpx, VC.libvpxVp9, VC.mpeg4, VC.mpeg2video, VC.prores, VC.dnxhd, VC.ffv1, VC.huffyuv],
        audioCodecs: [AC.aac, AC.ac3, AC.eac3, AC.dca, AC.truehd, AC.alac, AC.flac, AC.libopus, AC.libvorbis, AC.libmp3lame, AC.mp2]
    },
    mov: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.prores, VC.dnxhd, VC.mjpeg, VC.dvvideo, VC.qtrle, VC.cinepak, VC.rpza],
        audioCodecs: [AC.aac, AC.alac, AC.pcm_s16le, AC.pcm_s24be, AC.libmp3lame]
    },
    avi: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg4, VC.dvvideo, VC.mjpeg, VC.huffyuv, VC.ffv1, VC.msvideo1, VC.cinepak],
        audioCodecs: [AC.libmp3lame, AC.pcm_s16le, AC.ac3]
    },
    webm: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libvpx, VC.libvpxVp9, VC.libaomAv1, VC.libsvtav1, VC.librav1e, VC.av1Nvenc, VC.av1Amf],
        audioCodecs: [AC.libopus, AC.libvorbis]
    },
    flv: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.flv1, VC.libx264],
        audioCodecs: [AC.libmp3lame, AC.aac, AC.nellymoser, AC.adpcm_swf]
    },
    wmv: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.wmv1, VC.wmv2],
        audioCodecs: [AC.wmav1, AC.wmav2, AC.gsm_ms]
    },
    mpeg: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg1video, VC.mpeg2video],
        audioCodecs: [AC.mp2, AC.libmp3lame, AC.ac3, AC.dca, AC.pcm_dvd, AC.pcm_s16be]
    },
    mpg: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg1video, VC.mpeg2video],
        audioCodecs: [AC.mp2, AC.libmp3lame, AC.ac3, AC.dca, AC.pcm_dvd, AC.pcm_s16be]
    },
    m4v: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.libaomAv1, VC.libsvtav1, VC.mpeg4, VC.mpeg2video, VC.mjpeg],
        audioCodecs: [AC.aac, AC.ac3, AC.dca, AC.alac, AC.libmp3lame]
    },
    ts: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.libaomAv1, VC.librav1e, VC.av1Nvenc, VC.mpeg2video, VC.mpeg1video],
        audioCodecs: [AC.aac, AC.ac3, AC.eac3, AC.dca, AC.truehd, AC.mp2, AC.libmp3lame]
    },
    m2ts: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.mpeg2video, VC.mpeg1video],
        audioCodecs: [AC.aac, AC.ac3, AC.eac3, AC.dca, AC.truehd, AC.mp2]
    },
    vob: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg2video, VC.mpeg1video],
        audioCodecs: [AC.ac3, AC.dca, AC.mp2, AC.pcm_dvd]
    },
    '3gp': {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.mpeg4, VC.h263p],
        audioCodecs: [AC.aac, AC.libmp3lame, AC.libopencore_amrnb, AC.libvo_amrwbenc]
    },
    qt: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.libx265, VC.prores, VC.dnxhd, VC.mjpeg, VC.dvvideo, VC.qtrle, VC.cinepak],
        audioCodecs: [AC.aac, AC.alac, AC.libmp3lame, AC.pcm_s16le, AC.pcm_s24be]
    },
    ogv: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libtheora, VC.libvpx, VC.libvpxVp9],
        audioCodecs: [AC.libvorbis, AC.libopus, AC.flac]
    },
    f4v: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.mpeg4],
        audioCodecs: [AC.aac, AC.libmp3lame]
    },
    asf: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.wmv1, VC.wmv2, VC.mpeg4],
        audioCodecs: [AC.wmav2, AC.wmav1, AC.libmp3lame, AC.aac, AC.gsm_ms]
    },
    divx: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.mpeg4, VC.libxvid, VC.mpeg2video],
        audioCodecs: [AC.libmp3lame, AC.aac, AC.ac3, AC.pcm_s16le]
    },
    mxf: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.mpeg4, VC.mpeg2video, VC.dnxhd, VC.dvvideo, VC.mjpeg],
        audioCodecs: [AC.pcm_s16le, AC.pcm_s24le, AC.pcm_s32le, AC.aac, AC.ac3, AC.eac3]
    },
    swf: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.flv1],
        audioCodecs: [AC.libmp3lame, AC.nellymoser, AC.adpcm_swf]
    },
    rm: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.rv10, VC.rv20],
        audioCodecs: [AC.real_144, AC.ac3, AC.libmp3lame]
    },
    rmvb: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.rv10, VC.rv20],
        audioCodecs: [AC.real_144, AC.ac3, AC.libmp3lame]
    },
    '3g2': {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.mpeg4, VC.h263p],
        audioCodecs: [AC.aac, AC.libmp3lame, AC.libopencore_amrnb, AC.libvo_amrwbenc]
    },
    ogx: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libtheora, VC.libvpx, VC.libvpxVp9],
        audioCodecs: [AC.libvorbis, AC.libopus, AC.flac, AC.libspeex]
    },
    m2p: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg2video, VC.mpeg1video],
        audioCodecs: [AC.ac3, AC.mp2, AC.dca, AC.pcm_dvd]
    },
    dat: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg1video],
        audioCodecs: [AC.mp2]
    },
    mts: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.libx264, VC.h264Nvenc, VC.h264Amf, VC.h264Qsv, VC.libx265, VC.hevcNvenc, VC.hevcAmf, VC.hevcQsv, VC.mpeg2video],
        audioCodecs: [AC.aac, AC.ac3, AC.eac3, AC.dca, AC.truehd, AC.mp2]
    },
    amv: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.amvVideo],
        audioCodecs: [AC.adpcm_ima_amv]
    },
    dv: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.dvvideo],
        audioCodecs: [AC.pcm_s16le, AC.pcm_s16be]
    },
    gxf: {
        group: 'video', tool: 'ffmpeg',
        outputs: [...outVideoFormats, ...outAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: [VC.mpeg2video, VC.dvvideo, VC.mjpeg, VC.dnxhd],
        audioCodecs: [AC.pcm_s16le, AC.pcm_s24le, AC.ac3]
    },

    // ====== Image Formats ======
    jpeg: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    jpg: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    png: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    gif: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['combine_inputs', 'loop', 'delay', 'dispose', 'coalesce', ...generalImageWidgets] },
    webp: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['combine_inputs', 'loop', 'delay', 'dispose', 'coalesce', ...generalImageWidgets] },
    bmp: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    dib: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    tiff: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['combine_inputs', ...generalImageWidgets] },
    pnm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    ppm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    pgm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    pbm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    xpm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    xbm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    heic: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    heif: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    avif: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    jxl: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    jp2: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    j2k: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    jxr: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    wdp: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    ico: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['ico_sizes', ...generalImageWidgets] },
    cur: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['ico_sizes', ...generalImageWidgets] },
    psd: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    exr: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    hdr: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    qoi: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    xcf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    ai: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    eps: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    pdf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['combine_inputs', 'page', ...generalImageWidgets] },
    ps: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: ['combine_inputs', 'page', ...generalImageWidgets] },
    pcx: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    tga: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    dds: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    dcx: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    thm: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    raw: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    cr2: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    crw: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    nef: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    dng: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    arw: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    raf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    rw2: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    orf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    pef: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    x3f: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    srw: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    iiq: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    '3fr': { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    mef: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    mrw: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    mos: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    kdc: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    dcr: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    erf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    sr2: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    srf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    mdc: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    svg: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets },
    emf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets }, // input only
    wmf: { group: 'image', tool: 'magick', outputs: outImageFormats, widgets: generalImageWidgets } // input only
};

// ===========================================================================
// Prepend copy-codec to every format's codec list.
// ===========================================================================
Object.keys(formats).forEach(ext => {
    const format = formats[ext];

    if (format.videoCodecs) {
        format.videoCodecs = [{ label: 'advanced.copy_codec', value: 'copy', widgets: [] }, ...format.videoCodecs];
    }
    if (format.audioCodecs) {
        format.audioCodecs = [{ label: 'advanced.copy_codec', value: 'copy', widgets: [] }, ...format.audioCodecs];
    }
    if (format.codecs) {
        format.codecs = [{ label: 'advanced.copy_codec', value: 'copy', widgets: [] }, ...format.codecs];
    }
});

// ===========================================================================
// HELPER FUNCTIONS
// ===========================================================================

export function getTaggedFormatExts(tag) {
    return Object.entries(formats)
        .filter(([, format]) => format.tags?.includes(tag))
        .map(([ext]) => ext);
}

export function getInputWidgetExtMapForTag(tag) {
    const widgetExts = {};

    Object.entries(formats).forEach(([ext, format]) => {
        if (!format.tags?.includes(tag)) return;

        (format.widgets_input || []).forEach(widgetKey => {
            if (!widgetExts[widgetKey]) {
                widgetExts[widgetKey] = [];
            }
            widgetExts[widgetKey].push(ext);
        });
    });

    return widgetExts;
}

const extToGroup = Object.entries(formats).reduce((acc, [ext, data]) => {
    acc[ext] = data.group;
    return acc;
}, {});

function getExtension(filePath) {
    const idx = filePath.lastIndexOf('.');
    if (idx === -1 || idx === filePath.length - 1) return '';
    return filePath.slice(idx + 1).toLowerCase();
}

function intersect(arrays) {
    if (!arrays.length) return [];
    return arrays.reduce((acc, arr) => acc.filter(x => arr.includes(x)));
}

function getMajorFileType(exts) {
    const counts = {};
    exts.forEach(ext => {
        const grp = extToGroup[ext];
        if (grp) counts[grp] = (counts[grp] || 0) + 1;
    });
    return Object.entries(counts).reduce((best, [grp, cnt]) => (cnt > best[1] ? [grp, cnt] : best), [null, 0])[0];
}

// Returns output formats grouped by type. Only formats supported by ALL selected files are included, preserving out*Formats insertion order.
function getOutputFormats(filePaths) {
    if (!filePaths.length) return {};
    const exts = filePaths.map(getExtension).filter(ext => formats[ext]);
    if (!exts.length) return {};

    const possibleOutputsPerFile = exts.map(ext => formats[ext].outputs);
    const commonOutputExts = intersect(possibleOutputsPerFile);

    const grouped = {};
    for (const ext of commonOutputExts) {
        const group = formats[ext]?.group || 'other';
        if (!grouped[group]) {
            grouped[group] = [];
        }
        grouped[group].push(ext);
    }

    return grouped;
}

export function buildGroupedArgs(advancedOptionValues) {
    const groupedArgs = {};
    for (const widgetKey in advancedOptionValues) {
        const value = advancedOptionValues[widgetKey];
        const definition = widgetDefinitions[widgetKey];
        if (!definition) continue;
        if (definition.meta) continue;

        if (definition.type === 'group') {
            if (definition.arg && value) {
                const selected = definition.widgets.filter(sw => value[sw.arg]).map(sw => sw.arg);
                if (selected.length > 0) {
                    if (!groupedArgs[definition.arg]) groupedArgs[definition.arg] = [];
                    groupedArgs[definition.arg].push((definition.prefix || '') + selected.join(definition.separator || ','));
                }
            } else if (!definition.arg && value) {
                definition.widgets.forEach(sw => {
                    const subVal = value[sw.arg];
                    const swInclude = sw.type === 'checkbox-novalue' ? subVal === true
                        : sw.type === 'checkbox' ? (subVal === true || subVal === false)
                            : subVal !== undefined && subVal !== '' && subVal !== null;
                    if (swInclude) {
                        if (!groupedArgs[sw.arg]) groupedArgs[sw.arg] = [];
                        const pushVal = sw.type === 'checkbox-novalue' ? ''
                            : sw.type === 'checkbox' ? (subVal === true ? '1' : '0')
                                : subVal;
                        groupedArgs[sw.arg].push(pushVal);
                    }
                });
            }
            continue;
        }

        const shouldInclude = definition.type === 'checkbox-novalue' ? value === true
            : definition.type === 'checkbox' ? (value === true || value === false)
                : value !== '' && value !== null && value !== undefined;

        if (shouldInclude) {
            const arg = definition.arg;
            if (!groupedArgs[arg]) groupedArgs[arg] = [];
            let finalValue;
            if (definition.type === 'checkbox-novalue') {
                finalValue = '';
            } else if (definition.type === 'checkbox') {
                finalValue = value === true ? '1' : '0';
            } else {
                finalValue = value;
                if (definition.prefix) finalValue = `${definition.prefix}${finalValue}`;
                if (definition.suffix) finalValue = `${finalValue}${definition.suffix}`;
            }
            groupedArgs[arg].push(finalValue);
        }
    }
    return groupedArgs;
}

export function truncateMiddle(str, maxLen = 40) {
    if (str.length <= maxLen) return str;
    const keep = Math.floor((maxLen - 1) / 2);
    return str.slice(0, keep) + '…' + str.slice(str.length - keep);
}

export function processFiles(newlySelectedPaths, currentFilePaths, currentFileType) {
    const result = {
        newFileType: currentFileType,
        outputFormats: {},
        uniques: [],
        duplicates: [],
        unsupported: [],
        nonMajorType: [],
    };

    const candidates = [];
    for (const path of newlySelectedPaths) {
        if (currentFilePaths.includes(path)) {
            result.duplicates.push(path);
            continue;
        }
        const ext = getExtension(path);
        if (!ext || !formats[ext]) {
            result.unsupported.push(path);
            continue;
        }
        candidates.push({ path, ext });
    }

    if (candidates.length === 0) {
        result.outputFormats = getOutputFormats(currentFilePaths);
        return result;
    }

    const effectiveFileType = currentFileType || getMajorFileType(candidates.map(c => c.ext));

    if (effectiveFileType) {
        result.newFileType = effectiveFileType;
        candidates.forEach(candidate => {
            if (extToGroup[candidate.ext] === effectiveFileType) {
                result.uniques.push(candidate.path);
            } else {
                result.nonMajorType.push(candidate.path);
            }
        });
    }

    const finalFilePaths = [...currentFilePaths, ...result.uniques];
    result.outputFormats = getOutputFormats(finalFilePaths);

    return result;
}
