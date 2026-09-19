/** CRITIC round 3 — the Enter mechanism, isolated. */
import { test, expect, type Page } from "@playwright/test";
const SOLO = "./?size=3&difficulty=EASY&wire=local";
const say = (o: unknown) => console.log(`CRITIC3|${JSON.stringify(o)}`);
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const state = (page: Page) =>
  page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement | null;
    const l = m?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null;
    return {
      expanded: m?.getAttribute("aria-expanded") ?? null,
      vis: l ? getComputedStyle(l).visibility : null,
      focused: document.activeElement === m,
    };
  });

test("I · Enter on the focused mark, isolated from Tab", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement;
    m.focus();
  });
  say({ case: "focused", ...(await state(page)) });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  say({ case: "after-enter-1", ...(await state(page)) });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  say({ case: "after-enter-2", ...(await state(page)) });
  await page.keyboard.press("Space");
  await page.waitForTimeout(400);
  say({ case: "after-space", ...(await state(page)) });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  say({ case: "enter-while-open", ...(await state(page)) });
  // count the toggles a single Enter produces
  const counts = await page.evaluate(async () => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement;
    let keydown = 0;
    let click = 0;
    m.addEventListener("keydown", (e) => {
      if ((e as KeyboardEvent).key === "Enter") keydown++;
    });
    m.addEventListener("click", () => click++);
    m.focus();
    m.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
    );
    await new Promise((r) => setTimeout(r, 100));
    return { keydown, click };
  });
  say({ case: "synthetic-enter-listener-counts", counts });
});
