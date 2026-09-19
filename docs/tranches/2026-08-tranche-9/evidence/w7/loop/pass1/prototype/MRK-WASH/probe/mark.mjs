/**
 * MRK-WASH pass-1 PROTOTYPE · G-WASH-1 / G-WASH-3 / G-WASH-4.
 *
 * The prototype is the PRODUCT here — `gameCell.css` tier 2 carries the wash on the tree this
 * server is built from — so nothing is injected for the PROTO arm. The CONTROL arm restores
 * HEAD's own tier 2 (fill 0.08, stroke 7 @ 0.9, paint-order normal) by overlay, so the two
 * numbers come from ONE session, ONE deal, ONE set of pixels.
 *
 *   G-WASH-1  the mark by STATE DIFFERENCE (focus parked off the board -> ON), body and edge
 *             reported separately: a fill alone reports them equal, a rim does not.
 *   G-WASH-3  the digit through the wash, with the glyph CORE isolated by erosion (the box
 *             sampler the research lane used includes the glyph's anti-aliased edge — that is
 *             what put 4.30 on the record).
 *   G-WASH-4  separability by dL*: the selection body against the 7% unit wash, both off paper.
 */
import { chromium, webkit } from "playwright";
import {
  bank,
  decode,
  sampleRect,
  lum,
  ratio,
  r2,
  boardReady,
  cellCensus,
  focusCell,
} from "./lib.mjs";

const HEAD_CSS = `
.game-cell:has(input:focus-visible):not(#never):not(#never) .cell-ghost-path {
  paint-order: normal;
  fill: var(--color-focus-sketch, var(--color-crayon-blue));
  fill-opacity: 0.08;
  stroke: var(--color-focus-sketch, var(--color-crayon-blue));
  stroke-width: 7;
  stroke-opacity: 0.9;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}`;
const alphaCss = (a) =>
  `.game-cell:has(input:focus-visible):not(#never):not(#never) .cell-ghost-path { --wash-a: ${a}; }`;

const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [
  med(px.map((p) => p[0])),
  med(px.map((p) => p[1])),
  med(px.map((p) => p[2])),
];

/** The mark isolated as a change of state (the research lane's delta.mjs method). */
function isolate(on, off, rect, dpr, grow = 8) {
  const x0 = Math.max(0, Math.round((rect.x - grow) * dpr));
  const x1 = Math.min(on.w, Math.round((rect.x + rect.width + grow) * dpr));
  const y0 = Math.max(0, Math.round((rect.y - grow) * dpr));
  const y1 = Math.min(on.h, Math.round((rect.y + rect.height + grow) * dpr));
  const onPx = [],
    offPx = [],
    dPx = [];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * on.w + x) * on.ch;
      const a = [on.data[i], on.data[i + 1], on.data[i + 2]];
      const b = [off.data[i], off.data[i + 1], off.data[i + 2]];
      if (Math.abs(lstar(a) - lstar(b)) >= 1.0) {
        onPx.push(a);
        offPx.push(b);
        dPx.push(Math.abs(lstar(a) - lstar(b)));
      }
    }
  if (!onPx.length) return { areaPx: 0 };
  const order = dPx.map((d, i) => [d, i]).sort((a, b) => b[0] - a[0]);
  const top = order.slice(0, Math.max(1, Math.floor(order.length * 0.02)));
  const edgeOn = medPx(top.map((t) => onPx[t[1]]));
  const edgeOff = medPx(top.map((t) => offPx[t[1]]));
  return {
    areaPx: Math.round(onPx.length / (dpr * dpr)),
    bodyOn: medPx(onPx),
    bodyChangeRatio: ratio(medPx(onPx), medPx(offPx)),
    edgeChangeRatio: ratio(edgeOn, edgeOff),
    edgeOn,
  };
}

/**
 * THE GLYPH CORE. Inside the cell's inner box: split the pixels into ink and ground at the
 * midpoint of the box's own L* range, then ERODE the ink set (a pixel survives only if its four
 * neighbours are ink too). What survives is the stroke's interior — no anti-aliased edge, which
 * is why the lane's box figure read low.
 */
function glyphCore(img, rect, dpr, inset = 0.16) {
  const x0 = Math.round((rect.x + rect.width * inset) * dpr);
  const x1 = Math.round((rect.x + rect.width * (1 - inset)) * dpr);
  const y0 = Math.round((rect.y + rect.height * inset) * dpr);
  const y1 = Math.round((rect.y + rect.height * (1 - inset)) * dpr);
  const W = x1 - x0,
    H = y1 - y0;
  const L = new Float64Array(W * H);
  const px = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = ((y + y0) * img.w + (x + x0)) * img.ch;
      const p = [img.data[i], img.data[i + 1], img.data[i + 2]];
      px.push(p);
      L[y * W + x] = lstar(p);
    }
  const sorted = [...L].sort((a, b) => a - b);
  const lo = sorted[Math.floor(sorted.length * 0.02)];
  const hi = sorted[Math.floor(sorted.length * 0.98)];
  if (hi - lo < 8) return null; // no glyph in the box
  const mid = (lo + hi) / 2;
  const isInk = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L[y * W + x] < mid;
  const core = [],
    ground = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (L[y * W + x] < mid) {
        if (isInk(x - 1, y) && isInk(x + 1, y) && isInk(x, y - 1) && isInk(x, y + 1))
          core.push(px[y * W + x]);
      } else ground.push(px[y * W + x]);
    }
  if (core.length < 12 || !ground.length) return null;
  const c = medPx(core),
    g = medPx(ground);
  return { core: c, ground: g, ratio: ratio(c, g), corePx: core.length, groundPx: ground.length };
}

