// census:toggle analyzer — one run file → per-flip summary (numbers only; the raw frames stay in scratch)
import { readFileSync } from "node:fs";
export function analyze(file) {
  const J = JSON.parse(readFileSync(file, "utf8")); const out = [];
  for (const r of J.runs) {
    const i0 = Math.max(0, r.frames.findIndex((f) => f.t >= r.actAt - 0.5) - 1); const F = r.frames.slice(i0).filter((f) => f.t <= r.actAt + 1300);
    const dts = F.slice(1).map((f, i) => +(f.t - F[i].t).toFixed(1));
    const dark = r.direction.endsWith("dark"); const inK = dark ? "moon" : "sun", outK = dark ? "sun" : "moon";
    const restK = (k) => (k === "sun" ? "rs" : "rm");
    // visible scale of a body: the live icon if it paints, else its rest stack (scale 1)
    const app = (f, k) => { const L = f[k]; const R = f[restK(k)];
      if (L && L.vis === "v" && L.op > 0.02) return { s: L.ws, r: L.wr, op: L.op, via: "live", sc: L.sc };
      if (R && R.vis === "v" && R.op > 0.02) return { s: 1, r: 0, op: R.op, via: "rest" }; return { s: 0, op: 0, via: "none" }; };
    let jump = { d: 0 };
    for (let i = 1; i < F.length; i++) for (const k of [inK, outK]) { const a = app(F[i - 1], k), b = app(F[i], k); const d = Math.abs(b.s - a.s); if (d > jump.d) jump = { d: +d.toFixed(3), body: k === inK ? "in" : "out", t: +(F[i].t - r.actAt).toFixed(1), dt: dts[i - 1], from: `${a.via}:${a.s}@op${a.op}`, to: `${b.via}:${b.s}@op${b.op}` }; }
    const steps = []; for (let i = 1; i < F.length; i++) { const a = app(F[i - 1], inK), b = app(F[i], inK); if (a.via === "live" && b.via === "live") steps.push(Math.abs(b.s - a.s)); }
    const born = F.find((f) => app(f, inK).via === "live");
    const crest = F.reduce((m, f) => { const a = app(f, inK); return a.via === "live" && a.s > m.s ? { s: a.s, t: +(f.t - r.actAt).toFixed(0) } : m; }, { s: 0 });
    // outgoing: last live-visible frame (does it leave large = a teleport away?)
    const outVis = F.filter((f) => app(f, outK).via === "live"); const outLast = outVis[outVis.length - 1];
    const outFirst = outVis[0];
    // start hand-off: first frame after the act where the outgoing rest stack is gone
    const iAct = F.findIndex((f) => f.t >= r.actAt);
    const startGap = F.slice(iAct).findIndex((f) => app(f, outK).via !== "rest");
    const handStart = startGap >= 0 ? (() => { const f = F[iAct + startGap]; return { t: +(f.t - r.actAt).toFixed(0), outVia: app(f, outK).via, outScale: app(f, outK).s, outOp: app(f, outK).op }; })() : null;
    // settle hand-off: incoming live → rest
    const iSet = F.findIndex((f, i) => i > 0 && app(f, inK).via === "rest" && app(F[i - 1], inK).via === "live");
    const settle = iSet > 0 ? { t: +(F[iSet].t - r.actAt).toFixed(0), liveScaleBefore: app(F[iSet - 1], inK).s, liveCssScaleBefore: app(F[iSet - 1], inK).sc, restOp: app(F[iSet], inK).op, restPose: F[iSet][restK(inK)].pose } : null;
    const empty = F.filter((f) => f.t >= r.actAt && app(f, inK).via === "none" && app(f, outK).via === "none").map((f) => +(f.t - r.actAt).toFixed(0));
    // the page's swap
    const firstChange = (key) => { const v0 = F[0][key]; const i = F.findIndex((f) => f[key] !== v0); if (i < 0) return null; let last = i; for (let j = i; j < F.length; j++) if (F[j][key] !== F[j - 1][key]) last = j; const dist = new Set(F.map((f) => f[key])).size; return { first: +(F[i].t - r.actAt).toFixed(0), last: +(F[last].t - r.actAt).toFixed(0), distinct: dist }; };
    const both = F.filter((f) => { const a = app(f, inK), b = app(f, outK); return a.via === "live" && b.via === "live" && a.s > 0.5 && b.s > 0.5 && a.op > 0.5 && b.op > 0.5; }).map((f) => +(f.t - r.actAt).toFixed(0));
    const ch = (f) => (f.pr && f.pr.match(/\d+/) ? +f.pr.match(/\d+/)[0] : null); const c0 = ch(F[0]), c1 = ch(F[F.length - 1]);
    const half = F.find((f) => c0 != null && Math.abs(ch(f) - c0) >= Math.abs(c1 - c0) / 2);
    const atHalf = half ? { t: +(half.t - r.actAt).toFixed(0), outScale: app(half, outK).s, outOp: app(half, outK).op, inScale: app(half, inK).s, inOp: app(half, inK).op } : null;
    const pageEnd = r.frames.find((f) => f.t > r.actAt && ch(f) === c1 && F.some((g) => g.t < f.t && ch(g) !== c1 && g.t > r.actAt));
    const atEnd = pageEnd ? { t: +(pageEnd.t - r.actAt).toFixed(0), inScale: app(pageEnd, inK).s, inOp: app(pageEnd, inK).op } : null;
    const plush = F.reduce((m, f) => { const sc = (f[inK] || {}).sc; if (!sc || sc === "none") return m; const v = sc.split(" ").map(Number); const d = Math.max(...v.map((x) => Math.abs(x - 1))); return d > m ? d : m; }, 0);
    const btnMin = F.reduce((m, f) => (f.btn && f.btn !== "none" ? Math.min(m, +f.btn.split(" ")[0]) : m), 1);
    const sdt = [...dts].sort((a, b) => a - b);
    const turningOn = F.find((f) => f.turning); const turningOff = F.find((f, i) => i > 0 && !f.turning && F[i - 1].turning);
    const bloomWin = dts.filter((d, i) => F[i + 1].t - r.actAt <= 1100);
    let shotsSummary = null;
    if (r.shots) { const S = r.shots.map((s) => s.t - r.actAt).filter((t) => t >= -20 && t <= 1150).sort((a, b) => a - b); const g = S.slice(1).map((t, i) => +(t - S[i]).toFixed(1)); const sg = [...g].sort((a, b) => a - b);
      shotsSummary = { painted: S.length, gapMs: { min: sg[0], median: sg[sg.length >> 1], max: sg[sg.length - 1] }, over16_7: g.filter((x) => x > 16.7).length, over34: g.filter((x) => x > 34).length, over50: g.filter((x) => x > 50).length, big: g.map((x, i) => [x, Math.round(S[i + 1])]).filter(([x]) => x > 34).map(([x, t]) => `${x}ms→+${t}`) }; }
    out.push({ label: r.label, direction: r.direction, reloaded: r.reloaded,
      frames: dts.length, frameMs: { min: sdt[0], median: sdt[sdt.length >> 1], max: sdt[sdt.length - 1] },
      bloom1100: { over16_7: bloomWin.filter((d) => d > 16.7).length, over34: bloomWin.filter((d) => d > 34).length, over50: bloomWin.filter((d) => d > 50).length },
      bigFrames: dts.map((d, i) => [d, +(F[i + 1].t - r.actAt).toFixed(0)]).filter(([d]) => d > 25).map(([d, t]) => `${d}ms→+${t}`),
      born: born ? { t: +(born.t - r.actAt).toFixed(0), s: app(born, inK).s, op: app(born, inK).op } : null,
      maxStepIn: steps.length ? +Math.max(...steps).toFixed(3) : null, stepsOver08: steps.filter((x) => x > 0.08).length,
      largestJump: jump, crest,
      out: outLast ? { firstLive: +(outFirst.t - r.actAt).toFixed(0), firstLiveScale: app(outFirst, outK).s, lastLive: +(outLast.t - r.actAt).toFixed(0), lastScale: app(outLast, outK).s, lastOp: app(outLast, outK).op, lastRot: app(outLast, outK).r } : null,
      doubleExposure: both.length ? `${both.length}f +${both[0]}…+${both[both.length - 1]}` : 0, pageHalf: atHalf, pageEnd: atEnd, plushMaxDev: +plush.toFixed(4), btnMin: +btnMin.toFixed(3),
      handStart, settle, emptyFrames: empty.length ? `${empty.length} (+${empty[0]}…+${empty[empty.length - 1]})` : 0,
      turning: { on: turningOn ? +(turningOn.t - r.actAt).toFixed(0) : null, off: turningOff ? +(turningOff.t - r.actAt).toFixed(0) : null },
      filterAttr: [...new Set(F.map((f) => (f[inK] || {}).f))],
      btnScale: [...new Set(F.map((f) => f.btn))].length,
      page: { darkClass: firstChange("dark"), pageRoot: firstChange("pr"), boardWrapper: firstChange("bw"), grid: firstChange("grid"), logo: firstChange("logo") },
      bakes: r.raster.filter((x) => x.at > r.actAt - 5 && x.at < r.actAt + 1300).map((x) => `${x.px}@+${(x.at - r.actAt).toFixed(0)}(${x.dur}ms)`),
      loaf: r.loaf.filter((l) => l.at > r.actAt - 20 && l.at < r.actAt + 1300).map((l) => ({ at: +(l.at - r.actAt).toFixed(0), dur: l.dur, top: l.scripts.filter((s) => !/ [0-4]ms$/.test(s)).slice(0, 3) })),
      shots: shotsSummary });
  }
  return { port: J.port, engine: J.engine, vp: J.vp, scheme: J.scheme, prm: J.prm, touch: J.touch, toggleBox: J.toggleBox, errors: J.errors, runs: out };
}
if (process.argv[2]) { const a = analyze(process.argv[2]); const { runs, ...h } = a; console.log(JSON.stringify(h)); for (const r of runs) console.log(JSON.stringify(r)); }
