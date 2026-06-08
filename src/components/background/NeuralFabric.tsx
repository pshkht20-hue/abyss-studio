"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";
import {
  isLowEndDevice,
  isMobileViewport,
  prefersReducedMotion,
} from "@/lib/background-capabilities";

const NODE_COUNT = 52;
const LINK_DIST = 0.22;
const PACKET_COUNT = 28;

type Node = { x: number; y: number; vx: number; vy: number; phase: number };
type Link = { a: number; b: number };
type Packet = { link: number; t: number; speed: number };

export function NeuralFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<Node[]>([]);
  const links = useRef<Link[]>([]);
  const packets = useRef<Packet[]>([]);
  const raf = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion() || isMobileViewport()) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const lowEnd = isLowEndDevice();
    const frameSkip = lowEnd ? 1 : 0;

    const initGraph = () => {
      nodes.current = Array.from({ length: NODE_COUNT }, (_, i) => ({
        x: 0.12 + (i % 8) * 0.11 + Math.random() * 0.04,
        y: 0.08 + Math.floor(i / 8) * 0.13 + Math.random() * 0.05,
        vx: (Math.random() - 0.5) * 0.00008,
        vy: (Math.random() - 0.5) * 0.00008,
        phase: Math.random() * Math.PI * 2,
      }));

      const found: Link[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes.current[i].x - nodes.current[j].x;
          const dy = nodes.current[i].y - nodes.current[j].y;
          if (Math.hypot(dx, dy) < LINK_DIST) {
            found.push({ a: i, b: j });
          }
        }
      }
      links.current = found;

      packets.current = Array.from({ length: PACKET_COUNT }, (_, i) => ({
        link: i % Math.max(1, found.length),
        t: Math.random(),
        speed: 0.0012 + Math.random() * 0.002,
      }));
    };

    initGraph();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, lowEnd ? 1.25 : 1.75);
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

      frame.current += 1;
      if (frameSkip && frame.current % 2 !== 0) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const rgb = ambientStore.getSmoothedPaletteRgb();
      const [pr, pg, pb] = rgb.primary;
      const [sr, sg, sb] = rgb.secondary;
      const px = ambientStore.pointer.x;
      const py = ambientStore.pointer.y;
      const scroll = ambientStore.scrollProgress;
      const velocity = ambientStore.scrollVelocity;
      const time = frame.current * 0.016;

      ctx.clearRect(0, 0, w, h);

      const boost = 1 + velocity * 2.5;

      nodes.current.forEach((n) => {
        n.x += n.vx * boost;
        n.y += n.vy * boost;
        if (n.x < 0.05 || n.x > 0.95) n.vx *= -1;
        if (n.y < 0.05 || n.y > 0.95) n.vy *= -1;

        const dx = px - n.x;
        const dy = py - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.18) {
          n.x -= (dx / dist) * 0.0004;
          n.y -= (dy / dist) * 0.0003;
        }
      });

      links.current.forEach((link, li) => {
        const a = nodes.current[link.a];
        const b = nodes.current[link.b];
        if (!a || !b) return;

        const ax = a.x * w;
        const ay = a.y * h;
        const bx = b.x * w;
        const by = b.y * h;

        const pulse = 0.5 + 0.5 * Math.sin(time * 1.4 + li * 0.3 + scroll * 4);
        const alpha = (0.04 + pulse * 0.06) * (1 + velocity * 0.5);

        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, `rgba(${sr},${sg},${sb},${alpha})`);
        grad.addColorStop(0.5, `rgba(${pr},${pg},${pb},${alpha * 1.4})`);
        grad.addColorStop(1, `rgba(${sr},${sg},${sb},${alpha})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.6 + velocity * 0.4;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      });

      packets.current.forEach((pkt) => {
        const link = links.current[pkt.link];
        if (!link) return;
        const a = nodes.current[link.a];
        const b = nodes.current[link.b];
        if (!a || !b) return;

        pkt.t += pkt.speed * boost;
        if (pkt.t > 1) pkt.t = 0;

        const x = (a.x + (b.x - a.x) * pkt.t) * w;
        const y = (a.y + (b.y - a.y) * pkt.t) * h;
        const size = 1.2 + velocity * 1.5;

        ctx.beginPath();
        ctx.arc(x, y, size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${0.04 + velocity * 0.03})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${0.7 + velocity * 0.2})`;
        ctx.fill();
      });

      nodes.current.forEach((n, i) => {
        const x = n.x * w;
        const y = n.y * h;
        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + n.phase);
        const r = 1.8 + pulse * 1.2 + velocity;

        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${0.03 + pulse * 0.04})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        const mix = i / NODE_COUNT;
        ctx.fillStyle = `rgba(${Math.round(pr + (sr - pr) * mix)},${Math.round(pg + (sg - pg) * mix)},${Math.round(pb + (sb - pb) * mix)},${0.45 + pulse * 0.35})`;
        ctx.fill();

        if (i % 7 === 0) {
          ctx.font = "9px JetBrains Mono, monospace";
          ctx.fillStyle = `rgba(${sr},${sg},${sb},${0.25})`;
          ctx.fillText(`0x${(i * 17 + Math.floor(time * 3) % 256).toString(16).padStart(2, "0").toUpperCase()}`, x + 6, y - 4);
        }
      });

      const cx = w * (0.55 + (px - 0.5) * 0.06);
      const cy = h * (0.38 + (py - 0.5) * 0.05);
      const helixCount = lowEnd ? 48 : 72;

      const helixPoints: { x: number; y: number }[] = [];
      for (let i = 0; i < helixCount; i++) {
        const t = i / helixCount + scroll * 0.3 + time * 0.02;
        const angle = t * Math.PI * 6;
        const hx = cx + Math.cos(angle) * w * 0.18;
        const hy = h * (0.15 + (t % 1) * 0.7) + Math.sin(angle * 0.5) * 30;
        helixPoints.push({ x: hx, y: hy });

        ctx.beginPath();
        ctx.arc(hx, hy, 0.9 + velocity * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${0.25 + (i / helixCount) * 0.2})`;
        ctx.fill();
      }

      for (let i = 0; i < helixPoints.length; i += 3) {
        const a = helixPoints[i];
        const b = helixPoints[(i + 4) % helixPoints.length];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 160) continue;
        ctx.strokeStyle = `rgba(${sr},${sg},${sb},${(1 - dist / 160) * 0.08})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
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
      className="neural-fabric pointer-events-none fixed inset-0 z-[1] hidden md:block mix-blend-screen"
      aria-hidden
    />
  );
}
