/**
 * PASS-5 F3 · foldref.mjs — WHICH BOX overflows the fold, and by how much.
 * Three numbers are in the record for one quantity (shipped comment 88.58; pass-4 registry
 * 90.58/89.98; this pass's ladder 86.58/85.98). They differ by REFERENT, not by build, and a
 * correction that does not name its referent just adds a fourth number. This prints every
 * candidate box at the shipped cap, 844x390, so the correction can name one.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
const [, , baseURL, engineName, outfile] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const browser = await engine.launch();
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: engineName !== "webkit", deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(500);
const out = await page.evaluate(() => {
  const round = (n) => (n == null ? null : Math.round(n * 100) / 100);
  const vh = window.innerHeight;
  const sels = [".board-cells", ".board-shell", ".board-wrapper", ".board-peek-host", ".board-margin"];
  const rows = {};
  for (const s of sels) {
    const el = document.querySelector(s);
    if (!el) { rows[s] = null; continue; }
    const r = el.getBoundingClientRect();
    rows[s] = { h: round(r.height), top: round(r.top + scrollY), bottom: round(r.bottom + scrollY), overflow: round(Math.max(0, r.bottom + scrollY - vh)) };
  }
  return { vh, rows };
});
await browser.close();
writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log(engineName, "vh=" + out.vh);
for (const [k, v] of Object.entries(out.rows)) console.log(" ", k.padEnd(20), v ? `h=${v.h}\tbottom=${v.bottom}\tfoldOverflow=${v.overflow}` : "ABSENT");
