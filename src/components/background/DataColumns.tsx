"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import {
  isLowEndDevice,
  isMobileViewport,
  prefersReducedMotion,
} from "@/lib/background-capabilities";

const CHARS = "01アイウエオαβγδεζηθλμνξπρστφχψω";
const COLS = 18;

type Column = {
  x: number;
  chars: string[];
  offset: number;
  speed: number;
};

export function DataColumns() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columns = useRef<Column[]>([]);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion() || isMobileViewport()) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const init = () => {
      columns.current = Array.from({ length: COLS }, (_, i) => ({
        x: (i + 0.5) / COLS,
        chars: Array.from({ length: 14 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
        offset: Math.random(),
        speed: 0.0004 + Math.random() * 0.0008,
      }));
    };
    init();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, isLowEndDevice() ? 1 : 1.25);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      raf.current = requestAnimationFrame(draw);
      if (!ambientStore.visible) return;

      const velocity = ambientStore.scrollVelocity;
      const scroll = ambientStore.scrollProgress;
      if (velocity < 0.02 && scroll < 0.02) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const boost = 1 + velocity * 4;

      ctx.clearRect(0, 0, w, h);
      ctx.font = "10px JetBrains Mono, ui-monospace, monospace";
      ctx.textAlign = "center";

      columns.current.forEach((col, ci) => {
        col.offset += col.speed * boost;
        if (col.offset > 1) {
          col.offset = 0;
          col.chars.unshift(CHARS[Math.floor(Math.random() * CHARS.length)]);
          col.chars.pop();
        }

        const x = col.x * w;
        const alpha = 0.04 + velocity * 0.12 + (ci % 3) * 0.01;

        col.chars.forEach((ch, ri) => {
          const y = ((col.offset + ri * 0.07) % 1.1) * h;
          const fade = 1 - ri / col.chars.length;
          const isHead = ri === 0;
          ctx.fillStyle = isHead
            ? `rgba(255, 106, 26, ${alpha * fade * 2.5})`
            : `rgba(74, 144, 226, ${alpha * fade})`;
          ctx.fillText(ch, x, y);
        });
      });
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="data-columns pointer-events-none fixed inset-0 z-[1] hidden lg:block"
      aria-hidden
    />
  );
}
