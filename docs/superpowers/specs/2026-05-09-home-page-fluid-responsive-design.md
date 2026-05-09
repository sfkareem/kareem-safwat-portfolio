# Home Page Fluid Responsive Design

**Date:** 2026-05-09
**Project:** kareem-safwat-portfolio
**Status:** Approved for implementation

## Goal

Make the `/` (home) route fully viewport-fitting and dynamically responsive to any screen size using fluid typography and spacing, with minimal structural changes.

## Requirements

1. **Full viewport**: Page content fits without scrolling on any device size.
2. **Fully responsive**: Typography and spacing scale continuously (no breakpoint jumps) using `clamp()`.
3. **QR code**: Keep in current position (separator area); remove "Share Card" text.
4. **Location**: "Riyadh, KSA" → "Cairo, Egypt" (both in caption and separator).
5. **Accessibility**: All `clamp()` preferred values use `Xrem + Yvw` formula to preserve browser zoom (WCAG 1.4.4).

## Approach

**Approach A — Manual `clamp()` CSS** (chosen). No new dependencies. Replace all fixed breakpoint sizes inline via `style` props.

## Design

### Typography Scale

| Element | Fluid Value |
|---|---|
| Headlines (CIVIL, ENGINEER, AI VIBE, CODER) | `clamp(2.5rem, 1.5rem + 8vw, 8rem)` |
| Icons (HardHat, Code2) | `clamp(2.5rem, 1.5rem + 3vw, 7rem)` |
| Description captions | `clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)` |
| Location/Name text | `clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)` |
| CTA buttons text | `clamp(0.7rem, 0.65rem + 0.2vw, 0.875rem)` |
| QR icon | `clamp(2rem, 1.5rem + 1.5vw, 3rem)` |

### Spacing

Replace fixed Tailwind spacing with fluid equivalents via inline `style`:
- Vertical padding: `py-[clamp(1rem,1rem+2vw,5rem)]` → use `style={{ paddingBlock: "clamp(1rem, 1rem + 2vw, 5rem)" }}`
- Gap between rows: `gap-[clamp(0.5rem,0.5rem+1vw,1.5rem)]`
- Separator section margin: `mt-[clamp(2rem,1rem+4vw,6rem)]`

### Layout

Current structure preserved (4 headline rows + separator row). The dot-grid background stays unchanged.

### Content Changes

- Caption 1: "Senior Quantity Surveyor based in Cairo, Egypt — delivering precise cost management and tendering excellence."
- Separator label: "CAIRO, EGYPT"
- Remove `<span>Share Card</span>` from QR component

### QR Component

Remove the `"Share Card"` text span and make icon size fluid via `style={{ width: "clamp(2rem, 1.5rem + 1.5vw, 3rem)", height: "clamp(2rem, 1.5rem + 1.5vw, 3rem)" }}`.

## Files Modified

1. **`app/page.tsx`** — All typography fluid via `style={}` on headline and icon elements; fluid spacing on container; Cairo text updates.
2. **`components/ui/qr-share.tsx`** — Remove "Share Card" span; make QR container size fluid.

## Files Not Modified

- `app/globals.css` — No new CSS needed (inline styles suffice).
- `components/ui/separator.tsx` — No changes needed.

## Mobile Considerations

- Min size clamped at 2.5rem (~40px) for headlines ensures readability down to 320px viewports.
- Captions shrink to 0.75rem minimum (~12px), acceptable for secondary text.
- Spacing compresses proportionally — no overflow on small screens.
- Descendant caption positions (inline-start on desktop, below on mobile) handled by existing `flex-col md:flex-row`.

## Verification

- Build command: `npx next build`
- Check that 9 pages generate successfully.
- Manually verify home page renders without scrollbar at 320px, 375px, 768px, 1024px, 1440px widths.
