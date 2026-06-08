---
name: ofm-animation-mastery
description: >-
  Master router for complex responsive animations — GSAP hero/scroll, Framer
  sections, CSS motion, 3D/R3F/Three.js. Use for parallax, pin, scrub, 3D scenes,
  micro-interactions, or "сложная анимация".
---

# OFM Animation Mastery

## Skill stack (read in order)

| Layer | Skills | When |
|-------|--------|------|
| **Project rules** | `ofm-premium-motion`, `ofm-premium` rule | Every OFM animation task |
| **GSAP official** | `gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-plugins`, `gsap-performance` | Hero, pin, scrub, timelines |
| **Scroll + Framer** | `framer-motion-animator`, `animation-designer`, `motion-ui` | Sections below hero, gestures |
| **3D / WebGL** | `threejs-*` (10), `react-three-fiber` | Explicit 3D hero, WebGL backgrounds |
| **Scroll GSAP+Framer** | `gsap-framer-scroll-animation` | Production scroll recipes (GitHub 34K★) |
| **Scroll patterns** | `scroll-animations` | Parallax, reveal, progress |
| **GSAP deep** | `gsap-greensock` | Timelines, easing, plugins |
| **Design theory** | `12-principles-of-animation` | Disney principles — staging, appeal |

Paths: project `.agents/skills/` + user `~/.agents/skills/gsap-*`

---

## Decision tree

```
Need animation?
├─ Hero / first screen → GSAP + useGSAP (`ofm-premium-motion`)
├─ Scroll-linked (scrub, pin, horizontal) → GSAP ScrollTrigger (max 6/page)
├─ Section entrance / cards / modals → Framer Motion (`motion-ui`, `lib/motion.ts`)
├─ Micro-interaction (hover, tap, layout) → Framer `whileHover` / `layout`
├─ True 3D (mesh, GLTF, camera orbit) → Three.js or R3F (user requested — OK now)
└─ Pure CSS (keyframes, reduced-motion) → `app/globals.css`
```

---

## Responsive rules (OFM)

| Breakpoint | Rule |
|------------|------|
| ≤767px | No blur tweens, no 3D pin, parallax = opacity + y only, lite hero cosmos |
| md+ | Full ScrollTrigger, backdrop-blur on cards |
| `prefers-reduced-motion` | GSAP `matchMedia` instant state; Framer `useReducedMotion()` |

---

## Complexity recipes

### 1. Scroll-scrub parallax (GSAP)
- `useGSAP` + scoped ref, `ScrollTrigger.create({ scrub: 0.8 })`
- Animate only `transform` + `opacity` — never `width`/`height`/`filter: blur()` on mobile
- Cleanup: `return () => ctx.revert()`

### 2. Pinned section + horizontal scroll
- One pin per section; `pinSpacing: true`
- Mobile: replace with vertical stack + simple `Reveal`

### 3. Orchestrated entrance (Framer)
- Parent `staggerChildren` in `lib/motion.ts` variants
- `Reveal.tsx` / `StaggerGrid` — reuse, don't reinvent

### 4. 3D hero background (Three.js / R3F)
- **Only when user asks for 3D** — adds ~150–400KB JS
- Lazy-load: `dynamic(() => import(...), { ssr: false })`
- `dpr={[1, 1.5]}` on mobile; disable on ≤767px → CSS fallback
- Skills: `threejs-fundamentals` → `threejs-lighting` → `threejs-animation` → `threejs-postprocessing`
- R3F: `react-three-fiber` + `@react-three/drei` OrbitControls, Environment

### 5. Premium polish
- Easing: `power2.out` (GSAP), `EASE_OUT` from `lib/motion.ts` (Framer)
- Staging: one focal motion per viewport; avoid competing loops
- `make-interfaces-feel-better` for hit areas and state transitions

---

## Performance checklist

- [ ] GPU props only: `x, y, scale, rotate, opacity`
- [ ] `will-change` sparingly; remove after animation
- [ ] ScrollTrigger count ≤ 6
- [ ] No `setState` per frame — use `useTransform` / refs
- [ ] 3D: dispose geometries/materials on unmount
- [ ] Test iPhone Safari + reduced-motion

---

## Existing OFM primitives (reuse first)

- `lib/gsap/register.ts`, `lib/motion.ts`
- `components/hero/*`, `components/ui/Reveal.tsx`
- `components/scroll/FeaturedPhoneParallax.tsx`
- `hooks/useMotionPreferences.ts`

---

## Full animation stack (installed)

`.agents/skills/`: `gsap-framer-scroll-animation`, `scroll-animations`, `gsap-greensock`, `12-principles-of-animation`, `framer-motion-animator`, `animation-designer`, `threejs-*`, `react-three-fiber`
