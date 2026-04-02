"use client";

import AdminSidebar from "@/components/sidebar/admin-sidebar";
import UserSidebar from "@/components/sidebar/user-sidebar";
import ProtectedLayout from "../(commonLayout)/(protected)/layout";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user as any; // Cast as any to include custom 'role' property
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-gray-50 relative">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between z-40 px-6 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center p-2 shadow-lg shadow-primary/20">
              <Image
                src="/logo/logoWhite.png"
                alt="TasteNest"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">TasteNest</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all active:scale-95"
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Sidebar for Desktop */}
        <div className="hidden lg:flex sticky top-0 h-screen overflow-y-auto">
          {user?.role === "admin" ? <AdminSidebar /> : <UserSidebar userName={user?.name} />}
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleSidebar}
                className="lg:hidden fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-[2px]"
              />

              {/* Sidebar Content */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                className="lg:hidden fixed inset-y-0 left-0 w-[288px] bg-white z-[60] shadow-2xl flex flex-col"
              >
                {/* Close Button Inside Drawer */}
                <div className="absolute right-4 top-4 z-[70]">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto h-full" onClick={() => setIsSidebarOpen(false)}>
                  {user?.role === "admin" ? <AdminSidebar /> : <UserSidebar userName={user?.name} />}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto h-full p-4 sm:p-6 lg:p-8">
             {children}
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}
