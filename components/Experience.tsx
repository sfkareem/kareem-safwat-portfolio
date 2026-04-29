"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";
import { Calendar, MapPin } from "lucide-react";

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-16 text-center md:text-left">
          <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-zinc-900 mb-4">Professional Experience</h2>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-zinc-600">A track record of delivering value and managing costs across major construction projects.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {experience.map((job, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-0"
              >
                {/* Timeline line for desktop */}
                <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-zinc-200 -translate-x-1/2"></div>
                
                <div className={`md:flex items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-zinc-900 border-4 border-zinc-50 -translate-x-[5px] md:-translate-x-1/2 mt-1.5 md:mt-0 z-10"></div>
                  
                  {/* Content */}
                  <div className="md:w-[45%]">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="font-display text-[clamp(1.1rem,2vw,1.25rem)] font-bold text-zinc-900">{job.title}</h3>
                        {job.isCurrent && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-[clamp(1rem,1.5vw,1.125rem)] font-medium text-zinc-700 mb-4">{job.company}</div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{job.startDate} — {job.endDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {job.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-zinc-600 text-sm flex items-start gap-2">
                            <span className="text-zinc-400 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Empty space for the other side of the timeline on desktop */}
                  <div className="hidden md:block md:w-[45%]"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
