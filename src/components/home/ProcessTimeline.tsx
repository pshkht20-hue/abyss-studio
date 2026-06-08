import { processSteps } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { StaggerSection } from "@/components/motion/StaggerSection";
import { SplitWords } from "@/components/motion/SplitWords";
import { VhsSection } from "@/components/motion/VhsSection";
import { DeclassifyBar } from "@/components/ui/DeclassifyBar";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { SectionWatermark } from "@/components/ui/SectionWatermark";
import { Prism3D } from "@/components/scene3d/Prism3D";

export function ProcessTimeline() {
  return (
    <VhsSection id="timeline" data-chapter="TIMELINE" className="relative px-6 py-24 md:px-10 md:py-36">
      <SectionWatermark className="right-4 top-8 md:right-10 md:top-12">04</SectionWatermark>
      <div className="relative mx-auto max-w-7xl">
        <DeclassifyBar />
        <MonoLabel accent>AB/04 — Timeline</MonoLabel>
        <SplitWords
          text="How we operate"
          accentWord="operate"
          className="type-display-section mt-8 text-bone"
        />

        <StaggerSection className="relative mt-20">
          <div className="absolute top-2 bottom-2 left-[15px] hidden w-px bg-gradient-to-b from-mutation/60 via-hairline to-transparent md:block" />
          <div className="space-y-14">
            {processSteps.map((step) => (
              <div key={step.step} data-stagger className="relative md:pl-20">
                <div className="timeline-prism-node absolute left-[-2px] hidden md:block">
                  <Prism3D size="32px" variant="diamond" spinDuration={24 + parseInt(step.step, 10) * 2} />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="font-mono text-sm font-medium text-mutation">{step.step}</span>
                  <span className="type-meta">{step.week}</span>
                </div>
                <DecryptLine
                  text={step.title}
                  delay={parseInt(step.step, 10) * 60}
                  className="type-display-sm mt-4 text-bone"
                />
                <DecryptLine
                  text={step.text}
                  mode="scrub"
                  className="type-body mt-4 max-w-lg text-sm"
                />
              </div>
            ))}
          </div>
        </StaggerSection>
      </div>
    </VhsSection>
  );
}
