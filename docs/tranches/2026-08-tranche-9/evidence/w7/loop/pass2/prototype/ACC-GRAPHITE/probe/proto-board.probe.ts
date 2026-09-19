/**
 * proto-board.probe.ts — ACC-GRAPHITE pass 1, the PROTOTYPE's own instrument.
 *
 * The research's `graphite-arm.probe.ts` measured five stylesheets toggled on one HEAD page.
 * This measures the PROTOTYPE itself: no arm is injected, because the arm is the source now.
 * Same helpers, verbatim where they are shared (census, diffMark, chamfer thickness, rank).
 *
 * Adds what the gates need and the research did not have:
 *   G1  the dark residue BINNED by 10-degree hue band, each bin carrying its own pixel count
 *   G2  the ring's CLEARANCE to the neighbour cell's interior, in CSS px, at 393 dpr3
 *   G3  the tally's INK RUNS along the perimeter (connected components of its own footprint)
 *       at k = 1, 3, 20 and at 100% written
 *   G4b the user corner mark against the engine's peek mark, painted, same cell size
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { rgbToOklch, ratio, lum } from "./oklch";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/readings";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const VP = (process.env.VP || "desk") as "desk" | "phone";
const CHROMA_FLOOR = 0.012;
const BAND = [40, 115] as const;
const SOLO = "./?size=3&difficulty=" + (process.env.DIFF || "HARD");

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(900);
}

async function setHide(page: Page, sel: string | null) {
  await page.evaluate((s: string) => {
    let el = document.getElementById("acc-graphite-hide") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "acc-graphite-hide";
      document.head.appendChild(el);
    }
    el.textContent = s ? `${s} { display: none !important; }` : "";
  }, sel ?? "");
  await page.waitForTimeout(220);
}

async function pixelCensus(page: Page) {
  const buf = await page.screenshot({ type: "png" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const total = info.width * info.height;
  let chromatic = 0;
  let inBand = 0;
  let sumC = 0;
  // THE RESIDUE, BINNED. r0's census answers "how much colour"; the gate asks "whose".
  const bins: Record<string, number> = {};
  for (let i = 0; i < total; i++) {
    const o = i * ch;
    const { C, h } = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (C >= CHROMA_FLOOR) {
      chromatic++;
      sumC += C;
      if (h >= BAND[0] && h <= BAND[1]) inBand++;
      const b = Math.floor(((h % 360) + 360) % 360 / 10) * 10;
      bins[String(b)] = (bins[String(b)] ?? 0) + 1;
    }
  }
  const top = Object.entries(bins)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([deg, px]) => ({ band: `${deg}-${Number(deg) + 10}`, px, shareOfViewport: +(px / total).toFixed(5) }));
  return {
    pixels: total,
    chromaticPixels: chromatic,
    chromaticShare: +(chromatic / total).toFixed(6),
    inFamilyShare: chromatic ? +(inBand / chromatic).toFixed(4) : 0,
    offFamilyShare: chromatic ? +(1 - inBand / chromatic).toFixed(4) : 0,
    meanChroma: chromatic ? +(sumC / chromatic).toFixed(4) : 0,
    topBands: top,
  };
}

async function painted(page: Page, tokens: string[]) {
  return page.evaluate((ns: string[]) => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const ctx = cv.getContext("2d")!;
    const out: Record<string, [number, number, number]> = {};
    const card = getComputedStyle(
      document.querySelector(".board-wrapper") ?? document.body,
    ).backgroundColor;
    for (const n of ns) {
      probe.style.setProperty("color", `var(${n})`);
      const c = getComputedStyle(probe).color;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = card;
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillStyle = c;
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      out[n] = [d[0], d[1], d[2]];
    }
    probe.remove();
    return out;
  }, tokens);
}

interface Px {
  r: number;
  g: number;
  b: number;
}
interface Img {
  w: number;
  h: number;
  dpr: number;
  at: (x: number, y: number) => Px;
}

async function clipRaw(
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
): Promise<Img> {
  const off = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
  const buf = await page.screenshot({
    type: "png",
    clip: { x: clip.x + off.x, y: clip.y + off.y, width: clip.width, height: clip.height },
  });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  return {
    w: info.width,
    h: info.height,
    dpr: info.width / clip.width,
    at: (x: number, y: number): Px => {
      const o = (y * info.width + x) * ch;
      return { r: data[o], g: data[o + 1], b: data[o + 2] };
    },
  };
}

function mean(arr: Px[], fallback: Px): Px {
  return arr.length
    ? {
        r: Math.round(arr.reduce((s, p) => s + p.r, 0) / arr.length),
        g: Math.round(arr.reduce((s, p) => s + p.g, 0) / arr.length),
        b: Math.round(arr.reduce((s, p) => s + p.b, 0) / arr.length),
      }
    : fallback;
}

function diffMark(on: Img, off: Img, paper: Px, rule: Px, thresh = 8) {
  const pl = lum(paper.r, paper.g, paper.b);
  const rl = lum(rule.r, rule.g, rule.b);
  const hits: { a: Px; b: Px; d: number; x: number; y: number }[] = [];
  for (let y = 0; y < Math.min(on.h, off.h); y++) {
    for (let x = 0; x < Math.min(on.w, off.w); x++) {
      const a = on.at(x, y);
      const b = off.at(x, y);
      const d = Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
      if (d >= thresh) hits.push({ a, b, d, x, y });
    }
  }
  if (!hits.length)
    return {
      footprintPx: 0,
      xFirst: null,
      xLast: null,
      yFirst: null,
      yLast: null,
      core: null,
      overRule: null,
      overPaper: null,
      hits,
    };
  const sorted = [...hits].sort((p, q) => q.d - p.d);
  const core = sorted.slice(0, Math.max(1, Math.round(sorted.length * 0.1)));
  const coreOn = mean(core.map((h) => h.a), paper);
  const coreOff = mean(core.map((h) => h.b), paper);
  const span = Math.abs(pl - rl) || 1;
  const bucket = (b: Px): "rule" | "paper" | "edge" => {
    const L = lum(b.r, b.g, b.b);
    if (Math.abs(L - rl) <= 0.25 * span) return "rule";
    if (Math.abs(L - pl) <= 0.25 * span) return "paper";
    return "edge";
  };
  const part = (which: "rule" | "paper") => {
    const set = sorted.filter((h) => bucket(h.b) === which);
    if (!set.length) return null;
    const c = set.slice(0, Math.max(1, Math.round(set.length * 0.1)));
    const onM = mean(c.map((h) => h.a), paper);
    const offM = mean(c.map((h) => h.b), paper);
    return {
      px: set.length,
      ink: onM,
      ground: offM,
      inkOverGround: +ratio(onM, offM).toFixed(2),
      inkOverPaper: +ratio(onM, paper).toFixed(2),
    };
  };
  return {
    footprintPx: hits.length,
    xFirst: Math.min(...hits.map((h) => h.x)),
    xLast: Math.max(...hits.map((h) => h.x)),
    yFirst: Math.min(...hits.map((h) => h.y)),
    yLast: Math.max(...hits.map((h) => h.y)),
    core: {
      ink: coreOn,
      ground: coreOff,
      inkOverGround: +ratio(coreOn, coreOff).toFixed(2),
      inkOverPaper: +ratio(coreOn, paper).toFixed(2),
    },
    overRule: part("rule"),
    overPaper: part("paper"),
    hits,
  };
}

/**
 * Thickness of a MARK, not of a tile: the chamfer distance transform run over the mark's OWN
 * footprint mask (the pixels that change when the mark is hidden), so a glyph measured inside a
 * focused cell is not handed the focus ring's 12 units as its own stroke. Returns CSS px.
 */
