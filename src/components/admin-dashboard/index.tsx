import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Welcome back, {user?.name}! Manage your restaurant here.</p>
        </div>
        <div className="flex items-center gap-3 sm:self-start">
          <span className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs md:text-sm font-semibold border border-primary/20">
            {user?.role?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Users</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats?.users?.toLocaleString() || "0"}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-xs md:text-sm mt-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Orders</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats?.orders?.toLocaleString() || "0"}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-xs md:text-sm mt-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +8% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-yellow-200 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Revenue</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="text-green-600 text-xs md:text-sm mt-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +23% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Menu Items</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stats?.menuItems || "0"}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-3">5 new this week</p>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/items"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-gray-100 hover:border-primary/30"
            >
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">🍔</span>
              <div>
                <p className="text-gray-900 font-medium text-sm md:text-base">Add Menu Item</p>
                <p className="text-gray-500 text-xs md:text-sm">Create new dish</p>
              </div>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-gray-100 hover:border-primary/30"
            >
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">👥</span>
              <div>
                <p className="text-gray-900 font-medium text-sm md:text-base">Manage Users</p>
                <p className="text-gray-500 text-xs md:text-sm">View all users</p>
              </div>
            </Link>
            <Link
              href="/admin/payments"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-gray-100 hover:border-primary/30"
            >
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">💳</span>
              <div>
                <p className="text-gray-900 font-medium text-sm md:text-base">View Payments</p>
                <p className="text-gray-500 text-xs md:text-sm">Transaction history</p>
              </div>
            </Link>
            <Link
              href="/under-construction"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-gray-100 hover:border-primary/30"
            >
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">📊</span>
              <div>
                <p className="text-gray-900 font-medium text-sm md:text-base">Analytics</p>
                <p className="text-gray-500 text-xs md:text-sm">View reports</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Recent Activity
            </h2>
            <button className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start sm:items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm">New order <span className="font-semibold text-primary">#ORD-9082</span> received from <span className="font-medium">Sarah Johnson</span></p>
                <p className="text-gray-500 text-xs mt-0.5">2 minutes ago</p>
              </div>
              <span className="hidden sm:inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg font-medium">New</span>
            </div>
            <div className="flex items-start sm:items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm"><span className="font-medium">Ahmed Khan</span> registered as a new customer</p>
                <p className="text-gray-500 text-xs mt-0.5">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm">Revenue milestone reached: <span className="font-semibold text-gray-900">$2,400.00</span> today</p>
                <p className="text-gray-500 text-xs mt-0.5">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm"><span className="font-medium">Signature Wagyu Burger</span> price updated by Chef</p>
                <p className="text-gray-500 text-xs mt-0.5">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start sm:items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm">Table for <span className="font-medium">David Miller</span> reserved at 8:00 PM</p>
                <p className="text-gray-500 text-xs mt-0.5">4 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
