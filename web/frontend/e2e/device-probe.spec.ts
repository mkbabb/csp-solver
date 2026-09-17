import { test, expect, type Page } from '@playwright/test';

// PRM: live, because the probe's whole subject is the running surface—it reads frame deltas
//   off a boiling board and mounts only after its own 8 s observation window closes, so a
//   frozen page would hand it a window with no frames in it and nothing to report.

// T9-W8 §8.3 — THE DEVICE INSTRUMENT'S TWO OBLIGATIONS, asserted in both engines.
//
//   1  IT ARMS ONLY UNDER THE FLAG. `?__probe=1` brings a readout and one extra chunk;
//      a load without it makes no probe request, mounts no probe DOM, and the boot path is
//      the one every player gets. This is the row that keeps a DEV instrument out of the
//      product: the guard is one URL read in main.ts and this is what watches it.
//   2  IT EMITS A PARSEABLE ROW WITH EVERY MARK. One JSON line, `readiness.jsonl`'s shape,
//      every mark either a number or the string NOT MEASURED—never 0 for a mark the engine
//      cannot see. WebKit has no `longtask` entry type, so `tbt3000Ms` and its kin are
//      NOT MEASURED there and the frame-gap figure is never called TBT on the readout.
//
// The suite runs this against whatever `PLAYWRIGHT_BASE_URL` points at (the wave's own runs
// use a scratch config pointed at a `vite preview` of the cured dist); nothing here reads a
// hashed asset name, so it holds on the dev server too.

const CARD = '[data-device-probe]';
const BOARD = '?size=3&difficulty=EASY';

/** Every mark the charter's table names. A key missing from the row is a hole in the record. */
const REQUIRED_MARKS = [
  'cell',
  'ua',
  'dpr',
  'vp',
  'cache',
  'probeArmedMs',
  'firstPaintMs',
  'fcpMs',
  'lcpMs',
  'boardReadyMs',
  'cellsMs',
  'givensMs',
  'givensMinusCellsMs',
  'firstBakeMs',
  'bakeLayers',
  'firstBoilTickMs',
  'boardDrawnMs',
  'ltSupported',
  'tbt3000Ms',
  'longtasks3000',
  'longestTaskMs',
  'busyToBoardReadyMs',
  'rafGapProxyTbtMs',
  'worstRafGapMs',
  'transferBytes',
  'resourceCount',
  'woff2Requests',
  'firstToggleSettleMs',
  'firstToggleBakes',
  'firstToggleBlockingProxyMs',
  'laterToggleSettleMedianMs',
  'firstMinusLaterToggleMs',
  'controlsInteractiveMs',
  'controlsHow',
  'drawerFirstGestureWorstMs',
  'galleryToBoardLong33',
  'galleryToPickerCellsWidths',
  'galleryWidthsNode',
  'taint',
  'tainted',
  'at',
];

async function readRow(page: Page): Promise<Record<string, unknown>> {
  const text = await page.locator(`${CARD} pre`).textContent();
  expect(text, 'the readout renders the row as selectable text under the button').toBeTruthy();
  return JSON.parse(text as string) as Record<string, unknown>;
}

