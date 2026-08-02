import { test, expect, devices, type Page } from "@playwright/test";

// T4-WM §1 — the mobile-affordances home. Two charges live here:
//   1. NATIVE BOUNDED ENTRY (the pad abrogation): with the custom keypad excised, the per-cell
//      opacity-0 `<input>` is the sole entry surface on every pointer. On a coarse device it must
//      raise the OS numeric keypad (`inputmode=numeric`, born-RED — the abrogated pad forced
//      `inputmode=none`), carry the iOS-congruence attribute set, clear the 16px zoom floor, and
//      still accept two-digit values at 16×16.
//   2. The coarse ControlPanel affordances (peek washi / icon sublabels / Clear confirm) — RE-HOMED
//      from the retired e2e/digit-pad.spec.ts test 3 (they were never pad-specific; they probe the
//      mobile control card, which survives the abrogation intact).
//
// Touch emulation: a real phone descriptor (isMobile + hasTouch) makes BOTH engines match
// `(pointer: coarse)` — the exact media the coarse branch keys on. THE ENGINE IS NOT PINNED HERE
// (T5-W1 1.10 / CH-56): the old `browserName/defaultBrowserType: "chromium"` pin existed because
// the descriptor defaults to webkit and the then chromium-only CI lane installed none; CI installs
// webkit now, so the engine comes from the PROJECT and both of playwright.config.ts's projects
// claim this file. The descriptor's own `defaultBrowserType: "webkit"` is inert under them —
// `browserName`'s fixture default IS `defaultBrowserType`, but each project overrides `browserName`
// outright and an explicit project value outranks a file-level default (measured, not assumed:
// evidence/w1/pw-residue.txt §1). Nothing below reads the engine.
test.use(devices["iPhone 13"]);

/** The dev-only FilterTuner toggle (env-gated OUT of prod builds) floats over the mobile panel
 *  and can intercept taps — dev chrome, not product surface, so the probe hides it. */
async function hideDevChrome(page: Page) {
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
}

/**
 * T5-W4 pass 6 — THE CARD IS BEHIND A DOOR ON THE PORTRAIT DOCK, and that is the design rather
 * than an obstacle to route around. The fold keeps the board, its reserved line and the four
 * play verbs; deal / clear / solve / share / every selector are BETWEEN-MOVES acts and live in
 * the sheet. So a row that probes the card opens it first, and a row that probes the fold must
 * not — which is why this is a named helper and not a blanket `beforeEach`.
 */
async function openDrawer(page: Page) {
  await page.locator(".drawer-tab").tap();
  await expect(page.locator("#controls-drawer .drawer-case")).toBeVisible();
  await page.waitForTimeout(700); // the Band-D glide's own clock, then settle
}

async function loadSudoku(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await hideDevChrome(page);
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  // Grid draw-in → boil steady-state handoff: `.is-active` exists only once the grid finished
  // drawing in, so it's the board's settle. Stays attached in both baked & filtered steady forms.
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 15000,
  });
}

/** Index of the first blank cell (no glyph). */
async function firstBlank(page: Page, cellSel: string): Promise<number> {
  const idx = await page.evaluate((sel) => {
    const cells = document.querySelectorAll(sel);
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].querySelector(".glyph-svg")) return i;
    }
    return -1;
  }, cellSel);
  expect(idx).toBeGreaterThanOrEqual(0);
  return idx;
}

function cellInput(page: Page, idx: number) {
  return page.locator(".board-cells input").nth(idx);
}

/** Drive a real press-and-hold on a board cell (T4-WM §3): a pointerdown that survives the ~450ms
 *  recognizer opens the candidate glimpse (the engine-domains pencil marks, marks-only — no answer
 *  laminate), and pointerup lifts it. Pointer Events only, exactly as the shipped gesture: no
 *  `contextmenu` (it never fires on iOS), no keyboard, no laminate. The marks render globally where
 *  propagation bit, so the `.pencil-marks` count is the honest peek signal. */
async function longPressPeekOpensThenClears(page: Page, cellSel: string) {
  const marks = page.locator(".board-cells .pencil-marks");
  await expect(marks).toHaveCount(0); // never ambient — nothing before the hold

  const blank = await firstBlank(page, cellSel);
  const cell = page.locator(cellSel).nth(blank);
  const box = (await cell.boundingBox())!;
  const clientX = box.x + box.width / 2;
  const clientY = box.y + box.height / 2;

  await cell.dispatchEvent("pointerdown", { clientX, clientY, pointerId: 1 });
  // The recognizer holds ~450ms real-time, then the peek propagates (worker round-trip) — poll
  // through both. A stationary hold never trips the slop, so the marks arrive.
  await expect
    .poll(() => marks.count(), { timeout: 8000 })
    .toBeGreaterThan(0);

  await cell.dispatchEvent("pointerup", { clientX, clientY, pointerId: 1 });
  // Release dismisses it — the marks can never outlive the gesture.
  await expect.poll(() => marks.count(), { timeout: 5000 }).toBe(0);
}

