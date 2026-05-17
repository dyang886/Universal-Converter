import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    StopCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { routingConfig } from '@/contexts/conversion-routing';


function dependencyRows(statuses) {
    const statusById = new Map(statuses.map(status => [status.id, status]));

    return Object.entries(routingConfig.packs)
        .map(([id, pack]) => ({ id, pack, status: statusById.get(id) }))
        .sort((a, b) => a.pack.name.localeCompare(b.pack.name));
}

function formatBytes(bytes) {
    if (!bytes) return '0 MB';
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function VersionText({ status }) {
    const { t } = useTranslation();

    if (!status) return t('dependencies.checking');
    if (!status.installed) return t('dependencies.not_installed');
    if (status.updateAvailable && status.latestVersion) {
        return `${status.installedVersion} -> ${status.latestVersion}`;
    }
    return t('dependencies.current_version', { version: status.installedVersion || t('dependencies.unknown') });
}

function StatusMark({ status }) {
    const { t } = useTranslation();

    if (!status) {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                <ClockIcon className="h-5 w-5 animate-pulse" />
                {t('dependencies.checking')}
            </span>
        );
    }

    if (status.updateAvailable) {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 dark:text-blue-300">
                <ArrowDownTrayIcon className="h-5 w-5" />
                {t('dependencies.update_available')}
            </span>
        );
    }

    if (status.installed) {
        return (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircleIcon className="h-5 w-5" />
                {t('dependencies.installed')}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
            <ExclamationTriangleIcon className="h-5 w-5" />
            {t('dependencies.missing')}
        </span>
    );
}

