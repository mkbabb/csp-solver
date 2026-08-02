/** L6-G5 — the apotheosis's §6/§9 expectations, re-measured on the sealed dist at the cell
 *  they name (390x664). Sheet top, interior scroll, board rect across the gesture, and the
 *  GRID LEFT VISIBLE above the sheet — the quantity §9 risk 1 prices as "~52 px". */
import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4237";
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch(); const ctx = await b.newContext(COARSE); const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
  await page.waitForTimeout(800);
  const rect = () => page.evaluate(() => {
    const r = document.querySelector(".board-cells").getBoundingClientRect();
    const w = document.querySelector(".board-wrapper").getBoundingClientRect();
    return { cells: { x:+r.x.toFixed(2), y:+r.y.toFixed(2), w:+r.width.toFixed(2), h:+r.height.toFixed(2) },
             wrapper: { x:+w.x.toFixed(2), y:+w.y.toFixed(2), w:+w.width.toFixed(2), h:+w.height.toFixed(2) } };
  });
  const before = await rect();
  await page.locator(".drawer-tab").tap();
  await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
  await page.waitForTimeout(800);
  const open = await page.evaluate(() => {
    const c = document.querySelector("#controls-drawer .drawer-case");
    const r = c.getBoundingClientRect();
    const cells = document.querySelector(".board-cells").getBoundingClientRect();
    const masthead = document.querySelector(".site-masthead, header")?.getBoundingClientRect();
    return {
      sheetTop: +r.top.toFixed(2), sheetHeight: +r.height.toFixed(2),
      interiorScroll: c.scrollHeight - c.clientHeight,
      gridTop: +cells.top.toFixed(2), gridBottom: +cells.bottom.toFixed(2),
      gridVisibleAboveSheet: +Math.max(0, Math.min(cells.bottom, r.top) - cells.top).toFixed(2),
      gridFractionVisible: +(Math.max(0, Math.min(cells.bottom, r.top) - cells.top) / cells.height).toFixed(3),
      mastheadBottom: masthead ? +masthead.bottom.toFixed(2) : null,
    };
  });
  const during = await rect();
  await page.locator(".drawer-tab").tap();
  await page.waitForTimeout(800);
  const after = await rect();
  const same = JSON.stringify(before) === JSON.stringify(during) && JSON.stringify(during) === JSON.stringify(after);
  console.log(`${label}: sheetTop=${open.sheetTop} sheetH=${open.sheetHeight} interiorScroll=${open.interiorScroll}`);
  console.log(`   grid top=${open.gridTop} bottom=${open.gridBottom} VISIBLE ABOVE SHEET=${open.gridVisibleAboveSheet} (${(open.gridFractionVisible*100).toFixed(1)}% of the grid)`);
  console.log(`   board .board-cells rect before/open/after identical: ${same}  -> ${JSON.stringify(before.cells)}`);
  await b.close();
}
