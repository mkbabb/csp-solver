# Pass 9 · ACC-GRAPHITE · the band on the union

Opus lane, 2026-10-08 18:44–. Tree `.claude/worktrees/wf_f72f3b5a-83a-40` advanced in place on `74a2b5d9` (no commit). Lane port 4235, control port 4254. Every number below is the lane's own; the number of record is the critic's (LAWS P8 §C).

## 0 · Numbers first

**Row 1 (the batch gate) is MET.** The on-WAVE delta is cut, applies 0 on the union, and the band reads inside [1.35, 1.45] at all five rigs, both engines, on the union, under the re-stamped statistic (A.1 top/bottom over the whole frame as painted, CHAIR §2).

| Rig (board, device px) | chromium t/b | webkit t/b | HEAD control t/b cr / wk |
|---|---|---|---|
| desk 1280×800 (636) | 1.377 | 1.426 | 0.545 / 0.543 RED |
| phone 393×699 coarse (365) | 1.392 | 1.371 | 0.521 / 0.229 RED |
| tablet 768×1024 coarse (668) | 1.386 | 1.381 | 0.528 / 0.531 RED |
| tablet 1024×768 coarse (604) | 1.430 | 1.434 | 0.580 / 0.568 RED |
| laptop 1280×800 coarse (636) | 1.377 | 1.426 | 0.545 / 0.543 RED |

- The tree is `74a2b5d9` + `pass8/integrate/WAVE.diff` (`acb9c08e`) + `pass9/instruments/homes.on-WAVE.diff` (`acde977b`) + this lane's `pass9.delta.on-WAVE.diff`, served as `index-D9D8GeClGw57.js` on :4235. The control is `w7-control` (`index-CubiZsMVSwTc.js`) on :4254.
- `bandc.crit.ts` (sha1 `f256121a`, the pass-7 critic's copy of the stamp), `GATE=1 STAT=tb`, DPR 1, light, PRM reduce, payload `mintBoard(3, 30)`. Exit 0 in chromium and in webkit (5/5 each). Load 29–34 (1-min) through both runs.
- Range 1.371–1.434. Margins: 0.021 below (webkit phone), 0.016 above (webkit 1024×768). The perimeter statistic on the same bytes reads 1.376–1.432 and the l/r statistic 1.380–1.430. The frame is whole on all four sides (svg-edge touch t/b 0 on the tree; 1 on the control).
- These match pass 8's reads on `d49b0ea4` to ±0.004 at every cell: the union carries the same frame (VERB's `FRAME_Y_PAD = FRAME_X_PAD`).
- Raw lines: `readings/row1-union-band.txt`.

## 1 · The on-WAVE delta: what GRAPHITE lands on the union, and what it does not

The cumulative tree diff (minus the 13 home paths) 3-way applied onto `acde977b` with conflicts in 10 files. Every collision with a §3 default the union already ships was resolved to the union (LAWS P8 §G: a shipped default does not move; CHAIR §1: ACC-SIX leads §3, the union keeps the gold). What GRAPHITE lands is its registry sentence, the band:

| File | On the union | Why |
|---|---|---|
| `DigitCell.vue` | the retrace `<path class="cell-ghost-retrace">` + `ghostRetracePath`, the focus comment | the band's second pass |
| `useGameCell.ts` | `ghostRetracePath` from `generateCellRetraceRects` | the same |
| `gridPaths.ts` | `RETRACE_INSET`, `generateCellRetraceRects`, `reverseLinearPath` grafted after `generateCellRects` | the union's file otherwise whole (FIVE's primitive, VERB's frame) |
| `gameCell.css` | `.cell-ghost-retrace`, the tier-2 focus ring as one graphite band (12 + 15, no fill), the invalid-and-focused pair, the PRM line, `[data-raster="small"]` at 12 | the band |
| `GameBoard.vue` + `boardRaster.ts` (+ test) | the span key, `data-raster` on `.board-wrapper` beside the union's `boardVars` | the band's raster key |
| `index.css` | `--color-focus-sketch` folded into `--ring-ink: #3a7bc4` (same hex) | the board stopped reading the alias, so `lint:theme-tokens` named it DEAD on the union (§6) |
| `GameControlPanel.vue` | one comment line that named `--color-focus-sketch` | the same fold |
| `scripts/check-motion-bands.mjs` | one MOVED row (`ghost-draw-on`, 180 ms, the tier-2 selector gained the retrace) | B6's ratchet keys on the selector (§6) |

