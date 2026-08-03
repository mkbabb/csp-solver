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

/**
 * T5-W4 pass 6 — the between-moves acts live behind the door now. A row that reaches Deal,
 * Solve or a chip on the portrait dock must open the sheet first; a row that reads the fold
 * must not. Both are the design, so both are written down rather than assumed.
 */
async function openDrawer(page: Page) {
  await page.locator(".drawer-tab").click();
  await expect(page.locator("#controls-drawer .drawer-case")).toBeVisible();
  await page.waitForTimeout(700); // the Band-D glide's own clock, then settle
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

    // pass 6: the ticket's home is the ONE card, which below 1024 is the drawer's own case.
    // `.mobile-board-width` was the deleted twin's name for the same box.
    const inTicket = page.locator("#controls-drawer .deal-row .difficulty-tally");
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

  /**
   * T5-W4c (pass 5) — THE RULING'S LAST THIRD, GATED IN BOTH DIRECTIONS.
   *
   * "Solve-status is an EVENT, not a REGION" was landed in two limbs — the celebration crests on
   * the board (`:180`) and the tally files with the deal (`:55`) — and the third limb has been
   * carried as a phrase: "the band dissolves". It does not dissolve. It resolves to ONE RESERVED
   * LINE, 51 → 21px, and the reservation is the design, not the residue: the line is what the
   * voice speaks on, and reserving it is why the strip is the SAME HEIGHT before and after the
   * grade instead of collapsing at the crest and growing back after it. A hand that reads
   * "dissolves" and takes the last 21px to zero would re-introduce the reflow this row exists to
   * prevent — and until now nothing would have stopped them, because the gate had a ceiling and
   * no floor. The honest statement is the two-sided one, so the gate is two-sided.
   */
  test("the strip below the board is one reserved line — no more, and no less", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const read = () =>
      page.locator(".board-margin").evaluate((el) => (el as HTMLElement).offsetHeight);

    // CEILING — one voice line at the body rung + its reserved 1.3em. 30px is the ceiling; the
    // tally alone was 30.4px on top of it, so this cannot be met with a second tenant.
    const bare = await read();
    expect(bare).toBeLessThanOrEqual(30);

    // FLOOR — and the floor is only meaningful with the voice SILENT, which is the whole point
    // of a reservation: a strip that is tall because there are words in it is not reserving
    // anything, and would collapse at the crest and grow back after it. The ink is REMOVED, not
    // emptied — MarginNote mounts it under `v-if="text"`, and an emptied span keeps its own
    // line-height, which is how the first cut of this row scored a struck reservation as a pass
    // (21px on a tree with `min-height: 0`). Measured silent on the built dist at this cell:
    // 21px both engines, against `min-height: 1.3em` = 20.8px computed; struck, it reads 0.
    await page.evaluate(() => document.querySelector(".margin-note-ink")?.remove());
    const silent = await read();
    expect(silent).toBeGreaterThanOrEqual(16);

    // CONTROL A: give the strip back a tenant and the same probe must exceed the ceiling.
    await page.evaluate(() => {
      const t = document.querySelector(".difficulty-tally")!.cloneNode(true);
      document.querySelector(".board-margin")!.prepend(t);
    });
    expect(await read()).toBeGreaterThan(30);

    // CONTROL B: take the "dissolve" literally — strike the reservation itself, which is the
    // one declaration holding the silent line open — and the same probe must fall through the
    // floor. This is the direction the phrase invited and the gate never watched.
    await page.evaluate(() => {
      document.querySelector(".board-margin .difficulty-tally")?.remove();
      const block = document.querySelector(".margin-note-block") as HTMLElement | null;
      if (block) block.style.minHeight = "0";
    });
    expect(await read()).toBeLessThan(16);
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
    // T6 mark 16 — the tally is DEBUG ink now, so the covisibility invariant is asserted with
    // the flag seeded on (addInitScript must precede goto). The STRING "true" is load-bearing:
    // useStorage's boolean codec reads anything else — "1" included — as false, silently.
    await page.addInitScript(() => localStorage.setItem("sudoku-debug", "true"));
    await loadSudoku(page);
    await assertCoarse(page);

    const strip = () =>
      page.locator(".board-margin").evaluate((el) => (el as HTMLElement).offsetHeight);
    const beforeStrip = await strip();

    // pass 6: Solve is a between-moves act and lives behind the door on the portrait dock.
    await openDrawer(page);
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
        // pass 6 — THE REFERENT SWAPS, and the office is unchanged. The witness must be a
        // surface still IN FLOW below the board, because that is what a celebration in flow
        // would shove down the page. The controls card left the flow on the portrait dock, so
        // the fold's play-verbs band inherits the job: it sits under the board, it is the last
        // thing in the column, and it is exactly what the player would lose.
        const host = document.querySelector<HTMLElement>("#fold-tools")!;
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
    // pass 6 — THE CONTROL'S TWO ARMS PART COMPANY, and the reason is the fold itself.
    // `ctrlPush` is unchanged in meaning and in magnitude: an in-flow vignette shoves the band
    // under the board by its own height, and that is the defect this row watches. `docGrowth`
    // is CLAMPED, so it reads smaller than the push and cannot carry the same floor.
    //
    // T6 MARK 9 — THE ARITHMETIC IS RE-DERIVED, and its two terms moved in opposite directions.
    // Pass 7 wrote the mechanism correctly and it still holds: the doc is ALREADY exactly one
    // viewport at rest (scrollHeight 664 ≡ innerHeight, slack 0), so nothing in the document
    // absorbs the push. What absorbs is the fold column's own HEADROOM — the gap between
    // `#fold-tools`'s bottom and the viewport floor — and `docGrowth` is `push − headroom`.
    //
    // Mark 9 spent almost all of that headroom on purpose (the band reserved the tongue's 3rem
    // in flow and the whole block centred), so the fold rested within **13.42 chromium / 13.72
    // webkit** of the floor where pass 7 measured 62.84/63.44, and the control arm read
    // **docGrowth 89 both engines against ctrlPush 102.80 chromium / 102.50 webkit**. Layout
    // constants, not samples. T6.2 gives that headroom back — see below.
    //
    // `ctrlPush > 50` IS THE SENSITIVE ARM at this tree, and mark 9's own ablation ladder says
    // why: at a near-zero headroom `docGrowth` tracks `push` almost 1:1, so both arms redden
    // together and the pair's discriminating power sits in the push.
    //   80px → drawn 89.46, push 78.58/78.28, docGrowth 65   both arms PASS
    //   60px → drawn 69.53, push 58.58/58.28, docGrowth 45   both arms PASS
    //   50px → drawn 59.57, push 48.58/48.28, docGrowth 35    `ctrlPush > 50` REDS
    //   40px → drawn 49.61, push 38.58/38.28, docGrowth 25    BOTH arms RED
    expect(c.ctrlPush).toBeGreaterThan(50);

    // T6.2 MARK A — THE ARITHMETIC IS RE-DERIVED AGAIN, and this time HEADROOM is the term that
    // moved. The ribbon gave up mark 9's 3rem tongue reservation (the opener is in flow among
    // the verbs now) and the attribution left the assembly for the head line, so the fold rests
    // **60.42 chromium / 60.72 webkit** above the floor where mark 9 measured 13.42/13.72. The
    // auto margins' free space is twice that, which now EXCEEDS the real vignette's own
    // 102.80/102.50 push: an in-flow celebration is absorbed whole and `docGrowth` reads 0 at
    // this cell, in both engines, on a tree where nothing is wrong. A floor on that number would
    // be a floor on the headroom, so the arm keeps its bite by out-growing the headroom instead
    // of assuming it — which is exactly what the ladder above does, one rung further out. The
    // claim is unchanged: a block that outruns the fold's free space MUST be seen as a scroll.
    await page.addStyleTag({
      content: ".completion-vignette { min-height: 320px !important; }",
    });
    const tall = await grade();
    expect(tall.docGrowth).toBeGreaterThan(30);
  });

  /**
   * T5-W4 PASS 6 · THE COVIS GATE — the drawer comes down to portrait, and the page stops
   * scrolling.
   *
   * The loop's one blocking row, finally written as a bound instead of a figure. For three
   * passes the record carried "trigger (b)" as a measured number with nothing under it: pass 4
   * banked 1,132px at this cell, pass 5 re-derived it unmoved (**pageVh 1.705 chromium /
   * 1.703 webkit** on the built dist, `pass5/f3/rig/out-covis-p5head-*.json`) and priced the
   * decomposition — 132.22 of chrome above the board, 393.19 of board host, and **the controls
   * card, which is the rest**. The gap between 1.705 and 1.000 IS the card. The pass-6 charter
   * spends it the only way that is not a trade: the card moves out of flow into the estate's
   * own drawer surface, and what stays in flow is the board, its one reserved line, and the
   * play verbs.
   *
   * The bound is 1.000 — `docScrollH ≡ innerHeight`, `maxScroll 0` — and it is not a taste:
   * a portrait page whose document is one viewport tall is the whole claim of the row, and any
   * fraction above it is a scroll between the player and a control. It is asserted at THE CASE
   * cell (390×664, the shortest live portrait rung on the ladder) because every taller portrait
   * cell is strictly easier and a bound that only the tall cells meet is a bound that has not
   * been met.
   *
   * BORN RED, and the number is banked: on `abe533c4`'s own built dist this row reads 1.705 /
   * 1.703 — `pass6/land/logs/fold-BASE-{chromium,webkit}.log`, whose nine-cell base arm
   * reproduces pass 5's banked table exactly before any head figure was read.
   *
   * The two controls are the estate's GATE-1 discipline, and they watch opposite directions:
   * a probe that cannot count a scroll would score anything green, and a bound met by parking
   * the controls somewhere unreachable is not the design.
   */
  test("the case: at 390x664 the page is one viewport, and the play verbs are in it", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    const read = () =>
      page.evaluate(() => {
        const doc = document.documentElement;
        const vh = window.innerHeight;
        const tools = document.querySelector("#fold-tools");
        const verbs = [
          ...document.querySelectorAll<HTMLElement>(
            "#fold-tools .icon-btn, .play-controls .icon-btn",
          ),
          // PAINTED, not merely styled: `getClientRects()` is empty when ANY ancestor is
          // display:none, and the verbs are teleported children of `#fold-tools`, so a read of
          // the button's own computed display would score a hidden band as four live targets.
        ].filter((el) => el.getClientRects().length > 0);
        return {
          pageVh: Math.round((doc.scrollHeight / vh) * 1000) / 1000,
          maxScroll: doc.scrollHeight - vh,
          // the verbs are IN the fold, not merely in the document
          verbsInFold: verbs.length,
          verbsBelowFold: verbs.filter(
            (el) => el.getBoundingClientRect().bottom + window.scrollY > vh,
          ).length,
          verbFloorFails: verbs.filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width < 44 || r.height < 44;
          }).length,
          toolsPresent: !!tools,
        };
      });

    const fold = await read();
    // THE BOUND.
    expect(fold.pageVh).toBeLessThanOrEqual(1.0);
    expect(fold.maxScroll).toBe(0);
    // …and the fold is worth having: the four play verbs are in it, each a legal target.
    expect(fold.verbsInFold).toBeGreaterThanOrEqual(4);
    expect(fold.verbsBelowFold).toBe(0);
    expect(fold.verbFloorFails).toBe(0);

    /**
     * T6 MARK 9 · RE-AIMED AT T6.2 MARK A — THE TWO LOCKS, STILL RELATIONAL BY CONSTRUCTION.
     *
     * Mark 9's first lock was ATTACHMENT: `|tongue.bottom − fold.bottom| ≤ 1`, because the
     * tongue rode the CASE and had to hang flush under the verbs across the band's own 3rem
     * reservation. Mark A retires that geometry outright — the opener is a MEMBER of the ribbon
     * now, not a tab attached beneath it — so the lock is re-aimed at the shape that replaced
     * it, and it is three arms because "in the row" is three claims and the old one-liner would
     * have scored a tongue merely dropped inside the band as a pass:
     *   · MEMBERSHIP — `#fold-tools` contains the opener (the DOM claim, and the berth swap's
     *     shut half: the same node is in `#drawer-handle` while the sheet is up).
     *   · ONE LINE   — its top sits within 1px of the first play verb's, which is what makes
     *     five verbs read as one row rather than as a row and a straggler.
     *   · IN BAND    — its bottom stays inside the ribbon's own box, so a re-styled opener can
     *     never grow back out of the band it now belongs to.
     * Plus the coarse floor on both axes, since a verb that cannot be hit is not a verb.
     *
     * CENTRING is unchanged in shape and re-derived in fact: the board's middle within 6% of the
     * viewport's, at both rungs. Measured here on the built dist: 16.36 chromium / 16.67 webkit
     * at 844 (slack 50.64) and 16.36 / 16.66 at 664 (slack 39.84).
     *
     * Both rungs, because they fail differently — a 664-only lock would score a mark that moved
     * nothing as landed. The CONTROL is the row's own, in-run: put the opener back where mark 9
     * had it and MEMBERSHIP and ONE LINE must both red (measured: the tongue's top lands 78px
     * below the verbs' when it hangs at the band's padded floor).
     */
    const ribbon = () =>
      page.evaluate(() => {
        const vh = window.innerHeight;
        const foldEl = document.querySelector("#fold-tools")!;
        const fold = foldEl.getBoundingClientRect();
        const tongueEl = document.querySelector(".drawer-tab")!;
        const tongue = tongueEl.getBoundingClientRect();
        const verb = document.querySelector("#fold-tools .icon-btn")!.getBoundingClientRect();
        const cells = document.querySelector(".board-cells")!.getBoundingClientRect();
        return {
          inFold: foldEl.contains(tongueEl),
          onLine: +Math.abs(tongue.top - verb.top).toFixed(2),
          overBand: +Math.max(0, tongue.bottom - fold.bottom).toFixed(2),
          floorFail: tongue.width < 44 || tongue.height < 44,
          offCentre: +Math.abs(cells.top + cells.height / 2 - vh / 2).toFixed(2),
          slack: +(vh * 0.06).toFixed(2),
        };
      });

    // Taller rung first, so the row ends back at the cell its own name claims.
    for (const height of [844, 664]) {
      await page.setViewportSize({ width: 390, height });
      await expect.poll(async () => (await ribbon()).onLine).toBeLessThanOrEqual(1);
      const m = await ribbon();
      expect(m.inFold).toBe(true);
      expect(m.overBand).toBe(0);
      expect(m.floorFail).toBe(false);
      expect(m.offCentre).toBeLessThanOrEqual(m.slack);
    }

    // CONTROL — mark 9's own berth, restored by hand: the opener leaves the row for the case's
    // handle. Both membership arms must red, or the lock is a decoration.
    await page.evaluate(() => {
      document
        .querySelector("#drawer-handle")!
        .appendChild(document.querySelector(".drawer-tab")!);
    });
    const strayed = await ribbon();
    expect(strayed.inFold).toBe(false);
    expect(strayed.onLine).toBeGreaterThan(1);

    // CONTROL A — the probe must be able to see a scroll. One in-flow block under the board
    // is exactly the shape the card used to be, and the same read must exceed the bound.
    await page.evaluate(() => {
      const spacer = document.createElement("div");
      spacer.style.height = "300px";
      spacer.id = "covis-control-spacer";
      document.querySelector(".app-layout")!.appendChild(spacer);
    });
    const withSpacer = await read();
    expect(withSpacer.pageVh).toBeGreaterThan(1.0);
    expect(withSpacer.maxScroll).toBeGreaterThan(0);
    await page.evaluate(() =>
      document.getElementById("covis-control-spacer")!.remove(),
    );

    // CONTROL B — the other direction: a page can always be made one viewport tall by
    // hiding what is in it. Strike the verbs band and the same read must lose the fold's
    // reason to exist, so a "cure" that parks the controls out of reach cannot pass here.
    await page.addStyleTag({
      content: "#fold-tools, .play-controls { display: none !important; }",
    });
    const stripped = await read();
    expect(stripped.verbsInFold).toBe(0);
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

  /**
   * T5-W4c (pass 5) — THE FOLD OVERFLOW GETS A REAL BOUND.
   *
   * The two rows above are both satisfied at every rung of the cap ladder, including the ones
   * that put a third of the board under the fold: `height ≤ innerHeight` says nothing about
   * WHERE the board sits, and rotation invariance says nothing about how much of it you can
   * see. So the disclosed ~88px cost of the elected rung has been a comment, in a file, with no
   * gate under it — the pass-4 registry's F3-G2, in one sentence.
   *
   * This is that gate. It pins the ELECTION, not a taste: the board's drawn frame may hang
   * below the fold by no more than the chrome standing above it, because the named cure is the
   * masthead (98.58 of the 114.58 above the board at this cell) and a cap that overflows by
   * MORE than the masthead could hand back is a cap the masthead can no longer redeem.
   *
   * T5-W4 pass 6 EXECUTED the masthead hand-back this prose priced (L6-G1 restamp at the
   * seal): at head the shipped rung reads overflow 0 / 0 both engines at the `.board-wrapper`
   * referent — the board sits WHOLE above the fold at 844×390 — and the chrome above it is
   * 16px. The pass-5 figures this block carried (88.58 chromium / 87.98 webkit under a 114.58
   * bound, 26px of headroom) are the PRE-move truth, kept here as the born-RED lineage: the
   * pre-pass-3 tree reads 392.58 and cannot pass; the pre-move tree read 88.58 and passed on
   * headroom; the moved tree passes on zero. The gate's discriminating power now rides the
   * negative control below, not the shipped arm's slack (0 ≤ 16 is near-vacuous by itself,
   * disclosed rather than discovered).
   *
   * The referent is named in the assertion because the record carried three numbers for this
   * one quantity, from three unnamed boxes, for a whole pass.
   */
  test("the board hangs no further below the fold than the chrome above it", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertCoarse(page);

    // Both quantities off one settled read: the drawn frame's overflow, and the chrome that
    // stands above the board and could be handed back to pay for it.
    const read = () =>
      page.evaluate(() => {
        const frame = document.querySelector(".board-wrapper")!.getBoundingClientRect();
        const host = document
          .querySelector(".board-peek-host")!
          .getBoundingClientRect();
        return {
          overflow: +Math.max(
            0,
            frame.bottom + window.scrollY - window.innerHeight,
          ).toFixed(2),
          chromeAbove: +(host.top + window.scrollY).toFixed(2),
        };
      });

    const shipped = await read();
    expect(shipped.chromeAbove).toBeGreaterThan(0);
    expect(shipped.overflow).toBeLessThanOrEqual(shipped.chromeAbove);

    // CONTROL 1 — the rung one step ABOVE the election (`100dvh`, the whole short edge). It is
    // the cheapest drift available and the gate must still hold, or the bound is so tight it
    // would red on a legitimate re-election rather than on a defect.
    await page.addStyleTag({
      content: ".board-shell { max-width: 100dvh !important; }",
    });
    await page.waitForTimeout(400);
    const wholeEdge = await read();
    expect(wholeEdge.overflow).toBeGreaterThan(shipped.overflow);
    expect(wholeEdge.overflow).toBeLessThanOrEqual(wholeEdge.chromeAbove);

    // CONTROL 2 — the tree this rung replaced. With no height arm at all the board hangs
    // ~392px below a 390px fold, four times the chrome that could redeem it, and the same
    // probe MUST red. A bound that the pre-cure tree also satisfies is a decoration.
    await page.addStyleTag({ content: ".board-shell { max-width: none !important; }" });
    await page.waitForTimeout(400);
    const bare = await read();
    expect(bare.overflow).toBeGreaterThan(bare.chromeAbove);
  });
});
