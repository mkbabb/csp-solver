// critic analyzer: one run file -> per-flip numbers (summaries only)
import { readFileSync } from "node:fs";
const rgb = (s) => (s ? s.match(/[\d.]+/g).slice(0, 3).map(Number) : null);
const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const r2 = (x) => (x == null ? null : +x.toFixed(2));
for (const file of process.argv.slice(2)) {
  const J = JSON.parse(readFileSync(file, "utf8"));
  const name = file.split("/").pop().replace(".json", "");
  for (const run of J.runs) {
    const F = run.frames; const c = run.clicks[0]; if (c == null) { console.log(name, run.i, "NO CLICK"); continue; }
    const T = (f) => f.t - c;
    const d0 = F[0].dark, dN = F[F.length - 1].dark;
    const W = F.filter((f) => T(f) >= 0 && T(f) <= 1300);
    const dts = W.slice(1).map((f, i) => f.t - W[i].t);
    const maxDt = Math.max(...dts), medDt = [...dts].sort((a, b) => a - b)[dts.length >> 1];
    const flipF = W.find((f) => f.dark !== d0);
    const toDark = !d0;
    const inK = toDark ? "moon" : "sun", outK = toDark ? "sun" : "moon";
    const live = (f, k) => f[k] && f[k].v && f[k].op > 0.02 && f.turning;
    // G1
    let transl = 0, both = 0;
    for (const f of W) { let t = false; for (const k of ["sun", "moon"]) { const b = f[k]; if (!b || !b.v || !f.turning) continue; if (b.op > 0.02 && b.op < 0.98) t = true; if (b.op > 0.02) for (const a of [b.st, b.dot]) if (a != null && a > 0.02 && a < 0.98) t = true; } if (t) transl++; if (live(f, "sun") && live(f, "moon")) both++; }
    // page half-swap
    const p0 = rgb(F[0].pr)[0], p1 = rgb(F[F.length - 1].pr)[0];
    const half = W.find((f) => Math.abs(rgb(f.pr)[0] - p0) >= Math.abs(p1 - p0) / 2);
    const land = W.find((f) => rgb(f.pr)[0] === p1 && T(f) > 0 && f.dark === dN);
    const outAtHalf = half ? (live(half, outK) ? half[outK].s : 0) : null;
    let crest = { s: 0 }; for (const f of W) if (live(f, inK) && f[inK].s > crest.s) crest = { s: f[inK].s, t: T(f) };
    const hoIdx = W.findIndex((f, i) => i > 2 && !f.turning);
    const ho = hoIdx > 0 ? { t: T(W[hoIdx]), s: W[hoIdx - 1][inK].s } : null;
    // steps (dS) incoming while live
    let dS = 0; for (let i = 1; i < W.length; i++) if (live(W[i], inK) && live(W[i - 1], inK)) dS = Math.max(dS, Math.abs(W[i][inK].s - W[i - 1][inK].s));
    const born = W.find((f) => live(f, inK));
    // board ink contrast per frame
    const ink = (key) => { const v = W.filter((f) => f[key] && f.bw).map((f) => ({ t: T(f), c: cr(rgb(f[key]), rgb(f.bw)) })); if (!v.length) return null; const mn = v.reduce((m, x) => (x.c < m.c ? x : m)); const under = v.filter((x) => x.c < 3); return { min: r2(mn.c), at: Math.round(mn.t), under: under.length, span: under.length ? `${Math.round(under[0].t)}..${Math.round(under[under.length - 1].t)}` : "" }; };
    const g = ink("gv"), u = ink("us");
    console.log([name, `#${run.i}`, `${d0 ? "D" : "L"}->${dN ? "D" : "L"}`, `flip+${flipF ? Math.round(T(flipF)) : "-"}`, `half+${half ? Math.round(T(half)) : "-"} out@half=${outAtHalf}`, `land+${land ? Math.round(T(land)) : "-"}`, `crest ${crest.s}@+${crest.t} (c-l ${land && crest.t != null ? Math.round(crest.t - T(land)) : "-"})`, `ho ${ho ? ho.s + "@+" + Math.round(ho.t) : "-"}`, `born ${born ? born[inK].s : "-"}`, `dS ${r2(dS)}`, `transl ${transl} both ${both}`, `given ${g ? `${g.min}@${g.at} u3=${g.under} ${g.span}` : "-"}`, `user ${u ? `${u.min}@${u.at} u3=${u.under} ${u.span}` : "-"}`, `dt med ${r2(medDt)} max ${r2(maxDt)}`, `btnMut ${run.gestureBtnStyleMut}`, `settleTf ${run.settleTf}`].join(" | "));
  }
  if (J.errors && J.errors.length) console.log(name, "errors", J.errors.join("|"));
}
