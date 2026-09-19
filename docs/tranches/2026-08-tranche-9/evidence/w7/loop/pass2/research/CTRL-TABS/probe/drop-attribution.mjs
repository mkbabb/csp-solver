// T9-W7 · pass 2 · CTRL-TABS — WHERE THE 40.78 COMES FROM.
//
// The critique attributes the portrait board's 40.78px drop to `--sheet-chrome`
// (12rem → max(12.6rem, --masthead-foot + 8px)). That token feeds only the SHEET's and the
// CARD's `max-height` (scene.css:458, :496) and the sheet is `position: fixed`, so it cannot
// move a board in flow. This probe tests three candidates on the running prototype, sheet SHUT:
//
//   1. put `--sheet-chrome` back to 12rem            → does the board move?
//   2. the scene column's own justify/free space      → is the block CENTRED?
//   3. re-insert a spacer of height H where `#fold-tools` stood, and bisect H until the
//      masthead returns to HEAD's 143.52 → if H ≈ 2 × 40.78 the cause is the deleted tool band
//      halved by centring.
//
//   LANE_BASE=http://127.0.0.1:4233/ node probe/drop-attribution.mjs
import { createRequire } from "node:module";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FRONTEND =
  process.env.LANE_FRONTEND ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-39/web/frontend";
const { chromium } = createRequire(`${FRONTEND}/package.json`)("playwright");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.OUT || resolve(HERE, "../readings/drop-attribution.json");
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4233/";
const HEAD_MASTHEAD_Y = 143.52; // critique §3, chromium 390×844, sheet shut

const out = { base: BASE, generated: new Date().toISOString(), cells: {} };
const browser = await chromium.launch();
for (const cell of [
  { w: 390, h: 844 },
  { w: 375, h: 812 },
]) {
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try { localStorage.clear(); sessionStorage.clear(); } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1500);

  const read = () =>
    page.evaluate(() => {
      const b = (s) => {
        const e = document.querySelector(s);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { y: +r.y.toFixed(2), h: +r.height.toFixed(2) };
      };
      return { masthead: b(".masthead"), board: b(".board-cells") || b(".hand-drawn-grid") };
    });

  const base = await read();

  /* 1 · put --sheet-chrome back */
  const tag1 = await page.addStyleTag({
    content: "@media (max-width:1023.98px){.scene-controls{--sheet-chrome:12rem!important}}",
  });
  await page.waitForTimeout(250);
  const withHeadChrome = await read();
  await page.evaluate((el) => el.remove(), tag1);
  await page.waitForTimeout(250);

  /* 2 · the column that holds the masthead+board, and what it does with free space */
  const column = await page.evaluate(() => {
    const m = document.querySelector(".masthead");
    const chain = [];
    for (let n = m?.parentElement; n && chain.length < 6; n = n.parentElement) {
      const cs = getComputedStyle(n);
      const r = n.getBoundingClientRect();
      chain.push({
        tag: n.tagName.toLowerCase(),
        cls: n.className.toString().slice(0, 48),
        display: cs.display,
        flexDirection: cs.flexDirection,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems,
        placeContent: cs.placeContent,
        minHeight: cs.minHeight,
        height: +r.height.toFixed(2),
        y: +r.y.toFixed(2),
        scrollH: n.scrollHeight,
        clientH: n.clientHeight,
        gap: cs.gap,
      });
    }
    return chain;
  });

  /* 3 · the spacer bisect — re-insert the band `#fold-tools` used to hold */
  const spacer = async (h) =>
    page.evaluate((hh) => {
      document.getElementById("__probe_spacer")?.remove();
      const board = document.querySelector(".board-wrapper") || document.querySelector(".board-cells")?.closest("div");
      if (!board || !board.parentElement) return null;
      const d = document.createElement("div");
      d.id = "__probe_spacer";
      d.style.cssText = `height:${hh}px;flex:0 0 auto;`;
      board.parentElement.insertBefore(d, board.nextSibling);
      const m = document.querySelector(".masthead").getBoundingClientRect();
      return +m.y.toFixed(2);
    }, h);

  let lo = 0,
    hi = 200,
    best = null;
  const trials = [];
  for (let i = 0; i < 14; i += 1) {
    const mid = (lo + hi) / 2;
    const y = await spacer(mid);
    trials.push({ h: +mid.toFixed(2), mastheadY: y });
    if (y == null) break;
    if (y > HEAD_MASTHEAD_Y) hi = mid;
    else lo = mid;
    if (Math.abs(y - HEAD_MASTHEAD_Y) < 0.06) { best = { h: +mid.toFixed(2), mastheadY: y }; break; }
    best = { h: +mid.toFixed(2), mastheadY: y };
  }
  await page.evaluate(() => document.getElementById("__probe_spacer")?.remove());

  out.cells[`${cell.w}x${cell.h}`] = {
    prototype: base,
    withHeadSheetChrome: withHeadChrome,
    sheetChromeMovedTheBoard:
      base.masthead && withHeadChrome.masthead
        ? +(withHeadChrome.masthead.y - base.masthead.y).toFixed(2)
        : null,
    column,
    spacerBisect: { target: HEAD_MASTHEAD_Y, trials, best, halfOfBest: best ? +(best.h / 2).toFixed(2) : null },
  };
  await ctx.close();
}
await browser.close();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1).slice(0, 4000));
console.log("OUT", OUT);
