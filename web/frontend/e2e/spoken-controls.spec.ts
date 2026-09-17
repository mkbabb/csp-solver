import { test, expect, type Page } from '@playwright/test';

/**
 * T9-W3 §3.1 / §3.5 / §3.6 — THE PANEL SPEAKS.
 *
 * Three subjects, one file, because all three are the same claim said three ways: what the
 * screen shows and what the accessibility tree says must be the same thing.
 *
 *   §3.1 THE OCCLUSION LAW — the risen sheet paints the board out and every cell of it STAYED
 *        in the tab order and in the AX tree: 81 of 81 focusable at all three poses with the
 *        sheet up. That 81/81 is the P0, and it is what these rows forbid.
 *        THE COVERAGE METRIC OF RECORD IS CENTRE-UNDER-SHEET, GEOMETRIC — a cell counts as
 *        covered when its own centre lies inside the risen sheet's rect. That is what
 *        `coveredCells` below takes, and the figures are 81 of 81 at 390x844, 63 of 81 at
 *        768x1024, 54 of 81 at 820x1180, identical on both engines; sheet shut, 0 covered at
 *        all three. Three figure sets were loose in the estate and this header carried one of
 *        them; the chair's ruling is the dated ADJUSTED note at T9-W3 §3.1, and the seal's
 *        re-derivation is `evidence/w3/seal/S1-27-census-rederived-both-engines.txt`.
 *        WHY THIS HEADER'S OLD NUMBERS WERE WRONG, because the same trap is one line away: a
 *        census taken before the grid finishes sizing counts only the cells that already have
 *        a box and answers about a third of the board. Poll for 81 laid-out cells first.
 *        THE CURE'S MECHANISM IS MODAL, not geometric: the risen sheet inerts the WHOLE grid,
 *        not only the squares it paints over, so 18 cells at 768x1024 and 27 at 820x1180 that
 *        are geometrically clear of the sheet also lose focusability while it is up. One
 *        predicate, by decision — a half-covered cell is ambiguous, and the tab is the sheet's
 *        only route out. The estate already owns the mechanism and wrote the rule down beside
 *        it (`GameControlPanel.vue`, the `.play-controls` `inert` clause: "a control painted
 *        out end to end must not answer"); these rows extend that rule to the board.
 *   §3.5 DEALS AND FORCED FILLS ANNOUNCE — a deal produced zero utterances and a fill-forced
 *        that inked eleven cells produced zero.
 *   §3.6 THE COPY ACT REACHES AT — the outcome was drawn and never spoken, and for 1600ms the
 *        accessible name contradicted the sublabel under the same glyph.
 *
 * GATE-1 DISCIPLINE: every row carries its own control INSIDE the run. A probe that cannot
 * see the defect would score anything green, so each occlusion row proves the same instrument
 * finds the board live with the sheet SHUT before it asserts it is dead with the sheet UP.
 */

/** The portrait dock at its measured rung — the cell the covered-board sweep was taken at. */
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
/** The other viewport class the same sheet covers (63 of 81 by the centre census above). */
const TABLET = { viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true };

async function loadSudoku(page: Page) {
  await page.goto('./?size=3&difficulty=EASY');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await page.addStyleTag({ content: '.tuner-toggle { display: none !important; }' });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}

/** THE DOCK SHEET SLIDES — `toBeVisible` resolves mid-glide, so settle on the Band-D clock. */
async function openDrawer(page: Page) {
  await page.locator('.drawer-tab').click();
  await expect(page.locator('#controls-drawer .drawer-case')).toBeVisible();
  await page.waitForTimeout(700);
}

