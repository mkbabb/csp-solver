/**
 * T9-W7 pass 1 · MRK-LIVE §1.4 — THE ARMED VERB. The spec defers this to pass 2; the wiring is
 * here, so it is measured rather than asserted: does the destructive face step the beat for one
 * revolution when the ribbon arms, and does the filter census stay at 9 while it does?
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

test("the armed destructive verb steps one revolution", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const i = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    i.find((el) => !el.value && !el.readOnly && !el.disabled)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1400);

  const tracePromise = page.evaluate(async () => {
    const read = () => {
      const faces = Array.from(
        document.querySelectorAll(".guard-leave .guard-face .boil-pose"),
      );
      if (!faces.length) return { n: 0, active: -1 };
      return {
        n: faces.length,
        active: faces.findIndex((g) => g.classList.contains("is-active")),
      };
    };
    const t0 = performance.now();
    const swaps: { t: number; to: number }[] = [];
    let last = -2;
    let armedAt = -1;
    while (performance.now() - t0 < 2600) {
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const v = read();
      if (v.n && armedAt < 0) armedAt = Math.round(performance.now() - t0);
      if (v.n && v.active !== last) {
        swaps.push({ t: Math.round(performance.now() - t0), to: v.active });
        last = v.active;
      }
    }
    const live = Array.from(document.querySelectorAll("*")).filter((el) => {
      const cs = getComputedStyle(el);
      return cs.filter !== "none" && cs.display !== "none";
    }).length;
    return { swaps, armedAt, poses: read().n, final: last, liveFilterTotal: live };
  });
  await page.keyboard.press("d");
  const trace = await tracePromise;

  const row = { engine: browserName, ...trace };
  writeFileSync(join(OUT, `verb-${browserName}.json`), JSON.stringify(row, null, 2));
  console.log("VERB " + JSON.stringify(row));
  expect(row.armedAt).toBeGreaterThanOrEqual(0);
});
