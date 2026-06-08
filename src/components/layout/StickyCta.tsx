"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { ambientStore } from "@/lib/ambient-store";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(ambientStore.scrollProgress > 0.22);
    update();
    return ambientStore.subscribe(update);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta fixed right-0 bottom-0 left-0 z-40 border-t border-hairline bg-ink/95 p-3 backdrop-blur-md md:hidden">
      <a href="#vault" className="btn-glow block w-full py-3.5 text-center" data-cursor="open">
        {site.cta} →
      </a>
    </div>
  );
}
