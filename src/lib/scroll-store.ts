type ProgressListener = (progress: number) => void;
type HeroListener = (heroLocal: number) => void;

const state = {
  progress: 0,
  heroLocal: 0,
  heroGlobalEnd: 0.41,
  ready3d: false,
  progressListeners: new Set<ProgressListener>(),
  heroListeners: new Set<HeroListener>(),
};

export const scrollStore = {
  get progress() {
    return state.progress;
  },
  get heroLocal() {
    return state.heroLocal;
  },
  get heroGlobalEnd() {
    return state.heroGlobalEnd;
  },
  get ready3d() {
    return state.ready3d;
  },
  setProgress(value: number) {
    const next = Math.min(1, Math.max(0, value));
    if (next === state.progress) return;
    state.progress = next;
    state.progressListeners.forEach((fn) => fn(next));
  },
  setHeroLocal(value: number) {
    const next = Math.min(1, Math.max(0, value));
    if (next === state.heroLocal) return;
    state.heroLocal = next;
    state.heroListeners.forEach((fn) => fn(next));
  },
  setHeroGlobalEnd(value: number) {
    state.heroGlobalEnd = Math.min(0.95, Math.max(0.15, value));
  },
  setReady3d(value: boolean) {
    state.ready3d = value;
  },
  subscribe(fn: ProgressListener) {
    state.progressListeners.add(fn);
    return () => {
      state.progressListeners.delete(fn);
    };
  },
  subscribeHero(fn: HeroListener) {
    state.heroListeners.add(fn);
    return () => {
      state.heroListeners.delete(fn);
    };
  },
};
