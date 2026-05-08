"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Slot } from "@radix-ui/react-slot"
import { useControllableState } from "@radix-ui/react-use-controllable-state"

import { cn } from "@/lib/utils"

export interface TerminalLine {
  text: string
  color?: string
  delay?: number
}

export interface TabContent {
  label: string
  command: string
  lines: TerminalLine[]
}

export type TerminalAnimationRootProps = React.ComponentProps<"div"> & {
  tabs: TabContent[]
  defaultActiveTab?: number
  activeTab?: number
  onActiveTabChange?: (index: number) => void
  backgroundImage?: string
  alwaysDark?: boolean
  hideCursorOnComplete?: boolean
}

interface TerminalAnimationContextValue {
  activeTab: number
  setActiveTab: (index: number) => void
  commandTyped: string
  isTypingCommand: boolean
  showCursor: boolean
  visibleLines: number
  currentTab: TabContent
  tabs: TabContent[]
}

const TerminalAnimationContext = createContext<
  TerminalAnimationContextValue | undefined
>(undefined)

function useTerminalAnimationContext() {
  const ctx = useContext(TerminalAnimationContext)
  if (!ctx) {
    throw new Error(
      "TerminalAnimation components must be used within TerminalAnimationRoot"
    )
  }
  return ctx
}

export const aiTerminalTabs: TabContent[] = [
  {
    label: "create",
    command: "claude create vibe-app",
    lines: [
      { text: "", delay: 80 },
      { text: "  Scaffolding project in ./vibe-app...", color: "text-[#b39aff]", delay: 400 },
      { text: "", delay: 80 },
      { text: "  Analyzing requirements via Claude...", color: "text-neutral-400", delay: 300 },
      { text: "  Generating architecture...", color: "text-[#32f3e9]", delay: 200 },
      { text: "    ✓ Component tree generated", color: "text-[#22ff73]", delay: 200 },
      { text: "    ✓ Data flow diagram created", color: "text-[#22ff73]", delay: 150 },
      { text: "    ✓ Route structure planned", color: "text-[#22ff73]", delay: 150 },
      { text: "", delay: 200 },
      { text: "  Building project structure...", color: "text-neutral-400", delay: 300 },
      { text: "    ✓ Next.js + TypeScript configured", color: "text-[#22ff73]", delay: 200 },
      { text: "    ✓ Tailwind CSS set up", color: "text-[#22ff73]", delay: 150 },
      { text: "    ✓ Database schema designed", color: "text-[#22ff73]", delay: 150 },
      { text: "", delay: 200 },
      { text: "  Done. Project ready in 12.4s", color: "text-[#32f3e9]", delay: 300 },
      { text: "", delay: 50 },
      { text: "    cd vibe-app", color: "text-neutral-300", delay: 100 },
      { text: "    claude dev", color: "text-neutral-300", delay: 100 },
    ],
  },
  {
    label: "dev",
    command: "claude dev",
    lines: [
      { text: "", delay: 80 },
      { text: "  Claude Dev Server v2.1.0  ready in 842ms", color: "text-[#b39aff]", delay: 400 },
      { text: "", delay: 80 },
      { text: "  >  Local:    http://localhost:3000", color: "text-[#32f3e9]", delay: 200 },
      { text: "  >  Network:  http://192.168.1.42:3000", color: "text-neutral-500", delay: 100 },
      { text: "  >  AI Port:  ws://localhost:3001", color: "text-neutral-600", delay: 100 },
      { text: "", delay: 300 },
      { text: "  Watching for AI-assisted changes...", color: "text-neutral-500", delay: 400 },
      { text: "  ✓ Agent: Component updated - Header.tsx (1.2s)", color: "text-[#22ff73]", delay: 600 },
      { text: "  ✓ Agent: API route created - api/chat (0.8s)", color: "text-[#22ff73]", delay: 500 },
      { text: "  ✓ Agent: Tests generated - Header.test.tsx (2.1s)", color: "text-[#22ff73]", delay: 400 },
      { text: "", delay: 200 },
      { text: "  🔄 Agent: Optimizing database queries...", color: "text-yellow-400", delay: 800 },
      { text: "  ✓ Query performance improved by 65%", color: "text-[#22ff73]", delay: 300 },
    ],
  },
  {
    label: "deploy",
    command: "claude deploy --prod",
    lines: [
      { text: "", delay: 80 },
      { text: "  Analyzing project for deployment...", color: "text-[#b39aff]", delay: 400 },
      { text: "", delay: 80 },
      { text: "  ✓ Environment variables validated", color: "text-[#22ff73]", delay: 200 },
      { text: "  ✓ Build optimized", color: "text-[#22ff73]", delay: 150 },
      { text: "  ✓ Database migrations prepared", color: "text-[#22ff73]", delay: 200 },
      { text: "", delay: 80 },
      { text: "  Deploying to Vercel...", color: "text-neutral-400", delay: 300 },
      { text: "    Uploading assets...", color: "text-neutral-500", delay: 200 },
      { text: "    ✓ All 142 files uploaded", color: "text-[#22ff73]", delay: 300 },
      { text: "", delay: 80 },
      { text: "  Deployment summary:", color: "text-neutral-400", delay: 200 },
      { text: "    Framework:    Next.js 15", color: "text-neutral-300", delay: 80 },
      { text: "    Regions:      iad1 (US East)", color: "text-neutral-300", delay: 80 },
      { text: "    Duration:     34.2s", color: "text-neutral-300", delay: 80 },
      { text: "    URL:          https://vibe-app.vercel.app", color: "text-[#32f3e9]", delay: 200 },
    ],
  },
  {
    label: "test",
    command: "claude test",
    lines: [
      { text: "", delay: 80 },
      { text: "  RUN  Claude Test Runner v1.0", color: "text-[#b39aff]", delay: 300 },
      { text: "", delay: 80 },
      { text: "  src/components/Header.test.tsx", color: "text-neutral-400", delay: 200 },
      { text: "    ✓ renders navigation links (2ms)", color: "text-[#22ff73]", delay: 150 },
      { text: "    ✓ handles theme toggle (1ms)", color: "text-[#22ff73]", delay: 100 },
      { text: "  src/app/api/chat.test.ts", color: "text-neutral-400", delay: 200 },
      { text: "    ✓ returns streaming response (12ms)", color: "text-[#22ff73]", delay: 150 },
      { text: "    ✓ handles authentication (3ms)", color: "text-[#22ff73]", delay: 100 },
      { text: "  src/lib/agent.test.ts", color: "text-neutral-400", delay: 200 },
      { text: "    ✓ generates code correctly (45ms)", color: "text-[#22ff73]", delay: 150 },
      { text: "    ✓ handles edge cases (2ms)", color: "text-[#22ff73]", delay: 100 },
      { text: "", delay: 80 },
      { text: "  Tests  7 passed (7)", color: "text-[#22ff73]", delay: 200 },
      { text: "  Time   82ms", color: "text-neutral-500", delay: 100 },
      { text: "  Coverage 94%", color: "text-[#32f3e9]", delay: 200 },
    ],
  },
]

