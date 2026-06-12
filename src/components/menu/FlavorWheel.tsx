"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ShoppingCart, Award } from "lucide-react";
import Image from "next/image";
import type { MenuItem } from "@/types/menuItems";
import { createCartItem } from "@/lib/actions/cart";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FlavorWheelProps {
  items: MenuItem[];
}

export default function FlavorWheel({ items }: FlavorWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showPromo, setShowPromo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const router = useRouter();

  // Filter 4 items for the wheel layout
  const wheelItems = items.slice(0, 4);

  const spinThePlate = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // Random landing index
    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    const segmentAngle = 360 / wheelItems.length;
    const targetOffset = randomIndex * segmentAngle + segmentAngle / 2;

    // Next rotation must add to the current accumulated rotation
    const baseRotation = Math.ceil(rotation / 360) * 360 + 1800;
    const targetAngle = baseRotation + (360 - targetOffset);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(wheelItems[randomIndex]);
      setShowPromo(true);
      toast.success(`You spun and got: ${wheelItems[randomIndex].name}!`, {
        description: "Enjoy a special chef discount code inside!",
        icon: <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />,
      });
    }, 4500); // Wait for the transition to finish
  };

  const handleAddToCart = async (id: number) => {
    try {
      // Auto-apply promo code to localStorage
      localStorage.setItem("appliedPromoCode", "CHEFSPIN10");

      const result = await createCartItem({
        menuItemId: id,
        quantity: 1,
      });

      if (result.success) {
        toast.success("Added to cart!", {
          description: "Gourmet item successfully updated.",
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        });
        setIsOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Please sign in to order.");
      }
    } catch (error) {
      console.error("[FlavorWheel AddToCart Error]", error);
      const errMsg = "An error occurred while adding to cart. Please try again.";
      setError(errMsg);
      setErrorDetails(error instanceof Error ? error.message : String(error));
      toast.error(errMsg);
    }
  };

  return (
    <>
      {/* Floating Trigger Widget */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-8 z-40 bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 text-white py-3 px-5 rounded-full shadow-[0_20px_50px_rgba(244,63,94,0.4)] flex items-center gap-2.5 cursor-pointer border border-white/20 font-black text-xs uppercase tracking-widest"
      >
        <Sparkles className="w-4.5 h-4.5 animate-pulse" />
        <span>Plate of Fortune 🎡</span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[36px] w-full max-w-4xl p-6 md:p-8 relative shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  if (!isSpinning) setIsOpen(false);
                }}
                disabled={isSpinning}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors disabled:opacity-30 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-4">
                {/* Wheel Section */}
                <div className="flex flex-col items-center justify-center relative">
                  {/* Outer Glowing Border */}
                  <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full scale-105 blur-2xl -z-10" />

                  {/* Header */}
                  <div className="text-center mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Gamified Gourmet
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                      Plate of Fortune
                    </h3>
                  </div>

                  {/* The Spinner Wheel */}
                  <div className="relative w-[300px] h-[300px] md:w-[320px] md:h-[320px] shrink-0 animate-in fade-in zoom-in-95 duration-700">
                    {/* Arrow Indicator */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-red-500 drop-shadow-[0_4px_10px_rgba(239,68,68,0.5)]">
                      <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-red-500 animate-pulse" />
                    </div>

                    <motion.div
                      animate={{ rotate: rotation }}
                      transition={
                        isSpinning
                          ? { ease: [0.25, 0.1, 0.25, 1], duration: 4.5 }
                          : { type: "spring", stiffness: 100 }
                      }
                      className="w-full h-full rounded-full border-8 border-slate-900 dark:border-slate-800 bg-[#0c1020] dark:bg-[#0f172a] relative overflow-hidden shadow-2xl flex items-center justify-center"
                    >
                      {wheelItems.map((item, idx) => {
                        const angle = 360 / wheelItems.length;
                        const rotationAngle = idx * angle + angle / 2;

                        return (
                          <div
                            key={item.id}
                            className="absolute w-full h-full animate-in fade-in duration-500"
                            style={{
                              transform: `rotate(${rotationAngle}deg)`,
                              transformOrigin: "50% 50%",
                            }}
                          >
                            {/* Segment Line Divider */}
                            <div 
                              className="absolute top-0 left-1/2 w-[1.5px] h-1/2 bg-slate-700/40 origin-bottom -translate-x-1/2" 
                              style={{ transform: `rotate(${-angle / 2}deg)` }}
                            />

                            {/* Food Thumbnail on Segment */}
                            <div
                              className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
                            >
                              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white dark:border-slate-800 shadow-md">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-[9px] font-black text-white max-w-[50px] text-center line-clamp-1 leading-tight tracking-wider uppercase">
                                {item.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>

                    {/* Central Spin Button */}
                    <button
                      onClick={spinThePlate}
                      disabled={isSpinning}
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-[0_10px_25px_rgba(244,63,94,0.5)] border-4 border-slate-900 dark:border-slate-800 hover:scale-105 active:scale-95 disabled:scale-95 disabled:opacity-90 cursor-pointer transition-transform z-20"
                    >
                      SPIN
                    </button>
                  </div>
                </div>

                {/* Prize and Discount details Section */}
                <div className="flex flex-col h-full justify-center">
                  <AnimatePresence mode="wait">
                    {!selectedItem ? (
                      <motion.div
                        key="intro"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5 text-center lg:text-left"
                      >
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white">
                          Undecided on dinner? 🍽️
                        </h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                          Spin the chef&apos;s Plate of Fortune and let the flavor spirits choose your destiny! 
                          Every spin guarantees a special gourmet discount to delight your palate.
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3">
                          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Award className="w-5 h-5 text-primary shrink-0" />
                            <span className="text-xs font-bold text-left leading-normal">
                              Get 10% instant chef discount for the spun item!
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6 text-center lg:text-left"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#ca8a04] bg-[#fef9c3] px-3.5 py-1 rounded-full border border-yellow-200/50">
                            Chef&apos;s Recommendation Selected!
                          </span>
                          <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-3">
                            {selectedItem.name}
                          </h4>
                          <p className="text-xs font-bold text-rose-500">{selectedItem.category}</p>
                        </div>

                        {/* Interactive Dish card inside popup */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-[20px] border border-slate-100 dark:border-slate-800/80">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white dark:border-slate-800 shadow-sm">
                            <Image
                              src={selectedItem.image}
                              alt={selectedItem.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {selectedItem.content}
                            </p>
                            <span className="text-xl font-black text-rose-500 italic mt-1 inline-block">
                              ${selectedItem.price}
                            </span>
                          </div>
                        </div>

                        {/* Promo Coupon */}
                        {showPromo && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-5 rounded-2xl text-white shadow-lg relative overflow-hidden"
                          >
                            {/* Decorative sparkles background */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-10 -translate-y-10 scale-150 blur-xl" />
                            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="text-left">
                                <p className="text-[9px] font-black tracking-widest uppercase opacity-90">
                                  10% Coupon Code
                                </p>
                                <p className="text-2xl font-black tracking-wider uppercase mt-0.5">
                                  CHEFSPIN10
                                </p>
                              </div>
                              <button
                                onClick={() => handleAddToCart(selectedItem.id)}
                                className="bg-white hover:bg-slate-50 text-slate-900 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md hover:scale-[1.03] active:scale-97 transition-all shrink-0"
                              >
                                <ShoppingCart className="w-4 h-4 text-red-500" />
                                Add & Apply
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
            </div>
        )}
          </AnimatePresence>
          {/* Error Modal */}
          <AnimatePresence>
            {error && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[24px] w-full max-w-md p-6 shadow-2xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{error}</h3>
                    <button
                      onClick={() => {
                        setError(null);
                        setShowErrorDetails(false);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {errorDetails && (
                    <>
                      <button
                        onClick={() => setShowErrorDetails(!showErrorDetails)}
                        className="text-primary underline mb-2"
                      >
                        {showErrorDetails ? "Hide Details" : "Show Details"}
                      </button>
                      {showErrorDetails && (
                        <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded overflow-auto text-sm text-slate-700 dark:text-slate-300">
                          {errorDetails}
                        </pre>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
  );
}
