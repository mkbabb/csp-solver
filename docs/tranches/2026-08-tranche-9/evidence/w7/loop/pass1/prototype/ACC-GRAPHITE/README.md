# ACC-GRAPHITE — pass 1 (PROTOTYPE)

T9-W7 convergent design loop, family **ACC-GRAPHITE — graphite for state**.
Sections §3 the accent family · §4 the fill meter · §12 multiplayer chrome · mark M07.

**It RUNS.** A worktree at `.claude/worktrees/wf_e58b4764-0fc-43`, branch
`worktree-wf_e58b4764-0fc-43`, built off `aab67b92`, served at `http://127.0.0.1:4237`
(`vite --strictPort`), measured **chromium and webkit, light and dark, 1280×800 dpr1 and
393×699 dpr3** — eight cells for every board reading below. Nothing is committed; the patch is
`prototype.diff` (14 files, +441 / −141) and `git -C <worktree> diff --stat` is the same list.

`vue-tsc --noEmit` 0 · `vitest run` **811/811 in 66 files** (810 at HEAD + the one this lane
adds) · `check-ink-pressure` 0 violations · `check-copy-register` 0 new · `check-font-coverage`
0 new glyphs.

---

## 0 · The headline, in six numbers

| the question | HEAD (research §0) | this prototype | where |
|---|---|---|---|
| does playing the game add colour to the page? | +27% desk / +152% phone | **0.0000% desk light both engines; worst cell +0.0285% of viewport** | §1 |
| is the ring the thickest mark on the board? | 0.449× the frame line, rank 3–49 | **rank 1 of 81 with 0 rivals in 7 of 8 cells at focus** | §2 |
| does the gauge have a form no rule has? | 1 continuous run, 2.92:1 over the rule | **exactly k ink runs at k = 1, 3, 20, all 8 cells, both engines**, 14.87 / 11.99 over paper | §3 |
| a clue against your digit | 1.11× and a hue | **1.333× rendered, in all 8 cells** | §4 |
| your notes against the engine's peek | hue, not pressure | **2.50–2.88× contrast quotient** (alpha quotient 1.71–1.79) | §5 |
| your own colour in a room | you were the one player without one | **your row and your cells take `inkFor(0)` on both pages; solo binds 0 cells / 0 rows** | §6 |

And two the brief did not ask for, found by measuring:

- **A `stroke-dasharray` gauge is not portable.** A dash pattern longer than its path paints
  ONCE in Chromium and **FOUR TIMES in WebKit**. The spec's tally mechanism was the dash list;
  it is geometry now. §3.1.
- **`selfInk` froze on a short-circuit.** The first cut of §6 read a non-reactive `let` before
  it read `present`, collected no dependency, and stayed `{}` for the life of the tab — in a
  live two-page room, with everything else correct. §6.2.

---

## 1 · G1 — the pixel census: playing the game adds no colour

`readings/proto-{desk,phone}-{light,dark}-{chromium,webkit}.json` → `census{Rest,Focused,Mid}`.
Same band (OKLCH 40–115°) and chroma floor (C ≥ 0.012) as r0. Mid-board is **66–70 cells filled
with LEGAL digits** (a greedy row/column/box choice; `midBoard.invalidCells` is **0** in all
eight runs) — typing `1` everywhere fills the board with the teacher's red, which is a declared
exception and would have been counted as residue.

| cell | rest | focused | mid-board | Δ focused | Δ mid |
|---|---|---|---|---|---|
| desk light chromium | 19,643 | 19,643 | 19,643 | **0.0000%** | **0.0000%** |
| desk light webkit | 19,676 | 19,676 | 19,676 | 0.0000% | 0.0000% |
| desk dark chromium | 10,767 | 10,793 | 10,888 | +0.0025% | +0.0118% |
| desk dark webkit | 10,720 | 10,720 | 10,809 | 0.0000% | +0.0087% |
| phone light chromium | 15,594 | 15,594 | 15,594 | 0.0000% | 0.0000% |
| phone light webkit | 15,612 | 15,612 | 15,612 | 0.0000% | 0.0000% |
| phone dark chromium | 8,255 | 8,247 | 8,480 | −0.0003% | +0.0091% |
| phone dark webkit | 8,009 | 7,998 | 8,714 | −0.0004% | **+0.0285%** |