/**
 * How much of the board the risen sheet actually paints over — the metric of record, read
 * GEOMETRICALLY: a cell is covered when its own centre lies inside the sheet's rect. This is
 * the number the row exists for: a cure that left the board uncovered would make every
 * assertion below vacuous.
 *
 * IT IS NOT A HIT-TEST, and that is the whole point. This census used to call
 * `document.elementFromPoint` on each centre, which cannot measure occlusion on a CURED tree:
 * `inert` takes an element out of hit-testing, so once the cure lands every cell reads as
 * covered whatever the geometry — 81 of 81 at all three poses, both engines, measured
 * (`evidence/w3/seal/S1-27-census-rederived-both-engines.txt`; the prove lane's own control,
 * `inertIsBox: false`, is the mechanism). A premise that is satisfied by the cure it is meant
 * to be independent of is not a premise.
 */
async function coveredCells(page: Page): Promise<{ total: number; covered: number }> {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
    const sheet = document.querySelector('#controls-drawer .drawer-case');
    const s = sheet?.getBoundingClientRect() ?? null;
    let covered = 0;
    for (const c of cells) {
      const r = c.getBoundingClientRect();
      if (r.width === 0 || !s) continue;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      if (cx >= s.left && cx <= s.right && cy >= s.top && cy <= s.bottom) covered++;
    }
    return { total: cells.length, covered };
  });
}

/** Every cell has a box. A census taken mid-layout counts a third of the board and lies low;
 *  this is what the stale figures in this file's header were measuring. */
async function boardLaidOut(page: Page) {
  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            [...document.querySelectorAll('.board-cells .game-cell')].filter(
              (c) => c.getBoundingClientRect().width > 0,
            ).length,
        ),
      { timeout: 15000 },
    )
    .toBe(81);
}

/** Where a Tab walk from inside the risen sheet lands, and whether any stop is a board cell. */
async function tabWalk(page: Page, steps: number) {
  const stops: string[] = [];
  let intoGrid = 0;
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press('Tab');
    const where = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return { tag: 'none', inGrid: false };
      return {
        tag: `${a.tagName.toLowerCase()}.${(a.className || '').toString().split(' ')[0]}`,
        inGrid: !!a.closest('.board-cells'),
      };
    });
    stops.push(where.tag);
    if (where.inGrid) intoGrid++;
  }
  return { stops, intoGrid };
}

/** Can a covered cell still be driven? Focus its own input and type into it. */
async function writeIntoCell(page: Page, index: number) {
  return page.evaluate((i) => {
    const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
    const cell = cells[i];
    const input = cell?.querySelector<HTMLElement>('.cell-native-input');
    if (!input) return { focused: false, activeInGrid: false };
    input.focus();
    const a = document.activeElement as HTMLElement | null;
    return { focused: a === input, activeInGrid: !!a?.closest('.board-cells') };
  }, index);
}

/** The first cell with no printed digit — the one a stray keystroke would actually write to.
 *  Read off the INPUT'S VALUE, not off a class: `is-given` is a prop on the child glyph
 *  (`DigitCell.vue:394`) and no `.game-cell` ever carries it as a class, so a class filter is
 *  true of all 81 cells and answers 0 on every board (measured both engines,
 *  evidence/w3/prove/PROVE-RECORD.md finding 2). */
async function firstEmptyCell(page: Page): Promise<number> {
  return page.evaluate(() => {
    const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
    return cells.findIndex(
      (c) => !(c.querySelector('.cell-native-input') as HTMLInputElement | null)?.value,
    );
  });
}

/** What that cell's own input now holds — the only witness to whether a keystroke WROTE. */
async function cellValue(page: Page, index: number): Promise<string | null> {
  return page.evaluate((i) => {
    const cells = [...document.querySelectorAll<HTMLElement>('.board-cells .game-cell')];
    return cells[i]?.querySelector<HTMLInputElement>('.cell-native-input')?.value ?? null;
  }, index);
}

