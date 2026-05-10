# AI Page Terminal Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the scrollable `/ai` page with a full-viewport interactive terminal featuring portfolio tabs (whoami, repos, ~/stack, certs, ./reach, ./agent) and built-in AI chat via `$ ask <question>`.

**Architecture:** Component decomposition — separate files for terminal shell, typewriter animation, tab content data, chat interface, and a rewritten page that wires them together. A single `useTypewriter` hook powers all typing animations. Chat history persists in localStorage.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Gemini 3.1 Flash Lite (SSE streaming), motion/react (if needed for animations).

---

## File Structure

### New Files
- `components/terminal/terminal-content.ts` — Static text formatters for each tab, exported as functions returning strings
- `components/terminal/TypewriterText.tsx` — `useTypewriter` hook + `TypewriterText` component for character-by-character reveal
- `components/terminal/TerminalShell.tsx` — Outer chrome: window controls, tab bar, scrollable body area, prompt bar, footer
- `components/terminal/TerminalChat.tsx` — Full chat view for `./agent` tab + `$ ask` inline responses, localStorage persistence, reset button

### Modified Files
- `app/ai/page.tsx` — Rewrite to import and render `TerminalShell`, remove old section components
- `app/api/prototype/route.ts` — Remove hardcoded API key fallback, rely on `GEMINI_API_KEY` env var only

### Removed Imports (from /ai/page.tsx only — components stay on disk)
- `AIHeroTerminal`, `FeaturedProjects`, `SkillsSection`, `CertificationsSection`, `ContactSection`, `FloatingFooter`, `VerticalTooltipNavbar`

---

### Task 1: Create `terminal-content.ts`

**Files:**
- Create: `components/terminal/terminal-content.ts`

- [ ] **Step 1: Write the content formatters**

```ts
export const personal = {
  name: "Kareem Safwat",
  title: "Senior Quantity Surveyor / AI Vibe Coder",
  tagline: "Constructing Value & Control",
  summary: "Senior Quantity Surveyor with 9+ years of experience. RICS APC Candidate. Expert in tendering, procurement, and strategic cost management. Also an AI Vibe Coder and Agentic Software Developer leveraging Anthropic's Claude to automate complex workflows and build scalable full-stack web apps.",
  resume: "https://1drv.ms/b/c/3ef89486fb4c3d1e/Ea1q4HK2lSNAg9JO-dxQHDoBT6CxmOV6giXxdlq9YNRKOg?e=m6m6ZY",
};

export const projects = [
  {
    name: "Controls Academy",
    url: "https://controlsacademy.net/",
    description: "A comprehensive educational platform built from the ground up, featuring AI-powered workflows and automated technical training systems.",
    technologies: ["React", "Next.js", "AI Vibe Coding", "Agentic Software Development"],
  },
];

export const skills = {
  tools: ["Claude Code", "Anthropic API", "Cursor"],
  technicalSkills: [
    "AI Vibe Coding",
    "Agentic Software Development",
    "Prompt Engineering",
    "AI Workflow Automation",
    "Full Stack Web Apps",
    "Scalable Full-Stack Applications",
  ],
  specializations: ["AI & Vibe Coding"],
};

export const certifications = [
  { name: "Claude Code in Action", issuer: "Anthropic", date: "2026" },
  { name: "Claude 101: Professional AI Workflow Certification", issuer: "Anthropic", date: "2026" },
  { name: "AI Fluency: Framework & Foundations", issuer: "Anthropic", date: "2026" },
  { name: "Claude with the Anthropic API", issuer: "Anthropic", date: "2026" },
];

export const contact = {
  email: "kareemsf1995@gmail.com",
  phone: { egypt: "+20 101 817 1342", ksa: "+966 53 726 2745" },
  linkedin: "https://linkedin.com/in/kareemsafwat/",
  twitter: "https://x.com/Sf_Kareem",
  status: "Available for Work",
};

export type TabId = "whoami" | "repos" | "~/stack" | "certs" | "./reach" | "./agent";

export const TAB_LABELS: TabId[] = ["whoami", "repos", "~/stack", "certs", "./reach", "./agent"];

export function getTabContent(tab: TabId): string {
  switch (tab) {
    case "whoami":
      return [
        `Name:       ${personal.name}`,
        `Title:      ${personal.title}`,
        `Tagline:    ${personal.tagline}`,
        `Experience: 9+ years (Civil) · 3+ years (AI)`,
        `Resume:     ${personal.resume}`,
        `─`.repeat(48),
        ``,
        personal.summary,
      ].join("\n");

    case "repos":
      return projects
        .map(
          (p) =>
            [
              p.name,
              `URL:  ${p.url}`,
              `Tech: ${p.technologies.join(", ")}`,
              `─`.repeat(48),
              ``,
              p.description,
            ].join("\n")
        )
        .join("\n\n");

    case "~/stack":
      return [
        `TOOLS`,
        ...skills.tools.map((t) => `  ${t}`),
        ``,
        `TECHNICAL SKILLS`,
        ...skills.technicalSkills.map((s) => `  ${s}`),
        ``,
        `SPECIALIZATIONS`,
        ...skills.specializations.map((s) => `  ${s}`),
      ].join("\n");

    case "certs":
      return certifications
        .map((c, i) => `${i + 1}. ${c.name.padEnd(50)} [${c.issuer} · ${c.date}]`)
        .join("\n");

    case "./reach":
      return [
        `Email:    ${contact.email}`,
        `Phone:    ${contact.phone.egypt} (EG) / ${contact.phone.ksa} (KSA)`,
        `LinkedIn: ${contact.linkedin}`,
        `X:        ${contact.twitter}`,
        `─`.repeat(48),
        ``,
        `Status:   ${contact.status}`,
      ].join("\n");

    case "./agent":
      return ""; // handled by TerminalChat
  }
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `call npx tsc --noEmit --pretty 2>&1 | findstr /I "terminal-content"`
Expected: No output (no errors)

---

### Task 2: Create `TypewriterText.tsx`

**Files:**
- Create: `components/terminal/TypewriterText.tsx`

- [ ] **Step 1: Write the hook and component**

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

export function useTypewriter(text: string, speed = 25) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    setIsTyping(true);

    frameRef.current = setInterval(() => {
      indexRef.current++;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        if (frameRef.current) clearInterval(frameRef.current);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [text, speed]);

  return { displayed, isTyping };
}

export function TypewriterText({
  text,
  speed = 25,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const { displayed, isTyping } = useTypewriter(text, speed);
  return (
    <span className={className}>
      {displayed}
      {isTyping && <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse ml-0.5 align-middle" />}
    </span>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `call npx tsc --noEmit --pretty 2>&1 | findstr /I "TypewriterText"`
Expected: No output (no errors)

---

### Task 3: Create `TerminalShell.tsx`

**Files:**
- Create: `components/terminal/TerminalShell.tsx`

- [ ] **Step 1: Write the terminal shell component**

```tsx
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { TAB_LABELS, getTabContent, type TabId } from "./terminal-content";
import { TypewriterText } from "./TypewriterText";
import { TerminalChat } from "./TerminalChat";

