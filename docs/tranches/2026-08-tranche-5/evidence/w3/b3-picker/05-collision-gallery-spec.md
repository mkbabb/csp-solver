# Row 3.3 — the one out-of-fence collision, measured and left for the lead

`e2e/gallery.spec.ts` asserts the defect row 3.3 exists to kill. Three of its assertions read
`inert` **off the option root** — the exact attribute placement that stripped four of five cards
from the accessibility tree. They cannot survive the cure, and no formulation saves them: the
option node IS `#gallery-card-{i}` (it carries the `aria-activedescendant` contract), so an
`inert` anywhere on it or above it re-eats it.

The file is outside lane B3's fence, so it was **not touched**. The retarget below is mechanical:
the property those three rows were really gating — a flank contributes no tab stops, no hit
targets — now lives one node down, on `.game-card-deal`. Measured live in
`04-ax-tree-live.txt`: `dealInert: ""` and `tabbables: 0` on all four flanks, both engines.

## The three rows, and the patch

| line | now | becomes |
|---|---|---|
| 39 | `expect(page.locator('#gallery-card-1')).toHaveAttribute('inert', '')` | `expect(page.locator('#gallery-card-1 .game-card-deal')).toHaveAttribute('inert', '')` |
| 67 | `expect(page.locator('#gallery-card-0')).toHaveAttribute('inert', '')` | `expect(page.locator('#gallery-card-0 .game-card-deal')).toHaveAttribute('inert', '')` |
| 156 | `expect(page.locator('#gallery-card-1')).toHaveAttribute('inert', '')` | `expect(page.locator('#gallery-card-1 .game-card-deal')).toHaveAttribute('inert', '')` |

Lines 40 and 66 — the `not.toHaveAttribute('inert', '')` pair on the CENTERED card — stay
byte-unchanged and stay green: the centered card is inert nowhere, root or internals. They read
even truer now, and retargeting them the same way (`#gallery-card-N .game-card-deal`) is the
tidier diff if the lead wants the four rows symmetric.

The two prose lines that describe the old placement (`:6` "flanks frozen + inert", `:154` "the
flank is inert") are accurate about the flank, imprecise about the node; `:32`'s "selection +
inert split" is still the right name for what the block does.

## Blast radius, measured — nothing else

`npx playwright test gallery.spec.ts gallery-guard.spec.ts --project=webkit --workers=1`
→ **11 passed, 3 failed**, and the three are exactly lines 39/67/156. Chromium, same three.
(A first pass at 2 workers × 2 engines showed 13 red; re-run serially it is 3. The extra ten were
dev-server contention — `.sudoku-cell` resolving to 81 elements and still not visible — not this
cure. Recorded so nobody re-derives it.)

Everything else that names the card is untouched by the change:

- `gallery-deal.spec.ts:86` scopes to `[role="option"] .staging-band/.staging-btn/.staging-axis`
  — the band is a SIBLING of the listbox; unaffected. Its `:220` "verbs go inert" is the band's
  `busy`, not the card.
- `gallery-guard.spec.ts` reads `#gallery-card-{i} .game-card-underline` — inside the deal
  wrapper, present and unmoved.
- `filter-census.spec.ts:319` hovers `[role="option"], .game-card` and asserts a hover may not
  RAISE the filtered population. The gallery components declare **no `:hover` rule at all**
  (grep-verified), so a flank root that now accepts `:hover` mints no filtered surface.
- `App.vue:277` queries `.game-card.is-center` — class untouched.
- `drawer.spec.ts:161`'s `inert` is the controls rail, a different estate entirely.
