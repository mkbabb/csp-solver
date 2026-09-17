import { test, expect, type Page } from '@playwright/test';

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
//
/**
 * T9-W6 §3.7 — PRESENCE SAID ON A CLOCK, on a real transport.
 *
 * The roster used to lie, and two files wrote the lie down with a named owner: a page whose
 * socket stays OPEN behind it is nobody's `bye`, so nothing ever pruned the row. `relay.ts`'s
 * `announceLeave` speaks for the socket that CLOSES — a crashed tab, a navigation — and cannot
 * speak for the one that does not.
 *
 * The cure is a clock: every live page re-announces `hi` on a beat, and a peer silent past the
 * expiry leaves PRESENT while staying in KNOWN, so their digits keep their colour. This file is
 * that claim at the only grain a transport can be judged at — real pages, one room, the wire
 * carrying its own frames — and it holds both halves in ONE row, because they are two readings
 * of one window:
 *
 *   · THE CURE — the page that died silently loses its row inside the expiry;
 *   · THE CONTROL — the two pages that are merely QUIET keep theirs through the same window.
 *
 * The control is not decoration. The tempting cure is the per-peer 45s timer the session already
 * holds for cursor ghosts, and it is WRONG: that clock is armed by `cur` frames alone, which a
 * peer sends only when they MOVE. A roster pruned on it evicts a present, motionless reader —
 * a row that lies about a live page in place of one that lies about a dead one. Here A and B sit
 * still for the whole window and the row demands EXACTLY two rows at the end of it: an
 * over-broad prune reads 1 and reds, an absent prune reads 3 and reds.
 *
 * THE LOCAL ARM, one browser context, for the reason the whole multiplayer battery gives: a
 * relay in CI is a flake machine, and what is owned here is the protocol above the seam. The
 * beat and the expiry both live above it (`useSession.ts`), so this is the arm they run on
 * either way.
 *
 * WALL TIME IS THE INSTRUMENT and it is stated rather than hidden: the expiry is 45s, so the
 * window is ~60s and the row's deadline is set for it. Nothing here sleeps INSTEAD of settling —
 * every read is polled or re-asserting, and the one fixed wait is the measurement window itself.
 */

const SOLO = './?size=3&difficulty=EASY';
const LOCAL = SOLO + '&wire=local';

/** `useSession.PRESENCE_EXPIRY_MS` — three misses at a 15s beat. The waits below are derived
 *  from it rather than tuned, so a change to the law moves the row with it. */
const EXPIRY_MS = 45000;

const cellInput = (p: Page, i: number) => p.locator('.sudoku-cell input').nth(i);
const digitAt = (p: Page, i: number) => cellInput(p, i).inputValue();
const roster = (p: Page) => p.locator('.controls-card .players-roster .player-row');

async function boot(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  // The budget is the room's: a third page contends with two others' wasm and paint on one
  // thread (`multiplayer.spec.ts`'s `settled`, same arithmetic).
  const budget = 20000 * Math.min(3, page.context().pages().length);
  await page.waitForSelector('svg.handwritten-logo', { timeout: budget });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: budget })
    .toBeGreaterThan(0);
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

const emptyCells = (page: Page): Promise<number[]> =>
  page.evaluate(() =>
    [...document.querySelectorAll('.sudoku-cell input')]
      .map((input, n) => ((input as HTMLInputElement).value ? -1 : n))
      .filter((n) => n >= 0),
  );

async function write(page: Page, index: number, digit: string) {
  const cell = cellInput(page, index);
  await cell.click();
  await cell.fill(digit);
}

/** Every cell's digit as one string — the signature the interaction suite settles on. */
const boardSignature = (page: Page): Promise<string> =>
  page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.sudoku-cell input'),
      (i) => (i as HTMLInputElement).value,
    ).join(','),
  );

/** The rendered colour of one cell's digit — `--color-user-ink`, resolved. */
const strokeAt = (page: Page, index: number): Promise<string> =>
  page.evaluate((n) => {
    const cell = document.querySelectorAll('.sudoku-cell')[n];
    return getComputedStyle(cell.querySelector('.glyph-svg path')!).stroke;
  }, index);

/**
 * THE PAGE THAT DIES WITHOUT A WORD, modelled at the transport rather than staged.
 *
 * `page.close()` fires `pagehide`, and `pagehide` is exactly where both arms say `bye` — so a
 * plain close is a POLITE death and proves nothing this row is about. Swallowing the departure
 * word at the wire is the socket that stays open behind a dead page, precisely: the room hears
 * everything this page said while it lived, and nothing about its going.
 */
const SWALLOW_BYE = () => {
  const post = BroadcastChannel.prototype.postMessage;
  BroadcastChannel.prototype.postMessage = function (
    this: BroadcastChannel,
    msg: unknown,
  ) {
    if (msg && typeof msg === 'object' && (msg as { kind?: string }).kind === 'bye')
      return;
    post.call(this, msg);
  };
};

/** Bank every frame this page HEARS, by word. The beat is only a beat if it crosses. */
const RECORD_FRAMES = () => {
  const bank: string[] = [];
  (window as unknown as { __frames: string[] }).__frames = bank;
  const Native = window.BroadcastChannel;
  class Recording extends Native {
    constructor(name: string) {
      super(name);
      this.addEventListener('message', (ev: MessageEvent) => {
        const m = ev.data as { kind?: string } | null;
        if (m && typeof m.kind === 'string') bank.push(m.kind);
      });
    }
  }
  window.BroadcastChannel = Recording;
};

