import { useCallback, useEffect, useRef, useState } from 'react';
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open } from '@tauri-apps/plugin-dialog';

import { InformationCircleIcon, MusicalNoteIcon, PaperAirplaneIcon, PhotoIcon, TrashIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import { useApp } from '@/contexts/AppContext';
import { usePrompt } from '@/components/prompt';
import { Alert, AlertActions, AlertBody, AlertDescription, AlertTitle } from '@/components/alert';
import { Button } from '@/components/button';
import DropZone from '@/components/dropzone';
import { Field, Label } from '@/components/fieldset';
import { Listbox, ListboxOption, ListboxHeading, ListboxDivider } from '@/components/listbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';


export default function FileSelection() {
    const { t } = useTranslation();

    const { MiddleEllipsis, filePaths, setFilePaths, fileType, outputExt, setOutputExt, outputOptions, handleFileSelection, handleConvert, isConverting } = useApp();
    const { showPrompt } = usePrompt();

    const [isOverDropZone, setIsOverDropZone] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const dropZoneRef = useRef(null);
    const outputGroups = Object.keys(outputOptions);

    const fileTypeIcons = (type, size) => {
        const iconClass = `h-${size} w-${size} mr-1`;
        const icons = {
            audio: <span className="flex items-center"><MusicalNoteIcon className={iconClass} />{t('file_selection.audio')}</span>,
            video: <span className="flex items-center"><VideoCameraIcon className={iconClass} />{t('file_selection.video')}</span>,
            image: <span className="flex items-center"><PhotoIcon className={iconClass} />{t('file_selection.image')}</span>,
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

                    <Button color="emerald" className="mt-2" disabled={filePaths.length === 0 || isConverting} onClick={() => handleConvert(showPrompt)}>
                        {t('file_selection.convert')}<PaperAirplaneIcon />
                    </Button>
                </div>
            </div>

            <Alert open={alertOpen} onClose={() => setAlertOpen(false)}>
                <AlertTitle>{t('file_selection.files_selected')}</AlertTitle>
                {fileType && (
                    <AlertDescription className="flex items-center">
                        <span className="mr-1">{t('file_selection.current_file_type')}:</span>
                        {fileTypeIcons(fileType, 5)}
                    </AlertDescription>
                )}
                <AlertBody>
                    <Table bleed compact="true">
                        <TableHead>
                            <TableRow>
                                <TableHeader>{t('file_selection.file_path')}</TableHeader>
                                <TableHeader className="w-20 text-center">{t('file_selection.action')}</TableHeader>
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