/**
 * MRK-WASH pass-1 CRITIQUE — THE ABLATION THE LANE DID NOT RUN.
 *
 * The spec asserts "the rim's ratio is set by OPACITY not width (rim3@0.95 beats rim7@0.90), so
 * width and floor are separable" and then ships paint-order:stroke + a 3-unit rim + three new
 * custom properties. If HEAD's own 7-unit ring at 0.95 reads the same 3.9x, the family's whole
 * measured gain is ONE CHARACTER at HEAD and the mechanism is unearned.
 *
 * FOUR ARMS, one session, one deal, one set of pixels:
 *   A PROTO   paint-order:stroke, rim 3 @ 0.95, fill 0.08   (the product, as shipped)
 *   B HEAD    paint-order:normal, ring 7 @ 0.90, fill 0.08   (the control)
 *   C ABLATE  paint-order:normal, ring 7 @ 0.95, fill 0.08   (HEAD + the opacity alone)
 *   D ABLATE  paint-order:normal, rim 3 @ 0.95, fill 0.08   (the width alone, no paint-order)
 *
 * TWO ESTIMATORS per arm, because the lane reports only the first:
 *   top2   the median of the 2% MOST-changed pixels (the lane's isolate(); a best-case pixel)
 *   p50    the median of EVERY changed pixel in the rim band (what a reader's eye integrates)
 * plus the mark's visible width in CSS px, measured from the painted bytes.
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:4241";
const OUT = new URL("../logs/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};
const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const r2 = (v) => Math.round(v * 100) / 100;
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];

const ARMS = {
  "A-PROTO-stroke-rim3-o95": null, // the product as it ships; nothing injected
  "B-HEAD-normal-ring7-o90": `paint-order: normal; stroke-width: 7; stroke-opacity: 0.9;`,
  "C-ABLATE-normal-ring7-o95": `paint-order: normal; stroke-width: 7; stroke-opacity: 0.95;`,
  "D-ABLATE-normal-rim3-o95": `paint-order: normal; stroke-width: 3; stroke-opacity: 0.95;`,
};
const armCss = (decls) =>
  decls
    ? `.game-cell:has(input:focus-visible):not(#nope):not(#nope) .cell-ghost-path { ${decls} fill-opacity: 0.08; }`
    : "";

async function decode(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}

/** Every pixel whose L* moved when the cell took focus, in a band around the cell. */
function changed(on, off, rect, grow = 8) {
  const x0 = Math.max(0, Math.round(rect.x - grow));
  const x1 = Math.min(on.w, Math.round(rect.x + rect.width + grow));
  const y0 = Math.max(0, Math.round(rect.y - grow));
  const y1 = Math.min(on.h, Math.round(rect.y + rect.height + grow));
  const rows = [];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * on.w + x) * on.ch;
      const a = [on.data[i], on.data[i + 1], on.data[i + 2]];
      const b = [off.data[i], off.data[i + 1], off.data[i + 2]];
      const d = Math.abs(lstar(a) - lstar(b));
      if (d >= 1.0) rows.push({ x, y, a, b, d });
    }
  return rows;
}

