import { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { usePrompt } from '@/components/prompt';
import { useTranslation } from 'react-i18next';
import { open } from '@tauri-apps/plugin-dialog';
import { getCurrentWebview } from "@tauri-apps/api/webview";

import { Field, Label } from '@/components/fieldset';
import { Select } from '@/components/select';
import { Button } from '@/components/button';
import DropZone from '@/components/dropzone';
import { Alert, AlertTitle, AlertDescription, AlertBody, AlertActions } from '@/components/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { TrashIcon, InformationCircleIcon, PaperAirplaneIcon, MusicalNoteIcon, VideoCameraIcon, PhotoIcon } from '@heroicons/react/24/solid';

// Helper component for text truncation
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

export default function FileSelection() {
    const { t } = useTranslation();

    const {
        filePaths, setFilePaths, fileType, setFileType,
        outputExt, setOutputExt, outputOptions,
        handleFileSelection, handleConvert
    } = useApp();
    const { showPrompt } = usePrompt();

    const [isOverDropZone, setIsOverDropZone] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const dropZoneRef = useRef(null);

    const fileTypeIcons = {
        audio: <span className="flex items-center"><MusicalNoteIcon className="h-5 w-5 mr-1" />{t('file_selection.audio')}</span>,
        video: <span className="flex items-center"><VideoCameraIcon className="h-5 w-5 mr-1" />{t('file_selection.video')}</span>,
        image: <span className="flex items-center"><PhotoIcon className="h-5 w-5 mr-1" />{t('file_selection.image')}</span>,
    };

    // Clear file type if all files are removed
    useEffect(() => {
        if (filePaths.length === 0) {
            setFileType('');
        }
    }, [filePaths, setFileType]);

    const onClick = useCallback(async () => {
        try {
            const selected = await open({
                multiple: true,
                filters: [{ name: t('file_selection.all_files'), extensions: ['*'] }],
            });
            handleFileSelection(selected, showPrompt);
        } catch (error) {
            console.error('Error opening file dialog:', error);
        }
    }, [handleFileSelection, showPrompt]);

    // Drag and Drop listener
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
                handleFileSelection(event.payload.paths, showPrompt);
                setIsOverDropZone(false);
            } else if (event.payload.type === 'cancel') {
                setIsOverDropZone(false);
            }
        });

        return () => {
            listenerPromise.then(unlisten => unlisten());
        };
    }, [handleFileSelection]);

    return (
        <>
            <div className='w-96 flex grow items-center justify-center'>
                <div className='dropzone-container flex flex-col gap-5'>
                    <DropZone ref={dropZoneRef} isOverDropZone={isOverDropZone} onClick={onClick}>
                        {filePaths.length === 0
                            ? t('file_selection.drop_files_here')
                            : <span className="inline-flex items-center">
                                <span className='mr-3'>
                                    {filePaths.length} {t('file_selection.files')}
                                </span>
                                <InformationCircleIcon className="h-5 w-5 mr-1 text-blue-400 cursor-pointer"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setAlertOpen(true);
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
                        <Label>{t('file_selection.output_format')}</Label>
                        <Select name="output-format" value={outputExt} onChange={e => setOutputExt(e.target.value)} disabled={filePaths.length === 0}>
                            {filePaths.length === 0
                                ? <option value="">{t('file_selection.no_files_selected')}</option>
                                : outputOptions.map(ext => (
                                    <option key={ext} value={ext}>.{ext}</option>
                                ))
                            }
                        </Select>
                    </Field>

                    <Button color="emerald" className="mt-2" disabled={filePaths.length === 0} onClick={() => handleConvert(showPrompt)}>
                        {t('file_selection.convert')}<PaperAirplaneIcon />
                    </Button>
                </div>
            </div>

            <Alert open={alertOpen} onClose={() => setAlertOpen(false)}>
                <AlertTitle>{t('file_selection.files_selected')}</AlertTitle>
                {fileType && (
                    <AlertDescription className="flex items-center">
                        <span className="mr-1">{t('file_selection.current_file_type')}:</span>
                        {fileTypeIcons[fileType]}
                    </AlertDescription>
                )}
                <AlertBody>
                    <Table bleed compact="true">
                        <TableHead>
                            <TableRow>
                                <TableHeader>{t('file_selection.file_path')}</TableHeader>
                                <TableHeader>{t('file_selection.action')}</TableHeader>
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
                                            onClick={() => setFilePaths(fp => fp.filter(f => f !== file))}
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
        </>
    );
}