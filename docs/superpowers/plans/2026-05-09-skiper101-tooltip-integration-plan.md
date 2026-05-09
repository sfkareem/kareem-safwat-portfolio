# Skiper101 Tooltip Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Radix tooltip wrapper with skiper101's custom tooltip and simplify consumers.

**Architecture:** Install skiper101 via shadcn CLI, copy its components into `components/ui/tooltip.tsx` with `showArrow` backward compat, then remove outer `TooltipProvider` wrappers from consumers and delete the skiper-ui directory.

**Tech Stack:** Next.js 15, shadcn CLI v4, @radix-ui/react-tooltip, Tailwind CSS v4, motion/react

---

### Task 1: Install skiper101, replace tooltip.tsx, clean up, update consumers

**Files:**
- Create: `components.json` (by shadcn CLI)
- Create then delete: `components/ui/skiper-ui/skiper101.tsx`
- Modify: `components/ui/tooltip.tsx`
- Modify: `components/ui/share-qr-code.tsx`
- Modify: `components/ui/quick-tooltip-actions.tsx`

- [ ] **Step 1: Install skiper101 via shadcn CLI**

Run:
```powershell
npx --yes shadcn add @skiper-ui/skiper101 -y
```

Expected output:
- CLI confirms component created at `components/ui/skiper-ui/skiper101.tsx`
- A `components.json` file is created in the project root

If `-y` doesn't work, try piping input:
```powershell
"y" | npx shadcn add @skiper-ui/skiper101
```

- [ ] **Step 2: Read the installed skiper101 source**

Run: `Get-Content -LiteralPath "components/ui/skiper-ui/skiper101.tsx" -Raw`

This shows the full component source. The component exports: `Skiper102`, `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`.

- [ ] **Step 3: Replace `components/ui/tooltip.tsx` with skiper101's content + showArrow compat**

Replace the entire file content at `components/ui/tooltip.tsx`:

```tsx
"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  showArrow,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  showArrow?: boolean;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "origin-(--radix-tooltip-content-transform-origin) animate-in bg-background text-foreground outline-border fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 group z-50 w-fit text-balance rounded-md px-3 py-1.5 text-xs outline-1",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow asChild>
          <span>
            <ArrowSvg />
          </span>
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

const ArrowSvg = (props: React.ComponentProps<"svg">) => (
  <svg
    width="20"
    height="10"
    viewBox="0 0 20 10"
    fill="none"
    className="ml-[1px] mt-[-1px]"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V0H0V2H1.4651C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"
      fill="var(--color-background)"
    />
    <path d="M11.1363 8.14124C10.3757 8.82575 9.22111 8.82578 8.46041 8.14122L3.60361 3.77011C3.05281 3.27432 2.33791 2.99999 1.59681 2.99999L4.24171 3L9.12941 7.39793C9.50971 7.7402 10.087 7.7402 10.4674 7.39793L15.3544 3L18 2.99999C17.2589 2.99999 16.544 3.27432 15.9931 3.77011L11.1363 8.14124Z" />
    <path
      d="M9.6667 6.65461L14.5235 2.28352C15.4416 1.45721 16.6331 1 17.8683 1H20V2H17.8683C16.8801 2 15.9269 2.36577 15.1924 3.02682L10.3356 7.39793C9.9553 7.74021 9.378 7.7402 8.9977 7.39793L4.1409 3.02682C3.4064 2.36577 2.4532 2 1.4651 2H0V1H1.4651C2.7002 1 3.8917 1.45722 4.8099 2.28352L9.6667 6.65461Z"
      fill="var(--color-border)"
    />
  </svg>
);
```

Note: `showArrow` is destructured out of `...props` so it never reaches the DOM element. The `Skiper102` demo component is NOT included in the exports (we don't need it and YAGNI).

- [ ] **Step 4: Delete the skiper-ui directory**

```powershell
Remove-Item -Recurse -Force -LiteralPath "components/ui/skiper-ui"
```

- [ ] **Step 5: Simplify `share-qr-code.tsx` — remove outer TooltipProvider wrappers**

There are 3 tooltip usages in this file. Each one wraps `<TooltipProvider><Tooltip>`. Remove the outer `<TooltipProvider>` and its closing tag from all 3 instances, keeping the `<Tooltip>` directly.

Replace each instance of:
```tsx
          <TooltipProvider>
            <Tooltip>
```
With:
```tsx
            <Tooltip>
```

And remove the corresponding `</TooltipProvider>` closing tag for each (3 changes total).

The file is at `components/ui/share-qr-code.tsx`. The tooltip usages are at lines 118-153, 189-221, and 256-288 (approximately).

- [ ] **Step 6: Simplify `quick-tooltip-actions.tsx` — remove outer TooltipProvider wrapper**

In `components/ui/quick-tooltip-actions.tsx`, lines 77-93:

Replace:
```tsx
      <TooltipProvider>
        <Tooltip key={ticker} delayDuration={0.2}>
```
With:
```tsx
        <Tooltip key={ticker} delayDuration={0.2}>
```

And remove the corresponding `</TooltipProvider>` closing tag.

- [ ] **Step 7: Verify TypeScript compiles**

Run:
```powershell
npx tsc --noEmit
```

Expected: No new errors (any pre-existing errors in `globe-pulse.tsx` and `splite.tsx` are unrelated).

- [ ] **Step 8: Verify build**

Run:
```powershell
npm run build
```

Expected: Build succeeds.

- [ ] **Step 9: Commit**

```powershell
git add components.json components/ui/tooltip.tsx components/ui/share-qr-code.tsx components/ui/quick-tooltip-actions.tsx docs/superpowers/specs/2026-05-09-skiper101-tooltip-integration-design.md docs/superpowers/plans/2026-05-09-skiper101-tooltip-integration-plan.md
git commit -m "feat: replace tooltip with skiper101 custom tooltip, simplify consumers"
```

Note: the skiper-ui directory and its files are deleted — git tracks the deletion automatically when you `git add` the removal.