/** The mark's visible width: the changed pixels' run length across the cell's left edge. */
function rimWidth(rows, rect) {
  const yMid = Math.round(rect.y + rect.height / 2);
  const band = rows.filter((r) => Math.abs(r.y - yMid) <= 1 && r.x < rect.x + rect.width * 0.25);
  if (!band.length) return null;
  const xs = [...new Set(band.map((r) => r.x))].sort((a, b) => a - b);
  // longest contiguous run
  let best = 0,
    run = 1;
  for (let i = 1; i < xs.length; i++) {
    run = xs[i] === xs[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return Math.max(best, 1);
}

const results = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1400);

    const census = () =>
      page.evaluate(() =>
        Array.from(document.querySelectorAll(".game-cell")).map((c, i) => {
          const r = c.getBoundingClientRect();
          return {
            i,
            empty: !c.querySelector("input")?.value,
            peer: !!c.querySelector(".cell-peer"),
            because: !!c.querySelector(".cell-because"),
            focused: !!c.querySelector("input:focus-visible"),
            rect: { x: r.x, y: r.y, width: r.width, height: r.height },
          };
        }),
      );
    const park = () =>
      page.evaluate(() => document.querySelector(".drawer-tab, .icon-btn, button")?.focus());
    const focusCell = (i) =>
      page.evaluate(
        (k) => document.querySelectorAll(".game-cell input")[k]?.focus(),
        i,
      );

    const c0 = await census();
    const subjects = c0.filter((c) => c.empty && c.i > 20 && c.i < 60).slice(0, 8);
    const key = `${engineName}-${theme}`;
    results[key] = {};

    let styleHandle = null;
    for (const [arm, decls] of Object.entries(ARMS)) {
      // reload between arms so an injected sheet never stacks on the previous one
      await page.reload();
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
      await page.waitForTimeout(1200);
      if (decls) await page.addStyleTag({ content: armCss(decls) });
      await page.waitForTimeout(200);

      const per = [];
      for (const sel of [subjects[1], subjects[3], subjects[5], subjects[7]].filter(Boolean)) {
        await park();
        await page.waitForTimeout(260);
        const off = await decode(await page.screenshot({ type: "png" }));
        await focusCell(sel.i);
        await page.waitForTimeout(320);
        const on = await decode(await page.screenshot({ type: "png" }));
        const c2 = await census();
        const neutral = c2.find((c) => !c.peer && c.empty && !c.focused && !c.because);
        const nx = Math.round(neutral.rect.x + neutral.rect.width * 0.3);
        const ny = Math.round(neutral.rect.y + neutral.rect.height * 0.3);
        const npx = [];
        for (let y = ny; y < ny + Math.round(neutral.rect.height * 0.4); y++)
          for (let x = nx; x < nx + Math.round(neutral.rect.width * 0.4); x++) {
            const i = (y * on.w + x) * on.ch;
            npx.push([on.data[i], on.data[i + 1], on.data[i + 2]]);
          }
        const paper = medPx(npx);

        const rows = changed(on, off, sel.rect);
        if (!rows.length) {
          per.push({ cell: sel.i, empty: true });
          continue;
        }
        const byD = [...rows].sort((a, b) => b.d - a.d);
        const top2 = byD.slice(0, Math.max(1, Math.floor(byD.length * 0.02)));
        // the rim band = changed pixels outside the cell's inner 80% (the body is the inside)
        const inX = (r) =>
          r.x > sel.rect.x + sel.rect.width * 0.12 &&
          r.x < sel.rect.x + sel.rect.width * 0.88 &&
          r.y > sel.rect.y + sel.rect.height * 0.12 &&
          r.y < sel.rect.y + sel.rect.height * 0.88;
        const rim = rows.filter((r) => !inX(r));
        const body = rows.filter(inX);
        per.push({
          cell: sel.i,
          changedPx: rows.length,
          top2Ratio: ratio(medPx(top2.map((t) => t.a)), paper),
          rimP50Ratio: rim.length ? ratio(medPx(rim.map((t) => t.a)), paper) : null,
          rimP90Ratio: rim.length
            ? ratio(
                medPx(
                  [...rim].sort((a, b) => b.d - a.d).slice(0, Math.max(1, Math.floor(rim.length * 0.1))).map((t) => t.a),
                ),
                paper,
              )
            : null,
          bodyRatio: body.length ? ratio(medPx(body.map((t) => t.a)), paper) : null,
          rimPx: rim.length,
          bodyPx: body.length,
          rimWidthCssPx: rimWidth(rows, sel.rect),
          paperL: r2(lstar(paper)),
        });
      }
      const g = (f) => per.map(f).filter((v) => v != null);
      results[key][arm] = {
        cells: per,
        top2Min: Math.min(...g((p) => p.top2Ratio)),
        rimP50Min: Math.min(...g((p) => p.rimP50Ratio)),
        rimP90Min: Math.min(...g((p) => p.rimP90Ratio)),
        bodyMed: med(g((p) => p.bodyRatio)),
        rimWidthMed: med(g((p) => p.rimWidthCssPx)),
      };
      const R = results[key][arm];
      console.log(
        `${key} ${arm.padEnd(26)} top2Min=${R.top2Min}  rimP50Min=${R.rimP50Min}  rimP90Min=${R.rimP90Min}  body=${R.bodyMed}  visibleWidth=${R.rimWidthMed}px`,
      );
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT + "ablate.json", JSON.stringify(results, null, 2));
console.log("\nbanked -> logs/ablate.json");
