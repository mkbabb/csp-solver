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

  /**
   * The solve tally ("0 backtracks — 1ms") is one string with two possible mounts: the
   * teacher's-margin vignette (≥1280, undocked) and the strip's reserved line. Exactly one
   * of them paints it, at every width. The pass-3 close had BOTH standing down below 1280 —
   * the vignette's `.vignette-meta` was `display:none` outside the margin rung and the strip
   * went sr-only whole on the gold path — so a solved phone printed the line nowhere. This
   * row solves a real board and counts the paints; the count is the gate in both directions,
   * so a fix that prints it twice fails the same assertion as one that prints it never.
   */
  test("a solved board prints its tally exactly once, at every width", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const strip = () =>
      page.locator(".board-margin").evaluate((el) => (el as HTMLElement).offsetHeight);
    const beforeStrip = await strip();

    await page.locator('button[aria-label="Solve puzzle"]').click();
    await expect(page.locator(".board-wrapper")).toHaveClass(
      /solve-(success|failure)/,
      {
        timeout: 20000,
      },
    );
    await expect(page.locator(".completion-vignette")).toBeVisible();

    /**
     * Every visible, non-empty rendering of the tally line on the page.
     *
     * The area is intersected against every CLIPPING ancestor, which is the whole difficulty:
     * the sr-only pattern this strip uses (`width:1px; overflow:hidden; clip-path:inset(50%)`)
     * leaves the child's own rect at full size, so a naive width read counts an announced-only
     * string as a painted one — and would have scored the exact defect this row exists for as
     * a pass.
     */
    const paints = () =>
      page.evaluate(() =>
        [...document.querySelectorAll(".vignette-meta, .margin-note-meta")]
          .filter((el) => {
            if ((el.textContent ?? "").trim().length === 0) return false;
            const r = el.getBoundingClientRect();
            let [x1, y1, x2, y2] = [r.left, r.top, r.right, r.bottom];
            for (let a = el.parentElement; a; a = a.parentElement) {
              const cs = getComputedStyle(a);
              if (cs.display === "none" || cs.visibility === "hidden") return false;
              if (cs.overflow !== "visible" || cs.clipPath !== "none") {
                const ar = a.getBoundingClientRect();
                x1 = Math.max(x1, ar.left);
                y1 = Math.max(y1, ar.top);
                x2 = Math.min(x2, ar.right);
                y2 = Math.min(y2, ar.bottom);
              }
            }
            return Math.max(0, x2 - x1) * Math.max(0, y2 - y1) > 16;
          })
          .map((el) => (el.closest(".completion-vignette") ? "vignette" : "strip")),
      );

    expect(await paints()).toEqual(["strip"]);
    // …and the grade did not move the strip it prints in: the line was reserved before the
    // solve and the voice stands down INTO it, rather than taking the block out of flow.
    expect(await strip()).toBe(beforeStrip);
    expect(await strip()).toBeLessThanOrEqual(30);

    // The other regime, same solve: at the margin rung the vignette has room for the tally
    // and takes it, and the strip must not print a second copy.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    expect(await paints()).toEqual(["vignette"]);

    // CONTROL: the probe must be able to count a second paint. Put one back by hand.
    await page.evaluate(() => {
      const src = document.querySelector(".vignette-meta")!;
      const clone = src.cloneNode(true) as HTMLElement;
      clone.className = "margin-note-meta";
      document.querySelector(".margin-note-block")!.appendChild(clone);
    });
    expect((await paints()).length).toBe(2);
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

  // The claim is exactly this and no more: the board is not LARGER than the screen it is
  // drawn on. It is not "the whole board is above the fold" — at 844×390 the masthead spends
  // 98.58 of the 390, so the board's bottom lands at 478.58 and the last two rows are a
  // scroll away. That cost is ledgered at the cap's site in GameBoard, with the 88.58px it
  // would take to buy it back.
  test("a landscape phone gets a board no larger than the screen it is drawn on", async ({
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

  /**
   * The price of that fit, gated. A cap that makes the board fit by shrinking the CELL is not
   * a cure — pass 3's `100dvh − 10rem` bought the fit with a 25.11px cell, 38% under what the
   * same phone shows in portrait. The bound is rotation invariance: the board is the SHORT
   * EDGE minus the page's own gutter, so turning the phone cannot change the cell. (44px, the
   * estate's coarse floor, is a control tap-target rule and is unreachable here by any cap —
   * a 9×9 at 44px is a 400px board and this viewport is 390 tall.)
   */
  test("turning the phone does not shrink the cell a finger has to hit", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    // Scoped to the LIVE board's cell grid, and settled: `.sudoku-cell` also matches the
    // gallery's card previews, and a cell read before the grid's draw-in lays out reports a
    // couple of px (2.24 on the first attempt at this row) — a number that would have made
    // any cap look like a catastrophe.
    const cell = () =>
      page
        .locator(".board-cells .sudoku-cell")
        .first()
        .evaluate((el) => +el.getBoundingClientRect().width.toFixed(2));
    // Settled = two reads 250ms apart that agree. A single `> 10` poll can catch the grid
    // mid-draw-in and bank an intermediate box (28.06 where the built dist rests at 25.11).
    const settled = async () => {
      let prev = -1;
      for (let i = 0; i < 40; i++) {
        const now = await cell();
        if (now > 10 && Math.abs(now - prev) < 0.05) return now;
        prev = now;
        await page.waitForTimeout(250);
      }
      throw new Error("the board never settled to a stable cell size");
    };

    const landscape = await settled();
    await page.setViewportSize({ width: 390, height: 844 }); // the same device, rotated
    await page.waitForTimeout(400);
    const portrait = await settled();

    expect(landscape).toBeCloseTo(portrait, 1);

    // CONTROL: put pass 3's rung back — the cap that allows 10rem for chrome that is not
    // beside the board below 1024 — and the same probe must see the rotation cost cells.
    await page.setViewportSize(LAND.viewport);
    await page.waitForTimeout(400);
    await page.addStyleTag({
      content: ".board-shell { max-width: calc(100dvh - 10rem) !important; }",
    });
    await page.waitForTimeout(400);
    expect(await settled()).toBeLessThan(portrait - 10);
  });
});
