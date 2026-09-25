// corner-stack.mjs — the stacking chain of the last well's outline at the junction's zero column (row 4).
import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const b = await chromium.launch();
const ctx = await b.newContext({ baseURL: process.env.BASE, viewport: { width: 844, height: 390 }, hasTouch: true, colorScheme: "dark", deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage(); await page.goto("/?board=" + PAYLOAD); await page.waitForSelector(".controls-card", { state: "attached" }); await page.waitForTimeout(800);
await page.locator(".drawer-tab").first().click(); await page.waitForTimeout(1500);
await page.evaluate(() => { const c = document.querySelector("#controls-drawer .controls-card"); c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.9); });
await page.waitForTimeout(400);
const out = await page.evaluate(() => {
  const card = document.querySelector("#controls-drawer .controls-card");
  const cb = card.getBoundingClientRect().bottom;
  const wells = [...card.querySelectorAll(".tray-well")].filter((w) => { const r = w.getBoundingClientRect(); return r.top < cb && r.bottom > cb - 60; });
  return wells.map((w) => { const chain = []; let e = w.querySelector(":scope > .outline-svg, :scope > .outline-container, svg"); while (e && e !== card) { const cs = getComputedStyle(e); chain.push(`${e.tagName.toLowerCase()}.${(typeof e.className === "string" ? e.className : e.className.baseVal).trim().split(/\s+/).slice(0, 3).join(".")} pos=${cs.position} z=${cs.zIndex} tf=${cs.transform !== "none" ? "Y" : "-"} wc=${cs.willChange} op=${cs.opacity} iso=${cs.isolation} contain=${cs.contain}`); e = e.parentElement; } const r = w.getBoundingClientRect(); return { well: [r.top, r.bottom].map((v) => +v.toFixed(2)), cls: w.className, chain }; });
});
console.log(JSON.stringify(out, null, 1));
await b.close();
