# ACC-SIX · pass 5 prototype: violet, the answer's gauge, and the count off the board

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45`
(base 74a2b5d9, advanced in place). Control = 74a2b5d9, dist `index-CubiZsMVSwTc.js` (the shared
w7-control tree, served read-only on :4238). Lane dist = `index-BMdJ4epg95hr.js` (dist 3, 43 files,
built 00:22:53 from the tree; later tree edits are gates, the e2e spec, comments and prettier layout
only). Every browser row identifies both arms by asset hash, never by a 200. Payload for every row:
`?board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5`
(b64url of `\x01` + `3.` + the classic 530070000… deal, 51 writable), with the deal read back from
the inputs at load (`dealOk: true` in every reading). The pass-5 number is the critic's.

## Gaps first

1. **Dark trace, card-edge ground: no rung clears 3.0.** Shipped dark (`answer-deep` #7c3aed @1)
   reads 2.575 on the board card's 2px edge (44,43,41); HEAD reads 2.441; the other rungs are
   2.452 on the line (`answer-mid`) and 1.950 (`#9b74f7`). Line 3.275–3.310 and paper 3.355 pass.
   Open, ledgered as open in `index.css`, and not claimed.
2. **R6 heading census and R3 wobble (row 10): not run.** G6 is closed; these two are not.
3. **`filter-census` dark is RED (row 12), born-RED, on both arms.** The cure belongs to the chair
   (see the estate rows).
4. **check-pw-projects check 8 is red on the tree** (filter-census-{chromium,webkit} floor 6 vs
   live 8, from the two dark rows that row 12 added). The control reads 0. It's declared, not
   restamped (pass5/CHAIR-RULINGS §1.4: a lane never restamps).
5. **Co-landing with ACC-FIVE (row 8): the condition is stated, not landed.** This tree's
   `DifficultyTally` still consumes `poseFronts([d], reveal[i])[0]` in the miss shape, without
   `frontGate`.
6. **The hand face lacks `·` and `/`, an estate ransom note on the control too.** It's admitted
   under a ceiling of 2, not cured (see the estate rows).
7. **Arm A is an injected clone, not a source arm.** Its occlusion is priced, but it is not
   shipped.
8. **No dark crop.** T9-B-ACC6-2's dark side is carried by numbers alone.
9. **p5-g0.mjs was written and not run.** It derives counts from the board, not from aria.

## Numbers (control 74a2b5d9 beside the lane)

### Row 5 · the trace, on every ground the stroke covers (`p5-trace.mjs`)

The statistic is differencing: each pixel is read against the same pixel with the stroke hidden.
The hidden-vs-hidden noise is 0 px in all 48 dist-1 reads and every dist-3/control read. The core
is k = 1 of the largest luminance move, taking the min and max over chromium and webkit at dpr
1/2/3 (n = 6 per cell). Each entry is light line / edge / paper, then dark line / edge / paper.

