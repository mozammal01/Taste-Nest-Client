"use client";
import BurgerIcon from "../icons/BurgerIcon";
import CoffeeIcon from "../icons/CoffeeIcon";
import DessertIcon from "../icons/DessertIcon";
import SteakIcon from "../icons/SteakIcon";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import mask from "@/../public/categories/mask.png";
import { useRouter, useSearchParams } from "next/navigation";
import { useMenu } from "./MenuContext";

const categories = [
  { id: "all", label: "All", icon: DessertIcon },
  { id: "dessert", label: "Dessert", icon: DessertIcon },
  { id: "steak", label: "Steak", icon: SteakIcon },
  { id: "coffee", label: "Coffee", icon: CoffeeIcon },
  { id: "burger", label: "Burger", icon: BurgerIcon },
];

export default function FullMenuCategories() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const params = useSearchParams();
  const router = useRouter();
  const { startLoading } = useMenu();

  // DERIVE initial active from URL
  const activeFromUrl = params.get("category") ?? "all";

  // Optimistic state for immediate feedback
  const [optimisticActive, setOptimisticActive] = useState(activeFromUrl);

  // Sync optimistic state if URL changes (e.g. back button)
  useEffect(() => {
    setOptimisticActive(activeFromUrl);
  }, [activeFromUrl]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === optimisticActive) return;

    // 1. Update UI immediately
    setOptimisticActive(categoryId);

    // 2. Show skeletons/loading in FoodMenu
    startLoading();

    // 3. Navigate to update URL
    router.push(`/menu?category=${categoryId}`, { scroll: false });
  };

  // Use optimisticActive for visual highlight
  const active = optimisticActive;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="flex flex-wrap gap-4 md:gap-6 justify-center mx-auto"
    >
      {categories.map((cat) => {
        const isActive = active === cat.id;

        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative shrink-0"
            key={cat.id}
          >
            {/* Desktop/Laptop view */}
            <motion.div
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "hidden md:flex flex-col justify-center items-center gap-2 border shadow-sm rounded-xl cursor-pointer p-8 relative overflow-hidden",
                "w-[190px] h-[190px]",
              )}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Background animation */}
              <motion.div
                className="absolute inset-0 bg-primary"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.8,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />

              {/* Content */}
              <motion.div
                className="relative z-10"
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <cat.icon
                  className={cn(
                    "size-[70px] transition-colors duration-300",
                    isActive ? "text-white" : "text-primary",
                  )}
                />
              </motion.div>
              <motion.span
                className={cn(
                  "font-black text-center relative z-10 transition-colors px-2",
                  isActive ? "text-white" : "text-slate-900",
                )}
              >
                {cat.label}
              </motion.span>
            </motion.div>

            {/* Mobile view - Matching Home Page Design */}
            <motion.div
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all min-w-[120px]",
                isActive
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white border-slate-100 text-slate-600",
              )}
              whileTap={{ scale: 0.95 }}
            >
              <cat.icon
                className={cn("size-6", isActive ? "text-white" : "text-primary")}
              />
              <span className="font-black whitespace-nowrap">{cat.label}</span>
            </motion.div>

            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden md:block absolute top-[178px] left-1/2 -translate-x-1/2"
              >
                <Image src={mask} alt="mask" width={168} height={40} className="w-[170px]" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
