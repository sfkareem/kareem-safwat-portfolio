"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { 
  FileText, 
  Search, 
  Calculator, 
  DollarSign, 
  FileEdit, 
  CheckCircle, 
  TrendingUp,
  ArrowRight
} from "lucide-react";

const phases = [
  {
    id: 1,
    title: "Tender Receipt & Initial Review",
    icon: <FileText className="w-6 h-6" />,
    description: "Receive ITT, verify completeness, and make Go/No-Go decision.",
    color: "bg-blue-500",
    subTasks: [
      "1.1 Tender Document Receipt",
      "1.2 Tender Document Control",
      "1.3 Initial Review & Go/No-Go Decision"
    ],
    details: {
      activities: ["Receive ITT", "Log tender", "Record deadlines", "Verify authority"],
      deliverables: ["Receipt Log", "Reference Number", "Calendar Entry"],
      decisions: ["Confirm authenticity", "Verify feasibility", "Go/No-Go"],
      context: "KSA: Etimad platform. Egypt: Law 182/2018. RICS: ITT, Employer, Tenderer."
    }
  },
  {
    id: 2,
    title: "Tender Preparation & Estimation",
    icon: <Calculator className="w-6 h-6" />,
    description: "Detailed review, QTO, market inquiries, and cost estimation.",
    color: "bg-purple-500",
    subTasks: [
      "2.1 Tender Kick-off & Strategy",
      "2.2 Quantity Take-off (QTO)",
      "2.3 Market Inquiries & Quotes",
      "2.4 Direct Cost Estimation",
      "2.5 Indirect Cost & Risk"
    ],
    details: {
      activities: ["Kick-off meeting", "Extract quantities", "Request quotes", "Estimate costs", "Assess risks"],
      deliverables: ["Strategy Document", "BoQ", "Quote Comparisons", "Cost Estimate"],
      decisions: ["Select subcontractors", "Determine risk contingencies"]
    }
  },
  {
    id: 3,
    title: "Tender Finalization & Submission",
    icon: <CheckCircle className="w-6 h-6" />,
    description: "Commercial review, compilation, approval, and submission.",
    color: "bg-orange-500",
    subTasks: [
      "3.1 Commercial Review & Mark-up",
      "3.2 Tender Document Compilation",
      "3.3 Final Approval & Sign-off",
      "3.4 Tender Submission"
    ],
    details: {
      activities: ["Review margins", "Compile documents", "Obtain signatures", "Submit tender"],
      deliverables: ["Final Pricing", "Completed Tender Package", "Submission Receipt"],
      decisions: ["Final mark-up percentage", "Management approval"]
    }
  },
  {
    id: 4,
    title: "Post-Tender Activities",
    icon: <TrendingUp className="w-6 h-6" />,
    description: "Clarifications, negotiation, and contract award.",
    color: "bg-emerald-500",
    subTasks: [
      "4.1 Tender Clarifications & Interviews",
      "4.2 Negotiation & Value Engineering",
      "4.3 Contract Award & Handover"
    ],
    details: {
      activities: ["Respond to queries", "Attend interviews", "Negotiate terms", "Handover to project team"],
      deliverables: ["Clarification Responses", "Revised Offer", "Contract Agreement", "Handover File"],
      decisions: ["Acceptance of terms", "Final contract value"]
    }
  },
];

export const TenderWorkflow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div className="py-20 w-full bg-neutral-50 dark:bg-neutral-950" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Tender Process Workflow
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A comprehensive, automated approach to tender management from initial receipt to post-tender analysis.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line Background */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2 rounded-full" />
          
          {/* Animated Connecting Line */}
          <motion.div 
            className="absolute left-[28px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 -translate-x-1/2 rounded-full origin-top"
            style={{ 
              height: "100%",
              scaleY: scrollYProgress 
            }}
          />

          <div className="space-y-12 md:space-y-24 relative">
            {phases.map((phase, index) => (
              <WorkflowNode 
                key={phase.id} 
                phase={phase} 
                index={index} 
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkflowNode = ({ 
  phase, 
  index,
  progress 
}: { 
  phase: any; 
  index: number;
  progress: any;
}) => {
  const isEven = index % 2 === 0;
  
  // Calculate when this node should animate in based on scroll
  const start = index * 0.1;
  const end = start + 0.1;
  
  const opacity = useTransform(progress, [start, end], [0.3, 1]);
  const scale = useTransform(progress, [start, end], [0.8, 1]);
  const xOffset = isEven ? 50 : -50;
  const x = useTransform(progress, [start, end], [xOffset, 0]);
  const y = useTransform(progress, [start, end], [20, 0]);

  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center relative ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      
      {/* Center Icon Node */}
      <motion.div 
        style={{ scale, opacity }}
        className="absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 z-10 flex items-center justify-center"
      >
        <div className={`w-14 h-14 rounded-2xl ${phase.color} text-white flex items-center justify-center shadow-lg shadow-${phase.color}/20 border-4 border-white dark:border-neutral-950`}>
          {phase.icon}
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div 
        style={{ 
          opacity,
          y
        }}
        className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}
      >
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 transition-colors">
          <div className={`flex items-center gap-3 mb-3 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
            <span className="text-sm font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Phase {phase.id}
            </span>
          </div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
            {phase.title}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            {phase.description}
          </p>
          
          <div className={`mt-4 space-y-4 ${isEven ? 'md:text-right' : 'text-left'}`}>
            {phase.subTasks && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">Key Steps</h4>
                <ul className="space-y-1">
                  {phase.subTasks.map((task: string, i: number) => (
                    <li key={i} className={`text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${phase.color} ${isEven ? 'md:order-last' : ''}`} />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {phase.details && (
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 ${isEven ? 'md:text-right' : 'text-left'}`}>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Activities</h4>
                  <ul className="space-y-1">
                    {phase.details.activities.map((act: string, i: number) => (
                      <li key={i} className={`text-xs text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                        <ArrowRight className={`w-3 h-3 mt-0.5 shrink-0 ${isEven ? 'md:order-last md:rotate-180' : ''}`} />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Deliverables</h4>
                  <ul className="space-y-1">
                    {phase.details.deliverables.map((del: string, i: number) => (
                      <li key={i} className={`text-xs text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5 ${isEven ? 'md:justify-end' : 'justify-start'}`}>
                        <CheckCircle className={`w-3 h-3 mt-0.5 shrink-0 text-emerald-500 ${isEven ? 'md:order-last' : ''}`} />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {phase.details && phase.details.context && (
              <div className={`pt-4 border-t border-neutral-100 dark:border-neutral-800 ${isEven ? 'md:text-right' : 'text-left'}`}>
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">Context & Terminology</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                  {phase.details.context}
                </p>
              </div>
            )}
          </div>
          
          {/* Connecting dashed line for desktop */}
          <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 ${isEven ? 'right-4' : 'left-4'}`} />
        </div>
      </motion.div>
    </div>
  );
};
