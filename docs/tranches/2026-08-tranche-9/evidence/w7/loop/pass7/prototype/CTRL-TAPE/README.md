# PASS 7 · CTRL-TAPE · the prototype's return

Work tree `.claude/worktrees/wf_f72f3b5a-83a-27`, advanced in place, uncommitted. Base and π control are `74a2b5d9`, served from `w7-control` as `index-CubiZsMVSwTc.js`. The integrated arm is `74a2b5d9 + s10.diff`, rebuilt in scratch as `index-QGTCf7nYCMIb.js`, which reproduces the integrator's record. The merged arm is s10 plus this pass (`index-C3xGb3Gj9lX8.js`). This tree serves `index-C0UL6nygNq7X.js`. The pass-6 bank was rebuilt to `index-BBBYNWxB0Bv8.js`, which reproduces pass 6. The box load ran from 23 to 192 over the session (111 at the last probe), so every timing below was read under that load.

## Gaps first

1. **The zero column is identified; its mechanism is not.** At 8/24 poses on this tree, and 1/24 on the merged tree, one device column reads 0 daylight at x 840.5 (landscape 844, frac 0.1/0.75/0.9) or at x 386.5 (WebKit dock 390). That column is the clipped last well's right-side stroke. The well's svg spans 4–840 against the card clip at 305.23. One device row at y 303.0 carries well ink and nothing else, and sits directly above the lip's first ink at 303.5. A red sentinel reads 227/255 at that pixel, so the foot's fade does not cover the row. A doubled solid band doesn't remove it either. The compositing order is unresolved.
2. **The four-band probe's station 1 fails on dashed rings in WebKit.** It reads 1.23–2.07 because the gaps between dashes read 1.00. Station 8 (8 device px) is GREEN. The chair's probe default needs a ruling (§E).
3. **The inset row's WebKit arm is not a CDP arm.** `Emulation.setSafeAreaInsetsOverride` is chromium-only, so WebKit runs the flat-phone arm at inset 0 with a 0.5rem negative. DPR 3 on a real device is untested; the RUNSHEET line is proposed, not run.
4. **The voice (row 11) adds no new crop.** The wave is at its 2 MB cap, and the only one-variable pair for either ballot is the pass-6 pair. The third arm is stated in numbers (see "The ballots"), not in a caption on disk.
5. **Row 23 cannot close on either tree.** `e2e/tool-strip.spec.ts` doesn't exist on either tree.
6. **These carry over unchanged:**
   - The coarse note row still has no in-run discriminator (pass-6 critic gap 6).
   - COST's three grafts aren't landed.
   - LIFT for the first tape isn't built.
   - The coarse-landscape seal cell is undefined.
   - The G2 leak sweep wasn't re-run this pass.
   - The golden config is chromium-only.
7. **viewport-law is 14/16 on this tree in both engines.** Two §2.6 rows (:630 and :665, "a section tag stays pinned while its group is in view") are red, and they're booked to the chair's settle as in pass 6. The merged tree reads 16/16 in both engines. The control's own spec reads 14/14.

## Numbers (control `74a2b5d9` beside each)

