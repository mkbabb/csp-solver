/**
 * ACC-GRAPHITE pass-2 RESEARCH — four questions the pass-1 record left open, measured on the
 * running pass-1 prototype (worktree wf_e58b4764-0fc-43, :4235), both engines.
 *
 *  A · the ring's OWN dash mechanism, controlled: `.cell-ghost-path` / `.cell-ghost-retrace`
 *      are pathLength="1" + stroke-dasharray:1 — a pattern whose period (2) exceeds its path
 *      (1), which is the family this lane's own dash law condemns. Swept on a bare page.
 *  B · the real ring, ABLATED: each pass painted alone, so the mid-row bands are attributable.
 *  C · the retrace at LARGER offsets, painted: `transform: scale(k)` about the path's own
 *      fill-box re-seats the inner pass at a simulated RETRACE_INSET without touching the
 *      generator. k = (cellHalf - I') / (cellHalf - 10).
 *  D · the draw-on, slowed: does a pencil go round ONCE (chromium) or from four corners at
 *      once (webkit)?  And does the second pass run the other way?
 *
 * READ-ONLY on product files. Writes only into this lane's readings/.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const OUT = new URL("../readings/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });
const bank = (name: string, v: unknown) =>
  writeFileSync(OUT + name, JSON.stringify(v, null, 1));

const round = (v: number, n = 3) => Math.round(v * 10 ** n) / 10 ** n;

interface Raw {
  data: Buffer;
  width: number;
  height: number;
  ch: number;
}
async function shot(page: Page, clip?: { x: number; y: number; width: number; height: number }): Promise<Raw> {
  const buf = await page.screenshot({ type: "png", ...(clip ? { clip } : {}) });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, ch: info.channels };
}
const lumAt = (p: Raw, x: number, y: number) => {
  const i = (p.width * y + x) * p.ch;
  return 0.2126 * p.data[i] + 0.7152 * p.data[i + 1] + 0.0722 * p.data[i + 2];
};

/** connected runs of ink along one image row (dark pixels on light paper) */
function rowRuns(png: Raw, y: number, thresh = 160) {
  const runs: { x0: number; x1: number; w: number }[] = [];
  let start = -1;
  for (let x = 0; x < png.width; x++) {
    const ink = lumAt(png, x, y) < thresh;
    if (ink && start < 0) start = x;
    if (!ink && start >= 0) {
      runs.push({ x0: start, x1: x - 1, w: x - start });
      start = -1;
    }
  }
  if (start >= 0) runs.push({ x0: start, x1: png.width - 1, w: png.width - start });
  return runs;
}

