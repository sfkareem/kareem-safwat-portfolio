# Skiper101 Tooltip Integration Design

## Objective
Replace the existing `components/ui/tooltip.tsx` (a thin Radix UI wrapper) with skiper101's custom tooltip from `@skiper-ui/skiper101`, which features a better arrow design with border outline and improved content styling.

## Scope

### Changes

1. **Install skiper101 via shadcn CLI**
   - Run `npx shadcn add @skiper-ui/skiper101`
   - Creates `components.json` with default settings
   - Installs component to `components/ui/skiper-ui/skiper101.tsx`

2. **Replace `components/ui/tooltip.tsx`**
   - Copy skiper101's Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipProvider exports into tooltip.tsx
   - Delete the skiper-ui directory afterwards
   - Import path stays unchanged at `@/components/ui/tooltip`

3. **Backward compat: `showArrow` prop**
   - skiper101's TooltipContent always renders the arrow (no conditional)
   - Existing consumers pass `showArrow` which would become an unknown DOM attribute
   - Add `showArrow?: boolean` to TooltipContent's props, destructure it out of `...props` (silently accept, never forward to DOM)

4. **Simplify consumers: remove outer `TooltipProvider`**
   - skiper101's `Tooltip` component wraps `TooltipProvider` internally
   - Remove outer `<TooltipProvider>` wrappers from the 4 usages across 2 files

5. **No visual changes to pages**
   - Only tooltip rendering behavior changes (better arrow, improved styling)
   - The Skiper102 demo component is not rendered on any page

### Not Changing
- No new tooltips added to elements
- No visual layout changes on any page
- No changes to `VerticalTooltipNavbar` (has its own custom tooltip)
- Existing tooltip functionality (`side`, `sideOffset`, `align`, `delayDuration`, `asChild`) works identically

## Files Affected

| File | Change |
|------|--------|
| `components.json` | **Created** — shadcn CLI setup with defaults |
| `components/ui/skiper-ui/skiper101.tsx` | **Created then deleted** — source for the replacement |
| `components/ui/tooltip.tsx` | **Replaced** — skiper101's Tooltip + showArrow compat |
| `components/ui/share-qr-code.tsx` | **Modified** — remove 3x outer `<TooltipProvider>` |
| `components/ui/quick-tooltip-actions.tsx` | **Modified** — remove 1x outer `<TooltipProvider>` |

## Risk Assessment
- **Low**: Component replacement of a single UI primitive with a backward-compatible alternative
- **Existing consumers** will render the same content with a visually improved arrow
- **showArrow** prop is silently accepted (no React warnings, no behavior change)

## Verification
1. `npx tsc --noEmit` — zero new type errors
2. `npm run build` — build succeeds
3. Visual check: tooltips on QR share and quick-tooltip-actions still appear on hover
