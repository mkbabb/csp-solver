// T9-W7 pass 6 · CTRL-RULE — the content-view price and the seam, per cell, one arm per run:
// card clientHeight, the foot's height, the case's top against the wordmark ink and the masthead,
// the card's sideways extent, drawer open and SETTLED (the sheet slides ~700 ms).
// node p6-price.mjs <chromium|webkit> <BASE> <arm>   → prints one JSON line per cell
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const [ENGINE, BASE, ARM] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = [[1024, 768, 0], [1280, 800, 0], [1440, 900, 0], [1280, 800, 1], [390, 844, 1], [430, 932, 1], [375, 667, 1], [320, 568, 1], [844, 390, 1], [812, 375, 1], [390, 844, 0], [360, 800, 0], [390, 800, 1], [360, 800, 1]];
const b = await (ENGINE === "webkit" ? webkit : chromium).launch();
for (const [w, h, t] of CELLS) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: !!t, isMobile: !!t && ENGINE === "chromium" });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1500);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const v = await p.evaluate(() => { const r = document.querySelector(".drawer-case").getBoundingClientRect(); return r.top + r.left; }); if (Math.abs(v - last) < 0.01) break; last = v; }
  const r = await p.evaluate(() => {
    const card = document.querySelector(".controls-card"), cas = document.querySelector(".drawer-case").getBoundingClientRect();
    const foot = document.getElementById("card-foot"), logo = document.querySelector("svg.handwritten-logo").getBoundingClientRect(), mh = document.querySelector(".masthead").getBoundingClientRect();
    return { coarse: matchMedia("(pointer: coarse)").matches, cardH: card.clientHeight, footH: foot ? +foot.getBoundingClientRect().height.toFixed(2) : null, caseW: +cas.width.toFixed(2), caseTop: +cas.top.toFixed(2), crossLogo: +(logo.bottom - cas.top).toFixed(2), crossMasthead: +(mh.bottom - cas.top).toFixed(2), overflowX: card.scrollWidth - card.clientWidth };
  });
  console.log(JSON.stringify({ engine: ENGINE, arm: ARM, cell: `${w}x${h}${t ? "c" : "f"}`, ...r }));
  await ctx.close();
}
await b.close();
