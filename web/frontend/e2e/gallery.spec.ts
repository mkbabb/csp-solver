import { test, expect, type Page } from '@playwright/test';

// T4-W12 Wave B — THE GALLERY (the carousel, static). The game-select screen as a spread of
// paper worksheets dealt onto a desk: a HandDrawnOutline-framed deck, a listbox-over-carousel
// (W3C APG), scroll-snap for touch + a glass-curve FLIP for keyboard, page pips, and the soul
// gate — only the centered card boils, flanks frozen + inert.
//
// Selector discipline: the gallery has first-party hooks (`.game-gallery`, `.gallery-viewport`
// the role=listbox, `#gallery-card-{i}` options, `.gallery-pip`, `.gallery-live`). Chromium is
// the config default.

async function openGalleryDeepLink(page: Page, query = '?view=gallery&size=3&difficulty=EASY') {
  await page.goto('./' + query);
  // The board-group STAYS in gallery view (T6 mark 7) — it carries the masthead, which names
  // the snapped card; what the gallery replaces is the scene under it. So wait on the gallery
  // itself, not on the wordmark, which is present either way.
  await page.waitForSelector('.game-gallery', { timeout: 15000 });
  await page.waitForSelector('#gallery-card-0 .boil-pose', { timeout: 15000 });
}

/** The deck is AT REST: the display face is in, no glide is carrying the track's transform,
 *  and both the track's width and the scroll position agree with themselves across a frame.
 *  A gesture started before this reads as a grab of a deck that is still moving — which is a
 *  real behaviour, and not the one these rows are about. Polled, never a fixed sleep. */
async function deckSettled(page: Page) {
  await page.waitForFunction(
    () => {
      const t = document.querySelector<HTMLElement>('.gallery-track');
      const vp = document.querySelector<HTMLElement>('.gallery-viewport');
      if (!t || !vp || document.fonts.status !== 'loaded') return false;
      if (Math.abs(new DOMMatrixReadOnly(getComputedStyle(t).transform).m41) > 0.5)
        return false; // a glide is in flight
      const now = `${t.scrollWidth}|${Math.round(vp.scrollLeft)}`;
      const w = window as unknown as { __deck?: string };
      const prev = w.__deck;
      w.__deck = now;
      return prev === now;
    },
    null,
    { timeout: 20000 },
  );
}

/** The centered card's box — the drag rows push from its middle. */
async function deckCenter(page: Page) {
  const box = (await page.locator('.gallery-viewport').boundingBox())!;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** A mouse drag across the deck: press, walk to `dx`, release. The release VELOCITY is the
 *  gesture's meaning (the composable's 0.45 px/ms flick threshold), so each pace is produced
 *  by the mechanism that can actually hold it — measured in both engines, not assumed:
 *   · flick — ONE driver call with THREE interpolated steps. The driver emits them ~2–10ms
 *     apart, so a 160px push samples ~53px a step: it stays over the threshold until a step
 *     stalls past 118ms, which is the margin a loaded nine-worker run needs. A Node-side loop
 *     cannot do this at all — every `mouse.move` is its own round trip and Chromium's land
 *     47–163ms apart, so the same script reads as a flick in WebKit and a crawl in Chromium.
 *   · settle (default) — the opposite problem, so it is paced from Node on purpose: ~10px per
 *     ~55ms is 0.18 px/ms, under the threshold in both engines, and load only slows it
 *     further — the one direction that cannot turn a settle into a flick. */
async function dragDeck(page: Page, dx: number, opts: { flick?: boolean } = {}) {
  await deckSettled(page);
  const c = await deckCenter(page);
  await page.mouse.move(c.x, c.y);
  await page.mouse.down();
  if (opts.flick) {
    await page.mouse.move(c.x + dx, c.y, { steps: 3 });
  } else {
    const steps = Math.max(2, Math.ceil(Math.abs(dx) / 10));
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(c.x + (dx * i) / steps, c.y);
      await page.waitForTimeout(50);
    }
  }
  await page.mouse.up();
}

