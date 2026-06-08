"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/data/site";

export function ScrollRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.querySelector(`[data-chapter="${c.id}"]`))
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActive(idx);
          }
        });
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: 0 },
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <aside className="pointer-events-none fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col gap-5 pl-4">
        <div
          className="absolute top-2 bottom-2 left-0 w-px bg-hairline"
          aria-hidden
        />
        {chapters.map((ch, i) => (
          <div
            key={ch.id}
            className={`relative flex items-center gap-3 transition-all duration-500 ${
              i === active ? "translate-x-0.5" : ""
            }`}
          >
            <span
              className={`absolute -left-4 h-px transition-all duration-500 ${
                i === active ? "w-3 bg-mutation" : "w-1.5 bg-hairline"
              }`}
            />
            <span
              className={`font-mono text-[9px] tracking-[0.3em] uppercase transition-colors duration-500 ${
                i === active ? "text-mutation" : "text-mute/45"
              }`}
            >
              {ch.index} · {ch.label}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
