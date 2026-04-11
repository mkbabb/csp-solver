# csp-solver-wasm

WebAssembly bindings for `csp-solver`, exposing the discrete CSP / COP
API to JavaScript and TypeScript consumers. The binding is an
isomorphic mirror of the Python binding in `csp-solver/src/py.rs` —
same surface, same method names, same argument orders, different
binding mechanism.

## Build

```
cd csp-solver/wasm
make wasm
```

This invokes `wasm-pack build --target web --release --out-dir pkg`,
producing the following artifacts in `pkg/`:

- `package.json` — npm manifest, name `csp-solver-wasm`
- `csp_solver_wasm.js` — ES-module loader, the JS entry point
- `csp_solver_wasm_bg.wasm` — the compiled WebAssembly binary
- `csp_solver_wasm.d.ts` — TypeScript declarations for every export

## Consume

```
npm install file:../path/to/csp-solver/wasm/pkg
```

```ts
import init, { Csp, SolveConfig, Pruning, Ordering } from "csp-solver-wasm";

await init();

const csp = new Csp();
const a = csp.addVariable(new Uint32Array([1, 2, 3]));
const b = csp.addVariable(new Uint32Array([1, 2, 3]));
csp.addNotEqual(a, b);
csp.finalize();

const cfg = new SolveConfig();
cfg.pruning = Pruning.AC_FC;
const solutions = csp.solve(cfg);
```

## API surface

Two layers, both exported from the same module:

- **Low-level isomorphic mirror** — `Csp`, `SolveConfig`, `SolveStats`,
  and the `Pruning` / `Ordering` / `PropagationStrategy` /
  `OptimizationMode` enums. These are line-for-line equivalents of the
  same names in `csp-solver/src/py.rs`. The `Csp` wrapper holds a
  `csp_solver::Csp<BitsetDomain>` internally, matching the Python
  binding's domain choice.

- **Convenience surface** — `solveAssignmentCop` for bipartite
  assignment / COP problems. Lands in a future commit; the scaffolding
  is here so the API can grow without churning the published surface.

## Layout

```
csp-solver/wasm/
├── Cargo.toml         # cdylib + rlib member, path-deps the parent
├── Makefile           # `make wasm` / `make docs` / `make clean`
├── README.md          # this file
├── CHANGELOG.md       # release notes
├── src/
│   ├── lib.rs         # panic-hook init + module re-exports
│   └── isomorphic.rs  # the py.rs mirror
└── pkg/               # wasm-pack output, committed alongside source
```
