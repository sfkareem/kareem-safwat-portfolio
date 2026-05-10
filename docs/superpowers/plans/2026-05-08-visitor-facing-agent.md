# Visitor-Facing Autonomous Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Firebase + @google/genai chatbot with a Vercel-native autonomous agent using Vercel AI SDK + Neon + Upstash Redis + Resend.

**Architecture:** Single agent with 8 tool functions on a POST route handler. Tools read portfolio.json at runtime. Agent uses Vercel AI SDK streamText with Gemini. Contact form writes to Neon and sends via Resend.

**Tech Stack:** Next.js 15, Vercel AI SDK (`ai`, `@ai-sdk/google`), Neon (`@vercel/postgres`), Upstash Redis (`@upstash/redis`), Resend (`resend`), Vercel Analytics (`@vercel/analytics`), Vitest (testing)

---

### Task 1: Remove Firebase Files and Dependencies

**Files:**
- Modify: `package.json`
- Delete: `lib/firebase.ts`
- Delete: `firebase.json`
- Delete: `firestore.rules`
- Delete: `firebase-applet-config.json` (full path: `C:\Users\kareem\Desktop\My Projects\kareem-safwat-portfolio\firebase-applet-config.json`)

- [ ] **Step 1: Delete Firebase config files**

```bash
Remove-Item -LiteralPath "lib/firebase.ts" -ErrorAction SilentlyContinue; if ($?) { Remove-Item -LiteralPath "firebase.json" -ErrorAction SilentlyContinue }; if ($?) { Remove-Item -LiteralPath "firestore.rules" -ErrorAction SilentlyContinue }; if ($?) { Remove-Item -LiteralPath "firebase-applet-config.json" -ErrorAction SilentlyContinue }
```

- [ ] **Step 2: Remove Firebase deps and add new deps in package.json**

Edit `package.json`:
- Remove `"firebase": "^12.11.0"` from dependencies
- Remove `"@google/genai": "^1.17.0"` from dependencies
- Remove `"firebase-tools": "^15.0.0"` from devDependencies
- Add to dependencies: `"ai": "^4.3.0"`, `"@ai-sdk/google": "^1.2.0"`, `"@vercel/postgres": "^0.10.0"`, `"@upstash/redis": "^1.34.0"`, `"resend": "^4.1.0"`, `"@vercel/analytics": "^1.5.0"`
- Add to devDependencies: `"vitest": "^3.1.0"`, `"@vitejs/plugin-react": "^4.4.0"`

```json
"dependencies": {
    "@ai-sdk/google": "^1.2.0",
    "@gsap/react": "^2.1.2",
    "@hookform/resolvers": "^5.2.1",
    "@hugeicons/core-free-icons": "^4.0.0",
    "@hugeicons/react": "^1.1.6",
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-label": "^2.1.8",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tabler/icons-react": "^3.40.0",
    "@tsparticles/engine": "^3.9.1",
    "@tsparticles/react": "^3.0.0",
    "@tsparticles/slim": "^3.9.1",
    "@types/tinycolor2": "^1.4.6",
    "@upstash/redis": "^1.34.0",
    "@vercel/analytics": "^1.5.0",
    "@vercel/postgres": "^0.10.0",
    "ai": "^4.3.0",
    "autoprefixer": "^10.4.21",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "cobe": "^2.0.1",
    "gsap": "^3.14.2",
    "lenis": "^1.3.20",
    "lucide-react": "^0.553.0",
    "motion": "^12.23.24",
    "next": "^15.5.14",
    "next-themes": "^0.4.6",
    "postcss": "^8.5.6",
    "qr-code-styling": "^1.9.2",
    "react": "^19.2.1",
    "react-colorful": "^5.6.1",
    "react-dom": "^19.2.1",
    "react-markdown": "^10.1.0",
    "react-qr-code": "^2.0.18",
    "react-use-measure": "^2.1.7",
    "resend": "^4.1.0",
    "tailwind-merge": "^3.5.0",
    "tinycolor2": "^1.6.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "4.1.11",
    "@tailwindcss/typography": "^0.5.19",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^4.4.0",
    "cross-env": "^10.1.0",
    "eslint": "9.39.1",
    "eslint-config-next": "16.0.8",
    "tailwindcss": "4.1.11",
    "tw-animate-css": "^1.4.0",
    "typescript": "5.9.3",
    "vitest": "^3.1.0"
  }
```

