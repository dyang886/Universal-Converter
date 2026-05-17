import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { useTranslation } from 'react-i18next';

import { formats, widgetDefinitions, processFiles, truncateMiddle, buildGroupedArgs, formatTags, getTaggedFormatExts } from '@/contexts/format-options';
import i18n from '@/contexts/i18n';
import { usePrompt } from '@/components/prompt';
import { getDependencyPack, resolveConversionRoute } from '@/contexts/conversion-routing';


const AppContext = createContext(null);
const MISSING_DEPENDENCIES_ERROR_PREFIX = 'missing_dependencies:';

function getPathExtension(path) {
    const fileName = path.split(/[\\/]/).pop() || '';
    const dotIndex = fileName.lastIndexOf('.');
    return dotIndex === -1 ? '' : fileName.slice(dotIndex + 1).toLowerCase();
}

function getDependencyNames(packIds) {
    return packIds.map(id => getDependencyPack(id)?.name || id).join(', ');
}

function getMissingDependenciesErrorIds(error) {
    const errorText = String(error || '');
    if (!errorText.startsWith(MISSING_DEPENDENCIES_ERROR_PREFIX)) return [];

    return errorText
        .slice(MISSING_DEPENDENCIES_ERROR_PREFIX.length)
        .split(',')
        .map(id => id.trim())
        .filter(Boolean);
}

function getMissingDependenciesMessage(t, packIds) {
    return t('prompt.missing_dependencies', { dependencies: getDependencyNames(packIds) });
}

