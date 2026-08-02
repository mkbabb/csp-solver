/**
 * The two guard signals, pulled apart (pass-5 Lane A, A2).
 *
 * `attemptDeal` reads two: the TARGET ledger's `userMoves` and the MOUNTED board's `dirty`.
 * The subsumption row has to isolate the second, or an ablation of it is absorbed by the first.
 * Write a digit, erase it: two entries on the undo log (`isDirty` = undo-depth > 0, `766aa068`)
 * and no non-given cell holding a value (`userMoves`, `useGameState.ts:879`). This prints both.
 *
 *   node dirty-signal-probe.mjs <baseURL>
 */
import { chromium } from "@playwright/test";
const base = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(base + "/?size=3&difficulty=EASY");
await p.waitForSelector(".sudoku-cell", { timeout: 20000 });
await p.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, null, { timeout: 20000 });
const before = await p.locator(".sudoku-cell .glyph-svg").count();
const blank = await p.evaluate(() => {
  const c = document.querySelectorAll(".sudoku-cell");
  for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i;
  return -1;
});
for (const v of ["1", ""]) {
  await p.locator(".sudoku-cell").nth(blank).click();
  await p.evaluate(([idx, val]) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, val);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, [blank, v]);
  await p.waitForTimeout(400);
}
await p.waitForTimeout(500);
console.log("glyphs before / after the write+erase :", before, "/", await p.locator(".sudoku-cell .glyph-svg").count());
console.log("staging-ledger-v1                     :", await p.evaluate(() => localStorage.getItem("staging-ledger-v1")));
await p.locator("button.logo-trigger").click();
await p.waitForSelector(".staging-band", { timeout: 20000 });
await p.locator(".staging-deal").click();
await p.waitForTimeout(900);
console.log("ribbon after a SAME-game deal         :", await p.locator(".gallery-guard").isVisible().catch(() => false));
console.log("  aria-label                          :", await p.locator(".gallery-guard").getAttribute("aria-label").catch(() => null));
console.log("  sub-line                            :", JSON.stringify(await p.locator(".gallery-guard .guard-note-sub").textContent().catch(() => null)));
await b.close();
