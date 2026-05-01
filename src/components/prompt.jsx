import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { InformationCircleIcon, XCircleIcon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/16/solid'
import { ArrowLongRightIcon } from '@heroicons/react/24/outline'

const AlertContext = createContext()

export function usePrompt() {
  return useContext(AlertContext)
}

export function PromptProvider({ children }) {
  const [prompts, setPrompts] = useState([])

  const showPrompt = useCallback((type, message, options = {}) => {
    const id = Date.now() + Math.random()
    const {
      currentVersion = null,
      latestVersion = null,
      actions = [],
      duration = 5000,
    } = options
    setPrompts(prev => [{ id, type, message, currentVersion, latestVersion, actions, duration }, ...prev])
  }, [])

  const removePrompt = useCallback(id => {
    setPrompts(prev => prev.filter(p => p.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ showPrompt }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col-reverse space-y-2 space-y-reverse z-50">
        {prompts.map(prompt => (
          <Prompt
            key={prompt.id}
            {...prompt}
            onClose={() => removePrompt(prompt.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  )
}

function Prompt({ id, type, message, currentVersion, latestVersion, actions, duration, onClose }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setClosing(true), duration)
    return () => clearTimeout(timer)
  }, [id, duration])

  const handleClose = useCallback(() => setClosing(true), [])

  const handleAnimationEnd = useCallback(() => {
    if (closing) onClose()
  }, [closing, onClose])

  const animationClass = closing ? 'animate-fadeOutShift' : 'animate-fadeInShift'

  if (type === 'update') {
    return (
      <div
        className={`flex flex-col ml-auto w-64 p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md ${animationClass}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{message}</p>
            {currentVersion && latestVersion && (
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 font-mono flex items-center gap-1">
                {currentVersion}
                <ArrowLongRightIcon className="h-3.5 w-3.5 shrink-0" />
                {latestVersion}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => { action.onClick(); handleClose(); }}
            className="mt-2.5 w-full bg-zinc-900 dark:bg-zinc-600 text-white text-xs py-1.5 rounded-md font-medium hover:bg-zinc-700 dark:hover:bg-zinc-500 transition-colors cursor-pointer"
          >
            {action.label}
          </button>
        ))}
      </div>
    )
  }

  const baseClasses = {
    info: 'text-blue-600 dark:text-blue-400 border-l-blue-500 dark:border-l-blue-400',
    success: 'text-green-600 dark:text-green-400 border-l-green-500 dark:border-l-green-400',
    warning: 'text-amber-600 dark:text-amber-400 border-l-amber-500 dark:border-l-amber-400',
    error: 'text-red-600 dark:text-red-400 border-l-red-500 dark:border-l-red-400',
    modal: 'text-red-600 dark:text-red-400 border-l-red-500 dark:border-l-red-400',
  }

  const icons = {
    info: InformationCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    modal: ExclamationCircleIcon,
  }
  const Icon = icons[type] || InformationCircleIcon

  return (
    <div
      className={`flex ml-auto max-w-max items-center px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 border-l-4 shadow-md ${baseClasses[type] || ''} ${animationClass}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon className="flex-shrink-0 w-4 h-4" />
      <span className="sr-only">{type}</span>
      <div className="ms-3 text-sm font-medium text-zinc-800 dark:text-zinc-100">{message}</div>
      <button
        className="ms-3 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
        onClick={handleClose}
        aria-label="Close prompt"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
