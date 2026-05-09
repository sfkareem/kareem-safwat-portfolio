"use client"

import { useEffect, useRef } from "react"
import { useInView, motion, useMotionValue, useTransform, animate } from "motion/react"
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

function Counter({ from, to, suffix = "" }: { from: number; to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, to, {
        duration: 2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, to]);

  return (
    <span ref={nodeRef}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function AIHeroTerminal() {
  return (
    <div data-nav-theme="dark" className="w-full min-h-screen bg-background relative overflow-hidden flex items-center">
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-16 lg:px-32 py-20 flex flex-col items-center justify-center min-h-screen gap-12 md:gap-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold text-foreground tracking-tight leading-[1.1]">
            AI Vibe Coder
          </h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-[clamp(1rem,2.5vw,1.25rem)] leading-relaxed">
            Specializing in Agentic Software Development, AI-powered workflows, and scalable full-stack applications.
          </p>
        </div>

        <div className="w-full max-w-4xl dark">
          <TerminalAnimationRoot
            tabs={aiTerminalTabs}
            alwaysDark
            className="relative overflow-hidden rounded-xl"
          >
            <TerminalAnimationBackgroundGradient />
            <TerminalAnimationContainer className="max-w-full pt-0 md:pt-4">
              <TerminalAnimationWindow
                backgroundColor="#0a0a0f"
                minHeight="20rem"
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

        <div className="grid grid-cols-2 gap-8 max-w-sm w-full">
          <div className="flex flex-col items-center">
            <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-foreground">
              <Counter from={0} to={3} suffix="+" />
            </div>
            <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-muted-foreground mt-1">Years Experience</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-foreground">
              <Counter from={0} to={100} suffix="%" />
            </div>
            <div className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-muted-foreground mt-1">AI-Driven</div>
          </div>
        </div>
      </div>
    </div>
  )
}
