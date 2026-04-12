# csp-solver-wasm-morph

WebAssembly bindings for `morph-core`, exposing the pairwise form
alignment pipeline to JavaScript and TypeScript consumers. Single
export: `alignForms(request) -> response`.

## Build

```
cd csp-solver/wasm-morph
make wasm
```

This invokes `wasm-pack build --target web --release --out-dir pkg`,
producing the following artifacts in `pkg/`:

- `package.json` -- npm manifest, name `csp-solver-wasm-morph`
- `csp_solver_wasm_morph.js` -- ES-module loader, the JS entry point
- `csp_solver_wasm_morph_bg.wasm` -- the compiled WebAssembly binary
- `csp_solver_wasm_morph.d.ts` -- TypeScript declarations for every export

## Consume

```
npm install file:../path/to/csp-solver/wasm-morph/pkg
```

```ts
import init, { alignForms } from "csp-solver-wasm-morph";

await init();

const result = alignForms({
  source: {
    id: "b-stem",
    subpaths: [{ role: "outer", segments: [...], signedArea: 42.0 }],
    viewBox: [0, 0, 100, 100],
  },
  target: {
    id: "b-bowl",
    subpaths: [{ role: "outer", segments: [...], signedArea: 38.0 }],
    viewBox: [0, 0, 100, 100],
  },
});
// result: { sourceFormId, targetFormId, pairs, unmatchedSource, unmatchedTarget }
```

## Layout

```
csp-solver/wasm-morph/
+-- Cargo.toml         # cdylib + rlib member, path-deps morph-core
+-- Makefile           # `make wasm` / `make clean`
+-- README.md          # this file
+-- src/
|   +-- lib.rs         # panic-hook init + module re-exports
|   +-- wire.rs        # serde wire types + JS-facing alignForms export
+-- pkg/               # wasm-pack output, committed alongside source
```
