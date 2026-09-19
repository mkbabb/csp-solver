/**
 * THE DEAL, on the REAL surface, on a family that PRINTS GIVENS (sudoku).
 *
 * The receipt test's production row drives the no-givens path. The sudoku re-deal reaches
 * NEITHER margin arm by construction (GameBoard.vue:826 fires on the first board only;
 * :841 returns early on any board that prints givens), so whatever stands on the strip
 * survives the deal. Invisible before the ledger, because the strip was almost always "".
 */
import { test } from "@playwright/test";
import { boardReady, armHint, armRefusal, ledger, bank } from "./lib";

test("DEAL — what survives a sudoku re-deal", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const rows: Record<string, unknown> = {};
  await armHint(page);
  rows.oneRecord = await ledger(page);
  await armRefusal(page);
  rows.twoRecords = await ledger(page);
  const sig = () =>
    page.evaluate(() =>
      Array.from(document.querySelectorAll(".board-cells input"))
        .map((i) => (i as HTMLInputElement).value || ".")
        .join(""),
    );
  rows.gridBefore = await sig();
  const deal = page.locator('.controls-card button:has-text("Deal")').first();
  await deal.click();
  await page.waitForTimeout(3000);
  rows.afterDeal = await ledger(page);
  rows.gridAfter = await sig();
  rows.gridChanged = rows.gridBefore !== rows.gridAfter;
  rows.givens = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll(".board-cells input")).filter(
        (i) => (i as HTMLInputElement).readOnly,
      ).length,
  );
  bank(`deal-${browserName}.json`, rows);
  console.log("DEAL", JSON.stringify(rows));
  await ctx.close();
});
