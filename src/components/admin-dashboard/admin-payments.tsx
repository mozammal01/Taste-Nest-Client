import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

async function getAdminPayments() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const headersList = await headers();
  const headersObj = Object.fromEntries(headersList.entries());

  try {
    const res = await fetch(`${API_URL}/payment`, {
      method: "GET",
      headers: headersObj,
      cache: "no-store",
    });

    if (!res.ok) return [];
    const response = await res.json();
    return response?.data || [];
  } catch (err) {
    console.error("[admin-payments] Fetch error:", err);
    return [];
  }
}

interface Payment {
  id: number;
  amount: string | number;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  order?: {
    user?: {
      name?: string | null;
      email?: string;
    };
  };
}

export default async function AdminPayments() {
  const user = await getCurrentUser();

  // Redirect non-admin users
  if (user?.role !== "admin") {
    redirect("/unauthorized");
  }

  const paymentsData = await getAdminPayments() as Payment[];

  // Define payment stats
  const totalRevenue = paymentsData
    .filter((p: Payment) => p.status === "completed" || p.status === "succeeded")
    .reduce((sum: number, p: Payment) => sum + Number(p.amount), 0);

  const completedCount = paymentsData.filter((p: Payment) => p.status === "completed" || p.status === "succeeded").length;
  const pendingCount = paymentsData.filter((p: Payment) => p.status === "pending").length;
  const failedCount = paymentsData.filter((p: Payment) => p.status === "failed" || p.status === "refunded").length;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">View and manage all transactions</p>
        </div>
        <Link href="/under-construction" className="sm:self-start">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-xl transition-all font-medium active:scale-95 text-sm">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Revenue</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalRevenue)}
              </p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Completed</p>
              <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">{completedCount}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Failed/Refunded</p>
              <p className="text-xl md:text-2xl font-bold text-red-600 mt-1">{failedCount}</p>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Payment ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paymentsData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                paymentsData.map((payment: Payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-primary font-mono font-medium">#{payment.id || payment.transactionId?.slice(-6) || "N/A"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{payment.order?.user?.name || "Unknown"}</span>
                        <span className="text-gray-500 text-xs">{payment.order?.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-semibold text-lg">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(payment.amount))}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{payment.paymentMethod || "Stripe"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide border ${
                          payment.status === "completed" || payment.status === "succeeded"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : payment.status === "refunded"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