for (const [name, pose] of [
  ['390x844', PHONE],
  ['768x1024', TABLET],
] as const) {
  test.describe(`§3.1 the occlusion law — ${name}`, () => {
    test.use(pose);

    test('the risen sheet takes the covered board out of the tab route', async ({ page }) => {
      await loadSudoku(page);
      await boardLaidOut(page);

      // CONTROL, sheet SHUT: the instrument can see a live board. A Tab walk from the top of
      // the document reaches the grid, which is the behaviour the risen pose must NOT have.
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      const shut = await tabWalk(page, 30);
      expect(
        shut.intoGrid,
        `the probe never reached the grid with the sheet SHUT, so it cannot prove anything about the risen pose (stops: ${shut.stops.join(', ')})`,
      ).toBeGreaterThan(0);

      // CONTROL for the CENSUS itself: with the sheet down the same predicate finds nothing
      // covered. A census that answered "all 81" unconditionally — which is what the hit-test
      // it replaced does on a cured tree — would sail through the assertion below without it.
      expect(
        (await coveredCells(page)).covered,
        'the census called cells covered with the sheet SHUT, so its verdict under the sheet is worthless',
      ).toBe(0);

      await openDrawer(page);

      // The board really is painted out — the premise, measured rather than assumed.
      const census = await coveredCells(page);
      expect(census.total).toBeGreaterThan(0);
      expect(
        census.covered / census.total,
        `the sheet covered ${census.covered}/${census.total} cells; a row about a covered board needs a covered board`,
      ).toBeGreaterThan(0.5);

      // THE BOUND: a walk that starts inside the risen sheet never lands on the paper under it.
      const risen = await tabWalk(page, 40);
      expect(
        risen.intoGrid,
        `Tab reached ${risen.intoGrid} covered board cells while the sheet was up (stops: ${risen.stops.join(', ')})`,
      ).toBe(0);
    });

    test('a keystroke cannot land on a cell the sheet is painting over', async ({ page }) => {
      await loadSudoku(page);
      const idx = await firstEmptyCell(page);
      expect(idx, 'the deal printed a digit in every cell — no empty square to write into').toBeGreaterThanOrEqual(0);

      // CONTROL, sheet SHUT: the very same call focuses the very same cell, and the very same
      // keystroke WRITES into it. Focus alone would let a board that refuses every write score
      // this row green with no cure at all — W1's B7 refuses a given's write whatever the sheet
      // is doing, and the class helper this row used to call answered cell 0 on every board,
      // which is usually a given (PROVE-RECORD.md finding 2).
      const live = await writeIntoCell(page, idx);
      expect(
        live.focused,
        'the probe could not focus the cell with the sheet shut, so its verdict under the sheet is worthless',
      ).toBe(true);
      await page.keyboard.type('5');
      expect(
        await cellValue(page, idx),
        'the keystroke did not write with the sheet SHUT, so its silence under the sheet proves nothing',
      ).toBe('5');
      // Put the square back the way the sheet-up arm needs to find it: empty.
      await page.keyboard.press('Backspace');
      expect(await cellValue(page, idx)).toBe('');

      await openDrawer(page);

      const covered = await writeIntoCell(page, idx);
      expect(
        covered.activeInGrid,
        'focus landed inside the covered grid while the sheet was up',
      ).toBe(false);

      // THE HARM ITSELF: not merely that focus stayed out, but that nothing reached the paper.
      await page.keyboard.type('5');
      expect(
        await cellValue(page, idx),
        'a keystroke wrote into a covered cell',
      ).toBe('');
    });
  });
}

/**
 * §3.5 — the deal and the forced fill reach AT.
 *
 * Read off LIVE REGIONS rather than off any one element: the cure names its own channel, and a
 * gate that hardcodes the channel is a gate that reds the next honest re-home.
 */
async function spoken(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [
      ...document.querySelectorAll('[aria-live],[role="status"],[role="alert"],[role="log"]'),
    ]
      .map((r) => (r.textContent ?? '').replace(/\s+/g, ' ').trim())
      .filter(Boolean),
  );
}

