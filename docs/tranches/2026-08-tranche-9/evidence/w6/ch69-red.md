# CH-69 — the born-RED

**Date:** 2026-08-28 · **Tree:** the three cured files reverted to `c55d66d3` (the
W6 HEAD) with the four new tests in place, so every row below is the landed test
firing against the pre-cure propagator.

Four rows, two of them at revise level and two at solve level. The fourth is the
one that matters most: pre-cure, the dealer hands out a Hard 9×9 Killer board
that its own solver then declares to have **zero** solutions.

| test | file | pre-cure |
|---|---|---|
| `p7_gac_equals_brute_force_support_on_slack_bearing_scopes` | `csp-solver/tests/gac_kernel_beats.rs` | RED — 2,013 of 3,676 satisfiable scopes disagree with brute force |
| `p7b_free_value_walk_keeps_a_supported_edge` | `csp-solver/tests/gac_kernel_beats.rs` | RED — `Changed` where nothing is prunable |
| `a_satisfiable_killer_board_never_solves_to_zero` | `csp-solver/tests/killer.rs` | RED — zero solutions after 53 blanks, seed 1 |
| `dealt_killer_boards_are_unique_by_construction` (Hard arm) | `csp-solver/tests/killer.rs` | RED — `n=3 Hard seed=1 is not unique (0 solutions)` |

The 53-blank figure reproduces the W4 finding
(`../w4/killer-soundness-repro.rs`) exactly, on the current tree.

## The runs

```
warning: the following packages contain code that will be rejected by a future version of Rust: proc-macro-error2 v2.0.1
note: to see what the problems were, use the option `--future-incompat-report`, or run `cargo report future-incompatibilities --id 1`
     Running tests/gac_kernel_beats.rs (/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/target/debug/deps/gac_kernel_beats-569bfc5dedda76ca)

running 14 tests
test p4a_two_singletons_same_value_unsat ... ok
test p4d_all_different_except_small_scope_twin ... ok
test p4b_snapshot_not_fuse_live ... ok
test p4c_live_below_threshold_singleton_only ... ok
test p1_warm_cold_parity_multi_call_universe_shrink ... ok
test p1_warm_cold_pruning_parity_single_call ... ok
test p7b_free_value_walk_keeps_a_supported_edge ... FAILED
test p5_n20_lap_proven_optimal ... ok
test p2_cross_universe_scratch_reset ... ok
test p3_generic_finite_domain_string_monomorphizes_and_solves ... ok
test p6_futoshiki_solves_under_pool ... ok
test p6_sudoku_solves_under_pool ... ok
test p7_gac_equals_brute_force_support_on_slack_bearing_scopes ... FAILED
test p5_bnb_node_counts_frozen ... ok

failures:

---- p7b_free_value_walk_keeps_a_supported_edge stdout ----

thread 'p7b_free_value_walk_keeps_a_supported_edge' (51804687) panicked at csp-solver/tests/gac_kernel_beats.rs:564:5:
assertion `left == right` failed
  left: Changed
 right: Unchanged
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

---- p7_gac_equals_brute_force_support_on_slack_bearing_scopes stdout ----

thread 'p7_gac_equals_brute_force_support_on_slack_bearing_scopes' (51804686) panicked at csp-solver/tests/gac_kernel_beats.rs:546:5:
assertion `left == right` failed: GAC disagreed with the brute-force support in 2013/3676 satisfiable scopes; first: sets=[[5, 6, 7], [1, 2, 4, 6, 7], [5, 7, 8], [2, 3, 5, 7], [1, 2, 3, 5, 6, 8]] support=[[5, 6, 7], [1, 2, 4, 6, 7], [5, 7, 8], [2, 3, 5, 7], [1, 2, 3, 5, 6, 8]] post=[[5, 6, 7], [1, 2, 4, 6], [5, 7, 8], [2, 3], [1, 2, 3, 6, 8]] rev=Changed
  left: 2013
 right: 0


failures:
    p7_gac_equals_brute_force_support_on_slack_bearing_scopes
    p7b_free_value_walk_keeps_a_supported_edge

test result: FAILED. 12 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 32.99s

error: test failed, to rerun pass `--test gac_kernel_beats`
running 5 tests
test solve_killer_finds_the_dealt_solution ... ok
test killer_consumes_cage_sum_and_prunes_at_the_root ... ok
test dealt_boards_carry_holes_and_a_cage_partition ... ok
test a_satisfiable_killer_board_never_solves_to_zero ... FAILED
test dealt_killer_boards_are_unique_by_construction ... FAILED

failures:

---- a_satisfiable_killer_board_never_solves_to_zero stdout ----

thread 'a_satisfiable_killer_board_never_solves_to_zero' (51809093) panicked at csp-solver/tests/killer.rs:158:13:
seed 1: after blanking 53 cells (last 21), a board the seed solution provably completes solved to ZERO solutions (budget_exceeded=false)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

---- dealt_killer_boards_are_unique_by_construction stdout ----

thread 'dealt_killer_boards_are_unique_by_construction' (51809095) panicked at csp-solver/tests/killer.rs:56:17:
assertion `left == right` failed: killer n=3 Hard seed=1 is not unique (0 solutions)
  left: 0
 right: 1


failures:
    a_satisfiable_killer_board_never_solves_to_zero
    dealt_killer_boards_are_unique_by_construction

test result: FAILED. 3 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.22s

error: test failed, to rerun pass `--test killer`
```
