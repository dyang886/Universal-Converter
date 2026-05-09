import { useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

import { useTranslation } from 'react-i18next';

import { useApp } from '@/contexts/AppContext';
import { formats, widgetDefinitions, buildGroupedArgs, formatTags, specialHintKeys, getInputWidgetExtMapForTag } from '@/contexts/format-options';
import { TriStateCheckbox, DualStateCheckbox } from '@/components/checkbox';
import { Field, Label } from '@/components/fieldset';
import { IntegerInput, FloatInput, TextInput } from '@/components/input';
import { Listbox, ListboxOption } from '@/components/listbox';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { InformationCircleIcon } from '@heroicons/react/24/solid';


function getWidgetHintText(widgetKey, definition, filePaths, t) {
    if (!definition.hintKey) return null;

    // Special case: show which selected encrypted input extensions this widget applies to.
    if (definition.hintKey === specialHintKeys.encryptedInput) {
        const encryptedInputExtsByWidget = getInputWidgetExtMapForTag(formatTags.encrypted);
        const applicableExts = encryptedInputExtsByWidget[widgetKey];
        if (!applicableExts) return null;

        const selectedExts = Array.from(new Set(
            filePaths
                .map(path => path.split('.').pop()?.toLowerCase() || '')
                .filter(ext => applicableExts.includes(ext))
        ));

        if (selectedExts.length === 0) return null;
        return t('advanced.hints.applies_to_selected', { exts: selectedExts.map(ext => `.${ext}`).join(', ') });
    }

    // Future special hint keys can be handled above before falling back to static translation keys.
    return t(definition.hintKey);
}

function HintIcon({ hintText }) {
    if (!hintText) return null;

    return (
        <span
            className="group relative inline-flex items-center align-middle"
            onClick={(event) => event.preventDefault()}
            onMouseDown={(event) => event.preventDefault()}
        >
            <InformationCircleIcon
                className="h-4 w-4 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                aria-label={hintText}
                title={hintText}
                tabIndex={0}
            />
        </span>
    );
}

function LabelWithHint({ children, hintText }) {
    return (
        <Label className="inline-flex items-center gap-1.5">
            {children}
            <HintIcon hintText={hintText} />
        </Label>
    );
}

function WidgetRenderer({ widgetKey, inlineDef, value, codecValue, filePaths = [], onChange }) {
    const { t } = useTranslation();
    const [dynamicOptions, setDynamicOptions] = useState([]);

    const definition = inlineDef ?? widgetDefinitions[widgetKey];
    if (!definition) return null;
    const isDynamic = definition.options === 'dynamic';
    const labelText = definition.label ?? t(definition.labelKey);
    const hintText = getWidgetHintText(widgetKey, definition, filePaths, t);

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
                    <LabelWithHint hintText={hintText}>{labelText}</LabelWithHint>
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
                    <LabelWithHint hintText={hintText}>{labelText} {`[${formatRangeNumber(definition.options[0])}, ${formatRangeNumber(definition.options[1])}]`}</LabelWithHint>
                    <IntegerInput value={value} onChange={handleChange} min={definition.options[0]} max={definition.options[1]} />
                </Field>
            )}

            {definition.type === 'input-flt' && (
                <Field as="div">
                    <LabelWithHint hintText={hintText}>{labelText} {`[${formatRangeNumber(definition.options[0])}, ${formatRangeNumber(definition.options[1])}]`}</LabelWithHint>
                    <FloatInput value={value} onChange={handleChange} min={definition.options[0]} max={definition.options[1]} />
                </Field>
            )}

            {definition.type === 'input-txt' && (
                <Field as="div">
                    <LabelWithHint hintText={hintText}>{labelText}</LabelWithHint>
                    <TextInput value={value} onChange={handleChange} />
                </Field>
            )}

            {definition.type === 'checkbox' && (
                <Field as="div" className="flex items-center gap-2">
                    <TriStateCheckbox value={value} onChange={handleChange} />
                    <LabelWithHint hintText={hintText}>{labelText}</LabelWithHint>
                </Field>
            )}

            {definition.type === 'checkbox-novalue' && (
                <Field as="div" className="flex items-center gap-2">
                    <DualStateCheckbox value={value} onChange={handleChange} />
                    <LabelWithHint hintText={hintText}>{labelText}</LabelWithHint>
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
    'checkbox-novalue': 24,
};

export default function AdvancedOptions() {
    const { t } = useTranslation();
    const { filePaths, outputExt, selectedVideoCodec, setSelectedVideoCodec, selectedAudioCodec, setSelectedAudioCodec, advancedOptionValues, setAdvancedOptionValues, activeTab, setActiveTab } = useApp();

    const config = useMemo(() => formats[outputExt] || null, [outputExt]);

    // Memoize the available codecs based on the selected format
    const { videoCodecs, audioCodecs } = useMemo(() => {
        const video = config?.videoCodecs || [];
        const audio = config?.audioCodecs || config?.codecs || [];
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
            codecVideo = selectedVideoCodec ? videoCodecs.find(c => c.value === selectedVideoCodec)?.widgets || [] : [];
            codecAudio = selectedAudioCodec ? audioCodecs.find(c => c.value === selectedAudioCodec)?.widgets || [] : [];
        } else if (config.group === 'audio') {
            outputDirect = config.widgets || [];
            codecAudio = selectedAudioCodec ? audioCodecs.find(c => c.value === selectedAudioCodec)?.widgets || [] : [];
        } else if (config.group === 'image') {
            outputDirect = config.widgets || [];
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
            for (const widgetKey of currentWidgetKeys) {
                if (!(widgetKey in newOptions)) {
                    const def = widgetDefinitions[widgetKey];
                    if (def?.type === 'group') {
                        const init = {};
                        def.widgets.forEach(sw => {
                            init[sw.arg] = sw.default !== undefined ? sw.default
                                : sw.type === 'checkbox' ? null
                                    : sw.type === 'checkbox-novalue' ? false
                                        : '';
                        });
                        newOptions[widgetKey] = init;
                    } else if (def?.type === 'checkbox') {
                        newOptions[widgetKey] = null;
                    } else if (def?.type === 'checkbox-novalue') {
                        newOptions[widgetKey] = false;
                    } else if (def?.default !== undefined) {
                        newOptions[widgetKey] = def.default;
                    }
                }
            }
            return newOptions;
        });
    }, [widgetsToDisplay.all.join(','), setAdvancedOptionValues]);

    useEffect(() => {
        if (config?.group === 'image') {
            setActiveTab('general');
        }
    }, [config, setActiveTab]);

    const handleOptionChange = (widgetKey, value) => {
        setAdvancedOptionValues(prev => ({ ...prev, [widgetKey]: value }));
    };

    const handleGroupChange = (groupKey, subArg, newValue) => {
        setAdvancedOptionValues(prev => ({
            ...prev,
            [groupKey]: { ...(prev[groupKey] || {}), [subArg]: newValue },
        }));
    };

    // Memoize the final command string
    const commandString = useMemo(() => {
        const combineInputs = advancedOptionValues['combine_inputs'] === true;

        // 1. Group all selected options by their argument
        const groupedArgs = buildGroupedArgs(advancedOptionValues);
        for (const arg of ['--qmc-mmkv', '--qmc-mmkv-key', '--kgg-db', '--update-metadata']) {
            delete groupedArgs[arg];
        }

        // 2. Build the command string based on the tool
        let cmd = "";
        const tool = config?.tool || null;

        if (tool === 'magick') {
            const inputDisplay = combineInputs && filePaths.length > 1
                ? Array.from({ length: filePaths.length }, (_, i) => `"${t("advanced.input_file")}${i + 1}"`).join(' ')
                : `"${t("advanced.input_file")}"`;
            cmd = `magick ${inputDisplay}`;

            // Build the command string from the grouped arguments
            for (const arg in groupedArgs) {
                const combinedValue = groupedArgs[arg].filter(v => v !== '').join(',');
                if (combinedValue === '') {
                    cmd += ` ${arg}`;
                } else {
                    cmd += ` ${arg} ${combinedValue}`;
                }
            }

            cmd += ` "${t("advanced.output_file")}_UCT.${outputExt}"`;

        } else if (tool === 'ffmpeg') {
            cmd = `ffmpeg -i "${t("advanced.input_file")}"`;
            if (selectedVideoCodec) {
                cmd += ` -c:v ${selectedVideoCodec}`;
            }
            if (selectedAudioCodec) {
                cmd += ` -c:a ${selectedAudioCodec}`;
            }

            // Build the command string from the grouped arguments
            for (const arg in groupedArgs) {
                const combinedValue = groupedArgs[arg].filter(v => v !== '').join(',');
                if (combinedValue === '') {
                    cmd += ` ${arg}`;
                } else {
                    cmd += ` ${arg} ${combinedValue}`;
                }
            }

            cmd += ` "${t("advanced.output_file")}_UCT.${outputExt}"`;
        }

        return cmd;
    }, [advancedOptionValues, filePaths, selectedVideoCodec, selectedAudioCodec, videoCodecs, audioCodecs, outputExt, t, config]);

    const renderWidgets = (widgetKeys, codecType = null) => {
        let codecValue = null;
        if (codecType === 'video' && selectedVideoCodec) {
            codecValue = selectedVideoCodec;
        } else if (codecType === 'audio' && selectedAudioCodec) {
            codecValue = selectedAudioCodec;
        }

        return widgetKeys.map(widgetKey => {
            const def = widgetDefinitions[widgetKey];
            if (!def) return null;

            if (def.type === 'group') {
                const groupValue = advancedOptionValues[widgetKey] || {};
                const groupLabel = def.label ?? t(def.labelKey);
                const groupHint = getWidgetHintText(widgetKey, def, filePaths, t);
                return (
                    <div key={widgetKey} className="relative mt-2 rounded-lg border border-zinc-700 px-3 pb-3 pt-4">
                        <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1.5 bg-white px-1 text-sm/6 font-medium text-zinc-950 select-none dark:bg-zinc-900 dark:text-white">
                            {groupLabel}
                            <HintIcon hintText={groupHint} />
                        </span>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                            {def.widgets.map((sw, i) => (
                                <WidgetRenderer
                                    key={i}
                                    widgetKey={`${widgetKey}:${sw.arg}`}
                                    inlineDef={sw}
                                    value={groupValue[sw.arg] ?? ''}
                                    codecValue={codecValue}
                                    filePaths={filePaths}
                                    onChange={(_, newVal) => handleGroupChange(widgetKey, sw.arg, newVal)}
                                />
                            ))}
                        </div>
                    </div>
                );
            }

            const value = widgetKey in advancedOptionValues ? advancedOptionValues[widgetKey]
                : def?.type === 'checkbox' ? null
                    : def?.type === 'checkbox-novalue' ? false
                        : '';
            return (
                <WidgetRenderer
                    key={`${widgetKey}-${codecValue || 'general'}`}
                    widgetKey={widgetKey}
                    value={value}
                    codecValue={codecValue}
                    filePaths={filePaths}
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

            const widgetsWithHeights = generalWidgets.map((key, index) => {
                const definition = widgetDefinitions[key];
                const height = definition?.type === 'group'
                    ? 32 + definition.widgets.length * 24
                    : WIDGET_HEIGHT_PX[definition?.type] ?? 24;
                return { key, height, index };
            }).sort((a, b) => b.height - a.height);

            const leftItems = [];
            const rightItems = [];
            let leftHeightPx = 0;
            let rightHeightPx = 0;

            widgetsWithHeights.forEach(widget => {
                if (leftHeightPx <= rightHeightPx) {
                    leftItems.push(widget);
                    leftHeightPx += widget.height;
                } else {
                    rightItems.push(widget);
                    rightHeightPx += widget.height;
                }
            });

            const leftWidgets = leftItems.sort((a, b) => a.index - b.index).map(w => w.key);
            const rightWidgets = rightItems.sort((a, b) => a.index - b.index).map(w => w.key);

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
                        {videoCodecs.length > 0 && (
                            <Field>
                                <Label>{t('advanced.video.codec')}</Label>
                                <Listbox value={selectedVideoCodec} onChange={setSelectedVideoCodec} placeholder={t('advanced.not_selected')}>
                                    <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                                    {videoCodecs.map(codec => (
                                        <ListboxOption key={codec.value} value={codec.value}>{t(codec.label)}</ListboxOption>
                                    ))}
                                </Listbox>
                            </Field>
                        )}
                        {renderWidgets(widgetsToDisplay.codecVideo, 'video')}
                    </div>
                    <div className="flex flex-col gap-y-6">
                        {audioCodecs.length > 0 && (
                            <Field>
                                <Label>{t('advanced.audio.codec')}</Label>
                                <Listbox value={selectedAudioCodec} onChange={setSelectedAudioCodec} placeholder={t('advanced.not_selected')}>
                                    <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                                    {audioCodecs.map(codec => (
                                        <ListboxOption key={codec.value} value={codec.value}>{t(codec.label)}</ListboxOption>
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

            let originalIndex = 0;

            // 1. Add the codec selector as an item to be distributed
            if (audioCodecs.length > 0) {
                itemsToDistribute.push({
                    key: 'audio-codec-selector',
                    height: WIDGET_HEIGHT_PX['select'],
                    originalIndex: originalIndex++,
                    component: (
                        <Field key="audio-codec-selector">
                            <Label>{t('advanced.audio.codec')}</Label>
                            <Listbox value={selectedAudioCodec} onChange={setSelectedAudioCodec} placeholder={t('advanced.not_selected')}>
                                <ListboxOption value="">{t('advanced.not_selected')}</ListboxOption>
                                {audioCodecs.map(codec => (
                                    <ListboxOption key={codec.value} value={codec.value}>{t(codec.label)}</ListboxOption>
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
                    const height = definition.type === 'group'
                        ? 32 + definition.widgets.length * 24
                        : WIDGET_HEIGHT_PX[definition.type] ?? 24;
                    itemsToDistribute.push({
                        key: widgetKey,
                        height: height,
                        originalIndex: originalIndex++,
                        component: codecWidgetComponents[index],
                    });
                }
            });

            // 3. Sort all items by height, descending
            itemsToDistribute.sort((a, b) => b.height - a.height);

            // 4. Distribute components into two columns using a greedy algorithm
            const leftItems = [];
            const rightItems = [];
            let leftHeightPx = 0;
            let rightHeightPx = 0;

            itemsToDistribute.forEach(item => {
                if (leftHeightPx <= rightHeightPx) {
                    leftItems.push(item);
                    leftHeightPx += item.height;
                } else {
                    rightItems.push(item);
                    rightHeightPx += item.height;
                }
            });

            const leftColumnItems = leftItems.sort((a, b) => a.originalIndex - b.originalIndex).map(i => i.component);
            const rightColumnItems = rightItems.sort((a, b) => a.originalIndex - b.originalIndex).map(i => i.component);

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
                    {config.group !== 'image' && (
                        <Navbar className="mt-3 flex justify-start self-stretch">
                            <NavbarSection>
                                <NavbarItem as="button" onClick={() => setActiveTab('general')} current={activeTab === 'general'}>{t('advanced.general')}</NavbarItem>
                                <NavbarItem as="button" onClick={() => setActiveTab('codec')} current={activeTab === 'codec'}>{t('advanced.codec')}</NavbarItem>
                            </NavbarSection>
                        </Navbar>
                    )}

                    {/* Command Display */}
                    <div className="mt-3 flex-shrink-0 rounded-lg bg-zinc-200 dark:bg-zinc-800 p-4 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-zinc-500 dark:text-zinc-400">{t('advanced.command')}</span>
                            <button onClick={() => navigator.clipboard.writeText(commandString)} className="p-1 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-700 active:bg-zinc-400 dark:active:bg-zinc-600">
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
