# Kareem Safwat — Portfolio

Personal portfolio of Kareem Safwat — Senior Quantity Surveyor & AI Vibe Coder.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** Vercel AI SDK + Google Gemini
- **Database:** Vercel Postgres + Upstash Redis
- **Animations:** Framer Motion, GSAP, Lenis

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — dual identity hero, stats, experience |
| `/civil` | Full civil/QS portfolio |
| `/ai` | AI terminal — interactive chat powered by Gemini |
| `/ai/prototype` | AI chat prototype (3 modes) |
| `/businesscard` | Digital vCard |

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and set:
- `GEMINI_API_KEY` — Gemini API key (AI chat)
- `APP_URL` — Your deployment URL

## Build

```bash
npm run build   # Production build
npm run lint    # ESLint
```