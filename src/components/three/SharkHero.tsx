"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heroProgress, jawFocus } from "@/lib/cinematic-beats";
import {
  enhanceSharkMaterial,
  findBone,
  pickAnimation,
  prepareModel,
} from "@/lib/gltf-utils";
import { getSharkTransform, sharkVisibility } from "@/lib/shark-motion";
import { scrollStore } from "@/lib/scroll-store";
import { sharkStore } from "@/lib/shark-store";

const MODEL_PATH = "/models/shark.glb";
const TARGET_LENGTH = 4.8;

useGLTF.preload(MODEL_PATH);

const _world = new THREE.Vector3();

export function SharkHero() {
  const rigRef = useRef<THREE.Group>(null);
  const orientRef = useRef<THREE.Group>(null);
  const headBone = useRef<THREE.Bone | null>(null);
  const jawBone = useRef<THREE.Bone | null>(null);
  const swimAction = useRef<THREE.AnimationAction | null>(null);
  const biteAction = useRef<THREE.AnimationAction | null>(null);

  const { scene, animations } = useGLTF(MODEL_PATH);

  const { model, scale } = useMemo(
    () => prepareModel(scene, TARGET_LENGTH, "x"),
    [scene],
  );

  const { actions, mixer } = useAnimations(animations, rigRef);

  useEffect(() => {
    enhanceSharkMaterial(model);
    headBone.current = findBone(model, ["Head_end", "Head"]);
    jawBone.current = findBone(model, ["LowerJaw"]);
    scrollStore.setReady3d(true);
  }, [model]);

  useEffect(() => {
    swimAction.current = pickAnimation(actions, [/\|Swim$/, "Swim"]);
    biteAction.current = pickAnimation(actions, [/\|Swim_Bite$/, "Swim_Bite", "Bite"]);

    swimAction.current
      ?.reset()
      .setLoop(THREE.LoopRepeat, Infinity)
      .setEffectiveTimeScale(0.9)
      .fadeIn(0.4)
      .play();

    biteAction.current
      ?.reset()
      .setLoop(THREE.LoopRepeat, Infinity)
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(0)
      .play();

    return () => Object.values(actions).forEach((a) => a?.stop());
  }, [actions]);

  useFrame((state, delta) => {
    if (!rigRef.current || !orientRef.current) return;

    const vis = sharkVisibility();
    rigRef.current.visible = vis > 0.02;

    if (scrollStore.heroLocal >= 1) return;

    mixer.update(delta);

    const hp = heroProgress();
    const biteWeight = jawFocus();
    if (swimAction.current && biteAction.current) {
      swimAction.current.setEffectiveWeight(1 - biteWeight);
      biteAction.current.setEffectiveWeight(biteWeight);
    }

    const t = state.clock.elapsedTime;
    const { position, yaw, pitch } = getSharkTransform();

    rigRef.current.position.set(
      position[0],
      position[1] + Math.sin(t * 0.3) * 0.01 * vis,
      position[2] + Math.sin(t * 0.2) * 0.006 * vis,
    );
    orientRef.current.rotation.set(pitch, yaw, 0);
    orientRef.current.scale.setScalar(scale * Math.max(vis, 0.12));

    rigRef.current.getWorldPosition(_world);
    sharkStore.setBody(_world.x, _world.y, _world.z);

    if (headBone.current) {
      headBone.current.getWorldPosition(_world);
      sharkStore.setHead(_world.x, _world.y, _world.z);
    }
    if (jawBone.current) {
      jawBone.current.getWorldPosition(_world);
      sharkStore.setJaw(_world.x, _world.y, _world.z);
    } else if (headBone.current) {
      sharkStore.setJaw(_world.x + 0.12, _world.y - 0.08, _world.z + 0.14);
    }
  }, 1);

  return (
    <group ref={rigRef}>
      <group ref={orientRef} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={model} />
      </group>
    </group>
  );
}
