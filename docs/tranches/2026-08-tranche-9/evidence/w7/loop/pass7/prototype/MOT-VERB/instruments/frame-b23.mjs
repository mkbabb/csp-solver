// frame-b23.mjs — T9-B23's lawful pair: arm (c) HINGE vs arm (d) SHEET, one payload, one variable
// (VITE_INK_AT_FLIP), chromium · light→dark · 390×844 · coarse (hasTouch) · DPR 2, a typed user digit
// in the crop, every animation and transition frozen at +T ms after the flip.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright"); const sharp = require("sharp");
const [out, T = "100", P] = process.argv.slice(2);
const arms = [["hinge", "http://127.0.0.1:4247"], ["sheet", "http://127.0.0.1:4246"]];
const b = await pw.chromium.launch(); const shots = [];
for (const [name, base] of arms) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, colorScheme: "light", reducedMotion: "no-preference" });
  const p = await ctx.newPage(); await p.goto(`${base}/?game=sudoku&board=${P}`);
  await p.locator(".board-cells").first().waitFor(); await p.waitForTimeout(4000);
  const givens = await p.locator('.board-cells [aria-label*="given clue"]').count();
  await p.locator('.board-cells [aria-label="Row 1, column 1, empty"]').tap(); await p.keyboard.press("5"); await p.waitForTimeout(800);
  // arm the freeze: the first animation frame after the flip, pause everything at +T of its own clock
  await p.evaluate((T) => {
    new MutationObserver((_, obs) => { if (!document.documentElement.classList.contains("dark")) return; obs.disconnect();
      requestAnimationFrame(() => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = T; } window.__frozen = document.getAnimations().length; });
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  }, +T);
  await p.locator(".sun-moon-toggle").tap();
  await p.waitForFunction(() => window.__frozen != null);
  await p.waitForTimeout(150);
  const box = await p.evaluate(() => { const r = document.querySelector(".board-wrapper").getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width }; });
  const clip = { x: Math.max(0, box.x - 12), y: Math.max(0, box.y - 12), width: box.w / 3 + 24, height: box.w / 3 + 24 };
  const frozen = await p.evaluate(() => window.__frozen);
  shots.push({ name, buf: await p.screenshot({ clip }), givens, frozen });
  await ctx.close();
}
await b.close();
const imgs = await Promise.all(shots.map((s) => sharp(s.buf).png().toBuffer({ resolveWithObject: true })));
const w = imgs[0].info.width, h = imgs[0].info.height, gap = 16;
await sharp({ create: { width: w * 2 + gap, height: h, channels: 3, background: "#808080" } })
  .composite([{ input: imgs[0].data, left: 0, top: 0 }, { input: imgs[1].data, left: w + gap, top: 0 }])
  .png({ palette: true, quality: 80 }).toFile(out);
console.log(`FRAME ${out} ${w * 2 + gap}x${h} · ${shots.map((s) => `${s.name}: givens ${s.givens}, frozen ${s.frozen}`).join(" · ")}`);
