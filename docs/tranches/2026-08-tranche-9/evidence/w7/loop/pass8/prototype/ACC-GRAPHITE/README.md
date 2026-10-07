# Pass 8 · ACC-GRAPHITE · the unblock read

Registry-v7 ruling 2; pass8/CHAIR-RULINGS §2.3. Opus lane, 2026-10-06 12:50–13:30. Tree `.claude/worktrees/wf_f72f3b5a-83a-40`, the pass-7 bank (`beecfecc`) advanced in place on `74a2b5d9`, no commit. Box load 26–160 (1-min) across the runs; every run's own load is in `readings/g2-band.summary.txt`.

## 0 · The three answers

1. **Precondition (i) HELD.** VERB's un-clipped frame is on the §13 tree and on the pass-8 union (§1).
2. **As banked, the band is RED at the three 1× touch rigs** even on the whole frame: 1.282–1.330. The cause is the pass-7 rig key, `(pointer: coarse) and (max-resolution: 1dppx)`, which hands every 1× tablet the thin pass.
3. **Re-keyed on the board's device-pixel span, the band reads inside [1.35, 1.45] at all five rigs, both engines, under `band.crit.ts` GATE=1**: 1.370–1.435 under A.1's top/bottom statistic, 1.375–1.433 under the stamped perimeter. The re-key is a product change this lane made (§3). The verdict and its limits are in §6.

## 1 · Precondition (i): the frame landed

| Check | Reading |
|---|---|
| §13 tree on disk vs VERB's bank, through a temporary index (`GIT_INDEX_FILE`, `read-tree 8c12b15c`, `diff-files` against the tree) | 0 files differ, 0 untracked |
| `gridPaths.ts` blob: disk / bank `8c12b15c` / base `74a2b5d9` | `6cc5fc63` / `6cc5fc63` / `17210770` |
| The line | `const FRAME_Y_PAD = FRAME_X_PAD;` (base: `= 0`) |
| The union, `pass8/integrate/s13-s7-s3.diff` (sha1 `3325c690`) | carries the same hunk; applies 0 on `74a2b5d9` |

No git command ran inside the §13 tree or the control tree. The object reads went through this tree's shared store.

## 2 · What was applied to this tree

| Step | Source | Result |
|---|---|---|
| homes | `pass8/instruments/homes.diff`, sha1 `a1d8adeb` verified | 6 files applied; `knip.json` conflicted with the pass-7 entry and was merged by `git merge-file`, taking the homes entry list |
| imports | `check-ink-pressure.mjs`, `check-theme-tokens.mjs` | re-pointed from `./lib/shape-census.mjs` to `./shape-census.mjs`; the pass-7 fork `scripts/lib/` moved out to `scratchpad/trash-graphite8-1` |
| VERB's frame | `git diff 74a2b5d9 8c12b15c -- gridPaths.ts`, sha1 `e9d99164`, 2,988 B (`instruments/verb-frame.from-8c12b15c.diff`) | applies 0 |
| VERB's unit row | `gridPaths.frame.test.ts`, sha1 `99566e1b` | 6/6 on this tree; its in-file negative (HEAD's ring, `FRAME_Y_PAD` 0) reds every pose |
| the span key | this lane, §3 | `GameBoard.vue` +18/−0, `gameCell.css` +9/−10, one comment line in `gridPaths.ts` |

Dists, each built in the tree and again from a clean `git archive` of the write-tree outside any worktree, `diff -r` empty, served CSS byte-equal to the clean build, 42 `@property` (the control's 42):

- Arm A, frame + pointer key: write-tree `0cf1b67b`, `index-tuQkJelgcXeL.js`.
- Arm B, frame + span key, **the tree as banked**: write-tree `d49b0ea4`, `index-BZCqKMY6sHN9.js`.
- Control: `w7-control`, `index-CubiZsMVSwTc.js`, on :4260. Tree on :4259.

## 3 · The span key

`GameBoard.vue` measures `.board-wrapper`'s layout width (`useLayoutBoxSize`, the composable the grid's bake already uses) and sets `data-raster="small"` when width × `devicePixelRatio` is under 480. `gameCell.css` replaces the pointer media block with one rule: `[data-raster="small"] … .cell-ghost-retrace { stroke-width: 12 }`. Everything else takes 15.

