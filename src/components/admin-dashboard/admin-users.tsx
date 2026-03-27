import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SearchParams = {
  page?: string;
  limit?: string;
  searchTerm?: string;
  role?: string;
};

function buildQuery(params: SearchParams) {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", params.page);
  if (params.limit) sp.set("limit", params.limit);
  if (params.searchTerm) sp.set("searchTerm", params.searchTerm);
  if (params.role) sp.set("role", params.role);
  return sp.toString();
}

export default async function AdminUsers({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const user = await getCurrentUser();

  // Redirect non-admin users
  if (user?.role !== "admin") {
    redirect("/dashboard");
  }

  const sp = (await searchParams) || {};
  const page = Number(sp.page || 1);
  const limit = Number(sp.limit || 10);
  const query = buildQuery({ ...sp, page: String(page), limit: String(limit) });

  const cookieStore = await cookies();
  const token = cookieStore.get("better-auth.session_token")?.value;
  const usersRes = await fetch(`${API_URL}/user?${query}`, {
    cache: "no-store",
    headers: token ? { Cookie: `better-auth.session_token=${token}` } : undefined,
  });
  const usersResult = (await usersRes.json()) as {
    success?: boolean;
    meta?: { page?: number; limit?: number; total?: number };
    data?: Array<{
      id: string;
      name: string | null;
      email: string;
      role: string | null;
      phone?: string | null;
      createdAt: string;
      image?: string | null;
    }>;
  };
  const users = usersResult.success && Array.isArray(usersResult.data) ? usersResult.data : [];
  const total = usersResult.meta?.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-medium">
            {total} total users
          </span>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <form className="flex flex-col md:flex-row gap-3 md:items-center">
          <input
            name="searchTerm"
            defaultValue={sp.searchTerm || ""}
            placeholder="Search by name or email..."
            className="h-11 w-full md:flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <select
            name="role"
            defaultValue={sp.role || ""}
            className="h-11 w-full md:w-48 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button
            type="submit"
            className="h-11 px-5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
          >
            Apply
          </button>
          <Link
            href="/admin/users"
            className="h-11 px-5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Reset
          </Link>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Admins</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter((u) => u.role === "admin").length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Regular Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{users.filter((u) => u.role === "user").length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-gray-100">
                        {u.image ? (
                          <Image src={u.image} alt={u.name || ""} width={40} height={40} className="rounded-full object-cover" />
                        ) : (
                          <span className="text-white font-semibold">{u.name?.charAt(0)?.toUpperCase() || "U"}</span>
                        )}
                      </div>
                      <span className="text-gray-900 font-medium">{u.name || "No name"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-gray-600">{u.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                        u.role === "admin"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {u.role || "user"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page <span className="font-medium text-gray-900">{page}</span> of{" "}
          <span className="font-medium text-gray-900">{totalPages}</span>
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/users?${buildQuery({ ...sp, page: String(Math.max(1, page - 1)), limit: String(limit) })}`}
            className={`h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold flex items-center justify-center ${
              page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-50"
            }`}
          >
            Prev
          </Link>
          <Link
            href={`/admin/users?${buildQuery({ ...sp, page: String(Math.min(totalPages, page + 1)), limit: String(limit) })}`}
            className={`h-10 px-4 rounded-xl border border-gray-200 text-sm font-semibold flex items-center justify-center ${
              page >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-gray-50"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
