import { useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

import { useTranslation } from 'react-i18next';

import { useApp } from '@/contexts/AppContext';
import { formats, widgetDefinitions } from '@/contexts/format-options';
import { TriStateCheckbox } from '@/components/checkbox';
import { Field, Label } from '@/components/fieldset';
import { IntegerInput, FloatInput, TextInput } from '@/components/input';
import { Listbox, ListboxOption } from '@/components/listbox';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { ClipboardIcon } from '@heroicons/react/24/outline';


function WidgetRenderer({ widgetKey, value, codecValue, onChange }) {
    const { t } = useTranslation();
    const [dynamicOptions, setDynamicOptions] = useState([]);

    const definition = widgetDefinitions[widgetKey];
    if (!definition) return null;
    const isDynamic = definition.options === 'dynamic';

    const formatRangeNumber = (num) => {
        if (typeof num === 'number' && Math.abs(num) > 9999) {
            return num.toExponential(1);
        }
        return num;
    };

    const handleChange = (newValue) => {
        onChange(widgetKey, newValue);
    };

    useEffect(() => {
        if (definition?.options === 'dynamic' && codecValue) {
            const fetchOptions = async () => {
                try {
                    const options = await invoke('get_dynamic_options', {
                        widgetName: widgetKey,
                        codec: codecValue,
                    });
                    setDynamicOptions(options || []);
                } catch (err) {
                    console.error(`Failed to fetch dynamic options for ${widgetKey} with codec ${codecValue}:`, err);
                    setDynamicOptions([]);
                }
            };

            fetchOptions();
        } else {
            setDynamicOptions([]);
        }
    }, [widgetKey, codecValue, definition]);

    return (
        <>
            {definition.type === 'select' && (
                <Field as="div">
                    <Label>{t(definition.labelKey)}</Label>
                    <Listbox value={value} onChange={handleChange} placeholder={t('advanced.not_selected')}>
                        <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                        {(isDynamic ? dynamicOptions : Object.entries(definition.options)).map(opt => {
                            const [name, val] = Array.isArray(opt) ? opt : [opt, opt];
                            return <ListboxOption key={val} value={val}>{name}</ListboxOption>;
                        })}
                    </Listbox>
                </Field>
            )}

            {definition.type === 'input-int' && (
                <Field as="div">
                    <Label>{t(definition.labelKey)} {`[${formatRangeNumber(definition.options[0])}, ${formatRangeNumber(definition.options[1])}]`}</Label>
                    <IntegerInput value={value} onChange={handleChange} min={definition.options[0]} max={definition.options[1]} />
                </Field>
            )}

            {definition.type === 'input-flt' && (
                <Field as="div">
                    <Label>{t(definition.labelKey)} {`[${formatRangeNumber(definition.options[0])}, ${formatRangeNumber(definition.options[1])}]`}</Label>
                    <FloatInput value={value} onChange={handleChange} min={definition.options[0]} max={definition.options[1]} />
                </Field>
            )}

            {definition.type === 'input-txt' && (
                <Field as="div">
                    <Label>{t(definition.labelKey)}</Label>
                    <TextInput value={value} onChange={handleChange} />
                </Field>
            )}

            {definition.type === 'checkbox' && (
                <Field as="div" className="flex items-center gap-2">
                    <TriStateCheckbox value={value} onChange={handleChange} />
                    <Label>{t(definition.labelKey)}</Label>
                </Field>
            )}
        </>
    );
}

const WIDGET_HEIGHT_PX = {
    'select': 64,
    'input-int': 64,
    'input-flt': 64,
    'input-txt': 64,
    'checkbox': 24,
};

export default function AdvancedOptions() {
    const { t } = useTranslation();
    const { filePaths, outputExt, selectedVideoCodec, setSelectedVideoCodec, selectedAudioCodec, setSelectedAudioCodec, advancedOptionValues, setAdvancedOptionValues, activeTab, setActiveTab } = useApp();

    const config = useMemo(() => formats[outputExt] || null, [outputExt]);

    // Memoize the available codecs based on the selected format
    const { videoCodecs, audioCodecs } = useMemo(() => {
        const video = config?.videoCodecs || {};
        const audio = config?.audioCodecs || config?.codecs || {};
        return { videoCodecs: video, audioCodecs: audio };
    }, [config]);

    const inputDrivenWidgets = useMemo(() => {
        if (!filePaths || filePaths.length === 0) {
            return [];
        }

        const widgetKeys = new Set();
        filePaths.forEach(path => {
            const extension = path.split('.').pop()?.toLowerCase();
            if (extension) {
                const formatConfig = formats[extension];
                if (formatConfig?.widgets_input) {
                    formatConfig.widgets_input.forEach(widgetKey => {
                        widgetKeys.add(widgetKey);
                    });
                }
            }
        });

        return Array.from(widgetKeys);
    }, [filePaths]);

    const widgetsToDisplay = useMemo(() => {
        if (!config) return { all: [], generalVideo: [], generalAudio: [], codecVideo: [], codecAudio: [], direct: [] };

        let outputGeneralVideo = [];
        let outputGeneralAudio = [];
        let outputDirect = [];
        let codecVideo = [];
        let codecAudio = [];

        if (config.group === 'video') {
            outputGeneralVideo = config.videoWidgets || [];
            outputGeneralAudio = config.audioWidgets || [];
            codecVideo = selectedVideoCodec ? videoCodecs[selectedVideoCodec]?.widgets || [] : [];
            codecAudio = selectedAudioCodec ? audioCodecs[selectedAudioCodec]?.widgets || [] : [];
        } else if (config.group === 'audio') {
            outputDirect = config.widgets || [];
            codecAudio = selectedAudioCodec ? audioCodecs[selectedAudioCodec]?.widgets || [] : [];
        }

        const direct = Array.from(new Set([...outputDirect, ...(config.group === 'audio' ? inputDrivenWidgets : [])]));
        const generalVideo = Array.from(new Set(outputGeneralVideo));
        const generalAudio = Array.from(new Set(outputGeneralAudio));

        const all = [...generalVideo, ...generalAudio, ...codecVideo, ...codecAudio, ...direct];

        return { all, generalVideo, generalAudio, codecVideo, codecAudio, direct };

    }, [config, selectedVideoCodec, selectedAudioCodec, videoCodecs, audioCodecs, inputDrivenWidgets]);

    // Effect to initialize or clean up advanced option values when the available widgets change
    useEffect(() => {
        setAdvancedOptionValues(prevValues => {
            const newOptions = {};
            const currentWidgetKeys = new Set(widgetsToDisplay.all);
            for (const widgetKey in prevValues) {
                if (currentWidgetKeys.has(widgetKey)) {
                    newOptions[widgetKey] = prevValues[widgetKey];
                }
            }
            return newOptions;
        });
    }, [widgetsToDisplay.all.join(','), setAdvancedOptionValues]);

    const handleOptionChange = (widgetKey, value) => {
        setAdvancedOptionValues(prev => ({ ...prev, [widgetKey]: value }));
    };

    // Memoize the final ffmpeg command string
    const commandString = useMemo(() => {
        // a set of arguments to exclude from the command string
        const excludedArgs = new Set(['--qmc-mmkv', '--qmc-mmkv-key', '--kgg-db', '--update-metadata']);

        let cmd = `ffmpeg -i "${t("advanced.input_file")}"`;
        const videoCodecInfo = videoCodecs[selectedVideoCodec];
        const audioCodecInfo = audioCodecs[selectedAudioCodec];

        if (selectedVideoCodec && videoCodecInfo) {
            cmd += ` -c:v ${videoCodecInfo.value}`;
        }
        if (selectedAudioCodec && audioCodecInfo) {
            cmd += ` -c:a ${audioCodecInfo.value}`;
        }

        // 1. Group all selected options by their FFmpeg argument
        const groupedArgs = {};
        for (const widgetKey in advancedOptionValues) {
            const value = advancedOptionValues[widgetKey];
            const definition = widgetDefinitions[widgetKey];

            if (definition && !excludedArgs.has(definition.arg) && value !== '' && value !== null && value !== undefined) {
                const arg = definition.arg;
                // Initialize the array if it's the first time we see this arg
                if (!groupedArgs[arg]) {
                    groupedArgs[arg] = [];
                }
                // Apply prefix and suffix if they exist in the definition
                let finalValue = value;
                if (definition.prefix) {
                    finalValue = `${definition.prefix}${finalValue}`;
                }
                if (definition.suffix) {
                    finalValue = `${finalValue}${definition.suffix}`;
                }

                groupedArgs[arg].push(finalValue);
            }
        }

        // 2. Build the command string from the grouped arguments
        for (const arg in groupedArgs) {
            const combinedValue = groupedArgs[arg].join(',');
            cmd += ` ${arg} ${combinedValue}`;
        }

        cmd += ` "${t("advanced.output_file")}_UCT.${outputExt}"`;
        return cmd;
    }, [advancedOptionValues, selectedVideoCodec, selectedAudioCodec, videoCodecs, audioCodecs, outputExt, t]);

    const renderWidgets = (widgetKeys, codecType = null) => {
        let codecValue = null;
        if (codecType === 'video' && selectedVideoCodec && videoCodecs[selectedVideoCodec]) {
            codecValue = videoCodecs[selectedVideoCodec].value;
        } else if (codecType === 'audio' && selectedAudioCodec && audioCodecs[selectedAudioCodec]) {
            codecValue = audioCodecs[selectedAudioCodec].value;
        }

        return widgetKeys.map(widgetKey => {
            const def = widgetDefinitions[widgetKey];
            if (!def) return null;
            const value = advancedOptionValues[widgetKey] ?? '';

            return (
                <WidgetRenderer
                    key={`${widgetKey}-${codecValue || 'general'}`}
                    widgetKey={widgetKey}
                    value={value}
                    codecValue={codecValue}
                    onChange={handleOptionChange}
                />
            );
        });
    };

    const renderGeneralOptions = () => {
        if (config.group === 'video') {
            // Strict columns for video files
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-y-6">{renderWidgets(widgetsToDisplay.generalVideo)}</div>
                    <div className="flex flex-col gap-y-6">{renderWidgets(widgetsToDisplay.generalAudio)}</div>
                </div>
            );
        } else {
            // Evenly distribute
            const generalWidgets = [...widgetsToDisplay.direct];

            const widgetsWithHeights = generalWidgets.map(key => {
                const definition = widgetDefinitions[key];
                const height = WIDGET_HEIGHT_PX[definition.type];
                return { key, height };
            }).sort((a, b) => b.height - a.height);

            const leftWidgets = [];
            const rightWidgets = [];
            let leftHeightPx = 0;
            let rightHeightPx = 0;

            widgetsWithHeights.forEach(widget => {
                if (leftHeightPx <= rightHeightPx) {
                    leftWidgets.push(widget.key);
                    leftHeightPx += widget.height;
                } else {
                    rightWidgets.push(widget.key);
                    rightHeightPx += widget.height;
                }
            });

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-y-6">{renderWidgets(leftWidgets)}</div>
                    <div className="flex flex-col gap-y-6">{renderWidgets(rightWidgets)}</div>
                </div>
            );
        }
    };

    const renderCodecOptions = () => {
        if (config.group === 'video') {
            // Strict columns for video files
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
                        {renderWidgets(widgetsToDisplay.codecVideo, 'video')}
                    </div>
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
                        {renderWidgets(widgetsToDisplay.codecAudio, 'audio')}
                    </div>
                </div>
            );
        } else if (config.group === 'audio') {
            // Evenly distribute
            const itemsToDistribute = [];

            // 1. Add the codec selector as an item to be distributed
            if (Object.keys(audioCodecs).length > 0) {
                itemsToDistribute.push({
                    key: 'audio-codec-selector',
                    height: WIDGET_HEIGHT_PX['select'],
                    component: (
                        <Field key="audio-codec-selector">
                            <Label>{t('advanced.audio.codec')}</Label>
                            <Listbox value={selectedAudioCodec} onChange={setSelectedAudioCodec} placeholder={t('advanced.not_selected')}>
                                <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                                {Object.keys(audioCodecs).map(name => (
                                    <ListboxOption key={name} value={name}>{name}</ListboxOption>
                                ))}
                            </Listbox>
                        </Field>
                    ),
                });
            }

            // 2. Add all codec-specific widgets as items to be distributed
            const codecWidgetComponents = renderWidgets(widgetsToDisplay.codecAudio, 'audio');
            widgetsToDisplay.codecAudio.forEach((widgetKey, index) => {
                const definition = widgetDefinitions[widgetKey];
                if (definition) {
                    const height = WIDGET_HEIGHT_PX[definition.type];
                    itemsToDistribute.push({
                        key: widgetKey,
                        height: height,
                        component: codecWidgetComponents[index],
                    });
                }
            });

            // 3. Sort all items by height, descending
            itemsToDistribute.sort((a, b) => b.height - a.height);

            // 4. Distribute components into two columns using a greedy algorithm
            const leftColumnItems = [];
            const rightColumnItems = [];
            let leftHeightPx = 0;
            let rightHeightPx = 0;

            itemsToDistribute.forEach(item => {
                if (leftHeightPx <= rightHeightPx) {
                    leftColumnItems.push(item.component);
                    leftHeightPx += item.height;
                } else {
                    rightColumnItems.push(item.component);
                    rightHeightPx += item.height;
                }
            });

            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-y-6">{leftColumnItems}</div>
                    <div className="flex flex-col gap-y-6">{rightColumnItems}</div>
                </div>
            );
        }
    };

    return (
        <div className="w-full flex-1 flex flex-col overflow-hidden px-4 mb-2 mt-6">
            {!outputExt ? (
                <div className="font-mono flex h-full items-center justify-center text-lg text-zinc-500">
                    {t('advanced.please_select_files')}
                </div>
            ) : (
                <>
                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        {activeTab === 'general' && renderGeneralOptions()}
                        {activeTab === 'codec' && renderCodecOptions()}
                    </div>

                    {/* Tab Navigation */}
                    <Navbar className="mt-3 flex justify-start self-stretch">
                        <NavbarSection>
                            <NavbarItem as="button" onClick={() => setActiveTab('general')} current={activeTab === 'general'}>{t('advanced.general')}</NavbarItem>
                            <NavbarItem as="button" onClick={() => setActiveTab('codec')} current={activeTab === 'codec'}>{t('advanced.codec')}</NavbarItem>
                        </NavbarSection>
                    </Navbar>

                    {/* Command Display */}
                    <div className="mt-3 flex-shrink-0 rounded-lg bg-zinc-800 p-4 font-mono text-sm text-zinc-300">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-zinc-400">{t('advanced.command')}</span>
                            <button onClick={() => navigator.clipboard.writeText(commandString)} className="p-1 rounded-md hover:bg-zinc-700 active:bg-zinc-600">
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