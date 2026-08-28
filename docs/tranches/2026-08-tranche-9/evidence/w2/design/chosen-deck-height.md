# T9-W2 chosen design — deck-height (§2.1) — the opus arm, adjudicated 2026-08-25

See adjudication.md for the ruling, grafts, and rejected arms.

## decision

THE CASE SIZES THE CARD — the scrollport gets a derived floor and a derived ceiling, the card's square face becomes the part that pays for a short case (`100cqh` read off the slot as a size container), and the caption moves to the top of the paper as the card's letterhead, so anything a viewport still cannot pay for is taken from the picture and never from a name.

## mechanism

FOUR CLAUSES, ONE MECHANISM. Every number below is MEASURED on the live tree (vite 127.0.0.1:4251, chromium + webkit, 13 cells), not inferred.

§A THE CASE IS MEASURED (GameGallery.vue). The root defect is that `.gallery-viewport` is a scroll container in BOTH axes (`overflow-x:auto` + `overflow-y:visible` resolves to `auto`), so its automatic minimum size is 0 and as a flex item under `flex:1;min-height:0` it collapses to whatever is left — 145.58px at 844x390 against a 406.69px card, hiding 309px behind `scrollbar-width:none`. The scrollport becomes `flex: 1 1 0` with a real floor and a real ceiling, both derived from the card's own declared constants:
  · floor `min-block-size: calc(var(--card-chrome) + 2 * var(--deck-air))` — the case is never shorter than the card's WORDS plus its air. That is the invariant, stated as a length.
  · ceiling `max-block-size: calc(var(--card-face-w) + var(--card-chrome) + 2 * var(--deck-air))` — the case never grows past the card's own natural height, so at every viewport that already fits, the composition is byte-identical (measured: pips/band tops unmoved to 0.00px at 1920x1080, 1440x900, 1280x800, 1024x768, 390x844, both engines).
`--card-face-w: calc(var(--card-w) - 3rem)` is the width term exactly (slot padding-inline 0.6rem x2 + paper padding 0.9rem x2): 352 - 48 = 304.03 against a measured 304.03. `--card-chrome` is the sum of the card's own vertical furniture: 104.47px declared against 104.44px measured.

§B THE FACE PAYS FOR THE CASE (GameGallery.vue + GameCard.vue). `.gallery-track` goes `align-items: stretch; block-size: 100%` so every slot is exactly the case's height; `.gallery-card-slot` becomes `container-type: size` (definite in both axes: `flex: 0 0 var(--card-w)` across, the stretched case down). The face then reads the case directly: `inline-size: min(100%, calc(100cqh - var(--card-chrome)))`, `aspect-ratio: 1/1` unchanged. The square is the smaller of what the width gives and what the case leaves — the board's own `min(42rem, 85vw, 100dvh - 10rem)` grammar, but with the height term MEASURED instead of guessed. Result: interior vertical scroll is 0 at every cell in both engines, so `scrollbar-width:none` stops hiding anything. Face at 1440x640: 304.03 -> 211.13. At 844x390 (landscape arm): 304.03 -> 138.88.

§C THE NAME IS THE LETTERHEAD (GameCard.vue template). The caption block renders ABOVE the face. A clip always comes off the bottom of a scrollport, so with the name first the invariant holds structurally rather than arithmetically — at viewports nobody enumerated, at a range line that wraps, at a future chrome change that makes `--card-chrome` under-count. It is also the estate's own labelling grammar: `SheetWashiLabel anchor="tag"` puts every zone's tag ABOVE its well; the deck's card was the one object in the estate labelled underneath.

§D THE DECK LIES DOWN IN SHORT LANDSCAPE (GameGallery.vue + one condition in StagingBand.vue). At 844x390 the column has 318.37px for a deck, a pip row and a 112px order slip — §A/§B alone would leave a 7px poster. Width is what a landscape phone has, so one media arm — `(orientation: landscape) and (max-height: 30rem)` — turns the gallery column into a 2x2 grid: deck top-left, pips under it, slip spanning the right column at `clamp(18rem, 45%, 26rem)`, and `--card-w` steps to `min(66vw, 18rem)` so the neighbour peek survives (`--edge` 69.5px at 844). StagingBand's row regime is re-keyed `@media (min-width: 42rem) and (min-height: 30rem)` — one condition, no duplicated declarations — so the slip falls back to its own column regime at the narrower width and its T8-W1 M8 chip reserve is not violated (measured `options-row` overflow 0/0 at 844x390, 812x375, 667x375).

