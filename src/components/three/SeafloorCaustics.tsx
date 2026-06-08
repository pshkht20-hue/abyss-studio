"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  float caustic(vec2 p, float t) {
    float c = 0.0;
    c += sin(p.x * 3.2 + t * 0.5) * sin(p.y * 2.8 - t * 0.42);
    c += sin(p.x * 6.5 - t * 0.55) * sin(p.y * 5.8 + t * 0.38) * 0.5;
    return smoothstep(0.15, 0.92, c * 0.5 + 0.5);
  }

  void main() {
    float dist = length(vUv - 0.5);
    float fade = smoothstep(0.9, 0.15, dist);
    float c = caustic(vWorldPosition.xz * 0.3, uTime);

    vec3 sand = vec3(0.08, 0.22, 0.28);
    vec3 glow = vec3(0.2, 0.45, 0.52) * c;
    vec3 col = sand + glow * (0.5 + uProgress * 0.2);

    gl_FragColor = vec4(col, fade * 0.22);
  }
`;

export function SeafloorCaustics() {
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.2, -12]} receiveShadow>
      <planeGeometry args={[32, 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
