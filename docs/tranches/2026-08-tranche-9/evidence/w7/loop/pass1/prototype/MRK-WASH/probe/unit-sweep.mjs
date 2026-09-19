/**
 * MRK-WASH pass-1 PROTOTYPE · THE OTHER SIDE OF G-WASH-4.
 *
 * G-WASH-4 asserts a DIFFERENCE (selection body ≥ unit wash + 3.0 L*), and sweep.mjs showed the
 * selection's side of it cannot be raised: in light, the alpha that clears +3.0 (0.14) puts the
 * digit at 4.20, and the alpha that keeps the digit (0.09) leaves the margin at 1.41. The two
 * windows do not meet — the same collision the research lane found one level up.
 *
 * So this sweeps the CHEAP side: the unit wash's own alpha. It carries no digit debt of its own
 * (lowering it only helps the digits sitting in your row and column), and in dark it is measured
 * LOUDER than in light for the same 7% token — 5.00 L* off the ground against 3.01.
 *
 * Kept honest: the unit wash must still be visible as a unit. Its dL* is banked at every step so
 * the agglomerator can see what it is spending.
 */
import { chromium } from "playwright";
import { bank, decode, sampleRect, lum, ratio, r2, boardReady, cellCensus, focusCell } from "./lib.mjs";

const unitCss = (pct) => `.cell-peer:not(#never):not(#never) {
  background: color-mix(in srgb, var(--color-crayon-blue) ${pct}%, transparent);
}`;
const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};

const PCTS = [7, 6, 5, 4, 3, 2];
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
  const c0 = await cellCensus(page);
  const sel = c0.filter((c) => c.empty && c.i > 20 && c.i < 60)[1];
  await focusCell(page, sel.i);
  await page.waitForTimeout(400);

  const rows = [];
  for (const pct of PCTS) {
    await page.addStyleTag({ content: unitCss(pct) });
    await page.waitForTimeout(240);
    const img = await decode(await page.screenshot({ type: "png" }));
    const c2 = await cellCensus(page);
    const neutral = c2.find((c) => !c.peer && c.empty && !c.focused && !c.because);
    const unit = c2.find((c) => c.peer && c.empty && !c.focused && !c.because);
    const nb = sampleRect(img, neutral.rect, 1, 0.28);
    const ub = sampleRect(img, unit.rect, 1, 0.28);
    const sb = sampleRect(img, c2[sel.i].rect, 1, 0.28);
    const selDL = Math.abs(lstar(sb.median) - lstar(nb.median));
    const uniDL = Math.abs(lstar(ub.median) - lstar(nb.median));
    rows.push({
      unitPct: pct,
      unitDL: r2(uniDL),
      unitRatio: ratio(ub.median, nb.median),
      selectionDL: r2(selDL),
      margin: r2(selDL - uniDL),
      separableOK: selDL >= uniDL + 3.0,
    });
    console.log(
      `UNIT ${theme} ${pct}% :: unit dL*=${r2(uniDL)} (ratio ${ratio(ub.median, nb.median)}) ` +
        `sel dL*=${r2(selDL)} margin=${r2(selDL - uniDL)}${selDL >= uniDL + 3.0 ? " OK" : " <3.0"}`,
    );
  }
  out[theme] = rows;
  await ctx.close();
}
await browser.close();
bank("unit-sweep.json", out);
