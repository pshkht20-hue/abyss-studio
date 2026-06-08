import { metrics } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { StaggerSection } from "@/components/motion/StaggerSection";
import { StatCard } from "@/components/ui/StatCard";
import { MonoLabel } from "@/components/ui/MonoLabel";
import { OrbitalRings3D } from "@/components/scene3d/OrbitalRings3D";

export function IntelligenceMetrics() {
  return (
    <section
      data-chapter="PROOF"
      className="relative overflow-x-clip border-y border-hairline-soft px-6 py-20 md:px-10 md:py-28"
    >
      <OrbitalRings3D size="360px" speed={0.5} className="metrics-rings-accent" />
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MonoLabel>// Signal vitals</MonoLabel>
            <DecryptLine
              text="Production metrics from shipped projects — not projections."
              mode="scrub"
              className="type-body mt-4 max-w-md text-sm"
            />
          </div>
          <p className="type-meta-accent">Updated live</p>
        </div>
        <StaggerSection className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <StatCard
              key={m.label}
              label={m.label}
              value={m.value}
              suffix={m.suffix}
              decimals={"decimals" in m ? m.decimals : undefined}
            />
          ))}
        </StaggerSection>
      </div>
    </section>
  );
}
