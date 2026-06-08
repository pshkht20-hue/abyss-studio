"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { philosophyStanzas } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { registerGsap } from "@/lib/gsap/register";

export function PhilosophyStanzas() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const root = rootRef.current;
      const bar = barRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root?.querySelectorAll("[data-stanza]").forEach((node, i) => {
          if (i === 0) {
            (node as HTMLElement).style.visibility = "visible";
            (node as HTMLElement).style.opacity = "1";
          }
        });
        if (bar) bar.style.transform = "scaleX(1)";
        return;
      }

      const mm = gsap.matchMedia();
      const observers: IntersectionObserver[] = [];

      mm.add("(min-width: 768px)", () => {
        const stanzas = gsap.utils.toArray<HTMLElement>("[data-stanza]", root);
        stanzas.forEach((node, i) => {
          gsap.set(node, { autoAlpha: i === 0 ? 1 : 0 });
          gsap.set(node.querySelectorAll(".stanza-char"), {
            yPercent: i === 0 ? 0 : 110,
          });
          gsap.set(node.querySelector(".stanza-caption"), {
            yPercent: i === 0 ? 0 : 30,
            opacity: i === 0 ? 1 : 0,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${root!.offsetHeight * Math.max(stanzas.length - 0.35, 1)}`,
            pin: true,
            pinType: "fixed",
            pinSpacing: true,
            scrub: 0.55,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        stanzas.forEach((node, i) => {
          if (i === 0) return;
          const prev = stanzas[i - 1];
          tl.to(prev.querySelectorAll(".stanza-char"), {
            yPercent: -110,
            duration: 0.55,
            ease: "expo.in",
            stagger: 0.012,
          }, i)
            .to(prev.querySelector(".stanza-caption"), { opacity: 0, yPercent: -18, duration: 0.35 }, i)
            .set(prev, { autoAlpha: 0 })
            .set(node, { autoAlpha: 1 })
            .fromTo(
              node.querySelectorAll(".stanza-char"),
              { yPercent: 110 },
              { yPercent: 0, duration: 0.65, ease: "expo.out", stagger: 0.018 },
              ">-0.04",
            )
            .fromTo(
              node.querySelector(".stanza-caption"),
              { yPercent: 24, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.45, ease: "expo.out" },
              "<+0.04",
            )
            .to({}, { duration: 0.3 });
        });
      });

      mm.add("(max-width: 767px)", () => {
        const stanzas = gsap.utils.toArray<HTMLElement>("[data-stanza]", root);
        const section = root.closest(".philosophy-stanzas");

        stanzas.forEach((node) => {
          gsap.set(node, { autoAlpha: 1, clearProps: "visibility" });
          const chars = node.querySelectorAll(".stanza-char");
          gsap.set(chars, { yPercent: 28, opacity: 0 });
        });

        const revealStanza = (node: HTMLElement) => {
          const chars = node.querySelectorAll(".stanza-char");
          gsap.to(chars, {
            yPercent: 0,
            opacity: 1,
            duration: 0.62,
            stagger: 0.022,
            ease: "power2.out",
          });
        };

        stanzas.forEach((node, i) => {
          if (i === 0) {
            revealStanza(node);
            return;
          }

          const obs = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                revealStanza(node);
                obs.disconnect();
              }
            },
            { threshold: 0.28, rootMargin: "0px 0px -8% 0px" },
          );
          obs.observe(node);
          observers.push(obs);
        });

        if (section && bar) {
          const progressObs = new IntersectionObserver(
            (entries) => {
              const visible = entries.filter((e) => e.isIntersecting).length;
              const ratio = visible / Math.max(stanzas.length, 1);
              bar.style.transform = `scaleX(${Math.min(1, ratio * 1.15)})`;
            },
            { threshold: [0, 0.25, 0.5, 0.75, 1] },
          );
          stanzas.forEach((node) => progressObs.observe(node));
          observers.push(progressObs);
        }
      });

      return () => {
        observers.forEach((obs) => obs.disconnect());
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      id="philosophy"
      className="philosophy-stanzas relative z-10 min-h-0 overflow-x-clip overflow-y-visible border-y border-hairline bg-ink md:min-h-[100dvh]"
    >
      <div className="terminal-grid pointer-events-none absolute inset-0 opacity-25 max-md:opacity-15" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, color-mix(in srgb, var(--color-mutation) 10%, transparent), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between border-b border-hairline px-6 py-4 font-mono text-[10px] tracking-[0.28em] text-bone/50 uppercase md:px-10">
        <span className="flex items-center gap-2">
          <span className="signal-dot scale-75" />
          Protocol scroll
        </span>
        <span className="hidden md:inline">Scroll to advance</span>
        <span className="text-mutation/80">Abyss · Studio</span>
      </div>

      <div
        ref={rootRef}
        className="philosophy-stanzas-inner relative flex flex-col md:min-h-[calc(100dvh-56px)] md:items-center md:justify-center md:px-10 md:py-20"
      >
        {philosophyStanzas.map((stanza, i) => (
          <div
            key={stanza.codename}
            data-stanza
            className="philosophy-stanza relative flex min-h-[78dvh] flex-col items-center justify-center px-4 py-16 text-center md:absolute md:inset-0 md:min-h-0 md:px-10 md:py-14"
            style={{ visibility: i === 0 ? "visible" : "hidden" }}
          >
            <p className="type-meta-accent mb-6">
              {stanza.index} — {String(i + 1).padStart(2, "0")}/{String(philosophyStanzas.length).padStart(2, "0")}
            </p>
            <h2
              aria-label={stanza.codename}
              className="stanza-title font-display font-light text-bone"
              style={{
                fontSize: `clamp(40px, min(16vw, calc((90vw / ${stanza.codename.length}) * 1.5)), 220px)`,
              }}
            >
              <span className="stanza-word-mask">
                {stanza.codename.split("").map((ch, ci) => (
                  <span key={ci} className="stanza-char">
                    {ch}
                  </span>
                ))}
              </span>
            </h2>
            <DecryptLine
              text={stanza.caption}
              delay={i * 80}
              className="stanza-caption mt-8 max-w-xl font-mono text-[11px] leading-relaxed tracking-[0.22em] text-bone/60 uppercase md:text-xs"
            />
          </div>
        ))}
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10 border-t border-hairline md:relative">
        <div className="flex items-center justify-between px-6 py-3 font-mono text-[10px] tracking-[0.28em] text-bone/70 uppercase md:px-10">
          <span>Reading protocol</span>
          <span className="text-mutation">●</span>
        </div>
        <div className="h-px w-full bg-hairline">
          <div
            ref={barRef}
            className="h-px w-full origin-left bg-mutation"
            style={{ transform: "scaleX(0)" }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
