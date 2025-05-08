import React from 'react';
import clsx from 'clsx';
import { ArrowUpTrayIcon } from '@heroicons/react/16/solid';

const DropZone = React.forwardRef(({ children, className, isOverDropZone, onClick }, ref) => {
  return (
    <button
      type="button"
      ref={ref}
      className={clsx(
        'relative block w-64 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-10 text-center hover:border-gray-400 dark:hover:border-gray-500',
        isOverDropZone && 'dark:bg-zinc-800 bg-gray-100',
        className
      )}
      onClick={onClick}
    >
      <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <span className="mt-2 block text-base font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </span>
    </button>
  );
});

export default DropZone;