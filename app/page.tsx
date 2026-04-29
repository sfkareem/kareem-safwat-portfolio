"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, HardHat, Code2 } from "lucide-react";
import { GlowyWavesHero } from "@/components/ui/glowy-waves-hero-shadcnui";
import { FloatingFooter } from "@/components/ui/floating-footer";
import { QRShare } from "@/components/ui/qr-share";
import { StatsSection } from "@/components/ui/stats-section";
import { TrustedBySection } from "@/components/ui/trusted-by-section";
import { StickyCTA } from "@/components/ui/sticky-cta";
import { TypingEffect } from "@/components/ui/typing-effect";
import "@/lib/firebase"; // Initialize Firebase and Analytics

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <GlowyWavesHero>
        <div className="z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Kareem Safwat
            </h1>
            <div className="h-8 flex items-center justify-center">
              <TypingEffect
                texts={[
                  "Select a portfolio to explore my expertise.",
                  "9+ Years in Construction & AI Development",
                  "$1B+ in Projects Delivered Successfully",
                ]}
                typingSpeed={80}
                deletingSpeed={40}
                pauseDuration={2500}
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Civil Path */}
            <Link href="/civil" className="group relative">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full p-8 md:p-12 transition-all duration-300 flex flex-col items-center text-center gap-6 overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative z-10"
                >
                  <HardHat className="w-10 h-10" />
                </motion.div>
                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Civil Engineering</h2>
                  <p className="text-muted-foreground">
                    Senior Quantity Surveyor, Cost Estimation, and Tendering.
                  </p>
                </div>
                <motion.div
                  className="mt-auto pt-6 flex items-center gap-2 text-primary font-semibold relative z-10"
                  whileHover={{ gap: 12 }}
                >
                  View Portfolio <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>

            {/* AI Path */}
            <Link href="/ai" className="group relative">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full p-8 md:p-12 transition-all duration-300 flex flex-col items-center text-center gap-6 overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-secondary/50 hover:bg-card/80 hover:shadow-xl hover:shadow-secondary/5"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="h-20 w-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary relative z-10"
                >
                  <Code2 className="w-10 h-10" />
                </motion.div>
                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">AI Vibe Coder</h2>
                  <p className="text-muted-foreground">
                    Full Stack Web Apps, Agentic Software Development, and AI Workflows.
                  </p>
                </div>
                <motion.div
                  className="mt-auto pt-6 flex items-center gap-2 text-secondary font-semibold relative z-10"
                  whileHover={{ gap: 12 }}
                >
                  View Portfolio <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </Link>
          </div>

          {/* QR Code Section */}
          {baseUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-16 flex flex-col items-center gap-4 w-full max-w-sm"
            >
              <QRShare url={`${baseUrl}/businesscard`} />
            </motion.div>
          )}
        </div>
      </GlowyWavesHero>

      {/* Stats Section */}
      <StatsSection />

      {/* Trusted By Section */}
      <TrustedBySection />

      <FloatingFooter />
      <StickyCTA />
    </main>
  );
}