function TerminalDot({ color }: { color: string }) {
  return <span className={cn("inline-block size-2.5 rounded-full", color)} />;
}

type CmdEntry = {
  id: string;
  command: string;
  output: string;
  isTyping: boolean;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

const WELCOME_SEQUENCE = [
  "$ ./assistant --interactive",
  "> Type your questions to learn about Kareem's work.",
  '> Hello! I\'m Kareem\'s AI assistant. Ask me anything about his work, skills, or experience.',
];

const STORAGE_KEY = "ai-terminal-history";

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // quota exceeded, silently fail
  }
}

export default function TerminalShell() {
  const [activeTab, setActiveTab] = useState<TabId>("whoami");
  const [entries, setEntries] = useState<CmdEntry[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [cmdInput, setCmdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const chatMessagesRef = useRef<Message[]>(chatMessages);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [entries, chatMessages]);

  // Welcome sequence on first load
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      const startWelcome = async () => {
        for (const line of WELCOME_SEQUENCE) {
          await new Promise((r) => setTimeout(r, 600));
          setEntries((prev) => [
            ...prev,
            { id: crypto.randomUUID(), command: "", output: line, isTyping: false },
          ]);
        }
      };
      startWelcome();
    }
  }, [hasStarted]);

  const runCommand = (tab: TabId) => {
    setActiveTab(tab);
    if (tab === "./agent") return;
    const content = getTabContent(tab);
    const id = crypto.randomUUID();
    setEntries((prev) => [
      ...prev,
      { id, command: `$ ${tab}`, output: content, isTyping: true },
    ]);
  };

  const handleTabClick = (tab: TabId) => {
    runCommand(tab);
  };

  const sendChat = async (text: string, tabContext?: TabId) => {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    const assistantMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    const current = chatMessagesRef.current;
    const updated = [...current, userMsg, assistantMsg];
    chatMessagesRef.current = updated;
    setChatMessages(updated);
    saveHistory(updated);
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const history = [...current, userMsg].map((m) => ({
        role: m.role,
        content: m.content || " ",
      }));

      const systemContext = tabContext && tabContext !== "./agent"
        ? `The user is currently viewing the "${tabContext}" section of the portfolio. Answer in that context.`
        : "";

      const res = await fetch("/api/prototype", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: systemContext
            ? [{ role: "system", content: systemContext }, ...history]
            : history,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: res.statusText }));
        const msgs = [...chatMessagesRef.current];
        const last = msgs[msgs.length - 1];
        if (last && last.role === "assistant") {
          last.content = `Error: ${errData.error || "Request failed"}`;
        }
        chatMessagesRef.current = msgs;
        setChatMessages(msgs);
        saveHistory(msgs);
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const json = line.slice(6).trim();
            if (!json || json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text || "";
              if (chunk) {
                const msgs = [...chatMessagesRef.current];
                const last = msgs[msgs.length - 1];
                if (last && last.role === "assistant") {
                  last.content += chunk;
                }
                chatMessagesRef.current = msgs;
                setChatMessages(msgs);
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        const msgs = [...chatMessagesRef.current];
        const last = msgs[msgs.length - 1];
        if (last && last.role === "assistant") {
          last.content = `Error: ${err.message || "Request failed"}`;
        }
        chatMessagesRef.current = msgs;
        setChatMessages(msgs);
        saveHistory(msgs);
      }
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  };

  const handlePromptSubmit = (e: FormEvent) => {
    e.preventDefault();
    const raw = cmdInput.trim();
    if (!raw || isLoading) return;
    setCmdInput("");

    // Check for $ command
    const askMatch = raw.match(/^\$ ask (.+)/i);
    const cmdMatch = raw.match(/^\$ (\S+)/);

    if (askMatch) {
      sendChat(askMatch[1], activeTab);
    } else if (cmdMatch) {
      const cmd = cmdMatch[1];
      const matchedTab = TAB_LABELS.find((t) => t === cmd);
      if (matchedTab) {
        runCommand(matchedTab);
      } else if (cmd === "help") {
        setEntries((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            command: "$ help",
            output: [
              `Available commands:`,
              ...TAB_LABELS.map((t) => `  $ ${t.padEnd(12)} — View ${t} section`),
              `  $ ask <q>       — Ask the AI a question`,
              `  $ clear         — Clear terminal`,
              `  $ reset         — Clear chat history and reset`,
              `  $ help          — Show this help`,
            ].join("\n"),
            isTyping: false,
          },
        ]);
      } else if (cmd === "clear") {
        setEntries([]);
      } else if (cmd === "reset") {
        setEntries([]);
        setChatMessages([]);
        saveHistory([]);
        chatMessagesRef.current = [];
      } else {
        setEntries((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            command: `$ ${raw}`,
            output: `Command not found: ${cmd}. Type $ help for available commands.`,
            isTyping: false,
          },
        ]);
      }
    } else {
      // Bare text → auto-interpret as $ ask
      sendChat(raw, activeTab);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-mono flex flex-col overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-950 border-b border-zinc-800 select-none shrink-0">
        <div className="flex items-center gap-1.5">
          <TerminalDot color="bg-red-500" />
          <TerminalDot color="bg-yellow-500" />
          <TerminalDot color="bg-green-500" />
        </div>
        <span className="text-xs text-zinc-600 ml-2">ai/terminal</span>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-zinc-800 bg-zinc-950/90 shrink-0">
        {TAB_LABELS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={cn(
              "px-3 py-1.5 text-xs rounded border transition-colors",
              activeTab === tab
                ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                : "bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Body area */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Welcome / command entries */}
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.command && (
              <div className="text-green-400 text-sm mb-1">
                <span className="text-green-400">$</span>{" "}
                <span>{entry.command.replace("$ ", "")}</span>
              </div>
            )}
            {entry.output && (
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                <span className="text-zinc-500">&gt;</span>{" "}
                {entry.isTyping ? (
                  <TypewriterText text={entry.output} speed={15} />
                ) : (
                  entry.output
                )}
              </div>
            )}
          </div>
        ))}

        {/* Chat messages (shown in any tab, not just ./agent) */}
        {showHistory && chatMessages.map((msg) => (
          <div key={msg.id} className="mb-3">
            {msg.role === "user" ? (
              <div>
                <span className="text-green-400 text-sm">$</span>{" "}
                <span className="text-zinc-200 text-sm">{msg.content}</span>
              </div>
            ) : (
              <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                <span className="text-zinc-500">&gt;</span>{" "}
                {msg.content || (
                  <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse" />
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && chatMessages.length > 0 && !chatMessages[chatMessages.length - 1]?.content && (
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span className="inline-block size-2 bg-green-400 rounded-full animate-pulse" />
            Thinking...
          </div>
        )}

        {activeTab === "./agent" && (
          <TerminalChat
            messages={chatMessages}
            isLoading={isLoading}
            onSend={(text) => sendChat(text)}
            onReset={() => {
              if (confirm("Clear all chat history? This cannot be undone.")) {
                setChatMessages([]);
                saveHistory([]);
                chatMessagesRef.current = [];
                setShowHistory(true);
              }
            }}
          />
        )}
      </div>

      {/* Prompt bar (hidden when on ./agent tab — that has its own input) */}
      {activeTab !== "./agent" && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-3 shrink-0">
          <form onSubmit={handlePromptSubmit} className="flex items-center gap-2">
            <span className="text-green-400 text-sm shrink-0">$</span>
            <input
              type="text"
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
              placeholder="ask a question or type a command..."
              className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-1.5 text-[10px] text-zinc-700 border-t border-zinc-800 bg-zinc-950 shrink-0">
        gemini-3.1-flash-lite-preview · {chatMessages.length} messages
        <button
          onClick={() => {
            if (confirm("Clear all chat history? This cannot be undone.")) {
              setChatMessages([]);
              saveHistory([]);
              chatMessagesRef.current = [];
            }
          }}
          className="ml-4 text-zinc-700 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          reset
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `call npx tsc --noEmit --pretty 2>&1 | findstr /I "TerminalShell"`
Expected: No output (no errors)

---

### Task 4: Create `TerminalChat.tsx`

**Files:**
- Create: `components/terminal/TerminalChat.tsx`

- [ ] **Step 1: Write the chat component**

```tsx
"use client";

import { useState, useRef, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

export function TerminalChat({
  messages,
  isLoading,
  onSend,
  onReset,
}: {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onReset: () => void;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    onSend(text);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs text-zinc-600 mb-2 flex items-center justify-between">
        <span>./agent — AI Assistant</span>
        <button
          onClick={onReset}
          className="text-zinc-700 hover:text-zinc-400 transition-colors underline underline-offset-2"
        >
          clear conversation
        </button>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <div className="text-zinc-600 text-sm italic">
            No conversation history. Type a question to get started.
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 mt-auto pt-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-green-400 text-sm shrink-0">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ask about Kareem's work..."
            className="flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder-zinc-700"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "..." : "$"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `call npx tsc --noEmit --pretty 2>&1 | findstr /I "TerminalChat"`
Expected: No output (no errors)

---

### Task 5: Rewrite `app/ai/page.tsx`

**Files:**
- Modify: `app/ai/page.tsx` (full rewrite)

- [ ] **Step 1: Rewrite the page**

```tsx
"use client";

import TerminalShell from "@/components/terminal/TerminalShell";

export default function AIPage() {
  return <TerminalShell />;
}
```

- [ ] **Step 2: Verify the page compiles**

Run: `call npx tsc --noEmit --pretty 2>&1 | findstr /I "app/ai/page"`
Expected: No output (no errors)

---

### Task 6: Clean up API route

**Files:**
- Modify: `app/api/prototype/route.ts`

- [ ] **Step 1: Remove hardcoded API key**

Edit the file to remove the fallback:
```ts
// Old:
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyB4LmvdfTUCz8qA9TZmh7RNzuMSdmGUhBg";

// New:
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500 });
}
```

- [ ] **Step 2: Verify the route compiles**

Run: `call npx tsc --noEmit --pretty 2>&1 | findstr /I "prototype/route"`
Expected: No output (no errors)

---

### Task 7: Verify build and dev

- [ ] **Step 1: Build check**

Run: `call npx next build 2>&1`
Expected: Build succeeds with no errors

- [ ] **Step 2: Verify no unused imports in /ai/page**

Check that `components/AIHeroTerminal`, `FeaturedProjects`, `SkillsSection`, `CertificationsSection`, `ContactSection`, `FloatingFooter`, `VerticalTooltipNavbar` are no longer imported in `app/ai/page.tsx`.

- [ ] **Step 3: Manual smoke test**

Navigate to `/ai` — verify:
- Terminal shell renders full viewport
- Tab bar shows all 6 tabs
- Clicking `whoami` shows typed output
- Clicking other tabs switches content
- `$ ask Hello` at prompt streams a response
- `./agent` tab shows chat view
- Typing `$ help` shows command list
- Typing bare text sends as `$ ask`
- Page refresh restores chat history
- Reset button clears history
