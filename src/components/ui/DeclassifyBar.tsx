"use client";

import { useState } from "react";

const btnClass =
  "font-mono text-[10px] tracking-[0.2em] text-bone/50 uppercase border border-hairline px-4 py-2 transition-colors hover:border-mutation hover:text-mutation cursor-pointer";

export function DeclassifyBar() {
  const [copied, setCopied] = useState(false);

  const declassify = () => {
    document.dispatchEvent(new CustomEvent("declassify-all"));
  };

  const copy = async () => {
    try {
      const text = document.querySelector("main")?.innerText ?? "";
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className="mb-8 flex flex-wrap justify-end gap-2 md:gap-3">
      <button type="button" onClick={declassify} className={btnClass}>
        [ Declassify all ]
      </button>
      <button type="button" onClick={copy} className={btnClass}>
        {copied ? "[ Copied ]" : "[ Copy brief ]"}
      </button>
    </div>
  );
}
