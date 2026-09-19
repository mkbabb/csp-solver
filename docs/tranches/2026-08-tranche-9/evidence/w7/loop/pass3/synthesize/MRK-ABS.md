# PASS-3 SYNTHESIS · MRK-ABS · One visible hand

Section §5 wobble law · §6 focus rings (registry-v2 conv 78). Synthesizer: Fable 5.1. Inputs:
`../research/MRK-ABS/README.md` (both engines at `74a2b5d9`, one 7.6 KB crop, the closed form
validated live to 0.15 px), `../CHAIR-RULINGS.md` (§6.5 · §6.6 · §6.7 · §6.11 · §7), the pass-2
synthesis and critique, registry-v2 §2.4/§2.5, the r0 R3/R6 censuses, the owner's frames.
Read-only on the product. The frontend-design two-pass method was followed: plan → tell
review → spec. A DELTA on the pass-2 spec; every moved row carries its number.

Every number is a pass-3 measurement at `74a2b5d9` (boardPx **556** at 9×9/16×16, 412 at
4×4, 1280×800) unless it says PASS-2 (boardPx 636, `a8fee1f5`) or ARITHMETIC (the validated
form `A(cs) = cs·((1−f)/2 + 0.15)/1.3 − (W + hs)/1.3`).

---

## 0 · Plan, then the tell review

**Tokens.** Colour: `--color-focus-sketch` light `#3a7bc4`, dark arm `var(--color-crayon-blue)`
= `#6aabeb` (an alias, zero new hex, laws 18/23) — **conditional on one measurement this pass
names** (§2.2). Painted: token 4.289 card / 4.188 page light, 7.696 / 7.863 dark; board ring
3.942 light at 0.95; HEAD's dark board ring is 3.690, not the 5.3 its comment claims.
Geometry, ONE frozen constant set: `RING_GEOMETRY = { wanderUnits: 5.4, inset: 0.86 }` —
`kW4` LEAVES it for the gate's own file (the critic's row: nothing in the product reads it).
CSS pair: `--focus-ring: 2px solid var(--color-focus-sketch)`, `--focus-offset: 3px`.

**Type.** None.

