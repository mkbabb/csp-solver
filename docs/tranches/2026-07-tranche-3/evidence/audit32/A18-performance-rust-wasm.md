# A18 — PERFORMANCE (Rust/wasm) deep audit

Lane A18, TRANCHE-III 32-agent audit. Repo `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`, HEAD (working tree, master). Read-only. Every claim cites file:line, a doc stamp, or a first-party command I ran.

**First-party measurement I ran this session** (HEAD, Apple M5 Max, 2026-07-10):
`cargo run --release --example gac_timing_probe` — output captured at `scratchpad/gac_probe.out`. It reproduces the committed probe's shape and supersedes stale prose where cited.

```
## Per-bucket aggregate (Σoff / Σon)
| bucket            | boards | wall ratio (off/on) | nodes off→on |
| hard-9x9 (named)  | 5      | 0.97×               | 3367 → 702   |
| N3/hard           | 20     | 3.02×               | 4483 → 1154  |
| N4/easy           | 10     | 1.00×               | 640  → 640   |
| N4/medium         | 10     | 27.13×              | 24768 → 1428 |
| N4/hard           | 5      | 28.54×              | 7255 → 754   |
## Corpus aggregate: 13.79×  |  nodes 40513 → 4678 (8.66× fewer)
## Named hard 9×9 (individual):
  Al Escargot     0.46×  ON SLOWER (2.19×)   105  → 72
  Platinum Blonde 1.74×  ON faster           489  → 83
  Golden Nugget   0.59×  ON SLOWER (1.68×)    1258 → 369
  Inkala 2010     0.32×  ON SLOWER (3.12×)    134  → 114
  17-clue minimal 15.00× ON faster            1381 → 64
```
This matches the doc stamp (`docs/benchmarks.md:14,24`, measured at ede25188: 12.58/12.73× corpus; named-hard 0.40–0.42 / 0.56 / 0.30–0.33×) within the host-noise regime — the probe is stable and load-bearing.

---

## The D20 set, re-examined under the new mandate

D20 origin: `docs/tranches/2026-07-tranche-2/appendices/C-deferred-foldin.md:98,104` — "CSR adjacency · Vec-indexed warm cache · mimalloc · GAC on/off policy (the D20 set) | engine maintainer | real-workload A/B / profile shift". The design intent is `docs/tranches/2026-07-grand-uplift/evidence/synthesis-pass1.md:163`: "flat CSR/arena scratch reused per call (the `adjacency.rs` pattern) instead of a dozen nested Vecs; HashMap/bitset value-index instead of O(n_vals) linear scans."

**What already landed (do NOT re-propose):** the value→index fast path IS implemented — `fast_index<V:'static>` via `Any` downcast (no trait bound, so `FiniteDomain<String>` still compiles) plus the generation-stamped `val_index`/`val_index_gen` reverse map (`csp-solver/src/solver/gac/mod.rs:101-138,229-236,288-316`). synthesis-pass2.md:72 called value-index "deferred (bound-blocked by the FiniteDomain<String> regression guard)"; that blocker was solved with the `Any`-downcast trick. This portion of §163's wishlist is DONE.

**What is still open** (verified at HEAD):
- **CSR adjacency — NOT landed.** `adj: Vec<Vec<u32>>` and `res_adj: Vec<Vec<u32>>` (`gac/mod.rs:88,91`). `reset_adj` (`gac/matching.rs:11-19`) retains inner-Vec capacity (pooled), but it is still a vector-of-vectors: N separate heap allocations, pointer-chase per neighbor, cache-hostile. A flat CSR (one `Vec<u32>` edges + one `Vec<u32>` offsets) is the classic replacement.
- **Vec-indexed warm cache — NOT landed.** `cache: HashMap<u32, Vec<Option<V>>>` (`gac/mod.rs:99`), read at `gac/mod.rs:339-340` (`s.cache.get(&id)`), keyed by `gac_id`. But `gac_id` is a **dense monotonic** counter (`next_gac_id` = `AtomicU32::fetch_add`, `gac/mod.rs:54-56`), so the key space is `0..N` — a `Vec<Option<…>>` indexed by `gac_id` is strictly cheaper than a SipHash lookup on the hot path. `CACHE_CAP=8192` (`gac/mod.rs:71`) already bounds it.
- **A residual linear scan the value-index did NOT cover:** `s.assigned_ns.contains(&val)` (`gac/mod.rs:289`) — O(n) per (var,val) inside the adjacency-build loop. Small (`assigned_ns` ≤ n_participants) but hot; a stamped-membership bitset (like `val_index`) would close it.

---

## Perf rows, ranked by evidence strength

