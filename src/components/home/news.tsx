"use client";
import Image from "next/image";
import news1Img from "@/../public/news/bar.png";
import news2Img from "@/../public/news/resturent.png";
import authorImg from "@/../public/about/author.png";
import endSectionImg from "@/../public/news/end-section.png";
import instaIcon from "@/../public/icons/instaIcon.png";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function News() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <>
      <div id="news" className="max-w-[400px] md:max-w-[1200px] mx-auto my-40">
        <div className="text-center">
          <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-6xl font-extrabold"
          >
            Culinary Journal
          </motion.h2>
          <div className="border-b-8 border-secondary pb-4 md:mx-[250px] lg:mx-[450px] mx-[120px]"></div>
        </div>
        <div className="grid xl:grid-cols-2 gap-10 my-20 w-full">
          <motion.div ref={ref} initial={{ opacity: 0, x: -100 }} animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -100 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="md:flex gap-10 md:w-[600px] w-full justify-center items-center">
            <div className="rounded-2xl">
              <Image className="rounded-2xl mx-auto" src={news1Img} alt="bar and restaurant news" width={250} height={250} />
            </div>
            <div className="flex flex-col gap-4 justify-center items-center my-4">
              <p className="bg-secondary p-1 px-3 rounded-xl w-fit font-extrabold">April 7, 2025</p>
              <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">The Alchemy of Truffles: A Seasonal Guide</h2>
              <div className="flex gap-2 items-center">
                <Image src={authorImg} alt="author profile" width={50} height={50} />
                <p className="font-extrabold">Chef Julian Ames</p>
              </div>
            </div>
          </motion.div>
          {/*  */}
          <motion.div ref={ref} initial={{ opacity: 0, x: 100 }} animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="md:flex gap-10 md:w-[600px] w-full justify-center items-center">
            <div className="rounded-2xl">
              <Image className="rounded-2xl mx-auto" src={news2Img} alt="restaurant interior news" width={250} height={250} />
            </div>
            <div className="flex flex-col gap-4 justify-center items-center my-4">
              <p className="bg-secondary p-1 px-3 rounded-xl w-fit font-extrabold">April 7, 2025</p>
              <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">Sustainable Sourcing: From Farm to Fork</h2>
              <div className="flex gap-2 items-center">
                <Image src={authorImg} alt="author profile" width={50} height={50} />
                <p className="font-extrabold">Chef Sophia Chen</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* End News */}
      <div className="max-w-[1200px] mx-auto my-28 relative">
        <div>
          <Image className="object-cover opacity-20" src={endSectionImg} alt="decorative background" width={1200} height={1200} />
        </div>
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] space-y-4 text-center">
          <div className="bg-primary rounded-full p-2 w-16 h-16 flex justify-center items-center mx-auto">
            <Image src={instaIcon} alt="Instagram icon" width={30} height={30} />
          </div>
          <h2 className="text-2xl font-extrabold">Follow @TasteNestOfficial</h2>
          <p className="font-semibold ">Join our community to inspire your culinary desires</p>
        </div>
      </div>
    </>
  );
}
