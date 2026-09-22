import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 4 · the mark under a TAP: does it open, and does the cell keep focus?
// Arm 1: the product as built. Arm 2 (the ablation): the mark's own pointerdown handler is
// shadowed by a capture listener that stops it, so `.prevent` never runs. Arm 3 (the control):
// the incumbent @mbabb trigger, which has no pointerdown handler at all.
async function boot(browser: any, name: string) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true });
  const a: Page = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await a.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 });
  await a.waitForTimeout(800);
  await a.locator(".sudoku-cell input").nth(10).tap();
  return { ctx, a, name };
}
const focusName = (a: Page) => a.evaluate(() => (document.activeElement as HTMLElement)?.getAttribute("aria-label") ?? document.activeElement?.tagName);
test("touch seam", async ({ browser }) => {
  const out: Record<string, unknown> = { engine: test.info().project.name };
  for (const arm of ["built", "ablated", "control"]) {
    const { ctx, a } = await boot(browser, arm);
    const before = await focusName(a);
    if (arm === "ablated") {
      await a.evaluate(() => {
        const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => (e as HTMLElement).getBoundingClientRect().width > 0)!;
        m.addEventListener("pointerdown", (e) => e.stopImmediatePropagation(), { capture: true });
        // capture on the target itself runs before Vue's bubble-phase listener on the same node
      });
    }
    await a.evaluate(() => { const w = window as any; w.__ev = []; for (const k of ["pointerdown","click"]) document.addEventListener(k, (e: any) => w.__ev.push(`${k}:${e.pointerType ?? ""}:${e.defaultPrevented}`), false); });
    const target = arm === "control" ? a.locator(".attribution-trigger:visible, button[aria-label='Show attribution card']:visible").first() : a.locator("[data-player-mark]:visible");
    await target.tap();
    await a.waitForTimeout(400);
    out[arm] = { before, after: await focusName(a), expanded: await target.getAttribute("aria-expanded"), ev: await a.evaluate(() => (window as any).__ev) };
    await ctx.close();
  }
  console.log(JSON.stringify(out));
  expect(1).toBe(1);
});
