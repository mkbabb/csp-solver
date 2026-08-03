import { test, expect, type Page } from '@playwright/test';
import { pressCommitted } from './committed-press';

// PRM: live, because the rows ride the app's own beats—the destructive-work guard and the
//   answer-key laminate arrive on real transitions this file waits out, and PRM strips them
//   (index.css `animation: none` on that family). Nothing here reads a pixel the boil moves.

/**
 * T5-W3 — THE ACCESSIBLE BOARD, as gates.
 *
 * Six families, every one born RED at 78448760 (`docs/tranches/2026-08-tranche-5/evidence/
 * w3/probes/00-born-red.txt`). The figures each row disputes are the LIVE ones probed at
 * HEAD — `evidence/audit/r1/a11y.md` H1/H2/H3/M4/M5/M6, re-probed adversarially in
 * `r2/verify-gate-criticals.md` §H — not lint rule ids. The assertions are written against
 * the charter's SEMANTICS (`waves/T5-W3-a11y.md`), so they stay true through W4's re-skin:
 * a cure that moves the pixels but keeps the tree is still green here.
 *
 * DEFAULT CONFIG, both engines. Nothing here reads a baked bitmap or a bundle census, so the
 * dev-server suite is the right home; and the three tree-shaped defects (`inert` scoping, bare
 * `<svg>` mapping, `alertdialog` announcement) are exactly where Chromium and WebKit disagree
 * in the wild — r1 §C books WebKit as UNKNOWN, and running both engines is how that closes.
 *
 * TWO MEASURED FACTS ABOUT THE INSTRUMENT, both load-bearing:
 *
 *  1. Playwright's role engine does NOT honour `inert` — a `role="option"` inside an `inert`
 *     subtree still answers `getByRole('option')` in BOTH engines (measured at @playwright/test
 *     1.61.1). `inert` is precisely the mechanism that strips the picker's four flanks from the
 *     browser's tree (H3), so a role-count alone would green over the live defect. Every
 *     AX-VISIBILITY claim here is therefore asserted structurally against the stripping
 *     mechanisms — `inert` / `aria-hidden` / `display:none` / `visibility:hidden` on the node or
 *     any ancestor — and cross-checked, in Chromium only, against the browser's own AX tree.
 *  2. A bare `<svg>` maps to role `img` in Playwright's engine in both browsers, and an
 *     `aria-hidden` one drops out. That is what makes the unnamed-graphics census (M6) portable.
 *
 * DEAL-VARIANCE LAW (§3.6, and W2 lane B's scar — `evidence/w2/finisher/ax-mitigation.md`):
 * no figure that moves with the deal is ever asserted as a total. Every number below is either
 * read off the grid's own `aria-rowcount` (N, N²) or is structurally zero. Glyph counts are
 * ANNOTATED, never gated.
 */

// ── The estate, and how to reach each board ─────────────────────────
//
// `?game=` is universal (App.vue's `parseGame`, which validates it against GAMES and falls
// back to sudoku — cited by symbol, not by line: the old `App.vue:105` had drifted off it).
// Only sudoku and futoshiki URL-sync their size
// (`sizeParam` "size" / "board_size"); the other three deal at their `defaultSize`, which is
// why no size rides their query. No row below hardcodes a board side — N comes off the grid.
const GAMES = [
  { id: 'sudoku', query: 'game=sudoku&size=3&difficulty=EASY' },
  { id: 'futoshiki', query: 'game=futoshiki&board_size=5&difficulty=EASY' },
  { id: 'thermo', query: 'game=thermo&difficulty=EASY' },
  { id: 'killer', query: 'game=killer&difficulty=EASY' },
  { id: 'kenken', query: 'game=kenken&difficulty=EASY' },
] as const;

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Load a board and wait for it to SETTLE. Cells first, then the grid's draw-in→boil handoff
 * (`g.boil-frame-layer.is-active`, the suite's board-settle idiom — affordances.spec.ts:24).
 * Deliberately does NOT wait on glyphs: kenken deals with no givens at all, so a glyph poll
 * would hang there and bake a family-shaped assumption into a shared helper.
 */
async function loadBoard(page: Page, query: string) {
  await page.goto('./?' + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 20000 });
  await page.waitForSelector('g.boil-frame-layer.is-active', {
    state: 'attached',
    timeout: 20000,
  });
}

