"use client"

import { motion } from "motion/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQSectionProps {
  category: "civil" | "ai"
}

const civilFAQs = [
  {
    question: "What types of projects do you typically handle?",
    answer:
      "I specialize in cost estimation, tendering, and procurement for large-scale construction projects including infrastructure, residential, commercial, and industrial developments across the Middle East.",
  },
  {
    question: "What software do you use for cost estimation?",
    answer:
      "I'm proficient in CCS Candy, BidBow, and PlanSwift for detailed cost estimation and quantity takeoffs, alongside Primavera P6 for project scheduling and Power BI for cost analysis reporting.",
  },
  {
    question: "How do you ensure cost accuracy in your estimates?",
    answer:
      "I follow a multi-layered approach: detailed quantity takeoffs, historical data cross-referencing, real-time market price validation, and risk contingency analysis. This methodology has achieved a 20% average cost reduction on managed projects.",
  },
  {
    question: "Are you familiar with FIDIC contract administration?",
    answer:
      "Yes, I have extensive experience administering FIDIC-based contracts, including claims management, variation orders, and dispute resolution throughout the project lifecycle.",
  },
  {
    question: "Do you offer project management consulting?",
    answer:
      "While my primary focus is quantity surveying and tendering, I provide strategic cost management consulting that integrates with your project management framework to ensure budget compliance from inception to completion.",
  },
  {
    question: "What is your availability for new projects?",
    answer:
      "I'm currently available for new engagements. Whether you need full tender management or targeted cost estimation support, I'm ready to contribute to your project's success.",
  },
]

const aiFAQs = [
  {
    question: "What is AI Vibe Coding?",
    answer:
      "AI Vibe Coding is a modern development approach where I leverage AI tools like Claude Code, Cursor, and the Anthropic API to rapidly build, iterate, and refine software applications through natural language prompts and agentic workflows.",
  },
  {
    question: "What kind of applications can you build?",
    answer:
      "I build full-stack web applications, AI-powered workflows, automation tools, data processing pipelines, and interactive web experiences using Next.js, React, and modern cloud infrastructure.",
  },
  {
    question: "How do you use AI in your development process?",
    answer:
      "AI accelerates my workflow through automated code generation, intelligent refactoring, real-time debugging assistance, test generation, and deployment automation — allowing me to deliver production-ready applications in a fraction of the traditional time.",
  },
  {
    question: "Do you just prompt AI or do you actually code?",
    answer:
      "Both. AI handles repetitive patterns, boilerplate, and initial scaffolding, while I architect the system, make architectural decisions, optimize performance, handle complex logic, and ensure security best practices are followed.",
  },
  {
    question: "Can you integrate AI into existing projects?",
    answer:
      "Absolutely. I can add AI-powered features to existing applications — including intelligent chatbots, automated document processing, data analysis pipelines, and workflow automation using the Anthropic API and other AI services.",
  },
  {
    question: "What is your typical engagement model?",
    answer:
      "I work on a project basis with clear deliverables and timelines. Each engagement starts with understanding your requirements, followed by rapid prototyping, iterative development, and thorough testing before deployment.",
  },
]

export function FAQSection({ category }: FAQSectionProps) {
  const faqs = category === "civil" ? civilFAQs : aiFAQs

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {category === "civil"
              ? "Everything you need to know about my quantity surveying and cost management services."
              : "Common questions about my AI development approach and services."
            }
          </p>
        </motion.div>

        <div className="space-y-3">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