/** The iOS-congruence attribute set + the numeric keypad hint, asserted on a live cell input. */
async function expectNativeEntryShape(input: ReturnType<typeof cellInput>) {
  await expect(input).toHaveAttribute("type", "text");
  await expect(input).toHaveAttribute("inputmode", "numeric"); // born-RED: the pad forced 'none'
  await expect(input).toHaveAttribute("pattern", "[0-9]*");
  await expect(input).toHaveAttribute("autocorrect", "off");
  await expect(input).toHaveAttribute("autocapitalize", "off");
  await expect(input).toHaveAttribute("spellcheck", "false");
  await expect(input).toHaveAttribute("enterkeyhint", "done");
  await expect(input).toHaveAttribute("maxlength", /\d/); // board-sized; present, not absent
  // The 16px zoom floor: mobile Safari zooms a focused input under 16px. Structural (the input is
  // opacity-0), asserted here rather than traded for a11y-hostile `maximum-scale`.
  const fontPx = await input.evaluate((el) =>
    parseFloat(getComputedStyle(el).fontSize),
  );
  expect(fontPx).toBeGreaterThanOrEqual(16);
}

test("native bounded entry (sudoku 9×9): coarse cell raises the numeric keypad, iOS-congruent, 16px floor", async ({
  page,
}) => {
  await loadSudoku(page);
  expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);

  const blank = await firstBlank(page, ".sudoku-cell");
  const input = cellInput(page, blank);
  await input.tap();
  await expectNativeEntryShape(input);

  // The write path is the input's own — a typed digit commits through onCellUpdate.
  await page.keyboard.type("5");
  await expect(input).toHaveValue("5");
});

test("native bounded entry (sudoku 16×16): two-digit values 10–16 enter whole", async ({
  page,
}) => {
  await loadSudoku(page, "?size=4&difficulty=EASY");

  const blank = await firstBlank(page, ".sudoku-cell");
  const input = cellInput(page, blank);
  await input.tap();
  await expectNativeEntryShape(input);

  // Two glyphs of width: typing two digits commits the composite value (handleInput slices to the
  // 2-digit clamp), and it survives the round-trip through the board's write path.
  await page.keyboard.type("12");
  await expect(input).toHaveValue("12");
});

test("native bounded entry (futoshiki twin): coarse cell raises the numeric keypad, iOS-congruent", async ({
  page,
}) => {
  await page.goto("./?game=futoshiki");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await hideDevChrome(page);
  await expect
    .poll(() => page.locator(".futoshiki-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 15000,
  });

  const blank = await firstBlank(page, ".futoshiki-cell");
  const input = cellInput(page, blank);
  await input.tap();
  await expectNativeEntryShape(input);

  await page.keyboard.type("2");
  await expect(input).toHaveValue("2");
});

