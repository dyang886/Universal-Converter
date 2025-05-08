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
import { getPossibleOutputFormats, filterPaths, truncateMiddle } from './format-options';
import { TrashIcon, InformationCircleIcon, PaperAirplaneIcon } from '@heroicons/react/16/solid';
import { usePrompt } from '@/components/prompt';
import { Alert, AlertTitle, AlertBody, AlertActions } from '@/components/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';


export default function App() {
    const [filePaths, setFilePaths] = useState([]);
    const [fileExt, setOutput] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [isOverDropZone, setIsOverDropZone] = useState(false);
    const [outputOptions, setOutputOptions] = useState([]);
    const [alertOpen, setAlertOpen] = useState(false);

    const dropZoneRef = useRef(null);
    const { showPrompt } = usePrompt();

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
        const { uniques, duplicates, unsupported } = filterPaths(newPaths, filePaths);

        duplicates.forEach(p => {
            showPrompt('warning', `Duplicated file: ${truncateMiddle(p)}`);
        });

        unsupported.forEach(p => {
            showPrompt('warning', `Unsupported file: ${truncateMiddle(p)}`);
        });

        const updated = [...filePaths, ...uniques];
        setFilePaths(updated);
        setOutputOptions(getPossibleOutputFormats(updated));
    }, [filePaths, showPrompt]);

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

    return (
        <div className="main-container bg-white dark:bg-zinc-900 dark:text-gray-100 min-h-screen relative flex gap-8 p-8">
            <button
                className="absolute top-4 right-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded"
                onClick={() => setDarkMode(d => !d)}
            >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div className='left-container w-96 flex items-center justify-center'>
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
                        <Select name="output-format" value={fileExt} onChange={e => setOutput(e.target.value)} disabled={filePaths.length === 0}>
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

                    <Button color="emerald" className="mt-2" disabled={filePaths.length === 0} onClick={() => showPrompt('success', "shit happens")}>Convert<PaperAirplaneIcon /></Button>
                </div>
            </div>

            <div className="right-container flex flex-col flex-1 space-y-6">
                <Field>
                    <Label>Project status</Label>
                    <Select
                        name="status"
                        value={fileExt}
                        onChange={e => setOutput(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="delayed">Delayed</option>
                        <option value="canceled">Canceled</option>
                    </Select>
                </Field>
            </div>

            <Alert open={alertOpen} onClose={() => setAlertOpen(false)}>
                <AlertTitle>Files Selected</AlertTitle>
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
                                                setFilePaths(fp => fp.filter(f => f !== file))
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
