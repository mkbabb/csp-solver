// flip-painted.mjs (MOT-VERB pass-7 critic): the ink at the flip read from PAINTED bytes. Every
// animation/transition frozen at +T ms of the flip (the lane's freeze), the cell photographed, the
// ink = mean of the 8 % of cell pixels farthest in luminance from the cell's median (paper), WCAG ratio.
// node flip-painted.mjs <engine> <label=url>... ; env P = ?board payload
import { createRequire } from "node:module"; import os from "node:os";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright"); const sharp = require("sharp");
const [engine, ...arms] = process.argv.slice(2); const P = process.env.P;
const Ts = (process.env.TS ?? "60,130,200,300").split(",").map(Number);
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Y = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function cellStat(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ys = []; for (let i = 0; i < data.length; i += info.channels) ys.push(Y(data[i], data[i + 1], data[i + 2]));
  const sorted = [...ys].sort((a, b) => a - b); const paper = sorted[Math.floor(sorted.length / 2)];
  const far = ys.map((y) => [Math.abs(y - paper), y]).sort((a, b) => b[0] - a[0]).slice(0, Math.max(40, Math.floor(ys.length * 0.08)));
  const ink = far.reduce((s, [, y]) => s + y, 0) / far.length;
  return { ratio: ratio(ink, paper), n: far.length };
}
const b = await pw[engine].launch();
for (const arm of arms) {
  const [label, base] = arm.split("=");
  for (const [from, T] of Ts.flatMap((t) => [["light", t], ["dark", t]])) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, colorScheme: from, reducedMotion: "no-preference" });
    const p = await ctx.newPage(); await p.goto(`${base}/?game=sudoku&board=${P}`);
    await p.locator(".board-cells").first().waitFor(); await p.waitForTimeout(4500);
    const givens = await p.locator('.board-cells [aria-label*="given clue"]').count();
    await p.locator('.board-cells [aria-label="Row 1, column 1, empty"]').tap(); await p.keyboard.press("5"); await p.waitForTimeout(800);
    const toDark = from === "light";
    await p.evaluate(([T, toDark]) => {
      new MutationObserver((_, obs) => { if (document.documentElement.classList.contains("dark") !== toDark) return; obs.disconnect();
        requestAnimationFrame(() => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = T; } window.__frozen = document.getAnimations().length; });
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    }, [T, toDark]);
    await p.locator(".sun-moon-toggle").tap();
    await p.waitForFunction(() => window.__frozen != null); await p.waitForTimeout(150);
    const rects = await p.evaluate(() => ["Row 1, column 1", "Row 1, column 2", "Row 1, column 3"].map((l) => { const e = document.querySelector(`.board-cells [aria-label^="${l}"]`); const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, l: e.getAttribute("aria-label") }; }));
    const stats = [];
    for (const r of rects) { const i = r.w * 0.12; stats.push(await cellStat(await p.screenshot({ clip: { x: r.x + i, y: r.y + i, width: r.w - 2 * i, height: r.h - 2 * i } }))); }
    console.log(`PAINTED ${engine} ${label} ${from}->${toDark ? "dark" : "light"} T+${T}: user r1c1 ${stats[0].ratio.toFixed(2)} · given r1c2 ${stats[1].ratio.toFixed(2)} · given r1c3 ${stats[2].ratio.toFixed(2)} · givens ${givens} · frozen ${await p.evaluate(() => window.__frozen)} · load ${os.loadavg()[0].toFixed(1)}`);
    await ctx.close();
  }
}
await b.close();
