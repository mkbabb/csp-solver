/**
 * PASS-5 F3 · bandcrop.mjs — the DELTA crops for mark 6's band, before and after the T′ collapse.
 * The expected delta is ZERO (render identity is the collapse's safety property), so these two
 * crops are the visual arm of `domsnap`'s numeric one: if they differ, the identity claim is dead.
 * Crop = the board's last rows + the reserved strip + the top of the ticket, at the case cell.
 */
import { chromium } from "playwright";
const [, , baseURL, tag] = process.argv;
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
await p.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
await p.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 }).catch(() => {});
await p.waitForTimeout(800);
const box = await p.evaluate(() => {
  const m = document.querySelector(".board-margin").getBoundingClientRect();
  return { x: 0, y: Math.max(0, Math.round(m.top - 60)), width: 390, height: 200 };
});
await p.screenshot({ path: `shots/band-${tag}-390x664.png`, clip: box });
console.log(tag, JSON.stringify(box));
await b.close();
