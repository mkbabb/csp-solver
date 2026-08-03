import { test, expect, type Page } from '@playwright/test';

// PRM: live, because this file's subject IS the running glide—the close row samples
//   `document.getAnimations()` mid-flight for the four movers' easings, and PRM swaps the drawer
//   to an instant state cut, which reds it. The `drawer under prefers-reduced-motion` describe
//   emulates reduce at the test that wants it; the file's rule stays NO-PRM, and the CH-65
//   reclassification of these rows stays dead.

// T3-W12 §6 — THE DRAWER: the controls card as the pencil case tucked under the
// worksheet. Codifies the owner's verbatim brief ("controls function as a drawer that
// slides underneath the board, with the board and logo centering and growing bigger…
// smoothly and fully animated") + the wave's a11y contract and regime rule.
//
// Selector discipline (session-proven): control queries scope to `.controls-card`;
// the drawer's own furniture has first-party hooks (`.drawer-tab`, `#controls-drawer`).
// Chromium is the config default; the acceptance band is 1440×900 (wave §6 gate).

test.use({ viewport: { width: 1440, height: 900 } });

async function loadSudoku(page: Page, query = '?size=3&difficulty=EASY') {
  await page.goto('./' + query);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  // Grid draw-in → boil steady-state handoff: `.is-active` exists only once the grid has
  // finished drawing in (holds under prefers-reduced-motion too — the beat freezes at
  // pose 0, still is-active), so it's the board's settle. Replaces the reveal-wave sleep.
  await page.waitForSelector('g.boil-frame-layer.is-active', {
    state: 'attached', // stays attached in both baked (display:none) & filtered steady forms
    timeout: 15000,
  });
}

const boardBox = (page: Page) =>
  page.evaluate(() => {
    const r = document.querySelector('.board-wrapper')!.getBoundingClientRect();
    return { w: r.width, cx: r.x + r.width / 2 };
  });

/**
 * THE SETTLED READ (T7-W3 — CH-63 instance 10, the discipline cure).
 *
 * `boardBox` one-shot is honest only if the board has stopped moving, and nothing here ever
 * established that: the 900ms rAF window below is the glide CONTRACT's measurement window, not
 * a settle, and on a loaded runner its last frame can still be mid-glide. The figure then went
 * straight into a non-retrying `expect` — the disease's exact shape (`scripts/check-sleep-lint.mjs`
 * W2).
 *
 * So the rect is read across TWO CONSECUTIVE ANIMATION FRAMES, in one round trip, and only
 * agreement between them counts as settled. Nothing is derived from elapsed time: a moving
 * board keeps disagreeing until it stops, and a board that never stops reds with what it was
 * doing instead of quietly handing a mid-glide sample to an assertion.
 */
const twoFrameBoardBox = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<{ w: number; cx: number }[]>((res) => {
        const read = () => {
          const r = document.querySelector('.board-wrapper')!.getBoundingClientRect();
          return { w: +r.width.toFixed(2), cx: +(r.x + r.width / 2).toFixed(2) };
        };
        requestAnimationFrame(() => {
          const a = read();
          requestAnimationFrame(() => res([a, read()]));
        });
      }),
  );

async function settledBoardBox(page: Page, where: string) {
  let pair = await twoFrameBoardBox(page);
  await expect
    .poll(
      async () => {
        pair = await twoFrameBoardBox(page);
        return pair[0].w === pair[1].w && pair[0].cx === pair[1].cx;
      },
      {
        timeout: 4000,
        message:
          `${where}: the board's rect never agreed across two consecutive frames, so it is ` +
          `still moving — every figure read off it here is a mid-glide sample`,
      },
    )
    .toBe(true);
  return pair[1];
}

// ── 1. Default OPEN + the tab affordance ─────────────────────────────

test('drawer: default open — tab present (≥44px), aria wired, controls visible', async ({
  page,
}) => {
  await loadSudoku(page);

  const tab = page.locator('.drawer-tab');
  await expect(tab).toBeVisible();
  await expect(tab).toHaveAttribute('aria-expanded', 'true');
  await expect(tab).toHaveAttribute('aria-controls', 'controls-drawer');
  const box = (await tab.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);

  await expect(page.locator('#controls-drawer .controls-card')).toBeVisible();
});

