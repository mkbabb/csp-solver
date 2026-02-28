# CSP Solver Optimization: Research & Implementation

## 1. Introduction

This document describes nine optimizations applied to the CSP solver engine (`csp.py`). The solver implements backtracking search with constraint propagation for generalized constraint satisfaction problems, with Sudoku (2x2 through 5x5 subgrids) as the primary application.

**Goals**: Reduce backtrack count and wall-clock time without external solver libraries or architectural overhaul. All optimizations are composable and independently toggleable.

**Architecture**: The CSP class supports pluggable pruning (forward checking, AC3, AC-FC), variable ordering (static, MRV/fail-first, dom/wdeg), and optional GAC all-different propagation.

---

## 2. Implemented Optimizations

### 2.1 BitsetDomain (`bitset_domain.py`)

**Algorithm**: Duck-typed `set` replacement backed by a Python `int` bitmask. Each domain value `v` corresponds to bit `v` in the integer.

**Complexity**:
| Operation | `set` | `BitsetDomain` |
|-----------|-------|----------------|
| `v in d` | O(1) hash | `_bits & (1 << v)` — pure bitwise |
| `len(d)` | O(1) cached | `_bits.bit_count()` — hardware POPCNT |
| `copy()` | O(n) alloc | `new._bits = self._bits` — O(1) |
| `discard(v)` | O(1) hash | `_bits &= ~(1 << v)` — pure bitwise |
| `update(other)` | O(n) | `_bits \|= other._bits` — O(1) |

**Implementation**: `__slots__` for memory, bypasses `__init__` on `copy()`, bit-trick iteration via `bits & -bits` (isolate lowest set bit). Auto-selected by `_make_domain()` factory for non-negative integer domains.

**Impact**: Biggest win on `copy()` during backtracking (called once per variable per value tried). For N=3 Sudoku with 81 variables and domain size 9, saves ~81 set copies per backtrack step.

### 2.2 Set-Based Domains

**Bug fix**: The original code declared `current_domains` as `dict[Any, list[Any]]` and used `list.remove(x)` — O(n) per removal. The docstring claimed sets were used.

**Change**: `current_domains` now stores `BitsetDomain` (integer domains) or `set` (string domains). All mutation uses `discard()` instead of `remove()`, `update()` instead of `extend()`.

### 2.3 DWO Early Termination

**Bug fix**: `forward_check()`, `AC3()`, and `AC_FC()` originally returned `None`. On domain wipe-out (DWO), `backtrack()` entered a dead subtree anyway.

**Change**: All three pruning functions now return `bool` — `True` means DWO detected. `backtrack()` skips the recursive call on DWO, immediately trying the next value.

**Impact**: Eliminates fruitless exploration of entire subtrees after a DWO, which was the single most impactful correctness fix.

### 2.4 AC-2001 Residual Supports

**Algorithm** (Bessiere & Regin, 2001): For each arc `(Xi, x, Xj)`, cache the last known support value `y` in `Xj`'s domain. On re-revision, check the cached support first — if it's still valid, skip the full domain scan.

**Complexity**: AC-3 is O(ed³) where e = edges, d = domain size. AC-2001 achieves optimal O(ed²) by avoiding redundant support searches.

**Implementation**: `self.last_support: dict[tuple, Any]` — passive cache, no save/restore on backtrack. Stale entries trigger one cache miss then refresh. This avoids the overhead of maintaining the cache across backtrack operations while still capturing most of the benefit.

### 2.5 Initial AC3 Propagation

**Algorithm**: After one-hop propagation (removing given values from peer domains), run a full AC3-style worklist pass over arcs adjacent to given cells. Catches cascading singleton propagation chains.

**Implementation**: Uses a dedicated worklist seeded from given cells. Operates directly on `current_domains` without `pruned_map` tracking (permanent reductions, no undo needed). If any domain is wiped out, returns `False` immediately (unsolvable puzzle).

