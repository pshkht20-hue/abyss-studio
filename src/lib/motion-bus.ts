import { ambientStore } from "./ambient-store";

export type MotionTick = (dtMs: number, now: number) => void;

let rafId = 0;
let lastTs = 0;
let running = false;
const handlers = new Set<MotionTick>();

function frame(now: number) {
  rafId = requestAnimationFrame(frame);
  if (!running) return;

  const dt = lastTs > 0 ? now - lastTs : 16;
  lastTs = now;

  if (!ambientStore.visible) return;

  handlers.forEach((fn) => {
    fn(dt, now);
  });
}

function ensureLoop() {
  if (running || handlers.size === 0 || typeof window === "undefined") return;
  running = true;
  lastTs = 0;
  rafId = requestAnimationFrame(frame);
}

function stopLoop() {
  if (!running) return;
  running = false;
  cancelAnimationFrame(rafId);
  lastTs = 0;
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
