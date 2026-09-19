/**
 * T9-W7 pass 2 · CRITIQUE · CTRL-TAPE — focus-scroll against the two bands.
 * The pin band is 43.87px of solid sentinel; `scroll-padding-top` is still 2.4rem (38.4).
 * `scroll-padding-bottom` was retired, and the card grew a NEW sticky bottom sentinel.
 * node crit-focus.mjs <out.json> <engine> <port>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const ENGINE = process.argv[3] || "chromium";
const BASE = `http://127.0.0.1:${process.argv[4] || "4234"}`;

const PARK = () => {
  const card = document.querySelector(".controls-card");
  const cs = getComputedStyle(card);
  const padT = parseFloat(cs.paddingTop) || 0;
  const padB = parseFloat(cs.paddingBottom) || 0;
  const cb = card.getBoundingClientRect();
  const clipTop = cb.top + card.clientTop;
  const clipBottom = clipTop + card.clientHeight;
  const ctrls = [
    ...card.querySelectorAll('button, [role="button"], [tabindex]:not([tabindex="-1"])'),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 4 && b.height > 4;
  });
  const up = [];
  const down = [];
  const max = card.scrollHeight - card.clientHeight;
  for (const el of ctrls) {
    // UPWARD scroll: park against the top band
    card.scrollTop = max;
    el.focus();
    let b = el.getBoundingClientRect();
    const fromTop = +(b.top - (clipTop + padT)).toFixed(2);
    // DOWNWARD scroll: park against the bottom band
    card.scrollTop = 0;
    el.focus();
    b = el.getBoundingClientRect();
    const fromBottom = +(clipBottom - padB - b.bottom).toFixed(2);
    const label = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20);
    if (fromTop > -400 && fromTop < 12) up.push({ label, fromTop });
    if (fromBottom > -400 && fromBottom < 12) down.push({ label, fromBottom });
  }
  return {
    padT: +padT.toFixed(2),
    padB: +padB.toFixed(2),
    scrollPadTop: cs.scrollPaddingTop,
    scrollPadBottom: cs.scrollPaddingBottom,
    foldAbove: card.hasAttribute("data-fold-above"),
    foldBelow: card.hasAttribute("data-fold-below"),
    up: up.slice(0, 6),
    down: down.slice(0, 6),
  };
};

const run = async () => {
  const b = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const out = { engine: ENGINE };
  for (const [name, vp] of [
    ["rail1440", { width: 1440, height: 900 }],
    ["dock390", { width: 390, height: 844 }],
  ]) {
    const ctx = await b.newContext({ viewport: vp, baseURL: BASE });
    const page = await ctx.newPage();
    await page.goto("/?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 40000 });
    if (vp.width < 1024) {
      const tab = page.locator(".drawer-tab, [data-drawer-tab]").first();
      if (await tab.count()) await tab.click({ timeout: 5000 }).catch(() => {});
      await page.waitForTimeout(900);
    }
    await page.waitForTimeout(600);
    out[name] = await page.evaluate(PARK);
    await ctx.close();
  }
  await b.close();
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log("WROTE", OUT);
};
run().then(
  () => console.log("EXIT 0"),
  (e) => {
    console.error("FAIL", e);
    process.exit(1);
  },
);
