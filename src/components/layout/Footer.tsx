import { site, navItems } from "@/data/site";
import { DecryptLine } from "@/components/motion/DecryptLine";
import { Logo3D } from "@/components/ui/Logo3D";
import { FooterMarquee } from "./FooterMarquee";

const LOG = [
  { time: "T-01:00", event: "Homepage render", status: "200/OK" },
  { time: "T-01:01", event: "Motion systems", status: "ACTIVE" },
  { time: "T-01:02", event: `Build ${site.build}`, status: "DEPLOYED" },
  { time: "T-01:03", event: "Typography stack", status: "LOADED" },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-hairline">
      <FooterMarquee />
      <div className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="type-meta">// Transmission log</p>
              <div className="mt-8">
                {LOG.map((row, i) => (
                  <div key={row.time} className="log-row">
                    <span>{row.time}</span>
                    <DecryptLine
                      text={row.event}
                      delay={i * 80}
                      className="text-bone/50"
                    />
                    <span className="log-status--ok">{row.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <p className="type-meta">Navigate</p>
              <nav className="mt-6 flex flex-col gap-3">
                {navItems.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="group flex items-center gap-3 font-mono text-xs text-bone/55 transition-colors hover:text-mutation"
                  >
                    <span className="type-meta-accent opacity-50 group-hover:opacity-100">
                      0{i + 2}
                    </span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="md:col-span-4">
              <p className="type-meta">Direct line</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-block font-mono text-sm tracking-[0.04em] text-signal text-glow-signal transition-opacity hover:opacity-75"
              >
                {site.email}
              </a>
              <DecryptLine
                text="Response within 24 hours. Motion brief included with every inquiry."
                mode="scrub"
                className="type-body mt-6 max-w-xs text-sm"
              />
            </div>
          </div>

          <div className="mt-24 border-t border-hairline-soft pt-16">
            <Logo3D size="lg" showBuild={false} className="footer-logo" />
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <DecryptLine
                text={`© ${new Date().getFullYear()} · ${site.tagline}`}
                className="type-meta"
              />
              <p className="type-meta">{site.coords}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
