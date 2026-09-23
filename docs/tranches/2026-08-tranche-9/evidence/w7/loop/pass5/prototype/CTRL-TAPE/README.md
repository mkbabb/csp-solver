# T9-W7 pass 5 · CTRL-TAPE (the tape, the band, the foot) · prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-27`, advanced in place from the pass-4 diff at `74a2b5d9`.
Nothing is committed.

- **Replay route.** In place. No replay and no reset. The pass-4 diff (`pass4.diff`) listed 22 paths. All 22 are still here, and pass 5 adds four: `.github/workflows/ci.yml`, `e2e/access.spec.ts`, `package.json` and the new `scripts/check-tape-foot.mjs`. `git diff --stat` reads 24 tracked files, +2548/−674, plus 2 untracked (`ConfirmRibbon.vue`, `check-tape-foot.mjs`).
- **The G-BAR intake diff was NOT replayed.** This tree's foot is its own: `#card-foot` is a sibling of the card inside `.drawer-case`, not a two-row grid inside the card. Every number below was measured on this tree.
- **Served dists.**
  - Proto: final `index-T6edeNHCmbrz.js`. The e2e files were read on `index-CtiSx-dqCRkE.js`, the build before the slab deletion.
  - Control: `74a2b5d9` `index-CubiZsMVSwTc.js`.
  - Main-HEAD: `042698e2` `index-ChSrVSqM0j8q.js`, built from a git-archive scratch tree with its own cacheDir. It is used for the mark rows and π only.
- Everything was dealt on one encoded payload (PINNED_GIVENS), and the givens were read back equal on every arm.
- Summarised numbers are in `readings/numbers.txt`, with the batteries in `logs/`. Instruments are `instruments/p5-*.mjs`.

## Gaps first (what is still open, with the number that holds it)

