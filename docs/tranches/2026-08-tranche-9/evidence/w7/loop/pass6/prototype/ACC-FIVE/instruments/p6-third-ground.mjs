/** ACC-FIVE pass 6 · WHO PAINTS rgb(230,230,228) under the trace: locate those pixels (trace hidden),
 *  report their offset from the board-wrapper's edge, and the wrapper's border/shadow/radius. */
import { chromium, rawOf } from "./p6-lib.mjs";
const [TREE] = process.argv.slice(2);
const b = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const p = await (await b.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto(TREE + "/?size=3&difficulty=EASY"); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(2000);
  const w = await p.evaluate(() => {
    const el = document.querySelector(".board-wrapper"); const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const svg = document.querySelector("svg.hand-drawn-grid").getBoundingClientRect();
    return { rect: [r.x, r.y, r.width, r.height], border: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`, shadow: cs.boxShadow, radius: cs.borderTopLeftRadius, outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`, bg: cs.backgroundColor, svg: [svg.x, svg.y, svg.width, svg.height] };
  });
  await p.evaluate(() => { const s = document.createElement("style"); s.textContent = "html body .progress-trace{visibility:hidden!important}"; document.head.appendChild(s); });
  await p.waitForTimeout(250);
  const [x0, y0, ww, hh] = w.rect;
  const clip = { x: x0 - 8, y: y0 - 8, width: ww + 16, height: hh + 16 };
  const H = await rawOf(await p.screenshot({ clip }));
  // scan the top edge row by row at the board's horizontal centre, 8 px outside to 16 px inside
  const cx = Math.round(ww / 2) + 8;
  const col = [];
  for (let y = 0; y < 30; y++) { const i = (y * H.w + cx) * 4; col.push(`${y - 8}:(${H.data[i]},${H.data[i + 1]},${H.data[i + 2]})`); }
  console.log(`${scheme} wrapper ${JSON.stringify(w)}\n  top-edge column at centre (y rel. wrapper top): ${col.join(" ")}`);
}
await b.close();
