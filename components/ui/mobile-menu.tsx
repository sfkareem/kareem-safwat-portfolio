'use client'

import { motion } from "motion/react"
import { Menu, X, Home, Briefcase, FileText, Award, Mail } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "#home" },
  { icon: Briefcase, label: "Experience", href: "#experience" },
  { icon: FileText, label: "Skills", href: "#skills" },
  { icon: Award, label: "Certifications", href: "#certifications" },
  { icon: Mail, label: "Contact", href: "#contact" },
];

export function MobileMenu() {
  const [active, setActive] = useState(false)

  const buttonSize = "size-12" 

  return (
    <div className="md:hidden fixed bottom-20 right-6 z-50">
      <div className="flex flex-col-reverse items-center justify-center relative gap-4">
        <motion.div
          className="bg-primary rounded-full z-10 shadow-lg"
          animate={{
            y: active ? 0 : 0,
          }}
        >
          <motion.button
            className={cn(
              buttonSize,
              "rounded-full flex items-center justify-center",
              "bg-primary hover:bg-primary/90 transition-colors"
            )}
            onClick={() => setActive(!active)}
            animate={{ rotate: active ? 90 : 0 }}
          >
            {active ? (
              <X size={24} className="text-primary-foreground" />
            ) : (
              <Menu size={24} className="text-primary-foreground" />
            )}
          </motion.button>
        </motion.div>
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              className={cn(
                buttonSize,
                "rounded-full flex items-center justify-center",
                "bg-background shadow-lg"
              )}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{
                opacity: active ? 1 : 0,
                scale: active ? 1 : 0,
                y: active ? 0 : 20,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: active ? index * 0.05 : 0
              }}
            >
              <a 
                href={item.href}
                onClick={() => setActive(false)}
                className="flex items-center justify-center w-full h-full"
              >
                <Icon size={20} className="text-foreground" />
              </a>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
