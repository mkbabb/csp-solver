# Homes v3 · the non-author check (T9-W7 pass 10, batch 0 gate)

Lane `homes-check`, a non-author run. Read-only on `w7-p8-homes` and every worktree. Every tree below is a fresh
`git archive` under the lane's durable scratch (`pass10/homes-check/t2/`), each `git init`-ed before any apply, each
apply line printing its resolved git dir and path count. Exits are read bare from files the batteries write.
Scripts: `bat/setup2.sh`, `bat/bl.sh`, `bat/chain.sh` in the lane's scratch (the replay route).

## 1 · The bank, by sha (matches README.md's table)

| File | sha1 (read here) | Bytes | README |
|---|---|---|---|
| `homes.diff` | `be9a5af6ffa383f67c2bb5f2b9005cd20f17c8f0` | 513,021 | equal |
| `homes.on-WAVE.diff` | `88b48d946e4975131b5d01684e8c473addaa8840` | 110,429 | equal |
| `struck-10.diff` | `4f5effd2596e609c7f9d012a42a53e266ad213d5` | 18,723 | equal |
| `struck-18.diff` | `184553a1045afddc5df6ea1bdf9319d77346f322` | 13,763 | equal |

Integrated-tree inputs read: `pass9/integrate/WAVE.diff` `b3725e4f`, 3,634,760 B, 187 paths; `s10.diff` `2ee224c8`,
64 paths; `s13-s7-s3.diff` `280bd910`, 108 paths.

## 2 · Apply-checks (each scratch its own `.git`, exit bare)

