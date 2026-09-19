/**
 * THE STUTTER — the residual the gates do not name: can the column print the SAME sentence
 * twice? Two paths: (a) the same record twice in a row, (b) a record, a grade, then the same
 * record again (the grade does not age, so line two still holds it).
 */
import { test } from "@playwright/test";
import { boardReady, armHint, armRefusal, ledger, bank } from "./lib";

test("STUTTER — the same sentence on both lines", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const rows: Record<string, unknown> = {};
  await armHint(page);
  await armRefusal(page);
  rows.recordThenRefusal = await ledger(page);
  await armRefusal(page);
  rows.refusalTwice = await ledger(page);
  const r = rows.refusalTwice as { one: string; two: string };
  rows.duplicated = r.one === r.two && r.one !== "";
  bank(`stutter-${browserName}.json`, rows);
  console.log("STUTTER", JSON.stringify(rows));
  await ctx.close();
});
