# Home Page Fluid Responsive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the `/` route full viewport and fully responsive to any screen size using fluid `clamp()` typography/spacing, replace Riyadh→Cairo, and remove QR "Share Card" text.

**Architecture:** Replace all fixed breakpoint font sizes/sizes with `clamp()` values using inline styles. Two files modified — `app/page.tsx` (typography, spacing, text) and `components/ui/qr-share.tsx` (remove label, fluid icon size). No new dependencies.

**Tech Stack:** Next.js 15, Tailwind CSS v4, lucide-react

---

### File Structure

| File | Responsibility |
|---|---|
| `app/page.tsx` | Home page layout with fluid typography, spacing, and Cairo text |
| `components/ui/qr-share.tsx` | QR download button with fluid sizing, no label |

---

### Task 1: Update QR Share Component

**Files:**
- Modify: `components/ui/qr-share.tsx`

- [ ] **Step 1: Remove "Share Card" span and make icon fluid**

Replace the button's children and className to remove the "Share Card" text and make the QR container size fluid:

```tsx
"use client";

import React from "react";
import QRCodeStyling from "qr-code-styling";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QRShareProps {
  url: string;
}

export const QRShare = ({ url }: QRShareProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [qrCode, setQrCode] = React.useState<QRCodeStyling | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    const qr = new QRCodeStyling({
      width: 64,
      height: 64,
      data: url,
      type: "svg",
      margin: 0,
      backgroundOptions: {
        color: "transparent",
      },
      dotsOptions: {
        color: "currentColor",
        type: "rounded"
      },
      cornersSquareOptions: {
        color: "currentColor",
        type: "extra-rounded"
      }
    });

    setQrCode(qr);
    qr.append(ref.current);
  }, [url]);

  const handleDownloadPng = () => {
    if (qrCode) qrCode.download({ extension: "png", name: "business-card-qr" });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={handleDownloadPng}
            className="relative hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Download QR Code as PNG"
          >
            <div
              ref={ref}
              className="dark:invert pointer-events-none"
              style={{ width: "clamp(2rem, 1.5rem + 1.5vw, 3rem)", height: "clamp(2rem, 1.5rem + 1.5vw, 3rem)" }}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Download business card QR</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
```

- [ ] **Step 2: Build to verify**

Run: `npx next build`
Expected: Compiled successfully, 9 pages generated.

- [ ] **Step 3: Commit**

```bash
git add components/ui/qr-share.tsx
git commit -m "fix: remove QR Share Card text and add fluid sizing"
```

---

### Task 2: Fluid Typography and Spacing on Home Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace all fixed headline text sizes with fluid inline styles**

Change every `<h1>` that has `className="text-5xl leading-none font-light tracking-wider md:text-7xl xl:text-[8rem]"` to use `style={{ fontSize: "clamp(2.5rem, 1.5rem + 8vw, 8rem)" }}` with `leading-none font-light tracking-wider`.

There are 4 headline instances (lines 28, 34, 48, 54). Each one changes from:
```tsx
<h1 className="text-5xl leading-none font-light tracking-wider md:text-7xl xl:text-[8rem]">
```
to:
```tsx
<h1
  className="leading-none font-light tracking-wider"
  style={{ fontSize: "clamp(2.5rem, 1.5rem + 8vw, 8rem)" }}
>
```

- [ ] **Step 2: Replace icon sizes with fluid values**

Change `HardHat` on line 36 and `Code2` on line 56 from:
```tsx
<HardHat strokeWidth={1.5} className="text-primary size-10 md:size-14 xl:size-28" />
```
to:
```tsx
<HardHat strokeWidth={1.5} className="text-primary" style={{ width: "clamp(2.5rem, 1.5rem + 3vw, 7rem)", height: "clamp(2.5rem, 1.5rem + 3vw, 7rem)" }} />
```
(and same for `Code2`).

- [ ] **Step 3: Replace caption text sizes with fluid values**

Change all `<p>` caption elements from:
```tsx
className="text-muted-foreground max-w-[200px] text-start text-xs leading-5 md:text-right md:text-sm"
```
to:
```tsx
className="text-muted-foreground max-w-[200px] text-start leading-5 md:text-right"
style={{ fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)" }}
```

There are 3 caption instances (lines 25, 39, 45).

- [ ] **Step 4: Replace location/name separator text sizes**

Change "RIYADH, KSA" span on line 66:
```tsx
<span className="text-xs text-muted-foreground md:text-sm">
```
to:
```tsx
<span className="text-muted-foreground" style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}>
```

Change "KAREEM SAFWAT" span on line 70:
```tsx
<span className="text-sm font-semibold md:text-base">
```
to:
```tsx
<span className="font-semibold" style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}>
```

Change CTA button text — both links on lines 80 and 86 currently use `text-xs`. Add fluid size:
```tsx
style={{ fontSize: "clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)" }}
```

- [ ] **Step 5: Replace fixed vertical padding with fluid**

Change `py-20` on the main content div (line 22) to fluid:
```tsx
className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6"
style={{ paddingBlock: "clamp(1rem, 1rem + 2vw, 5rem)" }}
```

- [ ] **Step 6: Replace fixed gap with fluid**

Change `gap-4` on the inner flex container (line 23) to fluid:
```tsx
className="flex w-full max-w-6xl flex-col items-center"
style={{ gap: "clamp(0.5rem, 0.5rem + 1vw, 1.5rem)" }}
```

- [ ] **Step 7: Replace separator margin with fluid**

Change `mt-16` on the separator wrapper (line 62) to fluid:
```tsx
<div className="w-full max-w-4xl" style={{ marginTop: "clamp(2rem, 1rem + 4vw, 6rem)" }}>
```

- [ ] **Step 8: Update Riyadh→Cairo text**

Two text changes:

Line 26 caption:
```
"Senior Quantity Surveyor based in Riyadh, KSA — delivering precise cost management and tendering excellence."
```
→
```
"Senior Quantity Surveyor based in Cairo, Egypt — delivering precise cost management and tendering excellence."
```

Line 67 location:
```
RIYADH, KSA
```
→
```
CAIRO, EGYPT
```

- [ ] **Step 9: Build to verify**

Run: `npx next build`
Expected: Compiled successfully, 9 pages generated.

- [ ] **Step 10: Commit**

```bash
git add app/page.tsx
git commit -m "feat: fluid responsive home page with clamp() typography and Cairo location"
```

---

### Self-Review Checklist

- [ ] **Spec coverage:** 
  - Fluid headlines → Task 2 Step 1 ✓
  - Fluid icons → Task 2 Step 2 ✓
  - Fluid captions → Task 2 Step 3 ✓
  - Fluid location/name → Task 2 Step 4 ✓
  - Fluid spacing → Task 2 Steps 5-7 ✓
  - QR removal of "Share Card" → Task 1 Step 1 ✓
  - Riyadh→Cairo → Task 2 Step 8 ✓
  - Accessibility (rem+vw formula) → all clamp values include `rem` component ✓
- [ ] **Placeholders:** None — every step has complete code.
- [ ] **Type consistency:** Same patterns used throughout. No type issues.