// ── 2. Close — transform-only glide, ONE layout step at ONSET (classic FLIP,
//        W13 §3-S2), the case tucks HORIZONTALLY under the sheet on the ONE
//        ledgered glass curve (§3-S5 + S3′, the audit-4 owner ruling), board
//        grows ≥24px and centers on the page axis; state persists across reload ──
//
// NO PRM ON THIS ROW, BY CONSTRUCTION — T7-W3, and it closes the CH-65 reclassification so it
// cannot be re-proposed.
//
// CITED BY CONTENT, NEVER BY LINE (T7-W3 ruling 2). The wave ordered cites to `:148`/`:150`;
// those were re-derived once and then invalidated by a six-line sibling edit inside the same
// wave, so a reader following the numbers landed on the rail-drift assertion — an assertion PRM
// would not touch — and the annotation argued for itself out of the wrong evidence. The
// referents are named by their own text instead:
//
//   · THE EASING-CARRIAGE CHECK — `expect(midEasings.length).toBeGreaterThan(0)`: the mid-glide
//     frames must carry easings AT ALL.
//   · THE FOUR-MOVERS-SAME-FRAME CHECK —
//     `expect(Math.max(...midSamples.map((s) => s.easings.length))).toBe(4)`: sheet, case, tab
//     and masthead all reporting in ONE frame.
//
// Both read `document.getAnimations()` while the glide runs, and both live under the S3′ comment
// below. Under `emulateMedia({reducedMotion:'reduce'})` the drawer swaps its two layout states
// in one frame: `drawer-gesturing` never latches, the movers never animate, and both go red on
// a perfectly healthy tree. Freezing motion here does not stabilise the row, it deletes what the
// row measures. The file's ONLY PRM emulation is the `drawer under prefers-reduced-motion`
// describe (§5), scoped there deliberately; this row's flake cure is the settled read below,
// not a frozen clock.

