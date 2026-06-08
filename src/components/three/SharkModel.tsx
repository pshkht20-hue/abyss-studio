"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cloneSkinnedGraph } from "@/lib/clone-skinned";
import { scrollStore } from "@/lib/scroll-store";
import { getSharkTransform } from "@/lib/shark-motion";

const MODEL_PATH = "/models/shark.glb";
const TARGET_LENGTH = 4.8;

useGLTF.preload(MODEL_PATH);

function normalizeToLength(root: THREE.Object3D, targetLength: number) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  root.position.sub(center);
  const length = Math.max(size.x, size.y, size.z);
  return targetLength / length;
}

function enhanceMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const upgrade = (mat: THREE.Material) => {
      const next = mat.clone();
      if ("color" in next && next.color instanceof THREE.Color) {
        next.color.lerp(new THREE.Color("#3a6278"), 0.25);
      }
      if ("metalness" in next) {
        const std = next as THREE.MeshStandardMaterial;
        std.metalness = 0.42;
        std.roughness = 0.38;
        std.envMapIntensity = 1.4;
      }
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return next;
    };

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(upgrade)
      : upgrade(mesh.material);
  });
}

function pickSwimAction(actions: Record<string, THREE.AnimationAction | null>) {
  const entries = Object.entries(actions);
  const swim =
    entries.find(([name]) => /\|Swim$/.test(name)) ??
    entries.find(([name]) => /swim/i.test(name) && !/fast|bite/i.test(name)) ??
    entries[0];
  return swim?.[1] ?? null;
}

export function SharkModel() {
  const rigRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);

  const { model, scale } = useMemo(() => {
    const clone = cloneSkinnedGraph(scene);
    const s = normalizeToLength(clone, TARGET_LENGTH);
    return { model: clone, scale: s };
  }, [scene]);

  const { actions, mixer } = useAnimations(animations, model);

  useEffect(() => {
    enhanceMaterials(model);
    scrollStore.setReady3d(true);
  }, [model]);

  useEffect(() => {
    const swim = pickSwimAction(actions);
    swim?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.6).play();
    return () => {
      Object.values(actions).forEach((a) => a?.stop());
    };
  }, [actions]);

  useFrame((state, delta) => {
    if (!rigRef.current) return;
    mixer.update(delta);

    const t = state.clock.elapsedTime;
    const { position, yaw, pitch } = getSharkTransform();

    rigRef.current.position.set(
      position[0],
      position[1] + Math.sin(t * 0.45) * 0.04,
      position[2],
    );
    rigRef.current.rotation.set(pitch, yaw, Math.sin(t * 0.7) * 0.015);
  });

  return (
    <group ref={rigRef} scale={scale} rotation={[0, Math.PI / 2, 0]}>
      <primitive object={model} />
    </group>
  );
}
