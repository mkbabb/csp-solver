# CRIT LANE crit-forensics — adversarial audit of the forensic lanes (a2, a4, a6)

**Mandate:** REFUTE BY DEFAULT. Re-derive a2 (boil/outline), a4 (artifact), a6 (attribution)
from the actual W9→working-tree diff; scrutinize the vector-effect stroke theory especially;
verify the attribution table against the diffs; confirm the artifact owner.

**Method:** HEAD == 08f3ddd9 (W9, committed). Working tree carries W10 uncommitted. So
"old/W9" = `git show HEAD:…`, "new/W10" = working tree. Every claim below re-derived from
`git diff HEAD --`, the live source, and pencil-boil's `src/path.ts`.

**Bottom line: I could not refute a2 or a4. Both survive adversarial re-derivation nearly
intact (one off-by-one citation in a2). a6 DOES NOT EXIST as a file — its attribution table
is UNVERIFIABLE; I reconstructed the attribution independently from the diffs below.**

---

## a2 — boil/outline. Verdict: CONFIRMED (1 CORRECTED citation)

The prompt flagged "the vector-effect stroke theory especially." a2 does **not** hold a naive
vector-effect theory — it explicitly states "the stroke-width itself never changed (3 CSS px in
both regimes)" and attributes the hairline to **filter erosion + long-wavelength waver**. That
reasoning is correct and I verified every leg.

| # | a2 deduction | my re-derivation | verdict |
|---|---|---|---|
| 1 | W10 deleted `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`, viewBox 1000-unit → px-native | `git diff HEAD -- HandDrawnOutline.vue` shows both attrs removed; `VIEWBOX=1000`/`PAD=8` deleted; viewBox now `width+outset*2` | CONFIRMED |
| 2 | stroke-width unchanged at 3px on the controls card | `SudokuGame.vue:98,122` pass `:stroke-width="3"`; the `stroke-width` binding is a context (unchanged) line in the diff | CONFIRMED |
| 3 | grain-static + frameBoil **values** unchanged; regression is coordinate reinterpretation, not a value edit | `pencilConfig.ts` diff touches ONLY the `celestial` palette. `frameBoil: 1.2 // (viewBox units)` (line 112) and `grain-static {baseFrequency:0.04,numOctaves:3,scale:2.5,seed:2}` (line 147) are byte-unchanged | CONFIRMED |
| 4 | grain primitives resolve in `userSpaceOnUse` → literal px once px-native | `SvgFilters.vue:76-90` grain `<filter>` sets no `primitiveUnits`; `filterRegion()` only sets region %. SVG default `primitiveUnits=userSpaceOnUse` ⇒ scale 2.5 / baseFreq 0.04 are viewBox user units | CONFIRMED |
| 5 | k≈0.263 (251+12)/1000; grain/boil erode ~3.8× | 263/1000=0.263. grain 2.5·0.263=0.657px→2.5px (×3.8). wavelength 25·0.263=6.6px→25px (×3.8). frameBoil 1.2·0.263=0.316px→1.2px (×3.8) | CONFIRMED |
| 6 | side wobble is length-proportional ⇒ scale-invariant on screen ("preserved") | `path.ts:89 maxDisplace = roughness*len*0.015`. W9: 0.5·984·0.015·0.263≈1.94px; W10: 0.5·251·0.015≈1.88px (×1.0) | CONFIRMED |
| 7 | corners square→quarter-arc r=12, jitter amp 0.5·12·0.06=0.36px | `gridPaths.ts` diff adds `radius` param + `arcBoilPoints`; HandDrawnOutline auto-reads border-radius (12px `rounded-xl`). `path.ts:305 amp=roughness*min(rx,ry)*0.06` → 0.36 | CONFIRMED |
| 8 | `generateRectBoilFrames(…,0)` bit-identical to W9 square frame | the `r===0` branch (sides seed s..s+3, concat, `Z`) is byte-identical to the deleted W9 block in the diff | CONFIRMED |
| 9 | cite "pencil-boil src/path.ts:88" for the wobble formula | formula is at **path.ts:89** (`overshoot` at :90) | **CORRECTED** (off-by-one; conclusion stands) |
| 10 | vector-effect/preserveAspectRatio deletion is a no-op at 1:1 (fix-spec pt 5) | correct — at 1:1 there is no scaling for either attribute to counteract | CONFIRMED |

a2's fix-spec caveat "do NOT retune the shared `grain-static`" is well-founded: grid (1000-unit
space), glyphs, and 20–32px icons all bind `grain-static`; a dedicated `grain-outline` preset is
the correct surgical move.

---

## a4 — top-left board artifact. Verdict: CONFIRMED

