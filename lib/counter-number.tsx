"use client"

import { useRef, useEffect } from "react"
import { motion, useMotionValue, useTransform, animate, useInView } from "motion/react"
import { cn } from "@/lib/utils"

interface CounterNumberProps {
  value: number
  from?: number
  prefix?: string
  suffix?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  duration?: number
}

const sizeClasses = {
  sm: "text-lg font-bold",
  md: "text-2xl font-bold",
  lg: "text-3xl font-bold",
  xl: "text-4xl font-bold md:text-5xl",
}

export function CounterNumber({
  value,
  from = 0,
  prefix = "",
  suffix = "",
  size = "md",
  className,
  duration = 2,
}: CounterNumberProps) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const count = useMotionValue(from)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration,
        ease: "easeOut",
      })
      return controls.stop
    }
  }, [isInView, count, value, duration])

  return (
    <span ref={nodeRef} className={cn(sizeClasses[size], className)}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}
