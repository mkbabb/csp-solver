# ACC-GRAPHITE — pass 1 SYNTHESIS (the spec)

T9-W7 convergent design loop · §3 the accent family · §4 the fill meter · §12 multiplayer
chrome · mark M07. Synthesizer: Fable 5.1. Input: the pass-1 research record
(`../../research/ACC-GRAPHITE/README.md`, ADJUST on three points), the r0 censuses (R2, R5,
R6), the charter, and the owner's four frames under `marks/`. The frontend-design skill was
invoked first; §0 is its two-pass method applied.

Nothing here closes a mark (U-10). No product file was touched; the spec is the only write.

---

## 0 · The plan, and the review against the tells

**Subject.** A pencil-and-paper sudoku. The family's one sentence: colour means who or what
made this mark, and nothing else. Every UI state is what a pencil can do without changing
colour — press harder, go round twice, make a tick.

**Tokens (no new hexes; three fewer).**

| role | token | light | dark |
|---|---|---|---|
| the pencil (state, your solo hand, the ring, the tally) | `--color-pencil-graphite` → `--grid-line-color` | `hsl(0 0% 15%)` = `#262626` | `hsl(48 10% 80%)` = `#d1cfc7` |
| the print (a clue) | `--color-foreground` | `#0a0a0a` | `rgb(237,236,233)` |
| the quiet rung (unchanged, no new stop) | `--ink-press-quiet` 68% / `--ink-press-rule` 55% | 5.23 / 3.53 | 6.06 / 4.36 |
| a person's hand, when more than one is here | `oklch(var(--peer-ink-l) 0.11 h)` | L 0.5 | L 0.8 |
| RETIRED | `--color-focus-sketch` `#3a7bc4`, `--color-progress-ink` `#8b5cf6`/`#7c3aed`, `--color-crayon-blue` `#4a90d9`/`#6aabeb`, `rgba(196,181,253,…)` ×2, the `#2563eb` fallback | | |

**Type.** Unchanged: the glyphs are `HandwrittenGlyph` paths in every case. The authorship
seam moves from hue to WEIGHT: a clue is printed (heavier, `--color-foreground`), your digit
is drawn (4.5 units, graphite). No rendered string changes; zero woff2 re-cut.

**Layout.** Unchanged. The family draws on the board's existing geometry: the cell's ghost svg
(16.67 units of bleed), the frame rect (`FRAME_X_PAD 12 / FRAME_Y_PAD 0`), the roster row.

**Principles.**
1. State is a pencil's behaviour, never a tint of grey: pressure, passes, ticks.
2. Weight is stated as a RATIO to the frame line and gated that way.
3. A gauge must have a form no rule has.
4. Colour arriving on your own digits means someone else is here.
5. Delete before re-pointing: a literal with no job dies rather than turning grey.

**The review.** The generic version of this brief is "swap the blues for greys" — Material's
monochrome pattern, and the charter's own literal prototype G1, which the research killed
(a 68% grey trace under 3:1, a grey ring at rank 49). Three things in the plan were the
default and were changed:

