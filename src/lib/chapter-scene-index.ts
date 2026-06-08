import type { ChapterId } from "./chapter-palettes";
import { CHAPTER_ORDER } from "./chapter-palettes";

export function chapterSceneIndex(chapter: ChapterId, next: ChapterId, blend: number) {
  const a = CHAPTER_ORDER.indexOf(chapter);
  const b = CHAPTER_ORDER.indexOf(next);
  if (a < 0) return 0;
  const from = a;
  const to = b < 0 ? a : b;
  return from + (to - from) * Math.min(1, Math.max(0, blend));
}
