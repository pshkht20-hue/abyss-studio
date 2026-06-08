"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier, isMobileAmbientTier } from "@/lib/motion-tier";

export function AmbientMobile() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isMobileAmbientTier(getMotionTier())) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lastScroll = -1;
    const unsub = ambientStore.subscribe(() => {
      const scroll = ambientStore.scrollProgress;
      if (Math.abs(scroll - lastScroll) < 0.008) return;
      lastScroll = scroll;
      el.style.setProperty("--mob-scroll", String(scroll));
    });

    el.style.setProperty("--mob-scroll", String(ambientStore.scrollProgress));
    return unsub;
  }, []);

  return (
    <div ref={ref} className="ambient-mobile pointer-events-none absolute inset-0 md:hidden" aria-hidden>
      <div className="ambient-mobile-mesh" />
      <div className="ambient-mobile-orb ambient-mobile-orb--a" />
      <div className="ambient-mobile-orb ambient-mobile-orb--b" />
      <div className="ambient-mobile-grid" />
      <div className="ambient-mobile-bloom" />
    </div>
  );
}
