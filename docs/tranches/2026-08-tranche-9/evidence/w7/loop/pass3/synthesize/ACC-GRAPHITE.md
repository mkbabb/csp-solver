# ACC-GRAPHITE — colour by playing · pass-3 SYNTHESIS (the spec)

§3 accent family · §4 fill meter · §12 multiplayer chrome · M07. Synthesizer: Fable 5.1, 2026-09-18.
Inputs, in the order read: `../CHAIR-RULINGS.md`, `../research/ACC-GRAPHITE/README.md` (pass 3, measured
on MAIN at `74a2b5d9`), `../../pass2/synthesize/ACC-GRAPHITE.md`, `../../pass2/registry-v2.md` §2.6/§2.7/§6.11,
the wave (§3/§4/§12), `design-marks-2026-08-10.md` (M07), r0 R2/R6/R7, the owner's frames `marks/m01`
(dark iPhone: the violet stripe on the frame, two blues on one board) and `m09`. The frontend-design
skill was invoked; §0 is its two-pass method. Read-only on the product; this file is the only write.
U-10: nothing here closes a mark.

Base: every HEAD number below is `74a2b5d9` (the W7 execution fold). A pass-2 number is labelled `a8fee1f5`.

Chair compliance up front: the focus-ring token is READ, never written (§6.1 — its orphaning is a debt
handed to §6, §8); FRAME_PAD ships at `12 / 0` (§6.2); the ring's opacity rank and every `gameCell.css`
row are §6's to LAND — this family declares its asks as a hand-off list and the prototype applies them
labelled "§6's hunk" so the numbers can be read (§6.6); law 39 is reported against, MOVED, with wording
(§6.7); F1 leans YES and both arms stay buildable (§6.8); the `visual-regression.spec.ts` change ships as
a PROPOSED diff, not applied (§6.11); `poseFronts` is consumed, not re-minted (§4).

---

## 0 · Plan, then the review against the tells

**Subject.** A pencil-and-paper sudoku. The family's sentence, unchanged since pass 1 and now with its
numbers right: colour means WHO made this mark; state is what a pencil does without changing colour —
press harder, go round again, make a tick. The most-watched marker on the board (the selected cell)
stops being a stock blue and becomes the pencil pressed twice.

**Tokens.** No new hex. One new name, and it is a ground, not an ink.

| role | token | light | dark |
|---|---|---|---|
| the pencil (state, your solo hand, the ring, the tally) | `--color-pencil-graphite` → `--grid-line-color` | `hsl(0 0% 15%)` `#262626` | `hsl(48 10% 80%)` `#d1cfc7` |
| the print (a clue) | `--color-foreground` | `#0a0a0a` | `rgb(237,236,233)` |
| the two ink rungs (unchanged) | `--ink-press-rule` 55% · `--ink-press-quiet` 68% | 3.53 · 5.23 | 4.36 · 6.06 |
| **the unit ground (new)** | `--ground-wash-unit` = `color-mix(in srgb, var(--color-pencil-graphite) 6%, transparent)`; 12% under `prefers-contrast: more` | painted = graphite@6% over card | same |
| a person's hand, when more than one is here | `oklch(var(--peer-ink-l) 0.11 h)` (unchanged formula) | L 0.5 | L 0.8 |
| RETIRED | `--color-progress-ink` `#8b5cf6`/`#7c3aed`; `--color-crayon-blue` `#4a90d9`/`#6aabeb` + `.crayon-blue` (the retire arm, §6.11); `rgba(196,181,253,.3/.6)` ×2; the glyph's `#2563eb` fallback | | |
| NOT this family's | `--color-focus-sketch` `#3a7bc4` (§6's; orphaned by this design — a debt, §8); `--color-user-ink` (the room re-binds it; stays) | | |

**Type.** Unchanged faces, unchanged strings. The authorship seam is WEIGHT: a clue prints at 6 units,
your digit draws at 4.5. Zero rendered-string changes, zero woff2 re-cut.

**Layout.** Unchanged. The family draws on geometry that exists: the cell's ghost `<svg>` (its OWN
viewBox, 144.444 u), the frame ring (viewBox 1000 u), the roster row.

**Principles.** (1) State is a pencil's behaviour, never a tint. (2) A width is a RATIO to the frame
line, converted to px in each stroke's own space before dividing, and gated as one. (3) A gauge must
have a form no rule has. (4) Colour arriving on your own digits means someone else is here. (5) Delete
before re-pointing.

**The review.** The generic cure for this brief — "swap the blues for greys" — was killed at rank 49 in
pass 1. Pass 3 changes three things a number said were still defaults in disguise:

- *A filled selection chip.* HEAD's tier-2 fill (crayon-blue at 8%) survived pass 2 as graphite at
  8%, and the pass-2 crop read as "a UI chip" at phone scale. A pencil pressed twice draws a RING; it
  does not tint the paper inside. The fill goes to `none` on the retrace tiers (§2): the ring is the
  mark, the cell inside stays the cleanest paper on the board, and risk 2 (ring + fill reading as one
  run) dies with it. The 8%-graphite fill is kept BUILDABLE as the fallback arm for U-10.