export function TerminalAnimationRoot({
  tabs,
  defaultActiveTab = 0,
  activeTab: activeTabProp,
  onActiveTabChange,
  backgroundImage,
  alwaysDark = false,
  hideCursorOnComplete = true,
  className,
  children,
  ...props
}: TerminalAnimationRootProps) {
  const [activeTab, setActiveTab] = useControllableState({
    prop: activeTabProp,
    defaultProp: defaultActiveTab,
    onChange: onActiveTabChange,
  })

  const [visibleLines, setVisibleLines] = useState(0)
  const [commandTyped, setCommandTyped] = useState("")
  const [isTypingCommand, setIsTypingCommand] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimeouts = useCallback(() => {
    timeoutRef.current.forEach(clearTimeout)
    timeoutRef.current = []
  }, [])

  const animateTab = useCallback(
    (tabIndex: number) => {
      clearTimeouts()
      setVisibleLines(0)
      setCommandTyped("")
      setIsTypingCommand(true)
      setShowCursor(true)

      const tab = tabs[tabIndex]
      if (!tab) return

      const command = tab.command
      let charIndex = 0

      const typeCommand = () => {
        if (charIndex <= command.length) {
          setCommandTyped(command.slice(0, charIndex))
          charIndex++
          const t = setTimeout(typeCommand, 25 + Math.random() * 35)
          timeoutRef.current.push(t)
        } else {
          const t = setTimeout(() => {
            setIsTypingCommand(false)
            showLines(0)
          }, 250)
          timeoutRef.current.push(t)
        }
      }

      const showLines = (lineIndex: number) => {
        if (lineIndex <= tab.lines.length) {
          setVisibleLines(lineIndex)
          if (lineIndex < tab.lines.length) {
            const delay = tab.lines[lineIndex].delay ?? 100
            const t = setTimeout(() => showLines(lineIndex + 1), delay)
            timeoutRef.current.push(t)
          } else if (hideCursorOnComplete) {
            const t = setTimeout(() => setShowCursor(false), 600)
            timeoutRef.current.push(t)
          }
        }
      }

      const t = setTimeout(typeCommand, 300)
      timeoutRef.current.push(t)
    },
    [clearTimeouts, hideCursorOnComplete, tabs]
  )

  useEffect(() => {
    animateTab(activeTab)
    return clearTimeouts
  }, [activeTab, animateTab, clearTimeouts])

  const currentTab = tabs[activeTab] ?? tabs[0]
  const safeActiveTab = Math.min(activeTab, tabs.length - 1)

  const value: TerminalAnimationContextValue = {
    activeTab: safeActiveTab,
    setActiveTab,
    commandTyped,
    isTypingCommand,
    showCursor,
    visibleLines,
    currentTab,
    tabs,
  }

  return (
    <TerminalAnimationContext.Provider value={value}>
      <div
        className={cn(alwaysDark && "dark", className)}
        data-slot="terminal-animation-root"
        {...props}
      >
        {backgroundImage && (
          <div
            aria-hidden
            className="absolute inset-0 bg-center bg-cover"
            data-slot="terminal-animation-background"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        {children}
      </div>
    </TerminalAnimationContext.Provider>
  )
}

export function TerminalAnimationBackgroundGradient({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 bg-gradient-to-br from-violet-600/40 via-fuchsia-600/30 to-indigo-950",
        className
      )}
      data-slot="terminal-animation-background-gradient"
      {...props}
    />
  )
}

