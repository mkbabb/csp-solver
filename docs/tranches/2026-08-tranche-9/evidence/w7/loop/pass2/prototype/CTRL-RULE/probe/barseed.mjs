// Which seed does the FOOT's rule want? The seven card rules read 3.437–3.53 at stroke 2; the
// foot's (seed 28) reads 2.394 in chromium at 390. Same component, same stroke, same ink, same
// width — so the variable left is the seed. Swap the `d` in place, seed by seed, and read.
import { createRequire } from "node:module";
const require = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
);
const { wobbleLine } = require("@mkbabb/pencil-boil");
const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;

const rl = (r, g, b) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [rl(...a), rl(...b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  isMobile: true,
  colorScheme: "light",
});
await ctx.addInitScript(() => {
  try {
    localStorage.clear();
    localStorage.setItem("sudoku-color-scheme", "light");
  } catch {}
});
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:4231/?size=3&difficulty=EASY", {
  waitUntil: "domcontentloaded",
});
await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await page.waitForTimeout(1200);
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(950);
}

async function read(sel) {
  const box = await page.evaluate((s) => {
    const el = document.querySelector(s);
    const r = el.getBoundingClientRect();
    return {
      x: Math.round(r.x),
      y: Math.round(r.y - 3),
      width: Math.round(r.width),
      height: Math.round(r.height + 6),
    };
  }, sel);
  const buf = await page.screenshot({ clip: box });
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = (x, y) => {
    const o = (y * info.width + x) * info.channels;
    return [data[o], data[o + 1], data[o + 2]];
  };
  let ground = px(0, 0),
    bl = -1;
  for (let x = 0; x < info.width; x++)
    for (let y = 0; y < info.height; y++) {
      const c = px(x, y),
        L = rl(...c);
      if (L > bl) {
        bl = L;
        ground = c;
      }
    }
  const cols = [];
  for (let x = 0; x < info.width; x++) {
    let best = 1;
    for (let y = 0; y < info.height; y++) best = Math.max(best, ratio(px(x, y), ground));
    cols.push(best);
  }
  return +Math.min(...cols).toFixed(3);
}

for (const seed of [28, 6, 10, 15, 16, 22, 23, 26, 36, 39, 40, 41, 43, 49, 50]) {
  const d = wobbleLine(0, 2.5, 300, 2.5, { roughness: 0.4, segments: 8, seed });
  await page.evaluate((dd) => {
    document.querySelector(".bar-rule path").setAttribute("d", dd);
  }, d);
  await page.waitForTimeout(90);
  console.log("bar seed", seed, "worstColumn", await read(".bar-rule"));
}
// the control: a card rule read the same way, same session
console.log("card rule[0] worstColumn", await read(".rp-rule"));
await browser.close();
