# T5-W1.14 — the coverage instrument and its baseline (GAP-6)

**Row**: W1.14 · **Source**: `r3/completeness-critic.md` §GAP-6 · **Gate**: `gates.json` `W1.coverage`
(`instrument: vitest-coverage`, `baselineBanked: true`, `floorGatesW2Exit: true`)
**Head**: `f38c5130` · **Date**: 2026-08-01 · node v26.0.0 · npm 11.12.1 · vitest 4.1.10 ·
`@vitest/coverage-v8@4.1.10` · jsdom

The audit's finding was not that coverage was low — it was that **no coverage instrument existed
anywhere in the repo**. Rust 208/0/0, py 27/0, FE 332 blocks over 31 files, e2e 206, and no figure
at all for what those numbers reach. W2 then collapses **≈4,150 raw LOC** across five games
(`r2/dup-matrix.md` §5: 56% of the measured normalized surface is destroyable duplicate). This row
puts the instrument in first, so the collapse has a measured floor to clear.

---

## 1 · Born RED

The defect was absence, so the law asks for a canary proving the gate CAN fail. Four banked runs:

| File | What it proves | Exit |
|---|---|---|
| `r1.14-red-01-instrument-absent.txt` | `npx vitest run --coverage` at HEAD: `MISSING DEPENDENCY Cannot find dependency '@vitest/coverage-v8'`, and `node_modules/@vitest/` holds no provider. There was nothing to measure with. | 1 |
| `r1.14-red-02-canary-floor-breach.txt` | A W2-shaped regression: the real summary with every `src/games/shared` file's covered counts halved (37 files, nothing else touched). The gate names **8 breaches** — 4 on `src/games/shared`, 4 on `TOTAL` — with per-metric magnitudes (`53.19% → 26.16%`, −27.02 pts). | 1 |
| `r1.14-red-03-canary-scope-dissolved.txt` | The other W2 failure: the collapse **dissolves** a game. All 14 `src/games/futoshiki` entries deleted. The gate refuses the vacuous pass — `scope "src/games/futoshiki" matched ZERO files` — and demands an explicit `"retired": "<where its code went>"`. | 1 |
| `r1.14-red-04-canary-rebaseline-refused.txt` | The bake cannot become a quiet re-baseline: `--write-floor` against a floor 4 of whose figures would drop exits 1 and names them; `--write-floor` with no sample and no loud opt-out exits 2. The scratch floor is byte-unchanged by both. | 1, 2 |

Plus `scripts/check-coverage-floor.mjs --self-test` — 6 cases on the pure core, run before every
enforcement (the `lint:ink --self-test` house pattern): at-floor is green · a single dipping scope
reds even while TOTAL rises · a vanished scope is structurally RED · an explicitly retired scope
passes · an unscoped file is surfaced · `summary.total` is not trusted.

Green: `r1.14-green-01-coverage-run.txt` — 31 files / 332 tests pass under coverage, then 12 scopes at or
above the floor.

---

## 2 · What the instrument measures

