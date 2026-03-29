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
  Utensils,
  Phone,
  PartyPopper
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
      case 'confirmed': return 'bg-green-500 text-white border-none shadow-lg shadow-green-500/10';
      case 'pending': return 'bg-primary text-white border-none shadow-lg shadow-primary/10';
      case 'cancelled': return 'bg-slate-400 text-white border-none';
      default: return 'bg-slate-100 text-slate-700 border-none';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Elegant Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-primary bg-primary/5 px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-[9px]">
              <Calendar className="w-3 h-3" />
              <span>Dining Portfolio</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter lg:text-5xl">
              My <span className="text-primary italic">Bookings</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-lg leading-relaxed">
              Your exclusive history of fine dining at TasteNest. Manage your upcoming seats below.
            </p>
          </div>
          <Link href="/#reservation">
            <Button className="bg-slate-950 hover:bg-primary h-16 px-8 rounded-2xl font-black text-base shadow-xl transition-all duration-300 active:scale-95 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Claim Another Table
            </Button>
          </Link>
        </div>

        {reservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reservations.map((reservation: any) => (
              <Card key={reservation.id} className="border border-slate-100 bg-white rounded-[32px] shadow-sm overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                <CardHeader className="p-6 pb-0">
                  <div className="flex justify-between items-center">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 group-hover:bg-primary group-hover:text-white transition-all">
                      <Utensils size={20} />
                    </div>
                    <Badge className={`${getStatusColor(reservation.status)} px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest`}>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Calendar size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black uppercase border-b border-primary/20 tracking-widest text-slate-400">Reserved Date</p>
                        <p className="text-base font-black text-slate-900">{reservation.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Clock size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black uppercase border-b border-primary/20 tracking-widest text-slate-400">Dinner Time</p>
                        <p className="text-base font-black text-slate-900">{reservation.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                        <Users size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black uppercase border-b border-primary/20 tracking-widest text-slate-400">Group Size</p>
                        <p className="text-base font-black text-slate-900">{reservation.guests} Guests</p>
                      </div>
                    </div>

                    {reservation.occasion && (
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <PartyPopper size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black uppercase border-b border-primary/20 tracking-widest text-slate-400">Special Occasion</p>
                          <p className="text-base font-black text-slate-900 capitalize">{reservation.occasion}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {reservation.message && (
                    <div className="p-4 bg-slate-50 rounded-xl flex gap-3 border border-slate-100 italic">
                      <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        &quot;{reservation.message}&quot;
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-slate-100 mt-auto">
                    <CancelButton id={reservation.id} status={reservation.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] shadow-sm p-24 flex flex-col items-center justify-center text-center border border-slate-100">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center ring-12 ring-slate-50/50">
                <Calendar className="w-10 h-10 text-slate-200" />
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg text-white">
                <Plus className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">No Gourmet Evenings Found</h3>
            <p className="text-slate-500 max-w-sm mb-10 text-lg font-medium leading-relaxed">
              Planning a special celebration? Claim your luxury table now and experience the TasteNest way.
            </p>
            <Link href="/#reservation">
              <Button className="bg-slate-950 hover:bg-primary h-16 px-10 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 active:scale-95 text-white">
                Book a Private Table
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
