// ─────────────────────────────────────────────────────────────────────────────
// §2.5b — THE PIN BAND IS THE TAPE'S LANE, AT EVERY SCROLL OFFSET AND ON BOTH REGIMES
//
// PROPOSED DIFF (T9-W7 §10 pass 2, CTRL-TAPE §1.1). §2.5 above reads the card at ONE scroll
// offset — the pose the page happens to boot in — and hovers. That is half a law: a PINNED tape
// is a tape whose position is a function of `scrollTop`, and the census never moves the scroll.
// Measured at HEAD with the sweep below, the same card that greens §2.5 reads
//   · 1440×900 rail, frac 0.25 and 0.50: `new game` over `9×9` / `Easy` — 358.6px², BELOW the
//     exempt band, `elementFromPoint` returning `.washi-tag` and not the chip;
//   · 390×844 dock, frac 0.25: `new game` over `size` — 0.782px², the same class one regime over.
// Three things this row adds and §2.5 does not have:
//   1. THE SWEEP. Five offsets, 0 / .25 / .5 / .75 / 1, so a pinned tape is read where it pins.
//   2. THE DOCK ARM. §2.5 is 1440×900 only; the pin line is `0.6rem − --card-pad-t` and the dock
//      publishes a different `--card-pad-t`, so the arithmetic differs by regime.
//   3. THE SIGN BIT. `elementFromPoint` at the overlap's centre says whether the covered pixel
//      still belongs to the control. A tape that covers geometry it also lets you press is a
//      different defect from one that eats the press, and the row prints which it saw.
// `belowExemptBand` is the number the design turns on: a pinned tape's bottom against
// `card.top + padding-top`. ≤ 0 means the tape is wholly inside the reserved band — the band no
// control may enter — and the coverage is 0 by arithmetic rather than by census luck.
// ─────────────────────────────────────────────────────────────────────────────

const PIN_CENSUS = (sel: string) => {
  const card = document.querySelector('.controls-card');
  if (!card) return { error: 'no card' } as const;
  const cb = card.getBoundingClientRect();
  const padTop = parseFloat(getComputedStyle(card).paddingTop) || 0;
  const liveTop = cb.top + card.clientTop + padTop;
  const inter = [...card.querySelectorAll(sel)].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  const overlaps: {
    tape: string;
    target: string;
    px: number;
    below: number;
    hitIsTarget: boolean;
  }[] = [];
  let worstBelow = -Infinity;
  for (const tape of card.querySelectorAll('.washi-tag')) {
    const cs = getComputedStyle(tape);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
    const t = tape.getBoundingClientRect();
    if (t.width === 0 || t.height === 0) continue;
    const pinned = cs.position === 'sticky' && !tape.hasAttribute('data-released');
    const below = +(t.bottom - liveTop).toFixed(2);
    // Only a tape that is actually PINNED is asked to stay inside the band; a tape riding its
    // own well is governed by the well's padding (§1.2) and by §2.5's own census above.
    if (pinned && t.top <= liveTop + 0.5 && below > worstBelow) worstBelow = below;
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      const h = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top, liveTop));
      if (w * h <= 0.5) continue;
      const px = (Math.max(b.left, t.left) + Math.min(b.right, t.right)) / 2;
      const py = (Math.max(b.top, t.top) + Math.min(b.bottom, t.bottom)) / 2;
      const hit = document.elementFromPoint(px, py);
      overlaps.push({
        tape: (tape.textContent || '').trim().slice(0, 24),
        target: el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 24),
        px: +(w * h).toFixed(1),
        below,
        hitIsTarget: hit === el || (hit ? el.contains(hit) : false),
      });
    }
  }
  return {
    overlaps,
    worstBelow: worstBelow === -Infinity ? null : worstBelow,
    padTop: +padTop.toFixed(2),
  };
};

for (const cell of [
  { name: 'rail 1440×900', w: 1440, h: 900, dock: false },
  { name: 'dock 390×844', w: 390, h: 844, dock: true },
]) {
  test.describe(`§2.5b the pinned tape stays in its band @ ${cell.name}`, () => {
    test.use({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.dock });

    test(`§2.5b no pinned tape leaves the pin band at any scroll offset @ ${cell.name}`, async ({
      page,
    }) => {
      test.slow();
      await boot(page);
      await loadBoard(page);
      if (cell.dock) {
        await page.locator('.drawer-tab').click();
        await page.waitForSelector('#controls-drawer .drawer-case', { state: 'visible' });
        await page.waitForTimeout(900); // the sheet SLIDES — settle before a box is read
      }
      await expect(page.locator('.controls-card .washi-tag')).toHaveCount(cell.dock ? 2 : 4);

      const range = await page.evaluate(() => {
        const c = document.querySelector('.controls-card');
        return c ? c.scrollHeight - c.clientHeight : 0;
      });
      expect(range, 'the card must actually scroll, or this row proves nothing').toBeGreaterThan(
        40,
      );

      const seen: Record<string, unknown>[] = [];
      for (const frac of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate((y) => {
          const c = document.querySelector('.controls-card');
          if (c) c.scrollTop = y;
        }, Math.round(range * frac));
        // the fold pass is rAF-coalesced and the tape carries a 150ms opacity window
        await page.waitForTimeout(280);
        const read = await page.evaluate(PIN_CENSUS, INTERACTIVE);
        seen.push({ frac, ...read });
      }
      console.log(`[W7-§2.5b] ${cell.name} ${JSON.stringify(seen)}`);

      for (const state of seen) {
        expect(
          state.overlaps,
          `at scrollTop frac ${state.frac} a pinned tape covers a control: ${JSON.stringify(state.overlaps)}`,
        ).toEqual([]);
        if (state.worstBelow !== null)
          expect(
            state.worstBelow as number,
            `at frac ${state.frac} the pinned tape hangs ${state.worstBelow}px below the exempt band`,
          ).toBeLessThanOrEqual(0);
      }
    });
  });
}
