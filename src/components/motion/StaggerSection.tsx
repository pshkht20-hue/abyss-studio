"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";

type StaggerSectionProps = {
  children: React.ReactNode;
  className?: string;
  childSelector?: string;
};

export function StaggerSection({
  children,
  className = "",
  childSelector = "[data-stagger]",
}: StaggerSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = ref.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const items = root.querySelectorAll(childSelector);
      if (!items.length) return;

      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const offsetY = mobile ? 22 : 32;

      gsap.set(items, { opacity: 0, y: offsetY });

      const play = () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: mobile ? 0.68 : 0.85,
          stagger: mobile ? 0.07 : 0.1,
          ease: "power3.out",
        });
      };

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            play();
            obs.disconnect();
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -15% 0px" },
      );
      obs.observe(root);

      return () => obs.disconnect();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
