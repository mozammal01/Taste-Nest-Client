"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Testimonial } from "@/Interfaces/shared-interface";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Feedback({ feedbacks }: { feedbacks: Testimonial[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
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
      ref={ref}
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
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
          {feedbacks.map((testimonial, i) => (
            <CarouselItem key={i}>
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
        {feedbacks.map((_, i) => (
          <button
            key={i}
            className={cn("w-3 h-3 rounded-full transition-colors", selectedIndex === i ? "bg-gray-900" : "bg-gray-400")}
            onClick={() => api?.scrollTo(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}
