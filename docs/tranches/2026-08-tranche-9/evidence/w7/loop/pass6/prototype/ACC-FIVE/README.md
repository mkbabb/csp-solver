# ACC-FIVE · pass 6 prototype

The five-crayon accent (§3 §4 §12 leader). The pass-5 diff was advanced in place at `74a2b5d9` in
`.claude/worktrees/wf_f72f3b5a-83a-41`, and nothing was committed.

- **Tree dist:**
  - `index-BiELmy4Rb4HL.js` is what every painted row below read.
  - `index-C5Zf5Lmyo66Y.js` is the rebuild after the last edit. It is byte-identical once HandDrawnGrid's scoped ids are normalised: `data-v-4e681743→44640516` and one `v-bind` var name, both from a prettier reformat of that SFC.
- **Control:** `w7-control` at `index-CubiZsMVSwTc.js`.
- **Ports:** 4236 dev, 4237 control, 4238 and 4239 built previews.

## Gaps first

1. **G5's fraction bound fails.** The verb's glyph-text core median clears 4.5 in every cell. Its fraction under 4.5 does not:
   - DPR 1 light: 0.378–0.408, against the control's black 0.061–0.095.
   - DPR 2 light: 0.126–0.146, against the control's 0.023–0.033.

   At DPR 1 any chromatic red at this weight puts its AA fringe under 4.5, so the fraction is structural. Only the median is gated. The fraction is stated beside the control's.
2. **The dark trace against the wrapper's 2 px border reads 2.572** (painted, footprint cov ≥ 0.5, both engines). No ink clears 3:1 on all three dark grounds: the best any ink reaches is 2.914 (`p6-third-ground.mjs`). The corridor gates the dark border at HEAD violet's own 2.441 (`BORDER_FLOOR.dark`), which is a regression floor, not 3:1. This is a declared gap, not a cure.
3. **G9 dark reads 15.46–17.55 %** against the 12 % ceiling (light 8.85–10.66 %, green).
   - The dominant off-family bin is 140°: 1,105 px dark and 813 px light. The same count appears on the tree and the control. It is HEAD's EASY-green difficulty heading (`h2.section-heading`) and its buttons, which are not this family's subject.
   - The tree equals the control minus the violet bins (control 38.7–63.73 % dark).
   - The term's re-cut (exclude the difficulty chrome or bin it separately) is PROPOSED to the chair, not applied.
4. **filter-census dark: 4 failed** (`crayon-heart.idle ⟨saturate(0.85)⟩`). The control fails the same 4 rows, so this is inherited and not moved. Light passes 12/12 on both.
5. **Law probe R1–R3 are RED** on the tree and on the control alike. L1–L6 are GREEN on both, and no r0 row moved.
6. **Siblings on G10 (leader duty).** Both sibling trees red, on both engines:
   - Both still carry HEAD's dash gauge, so their gauge never re-cuts.
   - SIX (-45, `DP7V76CJwJKu`; pass 5 cited `BfaZiyPZjKWM`) re-cuts the tally at 124.6–126.1/s and the join at 124.8–125.5/s.
   - GRAPHITE (-40, `CelsBcwyiLkj`) re-cuts the tally at 125.2–125.3/s and the join at 124.0–125.3/s.

   Neither carries `frontGate`, which lives on this tree. The row is portable: `e2e/front-rate.spec.ts` + `e2e/rate-clock.ts` + `gridPaths.ts`'s `frontGate`.
