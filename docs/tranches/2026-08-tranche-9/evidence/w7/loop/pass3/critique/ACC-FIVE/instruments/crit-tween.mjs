#!/usr/bin/env node
/** ACC-FIVE pass-3 CRITIC probe — the arm the prototype never ran.
 *
 *  Every pass-3 prototype context was `reducedMotion: "reduce"` (grep: p3-win/p3-paint/
 *  p3-final/p3-crops/p3-g0 all set it), and HandDrawnGrid's watcher RETURNS EARLY under PRM.
 *  So the fill TWEEN — the family's one new mechanism — has no browser execution at all.
 *  This runs it at `no-preference`, counts the `d` re-cuts, times the frames, and also reads
 *  the `prefers-contrast: more` arm at rest AND at the win (the spec's booked hedge).
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4242";
const OUT = process.argv[2];

const out = { meta: { base: BASE, tree: "wf_f72f3b5a-83a-41 @ 74a2b5d9 + ACC-FIVE pass-3 diff" }, cells: {} };

for (const [eng, launcher] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await launcher.launch();
  for (const motion of ["no-preference", "reduce"]) {
    const cell = `${eng}/${motion}`;
    const R = (out.cells[cell] = {});
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: motion === "reduce" ? "reduce" : "no-preference",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1500);

    // arm the observers
    await page.evaluate(() => {
      window.__recuts = [];
      window.__frames = [];
      window.__t0 = performance.now();
      const svg = document.querySelector("svg.hand-drawn-grid");
      const mo = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.target.classList && m.target.classList.contains("progress-trace"))
            window.__recuts.push({ t: performance.now(), len: m.target.getAttribute("d")?.length ?? 0 });
        }
      });
      mo.observe(svg, { attributes: true, attributeFilter: ["d"], subtree: true });
      window.__mo = mo;
      let last = performance.now();
      const tick = () => { const n = performance.now(); window.__frames.push(+(n - last).toFixed(2)); last = n; window.__raf = requestAnimationFrame(tick); };
      window.__raf = requestAnimationFrame(tick);
    });

    // CONTROL window: 600ms of idle frames, no write
    await page.waitForTimeout(700);
    R.controlFrames = await page.evaluate(() => { const f = window.__frames.slice(); window.__frames.length = 0; return f; });

    // THE WRITE: one digit into the first empty cell
    R.before = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      return {
        traceNodes: document.querySelectorAll(".progress-trace").length,
        valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
        dLen: t?.getAttribute("d")?.length ?? 0,
        transition: t ? getComputedStyle(t).transition : null,
        strokeOpacity: t ? getComputedStyle(t).strokeOpacity : null,
        stroke: t ? getComputedStyle(t).stroke : null,
        strokeWidth: t ? getComputedStyle(t).strokeWidth : null,
      };
    });
    await page.evaluate(() => {
      window.__recuts.length = 0; window.__frames.length = 0; window.__writeT = performance.now();
      const ins = Array.from(document.querySelectorAll(".sudoku-cell input"));
      const i = ins.findIndex((el) => !el.readOnly && !el.value);
      window.__typedIdx = i; if (i >= 0) ins[i].focus();
    });
    await page.keyboard.type("1");
    await page.waitForTimeout(900);
    R.write = await page.evaluate(() => {
      const rc = window.__recuts;
      const t = document.querySelector(".progress-trace");
      const spanMs = rc.length ? +(rc[rc.length - 1].t - rc[0].t).toFixed(1) : 0;
      const distinctT = new Set(rc.map((r) => Math.round(r.t * 10) / 10)).size;
      return {
        typedIdx: window.__typedIdx,
        valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
        recutMutations: rc.length,
        recutFramesApprox: distinctT,
        tweenSpanMs: spanMs,
        dLenFirst: rc.length ? rc[0].len : null,
        dLenLast: rc.length ? rc[rc.length - 1].len : null,
        dLenNow: t?.getAttribute("d")?.length ?? 0,
        distinctDLens: new Set(rc.map((r) => r.len)).size,
        frames: window.__frames.slice(),
      };
    });

    // prefers-contrast: more — at rest
    await page.emulateMedia({ contrast: "more" });
    await page.waitForTimeout(500);
    R.contrastMoreAtRest = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const cs = t && getComputedStyle(t);
      return { stroke: cs?.stroke, strokeWidth: cs?.strokeWidth, strokeOpacity: cs?.strokeOpacity,
               goldInk: getComputedStyle(document.documentElement).getPropertyValue("--color-gold-ink").trim(),
               goldStar: getComputedStyle(document.documentElement).getPropertyValue("--color-gold-star").trim() };
    });

    // prefers-contrast: more — AT THE WIN (the booked hedge)
    await page.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
    await page.waitForTimeout(2500);
    R.contrastMoreAtWin = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const cs = t && getComputedStyle(t);
      return { hasSolveSuccess: !!document.querySelector(".solve-success"),
               valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow"),
               stroke: cs?.stroke, strokeWidth: cs?.strokeWidth, strokeOpacity: cs?.strokeOpacity };
    });
    await page.emulateMedia({ contrast: "no-preference" });
    await page.waitForTimeout(400);
    R.defaultAtWin = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      const cs = t && getComputedStyle(t);
      return { stroke: cs?.stroke, strokeWidth: cs?.strokeWidth, transition: cs?.transition };
    });

    await ctx.close();
    console.error(`done ${cell}`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.error("wrote " + OUT);
