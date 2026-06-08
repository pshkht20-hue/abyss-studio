"use client";

import { tickerItems } from "@/data/site";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

export function MarketTicker() {
  const row = (
    <div className="flex shrink-0 items-center gap-0">
      {tickerItems.map((item) => (
        <span
          key={item.symbol}
          className="inline-flex items-center gap-3 px-7 py-2.5 font-mono text-[10px] tracking-[0.2em] text-mute uppercase"
        >
          <span className="text-bone/75">{item.symbol}</span>
          <span className="tabular-nums font-medium text-bone">{item.value}</span>
          <span
            className={`tabular-nums ${item.improved ? "text-signal-green" : "text-destructive"}`}
          >
            {item.change > 0 ? "+" : ""}
            {item.change}%
          </span>
          <span className="text-hairline/80">│</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker-bar fixed top-[var(--header-height)] right-0 left-0 z-40 flex overflow-hidden border-b border-hairline bg-ink">
      <div className="ticker-live-col relative z-10 flex shrink-0 items-center gap-2 border-r border-hairline bg-ink px-4 py-2.5">
        <span className="live-badge">
          <span className="signal-dot scale-75" />
          Live
        </span>
      </div>
      <div className="ticker-marquee-track relative min-w-0 flex-1 overflow-hidden">
        <VelocityMarquee baseVelocity={32} scrollMultiplier={4}>
          {row}
        </VelocityMarquee>
      </div>
    </div>
  );
}
