"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import authorImg from "@/../public/about/author.png";
import restaurantImg from "@/../public/about/restaurantImg.png";
import restaurantBorder from "@/../public/about/restaurantBorder.png";
import cocktailImg from "@/../public/about/cocktailImg.png";
import cocktailBorder from "@/../public/about/cocktailBorder.png";
import drinkImg from "@/../public/about/drinkImg.png";
import drinkBorder from "@/../public/about/drinkBorder.png";

export default function About() {

  return (
    <div className="container mx-auto my-30" id="about">
      <div className="flex flex-col gap-10">
        <div className="block lg:flex justify-between gap-10 px-5 lg:px-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1 }}
            className="flex flex-col gap-4 lg:w-[50%] space-y-4"
          >
            <p className="text-primary font-extrabold text-lg uppercase tracking-widest">Our Story & Philosophy</p>
            <h2 className="md:text-6xl text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">Crafting Moments Through <span className="text-primary italic">Authentic</span> Flavors</h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", bounce: 0.2, duration: 1, delay: 0.2 }}
            className="lg:w-[60%] lg:pl-40 mt-5 lg:mt-0"
          >
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Founded on the belief that dining is an art form, TasteNest has evolved from a small family kitchen into a sanctuary for food lovers. We celebrate the intersection of traditional techniques and modern innovation, sourcing only the finest organic ingredients from local sustainable producers.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
              Our philosophy is simple: honor the ingredient, respect the season, and create memories that linger long after the final course. Whether it&apos;s a quiet morning espresso or a grand evening feast, every moment here is crafted with passion.
            </p>
            <div className="flex gap-4 items-center mt-5">
              <div>
                <Image src={authorImg} alt="author profile" width={50} height={50} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-2xl text-slate-900 dark:text-white">Chef Julian Marco</p>
                <p className="text-primary font-medium">Founder & Executive Chef</p>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl mx-auto gap-8 lg:gap-12 my-16 px-6"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 60, scale: 0.8, rotate: -5 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                rotate: 0,
                transition: { type: "spring", bounce: 0.4, duration: 1 }
              }
            }}
          >
            <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl border border-white/20 bg-slate-50 dark:bg-slate-900 flex items-center justify-center aspect-[4/5] md:aspect-[3/4]">
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
            variants={{
              hidden: { opacity: 0, y: 60, scale: 0.8 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: "spring", bounce: 0.4, duration: 1 }
              }
            }}
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
            variants={{
              hidden: { opacity: 0, y: 60, scale: 0.8, rotate: 5 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                rotate: 0,
                transition: { type: "spring", bounce: 0.4, duration: 1 }
              }
            }}
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
        </motion.div>
      </div>
    </div>
  );
}
