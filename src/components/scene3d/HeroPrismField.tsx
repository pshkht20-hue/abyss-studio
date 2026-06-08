"use client";

import { useReducedMotion } from "framer-motion";
import { Prism3D } from "./Prism3D";

const PRISMS = [
  { id: 1, top: "12%", left: "8%", size: "52px", variant: "diamond" as const, dur: 32 },
  { id: 2, top: "28%", right: "6%", size: "72px", variant: "cube" as const, dur: 26 },
  { id: 3, top: "58%", left: "4%", size: "40px", variant: "cube" as const, dur: 38 },
  { id: 4, top: "72%", right: "12%", size: "56px", variant: "diamond" as const, dur: 30 },
  { id: 5, top: "18%", right: "22%", size: "36px", variant: "diamond" as const, dur: 42 },
] as const;

export function HeroPrismField() {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <div className="hero-prism-field pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
      {PRISMS.map((p) => (
        <div
          key={p.id}
          className="hero-prism-field-item"
          style={{
            top: p.top,
            left: "left" in p ? p.left : undefined,
            right: "right" in p ? p.right : undefined,
          }}
        >
          <Prism3D size={p.size} variant={p.variant} spinDuration={p.dur} />
        </div>
      ))}
      <div className="hero-prism-field-rings">
        <div className="orbital-rings-3d orbital-rings-3d--hero" style={{ "--rings-size": "320px" } as React.CSSProperties}>
          <div className="orbital-rings-stage">
            <span className="orbital-ring orbital-ring--a" />
            <span className="orbital-ring orbital-ring--b" />
            <span className="orbital-ring orbital-ring--c" />
          </div>
        </div>
      </div>
    </div>
  );
}
