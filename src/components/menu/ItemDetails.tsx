"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Check, 
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
import { cn } from "@/lib/utils";

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

      {/* Requirement 4: Separate Sections for Specifications & Reviews */}
      <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Specifications Section */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Chef&apos;s <span className="text-primary italic">Specifications</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { label: "Ingredients", value: "Prime Cut, Himalayan Salt, Organic Herbs" },
                 { label: "Nutritional Value", value: "450 Calories / 35g Protein" },
                 { label: "Preparation Time", value: "25 Minutes" },
                 { label: "Allergens", value: "None (Gluten Free Available)" },
                 { label: "Chef Recommendation", value: "Medium Rare" },
                 { label: "Signature Style", value: "Wood-Fired Grilling" }
               ].map((spec, i) => (
                 <div key={i} className="flex justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                   <span className="text-xs font-black uppercase text-slate-400 tracking-wider">{spec.label}</span>
                   <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{spec.value}</span>
                 </div>
               ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Authentic <span className="text-primary italic">Guest Reviews</span></h3>
            <div className="space-y-6">
              {[
                { name: "John Doe", date: "2 days ago", rating: 5, comment: "Absolutely incredible! The flavors were perfectly balanced." },
                { name: "Sarah Smith", date: "1 week ago", rating: 4, comment: "Fantastic atmosphere and the food was top-notch." }
              ].map((review, i) => (
                <div key={i} className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-xs">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{review.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={cn("w-3 h-3", j < review.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-200")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 italic leading-relaxed">&quot;{review.comment}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Section */}
        <div className="lg:col-span-1">
           <div className="sticky top-24 p-8 rounded-[40px] bg-primary text-white space-y-6 shadow-2xl shadow-primary/20">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                 <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-black tracking-tight">TasteNest Quality Guarantee</h4>
              <p className="text-white/80 font-medium text-sm leading-relaxed">
                Every dish is prepared using fresh, locally sourced ingredients. Our master chefs ensure the highest standards of hygiene and culinary excellence.
              </p>
              <div className="pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Cleanliness</p>
                    <p className="text-lg font-black italic">100%</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Chef Rating</p>
                    <p className="text-lg font-black italic">A++</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
