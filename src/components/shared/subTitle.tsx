"use client";
import { motion } from "framer-motion";

export default function SubTitle({ title }: { title: string }) {
  return (
    <div className="md:mb-20">
      <motion.h2
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-6xl font-extrabold"
        >
          {title}
        </motion.h2>
      <div className="border-b-8 border-secondary max-w-xs mx-auto my-4"></div>
    </div>
  );
}
