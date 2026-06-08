"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";

const STREAK_COUNT = 12;

export function VelocityStreaks() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (reduced || mobile) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const streaks = Array.from({ length: STREAK_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: 0.04 + Math.random() * 0.08,
      speed: 0.3 + Math.random() * 0.5,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!ambientStore.visible) return;

      const velocity = ambientStore.scrollVelocity;
      if (velocity < 0.04) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const alpha = velocity * 0.35;
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
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] hidden md:block mix-blend-screen"
      aria-hidden
    />
  );
}
