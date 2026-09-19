# ACC-SIX — six anchors, the violet named · pass-3 SYNTHESIS (the spec)

§3 accent family · §4 fill meter · §12 multiplayer chrome · §15 danger ink · M07. Synthesizer:
Fable 5.1, 2026-09-18. Inputs, in the order read: `../CHAIR-RULINGS.md`, `../research/ACC-SIX/README.md`
(pass 3, bake-time geometry + file reads on `74a2b5d9`; no server), `../../pass2/synthesize/ACC-SIX.md`,
`../../pass2/registry-v2.md` §2.6/§4, the sibling pass-3 research (ACC-FIVE §1–§3 — the corridor and the
painted-line law; ACC-GRAPHITE §1 — the unit-space law), the wave (§3/§4/§12/§15), M07, r0 R2/R6, the
owner's frames `marks/m01` (dark iPhone: the violet stripe on the frame, the hint note BELOW the board
— where the board already speaks) and `m09`. The frontend-design skill was invoked; §0 is its two-pass
method. Read-only on the product. U-10.

Chair compliance: **law 20 STANDS** in the amended reading and gets an INSTRUMENT (§2, §6.7); FRAME_PAD
at HEAD's `12 / 0` (§6.2); `--color-focus-sketch` read, never written (§6.1); `.cell-because` and every
`gameCell.css` row untouched (§6.6/§6.11); `filterBudget` EXACTLY 9 on the dist (§7); **the section
cure is ACC-FIVE's `poseFronts`, CONSUMED — nothing is re-minted here** (§4, the merge watch's
condition); law 39 is §6's; F1 both arms buildable, YES leans (§6.8); the count's holder is named so the
fold's copy gate can read it.

---

## 0 · Plan, then the review against the tells

**Subject.** A pencil-and-paper sudoku whose answer key is written in a violet that no house colour
sits within 41° of — and which is already in the house: `--color-progress-ink` dark is byte-identical
to `--color-solver-ink-2` light (R6 `:201-204`). The family's sentence: the sixth colour is NAMED, not
minted — the answer's violet, ink only, one job — and blue takes exactly one job, you.

**Tokens.** Zero new violet bytes (one pre-declared escape, §2); one new blue.

