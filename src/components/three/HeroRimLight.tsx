"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";
import { sharkStore } from "@/lib/shark-store";
import { sharkVisibility } from "@/lib/shark-motion";

/** Soft backlight — no harsh lens-flare into camera */
export function HeroRimLight() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const vis = sharkVisibility();
    const body = sharkStore.body;

    if (keyRef.current) {
      keyRef.current.position.set(body.x + 2, body.y + 4, body.z + 3);
      keyRef.current.intensity = 1.8 * vis;
    }
    if (fillRef.current) {
      fillRef.current.position.set(body.x - 1, body.y + 0.5, body.z + 2);
      fillRef.current.intensity = 0.4 * vis;
    }
  });

  return (
    <>
      <directionalLight ref={keyRef} color="#dff8ff" intensity={0} />
      <pointLight ref={fillRef} color="#6ab0c8" distance={16} decay={2} intensity={0} />
    </>
  );
}
