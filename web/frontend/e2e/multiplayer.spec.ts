import { test, expect, type Page } from "@playwright/test";

/**
 * TWO PAGES, ONE BOARD (T6 mark 13, MVP cut 1).
 *
 * ONE BROWSER CONTEXT, and that is the mechanism rather than a convenience: the local
 * transport arm is a `BroadcastChannel`, which is scoped to an origin WITHIN a context —
 * two contexts do not share it and this file would test nothing. The arm is selected by
 * `?wire=local` behind the transport seam, which is also why the row exists at all: the
 * shipped arm signals over PUBLIC Nostr relays, and a public relay in CI is a flake machine
 * wearing a test's clothes. The relay arm is verified by a two-browser manual probe against
 * the preview build, with crops; what CI owns is the protocol above the seam — join, roster,
 * both-ways sync, last-writer-wins, and the undo guard.
 *
 * THE FLOW IS THE PRODUCT'S, not a fixture's: page A presses the well's one verb, which mints
 * the room and writes `?board=&s=` into its own address bar; page B opens THAT URL. Nothing
 * here reaches past the UI to seed a session, so a break in the invite path reds here.
 */

const SOLO = "./?size=3&difficulty=EASY";
const cellInput = (p: Page, i: number) => p.locator(".sudoku-cell input").nth(i);

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
}

/** Every cell's digit, as one string — the same signature the interaction suite settles on. */
const boardSignature = (page: Page): Promise<string> =>
  page.evaluate(() =>
    Array.from(
      document.querySelectorAll(".sudoku-cell input"),
      (i) => (i as HTMLInputElement).value,
    ).join(","),
  );

/** The first cell no player and no deal has written — a free square to contend for. */
const firstEmpty = (page: Page): Promise<number> =>
  page.evaluate(
    () =>
      [...document.querySelectorAll(".sudoku-cell input")].findIndex(
        (i) => !(i as HTMLInputElement).value,
      ),
  );

async function write(page: Page, index: number, digit: string) {
  const cell = cellInput(page, index);
  await cell.click();
  await cell.fill(digit);
}

const digitAt = (page: Page, index: number) => cellInput(page, index).inputValue();

/** A's invite, taken from the address bar rather than the clipboard: `shareSession` writes
 *  `?s=` and `?board=` with `replaceState` BEFORE it touches the clipboard, which is exactly
 *  the property the share-truth rows exist to protect. */
async function invite(page: Page): Promise<string> {
  await page
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  expect(new URL(page.url()).searchParams.get("board")).not.toBeNull();
  return page.url();
}

const roster = (page: Page) =>
  page.locator(".controls-card .players-roster .player-row");

test("solo boot opens no room, and pays no bytes for one", async ({ page }) => {
  const chunks: string[] = [];
  page.on("request", (r) => chunks.push(r.url()));
  await boot(page, SOLO);

  // The transport is `import()`ed at join, so a page playing alone never fetches it. This is
  // the byte gate, and it is cheaper and more honest than a second size band: it asserts the
  // property (nothing loaded) rather than a number that drifts with every dependency bump.
  expect(chunks.filter((u) => /nostr|trystero/i.test(u))).toEqual([]);
  // No socket either — the `wss:` CSP grant admits the signalling, it does not summon it.
  expect(chunks.filter((u) => u.startsWith("ws"))).toEqual([]);

  // And the well shows its one verb, not a roster.
  await expect(
    page.locator('.controls-card button[aria-label="Play together on this board"]'),
  ).toBeVisible();
  await expect(roster(page)).toHaveCount(0);
});

test("the invite carries the board, and both pages sit at one table", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const link = await invite(a);

  const b = await ctx.newPage();
  await boot(b, link);

  // SAME BOARD, and no deal flash on the way in: the puzzle rode the permalink, so B restored
  // it rather than dealing one and being corrected.
  expect(await boardSignature(b)).toBe(await boardSignature(a));

  // TWO ROWS ON EACH PAGE, each naming itself. The slug is derived from the peer id, so it
  // costs no round trip and both pages agree on it.
  for (const p of [a, b]) {
    await expect(roster(p)).toHaveCount(2);
    await expect(p.locator(".players-roster .player-self")).toHaveText("you");
    await expect(p.locator(".players-note")).toHaveText(
      "anyone with this link can write on this board",
    );
  }
  const names = await roster(a).locator(".player-name").allInnerTexts();
  expect(new Set(names).size).toBe(2);
  expect(names.every((n) => /^[a-ik-wyz]+-[a-ik-wyz]+$/.test(n))).toBe(true);

  // A's row and B's row are two colours on the same screen: you are the incumbent blue and
  // everyone else walks the golden angle.
  const swatches = await roster(a)
    .locator(".player-swatch")
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundColor));
  expect(new Set(swatches).size).toBe(2);

  await ctx.close();
});

