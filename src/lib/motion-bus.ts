import { ambientStore } from "./ambient-store";
import { getMotionBusFps } from "./motion-tier";

export type MotionTick = (dtMs: number, now: number) => void;

let rafId = 0;
let lastTs = 0;
let lastTickTs = 0;
let running = false;
const handlers = new Set<MotionTick>();

function minFrameInterval() {
  return 1000 / getMotionBusFps();
}

function frame(now: number) {
  rafId = requestAnimationFrame(frame);
  if (!running) return;

  const interval = minFrameInterval();
  if (lastTickTs > 0 && now - lastTickTs < interval - 1.5) return;

  const dt = lastTs > 0 ? now - lastTs : interval;
  lastTs = now;
  lastTickTs = now;

  if (!ambientStore.visible) return;

  handlers.forEach((fn) => {
    fn(dt, now);
  });
}

function ensureLoop() {
  if (running || handlers.size === 0 || typeof window === "undefined") return;
  running = true;
  lastTs = 0;
  lastTickTs = 0;
  rafId = requestAnimationFrame(frame);
}

function stopLoop() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(rafId);
  lastTs = 0;
  lastTickTs = 0;
}

export const motionBus = {
  subscribe(fn: MotionTick) {
    handlers.add(fn);
    ensureLoop();
    return () => {
      handlers.delete(fn);
      if (handlers.size === 0) stopLoop();
    };
  },
  get size() {
    return handlers.size;
  },
};
