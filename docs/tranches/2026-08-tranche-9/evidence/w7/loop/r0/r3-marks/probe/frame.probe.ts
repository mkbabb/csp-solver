/**
 * T9-W7 round zero · lane R3 — ONE frame, cropped to the thing it proves: the CAD-precise
 * selection ring sitting on the wobbling grid. dpr 3 so the ruler-straight edge reads.
 */
import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const FRAMES = join(dirname(new URL(import.meta.url).pathname), "..", "frames");
mkdirSync(FRAMES, { recursive: true });

test.use({ deviceScaleFactor: 3 });

test("R3-frame the ring on the grid", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "one engine is enough for a crop");
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);

  const box = await page.evaluate(() => {
    const cell = document.querySelector(".game-cell:has(input:focus-visible)")!;
    const r = cell.getBoundingClientRect();
    return { x: r.x - r.width * 0.55, y: r.y - r.height * 0.55, width: r.width * 2.1, height: r.height * 2.1 };
  });
  await page.screenshot({ path: join(FRAMES, "ring-on-grid.png"), clip: box });
});
