"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SECTION_FOCALS } from "@/data/ocean-assets";
import type { OceanSection } from "@/lib/ocean-sections";
import { sectionWeight } from "@/lib/ocean-sections";
import { scrollStore } from "@/lib/scroll-store";
import { enhanceOceanMaterial, pickAnimation, prepareModel } from "@/lib/gltf-utils";

type FocalSection = Exclude<OceanSection, "hero" | "contact">;

function SectionFocalModel({
  section,
  def,
}: {
  section: FocalSection;
  def: NonNullable<(typeof SECTION_FOCALS)[FocalSection]>;
}) {
  const rigRef = useRef<THREE.Group>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  const { scene, animations } = useGLTF(def.path);
  const { model, scale } = useMemo(
    () => prepareModel(scene, def.length, def.axis ?? "max"),
    [scene, def.length, def.axis],
  );
  const { actions, mixer } = useAnimations(animations, rigRef);

  useEffect(() => {
    enhanceOceanMaterial(model);
    if (def.anim && !def.static) {
      actionRef.current = pickAnimation(actions, def.anim) ?? null;
      actionRef.current
        ?.reset()
        .setLoop(THREE.LoopRepeat, Infinity)
        .setEffectiveTimeScale(def.speed ?? 1)
        .play();
    }
    return () => {
      actionRef.current?.stop();
    };
  }, [model, actions, def]);

  useFrame((state, delta) => {
    if (!rigRef.current) return;
    const w = sectionWeight(section, scrollStore.progress);
    rigRef.current.visible = w > 0.04;

    if (!def.static && rigRef.current.visible) {
      mixer.update(delta);
    }

    const t = state.clock.elapsedTime;
    const [px, py, pz] = def.position;
    rigRef.current.position.set(
      px,
      py + Math.sin(t * 0.45 + section.charCodeAt(0)) * 0.06 * w,
      pz,
    );

    if (def.rotation) {
      rigRef.current.rotation.set(def.rotation[0], def.rotation[1], def.rotation[2]);
    }

    rigRef.current.scale.setScalar(scale * THREE.MathUtils.lerp(0.85, 1, w));
  });

  return (
    <group ref={rigRef} visible={false}>
      <primitive object={model} />
    </group>
  );
}

Object.values(SECTION_FOCALS).forEach((d) => {
  if (d?.path) useGLTF.preload(d.path);
});

export function SectionFocals() {
  return (
    <Suspense fallback={null}>
      {SECTION_FOCALS.reef && (
        <SectionFocalModel section="reef" def={SECTION_FOCALS.reef} />
      )}
      {SECTION_FOCALS.deep && (
        <SectionFocalModel section="deep" def={SECTION_FOCALS.deep} />
      )}
      {SECTION_FOCALS.work && (
        <SectionFocalModel section="work" def={SECTION_FOCALS.work} />
      )}
    </Suspense>
  );
}
