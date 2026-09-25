/**
 * RATE CLOCKS — the ONE copy every rate or budget row ships beside (T9-W7 pass 6, the chair's
 * instruments lane; registry-v5 §2.3; LAWS P5 "A rate or budget gate proves its ablation reds
 * under a 60 Hz rAF shim or drives its own clock ≥120 Hz"). From ACC-FIVE's pass-5 critic
 * (`critique/ACC-FIVE/instruments/front-rate-60hz.CRITIC.spec.ts`): with the budget deleted
 * (FRONT_MIN_MS 16 → 0) G10 PASSED at 60.2/60.4/60.0 (chromium) and 58.0/61.4/58.4 (webkit) per
 * second under a 60 Hz clock — a gate whose verdict was the host's display.
 *
 * Three init scripts (pass to `context.addInitScript`), each self-contained:
 *   SIXTY_HZ      the critic's shim verbatim: rAF callbacks fire on the first native frame at or
 *                 after each 16.667 ms due time — the NEGATIVE CONTROL clock.
 *   DRIVEN_CLOCK  a JS animation clock at `hz` (default 125): rAF callbacks are dispatched from a
 *                 setTimeout pump with `performance.now()` timestamps, so a budget ablation reds
 *                 on ANY host, including a 60 Hz panel and the runner's raster.
 *   TICK_RECORDER records native rAF timestamps (no change to the clock), for the precondition.
 * All three leave `window.__ticks` (ms timestamps of animation-clock ticks).
 *
 * `clockPrecondition(page)` reads `__ticks` over the window the row measured and returns the
 * median rate; every rate row asserts it ≥ 1.5 × its budget (93.75 Hz for 62.5/s) BEFORE it
 * reads its own numbers, so a slow clock REDS LOUDLY instead of passing a broken tree.
 *
 * PRODUCT COPY (e2e/, ACC-FIVE pass 6): the chair's pass6/instruments/rate-clock.ts but for three
 * `export` keywords. The three clocks are reached only through `clockFor`, and knip reds an export
 * nothing imports.
 */
import type { Page } from "@playwright/test";

const SIXTY_HZ = () => {
  const nat = window.requestAnimationFrame.bind(window);
  let pending = new Map<number, FrameRequestCallback>();
  let id = 1,
    due = -1,
    scheduled = false;
  (window as unknown as { __ticks: number[] }).__ticks = [];
  const pump = (ts: number) => {
    scheduled = false;
    if (due < 0) due = ts;
    if (ts + 0.5 < due) {
      scheduled = true;
      nat(pump);
      return;
    }
    due = Math.max(due + 1000 / 60, ts);
    (window as unknown as { __ticks: number[] }).__ticks.push(ts);
    const cbs = pending;
    pending = new Map();
    for (const cb of cbs.values()) cb(ts);
  };
  window.requestAnimationFrame = (cb) => {
    const i = id++;
    pending.set(i, cb);
    if (!scheduled) {
      scheduled = true;
      nat(pump);
    }
    return i;
  };
  window.cancelAnimationFrame = (i) => {
    pending.delete(i);
  };
};

const DRIVEN_CLOCK = (hz: number = 125) => {
  const period = 1000 / hz;
  let pending = new Map<number, FrameRequestCallback>();
  let id = 1,
    timer: ReturnType<typeof setTimeout> | null = null,
    next = 0;
  (window as unknown as { __ticks: number[] }).__ticks = [];
  const pump = () => {
    timer = null;
    const ts = performance.now();
    (window as unknown as { __ticks: number[] }).__ticks.push(ts);
    const cbs = pending;
    pending = new Map();
    for (const cb of cbs.values()) cb(ts);
    if (pending.size) arm();
  };
  const arm = () => {
    if (timer != null) return;
    const now = performance.now();
    next = Math.max(next + period, now);
    timer = setTimeout(pump, Math.max(0, next - now));
  };
  window.requestAnimationFrame = (cb) => {
    const i = id++;
    pending.set(i, cb);
    arm();
    return i;
  };
  window.cancelAnimationFrame = (i) => {
    pending.delete(i);
  };
};

const TICK_RECORDER = () => {
  const nat = window.requestAnimationFrame.bind(window);
  const w = window as unknown as { __ticks: number[] };
  w.__ticks = [];
  const tick = (ts: number) => {
    w.__ticks.push(ts);
    nat(tick);
  };
  nat(tick);
};

/** The median animation-clock rate (Hz) over ticks at or after `since` (performance.now()). */
export async function clockHz(page: Page, since = 0): Promise<{ hz: number; gaps: number }> {
  return page.evaluate((since) => {
    const t = ((window as unknown as { __ticks?: number[] }).__ticks ?? []).filter((x) => x >= since);
    const g = t
      .slice(1)
      .map((x, i) => x - t[i])
      .filter((d) => d < 100)
      .sort((a, b) => a - b);
    const med = g.length ? g[g.length >> 1] : Infinity;
    return { hz: 1000 / med, gaps: g.length };
  }, since);
}

/** The init script a row runs under, keyed by CLOCK=60|driven|native (default driven). */
export function clockFor(env = process.env.CLOCK ?? "driven"): {
  name: string;
  script: (() => void) | ((hz: number) => void);
  arg?: number;
} {
  if (env === "60") return { name: "60 Hz shim (negative control)", script: SIXTY_HZ };
  if (env === "native") return { name: "native (recorded)", script: TICK_RECORDER };
  return { name: "driven 125 Hz", script: DRIVEN_CLOCK, arg: 125 };
}
