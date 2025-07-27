import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

import { useTranslation } from 'react-i18next';

import { processFiles, truncateMiddle } from '@/contexts/format-options';
import i18n from '@/contexts/i18n';


const AppContext = createContext(null);

export function AppProvider({ children }) {
    const { t } = useTranslation();
    const [filePaths, setFilePaths] = useState([]);
    const [fileType, setFileType] = useState('');
    const [outputExt, setOutputExt] = useState('');
    const [outputOptions, setOutputOptions] = useState([]);
    const [settings, setSettings] = useState(null);

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
    }, [filePaths, fileType]);

    const handleConvert = useCallback(async (showPrompt) => {
        try {
            const advancedOptions = {
                options: {
                    "-v": "quiet", // Your actual options go inside this nested object
                    // Add other future options here, e.g., "-crf": "23"
                }
            };
            const results = await invoke('convert_files', {
                inputPaths: filePaths,
                outputExt: outputExt,
                options: advancedOptions,
            });

            for (const status of results) {
                if (status.success) {
                    showPrompt('success', `${t('prompt.converted')}: ${truncateMiddle(status.path)}`);
                } else {
                    showPrompt('error', `${t('prompt.failed')}: ${truncateMiddle(status.path)} - ${status.message}`);
                }
            }
        } catch (error) {
            console.error('Conversion failed:', error);
            showPrompt('error', `${t('prompt.conversion_failed')}: ${error}`);
        }
    }, [filePaths, outputExt]);

    const value = {
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