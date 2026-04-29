"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";
import { Briefcase, GraduationCap, Award } from "lucide-react";

export default function About() {
  const { personal, education } = portfolioData;

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-bold text-zinc-900 mb-4">About Me</h2>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-zinc-600">{personal.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6 mx-auto md:mx-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-display text-[clamp(1.1rem,2vw,1.25rem)] font-bold text-zinc-900 mb-2">Experience</h3>
            <p className="text-zinc-600">
              9+ years in quantity surveying, cost estimation, and tendering across Egypt and KSA.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6 mx-auto md:mx-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-display text-[clamp(1.1rem,2vw,1.25rem)] font-bold text-zinc-900 mb-2">Education</h3>
            <p className="text-zinc-600">
              {education[0].degree} in {education[0].field} from {education[0].institution}.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center md:items-start md:text-left"
          >
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6 mx-auto md:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-display text-[clamp(1.1rem,2vw,1.25rem)] font-bold text-zinc-900 mb-2">Professional</h3>
            <p className="text-zinc-600">
              RICS APC Candidate. Certified Cost Management Professional (CMP).
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
