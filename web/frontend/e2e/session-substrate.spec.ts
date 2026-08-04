import { test, expect, type Page } from '@playwright/test';

// PRM: live, because the seam two of these rows measure — the LIVE CENTRE FACE — exists only
//   when motion is live: `GameGallery.isLive` is gated on `!reducedMotion`, so a frozen run has
//   no live face to detach and the D-3 row would pass by never reaching the surface it exists
//   for. Nothing here reads a pixel or a box; every read is a digit, a count, a name or a
//   parameter, and every one of them is polled.

/**
 * T8-W3 · THE SUBSTRATE — the session is the table, the game is the worksheet on it.
 *
 * Four rows, and three of them were RED before this wave's cure (each says so at its head).
 * The transport is the local arm (`?wire=local`, one browser context — a `BroadcastChannel` is
 * scoped to an origin WITHIN a context, which is what makes two Playwright pages one room), for
 * the reason the whole multiplayer battery gives: a relay in CI is a flake machine, and what CI
 * owns is the protocol above the seam. The shipped arm is verified against the real relay by
 * hand at the close.
 *
 * The flow is the PRODUCT's throughout: page A presses the well's one verb, page B opens the
 * link it wrote. Nothing here reaches past the UI to seed a session.
 */

const SOLO = './?size=3&difficulty=EASY';
const LOCAL = SOLO + '&wire=local';

const cellInput = (p: Page, i: number) => p.locator('.sudoku-cell input').nth(i);
const digitAt = (p: Page, i: number) => cellInput(p, i).inputValue();
const cells = (p: Page) => p.locator('.sudoku-cell input').count();
const roster = (p: Page) => p.locator('.controls-card .players-roster .player-row');

async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo', { timeout: 30000 });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 30000 })
    .toBeGreaterThan(0);
}

async function boot(page: Page, url: string) {
  await page.goto(url);
  await settled(page);
}

/** A's invite, read off the address bar — `shareSession` writes `?s=` and `?board=` with
 *  `replaceState` before it touches the clipboard. */
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get('s')).not.toBeNull();
  return page.url();
}

/** Every cell's digit as one string — the signature the interaction suite settles on. */
const boardSignature = (page: Page): Promise<string> =>
  page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.sudoku-cell input'),
      (i) => (i as HTMLInputElement).value,
    ).join(','),
  );

/** The first square nobody has written — a free cell to write into. */
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

/** Two pages at one table, the product's own way in. */
async function twoPages(browser: import('@playwright/test').Browser) {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, LOCAL);
  const link = await invite(a);
  const b = await ctx.newPage();
  await boot(b, link);
  for (const p of [a, b]) await expect(roster(p)).toHaveCount(2);
  return { ctx, a, b, link };
}

// ── D-1 · the mid-session size desync ───────────────────────────────────────────────────
//
// BORN RED at `e296915a`, and code-proven before it was ever run: `snapshotBoard` writes no
// size and `restoreBoardState` reads none, so a peer adopting a board published after a
// size-changing Deal poured 256 values into a 9×9 model and corrupted in silence — the board
// kept 81 inputs while its values map held a 16×16 puzzle. The measured red: A dealt 4×4 and B
// still counted 81 cells, forever. The cure is one field on the epoch (`z`) and one parameter
// on the adopt: the board arrives at the size it was published at.

test('a size-changing deal re-dimensions the whole table, not just the dealer', async ({
  browser,
}) => {
  test.slow(); // two pages, and a deal at each end of a size change
  const { ctx, a, b } = await twoPages(browser);
  expect(await cells(a)).toBe(81);
  expect(await cells(b)).toBe(81);

  // A stages 4×4 and commits it — the one act that changes a board's dimensions.
  await a.locator('.controls-card button:has-text("4×4")').click();
  await a.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect.poll(() => cells(a)).toBe(16);

  // B follows the dimensions, not merely the digits.
  await expect.poll(() => cells(b)).toBe(16);
  await expect.poll(() => boardSignature(b)).toBe(await boardSignature(a));

  // And it is still a table: a digit crosses on the board they both now hold.
  const cell = await firstEmpty(b);
  await write(b, cell, '3');
  await expect.poll(() => digitAt(a, cell)).toBe('3');

  await ctx.close();
});