- *A heavier single stroke for the ring* (the research's G4) reads as a printed block. Changed
  to TWO passes of the pencil on two seeds — the weight is bought in the estate's own retrace
  idiom (`scribbleUnderline`, `.join-pose`), and the second seed answers R3's "CAD-precise"
  reading for free.
- *An offset graphite retrace for the meter* reads as a thicker frame edge. Changed to a TALLY:
  one tick per written cell around the inside of the frame, the `dealt ⊪` idiom the reader
  already has, expressed on the existing path with no second pose stack.
- *A graphite glow under the sparkle* is a grey smudge doing the violet glow's job. Changed to
  deletion — and the filter census drops 9 → 8 with its allowlist row, stated in §7.

Nothing here uses a tinted near-black (`#0a0a0a` is the estate's own foreground), a label
above a block, or ambient motion. The one memorable thing per surface: on the BOARD the
double-pass ring; on the FRAME the tally; in a ROOM your digits taking colour when a second
hand arrives. Everything else is quiet.

---

## 1 · The ring — the pencil goes round twice

**Form.** Tier 2 (keyboard focus, `:has(input:focus-visible)`) draws the cell's ghost rect
TWICE: the existing path, and a second `<path class="cell-ghost-retrace">` on its own seed,
inset one stroke width. The two passes fuse into one band with a wandering edge — which is
how a pencil makes a heavy line, and what `HandDrawnGrid.vue:598-609` says two seeds on one
rect do.

| | outer pass (`.cell-ghost-path`) | inner pass (`.cell-ghost-retrace`) |
|---|---|---|
| geometry | `wobbleRect(x, y, s, s)` seed `42+500+pos*7` (as shipped) | `wobbleRect(x+10, y+10, s−20, s−20)` seed `42+500+pos*7+3`, roughness 0.4, jagged |
| stroke | graphite, 12 units, opacity 1.0 | graphite, 12 units, opacity 1.0 |
| fill | graphite, fill-opacity 0.08 | none |
| draw-on | `ghost-draw-on 180ms var(--ease-ghostDraw) backwards` | same, same beat; the path string reversed so the second pass runs the other way round |
| at rest / hover (tier 1) | as shipped: 5 units @ 0.65, fill 0.06 | `display: none` |
| peer cursor (tier 4) | as shipped: their ink, 4 units @ 0.55, one pass | `display: none` |
| conflict (tier 3) | teacher-red 9 units @ 1 | `display: none` |
| focused + conflict (tier 2×3) | teacher-red 12 @ 1, fill 0.16 | teacher-red 12 @ 1 — pressed harder, twice round, in red |

**The weight, as a ratio.** Fused band = 12 + 10 = 22 cell-units = **1.41× the frame line**
(N × 0.7693 / 12; layout-fixed at every viewport). Rendered 10.76 CSS px at 1280; the outer
edge sits 6 units (2.9 px) outside the cell rect against today's 3.5. The law, written for the
gate: *the selection ring is the heaviest mark on the board by at least 35%, rank 1 of N²
with zero rivals within 10%.*

**The ladder it produces** (once round = a glance or a peer; twice round = your pencil is here):

    hover          ▏ one pass,  5 @ 0.65     0.32× frame
    peer's pencil  ▏ one pass,  4 @ 0.55     0.26× frame, their ink
    conflict       ▍ one pass,  9 @ 1.0      0.58× frame, red
    YOUR FOCUS     █ two passes 12+12, 1.0   1.41× frame, graphite
    focus+conflict █ two passes 12+12, 1.0   1.41× frame, red

**Ratios.** Ring over `--color-card`: 14.87 light / 11.99 dark (research §1.4, both engines).
Change-of-state (2.4.13) the same numbers. `prefers-contrast: more`: unchanged rules (already
at 1.0). Forced colours: the retrace is a `<path>`, never an `outline`, so
`gameCell.css:352-357`'s `Highlight` ring stands untouched — the research measured the
outline arm losing it; this spec does not have that arm.

**Mobile.** Same units, same ratio. Measure the ring's clearance to the adjacent rule at
393×699 dpr3 (the research's open row) — the band may cover the cell line as today's covers
half of it, and may not reach the neighbouring cell's interior.

**PRM.** Both passes land drawn (the existing `animation: none; stroke-dashoffset: 0` block
gains the retrace selector).

---

## 2 · The unit wash and your pencil marks — the same pencil, laid flat

- `.cell-peer` (the selected cell's row/column/box): `color-mix(in srgb, var(--color-pencil-
  graphite) 6%, transparent)`; `prefers-contrast: more` 12%. The value is tier 1's own
  `fill-opacity 0.06` — one number, the hover tint laid over the reach. Kept because the
  reach is a sudoku feature; re-inked because a selection is not an author.
- `.user-marks`: `color: var(--color-pencil-graphite); opacity: 1` (your hand, full pressure).
  The engine's `.pencil-marks` stay at 0.5 (`gameCell.css:29-36`, "the solver thinking in the
  margins"). The seam between your notes and the engine's peek is PRESSURE (1.0 vs 0.5) and,
  for centre marks, placement. Gated in §8 (G4b); declared as the family's residual risk for
  corner marks, which share the 3×3 placement.

`--color-crayon-blue` then has no job: the wash (re-inked), the ring's fallback (dead with
`--color-focus-sketch`), your marks (re-inked). **The family retires the fourth crayon**, the
`.crayon-blue` utility (`index.css:473`, "no text use") with it, after a census of the 13
CLASS hits (`selectors.ts` / prose data literals — none paints through the class per R2 §6;
the prototype proves it by grep + a zero-diff screenshot of the gallery). The remaining wax
is four crayons with jobs: green/orange/rose (difficulty), gold (done).

---

## 3 · Authorship — printed and drawn

`HandwrittenGlyph.vue:82-90`, the seam that is one line:

| | a clue | your digit | a peer's digit | a revealed answer |
|---|---|---|---|---|
| ink | `--color-foreground` | `--color-user-ink` → graphite (solo) / your room ink | their room ink | `url(#solver-ink)` |
| stroke units | **6** (was 5) | 4.5 (unchanged) | 4.5 | 5 |
| rendered @1280 | 6.89 px | 5.17 px | 5.17 | 5.74 |
| the seam | **1.33× weight + 1.19:1 value** (was 1.11× + hue) | | colour | colour |

The clue moves, not your digit: the owner has read your 4.5-unit hand for nine tranches, and
a clue is the thing that came printed on the sheet, so it is the heavier of the two. The
fallback `var(--color-user-ink, #2563eb)` becomes `var(--color-user-ink,
var(--color-pencil-graphite))`. Arm B for the prototype: clue 5.5 / entry 4.0 (1.375×) — the
instrument in §8 G4 picks; the phone's legibility floor (your digit ≥ 1.6 CSS px of stroke at
393 dpr3) is the reason arm A is the default.

Spoken layer unchanged: `given clue 5` / `your entry 1` / `<slug>'s entry 7` (W3's).

---

## 4 · The meter — a tally around the inside of the frame

**Form.** One tick per written cell, laid around the inside of the frame line, in graphite at
full pressure. The `dealt ⊪` tally the reader already knows, wrapped round the board. The
first keystroke makes one tick at the top-left; the third makes a tally; nobody needs a
label to know what it counts.

| | shipped | spec |
|---|---|---|
| geometry | `generateFrameTraceFrames`, 4 grain-baked poses, `pathLength 1000` | unchanged |
| ink | `--color-progress-ink` 8 units @ 0.95 | `--color-pencil-graphite` **10 units @ 1.0** |
| offset | in registration (fused with the rule, 2.92:1 light — under the floor) | `.progress-pose { transform: scale(0.984); transform-origin: 50% 50% }` — the shipped `.join-pose` ruling, one stroke width INWARD |
| the fill front | `stroke-dasharray "1000 1000"` + `dashoffset 1000·(1−p)`, 240 ms tween | `stroke-dasharray` = `"t g" × k` + `" 0 1000"`, where `k` = cells written, pitch `P = 1000 / writable`, `t = 0.57 P`, `g = 0.43 P`; **no dashoffset, no tween** |
| at 0% | not rendered | not rendered — a tally with no marks is nothing, honestly |
| at 100% written | a closed second ring | a stippled ring, 57% ink; at the win `.solve-success` fades it (500 ms, unchanged) and gold owns the frame |
| overhang | 6.00 px above the board box | 1.00 px chromium / 2.00 webkit / 1 phone (research §4.3) |
| the join trace | `.join-pose` scale(0.984), peer ink, continuous | **scale(0.968)** — two stroke widths in, so the peer's continuous ring lands just inside the tally; distinct by form, colour and offset |

For a 9×9 with 51 writable cells: P = 19.6, t = 11.2, g = 8.4 pathLength units ≈ 44/33
viewBox units ≈ 28/21 CSS px at 1280, 16/12 on the phone, 6.4 / 3.65 px thick. For 16×16
(~150 writable): 3.8-unit ticks ≈ 9.5 px desk, 3.5 px phone — a stipple, measured not assumed.

**Why no tween.** A tick is one stroke of the pencil; you do not watch it grow. The 240 ms
`stroke-dashoffset` transition in `HandDrawnGrid.vue:586-592` dies with the dashoffset; the
`opacity 500ms` bow-out stays. `stroke-dasharray` lists of changing length are not animatable,
so the mechanism is PRM-identical by construction — one fewer no-preference arm.

**Ratios.** Tick ink over the paper it sits on: 14.87 light / 11.99 dark (measured under the
research's offset arm). The 1.4.11 reading is taken over the tick's own footprint OFF the
rule rows; the form, not the number over the rule, is what makes it a gauge.

**A11y.** `role=progressbar aria-label="board fill" aria-valuetext="board N% filled"`
unchanged (W3's). No visible label, no first-run whisper: the mark teaches itself in three
keystrokes, and the owner's re-look is the gate on that claim.

**Ledger correction carried.** `index.css:267-278`'s 3.57/3.35 dies with the token; the R2
ledger row for the meter is re-cut to the measured 2.92 (HEAD) in the wave record.

---

## 5 · The room — colour on your hand means someone else is here

**The rule, one sentence, three surfaces.** Your digits, your roster swatch and (for the §11
families to inherit) your head-left mark are graphite while you are the only one on the
board, and take YOUR room ink the moment the roster holds a second live player.

| state | your cells | your roster row | a peer's cells / row |
|---|---|---|---|
| solo (no room) | bind nothing → graphite | no roster | — |
| in a room, alone | bind nothing → graphite | graphite swatch, `you` | — |
| in a room, ≥2 live | `inkFor(inkIndex[selfId])` bound on every cell you authored | your swatch in the same ink | their ink (as shipped) |
| the last peer leaves (`bye` or the 45 s expiry) | binding drops → graphite | graphite | row leaves on the 740 ms wash |

**Mechanism** (substrate, one commit with the token move): `useSession.ts` gains
`selfInk = computed(() => players.length > 1 ? ident.inkFor(inkIndex[selfId]) : {})`;
`authorInk` (`:402-411`) stops skipping `selfId` when `selfInk` is non-empty; the roster's own
row binds `selfInk` inline; `mint()` is unchanged (every id already takes an index, `:527`).
Solo binds 0 cells and 0 rows — byte-identical, the R5 constraint 5.

**Motion.** None of its own. The swap is instant on the join event's beat 0; the join trace
(1180 ms, the peer's ink, `.join-pose`) and the roster fold are the motion, and they already
exist. A pencil does not change colour mid-line. PRM-identical.

**What this buys M14.** On your own screen you now see the colour the room sees you in (R5
F1 cured; I2 turns GREEN). The peer cursor ring stays lighter than yours on every axis: one
pass, 4 units, 0.55, their ink, against your two passes at 12 and 1.0.

---

## 6 · The guard — achromatic by ruling

No change to the ribbon: `--color-foreground` words at 19.45:1, `--color-muted-foreground` sub
at 4.65 / 7.69 (gated), the destructive verb at `strokeWidth 2.5` + an 8% graphite ground
against `keep` at 2. The ruling is written into `GameGallery.vue`'s guard comment: *the confirm
is told by weight and words; it takes no colour because nobody made this mark.* Gate G10
records 0 chromatic pixels on the armed ribbon — and must ARM it in both engines (r0 and the
research reached it in chromium only; the webkit holdout is declared at row grain until the
probe's click path is fixed).

---

## 7 · What dies, and the one number that moves

| dies | where |
|---|---|
| `--color-focus-sketch` (1 decl, no dark arm) | `index.css:219-222` |
| `--color-progress-ink` (2 decls + the 3.57/3.35 ledger comment) | `index.css:267-278, :403-407` |
| `--color-crayon-blue` (2 decls) + `.crayon-blue` + the "focus wax" comment | `index.css:173, :381, :456, :473-475` |
| `rgba(196,181,253,0.3)` / `(…,0.6)` drop-shadows + `transition: all 200ms` | `GameControlPanel.vue:2080-2090` |
| the `#2563eb` fallback | `HandwrittenGlyph.vue:85` |
| the 240 ms dashoffset tween | `HandDrawnGrid.vue:586-592` |
| the sparkle's allowlist row | `filterBudget.ts:157-161` |

**The filter census goes 9 → 8.** The law is "never grows" and "exact match both directions";
the allowlist loses one row in the same commit, `FILTER_BUDGET_UNION_AREA` is re-derived
smaller (−900 CSS px² desk). Every document that quotes "9" as the number (r0 R6 §3.4, the
wave spec's π-guard) is re-cut to 8 in the wave record; the gate's exact match is the truth.
If the chair refuses to touch the count, the fallback is the research's arm — `drop-shadow(0
0 2px color-mix(in srgb, var(--color-pencil-graphite) 30%, transparent))` — and the census
stays 9. Stated so the agglomerator decides it, not the prototyper.

Nothing is minted: 0 hexes, 0 timing constants, 0 ramp stops, 0 filters, 0 rendered strings.
`--color-user-ink` is not retired: its default becomes `var(--color-pencil-graphite)` in `:root`
and `.dark` (24 sites, 13 files, untouched), and its print arm `#000` stays.

---

## 8 · Born-RED gates (each written before the cure, red at HEAD unless marked)

| id | asserts | HEAD |
|---|---|---|
| G1 census | chromatic pixel count rest = focused = mid-board (±0.1% viewport), 8 cells (desk/phone × light/dark × chromium/webkit); dark residue BINNED by 10° band and each bin named to a token or an exception | RED: +27% desk, +152% phone |
| G2 ring weight | selected cell's peak thickness (chamfer DT, research §1.2) rank 1 of N², 0 rivals within 10%, at focus and mid-board, 8 cells; band ≥ 1.35× the frame line; clearance to the neighbour's interior ≥ 0 px at 393 dpr3 | RED: 0.449×, rank 3–49 |
| G3 tally form | the trace's painted footprint along the perimeter has exactly `k` ink runs for `k` written cells (k = 1, 3, 20); tick ink over paper (rows off the rule) ≥ 3:1 both themes; overhang above the board box ≤ 2 px | RED: 1 continuous run, 2.92:1, 6 px |
| G4 authorship | clue / entry rendered stroke thickness ≥ 1.30 in 8 cells; entry ≥ 1.6 CSS px at 393 dpr3 | RED: 1.11 |
| G4b marks seam | your corner mark ink / the engine's peek mark ink ≥ 1.8:1 painted, same cell size, both themes | RED: crayon-blue vs graphite (hue, not pressure) |
| G5 kinship | R2 rows 1/2/4 GREEN with `--color-focus-sketch` / `--color-progress-ink` / `--color-crayon-blue` UNDEFINED on the live root (`getComputedStyle` = ""), row 5 still GREEN, row 3 subject-count guard standing | RED: 4/1 |
| G6 self-ink | R5 I2: your swatch on your page = the colour the peer's page paints you, ≥2 live; solo binds 0 cells / 0 rows | RED (both engines) |
| G7 consumers | `consumers.mjs`: no token with a hex and zero consumers; grep `196, 181, 253` = 0; grep `#2563eb` = 0; grep `crayon-blue` in `src/` = 0 | RED |
| G8 π | `filterBudget` exact match at 8 both directions, both engines, both regimes, hovered and at rest; union area ≤ HEAD − 900 px² | census row (GREEN by the allowlist edit; RED if the row is left in) |
| G9 forced colours | focused cell `outline-color` is the system Highlight (chromium), the retrace `<path>` paints no outline; print: glyph, grid, ring, tally all `rgb(0,0,0)` | GREEN at HEAD — regression guard |
| G10 guard | armed ribbon chromatic px = 0, ARMED in both engines | GREEN chromium; webkit holdout declared |
| G11 ink pressure / copy / font | `check-ink-pressure` unchanged in three scopes; `check-copy-register` 0 new; `check-font-coverage` 0 new glyphs | GREEN — must stay |

---

## 9 · Prototype brief (pass 1 → PROTOTYPE)

Build in a throwaway `git worktree` under the scratchpad (source patch, never committed;
banked as `.diff` under `evidence/w7/loop/pass1/prototype/ACC-GRAPHITE/`), dev server
`127.0.0.1:4237 --strictPort` (next free in 4230–4249 if taken), a scratch Playwright config.
Nine files, in this order: `index.css` → `gameCell.css` → `gridPaths.ts` (inset retrace rect)
→ `useGameCell.ts` / `DigitCell.vue` (second path, `pathLength="1"`) → `HandwrittenGlyph.vue`
→ `HandDrawnGrid.vue` → `useSession.ts` → `GameControlPanel.vue` → `filterBudget.ts`.

**Screenshot poses** (crops ≤ 150 KB each, ≤ 12 total, ≤ 400 KB; each cited):
1. ring, desk 1280 light + dark, chromium + webkit — 244×244, selected cell + 8 neighbours
   (beside the research's `ring-control-*` for the owner's five-second read)
2. ring, phone 393×699 dpr3 light + dark, chromium — the clearance row
3. tally at k = 1, 3, 20 and at 100% written, desk light — 300×44 at the board's top-left
4. authorship: a clue beside your digit, arms A and B, 2 cells, light + dark
5. the room: three of your cells before and after the peer arrives (one crop pair), chromium
6. the gallery, zero-diff against HEAD (crayon-blue's 13 class hits paint nothing)

**Censuses re-run unchanged** (r0's instruments, `OUT` redirected first — the research's trap):
`hue-census.probe.ts` (G1), `accent-kinship.probe.ts` (G5), R5 `instruments.spec.ts` I2 (G6),
R3 `wobble.probe.ts` (report σ for the two-seed ring — MRK's gate, not this family's; hand it
across), R3 `budget.probe.ts` (G8), the research's `graphite-arm.probe.ts` §C (G2) and §meter
(G3, extended with the run count), `consumers.mjs` (G7), `scripts/check-ink-pressure.mjs`,
`check-copy-register.mjs`, `check-font-coverage.mjs` (G11), `law-probe.mjs` L1/L4/L5/L6.

**Numbers that mean success:** G1 three equal counts in ≥ 7 of 8 cells and the dark residue
binned; G2 rank 1 / 0 rivals in all 8 at focus, ≥ 7 at mid-board, band 1.35–1.45×; G3 k runs
for k ticks at 1/3/20, ≥ 3:1, overhang ≤ 2 px; G4 ≥ 1.30 in 8 cells; G6 I2 GREEN both engines;
G8 exactly 8; the six crops banked for the owner. Anything short is reported as the number,
not smoothed.

---

## 10 · Couplings (stated, not resolved)

- **MRK-LIVE / MRK-ABS / MRK-WASH.** The retrace's second seed IS a wobble-law move. Under
  MRK-LIVE both passes need pose variants on the beat; under MRK-ABS both seeds sit inside the
  absolute band. This spec's ring composes with any of the three; its gate is weight, theirs
  is σ.
- **PLR-SELF / PLR-COUNT / PLR-PLACE.** §5's rule (graphite alone, your ink when ≥2) is the
  law the head-left mark inherits; PLR-SELF already agrees (F1). PAL-WALK / PAL-TIN clear a
  reserved set of FOUR crayons under this family, not five.
- **ACC-SIX / ACC-FIVE.** Incompatible by centre; not merged here.
- **MOT-LADDER / MOT-VERB.** This family deletes two transitions and adds none; the ring's
  `ghost-draw-on 180ms` is theirs to name.
- **W3.** No new live region, no new string; the tally's progressbar text stands.
