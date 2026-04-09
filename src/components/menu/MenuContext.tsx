"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

interface MenuContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo(() => ({ 
    isLoading, 
    startLoading, 
    stopLoading 
  }), [isLoading, startLoading, stopLoading]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}