// ── M13 · the table follows the switcher ────────────────────────────────────────────────
//
// BORN RED at `e296915a`: a game switch WAS a leave. `clearSessionSource` called
// `leaveSession()` and `setGame` stripped `?s=`, so the switcher fell through a trapdoor —
// out of the room, out of the link, with no word said to anybody — and the peers were left
// on a board with a player who had silently gone. The owner's ruling (BAL-T8-1): the whole
// table follows, through the same epoch machinery every write already rides.

test('one page switches game and the whole table turns the page with it', async ({
  browser,
}) => {
  test.slow(); // two pages, a lazy chunk, and a mount deal at the far end
  const { ctx, a, b, link } = await twoPages(browser);
  const room = new URL(link).searchParams.get('s');

  // A picks a different worksheet, the product's own way: the deck, one step right, Enter.
  await a.keyboard.press('g');
  await expect(a.locator('.game-gallery')).toBeVisible();
  await a.locator('.gallery-viewport').press('ArrowRight');
  await a.locator('.gallery-viewport').press('Enter');
  // THE CONSENT RIBBON, if it armed. In a room the switch asks before it drags anybody, which
  // is the design's own instrument — consenting to it is part of the flow, and the row is about
  // what happens AFTER the consent. (Pristine or dirty is the ribbon's arming rule to state,
  // not this row's to assume.)
  if (await a.locator('.gallery-guard').isVisible()) {
    await a.locator('.gallery-guard .guard-leave').click();
  }
  await expect(a.locator('.futoshiki-cell').first()).toBeVisible({ timeout: 30000 });

  // B FOLLOWS — a page-turn nobody on B asked for, which is exactly the ruling.
  await expect(b.locator('.futoshiki-cell').first()).toBeVisible({ timeout: 30000 });
  await expect.poll(() => new URL(b.url()).searchParams.get('game')).toBe('futoshiki');

  // The room survived the worksheet: same link, same roster, nobody joined and nobody left.
  for (const p of [a, b]) {
    expect(new URL(p.url()).searchParams.get('s')).toBe(room);
    await expect(roster(p)).toHaveCount(2);
  }

  // …and it is B looking at A's board rather than at one of its own: a digit written on the
  // new worksheet crosses, both ways.
  const sig = (p: Page) =>
    p.evaluate(() =>
      Array.from(
        document.querySelectorAll('.futoshiki-cell input'),
        (i) => (i as HTMLInputElement).value,
      ).join(','),
    );
  await expect.poll(() => sig(b)).toBe(await sig(a));

  const target = await b.evaluate(() =>
    [...document.querySelectorAll('.futoshiki-cell input')].findIndex(
      (i) => !(i as HTMLInputElement).value,
    ),
  );
  const cellB = b.locator('.futoshiki-cell input').nth(target);
  await cellB.click();
  await cellB.fill('2');
  await expect
    .poll(() => a.locator('.futoshiki-cell input').nth(target).inputValue())
    .toBe('2');

  await ctx.close();
});

// ── §2.9 · you rejoin as slug x ─────────────────────────────────────────────────────────
//
// BORN RED at `e296915a`: identity was a property of the CONNECTION — `relayWire` minted
// `r-<hex>` per socket and `localWire` one per page — so a return to a room was a stranger
// arriving. New name, new colour, and the digits you had left behind belonged to somebody the
// room could no longer name as you. The binding makes the id the page's, and every function of
// it follows: the slug, the ink index, and the authorship the clock was keying by id all along.

