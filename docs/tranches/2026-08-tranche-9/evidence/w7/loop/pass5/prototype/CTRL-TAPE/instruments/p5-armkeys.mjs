/**
 * T9-W7 pass 5 · CTRL-TAPE — A TOUCH-ARMER WHO REACHES FOR THE KEYBOARD (COST's graft row).
 *
 *   node p5-armkeys.mjs <baseURL>
 *
 * 390×844 hasTouch, dirty board (the estate's own route, `gallery-deal.spec.ts::dirtySudoku`),
 * dock settled, one TAP on Clear (the ask stands), then the reader presses Tab (WebKit: Alt+Tab)
 * three times. Reads: where focus was after the tap, and where each press lands — the ribbon's
 * `keep` / its destructive answer / anywhere else. A pointer arm moves no focus by design, so the
 * decided row is either "the first press reaches the ribbon" or a STATED lapse with the number.
 */
import { ENGINES, CELLS, open } from "./p5-lib.mjs";

const BASE = process.argv[2];
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  const { ctx, page } = await open(br, BASE, CELLS.dock390, { dpr: 1 });
  // dirty the board (a blank cell, the native setter, an input event)
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(500);
  await page.locator('#card-foot .action-bar button[aria-label="Clear the board"]').tap();
  await page.waitForTimeout(300);
  const who = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return "body";
      if (a.closest(".confirm-ribbon")) return `ribbon:${(a.textContent || "").trim()}`;
      return `${a.tagName}:${(a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 28)}`;
    });
  const asked = await page.locator(".confirm-ribbon").count();
  const afterTap = await who();
  const presses = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press(eng === "webkit" ? "Alt+Tab" : "Tab");
    presses.push(await who());
  }
  console.log(eng, JSON.stringify({ asked, afterTap, presses }));
  await ctx.close();
  await br.close();
}
