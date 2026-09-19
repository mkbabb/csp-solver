/**
 * T9-W7 pass 3 · CTRL-TAPE — PRESS 2 FIRES (gate 6's second half), and the DEV overlay named.
 *
 * The face probe's `.confirm-go` tap timed out on every cell with the ribbon standing and the
 * button resolved. The `covers` row named the obstruction: `Toggle filter tuner`, 1600px² — the
 * DEV-ONLY filter tuner toggle (`src/pencil/dev/FilterTuner.vue`, gated `import.meta.env.DEV`,
 * allowlisted out of the copy register for exactly that reason). It is a dev-server artefact
 * that never ships, so it is removed here rather than designed around, and its interception is
 * reported as an instrument note, not a defect of the face.
 *
 *   node p3-press2.mjs <out.json> <base> [engine]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const T = { timeout: 8000 };
const out = {};

for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await eng.launch();
  const ctx = await browser.newContext({
    baseURL: BASE,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: engName === "chromium",
  });
  ctx.setDefaultTimeout(8000);
  const page = await ctx.newPage();
  try {
    await page.goto("/?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", T);
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 25000 });
    await page.waitForSelector("g.boil-frame-layer.is-active", {
      state: "attached",
      timeout: 25000,
    });
    for (let i = 0; i < 12; i++) {
      await page.locator(".sudoku-cell").nth(i).click(T);
      await page.keyboard.press("5");
    }
    // The DEV artefact, named and removed. Production ships no such node.
    const devToggles = await page.evaluate(() => {
      const hits = [...document.querySelectorAll("*")].filter((e) =>
        /filter tuner/i.test(e.getAttribute("aria-label") || ""),
      );
      for (const h of hits) h.remove();
      return hits.length;
    });
    await page.locator(".drawer-tab").click(T);
    await page.waitForTimeout(950);
    const g0 = await page.evaluate(
      () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
    );
    await page.locator('.action-bar button[aria-label="Clear the board"]').tap(T);
    await page.waitForTimeout(420);
    const armed = await page.evaluate(() => !!document.querySelector(".confirm-ribbon"));
    // The ribbon against the card's own live controls, clipped to the scrollport.
    const covers = await page.evaluate(() => {
      const rib = document.querySelector(".confirm-ribbon");
      const card = document.querySelector(".controls-card");
      if (!rib || !card) return null;
      const r = rib.getBoundingClientRect();
      const clipTop = card.getBoundingClientRect().top + card.clientTop;
      const clipBottom = clipTop + card.clientHeight;
      let worst = 0;
      let who = null;
      for (const el of card.querySelectorAll(
        'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
      )) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const vt = Math.max(b.top, clipTop);
        const vb = Math.min(b.bottom, clipBottom);
        if (vb - vt <= 0) continue;
        const w = Math.max(0, Math.min(b.right, r.right) - Math.max(b.left, r.left));
        const h = Math.max(0, Math.min(vb, r.bottom) - Math.max(vt, r.top));
        if (w * h > worst) {
          worst = +(w * h).toFixed(2);
          who = el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24);
        }
      }
      return { worst, who };
    });
    let press2 = null;
    if (armed) {
      await page.locator(".confirm-go").tap(T);
      await page.waitForTimeout(800);
      press2 = {
        glyphsBefore: g0,
        glyphsAfter: await page.evaluate(
          () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        ),
        ribbonGone: await page.evaluate(() => !document.querySelector(".confirm-ribbon")),
        verbsBack: await page.evaluate(() => !!document.querySelector(".action-verbs")),
      };
      press2.fired = press2.glyphsAfter < press2.glyphsBefore;
    }
    out[engName] = { devTogglesRemoved: devToggles, armed, coversCardControls: covers, press2 };
  } catch (e) {
    out[engName] = { error: String(e).slice(0, 220) };
  }
  await ctx.close();
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
