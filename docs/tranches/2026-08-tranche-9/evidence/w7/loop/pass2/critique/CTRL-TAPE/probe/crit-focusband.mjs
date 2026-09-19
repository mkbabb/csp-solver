/**
 * T9-W7 pass 2 · CRITIQUE · CTRL-TAPE — the focus-scroll breach of the pin band.
 * scroll-padding-top is 2.4rem (38.4px); the pin band is 43.87px. A control focused by an
 * UPWARD scroll parks inside the band, under the sentinel and under the pinned tape.
 * node crit-focusband.mjs <out.json> <engine> <port>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const ENGINE = process.argv[3] || "chromium";
const BASE = `http://127.0.0.1:${process.argv[4] || "4234"}`;

const BREACH = () => {
  const card = document.querySelector(".controls-card");
  const cs = getComputedStyle(card);
  const padT = parseFloat(cs.paddingTop) || 0;
  const max = card.scrollHeight - card.clientHeight;
  const ctrls = [
    ...card.querySelectorAll('button, [role="button"], [tabindex]:not([tabindex="-1"])'),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 4 && b.height > 4;
  });
  const worst = [];
  for (const el of ctrls) {
    card.scrollTop = max; // park below it, so focus() scrolls UP
    el.focus();
    const cb = card.getBoundingClientRect();
    const line = cb.top + card.clientTop + padT;
    const b = el.getBoundingClientRect();
    if (b.top >= line || b.bottom < line) continue; // not in the band
    let tapePx = 0;
    let tape = null;
    let sentinelOver = false;
    for (const t of card.querySelectorAll(".washi-tag")) {
      const s = getComputedStyle(t);
      if (s.position !== "sticky" || t.hasAttribute("data-released")) continue;
      const tr = t.getBoundingClientRect();
      const w = Math.max(0, Math.min(tr.right, b.right) - Math.max(tr.left, b.left));
      const h = Math.max(0, Math.min(tr.bottom, b.bottom) - Math.max(tr.top, b.top));
      if (w * h > tapePx) {
        tapePx = +(w * h).toFixed(1);
        tape = (t.textContent || "").trim();
      }
    }
    sentinelOver = card.hasAttribute("data-fold-above");
    // what the reader's pointer would find at the control's top-left inside the band
    const hit = document.elementFromPoint(b.left + 4, Math.max(line - 2, b.top + 1));
    worst.push({
      label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20),
      intoBandPx: +(line - b.top).toFixed(2),
      ringTopIntoBandPx: +(line - (b.top - 5)).toFixed(2), // 2px ring at 3px offset
      tapeOverlapPx2: tapePx,
      tape,
      sentinelPainting: sentinelOver,
      hitAtBandLine: hit ? (hit.className && String(hit.className).slice(0, 30)) || hit.tagName : null,
      scrollTop: +card.scrollTop.toFixed(1),
    });
  }
  return { padT: +padT.toFixed(2), scrollPadTop: cs.scrollPaddingTop, breaches: worst };
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
    out[name] = await page.evaluate(BREACH);
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
