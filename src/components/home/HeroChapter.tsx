"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import { HeroDistortionField } from "@/components/background/HeroDistortionField";
import { DecryptText } from "@/components/motion/DecryptText";
import { FloatingFragments } from "@/components/motion/FloatingFragments";
import { HeroScrollScene } from "@/components/motion/HeroScrollScene";
import { MagneticLink } from "@/components/motion/MagneticLink";
import { DocumentHeader } from "@/components/ui/DocumentHeader";
import { EncryptedLedger } from "@/components/ui/EncryptedLedger";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { PanelFrame } from "@/components/ui/PanelFrame";
import { SectionWatermark } from "@/components/ui/SectionWatermark";
import { HeroPrismField } from "@/components/scene3d/HeroPrismField";
import { CINEMA } from "@/lib/motion";

type HeroChapterProps = {
  onDistortionReady?: () => void;
};

export function HeroChapter({ onDistortionReady }: HeroChapterProps) {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDistortionReady?.();
    }
  }, [onDistortionReady]);

  const liteHero = reduced || isMobile;

  return (
    <section
      id="hero"
      data-chapter="HELIX"
      className="hero-chapter relative min-h-[calc(100dvh-var(--chrome-height))] overflow-x-clip overflow-y-visible px-5 pt-6 pb-14 md:min-h-[100dvh] md:px-10 md:pt-14 md:pb-32"
    >
      <HeroScrollScene>
        <HeroDistortionField onReady={onDistortionReady} />
        <DocumentHeader docId="AB/01" status="Signal active" filed="Q1 2026" revised="Jun 2026" />
        <SectionWatermark
          data-hero-watermark
          className="right-2 top-4 opacity-50 max-md:hidden md:right-8 md:top-10 md:opacity-60"
        >
          01
        </SectionWatermark>
        <HeroPrismField />
        <FloatingFragments />

        <div className="relative z-[1] mx-auto grid max-w-7xl grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 hidden md:flex md:col-span-1 md:justify-center">
            <p className="type-meta [writing-mode:vertical-lr] md:rotate-180">01 / Issue</p>
          </div>

          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            <MonoLabel accent>AB/01 — Build {site.build}</MonoLabel>

            <div className="mt-5 flex flex-wrap items-center gap-y-2 font-mono text-[10px] tracking-[0.24em] text-mute uppercase md:mt-7">
              <span>Mon · Wed · Fri</span>
              <span className="meta-sep">Signal // Active</span>
              <span className="meta-sep hidden sm:inline">{site.coords}</span>
            </div>

            {liteHero ? (
              <h1 data-hero-title className="type-display-hero mt-8 text-bone md:mt-12">
                Digital experiences
                <br />
                are being{" "}
                <span className="inline-block italic text-mutation text-glow-mutation">rebuilt.</span>
              </h1>
            ) : (
              <motion.h1
                data-hero-title
                className="type-display-hero mt-12 text-bone"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, ease: CINEMA, delay: 0.06 }}
              >
                Digital experiences
                <br />
                are being{" "}
                <span className="group relative inline-block cursor-default italic">
                  <span className="text-mutation text-glow-mutation transition-transform duration-500 group-hover:scale-[1.015]">
                    rebuilt.
                  </span>
                  <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-signal to-mutation transition-all duration-500 group-hover:w-full" />
                </span>
              </motion.h1>
            )}

            {liteHero ? (
              <p className="type-body-lg mt-6 max-w-2xl md:mt-10">{site.description}</p>
            ) : (
              <motion.p
                className="type-body-lg mt-10 max-w-2xl"
                data-cursor="text"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: CINEMA, delay: 0.16 }}
              >
                {site.description}
              </motion.p>
            )}

            <div className="mt-8 md:mt-14">
              {liteHero ? (
                <a
                  href="#vault"
                  className="group inline-flex items-baseline gap-3 font-display text-[clamp(1.35rem,5vw,2.75rem)] italic text-mutation"
                >
                  {site.cta}
                  <span className="font-mono text-xs not-italic tracking-[0.2em] text-signal">→</span>
                </a>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32, duration: 0.65 }}
                >
                  <MagneticLink
                    href="#vault"
                    data-cursor="open"
                    className="group inline-flex items-baseline gap-4 font-display text-[clamp(1.5rem,3vw,2.75rem)] italic text-mutation"
                  >
                    {site.cta}
                    <span className="font-mono text-xs not-italic tracking-[0.2em] text-signal transition-transform group-hover:translate-x-1.5">
                      →
                    </span>
                  </MagneticLink>
                </motion.div>
              )}
            </div>
          </div>

          <div className="col-span-12 md:col-span-3 lg:col-span-3">
            <div data-hero-panel className="max-md:mt-2 md:sticky md:top-48">
              <PanelFrame className="space-y-5 md:space-y-6">
                <div>
                  <p className="type-meta">Vol</p>
                  <p className="mt-2 font-display text-3xl tracking-[-0.02em] text-bone md:text-4xl">
                    {site.build}
                  </p>
                </div>
                <div className="h-px bg-hairline" />
                <div>
                  <p className="type-meta">Cadence</p>
                  <p className="mt-2 font-mono text-xs tracking-[0.06em] text-bone/65">
                    4–8 wk sprints
                  </p>
                </div>
                <div className="h-px bg-hairline" />
                <div>
                  <p className="type-meta mb-4">Encrypted ledger · live</p>
                  <EncryptedLedger count={4} />
                </div>
              </PanelFrame>
            </div>
          </div>
        </div>

        <div
          data-hero-footer
          className="relative z-[1] mx-auto mt-14 flex max-w-7xl items-center justify-between border-t border-hairline-soft pt-6 md:mt-24 md:pt-8"
        >
          {isMobile ? (
            <span className="type-meta">Scroll to explore</span>
          ) : (
            <DecryptText text="Scroll to decrypt" trigger={false} className="type-meta" />
          )}
          <span className="type-meta-accent">BUILD {site.build}</span>
        </div>
      </HeroScrollScene>
    </section>
  );
}
