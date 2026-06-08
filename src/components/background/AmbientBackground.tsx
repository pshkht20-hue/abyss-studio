"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ambientStore } from "@/lib/ambient-store";
import {
  canRunWebGLAmbient,
  getMotionTier,
  isAmbientTier,
  isLiteAmbientTier,
  type MotionTier,
} from "@/lib/motion-tier";
import { motionBus } from "@/lib/motion-bus";
import { AmbientMesh } from "./AmbientMesh";
import { DepthGrid } from "./DepthGrid";
import { SignalRings } from "./SignalRings";
import { AmbientMobile } from "./AmbientMobile";
import { HexField } from "./HexField";
import { ChromaticVeil } from "./ChromaticVeil";

const AmbientWebGL = dynamic(
  () => import("./AmbientWebGL").then((m) => m.AmbientWebGL),
  { ssr: false },
);

const NeuralFabric = dynamic(
  () => import("./NeuralFabric").then((m) => m.NeuralFabric),
  { ssr: false },
);

const VelocityStreaks = dynamic(
  () => import("./VelocityStreaks").then((m) => m.VelocityStreaks),
  { ssr: false },
);

const DataColumns = dynamic(
  () => import("./DataColumns").then((m) => m.DataColumns),
  { ssr: false },
);

export function AmbientBackground() {
  const bloomRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const webglLodRef = useRef<HTMLDivElement>(null);
  const neuralLodRef = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<MotionTier>("desktop");

  useEffect(() => {
    const apply = () => setTier(getMotionTier());
    apply();

    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 767px)"),
    ];
    mqs.forEach((mq) => mq.addEventListener("change", apply));
    return () => mqs.forEach((mq) => mq.removeEventListener("change", apply));
  }, []);

  const fullAmbient = isAmbientTier(tier);
  const liteAmbient = isLiteAmbientTier(tier);
  const webgl = canRunWebGLAmbient(tier);
  const mobile = tier === "mobile";

  useEffect(() => {
    if (!fullAmbient) return;

    const intensity = mobile ? 0.55 : 1;

    const unsub = motionBus.subscribe(() => {
      const scroll = ambientStore.scrollProgress;
      const velocity = ambientStore.scrollVelocity;
      const heroLod = ambientStore.heroInView;

      if (gridRef.current) {
        const y = (scroll * -120 - velocity * 40) * intensity;
        const skew = velocity * 1.2 * intensity;
        gridRef.current.style.transform = `translate3d(0, ${y}px, 0) skewY(${skew}deg)`;
      }
      if (bloomRef.current) {
        bloomRef.current.style.opacity = String(
          0.42 + scroll * 0.18 * intensity + velocity * 0.08 * intensity,
        );
      }
      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(0.58 - velocity * 0.06 * intensity);
      }
      if (horizonRef.current) {
        horizonRef.current.style.transform = `translate3d(0, ${scroll * 32 * intensity}px, 0) scaleX(${1 + velocity * 0.04 * intensity})`;
        horizonRef.current.style.opacity = String(0.22 + velocity * 0.18 * intensity);
      }

      if (webgl) {
        const lodOpacity = heroLod ? 0.06 : 1;
        if (webglLodRef.current) {
          webglLodRef.current.style.opacity = String(lodOpacity);
          webglLodRef.current.style.pointerEvents = "none";
        }
        if (neuralLodRef.current) {
          neuralLodRef.current.style.opacity = String(heroLod ? 0.04 : 0.92);
        }
      }
    });

    return unsub;
  }, [fullAmbient, mobile, webgl]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {liteAmbient && <AmbientMobile />}
      {fullAmbient && (
        <>
          {webgl && (
            <div ref={webglLodRef} className="absolute inset-0 transition-opacity duration-700">
              <AmbientWebGL />
            </div>
          )}
          <HexField />
          <AmbientMesh />
          {webgl && (
            <div ref={neuralLodRef} className="absolute inset-0 transition-opacity duration-700">
              <NeuralFabric />
            </div>
          )}
          {webgl && <DataColumns />}
          <VelocityStreaks />
          <SignalRings />
          <DepthGrid />
          <div
            ref={horizonRef}
            className="horizon-beam absolute inset-x-0 top-[38%] h-px max-md:opacity-70"
          />
          <div
            ref={gridRef}
            className="terminal-grid absolute inset-[-20%] opacity-[0.28] will-change-transform max-md:opacity-[0.18]"
          />
          <div ref={bloomRef} className="ambient-bloom absolute inset-0" />
          <ChromaticVeil />
          <div ref={vignetteRef} className="ambient-vignette absolute inset-0" />
        </>
      )}
      <div className="film-grain absolute inset-0 max-md:opacity-[0.04]" />
      <div className="scanlines absolute inset-0 opacity-[0.035] max-md:opacity-[0.022]" />
    </div>
  );
}
