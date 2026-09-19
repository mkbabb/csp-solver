# ACC-GRAPHITE — pass 2, RESEARCH

T9-W7 convergent design loop · family **ACC-GRAPHITE, graphite for state** · §3 accent family ·
§4 fill meter · §12 multiplayer chrome · M07.

Everything below with a number was measured in this pass, on the pass-1 prototype worktree
`wf_e58b4764-0fc-43` served at `127.0.0.1:4235` (private vite `cacheDir`, `--strictPort`, killed
before return), **chromium and webkit, 1280×800 dpr1, light**, or computed by running the
estate's own generators through esbuild. Probes and readings are beside this file. The chair's
rulings were read first: **the focus-ring token is §6's row, not this lane's** — this palette
reads the token and never writes it, and survives on any of §6's candidates because every state
this family paints is graphite on the ink-press ramp and none of them is the ring token.

---

## 0 · The three findings that change the spec

1. **The pass-1 dash law does not reproduce.** "A dash pattern longer than its path paints once
   in Chromium and four times in WebKit" is the charter's most valuable pass-1 finding. Re-run in
   isolation on the REAL frame-trace `d` (the estate's own `generateFrameTraceFrames` output: one
   `M`, one `Z`, 25 vertices) with pass 1's own list, it is **engine-identical at every entry**:
   `100 4000` → 1 run both, `100 10000` → 1 both, `200 3800` → 1 both, `50 100` → 8 both, the
   k=3 tally list → 5 both (`readings/E-dash-real-*.json`). The four opacity-swapped
   `.progress-pose` layers are not it either: one active or all four, `100 4000` reads 1 run in
   both engines (`readings/H-poses-*.json`). And the ring's own declaration —
   `pathLength="1"` + `stroke-dasharray: 1`, period 2 against a path of 1 — is identical in both
   engines at dashoffset 0 / 0.25 / 0.5 / 0.75 / 1 (`readings/A-dash-*.json`).
   **Consequence:** the cut-geometry tally (`tickMarksAlong`) is still the better mechanism and
   should stay — it is exact by construction, which a dash never is — but it must be argued on
   THAT, not on a portability law this pass could not reproduce. The law as written must be
   re-stated as a bounded observation with its conditions, or withdrawn; and the handoff to
   MOT-\*/PLR-\*/NOTE-\*/W8 ("the shipped fill gauge and join ring are suspect on WebKit") must
   be **downgraded to unreproduced** until someone pins the missing variable. Sweeping my own
   ring in WebKit (charter row 12) is DONE and it is clean.
2. **"Twice round" and "rank 1 of 81" are the same number pulled two ways, and the exchange rate
   is now measured.** Painted, mid-row, at seven simulated insets, both engines agreeing to the
   pixel (`readings/BC-ring-*.json`). The two passes fuse into ONE band per side until inset
   **16**; the charter's floor of 14 splits one side only.
3. **The ticks overlap the rule by 2–4 px — everywhere, not at the corner.** Ablated (trace
   shown minus trace hidden, so the tick band is identified by difference, not by guess), 220
   columns across the board's top edge, both engines: clearance median **−3 px**, min −4,
   and it is −2 to −4 in every zone from 0 to 380 px from the corner
   (`readings/clearance-*.json`). The critique's §3.3 is confirmed and quantified, and its
   cause is not the crop. `scale(0.984)` buys 8 viewBox units = 5.1 px of inward travel; the
   tick needs ~16 units. **`.join-pose`'s own `scale(0.968)` is the constant that works** —
   16 units, 10.2 px, clearance **+2.1 px** — and taking it deletes a constant rather than
   minting one.

---

## 1 · The surfaces and tokens this family touches

All paths relative to `web/frontend/src`. Line numbers are the pass-1 worktree's unless marked
HEAD.

