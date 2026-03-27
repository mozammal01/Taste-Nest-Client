"use client";

import { motion } from "framer-motion";
import Navigation from "@/components/home/navigation";

// Skeleton shimmer animation component
function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

// Category button skeleton
function CategorySkeleton({ index }: { index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Shimmer className="h-12 w-28 rounded-full" />
    </motion.div>
  );
}

// Menu card skeleton
function MenuCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Image skeleton */}
      <Shimmer className="w-full h-[300px]" />

      {/* Content skeleton */}
      <div className="p-5 space-y-4">
        {/* Badges */}
        <div className="flex gap-2">
          <Shimmer className="h-6 w-20 rounded-full" />
          <Shimmer className="h-6 w-24 rounded-full" />
        </div>

        {/* Title */}
        <Shimmer className="h-7 w-3/4 rounded-lg" />

        {/* Description */}
        <div className="space-y-2">
          <Shimmer className="h-4 w-full rounded" />
          <Shimmer className="h-4 w-2/3 rounded" />
        </div>

        {/* Price and buttons */}
        <div className="flex justify-between items-center pt-3">
          <Shimmer className="h-8 w-20 rounded-lg" />
          <div className="flex gap-2">
            <Shimmer className="h-11 w-28 rounded-xl" />
            <Shimmer className="h-11 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuLoading() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              {/* Subtitle */}
              <Shimmer className="h-6 w-32 rounded-full mx-auto mb-4" />
              {/* Title */}
              <Shimmer className="h-12 w-64 rounded-xl mx-auto mb-3" />
              {/* Description */}
              <Shimmer className="h-5 w-96 max-w-full rounded-lg mx-auto" />
            </motion.div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {[...Array(6)].map((_, i) => (
              <CategorySkeleton key={i} index={i} />
            ))}
          </motion.div>

          {/* Stats bar skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center gap-8 mb-12"
          >
            <div className="flex items-center gap-2">
              <Shimmer className="h-5 w-5 rounded" />
              <Shimmer className="h-5 w-24 rounded" />
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-2">
              <Shimmer className="h-5 w-5 rounded" />
              <Shimmer className="h-5 w-32 rounded" />
            </div>
          </motion.div>

          {/* Menu Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <MenuCardSkeleton key={i} index={i} />
            ))}
          </div>

          {/* Loading indicator at bottom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center justify-center py-16"
          >
            {/* Animated dots */}
            <div className="flex items-center gap-2 mb-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-primary"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm font-medium">Loading delicious menu items...</p>
          </motion.div>
        </div>
      </main>

      {/* Add shimmer keyframe animation */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
