/**
 * ACC-GRAPHITE pass-2 RESEARCH, part 3 — the rows parts 1 and 2 left short.
 *
 *  H · the four POSES, not the dash. Part 2 showed pass 1's dash list is engine-identical on
 *      the real frame ring in isolation. The other thing on that surface is the four
 *      opacity-swapped `.progress-pose` layers. Four poses on a bare page, three at opacity 0,
 *      counted in both engines: is an opacity-0 pose ink in WebKit?
 *  I · COLUMN profile through a tick: rule thickness, paper, tick — the clearance the
 *      `scale(0.984)` was supposed to buy, in pixels, and the frame rule's own stroke width.
 *  J · the tally at 16x16, PAINTED: does a 6.3 px tick on a 5.6 px stroke still read as k runs?
 *  K · `.cell-peer` — how many stacking contexts a selection mints.
 *  L · the deck's clue, 6 vs 5 units, by ablation on the running poster (no second server).
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import sharp from "sharp";

const OUT = new URL("../readings/", import.meta.url).pathname;
const HERE = new URL("./", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const bank = (n: string, v: unknown) => writeFileSync(OUT + n, JSON.stringify(v, null, 1));

interface Raw {
  data: Buffer;
  width: number;
  height: number;
  ch: number;
}
async function shot(
  page: Page,
  clip?: { x: number; y: number; width: number; height: number },
): Promise<Raw> {
  const buf = await page.screenshot({ type: "png", ...(clip ? { clip } : {}) });
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, ch: info.channels };
}
const lumAt = (p: Raw, x: number, y: number) => {
  const i = (p.width * y + x) * p.ch;
  return 0.2126 * p.data[i] + 0.7152 * p.data[i + 1] + 0.0722 * p.data[i + 2];
};
function runs1d(v: boolean[]) {
  const out: { i0: number; w: number }[] = [];
  let s = -1;
  for (let i = 0; i < v.length; i++) {
    if (v[i] && s < 0) s = i;
    if (!v[i] && s >= 0) {
      out.push({ i0: s, w: i - s });
      s = -1;
    }
  }
  if (s >= 0) out.push({ i0: s, w: v.length - s });
  return out;
}
const rowRuns = (p: Raw, y: number, t = 165) =>
  runs1d(Array.from({ length: p.width }, (_, x) => lumAt(p, x, y) < t));
const colRuns = (p: Raw, x: number, t = 165) =>
  runs1d(Array.from({ length: p.height }, (_, y) => lumAt(p, x, y) < t));

const FRAME_D = readFileSync(HERE + "frame-trace-d.txt", "utf8").trim();

test("H · four opacity-swapped poses, both engines", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 800, height: 800 });
  // four poses in registration (the estate's own boil stack), three hidden by opacity
  await page.setContent(`<!doctype html><html><head><style>
    .pose { opacity: 0; will-change: opacity }
    .pose.is-active { opacity: 1 }
  </style></head><body style="margin:0;background:#fff">
  <svg width="800" height="800" viewBox="-20 -20 1040 1040">
    ${[0, 1, 2, 3]
      .map(
        (f) =>
          `<g class="pose${f === 0 ? " is-active" : ""}"><path class="p" d="${FRAME_D}" fill="none" stroke="#000" stroke-width="10" pathLength="1000"/></g>`,
      )
      .join("")}
  </svg></body></html>`);
  const walk = async () => {
    const png = await shot(page);
    const s = 800 / 1040;
    const px = (u: number) => Math.round((u + 20) * s);
    const [x0, x1, y0, y1] = [px(12), px(988), px(0), px(1000)];
    const ring: boolean[] = [];
    for (let x = x0; x <= x1; x++) ring.push(lumAt(png, x, y0) < 170);
    for (let y = y0; y <= y1; y++) ring.push(lumAt(png, x1, y) < 170);
    for (let x = x1; x >= x0; x--) ring.push(lumAt(png, x, y1) < 170);
    for (let y = y1; y >= y0; y--) ring.push(lumAt(png, x0, y) < 170);
    let r = 0;
    for (let i = 0; i < ring.length; i++)
      if (ring[i] && !ring[(i - 1 + ring.length) % ring.length]) r++;
    return { runs: r, share: +(ring.filter(Boolean).length / ring.length).toFixed(3) };
  };
  const rows: unknown[] = [];
  for (const dash of ["100 4000", "1000 1000", "none"]) {
    for (const mode of ["one active (the shipped stack)", "all four active (control)"]) {
      await page.evaluate(
        (v) => {
          document.querySelectorAll<SVGPathElement>(".p").forEach((p) => {
            p.style.strokeDasharray = v.d;
          });
          document.querySelectorAll<HTMLElement>(".pose").forEach((g, i) => {
            g.classList.toggle("is-active", v.all || i === 0);
          });
        },
        { d: dash, all: mode.startsWith("all") },
      );
      await page.waitForTimeout(90);
      rows.push({ engine: browserName, dash, mode, ...(await walk()) });
    }
  }
  bank(`H-poses-${browserName}.json`, rows);
  console.log(JSON.stringify(rows, null, 1));
  expect(rows.length).toBe(6);
});

async function boot(page: Page, size = 3) {
  await page.goto(`./?size=${size}&difficulty=HARD`);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
}
async function typeN(page: Page, n: number) {
  const idx = await page.evaluate((want: number) => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
    return cells
      .map((c, i) => ({ i, v: c.querySelector<HTMLInputElement>("input")?.value }))
      .filter((c) => !c.v)
      .slice(0, want)
      .map((c) => c.i);
  }, n);
  for (const i of idx) {
    await page.evaluate((k: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [k].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, i);
    await page.keyboard.type("1");
    await page.waitForTimeout(35);
  }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(800);
}

test("I+J+K · the tally's clearance, 16x16 runs, and the peer wash's stacking contexts", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const out: Record<string, unknown> = { engine: browserName };

  for (const size of [3, 4]) {
    const label = size === 3 ? "9x9" : "16x16";
    await boot(page, size);
    const meta = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
      const grid = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid")!;
      const r = grid.getBoundingClientRect();
      // the frame rule's own stroke, in the same viewBox the trace lives in
      const frame = document.querySelector<SVGPathElement>(
        "svg.hand-drawn-grid .grid-frame, svg.hand-drawn-grid path",
      );
      const all = Array.from(document.querySelectorAll<SVGPathElement>("svg.hand-drawn-grid path"));
      return {
        writable: cells.filter((c) => !c.querySelector<HTMLInputElement>("input")?.value).length,
        board: { x: r.x, y: r.y, w: r.width, h: r.height },
        pxPerUnit: +(r.width / 1000).toFixed(4),
        firstPathClass: frame?.getAttribute("class") ?? null,
        pathClasses: Array.from(new Set(all.map((p) => p.getAttribute("class") ?? "")))
          .slice(0, 12)
          .map((c) => {
            const p = all.find((q) => (q.getAttribute("class") ?? "") === c)!;
            return { c, sw: getComputedStyle(p).strokeWidth, swAttr: p.getAttribute("stroke-width") };
          }),
      };
    });
    await typeN(page, 20);

    // COLUMN profile: scan straight down through the board's top edge at many x, and keep the
    // columns where a tick is present (2 bands) vs absent (1 band).
    const clip = {
      x: Math.round(meta.board.x + 20),
      y: Math.round(meta.board.y - 10),
      width: 340,
      height: 40,
    };
    const png = await shot(page, clip);
    const cols: { x: number; bands: { i0: number; w: number }[] }[] = [];
    for (let x = 0; x < png.width; x++) cols.push({ x, bands: colRuns(png, x) });
    const twoBand = cols.filter((c) => c.bands.length >= 2);
    const oneBand = cols.filter((c) => c.bands.length === 1);
    // row profile too, for the run count along the rule
    const rowsIn = [];
    for (let y = 0; y < png.height; y++) {
      const r = rowRuns(png, y);
      if (r.length) rowsIn.push({ y, runs: r.length, ink: r.reduce((n, q) => n + q.w, 0) });
    }
    out[label] = {
      writable: meta.writable,
      pxPerUnit: meta.pxPerUnit,
      pathStrokes: meta.pathClasses,
      colsScanned: cols.length,
      colsWithTick: twoBand.length,
      colsRuleOnly: oneBand.length,
      // the clearance: paper rows between band 1 (rule) and band 2 (tick), median
      clearancePx: median(
        twoBand.map((c) => c.bands[1].i0 - (c.bands[0].i0 + c.bands[0].w)),
      ),
      ruleThicknessPx: median(oneBand.map((c) => c.bands[0].w)),
      tickThicknessPx: median(twoBand.map((c) => c.bands[1].w)),
      rowProfile: rowsIn.map((r) => `${r.y}:${r.runs}/${r.ink}`),
      maxRunsOnARow: Math.max(...rowsIn.map((r) => r.runs)),
    };
  }

  // K · stacking contexts on a 9x9 selection
  await boot(page, 3);
  const peers = await page.evaluate(() => {
    const cell = document.querySelector<HTMLElement>(".sudoku-cell");
    cell?.querySelector<HTMLInputElement>("input")?.focus();
    return new Promise((res) =>
      setTimeout(() => {
        const washes = Array.from(document.querySelectorAll<HTMLElement>(".cell-peer"));
        const shown = washes.filter((w) => getComputedStyle(w).display !== "none");
        res({
          nodes: washes.length,
          rendered: shown.length,
          opacities: Array.from(new Set(shown.map((w) => getComputedStyle(w).opacity))),
          background: shown[0] ? getComputedStyle(shown[0]).backgroundColor : null,
          // every element with 0 < opacity < 1 mints a stacking context
          subUnitOpacityNodes: Array.from(document.querySelectorAll<HTMLElement>("*")).filter(
            (e) => {
              const o = +getComputedStyle(e).opacity;
              return o > 0 && o < 1;
            },
          ).length,
        });
      }, 700),
    );
  });
  out.peer = peers;

  // L · the deck's clue, 6 vs 5, by ablation
  await page.goto("./");
  await page.waitForTimeout(2500);
  const deck = await page.evaluate(() => {
    const glyphs = Array.from(
      document.querySelectorAll<SVGPathElement>(".poster-board path, .sketch-card path"),
    ).filter((p) => p.getAttribute("stroke-width"));
    const byW: Record<string, number> = {};
    for (const g of glyphs) {
      const w = getComputedStyle(g).strokeWidth;
      byW[w] = (byW[w] ?? 0) + 1;
    }
    return { glyphs: glyphs.length, byStrokeWidth: byW };
  });
  out.deck = deck;

  bank(`IJKL-${browserName}.json`, out);
  console.log(JSON.stringify(out, null, 1));
  expect(out["9x9"]).toBeTruthy();
});

function median(v: number[]): number | null {
  if (!v.length) return null;
  const s = [...v].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
