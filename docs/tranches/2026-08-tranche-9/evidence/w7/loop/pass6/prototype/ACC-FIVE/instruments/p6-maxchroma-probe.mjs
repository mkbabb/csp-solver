/** ACC-FIVE pass 6 · WHERE the corridor's max-chroma pixel sits: the band of progress-corridor.spec
 *  (top edge, 80 % wide, 26 rows from box.y − 10), the most chromatic pixel within 45° of the gold
 *  anchor, its OKLCH, and the ground at the same device pixel on the untraced board. */
import { chromium, webkit, rawOf, ratio } from "./p6-lib.mjs";
const [BASE] = process.argv.slice(2);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const ok = ([r, g, b]) => { const [R, G, B] = [lin(r), lin(g), lin(b)]; const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B); const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s; return { L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, C: Math.hypot(A, Bb), h: ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360 }; };
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const p = await (await b.newContext({ colorScheme: "light", reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
  await p.goto(BASE + "/?size=3&difficulty=EASY"); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(2000);
  const box = await p.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = { x: Math.round(box.x + box.width * 0.1), y: Math.round(box.y - 10), width: Math.round(box.width * 0.8), height: 26 };
  const bare = await rawOf(await p.screenshot({ clip }));
  for (let i = 0; i < 26; i++) { const ok2 = await p.evaluate(() => { const b = document.querySelector('[aria-label*="Hint" i]'); if (!b || b.disabled) return false; b.click(); return true; }); if (!ok2) break; await p.waitForTimeout(130); }
  await p.evaluate(() => document.activeElement?.blur?.()); await p.waitForTimeout(1000);
  const S = await rawOf(await p.screenshot({ clip }));
  let best = null;
  for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) { const i = (y * S.w + x) * 4; const rgb = [S.data[i], S.data[i + 1], S.data[i + 2]]; const o = ok(rgb); if (o.C < 0.05) continue; const gap = Math.min(Math.abs(o.h - 83.7), 360 - Math.abs(o.h - 83.7)); if (gap > 45) continue; if (!best || o.C > best.o.C) best = { x, y, rgb, o, ground: [bare.data[i], bare.data[i + 1], bare.data[i + 2]] }; }
  const tok = ok([162, 120, 3]);
  console.log(`${name}: max-chroma ${best.rgb} L ${best.o.L.toFixed(3)} C ${best.o.C.toFixed(3)} h ${best.o.h.toFixed(1)} at band (${best.x},${best.y}); untraced ground there ${best.ground} (vs paper 253 ratio ${ratio(best.ground, [253, 253, 252]).toFixed(3)}); ratio to that ground ${ratio(best.rgb, best.ground).toFixed(3)}; token L ${tok.L.toFixed(3)} C ${tok.C.toFixed(3)}`);
  await b.close();
}