| arm | light | dark | source |
|---|---|---|---|
| `answer-mid` #8b5cf6 @1 (SHIPPED light) | 3.072–3.117 / 3.388–3.397 / 4.062 | 2.432–2.458 / 3.465 / 4.515 | trace-proto.json (dist 1, injected arm) |
| as built, dist 3 | 3.072–3.117 / 3.388–3.397 / 4.062 | 3.275–3.310 / 2.575 / 3.355 | trace-proto3-built.json |
| HEAD 74a2b5d9 (#8b5cf6@.95 · #7c3aed@.95) | 2.876–2.946 / 3.170–3.184 / 3.751–3.760 | 3.106–3.148 / 2.441 / 3.139 | trace-control.json |
| escape #9b74f7 @1 (pass 4's byte) | 3.862–3.919 / **2.695–2.700** / 3.231 | 1.934–1.954 / 4.356 / 5.676 | trace-proto.json |
| `answer-deep` #7c3aed @1 (SHIPPED dark) | 2.283–2.316 / 4.560–4.574 / 5.466 | 3.275–3.310 / 2.575 / 3.355 | trace-proto.json |

**Sensitivity row (LAWS; PAL-TIN's graft), #8b5cf6 light, chromium dpr1:**

| ground | k | median | fraction under 3.10 | fraction under 3.0 | worst column | fraction of columns under 3.10 |
|---|---|---|---|---|---|---|
| line | 1 | 3.072 flat | 1.0 | 0 | 3.072 | 1.0 |
| line | .9 | 3.072 flat | 1.0 | .051 | 2.876 | 1.0 |
| line | .5 | 3.072 flat | 1.0 | .369 | 2.098 | 1.0 |
| edge | .5–1 | 3.388 flat | 0–.038 | — | 3.388 | 0 |
| paper | 1 | 4.062 | 0 | — | 4.062 | 0 |
| paper | .5 | 4.062 | .255 | .238 | 1.637 | .153 |

The antialiasing fringe causes the paper and line tails at k .5. The line core is a single painted
byte, and it sits under 3.10 at 3.072 everywhere.

**The rule as written (the modal pixel against line and paper, `p5-paint.mjs` →
readings/paint-proto.json, adjacency-proto.json at 8 legal writes)** reproduces pass 4: #8b5cf6
worst 3.072 (line) and #9b74f7 worst 3.309 (paper). The escape "cleared" only because that rule
never read the card edge. Read on all three grounds, #9b74f7's worst is 2.695, under the
incumbent's own worst of 3.072. **The byte is deleted** (`--color-answer-ink` is gone, and
`--color-progress-ink: var(--color-answer-mid)` ships #8b5cf6 @1). `#8b5cf6` @1 is the only light
arm ≥ 3.0 on all three grounds. HEAD's @.95 costs 0.196 on the line.

### Row 4 · user ink, painted (`p5-paint.mjs`, the digit in row 5, blue-hue gated, differenced)

The core median is **4.640 light / 7.696 dark**, both engines, dpr 1/2/3, holding at k .5/.7/.9/1.
The ground is the card's own byte, 253,253,252 light and 19,18,17 dark. Pass 4's 7.608 was a single
most-saturated pixel on a misread ground (44,43,41). The ledger sentence is corrected in
`index.css`. Light fringe: 9–32 % of the core is under 4.5 at k .5, and 4–12 % at k .9.

### Row 1 · the reserve, declared (`p5-pi.mjs` → pi3.json, `p5-wrap.mjs` → readings/wrap.json)

- Pass 4's `2lh` read the inherited 24px line-height and reserved 48px, where the two rows take
  39.0px.
- The count shares the voice's row and wraps only under a wide voice. The hidden-single hint is
  209.9 + 105.8 px against a 261px strip at 393. The strip at 844×390 is 358px wide and never wraps.
- The reserve is now **portrait-only and derived from tokens**:
  `calc((var(--type-body) + var(--type-caption)) * var(--type-leading-caption))` = 39.0px,
  against a measured two-row strip of 38.98.

**π, lane vs control, dist 3, both engines.** Paint deltas are 0 and the control-vs-control noise
is 0/0.

| viewport | selector (every element) | Δy px |
|---|---|---|
| 393×699 coarse | `.masthead` ×1, `.logo-text` ×1, `.board-wrapper` ×1, `svg.hand-drawn-grid` ×1, `.sudoku-cell` ×81, `.sudoku-cell input` ×81, `.glyph-svg` ×33, `.drawer-tab` ×1 | −9.10 / −9.11 |
| 393×699 coarse | `.play-controls` ×1, `.icon-btn` ×4, `.board-voice` ×1 | +9.09 / +9.10 |
| 393×699 coarse | `.margin-note` ×1 (the empty voice box while the count shows, fill 2) | +4.89 |
| 393×699 coarse | `.board-margin` strip | 39.0 vs 20.8 |
| 844×390 · 1280×800 | every selector | 0, except the empty `.margin-note` box at fill 2: +14 (webkit 14.20–14.25) |

- W2's tab no longer moves; it was +13.6 in pass 4.
- Pass 4 moved things 13.59–13.61 px. Pass 5 moves them 9.1 px, at the phone only, and the price
  is booked once under §7's seating.
- NOTE-ERASE's 6.4px disagreement is explained: `2lh` gave +27.2, ERASE's arithmetic +20.8, and
  the true price is +18.2 (2 × 9.1).

**Wrap proof:**

| reserve | voice | strip height | controls top |
|---|---|---|---|
| off | silent | 20.8 | 542.92 |
| off | hidden-single hint | 38.98 | 552.02 (a 9.1px jump) |
| on | every voice | 39.0 | 552.02 (0px) |

This row carries to the leader (ACC-FIVE) and to NOTE-ERASE, and no second reserve was cut.

### Row 9 · Arm A (the bottom-left tag tape; `p5-armA.mjs` → readings/armA.json, dist 1)

The tape is a cloned `.washi-label.washi-tag` at `rotate(var(--washi-tilt))`, seated by its measured
rect, about 121–126 × 24.5 px:

| viewport | cell px² | cells | cell-area equivalents | glyph px² |
|---|---|---|---|---|
| 1280×800 fine | 2,955–3,089 | 2 (72, 73) | 0.59–0.62 | 0 |
| 393×699 coarse | 2,939–3,071 | 4 | 1.79–1.87 | 0 |
| 844×390 coarse | 2,937–3,070 | 4 | 1.82–1.90 | 0 |

The glyph px² is 0 only because cells 72–75 are writable and empty on this deal. A written digit
there would be covered. The shipped margin line occludes 0 by construction. The injection is placed
relative to the board rect, so the reserve change between dist 1 and dist 3 does not touch it.

### Row 10 · G6, the attribution tape's seed across two peers (`p5-g6.mjs`, dev `?wire=local`, lane :4245, control :4248)

- **Control:** the tape re-tears between peers in both engines, on discriminating pairs:
  - chromium: content-herring vs ruling-chinchilla, clip ≠ and tilt ≠
  - webkit: melted-wildebeest vs lazy-clam, clip ≠ and tilt ≠
- **Lane:** clip and tilt are byte-equal across peers (tilt −1.21deg), and the pose holds on return
  to peer B:
  - chromium attempt 2: established-coyote vs sick-aphid
  - webkit: mysterious-tarsier vs distinctive-kite, and on retry nervous-dinosaur vs gay-toad
- Chromium attempt 1 (safe-firefly/strong-marlin, and deaf-mosquito/delicate-smelt in run 1) had
  pairs sharing a first letter, which can't discriminate. It's struck, not counted.

### Row 2 · the font census (`check-font-coverage.mjs`, sha1 9996ee00 after prettier)

- **The census.** Check 4 is a quote-aware bound-prop census. It handles `:x`, `v-bind:x`,
  `.modifiers`, v-bind object keys and kebab→camel, and follows props painted through `computed`
  (transitively).
- **Nine new bindings, all pinned:**
  - StagingBand `:safe-verb` / `:saved-pair`
  - GameCard `:subline`
  - HandwrittenLogo `:game`
  - GameGallery `:cards`, `:dirty`, `:current-id`, `:saved`, `:session`

  21 tapes are pinned in all, and WRITEABLE == the hand cut in both directions (46 codepoints).
- **`--self-test` (all run in the pre-return battery, exit 0):**
  - 6 red plants: plain, arrow handler, `>` comparison, kebab, v-bind object, prop through a
    computed.
  - 2 green controls.
  - Live discovery of `:safe-verb` and `:saved-pair`: true / true.
  - 3 admission plants: site obeys → STALE RED; a third codepoint → RED; the tree → GREEN.
- **Break test 1:** striking the `:safe-verb` pin → exit 1, naming the binding; restoring → exit 0.
- **Negative control:** pass 4's script on the pass-4 tree exits 0 with both bindings live and
  unpinned, and its self-test printed 0 plant rows.

### Row 3 · law 20's `url(#solver-ink)` arm (`check-theme-tokens.mjs`, sha1 eeb1c2c9 after prettier)

- **The admission.** One file is admitted: `src/pencil/glyph/HandwrittenGlyph.vue`, with
  1 consumer.
- **The arm reds on:**
  - any consumer outside the admission
  - any excess over the admitted count
  - a STALE admission (0 consumers)

  Tests and specs are excluded.
- **Self-test url plants:**
  - panel re-aimed: 2
  - quoted chrome reference: 1
  - second consumer in the admitted file: 1
  - admitted consumer struck: 1
  - controls: 0 and 0
- **Break test 2:** the REAL panel re-aimed → exit 1 (2 offences); restored to sha1 e4944e65 →
  exit 0.
- **Negative control:** pass 4's script on the same plant exits 0, reproducing the bypass.

### Row 12 · the filter census, dark (e2e/filter-census.spec.ts: `G3.1d` + `G3.3d`, dark)

Filter-census suite exit and failures, per arm:

| arm | exit | failed | passed |
|---|---|---|---|
| lane `index-BMdJ4epg95hr.js` :4237 | 1 | 4 | 12 |
| control `index-CubiZsMVSwTc.js` :4238 | 1 | 4 | 12 |

The 4 failures are exactly the dark rows in both engines. Each names
`div.hover-card > div.flex.items-center > svg.crayon-heart.idle ⟨saturate(0.85)⟩` ×2 as a live
filter that no `filterBudget.ts` row claims. All 12 light rows are green on both arms. The
filterBudget of 9 is unchanged. Logs are under logs/filter-census-{proto,control}.log.

### Units, types, copy

- vue-tsc: app (`tsconfig.json`, src) exits 0; e2e (`tsconfig.e2e.json`) exits 0.
- vitest, whole suite after prettier: 69 files / 843 tests passed, exit 0 (logs/unit-whole.log).
- `check-copy-register` bare exits 0 on the tree and the control.

### Pre-return battery (registry-v4 §2.11; `instruments/p5-battery.sh`, logs/battery/EXITS.log)

| gate | tree | control 74a2b5d9 |
|---|---|---|
| check-copy-register · lint-copy (self-test) | 0 · 0 | 0 · 0 |
| test-font-coverage (self-test) | 0 | 0 |
| lint-theme-tokens (self-test) | 0 | 0 |
| lint-lanes · lint-sleep · lint-motion · lint-ink | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| lint-live-regions · lint-theme-selectors | 0 · 0 | 0 · 0 |
| test-e2e-projects · check-pw-projects | **1 · 1** (check 8 only; declared) | 0 · 0 |
| eslint · prettier | 0 · 0 | 0 · 0 |

On the first battery run, the tree's eslint was 1 (a comma expression in `check-font-coverage`)
and prettier was 1 (six of the lane's files). Both were cured in the tree and re-run, and the
table shows the re-run.

## The twelve rows

| # | row | state |
|---|---|---|
| 1 | undeclared π | CLOSED: 2lh → the token calc, portrait-only; every selector is declared above; 9.1px at the phone, 0 elsewhere |
| 2 | font-census blind spots + self-test | CLOSED: quote-aware census, 9 pins, real plants; ESTATE row raised (`·` `/`) |
| 3 | law-20 url bypass | CLOSED: the url arm, a one-file admission, plants and break test |
| 4 | user-ink ledger sentence | CLOSED: 4.640 / 7.696 painted, ground 19,18,17 |
| 5 | the escape's sensitivity | CLOSED, and it killed the escape: the byte is deleted and #8b5cf6 @1 ships light; dark edge OPEN at 2.575 |
| 6 | G8 | CITED: T9-D-ACC6-3 (pass5/CHAIR-RULINGS). The leader (ACC-FIVE, its README l.290) picks RETIRE in favour of G1. G8 was not re-run; 83.16 % is pass 4's |
| 7 | payload pinning | CLOSED: every row above is on the encoded payload with the deal read back; G6 rides its room's own encoded board |
| 8 | co-landing with FIVE's tween | STATED: this tree's `DifficultyTally` must take FIVE's `frontGate` and `front-rate.spec.ts` before either lands; nothing lands without it |
| 9 | Arm A | PRICED at three viewports (injected); moot only while cells 72–75 are empty |
| 10 | G6 · R6 · R3 | G6 CLOSED both engines; R6 heading census and R3 wobble OPEN |
| 11 | frame 1 on a legal board | CLOSED: c1 on the payload with legal writes (4, 6, 7, 2 in rows 1–2) |
| 12 | filter-census dark | BORN-RED landed on both arms; the cure is the chair's |

## Ballot rows (both frames on one payload)

- **T9-B-ACC6-1 · the light trace's byte.** Frame c1 shows the shipped `#8b5cf6` @1 (upper,
  rgb 139,92,246) against the escape `#9b74f7` @1 (lower, rgb 155,116,247). It's one payload, one
  page, one variable.
  - Sensitivity: #8b5cf6 has worst 3.072 (line, flat, 100 % of the line core under 3.10, and
    0 % under 3.0 at k 1), with edge 3.388 and paper 4.062. #9b74f7 has line 3.862, **edge 2.695**
    and paper 3.231.
  - The lane ships #8b5cf6. The escape is one token away as the owner's other arm.
  - Seen in the crop: the two strokes are near-identical in hue. The escape reads a shade paler.
- **Arm A vs the margin line (count placement).** Frame c3 shows the margin line (upper) against
  Arm A injected (lower), at webkit 393×699 coarse, light. The margin line occludes 0; Arm A
  occludes 1.79–1.87 cell-equivalents here, 0.59–0.62 at the desk and 1.82–1.90 at 844×390.
  - Seen in the crop: Arm A sits over row 9's first three cells, inside the board. The margin line
    sits under the board's shadow, left of the controls tab.
- **T9-B-ACC6-2 · the claim's scope.** "Violet means the answer's gauge, legible on every ground"
  holds in light (c1; worst 3.072). In dark it holds on the line (3.275–3.310) and on paper
  (3.355), but not on the card's edge (2.575). No dark frame was taken; the number stands in.
  - Arm (a): claim both themes and carry the dark edge as an open row.
  - Arm (b): scope the claim to light plus dark line and paper.
  - U-10: the owner disposes.

## Frames (≤4, ≤150 KB, each looked at by the author)

- `c1-T9-B-ACC6-1-arc-shipped-vs-escape-desk-light-chromium-fine.png`: 31,015 B · chromium · light
  · 1280×800 · fine. Retires `pass4 prototype/ACC-SIX/frames/1-the-arc-desk-light-chromium-fine.png`,
  which showed an illegal board.
- `c2-count-under-the-board-phone-light-webkit-coarse.png`: 24,411 B · webkit · light · 393×699 ·
  coarse. The meta reads "2 of 51 on the board". Retires
  `pass4 prototype/ACC-SIX/frames/2-count-under-the-board-phone-light-webkit-coarse.png`.
- `c3-count-place-margin-vs-armA-injected-phone-light-webkit-coarse.png`: 51,539 B · webkit ·
  light · 393×699 · coarse. New (the Arm A ballot pair); it retires nothing.

## r0 rows MOVED (PROPOSED diffs, never applied)

- **r0 r2 hue-census anchors:** PROPOSED, carried from pass 4
  (`pass4/prototype/ACC-SIX/r0-hue-census.anchors.PROPOSED.diff`: violet named as the sixth anchor).
  Pass 5 returns `--color-progress-ink` to r0's own hexes (#8b5cf6 light / #7c3aed dark, now @1).
  So r0 r2's `progress-ink` rows (README l.111/135/313) read the same hexes and hues again; only
  the stroke opacity differs.
- **L19 / L21 (R6):** PROPOSED amendments, the chair's rows (pass4/CHAIR-RULINGS §1.3), carried
  unchanged.
- **Checked unmoved:** r0 r3-marks probes (`marks.probe.ts:194`, `marks2`, `mobile`) read
  `.margin-note` / `.margin-note-ink`. The count is `.margin-note-meta`, a sibling inside
  `.margin-note-block`, so their text reads are untouched.

## Estate rows to the chair, and fold couplings

- **The hand face's ransom note.** The Patrick Hand subset's unicode-range lacks U+00B7 `·` and
  U+002F `/`, so every gallery card's range line (`size · 4×4 / 9×9 / 16×16`) and saved subline
  paint those two in fallback cursive, on the control too. They're ADMITTED in the census with a
  ceiling of 2 and a STALE check. The cure is a P5 re-cut (two codepoints) or a copy change, and
  it's the chair's.
- **`svg.crayon-heart.idle saturate(0.85)` ×2** is live in dark on HEAD with no filterBudget row
  (row 12).
- **The dark trace's edge ground at 2.575** (gap 1).
- **FIVE's specs read `aria-valuenow` as a percent.** This tree's progressbar is
  `aria-valuemax=fillable`, `aria-valuenow=filled`, `aria-valuetext="N of M on the board"`. No
  reader on this tree depends on the old percent. FIVE's corridor spec and its README (l.205/273:
  "ACC-SIX's `aria-valuenow` reads 5") do. The fold must pick one contract. `p5-g0.mjs` derives
  counts from the board so G0 is contract-free.
