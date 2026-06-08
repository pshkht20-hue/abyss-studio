import * as THREE from "three";
import { scrollStore } from "./scroll-store";

export type CameraKeyframe = {
  t: number;
  pos: readonly [number, number, number];
  look: readonly [number, number, number];
  fov: number;
};

/** Hero scroll (0–1) — camera glides toward shark jaw; fixed look targets (no bone chase) */
export const HERO_CAMERA_KEYS: CameraKeyframe[] = [
  { t: 0, pos: [-1.2, 0.42, 9.5], look: [2.0, 0.05, 0.2], fov: 40 },
  { t: 0.18, pos: [-0.35, 0.24, 6.8], look: [2.04, 0.02, 0.38], fov: 36 },
  { t: 0.38, pos: [0.35, 0.1, 4.5], look: [2.07, -0.01, 0.52], fov: 33 },
  { t: 0.58, pos: [0.85, 0.05, 3.2], look: [2.09, -0.04, 0.64], fov: 30 },
  { t: 0.75, pos: [1.2, 0.02, 2.5], look: [2.1, -0.06, 0.72], fov: 28 },
  { t: 0.88, pos: [1.42, 0.0, 2.1], look: [2.11, -0.07, 0.76], fov: 26 },
  { t: 1, pos: [1.5, -0.01, 2.0], look: [2.12, -0.08, 0.78], fov: 24 },
];

/** Site scroll after hero — monotonic descent, no backward Z */
export const DIVE_CAMERA_KEYS: CameraKeyframe[] = [
  { t: 0, pos: [1.5, -0.01, 2.0], look: [2.12, -0.08, 0.78], fov: 24 },
  { t: 0.12, pos: [0.4, 0.02, 7.5], look: [0.2, -0.35, -5], fov: 30 },
  { t: 0.28, pos: [0.05, -0.15, 10.5], look: [0, -0.75, -10], fov: 34 },
  { t: 0.45, pos: [0, -0.55, 13], look: [0, -1.2, -16], fov: 36 },
  { t: 0.62, pos: [0, -1.05, 15.5], look: [0, -1.85, -24], fov: 38 },
  { t: 0.78, pos: [0, -1.55, 17.5], look: [0, -2.45, -32], fov: 40 },
  { t: 1, pos: [0, -2.2, 19], look: [0, -3.2, -42], fov: 40 },
];

export type SharkKeyframe = {
  t: number;
  pos: readonly [number, number, number];
  yaw: number;
  pitch: number;
};

export const SHARK_KEYS: SharkKeyframe[] = [
  { t: 0, pos: [2.35, 0.06, 0.15], yaw: 0.22, pitch: -0.03 },
  { t: 0.5, pos: [2.15, 0.02, 0.45], yaw: 0.14, pitch: -0.02 },
  { t: 0.75, pos: [2.05, -0.01, 0.62], yaw: 0.1, pitch: -0.015 },
  { t: 1, pos: [2.0, -0.01, 0.72], yaw: 0.08, pitch: -0.01 },
];

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

export function lerpCamera(keys: CameraKeyframe[], t: number) {
  let i = 0;
  while (i < keys.length - 1 && t > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const range = b.t - a.t || 1;
  const u = smoothstep(THREE.MathUtils.clamp((t - a.t) / range, 0, 1));
  return {
    pos: [
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], u),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], u),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], u),
    ] as [number, number, number],
    look: [
      THREE.MathUtils.lerp(a.look[0], b.look[0], u),
      THREE.MathUtils.lerp(a.look[1], b.look[1], u),
      THREE.MathUtils.lerp(a.look[2], b.look[2], u),
    ] as [number, number, number],
    fov: THREE.MathUtils.lerp(a.fov, b.fov, u),
  };
}

export function lerpShark(keys: SharkKeyframe[], t: number): SharkKeyframe {
  let i = 0;
  while (i < keys.length - 1 && t > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const range = b.t - a.t || 1;
  const u = smoothstep(THREE.MathUtils.clamp((t - a.t) / range, 0, 1));
  return {
    t,
    pos: [
      THREE.MathUtils.lerp(a.pos[0], b.pos[0], u),
      THREE.MathUtils.lerp(a.pos[1], b.pos[1], u),
      THREE.MathUtils.lerp(a.pos[2], b.pos[2], u),
    ],
    yaw: THREE.MathUtils.lerp(a.yaw, b.yaw, u),
    pitch: THREE.MathUtils.lerp(a.pitch, b.pitch, u),
  };
}

/** 0–1 progress through post-hero site scroll */
export function siteProgress(): number {
  if (scrollStore.heroLocal < 1) return 0;
  const end = scrollStore.heroGlobalEnd || 0.41;
  return THREE.MathUtils.clamp((scrollStore.progress - end) / (1 - end), 0, 1);
}
