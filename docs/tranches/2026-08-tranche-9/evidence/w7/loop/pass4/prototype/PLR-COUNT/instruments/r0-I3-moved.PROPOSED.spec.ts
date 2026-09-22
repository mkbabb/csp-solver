/**
 * r0 I3 — MOVED, and the move is banked as a diff rather than a re-cut in place (the record is
 * frozen). r0's line reads `expect(a.getByRole("dialog").or(a.locator("[data-lobby]")))
 * .toBeVisible()`; the estate mounts the head twice (desk + mobile, one hidden by a media
 * query), so `[data-lobby]` resolves to TWO nodes and Playwright's strict mode throws before
 * the assertion can be true or false. MOVED form: exactly two lobbies exist and exactly one of
 * them is visible. The subject moved because THIS diff mounts the mark; the row is reported
 * MOVED and the instrument travels as a proposed diff, never applied to r0.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}
const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");

test("I3 (MOVED) — the top-left carries a player mark that opens a lobby", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await expect(roster(a)).toHaveCount(1);

  const mark = a.getByRole("button", { name: /player|lobby|who.s (here|on this board)/i });
  console.log(`R5-I3|candidates=${await mark.count()}`);
  await expect(mark, "a player mark lives in the head").toHaveCount(1);
  const box = await mark.first().boundingBox();
  expect(box!.x, "it is in the LEFT of the head").toBeLessThan(200);
  expect(box!.y, "it is in the head, not the card").toBeLessThan(120);
  await mark.first().click();
  // MOVED: two mounted, exactly one visible.
  await expect(a.locator("[data-lobby]")).toHaveCount(2);
  await expect(a.locator("[data-lobby]:visible")).toHaveCount(1);
  await ctx.close();
});
