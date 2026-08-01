# Sudoku Solver and Generator

Handles sub-grid sizes N=2 through N=4 (4×4 through 16×16 boards). The web app exposes N=2, 3, 4 for all difficulties. Generation supports both a template-based fast path (sub-millisecond) and a hole-digging slow path with difficulty calibration.

## CSP Formulation

A standard N=3 Sudoku has M=9 (M = N*N), giving M*M = 81 variables, each with domain {1..M}. The domain is `BitsetDomain::new(1..=m)`—a u128 bitmask with bits 1 through 9 set.

The constraint structure uses `AllDifferent` constraints: one per row, one per column, one per N*N subgrid. For 9x9, that's 9 + 9 + 9 = 27 constraints. Each `AllDifferent` has scope of size M (9 variables). The n-ary GAC propagator (default-ON above the live-participant gate) detects inconsistencies that the pairwise decomposition—810 `NotEqual` constraints for 9x9—would miss.

`create_sudoku_csp()` builds the CSP for any sub-grid size N. Variables are indexed row-major: cell (r, c) maps to `r * M + c`. Subgrid constraints iterate over the N*N cells within each band-stack block via a `flat_map` over row and column offsets. After adding all constraints, `finalize()` builds the adjacency graph.

`solve_with_given()` handles the pre-assigned cells in three stages:
1. Restrict each given cell's domain to a singleton by removing all other values.
2. One-hop propagation: for each given cell, remove its value from all neighbor domains (cells sharing a row, column, or subgrid). Non-given neighbors only.
3. Full AC-3 at depth 0—permanent reductions that don't need undo log entries. This propagates the implications of all given cells simultaneously.

For easy puzzles, these three stages alone solve the board with zero backtracks. The subsequent search finds the assignment already complete.

## Template-Based Generation

The fast path for puzzle generation uses pre-computed templates. Each template contains a puzzle (with holes) and its unique solution. `generate_board_with_templates()` picks a random template and applies a random symmetry transform—sub-millisecond for any board size.

Templates live in `csp-solver/data/sudoku_puzzles/{N}/{difficulty}/`, owned by the Rust crate and embedded at build time via `include_dir!`. The PyO3/wasm bindings and the frontend derive from this single source—never a hand-copied fork.

## Symmetry Group

A Sudoku symmetry transform is any board permutation that preserves all row, column, and subgrid constraints. For N=3, the group is the product of:

| Transform | Count |
|-----------|-------|
| Digit permutation | 9! = 362,880 |
| Row permutation within each of 3 bands | (3!)^3 = 216 |
| Column permutation within each of 3 stacks | (3!)^3 = 216 |
| Band permutation | 3! = 6 |
| Stack permutation | 3! = 6 |
| Transposition | x2 |

Total: 362,880 x 216 x 216 x 6 x 6 x 2 = 1,218,998,108,160, or ~1.22 x 10^12—the order of the group, not a per-grid count. A template's orbit is |G| / |stabilizer|, so at most that many distinct grids come out of one template. Every transform in the group maps a valid Sudoku to a valid Sudoku: row/column/subgrid membership survives any composition of these operations.

`SudokuTransform` stores each component permutation as separate fields: `digit_perm`, `row_perms` (per band), `col_perms` (per stack), `band_perm`, `stack_perm`, and `do_transpose`. `random_with_rng()` generates each component independently via Fisher-Yates shuffle on the appropriate index range.

`apply()` maps each cell position through the full transform chain. For each cell at `(old_row, old_col)`:
1. Decompose into band + row-within-band, stack + column-within-stack.
2. Permute band, then row within the _new_ band. Permute stack, then column within the _new_ stack.
3. Optionally transpose (swap row and column).
4. Remap the digit value through `digit_perm`. Zero (empty cell) maps to zero.

O(M^2) per application—just arithmetic and indexing. The RNG is a lightweight `SimpleRng` (xorshift64); the wasm surface seeds it explicitly on the wire (the flat-index re-key that also fixed the `SystemTime::now()` panic under wasm32).

## Hole-Digging Generation

When no templates exist for the requested size/difficulty, generation falls back to hole-digging:

1. **Seed a complete solution.** Create an empty board, fill the first row with a random permutation of 1..M, then solve the rest with `Ac3 + FailFirst`. The random first row is always consistent by construction. The solver fills the remaining cells deterministically given the seed row.

