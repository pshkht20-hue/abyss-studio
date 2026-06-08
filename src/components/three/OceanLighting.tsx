"use client";

import { Environment } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";
import { sharkStore } from "@/lib/shark-store";
import { sharkVisibility } from "@/lib/shark-motion";

/**
 * Premium underwater lighting — warm sun from surface, cool fill, hero rim on shark.
 * Environment map drives wet reflections on PBR materials.
 */
export function OceanLighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const heroKeyRef = useRef<THREE.SpotLight>(null);
  const heroRimRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = scrollStore.progress;
    const hero = sharkVisibility();
    const body = sharkStore.body;

    if (sunRef.current) {
      sunRef.current.position.set(
        2.5 + Math.sin(t * 0.018) * 0.2,
        16 - p * 7,
        4 + p * 1.5,
      );
      sunRef.current.intensity = THREE.MathUtils.lerp(3.8, 1.0, p);
      sunRef.current.color.lerpColors(
        new THREE.Color("#fff4e0"),
        new THREE.Color("#8ab8c8"),
        p,
      );
    }

    if (heroKeyRef.current) {
      heroKeyRef.current.position.set(body.x + 1.5, body.y + 3.5, body.z + 2.5);
      heroKeyRef.current.target.position.set(body.x, body.y, body.z);
      heroKeyRef.current.intensity = 2.2 * hero;
    }

    if (heroRimRef.current) {
      heroRimRef.current.position.set(body.x - 2.5, body.y + 1.2, body.z - 1.5);
      heroRimRef.current.intensity = 1.6 * hero;
    }
  });

  return (
    <>
      <Environment preset="city" environmentIntensity={0.32} />

      <ambientLight intensity={0.42} color="#d0f0ff" />
      <hemisphereLight
        args={["#c5eeff", "#0f3040", 0.58]}
        position={[0, 20, 0]}
      />

      <directionalLight
        ref={sunRef}
        position={[2.5, 16, 4]}
        intensity={3.8}
        color="#fff4e0"
        castShadow={false}
      />

      <directionalLight
        position={[-4, 6, 6]}
        intensity={0.35}
        color="#5ec8e0"
      />

      <spotLight
        ref={heroKeyRef}
        color="#f0fcff"
        angle={0.5}
        penumbra={0.65}
        distance={22}
        decay={2}
        intensity={0}
      >
        <object3D attach="target" position={[2.8, 0, 0]} />
      </spotLight>
      <pointLight
        ref={heroRimRef}
        color="#48d8c8"
        distance={14}
        decay={2}
        intensity={0}
      />
    </>
  );
}
