"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { getErrorMessage, extractMessageFromString } from '@/lib/getErrorMessage';
interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  description: any;
  onClose: () => void;
}

export function ErrorModal({ isOpen, title, description, onClose }: ErrorModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  console.log(description)

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
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/80 text-center mb-4 leading-tight">
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
  showError: (titleOrError: string | unknown, description?: any) => void;
}

const ErrorModalContext = createContext<ContextProps | undefined>(undefined);

export function ErrorModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<{ isOpen: boolean; title: string; description: any }>({
    isOpen: false,
    title: "",
    description: {},
  });
  console.log(modalState)

  /**
 * Show an error modal.
 * Can be called with a plain title string (old usage) OR with an
 * error object (e.g., Axios, fetch, React Query). The function detects the
 * type of the first argument and resolves the title appropriately.
 */
/**
   * Show an error modal.
   * If the first argument is a string, it is treated as a custom title and the optional second
   * argument is used as the description (backward‑compatible behavior).
   * If the first argument is an error object, we use a generic title "Error" and place the extracted
   * message in the description, so the UI displays the backend message in the description area.
   */
  const showError = (titleOrError: unknown, description?: any) => {
    // If caller provides a custom title (string) and there is no description JSON,
    // keep backward‑compatible behavior.
    if (typeof titleOrError === 'string' && typeof description === 'undefined') {
      setModalState({ isOpen: true, title: titleOrError, description: '' });
      return;
    }
    // If the first argument is a JSON string (the description coming from the backend),
    // try to parse it and extract the "message" field.
    if (typeof titleOrError === 'string') {
      try {
        const parsed = JSON.parse(titleOrError);
        const msg = parsed?.message ?? 'Error';
        setModalState({ isOpen: true, title: msg, description: titleOrError });
        return;
      } catch {
        // Not a valid JSON – fall back to treating it as a plain title.
        // Swap title and description so the descriptive message is the main title.
        const cleanTitle = typeof description === 'string' ? extractMessageFromString(description) : (description ?? titleOrError);
        setModalState({ isOpen: true, title: cleanTitle, description: description ? titleOrError : '' });
        return;
      }
    }
    // Otherwise treat it as an error object (e.g., API response object).
    let rawDescription = '';
    try {
      rawDescription = JSON.stringify(titleOrError);
    } catch {
      rawDescription = String(titleOrError);
    }
    const extractedMessage = getErrorMessage(titleOrError);
    const modalTitle = extractedMessage !== 'Something went wrong' ? extractedMessage : 'Error';
    console.log('showError called with', titleOrError);
    console.log('computed modalTitle', modalTitle);
    setModalState({ isOpen: true, title: modalTitle, description: rawDescription });
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
