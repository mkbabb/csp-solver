/**
 * TWO CROPS, each of a thing a number cannot say (≤150 KB, chromium only, text-first policy).
 *
 *  1 · desk-register-over-board — the state pass 1 never shot: the desk register OPEN, laying
 *      101.18 × 124.11 px over the board's top-left, with the @mbabb card painting on top of it
 *      from the same anchor.
 *  2 · phone664-sheet-over-grid — the short phone, where the sheet takes 21 of 81 cells and the
 *      `and N more` line stands on the wordmark.
 */
import { test, expect, type Page } from "@playwright/test";
import path from "node:path";

const FRAMES = path.resolve(__dirname, "..", "frames");
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const peers = async (page: Page, room: string, k: number) => {
  await page.evaluate(
    ({ room, k }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `cp-${i}` });
    },
    { room, k },
  );
  await page.waitForTimeout(1000);
};

test("crops", async ({ browser }, info) => {
  if (info.project.name !== "chromium") test.skip();

  // 1 — the desk register over the board, with the card on top of it
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const room = "crop1";
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 5);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    await page.locator("[data-player-mark]:visible").first().hover();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(FRAMES, "desk-register-over-board.png"),
      clip: { x: 0, y: 0, width: 420, height: 290 },
    });
    await ctx.close();
  }

  // 2 — the short phone
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 664 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await ctx.newPage();
    const room = "crop2";
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(FRAMES, "phone664-sheet-over-grid.png"),
      clip: { x: 0, y: 0, width: 390, height: 400 },
    });
    await ctx.close();
  }
});
