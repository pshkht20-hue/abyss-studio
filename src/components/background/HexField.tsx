"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier, isAmbientTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

export function HexField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isAmbientTier(getMotionTier())) return;

    return motionBus.subscribe(() => {
      const { scrollProgress, pointer, scrollVelocity } = ambientStore;
      const rot = scrollProgress * 3 + pointer.x * 4;
      const scale = 1 + scrollVelocity * 0.08;
      el.style.transform = `translate3d(${(pointer.x - 0.5) * -20}px, ${scrollProgress * -80}px, 0) rotate(${rot}deg) scale(${scale})`;
      el.style.opacity = String(0.22 + scrollProgress * 0.12 + scrollVelocity * 0.08);
    });
  }, []);

  return (
    <div ref={ref} className="hex-field pointer-events-none absolute inset-[-15%] max-md:opacity-70" aria-hidden>
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hex-pattern"
            width="56"
            height="97"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1.2)"
          >
            <path
              d="M28 0 L56 14 L56 42 L28 56 L0 42 L0 14 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.35"
            />
            <path
              d="M28 56 L56 70 L56 98 L28 112 L0 98 L0 70 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-pattern)" />
      </svg>
    </div>
  );
}