test('drawer: close glides transform-only, board grows ≥24px + centers, persists', async ({
  page,
}) => {
  await loadSudoku(page);
  const before = await boardBox(page);

  // rAF sampler through the glide: classic FLIP — the filtered board's LAYOUT
  // width flips ONCE at onset (it rasters at its final size from frame one; the
  // §6 binding perf constraint — no size tween on a filtered element — keeps) and
  // never mutates again; the settle frame clears animations only, zero layout.
  // Per-frame painted rects + mid-glide mover easings feed the S5/S3′ contract.
  type Sample = {
    t: number;
    layoutW: number;
    gesturing: boolean;
    railL: number;
    railT: number;
    boardT: number;
    easings: string[];
  };
  const samples = await page.evaluate(
    () =>
      new Promise<Sample[]>((res) => {
        const board = document.querySelector<HTMLElement>('.board-wrapper')!;
        const rail = document.querySelector<HTMLElement>('#controls-drawer')!;
        const grab = (t: number): Sample => {
          const rr = rail.getBoundingClientRect();
          const br = board.getBoundingClientRect();
          return {
            t,
            layoutW: board.offsetWidth,
            gesturing: document.documentElement.classList.contains('drawer-gesturing'),
            railL: rr.left,
            railT: rr.top,
            boardT: br.top,
            easings: document
              .getAnimations()
              .filter((a) => {
                const target =
                  a.effect instanceof KeyframeEffect ? a.effect.target : null;
                return (
                  target instanceof HTMLElement &&
                  (target.matches('.board-peek-host, #controls-drawer, .drawer-tab') ||
                    target.matches('.masthead'))
                );
              })
              .map((a) => (a.effect as KeyframeEffect).getTiming().easing as string),
          };
        };
        const out: Sample[] = [grab(-1)]; // pre-click
        const t0 = performance.now();
        document.querySelector<HTMLElement>('.drawer-tab')!.click();
        function tick() {
          const t = performance.now() - t0;
          out.push(grab(t));
          if (t < 900) requestAnimationFrame(tick);
          else res(out);
        }
        requestAnimationFrame(tick);
      }),
  );

  // The ONE layout step landed at onset: the first post-click frame already holds
  // the closed (grown) width…
  const openW = samples[0].layoutW;
  const closedW = samples[1].layoutW;
  expect(closedW).toBeGreaterThan(openW);
  // …and NO further layout mutation occurs — mid-glide or at settle.
  expect(samples.slice(1).filter((s) => s.layoutW !== closedW)).toHaveLength(0);
  // Exactly two distinct layout widths across the whole gesture: open → closed.
  expect([...new Set(samples.map((s) => s.layoutW))]).toHaveLength(2);

  // S5 — the pull-out geometry (audit-4 ruling): the case travels HORIZONTALLY
  // in under the sheet — leftward, monotone, zero overshoot past the tuck — and
  // no frame paints it above the board's top or in the masthead zone.
  const glide = samples.slice(1);
  const settled = glide[glide.length - 1];
  for (let i = 1; i < glide.length; i++) {
    expect(glide[i].railL).toBeLessThanOrEqual(glide[i - 1].railL + 0.5); // monotone in
    expect(glide[i].railL).toBeGreaterThanOrEqual(settled.railL - 0.5); // zero overshoot
    expect(glide[i].railT).toBeGreaterThan(glide[i].boardT); // never above the sheet
  }
  // Horizontal vector: the case's total vertical drift across the glide is the
  // sheet's own center drift (~3px at 1440×900), never a travel of its own.
  expect(Math.abs(settled.railT - samples[0].railT)).toBeLessThanOrEqual(6);

  // S3′ — every mid-glide mover rides the ONE recorded glass curve (the house
  // ledger row, MOTION.curves.drawerGlide); the dead spring appears nowhere.
  const midSamples = glide.filter((s) => s.gesturing && s.t < 400);
  const midEasings = midSamples.flatMap((s) => s.easings);
  expect(midEasings.length).toBeGreaterThan(0);
  // …and all four movers (sheet, case, tab, masthead) fly together — one clock.
  expect(Math.max(...midSamples.map((s) => s.easings.length))).toBe(4);
  for (const e of midEasings) expect(e).toBe('cubic-bezier(0.32, 0.72, 0, 1)');

  // The verdict geometry, taken at SETTLE rather than at a deadline (T7-W3, CH-63 instance 10).
  // The old form read `boardBox` once, 40 lines downstream of a fixed 900ms window, and fed it
  // to a non-retrying expect: the row passed because the machine was fast, and it is the same
  // shape as every other discipline defect in the class. Now the rect must agree across two
  // consecutive frames before any figure comes off it, and the verdict itself retries — a
  // mid-glide sample can no longer reach an assertion.
  await expect
    .poll(
      async () => {
        const after = await settledBoardBox(page, 'the closed board');
        return {
          grew: after.w - before.w >= 24,
          onAxis: Math.abs(after.cx - 720) <= 2,
          measured: `Δw=${(after.w - before.w).toFixed(2)} cx=${after.cx.toFixed(2)}`,
        };
      },
      { timeout: 8000, message: 'the closed board must grow ≥24px and take the page axis' },
    )
    .toMatchObject({ grew: true, onAxis: true });

  // The case is hidden AND inert — no invisible tab stops (W11 UI-6).
  const rail = page.locator('#controls-drawer');
  await expect(rail).toBeHidden();
  await expect(rail).toHaveAttribute('inert', '');
  await expect(page.locator('.drawer-tab')).toHaveAttribute('aria-expanded', 'false');

  // Persisted: a reload lands closed with no drawer flash. Settled read again — a reload's
  // board grows into place, so a one-shot rect here is the same defect one beat later.
  await page.reload();
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await expect(rail).toBeHidden();
  await expect
    .poll(
      async () => (await settledBoardBox(page, 'the reloaded board')).w - before.w,
      { timeout: 8000, message: 'the closed pose must survive the reload' },
    )
    .toBeGreaterThanOrEqual(24);
});

// ── 3. A11y choreography: focus into the drawer on open, Esc closes from within,
//        focus returns to the tab ──

