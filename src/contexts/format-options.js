// ===========================================================================
// 1. WIDGET OPTIONS
// Centralized, reusable option sets for UI widgets like dropdowns.
// ===========================================================================
export const widgetOptions = {
    // ====== video.general ======
    aspect_ratio: { "3:2": "3:2", "4:3": "4:3", "5:4": "5:4", "16:10": "16:10", "16:9": "16:9", "37:20 (1.85:1)": "37:20", "21:9 (2.35:1)": "21:9", "69:25 (2.76:1)": "69:25", "9:16": "9:16" },
    video_rotate: { "90° Clockwise": "transpose=1", "90° Counterclockwise": "transpose=2", "180°": "transpose=1,transpose=1" },
    video_flip: { "Horizontal Flip": "hflip", "Vertical Flip": "vflip" },

    // dnxhd
    profile_dnxhd: { "DNxHD": "0", "DNxHR LB": "1", "DNxHR SQ": "2", "DNxHR HQ": "3", "DNxHR HQX": "4", "DNxHR 444": "5" },

    // ffv1
    coder_ffv1: { "Golomb Rice": "0", "Range Coder (Default Table)": "-2", "Range Coder (Custom Table)": "2", "Range Coder (AC)": "1" },

    // huffyuv
    pred_huffyuv: { "Left": "0", "Plane": "1", "Median": "2" },

    // dvvideo
    framerate_dvvideo: { "30000/1001": "30000/1001", "25/1": "25/1", "60000/1001": "60000/1001", "50/1": "50/1" },

    // libx264, libx265
    preset: { "Ultrafast": "ultrafast", "Superfast": "superfast", "Veryfast": "veryfast", "Faster": "faster", "Fast": "fast", "Medium": "medium", "Slow": "slow", "Slower": "slower", "Veryslow": "veryslow", "Placebo": "placebo" },
    tune_h264: { "Film": "film", "Animation": "animation", "Grain": "grain", "Still Image": "stillimage", "Fast Decode": "fastdecode", "Zero Latency": "zerolatency" },
    tune_h265: { "Animation": "animation", "Grain": "grain", "Fast Decode": "fastdecode", "Zero Latency": "zerolatency" },
    profile_h264: { "Baseline": "baseline", "Main": "main", "High": "high", "High10": "high10", "High422": "high422", "High444": "high444" },
    profile_h265: { "Main": "main", "Main Intra": "main-intra", "Main Still Picture": "mainstillpicture", "Main 10": "main10", "Main 10 Intra": "main10-intra", "Main 12": "main12", "Main 12 Intra": "main12-intra", "Main 4:2:2 10": "main422-10", "Main 4:2:2 10 Intra": "main422-10-intra", "Main 4:2:2 12": "main422-12", "Main 4:2:2 12 Intra": "main422-12-intra", "Main 4:4:4 8-bit": "main444-8", "Main 4:4:4 Intra": "main444-intra", "Main 4:4:4 Still Picture": "main444-stillpicture", "Main 4:4:4 10": "main444-10", "Main 4:4:4 10 Intra": "main444-10-intra", "Main 4:4:4 12": "main444-12", "Main 4:4:4 12 Intra": "main444-12-intra", "Main 4:4:4 16 Intra": "main444-16-intra", "Main 4:4:4 16 Still Picture": "main444-16-stillpicture" },
    level: { "1.0": "1.0", "1.1": "1.1", "1.2": "1.2", "1.3": "1.3", "2.0": "2.0", "2.1": "2.1", "2.2": "2.2", "3.0": "3.0", "3.1": "3.1", "3.2": "3.2", "4.0": "4.0", "4.1": "4.1", "4.2": "4.2", "5.0": "5.0", "5.1": "5.1", "5.2": "5.2" },
    aq_mode_h264: { "None": "0", "Variance": "1", "Auto-variance": "2", "Auto-variance Biased": "3" },
    weightp: { "None": "0", "Simple": "1", "Smart": "2" },
    b_pyramid: { "None": "0", "Strict": "1", "Normal": "2" },
    partitions: { "p8x8": "p8x8", "p4x4": "p4x4", "b8x8": "b8x8", "i8x8": "i8x8", "i4x4": "i4x4", "None": "none", "All": "all" },
    direct_pred: { "None": "0", "Spatial": "1", "Temporal": "2", "Auto": "3" },
    nal_hrd: { "None": "0", "VBR": "1", "CBR": "2" },
    nal_hrd_mp4: { "None": "0", "VBR": "1" },
    avcintra_class: { "50": "50", "100": "100", "200": "200", "300": "300", "480": "480" },
    motion_est_h264: { "Diamond": "dia", "Hexagon": "hex", "Uneven Multi-hexagon": "umh", "Exhaustive": "esa", "Transformed Exhaustive": "tesa" },
    coder: { "Default": "-1", "CAVLC / VLC": "0", "CABAC / AC": "1" },

    // mpeg1, mpeg2
    b_strategy: { "I-frames": "0", "P-frames": "1", "B-frames": "2" },
    motion_est_mpeg: { "Zero": "0", "EPZS": "1", "Xone": "2" },
    mpv_flags: { "Skip RD": "skip_rd", "Strict GOP": "strict_gop", "QP RD": "qp_rd", "CBP RD": "cbp_rd", "Normalize AQ": "naq", "MV Zero": "mv0" },
    skip_cmp: { "SAD": "0", "SSE": "1", "SATD": "2", "DCT": "3", "PSNR": "4", "Bit": "5", "RD": "6", "Zero": "7", "VSAD": "8", "VSSE": "9", "NSSE": "10", "DCT264": "14", "DCTMAX": "13", "Chroma": "256", "MSAD": "15" },
    seq_disp_ext: { "Auto": "-1", "Never": "0", "Always": "1" },
    video_format: { "Component": "0", "PAL": "1", "NTSC": "2", "SECAM": "3", "MAC": "4", "Unspecified": "5" },

    // mjpeg
    huffman: { "Default": "0", "Optimal": "1" },

    // av1
    aq_mode_av1: { "None": "0", "Variance": "1", "Complexity": "2", "Cyclic Refresh": "3" },
    usage: { "Good Quality": "0", "Realtime": "1", "All Intra": "2" },
    tune: { "PSNR": "0", "SSIM": "1" },

    // vp8, vp9
    arnr_type: { "Backward": "1", "Forward": "2", "Centered": "3" },
    deadline: { "Best": "0", "Good": "1000000", "Realtime": "1" },
    error_resilient: { "Default": "default", "Partitions": "partitions" },
    vp8flags: { "Error Resilient": "error_resilient", "Alternate Reference": "altref" },
    aq_mode_vp9: { "None": "0", "Variance": "1", "Complexity": "2", "Cyclic Refresh": "3", "Equator 360": "4" },
    tune_content: { "Default": "0", "Screen": "1", "Film": "2" },

    // ====== audio.general ======
    audio_bitrate: { "8 kbps": "8k", "16 kbps": "16k", "24 kbps": "24k", "32 kbps": "32k", "40 kbps": "40k", "48 kbps": "48k", "64 kbps": "64k", "80 kbps": "80k", "96 kbps": "96k", "112 kbps": "112k", "128 kbps": "128k", "160 kbps": "160k", "192 kbps": "192k", "224 kbps": "224k", "256 kbps": "256k", "320 kbps": "320k" },

    // nellymoser
    sample_rate_nellymoser: { "8000": "8000", "16000": "16000", "11025": "11025", "22050": "22050", "44100": "44100" },

    // adpcm_swf
    sample_rate_adpcm_swf: { "11025": "11025", "22050": "22050", "44100": "44100" },

    // gsm, adpcm_g726
    sample_rate_8000: { "8000": "8000" },
    channel_layout_mono: { "mono": "mono" },

    // aac
    aac_coder: { "ANMR": "0", "Two Loop": "1", "Fast": "2" },

    // flac
    lpc_type: { "None": "0", "Fixed": "1", "Levinson": "2", "Cholesky": "3" },
    prediction_order_method: { "Estimation": "0", "2-Level": "1", "4-Level": "2", "8-Level": "3", "Search": "4", "Log": "5" },
    ch_mode: { "Auto": "-1", "Independent": "0", "Left Side": "1", "Right Side": "2", "Mid Side": "3" },

    // opus
    application: { "VoIP": "2048", "Audio": "2049", "Low Delay": "2051" },
    vbr: { "Constant Bitrate (CBR)": "0", "Variable Bitrate (VBR)": "1", "Constrained VBR": "2" },

    // ac3
    room_type: { "Not Indicated": "0", "Large Room": "1", "Small Room": "2" },
    dsur_mode: { "Not Indicated": "0", "Not Dolby Surround": "1", "Dolby Surround": "2" },
    dmix_mode: { "Not Indicated": "0", "Lt/Rt Downmix": "1", "Lo/Ro Downmix": "2", "Dolby Pro Logic II": "3" },
    dsurex_mode: { "Not Indicated": "0", "Not Dolby Surround EX": "1", "Dolby Surround EX": "2", "Dolby Pro Logic IIz": "3" },
    dheadphone_mode: { "Not Indicated": "0", "Not Dolby Headphone": "1", "Dolby Headphone": "2" },
    ad_conv_type: { "Standard": "0", "HDCD": "1" },

    // truehd
    lpc_type_truehd: { "Levinson": "2", "Cholesky": "3" },
    prediction_order_truehd: { "Estimation": "0", "Search": "4" },
};

