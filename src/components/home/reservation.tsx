"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, MessageSquare, ChevronRight, CheckCircle2, Star, Utensils, Sparkles, Phone, PartyPopper, AlertCircle } from "lucide-react";
import { createReservation } from "@/lib/actions/reservation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import backgroundImg from "@/../public/menu&dishes/reservation-bg.png";

const reservationSchema = z.object({
  guests: z.number().min(1, "At least 1 guest required").max(20, "Maximum 20 guests per booking"),
  date: z.string().min(1, "Arrival date is required"),
  time: z.string().min(1, "Preferred time is required"),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number format"),
  occasion: z.string().optional(),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
});

interface ReservationSectionProps {
  user?: any;
}

export default function Reservation({ user }: ReservationSectionProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    guests: 2,
    date: "",
    time: "",
    phone: "",
    occasion: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) || 0 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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

    // Zod Validation
    const validationResult = reservationSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReservation(formData);
      if (result.success) {
        setIsSuccess(true);
        toast.success("Table reserved successfully!");
        setFormData({ guests: 2, date: "", time: "", phone: "", occasion: "", message: "" });
        setErrors({});
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
        className="relative overflow-hidden rounded-[40px] bg-slate-950 p-12 md:p-20 text-center text-white shadow-2xl border border-white/5 mx-6"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-primary/10 via-transparent to-primary/20" />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="relative"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary ring-12 ring-primary/5 shadow-2xl">
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tighter lg:text-6xl">CONFIRMED!</h2>
            <p className="max-w-xl text-lg text-slate-400 leading-relaxed font-medium">
              We've secured your table at <span className="text-primary italic font-bold">TasteNest</span>. 
              Get ready for an unforgettable dining experience.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <button 
              onClick={() => setIsSuccess(false)}
              className="px-8 py-4 bg-white text-slate-950 font-black rounded-xl hover:bg-slate-200 transition-all active:scale-95 text-base"
            >
              Book Another
            </button>
            <button 
              onClick={() => router.push("/user/reservations")}
              className="px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all active:scale-95 text-base shadow-xl shadow-primary/30"
            >
              My Bookings
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <section id="reservation" className="relative py-24 overflow-hidden bg-white">
      {/* Immersive Background Layer */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={backgroundImg} 
          alt="Luxury Restaurant Interior" 
          fill 
          className="object-cover opacity-90 brightness-[0.8] blur-[2px]" 
        />
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/40 z-10" />
      </div>

      <div className="container relative z-20 mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          
          {/* Text Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-10 bg-primary" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Luxury Experience</span>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl font-black leading-tight text-slate-950 lg:text-7xl tracking-tighter">
                  Reserved <br />
                  <span className="text-primary italic flex items-center gap-4">
                    Excellence <Sparkles className="w-10 h-10" />
                  </span>
                </h2>
                <p className="text-xl font-medium leading-relaxed text-slate-600 max-w-md border-l-4 border-primary pl-6">
                  Experience culinary artistry at its peak. Book your table now for a night of pure elegance.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                 <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Utensils size={22} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Fine Dining</h4>
                      <p className="text-xs text-slate-500 font-medium">Chef's Signature Menu</p>
                    </div>
                 </div>
                 <div className="group flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Star size={22} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">VIP Lounges</h4>
                      <p className="text-xs text-slate-500 font-medium">Exclusive Experience</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[40px] bg-white p-10 lg:p-14 shadow-2xl border border-slate-100">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-950 tracking-tight">Make a Reservation</h3>
                <p className="text-slate-500 font-medium mt-1">Please fill in details below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Phone Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest transition-all", 
                      errors.phone ? 'text-red-500' : focusedField === 'phone' ? 'text-slate-900 border-b-primary' : 'text-slate-700'
                    )}>
                      Phone Number
                    </label>
                    <div className={cn(
                      "flex items-center gap-3 border-b py-3 transition-all duration-300 rounded-lg px-2", 
                      errors.phone 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-slate-200 group-focus-within:border-primary group-focus-within:bg-slate-50/30'
                    )}>
                      <Phone className={cn("w-4 h-4 transition-colors", errors.phone ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary')} />
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+880 1XXX-XXXXXX"
                        className="w-full bg-transparent outline-hidden font-bold text-base text-slate-900 placeholder:text-slate-300"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.phone && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-red-600 overflow-hidden px-2"
                        >
                          <AlertCircle size={12} className="shrink-0" />
                          {errors.phone}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Date Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest transition-all", 
                      errors.date ? 'text-red-500' : focusedField === 'date' ? 'text-slate-900' : 'text-slate-700'
                    )}>
                      Select Date
                    </label>
                    <div className={cn(
                      "flex items-center gap-3 border-b py-3 transition-all duration-300 rounded-lg px-2", 
                      errors.date 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-slate-200 group-focus-within:border-primary group-focus-within:bg-slate-50/30'
                    )}>
                      <Calendar className={cn("w-4 h-4 transition-colors", errors.date ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary')} />
                      <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('date')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-bold text-base text-slate-900"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.date && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-red-600 overflow-hidden px-2"
                        >
                          <AlertCircle size={12} className="shrink-0" />
                          {errors.date}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Time Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest transition-all", 
                      errors.time ? 'text-red-500' : focusedField === 'time' ? 'text-slate-900' : 'text-slate-700'
                    )}>
                      Preferred Time
                    </label>
                    <div className={cn(
                      "flex items-center gap-3 border-b py-3 transition-all duration-300 rounded-lg px-2", 
                      errors.time 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-slate-200 group-focus-within:border-primary group-focus-within:bg-slate-50/30'
                    )}>
                      <Clock className={cn("w-4 h-4 transition-colors", errors.time ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary')} />
                      <input
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('time')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-bold text-base text-slate-900"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.time && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-red-600 overflow-hidden px-2"
                        >
                          <AlertCircle size={12} className="shrink-0" />
                          {errors.time}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Guests Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest transition-all", 
                      errors.guests ? 'text-red-500' : focusedField === 'guests' ? 'text-slate-900' : 'text-slate-700'
                    )}>
                      Total Guests
                    </label>
                    <div className={cn(
                      "flex items-center gap-3 border-b py-3 transition-all duration-300 rounded-lg px-2", 
                      errors.guests 
                        ? 'border-red-500 bg-red-50/50' 
                        : 'border-slate-200 group-focus-within:border-primary group-focus-within:bg-slate-50/30'
                    )}>
                      <Users className={cn("w-4 h-4 transition-colors", errors.guests ? 'text-red-500' : 'text-slate-300 group-focus-within:text-primary')} />
                      <input
                        name="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('guests')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-bold text-base text-slate-900"
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.guests && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-red-600 overflow-hidden px-2"
                        >
                          <AlertCircle size={12} className="shrink-0" />
                          {errors.guests}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* Occasion Selector */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest transition-all", 
                      focusedField === 'occasion' ? 'text-slate-900' : 'text-slate-700'
                    )}>
                      Special Occasion
                    </label>
                    <div className="flex items-center gap-3 border-b border-slate-200 py-3 group-focus-within:border-primary transition-colors">
                      <PartyPopper className="w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('occasion')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-hidden font-bold text-base text-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="">None</option>
                        <option value="birthday">Birthday</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="business">Business Meeting</option>
                        <option value="date">Romantic Date</option>
                        <option value="other">Other Celebration</option>
                      </select>
                    </div>
                  </div>

                  {/* Reserved For (Auto-fill email/name) */}
                  <div className="group relative">
                    <label className="absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest text-slate-700">Reserved For</label>
                    <div className="flex items-center gap-3 border-b border-slate-200 py-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {user ? user.name || user.email : "Guest Session"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="group relative">
                  <label className={cn(
                    "absolute left-0 -top-6 text-xs font-bold uppercase tracking-widest transition-all", 
                    errors.message ? 'text-red-500' : focusedField === 'message' ? 'text-slate-900' : 'text-slate-700'
                  )}>
                    Special Notes
                  </label>
                  <div className={cn("flex items-start gap-3 border-b py-3 transition-colors", errors.message ? 'border-primary' : 'border-slate-200 group-focus-within:border-primary')}>
                    <MessageSquare className={cn("w-4 h-4 transition-colors mt-1", errors.message ? 'text-primary' : 'text-slate-300 group-focus-within:text-primary')} />
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Dietary requirements or allergies..."
                      className="w-full bg-transparent outline-hidden font-bold text-base text-slate-900 placeholder:text-slate-300 resize-none"
                    ></textarea>
                  </div>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-primary overflow-hidden"
                      >
                        <AlertCircle size={12} className="shrink-0" />
                        {errors.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-6 bg-slate-950 text-white hover:bg-primary transition-all duration-300 rounded-2xl flex items-center justify-center gap-3 group active:scale-95 shadow-xl shadow-black/5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span className="font-black text-sm uppercase tracking-widest">Processing...</span>
                    </span>
                  ) : (
                    <>
                      <span className="font-black text-lg uppercase tracking-widest">Confirm Reservation</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
