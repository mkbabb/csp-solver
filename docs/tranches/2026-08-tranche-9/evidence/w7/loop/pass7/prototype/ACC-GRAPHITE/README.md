# Pass 7 · ACC-GRAPHITE · prototype

Tree: `.claude/worktrees/wf_f72f3b5a-83a-40`, the pass-6 bank advanced in place on `74a2b5d9`, no commit.
Write-tree `beecfeccf7e9`: 25 files +2,563/−187 against `74a2b5d9` (`pass7.cum.diff`, sha1 `0c5a0f6f6252`, 186,096 B).
Over the pass-6 bank: 11 files +1,004/−96 (`pass7.delta.diff`, sha1 `e82768c42647`, 77,919 B).
Dists (each rebuilt byte-identical from a clean copy, `diff -rq` empty):
- tree: `index-DAjWznUFrGq7.js`
- one-line OUTSIDE arm: `index-CbZ0YQyta0cg.js`
- control, `w7-control` at `74a2b5d9`, read-only: `index-CubiZsMVSwTc.js`

Box load: 29–96 (1/5/15-min) across the runs, with 125–179 sibling node processes. Every G10 row carries its own load in `readings/g10.summary.txt`.

## The survive-on sentence (row 1)

**The band dies at desk under the stamped gate. The thesis survives on the wash and the tally.**

The rig-keyed band (15 units, 12 on the 1x coarse raster) puts the whole-stroke statistic inside [1.35, 1.45] at every rig, both engines, DPR 1/2/3. One edge case is the 520-wide desk in WebKit, which reads 1.45.

It still fails two gates:
- **Stamped `band.crit.ts` GATE=1, unmodified (perimeter median):** RED at desk, 1.471 cr / 1.511 wk.
- **A.1's top/bottom statistic:** RED everywhere, 2.49–3.40.

The single-inset arm (12 everywhere, `arms/band-single-inset.PROPOSED.diff`) lands the stamped perimeter gate (desk 1.370, phone 1.443), but on the whole stroke it dies at desk on **1.294** (cr) / **1.330** (wk).

What survives:
- **The wash:** `--ground-wash-unit` 6 % reads **1.119 light / 1.115 dark** over the card, against floors 1.078 / 1.104. It is read at every declaration by the new consumer-resolved gate.
- **The tally:** OUTSIDE is **0 on glyphs** at desk and phone, both engines, against INSIDE's 431/451 (desk) and **171/190** (phone).

## Gaps first

1. **Band under A.1:** RED at every rig. Top/bottom runs 2.49–3.40, because the frame's top and bottom are half strokes: the `FRAME_Y_PAD` 0 bake clips them (row 2). No inset cures a clipped denominator.
2. **Band under the stamped perimeter at desk:** RED with the rig key (1.471 / 1.511). WebKit desk also reads `SIDES≠` (top 15.572, fused).
   - The two statistics disagree by construction: the perimeter median mixes the half strokes with the whole ones.
   - I did NOT re-word the gate (CHAIR A.1 stands). The chair picks which statistic binds; the two arms are one line apart.
3. **The key is `(pointer: coarse) and (max-resolution: 1dppx)`, a proxy for "the small raster".** The ratio follows the board's device-pixel size (anti-aliasing), not the pointer.
   - A fine-pointer board at 1x narrower than ~520 px reads 1.441 cr / 1.45 wk: the edge, and one b2 run printed 1.450 RED.
   - No rig in the charter is that shape. The desk-narrow row is my addition.
4. **G10's DOM clock:** WebKit gated6's DOM-observed minimum gap is 11.0 ms, while its frame clock is 17.0 ms. The gate binds the frame clock (LAWS §F). The DOM number is printed, not hidden.
   - About 1 d-record per run falls outside a rAF frame in both engines. The observer counts it and does not fail on it.
