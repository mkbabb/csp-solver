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
  // In gallery view the board-group (masthead + logo) is hidden — the gallery is the takeover
  // surface — so wait on the gallery itself, not the wordmark.
  await page.waitForSelector('.game-gallery', { timeout: 15000 });
  await page.waitForSelector('#gallery-card-0 .boil-pose', { timeout: 15000 });
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
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('inert', '');
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
  await expect(page.locator('#gallery-card-0')).toHaveAttribute('inert', '');
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
  await expect(page.locator('.board-group')).toBeVisible();
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
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('inert', '');

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
