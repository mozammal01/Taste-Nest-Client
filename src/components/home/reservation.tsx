"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, MessageSquare, ChevronRight, CheckCircle2, Star, Utensils, Sparkles } from "lucide-react";
import { createReservation } from "@/lib/actions/reservation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import backgroundImg from "@/../public/menu&dishes/reservation-bg.png";

interface ReservationSectionProps {
  user?: any;
}

export default function Reservation({ user }: ReservationSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    guests: 2,
    date: "",
    time: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to make a reservation", {
        action: {
          label: "Sign In",
          onClick: () => router.push("/signin"),
        },
      });
      return;
    }

    if (!formData.date || !formData.time || formData.guests < 1) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReservation(formData);
      if (result.success) {
        setIsSuccess(true);
        toast.success("Table reserved successfully!");
        setFormData({ guests: 2, date: "", time: "", message: "" });
      } else {
        toast.error(result.message || "Failed to make reservation");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[50px] bg-slate-950 p-20 text-center text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-amber-500/10 via-transparent to-primary/10" />
        <div className="relative z-10 flex flex-col items-center gap-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-500/20 text-green-400 ring-20 ring-green-500/5 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
              <CheckCircle2 size={70} strokeWidth={1.5} />
            </div>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-green-500/30 rounded-full"
            />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter lg:text-7xl">SUCCESS!</h2>
            <p className="max-w-xl text-xl text-slate-400 leading-relaxed font-medium">
              Your gourmet journey begins soon. Your table at <span className="text-amber-400 italic">TasteNest</span> is secured. 
              Check your dashboard for details.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <button 
              onClick={() => setIsSuccess(false)}
              className="px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 text-lg"
            >
              Reserve Again
            </button>
            <button 
              onClick={() => router.push("/user/reservations")}
              className="px-12 py-6 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all active:scale-95 text-lg shadow-xl shadow-amber-500/30"
            >
              My Reservations
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <section id="reservation" className="relative py-40 overflow-hidden bg-[#fafafa]">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImg} 
          alt="Luxury Restaurant Interior" 
          fill 
          className="object-cover opacity-80 brightness-[0.7] transform scale-110" 
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/40 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_100%)] z-10 opacity-60" />
      </div>

      <div className="container relative z-20 mx-auto px-6 max-w-[1440px]">
        <div className="grid grid-cols-1 items-start gap-24 lg:grid-cols-2">
          
          {/* Text Content - High-End Minimalist */}
          <div className="lg:sticky lg:top-40 pt-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-amber-500" />
                <span className="text-sm font-black uppercase tracking-[0.4em] text-amber-600">Table booking</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-7xl font-black leading-[0.9] text-slate-950 lg:text-[100px] tracking-tighter">
                  Elegance <br />
                  <span className="text-amber-500 italic flex items-center gap-4">
                    defined <Sparkles className="w-12 h-12" />
                  </span>
                </h2>
                <p className="text-2xl font-medium leading-relaxed text-slate-600 max-w-lg lg:border-l-4 lg:border-amber-500 lg:pl-10">
                  Secure your front-row seat to culinary art. Every table is a story waiting to be told.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-10">
                 <div className="space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-black/5 text-amber-500">
                      <Utensils size={28} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">Fine Dining</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">Michelin Star Quality</p>
                 </div>
                 <div className="space-y-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xl shadow-black/5 text-amber-500">
                      <Star size={28} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">VIP Service</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">Dedicated Butler</p>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* New Model Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[60px] bg-white p-12 lg:p-20 shadow-[0_100px_150px_-30px_rgba(0,0,0,0.12)] border border-slate-100">
              
              <div className="mb-14 space-y-2">
                <span className="text-amber-500 font-black uppercase text-xs tracking-widest">New Reservation</span>
                <h3 className="text-4xl font-black text-slate-950 tracking-tight">Booking Portal</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                  {/* Guests Input */}
                  <div className="group relative">
                    <label className={cn("absolute left-0 -top-6 text-[10px] font-black uppercase tracking-widest transition-all duration-300", focusedField === 'guests' ? 'text-amber-500' : 'text-slate-400')}>
                      Group Size
                    </label>
                    <div className="flex items-center gap-4 border-b-2 border-slate-100 py-3 group-focus-within:border-amber-500 transition-colors">
                      <Users className="w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        name="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('guests')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-black text-xl text-slate-900 placeholder:text-slate-200"
                        placeholder="2 Person"
                        required
                      />
                    </div>
                  </div>

                  {/* Date Input */}
                  <div className="group relative">
                    <label className={cn("absolute left-0 -top-6 text-[10px] font-black uppercase tracking-widest transition-all duration-300", focusedField === 'date' ? 'text-amber-500' : 'text-slate-400')}>
                      Arrival Date
                    </label>
                    <div className="flex items-center gap-4 border-b-2 border-slate-100 py-3 group-focus-within:border-amber-500 transition-colors">
                      <Calendar className="w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('date')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-black text-xl text-slate-900 uppercase"
                        required
                      />
                    </div>
                  </div>

                  {/* Time Input */}
                  <div className="group relative">
                    <label className={cn("absolute left-0 -top-6 text-[10px] font-black uppercase tracking-widest transition-all duration-300", focusedField === 'time' ? 'text-amber-500' : 'text-slate-400')}>
                      Dinner Time
                    </label>
                    <div className="flex items-center gap-4 border-b-2 border-slate-100 py-3 group-focus-within:border-amber-500 transition-colors">
                      <Clock className="w-5 h-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                      <input
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('time')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-black text-xl text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Identity Indicator */}
                  <div className="group relative">
                    <label className="absolute left-0 -top-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Reserved For</label>
                    <div className="flex items-center gap-4 border-b-2 border-slate-100 py-3">
                      <div className="h-4 w-4 rounded-full bg-amber-500 animate-pulse" />
                      <span className="font-black text-lg text-slate-900 truncate">
                        {user ? user.name || user.email : "Guest Access"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="group relative pt-4">
                  <label className={cn("absolute left-0 -top-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300", focusedField === 'message' ? 'text-amber-500' : 'text-slate-400')}>
                    Personal Note
                  </label>
                  <div className="flex items-start gap-4 border-b-2 border-slate-100 py-4 group-focus-within:border-amber-500 transition-colors">
                    <MessageSquare className="w-5 h-5 text-slate-300 mt-1 group-focus-within:text-amber-500 transition-colors" />
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Share allergies or special celebrations..."
                      className="w-full bg-transparent outline-hidden font-bold text-lg text-slate-900 placeholder:text-slate-200 resize-none"
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-24 bg-slate-950 text-white hover:bg-amber-500 transition-all duration-500 rounded-3xl mt-6 flex items-center justify-center gap-4 group active:scale-95 shadow-2xl shadow-black/10"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <span className="h-6 w-6 animate-spin rounded-full border-4 border-white/20 border-t-white" />
                      <span className="font-black text-xl uppercase tracking-widest">Securing...</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-black text-2xl uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Submit booking</span>
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
