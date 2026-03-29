import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import Link from "next/link";
import { User, Mail, Phone, Calendar, ShieldCheck, Trash2, Edit2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import UserFilter from "./UserFilter";
import UserActions from "./UserActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SearchParams = {
  page?: string;
  limit?: string;
  searchTerm?: string;
  role?: string;
};

// Utility to build query string safely
function buildQuery(params: SearchParams) {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", params.page);
  if (params.limit) sp.set("limit", params.limit);
  if (params.searchTerm) sp.set("searchTerm", params.searchTerm);
  if (params.role) sp.set("role", params.role);
  return sp.toString();
}

// Helper for conditional classes
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
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
  
  // Note: Fetch directly from server-side using the session token for secure data access
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
  const total = usersResult.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-4 md:p-8 bg-slate-50/50 min-h-screen">
      {/* Header Section with Animation Feel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-outfit">User Management</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest opacity-70">Authorized Members Administration</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex items-center gap-4 group hover:border-primary/30 transition-all">
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-sm shadow-primary/40" />
          <div className="text-slate-700 font-black text-sm uppercase tracking-[0.15em] flex items-center gap-1.5 font-outfit">
            <span className="text-primary text-base">{total}</span>
            <span className="opacity-50">Members Found</span>
          </div>
        </div>
      </div>

      {/* Integration of Client-Side Filter (Dynamic + Secure) */}
      <UserFilter 
        key={query}
        initialSearch={sp.searchTerm || ""} 
        initialRole={sp.role || ""} 
      />

      {/* Advanced Unified Users Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] font-outfit">Profile Identity</th>
                <th className="text-left px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] font-outfit">Access Email</th>
                <th className="text-left px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] font-outfit">Permissions</th>
                <th className="text-left px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] font-outfit">Joined Since</th>
                <th className="text-right px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] font-outfit">Administration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.length > 0 ? users.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-all duration-500 cursor-default">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative group/avatar">
                        <div className="w-14 h-14 bg-linear-to-br from-slate-100 to-slate-200 rounded-[20px] flex items-center justify-center overflow-hidden border-2 border-white shadow-xl shadow-slate-200 transition-all group-hover/avatar:scale-105 group-hover/avatar:rotate-3">
                          {u.image ? (
                            <Image src={u.image} alt={u.name || ""} width={56} height={56} className="object-cover" />
                          ) : (
                            <User className="text-slate-400 w-7 h-7" />
                          )}
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ring-2 ring-white/50",
                          u.role === 'admin' ? 'bg-amber-400' : 'bg-primary'
                        )} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-black text-[15px] tracking-tight font-outfit">{u.name || "Anonymous User"}</p>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">Serial ID: #{u.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center gap-3 text-slate-600 font-bold text-sm tracking-tight opacity-90 transition-all group-hover:translate-x-1">
                          <Mail size={15} className="text-primary/40" />
                          <span>{u.email}</span>
                       </div>
                       {u.phone && (
                         <div className="flex items-center gap-3 text-slate-400 font-medium text-xs tracking-wide">
                           <Phone size={13} className="text-slate-300" />
                           <span>{u.phone}</span>
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xs transition-all",
                      u.role === "admin"
                        ? "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100"
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    )}>
                      {u.role === 'admin' ? <ShieldCheck size={13} strokeWidth={3} /> : null}
                      {u.role || "user"}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-slate-700 font-black text-xs uppercase tracking-[0.15em] font-outfit group-hover:text-slate-900">
                       <Calendar size={16} className="text-primary/30" />
                       {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <UserActions 
                      userId={u.id} 
                      userName={u.name || "Anonymous User"} 
                      currentRole={u.role || "user"} 
                      token={token}
                    />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-32 text-center space-y-5 bg-slate-50/20">
                     <div className="relative inline-flex mb-4">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                        <div className="relative w-20 h-20 bg-white rounded-[28px] shadow-xl border border-slate-100 flex items-center justify-center mx-auto">
                           <Search className="text-primary/30 w-10 h-10 animate-bounce duration-2000" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-slate-900 font-black text-lg font-outfit tracking-tight">Zero Members Found</p>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest max-w-xs mx-auto opacity-70">We couldn't find any users matching your criteria. Try adjusting your filters.</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* High-End Pagination Footer */}
        <div className="bg-slate-50/50 px-10 py-6 flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 gap-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-outfit">
            System Data Rendering &bull; <span className="text-primary/70">{users.length} Records Shown</span>
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/users?${buildQuery({ ...sp, page: String(Math.max(1, page - 1)) })}`}
              className={cn(
                "w-12 h-12 rounded-[18px] bg-white border border-slate-200 text-slate-400 flex items-center justify-center transition-all hover:shadow-xl hover:text-primary hover:border-primary/20 shadow-sm disabled:opacity-30",
                page <= 1 && "pointer-events-none opacity-30"
              )}
            >
              <ChevronLeft size={22} strokeWidth={3} />
            </Link>
            
            <div className="bg-white px-6 h-12 rounded-[18px] border border-slate-100 flex items-center justify-center text-[13px] font-black text-slate-900 shadow-xl shadow-slate-200/40 font-outfit">
              <span className="text-primary italic mr-1">{page}</span> / <span className="opacity-40">{totalPages}</span>
            </div>

            <Link
              href={`/admin/users?${buildQuery({ ...sp, page: String(Math.min(totalPages, page + 1)) })}`}
              className={cn(
                "w-12 h-12 rounded-[18px] bg-white border border-slate-200 text-slate-400 flex items-center justify-center transition-all hover:shadow-xl hover:text-primary hover:border-primary/20 shadow-sm disabled:opacity-30",
                page >= totalPages && "pointer-events-none opacity-30"
              )}
            >
              <ChevronRight size={22} strokeWidth={3} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