| row | reading | control / negative |
|---|---|---|
| 1 keys-crib G3 post-paint, merged tree | drift **0 px in 16/16** (4 cells × 2 reps × 2 engines; in-rAF also 0) | grow-the-case plant REDs at **49.36–50.89 px** (the integrator's parked ride was 50.91). On s10 (no cap), the unchanged in-rAF G3 is RED 8/8: chromium 6.61–12.78, webkit 14.52–27.88. On s10, post-paint reads 0.02 (integrator 0.016) and the plant is inert |
| 1 π of the flex column (p6→p7) | max \|Δ\| **0.02 px** over 20 cells in both engines; `cardCH` identical; board unmoved | — |
| 2 check-tape-foot | 8 clauses; **54 plants red**, live GREEN on this tree AND the merged tree; 3.6 s | pass 6 had 6 clauses and 23 plants; the control has no `lint:tape-foot` (exit 1, no script) |
| 3 inset row | chromium **10/10** at CDP inset 34: lowest ink 805, 5 css above the 810 line; WebKit **10/10** at inset 0: 839 | NEG `max(0.75rem, env())` = 817, red on 10/10; WebKit NEG 0.5rem = 843, red. p6 dist 3/3 |
| lapse (COST) | **5/5 per engine** | born-RED on the p6 dist in both engines: arm 2's focus went to "Deal a new board" |
| 4 junction, 24 poses, merged tree | 21/24 min 6.5–8.5 css; 2/24 blind (land844 frac 0.25, no well ink); **1/24 zero column** (chromium land844 0.9, x 840.5) | this tree: 8/24 zero columns |
| 5 foot ring, 4 bands, 1280 coarse, DPR 2, PRM, station 8 | every band **≥ 3.338** in both engines and both themes; chromium light 4.145–4.188, dark left 3.338; webkit light 4.106–4.188, dark left 3.338; fracUnder3 ≤ 0.1 chromium, ≤ 0.333 webkit (right band occluded by the neighbour button) | control card ground: chromium dark right/left 1.203 → RED; webkit 1.0 on every band (no ring painted) → RED. Plants X6/X4/FAINT_ring_15 red on every arm. The pass-6 loss "15.553 vs 3.338" reverses on the four-band statistic |
| 6 regime | clause 7 GREEN; plants R1–R5 red (7 lines) | the landscape pad's query == `useLandscapeFlank`'s == DrawerTab's; no per-mount orientation/hover/pointer/width `matchMedia` in `src/games/shared/*.vue` |
| 8 goldens | **4/4** on this tree, s10 and the merged tree (golden config, chromium) | — |
| 21 notes vs the lip's stroke | notes sit **6.95–9.03 css** above the lip's lowest ink; **309.75–464 css px²** of each note over lip ink (fine 1440/1280, both engines) | stays OPEN by design; the info button has no note |
| 9 the 844 tab (π) | merged vs control: landscape shut tab **+79.15** (chromium) / **+79.30** (webkit) at 844×390 and 812×375; dock case top +37.23 / +38 | s10 vs merged: max 0.02 |
| voice | this tree: **8 headings** in the case outline, 4 painted tapes | s10 and merged: 2 headings (`Size`, `Level`), 4 painted tapes; control: 2 headings, 1 tape on the rail |
| 12 apply | cumulative diff `git apply --check` on a fresh `74a2b5d9` archive: **0**; `pass7-on-s10.diff` on s10: **0** | the pass-7 delta alone on s10 fails in two files: `src/assets/index.css` (`@property --card-foot-h`) and `GameControlPanel.vue:783` (`publishFootH`) |

- **Token census (chair's copy):**
  - The tree has 3 findings: `--tap-floor` ×2 and `--washi-tag-h`.
  - It also has 1 stale finding: `--refuse-dur`.
  - With the pass-6 PROPOSED rows it has 0 findings plus the 1 stale one.
- **check-property-block:** 0 findings on the tree (the served dist carries 55 registrations) and 0 on the control.
- **Types and unit tests** (archive `d316ed7b`; only `check-tape-foot.mjs` changed after it):
  - vue-tsc `-b`: exit 0; the e2e config: exit 0.
  - vitest: 68 files / 831 tests, exit 0.
    - games: 57 files / 741 tests.
    - pencil: 8 files / 74 tests.
    - composables: 3 files / 16 tests.
    - `src/lib` has no tests.
- **Whole specs, this tree vs control (chromium · webkit):**
  - access: 7·7 vs 6·6
  - mobile-affordances: 13·13 vs 10·10
  - zone-grammar: 18·18 vs 11·11
  - viewport-law: 14+2F · 14+2F vs 14·14
  - visual-regression: 12·12 vs 12·12
- **Whole specs, merged tree (chromium · webkit):** zone-grammar 20·20, mobile-affordances 13·13, viewport-law 16·16.
- **Static battery, run bare (tree / control):** every gate reads 0 / 0 except `lint:tape-foot`, which reads 0 / 1 because the control has no such script. The gates:
  - lint:lanes, lint:theme-tokens, lint:sleep
  - test:e2e:projects, check-pw-projects
  - lint:copy, check-copy-register
  - lint:motion, lint:ink, lint:theme-selectors, lint:live-regions, lint:catch, lint:boundary
  - `npx eslint .`, `npm run lint`

  `lint:bands` and `lint:verbs` exist on neither tree.

## What moved in the product (the pass-7 delta: 9 files, +1307/−334)

- **The case is a column.**
  - `.drawer-case { display:flex; flex-direction:column }`, and `.card-foot { flex:none }`.
  - The rail caps the case, not the card: `max-height: calc(min(42rem, 85vw, 100dvh - 10rem) - 2rem)`.
  - The dock's case holds `calc(100dvh - var(--sheet-chrome) - 1.5rem)`.
  - This layout-only cap replaces the ResizeObserver-published `--card-foot-h`, which was the one-frame lag G3 read in-rAF.
  - The publisher and its `@property` registration are deleted.
- **The lapse is not the reader's act.** When the confirm window lapses, focus goes home only if the reader is still inside the question: `activeElement` is the body or inside `.confirm-ribbon`.
- **`check-tape-foot` is keyed on shape.**
  - It imports the chair's library (`scripts/lib/shape-census.mjs`, sha1 `3ba7738e…`, vendored byte-identical and pinned by the self-test).
  - It checks 8 clauses: INSET, LAYER, PEN, ONE HAND, FLOOR, BAND, REGIME, CLIP.
  - Its self-test runs the 23 pass-6 breaks, K1–K15 (every clip-bearing property on the foot's chain), N1–N11 (inline style, utility classes, script writes, `:deep` descent, conditional ancestors) and R1–R5 (a restated regime).
  - `--verbose` prints each plant's red line.
- **The specs:**
  - zone-grammar's inset row runs in both engines with PRM and two intersected on/off pairs, reading only the bar's columns.
  - REGISTRATION drops `--card-foot-h`.
  - mobile-affordances gains the lapse row (two arms).
  - On s10 only, keys-crib's `sampleVerbs` reads post-paint, with the in-rAF reading printed beside it and not gated, plus the grow-the-case negative.

## Charter rows

1. **CLOSED on the merged tree.** Post-paint 0/16 with the plant red at ~50 px. The flex column is the product seam.
2. **CLOSED.** 54 plants: the 23 pass-6 breaks, the 15 the charter names (K1–K15), and 16 it didn't (N1–N11, R1–R5), against the 5 it asked for.
3. **CLOSED.** 10/10 in each engine. The flake's cause is the case's boil between the two shots of one pair (y 843). PRM plus two intersected pairs cures it.
4. **The table is delivered; the row is not closed.** The zero column's identity is named; its mechanism is gap 1. The re-wording is the chair's (INTAKE-22 row 22).
5. **CLOSED at station 8.** The station-1 probe's gap is gap 2.
6. **CLOSED.** One predicate per regime, pinned by clause 7.
7. **MOVED (superseded).** `publishFootH` and the `--card-foot-h` publisher are deleted on both trees, so nothing is left to ratify by sha. The parking class has no subject. Its magnitude is reproduced by the grow plant (row 1).
8. **CLOSED** (goldens 4/4 on all three dists). Row 21 is re-measured and stays OPEN by design.
9. **Row 19's tab is read.** The row-9 π stands, and the ruling is the chair's. Row 23 is gap 5. Row 25 is cited to FACE's crib-first-row cure on s10 (the crib rises above the lip), which this pass doesn't re-derive.
10. **T9-R7** (W2 §2.5 for the attribution tape, CURED on `s10`; the loop's old "T9-R5", per `pass6/RE-POINT.md`). The clipped predicate survives on s10. No product-side site in this tree reads the loop label.
11. See "The ballots" below and gap 4.
12. **CLOSED.** Both checks exit 0 (see the table).

INTAKE-22 §7 rows 18–26 (TAPE):

- 18 stands from pass 6: the split, lip and fade are unchanged. The flex column changes only the cap's home (π 0.02).
- 19: 844 tab π, as in row 9 above.
- 20: CLOSED as row 3.
- 21: re-measured, OPEN by design.
- 22: the table is delivered and the wording is owed by the chair.
- 23: gap 5.
- 24: `git grep 'lip=tab' src` = 0, and one `matchMedia` per regime query in `useCoarsePointer.ts`.
- 25: cited to FACE.
- 26: goldens 4/4. The §2.5 red's HEAD twin is cited as in pass 6.

No INTAKE-23 row names TAPE.

## The ballots (LAWS P6 §G)

- **T9-B12 (the pen):** the pass-6 pair `p6-c4-b12-pen-chromium-light-1280x800-fine-scrollend-lip1.5-vs-2.5.png` stands. The third arm is s10, which carries arm (a), the fold's foot: the lip is drawn and the berth is the same.
- **T9-B13 (the form):** `p6-c1-b13-form-chromium-dark-390x844-coarse-rest-proto-vs-head.png` is a FORM frame and stands. On the voice, the integrated arm paints the same 4 tapes but its case outline holds 2 headings (`Size`, `Level`, title case), against 8 on this tree (`new game, size, level, pencils, marks, what fits, checking, players`).
- **The loss the fold takes by not carrying the voice:** a screen reader walks 2 headings, not 8, and the row labels keep title case. See `readings/voice.txt`.

## Replay route and identity

- **In place.** The tree matched `pass6/prototype/CTRL-TAPE/BANKED.txt` (tree `72b907da`), and the p6 rebuild reproduced `index-BBBYNWxB0Bv8.js`.
- **`pass7-delta.diff`** = tree `711834e8` minus `72b907da`: 9 files, +1307/−334, sha1 `0f6190f0…`.
- **The cumulative diff** vs `74a2b5d9`: 31 files, +4548/−709, sha1 `c743d67f…`.
  - It isn't banked; `delta.sh` regenerates it from the tree.
  - Pass 6's bank was 28 files, +3573/−707.
  - The 3 new files are the lib, `.prettierignore` and `eslint.config.js`. Two of them are the ignore entries for the vendored lib.
- **`pass7-on-s10.diff`** = the merged tree minus s10: 10 files, +1351/−362, sha1 `14a0ad16…`.
  - It applies clean on s10.
  - It carries the keys-crib re-cut and the hand-resolved `index.css` and `GameControlPanel.vue` hunks.

## Incidents

- **Load.** The box ran at 23–192 through the session.
  - Specs ran in background batches (b1–b8) with logs; nothing went past 120 s in the foreground.
  - No lane died.
- **The s10 scratch tree.** `instr7-mktree` archives a path subset, and `s10.diff` touches `README.md`, so it failed. The tree was rebuilt from a full `git archive`.
- **The shape-census library under eslint.** It trips `no-useless-escape` and `no-loss-of-precision`. It's ignored in `eslint.config.js` and `.prettierignore` rather than forked, so the sha1 pin holds.
- **A false red on s10.** The utility pattern `ring(-.+)?` matched the class `ring-arm`, so it was narrowed to Tailwind's ring forms.
- **Reporting.** Playwright's list reporter hides annotations, so G3 was read through the JSON reporter.
- **Cleanup.**
  - Servers on 4230–4233 and 4237 were killed by recorded PID (the node and npx parents).
  - `.ctrl-tape7/` was moved to the scratchpad's `trash-ctrl-tape7/`, and its configs were copied to `instruments/`.
  - No `rm`, no commit.
  - The control tree was never git-touched.

## Frames

None. No crop is retired. The wave is at its cap, and no lawful one-variable pair beyond pass 6's exists for either ballot.

## On disk

- `pass7-delta.diff`, `pass7-on-s10.diff`
- `instruments/`
  - `ring7`, `junction7`, `corner-col`, `corner-stack`, `notes-stroke`, `voice-*`
  - `edge-bands` (PROPOSED `offCss`/`station` extension; defaults unchanged)
  - the token census with its PROPOSED rows
  - the lane configs
- `readings/`: ring, junction ×2, geometry ×3, notes-stroke, keys-crib G3, voice
- `logs/`: battery-exits, static-exits, vitest
