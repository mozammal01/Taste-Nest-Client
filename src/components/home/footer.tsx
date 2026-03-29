import footerLeftImg from "@/../public/footer/footer-left.png";
import footerRightImg from "@/../public/footer/footer-right.png";
import Image from "next/image";
import logo from "@/../public/logo/logoWhite.png";
import leftArrow from "@/../public/icons/leftArrow.png";
import { Input } from "../ui/input";
import { AnimatedButton } from "../ui/animated-button";
import Link from "next/link";

export default function Footer() {
  return (
    <div id="contact" className="bg-slate-50 relative lg:h-[580px] py-10 lg:py-0 pt-20 lg:pt-0">
      <div className="flex justify-between items-center">
        <div className="absolute bottom-0 left-0">
          <Image src={footerLeftImg} alt="decorative footer left image" width={200} height={200} />
        </div>
        <div className="absolute bottom-0 right-0">
          <Image src={footerRightImg} alt="decorative footer right image" width={200} height={200} />
        </div>
      </div>
      <div className="flex flex-col justify-between items-center max-w-[1200px] mx-auto pt-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full gap-10">
          {/* Left Content */}
          <div className="flex flex-col gap-4 bg-primary h-[330px] w-full max-w-[400px] rounded-2xl text-white">
            <Image src={logo} alt="TasteNest restaurant logo" width={200} height={200} />
            <div className="flex flex-col gap-2 ps-10">
              <span className="font-extrabold -mt-5">Tuesday – Saturday: 12:00pm – 23:00pm</span>
              <span className="font-extrabold underline">Closed on Sunday</span>
              <span className="font-extrabold mt-20">5 star rated on TripAdvisor</span>
            </div>
          </div>
          {/* Left Middle Content */}
          <div>
            <h2 className="font-extrabold border-b-4 border-secondary text-xl font-outfit">About</h2>
            <div className="flex flex-col space-y-3 mt-10">
              <Link href="/under-construction" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Our Story</span>
              </Link>
              <Link href="/under-construction" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Special Dish</span>
              </Link>
              <Link href="/#menu" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Reservation</span>
              </Link>
              <Link href="/under-construction" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Contact Card</span>
              </Link>
            </div>
          </div>
          {/* Right Middle Content */}
          <div>
            <h2 className="font-extrabold border-b-4 border-secondary text-xl font-outfit">Menu</h2>
            <div className="flex flex-col space-y-3 mt-10">
              <Link href="/menu" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Steaks</span>
              </Link>
              <Link href="/menu" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Burgers</span>
              </Link>
              <Link href="/menu" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>BBQ</span>
              </Link>
              <Link href="/under-construction" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Cocktails</span>
              </Link>
              <Link href="/under-construction" className="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
                <Image src={leftArrow} alt="menu arrow" width={10} height={10} />
                <span>Desserts</span>
              </Link>
            </div>
          </div>
          {/* Right Content */}
          <div>
            <h2 className="font-extrabold border-b-4 border-secondary text-xl">Newsletter</h2>
            <div className="flex flex-col space-y-3 mt-10">
              <div className="flex items-center gap-2 font-semibold">
                <span>Get recent news and updates. </span>
              </div>
              <Input className="w-full py-5 rounded bg-white placeholder:font-bold px-5" type="email" placeholder="Enter your email" />
              <AnimatedButton variant="slide" className="w-[100px]">
                Submit
              </AnimatedButton>
            </div>
          </div>
        </div>
        {/* Bottom Content */}
        <div className="w-full mt-20 border-t-8 border-secondary">
          <div className="flex justify-between items-center gap-2 py-4 font-extrabold">
            <div>
              <span>
                <span className="text-primary">©2025 TasteNest</span> | All mozammal01 Themes
              </span>
            </div>
            <div className="underline">
              <span>Facebook</span>
            </div>
            <div className="underline">
              <span>Instagram</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
