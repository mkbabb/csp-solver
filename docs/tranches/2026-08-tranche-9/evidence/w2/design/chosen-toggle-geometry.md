# T9-W2 chosen design — toggle-geometry (§2.4) — the opus arm, adjudicated 2026-08-25

See adjudication.md for the ruling, grafts, and rejected arms.

## decision

THE CELESTIAL'S KEEP — the corner sun is split into two boxes that were always conflated: the ORNAMENT (`--toggle-size`, unchanged ink hung from the head rule, byte-identical at every rung) and the CONTROL (`--toggle-hit` = `max(--tap-floor, --toggle-size / 2)`), a disc concentric with the art that is the celestial's body and never its splash — while the fixed frame around it becomes paper (`pointer-events: none`), so the four dead lunes stop swallowing clicks and the 208px corner stops hit-testing at all.

## mechanism

THE MEASURED DEFECT IS BIGGER THAN THE CHARTER'S. `.corner-right` is a `display: flex` wrapper shrink-wrapped to a 208×208 `<button>` at `z-index: 60`. Border-radius clips hit-testing, so the box splits into two thieving surfaces: the inscribed r=104 circle (flips the theme) and the four corner lunes (`.corner-right` itself is the hit target — the click is swallowed outright, no flip, no control). Dense 2px census over the shared band at 1024×768, sudoku, both engines: the controls card's "4×4" button owns ZERO of its 395 shared points — 165 to the circle / 230 to the lunes (chromium), 170/225 (webkit). At 1280×800 the circle is clear (the charter's reading holds) and the lunes still eat 156/156 — a swallow the charter had not named. Real clicks confirm both halves: (920,214) flips the theme and leaves 4×4 unpressed; (844,214) is eaten — `aria-pressed` stays "false" — in chromium and webkit alike.

THE CURE, three moves, none of which moves a pixel of ink.

(1) THE FRAME IS PAINT ORDER, NOT HIT ORDER. `.corner-right` takes `pointer-events: none` and is SIZED to the ornament (`inline-size/block-size: var(--toggle-size)`, `box-sizing: content-box` so the safe-area `padding-right` still ADDS as it did under flex) with `display: grid; place-items: center`. z-60 keeps painting the celestial over the card; it intercepts nothing. This is the estate's most-repeated idiom and its nearest instance is the OTHER head corner: AttributionCard's closed card is `pointer-events: none` "so it can never swallow an outside click"; MarginNote's strip, SolverErrorNote's ("the strip container passes events through; the card takes them back"), DifficultyTally's, the washi tape's — same stance, same words.

(2) THE CONTROL IS THE BODY. `.sun-moon-toggle`'s box becomes `--toggle-hit` and its `border-radius: 50%` becomes load-bearing: the hit surface is a true disc. `--toggle-hit: max(var(--tap-floor), var(--toggle-size) / 2)` is derived, not tuned — at 13rem it is 104px, and 104 of a 208 box is r=50 in the icons' own 200 viewBox, ONE UNIT inside the sun disc's painted outline (circle r=48, stroke-width 6 → outer edge 51). The hit surface literally is the sun's drawn disc. The rays (outerR 75–100), the three sparkle diamonds and the dot stars are ink and take no hits. The floor outranks the half and says so in one clause: the half is 40 at 5rem and 32 at 4rem, so the phone's disc is 44 — r=55 and r=68.75 viewBox units, still inside the SHORTEST possible ray tip (75). Every rung is integral — (208−104)/2 = 52, (80−44)/2 = 18, (64−44)/2 = 10 — which is why the ink lands on the same sub-pixel.

(3) THE INK BLEEDS OUT OF THE KEEP. `.toggle-icon` and `.toggle-rest` swap `inset: 0; width/height: 100%` for `inset: var(--toggle-bleed)` where `--toggle-bleed: calc((var(--toggle-hit) - var(--toggle-size)) / 2)` — −52 / −18 / −10px. Four-sided inset fully determines the box, so the `width/height: 100%` must GO (it would over-constrain the box back down to the keep). `.rest-pose` is untouched: `inset: 0; 100%` of a parent that is 208 again. Because the keep is centred in the frame and the ink is centred on the keep, the ornament's rect is unchanged: measured HEAD == CURED to three decimals at every rung in BOTH engines — [816,12,208,208] at 1024×768, [1072,12,208,208] at 1280×800, [1232,12,208,208] at 1440×900, [688,12,80,80], [764,12,80,80], [326,0,64,64], [311,0,64,64] — for `.toggle-rest.rest-sun`, `.toggle-rest.rest-moon` and the live `svg.toggle-sun` alike.

WHY THE GOLDEN DOES NOT MOVE. `visual-golden.spec.ts:361` crops `center(page.locator("button.sun-moon-toggle"), 72, 72)` — a fixed box computed from the BUTTON'S CENTRE alone. The keep is concentric with the ornament, so that centre is unchanged: [1176,116] at the golden's 1280×800 cell, HEAD and CURED, both engines. `toggle-crest-dark.png` is byte-identical, not re-minted; the other three goldens never see this element. `DELTA_ANCHORS`' 64px inflation still covers the crop over a 104px button.

WHY THE BAKE MUST MOVE WITH IT — the one non-obvious requirement, measured. `useElementSize(toggleRef)` drives `captureSize` for `useRasterStack`. With the button at 104 and the ink at 208 the four sun poses bake at 208 natural and paint into a 208 CSS box at DPR2 — a 2× upscale (HEAD reads 416 natural; the injected cure reads 208). That is a soft celestial and a red crest golden. The ref moves off the control and onto the ornament: `ref="celestialRef"` on `.toggle-rest.rest-sun`, whose box IS the pose bitmaps' box — a strictly more correct measurement target than the button ever was.

WHY THIS IS A LAW AND NOT A COINCIDENCE OF SIZES. The keep's bottom is `--head-rule + (--toggle-size + --toggle-hit)/2` = 168px on every desk rung, invariant in both width and height because both terms are pinned to the head rule; the row's topmost interactive control measured 210.36 at the worst cell (1024×768, four of five games) and 209.91 at 1280×800. But the enforcement is not the margin — it is a census probe that reads the geometry rather than a cell: every interactive element whose box intersects the FRAME is scanned at 2px and must own every point of the intersection. `flip === 0 && lune === 0 && own === samples` is a statement about the law, and it reds the instant any future control, at any width, enters the corner.

## sketch

═══ 1 · App.vue — the page root, beside `--toggle-size` (the file's own "one metric" precedent) ═══

```css
.page-root {
  --toggle-size: 5rem;
  --head-rule: calc(0.75rem + env(safe-area-inset-top, 0px));

  /* ── THE CELESTIAL'S KEEP (T9-W2 §2.4) ────────────────────────────────────────────────
     The ornament and the control are TWO boxes and were one. `--toggle-size` is the
     ORNAMENT — the ink hung from the head rule, and it does not move at any rung.
     `--toggle-hit` is the CONTROL: the celestial's body, half the ornament, floored at the
     tap minimum. At 13rem that is 104px, and 104 of a 208 box is r=50 in the icons' own 200
     viewBox — ONE UNIT inside the sun disc's painted outline (r=48, stroke-width 6). The
     hit surface is the sun's disc. The rays (75–100 units), the three sparkles and the dot
     stars are ink and take no hits; the moon's crescent covers the same disc.
     THE FLOOR OUTRANKS THE HALF, in one clause: the half is 40 at 5rem and 32 at 4rem, both
     under the floor, so a phone's disc is 44 — r=55 and r=68.75 units, still inside the
     SHORTEST ray tip (75). `--tap-floor` is the token W7's mobile scale owns (M01): raise it
     there and the toggle grows with the toolbar instead of being the toolbar's exception.
     BOTH ARE INTEGRAL AT EVERY RUNG, which is why the ink does not move a sub-pixel:
     (208−104)/2 = 52, (80−44)/2 = 18, (64−44)/2 = 10. Declared here and nowhere else —
     the media arms below redeclare `--toggle-size` on THIS element, so the max() re-resolves
     at all three rungs from one declaration. */
  --tap-floor: 2.75rem;
  --toggle-hit: max(var(--tap-floor), var(--toggle-size) / 2);
  --toggle-bleed: calc((var(--toggle-hit) - var(--toggle-size)) / 2);
}
```
(The two `@media` arms at `:905` and `:927` are UNTOUCHED — they set `--toggle-size` only.)

═══ 2 · App.vue `.corner-right` (:938) — the frame becomes paper ═══

```css
.corner-right {
  position: fixed;
  /* THE MASTHEAD LINE (M17) — unchanged: the ornament's box hangs from the head rule. */
  top: var(--head-rule, 0.75rem);
  right: 0;
  /* ── THE FRAME IS PAINT ORDER, NOT HIT ORDER (T9-W2 §2.4) ───────────────────────────
     The 60 was both, and that is the theft. Shrink-wrapped to a 208px button, this corner
     hit-tested whole: the inscribed r=104 circle flipped the theme and the four LUNES —
     this div itself — swallowed the click outright, no flip and no control. Measured at
     1024×768 over the band it shares with the controls card's "4×4": that button owned
     ZERO of 395 points, 165 circle / 230 lune in chromium, 170 / 225 in webkit. At 1280×800
     the circle is clear and the lunes still ate 156 — the swallow the audit had not named.
     `pointer-events: none` is this estate's stance for a wrapper that exists to place ink,
     and the nearest instance is the OTHER head corner: AttributionCard's closed card carries
     it "so it can never swallow an outside click" (MarginNote's strip, SolverErrorNote's,
     DifficultyTally's, the washi tape's — the container passes events through, the control
     takes them back, and `.sun-moon-toggle` takes them back in its own file). The celestial
     still paints over the card. It intercepts nothing.
     SIZED TO THE ORNAMENT, not shrink-wrapped to the button, because the button is no longer
     the ornament; `place-items: center` hangs the keep on the ink's own centre, which is what
     keeps the art's rect byte-identical at every rung in both engines and leaves the crest
     golden's centred 72×72 crop exactly where it was. This also does what `display: flex`
     was here to do — the T6.2 line box and its 7px of descender leading are still gone.
     `content-box` because the preflight is border-box and the safe-area inset must ADD to
     the ornament, exactly as it did under flex. */
  z-index: 60;
  display: grid;
  place-items: center;
  box-sizing: content-box;
  inline-size: var(--toggle-size);
  block-size: var(--toggle-size);
  pointer-events: none;
  /* P2 (T3-W12 §2) — …promotion comment kept verbatim… */
  will-change: transform;
  /* Safe-area inset (T4-WM lane C) — …comment kept verbatim… */
  padding-right: env(safe-area-inset-right, 0px);
}
```

═══ 3 · DarkModeToggle.vue — the control's box (`<style scoped>`, :692) ═══

```css
.sun-moon-toggle {
  position: relative;
  /* ── THE KEEP (T9-W2 §2.4) — the control is the celestial's body, never its splash.
     `border-radius: 50%` is load-bearing now: it is what makes this a DISC and not a square,
     and the hit test honours it. The fallback is the tap floor, so the component is still
     whole mounted anywhere — the same property the `5rem` fallback used to carry. */
  inline-size: var(--toggle-hit, 2.75rem);
  block-size: var(--toggle-hit, 2.75rem);
  /* `.corner-right` passes events through (App.vue); the control takes them back. */
  pointer-events: auto;
  cursor: pointer;
  border: 0;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  transition: transform 200ms ease;
  /* `flex-shrink: 0` DELETED — the frame is a grid, and dead CSS is dead. */
}
```

```css
.toggle-icon {
  position: absolute;
  /* ── THE INK BLEEDS OUT OF THE KEEP (T9-W2 §2.4). Half the difference on all four sides,
     so the painted box is `--toggle-size` and stays centred on the control. The four-sided
     inset FULLY determines the box: the `width/height: 100%` that used to size it is deleted
     rather than kept, because left+width wins over right and would pull the ink back down to
     the keep. `overflow: visible` still gives the ~1.09 crest its headroom. */
  inset: var(--toggle-bleed, 0px);
  display: block;
  pointer-events: none;
  overflow: visible;
  opacity: 0;
  visibility: hidden;
  transition: opacity 100ms var(--ease-standard) 240ms !important;
}

.toggle-rest {
  position: absolute;
  inset: var(--toggle-bleed, 0px);   /* the twin of the icons' bleed */
  pointer-events: none;
  visibility: hidden;
}
```
`.rest-pose` is UNTOUCHED (`inset: 0; width/height: 100%` of a parent that is `--toggle-size`
again). Hover/squash/plush-land are untouched and read identically: every one rides `scale`
about a box centre that is still the ink's centre.

═══ 4 · DarkModeToggle.vue — the bake measures the ornament (script, :490) ═══

```ts
// ── THE BAKE MEASURES THE ORNAMENT, NOT THE CONTROL (T9-W2 §2.4) ──
// The button's box is the KEEP now — half the celestial — and `useRasterStack` captures at
// the CSS size it is handed. Left on the button it captures 104 and the <img> paints 208:
// a 2× upscale, MEASURED (HEAD bakes 4 poses at 416px natural under DPR2; the shrunken
// button bakes 208). A soft celestial and a red crest golden. `.toggle-rest`'s box IS the
// pose bitmaps' box — the more correct target than the button ever was.
const celestialRef = ref<HTMLElement | null>(null);
const { width: celestialW } = useElementSize(celestialRef);
const captureSize = computed(() => Math.round(celestialW.value));
```
Template: drop `ref="toggleRef"` from the `<button>` (nothing else read it, and `toggleRef`
goes with it); add `ref="celestialRef"` to `<div class="toggle-rest rest-sun" …>`.

═══ 5 · e2e/toggle-keep.spec.ts — NEW (single quotes; e2e is .prettierignore'd) ═══

```ts
import { test, expect, type Page } from '@playwright/test';

/**
 * T9-W2 §2.4 — THE CELESTIAL'S KEEP. The toggle's hit surface is the celestial's body and
 * never overlaps an interactive sibling. Every row carries its control INSIDE the run
 * (the estate's GATE-1 discipline, `masthead-alignment.spec.ts`'s shape).
 */

/** The superseded pose, re-injected verbatim — the negative control for every row. */
const SUPERSEDED_KEEP = `
  .corner-right { pointer-events: auto !important; }
  .sun-moon-toggle {
    inline-size: var(--toggle-size) !important;
    block-size: var(--toggle-size) !important;
  }
  .toggle-icon, .toggle-rest { inset: 0 !important; }
`;

/** THE CENSUS. Every interactive element that shares the celestial's FRAME must own every
 *  point of what it shares — no flip (the circle), no lune (the frame), at 2 CSS px. */
const CENSUS = () => {
  const tog = document.querySelector('.sun-moon-toggle')!;
  const frame = document.querySelector('.corner-right')!;
  const f = frame.getBoundingClientRect();
  const sel =
    'button, [role="button"], a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const rows: { name: string; flip: number; lune: number; own: number; n: number }[] = [];
  for (const el of document.querySelectorAll(sel)) {
    if (el === tog || tog.contains(el)) continue;
    const b = el.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.pointerEvents === 'none')
      continue;
    const x0 = Math.max(b.left, f.left, 0);
    const x1 = Math.min(b.right, f.right, innerWidth - 1);
    const y0 = Math.max(b.top, f.top, 0);
    const y1 = Math.min(b.bottom, f.bottom, innerHeight - 1);
    if (x1 <= x0 || y1 <= y0) continue;
    let flip = 0, lune = 0, own = 0, n = 0;
    for (let x = x0; x <= x1; x += 2)
      for (let y = y0; y <= y1; y += 2) {
        const hit = document.elementFromPoint(x, y);
        if (!hit) continue;
        n++;
        if (hit === tog || tog.contains(hit)) flip++;
        else if (hit === frame) lune++;
        else if (hit === el || el.contains(hit)) own++;
      }
    rows.push({
      name: (el.getAttribute('aria-label') || el.textContent || el.tagName)
        .trim().replace(/\s+/g, ' ').slice(0, 32),
      flip, lune, own, n,
    });
  }
  return rows;
};

/** THE KEEP'S OWN GEOMETRY — a disc, concentric with the ink, inside it, over the floor. */
const KEEP = () => {
  const r = (el: Element | null) => {
    const b = el!.getBoundingClientRect();
    return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2),
             cx: +(b.x + b.width / 2).toFixed(2), cy: +(b.y + b.height / 2).toFixed(2) };
  };
  return {
    btn: r(document.querySelector('.sun-moon-toggle')),
    frame: r(document.querySelector('.corner-right')),
    sun: r(document.querySelector('.toggle-rest.rest-sun')),
    moon: r(document.querySelector('.toggle-rest.rest-moon')),
    live: r(document.querySelector('svg.toggle-sun')),
    radius: getComputedStyle(document.querySelector('.sun-moon-toggle')!).borderTopLeftRadius,
  };
};

/** π — the ornament's rect, banked from HEAD, both engines, three decimals. The row that
 *  proves the cure moves no ink: `evidence/w2/design/toggle-keep.md`. */
const ART: Record<string, [number, number, number, number]> = {
  '1024x768': [816, 12, 208, 208],
  '1280x800': [1072, 12, 208, 208],
  '1440x900': [1232, 12, 208, 208],
  '768x1024': [688, 12, 80, 80],
  '844x390':  [764, 12, 80, 80],
  '390x844':  [326, 0, 64, 64],
  '375x667':  [311, 0, 64, 64],
};

const LADDER = [
  { w: 1024, h: 768, games: 5 }, { w: 1024, h: 900 }, { w: 1023, h: 768 },
  { w: 1100, h: 800 }, { w: 1152, h: 864 }, { w: 1280, h: 720 },
  { w: 1280, h: 800, games: 5 }, { w: 1366, h: 768 }, { w: 1440, h: 900 },
  { w: 1920, h: 1080 }, { w: 768, h: 1024 }, { w: 820, h: 1180 },
  { w: 900, h: 676 }, { w: 844, h: 390 }, { w: 812, h: 375 },
  { w: 481, h: 800 }, { w: 480, h: 800 }, { w: 428, h: 926 },
  { w: 390, h: 844 }, { w: 375, h: 667 },
];
const GAMES = ['sudoku', 'futoshiki', 'thermo', 'killer', 'kenken'];

async function settle(page: Page, game: string) { /* `masthead-alignment.spec.ts`'s `load` */ }

test('the keep owns no sibling — census over the whole ladder', async ({ page }) => {
  for (const cell of LADDER) {
    await page.setViewportSize({ width: cell.w, height: cell.h });
    for (const game of cell.games ? GAMES : ['sudoku']) {
      await settle(page, game);
      const key = `${cell.w}x${cell.h}`;
      for (const row of await page.evaluate(CENSUS)) {
        expect(row.flip, `${key} ${game}: "${row.name}" loses points to the toggle`).toBe(0);
        expect(row.lune, `${key} ${game}: "${row.name}" loses points to the frame`).toBe(0);
        expect(row.own, `${key} ${game}: "${row.name}" owns its own band`).toBe(row.n);
      }
      const k = await page.evaluate(KEEP);
      expect(k.radius).toBe('50%');                              // a disc, not a square
      expect(Math.min(k.btn.w, k.btn.h)).toBeGreaterThanOrEqual(44);   // A3
      expect(k.btn.w).toBeLessThanOrEqual(k.sun.w);              // inside the art
      expect(Math.abs(k.btn.cx - k.sun.cx)).toBeLessThan(0.01);  // concentric with it
      expect(Math.abs(k.btn.cy - k.sun.cy)).toBeLessThan(0.01);
      if (ART[key])                                              // π on the ink
        for (const [i, v] of ART[key].entries())
          for (const box of [k.sun, k.moon, k.live, k.frame])
            expect(Math.abs([box.x, box.y, box.w, box.h][i] - v)).toBeLessThan(0.01);
    }
  }
});

test('the stolen points reach their own control (1024×768)', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await settle(page, 'sudoku');
  const four = page.locator('button', { hasText: /^4×4$/ });
  for (const [x, y, what] of [[920, 214, 'circle'], [844, 214, 'lune']] as const) {
    const before = await page.locator('html').evaluate((el) => el.className);
    await page.mouse.click(x, y);
    expect(await page.locator('html').evaluate((el) => el.className), `${what}: theme held`)
      .toBe(before);
    await expect(four, `${what}: the control was pressed`).toHaveAttribute('aria-pressed', 'true');
  }
  // AND THE KEEP ITSELF STILL FIRES — a cure that kills the control is not a cure.
  const dark = await page.locator('html').evaluate((el) => el.classList.contains('dark'));
  await page.locator('button.sun-moon-toggle').click();
  await expect(page.locator('html'))[dark ? 'not' : 'toHaveClass'] /* … */;

  // CONTROL — restore the superseded pose; both rows must fail.
  await page.addStyleTag({ content: SUPERSEDED_KEEP });
  const census = await page.evaluate(CENSUS);
  expect(census.some((r) => r.flip > 0 || r.lune > 0)).toBe(true);
});

test('the law is declared, not incidental', async ({ page }) => {
  await settle(page, 'sudoku');
  // The CSSOM walk is `mobile-platform.spec.ts`'s, verbatim.
  const found = await page.evaluate(() => { /* …visit(sheet.cssRules)… */
    return { frameIsPaper: false, controlTakesBack: false, hitIsFloored: false };
  });
  expect(found.frameIsPaper).toBe(true);      // `.corner-right { pointer-events: none }`
  expect(found.controlTakesBack).toBe(true);  // `.sun-moon-toggle { pointer-events: auto }`
  expect(found.hitIsFloored).toBe(true);      // `--toggle-hit: max(var(--tap-floor), …)`
});
```

═══ 6 · e2e/masthead-alignment.spec.ts — the ONE gate DELTA, same commit ═══

```ts
  /* T9-W2 §2.4 — THE INK BOX AND THE CONTROL BOX ARE NOW TWO ELEMENTS, and M17 is about the
     INK: `--head-rule` is where the celestial's PAINTED box begins. The keep is centred
     inside that box (104 of 208 on the desk, 44 of 64 on a phone), so `.corner-right button`
     now reads 64 / 10 and would red a line that has not moved. `.corner-right` IS the ink's
     box — its rect is byte-identical to the pre-keep button's at every rung, both engines
     (evidence/w2/design/toggle-keep.md), so every number below is unchanged: 12.00 desk,
     0.00 at 390. SUPERSEDED_HEAD's control still bites — it pins `.corner-right { top: 0 }`,
     which is this same element. */
  return { badge, toggle: box(document.querySelector('.corner-right')) };
```

═══ 7 · docs ═══
`gates.json` + `waves/T9-W2-viewport-law.md` §2.4's born-RED line take the new spec's row
count in the same commit (count pins move with the rows — the wave's own gate-spine rule).
`evidence/w2/design/toggle-keep.md` banks the DesignSync record §2.4 asks for: the HEAD census
table (both engines), the π table above, the 416→208 bake reading, and DELTA crops at 1024×768
before/after (≤150KB each) plus a π control crop of the celestial at 1280×800.

## probeImpact

THE THEFT PROBE (§2.4's born-RED row) — red at HEAD, green under the keep, MEASURED both engines against a runtime injection of the exact declarations above:

· 1024×768, sudoku · the "4×4" size button shares 395 sample points with the frame and owns NONE of them. chromium flip 165 / lune 230 / own 0 → flip 0 / lune 0 / own 394. webkit 170 / 225 / 0 → 0 / 0 / 394. The same reading holds for killer, thermo and futoshiki (kenken's card is wider, so it shares 4 lune points only — also 0 after).
· 1100×800 · chromium flip 158 / lune 187 / own 0 → 0 / 0 / 344.
· 1280×800 · the charter's "no theft" cell, and the swallow it had not named: flip 0 / lune 156 / own 0 → 0 / 0 / 152 (chromium), 156 → 153 (webkit).
· THE CLICK ROWS, the sharpest of the four. At HEAD, (920,214) — inside the r=104 circle, inside the 4×4 button — flips the theme and leaves `aria-pressed="false"`, both engines; (844,214) — a lune — is swallowed, no flip and `aria-pressed` still `"false"`. Under the keep BOTH points press the 4×4 button (`aria-pressed="true"`) and neither touches the theme, both engines. The disc's own centre still flips the theme, both engines.
· THE GATE-1 CONTROL bites: re-injecting `SUPERSEDED_KEEP` at 1024×768 restores flip>0 / lune>0 and the click rows fail again — the row is provably failable.

THE LADDER ROWS, green by construction: the keep is 104 / 44 / 44 at the three `--toggle-size` rungs, ≥44 everywhere (A3's floor unmoved), concentric with the ink to <0.01px, and never wider than it. The census carries the 1023/1024 and 480/481 rung SEAMS, which is what makes it a law rather than a table of ship cells.

π ON THE SURFACES THIS WAVE DOES NOT CLAIM — the row that lets the chair take this at zero visual cost. `.toggle-rest.rest-sun`, `.toggle-rest.rest-moon`, `svg.toggle-sun` and `.corner-right` all read HEAD == CURED to three decimals at every rung in chromium AND webkit: [816,12,208,208] · [1072,12,208,208] · [1232,12,208,208] · [688,12,80,80] · [764,12,80,80] · [326,0,64,64] · [311,0,64,64]. GOLDENS 4/4 UNMOVED, NO DELTA DECLARED: `toggle-crest-dark.png` crops 72×72 from the button's CENTRE, which is [1176,116] before and after at the golden config's own 1280×800/DPR2 cell; `logo-light`, `cell-light` and the grid corner never see this element.

THE FILTER CENSUS is unmoved at 9: `filterBudget.ts:150`'s `button.sun-moon-toggle svg.toggle-icon` still names the same two live icons, still inside the same button, and no filter, layer or promoted surface is added. No motion is added, so no PRM arm is owed. No product string is touched, so M16 is not engaged.

§2.4's law reads whole after this: the hit surface matches its art (it is the sun's disc, one viewBox unit inside its own outline) and never overlaps an interactive sibling (the census says so at every rung, and the frame around it cannot overlap anything because it takes no hits at all).

## risks

1 · THE BAKE — the one hazard that ships broken if missed, and it is MEASURED, not feared. Leaving `useElementSize` on the button captures the pose stack at 104 CSS px and paints it at 208: at DPR2 the four sun bitmaps read 208 natural against HEAD's 416 — half the device resolution, a soft celestial, and `toggle-crest-dark`'s 0.017 darwin soul floor gone. The ref MUST move to `.toggle-rest.rest-sun`. Verify with `test:golden` (crest), `theme-bake-freshness` and `wordmark-integrity` — all three assert over the baked bitmaps.

2 · `box-sizing` — the preflight is border-box, so `inline-size: var(--toggle-size)` without `content-box` would let the landscape-notch `padding-right` EAT the ornament instead of adding to it. `env()` is 0 in both engines, so no rig can catch this: it is an authored-declaration row (the CSSOM walk in §5's third test) plus the owner-device smoke, exactly as `mobile-platform.spec.ts` already handles the same inset.

3 · MOBILE TAP GOES 80/64 → 44, and that runs against the grain of M01 ("all buttons and text for controls need to be larger on mobile"). It is the only number the law allows — the celestial's body is 40 and 32 at those rungs, both under the floor. Named rather than hidden, and turned into a hook: `--tap-floor` is a token, so W7's mobile scale raises it once and the toggle grows with the toolbar instead of being its exception. Measured today there is no mobile theft to cure (dense census at 390×844, 375×667, 428×926, 844×390, 812×375, 768×1024, 820×1180 finds no interactive element intersecting the frame at all) — the mobile arm buys prevention, not a live defect, and the chair may reasonably want it anyway now that M10's board-edge tab and M14's player icon are about to make the head band busier.

4 · THE FOCUS RING SHRINKS from a 208px circle to 104/44 — visible on keyboard focus, and better a11y (the ring traces the real target instead of 208px of empty paper), but it IS a change. No golden covers it; declare it in the DesignSync record so the owner sees it at the re-look rather than finding it.

5 · THE LUNES NOW FALL THROUGH to `closeAll` instead of being swallowed by `@click.stop`. That is the correct behaviour and the estate says so in AttributionCard's own words, but it is a behaviour change; grep found no spec asserting the swallow.

6 · SCOPED CSS — if the implementer prefers the one-file form (`.corner-right > * { pointer-events: auto }` in App.vue) instead of putting `pointer-events: auto` on `.sun-moon-toggle` in its own file, it works (the child component's root carries the parent's scope id) but it is the weaker cut: the control's stance belongs beside its own box, and it keeps the toggle whole wherever it is mounted. Take the two-file form.

7 · At the ≤480 rung the 44px floor puts the disc at r=68.75 viewBox units — past the sun disc's outline (51) and into the ray band, though still inside the shortest possible ray tip (75). "Matches its art" holds as "never beyond the art's outer envelope" there rather than "is the disc". Stated plainly so the chair rules on it rather than discovering it.

8 · The census walks `elementFromPoint` at 2px over every intersection; at ~400 points per shared control per cell it is cheap, but the LADDER is 20 cells with five games at two of them. Budget it as one spec file in the default (dev-server) suite, both engines — the suite's own precedent is 115 tests in ~35s webkit.

## rejected

CLIP-PATH ON THE BUTTON — the obvious one-liner, and it is dead on measurement: `clip-path` clips ink as well as hits. A `circle(104px)` clip cuts the dot star at (185,35) — radius 107 units — off the moon outright, and it crops the Bloom's ~1.09 crest that `overflow: visible` exists to give headroom. It buys the shrink by breaking the art, which is the opposite of the law.

`pointer-events: none` ON THE BUTTON WITH A HIT CHILD — works (the event targets the child and still bubbles through the button's listener) but it costs `:hover`, `:active` and the native focus walk, so the hover scale needs `:has(.toggle-hit:hover)` and the focus behaviour becomes a thing to reason about. Sizing the button IS the hit surface: no proxy, no `:has()`, every pseudo-class native.

PER-WIDTH-BAND SIZE OR POSITION — the charter offers it and it is the coincidence it warns about. Dropping the desk celestial a rung at 1024–1279 cures the two cells V7 measured and leaves the LUNES eating clicks at 1280×800, where the measurement says 156 points already go missing. A band is tuned to today's card; the keep is derived from the art.

A RESERVED CORNER IN THE LAYOUT — `padding-right` on `main` so the row cannot enter the corner. It is the only mechanism that is structurally absolute, and it costs 158px of pushed content at 1024 to dodge an ornament that overlaps nothing at 1440+. It also inverts the corner celestial's whole premise: it lives in dead space. Rejected as a cure that is larger than its disease.

SHRINKING THE ORNAMENT ITSELF — the simplest reading of "matches its art", and it re-mints `toggle-crest-dark`, re-prices the M17 head-line tables, and re-opens R3's 375/390 arithmetic. The house law is that goldens are never re-baselined, and the art is not what is wrong: the art at 208px is the product's signature. Splitting the ornament from the control is what lets the ink stay byte-for-byte where the owner has already ratified it.

A STAR-SHAPED HIT PATH following the ray polygon — a literal reading of "matches its art". It is ragged, it changes with the boil pose (four of them), it strands the valleys between rays, and it is a hostile target. The art's HEART is stable across both poses and both themes; the disc is what a control wants and what the ink already draws.

THE HIT DISC PULLED CORNER-WARD (up and right, for the aim-at-the-corner reflex) — it takes the target away from the ink's heart, breaks the concentricity that keeps the crest golden's centred crop still, and makes every rung's offset fractional. Centred is what the geometry and the art both ask for.

## files (as proposed)

- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/App.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/celestial/DarkModeToggle.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/toggle-keep.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/masthead-alignment.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/gates.json
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/waves/T9-W2-viewport-law.md
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w2/design/toggle-keep.md
