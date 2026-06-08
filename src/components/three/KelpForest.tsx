"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";

type KelpStrandProps = {
  curve: THREE.CatmullRomCurve3;
  phase: number;
  color: string;
};

function KelpStrand({ curve, phase, color }: KelpStrandProps) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 28, 0.045, 6, false),
    [curve],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const sway = Math.sin(t * 0.45 + phase) * 0.12;
    ref.current.rotation.z = sway;
    ref.current.rotation.x = Math.sin(t * 0.3 + phase) * 0.04;
  });

  return (
    <mesh ref={ref} geometry={geometry} castShadow>
      <meshStandardMaterial
        color={color}
        emissive="#004838"
        emissiveIntensity={0.12}
        roughness={0.75}
        metalness={0.05}
      />
    </mesh>
  );
}

export function KelpForest() {
  const strands = useMemo(() => {
    const colors = ["#0d4a3a", "#0a3d32", "#12604a", "#083528"];
    return Array.from({ length: 22 }, (_, i) => {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (3.5 + Math.random() * 5);
      const z = -4 - Math.random() * 14;
      const h = 2.8 + Math.random() * 3.5;
      const lean = side * (0.3 + Math.random() * 0.5);
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, -2.4, z),
        new THREE.Vector3(x + lean * 0.15, -1.2, z + 0.2),
        new THREE.Vector3(x + lean * 0.4, 0.2, z + 0.1),
        new THREE.Vector3(x + lean * 0.6, 0.8 + h * 0.3, z - 0.1),
        new THREE.Vector3(x + lean * 0.35, -2.4 + h, z),
      ]);
      return {
        id: i,
        curve,
        phase: Math.random() * Math.PI * 2,
        color: colors[i % colors.length],
      };
    });
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.z = -scrollStore.progress * 1.5;
  });

  return (
    <group ref={groupRef}>
      {strands.map((s) => (
        <KelpStrand key={s.id} curve={s.curve} phase={s.phase} color={s.color} />
      ))}
    </group>
  );
}
