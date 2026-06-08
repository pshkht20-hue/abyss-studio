"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";

type Jelly = {
  position: [number, number, number];
  phase: number;
  scale: number;
  color: string;
};

export function JellyfishField() {
  const groupRef = useRef<THREE.Group>(null);

  const jellies = useMemo<Jelly[]>(
    () => [
      { position: [-3.2, 1.2, -2], phase: 0, scale: 0.35, color: "#7ee8ff" },
      { position: [4.5, 0.6, -5], phase: 1.2, scale: 0.28, color: "#b8a0ff" },
      { position: [-1.8, 2.1, -7], phase: 2.4, scale: 0.22, color: "#5ee0c8" },
      { position: [2.8, 1.5, -9], phase: 3.1, scale: 0.3, color: "#ff9ed8" },
      { position: [-4.5, 0.3, -11], phase: 4.5, scale: 0.25, color: "#8ecfff" },
    ],
    [],
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const p = scrollStore.progress;

    groupRef.current.children.forEach((child, i) => {
      const j = jellies[i];
      child.position.set(
        j.position[0],
        j.position[1] + Math.sin(t * 0.5 + j.phase) * 0.25 - p * 0.5,
        j.position[2] - p * 3,
      );
      child.rotation.y = Math.sin(t * 0.2 + j.phase) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {jellies.map((j, i) => (
        <group key={i} scale={j.scale}>
          <mesh>
            <sphereGeometry args={[0.55, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshPhysicalMaterial
              color={j.color}
              emissive={j.color}
              emissiveIntensity={0.45}
              transmission={0.55}
              thickness={0.4}
              roughness={0.15}
              transparent
              opacity={0.82}
            />
          </mesh>
          {Array.from({ length: 6 }, (_, k) => (
            <mesh
              key={k}
              position={[
                Math.cos((k / 6) * Math.PI * 2) * 0.22,
                -0.35,
                Math.sin((k / 6) * Math.PI * 2) * 0.22,
              ]}
            >
              <cylinderGeometry args={[0.015, 0.008, 0.55 + k * 0.04, 4]} />
              <meshBasicMaterial color={j.color} transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