`vitest.config.ts` gains a `coverage` block: provider **v8** (no instrumenting transform, so the
config's plainness pledge for the W5 TS bump survives), reporters `text` + `json-summary` + `json`.

`include` is the whole `src/**` app surface — `.ts` and `.vue`, `all: true` — **never the union of
files a test happened to import**. An unimported module must read 0%, because *"collapsed five
modules into one and lost its only caller"* is the exact W2 failure the floor exists to catch, and
an import-scoped denominator hides it.

Excluded: the units themselves, `*.d.ts`, and `src/main.ts` (the `createApp(...).mount()` bootstrap
— executed by the browser, never by a unit; counting it only adds a permanently-0% file).

**153 files instrumented.** 6,068 statements · 3,468 branches · 1,544 functions · 5,355 lines.

---

## 3 · The instrument jitters — measured before it was trusted

v8 coverage on this estate is **not** run-to-run identical. An n=10 sample (banked whole under
`r1.14-coverage-samples/`, one `--json` aggregate per run) moved as follows. Scopes absent from the table
were byte-identical across all ten runs.

| scope | metric | min | max | spread (pts) | covered min..max | of |
|---|---|---|---|---|---|---|
| `src/games/sudoku` | statements | 52.79% | 53.04% | 0.25 | 208..209 | 394 |
| `src/games/sudoku` | functions | 35.24% | 36.06% | **0.82** | 43..44 | 122 |
| `src/games/shared` | statements | 53.14% | 53.19% | 0.05 | 1174..1175 | 2209 |
| `src/games/shared` | functions | 47.74% | 47.95% | 0.22 | 222..223 | 465 |
| `src/games/shared` | lines | 53.32% | 53.38% | 0.05 | 1025..1026 | 1922 |
| `src/pencil` | statements | 14.61% | 14.86% | 0.25 | 287..292 | 1964 |
| `src/pencil` | branches | 15.16% | 15.34% | 0.19 | 161..163 | 1062 |
| `src/pencil` | functions | 10.02% | 10.66% | **0.64** | 47..50 | 469 |
| `src/pencil` | lines | 15.51% | 15.74% | 0.23 | 269..273 | 1734 |
| `TOTAL` | statements | 35.03% | 35.11% | 0.08 | 2126..2131 | 6068 |
| `TOTAL` | branches | 31.34% | 31.40% | 0.06 | 1087..1089 | 3468 |
| `TOTAL` | functions | 27.13% | 27.33% | 0.19 | 419..422 | 1544 |
| `TOTAL` | lines | 34.80% | 34.88% | 0.07 | 1864..1868 | 5355 |

Zero jitter across all four metrics: `src/games/futoshiki`, `src/games/thermo`, `src/games/killer`,
`src/games/kenken`, `src/games`, `src/composables`, `src/lib`, `src/App.vue`.

The moving counts are timer and microtask callbacks that may or may not land before a test file's
environment tears down — sudoku's and shared's async paths, and pencil's boil/celebration
schedulers. **Max magnitude 0.82 pts.**

**PRE-REGISTERED RULE, fixed before the bake**: each floor is the **minimum observed over the
sample**, per scope per metric, truncated to 2dp, enforced with `>=`. Never a mean, never a single
run. No tolerance band is applied at compare time — a tolerance would let a genuine 0.8-pt
regression through, which is the whole defect. `--write-floor` enforces the rule itself: it demands
`--samples <dir>` or the loud `--single-run-ok`, and it refuses to lower any figure without
`--allow-lower "<reason>"`.

The first bake of this row was a single run; re-cutting it to the sample minima dropped 4 figures
and the tool refused until told why. That refusal is banked as `r1.14-red-04`.

---

## 4 · The baseline — the floor W2 must clear

Per-scope, from `web/frontend/coverage-floor.json` (`sample.method: min-over-samples`, `n: 10`):

| scope | files | statements | branches | functions | lines |
|---|---:|---:|---:|---:|---:|
| `src/games/sudoku` | 14 | 52.79% | 55.39% | 35.24% | 50.57% |
| `src/games/futoshiki` | 14 | 38.00% | 47.33% | 20.74% | 35.46% |
| `src/games/thermo` | 12 | 18.43% | 4.57% | 12.37% | 18.22% |
| `src/games/killer` | 12 | 30.57% | 14.20% | 18.75% | 30.19% |
| `src/games/kenken` | 13 | 34.06% | 16.36% | 19.14% | 33.59% |
| `src/games/shared` | 37 | 53.14% | 45.57% | 47.74% | 53.32% |
| `src/games` (registry.ts) | 1 | 100% | 100% | 100% | 100% |
| `src/pencil` | 47 | 14.61% | 15.16% | 10.02% | 15.51% |
| `src/composables` | 1 | 100% | 100% | 100% | 100% |
| `src/lib` | 1 | 100% | 100% | 100% | 100% |
| `src/App.vue` | 1 | 0% | 0% | 0% | 0% |
| **TOTAL** | **153** | **35.03%** | **31.34%** | **27.13%** | **34.80%** |

Scopes partition `src/**` — a flat total would let a well-covered scope subsidize one the distill
just gutted, and a file matching no scope is surfaced as an error rather than silently dropped.
Percentages are re-derived in the gate from each file's covered/total; the summary's own `total`
block is never cited (self-test case 6 proves a lying `total` is ignored).

Per-file detail for all 153 files: `coverage-baseline.json` → `.files`.

---

## 5 · The uncovered set, ranked by the W2 blast radius

What GAP-6 actually asked for. Within `src/games/**`:

**19 files execute zero statements under the unit lane, holding 678 statements between them** —
and they are, almost exactly, the dup-matrix's collapse targets:

| statements | file |
|---:|---|
| 95 | `src/games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue` |
| 54 | `src/games/killer/KillerBoard.vue` |
| 54 | `src/games/thermo/ThermoBoard.vue` |
| 53 | `src/games/sudoku/SudokuBoard/SudokuBoard.vue` |
| 47 | `src/games/futoshiki/FutoshikiGame.vue` |
| 42 | `src/games/kenken/KenKenBoard.vue` |
| 41 | `src/games/kenken/KenKenGame.vue` |
| 41 | `src/games/killer/KillerGame.vue` |
| 41 | `src/games/thermo/ThermoGame.vue` |
| 36 | `src/games/futoshiki/solver/solver.worker.ts` |
| 35 | `src/games/kenken/solver/solver.worker.ts` |
| 35 | `src/games/killer/solver/solver.worker.ts` |
| 35 | `src/games/thermo/solver/solver.worker.ts` |
| 32 | `src/games/sudoku/solver/solver.worker.ts` |
| 16 | `src/games/thermo/ThermoTube/ThermoTube.vue` |
| 6 | `src/games/shared/DrawerTab.vue` |
| 6 | `src/games/sudoku/SudokuPoster.vue` |
| 5 | `src/games/shared/solveTally.ts` |
| 4 | `src/games/futoshiki/FutoshikiBoard/FutoshikiCaret/FutoshikiCaret.vue` |

Five `*Board.vue`, four `*Game.vue`, five `solver.worker.ts` — the exact families W2 collapses,
carrying **no unit coverage at all**. Whatever e2e reaches, the unit lane does not, so a collapse
regression in these files reds nothing at unit time today.

The heaviest **partially**-covered files, by uncovered statements:

| uncovered / total | pct | file |
|---:|---:|---|
| 259 / 355 | 27.04% | `src/games/shared/useGameState.ts` |
| 258 / 261 | 1.13% | `src/games/shared/GameBoard.vue` |
| 95 / 117 | 18.80% | `src/games/shared/useControlsDrawer.ts` |
| 85 / 182 | 53.29% | `src/games/shared/GameControlPanel.vue` |
| 64 / 67 | 4.47% | `src/games/shared/DifficultyTally.vue` |
| 51 / 64 | 20.30% | `src/games/shared/useKeyboardViewport.ts` |
| 43 / 46 | 6.52% | `src/games/futoshiki/solver/useSolver.ts` |
| 43 / 52 | 17.30% | `src/games/shared/useFlipGlide.ts` |
| 42 / 43 | 2.31% | `src/games/shared/conflicts.ts` |

`useGameState.ts` and `GameBoard.vue` are the spine W2's `GameSpec → GameShell` apotheosis moves
through, and between them they hold **517 unexecuted statements**.

**Not a defect**: 11 further `src/games/**` modules report 0 covered of **0** statements — they are
type-only (`types.ts`, the five `solver/protocol.ts`). They carry no denominator and cannot move a
floor. They are listed here only so a reader counting zeroes does not mistake them for dead code.

---

## 6 · How the floor gates W2's exit

```
cd web/frontend
npm run test:unit:coverage      # vitest run --coverage  → coverage/coverage-summary.json
npm run test:coverage:floor     # --self-test, then enforce every scope against coverage-floor.json
```

W2 exits only with `test:coverage:floor` green. Three ways it can red, all of them intended:

1. **A scope drops.** The collapse merged a covered module into an uncovered one. Named per metric with its magnitude.
2. **A gated scope vanishes.** Deleting the module is not how a floor gets satisfied — bank `"retired": "<where its code went>"` on the scope and say where the code went.
3. **A file answers to no scope.** A new top-level dir cannot enter ungated.

Raising the floor after W2 adds tests is `--write-floor --samples <dir>` over a fresh n≥10 sample.
Lowering it needs `--allow-lower "<reason>"` and a row in the wave record. The house does not
re-baseline on a red.

---

## 7 · Files this row touched

| Path | Change |
|---|---|
| `web/frontend/package.json` | `+@vitest/coverage-v8@^4.1.10` devDep; `test:unit:coverage`, `test:coverage:floor` scripts |
| `web/frontend/package-lock.json` | +168 lines, **0 deletions** — purely additive, no existing resolution moved |
| `web/frontend/vitest.config.ts` | the `coverage` block |
| `web/frontend/scripts/check-coverage-floor.mjs` | new — the floor gate, zero-dependency, self-testing |
| `web/frontend/coverage-floor.json` | new — the banked baseline (tracked) |
| `.gitignore` | `web/frontend/coverage/` (reports regenerate every run; the floor bank is what's tracked) |

### The CI fragment

`fragments/coverage.yml` — two YAML documents, each parsing standalone:

- **Option A (recommended)**: fold into W1.1's `fe-unit`. Its existing run step becomes
  `npm run test:unit:report -- --coverage`, which emits **both** `vitest-report.json` (the count
  floor) and `coverage/coverage-summary.json` (this floor) from **one** vitest invocation —
  verified in `r1.14-green-02-fold-one-invocation.txt`, on a run that happened to land on the
  sample minimum for lines. Then three appended steps: self-test, floor, failure-only upload.
- **Option B**: a standalone `fe-coverage` job, in full, for the case where fe-unit's wall-time is
  spoken for or the two floors are wanted separately attributable. It re-runs the same 332 tests —
  take one option or the other, never both.

Both were spliced into `ci.yml` at `f38c5130` and parsed: `r1.14-fragment-merge-check.txt`
(Option A → 12 jobs, `fe-unit` at 12 steps; Option B → 12 jobs, `fe-coverage` at 9).

This row does **not** edit `.github/workflows/ci.yml` — the integrator lane owns it.
