#!/usr/bin/env node
// T9-W7 pass 2 · CTRL-COST — THE GOLDEN ATTRIBUTION PROBE.
//
// The golden battery reds 3/4 on this family's dist and 4/4 green on HEAD's, so the
// family MOVED the goldens. This probe reads the geometry the three crops are cut from
// at the golden viewport (1280×800, DPR2, PRM) so the move can be attributed to a box
// rather than guessed at from a pixel ratio:
//   · svg.handwritten-logo   — the logo crop's own bbox (768→766 device px = 384→383 CSS)
//   · .sudoku-cell (first)   — the cell crop's bbox (144→142 device = 72→71 CSS)
//   · button.sun-moon-toggle — the crest crop is a 72×72 clip around its CENTER
// plus the boxes upstream of them: the scene row, the board wrapper, the controls card,
// and the card's own intrinsic (max-content) width.
//
// Usage: node probe-p2e.mjs <base-url> <out.json>
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4235";
const out = process.argv[3] ?? "/tmp/p2e.json";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
await page.waitForSelector("image.boil-frame-bitmap.is-active", { timeout: 15000 });
await page.waitForSelector("image.logo-pose-bmp.is-active", { timeout: 15000 });
await page.evaluate(() => document.fonts.ready);

const read = await page.evaluate(() => {
  const box = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      cx: +(r.x + r.width / 2).toFixed(2),
      cy: +(r.y + r.height / 2).toFixed(2),
    };
  };
  const card = document.querySelector(".controls-card");
  // The card's INTRINSIC width — what a shrink-to-fit column resolves against. Read by
  // cloning the live card into an off-flow max-content box (the clone carries the same
  // classes and the same computed inheritance, so its text lays out identically).
  let intrinsic = null;
  if (card) {
    const clone = card.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.inlineSize = "max-content";
    clone.style.maxInlineSize = "none";
    clone.style.left = "-10000px";
    card.parentElement.appendChild(clone);
    intrinsic = +clone.getBoundingClientRect().width.toFixed(2);
    clone.remove();
  }
  const head = document.querySelector(".cost-band-head");
  return {
    logo: box("svg.handwritten-logo"),
    cell: box(".sudoku-cell"),
    toggle: box("button.sun-moon-toggle"),
    board: box(".board-wrapper"),
    card: box(".controls-card"),
    row: box(".scene-row") ?? box(".game-scene") ?? null,
    masthead: box("header") ?? null,
    intrinsicCardW: intrinsic,
    costHead: head ? box(".cost-band-head") : null,
    cssCostHeadH: card
      ? getComputedStyle(card).getPropertyValue("--cost-head-h").trim()
      : "",
    cssPinBand: card ? getComputedStyle(card).getPropertyValue("--pin-band").trim() : "",
    cardPadTop: card ? getComputedStyle(card).paddingTop : "",
    cellCount: document.querySelectorAll(".sudoku-cell").length,
  };
});

writeFileSync(out, JSON.stringify(read, null, 2));
console.log(JSON.stringify(read, null, 2));
await browser.close();
