import { test, expect, type Page } from '@playwright/test';

// PRM: live, because the deck's LIVE CENTRE FACE is gated on `!reducedMotion` (the reason
//   `session-substrate.spec.ts` gives), and this row is about the card that is NOT it. Nothing
//   below reads a box; the two reads are `stroke` on two poster cells, and both are polled into.

/**
 * T9-W6 §6.4 · R13's FOLLOW STATE — the still of a board the table turned AWAY from.
 *
 * T8-R13 gave the still its authors and scoped the attach to the MOUNTED game: the clock is in
 * memory, it is about one board, and colouring the other four cards from it would have been a
 * guess. The FOLLOW is the case that scope missed. A peer's switch hands the ROOM's board to the
 * incoming game — peer digits and all — and turns every page at the table, so the game left
 * behind is a still whose saved board is half somebody else's hand. Disk holds digits and never
 * authors, so it drew every one of them in the reading page's ink.
 *
 * BORN RED on the tree this row landed against: `stillTheirs` and `stillMine` came back the same
 * colour. The cure banks the room's clock per game id at the two instants a board and a clock are
 * provably the same board's, and refuses the write while a follow is in flight — which is the
 * claim this row exists to put on a real page, because the session replaces the clock with the
 * INCOMING board's before it stages the follow, and no unit can prove App's watch honours that.
 *
 * Transport is the local arm (`?wire=local`, one context — a `BroadcastChannel` is origin-scoped
 * WITHIN a context, which is what makes two pages one room), the whole battery's rule: CI owns
 * the protocol above the seam, never a relay.
 */

const LOCAL = './?size=3&difficulty=EASY&wire=local';

const cellInput = (p: Page, i: number) => p.locator('.sudoku-cell input').nth(i);

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 30000 });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 30000 })
    .toBeGreaterThan(0);
}

/** The first square nobody has written. */
const firstEmpty = (page: Page): Promise<number> =>
  page.evaluate(() =>
    [...document.querySelectorAll('.sudoku-cell input')].findIndex(
      (i) => !(i as HTMLInputElement).value,
    ),
  );

async function write(page: Page, index: number, digit: string) {
  const cell = cellInput(page, index);
  await cell.click();
  await cell.fill(digit);
}

test("a still the table turned away from keeps its peer's ink", async ({ browser }) => {
  test.slow(); // two pages, a lazy chunk at the far end of a follow, and a deck open

  // Two pages at one table, the product's own way in: A presses the well's one verb and B opens
  // the link it wrote.
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL);
  const verb = a.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get('s')).not.toBeNull();
  const b = await ctx.newPage();
  await boot(b, a.url());
  for (const p of [a, b])
    await expect(p.locator('.controls-card .players-roster .player-row')).toHaveCount(2);

  // Two hands on the sudoku board — the still has to keep saying which is which after the table
  // has moved on to another worksheet entirely.
  const theirs = await firstEmpty(b);
  await write(b, theirs, '7');
  await expect.poll(() => cellInput(a, theirs).inputValue()).toBe('7');
  const mine = await firstEmpty(a);
  await write(a, mine, '4');
  await expect.poll(() => cellInput(b, mine).inputValue()).toBe('4');

  // Both digits on disk BEFORE the page turns. The still is a disk read, and a row that raced the
  // 300ms persist debounce would be about the clock rather than about the ink.
  await expect
    .poll(() =>
      a.evaluate(
        ([t, m]) => {
          const raw = localStorage.getItem('sudoku-board-state');
          const v = raw
            ? (JSON.parse(raw) as { values: Record<string, number> }).values
            : {};
          return [v[String(t)], v[String(m)]].join(',');
        },
        [theirs, mine],
      ),
    )
    .toBe('7,4');

  // B PICKS ANOTHER WORKSHEET and A's page turns with it (BAL-T8-1). A never asked, and A's
  // sudoku board — half of it B's hand — is a card in the deck from here on.
  // The WORDMARK, not `g`: B's caret is in the cell it just filled, where `g` is a keystroke.
  await b.locator('button.logo-trigger').click();
  await expect(b.locator('.game-gallery')).toBeVisible();
  await b.locator('.gallery-viewport').press('ArrowRight');
  await b.locator('.gallery-viewport').press('Enter');
  if (await b.locator('.gallery-guard').isVisible())
    await b.locator('.gallery-guard .guard-leave').click();
  await expect(a.locator('.futoshiki-cell').first()).toBeVisible({ timeout: 30000 });
  await expect.poll(() => new URL(a.url()).searchParams.get('game')).toBe('futoshiki');

  // A opens the deck. Card 0 is sudoku (the deck's own order) and it is a POSTER now — futoshiki
  // holds the seat, so nothing about this card is the live face. The WORDMARK, not `g`: A's last
  // act put a caret in a cell, where `g` is a keystroke.
  await a.locator('button.logo-trigger').click();
  await expect(a.locator('.game-gallery')).toBeVisible();
  await expect(a.locator('#gallery-card-0 .poster-cell .glyph-svg').first()).toBeVisible({
    timeout: 30000,
  });

  const ink = await a.evaluate(
    ([t, m]) => {
      const still = document.querySelectorAll('#gallery-card-0 .poster-cell');
      const at = (i: number) => {
        const path = still[i]?.querySelector('.glyph-svg path') ?? null;
        return path ? getComputedStyle(path).stroke : 'none';
      };
      return { stillTheirs: at(t), stillMine: at(m) };
    },
    [theirs, mine],
  );

  // The whole row, in one property: two hands, two colours, on a card the table has left.
  expect(ink.stillTheirs).not.toBe('none');
  expect(ink.stillMine).not.toBe('none');
  expect(ink.stillTheirs).not.toBe(ink.stillMine);

  await ctx.close();
});
