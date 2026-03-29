"use client";
import bannerImage from "@/../public/banner/bannerImg.png";
import pizzaImg from "@/../public/banner/pizza.png";
import WeeklySpecialCard from "../ui/weekly-special-card";
import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedButton } from "../ui/animated-button";

export default function Banner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ backgroundImage: `url(${bannerImage.src})` }}
      className="bg-cover bg-center min-h-screen lg:h-[831px]"
    >
      <div className="flex justify-between items-center py-4 container max-sm:px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
          className="text-white lg:w-[50%] min-h-screen lg:h-[831px] flex flex-col gap-4 justify-center px-4 lg:px-20 space-y-6"
        >
          <h2 className="xl:text-7xl lg:text-5xl text-4xl font-extrabold mt-8 leading-tight">Artisan Flavors & <span className="text-secondary">Atmospheric</span> Sessions</h2>
          <p className="text-xl text-gray-100 max-w-xl">Experience the pinnacle of culinary artistry at TasteNest, where every ingredient tells a story of local farms and global inspiration.</p>
          <div className="flex gap-8 justify-start items-center my-8">
            <Link href="#menu">
              <AnimatedButton className="cursor-pointer" variant="ripple" size="lg">
                See our menu
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
        <div className="w-[400px] h-[400px] relative top-[200px] lg:block hidden">
          <WeeklySpecialCard price="90.85" title="Sicilian Pizza" rating={5} imageUrl={pizzaImg.src} className="w-full" />
        </div>
      </div>
    </motion.div>
  );
}
