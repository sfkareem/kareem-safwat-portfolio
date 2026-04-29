"use client";

import { motion } from "motion/react";
import { 
  Terminal, 
  Cpu, 
  Database, 
  Layout, 
  Settings, 
  Shield, 
  BarChart, 
  Layers,
  CheckCircle2,
  Bot,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Blocks
} from "lucide-react";
import portfolioData from "@/data/portfolio.json";

const iconMap: Record<string, any> = {
  // Civil Tools
  "CCS Candy": Terminal,
  "BidBow": Cpu,
  "PlanSwift": Layout,
  "Power BI": BarChart,
  "AutoCAD": Settings,
  "Revit / BIM": Layers,
  "MS Office 365": Database,
  "Primavera P6": Shield,
  
  // AI Tools
  "Claude Code": Bot,
  "Anthropic API": Code2,
  "Cursor": Sparkles,
  "AI Vibe Coding": Zap,
  "Agentic Software Development": Blocks,
  "Prompt Engineering": Terminal,
  "AI Workflow Automation": Cpu,
  "Full Stack Web Apps": Globe,
  "Scalable Full-Stack Applications": Database,
};

interface SkillsSectionProps {
  category?: "civil" | "ai";
}

export function SkillsSection({ category = "civil" }: SkillsSectionProps) {
  const expertise = portfolioData.expertise[category];
  
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8 text-center md:text-left">
          <div className="max-w-2xl mx-auto md:mx-0">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(2rem,6vw,3.75rem)] font-bold tracking-tighter mb-6 leading-[1.1]"
            >
              Tools & <span className="text-primary">Expertise</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[clamp(1rem,2vw,1.125rem)] text-muted-foreground leading-relaxed"
            >
              {category === "civil" 
                ? "Leveraging industry-leading software and deep technical knowledge to deliver precision-driven quantity surveying and cost management."
                : "Harnessing cutting-edge AI tools and agentic development frameworks to build intelligent, scalable software solutions."
              }
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Software Stack */}
          <div className="lg:col-span-5 space-y-6 flex flex-col items-center md:items-start">
            <h3 className="text-[clamp(1.1rem,2vw,1.25rem)] font-semibold mb-8 flex items-center justify-center md:justify-start gap-2 w-full">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              Software Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {expertise.tools.map((tool, index) => {
                const Icon = iconMap[tool] || Settings;
                return (
                  <motion.div
                    key={tool}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-4 rounded-2xl bg-background/50 shadow-md hover:bg-background hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="font-medium text-center sm:text-left">{tool}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="lg:col-span-7 flex flex-col items-center md:items-start">
            <h3 className="text-[clamp(1.1rem,2vw,1.25rem)] font-semibold mb-8 flex items-center justify-center md:justify-start gap-2 w-full">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              Technical Expertise
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {expertise.technicalSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group text-center sm:text-left"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                  <span className="text-[clamp(0.8rem,1.5vw,1rem)] text-muted-foreground group-hover:text-foreground transition-colors">
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
