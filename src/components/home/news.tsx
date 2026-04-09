"use client";
import Image from "next/image";
import news1Img from "@/../public/news/bar.png";
import news2Img from "@/../public/news/resturent.png";
import authorImg from "@/../public/about/author.png";
import endSectionImg from "@/../public/news/end-section.png";
import instaIcon from "@/../public/icons/instaIcon.png";
import { motion } from "framer-motion";
import { AnimatedButton } from "../ui/animated-button";
import Link from "next/link";

export default function News() {
  return (
    <>
      <div id="news" className="container mx-auto my-32 px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-primary font-black text-xs uppercase tracking-[0.3em]">Latest Stories</p>
            <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tighter">
              Culinary <span className="text-primary italic">Journal</span>
            </h2>
            <div className="h-1.5 w-24 bg-secondary rounded-full mt-2" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Article 1 */}
          <Link 
            href="/under-construction"
            className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 group"
          >
            <div className="relative w-full md:w-1/2 aspect-square overflow-hidden rounded-2xl">
              <Image className="object-cover transition-transform duration-700 group-hover:scale-110" src={news1Img} alt="Truffle Alchemy" fill />
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-left">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                April 12, 2026
              </span>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                The Alchemy of Truffles: A Seasonal Guide
              </h3>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <Image src={authorImg} alt="Chef Julian" width={40} height={40} className="rounded-full shadow-md" />
                <p className="text-sm font-bold text-slate-700 underline decoration-primary/30 underline-offset-4">Chef Julian Ames</p>
              </div>
            </div>
          </Link>

          {/* Article 2 */}
          <Link 
            href="/under-construction"
            className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 group"
          >
            <div className="relative w-full md:w-1/2 aspect-square overflow-hidden rounded-2xl">
              <Image className="object-cover transition-transform duration-700 group-hover:scale-110" src={news2Img} alt="Sustainable Sourcing" fill />
            </div>
            <div className="w-full md:w-1/2 space-y-6 text-left">
              <span className="inline-block bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                April 15, 2026
              </span>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight">
                Sustainable Sourcing: From Farm to Fork
              </h3>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <Image src={authorImg} alt="Chef Sophia" width={40} height={40} className="rounded-full shadow-md" />
                <p className="text-sm font-bold text-slate-700 underline decoration-primary/30 underline-offset-4">Chef Sophia Chen</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* End Footer Call Action */}
      <div className="container mx-auto mb-32 px-6">
        <div className="relative h-[300px] md:h-[400px] rounded-[48px] overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-center px-6">
          <Image className="absolute inset-0 object-cover opacity-30 blur-[2px]" src={endSectionImg} alt="Instagram feed decoration" fill />
          <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-primary/30" />
          
          <div className="relative z-10 space-y-8">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ duration: 4, repeat: Infinity }}
              className="bg-white/10 backdrop-blur-xl rounded-full p-6 w-20 h-20 flex justify-center items-center mx-auto border border-white/20"
            >
              <Image src={instaIcon} alt="Instagram" width={32} height={32} />
            </motion.div>
            <div className="space-y-2">
              <h4 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Follow @TasteNestOfficial</h4>
              <p className="text-white/60 font-medium tracking-wide">Join our community of 50k+ culinary enthusiasts</p>
            </div>
            <Link href="/under-construction">
              <AnimatedButton variant="ripple" className="rounded-full px-12">
                Follow Us
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
