"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertCircle, ShieldAlert, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Esc key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop with enhanced blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 p-10 font-sans"
          >
            <div className="flex flex-col items-center text-center">
              {/* Animated Icon Circle */}
              <div className="relative mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50"
                />
                <div className="relative w-24 h-24 bg-red-50 rounded-[32px] flex items-center justify-center border-2 border-red-100 rotate-3">
                  <AlertCircle className="w-12 h-12 text-red-500 -rotate-3" />
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                {title}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed px-2">
                {description} <br />
                <span className="text-primary font-black mt-2 inline-block">
                  &quot;{itemName}&quot;
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 w-full mt-10">
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="group relative w-full h-16 rounded-2xl bg-primary text-white font-bold text-lg overflow-hidden transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-6 h-6 transition-transform group-hover:rotate-12" />
                        <span>Delete Item</span>
                      </>
                    )}
                  </div>
                </button>

                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full h-16 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold text-lg hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {/* Footer Security Badge */}
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 opacity-30">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Secure Action Required
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