| surface | file:line | what this family does to it |
|---|---|---|
| `--color-user-ink` | `assets/index.css:151` (light) / `:372` (dark) | → `var(--color-pencil-graphite)`; 24 consumers untouched |
| `--color-focus-sketch` | `assets/index.css:219` | deleted — **now §6's token, read-only here (chair §6.1)** |
| `--color-progress-ink` | `assets/index.css:278` / `:407` | deleted with the violet gauge |
| `--color-crayon-blue` + `.crayon-blue` | `assets/index.css:173` / `:381` / `:473` | deleted; 13 class hits paint nothing |
| `--color-teacher-red` → `--color-crayon-rose` | `assets/index.css:212` | NOT touched; it is the collision at index 0 |
| `--peer-ink-l` | `assets/index.css:162` / `:375` | 0.5 light / 0.8 dark, the room-ink lightness |
| ink-press ladder | `assets/index.css:257`, `:262` | TWO rungs only: `--ink-press-rule` 55%, `--ink-press-quiet` 68% |
| focus ring tier 2 | `games/shared/gameCell.css:261-289` | graphite 12 @ opacity 1, fill 0.08, second pass |
| `.cell-ghost-retrace` | `games/shared/gameCell.css:252`, node `DigitCell.vue:425` | the second pass |
| `.cell-peer` | `games/shared/gameCell.css:121-131` | `background: graphite; opacity: 0.06` (0.12 at `prefers-contrast: more`) |
| the retrace geometry | `pencil/grid/gridPaths.ts:75` (`RETRACE_INSET = 10`), `:88`, `:127` | inset 10, seed +3, reversed |
| the tally | `pencil/grid/gridPaths.ts:159` (`tickMarksAlong`), `HandDrawnGrid.vue:114/143/504-521/608-618` | k cut subpaths, stroke 10, butt caps, `scale(0.984)` |
| the join ring | `HandDrawnGrid.vue:533-548`, `:640-659` | untouched; `scale(0.968)` is the constant to borrow |
| authorship weight | `pencil/glyph/HandwrittenGlyph.vue:93-96` | clue 5 → 6, solver 5, yours 4.5 |
| the deck's clue | `games/shared/PosterBoard.vue:196` | `:is-given` → every poster face moves with the board |
| the room's ink | `games/shared/useSession.ts:369` / `:412-425` / `:431-446` / `:561-592` | `selfInk`, `authorInk`, `inkIndex` |
| the ink walk | `games/shared/playerIdentity.ts:68-70` | `oklch(var(--peer-ink-l) 0.11 ((i·137.5) mod 360)deg)` |
| filter budget | `pencil/config/filterBudget.ts:157-161`, `:184`, `:211` | the sparkle row dies; total 9 → 8 |

**Primitives to reuse, by name** — nothing here needs a new one:

- `tickMarksAlong(d, k, slots, duty)` (`gridPaths.ts:159`) — arc-length-cut marks on any baked
  pose. One `M` per tick (`:196-206`), verified: subpaths == cells written at 1, 4 and 24 on a
  9×9 AND a 16×16, both engines (`readings/G-tally-*.json`).
- `generateCellRetraceRects` / `reverseLinearPath` (`gridPaths.ts:88`, `:127`).
- `useBoilCache` — both generators are memoized under their own keys; a second pass costs no
  second cache regime.
- `.join-pose`'s `scale(0.968)` (`HandDrawnGrid.vue:659`) — the existing off-the-rule constant.
- `inkFor(index)` (`playerIdentity.ts:68`) — the golden-angle walk, already the wire's contract.
- `--ink-press-rule` / `--ink-press-quiet` — the two-rung ladder, for INK. Not for a 6 % wash
  (see §6).
- `scripts/check-ink-pressure.mjs` `gateOwnership` (`:335-345`) — `color-mix(… graphite N%,
  transparent)` is legal in `assets/index.css` and nowhere else. That exemption is the whole
  mechanism for §6's cure.

---

