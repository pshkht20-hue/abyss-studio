"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { ChapterId } from "@/lib/chapter-palettes";
import { ambientStore } from "@/lib/ambient-store";
import { registerGsap } from "@/lib/gsap/register";

const CHARSET = "!<>-_\\/[]{}=+*^?#0123456789ABCDEF";

type HeaderNavLinkProps = {
  href: string;
  index: string;
  label: string;
  chapter: ChapterId;
  onNavigate?: () => void;
};

export function HeaderNavLink({
  href,
  index,
  label,
  chapter,
  onNavigate,
}: HeaderNavLinkProps) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const sync = () => setActive(ambientStore.chapter === chapter);
    sync();
    return ambientStore.subscribe(sync);
  }, [chapter]);

  useGSAP(
    () => {
      registerGsap();
      const el = rootRef.current;
      const labelEl = labelRef.current;
      if (!el || !labelEl) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const scramble = () => {
        tweenRef.current?.kill();
        const state = { p: 0 };
        const chars = label.split("");

        tweenRef.current = gsap.to(state, {
          p: 1,
          duration: 0.42,
          ease: "power2.out",
          onUpdate: () => {
            const progress = state.p;
            labelEl.textContent = chars
              .map((ch, i) => {
                const threshold = i / Math.max(chars.length, 1);
                if (progress > threshold + 0.35) return ch;
                if (ch === " ") return " ";
                return CHARSET[Math.floor(Math.random() * CHARSET.length)];
              })
              .join("");
          },
          onComplete: () => {
            labelEl.textContent = label;
          },
        });
      };

      const onEnter = () => scramble();
      el.addEventListener("pointerenter", onEnter);

      return () => {
        el.removeEventListener("pointerenter", onEnter);
        tweenRef.current?.kill();
        labelEl.textContent = label;
      };
    },
    { scope: rootRef, dependencies: [label] },
  );

  return (
    <a
      ref={rootRef}
      href={href}
      onClick={onNavigate}
      data-cursor="read"
      data-active={active || undefined}
      className="header-nav-link group"
      aria-current={active ? "true" : undefined}
    >
      <span className="header-nav-link-index">{index}</span>
      <span ref={labelRef} className="header-nav-link-label">
        {label}
      </span>
      <span className="header-nav-link-glow" aria-hidden />
    </a>
  );
}
