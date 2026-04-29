# Smooth Scroll Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix laggy/janky mobile scrolling by migrating from manual Lenis (`new Lenis()` + custom RAF) to official ReactLenis integration (`lenis/react`).

**Architecture:** Replace `components/SmoothScroll.tsx` with `components/ReactLenisProvider.tsx` that wraps the app using `<ReactLenis root>`. Update `app/layout.tsx` to use the new provider and import Lenis CSS. Update `app/globals.css` with Lenis hooks and scroll-padding for fixed nav compensation.

**Tech Stack:** Next.js 15, React 19, Lenis 1.3.20, TypeScript, Tailwind CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `components/ReactLenisProvider.tsx` | **Create** | Wraps app with `<ReactLenis root options={{...}}>`, handles `prefers-reduced-motion` |
| `app/layout.tsx` | **Modify** | Replace `<SmoothScroll />` with `<ReactLenisProvider>`, import `'lenis/dist/lenis.css'` |
| `app/globals.css` | **Modify** | Add Lenis CSS hooks (`html.lenis`, `.lenis-smooth`, etc.) and `scroll-padding-top` |
| `components/SmoothScroll.tsx` | **Delete** | Superseded by ReactLenisProvider |

---

### Task 1: Create ReactLenisProvider Component

**Files:**
- Create: `components/ReactLenisProvider.tsx`

**Context:** This component replaces `SmoothScroll.tsx`. It uses the official `ReactLenis` component from `lenis/react` which handles RAF internally and avoids scheduler conflicts. It also checks `prefers-reduced-motion` to disable smooth scroll for users who need it.

- [ ] **Step 1: Write the component**

Create `components/ReactLenisProvider.tsx` with this exact content:

```typescript
'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export function ReactLenisProvider({ children }: { children: React.ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When reduced motion is preferred, render children without Lenis
  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1,
        wheelMultiplier: 1,
        anchors: true,
        allowNestedScroll: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 2: Verify the file was created**

Run: `type components\ReactLenisProvider.tsx`
Expected: File contents displayed

- [ ] **Step 3: Commit**

```bash
git add components/ReactLenisProvider.tsx
git commit -m "feat: add ReactLenisProvider component

- Uses official ReactLenis from lenis/react
- Enables syncTouch for mobile smooth scroll
- Reduces touchMultiplier from 2 to 1
- Adds prefers-reduced-motion support"
```

---

### Task 2: Update app/layout.tsx

**Files:**
- Modify: `app/layout.tsx`

**Context:** Remove the old `<SmoothScroll />` import and usage. Add the new `ReactLenisProvider` import and Lenis CSS import. Wrap `{children}` with the provider.

- [ ] **Step 1: Read current layout.tsx**

Run: `type app\layout.tsx`

- [ ] **Step 2: Apply the changes**

Edit `app/layout.tsx` to make these exact changes:

**Remove this import:**
```typescript
import { SmoothScroll } from '@/components/SmoothScroll';
```

**Add these imports:**
```typescript
import { ReactLenisProvider } from '@/components/ReactLenisProvider';
import 'lenis/dist/lenis.css';
```

**Replace this JSX:**
```tsx
          <SmoothScroll />
          <div id="main-content">
            {children}
          </div>
```

**With this JSX:**
```tsx
          <ReactLenisProvider>
            <div id="main-content">
              {children}
            </div>
          </ReactLenisProvider>
```

The full modified `app/layout.tsx` should look like:

```typescript
import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/theme-provider';
import { AIChatWidget } from '@/components/ui/AIChatWidget';
import { ReactLenisProvider } from '@/components/ReactLenisProvider';
import 'lenis/dist/lenis.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Kareem Safwat | Senior Quantity Surveyor & AI Vibe Coder',
  description: 'Portfolio of Kareem Safwat, Senior Quantity Surveyor and AI Vibe Coder specializing in Agentic Software Development. 9+ years of experience in cost management and AI-powered workflows.',
  keywords: [
    'Kareem Safwat',
    'Senior Quantity Surveyor',
    'AI Vibe Coder',
    'Agentic Software Development',
    'Cost Estimation',
    'Tendering',
    'AI Workflows',
    'Full Stack Web Apps',
  ],
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased selection:bg-primary/30 selection:text-primary">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md">
          Skip to main content
        </a>
        <Script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js" strategy="lazyOnload" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactLenisProvider>
            <div id="main-content">
              {children}
            </div>
          </ReactLenisProvider>
          <AIChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the diff**

