"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { ButtonSpinner } from "@/components/ui/loading";
import { 
  BarChart3, 
  Utensils, 
  ShoppingCart, 
  CalendarCheck, 
  Home,
  User,
  Settings
} from "lucide-react";

const navItems = [
  {
    href: "/manager",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    href: "/admin/items", // Sharing the component with Admin
    label: "Menu Management",
    icon: <Utensils className="w-5 h-5" />,
  },
  {
    href: "/manager/orders",
    label: "Orders",
    icon: <ShoppingCart className="w-5 h-5" />,
  },
  {
    href: "/manager/reservations",
    label: "Reservations",
    icon: <CalendarCheck className="w-5 h-5" />,
  },
];

export default function ManagerSidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/manager") return pathname === "/manager";
    return pathname.startsWith(href);
  };

  const handleNavigation = (href: string) => {
    if (pathname === href) return;
    setLoadingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  if (!isPending && loadingHref) {
    setLoadingHref(null);
  }

  return (
    <aside className="w-72 min-h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
            <Image
              src="/logo/logoWhite.png"
              alt="TasteNest"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 tracking-tight">TasteNest</h2>
            <span className="text-xs text-secondary font-bold uppercase tracking-tighter">Manager Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-3">
          Staff Menu
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
                  : "text-gray-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5",
                isLoading && "opacity-80",
              )}
            >
              {isItemActive && (
                <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-transparent" />
              )}

              <span className={cn("relative z-10 transition-transform duration-200", isItemActive ? "scale-110" : "group-hover:scale-110")}>
                {isLoading ? <ButtonSpinner className="w-5 h-5" /> : item.icon}
              </span>

              <span className="relative z-10 font-medium">{item.label}</span>

              {!isItemActive && !isLoading && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full transition-all duration-200 group-hover:h-6" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-gray-200 dark:bg-slate-800" />

      <div className="p-4 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Back to Shop</span>
        </Link>
        <Link
          href="/user/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
        >
          <User className="w-5 h-5" />
          <span className="font-medium">My Profile</span>
        </Link>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-slate-800">
        <div className="px-4 py-3 rounded-xl bg-linear-to-r from-secondary/10 to-transparent border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">{userName?.charAt(0) || "M"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{userName || "Manager"}</p>
              <p className="text-[10px] font-black uppercase text-secondary tracking-widest truncate">Authorized Staff</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