- *Integer `m`.* "A tick is two cells" was honest for one deal and a 1.93× cliff for the next
  (writable 56 → 57 at 9×9 Hard, research §3). LAW A takes the ratio form: the mark and the meaning
  are unchanged, the cliff is `ceil`'s and dies with it.
- *The band's number.* The 15–16 px reading was 22 units priced in the wrong space (research §1). The
  band is stated ONCE, in px, with both spaces named — and the discriminating instrument (read the
  width and the scale off the SAME element) is the gate.

Nothing here is a tinted near-black (the foreground is the estate's), a label, an eyebrow, or ambient
motion. One memorable thing per surface: BOARD, the pressed-twice ring; FRAME, the tally; ROOM, your
digits taking colour when a second hand arrives. Everything else is quiet.

---

## 1 · The section row: G0 is a SEGMENT-COUNT instrument, and `poseFronts` is consumed

Registry §2.6 seated it; the research measured it. The shipped fill gauge and join ring are **493
segments / 1 subpath / 3960–3966 u** on all four poses at both seeds (`readings/segments-head.json`);
the same generator with `grain` omitted yields 25 (ACC-SIX's trap: a bare-page arm without
`FILTER_PRESETS["grain-static"].grain` cannot go red). `DifficultyTally` is **12 segments** per stroke —
the same declaration form, not the same risk; it takes the primitive as ONE GRAMMAR, declared as
hygiene so §10 does not price a cure. The cell ghost ring is 17 segments (9 at 16×16), CSS-declared
dash, clean on both axes: this family's ring needs no cure and its meter carries no dash at all.

**G0, re-cut once for the section (banked here, the leader's):** one bare page; the pose-0 `d` read
off the LIVE DOM at HEAD (or generated with the grain config passed); ONE declaration form (the
shipped attribute form, `pathLength="1000"` + `stroke-dasharray="1000 1000"` @ offset 750); arms by
SEGMENT COUNT — **25 (the ungrained control) / 123 / 246 / 493 (the shipped) / 599** — resampled from
the same point list; × chromium + webkit × dpr 1 + dpr 3; assert painted share within 2 points across
engines in every arm. Born-RED at the 493 arm (pass 2, `a8fee1f5`: webkit 0.921 vs chromium 0.228 at
p = 0.25 — re-read on `74a2b5d9` as the first number). Reported BESIDE, never conflated: (a) the
CSS-declared form at 493 as a second control (closes the falsified declaration-form hypothesis with a
number); (b) the SUBPATH multiplier — the same list cut into 4 subpaths paints 0.859 in BOTH engines.

**`poseFronts` / `poseLengths` / `posePoints`** (ACC-FIVE's graft, `gridPaths.ts:397-455` on worktree
`-41`) are seated ONCE in `gridPaths.ts` beside `generateFrameTraceFrames` and consumed by the fill
gauge (`HandDrawnGrid.vue:476-478`), the join ring (`:509-511`) and `DifficultyTally.vue:230-232` in the
same diff; `pathLength` dies at all three. This family's tally is `poseFronts`' sibling: cut subpaths
ARE a front, computed by the same arc-length walk — `tickMarksAlong` calls `posePoints` and
`poseLengths` rather than carrying its own scanner (the pass-1 copy dies).

The two source comments that still ship the refuted dash law on the pass-2 worktree
(`HandDrawnGrid.vue:132-135`, `gridPaths.ts:167`) are NOT replayed; the replacement prose names the
segment mechanism at 493.

---

## 2 · The ring — one heavy band, two wandering edges, no fill

Tier 2 (`:has(input:focus-visible)`): both passes at `RETRACE_INSET = 10` as pass 1 shipped them
(`.cell-ghost-retrace`, `DigitCell.vue:425`, `gridPaths.ts:75/:88/:127` in the pass-1 diff). What
changes in pass 3: the fill, the claim, the gate, and who lands the CSS.

| | outer pass `.cell-ghost-path` | inner pass `.cell-ghost-retrace` |
|---|---|---|
| geometry | `wobbleRect(x, y, s, s)` seed `42+500+pos·7` | `wobbleRect(x+10, y+10, s−20, s−20)` seed `+3`, reversed |
| stroke | `var(--color-pencil-graphite)` 12 ghost u @ opacity 1 | same, 12 u @ 1 |
| fill | **`none`** (HEAD 0.08 crayon-blue; pass 2 0.08 graphite — the chip) | none |
| linejoin | `round` (the shipped rule, shared by every tier; NOT changed — the corner is priced by crop 3 for U-10, §10) | round |
| draw-on | `ghost-draw-on 180ms var(--ease-ghostDraw) backwards`, CSS `stroke-dasharray: 1` + `pathLength="1"` (17 segments: clean) | same, reversed path, the other way round |
| other tiers | as shipped: hover 5 u @ 0.65 graphite · peer cursor 4 u @ 0.55 their ink · conflict 9 u @ 1 red | `display: none` outside tier 2 and 2×3 |
| tier 2×3 (focused AND wrong) | 12 + 12 in `--color-teacher-red` @ 1, fill none | — |

**The band, stated once, both spaces named.** The ghost `<svg>` renders at **0.48927 px/u desk
(1280×800) / 0.28082 phone (393×699 dpr3)**; the board at 0.63600 / 0.36500 (both engines, both rigs,
`readings/denominators-*.json`). The fused band is 22 GHOST units = **10.764 px desk / 6.178 px
phone**; the frame line is 12 BOARD units = 7.632 / 4.380 px. **Ratio 1.410**, a ratio between two
coordinate spaces converted to px before dividing. Painted, with HEAD's own measured skirt (+0.4…+0.8
px each term), the instrument should read **≈ 1.37 ± 0.03** at both rigs; `readings/arithmetic.json`.
If the prototyper re-measures in the ring's OWN space (`getComputedStyle(ghost).strokeWidth` against
`ghost.ownerSVGElement.getBoundingClientRect().width / 144.444`) and still reads ~15 px, §1 of the
research is wrong, the band is ~30 u, and the return says so on that number.

