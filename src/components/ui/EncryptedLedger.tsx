"use client";

import { useEffect, useMemo, useRef } from "react";

const LABELS = ["Discovery", "Motion", "Deploy", "CRO", "Launch"] as const;
const HEX = "0123456789ABCDEF";

/** Deterministic hash — identical on server and client (no hydration mismatch). */
function seededHash(seed: number, len = 40) {
  let state = seed >>> 0;
  return Array.from({ length: len }, (_, i) => {
    state = (Math.imul(state, 1664525) + 1013904223 + i) >>> 0;
    return HEX[state % 16];
  }).join("");
}

function randomHash(len = 40) {
  return Array.from({ length: len }, () => HEX[Math.floor(Math.random() * 16)]).join("");
}

function makeRows(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(2049 + i).padStart(6, "0"),
    label: LABELS[i % LABELS.length],
    hash: `0x${seededHash(2049 + i * 31337)}`,
    ts: `${String((i * 7) % 24).padStart(2, "0")}:${String((i * 19) % 60).padStart(2, "0")}:${String((i * 11) % 60).padStart(2, "0")}`,
  }));
}

type EncryptedLedgerProps = {
  count?: number;
};

export function EncryptedLedger({ count = 5 }: EncryptedLedgerProps) {
  const rows = useMemo(() => makeRows(count), [count]);
  const hashRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const intervalMs = mobile ? 900 : 340;
    let visible = true;

    const obs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );

    const host = hashRefs.current[0]?.closest(".relative");
    if (host) obs.observe(host);

    const id = window.setInterval(() => {
      if (!visible) return;
      const idx = Math.floor(Math.random() * count);
      const el = hashRefs.current[idx];
      if (el) el.textContent = `0x${randomHash()}`;
    }, intervalMs);

    return () => {
      window.clearInterval(id);
      obs.disconnect();
    };
  }, [count]);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute top-2 bottom-2 left-[18px] w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-signal) 55%, transparent), transparent)",
        }}
      />
      <ul className="space-y-3 font-mono text-[10px] tracking-[0.18em] uppercase">
        {rows.map((row, i) => (
          <li key={row.id} className="relative flex items-center gap-3 pl-10">
            <span
              aria-hidden
              className="absolute left-[14px] h-[9px] w-[9px] -translate-x-1/2 rounded-full border border-signal"
              style={{
                background: "var(--color-ink)",
                boxShadow:
                  "0 0 0 2px var(--color-ink), 0 0 12px color-mix(in srgb, var(--color-signal) 55%, transparent)",
              }}
            />
            <span className="text-bone/70">#{row.id}</span>
            <span className="text-signal">{row.label}</span>
            <span
              ref={(el) => {
                hashRefs.current[i] = el;
              }}
              className="max-w-[12ch] truncate text-bone/55"
            >
              {row.hash}
            </span>
            <span className="ml-auto text-bone/30">{row.ts}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
