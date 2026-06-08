"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";
import { underwaterEnvFragment, underwaterEnvVertex } from "./shaders/underwater-env";

export function UnderwaterEnvironment() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
  }).current;

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    matRef.current.uniforms.uProgress.value = scrollStore.progress;
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[40, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={underwaterEnvVertex}
        fragmentShader={underwaterEnvFragment}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
