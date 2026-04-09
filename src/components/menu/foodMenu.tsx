"use client";

import { FoodMenuCard } from "./foodMenuCard";
import { useSearchParams } from "next/navigation";
import { useMemo, useEffect } from "react";
import type { MenuItem } from "@/types/menuItems";
import { motion, AnimatePresence } from "framer-motion";
import { useMenu } from "./MenuContext";
import type { CurrentUser } from "@/lib/auth";

import { useRouter } from "next/navigation";
import { X, Search as SearchIcon } from "lucide-react";

interface FoodMenuProps {
  items: MenuItem[];
  user: CurrentUser | null;
  search?: string;
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

export default function FoodMenu({ items, user, search }: FoodMenuProps) {
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category");
  const { isLoading, stopLoading } = useMenu();

  // Stop loading after items have been updated from the server
  useEffect(() => {
    stopLoading();
  }, [items, stopLoading]);

  // Filter items based on category and search
  const displayedItems = useMemo(() => {
    let filtered = items || [];

    if (search) {
      const lowerSearch = search.toLowerCase().trim();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.category.toLowerCase().includes(lowerSearch) ||
        item.content.toLowerCase().includes(lowerSearch)
      );
    }

    if (!category || category === "all") {
      return filtered;
    }

    const lowerCategory = category.toLowerCase().trim();
    return filtered.filter((item) => 
      item.category?.toLowerCase().trim() === lowerCategory
    );
  }, [items, category, search]);

  const clearSearch = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.delete("search");
    router.push(`/menu?${newParams.toString()}`);
  };


  // Show skeleton when loading
  if (isLoading) {
    return <MenuLoadingSkeleton />;
  }

  return (
    <div className="space-y-8 my-12">
      <AnimatePresence mode="wait">
        {search && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-2xl px-6 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <SearchIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary/60">Search Results</p>
                <p className="text-lg font-bold text-slate-900">
                  Showing matches for &quot;<span className="text-primary">{search}</span>&quot;
                </p>
              </div>
            </div>
            <button
              onClick={clearSearch}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 transition-all active:scale-95 group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Clear Search
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {displayedItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <SearchIcon className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500 text-lg font-medium text-center max-w-xs">
            No menu items found matching your criteria. Try adjusting your search or category.
          </p>
          {search && (
            <button
              onClick={clearSearch}
              className="mt-6 text-primary font-black text-sm uppercase tracking-widest hover:underline"
            >
              Reset Search
            </button>
          )}
        </div>
      ) : (
        <motion.div
          key={`${category || "all"}-${search || ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FoodMenuCard 
                item={item} 
                user={user} 
                userRole={user?.role} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