/**
 * The AX-visibility predicate, run in page: the four ways a node is stripped from the
 * accessibility tree. Returns the offending reason per matched element (`null` = published),
 * so a red says WHICH mechanism ate the node rather than "expected 5, got 1".
 */
async function axStrip(page: Page, selector: string): Promise<(string | null)[]> {
  return page.evaluate((sel) => {
    return [...document.querySelectorAll(sel)].map((el) => {
      for (let n: Element | null = el; n; n = n.parentElement) {
        if (n.hasAttribute('inert')) return 'inert';
        if (n.getAttribute('aria-hidden') === 'true') return 'aria-hidden';
        const cs = getComputedStyle(n);
        if (cs.display === 'none') return 'display:none';
        if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return 'visibility';
      }
      return null;
    });
  }, selector);
}

/**
 * The browser's OWN accessibility tree, Chromium only (CDP has no WebKit twin). A
 * strengthening, never the sole gate: the structural checks above carry both engines.
 */
async function chromiumAxRoleNames(page: Page, role: string): Promise<string[]> {
  const client = await page.context().newCDPSession(page);
  try {
    await client.send('Accessibility.enable');
    const { nodes } = (await client.send('Accessibility.getFullAXTree')) as {
      nodes: {
        ignored?: boolean;
        role?: { value?: string };
        name?: { value?: string };
      }[];
    };
    return nodes
      .filter((n) => !n.ignored && n.role?.value === role)
      .map((n) => n.name?.value ?? '');
  } finally {
    await client.detach();
  }
}

/** Page-wide image census: total vs. named, so `unnamed` is a difference of two role queries. */
async function imageCensus(page: Page) {
  const total = await page.getByRole('img').count();
  const named = await page.getByRole('img', { name: /\S/ }).count();
  return { total, named, unnamed: total - named };
}

/** User-authored entries, read off the cells' own accessible names (useGameCell.ts:114-135). */
function userEntries(page: Page) {
  return page.locator('input[aria-label*="your entry"]').count();
}

/** Type a digit into the first blank cell — a recorded edit, so the board goes dirty. */
async function dirtyTheBoard(page: Page) {
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll('.game-cell');
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector('.glyph-svg')) return i;
    return -1;
  });
  expect(blank).toBeGreaterThanOrEqual(0);
  await page.locator('.game-cell').nth(blank).click();
  await page.evaluate((idx) => {
    const input = document.querySelectorAll('.game-cell input')[idx] as HTMLInputElement;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setter.call(input, '1');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, blank);
  await expect(page.locator('.game-cell').nth(blank).locator('.glyph-svg')).toHaveCount(1);
}