**GREEN: 8 of 8 within ±0.1% of the viewport**, and four of eight are equal to the pixel.

**The dark residue, binned** (`census*.topBands`, 10° bands, the gate's own ask). Light desk, at
rest and unchanged through mid-board: 50–60° **10,437 px**, 40–50° **5,261**, 70–80° **2,101**,
140–150° **807**, 150–160° **309**. The 40–80° mass is the paper itself — `--color-background`
and `--color-card` are warm off-whites (hsl 48) and the sky furniture sits with them; 140–160° is
the difficulty chip's `crayon-green` in the controls card. **Both are named tokens, neither is
board state, and neither moves when you play** — which is the gate's real question. The dark
cells' +0.009…+0.029% at mid-board is 89–716 px on a 2.47 Mpx phone viewport, and it is **not
binned to a token in this pass**: it is the only unattributed residue left, and it is a gap, not
a pass. (r0's own figure on the same surface was +152%.)

---

## 2 · G2 — the ring: two passes of the pencil, and what they cost

**The form.** Tier 2 draws the ghost rect twice: the shipped path, and a second
`<path class="cell-ghost-retrace">` on its own seed (`+3`), inset 10 board units, its point list
**reversed** so the draw-on runs the other way round the cell. Both graphite, 12 units, opacity
1.0; fill 0.08 on the outer only. `display: none` at every other tier, red at tier 2×3.

Measured, all eight cells (`ringPaths`, `ringGeometry`, `findability`):

| | desk (1280) | phone (393 dpr3) |
|---|---|---|
| each pass, rendered | **5.87 CSS px** | **3.37 CSS px** |
| fused band, geometric | 22 cell-units = **1.41× the frame line** | same ratio, layout-fixed |
| peak thickness, chamfer DT | 13.83–17.49 px | 7.55–9.00 px |
| ring ink over `--color-card` | **14.87 light / 11.99 dark** | identical |
| outer edge vs the cell rect | **4.15–6.16 px INSIDE it** (the ghost svg's own 15% pad) | 2.78–3.50 px inside |
| clearance to the neighbour's interior | **+6.36 px** | **+3.65 px** |

**Rank of the selected cell among all 81, and rivals within 10%:**

| cell | at focus | at mid-board |
|---|---|---|
| desk light chromium | **r1 · 0 rivals** (margin 1.581) | **r1 · 0** (1.154) |
| desk light webkit | **r1 · 0** (1.843) | **r1 · 0** (1.345) |
| desk dark chromium | **r1 · 0** (1.597) | r1 · **3** (1.092) |
| desk dark webkit | **r1 · 0** (1.597) | **r1 · 0** (1.185) |
| phone light chromium | **r2 · 1** (0.906) | **r8 · 10** |
| phone light webkit | r1 · **1** (1.080) | r1 · **1** (1.106) |
| phone dark chromium | **r1 · 0** (1.703) | **r1 · 0** (1.120) |
| phone dark webkit | **r1 · 0** (1.512) | **r1 · 0** (1.030) |

**G2 is GREEN on the desk and SHORT on the phone.** Seven of eight at focus are rank 1; the
eighth (phone light chromium) is **rank 2 at a margin of 0.906**, losing to an 8.33 px mark —
the board's own frame corner, where two rules cross and the inscribed disk beats the ring's
band. At mid-board that cell falls to **rank 8 with 10 rivals**. The band is 1.41× the frame
LINE by construction at every viewport; it is not 1.35× the frame CORNER at 393 dpr3. The gate
as written ("≥ 1.35× the frame line") passes; the gate as intended ("rank 1, 0 rivals, 8 cells")
does not, and the number is 0.906.

Clearance ≥ 0 px is GREEN by a wide margin, for a reason worth recording: the ghost svg is
`viewBox`-padded 15% and drawn `xMidYMid meet`, so the ring already lives **inside** the cell
rect. A 22-unit band never approaches the neighbour.

**What the crop says that the numbers do not** (`frames/ring-light-chromium.png`,
`frames/ring-phone-light.png`). At 1280 the two passes **fuse into one solid band** — the gap
between them is 0.48 px before anti-aliasing — so the eye reads a single heavy rule, not a hand
going round twice. The research warned that 22 units of one stroke "reads as a printed block";
two strokes at this offset read as the same block. The weight is won, the *pencil* is not: for
the second pass to be legible AS a second pass its offset must exceed a stroke width (≥ 14
units), which trades band weight for hand. **That decision is the agglomerator's and this lane
did not take it.**

σ, for MRK (`readings/wobble-chromium.json`, R3's instrument, unchanged): grid **1.443 px**,
frame 1.145, **ring 0.092**, band [0.722, 2.886]. The second seed does **not** move σ — a
chord-residual σ is a property of the wobble amplitude, not of the number of passes, and the
probe samples one path. **MRK's row is untouched by this family, neither cured nor worsened.**

---

## 3 · G3 — the tally: k ticks for k cells, and the mechanism that had to change

`readings/proto-*.json` → `tally.{k1,k3,k20,full}`. Ink runs are connected components of the
trace's own footprint (the pixels that change when `.progress-pose` is hidden), ≥ 6 CSS px.

| cell | k=1 | k=3 | k=20 | ~100% | overhang | tick ink over paper |
|---|---|---|---|---|---|---|
| desk light chromium | 1 | 3 | 20 | 45 → **47** | **1.0 px** | **14.87** |
| desk light webkit | 1 | 3 | 20 | 45 → 45 | 2.0 px | 14.87 |
| desk dark chromium | 1 | 3 | 20 | 48 → 48 | 1.0 px | 11.99 |
| desk dark webkit | 1 | 3 | 20 | 46 → **48** | 2.0 px | 11.99 |
| phone light chromium | 1 | 3 | 20 | 46 → **47** | 0.31 px | 14.87 |
| phone light webkit | 1 | 3 | 20 | 47 → 47 | 0.31 px | 14.87 |
| phone dark chromium | 1 | 3 | 20 | 45 → **47** | 0.31 px | 11.99 |
| phone dark webkit | 1 | 3 | 20 | 48 → 48 | 0.31 px | 11.99 |

**GREEN at k = 1, 3, 20 in all eight cells**, both engines, both viewports. Near 100% the count
runs **+0 to +2** over k: at 45–48 ticks a corner fragments a tick into two components at the
6 px floor. Named, not smoothed. Overhang **0.31–2.0 px** against the gate's ≤ 2 px (HEAD:
6.00 px) — `.progress-pose { scale(0.984) }` takes the `FRAME_Y_PAD 0` overhang down in the same
motion that lifts the ticks off the rule, which is the research's "one primitive, two marks",
measured.

### 3.1 The mechanism the spec named does not survive WebKit

The spec's tally was `stroke-dasharray = "t g" × k + " 0 1000"` on `pathLength="1000"`. Measured
on one page, one path, both engines (`probe/dash-diag.probe.ts`):

| dash on the SAME path, same computed list | chromium | webkit |
|---|---|---|
| the spec's k=3 list | **3 runs** | **12 runs** |
| `100 4000` | 1 | **4** |
| `100 10000` | 1 | **4** |
| `200 3800` | 1 | **4** |
| `400 400` | 5 | **4** |
| `50 100` | 27 | 27 |

The path is ONE subpath (one `M`, one `Z`), 3,965.6 user units long in both engines, and
removing `pathLength` changed nothing. **WebKit restarts the dash phase once per side of the
frame ring**; Chromium runs it once round. Any pattern whose period exceeds the path — which is
exactly what "draw k ticks then stop" is — reads 4× there; a short repeating pattern is
identical in both.

So the ticks are **cut, not dashed**: `tickMarksAlong` (gridPaths) walks the pose's own point
list by arc length and emits k subpaths of 0.57 P each. No dash, no offset, no `pathLength` on
that path — and the counts above are the result. **It also means the SHIPPED fill gauge and the
join ring are suspect on WebKit by the same mechanism** (both are `pathLength="1000"` +
`stroke-dasharray` + `stroke-dashoffset`): the join ring's arrival would draw 1,000 of 3,965
units there. Not measured at HEAD, not this family's row — **handed to MOT-\* / PLR-\* and to the
wave record.**

---

## 4 · G4 — authorship: a clue is printed, your digit is drawn

`HandwrittenGlyph.vue`: `isSolved → 5` (unchanged), `isGiven → 6` (was 5), yours **4.5,
unchanged**. The clue moves, never your hand.

| | rendered stroke, 1280 | rendered stroke, 393 dpr3 |
|---|---|---|
| a clue | **6.888 px** | **3.954 px** |
| your digit | **5.166 px** | **2.964 px** |
| ratio | **1.333 in all 8 cells** | 1.333 |

**GREEN** on the gate's own reading (≥ 1.30, 8 cells) and on the phone floor (2.964 ≥ 1.6 px).
Ink: a clue `rgb(10,10,10)` 19.45:1, your digit `rgb(38,38,38)` **14.87:1** light / 11.99 dark.

The painted cross-check is noisier and is reported as it reads: the chamfer MEDIAN over each
glyph's own footprint gives **1.00–1.67** (desk light 1.00, desk dark 1.64, phone 1.55–1.67) and
the PEAK gives **1.22–1.50**. A peak lands where two strokes cross, which is a property of the
DIGIT — comparing a 7's peak with a 4's is not a stroke-width comparison — and at dpr1 the
median quantises to whole pixels. **The rendered-stroke figure is the one to gate on; the
painted pair corroborates it in 7 of 8 by peak and contradicts it nowhere.**

Arms A (6 / 4.5) and B (5.5 / 4.0) are both banked:
`frames/authorship-armA-{light,dark}.png` and `frames/authorship-armB-light.png` — arm B an
injected override on the same board and the same two cells. The owner picks.

---

## 5 · G4b — the marks seam is pressure now

`.user-marks` graphite at opacity **1**, the engine's `.pencil-marks` graphite at **0.5**
(unchanged). Measured by difference, your corner note against a held peek in the same frame
(`marksSeam`; the K-peek, not the long-press twin):

| cell | your note over paper | the peek over paper | contrast quotient | alpha quotient |
|---|---|---|---|---|
| desk light chromium | 7.56 | 2.66 | **2.84** | 1.75 |
| desk light webkit | 7.56 | 2.63 | **2.88** | 1.79 |
| desk dark chromium | 6.61 | 2.59 | **2.55** | 1.71 |
| desk dark webkit | 6.75 | 2.63 | **2.57** | 1.74 |
| phone light chromium | 12.71 | 4.56 | **2.79** | 1.72 |
| phone light webkit | 12.30 | 4.39 | **2.80** | 1.75 |
| phone dark chromium | 9.90 | 3.83 | **2.58** | 1.73 |
| phone dark webkit | 9.50 | 3.80 | **2.50** | 1.71 |

**GREEN read as the ratio of each mark's contrast over the paper (2.50–2.88 ≥ 1.8, 8 of 8).**
Read as the ratio of ink ALPHA recovered from the painted core it is **1.71–1.79 — under 1.8 in
all eight** — because a one-glyph corner mark is thin enough that anti-aliasing eats its core;
the design's own pressure seam is exactly **2.0** by construction (opacity 1.0 against 0.5). Both
numbers are here so the chair can say which one the gate means.

---

## 6 · G6 — the room: your colour arrives with the second hand

`readings/room-{chromium,webkit}.json` and `probe/room-diag.probe.ts`, a live two-page
`?wire=local` session, **both engines agreeing to the byte**:

| state | your roster row | your cells | a peer's |
|---|---|---|---|
| solo | no roster | **0 bindings** | — |
| in a room, alone | graphite | 0 bindings | — |
| in a room, ≥ 2 live | **`oklch(var(--peer-ink-l) 0.11 0.0deg)`**, swatch `oklch(0.5 0.11 0)` | a cell you write binds **your** ink, and the peer's page paints the SAME ink on it | theirs, unchanged |
| the peer leaves | graphite again | **0 bindings** | row leaves |

**GREEN, and R5's I2 is answered directly**: the cell you wrote reads
`oklch(var(--peer-ink-l) 0.11 0.0deg)` on your page *and* on theirs, while `aria-label` says
"your entry" on yours and names you on theirs. Solo binds **0 cells / 0 rows** — byte-identical,
the R5 constraint 5.

### 6.1 Two findings this row hands back

- **Digits you wrote BEFORE the room stay graphite.** `authorInk` reads `ledger.clock`, and a
  solo write never enters the clock, so on opening a table you get a board where your pre-room
  digits are the pencil and everything you write after is your colour. The frame shows it:
  `frames/room-after-light.png` — three graphite `1`s and one coloured `2`, all yours. A cure
  exists (stamp your existing non-given values into the clock when the table opens) but it is a
  substrate change with wire consequences and **this lane did not take it**.
- **Index 0 is a red.** The peer walk starts at hue 0.0°, and `--color-teacher-red` is
  `crayon-rose` at **14.2° light / 12.2° dark** — 12–14° away, both muted reds at similar
  lightness. At HEAD nobody met index 0 as *their own* ink (your cells bound nothing); under this
  family the first player at the table writes in a colour a reader may take for "wrong". Cheap
  cure: start the walk at 1, or reserve the 340–30° arc. **PAL-\* / PLR-\* territory, named here.**

### 6.2 The bug this lane wrote, and then caught

The first cut of `selfInk` read the non-reactive `ident` before it read `present.value`. On a
solo page the guard short-circuited, the computed collected **no dependency at all**, and it
stayed `{}` for the life of the tab — with `ident` set, `present` holding the peer and the index
minted. The unit test passed (it read the roster only after joining); the live two-page probe
caught it. The cure is the reads' ORDER, the comment says so, and the new unit
(`useSession.test.ts`) reads the roster **before** the join, so the regression cannot come back
quietly.

---

## 7 · The rest of the gate board

| gate | verdict | the number |
|---|---|---|
| **G5 kinship** | rows 1/2/4/5 **GREEN**, row 3 **RED by retirement** | `--color-focus-sketch`, `--color-progress-ink` and `--color-crayon-blue` all resolve to `""` on the live root, both engines, both themes (`tokensDeclared`); `--color-user-ink` is achromatic (C 0.0000 light / 0.0111 dark); the sparkle's inline literals are gone (`sparkleFilter: "none"`). Row 3's assertion NAMES `--color-focus-sketch`, so it now fails on a token that no longer exists — **the instrument needs re-cutting, the product does not**. WebKit's row-3 vacuity guard still fires (0 controls reached by Tab), exactly as at HEAD. |
| **G7 consumers** | **GREEN** | `consumers.mjs` re-run against the worktree: no token with a hex and zero consumers. `grep '196, 181, 253'` **0** · `'#2563eb'` **0** · `'crayon-blue'` in `src/` **0**. One off-token literal remains and is not this family's: `#c4b5fd` at `SvgFilters.vue:168` (solver-ink-2 dark, inside the rainbow gradient). |
| **G8 π** | **GREEN** | `e2e/filter-census.spec.ts` **12/12**, chromium and webkit, both regimes, hovered and at rest, exact match in both directions at **8**. Union area re-derived by the instrument itself: row **45,572 → 44,642**, coarse **6,673 → 5,743** — **−930 px² in both regimes**, which is the 30×30 icon box plus its shadow spread and nothing else. |
| **G9 forced colours + print** | **GREEN** | print: glyph, grid, ghost ring **and the tally** all `rgb(0, 0, 0)`, both engines. forced-colors: the focused cell keeps a **2px solid system outline** (chromium `rgba(5,0,73,0.8)`, webkit `rgba(128,188,254,0.6)`) — the research's regression does not occur, because the second pass is a `<path>` and never an `outline`. |
| **G10 guard** | **HOLDOUT, both engines** | `guard-{chromium,webkit}.json` are both `null`: this lane's probe could not arm the destructive confirm on the click path it tried, exactly as the research reported; r0 reached it in chromium only. **Unmeasured here, declared, not claimed.** |
| **G11 scripts** | **GREEN** | ink-pressure 0 violations (the ladder prints unchanged in all three scopes) · copy-register 0 new (2 admitted, standing) · font-coverage 0 new glyphs. |
| **R6 law probe** | L2/L3/L4/L5/L6 **GREEN** | **L1 is RED and that is the family's own act**: it asserts "the live-filter population is exactly 9" and reads 8. The synthesis said every document quoting 9 is re-cut to 8; `law-probe.mjs` is one of them. R1 also reads RED on a token this family DELETED (its probe greps `--color-focus-sketch` inside `.dark`) — cured by retirement, and the row's subject needs re-pointing. |

One rule the prototype had to bend: `.cell-peer` is
`background: var(--color-pencil-graphite); opacity: 0.06` rather than a `color-mix` at 6%,
because `check-ink-pressure`'s third gate forbids open-coding the graphite ramp outside the
token block and a wash has no rung. Same painted value, one fewer thing to keep in step, gate
green.

---

## 8 · What the patch is

Fourteen files, +441 / −141 (`prototype.diff`). Ten are the spec's; four are its consequences.

| file | what |
|---|---|
| `index.css` | `--color-user-ink` → `var(--color-pencil-graphite)` in `:root` and `.dark`; `--color-focus-sketch`, `--color-progress-ink` (both arms), `--color-crayon-blue` (both arms) and `.crayon-blue` deleted with their ledger comments; the print arm untouched |
| `gameCell.css` | tier 2 → graphite 12 @ 1.0, fill 0.08; `.cell-ghost-retrace` (hidden, shown at tier 2 and tier 2×3 in red); the PRM block gains the selector; `.user-marks` graphite @ 1; `.cell-peer` graphite 6% / 12%; the forced-colors block untouched |
| `gridPaths.ts` | `generateCellRetraceRects` (inset 10, seed +3, reversed) and `tickMarksAlong` (the tally's ticks as cut geometry) |
| `useGameCell.ts` / `DigitCell.vue` | the retrace path, derived per cell from (boardSize, position) through the shared boil LRU — **no new prop on any board** |
| `HandwrittenGlyph.vue` | the fallback → graphite; a clue 5 → 6 |
| `HandDrawnGrid.vue` | the tally: graphite 10 @ 1.0, butt caps, `tickMarksAlong` poses, `.progress-pose { scale(0.984) }`, the 240 ms dashoffset tween deleted, `.join-pose` → `scale(0.968)` |
| `GameBoard.vue` | one new optional prop bound: `:writable="fillable"` — a tally needs the denominator, not just the fraction |
| `useSession.ts` | `selfInk`; `authorInk` includes your cells when it is non-empty; the roster's own row binds it |
| `GameControlPanel.vue` | the sparkle's two drop-shadows and its `transition: all` deleted; the swatch comment re-cut |
| `filterBudget.ts` | the sparkle allowlist row removed; `FILTER_BUDGET_UNION_AREA` re-derived to the measured 44,642 / 5,743 |
| `useSession.test.ts` | one new unit: solo binds nothing, a peer makes your ink arrive, the last leave gives the pencil back — read before the join, which is the regression |
| `DigitCell.test.ts`, `e2e/visual-regression.spec.ts` | the retired wax: a comment, and the crayon-var assertion re-cut to the four with jobs (blue asserted **absent**) |

**Nothing minted:** 0 hexes, 0 timing constants, 0 ramp stops, 0 filters, 0 rendered strings.

---

## 9 · Every gap, as a number or a sentence

1. **The ring is rank 2 at 393 dpr3 light chromium** (margin 0.906) and rank 8 at mid-board
   there. Seven of eight cells are rank 1 with 0 rivals at focus. §2.
2. **The two passes are not legible as two passes at 1280** — they fuse at a 0.48 px gap and
   read as one heavy rule. The weight is won; "the pencil goes round twice" is not. An offset
   above a stroke width would buy it back and spend band weight. §2.
3. **Near 100% the tally counts +0 to +2 over k** (corner fragmentation at the 6 px floor). §3.
4. **The shipped fill gauge and the join ring are suspect on WebKit** by the dash mechanism this
   lane pinned; not measured at HEAD, not cured. §3.1.
5. **The painted authorship ratio is noisy** (median 1.00–1.67) though the rendered stroke ratio
   is exactly 1.333 everywhere. §4.
6. **G4b clears 1.8 on the contrast quotient and not on the alpha quotient** (1.71–1.79). §5.
7. **Digits written before the room stay graphite.** §6.1.
8. **Your ink at index 0 is 12–14° from the teacher's red.** §6.1.
9. **The guard was not armed in either engine** — G10 is a declared holdout, not a pass. §7.
10. **The dark mid-board residue (89–716 px, ≤ 0.029% of the viewport) is not binned to a
    token.** §1.
11. **Two instruments now assert retired subjects** — kinship row 3 and law-probe L1/R1 — and
    must be re-cut in the wave record, which is the spec's own "every 9 becomes an 8". §7.
12. **No 16×16 reading.** Every board number here is a 9×9. The tally's pitch at 16×16 (~150
    writable, 3.8-unit ticks) is arithmetic in the spec and unmeasured here.
13. **The owner's five-second read is not claimed.** Fourteen crops are banked for it.

---

## 10 · How to replay this

    # the worktree's own dev server
    cd .claude/worktrees/wf_e58b4764-0fc-43/web/frontend
    npx vite --host 127.0.0.1 --port 4237 --strictPort

    # the board gates, eight cells (probe/ is this directory's copy; it resolves
    # @playwright/test through a symlink to web/frontend/node_modules, r0's precedent)
    VP=desk  npx playwright test --config pw.config.ts proto-board
    VP=phone npx playwright test --config pw.config.ts proto-board

    # the family rows (kinship, room, guard, print/forced) and the frames
    npx playwright test --config pw.config.ts family-rows
    npx playwright test --config pw.config.ts frames-final

    # π, on the estate's own instrument, against the same server
    npx playwright test --config pw-estate.config.ts filter-census

    # the scripts, in the worktree
    node scripts/check-ink-pressure.mjs && node scripts/check-copy-register.mjs \
      && node scripts/check-font-coverage.mjs

Frames (14, **148 KB** for the set, largest 22 KB): `ring-{light,dark}-{chromium,webkit}.png`
(244×244, the selected cell and its eight neighbours, for the five-second read beside the
research's `ring-control-*`) · `ring-phone-{light,dark}.png` (393 dpr3, the clearance row) ·
`tally-k3-light.png` and `tally-full-light.png` (300×44, the board's top-left) ·
`authorship-armA-{light,dark}.png` + `authorship-armB-light.png` ·
`room-{before,after}-light.png` (the seam §6.1 names) · `gallery-light.png` (the picker with the
fourth crayon retired — `--color-crayon-blue` reads `""` and the 13 class hits paint nothing).

One provenance note: r0's instruments carry ABSOLUTE `OUT` paths. Every copy under `probe/` here
was redirected to this lane's `readings/` **before** its first run, so no r0 or research census
was overwritten; `consumers.mjs` and `law-probe.mjs` were additionally re-pointed at the
worktree's `src/`, so they measure the prototype and not the main tree.
