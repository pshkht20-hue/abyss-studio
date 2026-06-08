"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { motionBus } from "@/lib/motion-bus";

type VelocityMarqueeProps = {
  children: React.ReactNode;
  className?: string;
  baseVelocity?: number;
  scrollMultiplier?: number;
};

export function VelocityMarquee({
  children,
  className = "",
  baseVelocity = 28,
  scrollMultiplier = 3.5,
}: VelocityMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ x: 0, velocityBoost: 0, lastVelocity: 0 });

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const direction = -1;
    const half = () => track.scrollWidth / 2;

    const unsub = motionBus.subscribe((dtMs) => {
      const v = ambientStore.scrollVelocity;
      const s = stateRef.current;
      if (v > s.lastVelocity + 0.015) {
        s.velocityBoost = -v * 42 * scrollMultiplier;
      }
      s.lastVelocity = v;

      const dt = dtMs / 1000;
      const halfW = half();
      if (halfW <= 0) return;

      s.x += (baseVelocity * direction + s.velocityBoost) * dt;
      if (s.x <= -halfW) s.x += halfW;
      if (s.x >= 0) s.x -= halfW;
      track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0)`;
      s.velocityBoost *= 0.9;
    });

    const ro = new ResizeObserver(() => {
      stateRef.current.x = 0;
    });
    ro.observe(track);

    return () => {
      unsub();
      ro.disconnect();
    };
  }, [baseVelocity, scrollMultiplier]);

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}
