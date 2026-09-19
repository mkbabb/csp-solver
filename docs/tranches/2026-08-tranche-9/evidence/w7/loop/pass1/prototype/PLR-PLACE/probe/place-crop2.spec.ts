/**
 * PLR-PLACE · the `your cell` row AT REST — the seventh crop's twin.
 *
 * The banked `your-cell-row-*.png` hovers the caption so the tape's sentence is in the frame,
 * and the tape covers the OptionSelector it explains: the control itself is not legible in it.
 * This shot takes the same row with no pointer on it, which is how a reader meets it.
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

test("the `your cell` row at rest", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const row = page
    .locator('.controls-card [role="group"]')
    .filter({ hasText: "your cell" })
    .first();
  await row.scrollIntoViewIfNeeded();
  await page.mouse.move(5, 895); // nothing hovered
  await page.waitForTimeout(400);
  const box = await row.boundingBox();
  console.log(`PLC|crop.yourCellRest|${JSON.stringify(box)}`);
  const opts = row.locator("button");
  console.log(`PLC|crop.options|${JSON.stringify(await opts.allInnerTexts())}`);
  await row.screenshot({
    path: join(FRAMES, `your-cell-rest-1280-${info.project.name}.png`),
  });
  await ctx.close();
});
