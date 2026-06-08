"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Prism3D } from "@/components/scene3d/Prism3D";
import { site } from "@/data/site";

type Logo3DProps = {
  showBuild?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const DEPTH_LAYERS = 5;

export function Logo3D({ showBuild = true, size = "md", className = "" }: Logo3DProps) {
  const reduced = useReducedMotion();
  const [interactive, setInteractive] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const rotateX = useSpring(0, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 20 });
  const glowX = useSpring(50, { stiffness: 100, damping: 22 });

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference) and (hover: hover)",
    );
    const apply = () => setInteractive(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const transform = useMotionTemplate`perspective(720px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  const glowPos = useMotionTemplate`${glowX}% 50%`;

  const onMove = (e: React.PointerEvent) => {
    if (!interactive) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(y * -8);
    rotateY.set(x * 12);
    glowX.set(50 + x * 28);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glowX.set(50);
  };

  const sizeClass =
    size === "sm" ? "logo-3d--sm" : size === "lg" ? "logo-3d--lg" : "logo-3d--md";

  const prismSize = size === "lg" ? "2.5rem" : "1.65em";
  const spinDuration = size === "lg" ? 32 : 28;

  const inner = (
    <>
      <div className="logo-3d-mark" aria-hidden>
        <Prism3D
          size={prismSize}
          spinDuration={spinDuration}
          spin={!reduced}
          className="logo-prism-wrap"
        />
      </div>

      <div className="logo-3d-type">
        <span className="logo-3d-abyss" aria-hidden="true">
          {Array.from({ length: DEPTH_LAYERS }, (_, i) => (
            <span
              key={i}
              className="logo-3d-depth"
              style={{ "--layer": DEPTH_LAYERS - i } as React.CSSProperties}
            >
              {site.name}
            </span>
          ))}
          <span className="logo-3d-face">{site.name}</span>
        </span>
        <span className="logo-3d-studio-wrap">
          {interactive ? (
            <motion.span
              className="logo-3d-studio"
              style={{ backgroundPosition: glowPos, backgroundSize: "200% 100%" }}
            >
              {site.nameAccent}
            </motion.span>
          ) : (
            <span className="logo-3d-studio">{site.nameAccent}</span>
          )}
        </span>
      </div>
    </>
  );

  return (
    <a
      ref={ref}
      href="#"
      className={`logo-3d group ${sizeClass} ${interactive ? "logo-3d--interactive" : ""} ${className}`}
      aria-label={`${site.name} ${site.nameAccent} home`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {interactive ? (
        <motion.div className="logo-3d-inner" style={{ transform }}>
          {inner}
        </motion.div>
      ) : (
        <div className="logo-3d-inner">{inner}</div>
      )}

      {showBuild && (
        <span className="logo-3d-build hidden font-mono tracking-[0.28em] text-mute uppercase lg:inline">
          b.{site.build}
        </span>
      )}
    </a>
  );
}
