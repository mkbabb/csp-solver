import { test, expect, type Page } from '@playwright/test';

// PRM: live, because neither row reads an animated property: the head line and the board rule
//   are settled layout, and the draw-in the poll waits on runs under both preferences.

/**
 * T8-W7 · M17 + M18 — the two lines the owner named, and the config that keeps them.
 *
 * M17  THE HEAD LINE. `--head-rule` is one inset from the top of the page and BOTH head corners
 *      hang their boxes from it. The reading it supersedes centred the badge on the celestial's
 *      own middle, which is a line whose height is the sun's radius: 104 / 40 / 32px down the
 *      page across the toggle's rungs, and 84.13px of empty paper above the badge on every desk.
 *
 * M18  THE BOARD RULE. The board's top edge is the row's rule and the rule is the masthead's own
 *      bottom edge; the card centres against the board and overhangs downward when it is taller.
 *      Before it, a 4x4 kenken card 192px taller than its board pushed the board 96px down the
 *      page and left dead paper under the title.
 *
 * EVERY row carries its control INSIDE the run (the estate's GATE-1 discipline): the superseded
 * declaration is re-injected and the same assertions are required to FAIL against it. A gate
 * that cannot be shown to fail is a decoration.
 */

const GAMES = ['sudoku', 'futoshiki', 'thermo', 'killer', 'kenken'];

/** The head's two marks, boxed. The badge has two mounts and one of them is always display:none. */
const HEAD_PROBE = () => {
  const box = (el: Element | null) => {
    if (!el || !el.getClientRects().length) return null;
    const b = el.getBoundingClientRect();
    return { top: b.top, height: b.height, centre: b.top + b.height / 2 };
  };
  const badge =
    box(document.querySelector('.corner-left')) ?? box(document.querySelector('.mobile-attribution'));
  return { badge, toggle: box(document.querySelector('.corner-right button')) };
};

/** The row's three referents: the title block, the board, the card. */
const ROW_PROBE = () => {
  const box = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: b.top, bottom: b.bottom, left: b.left, height: b.height };
  };
  return {
    masthead: box('.masthead'),
    host: box('.board-peek-host'),
    wrapper: box('.board-wrapper'),
    card: box('.controls-card'),
  };
};

/** The superseded poses, re-injected verbatim — the negative control for both rows. */
const SUPERSEDED_HEAD = `
  .corner-left, .mobile-attribution {
    top: calc(var(--toggle-size, 5rem) / 2) !important;
    translate: 0 -50% !important;
  }
  .corner-right { top: 0 !important; }
`;
const SUPERSEDED_ROW = `
  @media (min-width: 1024px) { .board-peek-host { align-self: center !important; } }
`;
/** The dock without its height key (M20) — the regime that floated the wordmark onto the
 *  board at 900×676. Re-injected verbatim as the negative control. */
const SUPERSEDED_DOCK = `
  @media (max-width: 1023.98px) and (orientation: landscape) {
    .board-group { position: relative !important; }
    .masthead {
      position: absolute !important;
      left: 0 !important;
      top: 50dvh !important;
      translate: 0 -50% !important;
      --logo-scale: 0.38 !important;
      z-index: 5 !important;
      margin: 0 !important;
    }
  }
`;

async function load(page: Page, game: string) {
  await page.goto(`./?game=${game}`);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await page.addStyleTag({ content: '.tuner-toggle { display: none !important; }' });
  await page.waitForSelector('.board-wrapper', { timeout: 15000 });
  // The row settles when the board and the card have stopped resizing each other.
  let last = '';
  await expect
    .poll(
      async () => {
        const now = await page.evaluate(() => {
          const h = document.querySelector('.board-peek-host')?.getBoundingClientRect();
          const c = document.querySelector('.controls-card')?.getBoundingClientRect();
          return `${h?.top}|${h?.height}|${c?.height}`;
        });
        const stable = now === last;
        last = now;
        return stable;
      },
      { timeout: 15000 },
    )
    .toBe(true);
}

