/**
 * PLR-SELF pass 4 — the DIST half (gap 6): the filter census on the SERVED BUILD with the
 * head's sheets open, both regimes, and the tap floor read on the shipped artifact.
 *
 * The counting rule is `filterBudget.ts`'s, restated here rather than imported so this probe
 * reads the page and nothing else: an element counts when its OWN computed `filter` is not
 * `none` and its OWN computed `display` is not `none`.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "/?size=3&difficulty=EASY";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page
    .locator(".sudoku-cell .glyph-svg")
    .first()
    .waitFor({ state: "attached", timeout: 60000 });
  await page.waitForTimeout(600);
}

const countFilters = (page: Page) =>
  page.evaluate(() => {
    let n = 0;
    for (const el of document.querySelectorAll<HTMLElement>("*")) {
      const s = getComputedStyle(el);
      if (s.filter !== "none" && s.display !== "none") n++;
    }
    return n;
  });

const mark = (p: Page) => p.locator("[data-player-mark]:visible");

test("G3.6 — the census with the head's sheets open, on the built dist", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  const shut = await countFilters(page);

  // The INCUMBENT card first, as the control: whatever the head's other sheet costs, it is not
  // this family's.
  await page.locator(".attribution-trigger:visible").first().hover();
  await page.waitForTimeout(400);
  const card = await countFilters(page);

  await page.mouse.move(640, 600);
  await page.waitForTimeout(400);
  await mark(page).click();
  await page.waitForTimeout(400);
  const lobbyOpen = await countFilters(page);
  const box = await mark(page).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return [+r.width.toFixed(3), +r.height.toFixed(3)];
  });

  console.log(
    `[${info.project.name}] DIST-CENSUS shut=${shut} card=${card} lobby=${lobbyOpen} mark=${JSON.stringify(box)}`,
  );
  expect(shut).toBe(9);
  expect(card).toBe(9);
  expect(lobbyOpen).toBe(9);
});

test("the census under reduce, on the built dist", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const shut = await countFilters(page);
  await mark(page).click();
  await page.waitForTimeout(400);
  const open = await countFilters(page);
  console.log(`[${info.project.name}] DIST-CENSUS-PRM shut=${shut} lobby=${open}`);
  expect(shut).toBe(9);
  expect(open).toBe(9);
  await ctx.close();
});

test("the tap floor on the shipped artifact, coarse and witnessed", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const read = await page.evaluate(() => {
    const m = [...document.querySelectorAll<HTMLElement>("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().height > 0,
    )!;
    const r = m.getBoundingClientRect();
    return {
      coarse: matchMedia("(pointer: coarse)").matches,
      box: [+r.width.toFixed(3), +r.height.toFixed(3)],
      minW: getComputedStyle(m).minWidth,
      minH: getComputedStyle(m).minHeight,
    };
  });
  console.log(`[${info.project.name}] DIST-TAPFLOOR ${JSON.stringify(read)}`);
  expect(read.coarse).toBe(true);
  expect(read.box[0]).toBeGreaterThanOrEqual(44);
  expect(read.box[1]).toBeGreaterThanOrEqual(44);
  // CONSUMED BARE: the floor resolves because `.page-root` declares it, not because this rule
  // carries a copy of the number.
  expect(read.minW).toBe("44px");
  await ctx.close();
});
