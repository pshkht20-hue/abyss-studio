"use client";

import { useEffect, useState } from "react";
import { scrollStore } from "@/lib/scroll-store";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(scrollStore.progress);
    return scrollStore.subscribe(setProgress);
  }, []);

  return progress;
}
