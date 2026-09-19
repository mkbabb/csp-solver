# ACC-SIX — the sixth crayon · pass-2 SYNTHESIS (the spec)

§3 accent family · §4 fill meter · §12 multiplayer chrome · §15 danger ink · M07. Synthesizer:
Fable 5.1. Inputs: `../research/ACC-SIX/README.md` (pass 2, 15 sections, built-dist readings),
`../../pass1/synthesize/ACC-SIX.md`, `../../pass1/critique/ACC-SIX.md`,
`../../pass1/prototype/ACC-SIX/proto/acc-six-proto.diff` (11 files, +377/−88), the r0 censuses
(R2, R6), the owner's frames (`marks/m01` — the dark iPhone board with the violet trace on the
frame and the hint note below; `m09`), the sibling pass-2 records (ACC-GRAPHITE E, ACC-FIVE §0/§2,
PAL-TIN §7), and the chair's rulings, read first. The frontend-design skill was invoked; §0 is its
two-pass method. Read-only on the product. U-10.

Chair compliance: FRAME_PAD ships at HEAD's `12 / 0` and the geometric assertion, the symmetry
constant and the re-mint numbers go to that row (§6.2); the focus-ring token is read, never
written (§6.1 — the pass-1 deletion is withdrawn; §3 states which candidates the palette survives
on); `.cell-because` untouched (§6.11); `filterBudget` EXACTLY 9, measured on the dist (§7); the
six-anchor kinship ruling is a MOVED diff (`../research/ACC-SIX/instruments/`), never an r0 edit.

---

## 0 · Plan, then the review against the tells

**Subject.** A pencil-and-paper sudoku whose answer key is written in a violet no house colour
sits within 41° of. The family's sentence: the sixth colour is NAMED, not minted — the answer's
violet, ink only, one job — and blue takes exactly one job, you.

**Tokens.** Zero new violet bytes; one new blue.

| role | token | light | dark | OKLCH |
|---|---|---|---|---|
| the answer, three rungs already in the tree | `--color-answer-pale` / `-mid` / `-deep` | `#c4b5fd` / `#8b5cf6` / `#7c3aed` | same three | h 293.6 / 292.7 / 293.0 |
| the revealed digit's stop | `--color-solver-ink-2` → `answer-deep` (light) / `answer-pale` (dark) | 5.60 on card | 10.14 | |
| the work in progress | `--color-progress-ink` → `answer-mid` (light) / `answer-deep` (dark) | 3.36 grid-line / 3.85 card @.95 | 3.46 / 3.07 | HEAD-identical bytes |
| the solver's glow | `--sparkle-glow-soft` / `-strong` = `color-mix(in srgb, var(--color-answer-pale) 30% / 60%, transparent)` | | | 900 px², one filter |
| your hand | `--color-user-ink` | `#2f76bd` | `var(--color-crayon-blue)` `#6aabeb` | h 251.4 locked; 4.64 card / 4.53 bg; dark 7.70 / 7.86 |
| the focus ring | `--color-focus-sketch` | **§6's** | **§6's** | 253.3, 1.9° off crayon-blue |
| RETIRED | `#2563eb`, `#60a5fa`, `rgba(196,181,253,…)` ×2, the glyph's `#2563eb` fallback, the guard's 8% ground, `pathLength="1000"` ×2 | | | |

**Type.** Patrick Hand's cut for one new drawn string: `3 of 20 on the board`. Every codepoint
is in `index.css:94-96` (`0-9`, space, `a-i`, `k-w`); `%` `/` `j` `x` are not and never appear.
Zero re-cut.

**Layout.** Nothing moves except one tape at the board's top-right corner, flush with the
frame's top edge. Pass 1 moved the frame 7.63 px; chair §6.2 struck it.

**Principles.** (1) A sixth colour is one more thing to learn, so it takes exactly one job.
(2) Contrast is bought by lightness at a locked hue. (3) A label may not hide the thing it
explains for the whole time it is up. (4) The one literal has two carriers — drawn and spoken —
and one holder.

