export type MotionTier = "reduced" | "mobile" | "desktop";

export function getMotionTier(): MotionTier {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  if (window.matchMedia("(max-width: 767px)").matches) return "mobile";
  return "desktop";
}

export function isHeavyAmbientTier(tier: MotionTier) {
  return tier === "desktop";
}
