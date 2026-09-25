// coarse-deal.mjs — copied from pass6/critique/CTRL-FACE/instruments/coarse-deal.mjs (OUT = stdout), pass 7:
// (a) the fade is read where the tree paints it: the bar's `::before` when the bar is IN the card (FACE's
// page), the card's own `::after` sentinel at its clip edge when the bar is the case's foot (the §10 fold);
// (b) any viewport (1280×800 and 1440×900 coarse, INTAKE row 11); (c) the sideways scroll printed beside.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const { chromium, webkit } = require("playwright");
const [engName, base, label, vp = "1280x800"] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await (engName === "webkit" ? webkit : chromium).launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: false, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(`${base}/?${Q}`); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(1500);
const m = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  card.scrollTop = 0; card.scrollLeft = 0;
  const deal = card.querySelector(".deal-btn").getBoundingClientRect();
  const inCard = card.querySelector(".action-bar");
  let fadeTop, how;
  if (inCard) { const bar = inCard.getBoundingClientRect(); fadeTop = bar.top - parseFloat(getComputedStyle(inCard, "::before").height); how = "bar::before"; }
  else { const clipBottom = card.getBoundingClientRect().top + card.clientTop + card.clientHeight; fadeTop = clipBottom - (parseFloat(getComputedStyle(card, "::after").height) || 0); how = "card::after"; }
  const givens = [...document.querySelectorAll(".sudoku-cell[aria-label]")].length;
  return { coarse: matchMedia("(pointer: coarse)").matches, fadeFrom: how, dealBottom: +deal.bottom.toFixed(2), fadeTop: +fadeTop.toFixed(2), clear: +(fadeTop - deal.bottom).toFixed(2), scrollW: card.scrollWidth, clientW: card.clientWidth, sideways: card.scrollWidth - card.clientWidth, dealH: +deal.height.toFixed(2), cells: givens };
});
console.log(JSON.stringify({ engine: engName, label, vp, ...m }));
await b.close();