test.describe('§3.5 deals and forced fills announce', () => {
  test('a deal says a board arrived, and says what board', async ({ page }) => {
    await loadSudoku(page);
    // Quiet the room first: whatever the load said has been said.
    await page.evaluate(() => {
      for (const r of document.querySelectorAll('[aria-live],[role="status"],[role="log"]'))
        (r as HTMLElement).textContent = '';
    });
    await page.locator('.deal-btn').click();
    await expect
      .poll(async () => (await spoken(page)).join(' | '), { timeout: 15000 })
      .toMatch(/new board/i);

    const heard = (await spoken(page)).join(' | ');
    // It says WHICH board, not merely that one came.
    expect(heard, `live regions said: ${heard}`).toMatch(/9 by 9/i);
    // M16: the register bans the em dash outright, so the sentence is shaped without one.
    expect(heard).not.toMatch(/[—–]/);
  });

  test('a forced fill says how many squares it filled', async ({ page }) => {
    await loadSudoku(page);
    await page.evaluate(() => {
      for (const r of document.querySelectorAll('[aria-live],[role="status"],[role="log"]'))
        (r as HTMLElement).textContent = '';
    });
    const before = await page.evaluate(
      () => document.querySelectorAll('.board-cells .game-cell .glyph-svg').length,
    );
    await page.locator('button[aria-label^="Fill in every cell"]').click();
    await expect
      .poll(
        async () =>
          await page.evaluate(
            () => document.querySelectorAll('.board-cells .game-cell .glyph-svg').length,
          ),
        { timeout: 15000 },
      )
      .toBeGreaterThan(before);

    const heard = (await spoken(page)).join(' | ');
    expect(heard, `live regions said: ${heard}`).toMatch(/\d+ squares? filled/i);
    expect(heard).not.toMatch(/[—–]/);
  });
});

/**
 * §3.6 — the copy act reaches AT, and the name never contradicts the label.
 *
 * The outcome was a drawn word and a name that flipped under it: for 1600ms the button was
 * called "Link copied" while the sublabel beside the glyph still read "Share".
 */
test.describe('§3.6 the copy act reaches AT', () => {
  test('the outcome is spoken, and the name agrees with the label at every beat', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(
      browserName === 'webkit',
      'PW-WebKit has no clipboard-write permission (playwright.config.ts records the same gap for share-truth.spec.ts)',
    );
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await loadSudoku(page);
    await page.evaluate(() => {
      for (const r of document.querySelectorAll('[aria-live],[role="status"],[role="log"]'))
        (r as HTMLElement).textContent = '';
    });

    const share = page.locator('button[aria-label="Share board link"]').first();
    await expect(share).toBeVisible();
    await share.click();

    // THE UTTERANCE — the outcome reaches a live region at all.
    await expect
      .poll(async () => (await spoken(page)).join(' | '), { timeout: 10000 })
      .toMatch(/copied|couldn't copy/i);

    // AND THE AGREEMENT — whatever the name says, the drawn sublabel says the same thing.
    const agree = await page.evaluate(() => {
      const btn = [...document.querySelectorAll<HTMLElement>('button')].find((b) =>
        /copied|Share board link/i.test(b.getAttribute('aria-label') ?? ''),
      );
      if (!btn) return null;
      const sub = btn.querySelector('.icon-sublabel');
      return {
        name: (btn.getAttribute('aria-label') ?? '').toLowerCase(),
        label: (sub?.textContent ?? '').replace(/\s+/g, ' ').trim().toLowerCase(),
      };
    });
    expect(agree, 'the share button was not found after the press').not.toBeNull();
    const said = agree!;
    const nameCopied = /copied/.test(said.name);
    const labelCopied = /copied/.test(said.label);
    expect(
      nameCopied,
      `the accessible name said ${JSON.stringify(said.name)} while the sublabel under the same glyph said ${JSON.stringify(said.label)}`,
    ).toBe(labelCopied);
  });
});
