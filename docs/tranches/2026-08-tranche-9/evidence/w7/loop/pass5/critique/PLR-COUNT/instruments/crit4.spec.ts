import { test, expect, type Page } from "@playwright/test";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
test.use({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
test("X1 witness", async ({ page, browserName }) => {
  const room = `x1w-${Date.now()}`;
  await page.goto(`http://127.0.0.1:4236/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await page.evaluate(({ room }) => { const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < 15; i++) ch.postMessage({ kind: "hi", data: {}, from: `x1w-${i}` }); setTimeout(() => ch.close(), 0); }, { room });
  const m = page.locator("[data-player-mark]:visible").first();
  await expect.poll(() => m.getAttribute("aria-label")).toBe("16 players");
  await m.click(); await page.mouse.move(1270, 710);
  const sheet = page.locator("[data-lobby]:visible").first();
  await expect.poll(() => sheet.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  const mask = await sheet.locator(".pl-state").evaluate((e) => getComputedStyle(e).maskImage || (getComputedStyle(e) as any).webkitMaskImage);
  console.log("X1W", browserName, JSON.stringify(mask));
  await sheet.screenshot({ path: "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-count/x1w-" + browserName + ".png" });
});
