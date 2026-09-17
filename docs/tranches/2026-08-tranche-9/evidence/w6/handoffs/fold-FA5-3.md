> **SPENT 2026-09-17, by the chair seal (lane S2).** LEDGER.md:87 now pins 576 and carries the dated RESTAMP note (extended by one clause: the row's own breach-split sentence copied the same table head, so it carries the same `-5` — censused head is 576 code + 505 comment + 91 blank, `+172 CODE / +171 COMMENT / +21 blank`); `node scripts/check-doc-truth.mjs` is **0 RED / 42 GREEN, exit 0**, and `ledger-diff --assert-state` stays GREEN.

> **NOT LANDED 2026-09-17** — `docs/tranches/LEDGER.md` is outside the Restamp lane's fence, which names README.md, web/frontend/README.md, docs/benchmarks.md, the manifest and the stamp, and no ledger. This is the ONE remaining `check-doc-truth.mjs` RED at the fold close (`1 RED / 41 GREEN`, row `index-css-bound`, LEDGER.md:87 pins 571 against a censused 576). The two-line restamp plus its dated note is specified literally above and is proven; landing it takes the gate to EXIT 0.

# FA5-3 → CH-19's new bound is a MISCOUNT, and its own new gate caught it on day one

Handoff 6A-4 is LANDED: `scripts/check-doc-truth.mjs` carries the `index-css-bound` row, with
`cssCensus` counting CODE / COMMENT / BLANK separately, the pinned bound read from LEDGER.md's
`**THE HONEST NEW BOUND … <n> CODE lines**`, and the 700 trigger taking precedence over the pin
check exactly as specified. Four self-test fixtures, all four colours proved; plant-proof on the
live tree banked at `../fold/FA5-index-css-bound-plant.txt`.

**The row REDs at the tree, and the defect is in the LEDGER, not the stylesheet.**

```
RED    index-css-bound
        derived: web/frontend/src/assets/index.css: 1,172 lines = 576 code + 505 comment + 91 blank
        docs/tranches/LEDGER.md:87
          expected: CH-19's stated bound to match the tree (576 code lines)
          got:      the row pins 571
```

## This is NOT drift — the file has not moved

`web/frontend/src/assets/index.css` is **byte-identical** at `cfbb8097` (where 571 was pinned),
at HEAD, and in the working tree — sha256
`c6d3e7ad1819219fb6687deb72a17c954737555d6ff6b6e0d0d3373df28e80ae` all three times. So the
disagreement is arithmetic: **571 was miscounted.** TOTAL (1,172) and BLANK (91) are right; the
CODE/COMMENT split is off by 5, with the 5 lines banked as comment that are code.

## The re-measure's split drifts row by row, and it is checkable

`kills-css/ch19-remeasure.txt`'s twelve-commit table was re-run with the row's census. TOTAL and
BLANK match on **all twelve** rows. CODE/COMMENT match on the FIRST row alone and then diverge
monotonically:

| commit | banked code/comment | censused code/comment | Δ |
| --- | --- | --- | --- |
| `74b2835d` | 404 / 334 | 404 / 334 | 0 |
| `9061b8c1` | 404 / 339 | 405 / 338 | 1 |
| `4b28f034` | 404 / 362 | 405 / 361 | 1 |
| `8c241315` | 539 / 415 | 540 / 414 | 1 |
| `aea36ec6` | 550 / 427 | 552 / 425 | 2 |
| `b220c445` | 559 / 444 | 561 / 442 | 2 |
| `0ad725a9` | 558 / 449 | 561 / 446 | 3 |
| `cbf2ab49` | 558 / 449 | 561 / 446 | 3 |
| `dee8d97d` | 559 / 482 | 564 / 477 | 5 |
| `84b14789` | 559 / 485 | 564 / 480 | 5 |
| `1453eb60` | 559 / 486 | 564 / 481 | 5 |
| `cfbb8097` | **571 / 510** | **576 / 505** | **5** |

The very first divergence is decidable by eye from the diff. `74b2835d → 9061b8c1` replaces

```css
  .ctrl-btn {
```

with

```css
  .ctrl-btn,
  .mobile-heading-btn {
```

— one code line becomes two, so CODE is `+1`. The table books that landing as `code +0`. The
census is right and the table is wrong, five times over by head.

The census's arithmetic is written at its site and is character-level on purpose: this file's
block comments continue on plain indented text rather than a leading `*`, and several open
mid-line after a declaration (`--color-gold-star: var(…); /* …`). A line is CODE when any
character outside a comment survives, COMMENT when none does, BLANK when the raw line is
whitespace — blank lines inside a comment bank as blank, which is what makes the three columns
sum to the file. It reproduces the CLOSE figure (404 / 334 / 70) exactly, which is the number
CH-19's whole story rests on.

## The seam (LEDGER.md is outside FA5's fence)

`docs/tranches/LEDGER.md:87`, CH-19's row. Replace, literally:

```
act on: 571 CODE lines**
```

with:

```
act on: 576 CODE lines**
```

and append to the row, in its own voice, a dated note — the restamp must not look like the
silent kind this row exists to prosecute:

> **RESTAMPED 2026-09-17 (T9-W6 chair fold, lane FA5): 576, not 571.** The bound's own gate
> (`scripts/check-doc-truth.mjs`, row `index-css-bound`) red on its first run against an
> UNMOVED stylesheet — `index.css` is byte-identical at `cfbb8097`, at HEAD and in the tree — so
> 571 was a miscount, not a drift. `kills-css/ch19-remeasure.txt`'s TOTAL and BLANK columns hold
> on all twelve commits; its CODE/COMMENT split is right on the close row alone and drifts to
> `-5` by head, the first divergence being T5-W3's `.ctrl-btn` selector split, which the table
> books as `code +0` and which is plainly `+1`. The re-measure's TOTALS, its attribution and its
> verdict are untouched. `docs/tranches/2026-08-tranche-9/evidence/w6/handoffs/fold-FA5-3.md`

Everything else in the row — the +45% breach, the eight named landings, the WHY-NOT-A-DISTILL
paragraph, the three triggers — stands as written. Only the number moves.

## Verification, once it lands

`node scripts/check-doc-truth.mjs --only index-css-bound` → **GREEN, exit 0**. Already proved on
the live tree by planting 576 and restoring: GREEN planted, RED restored, LEDGER.md sha256
identical before and after (`../fold/FA5-index-css-bound-plant.txt`).

## For the Restamp lane

`check-doc-truth` moves **41 → 42 rows** and **125 → 129 self-test fixtures**.