// ── 1. Deep-link lands in the carousel; the listbox contract holds ──

test('gallery: ?view=gallery lands in the carousel — listbox roles, labels, focus, pips', async ({
  page,
}) => {
  await openGalleryDeepLink(page);

  const listbox = page.locator('.gallery-viewport');
  await expect(listbox).toHaveAttribute('role', 'listbox');
  await expect(listbox).toHaveAttribute('aria-roledescription', 'carousel');
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-0');

  // Five cards (T4-W13: the three new games landed), positional aria labels, selection + inert
  // split. card-0 sudoku is centered; card-1 futoshiki is a flank.
  await expect(page.locator('.game-card')).toHaveCount(5);
  await expect(page.locator('#gallery-card-0')).toHaveAttribute('aria-label', 'sudoku, 1 of 5');
  await expect(page.locator('#gallery-card-0')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('aria-label', 'futoshiki, 2 of 5');
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('aria-selected', 'false');
  // W3 3.3 — inert moved off the option root onto the card's interactive internals, so the
  // flank stays AX-visible as an option; the property gated here (no tab stops, no hit
  // targets on a flank) lives one node down now.
  await expect(page.locator('#gallery-card-1 .game-card-deal')).toHaveAttribute('inert', '');
  await expect(page.locator('#gallery-card-0')).not.toHaveAttribute('inert', '');

  // DOM focus is on the track container (the aria-activedescendant model).
  await expect
    .poll(() =>
      page.evaluate(() => document.activeElement?.classList.contains('gallery-viewport')),
    )
    .toBe(true);

  // Page pips: one per card (five now), the snapped one inked.
  await expect(page.locator('.gallery-pip')).toHaveCount(5);
  await expect(page.locator('.gallery-pip').nth(0)).toHaveClass(/is-inked/);
  await expect(page.locator('.gallery-pip').nth(1)).not.toHaveClass(/is-inked/);
});

// ── 2. Keyboard: ←/→ step, Home/End, live-region announcement, activedescendant + pips track ──

test('gallery: keyboard step moves the snap, announces it, and updates aria + pips', async ({
  page,
}) => {
  await openGalleryDeepLink(page);
  const listbox = page.locator('.gallery-viewport');

  await page.keyboard.press('ArrowRight');
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-1');
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#gallery-card-1')).not.toHaveAttribute('inert', '');
  await expect(page.locator('#gallery-card-0 .game-card-deal')).toHaveAttribute('inert', '');
  // T4-P1 F4 — the announcement now carries the band's content too: the deck's position AND
  // the staged pair AND the board state, because a snap swaps the whole slip under the deck and
  // one live region has to speak for both. Re-stated EXACTLY (never loosened to a regex) in the
  // same diff that changes it; `gallery-deal.spec.ts` gates the band's half on its own.
  await expect(page.locator('.gallery-live')).toHaveText(
    'futoshiki, 2 of 5. 5×5 easy, new game',
  );
  await expect(page.locator('.gallery-pip').nth(1)).toHaveClass(/is-inked/);

  // End jumps to the LAST card (kenken, index 4 — five games now, T4-W13). Clamp —
  // ArrowRight at the last card is a no-op (no wrap).
  await page.keyboard.press('End');
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-4');
  await expect(page.locator('.gallery-live')).toHaveText('kenken, 5 of 5. 4×4 easy, new game');
  await page.keyboard.press('ArrowRight');
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-4');

  // Home returns to the first card.
  await page.keyboard.press('Home');
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-0');
  await expect(page.locator('.gallery-live')).toHaveText(
    'sudoku, 1 of 5. 9×9 easy, board dealt',
  );
});

// ── 3. Enter selects — the gallery closes, the board swaps, ?game set, ?view cleared ──

test('gallery: Enter on futoshiki selects it — board swaps, ?game set, ?view cleared', async ({
  page,
}) => {
  await openGalleryDeepLink(page);
  await page.keyboard.press('ArrowRight'); // → futoshiki
  await page.keyboard.press('Enter');

  await expect(page.locator('.game-gallery')).toHaveCount(0);
  await expect(page.locator('.futoshiki-cell').first()).toBeVisible({ timeout: 15000 });
  const url = new URL(page.url());
  expect(url.searchParams.get('game')).toBe('futoshiki');
  expect(url.searchParams.get('view')).toBeNull();
});

// ── 4. Escape cancels — back to the playing board, no swap, ?view cleared ──

test('gallery: Escape cancels back to the board, no swap, ?view cleared', async ({ page }) => {
  await openGalleryDeepLink(page);
  await page.keyboard.press('Escape');

  await expect(page.locator('.game-gallery')).toHaveCount(0);
  // `.board-group` is visible in BOTH views now, so its visibility no longer discriminates —
  // the board being back is what "cancelled" means, and `.is-gallery` being gone is the pose
  // it came back to.
  await expect(page.locator('.board-group')).toBeVisible();
  await expect(page.locator('.board-group.is-gallery')).toHaveCount(0);
  await expect(page.locator('.sudoku-cell').first()).toBeVisible();
  expect(new URL(page.url()).searchParams.get('view')).toBeNull();
});

// ── 5. Entry: `g` opens the gallery from the playing view (guarded off editable targets) ──

test('gallery: `g` opens the gallery from playing; a `g` typed into a cell does not', async ({
  page,
}) => {
  await page.goto('./?size=3&difficulty=EASY');
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });

  // `g` into a focused board input is swallowed (guard) — the gallery must NOT open.
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector('.glyph-svg')) return i;
    return -1;
  });
  await page.locator('.board-cells input').nth(blank).focus();
  await page.keyboard.press('g');
  await expect(page.locator('.game-gallery')).toHaveCount(0);

  // `g` with focus off any field opens it.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('g');
  await expect(page.locator('.game-gallery')).toBeVisible();
  expect(new URL(page.url()).searchParams.get('view')).toBe('gallery');
});

