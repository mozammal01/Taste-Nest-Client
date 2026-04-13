"use client";

import { useEffect, useState, useTransition } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/actions/order";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ShoppingBag, 
  Search,
  User,
  MapPin,
  Phone,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ButtonSpinner } from "@/components/ui/loading";

interface Order {
  id: number;
  user?: { name?: string | null };
  address: string;
  status: string;
  phone?: string | null;
  totalAmount: number;
  createdAt: string;
}

export default function ManagerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchOrders = async () => {
    setLoading(true);
    const res = await getAllOrders();
    if (res.success) {
      setOrders(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const res = await getAllOrders();
      if (mounted && res.success) {
        setOrders(res.data || []);
      }
      if (mounted) setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order #${orderId} marked as ${newStatus}`);
        fetchOrders();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    });
  };

  const filteredOrders = orders.filter((order) => 
    order.id.toString().includes(searchTerm) || 
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <ShoppingBag className="w-4 h-4" />;
      case 'cooking': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return "bg-amber-100 text-amber-600 border-amber-200";
      case 'confirmed': return "bg-blue-100 text-blue-600 border-blue-200";
      case 'cooking': return "bg-purple-100 text-purple-600 border-purple-200";
      case 'delivered': return "bg-green-100 text-green-600 border-green-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Order <span className="text-secondary italic">Logistics</span>
          </h1>
          <p className="text-slate-500 font-medium">Real-time management of restaurant delivery and pickup.</p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-secondary group-focus-within:scale-110 transition-all" />
          <input
            type="text"
            placeholder="Search Order ID, Client, Address..."
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all shadow-sm font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <ButtonSpinner className="w-10 h-10 text-secondary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="h-96 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm text-center px-4">No active orders matching your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 group overflow-hidden"
            >
              <div className="p-8 flex flex-col lg:flex-row gap-8">
                {/* Order ID & Status */}
                <div className="lg:w-1/4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-linear-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Reference</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">#{order.id.toString().padStart(5, '0')}</p>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xs transition-all",
                    getStatusColor(order.status)
                  )}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Clock size={12} strokeWidth={3} />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="lg:w-2/4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Customer</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{order.user?.name || "Member"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Contact</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{order.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Delivery Destination</p>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{order.address}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/4 flex flex-col justify-center gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Workflow Actions</p>
                  
                  {order.status.toLowerCase() === 'pending' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                      disabled={isPending}
                      className="w-full py-3 bg-secondary text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-secondary/25 hover:bg-secondary/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isPending ? <ButtonSpinner className="w-4 h-4" /> : "Confirm Order"}
                    </button>
                  )}
                  
                  {order.status.toLowerCase() === 'confirmed' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'cooking')}
                      disabled={isPending}
                      className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-purple-600/25 hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isPending ? <ButtonSpinner className="w-4 h-4" /> : "Start Cooking"}
                    </button>
                  )}

                  {order.status.toLowerCase() === 'cooking' && (
                    <button 
                      onClick={() => handleStatusUpdate(order.id, 'delivered')}
                      disabled={isPending}
                      className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-600/25 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isPending ? <ButtonSpinner className="w-4 h-4" /> : "Mark Delivered"}
                    </button>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800 mt-2">
                    <p className="text-[10px] font-black text-slate-300 uppercase">Valuation</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
