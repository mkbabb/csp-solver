/**
 * MRK-ABS pass-1 · the dpr3 crop of the compensated ring, beside R3's `frames/ring-on-grid.png`.
 * Chromium only, deviceScaleFactor 3, light. One file, cropped to `#crop`.
 */
import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const EV =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/MRK-ABS";
mkdirSync(join(EV, "frames"), { recursive: true });

test("MA-2 THE EYE — compensated ring beside HEAD's, dpr3", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "one crop, one engine");
  const ctx = await browser.newContext({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.goto("file://" + join(EV, "proto", "ring-crop.html"));
  await page.waitForTimeout(300);
  await page.locator("#crop").screenshot({ path: join(EV, "frames", "ring-band-dpr3.png") });
  await ctx.close();
});
