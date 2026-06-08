import type { ChapterId, ChapterPalette, PaletteRgb } from "./chapter-palettes";
import {
  CHAPTER_PALETTES,
  lerpPaletteRgb,
  paletteRgbToCss,
  paletteToRgb,
} from "./chapter-palettes";

type Listener = () => void;

const initialRgb = paletteToRgb(CHAPTER_PALETTES.HELIX);

const state = {
  scrollProgress: 0,
  scrollVelocity: 0,
  chapter: "HELIX" as ChapterId,
  chapterBlend: 0,
  nextChapter: "HELIX" as ChapterId,
  targetChapter: "HELIX" as ChapterId,
  targetNextChapter: "HELIX" as ChapterId,
  targetBlend: 0,
  pointer: { x: 0.5, y: 0.5 },
  visible: true,
  heroInView: true,
  smoothedRgb: { ...initialRgb } as PaletteRgb,
  listeners: new Set<Listener>(),
  paletteListeners: new Set<Listener>(),
};

function notify() {
  state.listeners.forEach((fn) => fn());
}

function notifyPalette() {
  state.paletteListeners.forEach((fn) => fn());
}

function computeTargetRgb(): PaletteRgb {
  const a = paletteToRgb(CHAPTER_PALETTES[state.targetChapter]);
  const b = paletteToRgb(CHAPTER_PALETTES[state.targetNextChapter]);
  return lerpPaletteRgb(a, b, state.targetBlend);
}

function rgbDelta(a: PaletteRgb, b: PaletteRgb) {
  return (
    Math.abs(a.primary[0] - b.primary[0]) +
    Math.abs(a.primary[1] - b.primary[1]) +
    Math.abs(a.primary[2] - b.primary[2]) +
    Math.abs(a.secondary[0] - b.secondary[0]) +
    Math.abs(a.glow[3] - b.glow[3])
  );
}

export const ambientStore = {
  get scrollProgress() {
    return state.scrollProgress;
  },
  get scrollVelocity() {
    return state.scrollVelocity;
  },
  get chapter() {
    return state.chapter;
  },
  get nextChapter() {
    return state.nextChapter;
  },
  get chapterBlend() {
    return state.chapterBlend;
  },
  get pointer() {
    return state.pointer;
  },
  get visible() {
    return state.visible;
  },
  get heroInView() {
    return state.heroInView;
  },
  get palette(): ChapterPalette {
    return paletteRgbToCss(state.smoothedRgb);
  },
  get paletteRgb(): PaletteRgb {
    return state.smoothedRgb;
  },
  getSmoothedPalette(): ChapterPalette {
    return paletteRgbToCss(state.smoothedRgb);
  },
  getSmoothedPaletteRgb(): PaletteRgb {
    return state.smoothedRgb;
  },
  setScrollProgress(value: number) {
    const next = Math.min(1, Math.max(0, value));
    if (next === state.scrollProgress) return;
    state.scrollProgress = next;
    notify();
  },
  setScrollVelocity(value: number) {
    const next = Math.min(1, Math.max(0, value));
    if (Math.abs(next - state.scrollVelocity) < 0.002) return;
    state.scrollVelocity = next;
    notify();
  },
  setChapterTarget(current: ChapterId, next: ChapterId, blend: number) {
    const b = Math.min(1, Math.max(0, blend));
    if (
      state.targetChapter === current &&
      state.targetNextChapter === next &&
      Math.abs(state.targetBlend - b) < 0.001
    ) {
      return;
    }
    state.targetChapter = current;
    state.targetNextChapter = next;
    state.targetBlend = b;
    state.chapter = current;
    state.nextChapter = next;
    state.chapterBlend = b;
    notify();
  },
  setChapterTransition(current: ChapterId, next: ChapterId, blend: number) {
    ambientStore.setChapterTarget(current, next, blend);
  },
  setChapter(chapter: ChapterId) {
    ambientStore.setChapterTarget(chapter, chapter, 0);
  },
  setPointer(x: number, y: number) {
    state.pointer = { x, y };
  },
  setVisible(value: boolean) {
    if (state.visible === value) return;
    state.visible = value;
    notify();
  },
  setHeroInView(value: boolean) {
    if (state.heroInView === value) return;
    state.heroInView = value;
    notify();
  },
  /** Smooth palette toward target — call once per frame from PaletteDriver */
  tickPalette(dtMs: number) {
    const target = computeTargetRgb();
    const dt = Math.min(dtMs, 48) / 1000;
    const k = 1 - Math.exp(-1.6 * dt);
    const s = state.smoothedRgb;

    s.primary[0] += (target.primary[0] - s.primary[0]) * k;
    s.primary[1] += (target.primary[1] - s.primary[1]) * k;
    s.primary[2] += (target.primary[2] - s.primary[2]) * k;
    s.secondary[0] += (target.secondary[0] - s.secondary[0]) * k;
    s.secondary[1] += (target.secondary[1] - s.secondary[1]) * k;
    s.secondary[2] += (target.secondary[2] - s.secondary[2]) * k;
    s.glow[0] += (target.glow[0] - s.glow[0]) * k;
    s.glow[1] += (target.glow[1] - s.glow[1]) * k;
    s.glow[2] += (target.glow[2] - s.glow[2]) * k;
    s.glow[3] += (target.glow[3] - s.glow[3]) * k;

    if (rgbDelta(s, target) > 0.35) {
      notifyPalette();
    }
  },
  applyPaletteToDocument() {
    const p = paletteRgbToCss(state.smoothedRgb);
    const root = document.documentElement;
    root.style.setProperty("--ambient-primary", p.primary);
    root.style.setProperty("--ambient-secondary", p.secondary);
    root.style.setProperty("--ambient-glow", p.glow);
  },
  subscribe(fn: Listener) {
    state.listeners.add(fn);
    return () => {
      state.listeners.delete(fn);
    };
  },
  subscribePalette(fn: Listener) {
    state.paletteListeners.add(fn);
    return () => {
      state.paletteListeners.delete(fn);
    };
  },
};
