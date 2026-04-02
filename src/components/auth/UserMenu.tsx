"use client";

import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, ShoppingBag, Calendar, ChevronDown, LayoutDashboard, Trophy, CreditCard } from "lucide-react";

export default function UserMenu({ onLinkClick }: { onLinkClick?: () => void }) {
  const { data: session, isPending: isSessionPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onLinkClick) onLinkClick();
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Loading state or before mounting
  if (!mounted || isSessionPending) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden lg:block">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 rounded mt-1 animate-pulse" />
        </div>
      </div>
    );
  }

  // Not authenticated - show sign in button
  if (!session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/signin" onClick={handleLinkClick}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 text-gray-700 font-medium hover:text-primary transition-colors"
          >
            Sign In
          </motion.button>
        </Link>
        <Link href="/signup" onClick={handleLinkClick}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-primary text-white font-medium rounded-full hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Sign Up
          </motion.button>
        </Link>
      </div>
    );
  }
  const userRole = (session.user as { role?: string } | undefined)?.role;

  const userMenuItems = [
    { label: "Dashboard", href: "/user", icon: LayoutDashboard },
    { label: "My Orders", href: "/user/orders", icon: ShoppingBag },
    { label: "My Reservations", href: "/user/reservations", icon: Calendar },
    { label: "My Rewards", href: "/user/rewards", icon: Trophy },
    { label: "Payment History", href: "/user/payments", icon: CreditCard },
    { label: "Settings", href: "/profile", icon: Settings },
  ];

  const adminMenuItems = [
    { label: "Admin Panel", href: "/admin", icon: LayoutDashboard },
    { label: "Menu Items", href: "/admin/items", icon: ShoppingBag },
    { label: "All Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Users", href: "/admin/users", icon: Settings },
    { label: "My Profile", href: "/profile", icon: Settings },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems;

  // Authenticated - show user menu
  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-full transition-all ${isOpen ? "bg-gray-100" : "hover:bg-gray-50"}`}
      >
        {/* Avatar */}
        <div className="relative w-10 h-10 flex-shrink-0">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              fill
              className="rounded-full border-2 border-primary/20 object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-semibold text-lg shadow-inner">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10" />
        </div>

        {/* User Info - Hidden on smaller screens */}
        <div className="hidden xl:block text-left">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{session.user?.name?.split(" ")[0] || "User"}</p>
        </div>

        {/* Chevron */}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-25 bottom-0 mb-2 lg:bottom-auto lg:top-full lg:mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-y-auto max-h-[90vh] lg:max-h-[calc(100vh-100px)]"
            >
              {/* User Info Header */}
              <div className="px-4 py-4 bg-linear-to-r from-primary/5 to-primary/10">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="rounded-full border-2 border-white shadow-sm object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xl">
                        {session.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 px-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-primary transition-all group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <item.icon className="w-4.5 h-4.5 text-gray-500 group-hover:text-primary transition-colors" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>


              {/* Sign Out */}
              <div className="px-2 py-2 border-t border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                    <LogOut className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
