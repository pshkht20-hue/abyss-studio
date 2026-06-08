"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      theme="dark"
      toastOptions={{
        className: "font-mono text-[10px] tracking-[0.14em] uppercase",
        style: {
          background: "var(--color-ink-2)",
          border: "1px solid var(--color-hairline)",
          color: "var(--color-bone)",
        },
      }}
    />
  );
}