§E THE ROSTER ECHO COSTS NO HEIGHT (GameCard.vue). `.game-card-swatches` folds into the sub-line row beside `.game-card-range` instead of standing as its own 10.4px band, so a session's card and a solo card have the same chrome and `--card-chrome` stays one number.

§F THE FIT FOLLOWS THE FACE (App.vue) — NOT OPTIONAL. `--live-fit` is computed once in `onLiveFace`; the face can now change size after that, and a stale fit clips the projected board inside `.live-face-slot`'s `overflow:hidden` (demonstrated, screenshot banked). A ResizeObserver on `.live-face-slot` recomputes it. This is a pre-existing class — a width resize already staled it — that this law widens to the height axis, so it is cured here.

## sketch

GameGallery.vue — `<style scoped>`

```css
.game-gallery {
  /* …unchanged: position/display/gap/width/flex/min-height/--card-w/--deck-slots… */

  /* ── THE CASE'S THREE NUMBERS (T9-W2 §2.1) ────────────────────────────────
     The scrollport declared no height and no floor, so `min-height:auto` resolved
     to 0 on a two-axis scroll container and the case took whatever the column left:
     145.58px at 844×390 against a 406.69px card, with 309px of interior scroll
     behind `scrollbar-width:none`. The cure is not a magic height — it is the two
     lengths the card is ALREADY made of, named here so the case can spend them.

     --card-face-w  the face's side when WIDTH binds. Exactly the slot's own
                    padding-inline (0.6rem ×2) plus the paper's (0.9rem ×2) taken
                    off the slot: 352 − 48 = 304.03 at 1440, measured 304.03.
     --card-chrome  every vertical constant the card declares that is NOT the face,
                    summed from the card's own values so it cannot drift from them:
                    104.47px at 1440 against a measured 104.44. It is an over-count
                    by construction, which is the safe direction — the face can only
                    ever be smaller than what fits.
     --deck-air     the frame + shadow allowance the viewport already spent as
                    `padding-block: 1.5rem`, named so the floor and cap can add it. */
  --deck-air: 1.5rem;
  --card-face-w: calc(var(--card-w) - 3rem);
  --card-chrome: calc(
    0.9rem + 0.75rem + 1.05rem              /* paper: pad-top · row gap · pad-bottom */
    + 1.9rem                                /* .game-card-name */
    + 0.1rem - 0.05rem + 8px + 0.1rem       /* gap · underline lift · underline · gap */
    + var(--type-body) * 1.1                /* .game-card-range's own line box */
  );
}

.gallery-viewport {
  /* …unchanged: width/overflow/scroll-snap-type/scroll-behavior/scrollbar-width… */
  padding-block: var(--deck-air);

  /* ── THE CASE HAS A FLOOR AND A CEILING (T9-W2 §2.1) ──────────────────────
     `flex: 1 1 0` makes the case's height a fact about the LINE rather than about
     the track, which is what lets §B read it back. The two bounds are the law:

       floor   the case is never shorter than the card's WORDS plus its air. That
               is the invariant — "the five names are legible" — written as a length.
       ceiling the case never grows past the card's own natural height, so every
               viewport that already fits is byte-unchanged. Measured: the pips and
               the band do not move at 1920×1080 / 1440×900 / 1280×800 / 1024×768 /
               390×844, chromium and webkit. --card-chrome appears on both sides of
               §B's `min()` at the ceiling, so it cancels: the width term wins there
               whatever the chrome estimate is. */
  flex: 1 1 0;
  min-block-size: calc(var(--card-chrome) + 2 * var(--deck-air));
  max-block-size: calc(var(--card-face-w) + var(--card-chrome) + 2 * var(--deck-air));
}

.gallery-track {
  display: flex;
  /* `stretch`, not `center` (T9-W2 §2.1): the slot has to BE the case for §B to read
     it. The spacers' `align-self: stretch` — the T4-P1 KENKEN-REACHABILITY cure — is
     unaffected and, if anything, further from WebKit's zero-area hazard. */
  align-items: stretch;
  block-size: 100%;
  min-width: max-content;
  will-change: transform;
}

.gallery-card-slot {
  flex: 0 0 var(--card-w);
  scroll-snap-align: center;
  display: flex;
  /* flex-start, not stretch: the card keeps its intrinsic height and rests at the top
     of the case, so if --card-chrome ever under-counts, the overflow is at the FOOT
     of the card — which §C has made the picture, never a name. */
  align-items: flex-start;
  justify-content: center;
  padding-inline: 0.6rem;
  /* THE SLOT IS THE CARD'S CONTAINER. Definite in both axes (a definite flex-basis
     across, the stretched case down), so `100cqh` in GameCard is the case's real
     height. Size containment does not clip — the drawn frame's outset ink and the
     cartoon shadow still paint outside the slot. */
  container-type: size;
}
```

