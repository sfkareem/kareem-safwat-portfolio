'use client'

import { useEffect, useRef } from "react";
import { useInView, motion, useMotionValue, useTransform, animate } from "motion/react";
import dynamic from 'next/dynamic';
import { Spotlight } from "@/components/ui/spotlight"

// Dynamically import SplineScene to prevent it from blocking the main thread during initial load
const SplineScene = dynamic(() => import("@/components/ui/splite").then(mod => mod.SplineScene), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin opacity-50"></div>
    </div>
  )
});

function Counter({ from, to, suffix = "" }: { from: number; to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, to]);

  return (
    <span ref={nodeRef}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function AIHero() {
  return (
    <div data-nav-theme="dark" className="w-full min-h-screen bg-black relative overflow-hidden flex items-center">
      {/* Spline Scene Container - Responsive sizing and positioning */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <div className="relative w-full h-full">
          {/* 
            On mobile: Full width, centered (default Spline behavior)
            On laptop/desktop (lg): Shifted to the right using translate-x.
          */}
          <div className="absolute inset-0 w-full h-full lg:translate-x-[25%] transition-all duration-1000 ease-out">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 z-10 pointer-events-none"
        fill="white"
      />
      
      {/* Content Overlay - Responsive alignment */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-16 lg:px-32 pointer-events-none">
        <div className="max-w-2xl mx-auto lg:mx-0 flex flex-col items-center text-center lg:items-start lg:text-left transition-all duration-500">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold text-white tracking-tighter leading-[1.1]">
            AI Vibe Coder
          </h1>
          <p className="mt-6 text-neutral-300 max-w-lg text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed">
            Specializing in Agentic Software Development, AI-powered workflows, and scalable full-stack applications.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 max-w-sm w-full">
            <div className="flex flex-col items-center lg:items-start">
              <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white">
                <Counter from={0} to={3} suffix="+" />
              </div>
              <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-neutral-400 mt-1">Years Experience</div>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white">
                <Counter from={0} to={100} suffix="%" />
              </div>
              <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-neutral-400 mt-1">AI-Driven</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
