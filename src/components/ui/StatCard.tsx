"use client";

import { useEffect, useRef, useState } from "react";
import { CornerBracket } from "./CornerBracket";
import { Prism3D } from "@/components/scene3d/Prism3D";

type StatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
};

export function StatCard({ label, value, suffix = "", decimals = 0 }: StatCardProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || ran.current) return;
        ran.current = true;

        const start = performance.now();
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const duration = mobile ? 1100 : 1600;

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          const next = value * eased;
          setDisplay(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value, decimals]);

  return (
    <div ref={ref} data-stagger className="stat-panel relative p-6 md:p-7">
      <div className="stat-prism-accent pointer-events-none absolute top-4 right-4 max-md:scale-75 max-md:opacity-80" aria-hidden>
        <Prism3D size="20px" variant="cube" spinDuration={18} />
      </div>
      <CornerBracket size="sm" />
      <p className="type-meta">{label}</p>
      <p className="mt-5 font-mono text-[clamp(2rem,4vw,2.75rem)] leading-none font-medium tabular-nums tracking-[-0.02em] text-bone">
        {display}
        <span className="text-mutation">{suffix}</span>
      </p>
    </div>
  );
}
