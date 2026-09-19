/**
 * MRK-WASH pass-1 PROTOTYPE · THE ONE SETTING THAT GREENS ALL FOUR BOARD GATES, MEASURED WHOLE.
 *
 * sweep.mjs and unit-sweep.mjs each moved ONE knob. A configuration composed from two separate
 * sweeps is arithmetic, not a measurement, so the candidate is re-read end to end here, in both
 * engines, with every gate's own number taken off the same painted frames:
 *
 *   ARM-SPEC   what the spec pins: --wash-a 0.12, unit 7% (both themes) — the record's baseline
 *   ARM-FIX    --wash-a 0.09 light / 0.18 dark, unit 3% light / 7% dark
 *   ARM-FIX-1A --wash-a 0.09 light / 0.18 dark, unit 4% BOTH (one unit value, not two)
 *
 * G-WASH-1 rim ≥3.5 on four cells · G-WASH-3 digit ≥4.5 glyph core · G-WASH-4 margin ≥3.0 L*.
 */
import { chromium, webkit } from "playwright";
import { bank, decode, sampleRect, lum, ratio, r2, boardReady, cellCensus, focusCell } from "./lib.mjs";

const css = (a, pct) => `
.game-cell:has(input:focus-visible):not(#never):not(#never) .cell-ghost-path { --wash-a: ${a}; }
.cell-peer:not(#never):not(#never) { background: color-mix(in srgb, var(--color-crayon-blue) ${pct}%, transparent); }`;

const ARMS = {
  "ARM-SPEC": { light: [0.12, 7], dark: [0.12, 7] },
  "ARM-FIX": { light: [0.09, 3], dark: [0.18, 7] },
  "ARM-FIX-1A": { light: [0.09, 4], dark: [0.18, 4] },
};

const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];

function isolateEdge(on, off, rect, dpr, grow = 8) {
  const x0 = Math.max(0, Math.round((rect.x - grow) * dpr));
  const x1 = Math.min(on.w, Math.round((rect.x + rect.width + grow) * dpr));
  const y0 = Math.max(0, Math.round((rect.y - grow) * dpr));
  const y1 = Math.min(on.h, Math.round((rect.y + rect.height + grow) * dpr));
  const onPx = [], dPx = [];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * on.w + x) * on.ch;
      const a = [on.data[i], on.data[i + 1], on.data[i + 2]];
      const b = [off.data[i], off.data[i + 1], off.data[i + 2]];
      const d = Math.abs(lstar(a) - lstar(b));
      if (d >= 1.0) { onPx.push(a); dPx.push(d); }
    }
  if (!onPx.length) return null;
  const order = dPx.map((d, i) => [d, i]).sort((a, b) => b[0] - a[0]);
  const top = order.slice(0, Math.max(1, Math.floor(order.length * 0.02)));
  return { edge: medPx(top.map((t) => onPx[t[1]])), body: medPx(onPx) };
}

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
      px.push(p); L[y * W + x] = lstar(p);
    }
  const s = [...L].sort((a, b) => a - b);
  const lo = s[Math.floor(s.length * 0.02)], hi = s[Math.floor(s.length * 0.98)];
  if (hi - lo < 8) return null;
  const mid = (lo + hi) / 2;
  const ink = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L[y * W + x] < mid;
  const core = [], ground = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (L[y * W + x] < mid) {
        if (ink(x - 1, y) && ink(x + 1, y) && ink(x, y - 1) && ink(x, y + 1)) core.push(px[y * W + x]);
      } else ground.push(px[y * W + x]);
  if (core.length < 12 || !ground.length) return null;
  return ratio(medPx(core), medPx(ground));
}

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    for (const [armName, conf] of Object.entries(ARMS)) {
      const [a, pct] = conf[theme];
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        colorScheme: theme,
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      await boardReady(page);
      await page.addStyleTag({ content: css(a, pct) });
      const c0 = await cellCensus(page);
      const mid = c0.filter((c) => c.empty && c.i > 20 && c.i < 60);
      const cells = [mid[1], mid[3], mid[5], mid[7]].filter(Boolean);
      const park = () => page.evaluate(() => document.querySelector("button")?.focus());
      const rims = [];
      let margin = null, unitDL = null, selDL = null;
      for (const sel of cells) {
        await park();
        await page.waitForTimeout(250);
        const off = await decode(await page.screenshot({ type: "png" }));
        await focusCell(page, sel.i);
        await page.waitForTimeout(320);
        const on = await decode(await page.screenshot({ type: "png" }));
        const c2 = await cellCensus(page);
        const neutral = c2.find((c) => !c.peer && c.empty && !c.focused && !c.because);
        const unit = c2.find((c) => c.peer && c.empty && !c.focused && !c.because);
        const nb = sampleRect(on, neutral.rect, 1, 0.28);
        const iso = isolateEdge(on, off, sel.rect, 1);
        rims.push(iso ? ratio(iso.edge, nb.median) : null);
        if (unit) {
          const ub = sampleRect(on, unit.rect, 1, 0.28);
          const sb = sampleRect(on, c2[sel.i].rect, 1, 0.28);
          unitDL = r2(Math.abs(lstar(ub.median) - lstar(nb.median)));
          selDL = r2(Math.abs(lstar(sb.median) - lstar(nb.median)));
          margin = r2(selDL - unitDL);
        }
      }
      await focusCell(page, cells[0].i);
      await page.keyboard.press("5");
      await page.waitForTimeout(500);
      const img = await decode(await page.screenshot({ type: "png" }));
      const c3 = await cellCensus(page);
      const digit = glyphCore(img, c3[cells[0].i].rect, 1);

      const key = `${engineName}-${theme}-${armName}`;
      out[key] = {
        washA: a,
        unitPct: pct,
        rims,
        rimMin: Math.min(...rims.filter((x) => x !== null)),
        digit,
        selDL,
        unitDL,
        margin,
        g1: Math.min(...rims.filter((x) => x !== null)) >= 3.5,
        g3: (digit ?? 0) >= 4.5,
        g4: (margin ?? 0) >= 3.0,
      };
      console.log(
        `VERIFY ${key} a=${a} unit=${pct}% :: rim=[${rims.join(", ")}] digit=${digit} ` +
          `dL* sel=${selDL} unit=${unitDL} margin=${margin} :: G1=${out[key].g1} G3=${out[key].g3} G4=${out[key].g4}`,
      );
      await ctx.close();
    }
  }
  await browser.close();
}
bank("verify.json", out);
