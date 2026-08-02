/**
 * PASS-5 F3 · dtname.mjs — WHERE, if anywhere, the hardest step's EXACT name is rendered.
 * Pass 4's retirement note claims the exact step "still names itself at every width, in the
 * tally's aria-label". This measures that claim instead of repeating it: it reads every
 * candidate surface and asks whether any of them contains a TECHNIQUE_NAME token.
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
const NAMES = ["naked single","hidden single","naked pair","naked triple","pointing","box-line","x-wing","inequality forcing","inequality chain"];
const [, , baseURL, outfile] = process.argv;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(`${baseURL}/?size=3&difficulty=MEDIUM`, { waitUntil: "load" });
await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(1500);
const out = await page.evaluate((NAMES) => {
  const tally = document.querySelector(".difficulty-tally");
  const margin = document.querySelector(".margin-note-ink");
  const visible = (el) => { if (!el) return false; const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && r.width > 1 && r.height > 1; };
  const bodyText = document.body.innerText.toLowerCase();
  const allLabels = [...document.querySelectorAll("[aria-label]")].map((e) => e.getAttribute("aria-label").toLowerCase());
  return {
    tallyAriaLabel: tally?.getAttribute("aria-label") ?? null,
    tallyHasDtName: !!document.querySelector(".dt-name"),
    marginInkText: margin?.textContent?.trim() ?? null,
    marginInkVisible: visible(margin),
    exactNameInVisibleText: NAMES.filter((n) => bodyText.includes(n)),
    exactNameInAnyAriaLabel: NAMES.filter((n) => allLabels.some((l) => l.includes(n))),
  };
}, NAMES);
await browser.close();
writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
