# p3-wasm-facilities — the wasm facilities, first-party

Repo HEAD 65425697. Toolchain (host, this run): rustc 1.97.0, cargo 1.97.0,
wasm-pack 0.15.0, wasm-bindgen 0.2.126, wasm-opt v129, twiggy 0.8.0, node v26.0.0.
All builds to `builds/` and `analysis/` under this dir; every recipe rerunnable
(banked below). NO source edits — analysis builds only, to scratch out-dirs; the
committed `csp-solver/wasm/pkg/` was never touched.

Verdict headline: **the shipped lean artifact is already at the size/speed floor.**
SIMD is a measured no-op, bulk-memory is already default-on, reference-types/multi-
value change nothing, -Oz is both smallest and fastest, the JS↔wasm boundary is
sub-millisecond noise behind a 150 ms debounce, and there is no pruneable dead
weight in the lean binary without a diagnostic-quality regression. Threads are not
free. Net-new perf rows for T4: **zero actionable** — this lane closes the wasm
facilities as CLEAN, with SIMD/threads named as REJECTED and two items folded to W5.

---

## (a) Size truth — CONFIRMED byte-exact

SHIP recipe (not the drifted Makefile), fresh:

```
# lean (browser ship):
wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release \
  --out-dir builds/lean --no-default-features        → 86,746 B
# full (assignment feature; the bbnf-buddy reference, NOT browser-shipped):
wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release \
  --out-dir builds/full                              → 188,095 B
```

- lean **86,746 B — `cmp` BYTE-IDENTICAL to the committed `pkg/csp_solver_wasm_bg.wasm`**.
- full **188,095 B** — matches W5's recorded figure exactly.
- (W5 already owns the figure-correction of the stale CI numbers; this is confirmation.)

### twiggy top-10 (lean, symbol-attributed via a `-g` names-kept analysis build)

The ship strips the names section (35,564 B, 29% of the analysis build) — that gap is
the whole difference between the 122 KB named build and the 86,746 B ship. Real code:

| bytes | % ship | item |
|--:|--:|---|
| 6,404 | 7.4% | `solver::gac::propagate_gac_core::<BitsetDomain>` |
| 4,869 | 5.6% | `dlmalloc::malloc` |
| 4,740 | 5.5% | `solver::search::search::<BitsetDomain, Feasibility>` |
| 4,206 | 4.9% | `.rodata` (embedded puzzle/data content — include_dir!) |
| 3,513 | 4.0% | `slice::sort::unstable::quicksort::<u32>` |
| 3,338 | 3.8% | `.rodata.4` |
| 2,915 | 3.4% | `generateFutoshiki multivalue shim` (wasm-bindgen ABI) |
| 2,191 | 2.5% | `generateSudoku multivalue shim` |
| 2,050 | 2.4% | `futoshiki::validated_puzzle` |
| 1,918 | 2.2% | `Csp::<BitsetDomain>::finalize` |

Category rollup (lean): bitset-domain code ~24%, allocator (dlmalloc) ~15% incl.
malloc/free/realloc, solver core (gac+search) ~13%, `.rodata` puzzle content ~13%,
multivalue ABI shims 9,076 B / 10.5%, fmt ~7.4%, panic runtime ~2.7%.

**Pruneable weight: none clean.** Every top item is load-bearing — the bitset domain,
the allocator, the solver core, the embedded puzzle content (pruning = fewer puzzles),
and the multivalue shims are an inherent wasm-bindgen ABI artifact (see (c): toggling
reference-types/multivalue is byte-identical). No dead pub surface in lean — the
`assignment`/serde graph is already excluded by `--no-default-features` (it is the
entire lean→full delta), `js_sys`=45 B, `Reflect`=0, wasm-bindgen glue 807 B. The only
nameable prune is the panic machinery — see the REJECTED row below.

### full-build delta (why lean drops assignment)

Full 188,095 B ≈ lean + ~100 KB, dominated by: `solveAssignmentCop externref shim`
15,899 B, `f64 Display::fmt` 13,884 B (cost values force float formatting — absent in
lean), the `CostFiniteDomain` search/gac monomorphizations, serde ~7 KB. This is the
lean build's justification, reconfirmed.

---

## (b) Instantiation + boundary — sub-ms, already flat + zero-copy

