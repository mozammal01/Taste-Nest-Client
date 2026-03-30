"use client";

import { useState } from "react";
import { cancelReservation } from "@/lib/actions/reservation";
import { toast } from "sonner";
import { ChevronRight, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function CancelButton({ id, status }: { id: number, status: string }) {
  const [isPending, setIsPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setIsPending(true);
    try {
      const result = await cancelReservation(id);
      if (result.success) {
        toast.success("Reservation cancelled successfully");
        setShowConfirm(false);
      } else {
        toast.error(result.message || "Failed to cancel reservation");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (status.toLowerCase() === 'cancelled') {
    return (
      <Button disabled variant="ghost" className="w-full text-slate-300 rounded-xl font-bold text-xs uppercase tracking-widest h-14">
        Already Cancelled
      </Button>
    );
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {!showConfirm ? (
          <motion.div
            key="cancel-trigger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Button 
              variant="ghost" 
              onClick={() => setShowConfirm(true)}
              className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-[24px] font-black text-xs transition-all uppercase tracking-widest h-14 group"
            >
              Cancel Reservation
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="confirm-box"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-6 bg-red-50 rounded-[32px] border border-red-100 space-y-4 shadow-xl shadow-red-500/5"
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-black uppercase tracking-tight">Confirm Cancellation?</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-12 rounded-2xl bg-white text-slate-900 border border-slate-200 font-bold text-xs hover:bg-slate-50 transition-all uppercase tracking-widest leading-none shadow-sm"
              >
                No
              </Button>
              <Button 
                onClick={handleCancel}
                disabled={isPending}
                className="flex-1 h-12 rounded-2xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition-all uppercase tracking-widest leading-none shadow-lg shadow-red-600/20"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Cancel"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
