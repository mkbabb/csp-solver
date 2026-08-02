import { test, expect, type Page } from '@playwright/test';

// D3 throttled-void gate (T3-W7 §e2e, G10 exhibit `g10-shots/first-select-void-400ms.png`).
//
// Futoshiki mounts from a lazy async chunk (its card's `load: () =>
// import('@games/futoshiki/spec')`, resolved through App.vue's `defineAsyncComponent`) with
// NO loading fallback. On
// first select the outgoing Sudoku scene detaches same-frame while the chunk
// fetches — a blank-paper void until it resolves. On unthrottled localhost the
// void is ~14 ms (invisible — why it survived every prior sweep); on any real
// network it is the F6 spec's case (G10 reproduced pure empty paper at 150/400/
// 800/1500/3000 ms on the live instance under CDP 30 KB/s + 500 ms latency).
//
// This codifies the guard: under the same CDP throttle, a mounted board-shell MUST appear
// within N ms of first select — i.e. the void is bounded and the scene recovers, never a
// permanent blank. It is NOT a claim of instant feedback: no fast pre-chunk loader exists
// today (that's the F6 beat-2 design item); today's honest bound is the full-scene mount
// time. (The pre-fix code OR'd in a `.scribble-loader` that provably does not exist yet — a
// phantom that could never satisfy the wait; the OR is dropped for the one real satisfier.)
//
// F3 flake fix (T4-W2): this spec runs against a BUNDLED preview build, NOT the dev server
// (playwright-throttle.config.ts / `npm run test:e2e:throttle`; the default config
// testIgnores it). On the dev server the Futoshiki chunk is unbundled ESM — dozens of
// modules each pay the 500 ms latency serially, so recovery landed at ~13 s (12.87/13.07/
// 13.22 s), >50% of budget and compounding past it on a loaded runner. `vite build` bundles
// Futoshiki into ONE hashed chunk, so the throttled first-select fetches a single asset and
// recovery is bounded to a few seconds with wide margin. N = 25 s keeps that margin; a
// regression that leaves the scene void past N — or truly stuck — still trips this gate.
const VOID_RECOVERY_BUDGET_MS = 25000;

async function loadSudokuScene(page: Page) {
  // './' resolves relative to baseURL (subpath-deploy safe), matching the suite.
  await page.goto('./');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
  // The default Sudoku scene is fully painted before we throttle + switch.
  await expect(page.locator('.sudoku-cell').first()).toBeVisible({ timeout: 15000 });
}

test('throttled first-select void recovers: loader or board-shell within budget', async ({
  page,
}) => {
  // Recovery is a few seconds under throttle against the bundled preview build; the
  // headroom also covers the config's build+preview startup on a cold runner.
  test.setTimeout(60000);

  await loadSudokuScene(page);

  // CDP throttle AFTER initial load — exactly G10's reproduction: the app is warm,
  // only the lazy Futoshiki chunk pays the 30 KB/s + 500 ms tax. Chromium-only
  // (the default project); CDP is unavailable on other engines.
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 30 * 1024, // 30 KB/s, in bytes/second
    uploadThroughput: 30 * 1024,
    latency: 500, // ms
  });

  // First futoshiki select via the GALLERY (T4-W12 Wave D — the wordmark opens the carousel;
  // the dropdown listbox is retired). Opening the gallery warms the futoshiki chunk
  // (preloadFutoshiki on open), so it downloads under throttle in parallel with the nav.
  await page.locator('button.logo-trigger').click();
  const viewport = page.locator('.gallery-viewport');
  await viewport.waitFor({ state: 'visible', timeout: 15000 });
  await viewport.press('ArrowRight'); // sudoku (centered) → futoshiki
  await viewport.press('Enter'); // select the centered futoshiki card

  // The gate: the Futoshiki board-shell mounts within budget — the void is bounded, not
  // permanent. board-shell is the one real satisfier (it mounts with the scene). The old
  // `.scribble-loader` OR-arm was a phantom (that selector doesn't exist today — the F6
  // beat-2 loader isn't built), so it's removed: a wait can't be satisfied by a phantom.
  await page.waitForSelector('.board-shell', {
    timeout: VOID_RECOVERY_BUDGET_MS,
  });

  // Prove it actually recovered into the Futoshiki scene, not a stale Sudoku frame.
  await expect(page.locator('.board-shell')).toHaveCount(1);
});
