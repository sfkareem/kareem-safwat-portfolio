"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "./animated-counter";
import portfolioData from "@/data/portfolio.json";

interface Stat {
  value: string;
  label: string;
  icon?: string;
}

const stats: Stat[] = [
  { value: portfolioData.statistics.yearsOfExperience, label: "Years Experience" },
  { value: portfolioData.statistics.projectsValue, label: "Projects Value" },
  { value: portfolioData.statistics.bidSuccessRate, label: "Bid Success Rate" },
  { value: portfolioData.statistics.costReduction, label: "Cost Reduction" },
];

function parseStatValue(value: string): { number: number; suffix: string; prefix: string } {
  const cleanValue = value.replace(/[^0-9.]/g, "");
  const number = parseFloat(cleanValue) || 0;
  const suffix = value.replace(/[0-9.]/g, "");
  const prefix = "";
  return { number, suffix, prefix };
}

export function StatsSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="w-full py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const { number, suffix } = parseStatValue(stat.value);
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
                  <AnimatedCounter
                    end={number}
                    suffix={suffix}
                    duration={2000 + index * 200}
                  />
                </div>
                <p className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
