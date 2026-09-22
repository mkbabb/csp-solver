#!/usr/bin/env node
/** G8 — r0's OWN hue census, at r0's OWN floor and subject, with ONLY the anchors substituted.
 *
 * r0's instrument is `loop/r0/r2-accent-family/probe/hue-census.probe.ts` and it is the chair's:
 * NOT edited. This is the MOVED row, proposed as a diff (`r0-hue-census.anchors.diff` beside
 * this file) and run here with its OUT re-pointed. Everything r0 fixes is held fixed —
 * `CHROMA_FLOOR = 0.012`, the SOLO board `?size=3&difficulty=EASY`, 1280×800, the rest /
 * cell-focused / mid-board poses, the whole-viewport screenshot as the subject — and the ONLY
 * substitution is the anchor set: r0's FIVE crayons, and the SIX the ruling declares.
 *
 * Pass 3's G8 number (76.76 % light / 75.18 % dark) was NOT this instrument: it ran at C ≥ 0.05
 * over a different subject, and its own moved-anchor control shifted the share by 0.39 points,
 * which is how the lane knew it was blind. This run replaces it. Both arms (prototype and the
 * `74a2b5d9` HEAD control) are read the same way in the same session.
 *
 * usage: BASE=http://127.0.0.1:4237 LABEL=prototype node r0-hue-census.MOVED.mjs <out.json>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, hueDist } from "./oklch.COPY.mjs";

const { chromium, webkit } = pw;
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const LABEL = process.env.LABEL || "prototype";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: BASE=… node r0-hue-census.MOVED.mjs <out.json>");

/** r0's floor, verbatim. The warm paper IS chromatic here, on purpose (r0's own comment). */
const CHROMA_FLOOR = 0.012;
const KIN_DEG = 5;

/** r0's five anchors (hue-census.probe.ts's `anchors` map), and the ruling's sixth. */
const FIVE = {
  "crayon-green": "#2dc653",
  "crayon-orange": "#f4a236",
  "crayon-rose": "#e8315b",
  "crayon-blue": "#4a90d9",
  "crayon-gold": "#c99a2e",
};
const SIXTH = { "answer-violet": "#7c3aed" };

const hueOf = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return rgbToOklch((n >> 16) & 255, (n >> 8) & 255, n & 255).h;
};
const HUES5 = Object.values(FIVE).map(hueOf);
const HUES6 = [...HUES5, ...Object.values(SIXTH).map(hueOf)];
/** The negative control: the sixth anchor moved 6° off its ink. */
const HUES6_MOVED = [...HUES5, hueOf(SIXTH["answer-violet"]) + 6];

async function census(page) {
  const buf = await page.screenshot({ type: "png" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const total = info.width * info.height;
  let chromatic = 0;
  let off5 = 0;
  let off6 = 0;
  let off6moved = 0;
  const bins = new Array(36).fill(0);
  for (let i = 0; i < total; i++) {
    const o = i * ch;
    const { C, h } = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (C < CHROMA_FLOOR) continue;
    chromatic++;
    bins[Math.min(35, Math.floor(h / 10))]++;
    if (!HUES5.some((a) => hueDist(h, a) <= KIN_DEG)) off5++;
    if (!HUES6.some((a) => hueDist(h, a) <= KIN_DEG)) off6++;
    if (!HUES6_MOVED.some((a) => hueDist(h, a) <= KIN_DEG)) off6moved++;
  }
  const top = bins
    .map((n, i) => ({ bin: `${i * 10}-${i * 10 + 10}`, share: +((n / chromatic) * 100).toFixed(2) }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 5);
  return {
    pixels: total,
    chromaticPixels: chromatic,
    chromaticSharePct: +((chromatic / total) * 100).toFixed(2),
    offAnchor5Pct: +((off5 / chromatic) * 100).toFixed(2),
    offAnchor6Pct: +((off6 / chromatic) * 100).toFixed(2),
    offAnchor6MovedPct: +((off6moved / chromatic) * 100).toFixed(2),
    topBins: top,
  };
}

const rows = {
  meta: { base: BASE, label: LABEL, control: "74a2b5d9", CHROMA_FLOOR, KIN_DEG, anchors5: HUES5.map((h) => +h.toFixed(1)), anchors6: HUES6.map((h) => +h.toFixed(1)) },
  cells: {},
};

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const scheme of ["light", "dark"]) {
    const R = (rows.cells[`${eng}/${scheme}`] = {});
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 });
    await page.waitForTimeout(900);
    R.rest = await census(page);

    const cell = page.locator(".sudoku-cell input:not([readonly])").first();
    await cell.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(450);
    R.cellFocused = await census(page);

    for (let i = 0; i < 12; i++) {
      await page.keyboard.type("1");
      await page.keyboard.press("ArrowRight");
    }
    await page.waitForTimeout(700);
    R.midBoard = await census(page);

    await ctx.close();
    console.error(`  done ${eng}/${scheme}`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);
