/**
 * handoff-ablate.mjs — the CRITIC's re-run of ACC-FIVE's centre gate, with an ABLATION.
 *
 * The prototype's gate reads: ">0 chromatic px in the 22x246 frame band AFTER the win, median
 * hue within 5 deg of crayon-gold, both themes, five samples". This probe runs that same
 * census (band, floor, sample times verbatim from the prototype's handoff-paint.mjs) TWICE:
 *
 *   live     — the prototype as written
 *   ablated  — one injected rule that KILLS the win's hand-off:
 *              .solve-success .progress-trace { stroke: var(--color-progress-ink) !important }
 *              i.e. the trace stays gold INK and never lifts to the wax.
 *
 * If the gate greens under the ablation, the gate does not measure the hand-off; it measures
 * only that the trace is gold at all, which is already true before the win.
 *
 * It also records the MEDIAN LIGHTNESS of the chromatic pixels, the quantity that actually
 * separates ink from wax (the prototype's own reading: L 0.588 -> 0.692 light).
 *
 *   node probe/handoff-ablate.mjs        (BASE=... OUT=...)
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.env.OUT || ".";
const GOLD = { light: 83.7, dark: 95.2 };
const KIN_DEG = 5;
const ABLATE = `.solve-success .progress-trace { stroke: var(--color-progress-ink) !important; }`;

async function bandCensus(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let chromatic = 0;
  const hues = [];
  const Ls = [];
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * ch;
    const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (c.C >= 0.05) {
      chromatic++;
      hues.push(c.h);
      Ls.push(c.L);
    }
  }
  hues.sort((a, b) => a - b);
  Ls.sort((a, b) => a - b);
  const med = (a) => (a.length ? +a[Math.floor(a.length / 2)].toFixed(3) : null);
  return {
    px: info.width * info.height,
    chromaticPx: chromatic,
    medianHue: hues.length ? +hues[Math.floor(hues.length / 2)].toFixed(1) : null,
    medianL: med(Ls),
  };
}

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    for (const arm of ["live", "ablated"]) {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "reduce",
        viewport: { width: 1280, height: 800 },
      });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?size=3&difficulty=EASY`);
      await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
      if (arm === "ablated")
        await page.addStyleTag({ content: ABLATE });
      await page.waitForTimeout(700);

      const grid = page.locator("svg.hand-drawn-grid").first();
      const band = async () => {
        const b = await grid.boundingBox();
        return page.screenshot({
          clip: {
            x: Math.max(0, Math.round(b.x - 8)),
            y: Math.round(b.y + b.height * 0.3),
            width: 22,
            height: Math.round(b.height * 0.4),
          },
          type: "png",
        });
      };
      const bake = () =>
        page.evaluate(() => {
          const t = document.querySelector(".progress-pose.is-active .progress-trace");
          return {
            solveSuccess: !!document.querySelector(".solve-success"),
            traceStroke: t ? getComputedStyle(t).stroke : null,
          };
        });

      const n = await page.evaluate(
        () =>
          Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
            (i) => !i.readOnly && !i.value,
          ).length,
      );
      for (let k = 0; k < n + 4; k++) {
        const done = await page.evaluate(() => {
          const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
            (i) => !i.readOnly,
          );
          const e = ins.findIndex((i) => !i.value);
          if (e < 0) return true;
          ins[e].focus();
          return false;
        });
        if (done) break;
        await page.keyboard.type("1");
        await page.waitForTimeout(35);
      }
      await page.waitForTimeout(900);
      const before = { bake: await bake(), band: await bandCensus(await band()) };

      await page
        .locator('[aria-label="Solve puzzle"]')
        .first()
        .click({ timeout: 8000 })
        .catch(() => {});
      const times = [900, 1800, 2700, 3600, 5000];
      const samples = [];
      for (let i = 0; i < times.length; i++) {
        await page.waitForTimeout(times[i] - (i ? times[i - 1] : 0));
        const bk = await bake();
        const b = await bandCensus(await band());
        const dh = b.medianHue == null ? null : Math.abs(b.medianHue - GOLD[scheme]);
        samples.push({
          atMs: times[i],
          solveSuccess: bk.solveSuccess,
          traceStroke: bk.traceStroke,
          band: b,
          dHueToGold: dh == null ? null : +Math.min(dh, 360 - dh).toFixed(1),
          gatePasses:
            b.chromaticPx > 0 && dh != null && Math.min(dh, 360 - dh) <= KIN_DEG,
        });
      }
      out[`${engine}/${scheme}/${arm}`] = { before, samples };
      await ctx.close();
      console.log(
        "==",
        engine,
        scheme,
        arm,
        "| before px",
        before.band.chromaticPx,
        "h",
        before.band.medianHue,
        "L",
        before.band.medianL,
        "stroke",
        before.bake.traceStroke,
      );
      for (const s of samples)
        console.log(
          "   ",
          String(s.atMs).padStart(5),
          "px",
          String(s.band.chromaticPx).padStart(5),
          "h",
          String(s.band.medianHue).padStart(6),
          "L",
          String(s.band.medianL).padStart(6),
          "dGold",
          String(s.dHueToGold).padStart(5),
          s.gatePasses ? "GATE-GREEN" : "GATE-RED",
          "| solve",
          s.solveSuccess,
          "stroke",
          s.traceStroke,
        );
    }
  }
  await browser.close();
}
writeFileSync(`${OUT}/handoff-ablate.json`, JSON.stringify(out, null, 2));
