import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const b = await chromium.launch(); const ctx = await b.newContext({ baseURL: process.argv[2], viewport: { width: 844, height: 390 }, hasTouch: true, colorScheme: "dark", deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage(); await page.goto("/?board=" + PAYLOAD); await page.waitForSelector(".controls-card", { state: "attached" }); await page.waitForTimeout(800);
await page.locator(".drawer-tab").first().click(); await page.waitForTimeout(1500);
await page.evaluate(() => { const c = document.querySelector("#controls-drawer .controls-card"); c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.1); });
await page.waitForTimeout(400);
const r = await page.evaluate(() => {
  const bar = document.querySelector(".action-bar").getBoundingClientRect();
  const card = document.querySelector("#controls-drawer .controls-card");
  const cb = card.getBoundingClientRect(); const cs = getComputedStyle(card);
  const svgs = [...document.querySelectorAll("#controls-drawer svg.outline-svg")].map((s) => { const r = s.getBoundingClientRect(); const host = s.closest(".tray-well, .bar-frame, .controls-card, .drawer-case, [class]"); return { host: (s.parentElement?.className || "") + " < " + (s.parentElement?.parentElement?.className || ""), l: +r.left.toFixed(1), r: +r.right.toFixed(1), t: +r.top.toFixed(1), b: +r.bottom.toFixed(1) }; }).filter((s) => s.r > 830);
  return { vw: innerWidth, bar: { l: bar.left, r: bar.right, t: bar.top }, card: { l: cb.left, r: cb.right, b: cb.bottom, padL: cs.paddingLeft, padR: cs.paddingRight, bl: cs.borderLeftWidth }, svgsRightEdge: svgs };
});
console.log(JSON.stringify(r, null, 0));
await b.close();
