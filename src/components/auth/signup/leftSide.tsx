"use client";
import { motion } from "framer-motion";

export default function SignupLeftSide() {
  return  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
  {/* Background with linear overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: `url('/banner/bannerImg.png')`,
    }}
  />
  <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/50 to-primary/30" />

  {/* Decorative elements with centered icons */}
  <div className="absolute top-10 left-10 w-32 h-32 border-2 border-secondary/30 rounded-full animate-pulse flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: [0, 5, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="text-5xl"
    >
      🍔
    </motion.div>
  </div>
  <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/20 rounded-full flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="text-7xl"
    >
      🍕
    </motion.div>
  </div>
  <div className="absolute top-1/3 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl" />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="relative z-10 flex flex-col justify-center items-start p-16 text-white"
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <span className="px-4 py-2 bg-primary/90 text-white text-sm font-semibold rounded-full uppercase tracking-wider">
        Welcome to TasteNest
      </span>
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="text-5xl xl:text-6xl font-bold leading-tight mb-6"
    >
      Begin Your
      <br />
      <span className="text-secondary">Culinary Journey</span>
    </motion.h1>

    <motion.p
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="text-lg text-gray-300 max-w-md leading-relaxed"
    >
      Join our exclusive community of food lovers. Unlock special offers, reserve tables, and experience fine dining like never
      before.
    </motion.p>

    {/* Features */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="mt-10 space-y-4"
    >
      {["Exclusive member discounts", "Priority table reservations", "Special event invitations"].map((feature, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-gray-200">{feature}</span>
        </div>
      ))}
    </motion.div>
  </motion.div>
</div>;
}