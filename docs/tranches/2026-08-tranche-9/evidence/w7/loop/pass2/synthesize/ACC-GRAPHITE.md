# ACC-GRAPHITE — graphite for state · pass-2 SYNTHESIS (the spec)

T9-W7 §3 accent family · §4 fill meter · §12 multiplayer chrome · M07. Synthesizer: Fable 5.1.
Inputs: `../research/ACC-GRAPHITE/README.md` (pass 2), `../../pass1/synthesize/ACC-GRAPHITE.md`
and `../../pass1/critique/ACC-GRAPHITE.md`, `../../pass1/prototype/ACC-GRAPHITE/prototype.diff`
(14 files, +441/−141), the r0 censuses (R2, R3, R6), the owner's frames `marks/m01`, `m09`, and
the chair's rulings (`../CHAIR-RULINGS.md`, read first). The frontend-design skill was invoked;
§0 is its two-pass method. Read-only on the product; the spec is the only write. U-10: nothing
here closes a mark.

Chair compliance up front: the focus-ring token is READ, never written (§6.1); the tally does
not touch the pads and FRAME_PAD ships at HEAD's `12 / 0` (§6.2); `.cell-because` is untouched
(§6.11); `filterBudget` moves 9 → 8 and this spec proposes the L1 / R6 re-cut as a diff in the
same breath (§7, `instruments/law-probe-L1.diff`); one crop was spent in research, three remain.

---

## 0 · Plan, then the review against the tells

**Subject.** A pencil-and-paper sudoku. The family's sentence: colour means who or what made
this mark, and nothing else. Every state is what a pencil can do without changing colour: press
harder, go round again, make a tick.

**Tokens.** No new hex. One new name, and it is a ground, not an ink.

| role | token | light | dark |
|---|---|---|---|
| the pencil (state, your solo hand, the ring, the tally) | `--color-pencil-graphite` → `--grid-line-color` | `hsl(0 0% 15%)` `#262626` | `hsl(48 10% 80%)` `#d1cfc7` |
| the print (a clue) | `--color-foreground` | `#0a0a0a` | `rgb(237,236,233)` |
| the two ink rungs (unchanged) | `--ink-press-rule` 55% · `--ink-press-quiet` 68% | 3.53 · 5.23 | 4.36 · 6.06 |
| **the unit ground (new)** | `--ground-wash-unit` = `color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 6%, transparent)` · 12% under `prefers-contrast: more` | | |
| a person's hand, when more than one is here | `oklch(var(--peer-ink-l) 0.11 h)` | L 0.5 | L 0.8 |
| RETIRED | `--color-progress-ink` `#8b5cf6`/`#7c3aed`, `--color-crayon-blue` `#4a90d9`/`#6aabeb` + `.crayon-blue`, `rgba(196,181,253,…)` ×2, the `#2563eb` fallback. `--color-focus-sketch` is NOT retired here: §6 owns it (chair §6.1). | | |

**Type.** Unchanged faces, unchanged strings. The authorship seam is WEIGHT: a clue prints at 6
units, your digit draws at 4.5. Zero rendered-string changes, zero woff2 re-cut.

**Layout.** Unchanged. The family draws on geometry that exists: the cell's ghost svg, the frame
ring, the roster row.

**Principles.** (1) State is a pencil's behaviour, never a tint. (2) Weight is a RATIO to the
frame line and gated as one. (3) A gauge must have a form no rule has. (4) Colour arriving on
your own digits means someone else is here. (5) Delete before re-pointing.

**The review.** The generic cure for this brief is "swap the blues for greys": the charter's own
G1 that the research killed at rank 49. Three defaults in the plan were changed in pass 1
(heavier single stroke → two passes; offset retrace meter → tally; grey glow → deletion). Pass 2
changes three more, each because a number said the pass-1 form was a default in disguise:

- *"Twice round" as a visible second ring* was the tell of over-explaining a mechanism. The two
  passes fuse at every inset under 16, and splitting them costs 45% of the peak the rank gate
  reads. So the sentence changes and the mechanism stays: **one heavy band whose two edges
  wander independently**, gated on edge correlation, which a single stroke cannot fake (§1).
