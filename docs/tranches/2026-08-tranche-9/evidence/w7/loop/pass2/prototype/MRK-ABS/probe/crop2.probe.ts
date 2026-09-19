/** T9-W7 pass 2 · MRK-ABS — CROP 2: the same 16x16 cell at the ALTERNATE inset (U-10's lever).
 *  Run with RING_GEOMETRY.inset temporarily at 0.90; the file is put back immediately after. */
import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const FRAMES = process.env.FRAME_OUT ?? ".";
mkdirSync(FRAMES, { recursive: true });

test("crop2-f090", async ({ page }) => {
  await page.goto("/?size=4&difficulty=EASY");
  await page.waitForSelector(".game-cell", { timeout: 30000 });
  await page.waitForFunction(() => document.querySelectorAll(".game-cell").length === 256, {
    timeout: 90000,
  });
  await page.evaluate(() => document.documentElement.classList.toggle("dark", true));
  await page.waitForTimeout(700);
  const pick = await page.evaluate(() => {
    const cells = Array.from(document.querySelectorAll(".game-cell"));
    for (let i = 0; i < cells.length; i++) {
      const r = Math.floor(i / 16);
      const c = i % 16;
      if (r < 2 || r > 13 || c < 2 || c > 13) continue;
      const inp = cells[i].querySelector("input") as HTMLInputElement;
      if (!inp || inp.value || inp.readOnly || inp.disabled) continue;
      inp.focus();
      return i;
    }
    return -1;
  });
  await page.waitForTimeout(500);
  const d = await page.evaluate(
    (i) =>
      (document.querySelectorAll(".game-cell")[i].querySelector(".cell-ghost-path") as SVGPathElement)
        .getAttribute("d")!
        .slice(0, 60),
    pick,
  );
  console.log(`[crop2] cell ${pick} d starts ${d}`);
  const box = (await page.locator(".game-cell").nth(pick).boundingBox())!;
  await page.screenshot({
    path: join(FRAMES, "crop2-cell-16x16-dark-f090.png"),
    clip: {
      x: Math.floor(box.x - box.width),
      y: Math.floor(box.y - box.height),
      width: Math.ceil(box.width * 3),
      height: Math.ceil(box.height * 3),
    },
    scale: "device",
  });
});
