"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight, Linkedin, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import portfolioData from "@/data/portfolio.json";

type Highlight = { title: string; description: string; };

const highlights: Highlight[] = [
  { title: "Experience", description: `${portfolioData.statistics.yearsOfExperience} Years of Professional Experience` },
  { title: "Project Value", description: `${portfolioData.statistics.projectsValue} in Managed Projects Value` },
  { title: "Bid Success", description: `${portfolioData.statistics.bidSuccessRate} Average Bid Success Rate` },
  { title: "Cost Savings", description: `${portfolioData.statistics.costReduction} Average Project Cost Reduction` },
];

export function MergedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["precise", "efficient", "strategic", "cost-effective", "impactful"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full py-6 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-8 text-center md:text-left z-10 order-2 md:order-1">
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[clamp(1.75rem,5vw,3.75rem)] font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Kareem Safwat, <br />
              <span className="text-primary">Senior Quantity Surveyor</span>
            </motion.h1>
            
            <div className="flex flex-col gap-3">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[clamp(0.6rem,1.5vw,1rem)] font-medium text-primary uppercase tracking-[0.3em]"
              >
                {portfolioData.personal.tagline}
              </motion.p>
              
              <h2 className="text-[clamp(1.1rem,2.5vw,1.875rem)] tracking-tight font-regular flex flex-wrap items-center justify-center md:justify-start gap-x-3">
                <span className="text-foreground/80">Delivering projects that are</span>
                <span className="relative inline-flex h-[1.2em] overflow-hidden">
                  {/* Ghost element to set container width to the longest title */}
                  <span className="invisible font-semibold whitespace-nowrap">
                    {titles.reduce((a, b) => a.length > b.length ? a : b)}
                  </span>
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute left-0 top-0 font-semibold text-primary whitespace-nowrap"
                      initial={{ opacity: 0, y: "-100%" }}
                      transition={{ type: "spring", stiffness: 50 }}
                      animate={
                        titleNumber === index
                          ? {
                              y: 0,
                              opacity: 1,
                            }
                          : {
                              y: titleNumber > index ? "-150%" : "150%",
                              opacity: 0,
                            }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-2xl mx-auto md:mx-0 text-[clamp(0.9rem,2vw,1.25rem)] leading-relaxed text-foreground/70"
            >
              {portfolioData.personal.professionalStatement}
            </motion.p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto md:mx-0">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + (0.1 * index) }}
                className="relative space-y-1 text-center md:text-left"
              >
                <p className="text-[clamp(0.55rem,1vw,0.7rem)] font-semibold uppercase tracking-[0.25em] text-foreground/40">
                  {item.title}
                </p>
                <p className="text-[clamp(0.8rem,1.5vw,1rem)] font-medium leading-relaxed text-foreground/90">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6"
          >
            <Button
              size="lg"
              onClick={() => window.open(portfolioData.personal.contact.linkedin, "_blank")}
              className="h-12 sm:h-14 gap-3 rounded-full px-8 sm:px-10 text-xs sm:text-sm uppercase tracking-[0.25em]"
            >
              Connect on LinkedIn
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open(portfolioData.personal.resume, "_blank")}
              className="h-12 sm:h-14 gap-3 rounded-full px-8 sm:px-10 text-xs sm:text-sm uppercase tracking-[0.25em]"
            >
              View Resume
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative aspect-[4/5] w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] mx-auto md:ml-auto overflow-hidden rounded-3xl shadow-2xl z-10 order-1 md:order-2"
        >
          <Image
            src={portfolioData.personal.profileImage}
            alt={portfolioData.personal.name}
            fill
            className="object-cover object-top"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