The probe (`instruments/raster.crit.ts`), both engines identical:

| Rig | Span (device px) | Pointer | `data-raster` | Second pass |
|---|---|---|---|---|
| desk 1280×800 | 636 | fine | none | 15 |
| phone 393×699 | 365 | coarse | small | 12 |
| tablet 768×1024 | 668 | coarse | none | 15 |
| tablet 1024×768 | 604 | coarse | none | 15 |
| laptop 1280×800 coarse | 636 | coarse | none | 15 |
| phone 812×375 | 347 | coarse | small | 12 |
| phone 393×699 DPR 2 | 730 | coarse | none | 15 |
| desk DPR 2 | 1272 | fine | none | 15 |

Why 480: 15 units reads 1.501 cr / 1.471 wk on the 365 board (the sweep, RED), and 12 reads 1.282–1.330 on 604–668 (arm A, RED). The threshold sits between 365 and 604. **No board between 366 and 603 device pixels was read.**

## 4 · G2, five rigs, both engines

Payload `mintBoard(3, 30)`, light, PRM reduce, DPR 1. `band.crit.ts` is the pass-6 stamp byte-identical (sha1 `dc5bfa51`) for desk and phone. The three touch rigs need a rig list the stamp does not have, so they ran through the pass-7 critic's copy `bandc.crit.ts` (sha1 `f256121a`): the same statistic, `RIGS`/`STAT` by env. On desk and phone the two instruments agree to the thousandth. Each cell is perimeter / top-bottom (A.1).

**Arm B, the tree as banked (span key). GATE=1 exit 0 in all six runs.**

| Rig (span) | chromium | webkit | Control cr / wk (perimeter) |
|---|---|---|---|
| desk (636) | 1.380 / 1.376 | 1.430 / 1.430 | 0.300 / 0.300 |
| phone (365) | 1.394 / 1.389 | 1.375 / 1.370 | 0.270 / 0.118 |
| tablet 768×1024 (668) | 1.386 / 1.385 | 1.422 / 1.420 | 0.294 / 0.290 |
| tablet 1024×768 (604) | 1.429 / 1.430 | 1.433 / 1.435 | 0.312 / 0.310 |
| laptop coarse (636) | 1.380 / 1.376 | 1.430 / 1.430 | 0.300 / 0.300 |

Range 1.370–1.435. The margins are 0.020 below (WebKit phone, t/b) and 0.015 above (WebKit 1024×768, t/b).

**Arm A, the pass-7 pointer key on the whole frame. GATE=1 exit 1 in both engines, both statistics.**

| Rig (span) | chromium | webkit |
|---|---|---|
| desk (636) | 1.380 / 1.376 | 1.430 / 1.430 |
| phone (365) | 1.394 / 1.389 | 1.375 / 1.370 |
| tablet 768×1024 (668) | **1.290 / 1.289 RED** | **1.331 / 1.330 RED** |
| tablet 1024×768 (604) | **1.313 / 1.314 RED** | **1.315 / 1.317 RED** |
| laptop coarse (636) | **1.286 / 1.282 RED** | **1.328 / 1.328 RED** |

**The frame as painted.** On the tree the four sides agree: desk chromium t/b/l/r 7.383/7.489/7.391/7.315 px, phone 4.085/4.104/4.063/4.061. The svg-edge touch on top and bottom is 0 (control: 1). On the control the top and bottom are half strokes: 3.12/3.88 against 7.39/7.32. So at the five rigs the perimeter median and A.1's t/b median now differ by at most 0.025 px, and the two ratios by at most 0.005.

**Off-charter rows, report only (arm B, t/b):**

| Rig (span) | chromium | webkit |
|---|---|---|
| phone 812×375 coarse (347) | **1.346 RED** (perimeter 1.357) | 1.388 |
| phone 393×699 DPR 2 (730) | 1.402 | 1.419 |
| desk DPR 2 (1272) | 1.384 | 1.380 |

