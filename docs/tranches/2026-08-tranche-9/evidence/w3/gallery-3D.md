# T9-W3 lane 3D — THE DECK HANDS FOCUS BACK

§3.2 (focus returns on every gallery exit) and the §3.7 rows this lane's fence names: the deck's
focus ring, and the phone head's focus order. Two cures landed, one handed off.

## 1 · What was measured at HEAD, before anything moved

`gallery-focus-trail-HEAD.txt` — a focus trail through every entry/exit pair, both engines, on the
live dev build. Chromium and WebKit agree line for line.

| beat | activeElement at HEAD |
| --- | --- |
| wordmark focused, Enter → deck | `div.gallery-viewport` (the deck takes it) |
| Escape out | **`BODY`** |
| `g` from the celestial toggle → deck → Escape | **`BODY`** |
| Enter on another card | **`BODY`** |
| `d` to deal | **`BODY`** |
| Escape taken with focus already OUTSIDE the deck | `button.sun-moon-toggle` — already correct |

V1's "seven of seven land on `<body>`" reproduced on five paths. The last row is the EXCEPTION,
and it is green at HEAD because nothing hands focus back at all — so the cure's first duty is not
to break it.

Two more facts the same probe settled, both of which shaped the cure:

- **The wordmark node does not survive the entry.** `:inert-heading` turns the masthead
  `<button>` into a `<span>` while the deck is up, so the element that held focus is destroyed
  before `GameGallery` mounts: `isConnected: false`, both engines, while the deck is up and after
  the exit. A node reference cannot carry that control across the swap.
