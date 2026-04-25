import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { useTranslation } from 'react-i18next';

import { formats, widgetDefinitions, processFiles, truncateMiddle } from '@/contexts/format-options';
import i18n from '@/contexts/i18n';


const AppContext = createContext(null);

export function AppProvider({ children }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
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

    useEffect(() => {
        const initializeApp = async () => {
            try {
                const loadedSettings = await invoke('load_settings');
                setSettings(loadedSettings);

                if (loadedSettings.language) {
                    await i18n.changeLanguage(loadedSettings.language);
                }

                document.documentElement.classList.toggle('dark', loadedSettings.theme === 'dark');

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
            const config = formats[outputExt] || {};
            const videoCodecInfo = config.videoCodecs?.[selectedVideoCodec];
            const audioCodecInfo = config.audioCodecs?.[selectedAudioCodec] || config.codecs?.[selectedAudioCodec];

            const combineInputs = advancedOptionValues['combine_inputs'] === true;

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

            const finalOptions = {};
            if (selectedVideoCodec && videoCodecInfo) {
                finalOptions['-c:v'] = videoCodecInfo.value;
            }
            if (selectedAudioCodec && audioCodecInfo) {
                finalOptions['-c:a'] = audioCodecInfo.value;
            }

            for (const arg in groupedArgs) {
                const combinedValue = groupedArgs[arg].filter(v => v !== '').join(',');
                finalOptions[arg] = combinedValue === '' ? '' : combinedValue;
            }

            setConversionMeta({ combine: combineInputs, outputExt, totalCount: filePaths.length });
            setIsConverting(true);
            setTerminalLogs([]);
            navigate('/terminal');

            const result = await invoke('convert_files', {
                inputPaths: filePaths,
                outputExt: outputExt,
                request: { tool: config['tool'], options: finalOptions, combine: combineInputs },
            });

            if (result) {
                showPrompt('success', `${t('prompt.conversion_success')}`);
            } else {
                showPrompt('error', `${t('prompt.conversion_failed')}`);
            }

        } catch (error) {
            console.error('Conversion failed:', error);
            showPrompt('error', `${t('prompt.conversion_unexpected_error')}: ${error}`);
        } finally {
            setIsConverting(false);
        }
    }, [filePaths, outputExt, advancedOptionValues, selectedVideoCodec, selectedAudioCodec]);

    useEffect(() => {
        const unlisten = listen('conversion-log', (event) => {
            const { file_path, status_message, terminal_output, success } = event.payload;

            setTerminalLogs(prevLogs => {
                const newLogs = [...prevLogs];
                const existingLogIndex = newLogs.findIndex(log => log.path === file_path);

                const newLogData = {
                    messageKey: status_message.key,
                    messageVars: status_message.vars,
                    output: terminal_output ? terminal_output : "",
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

    const value = {
        MiddleEllipsis,
        settings, setSettings,
        filePaths, setFilePaths,
        fileType, setFileType,
        outputExt, setOutputExt,
        outputOptions,
        handleFileSelection,
        handleConvert,
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