| # | a4 deduction | my re-derivation | verdict |
|---|---|---|---|
| 1 | artifact = gold miter barb at board frame TL corner | owner `board-artifact.png` + a4 `tl-zoom.png`: an arrowhead spike jutting up-left where top+left strokes overshoot | CONFIRMED |
| 2 | owner is the grid **frame-line** (HandDrawnGrid), NOT HandDrawnOutline | `SudokuBoard.vue:5,445` imports/uses `HandDrawnGrid`; no `HandDrawnOutline` wrap on the board | CONFIRMED |
| 3 | frame paths lack `stroke-linejoin` → SVG default `miter` | `HandDrawnGrid.vue:143-150` (transition) & `193-200` (steady): `stroke-width=12`, `stroke-linecap=round`, **no linejoin anywhere in the file** | CONFIRMED |
| 4 | independently-seeded sides + `Z`-close mismatch at M-start/Z vertex | `gridPaths.ts` sides seed s,s+1,s+2,s+3; frame closes with `Z` — adjacent sides never share a corner point | CONFIRMED |
| 5 | PRE-EXISTING / committed; **W10 innocent** | `HandDrawnGrid.vue` has an EMPTY diff vs HEAD; `generateGridBoilFrames` untouched; board call `gridPaths.ts:318` passes NO radius → r=0 → bit-identical branch. Board frame renders identically to W9 | CONFIRMED |
| 6 | faint gray parallel line = `cartoon-shadow-md` drop shadow, incidental | `tl-zoom.png` shows an offset parallel line left of the barb, consistent with a box-shadow, not the stroke | CONFIRMED |
| 7 | out-of-scope flag: controls-card corner shimmer (arc fresh per-frame seed vs pinned sides) | `arcBoilPoints` uses `seed = s+10+si+f*997` (fresh per frame) while sides `perturbPoints` off a fixed base — arc endpoints drift per frame | CONFIRMED |

a4's fix spec (`stroke-linejoin="round"` on both frame paths) is minimal and in-soul; the
secondary endpoint-pinning fix is correctly marked optional/invasive.

---

## a6 — attribution table. Verdict: UNVERIFIABLE (file absent)

No `a6-*.md` exists in the addendum dir. The attribution table cannot be checked because it was
not produced (lane not spawned or still running). To keep the loop honest I reconstructed the
attribution directly from the diffs:

| owner finding | root | committed? | source |
|---|---|---|---|
| boil hairline / erosion | **W10 F1 px-native** (HandDrawnOutline + gridPaths radius) | UNCOMMITTED (working tree) | HandDrawnOutline.vue + gridPaths.ts diffs |
| controls-card rounded corners | W10 F1 (border-radius auto-read) | UNCOMMITTED | HandDrawnOutline.vue diff |
| controls-card no air | W10 F1 (`outset` default 0, no caller passes it) | UNCOMMITTED | HandDrawnOutline.vue diff + caller grep |
| board TL artifact | **PRE-EXISTING (W9/committed)** — miter on closed wobbled frame | COMMITTED | HandDrawnGrid empty diff |
| sun spiral contrast (a5's finding, cross-checked) | W10 F4 palette: `spiral #DF9A1E` (was `rays #F0B030`), `sparkleStroke #D99A10`, `moon.star #FFF4AA` | UNCOMMITTED | pencilConfig.ts diff |

**Any attribution table that credits `vector-effect`/`preserveAspectRatio` removal with thinning
the stroke must be KILLED** — at 1:1 those attributes are no-ops; the hairline is filter erosion.

---

## Convergence arithmetic

- a2: 10 load-bearing deductions — 9 CONFIRMED, 1 CORRECTED (citation only; conclusion holds), 0 REFUTED.
- a4: 7 deductions — 7 CONFIRMED, 0 REFUTED.
- a6: 0 verifiable deductions (file absent) — UNVERIFIABLE.

Per-deduction over the produced lanes: 16/17 exact-as-written = **94.1%**; conclusions surviving
(counting the corrected citation's conclusion as intact) = **17/17 = 100%**. Reported
convergence **94%** (docks the a2 off-by-one and the a6 non-existence gap).

Status **partial** solely because a6 was never produced — a2 and a4 are green.

## kill_list
- KILL any claim that `vector-effect="non-scaling-stroke"` / `preserveAspectRatio="none"` removal thinned the stroke (no-op at 1:1; hairline = filter erosion in userSpaceOnUse).
- KILL/repair a2 citation `path.ts:88` → **`path.ts:89`** (formula), `:90` (overshoot).
- KILL the notion the board TL artifact is a W10 regression — it is PRE-EXISTING/committed (HandDrawnGrid empty diff).
- FLAG the absent a6 report: attribution table uncertified until produced; use the reconstructed table above as the interim baseline.
- HOLD a2's caveat as binding: do NOT retune the shared `grain-static` (grid/glyphs/icons depend on it) — a dedicated `grain-outline` preset only.