/** Dirty sudoku → gallery → step to a DIFFERENT game → Enter: the guard ribbon arms. */
async function armGuard(page: Page) {
  await loadBoard(page, GAMES[0].query);
  await expect
    .poll(() => page.locator('.game-cell .glyph-svg').count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  await dirtyTheBoard(page);
  // GUARDED PRESS (T7-W3 §9). The wordmark tears out its live pose stack when the bake lands
  // and WebKit drops the half of the mouse pair whose target went with it — measured 2/30.
  // This row was shielded only by having waited out a dealt board first, which is a timing
  // accident and not a contract. Committed effect: the deck is open.
  const viewport = page.locator('.gallery-viewport');
  await pressCommitted(page.locator('button.logo-trigger'), viewport, {
    what: 'the gallery deck',
    budgetMs: 20000,
  });
  await viewport.press('ArrowRight'); // → futoshiki, a different game
  // SETTLED, NOT SLEPT (T7-W3, the sleep-lint residue). `Enter` selects whatever the deck has
  // COMMITTED, so the precondition is the commit itself, not an elapsed span: the listbox's own
  // `aria-activedescendant` and the flank's `aria-selected`, both auto-retrying. The old fixed
  // 700ms stood in for exactly these two facts and could not red — a press sent into a deck that
  // had not committed yet selects sudoku, arms no guard, and every caller inherits the race.
  await expect(viewport).toHaveAttribute('aria-activedescendant', 'gallery-card-1');
  await expect(page.locator('#gallery-card-1')).toHaveAttribute('aria-selected', 'true');
  await viewport.press('Enter');
  await page.locator('.gallery-guard').waitFor({ state: 'visible', timeout: 20000 });
}

/**
 * Is the guard's ARMED STATE announced? Two honest cures, either satisfies:
 *  · a live region (anywhere) speaks the guard's own name — read OFF the guard rather than
 *    hardcoded, so the copy may change without touching this gate; or
 *  · the ribbon itself is an announcing surface (`role="alert"` / `aria-live`), which is what
 *    `role="alertdialog"` alone is NOT (it carries no implicit live semantics — r2 §H2).
 */
async function guardAnnounced(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const guard = document.querySelector('.gallery-guard');
    if (!guard) return false;
    const norm = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (guard.getAttribute('role') === 'alert' || guard.hasAttribute('aria-live')) return true;
    const key = norm(guard.getAttribute('aria-label')).replace(/[?.!]+$/, '');
    if (!key) return false;
    return [...document.querySelectorAll('[aria-live],[role="status"],[role="alert"]')].some(
      (r) => norm(r.textContent).includes(key),
    );
  });
}

/**
 * THE SETTLED VERDICT OF THE SECOND ENTER (T7-W3 — CH-63 instance 8, the discipline cure).
 *
 * One atomic read of the page: both settled outcomes AND the entry count the row asserts, so
 * the settle and the figure can never be sampled at different instants — which is precisely
 * what a sleep guarantees they are.
 *
 *  · HELD — the ribbon is still up and the app is still on the outgoing game. Nothing was
 *    discarded, and nothing can be: the switch is what discards.
 *  · SWAPPED — the app committed the switch (`?game=` is App's own truth, written synchronously
 *    by `setGame` inside the select handler) AND the outgoing scene is gone (`.sudoku-cell`, a
 *    frozen DOM contract — DigitCell.vue). Only then is `entries` the post-discard count rather
 *    than a mid-teardown reading of a board still being erased.
 *
 * `enterSeen` is what makes this a settle rather than a race. The capture-phase witness counts
 * the key into the document ahead of every app handler, and everything the app does with it —
 * `guardLeave` → `select` → `setGame` — is synchronous with that dispatch, so a sample that has
 * seen the key has seen the app's whole answer to it. Without the witness the first poll tick
 * reads HELD off a ribbon that has not been told yet, which is the old sleep's false green with
 * a shorter timer.
 */
async function enterVerdict(page: Page) {
  return page.evaluate(() => {
    const guard = document.querySelector('.gallery-guard');
    return {
      enterSeen: (window as unknown as { __enterSeen?: number }).__enterSeen ?? 0,
      ribbon: !!guard && guard.getClientRects().length > 0,
      game: new URLSearchParams(location.search).get('game') ?? 'sudoku',
      outgoing: document.querySelectorAll('.sudoku-cell').length,
      entries: document.querySelectorAll('input[aria-label*="your entry"]').length,
    };
  });
}

/** Name the sampled state, so a poll that never settles reds with WHAT it kept seeing. */
function settleName(v: Awaited<ReturnType<typeof enterVerdict>>) {
  if (v.enterSeen === 0) return `unheard — the key never reached the app ${JSON.stringify(v)}`;
  if (v.ribbon && v.game === 'sudoku') return 'held';
  if (v.game !== 'sudoku' && v.outgoing === 0) return 'swapped';
  return `in flight ${JSON.stringify(v)}`;
}

