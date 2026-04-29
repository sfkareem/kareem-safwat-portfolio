"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Download, Mail, MapPin } from "lucide-react";
import portfolioData from "@/data/portfolio.json";

export default function Hero() {
  const { personal, statistics } = portfolioData;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl flex flex-col items-center text-center lg:items-start lg:text-left mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {portfolioData.availability.status}
            </div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              {personal.name}
              <span className="block text-muted-foreground mt-2">{personal.title}</span>
            </h1>
            <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-muted-foreground mb-8 leading-relaxed">
              {personal.tagline}. {personal.professionalStatement}
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Get in touch
              </a>
              <a
                href={personal.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-background text-foreground font-medium border border-border hover:border-muted-foreground hover:bg-accent transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" />
                Download Resume
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-border w-full">
              <div>
                <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-display font-bold text-foreground">{statistics.yearsOfExperience}</div>
                <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-muted-foreground mt-1">Years Experience</div>
              </div>
              <div>
                <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-display font-bold text-foreground">{statistics.projectsValue}</div>
                <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-muted-foreground mt-1">Projects Value</div>
              </div>
              <div>
                <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-display font-bold text-foreground">{statistics.bidSuccessRate}</div>
                <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-muted-foreground mt-1">Bid Success Rate</div>
              </div>
              <div>
                <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-display font-bold text-foreground">{statistics.costReduction}</div>
                <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-muted-foreground mt-1">Cost Reduction</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={personal.profileImage}
                alt={personal.name}
                fill
                className="object-cover object-top"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10 rounded-2xl"></div>
            </div>
            
            {/* Floating badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-background p-4 rounded-xl shadow-xl border border-border flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground font-medium">Currently based in</div>
                <div className="text-foreground font-bold">Riyadh, KSA</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
