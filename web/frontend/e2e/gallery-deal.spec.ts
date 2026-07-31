import { test, expect, type Page } from '@playwright/test';

// T4-P1 F4 — THE STAGING BAND: the picker's order slip, and the fused cross-game transaction.
//
// Under the standing ruling the picker owns the CROSS-GAME SWITCH; the everyday same-game
// re-deal stays in the drawer. What is gated here is everything that ruling puts on the band:
// the two verbs, the pair that must never be silently dropped, the cross-game truth the cards
// report, and — the row that matters most — the guard that reads the TARGET card's ledger and
// not whatever board happens to be mounted.
//
// Selector discipline: first-party hooks — `.staging-band`, `.staging-slip`, `.staging-safe`,
// `.staging-deal`, `.gallery-viewport`, `.gallery-guard`, `.guard-keep`/`.guard-leave`,
// `#gallery-card-{i}`, `.game-card-range`, `.gallery-live`.

/** A persisted board in a game's own on-disk shape. `given` are the deal's cells, `mine` the
 *  user's — the distinction the ledger's `userMoves` flag turns on. */
function board(opts: {
  sizeKey: 'size' | 'boardSize';
  size: number;
  difficulty: string;
  given: string[];
  mine?: string[];
}) {
  const values: Record<string, number> = {};
  for (const k of opts.given) values[k] = 1;
  for (const k of opts.mine ?? []) values[k] = 2;
  return {
    [opts.sizeKey]: opts.size,
    difficulty: opts.difficulty,
    values,
    givenCells: opts.given,
    originalGivenCells: opts.given,
    overriddenCells: [],
    solvedValues: {},
    boardGeneration: 1,
    inequalities: [], // futoshiki's clue furniture — its loader rejects a board without it
  };
}

/** Seed localStorage BEFORE the app boots — this is the cold-start path the whole installed
 *  base takes, and the one pass 2 shipped falsified. */
async function seed(page: Page, entries: Record<string, unknown>) {
  await page.addInitScript((rows: Record<string, unknown>) => {
    for (const [k, v] of Object.entries(rows))
      window.localStorage.setItem(k, JSON.stringify(v));
  }, entries);
}

async function openDeck(page: Page, query = '?view=gallery&size=3&difficulty=EASY') {
  await page.goto('./' + query);
  await page.waitForSelector('.game-gallery', { timeout: 20000 });
  await page.waitForSelector('.staging-band', { timeout: 20000 });
}

/** Step the deck to a card by id (keyboard: the listbox's own contract). */
async function stepTo(page: Page, id: string) {
  const ids = ['sudoku', 'futoshiki', 'thermo', 'killer', 'kenken'];
  const target = ids.indexOf(id);
  const viewport = page.locator('.gallery-viewport');
  await viewport.focus();
  for (let i = 0; i < target; i++) await viewport.press('ArrowRight');
  await expect(viewport).toHaveAttribute('aria-activedescendant', `gallery-card-${target}`);
}

/** The band's chips for one axis, by its group name. */
function axis(page: Page, name: 'size' | 'level') {
  return page.locator(`.staging-axis[role="group"]`).filter({ hasText: name }).first();
}

// ── 1. The listbox contract survives the band ──────────────────────────────────────────────

