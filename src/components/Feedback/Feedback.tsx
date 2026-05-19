"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Testimonial } from "@/Interfaces/shared-interface";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function Feedback({ feedbacks }: { feedbacks: Testimonial[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", bounce: 0.2, duration: 1 }}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-xl mx-auto"
      >
        <CarouselContent>
          {feedbacks.map((testimonial) => (
            <CarouselItem key={testimonial.author}>
              <Card className="border-2 border-secondary/30 dark:border-secondary/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-xl transition-all duration-300">
                <CardContent className="p-8 min-h-[220px] flex flex-col justify-between relative overflow-hidden">
                  {/* Decorative Quote mark behind */}
                  <div className="absolute right-6 top-6 opacity-5 dark:opacity-[0.03] pointer-events-none">
                    <Quote className="w-24 h-24 text-primary" strokeWidth={1} />
                  </div>

                  <div className="text-start text-slate-700 dark:text-slate-300 font-medium text-lg md:text-xl leading-relaxed relative z-10">
                    &ldquo;{testimonial.review}&rdquo;
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{testimonial.author}</h2>
                      <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mt-0.5">Verified Diner</p>
                    </div>
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary">
                      <Quote className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {feedbacks.map((feedback, i) => (
          <button
            key={feedback.author}
            className={cn("w-3 h-3 rounded-full transition-all duration-300", selectedIndex === i ? "bg-primary scale-125 shadow-lg shadow-primary/20" : "bg-gray-300 dark:bg-slate-700")}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}
