"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react"
import { ArrowUpRight, Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react"
import portfolioData from "@/data/portfolio.json"
import { db, handleFirestoreError, OperationType } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export function LetsWorkTogether() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Parallax transforms
  const yTitle = useTransform(scrollYProgress, [0, 1], [100, -100])
  const yLeft = useTransform(scrollYProgress, [0, 1], [50, -50])
  const yRight = useTransform(scrollYProgress, [0, 1], [100, -100])

  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleExpandClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsClicked(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const path = "contacts"
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp(),
      })
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "contacts")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={containerRef} className="flex min-h-screen items-center justify-center px-6 py-24 relative">
      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Initial "Let's work together" state */}
        <AnimatePresence mode="wait">
          {!isClicked ? (
            <motion.div
              key="cta"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -40 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: yTitle }}
              className="z-10 flex flex-col items-center justify-center gap-12 w-full"
            >
              <div
                className="group relative cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleExpandClick}
              >
                <div className="flex flex-col items-center gap-6">
                  <h2 className="relative text-center text-[clamp(2.5rem,10vw,8rem)] font-light tracking-tight text-foreground leading-[1.1]">
                    <span className="block overflow-hidden">
                      <span
                        className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ transform: isHovered ? "translateY(-8%)" : "translateY(0)" }}
                      >
                        Let&apos;s work
                      </span>
                    </span>
                    <span className="block overflow-hidden pb-4 -mb-4">
                      <span
                        className="block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75"
                        style={{ transform: isHovered ? "translateY(-8%)" : "translateY(0)" }}
                      >
                        <span className="text-muted-foreground/60">together</span>
                      </span>
                    </span>
                  </h2>

                  <div className="relative mt-4 flex size-16 items-center justify-center sm:size-20">
                    <div
                      className="pointer-events-none absolute inset-0 rounded-full border transition-all duration-500 ease-out"
                      style={{
                        borderColor: isHovered ? "var(--foreground)" : "var(--border)",
                        backgroundColor: isHovered ? "var(--foreground)" : "transparent",
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                      }}
                    />
                    <ArrowUpRight
                      className="size-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:size-7"
                      style={{
                        transform: isHovered ? "translate(2px, -2px)" : "translate(0, 0)",
                        color: isHovered ? "var(--background)" : "var(--foreground)",
                      }}
                    />
                  </div>
                </div>

                <div className="absolute -left-8 top-1/2 -translate-y-1/2 sm:-left-16">
                  <div
                    className="h-px w-8 bg-border transition-all duration-500 sm:w-12"
                    style={{
                      transform: isHovered ? "scaleX(1.5)" : "scaleX(1)",
                      opacity: isHovered ? 1 : 0.5,
                    }}
                  />
                </div>
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 sm:-right-16">
                  <div
                    className="h-px w-8 bg-border transition-all duration-500 sm:w-12"
                    style={{
                      transform: isHovered ? "scaleX(1.5)" : "scaleX(1)",
                      opacity: isHovered ? 1 : 0.5,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 text-center">
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {portfolioData.availability.message}
                </p>
                <span className="text-xs tracking-widest uppercase text-muted-foreground/60">
                  {portfolioData.personal.contact.email}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24"
            >
              {/* Left Column: Contact Info */}
              <motion.div style={{ y: yLeft }} className="flex flex-col justify-center space-y-8 text-center md:text-left will-change-transform">
                <div>
                  <h3 className="text-[clamp(2rem,5vw,3rem)] font-light tracking-tight mb-4">
                    Get in touch
                  </h3>
                  <p className="text-muted-foreground text-[clamp(1rem,2vw,1.125rem)] leading-relaxed max-w-md mx-auto md:mx-0">
                    If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.
                  </p>
                </div>

                <div className="space-y-6 pt-8 border-t border-border/50 flex flex-col items-center md:items-start">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                      <a href={`mailto:${portfolioData.personal.contact.email}`} className="text-[clamp(1rem,2vw,1.125rem)] hover:text-primary transition-colors">
                        {portfolioData.personal.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                      <div className="flex flex-col gap-1">
                        <a href={`tel:${portfolioData.personal.contact.phone.egypt.replace(/\s+/g, '')}`} className="text-[clamp(1rem,2vw,1.125rem)] hover:text-primary transition-colors">
                          {portfolioData.personal.contact.phone.egypt} (Egypt)
                        </a>
                        <a href={`tel:${portfolioData.personal.contact.phone.ksa.replace(/\s+/g, '')}`} className="text-[clamp(1rem,2vw,1.125rem)] hover:text-primary transition-colors">
                          {portfolioData.personal.contact.phone.ksa} (KSA)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                      <p className="text-[clamp(1rem,2vw,1.125rem)]">
                        Shorouk City, New Cairo, Cairo, Egypt
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Form */}
              <motion.div style={{ y: yRight }} className="bg-muted/30 p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl will-change-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
                
                {submitStatus === "success" ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-semibold">Message Sent!</h4>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. I will get back to you within 1 business day.
                    </p>
                    <button 
                      onClick={() => setSubmitStatus("idle")}
                      className="mt-8 px-6 py-2 rounded-full hover:bg-muted transition-colors shadow-md bg-background"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-background rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-background rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Phone</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-background rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full bg-background rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none shadow-sm"
                        placeholder="How can I help you?"
                      />
                    </div>

                    {submitStatus === "error" && (
                      <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                        There was an error sending your message. Please try again or contact me directly via email.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-foreground text-background px-8 py-4 transition-all hover:bg-foreground/90 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="font-medium tracking-wide">Send Message</span>
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