function maskThickness(hits: { x: number; y: number }[], w: number, h: number, dpr: number) {
  if (!hits.length) return 0;
  const isInk = new Uint8Array(w * h);
  for (const p of hits) if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h) isInk[p.y * w + p.x] = 1;
  const INF = 1e6;
  const dist = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) dist[i] = isInk[i] ? INF : 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!isInk[i]) continue;
      let v = dist[i];
      if (x === 0 || y === 0) v = Math.min(v, 1);
      if (x > 0) v = Math.min(v, dist[i - 1] + 1);
      if (y > 0) v = Math.min(v, dist[i - w] + 1);
      if (x > 0 && y > 0) v = Math.min(v, dist[i - w - 1] + 1.41421);
      if (x < w - 1 && y > 0) v = Math.min(v, dist[i - w + 1] + 1.41421);
      dist[i] = v;
    }
  for (let y = h - 1; y >= 0; y--)
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (!isInk[i]) continue;
      let v = dist[i];
      if (x === w - 1 || y === h - 1) v = Math.min(v, 1);
      if (x < w - 1) v = Math.min(v, dist[i + 1] + 1);
      if (y < h - 1) v = Math.min(v, dist[i + w] + 1);
      if (x < w - 1 && y < h - 1) v = Math.min(v, dist[i + w + 1] + 1.41421);
      if (x > 0 && y < h - 1) v = Math.min(v, dist[i + w - 1] + 1.41421);
      dist[i] = v;
    }
  const vals: number[] = [];
  let peak = 0;
  for (let i = 0; i < w * h; i++)
    if (isInk[i] && dist[i] < INF) {
      vals.push(dist[i]);
      if (dist[i] > peak) peak = dist[i];
    }
  vals.sort((x, y) => x - y);
  const q = (f: number) => (vals.length ? vals[Math.min(vals.length - 1, Math.floor(vals.length * f))] : 0);
  // THE PEAK IS NOT A STROKE WIDTH. On a hand-drawn glyph the largest inscribed disk lands
  // wherever two strokes cross, which is a property of the DIGIT, not of the hand: comparing a
  // 7's peak with a 4's compares their shapes. The median of the same transform over the mark's
  // own ink is the typical half-width, and it is what the authorship ratio is read off.
  return {
    peakCssPx: +((peak * 2 - 1) / dpr).toFixed(2),
    medianCssPx: +((q(0.5) * 2 - 1) / dpr).toFixed(3),
    p90CssPx: +((q(0.9) * 2 - 1) / dpr).toFixed(3),
    inkPx: vals.length,
  };
}

