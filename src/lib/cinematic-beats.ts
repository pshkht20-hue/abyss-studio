import { scrollStore } from "./scroll-store";

/** Single gate — shark fades out in last 18% of hero scroll */
export const HERO_COMPLETE = 1;
export const SHARK_FADE_START = 0.82;

export type CinematicBeat = "hero" | "services" | "process" | "work" | "contact";

export const BEAT_RANGES: Record<CinematicBeat, { start: number; end: number }> = {
  hero: { start: 0, end: 0.2 },
  services: { start: 0.2, end: 0.4 },
  process: { start: 0.4, end: 0.6 },
  work: { start: 0.6, end: 0.8 },
  contact: { start: 0.8, end: 1 },
};

export function currentBeat(progress: number): CinematicBeat {
  if (progress < 0.2) return "hero";
  if (progress < 0.4) return "services";
  if (progress < 0.6) return "process";
  if (progress < 0.8) return "work";
  return "contact";
}

export function heroProgress(): number {
  return scrollStore.heroLocal;
}

export function inHeroPhase(): boolean {
  return scrollStore.heroLocal < HERO_COMPLETE;
}

export function showShark(): boolean {
  return scrollStore.heroLocal < HERO_COMPLETE;
}

export function sharkFade(): number {
  const h = scrollStore.heroLocal;
  if (h >= HERO_COMPLETE) return 0;
  if (h < SHARK_FADE_START) return 1;
  const t = (h - SHARK_FADE_START) / (HERO_COMPLETE - SHARK_FADE_START);
  return 1 - t * t * (3 - 2 * t);
}

/** Drives Swim_Bite blend + subtle FOV punch — not lookAt */
export function jawFocus(): number {
  const h = scrollStore.heroLocal;
  return smoothstep(0.58, 0.9, h);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
