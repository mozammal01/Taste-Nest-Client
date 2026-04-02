"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, MessageSquare, ChevronRight, CheckCircle2, Star, Utensils, Sparkles, Phone, PartyPopper, AlertCircle } from "lucide-react";
import { createReservation } from "@/lib/actions/reservation";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import backgroundImg from "@/../public/menu&dishes/reservation-bg.png";

const reservationSchema = z.object({
  guests: z.number().min(1, "Please specify at least 1 guest").max(20, "For bookings larger than 20, please call us directly"),
  date: z.string()
    .min(1, "Arrival date is required")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(date.getTime()) && date >= today;
    }, { message: "Please select a valid date (today or in the future)" }),
  time: z.string().min(1, "Preferred time is required"),
  phone: z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number (10-15 digits)"),
  occasion: z.string().optional(),
  message: z.string().max(500, "Notes must be under 500 characters").optional(),
});

interface ReservationSectionProps {
  user?: { 
    id: string; 
    role?: string;
    name?: string | null;
    email?: string | null;
  } | null;
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reservation') {
      const el = document.getElementById('reservation');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 500); // Small delay to let animations/layout settle
      }
    }
  }, []);

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
      let firstErrorMessage = "";
      validationResult.error.issues.forEach((issue, index) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
          if (index === 0) firstErrorMessage = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error(firstErrorMessage || "Please correct the errors in the form.", {
        description: "Review highlighted fields for details.",
      });
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
    } catch {
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
              We&apos;ve secured your table at <span className="text-primary italic font-bold">TasteNest</span>. 
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
                      <p className="text-xs text-slate-500 font-medium">Chef&apos;s Signature Menu</p>
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

              <form onSubmit={handleSubmit} noValidate className="space-y-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  {/* Phone Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all z-10", 
                      errors.phone ? 'text-red-500' : focusedField === 'phone' ? 'text-primary' : 'text-slate-500'
                    )}>
                      Phone Number
                    </label>
                    <div className={cn(
                      "flex items-center gap-4 border-2 h-16 transition-all duration-500 rounded-2xl px-5 relative overflow-hidden", 
                      errors.phone 
                        ? 'border-red-200 bg-red-50/30' 
                        : 'border-slate-100 group-hover:border-slate-200 group-focus-within:border-primary group-focus-within:bg-white group-focus-within:shadow-xl group-focus-within:shadow-primary/5'
                    )}>
                      <Phone className={cn("w-5 h-5 transition-colors duration-500", errors.phone ? 'text-red-400' : 'text-slate-300 group-focus-within:text-primary')} strokeWidth={1.5} />
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="+880 1XXX-XXXXXX"
                        className="w-full bg-transparent outline-none font-bold text-base text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                      />
                      {/* Animated focus indicator at the bottom */}
                      <div className={cn(
                        "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-700",
                        focusedField === 'phone' ? 'w-full' : 'w-0'
                      )} />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.phone && (
                        <motion.div 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[11px] font-bold text-red-500"
                        >
                          <AlertCircle size={14} className="shrink-0" />
                          {errors.phone}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Date Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all z-10", 
                      errors.date ? 'text-red-500' : focusedField === 'date' ? 'text-primary' : 'text-slate-500'
                    )}>
                      Select Date
                    </label>
                    <div className={cn(
                      "flex items-center gap-4 border-2 h-16 transition-all duration-500 rounded-2xl px-5 relative overflow-hidden", 
                      errors.date 
                        ? 'border-red-200 bg-red-50/30' 
                        : 'border-slate-100 group-hover:border-slate-200 group-focus-within:border-primary group-focus-within:bg-white group-focus-within:shadow-xl group-focus-within:shadow-primary/5'
                    )}>
                      <Calendar className={cn("w-5 h-5 transition-colors duration-500", errors.date ? 'text-red-400' : 'text-slate-300 group-focus-within:text-primary')} strokeWidth={1.5} />
                      <input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('date')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-none font-bold text-base text-slate-900 cursor-pointer appearance-none"
                      />
                      <div className={cn(
                        "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-700",
                        focusedField === 'date' ? 'w-full' : 'w-0'
                      )} />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.date && (
                        <motion.div 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[11px] font-bold text-red-500"
                        >
                          <AlertCircle size={14} className="shrink-0" />
                          {errors.date}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Time Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all z-10", 
                      errors.time ? 'text-red-500' : focusedField === 'time' ? 'text-primary' : 'text-slate-500'
                    )}>
                      Preferred Time
                    </label>
                    <div className={cn(
                      "flex items-center gap-4 border-2 h-16 transition-all duration-500 rounded-2xl px-5 relative overflow-hidden", 
                      errors.time 
                        ? 'border-red-200 bg-red-50/30' 
                        : 'border-slate-100 group-hover:border-slate-200 group-focus-within:border-primary group-focus-within:bg-white group-focus-within:shadow-xl group-focus-within:shadow-primary/5'
                    )}>
                      <Clock className={cn("w-5 h-5 transition-colors duration-500", errors.time ? 'text-red-400' : 'text-slate-300 group-focus-within:text-primary')} strokeWidth={1.5} />
                      <input
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('time')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-none font-bold text-base text-slate-900 cursor-pointer"
                      />
                      <div className={cn(
                        "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-700",
                        focusedField === 'time' ? 'w-full' : 'w-0'
                      )} />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.time && (
                        <motion.div 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[11px] font-bold text-red-500"
                        >
                          <AlertCircle size={14} className="shrink-0" />
                          {errors.time}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Guests Input */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all z-10", 
                      errors.guests ? 'text-red-500' : focusedField === 'guests' ? 'text-primary' : 'text-slate-500'
                    )}>
                      Total Guests
                    </label>
                    <div className={cn(
                      "flex items-center gap-4 border-2 h-16 transition-all duration-500 rounded-2xl px-5 relative overflow-hidden", 
                      errors.guests 
                        ? 'border-red-200 bg-red-50/30' 
                        : 'border-slate-100 group-hover:border-slate-200 group-focus-within:border-primary group-focus-within:bg-white group-focus-within:shadow-xl group-focus-within:shadow-primary/5'
                    )}>
                      <Users className={cn("w-5 h-5 transition-colors duration-500", errors.guests ? 'text-red-400' : 'text-slate-300 group-focus-within:text-primary')} strokeWidth={1.5} />
                      <input
                        name="guests"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.guests}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('guests')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-none font-bold text-base text-slate-900"
                      />
                      <div className={cn(
                        "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-700",
                        focusedField === 'guests' ? 'w-full' : 'w-0'
                      )} />
                    </div>
                    <AnimatePresence mode="wait">
                      {errors.guests && (
                        <motion.div 
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="flex items-center gap-1.5 mt-2 ml-4 text-[11px] font-bold text-red-500"
                        >
                          <AlertCircle size={14} className="shrink-0" />
                          {errors.guests}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  {/* Occasion Selector */}
                  <div className="group relative">
                    <label className={cn(
                      "absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all z-10", 
                      focusedField === 'occasion' ? 'text-primary' : 'text-slate-500'
                    )}>
                      Special Occasion
                    </label>
                    <div className={cn(
                      "flex items-center gap-4 border-2 h-16 transition-all duration-500 rounded-2xl px-5 relative overflow-hidden", 
                      focusedField === 'occasion' 
                        ? 'border-primary bg-white shadow-xl shadow-primary/5' 
                        : 'border-slate-100 bg-slate-50/30 group-hover:border-slate-200'
                    )}>
                      <PartyPopper className={cn("w-5 h-5 transition-colors duration-500", focusedField === 'occasion' ? 'text-primary' : 'text-slate-300')} strokeWidth={1.5} />
                      <select
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('occasion')}
                        onBlur={() => setFocusedField(null)}
                        className="w-full bg-transparent outline-none font-bold text-base text-slate-900 appearance-none cursor-pointer"
                      >
                        <option value="">None</option>
                        <option value="birthday">Birthday Celebration</option>
                        <option value="anniversary">Anniversary Dinner</option>
                        <option value="business">Business Meeting</option>
                        <option value="date">Romantic Rendezvous</option>
                        <option value="other">Other Milestone</option>
                      </select>
                      <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2">
                        <ChevronRight className="w-4 h-4 text-slate-300 rotate-90" />
                      </div>
                      <div className={cn(
                        "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-700",
                        focusedField === 'occasion' ? 'w-full' : 'w-0'
                      )} />
                    </div>
                  </div>

                  {/* Reserved For (Auto-fill email/name) */}
                  <div className="group relative">
                    <label className="absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 z-10">
                      Reserved For
                    </label>
                    <div className="flex items-center gap-4 border-2 border-slate-100 bg-slate-50/20 h-16 rounded-2xl px-5 transition-all group-hover:bg-slate-50/40">
                      <div className="relative">
                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                        <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-primary/40 animate-ping" />
                      </div>
                      <span className="font-black text-sm text-slate-900 tracking-tight">
                        {user ? (user.name || user.email) : "Guest Session"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="group relative">
                  <label className={cn(
                    "absolute left-4 -top-3 px-2 bg-white text-[10px] font-black uppercase tracking-[0.2em] transition-all z-10", 
                    errors.message ? 'text-red-500' : focusedField === 'message' ? 'text-primary' : 'text-slate-500'
                  )}>
                    Culinary Preferences & Notes
                  </label>
                  <div className={cn(
                    "flex items-start gap-4 border-2 transition-all duration-500 rounded-2xl p-5 relative overflow-hidden", 
                    errors.message 
                      ? 'border-red-200 bg-red-50/30' 
                      : 'border-slate-100 bg-slate-50/30 group-hover:border-slate-200 group-focus-within:border-primary group-focus-within:bg-white group-focus-within:shadow-xl group-focus-within:shadow-primary/5'
                  )}>
                    <MessageSquare className={cn("w-5 h-5 transition-colors duration-500 mt-1", errors.message ? 'text-red-400' : 'text-slate-300 group-focus-within:text-primary')} strokeWidth={1.5} />
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Share any allergies, dietary requirements, or special seating requests..."
                      className="w-full bg-transparent outline-none font-bold text-base text-slate-900 placeholder:text-slate-300 placeholder:font-medium resize-none leading-relaxed"
                    ></textarea>
                    <div className={cn(
                      "absolute bottom-0 left-0 h-1 bg-primary transition-all duration-700",
                      focusedField === 'message' ? 'w-full' : 'w-0'
                    )} />
                  </div>
                  <AnimatePresence>
                    {errors.message && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-1.5 mt-2 ml-4 text-[11px] font-bold text-red-500 overflow-hidden"
                      >
                        <AlertCircle size={14} className="shrink-0" />
                        {errors.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full py-8 bg-slate-950 text-white hover:bg-primary transition-all duration-500 rounded-[24px] flex items-center justify-center gap-4 group active:scale-[0.98] shadow-2xl shadow-black/20 hover:shadow-primary/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">Reserving Excellence...</span>
                    </span>
                  ) : (
                    <>
                      <span className="font-black text-sm md:text-base uppercase tracking-[0.2em]">Confirm Reservation</span>
                      <div className="flex items-center">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <ChevronRight className="w-5 h-5 -ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                      </div>
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

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
