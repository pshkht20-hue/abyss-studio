"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/data/site";
import { ambientStore } from "@/lib/ambient-store";
import { CHAPTER_ORDER } from "@/lib/chapter-palettes";

export function ChapterIndicator() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sync = () => {
      const idx = CHAPTER_ORDER.indexOf(ambientStore.chapter);
      if (idx >= 0) setActive(idx);
    };
    sync();
    return ambientStore.subscribe(sync);
  }, []);

  const ch = chapters[active];

  return (
    <aside className="pointer-events-none fixed right-6 bottom-8 z-30 hidden text-right xl:block">
      <p className="type-meta text-mute">Active chapter</p>
      <p className="chapter-indicator-accent mt-2 font-mono text-sm tracking-[0.2em] text-mutation">
        AB/{ch.index}
      </p>
      <p className="mt-1 font-display text-2xl italic text-bone/80 transition-colors duration-700">
        {ch.label}
      </p>
      <div className="mt-3 ml-auto h-12 w-px bg-gradient-to-b from-mutation/60 to-transparent transition-opacity duration-700" />
    </aside>
  );
}
