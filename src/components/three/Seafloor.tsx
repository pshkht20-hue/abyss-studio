"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Seafloor() {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!matRef.current) return;
    const t = state.clock.elapsedTime;
    matRef.current.emissiveIntensity = 0.04 + Math.sin(t * 0.4) * 0.01;
  });

  return (
    <group position={[0, -5.5, -6]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120, 1, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color="#061018"
          emissive="#033a5c"
          emissiveIntensity={0.04}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Distant reef mounds */}
      {[
        [-12, -5.3, -18],
        [8, -5.2, -22],
        [-6, -5.1, -28],
        [14, -5.25, -15],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} scale={[2 + i * 0.5, 0.6, 1.8]}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#0a1f2a"
            roughness={0.9}
            emissive="#0a3040"
            emissiveIntensity={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}
