import { test, expect, type Page } from "@playwright/test";

/**
 * T4-P1 · MARK 6 — the mobile solve-status band dissolves, and the board fits the screen.
 *
 * The band below the board carried three tenants and paid for all of them in FLOW below 1024,
 * where the page is a single column and every pixel under the work is a pixel between the
 * player and the controls:
 *   · the DIFFICULTY tally — permanent, on every board, 30.4px
 *   · the backtracks/ms line — a second stanza under the voice, on every solve
 *   · the completion vignette — 109px of star + verdict, arriving at the grade and shoving
 *     the controls card down the page at the one moment the reader is looking elsewhere
 * Mark 6 sends the tally to the ticket (it is the deal's receipt), demotes the tally line to
 * the voice's own line, and crests the celebration ON the board — the corner-press sticker
 * the row regime has used since T3-W12. What is left below the board is the voice, and the
 * paper note when the machinery breaks.
 *
 * The fourth row is the `<lg` board rung F3's pass-1 critique named as required and left
 * undesigned: below 1024 the shell had a WIDTH bound and no height bound, so a landscape
 * phone was asked to render a 672px board inside a 390px viewport.
 *
 * EVERY row carries its control INSIDE the run — the estate's GATE-1 discipline. A gate that
 * cannot be shown to fail is a decoration.
 */

const COARSE = {
  viewport: { width: 390, height: 664 },
  hasTouch: true,
  isMobile: true,
};
const LAND = { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true };

async function loadSudoku(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}

/** Three independent observables, asserted before any coarse number is banked. */
async function assertCoarse(page: Page) {
  const r = await page.evaluate(() => ({
    mqCoarse: matchMedia("(pointer: coarse)").matches,
    mqHover: matchMedia("(hover: hover)").matches,
    stacked: !matchMedia("(min-width: 1024px)").matches,
  }));
  expect(r).toEqual({ mqCoarse: true, mqHover: false, stacked: true });
}

test.describe("mark 6 — the band dissolves", () => {
  test.use(COARSE);

  test("the tally files with the deal, and the strip it left can still be seen", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const inTicket = page.locator(".mobile-board-width .deal-row .difficulty-tally");
    await expect(inTicket).toHaveCount(1);
    // The word in front of the glyph is the well's, not the strip's: `Difficulty` is an
    // eyebrow two rows up, so the receipt says what it is instead of saying that twice.
    await expect(inTicket.locator(".dt-label")).toHaveText("dealt");
    // The honesty spine is untouched by the move — the tier still names itself to AT.
    expect(await inTicket.getAttribute("aria-label")).toMatch(/.+/);
    await expect(page.locator(".board-margin .difficulty-tally")).toHaveCount(0);

    // CONTROL: the probe must be able to see a tally under the board. Put one back.
    await page.evaluate(() => {
      const t = document.querySelector(".difficulty-tally")!.cloneNode(true);
      document.querySelector(".board-margin")!.prepend(t);
    });
    await expect(page.locator(".board-margin .difficulty-tally")).toHaveCount(1);
  });

  test("the strip below the board is one reserved line", async ({ page }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const read = () =>
      page.locator(".board-margin").evaluate((el) => (el as HTMLElement).offsetHeight);

    // One voice line at the body rung + its reserved 1.3em. 30px is the ceiling; the tally
    // alone was 30.4px on top of it, so this floor cannot be met with a second tenant.
    const bare = await read();
    expect(bare).toBeLessThanOrEqual(30);

    // CONTROL: give the strip back a tenant and the same probe must exceed the ceiling.
    await page.evaluate(() => {
      const t = document.querySelector(".difficulty-tally")!.cloneNode(true);
      document.querySelector(".board-margin")!.prepend(t);
    });
    expect(await read()).toBeGreaterThan(30);
  });

  test("the grade crests on the board — the celebration never moves the page", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const grade = () =>
      page.evaluate(() => {
        const doc = document.scrollingElement || document.documentElement;
        const v = document.querySelector<HTMLElement>(".completion-vignette")!;
        const host = document.querySelector<HTMLElement>(".mobile-board-width")!;
        const before = { doc: doc.scrollHeight, top: host.getBoundingClientRect().top };
        const prior = v.style.display;
        v.style.display = "block"; // exactly what `celebrating` does — v-show writes display
        void v.offsetHeight;
        const r = v.getBoundingClientRect();
        const out = {
          position: getComputedStyle(v).position,
          docGrowth: doc.scrollHeight - before.doc,
          ctrlPush: +(host.getBoundingClientRect().top - before.top).toFixed(2),
          rightOverflow: +(r.right - document.documentElement.clientWidth).toFixed(2),
        };
        v.style.display = prior;
        return out;
      });

    const g = await grade();
    expect(g.position).toBe("absolute");
    expect(g.docGrowth).toBe(0);
    expect(g.ctrlPush).toBe(0);
    // A sticker that hangs off the page mints a horizontal scroll; it must land inside.
    expect(g.rightOverflow).toBeLessThanOrEqual(0);

    // CONTROL: put the vignette back in flow and the same probe must see the page move.
    await page.addStyleTag({
      content: ".completion-vignette { position: static !important; }",
    });
    const c = await grade();
    expect(c.docGrowth).toBeGreaterThan(50);
    expect(c.ctrlPush).toBeGreaterThan(50);
  });
});

test.describe("the board fits the viewport it is drawn in", () => {
  test.use(LAND);

  test("a landscape phone gets a board it can see, not one it must scroll", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const read = () =>
      page.evaluate(() => {
        const b = document.querySelector(".board-wrapper")!.getBoundingClientRect();
        return { h: +b.height.toFixed(2), vh: window.innerHeight };
      });

    const fitted = await read();
    expect(fitted.h).toBeLessThanOrEqual(fitted.vh);

    // CONTROL: strip the height arm — the exact shape of the tree before this rung — and the
    // board must overflow the screen it is drawn on.
    await page.addStyleTag({ content: ".board-shell { max-width: none !important; }" });
    const bare = await read();
    expect(bare.h).toBeGreaterThan(bare.vh);
  });
});