5. **FIVE's cure costs the join at 60 Hz in WebKit:** 39.5/s against chromium's 53.0/s. That is the whole-ms clock's +1 (16→17 ms against a 16.7 ms frame), inherited by sha. The 60 Hz row reds on its precondition (59.9 / 58.8 Hz < 93.75), as the spec requires.
6. **FIVE's docstring cites `e2e/front-rate.spec.ts`,** which this tree does not carry. The spec ran here as `instruments/probes/front-rate-p7.spec.ts`. The cite dangles until FIVE's spec lands.
7. **The phone OUTSIDE frame:** the tally's top run sits at y 140.4 against the svg's 147.7, about 7 px nearer the heading. The occlusion probe reads 0 on other ink there, but heading clearance has no gate of its own.
8. **The undefined-token census reds 1 in both the tree and the control:** the declared STALE row, not introduced here.
9. **`lint-lanes` exits 2 on the snapshot copy** (no `.github` there). In the work tree it exits 0.

## Row 1 · the band, rig-keyed (`readings/g2-band.summary.txt`, every run)

Whole stroke (left/right), `band7.crit.ts` STAT=lr GATE=1. It is the stamped instrument plus rigs, DPR and per-side prints; its geometry is scaled to device pixels at DPR>1. Every cell is exit 0 unless marked.

| rig | DPR 1 cr | DPR 1 wk | DPR 2 cr | DPR 2 wk | DPR 3 cr | DPR 3 wk |
|---|---|---|---|---|---|---|
| desk 1280×800 | 1.389 | 1.432 | 1.384 | 1.380 | · | · |
| desk 1440×900 | 1.388 | 1.386 | · | · | · | · |
| phone 393×699 | 1.399 | 1.377 | 1.404 | 1.419 | 1.380 | 1.424 |
| phone 812×375 | 1.363 | 1.388 | 1.381 | 1.433 | · | · |
| desk-narrow 520×800 | 1.441 | 1.45 (edge) | · | · | · | · |

- **The stamped `band.crit.ts`, unmodified, GATE=1 on the tree:** exit 1 in both engines.
  - Desk: 1.471 cr / 1.511 wk, RED.
  - Phone: 1.443 / 1.421, inside.
- **Top/bottom:** 2.49–3.40 at every rig (RED).
- **Perimeter at 15 units:** 1.47–1.60.
- **Control:** 0.300 (desk, perimeter).
- **Width sweep at desk, l/r cr/wk:**

  | width | cr | wk |
  |---|---|---|
  | 12 | 1.294 | 1.330 |
  | 13 | 1.329 | 1.382 |
  | 14 | 1.338 | 1.413 |
  | 15 | 1.389 | 1.432 |
  | 16 | 1.414 | 1.462 |

  15 is the one width inside both engines.
- **12 at the small raster:**
  - Without the key (15 everywhere), the 1x phone reads about 1.51 (pass 6).
  - With 12 at every rig, l/r reads desk 1.294 / 1.330, desk1440 1.292 / 1.292, DPR 2 phone 1.286 / 1.312, DPR 3 phone 1.290 / 1.326.

  The key is one predicate with one inset per regime.

The arm is in `gameCell.css`: the retrace takes `stroke-width: 15`, and one `@media (pointer: coarse) and (max-resolution: 1dppx)` rule sets it to 12.

`RETRACE_INSET`'s comment in `gridPaths.ts` is re-cut to the painted numbers: a 21.5-unit fused band, 20 at the 1x coarse board.

## Row 2 · the frame as painted, handed to §13

Per side at desk, chromium DPR 1, from the stamped instrument's own print:
- top/bottom **3.12 / 3.88 px** against left/right **7.389 / 7.317 px**
- edge-touch: top/bottom 100 %, left 7–8 %, right 28 %

The top and bottom strokes are clipped at the bake's edge (`FRAME_Y_PAD` 0), so the owner sees a half stroke there.

**Handed to §13 (MOT-VERB, INTAKE-23 rows 1–2) by number:** the frame's top/bottom paint at 0.42–0.53× its sides (3.12/7.389, 3.88/7.317). Every A.1 band reading inherits that factor. Not cured here.

