import { getCurrentUser } from "@/lib/auth";
import { getMyOrders } from "@/lib/actions/order";
import { redirect } from "next/navigation";
import Image from "next/image";
import { 
  Package, 
  ChevronRight, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "My Orders | TasteNest",
  description: "View and track your previous orders",
};

export default async function MyOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

interface OrderItem {
  id: string;
  quantity: number;
  price: string | number;
  menuItem: {
    name: string;
    image?: string;
  };
}

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  totalAmount: string | number;
  createdAt: string;
  address: string;
  transactionId?: string;
  items: OrderItem[];
}

  const result = await getMyOrders();
  const orders = result.success ? result.data : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
              <Package className="w-3 h-3" />
              <span>Order History</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
            <p className="text-gray-500 mt-2 font-medium">Keep track of your delicious journeys with us.</p>
          </div>
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-95">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Order Something New
            </Button>
          </Link>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <Card key={order.id} className="border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden ring-1 ring-black/2 group hover:ring-primary/20 transition-all duration-300">
                <CardContent className="p-0">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order ID</p>
                        <p className="font-bold text-gray-900">#{order.id}</p>
                      </div>
                      <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Placed</p>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock className="w-3 h-3" />
                          <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-gray-200 hidden sm:block" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Amount</p>
                        <p className="font-exrabold text-primary">${Number(order.totalAmount).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(order.status)} hover:bg-secondary/60 border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm`}>
                         {order.status}
                      </Badge>
                      <Badge className={`${order.paymentStatus === 'paid' ? 'bg-green-200 text-green-600 hover:bg-green-400/60 border-green-100' : 'bg-red-50 text-red-600 border-red-100'} border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                         {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Items Column */}
                      <div className="lg:col-span-8 space-y-4">
                        {order.items.map((item: OrderItem) => (
                          <div key={item.id} className="flex items-center gap-4 group/item">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 ring-1 ring-gray-100 shrink-0 group-hover/item:scale-105 transition-transform duration-300">
                              <Image 
                                src={item.menuItem.image || "/placeholder.png"} 
                                alt={item.menuItem.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 truncate group-hover/item:text-primary transition-colors">{item.menuItem.name}</h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                              </p>
                            </div>
                            <p className="font-bold text-gray-900 text-sm">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>

                      {/* Delivery/Payment Details Column */}
                      <div className="lg:col-span-4 bg-gray-50/50 rounded-2xl p-5 space-y-4 border border-gray-100">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                            <div className="space-y-1">
                              <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">Delivery Address</p>
                              <p className="text-sm font-medium text-gray-600 leading-relaxed">{order.address}</p>
                            </div>
                          </div>
                          {order.transactionId && (
                            <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                              <div className="space-y-1">
                                <p className="text-[9px] font-bold tracking-widest uppercase text-gray-400">Transaction ID</p>
                                <p className="text-[11px] font-mono text-gray-500 break-all">{order.transactionId}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer Actions */}
                  <div className="p-4 bg-gray-50/10 border-t border-gray-50 flex justify-end gap-3">
                    <Button variant="ghost" className="text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg font-bold text-xs transition-all uppercase tracking-widest px-4 h-10">
                      Need Help?
                    </Button>
                    <Link href={`/menu`}>
                      <Button variant="outline" className="border-gray-200 hover:border-primary/20 hover:bg-primary/5 text-gray-700 rounded-lg font-bold text-xs transition-all uppercase tracking-widest px-4 h-10">
                        Order Again
                        <ChevronRight className="w-3 h-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-3xl p-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-gray-50/50">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No orders yet</h3>
            <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
              You haven&apos;t placed any orders yet. Start your culinary journey by browsing our amazing menu!
            </p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group">
                Browse Menu
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

function ArrowRight(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
