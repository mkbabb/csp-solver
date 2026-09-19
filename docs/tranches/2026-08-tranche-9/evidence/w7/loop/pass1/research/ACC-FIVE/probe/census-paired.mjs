/**
 * census-paired.mjs — the pixel census, PAIRED.
 *
 * R2's `hue-census.probe.ts` re-runs cleanly under this lane's overlay, but the two arms
 * deal different boards (the URL carries no puzzle seed), so `chromaticPixels` moved
 * 16,499 -> 14,515 on chromium/dark/mid between two CONTROL runs alone. Comparing arms
 * across deals prices the deal, not the cure. This instrument therefore takes ONE page to
 * each state, censuses it, injects the overlay on that same page, lets a frame settle, and
 * censuses the identical pixels again. Every delta below is the cure and nothing else.
 *
 * The band, the chroma floor and the binning are R2's own, carried verbatim from
 * `hue-census.probe.ts:175-203`: OKLCH, C >= 0.012, 36 bins of 10 deg, warm band 40-115 deg.
 *
 *   node probe/census-paired.mjs      (writes readings/census-paired.json)
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const OVERLAY = `${HERE}/proto/five-crayons.css`;
const CHROMA_FLOOR = 0.012;
const BAND = [40, 115];

async function census(page, label) {
  const buf = await page.screenshot({ type: "png" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const total = info.width * info.height;
  const bins = new Array(36).fill(0);
  let chromatic = 0;
  let inBand = 0;
  let sumC = 0;
  for (let i = 0; i < total; i++) {
    const o = i * ch;
    const { C, h } = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (C >= CHROMA_FLOOR) {
      chromatic++;
      sumC += C;
      bins[Math.min(35, Math.floor(h / 10))]++;
      if (h >= BAND[0] && h <= BAND[1]) inBand++;
    }
  }
  return {
    label,
    pixels: total,
    chromaticPixels: chromatic,
    chromaticShare: +(chromatic / total).toFixed(6),
    meanChroma: +(chromatic ? sumC / chromatic : 0).toFixed(4),
    inFamilyPct: +(chromatic ? (100 * inBand) / chromatic : 0).toFixed(2),
    offFamilyPct: +(chromatic ? 100 - (100 * inBand) / chromatic : 0).toFixed(2),
    bins10deg: bins,
    violetBins: bins[28] + bins[29] + bins[30], // 280-310 deg
    blueBins: bins[24] + bins[25] + bins[26], // 240-270 deg
    goldBins: bins[6] + bins[7] + bins[8] + bins[9], // 60-100 deg
  };
}

const out = { band: BAND, chromaFloor: CHROMA_FLOOR, runs: [] };

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await b.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0);
    await page.waitForTimeout(900);

    const pair = async (label) => {
      const before = await census(page, `${label}/control`);
      const tag = await page.addStyleTag({ path: OVERLAY });
      await page.waitForTimeout(450);
      const after = await census(page, `${label}/overlay`);
      await page.evaluate((el) => el.remove(), tag);
      await page.waitForTimeout(250);
      return { label, before, after };
    };

    const states = [];
    states.push(await pair("rest"));

    const cell = page.locator(".sudoku-cell input:not([readonly])").first();
    await cell.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(450);
    states.push(await pair("focused"));

    for (let i = 0; i < 12; i++) {
      await page.keyboard.type("1");
      await page.keyboard.press("ArrowRight");
    }
    await page.waitForTimeout(800);
    states.push(await pair("mid-board"));

    out.runs.push({ engine, scheme, states });
    await ctx.close();
  }
  await b.close();
}

writeFileSync(`${HERE}/readings/census-paired.json`, JSON.stringify(out, null, 2));
console.log("engine    theme state      chromaticPx  off-family%  ->  off-family%   violetPx->  goldPx->");
for (const r of out.runs)
  for (const s of r.states)
    console.log(
      r.engine.padEnd(9),
      r.scheme.padEnd(5),
      s.label.padEnd(10),
      String(s.before.chromaticPixels).padStart(7),
      String(s.before.offFamilyPct).padStart(7),
      "->",
      String(s.after.offFamilyPct).padStart(7),
      "   violet",
      String(s.before.violetBins).padStart(6),
      "->",
      String(s.after.violetBins).padStart(6),
      "  gold",
      String(s.before.goldBins).padStart(6),
      "->",
      String(s.after.goldBins).padStart(6),
    );
