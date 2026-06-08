"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
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
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const liteMotion = reduced || isMobile;
  const rotateX = useSpring(0, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 20 });
  const glowX = useSpring(50, { stiffness: 100, damping: 22 });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const transform = useMotionTemplate`perspective(720px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  const glowPos = useMotionTemplate`${glowX}% 50%`;

  const onMove = (e: React.PointerEvent) => {
    if (liteMotion) return;
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

  const prismSize = size === "lg" ? "2.5rem" : isMobile ? "1.25rem" : "1.65em";
  const spinDuration = size === "lg" ? 32 : 28;

  const inner = (
    <>
      <div className="logo-3d-mark" aria-hidden>
        {isMobile ? (
          <span className="logo-3d-mark-flat" />
        ) : (
          <Prism3D
            size={prismSize}
            spinDuration={spinDuration}
            spin={!liteMotion}
            className="logo-prism-wrap"
          />
        )}
      </div>

      <div className="logo-3d-type">
        <span className="logo-3d-abyss">
          {!isMobile &&
            Array.from({ length: DEPTH_LAYERS }, (_, i) => (
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
          {liteMotion ? (
            <span className="logo-3d-studio logo-3d-studio--flat">{site.nameAccent}</span>
          ) : (
            <motion.span
              className="logo-3d-studio"
              style={{ backgroundPosition: glowPos, backgroundSize: "200% 100%" }}
            >
              {site.nameAccent}
            </motion.span>
          )}
        </span>
      </div>
    </>
  );

  return (
    <a
      ref={ref}
      href="#"
      className={`logo-3d group ${sizeClass} ${liteMotion ? "logo-3d--lite" : ""} ${className}`}
      aria-label={`${site.name} ${site.nameAccent} home`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {liteMotion ? (
        <div className="logo-3d-inner">{inner}</div>
      ) : (
        <motion.div className="logo-3d-inner" style={{ transform }}>
          {inner}
        </motion.div>
      )}

      {showBuild && (
        <span className="logo-3d-build hidden font-mono tracking-[0.28em] text-mute uppercase lg:inline">
          b.{site.build}
        </span>
      )}
    </a>
  );
}
