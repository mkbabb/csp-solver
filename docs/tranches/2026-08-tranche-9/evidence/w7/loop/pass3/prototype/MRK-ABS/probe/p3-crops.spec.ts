/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — the cited crops. At most FOUR, <= 150 KB each, dpr 3,
 * only where a number cannot say it. Everything else in this lane is numbers and text.
 */
import { test, expect } from "@playwright/test";
import { mkdirSync, statSync } from "node:fs";

const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-ABS/frames";
mkdirSync(FRAMES, { recursive: true });

test.use({ deviceScaleFactor: 3 });

test("crop 1 · cell 0 at 16x16, DARK — the frame crossing this pass decided on", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "chromium", "one engine per crop; the numbers carry both");
  await page.goto("/?size=4");
  await page.waitForSelector(".board-shell .game-cell", { timeout: 120000 });
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (!dark) {
    await page.locator("button.sun-moon-toggle").click();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")), { timeout: 10000 })
      .toBe(true);
  }
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const inp = document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[0];
    inp?.focus();
  });
  await page.keyboard.press("Shift");
  await page.waitForTimeout(500);
  const box = await page.locator(".board-shell .game-cell").first().boundingBox();
  if (!box) throw new Error("no cell box");
  const f = `${FRAMES}/crop1-cell0-frame-dark-16x16-proto.png`;
  await page.screenshot({
    path: f,
    clip: { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 },
  });
  console.log(`[crop1] ${f} ${statSync(f).size} B`);
  expect(statSync(f).size).toBeLessThan(150000);
});

test("crop 3 · the deck's centre card, focused, LIGHT, webkit — square corners, the token", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "webkit", "the brief names webkit for this one");
  await page.goto("/?view=gallery");
  await page.waitForSelector(".gallery-viewport", { timeout: 40000 });
  await page.waitForTimeout(1000);
  await page.evaluate(() => (document.querySelector(".gallery-viewport") as HTMLElement)?.focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(500);
  const box = await page.locator(".game-card.is-center").first().boundingBox();
  if (!box) throw new Error("no centre card");
  const f = `${FRAMES}/crop3-deck-centre-focused-light-webkit.png`;
  await page.screenshot({
    path: f,
    clip: {
      x: Math.max(0, box.x - 14),
      y: Math.max(0, box.y - 14),
      width: Math.min(box.width + 28, 250),
      height: Math.min(box.height + 28, 170),
    },
  });
  console.log(`[crop3] ${f} ${statSync(f).size} B`);
  expect(statSync(f).size).toBeLessThan(150000);
});
