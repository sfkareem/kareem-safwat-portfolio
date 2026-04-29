"use client";

import { motion } from "motion/react";
import Image from "next/image";
import portfolioData from "@/data/portfolio.json";

export function TrustedBySection() {
  const trustedBy = portfolioData.trustedBy || [];

  if (trustedBy.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full py-12 md:py-16 border-t border-border/50"
    >
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted By
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {trustedBy.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative w-32 h-12 md:w-40 md:h-16 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
