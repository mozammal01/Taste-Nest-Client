import Banner from "@/components/home/banner";
import About from "@/components/home/about";
import MenuDishes from "@/components/home/menu&dishes";
import Categories from "@/components/home/categories";
import { getCurrentUser } from "@/lib/auth";

import { Suspense } from "react";
import { Loading, HeroSkeleton, SectionSkeleton } from "@/components/ui/loading";
import dynamic from "next/dynamic";

const Testimonials = dynamic(() => import("@/components/home/testimonials"), {
  loading: () => (
    <div className="h-[500px] bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-6 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-slate-800 rounded-full" />
      <div className="h-10 w-64 bg-gray-200 dark:bg-slate-800 rounded-2xl" />
    </div>
  )
});

const OurExperts = dynamic(() => import("@/components/home/ourExperts"), {
  loading: () => <SectionSkeleton lines={3} />
});

const Statistics = dynamic(() => import("@/components/home/stats"), {
  loading: () => <SectionSkeleton lines={2} />
});

const Ordering = dynamic(() => import("@/components/home/ordering"), {
  loading: () => (
    <div className="h-[350px] bg-primary/5 flex items-center justify-center rounded-[32px]">
      <Loading variant="dots" size="lg" />
    </div>
  )
});

const News = dynamic(() => import("@/components/home/news"), {
  loading: () => <SectionSkeleton lines={2} />
});

const FAQ = dynamic(() => import("@/components/home/faq"), {
  loading: () => (
    <div className="py-24 bg-white dark:bg-slate-950 flex items-center justify-center">
      <Loading variant="food" size="lg" />
    </div>
  )
});

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

      <Suspense fallback={<SectionSkeleton lines={2} />}>
        <Statistics />
      </Suspense>

      <Suspense fallback={<div className="h-[350px] bg-primary/5 flex items-center justify-center"><Loading variant="dots" size="lg" /></div>}>
        <Ordering />
      </Suspense>

      <Suspense fallback={<SectionSkeleton lines={2} />}>
        <News />
      </Suspense>

      <Suspense fallback={<div className="py-24 bg-white flex items-center justify-center"><Loading variant="food" size="lg" /></div>}>
        <FAQ />
      </Suspense>
    </>
  );
}
