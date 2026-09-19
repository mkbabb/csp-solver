/**
 * PAL-WALK pass-1 CRITIQUE — THE STATE THE PROTOTYPE DID NOT MEASURE: a room with nobody in it.
 *
 * `roomId` goes non-null the moment the page presses the invite verb (`shareSession` =
 * `startSession()` + `shareBoard()`), which is BEFORE any peer exists and before any join trace
 * can explain anything. The family binds self ink on `roomId !== null`, so this reads the
 * board's own ink and the roster swatch across that press: solo → alone-in-a-room.
 */
import { test, expect } from "@playwright/test";

const SOLO = "/?game=sudoku&wire=local";

test("the ink across the invite press, with nobody else there", async ({ page }, info) => {
  await page.goto(SOLO);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);

  // write one digit into the first empty cell, so there is handwriting to recolour
  const empty = page.locator('.board-cells [role="gridcell"]:not([aria-readonly="true"])').first();
  await empty.click();
  await page.keyboard.press("5");
  await page.waitForTimeout(400);

  const read = async (label: string) => {
    const r = await page.evaluate(() => {
      const bound = [...document.querySelectorAll<HTMLElement>("[style]")]
        .filter((e) => (e.getAttribute("style") || "").includes("--color-user-ink"))
        .map((e) => `${e.tagName}.${e.className}|${e.getAttribute("style")}`);
      const cell = document.querySelector<HTMLElement>(".sudoku-cell");
      const glyph = document.querySelector<HTMLElement>(".sudoku-cell .glyph-svg path");
      const swatch = document.querySelector<HTMLElement>(".players-roster .player-row *");
      const url = new URL(location.href);
      return {
        boundCount: bound.length,
        bound: bound.slice(0, 4),
        rootInk: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-user-ink")
          .trim(),
        cellInk: cell
          ? getComputedStyle(cell).getPropertyValue("--color-user-ink").trim()
          : "(none)",
        glyphStroke: glyph ? getComputedStyle(glyph).stroke : "(none)",
        swatch: swatch ? getComputedStyle(swatch).backgroundColor : "none",
        s: url.searchParams.get("s"),
      };
    });
    console.log(`[${info.project.name}] ${label}: ${JSON.stringify(r)}`);
    return r;
  };

  const before = await read("SOLO (roomId null)");

  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  await page.waitForTimeout(1400);

  const after = await read("ALONE IN A ROOM (roomId set, zero peers)");
  // and now a digit written INSIDE the room, still with nobody else there
  const empty2 = page.locator('.board-cells [role="gridcell"]:not([aria-readonly="true"])').nth(1);
  await empty2.click();
  await page.keyboard.press("7");
  await page.waitForTimeout(600);
  const wrote = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.board-cells [role="gridcell"]')];
    return cells
      .map((c) => c.getAttribute("aria-label") || "")
      .filter((l) => /entry|'s /.test(l))
      .slice(0, 4);
  });
  console.log(`[${info.project.name}] authored cells: ${JSON.stringify(wrote)}`);
  await read("ALONE IN A ROOM, after writing a digit in the room");

  // AND OUT AGAIN — teardown clears inkIndex/inkAgreed; does the page come back to solo bytes?
  const leave = page.locator(".players-leave, button:has-text('leave')").first();
  if (await leave.count()) {
    await leave.click();
    await page.waitForTimeout(1200);
    await read("AFTER LEAVE (back to solo)");
  } else {
    console.log(`[${info.project.name}] no leave verb found`);
  }

  const roster = await page.evaluate(() => {
    const rows = [...document.querySelectorAll(".controls-card .players-roster .player-row")];
    return rows.map((r) => (r.textContent || "").trim());
  });
  console.log(`[${info.project.name}] roster rows: ${JSON.stringify(roster)}`);
  expect(before.boundCount).toBe(0);
});