test('drawer: open focuses the first control; Esc closes from within and returns focus to the tab', async ({
  page,
}) => {
  await loadSudoku(page);

  // Close first (default is open), then reopen and watch focus.
  await page.locator('.drawer-tab').click();
  await expect(page.locator('#controls-drawer')).toBeHidden({ timeout: 3000 });

  await page.locator('.drawer-tab').click();
  await expect(page.locator('#controls-drawer')).toBeVisible({ timeout: 3000 });
  await expect
    .poll(
      () =>
        page.evaluate(() => !!document.activeElement?.closest('#controls-drawer')),
      { timeout: 3000 },
    )
    .toBe(true);

  // Esc from within the drawer closes it; focus comes home to the tab.
  await page.keyboard.press('Escape');
  await expect(page.locator('#controls-drawer')).toBeHidden({ timeout: 3000 });
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          document.activeElement?.classList.contains('drawer-tab'),
        ),
      { timeout: 3000 },
    )
    .toBe(true);
});

// ── 4. The drawer hides the card, not the capabilities: keyboard entry, undo,
//        and K-peek all work with the controls tucked away ──

test('drawer: keyboard shortcuts (undo, K-peek) work with the drawer closed', async ({
  page,
}) => {
  await loadSudoku(page);
  await page.locator('.drawer-tab').click();
  await expect(page.locator('#controls-drawer')).toBeHidden({ timeout: 3000 });

  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].querySelector('.glyph-svg')) return i;
    }
    return -1;
  });
  expect(blank).toBeGreaterThanOrEqual(0);

  const input = page.locator('.board-cells input').nth(blank);
  await input.click();
  await page.keyboard.type('5');
  await expect(input).toHaveValue('5');
  await page.keyboard.press('Control+z');
  await expect(input).toHaveValue('');

  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.keyboard.press('k');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(1, {
    timeout: 20000,
  });
  await page.keyboard.press('Escape');
  await expect(page.locator('.answer-key-laminate.is-shown')).toHaveCount(0, {
    timeout: 5000,
  });
});

// ── 5. PRM: no slide, no scale — a same-frame swap of the two layout states ──

test.describe('drawer under prefers-reduced-motion', () => {
  test('PRM: toggle is an instant state swap — no glide class, immediate layout', async ({
    page,
  }) => {
    // emulateMedia BEFORE load: the composable's module-level matchMedia ref reads
    // its initial `matches` at bundle init (test.use({ reducedMotion }) proved
    // unreliable on this runner — the explicit emulation is the verified path).
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await loadSudoku(page);
    const before = await boardBox(page);

    const probe = await page.evaluate(() => {
      document.querySelector<HTMLElement>('.drawer-tab')!.click();
      // Synchronous truth, same task as the click: the layout class is already
      // down and no gesture window ever opens under PRM.
      return {
        prm: matchMedia('(prefers-reduced-motion: reduce)').matches,
        closed: document.documentElement.classList.contains('drawer-closed'),
        gesturing: document.documentElement.classList.contains('drawer-gesturing'),
      };
    });
    expect(probe).toEqual({ prm: true, closed: true, gesturing: false });

    const after = await boardBox(page);
    expect(after.w - before.w).toBeGreaterThanOrEqual(24);
    await expect(page.locator('#controls-drawer')).toBeHidden();
  });
});

// ── 6. The regime rule, RE-CUT (T5-W4 pass 6) ────────────────────────────────────────────
//
// The old row asserted a world: "<1024: no tab, stacked panel in flow exactly as today". That
// world is half gone and half RATIFIED, and one assertion cannot say both, so it splits into
// the two rungs the pass-6 charter actually rules on:
//   · LANDSCAPE <1024 — HELD. The lead's charter (c) ratifies the shipped rung, so this arm is
//     the old row's claim, kept verbatim in meaning: no tab, the card in flow, the toggle a
//     defined no-op. It carries the orientation guard's own ablation as its control, because
//     an unscoped `<1024` pose reads ~1.47 there and would have moved a ratified surface.
//   · PORTRAIT <1024 — THE DOCK. Tab visible and tappable, the card a fixed sheet, inert and
//     hidden at rest, the board's rect IDENTICAL across the gesture, always lands closed, and a
//     persisted-open desk choice does not carry the crossing.
// Both were born RED on `abe533c4`: below 1024 no tab exists at all on that tree.

