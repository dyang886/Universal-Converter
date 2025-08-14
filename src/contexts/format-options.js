// ===========================================================================
// 1. WIDGET OPTIONS
// Centralized, reusable option sets for UI widgets like dropdowns.
// ===========================================================================
export const widgetOptions = {
    aspect_ratio: { "3:2": "3:2", "4:3": "4:3", "5:4": "5:4", "16:10": "16:10", "16:9": "16:9", "37:20 (1.85:1)": "37:20", "21:9 (2.35:1)": "21:9", "69:25 (2.76:1)": "69:25", "9:16": "9:16" },
    video_rotate: { "90° Clockwise": "transpose=1", "90° Counterclockwise": "transpose=2", "180°": "transpose=1,transpose=1" },
    video_flip: { "Horizontal Flip": "hflip", "Vertical Flip": "vflip" },
    preset: { "Ultrafast": "ultrafast", "Superfast": "superfast", "Veryfast": "veryfast", "Faster": "faster", "Fast": "fast", "Medium": "medium", "Slow": "slow", "Slower": "slower", "Veryslow": "veryslow" },
    tune_h264: { "Film": "film", "Animation": "animation", "Grain": "grain", "Still Image": "stillimage", "Fast Decode": "fastdecode", "Zero Latency": "zerolatency" },
    tune_h265: { "Animation": "animation", "Grain": "grain", "Fast Decode": "fastdecode", "Zero Latency": "zerolatency" },
    aq_mode: { "None": "0", "Variance": "1", "Complexity": "2", "Cyclic": "3" },
    motion_est: { "Zero": "0", "EPZS": "1", "Xone": "2" },
    audio_bitrate: { "8 kbps": "8k", "16 kbps": "16k", "24 kbps": "24k", "32 kbps": "32k", "40 kbps": "40k", "48 kbps": "48k", "64 kbps": "64k", "80 kbps": "80k", "96 kbps": "96k", "112 kbps": "112k", "128 kbps": "128k", "160 kbps": "160k", "192 kbps": "192k", "224 kbps": "224k", "256 kbps": "256k", "320 kbps": "320k" },
    aac_coder: { "Two Loop": "1", "Fast": "2" },
    lpc_type: { "None": "0", "Fixed": "1", "Levinson": "2", "Cholesky": "3" },
    ch_mode: { "Auto": "-1", "Independent": "0", "Left Side": "1", "Right Side": "2", "Mid Side": "3" },
    vbr: { "Constant Bit Rate": "0", "Variable Bit Rate": "1", "Constrained VBR": "2" },
    room_type: { "Not Indicated": "0", "Large Room": "1", "Small Room": "2" },
    dmix_mode: { "Not Indicated": "0", "Lt/Rt Downmix Preferred": "1", "Lo/Ro Downmix Preferred": "2", "Dolby Pro Logic II Downmix Preferred": "3" },
    dsur_mode: { "Not Indicated": "0", "Not Dolby Surround Encoded": "1", "Dolby Surround Encoded": "2" },
    dsurex_mode: { "Not Indicated": "0", "Not Dolby Surround EX Encoded": "1", "Dolby Surround EX Encoded": "2", "Dolby Pro Logic IIz-Encoded": "3" },
    dheadphone_mode: { "Not Indicated": "0", "Not Dolby Headphone Encoded": "1", "Dolby Headphone Encoded": "2" },
};

