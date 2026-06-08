"use client";

import { useReducedMotion } from "framer-motion";

type OrbitalRings3DProps = {
  size?: string;
  className?: string;
  speed?: number;
};

export function OrbitalRings3D({
  size = "200px",
  className = "",
  speed = 1,
}: OrbitalRings3DProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`orbital-rings-3d hidden md:block ${className}`}
      style={
        {
          "--rings-size": size,
          "--rings-speed": `${speed}`,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div className={`orbital-rings-stage ${reduced ? "orbital-rings-stage--static" : ""}`}>
        <span className="orbital-ring orbital-ring--a" />
        <span className="orbital-ring orbital-ring--b" />
        <span className="orbital-ring orbital-ring--c" />
        <span className="orbital-ring-core" />
      </div>
    </div>
  );
}
