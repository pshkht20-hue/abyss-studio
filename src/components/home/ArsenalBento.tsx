import { services } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { StaggerSection } from "@/components/motion/StaggerSection";
import { SplitWords } from "@/components/motion/SplitWords";
import { VhsSection } from "@/components/motion/VhsSection";
import { DeclassifyBar } from "@/components/ui/DeclassifyBar";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SectionWatermark } from "@/components/ui/SectionWatermark";
import { BentoTilt } from "@/components/ui/BentoTilt";
import { OrbitalRings3D } from "@/components/scene3d/OrbitalRings3D";

export function ArsenalBento() {
  return (
    <VhsSection id="arsenal" data-chapter="ARSENAL" className="relative px-6 py-24 md:px-10 md:py-36">
      <SectionWatermark className="right-4 top-8 md:right-10 md:top-12">02</SectionWatermark>
      <OrbitalRings3D size="280px" speed={0.7} className="arsenal-rings-accent" />
      <div className="relative mx-auto max-w-7xl">
        <DeclassifyBar />
        <MonoLabel accent>AB/02 — Arsenal</MonoLabel>
        <SplitWords
          text="What we deploy"
          accentWord="deploy"
          className="type-display-section mt-8 text-bone"
        />
        <DecryptLine
          text="One capability per cell. No feature soup — each system ships as a focused module."
          mode="scrub"
          className="type-body mt-8 max-w-lg"
        />

        <StaggerSection className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {services.map((s, i) => (
            <BentoTilt
              key={s.id}
              className={`group bento-cell p-7 md:p-9 ${s.span === "wide" ? "lg:col-span-2" : ""}`}
            >
              <article data-stagger data-cursor="open">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-2xl font-medium tracking-[-0.04em] text-mutation/80">
                    {s.id}
                  </p>
                  <p className="type-meta text-mute/70">{s.tag}</p>
                </div>
                <h3 className="type-display-sm mt-8 text-bone transition-colors group-hover:text-mutation">
                  {s.title}
                </h3>
                <DecryptLine
                  text={s.description}
                  delay={i * 90}
                  className="type-body mt-5 text-sm"
                />
                <span className="mt-8 inline-block font-mono text-[10px] tracking-[0.22em] text-mute uppercase opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                  Open module →
                </span>
              </article>
            </BentoTilt>
          ))}
        </StaggerSection>
      </div>
    </VhsSection>
  );
}
