"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

type LoadingScreenProps = {
  onComplete: () => void;
  waitForReady?: () => boolean;
};

export function LoadingScreen({ onComplete, waitForReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("intro-active");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setProgress(100);
      setVisible(false);
      document.documentElement.classList.remove("intro-active");
      onComplete();
      return;
    }

    let frame = 0;
    const start = performance.now();
    const minDuration = 1400;
    const maxDuration = 3200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = waitForReady?.() ?? true;
      const timeProgress = Math.min(elapsed / minDuration, 1);
      const eased = 1 - Math.pow(1 - timeProgress, 2.4);
      const target = ready ? 100 : Math.min(92, Math.round(eased * 100));
      setProgress(target);

      const canExit =
        elapsed >= minDuration && (ready || elapsed >= maxDuration);

      if (canExit && !doneRef.current) {
        doneRef.current = true;
        setProgress(100);
        window.setTimeout(() => {
          setVisible(false);
          document.documentElement.classList.remove("intro-active");
          onComplete();
        }, 420);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    document.fonts.ready.then(() => {
      frame = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("intro-active");
    };
  }, [onComplete, waitForReady]);

  if (!visible) return null;

  return (
    <motion.div
      className="intro-screen fixed inset-0 z-[200] flex items-center justify-center bg-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      aria-hidden={false}
    >
          <div className="intro-brand relative flex flex-col items-center">
            <svg
              viewBox="0 0 320 160"
              className="h-auto w-[min(72vw,320px)]"
              aria-hidden
            >
              <text
                x="50%"
                y="72"
                textAnchor="middle"
                className="intro-brand-text fill-none stroke-bone font-display text-[52px] italic tracking-[-0.02em]"
                style={{ strokeWidth: 1.2 }}
              >
                {site.name}
              </text>
              <text
                x="50%"
                y="128"
                textAnchor="middle"
                className="intro-brand-accent fill-none stroke-mutation font-mono text-[18px] tracking-[0.32em]"
                style={{ strokeWidth: 1 }}
              >
                {site.nameAccent.toUpperCase()}
              </text>
            </svg>
          </div>

          <div className="absolute bottom-8 left-8 font-mono text-[10px] tracking-[0.28em] text-bone/55 uppercase md:bottom-12 md:left-12">
            <span className="mr-3 text-bone/35">Loading</span>
            <span className="tabular-nums text-bone">{progress.toString().padStart(3, "0")}</span>
            <span className="text-bone/35"> / 100</span>
          </div>

          <div className="absolute right-8 bottom-8 flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-bone/55 uppercase md:right-12 md:bottom-12">
            <span className="signal-dot scale-75" />
            <span>Signal · Acquired</span>
          </div>
    </motion.div>
  );
}
