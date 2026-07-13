import { test, expect, type Page } from '@playwright/test';

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
 * so it's located by its stable position — the 4th action icon-btn in `.controls-card` (the
 * desktop panel; scoping to `.controls-card` dodges the hidden mobile twin).
 */

function b64url(s: string): string {
  return Buffer.from(s, 'binary')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
function encodeSudoku(size: number, cells: Record<number, number>, total: number): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return b64url(`${size}.${c}`);
}

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

// The 4th action icon in the desktop panel is Share (Randomize · Clear · Solve · Share).
function shareButton(page: Page) {
  return page.locator('.controls-card button.icon-btn').nth(3);
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

  const failMsg = "couldn't copy — link is in the address bar";
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

  const failMsg = "couldn't copy — link is in the address bar";
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
