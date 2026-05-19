"use client";
import bannerImage from "@/../public/banner/bannerImg.png";
import pizzaImg from "@/../public/banner/pizza.png";
import WeeklySpecialCard from "../ui/weekly-special-card";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedButton } from "../ui/animated-button";

import Image from "next/image";

export default function Banner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative min-h-[70vh] flex items-center overflow-hidden"
    >
      <Image 
        src={bannerImage} 
        alt="TasteNest Hero" 
        fill 
        priority 
        className="object-cover object-center -z-10"
        placeholder="blur"
      />
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/20 blur-[120px] rounded-full -mr-20 -mt-20 anim-pulse" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.2 }
              }
            }}
            className="text-white w-full lg:w-3/5 space-y-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
                className="text-primary font-black text-sm uppercase tracking-[0.4em]"
              >
                Welcome to TasteNest
              </motion.p>
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tighter"
              >
                Artisan Flavors & <br />
                <span className="text-secondary italic">Atmospheric</span> <br />
                Sessions
              </motion.h1>
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
                }}
                className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                Experience the pinnacle of culinary artistry at TasteNest, where every ingredient tells a story of local farms and global inspiration.
              </motion.p>
            </div>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
              }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4"
            >
              <Link href="#menu">
                <AnimatedButton className="min-w-[200px] h-16 rounded-2xl text-lg font-black" variant="ripple" size="lg">
                  Explore Menu
                </AnimatedButton>
              </Link>
              <Link href="/under-construction" className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 group-hover:scale-110 transition-all duration-300">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-current border-b-[6px] border-b-transparent ml-1" />
                </div>
                <span className="font-bold opacity-80 group-hover:opacity-100 transition-opacity">Watch Story</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.3 }}
            className="w-full lg:w-2/5 max-w-[500px] relative hidden lg:block"
          >
            <div className="relative z-10">
              <WeeklySpecialCard price="90.85" title="Sicilian Pizza" rating={5} imageUrl={pizzaImg.src} className="w-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]" />
            </div>
            {/* Background element for depth */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] -z-10 rounded-full scale-150" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-white/20" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Scroll</span>
      </motion.div>
    </motion.div>
  );
}
