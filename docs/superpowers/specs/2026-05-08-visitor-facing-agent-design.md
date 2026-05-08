# Visitor-Facing Autonomous Agent — Design Spec

## Overview
Replace the existing Firebase + `@google/genai` passive chatbot with a Vercel-native autonomous agent that helps engineers evaluate Kareem's skills and recruiters find candidates. Remove all Firebase dependencies entirely.

## Stack
- **Framework**: Next.js 15 (App Router, output: `'standalone'`)
- **AI**: Vercel AI SDK (`@ai-sdk/google`) with Gemini API
- **Storage**: `data/portfolio.json` (read-only portfolio data), Neon / `@vercel/postgres` (contact inquiries only)
- **Session/Cache**: Upstash Redis (conversation history, rate limiting)
- **Email**: Resend
- **Analytics**: Vercel Analytics (replaces Firebase Analytics)
- **Deployment**: Vercel

## Architecture: Single Agent with Tool Functions

```
Visitor → AIChatWidget (useChat hook) → app/api/chat/route.ts
                                              ↓
                                    streamText({ model, system, tools, messages })
                                              ↓
                                    Agent loop: text reply or tool call
                                              ↓
                                    Tool executes → result streamed back
                                              ↓
                                    Response rendered in chat UI
```

### Route Handler (`app/api/chat/route.ts`)
- `POST` handler using `streamText` from Vercel AI SDK
- Gemini model via `@ai-sdk/google` using provided API key
- Tools registered inline; agent decides when to call them
- Rate-limited per session via Upstash (30 req / 60 sec sliding window)

### Tools (`lib/agent/tools.ts`)

| Tool | Reads from | Purpose |
|------|-----------|---------|
| `getPortfolioOverview` | `portfolio.json.personal` | Name, title, tagline, summary |
| `getExperience` | `portfolio.json.experience` | Full work history |
| `getSkills` | `portfolio.json.expertise` | Civil + AI skills/tools |
| `getCertifications` | `portfolio.json.certifications` | All certs grouped by category |
| `getProjects` | `portfolio.json.projects` | Notable projects |
| `getContactInfo` | `portfolio.json.personal.contact` | Email, socials, location |
| `saveContactInquiry` | Writes to Neon `contacts` table + sends email via Resend | Name, email, message |
| `searchPortfolio` | Case-insensitive keyword matching across all `portfolio.json` string values | Free-text search |

All read-only tools import `portfolio.json` directly at runtime. No database calls for portfolio data.

### System Prompt (`lib/agent/prompt.ts`)
- Persona: "You are Kareem's AI assistant on his portfolio site. You help engineers evaluate his qualifications and recruiters find candidates."
- JSON identity summary (1-2 lines) so agent can answer "who are you?" without a tool call
- Instructions to use tools rather than guess, be concise but thorough

### Session & State
- **Upstash Redis**: conversation history keyed by `sessionId`, TTL 30 min
- Last messages included in context window per request, up to ~4000 tokens of conversation history
- Key schema: `session:{sessionId}:messages`

### AIChatWidget Rewrite
- **Before**: `@google/genai` manual API call, no streaming
- **After**: `useChat` from `ai/react`, streams from `app/api/chat/route.ts`
- Same floating UI, same position, same trigger button
- Markdown rendering for tool responses
- Loading indicator during streaming

## Data Flow

1. Visitor opens site → AIChatWidget mounts, acquires `sessionId` (localStorage or cookie)
2. Visitor types message → `useChat` sends POST to `/api/chat` with `{ messages, sessionId }`
3. Route handler: check rate limit (Redis) → build system prompt + message history → call `streamText`
4. Agent loop: Gemini responds with text or tool call → SDK executes tool → tool result fed back → final response streamed
5. Streamed chunks rendered in chat UI
6. On each turn, conversation appended to Redis

## Error Handling
- **LLM failure**: catch in route handler → return 503 `{ error: "Service temporarily unavailable" }`
- **Tool failure**: each tool returns `{ error: string }`; agent relays gracefully
- **Rate limit**: return 429 with `retry-after` header; widget shows "Too many requests" message
- **Redis failure**: agent works without session history (shorter context, no degradation)
- **Neon failure**: `saveContactInquiry` returns "Could not save. Please email directly."
- **Portfolio file not found**: tools return clear "Data unavailable" — agent apologizes

## File Changes

### Delete
- `lib/firebase.ts`
- `firebase.json`
- `firestore.rules`
- `firebase-applet-config.json`
- `firebase-blueprint.json` (if exists)
- `@google/genai` from package.json
- `firebase` and `firebase-tools` from package.json

### Create
- `app/api/chat/route.ts` — POST handler with tools
- `lib/agent/tools.ts` — all 8 tool definitions
- `lib/agent/prompt.ts` — system prompt construction
- `lib/db.ts` — Neon client wrapper (`@vercel/postgres`)
- `lib/redis.ts` — Upstash Redis client wrapper

### Modify
- `components/ui/AIChatWidget.tsx` — rewrite to use `useChat` from `ai/react`
- `components/ui/lets-work-section.tsx` — replace Firestore `addDoc` with Neon `INSERT`
- `app/page.tsx` — remove `import "@/lib/firebase"`
- `app/ai/page.tsx` — remove `import "@/lib/firebase"`
- `app/civil/page.tsx` — remove `import "@/lib/firebase"` (if it exists)
- `package.json` — remove Firebase deps, add `@ai-sdk/google`, `@vercel/postgres`, `ai`, `@upstash/redis`, `resend`, `@vercel/analytics`

### Keep
- `data/portfolio.json` — source of truth for all portfolio data (now includes `projects` array)

## Environment Variables

```
GEMINI_API_KEY=...
NEON_DATABASE_URL=...
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...
RESEND_API_KEY=...
```

## Testing
- Tool unit tests: mock `portfolio.json`, assert output shape per tool
- Chat route: POST with sample messages, assert streaming response
- Rate limiting: hit 31 times, assert 429
- Contact flow: call `saveContactInquiry`, verify Neon row + Resend email
