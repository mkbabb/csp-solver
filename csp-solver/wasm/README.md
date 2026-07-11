# @mkbabb/csp-solver-wasm

WebAssembly bindings for `csp-solver`, exposing its purpose-built solve
surfaces to JavaScript and TypeScript. `0.4.0` on npm.

## Surface

Three layers, all re-exported from the one module (`wasm/src/lib.rs`):

- **`sudoku`** (always compiled) — the browser client-solve surface:
  `solveSudoku` / `generateSudoku` over flat `Uint32Array` boards, no
  string-keyed maps. This is what the frontend deploy fork ships.
- **`futoshiki`** (always compiled) — the sibling surface: `solveFutoshiki` /
  `generateFutoshiki` over a flat board plus a flat inequality-pair buffer.
- **`assignment`** (feature `assignment`) — `solveAssignmentCop` /
  `assignmentSentinel` for bipartite assignment COPs, a thin adapter over the
  upstream `AssignmentBuilder`. bbnf-buddy's live consumer.

`default = ["assignment"]`. The lean browser artifact is
`--no-default-features` — `sudoku` + `futoshiki` only.

## Build

Requires `wasm-pack ≥ 0.14`.

```bash
cd csp-solver/wasm
make wasm            # wasm-pack build --target web --release → pkg/ (full, default features: + assignment)
```

The lean deploy artifact (Sudoku + Futoshiki, no assignment):

```bash
wasm-pack build --target web --profile wasm-release --no-default-features --out-dir pkg
```

`make wasm` writes `pkg/`:

- `package.json` — npm manifest, name `@mkbabb/csp-solver-wasm`
- `csp_solver_wasm.js` — ES-module loader, the JS entry point
- `csp_solver_wasm_bg.wasm` — the compiled binary
- `csp_solver_wasm.d.ts` — TypeScript declarations for every export

The committed `pkg/` is the lean `--target web --no-default-features` deploy
artifact the frontend file-links (Sudoku + Futoshiki only). The lean band budget
is ≤93 KB (`docs/tranches/2026-07-grand-uplift/waves/W6-deploy-c.md`); the twiggy
CI lane enforces it.

## Consume

```ts
import init, { solveSudoku, solveFutoshiki } from "@mkbabb/csp-solver-wasm";

await init();

// Sudoku — flat Uint32Array board (0 = blank), n = sub-grid size (3 → 9×9):
const board = new Uint32Array(81); // ...fill givens...
const result = solveSudoku(board, 3);
if (result.solved) {
  const solution = result.solutions; // flat Uint32Array
}
```

`solveSudoku` / `solveFutoshiki` take an optional `max_solutions` and
`node_budget`. `max_solutions = 1` (the default) is a satisfiability probe: on a
puzzle with more than one solution the specific solution returned is
trajectory-dependent — a valid member of the solution set, but not a fixed
choice. A `budgetExceeded` getter distinguishes a node-budget abort from a real
UNSAT.

## Layout

```
csp-solver/wasm/
├── Cargo.toml         # cdylib + rlib member, path-deps the parent; feature gates
├── Makefile           # `make wasm` / `make docs` / `make clean`
├── README.md          # this file
├── CHANGELOG.md       # release notes
├── src/
│   ├── lib.rs         # panic-hook init + layer re-exports
│   ├── sudoku.rs      # solveSudoku / generateSudoku (always compiled)
│   ├── futoshiki.rs   # solveFutoshiki / generateFutoshiki (always compiled)
│   └── assignment.rs  # solveAssignmentCop (feature `assignment`)
├── tests/             # dualization, futoshiki_parity (wasm-bindgen-test)
└── pkg/               # wasm-pack output, committed alongside source
```

## License

[MIT](./LICENSE) © 2026 Mike Babb.
