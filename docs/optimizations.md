# Optimizations

## ConstraintEnum Devirtualization

`Box<dyn Constraint<D>>` imposes a vtable indirection on every `revise()` call. AC-3 invokes `revise()` thousands of times per solve -- for a hard 9x9 Sudoku, tens of thousands. The indirect call defeats branch prediction and prevents inlining.

`ConstraintEnum<D>` replaces the trait object with an enum: `NotEqual`, `AllDifferent`, `AllDifferentExcept`, `Soft`, `Custom`. The first two are the overwhelmingly common cases. `scope()`, `check()`, and `revise()` are all `#[inline]` match arms on the enum -- the compiler emits a direct branch to the concrete implementation. `Custom` retains a `Box<dyn Constraint<D>>` for extensibility but rarely appears on the hot path. (The former `Lambda` variant was excised -- it had zero construction sites.)

Under profiling, constraint revision dominates self-time -- the _productive_ work of domain pruning rather than dispatch overhead. The dispatch cost the enum removes is the vtable indirection, not the revision work itself.

## Arena Adjacency

The adjacency graph maps three relationships: variable -> constraints, constraint -> neighbor constraints, variable -> neighbor variables. The naive approach allocates a `Vec<Vec<u32>>` for each -- three separate heap-allocated vectors per entry, scattered across memory. Each inner Vec is its own allocation, so iterating over a variable's constraints causes pointer chasing across the heap.

The arena approach packs all three mappings into a single `Vec<u32>` pool. Each variable or constraint holds an `(offset: u32, len: u32)` pair indexing into the pool. `Adjacency::build()` computes all three mappings into temporary `Vec<Vec<u32>>`, measures total length with a capacity pre-calculation, allocates the pool once, and copies each list contiguously. Constraint-neighbor lists are sorted and deduplicated before arena packing. Lookups via `constraints_for()`, `neighbors_of_constraint()`, and `neighbors_of_var()` return `&[u32]` slices into the pool -- sequential memory, cache-line friendly, zero indirection.

For a 9x9 Sudoku (81 variables, 27 AllDifferent constraints), the pool holds ~2000 u32s in a single allocation instead of 81 + 27 + 81 = 189 separate Vecs. The reduction in allocator pressure and cache misses is measurable under profiling.

## BitsetDomain (u128)

Domain values 0..127 are represented as bits in a `u128`. All core operations compile to single instructions:

| Operation | Implementation | Cost |
|-----------|---------------|------|
| `size()` | `popcount` | O(1) |
| `contains(v)` | `bits & (1 << v) != 0` | O(1) |
| `remove(v)` | `bits &= !(1 << v)` | O(1) |
| `add(v)` | `bits |= 1 << v` | O(1) |
| `singleton_value()` | `popcount == 1` then `trailing_zeros` | O(1) |
| `is_empty()` | `bits == 0` | O(1) |

`BitsetIter` copies the `u128` into an owned field and yields values via `trailing_zeros` + `self &= self - 1` (clear lowest set bit). The iterator owns its data -- no borrow on the domain. This means you can mutate the domain while iterating over a snapshot, which is exactly what forward checking needs: iterate domain values, test each, prune failures.

Set operations (`union_with`, `intersect_with`, `difference_with`) are single bitwise instructions. Useful for bulk pruning -- remove all assigned values from a domain in one operation.

## AC-3 Bitset Worklist

The textbook AC-3 uses a `VecDeque<usize>` plus a `Vec<bool>` for membership tracking (avoid duplicate enqueue). That's two data structures and O(n) memory for the membership array.

The bitset worklist replaces both with a single `Vec<u64>`. Each constraint index maps to a bit. Insert sets the bit -- inherently idempotent, so duplicates are impossible. Pop scans words for the first nonzero via a tight loop, extracts the index via `trailing_zeros`, and clears with `word &= word - 1`.

For 27 constraints (Sudoku), this is a single u64 word. Insert, pop, and membership are all sub-nanosecond.

## No-Copy Forward Checking

The original forward checking implementation allocated `assignment.to_vec()` per value test to avoid mutating the shared assignment array. For a variable with domain size D and N neighbors, that's O(D * N * total_vars) copies per search node -- thousands of unnecessary copies per second of search.

The fix: assign-check-unassign directly in the mutable assignment slice. `assignment[neighbor] = Some(val)` before the check, `assignment[neighbor] = None` after. The constraints see a complete assignment for their scope and can evaluate `check()` directly. Zero allocation per test.

A reusable `Vec<D::Value>` buffer (`val_buf`) collects each neighbor's domain values at the start of its iteration. The buffer is `.clear()`'d and `.extend()`'d for each neighbor -- after the first neighbor, the Vec's backing allocation is reused, so subsequent neighbors incur no heap allocation. This is important because forward checking iterates over every unassigned neighbor of the assigned variable, and each neighbor's domain may have up to M values.

## Domain Restriction via Prune-at-Depth

`Variable<D>` maintains an undo log: `Vec<(depth, value)>` of pruned entries. When backtracking assigns a variable, `restrict_to(val, depth)` removes all non-matching values from the domain, recording each removal at the current search depth. This synchronizes the domain with the assignment so AC-3's `revise()` sees a proper singleton.

`restore(depth)` pops entries from the tail while they match the given depth, re-adding each value to the domain. The undo log is LIFO-ordered by construction (deeper depths are pushed later), so restoration is a simple tail-pop loop.

## FxHash (bbnf-lang compile path)

Profiling the bbnf-lang compile pipeline with samply showed SipHash operations dominating -- `HashMap<String, u32>` lookups in the literal prefix factoring pass. SipHash is cryptographically robust but overkill for compiler-internal hash maps, where the keys are program text and DoS resistance doesn't matter.

Replacing them with `FxHashMap` from `rustc-hash` (a multiply-and-rotate scheme, faster than SipHash for small keys) cut the compile time materially. Applied to `prefix.rs` (literal trie construction), `lr.rs` (LR table building), and `string_interner.rs` (string deduplication). The concrete before/after timings are a bbnf-lang property, measured and tracked in that repository, not reproducible here.

## Profiling Methodology

Performance breakdowns come from samply + Firefox Profiler. Build with `CARGO_PROFILE_RELEASE_DEBUG=true` for symbol resolution, record with `samply record --no-open ./target/release/examples/profile_sudoku`, and open the generated URL for the interactive flame graph and inverted call tree.

The profiling targets (`examples/profile_sudoku.rs`, `examples/profile_csp.rs`) run hard 9×9 puzzles plus 8-Queens and map coloring. The inverted call tree consistently shows the solver's self-time concentrated in the productive layer -- constraint revision and domain iteration -- rather than the dispatch or data-structure scaffolding. Self-time percentages depend on host and workload; run the target to obtain current figures rather than quoting a stale snapshot. Further speedups would require algorithmic changes (stronger propagation to reduce search nodes) rather than micro-optimization.

## Domain Restriction

`Variable::restrict_to(val, depth)` is the fast path for backtracking assignment. Instead of building a new singleton domain, it snapshots the current domain values via `iter().collect()`, then removes every value that doesn't match `val`, recording each removal in the undo log at the given depth. For `BitsetDomain`, the iteration is a `trailing_zeros` scan on a copied u128 -- cheap even for full 9-element domains.

`restore(depth)` undoes these removals by popping from the undo log's tail. The log is LIFO-ordered by construction (deeper depths push later), so restoration is a tight loop: pop while the entry's depth matches, re-add each value to the domain. No sorting, no searching, no reallocation.
