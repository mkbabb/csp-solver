/**
 * NOTE-ERASE pass 5 · R3-d/R3-g's `solve` act on the PINNED payload (pass 4's round armed nothing
 * on a random deal). Same regime as r0's reader (reduce, light); the arm is asserted non-empty.
 */
import { test, expect } from "@playwright/test";
import { bank, say, boardReady, armHint, watchLeave, leaveResult, PROTO, PAYLOAD } from "./lib";

test("solve: an armed hint note meets Solve", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const rm of ["reduce", "no-preference"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm });
    const page = await ctx.newPage();
    await boardReady(page, PROTO);
    await armHint(page, 0);
    const armed = await page.evaluate(() => ({
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      age: document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") ?? null,
    }));
    await watchLeave(page, false);
    await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
    const leave = await leaveResult(page, true);
    await expect.poll(() => page.evaluate(() => (document.querySelector(".margin-note")?.textContent || "").trim()), { timeout: 15000 }).toContain("solved it");
    const after = await page.evaluate(() => ({
      text: (document.querySelector(".margin-note")?.textContent || "").trim(),
      tone: document.querySelector(".margin-note")?.className,
      age: document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") ?? null,
    }));
    rows[rm] = { armed, leave, after };
    await ctx.close();
  }
  bank(`solve-${info.project.name}.json`, rows);
  say("solve", rows);
  expect((rows.reduce as { armed: { text: string } }).armed.text).not.toBe("");
});
