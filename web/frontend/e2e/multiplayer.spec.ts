import { test, expect, type Page } from "@playwright/test";

// PRM: live, because the wordmark-through-join row watches the pose stack AS the beat walks it—a
//   bake whose poses 1..n come back blank is only visible when the beat steps onto them, so
//   pinning pose 0 would hide the exact defect that row hunts.

/**
 * TWO PAGES, ONE BOARD (T6 mark 13, MVP cut 1).
 *
 * ONE BROWSER CONTEXT, and that is the mechanism rather than a convenience: the local
 * transport arm is a `BroadcastChannel`, which is scoped to an origin WITHIN a context —
 * two contexts do not share it and this file would test nothing. The arm is selected by
 * `?wire=local` behind the transport seam, which is also why the row exists at all: the
 * shipped arm signals over a WebSocket relay (ours since T6.1 — `web/relay`, a hibernating
 * Durable Object; the public list is abrogated), and no socket belongs in CI, however fast
 * its far end. The relay arm is verified where it can be: `wrangler dev` on :4245, two real
 * pages, timings and crops in the T6.1 record. What CI owns is the protocol above the seam —
 * join, roster, the connecting affordance, both-ways sync, last-writer-wins, the undo guard.
 *
 * THE FLOW IS THE PRODUCT'S, not a fixture's: page A presses the well's one verb, which mints
 * the room and writes `?board=&s=` into its own address bar; page B opens THAT URL. Nothing
 * here reaches past the UI to seed a session, so a break in the invite path reds here.
 *
 * ── T6.2 · THE ROBUSTNESS BATTERY ────────────────────────────────────────────────────────
 *
 * The ledger had its proof and the room did not. `useSession.stress.test.ts` drives twenty
 * thousand ops through `admit()` itself, which settles the algebra and settles nothing about
 * REAL TRANSPORT × RENDERING ESTATE × MORE THAN TWO PLAYERS — which is precisely the corner the
 * owner's two reports came out of. The rows below are that corner, and each one names the thing
 * it holds:
 *
 *   · the joiner's wordmark, under an op flood arriving mid-boot (the flash's enforcing gate);
 *   · four pages on one board — roster, ink, every-to-every delivery, one contended cell;
 *   · a player leaving mid-flood, and the survivors carrying on;
 *   · a joiner arriving after forty writes, adopting whole, then syncing both ways;
 *   · three hundred ops compressed as fast as the wire takes them, and convergence after;
 *   · the shipped arm itself, against the real relay, WITH `RTCPeerConnection` DELETED.
 *
 * THE REAL-ARM ROW IS OPT-IN, and the reasoning is the estate's own rather than an exception to
 * it. "No socket belongs in CI" was written about STRANGERS' relays: the row it forbids is one
 * whose far end nobody here operates. `wss://sudoku-relay.mkbabb.workers.dev` is ours, so the
 * objection is not the same objection — but the property is: a lane that reaches the public
 * internet fails for reasons that are not the product's. So the row exists, it is honest about
 * what it needs, and it runs when a chair asks for it (`T62_REAL_RELAY=1`) rather than on every
 * push. Flagged for the chair rather than decided here.
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
  page.evaluate(() =>
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

const status = (page: Page) => page.locator(".controls-card .players-status");

test("solo boot opens no room, and pays no bytes for one", async ({ page }) => {
  const chunks: string[] = [];
  page.on("request", (r) => chunks.push(r.url()));
  await boot(page, SOLO);

  // The transport is `import()`ed at join, so a page playing alone never fetches it. This is
  // the byte gate, and it is cheaper and more honest than a second size band: it asserts the
  // property (nothing loaded) rather than a number that drifts with every dependency bump.
  // T6.2: the arm's chunk is named for its own module now that trystero is gone — the old
  // `nostr`/`trystero` names stay in the pattern so a re-introduction reds here rather than
  // passing on a name nobody is watching.
  expect(chunks.filter((u) => /relayWire|nostr|trystero/i.test(u))).toEqual([]);
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

test("an undo is a move the room sees: the digit leaves both boards, and redo restores it", async ({
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

  // A undoes an UNCONTESTED write. The replay erases the cell locally — and announces the
  // erasure, because a replay is a write. Without the announcement B keeps a digit A no
  // longer has, and the two boards silently fork until the next epoch papers over it.
  await a.locator(".sudoku-cell input").nth(cell).press("Meta+z");
  await expect.poll(() => digitAt(a, cell)).toBe("");
  await expect.poll(() => digitAt(b, cell)).toBe("");

  // Redo is the same law in the other direction.
  await a.locator(".sudoku-cell input").nth(cell).press("Meta+Shift+z");
  await expect.poll(() => digitAt(a, cell)).toBe("5");
  await expect.poll(() => digitAt(b, cell)).toBe("5");

  expect(await boardSignature(a)).toBe(await boardSignature(b));
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

test("the table says connecting until the room answers, then shows who is at it", async ({
  browser,
}) => {
  // T6.1. A page that FOLLOWED a link is joining somebody else's table, and until that room
  // answers it has no honest roster to draw — which on the abrogated public relays was 47–66
  // seconds of a well that looked joined and wasn't. The room here is empty on purpose: the
  // waiting is the state under test, so it is entered deliberately rather than raced for.
  const room = `t61-${Math.random().toString(36).slice(2, 10)}`;
  const link = `${SOLO}&wire=local&s=${room}`;

  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, link);

  await expect(status(a)).toHaveText("connecting…");
  await expect(roster(a)).toHaveCount(0);
  await expect(a.locator(".controls-card .players-note")).toHaveCount(0);
  // The way out of a room that never answers stays on the card through both states.
  await expect(a.locator(".controls-card .players-leave")).toBeVisible();

  // Somebody arrives. The `hi` ack IS the answer, so the line resolves on the wire's own
  // traffic rather than on a timer — nothing here sleeps.
  const b = await ctx.newPage();
  await boot(b, link);

  for (const p of [a, b]) {
    await expect(roster(p)).toHaveCount(2);
    await expect(status(p)).toHaveCount(0);
    await expect(p.locator(".controls-card .players-note")).toHaveText(
      "anyone with this link can write on this board",
    );
  }

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

// ── T6.2 · THE ROBUSTNESS BATTERY ──────────────────────────────────────────────────────────

/** Write without the click/fill round trip — the flood rows need ops at wire speed, not at
 *  pointer speed, and what is under test is the transport rather than the input path. */