### ROW 1 (STRONGEST) — CSR adjacency + Vec-indexed matching cache shrink the GAC per-call constant, the direct lever on the disclosed minority cost
The named-hard 9×9 slowdown (3/5 boards, 1.68–3.12× slower ON, my run) is explicitly "GAC's per-propagation constant" (`benchmarks.md:24`) and is measured in isolation at ≈1.8× on `sudoku_9x9/al_escargot/ac3_failfirst` (≈370→≈677 µs, `benchmarks.md:30`). Both D20 levers (CSR flat adjacency at `gac/mod.rs:88,91`; Vec-cache at `gac/mod.rs:99,339`) reduce exactly that constant — they don't change node counts (GAC pruning strength is invariant), so they are pure downside-removal: they can only narrow the minority cost, never widen it. **Newly measurable:** the committed `gac_timing_probe` (which the grand-uplift lacked — the 13.36× rested on a since-deleted scratch harness, `benchmarks.md:14`) gives a per-board before/after oracle. This is the one D20 lever with (a) a mechanism, (b) a first-party reproducible harness, and (c) a disclosed cost it directly attacks. **Evidence: STRONG.**

### ROW 2 — GAC on/off policy: NO new static gate is evidenced; the correct "refinement" is Row 1
Per-bucket first-party (my run): GAC loses **only** where absolute node counts are already tiny (named-hard on-nodes 72/83/369/114/64) — boards MRV+AC3 nearly crushes, so the fixed graph-rebuild cost has nothing to amortize against. N4/easy is 1.00× with **identical** nodes (640→640): GAC runs and prunes nothing beyond singleton removal, yet costs nothing felt. The wins are enormous and node-driven (N4/medium 27.13× / 17× fewer nodes; N4/hard 28.54×). The loss signal (low absolute node count) is **not prospectively exploitable** by a static gate — you don't know the node count before searching. The existing gate `GAC_MIN_PARTICIPANTS=3` swept 2–6 stays within ~7%, is 1.79× worse at 9 (`benchmarks.md:26`, `docs/tranches/2026-07-grand-uplift/waves/W2-gac-search.md:13`). **Verdict:** default-ON stands; the losses are sub-millisecond and off the served path (web ships N=2,3,4 + N=5-easy; the named-hard 9×9 are adversarial, not in the shipped bank). A dynamic per-constraint auto-disable is prototype-gated and not warranted. The evidenced "policy refinement" is to cut the constant (Row 1), not add a gate. **Evidence: STRONG for the negative conclusion (fresh per-bucket data).**

### ROW 3 — Criterion coverage gaps (CI perf-regression blind spots)
Verified by reading `csp-solver/benches/` (no `gac`/`GAC_IN_ALLDIFF` refs; no `futoshiki` refs — grep clean) and `benches/sudoku.rs`:
- **(a) No GAC on/off A/B in criterion.** The 13.79× headline and the minority cost live only in `examples/gac_timing_probe.rs` (an example, run by hand — CI never invokes it). A GAC per-call cost regression (or a Row-1 win) is invisible to CI. `sudoku.rs` benches only Ac3×{FailFirst,Mrv} with GAC always default-ON.
- **(b) Zero futoshiki bench.** A shipped game (N=4–7) has no criterion perf guard at any size.
- **(c) The GAC-winning bucket is unbenchmarked in criterion.** N4 medium/hard (27–28× wins) are absent; criterion covers only 5 hardcoded named-hard 9×9 + a single 16×16 board (`sudoku.rs:178,234`).
- **(d) Node-count invariants un-asserted.** The deterministic node figures (40513→4678) are the soundness-load-bearing numbers (`benchmarks.md:122`) but only queens has a CI ground-truth smoke lane (`cargo bench -p csp-solver --bench queens -- --test`). Promoting `gac_ab_corpus`'s 0/50 false-UNSAT + a node-count assert into a CI smoke lane would guard GAC soundness+cost. **Evidence: STRONG (direct source read).**

### ROW 4 — mimalloc: blocker already resolved, but value proposition collapsed post-abrogation
The allocator-conflict blocker (mimalloc's `#[global_allocator]` vs `alloc_count.rs`, `synthesis-pass3.md:53`) is **already pre-emptively fixed**: the counting allocator is gated behind the `alloc-count` feature (`csp-solver/Cargo.toml:15-27`, off by default so "a future mimalloc `#[global_allocator]`… would otherwise hard-conflict"). mimalloc is native-only (`cfg(not(target_arch="wasm32"))`, synthesis-pass2.md:75). **Post server-abrogation (tranche-2 W2), the default path is wasm-in-Worker**; the native PyO3 wheel serves only the fallback/oversize path (owner's box: N=5-Easy + past the browser ceiling). So mimalloc now benefits a **non-served surface**. Quiet-host rerun showed mimalloc is "the only positive lever" but the combined lto/cu1 package nets ≈0% (`synthesis-pass3.md:53`). **Verdict:** DEFER stands, weaker than D20 framed it — benefit surface shrank to the fallback origin. Not a tranche-III lever unless the native wheel's throughput becomes the bottleneck. **Evidence: STRONG (feature-gate present; abrogation is fact).**

