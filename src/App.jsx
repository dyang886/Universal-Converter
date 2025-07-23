// src/App.jsx
import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { Field, Label } from '@/components/fieldset';
import { Select } from '@/components/select';
import { Button } from '@/components/button';
import DropZone from '@/components/dropzone';
import './App.css';
import { processFiles as processFiles, truncateMiddle } from './format-options';
import { TrashIcon, InformationCircleIcon, PaperAirplaneIcon, MusicalNoteIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/react/16/solid';
import { usePrompt } from '@/components/prompt';
import { Alert, AlertTitle, AlertDescription, AlertBody, AlertActions } from '@/components/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar'


export default function App() {
    const [filePaths, setFilePaths] = useState([]);
    const [fileType, setFileType] = useState('');
    const [outputExt, setOutput] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isOverDropZone, setIsOverDropZone] = useState(false);
    const [outputOptions, setOutputOptions] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);

    const dropZoneRef = useRef(null);
    const { showPrompt } = usePrompt();

    const fileTypeIcons = {
        audio: <span className="flex items-center"><MusicalNoteIcon className="h-5 w-5 mr-1" />Audio</span>,
        video: <span className="flex items-center"><VideoCameraIcon className="h-5 w-5 mr-1" />Video</span>,
        image: <span className="flex items-center"><PhotoIcon className="h-5 w-5 mr-1" />Image</span>,
    }

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
        }, [text]);

        return (
            <span ref={ref} className="block truncate" title={text}>{display}</span>
        );
    }

    useEffect(() => {
        document.documentElement.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const handleFileSelection = useCallback((paths) => {
        if (!paths) return;
        const newPaths = Array.isArray(paths) ? paths : [paths];
        const { newFileType, outputFormats, uniques, duplicates, unsupported, nonMajorType } = processFiles(newPaths, filePaths, fileType);

        duplicates.forEach(p => {
            showPrompt('warning', `Duplicated file: ${truncateMiddle(p)}`);
        });

        unsupported.forEach(p => {
            showPrompt('warning', `Unsupported file: ${truncateMiddle(p)}`);
        });

        nonMajorType.forEach(p => {
            showPrompt('warning', `Please select files from the same type: ${truncateMiddle(p)}`);
        });

        const updated = [...filePaths, ...uniques];
        if (newFileType !== fileType) setFileType(newFileType);
        setFilePaths(updated);
        setOutputOptions(outputFormats);
    }, [filePaths, fileType, showPrompt]);

    const onClick = useCallback(async () => {
        try {
            const selected = await open({
                multiple: true,
                filters: [{ name: 'All Files', extensions: ['*'] }],
            });
            handleFileSelection(selected);
        } catch (error) {
            console.error('Error opening file dialog:', error);
        }
    }, [handleFileSelection]);

    useEffect(() => {
        const webview = getCurrentWebview();
        const dropZoneEl = dropZoneRef.current;

        const listenerPromise = webview.onDragDropEvent(event => {
            const physX = event.payload.position.x;
            const physY = event.payload.position.y;
            const dpr = window.devicePixelRatio || 1;
            const cssX = physX / dpr;
            const cssY = physY / dpr;
            const hovered = document.elementFromPoint(cssX, cssY);
            const isOver = dropZoneEl.contains(hovered);

            if (event.payload.type === 'over') {
                setIsOverDropZone(isOver);
            } else if (event.payload.type === 'drop' && isOver) {
                handleFileSelection(event.payload.paths);
                setIsOverDropZone(false);
            } else if (event.payload.type === 'cancel') {
                setIsOverDropZone(false);
            }
        });

        return () => {
            listenerPromise.then(unlisten => unlisten());
        };
    }, [handleFileSelection]);

    const showAllFiles = useCallback(() => {
        if (!filePaths.length) return;
        setAlertOpen(true);
    }, [filePaths]);

    useEffect(() => {
        if (!filePaths.length) setFileType('');
    }, [filePaths]);

    const handleConvert = async () => {
        try {
            const advancedOptions = {
                test: null, // Placeholder
            };

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
    };

    return (
        <div className="main-container bg-white dark:bg-zinc-900 dark:text-gray-100 min-h-screen relative flex flex-col items-center p-8 pt-3">
            {/* <button
                className="absolute top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
                onClick={() => setDarkMode(d => !d)}
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button> */}

            <Navbar className="self-stretch">
                <NavbarSection>
                    <NavbarItem href="/">File Selection</NavbarItem>
                    <NavbarItem href="/events">Advanced Options</NavbarItem>
                    <NavbarItem href="/orders">Terminal Output</NavbarItem>
                </NavbarSection>
            </Navbar>

            <div className='w-96 flex grow items-center justify-center'>
                <div className='dropzone-container flex flex-col gap-5'>
                    <DropZone ref={dropZoneRef} isOverDropZone={isOverDropZone} onClick={onClick}>
                        {filePaths.length === 0
                            ? 'Drop/Select files here'
                            : <span className="inline-flex items-center">
                                <span className='mr-3'>
                                    {filePaths.length} file{filePaths.length > 1 ? 's' : ''}
                                </span>
                                <InformationCircleIcon className="h-5 w-5 mr-1 text-blue-400 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation();
                                        showAllFiles();
                                    }}
                                />
                                <TrashIcon className="h-5 w-5 text-red-400 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setFilePaths([]);
                                    }}
                                />
                            </span>
                        }
                    </DropZone>

                    <Field>
                        <Label>Output Format</Label>
                        <Select name="output-format" value={outputExt} onChange={e => setOutput(e.target.value)} disabled={filePaths.length === 0}>
                            {filePaths.length === 0
                                ? <option value="">No Files Selected</option>
                                : outputOptions.map(ext => (
                                    <option key={ext} value={ext}>
                                        .{ext}
                                    </option>
                                ))
                            }
                        </Select>
                    </Field>

                    <Button color="emerald" className="mt-2" disabled={filePaths.length === 0} onClick={handleConvert}>Convert<PaperAirplaneIcon /></Button>
                </div>
            </div>

            <Alert open={alertOpen} onClose={() => setAlertOpen(false)}>
                <AlertTitle>Files Selected</AlertTitle>
                {fileType ? (
                    <AlertDescription className="flex items-center">
                        <span className="mr-1">Current File Type:</span>
                        {fileTypeIcons[fileType]}
                    </AlertDescription>
                ) : null}
                <AlertBody>
                    <Table bleed compact="true">
                        <TableHead>
                            <TableRow>
                                <TableHeader>File Path</TableHeader>
                                <TableHeader>Action</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filePaths.map(file => (
                                <TableRow key={file}>
                                    <TableCell className="max-w-xs" title={file}>
                                        <MiddleEllipsis text={file} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <TrashIcon
                                            className="h-5 w-5 text-red-400 cursor-pointer inline-block"
                                            onClick={() => {
                                                setFilePaths(fp => fp.filter(f => f !== file));
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AlertBody>
                <AlertActions>
                    <Button onClick={() => setAlertOpen(false)}>OK</Button>
                </AlertActions>
            </Alert>
        </div>
    );
}
