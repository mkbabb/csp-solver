// G-TOGGLE analyzer — one run file → per-flip gate readings (numbers only)
import { readFileSync } from "node:fs";
const rgb = (s) => (s && s.match(/[\d.]+/g) ? s.match(/[\d.]+/g).slice(0, 3).map(Number) : null);
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const GRID = { light: [38, 38, 38], dark: [209, 207, 199] };
export function analyze(file) {
  const J = JSON.parse(readFileSync(file, "utf8")); const out = [];
  for (const r of J.runs) {
    const actAt = r.clicks && r.clicks.length ? r.clicks[0] : r.actAt; const clockSrc = r.clicks && r.clicks.length ? "click" : "pre-click";
    const i0 = Math.max(0, r.frames.findIndex((f) => f.t >= actAt - 0.5) - 1);
    const F = r.frames.slice(i0).filter((f) => f.t <= actAt + 1500);
    const T = (f) => +(f.t - actAt).toFixed(0);
    const dts = F.slice(1).map((f, i) => +(f.t - F[i].t).toFixed(1));
    const toDark = r.direction.endsWith("dark") !== r.direction.startsWith("dark") ? r.direction.endsWith("dark") : !r.direction.startsWith("dark");
    const inK = toDark ? "moon" : "sun", outK = toDark ? "sun" : "moon";
    const restK = (k) => (k === "sun" ? "rs" : "rm");
    const live = (f, k) => { const L = f[k]; return L && L.vis === "v" && L.op > 0.02; };
    const app = (f, k) => { const L = f[k], R = f[restK(k)];
      if (live(f, k)) { const cs = L.sc && L.sc !== "none" ? Math.max(...L.sc.split(" ").map(Number)) : 1; return { s: L.ws, S: +(L.ws * cs).toFixed(4), r: L.wr, op: L.op, via: "live", f: L.f }; }
      if (R && R.vis === "v" && R.op > 0.02) return { s: 1, S: 1, r: 0, op: R.op, via: "rest", pose: R.pose }; return { s: 0, S: 0, op: 0, via: "none" }; };
    const win = F.filter((f) => f.t >= actAt && f.t <= actAt + 1100);
    const wd = dts.filter((d, i) => F[i + 1].t >= actAt && F[i + 1].t <= actAt + 1100);
    const sd = [...wd].sort((a, b) => a - b);
    // G1 one body + opacity law
    const both = win.filter((f) => live(f, "sun") && live(f, "moon")).map(T);
    const dbl = win.filter((f) => live(f, "sun") && live(f, "moon") && f.sun.op > 0.5 && f.moon.op > 0.5 && f.sun.ws > 0.5 && f.moon.ws > 0.5).map(T);
    const trans = [];
    for (const f of win) for (const k of ["sun", "moon"]) { const L = f[k]; if (!L || L.vis !== "v") continue; for (const [nm, o] of [["body", L.op], ["star", L.st && L.st.op], ["dot", L.dot && L.dot.op]]) if (o != null && o > 0.02 && o < 0.98) trans.push(`${k}.${nm}@+${T(f)}=${o}`); }
    // born / steps / crest / out
    const steps = []; for (let i = 1; i < F.length; i++) { const a = app(F[i - 1], inK), b = app(F[i], inK); if (a.via === "live" && b.via === "live" && F[i].t >= actAt) steps.push(Math.abs(b.s - a.s)); }
    const born = F.find((f) => f.t >= actAt && app(f, inK).via === "live");
    const crest = F.reduce((m, f) => { const a = app(f, inK); return a.via === "live" && a.s > m.s ? { s: a.s, t: T(f) } : m; }, { s: 0 });
    const outVis = F.filter((f) => f.t >= actAt && app(f, outK).via === "live"); const outLast = outVis[outVis.length - 1];
    // G3 follow + blot
    const accentLead = outVis.filter((f) => { const L = f[outK]; return L.ws >= 0.8 && L.st && L.st.op < 0.9; }).length;
    const blot = outVis.filter((f) => { const L = f[outK]; return L.op > 0.02 && L.op < 0.2 && L.ws > 0.25; }).length;
    const outOpNot1 = outVis.filter((f) => f[outK].op < 0.98).length;
    // page swap
    const ch = (f) => (f.pr && f.pr.match(/\d+/) ? +f.pr.match(/\d+/)[0] : null);
    const c0 = ch(F[0]), c1 = ch(F[F.length - 1]);
    const prChanges = F.filter((f, i) => i > 0 && f.pr !== F[i - 1].pr && f.t >= actAt);
    const pageFirst = prChanges[0] ? T(prChanges[0]) : null, pageLast = prChanges.length ? T(prChanges[prChanges.length - 1]) : null;
    const half = F.find((f) => f.t >= actAt && c0 != null && Math.abs(ch(f) - c0) >= Math.abs(c1 - c0) / 2);
    const atHalf = half ? { t: T(half), out: app(half, outK).S, outOp: app(half, outK).op } : null;
    const darkAt = (() => { const i = F.findIndex((f, j) => j > 0 && f.dark !== F[j - 1].dark); return i > 0 ? T(F[i]) : null; })();
    // settle
    const iSet = F.findIndex((f, i) => i > 0 && f.t > actAt && app(f, inK).via === "rest" && app(F[i - 1], inK).via === "live");
    const settle = iSet > 0 ? { t: T(F[iSet]), liveS: app(F[iSet - 1], inK).S, warp: app(F[iSet - 1], inK).s, liveF: app(F[iSet - 1], inK).f, restPose: F[iSet][restK(inK)].pose } : null;
    const turningOff = (() => { const i = F.findIndex((f, j) => j > 0 && !f.turning && F[j - 1].turning); return i > 0 ? T(F[i]) : null; })();
    // G6 field steps per body while live
    const fields = (k) => { const v = F.filter((f) => f.t >= actAt && live(f, k)).map((f) => f[k].f); let n = 0; for (let i = 1; i < v.length; i++) if (v[i] !== v[i - 1]) n++; return { steps: n, distinct: [...new Set(v)].join(" "), visibleMs: v.length ? +(F.filter((f) => f.t >= actAt && live(f, k)).slice(-1)[0].t - F.filter((f) => f.t >= actAt && live(f, k))[0].t).toFixed(0) : 0 }; };
    // G4 contrast per frame: grid (active pose href → theme) and a given digit (computed stroke) vs .board-wrapper
    const oldTheme = toDark ? "light" : "dark", newTheme = toDark ? "dark" : "light";
    const oldSet = new Set((F[0].grid || "").split(","));
    const cser = F.filter((f) => f.t >= actAt - 1).map((f) => { const bg = rgb(f.bw); const gi = f.gA == null ? null : oldSet.has(f.gA) ? GRID[oldTheme] : GRID[newTheme]; const di = rgb(f.dig); return { t: T(f), g: bg && gi ? +cr(gi, bg).toFixed(2) : null, d: bg && di ? +cr(di, bg).toFixed(2) : null, gNew: gi === GRID[newTheme], dig: f.dig }; });
    const minOf = (k) => { const v = cser.filter((s) => s[k] != null); if (!v.length) return null; const m = v.reduce((a, b) => (b[k] < a[k] ? b : a)); const u = v.filter((s) => s[k] < 3); return { min: m[k], at: m.t, under3: u.length ? `${u.length}f +${u[0].t}…+${u[u.length - 1].t}` : 0 }; };
    const gridSwapAt = (cser.find((s) => s.gNew) || {}).t ?? null;
    const digSwapAt = (() => { const d0 = cser[0] && cser[0].dig; const s = cser.find((x) => x.dig !== d0); return s ? s.t : null; })();
    const digDistinct = new Set(cser.map((s) => s.dig)).size;
    const bwDistinct = new Set(F.map((f) => f.bw)).size;
    const bwChangeAt = (() => { const s = F.find((f, i) => i > 0 && f.bw !== F[i - 1].bw && f.t >= actAt); return s ? T(s) : null; })();
    out.push({ label: r.label, dir: r.direction,
      frameMs: { min: sd[0], median: sd[sd.length >> 1], max: sd[sd.length - 1] }, over: { f16: wd.filter((d) => d > 16.7).length, f34: wd.filter((d) => d > 34).length, f50: wd.filter((d) => d > 50).length },
      G1: { dbl: dbl.length ? `${dbl.length}f +${dbl[0]}…+${dbl[dbl.length - 1]}` : 0, bothLive: both.length ? `${both.length}f +${both[0]}…+${both[both.length - 1]}` : 0, translucent: trans.length, transEx: trans.slice(0, 4) },
      born: born ? { t: T(born), s: app(born, inK).s, op: app(born, inK).op } : null, dS: steps.length ? +Math.max(...steps).toFixed(3) : null,
      crest, out: outLast ? { last: T(outLast), s: app(outLast, outK).s, op: app(outLast, outK).op } : null,
      G2: { half: atHalf, crestMinusLanding: pageLast != null ? crest.t - pageLast : null, handoffMinusLanding: settle && pageLast != null ? settle.t - pageLast : null, page: [pageFirst, pageLast] },
      G3: { accentLead, blot, outOpNot1 },
      G4: { grid: minOf("g"), digit: minOf("d"), gridSwapAt, digSwapAt, digDistinct, bwChangeAt, bwDistinct },
      G6: { in: fields(inK), out: fields(outK) },
      G7: { settle, turningOff, still: r.still },
      G10: { darkAt, clock: clockSrc, clicks: (r.clicks || []).map((c) => +(c - actAt).toFixed(0)) },
      bakes: r.raster.filter((x) => x.at > actAt - 5 && x.at < actAt + 1300).length });
  }
  return { file, engine: J.engine, vp: J.vp, scheme: J.scheme, prm: J.prm, touch: J.touch, mode: J.mode, digits: J.digits, errors: J.errors, runs: out };
}
if (process.argv[1].endsWith("an.mjs") && process.argv[2]) { const a = analyze(process.argv[2]); const { runs, ...h } = a; console.log(JSON.stringify(h)); for (const r of runs) console.log(JSON.stringify(r)); }
