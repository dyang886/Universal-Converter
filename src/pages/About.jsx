import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVersion } from '@tauri-apps/api/app';
import { invoke } from '@tauri-apps/api/core';
import { openUrl } from '@tauri-apps/plugin-opener';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import AppLogo from '../../assets/logo.png';
import { Button } from '@/components/button';
import { useApp } from '@/contexts/AppContext';


export default function AboutPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { settings } = useApp();
    const [currentVersion, setCurrentVersion] = useState('');
    const [latestVersion, setLatestVersion] = useState(t('about.loading'));
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        getVersion().then(localVersion => {
            setCurrentVersion(localVersion);

            invoke('check_for_updates', { appName: 'UCT' })
                .then((versionFromServer) => {
                    setLatestVersion(versionFromServer);

                    if (versionFromServer > localVersion) {
                        setUpdateAvailable(true);
                    }
                })
                .catch((err) => {
                    console.error("Error checking for updates:", err);
                    setLatestVersion(t('about.load_failed'));
                });
        }).catch((err) => {
            console.error("Error getting local version:", err);
            setCurrentVersion(t('about.load_failed'));
        });

    }, [currentVersion]);

    const handleUpdateClick = async () => {
        if (!updateAvailable) return;

        try {
            await invoke('launch_updater', {
                latestVersion,
                theme: settings.theme,
                language: settings.language,
            });
        } catch (error) {
            console.error("Failed to launch updater:", error);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-8 pt-5 dark:bg-zinc-900">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('about.title')}</h1>
                <button
                    onClick={() => navigate('/')}
                    className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800"
                    aria-label="Close page"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </header>

            <main className="flex flex-1 items-center justify-center">
                <div className="w-117 h-68 outline-3 rounded-lg outline-zinc-950/20 dark:outline-white/20 bg-black/5 dark:bg-black/10 flex flex-col justify-center items-center">

                    <div className="flex flex-row w-full text-center items-center justify-center mb-7">
                        <img src={AppLogo} alt="App Logo" className="w-30 rounded-sm mr-5"></img>
                        <div>
                            <h1 className="text-3xl mb-4">
                                <span>{t('about.app_name')}</span>
                            </h1>
                            <div className="text-sm gap-5 flex flex-row items-center justify-center">
                                <div className="flex flex-col gap-y-0.5">
                                    <div>
                                        <span className="mr-2">{t('about.current_version')}:</span>
                                        <span className={clsx(updateAvailable && 'text-red-500')}>
                                            {currentVersion}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="mr-2">{t('about.latest_version')}:</span>
                                        <span className={clsx(updateAvailable && 'text-green-500')}>
                                            {latestVersion}
                                        </span>
                                    </div>
                                </div>

                                {updateAvailable && (
                                    <Button onClick={handleUpdateClick}>{t('about.update_now')}</Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-sm flex flex-col gap-2 items-center mb-2">
                        <p>
                            <span>GitHub: </span>
                            <a className="text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => openUrl('https://github.com/dyang886/Universal-Converter')}>https://github.com/dyang886/Universal-Converter</a>
                        </p>
                        <p>
                            <span>{t('about.bilibili')}: </span>
                            <a className="text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => openUrl('https://space.bilibili.com/256673766')}>https://space.bilibili.com/256673766</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
