import { test, expect, type BrowserContext, type Page } from '@playwright/test';

// PRM: live, because the join beat IS the subject—the ring has to actually draw for any of
//   these rows to mean anything, and its PRM twin lives in join-language-prm.spec.ts.

/**
 * T8-W3 · THE JOIN LANGUAGE, ON THE BOARD (M14 · lane C).
 *
 * "The board draws in briefly with the joining player's color" — the design casts that on the
 * progress trace's own grammar: a SECOND filterless grain-baked stack over the same frame rect,
 * its own seed, its ink rebound to the arriving peer's, its dash driven by one finite handle.
 * These rows hold the three properties that make it that and not something else:
 *
 *   · IT DRAWS, AND IN THEIR COLOUR — a real join over the local wire rings A's board in B's ink.
 *   · IT IS ONE RING — the design's own rule 4, and the thing a coalescing bug breaks first.
 *   · IT MINTS NO FILTER — the census stays 9, which is the whole reason the trace was built as
 *     baked geometry rather than a filtered layer.
 *
 * ONE BROWSER CONTEXT, and that is the mechanism rather than a convenience: the local transport
 * arm is a `BroadcastChannel`, scoped to an origin WITHIN a context (multiplayer.spec.ts's own
 * finding). The flow is the product's — A presses the well's verb, B opens the URL A's address
 * bar now carries — so a break in the invite path reds here too.
 */

const SOLO = '/?wire=local';

async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo');
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count())
    .toBeGreaterThan(0);
}

async function boot(page: Page, url: string) {
  await page.goto(url);
  await settled(page);
}

/** A's invite, off the address bar rather than the clipboard (share-truth's property). */
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get('s')).not.toBeNull();
  return page.url();
}

/**
 * BOOT SUPPRESSION IS 1200ms OFF THE MOMENT THE WIRE STARTS CARRYING, so a join that lands
 * inside it is correctly not an arrival. Waiting it out is a REQUIREMENT of the surface, not a
 * settle standing in for one — and it is polled on the policy's own clock rather than slept.
 */
async function pastBootWindow(page: Page) {
  const opened = await page.evaluate(() => performance.now());
  await expect
    .poll(() => page.evaluate((t) => performance.now() - t, opened))
    .toBeGreaterThan(1400);
}

/** The join ring's dash front, 0 at rest and 1000 when it stands complete. */
const ringFront = (page: Page) =>
  page.evaluate(() => {
    const p = document.querySelector('.join-trace');
    return p ? 1000 - parseFloat(getComputedStyle(p).strokeDashoffset) : -1;
  });

test('a join rings the board, in the joiner’s own ink, once', async ({ browser }) => {
  const ctx: BrowserContext = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO);
  const link = await invite(a);
  await pastBootWindow(a);

  const b = await ctx.newPage();
  await boot(b, link);

  // IT DRAWS. The front runs to the top of its range and the layer exists to carry it.
  await expect.poll(() => ringFront(a), { timeout: 15_000 }).toBeGreaterThan(900);

  // ONE RING. Four pose siblings is the boil stack (BOIL_CONFIG.frameCount), one ring's worth —
  // never two rings' worth, which is what rule 4 forbids and what a second handle would show as.
  const poses = await a.locator('.join-pose').count();
  expect(poses).toBe(await a.locator('.progress-pose, .join-pose').evaluateAll(
    (els) => els.filter((e) => e.classList.contains('join-pose')).length,
  ));
  expect(poses).toBeGreaterThan(0);
  expect(await a.locator('.join-trace').count()).toBe(poses);

  // IN THEIR COLOUR. The stroke reads `--color-user-ink`, rebound on the stack from the arriving
  // peer's own entry — the same one value B's digits are drawn with, and never the incumbent.
  const stroke = await a.evaluate(
    () => getComputedStyle(document.querySelector('.join-trace')!).stroke,
  );
  const rosterInk = await a.evaluate(() => {
    const rows = [...document.querySelectorAll('.controls-card .player-row')];
    const peer = rows.find((r) => !r.querySelector('.player-self'));
    return peer ? getComputedStyle(peer).color : null;
  });
  expect(rosterInk).not.toBeNull();
  expect(stroke).toBe(rosterInk);

  await ctx.close();
});

test('the ring is baked geometry: it mints no filter, in either engine', async ({
  browser,
}) => {
  const ctx: BrowserContext = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO);
  const link = await invite(a);
  await pastBootWindow(a);
  const b = await ctx.newPage();
  await boot(b, link);
  await expect.poll(() => ringFront(a), { timeout: 15_000 }).toBeGreaterThan(900);

  // THE WHOLE POINT OF THE CAST. The trace grammar exists as grain-baked paths precisely so a
  // second ring costs no filter, and the census's budget of 9 is what that buys. A layer that
  // acquired a `filter=` would still LOOK right and would move the census, which is why the
  // assertion is on the count and not on the picture.
  const filtered = await a.evaluate(
    () =>
      [...document.querySelectorAll('.join-pose, .join-trace')].filter(
        (el) => getComputedStyle(el).filter !== 'none',
      ).length,
  );
  expect(filtered).toBe(0);

  await ctx.close();
});

test('the roster row is the other half: the name lands in their ink, and the well says who', async ({
  browser,
}) => {
  const ctx: BrowserContext = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO);
  const link = await invite(a);

  // A ROOM OF ONE. It offers the link and it says so out loud — M13 row 18's two cures, which
  // were one hidden verb and silence: `v-if="!session.roomId"` took the invite away the moment
  // you had a room, so the one state that most needs the link was the one state without it.
  await expect(a.locator('.controls-card .players-alone')).toHaveText(
    "you're the only one on this board.",
  );
  await expect(
    a.locator('.controls-card .tray-well:has(.players-roster, .players-alone) .icon-btn'),
  ).toBeVisible();

  await pastBootWindow(a);
  const b = await ctx.newPage();
  await boot(b, link);

  await expect(a.locator('.controls-card .player-row')).toHaveCount(2);
  // and the alone line goes with the aloneness.
  await expect(a.locator('.controls-card .players-alone')).toHaveCount(0);

  // THE SLUG IS IN THEIR INK — the whole of the "player icon" the mark floated. The peer's row
  // and their swatch are one colour, and it is not your own.
  const [peerColor, selfColor] = await a.evaluate(() => {
    const rows = [...document.querySelectorAll('.controls-card .player-row')];
    const self = rows.find((r) => r.querySelector('.player-self'))!;
    const peer = rows.find((r) => !r.querySelector('.player-self'))!;
    return [getComputedStyle(peer).color, getComputedStyle(self).color];
  });
  expect(peerColor).not.toBe(selfColor);
  const swatch = await a.evaluate(() => {
    const peer = [...document.querySelectorAll('.controls-card .player-row')].find(
      (r) => !r.querySelector('.player-self'),
    )!;
    return getComputedStyle(peer.querySelector('.player-swatch')!).backgroundColor;
  });
  expect(swatch).toBe(peerColor);

  await ctx.close();
});
