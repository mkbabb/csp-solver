// G-DRAWIN analysis: one row per raw run (post-rAF sampler, init3.js). node an3.mjs <SP> [regex]
import { readFileSync, readdirSync } from 'node:fs';
const SP = process.argv[2]; const pat = new RegExp(process.argv[3] || '.');
const med = (a) => { const b = a.filter((x) => x != null).sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : null; };
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
const out = [];
for (const fn of readdirSync(SP + '/raw').filter((f) => pat.test(f)).sort()) {
  const d = JSON.parse(readFileSync(SP + '/raw/' + fn)); const F = d.f;
  const dts = []; for (let i = 1; i < F.length; i++) dts.push(F[i].t - F[i - 1].t);
  const G0 = F.filter((f) => f.pl);
  const tDraw0 = G0.find((f) => f.gp > 0)?.t ?? null;
  // the draw window only: a masked arm's lines read whole inside the <mask> before priming
  const G = G0.filter((f) => tDraw0 == null || f.t >= tDraw0 - 40);
  // drawn = the transition layer's lines all whole after the draw began (or the layer gone)
  let tDrawn = null; if (tDraw0 != null) { const i0 = F.findIndex((f) => f.t === tDraw0); for (let i = i0; i < F.length; i++) { const f = F[i]; if (!f.pl || f.pl.every((p) => p >= 0.999)) { tDrawn = f.t; break; } } }
  const tRub0 = F.find((f) => f.rx != null)?.t ?? null; const tRub1 = tRub0 != null ? F.find((f) => f.t > tRub0 && f.rx == null)?.t ?? null : null;
  const tGiven = F.find((f) => f.gv && f.gv[3] > 0 && f.gv[1] === 0 && f.gv[2] === 0 && f.gv[0] >= 0.999 && (tDraw0 == null || f.t > tDraw0))?.t ?? null;
  const tBoil = F.find((f) => f.sb === 4)?.t ?? null;
  const tCo0 = F.find((f) => (f.co ?? 1) > 0 && (f.co ?? 1) < 1)?.t ?? null;
  // per-line worst single-painted-frame Δ, by tier; frame as % of the perimeter
  const tiers = { frame: [], sub: [], cell: [] }; let worstAll = null; let neverPartial = 0; const frac20 = [];
  if (G.length > 1) {
    const n = G[0].pl.length; const nf = G[0].nf ?? 1, ns = G[0].ns ?? 0;
    for (let j = 0; j < n; j++) {
      const tier = j < nf ? 'frame' : j < nf + ns ? 'sub' : 'cell';
      let w = 0, wAt = null; let vis = 0; let tS = null, tE = null;
      for (let i = 1; i < G.length; i++) { if (!G[i].pl || !G[i - 1].pl || G[i].pl.length !== n) continue; const dd = G[i].pl[j] - G[i - 1].pl[j]; if (dd > w) { w = dd; wAt = G[i].t; } const p = G[i].pl[j]; if (p > 0.001 && p < 0.999) vis++; if (tS == null && p > 0.001) tS = G[i - 1].t; if (tE == null && p >= 0.999 && tS != null) tE = G[i].t; }
      tiers[tier].push(w); if (!worstAll || w > worstAll.d) worstAll = { d: w, line: j, at: wAt };
      if (vis < 2) neverPartial++;
      if (tier !== 'frame' && tS != null && tE != null && tE - tS > 40) { const tt = tS + 0.2 * (tE - tS); let a = null; for (let i = 1; i < G.length; i++) if (G[i].t >= tt && G[i].pl && G[i - 1].pl) { const f0 = G[i - 1], f1 = G[i]; a = f0.pl[j] + (f1.pl[j] - f0.pl[j]) * ((tt - f0.t) / (f1.t - f0.t || 1)); break; } if (a != null) frac20.push(a); }
    }
  }
  const mx = (a) => (a.length ? r1(Math.max(...a) * 100) : null);
  const inDraw = tDraw0 != null ? F.filter((f) => f.t >= tDraw0 && f.t <= (tDrawn ?? tDraw0 + 5000)) : [];
  const dDraw = []; for (let i = 1; i < inDraw.length; i++) dDraw.push(inDraw[i].t - inDraw[i - 1].t);
  const gpMax = Math.max(0, ...inDraw.map((f) => f.gp ?? 0));
  const tpMax = Math.max(0, ...F.map((f) => f.tp ?? 0));
  const w0 = Math.min(...[tRub0, tDraw0].filter((x) => x != null)); const w1 = Math.max(...[tDrawn, tGiven, tRub1].filter((x) => x != null));
  const encodes = d.bake.filter((b) => b[0] === 'draw' && b[3] > 100);
  const encIn = Number.isFinite(w0) && Number.isFinite(w1) ? encodes.filter((b) => b[1] >= w0 && b[1] <= w1) : [];
  const liveGrid = F.filter((f) => f.sl > 0 && (tBoil == null || f.t < tBoil)).length;
  const liveLogo = F.filter((f) => f.ll > 0 && f.lc !== 0 && (tBoil == null || f.t < tBoil)).length;
  // erase: mean progress falls after it was whole
  let erases = 0, seenWhole = false, prev = null; for (const f of G) { const g = f.g?.[3]; if (g == null) continue; if (prev != null && seenWhole && g < prev - 0.02) { erases++; seenWhole = false; } if (g >= 0.999 && prev != null && prev < 0.999) seenWhole = true; prev = g; }
  const lcVals = [...new Set(F.map((f) => f.lc).filter((x) => typeof x === 'number'))];
  const rxs = F.filter((f) => f.rx != null); let rxWorst = 0; for (let i = 1; i < rxs.length; i++) rxWorst = Math.max(rxWorst, (rxs[i].rx - rxs[i - 1].rx) / (rxs[i].rw || 1));
  out.push({ run: fn.replace('.json', ''), dtMed: r1(med(dts)), hz: r1(1000 / (med(dts) || 1)), tRub0, tRub1, tDraw0, tDrawn, drawMs: tDrawn && tDraw0 ? r1(tDrawn - tDraw0) : null, tGiven, tBoil, tCo0,
    worst: { frame: mx(tiers.frame), sub: mx(tiers.sub), cell: mx(tiers.cell) }, worstAll: worstAll && { d: r1(worstAll.d * 100), line: worstAll.line, at: worstAll.at },
    dtDrawMax: r1(Math.max(0, ...dDraw)), over34: dDraw.filter((x) => x > 34).length, neverPartial, gpMax, tpMax, frac20Med: r1((med(frac20) ?? NaN) * 100),
    encIn: encIn.map((b) => `${b[1]}:${b[2]}ms@${b[3]}`), encAll: encodes.map((b) => `${b[1]}:${b[2]}@${b[3]}`), liveGrid, liveLogo, erases, lcVals, rubWorstPctPerFrame: r1(rxWorst * 100), inj: d.inj || null,
    loaf: (d.loaf || []).filter((l) => l.d > 50).map((l) => `${l.s}+${l.d}:${l.sc?.[0]?.[1]?.slice(0, 40) ?? ''}`) });
}
console.log(JSON.stringify(out, null, process.env.PRETTY ? 1 : 0));
