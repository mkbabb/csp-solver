/**
 * T9-W7 round zero · lane R3 (THE MARKS) — THE WOBBLE PROBE, born RED.
 *
 * The census claim (formation registry F18/A3, 2026-08-10): "the selection ring/peer wash have
 * ZERO wobble (σ 0.00px) on a grid whose lines wander σ 2.5px". This instrument re-derives BOTH
 * numbers on THIS tree instead of citing that one, and states the law a cure must satisfy.
 *
 * HOW A σ IS TAKEN. For a rendered SVG geometry element, walk `getPointAtLength` over an edge in
 * USER units, scale by that element's own `ownerSVGElement` px-per-user-unit (clientWidth ÷
 * viewBox width — every subject here is `xMidYMid meet` on a square box, so one scalar is
 * exact), fit the chord between the first and last sample, and take the RMS perpendicular
 * residual. That is "how far off a ruler this edge is", which is what the eye reads as wobble.
 * The scale is taken off the SVG rather than `getScreenCTM()` because the grid's live pose stack
 * is `display: none` once the bake lands (`.baked-hidden`) and a null CTM would read as zero
 * wobble — the exact false negative this probe exists to refuse. ≥8 samples per edge is the
 * floor; this walks 33.
 *
 * FOUR SUBJECTS, one board box (all four live in the same 1000-unit space, so the px readings
 * are directly comparable):
 *   - GRID   `path.cell-line` — a thin cell rule (`boilLineFrames`, roughness 0.4, segments 4)
 *   - FRAME  `path.frame-line` — the board's outer ring (roughness 0.5, segments 6)
 *   - RING   `.cell-ghost-path` on the KEYBOARD-FOCUSED cell — the selection ring (tier 2)
 *   - WASH   `.cell-peer` — an HTML box; a CSS rect edge has no geometry to sample
 *
 * THE LAW a cure must make true: the most-watched marker may not be the only CAD-precise mark on
 * a hand-drawn board. BOTH halves of the selection system — the ring AND the peer wash — wander
 * inside the grid's own band, taken as [0.5 × gridSigma, 2.0 × gridSigma]. The floor is the
 * claim; the ceiling stops a cure answering "wobble" with noise.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = process.env.OUT_DIR as string;
mkdirSync(OUT, { recursive: true });

type Reading = {
  sel: string;
  found: number;
  sigmaPx: number;
  maxDevPx: number;
  chordPx: number;
  scale: number;
  samples: number;
  d0?: string;
};

async function edgeSigma(
  page: Page,
  sel: string,
  index: number,
  l0: number,
  l1: number,
  samples = 32,
): Promise<Reading> {
  return page.evaluate(
    ({ sel, index, l0, l1, samples }) => {
      const els = Array.from(
        document.querySelectorAll(sel),
      ) as unknown as SVGGeometryElement[];
      const el = els[index];
      if (!el)
        return { sel, found: els.length, sigmaPx: -1, maxDevPx: -1, chordPx: -1, scale: -1, samples: 0 };
      const svg = el.ownerSVGElement!;
      const vb = svg.viewBox.baseVal;
      const scale = svg.getBoundingClientRect().width / (vb.width || 1);
      const total = el.getTotalLength();
      const pts: [number, number][] = [];
      for (let i = 0; i <= samples; i++) {
        const p = el.getPointAtLength(total * (l0 + (l1 - l0) * (i / samples)));
        pts.push([p.x * scale, p.y * scale]);
      }
      const [ax, ay] = pts[0];
      const [bx, by] = pts[pts.length - 1];
      const dx = bx - ax;
      const dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      let sum = 0;
      let max = 0;
      for (const [x, y] of pts) {
        const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
        sum += d * d;
        if (d > max) max = d;
      }
      const r3 = (v: number) => Math.round(v * 1000) / 1000;
      return {
        sel,
        found: els.length,
        sigmaPx: r3(Math.sqrt(sum / pts.length)),
        maxDevPx: r3(max),
        chordPx: r3(len),
        scale: r3(scale),
        samples: pts.length,
        d0: (el.getAttribute("d") || "").slice(0, 110),
      };
    },
    { sel, index, l0, l1, samples },
  );
}

async function boardReady(page: Page, query = "?game=sudoku&board=ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200); // bake + deal settle
}

test("R3-a THE WOBBLE PROBE — the selection ring wanders in the grid's own band", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);

  // Keyboard focus so :focus-visible arms tier 2 — the crayon-blue selection ring.
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input"));
    (inputs[40] as HTMLInputElement)?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);

  const armed = await page.evaluate(() => ({
    ringNodes: document.querySelectorAll(
      ".game-cell:has(input:focus-visible) .cell-ghost-path",
    ).length,
    peerNodes: document.querySelectorAll(".cell-peer").length,
    activeGhosts: document.querySelectorAll(".cell-ghost.is-active").length,
  }));

  const grid = await edgeSigma(page, "path.cell-line", 3, 0.03, 0.97);
  const frame = await edgeSigma(page, "path.frame-line", 0, 0.02, 0.22);
  const ring = await edgeSigma(
    page,
    ".game-cell:has(input:focus-visible) .cell-ghost-path",
    0,
    0.02,
    0.22,
  );

  const wash = await page.evaluate(() => {
    const el = document.querySelector(".cell-peer");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      widthPx: Math.round(r.width * 100) / 100,
      heightPx: Math.round(r.height * 100) / 100,
      background: cs.backgroundColor,
      borderRadius: cs.borderRadius,
      sigmaPx: 0, // a CSS box edge: perpendicular residual is 0 by construction
    };
  });

  const band = {
    gridSigmaPx: grid.sigmaPx,
    floorPx: Math.round(grid.sigmaPx * 0.5 * 1000) / 1000,
    ceilingPx: Math.round(grid.sigmaPx * 2.0 * 1000) / 1000,
  };
  const report = {
    engine: browserName,
    at: new Date().toISOString(),
    armed,
    subjects: { grid, frame, ring, wash },
    band,
    verdicts: {
      ringInBand: ring.sigmaPx >= band.floorPx && ring.sigmaPx <= band.ceilingPx,
      washInBand: (wash?.sigmaPx ?? 0) >= band.floorPx,
    },
  };
  writeFileSync(join(OUT, `wobble-${browserName}.json`), JSON.stringify(report, null, 2));
  console.log("WOBBLE " + JSON.stringify(report));

  expect(
    grid.sigmaPx,
    "the grid's own wander must be non-zero or the band is meaningless",
  ).toBeGreaterThan(0.3);
  expect(
    ring.sigmaPx,
    `selection ring σ ${ring.sigmaPx}px outside the grid's band [${band.floorPx}, ${band.ceilingPx}]px`,
  ).toBeGreaterThanOrEqual(band.floorPx);
  expect(ring.sigmaPx).toBeLessThanOrEqual(band.ceilingPx);
  expect(
    wash?.sigmaPx ?? 0,
    `the peer wash is a CSS box (σ 0.00px) on a board whose rules wander σ ${grid.sigmaPx}px`,
  ).toBeGreaterThanOrEqual(band.floorPx);
});

/**
 * THE LENGTH LAW, stated as a second reading. `wobbleLinePoints`' amplitude is
 * `roughness × len × 0.015` (pencil-boil path.js), so a mark's wander is proportional to ITS OWN
 * EDGE. A 4×4 board has the longest cell edge in the product and a 16×16 the shortest; if the
 * law is the mechanism, the ring's σ tracks the board size and the grid's does not.
 */
for (const [label, query, expectCells] of [
  ["4x4", "?size=2&difficulty=EASY", 16],
  ["16x16", "?size=4&difficulty=EASY", 256],
] as const) {
  test(`R3-a2 THE LENGTH LAW — ring vs grid at ${label}`, async ({ page, browserName }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await boardReady(page, query);
    const cells = await page.locator(".game-cell").count();
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
      inputs[Math.floor(inputs.length / 2)]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);
    const grid = await edgeSigma(page, "path.cell-line", 1, 0.03, 0.97);
    const ring = await edgeSigma(
      page,
      ".game-cell:has(input:focus-visible) .cell-ghost-path",
      0,
      0.02,
      0.22,
    );
    const out = { engine: browserName, label, cells, expectCells, grid, ring, ratio: grid.sigmaPx && ring.sigmaPx ? Math.round((grid.sigmaPx / ring.sigmaPx) * 100) / 100 : null };
    writeFileSync(join(OUT, `wobble-${label}-${browserName}.json`), JSON.stringify(out, null, 2));
    console.log("LENGTHLAW " + JSON.stringify(out));
    expect(cells).toBe(expectCells);
  });
}
