"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { OceanScene } from "./OceanScene";

export function OceanCanvas() {
  return (
    <div className="canvas-root fixed top-0 left-0 z-0 h-screen w-full">
      <Canvas
        camera={{ position: [-1.2, 0.42, 9.5], fov: 40, near: 0.1, far: 90 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: 1.12,
        }}
      >
        <Suspense fallback={null}>
          <OceanScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
