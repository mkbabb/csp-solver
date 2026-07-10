# T3-W6 — Engine perf

**The one evidenced engine-perf move: cut the GAC per-call constant with flat CSR adjacency + a Vec-indexed warm cache, and gate the win in CI so no future GAC edit silently regresses it.** These are the D20-set items the mandate actually captured (A18 ROW-1) — the two levers with a mechanism, a first-party reproducible harness (`gac_timing_probe`), and a disclosed cost they directly attack (the named-hard 9×9 minority slowdown). They reduce the constant, not node counts (GAC pruning strength is invariant), so they are **pure downside-removal** — they can only narrow the minority cost, never widen it. The value→index fast path is **already landed** and must not be re-proposed. A18 ROW-2 (a new static GAC on/off gate) is **REJECTED on fresh per-bucket evidence** — recorded below. The whole wave runs under quiet-box + node-count-oracle discipline, because G6 proved the headline ratio swings 10.5–13.8× on the identical binary by machine load alone.

**Dependencies**: ← W4 (the 0.4.0 core structure — `gac/scratch.rs` split + the adjacency relocation land first; CSR touches `gac/mod.rs`). ∥ the FE chain. **Effort**: M.

---

## Scope

### ROW 1 — CSR adjacency + Vec-indexed warm cache (A18 ROW-1, the D20 lever)

D20 origin: tranche-2 `C-deferred-foldin.md:98,104` ("CSR adjacency · Vec-indexed warm cache · mimalloc · GAC on/off policy"); design intent `grand-uplift/synthesis-pass1.md:163` ("flat CSR/arena scratch reused per call … HashMap/bitset value-index instead of O(n_vals) linear scans").

**Already landed — do NOT re-propose:** the value→index fast path IS implemented — `fast_index<V:'static>` via an `Any` downcast (no trait bound, so `FiniteDomain<String>` still compiles) plus the generation-stamped `val_index`/`val_index_gen` reverse map (`gac/mod.rs:101-138,229-236,288-316`). §163's value-index wish is DONE.

**Still open (verified at HEAD):**
- **CSR adjacency — NOT landed.** `adj: Vec<Vec<u32>>` + `res_adj: Vec<Vec<u32>>` (`gac/mod.rs:88,91`); `reset_adj` (`gac/matching.rs:11-19`) pools inner-Vec capacity but stays a vector-of-vectors — N separate heap allocations, a pointer-chase per neighbor, cache-hostile. Replace with a **flat CSR** (one `Vec<u32>` edges + one `Vec<u32>` offsets), the classic replacement.
- **Vec-indexed warm cache — NOT landed.** `cache: HashMap<u32, Vec<Option<V>>>` (`gac/mod.rs:99`), read at `gac/mod.rs:339-340` (`s.cache.get(&id)`), keyed by `gac_id`. But `gac_id` is a **dense monotonic** counter (`next_gac_id = AtomicU32::fetch_add`, `gac/mod.rs:54-56`), so the key space is `0..N` — a `Vec<Option<…>>` indexed by `gac_id` is strictly cheaper than a SipHash lookup on the hot path. `CACHE_CAP=8192` (`gac/mod.rs:71`) already bounds it.

**Why this is the move:** the named-hard 9×9 slowdown (3/5 boards, 1.68–3.12× slower ON — G6/A18 runs) is explicitly "GAC's per-propagation constant" (`benchmarks.md:24`), measured in isolation at ≈1.8× on `sudoku_9x9/al_escargot/ac3_failfirst` (≈370→677 µs, `benchmarks.md:30`). Both levers reduce exactly that constant; node counts are invariant. Evidence **STRONG**.

### ROW 7 — the residual `assigned_ns` scan (A18 ROW-7)

`s.assigned_ns.contains(&val)` (`gac/mod.rs:289`) — O(|assigned|) per (var,val) inside the adjacency-build loop, the one linear scan the landed value-index does **not** cover. `assigned_ns` ≤ n_participants (small, bounded), but it is on the same hot path ROW-1 targets, so a stamped-membership bitset (mirroring `val_index`) folds into the CSR-adjacency rebuild **for free**. Evidence WEAK (mechanism only, no measured cost) — rides ROW-1, not independently justified.

### ROW 3 — criterion coverage + CI perf-regression guards

The 13.79× headline and the minority cost live only in `examples/gac_timing_probe.rs` (run by hand — CI never invokes it); `benches/sudoku.rs` benches only Ac3×{FailFirst,Mrv} with GAC always default-ON. Close the blind spots:
- **(a) GAC on/off A/B in criterion** — so a per-call cost regression (or a ROW-1 win) is CI-visible.
- **(b) a futoshiki bench** — a shipped game (N=4–7) has zero criterion perf guard at any size today.
- **(c) the GAC-winning bucket** — N4 medium/hard (27–28× wins) are absent; criterion covers only 5 named-hard 9×9 + one 16×16 (`sudoku.rs:178,234`).
- **(d) a node-count CI smoke lane** — the deterministic node figures (40,513→4,678) are soundness-load-bearing (`benchmarks.md:122`) but only queens has a CI ground-truth smoke lane. Promote `gac_ab_corpus`'s **0/50 false-UNSAT + a node-count assert** into a CI lane, guarding GAC soundness AND cost.
- **`gac_alldiff` differential oracle** (L25-20) and the **G13 futoshiki correctness probe** land alongside.