export function TerminalAnimationContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative w-full max-w-[62rem] px-3 pt-10 pb-0 md:px-0 md:pt-28",
        className
      )}
      data-slot="terminal-animation-container"
      {...props}
    />
  )
}

export function TerminalAnimationWindow({
  className,
  backgroundColor,
  minHeight = "28rem",
  animateOnVisible = true,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  backgroundColor?: string
  minHeight?: string
  animateOnVisible?: boolean
}) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!(animateOnVisible && windowRef.current)) return
    const el = windowRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasAnimated(true)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [animateOnVisible])

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-t-xl",
        !backgroundColor && "bg-card",
        animateOnVisible &&
          "transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        animateOnVisible && !hasAnimated && "translate-y-64",
        animateOnVisible && hasAnimated && "translate-y-0",
        className
      )}
      data-slot="terminal-animation-window"
      ref={windowRef}
      style={
        backgroundColor
          ? { backgroundColor, minHeight, ...style }
          : { minHeight, ...style }
      }
      {...props}
    />
  )
}

export function TerminalAnimationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex-1 px-6 py-6 sm:px-10 sm:py-8", className)}
      data-slot="terminal-animation-content"
      {...props}
    />
  )
}

export function TerminalAnimationBlinkingCursor({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "ml-0.5 inline-block h-[18px] w-[7px] translate-y-[3px] animate-caret-blink bg-muted-foreground duration-1000",
        className
      )}
      data-slot="terminal-animation-blinking-cursor"
      {...props}
    />
  )
}

export function TerminalAnimationCommandBar({
  className,
  cursor,
  ...props
}: React.ComponentProps<"div"> & { cursor?: ReactNode }) {
  const { commandTyped, isTypingCommand, showCursor } =
    useTerminalAnimationContext()

  const defaultCursor = <span aria-hidden="true">▌</span>

  return (
    <div className={className} data-slot="terminal-animation-command" {...props}>
      <span className="text-green-400">$</span> {commandTyped}
      {isTypingCommand && showCursor && (cursor ?? defaultCursor)}
    </div>
  )
}

export function TerminalAnimationOutputLine({
  line,
  visible,
  className,
  ...props
}: React.ComponentProps<"div"> & { line: TerminalLine; visible: boolean }) {
  if (!visible) return null
  return (
    <div className={className} data-slot="terminal-animation-output-line" {...props}>
      <span className={line.color}>{line.text || "\u00A0"}</span>
    </div>
  )
}

export function TerminalAnimationOutput({
  className,
  renderLine,
  ...props
}: React.ComponentProps<"div"> & {
  renderLine?: (line: TerminalLine, index: number, visible: boolean) => ReactNode
}) {
  const { isTypingCommand, visibleLines, currentTab, activeTab } =
    useTerminalAnimationContext()

  if (isTypingCommand) return null

  return (
    <div
      aria-atomic="false"
      aria-live="polite"
      className={className}
      data-slot="terminal-animation-output"
      role="log"
      {...props}
    >
      {currentTab.lines.map((line, i) => {
        const visible = i < visibleLines
        const key = `${activeTab}-${i}`
        if (renderLine) {
          const content = renderLine(line, i, visible)
          if (!(visible || content)) return null
          return <div key={key}>{content}</div>
        }
        return (
          <TerminalAnimationOutputLine key={key} line={line} visible={visible} />
        )
      })}
    </div>
  )
}

export function TerminalAnimationTrailingPrompt({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isTypingCommand, showCursor, visibleLines, currentTab } =
    useTerminalAnimationContext()

  const show =
    !isTypingCommand && showCursor && visibleLines >= currentTab.lines.length

  if (!show) return null

  return (
    <div className={className} data-slot="terminal-animation-trailing-prompt" {...props}>
      {children}
    </div>
  )
}

export function TerminalAnimationTabList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-label="Terminal commands"
      className={className}
      data-slot="terminal-animation-tab-list"
      role="tablist"
      {...props}
    />
  )
}

export function TerminalAnimationTabTrigger({
  index,
  asChild = false,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button"> & {
  index: number
  asChild?: boolean
}) {
  const { activeTab, setActiveTab } = useTerminalAnimationContext()
  const isActive = activeTab === index

  const triggerProps = {
    role: "tab" as const,
    "aria-selected": isActive,
    "data-state": isActive ? "active" : "inactive",
    onClick: () => setActiveTab(index),
    children,
  }

  if (asChild) {
    return <Slot {...triggerProps} {...props} className={className} />
  }

  return (
    <button
      data-slot="terminal-animation-tab-trigger"
      type="button"
      {...triggerProps}
      className={className}
      {...props}
    />
  )
}

export function useTerminalAnimation() {
  return useTerminalAnimationContext()
}
