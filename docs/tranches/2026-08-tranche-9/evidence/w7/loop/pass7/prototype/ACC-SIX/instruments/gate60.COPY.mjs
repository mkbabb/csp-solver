/**
 * ACC-FIVE pass-7 CRITIC · THE WHOLE-MS FLOOR'S 60 Hz PRICE (the prototype's gap 2, "unread").
 * Loads the SERVED tree's own `frontGate` (vite dev module graph, no copy) into a page and drives it
 *  (A) SYNTH: frame timestamps at a true 60 Hz (k·16.667 ms) quantised to whole ms (WebKit's grain) and
 *      at full precision, one non-forced write per frame, 2 s — counts commits/s and the commit gaps;
 *  (B) NATIVE: the engine's own requestAnimationFrame for 2 s, each frame writing on its rAF timestamp
 *      (the `at` frontTween hands the gate) — the real panel clock of this engine.
 * The clock-grain detector is the module's own (performance.now() reads inside write()).
 *   node gate60.mjs <engine> <base>
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
const [ENG, BASE] = process.argv.slice(2);
const b = await pw[ENG].launch();
const p = await b.newPage();
await p.goto(BASE + "/?size=3&difficulty=EASY");
await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
const r = await p.evaluate(async () => {
  const m = await import("/src/pencil/grid/gridPaths.ts");
  const summ = (ts) => { const g = ts.slice(1).map((x, i) => +(x - ts[i]).toFixed(2)); const hist = {}; g.forEach((x) => (hist[Math.round(x)] = (hist[Math.round(x)] ?? 0) + 1)); return { commits: ts.length, perS: +((ts.length - 1) / ((ts.at(-1) - ts[0]) / 1000)).toFixed(1), minGap: Math.min(...g), hist }; };
  const synth = (quant) => { const c = []; let cur = 0; const g = m.frontGate((v) => c.push(cur)); const t0 = Math.round(performance.now()) + 1000; for (let k = 0; k < 120; k++) { const t = t0 + k * (1000 / 60); cur = quant ? Math.round(t) : t; g.write(k / 120, false, cur); } return summ(c); };
  const pn = []; for (let i = 0; i < 50; i++) pn.push(performance.now());
  const grain = pn.every((x) => Math.abs(x - Math.round(x)) < 1e-9) ? "whole-ms" : "fine";
  const A_q = synth(true), A_f = synth(false);
  // (C) the tween's own at: origin + ((ts − startTime) / SPAN) · SPAN, exactly frontTween's arithmetic (pencil-boil raw = (ts − start)/durationMs)
  const tweenAt = () => { const c = []; let cur = 0; const g = m.frontGate(() => c.push(cur)); const SPAN = 600000; const start = Math.round(performance.now()) + 1000; const origin = start; let swallowed17 = 0, prevAt = null, lastC = null; for (let k = 1; k < 120; k++) { const ts = start + Math.round(k * (1000 / 60)); const at = origin + ((ts - start) / SPAN) * SPAN; cur = at; const n0 = c.length; g.write(k / 120, false, at); if (c.length === n0 && lastC !== null && Math.round(at - lastC) >= 17) swallowed17++; if (c.length > n0) lastC = at; } return { ...summ(c), swallowedAtWhole17: swallowed17 }; };
  const C_t = tweenAt();
  const native = await new Promise((res) => { const c = [], ticks = []; let cur = 0; const g = m.frontGate(() => c.push(cur)); let n = 0; const t0 = performance.now(); const f = (ts) => { ticks.push(ts); cur = ts; g.write(n++ / 999, false, ts); if (ts - t0 < 2000) requestAnimationFrame(f); else res({ c, ticks }); }; requestAnimationFrame(f); });
  const tk = native.ticks.slice(1).map((x, i) => x - native.ticks[i]).sort((a, b) => a - b);
  return { grain, FRONT_MIN_MS: m.FRONT_MIN_MS, synth60_wholeMs: A_q, synth60_fine: A_f, synth60_tweenAt: C_t, native: { rafHz: +(1000 / tk[tk.length >> 1]).toFixed(1), rafFrac: native.ticks.some((x) => Math.abs(x - Math.round(x)) > 1e-6), frames: native.ticks.length, ...summ(native.c) } };
});
console.log(ENG, BASE, JSON.stringify(r));
await b.close();
