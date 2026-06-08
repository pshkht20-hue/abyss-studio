"use client";

import { useEffect, useState } from "react";
import { ambientStore } from "@/lib/ambient-store";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => setProgress(ambientStore.scrollProgress);
    update();
    return ambientStore.subscribe(update);
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-[var(--chrome-height)] right-0 left-0 z-[45] h-px bg-hairline"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-mutation transition-transform duration-150 ease-out"
        style={{
          transform: `scaleX(${progress})`,
          boxShadow: `0 0 12px var(--ambient-glow, rgba(255,106,26,0.4))`,
        }}
      />
    </div>
  );
}
