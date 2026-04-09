"use client";
import Image from "next/image";

import { motion } from "framer-motion";
import { dishes } from "@/constants/dishes";
import SubTitle from "../shared/subTitle";

export default function Dishes() {
  return (
    <section id="menu" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />
      
      <div className="container mx-auto text-center px-6">
        <SubTitle title="Featured Dishes" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 my-16"
        >
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 overflow-hidden"
            >
              {/* Image Container with decorative backdrop */}
              <div className="relative aspect-square mb-8 flex items-center justify-center">
                <div className="absolute inset-4 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10 w-full h-full"
                >
                  <Image src={dish.image} alt={dish.name} fill className="object-contain" />
                </motion.div>
                
                {/* Sale Badge */}
                <div className="absolute top-0 right-0 bg-primary text-white font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-2xl shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                  SALE
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {dish.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-slate-400 line-through">
                        {dish.price}
                      </span>
                      <span className="text-2xl font-black text-primary">
                        ${dish.discountPrice}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 bg-slate-900 dark:bg-primary rounded-2xl text-white shadow-lg transition-transform"
                  >
                    <Image src={dish.icon} alt="cart" width={18} height={18} className="brightness-0 invert" />
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
