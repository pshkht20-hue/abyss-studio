"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  "data-cursor"?: string;
};

export function MagneticLink({
  href,
  children,
  className = "",
  "data-cursor": dataCursor,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 18 });
  const sy = useSpring(y, { stiffness: 180, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * 0.18);
    y.set(dy * 0.18);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor={dataCursor}
    >
      {children}
    </motion.a>
  );
}
