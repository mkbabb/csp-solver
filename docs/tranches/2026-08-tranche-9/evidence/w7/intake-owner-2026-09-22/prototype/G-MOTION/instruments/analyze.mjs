// node analyze.mjs <run.json>... → one summary line (JSON) per file; raw frames never banked.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");
const { analyzeToggle } = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/intake-owner-2026-09-22/census/motion/probe/an-toggle.mjs");
const C = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
const r1 = (v) => (v == null ? v : +(+v).toFixed(1));
const stats = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return { min: r1(s[0]), median: r1(s[s.length >> 1]), max: r1(s[s.length - 1]) }; };

async function magenta(file) {
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true });
  let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, n = 0; const ch = info.channels;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) { const i = (y * info.width + x) * ch; if (data[i] > 200 && data[i + 1] < 90 && data[i + 2] > 200) { n++; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } }
  const sx = 1; // screencast at maxWidth = viewport → css px
  return n ? { n, box: [x0 * sx, y0 * sx, (x1 - x0 + 1) * sx, (y1 - y0 + 1) * sx] } : { n: 0, box: null };
}

async function painted(run, rest) {
  if (!run.shots?.length) return null;
  const out = [];
  for (const s of run.shots) { const m = await magenta(s.f); out.push({ t: +(s.t - run.actAt).toFixed(1), ...m }); }
  return out;
}

