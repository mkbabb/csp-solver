// ACC-GRAPHITE pass-7 COPY of ACC-FIVE's pass-7 G10 (`e2e/front-rate.spec.ts` sha1 27172a6c463e, with its
// `rate-clock.ts` 145ec4913440): its observer, its frame clock and its shortest-gap clause, byte for byte.
// On this tree the join ring is the ONE poseFronts consumer (the fill tally is cut per FILL event, never
// per frame; DifficultyTally is HEAD's stroke-dashoffset), so GATED (default "join") names the rows that
// must re-cut and hold the budget and the shortest gap; the other consumers' records are PRINTED, and the
// difficulty tally's `.dt-stroke` is asserted to write NO `d` (pass 6's row). The page is pass 6's (an
// EASY deal, three hints, B joins A's room on `?wire=local`), so no tally interleave is asserted: there
// is no tally front on this tree to interleave.
// PRM: live, because the subject IS the tween: the front's re-cut only runs while a draw-in eases, and
// under reduced motion every consumer lands its fraction in one frame with nothing to count.
import { test, expect } from "@playwright/test";
import { clockFor, clockHz } from "./rate-clock";

/**
 * G10 — THE FRONT'S RATE BUDGET, COUNTED ON THE SURFACE (pass-4 critique §3.2, LAWS P4: count a
 * primitive's consumers and gate every call site in the SAME page).
 *
 * All three `poseFronts` consumers, one page A at no-preference (witnessed): the tally draws in
 * when the dealt board's grade lands, three hints move the fill gauge, and B joining A's room
 * rings A's board (`?wire=local`, the dev server's transport, one context). A MutationObserver on
 * `d` clusters records into re-cut FRAMES; each consumer's worst burst must hold
 * ≤ 1000 / FRONT_MIN_MS = 62.5 re-cuts per second.
 *
 * THE STATISTIC IS THE INTERVAL RATE, (frames − 1) / span: N commits are N − 1 gaps, and the
 * budget bounds the gaps. frames / span reads 64/s on a 60 Hz panel whose every frame clears the
 * gate, where no two cuts are closer than 16.7 ms.
 *
 * THE CLOCK IS THE ROW'S, NOT THE HOST'S (T9-W7 pass 6; pass-5 critique §3.1). A budget of
 * 62.5/s cannot be seen broken on a clock at or under 62.5 Hz: with FRONT_MIN_MS deleted this row
 * PASSED at 58–61/s under a 60 Hz rAF shim in both engines. So the page runs the chair's DRIVEN
 * 125 Hz animation clock (`rate-clock.ts`, one copy with pass6/instruments/), and the measured
 * in-page clock must reach 1.5 × the budget (93.75 Hz) BEFORE any rate is read — a slow clock reds
 * loudly instead of passing a broken tree. CLOCK=60 is the negative control (reds on the
 * precondition), CLOCK=native reads the host panel.
 *
 * THE INTERLEAVE IS WITNESSED (pass-5 critique §3.5). The tally's one-clock cure exists for
 * several strokes drawing at once; a board graded at one stroke draws 4 `d` a frame and never shows
 * it. The tally inks the DEALT board's measured grade, not the tier asked for (a HARD deal can grade
 * at one stroke, and did: 68 d over 17 frames, pass 6), and a shared `?board=` payload is never
 * graded at all (twelve bank templates read "level not graded yet" after 30 s), so no pinned board
 * can carry this row. The row deals HARD and re-deals, at most six times, until the tally inks
 * ≥ 3 strokes, then asserts ONE tally draw-in averaged MORE than 4 `d` records per re-cut frame:
 * it saw the stagger or it says so.
 *
 * THE SHORTEST GAP IS GATED TOO (pass-6 critique §3.1; chair A.6). A rate over a burst can pass
 * while single gaps break the budget: the forced end-write landed 5.9–9.5 ms after the last gated
 * commit, and WebKit's whole-millisecond clock let 14–15 ms gaps through a 16 ms gate. Every
 * burst prints its gaps' minimum, and every minimum must be ≥ 15.5 ms (the budget's 16 on a
 * clock read to the half millisecond). The gap is read between the FRAMES the re-cuts belong to
 * (the chair's "rAF timestamp", A.6), which is the clock `frontGate` times a tween's writes on:
 * the driven clock runs a frame's callbacks in one task, so a write's DOM time waits for the
 * rest of the frame's work, and that wait moved 0–8 ms frame to frame at load 35–50 (pass 7:
 * WebKit's DOM gaps read 13.0 and 15.0 ms in 2 of 6 runs). The DOM gaps print beside it, never
 * hidden. A write outside any frame (a timer's, a worker message's) is read at the DOM.
 *
 * BORN-REDs: `FRONT_MIN_MS` 16 → 0 in `gridPaths.ts` reds the rate on the driven clock in both
 * engines; the pass-6 compare (a forced end committed inside the window, a whole-ms reading of
 * 16 admitted) reds the shortest gap; CLOCK=60 reds the precondition; DEAL=EASY reds the
 * interleave witness. The pass-5 hole (the ablation passing under a 60 Hz clock with the
 * precondition off) is the critic's instrument, not a switch this file ships.
 */
