#!/usr/bin/env node
// T9-W7 pass-1 · MOT-DERIVE · the two numbers r4-probe3 does not carry.
//
//  (a) THE CARD STEP AT 1440. probe3 logs NO mover for the desk's 0->1 step. Either the
//      keypress missed, or the deck genuinely does not move. Source says the second
//      (useCarouselGlide.ts:167-193 — at the three-slot rung cards 0 and 1 share one rest
//      position), which would mean the desk's card step has a ruled 440ms and, for some
//      indices, ZERO travel. This walks all four steps and records the track delta each one
//      actually produced, plus the slot width.
//  (b) THE BOX SIZES. A FLIP that scales moves its EDGES further than its centre, so
//      "travel" for the fold is not the translate magnitude. This reads each mover target's
//      layout box so the corner travel can be computed honestly beside the centre travel.
//
// Read-only on the product: it drives a dev server and reads rects. No product file touched.
//
//   node p2-deck-and-boxes.mjs [baseURL] [out.json]

import { writeFileSync } from "node:fs";
import process from "node:process";

// This file lives outside web/frontend, so node's ESM resolver cannot walk up to the
// estate's node_modules. PW_ROOT names it (default: this repo's frontend).
const PW =
  process.env.PW_ROOT ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
const pw = await import(PW);
const { chromium } = pw.default ?? pw;

const BASE = process.argv[2] ?? "http://127.0.0.1:4248/";
const OUT = process.argv[3] ?? "/tmp/p2-deck-and-boxes.json";

const HOOK = `
window.__mv = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  let cls = null; try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')); } catch {}
  window.__mv.push({ tag: this.tagName, cls: String(cls||'').slice(0,50), kf: JSON.stringify(kf).slice(0,220), opts: JSON.stringify(opts).slice(0,160) });
  return orig.call(this, kf, opts);
};
`;

const browser = await chromium.launch({ headless: true });
const out = {};

for (const vp of [
  { w: 390, h: 844, name: "390x844-phone", mobile: true },
  { w: 1440, h: 900, name: "1440x900-desk", mobile: false },
]) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.mobile ? 3 : 2,
    hasTouch: vp.mobile,
    isMobile: vp.mobile,
  });
  const page = await ctx.newPage();
  await page.addInitScript(HOOK);
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  const r = { viewport: `${vp.w}x${vp.h}` };

  // (b) the scene's own boxes, pre-gallery
  r.sceneBoxes = await page.evaluate(() => {
    const box = (sel) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
    };
    return {
      "board-peek-host": box(".board-peek-host"),
      "scene-controls": box(".scene-controls"),
      masthead: box("h1.masthead"),
      "logo-menu": box(".logo-menu"),
      "drawer-tab": box(".drawer-tab"),
    };
  });

  // (a) the deck
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.keyboard.press("g");
  await new Promise((res) => setTimeout(res, 2200));

  r.deck = await page.evaluate(() => {
    const t = document.querySelector(".gallery-track");
    const vpEl = document.querySelector(".gallery-viewport");
    const slots = t ? [...t.children].filter((c) => c.classList.contains("game-card")) : [];
    return {
      deckSlots: t ? getComputedStyle(t).getPropertyValue("--deck-slots").trim() : null,
      cardW: t ? getComputedStyle(t).getPropertyValue("--card-w").trim() : null,
      slotWidth: slots[0] ? +slots[0].getBoundingClientRect().width.toFixed(1) : null,
      slotCount: slots.length,
      trackW: t ? +t.getBoundingClientRect().width.toFixed(1) : null,
      frameW: vpEl ? vpEl.clientWidth : null,
      maxScroll: vpEl ? +(vpEl.scrollWidth - vpEl.clientWidth).toFixed(1) : null,
      scrollLeft: vpEl ? +vpEl.scrollLeft.toFixed(1) : null,
    };
  });

  r.galleryBoxes = await page.evaluate(() => {
    const box = (sel) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return { w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
    };
    return { "board-peek-host": box(".board-peek-host"), "logo-menu": box(".logo-menu") };
  });

  // four ArrowRight steps: what did the TRACK actually travel each time?
  r.steps = [];
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => {
      window.__mv = [];
      const vpEl = document.querySelector(".gallery-viewport");
      window.__before = vpEl ? vpEl.scrollLeft : null;
    });
    await page.keyboard.press("ArrowRight");
    await new Promise((res) => setTimeout(res, 900));
    r.steps.push(
      await page.evaluate(() => {
        const vpEl = document.querySelector(".gallery-viewport");
        const mv = window.__mv.filter((m) => String(m.cls).includes("gallery-track"));
        const dx = mv.length ? /translateX\((-?[\d.]+)px\)/.exec(mv[0].kf) : null;
        const centred = document.querySelector(".game-card.is-center");
        return {
          scrollBefore: window.__before,
          scrollAfter: vpEl ? +vpEl.scrollLeft.toFixed(1) : null,
          movers: mv.length,
          moverTravelPx: dx ? Math.abs(Number(dx[1])) : 0,
          moverMs: mv.length ? JSON.parse(mv[0].opts).duration : null,
          centeredId: centred ? centred.id : null,
        };
      }),
    );
  }

  out[vp.name] = r;
  await ctx.close();
}
await browser.close();

writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(out)) {
  console.log("=== " + k);
  console.log("  deck:", JSON.stringify(v.deck));
  console.log("  scene boxes:", JSON.stringify(v.sceneBoxes));
  console.log("  gallery boxes:", JSON.stringify(v.galleryBoxes));
  v.steps.forEach((s, i) =>
    console.log(
      `  step ${i} (${s.centeredId}): scroll ${s.scrollBefore} -> ${s.scrollAfter}, movers ${s.movers}, travel ${s.moverTravelPx}px, ${s.moverMs}ms`,
    ),
  );
}
console.log("\nwrote " + OUT);