async function move(J, run, kind) {
  const actAt = run.actAt;
  const F = run.frames.filter((f) => f.t >= actAt - 0.5);
  const pre = run.frames.filter((f) => f.t < actAt).pop();
  const fold = run.anims.filter((a) => a.cls === "board-peek-host");
  const a = fold[fold.length - 1];
  const res = { label: run.label, movers: run.anims.length, hrefSwaps: run.hrefSwaps };
  if (!a) { res.noFold = true; }
  const tA = a ? a.t : actAt;
  const dts = F.slice(1).map((f, i) => +(f.t - F[i].t).toFixed(1));
  const inWin = F.slice(1).map((f, i) => [f.t - actAt, dts[i]]).filter(([t]) => t >= 200 && t <= 800);
  res.rafIntervals = { in200_800: stats(inWin.map((x) => x[1])), over25: inWin.filter((x) => x[1] > 25).length, over34: inWin.filter((x) => x[1] > 34).length };
  const foldFrames = F.filter((f) => f.t > tA && f.t <= tA + 520 + 17);
  res.foldFramesRaf = foldFrames.length;
  res.encodesInFold = run.enc.filter((e) => e.at >= tA - 1 && e.at <= tA + 540).length;
  res.drawImageInFold = run.raster.filter((e) => e.at >= tA - 1 && e.at <= tA + 520).map((e) => `${e.px}@+${Math.round(e.at - actAt)}`);
  res.encodesAt = run.enc.map((e) => Math.round(e.at - actAt));
  res.animAt = r1(tA - actAt);
  if (a) res.animFrom = a.from;
  // discontinuities: per-frame board centre/width steps
  const all = [pre, ...F].filter((f) => f && f.board);
  const steps = []; for (let i = 1; i < all.length; i++) { const [ax, ay] = C(all[i - 1].board.r), [bx, by] = C(all[i].board.r); steps.push({ t: r1(all[i].t - actAt), d: +Math.hypot(bx - ax, by - ay).toFixed(1), dw: +(all[i].board.r[2] - all[i - 1].board.r[2]).toFixed(1), dt: r1(all[i].t - all[i - 1].t) }); }
  const moving = steps.filter((s) => Math.max(s.d, Math.abs(s.dw)) > 0.3);
  res.perFrameTravel = stats(moving.map((s) => Math.max(s.d, Math.abs(s.dw))));
  res.largestSteps = [...moving].sort((x, y) => Math.max(y.d, Math.abs(y.dw)) - Math.max(x.d, Math.abs(x.dw))).slice(0, 3);
  if (kind === "enter" && a) {
    const first = F.find((f) => f.t > tA && f.board);
    const rest = J.restBoard;
    if (first && rest) { const [fx, fy] = C(first.board.r), [rx, ry] = C(rest); res.GA1_frame1 = { t: r1(first.t - actAt), centerErrPx: +Math.hypot(fx - rx, fy - ry).toFixed(1), widthErrPx: +(first.board.r[2] - rest[2]).toFixed(1) }; }
    const vis = foldFrames.filter((f) => f.board).map((f) => f.board.vis);
    res.GA2_visMinRaf = vis.length ? Math.min(...vis) : null;
    res.filtersDuringFold = stats(foldFrames.map((f) => f.filters).filter((v) => v != null));
    const p = await painted(run);
    if (p) {
      const pf = p.filter((s) => s.t >= -30 && s.t <= r1(tA - actAt) + 600);
      const restW = rest[2];
      // first painted frame after the fold anim call
      const firstP = p.find((s) => s.t > tA - actAt && s.box);
      res.GA3_painted = firstP ? { t: firstP.t, box: firstP.box, centerErrPx: +Math.hypot(C(firstP.box)[0] - C(rest)[0], C(firstP.box)[1] - C(rest)[1]).toFixed(1), widthErrPx: +(firstP.box[2] - restW).toFixed(1) } : null;
      const faceW = J.galleryRest?.board?.[2];
      res.GA3_restInFaceBeforeFold = p.filter((s) => s.t <= tA - actAt + 17 && s.box && faceW && Math.abs(s.box[2] - faceW) < 6).length;
      const pa = pf.filter((s) => s.t >= tA - actAt);
      const pdts = pa.slice(1).map((s, i) => [s.t, +(s.t - pa[i].t).toFixed(1)]).filter(([t]) => t >= 200 && t <= 800);
      res.GA4_painted = { frames: pdts.length, intervals: stats(pdts.map((x) => x[1])), over34: pdts.filter((x) => x[1] > 34).length };
      // painted perimeter coverage: magenta px / (perimeter × 3)
      // painted visible fraction: the painted magenta bbox area over the geometric (unclipped)
      // rect of the nearest rAF frame — a clip shows as a short box
      const vis = p.filter((s) => s.t > tA - actAt + 5 && s.t <= tA - actAt + 520 && s.box).map((s) => { const f = F.reduce((b, x) => (Math.abs(x.t - actAt - s.t) < Math.abs(b.t - actAt - s.t) ? x : b), F[0]); const r = f.board.r; return Math.min(1, +((s.box[2] * s.box[3]) / ((r[2] + 6) * (r[3] + 6))).toFixed(3)); });
      res.GA2_paintedVis = stats(vis);
      res.paintedSeries = p.filter((s) => s.t >= -20 && s.t <= r1(tA - actAt) + 560).map((s) => `${s.t}:${s.box ? s.box.map(Math.round).join("x") : "-"}`).join(" ");
    }
  }
  if (kind === "exit" && a) {
    const m = a.from?.match(/translate\(([-\d.e]+)px, ([-\d.e]+)px\) scale\(([-\d.e]+)\)/);
    if (m) {
      const [tx, ty, s] = m.slice(1).map(Number); const [lx, ly] = C(a.rect);
      const imp = [lx + tx, ly + ty, a.rect[2] * s];
      const truth = J.scenario === "poster" ? pre?.face : pre?.board?.r;
      if (truth) { const [cx, cy] = C(truth); res.GA5_anchor = { dx: +(imp[0] - cx).toFixed(1), dy: +(imp[1] - cy).toFixed(1), dw: +(imp[2] - truth[2]).toFixed(1), referent: J.scenario === "poster" ? "poster face" : "live board (painted)" }; }
    }
    const first = F.find((f) => f.t > tA && f.board);
    const truth2 = J.scenario === "poster" ? pre?.face : pre?.board?.r;
    if (first && truth2) res.GA5_frame1Raf = { t: r1(first.t - actAt), dy: +(C(first.board.r)[1] - C(truth2)[1]).toFixed(1), dw: +(first.board.r[2] - truth2[2]).toFixed(1) };
    const cardH = F.filter((f) => f.card).map((f) => f.card[3]);
    res.GA6_cardHeight = cardH.length ? { first: pre?.card?.[3] ?? null, min: Math.min(...cardH), max: Math.max(...cardH), frames: cardH.length } : null;
    const after1 = steps.filter((s) => s.t > r1(tA - actAt) + 17);
    res.GA6_boardCentreSteps20 = after1.filter((s) => s.d > 20).length;
    res.GA6_boardWidthSteps20 = after1.filter((s) => Math.abs(s.dw) > 20).length;
    const ws = []; const wf = [pre, ...F].filter((f) => f && f.word); for (let i = 1; i < wf.length; i++) ws.push({ t: wf[i].t - actAt, d: Math.hypot(C(wf[i].word)[0] - C(wf[i - 1].word)[0], C(wf[i].word)[1] - C(wf[i - 1].word)[1]) });
    res.GA6_wordSteps20 = ws.filter((s) => s.t > tA - actAt + 17 && s.d > 20).length;
    res.wordMaxStep = r1(Math.max(0, ...ws.map((s) => s.d)));
    const gone = F.find((f) => f.galOp === null); res.galleryRemovedAt = gone ? r1(gone.t - actAt) : null;
    const scr = F.map((f) => f.scroll); res.scrollTop = { first: pre?.scroll ?? null, min: Math.min(...scr), max: Math.max(...scr) };
    const deckR = F.filter((f) => f.deck).map((f) => f.deck); res.deckTopRange = deckR.length ? [Math.min(...deckR.map((d) => d[1])), Math.max(...deckR.map((d) => d[1]))] : null;
    const p = await painted(run);
    if (p) {
      // GA7 (painted z-order): over the unfold's first 200 ms, the fraction of painted frames whose
      // magenta outline box equals the rAF-predicted board rect (±6 px, outline 3 px) — the outline is
      // only whole when nothing (the deck) paints over it
      const win = p.filter((s) => s.t > tA - actAt + 5 && s.t <= tA - actAt + 200);
      const ok = win.filter((s) => { if (!s.box) return false; const f = F.reduce((b, x) => (Math.abs(x.t - actAt - s.t) < Math.abs(b.t - actAt - s.t) ? x : b), F[0]); const r = f.board.r; return Math.abs(s.box[0] + 3 - r[0]) <= 6 && Math.abs(s.box[1] + 3 - r[1]) <= 6 && Math.abs(s.box[2] - 6 - r[2]) <= 8 && Math.abs(s.box[3] - 6 - r[3]) <= 8; });
      res.GA7_outlineWholeFrac = win.length ? +(ok.length / win.length).toFixed(3) : null;
      res.GA7_frames = win.length;
      const firstP = p.find((s) => s.t > tA - actAt && s.box);
      if (firstP && truth2) res.GA5_painted = { t: firstP.t, dy: +(C(firstP.box)[1] - C(truth2)[1]).toFixed(1), dw: +(firstP.box[2] - truth2[2]).toFixed(1) };
      const pa = p.filter((s) => s.t >= tA - actAt);
      const pdts = pa.slice(1).map((s, i) => [s.t, +(s.t - pa[i].t).toFixed(1)]).filter(([t]) => t <= tA - actAt + 540);
      res.paintedIntervals = { frames: pdts.length, ...stats(pdts.map((x) => x[1])), over34: pdts.filter((x) => x[1] > 34).length };
      res.paintedSeries = p.filter((s) => s.t >= -20 && s.t <= 560).map((s) => `${s.t}:${s.box ? s.box.map(Math.round).join("x") : "-"}`).join(" ");
    }
  }
  return res;
}

