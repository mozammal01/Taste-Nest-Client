"use client";

import { motion } from "framer-motion";
import { Utensils, Users, Award, Clock } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";

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

export default function Statistics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -mr-48 -mb-48 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group text-center"
            >
              <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">
                {stat.value}
              </h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
