import { useNavigate } from 'react-router-dom';

import * as Headless from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { useApp } from '@/contexts/AppContext';
import { Field, Label } from '@/components/fieldset';
import { Select } from '@/components/select';
import { Switch } from '@/components/switch';


export default function SettingsPage() {
    const navigate = useNavigate();
    const { settings, setSettings } = useApp();
    const { t, i18n } = useTranslation();

    const updateSetting = (key, value) => {
        setSettings(s => ({ ...s, [key]: value }));

        if (key === 'language') {
            i18n.changeLanguage(value);
        }
        if (key === 'theme') {
            document.documentElement.classList.toggle('dark', value === 'dark');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-8 pt-5 dark:bg-zinc-900">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
                <button
                    onClick={() => navigate('/')}
                    className="rounded-full p-2 transition-colors hover:bg-zinc-950/5 dark:hover:bg-white/5"
                    aria-label="Close page"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pt-8">
                <div className="mx-auto max-w-md space-y-6">

                    <Field>
                        <Label>{t('settings.theme')}</Label>
                        <Select name="theme" value={settings?.theme} onChange={e => updateSetting('theme', e.target.value)}>
                            <option value="light">{t('settings.light')}</option>
                            <option value="dark">{t('settings.dark')}</option>
                        </Select>
                    </Field>

                    <Field>
                        <Label>{t('settings.language')}</Label>
                        <Select name="language" value={settings?.language} onChange={e => updateSetting('language', e.target.value)}>
                            <option value="en_US">English (US)</option>
                            <option value="zh_CN">简体中文</option>
                            <option value="zh_TW">繁体中文</option>
                        </Select>
                    </Field>

                    <Headless.Field className="flex items-center gap-4">
                        <Switch checked={settings?.auto_update} onChange={checked => updateSetting('auto_update', checked)} />
                        <Label>{t('settings.auto_update')}</Label>
                    </Headless.Field>

                </div>
            </main>
        </div>
    );
}
