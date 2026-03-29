"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "food";
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function Loading({ size = "md", variant = "food", text, className, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4">
        {variant === "spinner" && <SpinnerLoader size={sizeClasses[size]} />}
        {variant === "dots" && <DotsLoader size={size} />}
        {variant === "pulse" && <PulseLoader size={sizeClasses[size]} />}
        {variant === "food" && <FoodLoader size={size} />}
        {text && <p className={cn("text-gray-600 font-medium animate-pulse", textSizeClasses[size])}>{text}</p>}
      </div>
    </div>
  );
}

// Spinner loader - simple rotating circle
function SpinnerLoader({ size }: { size: string }) {
  return (
    <div className={cn("relative", size)}>
      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
    </div>
  );
}

// Dots loader - bouncing dots
function DotsLoader({ size }: { size: string }) {
  const dotSize = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn("rounded-full bg-primary", dotSize[size as keyof typeof dotSize])}
          style={{
            animation: "bounce 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}

// Pulse loader - pulsing circle
function PulseLoader({ size }: { size: string }) {
  return (
    <div className={cn("relative", size)}>
      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping"></div>
      <div className="absolute inset-2 rounded-full bg-primary/50 animate-pulse"></div>
      <div className="absolute inset-4 rounded-full bg-primary"></div>
    </div>
  );
}

// Food loader - restaurant themed
function FoodLoader({ size }: { size: string }) {
  const iconSize = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
    xl: "text-6xl",
  };

  const containerSize = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  };

  return (
    <div className={cn("relative", containerSize[size as keyof typeof containerSize])}>
      {/* Rotating plate */}
      <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-[spin_8s_linear_infinite]"></div>
      <div className="absolute inset-2 rounded-full border-2 border-secondary/50 animate-[spin_6s_linear_infinite_reverse]"></div>

      {/* Center food icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <span className={cn("animate-bounce inline-block", iconSize[size as keyof typeof iconSize])} style={{ animationDuration: "1s" }}>
            🍽️
          </span>
        </div>
      </div>

      {/* Floating food items */}
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
        {["🍕", "🍔", "🍰", "☕"].map((emoji, i) => {
          const angle = (i * 90) * (Math.PI / 180);
          const radius = 35; // percentage
          return (
            <span
              key={i}
              className="absolute text-xl animate-pulse flex items-center justify-center w-8 h-8"
              style={{
                top: `${50 + Math.sin(angle) * radius}%`,
                left: `${50 + Math.cos(angle) * radius}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.3}s`,
                animationDuration: "2s",
              }}
            >
              {emoji}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// Card Skeleton loader
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", className)}>
      <div className="h-48 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-100 rounded-lg w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className={cn("h-4 bg-gray-200 rounded", i === 0 ? "w-32" : "w-24")}></div>
        </td>
      ))}
    </tr>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

// Page Loading Component
export function PageLoading({ title }: { title?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loading variant="food" size="xl" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">{title || "Loading..."}</h2>
        <p className="mt-2 text-gray-500">Please wait while we prepare everything for you</p>
      </div>
    </div>
  );
}

// Button Loading Spinner
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <svg className={cn("animate-spin h-5 w-5 text-current", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
