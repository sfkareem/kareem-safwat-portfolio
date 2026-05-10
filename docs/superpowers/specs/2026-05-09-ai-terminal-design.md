# AI Page Terminal Overhaul

## Overview

Replace the existing `/ai` scrollable page with a full-viewport interactive terminal. All portfolio sections (about, projects, skills, certs, contact) are accessed as terminal commands or tab clicks. AI chat is built in via `$ ask <question>` with a dedicated `./agent` tab for multi-turn conversations.

## Architecture

**Approach: Component decomposition** (`app/ai/page.tsx`)

```
app/ai/
  page.tsx            ← TerminalShell wrapper (full viewport)
  layout.tsx          ← existing (metadata unchanged)

components/terminal/
  TerminalShell.tsx   ← outer chrome: window controls, tab bar, content area, prompt bar, footer
  TerminalBody.tsx    ← scrollable display area (switches between render/chat modes)
  TypewriterText.tsx  ← character-by-character reveal hook + component
  TerminalChat.tsx    ← ./agent tab full chat view + $ ask inline responses
  WelcomeMessage.tsx  ← ./assistant --interactive startup sequence
  ResetButton.tsx     ← clears localStorage chat history + resets terminal

app/api/
  prototype/
    route.ts          ← reuse existing: proxies to Gemini SSE (move from /prototype to /ai namespace)

data/
  terminal-content.ts ← static text content for each tab (pulled from portfolio.json)
```

## Terminal Shell (`TerminalShell.tsx`)

- Full viewport (`h-screen`), dark theme (`bg-zinc-950 text-zinc-100 font-mono`), no overflow on body
- Top bar: macOS window dots (red/yellow/green), title `ai/terminal`
- Tab bar: 6 pill buttons — `whoami`, `repos`, `~/stack`, `certs`, `./reach`, `./agent`
- Active tab gets `bg-zinc-800 border-zinc-600`, inactive uses `bg-transparent border-zinc-800`
- Footer strip: `gemini-3.1-flash-lite-preview · N messages`

### Tab Commands

| Tab | Equivalent command | Data source |
|---|---|---|
| `whoami` | `$ whoami` | portfolio.json `personal` (name, title, tagline, summary, stats) |
| `repos` | `$ repos` / `$ ls repos` | portfolio.json `projects` |
| `~/stack` | `$ ~/stack` / `$ cat ~/stack` | portfolio.json `expertise.ai` |
| `certs` | `$ certs` / `$ ls certs` | portfolio.json `certifications` (filtered `ai`) |
| `./reach` | `$ ./reach` | portfolio.json `contact` + `availability` |
| `./agent` | `$ ./agent` | AI chat interface |

Tab click or typed command both produce the same result: the terminal body shows `$ <command>` then typing animation renders the content.

## Command Execution & Typing Animation

### `TypewriterText` Hook

```ts
function useTypewriter(text: string, speed = 25): { displayed: string; isTyping: boolean }
```

- Incrementally reveals `text` character by character at `speed` ms intervals
- Returns `displayed` (current substring) and `isTyping` (still animating)
- Cancelling: calling the hook with new text resets the animation immediately

### Content Definitions (`terminal-content.ts`)

Each tab maps to a function that returns formatted text:

```
whoami   →  $ whoami
             ─────────────────────────────────
             Name:       Kareem Safwat
             Title:      Senior Quantity Surveyor / AI Vibe Coder
             Tagline:    Constructing Value & Control
             Experience: 9+ years (Civil) · 3+ years (AI)
             ─────────────────────────────────
             <summary paragraph>

repos    →  $ repos
             ─────────────────────────────────
             Controls Academy
             URL:  https://controlsacademy.net/
             Tech: React, Next.js, AI Vibe Coding, Agentic Software Dev
             ─────────────────────────────────
             <description>

~/stack  →  $ cat ~/stack
             ─────────────────────────────────
             TOOLS
               Claude Code, Anthropic API, Cursor
             
             TECHNICAL SKILLS
               AI Vibe Coding, Agentic Software Development, ...

certs    →  $ ls certs
             ─────────────────────────────────
             1. Claude Code in Action         [Anthropic · 2026]
             2. Claude 101                    [Anthropic · 2026]
             3. AI Fluency                    [Anthropic · 2026]
             4. Claude with Anthropic API     [Anthropic · 2026]
             
./reach  →  $ ./reach
             ─────────────────────────────────
             Email:    kareemsf1995@gmail.com
             Phone:    +20 101 817 1342 (EG) / +966 53 726 2745 (KSA)
             LinkedIn: linkedin.com/in/kareemsafwat/
             X:        @Sf_Kareem
             Status:   Available for Work
```

