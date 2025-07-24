import { createContext, useState, useContext, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { processFiles, truncateMiddle } from './format-options';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [filePaths, setFilePaths] = useState([]);
    const [fileType, setFileType] = useState('');
    const [outputExt, setOutputExt] = useState('');
    const [outputOptions, setOutputOptions] = useState([]);

    // You can add state for advanced options and terminal output here later
    // const [advancedOptions, setAdvancedOptions] = useState({});
    // const [terminalLogs, setTerminalLogs] = useState([]);

    // useEffect(() => {
    //     document.documentElement.classList.toggle('dark', darkMode);
    // }, [darkMode]);

    const handleFileSelection = useCallback((paths, showPrompt) => {
        if (!paths || paths.length === 0) return;
        const newPaths = Array.isArray(paths) ? paths : [paths];
        const { newFileType, outputFormats, uniques, duplicates, unsupported, nonMajorType } = processFiles(newPaths, filePaths, fileType);

        // Use the passed-in showPrompt function
        duplicates.forEach(p => showPrompt('warning', `Duplicated file: ${truncateMiddle(p)}`));
        unsupported.forEach(p => showPrompt('warning', `Unsupported file: ${truncateMiddle(p)}`));
        nonMajorType.forEach(p => showPrompt('warning', `Please select files from the same type: ${truncateMiddle(p)}`));

        const updated = [...filePaths, ...uniques];
        if (newFileType !== fileType) setFileType(newFileType);
        setFilePaths(updated);
        setOutputOptions(outputFormats);
    }, [filePaths, fileType]);

    const handleConvert = useCallback(async (showPrompt) => {
        try {
            const advancedOptions = { test: null }; // Placeholder
            const results = await invoke('convert_files', {
                inputPaths: filePaths,
                outputExt: outputExt,
                options: advancedOptions,
            });

            for (const status of results) {
                if (status.success) {
                    showPrompt('success', `Converted: ${truncateMiddle(status.path)}`);
                } else {
                    showPrompt('error', `Failed: ${truncateMiddle(status.path)} - ${status.message}`);
                }
            }
        } catch (error) {
            console.error('Conversion failed:', error);
            showPrompt('error', `Conversion failed: ${error}`);
        }
    }, [filePaths, outputExt]);

    const value = {
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