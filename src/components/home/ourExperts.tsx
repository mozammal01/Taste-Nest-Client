"use client";
import nicholas from "@/../public/experts/expert1.png";
import jamesJohnson from "@/../public/experts/expert2.png";
import marcos from "@/../public/experts/expert3.png";
import signatureImg from "@/../public/experts/signature.png";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SubTitle from "../shared/subTitle";
import ExpertsCircle from "../experts-circle/experts-circle";

export default function OurExperts() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div id="experts" className="container mx-auto my-40 px-2">
      <div className="text-center">
        <SubTitle title="Meet Our Experts" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 lg:gap-10 gap-20 my-20 w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative"
        >
          <ExpertsCircle img={nicholas.src} title="Executive Pastry Chef" name="Chef Nicholas" signatureImg={signatureImg.src} />
        </motion.div>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative"
        >
          <ExpertsCircle img={jamesJohnson.src} title="Master Chef de Cuisine" name="Chef James Johnson" signatureImg={signatureImg.src} />
        </motion.div>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative md:my-40 lg:my-0"
        >
          <ExpertsCircle img={marcos.src} title="Head Sommelier" name="Marcos V." signatureImg={signatureImg.src} />
        </motion.div>
      </div>
    </div>
  );
}