2. **Dig holes.** Shuffle all M*M cell indices randomly. For each cell in order, tentatively remove it. Construct a fresh CSP from the modified board and solve with `max_solutions: 2`. If exactly one solution exists, the removal is permanent. If more than one solution exists, restore the cell—the puzzle must have a unique solution.

3. **Difficulty.** The lever is the hole target, not a backtrack threshold:
   - Easy: `total / 4`
   - Medium: `total / 1.75`
   - Hard: `total / 1.25`

   That's 20 / 46 / 64 holes on a 9x9 and 64 / 146 / 204 on a 16x16. More holes generally means harder, but the uniqueness check refuses arbitrary removal—some cells are structural keystones that create ambiguity once dug, so the achieved hole count can fall short of the target.

`measure_difficulty()` grades a finished board by backtrack count under `ForwardChecking + FailFirst` (not AC-3—see below). It graded the template bank, and it feeds one debug-build-only consistency assertion on the template fast path: `expected_backtrack_band` accepts Easy at exactly 0 backtracks, Medium at 1 or more, Hard at 100 or more, all unbounded above for N=3 and unconstrained for every other size. The assertion is `#[cfg(debug_assertions)]` and the release path never consults it. Its job is catching a gross directory mismatch—an easy claim served a non-easy board—not grading a tier finely.

The uniqueness check is the expensive part—each candidate hole requires a full CSP construction and solve, and the per-solve cost grows with board size. Template-based generation avoids this entirely.

## Solve Configuration

`SolveConfig` exposes:

- **Pruning**: `None` (pure backtrack), `ForwardChecking`, `Ac3` (MAC), `AcFc` (FC + singleton propagation).
- **Ordering**: `Chronological`, `FailFirst` (MRV—smallest domain first), `Mrv` (domain-size / Σ constraint-weights; weights frozen at 1.0, so a static heuristic).
- **max_solutions**: cap on solutions to find. 1 for normal solving, 2 for uniqueness checking during generation.
- **node_budget**: bound on search nodes; exhaustion surfaces as a distinct budget-exceeded outcome (defaults to 1,000,000).
- **cancel** / **optimization_mode**: a `CancelToken` for cooperative cancellation, and the feasibility-vs-optimization mode for the B&B path.

The former `backjumping` axis is gone—conflict-directed backjumping was removed with the search-kernel unification.

The served hard-Sudoku path runs `Ac3 + Mrv`; `SolveConfig::default()` is `Ac3 + FailFirst`. There is no Python solver to compare against—`csp_solver` (Rust) is the sole engine, reached from Python via PyO3 and from the browser via wasm.

### `max_solutions` semantics

`max_solutions = 1` under `Ac3` returns the first solution the search reaches. On a puzzle with a unique solution (every board the generator emits) this is unambiguous. On a multi-solution instance the first solution is valid but trajectory-dependent—a different pruning or ordering may return a different, equally-correct member of the set. Treat `= 1` as a satisfiability probe and `= 2` as a uniqueness cap, never as a guarantee of a specific solution (`evidence/kernel-soundness-closure.md` §7.2).

## Web Integration

The frontend solves and generates **in the browser**, in a Web Worker over `@mkbabb/csp-solver-wasm`, and renders the board with a pencil-mark UI validated against the solution client-side: the only shipped solve path. Board data on the wire is a flat-index `Uint32Array`; a `node_budget` control is size-scaled and user-facing.

## The shared generator contract

Four more games ride this engine, and all five generate through one dealer. `PuzzleClass` (`csp-solver/src/puzzles/class.rs`) is the intersection the family generators already satisfied, drawn as a trait: an associated `Clue` (the furniture a board carries beyond its givens), an associated `Puzzle` (what the caller receives), and five seams—`seed_solution`, `place_clues`, `solve_candidate`, `target_holes`, `assemble`. Divergence between families is expressed as those seams, never as config flags; a boolean toggle would be a seam the trait missed.

`generate_by_digging<C: PuzzleClass>` is the dealer, and it's the three beats every family shares: seed a full solution, place clue furniture over it, then dig blanks while a `max_solutions: 2` re-solve keeps the board unique—a removal admitting a second solution is reverted. One seeded `SimpleRng` threads seed → clues → dig, which is what makes native and wasm agree board-for-board on the same seed. `tests/puzzle_class.rs` holds the acceptance: dealing Sudoku and Futoshiki through the contract reproduces their shipped generators byte-for-byte.

The five `Clue` kinds are distinct by construction: `()` for Sudoku, an `(a, b)` caret for Futoshiki, a `Vec<usize>` tube for Thermo, a `KillerCage` for Killer, a `KenKenCage` for KenKen.

