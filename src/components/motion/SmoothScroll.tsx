"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";
import { ambientStore } from "@/lib/ambient-store";
import { motionBus } from "@/lib/motion-bus";

type SmoothScrollProps = {
  children: React.ReactNode;
};

function isMobileScroll() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const mobile = isMobileScroll();

      if (reduced) return;

      let lenis: Lenis | null = null;
      let nativeScrollHandler: (() => void) | null = null;
      let unsubDecay: (() => void) | null = null;
      let lenisTick: ((time: number) => void) | null = null;

      if (!mobile) {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        lenis.on("scroll", (instance) => {
          ScrollTrigger.update();
          const velocity = Math.min(1, Math.abs(instance.velocity) * 0.018);
          ambientStore.setScrollVelocity(velocity);
        });

        lenisTick = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(lenisTick);
        gsap.ticker.lagSmoothing(0);
        document.documentElement.classList.add("lenis", "lenis-smooth");
      } else {
        let lastScrollY = window.scrollY;
        let lastScrollTime = performance.now();

        nativeScrollHandler = () => {
          const now = performance.now();
          const el = document.documentElement;
          const max = el.scrollHeight - window.innerHeight;
          const progress = max > 0 ? window.scrollY / max : 0;
          ambientStore.setScrollProgress(Math.min(1, Math.max(0, progress)));

          const dy = Math.abs(window.scrollY - lastScrollY);
          const dt = Math.max(now - lastScrollTime, 8);
          const vel = Math.min(1, (dy / dt) * 0.42);
          if (dy > 0.5) ambientStore.setScrollVelocity(vel);

          lastScrollY = window.scrollY;
          lastScrollTime = now;
        };
        window.addEventListener("scroll", nativeScrollHandler, { passive: true });
        nativeScrollHandler();
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: mobile ? 0.2 : 0.5,
          onUpdate: (self) => ambientStore.setScrollProgress(self.progress),
        },
      }).to({}, { duration: 1 });

      unsubDecay = motionBus.subscribe(() => {
        const v = ambientStore.scrollVelocity;
        if (v > 0.002) {
          ambientStore.setScrollVelocity(v * 0.92);
        }
      });

      return () => {
        unsubDecay?.();
        if (lenis && lenisTick) {
          gsap.ticker.remove(lenisTick);
          lenis.destroy();
          document.documentElement.classList.remove("lenis", "lenis-smooth");
        }
        if (nativeScrollHandler) {
          window.removeEventListener("scroll", nativeScrollHandler);
        }
      };
    },
    { scope: rootRef },
  );

  return <div ref={rootRef}>{children}</div>;
}
