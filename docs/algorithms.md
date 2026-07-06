# Algorithms

## AC-3

Mackworth's (1977) arc consistency algorithm ensures that for every constraint and every value in a variable's domain, there exists a consistent assignment of the other variables in the constraint's scope. Values that have no support are pruned. The implementation adapts the standard worklist formulation with a bitset for lower overhead.

The worklist is a `Vec<u64>` where each bit represents a constraint index. Insert sets a bit via `words[idx / 64] |= 1 << (idx % 64)` -- O(1). Pop scans words for the first nonzero, extracts the lowest set bit via `trailing_zeros`, and clears it with `word &= word - 1`. Scan cost is O(words), which for a 9x9 Sudoku's 27 AllDifferent constraints is a single word. The `new_full` constructor initializes all bits, masking the final word to the actual constraint count.

Two entry points:

- `ac3_full` initializes all constraint bits and drains to a fixed point. Used for initial propagation before search begins.
- `ac3_from_variable` seeds only the constraints involving a specific variable -- the MAC (Maintaining Arc Consistency) variant used during backtracking search. The seeded version skips constraints whose scope is fully assigned, since they can't produce further domain reductions. After each `Changed` revision, it checks all scope variables for empty domains before enqueuing neighbors -- early termination on wipe-out.

Both the `Changed` and `Unsatisfiable` arms push the revised constraint's whole scope onto the external `Trail` before returning, so backtracking restores every prune. (The `Unsatisfiable` arm omitting that push was the source of the false-UNSAT regression the kernel wave closed -- `evidence/kernel-soundness-closure.md` §0.)

`revise()` returns a tri-state `Revision`: `Unchanged`, `Changed`, or `Unsatisfiable`. Each constraint type implements its own revision logic:

- **NotEqual** checks if either variable's domain is a singleton. If variable X is fixed to value `v`, it removes `v` from Y's domain (and vice versa). O(1) for `BitsetDomain` -- a single bit-clear operation.
- **AllDifferent** propagates all singleton values to peers -- for each assigned variable in the scope, remove its value from every unassigned variable's domain. It then invokes the GAC propagator (below) whenever the live-participant count is at least `GAC_MIN_PARTICIPANTS` (3).
- **AllDifferentExcept / Soft / Custom** fall back to pairwise support checking: for each value in a variable's domain, test whether some consistent assignment of the other variables exists. Uses a reusable `Vec<D::Value>` buffer to avoid per-call allocation.

When `revise()` returns `Changed`, only the constraint's precomputed neighbors (constraints sharing at least one variable) are enqueued -- not the entire constraint set. The adjacency graph computes these neighbor lists at `finalize()` time. Work is proportional to the number of affected constraints, not the total number.

## GAC AllDifferent (Régin 1994)

Generalized arc consistency for n-ary all-different constraints. Standard AC-3 with pairwise NotEqual constraints can't detect all inconsistencies -- GAC reasons about the constraint as a whole, using matching theory to determine which (variable, value) pairs can participate in any global solution. Three phases, each building on the last.

**Phase 1 -- Maximum Matching.** Hopcroft-Karp on the variable-value bipartite graph. U-nodes are unassigned variables (non-singleton, non-empty domains). V-nodes are domain values, excluding values already assigned to singleton variables. BFS from free U-nodes builds a level graph with distance labels; DFS finds vertex-disjoint augmenting paths along the level constraints. O(E * sqrt(V)). If the matching doesn't cover all unassigned variables, the constraint is immediately unsatisfiable -- there aren't enough distinct values to go around. The matching is warm-started per constraint (cached, keyed by a stable id) and repaired incrementally across `revise()` calls; the cache is a pure hint, sound across backtracking.

Below `GAC_MIN_PARTICIPANTS` live variables the propagator short-circuits with `Unchanged` -- singleton removal in the standard `revise()` path handles the small cases.

**Phase 2 -- Residual Graph.** The residual graph has `n_vars + n_vals` nodes. Matched edges are reversed (value-node -> variable-node), unmatched edges kept forward (variable-node -> value-node). Free values -- those unmatched in the current matching -- seed a BFS that marks all reachable nodes. An unmatched edge (var, val) that lies on an alternating path from a free vertex can participate in _some_ maximum matching, so it must be preserved.

This free-vertex reachability is critical for correctness. Without it, the algorithm would prune edges that belong to alternative maximum matchings, potentially making a satisfiable CSP appear unsatisfiable. The classic failure case: two variables with identical two-element domains. Both matchings are valid, but neither edge should be pruned.

**Phase 3 -- SCC Decomposition.** Iterative Tarjan on the residual graph. The implementation uses an explicit call stack (`Vec<(u32, u32)>` of node + neighbor-index pairs) instead of recursion, avoiding stack overflow on large constraint scopes. Lowlink propagation happens on the call-stack pop, mirroring the recursive algorithm's post-order update. A (var, val) pair is pruned if all three conditions hold:
1. The edge isn't in the current matching (matched edges are always safe).
2. The variable and value nodes are in different SCCs.
3. The value node isn't reachable from any free vertex.

Pruning records the removal in the trail so backtracking can restore it.

The implementation avoids `Ord`/`Hash` bounds on domain values. Values are mapped to contiguous indices via position in a deduplicated `Vec<D::Value>`, using only `PartialEq` comparisons. For Sudoku-sized domains (9 values), this linear scan carries the propagator.

### GAC on Sudoku -- the corrected causal story

