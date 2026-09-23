# MOT-VERB · pass 5 prototype

Tree `.claude/worktrees/wf_f72f3b5a-83a-59`, the shared §13 tree. HEAD is `74a2b5d9`, LADDER's pass-5 delta is already in it, and I advanced in place. Nothing is committed. Served at 127.0.0.1:4247 (`index-DWMUHdQr1EaZ.js`). The two controls are `w7-control` 74a2b5d9 (`index-CubiZsMVSwTc.js`, :4248) and main-HEAD `042698e2` for the mark rows (:4249). All servers were killed by PID at return. The pass-5 number belongs to the critic.

## Gaps first

- **GB1, WebKit.** Every cold flip has 1–3 painted intervals over 34 ms (max 41–77 ms). Δscale reads 0.068–0.161 against the 0.08 target, over target in 4 of 6 cold reads. Chromium is inside the gates (0 intervals over 34 ms, max 15.8–24.8 ms, Δscale ≤0.046). The WebKit warm flip is 40–58 ms, against 27–45 ms for the control and main. That is arm A's standing price (INTAKE row 38).
- **GB3 is not ≤1/255.** Chromium reads Δ2 on 74 px (light) and on 21 px (dark). WebKit light reads Δ9: 138,977 px >1, 586 >4, 0 >16, ink −0.664 %. WebKit dark reads Δ2 on 2 px. Control-vs-control is 0 everywhere. The tolerance is the chair's number to rule.
- **The wordmark half is BLOCKED (row 37)** and keeps HEAD's theme-keyed bake. Each flip still pays 4 draws and 4 href swaps, against 8 and 8 on control/main, so GB2 reads 0 only for the grid.
- **Arm B (Opus GM-1/GM-3, the flight on the glass) is not built.** INTAKE rules it paper-only, while the charter row 8 said to build it; this is declared as a conflict. The one M19 arm built is the pinned leave. The `--deck-top` arm (Fable) versus the held card box (Opus) is not split into two arms.
- **Not built:**
  - GA3, the painted-frame recorder as an estate spec (CDP screencast / recordVideo).
  - GB6, the stall injector.
  - GA7, GA8 and GA9.
  - The raster union ±2 % during the fold (GB4).
  - Row 40 is therefore open. Every M19 number below is an rAF plus getBoundingClientRect read, not painted frames.
- **Unmeasured:**
  - Row 34: the held-wordmark softness crop, meaning the Δ between the mid-unfold crop and rest.
  - The poster exit (the 632 px cut, row 32) was not re-read.
  - Row 31's classic-scrollbar regime and the kenken non-zero deck index were not run.
  - Row 35 (the M16 escalation) was not triggered, because FACE's residue was not supplied to me.
