# csp-solver

Generic constraint satisfaction problem solver in Rust, with WebAssembly
bindings. Unified backtracking search, AC-3 and AC-FC constraint propagation,
GAC all-different (Régin 1994, default-ON), branch-and-bound for cost
optimization, over bitset / finite / cost-finite / lattice domains.

The workspace ships two publishable artifacts across two registries:

| Artifact | Registry | Role |
| --- | --- | --- |
| `csp-solver` | crates.io | the CSP solver crate |
| `@mkbabb/csp-solver-wasm` | npm | wasm-pack bindings for `csp-solver` |

`morph-core` (crates.io) and `@mkbabb/morph` (npm) once shipped from here; they
were excised to [github.com/mkbabb/morph](https://github.com/mkbabb/morph). The
pre-deletion state is tagged `pre-morph-excision`; the general-purpose
`AssignmentBuilder` surface morph was built on stays here, and morph now consumes
`csp-solver` as an ordinary crates.io dependency. See `CHANGELOG.md`.

## Install

```toml
# Rust — Cargo.toml
[dependencies]
csp-solver = "0.2"
```

```bash
# JavaScript / TypeScript
npm install @mkbabb/csp-solver-wasm
```

## Usage

```rust
use csp_solver::{Csp, SolveConfig};

let mut csp = Csp::new();
// declare variables + domains, push constraints, finalize, then solve:
csp.finalize();
let solutions = csp.solve(&SolveConfig::default());
```

`@mkbabb/csp-solver-wasm` exposes the same core to JS consumers — the lean
default build ships the Sudoku and Futoshiki solve surfaces plus the assignment
COP entry point; the `full-mirror` feature adds the generic `Csp` builder. The
emitted JS entry point is `csp_solver_wasm.js`. See [`wasm/README.md`](./wasm/README.md).

## Structure

```
src/                  Csp<D>, domains, constraints, solver kernel (lib.rs entry)
wasm/                 wasm-pack bindings → @mkbabb/csp-solver-wasm
data/                 embedded sudoku template bank (include_dir!)
benches/              criterion benchmarks (sudoku, queens, map_coloring, assignment, …)
examples/, tests/     native checks + the template-generator pipeline
```

See `CLAUDE.md` for the full module map.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The README shape follows the perimeter-level
[canonical README shape](https://github.com/mkbabb/glass-ui/blob/master/docs/precepts/canonical-readme-shape.md).

## License

[MIT](./LICENSE) © 2026 Mike Babb.
