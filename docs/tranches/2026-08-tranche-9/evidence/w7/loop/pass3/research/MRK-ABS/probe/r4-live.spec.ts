/**
 * T9-W7 pass 3 · MRK-ABS RESEARCH · R4 — the LIVE confirmation, both engines.
 *
 * Read-only on the product. Three questions the offline model (R1/R2) cannot answer alone:
 *   Q1  the px/unit conversion every clearance number rests on (boardPx and the ghost viewBox),
 *       re-derived on the surface at 4x4 / 9x9 / 16x16 rather than restated from pass 2.
 *   Q2  does the focused ring's PAINTED band actually land on the frame's band on a corner
 *       cell? Measured from the DOM's own `d` + `stroke-width` + the element's screen CTM —
 *       geometry, not a screenshot, so it is exact and engine-comparable.
 *   Q3  the painted-byte reading of ring-vs-rule ink in LIGHT and in DARK (the two passes
 *       disagree on which theme is the near-merge: the spec said dark, the prototype's bytes
 *       said light, the token arithmetic (R3) says dark).
 *
 * Server: the lane's own on 127.0.0.1:4239 serving MAIN at 74a2b5d9.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/MRK-ABS/readings";

const bank = (name: string, data: unknown) =>
  fs.writeFileSync(`${OUT}/${name}`, JSON.stringify(data, null, 2));

async function settle(page: import("@playwright/test").Page) {
  await page.waitForSelector(".game-cell", { timeout: 30000 });
  await page.waitForTimeout(900);
}

test("R4 · scale + corner-cell band + painted ink", async ({ page }, info) => {
  const engine = info.project.name;
  const out: Record<string, unknown> = { engine, base: "74a2b5d9", port: 4239 };

  // ── Q1 · the scale, three boards ───────────────────────────────────────────
  const scales: unknown[] = [];
  for (const [size, N] of [
    [2, 4],
    [3, 9],
    [4, 16],
  ] as const) {
    await page.goto(`http://127.0.0.1:4239/?size=${size}`);
    await settle(page);
    scales.push(
      await page.evaluate((n) => {
        const grid = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
        const cell = document.querySelector(".game-cell") as HTMLElement;
        const ghost = cell?.querySelector(".cell-ghost svg") as SVGSVGElement | null;
        const cr = cell?.getBoundingClientRect();
        const gr = grid?.getBoundingClientRect();
        return {
          N: n,
          cells: document.querySelectorAll(".game-cell").length,
          boardPx: gr ? +gr.width.toFixed(3) : null,
          cellPx: cr ? +cr.width.toFixed(3) : null,
          ghostViewBox: ghost?.getAttribute("viewBox") ?? null,
          ghostPx: ghost ? +ghost.getBoundingClientRect().width.toFixed(3) : null,
          dpr: window.devicePixelRatio,
        };
      }, N),
    );
  }
  out.scale = scales;

  // ── Q2 · the corner cell's ring band vs the frame's band, 16x16 ────────────
  await page.goto("http://127.0.0.1:4239/?size=4");
  await settle(page);
  // keyboard focus so :focus-visible matches (tier 2)
  const first = page.locator(".game-cell .cell-native-input").first();
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(400);

  out.bands = await page.evaluate(() => {
    const pts = (d: string) => {
      const a: number[][] = [];
      for (const m of d.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
        a.push([parseFloat(m[2]), parseFloat(m[3])]);
      return a;
    };
    const toScreen = (el: SVGGraphicsElement, p: number[]) => {
      const svg = el.ownerSVGElement!;
      const m = el.getScreenCTM()!;
      const q = svg.createSVGPoint();
      q.x = p[0];
      q.y = p[1];
      const r = q.matrixTransform(m);
      return [r.x, r.y];
    };
    const scaleOf = (el: SVGGraphicsElement) => el.getScreenCTM()!.a;

    // INSTRUMENT LAW (this lane's finding): the app keeps EVERY game's model mounted, so a bare
    // `document.querySelector("path.frame-line")` can return another board's frame. Scope both
    // queries to the focused cell's OWN `.board-shell`.
    const focused = document.querySelector(
      ".game-cell:has(input:focus-visible) .cell-ghost-path",
    ) as SVGPathElement | null;
    const shell = focused?.closest(".board-shell") as HTMLElement | null;
    const grid = shell?.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
    const frame = grid?.querySelector("path.frame-line") as SVGPathElement | null;
    const cellLines = [...(grid?.querySelectorAll("path.cell-line") ?? [])] as SVGPathElement[];
    const subLines = [...(grid?.querySelectorAll("path.subgrid-line") ?? [])] as SVGPathElement[];
    const boardRoots = document.querySelectorAll("svg.hand-drawn-grid").length;
    if (!focused || !frame) return { error: "no focused ring or frame", boardRoots };

    const cs = getComputedStyle(focused);
    const ringSW = parseFloat(cs.strokeWidth);
    const ringScale = scaleOf(focused);
    const ringPts = pts(focused.getAttribute("d")!).map((p) => toScreen(focused, p));
    const ringLeft = Math.min(...ringPts.map((p) => p[0])) - (ringSW * ringScale) / 2;
    const ringTop = Math.min(...ringPts.map((p) => p[1])) - (ringSW * ringScale) / 2;

    const fcs = getComputedStyle(frame);
    const frameSW = parseFloat(fcs.strokeWidth);
    const fScale = scaleOf(frame);
    const fPts = pts(frame.getAttribute("d")!).map((p) => toScreen(frame, p));
    // the frame's LEFT side = every point in the left quintile; its INNER ink edge is the
    // largest x among them plus half its stroke.
    const xs = fPts.map((p) => p[0]);
    const xMin = Math.min(...xs),
      xMax = Math.max(...xs);
    const leftSide = fPts.filter((p) => p[0] < xMin + (xMax - xMin) * 0.2);
    const frameLeftInner = Math.max(...leftSide.map((p) => p[0])) + (frameSW * fScale) / 2;
    const ys = fPts.map((p) => p[1]);
    const yMin = Math.min(...ys),
      yMax = Math.max(...ys);
    const topSide = fPts.filter((p) => p[1] < yMin + (yMax - yMin) * 0.2);
    const frameTopInner = Math.max(...topSide.map((p) => p[1])) + (frameSW * fScale) / 2;

    const lineSW = cellLines[0] ? parseFloat(getComputedStyle(cellLines[0]).strokeWidth) : null;
    const subSW = subLines[0] ? parseFloat(getComputedStyle(subLines[0]).strokeWidth) : null;

    return {
      ringStrokeUserUnits: ringSW,
      ringScreenScale: +ringScale.toFixed(6),
      ringStrokePx: +(ringSW * ringScale).toFixed(3),
      ringLeftInkX: +ringLeft.toFixed(3),
      ringTopInkY: +ringTop.toFixed(3),
      frameStrokeUserUnits: frameSW,
      frameScreenScale: +fScale.toFixed(6),
      frameLeftInnerInkX: +frameLeftInner.toFixed(3),
      frameTopInnerInkY: +frameTopInner.toFixed(3),
      gapLeftPx: +(ringLeft - frameLeftInner).toFixed(3),
      gapTopPx: +(ringTop - frameTopInner).toFixed(3),
      boardRoots,
      focusedCellIndex: focused
        ? [...(shell?.querySelectorAll(".game-cell") ?? [])].indexOf(
            focused.closest(".game-cell") as Element,
          )
        : null,
      cellLineStrokeUserUnits: lineSW,
      subgridLineStrokeUserUnits: subSW,
      nCellLines: cellLines.length,
      nSubgridLines: subLines.length,
      ringComputed: {
        stroke: cs.stroke,
        strokeOpacity: cs.strokeOpacity,
        fillOpacity: cs.fillOpacity,
        filter: cs.filter,
      },
      focusSketchToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-focus-sketch")
        .trim(),
      crayonBlueToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-crayon-blue")
        .trim(),
    };
  });

  out.geometry = await page.evaluate(() => {
    const rr = (e: Element | null) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    };
    const grid = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement;
    const frame = grid.querySelector("path.frame-line") as SVGPathElement;
    const m = frame.getScreenCTM()!;
    const cell0 = document.querySelectorAll(".game-cell")[0];
    const ghost = cell0?.querySelector(".cell-ghost svg") as SVGSVGElement | null;
    const gpath = ghost?.querySelector(".cell-ghost-path") as SVGPathElement | null;
    const gm = gpath?.getScreenCTM();
    return {
      grid: rr(grid),
      boardCells: rr(document.querySelector(".board-cells")),
      boardWrapper: rr(document.querySelector(".board-wrapper")),
      cell0: rr(cell0),
      ghostSvg: rr(ghost),
      gridViewBox: grid.getAttribute("viewBox"),
      gridPAR: grid.getAttribute("preserveAspectRatio"),
      frameCTM: { a: +m.a.toFixed(6), e: +m.e.toFixed(3), f: +m.f.toFixed(3) },
      ghostCTM: gm ? { a: +gm.a.toFixed(6), e: +gm.e.toFixed(3), f: +gm.f.toFixed(3) } : null,
      ghostViewBox: ghost?.getAttribute("viewBox") ?? null,
      frameDHead: frame.getAttribute("d")!.slice(0, 60),
      ghostDHead: gpath?.getAttribute("d")!.slice(0, 60) ?? null,
    };
  });

  // ── Q3 · the same read in DARK (token resolution: does the ring change ink?) ─
  await page.evaluate(() => document.documentElement.classList.add("dark"));
  await page.waitForTimeout(600);
  out.darkTokens = await page.evaluate(() => {
    const focused = document.querySelector(
      ".game-cell:has(input:focus-visible) .cell-ghost-path",
    ) as SVGPathElement | null;
    const line = document.querySelector("path.cell-line") as SVGPathElement | null;
    const root = getComputedStyle(document.documentElement);
    return {
      ringStroke: focused ? getComputedStyle(focused).stroke : null,
      ruleStroke: line ? getComputedStyle(line).stroke : null,
      focusSketch: root.getPropertyValue("--color-focus-sketch").trim(),
      crayonBlue: root.getPropertyValue("--color-crayon-blue").trim(),
      gridLine: root.getPropertyValue("--grid-line-color").trim(),
    };
  });
  await page.evaluate(() => document.documentElement.classList.remove("dark"));
  await page.waitForTimeout(400);
  out.lightTokens = await page.evaluate(() => {
    const focused = document.querySelector(
      ".game-cell:has(input:focus-visible) .cell-ghost-path",
    ) as SVGPathElement | null;
    const line = document.querySelector("path.cell-line") as SVGPathElement | null;
    return {
      ringStroke: focused ? getComputedStyle(focused).stroke : null,
      ruleStroke: line ? getComputedStyle(line).stroke : null,
    };
  });

  // ── the live filter census, this engine (pass 2 read chromium only) ─────────
  out.filterCensus = await page.evaluate(() => {
    const rows: Record<string, number> = {};
    let total = 0;
    for (const el of document.querySelectorAll("*")) {
      const s = getComputedStyle(el as Element);
      if (s.filter && s.filter !== "none" && s.display !== "none") {
        total++;
        const k = `${el.tagName.toLowerCase()}.${(el as Element).className && typeof (el as Element).className === "string" ? ((el as Element).className as string).split(" ")[0] : ""}`;
        rows[k] = (rows[k] ?? 0) + 1;
      }
    }
    return { total, rows };
  });

  bank(`r4-${engine}.json`, out);
  expect(out.scale).toBeTruthy();
});
