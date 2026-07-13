# LANE p2-solver-backend — THE COMPUTE BACKEND (Rust csp-solver)

Pre-execution perf-audit, Tranche IV. There is no server; the backend IS `csp-solver`.
All numbers first-party on this machine (Mac17,7, 18 cores, macOS 25.4), native `--release`
`opt-level=3`. Node counts + allocation counts are **deterministic (host-independent)**;
wall times are load-stamped (box was under load avg 8–14 throughout — disclosed per row).
No source edited: every probe lives in `scratchpad/tranche4/perf/probe/` (a standalone
cargo crate `path`-linked to csp-solver — zero repo-tree mutation; `git status` clean but
for the pre-existing `D CONTRIBUTING.md`). `:3001` untouched (backend has no server).

Rerunnable: `cd scratchpad/tranche4/perf/probe && cargo build --release` then
`./target/release/{gen_timing,alloc_census,hot_loop}`. The `sample` profiles are banked
at `scratchpad/tranche4/perf/sample-{solve16,gen9m}.txt`.

---

## (a) BENCH TRUTH AT HEAD — the headlines HOLD

**Node-count spine: `40513 → 4678` HOLD** — `cargo run --release --example gac_ab_corpus`
(50-board corpus, production Ac3+Mrv, GAC off→on): `node-count spine (GAC off→on): 40513
→ 4678 (expected 40513 → 4678) — HOLD … VERDICT: PASS`. Deterministic; load-immune.

**GAC aggregate: 13.84× today** — `cargo run --release --example gac_timing_probe`
(best-of-5 interleaved on/off, min-per-state; corpus Σoff/Σon): **13.84×** wall, node
ratio 8.66× (40513→4678). Per-bucket: N4/medium 28.02×, N4/hard 27.90×, N3/hard 3.42×,
hard-9x9-named 1.04×, N4/easy 1.01×. The task's stated "12.5–12.7×" is BELOW today's
measurement; my 13.84× matches the in-tree reference (`gac_ab.rs` "13.79× corpus headline",
`gac_timing_probe.rs` "13.36×-class"). **The headline holds — if anything it under-states.**
Minority-cost disclosed and intact: Al Escargot 2.15× slower ON, Inkala 2.86× slower ON,
Golden Nugget 1.59× slower ON (their on-node counts are already tiny — GAC's graph rebuild
has nothing to amortise). Criterion suite (`gac_ab`, `sudoku`, `futoshiki`) smoke-ran green
under `--test`. Full criterion wall runs deferred: on a load-8–14 box criterion's own wall
µs is noise-dominated; the deterministic node oracle + the best-of-min ratio ARE the
load-robust truth and both hold.

## (b) GENERATION COST — the exact browser deal path (10 deals/cell, native release)

`generate_board_with_templates_seeded(n, diff, embedded_templates(n,diff), seed)` — the
identical wasm-worker call fed the identical embed. Empty template list ⇒ SLOW hole-dig;
non-empty ⇒ FAST template+symmetry-transform.

| N | size | diff | path | gen ms min/mean/max | givens |
|---|---|---|---|---|---|
| 2 | 4×4 | easy/med/hard | SLOW | 0.03 / 0.06 / 0.10 | 12/7/4 |
| 3 | 9×9 | easy | SLOW | **1.52 / 1.66 / 1.83** | 61 |
| 3 | 9×9 | medium | SLOW | **3.12 / 3.47 / 3.92** | 35 |
| 3 | 9×9 | hard | FAST | 0.001 / 0.001 / 0.002 | 23 |
| 4 | 16×16 | easy | FAST | 0.001 / 0.001 / 0.002 | 192 |
| 4 | 16×16 | medium | FAST | 0.002 / 0.002 / 0.003 | 114 |
| 4 | 16×16 | hard | FAST | 0.001 / 0.002 / 0.003 | 102 |

Futoshiki (no difficulty tier — GEN-2): 4×4 0.05ms, 5×5 0.13ms, 6×6 0.29ms, 7×7 0.55ms.

**16×16 is NOT a user-visible stall — it is CORPUS-served (fast template+transform, ~2µs
native).** All three 16×16 tiers ship an embedded bank (N=4 easy 10 / medium 10 / hard 5),
so the wasm worker never hole-digs them. The genuine live hole-dig path is **9×9 easy/medium
+ all 4×4** (templates.ts ships `{"3":{easy:[],medium:[],hard:[20]}}`). The heaviest live
cell is **9×9 Medium at ~3.5ms native** (35 givens, ~46 uniqueness-checked hole solves).
This is the r2-generation-truth GEN-3 "on-deal cost paid on the main product path." Native
it is trivial; the wasm worker wall-clock is the number that matters and that is **p1's
lane** to measure (native 3.5ms ⇒ likely tens of ms in wasm — a probe, not a stall on the
evidence here). Uniqueness IS included: enforced by construction inside the dig
(`max_solutions:2` per hole, `generate.rs:307`); a standalone re-solve costs 0.06–1.6ms.

## (c) HOT-PATH PROFILE (macOS `sample`, 6s @1ms, no sudo)

**(i) 16×16 Hard solve — top-5 self-time** (`sample-solve16.txt`, 6314 solves in the window):
1. `AllDifferent::revise_impl` + inlined `constraint::scratch::with_singleton_buf` — 671+52
2. `solver::gac::propagate_inner` — 400
3. `csp::solve::solve_with_given` — 183
4. `solver::gac::matching::tarjan_scc` — 177
5. `solver::gac::matching::hopcroft_karp` — 101 (+ `dfs_augment` 30)
Then: `BitsetIter::next` 61, `ordering::select_variable` 41, slice small_sort 37, malloc/free ~50.

