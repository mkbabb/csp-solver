# Algorithms

## AC-3

Mackworth's (1977) arc consistency algorithm ensures that for every constraint and every value in a variable's domain, there exists a consistent assignment of the other variables in the constraint's scope. Values that have no support are pruned. The implementation adapts the standard worklist formulation with a bitset for lower overhead.

The worklist is a `Vec<u64>` where each bit represents a constraint index. Insert sets a bit via `words[idx / 64] |= 1 << (idx % 64)` -- O(1). Pop scans words for the first nonzero, extracts the lowest set bit via `trailing_zeros`, and clears it with `word &= word - 1`. Scan cost is O(words), which for a 9x9 Sudoku's 27 AllDifferent constraints is a single word. The `new_full` constructor initializes all bits, masking the final word to the actual constraint count.

Two entry points:

- `ac3_full` initializes all constraint bits and drains to a fixed point. Used for initial propagation before search begins.
- `ac3_from_variable` seeds only the constraints involving a specific variable -- the MAC (Maintaining Arc Consistency) variant used during backtracking search. The seeded version skips constraints whose scope is fully assigned, since they can't produce further domain reductions. After each `Changed` revision, it checks all scope variables for empty domains before enqueuing neighbors -- early termination on wipe-out.

`revise()` returns a tri-state `Revision`: `Unchanged`, `Changed`, or `Unsatisfiable`. Each constraint type implements its own revision logic:

- **NotEqual** checks if either variable's domain is a singleton. If variable X is fixed to value `v`, it removes `v` from Y's domain (and vice versa). O(1) for `BitsetDomain` -- a single bit-clear operation.
- **AllDifferent** propagates all singleton values to peers -- for each assigned variable in the scope, remove its value from every unassigned variable's domain. O(k*n) where k is assigned count and n is scope size. Also triggers GAC propagation when the unassigned count exceeds 2 (see below).
- **Lambda/Custom** falls back to pairwise support checking: for each value in a variable's domain, test whether some consistent assignment of the other variables exists. Uses a reusable `Vec<D::Value>` buffer to avoid per-call allocation.

When `revise()` returns `Changed`, only the constraint's precomputed neighbors (constraints sharing at least one variable) are enqueued -- not the entire constraint set. The adjacency graph computes these neighbor lists at `finalize()` time. This is the key efficiency property of AC-3 over naive fixed-point: work is proportional to the number of affected constraints, not the total number.

## GAC AllDifferent (Regin 1994)

Generalized arc consistency for n-ary all-different constraints. Standard AC-3 with pairwise NotEqual constraints can't detect all inconsistencies -- GAC reasons about the constraint as a whole, using matching theory to determine which (variable, value) pairs can participate in any global solution. Three phases, each building on the last.

**Phase 1 -- Maximum Matching.** Hopcroft-Karp on the variable-value bipartite graph. U-nodes are unassigned variables (non-singleton, non-empty domains). V-nodes are domain values, excluding values already assigned to singleton variables. BFS from free U-nodes builds a level graph with distance labels; DFS finds vertex-disjoint augmenting paths along the level constraints. O(E * sqrt(V)). If the matching doesn't cover all unassigned variables, the constraint is immediately unsatisfiable -- there aren't enough distinct values to go around. The algorithm terminates when no more augmenting paths exist.

For a binary case (2 or fewer unassigned variables), the function short-circuits with `Unchanged` -- singleton removal in the standard `revise()` path handles it.

**Phase 2 -- Residual Graph.** The residual graph has `n_vars + n_vals` nodes. Matched edges are reversed (value-node -> variable-node), unmatched edges kept forward (variable-node -> value-node). Free values -- those unmatched in the current matching -- seed a BFS that marks all reachable nodes. An unmatched edge (var, val) that lies on an alternating path from a free vertex can participate in _some_ maximum matching, so it must be preserved.

This free-vertex reachability is critical for correctness. Without it, the algorithm would prune edges that belong to alternative maximum matchings, potentially making a satisfiable CSP appear unsatisfiable. The classic failure case: two variables with identical two-element domains. Both matchings are valid, but neither edge should be pruned.

**Phase 3 -- SCC Decomposition.** Iterative Tarjan on the residual graph. The implementation uses an explicit call stack (`Vec<(u32, u32)>` of node + neighbor-index pairs) instead of recursion, avoiding stack overflow on large constraint scopes. Lowlink propagation happens on the call-stack pop, mirroring the recursive algorithm's post-order update. A (var, val) pair is pruned if all three conditions hold:
1. The edge isn't in the current matching (matched edges are always safe).
2. The variable and value nodes are in different SCCs.
3. The value node isn't reachable from any free vertex.

Pruning calls `variable.prune(val, depth)`, recording the removal in the undo log so backtracking can restore it.

The implementation avoids `Ord`/`Hash` bounds on domain values. Values are mapped to contiguous indices via position in a deduplicated `Vec<D::Value>`, using only `PartialEq` comparisons. For Sudoku-sized domains (9 values), this linear scan is faster than building a HashMap.

## Backjumping