## 2 · The retrace: the number that decides "twice round"

Mid-row scan of the focused cell, 1280 dpr1, light, `reducedMotion: reduce`, each row differing
only in a `transform: scale(k)` on `.cell-ghost-retrace` about its own `fill-box` centre
(`k = (cellHalf − I′)/(cellHalf − 10)`, cellHalf = 55.556 units at 9×9) — an ablation that
re-seats the inner pass at a simulated `RETRACE_INSET` without touching the generator.
**Chromium and WebKit returned byte-identical rows.**

| inset | extra scale | ink runs across the cell | paper, LEFT side | paper, RIGHT side | verdict |
|---|---|---|---|---|---|
| **10 (ships)** | 1.000 | **3** | 0 (fused) | 0 (fused) | one band per side |
| 12 | 0.9561 | 3 | 0 | 0 | one band per side |
| **14** (charter's floor) | 0.9122 | **4** | **0** | **1 px** | one side splits |
| **16** | 0.8683 | **5** | **1 px** | **3 px** | both split, barely |
| 18 | 0.8244 | 5 | 3 px | 5 px | both split, readable |
| 20 | 0.7805 | 5 | 4 px | 6 px | |
| 24 | 0.6927 | 5 | 6 px | 8 px | two distinct rules |

`readings/BC-ring-{chromium,webkit}.json` → `reseat`. And the price, from the generator
(`readings/geom.json` → `fusion`): the fused band's **peak thickness is `inset + 12` units while
the passes touch and exactly `12` units the moment they part**.

| | inset 10 (ships) | inset ≥ 14 |
|---|---|---|
| peak, desk | **10.76 px** (painted band 11–12 px) | **5.87 px** (painted 5–8 px) |
| peak, phone 393 dpr3 | 6.18 px | 3.37 px |
| vs the frame corner that beat it in pass 1 (8.33 px) | loses on phone already | loses on both |

So the charter's row 1 is a **strict trade with no middle**: separating the passes costs 45 % of
the ring's peak thickness, which is the quantity G2's "rank 1 of 81, 0 rivals" reads. Pass 1 was
already rank 2 at phone-light-chromium with the band FUSED (margin 0.906). Split, it is worse
everywhere.

**A third reading the synthesizer can take instead of either horn.** A pencil going round twice
does not paint two rules; it paints one band whose two edges wander independently. That IS
measurable and a single heavy stroke cannot fake it — a single stroke's inner and outer edges are
the same curve offset by the width, correlation 1.000 by construction. Measured on the real
generators (`readings/geom.json` → `retrace`), radial deviation of the inner pass against the
outer read backwards (the inner path is reversed):

| board | verts | outer σ (units) | inner σ | edge correlation |
|---|---|---|---|---|
| 4×4 | 17 | 0.596 | 0.573 | **−0.126** |
| 9×9 | 17 | 0.234 | 0.262 | **0.269** |
| 16×16 | 9 | 0.061 | 0.080 | 0.571 |

A gate on **edge correlation < 0.35 at 9×9** is born-RED against a single stroke (1.000), passes
on the shipped pair (0.269), and says in one number what "a hand coming back over its own line"
means. It also names the 16×16 weakness honestly: `cellSegments` drops to 2 at boardSize ≥ 16
(`gridPaths.ts:53`, `:96`), nine vertices, and the two seeds start to agree.

```
 mid-row, focused cell, 1280 dpr1 (measured, both engines identical)

 inset 10 — WHAT SHIPS              inset 16 — "twice round" legible
  cell edge                          cell edge
   |  ####..........####  |           |  ##_#..........#_##  |
   |  ^12px fused    ^11  |           |  ^8 ^6        ^5 ^6  |
   |  ONE run a side      |           |  TWO runs a side     |
   peak 10.76px  rank 1/81           peak 5.87px   rank 8 at mid-board (phone)
```

---

## 3 · The tally, priced at every board the estate ships

`tickMarksAlong` is exact: **subpaths == cells written**, measured at k = 1, 4 and 24 on a 9×9
(57–58 writable) and a 16×16 (161–165 writable), chromium and webkit
(`readings/G-tally-*.json`). The `aria-valuetext` agrees to the point ("board 42 % filled" at
24/57; "board 15 % filled" at 24/161) — the second carrier ACC-SIX's graft asks for is already
there, at `HandDrawnGrid.vue:306`.

What is not settled is the tick's FORM. Frame-ring arc length is **3959.4 units** (the real
generator, four poses agree), the stroke is **10 units** and the rendered scale is **0.636 px per
unit** (board 636 px at 1280, measured live). At `duty = 0.57`, one tick per cell:

| board | writable | pitch px | tick ink px | gap px | **tick aspect (ink ÷ stroke)** |
|---|---|---|---|---|---|
| 4×4 | 10–12 | 222 / 185 | 143 / 120 | 108 / 90 | **22.6 / 18.8** — a dashed rule |
| 6×6 | 20–26 | 111 / 85 | 72 / 55 | 54 / 42 | 11.3 / 8.7 |
| **9×9** | 43–58 | 52–38 | 33–25 | 25–19 | **5.25 – 3.89** — a tick |
| **16×16** | 150–210 | 26–19 | 9.6–6.8 | 7.2–5.2 | **1.50 – 1.07** — a square blob |

That is charter row 3, answered: at 16×16 a tick is **6.8–9.6 px long on a 6.4 px stroke**. The
counts stay exact (the arithmetic and the paint both say so) and the gaps stay open, but the MARK
stops being a tally mark. It is also **below the pass-1 G3 instrument's own 6-CSS-px
connected-component floor at 393 dpr3** (3.5–4.8 px there), so that instrument reads zero runs on
a 16×16 phone where the truth is 200 — a gate that cannot pass, for a reason that is the
instrument's, not the product's.

And a one-tick-per-cell tally is **geometrically impossible** at 16×16 if a tick must read as a
tick: 200 ticks at aspect 4.5 plus a 2.5-stroke gap need 200 × 70 = 14,000 units on a 3,959-unit
ring.

**Two laws that survive every board** (`readings/tally-law.json`, `probe/tally-law.mjs`):

| law | 4×4 | 9×9 | 16×16 | costs |
|---|---|---|---|---|
| **A · fixed ink 45 u, slots ≤ 56, m = ⌈writable/slots⌉** | 10 ticks, aspect 4.5 | 43–56 ticks, m 1–2, aspect 4.5 | 56 ticks, m 3–4, aspect 4.5 | one mark, identical on every board; the gauge counts in m's and the `aria-valuetext` carries the truth (ACC-SIX's one-literal-two-carriers, already shipped) |
| **B · one per cell while aspect ≥ 2.5, else groups of five** | 10, aspect 22.6 | 43–58, aspect 5.25–3.89 | 30–42, m = 5, aspect 7.5–5.4 | keeps 9×9 byte-identical to pass 1; 4×4 still reads as a dashed rule; two regimes to explain |

Law A is the parsimonious one: **one constant (45 u) replaces one constant (0.57)**, the tick is
the same mark at every board size, and `tickMarksAlong`'s signature already takes `slots`
separately from `k` — the change is at the caller (`HandDrawnGrid.vue:114`, `:143`), not in the
primitive.

```
 the tally against the frame rule — measured, 220 columns, both engines

 SHIPS (scale 0.984)                  BORROWS .join-pose's 0.968
   frame rule  ▓▓▓▓▓▓▓ 6px              frame rule  ▓▓▓▓▓▓▓
   tick        ░░▓▓▓▓▓▓▓▓ 7px           (paper)     ..      +2.1px
   clearance   -3px  (OVERLAP)          tick            ▓▓▓▓▓▓▓▓
   -> "a retrace of a rule IS a rule"   clearance   +2.1px -> a mark ON paper
```

