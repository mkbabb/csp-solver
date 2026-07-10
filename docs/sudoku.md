# Sudoku Solver and Generator

Handles sub-grid sizes N=2 through N=4 (4×4 through 16×16 boards). The web app exposes N=2, 3, 4 for all difficulties. Generation supports both a template-based fast path (sub-millisecond) and a hole-digging slow path with difficulty calibration.

## CSP Formulation

A standard N=3 Sudoku has M=9 (M = N*N), giving M*M = 81 variables, each with domain {1..M}. The domain is `BitsetDomain::new(1..=m)` -- a u128 bitmask with bits 1 through 9 set.

The constraint structure uses `AllDifferent` constraints: one per row, one per column, one per N*N subgrid. For 9x9, that's 9 + 9 + 9 = 27 constraints. Each `AllDifferent` has scope of size M (9 variables). The n-ary GAC propagator (default-ON above the live-participant gate) detects inconsistencies that the pairwise decomposition -- 810 `NotEqual` constraints for 9x9 -- would miss.

`create_sudoku_csp()` builds the CSP for any sub-grid size N. Variables are indexed row-major: cell (r, c) maps to `r * M + c`. Subgrid constraints iterate over the N*N cells within each band-stack block via a `flat_map` over row and column offsets. After adding all constraints, `finalize()` builds the adjacency graph.

`solve_with_given()` handles the pre-assigned cells in three stages:
1. Restrict each given cell's domain to a singleton by removing all other values.
2. One-hop propagation: for each given cell, remove its value from all neighbor domains (cells sharing a row, column, or subgrid). Non-given neighbors only.
3. Full AC-3 at depth 0 -- permanent reductions that don't need undo log entries. This propagates the implications of all given cells simultaneously.

For easy puzzles, these three stages alone solve the board with zero backtracks. The subsequent search finds the assignment already complete.

## Template-Based Generation

The fast path for puzzle generation uses pre-computed templates. Each template contains a puzzle (with holes) and its unique solution. `generate_board_with_templates()` picks a random template and applies a random symmetry transform -- sub-millisecond for any board size.

Templates live in `csp-solver/data/sudoku_puzzles/{N}/{difficulty}/`, owned by the Rust crate and embedded at build time via `include_dir!`. The PyO3/wasm bindings and the frontend derive from this single source -- never a hand-copied fork.

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

Total: ~1.22 x 10^9 distinct grids per template. Every transform in this group maps a valid Sudoku to a valid Sudoku -- row/column/subgrid membership is preserved under any composition of these operations.

`SudokuTransform` stores each component permutation as separate fields: `digit_perm`, `row_perms` (per band), `col_perms` (per stack), `band_perm`, `stack_perm`, and `do_transpose`. `random_with_rng()` generates each component independently via Fisher-Yates shuffle on the appropriate index range.

`apply()` maps each cell position through the full transform chain. For each cell at `(old_row, old_col)`:
1. Decompose into band + row-within-band, stack + column-within-stack.
2. Permute band, then row within the _new_ band. Permute stack, then column within the _new_ stack.
3. Optionally transpose (swap row and column).
4. Remap the digit value through `digit_perm`. Zero (empty cell) maps to zero.

O(M^2) per application -- just arithmetic and indexing. The RNG is a lightweight `SimpleRng` (xorshift64); the wasm surface seeds it explicitly on the wire (the flat-index re-key that also fixed the `SystemTime::now()` panic under wasm32).

## Hole-Digging Generation

When no templates exist for the requested size/difficulty, generation falls back to hole-digging:

1. **Seed a complete solution.** Create an empty board, fill the first row with a random permutation of 1..M, then solve the rest with `Ac3 + FailFirst`. The random first row is always consistent by construction. The solver fills the remaining cells deterministically given the seed row.

2. **Dig holes.** Shuffle all M*M cell indices randomly. For each cell in order, tentatively remove it. Construct a fresh CSP from the modified board and solve with `max_solutions: 2`. If exactly one solution exists, the removal is permanent. If more than one solution exists, restore the cell -- the puzzle must have a unique solution.

3. **Difficulty calibration.** Solve the generated puzzle with `ForwardChecking + FailFirst` (not AC-3 -- see below). Count backtracks:
   - Easy: 0 backtracks (propagation alone suffices)
   - Medium: <50 backtracks
   - Hard: >100 backtracks

   The target hole count is tuned per difficulty (a larger fraction for harder puzzles). More holes generally means harder, but the uniqueness constraint prevents arbitrary removal -- some cells are structural keystones that, if removed, create ambiguity.

The uniqueness check is the expensive part -- each candidate hole requires a full CSP construction and solve, and the per-solve cost grows with board size. Template-based generation avoids this entirely.

## Solve Configuration

`SolveConfig` exposes:

- **Pruning**: `None` (pure backtrack), `ForwardChecking`, `Ac3` (MAC), `AcFc` (FC + singleton propagation).
- **Ordering**: `Chronological`, `FailFirst` (MRV -- smallest domain first), `Mrv` (domain-size / Σ constraint-weights; weights frozen at 1.0, so a static heuristic).
- **max_solutions**: cap on solutions to find. 1 for normal solving, 2 for uniqueness checking during generation.
- **node_budget**: bound on search nodes; exhaustion surfaces as a distinct budget-exceeded outcome (defaults to 1,000,000).
- **cancel** / **optimization_mode**: a `CancelToken` for cooperative cancellation, and the feasibility-vs-optimization mode for the B&B path.

The former `backjumping` axis is gone -- conflict-directed backjumping was removed with the search-kernel unification.

The served hard-Sudoku path runs `Ac3 + Mrv`; `SolveConfig::default()` is `Ac3 + FailFirst`. There is no Python solver to compare against -- `csp_solver` (Rust) is the sole engine, reached from Python via PyO3 and from the browser via wasm.

### `max_solutions` semantics

`max_solutions = 1` under `Ac3` returns the first solution the search reaches. On a puzzle with a unique solution (every board the generator emits) this is unambiguous. On a multi-solution instance the first solution is valid but trajectory-dependent -- a different pruning or ordering may return a different, equally-correct member of the set. Treat `= 1` as a satisfiability probe and `= 2` as a uniqueness cap, never as a guarantee of a specific solution (`evidence/kernel-soundness-closure.md` §7.2).

## Web Integration

The frontend solves and generates **in the browser**, in a Web Worker over `@mkbabb/csp-solver-wasm`, and renders the board with a pencil-mark UI validated against the solution client-side — the only shipped solve path. Board data on the wire is a flat-index `Uint32Array`; a `node_budget` control is size-scaled and user-facing.

## Futoshiki (sibling game)

The same engine drives a second game. Futoshiki is an N×N Latin square with inequality constraints between adjacent cells: `add_all_different` per row and column, fixed-cell equalities, and `add_greater_than` for each `<`/`>` annotation. It ships generation (seed a Latin square via the solver, place adjacency-valid inequalities, dig holes under a `max_solutions: 2` uniqueness check) and boundary validation (`FutoshikiPuzzle::from_parts`). v1 covers N=4..7. It exposes the same surfaces as Sudoku -- Rust, PyO3, wasm, and a frontend game package (`board_size` on the wire, never `size`). Its uniqueness check is sound only after the kernel's AC-3 trail-push fix, which the tranche landed.
