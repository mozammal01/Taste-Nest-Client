"use client";
import Image from "next/image";
import appleIcon from "@/../public/icons/apple.png";
import playIcon from "@/../public/icons/play.png";
import backgroundImg from "@/../public/ordering/bg.png";
import phoneImg from "@/../public/ordering/mobile.png";
import pizzaImg from "@/../public/ordering/pizza.png";
import saladImg from "@/../public/ordering/salad.png";
import { AnimatedButton } from "../ui/animated-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Ordering() {
  return (
    <div id="ordering" style={{ backgroundImage: `url(${backgroundImg.src})` }} className="bg-cover bg-center py-24 md:py-32 relative mt-40">
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      
      <div className="container mx-auto relative z-10 px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">Next-Gen Delivery</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-tight">
                TasteNest in Your <span className="text-primary italic">Pocket</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Experience artisanal dining delivered to your doorstep. Our mobile app brings the full TasteNest experience with exclusive offers and real-time tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                "Higher Reach - Minimal Effort",
                "Showcase your Brand",
                "Exclusive offers & discounts",
                "Real-time Order Tracking"
              ].map((text, i) => (
                <div key={i} className="flex items-center justify-center lg:justify-start gap-4 group">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-8">
              <Link href="/under-construction">
                <AnimatedButton variant="threeDimensional" size="lg" className="min-w-[180px]">
                  <Image src={playIcon} alt="Google Play" width={20} height={20} />
                  <div className="text-left flex flex-col items-start leading-none ml-2">
                    <span className="text-[10px] uppercase font-bold opacity-60">Get it on</span>
                    <span className="text-lg font-black tracking-tight">Google Play</span>
                  </div>
                </AnimatedButton>
              </Link>
              <Link href="/under-construction">
                <AnimatedButton size="lg" variant="threeDimensional" className="min-w-[180px]">
                  <Image src={appleIcon} alt="Apple Store" width={20} height={20} />
                  <div className="text-left flex flex-col items-start leading-none ml-2">
                    <span className="text-[10px] uppercase font-bold opacity-60">Download on</span>
                    <span className="text-lg font-black tracking-tight">App Store</span>
                  </div>
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Hidden on small, visible from lg */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative hidden lg:flex items-center justify-center h-[500px] xl:h-[600px]"
          >
            <div className="relative w-full h-full max-w-[600px]">
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 z-10 flex items-center justify-center"
               >
                 <div className="relative w-[300px] h-[400px] md:w-[380px] md:h-[450px]">
                    <Image src={phoneImg} alt="Mobile App" fill className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]" />
                 </div>
               </motion.div>
               
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-10 -right-12 z-20"
               >
                 <Image src={saladImg} alt="Salad" width={220} height={220} className="rounded-full shadow-2xl border-4 border-white" />
               </motion.div>

               <motion.div 
                 animate={{ scale: [1, 1.05, 1], rotate: [0, -5, 0] }}
                 transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute -bottom-12 -left-16 z-20"
               >
                 <Image src={pizzaImg} alt="Pizza" width={240} height={160} className="rounded-3xl shadow-2xl border-4 border-white" />
               </motion.div>

               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
