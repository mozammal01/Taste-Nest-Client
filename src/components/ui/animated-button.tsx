"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer",
  {
    variants: {
      variant: {
        // Bounce effect
        bounce:
          "bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transform transition-all duration-200 ease-out hover:animate-bounce",

        // Pulse effect
        pulse: "bg-secondary text-black shadow-lg hover:shadow-xl animate-pulse hover:animate-none hover:bg-amber-400 hover:scale-105",

        // Slide effect
        slide:
          "bg-linear-to-r from-primary to-red-600 text-white shadow-lg overflow-hidden relative hover:shadow-xl before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]",

        // Glow effect
        glow: "bg-primary text-white shadow-lg hover:shadow-primary/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:animate-pulse",

        // Shake effect
        shake: "bg-secondary text-black shadow-lg hover:shadow-xl hover:animate-shake hover:bg-amber-400",

        // Flip effect
        flip: "bg-linear-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transform hover:rotateY-180 transition-all duration-500 preserve-3d",

        // Ripple effect
        ripple:
          "bg-primary text-white shadow-lg hover:shadow-xl relative overflow-hidden hover:scale-105 before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:bg-white/20 before:rounded-full before:transition-all before:duration-500 hover:before:w-[300px] hover:before:h-[300px] hover:before:-translate-x-1/2 hover:before:-translate-y-1/2",
        rippleYellow:
          "bg-secondary text-black shadow-lg hover:shadow-xl relative overflow-hidden hover:scale-105 before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:bg-white/20 before:rounded-full before:transition-all before:duration-500 hover:before:w-[300px] hover:before:h-[300px] hover:before:-translate-x-1/2 hover:before:-translate-y-1/2",

        // linear shift
        gradientShift:
          "bg-linear-to-r from-primary via-red-500 to-secondary text-white shadow-lg hover:shadow-xl bg-[length:200%_100%] hover:bg-right-bottom transition-all duration-500 hover:scale-105",

        // Neon effect
        neon: "bg-transparent border-2 border-primary text-primary shadow-lg hover:bg-primary hover:text-white hover:shadow-primary/50 hover:shadow-2xl transition-all duration-300 hover:animate-pulse",

        // 3D effect
        threeDimensional:
          "bg-linear-to-b from-primary to-red-700 text-white shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] hover:shadow-2xl active:translate-y-[1px] active:shadow-md transition-all duration-200",

        // Loading effect
        loading:
          "bg-primary text-white shadow-lg hover:shadow-xl relative overflow-hidden before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent before:animate-shimmer hover:before:animation-play-state-running",

        // Morphing effect
        morph: "bg-primary text-white shadow-lg hover:shadow-xl hover:rounded-full hover:px-8 transition-all duration-500 hover:scale-110",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "bounce",
      size: "default",
    },
  }
);

interface AnimatedButtonProps extends React.ComponentProps<"button">, VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(animatedButtonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton, animatedButtonVariants };
