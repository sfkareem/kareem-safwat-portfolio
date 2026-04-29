"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";
import { ExternalLink, Award } from "lucide-react";

export default function Certifications() {
  const { certifications } = portfolioData;

  return (
    <section id="certifications" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16 text-center md:text-left">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Certifications</h2>
          <p className="text-lg text-zinc-600">Continuous learning and professional development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all group flex flex-col h-full"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-zinc-700" />
                </div>
                <div className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                  {cert.issueDate}
                </div>
              </div>
              
              <h3 className="font-display text-lg font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
                {cert.name}
              </h3>
              <div className="text-sm font-medium text-zinc-600 mb-3">{cert.issuer}</div>
              
              <p className="text-sm text-zinc-500 mb-6 flex-grow">
                {cert.description}
              </p>
              
              <a 
                href={cert.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors mt-auto"
              >
                View Credential <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
