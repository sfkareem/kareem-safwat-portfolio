"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface TextShimmerProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function TextShimmer({ children, className, duration = 2 }: TextShimmerProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-[linear-gradient(110deg,#939393,45%,#1e293b,55%,#939393)] bg-[length:200%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(110deg,#e2e8f0,45%,#1e293b,55%,#e2e8f0)]",
        className
      )}
      animate={{
        backgroundPosition: ["-100% 0", "100% 0"],
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}