**The sentence.** A pencil pressed twice over the same line: one heavy band whose inner and outer
edges wander independently. A single 22-u stroke has edges that are one curve offset by the width
(correlation 1.000 by construction); the pair reads 0.269 at 9×9 (pass-2 generators; re-derived at
citation — G2b), −0.126 at 4×4, 0.571 at 16×16 (`cellSegments` drops to 2 at ≥16, stated).

**The conflict ring's delta, filed as THIS diff's change.** HEAD tier 2×3 is one 10-u pass:
445.12 × 10 = 4451 u² = 1065.6 px² desk. 12 + 12 at inset 10 = 445.12×12 + 365.12×12 = 9723 u² =
2327.5 px²: **+1262 px² per focused-and-wrong cell, 2.18× the ink.** Taken on purpose — the band is the
focus affordance and may not THIN when a conflict lands on the focused cell; the teacher's red is the
colour, the doubled pass is the pressure.

**Forced colours / PRM.** The retrace is a `<path>`, never an `outline`; `gameCell.css:353-354`'s
`2px solid Highlight` on `:focus-visible` stands. Under PRM both passes land drawn (`animation: none;
stroke-dashoffset: 0`).

**Who lands it.** Every `gameCell.css` row above is §6's (chair §6.6). The prototype applies them
labelled `§6 hunk` so the ring can be measured; the return hands MRK-LIVE the list: tier-2 stroke →
graphite @ 1, 12 + 12; tier-2 fill → none (fallback 0.08 graphite, framed); tier 2×3 → red 12 + 12;
`.cell-peer` → `var(--ground-wash-unit)`. This palette survives every MRK-LIVE candidate value for
`--color-focus-sketch` because no state this family paints reads the token.

---

## 3 · The unit wash — a ground token, and the gate the estate already has

`gameCell.css:123-131` at HEAD: `color-mix(crayon-blue 7%)`, 13% under `prefers-contrast: more`; 20
`.cell-peer` nodes on a 9×9 selection, **0 sub-unit-opacity nodes** (research §4: HEAD has zero
stacking contexts already). The honest claim is the counterfactual: re-inking the wash by the obvious
route (`background: graphite; opacity: .06`) mints 20 stacking contexts; the ground token reaches the
same painted bytes with zero. Not a repair; still the right design.

```css
/* index.css, §INK PRESSURE, AFTER the two rungs, OUTSIDE the LADDER: a ground wash is tinted paper,
   never ink. The ladder governs marks; this governs what a mark sits on (MRK-WASH's one-ground rank:
   selection > peer cursor > hint laminate > unit). gateOwnership allows graphite color-mix here alone. */
--ground-wash-unit: color-mix(in srgb, var(--color-pencil-graphite) 6%, transparent);
@media (prefers-contrast: more) { :root { --ground-wash-unit: color-mix(in srgb, var(--color-pencil-graphite) 12%, transparent); } }
/* gameCell.css (§6's hunk) */ .cell-peer { background: var(--ground-wash-unit); }
```

The wash sits UNDER MRK-WASH's rank and never composes with the selection body. **The AA arithmetic
of pass 2 (0.58 of headroom on a blue digit over a blue wash) is STRUCK**: graphite over body and wash
reads 11.39 / 9.03 at HEAD's tokens; the one-ground rank is argued on FORM (MRK-WASH's), not contrast.

**The ground gate ships, cloned, not invented.** `check-ink-pressure.mjs:588-625` carries
`RANK_RULING` + `gateRank` — a ruling object with a `cite`, closed BOTH ways (the rank moving reds; the
ruling outliving its condition reds). Clone as `GROUND_RULING` / `gateGroundRank`: the four grounds
(selection body, peer cursor, hint laminate, unit) resolved through the cascade per theme (PAL-WALK's
graft: read the live value, never restate a constant), asserted strictly ordered, with `--self-test`
planting a unit wash above the selection body and reading RED. The token is outside `LADDER`
(`:94-97`, exactly two rungs), so `gateFloors`/`gateMonotone` never see it; `gateOwnership` (`:338-345`)
sees it in the one file it allows.

