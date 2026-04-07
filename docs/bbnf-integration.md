# BBNF Integration

## Overview

The bbnf-lang grammar compiler uses csp-solver for six IR analysis passes. All six share a common pattern: lattice domains where values only grow via `join()`, never shrink. No backtracking, no search. The CSPs construct variables and constraints, then call `propagate()` without calling `finalize()`. The auto-selection logic detects the absence of an adjacency graph and routes to `propagate_monotonic` -- a fixed-point sweep over all constraints until convergence.

This is a fundamentally different usage pattern from Sudoku or N-Queens. There's no search tree, no variable ordering heuristic, no undo log. The solver acts as a dataflow fixpoint engine -- closer to a worklist algorithm in a compiler than a combinatorial search. The domain types are defined in bbnf-lang, not in csp-solver. They implement the `Domain` trait (and sometimes `LatticeDomain`) with monotonic semantics.

## Type Inference (TypeDomain)

Each IR node gets one or two type variables. The domain is `Option<TypeDesc>` where `None` is bottom (unknown) and `Some(ty)` is the inferred type. Constraints propagate types through expression structure:

- Sequences project their children's types into a tuple or struct.
- Alternations compute the join (union type) of their branches.
- Repetitions wrap their body type in a Vec.
- Optionals wrap in Option.
- Map expressions take the return type of the mapping function.

For CSS L4 (265 rules across 15 files), this generates ~2000 variables and ~5000 constraints. Convergence in 2-3 sweep iterations. The lattice has finite height -- type descriptors can only grow from `None` to a concrete type, and joins between concrete types produce a fixed result.

## FIRST Sets (CharSetDomain)

Each rule gets a variable whose domain is a `CharSet128` -- a 128-bit ASCII bitset representing the set of characters that can begin a string derived from that rule. Ground constraints seed literals and regexes with their first characters. Union constraints propagate through grammar structure:

- Alternations: FIRST(A | B) = FIRST(A) | FIRST(B).
- Sequences: FIRST(A B) = FIRST(A), unless A is nullable, in which case FIRST(A B) = FIRST(A) | FIRST(B).
- Repetitions: FIRST(A*) = FIRST(A) (plus the empty case, handled by nullable analysis).

Mutually recursive rules require multiple sweep iterations. The lattice is the powerset of ASCII characters ordered by subset inclusion -- finite height of 128, so convergence is guaranteed. In practice, 2-4 iterations suffice for any grammar.

## FOLLOW Sets

Same domain type as FIRST. FOLLOW(A) is the set of characters that can appear immediately after A in any sentential form. Constraints are generated from:

- Rule bodies: if rule R has body `... A B ...`, then FIRST(B) is in FOLLOW(A). If B is nullable, FOLLOW(B) is also in FOLLOW(A).
- Repeat/Seq: special handling for nullable propagation through sequences.
- Rule boundaries: FOLLOW of the start symbol includes EOF.

Used by dispatch tables for nullable branch optimization -- when an alternation has a nullable branch, the FOLLOW set determines which characters trigger it vs. which trigger the non-nullable branches.

## Span Eligibility (BoolDomain)

Top-down refinement. Domain is `Option<bool>` where `None` means undecided, `Some(true)` means span-eligible, `Some(false)` means not. A rule is span-eligible if its body contains only literals, regexes, and references to other span-eligible rules -- no type-constructing operations (Vec, struct, enum).

Span-eligible rules get zero-allocation `SpanParser` codegen: the parser returns a `Span` (byte range) instead of constructing AST nodes. This is the critical optimization for lexical-level rules like identifiers, numbers, and string literals.

## Dispatch Tables (DispatchDomain)

Tri-state: Unknown, Dispatchable, NonDispatchable. An alternation is dispatchable if all branches have:
1. Disjoint FIRST sets (no two branches can start with the same character).
2. Non-empty FIRST sets (every branch consumes at least one character).
3. No nullable branches (or nullable branches are resolvable via FOLLOW sets).

Constraints check these conditions by inspecting the FIRST sets computed in the earlier pass -- the dispatch analysis depends on FIRST set results. This is why the passes run in a defined order despite all using independent CSP instances.

Dispatchable alternations get O(1) byte-dispatch codegen: a 128-entry lookup table indexed by the next input byte, each entry pointing to the correct branch. Non-dispatchable alternations fall back to sequential trial-and-error. The dispatch optimization is the single biggest codegen win for grammars with wide alternations -- CSS property value parsing, for instance, where dozens of literal keywords share a rule.

## Regex Algebra (RewriteDomain)

Tri-state: Pending, CanRewrite, CannotRewrite. Classifies alternation branches for algebraic simplification:

- **Superset absorption**: if regex A matches a superset of regex B, the alternation `A | B` simplifies to just A.
- **Union merge**: two regexes with compatible structure can be fused into a single regex covering both patterns.
- **Repetition absorption**: `A | A+` simplifies to `A+`, and `A* | A+` simplifies to `A*`.
- **Redundant elimination**: identical branches are deduplicated.

These rewrites run after `merge_literals` and before `factor_common_prefixes` in the IR pipeline. They reduce the number of alternation branches the dispatch table and codegen need to handle.

## Pass Ordering

The six passes run in a defined sequence within the bbnf-lang IR pipeline. Dependencies flow forward:

1. **Type inference** -- no dependencies on other CSP passes, but must run after IR lowering.
2. **FIRST sets** -- seeded from literals and regexes in the IR.
3. **FOLLOW sets** -- depends on FIRST sets for nullable propagation.
4. **Span eligibility** -- depends on type inference (rules with typed construction aren't span-eligible).
5. **Dispatch tables** -- depends on FIRST sets for disjointness checking.
6. **Regex algebra** -- depends on FIRST sets for overlap detection.

Each pass constructs its own `Csp` instance from scratch. There's no shared state between passes -- just the IR that each pass reads from and annotates.

## Performance

For CSS L4 (265 rules, 15 files, deep `@import` chain), all six CSP passes combined account for less than 0.1% of the 113ms total compile time. The type inference pass is the largest, with ~2000 variables and ~5000 constraints, but converges in 2-3 sweep iterations. The FIRST/FOLLOW passes are smaller -- one variable per rule, ~265 variables each.

The bottleneck is literal prefix factoring (trie construction over thousands of string literals) and regex-with-lookahead factoring, not constraint propagation. The sweep strategy's simplicity -- just iterate all constraints until quiescent -- is well-matched to the small, dense constraint graphs these passes produce. Building an adjacency graph and maintaining a worklist would add overhead for no benefit when the constraint count is in the hundreds, not the thousands.
