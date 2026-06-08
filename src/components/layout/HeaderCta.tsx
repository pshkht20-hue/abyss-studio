"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { CornerBracket } from "@/components/ui/CornerBracket";

type HeaderCtaProps = {
  href: string;
  children: string;
  onNavigate?: () => void;
  className?: string;
};

export function HeaderCta({ href, children, onNavigate, className = "" }: HeaderCtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.22);
    y.set(dy * 0.22);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onNavigate}
      data-cursor="open"
      className={`header-cta btn-glow ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <CornerBracket size="sm" />
      <span className="header-cta-text">{children}</span>
      <span className="header-cta-arrow" aria-hidden>
        →
      </span>
    </motion.a>
  );
}