test.describe('M17 — the head line', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`the badge and the celestial hang from one rule (${theme})`, async ({ page }) => {
      await page.addInitScript(
        ([t]) => localStorage.setItem('sudoku-color-scheme', t),
        [theme],
      );

      for (const vp of [
        { width: 1280, height: 800 },
        { width: 1440, height: 900 },
        { width: 390, height: 664 },
      ]) {
        await page.setViewportSize(vp);
        await load(page, 'sudoku');

        const head = await page.evaluate(HEAD_PROBE);
        expect(head.badge, `badge mounted at ${vp.width}`).not.toBeNull();
        expect(head.toggle, `toggle mounted at ${vp.width}`).not.toBeNull();

        // ONE LINE: the two boxes start together.
        expect(
          Math.abs(head.badge!.top - head.toggle!.top),
          `head rule at ${vp.width} (${theme})`,
        ).toBeLessThan(0.5);

        // AND IT IS THE TOP OF THE PAGE, not the sun's middle: the superseded reading put the
        // badge 84.13px down on the desk, so a rule that drifts back there reds here even
        // though the two boxes would still agree.
        expect(head.badge!.top, `head band at ${vp.width} (${theme})`).toBeLessThan(40);
      }

      // CONTROL — restore the centre reading; the same two assertions must fail.
      await page.setViewportSize({ width: 1280, height: 800 });
      await load(page, 'sudoku');
      await page.addStyleTag({ content: SUPERSEDED_HEAD });
      const ctl = await page.evaluate(HEAD_PROBE);
      expect(Math.abs(ctl.badge!.top - ctl.toggle!.top)).toBeGreaterThan(0.5);
      expect(ctl.badge!.top).toBeGreaterThan(40);
    });
  }
});

test.describe('M18 — the board rule', () => {
  for (const vp of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    test(`the board hangs from the title at ${vp.width}, in all five games`, async ({ page }) => {
      await page.setViewportSize(vp);

      for (const game of GAMES) {
        await load(page, game);
        const r = await page.evaluate(ROW_PROBE);
        expect(r.masthead, `${game} masthead`).not.toBeNull();
        expect(r.host, `${game} board`).not.toBeNull();
        expect(r.card, `${game} card`).not.toBeNull();

        // VERTICAL — the board's top edge IS the masthead's bottom edge.
        expect(
          Math.abs(r.host!.top - r.masthead!.bottom),
          `${game}: board top against masthead bottom at ${vp.width}`,
        ).toBeLessThan(0.5);

        // LEFT — the board's left edge and the title's are one line.
        expect(
          Math.abs(r.wrapper!.left - r.masthead!.left),
          `${game}: board left against masthead left at ${vp.width}`,
        ).toBeLessThan(0.5);

        // THE CARD — centred against the board, so its top is on the rule when it is the taller
        // box and below the rule when it is not. It is never ABOVE the rule, which is the shape
        // the mark named: a card that has begun pushing the board down the page.
        expect(
          r.card!.top - r.host!.top,
          `${game}: card top below the board's at ${vp.width}`,
        ).toBeGreaterThan(-0.5);
      }

      // CONTROL — restore the centred row. kenken's 4x4 board is 192px shorter than its card,
      // so the board drops half of that and the title is left holding dead paper.
      await load(page, 'kenken');
      await page.addStyleTag({ content: SUPERSEDED_ROW });
      const ctl = await page.evaluate(ROW_PROBE);
      expect(ctl.host!.top - ctl.masthead!.bottom).toBeGreaterThan(50);
      expect(ctl.card!.top - ctl.host!.top).toBeLessThan(-50);
    });
  }
});

/**
 * M20 — THE DOCK STAYS A PHONE REGIME (the owner's 2026-08-04 mark: "on some screens and
 * sizes, the sudoku logo floats upon the board"). The landscape masthead dock's derivation
 * assumed a board that fills the short edge and leaves the gutter wide — true at 844×390,
 * false at a 900×676 desktop window, where the same media key parked the wordmark 143px deep
 * ON the grid, vertically centred. The key is now height-scoped (≤500px, App.vue), and the
 * tall-landscape fallback takes the desk's board clearance (GameBoard.vue §M20).
 */
