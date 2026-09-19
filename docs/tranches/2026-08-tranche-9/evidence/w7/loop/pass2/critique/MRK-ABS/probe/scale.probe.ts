/**
 * T9-W7 pass 2 · MRK-ABS CRITIQUE — the unit→px scale the clearance numbers rest on.
 * The prototype's identity log states "ghost px/unit 0.489231 measured = boardPx/1300 exactly".
 * generateCellRects is called with VIEWBOX_SIZE = 1000. This reads both svgs' viewBox and
 * their CSS boxes and divides.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const OUT = process.env.PROBE_OUT ?? ".";
mkdirSync(OUT, { recursive: true });

test("scale · ghost and grid unit→px", async ({ page, browserName }) => {
  test.setTimeout(180000);
  await page.goto("/?size=4&difficulty=EASY");
  await page.waitForSelector(".game-cell", { timeout: 60000 });
  await page.waitForFunction(() => document.querySelectorAll(".game-cell").length === 256, {
    timeout: 120000,
  });
  await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll(".game-cell"));
    for (let i = 0; i < cells.length; i++) {
      const r = Math.floor(i / 16),
        c = i % 16;
      if (r < 3 || r > 12 || c < 3 || c > 12) continue;
      const inp = cells[i].querySelector("input") as HTMLInputElement | null;
      if (!inp || inp.value || inp.readOnly || inp.disabled) continue;
      inp.focus();
      return i;
    }
    return -1;
  });
  await page.waitForTimeout(600);
  const facts = await page.evaluate(() => {
    const cell = document
      .querySelector("input:focus")!
      .closest(".game-cell") as HTMLElement;
    const cr = cell.getBoundingClientRect();
    const svg = cell.querySelector(".cell-ghost svg") as SVGSVGElement;
    const sr = svg.getBoundingClientRect();
    const vb = (svg.getAttribute("viewBox") ?? "").split(/\s+/).map(Number);
    const path = cell.querySelector(".cell-ghost-path") as SVGPathElement;
    const pr = path.getBoundingClientRect();
    const bbox = path.getBBox();
    // the grid's own svg
    const gridSvgs = Array.from(document.querySelectorAll("svg")).filter((s) => {
      const v = s.getAttribute("viewBox") ?? "";
      return v.trim().startsWith("0 0") && s.closest(".board-wrapper, .game-board");
    });
    const g = gridSvgs[0] as SVGSVGElement | undefined;
    const gr = g?.getBoundingClientRect();
    const board = document.querySelector(".board-wrapper, .game-board") as HTMLElement | null;
    const br = board?.getBoundingClientRect();
    const gridPath = document.querySelector(
      ".grid-line-path, .grid-lines path, .board-lines path",
    ) as SVGPathElement | null;
    return {
      cell: { x: cr.x, y: cr.y, w: cr.width, h: cr.height },
      ghostSvg: { x: sr.x, y: sr.y, w: sr.width, h: sr.height, viewBox: vb },
      ghostPathRect: { x: pr.x, y: pr.y, w: pr.width, h: pr.height },
      ghostPathBBox: { x: bbox.x, y: bbox.y, w: bbox.width, h: bbox.height },
      ghostStrokeWidth: getComputedStyle(path).strokeWidth,
      gridSvg: g
        ? { viewBox: g.getAttribute("viewBox"), w: gr!.width, h: gr!.height, cls: g.getAttribute("class") }
        : null,
      gridSvgCount: gridSvgs.length,
      boardRect: br ? { w: br.width, h: br.height } : null,
      gridPathStroke: gridPath ? getComputedStyle(gridPath).strokeWidth : null,
      gridPathCls: gridPath ? gridPath.getAttribute("class") : null,
      allSvgViewBoxes: Array.from(document.querySelectorAll(".board-wrapper svg, .game-board svg"))
        .slice(0, 8)
        .map((s) => ({
          vb: s.getAttribute("viewBox"),
          cls: (s.getAttribute("class") ?? "").slice(0, 40),
          w: Math.round(s.getBoundingClientRect().width * 100) / 100,
        })),
    };
  });
  const vb = facts.ghostSvg.viewBox;
  const ghostPxPerUnit = facts.ghostSvg.w / vb[2];
  const out = {
    engine: browserName,
    ...facts,
    derived: {
      cellPx: facts.cell.w,
      ghostPxPerUnit,
      cellUnits1000: 1000 / 16,
      cellPxIf1000Space: (1000 / 16) * ghostPxPerUnit,
      note: "cellPxIf1000Space should equal cellPx when the ghost draws in a 1000-unit board",
      protoClaim: 0.489231,
    },
  };
  writeFileSync(join(OUT, `crit-scale-${browserName}.json`), JSON.stringify(out, null, 2));
  expect(true).toBe(true);
});