/** The answer-key peek, as the page publishes it: the laminate plus its own status utterance. */
async function peekState(page: Page) {
  return page.evaluate(() => ({
    laminate: document.querySelectorAll('.answer-key-laminate').length,
    announced: [...document.querySelectorAll('[role="status"],[role="alert"]')].some((n) =>
      /peek/i.test(n.textContent ?? ''),
    ),
  }));
}

// ═══ 3.1 rowsPerGrid — the grid grows its row layer ═════════════════
//
// HEAD: {grid:1, gridcell:81, row:0} on every board (r1 H1, r2 §H1 through the grid's own
// childIds). `grid` requires owned `row`s; the coordinates ride the cells' names as prose,
// which is why the board is usable and still structurally a lie.

test.describe('3.1 rowsPerGrid', () => {
  for (const { id, query } of GAMES) {
    test(`${id}: the AX tree reads grid → row → gridcell, N rows of N cells`, async ({
      page,
    }) => {
      await loadBoard(page, query);

      const grid = page.locator('[role="grid"]');
      await expect(grid).toHaveCount(1);

      // N off the grid itself — never a literal, never a deal-derived total (§3.6).
      const n = Number(await grid.getAttribute('aria-rowcount'));
      const cols = Number(await grid.getAttribute('aria-colcount'));
      expect(n, 'the grid must publish its own row count').toBeGreaterThanOrEqual(4);
      expect(cols, 'a square board: colcount === rowcount').toBe(n);
      // The declared shape must match the cells that exist, so rowcount cannot be fiction.
      await expect(grid.getByRole('gridcell')).toHaveCount(n * n);

      // THE GATE: a real row layer, N rows, each owning exactly N gridcells.
      const rows = grid.getByRole('row');
      await expect(rows, `${id}: role="grid" must own ${n} rows`).toHaveCount(n);

      // No orphan cells: every gridcell in the grid is inside a row.
      expect(await rows.getByRole('gridcell').count()).toBe(n * n);

      // Row-by-row: N cells, one shared row index, columns exactly 1..N. This is the
      // "indices exposed" half — asserted per-row from the cells' own attributes rather than
      // demanding a particular attribute on the row, so either ARIA idiom (explicit
      // aria-rowindex, or DOM order) satisfies it.
      const shape = await page.evaluate(() => {
        const grid = document.querySelector('[role="grid"]')!;
        return [...grid.querySelectorAll('[role="row"]')].map((row) => {
          const cells = [...row.querySelectorAll('[role="gridcell"]')];
          return {
            cells: cells.length,
            rowIndices: [...new Set(cells.map((c) => c.getAttribute('aria-rowindex')))],
            colIndices: cells.map((c) => Number(c.getAttribute('aria-colindex'))),
          };
        });
      });
      expect(shape).toHaveLength(n);
      shape.forEach((row, i) => {
        expect(row.cells, `row ${i + 1} owns ${n} gridcells`).toBe(n);
        expect(row.rowIndices, `row ${i + 1} cells share one row index`).toEqual([
          String(i + 1),
        ]);
        expect(row.colIndices, `row ${i + 1} columns are 1..${n}`).toEqual(
          Array.from({ length: n }, (_, c) => c + 1),
        );
      });
    });
  }
});

// ═══ 3.2 guardAnnounced — the destructive-work guard speaks ═════════
//
// HEAD: `aria-modal` null, no describedby, focus never enters, the only polite region still
// reads the CARD; the second Enter takes user entries 1 → 0 with nothing ever spoken
// (r2 §H2, reproduced through to the destroyed board).