`--color-crayon-blue` then has no consumer (wash re-inked; the ring reads graphite; `.user-marks`
graphite) and retires with `.crayon-blue` after the 13-hit census (none paints). Four crayons remain
with jobs: green / orange / rose (difficulty), gold (done). Chair §6.11: the retire arm stands; the
eighteen keep the hex; `visual-regression.spec.ts:163` (`expect(crayonVars.blue).toBeTruthy()` — HEAD
asserts the token EXISTS) reconciles at the accent fold by the PROPOSED diff already banked at
`../research/ACC-GRAPHITE/instruments/visual-regression-crayon.proposed.diff`, unapplied.

---

## 4 · The meter — a tally of one mark, at every board size, LAW A in ratio form

**Form.** Ticks around the inside of the frame line, graphite at full pressure, cut from the frame
ring's pose by arc length (`tickMarksAlong(d, k, slots)` over `posePoints`/`poseLengths`; one `M` per
tick; no dash anywhere). The `dealt ⊪` idiom wrapped round the board. At 0 nothing renders (as HEAD).

**LAW A, ratio form** (research §3; the pass-2 integer `m` and its 1.93× cliff die):

```
INK   = 45 u of ink per tick, every board          GAP = 25 u of paper between ticks
slots = min(writable, floor(perimeter_min / (INK + GAP)))   // floor(3960.23 / 70) = 56
k     = round(written * slots / writable)                    // ticks drawn; clamps at slots, never cliffs
```

| board | tier | writable AIM (`generate.rs:67-72`; the leash lands actual ≤ aim) | slots | ticks at full |
|---|---|---|---|---|
| 4×4 | E / M / H | 4 / 9 / 12 | = writable | 4 / 9 / 12 |
| 9×9 | Easy · Medium | 20 · 46 | 20 · 46 | 20 · 46 (one tick, one cell) |
| 9×9 | **Hard** | 64 (pass 2 measured 57–58) | 56 | 56 — writable 56 → 56, **57 → 56, 58 → 56** (ceil form: 29) |
| 16×16 | E / M / H | 64 / 146 / 204 (digs to ~172–180) | 56 | 56 / 56 / 56 |

A tick is `writable/slots` cells — a real number now (1.018 at writable 57) rather than a rounded one.
The spoken layer is a percentage and stays true under every ratio (`aria-valuetext="board N% filled"`,
`HandDrawnGrid.vue:307`, unchanged — zero rendered strings move; `check-font-coverage` sees nothing).
No visible label, no whisper: the mark teaches itself in three keystrokes, and whether a tick standing
for 1.018 cells is honest without a label is the owner's (U-10). `writable` is a REQUIRED prop; the
pass-1 `?? 51` dies; one caller (`GameBoard.vue:359`, `fillable`).