const heard = (page: Page, word: string): Promise<number> =>
  page.evaluate(
    (k) =>
      (window as unknown as { __frames: string[] }).__frames.filter((f) => f === k)
        .length,
    word,
  );

/**
 * ONE DOCUMENT, FOR THE WHOLE WINDOW — and this is a MEASURED hazard, not a precaution.
 *
 * The first ablated run of this row passed its prune assertion for the wrong reason: at t+45s
 * both survivors' frame banks SHRANK, which an append-only array cannot do — they were new
 * documents. The dev server had full-reloaded them, and two pages rejoining a room they still
 * hold the `?s=` for read as a pruned roster while nothing had been pruned at all
 * (`evidence/w6/fold/fa4-hmr-forensics.txt`). A reload is not a product event; a 75-second
 * window that any save in the tree can restart measures the editor, not the session.
 *
 * So the HMR socket is cut for these pages — nothing else here opens one, the local arm is a
 * `BroadcastChannel` — and the boot counter rides `sessionStorage`, which SURVIVES a reload, so
 * a document that came back by any other route still reds.
 */
const COUNT_BOOTS = () => {
  const n = Number(sessionStorage.getItem('__boots') ?? '0') + 1;
  sessionStorage.setItem('__boots', String(n));
};

const boots = (page: Page): Promise<number> =>
  page.evaluate(() => Number(sessionStorage.getItem('__boots') ?? '0'));

async function pinDocument(page: Page) {
  await page.addInitScript(COUNT_BOOTS);
  // Routed and never connected to the server: the page sees a socket that says nothing, which
  // is exactly what a hot-reload channel should be worth to a row about presence.
  await page.routeWebSocket(/.*/, () => {});
}

test('a page that dies without a bye leaves the roster on a clock, and the quiet pages keep theirs', async ({
  browser,
}) => {
  // The expiry is 45s and the window has to outlast it on three booting pages: 180s, stated
  // here rather than inherited from `test.slow()`'s ×3, which is 90s and would not fit.
  test.setTimeout(180_000);
  const ctx = await browser.newContext();

  const a = await ctx.newPage();
  await pinDocument(a);
  await boot(a, LOCAL);
  const link = await invite(a);

  const b = await ctx.newPage();
  await pinDocument(b);
  await b.addInitScript(RECORD_FRAMES);
  await boot(b, link);

  const c = await ctx.newPage();
  await pinDocument(c);
  await c.addInitScript(SWALLOW_BYE);
  await boot(c, link);
  for (const p of [a, b, c]) await expect(roster(p)).toHaveCount(3);

  // Two digits, so the board has an author still at the table and an author about to stop being
  // one. C's is the one that has to keep its colour after C is gone.
  const free = await emptyCells(a);
  const [cellA, cellC] = [free[0], free[1]];
  await write(a, cellA, '7');
  await expect.poll(() => digitAt(c, cellA)).toBe('7');
  await write(c, cellC, '4');
  await expect.poll(() => digitAt(a, cellC)).toBe('4');
  const settledBoard = await boardSignature(b);

  // C goes, and the room is told nothing.
  await c.close();

  // THE INSTRUMENT, ASSERTED FIRST. Everything below is worthless if a `bye` crossed anyway —
  // the row would be measuring the polite death the relay already speaks for. B heard every
  // frame this room sent; not one of them was a departure.
  await expect.poll(() => heard(b, 'bye'), { timeout: 10000 }).toBe(0);

  // ── the cure: the row goes, inside the expiry ────────────────────────────────────────────
  for (const p of [a, b])
    await expect
      .poll(() => roster(p).count(), { timeout: EXPIRY_MS + 30000 })
      .toBe(2);

  // ── the control: A and B have now sat still through the whole window, and are still two ───
  // sleep-ok: this IS the measurement window — the claim is that a quiet page does not expire,
  // which cannot be read from a surface, only outlasted. Every assertion after it re-reads.
  await a.waitForTimeout(EXPIRY_MS / 3);
  for (const p of [a, b]) await expect(roster(p)).toHaveCount(2);

  // The beat crossed the wire, repeatedly, and moved nothing on the board: a `hi` carries no ops
  // and the room's digits are the digits it had a minute ago.
  expect(await heard(b, 'hi')).toBeGreaterThanOrEqual(3);
  expect(await boardSignature(b)).toBe(settledBoard);

  // C LEFT PRESENT, NEVER KNOWN: the digit they wrote is still on the board and still in their
  // colour, which is the whole reason a departure prunes one map and not the other.
  expect(await digitAt(a, cellC)).toBe('4');
  expect(await strokeAt(a, cellC)).not.toBe(await strokeAt(a, cellA));

  // THE WINDOW WAS ONE WINDOW: neither survivor came back as a new document, so everything
  // above was read off the session that started this row (see `pinDocument`).
  for (const p of [a, b]) expect(await boots(p)).toBe(1);

  // …and the survivors are still a table rather than two rows on a dead wire.
  const stillFree = await emptyCells(b);
  await write(b, stillFree[0], '5');
  await expect.poll(() => digitAt(a, stillFree[0])).toBe('5');

  await ctx.close();
});
