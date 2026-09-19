/**
 * MRK-WASH pass-1 · W1b — THE TWO WINDOWS, and where the wax edge carries what the body cannot.
 *
 * `wash.mjs` showed the body's alpha pulling two floors in opposite directions. This
 * instrument finds the two crossings exactly and asks whether a RIM on the same path can hold
 * the 3:1 while the body stays light enough for the digit.
 *
 *   WINDOW 1 (the mark)   selected vs neutral ≥ 3:1        — 1.4.11, the indicator
 *   WINDOW 2 (the digit)  ink vs its own ground ≥ 4.5:1    — 1.4.3, the value
 *
 * The rim is sampled where it lives: a band straddling the cell's TOP EDGE, middle 60% of the
 * span so the corners' overshoot never enters. The band's darkest 5% is the mark's ink, read
 * against the NEUTRAL cell's ground — which is the adjacent colour 1.4.11 asks about.
 *
 * ΔL* is banked beside every ratio. A contrast ratio answers the standard; a ΔL* answers "at a
 * glance" — one unit is about one just-noticeable step, and that is the number the family's
 * "separable from the unit wash" claim actually stands on.
 */
import { chromium, webkit } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, bank, decode, sampleRect, lum, ratio, boardReady, cellCensus, focusCell } from "./lib.mjs";

const WASH_CSS = readFileSync(join(HERE, "..", "proto", "wash-board.css"), "utf8");

const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : (24389 / 27) * y / 116 + 16 / 116;
  return Math.round((116 * f - 16) * 100) / 100;
};

/** A band straddling the cell's top edge: where a ring or a rim paints. */
function edgeBand(img, rect, dpr, halfPx = 5) {
  const x0 = Math.round((rect.x + rect.width * 0.2) * dpr);
  const x1 = Math.round((rect.x + rect.width * 0.8) * dpr);
  const y0 = Math.round((rect.y - halfPx) * dpr);
  const y1 = Math.round((rect.y + halfPx) * dpr);
  const px = [];
  for (let y = Math.max(0, y0); y < Math.min(img.h, y1); y++)
    for (let x = Math.max(0, x0); x < Math.min(img.w, x1); x++) {
      const i = (y * img.w + x) * img.ch;
      px.push([img.data[i], img.data[i + 1], img.data[i + 2]]);
    }
  const byLum = px.map((p) => [lum(p), p]).sort((a, b) => a[0] - b[0]);
  return { n: px.length, darkest: byLum[0][1], p05: byLum[Math.floor(px.length * 0.05)][1] };
}

const ALPHAS = [];
for (let a = 0.04; a <= 0.901; a += 0.04) ALPHAS.push(Math.round(a * 100) / 100);

const RIMS = [
  { name: "HEAD-ring", a: 0.08, rimW: 7, rimO: 0.9 },
  { name: "rim2-a12", a: 0.12, rimW: 2, rimO: 0.95 },
  { name: "rim3-a12", a: 0.12, rimW: 3, rimO: 0.95 },
  { name: "rim4-a12", a: 0.12, rimW: 4, rimO: 0.9 },
  { name: "rim5-a12", a: 0.12, rimW: 5, rimO: 0.9 },
  { name: "rim3-a20", a: 0.2, rimW: 3, rimO: 0.95 },
];

const set = (page, arm) =>
  page.evaluate((a) => {
    const s = document.documentElement.style;
    s.setProperty("--wash-a", String(a.a));
    s.setProperty("--wash-rim-w", String(a.rimW));
    s.setProperty("--wash-rim-o", String(a.rimO));
  }, arm);

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
    await focusCell(page, sel.i);
    // one legal digit so both windows are readable in the same frame
    let wrote = null;
    for (const d of ["1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      await page.keyboard.press(d);
      await page.waitForTimeout(160);
      if (!(await page.evaluate(() => !!document.querySelector(".game-cell.is-invalid:has(input:focus-visible)")))) {
        wrote = d;
        break;
      }
    }
    census = await cellCensus(page);
    const selR = census[sel.i].rect;
    const unit = census.find((c) => c.peer && c.empty && !c.focused);
    const neutral = census.find((c) => !c.peer && c.empty && !c.focused);

    const read = async () => {
      const img = await decode(await page.screenshot({ type: "png" }));
      const body = sampleRect(img, selR, 1, 0.38); // inside the glyph's own box
      const ground = sampleRect(img, selR, 1, 0.16); // the cell's ground, inside the edge
      const nb = sampleRect(img, neutral.rect, 1, 0.28);
      const un = sampleRect(img, unit.rect, 1, 0.28);
      const band = edgeBand(img, selR, 1);
      return {
        washVsNeutral: ratio(ground.median, nb.median),
        washVsUnit: ratio(ground.median, un.median),
        dLstarWashNeutral: Math.round((lstar(ground.median) - lstar(nb.median)) * 100) / 100,
        dLstarWashUnit: Math.round((lstar(ground.median) - lstar(un.median)) * 100) / 100,
        dLstarUnitNeutral: Math.round((lstar(un.median) - lstar(nb.median)) * 100) / 100,
        digitVsWash: ratio(body.p05, ground.median),
        edgeVsNeutral: ratio(band.p05, nb.median),
        edgeVsWash: ratio(band.p05, ground.median),
      };
    };

    await page.addStyleTag({ content: WASH_CSS });

    const sweep = [];
    for (const a of ALPHAS) {
      await set(page, { a, rimW: 0, rimO: 0 });
      await page.waitForTimeout(220);
      sweep.push({ alpha: a, ...(await read()) });
    }
    const rims = [];
    for (const arm of RIMS) {
      await set(page, arm);
      await page.waitForTimeout(220);
      rims.push({ ...arm, ...(await read()) });
    }

    const firstWash3 = sweep.find((r) => r.washVsNeutral >= 3);
    const lastDigit45 = [...sweep].reverse().find((r) => r.digitVsWash >= 4.5);
    const key = `${engineName}-${theme}`;
    out[key] = {
      wrote,
      subjectIdx: { selected: sel.i, unit: unit.i, neutral: neutral.i },
      sweep,
      rims,
      windows: {
        washReaches3AtAlpha: firstWash3?.alpha ?? null,
        digitHolds45UntilAlpha: lastDigit45?.alpha ?? null,
        overlap:
          firstWash3 && lastDigit45 ? firstWash3.alpha <= lastDigit45.alpha : false,
      },
    };
    console.log(
      `RIM ${key} wrote=${wrote} wash3@α=${out[key].windows.washReaches3AtAlpha} ` +
        `digit4.5≤α=${out[key].windows.digitHolds45UntilAlpha} overlap=${out[key].windows.overlap}`,
    );
    console.log(
      "  rims :: " +
        rims.map((r) => `${r.name} edge/neutral=${r.edgeVsNeutral} digit=${r.digitVsWash}`).join(" | "),
    );
    console.log(
      `  unit wash vs paper: ratio ${sweep[0].washVsUnit ? "" : ""}ΔL*=${sweep[0].dLstarUnitNeutral}`,
    );
    await ctx.close();
  }
  await browser.close();
}
bank("rim-windows.json", out);
