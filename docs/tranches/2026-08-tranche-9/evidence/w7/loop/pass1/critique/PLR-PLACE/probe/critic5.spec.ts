/**
 * PLR-PLACE pass-1 CRITIQUE probe 5 — THE RING IS AN INSTRUMENT ARTIFACT.
 *
 * The prototype's G2/G3 rig opens the sheet with `el.click()` from inside `page.evaluate`, a
 * PROGRAMMATIC click that moves no focus. A real press — mouse or key — takes focus out of the
 * grid, `GameBoard.onGridFocusout` calls `noteFocus(null)`, and `selfCursor` (the ring's only
 * source) goes null before the sheet has finished opening.
 *
 * Same page, same room, same cell: open it both ways and count `.chart-self`.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT = join(__dirname, "..", "logs");
const MARK = "[data-player-mark]";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT5|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
};
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const openProgrammatically = (p: Page) =>
  p.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement;
    m.click();
  });
async function realPress(p: Page) {
  const marks = p.locator(MARK);
  const n = await marks.count();
  for (let i = 0; i < n; i++)
    if (await marks.nth(i).isVisible()) {
      await marks.nth(i).click();
      return;
    }
}
const shut = async (p: Page) => {
  await p.mouse.click(640, 740);
  await p.waitForTimeout(400);
};

test("CRITIC 5 — programmatic click vs a real press", async ({ browser }, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await a
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .first()
    .click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await b.locator(".sudoku-cell").nth(20).click();
  await a.bringToFront();

  // YOUR cell, exactly as the paint rig sets it
  await a.locator(".sudoku-cell").nth(60).click();
  await a.waitForTimeout(1200);

  await openProgrammatically(a);
  await a.waitForTimeout(900);
  rec("prog.ring", await a.locator("[data-lobby] .chart-self").count());
  rec("prog.dots", await a.locator("[data-lobby] .chart-dot").count());
  rec(
    "prog.active",
    await a.evaluate(() => (document.activeElement as HTMLElement)?.className || "none"),
  );
  await shut(a);

  await a.locator(".sudoku-cell").nth(60).click();
  await a.waitForTimeout(1200);
  await realPress(a);
  await a.waitForTimeout(900);
  rec("real.ring", await a.locator("[data-lobby] .chart-self").count());
  rec("real.dots", await a.locator("[data-lobby] .chart-dot").count());
  rec(
    "real.active",
    await a.evaluate(() => (document.activeElement as HTMLElement)?.className || "none"),
  );

  writeFileSync(join(OUT, `critic5-${eng}.json`), JSON.stringify(bank, null, 2));
});
