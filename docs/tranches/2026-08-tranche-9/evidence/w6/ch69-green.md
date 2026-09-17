# CH-69 — the GREEN, and the battery

**Date:** 2026-08-28 · **Cure:** `csp-solver/src/solver/gac.rs` (+ `gac/matching.rs`,
`gac/scratch.rs`) — commit pending, the chair commits.

## The four born-RED rows, cured

```
     Running tests/gac_kernel_beats.rs (/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/target/debug/deps/gac_kernel_beats-569bfc5dedda76ca)

running 14 tests
test p4a_two_singletons_same_value_unsat ... ok
test p4d_all_different_except_small_scope_twin ... ok
test p4c_live_below_threshold_singleton_only ... ok
test p4b_snapshot_not_fuse_live ... ok
test p7b_free_value_walk_keeps_a_supported_edge ... ok
test p5_n20_lap_proven_optimal ... ok
test p1_warm_cold_pruning_parity_single_call ... ok
test p1_warm_cold_parity_multi_call_universe_shrink ... ok
test p2_cross_universe_scratch_reset ... ok
test p3_generic_finite_domain_string_monomorphizes_and_solves ... ok
test p6_futoshiki_solves_under_pool ... ok
test p6_sudoku_solves_under_pool ... ok
test p7_gac_equals_brute_force_support_on_slack_bearing_scopes ... ok
test p5_bnb_node_counts_frozen ... ok

test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 33.83s

     Running tests/killer.rs (/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/target/debug/deps/killer-329397998c705131)

running 5 tests
test solve_killer_finds_the_dealt_solution ... ok
test killer_consumes_cage_sum_and_prunes_at_the_root ... ok
test dealt_boards_carry_holes_and_a_cage_partition ... ok
test dealt_killer_boards_are_unique_by_construction ... ok
test a_satisfiable_killer_board_never_solves_to_zero ... ok

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.77s

```

## The full battery

```
cargo test --workspace   →  218 passed, 0 failed, 6 ignored
                            (31 test binaries + 4 doctests; 33 result lines)
cargo clippy --workspace --all-targets -- -D warnings   →  clean
cargo fmt --check                                       →  clean
```

The count moved **215 → 218**: `p7`, `p7b`, and
`a_satisfiable_killer_board_never_solves_to_zero`. The Hard tier folds into the
existing `dealt_killer_boards_are_unique_by_construction` (a third difficulty in
its sweep, ~0.25s) rather than a new row, and it lands **non-ignored** — Hard
deals at 62ms per 9×9 in debug, 6ms in release, so the suite carries it without
a leash.

Binaries stay at 31 — both revise-level oracles ride the existing GAC
kernel-beat battery.

## Doc-truth

`node scripts/check-doc-truth.mjs` named three sites for the restamp and each was
restamped to exactly what it derived, then re-run to GREEN:

| file | was | now |
|---|---|---|
| `README.md:90` | 215 passed | 218 passed |
| `docs/benchmarks.md:48` | 215 passed | 218 passed |
| `csp-solver/README.md:216` | 215 passed | 218 passed |

**SUPERSEDED — read `ch69-close.md` §Doc-truth instead (2026-08-28).** This
section was written before the wasm rebuild below, so it records a run the tree
then moved out from under: `lean-wasm-4-sites` went RED the moment the artifact
was re-weighed and the four sites still carried 122,541 B (restamped at the
close), and `relay-origin-pair` is GREEN, not RED. The session wall landed
between this table and the restamp it owed.

`test-count-208-vs-204` is GREEN. Two REDs remain in the run
(`relay-origin-pair`, `directory-count-claims` at `web/frontend/README.md:53`) —
both in `web/frontend/`, both the concurrent lane's estate, neither touched here.

## Wasm

The cure compiles into the lean build, so it was rebuilt and re-weighed:

```
wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features
wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm  →  123,336 B
```

| | bytes |
|---|---|
| pre-cure | 122,541 |
| post-cure | 123,336 |
| delta | +795 |
| CI band | 127,500 |
| headroom | 4,164 |

Inside the band. Nothing published.

**Owed, and not this lane's to do:** `web/frontend/dist/assets/csp_solver_wasm_bg-*.wasm`
is still the pre-cure artifact (122,541 B) — the shipped dist does not yet carry
the cure, so a frontend rebuild is owed before any deploy claims killer soundness
on the live site.

## Cost

No measurable one. The transposed walk is built only when a free value exists, so
every square scope — sudoku, futoshiki, thermo, i.e. the hot path — skips it
entirely and prunes exactly as before. `p5_bnb_node_counts_frozen`, the
re-baseline lock, holds its frozen node counts unchanged, and the GAC battery
runs 33.1s → 33.8s across the cure (noise).