Conflict-directed backjumping replaces chronological backtracking's "undo one level" with "jump to the source of the conflict." When a variable exhausts all values without finding a consistent assignment, the algorithm identifies which previously-assigned variables caused the failures and skips past variables that had nothing to do with the dead end.

The conflict set uses dual tracking: a `Vec<bool>` for O(1) membership testing (indexed by variable id) and a `Vec<VarId>` for the actual conflict variables (needed for iteration and cleanup). When a constraint check fails, all other assigned variables in that constraint's scope are added to the conflict set -- they're the ones whose values collectively caused the failure. On domain wipe-out during forward checking or AC-3, all neighbor variables with assignments join the set, since the wipe-out is a consequence of the combined assignments in the neighborhood.

On exhaustion (all values for the current variable have been tried), the search finds the most recent variable in the assigned order that appears in the conflict set. This is a single-pass scan over `assigned_order` -- find the maximum position `pos` where `conflict_membership[assigned_order[pos]]` is true. The search then jumps directly to that depth. Intermediate variables between the current position and the jump target are skipped entirely, avoiding futile exploration of subtrees that can't resolve the conflict. The conflict membership flags are cleared after the jump to prevent stale entries from contaminating future decisions.

The `BackjumpResult` enum captures three outcomes: `Continue` (normal return, try next value), `Done` (solution limit reached, terminate), and `JumpTo(depth)` (unwind to the specified depth). The recursive search function propagates `JumpTo` upward, restoring domains via `variable.restore(depth)` at each unwound level. When a `JumpTo` arrives at the target depth, the search continues trying the next value for that variable -- it doesn't immediately backtrack further.

Backjumping composes with all pruning strategies (None, ForwardChecking, Ac3, AcFc) and all variable ordering heuristics. The `BackjumpConfig` carries constraint weights and per-variable constraint ids for DomWdeg ordering.

## Forward Checking

Forward checking is the lightweight alternative to AC-3. After assigning a variable, it checks each unassigned neighbor: for each value in the neighbor's domain, tentatively assign it, check all fully-instantiated constraints, and prune if no constraint is satisfied. The assign-check-unassign pattern avoids allocation (see `optimizations.md`).

AC-FC hybrid (`AcFc`) extends forward checking with singleton propagation: after the forward check pass, any neighbor reduced to a singleton triggers further forward checking from that neighbor. This cascades until no new singletons appear. It's cheaper than full AC-3 but catches more implications than bare forward checking.

## Propagation Strategies

`propagate()` auto-selects based on whether `finalize()` has been called:

- **AC-3**: Full worklist propagation with adjacency graph. Used by search-based solving (Sudoku, queens, coloring). Requires precomputed neighbor lists from `finalize()`. Optimal when constraints have local scope and changes propagate sparsely through the graph.
- **Sweep** (`propagate_monotonic`): Fixed-point iteration over all constraints until no changes occur. Used by lattice domains (type inference, FIRST/FOLLOW sets) where domains are monotonic -- values only grow via `join()`, never shrink. No adjacency graph needed, no undo log. Each iteration touches every constraint; convergence is guaranteed by the finite lattice height.
- **Stratified sweep** (`propagate_stratified`): SCC-ordered propagation via Tarjan SCCs. Constraints are topologically sorted by their SCC membership. Acyclic constraints (singleton SCCs with no self-loop) converge in a single pass when processed in order. Only cyclic SCCs need iterative fixed-point within their group. This avoids redundant re-evaluation of constraints that depend on values already stabilized.

`propagate_with(strategy)` allows explicit selection when the auto-detection doesn't fit. Lattice CSPs that call `propagate()` without `finalize()` get sweep; search CSPs that call `finalize()` get AC-3.

## Variable Ordering

Three heuristics, selected via `SolveConfig::ordering`:

- **Chronological**: Pick variables in stack order (last element via `stack.len() - 1`). Baseline -- no intelligence, but zero overhead per selection.
- **FailFirst** (MRV): Pick the unassigned variable with the smallest remaining domain. Intuition: a variable with 2 remaining values will fail faster than one with 8, pruning the search tree earlier. O(n) scan over the variable stack, comparing `domain.size()` values.
- **DomWdeg** (Boussemart et al., 2004): Pick the variable with the smallest `domain_size / weighted_degree` ratio. Weighted degree is the sum of failure weights for all constraints involving the variable -- looked up via the `var_constraint_ids` mapping built at `finalize()`. Constraint weights start at 1.0 and increment on each failure. This biases toward variables that participate in frequently-failing constraints -- the likely culprits of future dead ends. The `max(1e-9)` guard on weighted degree prevents division by zero for variables with no failed constraints.

The choice of ordering heuristic significantly affects performance. For hard Sudoku, DomWdeg with AC-3 pruning is the strongest combination -- the learned weights guide the search away from explored dead-end regions. For smaller problems (4x4 Sudoku, map coloring), FailFirst suffices and avoids the weight-tracking overhead. Chronological ordering is only useful as a baseline for benchmarking -- it should never be the production choice for non-trivial problems.
