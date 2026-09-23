import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
test("mint", async ({ page }) => {
  await page.goto(`${process.env.CONTROL}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
  const cells = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => /given clue (\d)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? "0").join(""));
  const p = Buffer.from("\x01" + "3." + cells, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  writeFileSync(process.env.OUTF!, JSON.stringify({ payload: p, givens: cells }));
});