### instantiate (real 86,746 B artifact, node v26 / V8, n=200)
- `WebAssembly.compile` **median 0.163 ms** (min 0.111) — the ArrayBuffer path.
- `instantiate(compiled)` **median 0.036 ms** (min 0.029).
- The glue (`csp_solver_wasm.js:658`) already prefers `instantiateStreaming` on a
  `Response` with `application/wasm` (the `_headers` MIME is certified), falling back to
  `instantiate(bytes)`. Streaming's only edge over ArrayBuffer is overlapping compile
  with the network download; against the preloaded artifact the ~0.2 ms compile is noise.
- Worker cold-start-to-first-solve-ready: worker spawn + (preloaded) fetch + 0.16 ms
  compile; `prewarm()` (`useSolver.ts:99`) already runs this on `requestIdleCallback` at
  mount. r1-perf's startup cert (FCP=LCP=72 ms) stands.

### the chatty paths
- **propagateBoard** (drives pencil marks) is debounced **150 ms** and gated behind the
  hold-to-peek gesture (`usePencilMarks.ts:31-43,49`) — so during rapid entry-while-
  peeking it fires at most **~6.7 calls/s**, never per-keystroke. Per-call wasm cost:
  **propagate 9x9 median 0.28 ms**, 16x16 3.7 ms (node/V8). Payload is a flat
  `Uint32Array` (81 u32 = 324 B at 9x9, 1024 B at 16x16) crossing as a **transferable**
  (zero-copy, `useSolver.ts:223`); masks return transferable too.
- **deal path** (`getRandomBoard`) builds a flat templates `Uint32Array` and transfers
  its buffer (zero-copy, `useSolver.ts:163`); called once per new-board, not chatty.
- The only serialization is main-thread `toFlat`/`toRecord` (Record↔Uint32Array for the
  Vue-reactive board): measured **1.0 µs / 0.75 µs at 9x9, 3.0 µs / 2.5 µs at 16x16**.

**A flat-typed-array protocol is already in place** (Uint32Array + transferables, no JSON
on any hot path). There is no user-visible latency to reclaim — the boundary is noise
(0.28 ms wasm + ~1 µs marshalling at a 150 ms duty cycle = <0.2% occupancy). CLEAN.

---

## (c) The forgone post-MVP features — measured, all no-op

### SIMD (`-C target-feature=+simd128`), lean, node/V8 solve-time
| | baseline | +simd128 |
|---|--:|--:|
| solve 9x9-hard (median/min ms) | 0.546 / 0.503 | 0.569 / 0.530 |
| solve 16x16-hard (median/min ms) | 1.787 / 1.720 | 1.946 / 1.618 |
| propagate 9x9 (median ms) | 0.278 | 0.293 |
| propagate 16x16 (median ms) | 3.705 | 3.891 |
| wasm size | 86,746 B | 86,371 B (−375 B) |

**SIMD does nothing** — every solve/propagate delta is within run-to-run noise (SIMD
medians land slightly *worse*; mins are a wash). Confirms the hypothesis: the bitset
domain's u128 ops don't autovectorize to a net win at `-Oz`, and there is no hand-written
v128 to exploit them. The −375 B is incidental. Requiring `simd128` would add a runtime-
capability floor (old engines lacking it) for zero-to-negative benefit → **REJECTED**.

### bulk-memory
Already **default-on in rustc 1.97** — the ship wasm contains **27 `memory.copy` + 5
`memory.fill`**. The `--enable-bulk-memory` in the Cargo.toml wasm-opt profile array is
now redundant (matches W5's own note). → **FOLD-W5** (W5 owns the dead-`[profile.custom]`
+ Cargo.toml cleanup and already records this redundancy).

### reference-types / multi-value
wasm-bindgen 0.2.126 + `wasm-opt --enable-reference-types --enable-multivalue` on the same
bindgen input: **byte-identical 86,746 B, identical 27,139 B JS glue** vs baseline.
wasm-bindgen already emits the compact form; the "multivalue shim" functions are its
inherent ABI output, not further collapsible by the proposal flags. No lever. CLEAN.

---

## (d) wasm-opt pipeline — -Oz is both smallest and fastest

Level sweep on the same bindgen input (`--enable-bulk-memory --enable-nontrapping-float-
to-int`, names stripped):