test("touch play tools (T4-WM §2): undo / redo / hint tappable at ≥44px, wired, and no sticky hover", async ({
  page,
}) => {
  await loadSudoku(page);
  // pass 6 — the play verbs left the card for the FOLD. The scope moves with them, and it
  // moves to `#fold-tools` rather than to a bare page query on purpose: the point of the band
  // is that these four are reachable with the sheet SHUT, and a page-wide locator would score
  // them green from inside a closed drawer.
  const panel = page.locator("#fold-tools");
  await expect(panel).toBeVisible();

  const undo = panel.getByRole("button", { name: "Undo last move" });
  const redo = panel.getByRole("button", { name: "Redo move" });
  const hint = panel.getByRole("button", {
    name: "Reveal a hint in the selected cell",
  });

  // All three present, cleared of the 44px coarse floor, with written sublabels (born-RED:
  // hint was H-key-only, undo/redo ⌘Z-only, the legend documenting them display:none on coarse).
  for (const [btn, label] of [
    [undo, "Undo"],
    [redo, "Redo"],
    [hint, "Hint"],
  ] as const) {
    const box = (await btn.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
    await expect(btn.locator(".icon-sublabel")).toHaveText(label);
  }

  // Wired end-to-end: a typed value round-trips through the Undo then Redo buttons (the acts
  // the keyboard reaches by ⌘Z / ⇧⌘Z, now tappable). The write path is the cell's own.
  const blank = await firstBlank(page, ".sudoku-cell");
  const input = cellInput(page, blank);
  await input.tap();
  await page.keyboard.type("5");
  await expect(input).toHaveValue("5");
  await undo.tap();
  await expect(input).toHaveValue("");
  await redo.tap();
  await expect(input).toHaveValue("5");

  // The icon-btn hover paint is fenced behind @media(hover:hover): a coarse tap leaves the
  // background transparent, not the stuck accent the pre-recut grammar left (r2 §4).
  await undo.tap();
  const bg = await undo.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe("rgba(0, 0, 0, 0)");
});

test("hint two-press by touch (T4-W7): first tap names the technique, second inks the digit", async ({
  page,
}) => {
  await loadSudoku(page);
  // pass 6: the hint is a PLAY verb, so it lives in the fold with the sheet shut.
  const hint = page
    .locator("#fold-tools")
    .getByRole("button", { name: "Reveal a hint in the selected cell" });

  const blank = await firstBlank(page, ".sudoku-cell");
  await cellInput(page, blank).tap();

  // First tap — reasoning, not the answer: the margin NAMES the cheapest single and the
  // becauseCells light in the peek-laminate tone. No digit inks yet.
  await hint.tap();
  await expect(page.locator(".margin-note")).toContainText("single");
  await expect(page.locator(".sudoku-cell.is-because").first()).toBeVisible();

  // Second tap — the digit inks in through the reveal draw-in: one more solver-ink glyph. The
  // two-press hint rides the button; the cell-hold long-press peek gesture is untouched.
  const filledBefore = await page.locator(".sudoku-cell .glyph-svg").count();
  await hint.tap();
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 })
    .toBe(filledBefore + 1);
});

test("attribution opens on a single tap (T4-WM §2): the coarse focusin+click double-fire no longer nets closed", async ({
  page,
}) => {
  await loadSudoku(page);
  const trigger = page.locator(".mobile-attribution .attribution-trigger");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.tap();
  // At HEAD the focusin-open + click-toggle cancelled on a touch tap (r2 §3) — aria-expanded
  // stayed false. The focus-open half now stands down on coarse, so the tap opens the card.
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".mobile-attribution .hover-card.is-open")).toBeVisible();
});

test("long-press peek (T4-WM §3, sudoku): a hold on a cell opens the candidate glimpse; release clears it", async ({
  page,
}) => {
  await loadSudoku(page);
  await longPressPeekOpensThenClears(page, ".sudoku-cell");
});

test("long-press peek (T4-WM §3, futoshiki twin): a hold on a cell opens the candidate glimpse; release clears it", async ({
  page,
}) => {
  await page.goto("./?game=futoshiki");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await hideDevChrome(page);
  await expect
    .poll(() => page.locator(".futoshiki-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 15000,
  });
  await longPressPeekOpensThenClears(page, ".futoshiki-cell");
});