const M20_PROBE = () => {
  const box = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { top: b.top, bottom: b.bottom, left: b.left, right: b.right };
  };
  // The GRID is the referent — the mark names ink on the board. The wrapper's paper frame
  // carries its own ~10px inset (and the T5-W4-ratified dock overhangs that paper edge by
  // 2.7px without touching a cell), so the wrapper is kept only for the fold check.
  return {
    masthead: box('.masthead'),
    wrapper: box('.board-wrapper'),
    grid: box('[role=grid]'),
    vh: window.innerHeight,
  };
};
type M20Box = { top: number; bottom: number; left: number; right: number };
/** Interpenetration by more than half a pixel — exact adjacency (the M18 rule) is not a hit. */
const overlaps = (a: M20Box, b: M20Box) =>
  a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;

test.describe('M20 — the dock stays a phone regime', () => {
  test('a tall landscape window keeps the masthead above the board', async ({ page }) => {
    for (const vp of [
      { width: 900, height: 676 }, // the owner's shot, css-normalised
      { width: 1000, height: 800 },
      { width: 900, height: 500 }, // one px under the height gate — aspect 1.80 takes flow
      { width: 844, height: 430 }, // landscape phone under 2/1 — flow, not the dock
    ]) {
      await page.setViewportSize(vp);
      await load(page, 'sudoku');
      const r = await page.evaluate(M20_PROBE);
      expect(r.masthead, `masthead at ${vp.width}x${vp.height}`).not.toBeNull();
      expect(r.grid, `grid at ${vp.width}x${vp.height}`).not.toBeNull();

      // IN FLOW, ABOVE — the fallback is the portrait grammar…
      expect(
        r.grid!.top,
        `grid below the title at ${vp.width}x${vp.height}`,
      ).toBeGreaterThan(r.masthead!.bottom - 0.5);
      // …so the title's box never reaches the board's ink (the mark: the wordmark ON the board).
      expect(
        overlaps(r.masthead!, r.grid!),
        `no float at ${vp.width}x${vp.height}`,
      ).toBe(false);
      // And the desk clearance holds the board whole in the first viewport.
      expect(
        r.wrapper!.bottom,
        `board above the fold at ${vp.width}x${vp.height}`,
      ).toBeLessThan(r.vh + 0.5);
    }

    // CONTROL — re-inject the un-height-scoped dock: the float must return at 900×676.
    // Polled, not sampled: under full-suite load webkit has taken a beat to apply the
    // injected sheet, and a one-shot read raced it (seen once at 4 workers, green serial).
    await page.setViewportSize({ width: 900, height: 676 });
    await load(page, 'sudoku');
    await page.addStyleTag({ content: SUPERSEDED_DOCK });
    await expect
      .poll(
        async () => {
          const ctl = await page.evaluate(M20_PROBE);
          return ctl.masthead && ctl.grid ? overlaps(ctl.masthead, ctl.grid) : false;
        },
        { timeout: 5000 },
      )
      .toBe(true);
  });

  test('the dock itself stands at landscape phones', async ({ page }) => {
    for (const vp of [
      { width: 844, height: 390 }, // the T5-W4 pose
      { width: 932, height: 430 }, // Pro Max landscape — the live pass's float habitat
      { width: 896, height: 414 },
    ]) {
      await page.setViewportSize(vp);
      await load(page, 'sudoku');
      const r = await page.evaluate(M20_PROBE);
      expect(r.masthead, `masthead at ${vp.width}x${vp.height}`).not.toBeNull();
      expect(r.grid, `grid at ${vp.width}x${vp.height}`).not.toBeNull();
      // Docked: vertically centred against the grid's own viewport band…
      const centre = (r.masthead!.top + r.masthead!.bottom) / 2;
      const gridCentre = (r.grid!.top + r.grid!.bottom) / 2;
      expect(
        Math.abs(centre - gridCentre),
        `the dock centre at ${vp.width}x${vp.height}`,
      ).toBeLessThan(24);
      // …and in the gutter. Since the page-edge anchor (the live pass) the box clears the
      // grid by ≥69px at every docked pose; 2px stays the line so a regression reds loud.
      expect(
        r.masthead!.right,
        `the wordmark keeps to the gutter at ${vp.width}x${vp.height}`,
      ).toBeLessThan(r.grid!.left + 2);
    }
  });
});