GameGallery.vue — the landscape arm, placed after the `113rem` block

```css
/* ── THE DECK LIES DOWN (T9-W2 §2.1, the short-landscape half) ──────────────
   At 844×390 the column has 318.37px to hold a deck, a pip row and a 112px order
   slip; §A/§B alone would leave a 7px poster, which is a stub and not a card. What
   a landscape phone HAS is width, so the column becomes a grid and the slip moves
   beside the deck. Measured after: case 289.58, card 241.53, face 138.88, interior
   scroll 0, every name whole. The 30rem key is the same one StagingBand's regime now
   reads, so the deck and the slip can never disagree about which pose they are in. */
@media (orientation: landscape) and (max-height: 30rem) {
  .game-gallery {
    display: grid;
    grid-template-columns: minmax(0, 1fr) clamp(18rem, 45%, 26rem);
    grid-template-rows: minmax(0, 1fr) auto;
    grid-template-areas:
      "deck slip"
      "pips slip";
    column-gap: 1.25rem;
    row-gap: 0.5rem;
    /* One rung down, so the peek survives the narrower column: `--edge` lands at
       69.5px at 844 and 27px at 667 (`useCarouselGlide.recomputeEdges`). */
    --card-w: min(66vw, 18rem);
  }

  .gallery-viewport { grid-area: deck; }
  .gallery-pips { grid-area: pips; justify-self: center; }
  .staging-band { grid-area: slip; align-self: center; }

  /* The ribbon takes the same anchor the ≤40rem arm gives it: the deck row is short
     here too, and a note hung off the deck's middle would stand over the pips. */
  .gallery-guard { top: auto; bottom: 0.6rem; }
}
```

GameCard.vue — template (the caption block moves ABOVE `.game-card-face`, verbatim otherwise) and its two CSS rules

```html
<div class="game-card-paper cartoon-shadow-md edge-outlined bg-card">
  <!-- THE LETTERHEAD (T9-W2 §2.1). The caption leads the paper now. A scrollport
       clips from its FOOT, so a name that stands at the head of the card cannot be
       the thing a short viewport takes — and a worksheet carries its title at the
       top, which is where `SheetWashiLabel anchor="tag"` puts every other label in
       this estate. -->
  <div class="game-card-caption">
    <svg class="game-card-name" …>…</svg>
    <div v-if="isActive" class="game-card-underline" … />
    <!-- THE SUB-LINE ROW: the range line and the roster echo share one line, so a
         table costs the card no height and `--card-chrome` stays one number. -->
    <div class="game-card-subline">
      <span class="game-card-range">{{ rangeLine }}</span>
      <div v-if="swatches && swatches.length" class="game-card-swatches" aria-hidden="true">
        <span v-for="p in swatches" :key="p.id" class="game-card-swatch" :style="p.ink" />
      </div>
    </div>
  </div>

  <div class="game-card-face">…unchanged…</div>
</div>
```

```css
/* ── THE FACE PAYS FOR THE CASE (T9-W2 §2.1) ────────────────────────────────
   The square used to be a fact about the card's WIDTH alone (`width: 100%` +
   `aspect-ratio`), so the deck kept a 408px card inside a 145px case and clipped
   the difference. `100cqh` is the slot's real height (the slot is a size container
   — GameGallery), so the side is the smaller of the two things that bind it. This
   is `GameBoard`'s own `min(42rem, 85vw, 100dvh − 10rem)` grammar with the height
   term MEASURED rather than reserved: no per-rung constant to rot. cq units are
   inside the browserslist floor (chrome ≥111 · safari ≥16.4 · firefox ≥128) and
   measured identical in both engines. */
.game-card-face {
  position: relative;
  inline-size: min(100%, calc(100cqh - var(--card-chrome)));
  margin-inline: auto;
  aspect-ratio: 1 / 1;
}

.game-card-subline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.game-card-swatches { margin-top: 0; }   /* the row carries the alignment now */
```

