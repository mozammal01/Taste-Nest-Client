"use client";

import { useEffect, useState, useTransition } from "react";
import { getAllReservations, updateReservationStatus } from "@/lib/actions/reservation";
import { 
  Calendar, 
  Clock, 
  Users as UsersIcon, 
  MessageSquare,
  Search,
  CalendarCheck,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ButtonSpinner } from "@/components/ui/loading";

interface Reservation {
  id: number;
  user?: { name?: string | null };
  guests: number;
  date: string;
  time: string;
  phone: string;
  occasion?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
}

export default function ManagerReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchReservations = async () => {
    setLoading(true);
    const res = await getAllReservations();
    if (res.success) {
      setReservations(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const res = await getAllReservations();
      if (mounted && res.success) {
        setReservations(res.data || []);
      }
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    startTransition(async () => {
      const res = await updateReservationStatus(id, newStatus);
      if (res.success) {
        toast.success(`Reservation #${id} ${newStatus}`);
        fetchReservations();
      } else {
        toast.error(res.message || "Failed to update reservation");
      }
    });
  };

  const filteredReservations = reservations.filter((res) => 
    res.id.toString().includes(searchTerm) || 
    res.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.phone.includes(searchTerm) ||
    res.occasion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return "bg-amber-100 text-amber-600 border-amber-200";
      case 'confirmed': return "bg-green-100 text-green-600 border-green-200";
      case 'cancelled': return "bg-red-100 text-red-600 border-red-200";
      case 'completed': return "bg-blue-100 text-blue-600 border-blue-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Reservation <span className="text-primary italic">Board</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage floor capacity and specialized guest dining requests.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary group-focus-within:scale-110 transition-all" />
          <input
            type="text"
            placeholder="Search Guest, ID, Occasion..."
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <ButtonSpinner className="w-10 h-10 text-primary" />
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="h-96 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <CalendarCheck className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm text-center px-4">No reservations matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReservations.map((res) => (
            <div 
              key={res.id} 
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              {/* Top Glass Section */}
              <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                       <UsersIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-slate-400">Guests</p>
                       <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{res.guests} Pax</p>
                    </div>
                 </div>
                 <div className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                    getStatusColor(res.status)
                  )}>
                    {res.status}
                 </div>
              </div>

              {/* Booking Data */}
              <div className="p-6 flex-1 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5">
                          <Calendar size={10} strokeWidth={3} className="text-primary" /> Date
                       </p>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">{res.date}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1.5">
                          <Clock size={10} strokeWidth={3} className="text-primary" /> Arrival
                       </p>
                       <p className="text-sm font-bold text-slate-900 dark:text-white">{res.time}</p>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-50 dark:border-slate-800 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500">
                          {res.user?.name?.charAt(0) || "U"}
                       </div>
                       <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{res.user?.name || "Guest"}</p>
                          <p className="text-[10px] font-medium text-slate-400 truncate">{res.phone}</p>
                       </div>
                    </div>

                    {res.occasion && (
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg w-fit">
                          <Star size={12} className="text-primary fill-primary" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-primary">{res.occasion}</p>
                       </div>
                    )}

                    {res.message && (
                       <div className="flex gap-2 text-slate-500 bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 italic text-sm">
                          <MessageSquare size={14} className="shrink-0 mt-0.5" />
                          <p>&quot;{res.message}&quot;</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
                 {res.status.toLowerCase() === 'pending' ? (
                    <>
                       <button 
                          onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                          disabled={isPending}
                          className="py-2.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                       >
                          {isPending ? <ButtonSpinner className="w-4 h-4" /> : "Approve"}
                       </button>
                       <button 
                          onClick={() => handleStatusUpdate(res.id, 'cancelled')}
                          disabled={isPending}
                          className="py-2.5 bg-white border border-red-100 text-red-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                       >
                          {isPending ? <ButtonSpinner className="w-4 h-4 text-red-500" /> : "Decline"}
                       </button>
                    </>
                 ) : res.status.toLowerCase() === 'confirmed' ? (
                       <button 
                          onClick={() => handleStatusUpdate(res.id, 'completed')}
                          disabled={isPending}
                          className="col-span-2 py-2.5 bg-green-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                       >
                          {isPending ? <ButtonSpinner className="w-4 h-4" /> : "Complete Reservation"}
                       </button>
                    ) : (
                    <div className="col-span-2 py-2.5 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       Booking Resolved
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
