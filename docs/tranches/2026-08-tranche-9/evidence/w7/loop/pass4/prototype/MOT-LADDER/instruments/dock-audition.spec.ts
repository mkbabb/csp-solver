import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });

const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";

/**
 * THE SIX LENGTH ROUNDS, ON ONE BUILD (chair §1.3: "AUDITIONS the six length rounds with
 * frames"). Pass 3 compared exactly two clocks, each its own dist and its own server, and
 * then scored them with two statistics that fall monotonically as the clock rises — so the
 * comparison could not choose (critique §2.3) and a six-round audition would have cost six
 * builds ("and then the hard part").
 *
 * The substitution is at the INSTRUMENT, not in the product: `Element.prototype.animate` is
 * wrapped and rewrites the duration ONLY for `useFlipGlide`'s exact signature — the shipped
 * `rise` (520ms), `composite: "replace"`, `fill: "none"`. Everything else about the gesture
 * is the shipped one: the same movers, the same glass curve, the same one clock, the same
 * layout. The clock is the variable under audition and it is the only thing that moves.
 *
 * The statistic is a RATE (px/s), not px-per-sample: a 120Hz panel halves the step and
 * doubles the count, so a per-sample figure reads the panel (LAWS §Gates).
 *
 * The guard: `useFlipGlide` arms its never-never backstop at the SHIPPED duration + 220ms,
 * so a substituted clock above 740ms would be cut by the guard rather than by its own
 * finish. 700 is the longest round audited for that reason, and it is stated, not hidden.
 */
const CLOCKS = [440, 480, 520, 560, 600, 700];
const SHIPPED = 520;
const CEILING_PX_PER_SEC = 2400;

type Pose = { name: string; w: number; h: number; theme: "light" | "dark" };
const POSES: Pose[] = [
  { name: "768x1024", w: 768, h: 1024, theme: "light" },
  { name: "390x844", w: 390, h: 844, theme: "light" },
  { name: "390x844-dark", w: 390, h: 844, theme: "dark" },
  { name: "844x390", w: 844, h: 390, theme: "light" },
];

