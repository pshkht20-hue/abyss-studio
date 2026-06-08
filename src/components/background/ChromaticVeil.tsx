"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier, isAmbientTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

export function ChromaticVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const tier = getMotionTier();
    if (!el || !isAmbientTier(tier)) return;

    const k = tier === "mobile" ? 0.45 : 1;

    return motionBus.subscribe(() => {
      const { pointer, scrollVelocity } = ambientStore;
      const shift = 1 + scrollVelocity * 4 * k;
      const px = (pointer.x - 0.5) * shift;
      const py = (pointer.y - 0.5) * shift * 0.4;
      el.style.setProperty("--chroma-x", `${px}px`);
      el.style.setProperty("--chroma-y", `${py}px`);
      el.style.opacity = String(0.12 + scrollVelocity * 0.1 * k);
    });
  }, []);

  return (
    <div
      ref={ref}
      className="chromatic-veil pointer-events-none absolute inset-0 max-md:opacity-60"
      aria-hidden
    />
  );
}
