"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

export function ChromaticVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "desktop") return;

    return motionBus.subscribe(() => {
      const { pointer, scrollVelocity } = ambientStore;
      const shift = 1 + scrollVelocity * 4;
      const px = (pointer.x - 0.5) * shift;
      const py = (pointer.y - 0.5) * shift * 0.4;
      el.style.setProperty("--chroma-x", `${px}px`);
      el.style.setProperty("--chroma-y", `${py}px`);
      el.style.opacity = String(0.12 + scrollVelocity * 0.1);
    });
  }, []);

  return <div ref={ref} className="chromatic-veil pointer-events-none absolute inset-0 hidden md:block" aria-hidden />;
}