**(ii) 9×9 Medium generation (slow-dig) — top-5 self-time** (`sample-gen9m.txt`, 1323 deals):
1. `AllDifferent::revise_impl`/`with_singleton_buf` — 455
2. `gac::propagate_inner` — 302
3. `gac::matching::tarjan_scc` — 127
4. **malloc/free/realloc mass — `xzm_malloc_tiny` 127 + `xzm_free` 110 + `xzm_realloc` 67 +
   `malloc_zone_size` 43 + `malloc_zone_realloc` 28 + `free`/`realloc` 52 ≈ 500 samples**
5. `search::Kernel::is_valid` 53, `ac3_from_variable` 40, `Csp::finalize` 25
The distinguishing feature of the generation profile is the **~500-sample malloc mass** absent
from the solve profile — it is the **CSP rebuilt from scratch for every hole candidate**
(`create_sudoku_csp` → `Csp::finalize` inside the dig loop, `generate.rs:306`).

**Allocation census (deterministic — `alloc_census`, CSP construction excluded from the solve tally):**

| case | nodes | props | allocs | bytes | allocs/node | allocs/prop |
|---|---|---|---|---|---|---|
| 16×16 Hard solve | 151 | 146 | 590 | 44,588 | 3.91 | 4.04 |
| 16×16 Medium solve | 146 | 182 | 520 | 41,136 | 3.56 | 2.86 |
| 9×9 Al Escargot | 72 | 293 | 265 | 23,476 | 3.68 | 0.90 |
| 9×9 Easy dealt solve | 20 | 5 | 116 | 8,036 | 5.80 | — |

Generation deal call (whole, incl. all internal solves): **9×9 Medium slow-dig = 38,147
allocs / 3.77 MB per deal**; 9×9 Hard FAST = **14 allocs**; 16×16 Hard FAST = **16 allocs**.

**What allocation remains per solve / per propagate:** per-**propagate** ≈ **0 heap allocs**
— the GAC core (`propagate_gac_core`) runs entirely off a thread-local pooled `GacScratch`
(cleared-not-freed; flat CSR adjacency, warm-start matching cache, all buffers reused). The
residual solve allocation is per-**NODE**: the `values: Vec<_> = domain.iter().collect()`
snapshot at `search.rs:242` (~1 alloc/node) plus amortised first-touch growth of the
per-constraint matching-cache vecs. That is why allocs/node (~3.5–3.9) barely moves with
board hardness. **The dominant allocation is in GENERATION, not solve** — the per-hole CSP
rebuild (38k allocs/deal vs 590/solve).

## (d) OPTIMIZATION CANDIDATES — each semantics/output-identical by construction

See the disposition table. Two NEW-ROW quality-free wins (both feed the compute estate, the
larger one feeds **W6-generation-truth**); the GAC core, the thread-local scratch, and the
release profile are already at the optimum (CLEAN); PGO and dig-short-circuits are rejected.

---

## DISPOSITION TABLE

| id | title | disposition | gain | quality risk | evidence |
|---|---|---|---|---|---|
| P2-SPINE | Node spine 40513→4678 + GAC 13.84× hold | CLEAN | headline holds (13.84× ≥ 12.5–12.7 target; spine exact) | none | gac_ab_corpus HOLD; gac_timing_probe 13.84× |
| P2-GEN16 | 16×16 is corpus fast-path, not a stall | CLEAN | refutes the 16×16-stall hypothesis | none | gen_timing: 16×16 all tiers FAST ~2µs |
| P2-GENREUSE | Reuse CSP skeleton across hole candidates (re-seed givens, not rebuild) | NEW-ROW (→W6) | large: elides ~46 full `Csp::finalize`/deal; malloc ~40% of gen9m self-time; 38k→~solve-order allocs | none — identical dig sequence & dealt board | sample-gen9m malloc≈500; alloc 38,147/deal; generate.rs:306 |
| P2-VALUES | `values` per-node Vec collect → SmallVec (domain≤16) | NEW-ROW | small: −~1 alloc/node; solves already sub-ms so <~5% wall | none — same values, same order (Feasibility order is a no-op) | search.rs:242; alloc ~3.9/node |
| P2-MRV | Precompute frozen wdeg (weights==1.0 ⇒ wdeg==constraint count) in select_variable | NEW-ROW (low) | marginal (~41 self-samples); removes per-node inner sum | none NOW; latent hazard if dom/wdeg bumping is ever wired | ordering.rs:56-59; sample-solve16 select_variable=41 |
| P2-GACCORE | GAC Régin core (hopcroft_karp/tarjan_scc/propagate_inner) | CLEAN | already optimal — pooled GacScratch, flat CSR, warm-start cache, O(1) fast_index (T3) | n/a | gac/mod.rs; per-propagate ≈0 heap alloc |
| P2-TLSCRATCH | with_singleton_buf thread-local → kernel-owned | CLEAN | uncertain single-digit; touches constraint revise() API; already the sanctioned T3/L26 alloc fix | n/a | scratch.rs; frame self-time is mostly inlined revise body |
| P2-RELPROFILE | Native release LTO/codegen-units/strip | CLEAN (profile edits are W5-homed) | none — T15 refutation stands (LTO/cgu net ≈0%, regress native; strip breaks wasm-opt target_features) | none | Cargo.toml:55-89 documents the refutation |
| P2-PGO | PGO on the solver | CLEAN (rejected on cost, not quality) | none for the user: wasm is the product path (wasm-pack has no PGO flow); native already sub-ms | none | build-complexity vs sub-ms native solves |
| P2-GENSHORT | Generation dig short-circuit / early-unique / reorder | REJECTED-quality | would change which cells are dug ⇒ a different, generally easier puzzle | REJECTS: alters the dealt board | generate.rs:280-314 — dig order+count define the puzzle |
