# Smooth Scroll Fix — Design Spec

**Date:** 2026-04-29
**Topic:** Fix laggy/janky scrolling on mobile by migrating from manual Lenis to official ReactLenis integration
**Status:** Approved

---

## Problem Statement

Scrolling on mobile feels laggy and janky with visible frame drops. The current implementation uses a manual `new Lenis()` instance with a custom `requestAnimationFrame` loop, which competes with React's scheduler and causes performance issues on touch devices.

**Root causes identified:**
1. Manual RAF loop runs independently of React's render cycle
2. Missing `lenis/dist/lenis.css` import prevents proper scroll container styling
3. `touchMultiplier: 2` exaggerates touch movement, feeling floaty
4. No `syncTouch` option — Lenis doesn't integrate with native touch scrolling
5. No `prefers-reduced-motion` support — violates accessibility

---

## Goals

1. Eliminate scroll jank on mobile touch devices
2. Enable smooth anchor-link scrolling (nav items → sections)
3. Respect `prefers-reduced-motion` for accessibility
4. Prevent Lenis from hijacking nested scrollables (dialogs, dropdowns)
5. Reduce custom code by using official React integration

---

## Non-Goals

- Adding parallax effects or scroll-driven animations (out of scope)
- Changing scroll behavior on desktop if it's already acceptable
- Replacing Lenis with a different library

---

## Architecture

### Component Changes

| Action | File | Reason |
|--------|------|--------|
| **Delete** | `components/SmoothScroll.tsx` | Manual Lenis + RAF is replaced by official React integration |
| **Create** | `components/ReactLenisProvider.tsx` | New wrapper using `ReactLenis` from `lenis/react` |
| **Update** | `app/layout.tsx` | Replace `<SmoothScroll />` with `<ReactLenisProvider>` |
| **Update** | `app/layout.tsx` | Add `import 'lenis/dist/lenis.css'` |
| **Update** | `app/globals.css` | Add Lenis CSS hooks and `scroll-padding-top` |

### Lenis Configuration

```typescript
{
  lerp: 0.1,              // Smooth interpolation factor (0.1 = buttery)
  duration: 1.2,          // Scroll animation duration in seconds
  smoothWheel: true,      // Enable smooth wheel scrolling
  syncTouch: true,        // CRITICAL: syncs Lenis with native touch scroll
  touchMultiplier: 1,     // Reduced from 2 — prevents floaty feel on mobile
  wheelMultiplier: 1,     // Wheel scroll sensitivity
  anchors: true,          // Enable smooth scroll to anchor links (#about, etc.)
  allowNestedScroll: true, // Don't hijack scrollable dialogs/dropdowns
  autoRaf: true,          // Let ReactLenis handle RAF internally
}
```

---

## Data Flow

```
User touches screen → Native touch event
  → ReactLenis intercepts (syncTouch: true)
  → Lenis calculates interpolated scroll position
  → React re-renders affected components
  → Browser composites frame
```

With `autoRaf: true`, Lenis handles its own RAF loop internally, avoiding conflicts with React's scheduler.

---

## Accessibility

### prefers-reduced-motion

```typescript
const prefersReducedMotion = 
  typeof window !== 'undefined' && 
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// When true, disable Lenis smooth scroll
// Fall back to native CSS scroll-behavior: smooth
```

### Keyboard Navigation

Anchor links (`#about`, `#experience`) must smooth-scroll when activated via keyboard (Enter key). With `anchors: true`, Lenis handles this automatically.

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Lenis fails to initialize | Graceful fallback to native scroll |
| `lenis/react` import fails | Build-time error — caught by TypeScript |
| Mobile browser blocks smooth scroll | Native scroll takes over automatically |
| Nested scrollable (dialog) opened | `allowNestedScroll: true` permits native scroll inside |

---

## Files Modified

### New: `components/ReactLenisProvider.tsx`

Wraps children with `<ReactLenis root options={{...}}>`.
Conditionally disables smooth scroll when `prefers-reduced-motion: reduce` is active.

### Updated: `app/layout.tsx`

- Remove `import { SmoothScroll } from '@/components/SmoothScroll'`
- Add `import { ReactLenisProvider } from '@/components/ReactLenisProvider'`
- Add `import 'lenis/dist/lenis.css'`
- Replace `<SmoothScroll />` with `<ReactLenisProvider>{children}</ReactLenisProvider>`

### Updated: `app/globals.css`

Add at the end:
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

### Deleted: `components/SmoothScroll.tsx`

Entire file removed. Logic superseded by ReactLenis.

---

## Testing Criteria

1. **Mobile scroll:** Open on iPhone/Android — scroll should feel smooth with no frame drops
2. **Anchor links:** Click nav items → page should smooth-scroll to sections
3. **Nested scrollables:** Open any dialog/dropdown with scrollable content → should scroll natively
4. **Reduced motion:** Enable "Reduce Motion" in OS settings → smooth scroll should disable
5. **Desktop:** Verify wheel scroll still feels good (should be unchanged or better)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| `lenis/react` is newer API, might have bugs | Using stable v1.3.x, ReactLenis is officially supported |
| Removing manual RAF breaks GSAP scroll sync | GSAP ScrollTrigger works with Lenis via `lenis.on('scroll', ...)` if needed later |
| CSS import adds bundle size | `lenis.css` is ~1KB minified, negligible |
| `syncTouch` might feel different from native | `touchMultiplier: 1` keeps it close to native feel |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Use `ReactLenis` instead of manual `new Lenis()` | Official React integration handles RAF correctly, avoids scheduler conflicts |
| `syncTouch: true` | Fixes mobile jank by integrating Lenis with native touch events |
| `touchMultiplier: 1` (down from 2) | Current value of 2 exaggerates touch, causing floaty/unpredictable feel |
| `anchors: true` | Enables smooth scroll for nav hash-links — currently broken |
| `allowNestedScroll: true` | Prevents Lenis from breaking scrollable dialogs/dropdowns |
| `prefers-reduced-motion` support | WCAG requirement — some users need instant, non-animated scroll |
