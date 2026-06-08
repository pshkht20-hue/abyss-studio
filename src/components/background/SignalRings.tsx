"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

const RINGS = [0.18, 0.32, 0.48, 0.64, 0.82] as const;

export function SignalRings() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "desktop") return;

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
    <div
      ref={ref}
      className="signal-rings pointer-events-none absolute inset-0 hidden lg:block"
      aria-hidden
    >
      {RINGS.map((size, i) => (
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
