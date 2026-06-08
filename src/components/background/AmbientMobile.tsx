"use client";

import { useEffect, useRef } from "react";
import { ambientStore } from "@/lib/ambient-store";

export function AmbientMobile() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const unsub = ambientStore.subscribe(() => {
      const scroll = ambientStore.scrollProgress;
      el.style.setProperty("--mob-scroll", String(scroll));
    });

    return unsub;
  }, []);

  return (
    <div ref={ref} className="ambient-mobile pointer-events-none absolute inset-0 md:hidden" aria-hidden>
      <div className="ambient-mobile-mesh" />
      <div className="ambient-mobile-orb ambient-mobile-orb--a" />
      <div className="ambient-mobile-orb ambient-mobile-orb--b" />
      <div className="ambient-mobile-grid" />
    </div>
  );
}
