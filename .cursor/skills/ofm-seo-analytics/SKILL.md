---
name: ofm-seo-analytics
description: >-
  Autonomous SEO analytics for OFM — run seo:report, read latest-report.md,
  GA4 events, GSC/GA4 API. Use when user asks for SEO data, analytics automation,
  or promotion advice based on real metrics.
---

# OFM SEO Analytics (autonomous)

## Default workflow (no user CSV needed)

1. Run `npm run seo:report` from `ofm-model-agency/`
2. Read `docs/analytics-reports/latest-report.md`
3. If setup required → point user to `docs/analytics-setup.md` (one-time 15 min)
4. Produce 2-week backlog: P0 technical, P1 content/geo, P2 polish
5. Cross-check with `ofm-deep-site-audit` and `ofm-conversion-audit` skills

## GA4 custom events (live on site)

| Event | When |
|-------|------|
| `cta_click` | Hero, navbar, sticky mobile, calculator CTAs |
| `calculator_complete` | Calculator result shown |
| `contact_submit` | Client form success (consent granted) |
| `contact_submit_server` | API success (Measurement Protocol, all users) |

Mark key events as conversions in GA4 Admin → Events.

## Report interpretation

- **Low CTR pages** in report → rewrite title/meta, internal links
- **Quick-win queries** → expand existing blog or new article
- **Geo rows** (ukr, mda, arg) → prioritize uk/es content
- **GA4 organic vs GSC clicks** → cookie consent may reduce GA4; trust GSC for search

## Code touchpoints

- Events: `lib/analytics/gtag.ts`, `lib/analytics/server.ts`
- Fetch script: `scripts/seo-report.mjs`
- Setup: `docs/analytics-setup.md`

## When APIs unavailable

Fall back to codebase audit (`ofm-deep-site-audit`) and ask user to complete `docs/analytics-setup.md` once.
