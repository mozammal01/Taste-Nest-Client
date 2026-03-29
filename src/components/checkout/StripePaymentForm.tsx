"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: (transactionId: string) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  amount: number;
  address: string;
  phone: string;
}

export default function StripePaymentForm({ 
  clientSecret, 
  onSuccess, 
  isProcessing, 
  setIsProcessing,
  amount,
  address,
  phone
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    if (!address || !phone) {
      toast.error("Please fill in your delivery address and phone number", {
        description: "These details are required for delivery coordination.",
        icon: <ShieldCheck className="w-5 h-5 text-red-500" />
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        setIsProcessing(false);
        return;
    }

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (paymentError) {
      setError(paymentError.message || "An error occurred with your payment.");
      toast.error(paymentError.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1a1a1a",
        fontFamily: "Inter, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="relative overflow-hidden p-6 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-inner group">
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Card Information</span>
            <div className="flex gap-1.5 opacity-60">
                <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
                <div className="w-8 h-5 bg-gray-200 rounded-sm"></div>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl border-2 border-gray-100 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
          <CardElement options={cardElementOptions} onChange={(e) => setError(e.error ? e.error.message : null)} />
        </div>
        
        <AnimatePresence>
            {error && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 text-sm text-red-500 font-medium flex items-center gap-1.5"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {error}
                </motion.p>
            )}
        </AnimatePresence>

        {/* Decorative corner element */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors pointer-events-none" />
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-tight">Secure 256-bit SSL encrypted payment</span>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!stripe || isProcessing || !address || !phone}
        className="relative w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="uppercase tracking-widest text-xs font-bold">Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-lg">Pay ${amount.toFixed(2)}</span>
            <div className="h-4 w-px bg-white/30 mx-1" />
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
      </Button>

      <div className="flex justify-center">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
              <span>Powered by</span>
              <span className="font-black text-gray-500">Stripe</span>
          </div>
      </div>
    </div>
  );
}
