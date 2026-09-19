/**
 * T9-W7 pass 1 · MRK-LIVE — the DECK's own live-filter census, with the drawn ring painting and
 * a ribbon armed. The board view is 9 (budget.probe.ts); the deck is its own population, so
 * this names every filtered element rather than reporting a bare count.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

const CENSUS = `() => {
  const rows = [];
  for (const el of Array.from(document.querySelectorAll("*"))) {
    const cs = getComputedStyle(el);
    if (cs.filter === "none" || cs.display === "none") continue;
    rows.push({
      el: el.tagName.toLowerCase() + "." + (el.getAttribute("class") || "").split(/\\s+/)[0],
      filter: cs.filter.slice(0, 30),
      insideRing: !!el.closest(".focus-ring"),
      isRing: el.classList.contains("focus-ring"),
    });
  }
  return { total: rows.length, fromRing: rows.filter((r) => r.insideRing || r.isRing).length, rows };
}`;

test("the deck's census with the ring painted", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await boardReady(page, "?size=3&difficulty=EASY");
  const board = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: CENSUS });
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1600);
  const deck = await page.evaluate(({ fn }) => (eval(fn) as any)(), { fn: CENSUS });
  const out = {
    engine: browserName,
    boardTotal: board.total,
    boardFromRing: board.fromRing,
    deckTotal: deck.total,
    deckFromRing: deck.fromRing,
    deckRows: deck.rows,
  };
  writeFileSync(join(OUT, `deck-census-${browserName}.json`), JSON.stringify(out, null, 2));
  console.log("DECKCENSUS " + JSON.stringify({ ...out, deckRows: undefined }));
  expect(out.deckFromRing).toBe(0);
});
