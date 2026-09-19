/**
 * handoff-paint.mjs — THE FAMILY'S CENTRE, decided on the bytes.
 *
 * The research lane's `solved-frame-paint.mjs`, re-pointed at a tree that CARRIES the cure
 * (no overlay: the prototype is the product), and run in BOTH engines.
 *
 * The question is one sentence: after the win, does the board's frame band carry gold that a
 * person can see? At HEAD it carries zero chromatic pixels through 5 s in both themes — the
 * `.solve-success .grid-line` recolour lands on the live vector stack, which is display:none
 * under the grid bake, while the trace fades to opacity 0. The cure keeps the trace and lifts
 * its stroke to the wax, so the gold the player sees is the line they drew themselves.
 *
 * Band, chroma floor, sample times and bake-state read are the research lane's, verbatim.
 *
 *   node probe/handoff-paint.mjs        (writes readings/handoff-paint.json)
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT;
/** crayon-gold's hue per theme — the claim is "within 5 deg of it". */
const GOLD = { light: 83.7, dark: 95.2 };
const KIN_DEG = 5;

async function bandCensus(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let best = null;
  let chromatic = 0;
  const hues = [];
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * ch;
    const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (c.C >= 0.05) {
      chromatic++;
      hues.push(c.h);
      if (!best || c.C > best.C) best = { rgb: [data[o], data[o + 1], data[o + 2]], ...c };
    }
  }
  hues.sort((a, b) => a - b);
  return {
    px: info.width * info.height,
    chromaticPx: chromatic,
    medianHue: hues.length ? +hues[Math.floor(hues.length / 2)].toFixed(1) : null,
    mostChromatic: best
      ? {
          rgb: best.rgb,
          L: +best.L.toFixed(3),
          C: +best.C.toFixed(3),
          h: +best.h.toFixed(1),
        }
      : null,
  };
}

const out = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
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
    const bakeState = () =>
      page.evaluate(() => {
        const t = document.querySelector(".progress-pose.is-active .progress-trace");
        return {
          bakedHidden: document.querySelectorAll(".boil-frame-layer.baked-hidden").length,
          bitmaps: document.querySelectorAll(".boil-frame-bitmap").length,
          liveFrameLines: document.querySelectorAll(".grid-line").length,
          solveSuccess: !!document.querySelector(".solve-success"),
          traceNodes: document.querySelectorAll(".progress-trace").length,
          traceStroke: t ? getComputedStyle(t).stroke : null,
          traceOpacity: t ? getComputedStyle(t.parentElement).opacity : null,
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
    const before = { bake: await bakeState(), band: await bandCensus(await band()) };

    await page
      .locator('[aria-label="Solve puzzle"]')
      .first()
      .click({ timeout: 8000 })
      .catch(() => {});
    const times = [900, 1800, 2700, 3600, 5000];
    const samples = [];
    for (let i = 0; i < times.length; i++) {
      await page.waitForTimeout(times[i] - (i ? times[i - 1] : 0));
      const bake = await bakeState();
      const b = await bandCensus(await band());
      const dh = b.medianHue == null ? null : Math.abs(b.medianHue - GOLD[scheme]);
      samples.push({
        atMs: times[i],
        bake,
        band: b,
        dHueToGold: dh == null ? null : +Math.min(dh, 360 - dh).toFixed(1),
        kin: dh == null ? false : Math.min(dh, 360 - dh) <= KIN_DEG,
      });
    }
    out[`${engine}/${scheme}`] = { before, samples };
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/handoff-paint.json`, JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(out)) {
  console.log(
    "==",
    k,
    "before:",
    v.before.band.chromaticPx,
    "px h",
    v.before.band.medianHue,
    "| trace",
    v.before.bake.traceStroke,
  );
  for (const s of v.samples)
    console.log(
      "   ",
      String(s.atMs).padStart(5),
      "chromaticPx",
      String(s.band.chromaticPx).padStart(5),
      "medianHue",
      String(s.band.medianHue).padStart(6),
      "dGold",
      String(s.dHueToGold).padStart(5),
      s.kin ? "KIN" : "off",
      "| solve",
      s.bake.solveSuccess,
      "stroke",
      s.bake.traceStroke,
      "op",
      s.bake.traceOpacity,
    );
}
