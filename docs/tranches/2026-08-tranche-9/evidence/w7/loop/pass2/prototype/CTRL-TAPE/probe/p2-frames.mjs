/**
 * T9-W7 pass 2 · CTRL-TAPE — the four cited crops, chromium (the owner's re-look frames), with
 * the webkit twin of crop 1 only. Each is clipped to what its caption claims and nothing more.
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4230";
const OUT = process.argv[2];

async function board(ctx, { open = false } = {}) {
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY");
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await p.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
  if (open) {
    await p.locator(".drawer-tab").click();
    await p.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
    await p.waitForTimeout(900); // the sheet SLIDES
  }
  return p;
}

for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();

  // (1) 390×844 dark, sheet up, the MASTHEAD INCLUDED — the seam the derivation buys.
  {
    const ctx = await b.newContext({
      baseURL: BASE,
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      colorScheme: "dark",
    });
    const p = await board(ctx, { open: true });
    const y = await p.evaluate(() => {
      const logo = document.querySelector("svg.handwritten-logo").getBoundingClientRect();
      const rail = document.querySelector("#controls-drawer").getBoundingClientRect();
      return { top: Math.max(0, logo.top - 16), bottom: rail.top + 90 };
    });
    await p.screenshot({
      path: `${OUT}/p1-seam-390-dark-${engName}.png`,
      clip: { x: 0, y: y.top, width: 390, height: Math.min(844 - y.top, y.bottom - y.top) },
    });
    await ctx.close();
  }
  if (engName === "webkit") {
    await b.close();
    continue; // the other three are the chromium frames the brief names
  }

  // (2) 1440×900 rail at scrollTop 0.5 — the pinned tape INSIDE the band, first chip clear.
  {
    const ctx = await b.newContext({ baseURL: BASE, viewport: { width: 1440, height: 900 } });
    const p = await board(ctx);
    const box = await p.evaluate(() => {
      const c = document.querySelector(".controls-card");
      c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.25);
      const r = c.getBoundingClientRect();
      return { x: r.x - 12, y: r.y - 12, w: r.width + 24 };
    });
    await p.waitForTimeout(400);
    await p.screenshot({
      path: `${OUT}/p2-pinband-1440-${engName}.png`,
      clip: { x: Math.max(0, box.x), y: Math.max(0, box.y), width: box.w, height: 250 },
    });
    await ctx.close();
  }

  // (3) 390×844, the `checking` well at rest — the hang, and `Off` with air under it.
  {
    const ctx = await b.newContext({
      baseURL: BASE,
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    });
    const p = await board(ctx, { open: true });
    const clip = await p.evaluate(() => {
      const wells = [...document.querySelectorAll(".tray-well")];
      const well = wells.find((w) => /checking/.test(w.textContent || "")) ?? wells[2];
      const card = document.querySelector(".controls-card");
      well.scrollIntoView({ block: "center" });
      const r = well.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      return { x: Math.max(0, r.x - 10), y: Math.max(c.top, r.y - 28), width: r.width + 20, height: Math.min(150, r.height + 40) };
    });
    await p.waitForTimeout(400);
    await p.screenshot({ path: `${OUT}/p3-hang-390-${engName}.png`, clip });
    await ctx.close();
  }

  // (4) 900×500 sheet up — the foot bar with its 1.5 frame below the card's end.
  {
    const ctx = await b.newContext({
      baseURL: BASE,
      viewport: { width: 900, height: 500 },
      hasTouch: true,
    });
    const p = await board(ctx, { open: true });
    const clip = await p.evaluate(() => {
      const card = document.querySelector(".controls-card").getBoundingClientRect();
      const foot = document.querySelector("#card-foot").getBoundingClientRect();
      return {
        x: Math.max(0, card.x - 8),
        y: Math.max(0, card.bottom - 46),
        width: Math.min(900, card.width + 16),
        height: Math.min(500 - Math.max(0, card.bottom - 46), foot.height + 50),
      };
    });
    await p.screenshot({ path: `${OUT}/p4-foot-900-${engName}.png`, clip });
    await ctx.close();
  }
  await b.close();
}
console.log("frames banked");
