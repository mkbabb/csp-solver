import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test");
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4238/?size=3&board=" + process.argv[2]);
  await page.waitForSelector(".board-shell .game-cell"); await page.waitForTimeout(1500);
  for (const sel of ["button.attribution-trigger", "button.sun-moon-toggle"]) {
    await page.keyboard.press("Shift");
    const r = await page.evaluate(async (sel) => { const el = document.querySelector(sel); el.focus(); await new Promise((r) => setTimeout(r, 600)); const ring = document.querySelector(".focus-ring"); const t = el.getBoundingClientRect(); const o = parseFloat(getComputedStyle(el).getPropertyValue("--focus-ring-outset")); const rr = ring?.getBoundingClientRect(); return { vw: document.documentElement.clientWidth, target: [t.left, t.right].map((v) => +v.toFixed(2)), outset: o, unclipped: [+(t.left - o).toFixed(2), +(t.right + o).toFixed(2)], ring: rr ? [+rr.left.toFixed(2), +rr.right.toFixed(2)] : null }; }, sel);
    console.log(engine, sel, JSON.stringify(r));
  }
  await b.close();
}
