import * as THREE from "three";

/** 5 HTML sections = 5 exclusive 3D beats (joseph-san.com pattern) */
export type OceanSection = "hero" | "reef" | "deep" | "work" | "contact";

export const SECTION_RANGES: Record<OceanSection, { start: number; end: number }> = {
  hero: { start: 0, end: 0.2 },
  reef: { start: 0.2, end: 0.4 },
  deep: { start: 0.4, end: 0.6 },
  work: { start: 0.6, end: 0.8 },
  contact: { start: 0.8, end: 1 },
};

const FADE = 0.012;

/** Hard cut with micro crossfade — never two full sections at once */
export function sectionWeight(section: OceanSection, progress: number): number {
  const { start, end } = SECTION_RANGES[section];
  const in_ = THREE.MathUtils.smoothstep(progress, start, start + FADE);
  const out = 1 - THREE.MathUtils.smoothstep(progress, end - FADE, end);
  return THREE.MathUtils.clamp(in_ * out, 0, 1);
}

export function dominantSection(progress: number): OceanSection {
  if (progress < 0.2) return "hero";
  if (progress < 0.4) return "reef";
  if (progress < 0.6) return "deep";
  if (progress < 0.8) return "work";
  return "contact";
}
