"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { ButtonSpinner } from "@/components/ui/loading";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    href: "/admin/items",
    label: "Menu Items",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    href: "/admin/payments",
    label: "Payments",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/user") {
      return pathname === "/user";
    }
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    if (pathname === href) return; // Don't navigate if already on the page

    setLoadingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  // Reset loading state when navigation completes
  if (!isPending && loadingHref) {
    setLoadingHref(null);
  }

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
            <Image
              src="/logo/logoWhite.png"
              alt="TasteNest"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">TasteNest</h2>
            <span className="text-xs text-primary font-medium">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isItemActive = isActive(item.href);
          const isLoading = loadingHref === item.href && isPending;

          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              disabled={isLoading}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isItemActive
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "text-gray-600 hover:text-primary hover:bg-primary/5",
                isLoading && "opacity-80",
              )}
            >
              {/* Active indicator glow */}
              {isItemActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
              )}

              {/* Loading spinner or icon */}
              <span
                className={cn(
                  "relative z-10 transition-transform duration-200",
                  isItemActive ? "scale-110" : "group-hover:scale-110",
                )}
              >
                {isLoading ? <ButtonSpinner className="w-5 h-5" /> : item.icon}
              </span>

              <span className="relative z-10 font-medium">{item.label}</span>

              {/* Loading indicator dot */}
              {isLoading && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </span>
              )}

              {/* Hover accent for non-active items */}
              {!isItemActive && !isLoading && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full transition-all duration-200 group-hover:h-6" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-gray-200" />

      {/* Secondary Actions */}
      <div className="p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
          Other
        </p>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Website</span>
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="font-medium">Settings</span>
        </Link>
      </div>

      {/* Footer - User info */}
      <div className="p-4 border-t border-gray-100">
        <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
