import { getCurrentUser, RewardRecord } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  const user = await getCurrentUser();

  // Redirect admins to admin dashboard
  if (user?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Welcome back, {user?.name || "Guest"}! 👋</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Here&apos;s what&apos;s happening with your TasteNest account.</p>
          </div>
          <span className="self-start sm:self-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs md:text-sm font-medium capitalize">{user?.role || "user"}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 truncate">{user?._count?.orders || 0}</p>
                <p className="text-sm text-gray-500 truncate">Total Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 truncate">{user?._count?.reservations || 0}</p>
                <p className="text-sm text-gray-500 truncate">Total Reservations</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 truncate">
                  {(user?.rewards || []).reduce((acc: number, r: RewardRecord) => r.type === 'earn' ? acc + r.points : acc - r.points, 0)}
                </p>
                <p className="text-sm text-gray-500 truncate">Loyalty Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/menu"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🍽️</span>
              <span className="text-xs md:text-sm font-medium text-gray-700 text-center">Browse Menu</span>
            </Link>
            <Link
              href="/#reservation"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📅</span>
              <span className="text-xs md:text-sm font-medium text-gray-700 text-center">Reservations</span>
            </Link>
            <Link
              href="/user/orders"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📦</span>
              <span className="text-xs md:text-sm font-medium text-gray-700 text-center">Track Orders</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
              <span className="text-xs md:text-sm font-medium text-gray-700 text-center">Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Account Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</span>
                <span className="text-sm font-medium text-gray-900">{user?.name || "Not set"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</span>
                <span className="text-sm font-medium text-gray-900 truncate">{user?.email}</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current Role</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{user?.role || "user"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member ID</span>
                <span className="text-sm font-medium text-gray-900 font-mono tracking-tighter">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