test.describe('3.2 guardAnnounced', () => {
  test('arming the destructive-work guard announces its armed state', async ({ page }) => {
    await armGuard(page);
    const guard = page.locator('.gallery-guard');
    await expect(guard).toBeVisible();

    // Control: the ribbon is there and named — the defect is the SILENCE, not the absence.
    expect((await guard.getAttribute('aria-label')) ?? '').not.toBe('');

    const announced = await guardAnnounced(page);
    const heard = await page.evaluate(() =>
      [...document.querySelectorAll('[aria-live],[role="status"],[role="alert"]')].map((r) =>
        (r.textContent ?? '').replace(/\s+/g, ' ').trim(),
      ),
    );
    expect(
      announced,
      `the armed guard was never announced; live regions said ${JSON.stringify(heard)}`,
    ).toBe(true);
  });

  test('the armed guard contains focus (aria-modal + focus inside the dialog)', async ({
    page,
  }) => {
    await armGuard(page);
    const guard = page.locator('.gallery-guard');
    await expect(guard).toHaveAttribute('role', 'alertdialog');
    await expect(guard).toHaveAttribute('aria-modal', 'true');

    const where = await page.evaluate(() => {
      const g = document.querySelector('.gallery-guard')!;
      const a = document.activeElement;
      return {
        inside: g.contains(a),
        activeTag: a?.tagName ?? null,
        activeRole: a?.getAttribute('role') ?? null,
      };
    });
    expect(
      where.inside,
      `focus stayed outside the armed dialog (on ${where.activeTag}/${where.activeRole})`,
    ).toBe(true);
  });

  test('a second Enter cannot discard the board unheard', async ({ page }) => {
    await armGuard(page);
    const before = await userEntries(page);
    expect(before, 'the board must be dirty for this row to mean anything').toBeGreaterThan(0);

    const announced = await guardAnnounced(page);

    // The witness goes in FIRST, capture phase, so it counts the key ahead of every app
    // handler and no sample below can resolve before the app has answered the press.
    await page.evaluate(() => {
      const w = window as unknown as { __enterSeen: number };
      w.__enterSeen = 0;
      window.addEventListener('keydown', (e) => e.key === 'Enter' && w.__enterSeen++, true);
    });
    await page.keyboard.press('Enter');

    // THE POLLED DISJUNCTION (T7-W3, CH-63 instance 8) — this was a 2000ms sleep, and the
    // sleep is what made the row a lie: `userEntries` is a count the guard the test is racing
    // can still mutate, so a loaded runner read it MID-SWAP, saw it unchanged, and greened a
    // guard that had never been heard. Both settled outcomes are polled for by name, together
    // with the count, and the third outcome — a guard that neither holds nor completes — reds
    // here rather than passing as "unchanged".
    let seen = await enterVerdict(page);
    await expect
      .poll(
        async () => {
          seen = await enterVerdict(page);
          return settleName(seen);
        },
        {
          timeout: 15000,
          message:
            'the second Enter must settle into HELD (the ribbon still up, still on sudoku) ' +
            'or SWAPPED (the switch committed and the outgoing board gone)',
        },
      )
      .toMatch(/^(held|swapped)$/);
    const after = seen.entries;

    // The implication, not a bare count: work may only be discarded if the arming was spoken.
    // The count is now read off the SETTLED sample above, so `after === before` means the work
    // survived rather than "the work had not been taken yet when the timer went off".
    expect(
      announced || after === before,
      `the guard armed silently (announced=${announced}) and the second Enter settled as ` +
        `${settleName(seen)}, taking the board from ${before} user entries to ${after}`,
    ).toBe(true);
  });
});

// ═══ 3.3 optionsInPicker — the picker publishes five ════════════════
//
// HEAD: five `role="option"` nodes in the DOM with resolving names and truthful
// `aria-selected`, four of them `inert` — Chrome publishes a ONE-item listbox (r1 H3, r2 §H3).
// The cure scopes `inert` to the cards' interactive internals; the cards stay options.

