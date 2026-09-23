// PRM: live, because the subject IS the tween: the front's re-cut only runs while a draw-in eases, and
// under reduced motion every consumer lands its fraction in one frame with nothing to count.
import { test, expect } from "@playwright/test";

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
 * gate, where no two cuts are closer than 16.7 ms. BORN-RED: `FRONT_MIN_MS` 16 → 0 in
 * `gridPaths.ts` reds this row in both engines (a 100–135 Hz headless panel re-cuts every frame).
 */
const BUDGET_PER_S = 62.5;
const CONSUMERS = { gauge: ".progress-trace", tally: ".dt-stroke", join: ".join-pose path" };


/** CRITIC: a 60 Hz panel, emulated in JS: rAF callbacks fire on the first native frame at or after
 *  each 16.667 ms due time (phase accumulator), so the page's animation clock ticks at 60 Hz. */
const SIXTY_HZ = () => {
  const nat = window.requestAnimationFrame.bind(window);
  let pending = new Map<number, FrameRequestCallback>();
  let id = 1, due = -1, scheduled = false;
  (window as any).__ticks = [] as number[];
  const pump = (ts: number) => {
    scheduled = false;
    if (due < 0) due = ts;
    if (ts + 0.5 < due) { scheduled = true; nat(pump); return; }
    due = Math.max(due + 1000 / 60, ts);
    (window as any).__ticks.push(ts);
    const cbs = pending; pending = new Map();
    for (const cb of cbs.values()) cb(ts);
  };
  window.requestAnimationFrame = (cb) => { const i = id++; pending.set(i, cb); if (!scheduled) { scheduled = true; nat(pump); } return i; };
  window.cancelAnimationFrame = (i) => { pending.delete(i); };
};

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
  // an init script runs before <body> exists; observing a null body throws and loses the hook
  const go = () => {
    attach();
    new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
  };
  if (document.body) go();
  else document.addEventListener("DOMContentLoaded", go, { once: true });
};

test("G10 at 60 Hz: every poseFronts consumer re-cuts at most 62.5 times a second", async ({
  browser,
}, testInfo) => {
  const ctx = await browser.newContext({ reducedMotion: "no-preference" });
  await ctx.addInitScript(SIXTY_HZ);
  await ctx.addInitScript(OBSERVE_CUTS, CONSUMERS);
  const a = await ctx.newPage();
  await a.goto("/?wire=local&size=3&difficulty=EASY");
  await a.waitForSelector(".sudoku-cell", { timeout: 60000 });
  expect(await a.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    false,
  );
  // the product's own HINT, pressed the way `fillByHint` presses it (the first match in the DOM
  // is the live control; a locator's `.first()` can resolve a hidden twin)
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
  await a.waitForTimeout(1500); // the join policy's boot suppression (join-language.spec.ts)
  const b = await ctx.newPage();
  await b.goto(a.url());
  await b.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await expect.poll(() => a.evaluate(() => (window as any).__cuts.join.d), { timeout: 15000 })
    .toBeGreaterThan(0);
  await a.waitForTimeout(2000);

  const cuts = await a.evaluate(() => (window as any).__cuts as Record<string, { d: number; times: number[] }>);
  const rings = await a.evaluate(() => document.querySelectorAll(".progress-trace").length);
  const grids = await a.evaluate(() => document.querySelectorAll("svg.hand-drawn-grid").length);
  const lines: string[] = [`.progress-trace nodes ${rings} in ${grids} svg.hand-drawn-grid`];
  const ticks = await a.evaluate(() => (window as any).__ticks as number[]);
  const gaps = ticks.slice(1).map((x, i) => x - ticks[i]).filter((g) => g < 100).sort((x, y) => x - y); console.log(`CRITIC rAF clock: median tick ${gaps[gaps.length >> 1]?.toFixed(2)} ms, p10 ${gaps[Math.floor(gaps.length * 0.1)]?.toFixed(2)} ms over ${gaps.length} gaps`);
  for (const k of Object.keys(CONSUMERS)) {
    const t = cuts[k].times;
    // bursts: one event's frames (a gap > 300 ms starts the next event)
    const bursts: number[][] = [];
    for (const x of t) {
      const cur = bursts[bursts.length - 1];
      if (cur && x - cur[cur.length - 1] <= 300) cur.push(x);
      else bursts.push([x]);
    }
    const rates = bursts
      .filter((q) => q.length > 2)
      .map((q) => ((q.length - 1) / (q[q.length - 1] - q[0])) * 1000);
    const worst = Math.max(0, ...rates);
    lines.push(`${k}: ${cuts[k].d} d records, ${t.length} frames, ${rates.length} bursts, worst ${worst.toFixed(1)}/s`);
    console.log("CRITIC " + lines[lines.length - 1]);
    // the row must SEE the consumer re-cut, or it measures nothing
    expect(rates.length, `${k} (${CONSUMERS[k as keyof typeof CONSUMERS]}) never re-cut`).toBeGreaterThan(0);
    expect(worst, `${k} re-cuts ${worst.toFixed(1)}/s against the budget`).toBeLessThanOrEqual(
      BUDGET_PER_S,
    );
  }
  
  await ctx.close();
});
