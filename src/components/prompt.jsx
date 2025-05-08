import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { InformationCircleIcon, XCircleIcon, CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/16/solid'

// 1) Create a context to expose showPrompt()
const AlertContext = createContext()

// 2) Custom hook to consume the prompt context
export function usePrompt() {
  return useContext(AlertContext)
}

// 3) Provider component wraps your app
export function PromptProvider({ children }) {
  // Stack of prompts; newest first
  const [prompts, setPrompts] = useState([])

  // Show a new prompt
  const showPrompt = useCallback((type, message, modalContent = null) => {
    const id = Date.now() + Math.random()
    setPrompts(prev => [{ id, type, message, modalContent }, ...prev])
  }, [])

  // Remove a prompt by id
  const removePrompt = useCallback(id => {
    setPrompts(prev => prev.filter(p => p.id !== id))
  }, [])

  return (
    <AlertContext.Provider value={{ showPrompt }}>
      {children}
      {/* 4) Prompt container, fixed top-right */}
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

// 5) Individual Prompt component with fadeInShift and fadeOutShift
function Prompt({ id, type, message, modalContent, onClose }) {
  const [closing, setClosing] = useState(false)

  // Auto-start close after 5s
  useEffect(() => {
    const timer = setTimeout(() => setClosing(true), 5000)
    return () => clearTimeout(timer)
  }, [id])

  // User-triggered close
  const handleClose = useCallback(() => setClosing(true), [])

  // When fade-out animation ends, call onClose to remove
  const handleAnimationEnd = useCallback(() => {
    if (closing) onClose()
  }, [closing, onClose])

  // Tailwind classes per type
  const baseClasses = {
    info: 'text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400',
    success: 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400',
    warning: 'text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300',
    error: 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400',
    modal: 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400'
  }

  // Icon per type
  const icons = {
    info: InformationCircleIcon,
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    modal: ExclamationCircleIcon
  }
  const Icon = icons[type] || InformationCircleIcon

  const animationClass = closing ? 'animate-fadeOutShift' : 'animate-fadeInShift'

  return (
    <div
      className={`flex ml-auto max-w-max items-center p-4 rounded-lg ${baseClasses[type] || ''} ${animationClass}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon className="flex-shrink-0 w-5 h-5" />
      <span className="sr-only">{type}</span>
      <div className="ms-3 text-sm font-medium">{message}</div>
      <button
        className="ms-2 inline-flex items-center justify-center w-6 h-6 cursor-pointer"
        onClick={handleClose}
        aria-label="Close prompt"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  )
}