## Input / Prompt System

### Always-Visible Prompt Bar

Pinned to the bottom of the terminal content area (not fixed to viewport — scrolls with content):

```
$ _
```

Commands:
- `$ whoami` → switches to whoami tab, triggers typing animation
- `$ repos` → switches to repos tab
- `$ ~/stack` → switches to stack tab
- `$ certs` → switches to certs tab
- `$ ./reach` → switches to reach tab
- `$ ./agent` → switches to agent chat tab
- `$ ask <question>` → sends AI question (stays on current tab)
- `$ help` → prints command reference
- `$ clear` → clears terminal output
- bare text (no `$`) → auto-interpreted as `$ ask <text>`

The prompt bar is **always present** in browse mode and **replaced by a persistent input bar** in `./agent` chat mode.

## AI Chat System

### `$ ask <question>` from Any Tab

- The prompt line accepts `$ ask <question>` from any tab
- Question appears as: `$ ask what projects use React?`
- Answer streams in below the question
- All `$ ask` messages (user + assistant) are duplicated into the `./agent` tab's conversation history for continuity

### `./agent` Tab — Full Chat Mode

- Switches to a dedicated chat layout:
  - Scrollable conversation history
  - Persistent input bar pinned at bottom
  - Messages displayed with `>` prefix (assistant) and `$` prefix (user)
  - Streaming indicator (pulsing dot) while waiting for response
- Uses same SSE proxy as the prototype (`/api/prototype`)
- Abort controller for cancelling mid-stream

### Context Injection

When `$ ask` is typed while on a specific tab, the API request includes context about what the user is viewing:
- `whoami` → "User is viewing Kareem's bio/about section"
- `repos` → "User is viewing projects"
- `~/stack` → "User is viewing the tech stack"
- `certs` → "User is viewing certifications"
- `./reach` → "User is viewing contact info"
- `./agent` → (no extra context — dedicated chat)

System prompt always includes Kareem's full bio + portfolio summary so the AI can answer accurately.

## LocalStorage Persistence

- Chat history (all messages from all `$ ask` queries + `./agent` conversations) is persisted in `localStorage` under key `ai-terminal-history`
- Format: `{ id, role, content, timestamp }[]`
- On page load: restore conversation history
- A reset button (trash icon or `$ reset`) clears `localStorage` and resets the terminal to initial state
- Confirmation prompt before clearing: "Clear all chat history? This cannot be undone."

## API Route

Reuse `app/api/prototype/route.ts` as-is with minor refactoring:
- Remove hardcoded API key fallback — rely solely on `.env` (`GEMINI_API_KEY`)
- The SSE streaming proxy already works and needs no other changes

## Welcome Sequence

On first load (or after `$ reset`), the terminal displays:
```
$ ./assistant --interactive
> Type your questions to learn about Kareem's work.
> Hello! I'm Kareem's AI assistant. Ask me anything about his work, skills, or experience.
```
This plays once with typing animation. On subsequent loads, restored history begins from the last conversation.

## Implementation Order

1. Create `terminal-content.ts` — static text formatters for each tab
2. Create `TypewriterText.tsx` — useTypewriter hook
3. Create `TerminalBody.tsx` — scrollable display, command routing
4. Create `TerminalShell.tsx` — chrome, tab bar, wiring
5. Create `TerminalChat.tsx` — full chat mode for `./agent` tab
6. Create `ResetButton.tsx` — localStorage clear
7. Rewrite `app/ai/page.tsx` — replace existing sections with `TerminalShell`
8. Clean up `app/api/prototype/route.ts` — remove hardcoded key, optionally rename
9. Remove unused components: `AIHeroTerminal`, `FeaturedProjects`, `SkillsSection`, `CertificationsSection`, `ContactSection` (verify no other page imports them)
