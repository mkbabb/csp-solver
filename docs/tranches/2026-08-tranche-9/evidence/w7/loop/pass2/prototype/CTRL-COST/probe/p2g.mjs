#!/usr/bin/env node
// T9-W7 pass 2 · CTRL-COST — THE WRITING BAND'S ACT ROW, BUTTON BY BUTTON.
//
// p2f named the box that widened the card: the writing band's `.band-acts` (undo · redo ·
// hint · fill · solve) is now the card's widest max-content box at 325.97, where HEAD's
// widest was the legend fold at 284.22 — the whole +41.75. This probe prints that row's
// per-button max-content plus the terms that set it (gap, padding, the sublabel's font),
// so the same read on both dists says WHICH term moved rather than which box.
//
// Usage: node probe-p2g.mjs <base-url> <out.json>
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4235";
const out = process.argv[3] ?? "/tmp/p2g.json";

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
  // The act row that holds undo/redo/hint — named by its contents, not by band order,
  // so the read survives a re-ordered card.
  const rows = [...document.querySelectorAll(".band-acts")];
  const row =
    rows.find((r) => r.querySelector('[aria-label="Undo last move"]')) ?? rows[0];
  if (!row) return { error: "no .band-acts" };
  const cs = getComputedStyle(row);
  const kids = [...row.children].map((k) => ({
    sel: `${k.tagName.toLowerCase()}.${[...k.classList].join(".")}`.slice(0, 50),
    maxContent: maxContent(k),
    live: +k.getBoundingClientRect().width.toFixed(2),
    text: (k.textContent || "").trim().replace(/\s+/g, " ").slice(0, 36),
  }));
  const btns = [...row.querySelectorAll("button")].map((b) => {
    const bs = getComputedStyle(b);
    const sub = b.querySelector(".icon-sublabel");
    const svg = b.querySelector("svg");
    return {
      label: b.getAttribute("aria-label") || (b.textContent || "").trim().slice(0, 24),
      maxContent: maxContent(b),
      live: +b.getBoundingClientRect().width.toFixed(2),
      pad: `${bs.paddingLeft}/${bs.paddingRight}`,
      minW: bs.minWidth,
      font: bs.fontSize,
      sublabelFont: sub ? getComputedStyle(sub).fontSize : null,
      sublabel: sub ? sub.textContent.trim() : null,
      svgW: svg ? +svg.getBoundingClientRect().width.toFixed(2) : null,
    };
  });
  const root = getComputedStyle(document.documentElement);
  const tokens = {};
  for (const t of [
    "--type-act",
    "--type-tag",
    "--type-small",
    "--icon-act",
    "--tap-floor",
    "--type-group-title",
  ])
    tokens[t] = root.getPropertyValue(t).trim();
  return {
    rowMaxContent: maxContent(row),
    rowLive: +row.getBoundingClientRect().width.toFixed(2),
    rowDisplay: cs.display,
    rowGap: cs.gap,
    rowPad: `${cs.paddingLeft}/${cs.paddingRight}`,
    kids,
    btns,
    tokens,
  };
});

writeFileSync(out, JSON.stringify(read, null, 2));
console.log(JSON.stringify(read, null, 2));
await browser.close();
