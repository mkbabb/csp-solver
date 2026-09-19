/**
 * graphite-arm.probe.ts — ACC-GRAPHITE pass 1, the family's own instrument.
 *
 * ONE page, ONE deal, FOUR arms. The deal this app hands you is random per load, so an arm
 * measured on its own page is measured on its own puzzle; every arm here is a stylesheet
 * toggled on the SAME page at the SAME game state, which is the only way the before and the
 * after are the same measurement.
 *
 *   control — HEAD, untouched
 *   G1      — the charter's literal prototype (proto/G1-charter-literal.css)
 *   G2      — the family's own answer to what G1 measures (proto/G2-form-carried.css)
 *   G3      — G2 plus the selection wash, which the family's own sentence retires and the
 *             charter's list does not name (proto/G3-whole-family.css)
 *   G4      — G3 with the ring's weight stated as a RATIO to the frame line rather than as a
 *             unit count, because G3's phone reading said 16 units is a tie
 *             (proto/G4-ratio-weight.css)
 *
 * Per theme (env `VP`: desk | phone), at three game states (rest / one cell focused /
 * mid-board), it banks:
 *
 *   A. THE PIXEL CENSUS, re-run under r0's own band (OKLCH 40-115 deg) and chroma floor
 *      (C >= 0.012). The method is r0's `hue-census.probe.ts` §C, copied verbatim.
 *   B. THE 1.4.11 RATIOS, off the PAINTED BYTES BY DIFFERENCE. A mark's footprint is the set
 *      of pixels that CHANGE when the mark is hidden; its ink is what those pixels read with
 *      the mark shown and its ground is what the SAME pixels read with it hidden, partitioned
 *      by what the ground actually is (the rule, or the paper). No hex arithmetic, no guessed
 *      sample point, and no hoping about what lies under a wobbled stroke.
 *   C. THE FINDABILITY CENSUS. Two features, both deal-independent where it matters:
 *        peakThickness — the thickest ink run in a cell's tile, in CSS px. Weight is what an
 *                        achromatic ring has to bet on, so weight is measured directly, and
 *                        against every rule the board already draws.
 *        inkMass       — the tile's mean ink weight, ranked among the EMPTY cells (a digit is
 *                        not a rival for "which cell is selected").
 *      A mark that is not the unique maximum of some feature has no pop-out, and a
 *      five-second read is then a serial search of 81 items.
 *   D. AUTHORSHIP — a given's glyph against an entry's, in both layers.
 *
 * READ-ONLY on the product. Writes JSON under this lane's evidence dir only.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { rgbToOklch, ratio, lum } from "./oklch";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/readings";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

const VP = (process.env.VP || "desk") as "desk" | "phone";
const PROTO =
  process.env.ACC_PROTO ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/proto";
const ARMS = ["control", "G1", "G2", "G3", "G4"] as const;
type Arm = (typeof ARMS)[number];
const ARM_CSS: Record<Arm, string | null> = {
  control: null,
  G1: `${PROTO}/G1-charter-literal.css`,
  G2: `${PROTO}/G2-form-carried.css`,
  G3: `${PROTO}/G3-whole-family.css`,
  G4: `${PROTO}/G4-ratio-weight.css`,
};

const CHROMA_FLOOR = 0.012;
const BAND = [40, 115] as const;
const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(900);
}

/** Swap the arm's stylesheet in place. `null` clears it. */
async function setArm(page: Page, arm: Arm) {
  const css = ARM_CSS[arm] ? readFileSync(ARM_CSS[arm]!, "utf8") : "";
  await page.evaluate((text: string) => {
    let el = document.getElementById("acc-graphite-arm") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "acc-graphite-arm";
      document.head.appendChild(el);
    }
    el.textContent = text;
  }, css);
  await page.waitForTimeout(300);
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
  for (let i = 0; i < total; i++) {
    const o = i * ch;
    const { C, h } = rgbToOklch(data[o], data[o + 1], data[o + 2]);
    if (C >= CHROMA_FLOOR) {
      chromatic++;
      sumC += C;
      if (h >= BAND[0] && h <= BAND[1]) inBand++;
    }
  }
  return {
    pixels: total,
    chromaticPixels: chromatic,
    chromaticShare: +(chromatic / total).toFixed(6),
    inFamilyShare: chromatic ? +(inBand / chromatic).toFixed(4) : 0,
    offFamilyShare: chromatic ? +(1 - inBand / chromatic).toFixed(4) : 0,
    meanChroma: chromatic ? +(sumC / chromatic).toFixed(4) : 0,
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

/** on = the mark shown, off = the mark hidden. Returns the mark's own ink and its real ground. */
function diffMark(on: Img, off: Img, paper: Px, rule: Px, thresh = 8) {
  const pl = lum(paper.r, paper.g, paper.b);
  const rl = lum(rule.r, rule.g, rule.b);
  const hits: { a: Px; b: Px; d: number; y: number }[] = [];
  for (let y = 0; y < Math.min(on.h, off.h); y++) {
    for (let x = 0; x < Math.min(on.w, off.w); x++) {
      const a = on.at(x, y);
      const b = off.at(x, y);
      const d = Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
      if (d >= thresh) hits.push({ a, b, d, y });
    }
  }
  if (!hits.length)
    return { footprintPx: 0, yFirst: null, yLast: null, core: null, overRule: null, overPaper: null };
  const sorted = [...hits].sort((p, q) => q.d - p.d);
  const core = sorted.slice(0, Math.max(1, Math.round(sorted.length * 0.1)));
  const coreOn = mean(core.map((h) => h.a), paper);
  const coreOff = mean(core.map((h) => h.b), paper);
  // WHAT THE MARK COVERS, in three buckets, not two: a pixel is over the RULE only if its
  // hidden-state luminance sits within 25% of the paper-to-rule span of the rule end, over the
  // PAPER only if within 25% of the paper end, and is otherwise an anti-aliased EDGE and is
  // excluded. A two-bucket split calls every soft edge a rule and prices the mark against a
  // grey that nothing on the board actually paints.
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
  };
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

/** Per-cell weight features, over a tile = the cell rect dilated 6 CSS px. */
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
    // "ink" = at least a quarter of the paper-to-full-graphite luminance distance.
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
    // THICKNESS, by distance transform. A run length lies at a junction: where a horizontal
    // rule crosses a vertical one, BOTH runs are the tile's whole width. The thickness of a
    // stroke is twice the radius of the largest disk that fits inside it, so the mask gets a
    // two-pass chamfer distance transform and the tile's peak is 2x its maximum.
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

for (const scheme of ["light", "dark"] as const) {
  test(`${VP}/${scheme} — the arms on one deal`, async ({ page, browserName }) => {
    if (VP === "phone") await page.setViewportSize({ width: 393, height: 699 });
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    const tok = await painted(page, [
      "--color-card",
      "--color-background",
      "--grid-line-color",
      "--color-pencil-graphite",
      "--ink-press-quiet",
      "--ink-press-rule",
      "--color-user-ink",
      "--color-focus-sketch",
      "--color-progress-ink",
      "--color-foreground",
      "--color-crayon-blue",
    ]);
    const P = (n: string): Px => ({ r: tok[n][0], g: tok[n][1], b: tok[n][2] });
    const card = P("--color-card");
    const rule = P("--grid-line-color");

    const out: Record<string, unknown> = {
      viewport: VP,
      engine: browserName,
      scheme,
      tokensPainted: tok,
      arms: {},
    };
    const armRec = (a: Arm) => (out.arms as Record<string, Record<string, unknown>>)[a];
    for (const a of ARMS) (out.arms as Record<string, unknown>)[a] = {};

    // ── STATE 1: rest ────────────────────────────────────────────────────────
    for (const a of ARMS) {
      await setArm(page, a);
      armRec(a).censusRest = await pixelCensus(page);
    }

    // ── STATE 2: one cell focused (a BOX CORNER, empty: the hardest ground) ──
    const boxes: CellBox[] = await page.evaluate(() =>
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
    const n = Math.round(Math.sqrt(boxes.length));
    const wanted =
      boxes.find((c) => !c.value && Math.floor(c.i / n) % 3 === 0 && c.i % n % 3 === 0 && c.i >= n)
        ?.i ?? boxes.find((c) => !c.value)!.i;
    await page.evaluate((i: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [i].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, wanted);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);
    // ArrowLeft off a column-0 cell can walk focus out of the grid entirely, and the run then
    // measures a ring that is not there. Read where focus actually landed and, if it left the
    // board, put it back on the cell we asked for and arm :focus-visible with a key that
    // cannot leave (Shift is not a navigation key and does not move the caret).
    let focusedIdx: number = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
      return cells.findIndex((c) => c.contains(document.activeElement));
    });
    if (focusedIdx < 0) {
      await page.evaluate((i: number) => {
        document
          .querySelectorAll<HTMLElement>(".sudoku-cell")
          [i].querySelector<HTMLInputElement>("input")
          ?.focus();
      }, wanted);
      await page.keyboard.press("Shift");
      await page.waitForTimeout(300);
      focusedIdx = await page.evaluate(() => {
        const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
        return cells.findIndex((c) => c.contains(document.activeElement));
      });
    }
    expect(focusedIdx, "focus must be on a board cell before the ring is measured").toBeGreaterThanOrEqual(0);
    const board = await page.evaluate(() => {
      const s = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
      const b = s.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const tb = boxes[focusedIdx];
    const RPAD = 16;
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

    for (const a of ARMS) {
      await setArm(page, a);
      armRec(a).censusFocused = await pixelCensus(page);

      const ringOn = await clipRaw(page, ringClip);
      await setHide(page, ".cell-ghost");
      const ringOff = await clipRaw(page, ringClip);
      await setHide(page, null);
      armRec(a).ring = diffMark(ringOn, ringOff, card, rule);

      const boardImg = await clipRaw(page, boardClip);
      const cells = cellFeatures(boardImg, boardOrigin, boxes, card);
      armRec(a).findability = {
        focusedIdx,
        label: tb.label,
        byPeakThickness_allCells: rankOf(cells, focusedIdx, "peakThicknessCssPx", () => true),
        byPeakThickness_emptyCells: rankOf(cells, focusedIdx, "peakThicknessCssPx", (c) => c.empty),
        byInkMass_emptyCells: rankOf(cells, focusedIdx, "inkMass", (c) => c.empty),
        boardPeakThicknessCssPx: +Math.max(...cells.map((c) => c.peakThicknessCssPx)).toFixed(2),
      };

      await page.screenshot({
        path: join(FRAMES, `ring-${a}-${VP}-${scheme}-${browserName}.png`),
        clip: {
          x: ringClip.x - tb.w,
          y: ringClip.y - tb.h,
          width: Math.min(ringClip.width + tb.w * 2, board.w),
          height: Math.min(ringClip.height + tb.h * 2, board.h),
        },
      });
    }

    // ── STATE 3: mid-board (the meter has arc to draw) ───────────────────────
    await setArm(page, "control");
    await page.evaluate((i: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [i].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, focusedIdx);
    for (let i = 0; i < 70; i++) {
      await page.keyboard.type("1");
      await page.keyboard.press("ArrowRight");
      if (i % 9 === 8) await page.keyboard.press("ArrowDown");
    }
    await page.waitForTimeout(900);

    // the selection is put back on the target, so the mid-board reading answers the question
    // that matters: is the ring still the unique mark once the board is FULL of digits? This
    // is where a chromatic ring loses its own feature, because your digits are the same hue
    // family as the ring (r0: user-ink 262.9 deg vs focus-sketch 253.3 deg, 9.6 deg apart).
    await page.evaluate((i: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [i].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, focusedIdx);
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);
    const boxesMid: CellBox[] = await page.evaluate(() =>
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

    const conflicts = await page.evaluate(() => ({
      invalidCells: document.querySelectorAll(".game-cell.is-invalid").length,
      filled: Array.from(document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")).filter(
        (i) => i.value,
      ).length,
    }));
    out.midBoardConflicts = conflicts;

    const sb = board;
    const topClip = { x: sb.x, y: Math.max(0, sb.y - 16), width: sb.w, height: 32 };
    for (const a of ARMS) {
      await setArm(page, a);
      armRec(a).censusMid = await pixelCensus(page);

      const midImg = await clipRaw(page, boardClip);
      const midCells = cellFeatures(midImg, boardOrigin, boxesMid, card);
      armRec(a).findabilityMid = {
        focusedIdx,
        filledCells: boxesMid.filter((c) => c.value).length,
        byPeakThickness_allCells: rankOf(midCells, focusedIdx, "peakThicknessCssPx", () => true),
        byInkMass_emptyCells: rankOf(midCells, focusedIdx, "inkMass", (c) => c.empty),
        boardPeakThicknessCssPx: +Math.max(...midCells.map((c) => c.peakThicknessCssPx)).toFixed(2),
      };

      const geom = await page.evaluate(() => {
        const p = document.querySelector<SVGPathElement>(".progress-trace");
        const svg = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
        const b = svg.getBoundingClientRect();
        const a11y = document.querySelector('[role="progressbar"]');
        if (!p) return { present: false, valuenow: a11y?.getAttribute("aria-valuenow") };
        const cs = getComputedStyle(p);
        const vb = svg.getAttribute("viewBox")!;
        const size = parseFloat(vb.split(/\s+/)[2]);
        return {
          present: true,
          stroke: cs.stroke,
          strokeWidth: cs.strokeWidth,
          strokeOpacity: cs.strokeOpacity,
          renderedStrokeCssPx: +(parseFloat(cs.strokeWidth) * (b.width / size)).toFixed(3),
          transform: getComputedStyle(document.querySelector(".progress-pose")!).transform,
          valuenow: a11y?.getAttribute("aria-valuenow"),
          valuetext: a11y?.getAttribute("aria-valuetext"),
        };
      });

      const traceOn = await clipRaw(page, topClip);
      await setHide(page, ".progress-pose");
      const traceOff = await clipRaw(page, topClip);
      await setHide(page, null);
      const read = diffMark(traceOn, traceOff, card, rule);
      // THE UNAMBIGUOUS PAIR. A bucket over anti-aliased ground can be argued with; two inks
      // cannot. The trace's ink is the core of its own footprint; the RULE's ink is the
      // extremum of the same strip with the trace hidden, which is the frame line itself as
      // the engine paints it. Their ratio is "a graphite trace over a graphite rule", stated
      // as the one number the kill condition asks for.
      let ruleInk: Px = rule;
      {
        const pl2 = lum(card.r, card.g, card.b);
        let bd = -1;
        // only the rows the FRAME LINE occupies: the strip starts 16 CSS px above the board
        // box, so +/-6 px of that box edge is the rule and nothing else. Widen it and the
        // extremum is the first digit in the top row, which is not a rule.
        const y0r = Math.max(0, Math.round((16 - 6) * traceOff.dpr));
        const y1r = Math.min(traceOff.h, Math.round((16 + 6) * traceOff.dpr));
        for (let y = y0r; y < y1r; y++)
          for (let x = 0; x < traceOff.w; x++) {
            const q = traceOff.at(x, y);
            const d = Math.abs(lum(q.r, q.g, q.b) - pl2);
            if (d > bd) {
              bd = d;
              ruleInk = q;
            }
          }
      }
      const traceVsRule = read.core ? +ratio(read.core.ink, ruleInk).toFixed(2) : null;
      // and how much of the trace still LANDS on the rule after any offset
      const onRulePx = read.overRule?.px ?? 0;
      const onPaperPx = read.overPaper?.px ?? 0;
      const overhang =
        read.yFirst != null
          ? {
              firstInkPageY: +(topClip.y + read.yFirst / traceOn.dpr).toFixed(2),
              lastInkPageY: +(topClip.y + read.yLast! / traceOn.dpr).toFixed(2),
              boardBoxTopPageY: +sb.y.toFixed(2),
              aboveBoxCssPx: +(sb.y - (topClip.y + read.yFirst / traceOn.dpr)).toFixed(2),
            }
          : null;
      armRec(a).meter = {
        geom,
        read,
        overhang,
        ruleInkPainted: ruleInk,
        traceInkOverRuleInk: traceVsRule,
        footprintOnRulePx: onRulePx,
        footprintOnPaperPx: onPaperPx,
        shareOnRule: onRulePx + onPaperPx ? +(onRulePx / (onRulePx + onPaperPx)).toFixed(3) : null,
      };

      await page.screenshot({
        path: join(FRAMES, `meter-${a}-${VP}-${scheme}-${browserName}.png`),
        clip: { x: sb.x, y: Math.max(0, sb.y - 14), width: Math.min(300, sb.w), height: 44 },
      });
    }

    // ── D. authorship, both layers, under each arm ───────────────────────────
    for (const a of ARMS) {
      await setArm(page, a);
      armRec(a).authorship = await page.evaluate(() => {
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
        const entry = cells.find((c) =>
          /your entry/i.test(c.querySelector("input")?.getAttribute("aria-label") ?? ""),
        );
        return { given: read(given), entry: read(entry) };
      });
    }

    // authorship, painted: a given's glyph and an entry's glyph, by difference against a
    // board with the glyph layer hidden.
    await setArm(page, "control");
    const glyphSpots = await page.evaluate(() => {
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
    const glyphRead: Record<string, unknown> = {};
    for (const a of ARMS) {
      await setArm(page, a);
      const per: Record<string, unknown> = {};
      for (const k of ["given", "entry"] as const) {
        const s = glyphSpots[k];
        if (!s) continue;
        const clip = { x: s.x + 2, y: s.y + 2, width: s.w - 4, height: s.h - 4 };
        const on = await clipRaw(page, clip);
        await setHide(page, ".glyph-svg");
        const off = await clipRaw(page, clip);
        await setHide(page, null);
        const d = diffMark(on, off, card, rule, 10);
        const feats = cellFeatures(on, { x: clip.x, y: clip.y }, [
          { i: 0, x: clip.x, y: clip.y, w: clip.width, h: clip.height, value: "1", label: "" },
        ], card);
        per[k] = { core: d.core, footprintPx: d.footprintPx, peakThicknessCssPx: feats[0].peakThicknessCssPx };
      }
      glyphRead[a] = per;
    }
    out.glyphPainted = glyphRead;
    await setArm(page, "control");

    writeFileSync(join(OUT, `arms-${VP}-${scheme}-${browserName}.json`), JSON.stringify(out, null, 2));
    const brief = Object.fromEntries(
      (ARMS as readonly Arm[]).map((a) => {
        const r = armRec(a) as Record<string, any>;
        return [
          a,
          {
            offFamily: [
              r.censusRest?.offFamilyShare,
              r.censusFocused?.offFamilyShare,
              r.censusMid?.offFamilyShare,
            ],
            ringOverPaper: r.ring?.core?.inkOverPaper,
            ringInk: r.ring?.core?.ink,
            ringFootprint: r.ring?.footprintPx,
            peakThickAll: r.findability?.byPeakThickness_allCells,
            peakThickAllMid: r.findabilityMid?.byPeakThickness_allCells,
            peakThickEmpty: r.findability?.byPeakThickness_emptyCells,
            boardPeak: r.findability?.boardPeakThicknessCssPx,
            meterOverRule: r.meter?.read?.overRule?.inkOverGround,
            traceInkOverRuleInk: r.meter?.traceInkOverRuleInk,
            shareOnRule: r.meter?.shareOnRule,
            meterOverPaper: r.meter?.read?.overPaper?.inkOverGround,
            meterInk: r.meter?.read?.core?.ink,
            meterStrokeCssPx: r.meter?.geom?.renderedStrokeCssPx,
            overhang: r.meter?.overhang?.aboveBoxCssPx,
            authorship: r.authorship,
          },
        ];
      }),
    );
    console.log(
      JSON.stringify({ vp: VP, scheme, engine: browserName, focusedIdx, brief, glyphPainted: glyphRead }, null, 2),
    );
  });
}
