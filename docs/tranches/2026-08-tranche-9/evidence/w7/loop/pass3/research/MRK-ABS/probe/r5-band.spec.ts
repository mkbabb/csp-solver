/**
 * T9-W7 pass 3 · MRK-ABS RESEARCH · R5 — the ring's band against the rule it FACES, live.
 *
 * The one reading R1/R2 model offline, taken on the surface at 74a2b5d9 so the model is checked
 * rather than trusted. Three cells at 16x16, each facing a different rule kind:
 *   cell 0    (r0,c0) — its LEFT rule is the board FRAME at x = 12 board units, stroke 12
 *   cell 20   (r1,c4) — its LEFT rule is a SUBGRID line at x = 250, stroke 8
 *   cell 18   (r1,c2) — its LEFT rule is a CELL line at x = 125, stroke 5
 * For each: at every 0.5 px of shared y inside the cell, the ring's leftmost ink and the rule's
 * rightmost ink, and the gap. Negative = the two inks overlap.
 *
 * R4's `gapLeftPx` is STRUCK: its "left quintile" filter selected the TOP edge's second vertex
 * (board x 174.7) instead of the left side (x ~= 12). This form parses the frame's four sides
 * by their own coordinates.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/MRK-ABS/readings";

test("R5 · the band, three rule kinds", async ({ page }, info) => {
  const engine = info.project.name;
  await page.goto("http://127.0.0.1:4239/?size=4");
  await page.waitForSelector(".game-cell", { timeout: 30000 });
  await page.waitForTimeout(900);

  const read = async (idx: number) => {
    await page.evaluate((i) => {
      const inp = document.querySelectorAll<HTMLInputElement>(".game-cell .cell-native-input")[i];
      inp?.focus();
    }, idx);
    // a key press makes the modality keyboard so :focus-visible matches in both engines
    await page.keyboard.press("Shift");
    await page.waitForTimeout(350);
    return page.evaluate((i) => {
      const pts = (d: string) => {
        const a: number[][] = [];
        for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
          a.push([parseFloat(m[2]), parseFloat(m[3])]);
        return a;
      };
      const cell = document.querySelectorAll(".game-cell")[i] as HTMLElement;
      const ghostPath = cell.querySelector(".cell-ghost-path") as SVGPathElement;
      const grid = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement;
      const gm = ghostPath.getScreenCTM()!;
      const km = grid.getScreenCTM()!;
      const sw = parseFloat(getComputedStyle(ghostPath).strokeWidth);
      const ring = pts(ghostPath.getAttribute("d")!).map((p) => [
        gm.e + gm.a * p[0],
        gm.f + gm.d * p[1],
      ]);
      const ringHS = (sw * gm.a) / 2;

      const N = 16,
        cs = 1000 / N,
        c = i % N;
      let kind: string, nominalU: number;
      if (c === 0) {
        kind = "frame";
        nominalU = 12;
      } else if (c % 4 === 0) {
        kind = "subgrid";
        nominalU = c * cs;
      } else {
        kind = "cell";
        nominalU = c * cs;
      }
      // every pose of the facing rule, in screen coords, restricted to its LEFT-side geometry
      const sel = kind === "frame" ? "path.frame-line" : `path.${kind === "subgrid" ? "subgrid" : "cell"}-line`;
      const cands = [...grid.querySelectorAll(sel)] as SVGPathElement[];
      const ruleSW = cands[0] ? parseFloat(getComputedStyle(cands[0]).strokeWidth) : 0;
      const ruleHS = (ruleSW * km.a) / 2;
      const polys: number[][][] = [];
      for (const el of cands) {
        const P = pts(el.getAttribute("d")!).map((p) => [km.e + km.a * p[0], km.f + km.d * p[1]]);
        // keep the vertical run whose x sits within 6 board units of the nominal
        const xTarget = km.e + km.a * nominalU;
        const near = P.filter((p) => Math.abs(p[0] - xTarget) < km.a * 8);
        if (near.length >= 2) polys.push(near);
      }

      const cr = cell.getBoundingClientRect();
      const at = (poly: number[][], y: number) => {
        let best: number | null = null;
        for (let k = 0; k < poly.length - 1; k++) {
          const a = poly[k],
            b = poly[k + 1];
          if (a[1] === b[1]) continue;
          const t = (y - a[1]) / (b[1] - a[1]);
          if (t < 0 || t > 1) continue;
          const v = a[0] + (b[0] - a[0]) * t;
          if (best === null || v > best) best = v;
        }
        return best;
      };
      const atRing = (y: number) => {
        let best: number | null = null;
        for (let k = 0; k < ring.length; k++) {
          const a = ring[k],
            b = ring[(k + 1) % ring.length];
          if (a[1] === b[1]) continue;
          const t = (y - a[1]) / (b[1] - a[1]);
          if (t < 0 || t > 1) continue;
          const v = a[0] + (b[0] - a[0]) * t;
          if (best === null || v < best) best = v;
        }
        return best;
      };

      const gaps: number[] = [];
      for (let y = cr.top; y <= cr.bottom; y += 0.5) {
        const r = atRing(y);
        if (r === null) continue;
        let rule: number | null = null;
        for (const poly of polys) {
          const v = at(poly, y);
          if (v !== null && (rule === null || v > rule)) rule = v;
        }
        if (rule === null) continue;
        gaps.push(r - ringHS - (rule + ruleHS));
      }
      return {
        cell: i,
        kind,
        poses: polys.length,
        ringStrokePx: +(sw * gm.a).toFixed(3),
        ruleStrokePx: +(ruleSW * km.a).toFixed(3),
        n: gaps.length,
        worstPx: gaps.length ? +Math.min(...gaps).toFixed(3) : null,
        medianPx: gaps.length ? +[...gaps].sort((a, b) => a - b)[gaps.length >> 1].toFixed(3) : null,
        negPct: gaps.length ? +((100 * gaps.filter((v) => v < 0).length) / gaps.length).toFixed(1) : null,
      };
    }, idx);
  };

  const rows = [];
  for (const idx of [0, 20, 18]) rows.push(await read(idx));

  fs.writeFileSync(
    `${OUT}/r5-${engine}.json`,
    JSON.stringify({ engine, base: "74a2b5d9", board: "16x16 light 1280x800", rows }, null, 2),
  );
  expect(rows.length).toBe(3);
});
