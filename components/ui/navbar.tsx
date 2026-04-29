"use client";

import * as React from "react";
import { motion } from "motion/react";
import { ColorSelector } from "./color-selector";
import { AnimatedThemeToggleButton } from "./animated-theme-toggle-button";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full px-4 pointer-events-none">
      <motion.header
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          layout: { duration: 0.3 }
        }}
        className="pointer-events-auto flex items-center gap-4 rounded-full bg-background/60 p-2 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center gap-4 px-2">
          <a href="#" className="font-bold text-lg tracking-tighter hover:text-primary transition-colors whitespace-nowrap">
            Kareem<span className="text-primary">Safwat</span>
          </a>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-foreground/70">
            <a href="#about" className="hover:text-primary transition-colors whitespace-nowrap">About</a>
            <a href="#experience" className="hover:text-primary transition-colors whitespace-nowrap">Experience</a>
            <a href="#skills" className="hover:text-primary transition-colors whitespace-nowrap">Skills</a>
            <a href="#certifications" className="hover:text-primary transition-colors whitespace-nowrap">Certifications</a>
            <a href="#contact" className="hover:text-primary transition-colors whitespace-nowrap">Contact</a>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-foreground/5 rounded-full p-1">
          <ColorSelector 
            defaultValue="default"
            onToggle={setIsExpanded}
          />
          <div className="w-[1px] h-4 bg-border/50 mx-1" />
          <AnimatedThemeToggleButton />
        </div>
      </motion.header>
    </div>
  );
}
