"use client";
import { motion } from "motion/react";
import React from "react";

export const GlowingEffect = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-background rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};
