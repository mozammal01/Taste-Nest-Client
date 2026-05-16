"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Testimonial } from "@/Interfaces/shared-interface";
import { motion } from "framer-motion";

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
              <Card className="border-2 border-secondary rounded-2xl">
                <CardContent className="p-6 h-[200px] flex flex-col justify-between">
                  <div className="text-start text-gray-600 font-semibold text-xl">{testimonial.review}</div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-extrabold">{testimonial.author}</h2>
                    <div className="bg-secondary rounded-full h-15 w-15 -mb-4"></div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
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