7. **FORK A is a caption correction only, with no re-shoot.** The control pane shows no gauge at the win: `.progress-trace` goes to opacity 0 (index.css:598, T4-W9's bow-out). The three arms keep their pass-5 numbers.

## Numbers

### G10: the front's rate budget, re-cut (row 1)

- **Driven clock:** a 125 Hz rAF shim from the chair's `rate-clock.ts`. The spec's copy has three `export` keywords removed for knip.
- **Precondition:** the in-page clock must read ≥ 93.75 Hz.
- **Interleave witness:** at least one tally draw-in must average > 4 `d` per frame.
- **Budget:** 62.5 re-cuts/s.

The final battery (`logs/g10-recut-battery-final.log`) ran both engines in one batch at load 22–60. After the run, gridPaths.ts matched its recorded `shasum`.

| arm | chromium | webkit |
|---|---|---|
| gated · driven | **0**: 125.0 Hz · gauge 46.3 · tally 48.7 (10.05 d/frame) · join 48.4 /s | **0**: 125.0 Hz · 60.2 · 56.4 (10.00) · 58.7 |
| gated · CLOCK=60 | 1 (precondition, 59.9 Hz) | 1 (precondition, 58.8 Hz) |
| gated · DEAL=EASY | 1 (witness: inked 1 after 6 deals, 4.00) | 1 (witness: 3.79) |
| gated · native | **0** (120.5 Hz) | 1 (precondition: host rAF 30.3 Hz under load) |
| FRONT_MIN_MS→0 · driven | 1 (gauge 124.2 · tally 126.5 · join 125.1) | 1 (125.0 · 98.7 · 121.9) |
| FRONT_MIN_MS→0 · 60 · PRECOND=0 (the hole, shown) | 0 (60.0 · 61.6 · 60.0) | 0 (30.7 · 33.6 · 30.0) |
| FRONT_MIN_MS→0 · 60 | 1 (precondition) | 1 (precondition) |

The hole row is the pass-5 defect reproduced: on a ≤ 60 Hz clock the ablated tree passes. The precondition row directly below it is the cure.

**The witness flake is cured.** The tally inks the *dealt* board's measured grade. Pass 6's first final battery had a HARD deal grade at 1 stroke (68 d / 17 frames = 4.00) and red the gated row. A pinned `?board=` payload cannot carry the row: a shared board is never graded, and twelve bank templates each read "level not graded yet" after 30 s (`logs/tally-pick-unpinnable.log`). So the row re-deals, at most six times, until the tally inks ≥ 3 strokes, and judges the best single draw-in. Every HARD arm reached `inked 5` in 1–4 deals.

### ROW C: forced colours (row 2)

The default is to **keep the crayon**. The `CanvasText` rule is deleted from index.css and banked as `arms/rowC-canvastext.arm.diff`, which passes `git apply --check`.

The statistic is the painted footprint: coverage from a magenta re-stroke, core = cov ≥ 0.5, split by ground. Values are the median followed by the fraction under 3.

| cell | CanvasText arm | crayon (default) | control 74a2b5d9 |
|---|---|---|---|
| chromium light · on line | 1.567 / 0.998 | **3.236 / 0.152** (0.019 at cov .9) | 2.876 / 0.641 |
| chromium light · on paper | 21 | 4.02 | 3.92 |
| chromium dark · on line | 1.671 / 0.999 | **3.268 / 0.149** | 3.106 / 0.15 |
| webkit dark · line / border / paper | 12.158 / 1.431 / 1.099 | 3.303 / 2.572 / 3.351 | 3.139 / 2.441 / 3.139 |

Computed trace:frame ratios are CanvasText 1.388 / 1.56, crayon 3.765 / 3.657 and control 3.574 / 3.653. WebKit's forced-colours emulation is partial: it maps the frame but not SVG stroke.

### ROW B: print (row 4)

In print the trace settles to `rgb(0,0,0)` on a `rgb(0,0,0)` frame. Computed trace:frame is **1.0**. Painted, it reads 1.08 over 100 % of the footprint, with an **off-frame fraction of 0**. That holds in both engines, both themes, and both payloads (`ATMuMTA0MjA4Mz…`, `ATMuOTA0NjMwOD…`).

- The control's violet prints at 4.24 light and 3.191 dark.
- The footprint statistic is payload-invariant: of 216 cells, 3 differ by 1–2 px in n, and 0 medians move. So the pass-5 percentage is **dropped**.

### Screen corridor (the third ground, found this pass)

The 8u trace overhangs the `.board-wrapper` 2 px CSS border (`--color-border`: 230,230,228 light and 42,40,39 dark). The old gold `#a87e13` read **2.970** on it in light.

- **Light (cured):** the light window across all three grounds is painted Y 0.1922–0.2300, and `--color-progress-ink` moves to **`#a27803`**. Readings on line / paper / border:
  - `#a27803`: 3.236 / 3.949 / 3.217.
  - The old `#a87e13`: line 3.505, and 2.970 on paper and border together. The intermediate run did not yet split those two grounds (`readings/rows-bc-intermediate-A87E13-summary.txt`).
  - The move trades 0.269 on the line for clearing the border.
- **Dark:** 3.303 / 3.280 / 2.572, gap 2 above.

`e2e/progress-corridor.spec.ts` is **8/8 in both engines** (`logs/corridor-battery.log`). It gains a BORDER row, whose modal core is the wrapper colour ≥ 1.1:1 from both paper and line, and a born-RED for it, which uses an ink that clears line and paper but fails the border (`#a87e13` light, `#756106` dark).

- **Max-chroma rows are printed, not gated.** Against the border, the max-chroma pixel read 2.917 / 2.927. It sits on the page background (251,250,249) as an L 0.619 blend and reads 3.54 / 3.59 against that.

### G5: the leave verb (row 3)

The arm is `color-mix(in oklab, red-ink 85%, foreground)`: hue 13.55→13.64° light, 12.15→12.20° dark. The statistic is the glyph-text core median, measured with the outline hidden and the word made transparent (`logs/g5-glyph-text.log`, one payload).

| cell | tree rest / hover | neg (pass-5 ink planted back) | control (black) |
|---|---|---|---|
| chromium DPR1 light | **5.493 / 5.248** | 4.406 / **4.209** | 13.785 / 15.245 |
| webkit DPR1 light | **5.663 / 5.406** | 4.643 / **4.462** | 14.377 / 16.084 |
| chromium DPR2 light | 6.324 / 6.037 | 4.917 / 4.693 | 16.19 / 18.297 |
| dark, any | 5.422–7.429 | 4.696–6.392 | 12.079–13.582 |

The neg arm reds at light DPR1 hover in both engines, which makes it the born-RED.

The other two palette arms are named for the ballot: the pass-5 bare `--color-red-ink` (the neg arm), and the control's black `leave` (HEAD).

### Row 6: ringFront born-RED

`join-language.spec.ts`'s two ringFront rows ran both engines in one batch (`logs/join-row6-battery.log`). After the run, HandDrawnGrid.vue matched its recorded `shasum`.

- **Landed:** chromium 2 passed, webkit 2 passed.
- **Ring capped at 0.99** (`Math.min(v, 0.99)` at `joinGate`, 1 site): chromium 2 failed, webkit 2 failed.

The poll prints only its last sample (−1, the ring unmounted at rest). A per-frame sampler (`instruments/p6-ring-samples.mjs`, `logs/join-row6-ring-samples.log`) shows the red is the right one:

| arm | open (0) | closed (1000) | no ring (−1) |
|---|---|---|---|
| landed chromium | 62 | **56** | 447 |
| landed webkit | 15 | **14** | 126 |
| capped chromium | 106 | **0** | 450 |
| capped webkit | 29 | **0** | 129 |

### π against the control (row 11)

The measure is whole-DOM computed paint and rect, 4 cells, both engines and themes (`instruments/p6-pi.mjs`). Control-vs-control is 0/0 in every state.

| state | paint | rect |
|---|---|---|
| guard rest | 21 | 0 |
| guard hover | 20 | 0 |
| board | 5 (trace stroke ×4 + sparkle filter) | 8 |
| sparkle hover | 1 | 0 |

- **Guard paint** is the verb ink, the pen `#026fc4`, the trace stroke and the sparkle.
- **Board rect** is the progress-pose / trace bboxes: the geometry front is cut at 10.6 px tall against HEAD's 640 px dashed ring.

Every one of these is a claimed surface.

### Progressbar contract (row 10)

`HandDrawnGrid` takes `filled` / `fillable` counts. The progressbar reads `aria-valuenow` = percent (0–100) and `aria-valuetext` "5 of 20 on the board" (SIX's count). The tree reads now 25 / text "5 of 20 on the board"; the control reads now 25 / "board 25% filled".

### Carried rows (row 7)

| row | disposition |
|---|---|
| G3 ΔL fill→win | Tree +0.114 light and +0.3217 dark, both payloads, both engines (gate ≥ 0.09). The control's win band holds 0–29 px, and its ΔL ranges from −0.083 to +0.2826. |
| G9 | Gap 3. |
| aria-valuetext | Row 10. |
| goldens | **Struck.** They pin HEAD's violet and pen by design. Minting belongs to the runner and the fold. |
| R6 heading census | **Struck.** Its subject is not in the diff: GameControlPanel's only hunk is the sparkle. |
| R3 wobble | **Struck.** The diff changes no roughness, wobble, segments or seed (grep). |
| F1 arms | **Struck.** `SELF_TAKES_A_HAND` is PLR-SELF's switch and is not on this tree. |

### Section fork (row 8)

`p6-1-section-fork-gold-violet-graphite-light-{chromium,webkit}-1280x800-fine.png` has one payload (61 givens), ten hints, and untruncated two-line captions. Band ratios (inked trace pixel on paper 253,253,252):

- **Gold:** 3.949.
- **Violet:** 4.16.
- **Control:** 4.444 / 4.433.
- **Graphite:** its trace is graphite, so no band ratio is quoted. The chromatic band pixels (1.509 chromium, 5.783 webkit) are the rainbow solver-ink hint digits of the top row, not a gauge. Pass 5's 11.96 / 6.694 for graphite is **struck**.

### Pre-return battery (bare, tree vs control)

- `check-copy-register`, `check-ink-pressure`, `check-theme-tokens`, `lint:copy`, `lint:ink`, `lint:lanes`, `lint:theme-tokens`, `lint:sleep`, `lint:motion`, `test:e2e:projects` and `check-pw-projects` exit 0 on both trees.
- The tree's final batch, run after the last edit, is `logs/final-gates.log`. It covers `vue-tsc -b`, `vue-tsc -p tsconfig.e2e.json`, `npm run lint` (prettier), knip, eslint and thirteen `lint:*`/`check-*`/`typecheck:node` scripts, and all exit 0.
  - The one red was eslint `no-useless-assignment` on the new re-deal loop. It was fixed as a declaration only, then eslint, e2e tsc, lint:sleep, lint:motion and knip were re-run: all exit 0.
- Unit tests: pencil 10/84, games 57/741 and composables 3/16, for 70 files and 841 tests with 0 failed.
- `gridPaths.poseFronts.test.ts` is ONE file (leader duty). GRAPHITE's six rows are byte-identical to this tree's (`diff`).

## Comment fixes (row 9)

- **"≤74":** replaced by the measured "25–28 re-cuts per join (G10 passes 5 and 6; 51–70 ungated)".
- **`#7D6902`:** struck. It was pass 2's first candidate and never shipped.
- **`check-ink-pressure.mjs`:** declared a drift guard, not a gate on the ink. HEAD violet reads 3.57 by token and 2.876 painted.

## Replay route

The work was advanced in place, with no replay.

- **At open:** `git diff --stat` read 11 M / 4 ??, +868 −134.
- **At return:**
  - 12 M, +910 −151. `GameBoard.vue` is newly modified, for the counts.
  - 5 untracked product files (908 lines). `e2e/rate-clock.ts` is new; the other four are pass 5's.

## Ballots

| ballot | arms | default |
|---|---|---|
| FORK A (the win) | bow-out (HEAD) · gold-star 2.533 · gold-ink 4.967 | caption corrected only |
| ROW B (print) | graphite print (1.08 on the frame) · re-colour arm | graphite |
| ROW C (forced) | crayon · CanvasText (`arms/rowC-canvastext.arm.diff`) | crayon (3:1 painted) |
| G5 verb ink | 85 % mix (tree) · bare red-ink (pass 5) · black (HEAD) | 85 % mix |
| Section accent | gold 3.949 · violet 4.16 · graphite (achromatic) · control 4.444 | gold |

## Incidents

- **Host load.** The host ran at load 46–80 from other lanes, and this lane's own batteries added to it. The first join battery was stopped by PID after 25.8 min on WebKit. Row 6 then re-ran scoped to its two ringFront rows.
- **zsh.** zsh does not word-split `set -- $pair`, so the sibling servers never started. The waiting loop was killed by PID and the servers relaunched under bash. Ports 4240 and 4244–4247 belong to other lanes and were left alone.
- **Defects found and fixed in this lane's own instruments:**
  - The corridor spec's first cut read the border at fractional rows and put a test outside the scheme loop.
  - G10 asserted before printing, so red runs named nothing.
  - rows-bc lacked sensitivity rows and was restarted. The stopped run is banked.
- **G10 witness flake:** a random HARD deal graded low. It is cured by re-dealing, above.
- **The pick script's first cut** read the ungraded placeholder as null.
- **Sibling trees** were read with `git -C` only, and were built and served with scratch cacheDirs. Their `git status` and diff sha1 were unchanged before and after.