Not carried, each declared (the union's bytes stand):

- **The graphite pen arm** — `--color-user-ink: var(--color-pencil-graphite)`, `selfInk`/`F1_SELF_INK` in `useSession.ts`, the roster and multiplayer-spec comments, the user-marks recolour, the clue-weight step (`HandwrittenGlyph.vue` 6 vs 4.5 and its test). The union ships SIX's crayon-blue ink tier `#026FC4`.
- **The palette moves** — `--color-crayon-blue` retired, the progress ink retired, a second contrast:more wash arm. `index.css` keeps the union's bytes except the ring-ink fold above; `check-theme-tokens.mjs`'s RETIRED row for crayon-blue would red a union that keeps it.
- **The tally** — `tallyPaths`, the tally's HandDrawnGrid wiring, `gridPaths.tally.test.ts`, the `progress`/`writable` props. The union ships FIVE/SIX's gold retrace gauge on `filled`/`fillable` (SIX's prop contract), driven by FIVE's front primitive, which no lane rides by sha until FIVE's pass-9 row 1 lands (CHAIR §6). `HandDrawnGrid.vue` and `gridPaths.poseFronts.test.ts` take the union's bytes.
- **The sparkle** — GRAPHITE deletes the Solve sparkle's drop-shadow (census 9 → 8); the union ships SIX's gold glow. `filterBudget.ts` and the sparkle rule take the union's bytes, so GRAPHITE adds no filter row on the union (the filter census itself was not run, §7).
- **`pencilConfig.ts`** — the union already declares `MOTION.hand` (FIVE's); this tree's copy would duplicate the key.
- **`check-ink-pressure.mjs`** — the union's own gate already exits 0 on homes v2 (instruments README); this lane's consumer cure (§3) is a 74a2b5d9-tree change only.
- **`.prettierignore`, `eslint.config.js`** — they named the pass-7 fork `scripts/lib/shape-census.mjs`, which no longer exists; stripped from both banks as residual home edits.

The cost of that choice: on the union GRAPHITE is the band only. Its pen, tally and sparkle arms stay on the 74a2b5d9 tree and in `pass9.diff`, and land only if the owner's §3 ballots take them.

## 2 · Rows 2, 3 and the raster unit row (the 74a2b5d9 tree; the unit row on both)

| Row | Born-RED / negative (same run) | After | Control |
|---|---|---|---|
| R2 `lint:ink` (homes v2's `publisher-split`, GRAPHITE's own clause folded by the chair) | `SHAPE_SABOTAGE=publisher-split`: 28 violations, exit 1; homes v2 alone on the pass-8 consumer: 28, exit 1 | consumer routed through `publishers()` with `unresolvedSites()` printed UNRESOLVED (14 sites, e.g. `persistence.ts:275`): exit 0 | base `74a2b5d9`: 0 · union: 0 · union control: 0 |
| R3 `gridPaths.tally.test.ts` MOVED 56 → 55 (the banked PROPOSED re-key, applied) | before: 3 failed / 3 passed, exit 1 | 6/6, exit 0; `src/pencil` 102/102 (was 99/102) | the tally is not on the base or the union |
| R4 unit: `boardRaster.test.ts` (new, the span key's predicate extracted to `boardRaster.ts`, GameBoard consumes it) | clause sabotage 6/6 RED: `<`→`<=` · width guard deleted · dpr factor deleted · dpr guard deleted · bound 481 · bound 479 | 4/4, exit 0, tree and union | none on the base |

- Two of the six raster plants landed vacuous on the first try (a shell escape left the file unchanged; exit 0 on unchanged bytes). Re-run from literal strings with a did-it-land check: both RED. Declared.
- The raster sabotage ran before a prettier re-format of `boardRaster.ts` (line breaks only); re-run on the final bytes is in §6.
- **The union's verbs gate caught GRAPHITE.** `lint:verbs` read 1 on the union with the delta and 0 on the union control: the retrace rule typed a third, unadmitted `ghost-draw-on 180ms`. Cured with no new spend: the tier-2 focus rule's selector takes the retrace too (one declaration paints and spends for both passes), and the retrace's own rule only shows it and widens it to 15. `lint:verbs` 0 after, on the union. The same edit is on the 74a2b5d9 tree, where `lint:verbs` does not exist.

## 3 · The band's plants on the union (tree arm only, injected CSS, `GATE=1`, t/b)

| Plant | chromium desk / phone / tablet | webkit desk / phone / tablet | Exit cr / wk |
|---|---|---|---|
| second pass removed | 0.728 / 0.841 / 0.761 | 0.761 / 0.818 / 0.769 | 1 / 1 |
| second pass at 20 units | 1.536 / 1.671 / 1.550 | 1.588 / 1.633 / 1.550 | 1 / 1 |
| the pointer key put back | 1.377 / 1.392 / **1.290** | (exit 1, tablet RED) | 1 / 1 |
| re-clip on `svg.hand-drawn-grid` (the pass-8 site) | 1.377 / 1.392 / 1.386 | 1.426 / 1.371 / 1.381 | **0 / 0 — VACUOUS on the union** |
| re-clip on `.grid-ink, svg.hand-drawn-grid` | 2.307 / 2.317 / 2.786 | 2.992 / 2.718 / … | 1 / 1 |
| X6, the ring with no sides (`.cell-ghost{clip-path:inset(0 22% 0 22%)}`) | 1.377 / 1.392 / 1.386 | 1.426 / 1.371 / 1.381 | **0 / 0** |

- **The pass-8 re-clip plant does not land on the union.** The union paints the frame through T9-M15's `.grid-ink` mask layers, outside the svg; the plant reads identical to clean to the thousandth. Re-sited to the layer that paints, it reds by 0.9–1.5. Any band plant cut on the 74a2b5d9 tree must be re-sited before it is read on the union.
- **X6 stays invisible to G2** (gap 7): G2 reads the ring's top and bottom only. The four-band graft through `./lib/edge-bands.mjs` is not landed this pass (§7).
- **Threshold sabotage** (the window copied with env bounds, `bandw.crit.ts`): low 1.370 passes / 1.372 reds (webkit phone 1.371); high 1.435 passes / 1.433 reds (webkit 1024×768 1.434). Margins 0.021 and 0.016.

## 4 · Rows 5 and 6 on the union (five rigs, `GATE=1`, t/b)

| Regime | chromium desk / phone / tablet / 1024×768 / laptop-coarse | webkit (same order) | Exit cr / wk |
|---|---|---|---|
| light · reduce (row 1) | 1.377 / 1.392 / 1.386 / 1.430 / 1.377 | 1.426 / 1.371 / 1.381 / 1.434 / 1.426 | 0 / 0 |
| dark · reduce | 1.378 / 1.399 / 1.386 / 1.432 / 1.378 | 1.429 / 1.373 / 1.381 / 1.435 / 1.429 | 0 / 0 |
| light · no-preference motion | 1.367 / 1.358 / 1.389 / 1.431 / 1.367 | 1.422 / 1.366 / 1.383 / 1.434 / 1.417 | 0 / 0 |
| light · contrast more | 1.377 / 1.392 / 1.386 / 1.430 / 1.377 | 1.426 / 1.371 / 1.381 / 1.434 / 1.426 | 0 / 0 |
| dark · contrast more | 1.378 / 1.399 / 1.386 / 1.432 / 1.378 | 1.429 / 1.373 / 1.381 / 1.435 / 1.429 | 0 / 0 |
| **16×16** light · reduce | 1.419 / **1.622** / 1.406 / 1.447 / 1.419 | 1.440 / **1.647** / 1.411 / **1.453** / 1.440 | 1 / 1 |
| **16×16** dark · reduce | 1.421 / **1.635** / 1.408 / 1.449 / 1.421 | 1.441 / **1.653** / 1.413 / **1.453** / 1.441 | 1 / 1 |

- Each run printed its regime from the page (`.dark` on `<html>`, `matchMedia` for contrast and motion, 81 or 256 cells) on both arms. Dark reads `255 − luma` (the stamp assumes dark ink on light paper); that inversion is this lane's, declared.
- **9×9 holds in every regime, both engines.** Contrast more changes nothing on the band (the ring declares no contrast arm); dark moves it by ≤ 0.007.
- **16×16 reds at the phone in both engines (1.62–1.65) and at 1024×768 in webkit (1.453).** Both sides of the phone ring read thick (top 7.85, bottom 6.65 px; 9×9: 5.80 / 5.69), so a one-sided grid-line fusion does not explain it. Cause unread. The 16×16 band is not met.
- **Row 5, 812×375 coarse (347 dpx): chromium 1.349 RED by 0.001**, webkit 1.390. Pass 8 read 1.346. Not cured; it is the same `small` arm (12 units) as the phone, and it sits on the floor.

## 5 · Row 4: the span key's cliff, named and moved (480 → 375 device px)

Boards between 366 and 603 dpx had never been read. Thirteen spans, each with the second pass forced by injected CSS (report rows, no gate), t/b, light, DPR 1, fine pointer, viewports `w(span+28)×1000`:

| Span (dpx) | 12 units cr / wk | 13.5 units cr / wk | 15 units cr / wk |
|---|---|---|---|
| 365 | 1.392 / 1.371 | 1.427 / 1.407 | **1.498 / 1.467** |
| 380 | **1.349** / 1.354 | 1.392 / 1.390 | 1.426 / 1.420 |
| 390 | **1.310** / 1.352 | **1.348** / 1.380 | 1.383 / 1.421 |
| 400 | **1.317 / 1.329** | — | 1.414 / 1.416 |
| 430 | **1.300 / 1.281** | 1.378 / **1.332** | 1.411 / 1.412 |
| 440 | **1.312 / 1.292** | 1.387 / 1.369 | 1.424 / 1.417 |
| 450 | 1.386 / **1.342** | 1.429 / 1.388 | **1.457** / 1.417 |
| 460 | 1.360 / **1.312** | 1.395 / **1.344** | 1.423 / 1.386 |
| 470 | **1.307 / 1.308** | — | 1.406 / 1.406 |
| 490 | **1.324 / 1.318** | — | 1.442 / 1.443 |
| 520 | **1.343 / 1.347** | — | 1.411 / 1.441 |
| 560 | **1.265 / 1.271** | — | 1.397 / 1.392 |

- **The pass-8 key was wrong for 375–479.** At 480 every board from 380 to 479 took 12 units, which reds at 400, 430, 440 and 470 in both engines (the tree as banked read 400 / 450 / 470 at 1.317 / 1.386 / 1.307 chromium, 1.329 / 1.342 / 1.308 webkit, `GATE=1` exit 1 both).
- **The cliff is between 365 and 380.** 12 holds at 365 and fails above; 15 fails at 365 and holds from 380, in both engines, at every span read but one: **chromium 450 reads 1.457 (RED by 0.007).** 13.5 is no better (reds at 390 cr, 430 and 460 wk). The ratio swings ±0.04 from span to span (the frame's 12-unit stroke rasterises to a different pixel split at each size), which is close to the window's own half-width; no single width in {12, 13.5, 15} holds every span in both engines.
- **The key moved to 375** (`boardRaster.ts`, both trees; comments in `gameCell.css` and `gridPaths.ts` re-cut to these numbers). Read on the final union bytes with the tree as built: 380 / 390 / 400 / 430 / 440 / 460 / 470 inside both engines, 450 chromium 1.457 RED, 347 chromium 1.349 RED. **366–379 is unread.**
- **It is a fitted constant (LAWS P8 §E) and goes to the ballot's caption:** moving 480 → 375 flips every board from 375 to 479 dpx from 12 to 15 units. None of the five ruled rigs moves (365 stays small; 604, 636, 668 stay large); the unit row pins all five plus 380.
- Rows 4 and 5 are NOT met: chromium 450 (1.457) and 812×375 / 347 dpx (1.349) stay RED, each by ≤ 0.007.

## 6 · Final bytes: the band's born-RED on the union, and every gate beside its control

**The union's own born-RED.** The union WITHOUT GRAPHITE (`acde977b`, `index-BRpbF3dGtZoj.js`) served as the control arm against the final tree (`index-CBvmTgNKzptx.js`), five rigs, `GATE=1`, t/b: control RED 0.260–0.298 chromium, 0.114–0.298 webkit; tree 1.371–1.434, exit 0 both (load 54–60). The HEAD control (`74a2b5d9`) read RED 0.229–0.580 in the same rigs (§0). Row 1 re-read on the final bytes is identical to §0 at every cell, exit 0 both engines (load 36–46).

Gates, exit read bare from a file each gate wrote (`npm run -s <gate>`; load 30–63 at the gates' starts):

| Gate | 74a2b5d9 tree (final) | base control `74a2b5d9` | union + GRAPHITE (final) | union control `acde977b` |
|---|---|---|---|---|
| `lint` (prettier) | 0 (1 before the format pass) | 0 | 0 | 0 |
| `lint:eslint`, `lint:boundary`, `typecheck:node`, `lint:knip`, `lint:catch`, `lint:theme-selectors`, `lint:lanes`, `lint:motion`, `lint:copy`, `lint:live-regions`, `lint:tdz`, `test:font-coverage` | 0 each | 0 each | 0 each | 0 each |
| `lint:ink` | 0 | 0 | 0 | 0 |
| `lint:theme-tokens` | 0 | 0 | 1 — output equal to the control's but for the declared count (64 → 63) | 1 (its two bare `var()`) |
| `typecheck:e2e` | 0 | 0 | 2 (RULE's `zone-grammar.spec.ts`, equal to the control's) | 2 |
| `lint:sleep` | 0 | 0 | 1 (equal) | 1 |
| `lint:face-engine` | absent | absent | 1 (no census on disk; equal) | 1 |
| `lint:verbs` | absent | absent | 0 (1 before the one-spend cure) | 0 |
| `lint:bands` | absent | absent | 0 (1 before the MOVED row) | 0 |
| `lint:tape-foot` | absent | absent | 0 | 0 |
| `vue-tsc -b --force` | 0 | — | 0 | — |
| vitest, chunked by `src/` dir | 73 files / 865 tests (72 / 861 before the raster row) | not run | 78 / 959 (77 / 955 on the first 5-file cut) | not run |

- GRAPHITE leaves the union's gates exactly where the union control has them. The three reds the union carries (`theme-tokens`, `typecheck:e2e`, `sleep`, `face-engine`) are the union's own, byte-equal in output.
- The two reds GRAPHITE caused on the union were found here and cured in the delta: the unadmitted `180ms` (verbs) and the dead alias (theme-tokens); the MOVED row is what the one-spend cure cost B6.
- `lint:bands` ran with the work tree's gitdir as history (B6 needs `74a2b5d9` reachable); its sabotage battery was not run (it needs a git clone, LAWS P8 §F).

## 7 · Gaps, each with the number that holds it open

1. **16×16 is RED** at the phone in both engines (1.622 / 1.647 light, 1.635 / 1.653 dark) and at 1024×768 in webkit (1.453 both themes). Cause unread. Row 6 is not met for 16×16.
2. **Chromium at 450 dpx reads 1.457** (15 units, RED by 0.007) and **812×375 (347 dpx) reads 1.349** (12 units, RED by 0.001). Rows 4 and 5 are open; 366–379 dpx is unread.
3. **R6 is not landed.** No product band row in `e2e/`; the band still runs from lane copies of the pass-6/7 instruments (`bandc.crit.ts` sha1 `f256121a`, `band-stat.mjs` `d2e2d620`, `band-lib.ts` `48fe6062`; plus this lane's variant `bandw.crit.ts`). X6 (a ring with no sides) stays invisible to G2 (0 / 0); the four-band graft through `./lib/edge-bands.mjs` is untaken a fourth pass.
4. **R7 not run:** whole-DOM π vs `74a2b5d9` (each cell gains a second `<path>`; `.board-wrapper` gains `data-raster` under 375 dpx), AA, the filter census, goldens, G1/G1b, G4, G10, print, forced colours, `check-property-block --dist/--served`, the served-CSS diff against a clean build and the orphan-utility list (LAWS P8 §B). Three product comments changed in CSS/TS (`gameCell.css`, `gridPaths.ts`, `index.css`); none was checked for a minted utility.
5. **R8, the wash (row 10):** the W7/W8 plants are filed for SIX (`instruments/wash-arm-plants.py`). On the union both gates read every plant as clean, in both const positions: `lint:ink` 0 ×6, `lint:theme-tokens` 1 ×6 with output byte-equal to clean. The wash reach reads `--ground-wash-unit`'s declarations, never an arm token under contrast more. The wash's PAINTED contrast under contrast more, both themes, was not read; the band under contrast more was (§4, unchanged).
6. **R8, the OUTSIDE gauge (row 11) is not built on the union.** The tally is not on the union at all (§1); B-TALLY-16 stays UNBUILT and the phone-clearance caption unread.
7. **The 74a2b5d9 tree's own band was not re-read this pass.** Its frame and rigs are pass 8's (1.370–1.435 at `d49b0ea4`); the key move does not touch the five rigs (unit row), but the tree's dist was not rebuilt or served.
8. **No non-author read.** Every number here is the lane's (LAWS P8 §C).
9. **The tree still carries FIVE's front primitive by sha from pass 7/8** (`pencilConfig.ts` `MOTION.hand`, `gridPaths.ts`'s `frontGate`/`poseFronts` for the tally). Nothing new was taken by sha this pass (CHAIR §6); the union delta carries none of it.
10. The MOVED row is a write into LADDER's `check-motion-bands.mjs` on the union, and the ring-ink fold is a write into §6's token line. Both are declared here for their owners.

## 8 · Bank

| | |
|---|---|
| Write-tree (74a2b5d9 tree) | `df9999af2d99f34ff960e10574575e53d7abe243` |
| `pass9.diff` | 600,007 B, sha1 `457a7984`, 37 files +12,189/−195; `--check` 0 on a fresh `git archive 74a2b5d9`; 1 on s13-s7-s3 |
| `pass9.delta.own.diff` | the same minus the 13 home paths: 162,085 B, sha1 `a4af9d2e`, 24 files +2,381/−194; `--check` 0 on `74a2b5d9` + homes.diff; 1 on s13-s7-s3 |
| `pass9.delta.on-WAVE.diff` | on `acde977b` (union + homes.on-WAVE), write-tree `ff709150`: 25,695 B, sha1 `126f99e6`, 10 files +231/−25; `--check` **0 on `acb9c08e`**, **0 on `acde977b`**; 1 on s13-s7-s3 (`index.css`, `GameControlPanel.vue` only) |
| `pass9.delta.on-s13-s7-s3.diff` | the on-WAVE delta minus those two files: 22,911 B, sha1 `292d9e8e`, 8 files +226/−19; `--check` **0 on s13-s7-s3** |
| Greps | `scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch`: 0 over all four; `^+++ .*/\.`: 0 |

- Every diff is `--binary`, cut through a temporary index, product paths only. The home files in `pass9.diff` are homes v2 byte for byte (applied by sha `1f70cfda`, untouched after); no residual home edit remains.
- Instruments imported by relative product path: `scripts/check-ink-pressure.mjs` and `scripts/check-theme-tokens.mjs` → `./shape-census.mjs` (`publishers`, `unresolvedSites`, `tokenSites`, `sources`, `parseColor`). No import from `docs/`.
- Frames: none taken. Headroom spent: 0 B. Evidence added under this directory: the four banks (811 KB), README, BANKED.txt, `readings/` (2 files), `instruments/wash-arm-plants.py`.

## 9 · Replay

1. **Union + GRAPHITE:** `git archive 74a2b5d9` into an empty dir; `git apply --binary pass8/integrate/WAVE.diff` (→ `acb9c08e`), then `pass9/instruments/homes.on-WAVE.diff` (→ `acde977b`), then this dir's `pass9.delta.on-WAVE.diff` (→ `ff709150`). Run `git apply` with a git dir and work tree set explicitly, or with `GIT_CEILING_DIRECTORIES` above the dir: inside the repo's ignored scratch, a bare `git apply` resolves the main repo and silently skips every path (§10).
2. **The 74a2b5d9 tree:** `git archive 74a2b5d9` + `pass9.diff` (or + `pass9/instruments/homes.diff` + `pass9.delta.own.diff`).
3. Symlink `web/frontend/node_modules` to the main tree's; `vite build` with a private `cacheDir`; serve with `vite preview --strictPort` on the lane port; the HEAD control from `w7-control` on the control port.
4. **The band:** a Playwright dir with `spec/` = `bandc.crit.ts` (pass7/critique/ACC-GRAPHITE/instruments), `band-lib.ts` + `band-stat.mjs` (pass6/instruments), `instruments/bandw.crit.ts`; `e2e/wire.ts` and `src/lib/base64url.ts` copied from the tree beside `spec/`; `instruments/pw.config.ts`; `node_modules` symlinked. Env: `TREE_URL`, `CONTROL_URL`, `OUTDIR`, `GATE=1`, `STAT=tb`, `RIGS=desk,phone,tablet,tabletL,deskcoarse`; `bandw.crit.ts` adds `WIN=lo,hi`, rigs `w<W>x<H>[t]`, `THEME`, `RM`, `CONTRAST`, `SIZE`/`GIVENS`, and `EXTRA_CSS` for the plants (§3) and the forced widths (§5). One `--project` per engine, the exit appended to the run's own log.
5. **Gates:** `npm run -s <gate>` per row of §6 from `web/frontend`, exit to a file; on the union with the work tree's gitdir for `lint:bands`.
6. **The wash plants:** `python3 instruments/wash-arm-plants.py <union web/frontend> <logdir>`.

## 10 · Incidents

- **Git on main, twice, read-only.** (1) `git apply --numstat homes.diff` with the cwd under main's `docs/` printed nothing. (2) The first union build ran `git apply` from a scratch dir inside the repo's ignored `.claude/`: git resolved main as the top level and skipped every path, exit 0, nothing applied anywhere (main's `gridPaths.ts` verified unchanged). Re-run with the work tree's gitdir and a temporary index. No `git status`, commit, stash or write on main.
- **Two vacuous plants** (the raster sabotage, a shell escape): exit 0 on unchanged bytes; caught by reading the results, re-run with a did-it-land check. Declared in §2.
- **A vacuous plant inherited from pass 8:** the re-clip on `svg.hand-drawn-grid` does not reach the union's `.grid-ink` frame (§3).
- **My own test arithmetic** (`240 × 2` is the bound, not under it): the raster row's first run read 1 failed; corrected before any gate read it.
- **One foreground command passed 118 s** (`lint:theme-tokens` after the ring fold) and was moved to the background by the harness; its log was read afterwards. One foreground `sleep` chain was refused by the harness and re-issued inside one shell.
- **A wash-plant script with apostrophes** in a quoted shell string failed to parse twice and ran nothing; re-written as a file.
- **Reading on edited bytes:** the plants, sweep and matrix (§3–§5) ran on `index-D9D8GeClGw57.js`, before the key move, the one-spend cure and the ring fold. Row 1 and the moved key's spot check were re-read on the final `index-CBvmTgNKzptx.js`; the rest was not re-read. The one-spend cure and the fold change no painted byte of the board by construction (same computed stroke values, same hex); the key move changes 375–479 dpx only.
- **`vue-tsc -b`** writes its build info under the shared `node_modules` symlink target.
- Servers: tree :4235 (listener 76953, wrapper 76899) and controls :4254 (HEAD control 77038 / 77007, then the union control 23398 / 23358), each killed by recorded PID after a cwd check. Ports 4235 and 4254 free at return. No `rm` (discards moved to the lane's trash dir); no `/tmp` writes; no `&`.
- Box: 1-minute load 21.9–82.4 at the start and end of every browser run (54 logs) (each row's start load is in its log and in `readings/`); no row opened above 120.
