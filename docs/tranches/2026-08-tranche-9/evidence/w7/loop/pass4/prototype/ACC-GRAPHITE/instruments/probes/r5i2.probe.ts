/**
 * R5 BORN-RED INSTRUMENTS — the player mark's substrate, written before any cure.
 *
 * Every row here asserts the LAW T9-M14 asks for, against the product at HEAD. All four are
 * expected RED. They live in the lane's evidence dir, run off the estate (the lane's own
 * scratch config, 127.0.0.1:4231), and touch no product file.
 *
 *   I2  a player's own colour is the colour the room sees            RED at HEAD
 *   I3  the top-left carries a player mark that opens a lobby        RED at HEAD
 *   I4  an agreed ink index is never reassigned                      RED at HEAD
 *   I5  a live identity claim is never handed to a second page       RED at HEAD
 */
import { test, expect, type Page } from "@playwright/test";
// COPIED from r0/r5-player-mark/instruments.spec.ts (I2 only; frozen original untouched) + one
// added row: the digit A writes, as A paints it and as B paints it (F1 YES says: the same ink).

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}
const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");
const swatchOf = (p: Page, slug: string) =>
  p.evaluate((s) => {
    const li = [...document.querySelectorAll(".controls-card .players-roster .player-row")].find(
      (e) => e.querySelector(".player-name")?.textContent?.trim() === s,
    );
    return li
      ? getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor
      : "(no row)";
  }, slug);
const selfSlug = (p: Page) =>
  p.evaluate(
    () =>
      document
        .querySelector(".controls-card .players-roster .player-row:has(.player-self) .player-name")
        ?.textContent?.trim() ?? "",
  );

test("I2 — a player's own colour is the colour the room sees", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(roster(a)).toHaveCount(2);

  const aSlug = await selfSlug(a);
  const mine = await swatchOf(a, aSlug); // what A paints for A
  const theirs = await swatchOf(b, aSlug); // what B paints for A
  // the added row: A writes one digit; its stroke on A's page and on B's page
  const cell = a.locator(".sudoku-cell input:not([readonly])").nth(3);
  const idx = await cell.evaluate((el) => Array.from(document.querySelectorAll(".sudoku-cell input")).indexOf(el as HTMLInputElement));
  await cell.focus();
  await a.keyboard.type("7");
  await a.waitForTimeout(1500);
  const ink = (p: Page) => p.evaluate((i) => { const g = document.querySelectorAll(".sudoku-cell")[i]?.querySelector(".glyph-svg path"); return g ? getComputedStyle(g).stroke : "(none)"; }, idx);
  const digitA = await ink(a), digitB = await ink(b);
  console.log(`R5-I2|self=${mine}|room=${theirs}|digitOnA=${digitA}|digitOnB=${digitB}`);
  expect.soft(digitA, "the digit A wrote paints in one ink on both pages").toBe(digitB);
  // T9-M14: "each player should have a unique colour". A colour that is one thing on your
  // screen and another on everybody else's is not a player's colour; it is a page's.
  expect(mine, "the player's own swatch must be the colour the room sees").toBe(theirs);
  await ctx.close();
});

