"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";

const COUNT = 18;

type FishInstance = {
  phase: number;
  speed: number;
  radius: number;
  y: number;
  z: number;
  scale: number;
  hue: number;
};

export function FishSchool() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const fish = useMemo<FishInstance[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        phase: (i / COUNT) * Math.PI * 2,
        speed: 0.25 + Math.random() * 0.35,
        radius: 2.5 + Math.random() * 4,
        y: -0.8 + Math.random() * 1.6,
        z: -3 - Math.random() * 10,
        scale: 0.06 + Math.random() * 0.05,
        hue: 0.48 + Math.random() * 0.12,
      })),
    [],
  );

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const drift = scrollStore.progress * 2;

    fish.forEach((f, i) => {
      const angle = t * f.speed + f.phase;
      const x = Math.cos(angle) * f.radius + Math.sin(t * 0.3 + f.phase) * 0.4;
      const z = f.z - drift * 1.2 + Math.sin(angle * 0.5) * 0.8;
      const y = f.y + Math.sin(t * 0.8 + f.phase) * 0.15;

      dummy.position.set(x, y, z);
      dummy.rotation.set(0, angle + Math.PI / 2, Math.sin(t + f.phase) * 0.08);
      dummy.scale.setScalar(f.scale);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} castShadow>
      <coneGeometry args={[0.35, 1.2, 6]} />
      <meshStandardMaterial
        color="#5ec4e8"
        emissive="#1a5a72"
        emissiveIntensity={0.35}
        metalness={0.25}
        roughness={0.45}
      />
    </instancedMesh>
  );
}
