"use client";

import { useEffect } from "react";
import { ambientStore } from "@/lib/ambient-store";
import { CHAPTER_ORDER, smoothstep } from "@/lib/chapter-palettes";
import { motionBus } from "@/lib/motion-bus";

const FOCAL_RATIO = 0.4;
const RECT_CACHE_MS = 120;
const HERO_LOD_THRESHOLD = 0.13;

type RectCache = {
  nodes: HTMLElement[];
  rects: DOMRect[];
  until: number;
};

let rectCache: RectCache | null = null;

function getCachedRects(nodes: HTMLElement[]) {
  const now = performance.now();
  if (
    rectCache &&
    rectCache.nodes.length === nodes.length &&
    rectCache.nodes.every((n, i) => n === nodes[i]) &&
    now < rectCache.until
  ) {
    return rectCache.rects;
  }

  const rects = nodes.map((n) => n.getBoundingClientRect());
  rectCache = { nodes: [...nodes], rects, until: now + RECT_CACHE_MS };
  return rects;
}

function invalidateRectCache() {
  rectCache = null;
}

function resolveChapterBlend(nodes: HTMLElement[]) {
  if (!nodes.length) return;

  const focalY = window.innerHeight * FOCAL_RATIO;
  const rects = getCachedRects(nodes);
  let activeIdx = 0;

  for (let i = 0; i < nodes.length; i++) {
    const rect = rects[i];
    const anchor = rect.top + rect.height * 0.38;
    if (anchor <= focalY) activeIdx = i;
  }

  const current = CHAPTER_ORDER[activeIdx];
  const nextIdx = Math.min(activeIdx + 1, CHAPTER_ORDER.length - 1);
  const next = CHAPTER_ORDER[nextIdx];

  let blend = 0;
  if (activeIdx < nodes.length - 1) {
    const curRect = rects[activeIdx];
    const nextRect = rects[nextIdx];
    const start = curRect.top + curRect.height * 0.52;
    const end = nextRect.top + nextRect.height * 0.28;
    blend = smoothstep(start, end, focalY);
  }

  ambientStore.setChapterTarget(current, next, blend);
}

export function PaletteDriver() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nodes: HTMLElement[] = [];

    const collectNodes = () => {
      nodes = CHAPTER_ORDER.map((id) =>
        document.querySelector<HTMLElement>(`[data-chapter="${id}"]`),
      ).filter(Boolean) as HTMLElement[];
      invalidateRectCache();
    };

    collectNodes();
    ambientStore.applyPaletteToDocument();

    if (reduced) {
      resolveChapterBlend(nodes);
      ambientStore.tickPalette(999);
      ambientStore.applyPaletteToDocument();
      ambientStore.setHeroInView(ambientStore.scrollProgress < HERO_LOD_THRESHOLD);
      return;
    }

    const onResize = () => {
      collectNodes();
      resolveChapterBlend(nodes);
    };
    window.addEventListener("resize", onResize, { passive: true });

    const unsub = motionBus.subscribe((dt) => {
      if (!nodes.length) collectNodes();
      resolveChapterBlend(nodes);
      ambientStore.setHeroInView(ambientStore.scrollProgress < HERO_LOD_THRESHOLD);
      ambientStore.tickPalette(dt);
      ambientStore.applyPaletteToDocument();
    });

    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
      invalidateRectCache();
    };
  }, []);

  return null;
}
