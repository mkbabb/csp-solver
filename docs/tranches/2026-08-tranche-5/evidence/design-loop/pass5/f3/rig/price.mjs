/**
 * PASS-5 F3 · price.mjs — the trigger-(b) PRICE LIST.
 *
 * The lane does not elect anything here (F3's pass-5 order forbids self-re-scope). It measures
 * what each candidate structural move is WORTH at the case cell, so the adjudicator rules on
 * numbers instead of on adjectives. Every rung is injected as `!important` CSS on ONE built
 * artifact — same build, one variable — the ladder discipline pass 4 used for the landscape cap.
 *
 * Usage: node price.mjs <baseURL> <engine> <outfile>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const RUNGS = [
  { key: "0-shipped", css: "" },
  {
    key: "1-band-deleted",
    css: ".board-margin{display:none !important}",
    note: "mark 6 taken to zero — the last 21px reserved line struck",
  },
  {
    key: "2-masthead-deleted",
    css: "header,.app-masthead,.masthead{display:none !important}",
    note: "the landscape cure applied to portrait — chrome above the board struck",
  },
  {
    key: "3-playtools-struck",
    css: ".play-controls{display:none !important}",
    note: "the coarse undo/redo/hint row returned to keys only",
  },
  {
    key: "4-live-wells-struck",
    css: ".control-panel-wrap .tray-well:not(.new-game-zone){display:none !important}",
    note: "pencils + teacher's compartments removed from the card entirely",
  },
  {
    key: "5-controls-out-of-flow",
    css: ".mobile-board-width{position:fixed !important;bottom:0;left:0;right:0;visibility:hidden}",
    note: "THE SHEET: charter-f3's own centre — the card leaves flow at the closed detent",
  },
];

const measure = () => {
  const doc = document.documentElement;
  const card = document.querySelector(".mobile-board-width");
  const r = card?.getBoundingClientRect();
  return {
    docScrollH: doc.scrollHeight,
    vh: window.innerHeight,
    pageVh: Math.round((doc.scrollHeight / window.innerHeight) * 1000) / 1000,
    cardH: r ? Math.round(r.height * 100) / 100 : null,
  };
};

const [, , baseURL, engineName, outfile] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const browser = await engine.launch();
const out = {};
for (const rung of RUNGS) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    hasTouch: true,
    isMobile: engineName !== "webkit",
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  if (rung.css) await page.addStyleTag({ content: rung.css });
  await page.waitForTimeout(500);
  out[rung.key] = { ...(await page.evaluate(measure)), note: rung.note ?? "shipped tree" };
  await ctx.close();
}
await browser.close();
const base = out["0-shipped"].pageVh;
for (const k of Object.keys(out)) out[k].deltaVsShipped = Math.round((out[k].pageVh - base) * 1000) / 1000;
writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log(
  Object.entries(out)
    .map(([k, v]) => `${k}\tpageVh=${v.pageVh}\tdoc=${v.docScrollH}\tΔ=${v.deltaVsShipped}\t${v.note}`)
    .join("\n"),
);
