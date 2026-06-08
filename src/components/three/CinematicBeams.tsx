"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sharkFade, showShark } from "@/lib/cinematic-beats";
import { scrollStore } from "@/lib/scroll-store";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    float x = abs(vUv.x - 0.5) * 2.0;
    float beam = exp(-x * x * 8.0);
    beam *= smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
    beam *= 0.65 + sin(uTime * 0.25 + vUv.y * 4.0) * 0.08;
    vec3 col = vec3(0.55, 0.85, 0.95) * beam * uStrength;
    gl_FragColor = vec4(col, beam * uStrength * 0.12);
  }
`;

export function CinematicBeams() {
  const uniforms = useRef({
    uTime: { value: 0 },
    uStrength: { value: 0 },
  }).current;

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uStrength.value = showShark() ? 0.35 * sharkFade() : 0;
  });

  return (
    <mesh position={[0, 8, -4]} rotation={[0.12, 0, 0]}>
      <planeGeometry args={[14, 30]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
