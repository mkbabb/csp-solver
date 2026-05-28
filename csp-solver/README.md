# csp-solver

Generic constraint satisfaction problem solver in Rust, with WebAssembly bindings.
Chronological backtracking + conflict-directed backjumping, AC-3 and AC-FC constraint
propagation, GAC all-different (Regin 1994), min-conflicts local search, over bitset /
finite / lattice domains.

The workspace ships four publishable artifacts across two registries:

| Artifact | Registry | Role |
| --- | --- | --- |
| `csp-solver` | crates.io | the CSP solver crate |
| `morph-core` | crates.io | form alignment + landmark matching, built on `csp-solver` |
| `@mkbabb/csp-solver-wasm` | npm | wasm-pack bindings for `csp-solver` |
| `@mkbabb/morph` | npm | wasm-pack bindings for `morph-core` |

## Install

```toml
# Rust — Cargo.toml
[dependencies]
csp-solver = "0.1.0"
morph-core = "0.1.0"
```

```bash
# JavaScript / TypeScript
npm install @mkbabb/csp-solver-wasm
npm install @mkbabb/morph
```

## Usage

```rust
use csp_solver::{Csp, SolveConfig};

let mut csp = Csp::new();
// declare variables + domains, push constraints, then solve:
let solution = csp.solve(&SolveConfig::default());
```

The wasm packages mirror the Rust surface for JS consumers — `@mkbabb/csp-solver-wasm`
exposes the solver problem-builder, and `@mkbabb/morph` exposes the alignment pipeline.
The emitted JS entry points are `csp_solver_wasm.js` and `morph.js` respectively.

## Structure

```
src/                  Csp<D>, domains, constraints, solver strategies (lib.rs entry)
morph-core/           form alignment + landmark matching crate (depends on csp-solver)
wasm/                 wasm-pack bindings for csp-solver → @mkbabb/csp-solver-wasm
wasm-morph/           wasm-pack bindings for morph-core → @mkbabb/morph
benches/              criterion benchmarks (sudoku, queens, map_coloring, …)
examples/, tests/     native checks
```

See `CLAUDE.md` for the full module map.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The README shape follows the perimeter-level
[canonical README shape](https://github.com/mkbabb/glass-ui/blob/master/docs/precepts/canonical-readme-shape.md).

## License

[MIT](./LICENSE) © 2026 Mike Babb.
