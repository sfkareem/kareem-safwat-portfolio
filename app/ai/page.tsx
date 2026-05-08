"use client";

import { VerticalTooltipNavbar } from "@/components/ui/vertical-tooltip-navbar";
import { AIHero } from "@/components/AIHero";
import { FeaturedProjects } from "@/components/FeaturedProjects";
import { SkillsSection } from "@/components/SkillsSection";
import { FAQSection } from "@/components/FAQSection";
import { TerminalShowcase } from "@/components/TerminalShowcase";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ContactSection } from "@/components/ContactSection";
import { FloatingFooter } from "@/components/ui/floating-footer";
import { useState, useEffect } from "react";

export default function AIPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-background">
      <VerticalTooltipNavbar />
      
      <div className="w-full transition-all duration-300">
        <section id="home" className="w-full">
          <AIHero />
        </section>
        
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-24 lg:px-32 py-12 space-y-24 md:space-y-32">
          <FeaturedProjects />

          <TerminalShowcase />

          <SkillsSection category="ai" />
          <CertificationsSection category="ai" isLoading={isLoading} />

          <FAQSection category="ai" />
        </div>
        <ContactSection />
        <FloatingFooter />
      </div>
    </main>
  );
}
