import { test, expect, type Page } from '@playwright/test';

// PRM: live, because two of these rows ride the app's own motion — the deck's snap glide (§2.1
//   steps the listbox and waits its settle) and the drawer's rise (§2.6 mobile) — and a frozen
//   run would measure poses the product never holds. Nothing here reads a pixel: every read is a
//   box, a font size, a class or a count, and the boil moves none of them.

/**
 * T9-W2 · THE VIEWPORT'S LAW — the born-RED gate spine.
 *
 * Six rows, one per charter section, and every one of them was RED at HEAD before the wave's
 * cures landed (`docs/tranches/2026-08-tranche-9/evidence/w2/born-red-head.txt` banks the run
 * with its measured numbers). The mechanisms are V7's, measured on the live edge; the cells
 * below are V7's cells, so a row that greens here greens against the reading that opened it.
 *
 * A seventh block MEASURES and asserts nothing: the M01 mobile type/tap census and the §2.3
 * fold geometry. W7 sets those thresholds; this file banks what they are set against, and turns
 * into assertions the moment the voice exists. It prints under `[W2-BASELINE]`.
 *
 * Selector discipline: first-party hooks only — `.game-gallery`, `.gallery-viewport`,
 * `#gallery-card-{i}`, `.game-card-name`, `.drawer-tab`, `.fold-tools`, `.drawer-handle`,
 * `.controls-card`, `.tray-well`, `.washi-label`/`.washi-tag`, `.action-bar`, `.board-wrapper`,
 * `button.sun-moon-toggle`.
 */

/** Every element a thumb or a pointer can land on. One list, so no row censuses a narrower
 *  estate than the one beside it. */
const INTERACTIVE =
  'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])';

/**
 * THE CLIP WALK — an element's honestly VISIBLE fraction.
 *
 * `getBoundingClientRect()` alone answers where a box WOULD be, which is exactly the lie §2.1
 * turns on: the deck's names have full boxes at every viewport and are painted nowhere, because
 * a scrollport with no height floor clips them. So the box is intersected with EVERY clipping
 * ancestor (any ancestor whose computed overflow is not `visible` on either axis — the pair
 * resolves together in CSS, and reading both keeps the walk honest under either declaration) and
 * finally with the window. `1` is wholly painted; `0` is a box that exists and shows nothing.
 *
 * Installed on `window` by `addInitScript` so it survives navigation and every row measures the
 * same way.
 */
function installVisFrac() {
  (window as unknown as Record<string, unknown>).__visFrac = (el: Element) => {
    let clip = { l: 0, t: 0, r: window.innerWidth, b: window.innerHeight };
    let p = el.parentElement;
    while (p) {
      const cs = getComputedStyle(p);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
        const q = p.getBoundingClientRect();
        clip = {
          l: Math.max(clip.l, q.left),
          t: Math.max(clip.t, q.top),
          r: Math.min(clip.r, q.right),
          b: Math.min(clip.b, q.bottom),
        };
      }
      p = p.parentElement;
    }
    const b = el.getBoundingClientRect();
    const w = Math.max(0, Math.min(b.right, clip.r) - Math.max(b.left, clip.l));
    const h = Math.max(0, Math.min(b.bottom, clip.b) - Math.max(b.top, clip.t));
    const area = b.width * b.height;
    return area > 0 ? (w * h) / area : 0;
  };
}

/** The legibility floor the charter names: "legibly visible" is not "has a box". */
const LEGIBLE = 0.9;

async function boot(page: Page) {
  await page.addInitScript(installVisFrac);
}

/** The playing view, settled: the wordmark is up, the deal has rendered givens, and the grid has
 *  handed off from draw-in to its steady state (the suite's `.is-active` handoff). */
async function loadBoard(page: Page, query = '?size=3&difficulty=EASY') {
  await page.goto('./' + query);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 20000 })
    .toBeGreaterThan(0);
  await page.waitForSelector('g.boil-frame-layer.is-active', {
    state: 'attached',
    timeout: 20000,
  });
}

/** The deck, entered by URL rather than by pressing the wordmark: `?view=gallery` is the truth
 *  `openGallery` writes, and these rows are about what the deck SHOWS, not about the press. */
async function loadDeck(page: Page) {
  await page.goto('./?view=gallery&size=3&difficulty=EASY');
  await page.waitForSelector('.game-gallery', { timeout: 20000 });
  await page.waitForSelector('.staging-band', { timeout: 20000 });
}

