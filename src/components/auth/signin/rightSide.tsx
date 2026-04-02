"use client";
import { motion } from "framer-motion";

export default function SigninRightSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/banner/bannerImg.png')`,
        }}
      />
      <div className="absolute inset-0 bg-linear-to-bl from-black/60 via-black/40 to-primary/20" />

      {/* Decorative elements with centered icons */}
      <div className="absolute top-20 right-20 w-40 h-40 border-2 border-secondary/40 rounded-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="text-6xl"
        >
          🍕
        </motion.div>
      </div>

      <div className="absolute bottom-24 left-20 w-32 h-32 border border-white/30 rounded-full animate-pulse flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
          transition={{ duration: 1.2, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl"
        >
          🍔
        </motion.div>
      </div>

      <div className="absolute top-[45%] right-8 w-28 h-28 border border-white/30 rounded-full animate-pulse flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.4, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl"
        >
          🥗
        </motion.div>
      </div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/30 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-40 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />



      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 flex flex-col justify-center items-center p-16 text-white text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center mb-8 shadow-2xl"
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-4xl xl:text-5xl font-bold leading-tight mb-6"
        >
          Savor the
          <br />
          <span className="text-secondary">Experience</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg text-gray-200 max-w-sm leading-relaxed mb-8"
        >
          Sign in to track your orders, manage reservations, and enjoy personalized dining experiences.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">50+</div>
            <div className="text-sm text-gray-300">Dishes</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">10k+</div>
            <div className="text-sm text-gray-300">Customers</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">4.9</div>
            <div className="text-sm text-gray-300">Rating</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
