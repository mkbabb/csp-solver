import { test, expect, type Page } from '@playwright/test';

// PRM: live, because the deck's own motion is the thing each row waits out—the 200ms leave
//   dissolve that defers the unmount the handback fires on, and the 440ms glass-curve step
//   between two active options. Freezing them would retire the very seams under test. No row
//   reads a pixel the boil moves: the one geometry read is the ring's clearance inside the
//   scrollport, taken through `expect.poll`, which settles the step rather than sleeping past it.
//
// T9-W3 §3.2 + §3.7 — THE DECK HANDS FOCUS BACK, AND ITS RING RIDES THE CARD.
//
// Two claims, both about a keyboard user and neither about a pixel the boil moves:
//
//   §3.2  Every exit verb the deck owns — Escape, Enter on the same game, Enter on another,
//         `d` to deal — returns DOM focus to whatever held it when the deck opened. Measured
//         at HEAD, in both engines, all four landed it on `<body>`
//         (evidence/w3/gallery-focus-trail-HEAD.txt), which costs a keyboard user the whole
//         head of the document to get back to where they were.
//         The EXCEPTION is law, not an oversight: Escape is bound on the WINDOW, so it fires
//         with focus anywhere on the page, and a deck that grabbed focus back from wherever
//         the user had since put it would be a worse defect than the one being cured.
//
//   §3.7  The focus ring rides the ACTIVE OPTION, not the clipping scrollport. The deck is an
//         aria-activedescendant listbox: DOM focus never leaves `.gallery-viewport`, so an
//         outline on that element is drawn in the same place for all five cards. Measured at
//         HEAD both engines: identical indicator box at every `aria-activedescendant` value,
//         and every card's own `outline-style` `none` — a visible focus indicator that cannot
//         say WHICH option is focused. Correctness only; the look is W7 §6.
//
// KEYBOARD, NOT CLICK, and the reason is measured rather than stylistic: WebKit on macOS does
// not give a <button> DOM focus on click (Playwright's WebKit honours the platform rule), so a
// click-driven row would assert one thing in chromium and another in webkit. Every row below
// puts focus where it wants it with `.focus()` and then presses a key — which is also exactly
// the user whose focus this wave is about.
//
// NO FIXED WAITS. Every settle is a retrying assertion: the deck's own `aria-activedescendant`
// for a committed snap, `.game-gallery` at count 0 for a completed unmount (the handback fires
// on unmount, so an unmounted deck is the precondition — including for the negative row, where
// the claim is that nothing moved focus).
//
// Selector discipline: first-party hooks only — `.game-gallery`, `.gallery-viewport`,
// `.game-card` / `#gallery-card-{i}`, `button.logo-trigger`, `button.sun-moon-toggle`.

/** What holds DOM focus, NAMED AGAINST the selector the row expects: a pass reads back the
 *  selector itself, a red reads back whatever else is holding it. `expect.poll` then prints the
 *  found element in the failure instead of a bare `false`. */