- [ ] **Step 3: Install new dependencies**

```bash
npm install
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove Firebase and add Vercel-native agent dependencies"
```

---

### Task 2: Set Up Vitest and Create Config

**Files:**
- Create: `vitest.config.ts`
- Create: `lib/agent/__tests__/`

- [ ] **Step 1: Create vitest.config.ts**

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 2: Create test directory**

```bash
New-Item -ItemType Directory -Path "lib/agent/__tests__" -Force
```

- [ ] **Step 3: Verify vitest works**

```bash
npx vitest run --help
```

Expected: shows vitest help text (no error)

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts lib/agent/__tests__
git commit -m "chore: add vitest config and test directory"
```

---

### Task 3: Create lib/db.ts — Neon Client Wrapper

**Files:**
- Create: `lib/db.ts`

- [ ] **Step 1: Create lib/db.ts**

```typescript
import { sql } from "@vercel/postgres";

export async function saveContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  const { name, email, phone, message } = data;
  const result = await sql`
    INSERT INTO contacts (name, email, phone, message)
    VALUES (${name}, ${email}, ${phone ?? null}, ${message})
    RETURNING id, created_at
  `;
  return result.rows[0] as { id: string; created_at: string };
}

export async function createContactsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/db.ts
git commit -m "feat: add Neon client wrapper with contact inquiry support"
```

---

### Task 4: Create lib/redis.ts — Upstash Redis Client Wrapper

**Files:**
- Create: `lib/redis.ts`

- [ ] **Step 1: Create lib/redis.ts**

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const SESSION_TTL_MS = 1800; // 30 minutes in seconds
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60; // 60 seconds

export async function getSessionMessages(sessionId: string): Promise<{ role: string; content: string }[]> {
  const key = `session:${sessionId}:messages`;
  const raw = await redis.lrange(key, 0, -1);
  return raw.map((r: unknown) => {
    if (typeof r === "string") return JSON.parse(r);
    return r as { role: string; content: string };
  });
}

export async function appendSessionMessage(
  sessionId: string,
  message: { role: "user" | "assistant"; content: string }
) {
  const key = `session:${sessionId}:messages`;
  await redis.rpush(key, JSON.stringify(message));
  await redis.expire(key, SESSION_TTL_MS);
}

export async function checkRateLimit(
  sessionId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate:${sessionId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW_MS);
  }
  const remaining = Math.max(0, RATE_LIMIT_MAX - count);
  return { allowed: count <= RATE_LIMIT_MAX, remaining };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/redis.ts
git commit -m "feat: add Upstash Redis client wrapper for session and rate limiting"
```

---

### Task 5: Create lib/agent/tools.ts — Portfolio Tool Functions

**Files:**
- Create: `lib/agent/tools.ts`
- Create: `lib/agent/__tests__/tools.test.ts`

- [ ] **Step 1: Write the failing tests for tools**

Write to `lib/agent/__tests__/tools.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  getPortfolioOverview,
  getExperience,
  getSkills,
  getCertificationsByCategory,
  getProjects,
  getContactInfo,
  searchPortfolio,
} from "../tools";
import portfolioData from "@/data/portfolio.json";

describe("getPortfolioOverview", () => {
  it("returns name, title, tagline, and summary", () => {
    const result = getPortfolioOverview();
    expect(result).toHaveProperty("name");
    expect(result).toHaveProperty("title");
    expect(result).toHaveProperty("tagline");
    expect(result).toHaveProperty("summary");
    expect(result.name).toBe(portfolioData.personal.name);
  });
});

describe("getExperience", () => {
  it("returns all experience entries with required fields", () => {
    const result = getExperience();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(portfolioData.experience.length);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("company");
    expect(result[0]).toHaveProperty("startDate");
    expect(result[0]).toHaveProperty("endDate");
  });

  it("returns current role first", () => {
    const result = getExperience();
    expect(result[0].isCurrent).toBe(true);
  });
});

describe("getSkills", () => {
  it("returns both civil and ai expertise", () => {
    const result = getSkills();
    expect(result).toHaveProperty("civil");
    expect(result).toHaveProperty("ai");
    expect(result.civil.tools).toContain("CCS Candy");
    expect(result.ai.tools).toContain("Claude Code");
  });
});

describe("getCertificationsByCategory", () => {
  it("filters certifications by category", () => {
    const civil = getCertificationsByCategory("civil");
    const ai = getCertificationsByCategory("ai");
    expect(civil.every((c) => c.category === "civil")).toBe(true);
    expect(ai.every((c) => c.category === "ai")).toBe(true);
  });

  it("returns all certifications when no category", () => {
    const all = getCertificationsByCategory();
    expect(all.length).toBe(portfolioData.certifications.length);
  });
});

describe("getProjects", () => {
  it("returns projects array", () => {
    const result = getProjects();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("name");
    }
  });
});

describe("getContactInfo", () => {
  it("returns email and social links", () => {
    const result = getContactInfo();
    expect(result).toHaveProperty("email");
    expect(result).toHaveProperty("linkedin");
    expect(result).toHaveProperty("twitter");
  });
});

describe("searchPortfolio", () => {
  it("finds matching entries by keyword", () => {
    const result = searchPortfolio("CCS Candy");
    expect(result.length).toBeGreaterThan(0);
  });

  it("returns empty array for no match", () => {
    const result = searchPortfolio("xyznonexistent123");
    expect(result).toEqual([]);
  });

  it("is case insensitive", () => {
    const lower = searchPortfolio("claude code");
    const upper = searchPortfolio("CLAUDE CODE");
    expect(lower.length).toBeGreaterThan(0);
    expect(lower.length).toBe(upper.length);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run lib/agent/__tests__/tools.test.ts
```

