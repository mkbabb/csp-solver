# Pass-1 Synthesis — Grand Tranche-Development Specification

**Agent**: synthesis-pass1 (Fable) · **Date**: 2026-07-04 · **Inputs**: 30 substantive Pass-1 audit reports + `docs/grand-audit-2026-06-02.md`
**Repo**: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion` (HEAD `91bb8b0`, 2026-06-03 — nothing committed since)

**Orchestrator note**: the report-path/date templating was broken this pass (literal `undefined` in paths and dates). Reports landed in three places — `undefined/` (18), `docs/audit/pass-1/` (11), scratchpad (`rust-gac.md`), repo root (`rust-cop-builder.md`) — and seven structured summaries arrived as `"test"` stubs though their reports are full. All 30 were read. Fix the templating before Pass 2; consolidate reports under `docs/audit/pass-1/`.

**Aesthetic guardrail (binding, restated)**: the hand-drawn pencil-boil skin — wobbly grid, SVG grain/boil, hand-glyph digits, orange-sun mascot, Yoshi's-Story crayon palette — is intentional. Nothing in this spec changes the visual output. glass-ui adoption is CONTRIVED here and is proposed nowhere. Shared-skin primitives route to `@mkbabb/pencil-boil`. Net glass-ui asks from this repo: zero.

---

## 1. Performance diagnosis

The through-line: **the solver core is fast; every delivery path around it is broken or pathological.** Hard 9×9s solve in 0.44–1.47 ms (rust-bench-baseline, M5 Max, release) — yet the backend can't be built from HEAD, the frontend can't be built at all under its dev tree, production serves no backend whatsoever, and the browser burns CPU on SVG-filter re-rasterization unrelated to any solve.

### 1.1 Solver core (fast, with three real inefficiencies and two inert features)

Measured baseline (rust-bench-baseline): Al Escargot 0.68–0.86 ms, Platinum 0.44–0.74 ms, Inkala 0.88–1.47 ms; 3.77 ms/puzzle aggregate over 3 hard puzzles × 1000 iters. Not the bottleneck for the served 9×9 path. Ranked residual causes:

1. **`SolveConfig::default()` is a measured pathology** — FC+Chronological runs ~7.6 s/solve on Al Escargot, ~11,000× slower than AC3+DomWdeg on the same puzzle (criterion, rust-bench-baseline). The library default is the worst config it ships.
2. **DomWdeg is inert** — constraint weights frozen at 1.0 at `finalize()` (`lib.rs:241`), never bumped on conflict; degenerates to MRV (sota-csp F1). The advertised failure-driven heuristic doesn't learn. No restarts, no phase saving, no value ordering compound this on hard instances.
3. **GAC all-different never runs on the solve path** — `AllDifferent::revise_impl` does singleton removal only; `propagate_gac_alldiff` is dead code (rust-gac, rust-constraint, sota-sudoku concur). Sudoku/Futoshiki run at forward-checking strength despite docs claiming otherwise. The one live GAC path (`AllDifferentExcept`, via AssignmentBuilder) **rebuilds Régin matching + Tarjan SCC from absolute scratch every `revise()`**: 19,687,493 propagator invocations in 2.25 s on a 10×10 AssignmentBuilder probe vs 1.33 µs for the Hungarian reference — ~1.8 million× (rust-gac, measured). This is why AssignmentBuilder falsely reports Infeasible after ~25 s at n=12 when its node budget exhausts (rust-cop-builder, reproduced).
4. **Per-node heap churn** — 5 of 6 `Domain::iter()` call sites collect into a `Vec` per search node (fix proven in a throwaway: `use<>` precise capture + collect removal cuts allocation counts 16–39%, all 165 tests pass — rust-domain); `BitsetWorklist` allocates fresh per node under AC-3 (12% combined self-time, sota-rust-perf F5); default `Constraint::revise()` allocates 5 Vecs/call with O(Di×Dj) vtable checks (rust-constraint); `restore()` sweeps ALL variables every backtrack — O(num_vars), 625 near-empty calls per backtrack at 25×25 (sota-csp E1, sota-rust-perf F3).
5. **Scaling cliff with zero data** — 200×–1200× blowup 9×9→16×16 on a fixed hard instance (sota-sudoku, fresh bench); zero timing data anywhere for 25×25, which is also the one size with no templates.
6. **No `[profile.release]` anywhere** — the wheel ships lto=false, codegen-units=16 (rust-bench-baseline P1; sota-rust-perf resolves the panic=abort caveat — see §6).

### 1.2 PyO3 / service path (the "abysmal backend")

1. **P0 — the wheel does not compile from HEAD.** `cargo check --features py` fails E0063: `SolveStats` literal at `py.rs:237` omits `budget_exceeded` — a half-landed migration from `cff0e7b` (2026-04-10), broken for 29 commits/~2 months, invisible because no CI path ever compiles `--features py` (independently reproduced by rust-bench-baseline, pyo3-boundary, fastapi-service, python-tests-legacy, api-surface-consistency, docs-accuracy). Consequences: `maturin build` in `web/api/Dockerfile` fails; `docker compose build` fails; the deployed backend (if any) is a stale wheel **predating the runaway-search node-budget guard**; `pytest tests/` aborts at collection (`test_api.py` has no importorskip). The fix is one line; the gestalt fix adds the CI gate.
2. **P0 — the GIL is held for the entire solve.** Zero `allow_threads` in `py.rs`. Empirically proven (fastapi-service, GIL probes): a 4.956 s native call starved a heartbeat thread to 41 ticks over 5.46 s (>99% starvation) and delayed a configured 1.0 s `asyncio.wait_for` timeout to 4.922 s — the event loop can't even run the timeout callback. One slow `/solve` freezes the whole worker (health checks included); 4 concurrent slow requests freeze all 4 prod workers. `asyncio.to_thread` buys nothing; the timeout is theater. Blocking prerequisite: `Constraint<D>` and `CheckerFn<D>` carry no `Send` bound, so `py.allow_threads` won't compile today (pyo3-boundary P1-1).
3. **P1 — timeout doesn't cancel** — after a 408, the orphaned worker thread keeps solving while holding the GIL (fastapi-service F3). Needs a cooperative cancellation flag at the node-budget check cadence.
4. **P2 — boundary waste**: two-call solve API rebuilds the whole CSP per request; `HashMap<String,i32>` string-keyed marshaling (625 `String`s per solution at N=5); unbounded size 5 accepted behind only the 30 s wall; slowapi limiter wired but applied to zero routes (unthrottled DoS surface).

### 1.3 Frontend runtime (and its build)

1. **P0 — the prod build fails on every path.** (a) `npm ci` fails EUSAGE before installing anything: package.json specs (`^2.0.0`/`^0.5.0`) don't satisfy the lockfile pins (1.1.0/0.4.0), plus a transitive `parse-that` mismatch and a missing `value.js@0.10.0` lock entry — Dockerfile base of every stage (fe-build-deps, reproduced). (b) Under the local dev symlinks (keyframes.js 5.1.0, value.js 2.0.0), `vite build` fails: `Animation` was removed as a static export in keyframes.js 5.0.0 — 4 TS2305 errors via the project's own `vue-tsc` (fe-glyph-anim, fe-composables-state, fe-runtime-perf, fe-components-audit all reproduced). Grand-audit M1's "manifest-only, no code change" premise was void even at its own `^2.2.0` target — 2.2.0 already moved `Animation` behind `loadAnimationEngine()` (fe-build-deps §1.4).
2. **P1 — the runtime cost is SVG-filter re-rasterization, not bundle or reactivity.** Bundle is lean (measured 164 kB main+65 kB vue-vendor+31 kB CSS from the tracked snapshot — fe-build-deps; fe-runtime-perf's 73 kB figure came from a shim build; both agree bundle isn't the problem). The dominant cost: the full-board `grain-static` feTurbulence (3 octaves) wraps the animating grid `<g>`, so every ~6.7 fps boil tick re-rasterizes the whole board (~62 M noise-evals/s at 16×16) even though grain's own parameters never change (fe-runtime-perf, sota-svg-anim-perf F1 — the single highest-leverage frontend fix).
3. **P1 — animation-scheduler anarchy.** Three disciplines coexist: pencil-boil's correct singleton rAF (path boil), 3 raw `setInterval`s in SvgFilters.vue (filter wobble — no PRM reactivity, no visibility pause), and up to 256 independent keyframes.js `Animation` rAF chains for post-solve glyph wiggle, each forcing a filtered re-raster forever (fe-boil-pipeline, fe-glyph-anim, sota-svg-anim-perf F2/F3). Plus one feTurbulence filter instance per glyph (up to 256), a hidden ghost `<svg>` per cell, and dual mobile+desktop mounts of ControlPanel/HandDrawnOutline/AttributionCard running duplicate boil subscribers forever (fe-components-audit).
4. **P2 — glyph correctness debts**: hand-authored path `length` values off by avg 11.4%/worst 26% vs true arc length; `createGlyphDrawIn` never resets stroke-dasharray, baking a permanent dash gap into solved glyphs once the P0 import bug is fixed (fe-glyph-anim, measured).

### 1.4 Wasm + morph

1. **The shipped surface is mostly dead.** `isomorphic.rs` (632 L, 16 exports, measured 90,775 B / 10.4% of the pre-opt binary via twiggy) has zero consumers constellation-wide; even `solveAssignmentCop` (76,929 B) has no production call site — the real Tier-2 assignment solve runs natively inside `@mkbabb/morph` via morph-core's path dependency, never crossing csp-solver-wasm; bbnf-buddy still fetches+instantiates the 280 KB module at every boot for it (sota-wasm F1a/F1b, wasm-core).
2. **Boundary format**: `serde-wasm-bindgen` has no typed-array fast path (confirmed from its source) — `Vec<f64>` cost matrices cross as N boxed JS Numbers; morph's nested `WireSegment` arrays pay per-element + per-nesting cost (sota-wasm A3, correcting wasm-morph-totality's "fast pattern" framing).
3. **Morph compute shape**: the cost matrix eagerly runs the full O(n²) geometry pipeline just to score; each subpath centroid recomputed ~4n² times; the "zero-alloc scratch arena" is aspirational (~10 Vecs/call/pair) (wasm-morph-totality).
4. **Process**: the wasm crate's only test suite has never run in CI (cfg(wasm32) gate; `cargo test` reports 0 tests; `wasm-pack test --node` passes 5/5 when actually run); 4.0% size win from lto/panic tuning blocked by workspace profile coupling (wasm-core, measured).

### 1.5 Deploy (the outermost failure)

Production `sudoku.babb.dev` is a **static-only host**: every path including `/api/*` 200s the SPA shell — solver features silently non-functional in prod. `api.csp-solver.babb.dev` is a dangling Cloudflare-proxied record fingerprinting as an unclaimed GitHub Pages origin (subdomain-takeover shape, P0). `scripts/deploy.sh`'s default host is NXDOMAIN; `scripts/dev.sh` is broken on both halves; CI is fully disabled; 11,406 of 11,859 tracked files (96%, 169 MB) are node_modules/dist cruft from a stale two-line `.gitignore` prefix (`frontend/` vs `web/frontend/`, born at restructure commit `97cce73`), which also corrupts every Linux Docker build via `COPY . .` shipping tracked macOS-native esbuild/rollup binaries (deploy-docker, all live-verified).

**Count reconciliation**: git-archaeology's 17,637 (node_modules 11,401 + "dist" 6,236) double-counts nested `*/dist` paths inside node_modules; deploy-docker's 11,406 and fe-build-deps' direct `git ls-files` (11,401 + 5) agree. Use **11,406**.

---

## 2. Legacy / workaround / fallback excision ledger

Disposition vocabulary: **EXCISE** (delete outright) · **FAIL-EXPLICIT** (replace silent/conflated handling with typed, explicit failure) · **WIRE-or-EXCISE** (dead scaffolding the SOTA matrix adopts — complete it this tranche or delete it; no half-state survives, per sota-csp's own rule).

### 2.1 Rust core

| # | Instance | Evidence | Disposition |
|---|---|---|---|
| R1 | `ConstraintEnum::Lambda` — zero constructors anywhere | rust-constraint | **EXCISE** |
| R2 | `CardinalityConstraint` — dead constellation-wide | rust-constraint | **EXCISE** (re-add on real consumer) |
| R3 | `propagate_gac_alldiff` dead in the propagation graph; 224 lines duplicated verbatim/near with `_except` | rust-gac | **WIRE-or-EXCISE** → WIRE (SOTA §6 adopts GAC) via sentinel-generic core; duplication EXCISED by the unification |
| R4 | `NogoodStore` (167 L + tests) orphaned | sota-csp F2 | **WIRE-or-EXCISE** → WIRE as restart nogoods (prototype 3); else EXCISE |
| R5 | `local_search::min_conflicts` zero call sites; proposed as budget-exhaustion "fallback" | rust-cop-builder | **EXCISE** — a silent fallback is precept-banned; revival only as an explicit caller-selected strategy (open question §8) |
| R6 | `SoftLambdaConstraint` addable via `add_constraint()`, penalty silently discarded | rust-constraint | **FAIL-EXPLICIT** — compile-time separation of soft vs hard |
| R7 | `BitsetDomain` 0..128 invariant guarded by `debug_assert!` only — release builds silently alias v≥128 to v mod 128 (verified; reachable from published py/wasm bindings; wasm doc claims 0..u32::MAX) | rust-domain P0 | **FAIL-EXPLICIT** — release-mode check or type-level guarantee; fix the wasm doc lie |
| R8 | AssignmentBuilder returns `Err(Infeasible)` on budget exhaustion, discarding `budget_exceeded`; a checked-in test codifies the ambiguity | rust-cop-builder P0 | **FAIL-EXPLICIT** — `AssignmentError::BudgetExceeded` variant; EXCISE the ambiguity-blessing test |
| R9 | `.expect("call finalize() before solve()")` panic reachable across FFI; unvalidated VarIds index-panic deep in search | pyo3-boundary P1-2 | **FAIL-EXPLICIT** — boundary validation returning `PyValueError`/`PyRuntimeError` |
| R10 | `tests/optimize.rs` hand-rolls a duplicate CostFiniteDomain | rust-domain | **EXCISE** — use the production type |
| R11 | `FiniteDomain::iter`/`CostFiniteDomain::iter` dead-weight overrides recomputing the trait default | rust-domain | **EXCISE** |
| R12 | `generate_from_template` / `apply_random_transform` byte-identical twins | rust-puzzles | **EXCISE** one |
| R13 | `difficulty` parameter silently discarded on the template fast path (`_difficulty`) | rust-puzzles P1 | **FAIL-EXPLICIT** — honor it or reject it |
| R14 | `sudoku_solutions/` bank — 130 JSON files read by nothing | rust-puzzles | **EXCISE** |
| R15 | py.rs maps `Unsatisfiable` to bare `PyRuntimeError`; `optimization_mode` silently truncated by `..Default::default()` in the From impl | pyo3-boundary P2-2/P2-3 | **FAIL-EXPLICIT** — typed `Unsatisfiable` exception; expose `optimization_mode` |
| R16 | `SolveConfig::default()` = the measured 7.6 s pathology | rust-bench-baseline | Change default to AC3+DomWdeg (kernel spec §3.1) — a defaults bug, not a fallback, but recorded here so it can't survive |

### 2.2 Python service

| # | Instance | Evidence | Disposition |
|---|---|---|---|
| P1 | `web/api/scripts/generate_templates.py` — imports a module deleted at `08c339b`, stale DATA_DIR; cannot execute | rust-puzzles, fastapi-service F14, python-tests-legacy F8 | **EXCISE** — replaced by a Rust generator binary (§3.2) |
| P2 | `_has_conflicts` — Python re-implementation of Rust constraint logic; forks the response contract (trivial conflicts→200 echo, deep conflicts→400) for no documented reason; contains a nested `import math` | fastapi-service F5/F9 | **EXCISE** whole function (Rust rejects the same input in 0.228 ms/8 backtracks); one consistent no-solution path |
| P3 | `except Exception → 500 f"{e}"` (leaks internals) and `except Exception → (False,{})` (reports crashes as "no solution") | fastapi-service F4 | **FAIL-EXPLICIT** — catch only nameable conditions; let real faults 500 honestly; distinguish unsat vs budget-exceeded vs crash |
| P4 | slowapi limiter fully wired, applied to zero routes — decorative protection | fastapi-service F6 | **WIRE-or-EXCISE** — `@limiter.limit` on `/solve` (strict) + `/random` (loose), or remove the dependency |
| P5 | `SudokuCSP` lacks `budget_exceeded`; API can't distinguish unsat from gave-up | fastapi-service F12 | **FAIL-EXPLICIT** — expose and surface distinct status |
| P6 | Unreachable defensive `SudokuDifficulty.get` None-branch after FastAPI enum validation | fastapi-service F15 | **EXCISE** |
| P7 | Dev tooling in `[project.optional-dependencies]` not `[dependency-groups]` — bare `uv sync` yields no pytest/ruff/mypy; falls through to a stray system pytest | python-tests-legacy F2 | Fix stanza (PEP 735); add pytest-timeout |
| P8 | API description advertises Futoshiki; no route exists | rust-puzzles | **FAIL-EXPLICIT** — remove the claim now; Futoshiki surface is a booked follow-on (§4) |
| P9 | `numpy>=2.2.0` declared, zero imports | pyo3-boundary | **EXCISE** |
| P10 | `HARD_PUZZLES` dict byte-duplicated across two test files (10 E501s); `test_bench_compare.py` compares nothing (its comparison target was deleted) | python-tests-legacy F5/F7 | **EXCISE** duplication via conftest; rename/fold the file |
| P11 | `web/api/docs/csp_optimization.md` — changelog for the deleted Python solver | python-tests-legacy F10 | **EXCISE** (archive) |
| P12 | Naming collision: dist `sudoku-rs` provides import `csp_solver`; `web/api` project named `csp-solver` provides import `app` | fastapi-service F7 | Rename set: `app`→`sudoku_api`, maturin project→`csp-solver-py`, service project→`sudoku-api` |

### 2.3 Frontend

| # | Instance | Evidence | Disposition |
|---|---|---|---|
| F1 | Dead decorative subtree: `VineBorder.vue`, `DoodleAccents.vue`, `vineGenerator.ts`, `vineShapes.ts`, `doodleShapes.ts`, `scribbleFill.ts` (196 L, zero consumers) + the `roughjs` dep they'd drag back | fe-build-deps §9, fe-runtime-perf, fe-architecture F4 | **EXCISE** — see contradiction resolution below |
| F2 | Abandoned shadcn-vue scaffold: `components.json`, dead v3 `tailwind.config.ts` (imports uninstalled `tailwindcss-animate` — would throw if ever loaded), `reka-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lib/utils.ts` `cn()` | fe-build-deps §5/§7, fe-architecture F6 | **EXCISE** all seven artifacts |
| F3 | `FilterTuner.vue` (438 L) dead-in-prod via commented-out import — an unenforced convention | fe-architecture F5 | **FAIL-EXPLICIT** — `import.meta.env.DEV` gate + `defineAsyncComponent`; keep the tool |
| F4 | 5 `Animation.stop()` try/catch swallows + 2 decorative lib-call swallows + FilterTuner input-parse swallow | fe-glyph-anim, fe-components-audit | **FAIL-EXPLICIT** |
| F5 | Silent error architecture: `errorMessage` ref consumed by nothing; `SolveState` error variant never assigned/rendered; network failure conflated with "wrong answer"; `useApi` discards `res.status` (6 statuses → one untyped Error); no client AbortSignal against the server's 30 s | fe-composables-state P1, api-surface-consistency | **FAIL-EXPLICIT** — typed `ApiError` + rendered error/timeout states + client-side timeout sharing the server constant |
| F6 | Composables duplicating the project's own @vueuse/core (`usePreferredReducedMotion`, `useDebounceFn`, `useUrlSearchParams`, `useStorage`) and pencil-boil's PRM check (4 reimplementations incl. SvgFilters) | fe-composables-state, fe-boil-pipeline | **EXCISE** duplicates; retire `useReducedMotion.ts` once pencil-boil exports `usePrefersReducedMotion()` |
| F7 | Dual mobile+desktop mounts, CSS-hidden — permanent duplicate boil/timer subscribers | fe-components-audit | **EXCISE** duplicates — single `useMediaQuery`-driven mount |
| F8 | `lint` script = configless `prettier --write src/` (would rewrite the whole tree to the wrong style); `prettier-plugin-tailwindcss` installed, never registered | fe-build-deps §6 | **FAIL-EXPLICIT** — commit `.prettierrc` pinning the actual style + plugin |
| F9 | Redundant `autoprefixer` PostCSS pass under Tailwind v4 | fe-build-deps §3 | **EXCISE** |
| F10 | `@mkbabb/value.js` direct dep, zero direct imports | fe-architecture F9, fe-build-deps §7 | **EXCISE** direct entry (transitive via keyframes.js) |
| F11 | node_modules symlinks over git-tracked package content (unreproducible dev state) | fe-build-deps §1.3 | Resolved by G1 untracking + lockfile heal; symlinks become ordinary ignored dev convenience |

### 2.4 Wasm / morph

| # | Instance | Evidence | Disposition |
|---|---|---|---|
| W1 | `isomorphic.rs` mirror (16 exports, 90.8 KB) — zero consumers; `solveAssignmentCop` — no production call site; bbnf-buddy boots a 280 KB module for it | sota-wasm F1a/F1b, wasm-core | **WIRE-or-EXCISE** — fate decided by prototype 6 (client-wasm-solve). If the frontend adopts in-browser solve, the mirror becomes the product surface (re-keyed flat-index wire); else feature-gate off the published package or delete, and strip bbnf-buddy's `initCspSolver` boot wiring |
| W2 | `node_budget_ms` wire field silently accepted and discarded | wasm-core | **FAIL-EXPLICIT** — reject or implement (needs the wall-clock budget, §3.1) |
| W3 | `csp-solver/wasm/pkg/` compiled artifacts git-tracked (wasm-morph correctly ignores); both Makefiles strip `pkg/.gitignore` | sota-wasm F2 | **EXCISE** from git; delete the strip lines |
| W4 | Correspondence hints (anchor pairs) silently dropped at the wire boundary — a live user-facing dead feature | wasm-morph-totality P1 | **FAIL-EXPLICIT** + wire through (cross-repo: morph republish + bbnf-buddy) |
| W5 | `NEXT_ID` global atomic — non-deterministic ids the consumer discards; dead pub surface; response-side wire-type duplication | wasm-morph-totality | **EXCISE** all three |
| W6 | Procrustes Step-7 dormant frame-inversion bug, faithfully ported, untested | wasm-morph-totality | Fix + test (correctness, recorded here so it can't ride along silently) |
| W7 | bbnf-buddy `runtime.test.ts` docstring claims Tier-2 dispatches through csp-solver-wasm — false | sota-wasm | Doc fix (external repo) |

### 2.5 Deploy / repo / docs

| # | Instance | Evidence | Disposition |
|---|---|---|---|
| G1 | 11,406 tracked node_modules/dist files (169 MB) from stale `.gitignore` prefix; corrupts Docker via `COPY . .` of macOS binaries | deploy-docker §5, fe-build-deps §8 | **EXCISE** — `git rm -r --cached`, re-anchor globs, add `.dockerignore`; sequence before/with the M1 lockfile heal |
| G2 | `scripts/dev.sh` broken both halves; `scripts/deploy.sh` default host NXDOMAIN | deploy-docker §9 | **FAIL-EXPLICIT** — rewrite against `web/` layout; no silent default to a dead host |
| G3 | CI fully disabled (`deploy.yml.disabled`), including the VPN-independent test job | deploy-docker §10 | Re-enable with gates: `cargo check --features py`, `cargo test --workspace`, `wasm-pack test --node`, clippy incl. wasm32, `npm ci --dry-run`, `vue-tsc`, `uv run pytest`, twiggy size budget |
| G4 | `docker-compose.prod.yml` defaults point at the dead NCSU deployment; live babb.dev config exists only out-of-band | deploy-docker | **FAIL-EXPLICIT** — committed, versioned prod defaults per the §3.2 deploy decision |
| G5 | `api.csp-solver.babb.dev` dangling DNS (takeover shape) | deploy-docker P0 | **EXCISE** the record or claim the origin — needs Cloudflare account access (outside repo scope; flagged) |
| G6 | Docs lying about code: GAC "runs" on Sudoku (docs/algorithms.md, docs/sudoku.md); "107 Python tests"/deleted solver described as present in root+api CLAUDE.md; maturin documented as working in 3 files; Rust "83 tests/7 files" (real: 140/13); phantom components (PencilCursor, SpiralSun); root README ~90% stale pre-restructure duplicate; "patched into bbnf-lang via .cargo/config.toml" (it's a vendored byte-identical copy pinned at `b700986`); docs/benchmarks.md non-reproducible (Platinum claimed 2.57 ms vs measured 0.44 ms) with a non-apples-to-apples 7–57× headline; py.rs/lib.rs docstrings claiming isomorphism to a deleted Python solver; wasm README saying solveAssignmentCop "lands in a future commit" (it shipped) | docs-accuracy, git-archaeology, python-tests-legacy | Full docs rewrite AFTER the code tranche lands (one pass, all three CLAUDE.md + READMEs + docs/), regenerated counts and benchmarks with machine/commit stamps |

**Contradiction resolutions (named per the mandate):**

1. **`npm ci` behavior** — deploy-docker #10 (P1: "containers resolve stale-but-working lockfile versions") vs fe-build-deps §1.2 (P0: `npm ci` refuses to install anything, EUSAGE, reproduced). **fe-build-deps wins** — empirical; the container gets no library code at all. Severity P0.
2. **Symlink versions** — grand-audit fold/KNOWN INTEL "2.2.0/0.10.0" vs measured 5.1.0/2.0.0 (deferred-ledger, fe-build-deps, fe-glyph-anim). **5.1.0/2.0.0 is reality**; constellation-integration explains the misattribution (2.2.0/0.10.0 are bbnf-buddy's registry pins). M1's target respecified accordingly.
3. **Decorative subtree dead or live?** — fe-components-audit widened the keyframes-breakage blast radius to VineBorder/DoodleAccents (throwaway build) vs fe-build-deps/fe-runtime-perf/fe-architecture proving zero reachable imports from App.vue and roughjs tree-shaken out. **Both true, different trees**: the files are unreachable in the committed graph but break any build that resolves them under the 5.1.0 symlinks. **EXCISE the subtree** (F1) — which also shrinks the keyframes 5.x migration surface to the live files (glyphAnimations.ts, usePathAnimation.ts, HandwrittenGlyph.vue).
4. **`panic="abort"`** — rust-bench-baseline proposed it workspace-wide with an unresolved caveat; sota-rust-perf F2 proves it would mechanically defeat PyO3's panic→PanicException contract (SIGABRT takes down the worker). **sota-rust-perf wins**: split named profiles (§3.1/§6).
5. **Flat `Vec<f64>` = "fast pattern"?** — wasm-morph-totality P2-H vs sota-wasm A3 (read from serde-wasm-bindgen source: no typed-array path; every element boxes). **sota-wasm wins**: the real fast path is `Float64Array` views.
6. **Tracked-file counts** — 17,637 (git-archaeology) vs 11,406 (deploy-docker). Resolved above: 11,406; the larger figure double-counts nested `*/dist` under node_modules.
7. **Python test count** — 21 (python-tests-legacy, pytest-collected; matches `08c339b`'s own commit message) vs git-archaeology's "12 def test_". **21** — prefer collection over grep.
8. **M4 sun trigger** — deferred-ledger "not fired" vs constellation-integration "primitive-level trigger fired." Resolved in §4: M2 ships unconditionally in the pencil-boil train; `useCelestialSun()` (composable, NOT a `<PencilSun>` SFC — fe-csp-decoupling F5, package is renderless by design) ships in the same train gated on the bbnf-buddy component-tree read.
9. **Bundle size** — 164 kB (fe-build-deps, full tracked build) vs 73 kB (fe-runtime-perf, shim build). Not a conflict; record both, neither is the problem.

---

## 3. Architectural transposition spec

### 3.1 Rust solver kernel

**One search kernel.** `backtrack.rs`/`backjump.rs`/`optimize.rs` triplicate one tree search (~820 lines: identical pruning-dispatch blocks, validity/restore loops, three per-solve `*Config` structs — rust-cop-builder, byte-verified). Transpose to a single generic kernel parameterized by `(backjumping: bool, bound_pruning: Option<CostEval>, maximize: bool, stop: StopCondition)` over the existing `SearchContext`. This subsumes deferred item S3 (unified constraint trait) partially and is the substrate every SOTA adoption lands on. `lib.rs` (532 L) decomposes below the 500 ceiling in the same motion.

**Search control (SOTA adoptions, §6):** dynamic conflict weights (CHS/ERWA) threaded mutably through `SearchContext` (kills the frozen-weights clone, sota-csp F7); `Ordering::Chs`; Luby restarts + last-value phase memory; `NogoodStore` wired as restart nogoods; `SolveConfig::default()` → AC3+DomWdeg; wall-clock `time_budget` alongside `node_budget`, with a cooperative cancellation flag checked at the same cadence (serves the service timeout AND wasm's `node_budget_ms`); `BudgetExceeded` as a first-class outcome distinct from `Infeasible` everywhere (core, builder, py, wasm).

**State/allocation:** trail of touched `(depth, VarId)` replacing the O(num_vars) restore sweep; `restrict_to` via in-place bitset masking; `Domain::iter` gains the `use<>` precise-capture bound and all 5 collect sites drop their Vecs (proven fix); `BitsetWorklist` moves into `SearchContext` as reusable scratch; extract the shared `trailing_zeros`+clear-lowest-bit word-scan primitive used by both `BitsetIter` and the worklist (basis for any future const-generic `WordBitsetDomain<N>` widening — no widening this tranche; no consumer needs >128).

**Constraint layer:** `Constraint<D>: Debug + Send + Sync` and `CheckerFn` +Send+Sync (verified additive — every current closure captures Copy primitives; hard prerequisite for GIL release); EXCISE Lambda/Cardinality; box the rare heavy variants so `ConstraintEnum` stops being 72 B for 8–32 B of payload; support-cached (or change-mask) default `revise()` replacing the 5-Vec/O(Di×Dj) naive default; event-lite propagation (change-mask `Revision` + GAC scheduled below cheap propagators) sequenced LAST per sota-csp — it touches the trait contract and also improves the BBNF sweep.

**GAC unification + incrementalization:** collapse `gac_alldiff.rs`/`gac_alldiff_except.rs` into one sentinel-generic core (`Option<&D::Value>` except-parameter); cache the Régin matching per constraint and repair incrementally on revise instead of rebuilding matching+SCC from scratch (the measured 1.8 M× gap); flat CSR/arena scratch reused per call (the `adjacency.rs` pattern) instead of a dozen nested Vecs; HashMap/bitset value-index instead of O(n_vals) linear scans; THEN wire GAC into `AllDifferent::revise_impl` behind a dynamic live-unassigned-count gate. The pre-split monolith's exclusion rationale ("AC-3 invokes revise thousands of times") was correct against the from-scratch implementation and is obsoleted by incrementalization — the benchmark in prototype 2 is the arbiter. Docs stop lying either way.

**Build:** workspace `[profile.release]` `lto="fat"`, `codegen-units=1`, `strip="symbols"`, `panic="unwind"` (PyO3 contract); `[profile.native-release] inherits="release", panic="abort"` for benches/examples; wasm targets keep `-Oz` (abort is inherent on wasm32); `mimalloc` global allocator for native+PyO3 only; PGO for the Docker backend binary only (trained on the existing bench corpus); pin the nightly toolchain + commit `Cargo.lock`; cargo-chef/BuildKit cache mounts in the api Dockerfile.

### 3.2 Service boundary / DI

**Sequence zero (unblocks everything):** the one-line `budget_exceeded: s.budget_exceeded` at `py.rs:237`, plus the `cargo check --features py` CI gate that makes recurrence impossible.

**GIL liberation:** with Send bounds landed, wrap every compute entry point (`Csp::solve/solve_with_given/propagate/propagate_with`, `solve_sudoku`, `create_random_board`) in `py.allow_threads`; thread the cooperative cancellation flag from `solver_timeout_s` so a 408 actually stops the search instead of orphaning a GIL-holding zombie.

**Boundary shape:** collapse the two-call solve to one `solve_sudoku(values, size, config) -> solution` entry; dense ordinal `Vec<u32>` at the FFI regardless of the outer JSON contract (the string-keyed dict reshaping, if the wire keeps it, lives in a thin Python shim); typed exceptions (`Unsatisfiable`, `BudgetExceeded`) via `create_exception!`; expose `optimization_mode`; VarId bounds-checks and finalize-before-solve as explicit errors.

**Service architecture (fastapi-service §3, adopted):** `pydantic_settings.Settings` via `Depends()` (CORS list validated/stripped, `solver_timeout_s`, `data_dir`, executor sizes); explicit, deliberately-sized ThreadPoolExecutors (separate pools for cheap `/random` vs expensive `/solve`); thin router + injected `SudokuService`; `/random` gains the timeout wrapper it currently lacks entirely; rate limits actually applied; error taxonomy — one `CspError` family → distinct Python exceptions → one JSON error envelope → typed frontend `ApiError`, preserving 400/404/408/422/429/500 distinctions end-to-end; `Difficulty` canonicalized on the Rust enum with generated or contract-tested mirrors (5 independent definitions today — api-surface-consistency); the shared timeout constant exported once, consumed by the client AbortSignal.

**Puzzle-data ownership (rust-puzzles' inversion, adopted):** templates move into `csp-solver` (compile-time `include_dir!` embed into the PyO3 module, or Docker-stage copy); a Rust example/binary calling the existing `generate.rs` logic replaces the dead Python generator; the orphaned solution bank dies; N=5 gets a decision — pregenerate templates + node/time budget, or reject `size=5` at the API until measured (sota-sudoku: zero data exists at the only size that's unbounded).

**Deploy decision (deploy-docker §12, extended):** the committed architecture and the live reality have diverged completely; pick one, don't half-do both —
- **Option A — static frontend + small always-on API origin** (formalizes what's live; lower effort; CF Pages + one Fly/Render-class box running the existing api Dockerfile; kill the dangling CNAME; commit real env defaults).
- **Option B — recommit to docker-compose+nginx** (fresh host; committed babb.dev defaults; security headers; collapse the double-nginx hop).
- **Option C (new, this synthesis) — client-side wasm solve**: the frontend consumes `csp-solver-wasm`'s currently-zero-consumer sudoku surface; the demo becomes fully static; GIL/Docker/timeout/DoS/api-DNS problems vanish for the product's actual served sizes (UI ceiling is 16×16 — `VALID_SIZES=[2,3,4]`, fe-runtime-perf); FastAPI remains as reference implementation or is retired. Prototype 6 de-risks this; it composes with Option A (static hosting is common to both).
Non-negotiable regardless of option: G1 git hygiene, G2 scripts, G3 CI, G5 DNS remediation, M5b security headers.

### 3.3 Frontend module topology + pencil/CSP decoupling

**Adopt fe-architecture §4 verbatim** (independently re-derived by fe-csp-decoupling in three-way vocabulary): two layers under `src/` — `sudoku/` (domain: SudokuBoard/, ControlPanel/ + colocated constants, useSudoku/useApi/useUrlState) and `skin/` (grid/, glyph/, chrome/ incl. extracted `BoilDivider.vue`, decorative/, dev/FilterTuner env-gated, composables, config/pencilConfig, types) — with `@sudoku/*`/`@skin/*` aliases and an ESLint `import/no-restricted-paths` rule making the already-true one-way dependency structural. `AnimationState` stays the single contract type, exported from skin. The `OptionSelector` erased-props idiom (`{value,label,colorClass}[]`, never `Difficulty`) is the boundary spec for every new edge; the two avoidable bridges (SudokuBoard, ControlPanel) shed their inline skin subsystems. Only 6 of 34 files touch domain types today — the split is mostly mechanical.

**Composable/state layer (fe-composables-state, adopted):** `Difficulty`/`SolveState` move to a neutral types module (kills the two-edge import cycle); one singleton mechanism (`createGlobalState`) replaces the three competing patterns; vueuse replaces the four hand-rolled duplicates; error/timeout states get rendered UI (with the typed ApiError from §3.2).

**Animation gestalt (the perf half of the skin):**
1. **keyframes.js 5.x migration** (M1, now a migration, not hygiene): target `^5.1.0`/value.js `^1.2.0-2.0.0` per fe-build-deps §1.5 ("don't re-book the same mandate a third time"); source migration (`loadAnimationEngine()`/engine subpath) and the lockfile heal land in the SAME commit; dead decorative subtree excised first to shrink the surface; `manualChunks` gains an animation-vendor bucket after.
2. **One scheduler.** Fold SvgFilters' 3 setIntervals and the per-glyph wiggle swarm into the pencil-boil singleton rAF (frame-index scheduler; keyframes.js 5.x `AnimationGroup`/`Oscillator` for the batched draw-in/wiggle orchestration). A solved 16×16 board runs 1 rAF chain, not ~144–256. PRM-reactive and visibility-paused uniformly.
3. **Decouple the grain.** `grain-static` moves off the boil-cycling `<g>` onto a non-animating overlay (or pre-rasterized `<feImage>` texture); per-glyph feTurbulence instances collapse to shared filters. The wobble presets stay within their documented small-area envelope — the aesthetic is untouched, only the invalidation topology changes.
4. **Glyph correctness:** build-time derived path lengths (killing the 11.4%-avg hand-authored drift), dasharray reset on draw-in completion, no direct-DOM `d` writes on template-bound attributes.
5. **A11y (fe-components-audit):** ARIA grid semantics + non-visual cell-state encoding on the board; `aria-level`/real `<h1>`; radiogroup semantics on size/difficulty; focus-visible tooltips; fix AttributionCard's interactive-in-interactive nesting; collapse the `isGiven/isOverridden/isSolved` passthrough into one discriminated `cellKind` prop.

**pencil-boil release train (external repo, one coordinated release):** M2 reactive-PRM teardown (own changeset — chronic across 3 lib releases); public `usePrefersReducedMotion()` export (retires 4 in-repo reimplementations); `useBoilFrames()` frame-cache primitive (promotes gridPaths' cache discipline; celestial boil currently regenerates uncached every tick); scheduler hooks for the filter-param ticking; `useCelestialSun()` composable (gated per §4); celestial.ts proof coverage before any 1.0. Sudoku bumps `^0.2.0`→`^0.4.1+` (M1c) to receive it all.

### 3.4 Wasm + morph stack

**csp-solver-wasm:** fate of the isomorphic mirror is prototype 6's output — product surface (Option C: re-keyed flat-index wire, typed-array views, size budget) or feature-gated/deleted (bbnf-buddy drops `initCspSolver`). Either way: untrack `pkg/`, delete both Makefiles' `.gitignore`-strip lines, `wasm-pack test --node` + clippy-wasm32 + twiggy size budget in CI, `node_budget_ms` fail-explicit (backed by the core wall-clock budget).

**morph-core/wasm-morph:** decompose `align.rs` (512 L) into tier1-topology / tier2-csp-orchestration / geometry-pipeline modules; **lazy cost matrix** — cheap topology+centroid score for the O(n²) matrix, full geometry pipeline only for the chosen pairs, centroids memoized (kills the ~4n² recompute); make the scratch arena real (it's aspirational — ~10 Vecs/call/pair); `Float64Array`-view wire format in one pass across `wire.rs` AND `assignment.rs`; wire correspondence hints end-to-end (wire.rs field + bbnf-buddy runtime.ts pass-through + `@mkbabb/morph` republish); fix+test Procrustes Step 7; EXCISE NEXT_ID/dead-pub/wire-duplication; per-crate CHANGELOGs; `AssignmentBuilder::cost_matrix(Vec<f64>)` move-in setter replacing the closure-indirection API (twiggy shows the indirect-call table costing more than solveAssignmentCop's own code).

**bbnf-lang seam:** the vendored `crates/csp-solver` copy (byte-identical at pin `b700986`) gets a CI sync/diff gate script as the closing step of any core refactor; the repo split both sides independently recommend stays booked (§4). Root CLAUDE.md's ".cargo/config.toml patch" claim dies in the docs pass.

---

## 4. Deferred fold-in

Everything open, folded into this tranche with owners. "Chronic" = deferred across ≥2 passes (deferred-ledger's marking, preserved).

| ID | Item | Status at this pass | Fold-in disposition | Owner | Sev |
|---|---|---|---|---|---|
| M1 | keyframes.js spec+lock | UNSHIPPED, chronic, worsened to a 3-major migration; now a proven build-breaker | Execute as prototype 8 — target `^5.1.0`, source migration + lockfile heal + G1 in one sequence | sudoku frontend | **P0** ↑ |
| M1b | value.js spec+lock | UNSHIPPED, chronic, worsened | Same commit as M1; drop the direct dep (transitive-only) | sudoku frontend | **P1** |
| M1c | pencil-boil `^0.2.0`→`^0.4.1+` (new, deferred-ledger) | Consumer can't reach the boil-guard fix | Bump with M1; prerequisite for the release-train pickup | sudoku frontend | **P2** |
| M2 | pencil-boil reactive-PRM teardown | CHRONIC — 3 lib releases shipped, none was this; the proof harness already mocks the listener the impl never registers | Own changeset in the release train; NOT bundled/gated with M4 | pencil-boil maintainer | **P2** |
| M3 | controls-LEFT reconsideration | Settled/exempt (hand-drawn paper convention) | None — re-record exemption | — | — |
| M4 | orange-sun lift | Booked; trigger dispute resolved (§2 resolution 8); M4's own premise corrected — the "spiral generator" is a static path; real lift surface is the ~37-line orchestration block | `useCelestialSun()` composable (not SFC) in the release train, gated on the bbnf-buddy component read | pencil-boil maintainer | **P2** |
| M4b | pencil-boil version roadmap | Substantially discharged at lib (CHANGELOG/changesets/CI, 0.4.1) | Residual = M1c + the fe-csp-decoupling §6 roadmap (0.5.0 sun+PRM, 0.6.0 public PRM export, celestial tests pre-1.0) | pencil-boil maintainer | **P3** |
| M5 | babb.dev DNS tuple | VERIFIED and ESCALATED — live site static-only, `/api/*` dead, api-host dangling (takeover shape) | Superseded by the §3.2 deploy decision (A/B/C); DNS remediation needs Cloudflare account access — explicitly outside repo-file scope | deploy + account owner | **P0** ↑ |
| M5b | CSP/HSTS/X-Frame headers | Confirmed absent at both nginx layers | Land with whichever deploy option wins | deploy | **P2** |
| S1 | TieredCostEval | Healthy deferral, trigger unfired | Keep booked | csp-solver | P3 |
| S2 | solve_with_warm_start | Healthy, trigger unfired | Keep booked | csp-solver | P3 |
| S3 | Unified Constraint trait | Healthy | Partially subsumed by the single-kernel transposition; re-scope after | csp-solver | P3 |
| S4 | tracing spans | Healthy | Keep booked | csp-solver | P3 |
| N1 (new) | node_budget/budget_exceeded half-migration (`cff0e7b`) | Broken at py.rs:237 for 29 commits | Complete NOW (sequence zero) + CI gate | csp-solver | **P0** |
| N2 (new) | Dynamic dom/wdeg — stalled in-progress scaffolding (weights present, frozen) | sota-csp F1; git-archaeology finds no evidence it was ever live | Wire (prototype 3) | csp-solver | **P1** |
| N3 (new) | NogoodStore — abandoned scaffolding | sota-csp F2 | Wire-or-excise (prototype 3) | csp-solver | **P1** |
| N4 (new) | GAC-into-AllDifferent — deliberately excluded, rationale silently dropped from docs | rust-gac | Re-decide with benchmark after incrementalization (prototype 2) | csp-solver | **P1** |
| N5 (new) | isomorphic.rs + solveAssignmentCop — abandoned-in-progress feature (wired `bf58913`/`2f9fe12`, superseded by morph-core's native path) | sota-wasm F1 | Decide via prototype 6 | wasm + bbnf-buddy owner | **P1** |
| N6 (new) | min_conflicts — implemented, tested, never wired | rust-cop-builder | EXCISE unless adopted as explicit strategy (open question 4) | csp-solver | P2 |
| N7 (new) | Futoshiki — fully implemented+tested, zero product surface, falsely advertised | rust-puzzles | Fix the advertisement now; book the surface (trigger: product decision) | api+frontend | P2 |
| N8 (new) | N=5 (25×25) — no templates, no timing data, unbounded generation path | rust-puzzles, sota-sudoku | Decide in prototype 13 (pregenerate+budget vs reject) | csp-solver+api | **P1** |
| N9 (new) | bbnf-lang vendor sync gate + repo split | constellation-integration; bbnf-lang's own audit concurs | Sync-gate script this tranche; split stays booked | cross-repo | P2 |
| N10 (new) | grain-static hoist + glyph-scheduler batching | sota-svg-anim-perf F1/F2 (new items, not in the prior fold) | Prototypes 9/10 | sudoku frontend | **P1** |
| N11 (new) | Wall-clock time budget in SolveConfig | rust-cop-builder; wasm's node_budget_ms waits on it | Kernel spec §3.1 | csp-solver | **P1** |

---

## 5. Prompt-recap coverage matrix

Consolidated from git-archaeology §2, statuses updated by this pass's findings.

| # | Mandate | Source | Status after Pass 1 |
|---|---|---|---|
| R1 | Port solver Python→Rust, isomorphic API | `ba6488a`,`2716a54` | **ADDRESSED** — but the py binding no longer compiles (N1) and the "isomorphic to Python" docstrings now reference a deleted solver |
| R2 | Devirtualize constraint dispatch | `0d43ed5` | **ADDRESSED — with rot**: the devirtualized enum's Lambda variant is unreachable and Custom (boxed dyn) is the dominant real path (rust-constraint) — the design premise inverted |
| R3 | No god modules (>500 L) | precept | **PARTIAL** — 3 violations stand: `isomorphic.rs` 632, `lib.rs` 532, `align.rs` 512; all three have decomposition specs in §3 |
| R4 | No test files in src/ | precept, `4322715` | **ADDRESSED** (Rust) |
| R5 | Delete legacy Python solver | `08c339b` | **ADDRESSED (code) / FAILED (docs)** — zero code remnants; docs still describe it 3 months on |
| R6 | web/ restructure | `97cce73` | **ADDRESSED (code) / FAILED (fallout)** — .gitignore, CLAUDE.md commands, dev.sh, CI paths all still pre-restructure; direct cause of G1/G2 |
| R7 | Fail explicitly, no silent handling | precept | **REGRESSED** — the §2 ledger enumerates ~40 live violations across all layers |
| R8 | Decouple pencil UI from CSP domain | precept | **PARTIAL → SPEC'D** — one-way property already true by import graph; §3.3 makes it structural |
| R9 | PRM across all animation loops | precept + M2 | **PARTIAL** — 4 loops covered; the M2 residual is chronic AND independently reimplemented (SvgFilters), so a lib-only fix is insufficient — scheduler unification closes it |
| R10 | Shared skin → pencil-boil, never glass-ui | guardrail + M4 | **ADDRESSED (posture)** — zero glass-ui asks confirmed again; mascot lift folded per §4 |
| R11 | COP support | `77156b7` | **ADDRESSED — with defects**: budget/Infeasible conflation (R8 ledger), dead Cardinality, zero production COP callers outside morph |
| R12 | wasm bindings solver+morph | `910b620`,`9a66370` | **ADDRESSED — surface unconsumed**: the solver mirror has zero consumers; morph's binding misses the hint field its consumer sends |
| R13 | Publish to @mkbabb suite | `aef9eae` | **ADDRESSED** — with release-mode aliasing bug (R7 ledger) shipped in both published artifacts |
| M1/M1b | Dep spec bumps | grand-audit SHIP | **UNADDRESSED ×2 passes → escalated P0**, respecified (§4) |
| M2 | PRM teardown | grand-audit SHIP | **UNADDRESSED ×2 passes** (chronic), lib shipped 3 unrelated releases |
| M3 | Controls-LEFT | grand-audit KILL | **SETTLED** |
| M4/M4b | Sun mascot / roadmap | grand-audit BOOK | **BOOKED → folded** (§4); M4b substantially discharged at lib |
| M5/M5b | DNS tuple / headers | grand-audit BOOK | **VERIFIED + ESCALATED P0** — worse than the fold suspected (static-only prod, dangling api host) |
| D1 | Docs isomorphic with code | MEMORY.md | **FAILED** — opposite-direction count drift (Rust 83→140 undercounted, Python 107→21 counting ghosts), phantom components, false GAC/maturin claims |
| D2 | Root CLAUDE.md reflects web/ layout | implied | **PARTIAL** — command blocks still `cd python`/`cd frontend` |
| G1 | No build artifacts tracked | .gitignore intent | **FAILED** — 11,406 files; root-caused, fix spec'd |
| C1 | Deferred extensions documented | `69d7330` | **ADDRESSED** — S1–S4 healthy |
| C2 | CHANGELOG coverage | — | **PARTIAL** — morph-core + wasm-morph lack CHANGELOGs; COP wave unlogged |

---

## 6. SOTA adoption matrix

Verdicts tied to OUR three workloads: sudoku demo (9×9–16×16 served; 25×25 nominal), BBNF lattice propagation (grow-only, backtrack-free, vendored consumer), bbnf-buddy morph (glyph-scale assignment + geometry).

### CP/CSP core (sota-csp: 4 ADOPT · 4 ADAPT · 6 REJECT)

| Technique | Verdict | Why, for our workloads |
|---|---|---|
| Conflict-history weighting (CHS/dynamic wdeg) | **ADOPT** (P1) | Scaffolding exists frozen; highest win-per-line; search-only, zero BBNF-lattice impact |
| Luby restarts + phase saving | **ADOPT** (P2) | Cure for the measured heavy tail (7.6 s FC+Chrono pathology); only meaningful atop CHS — sequence together |
| Restart nogoods (nld-nogoods) | **ADAPT** | NogoodStore already correct+tested; needs producer (restart) + consumer (branch guard) — wire or excise |
| Event-lite propagation (change-mask + propagator priority) | **ADAPT** | Right-sized vs full event model; also improves the BBNF sweep; touches the trait contract — last |
| Value ordering (last-value phase memory) | **ADAPT** | Light form only; composes with restarts |
| Trail restoration (keep trailing, fix the sweep) | **ADAPT** | O(touched) trail; REJECT copying/recomputation at this scale |
| Shaving/SAC presolve | **ADAPT (light, benchmark-gated)** | Only if initial AC-3 leaves fat domains on hard instances |
| ABS/IBS | REJECT | CHS dominates on the evidence; cheaper signal already produced |
| LDS/ILDS | REJECT | Presupposes a value heuristic we lack; restarts cover the diversification need |
| Compact-Table / watched literals | REJECT (until a Table/Regular constraint exists — the ADOPT answer if BBNF regex-class membership ever needs one) |
| Full LCG/Chuffed | REJECT | A ground-up architecture; if ever needed, call CP-SAT/Chuffed, don't reimplement |
| Sparse-set domains | REJECT | u128 bitset is strictly better at |D|≤128; our cap forecloses the win |
| LNS / portfolio | REJECT ×2 | Satisfaction workload with unique solutions; parallelism lives at the request level |

### Rust performance engineering (sota-rust-perf)

| Technique | Verdict | Notes |
|---|---|---|
| `[profile.release]` lto=fat/cu=1/strip | **ADOPT** | Unconditionally safe workspace-wide |
| `panic="abort"` | **ADAPT — split profiles only** | Root stays unwind (PyO3 contract, live unwraps on the solve path); `native-release` gets abort; wasm inherently aborts |
| mimalloc/jemalloc global allocator | **ADOPT (native+PyO3 only)** | Compounds with the collect-removal fix; not applicable to wasm32 |
| `target-cpu` | **ADAPT** | Docker builder stage only; never in published crate/wheel/npm artifacts (SIGILL risk) |
| PGO (cargo-pgo) | **ADAPT** | Docker backend binary only — fixed training corpus already in-repo; not crates.io/wheel/wasm (unsupported on wasm32) |
| BOLT | REJECT (defer) | Interpreter+extension image BOLT is fragile; re-measure after PGO |
| portable_simd / SIMD | REJECT | No batched independent-domain op anywhere; scalar TZCNT+BLSR loop already at the scalar ceiling |
| Const-generic domains (`WordBitsetDomain<N>`) | **ADAPT (scoped, deferred)** | Correct widening shape when a >128 consumer appears; worklist stays runtime-sized (SmallVec-style at most) |
| iai-callgrind CI regression gate | **ADOPT** | Deterministic instruction counts where criterion is CI-noise-bound; criterion stays for local statistics |

### Wasm (sota-wasm)

| Technique | Verdict | Notes |
|---|---|---|
| Typed-array views (Float64Array/Int32Array) for bulk numerics | **ADOPT/ADAPT** | The genuine fast path; one pass across morph wire.rs + assignment.rs; gated on which surfaces survive N5 |
| twiggy size profiling + CI size budget | **ADOPT** | Would have caught 90.8 KB of dead exports at accretion time |
| JSON-string round-trip instead of serde-wasm-bindgen | REJECT | Wrong payload shape (small, structured) |
| SIMD128 | REJECT | Data too small to amortize; the u128-bitset surface that could use it is the dead mirror |
| Allocator swap (talc; wee_alloc archived) | REJECT | dlmalloc default correct; boundary cost dominates |
| wasm-opt per-module split (-O3 kernel/-Oz glue) | ADAPT (only after the crate split) |
| Threads/SharedArrayBuffer | REJECT | Nightly-only, COOP/COEP deploy surface, no parallel batch exists |
| Component Model/WASI p2/jco | REJECT | Single-language Rust→JS boundary is wasm-bindgen's designed niche |

### Sudoku domain (sota-sudoku)

| Technique | Verdict | Notes |
|---|---|---|
| DLX/exact-cover or tdoku-class specialized solver | REJECT | Generalized Csp&lt;D&gt; validated by Futoshiki+BBNF+COP reuse; uniqueness-check lever is propagation strength, not an algorithm fork |
| Régin GAC on Sudoku's AllDifferent | **ADOPT** | The gap between "Pruning::Ac3" as advertised and forward-checking as delivered; via prototype 2 |
| Symmetry-transform generation | KEEP | Exactly reproduces the published Jarvis-Russell group (order 3,359,232 × 9!) — validated strength |
| Technique-based difficulty rating (SE/HoDoKu-style) over clue-count proxy | **ADAPT** | Current live path silently discards difficulty (R13); rating rework rides the puzzle-data prototype |
| 25×25 support | **ADAPT-or-bound** | Zero data at the only unbounded size; prototype 13 decides |

### SVG animation (sota-svg-anim-perf: 3 keep · 4 ADAPT · 5 REJECT)

| Technique | Verdict | Notes |
|---|---|---|
| Pre-computed frame path-swap boil @ ~6.7 fps, singleton rAF, visibility+PRM gates | KEEP | Already SOTA-correct (pencil-boil pattern) |
| Hoist grain-static off the animating group | **ADAPT (P1)** | The single highest-leverage frontend fix; aesthetic-identical |
| Shared frame-index scheduler for glyph wiggle | **ADAPT (P1)** | Kills up to ~144–256 independent rAF chains |
| Filter ticks setInterval→shared rAF | **ADAPT (P2)** | Third scheduling discipline unified; gains PRM+visibility |
| `will-change` layer promotion | **ADAPT — measure, don't assume** | Cheap; whether it moves Chromium onto the GPU filter path is unverified (no live browser this pass) |
| `<use>`/`<symbol>` instancing for animation | REJECT (DOM-weight case handed off separately) |
| SMIL | REJECT (already correctly avoided) |
| Canvas/OffscreenCanvas grid | REJECT — few-object/large-surface scene favors retained SVG |
| CSS Paint API (Houdini) | REJECT — no pixel-warp primitive, partial support |
| `@property`-animated turbulence | REJECT this tranche — moves scheduling, not the CPU raster cost |

---

## 7. Prototype candidates for Pass 2

Fourteen candidates for the prototyping fleet. Method key: **GF** = greenfield prototype (scratch crate/branch, throwaway); **PAS** = prototype-augmented spec (fix already partially proven; prototype validates the full shape).

| # | Name | Hypothesis | Method | Success metric |
|---|---|---|---|---|
| 1 | `unified-search-kernel` | One generic kernel replaces backtrack/backjump/optimize (~820→~300 L) with zero behavior change | GF (scratch crate, path-dep on csp-solver) | All 140 tests pass; criterion parity ±5% on sudoku/queens/assignment; 3 Config structs → 1 |
| 2 | `gac-regin-incremental` | Cached-matching Régin + arena scratch + sentinel-generic unification makes GAC cheap enough to wire into AllDifferent; AssignmentBuilder stops being 1.8 M× off Hungarian | GF | ≥100× wall-clock drop on the 10×10 AssignmentBuilder probe (baseline 2.25 s); 16×16 hard-sudoku nodes drop materially with 9×9 within noise; duplication 224 L → 0 |
| 3 | `chs-restarts-nogoods` | Dynamic CHS weights + Luby restarts + phase memory + wired NogoodStore eliminate the heavy tail; worst-config solves bounded | GF | Al Escargot under FC+Chrono-class configs ≤ 100 ms (vs 7.6 s); nodes_explored down on the 5-puzzle corpus; NogoodStore leaves half-state (wired or deleted) |
| 4 | `zero-alloc-hot-path` | `use<>` iter capture + collect removal + touched-var trail + worklist reuse + in-place restrict_to compound to a measurable node-throughput win | PAS (16–39% alloc cut already proven for the iter half) | Allocation counts reproduce; ≥10% wall-clock on 16×16; identical solve outputs |
| 5 | `pyo3-liberation` | budget_exceeded fix + Send/Sync bounds + allow_threads + cooperative cancel + single-call API restore build, liveness, and real timeout semantics | PAS (one-line fix verified; Send-bound additivity verified) | `cargo check --features py` green from HEAD; GIL heartbeat keeps ticking during a 5 s solve; 1.0 s wait_for fires at ~1.0 s; 4 concurrent solves don't freeze /health; Docker wheel builds |
| 6 | `client-wasm-solve` | The frontend can solve+generate entirely in-browser via csp-solver-wasm's (currently dead) sudoku surface, making the demo fully static and deciding isomorphic.rs's fate | GF | 9×9/16×16 solve+generate parity with the two API routes; flat-index wire (no string keys); wasm ≤ ~300 KB; UI latency ≤ current API round-trip |
| 7 | `release-profile-pgo` | Split profiles + mimalloc + Docker-stage PGO yield ≥10–25% on the bench corpus without breaking the PyO3 panic contract | PAS | Criterion delta on the 5-puzzle corpus; PanicException still catchable from Python; wasm size unchanged or better |
| 8 | `keyframes5-migration` | M1/M1b/M1c + `loadAnimationEngine` source migration + dead-decorative excision + lockfile heal restore every build path | PAS (break surface fully inventoried) | `npm ci --dry-run` green; `vue-tsc` green; `vite build` green under registry deps AND symlinks; visual parity on draw-in/wiggle |
| 9 | `grain-static-overlay` | Moving grain to a non-animating overlay (+ shared glyph filters) removes the full-board re-raster from every boil tick | GF (branch + Chrome trace) | ≥50% drop in per-tick raster/paint time at 16×16 in a recorded trace; pixel-diff of a static frame ≈ identical |
| 10 | `unified-boil-scheduler` | One pencil-boil rAF singleton can drive path boil + filter params + batched glyph wiggle, PRM-reactive | GF (spans pencil-boil release train) | 1 rAF chain on a solved 16×16 (baseline ~144–256); mid-session PRM flip halts all motion; background tab → zero ticks |
| 11 | `two-layer-frontend` | The §3.3 sudoku/skin topology is a mechanical move with an enforceable boundary | PAS | Zero `@sudoku/*` imports under `src/skin/**` enforced by lint; build+behavior identical; ControlPanel sheds the divider subsystem |
| 12 | `morph-lazy-cost` | Cheap-score matrix + centroid memoization + real arena give ≥4× alignment speedup at glyph scale | GF | ≥4× wall-clock on representative bbnf-buddy glyph pairs; per-pair allocs ~10 → ≤2; identical pair selection |
| 13 | `rust-owned-puzzle-data` | A Rust generator binary + embedded templates replace the dead Python pipeline; N=5 gets measured and decided | GF | Template regeneration reproducible from one command; N=5 timing data exists; policy executed (templates+budget or API rejection); orphaned bank deleted |
| 14 | `api-error-taxonomy` | One CspError family + canonical Difficulty (codegen or contract-tested) survive all four layers without drift | PAS | 5 Difficulty definitions → 1 source + parity test; 400/404/408/422/429/500 distinguishable in a typed frontend ApiError; py.rs/wasm mirrors contract-tested against the Rust enum |

Sequencing spine: 5 and 8 unblock everything (builds); 1→2→3→4 stack on the kernel; 6 gates the deploy fork and W1; 9/10/11 are independent frontend tracks; 12/13/14 are independent.

---

## 8. Open questions + convergence

1. **Deploy topology fork (A/B/C)** — the biggest unresolved decision. Production is already static-only; Option C (client-wasm) composes with A and would retire the GIL/DoS/DNS class entirely for the served sizes, but demotes the FastAPI+PyO3 stack to reference status. Needs: prototype 6 results + the owner's intent for the coursework-vs-portfolio identity of the service. **Blocks**: W1/N5 disposition, M5 remediation shape, how much of §3.2 ships.
2. **Cloudflare/registrar access** — the dangling `api.csp-solver.babb.dev` record can't be remediated from the repo; account-level action, security-review recommended (deploy-docker handoff).
3. **FastAPI's continued surface if C wins** — keep `/solve` as the reference implementation with the §3.2 hardening, or archive it? (25×25, if kept, is the one size that genuinely wants a server.)
4. **min_conflicts** — EXCISE per precept, or revive as an explicit, caller-selected strategy? Default EXCISE unless prototype 3's restart work finds a principled slot.
5. **Futoshiki** — product surface (route + frontend) or Rust-only showcase? Advertisement fix is unconditional; the surface needs a product decision.
6. **N=5** — pregenerate+budget vs reject. Prototype 13 supplies the missing data; the precept-clean answer if generation can't be bounded is rejection.
7. **Difficulty canonicalization mechanism** — strum-style codegen vs contract tests (api-surface-consistency left it open; prototype 14 resolves empirically).
8. **BitsetDomain >128 widening** — no in-constellation consumer needs it; BBNF's CharSet128 question is explicitly deferred to bbnf-lang's own domain owner. Keep deferred?
9. **Cross-repo release train sequencing** — pencil-boil (M2/M4/scheduler hooks), @mkbabb/morph (hints + typed arrays), keyframes.js (consumer-driven only), bbnf-buddy edits: one coordinated window or independent ships? Single-maintainer constellation argues for one window aligned with prototypes 8/10/12.
10. **bbnf-lang repo split** — sync-gate script this tranche is settled; the split itself (both repos' audits recommend) is a larger motion — this tranche or next?
11. **will-change GPU-path hypothesis** — unverified (no live browser reachable in Pass 1); prototype 9's trace should test it incidentally.
12. **Wasm profile inheritance** — whether wasm-pack builds pick up named profiles cleanly, so the 4.0% lto win lands without coupling regressions (wasm beat to confirm during prototype 7).
13. **Docs rewrite timing** — after code lands (single pass, no re-staleness) is the working assumption; confirm no interim consumer needs corrected docs sooner.

**Convergence: 72%.**
- Settled (~95%): the diagnosis itself — every major claim carries independent reproduction by ≥2 agents with numbers; the excision ledger; the build-restoration sequence (N1, M1); git hygiene; the solver-kernel direction; the SOTA verdict set; the aesthetic guardrail (zero glass-ui, all skin motion routed to pencil-boil).
- Open: the deploy fork (Q1–Q3) is the plan's largest branch point and swings roughly a quarter of §3.2's surface; prototype-gated decisions (GAC wiring threshold, isomorphic.rs fate, N=5) are designed-but-unproven; cross-repo sequencing (Q9–Q10) needs the owner's calendar more than more analysis.
- What raises it: the deploy decision (+10), prototypes 2/3/6 landing their success metrics (+10), cross-repo window confirmed (+5) → ~95% entering the implementation tranche.

---

### Source-report index (Pass-1 inputs)

`undefined/`: rust-domain, rust-puzzles, rust-bench-baseline, pyo3-boundary, wasm-core, deploy-docker, fe-architecture, fe-boil-pipeline, fe-glyph-anim, fe-components-audit, fe-build-deps, fe-runtime-perf, fe-csp-decoupling, docs-accuracy, constellation-integration, sota-rust-perf, sota-sudoku, wasm-core · `docs/audit/pass-1/`: rust-constraint, fastapi-service, python-tests-legacy, wasm-morph-totality, fe-composables-state, git-archaeology, deferred-ledger, api-surface-consistency, sota-csp, sota-wasm, sota-svg-anim-perf · repo root: rust-cop-builder.md · scratchpad: rust-gac.md · prior fold: docs/grand-audit-2026-06-02.md
