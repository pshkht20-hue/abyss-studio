---
name: skill-library
description: >-
  OFM skill router — maps user intent to DAILY skills (auto-use) vs LIBRARY
  (on-demand). Use when unsure which skill fits, or user asks "какой скилл",
  "настрой skills", "DAILY skills".
---

# OFM Skill Library Router

## DAILY vs LIBRARY

| Bucket | Meaning |
|--------|---------|
| **DAILY** | Read and follow proactively when the task matches — core OFM stack |
| **LIBRARY** | Search `.cursor/skills/` or `.agents/skills/` only when explicitly needed |

Full manifest: `docs/OFM-SKILL-PLAN.md` · Machine profile: `.cursor/ecc-ofm-profile.json`

---

## Trigger → Skill (DAILY)

### SEO, аналитика, контент
| User says / task | Skill | Path |
|------------------|-------|------|
| SEO отчёт, GSC, GA4, индексация, ключевые слова | `ofm-seo-analytics` | `.cursor/skills/ofm-seo-analytics/` |
| Полный аудит сайта, Phase 1/2 SEO | `ofm-deep-site-audit` | `.cursor/skills/ofm-deep-site-audit/` |
| Статья блога, H1, meta, 4 локали | `article-writing` + `ofm-seo-analytics` | `.cursor/skills/article-writing/` |
| Telegram SEO digest, `seo:daily` | `ofm-seo-analytics` | scripts + `docs/SEO-MASTER-PLAN.md` |

### Дизайн и UI
| User says / task | Skill | Path |
|------------------|-------|------|
| UI выглядит плоско, spacing, polish | `make-interfaces-feel-better` | `.cursor/skills/` |
| Review UI, accessibility, UX audit | `web-design-guidelines` | `.agents/skills/web-design-guidelines/` |
| Новая секция, карточки, layout | `frontend-patterns` + `make-interfaces-feel-better` | `.cursor/skills/frontend-patterns/` |
| Бренд, cosmic/neon, premium feel | `ofm-premium` rule + `frontend-design-direction` | `.cursor/rules/ofm-premium.mdc` |

### React / Next.js / перфоманс
| User says / task | Skill | Path |
|------------------|-------|------|
| Медленная загрузка, bundle, CWV | `vercel-react-best-practices` | `.agents/skills/vercel-react-best-practices/` |
| Новый компонент, hooks, RSC | `react-patterns` | `.cursor/skills/react-patterns/` |
| Next.js 16, Turbopack, routing | `nextjs-turbopack` | `.cursor/skills/nextjs-turbopack/` |
| Server/client boundary, i18n | `frontend-patterns` | `.cursor/skills/frontend-patterns/` |
| Composition, compound components | `vercel-composition-patterns` | `.agents/skills/vercel-composition-patterns/` |

### Анимация (сложные, адаптивные, 3D)
| User says / task | Skill | Path |
|------------------|-------|------|
| **Любая сложная анимация** | `ofm-animation-mastery` | `.cursor/skills/ofm-animation-mastery/` |
| Hero, GSAP, ScrollTrigger | `ofm-premium-motion` + `gsap-react` | + user `~/.agents/skills/gsap-*` |
| Framer, page transitions, gestures | `framer-motion-animator` | `.agents/skills/framer-motion-animator/` |
| Motion design, parallax, micro-UX | `animation-designer` | `.agents/skills/animation-designer/` |
| Секции ниже hero | `motion-ui` | `.cursor/skills/motion-ui/` |
| Scroll parallax, pin, scrub recipes | `gsap-framer-scroll-animation`, `scroll-animations` | `.agents/skills/` |
| GSAP timelines deep | `gsap-greensock` | `.agents/skills/gsap-greensock/` |
| Disney motion quality | `12-principles-of-animation` | `.agents/skills/` |
| ScrollTrigger API | `gsap-scrolltrigger` | user-level GSAP |
| **3D сцена, WebGL, GLTF** | `threejs-fundamentals` → `threejs-animation` | `.agents/skills/threejs-*/` |
| React Three Fiber | `react-three-fiber` | `.agents/skills/react-three-fiber/` |

### Конверсия и API
| User says / task | Skill | Path |
|------------------|-------|------|
| CTA, форма, калькулятор, воронка | `ofm-conversion-audit` | `.cursor/skills/ofm-conversion-audit/` |
| `/api/application`, Telegram, secrets | `security-review` + `backend-patterns` | `.cursor/skills/` |
| Деплой Vercel | `deploy-to-vercel` | `.agents/skills/deploy-to-vercel/` |

### Качество кода
| User says / task | Skill | Path |
|------------------|-------|------|
| Новая фича, рефакторинг | `coding-standards` + `tdd-workflow` | `.cursor/skills/` |
| Документация Next/React API | `documentation-lookup` | `.cursor/skills/documentation-lookup/` |
| E2E критические флоу | `e2e-testing` | `.cursor/skills/e2e-testing/` |

---

## Agents (on demand, not every turn)

| Task | Agent |
|------|-------|
| SEO стратегия, schema, meta | `ecc-seo-specialist` |
| React/TSX review после правок | `ecc-react-reviewer` |
| Большая фича, фаза SEO | `ecc-planner` |
| Общий code review | `ecc-code-reviewer` |
| Build падает | `ecc-react-build-resolver` |

---

## LIBRARY (do not auto-load)

Off-stack ECC packs — use only if user explicitly asks:

- Java, Kotlin, Rust, Go, PHP, Laravel, Django, Perl, C++, C#, F#, Flutter, Angular, NestJS, Quarkus, Spring Boot
- DeFi, HIPAA, trading agents, Windows desktop E2E
- Investor materials, market research (unless fundraising task)

To find more: `npx skills find <query>` or read `docs/OFM-SKILL-PLAN.md` § Library.

---

## Priority order when multiple skills match

1. **OFM-specific** (`ofm-*`) — project context wins
2. **Vercel official** (`vercel-*`, `web-design-guidelines`) — performance & UI
3. **ECC frontend** (`react-patterns`, `frontend-patterns`, `motion-ui`)
4. **Common** (`coding-standards`, `security-review`)
