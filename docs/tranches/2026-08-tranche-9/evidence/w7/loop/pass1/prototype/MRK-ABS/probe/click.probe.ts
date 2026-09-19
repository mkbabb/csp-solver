import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
const OUT = join(dirname(new URL(import.meta.url).pathname), "logs2");
mkdirSync(OUT, { recursive: true });

test("R3-j MOUSE CLICK vs KEYBOARD — which tier paints", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);

  const read = () =>
    page.evaluate(() => {
      const focused = document.querySelector(".game-cell:has(input:focus-visible)");
      const path = focused?.querySelector(".cell-ghost-path") as SVGPathElement | null;
      const anyActive = document.querySelector(".cell-ghost.is-active .cell-ghost-path") as SVGPathElement | null;
      const p = path ?? anyActive;
      const cs = p ? getComputedStyle(p) : null;
      return {
        cellMatchesFocusVisible: !!focused,
        stroke: cs?.stroke ?? null,
        strokeWidth: cs?.strokeWidth ?? null,
        strokeOpacity: cs?.strokeOpacity ?? null,
        tier: cs?.stroke === "rgb(58, 123, 196)" ? "tier 2 (crayon-blue)" : cs?.stroke === "rgb(38, 38, 38)" ? "tier 1 (graphite)" : cs?.stroke ?? "none",
      };
    });

  await page.locator(".game-cell").nth(40).click();
  await page.waitForTimeout(400);
  const click = await read();
  await page.mouse.move(2, 2); // leave the hover so only focus can paint
  await page.waitForTimeout(300);
  const clickNoHover = await read();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const keyboard = await read();

  const out = { engine: browserName, click, clickNoHover, keyboard };
  writeFileSync(join(OUT, `click-${browserName}.json`), JSON.stringify(out, null, 2));
  console.log("CLICK " + JSON.stringify(out));
  expect(out).toBeTruthy();
});