StagingBand.vue — ONE condition

```css
/* …the row regime's existing derivation, unchanged, plus:
   AND A PAGE TALL ENOUGH TO SPEND 7rem ON A SLIP (T9-W2 §2.1). The 42rem key is a
   VIEWPORT width, and in short landscape the slip stands in a column narrower than
   the viewport — 365.4px at 844×390 — where the row regime's own arithmetic
   (544 − 32 − 20 − 200 = 292px of chip column against a 276px widest set) does not
   hold and the `nowrap` chip row would overflow. Below 30rem of height the band
   keeps its column pose, which is the pose that fits. Measured `options-row`
   overflow 0 on every card at 844×390, 812×375 and 667×375. */
@media (min-width: 42rem) and (min-height: 30rem) { … }
```

App.vue — §F, the refit

```ts
/** THE FIT FOLLOWS THE FACE (T9-W2 §2.1). `--live-fit` was computed once, on the
 *  face-mount, and the face's size was then a fact about the deck's WIDTH — so a
 *  resize already staled it and the height law widens the exposure to both axes.
 *  Demonstrated: at 1440×640 the projected board kept a 0.6334 scale into a 211px
 *  face and `.live-face-slot`'s `overflow: hidden` cut its top and bottom rows.
 *
 *  `offsetWidth/offsetHeight`, never the rect: the rect already carries the fit's
 *  own scale, so a re-fit computed from it would compound. The board's LAYOUT never
 *  changes (Wave C2's crit kill), so the offset box is the unscaled referent at
 *  every call. */
let liveFaceObs: ResizeObserver | null = null;

function fitLiveBoard(mount: HTMLElement) {
  const board = document.querySelector<HTMLElement>(".board-peek-host");
  const slot = mount.parentElement?.getBoundingClientRect();
  if (!board || !slot) return;
  const bw = board.offsetWidth;
  const bh = board.offsetHeight;
  if (slot.width > 0 && slot.height > 0 && bw > 0 && bh > 0)
    mount.style.setProperty("--live-fit", String(Math.min(slot.width / bw, slot.height / bh)));
}

// inside onLiveFace(el): the existing fit math is REPLACED by `fitLiveBoard(el)`, and
liveFaceObs?.disconnect();
liveFaceObs = null;
if (el && typeof ResizeObserver !== "undefined") {
  liveFaceObs = new ResizeObserver(() => fitLiveBoard(el));
  if (el.parentElement) liveFaceObs.observe(el.parentElement);   // .live-face-slot
}
```

e2e/viewport-law.spec.ts — §2.1's row is UNCHANGED and goes green; one row is ADDED beside it (single quotes by hand; prettier never runs on e2e/)