Expected: FAIL (tool module not found yet)

- [ ] **Step 3: Create lib/agent/tools.ts**

```typescript
import portfolioData from "@/data/portfolio.json";

export function getPortfolioOverview() {
  const { personal, statistics } = portfolioData;
  return {
    name: personal.name,
    title: personal.title,
    tagline: personal.tagline,
    summary: personal.summary,
    professionalStatement: personal.professionalStatement,
    statistics,
  };
}

export function getExperience() {
  return portfolioData.experience;
}

export function getSkills() {
  return portfolioData.expertise;
}

export function getCertificationsByCategory(category?: "civil" | "ai") {
  if (!category) return portfolioData.certifications;
  return portfolioData.certifications.filter((c) => c.category === category);
}

export function getProjects() {
  return portfolioData.projects ?? [];
}

export function getContactInfo() {
  const { contact } = portfolioData.personal;
  return {
    email: contact.email,
    linkedin: contact.linkedin,
    twitter: contact.twitter,
    phone: contact.phone,
    whatsapp: contact.whatsapp,
  };
}

export function searchPortfolio(query: string) {
  const q = query.toLowerCase();
  const results: { section: string; match: string }[] = [];

  const searchObject = (obj: Record<string, unknown>, section: string) => {
    for (const value of Object.values(obj)) {
      if (typeof value === "string" && value.toLowerCase().includes(q)) {
        results.push({ section, match: value });
      } else if (typeof value === "object" && value !== null) {
        searchObject(value as Record<string, unknown>, section);
      }
    }
  };

  searchObject(portfolioData as unknown as Record<string, unknown>, "portfolio");
  return results;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run lib/agent/__tests__/tools.test.ts
```

Expected: PASS (all 12 tests passing)

- [ ] **Step 5: Commit**

```bash
git add lib/agent/tools.ts lib/agent/__tests__/tools.test.ts
git commit -m "feat: add portfolio tool functions with tests"
```

---

### Task 6: Create lib/agent/prompt.ts — System Prompt Builder

**Files:**
- Create: `lib/agent/prompt.ts`
- Create: `lib/agent/__tests__/prompt.test.ts`

- [ ] **Step 1: Write the failing test**

Write to `lib/agent/__tests__/prompt.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "../prompt";

describe("buildSystemPrompt", () => {
  it("returns a string", () => {
    const prompt = buildSystemPrompt();
    expect(typeof prompt).toBe("string");
  });

  it("contains Kareem's name", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("Kareem");
  });

  it("instructs to use tools", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.toLowerCase()).toContain("tool");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run lib/agent/__tests__/prompt.test.ts
```

Expected: FAIL

- [ ] **Step 3: Create lib/agent/prompt.ts**

```typescript
import { getPortfolioOverview } from "./tools";

export function buildSystemPrompt(): string {
  const overview = getPortfolioOverview();
  return `You are Kareem Safwat's AI assistant on his portfolio site (kareemsf.vercel.app).

