/**
 * ACC-GRAPHITE pass 4 — THE RING, PAINTED OVER PAINTED (charter rows 1, 2, 3; 10's G2 rank).
 *
 * One screenshot per arm: a horizontal strip through the focused cell's middle 60 %, from outside
 * the board's left frame to outside its right. Every device row of it is scanned; the frame
 * (left + right) and the band (the focused cell's left + right sides) are read by the SAME
 * statistics on the SAME pixels:
 *   - thrN   : run width at a luminance threshold N % of the way from paper to the band's own
 *              full ink (25/50/75) — the pass-3 critic's one-row scan, generalised to every row;
 *   - L110   : the critic's fixed threshold, so 1.571 is reproduced or not on its own terms;
 *   - edges  : SUB-PIXEL crossings at thr50 (linear interpolation between the two straddling
 *              pixels), so a width is not quantised to a whole device pixel;
 *   - mass   : Σ coverage over a window round the run, coverage = (paper − L)/(paper − ink):
 *              threshold-free, prices the frame's 0.95 opacity as the eye does.
 * Seam (row 2): per band row, the deepest paper-ward valley strictly inside the run, in L units.
 * Painted G2b (row 2): per band row, the outer and inner sub-pixel edge; detrended; r(outer, inner).
 * Chip (row 3): the centre row's clear window and the paper between the band and the next ink out.
 * Rank (row 10 / G2): local painted thickness min(h-run, v-run) per ink pixel, classed by DOM box.
 *
 * Arms are CSS injected on the same page and the same focused cell; each is also a one-hunk diff.
 */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { BOARD9, SCRATCH, toImg, L, median, pct, mean, sd, r3, type Img } from "./lib";

const OUT = `${SCRATCH}/ring`;
mkdirSync(OUT, { recursive: true });
mkdirSync(`${SCRATCH}/frames`, { recursive: true });

const F = ".game-cell:has(input:focus-visible)";
const ARMS: Record<string, string> = {
  "shipped-12+12": "",
  "second-10": `${F} .cell-ghost-retrace{stroke-width:10 !important}`,
  "second-8": `${F} .cell-ghost-retrace{stroke-width:8 !important}`,
  "square-join": `${F} :is(.cell-ghost-path,.cell-ghost-retrace){stroke-linejoin:miter !important;stroke-miterlimit:10 !important}`,
  "single-22 (control)": `${F} .cell-ghost-retrace{display:none !important} ${F} .cell-ghost-path{stroke-width:22 !important}`,
  "unfocused (neg)": "",
};
const ARM_FILTER = process.env.ARMS ? process.env.ARMS.split(",") : null;
const RIG = process.env.RIG ?? "desk";
const THEME = (process.env.THEME ?? "light") as "light" | "dark";
const RANK = process.env.RANK === "1";
const rigs = {
  desk: { width: 1280, height: 800, dpr: 1, touch: false },
  phone: { width: 393, height: 699, dpr: 3, touch: true },
} as const;

type Box = { x: number; y: number; w: number; h: number };

/** sub-pixel crossing between i and i+1 where the row crosses thr */
const cross = (row: number[], i: number, j: number, thr: number) => {
  const a = row[i], b = row[j];
  if (a === b) return (i + j) / 2;
  return i + ((thr - a) / (b - a)) * (j - i);
};

/** the ink run nearest `seed` (device px) within `reach`; ink = darker than thr (light) */
function runNear(row: number[], seed: number, reach: number, thr: number, dark: boolean) {
  const ink = (v: number) => (dark ? v > thr : v < thr);
  let s = -1;
  for (let o = 0; o <= reach && s < 0; o++) {
    if (ink(row[seed + o] ?? NaN)) s = seed + o;
    else if (ink(row[seed - o] ?? NaN)) s = seed - o;
  }
  if (s < 0) return null;
  let a = s, b = s;
  while (a > 0 && ink(row[a - 1])) a--;
  while (b < row.length - 1 && ink(row[b + 1])) b++;
  const left = a > 0 ? cross(row, a - 1, a, thr) : a;
  const right = b < row.length - 1 ? cross(row, b, b + 1, thr) : b;
  return { a, b, left, right };
}

