/**
 * solved-frame-paint.mjs — does the solved frame's gold actually PAINT?
 *
 * `handoff.mjs` read `.grid-line { stroke: rgb(201,154,46) }` at the win and banked a crop
 * in which the frame is still graphite. Computed style is not paint: `HandDrawnGrid` BAKES
 * the grid to `<image>` bitmaps and puts the live vector stack to `display: none`
 * (`.boil-frame-layer.baked-hidden`, HandDrawnGrid.vue:560-564), so a rule that recolours
 * `.grid-line` can land on a node nobody can see.
 *
 * This decides it on the bytes: sample the actual frame pixels before and after the win,
 * both themes, and report whether the bake was live at the time.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";
import { rgbToOklch, hueDist } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const OVERLAY = `${HERE}/proto/five-crayons.css`;

/** the most chromatic pixel in a band, and how many pixels are chromatic at all */
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
      ? { rgb: best.rgb, L: +best.L.toFixed(3), C: +best.C.toFixed(3), h: +best.h.toFixed(1) }
      : null,
  };
}

const browser = await chromium.launch();
const out = {};
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  // addInitScript, NOT addStyleTag: the first run of this probe lost the overlay partway
  // through the dark arm (the band went back to hue 294.1 = the incumbent violet), which
  // is what a page reload does to an injected <style>. This survives one.
  const css = readFileSync(OVERLAY, "utf8");
  await page.addInitScript((text) => {
    const put = () => {
      if (document.getElementById("acc-five-overlay")) return;
      const el = document.createElement("style");
      el.id = "acc-five-overlay";
      el.textContent = text;
      (document.head || document.documentElement).appendChild(el);
    };
    put();
    document.addEventListener("DOMContentLoaded", put);
  }, css);
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(700);

  const grid = page.locator("svg.hand-drawn-grid").first();
  // a thin band across the board's LEFT frame edge only — the frame, not the digits
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
    page.evaluate(() => ({
      bakedHidden: document.querySelectorAll(".boil-frame-layer.baked-hidden").length,
      bitmaps: document.querySelectorAll(".boil-frame-bitmap").length,
      liveFrameLines: document.querySelectorAll(".grid-line").length,
      solveSuccess: !!document.querySelector(".solve-success"),
      overlayPresent: !!document.getElementById("acc-five-overlay"),
    }));

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

  await page.locator('[aria-label="Solve puzzle"]').first().click({ timeout: 8000 }).catch(() => {});
  const samples = [];
  for (const t of [900, 1800, 2700, 3600, 5000]) {
    await page.waitForTimeout(t - (samples.length ? [900, 1800, 2700, 3600, 5000][samples.length - 1] : 0));
    samples.push({ atMs: t, bake: await bakeState(), band: await bandCensus(await band()) });
  }
  out[scheme] = { before, samples };
  await ctx.close();
}
await browser.close();
writeFileSync(`${HERE}/readings/solved-frame-paint.json`, JSON.stringify(out, null, 2));
for (const [s, v] of Object.entries(out)) {
  console.log("==", s, "before:", JSON.stringify(v.before.bake), JSON.stringify(v.before.band));
  for (const x of v.samples)
    console.log("   ", String(x.atMs).padStart(5), JSON.stringify(x.bake), JSON.stringify(x.band));
}
