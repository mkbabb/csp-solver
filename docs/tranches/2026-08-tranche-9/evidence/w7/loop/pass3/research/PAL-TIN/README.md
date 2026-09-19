# PAL-TIN · pass-3 RESEARCH — the corner, measured in INK; the tape, priced for the first time

Section §11c / §12 · family PAL-TIN (five sticks and a tally) · base `74a2b5d9` (the W7
execution fold; the chair's §8 control commit). Read-only on the product: nothing under `src/`
was touched, no server was started, no port was taken, no crop was banked. The one instrument
this lane wrote is `probe/grounds.mjs` (zero-dependency, no browser); its output is
`readings/grounds.txt`.

Everything below is a measurement off this tree or an arithmetic derivation from it. Where a
pass-2 number is quoted it is labelled as pass 2's.

---

## 0 · The three findings that move the design

1. **The corner strip cannot hold the tally the spec draws, and the pass-2 clearance numbers
   are optimistic by half a stroke.** The critic measured `getBBox`, which in SVG **excludes the
   stroke**; the tick's PAINTED ink is the band ±½ stroke, and ½ stroke is `boardWidth/600`
   (1.07 px desk, 0.61 px phone) = **1.5 cell-% at 9×9 and 2.67 cell-% at 16×16**. Re-derived
   with ink rather than geometry, the unowned strip holds **4.27 px of drawable height at a
   9×9 desk board, 2.44 px at 9×9 phone, 1.07 px at 16×16 desk and 0.61 px at 16×16 phone**
   (§2). A four-upright gate-five tally does not fit in any of them at the authored 12 cell-%
   height.
2. **The ring's alpha is not PAL-TIN's to spend, and at the chair's 0.55 the family's own
   ≥3:1 gate is RED by construction**: 2.437 light / 2.280 dark, worst stick, against the
   ring's own 4 % fill (`readings/grounds.txt`). 0.65 buys 3.005 / 2.757 — light only. Only
   0.80 (pass 2's move, now MRK-LIVE's row under chair §6.6) clears: 4.210 / 3.632.
3. **The attribution tape is a ground nobody has ever priced, and HEAD already fails on it.**
   `GameBoard.vue:1093` binds the author's ink onto the tape and `:1240` colours the label
   `var(--color-user-ink)`; the paper is `--sheet-washi-neutral`. Measured: **dark tape worst
   2.977:1 under the tin (peer-5 pink), and 4.232:1 for HEAD's own `--color-user-ink`** — both
   under 4.5 at every viewport below 1544 px, where `--type-small` is still under the large-text
   threshold. T9-W7 pick 3C-4 deleted the `display: none` that kept this off coarse pointers
   (`GameBoard.vue:1256-1261`), so the failing ground now reaches every phone.

---

## 1 · The surfaces and tokens this family touches, at `74a2b5d9`

| what | where (HEAD) | note |
|---|---|---|
| the peer band, dying | `src/assets/index.css:153-162` (`--peer-ink-l: 0.5` at :162) and `:375` (0.8) | R6 law 21's cite `index.css:154-161` is this block; law 22 is `inkFor`'s formula |
| the incumbent | `index.css:151` `#2563eb` · `:372` `#60a5fa` | never in the tin (self binds `{}` at HEAD) |
| the cell inks the tin must clear | `index.css:204-208` (solver 1-5 light), `:395-399` (dark) | the ΔE anchors |
| print / forced colours | `index.css:926` (`.glyph-svg path` + `!important`), `:948` (`stroke: CanvasText`) | the pair the tick must be widened into |
| the formula | `playerIdentity.ts:53-61` (`slugFor`), `:88-94`-ish (`inkFor`) | `seedFor` does not exist at HEAD; `slugFor` hashes inline at :54 |
| self's ink | `useSession.ts:557` `const ink = id === selfId.value ? {} : ident!.inkFor(index)` | F1's whole mechanism, one ternary |
| `adoptInk` | `useSession.ts:547-568` (**one argument at HEAD**) | the wire rule's landing site; the spec's line numbers still hold |
| the `st` arm | `useSession.ts:757-763` — `ledger.epoch = e` at :761, `adoptInk(...)` at :763 | `from` is already in scope |
| `sendState` | `useSession.ts:689` | publishes `k`; agrees nothing today |
| who wrote it | `useSession.ts:402` `authorInk`, `:422` `cellAuthors` | two consumers of one clock |
| the tape | `GameBoard.vue:1090-1095` (mount), `:1230-1245` (CSS), `:1256-1261` (the deleted coarse gate) | wears the author's ink; `aria-hidden` |
| tape paper | `index.css:286-290` light, `:427-431` dark | `color-mix(... foreground 6%, tint/α)` |
| the cell's rings | `gameCell.css:189-198` (tier 1, `stroke-width: 5`), `:229-240` (tier 4, width **4**, `stroke-opacity: 0.55` at :234) | §6's rows (chair §6.6) |
| the laminate | `gameCell.css:139-155` — `inset: 9%`, `box-shadow: inset 0 0 0 2px`, radius 12 % | not ours (chair §6.11) |
| the ghost's box | `useGameCell.ts:86-97` — viewBox = cell + 15 % pad each side | the source of every cell-% below |
| the ghost's path | `gridPaths.ts:41-68` — `wobbleRect(x, y, cellSize, cellSize, {roughness: 0.4, segments: 4 (2 at ≥16), jagged})` | wobble amplitude below |
| the cell mount | `BoardHost.vue:300-318` — `authorInk` + `peerCursorInk` + `:author-name` | where `:author-ticks` would join |
| the roster row | `GameControlPanel.vue:1145-1160` (`:style="p.ink"` on the `<li>`), swatch `:1156`, name `:1157` | the legend's home |
| `.player-name` | `GameControlPanel.vue:1775-1781` — `flex: 1 1 auto` | pass 2's `0 1 auto` is the 156 px |
| `.player-swatch` | `GameControlPanel.vue:1689-1695` — `background: var(--color-user-ink)` | re-pointed ONCE under PLR-SELF (chair §6.9) |
| the tally's hand | `DifficultyTally.vue:66-77` — viewBox 76×44, four uprights + slash, `DRAW_STAGGER_MS = 90` at :77 | the primitive to reuse |
| the draw-in presets | `pencilConfig.ts:478-506` (`DRAW_IN_PRESETS`) | `tally` is pass 2's addition |
| the ring's assertion | `e2e/join-language-prm.spec.ts:153` — `expect(opacity).toBeCloseTo(0.55)` | keep green, never re-word (chair §6.6) |
| the roster's e2e | `e2e/multiplayer.spec.ts:190, :218` comments | the MOVED rows |
| CI's lint lane | `.github/workflows/ci.yml:942-944` (`lint:ink`), `:1084-1086` (`lint:copy`), `:1097-1099` | the step shape `lint:tin` must copy |
| the scripts | `package.json:33-42` — every `lint:*` runs `--self-test` IN CI's own invocation | `lint:tin` must too |

---

## 2 · The corner, re-derived — the numbers the synthesizer writes the spec from

**The cell-% frame.** `useGameCell.ts:86-97` pads the ghost's viewBox by 15 % of a cell on
each side, so the drawn rect spans `0.15/1.3 … 1.15/1.3` of the cell: **11.538 … 88.462
cell-%**, at every board size. A viewBox stroke of `w` is `w / (1.3 × 1000/boardSize)` of the
cell, so **the ring's stroke in cell-% is `0.0385 × w × boardSize`** — it grows with the board.
The wobble is `roughness × len × 0.015` (`pencil-boil/dist/path.js:63`), which at roughness 0.4
over an edge of one cell is `0.006 × cellSize` = **0.462 cell-%, board-size independent**
(overshoot `0.003 × 0.4` = 0.092 cell-% along the edge).

| board | ring outer edge, tiers 1-3 (w 5) | tier 4, the peer ring (w 4) | `.cell-because` rim, 640 px board | rim, 366 px board |
|---|---|---|---|---|
| 4×4 | 89.23 + 0.46 = **89.69** | 89.54 | 1.25 cell-% | 2.19 |
| 6×6 | 89.62 + 0.46 = **90.08** | 89.85 | 1.88 | 3.28 |
| 9×9 | 90.19 + 0.46 = **90.65** | 90.31 | 2.81 | 4.92 |
| 16×16 | 91.54 + 0.46 = **92.00** | 91.38 | 5.00 | **8.74** |

**The strip.** Unowned = below the laminate's 91 % box AND below the ring's outer edge:

```
board          strip (cell-%)   desk 640px    phone 366px
4×4 … 9×9      [91.00, 100]     6.40 px @9×9  3.66 px @9×9
16×16          [92.00, 100]     3.20 px       1.83 px
```

**The ink, not the box.** The tick's stroke is `3 × boardSize / 9` user units in a 100-box
(`PlayerTick.vue:96-100`), i.e. `0.333 × boardSize` cell-% — 3.00 at 9×9, **5.33 at 16×16** —
and `stroke-linecap: round` puts half of it beyond each end. Painted, that half-stroke is
`boardWidth/600` = **1.07 px at 640, 0.61 px at 366, at every board size**. So the drawable
band inside the strip is:

(Three tenants only — the grid line is counted in the table after this one, which supersedes it.)

| board · width | strip px | − stroke px | drawable height | the authored 12 cell-% wants |
|---|---|---|---|---|
| 9×9 · 640 | 6.40 | 2.13 | **4.27 px** (6.0 cell-%) | 8.53 px |
| 9×9 · 366 | 3.66 | 1.22 | **2.44 px** | 4.88 px |
| 16×16 · 640 | 3.20 | 2.13 | **1.07 px** (2.7 cell-%) | 4.80 px |
| 16×16 · 366 | 1.83 | 1.22 | **0.61 px** | 2.75 px |

**The fourth tenant nobody counted: the grid line is drawn ON the cell edge.**
`HandDrawnGrid.vue:339, :353, :366` stroke the frame at **12**, sub-grid lines at **8** and cell
lines at **5** units of the 1000-unit BOARD viewBox, centred on the edge — so each line reaches
`0.05 × w × boardSize` cell-% INTO the cell it borders:

| line | 9×9 | 16×16 |
|---|---|---|
| cell line (5) | 2.25 cell-% | 4.00 |
| sub-grid (8) — every 3rd row at 9×9, every 4th at 16×16 | 3.60 | 6.40 |
| frame (12) — the board's own outer row | 5.40 | 9.60 |

**Verdict, with all four tenants counted.** The re-cut band the critic proposed (y 91.5–98.5)
has an INK box of [90.0, 100.0] at 9×9 — back across the laminate's 91 % edge and straight
through the grid line — and [88.83, 101.17] at 16×16, which lands in the neighbouring cell. The
band that actually clears, measured end to end (laminate 91 % · ring outer + wobble · grid-line
intrusion · the mark's own round cap):

| board · row | usable band (cell-%) | minus the tick's stroke | **drawable, px** |
|---|---|---|---|
| 9×9 desk, interior row | [91.00, 97.75] = 6.75 | − 3.00 | **2.67 px** |
| 9×9 desk, sub-grid row | [91.00, 96.40] = 5.40 | − 3.00 | **1.71 px** |
| 9×9 desk, board's last row | [91.00, 94.60] = 3.60 | − 3.00 | **0.43 px** |
| 9×9 phone, interior row | 6.75 | − 3.00 | **1.52 px** |
| 16×16 desk, interior row | [92.00, 96.00] = 4.00 | − 5.33 | **negative** |
| 16×16 phone, any row | ≤ 4.00 | − 5.33 | **negative** |

**The in-cell tally does not survive its own measurement.** Not at 16×16 at all, not on a
sub-grid or border row at 9×9, and at 2.67 px on the best cell this estate draws — against a
mark whose own stroke is 2.13 px. The defect is not the placement; it is that the tick is
drawn at the DIGIT's weight (`boardWidth/300`) inside a band that is one twentieth of a cell.

**What the corner is clear of, and it is worth banking.** All three mark layers require
`props.value === 0` (`useGameCell.ts:331, :344, :347`), so engine peek marks, Snyder corner
marks and centre marks **cannot** co-occur with a ticked cell (a tick implies a digit). The
lower-left Snyder slot `[3,1]` (`useGameCell.ts:351-361`, `.user-corner-marks { inset: 7% }`)
is therefore not a tenant. The corner has exactly three: the laminate's wash + rim, the ghost
ring's stroke, and the grid line at 100 %.

---

## 3 · The three places a lap can be drawn, priced (sketches)

The left margin buys nothing the corner does not: the column is `[0, 9.00]` at 9×9 and
`[0, 8.00]` at 16×16 (the ring's left outer edge), the grid line eats the same 2.25–5.40
cell-%, and the mark's stroke scales the same way — **6.75 cell-% usable, 2.67 px drawable, the
identical number**. What it does buy is the free axis: four marks STACK along a dimension
nothing else owns, instead of four uprights each needing height they do not have. The third
place is the one the fold handed the estate for free: the attribution tape, **109.59 × 33.58 px**
of surface (`3C-4`'s own measurement) that already names the author and, since the same pick
deleted its coarse-pointer `display: none`, now appears on every phone.

```
SKETCH 1 — what pass 2 draws, in INK, 9×9 desk (cell 71.1px, 1 char ≈ 5 cell-%)
   0        9            30                70          91   100
   ┌────────┬─────────────────────────────────────────┬──────┐  0
   │  ← .cell-because box: inset 9%, 2px rim, r 12% → │      │
   │        │        ┌───────────────┐                │      │
   │        │        │   the digit   │  glyph box, middle 65%│
   │        │        └───────────────┘                │      │
   │  ring path 11.54…88.46, stroke 3.46 cell-% ──────┼──────┤ 88.46
   │        │ ▓▓▓ ring outer + wobble ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │ 90.65
   │░░░░░░░░│ laminate edge ░░░░░░░░░░░░░░░░░░░░░░░░░░│      │ 91.00
   │        │ ▌ ▌ ▌ ▌   ← 4 uprights, ink 90.0…100.0  │      │ 92.5 ┐ 4.27px
   └────────┴─────────────────────────────────────────┴──────┘ 98.5 ┘ of room
   the ink box (round caps) reaches BOTH neighbours: the laminate above, the grid line below.

SKETCH 2 — THE MARGIN TALLY: the same mark, rotated into the left column x [2.25, 9.00]
   ┌──┬──────────────────────────────────┐        the column is 6.75 cell-% wide once
   │──│                                  │  y 24  the cell line's 2.25 is paid, and
   │──│        ┌──────────────┐          │  y 36  60+ cell-% TALL, so the four marks
   │──│        │   the digit  │          │  y 48  stack along the axis nothing owns:
   │──│        └──────────────┘          │  y 60  dashes 2.67px long at a 640 board,
   │╱ │   (the fifth binds them, ╱)      │  y 48  12 cell-% apart = 8.5px of gap.
   └──┴──────────────────────────────────┘        Left ring edge 9.35 (9×9) / 8.00
      ↑ ONE margin per cell, never both: two      (16×16); glyph starts at 17.5.
        ticked neighbours then sit a whole        Same 2.67px as the corner — the
        cell apart rather than 2px apart.         GAIN is the stacking axis, not size.

SKETCH 3 — THE TAPE, which is the only surface with room (109.59 × 33.58 px, on both pointers)
   ┌──────────────────────────┐          the fold already binds the author's ink here
   │  brave-otter   ▌▌▌       │  ← 33.58px tall, 16px type: a tally at 8–10px is
   └──────────┬───────────────┘            legible, which no in-cell band allows.
        ┌─────┴─────┐                      Cost: the lap is answered on hover/focus,
        │     7     │  ← the digit         not at a glance; the tape is aria-hidden,
        └───────────┘     in its stick     so nothing is added to the a11y tree.
   and the roster row keeps the same mark (mode="row", viewBox "4 83 36 16" today):
   ● amber   brave-otter  ▌▌ you     ● green  wry-lemur     ● teal  plain-tapir ▌
```

The margin cut keeps every claim pass 2 earned (one component, two homes, one geometry, the
roster as legend, frozen pose, census 9) and spends nothing new: it is the same
`generateLineBoilFrames` strokes with x/y transposed and the crop re-pointed.

---

## 4 · The numbers this family must hit, and where each comes from

| row | floor | measured, this tree |
|---|---|---|
| AA, five sticks on `--color-background` | 4.5 | light worst **7.163** (teal) · dark worst **5.293** (pink) |
| AA on `--color-card` (r2's toll ground, `accent-kinship.probe.ts:267-275, :319`) | 4.5 | light **7.305** · dark **5.191** |
| **AA on the attribution tape** (`--sheet-washi-neutral` over the page) | 4.5 (<1544 px viewport) | light **6.513** · dark **2.977** ← RED; HEAD's own blue reads **4.232** dark |
| AA on the hint laminate (teacher-red 15 % over paper) | 4.5 | light **5.797** · dark **4.403** ← RED dark by 0.097 |
| the same, `prefers-contrast: more` (24 %) | 4.5 | light **5.083** · dark **3.764** ← RED dark |
| ring vs its own 4 % fill at HEAD's 0.55 | 3.0 | **2.437** light · **2.280** dark |
| … at 0.65 | 3.0 | 3.005 light · 2.757 dark |
| … at 0.80 (pass 2's, now §6's row) | 3.0 | 4.210 light · 3.632 dark |
| ΔE to the nine cell inks (pass 2's arithmetic, not re-run here) | 0.075 | 0.082 light / 0.100 dark, ceiling 0.103, score 0.80 |
| painted tick stroke | `boardWidth/300` | 2.13 px @640 · 1.22 px @366 (pass 2 T5: 2.120 / 1.207) |
| drawable corner band | > mark height | **4.27 / 2.44 / 1.07 / 0.61 px** (§2) |
| filterBudget | exactly 9 | unchanged — the tick is frozen, no live filter |

`readings/grounds.txt` is the run; `probe/grounds.mjs` is 190 lines of arithmetic with every
token cited by line.

---

## 5 · Primitives to reuse, by name

- `generateLineBoilFrames(x1,y1,x2,y2,opts,amp,frames)` — `pencil/grid/gridPaths.ts`; take frame
  `[0]` for a frozen pose (what `PlayerTick` already does).
- `DifficultyTally.vue:66-75` — the gate-five geometry and the per-stroke seed decorrelation.
- `DRAW_IN_PRESETS` (`pencilConfig.ts:478`) + `.pencil-draw-on` (`index.css:780`) — the draw-in
  with `pathLength="1"`, PRM handled inside the primitive.
- `useLiveRegion` (`src/composables/useLiveRegion.ts`) — only if anything speaks; it should not
  (the cell's own `authorName` already speaks, `BoardHost.vue:88-95`).
- `hashBlob` (`useUndoHistory`) — the seed; `slugFor:54` already does exactly the hoist pass 2
  proposes.
- The gate's own species: `check-ink-pressure.mjs` (reads `index.css`, resolves per arm, four
  negative controls, `--self-test` in the CI invocation) — `check-peer-tin.mjs` is that file's
  sibling and should read `playerIdentity.ts`'s `TIN` **as source text**, not as an export:
  `TIN` is module-private at the prototype (`playerIdentity.ts:84`) and exporting it for a gate
  mints a consumer-less export that `knip` reds.
- `SheetWashiLabel.vue` — the tape; note `z-index: 50` and `font-size: var(--type-small)`
  (`typography.css:32`: clamp 14 → 20 px, 16 px at a 1280 viewport).

---

## 6 · The constraints it collides with

1. **Chair §6.6** — the ring ships at HEAD's 0.55 and `join-language-prm.spec.ts:153` stays
   green. The family's GATES row "ring ≥ 3:1" therefore cannot land as written; it must become
   a REPORTED row with the three alphas priced (above) and handed to MRK-LIVE, or be re-aimed
   at the stick-vs-paper question the palette actually owns.
2. **Chair §6.11 / §6.5** — `.cell-because` is not ours; no `, 0px`-style fallback anywhere;
   `--color-peer-cursor-ink` is **already bound wherever the ring paints** (`BoardHost.vue:67-79`
   sets it exactly for the keys that get `:is-peer-cursor`, `:314`), so the
   `var(--color-peer-cursor-ink, var(--color-user-ink))` fallback at `gameCell.css:230/232` is
   unreachable in practice — critique gap 10 is **narrower than stated**. The real collision is
   the tin's own: two players a lap apart share a stick, so a peer's cursor ring and the
   digit's author ink are the same colour, and **the ring carries no tally**. State it, or give
   the ring the lap.
3. **Chair §6.9** — `.player-swatch` re-points once under PLR-SELF; PAL-TIN's roster hunk must
   not carry its own copy.
4. **R6** — L6 (`r0/r6-idiom-history/law-probe.mjs:114-126`) asserts `/137\.5/ && /0\.11/` in
   `playerIdentity.ts` and exactly two `--peer-ink-l` arms; the tin deletes all three, so the
   probe reads `BROKEN: L6, exit 1`. Law 21's cite (`index.css:154-161`) is the block at
   **:153-162** today and moves with the tokens; law 22 is the ballot.
5. **M16 / copy** — nothing is minted; the roster is the legend. `lint:copy` reads spoken copy
   by NAME since `5f8e1a7b`, so any `aria*`/`*Label` string added would enter the lexicon.
6. **W2's mechanics are landed** — no new mechanic; the tick rides the digit's own mount.
7. **The e2e estate is browserless in CI** (O-12): new rows under `e2e/` are LOCAL instruments
   and must carry a `PRM:` declaration in their first `HEAD_LINES`
   (`scripts/check-motion-contract.mjs:13-25, :69`), or `lint:motion` reds.

---

## 7 · Seams the charter names, with the answer this lane found

- **`source.snapshot()`'s shape.** `SessionSource` declares `snapshot: () => unknown`
  (`useSession.ts:215-233`, :219); the implementation is `useGameState.ts:376`
  (`{ b: snapshotBoard(), m: snapshotMarks() }`) with `BoardBlob` at `:44-52` and `snapshotBoard`
  at `:513-520`. The honest cure is a **declared accessor beside `size()`** — e.g.
  `writtenPositions: () => number[]`, implemented next to `:376` off `values` and
  `originalGivenCells` — so the stamp reads a contract instead of parsing `unknown`.
- **`domNodes` 1234 → 1235.** Nothing in the pass-2 diff mounts an unconditional node: the cell
  tick is `v-if="authorTicks > 0 && value !== 0"` and the roster tick `v-if="p.lap > 0"`, and a
  solo census has neither. The remaining candidate is the DEV server itself: Vite injects one
  `<style>` element per SFC `<style scoped>` block, and `PlayerTick.vue` is a new SFC statically
  imported by `DigitCell.vue`. Probe (one line, no build):
  `[...document.querySelectorAll('style')].filter(s => (s.dataset.viteDevId ?? '').includes('PlayerTick')).length`
  — 1 in dev, 0 in a built preview. If it reads 1, the census row is a dev-wire artefact (the
  T9-R1 species) and the attribution is closed without a design change.
- **`adoptInk` "fills gaps only".** At HEAD the function takes one argument and writes
  `inkIndex[id] = index` for every id in `k` (`:547-568`); its own doc-comment says it "never
  reassigns", which the code does not do. The sentence and the branch disagree **at HEAD**, not
  only under the rider — the unit belongs to the section (PAL-WALK's twin row) and reds on HEAD.
- **The 156 px.** `.player-name { flex: 1 1 auto }` is at `GameControlPanel.vue:1775` (the
  B1b fold moved it from :1769). The row's `<li>` carries `:style="p.ink"` at `:1153`, so the
  swatch, the slug and any row tick are all one binding — a π row must measure the row's
  CHILDREN (`.player-swatch`, `.player-name`, `.player-self`), never the `<li>`.

---

## 8 · Risks, in the order they kill the design

1. **The in-cell band is 2.67 px at best, 0.43 px on the board's last row, negative at 16×16**
   (§2). If the synthesizer keeps an in-cell mark, the stroke law must change with it (a
   hairline, painted ≤ 1 px) and the gate must measure the INK box, not `getBBox` — every
   pass-2 clearance number is a `getBBox` reading and is optimistic by half a stroke.
2. **The dark tape reads 2.977:1** and the fold put it on phones. Whatever the palette does, the
   tape's ground now belongs in the AA table; and HEAD's own 4.232 says this is an estate row
   (a LEDGER candidate), not only the tin's.
3. **The ring at 0.55 fails 3:1 with any ink the estate has ever put in it** (the incumbent blue
   reads 2.170 light). The family must not silently ship a gate it cannot pass.
4. **Two players share a stick and the cursor ring does not say so** — the design's own capacity
   claim (30 board-distinguishable players) holds for digits and not for cursors.
5. **The dark laminate row**: a peer's pink digit under an armed hint reads 4.403:1 (3.764 in
   `prefers-contrast: more`). Under 4.5 in both, unmeasured by anything in the estate.
6. **`lint:tin` reading a private `TIN`** — parse the literal, never export it (knip).
7. **The goldens** still have not run against a built dist with ten moved `index.css`
   declarations; chair §6.4 forbids a re-mint inside the loop, so a moved golden is a STOP, not
   a re-baseline.
8. **Relay arm and real device** remain untested (pass-2 risks 4, 5 — carried, not closed).

---

## 9 · Prior art (background only — the verdict is the codebase's)

Categorical-colour research puts the practical ceiling for reliably nameable, discriminable
categories well under a dozen (Healey & Enns's work on preattentive colour categories; the
common practitioner cap of ~8), which is the tin's own argument for five plus a second channel
rather than an unbounded hue walk. Recent work formalises exactly the tin's move — pairing a
small colour set with a redundant SHAPE encoding to extend capacity (CatPAW, arXiv 2602.06792;
Palettailor, arXiv 2009.02969). Multiplayer estates (Figma's cursors and avatars) hash the
identity to a colour and lean on the NAME for the rest, which is what this estate's slug + tape
already do — the tick is the board-level half neither of them draws.

Sources: [Healey, Perception in Visualization](https://www.csc2.ncsu.edu/faculty/healey/PP/) ·
[CatPAW](https://arxiv.org/pdf/2602.06792) · [Palettailor](https://ar5iv.labs.arxiv.org/html/2009.02969) ·
[Figma multiplayer](https://www.figma.com/blog/multiplayer-editing-in-figma/)

---

## 10 · What the synthesizer should decide

1. **Where the lap is drawn.** The corner and the margin price out identically (2.67 px at the
   best cell, negative at 16×16); the margin only buys a free stacking axis. The tape has
   33.58 px and already answers "who wrote this" on both pointers. The fork is: a hairline
   in-cell mark with a stated ≤9×9 scope, or the lap moves to the tape and the roster and the
   board says WHICH PENCIL by colour alone — which is exactly the claim the tin was built to
   avoid, so the choice is the design's whole thesis and belongs to the owner's re-look (U-10).
2. **The ring row's owner and wording** — reported-with-three-alphas, handed to MRK-LIVE.
3. **The tape's ground** enters the AA table and the gate, or the family declares the tin unfit
   for the tape and the tape takes the slug in the foreground ink (an estate row either way).
4. **The cursor ring's lap** — say the collision, or draw it.
5. **`writtenPositions()`** as the declared accessor, so the session start stamp stops parsing
   `unknown`.