## Futoshiki

Futoshiki is an N×N Latin square with inequality constraints between adjacent cells: `add_all_different` per row and column, fixed-cell equalities, and `add_greater_than` for each `<`/`>` annotation. It ships generation (seed a Latin square via the solver, place adjacency-valid inequalities, dig holes under a `max_solutions: 2` uniqueness check) and boundary validation (`FutoshikiPuzzle::from_parts`). v1 covers N=4..7. Difficulty is a keep-density plus inequality-density ladder—Easy keeps 0.6 of cells as givens, Medium 0.45, Hard 0.3, with carets rising as the givens thin. It exposes the same surfaces as Sudoku: Rust, PyO3, wasm, and a frontend game package (`board_size` on the wire, never `size`). Its uniqueness check is sound only after the kernel's AC-3 trail-push fix.

## Thermo

Thermo-Sudoku is a standard Sudoku carrying thermometer furniture. A thermometer is an orthogonally-adjacent path of cells—a bulb, then a tube—whose values strictly increase from bulb to tip. Sizes are Sudoku's: 4x4, 9x9, 16x16.

**CSP.** Variables, domains, and the row/column/subgrid `AllDifferent` skeleton are Sudoku's unchanged—M*M variables over `BitsetDomain::new(1..=m)`, 27 `AllDifferent` at 9x9. A thermometer of length k compiles to k-1 binary `add_less_than` constraints, one per consecutive pair along the tube, and nothing else is added. A 2-variable constraint rides the engine's `revise_binary_default` path, so a tube prunes with no propagator of its own: Thermo ships zero new engine constraints, which is what makes it the `PuzzleClass` contract proof. `create_thermo_csp()` adds the chains before `finalize()`—the sugar has to be in place when the adjacency graph is built. Given-cell extraction is Sudoku's `sudoku_given()`, reused rather than twinned.