export function AppProvider({ children }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { showPrompt } = usePrompt();
    const [filePaths, setFilePaths] = useState([]);
    const [fileType, setFileType] = useState('');
    const [outputExt, setOutputExt] = useState('');
    const [outputOptions, setOutputOptions] = useState({});
    const [settings, setSettings] = useState(null);
    const [terminalLogs, setTerminalLogs] = useState([]);
    const [isConverting, setIsConverting] = useState(false);

    const [selectedVideoCodec, setSelectedVideoCodec] = useState('');
    const [selectedAudioCodec, setSelectedAudioCodec] = useState('');
    const [advancedOptionValues, setAdvancedOptionValues] = useState({});
    const [activeTab, setActiveTab] = useState('general');
    const [conversionMeta, setConversionMeta] = useState(null);

    // Text truncation
    function MiddleEllipsis({ text }) {
        const ref = useRef(null);
        const [display, setDisplay] = useState(text);

        useLayoutEffect(() => {
            const element = ref.current;
            if (!element) return;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const updateDisplay = () => {
                const availableWidth = element.clientWidth;
                if (availableWidth === 0) return;

                const style = window.getComputedStyle(element);
                const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                ctx.font = font;

                if (ctx.measureText(text).width <= availableWidth) {
                    setDisplay(text);
                    return;
                }

                let low = 0;
                let high = text.length;
                let best = text;

                while (low < high) {
                    const mid = Math.floor((low + high) / 2);
                    const keepFront = Math.ceil(mid / 2);
                    const keepBack = Math.floor(mid / 2);
                    const candidate = text.slice(0, keepFront) + '…' + text.slice(text.length - keepBack);

                    if (ctx.measureText(candidate).width <= availableWidth) {
                        best = candidate;
                        low = mid + 1;
                    } else {
                        high = mid;
                    }
                }

                setDisplay(best);
            };

            const observer = new ResizeObserver(updateDisplay);

            observer.observe(element);
            updateDisplay();

            return () => observer.disconnect();
        }, [text]);

        return (
            <span ref={ref} className="block max-w-full overflow-hidden whitespace-nowrap" title={text}>
                {display}
            </span>
        );
    }

    useEffect(() => {
        if (filePaths.length === 0) {
            setFileType('');
            setOutputOptions([]);
            setOutputExt('');
        }
    }, [filePaths]);

    useEffect(() => {
        setSelectedVideoCodec('');
        setSelectedAudioCodec('');
        setAdvancedOptionValues({});
    }, [outputExt]);

    const initRanRef = useRef(false);

    useEffect(() => {
        if (initRanRef.current) return;
        initRanRef.current = true;

        const initializeApp = async () => {
            try {
                const loadedSettings = await invoke('load_settings');
                setSettings(loadedSettings);

                if (loadedSettings.language) {
                    await i18n.changeLanguage(loadedSettings.language);
                }

                document.documentElement.classList.toggle('dark', loadedSettings.theme === 'dark');

                if (loadedSettings.auto_update) {
                    try {
                        const localVersion = await getVersion();
                        const serverVersion = await invoke('check_for_updates', { appName: 'UCT' });
                        if (serverVersion > localVersion) {
                            showPrompt('update', t('prompt.update_available'), {
                                currentVersion: localVersion,
                                latestVersion: serverVersion,
                                duration: 10000,
                                actions: [{
                                    label: t('about.update_now'),
                                    onClick: () => invoke('launch_updater', {
                                        latestVersion: serverVersion,
                                        theme: loadedSettings.theme,
                                        language: loadedSettings.language,
                                    }).catch(console.error),
                                }],
                            });
                        }
                    } catch (e) {
                        console.error("Auto-update check failed:", e);
                    }
                }

            } catch (error) {
                console.error("Failed to initialize app:", error);
            }
        };

        initializeApp();
    }, []);

    useEffect(() => {
        if (settings !== null) {
            invoke('save_settings', { settings });
        }
    }, [settings]);

    const handleFileSelection = useCallback((paths, showPrompt) => {
        if (!paths || paths.length === 0) return;
        const newPaths = Array.isArray(paths) ? paths : [paths];
        const { newFileType, outputFormats, uniques, duplicates, unsupported, nonMajorType } = processFiles(newPaths, filePaths, fileType);

        duplicates.forEach(p => showPrompt('warning', `${t('prompt.duplicated_file')}: ${truncateMiddle(p)}`));
        unsupported.forEach(p => showPrompt('warning', `${t('prompt.unsupported_file')}: ${truncateMiddle(p)}`));
        nonMajorType.forEach(p => showPrompt('warning', `${t('prompt.select_same_type')}: ${truncateMiddle(p)}`));

        if (uniques.length > 0) {
            const updated = [...filePaths, ...uniques];
            setFilePaths(updated);

            if (newFileType !== fileType) {
                setFileType(newFileType);
            }

            setOutputOptions(outputFormats);

            const firstGroup = Object.keys(outputFormats)[0];
            if (firstGroup && outputFormats[firstGroup].length > 0) {
                const firstOption = outputFormats[firstGroup][0];
                if (!Object.values(outputFormats).flat().includes(outputExt)) {
                    setOutputExt(firstOption);
                }
            }
        }
    }, [filePaths, fileType, outputExt]);

    const handleConvert = useCallback(async (showPrompt) => {
        try {
            const outputConfig = formats[outputExt] || {};
            const outputGroup = outputConfig.group || '';
            const inputGroup = fileType || (() => {
                const ext = getPathExtension(filePaths[0] || '');
                return formats[ext]?.group || '';
            })();
            const inputExt = getPathExtension(filePaths[0] || '');
            const route = resolveConversionRoute({ inputGroup, inputExt, outputGroup, outputExt });

            if (route?.packs?.length) {
                const dependencyStatuses = await invoke('get_dependency_statuses');
                const installedPackIds = new Set(dependencyStatuses.filter(status => status.installed).map(status => status.id));
                const missingPackIds = Array.from(new Set(route.packs.filter(packId => !installedPackIds.has(packId))));

                if (missingPackIds.length > 0) {
                    showPrompt('warning', getMissingDependenciesMessage(t, missingPackIds));
                    return;
                }
            }

            const combineInputs = advancedOptionValues['combine_inputs'] === true;

            const groupedArgs = buildGroupedArgs(advancedOptionValues);

            const finalOptions = {};
            if (selectedVideoCodec) {
                finalOptions['-c:v'] = selectedVideoCodec;
            }
            if (selectedAudioCodec) {
                finalOptions['-c:a'] = selectedAudioCodec;
            }

            for (const arg in groupedArgs) {
                const combinedValue = groupedArgs[arg].filter(v => v !== '').join(',');
                finalOptions[arg] = combinedValue === '' ? '' : combinedValue;
            }

            const encryptedInputExts = new Set(getTaggedFormatExts(formatTags.encrypted));
            const umInputPaths = filePaths.filter(path => {
                const ext = getPathExtension(path);
                return encryptedInputExts.has(ext);
            });
            const audioInputPaths = filePaths.filter(path => {
                const ext = getPathExtension(path);
                return formats[ext]?.group === 'audio';
            });

            setConversionMeta({ combine: combineInputs, outputExt, totalCount: filePaths.length });
            setIsConverting(true);
            setTerminalLogs([]);
            navigate('/terminal');

            const result = await invoke('convert_files', {
                inputPaths: filePaths,
                outputExt: outputExt,
                request: { inputGroup, outputGroup, options: finalOptions, combine: combineInputs, umInputPaths, audioInputPaths },
            });

            if (result) {
                showPrompt('success', `${t('prompt.conversion_success')}`);
            } else {
                showPrompt('error', `${t('prompt.conversion_failed')}`);
            }

        } catch (error) {
            console.error('Conversion failed:', error);
            const missingDependencyIds = getMissingDependenciesErrorIds(error);
            if (missingDependencyIds.length > 0) {
                showPrompt('warning', getMissingDependenciesMessage(t, missingDependencyIds));
                return;
            }

            showPrompt('error', `${t('prompt.conversion_unexpected_error')}: ${error}`);
        } finally {
            setIsConverting(false);
        }
    }, [filePaths, fileType, outputExt, advancedOptionValues, selectedVideoCodec, selectedAudioCodec, t]);

    const OUTPUT_CAP = 100_000;

    function capOutput(str) {
        if (str.length <= OUTPUT_CAP) return str;
        const tail = str.slice(str.length - OUTPUT_CAP);
        const nl = tail.indexOf('\n');
        return nl !== -1 ? tail.slice(nl + 1) : tail;
    }

    useEffect(() => {
        const unlisten = listen('conversion-log', (event) => {
            const { file_path, status_message, terminal_output, success } = event.payload;

            setTerminalLogs(prevLogs => {
                const newLogs = [...prevLogs];
                const existingLogIndex = newLogs.findIndex(log => log.path === file_path);

                const existing = existingLogIndex !== -1 ? newLogs[existingLogIndex] : null;
                const newLogData = {
                    messageKey: status_message.key,
                    messageVars: status_message.vars,
                    output: terminal_output !== null
                        ? capOutput((existing?.output ?? "") + terminal_output)
                        : (existing?.output ?? ""),
                    isFinished: success !== null,
                    success: success,
                };

                if (existingLogIndex !== -1) {
                    // Update an existing log entry
                    const updatedLog = { ...newLogs[existingLogIndex], ...newLogData };
                    newLogs[existingLogIndex] = updatedLog;
                    return newLogs;
                } else {
                    // This is a new file being processed
                    return [...newLogs, { path: file_path, isExpanded: false, ...newLogData }];
                }
            });
        });

        return () => {
            unlisten.then(fn => fn());
        };
    }, []);

    const stopConversion = useCallback(() => {
        invoke('stop_conversion').catch(console.error);
    }, []);

    const value = {
        MiddleEllipsis,
        settings, setSettings,
        filePaths, setFilePaths,
        fileType, setFileType,
        outputExt, setOutputExt,
        outputOptions,
        handleFileSelection,
        handleConvert,
        stopConversion,
        terminalLogs, setTerminalLogs,
        isConverting, setIsConverting,
        selectedVideoCodec, setSelectedVideoCodec,
        selectedAudioCodec, setSelectedAudioCodec,
        advancedOptionValues, setAdvancedOptionValues,
        activeTab, setActiveTab,
        conversionMeta,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
