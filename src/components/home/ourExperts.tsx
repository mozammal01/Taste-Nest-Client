"use client";
import nicholas from "@/../public/experts/expert1.png";
import jamesJohnson from "@/../public/experts/expert2.png";
import marcos from "@/../public/experts/expert3.png";
import signatureImg from "@/../public/experts/signature.png";
import { motion } from "framer-motion";
import SubTitle from "../shared/subTitle";
import ExpertsCircle from "../experts-circle/experts-circle";

export default function OurExperts() {
  return (
    <div id="experts" className="container mx-auto my-40 px-2">
      <div className="text-center">
        <SubTitle title="Meet Our Experts" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 lg:gap-10 gap-20 my-20 w-full">
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <ExpertsCircle img={nicholas.src} title="Executive Pastry Chef" name="Chef Nicholas" signatureImg={signatureImg.src} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          <ExpertsCircle img={jamesJohnson.src} title="Master Chef de Cuisine" name="Chef James Johnson" signatureImg={signatureImg.src} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="relative md:my-40 lg:my-0"
        >
          <ExpertsCircle img={marcos.src} title="Head Sommelier" name="Marcos V." signatureImg={signatureImg.src} />
        </motion.div>
      </div>
    </div>
  );
}
