"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ambientStore } from "@/lib/ambient-store";

const FRAGMENTS = [
  { label: "GSAP", x: "78%", y: "18%", delay: 0 },
  { label: "MOTION", x: "84%", y: "38%", delay: 0.4 },
  { label: "SIGNAL", x: "72%", y: "58%", delay: 0.8 },
  { label: "BUILD", x: "88%", y: "72%", delay: 1.2 },
] as const;

export function FloatingFragments() {
  const reduced = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || mobile) return;
    const unsub = ambientStore.subscribe(() => {
      setVelocity(ambientStore.scrollVelocity);
    });
    return unsub;
  }, [reduced, mobile]);

  if (reduced) return null;

  const visible = mobile ? FRAGMENTS.slice(0, 2) : FRAGMENTS;

  if (mobile) {
    return (
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        {visible.map((f) => (
          <span
            key={f.label}
            className="absolute font-mono text-[10px] tracking-[0.32em] text-mute/35 uppercase"
            style={{ left: f.x, top: f.y }}
          >
            {f.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {visible.map((f) => (
        <motion.span
          key={f.label}
          className="absolute font-mono text-[10px] tracking-[0.32em] text-mute/40 uppercase"
          style={{ left: f.x, top: f.y }}
          animate={{
            opacity: [0.2, 0.55 + velocity * 0.3, 0.2],
            y: [0, -8 - velocity * 20, 0],
            x: velocity > 0.15 ? [0, -4, 0] : [0, 0, 0],
          }}
          transition={{
            duration: 3.5 + f.delay - velocity * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
        >
          {f.label}
        </motion.span>
      ))}
    </div>
  );
}
