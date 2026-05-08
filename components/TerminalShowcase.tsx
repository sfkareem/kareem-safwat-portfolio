"use client"

import { motion } from "motion/react"
import {
  TerminalAnimationRoot,
  TerminalAnimationContainer,
  TerminalAnimationWindow,
  TerminalAnimationContent,
  TerminalAnimationCommandBar,
  TerminalAnimationOutput,
  TerminalAnimationBlinkingCursor,
  TerminalAnimationTabList,
  TerminalAnimationTabTrigger,
  TerminalAnimationBackgroundGradient,
  aiTerminalTabs,
} from "@/components/ui/terminal-animation"

export function TerminalShowcase() {
  return (
    <section id="terminal" className="py-24 relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            AI-Powered{" "}
            <span className="text-primary">Development</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Watch how Claude Code powers every stage of the development lifecycle — from scaffolding to deployment.
          </p>
        </motion.div>

        <div className="dark">
          <TerminalAnimationRoot
            tabs={aiTerminalTabs}
            alwaysDark
            className="relative overflow-hidden rounded-xl"
          >
            <TerminalAnimationBackgroundGradient />
            <TerminalAnimationContainer className="max-w-full pt-6 md:pt-16">
              <TerminalAnimationWindow
                backgroundColor="#0a0a0f"
                minHeight="24rem"
                className="border border-white/10 shadow-2xl"
              >
                <div className="flex flex-wrap items-center gap-1 px-4 pt-3 pb-0 bg-black/40">
                  <TerminalAnimationTabList className="flex flex-wrap gap-1">
                    {aiTerminalTabs.map((tab, index) => (
                      <TerminalAnimationTabTrigger
                        key={tab.label}
                        index={index}
                        className="px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-t-md"
                      >
                        {tab.label}
                      </TerminalAnimationTabTrigger>
                    ))}
                  </TerminalAnimationTabList>
                </div>

                <TerminalAnimationContent className="px-4 py-4 sm:px-6 sm:py-6">
                  <div className="font-mono text-xs sm:text-sm leading-relaxed">
                    <TerminalAnimationCommandBar className="text-green-400 mb-2" />
                    <TerminalAnimationOutput className="space-y-0.5" />
                    <TerminalAnimationBlinkingCursor className="mt-2" />
                  </div>
                </TerminalAnimationContent>
              </TerminalAnimationWindow>
            </TerminalAnimationContainer>
          </TerminalAnimationRoot>
        </div>
      </div>
    </section>
  )
}
