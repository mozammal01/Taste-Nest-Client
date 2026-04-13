import { getCurrentUser, requireManager } from "@/lib/auth";
import { 
  Package, 
  Utensils, 
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  ShoppingCart,
  CalendarCheck
} from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";

async function getManagerStats() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());

  try {
    const res = await fetch(`${API_URL}/admin/stats`, {
      method: "GET",
      headers: headersObj,
      cache: "no-store"
    });

    if (!res.ok) return null;
    const response = await res.json();
    return response?.data;
  } catch {
    return null;
  }
}

export default async function ManagerDashboard() {
  const user = await requireManager();
  const stats = await getManagerStats();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-secondary/20">
              {user?.role}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational Hub</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Manager <span className="text-primary italic">Console</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back, <span className="text-slate-900 dark:text-white font-bold">{user?.name}</span>. Oversee your daily operations below.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="text-right px-4 hidden sm:block">
              <p className="text-[10px] font-black uppercase text-slate-400">Shift Date</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
           </div>
           <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Calendar className="w-5 h-5 text-slate-400" />
           </div>
        </div>
      </div>

      {/* Stats Grid - Focused on Operations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center border border-orange-100 dark:border-orange-800 group-hover:scale-110 transition-transform duration-500">
              <Package className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="px-2 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-[10px] font-black text-green-600">ACTIVE</div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Recent Orders</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.orders?.toLocaleString() || "0"}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800 group-hover:scale-110 transition-transform duration-500">
              <Utensils className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Managed Dishes</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.menuItems || "0"}</p>
          </div>
        </div>

        {/* Reservations Counter (Mocked or real if available) */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform duration-500">
              <CalendarCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Table Reservations</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">--</p>
          </div>
        </div>
      </div>

      {/* Primary Management Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
              <div className="w-2 h-8 bg-secondary rounded-full"></div>
              Operations Hub
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/admin/items"
                className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group border border-slate-100 dark:border-slate-800 hover:border-secondary/30 hover:shadow-2xl hover:shadow-secondary/5"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-100 dark:border-slate-700">
                  <Utensils className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-black text-base uppercase tracking-wider">Menu Control</p>
                  <p className="text-slate-400 text-sm font-medium">Update prices, stock, and descriptions</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
              </Link>

              <Link
                href="/manager/orders"
                className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group border border-slate-100 dark:border-slate-800 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/5"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-100 dark:border-slate-700">
                  <ShoppingCart className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-black text-base uppercase tracking-wider">Order Queue</p>
                  <p className="text-slate-400 text-sm font-medium">Coordinate kitchen and delivery logistics</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-2 transition-all" />
              </Link>

              <Link
                href="/manager/reservations"
                className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[28px] hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5"
              >
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-slate-100 dark:border-slate-700">
                  <CalendarCheck className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-black text-base uppercase tracking-wider">Floor Plan</p>
                  <p className="text-slate-400 text-sm font-medium">Manage table bookings and capacity</p>
                </div>
                <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" />
              </Link>
            </div>
        </div>

        {/* Operational Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
           <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4">
              <div className="w-2 h-8 bg-secondary rounded-full"></div>
              Live Operations
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all group">
                <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-base font-bold">New Prep Request <span className="text-secondary font-black">#ORD-9082</span></p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <p className="text-slate-400 text-[11px] uppercase font-black tracking-widest">Incoming Now</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-secondary transition-colors" />
              </div>

               <div className="flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 transition-all group">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 dark:text-white text-base font-bold">Large Table Confirmation</p>
                  <p className="text-slate-400 text-sm font-medium mt-0.5">Party of 8 at 7:30 PM</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