async function focusCell(page: import("@playwright/test").Page, idx: number) {
  await page.locator(".game-cell input").nth(idx).focus();
  await page.keyboard.press("Shift");
  await page.waitForTimeout(250);
  return page.evaluate(() => {
    const r = document.activeElement?.closest(".game-cell")?.querySelector(".cell-ghost-retrace");
    return r ? getComputedStyle(r).display : "none";
  });
}

async function geom(page: import("@playwright/test").Page, idx: number) {
  return page.evaluate((idx) => {
    const bx = (r: DOMRect) => ({ x: r.x, y: r.y, w: r.width, h: r.height });
    const cell = document.querySelectorAll(".game-cell")[idx] as HTMLElement;
    const ghost = cell.querySelector(".cell-ghost-path") as SVGGraphicsElement;
    const svg = ghost.ownerSVGElement!;
    const board = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement;
    const frames = Array.from(board.querySelectorAll(".frame-line")) as SVGGraphicsElement[];
    const vis = frames.filter((f) => {
      let e: Element | null = f;
      while (e && e !== board) {
        if (getComputedStyle(e).opacity === "0") return false;
        e = e.parentElement;
      }
      return f.getBoundingClientRect().width > 0;
    });
    const fr = vis[0] ?? frames[0];
    const givens = Array.from(document.querySelectorAll(".game-cell"))
      .filter((c) => /given/i.test(c.querySelector("input")?.getAttribute("aria-label") ?? ""))
      .map((c) => bx(c.getBoundingClientRect()));
    const cs = getComputedStyle(ghost);
    const rt = cell.querySelector(".cell-ghost-retrace") as SVGGraphicsElement;
    const fcs = getComputedStyle(fr);
    return {
      cell: bx(cell.getBoundingClientRect()),
      path: bx(ghost.getBoundingClientRect()),
      retrace: bx(rt.getBoundingClientRect()),
      ghostPxPerU: svg.getBoundingClientRect().width / svg.viewBox.baseVal.width,
      board: bx(board.getBoundingClientRect()),
      boardPxPerU: board.getBoundingClientRect().width / board.viewBox.baseVal.width,
      frame: bx(fr.getBoundingClientRect()),
      frameVisibleCount: vis.length,
      frameStroke: fcs.strokeWidth,
      frameOpacity: fcs.strokeOpacity,
      frameColor: fcs.stroke,
      outer: { sw: cs.strokeWidth, fill: cs.fill, join: cs.strokeLinejoin, stroke: cs.stroke, op: cs.strokeOpacity },
      inner: { display: getComputedStyle(rt).display, sw: getComputedStyle(rt).strokeWidth, join: getComputedStyle(rt).strokeLinejoin },
      givens,
      focused: cell.contains(document.activeElement),
    };
  }, idx);
}

/** detrended residuals (least-squares line in index) */
const detrend = (v: number[]) => {
  const n = v.length, xs = v.map((_, i) => i);
  const mx = mean(xs), my = mean(v);
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (v[i] - my); sxx += (xs[i] - mx) ** 2; }
  const k = sxx ? sxy / sxx : 0;
  return v.map((y, i) => y - (my + k * (i - mx)));
};
const corr = (a: number[], b: number[]) => {
  const ma = mean(a), mb = mean(b);
  let sab = 0, saa = 0, sbb = 0;
  for (let i = 0; i < a.length; i++) { sab += (a[i] - ma) * (b[i] - mb); saa += (a[i] - ma) ** 2; sbb += (b[i] - mb) ** 2; }
  return saa && sbb ? sab / Math.sqrt(saa * sbb) : NaN;
};
const stats = (a: number[]) => ({ n: a.length, med: r3(median(a)), mean: r3(mean(a)), sd: r3(sd(a)), p5: r3(pct(a, 5)), p95: r3(pct(a, 95)) });

function thickness(im: Img, thr: number, dark: boolean) {
  const { w, h } = im;
  const ink = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = L(im, x, y); ink[y * w + x] = (dark ? v > thr : v < thr) ? 1 : 0; }
  const hr = new Uint16Array(w * h), vr = new Uint16Array(w * h);
  for (let y = 0; y < h; y++) { let x = 0; while (x < w) { if (!ink[y * w + x]) { x++; continue; } let e = x; while (e < w && ink[y * w + e]) e++; for (let k = x; k < e; k++) hr[y * w + k] = e - x; x = e; } }
  for (let x = 0; x < w; x++) { let y = 0; while (y < h) { if (!ink[y * w + x]) { y++; continue; } let e = y; while (e < h && ink[e * w + x]) e++; for (let k = y; k < e; k++) vr[k * w + x] = e - y; y = e; } }
  return { ink, hr, vr };
}

