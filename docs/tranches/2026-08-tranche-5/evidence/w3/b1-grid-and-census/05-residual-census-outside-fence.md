# Row 3.5 — the twelve graphics this lane may not touch

**Status: the board half is cured; the page-wide census is not zero, and cannot be from inside
this lane's fence.** Banked here so the wave routes the remainder rather than re-measuring it.

Lane B1's estate is `BoardHost.vue` / `DigitCell.vue` / `CageOverlay.vue`. The census the probe
asserts (`e2e/a11y.spec.ts:425`) is PAGE-WIDE, and 12 of the 93 unnamed `image` nodes live in the
control card, the drawer tab and the pencil grid — other lanes' files, being edited concurrently.

## What moved

| | at tip `78448760` | after this lane |
|---|---|---|
| `image` nodes, playing view | 155 | **13** |
| named | 62 | 1 |
| unnamed | **93** | **12** |
| unnamed inside the grid | 81 | **0** |
| named inside the grid (the double-announce) | 61 | **0** |

The 81 were the per-cell `.cell-ghost` rings and the 61 were the `HandwrittenGlyph` label layer —
both `DigitCell.vue`, both cured. Every figure re-measured on all five boards and the 4×4 arm
(`02-ax-tree-chromium.txt`).

## The twelve, by owner

Each is a bare `<svg>` (Playwright and both browsers map it to `image`) with no name and no
`aria-hidden` ancestor. All twelve are decorative: every one sits inside a control that already
carries its own accessible name, or draws furniture the board's own labelling speaks.

| n | node | file | cure |
|---|---|---|---|
| 5 | `svg.outline-svg` — the hand-drawn well/tab outlines (3 pruned tray-wells, the drawer tab, the scene-controls well) | `src/pencil/grid/HandDrawnOutline.vue:144` | `aria-hidden="true"` on the root `<svg>` — one line clears all five |
| 5 | the control-card icons (`button.icon-btn > svg`, `.deal-btn > svg`, `button.icon-btn > span > svg`, `svg.sparkle-icon`) | `src/pencil/chrome/icons/*.vue` — `SolveIcon`, `DiceIcon`, `UndoIcon`, `RedoIcon`, `HintIcon`, `EraserIcon`, `ShareIcon`, `FillForcedIcon` (none carries `aria-hidden`) | `aria-hidden="true"` on each icon's root `<svg>`; the buttons are already named |
| 1 | `svg.hand-drawn-grid` — the board's drawn rules | `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:272` | `aria-hidden="true"` — the grid's shape is in the grid's own `aria-label` |
| 1 | `.boil-divider-wrap > svg` | `src/pencil/chrome/BoilDivider.vue:69` | `aria-hidden="true"` — a divider rule |

Twelve nodes, four files, none of them this lane's. The whole of it is 11 attributes, and the
sibling cages/caret/tube/star/vignette in the estate already carry exactly this attribute — the
four files above are the leaks r1 M6 named.

## Consequence for the gates

* `3.5 unnamedImages › a filled cell announces its value exactly once` — **GREEN, both engines.**
* `3.5 unnamedImages › a dealt board publishes zero unnamed image nodes` — **RED at 12.**
* `3.6 stability` (not this lane's row) inherits the same census twice — its two tests red on
  `4×4: no unnamed graphics` / `deal A: zero unnamed graphics` and on nothing else; their grid-shape
  half (rows === N, gridcells === N²) passes.

The assertion was NOT weakened and the probe spec was not edited. Whoever holds the pencil chrome
and the control card closes the last 12.