// ── 6. THE SOUL GATE (structural): flanks are inert; only the centered card carries a live
//        boiling frame — a flank's active pose is frozen (never advances) ──

test('gallery: only the centered card boils — a flank frame is inert + frozen', async ({
  page,
}) => {
  await openGalleryDeepLink(page);

  // The centered card carries an active boil pose; the flank is inert.
  await expect(page.locator('#gallery-card-0 .boil-pose.is-active')).toHaveCount(1);
  await expect(page.locator('#gallery-card-1 .game-card-deal')).toHaveAttribute('inert', '');

  // The flank's active pose index does NOT advance over a beat window (frozen pose 0), while
  // the centered card's does (it derives the shared beat). Sample the active-pose index twice.
  const activeIndexOf = (sel: string) =>
    page.evaluate((s) => {
      const poses = [...document.querySelectorAll(`${s} .boil-pose`)];
      return poses.findIndex((p) => p.classList.contains('is-active'));
    }, sel);

  const flank0 = await activeIndexOf('#gallery-card-1');
  const center0 = await activeIndexOf('#gallery-card-0');
  await page.waitForTimeout(700); // several ~8Hz beats
  const flank1 = await activeIndexOf('#gallery-card-1');

  expect(flank0).toBe(flank1); // frozen — the flank never advanced
  expect(center0).toBeGreaterThanOrEqual(0); // the center has a live active pose
});

// ── 7. PRM: opening the gallery is a same-frame cut (no tween) ──

