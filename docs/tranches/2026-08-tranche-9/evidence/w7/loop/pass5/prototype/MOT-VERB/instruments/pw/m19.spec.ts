/**
 * MOT-VERB pass 5 — T9-M19, THE FOLD AND THE UNFOLD, rAF-sampled (INTAKE rows 30–33).
 * Three arms on one encoded payload: this tree (4247), the π control 74a2b5d9 (4248), main-HEAD
 * 1e6cfbbf's dist (4249, the SECOND control — W8 touched App's exit mover). Per frame: the
 * board's rect, its script (WAAPI) animation, the centre card, the wordmark, the clip-aware
 * visible fraction (every ancestor's overflow on each axis), the document's scrollWidth and a
 * scrollTo(400) probe, rAF intervals and blob encodes (toBlob/convertToBlob/createObjectURL).
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { PAYLOAD, ARMS, OUT, givens } from "./board";

const INIT = () => {
  const w = window as any;
  w.__enc = [];
  const note = (k: string, px: string) => w.__enc.push({ k, px, t: performance.now() });
  // A BAKE is a raster drawn onto a canvas >= 200 px (the grid/wordmark/toggle stacks); a
  // poster's object URL is NOT a bake and is not counted (pass-5 first cut counted it: 12/arm).
  const hook = (proto: any) => {
    if (!proto) return;
    const d = proto.drawImage;
    proto.drawImage = function (...a: any[]) { const c = this.canvas; if ((c?.width ?? 0) >= 200) note("drawImage", `${c.width}x${c.height}`); return d.apply(this, a); };
  };
  hook(CanvasRenderingContext2D.prototype);
  hook(w.OffscreenCanvasRenderingContext2D?.prototype);
  const NEG = (document.currentScript as any)?.dataset?.neg ?? w.__NEG;
  if (w.__NEG === "nofit") {
    // row 33's negative: the fit never lands (every write of `--live-fit` is dropped).
    const sp = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function (n: string, ...r: any[]) { if (n === "--live-fit") return; return sp.call(this, n, ...(r as [string])); };
  }
  if (w.__NEG === "lift") {
    // row 31's negative: the intake arm's lift (`overflow: visible` + a clip-path) replanted.
    addEventListener("DOMContentLoaded", () => { const st = document.createElement("style"); st.textContent = ".gallery-viewport.is-folding{overflow:visible!important;clip-path:inset(-100vmax 0)!important}"; document.head.appendChild(st); });
  }
  void NEG;
};

async function sample(page: Page, ms: number, press: () => Promise<void>) {
  await page.evaluate((ms) => {
    const w = window as any;
    w.__frames = [];
    const t0 = performance.now();
    w.__t0 = t0;
    const rect = (el: Element | null) => { if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
    const vis = (el: Element | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      let [l, t, rr, b] = [r.left, r.top, r.right, r.bottom];
      for (let a = el.parentElement; a; a = a.parentElement) {
        const cs = getComputedStyle(a); const ar = a.getBoundingClientRect();
        if (cs.overflowX !== "visible") { l = Math.max(l, ar.left); rr = Math.min(rr, ar.right); }
        if (cs.overflowY !== "visible") { t = Math.max(t, ar.top); b = Math.min(b, ar.bottom); }
      }
      const A = r.width * r.height;
      return A > 0 ? Math.max(0, rr - l) * Math.max(0, b - t) / A : null;
    };
    const tick = () => {
      const now = performance.now();
      const board = document.querySelector(".board-peek-host");
      const anim = board?.getAnimations().find((a) => !(a instanceof CSSTransition) && !(a instanceof CSSAnimation)) ?? null;
      const se = document.scrollingElement!;
      const sx0 = window.scrollX;
      window.scrollTo(400, window.scrollY);
      const sx = window.scrollX;
      window.scrollTo(sx0, window.scrollY);
      w.__frames.push({
        t: now - t0,
        board: rect(board),
        anim: anim ? { ct: anim.currentTime, st: anim.startTime, ps: anim.playState } : null,
        card: rect(document.querySelector(".game-card.is-center")),
        // the wordmark MOVER (App's wordmarkEl = HandwrittenLogo's root, the h1's first child):
        // the h1's own box re-lays out at the state flip and is not the painted ink
        head: rect(document.querySelector("h1")?.firstElementChild ?? null),
        vis: vis(board),
        sw: se.scrollWidth, iw: window.innerWidth, sx,
        folding: !!document.querySelector(".is-folding"),
      });
      if (now - t0 < ms) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, ms);
  await press();
  await page.waitForTimeout(ms + 300);
  return page.evaluate(() => ({ frames: (window as any).__frames, enc: (window as any).__enc.map((e: any) => ({ ...e, t: e.t - (window as any).__t0 })) }));
}

const cx = (r: any) => r.x + r.w / 2, cy = (r: any) => r.y + r.h / 2;
// the glass curve (the fold's verb, 520 ms), for the anchor RESIDUAL: where the board should be
// at the first frame's own currentTime, given FIRST and the settled LAST.
function glass(p: number) {
  const [x1, y1, x2, y2] = [0.32, 0.72, 0, 1];
  const A = (a: number, b: number) => 3 * a - 3 * b + 1;
  const bz = (t: number, a: number, b: number) => ((A(a, b) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
  if (p <= 0) return 0; if (p >= 1) return 1;
  let lo = 0, hi = 1, t = p;
  for (let i = 0; i < 60; i++) { const x = bz(t, x1, x2); if (Math.abs(x - p) < 1e-7) break; if (x < p) lo = t; else hi = t; t = (lo + hi) / 2; }
  return bz(t, y1, y2);
}
function summarise(kind: string, first: any, frames: any[], enc: any[]) {
  const i1 = frames.findIndex((f) => f.anim);
  const inFold = frames.filter((f) => f.anim);
  const f1 = i1 >= 0 ? frames[i1] : null;
  const start = f1 ? f1.t : null;
  const ints = frames.slice(1).map((f, i) => ({ t: f.t, d: f.t - frames[i].t }));
  const win = start == null ? [] : ints.filter((x) => x.t >= start + 200 && x.t <= start + 800);
  const winAll = start == null ? [] : ints.filter((x) => x.t >= start && x.t <= start + 900);
  const foldEnc = start == null ? [] : enc.filter((e) => e.t >= start - 50 && e.t <= start + 620);
  let steps20 = 0, maxStep = 0;
  for (let i = Math.max(1, i1 + 1); i < frames.length; i++) {
    const a = frames[i - 1].board, b = frames[i].board;
    if (!a || !b) continue;
    const d = Math.hypot(cx(b) - cx(a), cy(b) - cy(a));
    maxStep = Math.max(maxStep, d);
    if (d > 20) steps20++;
  }
  const cards = frames.filter((f) => f.card).map((f) => f.card.h);
  const heads = frames.filter((f) => f.head).map((f) => cy(f.head));
  const last = frames[frames.length - 1];
  return {
    kind,
    framesInVerb: inFold.length,
    anchor: f1 && first && frames[frames.length - 1].board ? (() => {
      const L = frames[frames.length - 1].board, e = glass((f1.anim.ct ?? 0) / 520);
      const ex = cx(first) + (cx(L) - cx(first)) * e, ey = cy(first) + (cy(L) - cy(first)) * e, ew = first.w + (L.w - first.w) * e;
      return { progress: +e.toFixed(4), residCentre: +Math.hypot(cx(f1.board) - ex, cy(f1.board) - ey).toFixed(2), residW: +(f1.board.w - ew).toFixed(2) };
    })() : null,
    frame1: f1 && first ? { t: +f1.t.toFixed(1), ct: f1.anim.ct, st: f1.anim.st, centreErr: +Math.hypot(cx(f1.board) - cx(first), cy(f1.board) - cy(first)).toFixed(2), dx: +(cx(f1.board) - cx(first)).toFixed(2), dy: +(cy(f1.board) - cy(first)).toFixed(2), dw: +(f1.board.w - first.w).toFixed(2) } : null,
    visMin: inFold.length ? +Math.min(...inFold.map((f) => f.vis ?? 1)).toFixed(3) : null,
    visFirst: f1?.vis != null ? +f1.vis.toFixed(3) : null,
    maxInterval: winAll.length ? +Math.max(...winAll.map((x) => x.d)).toFixed(1) : null,
    over25_200_800: win.filter((x) => x.d > 25).length,
    over34_0_900: winAll.filter((x) => x.d > 34).length,
    encInVerb: foldEnc.length,
    encPx: [...new Set(foldEnc.map((e: any) => e.px))].join(" "),
    encAt: start == null ? [] : enc.map((e: any) => Math.round(e.t - start)),
    encIn520: start == null ? null : enc.filter((e: any) => e.t >= start && e.t < start + 520).length,
    encAll: enc.length,
    maxScrollExcess: Math.max(...frames.map((f) => f.sw - f.iw)),
    maxScrollX: Math.max(...frames.map((f) => f.sx)),
    boardSteps20: steps20, maxStep: +maxStep.toFixed(1),
    cardH: cards.length ? { first: +cards[0].toFixed(1), min: +Math.min(...cards).toFixed(1), max: +Math.max(...cards).toFixed(1) } : null,
    headTravel: heads.length ? +(heads[0] - heads[heads.length - 1]).toFixed(1) : null,
    headSteps20: heads.slice(1).filter((h, i) => Math.abs(h - heads[i]) > 20).length,
    rest: last?.board ? { w: +last.board.w.toFixed(1), cy: +cy(last.board).toFixed(1) } : null,
  };
}

const ALL_CELLS = [
  { name: "1280x800-light-fine", w: 1280, h: 800, touch: false, dark: false },
  { name: "1280x800-dark-fine", w: 1280, h: 800, touch: false, dark: true },
  { name: "390x844-light-coarse", w: 390, h: 844, touch: true, dark: false },
];
const CELLS = ALL_CELLS.filter((c) => !process.env.CELLS || process.env.CELLS.split(",").includes(c.name));
const ARM_LIST = (process.env.ARMS ?? "after,control,main").split(",") as (keyof typeof ARMS)[];
const PRM = process.env.PRM === "1";

for (const cell of CELLS) {
  test(`M19 fold/unfold · ${cell.name}${PRM ? " · PRM" : ""}`, async ({ browser }, info) => {
    const out: any[] = [];
    for (const arm of ARM_LIST) {
      const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, colorScheme: cell.dark ? "dark" : "light", reducedMotion: PRM ? "reduce" : "no-preference" });
      if (process.env.NEG) await ctx.addInitScript(`window.__NEG = ${JSON.stringify(process.env.NEG)};`);
      await ctx.addInitScript(INIT);
      const page = await ctx.newPage();
      await page.goto(`${ARMS[arm]}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(2000);
      const g = await givens(page);
      const first = await page.evaluate(() => { const r = document.querySelector(".board-peek-host")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      const enter = await sample(page, 1600, () => page.keyboard.press("g"));
      await page.waitForTimeout(1200);
      const face = await page.evaluate(() => { const el = document.querySelector(".game-card.is-center .board-peek-host") ?? document.querySelector(".game-card.is-center .game-card-face"); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      const exit = await sample(page, 1600, () => page.keyboard.press("Escape"));
      const E = summarise("enter", first, enter.frames, enter.enc);
      const X = summarise("exit", face, exit.frames, exit.enc);
      out.push({ arm, givens: g, enter: E, exit: X, restFirst: first });
      console.log(`M19[${info.project.name}·${cell.name}${PRM ? "·PRM" : ""}·${arm}] ENTER f1 ${JSON.stringify(E.frame1)} anchor ${JSON.stringify(E.anchor)} verbFrames ${E.framesInVerb} visFirst ${E.visFirst} visMin ${E.visMin} maxInt ${E.maxInterval} >25@200-800 ${E.over25_200_800} >34 ${E.over34_0_900} enc ${E.encInVerb} ${E.encPx} encIn520 ${E.encIn520} encAt ${JSON.stringify(E.encAt)} scrollExcess ${E.maxScrollExcess} scrollX ${E.maxScrollX} | EXIT f1 ${JSON.stringify(X.frame1)} anchor ${JSON.stringify(X.anchor)} verbFrames ${X.framesInVerb} card ${JSON.stringify(X.cardH)} steps20 ${X.boardSteps20} maxStep ${X.maxStep} headTravel ${X.headTravel} headSteps20 ${X.headSteps20} >34 ${X.over34_0_900} enc ${X.encInVerb} encIn520 ${X.encIn520} encAt ${JSON.stringify(X.encAt)} scrollExcess ${X.maxScrollExcess}`);
      await ctx.close();
    }
    const same = out.every((o) => o.givens === out[0].givens && o.givens.length > 0);
    console.log(`M19[${info.project.name}·${cell.name}] payload given-set equal across arms: ${same}`);
    const f = `${OUT}/m19${process.env.TAG ?? ""}-${info.project.name}-${cell.name}${PRM ? "-prm" : ""}${process.env.NEG ? "-neg-" + process.env.NEG : ""}.json`;
    writeFileSync(f, JSON.stringify({ payload: PAYLOAD, givensEqual: same, arms: out.map((o) => ({ ...o, givens: undefined })) }, null, 1));
  });
}