### ROW 6 — lean-band erosion stamp

Lean headroom is eroding: 5,147 B (W3 @ 87,853 B) → **2,398 B** (HEAD @ 90,602 B, `wc -c csp_solver_wasm_bg.wasm`). ROW-1 touches `gac/mod.rs`, which the lean wasm compiles, so **re-measure the lean artifact** after the change and stamp it against the `fail>93,000` gate. ROW-1 should be lean-neutral (GAC runs in both builds; the change is allocation-shape, not surface) — verify, don't assume. No lean-size lever remains except code-trim; track the erosion.

### Measurement discipline (R-12 / G6)

- **Assert on node counts, never the wall ratio.** G6 reproduced the corpus headline at **10.51×** under load-avg ~3.8 vs A18's 13.79× vs `benchmarks.md`'s 12.6–12.7× — a ~10.5–13.8× swing on the **same binary** by machine load alone. Node counts are the invariant oracle: 40,513→4,678, deterministic, identical across every run. The before/after runs on a **quiet box** and asserts the minority cost narrows on the 3 named-hard boards + the corpus node counts hold.
- **`--baseline pre-t3` is banked** (G6): `cargo bench -p csp-solver --bench {sudoku,queens,map_coloring,lattice,cost_finite_domain} -- --save-baseline pre-t3`, exit 0 at base `3b75eca2`, under `target/criterion/*/pre-t3/`. **Select named `[[bench]]` targets** — `cargo bench --workspace -- --save-baseline …` **fails** (the flag is forwarded to the lib libtest harness, which rejects it — G6 `criterion.log`).
- `assignment` + `iai_queens` are excluded from `pre-t3` (assignment hit the 745 s `square_roled/csp/50x50` pathology under load — owned by W5; iai needs valgrind, unavailable on macOS/arm).

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W6):

| Gate | Value |
|---|---|
| Headline | `gac_timing_probe` before/after on a quiet box: minority cost narrows, node counts invariant; new CI lanes green |

Component checks:

| Gate | Value |
|---|---|
| perf | `gac_timing_probe` before/after **quiet** — minority cost narrows on the 3 named-hard boards; corpus node counts invariant (40,513→4,678); no wall-ratio assert (load-sensitive) |
| baseline | before/after measured against `--baseline pre-t3` on **named** bench targets (never `--workspace` — flag rejected, G6) |
| CI smoke | `gac_ab_corpus` 0/50 false-UNSAT + node-count assert promoted to a CI lane; `gac_alldiff` differential oracle + futoshiki bench + G13 probe green |
| lean band | lean wasm re-measured, under `fail>93,000` (was 90,602 B); ROW-1 confirmed lean-neutral |
| correctness | `cargo test --workspace` unchanged — CSR/cache is a perf refactor; node counts + solutions invariant by construction |

## Seeds

- [`audit32/A18-performance-rust-wasm.md`](../evidence/audit32/A18-performance-rust-wasm.md) — ROW-1/2/3/6/7, the D20-set re-examination, the value-index-already-landed note, the CSR/cache/`assigned_ns` file:line anchors, the fresh per-bucket data.
- [`pass3/G6-baseline-run.md`](../evidence/pass3/G6-baseline-run.md) — the `pre-t3` bank, the load-sensitivity (10.51× vs 13.79×), the `--workspace --save-baseline` failure, the node-count oracle, the `assignment` 745 s exclusion, the 90,602 B lean stamp.
- reconciliation §1.3 (perf rows), R-12 (measurement discipline), R-7 (perf-row minting context).

## Residual risks

- **A18 ROW-2 REJECTED on fresh per-bucket evidence** — no static GAC on/off gate beats blanket-ON: GAC loses only where absolute node counts are already tiny (named-hard on-nodes 72/83/369/114/64), and you don't know the node count before searching, so the loss signal is **not prospectively exploitable** by a static gate; the wins are enormous and node-driven (N4/medium 27.13×, N4/hard 28.54×). The evidenced "policy refinement" IS ROW-1 (cut the constant). Default-ON stands; losses are sub-ms and off the served path (web ships N=2,3,4 + N=5-easy; the named-hard 9×9 are adversarial). A dynamic per-constraint auto-disable is prototype-gated → KISS ledger. **Do not re-litigate.**
- **The headline ratio does not exist until measured quiet** — a ~10.5–13.8× swing on the identical binary by load alone (G6). Assert on node counts (invariant) + narrowed minority cost, never the wall ratio; a green-looking before/after under load is meaningless.
- **`--save-baseline` over `--workspace` fails** (G6) — the `pre-t3` bank and the W6 before/after must select named `[[bench]]` targets, or the invocation reddens on the forwarded flag.
- **ROW-1 is pure constant-reduction** — node counts + solutions are invariant by construction (GAC pruning strength unchanged). If any node count moves, the CSR/cache refactor changed semantics; that is the failure mode the node-count oracle catches.
- **ROW-7 is WEAK-evidence** (mechanism only, bounded n) — it rides ROW-1's rebuild for free but is not independently justified; if the `assigned_ns` bitset complicates the CSR change, drop it.
- **Lean-band erosion** — CSR/cache is native-hot code but shares `gac/mod.rs` with the wasm build; 2,398 B of headroom means a careless addition can bust `fail>93,000`. Re-measure the lean artifact, don't assume neutrality.
