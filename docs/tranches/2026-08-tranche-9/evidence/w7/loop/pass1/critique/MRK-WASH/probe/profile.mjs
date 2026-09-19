/**
 * MRK-WASH pass-1 CRITIQUE — the rim as a PROFILE, and the digit re-read independently.
 *
 * PART 1. The lane's G-WASH-1 reports the median of the 2% most-changed pixels. On a hairline
 * whose peak pixel sits at alpha 0.95 that estimator returns ~3.9 at ANY width, so it cannot
 * fail. The honest question is HOW MANY CSS PIXELS of the mark actually reach 3:1 against the
 * adjacent ground. This walks a scanline straight through the left rim and prints the per-pixel
 * ratio, then counts the pixels at or above 3.0.
 *
 * PART 2. The digit through the wash, read on a cell the probe TYPES INTO, at the shipped 0.08
 * and at the spec's 0.12, by two independent estimators (eroded glyph core; darkest-decile).
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:4241";
const OUT = new URL("../logs/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};
const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];

const ARMS = {
  "A-PROTO-stroke-rim3-o95": null,
  "B-HEAD-normal-ring7-o90": `paint-order: normal; stroke-width: 7; stroke-opacity: 0.9;`,
  "C-ABLATE-normal-ring7-o95": `paint-order: normal; stroke-width: 7; stroke-opacity: 0.95;`,
};
const armCss = (d) =>
  d ? `.game-cell:has(input:focus-visible):not(#nope):not(#nope) .cell-ghost-path { ${d} fill-opacity: 0.08; }` : "";

async function decode(buf) {
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
const at = (img, x, y) => {
  const i = (y * img.w + x) * img.ch;
  return [img.data[i], img.data[i + 1], img.data[i + 2]];
};

/** Erode the ink set inside the cell's inner box; ratio of the surviving core to the ground. */
function glyphCore(img, rect, inset = 0.16) {
  const x0 = Math.round(rect.x + rect.width * inset),
    x1 = Math.round(rect.x + rect.width * (1 - inset));
  const y0 = Math.round(rect.y + rect.height * inset),
    y1 = Math.round(rect.y + rect.height * (1 - inset));
  const W = x1 - x0,
    H = y1 - y0;
  const L = new Float64Array(W * H),
    px = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const p = at(img, x + x0, y + y0);
      px.push(p);
      L[y * W + x] = lstar(p);
    }
  const s = [...L].sort((a, b) => a - b);
  const lo = s[Math.floor(s.length * 0.02)],
    hi = s[Math.floor(s.length * 0.98)];
  if (hi - lo < 8) return null;
  const mid = (lo + hi) / 2;
  const ink = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L[y * W + x] < mid;
  const core = [], ground = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (L[y * W + x] < mid) {
        if (ink(x - 1, y) && ink(x + 1, y) && ink(x, y - 1) && ink(x, y + 1)) core.push(px[y * W + x]);
      } else ground.push(px[y * W + x]);
    }
  if (core.length < 12 || !ground.length) return null;
  const darkDecile = [...core]
    .map((p) => [lum(p), p])
    .sort((a, b) => a[0] - b[0])
    .slice(0, Math.max(1, Math.floor(core.length * 0.5)))
    .map((t) => t[1]);
  return {
    coreRatio: ratio(medPx(core), medPx(ground)),
    darkHalfRatio: ratio(medPx(darkDecile), medPx(ground)),
    corePx: core.length,
  };
}

