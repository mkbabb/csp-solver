# Lane a4-artifact — Finding 5: the top-left board artifact

**Verdict: PRE-EXISTING / COMMITTED. Not a W10 regression.** The board frame's
top-left corner spike reproduces **byte-identically on W9 (08f3ddd9)**. W10 is innocent.

## What the artifact is
A gold **arrowhead/spearhead barb** at the board frame's top-left corner (see
`owner-audit-2/board-artifact.png`; upscaled crop: `addendum/tl-zoom.png`). The top
and left strokes of the board's outer frame overshoot past each other and meet in a
sharp mitered spike that juts up-and-left instead of a clean/rounded corner. The faint
gray parallel line just left of it is the board-wrapper's `cartoon-shadow-md` drop
shadow — incidental, not the artifact.

## Owning element + file:line
The gold frame is the **grid frame-line**, NOT `HandDrawnOutline`. The board
(`SudokuBoard.vue`) is not wrapped in `HandDrawnOutline`; its frame is drawn by:

- `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue`
  - transition layer frame path: **lines 143–150**
  - steady layer frame path: **lines 193–200**
  - Both set `stroke-width="12"` and `stroke-linecap="round"` but **no `stroke-linejoin`**
    → the SVG default `miter` governs the corners.

Path geometry from:
- `web/frontend/src/pencil/grid/gridPaths.ts`
  - `generateRectBoilFrames(...)` radius===0 branch, **lines 193–199** (four sides,
    each `wobbleLinePoints` with its own seed), concatenated + `Z` at lines 232–240.
  - Called by `generateGridBoilFrames` at **line 318** with **no `radius`** → `r = 0`.

## Root cause
Two compounding facts, both pre-T3:
1. **Miter default on a closed, wobbled polyline.** The frame is the only *closed*
   (`Z`) path in the grid; subgrid/cell lines are open, so their `stroke-linecap="round"`
   already softens their ends. The frame's corners are governed by `stroke-linejoin`,
   which is unset → `miter`. A sharp wobble turn under miter extrudes a spike.
2. **Independently-seeded sides don't share corner points.** Each side is a separate
   `wobbleLinePoints` call with its own seed, so adjacent sides' shared corner is two
   *different* points. At the top-left this is worst because it's the `M`-start / `Z`-close
   vertex — a tiny synthetic closing segment between mismatched endpoints, then mitered.

### Proof (path generated from the real `gridPaths.ts` + `@mkbabb/pencil-boil`)
`generateRectBoilFrames(12, 0, 976, 1000, {roughness:0.5,segments:6,seed:42,jagged:true}, 2.0, 4)`, frame[0]:

- Top side starts at **(10.83, 0)**; its 2nd point dips to **(174.67, −4.76)**.
- Left side ends at **(12, −1.03)** — *above* the top edge — after bulging to **(4.93, 500)**.
- `Z` closes **(12, −1.03) → (10.83, 0)**: the two "corner" points differ by ≈(1.17, 1.03),
  and the mitered join over that mismatch is the barb.

**Working tree and `git show HEAD:…/gridPaths.ts` produce the identical string**
(same START, END, and 26 tokens) — so the geometry is unchanged from committed. W10's F1
radius work (`arcBoilPoints`, the `r !== 0` branch) only runs for `radius > 0`, which is
used exclusively by `HandDrawnOutline` on the *controls cards* — never the board (`r = 0`).

## Fix shape (spec only — no impl ships from this lane)
- **Primary (minimal, in-soul):** add `stroke-linejoin="round"` to both frame-line
  `<path>`s (`HandDrawnGrid.vue` :143–150 and :193–200). Round join collapses the miter
  barb into a soft nub that reads as a hand-drawn corner. Subgrid/cell lines need nothing
  (open paths; interior joins are shallow).
- **Secondary (root, optional, more invasive):** in `generateRectBoilFrames` radius===0
  branch (`gridPaths.ts` :194–199), pin each side's *endpoints* to the true rect corners
  so adjacent sides register exactly and only mid-side wobbles — removes the corner kink at
  source. Alters board character; not required once the linejoin lands.

## Out of scope but adjacent (flag for the W10-F1 lane)
The new rounded path (`arcBoilPoints`, used by `HandDrawnOutline` on the controls cards)
regenerates corner arcs with a fresh per-frame seed while sides are `perturbPoints`-pinned
— so on boil frames the arc endpoints drift off the side endpoints, a per-frame corner
shimmer. Same *family* of defect, different element (controls card, not the board), so not
Finding 5.
