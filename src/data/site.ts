export const site = {
  name: "Abyss",
  nameAccent: "Studio",
  tagline: "Production in mutation.",
  description:
    "Premium web production for brands that refuse generic. Immersive scroll narratives, conversion systems, and motion architecture — shipped in Next.js.",
  cta: "Start a project",
  email: "hello@abyssstudio.dev",
  build: "027",
  coords: "LAT 48.8566 · LON 2.3522",
} as const;

export const navItems = [
  { id: "arsenal", label: "Services" },
  { id: "proof", label: "Work" },
  { id: "timeline", label: "Process" },
  { id: "vault", label: "Contact" },
] as const;

export const chapters = [
  { id: "HELIX", index: "01", label: "Helix" },
  { id: "ARSENAL", index: "02", label: "Arsenal" },
  { id: "PROOF", index: "03", label: "Proof" },
  { id: "TIMELINE", index: "04", label: "Timeline" },
  { id: "VAULT", index: "05", label: "Vault" },
] as const;

export const tickerItems = [
  { symbol: "LCP", value: "0.8s", change: -12, improved: true },
  { symbol: "CLS", value: "0.02", change: -8, improved: true },
  { symbol: "CONV", value: "+34%", change: 34, improved: true },
  { symbol: "MOTION", value: "60fps", change: 0, improved: true },
  { symbol: "BUILD", value: site.build, change: 1, improved: true },
  { symbol: "STACK", value: "N16", change: 0, improved: true },
] as const;

export const services = [
  {
    id: "01",
    title: "Immersive Web Systems",
    description: "Scroll narratives, chapter architecture, and motion direction — one cohesive system.",
    tag: "GSAP · Framer",
    span: "wide" as const,
  },
  {
    id: "02",
    title: "Conversion Architecture",
    description: "Forms, calculators, and CTA flows engineered for lead capture — not decoration.",
    tag: "CRO",
    span: "normal" as const,
  },
  {
    id: "03",
    title: "Premium Frontends",
    description: "Next.js 16, React 19, Tailwind 4 — production-grade, multilingual, SEO-ready.",
    tag: "Next.js",
    span: "normal" as const,
  },
  {
    id: "04",
    title: "Motion Systems",
    description: "Hero timelines, scroll triggers, and reduced-motion fallbacks — performant by default.",
    tag: "Motion",
    span: "normal" as const,
  },
  {
    id: "05",
    title: "Brand Sites",
    description: "Editorial layouts, custom type, and ambient design systems for premium positioning.",
    tag: "Design",
    span: "wide" as const,
  },
  {
    id: "06",
    title: "Launch & Deploy",
    description: "Vercel pipelines, analytics hooks, and Core Web Vitals optimization before ship.",
    tag: "Ops",
    span: "normal" as const,
  },
] as const;

export const workItems = [
  { name: "Nebula Commerce", type: "E-commerce", year: "2025", score: 98 },
  { name: "Signal Agency", type: "Landing", year: "2025", score: 97 },
  { name: "Vault Finance", type: "Product", year: "2024", score: 96 },
  { name: "Helix Studio", type: "Portfolio", year: "2024", score: 99 },
] as const;

export const metrics = [
  { label: "Lighthouse", value: 97, suffix: "" },
  { label: "LCP", value: 0.8, suffix: "s", decimals: 1 },
  { label: "Projects", value: 24, suffix: "+" },
  { label: "Retention", value: 94, suffix: "%" },
] as const;

export const processSteps = [
  {
    step: "01",
    week: "Week 1",
    title: "Discovery & direction",
    text: "Scope, motion brief, and technical architecture — aligned before a single line of code.",
  },
  {
    step: "02",
    week: "Week 2–3",
    title: "Design system & hero",
    text: "Typography, tokens, and hero timeline — the visual and motion foundation.",
  },
  {
    step: "03",
    week: "Week 4–6",
    title: "Build & integrate",
    text: "Sections, forms, i18n, and performance budgets — shipped incrementally.",
  },
  {
    step: "04",
    week: "Week 7–8",
    title: "Launch & optimize",
    text: "Deploy, analytics, CWV audit, and handoff documentation.",
  },
] as const;

export const philosophyStanzas = [
  {
    index: "SYS/01",
    codename: "BUILD",
    caption: "Immersive scroll systems — not template decks or pitch theatre.",
  },
  {
    index: "SYS/02",
    codename: "MOTION",
    caption: "Hero timelines, chapter palettes, reduced-motion fallbacks by default.",
  },
  {
    index: "SYS/03",
    codename: "CONVERT",
    caption: "Every animation bridges to contact. CRO is architecture, not polish.",
  },
  {
    index: "SYS/04",
    codename: "SHIP",
    caption: "Next.js 16 production stack. Shipped in sprints, not quarters.",
  },
] as const;

export const verticals = [
  "Agency",
  "SaaS",
  "E-commerce",
  "Portfolio",
  "Finance",
  "Other",
] as const;
