"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";

export function FloatingFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 items-center px-4 py-2 pointer-events-auto"
      >
        <p className="text-left text-[10px] md:text-xs text-muted-foreground/50 hidden md:block">{portfolioData.metadata.copyright}</p>
        <p className="text-center text-[10px] md:text-xs text-muted-foreground/50">Designed & Developed by {portfolioData.metadata.designedAndDevelopedBy}</p>
      </motion.div>
    </div>
  );
}
