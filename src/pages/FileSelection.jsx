import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

import { ArrowLeftIcon, DocumentMagnifyingGlassIcon, DocumentTextIcon, InformationCircleIcon, MusicalNoteIcon, PaperAirplaneIcon, PhotoIcon, StopIcon, TrashIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import { useApp } from '@/contexts/AppContext';
import { usePrompt } from '@/components/prompt';
import { Alert, AlertActions, AlertBody, AlertDescription, AlertTitle } from '@/components/alert';
import { Button } from '@/components/button';
import DropZone from '@/components/dropzone';
import { Field, Label } from '@/components/fieldset';
import { Listbox, ListboxOption, ListboxHeading, ListboxDivider } from '@/components/listbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';


function fileNameFromPath(path) {
    return path.split(/[\\/]/).pop() || path;
}

function groupMetadataTags(tags = []) {
    return tags.reduce((groups, tag) => {
        if (!groups.has(tag.group)) {
            groups.set(tag.group, []);
        }
        groups.get(tag.group).push(tag);
        return groups;
    }, new Map());
}

function MetadataView({ filePath, metadata, isLoading, error, onBack, MiddleEllipsis }) {
    const { t } = useTranslation();
    const groupedTags = groupMetadataTags(metadata?.tags || []);

    return (
        <>
            <div className="mb-4 flex items-center gap-3">
                <Button plain onClick={onBack} aria-label={t('metadata.back')}>
                    <ArrowLeftIcon data-slot="icon" />
                    {t('metadata.back')}
                </Button>
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-950 dark:text-white">{fileNameFromPath(filePath)}</div>
                    <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <MiddleEllipsis text={filePath} />
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="flex h-48 items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    {t('metadata.loading')}
                </div>
            )}

            {!isLoading && error && (
                <div className="rounded-lg border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    {t('metadata.load_failed')}: {error}
                </div>
            )}

            {!isLoading && !error && groupedTags.size === 0 && (
                <div className="flex h-48 items-center justify-center rounded-lg border border-zinc-950/10 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400">
                    {t('metadata.no_metadata')}
                </div>
            )}

            {!isLoading && !error && groupedTags.size > 0 && (
                <div className="max-h-[60vh] overflow-auto rounded-lg border border-zinc-950/10 dark:border-white/10">
                    <table className="min-w-full text-left text-sm text-zinc-950 dark:text-white">
                        <thead className="sticky top-0 bg-zinc-50 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                            <tr>
                                <th className="w-56 border-b border-zinc-950/10 px-3 py-2 font-medium dark:border-white/10">{t('metadata.tag')}</th>
                                <th className="border-b border-zinc-950/10 px-3 py-2 font-medium dark:border-white/10">{t('metadata.value')}</th>
                            </tr>
                        </thead>
                        {Array.from(groupedTags.entries()).map(([group, tags]) => (
                            <tbody key={group}>
                                <tr className="bg-zinc-950/[2.5%] dark:bg-white/[4%]">
                                    <th colSpan={2} className="px-3 py-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
                                        {group}
                                    </th>
                                </tr>
                                {tags.map((tag, index) => (
                                    <tr key={`${group}:${tag.name}:${index}`}>
                                        <td className="w-56 border-t border-zinc-950/5 px-3 py-2 align-top font-medium text-zinc-700 dark:border-white/5 dark:text-zinc-300">
                                            {tag.name}
                                        </td>
                                        <td className="max-w-0 whitespace-normal break-words border-t border-zinc-950/5 px-3 py-2 align-top text-zinc-600 dark:border-white/5 dark:text-zinc-300">
                                            {tag.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ))}
                    </table>
                </div>
            )}
        </>
    );
}

export default function FileSelection() {
    const { t } = useTranslation();

    const { MiddleEllipsis, filePaths, setFilePaths, fileType, outputExt, setOutputExt, outputOptions, handleFileSelection, handleConvert, stopConversion, isConverting } = useApp();
    const { showPrompt } = usePrompt();

    const [isOverDropZone, setIsOverDropZone] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [metadataFile, setMetadataFile] = useState('');
    const [metadata, setMetadata] = useState(null);
    const [metadataError, setMetadataError] = useState('');
    const [metadataLoading, setMetadataLoading] = useState(false);
    const dropZoneRef = useRef(null);
    const metadataRequestIdRef = useRef(0);
    const outputGroups = Object.keys(outputOptions);

    const fileTypeIcons = (type, size) => {
        const iconClass = `h-${size} w-${size} mr-1`;
        const icons = {
            audio: <span className="flex items-center"><MusicalNoteIcon className={iconClass} />{t('file_selection.audio')}</span>,
            video: <span className="flex items-center"><VideoCameraIcon className={iconClass} />{t('file_selection.video')}</span>,
            image: <span className="flex items-center"><PhotoIcon className={iconClass} />{t('file_selection.image')}</span>,
            document: <span className="flex items-center"><DocumentTextIcon className={iconClass} />{t('file_selection.document')}</span>,
        };
        return icons[type] || null;
    };

    const dropZoneOnClick = useCallback(async () => {
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

    const resetMetadataView = useCallback(() => {
        metadataRequestIdRef.current += 1;
        setMetadataFile('');
        setMetadata(null);
        setMetadataError('');
        setMetadataLoading(false);
    }, []);

    const closeFileAlert = useCallback(() => {
        setAlertOpen(false);
        resetMetadataView();
    }, [resetMetadataView]);

    const openMetadataView = useCallback(async (file) => {
        const requestId = metadataRequestIdRef.current + 1;
        metadataRequestIdRef.current = requestId;

        setMetadataFile(file);
        setMetadata(null);
        setMetadataError('');
        setMetadataLoading(true);

        try {
            const result = await invoke('get_file_metadata', { filePath: file });
            if (metadataRequestIdRef.current === requestId) {
                setMetadata(result);
            }
        } catch (error) {
            if (metadataRequestIdRef.current === requestId) {
                setMetadataError(String(error));
            }
        } finally {
            if (metadataRequestIdRef.current === requestId) {
                setMetadataLoading(false);
            }
        }
    }, []);

    return (
        <>
            <div className='w-96 flex grow items-center justify-center mb-10'>
                <div className='dropzone-container flex flex-col gap-5'>
                    <DropZone ref={dropZoneRef} isOverDropZone={isOverDropZone} onClick={dropZoneOnClick}>
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

                    <Field disabled={filePaths.length === 0}>
                        <Label>{t('file_selection.output_format')}</Label>
                        <Listbox className="mt-1" value={outputExt} onChange={setOutputExt} placeholder={t('file_selection.no_files_selected')}>
                            {outputGroups.map((groupName, index) => (
                                <Field key={groupName}>
                                    <ListboxHeading>{fileTypeIcons(groupName, 4)}</ListboxHeading>
                                    {outputOptions[groupName].map(ext => (
                                        <ListboxOption key={ext} value={ext}>.{ext}</ListboxOption>
                                    ))}
                                    {index < outputGroups.length - 1 && <ListboxDivider />}
                                </Field>
                            ))}
                        </Listbox>
                    </Field>

                    <div className="relative mt-2">
                        <Button
                            color="emerald"
                            className={`w-full transition-opacity duration-150 ${isConverting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            disabled={filePaths.length === 0}
                            onClick={() => handleConvert(showPrompt)}
                        >
                            {t('file_selection.convert')}<PaperAirplaneIcon />
                        </Button>
                        <div className={`absolute inset-0 transition-opacity duration-150 ${isConverting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <Button color="red" className="w-full h-full" onClick={stopConversion}>
                                {t('file_selection.stop')}<StopIcon />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Alert size={metadataFile ? '5xl' : '2xl'} open={alertOpen} onClose={closeFileAlert}>
                <AlertTitle>{metadataFile ? t('metadata.title') : t('file_selection.files_selected')}</AlertTitle>
                {!metadataFile && fileType && (
                    <AlertDescription className="flex items-center">
                        <span className="mr-1">{t('file_selection.current_file_type')}:</span>
                        {fileTypeIcons(fileType, 5)}
                    </AlertDescription>
                )}
                <AlertBody>
                    {metadataFile ? (
                        <MetadataView
                            filePath={metadataFile}
                            metadata={metadata}
                            isLoading={metadataLoading}
                            error={metadataError}
                            onBack={resetMetadataView}
                            MiddleEllipsis={MiddleEllipsis}
                        />
                    ) : (
                        <Table bleed dense>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>{t('file_selection.file_path')}</TableHeader>
                                    <TableHeader className="w-24 text-center">{t('file_selection.action')}</TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filePaths.map(file => (
                                    <TableRow key={file}>
                                        <TableCell className="max-w-xs" title={file}>
                                            <MiddleEllipsis text={file} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="inline-flex items-center gap-2">
                                                <DocumentMagnifyingGlassIcon
                                                    className="h-5 w-5 cursor-pointer text-blue-400 hover:text-blue-500"
                                                    title={t('metadata.view')}
                                                    onClick={() => openMetadataView(file)}
                                                />
                                                <TrashIcon
                                                    className="h-5 w-5 cursor-pointer text-red-400 hover:text-red-500"
                                                    title={t('file_selection.remove_file')}
                                                    onClick={() => setFilePaths(fp => fp.filter(f => f !== file))}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </AlertBody>
                <AlertActions>
                    <Button onClick={closeFileAlert}>OK</Button>
                </AlertActions>
            </Alert>
        </>
    );
}
