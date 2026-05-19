"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => setProgress(latest));
  }, [scrollYProgress]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full flex items-center justify-center text-primary shadow-2xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          aria-label="Scroll back to top"
        >
          {/* Circular Progress SVG */}
          <svg className="absolute w-full h-full -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800/60"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray="125.6" // 2 * PI * r (r=20) = 125.6
              strokeDashoffset={125.6 - (125.6 * progress)}
              className="text-primary"
            />
          </svg>
          <ArrowUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
