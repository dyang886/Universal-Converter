import React from 'react';

export default function TerminalOutput() {
    // In the future, you'll get logs from the AppContext
    // const { terminalLogs } = useApp();

    return (
        <div className="flex flex-col items-center justify-center grow text-center">
            <h1 className="text-2xl font-bold">Terminal Output</h1>
            <p className="text-gray-500 mt-2">Conversion logs will appear here in real-time.</p>
        </div>
    );
}