// ===========================================================================
// 2. WIDGET DEFINITIONS
// Blueprints for each UI widget, defining its type, label, and options.
// ===========================================================================
export const widgetDefinitions = {
    // ====== video.general ======
    disable_video: { arg: "-vn", labelKey: "advanced.video.disable_video", type: "checkbox" },
    disable_subtitle: { arg: "-sn", labelKey: "advanced.video.disable_subtitle", type: "checkbox" },
    pass: { arg: "-pass", labelKey: "advanced.video.pass", type: "input-int", options: [1, 3] },
    frame_size: { arg: "-vf", labelKey: "advanced.video.frame_size", type: "input-txt", prefix: 'scale=' },
    video_rotate: { arg: "-vf", labelKey: "advanced.video.video_rotate", type: "select", options: widgetOptions.video_rotate },
    video_flip: { arg: "-vf", labelKey: "advanced.video.video_flip", type: "select", options: widgetOptions.video_flip },
    video_bitrate: { arg: "-b:v", labelKey: "advanced.video.video_bitrate", type: "input-int", options: [0, 9.22337e+18] },
    vframes: { arg: "-vframes", labelKey: "advanced.video.vframes", type: "input-int", options: [-9223372036854775808, 9223372036854775808] },
    aspect_ratio: { arg: "-aspect", labelKey: "advanced.video.aspect_ratio", type: "select", options: widgetOptions.aspect_ratio },

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
    context: { arg: "-context", labelKey: "advanced.video.context", type: "input-int", options: [0, 1] },

    // huffyuv
    non_deterministic: { arg: "-non_deterministic", labelKey: "advanced.video.non_deterministic", type: "checkbox" },
    pred_huffyuv: { arg: "-pred", labelKey: "advanced.video.pred", type: "select", options: widgetOptions.pred_huffyuv },

    // dvvideo  // TODO: add supported profiles list
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
    level: { arg: "-level", labelKey: "advanced.video.level", type: "select", options: widgetOptions.level },
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
    partitions: { arg: "-partitions", labelKey: "advanced.video.partitions", type: "select", options: widgetOptions.partitions },   // TODO: add available list and change to input
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
    preset: { arg: "-preset", labelKey: "advanced.video.preset", type: "select", options: widgetOptions.preset },
    tune_h265: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_h265 },
    profile_h265: { arg: "-profile:v", labelKey: "advanced.video.profile", type: "select", options: widgetOptions.profile_h265 },
    x265_params: { arg: "-x265-params", labelKey: "advanced.video.x265_params", type: "input-txt" },
    dolbyvision: { arg: "-dolbyvision", labelKey: "advanced.video.dolbyvision", type: "checkbox" },

    // mpeg1, mpeg2
    gop_timecode: { arg: "-gop_timecode", labelKey: "advanced.video.gop_timecode", type: "input-txt" },
    drop_frame_timecode: { arg: "-drop_frame_timecode", labelKey: "advanced.video.drop_frame_timecode", type: "checkbox" },
    scan_offset: { arg: "-scan_offset", labelKey: "advanced.video.scan_offset", type: "checkbox" },
    timecode_frame_start: { arg: "-timecode_frame_start", labelKey: "advanced.video.timecode_frame_start", type: "input-int", options: [-1, 9223372036854775807] },
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
    rc_eq: { arg: "-rc_eq", labelKey: "advanced.video.rc_eq", type: "input-txt" },  // TODO: add list of available options
    border_mask: { arg: "-border_mask", labelKey: "advanced.video.border_mask", type: "input-flt", options: [-3.4e+38, 3.4e+38] },
    lmin: { arg: "-lmin", labelKey: "advanced.video.lmin", type: "input-int", options: [0, 2147483647] },
    lmax: { arg: "-lmax", labelKey: "advanced.video.lmax", type: "input-int", options: [0, 2147483647] },
    skip_threshold: { arg: "-skip_threshold", labelKey: "advanced.video.skip_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    skip_factor: { arg: "-skip_factor", labelKey: "advanced.video.skip_factor", type: "input-int", options: [-2147483648, 2147483647] },
    skip_exp: { arg: "-skip_exp", labelKey: "advanced.video.skip_exp", type: "input-int", options: [-2147483648, 2147483647] },
    skip_cmp: { arg: "-skip_cmp", labelKey: "advanced.video.skip_cmp", type: "select", options: widgetOptions.skip_cmp },
    sc_threshold: { arg: "-sc_threshold", labelKey: "advanced.video.sc_threshold", type: "input-int", options: [-2147483648, 2147483647] },
    ps: { arg: "-ps", labelKey: "advanced.video.ps", type: "input-int", options: [-2147483648, 2147483647] },
    motion_est_mpeg: { arg: "-motion_est", labelKey: "advanced.video.motion_est", type: "select", options: widgetOptions.motion_est_mpeg },
    mepc: { arg: "-mepc", labelKey: "advanced.video.mepc", type: "input-int", options: [-2147483648, 2147483647] },
    mepre: { arg: "-mepre", labelKey: "advanced.video.mepre", type: "input-int", options: [-2147483648, 2147483647] },
    intra_penalty: { arg: "-intra_penalty", labelKey: "advanced.video.intra_penalty", type: "input-int", options: [0, 1.07374e+9] },
    // mpeg2 only
    intra_vlc: { arg: "-intra_vlc", labelKey: "advanced.video.intra_vlc", type: "checkbox" },
    non_linear_quant: { arg: "-non_linear_quant", labelKey: "advanced.video.non_linear_quant", type: "checkbox" },
    alternate_scan: { arg: "-alternate_scan", labelKey: "advanced.video.alternate_scan", type: "checkbox" },
    a53cc: { arg: "-a53cc", labelKey: "advanced.video.a53cc", type: "checkbox" },
    seq_disp_ext: { arg: "-seq_disp_ext", labelKey: "advanced.video.seq_disp_ext", type: "select", options: widgetOptions.seq_disp_ext },
    video_format: { arg: "-video_format", labelKey: "advanced.video.video_format", type: "select", options: widgetOptions.video_format },
    // mpeg4 only
    data_partitioning: { arg: "-data_partitioning", labelKey: "advanced.video.data_partitioning", type: "checkbox" },
    mpeg_quant: { arg: "-mpeg_quant", labelKey: "advanced.video.mpeg_quant", type: "input-int", options: [0, 1] },

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
    dolbyvision: { arg: "-dolbyvision", labelKey: "advanced.video.dolbyvision", type: "checkbox" },
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

    // vp8, vp9
    arnr_type: { arg: "-arnr-type", labelKey: "advanced.video.arnr_type", type: "select", options: widgetOptions.arnr_type },
    tune: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune },
    deadline: { arg: "-deadline", labelKey: "advanced.video.deadline", type: "select", options: widgetOptions.deadline },
    error_resilient: { arg: "-error-resilient", labelKey: "advanced.video.error_resilient", type: "select", options: widgetOptions.error_resilient },
    max_intra_rate: { arg: "-max-intra-rate", labelKey: "advanced.video.max_intra_rate", type: "input-int", options: [0, 2147483647] },
    noise_sensitivity: { arg: "-noise-sensitivity", labelKey: "advanced.video.noise_sensitivity", type: "input-int", options: [0, 4] },
    ts_parameters: { arg: "-ts-parameters", labelKey: "advanced.video.ts_parameters", type: "input-txt" },
    cpu_used_vpx: { arg: "-cpu-used", labelKey: "advanced.video.cpu_used", type: "input-int", options: [-16, 16] },
    screen_content_mode: { arg: "-screen-content-mode", labelKey: "advanced.video.screen_content_mode", type: "input-int", options: [0, 2] },
    speed: { arg: "-speed", labelKey: "advanced.video.speed", type: "input-int", options: [-16, 16] },
    quality: { arg: "-quality", labelKey: "advanced.video.quality", type: "select", options: widgetOptions.deadline },
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

    // ====== audio.general ======
    disable_audio: { arg: "-an", labelKey: "advanced.audio.disable_audio", type: "checkbox" },
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

    // gsm, adpcm_g726
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
    copyright_bit: { arg: "-copyright", labelKey: "advanced.audio.copyright_bit", type: "input-int", options: [0, 1] },
    dialnorm: { arg: "-dialnorm", labelKey: "advanced.audio.dialnorm", type: "input-int", options: [-31, -1] },
    dsur_mode: { arg: "-dsur_mode", labelKey: "advanced.audio.dsur_mode", type: "select", options: widgetOptions.dsur_mode },
    original_bit: { arg: "-original", labelKey: "advanced.audio.original_bit", type: "input-int", options: [0, 1] },
    dmix_mode: { arg: "-dmix_mode", labelKey: "advanced.audio.dmix_mode", type: "select", options: widgetOptions.dmix_mode },
    ltrt_cmixlev: { arg: "-ltrt_cmixlev", labelKey: "advanced.audio.ltrt_cmixlev", type: "input-flt", options: [0, 2] },
    ltrt_surmixlev: { arg: "-ltrt_surmixlev", labelKey: "advanced.audio.ltrt_surmixlev", type: "input-flt", options: [0, 2] },
    loro_cmixlev: { arg: "-loro_cmixlev", labelKey: "advanced.audio.loro_cmixlev", type: "input-flt", options: [0, 2] },
    loro_surmixlev: { arg: "-loro_surmixlev", labelKey: "advanced.audio.loro_surmixlev", type: "input-flt", options: [0, 2] },
    dsurex_mode: { arg: "-dsurex_mode", labelKey: "advanced.audio.dsurex_mode", type: "select", options: widgetOptions.dsurex_mode },
    dheadphone_mode: { arg: "-dheadphone_mode", labelKey: "advanced.audio.dheadphone_mode", type: "select", options: widgetOptions.dheadphone_mode },
    ad_conv_type: { arg: "-ad_conv_type", labelKey: "advanced.audio.ad_conv_type", type: "select", options: widgetOptions.ad_conv_type },
    stereo_rematrixing: { arg: "-stereo_rematrixing", labelKey: "advanced.audio.stereo_rematrixing", type: "checkbox" },

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

    // encrypted
    qmc_mmkv: { arg: "--qmc-mmkv", labelKey: "advanced.audio.qmc_mmkv", type: "input-txt" },
    qmc_mmkv_key: { arg: "--qmc-mmkv-key", labelKey: "advanced.audio.qmc_mmkv_key", type: "input-txt" },
    kgg_db: { arg: "--kgg-db", labelKey: "advanced.audio.kgg_db", type: "input-txt" },
    update_metadata: { arg: "--update-metadata", labelKey: "advanced.audio.update_metadata", type: "checkbox" },

    // ====== image ======
    img_quality: { arg: "-quality", labelKey: "advanced.image.quality", type: "input-int", options: [0, 100] },
    img_resize: { arg: "-resize", valueTemplate: "{arg0}x{arg1}", labelKey: "advanced.image.resize", type: "textinput", options: ["advanced.image.width", "advanced.image.height"] },
    img_rotate: { arg: "-rotate", labelKey: "advanced.image.rotate", type: "textinput", options: ["advanced.image.angle"] },
    img_sharpen: { arg: "-sharpen", valueTemplate: "0x{arg0}", labelKey: "advanced.image.sharpen", type: "input-int", options: [0, 100] },
    img_blur: { arg: "-blur", valueTemplate: "0x{arg0}", labelKey: "advanced.image.blur", type: "input-int", options: [0, 100] },
    img_brightness: { arg: "-modulate", labelKey: "advanced.image.brightness", type: "textinput", options: ["advanced.image.brightness_percent"] },
    alpha_fill: { arg: "-background", labelKey: "advanced.image.alpha_fill", type: "textinput", options: ["advanced.image.color_hex"] },
    gif_delay: { arg: "-delay", labelKey: "advanced.image.gif_delay", type: "textinput", options: ["advanced.image.frame_delay"] },
    gif_loop: { arg: "-loop", labelKey: "advanced.image.gif_loop", type: "textinput", options: ["advanced.image.loop_count"] },
};

