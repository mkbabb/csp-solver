/**
 * PLR-PLACE · the seventh crop — the `your cell` option row in the players well, desk rail.
 * Read-only; it only presses the sharing verb so the well is in the state a reader meets it in.
 */
import { test, expect, type Page } from "@playwright/test";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE/frames";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("the `your cell` row", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const row = page
    .locator('.controls-card [role="group"]')
    .filter({ hasText: "your cell" })
    .first();
  await row.scrollIntoViewIfNeeded();
  // the tape reveals on hover of its caption — the shot carries the sentence it explains
  await row.locator(".zone-row-label").hover();
  await page.waitForTimeout(500);
  const well = page.locator(".controls-card .tray-well").filter({ hasText: "your cell" }).first();
  await well.screenshot({ path: join(FRAMES, `your-cell-row-1280-${info.project.name}.png`) });
  console.log(
    `PLC|crop.yourCell|${JSON.stringify(await row.boundingBox())}`,
  );
  await ctx.close();
});