- The co-landing condition (row 8).

## Replay route

None: the tree was advanced in place. The diff stat at open matched the charter (14 files
+946/−104 + 1 untracked; the chair banked it as `pass4/prototype/ACC-SIX/pass4.diff`). At return
it's 16 files +1437/−111 + 1 untracked (`GameBoard.count.test.ts`). The new files are `package.json`
(test:font-coverage → `--self-test`) and `e2e/filter-census.spec.ts`. `git status` shows product
files only; `.acc6/` and the `.vite-cache-acc6-*` dirs are deleted.

## Incidents

1. **A kill pattern not keyed on this worktree.** During the chunked unit run, a kill loop matched
   the pattern `vitest run src/pencil`, not keyed on this worktree. It could have reached a sibling
   lane's vitest. No foreign kill is known, but none can be ruled out.
2. **`git status` on the control tree.** I ran it once on the control tree, which may have
   refreshed its index stat. It showed the chair's `?? build.log` and
   `?? web/frontend/.vite-control.config.ts`. Nothing was written.
3. **The control dist served by me.** The control dist on :4238 was served from the control tree's
   own `.vite-control.config.ts` (preview only, no build). It was killed by its recorded PIDs.
4. **Break test 1 had no backup file.** The pin was restored by re-insertion, a stray newline was
   fixed, and the sha1 matched before prettier.
