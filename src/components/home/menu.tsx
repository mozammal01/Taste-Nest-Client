"use client";
import Image from "next/image";
import bbqImg from "@/../public/menu/bbq.png";
import cocktailImg from "@/../public/menu/coctail.png";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SubTitle from "../shared/subTitle";

export default function Menu() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div className="md:max-w-[1200px] max-w-[300px] mx-auto mt-12 md:my-28 text-center" id="menu">
      <div className="md:mb-20">
        <SubTitle title="Discover Menu" />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-20 md:gap-10 my-20 px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
            <div className="bg-secondary rounded-full h-24 w-24 p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-primary">$120</span>
              <span className="text-sm font-extrabold">person</span>
            </div>
          </div>
        </motion.div>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
            <div className="bg-secondary rounded-full h-24 w-24 p-4 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-primary">$120</span>
              <span className="text-sm font-extrabold">person</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
