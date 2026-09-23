import { readFileSync, readdirSync } from 'node:fs';
const SP = process.env.SP; const pat = new RegExp(process.argv[2] || '.');
const med = (a) => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
function win(F, key, idx, t0, t1) { // frames in [t0,t1]
  const fr = F.filter((f) => f.t >= t0 && f.t <= t1);
  const dts = []; const dps = [];
  for (let i = 1; i < fr.length; i++) { dts.push(fr[i].t - fr[i - 1].t); const a = idx == null ? fr[i][key] : fr[i][key]?.[idx]; const b = idx == null ? fr[i - 1][key] : fr[i - 1][key]?.[idx]; if (typeof a === 'number' && typeof b === 'number') dps.push(a - b); }
  const pos = dps.filter((d) => d > 0.0005); const m = med(pos);
  let worst = null; for (let i = 1; i < fr.length; i++) { const a = idx == null ? fr[i][key] : fr[i][key]?.[idx]; const b = idx == null ? fr[i - 1][key] : fr[i - 1][key]?.[idx]; const d = a - b; if (!worst || d > worst.raw) worst = { raw: d, d: r1(d * 100), from: r1(b * 100), to: r1(a * 100), at: fr[i].t, dt: r1(fr[i].t - fr[i - 1].t) }; }
  return { frames: fr.length, dtMed: r1(med(dts)), dtMax: r1(Math.max(...dts, 0)), over16: dts.filter((d) => d > 16.7).length, over25: dts.filter((d) => d > 25).length, over33: dts.filter((d) => d > 33.4).length, frozenMs: Math.round(dts.filter((d) => d > 25).reduce((a, b) => a + b - 16.7, 0)), dpMedPct: r1((m ?? 0) * 100), jumps: m ? pos.filter((d) => d > 2 * m).length : 0, worst };
}
const out = [];
for (const fn of readdirSync(SP + '/raw').filter((f) => pat.test(f)).sort()) {
  const d = JSON.parse(readFileSync(SP + '/raw/' + fn));
  const F = d.f; const G = F.filter((f) => f.g);
  const tMount = G[0]?.t; const wholeFrames = G.filter((f) => f.gw > 0 && f.gz === 0 && f.gp === 0 && f.g[3] === 1 && f.t < (G.find((x) => x.g[3] < 1)?.t ?? 0)).length;
  const tDraw0 = G.find((f) => f.g[3] > 0 && f.g[3] < 1)?.t; const tDrawn = tDraw0 != null ? G.find((f) => f.t > tDraw0 && f.g[3] >= 0.9995)?.t : null;
  const tSteady = F.find((f) => f.sb > 0 || f.sl > 0); const steadyKind = tSteady ? (tSteady.sb > 0 ? 'bitmap' : 'liveFilter') : null;
  const tLastTL = G.at(-1)?.t;
  const L = F.filter((f) => typeof f.lc === 'number'); const tL0 = L.find((f) => f.lc > 0)?.t; const tL99 = L.find((f) => f.lc >= 0.99)?.t;
  const C = F.filter((f) => typeof f.co === 'number'); const tC0 = C.find((f) => f.co > 0)?.t; const tC1 = C.find((f) => f.co >= 0.999)?.t;
  let glPop = null; for (let i = 1; i < F.length; i++) if (F[i].gl - F[i - 1].gl > 5) { glPop = { at: F[i].t, from: F[i - 1].gl, to: F[i].gl }; break; }
  const grid = tDraw0 != null ? win(F, 'g', 3, tDraw0 - 1, tDrawn ?? tDraw0 + 2000) : null;
  const gridCls = tDraw0 != null ? ['frame', 'sub', 'cell'].map((k, i) => { const w = win(F, 'g', i, tDraw0 - 1, tDrawn ?? tDraw0 + 2000); return [k, w.worst?.d, w.jumps, w.dpMedPct]; }) : null;
  // per-line: max single-painted-frame progress delta, and frames where a line moves > 2x its own median step
  let lineWorst = null, lineJumps = 0, lineSteps = 0; const PL = G.filter((f) => f.pl);
  if (PL.length > 1) { const n = PL[0].pl.length; for (let j = 0; j < n; j++) { const ds = []; for (let i = 1; i < PL.length; i++) { const dd = PL[i].pl[j] - PL[i - 1].pl[j]; if (dd > 0.0005) { ds.push([dd, PL[i].t, PL[i].t - PL[i - 1].t, PL[i - 1].pl[j]]); } } const m = med(ds.map((x) => x[0])); lineSteps += ds.length; for (const x of ds) { if (m && x[0] > 2 * m) lineJumps++; if (!lineWorst || x[0] > lineWorst.raw) lineWorst = { raw: x[0], line: j, d: r1(x[0] * 100), from: r1(x[3] * 100), at: x[1], dt: r1(x[2]) }; } } }
  const oneFrameLines = (() => { let c = 0; if (PL.length > 1) { const n = PL[0].pl.length; for (let j = 0; j < n; j++) { const vis = PL.filter((f) => f.pl[j] > 0.001 && f.pl[j] < 0.999).length; if (vis <= 1) c++; } } return c; })();
  const logo = tL0 != null ? win(F, 'lc', null, tL0 - 1, tL99 ?? tL0 + 1500) : null;
  const ctl = tC0 != null ? win(F, 'co', null, tC0 - 20, tC1 ?? tC0 + 600) : null;
  const inW = (t, a, b) => t >= a && t <= b;
  const blobs = d.bake.filter((b) => b[0] === 'blobcall');
  const byW = {}; for (const b of blobs) { const k = b[3]; (byW[k] ??= { n: 0, sum: 0, max: 0, inGrid: 0, inLogo: 0, first: b[1] }); byW[k].n++; byW[k].sum += b[2]; byW[k].max = Math.max(byW[k].max, b[2]); if (tDraw0 != null && inW(b[1], tDraw0, tDrawn ?? 1e9)) byW[k].inGrid++; if (tL0 != null && inW(b[1], tL0, tL99 ?? 1e9)) byW[k].inLogo++; }
  for (const k in byW) { byW[k].sum = Math.round(byW[k].sum); byW[k].max = r1(byW[k].max); }
  const ltIn = tDraw0 != null ? d.lt.filter((l) => l[0] + l[1] >= tDraw0 && l[0] <= (tDrawn ?? 1e9)) : [];
  const loafIn = tDraw0 != null ? d.loaf.filter((l) => l.s + l.d >= tDraw0 && l.s <= (tDrawn ?? 1e9)) : [];
  const fontsReady = d.ev.find((e) => e[1] === 'fontsready')?.[0];
  out.push({ run: fn.replace('.json', ''), nav: d.nav, fontsReady: r1(fontsReady), tMount, wholeFramesBeforeDraw: wholeFrames, tDraw0, tDrawn, drawMs: tDrawn && tDraw0 ? r1(tDrawn - tDraw0) : null, tLastTransition: tLastTL, tSteady: tSteady?.t, steadyKind, grid, gridCls, lineWorst, lineJumps, lineSteps, linesSeenPartialInAtMost1Frame: oneFrameLines, logo: logo && { ...logo, t0: tL0, t99: tL99 }, controls: ctl && { t0: tC0, t1: tC1, frames: ctl.frames, worst: ctl.worst }, glPop, bakes: byW, longtasksInGrid: ltIn, loafInGrid: loafIn.map((l) => ({ s: l.s, d: l.d, top: l.sc[0]?.[1]?.slice(0, 60), topMs: l.sc[0]?.[0] })) });
}
console.log(JSON.stringify(out, null, process.env.PRETTY ? 1 : 0));
