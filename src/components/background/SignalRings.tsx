"use client";

import { useEffect, useRef, useState } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier, isAmbientTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

const RINGS_DESKTOP = [0.18, 0.32, 0.48, 0.64, 0.82] as const;
const RINGS_MOBILE = [0.22, 0.42, 0.68] as const;

export function SignalRings() {
  const ref = useRef<HTMLDivElement>(null);
  const [rings, setRings] = useState<readonly number[]>(RINGS_DESKTOP);

  useEffect(() => {
    const tier = getMotionTier();
    setRings(tier === "mobile" ? RINGS_MOBILE : RINGS_DESKTOP);
  }, []);

  useEffect(() => {
    const el = ref.current;
    const tier = getMotionTier();
    if (!el || !isAmbientTier(tier)) return;

    return motionBus.subscribe(() => {
      const { pointer, scrollProgress } = ambientStore;
      const cx = 58 + (pointer.x - 0.5) * 10;
      const cy = 38 + (pointer.y - 0.5) * 8;
      const pulse = scrollProgress * 0.35;
      el.style.setProperty("--ring-cx", `${cx}%`);
      el.style.setProperty("--ring-cy", `${cy}%`);
      el.style.setProperty("--ring-pulse", String(1 + pulse * 0.25));
    });
  }, []);

  return (
    <div ref={ref} className="signal-rings pointer-events-none absolute inset-0 max-md:opacity-80" aria-hidden>
      {rings.map((size, i) => (
        <span
          key={size}
          className="signal-ring"
          style={
            {
              "--ring-size": `${size * 100}%`,
              "--ring-delay": `${i * 0.6}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