---

## 4 · The room, the index, and the hand that changes colour

**The reactivity hazard is real and its failure is nameable** (charter row 5). `inkIndex` is a
plain `let` at `useSession.ts:369`; `selfInk` reads it at `:422` and collects dependencies on
`present` and `selfId` only. `adoptInk` rewrites `inkIndex[id]` at `:589` — *including your own
id* — touching neither. Concrete failure: you join, a peer arrives, `selfInk` mints `inkFor(0)`;
the epoch holder then publishes a board whose `k` puts you at index 3; **every other page repaints
your cells `inkFor(3)` and yours keeps `inkFor(0)`.** One hand, two colours, across two screens —
the family's own sentence inverted, on the wire path the family relies on.

- Cheapest cure: `inkIndex` becomes a `ref` (one declaration, ~6 `.value`s at `:422`, `:567`,
  `:568`, `:589`, `:747`, `:915`). Alternative: an `inkEpoch = ref(0)` bumped in `mint()` and
  `adoptInk()` and read FIRST in `selfInk` — cheaper churn, one more piece of state.
- The unit pass 1 added reads the roster BEFORE the join. The unit this needs **adopts after the
  join**: join → peer present → `selfInk` = inkFor(0) → `adoptInk({me: 3})` → `selfInk` must
  move. Born-RED against the `let`.

**Index 0 is the teacher's red, exactly** (row 7). `inkFor(i)` = `oklch(var(--peer-ink-l) 0.11
((i·137.5) mod 360)deg)` — index 0 is hue **0.0°**, `--color-teacher-red` is `--color-crayon-rose`
at 14.2° light / 12.2° dark at comparable lightness and chroma. The golden-angle walk's first ten
hues are 0, 137.5, 275, 52.5, 190, 327.5, 105, 242.5, **20**, 157.5 — so a reserved **340–30°**
arc removes **indices 0 and 8** from the first ten and leaves the walk otherwise intact, while
"start at 1" only defers the collision to index 8. Booked with PAL-TIN as the palette's row; this
lane takes whatever reserved-arc law lands there and does not mint one.

**Pre-room digits** (row 6). `authorInk` (`:431`) iterates `ledger.clock` only, and a solo write
never enters the clock, so on opening a table your earlier digits stay graphite while everything
after is coloured — one hand, two colours again, on one screen. Two honest dispositions:
(a) stamp existing non-given values into the clock at room open — a substrate change with wire
consequences, outside this family's blast radius; or (b) **write it into the spec as design**:
what you wrote alone you wrote as the pencil, and the room only colours what the room saw. (b) is
defensible and free, and it needs a sentence in the product's voice, not a mechanism.

**`useSession.ts:315`** still reads "EMPTY for you, who keep the incumbent blue" — false on both
halves. Re-cut in the same diff as the `ref`.

---

## 5 · The deck is not zero-diff, and the golden cannot see it

Row 9, measured on the running deck (`?view=gallery`, five posters, 304 × 304 px centre face,
44 clue glyphs, `readings/deck-delta-*.json`), by ablating the clue back to HEAD's 5 units:

| | ink px | ink mass |
|---|---|---|
| clue 6 units (this family) | 12,798 | 2,861,810 |
| clue 5 units (HEAD, ablated) | 12,319 | 2,753,165 |
| **delta** | **+479 px, +3.89 %** | **+3.92 % (webkit +3.95 %)** |

The glyph renders **21.94 px wide from a 40-unit viewBox** (0.5485 px/unit), so the deck's clue
gains **0.55 px** of stroke. Both engines agree to 0.06 pp.

The delta is **0.52 % of the crop's pixels** — under the goldens' `maxDiffPixelRatio` 0.02. This
is the chair's §6.2 shape exactly: a real move the bitmap gate is blind to. It must be **declared
as a DELTA with its before/after**, not allowed to pass silently. (T8-R13's still==board identity
survives: the board and the deck move together.)

---

## 6 · `.cell-peer` — the wash needs a GROUND token, not a ladder rung

Measured on a 9×9 selection: **20 `.cell-peer` nodes rendered, all at `opacity: 0.06`,
`background: rgb(38,38,38)`; the whole page carries 25 elements with 0 < opacity < 1**
(`readings/IJKL-*.json`). The wash is **80 % of every stacking context on the board**.

The charter asks for "a rung so the wash can be a `color-mix` again". The ladder cannot take it:
`check-ink-pressure` asserts every rung clears a contrast floor (rule ≥ 3, quiet ≥ 4.5) and is
strictly increasing in light/dark/print (`scripts/check-ink-pressure.mjs:305-335`); a 6 % wash
clears nothing, because it is a **ground**, not ink. Two different tables.

The cure that satisfies both gates: `gateOwnership` (`:335-345`) bans open-coded graphite
`color-mix` **in every file but `assets/index.css`**. So declare the ground in the token block —

```css
/* ground washes: a tinted paper, never ink — the ink-press ladder governs marks, this
   governs what a mark sits on (MRK-WASH's one-ground rank) */
