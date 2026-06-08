"use client";

import { useMemo } from "react";
import * as THREE from "three";

type CoralPiece = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive: string;
};

export function CoralGarden() {
  const pieces = useMemo<CoralPiece[]>(
    () => [
      { position: [-4.2, -2.35, -4], scale: [0.5, 0.8, 0.5], color: "#ff6b8a", emissive: "#4a1028" },
      { position: [-3.5, -2.35, -5.5], scale: [0.35, 0.55, 0.35], color: "#ff9a6b", emissive: "#3a1810" },
      { position: [3.8, -2.35, -6], scale: [0.6, 0.45, 0.6], color: "#c46bff", emissive: "#2a1048" },
      { position: [4.5, -2.35, -3.5], scale: [0.4, 0.7, 0.4], color: "#ff5bb5", emissive: "#3a0a28" },
      { position: [-5.5, -2.35, -8], scale: [0.55, 0.35, 0.55], color: "#4a8a9a", emissive: "#0a2030" },
      { position: [5.2, -2.35, -9], scale: [0.45, 0.5, 0.45], color: "#6b4aff", emissive: "#1a1048" },
      { position: [0.5, -2.35, -10], scale: [0.7, 0.25, 0.7], color: "#3a6a7a", emissive: "#0a1820" },
      { position: [-2, -2.35, -11], scale: [0.5, 0.4, 0.5], color: "#e87898", emissive: "#301020" },
    ],
    [],
  );

  return (
    <group>
      {pieces.map((c, i) => (
        <mesh key={i} position={c.position} scale={c.scale} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={c.color}
            emissive={c.emissive}
            emissiveIntensity={0.25}
            metalness={0.15}
            roughness={0.65}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}
