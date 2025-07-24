/**
 * Mapping from file extension to its category/group.
 * Add new extensions here as needed.
 */
const extToGroup = {
    // Audio formats
    mp3: 'audio',
    mpeg: 'audio',
    flac: 'audio',
    wav: 'audio',
    aac: 'audio',
    ogg: 'audio',
    m4a: 'audio',
    wma: 'audio',
    ncm: 'audio',

    // Video formats
    mp4: 'video',
    mov: 'video',
    avi: 'video',
    mkv: 'video',
    webm: 'video',
    flv: 'video',
    wmv: 'video',

    // Image formats
    jpg: 'image',
    jpeg: 'image',
    jxr: 'image',
    png: 'image',
    svg: 'image',
    gif: 'image',
    bmp: 'image',
    webp: 'image',
    tiff: 'image',
    heic: 'image',
    eps: 'image',
    psd: 'image',
    ico: 'image',
};

/**
 * Mapping from each input extension to the set of possible output extensions.
 * Each format can convert to itself plus other group-specific targets.
 */
const extToOutputs = {
    // All audio formats: ['mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'ncm']
    mp3: ['mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma'],
    mpeg: ['mpeg', 'mp3', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma'],
    flac: ['flac', 'mp3', 'mpeg', 'wav', 'aac', 'ogg', 'm4a', 'wma'],
    wav: ['wav', 'mp3', 'mpeg', 'flac', 'aac', 'ogg', 'm4a', 'wma'],
    aac: ['aac', 'mp3', 'mpeg', 'flac', 'wav', 'ogg', 'm4a', 'wma'],
    ogg: ['ogg', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'm4a', 'wma'],
    m4a: ['m4a', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'wma'],
    wma: ['wma', 'mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a'],
    ncm: ['mp3', 'mpeg', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma'],

    // All video formats: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']
    mp4: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'],
    mov: ['mov', 'mp4', 'avi', 'mkv', 'webm', 'flv', 'wmv'],
    avi: ['avi', 'mp4', 'mov', 'mkv', 'webm', 'flv', 'wmv'],
    mkv: ['mkv', 'mp4', 'mov', 'avi', 'webm', 'flv', 'wmv'],
    webm: ['webm', 'mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv'],
    flv: ['flv', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'wmv'],
    wmv: ['wmv', 'mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'],

    // All image formats: ['jpg', 'jpeg', 'jxr', 'png', 'svg', 'gif', 'bmp', 'webp', 'tiff', 'heic', 'eps', 'psd', 'ico']
    jpg: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    jpeg: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    jxr: ['jxr', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg', 'heic', 'eps', 'psd', 'ico'],
    png: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    svg: ['svg', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'heic', 'eps', 'psd', 'ico'],
    gif: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    bmp: ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    webp: ['webp', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    tiff: ['tiff', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'jxr', 'svg', 'heic', 'eps', 'psd', 'ico'],
    heic: ['heic', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'eps', 'psd', 'ico'],
    eps: ['eps', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'psd', 'ico'],
    psd: ['psd', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'ico'],
    ico: ['ico', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'jxr', 'svg', 'heic', 'eps', 'psd'],
};

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
        const grp = extToGroup[ext]
        if (grp) counts[grp] = (counts[grp] || 0) + 1
    });

    return Object.entries(counts).reduce(
        (best, [grp, cnt]) => (cnt > best[1] ? [grp, cnt] : best),
        [null, 0]
    )[0]
}

function getOutputFormats(filePaths, fileType) {
    const exts = filePaths.map(getExtension);
    const inGroup = exts.filter(ext => extToGroup[ext] === fileType);
    const common = intersect(inGroup.map(ext => extToOutputs[ext]));
    return Array.from(new Set(common)).sort();
}

export function truncateMiddle(str, maxLen = 40) {
    if (str.length <= maxLen) return str;
    const keep = Math.floor((maxLen - 1) / 2);
    return str.slice(0, keep) + '…' + str.slice(str.length - keep);
}

export function processFiles(newlySelectedPaths, currentFilePaths, currentFileType) {
    const result = {
        newFileType: currentFileType,
        outputFormats: [],
        uniques: [],
        duplicates: [],
        unsupported: [],
        nonMajorType: [],
    };

    const candidates = []; // { path: string, ext: string, group: string }

    for (const path of newlySelectedPaths) {
        if (currentFilePaths.includes(path)) {
            result.duplicates.push(path);
            continue;
        }

        const ext = getExtension(path);
        if (!ext || !extToOutputs[ext]) {
            result.unsupported.push(path);
            continue;
        }

        const group = extToGroup[ext];
        candidates.push({ path, ext, group });
    }

    if (candidates.length === 0) {
        result.outputFormats = getOutputFormats(currentFilePaths, result.newFileType);
        return result;
    }

    if (currentFileType) {
        // Subsequent selection: Enforce existing fileType
        candidates.forEach(candidate => {
            if (candidate.group === currentFileType) {
                result.uniques.push(candidate.path);
            } else {
                result.nonMajorType.push(candidate.path);
            }
        });

    } else {
        // First selection: Determine major file type from candidates
        const candidateExtensions = candidates.map(c => c.ext);
        const majorFileType = getMajorFileType(candidateExtensions);

        if (majorFileType) {
            result.newFileType = majorFileType;
            candidates.forEach(candidate => {
                if (candidate.group === majorFileType) {
                    result.uniques.push(candidate.path);
                } else {
                    result.nonMajorType.push(candidate.path);
                }
            });
        }
        else {
            console.warn('No major file type found for candidates:', candidates);
        }
    }

    const finalFilePaths = [...currentFilePaths, ...result.uniques];
    result.outputFormats = getOutputFormats(finalFilePaths, result.newFileType);

    return result;
}
