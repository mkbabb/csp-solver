# Changelog

This workspace ships two publishable artifacts across two registries:

- `csp-solver` — the CSP solver crate (crates.io)
- `@mkbabb/csp-solver-wasm` — wasm-pack bindings for `csp-solver` (npm)

**Excised (W11/W12):** `morph-core` (crates.io) and `@mkbabb/morph` (npm) moved
to [`github.com/mkbabb/morph`](https://github.com/mkbabb/morph) at commit
`4568dc7e` (tag `pre-morph-excision`). Their `0.1.0` entries below stay as
historical record — they really did ship from this repo — but everything past
`morph-core 0.1.0` / `@mkbabb/morph 0.1.1` lives in that repo's changelog. The
general-purpose `csp_solver::assignment()` / `AssignmentBuilder` surface morph
was built on stays here; `morph` now consumes it as an ordinary crates.io
dependency (`csp-solver = "0.2"`).

## 0.2.0 — 2026-07-06 (grand-uplift tranche, W1–W12)

### crates.io

- **`csp-solver@0.2.0`** — the kernel wave. Breaking (pre-1.0 minor-bump class):
  - `Ordering::DomWdeg` → `Ordering::Mrv` (the name was a proven misnomer:
    weights frozen at 1.0; `Chs ≡ DomWdeg` bit-for-bit).
  - `SolveConfig::backjumping` deleted (CBJ excised with the unified search
    kernel; breaks exhaustive struct literals — spread `..Default::default()`).
  - `SolveConfig::default()` → `Ac3` + `FailFirst` (was ForwardChecking +
    Chronological); behavior-visible for default-config consumers.
  - New: unified search kernel (`solver/search.rs`), GAC-in-AllDifferent
    default-ON (Régin, warm-started incremental matching; corpus aggregate
    ~13–16×, nodes 41,737→5,878), restart/nogood substrate (driver deferred),
    typed `CspError` + `py/` module with 4 typed exceptions, `cancel` +
    `node_budget` + `optimization_mode` on `SolveConfig`, zero-alloc hot path,
    release-guarded `BitsetDomain` 0..128 invariant, Futoshiki generation +
    `FutoshikiPuzzle::from_parts` validation, crate-owned embedded puzzle data
    (`include_dir!`), `AssignmentError::BudgetExceeded`.
  - Excised: `min_conflicts` local search, `CardinalityConstraint`,
    `ConstraintEnum::Lambda` (zero construction sites), CLI-format fixtures.
  - Soundness: the AC-3 `Unsatisfiable` trail-push fix (false-UNSAT 26/113→0/113);
    lattice AC-3 termination fix (default revise honors `prune`'s bool);
    parity matrix 170 rows, 0 completeness violations; solution-set invariance
    + 11 restart/nogood canaries standing guard.

### npm

- **`@mkbabb/csp-solver-wasm@0.2.0`** — split surface: lean sudoku+futoshiki
  deploy artifact (87,853 B raw under `--profile wasm-release
  --no-default-features`) vs the `full-mirror` feature (generic `Csp` mirror,
  `solveAssignmentCop`). Flat-index `Uint32Array` wires with seeded RNG; coded
  errors (`BUDGET_EXCEEDED` vs `UNSAT` distinguishable); `MRV` on the wire;
  vestigial `backjumping` removed; hardened difficulty-parity contract tests.

## 0.1.0 — 2026-05-28 (G.W5 — first publish)

First registry publish of the workspace, landed as part of the muster tranche G
release-engineering wave (G.W5 sub-wave A, CSC411-fold pass).

### crates.io

- **`csp-solver@0.1.0`** — generic constraint satisfaction problem solver: chronological
  backtracking + conflict-directed backjumping, AC-3 + AC-FC propagation, GAC
  all-different (Regin 1994), min-conflicts local search, bitset + finite + lattice
  domains. Cargo.toml carries the crates.io-mandatory `description` + `license = "MIT"`
  + `repository` fields.
- **`morph-core@0.1.0`** — form alignment + landmark matching primitives, built on
  `csp-solver`. Depended on `csp-solver` via a registry version pin alongside the
  workspace-internal path (`csp-solver = { version = "0.1.0", path = ".." }`); the
  path resolved local builds, the version resolved the crates.io edge. _Excised to
  [`mkbabb/morph`](https://github.com/mkbabb/morph); `0.2.0` onward ships from there._

### npm (@mkbabb scope)

- **`@mkbabb/csp-solver-wasm@0.1.0`** — wasm-pack-emitted bindings for `csp-solver`.
  Published under the `@mkbabb/*` scope; emitted JS surface is `csp_solver_wasm.{js,d.ts,_bg.wasm}`.
- **`@mkbabb/morph@0.1.0`** — wasm-pack-emitted bindings for `morph-core`. The
  underlying Rust crate is named `morph`; the emitted JS surface is
  `morph.{js,d.ts,_bg.wasm}`. Consumed by bbnf-buddy through the npm registry.
  _Excised to [`mkbabb/morph`](https://github.com/mkbabb/morph); `0.2.0` onward
  ships from there. (`0.1.1` — the next patch — was the last release from this repo.)_
