import { isLowEndDevice } from "./background-capabilities";

export type MotionTier = "reduced" | "mobile" | "mobile-lite" | "desktop";

export const MOBILE_BREAKPOINT = 767;

export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  if (window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches) {
    return isLowEndDevice() ? "mobile-lite" : "mobile";
  }
  return "desktop";
}

export function isMobileTier(tier: MotionTier = getMotionTier()) {
  return tier === "mobile" || tier === "mobile-lite";
}

/** Full animated ambient — desktop only (too heavy on phones). */
export function isAmbientTier(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

export function isHeavyAmbientTier(tier: MotionTier = getMotionTier()) {
  return isAmbientTier(tier);
}

/** CSS-only ambient fallback for phones. */
export function isMobileAmbientTier(tier: MotionTier = getMotionTier()) {
  return tier === "mobile" || tier === "mobile-lite";
}

export function isLiteAmbientTier(tier: MotionTier = getMotionTier()) {
  return tier === "mobile-lite";
}

export function canRunWebGLAmbient(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

export function canRunCanvasAmbient(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

/** ScrollTrigger pin breaks layout on iOS — desktop only. */
export function shouldUseScrollPin(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

export function shouldUseScrollScrub(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

export function scrollScrubValue(tier: MotionTier = getMotionTier()) {
  if (tier === "desktop") return 0.55;
  return false;
}

export function getMotionBusFps(tier: MotionTier = getMotionTier()) {
  if (tier === "desktop") return 60;
  if (tier === "mobile") return 20;
  return 15;
}

export function motionTierLabel(tier: MotionTier) {
  return tier;
}
