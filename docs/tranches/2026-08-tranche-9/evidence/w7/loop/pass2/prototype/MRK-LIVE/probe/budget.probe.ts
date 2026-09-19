/**
 * T9-W7 round zero · lane R3 — THE π-GUARD, measured. Two numbers a wobble cure must not move:
 * the live-filter census (filterBudget 9, exact-match both directions) and the per-cell DOM
 * population the ghost already pays for at every board size.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

test("R3-h THE π-GUARD — the filter census and the ghost's DOM cost", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  const sizes: Record<string, unknown> = {};
  for (const [label, q] of [
    ["4x4", "?size=2&difficulty=EASY"],
    ["9x9", "?size=3&difficulty=EASY"],
    ["16x16", "?size=4&difficulty=EASY"],
  ] as const) {
    await boardReady(page, q);
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
      inputs[Math.floor(inputs.length / 2)]?.focus();
    });
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);
    sizes[label] = await page.evaluate(() => {
      // The budget's own counting rule: own computed filter ≠ none AND own display ≠ none.
      const live: string[] = [];
      for (const el of Array.from(document.querySelectorAll("*"))) {
        const cs = getComputedStyle(el);
        if (cs.filter !== "none" && cs.display !== "none") {
          live.push(
            `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/)[0]}=${cs.filter.slice(0, 26)}`,
          );
        }
      }
      const tally: Record<string, number> = {};
      for (const s of live) tally[s] = (tally[s] ?? 0) + 1;
      const ghost = document.querySelector(".cell-ghost-path");
      const ghostFilter = ghost ? getComputedStyle(ghost).filter : null;
      return {
        liveFilterTotal: live.length,
        liveFilterRows: tally,
        cells: document.querySelectorAll(".game-cell").length,
        ghostSvgs: document.querySelectorAll(".cell-ghost svg").length,
        ghostPaths: document.querySelectorAll(".cell-ghost-path").length,
        peerWashes: document.querySelectorAll(".cell-peer").length,
        ghostFilter,
        // What a 4-pose ring stack WOULD cost if it mounted on every cell.
        hypotheticalPosePaths: document.querySelectorAll(".cell-ghost-path").length * 4,
      };
    });
  }
  writeFileSync(join(OUT, `budget-${browserName}.json`), JSON.stringify({ engine: browserName, sizes }, null, 2));
  console.log("BUDGET " + JSON.stringify({ engine: browserName, sizes }));
  expect(Object.keys(sizes).length).toBe(3);
});
