"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";

type SplitWordsProps = {
  text: string;
  className?: string;
  accentWord?: string;
  as?: "h1" | "h2" | "h3" | "p";
};

export function SplitWords({
  text,
  className = "",
  accentWord,
  as: Tag = "h2",
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const words = text.split(" ");
      el.innerHTML = "";
      const spans: HTMLSpanElement[] = [];

      words.forEach((word) => {
        const wrap = document.createElement("span");
        wrap.className = "split-word-mask";

        const inner = document.createElement("span");
        inner.className = "split-word-inner";
        inner.textContent = word;
        if (accentWord && word.replace(/[.,!?]/g, "") === accentWord.replace(/[.,!?]/g, "")) {
          inner.classList.add("text-mutation", "italic");
        }
        wrap.appendChild(inner);
        el.appendChild(wrap);
        spans.push(inner);
      });

      gsap.set(spans, { yPercent: 108, opacity: 0, rotateX: 10, transformOrigin: "50% 100%" });

      const play = () => {
        gsap.to(spans, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: "expo.out",
        });
      };

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            play();
            obs.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -18% 0px" },
      );
      obs.observe(el);

      return () => obs.disconnect();
    },
    { scope: ref, dependencies: [text, accentWord] },
  );

  return (
    <Tag ref={ref as never} className={`split-words ${className}`}>
      {text}
    </Tag>
  );
}
