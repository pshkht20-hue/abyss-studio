"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";

type HeroScrollSceneProps = {
  children: React.ReactNode;
};

export function HeroScrollScene({ children }: HeroScrollSceneProps) {
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = pinRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const section = root.closest("section");
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const title = root.querySelector<HTMLElement>("[data-hero-title]");
        const panel = root.querySelector<HTMLElement>("[data-hero-panel]");
        const footer = root.querySelector<HTMLElement>("[data-hero-footer]");
        const watermark = root.querySelector<HTMLElement>("[data-hero-watermark]");
        const orb = root.querySelector<HTMLElement>("[data-hero-orb]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=85%",
            pin: true,
            pinType: "fixed",
            pinSpacing: true,
            scrub: 0.8,
            anticipatePin: 1,
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
      });

      /* Mobile: NO pin — pin-spacer caused the empty hole under header on iOS */
      mm.add("(max-width: 767px)", () => {
        const title = root.querySelector<HTMLElement>("[data-hero-title]");
        const footer = root.querySelector<HTMLElement>("[data-hero-footer]");

        if (title && section) {
          gsap.to(title, {
            opacity: 0.82,
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top+=30%",
              scrub: true,
            },
          });
        }
        if (footer && section) {
          gsap.to(footer, {
            opacity: 0.35,
            y: 12,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top+=20%",
              scrub: true,
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: pinRef },
  );

  return (
    <div ref={pinRef} data-hero-pin className="relative min-h-[calc(100dvh-var(--chrome-height))] md:min-h-[inherit]">
      {children}
    </div>
  );
}