async function focusIs(page: Page, selector: string): Promise<string> {
  return page.evaluate((sel) => {
    const el = document.activeElement;
    if (el && el.matches(sel)) return sel;
    if (!el || el === document.body) return 'body';
    const cls =
      typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : '';
    return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls}`;
  }, selector);
}

async function loadSudoku(page: Page) {
  await page.goto('./?size=3&difficulty=EASY');
  await page.waitForSelector('.sudoku-cell', { timeout: 20000 });
  // Let the auto-dealt (pristine, off-log) board settle so the givens are rendered — a deal
  // still in flight is a board whose dirty bridge has not spoken yet.
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 })
    .toBeGreaterThan(0);
}

/** Open the deck the way a keyboard user opens it: the wordmark focused, then Enter. Returns
 *  once the deck has COMMITTED — `aria-activedescendant` present and DOM focus on the listbox
 *  — so no row below presses a key into a deck that is not listening yet. */
async function openDeckFromWordmark(page: Page) {
  await page.locator('button.logo-trigger').focus();
  await page.keyboard.press('Enter');
  const viewport = page.locator('.gallery-viewport');
  await expect(viewport).toHaveAttribute('aria-activedescendant', /gallery-card-\d+/, {
    timeout: 20000,
  });
  await expect.poll(() => focusIs(page, '.gallery-viewport'), { timeout: 20000 }).toBe(
    '.gallery-viewport',
  );
  return viewport;
}

/** The deck is GONE — leave transition finished, component unmounted. The handback fires on
 *  unmount, so this is the settled precondition every focus claim below stands on. */
async function deckUnmounted(page: Page) {
  await expect(page.locator('.game-gallery')).toHaveCount(0, { timeout: 20000 });
}

// ── §3.2 · the four exit verbs ───────────────────────────────────────────────────────────

test('deck exit by Escape hands focus back to the wordmark that opened it', async ({ page }) => {
  await loadSudoku(page);
  await openDeckFromWordmark(page);

  await page.keyboard.press('Escape');
  await deckUnmounted(page);

  await expect
    .poll(() => focusIs(page, 'button.logo-trigger'), { timeout: 10000 })
    .toBe('button.logo-trigger');
});

test('deck exit by Enter on the SAME game hands focus back', async ({ page }) => {
  await loadSudoku(page);
  const viewport = await openDeckFromWordmark(page);
  // The deck opens on the game being played, so this Enter is the same-game select — the verb
  // that switches nothing and used to drop focus anyway.
  await expect(viewport).toHaveAttribute('aria-activedescendant', 'gallery-card-0');

  await page.keyboard.press('Enter');
  await deckUnmounted(page);

  await expect
    .poll(() => focusIs(page, 'button.logo-trigger'), { timeout: 10000 })
    .toBe('button.logo-trigger');
});

test('deck exit by Enter on ANOTHER game hands focus back', async ({ page }) => {
  await loadSudoku(page);
  const viewport = await openDeckFromWordmark(page);

  await page.keyboard.press('ArrowRight');
  // SETTLED, NOT SLEPT: `Enter` selects whatever the deck has COMMITTED, so the precondition is
  // the commit and not an elapsed span.
  await expect(viewport).toHaveAttribute('aria-activedescendant', 'gallery-card-1');
  await page.keyboard.press('Enter');
  await deckUnmounted(page);

  await expect
    .poll(() => focusIs(page, 'button.logo-trigger'), { timeout: 10000 })
    .toBe('button.logo-trigger');
});

test('deck exit by `d` to deal hands focus back', async ({ page }) => {
  await loadSudoku(page);
  await openDeckFromWordmark(page);

  // A pristine board loses nothing to a deal, so `d` goes straight through rather than arming
  // the ribbon — the deck unfolds and a fresh board lands.
  await page.keyboard.press('d');
  await deckUnmounted(page);

  await expect
    .poll(() => focusIs(page, 'button.logo-trigger'), { timeout: 15000 })
    .toBe('button.logo-trigger');
});

test('deck entered by `g` hands focus back to the control that held it, not to the wordmark', async ({
  page,
}) => {
  await loadSudoku(page);
  // `g` is the keyboard entry, and it fires from wherever focus happens to be — so the thing
  // owed a handback here is NOT the wordmark. This is the row that makes the cure a RECORD
  // rather than a hardcoded destination.
  await page.locator('button.sun-moon-toggle').focus();
  await expect
    .poll(() => focusIs(page, 'button.sun-moon-toggle'), { timeout: 10000 })
    .toBe('button.sun-moon-toggle');
  await page.keyboard.press('g');
  await expect(page.locator('.gallery-viewport')).toHaveAttribute(
    'aria-activedescendant',
    /gallery-card-\d+/,
    { timeout: 20000 },
  );

  await page.keyboard.press('Escape');
  await deckUnmounted(page);

  await expect
    .poll(() => focusIs(page, 'button.sun-moon-toggle'), { timeout: 10000 })
    .toBe('button.sun-moon-toggle');
});

// ── §3.2 · the exception, and it is LAW ──────────────────────────────────────────────────

test('an Escape taken with focus OUTSIDE the deck does not steal focus back', async ({ page }) => {
  await loadSudoku(page);
  await openDeckFromWordmark(page);

  // Escape is the WINDOW's key (T8 M7a) precisely so it works from anywhere on the page. Put
  // focus somewhere the deck does not own and press it there.
  await page.locator('button.sun-moon-toggle').focus();
  await expect
    .poll(() => focusIs(page, 'button.sun-moon-toggle'), { timeout: 10000 })
    .toBe('button.sun-moon-toggle');

  await page.keyboard.press('Escape');
  await deckUnmounted(page);

  // The deck is gone, so the handback has already had its one chance and declined it.
  await expect
    .poll(() => focusIs(page, 'button.sun-moon-toggle'), { timeout: 10000 })
    .toBe('button.sun-moon-toggle');
});

// ── §3.7 · the ring rides the active option ──────────────────────────────────────────────

/** Every element currently drawing a focus ring, named. `nothing` and `the scrollport` are both
 *  reds with their own sentence. */
async function ringOwner(page: Page): Promise<string> {
  return page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>('.gallery-viewport');
    if (!vp) return 'no deck';
    const owners: string[] = [];
    if (getComputedStyle(vp).outlineStyle !== 'none') owners.push('the scrollport');
    for (const card of Array.from(document.querySelectorAll<HTMLElement>('.game-card'))) {
      if (getComputedStyle(card).outlineStyle !== 'none') owners.push(card.id);
    }
    return owners.length ? owners.join(',') : 'nothing';
  });
}

/** Is the active option's ring WHOLE? An outline on a descendant is clipped by the scroll
 *  container that holds it, and the end cards rest 9.6px from the scrollport's edge at
 *  1280×800 (measured, both engines) — so a ring that merely EXISTS is not yet a ring anyone
 *  can see. Retried by `expect.poll`, which is what settles the 440ms glass-curve step. */
async function ringWhole(page: Page): Promise<string> {
  return page.evaluate(() => {
    const vp = document.querySelector<HTMLElement>('.gallery-viewport');
    const card = document.getElementById(vp?.getAttribute('aria-activedescendant') ?? '');
    if (!vp || !card) return 'no deck';
    const cs = getComputedStyle(card);
    if (cs.outlineStyle === 'none') return 'the active option carries no ring';
    const out = parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth);
    const c = card.getBoundingClientRect();
    const v = vp.getBoundingClientRect();
    const air = [c.left - v.left, v.right - c.right, c.top - v.top, v.bottom - c.bottom];
    return air.some((a) => a < out)
      ? `clipped: the ring reaches ${out}px out, air is ${air.map((a) => a.toFixed(1)).join('/')}`
      : 'whole';
  });
}

test('the deck focus ring rides the ACTIVE option, not the clipping scrollport', async ({
  page,
}) => {
  await loadSudoku(page);
  const viewport = await openDeckFromWordmark(page);

  // The row is vacuous unless the deck genuinely holds a VISIBLE keyboard focus — assert that
  // first, so a future change that stops matching `:focus-visible` reds here instead of below.
  await expect
    .poll(
      () =>
        page.evaluate(
          () => document.querySelector('.gallery-viewport')?.matches(':focus-visible') === true,
        ),
      { timeout: 10000 },
    )
    .toBe(true);

  for (const [key, id] of [
    ['Home', 'gallery-card-0'],
    ['End', 'gallery-card-4'],
  ] as const) {
    await page.keyboard.press(key);
    await expect(viewport).toHaveAttribute('aria-activedescendant', id);
    // ONE ring, on the option the deck says is active — and on nothing else.
    await expect.poll(() => ringOwner(page), { timeout: 10000 }).toBe(id);
    await expect.poll(() => ringWhole(page), { timeout: 10000 }).toBe('whole');
  }
});

// ── §3.7 · THE HEAD IS READ IN THE ORDER IT IS PAINTED ───────────────────────────────────
//
// The head carries two marks: the `@mbabb` badge on the left and the celestial toggle on the
// right. On a desk the badge is `.corner-left`, declared in the page root before
// `.corner-right`, so DOM order and paint order agree. Under the dock the desktop badge is
// `display: none` and the badge that PAINTS is the mobile one — and it used to be mounted a
// whole subtree away, inside `<main> > .board-group`, AFTER `.corner-right`. A phone therefore
// visited the RIGHT-hand mark first and the LEFT-hand mark second while a desk visited them
// the other way round: the same head, two reading orders.
//
// There is no tabindex to blame and no tabindex cure — the page carries zero positive
// tabindex, so DOM order IS tab order here.
//
// DOM ORDER, NOT A TAB WALK, and the reason is measured rather than stylistic: Playwright's
// WebKit honours macOS's default keyboard access, so Tab visits form inputs only and never
// lands on a `<button>` at all. A Tab-walk row would silently assert nothing in one of the two
// engines (evidence/w3/gallery-geom-HEAD.txt reads `["input.cell-native-input", "BODY", …]`).
// `compareDocumentPosition` against the painted rect is the claim that survives both.

/** The head's two marks, named by whether DOM order and paint order AGREE. The badge that
 *  answers is whichever one is PAINTED — the desktop card is `display: none` under the dock
 *  and the mobile one above it — so the probe asks for a box before it asks for a position.
 *  A red reads back which way each order ran instead of a bare `false`. */
async function headOrder(page: Page): Promise<string> {
  return page.evaluate(() => {
    const painted = (el: Element | null) => !!el && el.getBoundingClientRect().width > 0;
    const m = document.querySelector('.mobile-attribution .attribution-trigger');
    const d = document.querySelector('.corner-left .attribution-trigger');
    const badge = painted(m) ? m : painted(d) ? d : null;
    const toggle = document.querySelector('.corner-right button.sun-moon-toggle');
    if (!badge || !toggle) return `no head: badge=${!!badge} toggle=${!!toggle}`;
    const domFirst =
      (badge.compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;
    const paintFirst =
      badge.getBoundingClientRect().left < toggle.getBoundingClientRect().left;
    if (domFirst === paintFirst) return 'agree';
    return `disagree: the badge is ${domFirst ? '' : 'not '}first in the DOM and ${
      paintFirst ? 'does' : 'does not'
    } paint first`;
  });
}

test('the head is read in the order it is painted, at every width', async ({ page }) => {
  await loadSudoku(page);

  // THE CONTROL IS IN THE ROW. The desk has always agreed, so a red on the dock line alone is
  // the defect and a red on both lines is a broken probe.
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect
    .poll(() => headOrder(page), { timeout: 15000 })
    .toBe('agree');

  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() => headOrder(page), { timeout: 15000 })
    .toBe('agree');
});