test('band: a sibling of the listbox, never a control inside role=option', async ({ page }) => {
  await openDeck(page);

  // The whole reason the staging is not on the card: APG forbids interactive descendants of
  // `option`, and an activedescendant listbox gives them no tab stop either.
  //
  // SCOPED TO THE STAGING, deliberately. `role="option"` on the CENTER card is not empty today:
  // Wave C2 teleports the ONE live board (and the drawer tab with it) into the centered card's
  // face, so the deck already hosts the board's own focusables. That is a shipped estate
  // condition this lane neither created nor cures — it is banked as an owner row. What this
  // lane is accountable for is its own delta, and the delta is ZERO.
  const inside = await page.evaluate(
    () =>
      document.querySelectorAll(
        '[role="option"] .staging-band, [role="option"] .staging-btn, [role="option"] .staging-axis',
      ).length,
  );
  expect(inside, 'staging controls inside role=option').toBe(0);

  const sibling = await page.evaluate(() => {
    const band = document.querySelector('.staging-band');
    const viewport = document.querySelector('.gallery-viewport');
    return !!band && !!viewport && band.parentElement === viewport.parentElement;
  });
  expect(sibling, '.staging-band is a sibling of .gallery-viewport').toBe(true);

  // EIGHT stops, every one named and grouped: 3 sizes + 3 levels + 2 verbs on sudoku.
  const stops = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.staging-band button')).map((b) => ({
      name: b.getAttribute('aria-label') ?? b.textContent?.trim() ?? '',
      group: b.closest('[role="group"]')?.getAttribute('aria-labelledby') ?? null,
    })),
  );
  expect(stops).toHaveLength(8);
  expect(stops.every((s) => s.name.length > 0), 'every stop is named').toBe(true);
  expect(stops.filter((s) => s.group !== null), 'chips live in a named group').toHaveLength(6);

  // The group names resolve to real text — an `aria-labelledby` pointing at nothing is worse
  // than no label at all.
  const groupNames = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.staging-axis[role="group"]')).map(
      (g) =>
        document.getElementById(g.getAttribute('aria-labelledby') ?? '')?.textContent?.trim() ??
        null,
    ),
  );
  expect(groupNames).toEqual(['size', 'level']);

  // The deal verb advertises its shortcut on itself and on the listbox that hosts it.
  await expect(page.locator('.gallery-viewport')).toHaveAttribute('aria-keyshortcuts', 'd');
  await expect(page.locator('.staging-deal')).toHaveAttribute('aria-keyshortcuts', 'd');
});

// ── 2. Cold-start truth: the cards report the boards that are actually on disk ──────────────

test('cold start: an UNMOUNTED game reports its saved board and offers resume', async ({
  page,
}) => {
  // The pass-2 defect in one line: with an empty ledger, every card but the mounted one showed
  // a registry range line and a `start` verb, on an install with five saved boards.
  await seed(page, {
    'kenken-board-v1': board({
      sizeKey: 'boardSize',
      size: 6,
      difficulty: 'HARD',
      given: ['0', '1'],
      mine: ['5'],
    }),
  });
  await openDeck(page);

  // The flank card carries the truth without a select.
  await expect(page.locator('#gallery-card-4 .game-card-range')).toHaveText(
    '6×6 hard · in progress',
  );

  await stepTo(page, 'kenken');
  await expect(page.locator('.staging-safe')).toHaveText(/resume/);
  // …and the chips are seeded from the SAVED pair, not the registry default (4×4 / Easy).
  await expect(axis(page, 'size').locator('button[aria-pressed="true"]')).toHaveText('6×6');
  await expect(axis(page, 'level').locator('button[aria-pressed="true"]')).toHaveText('Hard');
});

test('cold start: a game with NO board offers start, and the card keeps its range line', async ({
  page,
}) => {
  await openDeck(page);
  await stepTo(page, 'kenken');
  await expect(page.locator('.staging-safe')).toHaveText(/start/);
  await expect(page.locator('#gallery-card-4 .game-card-range')).toHaveText(
    'size · 4×4 / 5×5 / 6×6',
  );
});

test('cold start: GIVENS ARE NOT WORK — a dealt, untouched board reads "dealt"', async ({
  page,
}) => {
  // Pass 2 counted every non-zero cell, so a board nobody had touched read "in progress" and
  // armed the guard against destroying nothing.
  await seed(page, {
    'kenken-board-v1': board({
      sizeKey: 'boardSize',
      size: 5,
      difficulty: 'EASY',
      given: ['0', '1', '2'],
    }),
  });
  await openDeck(page);
  await expect(page.locator('#gallery-card-4 .game-card-range')).toHaveText(
    '5×5 easy · dealt',
  );
});

// ── 3. THE TARGET-BOARD GUARD — the blocker this lane opened on ─────────────────────────────