**Impact**: For puzzles with many givens (easy/medium), this can solve the entire puzzle during initial propagation with zero backtracks.

### 2.6 Pair-Constraint Index

**Problem**: `forward_check()` and `revise()` called `is_valid(v, solution)`, which tests *all* constraints on `v`. In 9×9 Sudoku each cell participates in 3 all-different constraints (row, column, subgrid). But forward checking between two specific variables only needs the constraints they *share* — typically one.

**Algorithm**: At `add_constraint()` time, build `_pair_constraints: dict[frozenset, list[Constraint]]` mapping each variable pair to their shared constraints. `is_valid_pair(v1, v2, solution)` checks only those.

**Implementation**:
- `add_constraint()` iterates all O(k²) pairs in the constraint's variable list and appends the constraint to each pair's entry
- `forward_check()` and `revise()` call `is_valid_pair()` instead of `is_valid()`
- `backtrack()` still uses `is_valid()` for the full assignment check

**Impact**: On Golden Nugget, `all_different check` calls drop from 267K to 181K (−32%), with constraint check time halved from 0.311s to 0.170s.

### 2.7 dom/wdeg Variable Ordering

**Algorithm** (Boussemart et al., 2004): Each constraint has a weight (initially 1.0). On DWO, increment the weight of all constraints involving the current variable. Variable selection minimizes `|dom(v)| / wdeg(v)` where `wdeg(v)` is the sum of weights of constraints on `v`.

**Implementation**:
- Each constraint gets a unique ID at `add_constraint()` time
- `_constraint_weights[cid]` stores the weight
- `_var_constraint_ids[v]` maps variables to their constraint IDs
- `_wdeg(v)` sums weights; `_increment_weights_on_dwo(v)` bumps them on failure

**Impact**: Adapts variable ordering to the problem structure discovered during search. Focuses on "hard" variables (those involved in many failed constraints). Often outperforms static MRV on hard instances.

### 2.8 GAC All-Different (Régin, 1994)

**Algorithm**: Generalized arc consistency for all-different constraints via maximum bipartite matching + SCC decomposition.

1. Build bipartite value graph: variables → domain values
2. Find maximum matching via Hopcroft-Karp
3. Build directed residual graph (matched edges reversed)
4. Find SCCs via Tarjan's algorithm
5. Prune: remove edge `(var, val)` if `val` is NOT matched to `var` AND `var` and `val` are NOT in the same SCC

**Complexity**: O(n^(1/2) · m) for Hopcroft-Karp, O(n + m) for Tarjan, where n = variables + values, m = edges.

**Implementation** (`gac_alldiff.py`, ~200 lines):
- Standalone module with `gac_alldiff_propagate(unassigned, current_domains, solution, group)`
- Returns list of `(variable, value)` pairs to prune
- Integrated into `CSP._propagate_gac_alldiff()`, called after the main pruning function
- Constraint tagging: `all_different_constraint` sets `check._is_alldiff = True`
- Coexists with binary constraint checker (GAC is a *propagator*, not a *validator*)
- Skips groups with ≤2 unassigned variables (binary FC handles these)

**Internals (Pass 2 rewrite)**: The original implementation used tagged tuples `("var", v)` / `("val", v)` as dict keys with `dict[Any, list[Any]]` adjacency — heavy allocation on every call (11K calls on Golden Nugget). Rewritten to use integer-indexed nodes: variables map to `0..n-1`, values to `n..n+m-1`. Adjacency is `list[list[int]]`. Tarjan is iterative (eliminates Python recursion-limit risk and call overhead). Hopcroft-Karp BFS uses a list with head pointer instead of `deque`.

| Component | Before | After |
|-----------|--------|-------|
| Node representation | `dict[tuple, ...]` | `list[int]` |
| Adjacency | `dict[Any, list[Any]]` | `list[list[int]]` |
| Tarjan | recursive, 76K `strongconnect` calls | iterative, explicit stack |
| Hopcroft-Karp | `deque` BFS | list + head pointer |
| GAC total (Golden Nugget) | 0.226s | 0.107s (−53%) |

