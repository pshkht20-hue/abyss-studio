"use client";

import { useEffect, useRef } from "react";

type VhsSectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "data-chapter"?: string;
};

export function VhsSection({ children, className = "", ...rest }: VhsSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const scan = scanRef.current;
    if (!root || !scan || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scan.classList.add("vhs-scan-active");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className={`relative overflow-x-clip overflow-y-visible ${className}`} {...rest}>
      <div
        ref={scanRef}
        className="vhs-scan-line pointer-events-none absolute top-0 right-0 left-0 z-20 h-px bg-gradient-to-r from-transparent via-signal to-transparent"
        aria-hidden
      />
      {children}
    </section>
  );
}
