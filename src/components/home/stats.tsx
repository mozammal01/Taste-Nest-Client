"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Utensils, Users, Award, Clock } from "lucide-react";

const stats = [
  {
    icon: <Utensils className="w-8 h-8" />,
    value: "150+",
    label: "Delicious Dishes",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: "25k+",
    label: "Happy Customers",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: <Award className="w-8 h-8" />,
    value: "15+",
    label: "Culinary Awards",
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    value: "12+",
    label: "Years of Passion",
    color: "bg-purple-100 text-purple-600",
  },
];

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const match = value.match(/(\d+)(.*)/);
  const num = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 80,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(num);
    }
  }, [isInView, motionValue, num]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return (
    <span className="inline-flex items-center justify-center">
      <span ref={ref}>0</span>
      <span>{suffix}</span>
    </span>
  );
}

export default function Statistics() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -mr-48 -mb-48 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 40, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1, 
                  transition: { type: "spring", bounce: 0.5, duration: 0.8 } 
                }
              }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 hover:shadow-2xl dark:shadow-none hover:-translate-y-2 transition-all duration-300 group text-center"
            >
              <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                <AnimatedNumber value={stat.value} />
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
