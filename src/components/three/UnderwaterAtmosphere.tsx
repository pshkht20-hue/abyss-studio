"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    float depth = smoothstep(0.0, 1.0, vUv.y);
    vec3 col = vec3(0.0);

    float rays = sin(vUv.x * 12.0 + uTime * 0.18) * sin(vUv.y * 6.0 - uTime * 0.1);
    rays += sin(vUv.x * 5.0 - uTime * 0.06) * 0.35;
    col += vec3(0.12, 0.32, 0.42) * max(rays, 0.0) * 0.22 * (1.0 - depth * 0.4);

    float specks = noise(vUv * 100.0 + uTime * 0.03);
    col += vec3(0.6, 0.85, 0.95) * step(0.993, specks) * 0.12;

    float vig = smoothstep(0.95, 0.3, length(vUv - 0.5));
    col *= vig;

    float alpha = 0.14 * (1.0 - depth * 0.35);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function UnderwaterAtmosphere() {
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
    <mesh frustumCulled={false} renderOrder={999}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
