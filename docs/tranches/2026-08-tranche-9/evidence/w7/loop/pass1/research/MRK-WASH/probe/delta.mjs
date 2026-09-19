/**
 * MRK-WASH pass-1 · W1c — THE MARK, ISOLATED BY DIFFERENCE.
 *
 * Sampling a band on the cell's edge measures the GRID RULE, not the mark: a graphite rule
 * runs along the same pixels and it is darker than any blue the ring paints. So the mark is
 * isolated the way the standard itself frames it — as a CHANGE OF STATE on the same pixels.
 *
 *   OFF  the cell is not focused (focus parked on a control outside the board)
 *   ON   the same cell is keyboard-focused
 *
 * The mark's pixels are those whose L* moved by ≥ 1.0 (about one just-noticeable step) inside
 * the cell's box grown by 8px. Three numbers per arm, all from painted bytes:
 *
 *   changeRatio   median(ON of the moved pixels) vs median(OFF of the same pixels)
 *   adjacentRatio median(ON of the moved pixels) vs the NEUTRAL cell's ground
 *   areaPx        how much of the cell the mark actually covers
 *
 * `adjacentRatio` is the 1.4.11 number the census quotes as 3.63 for HEAD; `changeRatio` is
 * what the eye is given when the selection moves one square.
 */
import { chromium, webkit } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, bank, decode, sampleRect, lum, ratio, boardReady, cellCensus, focusCell } from "./lib.mjs";

const WASH_CSS = readFileSync(join(HERE, "..", "proto", "wash-board.css"), "utf8");

const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

function isolate(on, off, rect, dpr, grow = 8) {
  const x0 = Math.max(0, Math.round((rect.x - grow) * dpr));
  const x1 = Math.min(on.w, Math.round((rect.x + rect.width + grow) * dpr));
  const y0 = Math.max(0, Math.round((rect.y - grow) * dpr));
  const y1 = Math.min(on.h, Math.round((rect.y + rect.height + grow) * dpr));
  const onPx = [];
  const offPx = [];
  const dPx = [];
  let maxD = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * on.w + x) * on.ch;
      const a = [on.data[i], on.data[i + 1], on.data[i + 2]];
      const b = [off.data[i], off.data[i + 1], off.data[i + 2]];
      const d = Math.abs(lstar(a) - lstar(b));
      if (d > maxD) maxD = d;
      if (d >= 1.0) {
        onPx.push(a);
        offPx.push(b);
        dPx.push(d);
      }
    }
  if (!onPx.length) return { areaPx: 0, maxDLstar: Math.round(maxD * 100) / 100 };
  const m = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];
  // THE MARK HAS TWO PARTS and they need separate numbers: the BODY (what most of the changed
  // area reads at — the median) and the EDGE (the strongest ink the mark lays down — the 2nd
  // percentile away from the paper, whichever way the theme runs). A ring's 1.4.11 number is
  // the edge's; a wash's is the body's, because a wash has no edge.
  // Ranked by HOW MUCH THE PIXEL MOVED, never by how dark it is: a graphite grid rule is the
  // darkest thing in the box and it is not the mark. The edge is the median of the top 2% by
  // |ΔL*| — the pixels the state change actually put ink on.
  const order = dPx.map((d, i) => [d, i]).sort((a, b) => b[0] - a[0]);
  const top = order.slice(0, Math.max(1, Math.floor(order.length * 0.02)));
  const edgeOn = m(top.map((t) => onPx[t[1]]));
  const edgeOff = m(top.map((t) => offPx[t[1]]));
  return {
    areaPx: Math.round(onPx.length / (dpr * dpr)),
    maxDLstar: Math.round(maxD * 100) / 100,
    onMedian: m(onPx),
    offMedian: m(offPx),
    changeRatio: ratio(m(onPx), m(offPx)),
    edgeOn,
    edgeOff,
    edgeChangeRatio: ratio(edgeOn, edgeOff),
  };
}

const ARMS = [
  { name: "CONTROL-head", css: false },
  { name: "A08-fill-only", a: 0.08, rimW: 0, rimO: 0 },
  { name: "A18-fill-only", a: 0.18, rimW: 0, rimO: 0 },
  { name: "A28-fill-only", a: 0.28, rimW: 0, rimO: 0 },
  { name: "A40-fill-only", a: 0.4, rimW: 0, rimO: 0 },
  { name: "A80-fill-only", a: 0.8, rimW: 0, rimO: 0 },
  { name: "B-a12-rim2", a: 0.12, rimW: 2, rimO: 0.95 },
  { name: "B-a12-rim3", a: 0.12, rimW: 3, rimO: 0.95 },
  { name: "B-a18-rim4", a: 0.18, rimW: 4, rimO: 0.92 },
  { name: "B-a18-rim7", a: 0.18, rimW: 7, rimO: 0.9 },
];

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
    let census = await cellCensus(page);
    const mid = census.filter((c) => c.empty && c.i > 20 && c.i < 60);
    const sel = mid[Math.floor(mid.length / 2)];
    const selR = sel.rect;

    const park = () =>
      page.evaluate(() => {
        document.querySelector(".drawer-tab, .icon-btn, button")?.focus();
      });

    const rows = [];
    for (const arm of ARMS) {
      if (arm.a !== undefined) {
        await page.evaluate((a) => {
          const s = document.documentElement.style;
          s.setProperty("--wash-a", String(a.a));
          s.setProperty("--wash-rim-w", String(a.rimW));
          s.setProperty("--wash-rim-o", String(a.rimO));
        }, arm);
      }
      await park();
      await page.waitForTimeout(280);
      const off = await decode(await page.screenshot({ type: "png" }));
      await focusCell(page, sel.i);
      await page.waitForTimeout(320);
      const on = await decode(await page.screenshot({ type: "png" }));
      const c2 = await cellCensus(page);
      const neutral = c2.find((c) => !c.peer && c.empty && !c.focused);
      const nb = sampleRect(on, neutral.rect, 1, 0.28);
      const iso = isolate(on, off, selR, 1);
      rows.push({
        ...arm,
        ...iso,
        adjacentRatio: iso.onMedian ? ratio(iso.onMedian, nb.median) : null,
        edgeAdjacentRatio: iso.edgeOn ? ratio(iso.edgeOn, nb.median) : null,
        cellAreaPx: Math.round(selR.width * selR.height),
        coverage: iso.areaPx ? Math.round((iso.areaPx / (selR.width * selR.height)) * 100) : 0,
      });
      if (arm.name === "CONTROL-head") await page.addStyleTag({ content: WASH_CSS });
    }
    const key = `${engineName}-${theme}`;
    out[key] = { subject: sel.i, rows };
    console.log(
      `DELTA ${key} :: ` +
        rows
          .map(
            (r) =>
              `${r.name} body-adj=${r.adjacentRatio} edge-adj=${r.edgeAdjacentRatio} ` +
              `body-chg=${r.changeRatio} edge-chg=${r.edgeChangeRatio} area=${r.areaPx}px(${r.coverage}%)`,
          )
          .join("\n           "),
    );
    await ctx.close();
  }
  await browser.close();
}
bank("delta-mark.json", out);