/** Connected components (8-neighbour) of a diff footprint — one per tick of the tally. */
function inkRuns(hits: { x: number; y: number }[], w: number, h: number, minPx = 6) {
  const mask = new Uint8Array(w * h);
  for (const p of hits) if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h) mask[p.y * w + p.x] = 1;
  const seen = new Uint8Array(w * h);
  const sizes: number[] = [];
  const stack: number[] = [];
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || seen[i]) continue;
    let n = 0;
    stack.push(i);
    seen[i] = 1;
    while (stack.length) {
      const j = stack.pop()!;
      n++;
      const jx = j % w;
      const jy = (j - jx) / w;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = jx + dx;
          const ny = jy + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const k = ny * w + nx;
          if (mask[k] && !seen[k]) {
            seen[k] = 1;
            stack.push(k);
          }
        }
    }
    sizes.push(n);
  }
  const kept = sizes.filter((s) => s >= minPx).sort((a, b) => b - a);
  return { runs: kept.length, runsAll: sizes.length, sizes: kept.slice(0, 40) };
}

interface CellBox {
  i: number;
  x: number;
  y: number;
  w: number;
  h: number;
  value: string;
  label: string;
}

function cellFeatures(img: Img, origin: { x: number; y: number }, boxes: CellBox[], paper: Px) {
  const pl = lum(paper.r, paper.g, paper.b);
  return boxes.map((c) => {
    const x0 = Math.max(0, Math.round((c.x - 6 - origin.x) * img.dpr));
    const y0 = Math.max(0, Math.round((c.y - 6 - origin.y) * img.dpr));
    const x1 = Math.min(img.w, Math.round((c.x + c.w + 6 - origin.x) * img.dpr));
    const y1 = Math.min(img.h, Math.round((c.y + c.h + 6 - origin.y) * img.dpr));
    const W = x1 - x0;
    const H = y1 - y0;
    if (W <= 0 || H <= 0) return { i: c.i, empty: !c.value, inkMass: 0, peakThicknessCssPx: 0 };
    const isInk = new Uint8Array(W * H);
    let ink = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = img.at(x0 + x, y0 + y);
        const d = Math.abs(lum(p.r, p.g, p.b) - pl);
        ink += d;
        if (d > 0.25) isInk[y * W + x] = 1;
      }
    }
    const INF = 1e6;
    const dist = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) dist[i] = isInk[i] ? INF : 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x;
        if (!isInk[i]) continue;
        let v = dist[i];
        if (x === 0 || y === 0) v = Math.min(v, 1);
        if (x > 0) v = Math.min(v, dist[i - 1] + 1);
        if (y > 0) v = Math.min(v, dist[i - W] + 1);
        if (x > 0 && y > 0) v = Math.min(v, dist[i - W - 1] + 1.41421);
        if (x < W - 1 && y > 0) v = Math.min(v, dist[i - W + 1] + 1.41421);
        dist[i] = v;
      }
    }
    for (let y = H - 1; y >= 0; y--) {
      for (let x = W - 1; x >= 0; x--) {
        const i = y * W + x;
        if (!isInk[i]) continue;
        let v = dist[i];
        if (x === W - 1 || y === H - 1) v = Math.min(v, 1);
        if (x < W - 1) v = Math.min(v, dist[i + 1] + 1);
        if (y < H - 1) v = Math.min(v, dist[i + W] + 1);
        if (x < W - 1 && y < H - 1) v = Math.min(v, dist[i + W + 1] + 1.41421);
        if (x > 0 && y < H - 1) v = Math.min(v, dist[i + W - 1] + 1.41421);
        dist[i] = v;
      }
    }
    let peak = 0;
    for (let i = 0; i < W * H; i++) if (dist[i] > peak && dist[i] < INF) peak = dist[i];
    peak = peak * 2 - 1;
    return {
      i: c.i,
      empty: !c.value,
      inkMass: +(ink / (W * H)).toFixed(5),
      peakThicknessCssPx: +(peak / img.dpr).toFixed(2),
    };
  });
}

function rankOf<T extends { i: number }>(
  cells: T[],
  target: number,
  key: keyof T,
  pool: (c: T) => boolean,
) {
  const set = cells.filter((c) => pool(c) || c.i === target);
  const sorted = [...set].sort((a, b) => (b[key] as number) - (a[key] as number));
  const mine = cells.find((c) => c.i === target)![key] as number;
  const runner = sorted.find((c) => c.i !== target);
  return {
    rank: sorted.findIndex((c) => c.i === target) + 1,
    of: set.length,
    value: mine,
    runnerUp: runner ? (runner[key] as number) : null,
    margin: runner && (runner[key] as number) ? +(mine / (runner[key] as number)).toFixed(3) : null,
    rivalsWithin10pct: set.filter((c) => c.i !== target && (c[key] as number) >= mine * 0.9).length,
    top5: sorted.slice(0, 5).map((c) => ({ i: c.i, v: c[key] as number })),
  };
}

async function boardBox(page: Page) {
  return page.evaluate(() => {
    const s = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
    const b = s.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });
}

