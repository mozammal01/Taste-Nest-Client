"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import authorImg from "@/../public/about/author.png";
import restaurantImg from "@/../public/about/restaurantImg.png";
import restaurantBorder from "@/../public/about/restaurantBorder.png";
import cocktailImg from "@/../public/about/cocktailImg.png";
import cocktailBorder from "@/../public/about/cocktailBorder.png";
import drinkImg from "@/../public/about/drinkImg.png";
import drinkBorder from "@/../public/about/drinkBorder.png";

export default function About() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="container mx-auto my-30" id="about">
      <div className="flex flex-col gap-10">
        <div className="block lg:flex justify-between gap-10 px-5 lg:px-0">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={isDesktop ? { opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 } : undefined}
            whileInView={!isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={!isDesktop ? { once: true, amount: 0.1 } : undefined}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col gap-4 lg:w-[50%] space-y-4"
          >
            <p className="text-primary font-extrabold text-lg uppercase tracking-widest">Our Story & Philosophy</p>
            <h2 className="md:text-6xl text-4xl font-extrabold leading-tight text-gray-900">Crafting Moments Through <span className="text-primary italic">Authentic</span> Flavors</h2>
          </motion.div>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={isDesktop ? { opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 } : undefined}
            whileInView={!isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={!isDesktop ? { once: true, amount: 0.1 } : undefined}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
            className="lg:w-[60%] lg:pl-40 mt-5 lg:mt-0"
          >
            <p className="text-gray-600 leading-relaxed">
              Founded on the belief that dining is an art form, TasteNest has evolved from a small family kitchen into a sanctuary for food lovers. We celebrate the intersection of traditional techniques and modern innovation, sourcing only the finest organic ingredients from local sustainable producers.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our philosophy is simple: honor the ingredient, respect the season, and create memories that linger long after the final course. Whether it&apos;s a quiet morning espresso or a grand evening feast, every moment here is crafted with passion.
            </p>
            <div className="flex gap-4 items-center mt-5">
              <div>
                <Image src={authorImg} alt="author profile" width={50} height={50} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-2xl text-gray-900">Chef Julian Marco</p>
                <p className="text-primary font-medium">Founder & Executive Chef</p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto gap-8 lg:gap-12 my-16 px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -100 }}
            animate={isDesktop ? { opacity: isInView ? 1 : 0, y: isInView ? 0 : -100 } : undefined}
            whileInView={!isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={!isDesktop ? { once: true, amount: 0.1 } : undefined}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border border-white/20 bg-gray-50 flex items-center justify-center aspect-[4/5] md:aspect-[3/4]">
              <Image 
                src={restaurantImg} 
                alt="restaurant interior" 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 p-3 md:p-4 lg:p-5 pointer-events-none flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={restaurantBorder}
                    alt="border decoration"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={isDesktop ? { opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 } : undefined}
            whileInView={!isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={!isDesktop ? { once: true, amount: 0.1 } : undefined}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border border-white/20 bg-gray-50 flex items-center justify-center aspect-[4/5] md:aspect-[3/4]">
              <Image 
                src={cocktailImg} 
                alt="cocktail drinks" 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 p-3 md:p-4 lg:p-5 pointer-events-none flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={cocktailBorder}
                    alt="border decoration"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={isDesktop ? { opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 } : undefined}
            whileInView={!isDesktop ? { opacity: 1, y: 0 } : undefined}
            viewport={!isDesktop ? { once: true, amount: 0.1 } : undefined}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border border-white/20 bg-gray-50 flex items-center justify-center aspect-[4/5] md:aspect-[3/4]">
              <Image 
                src={drinkImg} 
                alt="refreshing drinks" 
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 p-3 md:p-4 lg:p-5 pointer-events-none flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={drinkBorder}
                    alt="border decoration"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
