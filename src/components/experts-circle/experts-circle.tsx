import Image from "next/image";
import Circles from "../shared/circles";

export default function ExpertsCircle({ title, name, signatureImg, img }: { title: string; name: string; signatureImg: string; img: string }) {
  return (
    <div className="relative group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
        <Image src={img} alt={name} fill className="object-cover object-top transition-transform duration-500 group-hover:scale-105" unoptimized />
      </div>
      <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] md:-mt-24 relative z-10 border-2 border-gray-100 shadow-xl mx-4 text-center">
        <div className="flex flex-col gap-1 md:gap-2 items-center">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary">{title}</p>
          <p className="text-xl md:text-2xl font-black text-gray-900">{name}</p>
          <div className="flex gap-1.5 mt-2 md:mt-3">
            <Circles />
            <Circles />
            <Circles />
          </div>
          <div className="relative h-10 w-28 md:h-12 md:w-32 mt-4 md:mt-6">
            <Image 
              src={signatureImg} 
              alt="chef signature" 
              fill
              className="object-contain opacity-60" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
