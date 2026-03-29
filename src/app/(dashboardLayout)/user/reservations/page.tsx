import { getCurrentUser } from "@/lib/auth";
import { getMyReservations } from "@/lib/actions/reservation";
import { redirect } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  ChevronRight,
  Plus,
  History,
  AlertCircle,
  MapPin,
  Utensils
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CancelButton from "@/components/reservations/CancelButton";

export const metadata = {
  title: "My Reservations | TasteNest",
  description: "View and manage your table bookings",
};

export default async function MyReservationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  const result = await getMyReservations();
  const reservations = result.success ? result.data : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500 text-white border-none shadow-lg shadow-green-500/20';
      case 'pending': return 'bg-amber-500 text-white border-none shadow-lg shadow-amber-500/20';
      case 'cancelled': return 'bg-slate-400 text-white border-none';
      default: return 'bg-slate-100 text-slate-700 border-none';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Dining Portfolio</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter lg:text-7xl">
              My <span className="text-amber-500 italic">Bookings</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium max-w-xl leading-relaxed">
              Your exclusive history of fine dining at TasteNest. Manage your upcoming seats below.
            </p>
          </div>
          <Link href="/#reservation">
            <Button className="bg-slate-950 hover:bg-amber-500 h-20 px-10 rounded-[28px] font-black text-lg shadow-2xl transition-all duration-500 active:scale-95 text-white">
              <Plus className="w-6 h-6 mr-3" />
              Claim Another Table
            </Button>
          </Link>
        </div>

        {reservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {reservations.map((reservation: any) => (
              <Card key={reservation.id} className="border-none bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-500 group">
                <CardHeader className="p-8 pb-0">
                  <div className="flex justify-between items-center">
                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                      <Utensils size={28} />
                    </div>
                    <Badge className={`${getStatusColor(reservation.status)} px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest`}>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                        <Calendar size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reserved Date</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{reservation.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                        <Clock size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dinner Time</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{reservation.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                        <Users size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Group Size</p>
                        <p className="text-xl font-black text-slate-900 leading-none">{reservation.guests} Guests</p>
                      </div>
                    </div>
                  </div>

                  {reservation.message && (
                    <div className="p-5 bg-slate-50 rounded-2xl flex gap-4 border border-slate-100 italic">
                      <MessageSquare className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        &quot;{reservation.message}&quot;
                      </p>
                    </div>
                  )}

                  <div className="pt-8 border-t border-slate-100 mt-auto">
                    <CancelButton id={reservation.id} status={reservation.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[60px] shadow-2xl p-32 flex flex-col items-center justify-center text-center border border-slate-100">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center ring-16 ring-slate-50/50">
                <Calendar className="w-14 h-14 text-slate-200" />
              </div>
              <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl text-white">
                <Plus className="w-6 h-6 stroke-[3px]" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">No Gourmet Evenings Found</h3>
            <p className="text-slate-500 max-w-md mb-12 text-xl font-medium leading-relaxed">
              Planning a special celebration? Claim your luxury table now and experience the TasteNest way.
            </p>
            <Link href="/#reservation">
              <Button className="bg-slate-950 hover:bg-amber-500 h-20 px-14 rounded-3xl font-black text-xl shadow-2xl transition-all duration-500 active:scale-95 text-white">
                Book a Private Table
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