test('guard: a deal onto ANOTHER game with work on it arms the ribbon', async ({ page }) => {
  // The pass-2 shape gated on `props.dirty` — the MOUNTED board — so dealing a DIFFERENT game
  // consulted the wrong ledger entirely and destroyed the target's board with no mention of it,
  // one unmodified `d` keystroke deep. Sudoku is mounted and pristine here; kenken holds work.
  await seed(page, {
    'kenken-board-v1': board({
      sizeKey: 'boardSize',
      size: 6,
      difficulty: 'HARD',
      given: ['0'],
      mine: ['5'],
    }),
  });
  await openDeck(page);
  await stepTo(page, 'kenken');

  await page.locator('.staging-deal').click();

  const ribbon = page.locator('.gallery-guard');
  await expect(ribbon).toBeVisible();
  await expect(ribbon).toHaveAttribute('aria-label', 'Deal a new board?');
  await expect(ribbon.locator('.guard-note-text')).toContainText('deal over this puzzle?');
  await expect(ribbon.locator('.guard-leave')).toHaveText('deal');
  // Both verbs go inert while the ribbon is up — a second deal cannot ride under it.
  await expect(page.locator('.staging-deal')).toBeDisabled();
  await expect(page.locator('.staging-safe')).toBeDisabled();

  // Keep dismisses and nothing was dealt: still in the picker, still on kenken.
  await ribbon.locator('.guard-keep').click();
  await expect(ribbon).toBeHidden();
  await expect(page.locator('.game-gallery')).toBeVisible();
});

test('guard: the NEGATIVE control — an untouched target board deals straight through', async ({
  page,
}) => {
  // The gate has to be able to NOT fire, or it is asserting a constant. Same seed, minus the
  // user's digit: givens only, so there is nothing a deal can destroy.
  await seed(page, {
    'kenken-board-v1': board({
      sizeKey: 'boardSize',
      size: 6,
      difficulty: 'HARD',
      given: ['0', '1'],
    }),
  });
  await openDeck(page);
  await stepTo(page, 'kenken');

  await page.locator('.staging-deal').click();
  await expect(page.locator('.gallery-guard')).toBeHidden();
  await expect(page.locator('.kenken-cell, .board-cells').first()).toBeVisible({
    timeout: 20000,
  });
});

test('guard: the `d` hotkey routes through the SAME ribbon', async ({ page }) => {
  // The keyboard path is the one that shipped unguarded. It must reach the same confirmation a
  // tap does — a bare `d` may never destroy a board.
  await seed(page, {
    'kenken-board-v1': board({
      sizeKey: 'boardSize',
      size: 6,
      difficulty: 'HARD',
      given: ['0'],
      mine: ['5'],
    }),
  });
  await openDeck(page);
  await stepTo(page, 'kenken');

  await page.locator('.gallery-viewport').press('d');
  await expect(page.locator('.gallery-guard')).toBeVisible();
  await expect(page.locator('.gallery-guard .guard-leave')).toHaveText('deal');
});

// ── 4. THE FUSED TRANSACTION — one pick, one deal, the right board ──────────────────────────

test('deal: a cross-game deal lands the TARGET game at the STAGED pair', async ({ page }) => {
  // Futoshiki is the target because it URL-syncs BOTH axes (thermo/killer/kenken persist theirs
  // to storage and their `syncToUrl` is a no-op), so the staged pair is observable in the bar.
  await openDeck(page);
  await stepTo(page, 'futoshiki');

  await axis(page, 'size').getByRole('button', { name: '7×7' }).click();
  await axis(page, 'level').getByRole('button', { name: 'Hard' }).click();
  await expect(axis(page, 'size').locator('button[aria-pressed="true"]')).toHaveText('7×7');

  await page.locator('.staging-deal').click();

  // The picker closes and futoshiki mounts at 7×7 — 49 cells, the STAGED size, not its 5×5
  // default — in ONE board generation. Pass 1's unkeyed handoff dealt whatever size the arm
  // happened to carry into whichever game mounted next.
  await expect(page.locator('.game-gallery')).toBeHidden({ timeout: 20000 });
  await expect(page.locator('.futoshiki-cell')).toHaveCount(49, { timeout: 20000 });
  expect(new URL(page.url()).searchParams.get('game')).toBe('futoshiki');
  expect(new URL(page.url()).searchParams.get('board_size')).toBe('7');
  expect(new URL(page.url()).searchParams.get('difficulty')).toBe('HARD');
});

// ── 5. THE SAFE VERB — the staged pair is never silently dropped ─────────────────────────────

