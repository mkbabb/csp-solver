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
// Touch emulation: a real phone descriptor (isMobile + hasTouch) makes Chromium match
// `(pointer: coarse)` — the exact media the coarse branch keys on. The iPhone descriptors default
// to webkit, which CI does not install (chromium-only lane); pin chromium and keep the descriptor's
// touch/viewport traits — matchMedia('(pointer: coarse)') is driven by hasTouch/isMobile, not the
// engine.
test.use({
  ...devices["iPhone 13"],
  browserName: "chromium",
  defaultBrowserType: "chromium",
});

/** The dev-only FilterTuner toggle (env-gated OUT of prod builds) floats over the mobile panel
 *  and can intercept taps — dev chrome, not product surface, so the probe hides it. */
async function hideDevChrome(page: Page) {
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
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
  const panel = page.locator(".mobile-control-panel");

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

  // Selector discipline (affordances.spec.ts): scope to the MOBILE panel — the desktop twin is
  // display:none here but still in the DOM, and a bare query trips strict mode against it.
  const panel = page.locator(".mobile-control-panel");

  // The peek affordance is honest on touch: the washi is laid down at rest (no hover exists here)
  // and the hold surface clears the 44px tap floor.
  const peek = panel.locator(".peek-hold-surface");
  const washi = peek.locator(".washi-label");
  await expect(washi).toBeVisible();
  await expect(washi).toHaveText("hold to peek");
  const box = (await peek.boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);

  // The four icon actions carry written names on coarse pointers.
  for (const label of ["Randomize", "Clear", "Solve", "Share"]) {
    await expect(
      panel.locator(".icon-sublabel", { hasText: label }).first(),
    ).toBeVisible();
  }

  // Clear is destructive (board + undo history): first tap arms ("sure?" in rose), the second
  // within the window clears. Board stays intact after the first tap; givens vanish only on the
  // second.
  const givenCount = await page.locator(".sudoku-cell .glyph-svg").count();
  expect(givenCount).toBeGreaterThan(0);
  const clearBtn = panel.getByRole("button", { name: /clear board/i });
  await clearBtn.tap();
  await expect(
    panel.getByRole("button", { name: "Tap again to clear board" }),
  ).toBeVisible();
  await expect(panel.locator(".icon-sublabel", { hasText: "sure?" })).toBeVisible();
  expect(await page.locator(".sudoku-cell .glyph-svg").count()).toBe(givenCount); // armed ≠ cleared
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