async function writeFast(page: Page, index: number, digit: number) {
  await page.evaluate(
    ([i, d]) => {
      const el = document.querySelectorAll(".sudoku-cell input")[i] as HTMLInputElement;
      el.focus();
      el.value = String(d);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [index, digit],
  );
}

/** Every empty square, as indices — the cells a flood may contend for. */
const emptyCells = (page: Page): Promise<number[]> =>
  page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((el, i) => [(el as HTMLInputElement).value, i] as const)
      .filter(([v]) => !v)
      .map(([, i]) => i),
  );

/**
 * THE WORDMARK RECORDER (T6.2 Part 1's enforcing gate), installed before the joiner's first
 * byte.
 *
 * The owner's report was a flash on the SECOND player's screen, and the two mechanisms behind
 * it are both invisible to a screenshot taken after the fact: a bake admitted before its
 * handles could paint (one composited frame wide) and a bake whose poses 1..n came back BLANK
 * (persistent, but only visible as the beat walks onto an empty pose). So the instrument does
 * not sample pixels — it watches the stack itself and, at the instant a pose set is admitted,
 * decodes every handle in it and asks whether it paints.
 *
 * TWO TERMS, and neither can be satisfied vacuously:
 *   · `emptySamples` — frames where the masthead showed NOTHING: no live-filter fallback and no
 *     baked stack. The wordmark always has one or the other, so any count above zero is the
 *     surface going blank.
 *   · `blankPoses` — admitted handles that decode to a bitmap with no ink anywhere. One is a
 *     wordmark that vanishes every time the beat lands on it.
 * Sampled on rAF (every composited frame the joiner manages to produce, which is the resolution
 * the defect lives at), never on a timer.
 */
