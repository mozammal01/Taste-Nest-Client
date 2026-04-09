import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { 
  Users, 
  Package, 
  DollarSign, 
  Utensils, 
  PlusCircle, 
  UserPlus, 
  CreditCard, 
  BarChart3,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight
} from "lucide-react";

async function getAdminStats() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const headersList = await headers();
  
  // Forward all headers especially Cookie and Host for authentication
  const headersObj = Object.fromEntries(headersList.entries());

  try {
    const res = await fetch(`${API_URL}/admin/stats`, {
      method: "GET",
      headers: headersObj,
      cache: "no-store"
    });

    if (!res.ok) {
        return null;
    }
    const response = await res.json();
    return response?.data;
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    redirect("/dashboard/user");
  }

  const stats = await getAdminStats();

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
             <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
              {user?.role}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard <span className="text-primary italic">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back, <span className="text-slate-900 dark:text-white font-bold">{user?.name}</span>. Here&apos;s a summary of your restaurant&apos;s performance.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="text-right px-4 hidden sm:block">
              <p className="text-[10px] font-black uppercase text-slate-400">Current Date</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
           </div>
           <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <Calendar className="w-5 h-5 text-slate-400" />
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform duration-500">
              <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
               <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
               <span className="text-[10px] font-black text-green-600 dark:text-green-400">+12%</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Patrons</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.users?.toLocaleString() || "0"}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center border border-orange-100 dark:border-orange-800 group-hover:scale-110 transition-transform duration-500">
              <Package className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
               <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
               <span className="text-[10px] font-black text-green-600 dark:text-green-400">+8%</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Monthly Orders</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.orders?.toLocaleString() || "0"}</p>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 group-hover:scale-110 transition-transform duration-500">
              <DollarSign className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg">
               <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
               <span className="text-[10px] font-black text-green-600 dark:text-green-400">+23%</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center border border-purple-100 dark:border-purple-800 group-hover:scale-110 transition-transform duration-500">
              <Utensils className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-lg">
               <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">ACTIVE</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Menu Delicacies</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.menuItems || "0"}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Key Actions
            </h2>
            <BarChart3 className="w-5 h-5 text-slate-300" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/items"
              className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 group border border-slate-100 dark:border-slate-800 hover:border-primary/30"
            >
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">New Dish</p>
                <p className="text-slate-400 text-xs font-medium">Expand your menu</p>
              </div>
              <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 group border border-slate-100 dark:border-slate-800 hover:border-primary/30"
            >
               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">Patrons</p>
                <p className="text-slate-400 text-xs font-medium">Manage members</p>
              </div>
              <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/admin/payments"
              className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 group border border-slate-100 dark:border-slate-800 hover:border-primary/30"
            >
               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">Finances</p>
                <p className="text-slate-400 text-xs font-medium">Verify transactions</p>
              </div>
              <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>

            <Link
              href="/under-construction"
              className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 group border border-slate-100 dark:border-slate-800 hover:border-primary/30"
            >
               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-wider">Insights</p>
                <p className="text-slate-400 text-xs font-medium">Growth analytics</p>
              </div>
              <ChevronRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Live Feed
            </h2>
            <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">
              Inspect All
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center shrink-0 border border-green-100 dark:border-green-800">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-medium">New order <span className="text-primary font-black">#ORD-9082</span> from <span className="font-bold">Sarah J.</span></p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">2 min ago</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200" />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-medium"><span className="font-bold">Ahmed Khan</span> joined as a new patron</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">15 min ago</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200" />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-default">
              <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center shrink-0 border border-yellow-100 dark:border-yellow-800">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white text-sm font-medium">Revenue milestone: <span className="font-black">$2,400.00</span> today</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">1 hour ago</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
