/** CRITIC π census: the deck (unclaimed), the board, and the .section-heading wearer whose FACE
 *  this lane deleted — prototype vs the 74a2b5d9 control, both engines, two cells. */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT = process.argv[2];
const R = (b) => (b ? { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) } : null);
const CENSUS = () => {
  const g = (s) => document.querySelector(s);
  const rect = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) }; };
  const axis = g(".staging-band .section-heading") || g(".section-heading");
  const cs = axis ? getComputedStyle(axis) : null;
  const tape = g(".washi-tag");
  return {
    band: rect(g(".staging-band") || g(".sketchbook-deck") || g("main")),
    firstCard: rect(document.querySelectorAll(".deck-card, .sketch-card, .gallery-card")[0]),
    deckTape: tape ? { r: rect(tape), fs: getComputedStyle(tape).fontSize, ff: getComputedStyle(tape).fontFamily.split(",")[0] } : null,
    axis: axis ? { r: rect(axis), fs: cs.fontSize, ff: cs.fontFamily.split(",")[0], fw: cs.fontWeight, tt: cs.textTransform, ls: cs.letterSpacing } : null,
    board: rect(g(".sudoku-board, .game-board, svg.board-svg") ),
  };
};
async function read(engine, base, w, h, route) {
  const b = await engine.launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  await p.goto(route);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForTimeout(1200);
  const out = await p.evaluate(CENSUS);
  await ctx.close(); await b.close();
  return out;
}
const PROTO = "http://127.0.0.1:4246", HEAD = "http://127.0.0.1:4247";
const res = {};
for (const [n, e] of [["chromium", chromium], ["webkit", webkit]])
  for (const [cell, w, h] of [["1440x900", 1440, 900], ["390x844", 390, 844]])
    for (const [route, tag] of [["/", "deck"], ["/?size=3&difficulty=EASY", "board"]]) {
      const a = await read(e, PROTO, w, h, route);
      const c = await read(e, HEAD, w, h, route);
      const diff = {};
      for (const k of Object.keys(a)) diff[k] = JSON.stringify(a[k]) === JSON.stringify(c[k]) ? "same" : { proto: a[k], head: c[k] };
      res[`${n}/${cell}/${tag}`] = diff;
    }
writeFileSync(OUT, JSON.stringify(res, null, 2));
console.log(JSON.stringify(res, null, 2));