test("coarse affordances: persistent peek washi on a ≥44px target, icon sublabels, Clear confirm beat", async ({
  page,
}) => {
  await loadSudoku(page);

  /**
   * T5-W4 pass 6 — THE PEEK AFFORDANCE MOVED, AND THE ROW MOVES WITH IT, IN BOTH DIRECTIONS.
   *
   * On the portrait dock the hold-to-peek divider rides INSIDE the raised case, so a held peek
   * would lay the answer key over a board the sheet has just covered: the gesture would still
   * fire and would still show nothing worth seeing. The washi promised a hold that could no
   * longer do its work, so it stands down with it, and the gesture rehomes to a peek CHIP in
   * the fold — beside the play verbs, on the same 350ms/10px recognizer, with the board fully
   * uncovered.
   *
   * Both halves are asserted, because either alone would let the other rot: the chip exists and
   * clears the floor, AND the divider no longer announces or accepts a hold.
   */
  const chip = page.locator("#fold-tools .peek-chip");
  await expect(chip).toBeVisible();
  await expect(chip).toHaveText("peek"); // its visible word IS its accessible name
  const chipBox = (await chip.boundingBox())!;
  expect(chipBox.height).toBeGreaterThanOrEqual(44);
  expect(chipBox.width).toBeGreaterThanOrEqual(44);

  // Now the card, which is behind the door.
  await openDrawer(page);
  const panel = page.locator(".mobile-control-panel");

  // The divider's hold has STOOD DOWN: it keeps its separator office and its ruled line, takes
  // no pointer events, and its name no longer promises a hold it cannot honour.
  const peek = panel.locator(".peek-hold-surface");
  await expect(peek).toHaveAttribute("role", "separator");
  await expect(peek.locator(".washi-label")).toHaveCount(0);
  expect(await peek.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  expect(await peek.getAttribute("aria-label")).not.toMatch(/hold/i);

  // The four icon actions carry written names on coarse pointers (T4-WU/U2: the dice re-homed
  // to "Deal" in the staged zone — still within the mobile panel, still writing its name).
  for (const label of ["Deal", "Clear", "Solve", "Share"]) {
    await expect(
      panel.locator(".icon-sublabel", { hasText: label }).first(),
    ).toBeVisible();
  }

  // T4-WU/U3 — Clear is now DIRTY-GATED (born-RED at base: `onClear` armed unconditionally, even on
  // a blank/pristine board). PRISTINE first: a freshly-loaded board has an empty undo depth (the
  // mount deal is off-log), so ONE Clear tap wipes it instantly — no "sure?" arm, no confirm.
  const clearBtn = panel.getByRole("button", { name: /clear the board/i });
  const givenCount = await page.locator(".sudoku-cell .glyph-svg").count();
  expect(givenCount).toBeGreaterThan(0);
  await clearBtn.tap();
  await expect(panel.locator(".icon-sublabel", { hasText: "sure?" })).toHaveCount(0); // no arm pristine
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 5000 })
    .toBe(0); // cleared instantly

  // Now DIRTY the board (a typed digit lifts the undo depth) and the two-tap returns: the first tap
  // arms ("sure?" in rose + the aria swap), the board intact; a second within the window clears.
  const blank = await firstBlank(page, ".sudoku-cell");
  const dirtyInput = cellInput(page, blank);
  await dirtyInput.tap();
  await page.keyboard.type("5");
  await expect(dirtyInput).toHaveValue("5");
  const dirtyCount = await page.locator(".sudoku-cell .glyph-svg").count();
  expect(dirtyCount).toBeGreaterThan(0);
  await clearBtn.tap();
  await expect(
    panel.getByRole("button", { name: "Press again to clear the board" }),
  ).toBeVisible();
  await expect(panel.locator(".icon-sublabel", { hasText: "sure?" })).toBeVisible();
  expect(await page.locator(".sudoku-cell .glyph-svg").count()).toBe(dirtyCount); // armed ≠ cleared
  // Confirm inside the 2.5s window. Under parallel-run load the window can lapse between taps (the
  // tap then re-ARMS — by design); the poll re-taps until the arm+confirm pair lands inside one
  // window, which converges in ≤2 rounds.
  await expect
    .poll(
      async () => {
        await clearBtn.tap();
        await page.evaluate(
          () =>
            new Promise((r) =>
              requestAnimationFrame(() => requestAnimationFrame(() => r(null))),
            ),
        );
        return page.locator(".sudoku-cell .glyph-svg").count();
      },
      { timeout: 15000 },
    )
    .toBe(0);
});

test("Deal is dirty-gated (T4-WU/U3): a pristine board carries no arm; a dirty board arms first", async ({
  page,
}) => {
  await loadSudoku(page);
  await openDrawer(page); // pass 6: Deal is a between-moves act, behind the door
  const panel = page.locator(".mobile-control-panel");
  const dealBtn = panel.getByRole("button", { name: /deal a new board/i });

  // PRISTINE (the mount deal is off-log → undo depth 0): Deal never arms. Its aria is the plain
  // "Deal a new board" — no "Tap again" phrasing — and its sublabel reads "Deal", never "sure?".
  // (born-RED at base: `onDeal` was BARE — no arm, no dirty check.)
  await expect(dealBtn).toHaveAttribute("aria-label", "Deal a new board");
  await expect(dealBtn.locator(".icon-sublabel")).toHaveText("Deal");

  // DIRTY the board — a typed digit lifts the undo depth — and Deal ARMS on the first tap: the aria
  // swaps and the sublabel shows "sure?" in rose, the board intact (armed ≠ dealt). The commit path
  // (once disarmed) is the existing instant deal, covered by the deal specs + banked in the U3 probe.
  const blank = await firstBlank(page, ".sudoku-cell");
  const input = cellInput(page, blank);
  await input.tap();
  await page.keyboard.type("5");
  await expect(input).toHaveValue("5");

  await dealBtn.tap();
  await expect(
    panel.getByRole("button", { name: "Press again to deal a new board" }),
  ).toBeVisible();
  await expect(dealBtn.locator(".icon-sublabel")).toHaveText("sure?");
  await expect(input).toHaveValue("5"); // the first tap armed — it did NOT deal a new board
});