test.describe('drawer below the row regime — LANDSCAPE holds the shipped rung', () => {
  test.use({ viewport: { width: 900, height: 500 } });

  test('<1024 landscape: no tab, the card in flow, the toggle a defined no-op', async ({
    page,
  }) => {
    await loadSudoku(page);

    await expect(page.locator('.drawer-tab')).toBeHidden();
    const card = page.locator('#controls-drawer');
    await expect(card).toBeVisible();
    expect(await card.evaluate((el) => getComputedStyle(el).position)).toBe('static');

    // Even a persisted-closed drawer must not touch this layout: the toggle is a no-op here,
    // so the persisted desk pose has nothing to act on.
    await page.evaluate(() => localStorage.setItem('csp-drawer-open', '0'));
    await page.reload();
    await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
    await expect(page.locator('#controls-drawer')).toBeVisible();
    await expect(page.locator('.drawer-tab')).toBeHidden();

    // CONTROL — ablate the orientation guard (the portrait pose applied on width alone) and
    // the same probe must see the ratified rung leave the flow. This is the exact defect the
    // graft exists to prevent, and without this arm the row above would pass on a tree that
    // had never scoped the pose at all.
    await page.addStyleTag({
      content: '#controls-drawer { position: fixed !important; }',
    });
    expect(await card.evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
  });
});

test.describe('drawer below the row regime — PORTRAIT is the dock', () => {
  test.use({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true });

  test('<1024 portrait: the tongue summons a fixed sheet, and the board never moves', async ({
    page,
  }) => {
    await loadSudoku(page);

    const tab = page.locator('.drawer-tab');
    const drawer = page.locator('#controls-drawer');
    const drawerCase = page.locator('#controls-drawer .drawer-case');

    // The tongue is there and it is a legal target on both axes (92×48).
    await expect(tab).toBeVisible();
    const tabBox = (await tab.boundingBox())!;
    expect(Math.min(tabBox.width, tabBox.height)).toBeGreaterThanOrEqual(44);

    // The sheet is fixed, and at rest the CASE is what hides — never the region, which must
    // keep carrying the tongue or the drawer would be unopenable-closed.
    expect(await drawer.evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
    await expect(drawerCase).toBeHidden();
    await expect(tab).toHaveAttribute('aria-expanded', 'false');

    // THE NO-RELAYOUT CLAIM, WRITTEN AS A RECT IDENTITY rather than as a phrase.
    const boardRect = () =>
      page.locator('.board-cells').evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2) };
      });
    const before = await boardRect();

    await tab.tap();
    await expect(drawerCase).toBeVisible();
    await page.waitForTimeout(700);
    await expect(tab).toHaveAttribute('aria-expanded', 'true');
    expect(await boardRect()).toEqual(before);

    await tab.tap();
    await page.waitForTimeout(700);
    await expect(drawerCase).toBeHidden();
    expect(await boardRect()).toEqual(before);
  });

  test('<1024 portrait always lands closed, and a persisted-open desk choice does not carry', async ({
    page,
  }) => {
    // G3, and it is a ruling rather than a preference: an open sheet restored on a portrait
    // load would resurrect the covered-board pose the covis row exists to kill. The desk's key
    // is untouched and desk-scoped — this only refuses to READ it into a portrait mount.
    await page.goto('./?size=3&difficulty=EASY');
    await page.evaluate(() => localStorage.setItem('csp-drawer-open', '1'));
    await page.reload();
    await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

    await expect(page.locator('#controls-drawer .drawer-case')).toBeHidden();
    await expect(page.locator('.drawer-tab')).toHaveAttribute('aria-expanded', 'false');

    // …and an open made HERE is transient: it must not write the desk's key.
    await page.locator('.drawer-tab').tap();
    await expect(page.locator('#controls-drawer .drawer-case')).toBeVisible();
    await page.waitForTimeout(700);
    expect(await page.evaluate(() => localStorage.getItem('csp-drawer-open'))).toBe('1');

    // CONTROL — the probe must be able to see the key change. The desk writes it.
    await page.evaluate(() => localStorage.setItem('csp-drawer-open', '0'));
    expect(await page.evaluate(() => localStorage.getItem('csp-drawer-open'))).toBe('0');
  });
});