async function readCells(page: Page): Promise<CellBox[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell")).map((c, i) => {
      const b = c.getBoundingClientRect();
      const inp = c.querySelector<HTMLInputElement>("input");
      return {
        i,
        x: b.x,
        y: b.y,
        w: b.width,
        h: b.height,
        value: inp?.value ?? "",
        label: inp?.getAttribute("aria-label") ?? "",
      };
    }),
  );
}

async function focusCell(page: Page, i: number) {
  await page.evaluate((n: number) => {
    document
      .querySelectorAll<HTMLElement>(".sudoku-cell")
      [n].querySelector<HTMLInputElement>("input")
      ?.focus();
  }, i);
}

/** The tally, whole: its footprint round the board, its runs, its ratios, its overhang. */
async function readTally(page: Page, card: Px, rule: Px) {
  const b = await boardBox(page);
  const PAD = 18;
  const clip = {
    x: Math.max(0, b.x - PAD),
    y: Math.max(0, b.y - PAD),
    width: b.w + PAD * 2,
    height: b.h + PAD * 2,
  };
  const geom = await page.evaluate(() => {
    const p = document.querySelector<SVGPathElement>(".progress-trace");
    const svg = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
    const bb = svg.getBoundingClientRect();
    const a11y = document.querySelector('[role="progressbar"]');
    const filled = Array.from(
      document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"),
    ).filter((i) => i.value).length;
    const givens = document.querySelectorAll(".sudoku-cell input[aria-label*='given clue']").length;
    if (!p)
      return {
        present: false,
        filled,
        givens,
        valuenow: a11y?.getAttribute("aria-valuenow"),
        valuetext: a11y?.getAttribute("aria-valuetext"),
      };
    const cs = getComputedStyle(p);
    const vb = svg.getAttribute("viewBox")!;
    const size = parseFloat(vb.split(/\s+/)[2]);
    return {
      present: true,
      filled,
      givens,
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
      strokeOpacity: cs.strokeOpacity,
      strokeLinecap: cs.strokeLinecap,
      dasharray: cs.strokeDasharray,
      dashoffset: cs.strokeDashoffset,
      transition: cs.transition,
      renderedStrokeCssPx: +(parseFloat(cs.strokeWidth) * (bb.width / size)).toFixed(3),
      totalLengthUserUnits: +p.getTotalLength().toFixed(1),
      pathLengthAttr: p.getAttribute("pathLength"),
      poseTransform: getComputedStyle(document.querySelector(".progress-pose")!).transform,
      valuenow: a11y?.getAttribute("aria-valuenow"),
      valuetext: a11y?.getAttribute("aria-valuetext"),
    };
  });
  if (!geom.present) return { geom, runs: null, read: null, overhang: null };
  const on = await clipRaw(page, clip);
  await setHide(page, ".progress-pose");
  const off = await clipRaw(page, clip);
  await setHide(page, null);
  const read = diffMark(on, off, card, rule);
  const runs = inkRuns(read.hits, Math.min(on.w, off.w), Math.min(on.h, off.h), Math.round(6 * on.dpr));
  const overhang =
    read.yFirst != null
      ? {
          firstInkPageY: +(clip.y + read.yFirst / on.dpr).toFixed(2),
          boardBoxTopPageY: +b.y.toFixed(2),
          aboveBoxCssPx: +(b.y - (clip.y + read.yFirst / on.dpr)).toFixed(2),
        }
      : null;
  return {
    geom,
    runs,
    read: {
      footprintPx: read.footprintPx,
      core: read.core,
      overRule: read.overRule,
      overPaper: read.overPaper,
    },
    overhang,
  };
}