test.describe('3.3 optionsInPicker', () => {
  test('the picker publishes five named, AX-visible options', async ({ page, browserName }) => {
    await page.goto('./?view=gallery&game=sudoku&size=3&difficulty=EASY');
    await page.waitForSelector('.game-gallery', { timeout: 20000 });
    await page.waitForTimeout(800); // the deck's entry beats, settled (filter-census idiom)

    // Control: the deck itself is whole — five options, each with an accessible name that
    // states its place in the deck. (True at HEAD; the defect is purely the AX strip.)
    await expect(page.getByRole('option')).toHaveCount(5);
    await expect(page.getByRole('option', { name: /\S/ })).toHaveCount(5);
    for (const { id } of GAMES) {
      await expect(page.getByRole('option', { name: new RegExp(id, 'i') })).toHaveCount(1);
    }
    await expect(page.getByRole('option', { name: /5 of 5/ })).toHaveCount(1);

    // THE GATE, strongest instrument first: in Chromium, the browser's OWN tree — the same
    // instrument r1/r2 banked the one-item listbox with. Ordered ahead of the structural half
    // so this path is exercised on every run rather than sitting behind a red.
    if (browserName === 'chromium') {
      const names = await chromiumAxRoleNames(page, 'option');
      expect(
        names,
        `the browser AX tree publishes ${names.length} options: ${JSON.stringify(names)}`,
      ).toHaveLength(5);
      expect(names.filter((n) => n.trim() !== ''), 'every published option is named').toHaveLength(
        5,
      );
    }

    // The portable half. Playwright's role engine ignores `inert` (header note 1), so the
    // strip is asserted against its mechanisms directly — which is what carries WebKit, where
    // no CDP twin exists and r1 §C left the mapping UNKNOWN.
    const stripped = await axStrip(page, '[role="option"]');
    expect(
      stripped.filter((s) => s !== null),
      `options stripped from the accessibility tree: ${JSON.stringify(stripped)}`,
    ).toEqual([]);
  });
});

// ═══ 3.4 ctrlKDoesNotPeek — single-key shortcuts guarded ════════════
//
// HEAD: `useAnswerKeyPeek.ts:55-70` is a window-level keydown with no modifier guard and a
// `preventDefault()`, so Ctrl+K / Cmd+K flash the answer key over the board (r1 M4). The
// correct pattern already exists twice in the estate — the `e.metaKey || e.ctrlKey ||
// e.altKey` bail in App.vue's `onGlobalKeydown` (the `g` shortcut) and in GameGallery's
// `onKeydown` (the `d` verb). Cited by symbol, not by line: the old `App.vue:438` /
// `GameGallery.vue:482` had both drifted off their guards.

test.describe('3.4 ctrlKDoesNotPeek', () => {
  test('Ctrl+K and Cmd+K never trigger the single-key peek', async ({ page }) => {
    await loadBoard(page, GAMES[0].query);
    await page.locator('.game-cell input').first().focus();

    // CONTROL FIRST: bare K must still peek. A cure that deletes the shortcut is not a cure,
    // and this row would otherwise green on an amputation.
    await page.keyboard.press('k');
    await expect.poll(async () => (await peekState(page)).laminate).toBe(1);
    await page.keyboard.press('Escape');
    await expect.poll(async () => (await peekState(page)).laminate).toBe(0);

    // THE GATE: the modifier chords belong to the browser, not the board.
    for (const chord of ['Control+k', 'Meta+k']) {
      await page.locator('.game-cell input').first().focus();
      await page.keyboard.press(chord);
      // The claim is an ABSENCE across a window — the laminate must never lay down — so there is
      // no state to poll toward: `expect.poll(…).toBe(0)` greens on its first tick against a
      // peek that simply has not arrived yet. The control above (bare `k`, POLLED to
      // `laminate === 1`, then Escape polled back to 0) proves in this same test that the key
      // pipeline is live, so a quiet window here is a real silence and not a dead surface.
      // sleep-ok: the 600ms IS the observation window, sized past the laminate's rAF + transition
      await page.waitForTimeout(600);
      const state = await peekState(page);
      expect(state, `${chord} triggered the answer-key peek`).toEqual({
        laminate: 0,
        announced: false,
      });
    }
  });

  test('a keyboard-shortcuts help names k, g, h, p and d', async ({ page }) => {
    await loadBoard(page, GAMES[0].query);

    const help = page.getByLabel(/keyboard shortcuts/i);
    await expect(help, 'the estate must publish a keyboard-shortcuts help').toHaveCount(1);

    // Reachable at rest — a crib inside an `inert` or hidden subtree is a crib nobody has
    // (r1 L10: the legend lives in the rail, which is `inert` whenever the drawer is closed).
    const stripped = await axStrip(page, '.keyboard-legend');
    expect(stripped.filter((s) => s !== null), 'the help is stripped from the tree').toEqual(
      [],
    );

    // THE GATE: every single-key shortcut the app binds is named. innerText (not textContent)
    // because the rendered text is what carries the token boundaries a reader hears.
    const text = await help.innerText();
    const missing = ['k', 'g', 'h', 'p', 'd'].filter(
      (key) => !new RegExp(`(^|[^a-z])${key}([^a-z]|$)`, 'i').test(text),
    );
    expect(missing, `shortcuts help omits ${missing.join(', ')} — it reads ${JSON.stringify(text)}`).toEqual(
      [],
    );
  });
});