const BUDGET_PER_S = 62.5;
const MIN_GAP_MS = 15.5;
const MIN_CLOCK_HZ = 1.5 * BUDGET_PER_S;
const CONSUMERS = { gauge: ".progress-trace", tally: ".dt-stroke", join: ".join-pose path" };
const GATED = (process.env.GATED ?? "join").split(",");

type Cuts = Record<string, { d: number; times: number[]; frames: number[]; n: number[]; lag: number[] }>;

const OBSERVE_CUTS = (selectors: Record<string, string>) => {
  const w = window as unknown as { __cuts: Cuts };
  w.__cuts = {};
  // ONE observer per consumer, so a commit's `d` writes arrive in ONE callback on ONE clock read:
  // one callback is one re-cut. (Pass 7: an observer PER ELEMENT read the clock once per element,
  // and on WebKit's whole-millisecond clock a commit whose callbacks straddled a millisecond
  // boundary split into two "frames" 1.0 ms apart — the instrument's clock, not the gate's.)
  //
  // TWO CLOCKS PER RE-CUT. `times` is when the `d` write reached the DOM (the observer's read).
  // `frames` is the animation frame the write belongs to: the timestamp of the rAF callback whose
  // task wrote it, or the DOM time for a write outside any frame (an end in a timer, a start in a
  // worker's message). The budget is "re-cuts per second at any refresh rate", and a re-cut paints
  // with its frame however late in that frame's task the render flushes it: the flush's lag
  // (`lag`, DOM − frame) moved 0–11 ms frame to frame at load 35–50 (pass 7) and is printed,
  // not gated. The gap clause reads `frames`; the DOM gaps print beside it.
  // A write belongs to a frame only if that frame's own task made it. Every timer task opens with
  // no frame (the driven clock's pump is a timer too, and sets its frame after); a frame's writes
  // close it once the observers have read them; and a frame that wrote nothing is closed by a
  // posted message, the next task its own task queues. (Pass 7: a zero-delay clear let an owed
  // end's timer, already due when the pump ended, run first and read as the pump's frame, a
  // 14.9 ms "frame" gap between writes 16.2 ms apart at the DOM; and a draw-in started from the
  // worker's message after a frame with no writes read as that frame, 5.0 ms against 16.0.)
  const raf = window.requestAnimationFrame.bind(window);
  const later = window.setTimeout.bind(window);
  let frameTs: number | null = null;
  window.setTimeout = ((fn: unknown, ms?: number, ...a: unknown[]) =>
    later(() => {
      frameTs = null;
      if (typeof fn === "function") fn(...a);
    }, ms)) as unknown as typeof window.setTimeout;
  const close = new MessageChannel();
  close.port1.onmessage = () => (frameTs = null);
  window.requestAnimationFrame = (cb) =>
    raf((ts) => {
      frameTs = ts;
      close.port2.postMessage(0);
      cb(ts);
    });
  const obs: Record<string, MutationObserver> = {};
  for (const k of Object.keys(selectors)) {
    w.__cuts[k] = { d: 0, times: [], frames: [], n: [], lag: [] };
    obs[k] = new MutationObserver((recs) => {
      const t = performance.now();
      const d = recs.filter((m) => m.attributeName === "d").length;
      if (!d) return;
      const r = w.__cuts[k];
      r.d += d;
      r.times.push(t);
      r.frames.push(frameTs ?? t);
      r.n.push(d);
      r.lag.push(frameTs == null ? NaN : t - frameTs); // NaN: a write outside any frame
      if (frameTs != null) queueMicrotask(() => (frameTs = null));
    });
  }
  const seen = new WeakSet<Element>();
  const attach = () => {
    for (const [k, sel] of Object.entries(selectors))
      document.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        obs[k].observe(el, { attributes: true, attributeFilter: ["d"] });
      });
  };
  // an init script runs before <body> exists; observing a null body throws and loses the hook
  const go = () => {
    attach();
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) go();
  else document.addEventListener("DOMContentLoaded", go, { once: true });
};

