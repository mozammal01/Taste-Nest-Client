"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function ErrorModal({ isOpen, title, description, onClose }: ErrorModalProps) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
          />
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8"
          >
            {/* Close */}
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Header */}
            <div className="flex flex-col items-center space-y-6">
              <AlertCircle className="w-16 h-16 text-red-600" />
              <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/80 text-center mb-4">
                {title}
              </h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm font-medium text-primary underline mb-2"
              >
                {showDetails ? "Hide Details" : "Error Details"}
              </button>
              <AnimatePresence>
                {showDetails && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-base text-slate-600 dark:text-slate-300 text-center max-w-md whitespace-pre-wrap"
                  >
                    {description}
                  </motion.p>
                )}
              </AnimatePresence>
              {/* Action */}
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 bg-linear-to-r from-primary to-primary/80 text-white font-semibold rounded-md hover:from-primary/90 hover:to-primary/70 transition"
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
  showError: (title: string, description: string) => void;
}

const ErrorModalContext = createContext<ContextProps | undefined>(undefined);

export function ErrorModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; description: string }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const showError = (title: string, description: string) => {
    setModalState({ isOpen: true, title, description });
  };

  const close = () => setModalState(prev => ({ ...prev, isOpen: false }));

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
  );
}

export function useErrorModal() {
  const ctx = useContext(ErrorModalContext);
  if (!ctx) throw new Error("useErrorModal must be used within ErrorModalProvider");
  return ctx;
}
