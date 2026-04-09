"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "ripple";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const baseStyles = "relative overflow-hidden transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group whitespace-nowrap";

    
    const variants = {
      primary: "bg-primary text-white hover:bg-orange-600 shadow-xl shadow-primary/20",
      outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
      ripple: "bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:shadow-2xl transition-all duration-300",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-xs rounded-xl",
      md: "px-6 py-2.5 text-sm rounded-2xl",
      lg: "px-8 py-3.5 text-base rounded-[20px]",
      xl: "px-10 py-5 text-lg rounded-[24px]",
    };

    return (
      <motion.button
        ref={ref as any}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(props as any)}
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-[0%] transition-transform duration-500 rounded-inherit" />
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {children}
        </span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
