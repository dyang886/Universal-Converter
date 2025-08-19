import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ChevronDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

import { useApp } from '@/contexts/AppContext';


export default function TerminalOutput() {
    const { t } = useTranslation();
    const { MiddleEllipsis, terminalLogs, setTerminalLogs } = useApp();
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
                <div className="font-mono flex h-full items-center justify-center text-lg text-zinc-500 -translate-y-[0.73rem] -translate-x-1">
                    {t('terminal.waiting_for_conversion')}
                </div>
            ) : (
                terminalLogs.map((log, index) => {
                    const isExpandable = log.output && log.output.length > 0;
                    const fileName = log.messageVars?.file?.split(/[\\/]/).pop() || '';
                    const displayVars = { ...log.messageVars, file: fileName };

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
                                <div className="flex-1 min-w-0" title={log.messageVars?.file}>
                                    <MiddleEllipsis text={t(log.messageKey, displayVars)} />
                                </div>
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
