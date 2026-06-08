"use client";

import { useState } from "react";
import { toast } from "sonner";
import { site, verticals } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { SplitWords } from "@/components/motion/SplitWords";
import { VhsSection } from "@/components/motion/VhsSection";
import { DeclassifyBar } from "@/components/ui/DeclassifyBar";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { PanelFrame } from "@/components/ui/PanelFrame";
import { CornerBracket } from "@/components/ui/CornerBracket";
import { SectionWatermark } from "@/components/ui/SectionWatermark";
import { Prism3D } from "@/components/scene3d/Prism3D";
import { isValidEmail } from "@/lib/validate-email";

const VAULT_TERMS = [
  "Free discovery call",
  "No template decks",
  "Motion brief included",
  "Next.js 16 production stack",
] as const;

export function VaultContact() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [vertical, setVertical] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async () => {
    if (!vertical) return;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, vertical }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; fallback?: string };

      if (!res.ok || !data.ok) {
        setState("error");
        const msg = data.error ?? "Dispatch failed. Try email directly.";
        setErrorMsg(msg);
        toast.error(msg);
        return;
      }

      setState("success");
      toast.success("Channel open — we'll respond within 24h.");
    } catch {
      setState("error");
      const msg = "Network error. Try email directly.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <VhsSection id="vault" data-chapter="VAULT" className="relative px-6 py-24 md:px-10 md:py-36">
      <SectionWatermark className="right-4 top-8 md:right-10 md:top-12">05</SectionWatermark>
      <div className="vault-prism-accent pointer-events-none absolute bottom-16 left-8 hidden md:block" aria-hidden>
        <Prism3D size="64px" variant="diamond" spinDuration={36} />
      </div>
      <div className="relative mx-auto grid max-w-7xl grid-cols-12 gap-10">
        <div className="col-span-12 lg:col-span-8">
          <DeclassifyBar />
          <MonoLabel accent>AB/05 — The Vault</MonoLabel>
          <SplitWords
            text="Ship what competitors can't copy."
            accentWord="can't"
            className="type-display-section mt-8 text-bone"
          />
          <DecryptLine
            text="Tell us about your project. We respond within 24 hours with scope, timeline, and a motion direction brief."
            mode="scrub"
            className="type-body mt-8 max-w-xl"
          />

          {state === "success" ? (
            <div className="relative mt-14 border border-mutation/50 bg-ink-2/55 p-10 vault-success-glow">
              <CornerBracket />
              <p className="type-meta-accent">Channel open</p>
              <DecryptLine
                text="Operator added to dispatch roster."
                className="type-display-sm mt-5 text-bone"
              />
              <a
                href={`mailto:${site.email}`}
                className="mt-8 inline-block font-mono text-sm tracking-wide text-signal text-glow-signal"
              >
                Or email directly → {site.email}
              </a>
            </div>
          ) : (
            <div className="mt-14 space-y-10">
              {step === 1 && (
                <div className="relative border border-hairline bg-ink-2/45 p-5 transition-all focus-within:border-mutation/70 focus-within:shadow-[0_0_32px_var(--ambient-glow)]">
                  <label htmlFor="vault-email" className="type-meta">
                    $ subscribe --email
                  </label>
                  <input
                    id="vault-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-invalid={email.length > 0 && !isValidEmail(email)}
                    className="mt-4 w-full border-0 bg-transparent font-mono text-xl tracking-[0.02em] text-bone outline-none placeholder:text-mute/40"
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <p className="type-meta" id="vault-vertical-label">
                    Select vertical
                  </p>
                  <div
                    className="mt-5 flex flex-wrap gap-2"
                    role="group"
                    aria-labelledby="vault-vertical-label"
                  >
                    {verticals.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVertical(v)}
                        aria-pressed={vertical === v}
                        className={`border px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-all ${
                          vertical === v
                            ? "border-mutation bg-mutation/10 text-mutation shadow-[0_0_20px_var(--ambient-glow)]"
                            : "border-hairline text-mute hover:border-mute/60 hover:text-bone/70"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {state === "error" && errorMsg && (
                <p className="font-mono text-xs text-destructive" role="alert">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-mute">
                <span className={step >= 1 ? "text-mutation" : ""}>● Email</span>
                <span className="text-hairline">→</span>
                <span className={step >= 2 ? "text-mutation" : ""}>● Vertical</span>
                <span className="text-hairline">→</span>
                <span>○ Channel open</span>
              </div>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => isValidEmail(email) && setStep(2)}
                  className="btn-glow px-10 py-4"
                  disabled={!isValidEmail(email)}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  className="btn-glow px-10 py-4"
                  data-cursor="open"
                  disabled={!vertical || state === "loading"}
                >
                  {state === "loading" ? "Dispatching…" : "Open channel →"}
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <PanelFrame className="md:sticky md:top-48">
            <p className="type-meta">Terms</p>
            <ul className="mt-6 space-y-4 font-mono text-xs leading-relaxed text-bone/55">
              {VAULT_TERMS.map((term, i) => (
                <li key={term} className="flex gap-3">
                  <span className="text-mutation">—</span>
                  <DecryptLine text={term} delay={i * 100} />
                </li>
              ))}
            </ul>
          </PanelFrame>
        </aside>
      </div>
    </VhsSection>
  );
}
