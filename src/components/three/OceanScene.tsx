"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll-store";
import { dominantSection } from "@/lib/ocean-sections";
import { SharkHero } from "./SharkHero";
import { OceanLighting } from "./OceanLighting";
import { CinematicBeams } from "./CinematicBeams";
import { OceanParticles } from "./OceanParticles";
import { OceanRig } from "./OceanRig";
import { OceanPostFX } from "./OceanPostFX";
import { SeafloorCaustics } from "./SeafloorCaustics";
import { UnderwaterAtmosphere } from "./UnderwaterAtmosphere";
import { UnderwaterEnvironment } from "./UnderwaterEnvironment";
import { SectionFocals } from "./SectionFocals";

const FOG_SURFACE = new THREE.Color("#8ecae8");
const FOG_REEF = new THREE.Color("#3d7a94");
const FOG_ABYSS = new THREE.Color("#1a4a5e");

export function OceanScene() {
  const fogRef = useRef<THREE.Fog>(null);
  const causticsGroup = useRef<THREE.Group>(null);
  const bgRef = useRef(new THREE.Color("#5ec0dc"));

  useFrame((state) => {
    const p = scrollStore.progress;
    const hero = scrollStore.heroLocal;
    const section = dominantSection(p);

    if (fogRef.current) {
      fogRef.current.near = THREE.MathUtils.lerp(22, 8, p);
      fogRef.current.far = THREE.MathUtils.lerp(60, 32, p);

      const target =
        section === "hero" || section === "reef"
          ? FOG_SURFACE
          : section === "deep"
            ? FOG_REEF
            : FOG_ABYSS;
      fogRef.current.color.lerp(target, 0.08);
    }

    if (causticsGroup.current) {
      causticsGroup.current.visible = hero < 0.98 && p < 0.45;
    }

    const exposure = THREE.MathUtils.lerp(1.14, 0.86, p);
    state.gl.toneMappingExposure = exposure;

    const bgTarget =
      section === "contact" ? "#2a5a6e" : section === "work" ? "#3d8aaa" : "#5ec0dc";
    bgRef.current.set(bgTarget);
    state.scene.background = bgRef.current;
  });

  return (
    <>
      <color attach="background" args={["#5ec0dc"]} />
      <fog ref={fogRef} attach="fog" args={["#8ecae8", 22, 60]} />

      <UnderwaterEnvironment />
      <group ref={causticsGroup}>
        <SeafloorCaustics />
      </group>

      <SharkHero />
      <SectionFocals />

      <OceanRig />
      <OceanLighting />
      <CinematicBeams />

      <OceanParticles />
      <UnderwaterAtmosphere />

      <OceanPostFX />
    </>
  );
}
