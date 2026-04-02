"use client";
import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import dessertImg from "@/../public/categories/dessert.png";
import steakImg from "@/../public/categories/steak.png";
import coffeeImg from "@/../public/categories/coffee.png";
import burgerImg from "@/../public/categories/burger.png";

import { cn } from "@/lib/utils";
import DessertIcon from "../icons/DessertIcon";
import SteakIcon from "../icons/SteakIcon";
import CoffeeIcon from "../icons/CoffeeIcon";
import BurgerIcon from "../icons/BurgerIcon";
import mask from "@/../public/categories/mask.png";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedButton } from "../ui/animated-button";
import Link from "next/link";

// Curated Menu Data
const categories = [
  { id: "steak", label: "Steaks", icon: SteakIcon },
  { id: "dessert", label: "Desserts", icon: DessertIcon },
  { id: "coffee", label: "Coffee", icon: CoffeeIcon },
  { id: "burger", label: "Burgers", icon: BurgerIcon },
];

const items: Record<
  string,
  {
    image: StaticImageData;
    title: string;
    items: { name: string; description: string; price: string }[];
  }
> = {
  dessert: {
    image: dessertImg,
    title: "Signature Sweet Endings",
    items: [
      {
        name: "Belgian Chocolate Fondant",
        description:
          "Warm lava cake with a molten heart, served with Tahitian vanilla bean gelato.",
        price: "$12.50",
      },
      {
        name: "Madagascar Vanilla Cheesecake",
        description:
          "Rich, creamy New York style cheesecake on a slow-baked buttery graham cracker crust.",
        price: "$9.95",
      },
    ],
  },
  steak: {
    image: steakImg,
    title: "The Butcher's Selection",
    items: [
      {
        name: "Australian Grain-Fed Wagyu",
        description:
          "Marble score 7-8 ribeye, flame-grilled and rested with rosemary-infused bone marrow butter.",
        price: "$48.99",
      },
      {
        name: "Signature T-Bone 'Fiorentina'",
        description:
          "500g bone-in cut, dry-aged for 28 days for maximum tenderness and deep, nutty flavor.",
        price: "$42.50",
      },
    ],
  },
  coffee: {
    image: coffeeImg,
    title: "Roasted Bean Collection",
    items: [
      {
        name: "Single-Origin Double Espresso",
        description:
          "Ethically sourced Ethiopian Yirgacheffe beans with notes of jasmine and citrus.",
        price: "$4.50",
      },
      {
        name: "Silk-Road Cappuccino",
        description:
          "Velvety micro-foam layered over a robust house blend with a hint of dark cocoa dusting.",
        price: "$5.95",
      },
    ],
  },
  burger: {
    image: burgerImg,
    title: "Elevated Classics",
    items: [
      {
        name: "The TasteNest Signature",
        description:
          "Angus beef brisket blend pot-seared with Gruyère cheese, caramelized onions, and truffle aioli.",
        price: "$18.99",
      },
      {
        name: "Garden State Umami Burger",
        description:
          "House-made plant-based patty, miso-glazed shiitake mushrooms, and fresh avocado salsa.",
        price: "$16.50",
      },
    ],
  },
};

export default function PopularMenu() {
  const [active, setActive] = useState("dessert");

  return (
    <div id="menu" className="w-full flex flex-col items-center gap-6">
      {/* Category Tabs */}
      <div className="w-full max-w-5xl px-4 py-6 pb-4 md:pb-6">
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center mx-auto">
          {categories.map((cat) => {
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative shrink-0"
              >
                {/* Desktop view */}
                <motion.div
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    "hidden md:flex flex-col justify-center items-center gap-2 border shadow-sm rounded-xl cursor-pointer p-8 relative overflow-hidden",
                    "w-[190px] h-[190px]",
                  )}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={false}
                    animate={{
                      opacity: active === cat.id ? 1 : 0,
                      scale: active === cat.id ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />

                  <motion.div
                    className="relative z-10"
                    animate={{ scale: active === cat.id ? 1.1 : 1 }}
                  >
                    <cat.icon
                      className={cn(
                        "size-[70px] transition-colors duration-300",
                        active === cat.id ? "text-white" : "text-primary",
                      )}
                    />
                  </motion.div>
                  <motion.span
                    className={cn(
                      "font-black text-center relative z-10 transition-colors px-2",
                      active === cat.id ? "text-white" : "text-slate-900",
                    )}
                  >
                    {cat.label}
                  </motion.span>
                </motion.div>

                {/* Mobile view */}
                <motion.div
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    "md:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all min-w-[120px]",
                    active === cat.id
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white border-slate-100 text-slate-600",
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  <cat.icon
                    className={cn("size-6", active === cat.id ? "text-white" : "text-primary")}
                  />
                  <span className="font-black whitespace-nowrap">{cat.label}</span>
                </motion.div>

                {active === cat.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="hidden md:block absolute top-[178px] left-1/2 -translate-x-1/2"
                  >
                    <Image src={mask} alt="mask" width={168} height={40} className="w-[170px]" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -25, scale: 0.98 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-stretch w-[92%] md:w-full md:max-w-5xl bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50 my-10 mt-20 mx-auto"
      >
        {/* Food Image Wrapper */}
        <motion.div
          className="relative md:w-2/5 min-h-[300px] overflow-hidden group"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent" />
          <Image
            src={items[active].image}
            alt={items[active].title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-6 left-6">
            <span className="bg-white/90 backdrop-blur-md text-primary font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm">
              Chef&apos;s Pick
            </span>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[2px] w-8 bg-primary rounded-full" />
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">
                Exquisite Selection
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 leading-tight">
              {items[active].title}
            </h2>
          </motion.div>

          <motion.ul
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {items[active].items.map((item, i) => (
              <motion.li
                key={i}
                className="group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + i * 0.15,
                  ease: "easeOut",
                }}
              >
                <div className="flex justify-between items-end mb-2">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div className="grow border-b-2 border-dotted border-gray-200 mx-4 mb-2 group-hover:border-primary/30 transition-colors duration-300" />
                  <span className="text-xl font-black text-primary">{item.price}</span>
                </div>
                <p className="text-gray-500 leading-relaxed text-sm italic pr-12">
                  {item.description}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
      {/* Full Menu Button */}
      <AnimatedButton variant="ripple" size="lg" className="w-fit" asChild>
        <Link href={`/menu?category=${active}`}>View Full Menu</Link>
      </AnimatedButton>
    </div>
  );
}