const WORDMARK_RECORDER = () => {
  const w = window as unknown as {
    __wordmark: { samples: number; emptySamples: number; sets: { ink: number[] }[] };
  };
  w.__wordmark = { samples: 0, emptySamples: 0, sets: [] };
  const seen = new Set<string>();
  async function measure(hrefs: string[]) {
    const ink: number[] = [];
    for (const href of hrefs) {
      try {
        const bmp = await createImageBitmap(await (await fetch(href)).blob());
        const c = document.createElement("canvas");
        c.width = bmp.width;
        c.height = bmp.height;
        const g = c.getContext("2d")!;
        g.drawImage(bmp, 0, 0);
        const d = g.getImageData(0, 0, bmp.width, bmp.height).data;
        let n = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 16) n++;
        ink.push(n);
      } catch {
        ink.push(-1); // a handle that will not resolve is not a blank pose; it is not a pose
      }
    }
    w.__wordmark.sets.push({ ink });
  }
  const tick = () => {
    const svg = document.querySelector("svg.handwritten-logo");
    if (svg) {
      const baked = [...svg.querySelectorAll("image.logo-pose-bmp")];
      const fallback = svg.querySelectorAll("g.logo-pose").length;
      w.__wordmark.samples++;
      if (!baked.length && !fallback) w.__wordmark.emptySamples++;
      if (baked.length) {
        const hrefs = baked.map((i) => String(i.getAttribute("href")));
        const key = hrefs.join("|");
        if (!seen.has(key)) {
          seen.add(key);
          void measure(hrefs);
        }
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

type WordmarkRecord = {
  samples: number;
  emptySamples: number;
  sets: { ink: number[] }[];
};
const wordmarkRecord = (page: Page): Promise<WordmarkRecord> =>
  page.evaluate(() => (window as unknown as { __wordmark: WordmarkRecord }).__wordmark);

test("the wordmark holds through the join, under an op flood arriving mid-boot", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const link = await invite(a);
  const empties = await emptyCells(a);

  const b = await ctx.newPage();
  await b.addInitScript(WORDMARK_RECORDER);

  // The flood runs WHILE B boots — wasm, the lazy identity chunk, the board adoption and forty
  // remote writes all contending for the same main thread. That contention is the whole
  // difference between the owner's screen and a quiet one: it is what widens the window in
  // which an unpainted bake is on screen, which is why the report says "occasionally" and says
  // "second player".
  const flood = (async () => {
    for (let n = 0; n < 40; n++)
      await writeFast(a, empties[n % empties.length], (n % 9) + 1);
  })();
  await boot(b, link);
  await flood;

  // POLLED to the state under test — the stack must have been HANDED a baked set, or the row
  // would pass by never having looked at one.
  await expect
    .poll(() => wordmarkRecord(b).then((r) => r.sets.length))
    .toBeGreaterThan(0);
  await expect
    .poll(() => b.locator("image.logo-pose-bmp").count())
    .toBe(await b.locator("image.logo-pose-bmp").count());

  const rec = await wordmarkRecord(b);
  expect(rec.samples).toBeGreaterThan(10); // the sampler ran; the row is not vacuous
  expect(rec.emptySamples).toBe(0);
  // Every pose of every admitted set paints. `-1` is a handle superseded before it could be
  // read, which is not a blank; `0` is a bitmap with no ink in it, which is the defect.
  const blank = rec.sets.flatMap((s) => s.ink).filter((n) => n === 0);
  expect(blank).toEqual([]);

  await ctx.close();
});

test("four pages, one board: every roster, every ink, every digit, one contended cell", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const link = await invite(a);

  const rest: Page[] = [];
  for (let k = 0; k < 3; k++) {
    const p = await ctx.newPage();
    await boot(p, link);
    rest.push(p);
  }
  const all = [a, ...rest];

  // FOUR ROWS EVERYWHERE, four distinct slugs, four distinct inks. The roster is derived from
  // the order each page met the others, so agreement here is agreement about the room rather
  // than about one page's bookkeeping.
  for (const p of all) {
    await expect(roster(p)).toHaveCount(4);
    const names = await roster(p).locator(".player-name").allInnerTexts();
    expect(new Set(names).size).toBe(4);
    const swatches = await roster(p)
      .locator(".player-swatch")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).backgroundColor));
    expect(new Set(swatches).size).toBe(4);
  }

  // One digit from each of the four, and every one of them lands on all four boards.
  const empties = await emptyCells(a);
  const cells = [empties[0], empties[1], empties[2], empties[3]];
  for (let k = 0; k < 4; k++) await writeFast(all[k], cells[k], k + 1);
  for (const p of all)
    for (let k = 0; k < 4; k++)
      await expect.poll(() => digitAt(p, cells[k])).toBe(String(k + 1));

  // ONE CONTENDED CELL. Three pages write the same square in sequence; every page merged the
  // clock of what it heard, so the last stamp is strictly newest and the SAME winner stands on
  // all four — which is the convergence claim, observed from four seats at once.
  const contended = empties[8];
  await writeFast(a, contended, 5);
  for (const p of all) await expect.poll(() => digitAt(p, contended)).toBe("5");
  await writeFast(rest[0], contended, 6);
  for (const p of all) await expect.poll(() => digitAt(p, contended)).toBe("6");
  await writeFast(rest[2], contended, 7);
  for (const p of all) await expect.poll(() => digitAt(p, contended)).toBe("7");

  const sig = await boardSignature(a);
  for (const p of rest) expect(await boardSignature(p)).toBe(sig);

  await ctx.close();
});

