import React from 'react';
import { useApp } from '@/contexts/AppContext';

export default function AdvancedOptions() {
    const { filePaths } = useApp();

    return (
        <div className="flex flex-col items-center justify-center grow text-center">
            <h1 className="text-2xl font-bold">Advanced Options</h1>
            <p className="text-gray-500 mt-2">Configuration settings will go here.</p>
            {filePaths.length > 0 && (
                <p className="mt-4 text-sm text-blue-400">
                    These options will apply to the {filePaths.length} file(s) you've selected.
                </p>
            )}
        </div>
    );
}