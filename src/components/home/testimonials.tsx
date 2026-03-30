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
    <div id="testimonials" className="container mx-auto my-20 px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Feedback Section */}
        <div className="w-full lg:w-1/2 space-y-12">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="h-px w-8 bg-primary" />
              <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">Testimonials & Reviews</p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-950 tracking-tighter leading-tight">
              Our Customer <span className="text-primary italic">Feedback</span>
            </h2>
          </div>
          <Feedback feedbacks={testimonials} />
        </div>

        {/* Visual Section - Hidden on mobile, visible on large screens */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:block w-1/2 relative h-[600px]"
        >
          {/* Main Large Image */}
          <div className="absolute top-0 right-0 w-3/4 h-3/4 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
            <Image 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
              src={redImg} 
              alt="customer enjoying meal" 
              fill
            />
          </div>
          
          {/* Bottom Floating Image */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 left-0 w-1/2 h-1/2 rounded-[32px] overflow-hidden shadow-2xl border-8 border-white group z-10"
          >
            <Image 
              src={coffeeImg} 
              alt="delicious coffee" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </motion.div>

          {/* Side Floating Image */}
          <motion.div 
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/4 -right-10 w-1/3 h-1/3 rounded-[24px] overflow-hidden shadow-2xl border-4 border-white group z-20"
          >
            <Image 
              src={strawberryImg} 
              alt="fresh strawberry" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>
    </div>
  );
}