**Layout.** Two surfaces, one hand. The board's mark sits inside its square — and where the
square is an EDGE cell, the frame runs through it (the grid's own design, `FRAME_X_PAD 12`),
so the mark crosses the frame and must be legible ON it:

```
  board edge                    interior
  ##|####  +=====+  |   +=====+   |     ## frame band, 12 u inside col 0, stroke 12
  ##|####  | (0) |  |   | (1) |   |     == the ring, stroke 7, at f = 0.86
  ##|####  +=====+  |   +=====+   |     the ring's LEFT stroke is drawn ON the frame:
  ##|####          cell line       |     −7.6 px at 16×16, every edge cell, both engines,
                                          unreachable by any inset < 40 % of the cell
  the law is CONTRAST where they meet, SEPARATION where the geometry allows it (≤ 14×14)
```

**Principles.** (1) The wander is one constant in the geometry (`maxDisplace = 5.4` exactly, a
statistic of a declared window). (2) The ring never enters a neighbour (MA-N) — and at the
heaviest tier that is what the inset buys. (3) **The ring is legible on every ground it
meets** — paper, a cell line, a subgrid line, the frame — at ≥ 3:1 from PAINTED bytes in both
themes (MA-L, replacing MA-R). (4) Off the board, one focus colour per theme, one width, one
offset, same-frame, square corners, and the browser's ring nowhere. The memorable thing per
surface: on the board, a hand-drawn mark that wanders like the grid's own hand; off it, one
blue ring in the whole product.

**Tell review.** The generic answer to "the ring sits on a dark rule" is a two-colour
knockout ring (a paper-coloured halo under the ink — Soueidan's pattern). REFUSED on idiom: a
crayon is wax and COVERS what it crosses (law 19); a halo erases it, which is a UI ring's
gesture, not a pencil's. The generic answer to "the inset regresses at 16×16" is a per-size
inset table — refused (one constant). The generic answer to the dark arm is "dark mode gets
the brighter blue because dark mode does" — refused as a reason; the alias ships on laws
18/23 AND on a painted number at its weakest crossing, or it does not ship. What the mirror
removed: `kW4` from the product; MA-R as a gate (it is a reading now); the sentence "the ring
never shares ink with the rule" (false at 9×9 and 16×16 on every edge cell, measured); the
"board 18 on B" comment; the claim that the 2 px thickness arm covers the phone (1.97 px at
16×16, boardPx 365 — it does not).

---

## 1 · §5 · the wobble law (delta on pass 2 §1)

### 1.1 The law, re-cut to what the geometry can honour

> The ring's wander is one number in ghost units, `RING_GEOMETRY.wanderUnits = 5.4`, at every
> board (`roughness = wanderUnits / (0.015 × f × cellSize)`, so the library's length law
> collapses to the constant); it is drawn at `f = 0.86` of the cell, centred, on 4 segments a
> side. σ is a statistic of window W4 (four edges, middle 80 %, pooled): `5.4 × 0.443 = 2.392`
> units. **It never enters a neighbour. Where it meets a rule it stays legible — it does not
> promise to stay off it.**

### 1.2 Why the inset survives — the reason changed

Pass 2 argued the inset on MA-R ("the ring never shares ink with the rule"). At this base, with
the rule's OWN wobble (cell line max displace 5.688 u, subgrid 9.95 u — `gridPaths.ts:448`,
`:478-520`) and the rule KIND each side faces, MA-R is false for the worst cell at 16×16 in
BOTH geometries (`readings/r2-matched.txt`: proto −3.20 / HEAD −3.53 u vs a cell line; −9.15 /
−9.23 vs a subgrid line; −20.06 / −19.69 vs the frame), and the two geometries cross at
N = 14.07 — the inset helps at ≤ 14 and costs 0.5 u (0.28 px) at 16. That argument is dead
and the spec says so.

What the inset DOES buy, ARITHMETIC on the validated form, 16×16, tier 2×3 (stroke 10,
hs = 5), W = 5.4:

| f | A = ring's outer ink inside its own cell edge | MA-N |
|---|---|---|
| 1.00 | 7.212 − 8.000 = **−0.788 u = −0.44 px** | the heaviest ring ENTERS the neighbour |
| 0.86 | 10.577 − 8.000 = **+2.577 u = +1.43 px** | clears |

(tier 2, hs 3.5: f = 1 gives +0.365 u = 0.20 px, a hair; f = 0.86 gives +3.731 u.) So the
inset is the one lever that keeps the invalid-and-focused ring inside its square at 16×16
with the wander the σ band needs. `W = 4.0` at `f = 1` would also clear (+0.27 u) but puts the
σ ratio at 0.54 / 0.53 / 1.20 — two boards at the band's floor; 5.4 sits at 0.74 / 0.71 / 1.62,
mid-band. One constant set, both numbers named. The 0.90 alternate stays banked for U-10.

### 1.3 MA-R becomes a READING; MA-L becomes the gate

MA-R (boundary B, ring vs each rule it faces) is banked per board × rule kind × tier as a
table from `probe/r2-matched-ordinate.mjs` (matched ordinate, real rule path, all four poses,
worst cell) — positive at ≤ 14 for cell lines, negative at 15/16 by the grid's own wobble,
negative against the frame everywhere. It is never asserted.

MA-L, the gate: at the two worst crossings — cell 0's left side (the FRAME) and a cell whose
side faces a SUBGRID line — at 9×9 and 16×16, light and dark, both engines, the ring's painted
band median vs the rule's painted band median at the SAME pixels read unfocused, ≥ 3:1 (WCAG
2.4.11's adjacent-colour arm), and the ring's band vs paper ≥ 3:1. Painted bytes only: the
grid is grain-baked and boiled, so its ink never reaches its token (ACC-FIVE's critic's
1.4.11 painted-line law); the token arithmetic (light 4.101 / dark 3.251 HEAD; light 3.771 /
dark **1.703** aliased) is STRUCK from the claim and kept as the reason the row exists.

The thickness arm (2.4.11's alternative, ≥ 2 CSS px): met on desktop (2.994 px at 16×16),
NOT on the phone (1.97 px at boardPx 365). The claim is the contrast arm; the thickness arm is
a reading.

### 1.4 The one deleted branch — unchanged, priced at this base

`gridPaths.ts:53 cellSegments = boardSize >= 16 ? 2 : 4` → `4`. Resident `d` bytes at 16×16:
58,761 → 119,894 B (this base's count; PASS-2 read 114,263). The 16×16 ring gains the vertices
the wobble law needs; that is the cost and it is once per deal into the LRU.

### 1.5 The states on the board — the rows are MRK-LIVE's (chair §6.6)

This family's `gameCell.css` rows — tier 2 stroke-opacity 0.95, the two dead fallbacks at
`:246/:248`, the `:243`/`:315` modality comments, the `:294-303` neutraliser that dies with
`index.css:727` — travel to MRK-LIVE's diff, which rules the rank (order 3 > 2 > 1 > 4, both
media arms; peer stays 0.55 / 0.80). The prototype REPLAYS those hunks, cited as MRK-LIVE's,
so its measurements are on the section's sheet; they leave this family's diff at the fold.

### 1.6 The constants' home — smaller

`RING_GEOMETRY = Object.freeze({ wanderUnits: 5.4, inset: 0.86 })` in `pencilConfig.ts`,
imported by `gridPaths.ts`. `kW4: 0.443` moves to the gate's file (`e2e/…` or the probe) —
the product never read it. The comments rewritten from THIS base: the honest ceiling table
(cell 18/16, subgrid 15/14, frame flush 13/12, frame inset 6/6 at f = 0.86, W = 5.4), the
crossover at N = 14.07, MA-N's numbers above, σ in the reader's px (0.758 / 1.023 / 1.023 px;
1.11 % / 2.50 % / 4.45 % of the drawn edge), the bytes.

### 1.7 σ, in the reader's px, and G-ABS-1's band derived

| board | px/u | σ px | drawn edge px | σ ÷ edge |
|---|---|---|---|---|
| 4×4 | 0.31692 | 0.758 | 68.14 | 1.11 % |
| 9×9 | 0.42769 | 1.023 | 40.87 | 2.50 % |
| 16×16 | 0.42769 | 1.023 | 22.99 | 4.45 % |

Constant in units; the reader sees it 4.00× wider at 16×16 than at 4×4 — named, accepted (a
hand's tremor is a length, not a fraction; the grid's own rules carry the same absolute
wander), and the alternate (a fraction of the edge) is refused with the ratio it would give
(0.54 at 9×9, the band's floor). G-ABS-1's band `[0.5, 2.0]` is DERIVED from the record: the
grid's own inter-rule spread `[0.437, 2.287]` (`r0/r3-marks/R3-census.md:55-57`, `:72-76`),
rounded in, floor ≥ 7× the CAD pole (0.064, `:57`); the gate states the quantity (dimensionless
only when both σ come from ONE run of one instrument in one window) and names the run.

---

## 2 · §6 · focus rings (delta on pass 2 §2)

### 2.1 The graded law — unchanged

> ON the board, focus wears the house hand (tier 2). OFF it, focus wears the token: `2px solid
> var(--color-focus-sketch)` at `outline-offset: 3px`, per theme, same-frame, tracing its
> element's own corners. The browser's own ring appears nowhere.

`@layer base` at (0,1,0) (pass 2 §2.2), the `.cell-native-input` / `.gallery-viewport`
exemptions, the forced-colors arm: unchanged. No `@property` is needed here — `--focus-ring`
and `--focus-offset` are declared constants, not measured tokens; MRK-LIVE's
`--focus-ring-outset` is the estate's first registration and is CITED as chair §6.5's home,
not minted twice.

### 2.2 The dark arm — the alias, decided by its weakest crossing

`.dark { --color-focus-sketch: var(--color-crayon-blue); }` — the crayon follows the crayon
into the night (law 18), zero new hex (law 23). HEAD's comment ("Dark mode keeps crayon-blue,
5.3:1") is false on the surface: the dark ring paints `rgb(58,123,196)` and reads 3.690 on
the board; the alias reads 7.041 there and makes the comment true. That is the win.

**The condition.** The alias's weakest pixel is the dark FRAME crossing (§1.3): a light blue
on a light-grey rule whose painted ink no token predicts. So the alias ships iff MA-L reads
≥ 3:1 at cell 0's frame crossing in DARK from painted bytes, both engines, 9×9 and 16×16. **If
it reds, the alias is REFUSED and the dark arm is HEAD's one value** (`#3a7bc4`, 3.251 vs the
frame by token) — this family concedes the token axis to MRK-LIVE and keeps its geometry and
its chrome; no third value is minted. Either way `index.css:219`'s comment names the arm's
measured reading (the rebased R1, chair §6.7 — LANDED by MRK-LIVE; this family's comment
satisfies the rebased law in both outcomes).

Chair §6.11: `--color-crayon-blue` reconciles at the accent fold. The alias is written to the
token; if ACC-GRAPHITE's retire arm wins, the dark hex's home moves under this token's own
name — the value survives, the name follows the fold.

### 2.3 The seventh rule — a four-site deletion, not one line

`index.css:727-732` (`.sudoku-cell:focus-within`, the charter's ":779" at its pass-2 line)
DIES with: `gameCell.css:294-303` (the neutraliser that exists only for it); the prose at
`gameCell.css:7` and `:10-11` and `DigitCell.vue:33-34` that certify it "preserved exactly".
The CLASS `.sudoku-cell` stays (`useKeyboardViewport.ts:61`, `DigitCell.test.ts:344`, six e2e
specs). G-ABS-9's grep widens to ANY focus pseudo-class (`:focus`, `:focus-within`,
`:focus-visible`), which is what finds the 2 px radius at `:731` and the wordmark's 5.6 px —
both declared DELTAs now (the wordmark's was the one sentence missing).

### 2.4 The fade, the radius, the bespoke rules — unchanged (pass 2 §2.3–§2.5)

Both carriers → `transition-[color,background-color]`; both minted radii DIE (the deck's 8 px
and the logo's 5.6 px, each a declared DELTA with one crop between them); the six bespoke rules
disposed as the pass-2 table says; the toggle's ornament offset (+54 px desk, a RANGE) keeps
W2 §2.4's seam and takes the token's colour only. Chair §6.5's `, 0px` strike on
`--toggle-bleed` is MRK-LIVE's row (three sites); cited, not duplicated.

### 2.5 The instrument — executable in WebKit

G-ABS-4's arrival clause and G-ABS-3's band ran chromium-only in pass 2 (WebKit's Tab reaches
form controls only). The recipe this lane proved on both engines: programmatic `.focus()`
plus ONE key press sets keyboard modality and `:focus-visible` matches on any focusable
element. The census becomes a DOM WALK over the focusable set (every `button, a[href],
[tabindex]:not([tabindex="-1"]), input` in document order, visibility-filtered), never a Tab
walk; both engines, both themes. The two DEV stops are subtracted by running the census on a
BUILT PREVIEW (`vite preview` in the worktree, `PLAYWRIGHT_BASE_URL`), never by name. The RING
BAND graft gains the per-side form (the `.drawer-tab` pool reads `input.cell-native-input` on
its left band through `elementFromPoint`; a per-side outward read gives 3.21 / 5.72, PASS-2).

### 2.6 Mobile, copy, motion — unchanged (pass 2 §2.7–§2.8)

2 px at every viewport; the dock sheet settled ≥ 700 ms; the sticky `.icon-btn` named as W2's
one declared clip. No copy. No motion minted; one fade removed. `RING_GEOMETRY` is geometry,
beside `BOIL_CONFIG`, not in it.

### 2.7 A reading, not a gate: focused vs hovered at the same pixels

SC 2.4.11's change-of-state ratio on a cell that is HOVERED then keyboard-focused is the ring
(blue 0.95) against tier 1's graphite at 0.65 on the same pixels — ARITHMETIC ≈ 1.6:1 in
light. It is a compound state no reader reaches without a pointer AND a keyboard on one cell,
the hue changes, and the unfocused state 2.4.11 means is the unhovered one (3.94). Banked as
a number in the prototype's log so nobody writes "every pair ≥ 3:1" without it.

---

## 3 · Plan (files, order, what dies)

Fresh worktree off `74a2b5d9`; replay the pass-2 worktree `wf_8630d340-e56-46`'s diff (file
copy if `git` across worktrees is refused — state the route); conflicts with the fold's files
resolve toward the fold and are named.

1. `pencilConfig.ts` — `RING_GEOMETRY = { wanderUnits: 5.4, inset: 0.86 }`; `kW4` out; the
   §1.6 comments (ceiling table, crossover, MA-N numbers, σ px, bytes).
2. `gridPaths.ts:41-70` — `cellSegments = 4`; the inset rect; `roughness = wanderUnits /
   (0.015 × f × cellSize)`; the bytes comment at this base.
3. `index.css` — `:445` sweep dies; the `@layer base` block; the `.dark` alias (§2.2, with
   its refusal branch written as a comment naming the gate); `:219` comment names the dark
   arm's measured reading; `:727-732` DELETED.
4. `gameCell.css:294-303` DELETED; `:7`, `:10-11` and `DigitCell.vue:33-34` prose corrected
   (the four-site edit — these hunks are shared with MRK-LIVE's diff and reconcile at the fold).
5. `OptionSelector.vue:52`, `AttributionCard.vue:45` — `transition-[color,background-color]`.
6. `HandwrittenLogo.vue:544`, `DrawerTab.vue:151` — DELETED (the logo's radius with it).
7. `GameCard.vue:436` (radius deleted), `StagingBand.vue:431`, `GameGallery.vue:1450`,
   `DarkModeToggle.vue:740` — rewritten to `var(--focus-ring)` / `var(--focus-offset)`.
8. MRK-LIVE's `gameCell.css` tier rows replayed for measurement, cited, not owned.
9. Gates (§5) in the same commit; the grid's W4 σ re-taken in the same run as the ring's.
10. r0 R3-a rows reported MOVED via diffs under `instruments/` (window; wash clause) — never
    written in r0.
11. Dist-bound suites off the worktree's built preview (never main's dist).

Dies: one board-size branch; `kW4` from the product; two focus rules and two minted radii;
`index.css:727-732` and its neutraliser and three prose contracts; the `outline-ring/50`
sweep; one 150 ms and one 200 ms outline fade; MA-R as a gate; the "board 18 on B" comment;
the false dark-mode comment. Nothing new is mounted.

---

## 4 · Prototype brief (pass 3)

**Build.** Fresh worktree off `74a2b5d9`; replay pass 2; the §3 delta (~40 lines net). Serve
from `<worktree>/web/frontend` on **127.0.0.1:4239** (`--strictPort`; next free in 4230–4249
if taken) via `npx vite --config <evidence>/vite.lane.mts --host 127.0.0.1 --port 4239
--strictPort` (two-line config, private `cacheDir: '<worktree>/.vite-cache'`; symlink
`node_modules` beside it if the plugins do not resolve — this lane's pass-2 trap). HEAD control
on main, next free port, named `74a2b5d9`. Scratch PW config from
`../research/MRK-ABS/probe/pw.lane.config.ts`, re-pointed. Deck route `?view=gallery`. Scope
every grid query to ONE `.board-shell` (the app keeps every game's model mounted — the −97.97
artifact). Node probes import pencil-boil's `dist` by absolute path or set `NODE_PATH`. Kill
both servers; the band reads empty at return; anything > 90 s to the background with a log.

**Crops (≤ 4, ≤ 150 KB, dpr 3, cited; the light board is already banked at
`../research/MRK-ABS/readings/crop1-…png`):** (1) cell 0 at 16×16, DARK, chromium, at f = 0.86
with the alias — the frame crossing this pass decides on, beside the research's LIGHT crop of
the same cell at HEAD; (2) the same cell at f = 0.90 (U-10's alternate); (3) the deck's centre
card focused, light, webkit — square corners, the token, the live face's clip unchanged; (4)
the armed `.guard-face` focused, dark — armed by hand (digit → wordmark → arrow → Enter).

**Censuses (copied and re-pointed, never in r0):** `hue-census.mjs` (the alias appears as an
alias row; otherwise byte-identical to `hue-census-HEAD.txt`); `law-probe.COPY.mjs` (R1 under
MRK-LIVE's rebased wording, reported as such; L1 9); the r0 wobble probe on W4 at
4×4/9×9/16×16 — ring AND grid in ONE run; `budget.probe.ts` 9/9 on BOTH engines (the control
reads 9/9 at HEAD), ghosts 16/81/256, every ghost `filter: none`; the r0 heading census
unchanged; `check-copy-register.mjs` 0/0/0; `lint:theme-tokens`, `lint:theme-selectors`,
`lint:ink`, `lint:motion`, `lint:knip`.

**Measure (both engines unless stated):** `probe/k-window` on the prototype's seeds (W4 σ per
board ±5 % of 2.392; the n = 4096 arm labelled a pencil-boil version canary, not a design
gate); `r2-matched-ordinate.mjs` at f = 0.86 — the MA-R TABLE per board × rule × tier, banked;
MA-N (boundary C ≥ 0) at tiers 7 and 10, every cell, every shipped board, desktop AND phone
(393×699, 16×16); **MA-L from painted bytes** — `r5-band.spec.ts` extended to both themes and
to a subgrid crossing, ring band vs rule band at the same pixels, cell 0 and cell N−1, 9×9 and
16×16 (the decision row for §2.2); DOM `d` = library `d` for the focused cell (pose 0 is the
shipped artifact); the RING BAND per side on every stop of the DOM walk × two themes × two
engines (≥ 3:1, `isTheRing` true on every authored stop); `arrival` on every stop (first sample
= the token, both engines via the focus + key recipe); the deck (reach 5, headroom 4.59 at
PASS-2's card air — re-read at this base, WHOLE, one owner); the dock sheet open at 393×699
after 700 ms; the toggle's ring painted > 0 px at 1280 and 393; `.live-face-slot` radius
identical focused/blurred; the §2.7 hover→focus reading; the phone trace on a quiet box only
(load < 2, PRM control); `spoken-gallery` 16/16, `access` 2.1/2.2/2.3, `a11y` 3.5, the
forced-colors arm (chromium by instrument); the six dist-bound suites off the built preview.

**Success is:** W4 σ 2.392 ±5 % at all three boards, ring and grid from one run, ratios inside
[0.5, 2.0]; MA-N ≥ 0 for 256/256 at tier 10 (expected +1.43 px at 16×16 desktop); MA-L ≥ 3:1 at
every crossing in both themes — and if the dark frame crossing reds under the alias, the
return says so and ships `#3a7bc4` as the dark arm with the same table; DOM `d` = library `d`;
every stop ≥ 3:1 from the band, both engines, both themes (4.19–4.29 light; 7.70–7.86 dark
under the alias, 4.29–4.38 under the one value); arrival same-frame on every shipped stop in
BOTH engines; one outline colour per theme, `auto` nowhere; the deck WHOLE and square; the
guard face measured; 9/9 both engines and 16/81/256; hue census = alias row only; copy 0/0/0;
the suites green; dist suites green off the preview. Anything short is the number, banked.

---

## 5 · Born-RED gates this family lands with

- **G-ABS-1 the ring and the rule in one window** — ring W4 σ ÷ grid W4 σ at the same board
  and viewport, from ONE run, ∈ [0.5, 2.0] at 4×4 / 9×9 / 16×16; the band's derivation cited
  (`R3-census.md:55-57`, `:72-76`). RED at HEAD (0.146 / 0.073 / 0.067 on r0's window).
- **G-ABS-2 one constant, its window in the sentence** — W4 σ per board ±5 % of 2.392 at the
  product's seeds, deterministic. RED at HEAD (segments 2 at 16×16). The n = 4096 arm is a
  version canary, labelled so.
- **G-ABS-3 focus contrast from the ring's own band, both engines** — every stop of the DOM
  walk ≥ 3:1, chromium + webkit (focus + key recipe), light + dark, `isTheRing` true, per-side
  form. RED at HEAD: WebKit UA 2.15, wordmark 2.70, deck 2.69.
- **G-ABS-4 one colour, same-frame, both engines** — same outline colour per theme on every
  stop, `auto` nowhere, first sample = the token; census on a built preview. RED at HEAD (five
  colours, seven `auto`); RED on the pass-2 build in WebKit (never executed there).
- **G-ABS-5 the dark arm is DECLARED and TRUE** — either `.dark` redeclares
  `--color-focus-sketch` (the alias) or the `:root` comment names the dark reading; in both
  outcomes the ratio in the comment matches the painted board-ring reading within 0.1. RED at
  HEAD (comment 5.3, painted 3.690).
- **G-ABS-6 MA-L, legible on every ground it meets (re-cut from MA-R)** — at cell 0 (frame)
  and a subgrid-facing cell, 9×9 and 16×16, both themes, both engines: ring band vs rule band
  at the same pixels ≥ 3:1, ring band vs paper ≥ 3:1, painted bytes. RED at HEAD in at least
  one arm or it is booked as a GUARD with its numbers (the alias's dark frame crossing is the
  reading that decides §2.2).
- **G-ABS-7 MA-N, no ring enters the neighbour, at the HEAVIEST tier** — boundary C ≥ 0 for
  every cell at every shipped board at tiers 7 and 10, desktop and phone. GREEN at HEAD (f = 1,
  W 0.375 clears +3.08 u at tier 10); RED on the `f = 1, W = 5.4` candidate (−0.788 u) — the
  witness that the inset is load-bearing.
- **G-ABS-8 pose 0 is the shipped artifact** — the focused cell's resident `d` equals
  `wobbleRect` recomputed offline with the same seed and `RING_GEOMETRY`. RED at HEAD.
- **G-ABS-9 a focus rule mints no radius — ANY focus pseudo-class** — grep 0 for
  `border-radius` inside `:focus`, `:focus-within`, `:focus-visible` blocks, AND
  `.live-face-slot`'s radius identical focused/blurred. RED at HEAD (3 rules: `index.css:731`,
  `HandwrittenLogo.vue:547`, `GameCard.vue:439`).
- **G-ABS-10 the constants cannot be mutated, and the product reads what it ships** —
  `RING_GEOMETRY` frozen with exactly `{ wanderUnits, inset }`; `kW4` absent from `src/`
  (grep); `BoilConfig` has no `ringSigmaUnits`/`ringK`. RED on the pass-2 build (`kW4` ships).
- **G-ABS-11 the dock sheet, opened** — unchanged (393×699, ≥ 700 ms, WHOLE except the sticky
  `.icon-btn` by name). RED at HEAD.
- **G-ABS-12 the seventh rule is gone at all four sites** — grep 0 for
  `.sudoku-cell:focus-within` in `src/`, grep 0 for `preserved` beside it in `gameCell.css`
  and `DigitCell.vue`, and `.game-cell:focus-within` has no rule; a focused cell computes
  `outline-style: none`, transparent background. RED at HEAD (1 rule, 1 neutraliser, 3 prose).
- **G-ABS-13 MA-R is a table, never a verdict** — the prototype's log carries the per-board ×
  rule × tier gap table with the crossover named; a gate that asserts "B ≥ 0 for every cell at
  16×16" is itself RED (a test that the spec's false sentence is not re-asserted). RED on the
  pass-2 build.
- Guards that must stay green: 9/9 both engines and 16/81/256; toggle ring > 0 px both
  viewports; spoken-gallery §3.7 one owner + WHOLE; forced-colors outline solid (chromium by
  instrument); phone trace 0 > 33 ms on a quiet box; copy 0/0/0; heading census unchanged;
  hue census = alias row only; `join-language-prm:153` green at 0.55 (MRK-LIVE's rank).

MOVED, not re-cut: r0 R3-a (window; wash clause), diffs under `instruments/`; π's boardPx row
(636 → 556 at this base; the ratio boardPx/1300 holds). OPEN by design: the dist-bound run
(off the preview); the quiet-box trace. U-10: crops 1–4 at the re-look; 0.86 vs 0.90 is the
one question; the frame crossing is shown, not hidden.

## 6 · Coupling with MRK-LIVE, stated for the agglomerator

INCOMPATIBLE on the two axes, with the collision narrowed to ONE number: (i) the token — this
route's dark alias ships iff the dark frame crossing reads ≥ 3:1 painted (§2.2), else this
family itself concedes to MRK-LIVE's one value; (ii) the board's geometry — the inset survives
on MA-N at tier 10 (+1.43 px vs −0.44 px), a reason MRK-LIVE's pose stack can carry ("pose 0 is
the inset rect's output byte for byte"). The chrome is where the routes differ most cheaply
(a CSS outline vs a drawn `FocusRing`), and either chrome takes either board. What binds both
whichever wins: the frame runs through every edge cell by the grid's own design, so the
board's ring is legible ON the frame or it is not legible on an edge cell at all — MA-L is the
section's gate, not one family's.
