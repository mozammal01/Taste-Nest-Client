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
            staggerChildren: 0.1
          }
        }
      }}
      className="flex flex-col md:flex-row gap-4"
    >
      {categories.map((cat) => {
        const isActive = active === cat.id;

        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
            key={cat.id}
          >
            <motion.div
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "hidden md:flex flex-col justify-center items-center gap-2 border shadow-sm rounded-xl cursor-pointer p-8 relative overflow-hidden",
                "w-[190px] h-[190px]"
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
                <cat.icon className={cn("size-[70px] transition-colors duration-300", isActive ? "text-white" : "text-primary")} />
              </motion.div>
              <motion.span
                className={cn(
                  "font-extrabold relative z-10 transition-colors duration-300",
                  isActive ? "text-white" : "text-black"
                )}
                animate={{
                  y: isActive ? -2 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {cat.label}
              </motion.span>
            </motion.div>
            
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -25 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden md:block absolute top-[168px] left-3"
              >
                <div className="relative">
                  <Image src={mask} alt={cat.label} width={168} height={40} />
                </div>
              </motion.div>
            )}
            
            <motion.span
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "font-extrabold cursor-pointer flex items-center gap-2 md:hidden relative py-2",
                isActive ? "text-primary" : "text-black hover:text-primary/70"
              )}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {cat.label}
              {isActive && (
                <motion.div
                  layoutId="mobileActiveUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.8 bg-primary rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