Run: `git diff app/layout.tsx`
Expected: Shows removal of `SmoothScroll` import, addition of `ReactLenisProvider` import and `lenis.css`, replacement of `<SmoothScroll />` with `<ReactLenisProvider>` wrapper

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "refactor(layout): replace SmoothScroll with ReactLenisProvider

- Remove SmoothScroll import and usage
- Add ReactLenisProvider and lenis.css imports
- Wrap main content with ReactLenisProvider"
```

---

### Task 3: Update globals.css with Lenis Hooks

**Files:**
- Modify: `app/globals.css`

**Context:** Lenis adds CSS classes to `html` and `body` when active. We need to add rules that Lenis expects, plus `scroll-padding-top` so anchor links don't land behind the fixed nav.

- [ ] **Step 1: Append Lenis CSS to globals.css**

Add this exact block to the **end** of `app/globals.css`:

```css
/* Lenis smooth scroll */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}

/* Fixed nav scroll compensation */
html {
  scroll-padding-top: 80px;
}
```

- [ ] **Step 2: Verify the file**

Run: `type app\globals.css`
Expected: File ends with the Lenis CSS block above

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style(globals): add Lenis CSS hooks and scroll-padding-top

- Add Lenis-specific CSS classes (html.lenis, .lenis-smooth, etc.)
- Add scroll-padding-top: 80px for fixed nav compensation"
```

---

### Task 4: Delete SmoothScroll.tsx

**Files:**
- Delete: `components/SmoothScroll.tsx`

**Context:** This file is no longer needed. The manual `new Lenis()` + custom RAF loop is superseded by `ReactLenisProvider`.

- [ ] **Step 1: Delete the file**

```bash
git rm components/SmoothScroll.tsx
```

- [ ] **Step 2: Verify it's gone**

Run: `dir components\SmoothScroll.tsx 2>nul || echo "File deleted"`
Expected: `File deleted`

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: delete SmoothScroll component

- Superseded by ReactLenisProvider
- Manual Lenis + RAF loop replaced by official React integration"
```

---

### Task 5: Build and Verify

**Files:**
- All modified files

**Context:** Run the build to catch TypeScript errors, then verify the app starts.

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: Build completes successfully with no errors.

If you see this error:
```
Module not found: Can't resolve 'lenis/react'
```

It means `lenis` needs to be re-installed. Run:
```bash
npm install lenis@^1.3.20
```

Then retry `npm run build`.

- [ ] **Step 2: Start dev server and smoke test**

```bash
npm run dev
```

Open the app in a browser. Verify:
1. Page loads without console errors
2. Scroll feels smooth (no jank)
3. Anchor links (if accessible on the page) smooth-scroll to sections

- [ ] **Step 3: Commit (if build passed)**

```bash
git add -A
git commit -m "build: verify smooth scroll migration compiles and runs"
```

---

## Self-Review

### Spec Coverage

| Spec Requirement | Implementing Task |
|-----------------|-------------------|
| Eliminate mobile scroll jank | Task 1 (`syncTouch: true`, `autoRaf: true`) |
| Enable smooth anchor-link scrolling | Task 1 (`anchors: true`) |
| Respect `prefers-reduced-motion` | Task 1 (`prefersReducedMotion` conditional) |
| Prevent hijacking nested scrollables | Task 1 (`allowNestedScroll: true`) |
| Reduce custom code | Task 4 (delete manual Lenis file) |
| Import Lenis CSS | Task 2 (`import 'lenis/dist/lenis.css'`) |
| Fixed nav scroll compensation | Task 3 (`scroll-padding-top: 80px`) |

**Coverage: 7/7 — all requirements have implementing tasks.**

### Placeholder Scan

- No TBD, TODO, or incomplete sections ✅
- All code blocks contain exact code ✅
- All file paths are exact ✅
- No vague instructions like "add appropriate error handling" ✅

### Type Consistency

- `ReactLenisProvider` props: `{ children: React.ReactNode }` — consistent across file ✅
- Lenis options keys match official API (`lerp`, `duration`, `syncTouch`, etc.) ✅
- `prefers-reduced-motion` check uses `MediaQueryListEvent` type ✅

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-04-29-smooth-scroll-fix.md`.**

Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