for (const scheme of ["light", "dark"] as const) {
  test(`${VP}/${scheme} — the prototype's gates on one deal`, async ({ page, browserName }) => {
    if (VP === "phone") await page.setViewportSize({ width: 393, height: 699 });
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    const tok = await painted(page, [
      "--color-card",
      "--color-background",
      "--grid-line-color",
      "--color-pencil-graphite",
      "--color-user-ink",
      "--color-foreground",
    ]);
    const retired = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return {
        "--color-focus-sketch": s.getPropertyValue("--color-focus-sketch"),
        "--color-progress-ink": s.getPropertyValue("--color-progress-ink"),
        "--color-crayon-blue": s.getPropertyValue("--color-crayon-blue"),
        "--color-user-ink": s.getPropertyValue("--color-user-ink"),
        "--color-pencil-graphite": s.getPropertyValue("--color-pencil-graphite"),
      };
    });
    const P = (n: string): Px => ({ r: tok[n][0], g: tok[n][1], b: tok[n][2] });
    const card = P("--color-card");
    const rule = P("--grid-line-color");

    const out: Record<string, unknown> = {
      viewport: VP,
      engine: browserName,
      scheme,
      tokensPainted: tok,
      tokensDeclared: retired,
    };

    // ── G1 state 1: rest ───────────────────────────────────────────────────
    out.censusRest = await pixelCensus(page);

    // ── state 2: one empty box-corner cell focused ─────────────────────────
    const boxes = await readCells(page);
    const n = Math.round(Math.sqrt(boxes.length));
    const wanted =
      boxes.find((c) => !c.value && Math.floor(c.i / n) % 3 === 0 && c.i % n % 3 === 0 && c.i >= n)
        ?.i ?? boxes.find((c) => !c.value)!.i;
    await focusCell(page, wanted);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);
    let focusedIdx: number = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
      return cells.findIndex((c) => c.contains(document.activeElement));
    });
    if (focusedIdx < 0) {
      await focusCell(page, wanted);
      await page.keyboard.press("Shift");
      await page.waitForTimeout(300);
      focusedIdx = await page.evaluate(() => {
        const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
        return cells.findIndex((c) => c.contains(document.activeElement));
      });
    }
    expect(focusedIdx, "focus must be on a board cell").toBeGreaterThanOrEqual(0);
    out.censusFocused = await pixelCensus(page);

    const board = await boardBox(page);
    const tb = boxes[focusedIdx];
    const RPAD = 22;
    const ringClip = {
      x: Math.max(0, tb.x - RPAD),
      y: Math.max(0, tb.y - RPAD),
      width: tb.w + RPAD * 2,
      height: tb.h + RPAD * 2,
    };
    const BPAD = 12;
    const boardClip = {
      x: Math.max(0, board.x - BPAD),
      y: Math.max(0, board.y - BPAD),
      width: board.w + BPAD * 2,
      height: board.h + BPAD * 2,
    };
    const boardOrigin = { x: boardClip.x, y: boardClip.y };

    const ringOn = await clipRaw(page, ringClip);
    await setHide(page, ".cell-ghost");
    const ringOff = await clipRaw(page, ringClip);
    await setHide(page, null);
    const ringRead = diffMark(ringOn, ringOff, card, rule);
    out.ring = {
      footprintPx: ringRead.footprintPx,
      core: ringRead.core,
      overRule: ringRead.overRule,
      overPaper: ringRead.overPaper,
    };

    // G2 — the band's own geometry, and the CLEARANCE the research left open. The ring's
    // outer edge is the first changed pixel left of the cell rect; the neighbour's interior
    // begins one retrace inset (10 board units) inside its own rect, which is where that
    // cell's own second pass would run. Clearance is the gap between the two, in CSS px.
    const insetCssPx = (10 / (1000 / n)) * tb.w;
    const ringGeom =
      ringRead.xFirst != null
        ? {
            outerBleedLeftCssPx: +(tb.x - (ringClip.x + ringRead.xFirst / ringOn.dpr)).toFixed(2),
            outerBleedTopCssPx: +(tb.y - (ringClip.y + ringRead.yFirst! / ringOn.dpr)).toFixed(2),
            outerBleedRightCssPx: +(
              ringClip.x + ringRead.xLast! / ringOn.dpr - (tb.x + tb.w)
            ).toFixed(2),
            neighbourInteriorInsetCssPx: +insetCssPx.toFixed(2),
            clearanceToNeighbourInteriorCssPx: +(
              insetCssPx - Math.max(tb.x - (ringClip.x + ringRead.xFirst / ringOn.dpr), 0)
            ).toFixed(2),
            cellCssPx: +tb.w.toFixed(2),
          }
        : null;
    out.ringGeometry = ringGeom;

    const ringPaths = await page.evaluate(() => {
      const cell = document.querySelector<HTMLElement>(".game-cell:has(input:focus-visible)");
      const g = (sel: string) => {
        const p = cell?.querySelector<SVGPathElement>(sel);
        if (!p) return null;
        const cs = getComputedStyle(p);
        const svg = p.ownerSVGElement!;
        const vb = svg.getAttribute("viewBox")!.split(/\s+/).map(Number);
        const b = svg.getBoundingClientRect();
        return {
          display: cs.display,
          stroke: cs.stroke,
          strokeWidth: cs.strokeWidth,
          strokeOpacity: cs.strokeOpacity,
          fillOpacity: cs.fillOpacity,
          renderedStrokeCssPx: +(parseFloat(cs.strokeWidth) * (b.width / vb[2])).toFixed(3),
          d: p.getAttribute("d")?.slice(0, 40),
        };
      };
      return { outer: g(".cell-ghost-path"), retrace: g(".cell-ghost-retrace") };
    });
    out.ringPaths = ringPaths;

    const boardImg = await clipRaw(page, boardClip);
    const cells = cellFeatures(boardImg, boardOrigin, boxes, card);
    out.findability = {
      focusedIdx,
      label: tb.label,
      byPeakThickness_allCells: rankOf(cells, focusedIdx, "peakThicknessCssPx", () => true),
      byPeakThickness_emptyCells: rankOf(cells, focusedIdx, "peakThicknessCssPx", (c) => c.empty),
      byInkMass_emptyCells: rankOf(cells, focusedIdx, "inkMass", (c) => c.empty),
      boardPeakThicknessCssPx: +Math.max(...cells.map((c) => c.peakThicknessCssPx)).toFixed(2),
    };

    await page.screenshot({
      path: join(FRAMES, `ring-proto-${VP}-${scheme}-${browserName}.png`),
      clip: {
        x: Math.max(0, ringClip.x - tb.w),
        y: Math.max(0, ringClip.y - tb.h),
        width: Math.min(ringClip.width + tb.w * 2, board.w),
        height: Math.min(ringClip.height + tb.h * 2, board.h),
      },
    });

    // ── G4 authorship (before the board fills) ─────────────────────────────
    out.authorshipComputed = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
      const read = (c: HTMLElement | undefined) => {
        if (!c) return null;
        const inp = c.querySelector<HTMLInputElement>("input")!;
        const svg = c.querySelector<SVGSVGElement>(".glyph-svg");
        const path = svg?.querySelector<SVGPathElement>("path");
        if (!path) return null;
        const cs = getComputedStyle(path);
        const vb = svg!.getAttribute("viewBox")!;
        const size = parseFloat(vb.split(/\s+/)[2]);
        const b = svg!.getBoundingClientRect();
        return {
          value: inp.value,
          ariaLabel: inp.getAttribute("aria-label"),
          strokeAttr: path.getAttribute("stroke"),
          strokeComputed: cs.stroke,
          strokeWidthAttr: path.getAttribute("stroke-width"),
          renderedStrokeCssPx: +(parseFloat(cs.strokeWidth) * (b.width / size)).toFixed(3),
        };
      };
      const given = cells.find((c) =>
        /given clue/i.test(c.querySelector("input")?.getAttribute("aria-label") ?? ""),
      );
      return { given: read(given) };
    });

    // write one digit so an ENTRY exists, then read both painted
    await focusCell(page, focusedIdx);
    await page.keyboard.type("1");
    await page.waitForTimeout(500);
    const spots = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
      const pick = (re: RegExp) => {
        const c = cells.find((x) =>
          re.test(x.querySelector("input")?.getAttribute("aria-label") ?? ""),
        );
        if (!c) return null;
        const b = c.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height };
      };
      return { given: pick(/given clue/i), entry: pick(/your entry/i) };
    });
    // THE GLYPH IS MEASURED ON ITS OWN FOOTPRINT, and the board is unfocused first. A tile
    // reading inside the focused cell hands the glyph the ring's 12 units as its own stroke —
    // the first cut of this probe read the entry at 15.15 px for a 5.17 px hand, which is the
    // ring. Blur, then take the chamfer over the mark's own diff mask.
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.waitForTimeout(350);
    const glyph: Record<string, unknown> = {};
    for (const k of ["given", "entry"] as const) {
      const s = spots[k];
      if (!s) continue;
      const clip = { x: s.x + 2, y: s.y + 2, width: s.w - 4, height: s.h - 4 };
      const on = await clipRaw(page, clip);
      await setHide(page, ".glyph-svg");
      const off = await clipRaw(page, clip);
      await setHide(page, null);
      const d = diffMark(on, off, card, rule, 10);
      glyph[k] = {
        core: d.core,
        footprintPx: d.footprintPx,
        thickness: maskThickness(
          d.hits,
          Math.min(on.w, off.w),
          Math.min(on.h, off.h),
          on.dpr,
        ),
      };
    }
    const gp = glyph as Record<
      string,
      { thickness: { peakCssPx: number; medianCssPx: number } } | undefined
    >;
    out.authorshipPainted = {
      ...glyph,
      thicknessRatioMedian:
        gp.given && gp.entry
          ? +(gp.given.thickness.medianCssPx / gp.entry.thickness.medianCssPx).toFixed(3)
          : null,
      thicknessRatioPeak:
        gp.given && gp.entry
          ? +(gp.given.thickness.peakCssPx / gp.entry.thickness.peakCssPx).toFixed(3)
          : null,
    };
    out.authorshipComputedEntry = await page.evaluate(() => {
      const c = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell")).find((x) =>
        /your entry/i.test(x.querySelector("input")?.getAttribute("aria-label") ?? ""),
      );
      const svg = c?.querySelector<SVGSVGElement>(".glyph-svg");
      const path = svg?.querySelector<SVGPathElement>("path");
      if (!path || !svg) return null;
      const cs = getComputedStyle(path);
      const size = parseFloat(svg.getAttribute("viewBox")!.split(/\s+/)[2]);
      const b = svg.getBoundingClientRect();
      return {
        strokeAttr: path.getAttribute("stroke"),
        strokeComputed: cs.stroke,
        strokeWidthAttr: path.getAttribute("stroke-width"),
        renderedStrokeCssPx: +(parseFloat(cs.strokeWidth) * (b.width / size)).toFixed(3),
      };
    });

    await page.screenshot({
      path: join(FRAMES, `authorship-proto-${VP}-${scheme}-${browserName}.png`),
      clip: spots.given
        ? {
            x: Math.max(0, Math.min(spots.given.x, spots.entry?.x ?? spots.given.x) - 4),
            y: Math.max(0, Math.min(spots.given.y, spots.entry?.y ?? spots.given.y) - 4),
            width: Math.min(300, board.w),
            height: Math.min(120, board.h),
          }
        : undefined,
    });

    // ── G4b the marks seam: your corner note against the engine's peek ─────
    // Both are graphite now; the seam is PRESSURE (opacity 1 against 0.5) and placement. Both
    // are measured by difference on the same paper, in the same frame — the peek is HELD open
    // by a long press while your note is already on the board.
    {
      // THE PEEK NEEDS A SOLVABLE BOARD. `startPeek` awaits the solver and lifts the laminate
      // again on a throw, so the one digit the authorship step wrote — which is a guess, and
      // wrong more often than not — has to come off before the engine is asked for its
      // domains. The first cut read zero peek marks in seven of eight cells for this reason.
      const filledNow = await readCells(page);
      for (const c of filledNow) {
        if (c.value && /your entry/i.test(c.label)) {
          await focusCell(page, c.i);
          await page.keyboard.press("Backspace");
        }
      }
      await page.waitForTimeout(400);
      const fresh = await readCells(page);
      const empties = fresh.filter((c) => !c.value);
      const mine = empties[0];
      const theirs = empties[Math.min(4, empties.length - 1)];
      let marks: Record<string, unknown> = { reached: false };
      if (mine && theirs && mine.i !== theirs.i) {
        await focusCell(page, mine.i);
        await page.keyboard.press("p"); // off -> corner
        await page.keyboard.type("5");
        await page.waitForTimeout(350);
        await page.keyboard.press("p"); // corner -> center
        await page.keyboard.press("p"); // center -> off
        await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
        await page.waitForTimeout(250);
        const hasMark = await page.evaluate(
          () => document.querySelectorAll(".user-marks .user-mark-glyph").length,
        );
        // hold the peek open — K is the board's own candidate-peek hold (`pencilMarks` is
        // populated for every empty cell while it is down; the long-press is the touch twin).
        await focusCell(page, theirs.i);
        // K TOGGLES the peek (`useAnswerKeyPeek`), so a HELD key auto-repeats and flips it back
        // off — the first cut of this probe held it down and read zero marks in seven of eight
        // cells for exactly that reason. One press on, one press off.
        await page.keyboard.press("k");
        await expect
          .poll(() => page.locator(".pencil-marks .mark-glyph").count(), { timeout: 8000 })
          .toBeGreaterThan(0)
          .catch(() => {});
        await page.waitForTimeout(400);
        const peekCount = await page.evaluate(
          () => document.querySelectorAll(".pencil-marks .mark-glyph").length,
        );
        const readLayer = async (box: CellBox, sel: string) => {
          const clip = { x: box.x + 2, y: box.y + 2, width: box.w - 4, height: box.h - 4 };
          const on = await clipRaw(page, clip);
          await setHide(page, sel);
          const off = await clipRaw(page, clip);
          await setHide(page, null);
          const d = diffMark(on, off, card, rule, 6);
          return {
            footprintPx: d.footprintPx,
            core: d.core,
            lumDistanceFromPaper: d.core
              ? +Math.abs(
                  lum(d.core.ink.r, d.core.ink.g, d.core.ink.b) - lum(card.r, card.g, card.b),
                ).toFixed(4)
              : null,
          };
        };
        const user = await readLayer(mine, ".user-marks");
        const peek = await readLayer(theirs, ".pencil-marks");
        await page.screenshot({
          path: join(FRAMES, `marks-${VP}-${scheme}-${browserName}.png`),
          clip: {
            x: Math.max(0, Math.min(mine.x, theirs.x) - 6),
            y: Math.max(0, Math.min(mine.y, theirs.y) - 6),
            width: Math.min(260, board.w),
            height: Math.min(180, board.h),
          },
        });
        await page.keyboard.press("k");
        await page.waitForTimeout(300);
        marks = {
          reached: hasMark > 0 && peekCount > 0,
          userMarkGlyphs: hasMark,
          peekMarkGlyphs: peekCount,
          user,
          peek,
          pressureRatio:
            user.lumDistanceFromPaper && peek.lumDistanceFromPaper
              ? +(user.lumDistanceFromPaper / peek.lumDistanceFromPaper).toFixed(3)
              : null,
          contrastRatio:
            user.core && peek.core
              ? +(
                  ratio(user.core.ink, card) / ratio(peek.core.ink, card)
                ).toFixed(3)
              : null,
        };
      }
      out.marksSeam = marks;
      // clear the note so the tally counts only written VALUES
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    }

    // ── G3 the tally at k = 1, 3, 20, and 100% ─────────────────────────────
    let skipped = 0;
    const typeInto = async (count: number) => {
      const fresh = await readCells(page);
      const n2 = Math.round(Math.sqrt(fresh.length));
      const sub = Math.round(Math.sqrt(n2));
      const vals = fresh.map((c) => c.value);
      const empties = fresh.filter((c) => !c.value).map((c) => c.i);
      let done = 0;
      for (const i of empties) {
        if (done >= count) break;
        const r = Math.floor(i / n2);
        const c = i % n2;
        const used = new Set<string>();
        for (let k = 0; k < n2; k++) {
          used.add(vals[r * n2 + k]);
          used.add(vals[k * n2 + c]);
        }
        const br = Math.floor(r / sub) * sub;
        const bc = Math.floor(c / sub) * sub;
        for (let dr = 0; dr < sub; dr++)
          for (let dc = 0; dc < sub; dc++) used.add(vals[(br + dr) * n2 + bc + dc]);
        let pick = "";
        for (let d = 1; d <= n2; d++)
          if (!used.has(String(d))) {
            pick = String(d);
            break;
          }
        if (!pick) {
          skipped++;
          continue;
        }
        await focusCell(page, i);
        await page.keyboard.type(pick);
        vals[i] = pick;
        done++;
      }
      await page.waitForTimeout(500);
    };

    const tallies: Record<string, unknown> = {};
    await typeInto(1);
    tallies["k1"] = await readTally(page, card, rule);
    await page.screenshot({
      path: join(FRAMES, `tally-k1-${VP}-${scheme}-${browserName}.png`),
      clip: { x: board.x, y: Math.max(0, board.y - 14), width: Math.min(300, board.w), height: 44 },
    });

    // WRITE DIGITS THAT DO NOT CONFLICT. Typing "1" into every blank fills the board with
    // duplicates, the teacher's red rings light, and the census then measures a board that is
    // WRONG rather than a board that is FULL — red is a declared exception and would be counted
    // as residue. A greedy row/column/box choice keeps the mid-board legal; a cell with no legal
    // digit is skipped and named in `skipped`.
    await typeInto(2);
    tallies["k3"] = await readTally(page, card, rule);
    await page.screenshot({
      path: join(FRAMES, `tally-k3-${VP}-${scheme}-${browserName}.png`),
      clip: { x: board.x, y: Math.max(0, board.y - 14), width: Math.min(300, board.w), height: 44 },
    });

    await typeInto(17);
    tallies["k20"] = await readTally(page, card, rule);
    await page.screenshot({
      path: join(FRAMES, `tally-k20-${VP}-${scheme}-${browserName}.png`),
      clip: { x: board.x, y: Math.max(0, board.y - 14), width: Math.min(300, board.w), height: 44 },
    });

    // mid-board: the census and the findability rank with the board full of digits
    await typeInto(24);
    await focusCell(page, focusedIdx);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);
    out.censusMid = await pixelCensus(page);
    const boxesMid = await readCells(page);
    out.midBoard = {
      filled: boxesMid.filter((c) => c.value).length,
      invalidCells: await page.evaluate(
        () => document.querySelectorAll(".game-cell.is-invalid").length,
      ),
      skippedNoLegalDigit: skipped,
    };
    const midImg = await clipRaw(page, boardClip);
    const midCells = cellFeatures(midImg, boardOrigin, boxesMid, card);
    out.findabilityMid = {
      focusedIdx,
      byPeakThickness_allCells: rankOf(midCells, focusedIdx, "peakThicknessCssPx", () => true),
      byInkMass_emptyCells: rankOf(midCells, focusedIdx, "inkMass", (c) => c.empty),
      boardPeakThicknessCssPx: +Math.max(...midCells.map((c) => c.peakThicknessCssPx)).toFixed(2),
    };

    // 100% written
    await typeInto(200);
    tallies["full"] = await readTally(page, card, rule);
    await page.screenshot({
      path: join(FRAMES, `tally-full-${VP}-${scheme}-${browserName}.png`),
      clip: { x: board.x, y: Math.max(0, board.y - 14), width: Math.min(300, board.w), height: 44 },
    });
    out.tally = tallies;

    writeFileSync(
      join(OUT, `proto-${VP}-${scheme}-${browserName}.json`),
      JSON.stringify(out, null, 2),
    );
    console.log(
      JSON.stringify(
        {
          vp: VP,
          scheme,
          engine: browserName,
          census: {
            rest: (out.censusRest as any).chromaticPixels,
            focused: (out.censusFocused as any).chromaticPixels,
            mid: (out.censusMid as any).chromaticPixels,
            pixels: (out.censusRest as any).pixels,
            topBandsMid: (out.censusMid as any).topBands,
          },
          ring: {
            ink: (out.ring as any).core?.ink,
            overPaper: (out.ring as any).core?.inkOverPaper,
            paths: out.ringPaths,
            geom: out.ringGeometry,
            rankFocus: (out.findability as any).byPeakThickness_allCells,
            rankMid: (out.findabilityMid as any).byPeakThickness_allCells,
          },
          authorship: {
            painted: out.authorshipPainted,
            given: out.authorshipComputed,
            entry: out.authorshipComputedEntry,
          },
          marksSeam: out.marksSeam,
          tally: Object.fromEntries(
            Object.entries(tallies).map(([k, v]: [string, any]) => [
              k,
              {
                filled: v.geom?.filled,
                givens: v.geom?.givens,
                dasharray: v.geom?.dasharray,
                runs: v.runs?.runs,
                strokeCssPx: v.geom?.renderedStrokeCssPx,
                overPaper: v.read?.overPaper?.inkOverGround,
                overRule: v.read?.overRule?.inkOverGround,
                coreOverPaper: v.read?.core?.inkOverPaper,
                overhang: v.overhang?.aboveBoxCssPx,
                pose: v.geom?.poseTransform,
              },
            ]),
          ),
          retired,
        },
        null,
        2,
      ),
    );
  });
}
