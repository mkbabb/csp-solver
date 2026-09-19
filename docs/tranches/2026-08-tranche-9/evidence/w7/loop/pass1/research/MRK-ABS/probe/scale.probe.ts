/**
 * MRK-ABS pass-1 · THE SCALE PROBE — born to test the family's hidden premise.
 *
 * The family names an ABSOLUTE band in SCREEN PIXELS ([0.722, 2.886]px) and reaches it with a
 * roughness solved at GEOMETRY time, in the board's 1000-unit space. Between the two sits a
 * px-per-unit scale that the geometry never sees. If that scale is constant across board sizes
 * ONE k can exist; if it also changes with the viewport, the px law is a law at one viewport
 * only, and the compensation is a user-unit law wearing a px number.
 *
 * This measures, for 4×4 / 9×9 / 16×16 at 1280×800 and at 393×699 dpr3, both engines:
 *   - the board svg's own px-per-unit (it is what the grid rule's σ is scaled by)
 *   - the ghost svg's px-per-unit (viewBox = cell padded 15% each side, `useGameCell.ts:86-97`)
 *   - the cell's CSS box and the ring's drawn edge in px
 * and states, for each, what σ a target of 1.443px at the desktop rung would actually READ.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

const SIZES = [
  { label: "4x4", query: "?size=2&difficulty=EASY", n: 4 },
  { label: "9x9", query: "?size=3&difficulty=EASY", n: 9 },
  { label: "16x16", query: "?size=4&difficulty=EASY", n: 16 },
] as const;

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

async function measure(page: Page, n: number) {
  return page.evaluate((n) => {
    const r3 = (v: number) => Math.round(v * 10000) / 10000;
    const boardSvg = document.querySelector(
      'svg:has(path.cell-line)',
    ) as SVGSVGElement | null;
    const ghostSvg = document.querySelector(
      ".cell-ghost svg",
    ) as SVGSVGElement | null;
    const cell = document.querySelector(".game-cell") as HTMLElement | null;
    const boardBox = boardSvg?.getBoundingClientRect();
    const ghostBox = ghostSvg?.getBoundingClientRect();
    const cellBox = cell?.getBoundingClientRect();
    const bvb = boardSvg?.viewBox.baseVal;
    const gvb = ghostSvg?.viewBox.baseVal;
    const cellSizeUnits = 1000 / n;
    return {
      boardPx: r3(boardBox?.width ?? -1),
      boardVb: bvb ? r3(bvb.width) : -1,
      boardPxPerUnit: boardBox && bvb ? r3(boardBox.width / bvb.width) : -1,
      cellPx: r3(cellBox?.width ?? -1),
      ghostSvgPx: r3(ghostBox?.width ?? -1),
      ghostVb: gvb ? r3(gvb.width) : -1,
      ghostPxPerUnit: ghostBox && gvb ? r3(ghostBox.width / gvb.width) : -1,
      cellSizeUnits: r3(cellSizeUnits),
      ringEdgePx: ghostBox && gvb ? r3((cellSizeUnits / gvb.width) * ghostBox.width) : -1,
      ghostFilter: ghostSvg
        ? getComputedStyle(ghostSvg.querySelector("path")!).filter
        : "n/a",
      ghostPathNodes: document.querySelectorAll(".cell-ghost-path").length,
    };
  }, n);
}

for (const vp of [
  { name: "desktop", width: 1280, height: 800, dpr: 1 },
  { name: "phone", width: 393, height: 699, dpr: 3 },
] as const) {
  test(`MA-1 SCALE — px-per-unit at ${vp.name}`, async ({ browser, browserName }) => {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      hasTouch: vp.name === "phone",
      isMobile: vp.name === "phone",
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    const rows: Record<string, unknown>[] = [];
    for (const s of SIZES) {
      await boardReady(page, s.query);
      rows.push({ size: s.label, ...(await measure(page, s.n)) });
    }
    const out = { engine: browserName, viewport: vp, rows };
    writeFileSync(join(OUT, `scale-${vp.name}-${browserName}.json`), JSON.stringify(out, null, 2));
    console.log("SCALE " + JSON.stringify(out));
    await ctx.close();
  });
}
