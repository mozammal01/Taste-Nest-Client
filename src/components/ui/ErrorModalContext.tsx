"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X } from "lucide-react"

interface ErrorModalProps {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
}

export function ErrorModal({ isOpen, title, description, onClose }: ErrorModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-transparent rounded-2xl shadow-2xl p-6"
          >
            {/* Close Button */}
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-base text-slate-600 dark:text-slate-300 text-center mb-6">{description}</p>
              <button
                onClick={onClose}
                className="w-full py-2 bg-linear-to-r from-primary to-primary/80 text-white rounded-md hover:from-primary/90 hover:to-primary/70 transition"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ContextProps {
  showError: (title: string, description: string) => void
}

const ErrorModalContext = createContext<ContextProps | undefined>(undefined)

export function ErrorModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; description: string }>({
    isOpen: false,
    title: "",
    description: "",
  })

  const showError = (title: string, description: string) => {
    setModalState({ isOpen: true, title, description })
  }

  const close = () => setModalState(prev => ({ ...prev, isOpen: false }))

  return (
    <ErrorModalContext.Provider value={{ showError }}>
      {children}
      <ErrorModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        description={modalState.description}
        onClose={close}
      />
    </ErrorModalContext.Provider>
  )
}

export function useErrorModal() {
  const ctx = useContext(ErrorModalContext)
  if (!ctx) throw new Error("useErrorModal must be used within ErrorModalProvider")
  return ctx
}
