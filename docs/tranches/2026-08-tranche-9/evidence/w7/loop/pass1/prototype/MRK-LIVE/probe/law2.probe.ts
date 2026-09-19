/**
 * T9-W7 pass 1 · MRK-LIVE — R3-a1 THE PROPORTIONAL LAW, taken over the POPULATION.
 *
 * r0's R3-a reads ONE cell rule and ONE ring. Both wobbles are three uniform draws per edge, so
 * a single reading is a sample, not a law: the same 948-unit rule reads σ 1.031 / 1.443 / 0.631
 * across r0's three boards purely because the probe picked a different line index. This row
 * takes EVERY instance at each board size and reports the mean, so the law is asserted against a
 * population rather than a draw.
 *
 * NORMALISATION, corrected. `getTotalLength()` on a ghost is the whole PERIMETER (four edges);
 * on a cell rule it is one edge. The per-unit figure divides σ by the length of the edge the σ
 * was taken ON — perimeter ÷ 4 for the ring — or the ring reads 4× quieter than it is.
 *
 * THE RE-BASED LAW: σ ÷ own edge length agrees between the ring and the grid within
 * [0.5×, 2.0×]. What it predicts, and what r0's law did not: the ring is SUPPOSED to be
 * quieter in absolute px, by exactly the ratio of the edges.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

const POP = `(sel, l0, l1, edgeDivisor, samples, limit) => {
  const els = Array.from(document.querySelectorAll(sel)).slice(0, limit);
  const rows = [];
  for (const el of els) {
    const svg = el.ownerSVGElement; if (!svg) continue;
    const vb = svg.viewBox.baseVal;
    const scale = svg.getBoundingClientRect().width / (vb.width || 1);
    const total = el.getTotalLength();
    if (!total) continue;
    const pts = [];
    for (let i = 0; i <= samples; i++) {
      const p = el.getPointAtLength(total * (l0 + (l1 - l0) * (i / samples)));
      pts.push([p.x * scale, p.y * scale]);
    }
    const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    let sum = 0, max = 0;
    for (const [x, y] of pts) {
      const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
      sum += d * d; if (d > max) max = d;
    }
    rows.push({ sigmaPx: Math.sqrt(sum / pts.length), maxDevPx: max, edgePx: (total / edgeDivisor) * scale, scale });
  }
  if (!rows.length) return null;
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((v) => (v - m) ** 2))); };
  const sig = rows.map((r) => r.sigmaPx);
  const per = rows.map((r) => (r.sigmaPx / r.edgePx) * 1000);
  const r4 = (v) => Math.round(v * 10000) / 10000;
  return {
    n: rows.length,
    sigmaPxMean: r4(mean(sig)), sigmaPxSd: r4(sd(sig)),
    sigmaPxMin: r4(Math.min(...sig)), sigmaPxMax: r4(Math.max(...sig)),
    edgePxMean: r4(mean(rows.map((r) => r.edgePx))),
    sigmaPerKpxMean: r4(mean(per)), sigmaPerKpxSd: r4(sd(per)),
    scale: r4(rows[0].scale),
  };
}`;

test("R3-a1 THE PROPORTIONAL LAW over the population", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  const sizes: Record<string, unknown> = {};
  for (const [label, q, segments] of [
    ["4x4", "?size=2&difficulty=EASY", 4],
    ["9x9", "?size=3&difficulty=EASY", 4],
    ["16x16", "?size=4&difficulty=EASY", 2],
  ] as const) {
    await boardReady(page, q);
    // Pose 0's cell rules only: the first `lines` entries of path.cell-line are layer 0.
    const lines = await page.evaluate(
      () =>
        document
          .querySelector(".boil-frame-layer")!
          .querySelectorAll("path.cell-line").length,
    );
    const grid = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: POP, a: ["path.cell-line", 0.03, 0.97, 1, 32, lines] },
    );
    // Every ghost's TOP edge: 0.02 → 0.23 of the closed perimeter.
    const ring = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: POP, a: [".cell-ghost-path", 0.02, 0.23, 4, 32, 400] },
    );
    const ratio = grid && ring ? ring.sigmaPerKpxMean / grid.sigmaPerKpxMean : null;
    sizes[label] = {
      ringSegmentsPerEdge: segments,
      gridSegmentsPerLine: 4,
      grid,
      ring,
      edgeRatio_gridOverRing: grid && ring ? Math.round((grid.edgePxMean / ring.edgePxMean) * 100) / 100 : null,
      sigmaRatio_gridOverRing: grid && ring ? Math.round((grid.sigmaPxMean / ring.sigmaPxMean) * 100) / 100 : null,
      perUnitRatio_ringOverGrid: ratio ? Math.round(ratio * 1000) / 1000 : null,
      band: [0.5, 2.0],
      pass: !!ratio && ratio >= 0.5 && ratio <= 2.0,
    };
  }
  bank(`law2-${browserName}.json`, { engine: browserName, sizes });
  console.log("LAW2 " + JSON.stringify(sizes, null, 2));
  expect(Object.keys(sizes).length).toBe(3);
});
