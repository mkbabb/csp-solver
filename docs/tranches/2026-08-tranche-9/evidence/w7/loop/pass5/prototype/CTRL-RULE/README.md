# T9-W7 · pass 5 · PROTOTYPE · CTRL-RULE — the ruled page, advanced in place

Work tree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28`
(base `74a2b5d9`, **uncommitted**: 30 tracked files +1769/−1227, 3 untracked). Servers: lane dev `:4231`;
the shared `w7-control` dist on `:4232` (verified by `index-CubiZsMVSwTc.js`); this tree's BUILT dist on
`:4233` (final identity **`index-WZNIEzYskWke.js`**); T9-B13 arm (a) built from this tree + one patch on
`:4234` (**`index-sVSILZYMYago.js`**). All killed by recorded PID at return. Every π row names
`74a2b5d9`. Every pinned row deals ONE encoded board, `?board=ATMuNTMw…MDc5` (30 givens, param kept,
both arms).

## 0 · Replay route

**In place**, no replay. `git diff --stat` at start matched the pass-4 README (29 tracked + 3
untracked). `ConfirmRibbon.vue` was re-copied **byte-identical from CTRL-TAPE's pass-5 tree** (md5
`bd205599b931709dbf3d7f1908d591e0`, bare `var(--tap-floor)`), and TAPE's arming machine
(`useTwoTap` / `askingAct` / `CONFIRM_COPY` / `keepAsk`) replaced my `armGuard` by hand. No intake
diff was replayed: arm (a) of T9-B13 is my own one-variable patch on this tree
(`instruments/arm-a.T9-B13-closed-frame.diff`), applied to a copy for the build and reverted
(sha1 of both files checked equal to the pre-patch state, `RESTORE-OK`). INTAKE.md was present at
start. I did not bank `pass5.diff`; the chair banks it.

## 1 · Numbers first (final built dist `WZNIEzYskWke` unless stated; control = `74a2b5d9`)

| row | reading | charter |
|---|---|---|
| **the card never scrolls sideways** | `scrollWidth − clientWidth` **0** at all 11 cells × 2 engines (1024/1280/1440 fine, 1280 coarse, 390/430/375/320 coarse, 844×390, 812×375, 390×844 fine); control 0 except **64** at the 1280 coarse rail. e2e rows `zone-grammar:693` (three desk cells) + `:710` (coarse rail), each with its born-RED in the same test (`.deal-acts{flex-wrap:nowrap}`; the pass-4 margin grid + contained foot) | 1, INTAKE 29 |
| **the toggle owns no control** | toggle hit ∩ every interactive in the case **0 px²** at 11 cells × 2 engines; `viewport-law:287` (§2.4) **green both engines** (was 967.4 px²). `--toggle-foot` is derived from the tokens that draw the toggle (`head-rule + size/2 + hit × 0.54`, 0.54 = the hover's 1.08 bound): 172.16 at the desk. e2e `zone-grammar:731` with born-RED (`.control-panel-wrap{padding-top:0}`) | 2 |
| **§2.6 sticky names** | rail `size`/`level`/`new game` **1/1/1** at 1024/1280/1440 fine; drawer 375×667 `size` **0.9396** chromium / **0.9723** webkit, `level`/`new game` 1; 844×390 and 812×375: all **≥ 0.9326** chromium / **≥ 0.9441** webkit; no two-line name at any cell (`white-space: nowrap`, name spans rows 1–2); `viewport-law:581/:616` green both engines | 3 |
| **deal's question in its own row** | 390×844 light+dark, 320×568, 844×390, 812×375 × 2 engines: ∩ live controls **0** over the whole case, question in the verb's row (**gap 0**) at 3 scroll states, price Δ foot **0** / card **0** / verbs row **0**; born-RED in the same run: ∩ **1.0**, or gap **173.3** (390) / **12.1** (320); at landscape the ∩ born-RED reads 0 and the in-row clause reds it. 20/20 runs green | 4 |
| clear's question | the same five cells × 2 engines: ∩ **0**, born-RED **1.0**, price Δ **0**, press 2 clears 31 → 0 glyphs (the control's one-tap Clear on the same payload does the same) | 4 |
| COST's contract | keyboard arm → focus on `keep`; Escape at the document → the verb (`Clear the board` / `Deal a new board`), sheet open; lapse → question gone, board still dirty; 20/20 | 12 |
| **the lines' floor** | in-card clearance min **52.27** (desk) / **65.9–66.27** (phone) / **57.9** (390 fine), floor = the name's line-height 31.06; rule → BoilDivider **≥ 102.63** (was **15.10**: the `new game` group is `unruled` now); at scroll END the last line vs the foot's rule ≥ the floor. e2e `zone-grammar:798` with born-RED (a rule cloned 13.48 above the divider) | 5 |
| **the destructive flake** | 320×568: **0/20** runs per engine on this dist (60 arms per engine), 0 fired unarmed; plus 0/20 per engine on the previous dist. Rule of three over 120 arms per engine: ≤ **2.5 %** per arm. Mechanism not named (the machine it ran on, `armGuard`, is deleted) | 6 |
| the iPad seal (`visual-regression:809`) | **restored to the control's stamp 1227.5**, the pass-4 restamp reverted; this tree reads **1149.66 / 1149.55** (control 1227.09), teeth clause **67.18** (control 67.19): the row measures the same seam cost and is green both engines | 7 |
| **the content-view price** | card `clientHeight`, proto / control: 1024 **501/576** · 1280 **532/608** · 1440 **564/640** · 1280 coarse **532/608** · 390c **540/628** · 430c **615/675** · 375c **363/451** · 320c **264/352** · 844×390 **224/302** · 812×375 **209/287** · 390 fine **544/595**. Foot **75.48 / 76.02 / 76.36** desk, **77.97** dock, **74.14** 390 fine (published unrounded). The control's figure includes its sticky bar painting over the scrollport; mine does not. The publisher comment in `GameControlPanel.vue` is re-worded from these numbers | 8 |
| R3 re-cut (PROPOSED) | break test (`readings/r3-breaks.txt`): the chair's R3 stays **GREEN with the bar's rule deleted** (Clear's `HandDrawnOutline` face sits in the 1,200-char window); the PROPOSED re-cut (the bar's first child or its wrapper, either house-hand component, comments stripped) reds on deletion and on a commented rule, greens on arm (a) and arm (b), reds on the control | 9 |
| **the foot on the inset** | CDP `Emulation.setSafeAreaInsetsOverride` (chromium): inset 34 → `padding-bottom` **34px**; inset 0 → **2.4px**. The control reads 2.4px under inset 34 (its foot never takes it; born-RED). e2e `zone-grammar:821` (the source regex both engines + the chromium computed arm, both directions) | 10 |
| lowest ink above the viewport's bottom | 390×844 and 430×932 at DPR 2 and 3, both themes, both engines: **3.0–3.5 css** (pad 2.4); arm (a) **4.33–4.67** (pad 12) | INTAKE 28 |
| the rule's 1.4.11 (painted) | foot rule, per column vs the paper it sits on: **3.530 light / 4.364 dark** worst = p10 = median, **0 %** of columns under 3:1 at 1280 fine and 390 coarse, both engines. The page's rules (`rule-arms.mjs`, 7 rules × 4 phases): 3 px rest **3.53 / 4.364**, forced worst **3.304** chromium light / **4.070** chromium dark / **3.53** / **4.364** webkit, 0 % under 3:1 | 16, B13 |
| σ floor | 3 px σ min **0.724** webkit dark / **0.725** webkit light / **0.732** chromium vs the band's 0.722 (margin **0.002**); the 2.5 px arm reads **0.720** (outside) | 14 |
| **π on the unclaimed surfaces** | desk 1024/1280/1440 light and 1280 dark, both engines: masthead, wordmark, tab, board, grid, toggle, case **Δ 0.00**, paint and tag identical, noise (control vs control) 0. The card is −75.5 to −76.4 tall (the foot left it; claimed). 390×844 coarse: tab and case **+9.61 / +10.00** (the pass-3 declared move). **1280×800 coarse: −35.19 on masthead, wordmark, tab, board and grid; case +70.38 wide** (gap 2) | π |
| hue census | `index.css` on this tree = control, byte-identical output | 15 |
| R6 law probe (copy) | L1–L6 **GREEN** both trees; R1/R2 born-RED both; R3 GREEN here (the fooled window), RED on the control | 15 |
| filter census, theme-bake, theme-quadrants, wordmark-webkit, throttled-void | `playwright-throttle.config.ts` on the built dist: **67/67** lane, **67/67** control | — |
| goldens | **4/4** lane, **4/4** control | — |
| unit | **68 files / 831 tests, 0 failed** (games 57/742, pencil 8/73, composables 3/16; `src/lib`, `src/assets`, `scripts` exit 1 on "No test files found") | — |

## 2 · Gaps, every one

1. **390×844 FINE: the case crosses the masthead by 26.91 px** (the wordmark's box by 19.91) in
   chromium, **26.2 (19.8)** in webkit; control **3.69 (−3.31)** / **3.2 (−3.2)**. Worse than pass 4's
   10.86. Mechanism: the foot left the scroll content, so the case is the card's content (scrollHeight
   587) plus the foot (74.14) = 661, over the sheet's cap (618.39 = 844 − 225.61), and the case rides
   the cap in BOTH regimes. The control's fine case was content-sized (595). At 390 coarse this tree
   CLEARS the masthead (−3.88 / −4.58; control 5.73 / 5.42). The cap is the leader's `--sheet-chrome`;
   reported, not tuned (charter row 11). `readings/p5-masthead-*.json`.
2. **The coarse rail (1280×800 hasTouch) breaks π on unclaimed surfaces.** Masthead, wordmark, tab,
   board and grid move **−35.19 px** in x, both engines; the case is **+70.38** wide (224 → 294.38; card
   `clientWidth` 218 → 288). Cause: at coarse the foot is uncontained (`contain: inline-size` is
   fine-pointer only now), so the bar's four 60 px verbs are the case's ruler. The control's card
   scrolled sideways by 64 px there; mine scrolls 0. Holding the case at 224 and wrapping the bar is the
   alternative; it isn't built.
3. **The coarse rail's names don't pin.** In the rail's stacked layout the name is `position: static`
   (sticky 0 at 1280 coarse): a declared M03 loss at that one regime. §2.6 does not census it.
4. **Mid-scroll, an in-card line passes under the foot's rule.** The minimum over three scroll states
   reads rule → foot **−0.08 to −2.46** and, at the coarse cells, BoilDivider → foot **0.47–2.5**
   (**−0.45** webkit 1280 coarse). The scrollport clips the line as it passes; the gate reads scroll
   END only.
5. **T9-M12's membership: Fill and Solve still act on one tap.** The machine is TAPE's, but its
   membership here is deal + clear. Fill writes **50–56** cells on one tap on this tree over three runs
   (control **49–52**); Solve reads 0 here and **0 then 54** on the control across two runs (timing-dependent at
   the instrument's 1.2 s). TAPE's tree carries four verbs.
6. **T9-M16's foot arm is not re-read.** FACE's crib homes, G1–G5 on this foot: not measured.
7. **The `.info-btn` ring against the new drawn edge is not re-read** (MRK-ABS's 2.61 / 2.42).
8. **`@property` clause 3 is AMBER** on the two registrations this pass adds (`--toggle-foot`,
   `--card-head-clear`, `initial-value: 0px`, marked PROPOSED for the leader's block). The 0px state is
   born-RED by `zone-grammar:731` (its control is `padding-top: 0`), but `initial-value: 0px`
   still spells the struck `, 0px`. The leader's row.
9. **σ margin 0.002** (gap 1.10 of the pass-4 record, unchanged; the 2.5 px arm falls outside).
10. **INTAKE row 28's second clause is not met on the file.** `scene.css:572`
    `top: var(--vv-height, 100dvh)` is a measured token with a fallback, inherited from `74a2b5d9`
    (`:473`) and outside this lane's surface. `--action-bar-h, 0px` is dead (static `2rem`).
11. **The foot's pad clears by 1.0.** The lowest ink sits 3.0 css above the edge at 430×932 against the
    ≥ 2 floor.
12. **The flake is bounded, not named** (≤ 2.5 % per arm).
13. **`visual-regression:570` is re-aimed in the lane's spec (MOVED):** the critic rules it (§5).
14. **Card view:** the page is 75–88 px shorter than the control's card at every cell. The control's
    figure is overpainted by its sticky bar, so the two aren't the same quantity. The honest comparison
    is the case minus the foot, and I didn't tabulate it.
15. **The seal's headroom:** the row holds at 1227.5, but this tree sits 77.8 under it. The ceiling
    wouldn't see a +77 px regression on this tree.

## 3 · The charter's rows 1–16

| # | state | the number |
|---|---|---|
| 1 | CLOSED | overflow 0 at 11 cells × 2 engines; e2e :693/:710 with controls |
| 2 | CLOSED | 0 px² at 11 cells; §2.4 green both engines; `--toggle-foot` derived (App.vue) and consumed (`--card-head-clear`) |
| 3 | CLOSED at desk, drawer, landscape; OPEN at the coarse rail (gap 3) | ≥ 0.9326 everywhere §2.6 reads |
| 4 | CLOSED: the question berths in deal's own row | gap 0, ∩ 0, born-RED 173.3 / 12.1 |
| 5 | CLOSED at rest and scroll end; mid-scroll OPEN (gap 4) | ≥ 52.27 in-card, ≥ 102.63 to the divider |
| 6 | BOUNDED | 0/120 arms per engine |
| 7 | CLOSED: the seal restored, not re-cut | 1149.66 ≤ 1227.5; teeth 67.18 vs 67.19 |
| 8 | CLOSED | table §1; the comment re-worded |
| 9 | PROPOSED (the chair's row) | break test, 5 cases |
| 10 | CLOSED (estate rows); the RUNSHEET line PROPOSED: *"iPhone with a home indicator, sheet open: the foot's lowest ink sits above the indicator's inset, and the verbs are reachable without the indicator's swipe firing."* | CDP 34 → 34px, 0 → 2.4px |
| 11 | REPORTED, worse (gap 1) | 26.91 / 26.2 vs control 3.69 / 3.2 |
| 12 | ONE MECHANISM (TAPE's), membership open (gap 5) | ribbon md5 = TAPE's |
| 13 | AMBER, cited (gap 8) | — |
| 14 | REPORTED (gap 9) | 0.724 vs 0.722 |
| 15 | RUN | hue identical; R7 I2/I4 run and re-aimed (§5); webkit on all 12 touched spec files 103/0 |
| 16 | M18 FRAMED both arms (§4); the `.info-btn` ring and M16's foot arm OPEN (gaps 6, 7) | AA 3.53 / 4.364 (b), 17.78 / 14.31 (a) |

INTAKE row 27 (B13 arm (b) framed): **CLOSED**, two frames on disk (f1, f2). Row 28: **the pad clause
CLOSED** (≥ 3.0 ≥ 2 at 8 cells × 2 engines), **the fallback clause OPEN** (gap 10). Row 29: **CLOSED**
(0 at 1024/1280/1440 fine and 1280 coarse, both engines, e2e rows with controls).

## 4 · Ballots for the owner (one payload, one variable per pair)

- **T9-B13, M18's form.** (a) DEFAULT: a closed `HandDrawnOutline` 1.5 / outset 4 / radius 3 / pose 0
  round the bar, with the 0.75rem foot pad its bottom stroke needs (the pad belongs to the arm, so it
  isn't a second variable). (b) This tree: one drawn top rule (`RuledLine`, 3 px, `--ink-press-rule`).
  Painted AA vs the paper: (b) **3.530 L / 4.364 D**, (a) **17.78 / 17.61 L / 14.31 D** (the frame is
  drawn in full ink), 0 % of columns under 3:1 in both. Lowest ink: (b) 3.0–3.5, (a) 4.33–4.67. Foot pad:
  (b) 2.4px, (a) 12px. Frames: `f1` (chromium · light · 1280×800 · fine · scroll end) and `f2` (webkit ·
  light · 390×844 · coarse · scroll end), left (b), right (a).
- **The rule's weight, 3 px (shipped) vs 2 px.** 2 px: rest worst **3.347** chromium light, forced
  worst **2.338** (73 % of columns under 3:1 at the worst phase), σ min 0.723. 3 px: rest **3.53**,
  forced **3.304**, 0 % under 3:1, σ min 0.724. Frame `f3` (chromium · light · 390×844 · coarse · rest):
  left 3 px, right 2 px.
- **Deal's question.** No longer a fork: it berths in deal's own row (`f4`, webkit · dark · 390×844 ·
  coarse · armed on a dirty board). The "remote question" arm survives only as the born-RED control
  (pass-3 placement CSS plus a DOM move of the ribbon into the foot: gap 173.3 px). There's no second
  frame, because that arm isn't a design anyone ships.

## 5 · r0/R6 rows MOVED (PROPOSED diffs, never applied to r0)

- **r0 R3** (the chair's pass-5 re-cut): cannot fail on a tree whose verbs wear drawn faces.
  `instruments/law-probe.R3.PROPOSED.diff` + `law-probe.R3.proposed.mjs`; break test in `readings/r3-breaks.txt`.
- **r0 R7 I2** (the bar buries no group): reads `.tray-well` only. On the ruled page that's 0 groups, so
  its coverage clause greens by vacuity. PROPOSED (`instruments/owners-eye.I2-I4.PROPOSED.diff`): groups
  are `.tray-well, .ruled-group`, each **clipped to the card's scrollport** first (TAPE's critic's
  graft; unclipped, the re-aim read 52.2 % on `checking`, a group scrolled past the scrollport's
  bottom edge). Reads: this tree **GREEN 0.0 %**, control **RED 88.9 %** (`players`).
- **r0 R7 I4** (every destructive verb asks): its "armed" test reads pass 3's `.icon-sublabel.is-armed`,
  so every ribbon ask reads `armed=false`. PROPOSED: armed = that OR a `.confirm-ribbon` on the page.
  Reads: Deal / Clear **armed, 0 written** both trees; Fill **50–56** here / **49–52** control over three runs each; Solve timing-dependent.
- **r0 R7 I1 / I3** name `.section-heading`, `.tray-well .washi-tag` and `.zone-row-label`, none of
  which exist on the ruled page: I1 reads "0 voices" (RED), I3 greens by vacuity. They aren't re-aimed
  here. They're M03 / M05, which aren't this lane's marks.
- **`visual-regression:570`** (the deal receipt keeps off the verb): re-aimed in the lane's spec. When
  the receipt wraps under the die, "one axis" is the two left edges (the page's spine), not a shared
  centre. Its born-RED control is re-spelled for the wrapping row
  (`.deal-acts > .difficulty-tally { margin-left: -48px; margin-top: -30px }`). Green both engines.
- **`visual-regression:809`**: NOT moved; restored to the control's stamp.
- **R6 L3**: GREEN both trees, no change.

## 6 · The pre-return battery (each bare; lane | control)

| gate | lane | control |
|---|---|---|
| e2e, the 12 whole spec files this tree touches (`access affordances font-census futoshiki join-language mobile-affordances permalink share-truth sudoku-interaction viewport-law visual-regression zone-grammar`), built dist | chromium **exit 0** 105 passed · webkit **exit 0** 103 passed, 2 skipped | chromium **exit 0** 96 · webkit **exit 0** 95, 1 skipped |
| `playwright-throttle.config.ts` (census, bake, quadrants, wordmark, void) | **0** (67) | **0** (67) |
| `playwright-golden.config.ts` | **0** (4) | **0** (4) |
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · 0 · 0 | 0 · 0 · 0 |
| test:e2e:projects · check-pw-projects | 0 (565 tests) · 0 | 0 (547) · 0 |
| `eslint .` · boundary | 0 · 0 | 0 · 0 |
| `prettier --check` (src, scripts, ../../scripts, ../relay) | **0** (first read 1 on `App.vue`, whitespace only; `--write` on that file) | 0 |
| copy-register (0 unadmitted, 0 admitted) · lint:copy | 0 · 0 | 0 · 0 |
| motion · ink · catch · theme-selectors · live-regions · tdz | 0 each | 0 each |
| font-coverage | 0 | 0 |
| knip | 0 | 0 |
| vue-tsc -b · typecheck:e2e · typecheck:node | 0 · 0 · 0 | — |

The dist predates `prettier --write` on `App.vue`, which changed only whitespace in one declaration.

## 7 · Incidents

1. The first coarse-rail block sat BEFORE the base rules and lost on order: stacked names stayed sticky
   over the chips. It moved to the end of the style block, with `position: static`.
2. The coarse-rail born-RED didn't red at first. The control needed the pass-4 foot containment too.
3. `check-font-coverage` exited 1 after the machine port (its extractor read `armGuard({ ask, verb })`).
   It now reads `CONFIRM_COPY`.
4. `prettier` went red twice (`GameControlPanel.vue` + one, later `App.vue`). `--write` on src only
   (e2e/ is prettier-ignored).
5. On the first dist, `viewport-law:287` was red in both engines: the derived foot missed the toggle's
   hover scale (W2's census reads the box hovered). The 0.54 factor fixed it. `visual-regression:570`
   was red too (axis 1.17 once the receipt wrapped). Re-aimed (§5). The dist was rebuilt and both are
   green.
6. **My own foot-rule instrument, first cut, was wrong twice.** Its ground strip sat 4 css under the
   rule and at 390 wide landed on the verbs' grey frames: 23.1 % of webkit's columns read under 3:1,
   worst 1.888. Its arm-(a) band started at the svg's top while the path rises 2.5 css above it: worst
   1.0. Both are re-cut in `p5-foot-rule.mjs` with the reason in its header. The corrected read prints
   the ground's luminance range, `[0.982, 0.982]` light and `[0.006, 0.006]` dark, so the ground is the
   paper.
7. The PROPOSED I2's first cut had no scrollport clip and read 52.2 % (§5).
8. Moving `.ctrl-rule/` during a build restarted the dev server (Tailwind scans untracked files). It
   recovered. Every build now parks the scratch outside the tree.
9. A unit assertion expected a rule under `new game`, which is unruled now. The test was updated.
10. I4's Solve column is timing-dependent (the control read 0, then 54).

## 8 · Frames (4, 58,872 B; each replaces a pass-4 crop by the name `pass4/SWEEP.md` lists)

| frame | engine · theme · viewport · pointer | retires |
|---|---|---|
| `frames/f1-b13-form-rule-vs-frame-chromium-light-1280x800-fine-scrollend.png` (18,064 B) | chromium · light · 1280×800 · fine | `prototype/CTRL-RULE/frames/f3-rail-pinned-1280x800-light-fine-chromium.png` |
| `frames/f2-b13-form-rule-vs-frame-webkit-light-390x844-coarse-scrollend.png` (16,988 B) | webkit · light · 390×844 · coarse (hasTouch, witnessed) | `prototype/CTRL-RULE/frames/f4-foot-rest-390x844-light-coarse-webkit.png` |
| `frames/f3-rule-weight-3px-vs-2px-chromium-light-390x844-coarse-rest.png` (15,640 B) | chromium · light · 390×844 · coarse | `prototype/CTRL-RULE/frames/f1-confirm-armed-390x844-light-coarse-chromium.png` |
| `frames/f4-deal-asks-in-its-row-webkit-dark-390x844-coarse-armed.png` (8,180 B) | webkit · dark · 390×844 · coarse | `prototype/CTRL-RULE/frames/f2-confirm-armed-390x844-dark-coarse-webkit.png` |

The critique's `critique/CTRL-RULE/frames/c1-card-hscroll-1280x800-light-fine-webkit.png` is retired
by a number (overflow 0), not a frame.

## 9 · Instruments (`instruments/`; each prints the numbers above)

`p5-geom.mjs` (rows 1, 2, 3, 5, 8) · `pi-width.mjs` (π, control-vs-control noise) · `ribbon-case.mjs`
(`VERB=deal|clear`; rows 4, 12) · `p5-flake.mjs` (row 6) · `p5-foot-ink.mjs` (row 10, INTAKE 28) ·
`p5-foot-rule.mjs` (B13 AA) · `rule-arms.mjs` (the rule's weight, σ) · `p5-masthead.mjs` (row 11) ·
`p5-frames.mjs` · `law-probe.copy.mjs` + `law-probe.R3.proposed.mjs` · `hue-census.copy.mjs` ·
`owners-eye.copy.mjs` + `owners-eye.I2-I4.PROPOSED.mjs` · `arm-a.T9-B13-closed-frame.diff` ·
`foot-tokens.mjs`, `page-geometry.mjs` (pass-4 copies, kept for the critic).
