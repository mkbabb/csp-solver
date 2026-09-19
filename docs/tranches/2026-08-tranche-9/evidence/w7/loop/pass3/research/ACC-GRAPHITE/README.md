# ACC-GRAPHITE — pass-3 RESEARCH

Researcher: Opus 5, 2026-09-18. Read in order: `pass3/CHAIR-RULINGS.md`, `pass2/charters/ACC-GRAPHITE.md`,
`pass2/critique/ACC-GRAPHITE.md`, `pass2/synthesize/ACC-GRAPHITE.md`, `pass2/prototype/ACC-GRAPHITE/README.md`,
`registry-v2.md` §2.6/§6.11, the wave (`waves/T9-W7-design.md` §3/§4/§12), `design-marks-2026-08-10.md` (M07),
and r0's R2/R6/R7.

Everything below is measured on **MAIN at HEAD `74a2b5d9`** — the fold, not pass 2's `a8fee1f5` base.
Read-only on the product: two probes, one dev server on **:4235** (private `cacheDir` in the scratchpad,
`--strictPort`), killed before this returns; **4235 verified refused**, and 4236/4249 left alone (other lanes').
Zero crops spent — four remain for the prototyper, and §1 is the reason none was needed.

Readings: `readings/segments-head.json`, `readings/denominators-{chromium,webkit}-{desk,phone}.json`,
`readings/band-{engine}-{rig}-{theme}.json` (8 arms), `readings/arithmetic.json`.
Instruments: `probe/` (run) and `instruments/` (proposed, unrun).

---

## 1 · The headline: the band dispute is a UNIT-SPACE error, and the spec was right

Three numbers have been claimed for one band — 10.76 px declared, 15.0 px by the prototype's diff
instrument, 16.0 px by the critic's raw strip — and the critique concluded "the mark is 15–16 px where
10.76 was declared" and "1.41× is arithmetic, never a measurement". **Both instruments were converting
the ring's width with the wrong scale.** The board and the ring are drawn in two different viewBoxes.

Measured at HEAD, both engines, both rigs, identical to five places
(`readings/denominators-*.json`):

| space | viewBox | px/unit desk 1280×800 | px/unit phone 393×699 dpr3 |
|---|---|---|---|
| the BOARD (`svg.hand-drawn-grid`) | 1000 | **0.63600** | **0.36500** |
| the CELL ghost (`.cell-ghost-path`'s own `<svg>`) | 144.444 | **0.48927** | **0.28082** |

The board's rules are declared in board units, read off the live DOM: frame-line **12**,
subgrid-line **8**, cell-line **5**. The ghost ring is declared in ghost units: HEAD's tier-2
focus ring computes `stroke-width: 7px` in its own user space, `stroke-opacity: 0.9`,
`stroke: rgb(58,123,196)` = `--color-focus-sketch`, `fill` the same at `fill-opacity: 0.08`,
`stroke-linejoin: round`, `stroke-dasharray: 1px` under `pathLength="1"`.

So:

```
22 ghost units x 0.48927 = 10.764 px   <- the spec's 10.76. CORRECT.
22 BOARD units x 0.63600 = 13.992 px   <- what both instruments priced, +~1 px skirt = 15.0 / 16.0
frame line 12 board u    =  7.632 px
                 ratio  =  10.764 / 7.632 = 1.4104   <- the spec's 1.41. CORRECT.
```

`readings/arithmetic.json → ratioCandidates.overFrameLine = 1.410`. The critique's objection
("22/12 = 1.83, not 1.41") divides a ghost-unit numerator by a board-unit denominator; the spec's
sentence converted both to px first and is the honest one. The prototype's own line gives the error
away: *"the frame line (12 u = 7.63 px desk)"* is right for the frame and was then reused for the ring,
where 12 units is **5.871 px**, not 7.63.

**The antialias skirt, measured so it stops being the residual everything hides in.** Ink-run widths
over every row of the board raster, against the declared widths above (`readings/band-*.json`):

| rule | declared px desk | dominant painted modes | skirt |
|---|---|---|---|
| cell-line 5 board u | 3.180 | 3 / 4 | +0.8 |
| subgrid-line 8 board u | 5.088 | 5 / 6 | +0.9 |
| frame-line 12 board u | 7.632 | 8 / 9 | +0.4 … +1.4 |
| HEAD focus ring 7 ghost u | 3.425 | 3 / 4 | +0.6 |

At phone dpr3 the skirt collapses to +0.2…+0.6 CSS px (modes 2 / 2.5 / 3 / 3.5 / 4.5 / 5 against
declared 1.825 / 2.92 / 4.38 / 1.966). Both engines agree; chromium and webkit differ nowhere in this
table.

**What follows for the spec.** Restate principle (2) with its denominator and its space named: *the
band is 22 CELL units = 10.76 px at 1280 and 6.18 px at 393 dpr3, and that is 1.41× the board's
12-unit frame line — 1.41 is a ratio between two coordinate spaces, converted to px before dividing.*
Then **pick the gate**: the brief's `1.35–1.45×` range and the gate table's `≥ 1.35×` floor cannot both
stand (critique row 2). The range is the honest one — it holds at 1.410 with 0.04 of room either side,
and a floor alone is a gate that cannot fail upward. PAL-TIN's graft says the same thing in the general
case: an absolute floor AND a ratio to a ceiling, re-derived in the same run.

**The gap this does NOT close.** 10.764 + ~0.8 skirt ≈ 11.6 px predicted; the instruments read 15–16.
13.992 + 1 = 15.0 accounts for it exactly under the board-unit hypothesis, and nothing else I can
measure at HEAD does. It is a hypothesis with an arithmetic fit, not a measurement of the two-pass
band — that band does not exist on the main tree. **The discriminating instrument for the prototyper**:
read the band width and the ring's scale from the *same* element —
`getComputedStyle(ghost).strokeWidth` (user units) and
`ghost.ownerSVGElement.getBoundingClientRect().width / viewBoxWidth` — and never convert a ring with
the board's px/unit. Then ablate the retrace and scan the same row: the difference IS the retrace's
contribution, born-RED against a single 12-unit pass.

## 2 · The section row: 493 segments, and what G0 must now assert

The chair seats the section's G0 on SEGMENT COUNT. The estate's own dashed paths, counted off the
shipped generators at HEAD (`readings/segments-head.json`):

| path | site | segments | subpaths | arc length (units) |
|---|---|---|---|---|
| frame-trace ring, seed 42 (**the fill gauge**) | `HandDrawnGrid.vue:476-478`, attr `pathLength="1000"` + `stroke-dasharray="1000 1000"` | **493** | 1 | 3960.23 … 3963.94 (4 poses) |
| frame-trace ring, seed 91 (**the join ring**) | `HandDrawnGrid.vue:509-511`, same form | **493** | 1 | 3961.62 … 3963.90 |
| `DifficultyTally` strokes ×5 | `DifficultyTally.vue:230-232`, attr `pathLength="100"` + `stroke-dasharray="100 100"` | **12** each | 1 | ~80 |
| cell ghost rect 9×9 (the ring) | `gameCell.css:235/:251`, CSS `stroke-dasharray: 1` + `pathLength="1"` | **17** (18 cmds; live `getTotalLength()` 445.12) | 1 | 445 |
| cell ghost rect 16×16 | same | **9** | 1 | 250 |

Three things the section needs and did not have:

1. **ACC-SIX's "~490" is exact: 493, all four poses, both seeds.** The fill gauge and the join ring are
   the same geometry. Whatever the ~128-segment law does, it does it to both.
2. **`DifficultyTally` is at 12 segments — an order of magnitude under the threshold.** The pass-2 spec
   called it "the SAME shape" and handed it to §10 as a third site of the defect. It is the same
   *declaration form* and not the same *risk*. Seating `poseFronts` there is hygiene and one grammar,
   not a bug fix, and the handoff should say so or §10 will price a cure it does not need.
3. **The ring is at 17 segments and its dash is CSS-declared.** Clean on both axes — segment count and
   declaration site. This family's own ring needs no cure, and its meter carries no dash at all.

**G0, re-cut, as the section's one instrument.** One bare page; the board's own pose-0 `d` at its real
segment count; three arms — **3 / 123 / 493** segments on the *untruncated* pose (ACC-FIVE's critic's
row: their forced arm measured a 25-segment stub because `poseFronts` had already truncated it at
~1/40 progress, so the arm could not have gone red); × chromium + webkit × dpr 1 + dpr 3; assert the
painted share within 2 points across engines in every arm. Pass 2's subpath finding stays banked and
stays true — **the same point list cut into 4 subpaths paints 0.859 in both engines** — as a *second*
multiplier on a different axis, reported beside, never conflated with the segment law.

**Seating `poseFronts`.** ACC-FIVE's `poseFronts(frames, fraction)` (geometric truncation beside
`poseLengths` in `gridPaths.ts`) and ACC-SIX's bake-time slice agree to 1.4%. One primitive, exported
once, consumed by: the fill gauge and the join ring (`HandDrawnGrid.vue`, dash and `pathLength`
deleted), and `DifficultyTally.vue:230` in the same diff. This family's meter takes it for free — cut
subpaths ARE a front, and a front computed by arc length is the same operation. `poseLengths` currently
has one consumer (`poseFronts`); the tally gives it a second and the export earns itself.

## 3 · LAW A: the `m` cliff is a DIFFICULTY boundary, and it has a cure

The critique found `m` flipping at writable 56/57 and called it "one given". It is not. The dig bands
are literals in the solver (`csp-solver/src/puzzles/sudoku/generate.rs:67-72` — `target_holes` is the
writable *aim*: Easy `board_len/4`, Medium `/1.75`, Hard `/1.25`; the leash makes the actual count
≤ the aim, stated at `:59-66`). Priced against the measured perimeter
(min 3960.23 u → `slots cap = floor(3960.23/70) = 56`, slack 40.23 u):

| board | tier | writable aim | slots | m | ticks at full |
|---|---|---|---|---|---|
| 4×4 | Easy / Medium / Hard | 4 / 9 / 12 | = writable | 1 | 4 / 9 / 12 |
| 9×9 | Easy | 20 | 20 | 1 | 20 |
| 9×9 | Medium | 46 | 46 | 1 | 46 |
| **9×9** | **Hard** | **64** | **56** | **2** | **32** |
| 16×16 | Easy | 64 | 56 | **2** | 32 |
| 16×16 | Medium | 146 | 56 | **3** | 49 |
| 16×16 | Hard | 204 (digs to ~172–180) | 56 | **4** | 51 |

Two corrections to the spec's table, which carries one row per board size:

- **9×9 is not one row.** Easy and Medium sit at m = 1; only Hard crosses. And Hard's leash lands it
  right on the cliff — pass 2 measured writable 57–58, one and two above the boundary. That is why the
  critic's four arms read 10 subpaths in one engine and 20 in the other on "the same 9×9": two HARD
  deals, one leashed to ≤ 56 and one not.
- **16×16 is not m = 3.** It is 2, 3 or 4 by tier.

**The cliff's size**: writable 56 → 56 ticks; writable 57 → 29 ticks. **1.93× the density on one cell.**

**The cure, and it is one line.** The cliff is `ceil`'s, not the law's. Keep the slot cap and drop the
integer `m`:

```
slots = min(writable, floor(perimeter / (INK + GAP)))     // 56, unchanged
k     = round(written * slots / writable)                 // was: ceil(written / ceil(writable/slots))
```

Ticks at full become `slots` for every writable — 54→54, 55→55, 56→56, 57→**56**, 58→**56**
(`readings/arithmetic.json → lawA.cure_ratioForm`). The mark is unchanged, the meaning is unchanged
("a tick is `writable/slots` cells, and that is now a real number rather than a rounded one"), and the
gate can finally be written over a *continuous* function. **G3 then samples writable 56 AND 57 at 9×9**
and asserts no discontinuity, which is the row the critique says the gate is constructed not to see.

If the synthesizer keeps integer `m` — there is an argument that a tick standing for exactly two cells
is more honest than one standing for 1.018 — then the spec's table carries all nine rows above and G3
samples both sides of 56/57. What it cannot do is carry one 9×9 row and one 16×16 row.

## 4 · The ground token's honest claim (and it is smaller than stated)

Measured at HEAD with a cell selected, 8 arms: **`.cell-peer` nodes 20, sub-unit-opacity nodes on the
board 0.** Painted wash `color(srgb 0.290196 0.564706 0.85098 / 0.07)` light,
`color(srgb 0.415686 0.670588 0.921569 / 0.07)` dark — `--color-crayon-blue` at 7%, `opacity: 1`.

**HEAD already has zero stacking contexts.** The prototype's headline — "20 stacking contexts → 0" — is
measured against *pass 1's own* `opacity: 0.06`, a defect this family introduced and then cured. The
honest claim is the counterfactual: *re-inking the wash to graphite by the obvious route (`background:
graphite; opacity: .06`) mints 20 stacking contexts; the ground token reaches the same painted bytes
with zero.* That is still the right design and still worth the token. It is not a repair.

Everything else in that row I re-derived and it holds: the token lives outside `LADDER` (which is
exactly two rungs, `check-ink-pressure.mjs:94-97`), and `gateOwnership` (`:338-345`) exempts
`assets/index.css` alone — so minting it there is the one lawful site.

**The ground gate the critique asks for already has a shape in the estate.** `check-ink-pressure.mjs`
carries `RANK_RULING` + `gateRank` (`:588-625`): a ruling object with a `cite`, and a gate **closed both
ways** — the rank moving reds, and the ruling outliving its condition reds too. Clone it as
`GROUND_RULING` / `gateGroundRank` over MRK-WASH's rank (selection > peer cursor > hint laminate >
unit), with the values read off the live cascade rather than off token arithmetic (PAL-WALK's graft).
Do not invent a gate shape; the estate has one and its comment explains why narration is not gating.

**AA.** §3's retired argument is confirmed retired. HEAD's `--color-user-ink` is `#2563eb` light /
`#60a5fa` dark (`index.css:151`/`:372`), card `hsl(48 12% 99%)`, foreground `hsl(0 0% 3.9%)`. The blue
digit on the blue wash was the 4.71 that the 0.58-of-a-ratio headroom argument was built on; graphite
composed over body AND wash reads 11.39 / 9.03. Argue the one-ground rank on MRK-WASH's grounds — form,
not contrast — and strike the arithmetic.

## 5 · The surfaces, at HEAD, with line numbers

| surface | site | HEAD, measured |
|---|---|---|
| unit wash | `gameCell.css:123-131` | `color-mix(crayon-blue 7%)`, 13% under `prefers-contrast: more`; 20 nodes; opacity 1 |
| ring tier 1 hover | `gameCell.css:189-194` | graphite, 5 ghost u, opacity 0.65 |
| ring tier 2 focus | `:245-250` | `--color-focus-sketch` (fallback `--color-crayon-blue`), **7 u**, opacity 0.9, fill 0.08 |
| ring tier 3 conflict | `:273-278` | 9 u, opacity 1 |
| ring tier 2×3 | `:286-291` | **10 u**, opacity 1 — the `as shipped` row the spec mis-filed |
| peer cursor | `:229-234` | 4 u, opacity 0.55 |
| forced colours | `:320-341`, `:353-354` | `outline: 2px solid Highlight` on `:focus-visible`; the retrace paints no outline |
| fill gauge | `HandDrawnGrid.vue:464-480` | `--color-progress-ink` `#8b5cf6`/`#7c3aed`, 8 u, 0.95, attr dash, 493 segments |
| `.progress-pose` | `:571-578` | **no transform at HEAD** — the family's 0.968 is a mint, not a move |
| `.progress-trace` transition | `:587-590` | `stroke-dashoffset 240ms, opacity 500ms`, PRM-gated |
| join ring | `:496-517`, `.join-pose:595-612` | `scale(0.984)`, the audition's reasoning in the comment |
| a11y mirror | `:296-307` | `aria-valuetext="board N% filled"` — unchanged by this family |
| authorship | `HandwrittenGlyph.vue:85, :88-89` | `var(--color-user-ink, #2563eb)`; solved 5 / given 5 / yours 4.5 |
| deck | `PosterBoard.vue:196` | passes `:is-given` — clue weight rides the board's |
| `fillable` (= `writable`) | `GameBoard.vue:359` | `totalCells - givenCells.size` |
| self ink | `useSession.ts:315, :369, :402-411, :532-533, :547-554, :712, :880` | `inkIndex` a plain `let`, `selfInk` empty for you |
| the incumbent-blue prose | `playerIdentity.ts:65-66` | *"The local player keeps the incumbent blue — nothing is bound"* — false once the substrate moves |
| e2e prose (assertions survive) | `multiplayer.spec.ts:190-191`, `:217-219` | *"you are the incumbent blue"*, *"reads the incumbent blue"* |
| the crayon assertion | `visual-regression.spec.ts:151-163` | **`expect(crayonVars.blue).toBeTruthy()`** at `:163` — HEAD asserts the token EXISTS, not `""` |
| filter budget | `filterBudget.ts:157-161, :184, :211-215` | sparkle row live; `TOTAL` derived; union **45572**, coarse **6673** |
| tokens | `index.css:151, :173, :219-222, :223-226, :257-265, :278, :372, :381, :401, :407, :473-475` | measured live: blue `#4a90d9`/`#6aabeb`, sketch `#3a7bc4` (no dark override), progress `#8b5cf6`/`#7c3aed` |

**Two corrections to the pass-2 record.** (a) `visual-regression.spec.ts` at HEAD asserts the crayon is
**truthy** — the `=== ""` the critique reports is the prototype's own edit, and the chair has ruled the
change ships as a proposed diff (`instruments/visual-regression-crayon.proposed.diff`, banked).
(b) `FILTER_BUDGET_UNION_AREA` is `row 45572 / coarse 6673`; the spec declared `−900 → 44,672` and the
prototype measured `44,642 / 5,743`, i.e. **−930 on both**. Re-derive at citation: the spec's number is
30 off its own prototype's.

**The fold moved under this family.** `74a2b5d9` touched `DigitCell.vue`, `useGameCell.ts`,
`BoardHost.vue`, `GameBoard.vue` (+56), `GameControlPanel.vue` and `check-copy-register.mjs` (+937).
`DigitCell.attribution.test.ts`, `BoardHost.authors.test.ts` and `GameBoard.coarseTape.test.ts` are new.
The attribution tape and `cellAuthors` are now HEAD law — §12's surfaces are not what pass 2 replayed
against, and the replay resolves toward the fold (chair, "the fold is law, the prototype adapts").

## 6 · Primitives to reuse, by name

- **`poseFronts` / `poseLengths`** (ACC-FIVE, `gridPaths.ts`) — the section's shared front. Take it;
  do not re-mint an arc-length slicer for the tally.
- **`wobbleRect`, `pointsToLinear`, `perturbPointsClosed`, `boilRectFrames`, `mulberry32`**
  (`@mkbabb/pencil-boil` **0.12.0** — the estate is two minors past the `^0.10.1` the memory carries).
  `path.d.ts` is the whole surface; nothing here needs a new generator.
- **`createStrokeDrawIn`** (`pencil-boil/vue.d.ts:112`) — the estate's own draw-on, if the retrace's
  second pass wants a handle rather than a CSS `animation`.
- **`useBoilCache`** (`frames.d.ts:36`, cap 24) — `generateCellRects` is memoized through it; a retrace
  generator that is not will thrash on every size switch.
- **`generateRectBoilFrames` / `generateFrameTraceFrames`** (`gridPaths.ts:213, :352`) — the tally's
  geometry is the frame ring's, already grain-baked and filterless. `FRAME_X_PAD 12 / FRAME_Y_PAD 0`
  (`:338-339`) are §6.2's, not this family's.
- **`gateRank` + `RANK_RULING`** (`check-ink-pressure.mjs:588-625`) — the shape for the ground gate.
- **`heldFrameCount` + `useBeatFrame`** — how `DifficultyTally` shares the beat without a second
  scheduler subscriber; any new pose stack copies that, verbatim.

## 7 · Constraints this family collides with

- **§6.1 — the focus-ring token is not yours.** `--color-focus-sketch` `#3a7bc4`, no dark override
  (r7 `:176`). Read it, never write it. This palette survives on every MRK-LIVE candidate because the
  ring becomes graphite at opacity 1 and no state this family paints reads the token. Retiring the
  crayon orphans it (0 `var()`, 0 class) — hand it to §6, do not dispose of it.
- **§6.6 — the ring's opacity rank is §6's.** The family takes the ring to opacity 1 at tier 2; that is
  a rank move on `gameCell.css` rows MRK-LIVE rules. Declare it, do not land it unilaterally.
- **R6 law 39** is this design's direct subject: three of its four board-ring terms move (token,
  width, opacity); the intent survives. Reported MOVED with proposed wording in
  `instruments/R6-law39.MOVED.md`, plus a proposed **law 39a** (a stroke width is meaningless without
  its viewBox) — the defect of §1, bitten twice inside one family.