// ===========================================================================
// 2. WIDGET DEFINITIONS
// Blueprints for each UI widget, defining its type, label, and options.
// ===========================================================================
export const widgetDefinitions = {
    // video.general
    disable_video: { arg: "-vn", labelKey: "advanced.video.disable_video", type: "checkbox" },
    disable_subtitle: { arg: "-sn", labelKey: "advanced.video.disable_subtitle", type: "checkbox" },
    pass: { arg: "-pass", labelKey: "advanced.video.pass", type: "input-int", options: [1, 3] },
    aspect_ratio: { arg: "-aspect", labelKey: "advanced.video.aspect_ratio", type: "select", options: widgetOptions.aspect_ratio },
    vframes: { arg: "-vframes", labelKey: "advanced.video.vframes", type: "input-int", options: [-9223372036854775808, 9223372036854775808] },
    video_bitrate: { arg: "-b:v", labelKey: "advanced.video.video_bitrate", type: "input-int", options: [0, 9.22337e+18] },
    video_rotate: { arg: "-vf", labelKey: "advanced.video.video_rotate", type: "select", options: widgetOptions.video_rotate },
    video_flip: { arg: "-vf", labelKey: "advanced.video.video_flip", type: "select", options: widgetOptions.video_flip },
    // video.codec_specific
    framerate: { arg: "-r", labelKey: "advanced.video.framerate", type: "input-int", options: [0, Infinity] },
    framerate_DYN: { arg: "-r", labelKey: "advanced.video.framerate", type: "select", options: 'dynamic' },
    pixel_format: { arg: "-pix_fmt", labelKey: "advanced.video.pixel_format", type: "select", options: 'dynamic' },
    crf_v1: { arg: "-crf", labelKey: "advanced.video.crf", type: "input-int", options: [0, 51] },
    crf_v2: { arg: "-crf", labelKey: "advanced.video.crf", type: "input-int", options: [0, 63] },
    preset: { arg: "-preset", labelKey: "advanced.video.preset", type: "select", options: widgetOptions.preset },
    tune_h264: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_h264 },
    tune_h265: { arg: "-tune", labelKey: "advanced.video.tune", type: "select", options: widgetOptions.tune_h265 },
    me_quality: { arg: "-me_quality", labelKey: "advanced.video.me_quality", type: "input-int", options: [0, 6] },
    gmc: { arg: "-gmc", labelKey: "advanced.video.gmc", type: "checkbox" },
    speed: { arg: "-speed", labelKey: "advanced.video.speed", type: "input-int", options: [-16, 16] },
    sharpness: { arg: "-sharpness", labelKey: "advanced.video.sharpness", type: "input-int", options: [-1, 7] },
    lossless: { arg: "-lossless", labelKey: "advanced.video.lossless", type: "checkbox" },
    aq_mode: { arg: "-aq-mode", labelKey: "advanced.video.aq_mode", type: "select", options: widgetOptions.aq_mode },
    motion_est: { arg: "-motion_est", labelKey: "advanced.video.motion_est", type: "select", options: widgetOptions.motion_est },

    // audio.general
    disable_audio: { arg: "-an", labelKey: "advanced.audio.disable_audio", type: "checkbox" },
    audio_volume: { arg: "-af", labelKey: "advanced.audio.audio_volume", type: "input-flt", options: [-Infinity, Infinity], prefix: 'volume=' },
    audio_speed: { arg: "-af", labelKey: "advanced.audio.audio_speed", type: "input-flt", options: [0, Infinity], prefix: 'atempo=' },
    audio_quality: { arg: "-aq", labelKey: "advanced.audio.audio_quality", type: "input-int", options: [-Infinity, Infinity] },
    audio_bitrate: { arg: "-b:a", labelKey: "advanced.audio.audio_bitrate", type: "select", options: widgetOptions.audio_bitrate },
    audio_channels: { arg: "-ac", labelKey: "advanced.audio.channels", type: "input-int", options: [-2147483648, 2147483647] },
    aframes: { arg: "-aframes", labelKey: "advanced.audio.aframes", type: "input-int", options: [-9223372036854775808, 9223372036854775808] },
    // audio.codec_specific
    sample_rate: { arg: "-ar", labelKey: "advanced.audio.sample_rate", type: "select", options: 'dynamic' },
    sample_format: { arg: "-sample_fmt", labelKey: "advanced.audio.sample_format", type: "select", options: 'dynamic' },
    channel_layout: { arg: "-ch_layout", labelKey: "advanced.audio.channel_layout", type: "select", options: 'dynamic' },
    aac_coder: { arg: "-aac_coder", labelKey: "advanced.audio.aac_coder", type: "select", options: widgetOptions.aac_coder },
    room_type: { arg: "-room_type", labelKey: "advanced.audio.room_type", type: "select", options: widgetOptions.room_type },
    mixing_level: { arg: "-mixing_level", labelKey: "advanced.audio.mixing_level", type: "input-int", options: [80, 111] },
    dmix_mode: { arg: "-dmix_mode", labelKey: "advanced.audio.dmix_mode", type: "select", options: widgetOptions.dmix_mode },
    dsur_mode: { arg: "-dsur_mode", labelKey: "advanced.audio.dsur_mode", type: "select", options: widgetOptions.dsur_mode },
    dsurex_mode: { arg: "-dsurex_mode", labelKey: "advanced.audio.dsurex_mode", type: "select", options: widgetOptions.dsurex_mode },
    dheadphone_mode: { arg: "-dheadphone_mode", labelKey: "advanced.audio.dheadphone_mode", type: "select", options: widgetOptions.dheadphone_mode },
    vbr: { arg: "-vbr", labelKey: "advanced.audio.vbr", type: "select", options: widgetOptions.vbr },
    lpc_type: { arg: "-lpc_type", labelKey: "advanced.audio.lpc_type", type: "select", options: widgetOptions.lpc_type },
    ch_mode: { arg: "-ch_mode", labelKey: "advanced.audio.ch_mode", type: "select", options: widgetOptions.ch_mode },

    // image
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
const generalVideoWidgets = ['disable_video', 'disable_subtitle', 'pass', 'aspect_ratio', 'vframes', 'video_bitrate', 'video_rotate', 'video_flip'];
const generalAudioWidgets = ['audio_volume', 'audio_speed', 'audio_quality', 'audio_bitrate', 'audio_channels', 'aframes'];
export const formats = {
    // --- Audio Formats ---
    mp3: {
        group: 'audio',
        outputs: ['mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'MP3': { value: 'libmp3lame', widgets: [] }
        }
    },
    mpeg: {
        group: 'audio',
        outputs: ['mpeg', 'mp3', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'MP2': { value: 'mp2', widgets: [] },
            'MP3': { value: 'libmp3lame', widgets: [] }
        }
    },
    flac: {
        group: 'audio',
        outputs: ['flac', 'mp3', 'mpeg', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'FLAC': { value: 'flac', widgets: ['lpc_type', 'ch_mode'] }
        }
    },
    wav: {
        group: 'audio',
        outputs: ['wav', 'mp3', 'mpeg', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets, // Note: Bitrate is not applicable for PCM
        codecs: {
            'PCM 16-bit': { value: 'pcm_s16le', widgets: [] },
            'PCM 24-bit': { value: 'pcm_s24le', widgets: [] },
            'PCM 32-bit': { value: 'pcm_s32le', widgets: [] }
        }
    },
    aac: {
        group: 'audio',
        outputs: ['aac', 'mp3', 'mpeg', 'flac', 'wav', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'AAC': { value: 'aac', widgets: ['aac_coder'] }
        }
    },
    ogg: {
        group: 'audio',
        outputs: ['ogg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'm4a', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'Opus': { value: 'libopus', widgets: ['vbr'] },
            'Vorbis': { value: 'libvorbis', widgets: [] }
        }
    },
    m4a: {
        group: 'audio',
        outputs: ['m4a', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'wma', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'AAC': { value: 'aac', widgets: ['aac_coder'] },
            'ALAC': { value: 'alac', widgets: ['sample_rate', 'channels'] } // Note: Bitrate is not applicable for ALAC
        }
    },
    wma: {
        group: 'audio',
        outputs: ['wma', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'aiff', 'opus'],
        widgets: generalAudioWidgets,
        codecs: {
            'WMA': { value: 'wmav2', widgets: [] }
        }
    },
    aiff: {
        group: 'audio',
        outputs: ['aiff', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'opus'],
        widgets: ['sample_rate', 'channels'], // Note: Bitrate is not applicable for PCM
        codecs: {
            'PCM 16-bit': { value: 'pcm_s16be', widgets: [] },
            'PCM 24-bit': { value: 'pcm_s24be', widgets: [] }
        }
    },
    opus: {
        group: 'audio',
        outputs: ['opus', 'ogg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'm4a', 'wma', 'aiff'],
        widgets: generalAudioWidgets,
        codecs: {
            'Opus': { value: 'libopus', widgets: ['vbr'] }
        }
    },
    ncm: {
        group: 'audio',
        outputs: ['mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        tool: 'ncm',
        widgets: [] // No configurable widgets for this tool
    },

    // --- Video Formats ---
    mp4: {
        group: 'video',
        outputs: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.264/MPEG-4': { value: 'libx264', widgets: ['crf_v1', 'preset', 'tune_h264'] },
            'H.265/HEVC': { value: 'libx265', widgets: ['crf_v1', 'preset', 'tune_h265'] }
        },
        audioCodecs: {
            'AAC': { value: 'aac', widgets: ['aac_coder'] },
            'MP3': { value: 'libmp3lame', widgets: [] },
            'AC-3': { value: 'ac3', widgets: ['room_type', 'mixing_level', 'dmix_mode', 'dsur_mode', 'dsurex_mode', 'dheadphone_mode'] }
        }
    },
    mov: {
        group: 'video',
        outputs: ['mov', 'mp4', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.264/MPEG-4': { value: 'libx264', widgets: ['crf_v1', 'preset', 'tune_h264'] },
            'ProRes': { value: 'prores', widgets: [] },
            'H.265/HEVC': { value: 'libx265', widgets: ['crf_v1', 'preset', 'tune_h265'] }
        },
        audioCodecs: {
            'AAC': { value: 'aac', widgets: ['aac_coder'] },
            'ALAC': { value: 'alac', widgets: [] },
            'AC-3': { value: 'ac3', widgets: ['room_type', 'mixing_level', 'dmix_mode', 'dsur_mode', 'dsurex_mode', 'dheadphone_mode'] }
        }
    },
    avi: {
        group: 'video',
        outputs: ['avi', 'mp4', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'Xvid': { value: 'libxvid', widgets: ['me_quality', 'gmc'] },
            'H.264/MPEG-4': { value: 'libx264', widgets: ['crf_v1', 'preset', 'tune_h264'] },
            'H.265/HEVC': { value: 'libx265', widgets: ['crf_v1', 'preset', 'tune_h265'] }
        },
        audioCodecs: {
            'MP3': { value: 'libmp3lame', widgets: [] },
            'AC-3': { value: 'ac3', widgets: ['room_type', 'mixing_level', 'dmix_mode', 'dsur_mode', 'dsurex_mode', 'dheadphone_mode'] },
            'WMA': { value: 'wmav2', widgets: [] }
        }
    },
    mkv: {
        group: 'video',
        outputs: ['mkv', 'mp4', 'mov', 'avi', 'webm', 'flv', 'wmv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.264/MPEG-4': { value: 'libx264', widgets: ['crf_v1', 'preset', 'tune_h264'] },
            'H.265/HEVC': { value: 'libx265', widgets: ['crf_v1', 'preset', 'tune_h265'] },
            'VP9': { value: 'libvpx-vp9', widgets: ['crf_v2', 'speed', 'sharpness', 'lossless'] },
            'VP8': { value: 'libvpx', widgets: ['crf_v2', 'speed', 'sharpness'] },
            'AV1': { value: 'libaom-av1', widgets: ['crf_v2', 'aq_mode'] }
        },
        audioCodecs: {
            'AAC': { value: 'aac', widgets: ['aac_coder'] },
            'MP3': { value: 'libmp3lame', widgets: [] },
            'Opus': { value: 'libopus', widgets: ['vbr'] },
            'Vorbis': { value: 'libvorbis', widgets: [] },
            'FLAC': { value: 'flac', widgets: ['lpc_type', 'ch_mode'] },
            'ALAC': { value: 'alac', widgets: [] },
            'AC-3': { value: 'ac3', widgets: ['room_type', 'mixing_level', 'dmix_mode', 'dsur_mode', 'dsurex_mode', 'dheadphone_mode'] }
        }
    },
    webm: {
        group: 'video',
        outputs: ['webm', 'mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'VP9': { value: 'libvpx-vp9', widgets: ['crf_v2', 'speed', 'sharpness', 'lossless'] },
            'VP8': { value: 'libvpx', widgets: ['crf_v2', 'speed', 'sharpness'] },
            'AV1': { value: 'libaom-av1', widgets: ['crf_v2', 'aq_mode'] }
        },
        audioCodecs: {
            'Opus': { value: 'libopus', widgets: ['vbr'] },
            'Vorbis': { value: 'libvorbis', widgets: [] }
        }
    },
    flv: {
        group: 'video',
        outputs: ['flv', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'H.263': { value: 'flv1', widgets: ['motion_est'] }
        },
        audioCodecs: {
            'MP3': { value: 'libmp3lame', widgets: [] },
            'ADPCM': { value: 'adpcm_swf', widgets: ['sample_rate_adpcm'] },
            'Nellymoser Asao': { value: 'nellymoser', widgets: ['sample_rate_nellymoser'] }
        }
    },
    wmv: {
        group: 'video',
        outputs: ['wmv', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'mpg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'MPEG-4 pt.2 MS v.3': { value: 'msmpeg4', widgets: ['motion_est'] },
            'Windows Media Video 8': { value: 'wmv2', widgets: ['motion_est'] },
            'Windows Media Video 7': { value: 'wmv1', widgets: ['motion_est'] }
        },
        audioCodecs: {
            'WMA': { value: 'wmav2', widgets: [] }
        }
    },
    mpg: {
        group: 'video',
        outputs: ['mpg', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'],
        videoWidgets: generalVideoWidgets,
        audioWidgets: ['disable_audio', ...generalAudioWidgets],
        videoCodecs: {
            'MPEG-1': { value: 'mpeg1video', widgets: ['pixel_format', 'framerate_DYN'] },
            'MPEG-2': { value: 'mpeg2video', widgets: ['pixel_format', 'framerate_DYN'] }
        },
        audioCodecs: {
            'MP2': { value: 'mp2', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
            'MP3': { value: 'libmp3lame', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
            'PCM Signed 16-bit Big-endian for DVD Media': { value: 'pcm_dvd', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
            'PCM Signed 16-bit Big-endian': { value: 'pcm_s16be', widgets: ['sample_format'] },
            'AC-3': { value: 'ac3', widgets: ['sample_rate', 'sample_format', 'channel_layout', 'room_type', 'mixing_level', 'dmix_mode', 'dsur_mode', 'dsurex_mode', 'dheadphone_mode'] },
            'DCA (DTS Coherent Acoustics)': { value: 'dca', widgets: ['sample_rate', 'sample_format', 'channel_layout'] },
        }
    },

    // --- Image Formats ---
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