**The review.** The generic cure (brand accent everywhere, a percent-labelled bar, a glow, a
red-tinted button) is refused on the same numbers as pass 1. Four pass-1 defaults changed by
pass-2 numbers:

- *The tape at the top-left, straddling the frame* was the default "label at the origin". It
  occludes 74% of the first fill at the desk and 100% on the phone, and straddles a masthead
  with 4.06 px of air. It moves to the **top-right, flush** — the corner the clockwise trace
  reaches last (24.7% fill), so occlusion is zero for the tape's whole life by arithmetic (§4).
- *`--color-blue-ink` + `--color-user-ink` alias* is the third-name shape `index.css:147-148`
  forbids, and every consumer wants the binding. Collapsed to one token (§2).
- *A 5% neutral ground under the red verb* reads 4.49 (under AA) and the hover rule erased the
  red anyway. Ground deleted; the verb and its drawn box carry the red on bare card (§5).
- *`noteWriteMs` minted for the tape* was a ledger with one consumer. The keyframe and its curve
  are already global; the tape wears them verbatim and mints one constant, `tapeRestMs` (§6).

One memorable thing per surface: BOARD, a small paper tape at the top-right that says how many
are on the board for the first three fills, then lifts; ANSWER, one named violet in three
pressures; HAND, one blue at three pressures; CONFIRM, the verb and its box in red. Everything
else is quiet.

---

## 1 · The section finding: the dash law is bounded, and the cure is this family's deletion

