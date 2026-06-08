"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

export function DepthGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "desktop") return;

    return motionBus.subscribe(() => {
      const scroll = ambientStore.scrollProgress;
      const velocity = ambientStore.scrollVelocity;
      const rotX = 68 + scroll * 12 + velocity * 8;
      const y = scroll * 220 + velocity * 55;
      const scale = 1 + scroll * 0.15;
      el.style.transform = `perspective(1100px) rotateX(${rotX}deg) translate3d(0, ${y}px, 0) scale(${scale})`;
      el.style.opacity = String(0.14 + scroll * 0.1 + velocity * 0.06);
    });
  }, []);

  return (
    <div className="depth-grid-wrap pointer-events-none absolute inset-x-0 bottom-[-20%] hidden h-[55vh] md:block">
      <div ref={ref} className="depth-grid absolute inset-0 origin-bottom will-change-transform" aria-hidden />
    </div>
  );
}
