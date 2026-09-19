# NOTE-LEDGER · THE LEDGER — pass-1 design spec

T9-W7 §7, the hint note's lifecycle. Synthesized from the pass-1 lane record
(`../research/NOTE-LEDGER/README.md`) and the r0 laws (`../../r0/r6-idiom-history/R6-census.md`).
A spec, not a cut; nothing closes (U-10). This family is incompatible with NOTE-ERASE by
construction (a note that ages by displacement cannot also age by a clock or leave on an act);
the agglomerator decides between them or cuts across them, not this file.

The research settled the shape. The idea's engine survives: a note ages by being displaced by
the next thing said, so there is no clock to tune and no note dies while it is being read; the
peer-wipe defect dies because nothing but a sentence moves a sentence. The idea's own draft died
on one number: a second line IN FLOW moves the board 13.59px at 390×844 (half of a 27.19px line,
because the phone's column is centred). What survives is a column of exactly two, the older
line OUT of the page's flow, one rung down, and the third line forbidden twice over (the rule
rung is 3.51:1 light / 4.37:1 dark, sub-AA for text in both themes; a third line covers the
phone's 55.98px control row by 16.00px). The count dies with the third line: nothing.

The one memorable thing is the push: the line you were reading steps down one rung and one
line as the new one writes in above it, the way a worked page fills. Everything else is quiet:
two pressures, no rules, no numbering, no timestamps, no author's name.

---

## 1 · Tokens (nothing minted; the two rungs that already ship, and no third)

| role | token | light | dark | note |
|---|---|---|---|---|
| paper (the note's real backdrop) | `--color-background` | #fbfaf9 | #110f0e | the page, not the card; R6's card-priced 3.53 / 4.36 read 3.51 / 4.37 here |
| line one, the newest | `--color-pencil-graphite` | #262626 · 14.52:1 | #d1cfc7 · 12.25:1 | the live line, unchanged |
| line two, the previous | `--ink-press-quiet` (68%) | painted #6b6a6a · **5.17:1** | painted #93928c · **6.07:1** | AA for text; composited and painted agree to ±0.04 |
| line three | `--ink-press-rule` (55%) | 3.51:1 | 4.37:1 | **forbidden for text in both themes**; there is no line three |
| grades (never in the column) | `--color-red-ink` / `--color-gold-ink` | #d02a52 / #8c691d | #ff5c7c / #e5c74d | live slot only, at full pressure, leave with the grade |
| the beat | `MOTION.beatMs` | 125 | | `pencilConfig.ts:123` |
| the push curve | `--ease-noteWrite` | `cubic-bezier(0.22, 1, 0.36, 1)` | | the note's own write-in curve; a second curve for the same ink would be R4's fourth accident |

Type unchanged: `--font-hand` at `--type-body`, leading 1.3 (20.80px line at 390, 23.63px at
1280), tracking 0.02em. Every string the margin can hold fits the phone's 258px line (longest
`8 goes nowhere else in this column` at 210.06px), so no line is secretly two.

### 1.1 The motion home

```ts
// pencilConfig.ts, inside MOTION
note: {
  writeInBeats: 2,   // 250ms — the incumbent write-in, named (MarginNote.vue:149)
  pushBeats: 2,      // 250ms — the older line's step down, the SAME clock as the write-in
},
```

Published to CSS by the `--card-step-ms` precedent as `--note-write-ms`; the push is a WAAPI
FLIP and reads `MOTION` directly (the two-layer partition, R6 law 3). 250ms is two beats, not
one: the charter's "≤ one beat" is not met and should not be, because the push and the write-in
are one gesture on one clock. PRM: duration 0, travel 0, one frame (measured).

---

## 2 · Components and states

### 2.1 The model — `GameBoard.vue`, one more ref

`setMargin` keeps `marginText`/`marginTone` for the live line and gains `marginPrevious:
{ text, tone: "graphite" } | null`. The ruling that decides what enters it:

**A ledger holds RECORDS OF ACTS, never LIVE CLAIMS ABOUT THE BOARD.**

| line | kind | joins line two when displaced? |
|---|---|---|
| `only 8 fits here` / `8 goes nowhere else in this row` | record (you asked) | yes |
| `that's a given clue` | record (the board refused) | yes |
| `the board is clear` | record (you cleared) | yes |
| `check row 4` (conflict) | grade, imperative | **no** — replaced in place; `GameBoard.vue:750` already retracts it when the grade reverts |
| `solved it!` | grade | **no** — and a solve EMPTIES the column (§2.4) |
| `still solving…` | a state, not an act | no |
| a peer's digit | no sentence exists for it | adds nothing, removes nothing (the L2 law) |
| a deal | nothing | the column empties; the strip is `""` (the caption law, `GameBoard.receipt.test.ts:107-118`) |

Line two is always graphite: a demoted record is written in graphite at the quiet rung
whatever tone it arrived in. Teacher-red at 68% is 3.04:1; a refusal that has aged is a
record, and records are pencil.

What the five null sites do under this family: the MODEL still nulls (`hintReasoning` at
`useGameState.ts:434, :487, :604, :770, :790` — the second-H-press trap and the `becauseCells`
highlight are model facts and stay exactly as W1 left them). What changes is the MARGIN's
response: W1 §1.2's falsy arm (`GameBoard.vue:699-701`) and the refusal's (`:721-723`) stop
retracting the TEXT on a write. A record is displaced only by the next sentence; your digit says
nothing, so it moves nothing. Deal and solve are the two acts that empty the column.

### 2.2 `MarginNote.vue` — one live region, one hidden line

```
<div class="margin-note-block" :class="{ 'is-quiet': quiet }">
  <p class="margin-note" :class="tone" role="status" aria-live="polite" aria-atomic="true">
    <span v-if="text" :key="text" class="margin-note-ink">…</span>          ← line one, unchanged
  </p>
  <p v-if="meta" class="margin-note-meta">{{ meta }}</p>                     ← the tally, unchanged
  <p v-if="previous" :key="previous" class="margin-note-previous" aria-hidden="true">
    {{ previous }}                                                            ← line two
  </p>
</div>
```

| state | what paints | motion |
|---|---|---|
| **one line** | today's strip | the incumbent write-in |
| **two lines** | line one full, line two at `--ink-press-quiet`, graphite, no star, no tone class | — |
| **the push** (a record displaces a record) | line two takes the outgoing text; line one writes in the new | FLIP: insert first (layout commits), then line two animates from the row it vacated to its berth, 250ms `--ease-noteWrite`, `fill: backwards` (law 6), colour full → quiet on the same clock; line one's `ink-write-in` as today |
| **a grade arrives** (record live) | line two takes the record; line one shows the grade at full pressure | the same push |
| **a grade leaves** | line one `""`, line two stays where it is | none: a line does not climb back up the page once it has aged |
| **deal / solve** | both lines `""` | none (the receipt test's row: a deal says nothing) |
| **quiet** (the celebration) | the voice is sr-only as today; line two is `display: none` for the crest | the column is empty by then (a solve empties it), so this is a guard, not a state |
| **PRM** | same layout | push duration 0, one frame |

`aria-hidden="true"` on line two and no `role`: the strip keeps exactly ONE live region, atomic,
so a push announces line one only and `check-live-regions.mjs` counts what it counts today.
`.margin-note-previous` is `pointer-events: none`, `user-select: none`, no write-in of its own
(an older line does not re-write itself in).

### 2.3 The berth — ONE LAW, TWO BERTHS

The law: line two is out of the page's flow, one rung down, after line one in reading order,
and it takes the air the pose already has. The berth follows the strip's regime, which the
tongue already does under one law across four berths (T9-W2 §2.7, R6 §1.3):

| regime | where line two sits | why |
|---|---|---|
| **in-flow strip** (`<1024`, portrait phone) | an absolutely positioned host inside `.margin-note-block`: `top: 100%; left: 0; right: 0`, gapless, one line box (20.80px) | the phone has 25.60px of air under the note before the ribbon; in flow a line costs 27.19px and moves the board 13.59px. Out of flow the board is invariant at every depth and two lines clear the ribbon by **4.80px** on 390×844, 393×699, 390×664 and 360×740 |
| **overlay strip** (`≥1024`) | in the block's own flex row, trailing line one after the block's `column-gap: 0.45rem`, `white-space: nowrap`, `flex-wrap: nowrap` at this width | the tally's berth (T4-P1 mark 6: "the verdict speaks, the tally trails it in the quiet ink, one line for both"). Below the note the desk has 5.55px of air and a second line pushes the document 18.06px past the fold; beside it the two longest strings sum to 478px in a 636px strip and the page gains zero scroll |
| **in-flow strip, landscape** (`<1024`, e.g. 900×500) | BALLOT — default: the trailing berth if the strip's width holds the two longest strings at that size plus the gap; otherwise depth one on that pose | 0px of air under the note and 5.56px of overflow measured; the brief measures the strip's width there and picks by number. If the answer is depth one, that is a pose-dependent depth and B6's split-grammar row applies; state it at the re-look rather than hide it |

Reading order is the same in both berths: newest first, older second. On the phone that is a
column; on the desk it is a line, the shape the strip already has for the tally.

### 2.4 The rulings the lane left to nobody, made here

1. **The celebration.** A solve empties the column before the crest, so the vignette carries
   the verdict alone and nothing vanishes and reappears. The column is a record of this
   attempt at this board; a solved board has no attempt left.
2. **The error card.** `SolverErrorNote` keeps the flow berth (`GameBoard.vue:1129-1142`, the
   reason the strip is in flow below 1024 at all). When it mounts, line two is `display: none`
   for the card's life: the error card and the older line want the same 25.60px and the card is
   the assertive one. Measured in combination by the brief, not assumed.
3. **The author.** A peer's digit is not named and not lined. Attribution has two homes
   already (the cell tape and the roster); a name in the margin mints a per-player string and a
   line whose width nobody chose.
4. **The count.** None. A third line is drawn at a forbidden rung in a forbidden 16px.

---

## 3 · Desktop and mobile, light and dark

| | 390×844 phone | 1280×800 desk |
|---|---|---|
| line one | 16px, y 594.13, 20.80px, full graphite | 18.176px, 23.63px, full graphite |
| line two | y 614.92, 20.80px, quiet, the same left edge | same line, trailing after 0.45rem, quiet |
| board y | 219.73 at depth 1 AND 2 (invariant) | invariant |
| ribbon clearance | +4.80px | n/a |
| scrollHeight | 844 → 844 | 800 → 800 (target; 818 under the below-berth) |
| dock sheet open | covers the strip whole (controls-card y 216 vs strip 594, settled 900ms); the ledger is read with the sheet shut | n/a |

Light and dark differ only in the token arms; line two's rung clears AA in both by painted bytes.
The two banked crops (`../research/NOTE-LEDGER/frames/390-stack-three.png`, whose third line's
pallor IS the 3.51:1 rung; `1280-stack-two.png`, shot in document coordinates because the desk's
below-berth is already past the fold) are the controls for the brief's frames.

## 4 · Copy

No string is minted. `and 4 more` was priced (66.17px, register-clean, zero new codepoints) and
rejected with the third line. `check-copy-register.mjs` and `check-font-coverage.mjs` do not
move. Line two renders the same literals line one did; the hand's cut already holds them.

## 5 · Register risk, named

Two lines of standing handwriting under a drawn board is the closest this product has come to
the caption M16 deleted. The distance is one rule wide: the caption described the BOARD'S
IDENTITY unconditionally on arrival; the ledger prints nothing until the player acts, never
describes the board, and a deal empties it. That rule is §2.1's table and the receipt test's row;
write it down or the next lane re-mints the caption as line two.

The residual the family pays for "no clock": a hint followed by silence stands at full pressure
until the next sentence, which is HEAD's behaviour on a reader who acts without producing one.
The family answers "never dies while being read" and does not answer "ages while nothing is
said". Stated, not hidden.

---

## PLAN — files, order, what dies

1. `src/pencil/config/pencilConfig.ts` — `MOTION.note` (§1.1).
2. `src/pencil/chrome/MarginNote.vue` — the `previous` prop, `.margin-note-previous` (quiet rung,
   `aria-hidden`, no write-in), the two berths as two CSS rules under the strip's own
   breakpoints (`@media (min-width: 1024px)` mirrors `GameBoard.vue:1300-1310`; the host MUST NOT
   set `position` on the ≥1024 strip — the lane's first prototype did and dropped the strip into
   flow, moving the desk board 15px), the FLIP push via `el.animate` with `fill: "backwards"`
   and a PRM arm reading `matchMedia`, v-bound `--note-write-ms`.
3. `src/games/shared/GameBoard.vue` — `marginPrevious` and the record/grade rule inside
   `setMargin` (a `kind` argument: `"record" | "grade" | "state" | "empty"`); the hint and
   refusal falsy arms stop writing `""`; the deal path and the solved arm empty both lines; pass
   `:previous` to MarginNote; hide line two while `showErrorNote`.
4. `src/games/shared/GameBoard.receipt.test.ts` — add the rows: a deal leaves BOTH lines `""`;
   a conflict never lands in line two.
5. `src/games/shared/useGameState.ts` — UNTOUCHED. The model's nulls stay; the peer path stays;
   the ledger cures the peer wipe at the margin, not at the seam.

Dies: the retraction of a record's TEXT on a write (W1 §1.2's falsy arm and the refusal's
keep their flags, lose their `setMargin("")`); the peer-anywhere wipe as a visible defect
(the sentence no longer follows the model's null); the `250ms` literal at `MarginNote.vue:149`.

Order once: step 2's CSS must land with step 3's `previous` in one commit, or a `previous` with
no berth rule mounts in flow and moves the phone's board (the L3 gate catches it).

**Re-measure the day W7 §10's type scale lands.** This family lives on 4.80px at 390; one extra
px of line box on `--type-body` or of gap on the strip puts line two on the control row.

## PROTOTYPE BRIEF — the smallest runnable build on the real surface

Build steps 1–3 on a throwaway worktree under the scratchpad (never the main tree; removed
when done). Dev server from `web/frontend`: `npx vite --host 127.0.0.1 --port 4243
--strictPort` (the lane's port; next free in 4230–4249 if taken). Scratch config
(`../research/NOTE-LEDGER/probe/pw.config.ts`, baseURL only). chromium + webkit headless;
390×844, 393×699, 390×664, 360×740 (dsf3), 900×500, 1280×800; light and dark; PRM off and on.
Copy `probe/` to a scratch dir with a `node_modules` symlink before running.

**Poses to screenshot** (crops ≤150 KB, ≤6 total):

1. the phone's two-line column at 390×844 against the board's foot and the ribbon, light (the
   4.80px is the claim); dark once at 360×740 (the tightest rig)
2. the desk's trailing berth at 1280×800 with the two longest strings side by side, light
3. the push at t = 125ms (line two half-way down, line one half-written), 390×844 chromium
4. the error card over a two-line column at 390×844 (the unmeasured combination), one crop

**Measurements that mean success** (`height.probe.ts`, `overlay.probe.ts`, `ledger.probe.ts`,
`peer.probe.ts`, `ledger-law.probe.ts` re-run under the build, plus the new rows):

- board `y` identical at depth 1 and 2 on every rig, both engines (NL-1 / L3)
- ribbon clearance ≥ 4.0px at 390×844, 393×699, 390×664, 360×740 (expect 4.80 / 4.80 / 4.80
  / 4.79); NEVER a third painted line (a third record displaces the second and leaves no trace)
- `document.scrollingElement.scrollHeight` unchanged by the second line at 1280×800 (800) and
  at 900×500 (500, if the trailing berth fits; the strip's width vs `2 × 225.1px + 0.45rem`
  decides the ballot's default and the number is banked either way)
- the push: settled ≤ 250ms (expect 208.9 chromium / 225.0 webkit), travel = one line box,
  glyph `filter: none` ×2, glyph `transform: none` on line one throughout, `fill: "backwards"`
  on the mover, PRM duration 0 / one frame
- painted contrast: line one ≥ 12, line two ≥ 4.5 both themes (expect 5.17 / 6.07); line two
  never paints a red or gold core (a demoted refusal reads graphite)
- one `role="status"` inside `.board-margin`; line two `aria-hidden="true"`; a push yields
  exactly one live-region mutation (line one), zero for line two
- `?wire=local`, two pages: a peer's digit elsewhere leaves both lines; a peer's digit on the
  named cell leaves both lines (the model nulls, the text stays); a join leaves both
- a conflict after a hint: line one `check row 4`, line two the hint; when the grade reverts:
  line one `""`, line two still the hint; a solve: both `""` before the crest; a deal: both `""`
- with `SolverErrorNote` mounted: line two `display: none`, the card's foot above the ribbon

**Censuses to re-run unchanged:**

- `r0/r3-marks/probe/marks.probe.ts` R3-d and `marks2.probe.ts` R3-g (md5 `62b2a326…` /
  `5b848cbc…`): R3-d's nine acts still leave line one standing; R3-g's rows change by design
  (a digit no longer retracts the hint's text; deal and solve still empty) and the delta is
  declared row by row
- `r0/r3-marks/probe/wobble.probe.ts` + `budget.probe.ts` — ring σ and filter count 9 unmoved
  (this family draws nothing)
- `r0/r2-accent-family/probe/hue-census.probe.ts` — 29 rows, no new token
- `r0/r1-controls/probe/heading-voice.spec.ts` — unmoved control
- `npm run lint:ink` — the ladder's two rungs, all three scopes, unchanged; `check-live-
  regions.mjs` unchanged; `check-copy-register.mjs` / `check-font-coverage.mjs` unmoved;
  `GameBoard.receipt.test.ts` green with its new rows; `e2e/board-covisibility.spec.ts` (it
  clones `.margin-note-block` tenants at :160 and :248) re-run; goldens 4/4 unmoved (DELTA: none)

## GATES — born-RED instruments this family lands with

`../research/NOTE-LEDGER/probe/ledger-law.probe.ts` holds L1–L3 as written before any cure:

1. **L1 accumulation** — after a second record, the first is still readable in `.margin-note-
   previous`. HEAD: RED (expected `only 4 fits here`, received `[]`).
2. **L2 the peer row** — a peer's digit anywhere leaves your line. HEAD: RED (received `[]`).
3. **L3 the board** — board `y` invariant when the column takes a second line. HEAD: RED under
   the in-flow draft (moved 13.59px); GREEN only under the out-of-flow berth — the gate that
   convicts the family's own first shape.
4. **L4 the fold** — `scrollHeight` invariant at 1280×800 and 900×500 with two lines. HEAD: n/a
   (no second line); RED under the below-berth on the desk (818); the trailing berth cures.
5. **L5 the clearance** — line two's foot ≥ 4.0px above the ribbon's top on the four phone rigs,
   and never three painted lines. Born with the cure; the negative control is a forced third
   line (must not render).
6. **L6 one region** — exactly one live region in the strip; line two `aria-hidden`; one
   mutation per push. HEAD: GREEN (one region); a guard against a second tenant in the region.
7. **L7 the rung** — line two's painted contrast ≥ 4.5 both themes and its core never red/gold.
   HEAD: n/a; born with the cure.
8. **L8 the caption law** — a deal leaves both lines `""`; the receipt test's production row
   plus its new twin. HEAD: GREEN; must stay so.
9. **L9 records only** — a conflict verdict never appears in line two; a solve empties both
   lines before `celebrating`. Born with the cure.
10. **L10 the type-scale tripwire** — line two's line box at 390 equals the strip's reserved
    line (20.80px) and the clearance holds after W7 §10 lands. Born with the cure, re-run at §10.