### ROW 5 — opt-level=s is now budget-MARGINAL, not "in-budget" (the D21 cell is stale)
D21 (`docs/tranches/2026-07-tranche-2/evidence/synthesis-pass1.md:36`): "opt-level=s = DEFER-as-optional (+17%/+2.1 KB, in budget — trigger: hard-16×16 latency felt on low-power mobile; the s cell is bracketed-plausible, **not rebuilt** — re-derive if ever pulled)." That "in budget" was true at the W3 lean of **87,853 B** (5,147 B headroom under the fail>93,000 gate). **At HEAD the lean artifact measures 90,602 B** (`wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`, verified this session; matches `benchmarks.md:49`). Headroom is now **2,398 B**. Adding +2.1 KB (2,150 B) → ≈92,752 B, only **248 B** under the fail gate — the "in-budget" premise no longer holds with margin, and the +17%/+2.1 KB cell was **never actually built** (bracketed-plausible). The felt-latency trigger has never fired: P2 measured worker-boundary overhead <0.4 ms, "robust to any realistic low-power-mobile multiplier (a 5× penalty still clears)" (`docs/tranches/2026-07-tranche-2/evidence/pass2/P2.md:73,118`). **Verdict:** DEFER stands, but tranche-III must re-mark the row: the size claim is stale and s is no longer safely in-budget. **Evidence: MEDIUM-STRONG (lean size measured this session; the s delta never rebuilt).**

### ROW 6 — wasm size levers left: none on the lean band; the erosion trend is the real risk
`--profile wasm-release` is `opt-level="z"` + `panic="abort"` (`Cargo.toml:81-85`); wasm-opt is `-Oz --enable-bulk-memory --enable-nontrapping-float-to-int`, duplicated under `.profile.release`+`.profile.custom` for the three-file atomicity rule (`csp-solver/wasm/Cargo.toml:59-63`). Levers already settled (D21, synthesis-pass1.md:36): opt-3 REJECT (123,294 B, busts gate); simd128 REJECT (−3.4%, no size win); `-Oz` beats `-O4`. **Lean headroom is eroding:** 5,147 B (W3) → 2,398 B (HEAD), a 2,749 B growth from W6 beat-9 propagate ops + the futoshiki surface (`benchmarks.md:49`). The next feature addition can bust fail>93,000. The only structural size lever left touches the **full** npm module (222,436 B), not the lean band: pass1 R3 (`scratchpad/tranche3/pass1/R3-isomorphic-dissection.md`) finds `isomorphic.rs` (460 L, `full-mirror`) a zero-consumer/zero-test mirror recommended for EXCISE — but "all three options leave the 93 KB lean band untouched" (isomorphic is `--no-default-features`'d out). So excising it is a library-hygiene / full-module win, **not a lean-perf lever**. **Verdict:** no lean-size lever remains except code-trim; track the erosion, and if headroom must be reclaimed, the futoshiki+sudoku surfaces are the only in-band code. **Evidence: MEDIUM (sizes measured; excision is structural, not size-on-the-served-path).**

### ROW 7 (minor) — residual O(n) scan in the GAC adjacency-build hot loop
`s.assigned_ns.contains(&val)` (`gac/mod.rs:289`), O(|assigned|) per (var,val), inside the per-participant domain iteration — the one linear scan the landed value-index fast path does not cover. `assigned_ns` ≤ n_participants (small), so impact is bounded, but it is on the same hot path Row 1 targets and a stamped-membership bitset (mirroring `val_index`) would fold it into the CSR-adjacency rebuild for free. **Evidence: WEAK (mechanism only, no measured cost, small n).**

---

## Synthesis for tranche-III authoring

1. **The evidenced perf move is Row 1 + Row 3 together:** land CSR adjacency + Vec-indexed cache (attacks the one disclosed cost), and gate it in CI via a GAC-A/B criterion bench + a node-count smoke lane (so the win is tracked and future GAC edits can't silently regress the constant). These are complementary: Row 1 is the change, Row 3 is the guard.
2. **Row 2 closes the "policy refinement?" question NO** on fresh first-party per-bucket data: no static gate beats blanket-ON; the losses are sub-ms and off the served path. Do not add a dynamic disable heuristic on this evidence.
3. **mimalloc (Row 4) and opt-level=s (Row 5) both DEFER** — but their premises decayed since they were booked: mimalloc's benefit surface shrank to the fallback origin (abrogation), and opt-level=s is no longer safely in-budget (lean grew to 90,602 B). Tranche-III should re-mark both rows rather than carry the stale framing.
4. **The value-index fast path already landed** (`fast_index` + `val_index`); do not re-propose it from §163.