**Generation.** `ThermoClass` fills the seams; `generate_by_digging` drives them. The seed is a full Sudoku solution off the reusable skeleton with a shuffled first row, solved under `Ac3 + FailFirst` (`ForwardChecking` can't seed the larger boards). `place_thermometers` then walks cells in shuffled order: each unused cell becomes a bulb, and the tube greedily climbs to an unused orthogonal neighbour of strictly greater value until it stalls or hits `MAX_THERMO_LEN` = 5. Cells are never shared between tubes, and a run of length 1 is discarded and its cell freed—one cell isn't a thermometer. Orthogonal neighbours in a Sudoku solution share a row or column, so their values always differ and the climb direction is unambiguous; the seed satisfies every tube it just grew. The target is `n^2` tubes, roughly one per row, clamped down by the disjoint-run budget. The dig is the shared one, with the full thermometer set present in every candidate CSP—furniture is never blanked.

**Difficulty.** Sudoku's `Difficulty` verbatim, hole targets and all. A Thermo-Sudoku is a Sudoku variant, so there's no fourth mirror of the axis, and the wasm wire reuses `SudokuDifficulty` rather than minting its own.

**Wire.** Boards cross as Sudoku's flat row-major `Uint32Array` of `(n*n)^2` cells. Tubes cross as a separate flat array, each length-prefixed: `[k0, c0_0, ..., k1, c1_0, ...]`. Length-prefixing, rather than the fixed pairs the Futoshiki caret wire uses, is what lets a variable-length tube ride one bulk `memcpy` with no per-cell reflection.

## Killer

Killer-Sudoku is a standard Sudoku whose cells partition into cages. A cage is a contiguous group whose cells are all-different and whose values sum to a target printed in its corner. Sizes are Sudoku's: 4x4, 9x9, 16x16.

**CSP.** Sudoku's variables, domains, and 27 `AllDifferent` at 9x9, plus, per cage, one `AllDifferent` over its cells (skipped for a singleton, which has no pair to differ) and one `CageSum` against the target. `CageSum` is a devirtualized `ConstraintEnum` variant rather than a lambda, and that distinction is load-bearing: the default `revise` returns `Unchanged` for any scope of three or more variables, so a cage modelled as an n-ary lambda is consulted only by `check()` at assignment time and prunes nothing. `CageSum::revise_impl` is bounds consistency on `Σ x_i == target`—each cell pinned to `[target - Σ(others' max), target - Σ(others' min)]`, iterated to an internal fixpoint because pruning one cell tightens the residual for the rest. Bounds consistency is sound but not domain-complete: it never removes a value participating in a full solution, and it doesn't remove every unsupported one. `tests/cage.rs` and the module's own randomized differential oracle guard exactly that soundness property, alongside a unit test asserting the n-ary lambda wall is still live.

**Generation.** `KillerClass` on the same seams, seeded as Thermo is. `partition_into_cages` visits cells in shuffled order; each unassigned cell opens a cage with a random target size in 2..=`MAX_CAGE_LEN` (4) and grows by absorbing a random unassigned orthogonal neighbour of any cage cell whose seed value isn't already in the cage. The cage's `AllDifferent` therefore holds on the seed by construction, and its sum is read off the seed so the `CageSum` does too. A cell hemmed in by taken or same-value neighbours stays a singleton, and that singleton's `CageSum` pins it even after the digger blanks it. Value-distinctness is always reachable—a cell can be its own cage—so the partition never wedges. Every cell lands in exactly one cage; the smallest flat index is the corner the sum label prints in. The dig is the shared one, with the full cage set present in every candidate.

**Difficulty.** Sudoku's `Difficulty` and hole bands verbatim—a Killer-Sudoku is a Sudoku variant, same as Thermo.

**Wire.** Sudoku's board array, plus a separate cage array with each cage length-prefixed by its sum: `[k0, s0, c0_0, ..., k1, s1, c1_0, ...]`.

## KenKen

KenKen (Calcudoku) is a plain N×N Latin square—no subgrids—whose cells partition into cages, each carrying an arithmetic operator and the target its cells produce under it. Sizes are 4x4, 5x5, 6x6. Values run `1..=n`, so `board_size` on the wire is the board side directly, never Sudoku's sub-grid N.

**CSP.** N*N variables over `BitsetDomain::new(1..=n)`; the skeleton is row and column `AllDifferent` and nothing more—2N constraints, no box. Each cage then adds one constraint, by operator:

- `+`: one `CageSum` = target. The same n-ary bounds propagator Killer consumes.
- `×`: one `CageProduct` = target. KenKen is its only consumer.
- `−`: a 2-cell binary lambda, `abs(a - b) == target`.
- `÷`: a 2-cell binary lambda, `max(a,b) / min(a,b) == target` with divisibility enforced.

`CageProduct::revise_impl` is bounds consistency on `Π x_i == target` over non-negative integers, iterated to a fixpoint. For a non-zero target each cell must be non-zero (a zero factor forces a zero product), must divide the target, and its required cofactor `target / x` must land inside `[Π others' min, Π others' max]`. KenKen's zero-free `1..=n` domains keep those bounds clean; the zero-target branch is handled for completeness. `−` and `÷` are strictly two cells, so they prune through `revise_binary_default` and need no propagator either—KenKen, like Thermo and Killer, authors no constraint code of its own. A malformed `−`/`÷` cage (not exactly two cells) is skipped rather than panicked on: a dropped binary cage degrades to a looser, still-sound puzzle. And unlike Killer, a KenKen cage carries no `AllDifferent`—it may repeat a value across two cells sharing neither row nor column, since the Latin constraint is the only all-different in play.

**Generation.** `KenKenClass` on the same seams. The seed is a bare Latin square: the boxless KenKen CSP with no cages at all, a shuffled first row, solved. `partition_into_cages` grows contiguous cages as Killer's does but without the value-distinctness filter, then `assign_operator` reads each cage's operator and target off the seed. A singleton becomes a `+` cage with the cell's own value—a given the `CageSum` pins through the dig. A pair draws from `−`, `×`, `+`, with `÷` joining the draw only when the larger value is divisible by the smaller. Three or more cells take `+` or `×`, the n-ary operators, the ones that need `CageSum`/`CageProduct` to see past the wall. The dig targets the whole board: classic KenKen is cages-only, so the dealer tries to blank every cell and reverts each blank that admits a second solution. A given survives only where the cages underdetermine.

**Difficulty.** Futoshiki's `Difficulty` verbatim—KenKen is a Latin family, so no fifth mirror of the axis—mapped to a cage-size band: Easy caps cages at pairs, Medium at three cells, Hard at four. Bigger cages mean bigger sums and products, and arithmetic that determines less per clue.

**Wire.** A flat row-major `Uint32Array` of `board_size^2` cells, plus a cage array with each cage length-prefixed by its operator ordinal and target: `[k0, op0, t0, c0_0, ..., k1, op1, t1, c1_0, ...]`. The ordinals are `CageOp::ordinal()`: `+` = 0, `−` = 1, `×` = 2, `÷` = 3.
