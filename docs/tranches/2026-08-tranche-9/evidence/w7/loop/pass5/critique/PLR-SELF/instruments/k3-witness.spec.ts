import { test, expect } from "@playwright/test";
test("k3 witness the planted edge", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("http://127.0.0.1:4246/?size=3&difficulty=EASY&wire=local");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.locator(".corner-left .attribution-trigger").hover();
  await expect(page.locator(".corner-left .hover-card")).toHaveClass(/is-open/);
  const r = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>(".head-sheet-edge")].filter((e) => e.getBoundingClientRect().width > 0).map((e) => getComputedStyle(e).opacity));
  console.log(`K3 ${info.project.name} edge opacity (visible instances) = ${JSON.stringify(r)}`);
});
