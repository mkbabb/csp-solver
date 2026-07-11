import { test, expect, type Page } from '@playwright/test';

// D3 throttled-void gate (T3-W7 §e2e, G10 exhibit `g10-shots/first-select-void-400ms.png`).
//
// The Futoshiki scene is a lazy async chunk (App.vue: `defineAsyncComponent(() =>
// import('@games/futoshiki/FutoshikiGame.vue'))`) with NO loading fallback. On
// first select the outgoing Sudoku scene detaches same-frame while the chunk
// fetches — a blank-paper void until it resolves. On unthrottled localhost the
// void is ~14 ms (invisible — why it survived every prior sweep); on any real
// network it is the F6 spec's case (G10 reproduced pure empty paper at 150/400/
// 800/1500/3000 ms on the live instance under CDP 30 KB/s + 500 ms latency).
//
// This codifies the guard: under the same CDP throttle, a ScribbleLoader OR a
// mounted board-shell MUST appear within N ms of first select — i.e. the void is
// bounded and the scene recovers, never a permanent blank. It is NOT a claim of
// instant feedback: no fast pre-chunk loader exists today (that's the F6 beat-2
// design item); today's honest bound is the full-scene mount time.
//
// N is re-measured in-harness (K10/K18, wave §Residual — "green is the load-bearing
// fact, not the integers"): under this dev server (unbundled ESM, per-module 500 ms
// latency) recovery lands at ~13.0 s (12.87/13.07/13.22 s across three probe runs).
// N = 25 s gives ~90% margin over the measured bound and stays under the per-test
// timeout raised below. A regression that leaves the scene void past N — or truly
// stuck — trips this gate.
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
  // Recovery is ~13 s under throttle on this dev server; give the case headroom.
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

  // First futoshiki select via the wordmark listbox (the suite's switch idiom).
  await page.locator('button.logo-trigger').click();
  await page.getByRole('option', { name: 'futoshiki' }).click();

  // The gate: a loader OR a mounted board-shell appears within budget — the void
  // is bounded, not permanent. board-shell is the reliable satisfier (it mounts
  // with the scene); ScribbleLoader (.scribble-loader) is the F6 beat-2 target
  // the OR admits without asserting it exists today.
  await page.waitForSelector('.scribble-loader, .board-shell', {
    timeout: VOID_RECOVERY_BUDGET_MS,
  });

  // Prove it actually recovered into the Futoshiki scene, not a stale Sudoku frame.
  await expect(page.locator('.board-shell')).toHaveCount(1);
});
