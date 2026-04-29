"use client";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

interface TimelineEntry {
  id?: number | string;
  title: string;
  company: string;
  location: string;
  description: string;
  src: string;
  logoBg?: string;
  content: React.ReactNode;
  expandedContent?: React.ReactNode;
}

export const Timeline = ({ data, isLoading = false }: { data: TimelineEntry[], isLoading?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [activeItem, setActiveItem] = useState<TimelineEntry | null>(null);
  const id = React.useId();

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, isLoading]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveItem(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  if (isLoading) {
    return (
      <div className="w-full bg-background font-sans md:px-10" ref={containerRef}>
        <div className="relative max-w-7xl mx-auto pb-20">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex justify-start pt-10 md:pt-40 gap-4 md:gap-10">
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-[120px] md:max-w-sm md:w-full">
                <div className="h-8 w-8 md:h-10 md:w-10 absolute left-2 md:left-3 rounded-full bg-muted animate-pulse" />
                <Skeleton className="hidden md:block h-8 w-32 md:ml-20" />
              </div>
              <div className="relative pl-12 pr-4 md:pl-4 w-full">
                <Skeleton className="md:hidden block h-4 w-24 mb-2" />
                <div className="p-6 rounded-3xl border border-border/50 bg-muted/10">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-background font-sans md:px-10"
      ref={containerRef}
    >
      <AnimatePresence>
        {activeItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] cursor-pointer"
            />
            <div className="fixed inset-0 grid place-items-center z-[101] p-4 md:p-8 pointer-events-none">
              <motion.div
                layoutId={`card-${activeItem.company}-${activeItem.id}-${id}`}
                className="w-full max-w-4xl max-h-[90vh] bg-background rounded-3xl overflow-hidden flex flex-col pointer-events-auto shadow-2xl relative"
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-muted/80 hover:bg-muted text-foreground backdrop-blur-md transition-colors z-50"
                >
                  <X className="w-6 h-6" />
                </button>
                
                {/* Content */}
                <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar z-10 relative">
                  <div className="mb-8">
                    <motion.p
                      layoutId={`date-${activeItem.company}-${activeItem.id}-${id}`}
                      className="text-primary font-medium tracking-wider uppercase text-sm mb-2"
                    >
                      {activeItem.title}
                    </motion.p>
                    <motion.h3
                      layoutId={`company-${activeItem.company}-${activeItem.id}-${id}`}
                      className="text-3xl md:text-5xl font-bold text-foreground mb-2"
                    >
                      {activeItem.company}
                    </motion.h3>
                    <motion.p
                      layoutId={`role-${activeItem.company}-${activeItem.id}-${id}`}
                      className="text-xl text-muted-foreground"
                    >
                      {activeItem.description}
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose dark:prose-invert max-w-none"
                  >
                    {activeItem.expandedContent || activeItem.content}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 gap-4 md:gap-10 group cursor-pointer"
            onClick={() => setActiveItem(item)}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-[120px] md:max-w-sm md:w-full">
              <div className="h-8 w-8 md:h-10 md:w-10 absolute left-2 md:left-3 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-muted shadow-inner group-hover:bg-primary/20 transition-colors" />
              </div>
              <motion.h3 
                layoutId={`date-${item.company}-${item.id ?? index}-${id}`}
                className="hidden md:block text-sm md:text-2xl md:pl-20 font-bold text-muted-foreground group-hover:text-primary transition-colors"
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-16 pr-4 md:pl-4 w-full">
              <motion.h3 
                layoutId={`date-mobile-${item.company}-${item.id ?? index}-${id}`}
                className="md:hidden block text-sm mb-2 text-center font-bold text-muted-foreground group-hover:text-primary transition-colors"
              >
                {item.title}
              </motion.h3>
              
              <motion.div 
                layoutId={`card-${item.company}-${item.id ?? index}-${id}`}
                className="p-6 rounded-3xl shadow-md bg-background hover:bg-muted/30 transition-all hover:shadow-xl relative overflow-hidden group/card"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 relative z-10">
                  <div>
                    <motion.h3 
                      layoutId={`company-${item.company}-${item.id ?? index}-${id}`}
                      className="text-2xl font-bold text-foreground"
                    >
                      {item.company}
                    </motion.h3>
                    <motion.p 
                      layoutId={`role-${item.company}-${item.id ?? index}-${id}`}
                      className="text-lg text-primary font-medium"
                    >
                      {item.description}
                    </motion.p>
                  </div>
                </div>
                <div className="text-muted-foreground line-clamp-3 relative z-10">
                  {item.content}
                </div>
                <div className="mt-4 text-primary text-sm font-semibold flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity relative z-10">
                  Click to expand details
                </div>
              </motion.div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-[32px] left-[24px] top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-primary via-primary/50 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