Your purpose is to help visitors understand Kareem's qualifications, experience, and skills. You are helpful to:
- Engineers evaluating his technical depth
- Recruiters looking for candidates in quantity surveying, cost estimation, and AI software development

IDENTITY: ${overview.name} — ${overview.title} (${overview.tagline})

RULES:
1. Use tools to answer questions — never guess or invent information.
2. Be concise and direct. Engineers and recruiters value brevity.
3. If asked about something not in Kareem's portfolio data, say you don't have that information and offer to connect them via the contact form.
4. You can discuss both his Civil Engineering path and his AI Vibe Coding / Agentic Software Development path.
5. For contact inquiries, guide users to use the contact form tool.`;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run lib/agent/__tests__/prompt.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/agent/prompt.ts lib/agent/__tests__/prompt.test.ts
git commit -m "feat: add system prompt builder with tests"
```

---

### Task 7: Create app/api/chat/route.ts — Agent Route Handler

**Files:**
- Create: `app/api/chat/route.ts`

- [ ] **Step 1: Create app/api/chat/route.ts**

```typescript
import { google } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/agent/prompt";
import {
  getPortfolioOverview,
  getExperience,
  getSkills,
  getCertificationsByCategory,
  getProjects,
  getContactInfo,
  searchPortfolio,
} from "@/lib/agent/tools";
import { getSessionMessages, appendSessionMessage, checkRateLimit } from "@/lib/redis";

export async function POST(req: Request) {
  const { messages, sessionId } = await req.json();

  if (!sessionId) {
    return Response.json({ error: "sessionId required" }, { status: 400 });
  }

  const { allowed, remaining } = await checkRateLimit(sessionId);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please wait before sending another message." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const systemPrompt = buildSystemPrompt();
  const history = await getSessionMessages(sessionId);

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: systemPrompt,
    messages: [...history, ...messages],
    tools: {
      getPortfolioOverview: tool({
        description: "Get Kareem's name, title, tagline, and professional summary",
        parameters: z.object({}),
        execute: async () => getPortfolioOverview(),
      }),
      getExperience: tool({
        description: "Get Kareem's complete work history including current role",
        parameters: z.object({}),
        execute: async () => getExperience(),
      }),
      getSkills: tool({
        description: "Get Kareem's technical skills and tools for both civil engineering and AI development",
        parameters: z.object({}),
        execute: async () => getSkills(),
      }),
      getCertifications: tool({
        description: "Get Kareem's certifications, optionally filtered by category (civil or ai)",
        parameters: z.object({
          category: z.enum(["civil", "ai"]).optional().describe("Filter by category"),
        }),
        execute: async ({ category }) => getCertificationsByCategory(category),
      }),
      getProjects: tool({
        description: "Get Kareem's featured projects",
        parameters: z.object({}),
        execute: async () => getProjects(),
      }),
      getContactInfo: tool({
        description: "Get Kareem's email, LinkedIn, Twitter, and phone numbers",
        parameters: z.object({}),
        execute: async () => getContactInfo(),
      }),
      searchPortfolio: tool({
        description: "Search across all portfolio data for a keyword",
        parameters: z.object({
          query: z.string().describe("Keyword to search for"),
        }),
        execute: async ({ query }) => searchPortfolio(query),
      }),
    },
    onFinish: async ({ response }) => {
      const lastMsg = response.messages[response.messages.length - 1];
      if (lastMsg?.role === "assistant") {
        const content = lastMsg.content.map((c) => c.text).join("");
        await appendSessionMessage(sessionId, { role: "assistant", content });
      }
    },
  });

  return result.toDataStreamResponse();
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "feat: add agent chat route handler with tools and rate limiting"
```

---

### Task 8: Rewrite AIChatWidget to Use Vercel AI SDK useChat

**Files:**
- Modify: `components/ui/AIChatWidget.tsx`

- [ ] **Step 1: Rewrite AIChatWidget.tsx**

Replace the entire file with:

