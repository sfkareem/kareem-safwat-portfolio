"use client"

import { motion } from "motion/react"
import { CounterNumber } from "@/lib/counter-number"

interface StatsSectionProps {
  category: "civil" | "ai"
}

const civilStats = [
  { value: 9, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 1, suffix: "B+", label: "Total Projects Value ($)" },
]

const aiStats = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 100, suffix: "%", label: "AI-Driven" },
  { value: 10, suffix: "+", label: "Projects Built" },
]

export function StatsSection({ category }: StatsSectionProps) {
  const stats = category === "civil" ? civilStats : aiStats

  return (
    <section className="py-16 md:py-24 flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <p className="text-muted-foreground max-w-sm text-center text-sm md:max-w-md mb-12">
          {category === "civil"
            ? "Over a decade of delivering precision-driven cost management and tendering excellence across the Middle East."
            : "Building intelligent, scalable applications using agentic AI workflows and modern full-stack technologies."
          }
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-primary/5 h-40 w-40 rounded-2xl flex flex-col items-center justify-center gap-3 p-6"
            >
              <CounterNumber
                value={stat.value}
                suffix={stat.suffix}
                size="xl"
                className="text-primary"
              />
              <p className="text-sm text-muted-foreground font-medium text-center leading-tight">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