/** The ONE CUED GESTURE the charter allows, taken in the deck's own grammar: the listbox's
 *  arrow step. Settled on the deck's own contract — `aria-activedescendant` names the snapped
 *  card — not on a timer. */
async function stepDeckTo(page: Page, index: number) {
  const viewport = page.locator('.gallery-viewport');
  const active = () =>
    viewport.evaluate((el) => el.getAttribute('aria-activedescendant') ?? '');
  while ((await active()) !== `gallery-card-${index}`) {
    const before = await active();
    await viewport.press('ArrowRight');
    await expect.poll(active, { timeout: 8000 }).not.toBe(before);
  }
  // The snap glide is a WAAPI transform on top of the scroll; let it land before a box is read.
  await page.waitForTimeout(600);
}

// ─────────────────────────────────────────────────────────────────────────────
// §2.1 — THE DECK'S NAMES ARE LEGIBLE AT EVERY VIEWPORT THE PRODUCT SHIPS
//
// The scrollport declares no height and no floor (`GameGallery.vue:968-982`; `min-height:auto`
// resolves to 0 under `:948-957`'s `flex:1; min-height:0`) while the track keeps its intrinsic
// ~408px card, so the caption clips with `scrollbar-width:none` hiding the tell. RED at HEAD:
// visFrac 0.3023 for every card at 1440×640, 0 for every card at 844×390.
//
// The row steps THROUGH the deck rather than reading five cards at once, because the deck is a
// carousel: at phone width one slot is on screen at a time, and the charter's law is "legible at
// first paint or one cued gesture away". Card 0 is first paint; cards 1-4 are the gesture.
// ─────────────────────────────────────────────────────────────────────────────

const DECK_CELLS = [
  { width: 1440, height: 640 },
  { width: 844, height: 390 },
];

