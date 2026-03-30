"use client";

import { FoodMenuCard } from "./foodMenuCard";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect } from "react";
import type { MenuItem } from "@/types/menuItems";
import { motion } from "framer-motion";
import { useMenu } from "./MenuContext";

interface FoodMenuProps {
  items: MenuItem[];
  user: { id: string } | null;
}

// Skeleton loader component for menu cards
function MenuCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* Image skeleton */}
      <div className="w-full h-[300px] bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-size-[200%_100%] bg-[linear-gradient(to_right,#e0e0e0,#f0f0f0,#e0e0e0)]" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-size-[200%_100%] rounded w-3/4" />
        <div className="h-4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-size-[200%_100%] rounded w-full" />
        <div className="h-4 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-size-[200%_100%] rounded w-2/3" />
        <div className="flex justify-end gap-2 pt-2">
          <div className="h-10 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-size-[200%_100%] rounded-lg w-24" />
          <div className="h-10 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-size-[200%_100%] rounded-lg w-24" />
        </div>
      </div>
    </div>
  );
}

// Loading skeleton grid component
export function MenuLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full my-20">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <MenuCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export default function FoodMenu({ items, user }: FoodMenuProps) {
  const params = useSearchParams();
  const category = params.get("category");
  const { isLoading, stopLoading } = useMenu();

  // Stop loading after items have been updated from the server
  useEffect(() => {
    stopLoading();
  }, [items, stopLoading]);

  // Filter items based on category
  const displayedItems = useMemo(() => {
    const rawItems = items || [];
    if (!category || category === "all") {
      return rawItems;
    }
    const lowerCategory = category.toLowerCase().trim();
    return rawItems.filter((item) => 
      item.category?.toLowerCase().trim() === lowerCategory
    );
  }, [items, category]);

  // Show skeleton when loading
  if (isLoading) {
    return <MenuLoadingSkeleton />;
  }

  if (displayedItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 my-20">
        <p className="text-gray-500 text-lg">No menu items found for this category.</p>
      </div>
    );
  }

  return (
    <motion.div
      key={category || "all"}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full my-20"
    >
      {displayedItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <FoodMenuCard item={item} user={user} userRole={(user as { role?: string })?.role} />
        </motion.div>
      ))}
    </motion.div>
  );
}