- **R6 law 9 / L1** — `FILTER_BUDGET_TOTAL` is derived, so deleting the sparkle row moves it 9 → 8
  mechanically. The L1 re-cut must land in the same diff; `FILTER_BUDGET_CEILING` stays 14.
- **R6 law 12** — the union AREA is gated too, ±2%, not a growth allowance. `45572 → 44642` and
  `6673 → 5743` are **−930 each**, re-derived on a dist built inside the worktree.
- **M16** — zero rendered strings move; `aria-valuetext` is unchanged, so `check-font-coverage` sees
  nothing. The fold rebuilt `check-copy-register.mjs` (+937 lines, a discovery grammar over spoken
  sources) — run it bare on the new tree, not against pass 2's reading.
- **W2's landed mechanics** — sticky tag, dock, bottom tab, tap-floor token: untouched, and stay so.
- **U-10** — nothing here closes M07. The owner's re-look is the gate on "does one heavy band read as
  *your pencil is here*" and on "is a tick standing for three cells honest without a whisper".
- **The chair's §6.11** — the crayon reconciles at the accent fold; eighteen families keep the hex.
  Proposed diff banked, not applied.

## 8 · Sketches

**(a) The two coordinate spaces, which is the whole of §1.**

```
  BOARD svg   viewBox 0 0 1000 1000        rendered 636 px  ->  0.636 px/unit
  +--------------------------------------------------+
  |  frame-line  12 u  = 7.632 px                    |
  |   +--------+--------+--------+                   |
  |   |        |  CELL ghost svg: its OWN viewBox    |
  |   |        |  -16.67 -16.67 144.444 144.444      |
  |   |   +----v----+   rendered 70.672 px           |
  |   |   |  ring   |   ->  0.48927 px/unit          |
  |   |   |  7 u    |   ->  3.425 px   (HEAD)        |
  |   |   | 12+12 u |   -> 10.764 px   (proposed)    |
  |   |   +---------+                                |
  |   |        |        |                            |
  |   +--------+--------+--------+                   |
  +--------------------------------------------------+
        22 ghost u / 12 board u, both in px = 1.410x   <- the ratio, stated once
        22 board u = 13.99 px  <- what pass 2's two instruments measured, and the error
```

