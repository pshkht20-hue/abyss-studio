"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type BentoTiltProps = {
  children: React.ReactNode;
  className?: string;
};

export function BentoTilt({ children, className = "" }: BentoTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hoverCapable, setHoverCapable] = useState(false);
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });
  const glareX = useSpring(50, { stiffness: 200, damping: 20 });
  const glareY = useSpring(50, { stiffness: 200, damping: 20 });

  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,106,26,0.14), transparent 55%)`;

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverCapable(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (!hoverCapable) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((y - 0.5) * -8);
    rotateY.set((x - 0.5) * 10);
    glareX.set(x * 100);
    glareY.set(y * 100);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={hoverCapable ? { transform } : undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {hoverCapable && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
          aria-hidden
        />
      )}
      {children}
    </motion.div>
  );
}
