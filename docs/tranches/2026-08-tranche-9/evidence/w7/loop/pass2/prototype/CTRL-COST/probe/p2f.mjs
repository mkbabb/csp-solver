#!/usr/bin/env node
// T9-W7 pass 2 · CTRL-COST — WHICH BOX WIDENED THE CARD.
//
// p2e measured the card's shrink-to-fit width at the golden viewport: 324.22 at HEAD,
// 365.97 on this family's dist (+41.75), which walks the whole board column 20.87px left
// and is what actually reds three goldens (the crops' sub-pixel phase moves; the boxes
// themselves are identical sizes). This probe names the CONTRIBUTOR: every descendant of
// the card is re-measured at `inline-size: max-content` IN PLACE (cloned into its own
// parent, so inheritance and the cascade are unchanged), and the ones whose max-content
// contribution reaches the card's own are printed.
//
// Usage: node probe-p2f.mjs <base-url> <out.json>
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4235";
const out = process.argv[3] ?? "/tmp/p2f.json";

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
await page.evaluate(() => document.fonts.ready);

const read = await page.evaluate(() => {
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no .controls-card" };
  const name = (el) =>
    `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`.slice(0, 70);
  const maxContent = (el) => {
    const clone = el.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.left = "-10000px";
    clone.style.visibility = "hidden";
    clone.style.inlineSize = "max-content";
    clone.style.maxInlineSize = "none";
    el.parentElement.appendChild(clone);
    const w = clone.getBoundingClientRect().width;
    clone.remove();
    return +w.toFixed(2);
  };
  const cardW = +card.getBoundingClientRect().width.toFixed(2);
  const rows = [];
  const walk = (el, depth) => {
    for (const kid of el.children) {
      if (!(kid instanceof HTMLElement)) continue;
      const cs = getComputedStyle(kid);
      if (cs.position === "absolute" || cs.display === "none") continue;
      const mc = maxContent(kid);
      rows.push({
        depth,
        sel: name(kid),
        maxContent: mc,
        live: +kid.getBoundingClientRect().width.toFixed(2),
        text: (kid.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48),
      });
      if (depth < 3) walk(kid, depth + 1);
    }
  };
  walk(card, 0);
  rows.sort((a, b) => b.maxContent - a.maxContent);
  return {
    cardW,
    cardPad: `${getComputedStyle(card).paddingLeft} / ${getComputedStyle(card).paddingRight}`,
    top: rows.slice(0, 14),
  };
});

writeFileSync(out, JSON.stringify(read, null, 2));
console.log(JSON.stringify(read, null, 2));
await browser.close();