**Off the rule.** `.progress-pose { transform: scale(0.968); transform-origin: 50% 50% }` — a MINT
(HEAD's `.progress-pose` at `:571-578` carries no transform; the join ring stays at its shipped 0.984).
16 u = 10.2 px inward desk / 5.8 px phone. Tick 45 × 0.636 × 0.968 = **27.7 × 6.2 px desk**, aspect
4.5; **15.9 × 3.5 px phone**. Clearance to the rule's PAINTED band, median over ≥ 200 columns:
predicted +2.1 px desk / ≈ +1.3 px phone (research instrument `clearance.probe.ts`, built, born-RED
against pass 1's 0.984 at −3 px; floor derived from the tick's own LENGTH, 28.62 / 16.43 px, never a
6-px component floor).

**Ink.** Graphite 10 u @ 1, `stroke-linecap="butt"`. Ratio over the paper it sits on: 14.87 light /
11.99 dark (off-rule rows).

**No dash, no tween, no MOTION constant.** A tick is a mark placed: it appears same-frame. The 240 ms
`stroke-dashoffset` transition at `:587-590` dies with the offset; the 500 ms `opacity` bow-out at the
win stays (index.css asserts the end state; the unlayered transition is the one that wins).
PRM-identical by construction. G3's per-column instrument samples writable **56 AND 57** at 9×9 and
asserts no discontinuity — the row the ceil form's gate could not see.

---

## 5 · Authorship — printed and drawn, and the golden this moves

`HandwrittenGlyph.vue:88-89`: `isSolved → 5`, `isGiven → 6`, yours 4.5 (HEAD 5/5/4.5). The clue
moves, not your hand: a clue came printed on the sheet. Seam 1.33× weight + 1.19:1 value (the 0.269 /
1.19 figures are re-derived at citation on `74a2b5d9`; the mean/max fork: the gate reads the MAX
rendered thickness in 8 cells, the median is reported beside). The fallback `var(--color-user-ink,
#2563eb)` (`:85`) dies rather than moves — the token is declared in both themes.

**The deck moves with the board, and so does a golden — declared, not re-minted.** `PosterBoard.vue:196`
passes `:is-given`; five poster faces' clues ride 5 → 6: +3.9% ink (`a8fee1f5` reading, re-derived),
0.55 px of stroke on a 21.94-px glyph, 0.52% of the crop, under `maxDiffPixelRatio` 0.02. **`cell-light`
renders a GIVEN**: it moves by the same 5 → 6 and REDS in the worktree. Chair §6.4: no re-mint inside
the loop; the number is DECLARED (before/after ink px, both engines) and carried to the wave's one
reviewed re-mint — darwin off a built dist, linux off the runner artifact. T8-R13 still == board
survives (board and deck move together). Spoken layer unchanged.

---

## 6 · The room — colour on your hand means someone else is here (F1, leans YES)

Solo: your digits, your roster row and (for §11) your head-left mark are graphite; the moment the
roster holds a second live player you take YOUR room ink. Solo binds 0 cells and 0 rows (R5
constraint 5). Chair §6.8: both arms BUILDABLE behind one flag; the default leans YES; framed for
U-10 by the pen's painted hue solo vs in-room (a number, not a crop).

**Substrate** (`useSession.ts`, untouched by the fold; lines stand): `inkIndex` becomes
`ref<Record<string, number>>({})` (`:369`; `.value` at `:532-533/:547-554/:712/:880`); `selfInk =
computed(() => players.length > 1 ? ident.inkFor(inkIndex.value[selfId.value]) : {})`; `authorInk`
(`:402-411`) stops skipping `selfId` when `selfInk` is non-empty; the roster row binds `selfInk`.
Named failure at HEAD's `let`: you join, a peer arrives, `selfInk` mints `inkFor(0)`; the epoch holder
publishes a board whose `k` puts you at 3; every other page repaints you `inkFor(3)` and yours keeps
`inkFor(0)`. Born-RED unit: adopt-after-join (`adoptInk({me: 3})` after a peer is present moves
`selfInk`). `.player-swatch` is NOT touched here — chair §6.9 seats its re-point once under PLR-SELF.

**The fold's surfaces, resolved TOWARD the fold.** `cellAuthors` and the attribution tape
(`GameBoard.vue:1088-1096`, `hoveredAuthor.ink`, z-index 50, following FOCUS on a coarse pointer) are
HEAD law. Under F1-YES your own cells carry your room ink; the tape keeps the fold's rule — it names a
PEER at a peer's cell and never names you to you (the fold's own sentence). Pre-room digits: what you
wrote alone you wrote as the pencil; the room colours only what the room saw (`authorInk` iterates
`ledger.clock`; a solo write never enters it). Disposition (a) — recolour earlier digits at room-open
— is a wire row, booked.

