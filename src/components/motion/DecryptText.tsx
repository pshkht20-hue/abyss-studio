"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { registerGsap } from "@/lib/gsap/register";

const CHARSET = "!<>-_\\/[]{}=+*^?#0123456789ABCDEF";

type DecryptTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p" | "span";
  trigger?: boolean;
};

export function DecryptText({
  text,
  className = "",
  as: Tag = "span",
  trigger = true,
}: DecryptTextProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const el = rootRef.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (el) el.textContent = text;
        return;
      }

      const chars = text.split("");
      el.innerHTML = "";
      const spans: HTMLSpanElement[] = [];

      chars.forEach((ch) => {
        const span = document.createElement("span");
        span.textContent = ch === " " ? "\u00a0" : ch;
        span.style.display = "inline-block";
        if (ch === " ") span.style.minWidth = "0.28em";
        el.appendChild(span);
        spans.push(span);
      });

      const runTimeline = () => {
        const tl = gsap.timeline({ delay: trigger ? 0 : 0.15 });

        spans.forEach((span, i) => {
          const final = chars[i];
          if (final === " ") return;

          tl.to(
            span,
            {
              duration: 0.04,
              repeat: 5,
              onRepeat: () => {
                span.textContent = CHARSET[Math.floor(Math.random() * CHARSET.length)];
              },
              onComplete: () => {
                span.textContent = final;
              },
            },
            i * 0.025,
          );

          tl.to(
            span,
            {
              color: "#4A90E2",
              duration: 0.08,
              yoyo: true,
              repeat: 1,
            },
            i * 0.025,
          );
        });
      };

      if (!trigger) {
        runTimeline();
        return;
      }

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            runTimeline();
            obs.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -18% 0px" },
      );
      obs.observe(el);

      return () => obs.disconnect();
    },
    { scope: rootRef, dependencies: [text, trigger] },
  );

  return (
    <Tag ref={rootRef as never} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}
