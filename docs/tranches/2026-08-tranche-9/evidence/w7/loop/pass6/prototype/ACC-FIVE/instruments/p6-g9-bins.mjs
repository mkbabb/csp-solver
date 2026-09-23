/** ACC-FIVE pass 6 · G9's off-family pixels NAMED: per 10° bin outside 40–115° (blue bin excluded),
 *  the pixel count and the bounding box, then the element under each bin's modal pixel (the
 *  topmost painted element at that point, pointer-events ignored). chromium dark + light, 10 hints. */
import { chromium, mintFromControl, assertSameBoard, rawOf } from "./p6-lib.mjs";
const [TREE, CTRL] = process.argv.slice(2);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const ok = (r, g, b) => { const [R, G, B] = [lin(r), lin(g), lin(b)]; const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B); const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s; return { C: Math.hypot(A, Bb), h: ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360 }; };
const board = await mintFromControl(CTRL);
const b = await chromium.launch();
for (const scheme of ["dark", "light"]) for (const [arm, base] of [["tree", TREE], ["control", CTRL]]) {
  const p = await (await b.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto(base + board.query); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1500); await assertSameBoard(p, board.cells);
  for (let i = 0; i < 10; i++) { await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await p.waitForTimeout(150); }
  await p.evaluate(() => document.activeElement?.blur?.()); await p.mouse.move(2, 2); await p.waitForTimeout(1500);
  const R = await rawOf(await p.screenshot());
  const bins = new Map(); let chr = 0;
  for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) { const i = (y * R.w + x) * 4; const o = ok(R.data[i], R.data[i + 1], R.data[i + 2]); if (o.C < 0.05) continue; chr++; if ((o.h >= 40 && o.h <= 115) || (o.h >= 240 && o.h <= 270)) continue; const k = Math.floor(o.h / 10) * 10; const e = bins.get(k) ?? { n: 0, x0: 1e9, y0: 1e9, x1: -1, y1: -1, pts: [] }; e.n++; e.x0 = Math.min(e.x0, x); e.y0 = Math.min(e.y0, y); e.x1 = Math.max(e.x1, x); e.y1 = Math.max(e.y1, y); if (e.pts.length < 400 && (e.n % 7 === 0)) e.pts.push([x, y]); bins.set(k, e); }
  const top = [...bins.entries()].sort((a, c) => c[1].n - a[1].n).slice(0, 6);
  const lines = [];
  for (const [k, e] of top) {
    const who = await p.evaluate((pts) => { const c = new Map(); for (const [x, y] of pts) { const el = document.elementsFromPoint(x, y)[0]; const key = el ? `${el.tagName.toLowerCase()}.${String(el.getAttribute("class") ?? "").split(" ").filter(Boolean).slice(0, 2).join(".")}` : "none"; c.set(key, (c.get(key) ?? 0) + 1); } return [...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([a, n]) => `${a}×${n}`).join(", "); }, e.pts);
    lines.push(`${k}°: ${e.n} px (${((e.n / chr) * 100).toFixed(2)}% of ${chr}) box ${e.x0},${e.y0}–${e.x1},${e.y1} · ${who}`);
  }
  console.log(`${scheme} ${arm}:\n  ${lines.join("\n  ")}`);
  await p.context().close();
}
await b.close();
