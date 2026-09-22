/**
 * PLR-SELF pass 4 — F1's TWO ARMS, read on the three surfaces the const changes (gap 7).
 *
 * The arm is whatever `SELF_TAKES_ROOM_INK` is set to in the tree this runs against; the runner
 * flips the const, lets the dev server reload, and runs this twice. Nothing is asserted — both
 * arms are lawful and the owner disposes (chair §6.10 / U-10).
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

const SOLO = "/?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PLR-SELF/frames";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page
    .locator(".sudoku-cell .glyph-svg")
    .first()
    .waitFor({ state: "attached", timeout: 60000 });
  await page.waitForTimeout(400);
}

test("F1 on the mark, the row and the deck swatch", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "one engine; the arm is a const, not a renderer");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await page.waitForTimeout(600);
  await page.evaluate(() => {
    const r = new URL(location.href).searchParams.get("s");
    if (!r) return;
    const ch = new BroadcastChannel(`board:${r}`);
    for (let i = 0; i < 2; i++) ch.postMessage({ kind: "hi", data: {}, from: `f1-${i}` });
    setTimeout(() => ch.close(), 0);
  });
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 })
    .toBe(3);
  await page.waitForTimeout(800); // past the 400ms presence ink

  await page.locator("[data-player-mark]:visible").click();
  await page.waitForTimeout(340);

  const read = await page.evaluate(() => {
    const m = [...document.querySelectorAll<HTMLElement>("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().height > 0,
    )!;
    const sheet = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().height > 0,
    ) as HTMLElement;
    const selfRow = document.querySelector(
      ".players-roster .player-row:has(.player-self) .player-swatch",
    ) as HTMLElement | null;
    return {
      markLive: m.classList.contains("is-live"),
      markColor: getComputedStyle(m).color,
      markUserInk: getComputedStyle(m).getPropertyValue("--color-user-ink").trim(),
      sheetFirstRowColor: getComputedStyle(sheet.querySelector(".pl-name")!).color,
      rosterSelfSwatch: selfRow ? getComputedStyle(selfRow).backgroundColor : null,
      deckSwatches: [...document.querySelectorAll(".game-card-swatch")].map(
        (e) => getComputedStyle(e as HTMLElement).backgroundColor,
      ),
    };
  });
  console.log(`[F1-${process.env.PLR_F1 ?? "?"}] ${JSON.stringify(read)}`);

  // THE DECK'S SWATCH — the third surface, and G14's webkit race cured by WAITING ON THE ROOM
  // before the deck is read (gap 11): the roster is already at 3 above, so the room is formed
  // before this navigation, and the deck is polled for its cards rather than sampled once.
  await page.goto("/?view=gallery&wire=local");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".game-card-swatch").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  const deck = await page.evaluate(() => ({
    roster: document.querySelectorAll(".players-roster .player-row").length,
    swatches: [...document.querySelectorAll(".game-card-swatch")].map(
      (e) => getComputedStyle(e as HTMLElement).backgroundColor,
    ),
  }));
  console.log(`[F1-DECK-${process.env.PLR_F1 ?? "?"}] ${JSON.stringify(deck)}`);

  mkdirSync(OUT, { recursive: true });
  await page.screenshot({
    path: `${OUT}/3-f1-${process.env.PLR_F1 ?? "arm"}.png`,
    clip: { x: 0, y: 0, width: 300, height: 150 },
  });
});
