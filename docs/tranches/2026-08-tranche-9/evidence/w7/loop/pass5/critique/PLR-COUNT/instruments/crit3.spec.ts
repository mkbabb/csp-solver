/** Arm (c) read under the flipped const: name vs written glyph (2.5.3), width, per N. */
import { test, expect, type Page } from "@playwright/test";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
test("ARMC name vs glyph", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const room = `armc-${Date.now()}`;
  await page.goto(`http://127.0.0.1:4236/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const rows: unknown[] = [];
  let at = 1, idx = 0;
  for (const N of [5, 6, 9, 14, 15, 16]) {
    await page.evaluate(({ room, k, from }) => { const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `armc-${from + i}` }); setTimeout(() => ch.close(), 0); }, { room, k: N - at, from: idx });
    idx += N - at; at = N;
    const m = page.locator("[data-player-mark]:visible").first();
    await expect.poll(() => m.getAttribute("aria-label")).toBe(`${N} players`);
    await page.waitForTimeout(900);
    rows.push(await m.evaluate((e) => ({ label: e.getAttribute("aria-label"), written: e.querySelector(".pt-count")?.textContent ?? null, strokes: e.querySelector(".pt-pose")?.querySelectorAll("path").length ?? 0, plus: !!e.querySelector(".pt-plus"), width: +e.getBoundingClientRect().width.toFixed(2), writtenInName: !!e.querySelector(".pt-count") && (e.getAttribute("aria-label") ?? "").includes(e.querySelector(".pt-count")!.textContent!.trim()) })));
  }
  console.log("ARMC", JSON.stringify(rows));
});
