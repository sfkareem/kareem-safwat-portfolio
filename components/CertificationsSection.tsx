"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { 
  Award, 
  ExternalLink, 
  Calendar, 
  Clock, 
  User, 
  ChevronRight 
} from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import { Skeleton } from "@/components/ui/skeleton";

interface CertificationsSectionProps {
  category?: "civil" | "ai" | "all";
  isLoading?: boolean;
}

export function CertificationsSection({ category = "all", isLoading = false }: CertificationsSectionProps) {
  const certs = portfolioData.certifications.filter(
    (c) => category === "all" || c.category === category
  );

  if (!isLoading && certs.length === 0) return null;

  return (
    <section id="certifications" className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(2rem,6vw,3.75rem)] font-bold tracking-tighter mb-6 leading-[1.1]"
            >
              Licenses & <span className="text-primary">Certifications</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(1rem,2vw,1.125rem)] text-muted-foreground leading-relaxed"
            >
              Continuous professional development through specialized training and industry-recognized 
              certifications to maintain the highest standards of expertise.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-background shadow-lg p-8 rounded-2xl space-y-6">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-20 w-full" />
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            ))
          ) : (
            certs.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-muted rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative h-full bg-background shadow-lg p-8 rounded-2xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    {cert.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center relative">
                        <Image 
                          src={cert.image} 
                          alt={`${cert.name} - ${cert.issuer}`} 
                          fill
                          className="object-cover" 
                          title={`${cert.name} issued by ${cert.issuer}`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 py-1 bg-muted rounded-full">
                      {cert.issuer}
                    </span>
                  </div>
                  
                  <h3 className="text-[clamp(1.1rem,2vw,1.25rem)] font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                    {cert.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                    {cert.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {cert.issueDate}
                    </div>
                    {cert.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {cert.duration}
                      </div>
                    )}
                  </div>
                  
                  <a 
                    href={cert.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                  >
                    View Credential
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          )))}
        </div>
      </div>
    </section>
  );
}
