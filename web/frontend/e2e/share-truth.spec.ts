import { test, expect, type Page } from '@playwright/test';
import { encodeSudoku } from './wire';

// PRM: live, because what's asserted is the clipboard promise, the aria confirmation and the
//   margin voice—text and state, never geometry or pixels the beat moves. No route applies PRM.

/**
 * T4-W3 — share truth. The confirmation must key off the clipboard PROMISE, not assert a
 * success it never checked, and a corrupt `?board=` must SIGNAL rather than silently deal a
 * fresh board. Proves:
 *   1. success — a granted clipboard resolves → "copied!" / aria "Link copied", and the
 *      clipboard ACTUALLY holds the shared link (readText truth, not just the label);
 *   2. failure — writeText rejecting (permission-policy denial / insecure context) →
 *      "couldn't copy — link is in the address bar", and the `?board=` link is still live in
 *      the address bar (never lost — replaceState landed before the copy);
 *   3. corrupt link — a malformed `?board=` surfaces "this shared link couldn't be read" in
 *      the margin voice, then proceeds to its fresh deal.
 * Twin-symmetric: sudoku + futoshiki both.
 *
 * Selector discipline (permalink.spec.ts): the Share button's aria-label MUTATES with outcome,
 * so it's located by its stable position — the 5th action icon-btn in `.controls-card` (the
 * desktop panel; scoping to `.controls-card` dodges the hidden mobile twin). T4-W8 inserted the
 * Fill button between Clear and Solve, so Share moved from the 4th to the 5th action icon.
 */

// Encoder from wire.ts — this spec's local copy was UNTAGGED (the dead v0 wire), so its
// "shared board" fixtures were silently refused at decode and every share here shared a
// fresh deal. Green anyway, because the assertions only ever read the share act's own
// write-back — but the premise was false. T5-W4 pass 8, with the history on wire.ts.

// "foobarbaz" — base64url-decodes cleanly but has no size-dot structure → the codec fails
// closed to 'invalid' (never a corrupt board). A present-but-unreadable link.
const CORRUPT = 'Zm9vYmFyYmF6';

const FAIL_INIT = () => {
  // Force navigator.clipboard.writeText to REJECT — the permission-policy-denial / insecure-
  // context path, made deterministic (headless localhost is otherwise a secure context).
  const rej = () => Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError'));
  try {
    if (navigator.clipboard)
      Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: rej });
    else Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: rej } });
  } catch {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, get: () => ({ writeText: rej }) });
  }
};

// Share is the LAST verb in the action bar's own row — addressed structurally, not by an index
// into every `.icon-btn` on the card. The index was `nth(4)` and it broke the moment T6 mark 13
// put a fifth `.icon-btn` (the players well's invite) ahead of the bar: a positional locator
// over a card that grows compartments is a gate that reds on furniture. The `aria-label` can't
// do the addressing here either — the label is exactly what these rows assert changes.
function shareButton(page: Page) {
  return page.locator('.controls-card .action-verbs button.icon-btn').last();
}

// ── 1. Sudoku: success confirms off a REAL clipboard write ──────────────────
test('sudoku share success: label + aria confirm AND the clipboard holds the link', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('./?board=' + encodeSudoku(3, { 0: 5 }, 81));
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  const share = shareButton(page);
  await expect(share).toHaveAttribute('aria-label', 'Share board link');

  await share.click();

  await expect(share).toHaveAttribute('aria-label', 'Link copied');
  await expect(share.locator('.washi-label')).toHaveText('copied!');
  // The truth the old optimistic flip never checked: the clipboard actually got the href.
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toBe(page.url());
  expect(clip).toContain('board=');
});

// ── 2. Sudoku: a rejected write says so, link stays in the address bar ───────
test('sudoku share failure: "couldn\'t copy" signal, link still live in the address bar', async ({
  page,
  context,
}) => {
  await context.addInitScript(FAIL_INIT);
  await page.goto('./?board=' + encodeSudoku(3, { 0: 5 }, 81));
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  const share = shareButton(page);

  await share.click();

  // T8-W6 M16 — the em dash that joined the two clauses is banned in product copy; the
  // failure now says both as sentences.
  const failMsg = "couldn't copy. the link is in the address bar";
  await expect(share).toHaveAttribute('aria-label', failMsg);
  await expect(share.locator('.washi-label')).toHaveText(failMsg);
  // The clean break's guarantee: the shared link is NOT lost — it's in the address bar.
  expect(new URL(page.url()).searchParams.has('board')).toBe(true);
});

// ── 3. Futoshiki twin: a rejected write says so ─────────────────────────────
test('futoshiki share failure: the same "couldn\'t copy" signal (twin)', async ({
  page,
  context,
}) => {
  await context.addInitScript(FAIL_INIT);
  await page.goto('./?game=futoshiki');
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  // Let the auto-dealt board settle so Share has a real board to encode: the generated
  // puzzle's inequality carets have rendered (a futoshiki board can carry zero given
  // digits, so the caret — not a cell glyph — is the reliable deal signal). No sleep.
  await expect(page.locator('.futoshiki-caret').first()).toBeVisible({ timeout: 15000 });
  const share = shareButton(page);

  await share.click();

  // T8-W6 M16 — the em dash that joined the two clauses is banned in product copy; the
  // failure now says both as sentences.
  const failMsg = "couldn't copy. the link is in the address bar";
  await expect(share).toHaveAttribute('aria-label', failMsg);
  await expect(share.locator('.washi-label')).toHaveText(failMsg);
  expect(new URL(page.url()).searchParams.has('board')).toBe(true);
});

// ── 4. Corrupt link surfaces the margin voice (sudoku) ──────────────────────
test('sudoku corrupt ?board= surfaces the margin-voice notice', async ({ page }) => {
  await page.goto('./?board=' + CORRUPT);
  await page.waitForSelector('.sudoku-cell', { timeout: 15000 });
  await expect(page.locator('.margin-note')).toContainText("this shared link couldn't be read", {
    timeout: 20000,
  });
});

// ── 5. Corrupt link surfaces the margin voice (futoshiki twin) ──────────────
test('futoshiki corrupt ?board= surfaces the margin-voice notice (twin)', async ({ page }) => {
  await page.goto('./?game=futoshiki&board=' + CORRUPT);
  await page.waitForSelector('.futoshiki-cell', { timeout: 15000 });
  await expect(page.locator('.margin-note')).toContainText("this shared link couldn't be read", {
    timeout: 20000,
  });
});
