"use client";

import { useEffect, useRef, useState } from "react";

type CursorHint = "" | "text" | "open" | "read";

const HINT_LABELS: Record<CursorHint, string> = {
  "": "",
  text: "",
  open: "OPEN →",
  read: "READ →",
};

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!fine || reduced || mobile) return;

    setEnabled(true);
    document.body.classList.add("cursor-premium");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hint: CursorHint = "";

    const setHint = (next: CursorHint) => {
      if (next === hint) return;
      hint = next;
      const ring = ringRef.current;
      const label = labelRef.current;
      if (!ring) return;

      ring.dataset.hint = next;
      if (label) {
        label.textContent = HINT_LABELS[next];
        label.style.opacity = next === "open" || next === "read" ? "1" : "0";
      }
    };

    const resolveHint = (target: HTMLElement | null): CursorHint => {
      if (!target) return "";
      const explicit = target.closest("[data-cursor]") as HTMLElement | null;
      if (explicit?.dataset.cursor === "open") return "open";
      if (explicit?.dataset.cursor === "read") return "read";
      if (explicit?.dataset.cursor === "text") return "text";
      if (target.closest("p, article, blockquote, [data-cursor='text']")) return "text";
      if (target.closest("a[href], button, input, textarea, select")) return "open";
      return "";
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setHint(resolveHint(e.target as HTMLElement));
      if (ringRef.current) {
        ringRef.current.style.opacity = "1";
      }
      if (dotRef.current) {
        dotRef.current.style.opacity = "1";
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.body.classList.remove("cursor-premium");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" data-hint="" aria-hidden>
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
