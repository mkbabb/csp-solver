// CRITIC COPY of the tree's e2e/front-rate.spec.ts (ACC-FIVE's sha f358ed02) + one min-gap print line; assertions untouched.
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
 * BORN-REDs: `FRONT_MIN_MS` 16 → 0 in `gridPaths.ts` reds the rate on the driven clock in both
 * engines; CLOCK=60 reds the precondition; DEAL=EASY reds the interleave witness.
 */
const BUDGET_PER_S = 62.5;
const MIN_CLOCK_HZ = 1.5 * BUDGET_PER_S;
const CONSUMERS = { gauge: ".progress-trace", tally: ".dt-stroke", join: ".join-pose path" };
const DEAL = process.env.DEAL ?? "HARD";
const PRECOND = process.env.PRECOND !== "0";

type Cuts = Record<string, { d: number; times: number[]; n: number[] }>;

const OBSERVE_CUTS = (selectors: Record<string, string>) => {
  const w = window as unknown as { __cuts: Cuts };
  w.__cuts = {};
  for (const k of Object.keys(selectors)) w.__cuts[k] = { d: 0, times: [], n: [] };
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
            if (last === undefined || t - last > 0.5) {
              r.times.push(t);
              r.n.push(0);
            }
            r.n[r.n.length - 1]++;
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

test("G10: every poseFronts consumer re-cuts at most 62.5 times a second", async ({
  browser,
}, testInfo) => {
  test.setTimeout(120000);
  const clock = clockFor();
  const ctx = await browser.newContext({ reducedMotion: "no-preference" });
  await ctx.addInitScript(clock.script as (a?: number) => void, clock.arg);
  await ctx.addInitScript(OBSERVE_CUTS, CONSUMERS);
  const a = await ctx.newPage();
  await a.goto(`/?wire=local&size=3&difficulty=${DEAL}`);
  await a.waitForSelector(".sudoku-cell", { timeout: 60000 });
  expect(await a.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    false,
  );
  const t0 = await a.evaluate(() => performance.now());
  // the tally's grade lands off the solver worker; re-deal until it inks ≥ 3 strokes (one pose's)
  const INKED = () => {
    const t = document.querySelector(".difficulty-tally");
    if (!t || t.classList.contains("is-ungraded")) return -1;
    return document.querySelector(".dt-pose")?.querySelectorAll(".dt-stroke.inked").length ?? 0;
  };
  let inked: number;
  let deals = 1;
  for (;;) {
    await expect.poll(() => a.evaluate(INKED), { timeout: 30000 }).toBeGreaterThanOrEqual(0);
    inked = await a.evaluate(INKED);
    if (inked >= 3 || deals >= 6) break;
    await a.locator('.controls-card button[aria-label="Deal a new board"]').click();
    await a.waitForSelector(".difficulty-tally.is-ungraded", { timeout: 5000 }).catch(() => {});
    deals++;
  }
  await a.waitForTimeout(1500); // the last draw-in ends before the hints move the gauge
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

  const hz = await clockHz(a, t0);
  const cuts = await a.evaluate(() => (window as unknown as { __cuts: Cuts }).__cuts);
  const rings = await a.evaluate(() => document.querySelectorAll(".progress-trace").length);
  const lines: string[] = [
    `clock ${clock.name}: measured ${hz.hz.toFixed(1)} Hz over ${hz.gaps} gaps (precondition ≥ ${MIN_CLOCK_HZ} Hz${PRECOND ? "" : ", OFF"}) · deal ${DEAL} ×${deals}, tally inked ${inked} · .progress-trace nodes ${rings}`,
  ];
  const worsts: Record<string, number> = {};
  const bursts_: Record<string, number> = {};
  let tallyBestDPerFrame = 0;
  for (const k of Object.keys(CONSUMERS)) {
    const t = cuts[k].times;
    // bursts: one event's frames (a gap > 300 ms starts the next event)
    const bursts: number[][] = [];
    const burstD: number[] = [];
    t.forEach((x, i) => {
      const cur = bursts[bursts.length - 1];
      if (cur && x - cur[cur.length - 1] <= 300) {
        cur.push(x);
        burstD[burstD.length - 1] += cuts[k].n[i];
      } else {
        bursts.push([x]);
        burstD.push(cuts[k].n[i]);
      }
    });
    const dPerFrame = bursts.map((q, i) => burstD[i] / q.length);
    if (k === "tally") tallyBestDPerFrame = Math.max(0, ...dPerFrame);
    const rates = bursts
      .filter((q) => q.length > 2)
      .map((q) => ((q.length - 1) / (q[q.length - 1] - q[0])) * 1000);
    worsts[k] = Math.max(0, ...rates);
    bursts_[k] = rates.length;
    lines.push(`${k}: ${cuts[k].d} d records, ${t.length} frames (${(cuts[k].d / Math.max(1, t.length)).toFixed(2)} d/frame; by burst ${dPerFrame.map((v) => v.toFixed(2)).join("/")}), ${rates.length} bursts, worst ${worsts[k].toFixed(1)}/s`);
  }
  // CRITIC ADD (pass6/critique/ACC-SIX): chair A.6 asks the MINIMUM gap between re-cut frames inside a burst (>= 15.5 ms)
  for (const k of Object.keys(CONSUMERS)) { const t = cuts[k].times; const g = t.slice(1).map((x, i) => x - t[i]).filter((d) => d <= 300); lines.push(`${k} gaps: min ${g.length ? Math.min(...g).toFixed(2) : "-"} ms, under 15.5: ${g.filter((d) => d < 15.5).length}/${g.length}`); }
  // every consumer's reading is printed BEFORE any assertion, so a red names all three
  for (const l of lines) console.log(`G10 ${testInfo.project.name} ${l}`);
  testInfo.annotations.push({ type: "G10", description: lines.join(" · ") });
  // the row must SEE every consumer re-cut, or it measures nothing
  for (const k of Object.keys(CONSUMERS))
    expect(bursts_[k], `${k} (${CONSUMERS[k as keyof typeof CONSUMERS]}) never re-cut`).toBeGreaterThan(0);
  // the clock first: a row whose clock cannot exceed its budget cannot see the budget broken
  if (PRECOND)
    expect(hz.hz, `the animation clock ran at ${hz.hz.toFixed(1)} Hz; a rate row needs ≥ ${MIN_CLOCK_HZ} Hz to see its budget`).toBeGreaterThanOrEqual(MIN_CLOCK_HZ);
  // the interleave second: one tally draw-in must have drawn several strokes in the same frames
  expect(tallyBestDPerFrame, `the tally never drew two strokes at once (best draw-in ${tallyBestDPerFrame.toFixed(2)} d/frame ≤ 4; inked ${inked} after ${deals} deals)`).toBeGreaterThan(4);
  for (const k of Object.keys(CONSUMERS))
    expect(worsts[k], `${k} re-cuts ${worsts[k].toFixed(1)}/s against the budget`).toBeLessThanOrEqual(BUDGET_PER_S);
  await ctx.close();
});
