# T9-W7 pass 6 · CTRL-TAPE (the tape, the band, the foot) · prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-27`, advanced IN PLACE from the pass-5 diff at `74a2b5d9`. Nothing is committed.

- **Replay route: in place.** No replay, no reset. Before the first edit `git diff --stat` read the pass-5 README's list exactly (24 tracked files +2548/−674, 2 untracked: `ConfirmRibbon.vue`, `check-tape-foot.mjs`). At return: 26 tracked files +2960/−707 (new: `e2e/mobile-affordances.spec.ts`, `src/games/shared/useCoarsePointer.ts`), the same 2 untracked. No intake prototype was replayed.
- **Served dists** (vite preview, one rendering mode, private cacheDirs, outDir outside the tree):
  - proto FINAL `index-BBBYNWxB0Bv8.js` (:4242), rebuilt after the last source edit; every row below that names a dist was re-run on it (`logs/final.txt`).
  - pass-5 baseline `index-T6edeNHCmbrz.js` (:4241), built from this tree BEFORE the first pass-6 edit: the born-RED arm for the new rows.
  - T9-B12 arm (b) `index-D2rQIpxwU_QE.js` (:4243): the final tree with ONE 3-line diff (`instruments/T9-B12-armB-lip-2.5-3-0.diff`), built, then the file restored by `cmp`.
  - control `74a2b5d9` `index-CubiZsMVSwTc.js` (:4231), verified by hash. Main-HEAD was not served this pass (no mark row here moved a W8 surface; the pass-5 main-HEAD readings stand and are not re-claimed).
  - An incident: :4232 answered with the CONTROL's hash (another lane's server); caught by the hash check, moved to :4241.
- Payload: PINNED_GIVENS (`?board=ATMuNTA4…`); givens read back `0:5,2:8,11:3,18:6,20:9` on every arm of every row.

## Gaps first (open, with the number that holds each)

