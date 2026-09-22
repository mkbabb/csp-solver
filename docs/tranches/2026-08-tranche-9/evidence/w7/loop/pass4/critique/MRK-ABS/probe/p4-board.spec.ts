/**
 * T9-W7 pass 4 · MRK-ABS — charter row 1: the two-value SEARCH at the board, before any
 * sentence says "no value fixes this". Painted bytes (focused minus blurred, the max-changed
 * pixel in a 3x3 window, ground read at that same pixel), 16x16, cell 0 (its left stroke on the
 * FRAME) and cell 1 (paper), both themes, a lightness ladder per theme + law 39's 0.9 arm.
 * Both statistics banked (worst AND median of 60 samples), per engine.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, mintSudoku, setTheme, readRing } from "./abs-lib";

const LADDER = process.env.LADDER_D ? { dark: process.env.LADDER_D.split(","), light: process.env.LADDER_L!.split(",") } : {
  dark: ["#3a7bc4", "#3674bb", "#3470b6", "#326cb0", "#306aac", "#2f66a8", "#2d63a3", "#2c609f", "#2a5d9b", "#2a5a96"],
  light: ["#3a7bc4", "#3c7ec7", "#3f80c9", "#4083cc", "#4285ce", "#4488d1", "#468ad3", "#488dd6", "#4a90d9"],
};
test("board search · 16x16 · frame + paper · both themes", async ({ page }, info) => {
  const engine = info.project.name; const rows: Record<string, unknown>[] = [];
  const payload = mintSudoku(4);
  await page.goto(`/?size=4&board=${payload}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  const pinned = await page.evaluate(() => new URLSearchParams(location.search).get("board"));
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme); await page.waitForTimeout(500);
    const arms = [...LADDER[theme].map((h) => ({ arm: h, css: h === "#3a7bc4" ? "" : `:root,.dark{--color-focus-sketch:${h}!important}` })),
      { arm: "#3a7bc4@0.90", css: `.game-cell:has(input:focus-visible) .cell-ghost-path{stroke-opacity:.9!important}` }];
    for (const cell of [0, 1]) for (const a of arms) {
      const r = await readRing(page, cell, a.css);
      const row = { engine, theme, cell, on: cell === 0 ? "FRAME" : "paper", arm: a.arm, ...r };
      rows.push(row); console.log("ROW " + JSON.stringify(row));
    }
  }
  bank(`board-search${process.env.TAG ?? ""}-${engine}`, { payload, pinnedAfterLoad: pinned === payload, rows });
  expect(rows.length).toBeGreaterThan(0);
});
