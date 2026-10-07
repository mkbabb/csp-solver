// frame-b23-8.mjs — T9-B23's lawful pair re-cut at the default's LOSING instant (pass 8, charter row 6).
// One arm per invocation (the lane owns one lane port), composed after: arm (c) HINGE vs arm (d) SHEET,
// one payload, one variable (VITE_INK_AT_FLIP), chromium · light→dark · 390×844 · coarse (hasTouch) ·
// DPR 2, a typed user digit 5 in r1c1, every animation and transition frozen at +T ms after the flip.
//   node frame-b23-8.mjs shot <name> <url> <T> <payload> <out.png>
//   node frame-b23-8.mjs compose <left.png> <right.png> <out.png>
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const sharp = require("sharp");
const [mode, ...a] = process.argv.slice(2);
if (mode === "shot") {
  const [name, base, T, P, out] = a;
  const b = await pw.chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, colorScheme: "light", reducedMotion: "no-preference" });
  const p = await ctx.newPage();
  await p.goto(`${base}/?game=sudoku&board=${P}`);
  await p.locator(".board-cells").first().waitFor();
  await p.locator(".boil-frame-bitmap").nth(3).waitFor({ state: "attached", timeout: 30000 });
  await p.waitForTimeout(1500);
  const givens = await p.locator('.board-cells [aria-label*="given clue"]').count();
  await p.locator('.board-cells [aria-label="Row 1, column 1, empty"]').tap();
  await p.keyboard.press("5");
  await p.waitForTimeout(800);
  await p.evaluate((T) => {
    new MutationObserver((_, obs) => {
      if (!document.documentElement.classList.contains("dark")) return;
      obs.disconnect();
      requestAnimationFrame(() => {
        for (const x of document.getAnimations()) { x.pause(); x.currentTime = T; }
        window.__frozen = document.getAnimations().length;
      });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }, +T);
  await p.locator(".sun-moon-toggle").tap();
  await p.waitForFunction(() => window.__frozen != null);
  await p.waitForTimeout(150);
  const read = await p.evaluate(() => {
    const r = document.querySelector(".board-wrapper").getBoundingClientRect();
    const u = document.querySelector('.board-cells [aria-label^="Row 1, column 1"] .glyph-svg path');
    const paper = getComputedStyle(document.querySelector(".board-wrapper")).backgroundColor;
    return { x: r.left, y: r.top, w: r.width, user: u ? getComputedStyle(u).stroke : null, paper, label: document.querySelector('.board-cells [aria-label^="Row 1, column 1"]')?.getAttribute("aria-label") };
  });
  const clip = { x: Math.max(0, read.x - 12), y: Math.max(0, read.y - 12), width: read.w / 3 + 24, height: read.w / 3 + 24 };
  await p.screenshot({ clip, path: out });
  console.log(`SHOT ${name} T=${T} givens ${givens} frozen ${await p.evaluate(() => window.__frozen)} r1c1 "${read.label}" user-stroke ${read.user} paper ${read.paper}`);
  await b.close();
} else if (mode === "compose") {
  const [l, r, out] = a;
  const imgs = await Promise.all([l, r].map((f) => sharp(f).removeAlpha().png().toBuffer({ resolveWithObject: true })));
  const w = imgs[0].info.width, h = imgs[0].info.height, gap = 16;
  await sharp({ create: { width: w * 2 + gap, height: h, channels: 3, background: "#808080" } })
    .composite([{ input: imgs[0].data, left: 0, top: 0 }, { input: imgs[1].data, left: w + gap, top: 0 }])
    .png({ palette: true, quality: 80 }).toFile(out);
  console.log(`COMPOSED ${out} ${w * 2 + gap}x${h}`);
}