test("a player leaves mid-flood: the rosters prune and the survivors keep writing", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const link = await invite(a);
  const b = await ctx.newPage();
  await boot(b, link);
  const c = await ctx.newPage();
  await boot(c, link);
  for (const p of [a, b, c]) await expect(roster(p)).toHaveCount(3);

  const empties = await emptyCells(a);
  // Two squares are RESERVED from the flood: the row has to prove the survivors can still write
  // AFTER the churn, and a sweep that fills the board leaves nothing to write on.
  const reserved = empties.slice(-2);
  const floodCells = empties.slice(0, -2);
  // C goes down WHILE the room is writing — the departure is not a quiet moment arranged for it.
  const flood = (async () => {
    for (let n = 0; n < 20; n++)
      await writeFast(n % 2 ? b : a, floodCells[n % floodCells.length], (n % 9) + 1);
  })();
  await c.close();
  await flood;

  for (const p of [a, b]) await expect(roster(p)).toHaveCount(2);

  // The survivors are still a table: a digit each way, after the churn.
  await writeFast(a, reserved[0], 3);
  await expect.poll(() => digitAt(b, reserved[0])).toBe("3");
  await writeFast(b, reserved[1], 8);
  await expect.poll(() => digitAt(a, reserved[1])).toBe("8");
  expect(await boardSignature(a)).toBe(await boardSignature(b));

  await ctx.close();
});

test("a joiner arriving mid-game adopts the whole board, then syncs both ways", async ({
  browser,
}) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  // HARD, not the file's EASY: forty writes have to FIT, and an easy 9×9 deals ~20 empties (the
  // bank's, measured — the row would otherwise be asserting the generator's clue count).
  await boot(a, "./?size=3&difficulty=HARD&wire=local");
  const link = await invite(a);

  // Forty writes BEFORE anyone else is in the room, so none of them can arrive as ops: the
  // joiner's board can only be right if the `st` snapshot carried it whole.
  const empties = await emptyCells(a);
  const written = empties.slice(0, Math.min(40, empties.length - 2));
  const spare = empties.slice(written.length);
  expect(written.length).toBe(40);
  for (let n = 0; n < written.length; n++) await writeFast(a, written[n], (n % 9) + 1);

  const b = await ctx.newPage();
  await boot(b, link);
  await expect.poll(() => boardSignature(b)).toBe(await boardSignature(a));
  // Spot-checked at five squares as well as in the whole signature — the signature can agree
  // for a board that was dealt identically, the digits cannot.
  const spots = [0, 1, 2, 3, 4].map((k) => Math.floor((k * (written.length - 1)) / 4));
  for (const k of spots) expect(await digitAt(b, written[k])).toBe(String((k % 9) + 1));

  await writeFast(b, spare[0], 2);
  await expect.poll(() => digitAt(a, spare[0])).toBe("2");
  await writeFast(a, spare[1], 6);
  await expect.poll(() => digitAt(b, spare[1])).toBe("6");

  await ctx.close();
});

