"use client";

import { useEffect } from "react";
import { getMotionTier } from "@/lib/motion-tier";
import { ambientStore } from "@/lib/ambient-store";

export function MotionTierRoot() {
  useEffect(() => {
    const root = document.documentElement;

    const apply = () => {
      const tier = getMotionTier();
      root.dataset.motionTier = tier;
      root.classList.toggle("motion-mobile", tier === "mobile" || tier === "mobile-lite");
      root.classList.toggle("motion-mobile-lite", tier === "mobile-lite");
      root.classList.toggle("motion-ambient", tier === "desktop" || tier === "mobile");
    };

    apply();

    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 767px)"),
    ];

    const onChange = () => apply();
    mqs.forEach((mq) => mq.addEventListener("change", onChange));

    const onVisibility = () => {
      ambientStore.setVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mqs.forEach((mq) => mq.removeEventListener("change", onChange));
      document.removeEventListener("visibilitychange", onVisibility);
      delete root.dataset.motionTier;
      root.classList.remove("motion-mobile", "motion-mobile-lite", "motion-ambient");
    };
  }, []);

  return null;
}
