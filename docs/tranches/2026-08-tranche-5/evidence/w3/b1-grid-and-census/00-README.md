# T5-W3 lane B1 — the grid grows its row layer, and the board stops talking over itself

Rows **3.1** (`rowsPerGrid`) and **3.5** (`unnamedImages`), one lane because one estate: since W2
the five boards are ONE `BoardHost` + ONE `DigitCell`, so both cures land once and arrive on
sudoku, futoshiki, thermo, killer and kenken together.

## The cure

**3.1 — the row layer.** `BoardHost.vue` groups the cells into `role="row"` wrappers, N of them,
each owning N cells; `aria-rowindex` rides the row and its cells alike. The wrapper is
`display:contents` (`.board-row`, scoped): it generates no box, so the cells stay direct grid
items of `.board-cells` and the `grid-template-*` that placed them still does. The tree gains a
level; the layout gains nothing. Measured, not assumed — Chromium's own AX tree now reads
`grid → row×N → gridcell×N` with every cell parented by a row (`02-ax-tree-chromium.txt`).

**3.5 — one utterance per cell.** `DigitCell.vue` marks the two leaking layers decorative: the
`HandwrittenGlyph` usage (`aria-hidden` on the USAGE, not the component — the poster board, the
caret and the logo still name their glyphs) and the `.cell-ghost` ring. 61 digit echoes and 81
unnamed graphics leave the grid; the digit stays where it belongs, in the cell's own name.

## Verdict

| gate | result |
|---|---|
| 3.1 `rowsPerGrid` | **10/10 GREEN** — 5 boards × chromium + webkit |
| 3.5 `a filled cell announces its value exactly once` | **2/2 GREEN** — in-grid named images 61 → 0 |
| 3.5 `a dealt board publishes zero unnamed image nodes` | **RED at 12** — 93 → 12, all 12 outside this lane's fence (`05-…`) |
| unit battery | **428/428**, incl. 4 new born-RED-by-ablation (`03-…`) |
| π goldens (darwin, local) | **4/4 pass, nothing re-baselined** (`04-…`) |
| regression sweep, both engines | **45/45 + 45/45** (`06-…`) |

## Files

| | |
|---|---|
| `01-3.1-3.5-green.txt` | the probe families, post-cure, both engines |
| `02-ax-tree-chromium.txt` | pre/post figures + the browser's own AX tree, five boards + the 4×4 arm |
| `03-unit-red-ablation.txt` | the new unit tests failing with the cures removed, then the battery |
| `04-pi-goldens.txt` | the golden identity run and the π argument for `display:contents` |
| `05-residual-census-outside-fence.md` | the last 12 unnamed graphics, by owner, with the one-line cure each |
| `06-regression-sweep.txt` | board behaviour under a new DOM level |
| `07-cross-lane-observation.md` | two reds in `gallery-deal.spec.ts` belonging to the guard-naming row |

## One caveat, stated

`display:contents` exposure is verified in Chromium through CDP. Playwright 1.61 removed
`page.accessibility`, and WebKit has no CDP twin, so WebKit's native tree could not be read from
here — the probe's WebKit arm passes on Playwright's own role engine. The change is monotone
either way: an engine that ignored the wrapper would read exactly the tree it reads today.