- *One tick per cell* was a rule stated for a 9×9 and never priced. At 16×16 it is a square
  blob (aspect 1.07–1.50); at 4×4 a dashed rule (aspect 22). **Law A**: one mark, 45 units of
  ink, at every board size; the gauge counts in groups where it must (§4).
- *`scale(0.984)` for the meter* was a borrowed number that does not clear the rule (−3 px). The
  meter takes `.join-pose`'s **0.968**, and the join ring returns to its shipped 0.984 — one
  fewer change than pass 1 (§4).

Nothing here is a tinted near-black (the foreground is the estate's), a label above a block, an
eyebrow, or ambient motion. One memorable thing per surface: BOARD, the pressed-twice band;
FRAME, the tally; ROOM, your digits taking colour when a second hand arrives. Everything else
is quiet.

---

## 1 · The section finding every colour family carries: the dash law is BOUNDED, not withdrawn

Three lanes measured the same law and two of them contradicted the third. The readings
reconcile once the one variable nobody varied on purpose is named:

| lane · subject | how `stroke-dasharray` was declared | chromium share | webkit share |
|---|---|---|---|
| ACC-GRAPHITE E, the real ring, `1000 1000` @ offset 750 under `pathLength="1000"` | **CSS** (`el.style.strokeDasharray`; computes to px) | 0.249 | 0.251 |
| ACC-FIVE §0, the SHIPPED gauge, p = 0.25 (offset 750) | **presentation attribute** (`stroke-dasharray="1000 1000"`, `HandDrawnGrid.vue:477`) | 0.228 | **0.921** |
| ACC-SIX §2, pose-0 `d` on a bare page, `1000 1000` @ 750 | **presentation attribute** | 0.240 | **0.893** |

Same path family, same `pathLength`, same period-longer-than-path; the only thing that moves
between the engine-identical rows and the 4× rows is **where the dash is declared**. The law as
pass 2 states it: *under `pathLength`, WebKit paints a dash declared as a presentation attribute
with the normalisation applied once too often (ACC-SIX's fit, factor `totalLength/pathLength`
= 3.966 here); a dash declared in CSS is engine-identical.* "Period > path" was the symptom's
shape, not its cause; the dpr hypothesis (research §12) is superseded by this and is closed by
one arm of the same probe.

Population at HEAD, by grep over `src/`: `HandDrawnGrid.vue:476-478` (fill gauge, attribute),
`:509-511` (join ring, attribute), **`DifficultyTally.vue:230-232`** (`pathLength="100"` +
`stroke-dasharray="100 100"`, attribute — the controls card's difficulty tally, the SAME shape,
handed to §10's leader, not claimed here). CSS-declared sites — `index.css:766` (`pencil-draw-on`),
`gameCell.css:235/:251` (the ghost ring's `pathLength="1"` + `stroke-dasharray: 1`) — are clean by
ACC-GRAPHITE's A readings (identical at five offsets, both engines).

This family's meter is immune by construction (no dash at all — cut subpaths), which is now the
argument for the cut, on top of exactness. The gate is the section's, written once (§9 G0), and
the handoff to MOT-\*/PLR-\*/NOTE-\*/W8 is **re-upgraded from "unreproduced" to "bounded and
reproduced on the shipped artifact"** with the population above.

---

## 2 · The ring — one heavy band, two wandering edges

Tier 2 (`:has(input:focus-visible)`) keeps both passes at `RETRACE_INSET = 10` exactly as pass 1
shipped them (`gridPaths.ts:75/:88/:127` in the pass-1 diff; `.cell-ghost-retrace` at
`gameCell.css:252`, node `DigitCell.vue:425`). What changes is the CLAIM and the GATE.

| | outer pass `.cell-ghost-path` | inner pass `.cell-ghost-retrace` |
|---|---|---|
| geometry | `wobbleRect(x, y, s, s)` seed `42+500+pos·7` | `wobbleRect(x+10, y+10, s−20, s−20)` seed `+3`, reversed (`reverseLinearPath`) |
| stroke / fill | graphite 12 u @ 1.0 / fill-opacity 0.08 | graphite 12 u @ 1.0 / none |
| draw-on | `ghost-draw-on 180ms var(--ease-ghostDraw) backwards`, CSS `stroke-dasharray: 1` + `pathLength="1"` (the CLEAN form of the dash, §1) | same, the reversed path so the second pass runs the other way |
| other tiers | as shipped (hover 5 @ 0.65 · peer 4 @ 0.55 their ink · conflict 9 @ 1 red · focus+conflict 12+12 red) | `display: none` outside tier 2 and 2×3 |

**The sentence, re-cut.** Not "the pencil goes round twice" (nothing separates at inset 10 and
nothing should). It is *a pencil pressed twice over the same line: one heavy band, 22 units,
whose inner and outer edges wander independently*. A single 22-unit stroke has edges that are
the same curve offset by the width (correlation 1.000 by construction); the pair measures 0.269
at 9×9, −0.126 at 4×4, 0.571 at 16×16 (`readings/geom.json` → `retrace`; `cellSegments` drops to
2 at boardSize ≥ 16, so the seeds start to agree — stated, not hidden).

**Weight as a ratio, unchanged.** Fused peak = inset + 12 = 22 u = 1.41× the frame line;
10.76 px at 1280, 6.18 at 393 dpr3. Rank 1 of N², 0 rivals within 10%, band ≥ 1.35× the frame.
The research's re-seat table shows inset 16 would halve this; the spec does not take it.

**Why keep the mechanism rather than delete ~60 LOC.** The deletion keeps the peak and loses
the one property that answers §5's wobble law for the most-watched marker (ring σ 0.00 → a
second seed). A kept mechanism must be gated on the thing it buys, so G2b (edge correlation
< 0.35 at 9×9, born-RED against a single stroke) is the price of keeping it. The agglomerator's
fallback, if it will not carry a geometry-only gate: delete `generateCellRetraceRects`,
`reverseLinearPath`, `.cell-ghost-retrace` and its node, and make the outer pass 22 units.

Ratios unchanged: ring over card 14.87 light / 11.99 dark; the four desk cells at focus 12.05 /
10.79 / 13.27 / 10.79 over the board's own paper. Forced colours: the retrace is a `<path>`,
never an `outline`, so `gameCell.css:352-357`'s `Highlight` ring stands. PRM: both passes land
drawn (`animation: none; stroke-dashoffset: 0`).

---

## 3 · The unit wash — a ground token, not a ladder rung

`gameCell.css:123-131` today: `background: color-mix(crayon-blue 7%)` (HEAD); pass 1 moved it to
`graphite; opacity: 0.06`, which mints 20 stacking contexts on a 9×9 selection (80% of the page's
25 sub-unit-opacity nodes, `readings/IJKL-*.json`). The ladder cannot take it (`check-ink-pressure`
`gateFloors` wants ≥3 / ≥4.5 and `gateMonotone` wants strictly increasing; a 6% wash is a
GROUND). `gateOwnership` (`:338`) bans open-coded graphite `color-mix` outside `assets/index.css`,
which is exactly the mechanism:

```css
/* index.css, in the §INK PRESSURE block, AFTER the two rungs, OUTSIDE the LADDER:
   ground washes are tinted paper, never ink. The ladder governs marks; this governs what a
   mark sits on (MRK-WASH's one-ground rank: selection > peer cursor > hint laminate > unit). */
--ground-wash-unit: color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 6%, transparent);
@media (prefers-contrast: more) { :root { --ground-wash-unit: color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 12%, transparent); } }
```

```css
/* gameCell.css */
.cell-peer { background: var(--ground-wash-unit); }   /* opacity 1; the 0.06 / 0.12 rules die */
```

Same painted value, stacking contexts 20 → 0, ink-pressure's three gates green (the token is
not in `LADDER`, so floors/monotone never see it; ownership sees it in the one file it allows).
The wash sits UNDER MRK-WASH's rank and never composes with the selection body: the entered
digit's light headroom is 0.58 of a ratio and HEAD's 0.08 body already spends 0.50; the 6% wash
is first-order ~0.375 of it, so composition would drop the digit under 4.5. The one-ground
`v-if` is §6's (chair §6.11 gate 3); this family's wash only claims a slot in that rank.

`--color-crayon-blue` then has no consumer (wash re-inked, ring fallback §6's to re-point in the
same diff, `.user-marks` graphite) and retires with `.crayon-blue` after the 13-class-hit census
(`selectors.ts`/prose, none paints). Four crayons remain with jobs: green/orange/rose
(difficulty), gold (done).

---

## 4 · The meter — a tally of one mark, at every board size

**Form.** Ticks around the inside of the frame line, graphite at full pressure, cut from the
frame-ring pose by arc length (`tickMarksAlong(d, k, slots, duty)`, `gridPaths.ts:159` in the
pass-1 diff; one `M` per tick). The `dealt ⊪` idiom, wrapped round the board.

**Law A replaces the duty constant.** `tickMarksAlong` keeps its signature; the CALLER
(`HandDrawnGrid.vue:114/:143` in the diff) changes:

```
INK   = 45      // units of ink per tick, every board — replaces duty 0.57
GAP   = 25      // units of paper between ticks
slots = min(writable, floor(perimeter / (INK + GAP)))   // 3959.4 / 70 → 56
m     = ceil(writable / slots)                          // cells per tick
k     = ceil(written / m)                               // ticks drawn
```

| board | writable (measured) | slots | m | ticks at full | tick ink × stroke, desk (× 0.968) | phone 393 dpr3 |
|---|---|---|---|---|---|---|
| 4×4 | 10–12 | 10–12 | 1 | 10–12 | 27.7 × 6.2 px, aspect 4.5 | 15.9 × 3.5 px |
| 9×9 | 57–58 | 56 | 2 (the last two cells share) | 29 | same mark | same mark |
| 16×16 | 161–165 | 56 | 3 | 54–55 | same mark | same mark |

Every figure is derived at the 0.968 scale (rendered px/unit 0.636 × 0.968 = 0.616 desk;
0.365 × 0.968 = 0.353 phone). The mark is the same mark on every board; what a tick MEANS
changes (one cell at 4×4, three at 16×16) and the spoken layer already carries the truth
(`aria-valuetext="board N% filled"`, `HandDrawnGrid.vue:306`, unchanged — no rendered string
moves, so `check-font-coverage` sees nothing). No visible label, no first-run whisper: the
mark teaches itself in three keystrokes and the owner's re-look is the gate on that (U-10).
ACC-SIX's objection to the word `filled` (the FILL button's word) is a section row for the
agglomerator, not this family's: the string is W3's and this family does not touch strings.

