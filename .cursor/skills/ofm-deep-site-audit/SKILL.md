---
name: ofm-deep-site-audit
description: >-
  Full-stack audit template for OFM Model Agency — SEO, performance, motion,
  i18n, security, accessibility, content. Use when user asks to analyze the
  site, plan improvements, or prioritize a premium agency roadmap.
---

# OFM Deep Site Audit

## Run order

1. **Structure** — routes, sections, component map (`components/HomePage.tsx`)
2. **Motion** — invoke `ofm-premium-motion` checklist
3. **Conversion** — invoke `ofm-conversion-audit` checklist
4. **SEO** — metadata, sitemap, JSON-LD locale paths, OG images
5. **Performance** — client islands, dynamic imports, image quality, LCP hero
6. **Security** — API validation, secrets, headers, rate limits
7. **A11y** — landmarks, skip link, focus, reduced motion
8. **i18n** — 4× `messages/*.json` + TS content overlays
9. **Tests** — coverage gap vs 80% rule

## Priority labels

| Label | Meaning |
|-------|---------|
| P0 | Broken UX, security, or SEO — fix before deploy |
| P1 | High impact on trust/conversion/perf |
| P2 | Polish and differentiation |
| P3 | Nice-to-have |

## Key files

| Area | Paths |
|------|-------|
| Homepage | `components/HomePage.tsx`, `components/hero/*` |
| Motion | `lib/motion.ts`, `lib/gsap/register.ts` |
| API | `app/api/application/route.ts` |
| SEO | `lib/seo.ts`, `components/seo/StructuredData.tsx`, `app/sitemap.ts` |
| i18n | `messages/{ru,uk,en,es}.json`, `i18n/routing.ts` |
| Cases | `lib/results/cases.ts`, `public/results/` |

## Report template

```markdown
# OFM Site Audit — [date]

## Executive summary (3 sentences)
## Scorecard
| Area | Grade | Top issue |
## P0 fixes
## P1 roadmap (2-week)
## P2 polish
## Motion opportunities (max 3 ScrollTrigger scenes)
## Content gaps
## Test plan
```

## Evidence rules

- Cite file paths for every finding
- Run `npm run build` before claiming green status
- Do not recommend Three.js unless user explicitly asks
