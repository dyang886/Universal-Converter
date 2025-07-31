import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useApp } from '@/contexts/AppContext';
import { formats, widgetDefinitions } from '@/contexts/format-options';
import { Checkbox } from '@/components/checkbox';
import { Field, Label } from '@/components/fieldset';
import { Listbox, ListboxOption } from '@/components/listbox';
import { IntegerInput } from '@/components/input';
import { ClipboardIcon } from '@heroicons/react/24/outline';


function WidgetRenderer({ widgetKey, value, onChange }) {
    const { t } = useTranslation();
    const definition = widgetDefinitions[widgetKey];
    if (!definition) return null;

    const handleChange = (newValue) => {
        onChange(definition.arg, newValue);
    };

    if (definition.type === 'checkbox') {
        return (
            <Field as="div" className="flex items-center gap-3">
                <Checkbox checked={value === 1} onChange={(checked) => handleChange(checked ? 1 : 0)} />
                <Label>{t(definition.labelKey)}</Label>
            </Field>
        );
    }

    return (
        <Field>
            <Label>{t(definition.labelKey)}</Label>
            {definition.type === 'select' && (
                <Listbox value={value} onChange={handleChange} placeholder={t('advanced.not_selected')}>
                    <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                    {Object.entries(definition.options).map(([name, val]) => (
                        <ListboxOption key={val} value={val}>{name}</ListboxOption>
                    ))}
                </Listbox>
            )}
            {definition.type === 'input' && (
                <IntegerInput value={value} onChange={handleChange} min={definition.options[0]} max={definition.options[1]} />
            )}
        </Field>
    );
}

export default function AdvancedOptions() {
    const { t } = useTranslation();
    const { outputExt, selectedVideoCodec, setSelectedVideoCodec, selectedAudioCodec, setSelectedAudioCodec, advancedOptionValues, setAdvancedOptionValues } = useApp();

    const config = useMemo(() => formats[outputExt] || null, [outputExt]);

    const { videoCodecs, audioCodecs } = useMemo(() => {
        const video = config?.videoCodecs || {};
        const audio = config?.audioCodecs || config?.codecs || {};
        return { videoCodecs: video, audioCodecs: audio };
    }, [config]);

    const widgetsToDisplay = useMemo(() => {
        if (!config) return { all: [], video: [], audio: [], direct: [] };
        const video = selectedVideoCodec ? videoCodecs[selectedVideoCodec]?.widgets || [] : [];
        const audio = selectedAudioCodec ? audioCodecs[selectedAudioCodec]?.widgets || [] : [];
        const direct = config.widgets || [];
        return { all: [...video, ...audio, ...direct], video, audio, direct };
    }, [config, selectedVideoCodec, selectedAudioCodec, videoCodecs, audioCodecs]);

    useEffect(() => {
        setAdvancedOptionValues(prevValues => {
            const newValuesToInitialize = {};
            let needsUpdate = false;

            widgetsToDisplay.all.forEach(key => {
                const def = widgetDefinitions[key];
                if (def && prevValues[def.arg] === undefined) {
                    newValuesToInitialize[def.arg] = def.type === 'checkbox' ? 0 : '';
                    needsUpdate = true;
                }
            });

            return needsUpdate ? { ...prevValues, ...newValuesToInitialize } : prevValues;
        });
    }, [widgetsToDisplay.all.join(','), setAdvancedOptionValues]);

    const handleOptionChange = (arg, value) => {
        setAdvancedOptionValues(prev => ({ ...prev, [arg]: value }));
    };

    const commandString = useMemo(() => {
        let cmd = `ffmpeg -i "${t("advanced.input_file")}"`;
        const videoCodecInfo = videoCodecs[selectedVideoCodec];
        const audioCodecInfo = audioCodecs[selectedAudioCodec];

        if (selectedVideoCodec && videoCodecInfo) {
            cmd += ` -c:v ${videoCodecInfo.value}`;
        }
        if (selectedAudioCodec && audioCodecInfo) {
            cmd += ` -c:a ${audioCodecInfo.value}`;
        }

        for (const key in advancedOptionValues) {
            const value = advancedOptionValues[key];
            if (value !== '' && value !== null && value !== undefined) {
                cmd += ` ${key} ${value}`;
            }
        }
        cmd += ` "${t("advanced.output_file")}_UCT.${outputExt}"`;
        return cmd;
    }, [advancedOptionValues, selectedVideoCodec, selectedAudioCodec, videoCodecs, audioCodecs, outputExt]);

    const renderWidgets = (widgetKeys) => {
        return widgetKeys.map(widgetKey => {
            const def = widgetDefinitions[widgetKey];
            const value = advancedOptionValues[def.arg] ?? (def.type === 'checkbox' ? 0 : '');

            return (
                <WidgetRenderer
                    key={widgetKey}
                    widgetKey={widgetKey}
                    value={value}
                    onChange={handleOptionChange}
                />
            );
        });
    };

    return (
        <div className="w-full flex-1 flex flex-col overflow-hidden px-4 my-2">
            {!outputExt ? (
                <div className="font-mono flex h-full items-center justify-center text-lg text-zinc-500">
                    {t('advanced.please_select_files')}
                </div>
            ) : (
                <>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* --- COLUMN 1 --- */}
                            <div className="flex flex-col gap-y-6">
                                {Object.keys(videoCodecs).length > 0 && (
                                    <Field>
                                        <Label>{t('advanced.video.codec')}</Label>
                                        <Listbox value={selectedVideoCodec} onChange={setSelectedVideoCodec} placeholder={t('advanced.not_selected')}>
                                            <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                                            {Object.keys(videoCodecs).map(name => (
                                                <ListboxOption key={name} value={name}>{name}</ListboxOption>
                                            ))}
                                        </Listbox>
                                    </Field>
                                )}
                                {renderWidgets(widgetsToDisplay.video)}
                                {renderWidgets(widgetsToDisplay.direct)}
                            </div>

                            {/* --- COLUMN 2 --- */}
                            <div className="flex flex-col gap-y-6">
                                {Object.keys(audioCodecs).length > 0 && (
                                    <Field>
                                        <Label>{t('advanced.audio.codec')}</Label>
                                        <Listbox value={selectedAudioCodec} onChange={setSelectedAudioCodec} placeholder={t('advanced.not_selected')}>
                                            <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                                            {Object.keys(audioCodecs).map(name => (
                                                <ListboxOption key={name} value={name}>{name}</ListboxOption>
                                            ))}
                                        </Listbox>
                                    </Field>
                                )}
                                {renderWidgets(widgetsToDisplay.audio)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex-shrink-0 rounded-lg bg-zinc-800 p-4 font-mono text-sm text-zinc-300">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-zinc-400">{t('advanced.command')}</span>
                            <button onClick={() => navigator.clipboard.writeText(commandString)} className="p-1 rounded-md hover:bg-zinc-700">
                                <ClipboardIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <pre className="whitespace-pre-wrap break-words text-xs">{commandString}</pre>
                    </div>
                </>
            )}
        </div>
    );
}