5. **Void runs, recut and re-run:**
   - The first Arm A clone mis-seated (base `translateX(-50%)`).
   - The adjacency run at 2 writes missed the arc (3.9 % of the perimeter).
   - The first trace split was two-way (edge lumped into paper).
6. **G6 chromium attempt 1 was non-discriminating** and is struck.
7. **vitest's `src/lib` chunk exits 1 on "No test files found".** That's not a test failure.
8. **Mid-pass reads and dist timing:**
   - The unit-loop exit was first read through a pipe (grep's code). It was re-run bare.
   - The e2e TS7053 from a widened regime type was reverted before return.
   - prettier re-laid six lane files after dist 3 was built. The layout-only change means dist 3's
     paint stands for the tree.
9. **Servers, all killed by recorded PID:**
   - 4237: 4969/4996
   - 4238: 81374/81413
   - 4245: 9849/9903
   - 4248: 9851/9904

   The band re-scan shows only other lanes' listeners (4239–4244, 4246, 4247).

## Instruments (instruments/)

- `p5-common.mjs` (payload, differencing)
- `p5-trace.mjs` (three-ground trace)
- `p5-paint.mjs` (the rule as written + user ink)
- `p5-pi.mjs` (π census, noise arm)
- `p5-reserve.mjs`, `p5-wrap.mjs` (the reserve and the wrap)
- `p5-armA.mjs`
- `p5-g6.mjs`
- `p5-g0.mjs` (unrun)
- `p5-crops.mjs`
- `p5-battery.sh`
- `oklch.COPY.mjs`, `p4-paint.COPY.mjs` (the frozen pass-4 copy, re-pointed)
