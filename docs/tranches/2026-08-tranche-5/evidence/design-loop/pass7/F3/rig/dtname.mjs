/** L6-G3 — bank the dt-name shot the pass-6 LAND report cites, at the cell it cites.
 *  Captures the fold at 390x664 AND a crop of the reserved margin line, and records the
 *  two dt-name strings (margin line, tally aria-label) beside the pixels. The deal is
 *  random per load, so the STRINGS are reported with the shot rather than promised by it. */
import { chromium, webkit } from "playwright";
import fs from "node:fs";
const BASE = "http://127.0.0.1:4237";
const OUT = process.argv[2];
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };
const rows = [];
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const ctx = await b.newContext({ ...COARSE, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
  await page.waitForTimeout(900);
  const strings = await page.evaluate(() => {
    const t = (s) => document.querySelector(s);
    const marginEl = t(".margin-note-block") || t(".margin-note") || t("[class*='margin-note']");
    const tally = t("[aria-label^='difficulty']") || t(".difficulty-tally");
    return {
      marginSelector: marginEl?.className ?? null,
      marginLine: marginEl ? marginEl.textContent.replace(/\s+/g, " ").trim() : null,
      tallySelector: tally?.className ?? null,
      tallyAriaLabel: tally?.getAttribute("aria-label") ?? null,
      gradePhraseGone: !/singles only/i.test(document.body.innerText),
    };
  });
  await page.screenshot({ path: `${OUT}/shots/case-390x664-AFTER-${label}.png` });
  const box = await page.evaluate(() => {
    const el = document.querySelector(".margin-note-block") || document.querySelector("[class*='margin-note']");
    if (!el) return null; const r = el.getBoundingClientRect();
    return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(390, r.width + 16), height: r.height + 16 };
  });
  if (box && box.height > 2)
    await page.screenshot({ path: `${OUT}/shots/case-390x664-dtname-crop-${label}.png`, clip: box });
  rows.push({ engine: label, ...strings, cropBox: box });
  console.log(label, JSON.stringify(strings, null, 1));
  await b.close();
}
fs.writeFileSync(`${OUT}/logs/dtname-strings.json`, JSON.stringify(rows, null, 1));
