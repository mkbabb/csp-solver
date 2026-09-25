// T9-W7 pass 7 · CTRL-RULE — the coarse rail's ABSOLUTE geometry at 1280×800 hasTouch, per arm,
// both engines: the numbers row 1's re-cut stamps (critic gap 2: a ruler read off the tree it rules
// cannot see π; the gate compares to the CONTROL's numbers, stamped with its commit).
// node p7-rail-stamp.mjs <base> [label]
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const [BASE, LABEL = BASE] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const SURF = { masthead: ".masthead", logo: "svg.handwritten-logo", tab: ".drawer-tab", cell: ".sudoku-cell", host: ".board-peek-host", case: ".drawer-case" };
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: name === "chromium", deviceScaleFactor: 1, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
  let last = null;
  for (let i = 0; i < 60; i++) { await p.waitForTimeout(120); const t = await p.evaluate(() => { const c = document.querySelector(".drawer-case"); return c ? c.getBoundingClientRect().left + "," + c.getBoundingClientRect().width : ""; }); if (t && t === last) break; last = t; }
  const r = await p.evaluate((S) => { const o = { coarse: matchMedia("(pointer: coarse)").matches }; for (const [k, s] of Object.entries(S)) { const e = document.querySelector(s); if (!e) { o[k] = null; continue; } const bb = e.getBoundingClientRect(); o[k] = [+bb.left.toFixed(2), +bb.top.toFixed(2), +bb.width.toFixed(2)]; } const card = document.querySelector(".controls-card"); o.overflow = card ? card.scrollWidth - card.clientWidth : null; o.givens = document.querySelectorAll(".sudoku-cell .glyph-svg").length; return o; }, SURF);
  console.log(JSON.stringify({ arm: LABEL, engine: name, ...r }));
  await b.close();
}
