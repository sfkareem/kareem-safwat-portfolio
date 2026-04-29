"use client";

import FloatingNav from "@/components/ui/floating-nav";
import { GlowyWavesHero } from "@/components/ui/glowy-waves-hero-shadcnui";
import { MergedHero } from "@/components/MergedHero";
import { Timeline } from "@/components/ui/timeline";
import { SkillsSection } from "@/components/SkillsSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ContactSection } from "@/components/ContactSection";
import { FloatingFooter } from "@/components/ui/floating-footer";
import portfolioData from "@/data/portfolio.json";
import "@/lib/firebase";
import { useState, useEffect } from "react";

export default function CivilPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const timelineData = portfolioData.experience.map((exp, index) => ({
    id: index,
    title: `${exp.startDate} - ${exp.endDate}`,
    company: exp.company,
    location: exp.location,
    description: exp.title,
    src: exp.logo || `https://picsum.photos/seed/exp-${index}/800/600`,
    logoBg: exp.logoBg || "bg-white",
    content: (
      <div className="space-y-2 text-center md:text-left">
        <p className="text-sm font-medium text-muted-foreground">{exp.location}</p>
        <ul className="list-disc list-inside text-sm text-muted-foreground/80">
          {exp.responsibilities.slice(0, 2).map((resp, i) => (
            <li key={i} className="line-clamp-1">{resp}</li>
          ))}
        </ul>
      </div>
    ),
    expandedContent: (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-medium">
          <span>{exp.location}</span>
          <span>•</span>
          <span>{exp.startDate} - {exp.endDate}</span>
        </div>
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-foreground">Key Responsibilities</h4>
          <ul className="space-y-3">
            {exp.responsibilities.map((resp, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  }));

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-background">
      <FloatingNav />

      <div className="w-full transition-all duration-300">
        <section id="home">
          <GlowyWavesHero>
            <MergedHero />
          </GlowyWavesHero>
        </section>
        
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-24 lg:px-32 py-12 space-y-24 md:space-y-32">
          <section id="experience" className="timeline-section pt-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 md:mb-20 tracking-tighter text-center md:text-left">Experiences</h2>
            <Timeline data={timelineData} isLoading={isLoading} />
          </section>

          <SkillsSection category="civil" />

          <CertificationsSection category="civil" isLoading={isLoading} />
        </div>
        <ContactSection />
        <FloatingFooter />
      </div>
    </main>
  );
}
