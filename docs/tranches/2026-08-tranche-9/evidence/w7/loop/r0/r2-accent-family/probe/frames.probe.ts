/**
 * frames.probe.ts — two crops, and only two.
 *
 * The census is numbers. These exist because ONE claim is not a number: that the blue
 * focus ring, the blue digit and the violet trace are co-visible in a single glance at
 * the board's top-left corner, doing three unrelated jobs in two unrelated hues. Each
 * frame is a tight crop of exactly that corner, light and dark.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r2-accent-family/frames";
mkdirSync(OUT, { recursive: true });

async function boot(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
}

for (const scheme of ["light", "dark"] as const) {
  test(`frame — the board's corner, three accents at once (${scheme})`, async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "one engine is enough for a crop");
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    // write enough digits to pull the violet trace along the frame, then land keyboard
    // focus on a cell so the crayon-blue ring is up at the same moment.
    await page.locator(".sudoku-cell input:not([readonly])").first().focus();
    for (let i = 0; i < 14; i++) {
      await page.keyboard.type("1");
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(900);

    const box = await page.locator(".board-wrapper").boundingBox();
    if (!box) return;
    await page.screenshot({
      path: join(OUT, `board-corner-${scheme}.png`),
      clip: {
        x: Math.round(box.x),
        y: Math.round(box.y),
        width: Math.round(Math.min(box.width, 330)),
        height: Math.round(Math.min(box.height, 210)),
      },
    });
  });
}
