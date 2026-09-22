import { readFileSync } from "node:fs";
export function analyzeToggle(file) {
  const J = JSON.parse(readFileSync(file, "utf8")); const outRuns = [];
  for (const r of J.runs) {
    const F = r.frames.filter((f) => f.t >= r.actAt - 1);
    const dts = F.slice(1).map((f, i) => +(f.t - F[i].t).toFixed(1));
    const dark = r.direction.endsWith("dark"); const inK = dark ? "moon" : "sun", outK = dark ? "sun" : "moon";
    const app = (f, k) => { const live = f[k]; const w = f[k + "W"]; const rv = f["rest" + k[0].toUpperCase() + k.slice(1)];
      if (live && live.vis === "v" && live.op > 0.02) return { s: +(w).toFixed(3), op: live.op, via: "live" };
      if (rv === "v") return { s: 1, op: f["rest" + k[0].toUpperCase() + k.slice(1) + "Op"], via: "rest" }; return { s: 0, op: 0, via: "none" }; };
    let jump = { d: 0 }; const ser = [];
    for (let i = 1; i < F.length; i++) for (const k of [inK, outK]) { const a = app(F[i - 1], k), b = app(F[i], k); const d = Math.abs(b.s * (b.op > 0.02 ? 1 : 0) - a.s * (a.op > 0.02 ? 1 : 0)); if (d > jump.d) jump = { d: +d.toFixed(3), body: k, i, t: +(F[i].t - r.actAt).toFixed(1), dt: dts[i - 1], before: a, after: b }; }
    for (const f of F) ser.push([+(f.t - r.actAt).toFixed(0), app(f, outK).s, app(f, outK).via[0], app(f, inK).s, app(f, inK).via[0], app(f, inK).op]);
    const born = F.find((f) => app(f, inK).via === "live");
    const settle = F.find((f, i) => i > 0 && app(f, inK).via === "rest" && app(F[i - 1], inK).via === "live");
    const settleJump = settle ? (() => { const i = F.indexOf(settle); return { t: +(settle.t - r.actAt).toFixed(0), liveScaleBefore: app(F[i - 1], inK).s, restAfter: 1 }; })() : null;
    const sdt = [...dts].sort((a, b) => a - b);
    let cardsMoved = null;
    if (F[0].cards) { let mx = 0, srcCh = 0, tfCh = 0; for (let i = 1; i < F.length; i++) F[i].cards.forEach((c, j) => { const a = F[i - 1].cards[j]; if (!a) return; mx = Math.max(mx, ...c.r.map((v, q) => Math.abs(v - a.r[q]))); if (c.src !== a.src) srcCh++; if (c.tf !== a.tf || c.op !== a.op) tfCh++; }); cardsMoved = { maxRectDeltaPx: +mx.toFixed(1), posterSrcChanges: srcCh, transformOrOpacityChanges: tfCh }; }
    outRuns.push({ label: r.label, direction: r.direction, reloaded: r.reloaded, frames: dts.length, frameMs: { min: sdt[0], median: sdt[sdt.length >> 1], max: sdt[sdt.length - 1] }, over16_7: dts.filter((d) => d > 17.2).length, over25: dts.filter((d) => d > 25).length, over50: dts.filter((d) => d > 50).length, bigFrames: dts.map((d, i) => [d, +(F[i + 1].t - r.actAt).toFixed(0)]).filter(([d]) => d > 25).map(([d, t]) => `${d}ms ending @+${t}`), largestJump: jump, incomingBornAt: born ? { t: +(born.t - r.actAt).toFixed(0), scale: app(born, inK).s, op: app(born, inK).op } : null, settleHandoff: settleJump, cardsUnderFlip: cardsMoved, bakes: r.raster.filter((x) => x.at > r.actAt - 5).map((x) => `${x.px}@+${(x.at - r.actAt).toFixed(0)}(${x.dur}ms)`), loaf: r.loaf.filter((l) => l.at > r.actAt - 20).map((l) => ({ at: +(l.at - r.actAt).toFixed(0), dur: l.dur, scripts: l.scripts.filter((s) => !/ 0ms$| 1ms$| 2ms$/.test(s)).slice(0, 6) })), series: ser });
  }
  return { engine: J.engine, view: J.view, vp: J.vp, scheme: J.scheme, prm: J.prm, touch: J.touch, errors: J.errors, runs: outRuns };
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop()) && process.argv[2]) { const a = analyzeToggle(process.argv[2]); for (const r of a.runs) { const { series, ...rest } = r; console.log(JSON.stringify(rest)); if (process.argv[3]) console.log(series.map((s) => s.join(",")).join(" | ")); } console.log("errors", a.errors); }
