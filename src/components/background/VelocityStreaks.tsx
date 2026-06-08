"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { canRunCanvasAmbient, getMotionTier } from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";

export function VelocityStreaks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tier = getMotionTier();
    if (reduced || !canRunCanvasAmbient(tier)) return;

    const mobile = tier === "mobile";
    const streakCount = mobile ? 6 : 12;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const streaks = Array.from({ length: streakCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.04 + Math.random() * 0.08,
      speed: 0.3 + Math.random() * 0.5,
    }));

    const resize = () => {
      const dpr = mobile ? 1 : Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const unsub = motionBus.subscribe(() => {
      if (!ambientStore.visible) return;

      const velocity = ambientStore.scrollVelocity;
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (velocity < 0.04) {
        ctx.clearRect(0, 0, w, h);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const alpha = velocity * (mobile ? 0.28 : 0.35);
      ctx.strokeStyle = `rgba(74, 144, 226, ${alpha})`;
      ctx.lineWidth = 1;

      streaks.forEach((s) => {
        s.y -= s.speed * velocity * 0.02;
        if (s.y < -0.1) s.y = 1.1;

        const x = s.x * w;
        const y = s.y * h;
        const len = s.len * h * velocity * 2;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + len);
        ctx.stroke();
      });
    });

    return () => {
      unsub();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen max-md:opacity-85"
      aria-hidden
    />
  );
}