// ═══ 3.5 unnamedImages — the graphics census ════════════════════════
//
// HEAD: 155 `image` nodes on a dealt 9×9, 62 named (the glyphs, which double-announce) and
// 93 unnamed — 81 of them the per-cell ghost rings (r1 M5/M6).

test.describe('3.5 unnamedImages', () => {
  test('a dealt board publishes zero unnamed image nodes', async ({ page }) => {
    await loadBoard(page, GAMES[0].query);
    await expect
      .poll(() => page.locator('.game-cell .glyph-svg').count(), { timeout: 20000 })
      .toBeGreaterThan(0);

    // POLLED, NOT ONE-SHOT (T7-W3 — the third discipline row, handed over by
    // `docs/tranches/2026-08-tranche-7/evidence/w3/burst-forensics.md` §2, reds 4 and 5). No
    // sleep precedes this read, so the sleep lint never sees it — and it is the same disease
    // anyway: `unnamed` is a DIFFERENCE OF TWO COUNTS taken off a board whose ghost rings are
    // still being named as the glyphs land, and the row red twice in CI (`a11y:490`, webkit,
    // runs 30770223565 and 30781866393) on `0 ≠ 1` — one ring, read a beat early. The figure
    // now has to agree with the assertion rather than merely coincide with it.
    let census = await imageCensus(page);
    await expect
      .poll(
        async () => {
          census = await imageCensus(page);
          return `${census.unnamed} unnamed of ${census.total}`;
        },
        {
          timeout: 15000,
          message:
            'decorative graphics must carry aria-hidden and meaningful ones a name; the ' +
            'census never settled at zero unnamed image nodes',
        },
      )
      .toMatch(/^0 unnamed of /);

    // Deal-invariant by construction: the gate is ZERO, and the total is only ever reported.
    test.info().annotations.push({
      type: 'image-census',
      description: `total=${census.total} named=${census.named} unnamed=${census.unnamed}`,
    });
  });

  test('a filled cell announces its value exactly once', async ({ page }) => {
    await loadBoard(page, GAMES[0].query);
    await expect
      .poll(() => page.locator('.game-cell .glyph-svg').count(), { timeout: 20000 })
      .toBeGreaterThan(0);

    const grid = page.locator('[role="grid"]');

    // CONTROL: the value already rides the cell's own accessible name — the ONE announcement.
    // Per-cell and role-based; the number of filled cells is never asserted (§3.6).
    const filled = await page.evaluate(() => {
      return [...document.querySelectorAll('[role="gridcell"]')]
        .map((cell) => {
          const label = cell.querySelector('input')?.getAttribute('aria-label') ?? '';
          const m = /(?:given clue|your entry|solver's answer)\s+(\S+)$/.exec(label);
          return m ? { label, value: m[1] } : null;
        })
        .filter((c): c is { label: string; value: string } => c !== null);
    });
    expect(filled.length, 'the board must be dealt for this row to mean anything').toBeGreaterThan(
      0,
    );
    test.info().annotations.push({
      type: 'deal-variance',
      description: `filled cells this deal: ${filled.length} (annotated, never asserted)`,
    });

    // THE GATE: no gridcell carries a SECOND named node repeating what its name already says.
    // The SVG label layer (HandwrittenGlyph.vue:304 — `aria-label` with no role) is the leak;
    // a decorative glyph is `aria-hidden`, a meaningful one is the cell's name, never both.
    const echoes = await grid.getByRole('img', { name: /\S/ }).count();
    expect(
      echoes,
      `${echoes} named image nodes inside gridcells — each is a second utterance of a digit ` +
        `the cell's own name already carries`,
    ).toBe(0);
  });
});

// ═══ 3.6 stability — the figures are structural, never magic ════════
//
// W2 lane B learned this the hard way (evidence/w2/finisher/ax-mitigation.md): a gate pinned
// to a deal-derived total either flakes or gets re-baselined. These two rows prove the gates
// above are functions of N and of structure — nothing else.

test.describe('3.6 stability', () => {
  test('the grid invariants track N (4×4 and 9×9), never a magic total', async ({ page }) => {
    // Sudoku's raw selector size is the SUB-GRID side, so 2 → 4×4 and 3 → 9×9 (selectors.ts).
    for (const [size, side] of [
      [2, 4],
      [3, 9],
    ] as const) {
      await loadBoard(page, `game=sudoku&size=${size}&difficulty=EASY`);
      const grid = page.locator('[role="grid"]');
      const n = Number(await grid.getAttribute('aria-rowcount'));
      expect(n, `?size=${size} deals an ${side}×${side} board`).toBe(side);
      await expect(grid.getByRole('gridcell')).toHaveCount(n * n);
      await expect(grid.getByRole('row'), `${side}×${side}: ${side} rows`).toHaveCount(n);
      expect((await imageCensus(page)).unnamed, `${side}×${side}: no unnamed graphics`).toBe(0);
    }
  });

  test('the invariants survive a re-deal (deal-variant figures never asserted)', async ({
    page,
  }) => {
    await loadBoard(page, GAMES[0].query);
    await expect
      .poll(() => page.locator('.game-cell .glyph-svg').count(), { timeout: 20000 })
      .toBeGreaterThan(0);

    const snapshot = async () => {
      const grid = page.locator('[role="grid"]');
      const n = Number(await grid.getAttribute('aria-rowcount'));
      return {
        n,
        rows: await grid.getByRole('row').count(),
        gridcells: await grid.getByRole('gridcell').count(),
        unnamedImages: (await imageCensus(page)).unnamed,
        namedInGrid: await grid.getByRole('img', { name: /\S/ }).count(),
        // deal-variant, carried for the annotation only — NOT compared below.
        glyphs: await page.locator('.game-cell .glyph-svg').count(),
      };
    };

    const a = await snapshot();
    await page.locator('.controls-card button[aria-label="Deal a new board"]').click();
    await page.waitForSelector('g.boil-frame-layer.is-active', {
      state: 'attached',
      timeout: 20000,
    });
    await expect
      .poll(() => page.locator('.game-cell .glyph-svg').count(), { timeout: 20000 })
      .toBeGreaterThan(0);
    const b = await snapshot();

    test.info().annotations.push({
      type: 'deal-variance',
      description: `glyphs deal A=${a.glyphs} B=${b.glyphs} (annotated, never asserted)`,
    });

    // The SHAPE is deal-invariant by construction — compared across the two deals. The two
    // censuses are NOT compared to each other: a given-count differs deal to deal, and a gate
    // that equated them would be the very magic-total trap this row exists to forbid. They are
    // each asserted at their structural value, on BOTH deals.
    const shape = ({ n, rows, gridcells }: Awaited<ReturnType<typeof snapshot>>) => ({
      n,
      rows,
      gridcells,
    });
    expect(shape(b), 'the grid shape must not move with the deal').toEqual(shape(a));
    for (const [label, s] of [
      ['deal A', a],
      ['deal B', b],
    ] as const) {
      expect(s.rows, `${label}: N rows`).toBe(s.n);
      expect(s.gridcells, `${label}: N² gridcells`).toBe(s.n * s.n);
      expect(s.unnamedImages, `${label}: zero unnamed graphics`).toBe(0);
      expect(s.namedInGrid, `${label}: zero digit echoes inside the grid`).toBe(0);
    }
  });
});
