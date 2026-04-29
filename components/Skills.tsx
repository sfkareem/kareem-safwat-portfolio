"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";
import { CheckCircle2 } from "lucide-react";

export default function Skills() {
  const expertise = portfolioData.expertise.civil;

  return (
    <section id="skills" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Expertise & Skills</h2>
          <p className="text-lg text-zinc-600">Comprehensive toolkit for modern quantity surveying and cost management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Technical Skills */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100"
          >
            <h3 className="font-display text-2xl font-bold text-zinc-900 mb-6">Technical Skills</h3>
            <ul className="space-y-4">
              {expertise.technicalSkills.map((skill, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 font-medium">{skill}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tools & Software */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl"
          >
            <h3 className="font-display text-2xl font-bold mb-6">Tools & Software</h3>
            <div className="flex flex-wrap gap-3">
              {expertise.tools.map((tool, index) => (
                <span 
                  key={index} 
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium backdrop-blur-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Specializations */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100"
          >
            <h3 className="font-display text-2xl font-bold text-zinc-900 mb-6">Specializations</h3>
            <ul className="space-y-4">
              {expertise.specializations.map((spec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0 mt-0.5" />
                  <span className="text-zinc-700 font-medium">{spec}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