- **`display: none` on an ancestor does not blur.** `before/sync/micro/raf` all `true`, both
  engines — so a control hidden by `v-show` (the board's cells under the deck) keeps focus and
  keeps its reference, which is why the record is worth taking at all.

And `gallery-geom-HEAD.txt` for §3.7: with the deck holding a visible keyboard focus, the
indicator box read `112.0,125.4 1056.0x456.0` at **every one** of the five
`aria-activedescendant` values, while every card's own `outline-style` read `none`. A visible
focus indicator that cannot say which option is focused.

## 2 · The cures

### §3.2 — `GameGallery.vue`

The guard ribbon has done this correctly *inside* the deck since T5-W3. The idiom generalizes one
box outward, and it is two rules:

1. Record what held focus when the deck opened (`onMounted`, before the deck takes it for itself);
   hand it back when the deck leaves (`onBeforeUnmount`). No per-verb branch — there is no exit
   verb whose user is owed less.
2. **Only when the deck is holding it.** `rootEl.contains(document.activeElement)`, read in
   `onBeforeUnmount` because `onUnmounted` runs with the deck already detached and
   `document.activeElement` is `<body>` there for every exit alike — the one test that separates
   the two cases would be dead. This is the V1 exception as LAW: Escape is bound on the window, so
   it fires from anywhere, and a deck that grabbed focus back from wherever the user had since put
   it would be a worse defect than the one being cured.

`<body>` is refused at record time. It is `isConnected`, so recording it would make the handback a
no-op that reads like a success.

The fall-through to the opener is the answer to the destroyed-node measurement, and it is not a
guess about which element to prefer: the handback focuses the record, then *checks whether focus
actually moved*, and only reaches for `button.logo-trigger` when it demonstrably did not. `button`
is load-bearing in that selector — while the wordmark is still the deck's inert `<span>` it
matches nothing and the deck leaves focus exactly where it is.

### §3.7 — the ring, `GameCard.vue` (+ the retired rule in `GameGallery.vue`)

The ring moves off `.gallery-viewport` and onto `.game-card.is-center` — the `role="option"`
element that `aria-activedescendant` actually names, so the ring and the AX truth become the same
object. The deck keeps `:focus-visible` as the STATE the card's rule hangs off; only the paint
moves.

The offset is bounded rather than chosen. An outline on a descendant is clipped by the scroll
container holding it, and the END cards rest with **9.6px** of air at 1280×800 (index 0 at left,
index 4 at right — `useCarouselGlide`'s clamp cannot travel them to true centre). 4px offset +
2px stroke reaches 6px out: whole, with 3.6px to spare at the tightest rung and ~42px at 390×844.
The spec pins WHOLE rather than merely PRESENT, at both end cards, so a future offset that
overruns the scrollport reds instead of quietly painting a ring nobody can see.

### §3.7 — the phone head order: HANDED OFF (`handoffs/3D-1.md`)

Measured exactly (`phone-head-order-HEAD.txt`, both engines): at 390×844 the `@mbabb` badge paints
at `x=0` and the celestial at `x=336`, but the badge is SECOND in the document because the mobile
card is mounted inside `main > .board-group`, after `.corner-right`. At 1280×800 the two orders
agree. `positiveTabindex: 0` on the page, so DOM order IS tab order and there is no tabindex to
blame. The whole cure is one line moving inside `App.vue`, which is outside this fence — and the
handoff proves the move costs zero pixels rather than asserting it: no ancestor of
`.mobile-attribution` on either path establishes a containing block for its `position: fixed`
(`ancestorsMakingContainingBlock: []`), so the badge's rect `[0, 0, 75.5, 39.8]` is a fact about
the viewport, not about its parent.

## 3 · Born-RED, and the one row that was already green

`gallery-focus-born-RED.txt` — the new spec against the untouched tree: **12 failed, 2 passed**,
both engines.

The 2 that passed are the outside-Escape exception rows, and that is the correct verdict, not a
gap: at HEAD nothing hands focus back at all, so nothing can steal it. Reported as GREEN-AT-HEAD
rather than dressed up as a red. Their whole job is to red if the cure over-reaches, which is the
easiest way to get §3.2 wrong.

`gallery-focus-CURED-both-engines.txt` — the same spec after the cure: **14 passed**.

(The two artifacts cite different line numbers for the same rows: the born-RED run predates the
six-line `PRM:` declaration `lint:motion` requires in the head. Same rows, shifted by six.)

## 4 · The π ledger (`gallery-pi-ledger.txt`, shots under `gallery-pi/`)

This wave speaks; it does not repaint. Two pixel moves are DECLARED, and both are gated on
`:focus-visible`, which is false for every pointer entry in both engines (measured).

A bare before/after bitmap of this deck means nothing: a first pass showed 3.7% of the *identity
control* moving with no cure in the tree at all. Two instruments fixed that. `reducedMotion:
"reduce"` freezes the grid boil and the wordmark's pose stack; and a same-tree rerun establishes
the noise floor, which turns out to be the randomly-dealt board — frames that contain the live
board move ~1% run to run, frames that do not are byte-identical.

```
NOISE FLOOR (same cured tree, two runs)
  ring-idx4 / wordmark            IDENTICAL both engines   ← no live board in frame
  pi-pointer / ring-idx0          ~0.98–1.03%              ← the random deal, not a cure

π IDENTITY control — deck at idx4, focus OFF the listbox
  pi-nofocus-idx4-chromium        IDENTICAL  sha 85993c01023d
  pi-nofocus-idx4-webkit          IDENTICAL  sha b3f21a8e97e9

DECLARED DELTAS (noise floor zero on both surfaces)
  ring-idx4-chromium              8643/854880 px (1.011%)  max|Δ| 96
  ring-idx4-webkit                8648/854880 px (1.012%)  max|Δ| 96
  wordmark-chromium                709/122640 px (0.578%)  max|Δ| 97
  wordmark-webkit                  294/122640 px (0.240%)  max|Δ| 96
```

- **DELTA 1 — the ring.** Off the scrollport (`112.0,125.4 1056.0x456.0`, identical at all five
  indices), onto the active option (`825.6,149.4 → 1158.4,557.3` at index 4). ~8.6k px, exactly
  the perimeter, both engines within 5px of each other.
- **DELTA 2 — the wordmark.** The handback lands focus on `button.logo-trigger` after a KEYBOARD
  exit, and `.logo-trigger:focus-visible` then draws its own existing ring. New pixels in the
  playing view, in a state that previously showed a focus ring nowhere on the page because focus
  was on `<body>`.
- **IDENTITY.** With focus off the listbox the deck is byte-identical on both trees, both engines.
  Neither the retired rule nor the new one can paint without `:focus-visible`.

**No golden was re-baselined and none needed to be.** The four committed goldens are cell,
grid-corner, logo and toggle-crest; `visual-golden.spec.ts` contains no gallery row and no
keyboard exit, and nothing in `e2e/` asserts over `.gallery-viewport`'s outline. Grepped, not
assumed. The look of both rings is W7 §6's to settle.

## 5 · Gates (`gallery-focus-gates.txt`, `gallery-focus-regression-both-engines.txt`)

- unit battery **64/64 Test Files**, 790 tests (the "Test Files" line, per the wave's trap)
- `vue-tsc --noEmit` **exit 0**; `vue-tsc -p tsconfig.e2e.json` **exit 0**
- `lint:sleep` **exit 0** — the new spec adds no fixed-duration wait; every settle is a retrying
  assertion, and the deck's *unmount* is the precondition each focus claim stands on (including
  the negative row, where the claim is that nothing moved)
- `lint:motion` — `spoken-gallery.spec.ts` clears both its checks (`PRM: live, because …` in the
  head, no `emulateMedia` route). The gate still exits 1 on two SIBLING lanes' files in flight
  (`spoken-controls.spec.ts` has no declaration, `follow-still-authorship.spec.ts`'s is
  unparseable) — neither is in this fence and neither was touched
- `lint:live-regions` (lane 3A's gate) and `lint:copy` / `lint:theme-selectors` **exit 0**, run
  after the last pristine/cured swap to prove no sibling lane's work was clobbered by a restore
- `eslint` **exit 0** on all three touched files; prettier reports both `.vue` files unchanged
- deck-adjacent regression, both engines, cured tree: **152/152**
  (gallery + gallery-guard + gallery-deal + a11y + masthead-alignment + spoken-gallery)

`gallery-focus-flake-ledger.txt` records why that regression is read at two workers: eight
distinct rows flaked across seven runs on this box and not one repeated, a PRISTINE tree at nine
workers reds a row the cured tree never reds, and this lane's own rows survived 84/84 under
`--repeat-each=6 --workers=9`. The box, not the cure.

## 6 · Fence

Touched: `GameGallery.vue`, `GameCard.vue`, and the new `e2e/spoken-gallery.spec.ts`. `guardX` /
`--guard-x` (:168-191) and the live regions lane 3A landed were read and left alone. The pristine
copies used for the ablation and the before-shots came from `git show HEAD:<path>` — never a
stash — and both files were restored by sha (`9ba8d913…`, `c4bb65c3…`) after every swap.