| # | gap | the number |
|---|---|---|
| 3 | **Junction residual: one column.** The outermost device-pixel column of the side stroke (x = vw − 3.5, once x = 3) still reads 0 css at some poses. | webkit dock390 rest: 1 of 8 columns (x 386.5); land844 frac 0.1/0.75/0.9: 1 of 9–20, both engines (x 840.5). Every other column at every pose is 6.5–8 css minimum, median 9–10.5. The scrollbar is ruled out (a `scrollbar-width: none` arm reads the same). The mechanism is not found. |
| 6 | **§2.6 as landed stays RED ×4** (the SYNC read, same task as the scroll). | No scroll event has fired at sync, so no publisher can pass it. The chair lands the settle (§1.4, booked). On this tree the settle is 4/4 green at ceiling 2 AND at ceiling 1 (below). |
| 6b | The chair's `pub30` plant is **clock-conditional**. | Ceiling 2: 3 of 4 red. Ceiling 1: 3 of 4 red. On this loaded box one engine×cell's frames are ≥ 30 ms, so a 30 ms delay is ≤ 1 frame. A ms-delay plant against a frame-count ceiling is host-conditional (LAWS P5, rate gates). **Proposed:** deliver the scroll listener N rAFs late, not N ms. |
| 7 | COST grafts **not landed**: ARMED as a third berth path; the input split; the pointer-agnostic ask. | Fine 1440×900 still clears in ONE click (`isCoarse && isDirty` gates the ask), so the fine arm has no ask. Carried as W1 §1.5 / U-10 rows. "The face is the button's air" has no subject here (no `.act-face`). **Ruling requested:** N/A. |
| 9 | **Ring on the card ground: ABSENT, structurally.** | 0 focusables abut bare card at 4 cells × 2 themes × 2 engines. Every focusable is in a well, the foot, or on a tape (e.g. rail: well 7 · foot 5). **Worst ground:** the foot at coarse 1280×800 dark, core median 3.338, fracUnder3 0.216 chromium / 0.264 webkit, 90% worst column 3.216. |
| 10 | First tape **−4.42 / −4.41 below its frame**. | Balloted, not landed. LIFT a +3.58/+3.59 Δseal 0 · b +11.58/+11.59 Δ0 · c +11.60 Δ−8. **No frame** (crop cap). Seal 1303.44 / 1303.31 is unchanged. |
| 10b | **Coarse-landscape seal: not measurable as cut.** | `seal.mjs` at 844×390 times out waiting for a visible `.ctrl-btn`. At <1024 landscape the card is behind the tongue, so the seal's subject (the rail's `.control-panel-wrap`) is not on screen. The chair defines the cell or retires the row. |
| 12 | Content view (card `clientHeight`, proto − control; the control's figure INCLUDES its in-port sticky bar). | rail 1440/1280 **−121** · coarse 1280 −77 · dock 390 −116 / −117 · dock 430 −100 · land 844/812 −85, both engines. Pass-5's figures (landscape 296 → 173 = −122.87; dock −87.1/−88.1; −71.1 at 430; rail −80, of which 56 is the always-empty berth, visible in p6-c4) used a different definition, and both are cited. The inset stack adds **+12 px** of foot on a notched phone only (0 at `env()` = 0). |
| 13 | Carried, not run on this tree. | FACE's case-wide gate (FACE's instrument). The G2 leak sweep (0 by construction: the bar is outside the port; unmeasured). The /8 fresh reader (the orchestrator's). M16's foot arm (the crib is FACE's). DPR 3 on a REAL device (CDP DPR 3 is read below). G-INFO's co-sign on `.legend-fold { contain: layout }` (still owed). T9-B14's "i" (naked, visible in p6-c4; lands with its winner). |
| 21 | INTAKE row 21, notes vs the lip's bottom stroke (fine rail). | By design and not re-measured this pass. The pass-5 critic: note tops 756.05–757.11 against the stroke centre ~762.2, so 5–6 css of stroke under each note. The owner's eye. |
| 22 | INTAKE row 22, G4 box clause (the chair's). | At the scroll end the box gap last well → lip is dock 15.3–16.17 and landscape 15.59–16.22 against an inter-well 8 (unchanged). The painted daylight is now ≥ 6.5 css at every sampled pose, not only the end. |
| — | A hover:none + fine-pointer ≥1024 device. | Mounts no tape (the berth regime), and the share flip stays keyed on `(pointer: coarse)` (the unit harness is isomorphic with that binding). That device gets neither voice. The class is stated; the device is untested. |

## Numbers (charter rows 1–13)

**1 · `check-tape-foot` re-cut; the edge's estate row reads paint.**
- **Clause 1** is keyed on the pad's VALUE per regime. Floors: dock 0.75rem, landscape 1.125rem, the rail berth 3.5rem. Outside the berth the inset must be ADDED.
- **Clause 3** is a whitelist on every rule naming `.bar-frame`: position, inset, pointer-events and z-index only. The frame's tag must also carry no `v-if`/`v-show`/`style`/`:class`.
- **Clause 4** covers every border longhand/shorthand (physical and logical), `outline`, `box-shadow`, and `background(-color|-image)` on `.action-bar`/`.action-verbs`/`.card-foot`, plus the `color`/`opacity`/`visibility` the frame's `currentColor` rides.
- **`--self-test`: 23 plants red, live green, exit 0.** The plants are B1–B8, X1, X2, FAINT, pass-5's `max()` form, the landscape floor, an outline, and a border on the foot.
- **The critic's own `foot-breaks.mjs`** (anchor re-pointed to the live string): **8/8 RED**, where the pass-5 gate read 7/8 GREEN.
- **Estate row, `zone-grammar` "the foot wears the wells' pen".** It now gates coverage ≥ 0.9 on 4 sides AND a painted core median ≥ 3.0.
  - proto: 8.31 chromium / 8.986 webkit.
  - Plants in-run, all red: X1 `opacity 0` (cov 0); X2 transparent ink (cov 0); **FAINT `opacity 0.15`, cov 1.00 on 4 sides, median 1.365**. FAINT would have stayed GREEN on the pass-5 coverage-only row.
  - The unpositioned-foot NEG keeps top 0.
- RULE's `?? foot` fallback is RULE's row, not this tree's.

**2 · The berth, the mount and the reveal are ONE regime** (`useNoteBerth()`, one module-level MediaQueryList; `scene.css`'s berth is the same query).
- **Coarse 1280×800, keyboard focus-visible on the foot verbs:** 0 notes mount, both engines.
  - pass-5 dist: +17.30/+37.26 (chromium) and +17.39/+37.26 (webkit) past the case.
  - control: −24.31…−41.22, inside.
- **Fine 1440×900:** the notes mount and hang −26.08 / −5.74 / −27.21 inside the case.
  - In-run NEG (the berth unpaid, pad 12): +17.92 / +38.26 / +16.79, red.
- New rows in `zone-grammar`:
  - fine, with the NEG;
  - coarse, in the "coarse row regime (≥1024)" describe, regime witnessed.
  - **Born-RED on the pass-5 dist: both engines red.**

**3 · The junction** (the critic's `junction2`, dark, DPR 2, lip hidden vs shown, wells hidden vs shown).
- **The cure costs 0 layout.** The bottom sentinel's gradient moves from `background` (which paints the content box only) to a `border-image` fill with a horizontal 1.25rem OUTSET, so it also paints the card's inline padding, where the clipped wells' side strokes stand. It is ink overflow, clipped by the port.

| arm | cell | poses | min daylight | median | columns ≤ 1 css |
|---|---|---|---|---|---|
| proto | dock390 | rest, 0.5 | 8 (webkit rest 0: one column, the gap row) | 10 | 0 / 8–10 (webkit rest 1) |
| proto | land844 | rest, 0.5 | 6.5–7 | 9–10.5 | 0 / 8 |
| proto | dock390 / land844 | 0.1, 0.25, 0.75, 0.9 | 7.5–8 (dock) | 8.5–15.5 | land 1 / 9–20; webkit dock 0.75 1 / 596 |
| pass-5 dist | both | rest, 0.5 | 0 | 0–1.5 | 5–7 / 8–11 |

**4 · The foot on a REAL inset** (chromium CDP `Emulation.setSafeAreaInsetsOverride`).
- **The pad now STACKS:** `calc(0.75rem + env(safe-area-inset-bottom))` at the dock, `calc(1.125rem + env())` in short landscape. The rail keeps `max(3.5rem, env())`, since the berth exceeds any inset plus the excursion.
- **390×844, inset 34:**
  - proto: pad 46px, bar bottom 798 = 844 − 46, lowest lip ink **805 = 5 css above the inset line (810)**.
  - pass-5 dist: 817, −7 (reproduces the critic).
- **Inset 0:** 839, 5 css above the viewport, both dists, both themes.
- **Other cells, 5 css above the line or the viewport in every case:** DPR 3 at 390×844; 430×932 at DPR 2 and 3 (inset 0 → 927; inset 34 → 893).
- **New e2e row in the inset describe** (chromium; WebKit is a LOUD skip naming the RUNSHEET): pad 46, bar ≥ 46 off, ink ≥ 2 css above the line, a missing frame reds.
  - In-run NEG, pass 5's `max()`: 817, red.
  - Born-RED on the pass-5 dist: red.
- The authored-rule row's regex now requires the stacked form.
- **RUNSHEET line** (proposed for the chair's `evidence/w8/device/RUNSHEET.md`): on a Face ID iPhone, open the controls sheet in portrait. Confirm `#card-foot` computed `padding-bottom` = 12 + `env(safe-area-inset-bottom)` (46px). Then read the lip's lowest ink ≥ 2 css above the top of the safe-area band (`innerHeight − env(safe-area-inset-bottom)`), not above the home-indicator pill.

**5 · §2.5b is keyed on STUCK, over 101 poses.**
- **The predicate:** laid top = painted centre − paint offset (translate + matrix f) − offsetHeight/2, compared against the port's content edge + `top`, < 0.5. The tape is painted rotated, so the bbox is not the laid box. The first STUCK cut compared the bbox and read "stuck 0" (vacuous); caught by printing the count.
- **Vacuity is now a red:** a row with ≤ 10 stuck poses fails.
- **proto:** stuck 52/101 (rail) and 48/101 (dock); **pinned-out 0/101** at both cells, both engines. NEG (band 20) and NEG-2 (a pinned tape translated 24 px) both red.
- **control (this spec run on `index-CubiZsMVSwTc.js`):** pinned-out **97–98/101** (tape 5.4–19 px below its band from frac 0.02/0.03), red.
- **Forgiven rows name their target by `aria-labelledby`:** the dock's `new game × size` 44.5 px², `× level Easy` 30 (read "" in pass 5).
- The pass-5 dist also reads 4/4 green under STUCK, as the critic predicted: the design held, the row did not.

**6 · §2.6: the release lands in the jump's OWN frame.** The rAF deferral in the card's scroll listener is DELETED. A `scroll` event is already dispatched once per frame, inside the rendering update.

| reading | final dist | pass-5 dist |
|---|---|---|
| rAF ladder (`sticky-ladder.mjs`, `pencils`, 4 engine×cell) | lag **1**: `static → sticky → sticky`. rAF1, the first painted frame after the jump, is right | lag 2: `static → static → sticky` |
| chair's settle, ceiling 2 | 4/4 | — |
| settle at **ceiling 1** (PROPOSED, `instruments/PROPOSED-2.6-settle-lag-ceiling-1.diff`) | 4/4 green | **4/4 red** (the ceiling's born-RED) |
| plant `nosticky` | 4/4 red | — |
| plant `pub300` | 4/4 red | — |
| plant `pub30` | 3/4 red (gap 6b) | — |

- `SheetWashiLabel.vue`'s false IntersectionObserver comment is corrected (A.1.8), as is the matching `GameControlPanel` comment.

**7 · COST's focus contract lands** (RULE's kept delta).
- A keyboard arm (Enter, `detail === 0`) lands on `keep`. `keep`, Escape and the lapse hand focus back to the verb that asked, found by its accessible name (the verb is re-mounted under its question). Any other disarm follows the reader.
- **New `mobile-affordances` row:** Enter on "Deal a new board" → `keep` → Escape → focus is "Deal a new board", and the sheet stays up.
- **Born-RED on the pass-5 dist: red in both engines** (focus fell to `<body>`).

**8 · THE CROSS TAP.** Measured, not inspected.
- **Both directions RE-TARGET** on this tree, both engines, on the pass-5 dist AND the final dist: one ribbon stands, the second verb's.
- **The control arms both verbs at once** (`sure?` × 2).
- Registry-v5 §2.2's "TAPE's tree has the same dead tap by inspection" is **refuted**. The dead tap is RULE's `press(): if (askingAct.value) return`, named in a comment at `useTwoTap`.
- **New `mobile-affordances` row:** clear→deal→clear, both directions, nothing destroyed.
  - Its in-run NEG emulates the dead tap with a capture-phase click swallower; the first question stands, red.
  - The pass-5 dist is green on this row, since it never had the defect; the NEG is the discriminator.

**9 · The ring on four grounds** (`ring.mjs`, keyboard route, DPR 2, core median · fracUnder3 · 90% worst column; 4 cells × 2 themes × 2 engines).
- **well:** 4.286–4.289 · 0.004–0.102 · 3.231–4.289.
- **foot:** 4.188–4.379 · 0.02–0.211, except coarse1280 **dark 3.338 · 0.216/0.264 · 3.216**, the worst.
- **tape** (dock390, land844; the target is the dock's heading button): 4.286–4.289 · 0.011–0.22.
- **card:** ABSENT at every cell (gap 9).

**10 · The seal and the lift.** See gaps 10 and 10b.

**11 · π, prod vs prod** (`pi.mjs`: whole-DOM signature outside the case + named rows, control-vs-control noise arm; 10 cells × 2 engines).
- Board, cell and wordmark identical at every cell.
- Signature: 6 tag deltas at the rails (the quick set's 3 nodes, an index shift), rect 0, paint 0–2 = noise (control-vs-control 0–2, `IMG.rest-pose` opacity).
- **Coarse 1280×800 case width 224.00 = control**: RULE's +70.38 does NOT occur on this tree (§6.4 holds here).
- Declared, both as in pass 5:
  - dock case top +37.23 (390) and +20.99/+21 (430), with the tab riding the case;
  - case height −0.02.
- **The landscape tab, drawer SHUT** (§6.3's one row): 844×390 y 166.59 → **245.74 / 245.89 (+79.15 / +79.30)**; 812×375 159.09 → 238.24 / 238.39 (+79.15 / +79.30). The quick set's flank; the board is identical.

**12 · Content view:** see gap 12. M12 membership: four verbs ask here (deal, clear, fill, solve), deal + clear on RULE's. That is W1 §1.5's policy row; both readings are cited.

**13 · Also landed:**
- `landscapeFlank` is a module singleton (`useLandscapeFlank()`), and `useMediaQuery` leaves the component (INTAKE row 24).
- Two cross-file census rows, PROPOSED in A.3's form (`instruments/undefined-token-census.CTRL-TAPE.PROPOSED.diff`): `--tap-floor :: App.vue -> games/shared/ConfirmRibbon.vue` and `--washi-tag-h :: games/shared/scene.css -> games/shared/GameControlPanel.vue`.
  - The chair's census on this tree: 3 findings (these two crossings, pass-5 substrate) + 1 STALE.
  - The copy with the rows: 0 findings + the 1 declared STALE `--refuse-dur` (GREEN net, A.1.4).
- **Two stale estate rows re-cut** (not r0): `mobile-affordances` "Clear confirm beat" and "Deal is dirty-gated". They had been RED on the ribbon's tree since pass 3 (they read `sure?`/`Press again…`, and the verbs from `.mobile-control-panel`, which the foot left in pass 2). No pass had run the file; self-declared.

## INTAKE rows 18–26 (CTRL-TAPE)

| row | state | on this tree |
|---|---|---|
| 18 split + lip + fade | **closed (own form)**; G2 open | The lip's existence gate reads paint (row 1). The junction is cured to 6.5–10.5 css (one-column residual). `contain: layout` stands, co-sign owed. G2 not run. |
| 19 named deltas | declared | π row 11: the dock +37.23/+20.99, the landscape tab +79.15/+79.30, coarse-rail width 0. |
| 20 inset + headroom | **closed** at DPR 2 and 3 (CDP, chromium) | Pad 12 flat, 46 at 34 px. The ink is 5 css above the viewport / inset line at 390 and 430, DPR 2 and 3. `env(` in `scene.css` ≥ 1. WebKit is the device's row. |
| 21 notes vs stroke | open (by design) | gap 21 |
| 22 G4 re-word | the chair's | gap 22 |
| 23 spec controls | closed (own specs) | Every new row carries an in-run NEG: M18 X1/X2/FAINT/unpositioned; notes unpaid berth; inset `max()`; §2.5b NEG/NEG-2 + vacuity; cross tap dead-tap swallower; settle plants. |
| 24 code at fold | **closed** | `landscapeFlank` singleton. `lip=tab` 0. No `.action-bar` in the dusk list. |
| 25 M16 foot arm | open | The crib is FACE's. |
| 26 estate rows | **closed** | On the final dist: goldens 4/4 (no write), visual-regression 24/24, filter-census 12/12 (budget 9). |

## Ballot rows for the owner (U-10), one payload each

- **T9-B13, the form.** A multi-variable FORM frame by nature (proto vs HEAD), captioned as such, against RULE's f1/f2.
  - **`p6-c1-b13-form-chromium-dark-390x844-coarse-rest-proto-vs-head.png`** (chromium · dark · 390×844 · coarse · dock risen, rest; left proto, right HEAD). Retires pass-5 `CTRL-TAPE/c1-m18-edge-chromium-dark-390x844-coarse-proto-vs-head.png`. The junction is cured in this frame; pass-5's showed the fusion.
  - pass-5 **`c2-m18-edge-webkit-light-1280x800-fine-scrollend-proto-vs-head.png`** stands (the rail's scroll-end pose is unmoved).
- **T9-B12, the pen,** on THIS tree, one variable (the lip's three props, `instruments/T9-B12-armB-lip-2.5-3-0.diff`). Default (a) is live. Arm (b) reds `check-tape-foot` clause 3 by design.
  - **`p6-c4-b12-pen-chromium-light-1280x800-fine-scrollend-lip1.5-vs-2.5.png`** (chromium · light · 1280×800 · fine · scroll end; left 1.5/4/3, right 2.5/3/0).
  - Retires nothing: a new pair owed by pass-6 rulings §4. G-BAR's main-tree two-ups are its predecessors.
  - It also shows the 56 px berth as blank paper, and the naked "i".
- **The quick set (§14/M13), built vs STRIKE,** one variable (`.quick-frame { display: none }`).
  - **`p6-c3-quickset-chromium-light-844x390-coarse-shut-built-vs-strike.png`** (chromium · light · 844×390 · coarse · drawer shut; top built, bottom strike). Retires pass-5 `CTRL-TAPE/c3-quickset-ballot-chromium-light-844x390-coarse-built-vs-strike.png` (deleted in the sweep though listed in v5 §9).
  - Byte-identical to it (74,908 B): the shut landscape pose did not move. The sun is PRM-parked in both arms.
  - No default.
- **The first tape's LIFT:** LIFT a (translate −8, Δseal 0) vs as built (−4.42). Numbers only, no frame.
- **The notes' regime:** not a ballot, a law (row 2).
- The three new crops total 120,525 B.

## MOVED rows (PROPOSED, never applied to r0 or to the chair's instruments)

- **W2 §2.5 / §2.5b:** the tree's `viewport-law.spec.ts` vs `74a2b5d9` (`instruments/PROPOSED-viewport-law-2.5-2.5b.diff`): the clip (pass 5), STUCK, 101 poses, vacuity, `aria-labelledby` names.
- **W2 §2.6:** the chair's settle is cited and applies unchanged. PROPOSED: STICKY_MAX_LAG 2 → 1 (`instruments/PROPOSED-2.6-settle-lag-ceiling-1.diff`), plus the frame-based `pub30` (gap 6b).
- **R7 I2/I3/I4:** pass-4's PROPOSED stands; the subjects did not move.
- **The seal row "bar back in flow":** replaced by the LIFT rows (pass 5), unchanged.
- **Estate (not r0), edited in place:** `mobile-affordances` rows 339/441 (subject moved in pass 2/3) and the `zone-grammar` inset row's regex (the stacked form).

## Pre-return battery (bare; the control's exit code beside it)

Static (final tree):

| gate | proto | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep · test:e2e:projects · check-pw-projects | 0 · 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 · 0 (the chair's record) |
| eslint . | 0 | 0 |
| npm run lint (the SCOPED prettier: `src/ scripts/ ../../scripts/ ../relay/`) | 0 | 0 |
| check-copy-register (bare) · lint:copy · lint:motion · lint:ink · lint:theme-selectors · lint:live-regions · lint:catch · lint:boundary | 0 · 0 · 0 · 0 · 0 · 0 · 0 · 0 | 0 |
| lint:tape-foot | 0 (23 plants) | absent |
| check-property-block (pass6 copy) | 0 | 0 |
| undefined-token census (chair's copy / with the PROPOSED rows) | 1 (3 findings + 1 STALE) / 1 (0 findings + 1 declared STALE = GREEN net) | 1 (the STALE row) |
| L5b (pass6 copy) | **1, INHERITED** (AttributionCard `.hover-card`, untouched here) | 1 |
| vue-tsc -b · vue-tsc -p tsconfig.e2e.json | 0 · 0 | — |
| vitest (chunked) | src/games 57 files / 741 tests · src/pencil 8 / 74 · src/composables 3 / 16 = **68 / 831**, exit 0; src/games/shared re-run after the last edit, 34 / 429 | — |

Whole spec files, both engines, final dist vs the control's own spec files on its dist:

| spec | proto | control |
|---|---|---|
| zone-grammar | 35 passed, 1 skipped (the loud CDP skip on webkit), exit 0 | 21 passed, 1 failed, exit 1: webkit `:321` "rides the card's own scrollport", FLAKY (1 of 4 on `--repeat-each 2`) |
| viewport-law | 28 passed, 4 failed, exit 1 (the §2.6 sync reds, booked to the chair's settle) | 28 passed, exit 0 (vacuous: `pencils` unreachable there) |
| access | 14 passed, exit 0 | 12 passed, exit 0 |
| mobile-affordances | 24 passed, exit 0 | 20 passed, exit 0 |
| visual-regression | 24 passed, exit 0 | 23 passed, 1 failed, exit 1: webkit `:707` chip-separation NEG, FLAKY (same re-run) |
| visual-golden (golden config) | 4 passed, exit 0 | — (pass 5: 4/4) |
| filter-census (throttle config) | 12 passed, exit 0 | — (pass 5: 12/12) |

## Incidents (self-declared)

1. Port :4232 was another lane's (served the control's hash). Caught by the hash check.
2. The first STUCK predicate was vacuous: the bbox of a rotated tape, 0 stuck poses. Caught by printing the count; a vacuity red was added.
3. The share-flip re-key onto the berth regime redded two unit rows (jsdom has no matchMedia). Reverted to the `(pointer: coarse)` binding; the mount alone takes the berth regime (gap, last row).
4. `lint:sleep` flagged 3 fixed sleeps in my new rows (`:573`, `:738`, `:1017`). Cured with a two-rAF flush and an `expect.poll` on the note's opacity; 0 after.
5. `npm run lint` flagged 3 of my files; `prettier --write` on those src/scripts files only (never e2e).
6. The inkinset copy's `vsInsetLine` at 430×932 printed −83 (a sed miss kept 844). The table uses `aboveViewport − inset`.
7. `seal.mjs` at 844×390 timed out (gap 10b).
8. `pi.mjs`'s land cells ran with the drawer OPEN (lib's dock flag); re-run with `land844shut`/`land812shut` for the tab row.
9. The two mobile-affordances rows were stale reds since pass 3, never run by a pass.
10. The B12 arm (b) was built twice (after the final edit); both builds restored the file, checked by `cmp`.
11. `zsh` ate an `echo ====` (the `=cmd` expansion) once; harmless.
12. Servers were killed by recorded PID; see the return.
