"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Check, 
  AlertCircle, 
  Star, 
  Clock, 
  ShieldCheck, 
  Truck, 
  MessageCircle,
  ArrowLeft,
  Heart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/animated-button";
import { createCartItem } from "@/lib/actions/cart";
import { useSession } from "@/lib/auth-client";
import type { MenuItem } from "@/types/menuItems";
import Link from "next/link";

interface ItemDetailsProps {
  item: MenuItem;
}

export function ItemDetails({ item }: ItemDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isOrderingNow, setIsOrderingNow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user) {
      toast.error("Please sign in to add items to cart", {
        action: { label: "Sign In", onClick: () => router.push("/signin") }
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await createCartItem({
        menuItemId: item.id,
        quantity: quantity,
      });

      if (result.success) {
        toast.success(`Added ${quantity} ${item.name} to cart!`, {
          icon: <Check className="w-5 h-5" />,
          action: { label: "View Cart", onClick: () => router.push("/cart") }
        });
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleOrderNow = async () => {
    if (!session?.user) {
      toast.error("Please sign in to place an order", {
        action: { label: "Sign In", onClick: () => router.push("/signin") }
      });
      return;
    }

    setIsOrderingNow(true);
    try {
      const result = await createCartItem({
        menuItemId: item.id,
        quantity: quantity,
      });

      if (result.success) {
        router.push("/cart");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to process order");
    } finally {
      setIsOrderingNow(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb / Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold uppercase tracking-widest text-xs">Back to Menu</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl border border-white/20"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          {/* Discount Overlay */}
          {item.discount && (
            <div className="absolute top-8 left-8 bg-primary text-white text-sm font-black px-4 py-2 rounded-2xl shadow-xl transform -rotate-3">
              SPECIAL {item.discount} OFF
            </div>
          )}
          {/* Like Button */}
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group hover:bg-white/20 transition-all"
          >
            <Heart className={`w-6 h-6 transition-all ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white group-hover:scale-110"}`} />
          </button>
          
          {/* Decorative Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
        </motion.div>

        {/* Right: Info Section */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {item.category}
              </span>
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-black text-yellow-700 dark:text-yellow-500">4.9 (120+ Reviews)</span>
              </div>
            </div>

            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {item.name}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-primary italic">
                ${item.price}
              </span>
              <span className="text-slate-400 line-through font-bold text-xl">
                ${(item.price * 1.2).toFixed(2)}
              </span>
            </div>

            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {item.content}
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <Clock className="w-5 h-5 text-primary" />
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">Delivery Time</p>
                <p className="text-slate-500">20-30 mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <div className="text-sm">
                <p className="font-bold text-slate-900 dark:text-white">Pure Quality</p>
                <p className="text-slate-500">100% Fresh</p>
              </div>
            </div>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 pt-4"
          >
            {/* Quantity Selector */}
            <div className="flex items-center gap-6">
              <span className="text-sm font-black uppercase tracking-widest text-slate-400">Quantity</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-black hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  -
                </button>
                <span className="text-xl font-black min-w-[30px] text-center text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-black hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <AnimatedButton
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOrderingNow}
                className="flex-1 h-14 rounded-2xl text-lg font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl"
                variant="ripple"
                size="lg"
              >
                {isAddingToCart ? (
                    <span className="w-6 h-6 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </span>
                )}
              </AnimatedButton>

              <AnimatedButton
                onClick={handleOrderNow}
                disabled={isOrderingNow || isAddingToCart}
                className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl shadow-primary/30"
                variant="ripple"
                size="lg"
              >
                {isOrderingNow ? (
                   <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Order Now"
                )}
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Tags / Meta */}
          <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500">
              <Truck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">{item.freeDelivery ? "Free Delivery" : "Fast Delivery"}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase underline cursor-pointer">Live Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