test(`ring-${RIG}-${THEME}`, async ({ browser, baseURL }, info) => {
  test.setTimeout(170_000);
  const rig = rigs[RIG as keyof typeof rigs];
  const engine = info.project.name;
  const dark = THEME === "dark";
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height }, deviceScaleFactor: rig.dpr,
    hasTouch: rig.touch, isMobile: false, colorScheme: THEME, reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/?board=${BOARD9.enc}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
  await page.waitForTimeout(2500);
  const regime = await page.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches,
    prm: matchMedia("(prefers-reduced-motion: reduce)").matches, cells: document.querySelectorAll(".game-cell").length,
    url: location.search,
  }));
  const writableIdx: number[] = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".game-cell")).flatMap((c, i) => {
      const inp = c.querySelector("input");
      return inp && !/given/i.test(inp.getAttribute("aria-label") ?? "") ? [i] : [];
    }),
  );
  const interior = writableIdx.filter((i) => { const r = Math.floor(i / 9), c = i % 9; return r > 0 && r < 8 && c > 0 && c < 8; });
  const mid = interior.reduce((b, i) => (Math.abs(i - 40) < Math.abs(b - 40) ? i : b), interior[0]);
  const out: Record<string, unknown> = { engine, rig: RIG, theme: THEME, regime, boardPayload: BOARD9.enc, midCell: mid, arms: {} };

  for (const arm of Object.keys(ARMS)) {
    if (ARM_FILTER && !ARM_FILTER.some((a) => arm.startsWith(a))) continue;
    await page.evaluate((css) => {
      document.getElementById("acc-arm")?.remove();
      if (css) { const s = document.createElement("style"); s.id = "acc-arm"; s.textContent = css; document.head.append(s); }
    }, ARMS[arm]);
    let shown = "n/a";
    if (arm.startsWith("unfocused")) {
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.mouse.move(2, 2);
      await page.waitForTimeout(250);
    } else shown = await focusCell(page, mid);
    const g = await geom(page, mid);
    const dpr = rig.dpr;
    // strip: whole board width (+10 px), the middle 60 % of the focused cell's height
    const clip = { x: g.board.x - 10, y: g.cell.y + g.cell.h * 0.3, width: g.board.w + 20, height: g.cell.h * 0.4 };
    const im = await toImg(await page.screenshot({ clip }));
    // BASELINE: the same strip with nothing focused (no band, no wash) — the band's coverage is
    // solved against it pixel by pixel, so the cell-boundary grid line the band abuts is NOT
    // counted as band (it merges with the band into one threshold run at desk: 15 px, not 11).
    const hadFocus = await page.evaluate(() => { const a = document.activeElement as HTMLElement | null; const f = !!a?.closest(".game-cell"); a?.blur(); return f; });
    await page.waitForTimeout(250);
    const base = await toImg(await page.screenshot({ clip }));
    if (hadFocus && !arm.startsWith("unfocused")) await focusCell(page, mid);
    const X = (vx: number) => (vx - clip.x) * dpr;
    const cy0 = Math.floor(im.h / 2);
    const paperS: number[] = [];
    for (let y = 0; y < im.h; y++) for (let dx = -0.12; dx <= 0.12; dx += 0.04) paperS.push(L(im, Math.round(X(g.cell.x + g.cell.w * (0.5 + dx))), y));
    const paper = median(paperS);
    let ink = dark ? 0 : 255;
    const bz = [Math.round(X(g.path.x - 6)), Math.round(X(g.path.x + 12 * g.ghostPxPerU + 6))];
    for (let y = 0; y < im.h; y++) for (let x = bz[0]; x <= bz[1]; x++) { const v = L(im, x, y); ink = dark ? Math.max(ink, v) : Math.min(ink, v); }
    if (arm.startsWith("unfocused")) ink = dark ? 207 : 38; // graphite, stated (no band to read it off)
    // band coverage α against the baseline pixel; frame coverage against the paper beside it
    const alphaBand = (x: number, y: number) => { const lb = L(base, x, y), lf = L(im, x, y); const den = lb - ink; return Math.abs(den) < 4 ? 1 : Math.max(0, Math.min(1, (lb - lf) / den)); };
    const bgOut = median(Array.from({ length: base.h }, (_, y) => L(base, Math.round(X(g.board.x) - 6 * dpr), y)));
    const alphaFrame = (x: number, y: number) => Math.max(0, Math.min(1, (bgOut - L(base, x, y)) / (bgOut - ink)));
    const crossA = (a: number[], i: number, j: number, t: number) => (a[i] === a[j] ? (i + j) / 2 : i + ((t - a[i]) / (a[j] - a[i])) * (j - i));
    /** the α≥t run nearest seed; sub-pixel edges; mass over ±half */
    const prof = (A: number[], seed: number, reach: number, t: number) => {
      let s = -1;
      for (let o = 0; o <= reach && s < 0; o++) { if ((A[seed + o] ?? 0) >= t) s = seed + o; else if ((A[seed - o] ?? 0) >= t) s = seed - o; }
      if (s < 0) return null;
      let a = s, b = s;
      while (a > 0 && A[a - 1] >= t) a--;
      while (b < A.length - 1 && A[b + 1] >= t) b++;
      return { a, b, left: a > 0 ? crossA(A, a - 1, a, t) : a, right: b < A.length - 1 ? crossA(A, b, b + 1, t) : b };
    };
    const bandSeedL = Math.round(X(g.path.x + 5 * g.ghostPxPerU)), bandSeedR = Math.round(X(g.path.x + g.path.w - 5 * g.ghostPxPerU));
    const reach = Math.round(4 * dpr);
    const TS = { a25: 0.25, a50: 0.5, a75: 0.75 };
    const acc: Record<string, { band: number[]; frame: number[] }> = {};
    for (const k of Object.keys(TS)) acc[k] = { band: [], frame: [] };
    const mass = { band: [] as number[], frame: [] as number[] };
    const seams: number[] = [];
    const edges = { Lout: [] as number[], Lin: [] as number[], Rout: [] as number[], Rin: [] as number[] };
    const bandHalf = Math.ceil((12 * g.ghostPxPerU + 3) * dpr), frameHalf = Math.ceil((6 * g.boardPxPerU + 3) * dpr);
    // the frame's own centre, found in the baseline centre row (it is a raster — no DOM box)
    const fr0: number[] = []; for (let x = 0; x < base.w; x++) fr0.push(alphaFrame(x, Math.floor(base.h / 2)));
    const firstRun = (A: number[], from: number, dir: 1 | -1) => { let x = from; while (x >= 0 && x < A.length && A[x] < 0.5) x += dir; return x; };
    const frameSeedL = firstRun(fr0, 0, 1) + Math.round(3 * dpr), frameSeedR = firstRun(fr0, fr0.length - 1, -1) - Math.round(3 * dpr);
    const raw110: { band: number[]; frame: number[] } = { band: [], frame: [] };
    for (let y = 0; y < im.h; y++) {
      const AB: number[] = [], AF: number[] = [], row: number[] = [];
      for (let x = 0; x < im.w; x++) { AB.push(alphaBand(x, y)); AF.push(alphaFrame(x, y)); row.push(L(im, x, y)); }
      for (const [k, t] of Object.entries(TS)) {
        for (const sd0 of [bandSeedL, bandSeedR]) { const r = prof(AB, sd0, reach, t); if (r) acc[k].band.push((r.right - r.left) / dpr); }
        for (const sd0 of [frameSeedL, frameSeedR]) { const r = prof(AF, sd0, reach, t); if (r) acc[k].frame.push((r.right - r.left) / dpr); }
      }
      // the pass-3 critic's raw form: a fixed-L run on the FOCUSED pixels, no baseline
      if (!dark) {
        for (const sd0 of [bandSeedL, bandSeedR]) { const r = runNear(row, sd0, reach, 110, false); if (r) raw110.band.push((r.right - r.left) / dpr); }
        for (const sd0 of [frameSeedL, frameSeedR]) { const r = runNear(row, sd0, reach, 110, false); if (r) raw110.frame.push((r.right - r.left) / dpr); }
      }
      const massAt = (A: number[], sd0: number, half: number) => { const r = prof(A, sd0, reach, 0.5); if (!r) return NaN; const c = Math.round((r.left + r.right) / 2); let m = 0; for (let x = c - half; x <= c + half; x++) m += A[x] ?? 0; return m / dpr; };
      for (const sd0 of [bandSeedL, bandSeedR]) { const m = massAt(AB, sd0, bandHalf); if (Number.isFinite(m)) mass.band.push(m); }
      for (const sd0 of [frameSeedL, frameSeedR]) { const m = massAt(AF, sd0, frameHalf); if (Number.isFinite(m)) mass.frame.push(m); }
      for (const [side, sd0] of [["L", bandSeedL], ["R", bandSeedR]] as const) {
        const r = prof(AB, sd0, reach, 0.5);
        if (!r) continue;
        // seam: the deepest coverage DEFICIT strictly inside the run, between two parts that reach 0.9
        let best = 0;
        for (let k = r.a + 1; k < r.b; k++) {
          const lmax = Math.max(...AB.slice(r.a, k)), rmax = Math.max(...AB.slice(k + 1, r.b + 1));
          if (lmax >= 0.9 && rmax >= 0.9) best = Math.max(best, Math.min(lmax, rmax) - AB[k]);
        }
        seams.push(best);
        if (side === "L") { edges.Lout.push(r.left / dpr); edges.Lin.push(r.right / dpr); }
        else { edges.Rin.push(r.left / dpr); edges.Rout.push(r.right / dpr); }
      }
    }
    const byThr: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(acc)) {
      if (!v.band.length) continue;
      byThr[k] = { band: stats(v.band), frame: stats(v.frame), ratioMed: r3(median(v.band) / median(v.frame)) };
    }
    if (raw110.band.length) byThr.rawL110 = { band: stats(raw110.band), frame: stats(raw110.frame), ratioMed: r3(median(raw110.band) / median(raw110.frame)) };
    const g2b = (() => {
      const rs: number[] = [], all: number[] = [];
      for (const [o, i] of [[edges.Lout, edges.Lin], [edges.Rout, edges.Rin]]) {
        if (o.length < 8) continue;
        const a = detrend(o), b = detrend(i);
        rs.push(corr(a, b)); all.push(...a, ...b);
      }
      return { rPerSide: rs.map(r3), residualSdPx: r3(sd(all)), residualMaxPx: r3(all.reduce((m, x) => Math.max(m, Math.abs(x)), 0)) };
    })();
    // chip, centre row: the clear window (α<0.5 between the two sides) and the paper from the
    // band's outer α-edge out to the next ink in the BASELINE (the grid line it sits beside)
    let chip: Record<string, number> = {};
    {
      const AB: number[] = [], rb: number[] = [];
      for (let x = 0; x < im.w; x++) { AB.push(alphaBand(x, cy0)); rb.push(L(base, x, cy0)); }
      const lr = prof(AB, bandSeedL, reach, 0.5), rr = prof(AB, bandSeedR, reach, 0.5);
      if (lr && rr) {
        const baseInk = (x: number) => (dark ? rb[x] > paper + 0.5 * (ink - paper) : rb[x] < paper - 0.5 * (paper - ink));
        let x = Math.floor(lr.left); while (x > 0 && !baseInk(x)) x--;
        const gl = x; // near edge of the next line out, left
        x = Math.ceil(lr.left); // the grid line may sit UNDER the band's outer edge
        const overlapL = baseInk(Math.floor(lr.left)) || baseInk(Math.ceil(lr.left));
        let xr = Math.ceil(rr.right); while (xr < rb.length - 1 && !baseInk(xr)) xr++;
        const overlapR = baseInk(Math.floor(rr.right)) || baseInk(Math.ceil(rr.right));
        const pitch = g.board.w / 9;
        chip = {
          clearWindow: r3((rr.left - lr.right) / dpr), bandLeftPx: r3((lr.right - lr.left) / dpr), bandRightPx: r3((rr.right - rr.left) / dpr),
          paperOutL: overlapL ? 0 : r3((lr.left - gl - 1) / dpr), paperOutR: overlapR ? 0 : r3((xr - rr.right) / dpr),
          bandShareOfPitch: r3((lr.right - lr.left + rr.right - rr.left) / 2 / dpr / pitch), pitch: r3(pitch),
        };
      }
    }
    // mass-weighted ink over the whole cell box (how much graphite the chip lays down)
    if (RIG === "phone" && THEME === "light") {
      const cc = { x: g.cell.x - g.cell.w * 1.05, y: g.cell.y - g.cell.h * 1.05, width: g.cell.w * 3.1, height: g.cell.h * 3.1 };
      await page.screenshot({ clip: cc, path: `${SCRATCH}/frames/chip-${engine}-${arm.replace(/[^a-z0-9-]/gi, "")}.png` });
    }
    let rank: unknown;
    if (RANK && (arm === "shipped-12+12" || arm === "second-8" || arm === "second-10")) {
      const rows: unknown[] = [];
      const cells8 = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => interior[Math.floor((k * interior.length) / 8)]);
      const bclip = { x: g.board.x - 6, y: g.board.y - 6, width: g.board.w + 12, height: g.board.h + 12 };
      for (const ci of cells8) {
        await focusCell(page, ci);
        const g2 = await geom(page, ci);
        const im2 = await toImg(await page.screenshot({ clip: bclip }));
        const { ink: ik, hr, vr } = thickness(im2, paper - 0.5 * (paper - ink), dark);
        const cls: Record<string, number[]> = { band: [], frame: [], given: [], grid: [] };
        const inBox = (vx: number, vy: number, b: Box, grow: number) => vx >= b.x - grow && vx <= b.x + b.w + grow && vy >= b.y - grow && vy <= b.y + b.h + grow;
        const gu = g2.ghostPxPerU, bu = g2.boardPxPerU;
        for (let y = 0; y < im2.h; y++) for (let x = 0; x < im2.w; x++) {
          const k = y * im2.w + x; if (!ik[k]) continue;
          const vx = bclip.x + x / dpr, vy = bclip.y + y / dpr;
          const t = Math.min(hr[k], vr[k]) / dpr;
          if (inBox(vx, vy, g2.path, 8 * gu) && !inBox(vx, vy, g2.path, -24 * gu)) cls.band.push(t);
          else if (inBox(vx, vy, g2.board, 4) && !inBox(vx, vy, g2.board, -20 * bu)) cls.frame.push(t);
          else if (g2.givens.some((b) => inBox(vx, vy, { x: b.x + b.w * 0.18, y: b.y + b.h * 0.18, w: b.w * 0.64, h: b.h * 0.64 }, 0))) cls.given.push(t);
          else cls.grid.push(t);
        }
        const s = (a: number[]) => ({ n: a.length, med: r3(median(a)), p95: r3(pct(a, 95)) });
        const st = { band: s(cls.band), frame: s(cls.frame), given: s(cls.given), grid: s(cls.grid) };
        const rivalMed = Math.max(st.frame.med || 0, st.given.med || 0, st.grid.med || 0);
        const rivalP95 = Math.max(st.frame.p95 || 0, st.given.p95 || 0, st.grid.p95 || 0);
        const who = (["frame", "given", "grid"] as const).reduce((w, c) => ((st[c].med || 0) > (st[w].med || 0) ? c : w), "frame" as "frame" | "given" | "grid");
        rows.push({ cell: ci, retrace: g2.inner.display, ...st, runnerUp: who, bandOverRivalMed: r3(st.band.med / rivalMed), bandOverRivalP95: r3(st.band.med / rivalP95) });
      }
      rank = rows;
      await focusCell(page, mid);
    }
    (out.arms as Record<string, unknown>)[arm] = {
      retraceDisplay: shown, focused: g.focused,
      geom: { ghostPxPerU: r3(g.ghostPxPerU), boardPxPerU: r3(g.boardPxPerU), frameStroke: g.frameStroke, frameOpacity: g.frameOpacity, frameColor: g.frameColor, frameVisible: g.frameVisibleCount, outer: g.outer, inner: g.inner },
      paperL: r3(paper), inkL: r3(ink), byThr, mass: { band: stats(mass.band), frame: stats(mass.frame), ratioMed: r3(median(mass.band) / median(mass.frame)) },
      seam: { n: seams.length, med: r3(median(seams)), p95: r3(pct(seams, 95)), fracGe12: r3(seams.filter((s) => s >= 12).length / (seams.length || 1)), fracGe24: r3(seams.filter((s) => s >= 24).length / (seams.length || 1)) },
      frameAlphaPeak: r3(Math.max(...fr0)), bgOut: r3(bgOut),
      g2bPainted: g2b, chip, rank, edgesDump: process.env.DUMP ? edges : undefined,
    };
  }
  writeFileSync(`${OUT}/ring-${RIG}-${THEME}-${engine}.json`, JSON.stringify(out, null, 1));
  await ctx.close();
});
