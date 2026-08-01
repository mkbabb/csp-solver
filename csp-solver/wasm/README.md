# @mkbabb/csp-solver-wasm

WebAssembly bindings for `csp-solver`, exposing its purpose-built solve surfaces
to JavaScript and TypeScript. Source `0.6.0`; the npm tarball is `0.2.0`. The
frontend file-links the lean build rather than the registry package, so the npm
lag is inert at runtime.

## Surface

Six layers, all re-exported from the one module (`wasm/src/lib.rs`). Each of the
five puzzle families ships a `solve* / generate* / propagate*` trio over flat
`Uint32Array` wires, no string-keyed maps:

- **`sudoku`** (always compiled): `solveSudoku` / `generateSudoku` /
  `propagateSudoku` over flat boards.
- **`futoshiki`** (always compiled): `solveFutoshiki` / `generateFutoshiki` /
  `propagateFutoshiki` over a flat board plus a flat inequality-pair buffer.
- **`thermo`** (always compiled): `solveThermo` / `generateThermo` /
  `propagateThermo` over a flat board plus a flat thermometer buffer.
- **`killer`** (always compiled): `solveKiller` / `generateKiller` /
  `propagateKiller` over a flat board plus a flat cage buffer.
- **`kenken`** (always compiled): `solveKenKen` / `generateKenKen` /
  `propagateKenKen` over a flat board plus a flat cage buffer.
- **`assignment`** (feature `assignment`): `solveAssignmentCop` /
  `assignmentSentinel` for bipartite assignment COPs, a thin adapter over the
  upstream `AssignmentBuilder`. bbnf-buddy's live consumer.

`default = ["assignment"]`. The lean browser artifact is `--no-default-features`:
the five puzzle families, with the assignment layer and its serde graph out of
the compile.

## Build

Requires `wasm-pack ≥ 0.14`.

```bash
cd csp-solver/wasm
make wasm            # wasm-pack build --scope mkbabb --target web --profile wasm-release --no-default-features → pkg/
```

`make wasm` builds the LEAN deploy artifact — the five puzzle families, with the
`assignment` feature and its whole serde/ndarray graph out of the compile. It is
the exact recipe CI's `build-lean-wasm` lane runs and the one the frontend `file:`
link expects, and it stamps the `exports` map onto `pkg/package.json` afterwards.

The default-feature module (the same five families plus the `assignment` surface,
whose transitive `ndarray` dominates the size delta) is not what ships. Build it
explicitly when a size or surface question needs it:

```bash
wasm-pack build csp-solver/wasm --scope mkbabb --profile wasm-release
```

`make wasm` writes `pkg/`:

- `package.json`, npm manifest, name `@mkbabb/csp-solver-wasm`
- `csp_solver_wasm.js`, ES-module loader, the JS entry point
- `csp_solver_wasm_bg.wasm`, the compiled binary
- `csp_solver_wasm.d.ts`, TypeScript declarations for every export

`pkg/` is gitignored build output, not committed; the frontend file-links it
(`"@mkbabb/csp-solver-wasm": "file:../../csp-solver/wasm/pkg"`) as the lean
`--target web --no-default-features` artifact, the five puzzle families. That
lean build measures 121,137 B on darwin (`wc -c pkg/csp_solver_wasm_bg.wasm`,
measured at a3ada202, 2026-08-01), under the 124,500 B re-derived ceiling (base
plus per-game wire). The CI runner's toolchain builds the same source a couple of
KB larger — it last measured 124,097 B, at e6b19a4c (run 30719165442) — and the twiggy lane enforces
the band on the runner's own figure, failing above 127,500 B. Both figures are
stamped here on purpose: the doc-truth gate re-derives this number from whichever
artifact is on the machine it runs on, so a site carrying one platform's figure
alone reds on the other.

## Consume

```ts
import init, { solveSudoku, solveFutoshiki } from "@mkbabb/csp-solver-wasm";

await init();

// Sudoku: flat Uint32Array board (0 = blank), n = sub-grid size (3 → 9×9):
const board = new Uint32Array(81); // ...fill givens...
const result = solveSudoku(board, 3);
if (result.solved) {
  const solution = result.solutions; // flat Uint32Array
}
```

Every `solve*` entry takes an optional `max_solutions` and `node_budget`.
`max_solutions = 1` (the default) is a satisfiability probe: on a puzzle with
more than one solution the specific solution returned is trajectory-dependent, a
valid member of the solution set the caller must not assume is fixed. A
`budgetExceeded` getter distinguishes a node-budget abort from a real UNSAT.

## Layout

```
csp-solver/wasm/
├── Cargo.toml         # cdylib + rlib member, path-deps the parent; feature gates
├── Makefile           # `make wasm` / `make docs` / `make clean`
├── README.md          # this file
├── CHANGELOG.md       # release notes
├── src/
│   ├── lib.rs         # panic-hook init + layer re-exports
│   ├── errors.rs      # coded_error + flatten_solutions + domain_masks helpers
│   ├── sudoku.rs      # solveSudoku / generateSudoku / propagateSudoku (always compiled)
│   ├── futoshiki.rs   # solveFutoshiki / generateFutoshiki / propagateFutoshiki (always compiled)
│   ├── thermo.rs      # solveThermo / generateThermo / propagateThermo (always compiled)
│   ├── killer.rs      # solveKiller / generateKiller / propagateKiller (always compiled)
│   ├── kenken.rs      # solveKenKen / generateKenKen / propagateKenKen (always compiled)
│   └── assignment.rs  # solveAssignmentCop / assignmentSentinel (feature `assignment`)
├── tests/             # dualization, futoshiki_parity (wasm-bindgen-test)
└── pkg/               # wasm-pack output, gitignored, file-linked by the frontend
```

## License

[MIT](./LICENSE) © 2026 Mike Babb.
