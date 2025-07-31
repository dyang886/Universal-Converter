import {
  Listbox as HeadlessListbox,
  ListboxButton as HeadlessListboxButton,
  ListboxOption as HeadlessListboxOption,
  ListboxOptions as HeadlessListboxOptions,
  MenuSeparator as HeadlessMenuSeparator,
} from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import React from 'react';

function findSelectedChild(children, value) {
  let found = null;
  React.Children.forEach(children, (child) => {
    if (found || !React.isValidElement(child)) return;
    if (child.props.value === value) {
      found = child;
      return;
    }
    if (child.props.children) {
      const recursiveResult = findSelectedChild(child.props.children, value);
      if (recursiveResult) {
        found = recursiveResult;
      }
    }
  });
  return found;
}

export function Listbox({ value, onChange, className, placeholder, children, anchor = 'bottom', ...props }) {
  const displayValue = React.useMemo(() => {
    const selectedChild = findSelectedChild(children, value);
    return React.isValidElement(selectedChild) ? selectedChild.props.children : placeholder;
  }, [value, children, placeholder]);

  return (
    <span className={clsx(className, 'relative block w-full')} {...props}>
      <HeadlessListbox value={value} onChange={onChange}>
        <HeadlessListboxButton
          className={clsx(
            'relative w-full grid appearance-none rounded-lg border border-zinc-950/10 bg-white py-1.5 pl-3 pr-8 text-left text-base/6 text-zinc-950',
            'data-[hover]:border-zinc-950/20 data-[open]:border-zinc-950/20 dark:border-white/10 dark:bg-zinc-900 dark:data-[hover]:border-white/20 dark:data-[open]:border-white/20',
            'focus:outline-none',
            'dark:text-white sm:text-sm/6',
            'data-[disabled]:opacity-50'
          )}
        >
          {displayValue || <span className="text-zinc-500">{placeholder}</span>}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-zinc-500" aria-hidden="true" />
          </span>
        </HeadlessListboxButton>
        <HeadlessListboxOptions
          transition
          anchor={anchor}
          className={clsx(
            'min-w-[var(--button-width)] z-10 mt-1 overflow-y-scroll overscroll-contain rounded-xl bg-white/75 p-1 text-base shadow-lg ring-1 ring-zinc-950/10 backdrop-blur-xl focus:outline-none dark:bg-zinc-800/75 dark:ring-white/10 sm:text-sm',
            'transition duration-100 ease-out data-[leave]:ease-in data-[leave]:duration-75',
            'data-[enter]:opacity-100 data-[leave]:opacity-0'
          )}
        >
          {children}
        </HeadlessListboxOptions>
      </HeadlessListbox>
    </span>
  );
}

export const ListboxOption = React.forwardRef(function ListboxOption({ children, className, ...props }, ref) {
  return (
    <HeadlessListboxOption
      ref={ref}
      {...props}
      className={clsx(
        className,
        'group relative flex cursor-default select-none items-center rounded-lg py-1.5 pl-3 pr-9',
        'text-zinc-950 data-[focus]:bg-blue-500 data-[focus]:text-white dark:text-white'
      )}
    >
      <span className="block truncate font-normal data-[selected]:font-semibold">{children}</span>
      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 group-data-[focus]:text-white [.group:not([data-selected])_&]:hidden">
        <CheckIcon className="h-5 w-5" aria-hidden="true" />
      </span>
    </HeadlessListboxOption>
  );
});

export const ListboxHeading = React.forwardRef(function ListboxHeading({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      className={clsx(className, "px-3.5 pt-2 pb-1 text-sm/5 font-medium text-zinc-500 sm:px-3 sm:text-xs/5 dark:text-zinc-400")}
    />
  );
});

export function ListboxDivider({ className, ...props }) {
  return (
    <HeadlessMenuSeparator
      {...props}
      className={clsx(
        className,
        'col-span-full mx-3.5 my-1 h-px border-0 bg-zinc-950/5 sm:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]'
      )}
    />
  );
}