const out = {};
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
    await boardReady(page);
    const census0 = await cellCensus(page);
    const mid = census0.filter((c) => c.empty && c.i > 20 && c.i < 60);
    const rows = [];

    const park = () =>
      page.evaluate(() => document.querySelector(".drawer-tab, .icon-btn, button")?.focus());

    const armRun = async (name) => {
      // FOUR CELLS, not one: 1.4.11 on the mark is asserted four-for-four per engine × theme.
      const cells = [mid[1], mid[3], mid[5], mid[7]].filter(Boolean);
      const per = [];
      for (const sel of cells) {
        await park();
        await page.waitForTimeout(260);
        const off = await decode(await page.screenshot({ type: "png" }));
        await focusCell(page, sel.i);
        await page.waitForTimeout(320);
        const on = await decode(await page.screenshot({ type: "png" }));
        const c2 = await cellCensus(page);
        const neutral = c2.find((c) => !c.peer && c.empty && !c.focused && !c.because);
        const unit = c2.find((c) => c.peer && c.empty && !c.focused && !c.because);
        const nb = sampleRect(on, neutral.rect, 1, 0.28);
        const ub = unit ? sampleRect(on, unit.rect, 1, 0.28) : null;
        const sb = sampleRect(on, sel.rect, 1, 0.28);
        const iso = isolate(on, off, sel.rect, 1);
        per.push({
          cell: sel.i,
          ...iso,
          bodyAdjacent: iso.bodyOn ? ratio(iso.bodyOn, nb.median) : null,
          edgeAdjacent: iso.edgeOn ? ratio(iso.edgeOn, nb.median) : null,
          paperL: r2(lstar(nb.median)),
          selectionDL: r2(Math.abs(lstar(sb.median) - lstar(nb.median))),
          unitDL: ub ? r2(Math.abs(lstar(ub.median) - lstar(nb.median))) : null,
        });
      }
      // The digit, read through the wash on the cell you are typing into.
      const sel = mid[1];
      await focusCell(page, sel.i);
      await page.keyboard.press("5");
      await page.waitForTimeout(500);
      const shot = await decode(await page.screenshot({ type: "png" }));
      const c3 = await cellCensus(page);
      const g = glyphCore(shot, c3[sel.i].rect, 1);
      const box = sampleRect(shot, c3[sel.i].rect, 1, 0.28);
      const digitBox = box ? ratio(box.darkest, box.lightest) : null;
      await page.keyboard.press("Backspace");
      await page.waitForTimeout(300);
      rows.push({
        arm: name,
        cells: per,
        markMin: Math.min(...per.map((p) => p.edgeAdjacent ?? 0)),
        edgeEqualsBody: per.every((p) => p.edgeAdjacent === p.bodyAdjacent),
        digitGlyphCore: g ? g.ratio : null,
        digitCorePx: g ? g.corePx : null,
        digitBoxSampler: digitBox,
        separable: per.every((p) => p.unitDL !== null && p.selectionDL >= p.unitDL + 3.0),
        selectionDL: r2(per.reduce((s, p) => s + p.selectionDL, 0) / per.length),
        unitDL: r2(per.reduce((s, p) => s + (p.unitDL ?? 0), 0) / per.length),
      });
    };

    await armRun("PROTO-a12-rim3");
    await page.addStyleTag({ content: alphaCss(0.1) });
    await armRun("PROTO-a10-rim3");
    await page.addStyleTag({ content: alphaCss(0.12) + HEAD_CSS });
    await armRun("CONTROL-head-ring7");

    const key = `${engineName}-${theme}`;
    out[key] = rows;
    for (const r of rows)
      console.log(
        `MARK ${key} ${r.arm} :: edge-adj=[${r.cells.map((c) => c.edgeAdjacent).join(", ")}] ` +
          `body-adj=[${r.cells.map((c) => c.bodyAdjacent).join(", ")}] edge==body=${r.edgeEqualsBody} ` +
          `digit(core)=${r.digitGlyphCore} digit(box)=${r.digitBoxSampler} ` +
          `dL* sel=${r.selectionDL} unit=${r.unitDL} separable=${r.separable}`,
      );
    await ctx.close();
  }
  await browser.close();
}
bank("mark.json", out);
