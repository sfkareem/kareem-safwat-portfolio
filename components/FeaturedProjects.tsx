"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const PROJECT = {
  name: "Controls Academy",
  url: "https://controlsacademy.net/",
  logo: "https://controlsacademy.net/logo.png",
  description: "A comprehensive educational platform built from the ground up, featuring AI-powered workflows and automated technical training systems."
};

export function FeaturedProjects() {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Magnetic pull values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the magnetic effect
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Apply a "magnetic" pull (limited range)
    // We only move the logo slightly (max 20px)
    mouseX.set(distanceX * 0.2);
    mouseY.set(distanceY * 0.2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(2rem,6vw,3.75rem)] font-bold tracking-tighter mb-6 leading-[1.1]"
            >
              Featured <span className="text-primary">Projects</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(1rem,2vw,1.125rem)] text-muted-foreground leading-relaxed"
            >
              Showcasing high-impact applications built using AI Vibe Coding and Agentic Software Development.
            </motion.p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group cursor-pointer p-12"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <motion.div
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.5, filter: "grayscale(100%) blur(10px)" }}
              whileInView={{ 
                opacity: 1, 
                scale: 1, 
                filter: "grayscale(100%) blur(0px)",
                transition: { 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 10,
                  delay: 0.2 
                } 
              }}
              whileHover={{ 
                filter: "grayscale(0%) blur(0px)",
                scale: 1.05,
                transition: { duration: 0.4 }
              }}
              viewport={{ once: true }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 transition-all duration-500">
                <Image
                  src={PROJECT.logo}
                  alt={PROJECT.name}
                  fill
                  className="object-contain drop-shadow-sm group-hover:drop-shadow-2xl transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center max-w-sm"
              >
                <h3 className="text-[clamp(1.1rem,2vw,1.25rem)] font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                  {PROJECT.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {PROJECT.description}
                </p>
                <a
                  href={PROJECT.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  View Live Project <ExternalLink size={14} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.1)_0%,transparent_70%)]" />
      </div>
    </section>
  );
}
