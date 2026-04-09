"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Loader2,
  Lock,
  Truck,
  CreditCardIcon,
  ShoppingBag,
  AlertCircle
} from "lucide-react";
import { z } from "zod";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { CartItemWithDetails } from "@/types/cartItem";
import { createOrder } from "@/lib/actions/order";
import { createPaymentIntent } from "@/lib/actions/payment";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import StripePaymentForm from "./StripePaymentForm";
import { cn } from "@/lib/utils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const checkoutSchema = z.object({
  address: z.string().min(5, "Delivery address must be at least 5 characters long"),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
});

interface CheckoutFormProps {
  items: CartItemWithDetails[];
  userId: string;
}

export default function CheckoutForm({ items }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + Number(item.menuItem.price) * item.quantity, 0);
  const deliveryFee = items.some((item) => item.menuItem.freeDelivery) ? 0 : subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.1; // 10% tax
  const totalAmount = subtotal + deliveryFee + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFetchClientSecret = useCallback(async () => {
    if (paymentMethod === "card" && !clientSecret) {
      setIsSubmitting(true);
      const result = await createPaymentIntent(totalAmount);
      if (result.success) {
        setClientSecret(result.data.clientSecret);
      } else {
        toast.error("Stripe is not configured or failed to initialize.");
        setPaymentMethod("cod");
      }
      setIsSubmitting(false);
    }
  }, [paymentMethod, clientSecret, totalAmount]);

  useEffect(() => {
    const initPayment = async () => {
      if (paymentMethod === "card" && !clientSecret) {
        await handleFetchClientSecret();
      }
    };
    initPayment();
  }, [paymentMethod, clientSecret, handleFetchClientSecret]);

  const handleOrderSubmission = async (transactionId?: string) => {
    const orderItems = items.map(item => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
      price: Number(item.menuItem.price)
    }));

    const result = await createOrder({
      items: orderItems,
      totalAmount,
      address: formData.address,
      phone: formData.phone,
      transactionId,
      paymentStatus: transactionId ? 'paid' : 'unpaid'
    });

    if (result.success) {
      setIsSuccess(true);
      setOrderId(result.data.id);
      toast.success("Order placed successfully!");
    } else {
      toast.error(result.message || "Failed to place order");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Zod Validation
    const validationResult = checkoutSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please correct the delivery details.");
      return;
    }

    if (paymentMethod === "cod") {
      setIsSubmitting(true);
      await handleOrderSubmission();
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center space-y-10"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full transform scale-150 animate-pulse" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative w-32 h-32 bg-green-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-green-500/40"
          >
            <CheckCircle2 className="w-16 h-16 text-white" />
          </motion.div>
        </div>

        <div className="space-y-4 max-w-lg">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Chef says: <span className="text-primary underline decoration-green-500 underline-offset-8">Order Confirmed!</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed">
            Your culinary masterpiece is being prepared. Our courier is already warming up their engine.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-full border border-slate-100 dark:border-slate-700">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Reference: #ORD-{orderId}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-4">
          <Link href="/user/orders">
            <AnimatedButton variant="primary" size="xl" className="font-black uppercase tracking-widest px-12">
              Track Journey
              <ArrowRight className="w-5 h-5" />
            </AnimatedButton>
          </Link>
          <Link href="/">
            <AnimatedButton variant="ghost" size="xl" className="font-black uppercase tracking-widest px-12">
              Return Home
            </AnimatedButton>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Left Column: Details */}
      <div className="lg:col-span-7 space-y-12">
        {/* Step 1: Destination */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Destination
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 01 / 02</span>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 group hover:border-primary/20 transition-all duration-500">
            <div className="space-y-3">
              <Label 
                htmlFor="address" 
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                  errors.address ? "text-red-500" : "text-slate-400"
                )}
              >
                Delivery Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input
                  id="address"
                  name="address"
                  placeholder="Street name, building number, area..."
                  value={formData.address}
                  onChange={handleChange}
                  className={cn(
                    "pl-14 h-16 transition-all rounded-2xl font-bold text-slate-700 dark:text-white border-2",
                    errors.address 
                      ? "border-red-500 bg-red-50/10" 
                      : "border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800"
                  )}
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.address && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 mt-2 text-[10px] font-black uppercase text-red-500 tracking-wider"
                  >
                    <AlertCircle size={14} />
                    {errors.address}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="phone" 
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
                  errors.phone ? "text-red-500" : "text-slate-400"
                )}
              >
                Contact Signal
              </Label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Your mobile for the courier"
                  value={formData.phone}
                  onChange={handleChange}
                  className={cn(
                    "pl-14 h-16 transition-all rounded-2xl font-bold text-slate-700 dark:text-white border-2",
                    errors.phone 
                      ? "border-red-500 bg-red-50/10" 
                      : "border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800"
                  )}
                />
              </div>
              <AnimatePresence mode="wait">
                {errors.phone && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 mt-2 text-[10px] font-black uppercase text-red-500 tracking-wider"
                  >
                    <AlertCircle size={14} />
                    {errors.phone}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Step 2: Transaction */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Transaction
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 02 / 02</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <div 
              onClick={() => setPaymentMethod("cod")}
              className={cn(
                "group flex items-center gap-4 p-6 rounded-3xl cursor-pointer transition-all duration-500 border-2",
                paymentMethod === "cod" 
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                  : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                paymentMethod === "cod" ? "bg-white dark:bg-slate-800 text-primary shadow-lg shadow-primary/10" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
              )}>
                <Truck className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <p className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Hand-to-Hand</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Cash on Delivery</p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                paymentMethod === "cod" ? "border-primary bg-primary" : "border-slate-200 dark:border-slate-700"
              )}>
                {paymentMethod === "cod" && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            </div>

            <div 
              onClick={() => setPaymentMethod("card")}
              className={cn(
                "group flex items-center gap-4 p-6 rounded-3xl cursor-pointer transition-all duration-500 border-2",
                paymentMethod === "card" 
                  ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" 
                  : "border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110",
                paymentMethod === "card" ? "bg-white dark:bg-slate-800 text-primary shadow-lg shadow-primary/10" : "bg-slate-50 dark:bg-slate-800 text-slate-400"
              )}>
                <CreditCardIcon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Digital Vault</p>
                  <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Swift</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Stripe Integrated</p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                paymentMethod === "card" ? "border-primary bg-primary" : "border-slate-200 dark:border-slate-700"
              )}>
                {paymentMethod === "card" && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === "card" && clientSecret ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-8 mt-6 border-t border-slate-100 dark:border-slate-800"
                >
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm 
                      clientSecret={clientSecret} 
                      amount={totalAmount}
                      isProcessing={isSubmitting}
                      setIsProcessing={setIsSubmitting}
                      onSuccess={handleOrderSubmission}
                      address={formData.address}
                      phone={formData.phone}
                    />
                  </Elements>
                </motion.div>
              ) : paymentMethod === "card" && isSubmitting && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 gap-4 bg-slate-50 dark:bg-slate-800/50 rounded-[32px]">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Securing Payment Channel...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Right Column: Manifest */}
      <div className="lg:col-span-5">
        <div className="sticky top-12 space-y-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="w-1.5 h-6 bg-slate-900 dark:bg-white rounded-full"></div>
            Manifest
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm border-b-primary/30 border-b-4 group overflow-hidden">
            <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {items.map((item) => (
                <motion.div layout key={item.id} className="flex gap-4 group/item">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 group-hover/item:border-primary/20 transition-all duration-500 shrink-0">
                    <Image
                      src={item.menuItem.image || "/placeholder.png"}
                      alt={item.menuItem.name}
                      fill
                      className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-black text-slate-900 dark:text-white truncate tracking-tight uppercase text-xs">{item.menuItem.name}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-black text-primary bg-primary/5 dark:bg-primary/10 px-2 py-0.5 rounded-full ring-1 ring-primary/10">x{item.quantity}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        @ ${Number(item.menuItem.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end">
                    <p className="font-black text-slate-900 dark:text-white tracking-tighter text-sm">
                      ${(Number(item.menuItem.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center group/line">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/line:text-slate-600 transition-colors">Net Origin</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center group/line">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/line:text-slate-600 transition-colors">Logistics</span>
                {deliveryFee === 0 ? (
                  <span className="text-[9px] font-black uppercase text-green-500 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full ring-1 ring-green-500/20">Complimentary</span>
                ) : (
                  <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">${deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between items-center group/line">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/line:text-slate-600 transition-colors">Contribution (10%)</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">${tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-8 border-t-2 border-dashed border-slate-100 dark:border-slate-800 mt-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Valuation</span>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Guaranteed Safe</span>
                    </div>
                  </div>
                  <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic border-b-4 border-primary">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {paymentMethod === "cod" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AnimatedButton
                    type="submit"
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    size="xl"
                    className="w-full mt-10 font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
                  >
                    Authenticate Order
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </AnimatedButton>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-8 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-500 border-t border-slate-50 dark:border-slate-800">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={32} height={12} />
              <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={28} height={16} />
              <div className="h-4 w-px bg-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">PCI DSS</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}


