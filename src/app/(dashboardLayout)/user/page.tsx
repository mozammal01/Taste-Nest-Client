import { getCurrentUser, RewardRecord } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  ShoppingBag, 
  Calendar, 
  Star, 
  Utensils, 
  Clock, 
  User, 
  Mail, 
  Fingerprint,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";

export default async function UserDashboard() {
  const user = await getCurrentUser();

  // Redirect admins to admin dashboard
  if (user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-200 dark:border-blue-800">
                {user?.role || "Patron"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Member</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-primary italic">{user?.name?.split(' ')[0] || "Guest"}!</span> 👋
            </h1>
            <p className="text-slate-500 font-medium">
              Explore your culinary journey and track your favorite delicacies here.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
             <div className="text-right px-4 hidden sm:block">
                <p className="text-[10px] font-black uppercase text-slate-400">Total Savings</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">$42.50</p>
             </div>
             <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                <Award className="w-5 h-5 text-primary" />
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Total Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-primary/5 dark:bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 dark:border-primary/20 group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Delicacies Enjoyed</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{user?._count?.orders || 0}</p>
              <p className="text-xs font-bold text-primary mt-2">View History →</p>
            </div>
          </div>

          {/* Total Reservations */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center border border-green-100 dark:border-green-800 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Reservations Made</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{user?._count?.reservations || 0}</p>
              <p className="text-xs font-bold text-green-600 dark:text-green-400 mt-2">Book Again →</p>
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="bg-linear-to-br from-primary to-orange-600 rounded-[32px] p-8 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -translate-y-8 translate-x-8 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
                <Star className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-1">Loyalty Rewards</p>
              <p className="text-4xl font-black text-white">
                {(user?.rewards || []).reduce((acc: number, r: RewardRecord) => r.type === 'earn' ? acc + r.points : acc - r.points, 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-white uppercase tracking-wider mt-4 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                Next Reward at 5,000 pts
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Key Services
            </h2>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Space</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              href="/menu"
              className="group flex flex-col items-center gap-4 p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Utensils className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Menu</span>
            </Link>

            <Link
              href="/#reservation"
              className="group flex flex-col items-center gap-4 p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Bookings</span>
            </Link>

            <Link
              href="/user/orders"
              className="group flex flex-col items-center gap-4 p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Orders</span>
            </Link>

            <Link
              href="/profile"
              className="group flex flex-col items-center gap-4 p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                <User className="w-7 h-7 text-primary" />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Profile</span>
            </Link>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full"></div>
              Account Security
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-800">
               <span className="w-2 h-2 rounded-full bg-green-500" />
               Verified Account
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] space-y-6 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || "Not set"}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] space-y-6 border border-slate-100 dark:border-slate-800">
               <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Member Since</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white capitalize">{new Date().getFullYear()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                  <Fingerprint className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unique Member ID</span>
                  <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white tracking-tighter opacity-70 truncate max-w-[150px]">{user?.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