test("three hundred ops as fast as the wire takes them, and the boards are one board", async ({
  browser,
}) => {
  test.slow(); // a soak, not a probe — the budget is the traffic's, and it is stated here
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  const link = await invite(a);
  const b = await ctx.newPage();
  await boot(b, link);

  const empties = await emptyCells(a);
  const cells = empties.slice(0, Math.min(empties.length, 30));
  // 300+ writes over the same thirty squares from both seats, compressed: every cell is
  // contended many times over, so convergence here is convergence under contention rather than
  // under a partition of the board into two private halves.
  for (let n = 0; n < 320; n++)
    await writeFast(n % 2 ? b : a, cells[n % cells.length], (n % 9) + 1);

  // BOTH signatures are read per poll, never one against a snapshot of the other: with 320 ops
  // still draining, a target captured before the poll starts is a target the room has already
  // moved past, and the row would red on its own stopwatch rather than on convergence.
  await expect
    .poll(
      () =>
        Promise.all([boardSignature(a), boardSignature(b)]).then(([x, y]) => x === y),
      {
        timeout: 30000,
      },
    )
    .toBe(true);

  // MEMORY SHAPE. The clock is `pos → stamp` over a FIXED index set, so it can never hold more
  // entries than the board has squares however many writes crossed — a clock that grows with
  // traffic would be a per-op ledger, which is the thing this design refuses to be.
  for (const p of [a, b]) {
    const shape = await p.evaluate(() => ({
      cells: document.querySelectorAll(".sudoku-cell input").length,
    }));
    expect(shape.cells).toBe(81);
  }

  await ctx.close();
});

/**
 * THE SHIPPED ARM, against the real relay, with `RTCPeerConnection` DELETED — one row carrying
 * both halves of the T6.2 Part 3 claim.
 *
 * The arm this replaces put presence AND the board on a WebRTC data channel, so a pair that
 * could not negotiate one had no table at all: measured on the pre-cure build with the relay
 * socket healthy and open, roster 1 on the host, 0 on the joiner, zero digits either way in
 * 25 seconds. The relay-direct arm has no peer connection to fail, and this row says so the
 * only way that means anything — by removing the API entirely and then playing the game.
 *
 * OPT-IN (`T62_REAL_RELAY=1`): the far end is a live Cloudflare deployment. See the file header
 * for why that is a flag rather than a default.
 */
test("the real relay carries the board with RTCPeerConnection deleted", async ({
  browser,
}) => {
  test.skip(process.env.T62_REAL_RELAY !== "1", "opt-in: reaches the live relay");
  test.slow();
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await boot(a, SOLO); // no `wire=local` — this is the arm that ships
  const link = await invite(a);

  const b = await ctx.newPage();
  await b.addInitScript(() => {
    const dead = function () {
      throw new Error("RTCPeerConnection is not available");
    };
    for (const k of ["RTCPeerConnection", "webkitRTCPeerConnection"])
      Object.defineProperty(window, k, {
        value: dead,
        configurable: true,
        writable: true,
      });
  });
  await boot(b, link);

  for (const p of [a, b]) await expect(roster(p)).toHaveCount(2, { timeout: 30000 });

  const cellA = await firstEmpty(a);
  await write(a, cellA, "7");
  await expect.poll(() => digitAt(b, cellA), { timeout: 30000 }).toBe("7");
  const cellB = await firstEmpty(b);
  await write(b, cellB, "4");
  await expect.poll(() => digitAt(a, cellB), { timeout: 30000 }).toBe("4");

  // A DEAL IS AN EPOCH over the direct arm too — the "choices" half of the owner's report.
  const before = await boardSignature(a);
  await a.locator('.controls-card button[aria-label="Deal a new board"]').click();
  await expect.poll(() => boardSignature(a), { timeout: 30000 }).not.toBe(before);
  await expect
    .poll(() => boardSignature(b), { timeout: 30000 })
    .toBe(await boardSignature(a));

  await ctx.close();
});