for (const file of process.argv.slice(2)) {
  const J = JSON.parse(readFileSync(file, "utf8"));
  const head = { file: file.split("/").pop(), engine: J.engine, port: J.port, vp: J.vp, scheme: J.scheme, prm: J.prm, touch: J.touch, errors: J.errors };
  if (J.scenario === "toggle" || J.scenario === "togglegallery") {
    const a = analyzeToggle(file);
    const runs = a.runs.map((r, i) => { const raw = J.runs[i]; const enc = raw.enc.filter((e) => e.at >= raw.actAt - 5 && e.at <= raw.actAt + 1100).length; const ser = r.series; let dmax = 0; for (let k = 1; k < ser.length; k++) { const inA = ser[k - 1][4] === "l" ? ser[k - 1][3] : null, inB = ser[k][4] === "l" ? ser[k][3] : null; if (inA != null && inB != null) dmax = Math.max(dmax, Math.abs(inB - inA)); } const f09 = raw.frames.filter((f) => f.t >= raw.actAt && f.t <= raw.actAt + 900); const d09 = f09.slice(1).map((f, j) => f.t - f09[j].t); return { label: r.label, dir: r.direction, frameMs: r.frameMs, over34_0_900: d09.filter((d) => d > 34).length, max_0_900: r1(Math.max(...d09)), over50: r.over50, born: r.incomingBornAt, maxLiveDeltaScale: +dmax.toFixed(3), largestJump: { d: r.largestJump.d, body: r.largestJump.body, t: r.largestJump.t, dt: r.largestJump.dt }, encodes0_1100: enc, hrefSwaps: raw.hrefSwaps, bakes: r.bakes.length }; });
    console.log(JSON.stringify({ ...head, scenario: J.scenario, runs }));
  } else if (J.scenario === "move" || J.scenario === "ga7neg") {
    const out = { ...head, scenario: J.scenario, restBoard: J.restBoard, galleryRest: J.galleryRest, playRest: J.playRest };
    out.enter = await move(J, J.runs[0], "enter");
    out.exit = await move(J, J.runs[1], "exit");
    console.log(JSON.stringify(out));
  } else if (J.scenario === "poster" || J.scenario === "ga8") {
    console.log(JSON.stringify({ ...head, scenario: J.scenario, scroll: J.scroll, exit: await move(J, J.runs[0], "exit") }));
  } else {
    console.log(JSON.stringify({ ...head, scenario: J.scenario, idle: J.idle, a: J.afterFoldInterrupted, b: J.afterUnfoldInterrupted }));
  }
}
