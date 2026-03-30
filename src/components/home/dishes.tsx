"use client";
import Image from "next/image";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { dishes } from "@/constants/dishes";
import SubTitle from "../shared/subTitle";

export default function Dishes() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="container mx-auto mt-12 md:my-28 text-center" id="menu">
      <SubTitle title="Featured Dishes" />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="grid md:grid-cols-2 xl:grid-cols-3 justify-center items-center gap-10 md:gap-20 my-20 px-4"
      >
        {dishes.map((dish) => (
          <div
            key={dish.id}
            className="border-4 border-secondary rounded-2xl p-6 md:p-10 w-full max-w-[400px] min-h-[450px] flex flex-col justify-between relative mx-auto"
          >
            <div className="relative">
              <div className="absolute top-16 left-0">
                <Image src={dish.backgroundImage} alt="dish background decoration" width={300} height={300} />
              </div>
              <div className="absolute top-0 left-0">
                <Image src={dish.image} alt="crispy fried chicken dish" width={300} height={300} />
              </div>
            </div>
            <div className="font-extrabold text-start flex justify-between items-center">
              <div>
                <h2 className="text-xl">{dish.name}</h2>
                <div className="text-gray-500">
                  <span className="text-lg me-2 relative">
                    {dish.price} <hr className="w-16 absolute top-1/2 left-0 -translate-y-1/2" />
                  </span>

                  <span className="text-2xl">
                    <span className="text-primary">$</span>
                    {dish.discountPrice}
                  </span>
                </div>
              </div>
              <div className="bg-secondary rounded p-4">
                <Image src={dish.icon} alt="add to cart" width={15} height={15} />
              </div>
            </div>
            <div className="absolute top-2 left-2">
              <div className="relative">
                <div className="bg-secondary rounded-full h-15 w-15 p-4 flex flex-col items-center justify-center">
                  <span className="uppercase font-extrabold">sale</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
