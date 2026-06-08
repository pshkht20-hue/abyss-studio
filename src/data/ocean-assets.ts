import type { OceanSection } from "@/lib/ocean-sections";

type LengthAxis = "x" | "y" | "z" | "max";

export type SectionFocalDef = {
  path: string;
  length: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  anim?: (string | RegExp)[];
  speed?: number;
  axis?: LengthAxis;
  static?: boolean;
};

/** ONE focal model per scroll section — nothing else */
export const SECTION_FOCALS: Partial<Record<Exclude<OceanSection, "hero" | "contact">, SectionFocalDef>> = {
  reef: {
    path: "/models/manta.glb",
    length: 2.6,
    position: [14, 0.5, -11],
    rotation: [0, -1.15, 0],
    anim: ["Swim"],
    speed: 0.6,
    axis: "max",
  },
  deep: {
    path: "/models/whale.glb",
    length: 5,
    position: [-16, 0.15, -28],
    rotation: [0, 0.4, 0],
    anim: ["Swim"],
    speed: 0.45,
    axis: "max",
  },
  work: {
    path: "/models/ship.glb",
    length: 3,
    position: [0, -2.7, -38],
    rotation: [0, 0.22, 0.03],
    static: true,
    axis: "max",
  },
};