## Row 3 · G10 with ACC-FIVE's A.6 cure by sha (`readings/g10.summary.txt`)

**Grafted:**
- `pencilConfig.ts` whole from FIVE (sha1 `7a8bcfabd31d`, `MOTION.hand.stepMs` 17)
- the `FRONT_MIN_MS`/`frontGate` block verbatim (sha1 `2f19f29c686b`, 4,431 B)
- FIVE's frontGate unit rows

`frontTween` is not grafted: it has no consumer here.

The consumer in `HandDrawnGrid.vue`:
- writes the join on the rAF timestamp: `requestAnimationFrame((at) => joinGate.write(to, to <= 0 || to >= 1, at))`
- `rearm()`s on unmount

Driven 125 Hz clock, `front-rate-p7.spec.ts` (FIVE's observer + frame clock), join gated. Six runs per engine:

| engine | runs | exit | worst /s | frame-clock min gap | DOM min gap | room to 62.5/s |
|---|---|---|---|---|---|---|
| chromium | 6 | 6× 0 | 46.7–51.4 | **16.0 ms** | 15.7 ms | **11.1/s** |
| webkit | 6 | 6× 0 | 43.5–47.6 | **17.0 ms** | 11.0 ms (gap 4) | **14.9/s** |

Negative controls, same run:

| arm | chromium | webkit |
|---|---|---|
| ablated (`FRONT_MIN_MS` 0) | exit 1, 124.9/s, 6.5 ms | exit 1, 122.3/s, 5.0 ms |
| pass-6 gate | exit 0, 16.0 ms | **exit 1, 9.0 ms** (the A.6 defect, reproduced) |
| CLOCK=60 (precondition reds by design) | exit 1, 59.9 Hz | exit 1, 58.8 Hz |

The pass-6 room was 8.9/s. It is now 11.1/s at the worst engine-run.

Load across the G10 runs: 29–62 (1-min), 125–179 siblings.

Units: `gridPaths.poseFronts.test.ts` 20/20. The pass-6 gate form reds 6 of FIVE's rows, and `FRONT_MIN_MS` 0 reds 8.

## Row 4 · B-TALLY-16 at phone, one payload, one lawful pair (`readings/occl.summary.txt`, `frames/`)

**Payload:** `mintBoard(4, 76)` with 77 written, light theme. It's identical in both arms; the arms differ by one line of copy (`TALLY_OUTSIDE`).

| rig · engine | INSIDE on glyphs | OUTSIDE on glyphs | OUTSIDE off the svg |
|---|---|---|---|
| desk 1280×800 fine · cr | 431 / 19,378 | **0** / 19,378 | 4,717 |
| desk · wk | 451 / 19,320 | **0** / 19,320 | 4,735 |
| **phone 393×699 coarse · cr** | **171** / 7,115 | **0** / 7,115 | 1,573 of 1,632 ticks px |
| **phone · wk** | **190** / 7,126 | **0** / 7,126 | 1,643 of 1,708 |

- At phone, OUTSIDE's pose spans x 12.5–382.9 against vw 393: inside the viewport, with no clipping ancestor.
- 4×4 and 9×9 at phone read 0 on glyphs in both arms.

**Frames** (pngquant 60–90; each is desk 1280×800 fine above, phone 393×699 coarse below, INSIDE | OUTSIDE, DPR 1, light):
- `frames/p7-tally16-inside-outside-desk-fine-phone-coarse-light-chromium.png` (15,443 B, sha1 `35d3864449ba`). **Retires** `pass6/prototype/ACC-GRAPHITE/frames/p6-tally16-inside-outside-desk-light-chromium-fine.png`.
- `frames/p7-tally16-inside-outside-desk-fine-phone-coarse-light-webkit.png` (15,680 B, sha1 `43f5234154cf`). **Retires** `pass6/prototype/ACC-GRAPHITE/frames/p6-tally16-inside-outside-desk-light-webkit-fine.png`.

INSIDE is `index-DAjWznUFrGq7.js`; OUTSIDE is `index-CbZ0YQyta0cg.js`. In both engines INSIDE's dashes cross the G/4/8 column, and OUTSIDE's ride the card's edge.

## Row 5 · RETIRED, wash-step, R1 on the chair's shape-census library

**The library:** `scripts/lib/shape-census.mjs` is the chair's copy (sha1 `3ba7738ee8d4`) with two changes (`instruments/shape-census.tokenSites.PROPOSED.diff`, 86 lines):
1. at-rule-own declarations (`@theme` read as `:root`)
2. `tokenSites(fe, token)`: every declaration site of one token, value captured balanced, with an unreadable publisher returned as `unresolved`

It passes the chair's shape-plants battery identically: 19 plants, 1 negative, 24/24.

**The gates:**
- **`check-theme-tokens.mjs`:** the RETIRED scan runs through `tokenSites`. The self-test covers 14 plant shapes, all RED as required, plus a `getPropertyValue` green.
- **`check-ink-pressure.mjs`:** `gateWashReach` reads every `--ground-wash-unit` declaration at the consumer.
  - Each is classed by theme (`.dark` anywhere is dark; `:not(.dark)` is light) and by arm (`prefers-contrast: more`; print and forced-colors are skipped).
  - Non-root base scopes also hold the `more` floor.
  - An unreadable publisher reds. The self-test adds 8 cases.
- **R1:** a second path, `instruments/r1p7.mjs`, on the library. It scores named, lch, lab, hwb and hex colours by OKLab chroma.
  - Self-test: 8 plants RED, 2 negatives GREEN, exit 0.
  - On the control: RED (`--color-focus-sketch`, 12 tokens). On the tree: GREEN.
  - PROPOSED, not wired into the estate (MOVED row below).

**Attack** (`instruments/attack.py`, `logs` in scratch): nine escapes, each exit 0 against the pass-6 scripts and exit 1 against the pass-7 scripts:
- RETIRED: a quoted-key `:style` object, a TS style object, a same-line `url(//)` in an SFC `<style>`
- wash: `.dark .cell-peer`, `html:is(.dark)` inside `more`, `.dark body` inside `more`
- R1: a retrace hex, `royalblue`, an `lch()` token

The unplanted baselines exit 0 for both scripts.

## Row 6 · apply checks (A.7) (`instruments/scripts/applycheck.sh`)

| # | check | exit |
|---|---|---|
| 1 | `pass7.cum.diff --check` on fresh `74a2b5d9` | **0** |
| 2 | `pass7.delta.diff --check` on `74a2b5d9` + pass-6 bank | **0** |
| 3 | `pass7.cum.diff --check` on `74a2b5d9` + `s13-s7-s3.diff` | 1 |
| 4 | A.7: the pass-5→pass-6 interdiff (9 files +411/−80) `--3way` on the integrated tree | **1, atomic, nothing applied** |
| 5 | `pass7.delta.diff --3way` directly on the integrated tree | 1 |

Check 4 conflicts in:
- check-ink-pressure, check-theme-tokens
- DifficultyTally
- gameCell.css
- HandDrawnGrid.vue
- poseFronts.test, gridPaths.ts

`gridPaths.tally.test.ts` is absent from the integrated index.

**The hunks that cannot** (check 5, 14 conflict hunks):

| file | conflict hunks |
|---|---|
| `scripts/check-ink-pressure.mjs` | 4 |
| `scripts/check-theme-tokens.mjs` | 4 |
| `src/games/shared/gameCell.css` | 2 |
| `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | 1 |
| `src/pencil/grid/gridPaths.poseFronts.test.ts` | 1 |
| `src/pencil/grid/gridPaths.ts` | 2 |

Clean: `.prettierignore`, `eslint.config.js`, `knip.json`, `pencilConfig.ts`, `scripts/lib/shape-census.mjs` (added).

The integrator carries a pass-5 GRAPHITE, so every conflict sits where pass 6 already moved the same lines. A.7's own re-apply fails first. This family's number from the integration can't be cited until the chair rebases the pass-6 bank onto s13-s7-s3.

## Battery (bare; `readings/battery.tsv`)

The tree column is `snap2`, byte-identical to the work tree (`diff -rq` src/scripts empty, configs `cmp` 0). The control is the w7-control tree, read-only.

| gate | control | tree |
|---|---|---|
| copy-register · --self-test | 0 · 0 | 0 · 0 |
| theme-tokens · --self-test | 0 · 0 | 0 · 0 |
| ink-pressure · --self-test | 0 · 0 | 0 · 0 |
| lint-lanes --self-test | 0 | 2 on the snapshot (no `.github`); **0 in the work tree** |
| lint-sleep · lint-motion | 0 · 0 | 0 · 0 |
| test-e2e-projects · check-pw-projects | 0 · 0 | 0 · 0 |
| property-block (src) | 0 | 0 |
| property-block (served, dist b3) | · | 0 |
| undefined-token census | 1 (STALE row) | 1 (same row) |
| eslint · knip | 0 · 0 | 0 · 0 |
| prettier (`npm run lint`, work tree) | · | 0 |
| vue-tsc -b --force | · | 0 |
| vitest (3 chunks) | · | 0: 71 files, 855 tests (328 + 431 + 96) |

## Replay route

In place. The pass-6 bank is still applied in this tree, and pass 7 edits over it. The line counts reconcile: the cum diff is 25 files +2,563/−187, the delta 11 files +1,004/−96, and a scratch-index `write-tree` of the work tree reproduces the cum diff's sha1 `0c5a0f6f6252`.

## Files touched (web/frontend)

| file | change |
|---|---|
| `src/games/shared/gameCell.css` | retrace 15, the rig key, comments |
| `src/pencil/grid/gridPaths.ts` | FIVE's frontGate block, the MOTION import, the RETRACE_INSET comment |
| `src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue` | rAF-timed join, `rearm` on unmount |
| `src/pencil/grid/gridPaths.poseFronts.test.ts` | FIVE's rows |
| `src/pencil/config/pencilConfig.ts` | FIVE's, whole |
| `scripts/lib/shape-census.mjs` | new: the chair's + `tokenSites` |
| `scripts/check-theme-tokens.mjs` | RETIRED on `tokenSites` |
| `scripts/check-ink-pressure.mjs` | `gateWashReach` |
| `knip.json`, `eslint.config.js`, `.prettierignore` | the library, SIX's form |

## MOVED rows (PROPOSED, never applied)

- **R1:** `instruments/r1p7.mjs` is proposed as the R1 gate's second path, on the shape-census library.
- **Shape census:** `instruments/shape-census.tokenSites.PROPOSED.diff` is the delta over the chair's library, for the chair's `pass7/instruments/shape-census.mjs`.
- **The band's single inset:** `arms/band-single-inset.PROPOSED.diff` applies to the tree (exit 0). It lands the stamped perimeter gate and dies at desk on the whole stroke (1.294).

## Ballot row

**B-TALLY-16:** INSIDE vs OUTSIDE, one payload (`mintBoard(4,76)` + 77), frames as above.
- INSIDE collides 171/190 at phone and 431/451 at desk.
- OUTSIDE reads 0/0 at both and paints over the card's edge and shadow.

## Incidents

- **zsh doesn't word-split a `$G` command string,** so the apply-check commits failed. Re-run as a bash script with a function.
- **`grep -c` with an empty file list read stdin and hung.** Killed by its PID.
- **The first DPR-2 band run read device pixels at CSS-pixel coordinates** (band 0.000). The instrument now scales every coordinate by DPR, and run `lrdpr2-b2` is VOID.
- **`tokenSites` truncated values at `}` inside `${}`** (fixed with balanced capture), and **missed `@theme` declarations** (fixed in `cssRules`).
- **The first `r1p7` was too slow.** Stopped by a pattern keyed on its own name and this lane's path; the rewrite memoises reads.
- **A foreground wait outran its timeout** and was re-run in the background.
