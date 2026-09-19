import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
const DESK = { width: 1280, height: 800 };
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PLR-SELF";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
test("P · the one frame the claim needs", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(page);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  for (let i = 0; i < 3; i++) { const p = await ctx.newPage(); await p.goto(page.url()); await settled(p); }
  await page.bringToFront();
  await page.waitForTimeout(1000);
  await page.locator("[data-player-mark]:visible").click();
  await page.waitForTimeout(800);
  await page.mouse.move(900, 740);
  await page.waitForTimeout(900);
  const m = await page.locator("[data-player-mark]:visible").evaluate((el) => getComputedStyle(el).color);
  console.log(`CROP|${JSON.stringify({ markColor: m })}`);
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 300, height: 220 } });
  await sharp(buf).png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/mark-and-self-row.png`);
  await ctx.close();
});
