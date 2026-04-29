import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

type Highlight = { title: string; description: string; };
type SocialLink = { label: string; handle: string; href: string; icon: LucideIcon; };

const highlights: Highlight[] = [
  { title: "Expertise", description: "Cost Estimation, Tendering, Procurement, and Contract Administration." },
  { title: "Experience", description: "Over 9 years of experience in mega infrastructure and construction projects." },
  { title: "Availability", description: "Open to new opportunities and consulting roles." },
];

const socialLinks: SocialLink[] = [
  { label: "LinkedIn", handle: "kareemsafwat", href: "https://linkedin.com/in/kareemsafwat", icon: Linkedin },
  { label: "Email", handle: "kareemsf1995@gmail.com", href: "mailto:kareemsf1995@gmail.com", icon: Mail },
];

const listVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function GlassmorphismPortfolioBlock() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 px-6 md:px-12 lg:px-24 bg-background">
      <div className="w-full max-w-7xl grid gap-16 lg:grid-cols-2 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
            >
              Kareem Safwat
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg font-medium text-primary uppercase tracking-[0.1em]"
            >
              Tendering and Procurement Team Leader
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-xl text-lg leading-relaxed text-foreground/70"
            >
              Leading procurement and tendering processes for mega infrastructure projects. Kareem drives project success through precise cost estimation and strategic contract administration.
            </motion.p>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="group relative overflow-hidden rounded-2xl bg-background/60 p-6 backdrop-blur transition-all shadow-md"
              >
                <div className="relative space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/40">
                    {item.title}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={() => window.open("https://linkedin.com/in/kareemsafwat", "_blank")}
              className="h-12 gap-2 rounded-full px-8 text-sm uppercase tracking-[0.25em]"
            >
              Connect on LinkedIn
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl"
        >
          <Image
            src="https://kareemsf.vercel.app/images/kareem-profile-large.jpg"
            alt="Kareem Safwat"
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
