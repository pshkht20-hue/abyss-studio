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

/** Full CSS/canvas ambient (desktop + capable phones). */
export function isAmbientTier(tier: MotionTier = getMotionTier()) {
  return tier === "desktop" || tier === "mobile";
}

/** @deprecated Use isAmbientTier — kept for call-site compat */
export function isHeavyAmbientTier(tier: MotionTier = getMotionTier()) {
  return isAmbientTier(tier);
}

export function isLiteAmbientTier(tier: MotionTier = getMotionTier()) {
  return tier === "mobile-lite";
}

export function canRunWebGLAmbient(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

export function canRunCanvasAmbient(tier: MotionTier = getMotionTier()) {
  return tier === "desktop" || tier === "mobile";
}

export function shouldUseScrollScrub(tier: MotionTier = getMotionTier()) {
  return tier === "desktop" || tier === "mobile";
}

/** ScrollTrigger scrub: smooth on desktop, 1:1 on mobile (less GPU work). */
export function scrollScrubValue(tier: MotionTier = getMotionTier()) {
  if (tier === "desktop") return 0.55;
  if (tier === "mobile") return true as const;
  return false;
}

export function getMotionBusFps(tier: MotionTier = getMotionTier()) {
  if (tier === "desktop") return 60;
  if (tier === "mobile") return 30;
  return 24;
}

export function motionTierLabel(tier: MotionTier) {
  return tier;
}
