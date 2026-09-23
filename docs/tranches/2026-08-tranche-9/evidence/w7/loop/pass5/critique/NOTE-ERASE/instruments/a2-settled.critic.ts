/** CRITIC · the settled negative control, confound removed: hold 0 / 800 ms after the age flips
 *  (the settle's own dusk tween is in flight for 350 ms after the flip), hook vs BLOCKED. */
import { test, expect, type Browser } from "@playwright/test";
import { bank, boardReady, armHint, watchLeave, leaveResult, PROTO, PAYLOAD } from "./lib";
const BLOCK = () => {
  const orig = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p: string, v: string | null, pr?: string) {
    if (p === "transition" && v === "none" && pr === "important") return;
    return orig.call(this, p, v, pr);
  };
};
test("critic settled clock", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const blocked of [false, true]) for (const hold of [0, 800]) {
    const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    if (blocked) await c.addInitScript(BLOCK);
    const page = await c.newPage();
    await boardReady(page, PROTO);
    await armHint(page, 0);
    await expect.poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000, intervals: [20] }).toBe("settled");
    if (hold) await page.waitForTimeout(hold);
    const colourAtLeave = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-ink")!).color);
    await watchLeave(page, false);
    await armHint(page, 3);
    rows[`${blocked ? "BLOCKED" : "hook"}.hold${hold}`] = { ...(await leaveResult(page)), colourAtLeave };
    await c.close();
  }
  bank(`critic-settled-${info.project.name}.json`, rows);
});