**Impact**: Catches reasoning that binary AC misses entirely. Classic example: 3 variables with domain {1,2} under all-different — binary consistency sees no issue, but GAC detects the pigeonhole violation immediately.

**Benchmark**: On `sudoku_3_hard`, GAC all-different reduces backtracks from 326 to 34 (9.6x improvement).

### 2.9 Nogood Recording (standalone module)

**Algorithm**: Record failed partial assignments (nogoods) as frozen sets of `(variable, value)` pairs. Check if a proposed assignment would complete any stored nogood.

**Implementation** (`nogoods.py`, ~70 lines):
- `NogoodStore(max_length=6, max_entries=1000)` — bounded hash-based store with LRU eviction
- `record(conflict_assignments)`: store a nogood
- `is_nogood(variable, value, solution)`: check via `_var_index` for fast lookup

**Status**: Retained as a standalone data structure but **decoupled from the solver hot loop**. The original integration added a branch per domain value in `backtrack()` — dead code after CBJ removal (CBJ was the nogood source). Removing the integration eliminated one branch per value in the inner loop and clarified the solver's critical path.

---

## 3. Rejected Alternatives

| Technique | Rationale for Rejection |
|-----------|------------------------|
| **CBJ** (Conflict-Directed Backjumping) | Implemented, then removed. Unsound interaction with GAC propagation — conflict sets do not account for domain prunings made by the GAC propagator, leading to incorrect backjump targets. Correct integration requires explanation-based justification (i.e., LCG). |
| **Nogood recording (integrated)** | Depended on CBJ for conflict sets. Without CBJ, nogoods had no source. The `NogoodStore` class is retained as a standalone module. |
| **Lazy Clause Generation** | 400-600 lines. Requires explainable constraints + SAT core. Architectural overhaul beyond scope. Would be worth it for a production solver targeting arbitrary CSPs. |
| **MILP / LP relaxation** | Requires scipy or PuLP dependency. Project constraint: no external solver libraries. |
| **STR2/STR3** (Simple Tabular Reduction) | Designed for opaque table constraints (extensional). Sudoku constraints are intensional (procedural). |
| **LCV** (Least Constraining Value) | Cost of computing LCV exceeds benefit when forward checking is active. FC already prunes impossible values; LCV's tie-breaking rarely pays off. |
| **Cython / PyPy** | Build complexity. PyPy incompatible with Python 3.13 + pydantic v2. Cython requires C compilation in Docker. |
| **ABS** (Activity-Based Search) | Harder to tune than dom/wdeg. Requires decay parameter. Marginal benefit over dom/wdeg for structured problems like Sudoku. |

---

## 4. Performance Analysis

### Backtrack Counts

| Puzzle | baseline | ac3_mrv | dom_wdeg | gac_alldiff | all_optimized |
|--------|----------|---------|----------|-------------|---------------|
| sudoku_2_easy | 0 | 0 | 0 | 0 | 0 |
| sudoku_3_medium | 0 | 0 | 0 | 0 | 0 |
| sudoku_3_hard | 326 | 323 | 699 | **34** | 99 |
| australia_map | 0 | 3 | 0 | 0 | 0 |
| nqueens_8 | 70 | 53 | 70 | 70 | 70 |

### Stress Test: Hard 9×9 Puzzles

| Puzzle | baseline | gac_alldiff | dom_wdeg+gac |
|--------|----------|-------------|--------------|
| Al Escargot | 174 | 144 | **114** |
| Platinum Blonde | 9 | **0** | **0** |
| Golden Nugget | 8,317 | 6,376 | **5,537** |
| Inkala 2010 | 386 | **199** | 468 |
| 17-clue minimal | 12,564 | 6,415 | **375** |
| 16×16 moderate | 681 | **5** | **5** |
| 16×16 hard | — | **0** | — |

### Profile: Golden Nugget (GAC enabled)

