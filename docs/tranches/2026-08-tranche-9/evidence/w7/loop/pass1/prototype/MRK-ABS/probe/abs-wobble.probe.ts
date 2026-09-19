/**
 * MRK-ABS pass-2 (PROTOTYPE) · G-ABS-1 + G-ABS-2 + MA-C, read off the LIVE DOM.
 *
 * r0's `wobble.probe.ts` R3-a samples ONE ring on ONE board (CV 0.27-0.60 across cells, so a
 * single cell flakes). This widens it to EVERY cell at every size — n = 16 / 81 / 256 — and
 * scores each size against THAT SIZE's own grid sigma at the same viewport, which is what the
 * synthesis spec's table claims.
 *
 * sigma is taken exactly as r0 takes it: walk `getPointAtLength` over one edge in user units,
 * scale by the element's OWN svg px-per-unit (clientWidth / viewBox width; every subject is
 * `xMidYMid meet` on a square box, so one scalar is exact), fit the chord, RMS perpendicular
 * residual. The ghost svg's viewBox is the cell padded 15% each side (`useGameCell.ts:86-97`),
 * so the ring renders at 1/1.3 of the grid's own scale on the same board — the probe reads that
 * scale rather than assuming it.
 *
 * MA-C (clearance, from the DOM instead of the library): the ghost svg's CSS box IS the cell
 * (`absolute inset-0 h-full w-full`), so the drawn rect sits inside it with a margin of
 * cellPx x 0.15/1.3, and the ink reaches (max outward excursion of the geometry bbox) + half
 * the tier-2 stroke (7 user units, `gameCell.css`). Cross that and a focus ring paints over the
 * neighbour's own ghost and over `.cell-peer`.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const SIZES = [
  ["4x4", "?size=2&difficulty=EASY", 4],
  ["9x9", "?size=3&difficulty=EASY", 9],
  ["16x16", "?size=4&difficulty=EASY", 16],
] as const;

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400); // bake + deal settle
}

/** One reading per cell: sigma in px and in board units, plus the clearance terms. */
async function readAll(page: Page, boardSize: number) {
  return page.evaluate(
    ({ boardSize }) => {
      const SAMPLES = 32;
      const STROKE_UNITS = 7; // gameCell.css tier 2
      const r3 = (v: number) => Math.round(v * 1000) / 1000;

      const sigmaOf = (el: SVGGeometryElement, scale: number, l0: number, l1: number) => {
        const total = el.getTotalLength();
        const pts: [number, number][] = [];
        for (let i = 0; i <= SAMPLES; i++) {
          const p = el.getPointAtLength(total * (l0 + (l1 - l0) * (i / SAMPLES)));
          pts.push([p.x * scale, p.y * scale]);
        }
        const [ax, ay] = pts[0];
        const [bx, by] = pts[pts.length - 1];
        const dx = bx - ax;
        const dy = by - ay;
        const len = Math.hypot(dx, dy) || 1;
        let sum = 0;
        for (const [x, y] of pts) {
          const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
          sum += d * d;
        }
        return { sigmaPx: Math.sqrt(sum / pts.length), chordPx: len };
      };

      // ── the grid's own sigma at this size: every cell rule the board draws
      const gridEls = Array.from(
        document.querySelectorAll("path.cell-line"),
      ) as unknown as SVGGeometryElement[];
      const gridSigmas: number[] = [];
      let gridScale = 0;
      for (const el of gridEls) {
        const svg = el.ownerSVGElement!;
        const vb = svg.viewBox.baseVal;
        gridScale = svg.getBoundingClientRect().width / (vb.width || 1);
        gridSigmas.push(sigmaOf(el, gridScale, 0.03, 0.97).sigmaPx);
      }

      // ── every ring on the board
      const ringEls = Array.from(
        document.querySelectorAll(".cell-ghost-path"),
      ) as unknown as SVGGeometryElement[];
      const ringSigmasPx: number[] = [];
      const ringSigmasUnits: number[] = [];
      const headrooms: number[] = [];
      let crossing = 0;
      let ringScale = 0;
      let cellPx = 0;
      let marginPx = 0;
      const cellSize = 1000 / boardSize;
      for (let i = 0; i < ringEls.length; i++) {
        const el = ringEls[i];
        const svg = el.ownerSVGElement!;
        const vb = svg.viewBox.baseVal;
        const box = svg.getBoundingClientRect();
        ringScale = box.width / (vb.width || 1);
        cellPx = box.width;
        marginPx = (cellPx - cellSize * ringScale) / 2;
        const s = sigmaOf(el, ringScale, 0.02, 0.22);
        ringSigmasPx.push(s.sigmaPx);
        ringSigmasUnits.push(s.sigmaPx / ringScale);
        // clearance: the geometry bbox against the nominal cell rect, both in viewBox units
        const bb = el.getBBox();
        const nx = vb.x + cellSize * 0.15;
        const ny = vb.y + cellSize * 0.15;
        const exc = Math.max(
          nx - bb.x,
          bb.x + bb.width - (nx + cellSize),
          ny - bb.y,
          bb.y + bb.height - (ny + cellSize),
          0,
        );
        const inkReachPx = (exc + STROKE_UNITS / 2) * ringScale;
        headrooms.push(marginPx - inkReachPx);
        if (inkReachPx > marginPx) crossing++;
      }

      const stat = (a: number[]) => {
        if (!a.length) return { n: 0, mean: 0, min: 0, max: 0, cv: 0 };
        const mean = a.reduce((x, y) => x + y, 0) / a.length;
        const sd = Math.sqrt(a.reduce((x, y) => x + (y - mean) ** 2, 0) / a.length);
        return {
          n: a.length,
          mean: r3(mean),
          min: r3(Math.min(...a)),
          max: r3(Math.max(...a)),
          cv: r3(sd / (mean || 1)),
        };
      };

      return {
        boardSize,
        gridScale: r3(gridScale),
        ringScale: r3(ringScale),
        cellPx: r3(cellPx),
        marginPx: r3(marginPx),
        grid: stat(gridSigmas),
        ringPx: stat(ringSigmasPx),
        ringUnits: stat(ringSigmasUnits),
        clearance: {
          cellsCrossingOwnBox: crossing,
          cellsTotal: ringEls.length,
          headroomMinPx: r3(Math.min(...headrooms)),
          headroomMeanPx: r3(headrooms.reduce((a, b) => a + b, 0) / (headrooms.length || 1)),
        },
        ghostPathCount: ringEls.length,
      };
    },
    { boardSize },
  );
}

