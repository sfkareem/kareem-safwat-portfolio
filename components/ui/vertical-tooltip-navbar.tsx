"use client"

import { motion } from "motion/react"
import { useState, type ReactNode } from "react"
import { Home, Briefcase, Wrench, Award, Mail, Rocket } from "lucide-react"
import { ColorSelector } from "./color-selector"
import { ThemeToggleButton } from "@/components/v1/skiper26"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"
import { HubIcon } from "./hub-icon"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/v1/skiper101"

export type NavItem = {
  icon: ReactNode
  label: string
  href: string
}

export function VerticalTooltipNavbar() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState("#home")
  const [sectionTheme, setSectionTheme] = React.useState<"light" | "dark">("light")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            if (id) setActiveItem(`#${id}`)

            const themeAttr = entry.target.getAttribute("data-nav-theme") as "light" | "dark"
            if (themeAttr) {
              setSectionTheme(themeAttr)
            } else {
              const isFooter = entry.target.tagName.toLowerCase() === "footer"
              const isDarkBg =
                entry.target.classList.contains("bg-black") ||
                entry.target.classList.contains("bg-zinc-950") ||
                entry.target.classList.contains("bg-slate-950")

              if (isFooter || isDarkBg) {
                setSectionTheme("dark")
              } else {
                setSectionTheme("light")
              }
            }
          }
        })
      },
      { threshold: 0.2, rootMargin: "-20% 0px -70% 0px" }
    )

    const elements = document.querySelectorAll("section[id], [data-nav-theme], footer")
    elements.forEach((el) => sectionObserver.observe(el))

    return () => sectionObserver.disconnect()
  }, [mounted, pathname])

  const navItems: NavItem[] = React.useMemo(() => {
    if (pathname === "/ai") {
      return [
        { label: "Home", href: "#home", icon: <Home className="size-full" /> },
        { label: "Projects", href: "#projects", icon: <Rocket className="size-full" /> },
        { label: "Expertise", href: "#skills", icon: <Wrench className="size-full" /> },
        { label: "Certifications", href: "#certifications", icon: <Award className="size-full" /> },
        { label: "Contact", href: "#contact", icon: <Mail className="size-full" /> },
      ]
    }
    return [
      { label: "Home", href: "#home", icon: <Home className="size-full" /> },
      { label: "Experience", href: "#experience", icon: <Briefcase className="size-full" /> },
      { label: "Expertise", href: "#skills", icon: <Wrench className="size-full" /> },
      { label: "Certifications", href: "#certifications", icon: <Award className="size-full" /> },
      { label: "Contact", href: "#contact", icon: <Mail className="size-full" /> },
    ]
  }, [pathname])

  const isDarkBackground = mounted && (resolvedTheme === "dark" || sectionTheme === "dark")

  return (
    <>
      {/* Desktop: Vertical sidebar */}
      <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <VerticalNavTooltip
          items={navItems}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isDark={isDarkBackground}
          pathname={pathname}
        />
      </div>

      {/* Mobile: Bottom horizontal bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto pointer-events-none">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-4 px-4 py-3 rounded-full bg-background/80 backdrop-blur-lg border shadow-lg"
        >
          <Link
            href="/"
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[40px] min-h-[40px] transition-colors",
              isDarkBackground ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <HubIcon className="size-5 md:size-7 lg:size-8" />
          </Link>

          {navItems.map((item) => {
            const isActive = activeItem === item.href
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[40px] min-h-[40px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="size-5 md:size-7 lg:size-8">{item.icon}</span>
              </a>
            )
          })}

          <div className="flex items-center gap-2 pl-2 border-l">
            <ThemeToggleButton className="size-5 md:size-7 lg:size-8 p-1 md:p-1.5 lg:p-1.5 bg-background/80 backdrop-blur-sm border" />
          </div>
        </motion.nav>
      </div>
    </>
  )
}

interface VerticalNavTooltipProps {
  items: NavItem[]
  activeItem: string
  setActiveItem: (href: string) => void
  isDark: boolean
  pathname: string
}

function VerticalNavTooltip({
  items,
  activeItem,
  setActiveItem,
  isDark,
  pathname,
}: VerticalNavTooltipProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-background/80 backdrop-blur-lg border p-2 shadow-lg">
      {/* Hub link */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/"
            className={cn(
              "flex items-center justify-center rounded-full transition-colors hover:bg-accent",
              isDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className="flex size-5 md:size-7 lg:size-8 items-center justify-center p-1 md:p-1.5 lg:p-1.5">
              <HubIcon className="size-full" />
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">Home</TooltipContent>
      </Tooltip>

      <div className="w-6 h-px bg-border" />

      {items.map((item) => {
        const isActive = activeItem === item.href
        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setActiveItem(item.href)
                  const el = document.querySelector(item.href)
                  el?.scrollIntoView({ behavior: "smooth" })
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent",
                  isActive
                    ? isDark ? "text-white" : "text-primary"
                    : isDark ? "text-white/40 hover:text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex size-5 md:size-7 lg:size-8 items-center justify-center p-1 md:p-1.5 lg:p-1.5">
                  {item.icon}
                </div>
                <span className="sr-only">{item.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        )
      })}

      <div className="w-6 h-px bg-border" />

      <div className="flex flex-col items-center gap-2 pt-1">
        <ColorSelector defaultValue="default" className="opacity-40 hover:opacity-100 transition-opacity" />
        <ThemeToggleButton className="size-5 md:size-7 lg:size-8 p-1 md:p-1.5 lg:p-1.5 bg-background/80 backdrop-blur-sm border" />
      </div>
    </div>
  )
}
