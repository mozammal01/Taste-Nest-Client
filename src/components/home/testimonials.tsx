"use client";
import redImg from "@/../public/testimonials/redImage.png";
import coffeeImg from "@/../public/testimonials/coffee.png";
import strawberryImg from "@/../public/testimonials/strawberry.png";
import Image from "next/image";
import Feedback from "../Feedback/Feedback";
import { Testimonial } from "@/Interfaces/shared-interface";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const testimonials: Testimonial[] = [
    {
      author: "Eleanor Vance",
      review: "The Madagascar Vanilla Cheesecake is a masterclass in balance; the texture is sublime and the crust provides a perfect buttery snap.",
    },
    {
      author: "Marcus Thorne",
      review: "Rarely do you find a Ribeye with such consistent marbling. The bone marrow butter elevates the whole experience to another level.",
    },
    {
      author: "Isabella Rossi",
      review: "A truly atmospheric dining experience. The Single-Origin Espresso has a clarity of flavor that is hard to find even in specialty cafes.",
    },
    {
      author: "Julian Ames",
      review: "The Signature Burger isn't just a meal; it's a gourmet journey. The truffle aioli is the subtle hero that brings everything together.",
    },
    {
      author: "Sophia Chen",
      review: "Impeccable service and an even more impressive wine list. TasteNest has become our go-to for celebrating life's milestones.",
    },
  ];

  return (
    <div id="testimonials" className="md:max-w-[1200px] max-w-[500px] md:mx-auto my-20 md:flex justify-between items-end mx-2 px-4">
      <div className="lg:w-[40%] w-full md:flex flex-col gap-10 space-y-10">
        <div className="space-y-4">
          <p className="text-primary font-bold text-lg uppercase">Testimonials & Reviews</p>
          <h2 className="text-5xl font-extrabold">Our Customer Feedback</h2>
        </div>
        <Feedback feedbacks={testimonials} />
      </div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="md:w-[50%] w-full ml-28 hidden lg:block"
      >
        <div className="relative flex justify-between">
          <div className="bg-[#F3274C] rounded-3xl overflow-hidden">
            <Image className="object-cover w-full h-full" src={redImg} alt="customer enjoying meal" width={290} height={290} />
          </div>
          <div className="absolute bottom-60 left-48">
            <Image src={coffeeImg} alt="delicious coffee and pastries" width={290} height={290} className="object-cover rounded-3xl" />
          </div>
          <div className="absolute top-20 left-80">
            <Image src={strawberryImg} alt="fresh strawberry dessert" width={290} height={290} className="object-cover rounded-3xl" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