for (const cell of DECK_CELLS) {
  test.describe(`§2.1 deck names @ ${cell.width}×${cell.height}`, () => {
    test.use({ viewport: cell });

    test('§2.1 every game name on the deck is legible at first paint or one cued step away', async ({
      page,
    }) => {
      test.slow(); // five snapped steps, each waiting the deck's own glide out
      await boot(page);
      await loadDeck(page);

      // WITNESS — the deck is whole before a fraction is read. A row that measured four cards,
      // or none, would report a clip that is really a mount failure.
      await expect(page.locator('.gallery-card-slot')).toHaveCount(5);

      const measured: { name: string; visFrac: number }[] = [];
      for (let i = 0; i < 5; i++) {
        await stepDeckTo(page, i);
        const row = await page.evaluate((idx) => {
          const card = document.querySelector(`#gallery-card-${idx}`);
          const name = card?.querySelector('.game-card-name');
          const text = name?.querySelector('text')?.textContent?.trim() ?? `card-${idx}`;
          const vis = (window as unknown as Record<string, (el: Element) => number>).__visFrac;
          return { name: text, visFrac: name ? +vis(name).toFixed(4) : 0 };
        }, i);
        measured.push(row);
      }

      console.log(`[W2-§2.1] ${cell.width}×${cell.height} ${JSON.stringify(measured)}`);

      const illegible = measured.filter((m) => m.visFrac <= LEGIBLE);
      expect(
        illegible,
        `every deck name must be legible (visFrac > ${LEGIBLE}) at ${cell.width}×${cell.height}; ` +
          `measured ${JSON.stringify(measured)}`,
      ).toEqual([]);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// §2.2 — SHORT LANDSCAPE KEEPS A CUED PATH TO THE CONTROLS
//
// `scene.css:221-223` hides `.fold-tools`/`.drawer-handle` UNSCOPED, and only the portrait arm
// (`:284/:339/:355`) turns them back on. A landscape phone matches the `max-width: 1023px` arm
// and NOT the portrait one, so it gets neither — the board plays, and deal/level/solve/share/
// undo/hint all sit below a fold the first screen never says exists.
//
// The row asserts REACHABILITY, not layout: some visible, cued entry to the deal/level controls
// inside the first viewport. Either the controls are already there, or something visible opens
// them in one gesture. RED at HEAD: no opener has a box at all, and the deal verb sits 192px
// (844×390) / 192px (812×375) below the fold on a 1157px / 1142px document.
// ─────────────────────────────────────────────────────────────────────────────

const LANDSCAPE_CELLS = [
  { width: 844, height: 390 },
  { width: 812, height: 375 },
];

for (const cell of LANDSCAPE_CELLS) {
  test.describe(`§2.2 short landscape @ ${cell.width}×${cell.height}`, () => {
    test.use({ viewport: cell, isMobile: true, hasTouch: true });

    test('§2.2 the deal/level controls are one visible, cued gesture away in short landscape', async ({
      page,
    }) => {
      await boot(page);
      await loadBoard(page);

      const reach = await page.evaluate(() => {
        const inFirstScreen = (el: Element | null) => {
          if (!el) return false;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05)
            return false;
          const b = el.getBoundingClientRect();
          return b.width > 0 && b.height > 0 && b.top < window.innerHeight && b.bottom > 0;
        };
        const geom = (el: Element | null) => {
          if (!el) return null;
          const b = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return {
            box: [+b.left.toFixed(1), +b.top.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
            display: cs.display,
            belowFold: +(b.top - window.innerHeight).toFixed(2),
          };
        };
        const deal = document.querySelector('.controls-card .deal-btn');
        const level = document.querySelector('.controls-card [aria-label="Difficulty"], .controls-card .ctrl-btn');
        // The candidate openers, in the order the product would offer them.
        const openers = {
          drawerTab: document.querySelector('.drawer-tab'),
          foldTools: document.querySelector('.fold-tools'),
          drawerHandle: document.querySelector('.drawer-handle'),
        };
        const margin = document.querySelector('.board-margin');
        const mb = margin?.getBoundingClientRect();
        return {
          openersVisible: Object.fromEntries(
            Object.entries(openers).map(([k, v]) => [k, inFirstScreen(v)]),
          ),
          openerGeom: Object.fromEntries(Object.entries(openers).map(([k, v]) => [k, geom(v)])),
          dealInFirstScreen: inFirstScreen(deal),
          dealGeom: geom(deal),
          levelInFirstScreen: inFirstScreen(level),
          // N1's residue: the reserved status line under the board, and how far under the fold.
          statusResidue: mb ? +(mb.bottom - window.innerHeight).toFixed(2) : null,
          docScrollH: document.documentElement.scrollHeight,
          innerH: window.innerHeight,
          mqPortrait: matchMedia('(orientation: portrait)').matches,
          mqStacked: matchMedia('(max-width: 1023px)').matches,
        };
      });

      console.log(`[W2-§2.2] ${cell.width}×${cell.height} ${JSON.stringify(reach)}`);

      // WITNESS — the regime. Without it the row could pass at a width no phone shows: the
      // defect is exactly "matches the stacked arm, does NOT match the portrait arm".
      expect(reach.mqStacked, 'the stacked (<1024) arm must be the live one here').toBe(true);
      expect(reach.mqPortrait, 'this cell is LANDSCAPE — the portrait arm must not match').toBe(
        false,
      );

      const cued =
        reach.dealInFirstScreen ||
        reach.levelInFirstScreen ||
        Object.values(reach.openersVisible).some(Boolean);
      expect(
        cued,
        `short landscape must offer a visible, cued path to the controls within one gesture; ` +
          `measured ${JSON.stringify(reach)}`,
      ).toBe(true);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// §2.4 — THE TOGGLE STOPS STEALING
//
// `App.vue:938-966` fixes `.corner-right` at `z-index: 60` with a 208px box at ≤1024-class
// widths; the celestial art inside it is an inscribed circle, so the box's corners belong to
// nothing you can see and everything you can click. RED at HEAD: at 1024×768 the "4×4" size
// button shares a 157.8×9.6px band with the toggle's box, and a click inside that band lands on
// `button.sun-moon-toggle` — the theme flips while the reader is choosing a board size.
//
// The row is a HIT TEST, not a geometry read: it clicks the shared band of every interactive
// sibling the toggle's box overlaps and asserts the theme survives. A cure that shrinks the box
// to its art empties the census and the row passes with nothing to click, which is the correct
// shape — the POSITIVE CONTROL below is what keeps the instrument honest in that case.
// ─────────────────────────────────────────────────────────────────────────────

test.describe('§2.4 the toggle stops stealing @ 1024×768', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test('§2.4 no click on a control that shares the toggle box flips the theme', async ({
    page,
  }) => {
    test.slow(); // a positive control plus one click-and-settle per overlapping sibling
    await boot(page);
    await loadBoard(page);

    const isDark = () =>
      page.evaluate(() => document.documentElement.classList.contains('dark'));

    // POSITIVE CONTROL, taken first: the instrument can SEE a flip. Without it a cure that
    // simply broke the toggle would green this row.
    const before = await isDark();
    await page.locator('button.sun-moon-toggle').click();
    await expect.poll(isDark, { timeout: 5000 }).toBe(!before);
    await page.locator('button.sun-moon-toggle').click();
    await expect.poll(isDark, { timeout: 5000 }).toBe(before);

    const census = await page.evaluate((sel) => {
      const toggle = document.querySelector('button.sun-moon-toggle')!;
      const t = toggle.getBoundingClientRect();
      const cx = t.left + t.width / 2;
      const cy = t.top + t.height / 2;
      const rad = Math.min(t.width, t.height) / 2; // the art's inscribed circle
      const out: {
        label: string;
        cls: string;
        overlapPx: number;
        circleFrac: number;
        at: [number, number];
      }[] = [];
      for (const el of document.querySelectorAll(sel)) {
        if (el === toggle || toggle.contains(el) || el.contains(toggle)) continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const l = Math.max(b.left, t.left);
        const r = Math.min(b.right, t.right);
        const tp = Math.max(b.top, t.top);
        const bt = Math.min(b.bottom, t.bottom);
        if (r - l <= 0 || bt - tp <= 0) continue;
        // How much of the shared band the CIRCLE owns — the part that looks like the toggle.
        let inCircle = 0;
        const N = 12;
        for (let i = 0; i < N; i++)
          for (let j = 0; j < N; j++) {
            const x = l + ((r - l) * (i + 0.5)) / N;
            const y = tp + ((bt - tp) * (j + 0.5)) / N;
            if ((x - cx) ** 2 + (y - cy) ** 2 <= rad * rad) inCircle++;
          }
        out.push({
          label:
            el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 24) || el.tagName,
          cls: String((el as HTMLElement).className).slice(0, 40),
          overlapPx: +((r - l) * (bt - tp)).toFixed(1),
          circleFrac: +(inCircle / (N * N)).toFixed(3),
          at: [+((l + r) / 2).toFixed(1), +((tp + bt) / 2).toFixed(1)],
        });
      }
      return { toggle: [+t.left.toFixed(1), +t.top.toFixed(1), +t.width.toFixed(1), +t.height.toFixed(1)], out };
    }, INTERACTIVE);

    const thefts: Record<string, unknown>[] = [];
    for (const c of census.out) {
      const hit = await page.evaluate(
        ([x, y]) => {
          const e = document.elementFromPoint(x as number, y as number);
          return e ? `${e.tagName}.${String((e as HTMLElement).className).slice(0, 32)}` : 'none';
        },
        c.at as [number, number],
      );
      const was = await isDark();
      await page.mouse.click(c.at[0], c.at[1]);
      await page.waitForTimeout(800);
      const now = await isDark();
      if (now !== was) {
        thefts.push({ ...c, hit, was, now });
        await page.locator('button.sun-moon-toggle').click(); // put the theme back
        await expect.poll(isDark, { timeout: 5000 }).toBe(was);
      }
    }

    console.log(
      `[W2-§2.4] toggle=${JSON.stringify(census.toggle)} overlaps=${JSON.stringify(census.out)} thefts=${JSON.stringify(thefts)}`,
    );

    expect(
      thefts,
      `the toggle's hit surface must never own a sibling control's box; ` +
        `overlaps ${JSON.stringify(census.out)}`,
    ).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §2.5 — A TAPE NEVER COVERS AN INTERACTIVE ELEMENT
//
// `SheetWashiLabel.vue:91-126` has no downward arm and no collision logic: a tape is laid at
// `bottom: 100%` of whatever it names and lands wherever that puts it. T7-W7 already touched
// this tape for z-order without curing PLACEMENT, so the class gets the law.
//
// The census runs twice: the tapes that are ALWAYS down (`anchor="tag"`, the compartment names)
// and the ones a hover raises (the verbs' notes). RED at HEAD at 1440×900 — the players slab's
// invite note covers 68.4% of the Live option, and the sticky tool row's four notes hang onto
// the Play entry at 16.9 / 57.4 / 23.6 / 17.4%.
// ─────────────────────────────────────────────────────────────────────────────

test.describe('§2.5 the washi tape yields @ 1440×900', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('§2.5 no washi tape covers any part of an interactive element', async ({ page }) => {
    test.slow(); // one hover-and-settle per control in the card, then a census after each
    await boot(page);
    await loadBoard(page);

    const CENSUS = (sel: string) => {
      const inter = [...document.querySelectorAll(sel)].filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0;
      });
      const out: {
        tape: string;
        own: boolean;
        target: string;
        frac: number;
        px: number;
      }[] = [];
      for (const tape of document.querySelectorAll('.washi-label')) {
        const cs = getComputedStyle(tape);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
        const t = tape.getBoundingClientRect();
        if (t.width === 0 || t.height === 0) continue;
        // T9-W2 chair ruling on the lane law: coverage counts only where the control is
        // DRAWN. While `data-fold-above` is set, the card's own fold chrome paints SOLID
        // card colour over the scrollport's first `padding-top` band — a control under
        // that strip is hidden by the CARD, not covered by a tape (the adjudication's
        // "a reserved band is paper by construction"). At rest the attribute is absent,
        // so every born-RED overlap this row opened with stays fully counted.
        const cardEl = tape.closest('.controls-card');
        const liveTop =
          cardEl && cardEl.hasAttribute('data-fold-above')
            ? cardEl.getBoundingClientRect().top +
              parseFloat(getComputedStyle(cardEl).paddingTop)
            : -Infinity;
        for (const el of inter) {
          const b = el.getBoundingClientRect();
          const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
          const h = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top, liveTop));
          if (w * h <= 0.5) continue; // sub-pixel seams are not coverage
          out.push({
            tape: (tape.textContent || '').trim().slice(0, 32),
            own: el.contains(tape),
            target: el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 28),
            frac: +((w * h) / (b.width * b.height)).toFixed(3),
            px: +(w * h).toFixed(1),
          });
        }
      }
      return out;
    };

    // WITNESS — the tapes this row exists for are actually laid down. A card with no tags would
    // green a census that proves nothing.
    await expect(page.locator('.controls-card .washi-tag')).toHaveCount(4);

    const laid = await page.evaluate(CENSUS, INTERACTIVE);

    // The hover pass: raise each verb's note in turn and census while it is up. Hover is the
    // grammar these tapes ship with, so this is the surface a reader actually meets.
    const found = new Map<string, (typeof laid)[number]>();
    for (const row of laid) found.set(`${row.tape}»${row.target}`, row);
    for (const btn of await page.locator('.controls-card button').all()) {
      try {
        await btn.hover({ timeout: 2500 });
      } catch {
        continue; // a control the hover cannot reach carries no tape a reader can either
      }
      await page.waitForTimeout(260); // the tape's own 150ms opacity, then settle
      for (const row of await page.evaluate(CENSUS, INTERACTIVE))
        found.set(`${row.tape}»${row.target}`, row);
    }

    const overlaps = [...found.values()].sort((a, b) => b.frac - a.frac);
    console.log(`[W2-§2.5] 1440×900 overlaps=${JSON.stringify(overlaps)}`);

    expect(
      overlaps,
      `a tape must flip, shift or yield rather than cover a control; measured ${JSON.stringify(overlaps)}`,
    ).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §2.6 — THE SECTION TAG PINS WHILE ITS GROUP IS IN VIEW (T9-M03)
//
// "the section titles need to be larger and properly be sticky" — the owner's word. The tags are
// `position: absolute` on their well's top edge, so the moment a group's head scrolls past the
// card's own scrollport the group loses its name while the reader is still inside it.
//
// The DISCRIMINATING state is the only one worth reading: the well's top pushed above the
// scrollport's top while the well is still substantially in view. A tag read at scrollTop 0, or
// at the scroll end, is a tag that says nothing about stickiness. RED at HEAD: the "new game"
// well, 92% in view, wears a tag at visFrac 0.
// ─────────────────────────────────────────────────────────────────────────────

/** Push each well's head past the scrollport's top, then read whether its tag stayed. Returns
 *  one row per well; wells that cannot reach the state (too short, or too near the content's
 *  end to be scrolled that far) are reported `unreachable` rather than silently passed. */
const STICKY_CENSUS = (cardSel: string) => {
  const card = document.querySelector(cardSel) as HTMLElement | null;
  if (!card) return null;
  const vis = (window as unknown as Record<string, (el: Element) => number>).__visFrac;
  const max = card.scrollHeight - card.clientHeight;
  const rows: {
    tag: string;
    unreachable?: string;
    wellInView?: number;
    tagVisFrac?: number;
    position?: string;
  }[] = [];
  for (const well of card.querySelectorAll('.tray-well')) {
    const tag = well.querySelector('.washi-tag');
    if (!tag) continue;
    const name = (tag.textContent || '').trim();
    card.scrollTop = 0;
    const c0 = card.getBoundingClientRect();
    const w0 = well.getBoundingClientRect();
    const want = w0.top - c0.top + 40; // 40px of the well's head above the fold
    if (w0.height < 120) {
      rows.push({ tag: name, unreachable: `well is ${w0.height.toFixed(1)}px tall` });
      continue;
    }
    if (want <= 0 || want > max) {
      rows.push({ tag: name, unreachable: `needs scrollTop ${want.toFixed(1)} of ${max}` });
      continue;
    }
    card.scrollTop = want;
    const c = card.getBoundingClientRect();
    const w = well.getBoundingClientRect();
    rows.push({
      tag: name,
      position: getComputedStyle(tag).position,
      wellInView: +(
        (Math.min(w.bottom, c.bottom) - Math.max(w.top, c.top)) /
        w.height
      ).toFixed(3),
      tagVisFrac: +vis(tag).toFixed(4),
    });
  }
  card.scrollTop = 0;
  return { max, rows };
};

test.describe('§2.6 the section tag pins @ 1440×900 (the rail)', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('§2.6 a section tag stays pinned while its group is in view (desktop rail)', async ({
    page,
  }) => {
    await boot(page);
    await loadBoard(page);

    const census = await page.evaluate(STICKY_CENSUS, '.controls-card');
    console.log(`[W2-§2.6 rail] ${JSON.stringify(census)}`);

    expect(census, 'the rail card must be mounted').not.toBeNull();
    // The card has to be a real scrollport or the row asserts nothing.
    expect(census!.max, 'the card must overflow its frame at this viewport').toBeGreaterThan(40);

    const tested = census!.rows.filter((r) => r.tagVisFrac !== undefined);
    expect(
      tested.length,
      `no well could be scrolled past the card's top — the row would assert nothing (${JSON.stringify(census)})`,
    ).toBeGreaterThan(0);

    const lost = tested.filter((r) => (r.tagVisFrac ?? 0) <= LEGIBLE);
    expect(
      lost,
      `a group's tag must stay visible while the group is in view; measured ${JSON.stringify(tested)}`,
    ).toEqual([]);
  });
});

// THE MOBILE CELL IS 375×667, AND THE CHOICE IS MEASURED. The drawer card's content is 660px
// tall; at 390×844 its frame is 628 and at 414×896 it is 660, so the state this row reads —
// a group's head pushed past the scrollport's top while the group is still in view — DOES NOT
// EXIST there (32px and 0px of overflow). At 375×667 the frame is 451 and 209px scroll, which
// is the honest short-phone cell for a card that only folds when the screen is short.
test.describe('§2.6 the section tag pins @ 375×667 (the drawer)', () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });

  test('§2.6 a section tag stays pinned while its group is in view (mobile drawer)', async ({
    page,
  }) => {
    await boot(page);
    await loadBoard(page);
    await page.locator('.drawer-tab').tap();
    await expect(page.locator('#controls-drawer .drawer-case')).toBeVisible();
    await page.waitForTimeout(700); // the Band-D glide's own clock, then settle

    const census = await page.evaluate(STICKY_CENSUS, '#controls-drawer .controls-card');
    console.log(`[W2-§2.6 drawer] ${JSON.stringify(census)}`);

    expect(census, 'the drawer card must be mounted').not.toBeNull();
    expect(census!.max, 'the drawer card must overflow its frame here').toBeGreaterThan(40);

    const tested = census!.rows.filter((r) => r.tagVisFrac !== undefined);
    expect(
      tested.length,
      `no well could be scrolled past the drawer card's top (${JSON.stringify(census)})`,
    ).toBeGreaterThan(0);

    const lost = tested.filter((r) => (r.tagVisFrac ?? 0) <= LEGIBLE);
    expect(
      lost,
      `a group's tag must stay visible while the group is in view; measured ${JSON.stringify(tested)}`,
    ).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// §2.7 — THE CONTROLS ENTRY RIDES THE BOARD'S BOTTOM EDGE (T9-M10)
//
// "The controls button on mobile should be a tab on the bottom of the board, like on desktop
// (just not on the side)" — the owner's word, with Frame D (`marks/m10-controls-chip-stranded.png`)
// showing the chip it kills. RED at HEAD: 54.8px of dead space between the board's paper and the
// chip, identical at 375×812, 390×844 and 430×932 — the gap is structural, not a pose accident.
//
// The board's PAPER (`.board-wrapper`) is the edge, not the shell: the shell carries the
// reserved status line under the paper, and a tab attached to the shell's bottom would be
// attached to a line of text rather than to the board. Both are banked; the law reads the paper.
// ─────────────────────────────────────────────────────────────────────────────

const PORTRAIT_CELLS = [
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 430, height: 932 },
];

const EDGE_GAP = 8;

for (const cell of PORTRAIT_CELLS) {
  test.describe(`§2.7 the controls entry rides the board @ ${cell.width}×${cell.height}`, () => {
    test.use({ viewport: cell, isMobile: true, hasTouch: true });

    test("§2.7 the controls entry is attached to the board's bottom edge, not floating below it", async ({
      page,
    }) => {
      await boot(page);
      await loadBoard(page);

      const geom = await page.evaluate(() => {
        const rect = (s: string) => {
          const el = document.querySelector(s);
          return el ? el.getBoundingClientRect() : null;
        };
        const tab = rect('.drawer-tab');
        const paper = rect('.board-wrapper');
        const shell = rect('.board-shell');
        return {
          tab: tab && [
            +tab.left.toFixed(1),
            +tab.top.toFixed(1),
            +tab.width.toFixed(1),
            +tab.height.toFixed(1),
          ],
          paper: paper && [
            +paper.left.toFixed(1),
            +paper.top.toFixed(1),
            +paper.width.toFixed(1),
            +paper.height.toFixed(1),
          ],
          gapToPaper: tab && paper ? +(tab.top - paper.bottom).toFixed(1) : null,
          gapToShell: tab && shell ? +(tab.top - shell.bottom).toFixed(1) : null,
        };
      });

      console.log(`[W2-§2.7] ${cell.width}×${cell.height} ${JSON.stringify(geom)}`);

      expect(geom.tab, 'the controls entry must exist in every mobile pose').not.toBeNull();
      expect(geom.paper, 'the board must be mounted').not.toBeNull();
      expect(
        geom.gapToPaper,
        `the controls entry must ride the board's bottom edge (≤${EDGE_GAP}px); measured ${JSON.stringify(geom)}`,
      ).toBeLessThanOrEqual(EDGE_GAP);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// THE BANKED BASELINES — measured, asserted over by nobody yet.
//
// M01 ("all buttons and text for controls need to be larger on mobile") and §2.3 (the fold with
// no affordance) both name a MECHANISM this wave owns and a VOICE W7 decides. Numbers without a
// threshold are still the thing the threshold gets set against, so they are measured here, in
// the instrument that will carry the assertion, and printed under `[W2-BASELINE]`.
// ─────────────────────────────────────────────────────────────────────────────

test.describe('BASELINE the mobile type + tap scale @ 390×844 (M01)', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('BASELINE M01 — the toolbar and drawer option scale, banked for W7', async ({ page }) => {
    await boot(page);
    await loadBoard(page);

    const read = () => {
      const one = (el: Element) => {
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return {
          text: (el.textContent || '').trim().slice(0, 20),
          label: el.getAttribute('aria-label'),
          fontPx: +parseFloat(cs.fontSize).toFixed(2),
          w: +b.width.toFixed(1),
          h: +b.height.toFixed(1),
        };
      };
      const all = (sel: string) => [...document.querySelectorAll(sel)].map(one);
      return {
        toolbarButtons: all('.fold-tools button, .play-controls button'),
        toolbarSublabels: all('.fold-tools .icon-sublabel, .play-controls .icon-sublabel'),
      };
    };

    const fold = await page.evaluate(read);
    console.log(`[W2-BASELINE M01 toolbar] ${JSON.stringify(fold)}`);

    await page.locator('.drawer-tab').tap();
    await expect(page.locator('#controls-drawer .drawer-case')).toBeVisible();
    await page.waitForTimeout(700);

    const drawer = await page.evaluate(() => {
      const one = (el: Element) => {
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return {
          text: (el.textContent || '').trim().slice(0, 20),
          fontPx: +parseFloat(cs.fontSize).toFixed(2),
          w: +b.width.toFixed(1),
          h: +b.height.toFixed(1),
        };
      };
      const all = (sel: string) =>
        [...document.querySelectorAll(`#controls-drawer ${sel}`)].map(one);
      return {
        options: all('.ctrl-btn'),
        iconButtons: all('.icon-btn'),
        sublabels: all('.icon-sublabel'),
        tags: all('.washi-tag'),
        rowLabels: all('.zone-row-label'),
      };
    });
    console.log(`[W2-BASELINE M01 drawer] ${JSON.stringify(drawer)}`);

    // No threshold — this row banks. The one thing it will not let rot is the A3 floor already
    // verified: every tap target the census sees keeps 44px in both dimensions.
    //
    // ZERO-BOX ROWS ARE NOT TAP TARGETS, and dropping them is a measured decision rather than a
    // convenience: the difficulty options (`Easy`/`Medium`/`Hard`) census at 0×0 in the open
    // drawer at HEAD — a box with no area is a control nobody can miss by being small, and
    // holding it to a 44px floor would red this row on a mount fact instead of a size one. They
    // are printed as `notRendered` so the fact stays visible rather than filtered into silence.
    const targets = [...fold.toolbarButtons, ...drawer.options, ...drawer.iconButtons];
    const notRendered = targets.filter((b) => b.w === 0 || b.h === 0);
    console.log(`[W2-BASELINE M01 notRendered] ${JSON.stringify(notRendered)}`);
    const short = targets.filter((b) => b.w > 0 && b.h > 0 && (b.w < 44 || b.h < 44));
    expect(short, `the >=44px tap floor (A3) must hold; ${JSON.stringify(short)}`).toEqual([]);
  });
});

const FOLD_CELLS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
];

for (const cell of FOLD_CELLS) {
  test.describe(`BASELINE the controls-card fold @ ${cell.width}×${cell.height} (§2.3)`, () => {
    test.use({ viewport: cell });

    test('BASELINE §2.3 — the card cap, the scroll gutter, and what straddles the fold', async ({
      page,
    }) => {
      await boot(page);
      await loadBoard(page);

      const fold = await page.evaluate(() => {
        const card = document.querySelector('.controls-card') as HTMLElement;
        const cs = getComputedStyle(card);
        const cb = card.getBoundingClientRect();
        const straddle: { cls: string; label: string; cut: number; visFrac: number }[] = [];
        for (const el of card.querySelectorAll('button, .tray-well, .zone-row')) {
          const b = el.getBoundingClientRect();
          if (b.top < cb.bottom && b.bottom > cb.bottom) {
            straddle.push({
              cls: String((el as HTMLElement).className).slice(0, 44),
              label:
                el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 20),
              cut: +(cb.bottom - b.top).toFixed(1),
              visFrac: +((cb.bottom - b.top) / b.height).toFixed(3),
            });
          }
        }
        const play = card.querySelector('[aria-label*="together"]');
        return {
          maxHeight: cs.maxHeight,
          clientH: card.clientHeight,
          scrollH: card.scrollHeight,
          hidden: card.scrollHeight - card.clientHeight,
          gutter: card.offsetWidth - card.clientWidth, // 0 = an overlay bar with no layout width
          scrollbarWidth: cs.scrollbarWidth,
          scrollPaddingBottom: cs.scrollPaddingBottom,
          straddle,
          playBelowFold: play
            ? +(play.getBoundingClientRect().top - cb.bottom).toFixed(1)
            : null,
        };
      });

      console.log(`[W2-BASELINE §2.3] ${cell.width}×${cell.height} ${JSON.stringify(fold)}`);

      // The one thing this row DOES hold: the card must actually be a fold. If it stops
      // overflowing, the §2.3 affordance work has no subject and the baseline is stale.
      expect(fold.hidden, 'the card must overflow its frame at this viewport').toBeGreaterThan(0);
    });
  });
}
