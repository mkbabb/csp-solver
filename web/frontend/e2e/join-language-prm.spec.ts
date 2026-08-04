import { test, expect, type BrowserContext, type Page } from '@playwright/test';

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto

/**
 * T8-W3 · THE JOIN LANGUAGE UNDER REDUCED MOTION (M14 · lane C).
 *
 * The twin of join-language.spec.ts, and the pair is the gate: that file proves the ring DRAWS,
 * this one proves it does not exist here. Either row alone is a gate that cannot fail — a
 * "no ring under PRM" assertion is trivially green on any tree that never had a ring.
 *
 * §2.7's form, exactly: the trace NEVER RENDERS. Not hidden, not opacity-0, not frozen at a
 * pose — `useJoinWash` holds progress at 0 and progress 0 is what mounts no geometry at all
 * (`v-for … : []`). The roster row lands open with the name already written, and a departure is
 * gone the same frame. Reachable, static, no motion.
 *
 * THE ROUTE IS `emulateMedia` BEFORE `goto`, and that is CH-65's residue made un-re-derivable:
 * `test.use({ reducedMotion })` is VOID at this Playwright, so a spec that claimed a freeze
 * through it measured a moving surface and said otherwise (pinned live by prm-void-audition).
 */

const SOLO = '/?wire=local';

async function settled(page: Page) {
  await page.waitForSelector('svg.handwritten-logo');
  await expect
    .poll(() => page.locator('.sudoku-cell .glyph-svg').count())
    .toBeGreaterThan(0);
}

async function frozen(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  await settled(page);
  // The witness: a spec that merely BELIEVES it is frozen is the defect this route exists for.
  expect(
    await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    ),
  ).toBe(true);
}

async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get('s')).not.toBeNull();
  return page.url();
}

async function pastBootWindow(page: Page) {
  const opened = await page.evaluate(() => performance.now());
  await expect
    .poll(() => page.evaluate((t) => performance.now() - t, opened))
    .toBeGreaterThan(1400);
}

test('a join renders no ring at all, and the row lands open and written', async ({
  browser,
}) => {
  const ctx: BrowserContext = await browser.newContext();
  const a = await ctx.newPage();
  await frozen(a, SOLO);
  const link = await invite(a);
  await pastBootWindow(a);

  const b = await ctx.newPage();
  await frozen(b, link);

  // The join HAPPENED — the roster is the proof, and it is what makes the next assertion mean
  // "no ring" rather than "no join".
  await expect(a.locator('.controls-card .player-row')).toHaveCount(2);

  // NOT ONE NODE. The whole beat window is spent and the layer never mounted; polled across it
  // so a late frame cannot slip a ring in behind the assertion.
  await expect
    .poll(() => a.locator('.join-pose, .join-trace').count(), { timeout: 4000 })
    .toBe(0);

  // The row lands OPEN (its fold is at rest, not mid-glide) and the name lands WRITTEN (no clip
  // wipe is running over it). `useJoinWash` never arms a phase here, so there is nothing to run.
  const rowState = await a.evaluate(() => {
    const peer = [...document.querySelectorAll('.controls-card .player-row')].find(
      (r) => !r.querySelector('.player-self'),
    )!;
    const name = peer.querySelector('.player-name')!;
    return {
      classes: peer.className,
      rowAnim: getComputedStyle(peer).animationName,
      nameAnim: getComputedStyle(name).animationName,
      clip: getComputedStyle(name).clipPath,
      running: document.getAnimations().filter((x) => x.playState === 'running').length,
    };
  });
  expect(rowState.classes).not.toContain('is-arriving');
  expect(rowState.classes).not.toContain('is-returning');
  expect(rowState.rowAnim).toBe('none');
  expect(rowState.nameAnim).toBe('none');
  expect(rowState.clip).toBe('none');

  await ctx.close();
});

test('a departure is gone the same frame: no held row, no retreating ring', async ({
  browser,
}) => {
  const ctx: BrowserContext = await browser.newContext();
  const a = await ctx.newPage();
  await frozen(a, SOLO);
  const link = await invite(a);
  await pastBootWindow(a);
  const b = await ctx.newPage();
  await frozen(b, link);
  await expect(a.locator('.controls-card .player-row')).toHaveCount(2);

  await b.close();

  // One row, immediately: no `is-leaving` row is held for L2/L3's 740ms, because there is no
  // L2 or L3 here. And no ring retreats, because none was ever drawn.
  await expect(a.locator('.controls-card .player-row')).toHaveCount(1);
  expect(await a.locator('.player-row.is-leaving').count()).toBe(0);
  expect(await a.locator('.join-pose, .join-trace').count()).toBe(0);

  await ctx.close();
});

test('a peer’s ghost lands drawn — tier 4 sketches on nowhere', async ({ page }) => {
  await frozen(page, SOLO);

  // The tier's own rule, read off the shipped sheet on a real cell. The class is the cursor's
  // only input (BoardHost binds it from `peerCursors`), so pinning it here is pinning the tier
  // rather than the plumbing — and under PRM the 180ms sketch must simply not be there.
  const tier = await page.evaluate(() => {
    const cell = document.querySelector('.sudoku-cell')!;
    cell.classList.add('is-peer-cursor');
    const path = cell.querySelector('.cell-ghost-path')!;
    const ghost = cell.querySelector('.cell-ghost')!;
    const cs = getComputedStyle(path);
    return {
      animation: cs.animationName,
      dashoffset: cs.strokeDashoffset,
      width: cs.strokeWidth,
      opacity: cs.strokeOpacity,
      ghostOpacity: getComputedStyle(ghost).opacity,
    };
  });
  expect(tier.animation).toBe('none');
  expect(parseFloat(tier.dashoffset)).toBe(0); // lands drawn, never at 1
  // Lighter than your own hand, on every axis a tier has (tier 1 graphite is 5 at 0.65).
  expect(parseFloat(tier.width)).toBe(4);
  expect(parseFloat(tier.opacity)).toBeCloseTo(0.55, 2);
  // And it shows without being hovered — a peer's pencil is somewhere whether or not yours is.
  expect(parseFloat(tier.ghostOpacity)).toBe(1);
});
