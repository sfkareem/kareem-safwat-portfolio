"use client";

import { motion } from "motion/react";
import portfolioData from "@/data/portfolio.json";
import { Mail, Linkedin, Twitter, Phone, MessageCircle } from "lucide-react";

export default function Contact() {
  const { contact } = portfolioData.personal;
  const { status, message } = portfolioData.availability;

  return (
    <section id="contact" className="py-24 bg-zinc-900/95 backdrop-blur-sm text-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {status}
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Let&apos;s Work Together</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              {message}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.a 
              href={`mailto:${contact.email}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-lg font-medium mb-2">Email Me</h3>
              <p className="text-zinc-400 text-center">{contact.email}</p>
            </motion.a>

            <motion.a 
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-700/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Linkedin className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-lg font-medium mb-2">Connect on LinkedIn</h3>
              <p className="text-zinc-400 text-center">Kareem Safwat</p>
            </motion.a>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-500 mb-1">KSA Contact</div>
                <div className="font-medium">{contact.phone.ksa}</div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${contact.phone.ksa.replace(/\s/g, '')}`} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
                <a href={contact.whatsapp.ksa} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            <div className="p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-sm text-zinc-500 mb-1">Egypt Contact</div>
                <div className="font-medium">{contact.phone.egypt}</div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${contact.phone.egypt.replace(/\s/g, '')}`} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
                <a href={contact.whatsapp.egypt} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