| Diff | Tree | Resolved git dir | Paths | Exit |
|---|---|---|---|---|
| `homes.diff` `--check` | `74a2b5d9` archive (`t2/base74`) | `t2/base74/.git` | 13 | 0 |
| `homes.diff` `--check` | `1d0dc4fd` archive (`t2/base1d`) | `t2/base1d/.git` | 13 | 0 |
| `WAVE.diff` applied | `74a2b5d9` (`t2/wave`) | `t2/wave/.git` | 187 | 0 |
| `s10.diff` applied | `74a2b5d9` (`t2/s10`) | `t2/s10/.git` | 64 | 0 |
| `s13-s7-s3.diff` applied | `74a2b5d9` (`t2/s13`) | `t2/s13/.git` | 108 | 0 |
| `homes.on-WAVE.diff` `--check` | the WAVE union (954bbbab's content) | `t2/wave/.git` | 8 | 0 |
| `homes.on-WAVE.diff` `--check` | s10 | `t2/s10/.git` | 8 | 0 |
| `homes.on-WAVE.diff` `--check` | s13-s7-s3 | `t2/s13/.git` | 8 | 0 |
| `homes.diff` applied | `74a2b5d9` (`t2/run`, the run tree) | `t2/run/.git` | 13 | 0 |
| `struck-10.diff` `--check`, then applied | `74a2b5d9` + `homes.diff` (`t2/runf`) | `t2/runf/.git` | 2 | 0, 0 |
| `struck-18.diff` `--check`, then applied | `74a2b5d9` + `homes.diff` + `struck-10` (`t2/runf`) | `t2/runf/.git` | 2 | 0, 0 |
| `homes.on-WAVE.diff` applied | the WAVE union | `t2/wave/.git` | 8 | 0 |
| `struck-10.diff`, `struck-18.diff` `--check` | the WAVE union + `homes.on-WAVE.diff` | `t2/wave/.git` | 2, 2 | 0, 0 |

Blob equalities, the 13 home paths hashed in the scratch against the named tree's blobs:

- The WAVE, s10 and s13-s7-s3 each carry homes v2 (`d17813ba`): 13/13 equal on each.
- `74a2b5d9` + `homes.diff` against `cd5914b1`: 13/13 equal.
- The WAVE + `homes.on-WAVE.diff` against `cd5914b1`: 13/13 equal.
- `74a2b5d9` + `homes.diff` + `struck-10` + `struck-18` against `ac862f1e` (the author's full tree): 13/13 equal.

The archives hold `web/frontend`, `.github`, `.gitignore` and `README.md` (every path the seven diffs touch), so
whole-tree ids are not read here; the equalities are per-blob on the 13 home paths.

## 3 · The tree's build (served on :4233)

`t2/runf` (= `ac862f1e`'s 13 home paths; product = `74a2b5d9`'s), `csp-solver/data` added from the `74a2b5d9`
archive (the first build exited 1 without it: `sudoku-templates: tier 3/hard ... holds no template-*.json`, a
rig incident, declared), private cacheDir under the lane's scratch, `.git` marker present. `vite build` exit 0
(zone inuse 10,178, load 23.20). JS `index-BOytrTnLSO5X.js` (the author's, reproduced); CSS 7/7 files
byte-identical to the control's dist, 96,800 B against 96,800 B. The control `w7-control` serves
`index-CubiZsMVSwTc.js`.

## 4 · Browserless, on the run tree `t2/run` (= 74a2b5d9 + `homes.diff`)

| Row | Exit | Reading | Load |
|---|---|---|---|
| `node scripts/shape-census.mjs --self-test` | 0 | 156/156 read as the law, 0 fail, clauses planted 100/100, 5 s | 18.6 → 19.2 |
| `--sabotage-battery` | 0 | 100/100 clauses red the self-test when deleted, 17 s | → 19.3 |
| born-RED: `--self-test --lib scripts/zz-v2seed-hc.mjs` (homes v2's `shape-census.mjs`, taken from the s10 archive, blob-equal to `d17813ba`; seed inside the tree, moved to the lane's trash after) | 1 | 139/156, 17 fail, 5 s | → 18.8 |

The 17 born-RED rows on v2, read here, are exactly README §10's 17: `strip-paren-kw` C2, `logical-sides` p9,
`clock-context` K11/K16/K17/K12/K14, `obj-bracket` K1, `str-unescape` S2, `string-rule` S2–S4, `css-wide-kw`
S8–S11, `tok-string-fold` X8/X9, `callee-norm` N6 (TIN), `callee-norm` (ERASE's six), `register-callee`,
`pct-decode` N21/N22, `component-tree` C1y/C17y, `selector-key`, `admitted`, `bounds`, `r4-descend` C1–C6. The
negative control is the same run's v3 self-test, 156/156 (row 1).

**Imports, the 13 home files on the run tree:** 0 imports from `docs/`; 0 absolute-path imports. The non-relative
lines are `glyph-pop.mjs:34` (a multi-line `import {` from `./paint-lib.mjs`), a fixture string inside
`shape-census.mjs:5757`, and `shape-census.mjs:7627`, the `--lib` seed's CLI `import(resolvePath(seed))`. Scratch
paths: 0 hits for `scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch` in the 13 files and in all four
banked diffs.

## 5 · Spot checks

**Three folded diffs, each plant RED** (born-RED on v2 above, the clause sabotage on v3 in the same sitting):

1. FACE `str-unescape` (item 1): S2 `insertRule(".ctrl-word { font-family: \"Comic Sans MS\"; }")` FAIL on the v2
   seed; `SABOTAGE str-unescape → RED` on v3.
2. TAPE `bounds` (item 4): C6 `999rem` bounds at 15,984 px and `calc(100dvh + 1px)` at 801 FAIL on v2;
   `SABOTAGE bounds → RED`.
3. LEDGER `r4-descend` (item 20): C1–C6 FAIL on v2; `SABOTAGE r4-descend → RED` (C1 padding-block, C2 font-size,
   C3 a `:has()` pad, C4 a descendant margin, C5 vertical-align, C6 line-height each RED R4).

The browser-bound folds (B7 HALFCLIP/X6, `inkkey` CRIT-FCMOVE, the absent edge, HR1/HR2, `g5tol`) are read in §6.

**Three refused diffs, each reason checked against the file:**

1. NOTE-ERASE `pass9/critique/NOTE-ERASE/PROPOSED-fence-running.on-WAVE.diff` (`cbe5c15d`, 654 B): its only path is
   `web/frontend/src/pencil/chrome/MarginNote.vue`, product. The reason holds. README §8 names the path
   `src/components/MarginNote.vue`; the file says `src/pencil/chrome/`. A wording slip in the README, not in the bank.
2. NOTE-LEDGER `pass9/prototype/NOTE-LEDGER/proposed/PROPOSED-lint-ink-collapse.diff` (`e9d06197`, 10,086 B): its
   only path is `web/frontend/scripts/check-ink-pressure.mjs`, a consumer gate. The reason holds.
3. PAL-TIN `pass9/prototype/PAL-TIN/proposed/G5-rung.PROPOSED.md` (`69b3a3c2`, 1,866 B): it opens "This is not code:
   it asks for a ruling". The reason holds.

## 6 · The two conditional folds, first (tree `t2/runf` = 74a2b5d9 + `homes.diff` + `struck-10` + `struck-18`)

Each row its own `guarded` call (WebKit under `--exclusive webkit`), one browser per run. Control `w7-control` on
:4256 serving `index-CubiZsMVSwTc.js`; tree `t2/runf` on :4233 serving `index-BOytrTnLSO5X.js`; both answered 200,
with those identities, before every served row (`logs/srv.pids`: control guarded pid 81360, tree 81592).

### 6a · Chromium

| Row | Control exit | Tree exit | Reading | zone inuse | load start → end |
|---|---|---|---|---|---|
| edge-bands `--self-test --dprs 1,2` (B-ROSTER library) | — | 0 | 0 WRONG; `drawn` rows both themes, DPR 1 and 2: 1.5 px at the floor GREEN, OFF the roster (1.80) RED B3, 1.40 (bound+ε) GREEN, 1.30 (bound−ε) RED B3, 1 px RED B3, **0.55× (0.825 px) RED B3**, PIN (a source authoring 1.4) RED `drawn`; **a typed `thick` beside the roster → REFUSED; a typed `thickTol` 0.5 → REFUSED**; B7 HALFCLIP, INKKEY CRIT-FCMOVE keyed/unkeyed, ABSENT-EDGE no-op undo + B0 RED | 10,270 → 10,298 | 18.62 → 18.59 |
| edge-bands `--sabotage-battery` | — | 0 | 11/11 bite, each self-test exit 3: B0–B6, ownfill, B7, inkkey, **drawn** | 10,298 | 18.59 → ~12 |
| postpaint `--self-test` (stale-rebase library) | — | 0 | **U5** clean F1 ct 0 GREEN, planted (startTime 150 early) F1 ct 150 RED (ct) → OK; **U6** task seek: frame 1 UNREAD, F1 k1 ct 17 RED (ct), seeks 1; own start only GREEN; a later frame's write RED → OK | → 10,436 | → 9.88 |
| postpaint `--sabotage-battery` | — | 0 | 7/7: F1, F1ct, CI, key-inraf, stale, **stale-rebase** (2 rows), **seek-guard** (1 row), each exit 3 | 10,436 | 9.88 → 14.17 |
| edge-bands `--roster tray-well` (the consumer) | 1 | 1 | both: 4 painted sites, the roster pins 4, source `src/games/shared/GameControlPanel.vue` widths 1.5 ×4, pin holds; site 1 CLEAN RED B2 bottom core 1 < 3 (occluder `div.action-bar`) + B3; site 2 CLEAN RED B3 top 0.83; sites 3, 4 CLEAN GREEN; THIN_1PX and **P055 (0.825 px) RED B3 on all four sites**. Verdict lines diffed control against tree: equal | 10,480 / 10,467 | 14.17 → 10.13 |
| postpaint GA1 `.board-peek-host` desk + phone r2 | 1 | 1 | POST F1 RED in all four cells on both (control k24 ct 7.9–8.3; tree k24–25 ct 8.4–9.2); stale 0 in every cell, so neither arm of the fold fires on the product here | 10,467 | ~11.7 |

Chromium column: REPRODUCED for both folds, on a non-author tree, the plants RED and the negative controls GREEN in
the same runs.

### 6b · WebKit (the folds; `guarded --exclusive webkit`, one row per call, each re-queued behind other repos)

| Row | Control exit | Tree exit | Reading | zone inuse | load start → end |
|---|---|---|---|---|---|
| edge-bands `--self-test --dprs 1,2` (B-ROSTER library) | — | 0 | 0 WRONG; `drawn` rows both themes, DPR 1 and 2: 8 want-GREEN and 20 want-RED read as the law; **0.55× (0.825 px) RED B3 (painted depth 0.75–0.76)**; PIN RED `drawn`; **typed `thick` → REFUSED; typed `thickTol` 0.5 → REFUSED**; HALFCLIP and INKKEY rows 16 | 10,673 → 10,876 | 12.72 → 14.03 (queued 11:21:21, ran to 11:33:46) |
| edge-bands `--sabotage-battery` | — | 0 | 11/11 bite, each exit 3, **drawn** included | 10,876 | 14.03 → |
| postpaint `--self-test` (stale-rebase library) | — | 0 | 0 WRONG; **U5 → OK (planted F1ct RED, clean GREEN); U6 → OK (both seeks RED, the frame's own start GREEN), seeks 1** | → 11,010 | → 15.14 |
| postpaint `--sabotage-battery` | — | 0 | 7/7, **stale-rebase** (2 rows) and **seek-guard** (1 row) each exit 3 | 11,010 → 11,096 | 15.14 → 15.20 |
| edge-bands `--roster tray-well` (the consumer) | 1 | 1 | both: 4 painted sites, the roster pins 4, `GameControlPanel.vue` widths 1.5 ×4, pin holds; site 1 CLEAN RED B2 bottom (occluder `div.action-bar`); site 2 CLEAN RED B3 top 0.84; sites 3, 4 CLEAN GREEN; THIN_1PX RED B3 and **P055 (0.825 px) RED B3 (0.81–0.82) on all four sites**. Verdict lines diffed control against tree: equal | 11,096 → 11,276 / 11,276 → 11,689 | 15.20 → 8.40 / 8.40 → 9.19 (queued 11:57:28 → ran ~12:12; 12:12:31 → ran ~12:34) |
| postpaint GA1 `.board-peek-host` desk + phone r2 | 1 | 1 | POST F1 RED in all four cells on both. Unlike chromium (stale 0), WebKit's frame-1 post reads are STALE on the product (the arm the fold re-keys): control F1 k10–12 ct 53–70 "(stale post → inRAF)", stale 1–2; tree F1 k11–13 ct 51–75, same shape; no seek logged | 11,689 → 12,134 / 12,134 | 9.19 → 13.27 / 13.27 → 15.53 (queued 12:34:31 → ran ~12:59; tree ran at once) |

### 6c · The verdicts on the two conditional folds

| Pick | Fold | Chromium | WebKit | Verdict |
|---|---|---|---|---|
| 10 · B-ROSTER (`struck-10.diff`) | `drawn`, `authoredStroke`, `DRAWN_TOL` 0.9 literal, **thickTol REFUSED** (a typed `thick` and a typed `thickTol` beside `drawn` each REFUSED, both themes, both DPRs, both engines), the **tray-well consumer** (`--roster tray-well --fe`, control and tree exit 1 and 1, verdicts equal, pin holds 4/4 at 1.5), **its plant RED** (P055 0.825 px RED B3 in the self-test and on all four served sites; THIN_1PX RED B3), `drawn` sabotage bites (exit 3) | self-test 0, sabotage 11/11, served 1/1 equal | self-test 0, sabotage 11/11, served 1/1 equal | **REPRODUCED** |
| 18 · stale-rebase + seek (`struck-18.diff`) | VERB's `37adb2cb` (U5: clean GREEN, startTime 150 early F1ct RED) **with the critic's plant, a seek between frame 1's in-rAF read and its post read** (U6: a task seek → frame 1 UNREAD, F1ct RED on frame 2, seeks 1; the frame's own start alone GREEN; a later frame's write RED); `stale-rebase` and `seek-guard` sabotage each bite (exit 3); served GA1 control and tree exit 1 and 1, F1 RED in every cell | self-test 0, sabotage 7/7, GA1 1/1 | self-test 0, sabotage 7/7, GA1 1/1 | **REPRODUCED** |

Both conditional folds reproduce on this non-author run in both engines. The bank as filed STRUCK them (README §9:
no non-author run existed at its close); this check is that run. `homes.diff` and `homes.on-WAVE.diff` are NOT
re-banked here (the strike order covers only a failure). Folding them back is the chair's act by sha: `struck-10.diff`
(`4f5effd2`) and `struck-18.diff` (`184553a1`) each apply-check 0 on `74a2b5d9` + `homes.diff` and on the WAVE +
`homes.on-WAVE.diff` (§2), and their sum reproduces `ac862f1e`'s 13 blobs.

**A hole the check names (not a reproduction failure):** U6 is a node-side unit on synthetic frames. It plants the
seek in `analyse()`'s input (`writes`), not in the page. The in-page write log `installSampler` installs (the
`currentTime`/`startTime` setters, the five methods, `rafDepth`) has no plant of its own in the self-test, so the
EFFECT U6 assumes is not exercised in a browser (LAWS P9 §F, a plant per event). The lane wrote a scratch probe
(`t2/runf/web/frontend/e2e/lib/zz-hc-seekprobe.mjs`, never banked) for that row; its reading is in §8.

## 7 · The banked v3 (tree `t2/run` = 74a2b5d9 + `homes.diff`; served product from :4233)

### 7a · Chromium

| Row | Control exit | Tree exit | Reading | zone inuse | load |
|---|---|---|---|---|---|
| glyph-pop `--self-test --dprs 1,2` | — | 0 | 0 WRONG; SLK20 `boundOf(0.817, 0.20)` = 0.9085; HEAD12 RED on #g-head/#g-tape/#g-zero/#g-icon; `g5tol` HEAD12 tolerated GREEN (5), against the unplanted control RED, deeper 8 % RED | 10,458 | 10.23 → 11.26 |
| glyph-pop `--sabotage-battery` | — | 0 | 5/5: G5core, G3clamp, anchor, g4tol, **g5tol**, each exit 3 | 10,468 | 11.26 → 8.91 |
| edge-bands `--self-test --dprs 1,2` (banked, pre-roster bytes) | — | 0 | 0 WRONG, 0 DRAWN rows (the strike holds in the bank); B7 HALFCLIP RED B7 alone (α50 width 1 / ref 2); X6 RED B4/B7 left and right; INKKEY CRIT-FCMOVE keyed RED / unkeyed GREEN printed; ABSENT-EDGE no-op undo, B0 RED | 10,452 | 8.91 → 10.07 |
| edge-bands `--sabotage-battery` | — | 0 | 10/10: B0–B6, ownfill, **B7**, **inkkey**, each exit 3 | 10,511 | 10.07 → 10.59 |
| postpaint `--self-test` (v2 bytes) | — | 0 | 0 WRONG, no U5/U6 rows (the strike holds in the bank) | 10,597 | 10.59 → 9.61 |
| postpaint `--sabotage-battery` | — | 0 | 5/5 | 10,763 | 9.61 → 9.83 |
| postpaint `--self-test --sampler-only --reps 16` | — | 0 | 0 WRONG | 10,763 | 9.83 → 9.65 |
| rest-probes `--self-test` | — | 0 | CLEAN holds 2; **ANC55 refused (HR1); HR1ONLY refused by HR1; HR2ONLY refused by HR2 (opacity 0.55)** | 10,620 | 9.65 → 9.79 |
| rest-probes `--sabotage-battery` | — | 0 | 4/4 | 10,620 | 9.79 → 9.23 |
| glyph-pop `.section-heading` default-deal-desk | 1 | 1 | both CLEAN RED G4 (column core p95 under 3.00 = max(3.0, 0.4 × 4.66)); 9 plants RED on each | 10,636 / 10,636 | 9.23 / 9.02 |
| edge-bands `.drawer-case` | 1 | 1 | both CLEAN RED B4: top holes 0.061 > 0.02 (16 stations, 1 run) | 10,636 / 10,636 | 9.13 / 10.78 |
| rest-probes touch `.drawer-tab` 390×844 | 0 | 0 | both GREEN, toggles 1 | 10,636 / 10,636 | 9.12 / 13.84 |

Every served row carries `srv 4256 200 index-CubiZsMVSwTc.js` and `srv 4233 200 index-BOytrTnLSO5X.js` in its log.
Chromium column of the bank: REPRODUCED, the author's README §10 exits and verdicts row for row.

### 7b · WebKit (the bank; self-tests first, then the batteries, then served)

| Row | Control exit | Tree exit | Reading | zone inuse | load start → end (row start clock) |
|---|---|---|---|---|---|
| glyph-pop `--self-test --dprs 1,2` | — | 0 | 0 WRONG; SLK20 0.9085 OK; `g5tol` HEAD12 tolerated GREEN (5), unplanted control RED, 8 % RED | 12,134 → 12,203 | 15.53 → 14.97 (13:00:04) |
| rest-probes `--self-test` | — | 0 | 0 WRONG; CLEAN holds 2; ANC55 refused (HR1); HR1ONLY by HR1; HR2ONLY by HR2 (0.55) | 12,173 → 12,196 | 11.27 → 10.34 (13:03:05) |
| edge-bands `--self-test --dprs 1,2` (banked, pre-roster) | — | 0 | 0 WRONG, 0 DRAWN rows | 12,196 → 12,207 | 10.34 → 9.04 (13:03:41) |
| postpaint `--self-test` (v2 bytes) | — | 0 | 0 WRONG, 0 U5/U6 rows | 12,207 → 12,183 | 9.04 → 12.72 (13:05:33) |
| glyph-pop `--sabotage-battery` | — | 0 | 5/5 (G5core, G3clamp, anchor, g4tol, **g5tol**) | 12,183 → 12,224 | 12.72 → 8.61 (13:07:08) |
| rest-probes `--sabotage-battery` | — | 0 | 4/4 (HR1, HR2 among them) | 12,224 → 13,116 | 8.61 → 8.23 (queued 13:10:47, ran ~14:33; 83 min in the queue) |
| edge-bands `--sabotage-battery` (banked bytes) | — | **UNREAD** | queued 14:34:12, still waiting at 15:16 behind 8 machine-wide WebKit jobs (glass-ui ×2, u-build, others); stopped unstarted. The superset library (`t2/runf`, banked + `struck-10`) read 11/11 in WebKit (§6b), every banked clause B0–B7/ownfill/inkkey among them | 12,224–13,634 | |
| postpaint `--sabotage-battery` (banked = homes v2 bytes) | — | **UNREAD** | never queued (after edge-sab). The superset (`t2/runf`, v2 + `struck-18`) read 7/7 in WebKit, the five v2 clauses among them | | |
| postpaint `--self-test --sampler-only --reps 16` | — | **UNREAD** | never queued | | |
| served glyph / edge / rest, control and tree (6 rows) | **UNREAD** | **UNREAD** | never queued | | |

## 8 · Beside the rows: consumer readings and the seek probe

**Two WAVE consumers on the banked bytes** (`t2/wave` = the WAVE union + `homes.on-WAVE.diff`, `guarded --light`):

- `check-motion-bands --self-test` exit 1. Its ✗ lines are B2 CLOSED 1, B6 RATCHET 1, B11 KIND FENCE 1, **B13
  ARITHMETIC 2** (`src/pencil/chrome/MarginNote.vue:314` `reduced ? 0 : MOTION.rungs.note`, `src/pencil/grid/gridPaths.ts:737`'s
  ternary), plus the two negative-negative SELF-TEST lines (presenceInkMs 400; `74a2b5d9` not in the clone). That's
  README §10's reading: the two new B13 readings are WAVE product readings that §13 owes.
- `check-peer-tin --self-test` exit 1, gate 4 RED with 8 findings, 4 colour literals within ΔE 0.03 of an arm. **The
  nearest innocent literal reads ΔE 0.0315 at `src/pencil/config/pencilConfig.ts` `#D16A32 → #e06600`, not README
  §10's `e2e/lib/edge-bands.mjs [102, 178, 255]` at 0.0307.** Both gate-4 lines in this run's log say 0.0315 at
  `pencilConfig.ts`. The fixture literal is in the banked edge-bands bytes too (2 hits on `t2/run`, `t2/runf` and
  `t2/wave`), so the bytes don't explain the move. The author overlaid the full `ac862f1e` bytes on the WAVE, and this
  run applies the banked on-WAVE step. The divergence is UNRESOLVED here and is declared, not explained. Either way the
  nearest innocent literal sits 0.0007–0.0015 above the 0.03 bound.

## 9 · Incidents, self-declared

1. **The first homes-check sitting** (10:08, the scratch the README names) stopped mid-cut. It had been cutting a
   bank of its own (`cut/homes.diff`, 531,611 B, on the work tree's bytes of that hour), not checking one. Nothing
   from it is used here. This sitting built fresh archives under `t2/` and read the banked files only.
2. **Rig build exit 1** without `csp-solver/data` (the sudoku-templates plugin); the data was added from the
   `74a2b5d9` archive and the second build exits 0 (§3).
3. **The WebKit queue, twice re-ordered.** The first chain queued the folds' WebKit rows while the bank's chromium rows
   were pending (against LAWS P9 §B). It was stopped at 11:06 while its WebKit row waited for the lock, never started,
   and re-launched chromium first (`trash/wk-requeue/`). At 13:01 the chain was stopped again while `webkit-run/glyph-sab`
   waited, and re-launched with the bank's self-tests first (`bat/chain2.sh`, rows read earlier skipped). The first
   kill in that step missed (two pids matched) and moved the waiting row's log to `trash/wk-requeue2/` a step before the
   real stop; no row ran in that window and no exit file was written. The lane never ran two heavy runs at once.
4. **Server refresh at 12:18.** Both previews (guarded `--timeout 90`, started 11:00) were stopped by recorded pid
   (cwd checked: `w7-control/web/frontend` and `t2/runf/web/frontend`) and restarted while `webkit-runf/tree-roster`
   waited for the lock, so no row ran across the 12:30 cap. The control's restart waited about 2 minutes for a heavy
   slot. No row ran while either port was down: the next served row's own check reads both 200 with their identities.
5. Stall law: every battery ran in the background; the waits were `timeout ≤ 95 tail -F` on the lane's log.
6. A stray empty file `CHECK.md.parts-7b` existed beside this one for one step (an `>>` with an empty heredoc). It was
   moved to the lane's trash the same step.
7. **The seek probe is UNREAD in both engines.** The chromium run queued at 15:16:40 for a browser-pool slot (6 waiters,
   the machine-wide WebKit queue holding pool slots). It never started (the guard log has no start line for it) and
   was abandoned at 15:27. The WebKit run was never queued. So the in-page write log U6 assumes is still unexercised by
   any plant, the author's or this lane's.

## 10 · Summary (numbers first)

- **Bank shas match the README:** `homes.diff` `be9a5af6`, 513,021 B, 13 paths (11,425+/1−); `homes.on-WAVE.diff`
  `88b48d94`, 110,429 B, 8 paths (1,686+/69−); `struck-10` `4f5effd2`, 18,723 B; `struck-18` `184553a1`, 13,763 B.
- **Apply-checks, all exit 0, each scratch its own `.git`:** `homes.diff` on `74a2b5d9` and on `1d0dc4fd` (13 paths
  each); `homes.on-WAVE.diff` on the WAVE union, s10 and s13-s7-s3 (8 paths each); `struck-10` and `struck-18` on
  `74a2b5d9` + `homes.diff` and on the WAVE + on-WAVE (2 paths each). The declared base of the on-WAVE step is homes v2
  `d17813ba`, blob-equal on all 13 paths in all three integrated trees. Every equality holds: `cd5914b1` twice and
  `ac862f1e` once, 13/13 blobs each.
- **Browserless:** shape-census self-test 156/156 exit 0; sabotage 100/100 exit 0; born-RED on v2 139/156 exit 1, with
  the 17 failing rows equal to README §10's 17. 0 `docs/` imports, 0 absolute imports, 0 scratch-path hits.
- **Conditional folds: both REPRODUCED in both engines** (§6c). Nothing is struck by this check.
- **The bank, chromium:** 9/9 library rows exit 0, 3 served rows with control and tree exits equal (1/1, 1/1, 0/0).
- **The bank, WebKit:** read: glyph-pop, rest-probes, edge-bands and postpaint self-tests, each exit 0; glyph-pop
  sabotage 5/5; rest-probes sabotage 4/4. UNREAD: edge-bands and postpaint sabotage on the banked bytes (each read in
  WebKit on its superset library, §6b), the postpaint r16 stress, and the 6 served rows.
- **π and AA:** the homes touch no product path. The tree's dist CSS is 7/7 byte-identical to the control's (96,800 B),
  and JS `index-BOytrTnLSO5X.js` is the author's. No paint row in this check is a verdict on the product. No crops.
- **Box:** zone inuse ran 10,178–13,634 for the whole sitting, under 8M, so the zone stopped no row. The 1-minute load
  ran 7.99–23.20, under 120. The WebKit queue was what stopped the rows (§9.3, §9.7).
- **Instruments by relative product path:** `web/frontend/scripts/shape-census.mjs` (+ `.d.mts`), and `web/frontend/e2e/lib/`
  `{glyph-pop,edge-bands,rest-probes,postpaint,paint-lib}.mjs` (+ `.d.mts`), `web/frontend/knip.json`.
- **Replay:** `bat/setup2.sh` (trees and checks), `bat/bl.sh` (browserless), then
  `STEPS="banked:webkit" zsh bat/chain2.sh` (it skips the rows read already, so it picks up at `edge-sab`). The
  seek probe is `node e2e/lib/zz-hc-seekprobe.mjs --engine <e>` on `t2/runf`. All of these live in the lane's scratch,
  `pass10/homes-check/`.