| level | size | | solve 9x9 med/min | solve 16x16 med/min |
|---|--:|---|--:|--:|
| -O0 | 100,762 | | — | — |
| -O1 | 93,324 | | — | — |
| -O2 | 88,424 | | 0.670 / 0.517 | 1.855 / 1.702 |
| -O3 | 87,938 | | 0.574 / 0.542 | 1.971 / 1.815 |
| -O4 | 87,963 | | — | — |
| -Os | 87,508 | | — | — |
| **-Oz** | **86,746** | (= ship, `cmp` byte-identical) | 0.616 / 0.535 | 1.940 / 1.783 |

`-Oz` is the **smallest** (−1,192 B vs -O3, −762 B vs -Os) and its solve times are within
noise of -O2/-O3 — no speed left on the table. The current ship pipeline is optimal. CLEAN.

---

## (e) Threads — not free, REJECTED

wasm threads (rayon + wasm-bindgen-rayon + SharedArrayBuffer) require the document be
**cross-origin isolated**: `Cross-Origin-Opener-Policy: same-origin` +
`Cross-Origin-Embedder-Policy: require-corp` response headers on the CF Pages deploy,
plus a CORP/CORS audit of every subresource (fonts, wasm, any embed). That header infra
is a real cost, and the solve is already sub-2 ms single-threaded — there is no latency
to parallelize away, and a puzzle solve is not a fan-out-able workload at this size.
Not free, no gain → **REJECTED** (do not recommend absent the headers, which nothing
else needs).

---

## Banked recipes (rerunnable from this dir)
```
# (a) sizes + twiggy (analysis build keeps names):
wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --out-dir builds/lean --no-default-features
wasm-pack build csp-solver/wasm --scope mkbabb --target web --profile wasm-release --out-dir builds/full
cargo build --profile wasm-release --target wasm32-unknown-unknown -p csp-solver-wasm --no-default-features
wasm-bindgen target/wasm32-unknown-unknown/wasm-release/csp_solver_wasm.wasm --out-dir analysis/lean-named --target web
wasm-opt -Oz --enable-bulk-memory --enable-nontrapping-float-to-int -g analysis/lean-named/csp_solver_wasm_bg.wasm -o analysis/lean-named-opt.wasm
twiggy top -n 25 analysis/lean-named-opt.wasm
# (b) instantiate + marshalling:
node bench-instantiate.mjs
# (c) SIMD + wasm-opt-level solve bench (nodejs-target builds):
wasm-pack build csp-solver/wasm --scope mkbabb --target nodejs --profile wasm-release --out-dir builds/node-base --no-default-features
RUSTFLAGS="-C target-feature=+simd128" wasm-pack build csp-solver/wasm --scope mkbabb --target nodejs --profile wasm-release --out-dir builds/node-simd --no-default-features
node bench-solve.mjs builds/node-base baseline ; node bench-solve.mjs builds/node-simd simd
# bulk-memory presence:
wasm-opt --print builds/node-base/csp_solver_wasm_bg.wasm | grep -oE 'memory\.(copy|fill)' | sort | uniq -c
```
```

## Rows
| id | finding | measured | disposition |
|---|---|---|---|
| p3-r1 | size truth lean/full | 86,746 (cmp-identical) / 188,095 B | CLEAN |
| p3-r2 | twiggy top-10 + no clean prune | all top items load-bearing; shims ABI-inherent | CLEAN |
| p3-r3 | panic/console_error_panic_hook prune | ~2,361 B (2.7%), hook 701 B | REJECTED-quality |
| p3-r4 | instantiate cost | compile 0.163 ms + inst 0.036 ms | CLEAN |
| p3-r5 | propagate chatty path | 0.28 ms/call, 150 ms debounce, zero-copy | CLEAN |
| p3-r6 | deal path | flat Uint32Array transferred, once/board | CLEAN |
| p3-r7 | flat typed-array protocol | already in place; marshalling 1–3 µs | CLEAN |
| p3-r8 | SIMD solve-time | no-op (0.55→0.57 / 1.79→1.95 ms), −375 B | REJECTED |
| p3-r9 | bulk-memory | default-on (27 memory.copy); flag redundant | FOLD-W5 |
| p3-r10 | reference-types / multi-value | byte-identical, no effect | CLEAN |
| p3-r11 | wasm-opt -Oz vs -O2/-O3/-O4 | -Oz smallest + no speed penalty | CLEAN |
| p3-r12 | threads | needs COOP/COEP; solve already <2 ms | REJECTED |
