/** MRK-ABS pass-4 CRITIC — the joint lever the lane never searched: the dark arm's ceiling at
 *  tier-2 stroke-opacity 1.0 (LIVE's rank axis) vs 0.95. 16x16, cell 0 frame + cell 1 paper, dark. */
import { test, expect } from "@playwright/test";
import { bank, mintSudoku, setTheme, readRing } from "./abs-lib";
const D = ["#3a7bc4", "#2f68aa", "#2e64a4", "#2c619f", "#306cb0"];
test("critic · dark ceiling at opacity 1.0 vs 0.95", async ({ page }, info) => {
  const engine = info.project.name; const rows: Record<string, unknown>[] = [];
  await page.goto(`/?size=4&board=${mintSudoku(4)}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  await page.waitForTimeout(900);
  for (const theme of ["dark", "light"] as const) {
    await setTheme(page, theme); await page.waitForTimeout(500);
    const hexes = theme === "dark" ? D : ["#3a7bc4", "#4589d2"];
    for (const op of ["0.95", "1"]) for (const h of hexes) for (const cell of [0, 1]) {
      const css = `:root,.dark{--color-focus-sketch:${h}!important} .game-cell:has(input:focus-visible) .cell-ghost-path{stroke-opacity:${op}!important}`;
      const r = await readRing(page, cell, css);
      const row = { engine, theme, op, hex: h, on: cell === 0 ? "FRAME" : "paper", worst: r.worst, median: r.median, painted: r.painted, so: r.strokeOpacity, ground: r.ground };
      rows.push(row); console.log("ROW " + JSON.stringify(row));
    }
  }
  bank(`crit-opq-${engine}`, rows); expect(rows.length).toBeGreaterThan(0);
});
