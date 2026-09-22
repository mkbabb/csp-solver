import { readFileSync } from "node:fs";
const C = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
const inter = (a, b) => { const x = Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0])); const y = Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1])); return x * y; };
export function analyzeMove(file) {
  const J = JSON.parse(readFileSync(file, "utf8")); const runs = [];
  for (const r of J.runs) {
    const pre = r.frames.filter((f) => f.t < r.actAt).pop();
    const F = r.frames.filter((f) => f.t >= r.actAt - 0.5);
    const all = [pre, ...F].filter(Boolean);
    const dts = F.slice(1).map((f, i) => +(f.t - F[i].t).toFixed(1));
    const jumps = []; const ser = [];
    for (let i = 1; i < all.length; i++) {
      const a = all[i - 1].board, b = all[i].board; if (!a || !b) continue;
      const [ax, ay] = C(a.r), [bx, by] = C(b.r); const dc = Math.hypot(bx - ax, by - ay), dw = b.r[2] - a.r[2];
      const slot = all[i].slot; const visFrac = b.inFace && slot ? +(inter(b.r, slot) / (b.r[2] * b.r[3])).toFixed(3) : 1;
      const wa = all[i - 1].word, wb = all[i].word; const dword = wa && wb ? +Math.hypot(...[0, 1].map((q) => C(wb)[q] - C(wa)[q])).toFixed(1) : null;
      const e = { i, t: +(all[i].t - r.actAt).toFixed(1), dt: +(all[i].t - all[i - 1].t).toFixed(1), centerPx: +dc.toFixed(1), widthPx: +dw.toFixed(1), boardFrom: a.r.join(","), boardTo: b.r.join(","), inFace: b.inFace, visibleFraction: visFrac, slot: slot ? slot.join(",") : null, scroll: all[i].scroll, galOp: all[i].galOp, wordPx: dword };
      ser.push([e.t, ...b.r.map((v) => Math.round(v)), b.inFace ? "F" : "H", visFrac, all[i].galOp]);
      jumps.push(e);
    }
    const moving = jumps.filter((j) => Math.max(j.centerPx, Math.abs(j.widthPx)) > 0.3);
    const mags = moving.map((j) => Math.max(j.centerPx, Math.abs(j.widthPx))).sort((a, b) => a - b);
    const top = [...moving].sort((a, b) => Math.max(b.centerPx, Math.abs(b.widthPx)) - Math.max(a.centerPx, Math.abs(a.widthPx))).slice(0, 4);
    const fold = r.anims.filter((a) => a.cls === "board-peek-host");
    const flipCheck = fold.map((a) => { const m = a.from?.match(/translate\(([-\d.e]+)px, ([-\d.e]+)px\) scale\(([-\d.e]+)\)/); if (!m) return { from: a.from }; const [tx, ty, s] = m.slice(1).map(Number); const [lx, ly] = C(a.rect); const firstImplied = [lx + tx, ly + ty, a.rect[2] * s];
      const truePre = pre?.board?.r; const tc = truePre ? C(truePre) : null;
      const f1 = F.find((f) => f.t > a.t && f.board); const slot1 = f1?.slot;
      return { at: +(a.t - r.actAt).toFixed(1), dur: a.dur, easing: a.easing, lastRectAtCall: a.rect.join(","), slotAtCall: a.slot?.join(","), scrollAtCall: a.scrollLeft, slotFirstFrameAfter: slot1?.join(","), scrollFirstFrameAfter: f1?.scroll, impliedFirst: { cx: +firstImplied[0].toFixed(1), cy: +firstImplied[1].toFixed(1), w: +firstImplied[2].toFixed(1) }, trueVisualFirst: tc ? { cx: +tc[0].toFixed(1), cy: +tc[1].toFixed(1), w: truePre[2] } : null, anchorErrorPx: tc ? { dx: +(firstImplied[0] - tc[0]).toFixed(1), dy: +(firstImplied[1] - tc[1]).toFixed(1), dw: +(firstImplied[2] - truePre[2]).toFixed(1) } : null }; });
    const glideEnd = fold.length ? +(fold[fold.length - 1].t + fold[fold.length - 1].dur - r.actAt).toFixed(0) : null;
    const gone = F.find((f) => f.galOp === null); const firstClip = jumps.find((j) => j.inFace && j.visibleFraction < 0.999);
    const minVis = jumps.filter((j) => j.inFace).reduce((m, j) => Math.min(m, j.visibleFraction), 1);
    const cardH = F.map((f) => f.card?.[3]).filter((v) => v != null);
    runs.push({ label: r.label, reloaded: r.reloaded, frames: dts.length, frameMs: dts.length ? { median: [...dts].sort((a, b) => a - b)[dts.length >> 1], max: Math.max(...dts) } : null, over16_7: dts.filter((d) => d > 17.2).length, over25: dts.filter((d) => d > 25).length, motionFrames: moving.length, perFrameTravelPx: mags.length ? { min: mags[0], median: mags[mags.length >> 1], max: mags[mags.length - 1] } : null, largest: top, foldAnimations: flipCheck, glideEndMs: glideEnd, galleryRemovedAt: gone ? +(gone.t - r.actAt).toFixed(0) : null, minVisibleFractionInFace: minVis, firstClippedFrame: firstClip ? { t: firstClip.t, visibleFraction: firstClip.visibleFraction } : null, centerCardHeight: cardH.length ? { first: cardH[0], min: Math.min(...cardH), last: cardH[cardH.length - 1] } : null, wordmarkMaxJumpPx: Math.max(0, ...jumps.map((j) => j.wordPx || 0)), bakes: r.raster.filter((x) => x.at > r.actAt).map((x) => `${x.px}@+${(x.at - r.actAt).toFixed(0)}`), loaf: r.loaf.filter((l) => l.at > r.actAt - 20).map((l) => ({ at: +(l.at - r.actAt).toFixed(0), dur: l.dur, scripts: l.scripts.slice(0, 4) })), series: ser });
  }
  return { engine: J.engine, vp: J.vp, prm: J.prm, touch: J.touch, errors: J.errors, runs };
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop()) && process.argv[2]) { const a = analyzeMove(process.argv[2]); for (const r of a.runs) { const { series, ...rest } = r; console.log(JSON.stringify(rest, null, 0)); if (process.argv[3]) console.log(series.slice(0, +process.argv[3]).map((s) => s.join(",")).join(" | ")); } console.log("errors", a.errors); }