// ===========================================================================
// 3. FORMATS
// The main format-centric configuration.
// ===========================================================================
const allVideoFormats = [
    // Modern & Common General-Purpose Containers
    'mp4', 'mkv', 'webm', 'mov', 'qt', 'm4v',
    // Legacy & Specialized Web Containers
    'avi', 'flv', 'f4v', 'swf', 'wmv', 'asf', 'rm', 'rmvb',
    // Open-Source Containers
    'ogv', 'ogx',
    // MPEG Program Stream Family (DVD, VCD, etc.)
    'mpeg', 'ps', 'm2p', 'dat', 'vob', 'evo',
    // MPEG Transport Stream Family (Broadcast, Blu-ray, Camcorders)
    'ts', 'm2ts', 'mts',
    // Professional, Prosumer & Camera Raw Formats
    'mxf', 'divx', 'r3d', 'braw', 'ari',
    // Niche & Gaming Formats
    'bik', 'smk', 'amv',
    // Mobile Containers (Legacy)
    '3gp', '3g2'
];
const allAudioFormats = ['mp3', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'];
const generalVideoWidgets = ['disable_video', 'disable_subtitle', 'pass', 'frame_size', 'video_rotate', 'video_flip', 'video_bitrate', 'vframes', 'aspect_ratio'];
const generalAudioWidgets = ['audio_volume', 'audio_speed', 'audio_quality', 'audio_bitrate', 'audio_channels', 'aframes'];
export const formats = {
    // ====== Audio Formats ======
    mp3: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'MP3 (MPEG audio layer 3)': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
        }
    },
    flac: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'FLAC (Free Lossless Audio Codec)': { value: 'flac', widgets: ['sample_format', 'lpc_coeff_precision', 'lpc_type', 'lpc_passes', 'min_partition_order', 'max_partition_order', 'prediction_order_method', 'ch_mode', 'exact_rice_parameters', 'multi_dim_quant', 'min_prediction_order_flac', 'max_prediction_order_flac'] },
        }
    },
    wav: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'PCM signed 16-bit little-endian': { value: 'pcm_s16le', widgets: ['sample_format'] },
            'PCM signed 24-bit little-endian': { value: 'pcm_s24le', widgets: ['sample_format'] },
            'PCM signed 32-bit little-endian': { value: 'pcm_s32le', widgets: ['sample_format'] },
            'PCM 32-bit floating point little-endian': { value: 'pcm_f32le', widgets: ['sample_format'] },
            'PCM A-law / G.711 A-law': { value: 'pcm_alaw', widgets: ['sample_format'] },
            'PCM mu-law / G.711 mu-law': { value: 'pcm_mulaw', widgets: ['sample_format'] },
            'G.722 ADPCM': { value: 'g722', widgets: ['sample_format', 'channel_layout'] },
            'G.726 ADPCM': { value: 'g726', widgets: ['sample_rate_8000', 'sample_format', 'channel_layout_mono', 'code_size'] },
            'ADPCM IMA WAV': { value: 'adpcm_ima_wav', widgets: ['sample_format', 'channel_layout', 'block_size'] },
            'ADPCM Microsoft': { value: 'adpcm_ms', widgets: ['sample_format', 'channel_layout', 'block_size'] },
        }
    },
    aac: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'AAC (Advanced Audio Coding)': { value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
        }
    },
    ogg: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'Vorbis': { value: 'libvorbis', widgets: ['sample_format', 'iblock'] },
            'Opus (Opus Interactive Audio Codec)': { value: 'libopus', widgets: ['sample_rate', 'sample_format', 'application', 'frame_duration', 'packet_loss', 'fec', 'vbr', 'mapping_family', 'apply_phase_inv'] },
            'FLAC (Free Lossless Audio Codec)': { value: 'flac', widgets: ['sample_format', 'lpc_coeff_precision', 'lpc_type', 'lpc_passes', 'min_partition_order', 'max_partition_order', 'prediction_order_method', 'ch_mode', 'exact_rice_parameters', 'multi_dim_quant', 'min_prediction_order_flac', 'max_prediction_order_flac'] },
            'libspeex Speex': { value: 'libspeex', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'abr', 'cbr_quality', 'frames_per_packet', 'vad', 'dtx'] },
        }
    },
    m4a: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'AAC (Advanced Audio Coding)': { value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
            'ALAC (Apple Lossless Audio Codec)': { value: 'alac', widgets: ['sample_format', 'channel_layout', 'min_prediction_order_alac', 'max_prediction_order_alac'] },
        }
    },
    wma: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'Windows Media Audio 2': { value: 'wmav2', widgets: ['sample_format'] },
            'Windows Media Audio 1': { value: 'wmav1', widgets: ['sample_format'] },
        }
    },
    aiff: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'PCM signed 16-bit big-endian': { value: 'pcm_s16be', widgets: ['sample_format'] },
            'PCM signed 24-bit big-endian': { value: 'pcm_s24be', widgets: ['sample_format'] },
            'PCM signed 32-bit big-endian': { value: 'pcm_s32be', widgets: ['sample_format'] },
        }
    },
    opus: {
        group: 'audio',
        tool: 'ffmpeg',
        outputs: allAudioFormats,
        widgets: generalAudioWidgets,
        codecs: {
            'Opus (Opus Interactive Audio Codec)': { value: 'libopus', widgets: ['sample_rate', 'sample_format', 'application', 'frame_duration', 'packet_loss', 'fec', 'vbr', 'mapping_family', 'apply_phase_inv'] },
        }
    },
    // Encrypted file formats  // TODO: add applicable for .ext, .ext... based on selected files
    qmc0: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key']
    },
    qmc2: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key']
    },
    qmc3: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key']
    },
    qmcflac: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key']
    },
    qmcogg: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'qmc_mmkv', 'qmc_mmkv_key']
    },
    tkm: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    bkcmp3: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    bkcflac: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    tm0: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    tm2: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    tm3: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    tm6: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    mflac: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    mgg: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    mflac0: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    mgg1: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    mggl: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    ofl_en: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    ncm: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    xm: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    kwm: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    kgm: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'kgg_db']
    },
    vpr: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata', 'kgg_db']
    },
    x2m: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    x3m: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },
    mg3d: {
        group: 'audio',
        tool: '',
        outputs: allAudioFormats,
        widgets_input: ['update_metadata']
    },

    // ====== Video Formats ======
    mp4: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10': { value: 'libx264', widgets: ['framerate', 'pixel_format', 'preset', 'tune_h264', 'profile_h264', 'fastfirstpass', 'level', 'wpredp', 'a53cc', 'x264opts', 'crf_63', 'crf_max', 'qp', 'aq_mode_h264', 'aq_strength', 'psy', 'psy_rd', 'rc_lookahead_frametype', 'weightb', 'weightp', 'ssim', 'intra_refresh', 'bluray_compat', 'b_bias', 'b_pyramid', 'mixed_refs', '8x8dct', 'fast_pskip', 'aud', 'mbtree', 'deblock', 'cplxblur', 'partitions', 'direct_pred', 'slice_max_size', 'stats', 'nal_hrd_mp4', 'avcintra_class', 'motion_est_h264', 'forced_idr', 'coder', 'b_strategy', 'chromaoffset', 'sc_threshold', 'noise_reduction', 'udu_sei', 'x264_params', 'mb_info'] },
            'H.265 / HEVC': { value: 'libx265', widgets: ['framerate', 'pixel_format', 'crf_51', 'qp', 'forced_idr', 'preset', 'tune_h265', 'profile_h265', 'udu_sei', 'a53cc', 'x265_params', 'dolbyvision'] },
            'Alliance for Open Media AV1': { value: 'libaom-av1', widgets: ['framerate', 'pixel_format', 'cpu_used_av1', 'auto_alt_ref', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'aq_mode_av1', 'error_resilience', 'crf_63', 'static_thresh', 'drop_threshold', 'denoise_noise_level', 'denoise_block_size', 'undershoot_pct', 'overshoot_pct', 'minsection_pct', 'maxsection_pct', 'frame_parallel', 'tiles', 'tile_columns', 'tile_rows', 'row_mt', 'enable_cdef', 'enable_global_motion', 'enable_intrabc', 'enable_restoration', 'usage', 'tune', 'still_picture', 'dolbyvision', 'enable_rect_partitions', 'enable_1to4_partitions', 'enable_ab_partitions', 'enable_angle_delta', 'enable_cfl_intra', 'enable_filter_intra', 'enable_intra_edge_filter', 'enable_smooth_intra', 'enable_paeth_intra', 'enable_palette', 'enable_flip_idtx', 'enable_tx64', 'reduced_tx_type_set', 'use_intra_dct_only', 'use_inter_dct_only', 'use_intra_default_tx_only', 'enable_ref_frame_mvs', 'enable_reduced_reference_set', 'enable_obmc', 'enable_dual_filter', 'enable_diff_wtd_comp', 'enable_dist_wtd_comp', 'enable_onesided_comp', 'enable_interinter_wedge', 'enable_interintra_wedge', 'enable_masked_comp', 'enable_interintra_comp', 'enable_smooth_interintra', 'aom_params'] },
            'MPEG-4 part 2': { value: 'mpeg4', widgets: ['framerate', 'pixel_format', 'data_partitioning', 'alternate_scan', 'mpeg_quant', 'b_strategy', 'b_sensitivity', 'brd_scale', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'MPEG-2 video': { value: 'mpeg2video', widgets: ['framerate_DYN', 'pixel_format', 'gop_timecode', 'drop_frame_timecode', 'scan_offset', 'timecode_frame_start', 'b_strategy', 'b_sensitivity', 'brd_scale', 'intra_vlc', 'non_linear_quant', 'alternate_scan', 'a53cc', 'seq_disp_ext', 'video_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_init_cplx', 'rc_eq', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'Motion JPEG': { value: 'mjpeg', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'huffman', 'force_duplicated_matrix'] },
            'Apple ProRes (iCodec Pro)': { value: 'prores', widgets: ['framerate', 'pixel_format', 'vendor'] },
        },
        audioCodecs: {
            'AAC (Advanced Audio Coding)': { value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
            'MP3 (MPEG audio layer 3)': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
            'ATSC A/52A (AC-3)': { value: 'ac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'center_mixlev', 'surround_mixlev', 'mixing_level', 'room_type', 'per_frame_metadata', 'copyright_bit', 'dialnorm', 'dsur_mode', 'original_bit', 'dmix_mode', 'ltrt_cmixlev', 'ltrt_surmixlev', 'loro_cmixlev', 'loro_surmixlev', 'dsurex_mode', 'dheadphone_mode', 'ad_conv_type', 'stereo_rematrixing'] },
            'Opus (Opus Interactive Audio Codec)': { value: 'libopus', widgets: ['sample_rate', 'sample_format', 'application', 'frame_duration', 'packet_loss', 'fec', 'vbr', 'mapping_family', 'apply_phase_inv'] },
            'DCA (DTS Coherent Acoustics)': { value: 'dca', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'dca_adpcm'] },
            'ALAC (Apple Lossless Audio Codec)': { value: 'alac', widgets: ['sample_format', 'channel_layout', 'min_prediction_order_alac', 'max_prediction_order_alac'] },
            'FLAC (Free Lossless Audio Codec)': { value: 'flac', widgets: ['sample_format', 'lpc_coeff_precision', 'lpc_type', 'lpc_passes', 'min_partition_order', 'max_partition_order', 'prediction_order_method', 'ch_mode', 'exact_rice_parameters', 'multi_dim_quant', 'min_prediction_order_flac', 'max_prediction_order_flac'] },
        }
    },
    mkv: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10': { value: 'libx264', widgets: ['framerate', 'pixel_format', 'preset', 'tune_h264', 'profile_h264', 'fastfirstpass', 'level', 'wpredp', 'a53cc', 'x264opts', 'crf_63', 'crf_max', 'qp', 'aq_mode_h264', 'aq_strength', 'psy', 'psy_rd', 'rc_lookahead_frametype', 'weightb', 'weightp', 'ssim', 'intra_refresh', 'bluray_compat', 'b_bias', 'b_pyramid', 'mixed_refs', '8x8dct', 'fast_pskip', 'aud', 'mbtree', 'deblock', 'cplxblur', 'partitions', 'direct_pred', 'slice_max_size', 'stats', 'nal_hrd_mp4', 'avcintra_class', 'motion_est_h264', 'forced_idr', 'coder', 'b_strategy', 'chromaoffset', 'sc_threshold', 'noise_reduction', 'udu_sei', 'x264_params', 'mb_info'] },
            'H.265 / HEVC': { value: 'libx265', widgets: ['framerate', 'pixel_format', 'crf_51', 'qp', 'forced_idr', 'preset', 'tune_h265', 'profile_h265', 'udu_sei', 'a53cc', 'x265_params', 'dolbyvision'] },
            'On2 VP8': { value: 'libvpx', widgets: ['framerate', 'pixel_format', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'arnr_type', 'tune', 'deadline', 'error_resilient', 'max_intra_rate', 'crf_63', 'static_thresh', 'drop_threshold', 'noise_sensitivity', 'undershoot_pct', 'overshoot_pct', 'ts_parameters', 'auto_alt_ref', 'cpu_used_vpx', 'screen_content_mode', 'speed', 'quality', 'vp8flags', 'rc_lookahead_altref', 'sharpness'] },
            'Google VP9': { value: 'libvpx-vp9', widgets: ['framerate', 'pixel_format', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'arnr_type', 'tune', 'deadline', 'error_resilient', 'max_intra_rate', 'crf_63', 'static_thresh', 'drop_threshold', 'noise_sensitivity', 'undershoot_pct', 'overshoot_pct', 'ts_parameters', 'auto_alt_ref_vp9', 'cpu_used_vp9', 'lossless', 'tile_columns', 'tile_rows_vp9', 'frame_parallel', 'aq_mode_vp9', 'level_vp9', 'row_mt', 'tune_content', 'corpus_complexity', 'enable_tpl', 'min_gf_interval', 'speed', 'quality', 'rc_lookahead_altref', 'sharpness'] },
            'Alliance for Open Media AV1': { value: 'libaom-av1', widgets: ['framerate', 'pixel_format', 'cpu_used_av1', 'auto_alt_ref', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'aq_mode_av1', 'error_resilience', 'crf_63', 'static_thresh', 'drop_threshold', 'denoise_noise_level', 'denoise_block_size', 'undershoot_pct', 'overshoot_pct', 'minsection_pct', 'maxsection_pct', 'frame_parallel', 'tiles', 'tile_columns', 'tile_rows', 'row_mt', 'enable_cdef', 'enable_global_motion', 'enable_intrabc', 'enable_restoration', 'usage', 'tune', 'still_picture', 'dolbyvision', 'enable_rect_partitions', 'enable_1to4_partitions', 'enable_ab_partitions', 'enable_angle_delta', 'enable_cfl_intra', 'enable_filter_intra', 'enable_intra_edge_filter', 'enable_smooth_intra', 'enable_paeth_intra', 'enable_palette', 'enable_flip_idtx', 'enable_tx64', 'reduced_tx_type_set', 'use_intra_dct_only', 'use_inter_dct_only', 'use_intra_default_tx_only', 'enable_ref_frame_mvs', 'enable_reduced_reference_set', 'enable_obmc', 'enable_dual_filter', 'enable_diff_wtd_comp', 'enable_dist_wtd_comp', 'enable_onesided_comp', 'enable_interinter_wedge', 'enable_interintra_wedge', 'enable_masked_comp', 'enable_interintra_comp', 'enable_smooth_interintra', 'aom_params'] },
            'MPEG-2 video': { value: 'mpeg2video', widgets: ['framerate_DYN', 'pixel_format', 'gop_timecode', 'drop_frame_timecode', 'scan_offset', 'timecode_frame_start', 'b_strategy', 'b_sensitivity', 'brd_scale', 'intra_vlc', 'non_linear_quant', 'alternate_scan', 'a53cc', 'seq_disp_ext', 'video_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_init_cplx', 'rc_eq', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'MPEG-4 part 2': { value: 'mpeg4', widgets: ['framerate', 'pixel_format', 'data_partitioning', 'alternate_scan', 'mpeg_quant', 'b_strategy', 'b_sensitivity', 'brd_scale', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'Apple ProRes (iCodec Pro)': { value: 'prores', widgets: ['framerate', 'pixel_format', 'vendor'] },
            'VC3 / DNxHD': { value: 'dnxhd', widgets: ['framerate', 'pixel_format', 'nitris_compat', 'ibias', 'profile_dnxhd'] },
            'FFmpeg video codec #1': { value: 'ffv1', widgets: ['framerate', 'pixel_format', 'slicecrc', 'coder_ffv1', 'context'] },
            'HuffYUV': { value: 'huffyuv', widgets: ['framerate', 'pixel_format', 'non_deterministic', 'pred_huffyuv'] },
        },
        audioCodecs: {
            'AAC (Advanced Audio Coding)': { value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
            'MP3 (MPEG audio layer 3)': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
            'MP2': { value: 'mp2', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
            'ATSC A/52A (AC-3)': { value: 'ac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'center_mixlev', 'surround_mixlev', 'mixing_level', 'room_type', 'per_frame_metadata', 'copyright_bit', 'dialnorm', 'dsur_mode', 'original_bit', 'dmix_mode', 'ltrt_cmixlev', 'ltrt_surmixlev', 'loro_cmixlev', 'loro_surmixlev', 'dsurex_mode', 'dheadphone_mode', 'ad_conv_type', 'stereo_rematrixing'] },
            'Opus (Opus Interactive Audio Codec)': { value: 'libopus', widgets: ['sample_rate', 'sample_format', 'application', 'frame_duration', 'packet_loss', 'fec', 'vbr', 'mapping_family', 'apply_phase_inv'] },
            'Vorbis': { value: 'libvorbis', widgets: ['sample_format', 'iblock'] },
            'DCA (DTS Coherent Acoustics)': { value: 'dca', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'dca_adpcm'] },
            'ALAC (Apple Lossless Audio Codec)': { value: 'alac', widgets: ['sample_format', 'channel_layout', 'min_prediction_order_alac', 'max_prediction_order_alac'] },
            'FLAC (Free Lossless Audio Codec)': { value: 'flac', widgets: ['sample_format', 'lpc_coeff_precision', 'lpc_type', 'lpc_passes', 'min_partition_order', 'max_partition_order', 'prediction_order_method', 'ch_mode', 'exact_rice_parameters', 'multi_dim_quant', 'min_prediction_order_flac', 'max_prediction_order_flac'] },
            'TrueHD': { value: 'truehd', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'max_interval', 'lpc_coeff_precision', 'lpc_type_truehd', 'lpc_passes', 'codebook_search', 'prediction_order_truehd', 'rematrix_precision'] },
        }
    },
    mov: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10': { value: 'libx264', widgets: ['framerate', 'pixel_format', 'preset', 'tune_h264', 'profile_h264', 'fastfirstpass', 'level', 'wpredp', 'a53cc', 'x264opts', 'crf_63', 'crf_max', 'qp', 'aq_mode_h264', 'aq_strength', 'psy', 'psy_rd', 'rc_lookahead_frametype', 'weightb', 'weightp', 'ssim', 'intra_refresh', 'bluray_compat', 'b_bias', 'b_pyramid', 'mixed_refs', '8x8dct', 'fast_pskip', 'aud', 'mbtree', 'deblock', 'cplxblur', 'partitions', 'direct_pred', 'slice_max_size', 'stats', 'nal_hrd_mp4', 'avcintra_class', 'motion_est_h264', 'forced_idr', 'coder', 'b_strategy', 'chromaoffset', 'sc_threshold', 'noise_reduction', 'udu_sei', 'x264_params', 'mb_info'] },
            'H.265 / HEVC': { value: 'libx265', widgets: ['framerate', 'pixel_format', 'crf_51', 'qp', 'forced_idr', 'preset', 'tune_h265', 'profile_h265', 'udu_sei', 'a53cc', 'x265_params', 'dolbyvision'] },
            'Apple ProRes (iCodec Pro)': { value: 'prores', widgets: ['framerate', 'pixel_format', 'vendor'] },
            'VC3 / DNxHD': { value: 'dnxhd', widgets: ['framerate', 'pixel_format', 'nitris_compat', 'ibias', 'profile_dnxhd'] },
            'Motion JPEG': { value: 'mjpeg', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'huffman', 'force_duplicated_matrix'] },
            'DV (Digital Video)': { value: 'dvvideo', widgets: ['framerate_dvvideo', 'pixel_format', 'quant_deadzone'] },
            'QuickTime Animation (RLE) video': { value: 'qtrle', widgets: ['framerate', 'pixel_format'] },
            'Cinepak': { value: 'cinepak', widgets: ['framerate', 'pixel_format', 'max_extra_cb_iterations', 'skip_empty_cb', 'max_strips', 'min_strips', 'strip_number_adaptivity'] },
            'QuickTime video (RPZA)': { value: 'rpza', widgets: ['framerate', 'pixel_format', 'skip_frame_thresh', 'start_one_color_thresh', 'continue_one_color_thresh', 'sixteen_color_thresh'] },
        },
        audioCodecs: {
            'AAC (Advanced Audio Coding)': { value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
            'ALAC (Apple Lossless Audio Codec)': { value: 'alac', widgets: ['sample_format', 'channel_layout', 'min_prediction_order_alac', 'max_prediction_order_alac'] },
            'MP3 (MPEG audio layer 3)': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
            'PCM signed 16-bit little-endian': { value: 'pcm_s16le', widgets: ['sample_format'] },
            'PCM signed 24-bit big-endian': { value: 'pcm_s24be', widgets: ['sample_format'] },
        }
    },
    avi: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'MPEG-4 part 2': { value: 'mpeg4', widgets: ['framerate', 'pixel_format', 'data_partitioning', 'alternate_scan', 'mpeg_quant', 'b_strategy', 'b_sensitivity', 'brd_scale', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'DV (Digital Video)': { value: 'dvvideo', widgets: ['framerate_dvvideo', 'pixel_format', 'quant_deadzone'] },
            'Motion JPEG': { value: 'mjpeg', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'huffman', 'force_duplicated_matrix'] },
            'HuffYUV': { value: 'huffyuv', widgets: ['framerate', 'pixel_format', 'non_deterministic', 'pred_huffyuv'] },
            'FFmpeg video codec #1': { value: 'ffv1', widgets: ['framerate', 'pixel_format', 'slicecrc', 'coder_ffv1', 'context'] },
            'Microsoft Video 1': { value: 'msvideo1', widgets: ['framerate', 'pixel_format'] },
            'Cinepak': { value: 'cinepak', widgets: ['framerate', 'pixel_format', 'max_extra_cb_iterations', 'skip_empty_cb', 'max_strips', 'min_strips', 'strip_number_adaptivity'] },
        },
        audioCodecs: {
            'MP3 (MPEG audio layer 3)': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
            'PCM signed 16-bit little-endian': { value: 'pcm_s16le', widgets: ['sample_format'] },
            'ATSC A/52A (AC-3)': { value: 'ac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'center_mixlev', 'surround_mixlev', 'mixing_level', 'room_type', 'per_frame_metadata', 'copyright_bit', 'dialnorm', 'dsur_mode', 'original_bit', 'dmix_mode', 'ltrt_cmixlev', 'ltrt_surmixlev', 'loro_cmixlev', 'loro_surmixlev', 'dsurex_mode', 'dheadphone_mode', 'ad_conv_type', 'stereo_rematrixing'] },
        }
    },
    webm: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'On2 VP8': { value: 'libvpx', widgets: ['framerate', 'pixel_format', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'arnr_type', 'tune', 'deadline', 'error_resilient', 'max_intra_rate', 'crf_63', 'static_thresh', 'drop_threshold', 'noise_sensitivity', 'undershoot_pct', 'overshoot_pct', 'ts_parameters', 'auto_alt_ref', 'cpu_used_vpx', 'screen_content_mode', 'speed', 'quality', 'vp8flags', 'rc_lookahead_altref', 'sharpness'] },
            'Google VP9': { value: 'libvpx-vp9', widgets: ['framerate', 'pixel_format', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'arnr_type', 'tune', 'deadline', 'error_resilient', 'max_intra_rate', 'crf_63', 'static_thresh', 'drop_threshold', 'noise_sensitivity', 'undershoot_pct', 'overshoot_pct', 'ts_parameters', 'auto_alt_ref_vp9', 'cpu_used_vp9', 'lossless', 'tile_columns', 'tile_rows_vp9', 'frame_parallel', 'aq_mode_vp9', 'level_vp9', 'row_mt', 'tune_content', 'corpus_complexity', 'enable_tpl', 'min_gf_interval', 'speed', 'quality', 'rc_lookahead_altref', 'sharpness'] },
            'Alliance for Open Media AV1': { value: 'libaom-av1', widgets: ['framerate', 'pixel_format', 'cpu_used_av1', 'auto_alt_ref', 'lag_in_frames', 'arnr_max_frames', 'arnr_strength', 'aq_mode_av1', 'error_resilience', 'crf_63', 'static_thresh', 'drop_threshold', 'denoise_noise_level', 'denoise_block_size', 'undershoot_pct', 'overshoot_pct', 'minsection_pct', 'maxsection_pct', 'frame_parallel', 'tiles', 'tile_columns', 'tile_rows', 'row_mt', 'enable_cdef', 'enable_global_motion', 'enable_intrabc', 'enable_restoration', 'usage', 'tune', 'still_picture', 'dolbyvision', 'enable_rect_partitions', 'enable_1to4_partitions', 'enable_ab_partitions', 'enable_angle_delta', 'enable_cfl_intra', 'enable_filter_intra', 'enable_intra_edge_filter', 'enable_smooth_intra', 'enable_paeth_intra', 'enable_palette', 'enable_flip_idtx', 'enable_tx64', 'reduced_tx_type_set', 'use_intra_dct_only', 'use_inter_dct_only', 'use_intra_default_tx_only', 'enable_ref_frame_mvs', 'enable_reduced_reference_set', 'enable_obmc', 'enable_dual_filter', 'enable_diff_wtd_comp', 'enable_dist_wtd_comp', 'enable_onesided_comp', 'enable_interinter_wedge', 'enable_interintra_wedge', 'enable_masked_comp', 'enable_interintra_comp', 'enable_smooth_interintra', 'aom_params'] },
        },
        audioCodecs: {
            'Opus (Opus Interactive Audio Codec)': { value: 'libopus', widgets: ['sample_rate', 'sample_format', 'application', 'frame_duration', 'packet_loss', 'fec', 'vbr', 'mapping_family', 'apply_phase_inv'] },
            'Vorbis': { value: 'libvorbis', widgets: ['sample_format', 'iblock'] },
        }
    },
    flv: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'FLV / Sorenson Spark / Sorenson H.263 (Flash Video)': { value: 'flv1', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10': { value: 'libx264', widgets: ['framerate', 'pixel_format', 'preset', 'tune_h264', 'profile_h264', 'fastfirstpass', 'level', 'wpredp', 'a53cc', 'x264opts', 'crf_63', 'crf_max', 'qp', 'aq_mode_h264', 'aq_strength', 'psy', 'psy_rd', 'rc_lookahead_frametype', 'weightb', 'weightp', 'ssim', 'intra_refresh', 'bluray_compat', 'b_bias', 'b_pyramid', 'mixed_refs', '8x8dct', 'fast_pskip', 'aud', 'mbtree', 'deblock', 'cplxblur', 'partitions', 'direct_pred', 'slice_max_size', 'stats', 'nal_hrd_mp4', 'avcintra_class', 'motion_est_h264', 'forced_idr', 'coder', 'b_strategy', 'chromaoffset', 'sc_threshold', 'noise_reduction', 'udu_sei', 'x264_params', 'mb_info'] },
        },
        audioCodecs: {
            'MP3 (MPEG audio layer 3)': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
            'AAC (Advanced Audio Coding)': { value: 'aac', widgets: ['sample_rate', 'sample_format', 'aac_coder', 'aac_ms', 'aac_is', 'aac_pns', 'aac_tns', 'aac_ltp', 'aac_pred', 'aac_pce'] },
            'Nellymoser Asao': { value: 'nellymoser', widgets: ['sample_rate_nellymoser', 'sample_format', 'channel_layout'] },
            'ADPCM Shockwave Flash': { value: 'adpcm_swf', widgets: ['sample_rate_adpcm_swf', 'sample_format', 'channel_layout', 'block_size'] },
        }
    },
    wmv: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'Windows Media Video 7': { value: 'wmv1', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'Windows Media Video 8': { value: 'wmv2', widgets: ['framerate', 'pixel_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_eq', 'rc_init_cplx', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
        },
        audioCodecs: {
            'Windows Media Audio 1': { value: 'wmav1', widgets: ['sample_format'] },
            'Windows Media Audio 2': { value: 'wmav2', widgets: ['sample_format'] },
            'GSM Microsoft variant': { value: 'gsm_ms', widgets: ['sample_rate_8000', 'sample_format', 'channel_layout'] },
        }
    },
    mpeg: {
        group: 'video',
        tool: 'ffmpeg',
        outputs: [...allVideoFormats, ...allAudioFormats],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'MPEG-1 video': { value: 'mpeg1video', widgets: ['framerate_DYN', 'pixel_format', 'gop_timecode', 'drop_frame_timecode', 'scan_offset', 'timecode_frame_start', 'b_strategy', 'b_sensitivity', 'brd_scale', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_init_cplx', 'rc_eq', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
            'MPEG-2 video': { value: 'mpeg2video', widgets: ['framerate_DYN', 'pixel_format', 'gop_timecode', 'drop_frame_timecode', 'scan_offset', 'timecode_frame_start', 'b_strategy', 'b_sensitivity', 'brd_scale', 'intra_vlc', 'non_linear_quant', 'alternate_scan', 'a53cc', 'seq_disp_ext', 'video_format', 'mpv_flags', 'luma_elim_threshold', 'chroma_elim_threshold', 'quantizer_noise_shaping', 'qsquish', 'rc_qmod_amp', 'rc_qmod_freq', 'rc_init_cplx', 'rc_eq', 'border_mask', 'lmin', 'lmax', 'skip_threshold', 'skip_factor', 'skip_exp', 'skip_cmp', 'sc_threshold', 'noise_reduction', 'ps', 'motion_est_mpeg', 'mepc', 'mepre', 'intra_penalty'] },
        },
        audioCodecs: {
            'MP2': { value: 'mp2', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
            'MP3': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'reservoir', 'joint_stereo', 'abr', 'copyright_flag', 'original_flag'] },
            'PCM signed 16-bit big-endian for DVD media': { value: 'pcm_dvd', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
            'PCM signed 16-bit big-endian': { value: 'pcm_s16be', widgets: ['sample_format'] },
            'AC-3': { value: 'ac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'center_mixlev', 'surround_mixlev', 'mixing_level', 'room_type', 'per_frame_metadata', 'copyright_bit', 'dialnorm', 'dsur_mode', 'original_bit', 'dmix_mode', 'ltrt_cmixlev', 'ltrt_surmixlev', 'loro_cmixlev', 'loro_surmixlev', 'dsurex_mode', 'dheadphone_mode', 'ad_conv_type', 'stereo_rematrixing'] },
            'DCA (DTS Coherent Acoustics)': { value: 'dca', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'dca_adpcm'] },
        }
    },

    // ====== Image Formats ======
    jpg: { group: 'image', outputs: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: false, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness', 'alpha_fill'] },
    jpeg: { group: 'image', outputs: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: false, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness', 'alpha_fill'] },
    jxr: { group: 'image', outputs: ['jxr', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: false, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness', 'alpha_fill'] },
    png: { group: 'image', outputs: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    svg: { group: 'image', outputs: ['svg', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    gif: { group: 'image', outputs: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: false, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness', 'alpha_fill', 'gif_delay', 'gif_loop'] },
    bmp: { group: 'image', outputs: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    webp: { group: 'image', outputs: ['webp', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    tiff: { group: 'image', outputs: ['tiff', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    heic: { group: 'image', outputs: ['heic', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'eps', 'psd', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    eps: { group: 'image', outputs: ['eps', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'psd', 'ico'], supportsAlpha: false, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness', 'alpha_fill'] },
    psd: { group: 'image', outputs: ['psd', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'ico'], supportsAlpha: true, widgets: ['img_quality', 'img_resize', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },
    ico: { group: 'image', outputs: ['ico', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd'], supportsAlpha: true, widgets: ['img_quality', 'img_rotate', 'img_sharpen', 'img_blur', 'img_brightness'] },

    // --- Document Formats ---
    pdf: { group: 'document', tool: 'pdf', outputs: ['pdf', 'jpeg', 'epub', 'docx'], widgets: {} },

    // Pandoc-based documents
    docx: { group: 'document', tool: 'pandoc', outputs: ["docx", "html", "epub", "txt", "md", "rst", "rtf", "odt", "docbook", "fb2", "org", "muse", "textile", "jats", "roff", "tex", "ipynb", "opml", "bibtex", "bib", "json", "yaml", "wiki", "dokuwiki", "jira"] },
    // ... (add all other pandoc input formats here with their respective outputs)

    // Calibre-based documents
    epub: { group: 'document', tool: 'calibre', outputs: ["epub", "pdf", "azw3", "mobi", "docx", "fb2", "htmlz", "lit", "lrf", "pdb", "pmlz", "rb", "rtf", "snb", "tcr", "txt", "txtz", "zip"] },
    // ... (add all other calibre input formats here with their respective outputs)
};

// ===========================================================================
// HELPER FUNCTIONS (Preserving existing logic, adapted for the new structure)
// ===========================================================================

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

    for (const group in grouped) {
        grouped[group].sort();
    }
    return grouped;
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