const results = {};
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
    const key = `${engineName}-${theme}`;
    results[key] = { profiles: {}, digit: {} };

    const boot = async () => {
      await page.goto(`${BASE}/?size=3&difficulty=EASY`);
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
      await page.waitForTimeout(1400);
    };
    const census = () =>
      page.evaluate(() =>
        Array.from(document.querySelectorAll(".game-cell")).map((c, i) => {
          const r = c.getBoundingClientRect();
          return {
            i,
            empty: !c.querySelector("input")?.value,
            peer: !!c.querySelector(".cell-peer"),
            because: !!c.querySelector(".cell-because"),
            focused: !!c.querySelector("input:focus-visible"),
            rect: { x: r.x, y: r.y, width: r.width, height: r.height },
          };
        }),
      );
    const focusCell = (i) =>
      page.evaluate((k) => document.querySelectorAll(".game-cell input")[k]?.focus(), i);
    const park = () =>
      page.evaluate(() => document.querySelector(".drawer-tab, .icon-btn, button")?.focus());

    // ── PART 1: the profile, per arm ────────────────────────────────────────
    for (const [arm, decls] of Object.entries(ARMS)) {
      await boot();
      if (decls) await page.addStyleTag({ content: armCss(decls) });
      await page.waitForTimeout(200);
      const c0 = await census();
      const sel = c0.filter((c) => c.empty && c.i > 20 && c.i < 60)[1];
      await park();
      await page.waitForTimeout(260);
      const off = await decode(await page.screenshot({ type: "png" }));
      await focusCell(sel.i);
      await page.waitForTimeout(320);
      const on = await decode(await page.screenshot({ type: "png" }));
      const c2 = await census();
      const neutral = c2.find((c) => !c.peer && c.empty && !c.focused && !c.because);
      const npx = [];
      const nx = Math.round(neutral.rect.x + neutral.rect.width * 0.3);
      const ny = Math.round(neutral.rect.y + neutral.rect.height * 0.3);
      for (let y = ny; y < ny + 14; y++) for (let x = nx; x < nx + 14; x++) npx.push(at(on, x, y));
      const paper = medPx(npx);

      // three scanlines through the LEFT rim, at 35/50/65% of the cell's height
      const lines = [];
      for (const f of [0.35, 0.5, 0.65]) {
        const y = Math.round(sel.rect.y + sel.rect.height * f);
        const xs = [];
        for (let x = Math.round(sel.rect.x - 5); x <= Math.round(sel.rect.x + 8); x++)
          xs.push({ dx: x - Math.round(sel.rect.x), r: ratio(at(on, x, y), paper) });
        lines.push(xs);
      }
      const best = lines.map((l) => Math.max(...l.map((p) => p.r)));
      const over3 = lines.map((l) => l.filter((p) => p.r >= 3.0).length);
      results[key].profiles[arm] = {
        paperL: Math.round(lstar(paper) * 100) / 100,
        peakRatio: Math.max(...best),
        peakPerLine: best,
        cssPxAtOrAbove3: over3,
        medianCssPxAbove3: med(over3),
        profile: lines[1].map((p) => `${p.dx}:${p.r}`).join(" "),
      };
      console.log(
        `PROFILE ${key} ${arm.padEnd(26)} peak=${Math.max(...best)}  px>=3:1 per line=[${over3.join(",")}]`,
      );
    }

    // ── PART 2: the digit, typed, at 0.08 and 0.12 ──────────────────────────
    for (const a of [0.08, 0.1, 0.12]) {
      await boot();
      await page.addStyleTag({
        content: `.game-cell:has(input:focus-visible):not(#nope):not(#nope) .cell-ghost-path { --wash-a: ${a}; fill-opacity: ${a}; }`,
      });
      await page.waitForTimeout(200);
      const c0 = await census();
      const sel = c0.filter((c) => c.empty && c.i > 20 && c.i < 60)[1];
      await focusCell(sel.i);
      await page.waitForTimeout(200);
      await page.keyboard.press("5");
      await page.waitForTimeout(600);
      const shot = await decode(await page.screenshot({ type: "png" }));
      const c2 = await census();
      const g = glyphCore(shot, c2[sel.i].rect);
      results[key].digit[a] = g;
      console.log(`DIGIT   ${key} a=${a}  core=${g?.coreRatio}  darkHalf=${g?.darkHalfRatio}  px=${g?.corePx}`);
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT + "profile.json", JSON.stringify(results, null, 2));
console.log("\nbanked -> logs/profile.json");