**Off the rule.** `.progress-pose { transform: scale(0.968); transform-origin: 50% 50% }` — the
constant `.join-pose` already carries (`HandDrawnGrid.vue:611`); the join ring goes BACK to its
shipped 0.984, byte-identical to HEAD. Measured: 0.984 leaves the ticks 2–4 px INTO the rule
across all 220 sampled columns; 0.968 buys 16 units = 10.2 px inward, clearance +2.1 px, both
engines. The tally sits inside the join ring; the two are distinct by form (ticks vs a
continuous stroke), colour (graphite vs the peer's ink) and offset.

**No dash, no tween.** Cut subpaths are immune to §1 by construction; `stroke-dasharray` lists
are not animatable, so the meter is PRM-identical without an arm. The 240 ms dashoffset tween at
`HandDrawnGrid.vue:589` dies with the dashoffset; the 500 ms `opacity` bow-out stays. At 0%
nothing renders (as HEAD). At the win `.solve-success` fades the tally (500 ms) and gold owns
the frame (unchanged).

**`writable` is required.** `HandDrawnGrid.vue:114`'s `?? 51` dies (measured 57–58 / 161–165);
the prop is `required: true`, one caller (`GameBoard.vue:358`, `fillable`).

**Ink.** Graphite 10 u @ 1.0, `stroke-linecap="butt"`; the comment at `:496-499` re-cut to the
generator's own pitch (19.8 u / 11.09 px at 16×16 under one-per-cell, which Law A retires).
Ratio over the paper it sits on: 14.87 light / 11.99 dark (off-rule rows).

---

## 5 · Authorship — printed and drawn, and the deck's declared delta

`HandwrittenGlyph.vue:88-89`: `isSolved → 5`, `isGiven → 6`, yours 4.5 (HEAD 5/5/4.5). The clue
moves, not your hand: a clue came printed on the sheet. Seam 1.33× weight + 1.19:1 value.
The fallback `var(--color-user-ink, #2563eb)` becomes `var(--color-user-ink)` — the token is
declared in both themes (`index.css:151/:372`), so the fallback is dead and dies rather than
moves.

**The deck moves with the board and the golden cannot see it.** `PosterBoard.vue:196` passes
`:is-given`, so every poster face's clues ride 5 → 6: +479 ink px, +3.89% ink, +3.92% mass
(webkit +3.95%), 0.55 px of stroke on a 21.94-px glyph — **0.52% of the crop, under
`maxDiffPixelRatio` 0.02**. Declared as a DELTA in the wave record with those before/after
numbers (`readings/deck-delta-*.json`); the four board goldens are re-minted only after the
FRAME_PAD row settles (chair §6.2), darwin off a built dist, linux off the runner artifact.
T8-R13 still == board survives (board and deck move together).

Spoken layer unchanged (`given clue 5` / `your entry 1` / `<slug>'s entry 7`).

---

## 6 · The room — colour on your hand means someone else is here (F1, with PLR-SELF)

Your digits, your roster row and (for §11 to inherit) your head-left mark are graphite while
you are the only hand on the board, and take YOUR room ink the moment the roster holds a second
live player. Solo binds 0 cells and 0 rows (R5 constraint 5).

**Substrate, one commit with the tokens** (`useSession.ts`):
- `inkIndex` becomes `ref<Record<string, number>>({})` (`:369`; `.value` at `:532/:533/:554/
  :712/:880` and inside `selfInk`). Named failure at HEAD's `let`: you join, a peer arrives,
  `selfInk` mints `inkFor(0)`; the epoch holder publishes a board whose `k` puts you at 3; every
  other page repaints you `inkFor(3)` and yours keeps `inkFor(0)`.
- `selfInk = computed(() => players.length > 1 ? ident.inkFor(inkIndex.value[selfId.value]) : {})`;
  `authorInk` (`:402-411`) stops skipping `selfId` when `selfInk` is non-empty; the roster row
  binds `selfInk`; `.player-swatch` STAYS until its instruments are re-pointed in the same diff
  (chair §6.8).
- The unit ADOPTS AFTER THE JOIN: join → peer present → `selfInk` = inkFor(0) → `adoptInk({me: 3})`
  → `selfInk` moves. Born-RED against the `let`. Pass 1's unit (roster before join) stays as a
  second, different regression.
- `:315`'s "EMPTY for you, who keep the incumbent blue" is re-cut in the same diff.

**Pre-room digits, disposition (b), stated as design.** `authorInk` iterates `ledger.clock`
and a solo write never enters it: *what you wrote alone you wrote as the pencil; the room colours
only what the room saw.* One sentence in the product's voice, no wire change. If the owner
wants earlier digits recoloured at room-open that is a substrate row with wire consequences
(disposition (a)), booked, not taken.

**Index 0 is the teacher's red (hue 0.0° vs rose 14.2 / 12.2) and index 8 lands at 20°.** This
lane mints no reserved-arc law: PAL-TIN owns it (its pass-2 tin puts no player at h ≈ 0 and
clears both accent worlds by ΔE ≥ 0.09 at the moved bands). This family takes whatever lands
there; a 340–30° reservation would remove indices 0 and 8 from the first ten if the walk stays.

Motion: none of its own. The swap is instant on the join's beat 0; the join ring (1180 ms, peer
ink, `.join-pose` at its shipped 0.984) is the motion. PRM-identical.

