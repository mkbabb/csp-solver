// ACC-GRAPHITE pass-6 COPY of the chair's ONE copy (pass6/instruments/front-rate-60hz.spec.ts): on this
// tree the join ring is the ONE poseFronts consumer (the fill tally is re-cut per FILL event, never
// per frame; DifficultyTally is back on stroke-dashoffset), so GATED (default "join") names the rows
// that must re-cut and hold the budget; every other consumer's d records are PRINTED, and the tally's
// `.dt-stroke` is asserted to re-cut NEVER (its draw-in is a style write). Nothing else changed.
// PRM: live, because the subject IS the tween: the front's re-cut only runs while a draw-in eases.
/**
 * G10 UNDER A NAMED CLOCK — the ONE copy (T9-W7 pass 6, the chair's instruments lane). ACC-FIVE's
 * landed G10 (`e2e/front-rate.spec.ts`) with two changes and nothing re-worded:
 *   1. the page's animation clock is CHOSEN (`rate-clock.ts`, CLOCK=60|driven|native, default
 *      driven 125 Hz), so the born-RED (FRONT_MIN_MS 16 → 0) reds on any host;
 *   2. a PRECONDITION: the measured in-page clock over the row's window must be ≥ 93.75 Hz
 *      (1.5 × the 62.5/s budget) or the row REDS LOUDLY — under the 60 Hz shim it reds on every
 *      tree, which is the shim run's job as the negative control in the same batch.
 * PRECOND=0 turns the precondition off: that arm reproduces the critic's finding (the ablated tree
 * GREEN at 60 Hz) and is reported, never shipped.
 *
 * The statistic, the consumers, the burst clustering and the budget are the landed row's.
 */
import { test, expect } from "@playwright/test";
import { clockFor, clockHz } from "./rate-clock";

const BUDGET_PER_S = 62.5;
const MIN_CLOCK_HZ = 1.5 * BUDGET_PER_S;
const CONSUMERS = { gauge: ".progress-trace", tally: ".dt-stroke", join: ".join-pose path" };
const PRECOND = process.env.PRECOND !== "0";
const GATED = (process.env.GATED ?? "join").split(",");

const OBSERVE_CUTS = (selectors: Record<string, string>) => {
  const w = window as unknown as { __cuts: Record<string, { d: number; times: number[] }> };
  w.__cuts = {};
  for (const k of Object.keys(selectors)) w.__cuts[k] = { d: 0, times: [] };
  const seen = new WeakSet<Element>();
  const attach = () => {
    for (const [k, sel] of Object.entries(selectors))
      document.querySelectorAll(sel).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        new MutationObserver((recs) => {
          const t = performance.now();
          const r = w.__cuts[k];
          for (const m of recs) {
            if (m.attributeName !== "d") continue;
            r.d++;
            const last = r.times[r.times.length - 1];
            if (last === undefined || t - last > 0.5) r.times.push(t);
          }
        }).observe(el, { attributes: true, attributeFilter: ["d"] });
      });
  };
  const go = () => {
    attach();
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) go();
  else document.addEventListener("DOMContentLoaded", go, { once: true });
};

test(`G10 under a named clock (${process.env.CLOCK ?? "driven"}): every poseFronts consumer re-cuts at most 62.5 times a second`, async ({
  browser,
}, testInfo) => {
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
  const cuts = await a.evaluate(() => (window as any).__cuts as Record<string, { d: number; times: number[] }>);
  const lines: string[] = [`clock ${clock.name}: measured ${hz.hz.toFixed(1)} Hz over ${hz.gaps} gaps (precondition ≥ ${MIN_CLOCK_HZ} Hz${PRECOND ? "" : ", OFF"})`];
  console.log(`G10 ${testInfo.project.name} ${lines[0]}`);
  const worsts: Record<string, number> = {};
  for (const k of Object.keys(CONSUMERS)) {
    const t = cuts[k].times;
    const bursts: number[][] = [];
    for (const x of t) {
      const cur = bursts[bursts.length - 1];
      if (cur && x - cur[cur.length - 1] <= 300) cur.push(x);
      else bursts.push([x]);
    }
    const rates = bursts.filter((q) => q.length > 2).map((q) => ((q.length - 1) / (q[q.length - 1] - q[0])) * 1000);
    worsts[k] = Math.max(0, ...rates);
    lines.push(`${k}: ${cuts[k].d} d records, ${t.length} frames, ${rates.length} bursts, worst ${worsts[k].toFixed(1)}/s`);
    console.log(`G10 ${testInfo.project.name} ${lines[lines.length - 1]}`);
    if (GATED.includes(k)) expect(rates.length, `${k} (${CONSUMERS[k as keyof typeof CONSUMERS]}) never re-cut`).toBeGreaterThan(0);
  }
  testInfo.annotations.push({ type: "G10", description: lines.join(" · ") });
  // the clock first: a row whose clock cannot exceed its budget cannot see the budget broken
  if (PRECOND)
    expect(hz.hz, `the animation clock ran at ${hz.hz.toFixed(1)} Hz — a rate row needs ≥ ${MIN_CLOCK_HZ} Hz to see its budget`).toBeGreaterThanOrEqual(MIN_CLOCK_HZ);
  for (const k of GATED)
    expect(worsts[k], `${k} re-cuts ${worsts[k].toFixed(1)}/s against the budget`).toBeLessThanOrEqual(BUDGET_PER_S);
  expect(cuts.tally.d, "the difficulty tally's draw-in is a style write on this tree; a `d` record means a front came back").toBe(0);
  await ctx.close();
});
