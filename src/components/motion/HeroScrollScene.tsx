"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";
import { scrollScrubValue } from "@/lib/motion-tier";

type HeroScrollSceneProps = {
  children: React.ReactNode;
};

function buildHeroTimeline(
  root: HTMLElement,
  opts: { scrub: number | boolean; end: string; anticipatePin: number },
) {
  const title = root.querySelector<HTMLElement>("[data-hero-title]");
  const panel = root.querySelector<HTMLElement>("[data-hero-panel]");
  const footer = root.querySelector<HTMLElement>("[data-hero-footer]");
  const watermark = root.querySelector<HTMLElement>("[data-hero-watermark]");
  const orb = root.querySelector<HTMLElement>("[data-hero-orb]");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: opts.end,
      pin: true,
      pinType: "fixed",
      pinSpacing: true,
      scrub: opts.scrub,
      anticipatePin: opts.anticipatePin,
    },
  });

  if (title) {
    tl.to(title, { scale: 0.82, y: -48, opacity: 0.12, ease: "none" }, 0);
  }
  if (panel) {
    tl.to(panel, { x: 80, opacity: 0, ease: "none" }, 0);
  }
  if (footer) {
    tl.to(footer, { y: 40, opacity: 0, ease: "none" }, 0);
  }
  if (watermark) {
    tl.to(watermark, { scale: 1.35, opacity: 0.08, ease: "none" }, 0);
  }
  if (orb) {
    tl.to(orb, { scale: 2.2, opacity: 0.75, ease: "none" }, 0);
  }

  return tl;
}

export function HeroScrollScene({ children }: HeroScrollSceneProps) {
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = pinRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        buildHeroTimeline(root, {
          scrub: 0.8,
          end: "+=85%",
          anticipatePin: 1,
        });
      });

      mm.add("(max-width: 767px)", () => {
        buildHeroTimeline(root, {
          scrub: scrollScrubValue("mobile"),
          end: "+=72%",
          anticipatePin: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: pinRef },
  );

  return (
    <div ref={pinRef} data-hero-pin className="relative min-h-[inherit]">
      {children}
    </div>
  );
}
