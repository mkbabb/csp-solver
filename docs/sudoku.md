# Sudoku Solver and Generator

Handles sub-grid sizes N=2 through N=5 (4x4 through 25x25 boards). The web app exposes N=2, 3, 4. Generation supports both template-based fast path (sub-millisecond) and hole-digging slow path (with difficulty calibration).

## CSP Formulation

A standard N=3 Sudoku has M=9 (M = N*N), giving M*M = 81 variables, each with domain {1..M}. The domain is `BitsetDomain::new(1..=m)` -- a u128 bitmask with bits 1 through 9 set.

The constraint structure uses `AllDifferent` constraints: one per row, one per column, one per N*N subgrid. For 9x9, that's 9 + 9 + 9 = 27 constraints. Each `AllDifferent` has scope of size M (9 variables). This is dramatically more effective than the pairwise decomposition (810 `NotEqual` constraints for 9x9), because the n-ary GAC propagator can detect inconsistencies that pairwise arc consistency misses.

`create_sudoku_csp()` builds the CSP for any sub-grid size N (N=2 for 4x4, N=3 for 9x9, N=4 for 16x16, up to N=5 for 25x25). Variables are indexed row-major: cell (r, c) maps to `r * M + c`. Subgrid constraints iterate over the N*N cells within each band-stack block via a `flat_map` over row and column offsets. After adding all constraints, `finalize()` builds the adjacency graph.

`solve_with_given()` handles the pre-assigned cells in three stages:
1. Restrict each given cell's domain to a singleton by removing all other values.
2. One-hop propagation: for each given cell, remove its value from all neighbor domains (cells sharing a row, column, or subgrid). Non-given neighbors only.
3. Full AC-3 at depth 0 -- permanent reductions that don't need undo log entries. This propagates the implications of all given cells simultaneously.

For easy puzzles, these three stages alone solve the board with zero backtracks. The subsequent search finds the assignment already complete.

## Template-Based Generation

The fast path for puzzle generation uses pre-computed templates stored as JSON files. Each template contains a puzzle (with holes) and its unique solution. `generate_board_with_templates()` picks a random template and applies a random symmetry transform -- sub-millisecond for any board size.

Templates live in `data/sudoku_puzzles/{N}/{difficulty}/`. The web app loads them at startup; the Rust solver uses them when provided.

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

`SudokuTransform` stores each component permutation as separate fields: `digit_perm` (Vec<u32>, 1-indexed), `row_perms` (Vec per band), `col_perms` (Vec per stack), `band_perm`, `stack_perm`, and `do_transpose` (bool). `random_with_rng()` generates each component independently via Fisher-Yates shuffle on the appropriate index range.

`apply()` maps each cell position through the full transform chain. For each cell at `(old_row, old_col)`:
1. Decompose into band + row-within-band, stack + column-within-stack.
2. Permute band, then row within the _new_ band. Permute stack, then column within the _new_ stack.
3. Optionally transpose (swap row and column).
4. Remap the digit value through `digit_perm`. Zero (empty cell) maps to zero.

O(M^2) per application -- just arithmetic and indexing. The RNG uses a lightweight `SimpleRng` (xorshift64) seeded from system time, avoiding any external dependency.

## Hole-Digging Generation

When no templates exist for the requested size/difficulty, generation falls back to hole-digging:

1. **Seed a complete solution.** Create an empty board, fill the first row with a random permutation of 1..M (`SimpleRng::shuffle`), then solve the rest with AC-3 + FailFirst. The random first row is always consistent by construction -- no constraints are violated by a permutation in a single row. The solver fills the remaining 72 cells (for 9x9) deterministically given the seed row.

2. **Dig holes.** Shuffle all M*M cell indices randomly. For each cell in order, tentatively remove it (set to 0). Construct a fresh CSP from the modified board and solve with `max_solutions: 2`. If exactly one solution exists, the removal is permanent. If more than one solution exists, restore the cell -- the puzzle must have a unique solution.

3. **Difficulty calibration.** Solve the generated puzzle with FC + FailFirst (not AC-3 -- see note below). Count backtracks:
   - Easy: 0 backtracks (propagation alone suffices)
   - Medium: <50 backtracks
   - Hard: >100 backtracks

   The target hole count is tuned per difficulty: `total / 4` for easy, `total / 1.75` for medium, `total / 1.25` for hard. More holes generally means harder, but the uniqueness constraint prevents arbitrary removal -- some cells are structural keystones that, if removed, create ambiguity.

The uniqueness check is the expensive part -- each candidate hole requires a full CSP construction and solve. For 9x9, the total generation time is ~1.3ms. For 16x16, it's ~36.5ms as the per-solve cost grows with board size. Template-based generation avoids this entirely.

## Solve Configuration

The solver accepts `SolveConfig` with four axes:

- **Pruning**: `None` (pure backtrack), `ForwardChecking`, `Ac3` (MAC), `AcFc` (FC + singleton propagation).
- **Ordering**: `Chronological`, `FailFirst` (MRV -- smallest domain first), `DomWdeg` (domain size / weighted constraint failure count).
- **max_solutions**: Cap on the number of solutions to find. Set to 1 for normal solving, 2 for uniqueness checking during generation.
- **backjumping**: Conflict-directed backjumping instead of chronological backtracking.

For hard puzzles, `Ac3 + DomWdeg` is the strongest Rust configuration. AC-3 provides strong propagation after each assignment, and DomWdeg's learned constraint weights guide the search toward the most constrained regions. Python's best is `ForwardChecking + FailFirst + GAC` -- the GAC AllDifferent propagator compensates for Python's slower per-operation overhead by doing more work per constraint revision, and FailFirst is cheaper to evaluate than DomWdeg in a language where every comparison costs more.

Difficulty measurement uses `ForwardChecking + FailFirst` specifically because its backtrack count correlates well with human-perceived difficulty. AC-3's stronger propagation would suppress backtracks that humans would experience as logical dead ends.

## Web Integration

The Python API (FastAPI) exposes `generate` and `solve` endpoints. Generation uses the Rust solver via PyO3 bindings -- `generate_board_with_templates()` is called with pre-loaded JSON templates. The response includes both the puzzle and its solution. The frontend renders the board with a pencil-mark UI and validates against the solution client-side.