**(b) LAW A's cliff, and the ratio form that removes it.**

```
  ticks at full, 9x9, slots cap 56
  56 |                    *  <- writable 56
     |                 *  *
     |              *  *  *
  32 |
  29 |                       x  x     <- writable 57, 58   CEIL FORM: a 1.93x cliff
     +--+--+--+--+--+--+--+--+--+--
       50 51 52 53 54 55 56 57 58   writable

  RATIO FORM   k = round(written * slots / writable)
  56 |                    *  *  *     <- clamps, never cliffs
     +--+--+--+--+--+--+--+--+--+--
                          ^ the cap, and the only discontinuity left is its own clamp

  where the tiers land (target_holes, generate.rs:67-72; leash makes actual <= aim)
     9x9 Easy 20 ...... Medium 46 ......|...... Hard 64
                                     56 ^ the boundary — only HARD crosses it
```

**(c) The band, painted, with its skirt — what the gate reads.**

```
  one scan row through the focused cell, desk 1280, light
  paper                 outer pass        inner pass              paper
  ...................|##############|....|##############|...............
                     <--- 12 u ---->  10u  <--- 12 u --->
                     <------------- 22 ghost u = 10.764 px ------------>
                      +0.8 px skirt each side, measured on HEAD's rules

  the SAME row, priced with the board's 0.636 by mistake:
                     <------------ "13.99 px" + skirt = 15.0 ------------>
                                                        ^ pass 2's reading
```

