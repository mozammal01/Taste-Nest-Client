import Banner from "@/components/home/banner";
import About from "@/components/home/about";
import MenuDishes from "@/components/home/menu&dishes";
import Testimonials from "@/components/home/testimonials";
import OurExperts from "@/components/home/ourExperts";
import News from "@/components/home/news";
import Ordering from "@/components/home/ordering";
import Categories from "@/components/home/categories";
import { getCurrentUser } from "@/lib/auth";

import { Suspense } from "react";
import { CardSkeleton, Loading, HeroSkeleton, SectionSkeleton } from "@/components/ui/loading";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <Banner />
      </Suspense>
      
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center bg-gray-50/50"><Loading size="lg" /></div>}>
        <About />
      </Suspense>

      <Suspense fallback={<SectionSkeleton lines={4} />}>
        <Categories />
      </Suspense>

      <Suspense fallback={<div className="py-24 flex flex-col items-center gap-6"><Loading variant="food" size="xl" /><p className="text-gray-400 animate-pulse uppercase tracking-widest text-xs font-bold">Discovering delicacies...</p></div>}>
        <MenuDishes user={user} />
      </Suspense>

      <Suspense fallback={<div className="h-[500px] bg-gray-50 flex flex-col items-center justify-center gap-6 animate-shimmer"><div className="h-4 w-32 bg-gray-200 rounded-full animate-pulse" /><div className="h-10 w-64 bg-gray-200 rounded-2xl animate-pulse" /></div>}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionSkeleton lines={3} />}>
        <OurExperts />
      </Suspense>

      <Suspense fallback={<div className="h-[350px] bg-primary/5 flex items-center justify-center"><Loading variant="dots" size="lg" /></div>}>
        <Ordering />
      </Suspense>

      <Suspense fallback={<SectionSkeleton lines={2} />}>
        <News />
      </Suspense>
    </>
  );
}
