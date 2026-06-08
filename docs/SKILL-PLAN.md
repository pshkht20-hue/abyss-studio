# Skill Plan — premium-site-starter

> Шаблон скиллов из `ofm-model-agency` · 8 июня 2026 · Стек: Next.js 16+, React 19, Tailwind 4, GSAP + Framer + Three.js

## Зачем это

В проекте **~100 ECC-скиллов** — но 80% из них для Java, Perl, Django и т.д., которые здесь не нужны.  
Этот план отделяет **DAILY** (агент читает сам) от **LIBRARY** (только по запросу).

**Машинный профиль:** `.cursor/ecc-ofm-profile.json`  
**Роутер для агента:** `.cursor/skills/skill-library/SKILL.md`  
**Правило Cursor:** `.cursor/rules/ofm-agent-skills.mdc` (always apply)

---

## Установлено сегодня (внешние, Vercel)

```bash
npx skills add vercel-labs/agent-skills
```

| Скилл | Зачем OFM | Путь |
|-------|-----------|------|
| **vercel-react-best-practices** | 70 правил перфоманса React/Next — главный для кода | `.agents/skills/vercel-react-best-practices/` |
| **web-design-guidelines** | Аудит UI, a11y, UX по гайдам Vercel | `.agents/skills/web-design-guidelines/` |
| **vercel-composition-patterns** | Compound components, чистая архитектура UI | `.agents/skills/vercel-composition-patterns/` |
| **deploy-to-vercel** | Деплой, env, preview | `.agents/skills/deploy-to-vercel/` |
| **writing-guidelines** | Качество длинных текстов (блог) | `.agents/skills/writing-guidelines/` |
| vercel-optimize | Lighthouse / CWV оптимизация | `.agents/skills/vercel-optimize/` |
| vercel-react-view-transitions | View Transitions API (опционально) | `.agents/skills/` |

> **Не ставили:** отдельные SEO-скиллы с skills.sh (132 installs) — у нас сильнее кастомные `ofm-seo-analytics` + живые GA4/GSC скрипты.

---

## Установлено: анимации и 3D (8 июня 2026)

| Скилл | Installs | Зачем |
|-------|----------|-------|
| **framer-motion-animator** | 5.9K | Page transitions, gestures, scroll Framer, orchestration |
| **animation-designer** | 1.4K | Motion design, parallax, micro-interactions |
| **threejs-*** (10 шт.) | 3.5K+ | Fundamentals → shaders → postprocessing → animation |
| **react-three-fiber** | 1.1K | R3F + Three.js в React/Next |
| **ofm-animation-mastery** | local | Роутер: GSAP + Framer + 3D + mobile rules |

**Уже были (user-level):** официальные GSAP skills (`gsap-core`, `gsap-react`, `gsap-scrolltrigger`…)

**Доустановлено после очистки диска (8 июня):**

| Скилл | Installs | Зачем |
|-------|----------|-------|
| **gsap-framer-scroll-animation** | 1.2K | GSAP + Framer scroll — production recipes |
| **scroll-animations** | 403 | Parallax, reveal, scroll progress |
| **gsap-greensock** | 308 | Deep GSAP timelines, plugins |
| **12-principles-of-animation** | 229 | Disney principles — easing, staging |

---

## DAILY — скиллы для ежедневной работы

### 🎯 OFM-специфичные (приоритет №1)

| Скилл | Когда |
|-------|-------|
| `ofm-seo-analytics` | SEO-отчёт, GSC, GA4, Telegram digest, Phase 0–3 план |
| `ofm-deep-site-audit` | «Проанализируй сайт», interlinking, schema, Phase 1 |
| `ofm-conversion-audit` | CTA, форма, калькулятор, воронка заявок |
| `ofm-premium-motion` | Hero GSAP, ScrollTrigger, mobile lite |
| `ofm-animation-mastery` | Сложные адаптивные анимации, 3D — главный роутер |

### 🎬 Анимация и 3D (новые)