## 9 · Risks

1. **§1 is a hypothesis with an arithmetic fit, not a measurement of the two-pass band.** 13.992 + skirt
   reproduces 15.0 exactly, and nothing at HEAD can test it because the retrace does not exist there. If
   the prototyper re-measures in the ring's own space and still reads ~15 px, the band really is ~30
   ghost units and §1 is wrong — say so on that number, and the ring is then heavier than any ratio the
   family has claimed.
2. **The ring's `fill-opacity: 0.08` becomes graphite.** At HEAD it is crayon-blue at 8% over paper and
   invisible to a darkness threshold; graphite `hsl(0 0% 15%)` at 8% over `hsl(48 12% 99%)` drops
   luminance ~17, which is close to a 28 threshold and *under* a 12 one. Any painted-band instrument
   with a low threshold will read the ring and its fill as one run the width of the cell. Pin the
   threshold, declare it, and run a negative control on an unfocused cell.
3. **`stroke-linejoin: round` at 12 units fuses the wobble at phone scale** (the critique's row 13: the
   crop reads as a UI chip). The join is on the shipped rule; dropping it for the retrace changes the
   corner silhouette on every tier that shares the selector. Price the corner, not the edge, before
   taking it — or point U-10 at exactly that crop and let the owner dispose.
4. **The conflict ring's real delta, now with its figure.** HEAD tier 2×3 is one 10-unit pass:
   `445.12 × 10 = 4451 u² = 1065.6 px²` desk. The proposal is 12 + 12 at inset 10:
   `445.12×12 + 365.12×12 = 9723 u² = 2327.5 px²`. **+1262 px² per focused-and-wrong cell, 2.18× the
   ink.** File it as this diff's change, never in a column headed "as shipped".