test("dock · the six length rounds, one build, both engines", async ({
  browser,
  browserName,
}) => {
  test.setTimeout(900000);
  const rows: Array<Record<string, unknown>> = [];
  for (const pose of POSES) {
    for (const clock of CLOCKS) {
      const ctx = await browser.newContext({
        viewport: { width: pose.w, height: pose.h },
        hasTouch: true,
      });
      const page = await ctx.newPage();
      await page.addInitScript(
        ([shipped, want]) => {
          const orig = Element.prototype.animate;
          Element.prototype.animate = function (frames: unknown, opts: unknown) {
            const o = opts as Record<string, unknown> | undefined;
            if (
              o &&
              o.duration === shipped &&
              o.composite === "replace" &&
              o.fill === "none"
            )
              return orig.call(this, frames as never, { ...o, duration: want } as never);
            return orig.call(this, frames as never, opts as never);
          } as typeof Element.prototype.animate;
        },
        [SHIPPED, clock] as [number, number],
      );
      await page.goto(AFTER + PINNED_URL);
      await page.waitForLoadState("networkidle");
      if (pose.theme === "dark")
        await page.evaluate(() => document.documentElement.classList.add("dark"));
      await page.waitForTimeout(500);
      const witness = await page.evaluate(() => ({
        coarse: matchMedia("(pointer: coarse)").matches,
        dock: matchMedia("(max-width: 1023.98px)").matches,
      }));
      const tab = page.locator(".drawer-tab").first();
      if ((await tab.count()) === 0) {
        rows.push({ pose: pose.name, clock, browserName, skipped: "no .drawer-tab" });
        await ctx.close();
        continue;
      }
      await page.evaluate(() => {
        (window as unknown as Record<string, unknown>).__s = [];
        const el = document.querySelector("#controls-drawer") ?? document.querySelector(".drawer-case");
        if (!el) return;
        const t0 = performance.now();
        const tick = () => {
          const r = (el as Element).getBoundingClientRect();
          (window as unknown as Record<string, unknown[]>).__s.push({
            t: performance.now() - t0,
            top: r.top,
          });
          if (performance.now() - t0 < 1600) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await tab.click({ force: true }).catch(() => {});
      await page.waitForTimeout(1700);
      const series: Array<{ t: number; top: number }> = await page.evaluate(
        () => (window as unknown as Record<string, unknown>).__s as never,
      );
      const tops = series.map((s) => s.top);
      const travel = tops.length ? Math.max(...tops) - Math.min(...tops) : 0;
      // RESAMPLED ONTO A 60Hz REFERENCE GRID before any rate is taken. A raw rAF pair can be
      // a tenth of a millisecond apart, and dividing a sub-pixel step by it reads 137,000px/s
      // — the statistic measuring the sampler, not the sheet (this probe's own first run).
      // Linear interpolation onto 16.667ms steps makes the reading panel-independent, which
      // is what the rate law asks for, and makes the worst step and the rate the same fact.
      const GRID = 1000 / 60;
      const at = (t: number) => {
        if (!series.length) return 0;
        if (t <= series[0].t) return series[0].top;
        for (let i = 1; i < series.length; i++)
          if (series[i].t >= t) {
            const a = series[i - 1], b = series[i];
            const f = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
            return a.top + (b.top - a.top) * f;
          }
        return series[series.length - 1].top;
      };
      const end = series.length ? series[series.length - 1].t : 0;
      const grid: number[] = [];
      for (let t = 0; t <= end; t += GRID) grid.push(at(t));
      let worstRate = 0;
      let worstStep = 0;
      let excess = 0;
      for (let i = 1; i < grid.length; i++) {
        const dp = Math.abs(grid[i] - grid[i - 1]);
        const rate = (dp / GRID) * 1000;
        if (rate > worstRate) worstRate = rate;
        if (dp > worstStep) worstStep = dp;
        excess += Math.max(0, dp - 40);
      }
      // the settle, read on the TARGET's ancestor path and never document-wide (LAWS)
      await page.waitForTimeout(800);
      const settle = await page.evaluate(() => {
        const el = document.querySelector("#controls-drawer") ?? document.querySelector(".drawer-case");
        if (!el) return null;
        const chain: Element[] = [];
        for (let n: Element | null = el; n; n = n.parentElement) chain.push(n);
        const running = chain
          .flatMap((n) => n.getAnimations({ subtree: true }))
          .filter((a) => a.playState === "running").length;
        const r = el.getBoundingClientRect();
        return {
          running,
          rect: { top: +r.top.toFixed(2), left: +r.left.toFixed(2), h: +r.height.toFixed(2) },
        };
      });
      rows.push({
        pose: pose.name,
        clock,
        browserName,
        witness,
        samples: series.length,
        gridSteps: grid.length,
        travelPx: +travel.toFixed(2),
        worstRatePxPerSec: +worstRate.toFixed(1),
        worstStepPx: +worstStep.toFixed(2),
        excessAreaPx: +excess.toFixed(2),
        clearsCeiling: worstRate <= CEILING_PX_PER_SEC,
        settle,
      });
      console.log(
        `dock ${browserName} ${pose.name} @${clock}ms: travel ${travel.toFixed(1)}px · worstRate ${worstRate.toFixed(0)}px/s · worstStep ${worstStep.toFixed(1)}px · excess ${excess.toFixed(1)} · settle ${JSON.stringify(settle?.running)}`,
      );
      await ctx.close();
    }
  }
  writeFileSync(
    `${OUT}/dock-audition-${browserName}.json`,
    JSON.stringify({ ceilingPxPerSec: CEILING_PX_PER_SEC, shipped: SHIPPED, rows }, null, 1) + "\n",
  );
});
