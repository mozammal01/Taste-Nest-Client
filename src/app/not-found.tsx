"use client";

import Link from 'next/link';
import { Home, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden px-4 transition-colors duration-500">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
        className="text-center z-10 max-w-2xl bg-white/40 dark:bg-slate-900/40 p-12 rounded-[40px] border border-white/60 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-md"
      >
        <motion.div 
          animate={{ rotate: [12, -12, 12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-primary/5 rounded-3xl border border-primary/10 shadow-sm"
        >
          <UtensilsCrossed size={48} className="text-primary" />
        </motion.div>
        
        <h1 className="text-9xl font-black text-slate-100 dark:text-slate-800/40 mb-2 tracking-tighter leading-none select-none">404</h1>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 -mt-12 tracking-tight">Lost in the kitchen?</h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re searching for isn&apos;t on our menu today. Let&apos;s get you back to something delicious.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-2xl font-bold transition-all hover:shadow-2xl hover:shadow-primary/20 active:scale-95 flex items-center gap-2 h-14 min-w-[200px] border-none">
              <Home size={20} />
              Return Home
            </Button>
          </Link>
          
          <Link href="/menu">
            <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 px-8 py-6 rounded-2xl font-bold h-14 min-w-[200px] active:scale-95 shadow-sm">
              Explore Menu
            </Button>
          </Link>
        </div>
      </motion.div>
      
      <div className="absolute bottom-10 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        TasteNest &bull; Culinary Artistry
      </div>
    </div>
  );
}