5. **G2's phone-light rival is real and is the band's own arithmetic.** At 393 dpr3 the band is
   6.178 px and the frame line 4.38 px; the margin to the runner-up measured 1.04 (one rival within
   10%). The floor-or-range pick in §1 does not save it — a rank clause and a ratio clause are
   different gates. Either re-seat the ring at phone or carry G2 red and say which.
6. **`m` and the spoken layer.** `aria-valuetext="board N% filled"` is a percentage and stays true under
   every `m`. But a tick standing for 1.018 cells (ratio form) is harder to say than one standing for 2,
   and the family's whole defence of "no visible label" is that the mark teaches itself. The ratio form
   buys a continuous gate and spends a little of that argument. U-10.
7. **Two blues, and only one of them is yours.** r7 `:439` — in dark the entered-digit blue (213.1°) and
   the focus ring (211.7°) are 1.4° apart doing different jobs. Retiring the wax and graphiting the ring
   removes both from the wheel; it does not remove `--color-user-ink`, which the room re-binds. The
   accent census must be re-run *with a peer present*, not solo, or it prices a board that never has two
   hands on it.
8. **The dev-CSS staleness the prototype hit is a real trap, not an artifact to wave at.**
   `tokensDeclared["--color-focus-sketch"]` read `""` in six arms and `#3a7bc4` in two off the same
   server. Any token reading taken off a dev server after an `index.css` edit must be re-read after a
   forced reload, or taken off a built dist.

## 10 · What the synthesizer must decide

1. The band's denominator and its gate shape — range `1.35–1.45×` or floor `≥1.35×` (§1). Recommended:
   the range, stated in px with both spaces named, plus PAL-TIN's absolute floor.
2. Integer `m` or the ratio form (§3). Recommended: the ratio form, with G3 sampling writable 56 AND 57.
3. Whether the ground gate ships this pass (`gateGroundRank`, cloned from `gateRank`) or is booked.
4. The retrace's `stroke-linejoin` — keep round, drop for the retrace only, or point U-10 at the crop.
5. Whether G2's phone-light rival is cured or carried red, in words, before the prototyper runs it.
6. The §6 debts, in writing: the orphaned `--color-focus-sketch`, the collapsed anchor list
   (`instruments/accent-kinship-ANCHORS.proposed.diff`), and which MRK-LIVE candidate value this palette
   survives on (all of them — the ring reads none of it).
7. The three stale prose sites and the two source comments that still ship the refuted dash law
   (`HandDrawnGrid.vue:132-135`, `gridPaths.ts:167` on the pass-2 worktree) — re-cut to the segment
   mechanism of §2, which is now measured at 493.
