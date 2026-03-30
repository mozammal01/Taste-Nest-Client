import { getCurrentUser } from "@/lib/auth";
import { getMyOrders } from "@/lib/actions/order";
import { redirect } from "next/navigation";

import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Orders | TasteNest",
  description: "View your order history and status",
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
    case "confirmed": return "bg-blue-100 text-blue-700 border-blue-200";
    case "delivered": return "bg-green-100 text-green-700 border-green-200";
    case "cancelled": return "bg-red-100 text-red-700 border-red-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return <Clock className="w-4 h-4" />;
    case "confirmed": return <CheckCircle2 className="w-4 h-4" />;
    case "delivered": return <Truck className="w-4 h-4" />;
    case "cancelled": return <XCircle className="w-4 h-4" />;
    default: return <Package className="w-4 h-4" />;
  }
};

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
  createdAt: string;
  totalAmount: string | number;
  address: string;
  phone: string;
  items: OrderItem[];
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const result = await getMyOrders();
  const orders = result.success ? result.data : [];

  return (
    <>

      <main className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-20 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8 text-wrap">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-500 mt-2">View and track all your delicious orders</p>
            </div>
            <Link href="/menu">
              <Button variant="outline" className="rounded-xl border-gray-200 text-gray-700">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Order Something Else
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                You haven&apos;t placed any orders yet. Once you do, they will appear here for you to track.
              </p>
              <Link href="/menu">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl font-bold">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order: Order) => (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Order #{order.id}</p>
                        <p className="text-base font-bold text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                      <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Amount</p>
                        <p className="text-lg font-black text-primary">${Number(order.totalAmount).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items?.map((item: OrderItem) => (
                        <div key={item.id} className="flex items-center gap-4 group">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            <Image
                              src={item.menuItem.image || "/placeholder.png"}
                              alt={item.menuItem.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 leading-tight">{item.menuItem.name}</h4>
                            <p className="text-xs text-gray-500 font-medium">
                              Qty: {item.quantity} x ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <p className="font-bold text-gray-700">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{order.address}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4" />
                          <span>{order.phone}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" className="text-gray-400 group hover:text-primary">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function MapPin(props: { className?: string }) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Phone(props: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
