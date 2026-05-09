"use client"

import { motion, AnimatePresence } from "motion/react"
import { useRef, useState, type ReactNode } from "react"
import { Home, Briefcase, Wrench, Award, Mail, Rocket, CommandIcon } from "lucide-react"
import { ColorSelector } from "./color-selector"
import { AnimatedThemeToggleButton } from "./animated-theme-toggle-button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { HubIcon } from "./hub-icon"
import * as React from "react"

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
            <HubIcon className="size-5" />
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
                <span className="size-5">{item.icon}</span>
              </a>
            )
          })}

          <div className="flex items-center gap-2 pl-2 border-l">
            <AnimatedThemeToggleButton className="size-9 opacity-60 hover:opacity-100 transition-opacity" />
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [coords, setCoords] = useState({ clipPath: "", translateY: 0 })

  const measureRefs = useRef<(HTMLDivElement | null)[]>([])
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const [isEntering, setIsEntering] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipDelay = 300

  const calculatePosition = (index: number) => {
    const activeLabel = measureRefs.current[index]
    const activeIcon = buttonRefs.current[index]

    if (!activeLabel || !activeIcon) return null

    const labelTop = activeLabel.offsetTop
    const labelHeight = activeLabel.offsetHeight
    const labelCenter = labelTop + labelHeight / 2

    const iconTop = activeIcon.offsetTop
    const iconHeight = activeIcon.offsetHeight
    const iconCenter = iconTop + iconHeight / 2

    const totalHeight = measureRefs.current.reduce(
      (acc, el) => acc + (el?.offsetHeight || 0),
      0
    )

    const cTop = (labelTop / totalHeight) * 100
    const cBottom = 100 - ((labelTop + labelHeight) / totalHeight) * 100

    return {
      clipPath: `inset(${cTop}% 0 ${cBottom}% 0 round 8px)`,
      translateY: iconCenter - labelCenter,
    }
  }

  const handleMouseEnter = (index: number) => {
    const newCoords = calculatePosition(index)
    if (!newCoords) return

    if (activeIndex === null) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsEntering(true)

      timeoutRef.current = setTimeout(() => {
        setCoords(newCoords)
        setActiveIndex(index)
      }, tooltipDelay)
    } else {
      setCoords(newCoords)
      setActiveIndex(index)
    }
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveIndex(null)
    setCoords({ clipPath: "", translateY: 0 })
    setIsEntering(true)
  }

  return (
    <div className="relative" onMouseLeave={handleMouseLeave}>
      <AnimatePresence>
        {activeIndex !== null && coords.clipPath !== "" && (
          <motion.div
            className="absolute top-0 left-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={cn(
                "rounded-lg",
                isDark ? "bg-neutral-800" : "bg-foreground"
              )}
              animate={{
                clipPath: coords.clipPath,
                y: coords.translateY,
              }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: isEntering ? 0 : 0.4,
              }}
              onUpdate={() => {
                if (isEntering) setIsEntering(false)
              }}
            >
              <div className="flex flex-col items-start justify-center">
                {items.map((item, index) => (
                  <div
                    key={`real-${index}`}
                    className="flex h-10 items-center justify-center gap-3 px-4 text-sm font-medium whitespace-nowrap"
                  >
                    <span className={isDark ? "text-white" : "text-primary-foreground"}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-0.5 text-white/40">
                      <span className="flex items-center justify-center rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] tabular-nums">
                        ⌘{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 flex flex-col items-center justify-center gap-1 rounded-2xl bg-background/80 backdrop-blur-lg border p-2 shadow-lg">
        {/* Hub link */}
        <Link
          href="/"
          className={cn(
            "flex items-center justify-center rounded-full transition-colors hover:bg-accent",
            isDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="flex size-10 items-center justify-center p-2">
            <HubIcon className="size-full" />
          </div>
        </Link>

        <div className="w-6 h-px bg-border" />

        {items.map((item, index) => {
          const isActive = activeItem === item.href
          return (
            <button
              key={item.href}
              onMouseEnter={() => handleMouseEnter(index)}
              ref={(el) => { buttonRefs.current[index] = el }}
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
              <div className="flex size-10 items-center justify-center p-2">
                {item.icon}
              </div>
              <span className="sr-only">{item.label}</span>
            </button>
          )
        })}

        <div className="w-6 h-px bg-border" />

        <div className="flex flex-col items-center gap-2 pt-1">
          <ColorSelector defaultValue="default" className="opacity-40 hover:opacity-100 transition-opacity scale-75" />
          <AnimatedThemeToggleButton className="opacity-40 hover:opacity-100 transition-opacity scale-75" />
        </div>
      </div>

      {/* Measurement layer (hidden) */}
      <div className="pointer-events-none absolute top-0 left-0 flex flex-col overflow-hidden whitespace-nowrap opacity-0">
        {items.map((item, index) => (
          <div
            key={`measure-${index}`}
            ref={(el) => { measureRefs.current[index] = el }}
            className="flex h-10 items-center justify-center gap-3 px-4 text-sm font-medium whitespace-nowrap"
          >
            <span>{item.label}</span>
            <div className="flex items-center gap-0.5 text-white/40">
              <span className="flex items-center justify-center rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] tabular-nums">
                ⌘{index + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
