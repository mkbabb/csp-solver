# W0 ROW 0.4 — `docs/sudoku.md` — lane notes

**Tree at work:** `e961bdb7` (`master`, clean but for the untracked T5 evidence dirs + the two W0 scripts).
**Method:** every figure re-derived from the artifact named beside it. Nothing copied from the wave spec, the drift audit's prose, or memory.

---

## (a) The 10³ symmetry fix

**Was** (`docs/sudoku.md:39`): "Total: ~1.22 x 10^9 distinct grids per template."

**Derivation.** The doc's own table names the six factors; each re-derives against `csp-solver/src/puzzles/sudoku/transform.rs::random_with_rng`, which builds exactly those components and no others:

| Factor | Source line | Value at N=3 |
|---|---|---|
| `digit_perm` | `transform.rs:25-28` — shuffle of `1..=m` | 9! = 362,880 |
| `row_perms` (one per band) | `transform.rs:30-36` — `n` independent shuffles of `0..n` | (3!)³ = 216 |
| `col_perms` (one per stack) | `transform.rs:38-44` | (3!)³ = 216 |
| `band_perm` | `transform.rs:46-47` | 3! = 6 |
| `stack_perm` | `transform.rs:49-50` | 3! = 6 |
| `do_transpose` | `transform.rs:52` — a coin flip | 2 |

362,880 · 216 · 216 · 6 · 6 · 2 = **1,218,998,108,160** = 1.218998…× 10¹² ⇒ **~1.22 × 10¹²**.
Mantissa was right, exponent short by 10³ — a transcription slip that had never been re-derived (r2 adjudicates it never-true, not drift).

**Now.** The line states the product, the exact integer, the rounded power, and names it as the **order of the group** rather than a per-grid count. The old phrasing ("distinct grids per template") also overcounted: a template's orbit is `|G| / |stabilizer|`, so the group order is an upper bound on distinct images. That correction is written into the sentence.

## (b) The three ghost-API cites

Row 0.4 assigns "the three ghost-API cites". Re-derived: **`docs/sudoku.md` carries none** — every API it names (`create_sudoku_csp`, `solve_with_given`, `generate_board_with_templates`, `SudokuTransform`, `random_with_rng`, `SimpleRng`, `AcFc`, `ForwardChecking`, `add_greater_than`, `add_all_different`, `FutoshikiPuzzle::from_parts`, `node_budget`, `optimization_mode`, `CancelToken`) resolves in `csp-solver/src` or `csp-solver/wasm/src`. The three ghosts the audit enumerates (doc-canon-drift **S9**, registry.md:28 "three cited APIs don't exist") live in **`docs/algorithms.md`**, and one of them ships a fourth time in `docs/benchmarks.md`. All four sites are now dead.

| Ghost | Site | Re-derived reality | Cure |
|---|---|---|---|
| `tests/solution_set_invariance.rs` | `docs/algorithms.md:59` | file absent; the harness is `csp-solver/tests/oracle_and_invariance.rs` §4 (`:324-450`), asserting set-identity over `PRUNINGS[4] × ORDERINGS[3]` = **12** combos across `queens6`, `queens8`, `futoshiki_loose`, `futoshiki_constr` | redirected to the real path, with the 12 = 4×3 split and the four cases named |
| `propagate_stratified` / "Stratified sweep" | `docs/algorithms.md:73` | zero hits for `stratified\|Stratified` in `csp-solver/src` + `csp-solver/wasm/src`; `config.rs:30-40` `PropagationStrategy` = `Auto \| Ac3 \| Sweep`, and `Sweep` dispatches to `solver::monotonic::propagate_monotonic` (`csp/solve.rs:51`) | bullet **excised**; the surviving sentence states the enum carries the two strategies plus `Auto` |
| `Ordering::Chs` | `docs/algorithms.md:83` | zero hits in `csp-solver/src`; `ordering.rs:9-20` = `Chronological \| FailFirst \| Mrv`; `csp-solver/CHANGELOG.md:136-138` records the 0.3.0 deletion together with `solver/heuristic.rs` (the conflict-history weighting it needed) | rewritten: `Chs` named as **deleted at 0.3.0**, the enum declared closed at three; the frozen-weight denominator now credited to `precompute_var_wdeg` (`ordering.rs:22-30`) |
| `tests/solution_set_invariance.rs` (4th site) | `docs/benchmarks.md:36` | same as row 1 | redirected; the four harness cases named |