--ground-wash-unit: color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 6%, transparent);
```

with its `prefers-contrast: more` arm at 12 % — and `.cell-peer { background: var(--ground-wash-unit) }`
at opacity 1. Same painted value, **20 stacking contexts → 0**, gate 3 green, and the ground
family becomes nameable for MRK-WASH's rank.

**The headroom read** (MRK-WASH's graft): the entered digit is **5.08:1 bare light / 7.36 dark**
against a 4.5 floor, of which HEAD's 0.08 selection body already spends **0.50** — total light
headroom **0.58**. A 0.06 wash is first-order ~0.375 of that (not measured here; measure it).
Composed with the selection body it would be ~0.875 > 0.58 and the digit drops under 4.5.
**The chair's §6.11 one-ground rank is what keeps this legal** — only one ground paints per cell —
so this family must state that its wash sits under that rank and never composes with the
selection body. The tier-2 fill 0.08 is the selection's own body and is the rank's top; it is not
additive with the wash under the rank.

---

## 7 · G10's holdout has a cause, and it is not the probe

`onClear` arms only when `isCoarse.value && props.isDirty && !clearArmed.value`
(`GameControlPanel.vue:550-556`; the design note at `:548` says so in words: "Fine pointers keep
the one-click Clear"). Measured: at 1280 dpr1 a click on Clear leaves `is-armed` false and the
sublabel unchanged, both engines (`readings/deck-guard-*.json`). **The confirm does not exist at
a fine pointer.** G10 as written asks for a state the desk viewport never has; run it at
393 dpr3 with `hasTouch`, on a DIRTY board, or write the fine-pointer holdout into the gate as
the product's own answer.

---

## 8 · What is still open, with the instrument each needs

1. **The dark mid-board residue, 89–716 px** (row 11) — unbinned. Instrument: the r0 hue census,
   copied and re-pointed, run at dark mid-board with per-token attribution instead of 10° bands.
2. **The reversed draw-on** (row 1) — still uncaptured, and now for a named instrument reason.
   The perimeter walk at the OUTER band's radius reads the outer pass correctly (one travelling
   arc, start pinned at 0.725 of the ring, share 0.547 → 0.801 → 1.0, identical in both engines,
   `readings/D-drawon-*.json`) and reads a constant for the inner pass because it samples the
   wrong radius (`readings/F-drawon-radius-*.json` sweeps 11–23 px). The inner pass's band is
   `10 × 0.489 ≈ 4.9 px` further in at desk; sample there, and read the START index, not the
   share: a reversed path's run grows with its END pinned.
3. **`writable ?? 51`** (`HandDrawnGrid.vue:114`, row 4) — the guessed denominator. Measured
   real values: 9×9 **57–58**, 16×16 **161–165** (not 51, not 150). Make the prop required, or
   render no tally without it; there is one caller (`GameBoard.vue`).
4. **R6 law 9 / §3.4 / law-probe L1 / R1** (row 8) — `R6-census.md:86`, `:227` and
   `law-probe.mjs:40-45` assert "EXACTLY 9"; `law-probe.mjs:133-138` (R1) greps
   `--color-focus-sketch` in `.dark`. Both are stale under filter 9 → 8 and the token's
   deletion. Propose as diffs under `pass2/<stage>/ACC-GRAPHITE/instruments/`, report the rows
   MOVED. **`r0/` is not re-cut.** Note the ordering hazard: §6 now owns the focus-ring token, so
   R1's re-point must be co-ordinated with §6's leader, not written unilaterally.
5. **The painted authorship figure and ONE G4b instrument** (row 10) — the rendered ratio is
   1.333 by construction; the painted chamfer median reads 1.00 at desk light. G4b's two numbers
   (contrast quotient 2.50–2.88, alpha quotient 1.71–1.79) still need the chair to name one. This
   lane has no new reading; it is a prototype row.
6. **Arm-B dark + the three 393 dpr3 phone crops** (row 14) — within the four-crop cap. This lane
   spent **one** crop (`frames/tally-top-strip-light-chromium.png`, 3.9 KB, the tick/rule overlap
   §3 names); three remain for the prototype.

---

## 9 · Risks

1. **Deleting "twice round" is the honest reading and it deletes code.** If the synthesizer takes
   one heavier pass, `generateCellRetraceRects`, `reverseLinearPath`, `.cell-ghost-retrace` and
   its node all go (~60 LOC, one LRU key, one path per focused cell) and the band becomes a plain
   22-unit stroke that keeps the peak. What is lost is exactly the uncorrelated inner edge (§2) —
   so if the family keeps the retrace, it must gate on that number or it is keeping a mechanism
   nothing measures.
2. **The dash law's withdrawal costs the round its headline.** Handing back "unreproduced" is
   right, and it means the cut-geometry tally must justify itself on exactness alone. It does:
   subpaths == cells written, 9×9 and 16×16, both engines.
3. **`scale(0.968)` shrinks the tally ring 3.2 %**, so the pitch shrinks with it. Harmless, but
   every pitch figure above must be re-derived at 0.968 before it is written into a spec.
4. **Law A changes what a tick MEANS on a 16×16** (one tick = 3–4 cells). That is a product-copy
   row under M16 and the `aria-valuetext` must not start lying; it says "board N % filled" today
   and that stays true under both laws.
5. **The 16×16 tick is below the pass-1 G3 instrument's 6-px component floor at 393 dpr3.** Any
   G3 re-run must lower the floor or state its board/viewport scope, or it will read 0 runs and
   be mistaken for a regression.
6. **`RETRACE_INSET` clamps at `cellSize/4`** (`gridPaths.ts:98`). Raising it to 16 silently
   degrades to 15.625 at 16×16 (cellSize 62.5) — a spec that says 16 must say what 16×16 gets.
7. **The `.player-swatch` stays until its instruments are re-pointed in the same diff** (chair
   §6.8) — this family's `selfInk` feeds it.
8. **Both engines agreed on every reading in this pass** (dash sweep, ablation, re-seat, draw-on,
   clearance, tally counts, deck delta). That is a comfort and a warning: the pass-1 engine split
   that motivated the tally's mechanism is not visible from here, so no pass-2 claim should rest
   on it.

---

## 10 · Couplings stated, not resolved

- F1's "colour on your own hand means someone else is here" side, with **PLR-SELF**. Stated.
- **§6 owns the focus-ring token** (chair §6.1). This palette survives on every candidate §6 has
  minted (4.19–4.38 one value four grounds; a dark crayon-blue alias; a dark arm at 6.4;
  delete-and-replace) because no state this family paints uses it — the ring is graphite at
  opacity 1 over the board's own paper, 12.05 / 10.79 / 13.27 / 10.79 : 1 in the four desk cells.
- **FRAME_PAD is its own row** (chair §6.2). This family's tally does not touch the pads; it
  ships at HEAD's value.
- **`.cell-because` is nobody's here** (chair §6.11) — no colour family touches it. This lane's
  only contribution is §6's ground-token proposal, which the laminate's body would also want.
- The dash law's handoff to **MOT-\* / PLR-\* / NOTE-\* / W8** is **downgraded to unreproduced**
  by this lane's own re-audition. ACC-FIVE and ACC-SIX should be told before they sweep.
- `--ring-ink` (§3.5) is consumed by every §10 control lane and is not re-minted here.

---

## 11 · How to replay

    # the server (killed before this lane returned)
    cd .claude/worktrees/wf_e58b4764-0fc-43/web/frontend
    npx vite --config <this dir>/probe/vite.lane.config.mts --host 127.0.0.1 --port 4235 --strictPort

    # the geometry, off the real generators
    cd <this dir>/probe
    ../../../../../../../../.claude/worktrees/wf_e58b4764-0fc-43/web/frontend/node_modules/.bin/esbuild \
      <worktree>/web/frontend/src/pencil/grid/gridPaths.ts --bundle --format=esm --platform=node \
      --outfile=gridPaths.bundle.mjs
    node geom.mjs && node tally-law.mjs

    # the board, both engines
    npx playwright test --config pw.lane.config.ts r2-ring r2-dash r2-close r2-clearance r2-deck2

`probe/package.json` is `{"type":"module"}` (the specs use `import.meta`); `probe/node_modules`
is a symlink to the worktree's, r0's precedent. No r0 or pass-1 instrument was run in place; the
one r0 subject this lane touches (law-probe L1/R1) is reported MOVED and proposed as a diff, not
re-cut. Evidence here is **≈180 KB**, one crop at 3.9 KB.

---

## 12 · Prior art (background only — the verdict is the codebase's)

Two searches, neither load-bearing.

- **The dash split has a plausible missing variable, and it is dpr/zoom, not the pattern.** The
  SVG working group declined to specify whether a dash pattern resets per subpath, explicitly
  because implementations hand geometry to the underlying rasteriser
  ([www-svg, 2006](https://lists.w3.org/Archives/Public/www-svg/2006Apr/0091.html)); and Safari
  is separately reported to compute dash lengths differently from Chromium, with a known class of
  bug where **unitless** `stroke-dasharray` / `stroke-dashoffset` values are not scaled under page
  zoom while px values are
  ([motion #3301](https://github.com/motiondivision/motion/issues/3301),
  [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dasharray)).
  This lane's live reading is the tell: the ring's CSS-declared `stroke-dasharray: 1` computes to
  **`1px`** in both engines (`readings/BC-ring-*.json` → `decl`), while a presentation attribute
  stays unitless. **So the pass-1 4× is worth one more audition at 393 dpr3 before it is
  withdrawn — the variable this pass held fixed at dpr1 is exactly the one the literature says
  Safari treats differently.** That is a one-line change to `probe/r2-dash.spec.ts`'s viewport,
  and it is the cheapest open row in this lane.
- **The golden-angle walk is conventional and so is reserving an arc.** Multiplying 137.5° by the
  index is the standard "take the largest unused gap" construction for categorical inks
  ([Winward](https://topher.io/writing/secrets-of-the-golden-angle),
  [Wikipedia](https://en.wikipedia.org/wiki/Golden_angle)); nothing in the literature reserves a
  semantic arc, because nothing in the literature has a teacher's red. The reservation is this
  estate's own problem and PAL-TIN's row (§4).
