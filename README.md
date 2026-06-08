# Abyss Studio (premium-site-starter)

> **Отдельный проект от OFM.** Не трогает `ofm-model-agency`, другой порт (`3001`), свой деплой.

Иммерсивный сайт студии веб-продакшена (океан + 3D акула). Папка также содержит шаблон скиллов ECC.

## Запуск сайта Abyss

```powershell
cd c:\Users\User\ofm-agency\premium-site-starter
npm run dev
```

Открыть: **http://localhost:3001** (не 3000 — тот порт для OFM).

---

## Шаблон скиллов (ниже)

Шаблон Cursor-проекта со **всеми скиллами анимации и ECC**, скопированными из `ofm-model-agency`.

## Что внутри

| Папка | Содержимое |
|-------|------------|
| `.agents/skills/` | 26 внешних скиллов (Framer, GSAP, Three.js, Vercel…) |
| `.cursor/skills/` | 102 ECC + OFM скилла |
| `.cursor/rules/` | 107 правил Cursor |
| `.cursor/agents/` | 64 агента (seo, react-review, planner…) |
| `skills-lock.json` | Манифест установленных skills.sh пакетов |

**User-level (на все проекты автоматически):** GSAP official в `C:\Users\User\.agents\skills\` — не копируется, уже глобально.

## Как использовать

1. **Откройте эту папку в Cursor** как отдельный проект: `File → Open Folder → premium-site-starter`
2. Создайте новый сайт рядом или скопируйте эту папку:
   ```powershell
   Copy-Item -Recurse "c:\Users\User\ofm-agency\premium-site-starter" "c:\Users\User\ofm-agency\my-new-site"
   cd c:\Users\User\ofm-agency\my-new-site
   npx create-next-app@latest . --typescript --tailwind --app --yes
   ```
3. В чате Cursor пишите: «используй animation-mastery» или «сложная scroll-анимация»

## Обновить скиллы из skills.sh

```powershell
cd c:\Users\User\ofm-agency\premium-site-starter
npx skills update
```

## Документация

- `docs/SKILL-PLAN.md` — полный список DAILY/LIBRARY скиллов
- `.cursor/ecc-site-profile.json` — машинный профиль

## Важно

- Скиллы **не меняют код сайта** — это инструкции для AI в Cursor
- OFM-скиллы (`ofm-*`) заточены под ofmmodels.com; для нового бренда переименуйте или создайте свой `*-animation-mastery`
- Секреты (`.credentials`, `.env`) сюда **не копируются**

Создано: 8 июня 2026 · Источник: `ofm-model-agency`