| Скилл | Когда |
|-------|-------|
| `framer-motion-animator` | Transitions, whileInView, gestures, stagger |
| `animation-designer` | Parallax, micro-UX, motion design |
| `threejs-fundamentals` … `threejs-postprocessing` | WebGL сцены, GLTF, шейдеры, bloom |
| `react-three-fiber` | 3D в React (lazy-load, `ssr: false`) |
| User GSAP pack | Hero timelines, ScrollTrigger pin/scrub |

### ⚡ Vercel (установлены сегодня)

| Скилл | Когда |
|-------|-------|
| `vercel-react-best-practices` | Любой React/Next код, bundle, waterfalls |
| `web-design-guidelines` | «Проверь UI», accessibility |
| `vercel-composition-patterns` | Новые составные компоненты |

### 🎨 Дизайн и фронтенд

| Скилл | Когда |
|-------|-------|
| `make-interfaces-feel-better` | Spacing, тени, hover, «выглядит дёшево» |
| `frontend-patterns` | Next.js layout, i18n, data |
| `react-patterns` | Hooks, RSC boundaries, формы |
| `motion-ui` | Framer Motion в секциях ниже hero |
| `nextjs-turbopack` | Next 16 dev/build вопросы |

### ✍️ Контент

| Скилл | Когда |
|-------|-------|
| `article-writing` | Новые статьи блога (все 4 локали) |

### 🔒 Качество

| Скилл | Когда |
|-------|-------|
| `security-review` | API, секреты, форма, rate limit |
| `backend-patterns` | `/api/application`, Telegram |
| `coding-standards` | Любой новый код |
| `documentation-lookup` | Актуальная дока Next.js 16 (Context7) |

### 🎬 GSAP (user-level, уже у вас)

`gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance` — в `~/.agents/skills/`.  
Используются вместе с `ofm-premium-motion` для hero.

---

## Agents — по запросу (не каждый чат)

| Agent | Когда вызывать |
|-------|----------------|
| `ecc-seo-specialist` | Meta, schema, sitemap, ключевые слова |
| `ecc-react-reviewer` | После правок `.tsx` |
| `ecc-planner` | «Фаза 1», большие фичи |
| `ecc-code-reviewer` | Общий review перед коммитом |
| `ecc-react-build-resolver` | `npm run build` падает |
| `ecc-security-reviewer` | Секреты, API, форма |

---

## LIBRARY — не грузить в контекст

Оставлены в `.cursor/skills/`, но **не использовать** для OFM без явного запроса:

- **Языки:** Java, Kotlin, Rust, Go, PHP, Perl, C++, C#, F#, Dart, Ruby, Swift, ArkTS
- **Фреймворки:** Django, Laravel, Spring, Quarkus, NestJS, Angular, Flutter
- **Ниша:** DeFi, HIPAA, trading agents, investor-outreach, market-research
- **Дубликаты:** `react-performance` (ECC) — предпочитать `vercel-react-best-practices`

Найти новый скилл: `npx skills find <запрос>` → https://skills.sh/

---

## Как это прокачивает агента

| Было | Стало |
|------|-------|
| 100 скиллов, агент «тонет» | 20 DAILY + роутер по задаче |
| Общий React advice | 70 правил Vercel Engineering |
| SEO «из головы» | `ofm-seo-analytics` + живой `seo:report` |
| UI на глаз | `web-design-guidelines` + `make-interfaces-feel-better` |
| Hero анимации вслепую | `ofm-premium-motion` + официальные GSAP skills |

---

## Команды для вас

| Задача | Напишите в чат |
|--------|----------------|
| SEO-отчёт и план | «Запусти SEO-аналитику» / «что делать по SEO» |
| Аудит UI | «Проверь UI по web-design-guidelines» |
| Фаза 1 SEO в коде | «фаза 1» |
| Обновить DAILY список | «настрой DAILY skills» |
| Найти новый скилл | «найди скилл для …» |

---

## Commit

После проверки: **Commit → Push** в VS Code (ветка `main`).

Файлы этого плана:
- `docs/OFM-SKILL-PLAN.md`
- `.cursor/ecc-ofm-profile.json`
- `.cursor/skills/skill-library/SKILL.md`
- `.cursor/rules/ofm-agent-skills.mdc`
- `.agents/skills/vercel-*` (9 пакетов Vercel)
