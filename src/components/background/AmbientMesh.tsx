"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

export function AmbientMesh() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "desktop") return;

    return motionBus.subscribe(() => {
      const { scrollProgress, pointer, scrollVelocity } = ambientStore;
      const px = (pointer.x - 0.5) * 18;
      const py = (pointer.y - 0.5) * 14;
      const stretch = 1 + scrollVelocity * 0.35;
      el.style.transform = `translate3d(${px}px, ${py + scrollProgress * -60}px, 0) scale(${stretch})`;
      el.style.opacity = String(0.36 + scrollProgress * 0.14 + scrollVelocity * 0.06);
    });
  }, []);

  return (
    <div
      ref={ref}
      className="ambient-mesh absolute inset-[-30%] hidden will-change-transform md:block"
      aria-hidden
    />
  );
}