test.describe('the device probe', () => {
  test('arms under ?__probe=1 and emits a parseable row carrying every mark', async ({
    page,
  }) => {
    test.setTimeout(90000);
    const probeRequests: string[] = [];
    page.on('request', (r) => {
      if (/devicePaint/.test(r.url())) probeRequests.push(r.url());
    });

    await page.goto(`/${BOARD}&__probe=1`);
    // The card is appended only when the 8 s observation window closes, so the window it
    // reports has no probe DOM in it. This waits for that, and retries until it lands.
    await expect(page.locator(CARD)).toBeVisible({ timeout: 30000 });

    expect(probeRequests.length, 'the probe rides its own chunk, fetched on demand').toBe(1);

    const row = await readRow(page);
    for (const key of REQUIRED_MARKS) {
      expect(row, `the row carries ${key}`).toHaveProperty(key);
      const v = row[key];
      expect(
        typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean' || Array.isArray(v),
        `${key} is a number, a boolean, a taint list, or the words NOT MEASURED`,
      ).toBe(true);
      if (typeof v === 'string' && v !== 'NOT MEASURED' && key.endsWith('Ms'))
        throw new Error(`${key} is the string "${v}" — a mark is a number or NOT MEASURED`);
    }
    expect(String(row.cell)).toMatch(/^device-/);
    expect(row.bootWindowMs).toBe(8000);

    // The engine split, honestly: an engine without `longtask` reports NOT MEASURED for the
    // task census and NEVER a 0, and its frame-gap figure is still a number.
    const hasLongTask = row.ltSupported === true;
    expect(row.tbt3000Ms === 'NOT MEASURED').toBe(!hasLongTask);
    expect(typeof row.rafGapProxyTbtMs).toBe('number');

    // The readout is read by the owner on a phone, and the law is about what it CALLS things:
    // no line of prose may call a frame gap sum a TBT. The JSON block under the buttons is the
    // readiness.jsonl row itself, and it does carry `rafGapProxyTbtMs` and `tbt3000Ms` as key
    // names — the proxy names itself a proxy BEFORE it names Tbt, and `tbt3000Ms` is the real
    // long task census, which reads NOT MEASURED where the engine has none. So the assertion
    // is on the prose, in any case, not on the uppercase spelling of the whole card. (Repair
    // round 1, finding F2: the old row asserted `not.toContain('TBT')` over the card including
    // the JSON, which is true only of the uppercase spelling and claimed more than it read.)
    const shown = (await page.locator(CARD).textContent()) ?? '';
    const json = (await page.locator(`${CARD} pre`).textContent()) ?? '';
    expect(json.length, 'the JSON block is on screen and selectable').toBeGreaterThan(0);
    const prose = shown.split(json).join(' ');
    expect(prose.toLowerCase(), 'no prose line calls a frame gap sum a TBT').not.toContain(
      'tbt',
    );
    expect(prose).toContain('Speed check');
    // And in the row: the only two keys that spell tbt at all are the named proxy and the real
    // census. Nothing else in the shape may borrow the word.
    expect(
      Object.keys(row)
        .filter((k) => /tbt/i.test(k))
        .sort(),
    ).toEqual(['rafGapProxyTbtMs', 'tbt3000Ms']);
  });

  test('gets out of the way of the controls the owner has to tap', async ({ page }) => {
    test.setTimeout(90000);
    // The readout is a panel across the bottom of the screen, which is where the drawer
    // tongue lives. Measured before the cure, a click on `.drawer-tab` timed out 5 of 5 at
    // 390x844 (evidence/w8/cures/8.3/ab-mob4x-armed.jsonl, the pre-cure set). So: declaring
    // the load collapses the panel to its handle, and the tab is reachable again.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${BOARD}&__probe=1`);
    await expect(page.locator(CARD)).toBeVisible({ timeout: 30000 });

    await page.locator(CARD).getByText('First load', { exact: true }).click();
    await expect(page.locator(CARD)).toBeHidden();
    await expect(page.locator('[data-device-probe-handle]')).toBeVisible();

    const tab = page.locator('.drawer-tab').first();
    if (await tab.isVisible()) {
      const before = await tab.getAttribute('aria-expanded');
      await tab.click({ timeout: 5000 });
      await expect(tab).not.toHaveAttribute('aria-expanded', String(before));
    }

    // The handle brings it back, and the load the owner declared survived the round trip.
    await page.locator('[data-device-probe-handle]').click();
    await expect(page.locator(CARD)).toBeVisible();
    const row = await readRow(page);
    expect(row.cell).toBe('device-cold');
  });

  test('is inert without the flag: no probe request, no probe DOM', async ({ page }) => {
    test.setTimeout(90000);
    const probeRequests: string[] = [];
    page.on('request', (r) => {
      if (/devicePaint/.test(r.url())) probeRequests.push(r.url());
    });

    await page.goto(`/${BOARD}`);
    await expect(page.locator('.board-cells .game-cell').first()).toBeVisible();
    // Past the mount moment the armed run uses, so "not yet" cannot pass for "never".
    // sleep-ok: the probe mounts at 8 s and this row exists to prove it never does
    await page.waitForTimeout(9000);

    await expect(page.locator(CARD)).toHaveCount(0);
    expect(probeRequests, 'no chunk is fetched for a probe nobody asked for').toEqual([]);
  });
});