Three stale prose sites re-cut in the same diff: `playerIdentity.ts:65-66` ("keeps the incumbent
blue"), `multiplayer.spec.ts:190-191` and `:217-219` (assertions relational, prose only), and
`useSession.ts:315`. Index 0 is the teacher's red (hue 0.0°) and index 8 lands at 20°: PAL-TIN's row;
this family takes whatever lands there.

Motion: none of its own — the join ring (1180 ms, peer ink, 0.984) is the motion. PRM-identical.

---

## 7 · The guard — achromatic, and G10 at the pointer that has it

No change to the ribbon: `--color-foreground` words, the destructive verb at `strokeWidth 2.5` on the
drawn box (`currentColor`, so graphite), `keep` at 2. The 8% ground (`GameGallery.vue:1459-1461`) is the
mark of arming and stays. The confirm takes no colour because nobody made this mark. `onClear` arms
only at `isCoarse && isDirty` (`GameControlPanel.vue:552-553`): G10 runs at 393 dpr3 `hasTouch` on a
DIRTY board in both engines; the fine-pointer holdout is the product's own answer, written into the
gate.

---

## 8 · What dies, the two numbers that move, and the §6 debts in writing

| dies | where (HEAD `74a2b5d9`) |
|---|---|
| `--color-progress-ink` ×2 + the "SIXTH crayon" ledger comments | `index.css:267-278`, `:403-407` |
| `--color-crayon-blue` ×2 + `.crayon-blue` + comment (§6.11 retire arm) | `index.css:173`, `:381`, `:473-475` |
| `rgba(196,181,253,0.3/0.6)` drop-shadows + `transition: all` | `GameControlPanel.vue:2088`, `:2094` (the fold moved them +7) |
| the `#2563eb` fallback | `HandwrittenGlyph.vue:85` |
| the 240 ms dashoffset tween; `pathLength="1000"` ×2 + `stroke-dasharray="1000 1000"` ×2 | `HandDrawnGrid.vue:587-590`, `:476-478`, `:509-511` |
| `.cell-peer`'s crayon-blue 7% / 13% | `gameCell.css:123-131` (§6 lands) |
| tier-2 `fill-opacity: 0.08` (fill → none) | `gameCell.css:245-250` (§6 lands) |
| `writable ?? 51`; the pass-1 tick scanner (replaced by `posePoints`/`poseLengths`) | pass-1 diff |
| the sparkle's allowlist row | `filterBudget.ts:157-161` |
| the two refuted-dash comments | pass-2 worktree only; not replayed |

**`filterBudget` 9 → 8** (`FILTER_BUDGET_TOTAL` is derived, `:184`; `CEILING` stays 14). **`UNION_AREA`
row 45,572 → 44,642 and coarse 6,673 → 5,743: −930 on BOTH** (the pass-2 spec's −900 was 30 off its
own prototype; re-derived on a dist built inside the worktree). R6 law 9 / L1 re-cut as a diff at
`instruments/law-probe-L1.diff` (this dir); r0 rows reported MOVED, never edited.

**§6 debts, written, travelling as debts:** (1) `--color-focus-sketch` is ORPHANED (0 `var()`, 0 class)
by the graphite ring — `check-theme-tokens` reds on `dead.length`, so the prototype applies the one-line
deletion labelled `§6 hunk` to stay green and MRK-LIVE disposes the token (retire, or re-point at a
consumer). (2) The R2 kinship anchor list COLLAPSES (the four surviving crayons are all warm; the
focus-sketch anchor distance goes 1.9° → 106.3°) — the proposed re-cut is banked at
`../research/ACC-GRAPHITE/instruments/accent-kinship-ANCHORS.proposed.diff`, r0 row MOVED. (3) The
ring opacity rank move (0.9 → 1 at tier 2) is §6's ruling to take.

**R6 law 39 — reported MOVED** with wording (`../research/ACC-GRAPHITE/instruments/R6-law39.MOVED.md`):
three of four board-ring terms move (token → graphite; width 7 ghost u → 12 + 12; opacity 0.9 → 1);
"visible" and "drawn on over 180 ms" survive. Proposed **law 39a**: a stroke width is meaningless
without its viewBox. The chair's row (§6.7); this family reports, never amends.

---

## 9 · Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; ghost 70.672 px/cell; band 10.764 px (painted ≈ 11.6); frame 7.632;
  tally tick 27.7 × 6.2 px inset 10.2 px; nothing moves in layout.
- Phone 393×699 dpr3: board 365 px; ghost 40.563 px/cell; band 6.178 px (painted ≈ 6.6); frame 4.38;
  tick 15.9 × 3.5 px inset 5.8 px; the W2 bottom tab, dock and sticky tag untouched.
- Light: graphite `#262626` ring on `hsl(48 12% 99%)` card 14.87:1; wash graphite@6%; clue 6 u / yours
  4.5 u in `--color-foreground`; tally 14.87.
- Dark: graphite `#d1cfc7` ring 11.99:1; wash graphite@6% over the dark card; tally 11.99. The two
  blues at 213.1° / 211.7° (r7 `:439`) leave the wheel; `--color-user-ink` stays for the room's
  binding — the accent census is re-run WITH A PEER PRESENT (G1b), not only solo.

## 10 · What the owner disposes (U-10)

Crop 3 (phone light, focused cell + 8 neighbours): does one heavy graphite ring read as *your pencil is
here* — and does the ROUND corner at 12 u read as a chip (the fallback: fill 0.08 graphite, or a
squarer join on the retrace path alone, both buildable). Whether a tick standing for 1.018 cells is
honest without a whisper. The deck's clue weight. F1 (YES leans).

## 11 · Couplings (stated, not resolved)

F1 with PLR-SELF (`selfInk` substrate lands under §11's leader; this family's palette clears against
FOUR crayons plus graphite). §6 (MRK-LIVE) owns every `gameCell.css` row and the focus-ring token —
the hand-off list of §2/§8. FRAME_PAD untouched. `.cell-because` untouched. §10 inherits
`DifficultyTally`'s `poseFronts` seat as hygiene (12 segments, not a defect). ACC-FIVE / ACC-SIX:
incompatible by centre; §1 is section-wide and identical in all three. W3: no new live region, no new
string.

---

## 12 · Plan — files in order, what dies

1. `web/frontend/src/pencil/grid/gridPaths.ts` — `posePoints` / `poseLengths` / `poseFronts` seated
   (ACC-FIVE's 22 lines, verbatim); `tickMarksAlong(d, k, slots)` re-cut over them; the pass-1
   scanner dies; `FRAME_X_PAD 12 / FRAME_Y_PAD 0` untouched.
2. `web/frontend/src/assets/index.css` — `--ground-wash-unit` (+ the `prefers-contrast: more` arm)
   in §INK PRESSURE after the two rungs; `--color-progress-ink` ×2 and the violet ledger die;
   `--color-crayon-blue` ×2 + `.crayon-blue` die (§6.11 retire arm); `--color-focus-sketch` deletion
   as a labelled `§6 hunk`; `.solve-success .progress-trace { opacity: 0 }` stays (the bow-out).
3. `web/frontend/src/games/shared/gameCell.css` — ALL as labelled `§6 hunks`: `.cell-peer` → the
   token; tier 2 → graphite 12 @ 1, fill none; `.cell-ghost-retrace` rows; tier 2×3 → red 12 + 12.
4. `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — the gauge becomes the tally
   (`poseFronts`-family cut, no dash, no `pathLength`); the join ring consumes `poseFronts` with
   `pathLength`/dash dropped, 0.984 kept; `.progress-pose` gains `scale(0.968)`; `writable`
   REQUIRED; the 240 ms transition dies; comments re-cut to the segment mechanism.
5. `web/frontend/src/games/shared/DifficultyTally.vue:230-232` — `poseFronts`, `pathLength` dropped
   (hygiene, declared).
6. `web/frontend/src/games/shared/GameBoard.vue` — passes `writable` (`:359` `fillable`); nothing
   else (the fold's `hoveredAuthor`, `isCoarse`, `focusout` clear are HEAD law and untouched).
7. `web/frontend/src/games/shared/useSession.ts` — `inkIndex` → `ref`; `selfInk`; `authorInk`
   stops skipping self when inked; `:315` prose; behind ONE flag (`F1_SELF_INK`, default on) so
   both arms frame. + `useSession.selfInk.test.ts` (adopt-after-join, born-RED at the `let`).
8. `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue` — `:85` fallback dies; `:88-89` given → 6.
9. `web/frontend/src/games/shared/GameControlPanel.vue:2088/:2094` — the glow filter dies;
   `transition: all` dies.
10. `web/frontend/src/pencil/config/filterBudget.ts` — the sparkle row dies; `UNION_AREA` re-derived
    (−930 / −930) on the worktree's dist.
11. `web/frontend/src/games/shared/playerIdentity.ts:65-66`, `e2e/multiplayer.spec.ts:190-191/:217-219`
    — prose re-cut.
12. `web/frontend/scripts/check-ink-pressure.mjs` — `GROUND_RULING` + `gateGroundRank` cloned from
    `RANK_RULING`/`gateRank` (`:588-625`), with the `--self-test` plant.
13. Instruments as PROPOSED diffs under `pass3/prototype/ACC-GRAPHITE/instruments/`: `law-probe-L1.diff`,
    the R2 anchor list, `visual-regression-crayon.proposed.diff` (carried from research); the r0
    rows reported MOVED. G0 (section) under `instruments/g0-segments.probe.ts`.

Dies: 4 hexes (`#8b5cf6`, `#7c3aed`, `#4a90d9`, `#6aabeb`), 2 `rgba()` literals, 1 fallback, 1 filter,
2 `pathLength` + 2 dashes, 1 transition, 1 class. Born: 1 ground token, 1 transform, 1 flag. Zero
timing constants, zero rendered strings. Files: 11 product + 1 script + tests.

## 13 · Prototype brief

**Build.** Fresh `git worktree` from `74a2b5d9` under the scratchpad (never the pass-2 worktree, never
main); replay `pass2/prototype/ACC-GRAPHITE`'s diff by file copy if `git` is refused (chair: state the
route; every hunk touching `DigitCell.vue`, `useGameCell.ts`, `BoardHost.vue`, `GameBoard.vue`,
`GameControlPanel.vue` resolves TOWARD the fold and is named), then §12 in order. Two servers: the
prototype on **:4235** and a HEAD control on the next free port in 4230–4249, each with a two-line
scratch vite config (`{ ...base, cacheDir: '<worktree>/.vite-cache' }`), `--host 127.0.0.1 --strictPort`;
scratch Playwright config (no `webServer`, `baseURL` the lane's port), chromium + webkit, 1280×800
and 393×699 dpr3 (`hasTouch`), light + dark. Build the dist INSIDE the worktree with its OWN cacheDir
for G8 (never `npm run build` on main; never share a cacheDir between build and serve). Every token
reading after an `index.css` edit is taken after a forced reload or off the dist (risk 8). Kill both
servers, verify the ports refused, remove the worktree. ≤ 90 s per foreground command; longer runs
backgrounded with a log.

**What proves it (numbers first).**
- THE BAND, in its own space: `getComputedStyle(ghost).strokeWidth` and `ownerSVGElement` box ÷
  144.444 on the SAME element → 22 u × 0.48927 = 10.764 px desk / 6.178 phone; the painted run through
  the focused cell's row 11.6 ± 0.8 / 6.6 ± 0.5; ratio to the PAINTED frame line 1.37 ± 0.03 at both
  rigs; negative control = an unfocused cell (no run). If it reads ~15 px in the ring's own space,
  say so on that number.
- G0 (section): five segment arms × 2 engines × 2 dprs, RED at 493 on HEAD's control, ≤ 2 points
  after the cure; the CSS-form and 4-subpath controls reported beside.
- G2 rank at 393 light: NAME the runner-up (which rule, which row) — carried RED if it is a board
  rule within 10%; re-scoped if it is off-board ink (an instrument fix, reported as such).
- G3: subpath counts exact at k = 1, 3, 20, full on 4×4 / 9×9 / 16×16 both engines; writable 56 AND
  57 at 9×9 → 56 ticks at full on both; aspect 4.5 ± 0.3; `clearance.probe.ts` (research
  instrument, COPIED) median ≥ +1.5 px desk / ≥ +1.0 px phone, zero negative columns over ≥ 200.
- G4: clue/entry rendered thickness ≥ 1.30 in 8 cells (MAX, median beside); entry ≥ 1.6 px at
  phone; deck DELTA +3.9 ± 0.3% both engines; `cell-light` golden's diff px DECLARED, not re-minted.
- G-WASH: 0 sub-unit-opacity nodes; wash byte-identical to graphite@6% over card; `gateGroundRank`
  green, its self-test red.
- G8: `filterBudget` exactly 8 on the dist both engines both regimes; union 44,642 ± 2% / 5,743 ± 2%.
- G1 / G1b: r0 `hue-census.probe.ts` COPIED (`OUT` re-pointed) solo AND with one peer present;
  `accent-kinship.probe.ts` COPIED with the proposed anchor list; `consumers.mjs` COPIED; `law-probe.mjs`
  COPIED with L1 re-cut. R3 `wobble.probe.ts` σ for the two-seed ring reported (MRK's number).
- `check-ink-pressure` (3 gates + ground), `check-copy-register` BARE on the new tree (the fold
  rebuilt it), `check-font-coverage`, `check-theme-tokens`, `lint:motion`, `test:prod-shake`,
  `lint:knip`, `lint:eslint` — each run bare, exit codes read bare (never piped).
- π: `rect-census-fold.mjs` prototype vs HEAD control, one pointer regime declared; goldens
  `grid-corner-light`, `logo-light`, `toggle-crest-dark` 0 px; `cell-light` moves by the declared
  delta only.

**Crops** (≤ 4, ≤ 150 KB, cited): (1) top strip 300×44 desk light at k = 3 — paper between tick and
rule; (2) same strip 16×16 at k = 24 (Law A); (3) focused cell + 8 neighbours at 393 dpr3 LIGHT — the
ring's corner and the G2 rival (the U-10 frame); (4) held in reserve.

## 14 · Born-RED gates (HEAD reading stated)

| id | asserts | HEAD `74a2b5d9` |
|---|---|---|
| **G0 segments** (section) | one form, arms 25/123/246/493/599, × 2 engines × dpr 1/3: share within 2 pts; CSS-form and 4-subpath controls reported beside | RED at 493 (`a8fee1f5`: 0.921 vs 0.228; re-read) |
| G1 census | chromatic px rest = focused = mid-board ±0.1% viewport, 8 cells, dark residue binned 10° each named; **G1b** the same with one peer present | RED (+27% desk / +152% phone) |
| **G2 band** | in the ring's OWN space: 22 u; painted band / painted frame ∈ [1.35, 1.45] at both rigs AND absolute floor ≥ 10.0 px desk / ≥ 5.7 px phone (PAL-TIN's two-clause shape); rank 1 of N², 0 rivals within 10% at focus, 8 cells | RED (7 u, 0.449×, rank 3–49); the 393-light rank clause carried RED with the rival named |
| G2b edge correlation | inner vs outer radial deviation, 9×9, < 0.35 on the generators; a single stroke reads 1.000 | RED against a single stroke |
| **G3 tally** | subpaths == `min(round(written·slots/writable), slots)` at k = 1/3/20/full on 3 boards both engines; **writable 56 and 57 → 56 ticks**; aspect 4.5 ± 0.3; per-column clearance median ≥ +1.5 / +1.0 px, 0 negative columns, floor from tick LENGTH | RED (no tally; pass 1 −3 px) |
| G4 authorship | MAX clue/entry thickness ≥ 1.30 in 8 cells; entry ≥ 1.6 px at 393; deck +3.9 ± 0.3% both engines; `cell-light` delta DECLARED | RED (1.11; undeclared) |
| G5 kinship | R2 rows 1/2/4 GREEN with progress-ink / crayon-blue UNDEFINED on the live root; row 3 guard; the focus-sketch row is §6's, reported beside | RED 4/1 |
| G6 self-ink | R5 I2 both engines; adopt-after-join unit moves `selfInk`; both F1 arms build | RED at the `let` |
| G7 consumers | no hex token with zero consumers; `196, 181, 253` / `#2563eb` / `crayon-blue` in `src/` = 0 | RED |
| G8 π | `filterBudget` exactly 8, dist, both engines/regimes; union 44,642 ± 2% / 5,743 ± 2%; L1 re-cut in the same diff | RED (row in; L1 stale) |
| **G-WASH** | 0 sub-unit-opacity nodes from `.cell-peer` on a 9×9 selection; wash byte-identical to graphite@6%; `gateGroundRank` green, self-test RED | GREEN on nodes at HEAD (stated); RED on the token/gate (absent) |
| G9 forced / print | `outline-color` Highlight on the focused input; the retrace paints no outline; print: glyph, grid, ring, tally `rgb(0,0,0)`; `.attribution-tape` hidden in print (section row) | GREEN except the tape (RED: prints today) |
| G10 guard | armed ribbon chromatic px = 0 at 393 dpr3 `hasTouch` dirty board, both engines; fine pointer: no armed state | GREEN chromium; webkit unmeasured |
| G11 scripts | ink-pressure (4 gates), copy-register bare, font-coverage 0 new, theme-tokens (with the §6 hunk), lint:motion, prod-shake, knip, eslint | must stay green |
