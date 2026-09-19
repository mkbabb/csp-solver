/** phone-bottom-tab.png, re-cut as a CROP of the region it proves: the board and the tab
 *  at its bottom edge (W2's landed mechanic), gauge at 50%, 393x699 dpr3. */
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT;
const browser = await chromium.launch();
const ctx = await browser.newContext({
  colorScheme: "light",
  reducedMotion: "reduce",
  viewport: { width: 393, height: 699 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto(`${BASE}/?size=3&difficulty=EASY`);
await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
await page.waitForTimeout(700);
const fill = () =>
  page.evaluate(() => {
    const el = document.querySelector('[role="progressbar"]');
    return el ? Number(el.getAttribute("aria-valuenow")) : null;
  });
for (let k = 0; k < 90; k++) {
  const v = await fill();
  if (v !== null && v >= 50) break;
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
  await page.waitForTimeout(30);
}
await page.evaluate(() => document.activeElement?.blur());
await page.waitForTimeout(800);

const board = await page.locator("svg.hand-drawn-grid").first().boundingBox();
const tab = await page
  .locator(".drawer-tab, .controls-tab, [class*='drawer-tab']")
  .first()
  .boundingBox()
  .catch(() => null);
const top = Math.max(0, Math.round(board.y - 14));
const bottom = Math.min(
  699,
  Math.round((tab ? tab.y + tab.height : board.y + board.height) + 16),
);
const buf = await page.screenshot({
  clip: { x: 0, y: top, width: 393, height: Math.max(120, bottom - top) },
  type: "png",
});
const out = await sharp(buf)
  .resize({ width: 393 })
  .png({ palette: true, quality: 82, effort: 9 })
  .toBuffer();
writeFileSync(`${OUT}/phone-bottom-tab.png`, out);
console.log("phone-bottom-tab", out.length, "B  fill", await fill(), "tab", !!tab);
await ctx.close();
await browser.close();
