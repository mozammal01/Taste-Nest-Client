"use client";
import footerLeftImg from "@/../public/footer/footer-left.png";
import footerRightImg from "@/../public/footer/footer-right.png";
import Image from "next/image";
import logo from "@/../public/logo/logoWhite.png";
import leftArrow from "@/../public/icons/leftArrow.png";
import { Input } from "../ui/input";
import { AnimatedButton } from "../ui/animated-button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on signin and signup pages
  if (pathname === "/signin" || pathname === "/signup") {
    return null;
  }

  return (
    <footer id="contact" className="bg-slate-50 relative overflow-hidden py-16 md:py-24">
      {/* Background Decorations - Hidden on small screens */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-40 md:opacity-100 flex justify-between items-end">
        <div className="relative w-32 h-32 md:w-64 md:h-64">
          <Image src={footerLeftImg} alt="decoration" fill className="object-contain object-left-bottom" />
        </div>
        <div className="relative w-32 h-32 md:w-64 md:h-64">
          <Image src={footerRightImg} alt="decoration" fill className="object-contain object-right-bottom" />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="bg-primary p-8 rounded-3xl text-white shadow-xl shadow-primary/20 flex flex-col items-center lg:items-start text-center lg:text-left transition-transform hover:scale-[1.02]">
            <Image src={logo} alt="TasteNest" width={180} height={60} className="mb-6 brightness-0 invert" />
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Opening Hours</p>
                <p className="font-bold">Tue – Sat: 12:00 – 23:00</p>
                <p className="font-bold text-secondary">Closed on Sunday</p>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="font-black text-lg tracking-tight">5 Star Rated</p>
                <p className="text-sm opacity-80 font-medium">on TripAdvisor & Yelp</p>
              </div>
            </div>
          </div>

          {/* About Column */}
          <div>
            <h4 className="text-xl font-black text-slate-950 mb-8 flex items-center gap-2">
              About <div className="h-1 flex-1 bg-secondary rounded-full" />
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Our Story", href: "/under-construction" },
                { name: "Special Dish", href: "/under-construction" },
                { name: "Reservation", href: "/#menu" },
                { name: "Experience", href: "/under-construction" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-3 font-bold text-slate-600 hover:text-primary transition-all">
                    <Image src={leftArrow} alt="arrow" width={12} height={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu Column */}
          <div>
            <h4 className="text-xl font-black text-slate-950 mb-8 flex items-center gap-2">
              Menu <div className="h-1 flex-1 bg-secondary rounded-full" />
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Prime Steaks", href: "/menu?category=steak" },
                { name: "Signature Burgers", href: "/menu?category=burger" },
                { name: "Gourmet Coffee", href: "/menu?category=coffee" },
                { name: "Craft Cocktails", href: "/under-construction" },
                { name: "Artisan Desserts", href: "/menu?category=dessert" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex items-center gap-3 font-bold text-slate-600 hover:text-primary transition-all">
                    <Image src={leftArrow} alt="arrow" width={12} height={12} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-xl font-black text-slate-950 mb-8 flex items-center gap-2">
              Newsletter <div className="h-1 flex-1 bg-secondary rounded-full" />
            </h4>
            <div className="space-y-6">
              <p className="text-slate-500 font-medium">Join our curated list for exclusive tasting events and culinary news.</p>
              <div className="space-y-3">
                <Input className="w-full h-14 rounded-2xl bg-white border-slate-200 focus:ring-primary focus:border-primary px-6 font-bold" type="email" placeholder="Your email address" />
                <AnimatedButton variant="slide" className="w-full h-14 rounded-2xl">
                  Subscribe Now
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t-2 border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-black text-slate-400 tracking-tighter">
            <p>
              <span className="text-primary tracking-normal">© 2026 TASTENEST</span> | CRAFTED WITH PASSION
            </p>
            <div className="flex items-center gap-8">
              <Link href="/under-construction" className="hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px]">Facebook</Link>
              <Link href="/under-construction" className="hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px]">Instagram</Link>
              <Link href="/under-construction" className="hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px]">Twitter</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