test('leave a table and come back to it: same name, same row, your digits still yours', async ({
  browser,
}) => {
  test.slow(); // three page boots, one of them after a close
  const { ctx, a, b, link } = await twoPages(browser);

  // The table as B reads it: two names, in the order B met them (itself first). It is the
  // WHOLE list that must come back unchanged — a stranger would add a name, and a re-mint
  // would replace one.
  const before = await roster(b).locator('.player-name').allInnerTexts();
  expect(before).toHaveLength(2);

  const cell = await firstEmpty(a);
  await write(a, cell, '7');
  await expect.poll(() => digitAt(b, cell)).toBe('7');

  // A goes. The roster prunes (the departing row holds for its own beat, so this is polled).
  await a.close();
  await expect(roster(b)).toHaveCount(1);

  // …and comes back, by the room's own link, in a new tab.
  const a2 = await ctx.newPage();
  await boot(a2, link);
  await expect(roster(b)).toHaveCount(2);

  // THE SAME NAME, and only one row for it: `known` retained the peer, so the return is a
  // return rather than a second stranger with a second colour.
  await expect
    .poll(() => roster(b).locator('.player-name').allInnerTexts())
    .toEqual(before);

  // AND THE DIGIT IS STILL A2's OWN. The clock keys authors by id, so the cell A wrote is
  // authored by the id A2 now answers to — it reads in the incumbent ink, exactly like a cell
  // A2 writes for itself. Before the binding it would have been inked as a stranger's.
  await expect.poll(() => digitAt(a2, cell)).toBe('7');
  const fresh = await firstEmpty(a2);
  await write(a2, fresh, '4');
  const inks = await a2.evaluate(
    ([mine, older]) => {
      const stroke = (i: number) =>
        getComputedStyle(
          document.querySelectorAll('.sudoku-cell')[i].querySelector('.glyph-svg path')!,
        ).stroke;
      return { mine: stroke(mine), older: stroke(older) };
    },
    [fresh, cell],
  );
  expect(inks.older).toBe(inks.mine);

  await ctx.close();
});

// ── D-3 · the 300ms flush hole ──────────────────────────────────────────────────────────
//
// BORN RED at `e296915a`: the board persists on a 300ms debounce, and the deck's flank faces
// are read from disk — so a digit written and then warped away from was not on disk when the
// still that claims to show it was drawn. Measured red at the seam below: the saved board held
// `0` where the board held the digit. The cure is `flushSave` at the live face's DETACH, which
// is the one instant that knows this board has stopped being live and started being a picture.
//
// No wait is timed: the write and the warp are issued in one task and the read is taken two
// frames later, which is inside the debounce window by two orders of magnitude — so the row is
// red on the defect and green on the cure, never on the clock.

test('a digit is on disk the moment its board stops being the live face', async ({
  page,
}) => {
  await boot(page, SOLO);
  // The mount deal's own save has landed by now — the row is about the LAST write, not the
  // first, so the key must already be there for the comparison to mean anything.
  await expect.poll(() => page.evaluate(() => !!localStorage.getItem('sudoku-board-state')))
    .toBe(true);

  await page.keyboard.press('g');
  await expect(page.locator('.game-gallery')).toBeVisible();
  await expect(page.locator('.live-face-fit .sudoku-cell').first()).toBeVisible({
    timeout: 30000,
  });

  const read = await page.evaluate(async () => {
    const inputs = [
      ...document.querySelectorAll('.sudoku-cell input'),
    ] as HTMLInputElement[];
    const at = inputs.findIndex((i) => !i.value);
    inputs[at].focus();
    inputs[at].value = '5';
    inputs[at].dispatchEvent(new Event('input', { bubbles: true }));

    // THE WARP, in the same task: the deck steps to the next card, this game's face stops
    // being live, and the card it leaves behind is a still drawn from disk.
    const viewport = document.querySelector('.gallery-viewport') as HTMLElement;
    viewport.focus();
    viewport.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    // Two frames — Vue's patch lands the un-live face and App's detach flush runs with it.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return { at, raw: localStorage.getItem('sudoku-board-state') };
  });

  const saved = JSON.parse(read.raw!) as { values: Record<string, number> };
  expect(saved.values[String(read.at)]).toBe(5);
});
