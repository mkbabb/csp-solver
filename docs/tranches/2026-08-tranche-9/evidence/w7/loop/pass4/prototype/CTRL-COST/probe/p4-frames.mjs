#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — THE FOUR CITED CROPS, each a REPLACEMENT (chair §6.11) and each
// taken with the POINTER CLASS its caption names. Pass 3's 390 crop was summoned by a MOUSE
// inside a `hasTouch` context and showed a note that surface could not paint; these two phone
// frames are TAPPED.
// Usage: node p4-frames.mjs <base> <engine> <WxH> <theme> <touch|mouse> <out.png>
import { chromium, webkit } from "playwright";
const [base, engine, vp, theme, pointer, out] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const touch = pointer === "touch";
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: touch,
  deviceScaleFactor: 2,
  colorScheme: theme,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
await page.goto(`${base}/sudoku?board=1&size=3&difficulty=EASY`);
await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000);
const blankIdx = await page.evaluate(() =>
  [...document.querySelectorAll('[role="gridcell"] input')].findIndex(
    (i) => !i.value && !i.readOnly && !i.disabled,
  ),
);
const cell = page.locator('[role="gridcell"] input').nth(blankIdx);
if (touch) await cell.tap();
else await cell.click();
await page.keyboard.type("5");
await page.waitForTimeout(300);
if (w < 1024) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    await (touch ? tab.tap() : tab.click());
    await page.waitForTimeout(1100);
  }
}
const verb = page.locator(".deal-face .act-verb");
await verb.scrollIntoViewIfNeeded();
await page.waitForTimeout(250);
if (touch) await verb.tap();
else await verb.click();
await page.waitForTimeout(450);
// The crop: the band, not the page — the head with its berth and the two faces under it.
const band = page
  .locator(".cost-band")
  .filter({ has: page.locator(".deal-face") })
  .first();
await band.screenshot({ path: out });
console.log(`${out}  ${engine} ${vp} ${theme} ${pointer}`);
await browser.close();
