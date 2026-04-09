"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMenu } from "./MenuContext";

const sortOptions = [
  { id: "default", label: "Recommended", icon: Sparkles },
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "price-low", label: "Price: Low to High", icon: ArrowUpNarrowWide },
  { id: "price-high", label: "Price: High to Low", icon: ArrowDownWideNarrow },
];

export default function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startLoading } = useMenu();
  
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [isFocused, setIsFocused] = useState(false);
  const currentSort = searchParams.get("sort") || "default";

  // Sync search value with URL
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const updateParams = (updates: Record<string, string | null>) => {
    startLoading();
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "default") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/menu?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchValue || null });
  };

  const handleSortChange = (sortId: string) => {
    updateParams({ sort: sortId });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className={cn(
            "relative flex-1 w-full h-14 group transition-all duration-300",
            isFocused ? "scale-[1.02]" : "scale-100"
          )}
        >
          <div className={cn(
            "absolute inset-0 bg-primary/5 rounded-2xl transition-all duration-300",
            isFocused ? "opacity-100 ring-2 ring-primary/20" : "opacity-0"
          )} />
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className={cn(
              "w-5 h-5 transition-colors duration-300",
              isFocused ? "text-primary" : "text-slate-400"
            )} />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for your favorite dishes..."
            className="w-full h-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-12 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:outline-none transition-all"
          />
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => {
                  setSearchValue("");
                  updateParams({ search: null });
                }}
                className="absolute inset-y-0 right-4 flex items-center pr-1 text-slate-400 hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </form>

        {/* Sort Dropdown / Chips */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl">
            <div className="px-3 flex items-center gap-2 text-slate-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest hidden lg:block">Sort</span>
            </div>
            <div className="flex gap-1">
              {sortOptions.map((option) => {
                const isActive = currentSort === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                      isActive 
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200 dark:ring-slate-700" 
                        : "text-slate-500 hover:bg-white/50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    <option.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-slate-400")} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filters / Stats info */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900 dark:text-white font-black italic">Popular</span> dishes in <span className="text-primary font-black uppercase tracking-widest text-xs">{searchParams.get("category") || "All"}</span>
        </p>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Open Now</span>
        </div>
      </div>
    </div>
  );
}
