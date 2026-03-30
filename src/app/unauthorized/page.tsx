"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f3274c]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#ffd40d]/5 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        {/* Shield Icon Decoration */}
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#f3274c]/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-white p-8 rounded-full border border-gray-100 shadow-xl">
              <ShieldAlert size={80} className="text-[#f3274c]" strokeWidth={1.5} />
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-1 -right-1 bg-[#ffd40d] p-2 rounded-full shadow-lg border-2 border-white"
              >
                <Lock size={20} className="text-black" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight"
        >
          Access <span className="text-[#f3274c]">Restricted</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed"
        >
          Oops! It looks like you don't have the necessary permissions to access this exclusive area of <span className="font-semibold text-gray-900">TasteNest</span>.
        </motion.p>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-semibold hover:border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <Link
            href="/"
            className="group flex items-center gap-2 px-8 py-4 bg-[#f3274c] text-white rounded-2xl font-semibold hover:bg-[#d92244] transition-all duration-300 shadow-lg shadow-[#f3274c]/20"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Footer Disclaimer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-gray-400 text-sm"
        >
          If you believe this is a mistake, please contact our support team.
        </motion.p>
      </motion.div>

      {/* Modern floating elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-4 h-4 bg-[#ffd40d] rounded-full hidden lg:block"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-10 w-6 h-6 bg-[#f3274c]/40 rounded-full hidden lg:block"
      />
    </div>
  );
}