| # | gap | the number |
|---|---|---|
| 3 | **§2.6 latency** (the chair's row) | Proto: SYNC `pencils` static, tagVisFrac 0 vs SETTLED sticky/1 (wellInView 0.811–0.856). That is 4 reds (2 cells × 2 engines), the only reds in viewport-law. The control is green **vacuously**: `pencils` is unreachable there (want 599.2 > range 504 at the rail; the drawer range is 437). The foot made it reachable. The pass-4 settle proposal is carried unchanged (`instruments/PROPOSED-viewport-law-2.6-settle.carried-from-pass4.diff`, a schematic hunk). No same-frame release pose was built. |
| 4 | First tape wholly below its frame | −4.42 chromium / −4.41 webkit. Priced, not landed. LIFT a (translate −8): 3.58 above, seal Δ0. LIFT b (−16): 11.58, Δ0. LIFT c (layout +8): 11.60, Δ**−8**. The chair stamps. |
| 9 | Ring, the **card** ground | ABSENT. No focusable ring abuts bare card on this tree; reported, not substituted. The tape ground was read only at dock390. |
| 10 | FACE's case-wide gate | Not run on this tree. RULE's ribbon-critic and the painted read ran (below). |
| 11 | Coarse-landscape seal | Not read. The seal is read at iPad coarse 1280×800 only; declared as such. |
| 12 | Quick set /8 fresh-reader protocol | Not run (the orchestrator's). The STRIKE arm is framed (c3). |
| 14 | COST's face grafts | **Not landed.** THE FACE IS THE BUTTON'S AIR has no subject here (`.act-face` does not exist on this tree). The input split and ARMED as a third berth path are also not landed. `check-cost-face` was grafted as its SHAPE only (`check-tape-foot`, below); its three `no-regex-spaces` are moot. |
| 14 | Pointer-agnostic ask | Not landed. At 1440×900 fine, one click clears with no ask (`isCoarse && isDirty`). Stays open for W1/U-10. |
| 15/25 | M16's foot arm, G1–G5 with the crib | Not measurable here. The crib is FACE's and is not on this tree. |
| 16 | RULE ↔ TAPE arming merge watch | Open. This tree runs `useTwoTap`/`askingAct`; RULE's `armGuard` is unmeasured on RULE's tree. |
| 20 | DPR 3 and the real iPhone inset | Unmeasured. Playwright resolves `env()` to 0. The RUNSHEET line is proposed below. |
| 21 | Rail hover notes vs the lip's painted bottom stroke | **Not measured.** The notes hang `top:100%` + `margin-top: 0.1rem` (1.6 css) under the bar box. The lip's bottom stroke sits outset 4 + half the 1.5 stroke below that box, so tape over the stroke is expected by geometry until measured or re-homed. |
| 22 | G4's proposed re-word | Fails its box clause off the rail. Box gap last well → lip is rail 15.92–16.33 against inter-well 16 ✓, but dock 15.3–16.17 and landscape 15.59–16.22 against inter-well **8**. Painted daylight ≥ 4 ✓ (17–21). The chair writes the row. |
| 18 | G2 leak sweep | Not re-run. The slab it priced is gone and the bar is outside the scrollport, so 0 holds by construction, but it is not measured. |
| 23 | `tool-strip.spec` controls | Not applicable: that is G-BAR's file and it is not on this tree. This tree's M18 rows live in `zone-grammar.spec.ts`, each with an in-run control. Their born-RED on the control was not run as a spec; `p5-foot` reads 0 paths on both controls. |
| 24 | One matchMedia per regime | `landscapeFlank = useMediaQuery(…)` (the quick set's berth) is a per-mount listener that restates a regime. `footBerth` is a mount-time DOM read, not a query. |
| — | Painted rhythm | The lip's daylight is 17.5–21 against inter-well 25.5–37. The wells' jagged hand sits ~11 css inside their boxes, so the box rhythm is not the painted one. |
| — | `.legend-fold { contain: layout }` | Landed; it cures 38 px of blank scroll at the scroll end. **G-INFO's co-sign is owed.** |
| — | T9-B14, the "i" | The ring's border died with clause 4, so the "i" is naked (visible in c2). The ballot's winner must land in the same commit. |

## Numbers (charter rows 1–16)

1. **§2.5 is clipped to the scrollport** (MOVED row, PROPOSED in `instruments/PROPOSED-viewport-law.diff`, the file vs `74a2b5d9`).
   - Result: 0 overlaps in both engines.
   - **Break-test.** With the clip struck (restored by sha1 `b7b48ea4`), the row reds in both engines: `pencils` × `Clear the board` 1486.9/1486.2 px², and × Fill-in 688.8/689.5.
   - **NEG-1, in-run.** Across the same hover pass it prints the unclipped rows against a clipped `[]`.
   - **NEG-2.** A tape planted over a `.ctrl-btn` reads > 0.
   - The whole viewport-law file: proto 28/32, where the 4 reds are §2.6; control 28/28.
2. **§2.5b takes §2.5's condition** (`data-fold-above`) and prints `forgiven[]` with its sign bit.
   - Rail 1440 at frac 0.25: `new game` × 9×9 3279.4 px², below −1.2, hitIsTarget false.
   - NEG (band 20px): worstBelow 22.66, red.
   - NEG-2 (`translate: 0 24px`): 22.8, red.
3. See gaps.
4. See gaps.
5. **The margin rule**: measured max 1303.44 + engine spread 0.13 + 0.5 = **1304.07**.
   - `SEAL = 1306.0` is carried, not restamped; the chair stamps once at the fold.
   - The comment is corrected: the pin band books **0.00** and is not in the −113 rows.
   - Seal 1303.44 / 1303.31, unchanged from pass 4.
6. `zone-grammar.spec.ts` `.every(…) === false` became `.some(…) === false`.
7. **BAR_IN_FRAME** now censuses the document minus the bar's subtree, clipped to scroll ancestors. A plant over the board (top 30%, 40vw × 180px) reds it.
8. **The @property discriminator** plants `7px` on the card's parent and expects `"7px"`, the inherited value. The sentence is fixed.
9. **The ring, painted**, keyboard route in both engines.
   - Well/foot/tape core median: 4.289 light / 4.286 dark. fracUnder 0.004–0.176. The 90% worst column is 3.23–4.29.
   - Control: chromium 3.675 / 17.47; webkit **2.147 / 1.783** (fracUnder 1.0).
10. **The ribbon** (RULE's `ribbon-critic`, re-pointed as `p5-ribbon`).
    - At 390×844 and 844×390, both engines: covRaw 0.68/0.76 against covPainted **0**, and `elementFromPoint` returns the ribbon. Pass 4's 237.49/577.07 px² was the unclipped-rect artifact.
    - Answers are 48.36×44 and clear 51.36×44 at stroke 1.5/2.5; min-height 44px.
11. **`--card-pad-x` was a defect.** It was published on the card while the foot, a sibling, read it: 0px in every cell, both engines, with the verbs and frame on the case's edge.
    - The publisher and its `@property` are deleted; the foot takes `px-5`/`px-2`.
    - The `--card-pad-b` publisher is deleted too, leaving one static `0.5rem` token in `scene.css` (read by the bottom sentinel and `scroll-padding-bottom`).
    - `--card-foot-h` is now published unrounded. It was `Math.ceil`; the rail case drift went from −0.19…−0.86 to −0.02.
12. **The STRIKE arm is framed** (c3, one variable: `.quick-frame { display:none }` on one payload). The quick set costs 3 nodes (6 π tag deltas at the rail, all index shift).
13. **π prod-vs-prod** (dist vs dist, control-vs-control as the noise arm), against `74a2b5d9` AND main-HEAD, 6 cells × 2 engines.
    - Board, cell and wordmark identical to the hundredth. Rect deltas 0. Paint deltas are only `IMG.rest-pose` opacity, which is noise (control-vs-control shows it too).
    - Case: rail h −0.02; landscape y +0.02, h −0.02.
    - **Declared:** dock case top +37.23/+38 (390) and +20.99/+21 (430). That is the pin band (43.87 vs 6) plus the foot (78.77 vs the in-port bar 66.77).
14. **Landed from COST.**
    - `.confirm-answer` has `min-width`/`min-height: var(--tap-floor)` bare.
    - The touch-armer's keyboard row is decided: after the tap focus is on body, the first Tab lands on the ribbon's `keep` and the second on `clear`, in both engines. The safe answer comes first by DOM order, so no `preventScroll` focus move is needed.
    - **T9-D1**: a Tab walk over the open drawer (40 presses, Alt+Tab on webkit) lands 0 focusables under the sheet. The in-run control strips `inert` from `.play-controls`' holders and reds it. access.spec: proto 14/14, control 12/12.
15. **M18: the edge is in the house hand.**
    - **The pen:** `HandDrawnOutline` 1.5 / outset 4 / radius 3 / pose 0, the wells' four props. `.bar-frame` sets no colour (the wells' ink).
    - **Coverage:** 1.00 on four sides at every cell, both engines, both themes. Contrast 17.36/17.20 light, 14.31 dark (it was 3.23 on `--ink-press-rule`). |dx| ≤ 0.24.
    - **Borders:** 0 in the strip. `.action-bar`'s slab (`background: var(--color-card)`) is deleted and `.action-bar` leaves `index.css`'s dusk list: the bar stands on the foot's page ground.
    - **The layer:** a latent defect was cured. The pass-4 foot painted under the card (top coverage 0.00). `.card-foot` is now position relative at z 45, and the in-run NEG (the foot unpositioned) reads 0.00.
    - **The inset:** `max(0.75rem, env(safe-area-inset-bottom))` at the dock and `max(1.125rem, env(…))` in <1024 landscape; 0.75 crossed the case stroke there by −1.0/−1.5. The rail keeps `max(3.5rem, env(…))` as the note berth. Computed 12px at 390×844 hasTouch in both engines. The lowest lip ink sits **4.5–5.5 css** above the viewport bottom.
    - **Pad sweep:** 0.5rem gives 0.5–1 (refuted), 0.625rem 2.5–3, 0.75rem 4.5–5.
    - **Both controls** (`74a2b5d9` and main-HEAD): 0 lip paths and a 1/1.5 border at the rail, so R3 is RED on both.
    - **Content-view price per cell:** see `readings/numbers.txt`. Rail −79.6…−80.1 (−23.87 of it the band), coarse rail −36.06, dock −87.1/−88.1 and −71.1, landscape −122.87.

## Intake charter rows (INTAKE §7, CTRL-TAPE 18–26)

| row | state | on this tree |
|---|---|---|
| 18 split + lip + fade | **closed (own form)** / G2 open | Lip in the wells' pen in `#card-foot`, with no border and no slab. G1 1.00 ×4, G6 0. G7 is identical to the hundredth at 1280/1024/1440 vs both controls. The fade is the card's bottom sentinel (`.controls-card::after`), not `.card-foot::before`. `contain: layout` is landed with G-INFO's co-sign owed. G2 was not run. |
| 19 named deltas | declared | Dock top +37.23 (390) / +20.99 (430), the board unmoved. Landscape: case identical; card 302 → 217 with the foot out of the scroll; range 441 → 594. Coarse rail: the play row is in the body above the strip (box gap 73–90). Frames: c1/c2. |
| 20 inset with headroom | **closed at DPR 2** / DPR 3 open | 0.75rem → lowest ink 4.5–5.5 (≥ 2 + 2.5). `env(` occurs 6× in `scene.css`. |
| 21 notes vs stroke | **open** | Not measured (see gaps). |
| 22 G4 re-word | the chair's | The rail passes; dock and landscape fail the box-gap clause (16 vs 8). |
| 23 spec controls | n/a (own spec) | M18 coverage NEG (top 0.00); inset NEG (0.5rem pad reds); §2.5 NEG-1/NEG-2; §2.5b NEG/NEG-2. |
| 24 code at fold | partial | `lip=tab` 0. The dusk list has no `.action-bar`. `landscapeFlank` is a per-mount query. |
| 25 M16's foot arm | open | The crib is not on this tree. |
| 26 estate rows | **closed** | visual-golden 4/4 proto and control. visual-regression 24/24 both engines. filter-census 12/12 proto and control. G-BAR's `viewport-law:396` §2.5 red is **green** here under the clipped predicate; the unclipped predicate reds (break-test). T9-D1 follows the bar (access.spec green with its control). |

## The foot's declaration witness (CI, browserless)

`scripts/check-tape-foot.mjs` has the shape of CTRL-COST's `check-cost-face`. It runs as `npm run lint:tape-foot`, with a ci.yml step after theme-tokens, and `lint:lanes` is 0. Its six clauses:

1. `max(<pad>, env(safe-area-inset-bottom))` on every `.card-foot` padding.
2. The foot is positioned at z ≥ the card's.
3. The bar-frame props equal the tray-well props, and `.bar-frame` has no colour.
4. No bordered declaration and no `.action-bar` background.
5. `.confirm-answer` has `var(--tap-floor)` bare.
6. `--pin-band` is a `calc()` spent as padding-top, and no script publishes it.

`--self-test`: 8 plants red, live source green.

## Pre-return battery (bare; the control's exit code beside)

**Static gates:**

| gate | proto | control |
|---|---|---|
| lint:lanes, lint:theme-tokens, lint:sleep | 0 | 0 |
| test:e2e:projects, check-pw-projects (FLOOR BAND ✓, 34 specs / 561) | 0 | 0 |
| eslint . | 0 | 0 |
| prettier --check | 0 | 0 |
| check-copy-register (0 em dashes, 0 unadmitted), lint-copy, lint-ink, lint-motion | 0 | 0 |
| lint-theme-selectors, live-regions, lint-catch, font-coverage | 0 | 0 |
| lint:tape-foot | 0 | absent |
| vue-tsc -b; vue-tsc -p tsconfig.e2e.json | 0 | — |
| vitest `src/games/shared` | 34 files / 429 tests | — |
| vitest all | 68 files / 831 tests | — |

**Whole spec files, both engines:**

| spec | proto | control |
|---|---|---|
| zone-grammar | 30/30 (after the slab too) | 22/22 |
| viewport-law | 28/32 (exit 1; the §2.6 reds, the chair's) | 28/28 (exit 0) |
| visual-regression | 24/24 | 24/24 |
| access | 14/14 | 12/12 |

## Ballot rows for the owner (U-10), one payload per pair

- **T9-B13, the form.** The framed lip (built) against HEAD's bar:
  - `c1-m18-edge-chromium-dark-390x844-coarse-proto-vs-head.png` (chromium · dark · 390×844 · coarse, dock risen). Retires pass4 `c1-confirm-redword-390x844-dark-chromium-coarse.png`.
  - `c2-m18-edge-webkit-light-1280x800-fine-scrollend-proto-vs-head.png` (webkit · light · 1280×800 · fine, scroll end). Retires pass4 `c3-pinband-band-and-chip-1440x900-light-chromium-fine.png`.
  - RULE's arm (b), a drawn top rule, is RULE's frame to make.
  - Owner's-eye note: at the dock the lip's bottom stroke and the case's stroke sit 4–5 css apart, which may read as a double line.
- **Quick set, §14/M13.** Built vs STRIKE:
  - `c3-quickset-ballot-chromium-light-844x390-coarse-built-vs-strike.png` (chromium · light · 844×390 · coarse, drawer shut). Retires pass4 `c4-quickset-flank-844x390-light-chromium-coarse.png`.
- **T9-B12, the pen** (1.5/4/3 vs 2.5/3/0). Not framed on this tree. G-BAR's two-ups (`intake-owner-2026-09-22/prototype/G-BAR/c3…`, `c4…`) are the frames, on G-BAR's tree.
- **T9-B14, the "i".** Its ring is dead here. The winner lands with it.

The crops total 127.5 KB.

**RUNSHEET line (proposed, for the chair's `evidence/w8/device/RUNSHEET.md`):** on a real iPhone with a home indicator, open the controls sheet in portrait. Read the gap between the lip's lowest ink and the top of the home indicator (≥ 2 css). Then confirm the computed `#card-foot` `padding-bottom` equals `env(safe-area-inset-bottom)` (34px on Face ID phones), not 12px.

## MOVED rows (PROPOSED, never applied to r0/W2)

- **§2.5**: the predicate is clipped to the scrollport.
- **§2.5b**: the band subtraction is conditional on `data-fold-above`.
- **§2.6**: the settle is carried from pass 4.
- **R7 I2/I3/I4**: pass-4's `PROPOSED-r7-I2-I3-I4-subjects-moved.diff` stands; its subjects did not move again this pass.
- **The seal row "bar back in flow"**: its subject left (the bar is in the foot). `p5-seal` replaces it with three LIFT rows.

## Incidents (self-declared)

- **Unquoted heredoc.** It evaluated backticks while writing the ribbon copy. The copy was rewritten with a quoted heredoc.
- **Nested comment.** A `/* */` nested inside a `/** */` in an instrument; fixed.
- **Build config path.** It was doubled (`$S/tape/build.mts`); fixed.
- **Inter-well daylight** read from one window went negative; it is now read from split windows.
- **The first givens selector** matched nothing; givens are now read by aria-label.
- **`prettier --write` on e2e files**, which the repo keeps out of prettier. Only my own edit regions changed, verified by diff.
- **A tsc-e2e red** on `n.remove()` over a `Node`; fixed as `(n as Element).remove()`.
- **The harness blocked a foreground `sleep 40`**; replaced with polls.
- **check-tape-foot clause 1's plant stayed green** (the rail rule still matched). Made "every"; the plant string was later re-pointed after prettier re-wrapped the value.
- **The new inset row read 11.53/11.84 in webkit on the dist.** The first settle poll passed half a pixel short of rest. Its cause is WebKit snapping the risen sheet's top to a whole css px, which leaves the bottom ±0.2–0.5 off the viewport. The row is re-cut:
  - the pad is read against the sheet's bottom (≥ 12);
  - the sheet's rest against the viewport is its own ≤ 0.5 clause;
  - a 0.5rem-pad negative control is added in-run.
  - It is my own new row, not a frozen gate.
- **NEG-1 at the scroll end and the laid pose read `[]` for both predicates** (no discrimination). It now collects the unclipped rows across the hover pass itself.
- **Main-HEAD's first build failed**, since its archive lacked `csp-solver/data`. Re-run with a read-only symlink to main's `csp-solver`.
- **A scratch probe re-clicked the tab** after `open()` had opened the dock, closing it. The reading was discarded and retaken.
- **Scratch PW configs** lived in `web/frontend/.ctrl-tape/` only while running and are deleted. `git status` shows product files only. The ignored `playwright-report*`, `.vite-cache` and `dist` in the tree date from 09-18/19 (earlier passes) and were left alone.
- **Servers** were killed by recorded PID: 54339 (4230), 54340 (4231), 86944 (4232), 27278 (4233), plus the npx parents 54284, 54286, 86911 and 27249.
