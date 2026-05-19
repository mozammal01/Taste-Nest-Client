"use client";
import Image from "next/image";
import bbqImg from "@/../public/menu/bbq.png";
import cocktailImg from "@/../public/menu/coctail.png";
import { motion } from "framer-motion";
import SubTitle from "../shared/subTitle";

export default function Menu() {
  return (
    <div className="container mx-auto mt-12 md:my-28 text-center px-4" id="menu">
      <div className="md:mb-20">
        <SubTitle title="Discover Menu" />
      </div>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
        }}
        className="flex flex-col md:flex-row justify-center items-center gap-20 md:gap-10 my-20 px-4"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8, x: -50 },
            visible: { 
              opacity: 1, 
              scale: 1, 
              x: 0,
              transition: { type: "spring", bounce: 0.4, duration: 1 } 
            }
          }}
          className="w-full relative"
        >
          <Image src={bbqImg} alt="steaks and BBQ menu" width={600} height={500} />
          <div className="absolute top-10 left-0 w-full h-full text-white px-10 text-start space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold -mt-5">Steaks & BBQ</h2>
            <p className="hidden md:block">
              canonical classics to obscure
              <span className="block">tiki drinks</span>
            </p>
          </div>
          <div className="absolute w-full h-full top-24 md:top-40 lg:top-52 left-5">
            <div className="bg-secondary rounded-full h-24 w-24 p-4 flex flex-col items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-black text-slate-950">$120</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">/ person</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.8, x: 50 },
            visible: { 
              opacity: 1, 
              scale: 1, 
              x: 0,
              transition: { type: "spring", bounce: 0.4, duration: 1 } 
            }
          }}
          className="w-full relative"
        >
          <Image src={cocktailImg} alt="cocktails menu" width={600} height={500} />
          <div className="absolute top-10 left-0 w-full h-full text-white px-10 text-start space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold -mt-5">Cocktails</h2>
            <p className="hidden md:block">
              canonical classics to obscure
              <span className="block">tiki drinks</span>
            </p>
          </div>
          <div className="absolute w-full h-full top-24 md:top-40 lg:top-52 left-5">
            <div className="bg-secondary rounded-full h-24 w-24 p-4 flex flex-col items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl font-black text-slate-950">$120</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800">/ person</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
