"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";

export function FloatingFooter() {
  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-40 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col items-start text-[10px] md:text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors pointer-events-auto"
      >
        <p>{portfolioData.metadata.copyright}</p>
        <p>Designed & Developed by {portfolioData.metadata.designedAndDevelopedBy}</p>
      </motion.div>
    </div>
  );
}
