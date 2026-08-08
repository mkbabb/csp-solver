import { test, expect, type Page } from '@playwright/test';
import { pressCommitted } from './committed-press';

// PRM: live, because the guard ribbon slides in and out on its own transition and this file arms
//   and dismisses it repeatedly; the deck's snap and underline are the app's motion, asserted as
//   the app ships them. Nothing here reads a pixel the boil moves.

// T4-W12 Wave D — the retired dropdown, the mid-game guard ribbon, and the snap-chime
// underline. The wordmark now OPENS THE GALLERY (the in-place listbox is deleted); a switch
// to a DIFFERENT game while the board is DIRTY (WU's undo-depth signal) slides a pencil-note
// ribbon (keep / leave), NOT a modal; pristine + same-game switches are free.
//
// Selector discipline: first-party hooks — `.game-gallery`, `.gallery-viewport`, `.gallery-guard`,
// `.guard-keep`/`.guard-leave`, `.game-card-underline`, `#gallery-card-{i}`.

async function loadSudoku(page: Page) {
  await page.goto('./?size=3&difficulty=EASY');
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  // Let the auto-dealt (pristine, off-log) board settle so givens are rendered.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}

// Type a digit into the first blank cell — a recorded edit (setCell → recordEdit), so the
// board's undo-depth lifts and `isDirty` (the one WU signal) goes true.
async function dirtyTheBoard(page: Page) {
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector('.glyph-svg')) return i;
    return -1;
  });
  expect(blank).toBeGreaterThanOrEqual(0);
  await page.locator('.sudoku-cell').nth(blank).click();
  await page.evaluate((idx) => {
    const input = document.querySelectorAll('.sudoku-cell input')[idx] as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setter.call(input, '1');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, blank);
  // The value committed (a glyph appears) ⇒ setCell ran ⇒ an undo entry recorded ⇒ dirty.
  await expect(page.locator('.sudoku-cell').nth(blank).locator('.glyph-svg')).toHaveCount(1);
}

// GUARDED PRESS (T7-W3 §9) — the wordmark tears out its live pose stack when the bake lands and
// WebKit drops the half of the mouse pair whose target went with it (2/30 measured). Committed
// effect: the deck is open.
async function openGallery(page: Page) {
  const viewport = page.locator('.gallery-viewport');
  await pressCommitted(page.locator('button.logo-trigger'), viewport, {
    what: 'the gallery deck',
  });
  return viewport;
}

// ── 1. The dropdown is retired — the wordmark opens the gallery, no listbox popup ──

test('dropdown retired: the wordmark opens the gallery; no listbox affordance remains', async ({
  page,
}) => {
  await loadSudoku(page);
  const trigger = page.locator('button.logo-trigger');
  // The old collapsible-listbox ARIA is gone.
  await expect(trigger).not.toHaveAttribute('aria-haspopup', 'listbox');
  // GUARDED PRESS (T7-W3 §9). This row's committed effect is its OWN assertion's subject — the
  // CAROUSEL, not the viewport — so it probes `.game-gallery` and the assertion below still
  // stands on its own. The guard cannot manufacture the pass: if the wordmark opened an in-place
  // listbox instead, `.game-gallery` would never commit and this would red on the budget.
  await pressCommitted(trigger, page.locator('.game-gallery'), { what: 'the game gallery' });
  // It opens the CAROUSEL, not an in-place popup listbox.
  await expect(page.locator('.game-gallery')).toBeVisible();
  await expect(page.locator('#logo-game-listbox')).toHaveCount(0);
  expect(new URL(page.url()).searchParams.get('view')).toBe('gallery');
});

// ── 2. The snap-chime underline rides the CENTERED card only ──

test('snap chime: the centered card carries a scribble underline; flanks do not', async ({
  page,
}) => {
  await page.goto('./?view=gallery&size=3&difficulty=EASY');
  await page.waitForSelector('.game-gallery', { timeout: 15000 });

  await expect(page.locator('#gallery-card-0 .game-card-underline')).toHaveCount(1);
  await expect(page.locator('#gallery-card-1 .game-card-underline')).toHaveCount(0);

  // Step right — the underline follows the newly-centered card (redrawn on the snap).
  await page.locator('.gallery-viewport').press('ArrowRight');
  await expect(page.locator('#gallery-card-1 .game-card-underline')).toHaveCount(1);
  await expect(page.locator('#gallery-card-0 .game-card-underline')).toHaveCount(0);
});

// ── 3. A SOLO select is free — and the marks come back (the truth the unguard rests on) ──
// The live pass (2026-08-04) measured a solo leave-and-return returning the board
// byte-identical, which made the old ribbon's 'your marks aren't saved' a false sentence.
// The solo select arm died with it; this row asserts BOTH halves: no ribbon on the way out,
// and the digit waiting on the way back.

test('guard: a solo dirty select switches freely, and the marks are there on return', async ({
  page,
}) => {
  await loadSudoku(page);
  await dirtyTheBoard(page);
  const inked = await page.locator('.sudoku-cell .glyph-svg').count();

  let viewport = await openGallery(page);
  await viewport.press('ArrowRight'); // → futoshiki (different game)
  await viewport.press('Enter'); // select — no ribbon, the switch proceeds

  await expect(page.locator('.gallery-guard')).toHaveCount(0);
  await expect(page.locator('.game-gallery')).toHaveCount(0);
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  expect(new URL(page.url()).searchParams.get('game')).toBe('futoshiki');

  // Return to sudoku through the deck: the board restores, the typed digit included.
  viewport = await openGallery(page);
  await viewport.press('ArrowLeft');
  await viewport.press('Enter');
  await expect(page.locator('.gallery-guard')).toHaveCount(0);
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await expect(page.locator('.sudoku-cell .glyph-svg')).toHaveCount(inked);
});

