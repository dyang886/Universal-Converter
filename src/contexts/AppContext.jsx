import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { useTranslation } from 'react-i18next';

import { processFiles, truncateMiddle } from '@/contexts/format-options';
import i18n from '@/contexts/i18n';


const AppContext = createContext(null);

export function AppProvider({ children }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [filePaths, setFilePaths] = useState([]);
    const [fileType, setFileType] = useState('');
    const [outputExt, setOutputExt] = useState('');
    const [outputOptions, setOutputOptions] = useState([]);
    const [settings, setSettings] = useState(null);
    const [terminalLogs, setTerminalLogs] = useState([]);

    // Text truncation
    function MiddleEllipsis({ text }) {
        const ref = useRef(null);
        const [display, setDisplay] = useState(text);

        useLayoutEffect(() => {
            const el = ref.current;
            if (!el) return;
            const style = window.getComputedStyle(el);
            const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = font;
            const available = el.offsetWidth;
            if (ctx.measureText(text).width <= available) {
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
                if (ctx.measureText(candidate).width <= available) {
                    best = candidate;
                    low = mid + 1;
                } else {
                    high = mid;
                }
            }
            setDisplay(best);
        }, [text, ref.current?.offsetWidth]);

        return (
            <span ref={ref} className="block truncate" title={text}>{display}</span>
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

        const updated = [...filePaths, ...uniques];
        if (newFileType !== fileType) setFileType(newFileType);
        setFilePaths(updated);
        setOutputOptions(outputFormats);
        if (outputFormats.length > 0 && !outputFormats.includes(outputExt)) {
            setOutputExt(outputFormats[0]);
        }
    }, [filePaths, fileType, outputExt]);

    const handleConvert = useCallback(async (showPrompt) => {
        try {
            const advancedOptions = {
                options: {
                    // "-v": "quiet", // Your actual options go inside this nested object
                    // Add other future options here, e.g., "-crf": "23"
                }
            };

            setTerminalLogs([]);
            navigate('/terminal');

            const result = await invoke('convert_files', {
                inputPaths: filePaths,
                outputExt: outputExt,
                options: advancedOptions,
            });

            if (result) {
                showPrompt('success', `${t('prompt.conversion_success')}`);
            } else {
                showPrompt('error', `${t('prompt.conversion_failed')}`);
            }
        } catch (error) {
            console.error('Conversion failed:', error);
            showPrompt('error', `${t('prompt.conversion_unexpected_error')}: ${error}`);
        }
    }, [filePaths, outputExt]);

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
        settings,
        setSettings,
        filePaths,
        setFilePaths,
        fileType,
        setFileType,
        outputExt,
        setOutputExt,
        outputOptions,
        handleFileSelection,
        handleConvert,
        terminalLogs,
        setTerminalLogs
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