| role | token | light | dark | OKLCH |
|---|---|---|---|---|
| the answer, three rungs already in the tree | `--color-answer-pale` / `-mid` / `-deep` | `#c4b5fd` / `#8b5cf6` / `#7c3aed` | same three | h 293.6 / 292.7 / 293.0 |
| the revealed digit | `--color-solver-ink-2` → `answer-deep` (light) / `answer-pale` (dark) | 5.60 on card | 10.14 | |
| the work in progress | `--color-progress-ink` → `answer-mid` (light) / `answer-deep` (dark), **`stroke-opacity` 1** (was 0.95 — ACC-FIVE's lever, taken) | painted predicted ≈ 3.06 line / 4.13 paper | ≈ 3.3 / 3.3 | HEAD-identical bytes |
| the solver's glow | `--sparkle-glow-soft` / `-strong` = `color-mix(in srgb, var(--color-answer-pale) 30% / 60%, transparent)` | | | 900 px², one filter |
| your hand | `--color-user-ink` | `#2f76bd` | `var(--color-crayon-blue)` `#6aabeb` | h 251.4 locked; 4.64 card / 4.53 bg; dark 7.70 / 7.86 |
| the focus ring | `--color-focus-sketch` | §6's | §6's | 253.3, 1.9° off crayon-blue |
| RETIRED | `#2563eb`, `#60a5fa`, `rgba(196,181,253,…)` ×2, the glyph fallback, the guard's 8% ground, `pathLength="1000"` ×2 + both dashes | | | |

**Type.** Patrick Hand's cut for one new drawn string, `3 of 20 on the board`: every codepoint is in
`index.css:94-96` (`0-9`, space, `a-i`, `k-w`); `%`, `/`, `j`, `x` never appear (`y`/`z` ARE in the cut —
pass 2's spec had that wrong). Zero re-cut.

**Layout.** Nothing on the board moves. The count lives in the margin strip BELOW the board
(`.board-margin`, already reserved, already print-hidden) as a line of MarginNote's `meta` — the
tally's berth, free in production (`tally` is debug-only, `GameBoard.vue:916`).

**Principles.** (1) A sixth colour is one more thing to learn, so it takes exactly one job. (2)
Contrast is bought by lightness at a locked hue — and by alpha before hue. (3) A label may not hide
the thing it explains, ever: zero occlusion by construction, not by arithmetic. (4) The one literal
has two carriers — drawn and spoken — and one holder, NAMED so the gate can see it.

**The review.** The generic cure (brand accent, percent bar, glow, red-tinted button) is refused on
the same numbers as pass 1. Four pass-2 defaults changed by pass-3 numbers:

- *A tape on the board.* Pass 2's top-right tape survives on ONE shipped deal by 1.02 points, fails
  every 4×4 deal (three of four cells is 75% of the ring; the last corner arrives at 73.85%), and
  covers 2,719 px² of LIVE CELLS undeclared. The bottom-left has 4.1× the headroom and still lies on
  cells. Principle (3) is not met by any corner. The count leaves the board: the margin's `meta`
  line (research §3's "third route") — no new component, no z-order fight with the fold's
  attribution tape (z 50), no seed to pin for it, occlusion 0 at every board size and viewport.
  Arm A (the bottom-left tape with its cell-occlusion number at every viewport) stays BUILDABLE
  and framed for U-10.
- *`TAPE_FILLS = 3` as a constant.* The lay-down is a derivation on a value GameBoard already
  computes: `fillsShown = min(3, floor(f_entry × writable))` — and off the board `f_entry` is 1, so
  it reduces to `min(3, writable)`: the lesson scales to the deal (a 4×4 Easy board dealt with three
  writable cells shows three, never a fourth that does not exist).
- *The dash law by declaration form.* Falsified (research §2): the discriminator is 493 segments
  vs the 25-segment ungrained trap. The cure is ACC-FIVE's `poseFronts`, consumed; G0 is re-cut over
  segment count.
- *The violet at 0.95.* ACC-FIVE measured HEAD's light violet at **2.876 painted** against the
  painted frame line — the family's own ratio ledger (3.36) was token arithmetic. The alpha lever is
  taken (α 1) and the light trace's margin is stated honestly as ~0.06 with a pre-declared escape.

One memorable thing per surface: ANSWER, one named violet at three pressures; HAND, one blue at three
pressures; MARGIN, a small line under the board that says how many are on it, for the first three
fills, then leaves. Everything else is quiet.

---

## 1 · The section finding: segment count, `poseFronts` consumed, the step declared

The shipped fill-gauge poses are **494 points / 493 segments** each, lengths 3962.0–3965.6 u (spread
0.0906%); the join ring the same; the ungrained call yields **25**. The law is bounded by SEGMENT
COUNT, not by where the dash is spelled — and no re-spelling gets a 493-segment polyline out of the
per-segment restart the SVG WG itself records as a "should" (background, not the verdict). The cure is
geometric: **`poseFronts(frames, fraction)`** (ACC-FIVE, `gridPaths.ts:397-455` on worktree `-41`, with
`posePoints` / `poseLengths`), consumed verbatim at `HandDrawnGrid.vue:476-478` and `:509-511`
(`pathLength` + dash die) and `DifficultyTally.vue:230-232` (hygiene, one grammar). It closes three of
this family's gaps by construction: G0 (no dash to restart), the degenerate pose (`f <= 0 → ""`, fails
to NOTHING DRAWN), `pathLength` estate-wide.

**G0, re-cut once for the section (the leader banks it; this family runs it as its control):** ONE
declaration form, arms **25 / 123 / 246 / 493 / 599** on the untruncated pose-0 `d` read off the live
DOM (or generated WITH `FILTER_PRESETS["grain-static"].grain` — the trap, named), × chromium + webkit
× dpr 1 + dpr 3, painted share within 2 points; the CSS form and the 4-subpath multiplier (0.859 both
engines) beside. The four-declaration-form arm is STRUCK as answering a falsified question.

**The front's motion is ACC-FIVE's ruling, not this family's.** With the dash gone the front STEPS
(~31 px per digit at 9×9 Easy, ~158 px at 4×4 Easy) unless the fraction is tweened per frame on the
boil scheduler — ACC-FIVE measured that affordable and specifies it on MOT-LADDER's write-in rung.
This family mints no `traceFillMs`, no `tapeRestMs`, no motion constant of its own (§5): it consumes
whatever the section's fold lands and frames the step arm once so the owner sees the price.

---

## 2 · Tokens (`index.css`), the ONE painted ledger, and law 20's instrument

```css
:root {
  /* THE SIXTH ANCHOR — the answer's violet, INK ONLY: no wax tier, no crayon dark law. One hue
     (293°), three rungs, all three already in the tree. Chrome that carries it names the RUNG,
     never the STOP (law 20, amended reading; the instrument is check-theme-tokens' law-20 arm). */
  --color-answer-pale: #c4b5fd;   /* L .811 C .101 h 293.6 */
  --color-answer-mid:  #8b5cf6;   /* L .606 C .219 h 292.7 — Y .198: the only rung inside the LIGHT trace's corridor (.192–.294), at its floor */
  --color-answer-deep: #7c3aed;   /* L .541 C .247 h 293.0 — the only rung inside the DARK corridor (.118–.153) */
  --color-solver-ink-2: var(--color-answer-deep);
  --color-progress-ink: var(--color-answer-mid);
  --sparkle-glow-soft:   color-mix(in srgb, var(--color-answer-pale) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-answer-pale) 60%, transparent);
  /* BLUE, ONE JOB — crayon-blue's INK tier, hue-locked at 251.4. L .555 C .131. 4.64 on card (HEAD
     #2563eb 5.06: −0.42, a cost, 0.14 over AA — U-10). No alias above it (T5-W2 2.3); the var()
     consumers want the BINDING the peer seam rebinds (playerIdentity.ts:67-70). */
  --color-user-ink: #2f76bd;
}
.dark {
  --color-solver-ink-2: var(--color-answer-pale);
  --color-progress-ink: var(--color-answer-deep);
  --color-user-ink: var(--color-crayon-blue);   /* ink collapses into wax at night: #6aabeb, 7.70 / 7.86 */
}
@media print                   { .progress-trace { stroke: #000 !important; } .attribution-tape { display: none; } }
@media (forced-colors: active) { .progress-trace { stroke: CanvasText; } .attribution-tape { color: CanvasText; } }
```

**The painted ledger** (replaces the charter's, pass 1's, pass 2's token-arithmetic table; validated on
the dist, modal-of-run core over 24 columns, both engines — the instrument named):

| row | light | dark | floor |
|---|---|---|---|
| trace @ **α 1** vs painted line (49,49,49 / 199,197,190) / paper | **predicted 3.06 / 4.13** (HEAD @.95: 2.876 ✗ / ~3.85) | predicted ≈ 3.3 / ≈ 3.3 (HEAD @.95: 3.139) | 3.0 |
| solver-ink-2 as text on card | 5.60 | 10.14 | 4.5 |
| user-ink as text on card / background | 4.64 / 4.53 | 7.70 / 7.86 | 4.5 |
| red-ink on bare card · on the hover ground | 4.99 · 4.69 | 6.30 · 5.08 | 4.5 |
| red-ink on a 5% / 8% neutral (why the ground died) | 4.49 / 4.20 | 5.68 / 5.26 | 4.5 |
| ring `#3a7bc4` @.9 (HEAD, §6's) · `#6aabeb` @.9 | 3.63 · 3.89 | 3.69 · 6.42 | 3.0 |

**The light trace is at the corridor's floor, and the escape is declared before the run.** Zero new
violet bytes puts `answer-mid` at painted ≈ 3.06 against the line: the two instruments disagree by
0.07–0.09 on the same paint, so this is the floor with no margin. Rule, stated now: if the modal
core reads **< 3.10** on either engine, the light trace takes a FOURTH rung minted inside the
corridor at the locked hue — **`--color-answer-ink: #9b74f7`** (Y 0.2617, mid-corridor; token arithmetic against the PAINTED
grounds 3.86 line / 3.31 paper, worst 3.31, margin 0.31 — `answer-mid` on the same arithmetic is
3.07 / 4.16) — one new violet byte, declared as the palette's cost, hue
293 ± 2° verified painted. The number decides, the owner disposes.

**Law 20's instrument** (`check-theme-tokens.mjs`, a new arm; born-RED by a plant): no selector
outside the board's glyph layer may name a STOP (`var(--color-solver-ink-N)`); naming a RUNG
(`--color-answer-*`) is lawful; **`#sparkle-rainbow` is ADMITTED BY NAME** (`index.css:198-204` states
it stays on the untouched rainbow; `SvgFilters.vue:168` carries `#c4b5fd` as its 25% stop). The
self-test plants one chrome rule naming a stop → exit 1. A gate that reds on HEAD is not a gate; one
with a named admission and an exit code is. **G9's alias law gets an exit code in the same script**:
`strays ⊆ {teacher-red, gold-star, pencil-graphite, answer-pale, answer-mid, answer-deep}` — the named
ramp admitted by name, with the reason (a rung exists to be named by chrome) — else exit 1.

The `index.css:267-278` "SIXTH crayon, 46° off" comment is rewritten: an ANCHOR of the house, ink
only; the light/dark inversion is forced by the corridor. Law 39 is §6's.

---

## 3 · Components and states

**The focus ring** (`gameCell.css:246/:248`): §6's. Survives A `#3a7bc4` and B/C `#6aabeb` (253.3°,
1.9° from crayon-blue, inside KIN_DEG 5). Two traps for §6: the selector sits inside the cell
`playerIdentity.ts:69` rebinds (never `--color-user-ink`); the fallback `var(--color-focus-sketch,
var(--color-crayon-blue))` can never fire, so a bare deletion lands silently on crayon-blue.

**Your digit** (`HandwrittenGlyph.vue:85`): `return "var(--color-user-ink)"`. 4.64 light (0.14
headroom) / 7.70 dark. The pen desaturates (C 0.215 → 0.131) — a cost, U-10. Unit row on the resolved
glyph stroke, no golden.

**The unit wash**: unchanged, crayon-blue 7% (§6's row). Pen, wash and ring: one hue, three pressures.

**The fill trace** (`HandDrawnGrid.vue:461-480`): HEAD bytes, **α 1**, `poseFronts`, FRAME_PAD at HEAD.
The win keeps HEAD's bow-out (`.solve-success .progress-trace { opacity: 0 }`, 500 ms unlayered): the
violet led the eye to the gold and never competes with it. No track ring.

**The count line** (§4's "visible label", the memorable thing on the margin). `GameBoard.vue:1160-1172`
already renders `.board-margin` → `MarginNote(text, tone, meta, quiet)`; `meta` is "the preformatted
tally line below the voice, outside the live region" (`MarginNote.vue:31-32`) and is free in production.
The count rides it:

- **Holder, NAMED for the gate**: `const countLine = computed(() => showCount.value ? `${fillCount.value}
  of ${writable.value} on the board` : "")` — a `Line` suffix, so `check-copy-register` discovers the
  template's static segments (` of `, ` on the board`) and sweeps them; `ADMITTED` stays empty; the
  lexicon's traps (unit / candidates / house / solver / engine / worker / feature) are not tripped.
  Bound as `:meta="celebrating && vignetteHasTally ? undefined : (tally || countLine)"` — the tally
  (debug) outranks the count when both exist; `""` unmounts the line as MarginNote already does.
- **Lifecycle** (computed on props, never on the beat): `boardKey = computed(() =>
  [...props.givenCells].sort().join())`; `watch(boardKey, () => { taught = false; showCount = false })`;
  the line lays down ONLY on the `0 → 1` transition of `fillCount` while `!taught`; **`fillsShown =
  min(3, writable)`** (the derivation with `f_entry = 1` off the board — `writable` from `:359`, so a
  4×4 Easy deal leashed to three writable cells shows three, not a phantom fourth); the count updates
  in place on fills 2 and 3; after fill `fillsShown` it rests one write-in band and lifts; `taught =
  true` at the lift. Undo to empty leaves `taught` (no resurrection); a session restored at two fills
  has no `0 → 1` (no mid-board line). Multiplayer: `fillProgress` counts the BOARD, peers included,
  and the literal says so.
- **Look**: MarginNote's own `.margin-note-meta` rules (graphite, the row-caption rung, `ink-write-in
  250ms var(--ease-noteWrite) backwards`) — no new style, no new component, no token. The strip is
  `pointer-events: none`, `aria-hidden` on the meta line (the progressbar speaks it), print-hidden
  already (`index.css:905`).
- **Zero layout shift**: `.board-margin` reserves the second line — `min-height: 2lh` (the same
  reserve §7's NOTE-LEDGER writes for its line two; graft, not a second mechanism) — so the toolbar's
  top does not move at fill 0 / 1 / 3 / lift at 393×699 (G5 asserts 0 px).
- **Arm A, framed**: the bottom-left `SheetWashiLabel` tape (`f_entry` 0.6601 worst; 105 × 20 px at
  phone = ~2.6 cells of the last row occluded, the number DECLARED at 1280×800 / 393×699 / 844×390) —
  built behind a flag, one crop, U-10.

**The spoken half** (`HandDrawnGrid.vue:296-307`): `aria-valuetext` = the SAME literal (`N of M on the
board`), `aria-valuenow` = the count, `aria-valuemax` = writable, `aria-label` stays `board fill`. One
act, one name. `check-copy-register`'s `RENDERED_ATTRS` (`:266-277`) gains `aria-valuetext` — a one-line
widening that reds nothing at HEAD (the only one is `:307`, static segments clean) and SHIPS WITH A
BORN-RED PLANT (a self-test colour planting a jargon word in a template's `aria-valuetext`).
`check-live-regions` is NOT widened (the gauge is a progressbar, not a live region — refused in pass 2).

**The seed fix, priced at 16.** `SheetWashiLabel.vue:56` seeds off `props.seed * 2654435761 +
props.text.charCodeAt(0)`; the text term leaves. Three instances bind runtime-varying text — the
fold's OWN attribution tape (`GameBoard.vue:1095`, re-tears per peer), `shareAct.washi.value`,
`inviteAct.washi.value` — so the docstring's promise (`:16`) is false on the board today. All 16
instances re-tear ONCE; none is a golden (chair §6.4: a π row, declared with `clip-path` /
`--washi-tilt` before/after, boxes ≤ 0.55 px). Not needed for the count line; needed for the fold.

**The sparkle** (`GameControlPanel.vue:2088/:2094`): `drop-shadow(0 0 2px var(--sparkle-glow-soft))`,
hover 5 px `-strong`; `transition: filter 200ms var(--ease-standard)`. Census 9 / 45,572 / 6,673 on
the dist, unmoved.

**The confirm's face** (`GameGallery.vue:1459`, hover `:1432`, focus `:1450` + the W1 §1.5 ribbon):
coupling 4's law, written once by the agglomerator — red word and drawn box (`currentColor`) on BARE
card, the 8% ground deleted, the hover selector fenced inside `@media (hover: hover)`. 4.99 / 6.30
bare, 4.69 / 5.08 hovered.

**Multiplayer chrome (§12)**: you write in `--color-user-ink`; your mark (§11, PLR-SELF) reads THIS
name at the root, never inside a rebound cell — the "nice blue" is your own ink, collapsing to
crayon-blue at night. Peers keep the walk; the join ring at 0.984 over `poseFronts`. SIX anchors to
PAL-TIN at ±5°: rose 14.2 · orange 68.7 · gold 83.7 · green 147.0 · blue 251.4 · the sixth 293.0 —
with the costs (5 collisions in the first 40 walk indices; i = 10 at 2.0° from the violet, i = 28 at
1.4° from your hand). F1 (chair §6.8): the `selfInk` substrate is PLR-SELF's; this palette for both
arms — NO: your pen everywhere; YES: your pen solo, your walk ink in the room — framed by the pen's
painted hue solo vs in-room. The fold's attribution tape is untouched and gains the print/forced arms
(section row, written once).

---

## 4 · Copy (M16, plain)

| carrier | string | rule |
|---|---|---|
| the margin's meta line (drawn, `aria-hidden`) | `3 of 20 on the board` | digits + `of` + digits + `on the board`; never `filled` (the FILL button's word), never `%` or `/` |
| `aria-valuetext` on the progressbar | the SAME literal | `aria-valuenow` = count, `aria-valuemax` = writable; `aria-label` `board fill` |
| its holder | `countLine` (a SPOKEN_SUFFIX) → swept by `check-copy-register`; `check-font-coverage` gains a `countLine` extractor reading the template's static segments + the `:meta` binding pinned in `BOUND_TAPES` (`:144-161`) | not a `check-live-regions` row |

## 5 · Motion — nothing minted

| what | rung | curve | consumer | PRM |
|---|---|---|---|---|
| the count's write-in | the GLOBAL `ink-write-in` keyframe (`index.css:1115`), MarginNote's own | `--ease-noteWrite` | `.margin-note-meta`, worn verbatim | same-frame |
| the count's rest + lift | `chromeLeaveMs` 200 (`pencilConfig.ts:163`) after ONE write-in band of rest — no `tapeRestMs` | `--ease-fadeOut` | the meta line's leave | same-frame |
| the fill front | ACC-FIVE's ruling on MOT-LADDER's rung (consumed; the step arm framed once) | — | `poseFronts` | snap |
| the win bow-out | HEAD's 500 ms opacity (the rung whose value is 500, named at citation) | ease | `.progress-trace` | snap |

## 6 · Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; trace 5.09 px @ α 1; the count on the margin's second line under the
  board, left-aligned with the voice; no board pixel moves.
- Phone 393×699 dpr3: board 365 px; trace 2.92 px; the count under the board above the toolbar
  (Frame A's own place for the board's words); the W2 bottom tab at the board's bottom-RIGHT never
  meets it; `min-height: 2lh` on the strip → toolbar top Δ 0 px across the count's life.
- Light: trace `answer-mid` @ α 1 ≈ 3.06 / 4.13 painted (the escape `#9b74f7` if < 3.10); digit 4.64;
  verb 4.99 / 4.69; the count is graphite on card (MarginNote's own ratios).
- Dark: trace `answer-deep` @ α 1 ≈ 3.3 / 3.3; digit 7.70; verb 6.30 / 5.08.

---

## 7 · Plan — files in order, what dies

1. `web/frontend/src/pencil/grid/gridPaths.ts` — `posePoints` / `poseLengths` / `poseFronts`
   (ACC-FIVE's 22 lines, verbatim — if ACC-FIVE's pass-3 worktree has landed them, COPY that file;
   never a second scanner). `FRAME_*_PAD` untouched.
2. `web/frontend/src/assets/index.css` — §2 in `:root` / `.dark`; the painted ledger as the comment;
   `:267-278` / `:403-407` rewritten; the print / forced arms incl. `.attribution-tape`;
   `--sparkle-glow-*` minted; `.board-margin { min-height: 2lh }` (or in `GameBoard.vue`'s scoped
   style beside `:1301-1335`, whichever owns the strip — stated).
3. `web/frontend/src/pencil/glyph/HandwrittenGlyph.vue:85` — fallback dies; + the unit row.
4. `web/frontend/src/games/shared/GameControlPanel.vue:2088/:2094` — tokens; `transition: filter`.
5. `web/frontend/src/pencil/chrome/GameGallery/GameGallery.vue:1459` (+ the W1.1 ribbon) — red word
   and box, ground deleted, hover fenced (coupling 4, written once).
6. `web/frontend/src/pencil/sheet/SheetWashiLabel.vue:56` — the text term leaves the seed; the
   docstring at `:16` becomes true. (16 instances re-tear once: declared π.)
7. `web/frontend/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` — `pathLength` + dash dropped at
   `:476-478` / `:509-511`; `:d` from `poseFronts`; `stroke-opacity` 1; `aria-valuetext` /
   `valuenow` / `valuemax` (`:296-307`) from new props `fillCount` / `writable`.
8. `web/frontend/src/games/shared/GameBoard.vue` — `fillCount`, `writable` (`:352-361`, from
   `fillable`), `boardKey`, `taught`, `showCount`, `countLine`, the `:meta` binding (`:1164`); the
   fold's `hoveredAuthor` / `isCoarse` / `focusout` rows UNTOUCHED. Arm A behind a flag.
9. `web/frontend/src/games/shared/DifficultyTally.vue:230-232` — `poseFronts` (hygiene, declared).
10. `web/frontend/scripts/check-copy-register.mjs:266-277` — `aria-valuetext` in `RENDERED_ATTRS` +
    one born-RED self-test colour.
11. `web/frontend/scripts/check-font-coverage.mjs` — the `countLine` extractor; the `:meta` pin in
    `BOUND_TAPES`.
12. `web/frontend/scripts/check-theme-tokens.mjs` — the law-20 direction arm (stop vs rung,
    `#sparkle-rainbow` admitted by name, plant → exit 1) and the alias allowlist with exit 1.
13. Unit tests — `countLine` literal at 1 / 2 / 3 / writable 3; `boardKey` lifecycle (undo-to-empty,
    restored session, new deal); `SheetWashiLabel` seed stability across a text change.
14. Instruments as diffs under `pass3/prototype/ACC-SIX/instruments/` (r0 rows MOVED, never edited):
    `accent-kinship` six anchors (the exception list SHRINKS — solver stop 2 leaves it, kin at 0.0°);
    the G0 segment probe (section); `rect-census-fold.mjs` COPIED.
15. Hand-offs: the six arcs to PAL-TIN; the mark's colour to PLR-SELF; the seeded-geometry warning to
    CTRL-TAPE / PLR-COUNT / MRK-LIVE; law 39 to §6; the `2lh` reserve to NOTE-LEDGER as a shared row.

Dies: `#2563eb` / `#60a5fa`; two `rgba()` literals; the glyph fallback; the "46° off" comment;
`transition: all`; `pathLength="1000"` ×2 + dashes; the guard's 8% ground and clause;
`props.text.charCodeAt(0)`; pass 2's tape component, `tapeRestMs`, the top-right anchor, `TAPE_FILLS`,
the four-form G0. Born: `#2f76bd`, one string, one reserve, (conditionally) `#9b74f7`. Files: 9 product
+ 3 scripts + tests.

---

## 8 · Prototype brief

**Build.** Fresh `git worktree` from `74a2b5d9` under the scratchpad; replay pass 2's diff (11 files,
worktree `-42`) by file copy if `git` is refused (state the route); the five fold-touched files
(`GameControlPanel.vue` +7, `GameBoard.vue`'s `hoveredAuthor`/`isCoarse`/`focusout`, `check-font-coverage`
`+34`, `check-copy-register` +937) resolve TOWARD the fold and every re-cut hunk is named; the pass-2
tape and its `tapeRestMs` are NOT replayed. Then §7 in order. Prototype server on **:4237**, HEAD
control on the next free port in 4230–4249; each a two-line scratch vite config with a private
`cacheDir`, `--host 127.0.0.1 --strictPort`; scratch Playwright config (no `webServer`); chromium +
webkit; 1280×800, 393×699 dpr3 (`hasTouch`), 844×390; light + dark. Build the dist INSIDE the
worktree with its OWN cacheDir for the census, the painted ledger and the goldens (never build on
main; build and serve never share a cacheDir — exit 144). Kill both servers; verify; remove the
worktree. > 90 s → background + log.

**Numbers that mean success.**
- G0: five segment arms × 2 engines × 2 dprs, RED at 493 on the HEAD control, ≤ 2 points after the
  cure on the live gauge at p = 0.05 / 0.25 / 0.50; the CSS-form and 4-subpath controls beside.
- THE LIGHT TRACE, painted (modal-of-run over 24 columns, 45° hue window, grounds from a progress-0
  screenshot): ≥ 3.0 on BOTH grounds, both engines, both themes; the margin REPORTED; if < 3.10 on
  either engine in light the escape rung is applied and re-read (≥ 3.25 expected) and the return
  says which arm shipped.
- THE COUNT: laid at fill 1; `countLine` == `aria-valuetext` == `N of M on the board`; `aria-valuenow`
  / `-valuemax` == count / writable; occlusion of the painted trace AND of every cell box = 0 px² at
  all three viewports (by construction — asserted anyway); toolbar top Δ 0 px at fill 0 / 1 / 3 /
  lift at 393×699; gone one write-in band + `chromeLeaveMs` ± 100 ms after fill `min(3, writable)`;
  a 4×4 deal leashed to 3 writable shows 3 then lifts; undo-to-empty no line; a restored two-fill
  session no line; Arm A's cell-occlusion px² declared at each viewport, one crop.
- THE SEED: `clip-path` / `--washi-tilt` byte-equal across `1 of 20` → `3 of 20` on a test label AND
  on the fold's attribution tape across two peers (RED at HEAD's seed); all 16 instances' boxes move
  ≤ 0.55 px (declared π).
- Digit 4.64 / 7.70 ± 0.02; verb ≥ 4.5 painted at rest AND hovered, both engines, both themes, box
  ≥ 3:1; glow byte-matches `answer-pale` at α .3 in 5/5 runs; `filterBudget` 9 exact, 45,572 ± 2% /
  6,673 ± 2% on the dist.
- Off-ANCHOR share (> 5° from six anchors at C ≥ 0.05, exception ledger named and summed): light
  ≤ 30% (HEAD 64.29), dark ≤ 5% (HEAD 49.15), both engines; the six-anchor control (one anchor
  moved 6°) REDs.
- `check-theme-tokens` (law-20 arm + alias exit; both plants red), `check-copy-register` BARE with the
  `aria-valuetext` widening and its plant red, `check-font-coverage` green with the pin and no
  re-cut, `check-live-regions` unchanged, `check-ink-pressure`, `lint:motion`, `test:prod-shake`,
  `test:golden:bytes`, `test:support-floor`, `test:unit:count`, `lint:knip`, `lint:eslint` — bare.
- π: `rect-census-fold.mjs` prototype vs HEAD control; R6 heading census unmoved; R3 wobble unmoved;
  goldens: `cell-light` moves by the pen only, DELTA declared (no re-mint); `grid-corner-light` 0 px;
  non-board 0 px.

**Crops** (≤ 4, ≤ 150 KB, cited): (1) the board's bottom edge + margin strip 330×120 at fill 1, phone
light — the count under the board, the ring's first arc whole at the top-left (the memorable thing on
the margin); (2) the SOLVED board's corner, light — the trace and a revealed digit, the violet twice
at once (kill-by-form, the six-anchor ruling's one claim); (3) Arm A — the bottom-left tape at phone,
one frame, for U-10; (4) held in reserve.

---

## 9 · Born-RED gates (HEAD reading stated)

| id | asserts | HEAD `74a2b5d9` |
|---|---|---|
| **G0 segments** (section) | one form, 25/123/246/493/599, × 2 engines × dpr 1/3, share within 2 pts; live gauge chromium ≈ webkit within 2 pts | RED at 493 (`a8fee1f5` 89.3% vs 24.0% bare page; re-read) |
| G1 kinship | R2 rows 1/2 with the SIX-anchor ruling, KIN_DEG 5, painted; exceptions = the walk and rainbow stops 1/3/4/5 | RED (`user-ink` 11.5°; `progress-ink` off every anchor until the sixth is declared) |
| **G2 the light trace** | painted modal core ≥ 3.0 on line AND paper, both engines, both themes, at α 1; margin reported; the escape rule stated before the run | RED (2.876 light at HEAD) |
| G3 print / forced | `.progress-trace` `#000` / `CanvasText`; `.attribution-tape` hidden / `CanvasText` | RED (`rgb(139,92,246)`; the tape prints) |
| G4 the verb | chroma > 0 AND painted ≥ 4.5 at rest AND hovered, both engines, both themes; box ≥ 3:1 | RED (achromatic) |
| **G5 the count** | laid at fill 1; literal == `aria-valuetext`; `valuenow`/`valuemax`; occlusion 0 px² of trace AND cells at 3 viewports; toolbar Δ 0 px; lifts after `min(3, writable)` + one band + 200 ms ± 100; undo / restore / new-deal arms; a 3-writable deal shows 3 | RED (no count) |
| **G6 the seed** | a washi label's `clip-path` and `--washi-tilt` byte-equal across a text change, incl. the fold's attribution tape across two peers | RED (`SheetWashiLabel.vue:56`) |
| G7 the holders | `check-copy-register` discovers `countLine` and reads `aria-valuetext` (plant RED); `check-font-coverage` derives the line's alphabet from the template and the `:meta` pin is in the bound census | RED until widened / pinned |
| G8 off-anchor share | six anchors, 5° at C ≥ 0.05 with the ledger: light ≤ 30%, dark ≤ 5%, both engines; the moved-anchor control REDs | RED (64 / 49) |
| **G9 law 20 + alias, with exit codes** | no chrome selector names a STOP; `#sparkle-rainbow` admitted by name; plant → exit 1. `strays ⊆` the named allowlist else exit 1 | GREEN at HEAD on the rule, RED on the exit code (none exists) — the charter's row 8 |
| G10 the glow | painted glow byte-matches a resolved token at its alpha, 5/5 | RED (inline `rgba`) |
| G11 no stock hex | `#2563eb` / `#60a5fa` / `rgba(196,181,253` absent from `index.css` and `HandwrittenGlyph.vue` | RED |
| G12 guards, GREEN by construction | digit AA both themes; `filterBudget` 9 + areas on the dist; rainbow tolls; peer worst over 40; the 16-instance census (declared π on two properties only); `check-*`; `lint:motion` | must stay |

## 10 · What the owner disposes (U-10), and what the agglomerator seats

Owner: whether your hand may desaturate (C 0.215 → 0.131, 5.06 → 4.64); the count UNDER the board
(default) vs the bottom-left tape (Arm A, crop 3); whether `on the board` reads better than `written`
beside a `Fill` button; the light trace's fourth rung if the number calls for it. Agglomerator:
`poseFronts` is ACC-FIVE's, consumed here — the merge-watch condition met; the guard's ground deletion
is coupling 4's law, written once; the print/forced arms incl. the fold's tape are a section row,
written once; the `2lh` margin reserve is shared with NOTE-LEDGER, written once; the `--color-blue-ink`
collapse is the same ruling as ACC-FIVE's (`index.css:147-148`). Nothing closes here.