test("a digit crosses both ways, and it arrives in its author's ink", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const b = await ctx.newPage();
  await boot(b, await invite(a));

  const cellA = await firstEmpty(a);
  await write(a, cellA, "7");
  await expect.poll(() => digitAt(b, cellA)).toBe("7");

  const cellB = await firstEmpty(b);
  await write(b, cellB, "4");
  await expect.poll(() => digitAt(a, cellB)).toBe("4");

  // THE COLOUR IS THE AUTHOR'S, not the reader's. On B, the cell A wrote carries the rebound
  // `--color-user-ink`; the cell B wrote itself does not, and reads the incumbent blue. Both
  // resolve to a colour — this is the one place the whole ink story is observable at once.
  const inks = await b.evaluate(
    ([mine, theirs]) => {
      const glyph = (i: number) =>
        getComputedStyle(
          document
            .querySelectorAll(".sudoku-cell")
            [i].querySelector(".glyph-svg path")!,
        ).stroke;
      return { mine: glyph(mine), theirs: glyph(theirs) };
    },
    [cellB, cellA],
  );
  expect(inks.theirs).not.toBe(inks.mine);
  expect(inks.theirs).toMatch(/^(rgb|oklch|color)/);

  await ctx.close();
});

test("last writer wins the cell, on both pages", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const b = await ctx.newPage();
  await boot(b, await invite(a));

  const cell = await firstEmpty(a);
  await write(a, cell, "5");
  await expect.poll(() => digitAt(b, cell)).toBe("5");

  // B writes over A's digit. B merged A's Lamport clock when the op arrived, so B's stamp is
  // strictly newer and takes the cell — on B's own page AND back on A's, which is the half
  // that cannot be seen from one browser.
  await write(b, cell, "9");
  await expect.poll(() => digitAt(a, cell)).toBe("9");
  expect(await digitAt(b, cell)).toBe("9");

  // Converged, whole: the two boards are one board.
  expect(await boardSignature(a)).toBe(await boardSignature(b));

  await ctx.close();
});

test("undo skips a cell a peer has taken — your move is spent, their digit stands", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const b = await ctx.newPage();
  await boot(b, await invite(a));

  const cell = await firstEmpty(a);
  await write(a, cell, "5");
  await expect.poll(() => digitAt(b, cell)).toBe("5");
  await write(b, cell, "9");
  await expect.poll(() => digitAt(a, cell)).toBe("9");

  // A undoes its own write. Without the no-clobber guard this restores the empty cell and
  // then propagates the erasure as A's authoritative write — deleting B's digit on both
  // pages. With it, the entry is consumed and nothing moves.
  await a.locator(".sudoku-cell input").nth(cell).press("Meta+z");
  await a.waitForTimeout(250);
  expect(await digitAt(a, cell)).toBe("9");
  expect(await digitAt(b, cell)).toBe("9");

  await ctx.close();
});

test("a deal is an epoch: both boards follow, and neither undo stack crosses it", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const b = await ctx.newPage();
  await boot(b, await invite(a));

  const cell = await firstEmpty(b);
  await write(b, cell, "6");
  await expect.poll(() => digitAt(a, cell)).toBe("6");

  const before = await boardSignature(a);
  await a.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect.poll(() => boardSignature(a)).not.toBe(before);
  await expect.poll(() => boardSignature(b)).toBe(await boardSignature(a));

  // The epoch rule: B's log went with the board it annotated, so B's undo has nothing to
  // restore that anyone is still looking at.
  await b.locator(".sudoku-cell input").first().press("Meta+z");
  await b.waitForTimeout(250);
  expect(await boardSignature(b)).toBe(await boardSignature(a));

  await ctx.close();
});

test("leaving drops the room, the roster, and the parameter", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  await invite(a);
  await expect(roster(a)).toHaveCount(1);

  await a.locator(".controls-card .players-leave").click();
  await expect(roster(a)).toHaveCount(0);
  expect(new URL(a.url()).searchParams.get("s")).toBeNull();
  await expect(
    a.locator('.controls-card button[aria-label="Play together on this board"]'),
  ).toBeVisible();

  await ctx.close();
});