test.describe('gallery under prefers-reduced-motion', () => {
  test('PRM: open is an instant cut — gallery present, no tweening', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./?size=3&difficulty=EASY');
    await page.waitForSelector('.sudoku-cell', { timeout: 15000 });

    // `g` opens the gallery (Wave B open is a v-if cut, no entry transition wrapper).
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.keyboard.press('g');
    await expect(page.locator('.game-gallery')).toBeVisible();

    // The cut carries no tween: no gallery-scoped animations run, and under PRM the shared
    // beat is frozen so the centered card's frame rests on pose 0 (nothing boils).
    const galleryAnims = await page.evaluate(
      () =>
        document.getAnimations().filter((a) => {
          const t = a.effect instanceof KeyframeEffect ? a.effect.target : null;
          return t instanceof HTMLElement && !!t.closest('.game-gallery');
        }).length,
    );
    expect(galleryAnims).toBe(0);
  });
});

// ── 9. THE POINTER DRAG (T6 mark 2) — the deck follows the mouse, releases on the glass curve ──

test('drag: pushing the deck left advances the snap and announces it', async ({ page }) => {
  await openGalleryDeepLink(page);
  const listbox = page.locator('.gallery-viewport');

  await dragDeck(page, -260); // a settle, not a flick — three quarters of a slot, land on 1
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-1');
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.gallery-live')).toHaveText(
    'futoshiki, 2 of 5. 5×5 easy, new game',
  );
  await expect(page.locator('.gallery-pip').nth(1)).toHaveClass(/is-inked/);

  // Snap is RE-ARMED after the release — the rearm fix. A stranded `none` would leave the
  // deck unable to snap for the rest of the page's life.
  await expect
    .poll(() =>
      page.locator('.gallery-viewport').evaluate((el) => getComputedStyle(el).scrollSnapType),
    )
    .toBe('x mandatory');
});

test('drag: a flick moves exactly one card; a release over the centered card selects nothing', async ({
  page,
}) => {
  await openGalleryDeepLink(page);
  const listbox = page.locator('.gallery-viewport');

  // A push of UNDER one slot (352px here), fast enough to read as a flick.
  await dragDeck(page, -160, { flick: true });
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-1');

  // …and back, one card, not two.
  await dragDeck(page, 160, { flick: true });
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-0');

  // The release fires a `click` on whatever card is under the pointer. It must be swallowed:
  // a drag that ends over the centered card is not a choice of it.
  await dragDeck(page, -20); // under a slot, no flick → stays put
  await expect(page.locator('.game-gallery')).toBeVisible();
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-0');

  // A PLAIN click still selects — the swallow is one-shot, not a mode.
  await page.locator('#gallery-card-0').click();
  await expect(page.locator('.game-gallery')).toHaveCount(0);
});

test('drag: a grab during a keyboard glide freezes the deck where it is drawn', async ({
  page,
}) => {
  await openGalleryDeepLink(page);
  await deckSettled(page);
  const c = await deckCenter(page);

  await page.locator('.gallery-viewport').press('ArrowRight'); // a 440ms glass-curve step
  await page.waitForTimeout(100); // …grabbed 100ms in, mid-flight
  await page.mouse.move(c.x, c.y);
  await page.mouse.down();

  // The freeze folds the live transform into scrollLeft, so the drawn position must not JUMP
  // across the grab. Two samples 30ms apart, with no pointer movement between them.
  const drawn = () =>
    page.evaluate(() => {
      const vp = document.querySelector('.gallery-viewport')!;
      const t = document.querySelector('.gallery-track') as HTMLElement;
      const tx = new DOMMatrixReadOnly(getComputedStyle(t).transform).m41;
      return vp.scrollLeft - tx;
    });
  const a = await drawn();
  await page.waitForTimeout(30);
  const b = await drawn();
  expect(Math.abs(b - a)).toBeLessThan(2);

  // Carry the grab into a real drag and release it (a press-and-release on the centered card
  // is a CLICK, and clicking the centered card selects it — that is the affordance, not a
  // defect). The interrupted step then settles with snap re-armed.
  await page.mouse.move(c.x - 40, c.y);
  await page.mouse.up();
  await expect(page.locator('.game-gallery')).toBeVisible();
  await expect
    .poll(() =>
      page.locator('.gallery-viewport').evaluate((el) => getComputedStyle(el).scrollSnapType),
    )
    .toBe('x mandatory');
});

