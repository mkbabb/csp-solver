/**
 * ACC-FIVE pass 4 · G10 AS A RATE, and the whole reading is taken at no-preference.
 *
 * Pass 3's entire browser evidence was taken with `reducedMotion: "reduce"`, so the mechanism
 * the family invented never executed (critique §3.2). This instrument runs ONLY at
 * `no-preference`, on both engines, and it reports the re-cut as a RATE per second beside the
 * panel's own refresh rate — because a per-event frame count is the reviewer's display talking
 * (critique §3.1: chromium 29 re-cut frames vs webkit 15 for the same 234 ms write).
 *
 * Copied from pass-3's `p3-win.mjs` shape with its OUT re-pointed and its `reducedMotion` flipped.
 *
 *   node p4-tween-rate.mjs <url> <outdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const URL_ = process.argv[2] ?? "http://127.0.0.1:4236/?size=3&difficulty=EASY";
const OUT = process.argv[3] ?? ".";
mkdirSync(OUT, { recursive: true });

const OBSERVER = () => {
  const w = window;
  w.__cuts = { d: 0, frames: 0, first: 0, last: 0, values: new Set() };
  const seen = new Set();
  const attach = () => {
    document.querySelectorAll(".progress-trace").forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      new MutationObserver((recs) => {
        const t = performance.now();
        for (const r of recs) {
          if (r.attributeName !== "d") continue;
          w.__cuts.d++;
          w.__cuts.values.add(r.target.getAttribute("d")?.length ?? 0);
          if (!w.__cuts.first) w.__cuts.first = t;
          if (t - w.__cuts.last > 0.5) w.__cuts.frames++;
          w.__cuts.last = t;
        }
      }).observe(el, { attributes: true, attributeFilter: ["d"] });
    });
  };
  attach();
  new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
};

const HZ = () =>
  new Promise((res) => {
    const ts = [];
    const tick = (t) => {
      ts.push(t);
      if (ts.length < 40) requestAnimationFrame(tick);
      else {
        const d = [];
        for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1]);
        d.sort((a, b) => a - b);
        res(Math.round(1000 / d[Math.floor(d.length / 2)]));
      }
    };
    requestAnimationFrame(tick);
  });

async function hint(page) {
  return page.evaluate(() => {
    const b = document.querySelector('[aria-label*="Hint" i]');
    if (!b || b.disabled) return false;
    b.click();
    return true;
  });
}

const rows = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "no-preference",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(URL_);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1500);

    // the regime is WITNESSED, not assumed
    const prm = await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
    const hz = await page.evaluate(HZ);

    await page.addInitScript(OBSERVER);
    await page.evaluate(OBSERVER);

    // three writes: the first seeds the gauge, then two measured ones
    await hint(page);
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      window.__cuts = { d: 0, frames: 0, first: 0, last: 0, values: new Set() };
    });
    await hint(page);
    await page.waitForTimeout(1200);

    const cuts = await page.evaluate(() => ({
      d: window.__cuts.d,
      frames: window.__cuts.frames,
      span: window.__cuts.last - window.__cuts.first,
      distinct: window.__cuts.values.size,
    }));
    const poses = await page.evaluate(
      () => document.querySelectorAll(".progress-trace").length,
    );
    const attrs = await page.evaluate(() => {
      const t = document.querySelector(".progress-trace");
      return t
        ? {
            strokeOpacity: getComputedStyle(t).strokeOpacity,
            pathLength: t.getAttribute("pathLength"),
            dash: t.getAttribute("stroke-dasharray"),
            segments: (t.getAttribute("d")?.match(/[Ll]/g) ?? []).length,
          }
        : null;
    });
    rows.push({
      engine: name,
      scheme,
      prmMatches: prm,
      panelHz: hz,
      poses,
      dWrites: cuts.d,
      recutFrames: cuts.frames,
      spanMs: +cuts.span.toFixed(1),
      recutsPerSec: cuts.span > 0 ? +((cuts.frames / cuts.span) * 1000).toFixed(1) : 0,
      distinctLengths: cuts.distinct,
      ...attrs,
    });
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/tween-rate.json`, JSON.stringify(rows, null, 2));
for (const r of rows)
  console.log(
    `${r.engine}/${r.scheme}  panel ${r.panelHz}Hz  PRM=${r.prmMatches}  poses ${r.poses}  ` +
      `d-writes ${r.dWrites}  re-cut frames ${r.recutFrames}  span ${r.spanMs}ms  ` +
      `RATE ${r.recutsPerSec}/s  opacity ${r.strokeOpacity}  pathLength ${r.pathLength}  dash ${r.dash}  segs ${r.segments}`,
  );
