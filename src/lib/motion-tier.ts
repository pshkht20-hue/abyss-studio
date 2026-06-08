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

export function isHeavyAmbientTier(tier: MotionTier) {
  return tier === "desktop";
}

export function shouldUseScrollScrub(tier: MotionTier = getMotionTier()) {
  return tier === "desktop";
}

export function motionTierLabel(tier: MotionTier) {
  return tier;
}