test(`G10 (${process.env.CLOCK ?? "driven"}): the join ring re-cuts at most 62.5 times a second, no gap under 15.5 ms`, async ({
  browser,
}, testInfo) => {
  test.setTimeout(180000);
  const clock = clockFor();
  const ctx = await browser.newContext({ reducedMotion: "no-preference" });
  await ctx.addInitScript(clock.script as (a?: number) => void, clock.arg);
  await ctx.addInitScript(OBSERVE_CUTS, CONSUMERS);
  const a = await ctx.newPage();
  await a.goto("/?wire=local&size=3&difficulty=EASY");
  await a.waitForSelector(".sudoku-cell", { timeout: 60000 });
  expect(await a.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(false);
  const t0 = await a.evaluate(() => performance.now());
  await expect
    .poll(() => a.evaluate(() => !!document.querySelector<HTMLButtonElement>('[aria-label*="Hint" i]:not([disabled])')), { timeout: 30000 })
    .toBe(true);
  for (let i = 0; i < 3; i++) {
    await a.evaluate(() => document.querySelector<HTMLButtonElement>('[aria-label*="Hint" i]:not([disabled])')?.click());
    await a.waitForTimeout(700);
  }
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  await a.waitForTimeout(1500);
  const b = await ctx.newPage();
  await b.goto(a.url());
  await b.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await expect.poll(() => a.evaluate(() => (window as any).__cuts.join.d), { timeout: 15000 }).toBeGreaterThan(0);
  await a.waitForTimeout(2000);

  const hz = await clockHz(a, t0);
  const cuts = await a.evaluate(() => (window as unknown as { __cuts: Cuts }).__cuts);
  const lines: string[] = [`clock ${clock.name}: measured ${hz.hz.toFixed(1)} Hz over ${hz.gaps} gaps (precondition ≥ ${MIN_CLOCK_HZ} Hz)`];
  const worsts: Record<string, number> = {};
  const minGaps: Record<string, number> = {};
  const bursts_: Record<string, number> = {};
  for (const k of Object.keys(CONSUMERS)) {
    const t = cuts[k].times;
    const bursts: number[][] = [];
    const burstFr: number[][] = [];
    t.forEach((x, i) => {
      const cur = bursts[bursts.length - 1];
      if (cur && x - cur[cur.length - 1] <= 300) {
        cur.push(x);
        burstFr[burstFr.length - 1].push(cuts[k].frames[i]);
      } else {
        bursts.push([x]);
        burstFr.push([cuts[k].frames[i]]);
      }
    });
    const rates = bursts.filter((q) => q.length > 2).map((q) => ((q.length - 1) / (q[q.length - 1] - q[0])) * 1000);
    worsts[k] = Math.max(0, ...rates);
    bursts_[k] = rates.length;
    const minOf = (q: number[]) => Math.min(...q.slice(1).map((x, i) => x - q[i]));
    const mins = burstFr.filter((q) => q.length > 1).map(minOf);
    const domMins = bursts.filter((q) => q.length > 1).map(minOf);
    minGaps[k] = Math.min(Infinity, ...mins);
    lines.push(`${k}: ${cuts[k].d} d records, ${t.length} frames, ${rates.length} bursts, worst ${worsts[k].toFixed(1)}/s, min gap by burst ${mins.map((v) => v.toFixed(1)).join("/")} ms (DOM ${domMins.map((v) => v.toFixed(1)).join("/")}), ${cuts[k].lag.filter((x) => Number.isNaN(x)).length} of ${t.length} outside a frame`);
  }
  for (const l of lines) console.log(`G10 ${testInfo.project.name} ${l}`);
  testInfo.annotations.push({ type: "G10", description: lines.join(" · ") });
  for (const k of GATED) expect(bursts_[k], `${k} (${CONSUMERS[k as keyof typeof CONSUMERS]}) never re-cut`).toBeGreaterThan(0);
  expect(hz.hz, `the animation clock ran at ${hz.hz.toFixed(1)} Hz; a rate row needs ≥ ${MIN_CLOCK_HZ} Hz to see its budget`).toBeGreaterThanOrEqual(MIN_CLOCK_HZ);
  for (const k of GATED) {
    expect(worsts[k], `${k} re-cuts ${worsts[k].toFixed(1)}/s against the budget`).toBeLessThanOrEqual(BUDGET_PER_S);
    expect(minGaps[k], `${k}'s shortest gap between re-cut frames ${minGaps[k].toFixed(1)} ms is inside the budget's window`).toBeGreaterThanOrEqual(MIN_GAP_MS);
  }
  expect(cuts.tally.d, "the difficulty tally's draw-in is a style write on this tree; a `d` record means a front came back").toBe(0);
  await ctx.close();
});