---

## 7 · The guard — achromatic by ruling, and G10 at the pointer that has it

No change to the ribbon: `--color-foreground` words, the destructive verb at `strokeWidth 2.5`
on the drawn box (which strokes `currentColor`, so it stays graphite), `keep` at 2. The 8%
ground (`GameGallery.vue:1459-1461`) is the mark of arming and stays. The confirm is told by
weight and words; it takes no colour because nobody made this mark.

`onClear` arms only at `isCoarse && isDirty` (`GameControlPanel.vue:552-553`; `:548` says so):
the confirm does not exist at a fine pointer. G10 runs at 393 dpr3 with `hasTouch` on a DIRTY
board in both engines, and the fine-pointer holdout is written into the gate as the product's
own answer, not as a webkit apology.

---

## 8 · What dies, and the one number that moves

| dies | where (HEAD lines) |
|---|---|
| `--color-progress-ink` ×2 + the "SIXTH crayon" ledger comment | `index.css:267-278`, `:403-407` |
| `--color-crayon-blue` ×2 + `.crayon-blue` + its comment | `index.css:173`, `:381`, `:474` |
| `rgba(196,181,253,0.3/0.6)` drop-shadows + `transition: all` | `GameControlPanel.vue:2081`, `:2087` |
| the `#2563eb` fallback | `HandwrittenGlyph.vue:85` |
| the 240 ms dashoffset tween | `HandDrawnGrid.vue:589` |
| `.cell-peer`'s crayon-blue 7% / 13% (HEAD) and pass 1's `opacity: 0.06 / 0.12` | `gameCell.css:123-131` |
| `writable ?? 51` | pass-1 diff, `HandDrawnGrid.vue:114` |
| the sparkle's allowlist row | `filterBudget.ts:157-161` |
| pass 1's `.join-pose` move to 0.968 | reverted — the join ring is HEAD's again |

