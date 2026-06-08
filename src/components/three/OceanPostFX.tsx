"use client";

import {
  EffectComposer,
  Bloom,
  Vignette,
  BrightnessContrast,
  HueSaturation,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/** ACES grade — teal shadows, soft bloom on wet highlights */
export function OceanPostFX() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.52}
        luminanceSmoothing={0.8}
        mipmapBlur
      />
      <BrightnessContrast brightness={0.045} contrast={0.2} />
      <HueSaturation hue={0.005} saturation={0.15} />
      <Vignette eskil offset={0.05} darkness={0.22} />
    </EffectComposer>
  );
}
