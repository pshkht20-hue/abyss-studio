"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

type ParallaxLayerProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
};

export function ParallaxLayer({ children, speed = 0.15, className = "" }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getMotionTier() !== "desktop") return;

    return motionBus.subscribe(() => {
      const y = ambientStore.scrollProgress * window.innerHeight * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
