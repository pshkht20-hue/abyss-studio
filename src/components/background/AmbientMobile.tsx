"use client";

import { useEffect, useRef, useState } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { getMotionTier, isLiteAmbientTier } from "@/lib/motion-tier";

export function AmbientMobile() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const apply = () => setVisible(isLiteAmbientTier(getMotionTier()));
    apply();

    const mqs = [
      window.matchMedia("(max-width: 767px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    mqs.forEach((mq) => mq.addEventListener("change", apply));
    return () => mqs.forEach((mq) => mq.removeEventListener("change", apply));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const unsub = ambientStore.subscribe(() => {
      const scroll = ambientStore.scrollProgress;
      el.style.setProperty("--mob-scroll", String(scroll));
    });

    return unsub;
  }, [visible]);

  if (!visible) return null;

  return (
    <div ref={ref} className="ambient-mobile pointer-events-none absolute inset-0" aria-hidden>
      <div className="ambient-mobile-mesh" />
      <div className="ambient-mobile-orb ambient-mobile-orb--a" />
      <div className="ambient-mobile-orb ambient-mobile-orb--b" />
      <div className="ambient-mobile-grid" />
    </div>
  );
}
