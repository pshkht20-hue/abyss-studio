"use client";

import { site } from "@/data/site";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

const PHRASES = [
  site.tagline,
  "Motion architecture",
  "Scroll narratives",
  "Production in mutation",
  site.coords,
] as const;

export function FooterMarquee() {
  const row = (
    <div className="flex shrink-0 items-center gap-0">
      {PHRASES.map((phrase) => (
        <span
          key={phrase}
          className="inline-flex items-center px-10 py-5 font-display text-[clamp(28px,5vw,72px)] font-light italic tracking-[-0.04em] text-bone/25"
        >
          {phrase}
          <span className="mx-8 font-mono text-[10px] not-italic tracking-[0.32em] text-mutation/50">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-t border-hairline-soft">
      <VelocityMarquee baseVelocity={22} scrollMultiplier={5}>
        {row}
      </VelocityMarquee>
    </div>
  );
}
