/**
 * substrate.probe.ts — ACC-GRAPHITE pass 1, step 0.
 *
 * Verify the family's substrate on THIS tree before designing anything on it. No
 * assertions here that the charter did not already state as facts to check: this
 * writes the numbers the record cites.
 *
 * READ-ONLY on the product. Writes JSON under this lane's evidence dir only.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(700);
}

test("substrate — the graphite estate, measured", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);

  const geom = await page.evaluate(() => {
    const svg = document.querySelector<SVGSVGElement>("svg.hand-drawn-grid");
    const box = svg?.getBoundingClientRect();
    const vb = svg?.getAttribute("viewBox");
    const vbSize = vb ? parseFloat(vb.split(/\s+/)[2]) : 0;
    const scale = box && vbSize ? box.width / vbSize : 0;

    // every distinct .grid-line spec on the board
    const lines = Array.from(document.querySelectorAll<SVGPathElement>(".grid-line")).map((p) => {
      const cs = getComputedStyle(p);
      return {
        cls: p.getAttribute("class") ?? "",
        strokeWidth: cs.strokeWidth,
        strokeOpacity: cs.strokeOpacity,
        stroke: cs.stroke,
      };
    });
    const uniq = new Map<string, { spec: unknown; n: number }>();
    for (const l of lines) {
      const k = JSON.stringify(l);
      const e = uniq.get(k);
      if (e) e.n++;
      else uniq.set(k, { spec: l, n: 1 });
    }

    // the ghost path (tier 1, unfocused)
    const ghost = document.querySelector<SVGPathElement>(".cell-ghost-path");
    const gcs = ghost ? getComputedStyle(ghost) : null;
    const gsvg = ghost?.ownerSVGElement;
    const gvb = gsvg?.getAttribute("viewBox");
    const gvbSize = gvb ? parseFloat(gvb.split(/\s+/)[2]) : 0;
    const gbox = gsvg?.getBoundingClientRect();

    return {
      boardBox: box ? { x: box.x, y: box.y, w: box.width, h: box.height } : null,
      viewBox: vb,
      vbSize,
      scale,
      gridLineSpecs: Array.from(uniq.values()),
      ghost: gcs
        ? {
            strokeWidth: gcs.strokeWidth,
            strokeOpacity: gcs.strokeOpacity,
            stroke: gcs.stroke,
            fill: gcs.fill,
            fillOpacity: gcs.fillOpacity,
            cellViewBox: gvb,
            cellVbSize: gvbSize,
            cellBoxW: gbox?.width ?? 0,
            cellScale: gbox && gvbSize ? gbox.width / gvbSize : 0,
          }
        : null,
    };
  });

  // focus a cell: the tier-2 ring's own spec
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);

  const ring = await page.evaluate(() => {
    const host = document.querySelector(".game-cell:has(input:focus-visible)");
    const p = host?.querySelector<SVGPathElement>(".cell-ghost-path");
    if (!p) return null;
    const cs = getComputedStyle(p);
    const svg = p.ownerSVGElement!;
    const vb = svg.getAttribute("viewBox")!;
    const size = parseFloat(vb.split(/\s+/)[2]);
    const b = svg.getBoundingClientRect();
    const cellBox = (host as HTMLElement).getBoundingClientRect();
    return {
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
      strokeOpacity: cs.strokeOpacity,
      fill: cs.fill,
      fillOpacity: cs.fillOpacity,
      strokeDasharray: cs.strokeDasharray,
      viewBox: vb,
      vbSize: size,
      svgBox: { x: b.x, y: b.y, w: b.width, h: b.height },
      cellBox: { x: cellBox.x, y: cellBox.y, w: cellBox.width, h: cellBox.height },
      cssPxPerUnit: b.width / size,
      d: p.getAttribute("d")?.slice(0, 80) ?? "",
    };
  });

  // the unit wash
  const wash = await page.evaluate(() => {
    const el = document.querySelector(".game-cell .cell-peer");
    return el ? getComputedStyle(el).backgroundColor : null;
  });

  // write a few digits -> the fill trace exists
  for (let i = 0; i < 12; i++) {
    await page.keyboard.type("1");
    await page.keyboard.press("ArrowRight");
  }
  await page.waitForTimeout(800);

  const trace = await page.evaluate(() => {
    const p = document.querySelector<SVGPathElement>(".progress-trace");
    if (!p) return null;
    const cs = getComputedStyle(p);
    const svg = p.ownerSVGElement!;
    const vb = svg.getAttribute("viewBox")!;
    const size = parseFloat(vb.split(/\s+/)[2]);
    const b = svg.getBoundingClientRect();
    const bb = p.getBoundingClientRect();
    const a11y = document.querySelector('[role="progressbar"]');
    const poses = document.querySelectorAll(".progress-pose").length;
    return {
      stroke: cs.stroke,
      strokeWidth: cs.strokeWidth,
      strokeOpacity: cs.strokeOpacity,
      poses,
      cssPxPerUnit: b.width / size,
      renderedStrokeCssPx: parseFloat(cs.strokeWidth) * (b.width / size),
      svgBox: { x: b.x, y: b.y, w: b.width, h: b.height },
      traceBox: { x: bb.x, y: bb.y, w: bb.width, h: bb.height },
      valuenow: a11y?.getAttribute("aria-valuenow"),
      valuetext: a11y?.getAttribute("aria-valuetext"),
      label: a11y?.getAttribute("aria-label"),
    };
  });

  // the given (clue) vs the entry: how the visible layer tells them apart TODAY
  const authorship = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell"));
    const pick = (readonly: boolean) =>
      cells.find((c) => {
        const inp = c.querySelector<HTMLInputElement>("input");
        const g = c.querySelector<SVGPathElement>(".glyph-svg path");
        return !!inp && inp.readOnly === readonly && !!g && !!inp.value;
      });
    const read = (c: HTMLElement | undefined) => {
      if (!c) return null;
      const inp = c.querySelector<HTMLInputElement>("input")!;
      const svg = c.querySelector<SVGSVGElement>(".glyph-svg")!;
      const path = svg.querySelector<SVGPathElement>("path")!;
      const cs = getComputedStyle(path);
      const vb = svg.getAttribute("viewBox");
      const b = svg.getBoundingClientRect();
      const size = vb ? parseFloat(vb.split(/\s+/)[2]) : 0;
      return {
        value: inp.value,
        readOnly: inp.readOnly,
        ariaLabel: inp.getAttribute("aria-label"),
        stroke: cs.stroke,
        strokeAttr: path.getAttribute("stroke"),
        strokeWidth: cs.strokeWidth,
        strokeWidthAttr: path.getAttribute("stroke-width"),
        strokeOpacity: cs.strokeOpacity,
        filter: cs.filter,
        viewBox: vb,
        cssPxPerUnit: size ? b.width / size : 0,
        renderedStrokeCssPx: size ? parseFloat(cs.strokeWidth) * (b.width / size) : 0,
        svgClass: svg.getAttribute("class"),
      };
    };
    return { given: read(pick(true)), entry: read(pick(false)) };
  });

  const out = { engine: browserName, geom, ring, wash, trace, authorship };
  writeFileSync(join(OUT, `substrate-${browserName}.json`), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
});
