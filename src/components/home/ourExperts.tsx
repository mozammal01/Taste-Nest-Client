"use client";
import nicholas from "@/../public/experts/expert1.png";
import jamesJohnson from "@/../public/experts/expert2.png";
import marcos from "@/../public/experts/expert3.png";
import signatureImg from "@/../public/experts/signature.png";
import { motion, Variants } from "framer-motion";
import SubTitle from "../shared/subTitle";
import ExpertsCircle from "../experts-circle/experts-circle";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.9, rotateX: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      mass: 1,
    }
  },
};

export default function OurExperts() {
  return (
    <div id="experts" className="container mx-auto my-40 px-2 overflow-hidden" style={{ perspective: "1000px" }}>
      <div className="text-center">
        <SubTitle title="Meet Our Experts" />
      </div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid md:grid-cols-2 xl:grid-cols-3 lg:gap-10 gap-20 my-20 w-full"
      >
        <motion.div
          variants={cardVariants}
          className="relative"
        >
          <ExpertsCircle img={nicholas.src} title="Executive Pastry Chef" name="Chef Nicholas" signatureImg={signatureImg.src} />
        </motion.div>
        <motion.div
          variants={cardVariants}
          className="relative"
        >
          <ExpertsCircle img={jamesJohnson.src} title="Master Chef de Cuisine" name="Chef James Johnson" signatureImg={signatureImg.src} />
        </motion.div>
        <motion.div
          variants={cardVariants}
          className="relative md:my-40 lg:my-0"
        >
          <ExpertsCircle img={marcos.src} title="Head Sommelier" name="Marcos V." signatureImg={signatureImg.src} />
        </motion.div>
      </motion.div>
    </div>
  );
}
