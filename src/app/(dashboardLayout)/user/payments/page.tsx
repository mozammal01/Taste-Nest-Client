import { getCurrentUser } from "@/lib/auth";
import { getMyPayments } from "@/lib/actions/payment";
import { redirect } from "next/navigation";
import { 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Receipt,
  FileText,
  CalendarDays
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Payment History | TasteNest",
  description: "View and manage your billing history",
};

interface MyPayment {
  id: string;
  orderId: string;
  status: string;
  amount: string | number;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
}

export default async function PaymentHistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const result = await getMyPayments();
  const payments = result.success ? result.data : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] mb-2">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure Billing</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Payment History</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage and track all your transactions with TasteNest.</p>
          </div>
          <div className="flex items-center gap-3">
          <Link href="/under-construction">
            <Button variant="outline" className="h-12 border-2 border-gray-100 rounded-xl font-bold bg-white hover:bg-gray-50 transition-all leading-none focus:ring-primary/20">
              <Download className="w-4 h-4 mr-2" />
              Download All
            </Button>
          </Link>
          </div>
        </div>

        {payments.length > 0 ? (
          <div className="space-y-4">
             {/* Transaction Header (Desktop) */}
             <div className="hidden lg:grid grid-cols-12 gap-4 px-8 py-4 bg-gray-900 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2 shadow-lg shadow-gray-200/40">
                <div className="col-span-4">Transaction Details</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-right">Invoice</div>
             </div>

             {/* Payments List */}
             {payments.map((payment: MyPayment) => (
                <Card key={payment.id} className="border-gray-100 shadow-xl shadow-gray-200/10 rounded-2xl ring-1 ring-black/2 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:items-center px-6 lg:px-8 py-6">
                            {/* Mobile Label Wrapper */}
                            <div className="col-span-4 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-gray-200/20 group-hover:scale-110 transition-transform ${payment.status === 'succeeded' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {payment.status === 'succeeded' ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                </div>
                                <div className="space-y-0.5">
                                    <h4 className="font-bold text-gray-900 tracking-tight">Payment for Order #{payment.orderId}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{payment.paymentMethod || 'Credit Card'} • {payment.transactionId?.slice(0, 12)}...</p>
                                </div>
                            </div>

                            <div className="col-span-2 py-1">
                                <div className="flex items-center gap-2 lg:block">
                                    <p className="lg:hidden text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-1 min-w-16">Date:</p>
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                        <CalendarDays className="w-3 h-3 text-gray-400" />
                                        <p className="font-bold text-sm tracking-tight">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 py-1">
                                <div className="flex items-center gap-2 lg:block">
                                   <p className="lg:hidden text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-1 min-w-16">Amount:</p>
                                   <p className="font-exrabold text-gray-900 text-lg tracking-tighter">${Number(payment.amount).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="col-span-2 py-1">
                                <div className="flex items-center gap-2 lg:block">
                                    <p className="lg:hidden text-[9px] font-bold uppercase text-gray-400 tracking-widest mb-1 min-w-16">Status:</p>
                                    <Badge className={`${getStatusColor(payment.status)} border px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider shadow-sm`}>
                                        {payment.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-end">
                                <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 shadow-none transition-all duration-300">
                                    <FileText className="w-5 h-5" />
                                </Button>
                                <Link href="/under-construction">
                                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 shadow-none transition-all duration-300">
                                        <Download className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
             ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-3xl p-24 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 ring-8 ring-gray-50/50">
               <Receipt className="w-10 h-10 text-gray-300" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No payment history</h3>
             <p className="text-gray-500 max-w-sm mb-10 leading-relaxed font-medium">
               Your financial records and payment confirmations will appear here once you place your first order.
             </p>
             <Link href="/menu">
               <Button className="bg-primary hover:bg-primary/90 h-14 px-8 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 leading-none">
                 Start Ordering
               </Button>
             </Link>
          </Card>
        )}

        {/* Info Box */}
        <div className="mt-16 bg-blue-50/50 rounded-2xl border border-blue-100 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10 shrink-0 ring-4 ring-blue-50/50">
                <ShieldCheck className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h4 className="font-bold text-gray-900 tracking-tight">Your payments are fully secure</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1">
                    TasteNest uses industry-standard encryption for all transactions. Your card details are never stored on our servers.
                </p>
            </div>
            <Link href="/profile">
                <Button variant="outline" className="h-12 border-2 border-blue-100 rounded-xl font-bold hover:bg-blue-50 px-6 transition-all text-blue-600">
                    Update Billing Method
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
