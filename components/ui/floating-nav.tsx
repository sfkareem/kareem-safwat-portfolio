"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ColorSelector } from "./color-selector";
import { AnimatedThemeToggleButton } from "./animated-theme-toggle-button";
import { cn } from "@/lib/utils";
import portfolioData from "@/data/portfolio.json";
import { 
  Home, 
  Briefcase, 
  Wrench, 
  Award, 
  Mail,
  Rocket
} from "lucide-react";
import { HubIcon } from "./hub-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

export default function FloatingNav() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [activeItem, setActiveItem] = React.useState("#home");
  const [isHovered, setIsHovered] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [sectionTheme, setSectionTheme] = React.useState<"light" | "dark">("light");
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use IntersectionObserver to detect active section and theme
  React.useEffect(() => {
    if (!mounted) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              setActiveItem(`#${id}`);
            }
            
            // Theme detection based on section
            const themeAttr = entry.target.getAttribute("data-nav-theme") as "light" | "dark";
            if (themeAttr) {
              setSectionTheme(themeAttr);
            } else {
              const isFooter = entry.target.tagName.toLowerCase() === "footer";
              const isDarkBg = entry.target.classList.contains("bg-black") || 
                               entry.target.classList.contains("bg-zinc-950") ||
                               entry.target.classList.contains("bg-slate-950");
              
              if (isFooter || isDarkBg) {
                setSectionTheme("dark");
              } else {
                setSectionTheme("light");
              }
            }
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: "-20% 0px -70% 0px" 
      }
    );

    const scrollHandler = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const elements = document.querySelectorAll("section[id], [data-nav-theme], footer");
    elements.forEach((el) => sectionObserver.observe(el));
    window.addEventListener("scroll", scrollHandler);

    return () => {
      sectionObserver.disconnect();
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [mounted, pathname]);

  const navItems = React.useMemo(() => {
    if (pathname === "/ai") {
      return [
        { label: "Home", href: "#home", icon: Home },
        { label: "Projects", href: "#projects", icon: Rocket },
        { label: "Expertise", href: "#skills", icon: Wrench },
        { label: "Certifications", href: "#certifications", icon: Award },
        { label: "Contact", href: "#contact", icon: Mail },
      ];
    }
    return [
      { label: "Home", href: "#home", icon: Home },
      { label: "Experience", href: "#experience", icon: Briefcase },
      { label: "Expertise", href: "#skills", icon: Wrench },
      { label: "Certifications", href: "#certifications", icon: Award },
      { label: "Contact", href: "#contact", icon: Mail },
    ];
  }, [pathname]);

  const isDarkBackground = mounted && (resolvedTheme === "dark" || sectionTheme === "dark");

  const getNavColorClasses = (isActive: boolean) => {
    if (!mounted) return "";
    if (isActive) return "text-primary-foreground";
    return isDarkBackground 
      ? "text-white/60 hover:text-white hover:bg-white/10" 
      : "text-foreground/60 hover:text-foreground hover:bg-foreground/10";
  };

  return (
    <>
      {/* Desktop Top Navbar */}
      <div className="hidden md:flex fixed top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center gap-6 transition-all duration-500 bg-transparent"
        >
          <Link
            href="/"
            onMouseEnter={() => setIsHovered("hub")}
            onMouseLeave={() => setIsHovered(null)}
            className={cn(
              "relative flex items-center gap-2 transition-all duration-500",
              isDarkBackground ? "text-white/40 hover:text-white" : "text-foreground/40 hover:text-foreground"
            )}
          >
            <HubIcon className="w-4 h-4" />
            <AnimatePresence>
              {isHovered === "hub" && (
                <motion.span
                  initial={{ opacity: 0, x: -5, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -5, width: 0 }}
                  className="text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap overflow-hidden"
                >
                  Hub
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {navItems.map((item) => {
            const isActive = activeItem === item.href;
            const Icon = item.icon;
            const isThisHovered = isHovered === item.href;
            
            return (
              <a
                key={item.href}
                href={item.href}
                onMouseEnter={() => setIsHovered(item.href)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => setActiveItem(item.href)}
                className={cn(
                  "relative flex items-center gap-2 transition-all duration-500",
                  isActive 
                    ? (isDarkBackground ? "text-white" : "text-foreground")
                    : (isDarkBackground ? "text-white/40 hover:text-white" : "text-foreground/40 hover:text-foreground")
                )}
              >
                <Icon className="w-4 h-4" />
                <AnimatePresence>
                  {(isThisHovered || isActive) && (
                    <motion.span
                      initial={{ opacity: 0, x: -5, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: "auto" }}
                      exit={{ opacity: 0, x: -5, width: 0 }}
                      className="text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="active-underline"
                    className={cn("absolute -bottom-1.5 left-0 right-0 h-[1.5px]", isDarkBackground ? "bg-white" : "bg-foreground")}
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
              </a>
            );
          })}

          <div className="flex items-center gap-4 ml-2">
            <ColorSelector defaultValue="default" className="opacity-40 hover:opacity-100 transition-opacity scale-90" />
            <AnimatedThemeToggleButton className="opacity-40 hover:opacity-100 transition-opacity scale-90" />
          </div>
        </motion.nav>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] pointer-events-none">
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex items-center justify-between px-6 py-4 w-full transition-all duration-500 bg-transparent"
        >
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className={cn(
                "relative flex flex-col items-center gap-1 transition-all duration-500",
                isDarkBackground ? "text-white/50 hover:text-white" : "text-foreground/50 hover:text-foreground"
              )}
            >
              <HubIcon className="w-5 h-5" />
              <span className="text-[8px] uppercase tracking-widest font-bold">Hub</span>
            </Link>

            {navItems.map((item) => {
              const isActive = activeItem === item.href;
              const Icon = item.icon;
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveItem(item.href)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 transition-all duration-500",
                    isActive 
                      ? (isDarkBackground ? "text-white" : "text-primary")
                      : (isDarkBackground ? "text-white/50 hover:text-white" : "text-foreground/50 hover:text-foreground")
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="text-[8px] uppercase tracking-widest font-bold">{item.label}</span>
                  )}
                </a>
              );
            })}
          </div>
          
          <div className="flex items-center gap-4">
            <ColorSelector defaultValue="default" className="scale-90" />
            <AnimatedThemeToggleButton className="scale-90" />
          </div>
        </motion.nav>
      </div>
    </>
  );
}
