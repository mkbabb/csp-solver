import { test, expect, type Page } from '@playwright/test';

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
  await page.waitForTimeout(800); // reveal wave settles
}

const boardBox = (page: Page) =>
  page.evaluate(() => {
    const r = document.querySelector('.board-wrapper')!.getBoundingClientRect();
    return { w: r.width, cx: r.x + r.width / 2 };
  });

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

  // The verdict geometry: the board grew ≥24px and took the page's true axis.
  const after = await boardBox(page);
  expect(after.w - before.w).toBeGreaterThanOrEqual(24);
  expect(Math.abs(after.cx - 720)).toBeLessThanOrEqual(2);

  // The case is hidden AND inert — no invisible tab stops (W11 UI-6).
  const rail = page.locator('#controls-drawer');
  await expect(rail).toBeHidden();
  await expect(rail).toHaveAttribute('inert', '');
  await expect(page.locator('.drawer-tab')).toHaveAttribute('aria-expanded', 'false');

  // Persisted: a reload lands closed with no drawer flash.
  await page.reload();
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  await expect(rail).toBeHidden();
  const persisted = await boardBox(page);
  expect(persisted.w - before.w).toBeGreaterThanOrEqual(24);
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

// ── 6. The regime rule: <1024 is a defined no-op — today's stacked flow, no tab ──

test.describe('drawer below the row regime', () => {
  test.use({ viewport: { width: 900, height: 800 } });

  test('<1024: no tab, stacked panel in flow exactly as today', async ({ page }) => {
    await loadSudoku(page);

    await expect(page.locator('.drawer-tab')).toBeHidden();
    await expect(page.locator('.mobile-board-width')).toBeVisible();
    await expect(page.locator('#controls-drawer')).toBeHidden(); // lg:hidden rail

    // Even a persisted-closed drawer must not touch the stacked layout.
    await page.evaluate(() => localStorage.setItem('csp-drawer-open', '0'));
    await page.reload();
    await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
    await expect(page.locator('.mobile-board-width')).toBeVisible();
    await expect(page.locator('.drawer-tab')).toBeHidden();
  });
});
