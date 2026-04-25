import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ChevronDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';

import { useApp } from '@/contexts/AppContext';


function ConversionSummary({ verb, inputDisplay, outputName, MiddleEllipsis, title }) {
    const containerRef = useRef(null);
    const arrowRef = useRef(null);
    const [filenameWidths, setFilenameWidths] = useState(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const arrow = arrowRef.current;
        if (!container || !arrow) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateWidths = () => {
            const containerWidth = container.clientWidth;
            if (!containerWidth) return;

            const style = window.getComputedStyle(container);
            const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
            const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            ctx.font = font;

            const verbWidth = ctx.measureText(verb).width;
            const inputWidth = ctx.measureText(inputDisplay).width;
            const outputWidth = ctx.measureText(outputName).width;
            const arrowWidth = arrow.getBoundingClientRect().width;
            const availableForNames = Math.max(0, containerWidth - verbWidth - arrowWidth - gap * 3);

            if (inputWidth + outputWidth <= availableForNames + 1) {
                setFilenameWidths(null);
                return;
            }

            const minWidth = Math.min(96, availableForNames / 2);
            let nextInputWidth = (availableForNames * inputWidth) / (inputWidth + outputWidth);
            let nextOutputWidth = availableForNames - nextInputWidth;

            if (nextInputWidth < minWidth) {
                nextInputWidth = minWidth;
                nextOutputWidth = availableForNames - nextInputWidth;
            }

            if (nextOutputWidth < minWidth) {
                nextOutputWidth = minWidth;
                nextInputWidth = availableForNames - nextOutputWidth;
            }

            setFilenameWidths({
                input: Math.max(0, Math.floor(nextInputWidth)),
                output: Math.max(0, Math.floor(nextOutputWidth)),
            });
        };

        const observer = new ResizeObserver(updateWidths);
        observer.observe(container);
        observer.observe(arrow);
        updateWidths();

        return () => observer.disconnect();
    }, [verb, inputDisplay, outputName]);

    return (
        <div ref={containerRef} className="flex-1 min-w-0 flex items-center gap-1.5" title={title}>
            <span className="shrink-0 whitespace-nowrap">{verb}</span>
            {filenameWidths ? (
                <>
                    <div className="min-w-0 shrink-0" style={{ width: `${filenameWidths.input}px` }}>
                        <MiddleEllipsis text={inputDisplay} />
                    </div>
                    <span ref={arrowRef} className="shrink-0">
                        <ArrowLongRightIcon className="h-7 w-7" />
                    </span>
                    <div className="min-w-0 shrink-0" style={{ width: `${filenameWidths.output}px` }}>
                        <MiddleEllipsis text={outputName} />
                    </div>
                </>
            ) : (
                <>
                    <span className="shrink-0 whitespace-nowrap">{inputDisplay}</span>
                    <span ref={arrowRef} className="shrink-0">
                        <ArrowLongRightIcon className="h-7 w-7" />
                    </span>
                    <span className="shrink-0 whitespace-nowrap">{outputName}</span>
                </>
            )}
        </div>
    );
}


export default function TerminalOutput() {
    const { t } = useTranslation();
    const { MiddleEllipsis, conversionMeta, terminalLogs, setTerminalLogs } = useApp();
    const scrollContainerRef = useRef(null);
    const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);

    const logContentSignature = terminalLogs.map(log => `${log.path}:${log.output.length}`).join(',');

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const isAtBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1;
            setUserHasScrolledUp(!isAtBottom);
        };

        el.addEventListener('scroll', handleScroll);

        return () => el.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!userHasScrolledUp && el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [logContentSignature, userHasScrolledUp]);

    const toggleExpand = (indexToToggle) => {
        setTerminalLogs(prevLogs =>
            prevLogs.map((log, index) =>
                index === indexToToggle ? { ...log, isExpanded: !log.isExpanded } : log
            )
        );
    };

    return (
        <div ref={scrollContainerRef} className="w-full flex-1 overflow-y-auto mt-6 pl-3 pr-2 text-sm">
            {terminalLogs.length === 0 ? (
                <div className="font-mono flex h-full items-center justify-center text-lg text-zinc-500 -translate-y-[0.23rem] -translate-x-[0.12rem]">
                    {t('terminal.waiting_for_conversion')}
                </div>
            ) : (
                terminalLogs.map((log, index) => {
                    const isExpandable = log.output && log.output.length > 0;

                    const inputName = log.path.split(/[\\/]/).pop();
                    const inputStem = inputName.replace(/\.[^.]+$/, '');
                    const outputName = conversionMeta ? `${inputStem}_UCT.${conversionMeta.outputExt}` : '';
                    const isCombined = conversionMeta?.combine && conversionMeta.totalCount > 1;
                    const inputDisplay = isCombined
                        ? `${inputName} +${conversionMeta.totalCount - 1} ${t('terminal.files')}`
                        : inputName;

                    const verbKey = !log.isFinished ? 'terminal.verb_converting'
                        : log.success ? 'terminal.verb_success'
                        : 'terminal.verb_failed';
                    const verb = t(verbKey);

                    return (
                        <div key={log.path} className="mb-2">
                            <div className="flex cursor-pointer items-center gap-2 h-8" onClick={() => isExpandable && toggleExpand(index)}>
                                {log.isFinished ? (
                                    log.success ? (
                                        <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                                    ) : (
                                        <XCircleIcon className="h-5 w-5 flex-shrink-0 text-red-500" />
                                    )
                                ) : (
                                    <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                )}
                                <ConversionSummary
                                    verb={verb}
                                    inputDisplay={inputDisplay}
                                    outputName={outputName}
                                    MiddleEllipsis={MiddleEllipsis}
                                    title={`${log.path} → ${outputName}`}
                                />
                                {isExpandable && (
                                    <button className="ml-auto p-2 rounded-full hover:bg-zinc-950/5 dark:hover:bg-white/5">
                                        <ChevronDownIcon className={clsx("h-4 w-4 transition-transform", log.isExpanded && "rotate-180")} />
                                    </button>
                                )}
                            </div>
                            {log.isExpanded && log.output && (
                                <pre className="mt-2 whitespace-pre-wrap rounded-md bg-zinc-800 p-3 text-xs text-zinc-300">
                                    {log.output}
                                </pre>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}
