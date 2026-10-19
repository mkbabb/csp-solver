// Integrator's scratch probe (not a product instrument; the dead attempt's, re-typed): live-filter
// population at BOOT (max over every rAF from navigation to +4 s) vs at REST (baked-hidden poses, +4.5 s).
// The counted predicate is filter-census.spec.ts's `filteredCount` (filter != none, display != none).
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const url = process.argv[2];
const out = [];
for (const [name, bt] of [["chromium", chromium], ["webkit", webkit]].filter(([n]) => !process.env.ENGINE || n === process.env.ENGINE)) {
  const b = await bt.launch();
  try {
  for (const scheme of ["light", "dark"]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
    try {
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      const w = window; w.__fc = { max: 0, at: 0, n: 0 };
      const t0 = performance.now();
      const tick = () => {
        const c = Array.from(document.querySelectorAll("*")).filter((el) => { const cs = getComputedStyle(el); return cs.filter !== "none" && cs.display !== "none"; }).length;
        w.__fc.n++; if (c > w.__fc.max) { w.__fc.max = c; w.__fc.at = Math.round(performance.now() - t0); }
        if (performance.now() - t0 < 4000) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto(url + "/?size=3&difficulty=EASY");
    const js = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll("svg.hand-drawn-grid g.boil-frame-layer.baked-hidden").length > 0, null, { timeout: 30000 });
    await page.waitForTimeout(4500);
    const rest = await page.evaluate(() => Array.from(document.querySelectorAll("*")).filter((el) => { const cs = getComputedStyle(el); return cs.filter !== "none" && cs.display !== "none"; }).length);
    const fc = await page.evaluate(() => window.__fc);
    out.push(`${name} ${scheme} boot-max ${fc.max} (at ${fc.at} ms, ${fc.n} frames) rest ${rest} ${js.split("/").pop()}`);
    } finally { await ctx.close(); }
  }
  } finally { await b.close(); }
}
console.log(out.join("\n"));
