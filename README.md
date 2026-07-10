# A Constraint-Satisfaction Solver, with Two Diversions Appended

Herein is set forth a solver of constraint-satisfaction problems, wrought in Rust and furnished with such bindings as permit its employ from Python (by way of PyO3) and from the browser (by way of WebAssembly). Upon this one engine are erected two diversions—Sudoku and Futoshiki—each a mere pleasing application of the selfsame general apparatus.

Let it be understood at the outset: there subsists no solver written in Python. The Rust crate `csp_solver` is the sole engine. The web service does not itself compute; it does but delegate—to the native module where the server presides, or, in the ordinary case, to the aforesaid WebAssembly module borne within a Worker in the visitor's own browser, whither the labour of solving is, by design, removed.

**Demonstration**: [sudoku.babb.dev](https://sudoku.babb.dev)

## Of the Parts and Their Disposition

The repository is a Cargo workspace whose members are two: the engine crate `csp-solver`, and its WebAssembly sibling `csp-solver/wasm`. Adjacent stands the web tier—a Vue 3 frontispiece (`web/frontend/`, in TypeScript, adorned by Tailwind), which solveth within the browser and requireth no service.

Of that which was formerly herein but is now departed: the crates `morph-core` and `wasm-morph` have been excised to a repository of their own, namely [github.com/mkbabb/morph](https://github.com/mkbabb/morph); the state antecedent to their removal is preserved under the tag `pre-morph-excision`. The general `AssignmentBuilder` surface upon which morph was raised abideth here still, and morph doth now consume `csp-solver` as any ordinary dependant would, by the registry. The particulars are recorded in `csp-solver/CHANGELOG.md`.

## Of the Engine

- **`ConstraintEnum`**, a devirtualised enumeration (NotEqual, AllDifferent, Custom), whereof the two common variants inline their revision and their checking, that no vtable trouble the hot path.
- **`BitsetDomain`**, a domain borne upon a `u128`, iterated without allocation by `BitsetIter`, and warded in release by an invariant confining its values to 0..128.
- **Arc consistency (AC-3)** by a bitset worklist; and, for the lattice domains, a monotonic sweep.
- **Generalised arc consistency upon all-different** (after Régin, 1994), computed by Hopcroft-Karp matching and an iterative Tarjan decomposition into strongly-connected components. This is henceforth enabled by default, gated only where the count of live participants attaineth three (`GAC_MIN_PARTICIPANTS`).
- **A unified kernel of backtracking search** (`solver/search.rs`). The conflict-directed backjumping of former days was retired together with the kernel's unification, and the field `SolveConfig::backjumping` is no more.
- **Pruning** after one of four manners: None, ForwardChecking, Ac3 (that is, MAC), or AcFc.
- **Ordering** of variables by one of three: Chronological; FailFirst, which is the minimum-remaining-values rule; and Mrv, which weigheth domain-size against a sum of constraint-weights. Be it noted that those weights lie frozen at unity, wherefore the last is a static heuristic; the elder appellation `DomWdeg` was, upon measurement, adjudged a misnomer.
- The defaults of `SolveConfig` are `Ac3` with `FailFirst`, a single solution sought, and a node budget of one million.
- A typed `CspError` bearing a stable code; a substrate for restart and nogood (though its driver is deferred); and, upon `SolveConfig`, the appurtenances `cancel`, `node_budget`, and `optimization_mode`.

### Wherein a Former Account Is Corrected

It was hereinbefore asserted that generalised arc consistency ran upon Sudoku; yet in truth it ran only at the strength of forward checking, the n-ary propagator being gated shut. It now runneth at its proper strength, and by default. Moreover the causal account rendered in the first audit hath been inverted: that quickening of the assignment builder once laid to the charge of GAC's incrementalisation proved, upon profiling, to owe nothing to GAC—which was invoked not once—but everything to the builder's rewiring from `Pruning::AcFc` to `Ac3`. The whole of the lever is that one swap of strategy (a matter of some two thousand six hundred and seventy fold); the incrementalisation contributeth but a secondary betterment of one-and-a-fifth to one-and-three-fifths (see `docs/`, and the campaign's `evidence/synthesis-pass2.md`, §D1).

### Of the Bindings for Python

Under the feature `py`, in `csp-solver/src/py/`, is compiled the module `csp_solver`, exposing `Csp`, `SolveConfig`, `SolveStats`, the enumerations of pruning and ordering, the constructors for Sudoku and Futoshiki, and four typed exceptions that mirror `CspError::code()` faithfully. It is builded by `maturin`.

### Of the Concord with bbnf-lang

This repository is the fount and source of truth for the solver. The grammar-compiler `bbnf-lang` doth not patch it in by configuration—that account is dead—but vendoreth a byte-identical copy, pinned at a revision, and keepeth it honest by a two-fold gate (`scripts/sync-csp-solver-vendor.sh`, resident in that other repository). The first part, `--check`, is a gate of provenance, diffing the vendored source against `git show <pin>:csp-solver/src` and failing upon any drift of a single byte. The second, `--verify`, enforceth compilation: it buildeth the root crates and the skinny `passes` crate and the vendored crate under both its configurations, `default` and `py` alike, and setteth tripwires upon the trait surface and upon any addition of a field to `SolveConfig` or `SolveStats`. The hook before pushing runneth both. By these passes bbnf performeth six analyses over lattice domains—the inference of types, the FIRST and FOLLOW sets, the eligibility of spans, the tables of dispatch, and the algebra of regexes—each by `propagate()` without `finalize()`, whereupon the sweep is chosen of itself.

## Of the Two Diversions

| Diversion | Formulation | Magnitudes | Whereon exposed |
|---|---|---|---|
| Sudoku | M² variables, domains 1..M, an all-different upon each row, column, and subgrid | N from 2 to 5 (the web tier: 2, 3, 4, and N=5 at easy) | Rust, Python, wasm, service, frontend |
| Futoshiki | An N×N Latin square, with inequalities set between adjacent cells | N from 4 to 7, in this first version | Rust, Python, wasm, service, frontend |

Each is furnished with generation and with validation. The uniqueness-proof of Futoshiki (which seeketh two solutions under `Ac3`) is sound by virtue of the kernel's correction to the AC-3 trail.

## Of the Frontispiece

Vue 3 in the Composition manner, without router and without library of state. The directory `src/pencil/` holdeth the shared hand-drawn habit—the grid, the glyphs, the celestial chrome, the filters, the scheduler—and `src/games/{sudoku,futoshiki}/` the two surfaces of play. Solving is conducted in a Worker over `@mkbabb/csp-solver-wasm`, and there is no service. The motion is scheduled by `@mkbabb/pencil-boil` (`^0.6.0`), and all of it deferreth to `prefers-reduced-motion`. The grid is an ARIA grid, navigable by the keys, with an affordance to hold and peek.

## Upon the Meaning of `max_solutions`

Where `max_solutions` be one, under `Ac3`, the search returneth the first solution it attaineth. Upon an instance bearing many solutions this first is valid but not determinate—it dependeth upon the trajectory, and another pruning or ordering may return another member of the set, no less correct. Let it therefore be taken for a probe of satisfiability, or (at two) for a proof of uniqueness, and never for a warrant of any particular solution (the campaign's `evidence/kernel-soundness-closure.md`, §7.2).

## Of Setting the Works in Motion

```bash
# The engine alone
cd csp-solver && cargo test --workspace && cargo bench

# The wheel-contract proving (the wheel of csp_solver being installed apart, by maturin)
cd csp-solver/tests-py && uv sync && uv pip install ../../target/wheels/*.whl && uv run --no-sync pytest

# The frontispiece alone (it solveth within the browser; scripts/dev.sh is a thin launcher)
cd web/frontend && npm install && npm run dev
```

## Of the Proving

```bash
# Rust — 150 passed, 0 failed, 6 ignored, across 17 binaries
#   (measured at d9781e29, Apple M5 Max, 2026-07-06)
cargo test --workspace

# Python — the csp-solver/tests-py wheel-contract suite, against the installed wheel
cd csp-solver/tests-py && uv run --no-sync pytest

# The measured benchmarks (criterion) — sudoku, queens, map_coloring, lattice
cargo bench
```

## Of the Deployment

The frontispiece is a static deploy upon Cloudflare Pages (sudoku.babb.dev); it solveth and generateth wholly within a Worker over `@mkbabb/csp-solver-wasm`, and so retireth the whole class of GIL-and-DoS hazard for the served magnitudes. `_headers` beareth the CSP, HSTS, and X-Frame-Options; `_redirects` beareth the SPA fallback. There remaineth one action to the owner (OD-4): to strike the dangling CNAME `api.csp-solver.babb.dev`, which hath the shape of a subdomain seizure. The Docker and FastAPI reference stack was retired in the T2-W2 abrogation.

## Of the Continuous Integration

The workflow `.github/workflows/ci.yml` at the root marshalleth eight lanes: lint (fmt and clippy, warnings denied); rust (build and test of the workspace, with the queens-bench assertion of ground truth); py-compile (a check under the feature `py`, upon Python of 3.13 or less, for the ceiling of PyO3 0.24); py-runtime (the maturin wheel, a uv venv, then pytest); wasm (a test by node and clippy upon the wasm32 target); twiggy (the budgets of size); and frontend (`npm ci` and `vue-tsc`). The wasm builds elect the `wasm-release` profile. The budgets: the full module faileth above 240 KB and warneth above 215 KB; the lean Sudoku artifact faileth above 93 KB, and measureth, as deployed, 87,853 bytes raw (measured at d9781e29, Apple M5 Max, 2026-07-06).

## Of the Artifacts Published

| Artifact | Registry | Version |
|---|---|---|
| `csp-solver` | crates.io | 0.2.0 |
| `@mkbabb/csp-solver-wasm` | npm | 0.2.0 |
| `@mkbabb/morph` | npm (now from mkbabb/morph) | 0.2.0 |
| `@mkbabb/pencil-boil` | npm (a dependant of the frontend) | 0.6.0 |

## Of the Performance

The reproducible and stamped figures are set down in `docs/benchmarks.md`. In sum: generalised arc consistency, being now default-ON, yieldeth an aggregate of 13.36-fold over a bank of 113 boards, at a cost honestly disclosed—three of five named hard 9×9 boards run from 1.3 to 2.5 times slower with it engaged. No headline of cross-tongue speedup is claimed, nor any band of profile percentages; the elder figures of 7-to-57-fold and of 10-to-25 percent were found irreproducible and are hereby retired.

## Sources

- Régin, J.-C. (1994). "A filtering algorithm for constraints of difference in CSPs." *AAAI-94*, 362–367.
- Mackworth, A. K. (1977). "Consistency in networks of relations." *Artificial Intelligence*, 8(1), 99–118.
- Hopcroft, J. E. & Karp, R. M. (1973). "An n^(5/2) algorithm for maximum matchings in bipartite graphs." *SIAM J. Comput.*, 2(4), 225–231.
- Tarjan, R. E. (1972). "Depth-first search and linear graph algorithms." *SIAM J. Comput.*, 1(2), 146–160.
- Boussemart, F. et al. (2004). "Boosting systematic search by weighting constraints." *ECAI-04*, 146–150.