```typescript
"use client";

import React, { useEffect } from "react";
import { useChat } from "ai/react";
import { MessageCircle, X, Send, Bot, User, Loader2, RefreshCcw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";

let sessionId = "";
function getSessionId() {
  if (sessionId) return sessionId;
  const stored = localStorage.getItem("agent-session-id");
  if (stored) {
    sessionId = stored;
    return sessionId;
  }
  sessionId = crypto.randomUUID();
  localStorage.setItem("agent-session-id", sessionId);
  return sessionId;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, error } =
    useChat({
      api: "/api/chat",
      body: { sessionId: getSessionId() },
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Hello! I'm your Agentic Portfolio Assistant. How can I help you explore Kareem's work today?",
        },
      ],
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello! I'm your Agentic Portfolio Assistant. How can I help you explore Kareem's work today?",
      },
    ]);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed bottom-24 md:bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            key="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
            className="bg-primary/90 backdrop-blur-sm text-primary-foreground p-4 rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            <MessageCircle />
          </motion.button>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden"
          >
            <div className="p-4 flex justify-between items-center bg-background/50">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-sm">AI Assistant</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Start fresh"
                  aria-label="Clear chat"
                  className="hover:bg-muted p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close chat"
                  className="hover:bg-muted p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-2 group",
                    m.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {m.role === "assistant" && (
                    <Bot className="w-6 h-6 mt-1 text-primary shrink-0" />
                  )}
                  <div className="relative max-w-[80%]">
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm prose prose-sm dark:prose-invert",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50"
                      )}
                    >
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                    {m.role === "assistant" && m.content && (
                      <button
                        onClick={() => copyToClipboard(m.content, i)}
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                        title="Copy message"
                      >
                        {copiedIndex === i ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    )}
                  </div>
                  {m.role === "user" && (
                    <User className="w-6 h-6 mt-1 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center text-muted-foreground text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              )}
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
                  Sorry, I'm having trouble connecting right now.
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-border/50 flex gap-2 bg-background/50"
            >
              <input
                value={input}
                onChange={handleInputChange}
                className="flex-1 bg-transparent border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ask about Kareem..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/AIChatWidget.tsx
git commit -m "feat: rewrite AIChatWidget to use Vercel AI SDK useChat hook"
```

---

### Task 9: Rewrite lets-work-section.tsx — Firestore to Neon

**Files:**
- Modify: `components/ui/lets-work-section.tsx`

- [ ] **Step 1: Replace Firestore imports and submit handler**

Change the imports at line 1-9 from:

```typescript
import { db, handleFirestoreError, OperationType } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
```

To:

```typescript
import { saveContactInquiry } from "@/lib/db"
```

Change the `handleSubmit` function (lines 45-64) from:

```typescript
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
```

To:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      await saveContactInquiry(formData)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      console.error("Contact save error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/lets-work-section.tsx
git commit -m "feat: replace Firestore contact form with Neon via @vercel/postgres"
```

---

### Task 10: Remove Firebase Side-Effect Imports from Pages

**Files:**
- Modify: `app/page.tsx` — remove `import "@/lib/firebase"`
- Modify: `app/ai/page.tsx` — remove `import "@/lib/firebase"`
- Modify: `app/civil/page.tsx` — remove `import "@/lib/firebase"` (if exists)

- [ ] **Step 1: Remove Firebase import from app/page.tsx**

Read `app/page.tsx`, find and remove the line `import "@/lib/firebase"` (or similar firebase side-effect import).

- [ ] **Step 2: Remove Firebase import from app/ai/page.tsx**

In `app/ai/page.tsx` line 10, remove:
```typescript
import "@/lib/firebase";
```

- [ ] **Step 3: Check and clean app/civil/page.tsx**

Read `app/civil/page.tsx` and remove any Firebase import if present.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/ai/page.tsx app/civil/page.tsx
git commit -m "chore: remove Firebase side-effect imports from pages"
```

---

### Task 11: Add Vercel Analytics

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Analytics import and component to root layout**

Read `app/layout.tsx` first. Then add:

```typescript
import { Analytics } from "@vercel/analytics/react";
```

And add `<Analytics />` inside the body (before closing tag).

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add Vercel Analytics replacing Firebase Analytics"
```

---

### Task 12: Add Environment Variables and Build Verification

**Files:**
- Create or modify: `.env.local` (do NOT commit if it doesn't exist — add to .gitignore if needed)

- [ ] **Step 1: Create .env.local with required variables**

```bash
@"
GEMINI_API_KEY="your_gemini_api_key_here"
NEON_DATABASE_URL=
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=
RESEND_API_KEY=
"@ | Set-Content -Path ".env.local"
```

(Values with `=` are placeholders for production — fill in actual Neon, Upstash, Resend credentials.)

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: ALL PASS

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Successful build with no errors

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: add environment variables and finalize agent implementation"
```