for (const [label, query, boardSize] of SIZES) {
  test(`G-ABS-1/2/MA-C at ${label} · 1280x800`, async ({ page, browserName }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await boardReady(page, query);
    const r = await readAll(page, boardSize);
    const ratio = Math.round((r.ringPx.mean / (r.grid.mean || 1)) * 1000) / 1000;
    const report = { engine: browserName, viewport: "1280x800", label, ...r, ringOverGrid: ratio };
    bank(`abs-wobble-${label}-${browserName}.json`, report);
    console.log("ABS-WOBBLE " + JSON.stringify(report));

    expect(r.grid.mean, "the grid must wander or the band is meaningless").toBeGreaterThan(0.3);
    expect(ratio, `ring/grid ${ratio} outside [0.5, 2.0] at ${label}`).toBeGreaterThanOrEqual(0.5);
    expect(ratio).toBeLessThanOrEqual(2.0);
    expect(r.ringUnits.mean, `sigma_units ${r.ringUnits.mean} off 1.75 by >5%`).toBeGreaterThan(1.6625);
    expect(r.ringUnits.mean).toBeLessThan(1.8375);
    expect(r.clearance.cellsCrossingOwnBox, "MA-C: no ring may leave its own cell").toBe(0);
  });

  test(`MA-C at ${label} · 393x699 (the phone)`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: 393, height: 699 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await boardReady(page, query);
    const r = await readAll(page, boardSize);
    const ratio = Math.round((r.ringPx.mean / (r.grid.mean || 1)) * 1000) / 1000;
    const report = { engine: browserName, viewport: "393x699", label, ...r, ringOverGrid: ratio };
    bank(`abs-wobble-phone-${label}-${browserName}.json`, report);
    console.log("ABS-WOBBLE-PHONE " + JSON.stringify(report));
    expect(r.clearance.cellsCrossingOwnBox, "MA-C on the phone").toBe(0);
  });
}
