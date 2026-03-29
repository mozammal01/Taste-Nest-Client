"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw, Filter, Loader2 } from "lucide-react";
import { useTransition } from "react";

export default function UserFilter({ initialSearch, initialRole }: { initialSearch: string; initialRole: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("searchTerm") as string;
    const userRole = formData.get("role") as string;

    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("searchTerm", search);
    else params.delete("searchTerm");
    
    if (userRole) params.set("role", userRole);
    else params.delete("role");
    
    params.set("page", "1"); // Reset to first page
    
    startTransition(() => {
        router.push(`/admin/users?${params.toString()}`);
    });
  };

  const handleReset = () => {
    startTransition(() => {
        router.push("/admin/users");
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-5 mb-8">
      <form onSubmit={handleFilter} className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            name="searchTerm"
            defaultValue={initialSearch}
            placeholder="Search by name or email..."
            className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm font-medium outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 bg-slate-50/30 transition-all font-outfit"
          />
        </div>
        
        <div className="relative w-full lg:w-56 group">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none group-focus-within:text-primary transition-colors" />
          <select
            name="role"
            defaultValue={initialRole}
            className="h-12 w-full appearance-none rounded-2xl border border-slate-200 pl-11 pr-10 text-sm font-bold text-slate-700 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 bg-slate-50/30 transition-all cursor-pointer font-outfit"
          >
            <option value="">All Account Roles</option>
            <option value="admin">System Administrator</option>
            <option value="user">Regular Customer</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="h-12 px-8 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center gap-2 font-outfit disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isPending ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Applying...</span>
                </>
            ) : (
                <>
                    <span>Apply Filters</span>
                </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="h-12 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 flex items-center gap-2 font-outfit disabled:opacity-50"
          >
            <RotateCcw size={16} className={isPending ? "animate-spin" : ""} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
