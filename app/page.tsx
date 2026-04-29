"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, HardHat, Code2, QrCode } from "lucide-react";
import { GlowyWavesHero } from "@/components/ui/glowy-waves-hero-shadcnui";
import { FloatingFooter } from "@/components/ui/floating-footer";
import { QRShare } from "@/components/ui/qr-share";
import "@/lib/firebase"; // Initialize Firebase and Analytics

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <GlowyWavesHero>
        <div className="z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 mb-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground">
              Kareem Safwat
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Select a portfolio to explore my expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
            {/* Civil Path */}
            <Link href="/civil" className="group relative">
              <div
                className="h-full p-8 md:p-12 transition-all duration-300 flex flex-col items-center text-center gap-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <HardHat className="w-10 h-10" />
                </div>
                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Civil Engineering</h2>
                  <p className="text-muted-foreground">
                    Senior Quantity Surveyor, Cost Estimation, and Tendering.
                  </p>
                </div>
                <div className="mt-auto pt-6 flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all relative z-10">
                  View Portfolio <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>

            {/* AI Path */}
            <Link href="/ai" className="group relative">
              <div
                className="h-full p-8 md:p-12 transition-all duration-300 flex flex-col items-center text-center gap-6 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-20 w-20 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500">
                  <Code2 className="w-10 h-10" />
                </div>
                <div className="space-y-3 relative z-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">AI Vibe Coder</h2>
                  <p className="text-muted-foreground">
                    Full Stack Web Apps, Agentic Software Development, and AI Workflows.
                  </p>
                </div>
                <div className="mt-auto pt-6 flex items-center gap-2 text-secondary font-semibold group-hover:gap-4 transition-all relative z-10">
                  View Portfolio <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          </div>

          {/* QR Code Section — moved to /businesscard page for cleaner hub */}
          {baseUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12 text-center"
            >
              <a 
                href={`${baseUrl}/businesscard`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                View digital business card
              </a>
            </motion.div>
          )}
        </div>
      </GlowyWavesHero>
      <FloatingFooter />
    </main>
  );
}
