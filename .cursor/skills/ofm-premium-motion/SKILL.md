---
name: ofm-premium-motion
description: >-
  Premium animation system for OFM Model Agency — GSAP hero, ScrollTrigger
  scroll scenes, Framer Motion sections, mobile ≤767px lite mode, and
  prefers-reduced-motion. Use for any animation, parallax, pin, or motion polish.
---

# OFM Premium Motion

## Stack split (mandatory)

| Zone | Library | Notes |
|------|---------|-------|
| Hero | GSAP + useGSAP | `components/hero/*` |
| Scroll-scrub / pin | GSAP ScrollTrigger | Max **6** triggers per page |
| Below hero | Framer Motion | `lib/motion.ts` variants |
| CSS | `app/globals.css` | keyframes, reduced-motion block |

Register plugins once: `lib/gsap/register.ts`.

## Mobile (≤767px)

- No `filter: blur()` in GSAP tweens
- No 3D pin sections; parallax = opacity + y only
- Hero cosmos: ≤48 stars, ≤3 nebulae (`HeroBackground.tsx`)
- `backdrop-blur` only at `md:` breakpoint on cards

## Reduced motion

- GSAP: `matchMedia('(prefers-reduced-motion: reduce)')` → instant final state
- Framer: `useReducedMotion()` from `hooks/useMotionPreferences.ts`
- Disable infinite loops (NeonAccents, SMIL in CreatorTheme)

## Existing primitives

- `lib/motion.ts` — EASE_*, variants, `hoverLift()`
- `components/ui/Reveal.tsx` — Reveal, StaggerGrid (default | tilt | slide)
- `context/SectionContext.tsx` — active section for progress bar
- `components/scroll/FeaturedPhoneParallax.tsx` — iPhone scrub

## Adding new scroll animation

1. Prefer `useGSAP` + scoped ref, `return () => mm.revert()`
2. Use `scrub: 0.5–1` for parallax; `once: true` for entrance orchestration
3. Never animate `height: auto` (layout thrash) — use opacity/scale/max-height
4. Count-up: `motion.span` + `useTransform`, not `setState` per frame

## Quality bar

Motion must communicate: trust (stats), process (how), proof (models), action (contact).
Avoid decorative loops that do not guide the eye toward `#contact`.
