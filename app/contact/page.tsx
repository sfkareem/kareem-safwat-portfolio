"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Mail, MessageCircle, Phone, Send, Loader2, CheckCircle } from "lucide-react";
import { FloatingFooter } from "@/components/ui/floating-footer";
import { StickyCTA } from "@/components/ui/sticky-cta";
import portfolioData from "@/data/portfolio.json";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: portfolioData.personal.contact.email,
      href: `mailto:${portfolioData.personal.contact.email}`,
      color: "text-red-400",
    },
    {
      icon: Phone,
      label: "Phone (Egypt)",
      value: portfolioData.personal.contact.phone.egypt,
      href: `tel:${portfolioData.personal.contact.phone.egypt}`,
      color: "text-green-400",
    },
    {
      icon: Phone,
      label: "Phone (KSA)",
      value: portfolioData.personal.contact.phone.ksa,
      href: `tel:${portfolioData.personal.contact.phone.ksa}`,
      color: "text-blue-400",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp (Egypt)",
      value: "Chat on WhatsApp",
      href: portfolioData.personal.contact.whatsapp.egypt,
      color: "text-green-500",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp (KSA)",
      value: "Chat on WhatsApp",
      href: portfolioData.personal.contact.whatsapp.ksa,
      color: "text-green-500",
    },
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Let&apos;s Work Together
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {portfolioData.availability.message}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Project inquiry, collaboration, etc."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell me about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Other Ways to Reach Me
            </h2>
            
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl hover:border-primary/50 hover:bg-card/80 transition-all group"
                >
                  <div className={`p-3 rounded-lg bg-background/50 ${method.color} group-hover:scale-110 transition-transform`}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{method.label}</p>
                    <p className="text-foreground font-medium">{method.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">
                  {portfolioData.availability.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Currently accepting new projects and collaborations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <FloatingFooter />
      <StickyCTA />
    </main>
  );
}
