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
import { Button } from "@/components/ui/button";
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Order Confirmed!</h2>
        <p className="text-gray-600 mb-2 max-w-md font-medium">
          Thank you for your order! Your delicious food is being prepared and will be at your doorstep soon.
        </p>
        <div className="bg-gray-50 px-4 py-2 rounded-full mb-8 border border-gray-100">
            <p className="text-primary font-bold uppercase tracking-widest text-xs">Order Reference: #{orderId}</p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/orders">
            <Button className="bg-primary hover:bg-primary/90 px-6 py-3 h-14 rounded-xl font-bold transition-all hover:shadow-xl hover:shadow-primary/25 active:scale-95">
              Track My Order
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="px-6 py-3 h-14 rounded-xl font-bold border-2 border-gray-50 hover:bg-gray-50 transition-all active:scale-95">
              Return Home
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Delivery Information */}
      <div className="lg:col-span-7 space-y-8">
        <section className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Delivery Details</h2>
            </div>
            
            <Card className="border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden ring-1 ring-black/2">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <Label 
                    htmlFor="address" 
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      errors.address ? "text-red-500" : "text-slate-700"
                    )}
                  >
                    Delivery Address
                  </Label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street name, building number, area..."
                      value={formData.address}
                      onChange={handleChange}
                      className={cn(
                        "pl-12 h-14 transition-all rounded-xl font-medium border-2",
                        errors.address 
                          ? "border-red-500 bg-red-50/50" 
                          : "border-gray-100 bg-gray-50/30 focus:border-primary/20 focus:bg-white"
                      )}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {errors.address && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-600 overflow-hidden"
                      >
                        <AlertCircle size={14} className="shrink-0" />
                        {errors.address}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3">
                  <Label 
                    htmlFor="phone" 
                    className={cn(
                      "text-xs font-bold uppercase tracking-widest transition-colors",
                      errors.phone ? "text-red-500" : "text-slate-700"
                    )}
                  >
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your contact number for the courier"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(
                        "pl-12 h-14 transition-all rounded-xl font-medium border-2",
                        errors.phone 
                          ? "border-red-500 bg-red-50/50" 
                          : "border-gray-100 bg-gray-50/30 focus:border-primary/20 focus:bg-white"
                      )}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {errors.phone && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-600 overflow-hidden"
                      >
                        <AlertCircle size={14} className="shrink-0" />
                        {errors.phone}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
        </section>

        {/* Payment Method Selection */}
        <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Payment Method</h2>
            </div>

            <Card className="border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden ring-1 ring-black/2">
              <CardContent className="p-6 space-y-3">
                <div 
                  onClick={() => setPaymentMethod("cod")}
                  className={`group flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === "cod" 
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
                      : "border-gray-50 bg-white hover:border-gray-100 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
                    paymentMethod === "cod" ? "bg-white text-primary shadow-sm" : "bg-gray-50 text-gray-400"}`}>
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 leading-tight">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay at your door</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === "cod" ? "border-primary bg-primary" : "border-gray-200"}`}>
                    <AnimatePresence mode="wait">
                        {paymentMethod === "cod" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod("card")}
                  className={`group flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === "card" 
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
                      : "border-gray-50 bg-white hover:border-gray-100 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
                    paymentMethod === "card" ? "bg-white text-primary shadow-sm" : "bg-gray-50 text-gray-400"}`}>
                    <CreditCardIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900 leading-tight">Pay Online</p>
                        <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest">Recommended</span>
                    </div>
                    <p className="text-xs text-gray-500 tracking-tight">Credit or Debit Card</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    paymentMethod === "card" ? "border-primary bg-primary" : "border-gray-200"}`}>
                    <AnimatePresence mode="wait">
                        {paymentMethod === "card" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <CheckCircle2 className="w-3 h-3 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>

                <AnimatePresence>
                    {paymentMethod === "card" && clientSecret && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-4 mt-2 border-t border-gray-100 overflow-hidden"
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
                    )}
                </AnimatePresence>
                
                {paymentMethod === "card" && isSubmitting && !clientSecret && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-6 gap-2 bg-gray-50 rounded-xl">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Initializing Stripe...</p>
                    </motion.div>
                )}
              </CardContent>
            </Card>
        </section>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-5">
        <div className="sticky top-12 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-gray-900" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Order Summary</h2>
            </div>

            <Card className="border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden ring-1 ring-black/2">
              <CardContent className="p-6">
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <motion.div layout key={item.id} className="flex gap-4 group">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-transparent group-hover:border-primary/10 transition-all shrink-0">
                        <Image
                          src={item.menuItem.image || "/placeholder.png"}
                          alt={item.menuItem.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-gray-900 truncate tracking-tight">{item.menuItem.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                          {item.quantity} x ${Number(item.menuItem.price).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                        <p className="font-bold text-gray-900 tracking-tight">
                          ${(Number(item.menuItem.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <span>Subtotal</span>
                    <span className="text-gray-900 text-xs">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span className="text-gray-900 text-xs">${deliveryFee.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <span>Tax (10%)</span>
                    <span className="text-gray-900 text-xs">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                      <span className="text-2xl font-bold text-primary tracking-tighter">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {paymentMethod === "cod" && (
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-6 h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Placing Order...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Place COD Order</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        )}
                    </Button>
                )}

                <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        <Lock className="w-3 h-3 text-gray-400" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Encrypted Security</span>
                    </div>
                    <div className="flex gap-4 items-center opacity-40">
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" width={30} height={20} />
                        <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" width={30} height={20} />
                    </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </form>
  );
}


