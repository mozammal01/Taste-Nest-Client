"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowDownWideNarrow, 
  ArrowUpNarrowWide, 
  Clock, 
  Sparkles, 
  RotateCcw,
  DollarSign,
  Compass,
  DollarSignIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMenu } from "./MenuContext";

const sortOptions = [
  { id: "default", label: "Recommended", icon: Sparkles },
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "price-low", label: "Price: Low to High", icon: ArrowUpNarrowWide },
  { id: "price-high", label: "Price: High to Low", icon: ArrowDownWideNarrow },
];

const budgetPresets = [
  { label: "Under $15", max: "15" },
  { label: "Under $30", max: "30" },
  { label: "Under $50", max: "50" },
];

export default function SearchFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startLoading } = useMenu();
  
  const searchFromUrl = searchParams.get("search") || "";
  const sortFromUrl = searchParams.get("sort") || "default";
  const minPriceFromUrl = searchParams.get("minPrice") || "";
  const maxPriceFromUrl = searchParams.get("maxPrice") || "";

  const [searchValue, setSearchValue] = useState(searchFromUrl);
  const [minPrice, setMinPrice] = useState(minPriceFromUrl);
  const [maxPrice, setMaxPrice] = useState(maxPriceFromUrl);
  const [isFocused, setIsFocused] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Keep state synchronized with URL search parameters (e.g. when reset externally)
  useEffect(() => {
    setSearchValue(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    setMinPrice(minPriceFromUrl);
  }, [minPriceFromUrl]);

  useEffect(() => {
    setMaxPrice(maxPriceFromUrl);
  }, [maxPriceFromUrl]);

  const currentSort = sortFromUrl;

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchFromUrl) count++;
    if (sortFromUrl !== "default") count++;
    if (minPriceFromUrl) count++;
    if (maxPriceFromUrl) count++;
    return count;
  }, [searchFromUrl, sortFromUrl, minPriceFromUrl, maxPriceFromUrl]);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ 
      search: searchValue || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    });
  };

  const handleSortChange = (sortId: string) => {
    updateParams({ sort: sortId });
  };

  const handleResetAll = () => {
    setSearchValue("");
    setMinPrice("");
    setMaxPrice("");
    startLoading();
    router.push("/menu", { scroll: false });
  };

  const applyQuickPrice = (max: string) => {
    setMinPrice("");
    setMaxPrice(max);
    updateParams({
      minPrice: null,
      maxPrice: max
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-12 space-y-6">
      {/* Glow Ambient Decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse duration-3000" />
      
      {/* Unified Control Console Card */}
      <div className="w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-[32px] p-5 md:p-6 shadow-xl shadow-slate-100/30 dark:shadow-none transition-all duration-500">
        
        {/* Row 1: Search and Main Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          {/* Elegant Search Input */}
          <form 
            onSubmit={handleSearchSubmit}
            className="relative flex-1 w-full h-14 group"
          >
            <div className={cn(
              "absolute inset-0 bg-linear-to-r from-primary/10 to-rose-500/10 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none",
              isFocused && "opacity-100 ring-2 ring-primary/20"
            )} />
            
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className={cn(
                "w-5 h-5 transition-colors duration-300",
                isFocused ? "text-primary" : "text-slate-400 dark:text-slate-500"
              )} />
            </div>
            
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Craving something delicious? Search here..."
              className="w-full h-full bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl pl-14 pr-32 text-slate-800 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:bg-white dark:focus:bg-slate-950/80 focus:border-primary/30 focus:outline-none transition-all duration-300"
            />
            
            {/* Clear Input Button */}
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
                  className="absolute inset-y-0 right-24 flex items-center pr-2 text-slate-400 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>
            
            {/* Quick Submit Icon Button inside search */}
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 hover:bg-primary dark:bg-slate-800 dark:hover:bg-primary text-white text-xs font-bold rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Controls Panel Toggles */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            {/* Reset Button (Only shows if filters active) */}
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  onClick={handleResetAll}
                  className="flex items-center justify-center gap-2 px-4 h-14 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-primary dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/30 rounded-2xl text-sm font-black active:scale-95 transition-all duration-300 cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Mobile Filters Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className={cn(
                "md:hidden flex items-center justify-between gap-3 flex-1 h-14 px-5 rounded-2xl font-bold transition-all duration-300 active:scale-[0.98]",
                isMobileFiltersOpen 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80"
              )}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters &amp; Sort</span>
              </div>
              {activeFiltersCount > 0 && (
                <div className={cn(
                  "flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-black leading-none",
                  isMobileFiltersOpen ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {activeFiltersCount}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Controls Panel (Desktop: Always Visible, Mobile: Collapsible) */}
        <AnimatePresence initial={false}>
          {(isMobileFiltersOpen || true) && (
            <motion.div
              initial={false}
              animate={{ 
                height: "auto",
                opacity: 1,
                marginTop: 20
              }}
              exit={{ 
                height: 0,
                opacity: 0,
                marginTop: 0
              }}
              className={cn(
                "overflow-hidden transition-all duration-300 border-t border-slate-100 dark:border-slate-800/50 pt-5",
                !isMobileFiltersOpen && "hidden md:block" // Force hide on mobile when closed
              )}
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
                
                {/* SORT CONTROLS - iOS Segmented Control Design */}
                <div className="space-y-2 flex-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest pl-1">
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    <span>Sort Dishes By</span>
                  </div>
                  
                  <div className="flex items-center bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 w-full overflow-x-auto no-scrollbar">
                    <div className="flex gap-1 w-full">
                      {sortOptions.map((option) => {
                        const isActive = currentSort === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleSortChange(option.id)}
                            className={cn(
                              "relative flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap z-10 select-none cursor-pointer",
                              isActive 
                                ? "text-white" 
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                            )}
                          >
                            <option.icon className={cn("w-4 h-4 relative z-10 transition-transform duration-300", isActive && "scale-110")} />
                            <span className="relative z-10">{option.label}</span>
                            
                            {/* Slide-in Background Pill */}
                            {isActive && (
                              <motion.div
                                layoutId="activeSortPill"
                                className="absolute inset-0 bg-gradient-to-r from-primary to-rose-500 rounded-xl shadow-md shadow-primary/20 -z-0"
                                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Vertical Separator for Desktop */}
                <div className="hidden lg:block w-[1px] h-14 bg-slate-200 dark:bg-slate-800/80 shrink-0 align-self-end mt-4" />

                {/* PRICE RANGE CONTROLS */}
                <div className="space-y-2 shrink-0">
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest pl-1">
                    <DollarSignIcon className="w-3.5 h-3.5 text-primary" />
                    <span>Price Range Budget</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    
                    {/* Inputs Wrapper */}
                    <form 
                      onSubmit={handleSearchSubmit}
                      className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 shrink-0"
                    >
                      {/* Min input */}
                      <div className="relative flex items-center">
                        <DollarSign className="absolute left-2 w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                        <input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-16 h-9 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl pl-6 pr-2 text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      
                      <span className="text-slate-300 dark:text-slate-700 font-medium">-</span>
                      
                      {/* Max input */}
                      <div className="relative flex items-center">
                        <DollarSign className="absolute left-2 w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                        <input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-16 h-9 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl pl-6 pr-2 text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Apply button */}
                      <button 
                        type="submit" 
                        className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-primary dark:hover:bg-primary text-white rounded-xl text-xs font-black shadow-xs hover:shadow-md transition-all active:scale-95 ml-1 select-none cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>

                    {/* Presets Row */}
                    <div className="flex gap-1.5">
                      {budgetPresets.map((preset) => {
                        const isSelected = maxPriceFromUrl === preset.max && !minPriceFromUrl;
                        return (
                          <button
                            key={preset.max}
                            type="button"
                            onClick={() => applyQuickPrice(preset.max)}
                            className={cn(
                              "px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 select-none cursor-pointer border",
                              isSelected
                                ? "bg-primary/10 border-primary/20 text-primary shadow-xs"
                                : "bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 border-slate-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                            )}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Quick Info & Editorial Stats Row */}
      <div className="flex items-center justify-between px-4">
        <p className="text-sm text-slate-500 font-medium font-outfit">
          Showing <span className="text-slate-800 dark:text-slate-200 font-black italic">Popular</span> dishes in <span className="bg-primary/10 text-primary font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px] ml-1">{searchParams.get("category") || "All Categories"}</span>
        </p>
        
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 px-3.5 py-1.5 rounded-full shrink-0">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">Kitchen Active</span>
        </div>
      </div>
    </div>
  );
}

