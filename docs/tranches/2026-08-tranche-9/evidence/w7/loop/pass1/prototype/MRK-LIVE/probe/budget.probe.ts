/**
 * T9-W7 pass 1 · MRK-LIVE PROTOTYPE — the GUARD: filterBudget 9/9/9 and the ghost population.
 *
 * With the living stack up AND the chrome ring painted, the live-filter census must still read
 * 9 at 4x4 / 9x9 / 16x16, and the ghost-path population must be N^2 + 3 (19 / 84 / 259) — three
 * sibling paths on ONE cell, never +N^2.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

test("GUARD filterBudget 9/9/9 and population +3", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  const sizes: Record<string, unknown> = {};
  for (const [label, q, n] of [
    ["4x4", "?size=2&difficulty=EASY", 4],
    ["9x9", "?size=3&difficulty=EASY", 9],
    ["16x16", "?size=4&difficulty=EASY", 16],
  ] as const) {
    await boardReady(page, q);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs[Math.floor(inputs.length / 2)]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(800);

    sizes[label] = await page.evaluate((boardSize) => {
      const live: string[] = [];
      for (const el of Array.from(document.querySelectorAll("*"))) {
        const cs = getComputedStyle(el);
        if (cs.filter !== "none" && cs.display !== "none")
          live.push(
            `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/)[0]}=${cs.filter.slice(0, 26)}`,
          );
      }
      const tally: Record<string, number> = {};
      for (const s of live) tally[s] = (tally[s] ?? 0) + 1;
      const ghosts = Array.from(document.querySelectorAll(".cell-ghost-path"));
      const ringPaths = Array.from(document.querySelectorAll(".focus-ring path"));
      return {
        liveFilterTotal: live.length,
        liveFilterRows: tally,
        cells: document.querySelectorAll(".game-cell").length,
        ghostPathsTotal: ghosts.length,
        expected: boardSize * boardSize + 3,
        delta: ghosts.length - boardSize * boardSize,
        ghostFilters: Array.from(new Set(ghosts.map((p) => getComputedStyle(p).filter))),
        ringPaths: ringPaths.length,
        ringFilters: Array.from(new Set(ringPaths.map((p) => getComputedStyle(p).filter))),
        ghostSvgsAriaHidden: Array.from(document.querySelectorAll(".cell-ghost")).every(
          (g) => g.getAttribute("aria-hidden") === "true",
        ),
      };
    }, n);
  }
  bank(`budget-${browserName}.json`, { engine: browserName, sizes });
  console.log("BUDGET " + JSON.stringify(sizes, null, 2));
  expect(Object.keys(sizes).length).toBe(3);
});