test('drag: kenken — the LAST card — is reachable by dragging', async ({ page }) => {
  // The WebKit-shaped one. `maxScroll`/`targetScrollLeft` clamp writes to the engine's own
  // scrollable overflow, so the release reads the position BACK rather than assuming it took;
  // the last card is where that difference has always shown.
  await openGalleryDeepLink(page);
  const listbox = page.locator('.gallery-viewport');
  // SETTLE drags, not flicks: this row is about reach, and a settle's target is a distance
  // (past the half-slot, so one card) rather than a velocity — the one arm a loaded runner
  // cannot turn into a different answer.
  for (let i = 0; i < 4; i++) await dragDeck(page, -300);
  await expect(listbox).toHaveAttribute('aria-activedescendant', 'gallery-card-4');
  await expect(page.locator('.gallery-live')).toHaveText('kenken, 5 of 5. 4×4 easy, new game');
});

// ── 10. THE HEADER THAT STAYS (T6 mark 7) ──

test('header: the masthead persists in the gallery, names the snapped card, and is inert there', async ({
  page,
}) => {
  await openGalleryDeepLink(page);

  const masthead = page.locator('.board-group .masthead');
  await expect(masthead).toBeVisible();
  await expect(page.locator('.board-group.is-gallery')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  // Inert: no button, no caret — the deck is the one game-select surface. The h1 keeps an
  // accessible name off the visually-hidden label (the wordmark svg is aria-hidden).
  await expect(masthead.locator('button')).toHaveCount(0);
  await expect(masthead.locator('.logo-caret')).toHaveCount(0);
  await expect(masthead.locator('.sr-only')).toHaveText('sudoku');

  // It TRACKS the snap, card by card.
  for (const [i, name] of ['futoshiki', 'thermo', 'killer', 'kenken'].entries()) {
    await page.locator('.gallery-viewport').press('ArrowRight');
    await expect(page.locator('.gallery-viewport')).toHaveAttribute(
      'aria-activedescendant',
      `gallery-card-${i + 1}`,
    );
    await expect(masthead.locator('.sr-only')).toHaveText(name);
  }

  // Cancelling from a DIFFERENT snapped card restores the PLAYED game's name, and the button
  // comes back with it.
  await page.keyboard.press('Escape');
  await expect(page.locator('.game-gallery')).toHaveCount(0);
  await expect(masthead.locator('button.logo-trigger')).toHaveCount(1);
  await expect(masthead.locator('button.logo-trigger')).toHaveAttribute(
    'aria-label',
    'Puzzle: sudoku. Choose a puzzle',
  );
});

// ── 8. Mobile 375: one card fills the viewport, a neighbor peeks, pips are the position tell ──

test.describe('gallery on a 375 phone', () => {
  test.use({ viewport: { width: 375, height: 720 } });

  test('375: one card near-fills the width, a neighbor peeks, pips present', async ({ page }) => {
    await openGalleryDeepLink(page);

    const card = page.locator('.game-card').first();
    const box = (await card.boundingBox())!;
    // The card is a substantial fraction of the 375 viewport (fills its ~78vw slot).
    expect(box.width).toBeGreaterThan(240);
    expect(box.width).toBeLessThan(340);

    // The deck overflows (a neighbor is off-viewport to peek): scrollWidth > clientWidth.
    const overflows = await page.evaluate(() => {
      const vp = document.querySelector('.gallery-viewport')!;
      return vp.scrollWidth > vp.clientWidth + 10;
    });
    expect(overflows).toBe(true);

    await expect(page.locator('.gallery-pip')).toHaveCount(5);
  });
});