- **`ink-rub-out` has no consumer on this tree.** NOTE-ERASE's co-landing is not here, and the alias is not retired.
- **The toggle beat table** is checked for serialization only. The live points are compared as strings, and no per-beat curve sampling was done.
- **No real Safari.** WebKit here means Playwright WebKit.
- **`src/probe/devicePaint.ts`** (W8's instrument, row 39) is not on 74a2b5d9, so its div-count re-cut is a W8 row.

## Numbers (after vs control on one payload, both engines)

Payload for every arm: `?board=ATMuMDM0NjA4OTEyNjAyMTk1MzQ4MTk4MzAyNTY3ODU5NzYxNDIzMDI2ODAzNzkxNzEzOTI0ODU2OTAxNTM3MjA0Mjg3NDE5NjM1MzA1Mjg2MTcw` (encodeSudoku). The readback is 81 givens identical in every arm, taken from the inputs' aria-label/value. The negative control `board=bogus` deals a different board.

| row | gate | tree | control / main | negative control |
|---|---|---|---|---|
| 1 | computed timing set-diff, playing | shared 66, one-sided 0/0, moved 42 (CURVE 39, LENGTH 1, anim 1, all 1) | ctl-vs-ctl 0 | — |
| 1 | same, gallery | shared 88, moved 52 (49/1/1/1) | ctl-vs-ctl 0 | — |
| 2 | fixed-t, generated from the diff | 49 grep reads = 48 terms + 1 comment; 37 declarations (24 RE-CURVE, 1 nudge, 12 re-name); terms 30/2/16; worst 0.8521 @ t=.40 (deck leave) | the three missing sites priced: GameGallery:1318 0.5425, sparkle 0.3706, laminate 0.0000 | joint length×curve 0.3545 (500→520), 0.3537 (240→250) |
| 3 | census keyed by scope | exit 0, 152 declared (108 global), 0 undefined | the pass-4 flat census reads 0 on PLANT B | PLANT B → exit 1 (`--critic-ghost-ms`); B′ at `:root` → 0; self-test 4/5/6a/6b fire |
| 4 | one `@property` block | lint:bands 0 | — | rise re-nested → exit 1 (B3 ×2); `--motion-note` deleted → exit 1 |
| 5 | lint:bands BARE | exit 0, B8 5→0, `MOTION_LADDER_B8_OWNED` deleted from ci.yml + the script | control: the script is absent (exit 1) | ease-in back → 1; linear back → 1; curve dropped → 1 (sha1-restored) |
| 6 | rule 9 keyed on shape | lint:verbs 0 | — | RED on the tree, PLANT G (token), PLANT G′ (site deleted → synthetic) |
| 7 | T9-B10 deck-leave, t=.40 | opacity 0.9337 `cubic-bezier(.32,0,.67,0)` | 0.0816 glassGlide | — |
| 7 | toggle live beats | wring/bloom/rise/out SAME both engines; tuck/star1–3 differ by serialization only (`ease-in`→`cubic-bezier(0.42,0,1,1)`) | — | — |
| 7 | bundle css+js | +6,644 raw / +1,979 gz | 32 → 33 files | — |

**M19, the fold.** Chromium + WebKit at 1280 fine (light and dark) and 390 coarse, after vs main. The control 74a2b5d9 has no exit glide at all (0 movers).

| gate | after chromium | after webkit | main |
|---|---|---|---|
| GA1 enter frame-1 centre | 0 / 0 | anchor residual 0.2–0.8 (raw 0–3.0) | 92.9 / 21.4; webkit 105–109 / 26–29 |
| GA2 visible fraction | 1.0 every frame | 1.0 | 0.234 / 0.47; webkit 0.28–0.54 |
| GA4 frames >34 ms, +0…+900 | 0 | 1 (parity with main) | 0 / 1 |
| GA4 encodes inside the fold | 0 (4 wordmark draws at +535…+546, after the 520 ms fold) | 0 (+537…+546) | 4 at +13…+37 (chromium), +29…+37 (webkit) |
| row 31 scrollWidth excess / scrollX | 0 / 0 | 0 / 0 | 0 |
| GA5 exit anchor | 0 / 0 | ~2.0 / 1.6 at 1280, 0.03 at 390 | 31–44 / 26–45 |
| GA6 card height | constant 407.9 / 357.8 | constant | min 104 / 101.6; webkit 132.7 / 130.3 |
| GA6 390 steps >20 px | 0 (max 4.1) | 0 (max 5.9) | 1 (135.2–135.5) |
| wordmark headSteps20 | 0 (travel 145.5) | 0 (145.8) | 1 |
| PRM | 0 movers both verbs | 0 | — |

Born-RED arms:
- The intake's `overflow: visible` lift gives scrollExcess 592 (1280) and 1213 (390) with scrollX 400, in both engines.
- With `--live-fit` unset (row 33), after is a same-frame cut (0 frames) while main glides (visMin 0.226).

The exit's raw frame-1 delta is 6–24 px. That is the first 8–16 ms of progress, since `holdFirstFrame` is confined to the fold per G-M4.

**M15, the cold flip (arm A, grid half).** Two rounds each, after / control / main interleaved.

| read | chromium after | chromium ctl/main | webkit after | webkit ctl/main |
|---|---|---|---|---|
| born (scale at the first frame) | 0.221–0.227 | 0.45–0.60 (1280), 0.26–0.30 (390) | 0.17–0.27 | 0.85–1.03 (1280), 0.39–0.42 (390) |
| max interval, cold | 15.8–24.8 ms | 108–134 ms (1280), 25–34 (390) | 41–77 ms | 243–362 (1280), 116–128 (390) |
| >34 ms, cold | 0 | 2 (1280) | 1–3 | 1–3 |
| draws / hrefs per cold flip | 4 / 4 (the wordmark only) | 8 / 8 | 4 / 4 | 8 / 8 |
| `.boil-frame-bitmap` style mutations | 0 | 0 | 0 | 0 |
| PRM max | 16.7–25.8 (one outlier 134.3) | main 100–108 | 49–61 every flip | main 243–249 cold / 33–45 warm |

**The estate on the served dist** (row 39, the spec estate re-cut in the same diff):

| spec | after | control |
|---|---|---|
| visual-regression | 24 passed | 6 failed: `.grid-ink` absent (structural) |
| visual-golden | 4 passed (darwin goldens not re-minted) | 4 failed: structural |
| theme-bake-freshness (throttle config) | 20 passed | 20 failed: structural |
| filter-census | 12 passed | — |
| drawer | 16 passed | — |
| gallery | 46 passed | 46 passed |

theme-bake-freshness's new no-re-mint assertion compares the whole pose stack. The first cut compared one active box, and since `is-active` follows the boil beat, it redded on after 20/20 through beat drift. The born-RED control rebuilt the tree with the theme token put back into the grid cacheKey and served it on :4245: 10/10 red on exactly "the grid re-minted its mask on a theme flip". The file was restored by cp and sha1-verified (cc7e8bbb).

**Gates.**
- vue-tsc -b 0. tsc e2e 0.
- Unit tests: 69 files / 837 tests (23/312 + 34/429 + 12/96), and shared re-run on the final tree 34/429.
- r6 law-probe identical on tree and control (6 GREEN, R1/R2/R3 RED).

**Pre-return battery, bare** (tree / control):

| gate | tree | control |
|---|---|---|
| lint:bands | 0 | 1 (script absent) |
| lint:verbs | 0 | 1 (script absent) |
| lint:theme-tokens, lint:motion, lint:copy, lint:lanes, lint:sleep, test:e2e:projects (check-pw-projects), eslint, lint:ink, lint:catch, lint:theme-sel, lint:live-regions, lint:tdz, lint:boundary, audit high | 0 each | 0 each |
| prettier --check | 0 | 0 |
| knip | 0 | 0 |

The first tree run read prettier 1 (check-motion-bands.mjs) and knip 1 (exported `FlipRunOptions`). Both were cured and the table was re-run.

## Crops (2 of ≤4; 67 KB)

- `t9-b10-deckleave-t040-after-left-control-right-chromium-light-1280x800-fine.png`: chromium · light · 1280×800 · fine. It retires pass-4 VERB's easy-vs-hard deck-leave pair. The board is one payload, the instant is t=.40, and the engine is one.
- `t9-m15-coldflip-head-top-armA-bottom-chromium-light2dark-1280x800-fine.png`: chromium · light→dark · 1280×800 · fine. It answers the intake's c1 and retires no pass-4 crop. The four instants look alike across the rows; the difference lives in the frame intervals above, not in a still.

## Replay route

In place, with no replay. The base is LADDER's bank (`pass5/prototype/MOT-LADDER/pass5-ladder.diff`, tree 56d78d71 on 74a2b5d9). My delta is `pass5-verb.diff`: 56d78d71 → 9a5475da, 16 files, +590/−172, 68,879 B, --binary. Applying it onto 56d78d71 in a temporary index reproduces 9a5475da. The tree vs HEAD is 55 files, +5,971/−283. The intake prototype's diff was hand-ported per file, not `git apply --3way`. Its logo A1 hunk (the in-SVG mask) was not replayed, per row 37.

## Incidents

1. **index.css reverted.** A plant cleanup ran `git checkout -- src/assets/index.css`, which reverted LADDER's hunk. It was restored from the index.css hunk in `pass5-ladder.diff` and verified tree-equal to 56d78d71 apart from my edit. Rule since then: restore by cp from backups only.
2. **Two orphaned concurrent m19 runs.** A `(…)&` inside a backgrounded job left them running. They were killed by PID and re-run clean.
3. **LADDER's given-set readback was vacuous.** `.board-cells` innerText is "", because the digits are SVG, so "equal 16/16" compared "" to "". Re-cut to the inputs' aria-label, with a negative control. Cross-lane finding.
4. **Quoted multi-path unit args found no tests.** Re-run unquoted.
5. **theme-bake-freshness ran under the wrong config.** It first ran under playwright.config.ts, where it is testIgnored ("No tests found"), then with a zsh-unsplit `set -- $a`, which produced an empty baseURL and stray log names. Those strays were deleted and the spec was re-run under playwright-throttle.config.ts.
6. **/tmp used once** for two scratch files, which were deleted.

## Ballots and chair rows

- **T9-B10** framed on one payload (crop 1, row 7's numbers).
- **T9-B22/B23:** arm A's price is WebKit warm 40–58 ms and PRM 49–61 ms every flip, against main's 33–45 warm. Crop 2 is the c1 frame.
- **T9-B21 and B23(b)** are unframed.
- **Chair rows:**
  - The GB3 tolerance.
  - The tag change `<image>` → `div.grid-ink` (G-M10).
  - The beyond-brief z-order deltas (row 30).
  - CR-1–CR-6 are reported, not edited.
- **No r0/R6 row moved.** Ruling 1's 520 is untouched, and 240→250 is proposed only.

## For the consumer lanes

The census copy is `instruments/undefined-token-census.copy.mjs`. Run it with `FE=<your web/frontend>`.