// ── A · the controlled dash sweep, on the RING's own declaration ─────────────────────────
test("A · pathLength=1 + dasharray:1 — the ring's mechanism, swept", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 600, height: 400 });
  // a rect as the ring is drawn: four sides, one subpath, M/L/L/L/Z — no curves.
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">
  <svg id="s" width="600" height="400" viewBox="0 0 600 400">
    <path id="p" d="M60,60 L540,60 L540,340 L60,340 Z" fill="none" stroke="#000"
          stroke-width="6" pathLength="1"/>
  </svg></body></html>`);
  const rows: unknown[] = [];
  const sweep = [
    { dash: "1", off: 0, why: "the ring at rest (the end state the cascade holds)" },
    { dash: "1", off: 0.25, why: "the draw-on, a quarter through" },
    { dash: "1", off: 0.5, why: "the draw-on, half" },
    { dash: "1", off: 0.75, why: "the draw-on, three quarters" },
    { dash: "1", off: 1, why: "the draw-on's first frame — nothing should be inked" },
    { dash: "0.25 0.25", off: 0, why: "control: a period SHORTER than the path" },
    { dash: "none", off: 0, why: "control: no dash at all" },
  ];
  for (const s of sweep) {
    await page.evaluate((v) => {
      const p = document.getElementById("p")!;
      p.style.strokeDasharray = v.dash;
      p.style.strokeDashoffset = String(v.off);
    }, s);
    await page.waitForTimeout(80);
    const png = await shot(page);
    // one scan across the ring's top side, and one down its left side
    const top = rowRuns(png, 60);
    // inked share of the whole ring: count ink pixels on the four sides' scanlines
    let inked = 0;
    let total = 0;
    for (const y of [60, 340]) {
      for (let x = 60; x <= 540; x++) {
        total++;
        if (lumAt(png, x, y) < 160) inked++;
      }
    }
    for (const x of [60, 540]) {
      for (let y = 60; y <= 340; y++) {
        total++;
        if (lumAt(png, x, y) < 160) inked++;
      }
    }
    rows.push({
      engine: browserName,
      dash: s.dash,
      dashoffset: s.off,
      why: s.why,
      topSideRuns: top.length,
      topSideInkPx: top.reduce((n, r) => n + r.w, 0),
      ringInkedShare: round(inked / total, 4),
    });
  }
  bank(`A-dash-${browserName}.json`, rows);
  console.log(JSON.stringify(rows, null, 1));
  expect(rows.length).toBe(sweep.length);
});

// ── the board, for B / C / D ──────────────────────────────────────────────────────────────
async function boot(page: Page, size = 3) {
  await page.goto(`./?size=${size}&difficulty=HARD`);
  await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
  await page.waitForTimeout(1200);
}

async function style(page: Page, css: string) {
  await page.evaluate((t: string) => {
    let el = document.getElementById("r2diag") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "r2diag";
      document.head.appendChild(el);
    }
    el.textContent = t;
  }, css);
  await page.waitForTimeout(220);
}

/** focus the first empty cell and return its client rect */
async function focusEmpty(page: Page) {
  return page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
    const idx = cells.findIndex((c) => !c.querySelector<HTMLInputElement>("input")?.value);
    const cell = cells[Math.max(0, idx)];
    cell.querySelector<HTMLInputElement>("input")?.focus();
    const r = cell.getBoundingClientRect();
    return { idx, x: r.x, y: r.y, w: r.width, h: r.height };
  });
}

test("B+C · the two passes, ablated and re-seated", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  const cell = await focusEmpty(page);
  await page.waitForTimeout(700);

  // the declared geometry, read live
  const decl = await page.evaluate(() => {
    const outer = document.querySelector<SVGPathElement>(
      ".game-cell:has(input:focus-visible) .cell-ghost-path",
    );
    const inner = document.querySelector<SVGPathElement>(
      ".game-cell:has(input:focus-visible) .cell-ghost-retrace",
    );
    const cs = (e: Element | null) => (e ? getComputedStyle(e) : null);
    const co = cs(outer);
    const ci = cs(inner);
    return {
      outer: outer
        ? {
            pathLength: outer.getAttribute("pathLength"),
            totalLength: +outer.getTotalLength().toFixed(2),
            dasharray: co!.strokeDasharray,
            dashoffset: co!.strokeDashoffset,
            width: co!.strokeWidth,
            opacity: co!.strokeOpacity,
            animation: co!.animationName + " " + co!.animationDuration,
            fill: co!.fill,
          }
        : null,
      inner: inner
        ? {
            pathLength: inner.getAttribute("pathLength"),
            totalLength: +inner.getTotalLength().toFixed(2),
            dasharray: ci!.strokeDasharray,
            dashoffset: ci!.strokeDashoffset,
            width: ci!.strokeWidth,
            display: ci!.display,
            animation: ci!.animationName + " " + ci!.animationDuration,
            fill: ci!.fill,
          }
        : null,
    };
  });

  const clip = {
    x: Math.round(cell.x - 6),
    y: Math.round(cell.y - 6),
    width: Math.round(cell.w + 12),
    height: Math.round(cell.h + 12),
  };
  const midY = Math.round(clip.height / 2);

  const scan = async (label: string, css: string) => {
    await style(page, css);
    const png = await shot(page, clip);
    const runs = rowRuns(png, midY);
    return {
      label,
      runs: runs.map((r) => ({ x0: r.x0, w: r.w })),
      runCount: runs.length,
      // paper between the first two runs on the LEFT of the cell
      leftPaperPx: runs.length >= 2 ? runs[1].x0 - (runs[0].x0 + runs[0].w) : null,
      totalInkPx: runs.reduce((n, r) => n + r.w, 0),
    };
  };

  const ablation = [
    await scan("both passes (HEAD of this prototype)", ""),
    await scan("outer pass alone", ".cell-ghost-retrace { display: none !important }"),
    await scan(
      "inner pass alone",
      ".game-cell:has(input:focus-visible) .cell-ghost-path { display: none !important }",
    ),
    await scan(
      "both, fill removed",
      ".game-cell:has(input:focus-visible) .cell-ghost-path { fill: none !important }",
    ),
  ];

  // C · re-seat the inner pass at simulated insets. cellHalf = 1000/9/2 = 55.5556 board units.
  const CELL_HALF = 1000 / 9 / 2;
  const reseat: unknown[] = [];
  for (const inset of [10, 12, 14, 16, 18, 20, 24]) {
    const k = (CELL_HALF - inset) / (CELL_HALF - 10);
    const s = await scan(
      `inset ${inset}`,
      `.game-cell:has(input:focus-visible) .cell-ghost-path { fill: none !important }
       .cell-ghost-retrace { transform-box: fill-box; transform-origin: center;
                             transform: scale(${k.toFixed(5)}) !important }`,
    );
    reseat.push({
      insetUnits: inset,
      extraScale: round(k, 5),
      runCount: s.runCount,
      leftPaperPx: s.leftPaperPx,
      runs: s.runs,
      totalInkPx: s.totalInkPx,
    });
  }
  await style(page, "");

  const out = { engine: browserName, cell, decl, ablation, reseat };
  bank(`BC-ring-${browserName}.json`, out);
  console.log(JSON.stringify(out, null, 1));
  expect(decl.outer).not.toBeNull();
});

test("D · the draw-on, slowed — one pencil or four", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await boot(page);
  // slow BOTH passes' draw-on and let each be sampled alone
  const SLOW = 4000;
  const samples: unknown[] = [];
  for (const which of ["outer", "inner"] as const) {
    await page.evaluate(() => {
      (document.activeElement as HTMLElement | null)?.blur();
    });
    await page.waitForTimeout(500);
    await style(
      page,
      `.game-cell:has(input:focus-visible) .cell-ghost-path,
       .game-cell:has(input:focus-visible) .cell-ghost-retrace {
         animation-duration: ${SLOW}ms !important;
         animation-timing-function: linear !important }
       .game-cell:has(input:focus-visible) .cell-ghost-path { fill: none !important }
       ${which === "outer" ? ".cell-ghost-retrace { display: none !important }" : ""}
       ${
         which === "inner"
           ? ".game-cell:has(input:focus-visible) .cell-ghost-path { display: none !important }"
           : ""
       }`,
    );
    const cell = await focusEmpty(page);
    const clip = {
      x: Math.round(cell.x - 6),
      y: Math.round(cell.y - 6),
      width: Math.round(cell.w + 12),
      height: Math.round(cell.h + 12),
    };
    const t0 = Date.now();
    for (const frac of [0.25, 0.5, 0.75]) {
      const want = t0 + SLOW * frac;
      while (Date.now() < want) await page.waitForTimeout(15);
      const png = await shot(page, clip);
      // walk the cell's perimeter band and count ARCS of ink
      const info = await (async () => {
        const w = png.width;
        const h = png.height;
        const ring: boolean[] = [];
        const at = (x: number, y: number) => lumAt(png, x, y) < 170;
        // sample a rectangle 12 px inside the crop edge — the ring's own band
        const m = 12;
        for (let x = m; x < w - m; x++) ring.push(at(x, m));
        for (let y = m; y < h - m; y++) ring.push(at(w - m - 1, y));
        for (let x = w - m - 1; x >= m; x--) ring.push(at(x, h - m - 1));
        for (let y = h - m - 1; y >= m; y--) ring.push(at(m, y));
        let arcs = 0;
        for (let i = 0; i < ring.length; i++) {
          const prev = ring[(i - 1 + ring.length) % ring.length];
          if (ring[i] && !prev) arcs++;
        }
        const inked = ring.filter(Boolean).length / ring.length;
        // where does the ink START, as a fraction round the ring?
        const starts: number[] = [];
        for (let i = 0; i < ring.length; i++) {
          const prev = ring[(i - 1 + ring.length) % ring.length];
          if (ring[i] && !prev) starts.push(+(i / ring.length).toFixed(3));
        }
        return { arcs, inkedShare: +inked.toFixed(3), starts, ringSamples: ring.length };
      })();
      samples.push({ engine: browserName, pass: which, frac, ...info });
    }
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.waitForTimeout(400);
  }
  await style(page, "");
  bank(`D-drawon-${browserName}.json`, samples);
  console.log(JSON.stringify(samples, null, 1));
  expect(samples.length).toBe(6);
});
