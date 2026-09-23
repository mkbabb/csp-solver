import { test } from "@playwright/test";
// The graphite arm is live code: flip the published attribute in-page (the const's one effect)
// and read tier 2's computed paint and the chrome ring's ink; then flip back.
test("P6-ARM · the section fork's graphite arm computes", async ({ page }, info) => {
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(900);
  await page.keyboard.press("Tab");
  const read = () =>
    page.evaluate(() => {
      const input = document.querySelectorAll<HTMLInputElement>(".game-cell input")[10];
      input.focus();
      const p = input.closest(".game-cell")!.querySelector(".cell-ghost-path")!;
      const g = getComputedStyle(p);
      return { arm: document.documentElement.dataset.ringArm, fill: g.fill, stroke: g.stroke, w: g.strokeWidth, op: g.strokeOpacity, ringInk: getComputedStyle(document.documentElement).getPropertyValue("--ring-ink").trim() };
    });
  const blue = await read();
  await page.evaluate(() => (document.documentElement.dataset.ringArm = "graphite"));
  const graphite = await read();
  await page.evaluate(() => (document.documentElement.dataset.ringArm = "blue"));
  console.log(`ARM ${info.project.name} ` + JSON.stringify({ blue, graphite }));
});
