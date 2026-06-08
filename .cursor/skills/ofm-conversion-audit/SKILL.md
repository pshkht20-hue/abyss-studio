---
name: ofm-conversion-audit
description: >-
  Conversion and CRO audit for OFM Model Agency landing — application form,
  calculator, trust signals, CTAs, mobile sticky bar. Use when improving
  leads, UX for models, or reviewing premium agency positioning.
---

# OFM Conversion Audit

## Primary goal

Drive qualified model applications via `#contact` → `POST /api/application` → Telegram.

## Audit checklist (score each 1–5)

### Hero (first 5 seconds)
- [ ] H1 communicates agency + ambition (not generic)
- [ ] Primary CTA visible without scroll (`#contact`)
- [ ] Trust strip: 200+ models, verified, gross disclaimer visible
- [ ] Secondary CTA leads to proof (`#models` or `#results`)

### Proof chain
- [ ] Stats (`#results`) with orchestrated entrance
- [ ] Real or styled case screenshots in `#models`
- [ ] Reviews with agency replies (`#reviews`)
- [ ] Income figures use **gross total** disclaimer (all 4 locales)

### Calculator → Contact
- [ ] User completes calculator and sees result range
- [ ] CTA pre-fills contact message with estimate (`lib/calculator/prefill.ts`)
- [ ] Legal notice on calculator result (not net payout promise)

### Form friction
- [ ] Telegram field required; age 18+ checkbox
- [ ] Honeypot `website` field present
- [ ] Success state: SVG check + `aria-live`
- [ ] Mobile: `StickyMobileCta` after 480px scroll

### Navigation
- [ ] All major sections have anchor IDs and nav links
- [ ] Active section highlight in Navbar
- [ ] Blog/FAQ reachable for objection handling

### Technical trust
- [ ] HTTPS, consent-gated analytics
- [ ] Rate limiting on `/api/application` (if missing → P0)
- [ ] i18n: ru/uk/en/es parity on CTA copy

## Output format

```markdown
## Conversion score: X/25
### Quick wins (this week)
### Structural improvements
### Copy changes (list locale files to edit)
### Metrics to track (GA4 events)
```

## GA4 events to recommend

- `calculator_complete`
- `contact_form_submit`
- `cta_click` (hero, sticky, calculator)

## Brand constraints

- SEO pages: OnlyFans terminology OK in metadata/blog
- Ad-safe landings: SFW H1, no OF in hero if ad traffic
- Never promise net payout; always gross + agency cut context
