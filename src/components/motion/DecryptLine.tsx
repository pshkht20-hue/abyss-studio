"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";
import { shouldUseScrollScrub } from "@/lib/motion-tier";

const CHARSET = "!<>-_\\/[]{}=+*^?#0123456789ABCDEF";

type DecryptLineProps = {
  text: string;
  className?: string;
  start?: string;
  mode?: "reveal" | "scrub";
  delay?: number;
};

type CharMeta = {
  to: string;
  startAt: number;
  endAt: number;
  char: string;
  started: boolean;
  settled: boolean;
};

function applyDecryptProgress(
  p: number,
  meta: CharMeta[],
  spans: HTMLSpanElement[],
) {
  meta.forEach((m, i) => {
    const span = spans[i];
    if (!span || m.settled) return;
    if (p >= m.endAt) {
      span.textContent = m.to === " " ? "\u00a0" : m.to;
      span.style.color = "";
      span.style.opacity = "";
      m.settled = true;
    } else if (p >= m.startAt) {
      if (!m.started) {
        span.style.opacity = "0.85";
        m.started = true;
      }
      if (m.to !== " ") {
        if (Math.random() < 0.4 || !m.char) {
          m.char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        }
        span.textContent = m.char;
        span.style.color = "var(--color-signal)";
      }
    }
  });
}

function settleAll(meta: CharMeta[], spans: HTMLSpanElement[]) {
  meta.forEach((m, i) => {
    const span = spans[i];
    if (span) {
      span.textContent = m.to === " " ? "\u00a0" : m.to;
      span.style.color = "";
      span.style.opacity = "";
      m.settled = true;
    }
  });
}

export function DecryptLine({
  text,
  className = "",
  start = "top 82%",
  mode = "reveal",
  delay = 0,
}: DecryptLineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = rootRef.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const effectiveMode = shouldUseScrollScrub() ? mode : "reveal";
      const revealDuration = shouldUseScrollScrub() ? 1.35 : 1.05;
      const chars = Array.from(text);
      const spans: HTMLSpanElement[] = [];

      el.textContent = "";
      const words = text.split(" ");
      words.forEach((word, wi) => {
        const wrap = document.createElement("span");
        wrap.style.display = "inline-block";
        wrap.style.whiteSpace = "nowrap";
        for (const ch of Array.from(word)) {
          const span = document.createElement("span");
          span.textContent = ch;
          if (!reduced) span.style.opacity = "0";
          wrap.appendChild(span);
          spans.push(span);
        }
        el.appendChild(wrap);
        if (wi < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
          const space = document.createElement("span");
          space.style.display = "none";
          spans.push(space);
        }
      });

      if (reduced) return;

      const meta: CharMeta[] = chars.map((ch, i) => ({
        to: ch,
        startAt: (i / Math.max(chars.length, 1)) * 0.55,
        endAt: (i / Math.max(chars.length, 1)) * 0.55 + 0.4,
        char: "",
        started: false,
        settled: false,
      }));

      let tl: gsap.core.Tween | null = null;
      let st: ScrollTrigger | null = null;

      const runReveal = () => {
        meta.forEach((m) => {
          m.char = "";
          m.started = false;
          m.settled = false;
        });
        spans.forEach((span, i) => {
          if (chars[i] !== " ") span.style.opacity = "0";
        });

        const state = { p: 0 };
        tl?.kill();
        tl = gsap.to(state, {
          p: 1,
          duration: revealDuration,
          ease: "power2.out",
          onUpdate: () => applyDecryptProgress(state.p, meta, spans),
          onComplete: () => settleAll(meta, spans),
        });
      };

      const revealAll = () => {
        tl?.kill();
        st?.kill();
        settleAll(meta, spans);
      };

      document.addEventListener("declassify-all", revealAll);

      if (effectiveMode === "scrub") {
        st = ScrollTrigger.create({
          trigger: el,
          start,
          end: "top 28%",
          scrub: 0.55,
          onUpdate: (self) => {
            applyDecryptProgress(self.progress, meta, spans);
          },
          onLeave: () => settleAll(meta, spans),
          onLeaveBack: () => {
            meta.forEach((m) => {
              m.started = false;
              m.settled = false;
              m.char = "";
            });
            spans.forEach((span, i) => {
              if (chars[i] !== " ") span.style.opacity = "0";
            });
          },
        });

        return () => {
          st?.kill();
          document.removeEventListener("declassify-all", revealAll);
        };
      }

      const play = () => {
        if (delay > 0) {
          gsap.delayedCall(delay / 1000, runReveal);
        } else {
          runReveal();
        }
      };

      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

      if (inView) {
        play();
      } else {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              play();
              obs.disconnect();
            }
          },
          { threshold: 0.12, rootMargin: "0px 0px -12% 0px" },
        );
        obs.observe(el);

        return () => {
          obs.disconnect();
          tl?.kill();
          gsap.killTweensOf(el);
          document.removeEventListener("declassify-all", revealAll);
        };
      }

      return () => {
        tl?.kill();
        document.removeEventListener("declassify-all", revealAll);
      };
    },
    { scope: rootRef, dependencies: [text, start, mode, delay] },
  );

  return (
    <div ref={rootRef} className={className} aria-label={text} data-decrypt>
      {text}
    </div>
  );
}
