# Pass 9 · batch 0 · homes v2 — the NON-AUTHOR CHECK

The check of `homes.diff` / `homes.on-WAVE.diff` (the instruments lane's return) by a reader that did not write them.
Read-only on every worktree; no git on main or in the control tree; no commit, push, stash, install or deploy. Scratch is
the durable lane dir `work/pass9/homes-check/`; every exit below was read bare from a file the command wrote.

## 1 · The banks

| Check | Read | Claimed (README) | Reproduced |
|---|---|---|---|
| `homes.diff` sha1 | `1f70cfda9b672bb600378c00b4a7fa4900ec91d0` | same | YES |
| `homes.on-WAVE.diff` sha1 | `a0f8e6f3cf2c77a62c8f85eea9c3b10df4c2cbef` | same | YES |
| `README.md` sha1 | `c3885eb747842f3438b36ac91604d08ac5a8d689` | c3885eb7 | YES |
| bytes | 437,922 / 174,269 | same | YES |
| shortstat (from the diff text) | 13 files +9808 −1 / 11 files +2484 −239 | same | YES |
| `apply --check` on a fresh `git archive 74a2b5d9` | exit 0, 13 paths | 0, 13 | YES |
| `apply --check` on a fresh `git archive 1d0dc4fd` | exit 0, 13 paths | 0, 13 | YES |
| the archive equals `74a2b5d9` | index tree `5fd59288` = `74a2b5d9^{tree}` (the `docs/precepts` gitlink re-added by `--cacheinfo`; an archive drops it) | — | YES |
| `WAVE.diff` on that archive | exit 0, 132 paths, tree `acb9c08e` | `acb9c08e` | YES |
| `homes.on-WAVE.diff --check` on the union | exit 0, 11 paths | 0, 11 | YES |
| applied for real: index trees | `d17813ba` (74a2b5d9 + homes) · `acde977b` (union + on-WAVE) | `d17813ba` · `acde977b` | YES |
| bank grep: `scratchpad`, `/private/tmp`, `/tmp/`, `.claude/t9-scratch` | 0 / 0 | 0 | YES |
| bank grep: `^+++ .*/\.` (dot-dirs) | 0 / 0 | 0 | YES |
| import specifiers from `docs/` in the 12 landed code files | 0 | 0 | YES |
| absolute-path import specifiers | 0 | 0 | YES |

Every `git apply` ran with `GIT_CEILING_DIRECTORIES` at the check's scratch root and the path count printed (the lane's
incident 1: an archive inside the repo discovers main's `.git` and skips every path with exit 0). The imports are
`./paint-lib.mjs`, `@playwright/test`, `node:*`, `vue`, and plant-fixture text (`./StagingBand.vue`, `../theme/x.pcss`,
`@pencil/Glyph.vue` inside virtual-tree strings); line 5 of `shape-census.mjs` cites a `docs/` path in a COMMENT only.

## 2 · Browserless — `scripts/shape-census.mjs` on `74a2b5d9` + homes.diff

| Row | Read | Claimed | Reproduced |
|---|---|---|---|
| `--self-test` | 136/136, 0 fail, clauses planted 83/83, exit 0 | 136/136, 83/83, 0 | YES |
| `--sabotage-battery` | 83/83 clauses red the self-test when deleted, exit 0 | 83/83, 0 | YES |
| born-RED: `--self-test --lib <v1>` (v1 = pass8/instruments/homes.diff, sha1 `a1d8adeb`, applied to its own archive) | 91/136, 45 fail, exit 1 | 91/136, 45, 1 | YES |
| `--tree` on `74a2b5d9` + homes (anchor absent) | 14 FAIL, exit 2 | 14, 2 | YES |
| `--tree` with the v1 library on the same tree | 14 FAIL, exit 2; FAIL lines identical to v2's | 14, 2 | YES |
| `--tree` on the WAVE union + homes.on-WAVE (anchor present) | 0 FAIL, exit 0 | 0 | YES |

## 3 · Spot checks — three folded plants RED, three refusals' reasons

Each folded clause switched off alone (`SHAPE_SABOTAGE=<id> --self-test`): its own row, and only its own row, reds; the
same row reds on v1 (the born-RED); the plant's bytes read by `od -c`.

| Clause (family) | Sabotaged | v1 | Plant bytes |
|---|---|---|---|
| `prop-escape` (ERASE) | 135/136, exit 1: the `font-famil\79` / `@property --motion\-whisper` row | FAIL | `B = String.fromCharCode(92)`; `od -c` reads `f a m i l $ { B } 7 9` and `- - m o t i o n $ { B } - w h i s p e r` — assembled at run time |
| `u-escape4` (chair re-cut of TIN) | 135/136, exit 1: the `\u0023ffb2f3 → #ffb2f3` row | FAIL | `od -c` reads `q ( B + B + " x 2 3 f f " )` and `" u { 2 3 } f f "`: no literal escape the tool layer could decode |
| `publisher-split` (GRAPHITE) | 135/136, exit 1: `{ [sizeField]: 1 }` beside `{ '--plant-q': 2 }` | FAIL (`L.publishers is not a function`) | plain text, no escapes |
| `class-ternary` (TAPE; RULE's plant grafted) | 134/136, exit 1: TAPE's T1 row AND RULE's row, both | both FAIL | plain text |

| Refusal | The reason, re-derived | Holds |
|---|---|---|
| PAL-TIN `unescapeJs` as cut | The v1/TIN function, run alone on the u-escape4 cases: `\u0023ffb2f3` → `⏿b2f3` (code points 23ff,62,32,66,33: five-plus hex digits taken); `\\x23ff` → `#ff` (the escaped backslash re-decoded by the second `.replace` pass; want `\x23ff`); exit 1 | YES |
| CTRL-RULE `class-ternary` code | RULE's PROPOSED diff and TAPE's carry the SAME clause id and the same reading (a `:class` ternary of string literals binds only those classes); TAPE's also reads a nested else-arm and Tailwind punctuation. v2 keeps TAPE's code and RULE's plant under the one id; sabotaging it reds both plants | YES |
| ACC-GRAPHITE `gridPaths.tally.test` 56→55 | The PROPOSED diff patches `web/frontend/src/pencil/grid/gridPaths.tally.test.ts`: `--check` exit 1 on `74a2b5d9` AND on the WAVE union ("No such file or directory"); the file is born in GRAPHITE's own `pass8.diff`. A `src/` unit test, not an instrument home. Nuance: it does not apply on the union alone either; it rides only on top of GRAPHITE's own on-WAVE delta | YES (with the nuance) |

## 4 · Browser libraries — fixtures, both engines, on `74a2b5d9` + homes.diff

Each row is `node e2e/lib/<lib>.mjs …` from the scratch tree, launched only at a 1-min load < 120 (none waited), exit
written by the battery to `bat/<row>.exit`. Self-tests at DPR 1,2 where the library takes `--dprs`. Load = 1-min at start → end.

| Library | chromium self-test | webkit self-test | chromium sabotage | webkit sabotage |
|---|---|---|---|---|
| `glyph-pop.mjs` | exit 0 · 182 rows · FILE anchor G3 rows 8 · 0 holes · 55.1→56.2 | exit 0 · 182 rows · 8 · 0 holes · 35.8→43.8 | 4/4 (G5core, G3clamp, anchor, g4tol), exit 0 · 42.7→46.0 | 4/4, exit 0 · 61.9→56.7 |
| `edge-bands.mjs` | exit 0 · 132 rows · 56.2→48.2 | exit 0 · 132 rows · 43.8→44.6 | 8/8 BITES (B0–B6, ownfill), exit 0 · 46.0→38.5 | 8/8 BITES, exit 0 · 56.7→56.1 |
| `postpaint.mjs` | exit 0 · U1–U4 OK · TASK born-RED r1–r3 RED · LEN 119 frames / ruled EMPTY · RANGE 1 / box EMPTY · 48.2→41.6 | exit 0 · LEN 98 / EMPTY · RANGE 1 / EMPTY · 44.6→58.7 | 5/5 (F1, F1ct, CI, key-inraf, stale), exit 0 · 38.5→39.2 | 5/5, exit 0 · 56.1→62.1 |
| `rest-probes.mjs` | exit 0 · CLEAN/LATE/ANIM as the law · 41.6→42.7 | exit 0 · 58.7→61.9 | 2/2 (confirm, anim), exit 0 · 39.2→35.8 | 2/2, exit 0 · 62.1→55.4 |

All sixteen rows reproduce the README's table (glyph 182 rows and the 8/8 FILE anchor, edge 8/8, postpaint 5/5, rest 2/2).

## 5 · Served rows — the control `:4256` beside the scratch tree `:4233`

Control = `w7-control` dist `index-CubiZsMVSwTc.js` (listener PID 76630, wrapper 76564). Tree = `74a2b5d9` + homes.diff,
built in the scratch with a scratch vite config (cacheDir in the scratch), dist `index-BOytrTnLSO5X.js` (listener 76809,
wrapper 76688). Both killed by recorded PID after a cwd check; both ports free afterwards. Load 1-min 47.8–57.0 at every
row's start (each row 2–11 s).

| Row (1280×800 DPR 1 light unless named) | chromium ctl / tree | webkit ctl / tree | README |
|---|---|---|---|
| glyph `.section-heading`, `default-deal-desk` | exit 1 / 1: median 4.659 both, G4 column 4 at 2.63 | exit 0 / 0: median 4.659 both | same |
| edge `.drawer-case` | exit 1 / 1: B4 top 0.061 > 0.02, 16 stations in 1 run, median 17.359 | exit 1 / 1: the same notch | same |
| rest `.drawer-tab` tap, 390×844 touch | exit 0 / 0: one toggle | exit 0 / 0: one toggle | same |
| GA1 `.board-peek-host`, `g`, `/?game=sudoku`, desk + phone, 2 reps | exit 1 / 1: F1 RED 4/4 each; ct 7.7–9.5 / 6.9–8.3 ms; centre 21–93 px | exit 1 / 1: F1 RED 4/4 each; ct 66–77 / 59–62 ms; centre 33–134 px; stale 2–5 | exits same; ct/centre/stale within the lane's spans except WebKit ct (lane 68–122, here 59–77) — a timing spread, no verdict moves |

Every exit is identical control vs tree, both engines, and identical to the README's.

**Dist identity (T9-R6).** Served CSS: 7/7 files byte-identical to the control's dist. The first scratch build was NOT:
an extracted archive is no git repo, so Tailwind's scanner ignored `.gitignore` and minted 1,428 extra rules (index CSS
228,921 B against 93,634 B). A pristine `74a2b5d9` archive built in the same layout produced the byte-identical 228,921 B
file, so homes v2 adds 0 rules; with a gitfile pointing at the scratch index the rebuild reads 7/7 identical. JS chunks
differ (main's `node_modules` at `4131e427`), as the README says.

## 6 · The RAF-mover stress — `postpaint.mjs --self-test --sampler-only --reps 16`

| Engine | exit | clean movers GREEN | plants RED | TASK born-RED | holes | load start → end |
|---|---|---|---|---|---|---|
| chromium | 0 | 32/32 | 64/64 | 16/16 | 0 | 50.1 → 55.6 |
| webkit | 0 | 32/32 | 64/64 | 16/16 | 0 | 55.6 → 33.7 |

Reproduces the README's 32/32 · 64/64 · 16/16 per engine. The postpaint self-test is deterministic on this run (LAWS P8 §F).

## 7 · π, AA, filterBudget

- **π vs `74a2b5d9`: nil.** Both banks touch only `web/frontend/e2e/lib/*`, `web/frontend/scripts/shape-census.*` and
  `knip.json` (13 / 11 paths, listed from the headers); no `src/` byte.
- **AA:** the served paint reads are equal on control and tree (§5). **filterBudget** untouched (9): no `src/` path.

## 8 · Incidents (this check, self-declared)

1. The first `shape-census --self-test` was started with a shell `&` and not `run_in_background`; its exit was still
   written by the command to a file and read bare.
2. One response carried two tool calls (the two `vite preview` servers).
3. The first scratch build minted 1,428 Tailwind rules from the non-git archive layout (§5); declared, controlled by a
   pristine build in the same layout, re-built with a gitfile; the served rows ran on the re-build.
4. Several foreground waiters hit their 85 s ceiling and were moved to the background by the harness; none ran past 120 s
   in the foreground.
5. No `rm` (discards went to `trash/`); no git on main or in the control tree; the `git archive`s were cut through the
   `w7-p8-homes` worktree, read-only. The scratch git dirs carry an index only, never a commit.

## 9 · Not checked here (gaps)

- The WAVE union's seven consumers (`lint:ink`, `lint:theme-tokens`, `lint:tape-foot`, `lint:bands`, `test:font-coverage`,
  `lint:motion`, `lint:knip`) and `typecheck:e2e` with RULE's three-line cure: the lane's claim, not re-run here.
- The `--self-test --dprs` matrix ran at DPR 1,2 in the default scheme set; light/dark is whatever the self-test iterates
  (both, by its rows), not a separate run.
- The lane's own gaps stand: `authoredStroke` (SELF's, ruling 7), LADDER K1/K3/K11/K15/K16, the bare-identifier `:class`
  array, LADDER's three clauses unread by LADDER's critic, the link law's behavioural twin (TAB-PEN).
- GRAPHITE's tally test reason holds with a nuance: it applies neither on `74a2b5d9` nor on the union alone (§3).

## Verdict

Every row the DO list names reproduced: both shas, all three `apply --check`s at 0 with their path counts and tree ids,
0 docs/ and 0 absolute imports, 0 contaminants, the shape-census self-test / sabotage / born-RED / `--tree` rows, the
sixteen browser battery rows in both engines, the served rows' exits on control and tree, and the stress. Three folded
plants red only their own rows; three refusals' reasons hold. **reproduced = true.**
