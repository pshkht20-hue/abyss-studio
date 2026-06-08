"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  createBellyGeometry,
  createDorsalFinGeometry,
  createPectoralFinGeometry,
  createSharkBodyGeometry,
  createSharkMaterials,
  createTailLobeGeometry,
} from "./shark-geometry";
import { scrollStore } from "@/lib/scroll-store";
import { sharkStore } from "@/lib/shark-store";
import { getSharkTransform, sharkVisibility } from "@/lib/shark-motion";

const _world = new THREE.Vector3();
const HERO_SCALE = 2.2;

/** Cinematic silhouette shark — dark predator against bright water */
export function PremiumShark() {
  const rigRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const jawRef = useRef<THREE.Group>(null);

  const geos = useMemo(
    () => ({
      body: createSharkBodyGeometry(),
      belly: createBellyGeometry(),
      dorsal: createDorsalFinGeometry(),
      pectoral: createPectoralFinGeometry(),
      tailLobe: createTailLobeGeometry(),
    }),
    [],
  );

  const mats = useMemo(() => createSharkMaterials(), []);

  const eyeGeo = useMemo(() => new THREE.SphereGeometry(0.065, 16, 16), []);
  const pupilGeo = useMemo(() => new THREE.SphereGeometry(0.022, 8, 8), []);
  const jawGeo = useMemo(() => new THREE.ConeGeometry(0.1, 0.28, 12), []);

  useEffect(() => {
    scrollStore.setReady3d(true);
  }, []);

  useFrame((state) => {
    if (!rigRef.current || !tailRef.current) return;

    const t = state.clock.elapsedTime;
    const vis = sharkVisibility();

    rigRef.current.visible = vis > 0.02;
    if (!rigRef.current.visible) return;

    const { position, yaw, pitch } = getSharkTransform();

    tailRef.current.rotation.y = Math.sin(t * 2.4) * 0.14;
    if (jawRef.current) {
      jawRef.current.rotation.x = Math.sin(t * 0.9) * 0.02 - 0.025;
    }

    rigRef.current.position.set(
      position[0] + 0.4,
      position[1] + Math.sin(t * 0.35) * 0.04,
      position[2],
    );
    rigRef.current.rotation.set(
      pitch + Math.sin(t * 0.25) * 0.015,
      yaw,
      Math.sin(t * 0.6) * 0.012,
    );
    rigRef.current.scale.setScalar(HERO_SCALE * vis);

    rigRef.current.getWorldPosition(_world);
    sharkStore.setBody(_world.x, _world.y, _world.z);

    if (jawRef.current) {
      jawRef.current.getWorldPosition(_world);
      sharkStore.setJaw(_world.x, _world.y, _world.z);
      sharkStore.setHead(_world.x - 0.12, _world.y + 0.1, _world.z - 0.15);
    }
  });

  return (
    <group ref={rigRef} position={[0.5, 0.08, 0]}>
      <mesh geometry={geos.body} material={mats.skin} rotation={[Math.PI / 2, 0, 0]} castShadow />
      <mesh
        geometry={geos.belly}
        material={mats.belly}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, -0.015, 0]}
      />

      <group position={[0.28, 0.16, 1.55]}>
        <mesh geometry={eyeGeo} material={mats.eye} />
        <mesh position={[0.028, 0, 0.038]} geometry={pupilGeo} material={mats.pupil} />
      </group>
      <group position={[-0.28, 0.16, 1.55]}>
        <mesh geometry={eyeGeo} material={mats.eye} />
        <mesh position={[-0.028, 0, 0.038]} geometry={pupilGeo} material={mats.pupil} />
      </group>

      <group ref={jawRef} position={[0, -0.06, 1.82]} rotation={[0.12, 0, 0]}>
        <mesh position={[0, -0.02, 0.06]} rotation={[Math.PI / 2, 0, 0]} geometry={jawGeo} material={mats.fin} />
      </group>

      <mesh
        geometry={geos.dorsal}
        material={mats.fin}
        position={[0, 0.42, -0.35]}
        rotation={[-1.05, 0, 0]}
      />
      <mesh
        geometry={geos.pectoral}
        material={mats.fin}
        position={[0.5, -0.06, 0.35]}
        rotation={[0.05, 0.28, -1.25]}
      />
      <mesh
        geometry={geos.pectoral}
        material={mats.fin}
        position={[-0.5, -0.06, 0.35]}
        rotation={[0.05, -0.28, 1.25]}
        scale={[-1, 1, 1]}
      />

      <group ref={tailRef} position={[0, 0, -2.15]}>
        <mesh
          geometry={geos.tailLobe}
          material={mats.fin}
          position={[0, 0.2, -0.35]}
          rotation={[0.1, 0, 0]}
          scale={[1.1, 1.1, 1]}
        />
        <mesh
          geometry={geos.tailLobe}
          material={mats.fin}
          position={[0, -0.16, -0.32]}
          rotation={[-0.28, 0, Math.PI]}
          scale={[0.95, 0.85, 1]}
        />
      </group>
    </group>
  );
}