// ── 4. Guard: the DEAL intent still guards solo (a deal genuinely writes over marks) ──

test('guard: keep dismisses the deal ribbon, stays in the gallery, board unchanged', async ({
  page,
}) => {
  await loadSudoku(page);
  await dirtyTheBoard(page);

  const viewport = await openGallery(page);
  await viewport.press('ArrowRight');
  await viewport.press('d'); // deal intent — dirty work is at stake, the ribbon arms
  await expect(page.locator('.gallery-guard')).toBeVisible();
  await expect(page.locator('.futoshiki-cell')).toHaveCount(0);

  await page.locator('.guard-keep').click();
  await expect(page.locator('.gallery-guard')).toHaveCount(0);
  await expect(page.locator('.game-gallery')).toBeVisible();
  await expect(page.locator('.futoshiki-cell')).toHaveCount(0);
});

// ── 5. Guard: a PRISTINE board switches freely (no ribbon) ──

test('guard: a pristine board switches to a different game with no ribbon', async ({ page }) => {
  await loadSudoku(page); // no edit — pristine (mount deal is off-log)

  const viewport = await openGallery(page);
  await viewport.press('ArrowRight');
  await viewport.press('Enter');

  await expect(page.locator('.gallery-guard')).toHaveCount(0);
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  expect(new URL(page.url()).searchParams.get('game')).toBe('futoshiki');
});

// ── 6. Guard: selecting the SAME game never asks, even when dirty ──

test('guard: selecting the same game never asks, even when the board is dirty', async ({
  page,
}) => {
  await loadSudoku(page);
  await dirtyTheBoard(page);

  const viewport = await openGallery(page);
  // Sudoku is centered (index 0) — select it directly (same game, no swap).
  await viewport.press('Enter');

  await expect(page.locator('.gallery-guard')).toHaveCount(0);
  await expect(page.locator('.game-gallery')).toHaveCount(0);
  await expect(page.locator('.sudoku-cell').first()).toBeVisible();
});

// ── 7. The ribbon stands over the card it names, not over the frame's middle (T8-R15) ──
//
// `.gallery-guard` was `left: 50%` on the deck box — the FRAME's centre — while the chosen card
// is wherever the track could scroll it to, and with the desk's edge air at zero the end cards
// never reach that middle (`useCarouselGlide.targetScrollLeft` clamps 0 and 1 onto one rest
// position, 3 and 4 onto another). Measured 1440×900 on the live edge, both engines: the guard
// centred on 720.0 at EVERY index against card centres 368 / 720 / 720 / 720 / 1072, so at index
// 0 — sudoku, the deck's default pose — the note sat 352px off its own card and squarely over
// futoshiki's face. This row arms at index 0 and re-arms at index 1 in the same run: the second
// arm is the CONTROL, the index where the card centre and the frame centre coincide and where the
// old anchor was already right, so a cure that merely moved the ribbon reds on it.

const GUARD_EDGE_PX = 12; // the component's clamp air — the derivation below is what spends it

async function guardBoxes(page: Page, index: number) {
  return await page.evaluate((i) => {
    const g = document.querySelector('.gallery-guard')!.getBoundingClientRect();
    const c = document.querySelector(`#gallery-card-${i}`)!.getBoundingClientRect();
    return {
      guard: { centre: g.left + g.width / 2, width: g.width, left: g.left, right: g.right },
      card: { centre: c.left + c.width / 2 },
      win: window.innerWidth,
    };
  }, index);
}

/** The ONE licensed miss, derived from the real boxes rather than guessed: how far the card's
 *  centre lies outside the band in which the whole note still fits inside the window. Zero at
 *  this viewport at both indices, so the assertions below are exact to the subpixel. */
function clampSlack(m: Awaited<ReturnType<typeof guardBoxes>>) {
  const half = m.guard.width / 2;
  return Math.max(
    0,
    GUARD_EDGE_PX + half - m.card.centre,
    m.card.centre - (m.win - GUARD_EDGE_PX - half),
  );
}

test('guard: the armed ribbon is anchored on the chosen card, not on the deck frame', async ({
  page,
}) => {
  await loadSudoku(page);
  await dirtyTheBoard(page);

  const viewport = await openGallery(page);
  // Index 0 — sudoku, the card the deck opens on, and the one the frame centre misses.
  await viewport.press('d');
  await expect(page.locator('.gallery-guard')).toBeVisible();

  const at0 = await guardBoxes(page, 0);
  expect(
    Math.abs(at0.guard.centre - at0.card.centre),
    `the ribbon centred on ${at0.guard.centre} against card 0 at ${at0.card.centre}`,
  ).toBeLessThanOrEqual(clampSlack(at0) + 1);
  // …and it is WHOLE: an anchor that aimed true by hanging half the note off the page would be
  // its own defect, so the clamp is asserted alongside the aim rather than trusted.
  expect(at0.guard.left).toBeGreaterThanOrEqual(-1);
  expect(at0.guard.right).toBeLessThanOrEqual(at0.win + 1);

  // THE IN-RUN CONTROL — re-arm one card along, where the frame centre was already the answer.
  await page.locator('.guard-keep').click();
  await expect(page.locator('.gallery-guard')).toHaveCount(0);
  await viewport.press('ArrowRight');
  await viewport.press('d');
  await expect(page.locator('.gallery-guard')).toBeVisible();

  const at1 = await guardBoxes(page, 1);
  expect(
    Math.abs(at1.guard.centre - at1.card.centre),
    `the ribbon centred on ${at1.guard.centre} against card 1 at ${at1.card.centre}`,
  ).toBeLessThanOrEqual(clampSlack(at1) + 1);
});
