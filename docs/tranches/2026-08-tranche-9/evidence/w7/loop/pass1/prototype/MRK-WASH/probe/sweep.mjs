/**
 * MRK-WASH pass-1 PROTOTYPE · THE TWO WINDOWS, RE-OPENED ON THE BODY.
 *
 * mark.mjs found the digit at 4.30 (a 0.12) and 4.45 (a 0.10) in light — both under 4.5 — and
 * the body's dL* separability at +2.90 light / +0.90 dark, both under the +3.0 floor. Those two
 * demands pull the SAME knob in opposite directions, so this sweep prices the overlap directly:
 * per alpha, the digit's glyph-core ratio and the body's dL* over the unit wash, both themes.
 *
 * Also banked: the glyph's rendered height in CSS px, because 1.4.3's floor is 3:1 for
 * large-scale text and the cell digit's size decides which floor the digit row is scored on.
 */
import { chromium } from "playwright";
import { bank, decode, sampleRect, lum, ratio, r2, boardReady, cellCensus, focusCell } from "./lib.mjs";

const alphaCss = (a) =>
  `.game-cell:has(input:focus-visible):not(#never):not(#never) .cell-ghost-path { --wash-a: ${a}; }`;
const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];

function glyphCore(img, rect, dpr, inset = 0.16) {
  const x0 = Math.round((rect.x + rect.width * inset) * dpr);
  const x1 = Math.round((rect.x + rect.width * (1 - inset)) * dpr);
  const y0 = Math.round((rect.y + rect.height * inset) * dpr);
  const y1 = Math.round((rect.y + rect.height * (1 - inset)) * dpr);
  const W = x1 - x0, H = y1 - y0;
  const L = new Float64Array(W * H);
  const px = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = ((y + y0) * img.w + (x + x0)) * img.ch;
      const p = [img.data[i], img.data[i + 1], img.data[i + 2]];
      px.push(p);
      L[y * W + x] = lstar(p);
    }
  const s = [...L].sort((a, b) => a - b);
  const lo = s[Math.floor(s.length * 0.02)], hi = s[Math.floor(s.length * 0.98)];
  if (hi - lo < 8) return null;
  const mid = (lo + hi) / 2;
  const isInk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L[y * W + x] < mid;
  const core = [], ground = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (L[y * W + x] < mid) {
        if (isInk(x - 1, y) && isInk(x + 1, y) && isInk(x, y - 1) && isInk(x, y + 1))
          core.push(px[y * W + x]);
      } else ground.push(px[y * W + x]);
  if (core.length < 12 || !ground.length) return null;
  return { ratio: ratio(medPx(core), medPx(ground)), corePx: core.length };
}

const ALPHAS = [0.08, 0.09, 0.1, 0.11, 0.12, 0.14, 0.16, 0.18, 0.2];
const out = {};
const browser = await chromium.launch();
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: theme,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await boardReady(page);
  const census = await cellCensus(page);
  const sel = census.filter((c) => c.empty && c.i > 20 && c.i < 60)[1];

  // The glyph's rendered size: 1.4.3's large-text floor is decided here, not by assertion.
  await focusCell(page, sel.i);
  await page.keyboard.press("5");
  await page.waitForTimeout(400);
  const glyphBox = await page.evaluate((i) => {
    const cell = document.querySelectorAll(".game-cell")[i];
    const g = cell?.querySelector(".glyph-svg, svg:not(.cell-ghost) path, .cell-value");
    const r = g?.getBoundingClientRect();
    const paths = Array.from(cell?.querySelectorAll("svg") ?? []).map((s) => ({
      cls: s.getAttribute("class"),
      h: Math.round(s.getBoundingClientRect().height * 10) / 10,
    }));
    return { tag: g?.tagName ?? null, h: r ? Math.round(r.height * 10) / 10 : null, paths };
  }, sel.i);

  const rows = [];
  for (const a of ALPHAS) {
    await page.addStyleTag({ content: alphaCss(a) });
    await page.waitForTimeout(260);
    const img = await decode(await page.screenshot({ type: "png" }));
    const c2 = await cellCensus(page);
    const neutral = c2.find((c) => !c.peer && c.empty && !c.focused && !c.because);
    const unit = c2.find((c) => c.peer && c.empty && !c.focused && !c.because);
    const nb = sampleRect(img, neutral.rect, 1, 0.28);
    const ub = sampleRect(img, unit.rect, 1, 0.28);
    const sb = sampleRect(img, c2[sel.i].rect, 1, 0.28);
    const g = glyphCore(img, c2[sel.i].rect, 1);
    // The body's own sample must exclude the digit: take the median of the box MINUS the ink,
    // which sampleRect's median already approximates (the glyph is a minority of the box).
    const selDL = Math.abs(lstar(sb.median) - lstar(nb.median));
    const uniDL = Math.abs(lstar(ub.median) - lstar(nb.median));
    rows.push({
      alpha: a,
      digitCore: g?.ratio ?? null,
      selectionDL: r2(selDL),
      unitDL: r2(uniDL),
      margin: r2(selDL - uniDL),
      digitOK: (g?.ratio ?? 0) >= 4.5,
      separableOK: selDL >= uniDL + 3.0,
    });
  }
  out[theme] = { glyph: glyphBox, rows };
  console.log(`SWEEP ${theme} glyph=${JSON.stringify(glyphBox)}`);
  for (const r of rows)
    console.log(
      `   a=${r.alpha} digit=${r.digitCore}${r.digitOK ? " OK" : " <4.5"} ` +
        `dL* sel=${r.selectionDL} unit=${r.unitDL} margin=${r.margin}${r.separableOK ? " OK" : " <3.0"}`,
    );
  await ctx.close();
}
await browser.close();
bank("sweep.json", out);
