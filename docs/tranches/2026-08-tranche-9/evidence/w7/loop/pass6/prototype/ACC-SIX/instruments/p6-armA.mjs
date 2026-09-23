// PASS-6 COPY (charter row 9: "price it with a digit written in cells 72-75"). The pass-5 reading had
// 0 px² of glyph occlusion only because cells 72-75 were EMPTY on the payload; this copy WRITES the
// solution digits into 72 and 73 (fill 2, the count showing) and prices, then 74 and 75 and prices again.
// ACC-SIX pass-5 — ARM A PRICED, NOT BUILT (charter row 9). The bottom-left tape of pass-2/3
// (pass2/research/ACC-SIX/probe/acc-six-ink.probe.ts, pose "bottom-left head": box top = board
// bottom − h, left = board left + dx) is INJECTED as a clone of a live `.washi-label` (its own
// scoped CSS, rotation and tear) carrying the count's two widest 9×9 strings, then its rect is
// intersected with every cell, every painted glyph and the frame's trace box. Three viewports
// (1280x800 fine, 393x699 coarse, 844x390 coarse), both engines, fill 2 (the count's own pose).
// The margin line (the shipped arm) occludes 0 px² by construction: it is off the board.
// usage: BASE=http://127.0.0.1:4237 node p5-armA.mjs <out.json>
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, SOL, cells, asset, open } from "./p6-common.mjs";
async function writeAt(page, idx) { await page.evaluate((i) => document.querySelectorAll(".sudoku-cell")[i].querySelector("input").focus(), idx); await page.keyboard.type(SOL[idx]); await page.waitForTimeout(260); }
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const DX = 4;
const CELLS = [
  { name: "1280x800-fine", viewport: { width: 1280, height: 800 }, dpr: 1, touch: false },
  { name: "393x699-coarse", viewport: { width: 393, height: 699 }, dpr: 3, touch: true },
  { name: "844x390-coarse", viewport: { width: 844, height: 390 }, dpr: 3, touch: true },
];
const PRICE = ([text, dx]) => {
  // A live TAG tape (the estate's own compartment-name tape: its scoped CSS, font, padding and
  // tear), text swapped, its centring translate dropped (the tilt kept), then SEATED by its own
  // measured rect: box left = board left + dx, box bottom = board bottom (pass-2's pose).
  const src = document.querySelector(".washi-label.washi-tag");
  if (!src) return { error: "no .washi-label.washi-tag on the page to clone" };
  const svg = document.querySelector("svg.hand-drawn-grid").getBoundingClientRect();
  const t = src.cloneNode(false);
  t.textContent = text; t.id = "acc6-armA";
  Object.assign(t.style, { position: "fixed", left: "0px", top: "0px", margin: "0", visibility: "visible", opacity: "1", zIndex: 999, transform: "rotate(var(--washi-tilt))" });
  document.body.appendChild(t);
  for (let k = 0; k < 2; k++) {
    const q = t.getBoundingClientRect();
    t.style.left = `${parseFloat(t.style.left) + (svg.x + dx - q.x)}px`;
    t.style.top = `${parseFloat(t.style.top) + (svg.y + svg.height - q.bottom)}px`;
  }
  const r = t.getBoundingClientRect();
  const fs = getComputedStyle(t).fontSize;
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const cs = Array.from(document.querySelectorAll(".sudoku-cell"));
  const cellHits = cs.map((c, i) => { const b = c.getBoundingClientRect(); return { i, a: inter(r, b), area: b.width * b.height }; }).filter((h) => h.a > 0);
  const glyphs = Array.from(document.querySelectorAll(".sudoku-cell .glyph-svg")).map((g) => inter(r, g.getBoundingClientRect())).filter((a) => a > 0);
  t.remove();
  return { text, fontSize: fs, tape: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)), board: [svg.x, svg.y, svg.width, svg.height].map((v) => +v.toFixed(2)), cellPx2: +cellHits.reduce((n, h) => n + h.a, 0).toFixed(1), cellsTouched: cellHits.length, cellEquivalents: +cellHits.reduce((n, h) => n + h.a / h.area, 0).toFixed(2), glyphPx2: +glyphs.reduce((n, a) => n + a, 0).toFixed(1), cellsHit: cellHits.map((h) => h.i) };
};
const out = { board: BOARD, base: BASE, dx: DX, cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const C of CELLS) {
    const { ctx, page } = await open(br, BASE, { ...C, reduce: true });
    const R = (out.cells[`${eng}/${C.name}`] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL });
    await writeAt(page, 72); await writeAt(page, 73);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(500);
    R.meta = await page.evaluate(() => document.querySelector(".margin-note-meta")?.textContent ?? null);
    R.written72_75 = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell")).slice(72, 76).map((c) => c.querySelector("input")?.value || "."));
    R.arms = [];
    for (const text of ["2 of 51 on the board", "51 of 51 on the board"]) R.arms.push(await page.evaluate(PRICE, [text, DX]));
    await writeAt(page, 74); await writeAt(page, 75);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(500);
    R.written72_75b = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell")).slice(72, 76).map((c) => c.querySelector("input")?.value || "."));
    R.armsFour = [];
    for (const text of ["2 of 51 on the board", "51 of 51 on the board"]) R.armsFour.push(await page.evaluate(PRICE, [text, DX]));
    // The worst deal for Arm A: a given in the last row's first cells is covered. Price the
    // glyph box of cells 72-74 whether or not this deal inks them (a player will).
    R.lastRowGlyphBox = await page.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell")).slice(72, 75).map((c) => { const b = c.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(1)); }));
    await ctx.close();
    console.error("done", eng, C.name);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