**Handoff to the 0.3 lane** (`docs/benchmarks.md` is that lane's file and was already `M` in the worktree when I patched line 36): I changed **only** the trailing "Standing guard: …" clause via exact-string replace, nothing else in the file. One residual claim on that same line is **outside my row and unadjudicated**: it credits the invariance harness with `queens12 = 14,200`, but `oracle_and_invariance.rs` §4 runs `queens6`/`queens8`/`futoshiki_loose`/`futoshiki_constr` — 14,200 is the `benches/queens.rs:104,143` ground truth, a different instrument. Worth a look from whoever owns benchmarks.md.

## (c) The three deep sections — CH-33's fired trigger honored

`## Thermo`, `## Killer`, `## KenKen` written to the depth, structure, and register of the existing Sudoku/Futoshiki material: **rules → CSP → generation → difficulty → wire**. Every claim derives from `csp-solver` source read this pass, never from the tail paragraph they replace.

Two structural moves came with them:

- `## Futoshiki and the wider family` → `## Futoshiki`. The heading's tail paragraph — the one-paragraph gloss the chronic ledger flags as the whole of the three games' documentation — is superseded by the sections. Nothing outside the T5 audit records referenced the old heading (`grep -rn "wider family"` = this file plus record citations of the RED state).
- A new `## The shared generator contract` precedes the family sections: `PuzzleClass`'s five seams and `generate_by_digging`'s three beats are stated once, so Thermo/Killer/KenKen each cite the dealer instead of re-describing it. Derived from `csp-solver/src/puzzles/class.rs:22-98` and `csp-solver/tests/puzzle_class.rs:54-121`.

**Derivation ledger for the new prose** — each row is a claim in the sections and the artifact it came from:

| Claim | Source |
|---|---|
| Thermo = Sudoku skeleton + `k−1` binary `add_less_than` per length-`k` tube; zero new engine constraints | `puzzles/thermo/csp.rs:34-95` (`add_less_than` in `windows(2)`, before `finalize`) |
| A 2-scope constraint prunes on the free path; 3+ scope returns `Unchanged` | `constraint/traits.rs:73-77` (`2 => revise_binary_default`, `_ => Revision::Unchanged`), helper at `:154` |
| Thermo tube growth: bulb at a shuffled unused cell, greedy climb to a strictly-greater unused orthogonal neighbour, cap `MAX_THERMO_LEN = 5`, length-1 runs discarded and freed | `puzzles/thermo/generate.rs:29, 88-140` |
| Thermo tube target `n²` (~one per row), clamped by the disjoint-run budget | `thermo/generate.rs:168-178` (`thermo_count: (n*n) as usize`) |
| Killer cage = `AllDifferent` (skipped at size 1) + `CageSum`; `MAX_CAGE_LEN = 4`, target size 2..=4 | `puzzles/killer/csp.rs:94-100`; `killer/generate.rs:33, 116` (`2 + rng.next_usize(MAX_CAGE_LEN - 1)`) |
| Killer cage growth filters on seed-value distinctness; singleton fallback; corner = smallest flat index | `killer/generate.rs:98-152` |
| `CageSum` bounds consistency: cell pinned to `[target − Σothers_max, target − Σothers_min]`, internal fixpoint | `constraint/cage.rs:120-169` |
| `CageProduct` bounds consistency: non-zero cell, divides target, cofactor `target/x` inside `[Πothers_min, Πothers_max]`; zero-target branch handled | `constraint/cage.rs:224-303` |
| Bounds consistency sound, not domain-complete; guarded by a differential oracle + a wall-is-live test | `constraint/cage.rs:14-20, 331-357, 522-557`; `csp-solver/tests/cage.rs:1-16, 106, 153` |
| KenKen = Latin square, **2n** `AllDifferent` (row+col, no box), domain `1..=n` | `puzzles/kenken/csp.rs:103-135` |
| KenKen operator map: `+`→`CageSum`, `×`→`CageProduct`, `−`/`÷`→2-cell lambdas; malformed binary cage skipped, not panicked | `kenken/csp.rs:140-181, 99-102` |
| KenKen cages carry **no** `AllDifferent` | `kenken/csp.rs:21-23` and the absence of `add_all_different` in the cage loop |
| `assign_operator`: singleton→`+` given; pair draws `− × +`, `÷` only on divisibility; 3+ cells→`+` or `×` | `kenken/generate.rs:110-153` |
| KenKen digs the whole board; givens survive only where cages underdetermine | `kenken/generate.rs:268-273` (`target_holes` = `board_len`) + `class.rs:84-95` (revert-on-second-solution) |
| KenKen difficulty → cage-size band Easy 2 / Medium 3 / Hard 4 | `kenken/generate.rs:49-55` |
| Thermo + Killer reuse sudoku `Difficulty`; KenKen reuses futoshiki `Difficulty` | `thermo/generate.rs:21`, `killer/generate.rs:24`, `kenken/generate.rs:28`; wasm mirrors at `wasm/src/{thermo,killer}.rs:15-17`, `wasm/src/kenken.rs:19-21` |
| Sizes: Thermo/Killer 4x4 · 9x9 · 16x16; KenKen 4x4 · 5x5 · 6x6 | `web/frontend/src/games/registry.ts:250-278` → `games/sudoku/ControlPanel/constants.ts:4-8` (N=2,3,4) and `games/kenken/ControlPanel/constants.ts:15-19` (4,5,6) |
| Wire shapes — Thermo `[k, cells…]`, Killer `[k, sum, cells…]`, KenKen `[k, op, target, cells…]`, ordinals `+`0 `−`1 `×`2 `÷`3 | `wasm/src/thermo.rs:9-13`, `wasm/src/killer.rs:10-14`, `wasm/src/kenken.rs:11-14`; ordinals at `puzzles/kenken/csp.rs:48-55` |
| Futoshiki keep-density ladder 0.6 / 0.45 / 0.3 | `puzzles/futoshiki/generate.rs:56-65` |
| `PuzzleClass` = 2 associated types + 5 seams; `generate_by_digging` = seed → clues → dig with `max_solutions: 2` revert | `puzzles/class.rs:22-98` |
| `tests/puzzle_class.rs` proves trait-dealing reproduces the shipped seeded generators | `csp-solver/tests/puzzle_class.rs:54, 75, 96` |

## Bonus row taken in-file — S17, the difficulty bands

`docs/sudoku.md:61-62` claimed "Medium: <50 backtracks / Hard: >100 backtracks". No `50` exists anywhere in the calibration path, and the doc had the **instrument** wrong, not just the number. Re-derived:

- The dig's actual difficulty lever is `target_holes`: `Easy → total/4`, `Medium → total/1.75`, `Hard → total/1.25` (`sudoku/generate.rs:298-302`, mirrored in `SudokuClass::target_holes` at `:397-403`). Evaluated: **20 / 46 / 64** holes on 81 cells, **64 / 146 / 204** on 256.
- `measure_difficulty` (`generate.rs:52-62`) grades with `ForwardChecking + FailFirst` — the doc was right about that.
- `expected_backtrack_band` (`generate.rs:156-166`) is `#[cfg(debug_assertions)]` and is consulted by exactly one caller, the template fast-path consistency assertion at `:194-204`. Bands: Easy `(0,0)`, Medium `(1, u32::MAX)`, Hard `(100, u32::MAX)`, and `(0, u32::MAX)` for every N ≠ 3. The release path never reads it (`:143-155` says so in as many words; r2 `verify-masked-and-drift.md:57` concurs).

The section now separates the two: hole target as the lever, `measure_difficulty` + the debug band as a gross-mismatch assertion. Row 0.4 didn't name S17, but it's a live STALE row in my file with no other owner, and the deep sections' difficulty paragraphs would have contradicted it.

## Typography

`docs/sudoku.md` carried 16 ASCII ` -- ` and zero em dashes at HEAD. Since this row rewrites roughly a third of the file, all 29 occurrences (16 inherited + 13 in new prose) are normalized to `—`, no spaces, per MIKE-STYLE. No code fences in the file, so nothing inside literal text was touched. `docs/algorithms.md` and `docs/benchmarks.md` got one-clause surgical patches only and keep their own local ` -- ` convention — normalizing a file I barely touched would be overreach, and benchmarks.md belongs to another lane.

## Gates

```
$ node scripts/check-doc-truth.mjs
GREEN  sudoku-md-sections
        derived: games registered: sudoku, futoshiki, thermo, killer, kenken
                 — each owed a section in docs/sudoku.md
```

Banked at `evidence/w0/f4-doc-truth-after.txt`. The row was RED at `e961bdb7` on all three greps (`^## Thermo`, `^## Killer`, `^## KenKen` — see `evidence/w0/doc-truth-RED-at-HEAD.txt:58-68`); the full run now reads **1 RED / 9 GREEN**, the single RED being `test-count-208-vs-204` on `csp-solver/README.md:216`, another lane's row.

Section-presence, direct:

```
$ grep -cE '^## Thermo' docs/sudoku.md   → 1
$ grep -cE '^## Killer' docs/sudoku.md   → 1
$ grep -cE '^## KenKen' docs/sudoku.md   → 1
```

Ghost-cite sweep across the consumer corpus, `docs/tranches/` excluded:

```
$ grep -rn "solution_set_invariance\|propagate_stratified\|Stratified" docs/ README.md csp-solver/README.md
  → zero hits
$ grep -rn "\bChs\b" docs/ README.md csp-solver/README.md
  → docs/algorithms.md:81 only — the sentence recording the 0.3.0 deletion
```

Meta-leak, the T4-W14 invariant, held across all three edited files:

```
$ grep -inE '\b(tranche|wave [0-9N]|WGATE|ballot|Fable|Opus|ultracode|the owner|owner-audit|born-RED|lane P|T[0-9]-W[0-9]+|P[0-9]-W[0-9])\b' \
    docs/sudoku.md docs/algorithms.md docs/benchmarks.md
  → zero hits
```

## Files touched

- `docs/sudoku.md` — (a) symmetry, (c) three sections + shared-contract section + `## Futoshiki` rename, S17 difficulty, em-dash normalization
- `docs/algorithms.md` — three ghost cites (`:59`, `:73` bullet excised, `:83`)
- `docs/benchmarks.md` — `:36` standing-guard path only (see the handoff note above)

No source code moved. No commit, no deploy.

ROW-COMPLETE
