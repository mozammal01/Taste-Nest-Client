"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Trash2, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartItemCard from "./CartItem";
import type { CartItemWithDetails } from "@/types/cartItem";
import { clearCart } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface CartProps {
  items: CartItemWithDetails[];
}

export default function Cart({ items }: CartProps) {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const deliveryFee = items.some((item) => item.menuItem.freeDelivery) ? 0 : subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryFee + tax;

  const handleClearCart = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;

    setIsClearing(true);
    const result = await clearCart();
    if (result.success) {
      toast.success("Cart cleared successfully");
    } else {
      toast.error(result.message);
    }
    router.refresh();
    setIsClearing(false);
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven&apos;t added any items to your cart yet. Start exploring our delicious menu!
        </p>
        <Link href="/menu">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl text-lg font-semibold">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Browse Menu
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-gray-500">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={handleClearCart}
            disabled={isClearing}
          >
            {isClearing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
            Clear Cart
          </Button>
        </div>

        {/* Items List */}
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <CartItemCard key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>

        {/* Continue Shopping */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-4">
          <Link href="/menu">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

          {/* Summary Items */}
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="text-green-600 font-medium">Free</span>
              ) : (
                <span className="font-medium">${deliveryFee.toFixed(2)}</span>
              )}
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>

            {deliveryFee > 0 && subtotal < 50 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm">
                <p className="text-amber-700">
                  Add <span className="font-bold">${(50 - subtotal).toFixed(2)}</span> more for free delivery!
                </p>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button variant="outline" className="px-4">
                Apply
              </Button>
            </div>
          </div>

          {/* Checkout Button */}
          <Link href="/checkout" className="block w-full">
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white py-6 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>
          </Link>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Secure checkout powered by Stripe</span>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Fresh Quality</p>
            <p className="text-xs text-gray-500">100% guaranteed</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
            <p className="text-xs text-gray-500">30-45 minutes</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