test('safe verb: `start` HONOURS the staged pair (a game with no board has none to restore)', async ({
  page,
}) => {
  // With no board to restore, the only truthful "safe" act IS the pair the chips describe —
  // so `start` deals it. Pass 2 emitted a bare `select` and the pair went on the floor.
  await openDeck(page);
  await stepTo(page, 'futoshiki');
  await expect(page.locator('.staging-safe')).toHaveText(/start/);
  await axis(page, 'size').getByRole('button', { name: '6×6' }).click();

  await page.locator('.staging-safe').click();

  await expect(page.locator('.game-gallery')).toBeHidden({ timeout: 20000 });
  await expect(page.locator('.futoshiki-cell')).toHaveCount(36, { timeout: 20000 });
  expect(new URL(page.url()).searchParams.get('game')).toBe('futoshiki');
  expect(new URL(page.url()).searchParams.get('board_size')).toBe('6');
});

test('safe verb: `resume` PRINTS the saved pair the moment the chips wander off it', async ({
  page,
}) => {
  // The pass-2 defect: the chips said 4×4, `resume` emitted a bare `select`, and the pair went
  // on the floor with no mark of any kind — the reader was never told the verb would ignore
  // them. The cure is that it is no longer SILENT: the divergence is printed on the verb, in
  // ink and in the accessible name, BEFORE the click. (The chips also snap onto the saved pair
  // in `onSafeVerb`, but that write is not the cure and is not sold as one — `select` unmounts
  // the deck in the same handler, so on the everyday path it never paints. It earns its two
  // lines only on the guard-armed path, where the band survives the click.)
  await seed(page, {
    'futoshiki-board-state': board({
      sizeKey: 'boardSize',
      size: 7,
      difficulty: 'HARD',
      given: ['0'],
      mine: ['5'],
    }),
  });
  await openDeck(page);
  await stepTo(page, 'futoshiki');

  await expect(page.locator('.staging-safe .staging-sub')).toHaveCount(0); // agreed ⇒ no sublabel

  await axis(page, 'size').getByRole('button', { name: '4×4' }).click();
  await expect(page.locator('.staging-safe .staging-sub')).toHaveText('7×7 hard');
  await expect(page.locator('.staging-safe')).toHaveAttribute(
    'aria-label',
    'resume futoshiki at 7×7 hard',
  );

  await page.locator('.staging-safe').click();
  // The board that came up is the SAVED one — 7×7 — not the 4×4 the chips were left showing.
  await expect(page.locator('.futoshiki-cell')).toHaveCount(49, { timeout: 20000 });
  expect(new URL(page.url()).searchParams.get('board_size')).toBe('7');
});

test('safe verb: a wandered pair cannot OUTLIVE the transaction', async ({ page }) => {
  // The structural half of the same guarantee: the picks are per-open state, so every fresh
  // open re-seeds the chips from the ledger. A divergence is a thing you are holding during one
  // visit to the picker, never a lie the slip keeps telling about a board you are playing.
  await seed(page, {
    'futoshiki-board-state': board({
      sizeKey: 'boardSize',
      size: 7,
      difficulty: 'HARD',
      given: ['0'],
      mine: ['5'],
    }),
  });
  await openDeck(page);
  await stepTo(page, 'futoshiki');
  await axis(page, 'size').getByRole('button', { name: '4×4' }).click();
  await expect(axis(page, 'size').locator('button[aria-pressed="true"]')).toHaveText('4×4');

  await page.locator('.gallery-viewport').press('Escape'); // cancel — no select, no deal
  await expect(page.locator('.game-gallery')).toBeHidden({ timeout: 20000 });

  await page.locator('button.logo-trigger').click();
  await page.waitForSelector('.staging-band', { timeout: 20000 });
  await stepTo(page, 'futoshiki');
  await expect(axis(page, 'size').locator('button[aria-pressed="true"]')).toHaveText('7×7');
});

// ── 6. The band announces itself — one live region for the deck AND its slip ─────────────────

test('a11y: the live region carries the staged pair and the board state', async ({ page }) => {
  await seed(page, {
    'kenken-board-v1': board({
      sizeKey: 'boardSize',
      size: 6,
      difficulty: 'HARD',
      given: ['0'],
      mine: ['5'],
    }),
  });
  await openDeck(page);
  const live = page.locator('.gallery-live');

  await stepTo(page, 'kenken');
  await expect(live).toHaveText('kenken, 5 of 5. 6×6 hard, in progress');

  // A chip change is a state change the deck's announcement would otherwise never mention.
  await axis(page, 'level').getByRole('button', { name: 'Easy' }).click();
  await expect(live).toHaveText('6×6 easy, in progress');
});