```ts
// §2.1b — THE CASE TELLS NO LIES. The P0's other half was 309px of interior scroll
// behind `scrollbar-width: none` and a suppressed webkit scrollbar: a hidden region
// with no affordance and no way to know it was there. Under the case's floor and
// ceiling there is nothing hidden to affordance, so the honest assertion is that the
// number is ZERO — and this row is what keeps a future chrome change from silently
// re-opening the same hole. RED at HEAD: 92 / 309 / 26 at the three cells below.
const CASE_CELLS = [
  { width: 1920, height: 1080 }, { width: 1440, height: 900 },
  { width: 1440, height: 640 },  { width: 1280, height: 800 },
  { width: 844, height: 390 },   { width: 390, height: 844 },
  { width: 375, height: 667 },
];
for (const cell of CASE_CELLS) {
  test.describe(`§2.1b the deck's case @ ${cell.width}×${cell.height}`, () => {
    test.use({ viewport: cell });
    test('§2.1b the deck hides no interior scroll', async ({ page }) => {
      await boot(page);
      await loadDeck(page);
      const hidden = await page
        .locator('.gallery-viewport')
        .evaluate((el) => el.scrollHeight - el.clientHeight);
      console.log(`[W2-§2.1b] ${cell.width}×${cell.height} hiddenY=${hidden}`);
      expect(hidden, 'the deck must not hide interior scroll behind a suppressed scrollbar')
        .toBe(0);
    });
  });
}
```

DELTA to bank under `evidence/w2/design/`: deck crops at 1440×640 and 844×390 (before/after), a π crop at 1440×900, and the two-engine table above. `gates.json` + the README count pins move in the same commit as the added row.

## probeImpact

MEASURED, not projected. The gate lane's own instrument was re-run verbatim — `viewport-law.spec.ts`'s `installVisFrac` clip-walk (every clipping ancestor, then the window), its `stepDeckTo` arrow-step through `aria-activedescendant`, its `LEGIBLE = 0.9` — against the live tree with the law injected as a stylesheet. Script banked at `scratchpad/gate.mjs`, the law at `scratchpad/law.css`.

§2.1 THE NAME-VISIBILITY PROBE (`viewport-law.spec.ts:136`, cells 1440×640 and 844×390):

  chromium 1440×640  before  RED    sudoku 0.3023 futoshiki 0.3023 thermo 0.3023 killer 0.3023 kenken 0.3023
  chromium 1440×640  after   GREEN  1 · 1 · 1 · 1 · 1
  chromium  844×390  before  RED    0 · 0 · 0 · 0 · 0
  chromium  844×390  after   GREEN  1 · 1 · 1 · 1 · 1
  webkit   1440×640  before  RED    0.3219 ×5        webkit 1440×640 after  GREEN  1 ×5
  webkit    844×390  before  RED    0 ×5             webkit  844×390 after  GREEN  1 ×5

The 0.3023 reproduces the banked born-RED figure in `evidence/w2/born-red-head.txt` to the digit, so the cells and the instrument are the ones that opened the row. Every name lands at 1.0000 — wholly painted, not merely over the 0.9 floor — because after §A/§B nothing clips at all: the case fits the card instead of the card fighting the case.

WHY EACH CELL MOVES, mechanically:
 · 1440×640 — the column keeps its pose (640 > the 30rem landscape key). §A caps the case at the card's natural 456.47 and floors it at 150.7; the line hands it 363.61, which is inside both, so the case stays exactly where it is. §B then reads 315.61 of slot height back through `100cqh` and the face steps 304.03 → 211.13. Card 408.47 → 315.56, interior scroll 92 → 0, all five names whole in one paint (the three-slot spread shows them without a gesture).
 · 844×390 — §D's arm fires. The slip moves to the right column, the deck row takes 289.58, the face lands at 138.88 and the card at 241.53. Interior scroll 309 → 0. Card 0 is legible at FIRST paint and cards 1–4 at the arrow step the gate takes, which is the charter's "one cued gesture".

THE §2.1b CASE ROW (added): `scrollHeight − clientHeight` on `.gallery-viewport` goes 92 → 0 (1440×640), 309 → 0 (844×390), 324 → 0 (812×375), 393 → 0 (667×375, which also stops the page overflowing — `documentElement.scrollHeight` 411 against a 375 window goes to 375/375), 26 → 0 (375×667), and stays 0 at 1920×1080, 1440×900, 1280×800, 1024×768, 390×844. Both engines.

π IDENTITY on the cells the wave does not claim: `.gallery-pips` and `.staging-band` top edges are unmoved to 0.00px at 1920×1080 (754.34 / 783.14), 1440×900 (663.63 / 692.42), 1280×800 (613.39 / 642.19), 1024×768 (583.67 / 612.47) and 390×844 (565.63 / 594.42) in chromium, and identically in webkit (663.33 / 692.13 at 1440×900 before AND after). The face moves 304.031 → 303.984 there — 0.047px, the `--card-chrome` over-count — and the card with it. GOLDENS 4/4 UNMOVED BY CONSTRUCTION: the four subjects are `cell-light`, `grid-corner-light`, `logo-light` and `toggle-crest-dark`; none has a gallery anchor, and the two board-region crops are captured in the playing view.

The other born-RED probes in the wave (§2.2 landscape controls, §2.4 toggle theft, §2.5 washi tape) are untouched by this law — no rule here changes `scene.css`'s media arms, `App.vue`'s `.corner-right` geometry, or `SheetWashiLabel`.

CENSUS AND FLOORS: no filter is minted (no new `HandDrawnOutline`, no new `url(#…)` on any state) — budget 9 stands. No motion is added, so there is no PRM arm to write: the face's size lands in the one layout step a resize already spends, exactly as the board's cap does. The ≥44px tap floor is untouched — the smallest post-cure card is 213×288 at 667×375, and the deck's targets are cards.

## risks

1. `container-type: size` makes the slot a containing block for `position: fixed` descendants, and the ONE live board is teleported into the centered card. Audited: the only `position: fixed` under `games/**` is `.scene-controls` (scene.css:286, the portrait dock), and the Teleport moves `.board-peek-host` alone — no fixed element travels in. Layout containment does not clip, so the drawn frame's outset and the cartoon shadow still paint outside the slot (verified in the after-shots). Gate: the existing `board-covisibility` and `drawer` rows.

2. `--card-chrome` must be at least the card's real furniture or the card overflows the case. Every term is one of the card's own declared constants, so it is exact by construction (104.47 declared / 104.44 real at 1440). The one way it under-counts is a WRAPPED range line — reproduced only at a 163px caption, i.e. a 211px card, below any width the product ships (futoshiki's `size · 4×4 / 5×5 / 6×6 / 7×7` measures 162–172px against a 232–259px caption at every shipped cell). §C is the containment: a wrap eats the picture's foot, never a name. §2.1b catches it as a number at every cell it runs.

3. STALE `--live-fit` IS REAL AND DEMONSTRATED — banked at `scratchpad/w2-21-1440x640-after.png`, where the live sudoku card's projected board keeps its 0.6334 scale into a 211px face and gets its top and bottom rows cut, while the four poster cards render whole. It is a PRE-EXISTING class (a width resize already staled it) that this law widens to the height axis. §F is therefore not a nicety; it ships in the same commit. `scratchpad/w2-21-1440x640-after-refit.png` is the same cell with the refit applied by hand: three whole cards, five legible names.

4. §C is a visible change on every viewport, not only the broken ones — the caption reads above the picture. It is a declared DELTA on a surface §2.1 claims, and no golden has a gallery subject, so nothing is re-minted. If the chair judges the letterhead out of scope, §A/§B/§D alone take every MEASURED cell to visFrac 1.0; what is lost is the structural guarantee at the cells nobody measured, and the T2–T4 lesson ("the record can't verify the record") is exactly the argument for keeping it.

5. `flex: 1 1 0` changes the scrollport from content-sized to line-sized, which is the largest single behaviour change in the proposal. The ceiling is what makes it safe: it equals the card's natural height, so at every viewport that already fit, the case resolves to the same number it resolved to before. Verified as pips/band drift of 0.00px at five cells in both engines. Without the ceiling the case would eat the column's slack and push the order slip to the page's bottom edge at tall viewports.

6. §D re-keys `StagingBand`'s row regime by HEIGHT, and that band carries T8-W1 M8's measured reserve. The change is one condition, and the direction is the safe one — below 30rem of height the band falls back to the COLUMN pose, which is the pose that fits a 296–365px column. Measured `options-row` overflow 0 on all five cards at 844×390, 812×375 and 667×375. A landscape phone narrower than 568×320 is outside the estate's support floor.

7. `useCarouselGlide`'s ResizeObserver now fires on a height change as well as a width change, re-pinning through `jumpTo`. `jumpTo` is an instant `scrollLeft` write with no tween (the drawer's regime-resize precedent) and it changes no height, so there is no observer loop — verified across every cell transition in the probe run.

8. Container-query units carry a support floor. The browserslist is `chrome ≥111 · edge ≥111 · firefox ≥128 · safari ≥16.4 · ios_saf ≥16.4`; `container-type: size` and `cqh` are Chrome 105 / Safari 16 / Firefox 110, so the floor clears them outright, and both Playwright engines measured the same face to the 1/64px.

9. NOT MEASURED HERE, and named rather than hidden: a real iOS device (M06/M09's standing law — simulator readings guide, the mark closes on device numbers) and the guard ribbon armed inside §D's grid. The ribbon's anchor arm is written into the sketch, `anchorGuard` measures `.gallery-card-slot` rects that this law does not move horizontally, and at 844 the note's clamped box (min(20rem, 82%) centred on a 426px deck column) clears the slip column — but it was reasoned, not armed and photographed.

## rejected

A. A HEIGHT FLOOR ALONE — `min-height: 26rem` on the scrollport, the charter's first option taken literally without the elastic card. Rejected on measurement: at 844×390 the column has 318.37px total, so a floor that big pushes the gallery past `main` and the order slip paints off the page. The unfloored tree already demonstrates the failure mode one cell over — at 667×375 `documentElement.scrollHeight` is 411 against a 375px window. A floor without a card that can shrink converts a silent clip into a silent overflow, which is the same disease with a different symptom.

B. AN OWNED SCROLL WITH A REAL AFFORDANCE — the charter's third option: keep the 408px card, give the scrollport a visible scrollbar or a fade and let the user scroll down to the names. Rejected on three counts. It makes the deck a two-axis scroller when `scroll-snap-type: x mandatory` and a pointer-drag composable own the horizontal axis, so a vertical drag inside the deck fights the gesture the deck is built on. At phone size the FIRST paint is still a headless sliver of a board with no name anywhere (`w2-21-844x390-before.png`), and a scrollbar inside a carousel is not a cue anyone reads — the charter's invariant wants first paint or one CUED gesture, and this is neither. And it institutionalises the 309px of hidden interior rather than removing it: the honest number for hidden scroll on this surface is zero, which is what §2.1b asserts.

C. A `dvh` CAP ON THE FACE — `min(var(--card-face-w), calc(100dvh - 26.8rem))`, the board's own `min(42rem, 85vw, 100dvh - 10rem)` idiom transplanted. This was the near miss: it needs no container queries and reads as house hand. Rejected because the reserve is the sum of the masthead rung, the page gutters, the pip row, the two column gaps and the band's regime — four numbers owned by three other files — so it needs a rung per breakpoint (measured: 428.84px at the desk, different at 844, different again at 390) and it rots the first time any of those move. That is precisely the T7-W7 phantom-scrollbar derivation the lessons file warns about. `100cqh` reads the case's real height, costs one declaration, needs no rungs, and measured identical in both engines.

D. `order: -1` INSTEAD OF MOVING THE CAPTION IN THE TEMPLATE. Cheaper by one diff hunk, and rejected: it splits DOM order from visual order inside a `role="option"` whose name the deck announces through `aria-activedescendant`. This estate does not ship that divergence. The template move costs the same and keeps reading order honest.

E. LETTING THE FACE LETTERBOX — drop `aspect-ratio` on the face, let it become a short wide box, let the poster centre itself inside it. Would have been constant-free and needed no container query. Killed by reading the component: `PosterBoard` is `width: 100%; aspect-ratio: 1/1`, so a short-wide face makes the poster OVERFLOW its own box rather than letterbox, and the cure would have to reach into `games/**` to fix a pencil-side layout defect — across the eslint boundary, on five poster components.

F. A ROW REGIME AT EVERY NARROW WIDTH — deck and slip always side by side below some breakpoint. Rejected: it breaks `StagingBand`'s measured reserve at every portrait width, and portrait phones have height to spare (390×844 hides nothing today). The defect is short LANDSCAPE, so the arm is keyed to exactly that — `(orientation: landscape) and (max-height: 30rem)`, the same key the band's regime now reads.

G. SHRINKING THE DECK'S AIR AND THE COLUMN GAPS at short heights instead of §D. Recovers 52.8px at 844×390, which buys a 63px poster. Rejected as a stub, not a card: the deck's whole proposition is a spread of worksheets you can read, and 63px of grid with a name under it is neither. §D costs twelve lines of grid and yields 138.88px in the same cell.

## files (as proposed)

- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/chrome/GameGallery/GameCard.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/pencil/chrome/GameGallery/StagingBand.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src/App.vue
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/e2e/viewport-law.spec.ts
- /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/gates.json
- /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/w2-21-1440x640-before.png
- /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/w2-21-1440x640-after-refit.png
- /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/w2-21-844x390-before.png
- /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/w2-21-844x390-after.png
- /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/law.css
- /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/gate.mjs