ACC-SIX §2 measured the SHIPPED gauge on the built dist: one write of twenty paints 5.5% in one
arc (chromium) and 21.1% in four arcs (webkit), factor `totalLength/pathLength` = 3.966 — the
"four" was never a constant. ACC-GRAPHITE's E readings on the same ring with `1000 1000` @ 750
declared in CSS read 0.249 vs 0.251; ACC-SIX's bare page with the dash as a presentation
attribute read 0.240 vs 0.893. So the law is BOUNDED by declaration form: *under `pathLength`,
WebKit mis-scales a dash declared as a presentation attribute; a CSS-declared dash is
engine-identical.* Population at HEAD: `HandDrawnGrid.vue:476-478`, `:509-511`, and
`DifficultyTally.vue:230-232` on the controls card (`pathLength="100"` + `stroke-dasharray="100
100"` attribute — the same shape, §10's row, handed with the mechanism). CSS-declared sites
(`index.css:766`, `gameCell.css:235/:251`) are clean.

**The cure, a deletion, in this family's diff**: drop `pathLength` from both paths and dash in
real user units from a pure `poseLengths(frames): number[]` beside `generateFrameTraceFrames`
(`gridPaths.ts:352`), bake-time, no DOM read:

```
:stroke-dasharray="`${L[f]} ${L[f]}`"   :style="{ strokeDashoffset: L[f] * (1 - progress) }"
```

Engine-independent by construction; better normalised (poses differ by 2.52 u in 3,965, 0.064%,
≤ 1.6 px of front on a 2,513-px perimeter — the ONE declared π on a surface this family claims);
the join ring is cured in the same diff. Fallback if the wave refuses the pixel: `pathLength`
set to each pose's own rounded length. The dpr-3 hypothesis is closed by an arm of the same
probe (§9 G0).

---

## 2 · Tokens (`index.css`), and the ONE ratio ledger

```css
:root {
  /* THE SIXTH ANCHOR — the answer's violet, INK ONLY: no wax tier, no crayon dark law. One hue
     (293°), three rungs, all three already in the tree. Zero new hexes. Law 20 amended: the
     rainbow's STOPS are board content; the ANCHOR HUE may be named, and chrome that carries it
     names the rung, never the stop. */
  --color-answer-pale: #c4b5fd;   /* L .811 C .101 h 293.6 */
  --color-answer-mid:  #8b5cf6;   /* L .606 C .219 h 292.7 — the only rung inside the light trace's window */
  --color-answer-deep: #7c3aed;   /* L .541 C .247 h 293.0 — the only rung inside the dark trace's window */
  --color-solver-ink-2: var(--color-answer-deep);
  --color-progress-ink: var(--color-answer-mid);
  --sparkle-glow-soft:   color-mix(in srgb, var(--color-answer-pale) 30%, transparent);
  --sparkle-glow-strong: color-mix(in srgb, var(--color-answer-pale) 60%, transparent);

  /* BLUE, ONE JOB — crayon-blue's INK tier, hue-locked at 251.4 (the red-ink / green-ink /
     orange-ink move). L .555 C .131. No alias above it (T5-W2 2.3, four lines up): the 24 var()
     consumers all want the BINDING the peer seam rebinds (playerIdentity.ts:69). The player
     mark (§11) reads THIS name at the root, never inside a rebound cell. */
  --color-user-ink: #2f76bd;
}
.dark {
  --color-solver-ink-2: var(--color-answer-pale);
  --color-progress-ink: var(--color-answer-deep);
  --color-user-ink: var(--color-crayon-blue);   /* ink collapses into wax at night: #6aabeb */
}
@media print                   { .progress-trace { stroke: #000 !important; } }   /* @layer base, beside .grid-line */
@media (forced-colors: active) { .progress-trace { stroke: CanvasText; } }
```

**The ONE ratio ledger** replaces the charter's, pass 1's and the old `--color-answer-mid`
comment, minted once as the comment block beside these tokens (validated against painted bytes
on the built dist, both engines, both themes — `../research/ACC-SIX/readings/ratios.txt`):

| row | light | dark | floor |
|---|---|---|---|
| trace @.95 over grid-line / card | 3.36 / 3.85 | 3.46 / 3.07 | 3.0 |
| solver-ink-2 as text on card | 5.60 | 10.14 | 4.5 |
| user-ink as text on card / background | 4.64 / 4.53 | 7.70 / 7.86 | 4.5 |
| red-ink on bare card · on the hover ground | 4.99 · 4.69 | 6.30 · 5.08 | 4.5 |
| red-ink on a 5% / 8% neutral ground (why the ground died) | 4.49 / 4.20 | 5.68 / 5.26 | 4.5 |
| ring `#3a7bc4` @.9 (HEAD, §6's) · `#6aabeb` @.9 | 3.63 · 3.89 | 3.69 · 6.42 | 3.0 |

The `index.css:267-278` "SIXTH crayon … 46° off focus-sketch" comment is rewritten: the sixth is
an ANCHOR of the house, ink only; the light/dark inversion is forced by the four-ground
intersection being empty. **Law 19** amended in the same commit: *a stroke that must clear 1.4.11
on both papers takes the ink tier on the light paper and the wax on the dark — one hue, three
pressures, separation by form.* **Law 39** is §6's to re-word when it disposes the token.

---

## 3 · Components and states

**The focus ring** (`gameCell.css:246/:248`): §6's. Survives all three candidates in MRK-LIVE's
table (A `#3a7bc4` one value, B/C `#6aabeb` dark alias) — the token is 253.3°, 1.9° from
crayon-blue, inside KIN_DEG 5, so the accent law never required the deletion pass 1 made; it
bought contrast (3.63 → 3.89 light, 3.69 → 6.42 dark) and name-thrift. Two traps for §6, stated:
the selector sits inside the cell `playerIdentity.ts:69` rebinds, so never `--color-user-ink`;
and the fallback `var(--color-focus-sketch, var(--color-crayon-blue))` means a bare deletion
lands silently on crayon-blue. A ring at HEAD's `#2563eb` (11.5° off) reds the kinship row; a
ring in the answer's violet reds kill-by-form.

**Your digit** (`HandwrittenGlyph.vue:85`): `return "var(--color-user-ink)"` — the fallback dies,
dead in both themes. 4.64 light (AA, 0.14 headroom) / 7.70 dark. The pen desaturates
(C 0.215 → 0.131); the owner disposes.

**The unit wash**: unchanged, crayon-blue 7%. Pen, wash and ring are one hue, three pressures.

**The fill trace** (`HandDrawnGrid.vue:461-480`): hue unchanged (HEAD bytes), the §1 cure,
FRAME_PAD at HEAD. Dash tween 240 ms on `--ease-drawOn`; win bow-out 500 ms (as HEAD). No track
ring.

**The count tape** (new). A `SheetWashiLabel` in a new anchor `head`, absolute at the board
wrapper's **top-right**, `right` = FRAME_X_PAD scaled (12 u × 0.636 = 7.6 px desk / 4.4 px
phone), `top: 0` (flush, lift 0 — the masthead's ink bottom leaves 4.06–5.24 px of air and a
23-px tape needs 11.5 to straddle), `z-index: 3`, `pointer-events: none`, `aria-hidden`. The
compartment tag's own pose: `--sheet-washi-neutral`, seeded six-point tear, ±1.5° tilt,
`--type-tag`, weight 500, lowercase, foreground ink (the washi voice, not the violet — no
contrast question, no law-20 crossing). Measured desk 93.3 × 23.0 px for `3 of 20 written`;
`on the board` is four characters longer, ~118 px desk / ~105 px phone (28.7% of a 365-px
board) — re-measured, not assumed. The trace runs clockwise from the top-left and reaches the
top-right corner at 620.7 / 2513.5 = 24.7% fill; the tape is up for fills 1–3 (≤ 15%), so
**occlusion is 0 for its whole life at every viewport by arithmetic**, and the box starts at
x ≈ 667 where the masthead's ink ends at 549. Cost: the tape no longer marks where the trace
begins; a label that hides what it explains is not a label.

- **The seed is pinned in the component**: `SheetWashiLabel.vue:56` drops `+ props.text.charCodeAt(0)`
  (the prop's own docstring at `:16` promises the tear and tilt never re-roll). One-time declared
  π: the four compartment tags on the controls card re-tear once (§10 is re-cutting that card in
  this wave; the computed-style census in §8 proves everything else on them is byte-equal).
- **Lifecycle, one computed.** `boardKey = computed(() => [...props.givenCells].sort().join())`
  (`GameBoard.vue` already watches `givenCells.size` at `:782`); `watch(boardKey, () => { taught =
  false; tape = "off" })`; the tape lays down ONLY on the 0 → 1 transition of `fillCount` while
  `!taught`; `taught = true` after the third fill's rest. Undo to empty leaves `taught` true (no
  resurrection); a session restored at two fills has no 0 → 1 transition (no mid-board tape).
  The count updates in place on fills 2 and 3 (no re-write); after the third fill it rests
  `MOTION.tapeRestMs` then lifts over `chromeLeaveMs` on `--ease-fadeOut`; a write during the
  rest window does not extend it. Computed on props, never on the beat.
- **Multiplayer**: `fillProgress` counts every non-given cell with a value, peers included
  (`GameBoard.vue:353-359`), so the tape counts the BOARD and the literal says so. Counting only
  your writes is a §12 plumbing row (per-cell authorship exists in `ledger.clock` but is not
  plumbed to `GameBoard`), not a copy row.

**The sparkle** (`GameControlPanel.vue:2081/:2087`): `drop-shadow(0 0 2px var(--sparkle-glow-soft))`,
hover 5px `-strong`; `transition: filter 200ms var(--ease-standard)`. Census unmoved: 9 elements,
that row 900 px², union 45,500 / 45,524 desk (chromium / webkit) inside 45,572 ± 2%, 6,601
coarse inside 6,673 ± 2% — on the dist.

**The confirm's face** (`GameGallery.vue:1455-1461` + the W1 §1.5 ribbon):

```css
.guard-leave .guard-face { color: var(--color-red-ink); }                    /* the 8% ground DIES; 4.99 / 6.30 bare */
@media (hover: hover) { .guard-btn.guard-leave:hover .guard-face { color: var(--color-red-ink); } }   /* (0,4,0); 4.69 / 5.08 on --color-accent */
```

`HandDrawnOutline` strokes `currentColor`: the drawn box reddens with the word. The comment
clause "plus the 8% ground, exactly as `deal` wears it in the band" (`:1455-1458`) dies with the
ground. `keep` unchanged. Coupling 4's law, confirmed a fifth time: the verb sits on bare card and
the mark of arming is colour and stroke weight, never a ground.

**Multiplayer chrome (§12)**: you write in `--color-user-ink`; your mark (§11, PLR-SELF) takes the
same token at the root when a session is live — the "nice blue" is your own ink, 4.53 on the light
page, collapsing to crayon-blue (7.86) at dark. Peers keep the walk; the join ring at its shipped
0.984. The reserved set the palette must clear is SIX anchors at ±5°: rose 14.2 · orange 68.7 ·
gold 83.7 · green 147.0 · blue 251.4 · **the sixth 293.0** — to PAL-TIN with the costs: 5
collisions in the first 40 walk indices at ±5° (4 with five anchors); i = 10 at 295.0°, 2.0° from
the answer's violet; i = 28 at 250.0°, 1.4° from your own hand; 9 of 40 gamut-clipped below
C 0.110 (worst i = 25 at 0.0868). PAL-TIN's tin already reports its violet at ΔE 0.046 from
`#c4b5fd` at pass-1 bands and ≥ 0.09 at the moved band — the pale rung is the contested berth
and this family formalises it as an anchor, stated so PAL-TIN scores against it. F1: the board
keeps your blue.

---

## 4 · Copy (M16, plain)

| carrier | string | rule |
|---|---|---|
| the tape (drawn, `aria-hidden`) | `3 of 20 on the board` | digits + `of` + digits + `on the board`; never `filled` (the FILL button's word, on the same card at the desk rail), never `%` or `/` |
| `aria-valuetext` on the sr-only progressbar (`HandDrawnGrid.vue:306`) | the SAME literal | one act, one name (law 33); `aria-valuenow` = the count, `aria-valuemax` = the writable count, `aria-label` stays `board fill` |
| its holder | a unit on `fillCount` → literal, plus the `:text="tapeText"` pin in `check-font-coverage.mjs:494-497`'s BOUND CENSUS and the template-capturing `countTape` extractor | NOT a `check-live-regions` row: that script's subject is `aria-live` / `role=status\|alert\|log` under `v-if` (`:57-58`); the gauge is a progressbar with no live region — widening it to fit a claim is refused |

`countTape` captures the template rather than emitting a constant:
`/`\$\{[^}]*\}([^`]*)\$\{[^}]*\}([^`]*)`/` → `"0123456789" + M[1] + "0123456789" + M[2]`, so a
copy edit changes the derived set and `⊆` does the work, and the estate's own empty-derivation
guard (`:466-471`) still covers a rename.

## 5 · Motion (home: `pencilConfig.ts` MOTION)

| constant | value | curve | consumer | PRM |
|---|---|---|---|---|
| `MOTION.tapeRestMs` | **2400** — the ONE new constant | — | the tape's rest after the third fill | same-frame hide |
| write-in | `ink-write-in 250ms var(--ease-noteWrite) backwards` — GLOBAL keyframe (`index.css:1115`) and token (`:349`), worn verbatim; **`noteWriteMs` is not minted** | `--ease-noteWrite` | the tape's lay-down | same-frame show, `fill: backwards` |
| lift | `chromeLeaveMs` 200 (existing) | `--ease-fadeOut` | the tape's exit | same-frame |
| `MOTION.traceFillMs` / `traceWinMs` | 240 / 500 (naming existing) | `--ease-drawOn` / `ease` | the dash front / the bow-out | no tween / snap |

## 6 · Desktop and mobile, light and dark

- Desk 1280×800: board 636 px; trace 5.09 px; tape ~118 × 23 px at (board.right − 7.6 − w, 0).
- Phone 393×699 dpr3: board 365 px; trace 2.92 px; tape ~105 × 20 px; at the W2 bottom-tab pose
  the tape is at the board's TOP edge and the tab at its bottom — no contact.
- Light: trace `#8b5cf6` 3.36 / 3.85; digit 4.64; verb 4.99 / 4.69; the tape is foreground ink
  on neutral washi (the tag's own ratios, unchanged).
- Dark: trace `#7c3aed` 3.46 / 3.07; digit 7.70; verb 6.30 / 5.08.

---

## 7 · Plan — files in order, what dies

1. `pencilConfig.ts` — `traceFillMs 240`, `traceWinMs 500`, `tapeRestMs 2400`. (No `noteWriteMs`.)
2. `gridPaths.ts` — `poseLengths()` beside `:352`; `FRAME_Y_PAD` stays 0.
3. `index.css` — §2 in `:root` / `.dark`; the ledger comment; laws 19/20 amended in the comment
   record; `:267-278` / `:403-407` rewritten; the two `.progress-trace` arms at `:894-952`.
4. `HandwrittenGlyph.vue:85` — fallback dies.
5. `GameControlPanel.vue:2081/:2087` — tokens; `transition: filter`.
6. `GameGallery.vue:1455-1461` (+ the W1.1 ribbon) — red word and box; ground deleted; compound
   hover selector; the clause deleted.
7. `SheetWashiLabel.vue:56` — the text term leaves the seed; anchor `head` (top-right, flush).
8. `HandDrawnGrid.vue` — `pathLength` dropped at `:476` / `:509`, per-pose dash from
   `poseLengths`; the tape mounted; `aria-valuetext` / `valuenow` / `valuemax` (`:300-307`); the
   timings v-bound.
9. `GameBoard.vue` — `fillCount`, `boardKey`, `taught`, the 0 → 1 lay-down (`:353-361`, `:782`).
10. `scripts/check-font-coverage.mjs` — the template-capturing `countTape`; `:text="tapeText"`
    pinned in `BOUND_TAPES`.
11. Unit tests — `fillCount` literal; `boardKey` lifecycle (undo-to-empty, restored session);
    the seed stability of `SheetWashiLabel` across text changes.
12. Instruments as diffs (`../research/ACC-SIX/instruments/`, r0 rows MOVED): `accent-kinship`
    six anchors, KIN_DEG 5 unchanged, the exception list SHRINKS (solver stop 2 leaves it — kin
    by name at 0.0° from the sixth); the FRAME_PAD viewBox-unit assertion (`y0` envelope
    −6.0 < y0 < −3.5; `FRAME_X_PAD === FRAME_Y_PAD` is that row's ruling, not this one's; the 3.0-u
    asymmetry floor) handed to the FRAME_PAD row.
13. Hand-offs, not this patch: the six arcs to PAL-TIN; the mark's colour to PLR-SELF; the seeded-
    geometry warning to CTRL-TAPE / PLR-COUNT / MRK-LIVE; `DifficultyTally.vue:230-232` to §10;
    law 39 to §6.

Dies: `#2563eb` / `#60a5fa`; two `rgba()` literals; the glyph's fallback; the "sixth crayon, 46°
off" comment; `transition: all`; `pathLength="1000"` ×2; the guard's 8% ground and its clause;
`props.text.charCodeAt(0)` in the seed; pass 1's `FRAME_Y_PAD 12`, `--color-blue-ink`, the
`--color-focus-sketch` deletion, the top-left straddle, `noteWriteMs`. Born: `#2f76bd`,
`tapeRestMs`, one string. Files: 10 product + 1 script + tests.

---

## 8 · Prototype brief (pass 2 builds this)

**Build.** Fresh `git worktree` under the scratchpad; replay `acc-six-proto.diff` MINUS its pad
hunk, its `--color-blue-ink` / focus-sketch hunks, its `noteWriteMs` hunk and its top-left
anchor; then steps 1–11. Server: scratch vite config with a private `cacheDir` (the research's
preview-only config is fine for the dist; the dev config spreads the estate's from INSIDE
`web/frontend`), `--host 127.0.0.1 --port 4237 --strictPort` (next free if taken); scratch
Playwright config, no `webServer`, `baseURL` :4237; chromium + webkit; 1280×800 and 393×699 dpr3
(the mobile descriptor, coarse pointer); light and dark. Build the dist INSIDE the worktree for
the census and goldens (check W8's flight; never in the main tree); `test:e2e:throttle --
filter-census` only when no other lane holds :4188. Kill the server; verify; remove the worktree.

**Numbers that mean success.** G0 four arms × two engines × dpr1/dpr3, RED at HEAD's arm,
≤ 2 points after step 8 at p = 0.05 / 0.25 / 0.50 on the live board; the four 1.4.11 ratios
byte-identical to HEAD (3.36 / 3.85, 3.46 / 3.07); digit 4.64 / 7.70; verb ≥ 4.5 painted at rest
AND hovered, both engines, both themes, box ≥ 3:1; the tape: laid at fill 1, literal ==
`aria-valuetext` == `N of M on the board`, box entirely inside `[board.right − w − 7.6, board.right
− 7.6] × [board.top, board.top + h]` at desk and phone, masthead BOX and INK overlap 0 px² at
every viewport, occlusion of the painted trace 0 px for fills 1–3, gone `tapeRestMs +
chromeLeaveMs` ± 100 ms after the third fill, a fourth write inside the window shown and not
extending, undo-to-empty no tape, a restored two-fill session no tape; the tape's `clip-path`
and `--washi-tilt` byte-equal across `1 of 20` → `3 of 20` (RED at HEAD's seed); off-ANCHOR share
(> 15° from six anchors) full-board chromium light ≤ 30% (HEAD 64.29), dark ≤ 5% (HEAD 49.15),
webkit likewise; the glow byte-matches `answer-pale` at α .3 in 5/5 runs with the token parsed
with the sheet; `filterBudget` 9 exact, 45,572 ± 2% / 6,673 ± 2% on the dist; the four
controls-card tags: computed-style census (box, the four `--washi-*` properties, `font`) equal to
the hundredth before/after, `clip-path` / `transform` DIFFERENT and declared; `check-font-coverage`
green with the pin and no re-cut; `check-copy-register` 0 unadmitted; `check-live-regions`
unchanged; R6 heading census unmoved; R3 wobble unmoved; goldens: `cell-light` moves (the pen)
with its DELTA declared, `grid-corner-light` 0 px at HEAD's pad, non-board 0 px.

**Crops** (two remain of four; ≤ 150 KB, cited): (1) the board's top-right 330×210 at fill 1,
desk light — the tape flush at the corner and the whole first arc visible at the top-left;
(2) the SOLVED board's corner, light — the trace and a revealed digit, the violet twice at once
(kill-by-form: the one claim the six-anchor ruling rests on). The phone width claim and pose 4
(the armed confirm) are carried by numbers.

---

## 9 · Gates it lands with (born-RED at HEAD unless marked)

| id | asserts | HEAD |
|---|---|---|
| **G0 dash bound** (section) | bare page, pose-0 `d`, `pathLength="1000"`, four declaration arms × two engines × dpr1/dpr3 within 2 points; live gauge chromium ≈ webkit within 2 points at p = 0.05 / 0.25 / 0.50 | **RED**: webkit 21.1% vs 5.5% at one write; 89.3% vs 24.0% on the bare page |
| G1 kinship | rows 1/2 with the SIX-anchor ruling, KIN_DEG 5, painted; exceptions = the walk and rainbow stops 1/3/4/5 | RED (`user-ink` 11.5°; `progress-ink` off every anchor until the sixth is declared) |
| G2 the glow | painted sparkle glow byte-matches a resolved token at its alpha, 5/5 runs | RED (inline `rgba`) |
| G3 print / forced | `.progress-trace` `#000` / `CanvasText`, both engines | RED (`rgb(139,92,246)`) |
| G4 the verb | chroma > 0 AND painted ≥ 4.5 at rest AND hovered, both engines, both themes; box ≥ 3:1; subject-count guard | RED (achromatic; hover erased pass 1's red) |
| **G5 the tape** | laid at fill 1; literal == `aria-valuetext` == `N of M on the board`; top-right flush inside the board box; masthead box AND ink overlap 0 at 1280×800 / 393×699 / 900×450; painted trace occlusion 0 px for fills 1–3; gone `tapeRestMs + chromeLeaveMs` after the THIRD fill, not extended by a write in the window; undo-to-empty and restored-session arms | RED (no tape) |
| **G6 the seed** | a washi label's `clip-path` and `--washi-tilt` are byte-equal across a text change | RED (`SheetWashiLabel.vue:56`) |
| G7 the literal's holder | `check-font-coverage` derives the tape's alphabet from the TEMPLATE (a copy edit changes the derived set) and `:text="tapeText"` is pinned in the bound census | RED until pinned (the estate's own bound-census guard reds on the undeclared binding) |
| G8 off-anchor share | six anchors, 15° arc: light ≤ 30%, dark ≤ 5%, both engines | RED (64 / 49) |
| G9 alias law | `check-theme-tokens` ALIAS-ONLY = ∅ beyond `teacher-red` / `gold-star` | GREEN at HEAD; RED at pass 1 (`--color-blue-ink`) — regression guard |
| G10 no stock hex | `#2563eb` / `#60a5fa` / `rgba(196,181,253` absent from `index.css` and `HandwrittenGlyph.vue` | RED |
| G11 guards, GREEN by construction | the four 1.4.11 ratios byte-identical; digit AA both themes; `filterBudget` 9 + areas on the dist; rainbow tolls ≥ 4.5; peer worst ≥ 4.5 over 40; the controls-tag census (declared π on two properties only); `check-*` scripts; `lint:motion` | must stay |

Struck from this family and where they went: the meter-symmetry ≤ 0.5 px (FRAME_PAD row, as
`FRAME_X_PAD === FRAME_Y_PAD` + a 3.0-u measured floor — the 1.3 px was the hand, poses 2 and 3);
the `--color-focus-sketch` absence / dark-ring ≥ 6.4 (§6's; re-cut to ≥ 6.0 with the painted pair
if §6 takes the dark alias); the FRAME_PAD viewBox assertion (that row's, born-RED against any
move).

---

## 10 · What the owner disposes (U-10), and what the agglomerator must seat

Owner: whether your hand may desaturate (C 0.215 → 0.131, 5.08 → 4.64); whether the meter
carries a tape at all, and for three fills; whether `on the board` reads better than `written`
beside a `Fill` button (crop 1 shows the desk rail).

Agglomerator: `poseLengths` is one primitive for three consumers (this gauge, ACC-FIVE's gold
gauge, §10's `DifficultyTally`) and the arc-length machinery ACC-GRAPHITE's tally already uses —
seat it once in `gridPaths.ts`. The guard's ground deletion + compound hover selector is
coupling 4's law reached by five families — write it once. The seed fix re-rolls four §10 tags
once; §10's re-cut of that card supersedes their geometry anyway. The `--color-blue-ink`
collapse and ACC-FIVE's are the same ruling on the same comment (`index.css:147-148`); whichever
blue family wins, the alias does not survive. Nothing closes here.
