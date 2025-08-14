import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef, useState, useEffect } from 'react'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/solid'

export function InputGroup({ children }) {
  return (
    <span
      data-slot="control"
      className={clsx(
        'relative isolate block',
        'has-[[data-slot=icon]:first-child]:[&_input]:pl-10 has-[[data-slot=icon]:last-child]:[&_input]:pr-10 sm:has-[[data-slot=icon]:first-child]:[&_input]:pl-8 sm:has-[[data-slot=icon]:last-child]:[&_input]:pr-8',
        '*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-3 *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:top-2.5 sm:*:data-[slot=icon]:size-4',
        '[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5',
        '*:data-[slot=icon]:text-zinc-500 dark:*:data-[slot=icon]:text-zinc-400'
      )}
    >
      {children}
    </span>
  )
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']

export const Input = forwardRef(function Input(
  { className, ...props },

  ref
) {
  return (
    <span
      data-slot="control"
      className={clsx([
        className,
        // Basic layout
        'relative block w-full',
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        'dark:before:hidden',
        // Focus ring
        'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
        // Disabled state
        'has-data-disabled:opacity-50 has-data-disabled:before:bg-zinc-950/5 has-data-disabled:before:shadow-none',
        // Invalid state
        'has-data-invalid:before:shadow-red-500/10',
      ])}
    >
      <Headless.Input
        ref={ref}
        {...props}
        className={clsx([
          // Date classes
          props.type &&
          dateTypes.includes(props.type) && [
            '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
            '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
            '[&::-webkit-datetime-edit]:inline-flex',
            '[&::-webkit-datetime-edit]:p-0',
            '[&::-webkit-datetime-edit-year-field]:p-0',
            '[&::-webkit-datetime-edit-month-field]:p-0',
            '[&::-webkit-datetime-edit-day-field]:p-0',
            '[&::-webkit-datetime-edit-hour-field]:p-0',
            '[&::-webkit-datetime-edit-minute-field]:p-0',
            '[&::-webkit-datetime-edit-second-field]:p-0',
            '[&::-webkit-datetime-edit-millisecond-field]:p-0',
            '[&::-webkit-datetime-edit-meridiem-field]:p-0',
          ],
          // Basic layout
          'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
          // Border
          'border border-zinc-950/10 data-hover:border-zinc-950/20 dark:border-white/10 dark:data-hover:border-white/20',
          // Background color
          'bg-transparent dark:bg-white/5',
          // Hide default focus styles
          'focus:outline-hidden',
          // Invalid state
          'data-invalid:border-red-500 data-invalid:data-hover:border-red-500 dark:data-invalid:border-red-500 dark:data-invalid:data-hover:border-red-500',
          // Disabled state
          'data-disabled:border-zinc-950/20 dark:data-disabled:border-white/15 dark:data-disabled:bg-white/[2.5%] dark:data-hover:data-disabled:border-white/15',
          // System icons
          'dark:scheme-dark',
        ])}
      />
    </span>
  )
})

export const IntegerInput = forwardRef(function IntegerInput(
  { min, max, onChange, value, className, ...props },
  ref
) {
  const [internalValue, setInternalValue] = useState(value ?? '');

  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  const handleChange = (e) => {
    const strValue = e.target.value;
    setInternalValue(strValue);
    if (strValue === '' || strValue === '-') {
      onChange('');
      return;
    }
    if (/^-?\d*$/.test(strValue)) {
      onChange(strValue);
    }
  };

  const handleStep = (step) => {
    const safeMin = isFinite(min) ? BigInt(min) : null;
    const safeMax = isFinite(max) ? BigInt(max) : null;

    const currentValue = (value && value !== '-') ? BigInt(value) : BigInt(0);
    let newValue = currentValue + BigInt(step);

    if (safeMin !== null && newValue < safeMin) newValue = safeMin;
    if (safeMax !== null && newValue > safeMax) newValue = safeMax;

    onChange(newValue.toString());
  };

  const handleBlur = () => {
    if (internalValue === '' || internalValue === '-') {
      onChange('');
      return;
    }

    let numValue = BigInt(internalValue);
    const safeMin = isFinite(min) ? BigInt(min) : null;
    const safeMax = isFinite(max) ? BigInt(max) : null;

    if (safeMin !== null && numValue < safeMin) numValue = safeMin;
    if (safeMax !== null && numValue > safeMax) numValue = safeMax;

    if (numValue.toString() !== value) {
      onChange(numValue.toString());
    }
  };

  return (
    <div className={clsx('relative', className)}>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={clsx(
          'w-full appearance-none rounded-lg border border-zinc-950/10 bg-white px-3 py-1.5 text-zinc-950 placeholder:text-zinc-500',
          'pr-20',
          'focus:outline-none',
          'dark:border-white/10 dark:bg-zinc-900 dark:text-white',
          '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          '[-moz-appearance:textfield]'
        )}
        {...props}
      />
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          className="rounded-md border border-transparent p-1.5 text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Decrement"
          disabled={props.disabled || (value !== '' && isFinite(min) && BigInt(value) <= BigInt(min))}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleStep(1)}
          className="rounded-md border border-transparent p-1.5 text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Increment"
          disabled={props.disabled || (value !== '' && isFinite(max) && BigInt(value) >= BigInt(max))}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

export const FloatInput = forwardRef(function FloatInput(
  { min, max, onChange, value, className, ...props },
  ref
) {
  const [internalValue, setInternalValue] = useState(value ?? '');

  useEffect(() => {
    setInternalValue(value ?? '');
  }, [value]);

  const handleChange = (e) => {
    const strValue = e.target.value;
    setInternalValue(strValue);

    if (strValue === '' || strValue === '-') {
      onChange('');
      return;
    }

    if (/^-?\d*\.?\d*$/.test(strValue)) {
      onChange(strValue);
    }
  };

  const handleStep = (step) => {
    const currentValue = (value && value !== '-') ? Number(value) : 0;
    let newValue = currentValue + step;

    if (isFinite(min) && newValue < min) newValue = min;
    if (isFinite(max) && newValue > max) newValue = max;

    onChange(Number(newValue.toPrecision(15)).toString());
  };

  const handleBlur = () => {
    if (internalValue === '' || internalValue === '-' || internalValue.toString().endsWith('.')) {
      onChange('');
      return;
    }

    let numValue = Number(internalValue);

    if (isNaN(numValue)) {
      onChange('');
      return;
    }

    if (isFinite(min) && numValue < min) numValue = min;
    if (isFinite(max) && numValue > max) numValue = max;

    if (numValue.toString() !== value) {
      onChange(numValue.toString());
    }
  };

  return (
    <div className={clsx('relative', className)}>
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={clsx(
          'w-full appearance-none rounded-lg border border-zinc-950/10 bg-white px-3 py-1.5 text-zinc-950 placeholder:text-zinc-500',
          'pr-20',
          'focus:outline-none',
          'dark:border-white/10 dark:bg-zinc-900 dark:text-white',
          '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          '[-moz-appearance:textfield]'
        )}
        {...props}
      />
      <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center">
        <button
          type="button"
          onClick={() => handleStep(-0.1)}
          className="rounded-md border border-transparent p-1.5 text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Decrement"
          disabled={props.disabled || (value !== '' && isFinite(min) && Number(value) <= min)}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => handleStep(0.1)}
          className="rounded-md border border-transparent p-1.5 text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Increment"
          disabled={props.disabled || (value !== '' && isFinite(max) && Number(value) >= max)}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