function DependencyRow({ row, progress, busy, onDownload, onCancel }) {
    const { t } = useTranslation();
    const { id, pack, status } = row;
    const isChecking = !status;
    const installed = status?.installed ?? false;
    const updateAvailable = status?.updateAvailable ?? false;
    const isBusy = busy === id;
    const canDownload = !busy && !isChecking && (!installed || updateAvailable);
    const actionLabel = updateAvailable ? t('dependencies.update') : t('dependencies.install');

    return (
        <section className="rounded-lg border border-zinc-950/10 bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h2 className="text-base font-semibold text-zinc-950 dark:text-white">{pack.name}</h2>
                        <StatusMark status={status} />
                    </div>
                    <p className={clsx(
                        'mt-1 text-sm',
                        updateAvailable ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-500 dark:text-zinc-400'
                    )}>
                        <VersionText status={status} />
                    </p>
                    <p className="mt-1 max-w-xl truncate text-xs text-zinc-400 dark:text-zinc-500" title={status?.installPath || pack.rootDir}>
                        {t('dependencies.location')}: {status?.installPath || pack.rootDir}
                    </p>
                </div>

                {isBusy ? (
                    <Button outline onClick={onCancel}>
                        <StopCircleIcon data-slot="icon" />
                        {t('dependencies.cancel')}
                    </Button>
                ) : (
                    <Button onClick={() => onDownload(id)} disabled={!canDownload}>
                        <ArrowDownTrayIcon data-slot="icon" />
                        {actionLabel}
                    </Button>
                )}
            </div>

            {progress && progress.state !== 'complete' && (
                <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{t(`dependencies.states.${progress.state}`, { defaultValue: progress.state })}</span>
                        <span>
                            {formatBytes(progress.downloadedBytes)} / {formatBytes(progress.totalBytes)}
                        </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-zinc-950/10 dark:bg-white/10">
                        <div
                            className="h-full rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
                            style={{ width: `${Math.max(0, Math.min(1, progress.progress || 0)) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default function DependenciesPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [statuses, setStatuses] = useState([]);
    const [isLocalLoading, setIsLocalLoading] = useState(true);
    const [isUpdateChecking, setIsUpdateChecking] = useState(false);
    const [busyPackId, setBusyPackId] = useState('');
    const [progressByPack, setProgressByPack] = useState({});
    const [message, setMessage] = useState(null);
    const downloadInFlightRef = useRef(false);

    const rows = useMemo(() => dependencyRows(statuses), [statuses]);

    const loadLocalStatuses = useCallback(async () => {
        setIsLocalLoading(true);
        try {
            setStatuses(await invoke('get_dependency_statuses'));
        } catch (error) {
            console.error('Failed to load dependency statuses:', error);
            setMessage({ type: 'error', text: `${t('dependencies.status_failed')}: ${error}` });
        } finally {
            setIsLocalLoading(false);
        }
    }, [t]);

    const checkUpdates = useCallback(async () => {
        setIsUpdateChecking(true);
        try {
            setStatuses(await invoke('check_dependency_updates'));
        } catch (error) {
            console.error('Failed to check dependency updates:', error);
        } finally {
            setIsUpdateChecking(false);
        }
    }, []);

    const refreshAll = useCallback(async () => {
        setMessage(null);
        await loadLocalStatuses();
        checkUpdates();
    }, [checkUpdates, loadLocalStatuses]);

    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    useEffect(() => {
        const unlisten = listen('dependency-progress', (event) => {
            const progress = event.payload;
            setProgressByPack(prev => ({ ...prev, [progress.packId]: progress }));
        });

        return () => {
            unlisten.then(fn => fn());
        };
    }, []);

    const handleDownload = async (packId) => {
        if (downloadInFlightRef.current) return;

        downloadInFlightRef.current = true;
        setBusyPackId(packId);
        setMessage(null);
        setProgressByPack(prev => ({
            ...prev,
            [packId]: {
                packId,
                state: 'requesting-url',
                progress: 0,
                downloadedBytes: 0,
                totalBytes: 0,
                speedBytesPerSec: 0,
            },
        }));

        try {
            const updatedStatus = await invoke('download_dependency_pack', { packId });
            setStatuses(prev => prev.map(status => (status.id === updatedStatus.id ? updatedStatus : status)));
            setMessage({ type: 'success', text: t('dependencies.install_success', { name: updatedStatus.name }) });
        } catch (error) {
            const text = String(error);
            if (text === 'cancelled') {
                setMessage({ type: 'warning', text: t('dependencies.cancelled') });
            } else if (text.startsWith('elevation_required:')) {
                setMessage({ type: 'error', text: t('dependencies.elevation_required') });
            } else {
                setMessage({ type: 'error', text: `${t('dependencies.install_failed')}: ${text}` });
            }
        } finally {
            downloadInFlightRef.current = false;
            setProgressByPack(prev => {
                const next = { ...prev };
                delete next[packId];
                return next;
            });
            setBusyPackId('');
            await loadLocalStatuses();
            checkUpdates();
        }
    };

    const handleCancel = async () => {
        try {
            await invoke('cancel_dependency_download');
        } catch (error) {
            console.error('Failed to cancel dependency download:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-8 pt-5 dark:bg-zinc-900">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{t('dependencies.title')}</h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t('dependencies.subtitle')}</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="rounded-full p-2 transition-colors hover:bg-zinc-950/5 dark:hover:bg-white/5"
                    aria-label="Close page"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pt-6">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            {isUpdateChecking ? t('dependencies.checking_updates') : t('dependencies.pack_count', { count: rows.length })}
                        </p>
                        <Button outline onClick={refreshAll} disabled={isLocalLoading || isUpdateChecking || Boolean(busyPackId)}>
                            <ArrowPathIcon data-slot="icon" className={clsx((isLocalLoading || isUpdateChecking) && 'animate-spin')} />
                            {t('dependencies.refresh')}
                        </Button>
                    </div>

                    {message && (
                        <div
                            className={clsx(
                                'mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm',
                                message.type === 'success'
                                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                    : message.type === 'warning'
                                        ? 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                        : 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300'
                            )}
                        >
                            {message.type === 'success' ? <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" /> : <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    <div className="grid gap-3">
                        {rows.map(row => (
                            <DependencyRow
                                key={row.id}
                                row={isLocalLoading ? { ...row, status: null } : row}
                                progress={progressByPack[row.id]}
                                busy={busyPackId}
                                onDownload={handleDownload}
                                onCancel={handleCancel}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
