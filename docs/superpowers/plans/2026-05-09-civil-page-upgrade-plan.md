# Civil Page Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `/civil` with vertical centering, dot-grid background, animated stats in hero, fluid spacing, and preserved skeleton loading.

**Architecture:** Modify 3 existing files — `MergedHero.tsx` gains animated stats from existing data, `app/civil/page.tsx` gets layout/background/spacing updates, `glowy-waves-hero-shadcnui.tsx` gets unused constants removed.

**Tech Stack:** Next.js 15, motion/react, Tailwind CSS, Lucide icons

---

### Task 1: Add animated stats row to MergedHero

**Files:**
- Modify: `components/MergedHero.tsx`

- [ ] **Step 1: Add imports and CounterNumber component**

Add after the existing imports in `components/MergedHero.tsx`:
```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, type Variants, useInView } from "motion/react";
import { ArrowUpRight, Linkedin, Mail, ArrowRight, Briefcase, Building2, DollarSign } from "lucide-react";
```

`CounterNumber` — add this component before `MergedHero`:
```tsx
function CounterNumber({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}
```

- [ ] **Step 2: Add stats data after the `titles` array**

Add after `const titles = useMemo(...)`:
```tsx
const stats = useMemo(
  () => [
    { icon: Briefcase, value: 8, suffix: "+", label: "Years Experience" },
    { icon: Building2, value: 50, suffix: "+", label: "Projects Delivered" },
    { icon: DollarSign, value: 1, suffix: "B+", label: "Total Value" },
  ],
  []
);
```

- [ ] **Step 3: Change the outer wrapper from `py-6 md:py-12` to no padding**

Replace:
```tsx
<div className="w-full py-6 md:py-12">
```
With:
```tsx
<div className="w-full">
```

- [ ] **Step 4: Add the stats row below the CTA buttons**

Insert after the closing `</motion.div>` of the CTA button group (after line 121) and before the image column:

```tsx
          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-10 pt-6 border-t border-border/40"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold leading-none">
                      <CounterNumber value={stat.value} suffix={stat.suffix} duration={2 + i * 0.3} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
```

- [ ] **Step 5: Remove unused imports if any**

Ensure `Mail` import is removed if no longer used (check the component — `Mail` was imported but the component uses `Linkedin` for the button, not `Mail`).

- [ ] **Step 6: Verify the file**

Run: `npx tsc --noEmit` (check for type errors)

Expected: No errors. `CounterNumber` uses `useInView` from motion/react, `useRef` and `useState` from react.

---

### Task 2: Update civil page layout, background, and spacing

**Files:**
- Modify: `app/civil/page.tsx`

- [ ] **Step 1: Add dot-grid background and vertical centering**

Replace the main element opening:
```tsx
<main className="min-h-screen relative overflow-x-hidden bg-background">
```
With:
```tsx
<main className="min-h-screen relative overflow-x-hidden bg-background">
  <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)] opacity-15 [background-size:20px_20px] dark:bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)]" />
```

- [ ] **Step 2: Add `justify-center` to the hero section wrapper**

The hero section currently has no vertical centering. The GlowyWavesHero component already has `justify-center`, so no change is needed there. Verify the hero content is centered by checking that the `section id="home"` wrapping `GlowyWavesHero` has no extra top padding.

- [ ] **Step 3: Replace fixed section spacing with fluid clamp**

Find:
```tsx
<div className="mx-auto w-full max-w-[1400px] px-6 md:px-24 lg:px-32 py-12 space-y-24 md:space-y-32">
```
Replace with:
```tsx
<div className="mx-auto w-full max-w-[1400px] px-6 md:px-24 lg:px-32 py-12 space-y-[clamp(4rem,8vw,8rem)]">
```

- [ ] **Step 4: Verify the page compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

---

### Task 3: Clean up unused constants in GlowyWavesHero

**Files:**
- Modify: `components/ui/glowy-waves-hero-shadcnui.tsx`

- [ ] **Step 1: Remove the `heroStats` array and `statsVariants`**

Delete lines 24-28 (the `heroStats` array):
```tsx
const heroStats: { label: string; value: string }[] = [
  { label: "Years Experience", value: "8+" },
  { label: "Projects Delivered", value: "50+" },
  { label: "Total Value", value: "$1B+" },
];
```

Also remove `statsVariants` if it exists (lines 40-43 in the original):
```tsx
const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 } },
};
```

- [ ] **Step 2: Remove unused import**

If `Sparkles` from lucide-react is only used in the heroStats/CTA areas (not in the canvas), remove it from imports. Check usage first — `Sparkles` is used in the JSX at the bottom of the component.

- [ ] **Step 3: Verify the file**

Run: `npx tsc --noEmit`
Expected: No errors. Component still renders correctly.

---

### Task 4: Manual testing

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify on mobile (375px)**
- Hero content is vertically centered
- Stats row shows below CTA buttons with animation on scroll
- Section spacing is proportional, not excessive
- Dot-grid background is visible behind content
- Timeline and certifications have 1500ms skeleton loading

- [ ] **Step 3: Verify on desktop (1440px)**
- Hero content is vertically centered with no empty bottom space
- Stats row is horizontally aligned with text (left-aligned or centered depending on viewport)
- Section spacing looks balanced
- No visual regressions in any section

- [ ] **Step 4: Commit**

```bash
git add app/civil/page.tsx components/MergedHero.tsx components/ui/glowy-waves-hero-shadcnui.tsx
git commit -m "feat: upgrade civil page with vertical centering, dot-grid, animated stats, fluid spacing"
```
