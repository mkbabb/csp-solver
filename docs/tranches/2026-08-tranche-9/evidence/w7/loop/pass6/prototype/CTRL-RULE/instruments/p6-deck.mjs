// T9-W7 pass 6 · CTRL-RULE — the gallery deck's tapes, lane vs control, each arm read THREE times
// with a settle poll (the deck enters on a glide): the π instrument's deckEqual is one boolean
// over one read each, so it cannot tell a literalization shift from the entrance still moving.
// node p6-deck.mjs <chromium|webkit> <protoBase> <controlBase>
import { ENGINES, CELLS } from "./p6-lib.mjs";
const [ENG, P, C] = process.argv.slice(2);
const L = ENGINES.find(([n]) => n === ENG)[1];
const DECK = () =>
  [...document.querySelectorAll(".washi-tag, .staging-axis-label")]
    .filter((e) => !e.closest(".controls-card"))
    .map((e) => { const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return [(e.textContent || "").trim(), +b.left.toFixed(2), +b.top.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2), cs.fontSize, cs.lineHeight, cs.marginTop, cs.marginLeft, cs.top, cs.color]; });
const br = await L.launch();
for (const key of ["rail1280", "dock390"]) {
  const cell = CELLS[key];
  for (const [arm, base] of [["proto", P], ["control", C]]) {
    for (let k = 0; k < 3; k++) {
      const ctx = await br.newContext({ baseURL: base, viewport: { width: cell.width, height: cell.height }, hasTouch: !!cell.touch, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      await page.goto("/?view=gallery");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
      let last = "", d = null;
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(100); d = await page.evaluate(DECK); const s = JSON.stringify(d); if (s === last) break; last = s; }
      console.log(ENG, key, arm, k, JSON.stringify(d));
      await ctx.close();
    }
  }
}
await br.close();