## 5 · Plants and the born-RED

All on arm B's dist, tree arm only, by injected CSS, GATE=1, rigs desk / phone / tablet 768×1024, t/b statistic unless named. Clean in the same battery: exit 0.

| Plant | chromium | webkit | Exit |
|---|---|---|---|
| second pass removed | 0.729 / 0.841 / 0.761 | 0.763 / 0.818 / 0.769 | 1 / 1 |
| second pass 20 units | 1.535 / 1.668 / 1.549 | 1.592 / 1.632 / 1.601 | 1 / 1 |
| the pointer key put back | 1.376 / 1.389 / **1.289** | 1.430 / 1.370 / **1.330** | 1 / 1 |
| the frame re-clipped (`svg.hand-drawn-grid { clip-path: inset(1.2% 0) }`), t/b | 2.307 / 2.311 / 2.786 | 3.007 / 2.718 / 2.865 | 1 / 1 |
| the same clip, stamped perimeter | 1.454 / **1.430 inside** / 1.478 | 1.496 / **1.415 inside** / 1.478 | 1 / 1 |
| X6, the ring with no sides (`.cell-ghost { clip-path: inset(0 22% 0 22%) }`) | 1.376 / 1.389 / 1.385 | 1.430 / 1.370 / 1.420 | **0 / 0** |
| 15 units everywhere (the sweep, arm A's dist, perimeter, no gate) | phone **1.501** | phone **1.471** | — |

- **Born-RED for the span key:** arm A is this tree before the cure (three rigs RED, both engines), and the pointer plant reds the tablet on arm B in the same battery as the clean exit 0.
- **The perimeter statistic cannot see a re-clipped frame at the phone.** It passes 1.430 / 1.415 with half the top and bottom stroke gone. A.1's t/b statistic reds it at every rig.
- **X6 is still invisible to G2.** The gate reads the top and bottom of the ring only.
- No clause-sabotage battery: this lane re-cut no source gate.

## 6 · Verdict

**The band lives at the five ruled rigs, on this tree, with the span key.** Conditions (i) and (iii) are met. Condition (ii) is the chair's: this record offers A.1's t/b statistic as the one to stamp, because on the whole frame it equals the perimeter to 0.005 at the five rigs and it is the only one of the two that reds a re-clipped frame at the phone.

What the verdict does not cover:

- **Not read on the union.** GRAPHITE is out of `s13-s7-s3` and the cumulative diff does not apply there (12 files fail, 8 already exist). A.7 stays UNMET and no on-union delta was cut. Registry-v7's batch-6 row asked for the read on the union.
- **The upper margin is 0.015.** WebKit sits at 1.420–1.435 on every board of 604+ device pixels. One light theme, one payload, one cell, one run per cell; the desk, phone and tablet reads repeated to the thousandth across five runs of the same dist, so the spread is the raster's, but no second payload or theme was read.
- **A sixth rig reds by 0.004.** Chromium at 347 device pixels reads 1.346 under t/b.
- **366–603 device pixels is unread**, and 16×16 was not read at any rig.
- **Without the span key the family is where pass 7 left it.** The key is new product code with a behavioural probe and no unit row.

## 7 · Gaps and costs

1. **`lint:ink` reds on this tree: exit 1, 28 violations; control 0.** Re-pointing to the ONE library brought its computed-key read, which returns 14 `script-key-computed` sites flagged unresolved (object-literal keys such as `persistence.ts:275 [sizeField]`). The pass-7 wash gate treats each as a wash publisher. `check-theme-tokens` prints the same 14 as "printed, not proven" and exits 0. Not cured here: the wash gate travels to SIX, and the choice between a consumer filter and a narrower library read is not this lane's.
2. **`gridPaths.tally.test.ts` reds 3 of 6; MOVED by the frame.** The ring's perimeter is shorter by 48 units, so the 9×9 frame holds 55 seventy-unit pitches, not 56. The three rows hard-code 56. The law they state still holds at 55 (`instruments/gridPaths.tally.test.MOVED-56-to-55.PROPOSED.diff`, 6/6 on a scratch archive, not applied). The product cost: a board with 56 writable cells no longer gets one tick per cell. This rides the OUTSIDE tally graft to SIX.
3. π (whole-DOM), AA, the filter census, goldens, G1/G1b, G4, G10, print and forced colours were **not run**. `data-raster` is a new attribute on `.board-wrapper` on small rasters.
4. The dark theme, `prefers-contrast: more` and `no-preference` motion were not read for the band.
5. No frames banked. Headroom spent: 0 B. `check-evidence-policy` PASS.

## 8 · The battery

On `git archive` extractions of the tree's write-tree and of `74a2b5d9`, bare (`readings/battery.tsv`):

| Gate | Tree | Control |
|---|---|---|
| `eslint .` | 0 | 0 |
| `npm run lint` | 0 | 0 |
| `lint:lanes` | 0 | 0 |
| `lint:theme-tokens` | 0 | 0 |
| `lint:sleep` | 0 | 0 |
| `lint:ink` | **1** | 0 |
| `lint:knip` | 0 | 0 |
| `test:e2e:projects` | 0 | 0 |
| `check-pw-projects` | 0 | 0 |
| `check-property-block` (source) | 0 | 0 |
| `vue-tsc -b` | 0 | 0 |
| vitest `src/games/shared` | 0 (431 tests) | 0 (429) |
| vitest `src/pencil` | **1** (99 of 102) | 0 (73) |

`lint:bands` and `lint:verbs` do not exist on this base. `check-property-block --dist/--served` was not run.

## 9 · Bank

| | |
|---|---|
| Write-tree | `d49b0ea4b491acbb7d288c5caedffd0c8efb2070` (the same at the battery and at the cut) |
| `pass8.diff` | 452,603 B, sha1 `7df035cf`, 31 files +9,016/−195; `git apply --check` 0 on a fresh `git archive 74a2b5d9` |
| `pass8.delta.diff` | over `beecfecc`: 343,687 B, sha1 `625cf345`, 14 files +6,870/−425; `--check` 0 on `beecfecc`. It carries homes. |
| `pass8.delta.own.diff` | the same delta on `src/` and the two re-pointed scripts: 14,175 B, sha1 `ff0167d8`, 6 files +188/−22 |
| On the union | `--check` 1; no on-union delta |

Instrument imports in the tree: `scripts/check-ink-pressure.mjs` and `scripts/check-theme-tokens.mjs` → `./shape-census.mjs`. No import from `docs/`. The band instruments are not homes; they ran as copies from a scratch directory outside the tree.

## 10 · Replay

`instruments/`: `build.sh <name>` (tree + clean build, diff) → serve the tree dist on :4259 and the control on :4260 → `band.sh <tag> <spec> [env]` → `battery-b.sh` (the arm-B rows and plants in order) → `prereturn.sh tree|ctl` → `cut.sh <name>`. The specs sit in one directory with `band-lib.ts`, `band-stat.mjs` (pass6/instruments), `bandc.crit.ts` (pass7/critique/ACC-GRAPHITE/instruments), `e2e/wire.ts` and `src/lib/base64url.ts` copied beside them, and `node_modules` symlinked. The scripts carry this session's scratch paths.

## 11 · Incidents

- `git apply --3way` of homes refused whole (`knip.json` does not match index); applied with `--exclude` and merged `knip.json` by `git merge-file`. A `git restore --staged web/frontend` ran after the refusal; the index was already clean.
- One foreground command hung 120 s on `npx --no-install json5` and was backgrounded by the harness; the `npm exec` process (PID 98940, this lane's) was killed.
- Two foreground waits ran past 115 s and were backgrounded by the harness.
- A zsh no-match aborted one polling line and one monitor; re-run under bash.
- Listeners killed by recorded PID after checking wrapper ancestry and cwd: 10887/10767 and 51639/51605 (:4259, this lane's scratch), 11209/11172 (:4260, this lane's control server).
- The arm-B edit was made after arm A's battery and the sweep had ended; no battery ran on an edited tree.
- No `rm`. No git in the control or §13 tree. No commit. Nothing written under main's `src`, `e2e` or `scripts`.
