// does any (hue, chroma×m) for hand 2 hold the whole law over 3 issued hands? (quick probe)
import { join } from "node:path";
import { registerHooks } from "node:module";
registerHooks({ resolve(spec, ctx, next) { try { return next(spec, ctx); } catch (e) { if (/^\.\.?\//.test(spec)) return next(`${spec}.ts`, ctx); throw e; } } });
const fe = process.argv[2];
const L = await import(join(fe, "scripts/shape-census.mjs"));
const W = await import(join(fe, "src/games/shared/playerIdentity.ts"));
const lab = (Lv, C, h) => { const c = L.parseColor(`oklch(${Lv} ${C} ${h})`); return L.srgbToOklab(c.rgb.map((v) => Math.round(v * 255) / 255)); };
const parts = (s) => { const m = /oklch\(var\([^)]+\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s); return { C: +m[1], h: +m[2] }; };
const S = [["--color-user-ink", [0.44, 0.65], [0.1, 0.1]], ["--color-peer-cursor-ink", [0.295, 0.79], [0.075, 0.1]], ["--color-peer-name-ink", [0.295, 0.86], [0.1, 0.1]]];
let found = 0;
for (const m of [1, 1.5, 2, 3]) for (let h = 0; h < 360; h += 1) {
  let ok = true;
  for (const [k, bands, floors] of S) for (const a of [0, 1]) {
    const p2 = parts(W.inkFor(2)[k]);
    const q = lab(bands[a], p2.C * m, h);
    for (const i of [0, 1]) { const pi = parts(W.inkFor(i)[k]); const r = lab(bands[a], pi.C, pi.h); if (Math.hypot(q[0]-r[0], q[1]-r[1], q[2]-r[2]) < floors[a]) ok = false; }
  }
  if (ok) { found++; if (found < 4) console.log("ok", m, h); }
}
console.log("found", found);
