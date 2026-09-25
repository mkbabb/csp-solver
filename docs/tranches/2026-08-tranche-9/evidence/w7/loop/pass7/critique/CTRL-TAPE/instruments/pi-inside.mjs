// CTRL-TAPE pass-7 critic: the flex column's π INSIDE the case, p6 dist vs tree (and merged vs s10 is the lane's). Case/card/foot/bar/verbs rects + card client/scroll heights + board rect.
import { ENGINES, open, givens } from "./p6-lib.mjs";
const [A, B] = process.argv.slice(2);
const CELLS = { rail1440: { width: 1440, height: 900 }, rail1280: { width: 1280, height: 800 }, rail1024: { width: 1024, height: 768 }, coarse1280: { width: 1280, height: 800, touch: true }, short1280: { width: 1280, height: 620 }, dock390: { width: 390, height: 844, touch: true, dock: true }, dock430: { width: 430, height: 932, touch: true, dock: true }, dock360x800: { width: 360, height: 800, touch: true, dock: true }, land844: { width: 844, height: 390, touch: true, dock: true }, land812: { width: 812, height: 375, touch: true, dock: true }, ipad820: { width: 820, height: 1180, touch: true, dock: true } };
const read = (page) => page.evaluate(() => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)); };
  const card = document.querySelector(".controls-card");
  const verbs = [...document.querySelectorAll("#card-foot .action-verbs button, .action-bar .action-verbs button")].filter((e) => e.getClientRects().length).map((e) => { const b = e.getBoundingClientRect(); return [+b.x.toFixed(2), +b.y.toFixed(2)]; });
  return { case: r(".drawer-case"), card: r(".controls-card"), foot: r("#card-foot"), bar: r(".action-bar"), board: r(".board-wrapper"), cardCH: card?.clientHeight, cardSH: card?.scrollHeight, verbs, vh: innerHeight };
});
const flat = (o) => [o.case, o.card, o.foot, o.bar, o.board, [o.cardCH, o.cardSH], ...o.verbs].flat().map((v) => v ?? NaN);
for (const [en, eng] of ENGINES) {
  const b = await eng.launch();
  for (const [n, cell] of Object.entries(CELLS)) {
    const x = await open(b, A, cell, { prm: "reduce" }); const ga = await givens(x.page); const ra = await read(x.page); await x.ctx.close();
    const y = await open(b, B, cell, { prm: "reduce" }); const gb = await givens(y.page); const rb = await read(y.page); await y.ctx.close();
    const fa = flat(ra), fb = flat(rb); let mx = 0; for (let i = 0; i < Math.max(fa.length, fb.length); i++) { const d = Math.abs((fa[i] ?? NaN) - (fb[i] ?? NaN)); mx = Math.max(mx, Number.isNaN(d) ? Infinity : d); }
    console.log(`${en.padEnd(8)} ${n.padEnd(12)} givensEq ${ga === gb} max|Δ| ${mx === Infinity ? "SHAPE" : mx.toFixed(2)} | A case ${ra.case} card ${ra.card} CH/SH ${ra.cardCH}/${ra.cardSH} foot ${ra.foot} vh ${ra.vh} | B case ${rb.case} card ${rb.card} CH/SH ${rb.cardCH}/${rb.cardSH} foot ${rb.foot}`);
  }
  await b.close();
}