cProfile on Golden Nugget across optimization passes:

| Metric | Pass 1 (1.66s) | Pass 2 (1.02s) | Δ |
|--------|----------------|----------------|---|
| `all_different check` | 0.311s / 267K calls | 0.170s / 181K calls | −45% |
| `gac_alldiff_propagate` | 0.226s | 0.107s | −53% |
| Tarjan SCC | 0.155s (recursive) | 0.096s (iterative) | −38% |
| `set.add` | 0.135s / 1.57M | 0.052s / 965K | −61% |
| Hopcroft-Karp | 0.091s | 0.025s | −73% |
| `is_valid` + genexpr | 0.137s / 352K | 0.063s / 170K | −54% |

### Key Observations

1. **GAC all-different dominates on hard Sudoku**: 326 → 34 backtracks (9.6x). The single highest-ROI optimization for Sudoku specifically.

2. **dom/wdeg alone can hurt**: 326 → 699 on `sudoku_3_hard`. Weight learning needs enough failures to calibrate. On this puzzle, initial ordering choices lead to deeper dead ends before weights stabilize.

3. **dom/wdeg + GAC synergize**: `all_optimized` achieves 99 backtracks. GAC provides domain reductions, dom/wdeg learns from the remaining failures. On 17-clue minimal: 12,564 → 375 (33x).

4. **Pair-constraint index is the structural win**: `is_valid_pair()` cuts constraint checks by ~52% in `forward_check`/`revise` by testing only shared constraints between two variables instead of all constraints on a variable.

5. **GAC integer indexing halves propagation cost**: Replacing tagged-tuple dicts with integer-indexed arrays eliminates allocation overhead per call. 11K calls × fewer allocations = 0.12s saved.

6. **AC3 pruning is expensive**: `ac3_mrv` on `sudoku_3_hard` takes ~9x longer than baseline despite similar backtrack counts. Forward checking remains the sweet spot for Sudoku.

---

## 5. Future Directions

### 5.1 Lazy Clause Generation (LCG)

The most impactful next step. LCG combines CSP propagation with SAT-style clause learning:
- Each propagator explains its inferences as clauses
- Failed subtrees produce learned clauses (conflict-driven clause learning)
- Eliminates re-exploration of equivalent subtrees across the entire search

Estimated effort: 400-600 lines. Requires refactoring constraints to be "explainable" (each can produce a reason clause for any inference it makes).

### 5.2 Additional Puzzle Demos

The solver engine is fully general. Immediate candidates:
- **Graph coloring** (already supported via `map_coloring_constraint`)
- **Cryptarithmetic** (SEND + MORE = MONEY)
- **Nonograms** (picture logic puzzles)
- **Futoshiki** (already partially implemented in the codebase)

### 5.3 Parallel Search

Python's GIL limits true parallelism, but:
- `multiprocessing` can run independent subproblems
- Portfolio approach: run multiple solver configs in parallel, take first solution
- Work-stealing across subtrees

### 5.4 Type Inference as CSP

An interesting application: formulating type inference as a CSP where variables are type slots and constraints are type compatibility rules. The all-different constraint maps naturally to union type exclusion.

---

## 6. References

1. Mackworth, A. K. (1977). Consistency in networks of relations. *Artificial Intelligence*, 8(1), 99-118.
2. Bessiere, C., & Régin, J. C. (2001). Refining the basic constraint propagation algorithm. *IJCAI*, 309-315.
3. Régin, J. C. (1994). A filtering algorithm for constraints of difference in CSPs. *AAAI*, 362-367.
4. Boussemart, F., Hemery, F., Lecoutre, C., & Sais, L. (2004). Boosting systematic search by weighting constraints. *ECAI*, 146-150.
5. Hopcroft, J. E., & Karp, R. M. (1973). An n^(5/2) algorithm for maximum matchings in bipartite graphs. *SIAM Journal on Computing*, 2(4), 225-231.
6. Tarjan, R. E. (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146-160.