Two things about GAC's history here were wrong in the pre-tranche docs, and both are corrected.

**It ran at forward-checking strength, not GAC strength.** The n-ary propagator was gated off; `AllDifferent::revise()` did singleton removal only. It now runs at full GAC strength, **default-ON**, above the live-participant gate. The behavioral evidence for enabling it: a 16×16 hard board that failed at a 5,000,000-node budget with GAC off solves in ~1,000 nodes with it on (`evidence/synthesis-pass2.md` prototype 2).

**The AssignmentBuilder speedup was never GAC's.** The Pass-1 audit attributed the builder's ~1.8 M× gap to Régin being rebuilt from scratch on every revise, and proposed incrementalization as the cure. Measurement inverted this: on the profiled probe GAC was invoked **zero times** -- the builder ran under `Pruning::AcFc`, which never calls `revise()`, and the millions of events were forward-check prunes. The dominant lever is the one-line builder rewiring `AcFc → Ac3` (~2,670×); incrementalization is a secondary 1.2–1.6× enabler once GAC is actually on the path (`evidence/synthesis-pass2.md` §D1). The lesson holds either way: the pre-split "AC-3 invokes revise thousands of times" exclusion rationale is obsolete -- the 16×16 failure-to-success result justifies the wiring.

The minority cost this default carries is disclosed in `benchmarks.md`.

## Unified search kernel

Backtracking search lives in one function, `solver/search.rs::search`, generic over the pruning strategy. It replaced the former separate `backtrack.rs` and `backjump.rs`. Conflict-directed backjumping was excised with the unification -- the `SolveConfig::backjumping` field is gone -- so the kernel is plain chronological backtracking maintaining consistency via the chosen `Pruning` strategy and trail-based undo.

Each node: pick the next variable by the ordering heuristic, iterate its domain values, assign into the mutable assignment slice, propagate, recurse or backtrack. The trail records every prune keyed to search depth; on backtrack, `Trail::undo_to(depth)` restores exactly the variables it was told were touched. Enumerate-all termination respects `max_solutions`; a `node_budget` bounds the search, surfaced as a distinct budget-exceeded outcome. A solution-set-invariance property test (`tests/solution_set_invariance.rs`) asserts the enumerate-all set is identical across every Pruning × Ordering combination -- the standing guard on kernel soundness.

## Forward Checking

Forward checking is the lightweight alternative to AC-3. After assigning a variable, it checks each unassigned neighbor: for each value in the neighbor's domain, tentatively assign it, check all fully-instantiated constraints, and prune if no constraint is satisfied. The assign-check-unassign pattern avoids allocation (see `optimizations.md`).

AC-FC hybrid (`AcFc`) extends forward checking with singleton propagation: after the forward check pass, any neighbor reduced to a singleton triggers further forward checking from that neighbor. This cascades until no new singletons appear. It's cheaper than full AC-3 but catches more implications than bare forward checking.

## Propagation Strategies

`propagate()` auto-selects based on whether `finalize()` has been called:

- **AC-3**: Full worklist propagation with adjacency graph. Used by search-based solving (Sudoku, queens, coloring). Requires precomputed neighbor lists from `finalize()`. Suited to constraints with local scope, where changes propagate sparsely through the graph.
- **Sweep** (`propagate_monotonic`): Fixed-point iteration over all constraints until no changes occur. Used by lattice domains (type inference, FIRST/FOLLOW sets) where domains are monotonic -- values only grow via `join()`, never shrink. No adjacency graph needed, no undo log. Each iteration touches every constraint; convergence is guaranteed by the finite lattice height.
- **Stratified sweep** (`propagate_stratified`): SCC-ordered propagation via Tarjan SCCs. Constraints are topologically sorted by their SCC membership. Acyclic constraints (singleton SCCs with no self-loop) converge in a single pass when processed in order. Only cyclic SCCs need iterative fixed-point within their group. This avoids redundant re-evaluation of constraints that depend on values already stabilized.

`propagate_with(strategy)` allows explicit selection when the auto-detection doesn't fit. Lattice CSPs that call `propagate()` without `finalize()` get sweep; search CSPs that call `finalize()` get AC-3.

## Variable Ordering

Three heuristics, selected via `SolveConfig::ordering`:

- **Chronological**: Pick variables in stack order (last element via `stack.len() - 1`). Baseline -- no intelligence, zero overhead per selection.
- **FailFirst** (MRV): Pick the unassigned variable with the smallest remaining domain. A variable with 2 remaining values fails faster than one with 8, pruning the search tree earlier. O(n) scan over the variable stack, comparing `domain.size()` values.
- **Mrv**: Pick the variable minimizing `domain-size / Σ constraint-weights`. The weights are **frozen at 1.0** -- no dom/wdeg bumping is wired to the kernel -- so this is a static heuristic, and `Chs` (the conflict-history variant) shares the same scan with dynamically evolving weights the day a driver lands. The name replaces the former `DomWdeg`, which measurement showed to be a misnomer: with weights frozen, `Chs ≡ DomWdeg` bit-for-bit.

The served hard-Sudoku path runs `Ac3 + Mrv`; generation and `SolveConfig::default()` run `Ac3 + FailFirst`. Difficulty calibration deliberately runs `ForwardChecking + FailFirst`, whose backtrack count tracks human-perceived difficulty (AC-3's stronger propagation would suppress backtracks a human experiences as logical dead ends).
