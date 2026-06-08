export type ChapterId = "HELIX" | "ARSENAL" | "PROOF" | "TIMELINE" | "VAULT";

export type ChapterPalette = {
  primary: string;
  secondary: string;
  glow: string;
};

/** Softer, closer hues — less glare when blending */
export const CHAPTER_PALETTES: Record<ChapterId, ChapterPalette> = {
  HELIX: { primary: "#D4621A", secondary: "#3A7BB8", glow: "rgba(212,98,26,0.12)" },
  ARSENAL: { primary: "#3A7BB8", secondary: "#5A62C8", glow: "rgba(58,123,184,0.11)" },
  PROOF: { primary: "#7C5CB8", secondary: "#9460C8", glow: "rgba(124,92,184,0.10)" },
  TIMELINE: { primary: "#2AB8C8", secondary: "#3A7BB8", glow: "rgba(42,184,200,0.10)" },
  VAULT: { primary: "#C9A020", secondary: "#D4621A", glow: "rgba(201,160,32,0.11)" },
};

export const CHAPTER_ORDER: ChapterId[] = [
  "HELIX",
  "ARSENAL",
  "PROOF",
  "TIMELINE",
  "VAULT",
];

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0 || 1)));
  return t * t * (3 - 2 * t);
};

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function parseGlow(glow: string): [number, number, number, number] {
  const m = glow.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return [212, 98, 26, 0.12];
  return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4] ?? 1)];
}

function mixChannel(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function toHex(r: number, g: number, b: number) {
  const clamp = (n: number) => Math.round(Math.min(255, Math.max(0, n)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

export type PaletteRgb = {
  primary: [number, number, number];
  secondary: [number, number, number];
  glow: [number, number, number, number];
};

export function paletteToRgb(p: ChapterPalette): PaletteRgb {
  return {
    primary: parseHex(p.primary),
    secondary: parseHex(p.secondary),
    glow: parseGlow(p.glow),
  };
}

export function lerpPaletteRgb(a: PaletteRgb, b: PaletteRgb, t: number): PaletteRgb {
  const u = smoothstep(0, 1, t);
  return {
    primary: [
      mixChannel(a.primary[0], b.primary[0], u),
      mixChannel(a.primary[1], b.primary[1], u),
      mixChannel(a.primary[2], b.primary[2], u),
    ],
    secondary: [
      mixChannel(a.secondary[0], b.secondary[0], u),
      mixChannel(a.secondary[1], b.secondary[1], u),
      mixChannel(a.secondary[2], b.secondary[2], u),
    ],
    glow: [
      mixChannel(a.glow[0], b.glow[0], u),
      mixChannel(a.glow[1], b.glow[1], u),
      mixChannel(a.glow[2], b.glow[2], u),
      mixChannel(a.glow[3], b.glow[3], u),
    ],
  };
}

export function lerpPalette(a: ChapterPalette, b: ChapterPalette, t: number): ChapterPalette {
  const rgb = lerpPaletteRgb(paletteToRgb(a), paletteToRgb(b), t);
  const [gr, gg, gb, ga] = rgb.glow;
  return {
    primary: toHex(rgb.primary[0], rgb.primary[1], rgb.primary[2]),
    secondary: toHex(rgb.secondary[0], rgb.secondary[1], rgb.secondary[2]),
    glow: `rgba(${Math.round(gr)},${Math.round(gg)},${Math.round(gb)},${ga.toFixed(3)})`,
  };
}

export function paletteRgbToCss(rgb: PaletteRgb): ChapterPalette {
  const [gr, gg, gb, ga] = rgb.glow;
  return {
    primary: toHex(rgb.primary[0], rgb.primary[1], rgb.primary[2]),
    secondary: toHex(rgb.secondary[0], rgb.secondary[1], rgb.secondary[2]),
    glow: `rgba(${Math.round(gr)},${Math.round(gg)},${Math.round(gb)},${ga.toFixed(3)})`,
  };
}