**`filterBudget` goes 9 → 8**; `FILTER_BUDGET_UNION_AREA.row` 45,572 → 44,672 (−900, the
sparkle's box, measured on the dist by ACC-SIX), `.coarse` re-derived on the same run. R6 law
9 (`R6-census.md:86`), §3.4 (`:227`) and `law-probe.mjs` L1 (`:40-45`) are stale by this act:
the re-cut is proposed at `instruments/law-probe-L1.diff` (this dir) and the r0 rows are reported
MOVED, never edited. R1's re-point (`--color-focus-sketch` in `.dark`) is §6's, co-ordinated with
MRK-LIVE, not written here. Fallback if the chair refuses the count: the research's
`drop-shadow(0 0 2px color-mix(in srgb, var(--color-pencil-graphite) 30%, transparent))` keeps 9;
the spec prefers the deletion (principle 5) and says so once.

Nothing minted: 0 hexes, 0 timing constants, 0 ramp stops, 0 filters, 0 rendered strings; one
ground token.

---

## 9 · Born-RED gates (written before the cure; HEAD reading stated)

| id | asserts | HEAD |
|---|---|---|
| **G0 dash bound** (section) | one bare page, pose-0 `d`, `pathLength="1000"`, `1000 1000` @ 750, FOUR arms (dasharray attr / CSS × dashoffset attr / CSS) × chromium + webkit × dpr1 + dpr3: painted share within 2 points across engines in every arm | **RED**: the attr-dasharray arm reads 0.921 webkit vs 0.228 chromium (ACC-FIVE), and that arm is `HandDrawnGrid.vue:477` |
| G1 census | chromatic px rest = focused = mid-board (±0.1% viewport), 8 cells; dark residue binned by 10° and each bin named (r0 `hue-census.probe.ts` COPIED, `OUT` re-pointed) | RED: +27% desk / +152% phone |
| G2 ring weight | peak thickness rank 1 of N², 0 rivals within 10%, band ≥ 1.35× frame, at focus and mid-board, 8 cells; clearance to the neighbour's PAINTED band ≥ 0 at 393 dpr3 | RED: 0.449×, rank 3–49 |
| **G2b edge correlation** | radial deviation of the inner pass vs the outer read backwards, 9×9: correlation < 0.35 (unit-level, on the generators) | RED against a single stroke: 1.000; the pair reads 0.269 |
| G3 tally form | subpaths == `min(ceil(written/m), slots)` at k = 1, 3, 20, full, on 4×4 / 9×9 / 16×16, both engines; tick aspect 4.5 ± 0.3 at every board; tick-to-rule clearance ≥ +1.5 px over ≥ 200 sampled columns; painted-runs instrument floor set by tick LENGTH (≥ 12 px), never a 6-px component floor | RED: no tally (HEAD); pass 1 −3 px clearance, 16×16 aspect 1.07–1.50 |
| G4 authorship | clue / entry rendered thickness ≥ 1.30 in 8 cells; entry ≥ 1.6 px at 393 dpr3; **deck DELTA declared**: five faces +3.9% ± 0.3 ink both engines, and the wave record carries the number | RED: 1.11; undeclared |
| G5 kinship | R2 rows 1/2/4 GREEN with `--color-progress-ink` / `--color-crayon-blue` UNDEFINED on the live root; row 3 subject-count guard standing; the focus-sketch row is §6's and reported beside | RED 4/1 |
| G6 self-ink | R5 I2 both engines; **adopt-after-join unit**: `adoptInk({me: 3})` after a peer is present moves `selfInk` | RED at the `let` |
| G7 consumers | `consumers.mjs` (copied, `OUT` re-pointed): no hex token with zero consumers; grep `196, 181, 253` / `#2563eb` / `crayon-blue` in `src/` = 0 | RED |
| G8 π | `filterBudget` exact 8 both directions, both engines, both regimes, hovered and at rest, on a BUILT dist inside the worktree; union ≤ HEAD − 900 ± 2%; L1 re-cut in the same diff | RED if the row is left in; L1 RED until re-cut |
| **G-WASH** | on a 9×9 selection: elements with 0 < opacity < 1 on the board = 0 from `.cell-peer`; painted wash byte-identical to graphite@6% over card; `check-ink-pressure` 3 gates green with the token in `index.css` and NOT in `LADDER` | RED at pass 1 (20 nodes) |
| G9 forced colours / print | focused cell's `outline-color` is `Highlight` (chromium), the retrace paints no outline; print: glyph, grid, ring, tally `rgb(0,0,0)` | GREEN, regression guard |
| G10 guard | armed ribbon chromatic px = 0, ARMED at 393 dpr3 `hasTouch` on a dirty board, both engines; fine-pointer: no armed state exists (asserted) | GREEN chromium; webkit unmeasured until run at coarse |
| G11 scripts | `check-ink-pressure` green (three scopes), `check-copy-register` 0 new, `check-font-coverage` 0 new glyphs, `lint:motion` clean | GREEN, must stay |

---

## 10 · Prototype brief (pass 2 → PROTOTYPE)

**Build.** Fresh `git worktree` under the scratchpad; replay
`pass1/prototype/ACC-GRAPHITE/prototype.diff` (never edit the pass-1 worktree), then the pass-2
deltas in this order: `index.css` (ground token; the three retirements) → `gameCell.css`
(`.cell-peer` → token, opacity rules die) → `HandDrawnGrid.vue` (`.progress-pose` 0.968,
`.join-pose` back to 0.984, Law A caller, `writable` required, comment re-cut) →
`GameBoard.vue` (pass `writable`) → `useSession.ts` (+ test: adopt-after-join) →
`HandwrittenGlyph.vue` (fallback dies) → `GameControlPanel.vue` (glow dies) →
`filterBudget.ts` (row dies, union re-derived) → `instruments/law-probe-L1.diff` applied to a
COPY of `r0/r6-idiom-history/law-probe.mjs` in the prototype dir. Dev server: two-line scratch
vite config (`{ ...base, cacheDir: '<worktree>/.vite-cache' }`), `--host 127.0.0.1 --port 4235
--strictPort` (next free in 4230–4249 if taken), scratch Playwright config (no `webServer`,
`baseURL` :4235), chromium + webkit, 1280×800 and 393×699 dpr3, light + dark. Build the dist
INSIDE the worktree for G8 (check W8's flight first; never `npm run build` in the main tree).
Kill the server; verify the port free; remove the worktree.

**Measurements that mean success** (numbers first): G0 four arms × two engines × two dprs, the
attr arm RED at HEAD and every arm within 2 points after the cure is applied to the fill gauge
(this family's own meter has no dash — the G0 run is the section's instrument, banked here once);
G2 rank 1 / 0 rivals in 8/8 at focus, ≥ 7/8 mid-board, band 1.35–1.45×; G2b 0.269 ± 0.02 on
the generators (unit test); G3 subpath counts exact on three boards at four k, aspect 4.5 ± 0.3,
clearance ≥ +1.5 px median over 220 columns; G4 ≥ 1.30 in 8 cells, deck +3.9% ± 0.3 both
engines; G6 I2 GREEN both engines + the adopt unit; G8 exactly 8, union 44,672 ± 2%; G-WASH 0
sub-unit nodes; r0 instruments re-run from COPIES: `hue-census.probe.ts` (G1),
`accent-kinship.probe.ts` (G5), R5 `instruments.spec.ts` I2 (G6), R3 `wobble.probe.ts` (report σ
for the two-seed ring; MRK's number, handed across), `consumers.mjs` (G7), `law-probe.mjs` with
L1 re-cut (L1/L4/L5/L6), the three `check-*.mjs` and `lint:motion` bare (never piped).

**Crops** (three remain of four; ≤ 150 KB each, cited): (1) the board's top strip 300×44 at
scale 0.968, light chromium, k = 3 on a page that wrote NOTHING else — paper between tick and
rule; (2) the same strip on a 16×16 at k = 24 under Law A (eight ticks, one mark); (3) a focused
cell + 8 neighbours at 393 dpr3 dark — the band's clearance to the neighbour's painted rule.
Anything short is reported as the number, not smoothed.

---

## 11 · Couplings (stated, not resolved) and what the owner disposes

- **F1**: with PLR-SELF on "colour on your own hand means someone else is here". PAL-TIN's tin
  answers the index-0 collision by construction; this family clears its palette against FOUR
  crayons plus graphite.
- **§6 (MRK-LIVE)** owns the focus-ring token. This palette survives on every candidate in
  MRK-LIVE's table (A one value `#3a7bc4`, B/C dark alias `#6aabeb`) because no state this family
  paints reads it: the ring is graphite at opacity 1. The `gameCell.css:246/:248` fallback to
  `crayon-blue` must be re-pointed by §6 in the same diff this family retires the crayon, or the
  deletion lands silently on nothing.
- **FRAME_PAD** (chair §6.2): not touched; the meter's scale is a transform on the pose group,
  not a pad.
- **`.cell-because`** (chair §6.11): not touched; the ground-token idiom is offered to the
  laminate's body through MRK-LIVE.
- **§10 (CTRL-\*)**: `DifficultyTally.vue:230-232` is the third site of §1's bounded law, on the
  controls card. Handed with the mechanism and the cure shape (cut, or CSS-declared dash).
- **ACC-FIVE / ACC-SIX**: incompatible by centre; not merged here. Both take §1 verbatim.
- **W3**: no new live region, no new string.
- **Owner (U-10)**: whether one heavy band reads as "your pencil is here" (crop 3); whether a
  tick standing for three cells on a 16×16 is honest without a whisper; the deck's clue weight.
