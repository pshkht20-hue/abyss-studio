"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Prism3D } from "./Prism3D";

const PRISMS = [
  { id: 1, top: "12%", left: "8%", size: "52px", variant: "diamond" as const, dur: 32 },
  { id: 2, top: "28%", right: "6%", size: "72px", variant: "cube" as const, dur: 26 },
  { id: 3, top: "58%", left: "4%", size: "40px", variant: "cube" as const, dur: 38 },
  { id: 4, top: "72%", right: "12%", size: "56px", variant: "diamond" as const, dur: 30 },
  { id: 5, top: "18%", right: "22%", size: "36px", variant: "diamond" as const, dur: 42 },
] as const;

const MOBILE_IDS = new Set([1, 2, 3]);

export function HeroPrismField() {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (reduced) return null;

  const visible = mobile ? PRISMS.filter((p) => MOBILE_IDS.has(p.id)) : PRISMS;

  return (
    <div className="hero-prism-field pointer-events-none absolute inset-0" aria-hidden>
      {visible.map((p) => (
        <div
          key={p.id}
          className="hero-prism-field-item"
          style={{
            top: p.top,
            left: "left" in p ? p.left : undefined,
            right: "right" in p ? p.right : undefined,
          }}
        >
          <Prism3D
            size={mobile ? `calc(${p.size} * 0.72)` : p.size}
            variant={p.variant}
            spinDuration={p.dur}
          />
        </div>
      ))}
      {!mobile && (
        <div className="hero-prism-field-rings">
          <div
            className="orbital-rings-3d orbital-rings-3d--hero"
            style={{ "--rings-size": "320px" } as React.CSSProperties}
          >
            <div className="orbital-rings-stage">
              <span className="orbital-ring orbital-ring--a" />
              <span className="orbital-ring orbital-ring--b" />
              <span className="orbital-ring orbital-ring--c" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
