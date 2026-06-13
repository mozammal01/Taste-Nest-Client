"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

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
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-slate-100 p-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600 mb-6">{description}</p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
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
