import { heroProgress, sharkFade, showShark } from "./cinematic-beats";
import { lerpShark, SHARK_KEYS } from "./scroll-timeline";

export type SharkTransform = {
  position: [number, number, number];
  yaw: number;
  pitch: number;
};

/** Co-authored with HERO_CAMERA_KEYS in scroll-timeline.ts */
export function getSharkTransform(): SharkTransform {
  const k = lerpShark(SHARK_KEYS, heroProgress());
  return {
    position: [...k.pos] as [number, number, number],
    yaw: k.yaw,
    pitch: k.pitch,
  };
}

export function sharkVisibility(): number {
  if (!showShark()) return 0;
  return sharkFade();
}
