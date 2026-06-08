import { workItems } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { StaggerSection } from "@/components/motion/StaggerSection";
import { SplitWords } from "@/components/motion/SplitWords";
import { VhsSection } from "@/components/motion/VhsSection";
import { DeclassifyBar } from "@/components/ui/DeclassifyBar";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SectionWatermark } from "@/components/ui/SectionWatermark";
import { OrbitalRings3D } from "@/components/scene3d/OrbitalRings3D";

export function ProofSection() {
  return (
    <VhsSection id="proof" data-chapter="PROOF" className="relative px-6 py-24 md:px-10 md:py-36">
      <SectionWatermark className="right-4 top-8 md:right-10 md:top-12">03</SectionWatermark>
      <OrbitalRings3D size="240px" speed={0.6} className="proof-rings-accent" />
      <div className="relative mx-auto max-w-7xl">
        <DeclassifyBar />
        <MonoLabel accent>AB/03 — Proof</MonoLabel>
        <SplitWords
          text="Selected deployments"
          accentWord="deployments"
          className="type-display-section mt-8 text-bone"
        />

        <StaggerSection className="mt-16">
          <div className="border-t border-hairline">
            {workItems.map((item, i) => (
              <a
                key={item.name}
                href="#vault"
                data-stagger
                data-cursor="read"
                className="row-accent group flex flex-col gap-4 border-b border-hairline-soft py-9 transition-colors hover:bg-ink-2/25 sm:flex-row sm:items-center sm:justify-between md:px-5"
              >
                <div>
                  <h3 className="type-display-sm text-bone transition-colors group-hover:text-mutation">
                    {item.name}
                  </h3>
                  <DecryptLine
                    text={`${item.type} · ${item.year}`}
                    delay={i * 70}
                    className="type-meta mt-3 text-mute/80"
                  />
                </div>
                <div className="flex items-center gap-5">
                  <span className="type-meta">Lighthouse</span>
                  <span className="font-mono text-3xl font-medium tabular-nums text-signal-green">
                    {item.score}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-mutation opacity-0 transition-opacity group-hover:opacity-100">
                    OPEN →
                  </span>
                </div>
              </a>
            ))}
          </div>
        </StaggerSection>
      </div>
    </VhsSection>
  );
}
