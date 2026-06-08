"use client";

import { useEffect, useRef } from "react";
import { DecryptText } from "@/components/motion/DecryptText";
import { SectionPrismAccent } from "@/components/scene3d/SectionPrismAccent";

type ChapterDividerProps = {
  roman: string;
  label: string;
};

export function ChapterDivider({ roman, label }: ChapterDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const line = lineRef.current;
    if (!root || !line || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (line) line.classList.add("chapter-divider-line--active");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          line.classList.add("chapter-divider-line--active");
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    obs.observe(root);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="hairline-t hairline-b relative h-[72px] md:h-[88px]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-4">
          <SectionPrismAccent variant="diamond" size="22px" spinDuration={22} />
          <DecryptText
            text={`${roman} · ${label}`}
            className="type-meta tracking-[0.32em]"
            as="p"
          />
        </div>
        <div className="flex items-center gap-3">
          <div
            ref={lineRef}
            className="chapter-divider-line h-px w-24 bg-gradient-to-r from-mutation/60 to-transparent md:w-48"
          />
          <span className="type-meta text-mutation/50">→</span>
        </div>
      </div>
    </div>
  );
}
