# Civil Page Upgrade Design

## Objective
Upgrade the `/civil` portfolio page with shared design language from the home page (fluid layout, vertical centering, dot-grid background) while preserving the page's unique identity (glowy waves hero, timeline, FAQ, contact).

## Scope

### Changes

1. **Vertical centering**
   - Add `justify-center` to the hero section's flex container
   - Remove `py-6 md:py-12` from `MergedHero` wrapper
   - Hero fills viewport vertically, content centered

2. **Dot-grid background**
   - Add the same radial-gradient dot pattern used on the home page as a subtle background layer on the main element
   - Same configuration: `bg-[radial-gradient(circle,_var(--foreground)_1px,_transparent_1px)] opacity-15 [background-size:20px_20px]`

3. **Stats in MergedHero**
   - Extract the 3 stats from `GlowyWavesHero` (currently defined but never rendered)
   - Render them as an animated counter row below the CTA buttons in `MergedHero`
   - Stagger entrance animation with `motion`, counting up from 0
   - Layout: single row on desktop, stacked on mobile

4. **Fluid section spacing**
   - Replace `space-y-24 md:space-y-32` between sections with fluid `space-y-[clamp(4rem, 8vw, 8rem)]`
   - Keeps spacing proportional to viewport

5. **Skeleton loading**
   - Keep the 1500ms page-level loading state
   - Timeline and Certifications sections show skeleton placeholders during this period
   - All sections fade/transition in together after loading completes

### Not Changing
- GlowyWavesHero canvas animation (unique to civil)
- Timeline expand/card design and scroll-based line animation
- SkillsSection grid layout and tool cards
- FAQ accordion design
- Contact parallax section and form
- No QR separator added
- No floating nav changes

## Components Affected

| File | Change |
|------|--------|
| `app/civil/page.tsx` | Add `justify-center`, update section spacing, add dot-grid |
| `components/MergedHero.tsx` | Add animated stats row, remove `py-6 md:py-12` |
| `components/ui/glowy-waves-hero-shadcnui.tsx` | Remove unused `heroStats` and `statsVariants` (moved to MergedHero) |

## Implementation Order
1. `MergedHero.tsx` — add animated stats row, remove wrapper padding
2. `app/civil/page.tsx` — add `justify-center`, dot-grid, fluid spacing
3. `glowy-waves-hero-shadcnui.tsx` — clean up unused stat constants
