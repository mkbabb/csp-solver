# Lane R8 — Web Research: Structure Conventions Across the Stack (July 2026)

Scope: gather the current (2025–2026) convention set for Rust module/workspace organization, wasm-bindgen dual-surface crate layout + lean feature gating, and Vue 3.5+/Vite 8 feature-folder colocation + design-system monorepo structure. Score our tree against it. Every codebase claim carries a `file:line`; every web claim carries a URL.

---

## PART A — The convention set (cited)

### A1. Rust — named-file modules over `mod.rs` (edition-2024 idiom)

The modern, tool-endorsed idiom is the **self-named module file** (`foo.rs` beside a `foo/` dir) rather than `foo/mod.rs`.

- The Rust Reference documents both forms and frames `mod.rs` as the legacy path; the self-named form makes a module "an atomic unit for reading… or operating on (moving, renaming)" and is "consistent with `lib.rs` and `main.rs`" — <https://doc.rust-lang.org/reference/items/modules.html>
- Rationale from the community/style consensus: avoids "many files named `mod.rs`… confusing when you have them open in your editor," and on GitHub "it can be easy to overlook the existence of a `name/` when seeing a `name.rs`" — <https://users.rust-lang.org/t/modules-named-mod-rs/81211>
- Enforceable via Clippy: `clippy.self_named_module_files = "warn"` (the `self_named_module_files` lint) — same source; also the Book's module chapter shows the `garden.rs` + `garden/` layout as the presented form — <https://doc.rust-lang.org/book/ch07-05-separating-modules-into-different-files.html>

Both forms remain *valid*; the point is consistency and IDE/VCS ergonomics. This is a house-style choice, not a correctness rule.

### A2. Rust — optional PyO3 bindings as a feature-gated surface

The SOTA pattern for a crate that is *both* a Rust library and a Python extension:

- Make `pyo3` an **optional dependency** and gate it behind a named feature; keep pure-Rust logic in core modules and confine `#[pyfunction]`/`#[pymodule]` wrappers to the gated module — PyO3 discussion #3501, "Is it possible to make the python binding optional feature?" — <https://github.com/PyO3/pyo3/discussions/3501>
- `crate-type = ["cdylib", "rlib"]` so Rust consumers get the `rlib` and Python gets the shared lib; `pyo3` carries `features = ["extension-module"]` to leave Python symbols unresolved at link — PyO3 FAQ / user guide — <https://github.com/PyO3/pyo3/blob/main/guide/src/faq.md>, <https://pyo3.rs/>
- The bindings **wrap, not mirror** the core (thin `From`/adapter layer) — same discussion.

### A3. Rust — crate naming + module naming

- Modules are `snake_case`; crate names must **not** carry a `-rs`/`-rust` suffix/prefix ("Every crate is Rust!") — Rust API Guidelines, Naming — <https://rust-lang.github.io/api-guidelines/naming.html>
- The API-guidelines don't legislate re-export strategy or internal module hierarchy; that's left to house style (the guidelines' Naming section is item-level, not architectural — confirmed by fetch).

### A4. wasm-bindgen — dual npm/rust surface + lean feature gating

wasm-bindgen is the runtime + attribute for high-level JS↔wasm interop; a crate exposes its Rust API to JS through `#[wasm_bindgen]` items — <https://rustwasm.github.io/docs/wasm-bindgen/>. The organizational conventions that fall out (and match leading wasm crates):

- **Feature-gate optional surfaces** so a lean build drops whole dependency subgraphs (e.g. `serde-wasm-bindgen`) via `--no-default-features`. This is the standard lever for shrinking wasm artifacts — general wasm-bindgen guidance — <https://rustwasm.github.io/docs/wasm-bindgen/print.html>, <https://generalistprogrammer.com/tutorials/wasm-bindgen-rust-crate-guide>
- Module-per-surface files under `src/`, re-exported from `lib.rs`, with the always-shipped surface unconditional and reference/parity surfaces behind features.

### A5. Vue 3.5+ / Vite — feature-folder colocation + `<script setup>`

- Composables are `useXxx()` camelCase; **shared** composables live in `src/composables/`, **feature-scoped** ones colocate as `components/<feature>/…` + `composables/use<Feature>.ts` — Vue docs, Composables — <https://vuejs.org/guide/reusability/composables>; alexop.dev "How to Structure Vue Projects" — <https://alexop.dev/posts/how-to-structure-vue-projects/>
- `<script setup lang="ts">` is the default authoring form — Vue best-practices — <https://skills.sh/hyf0/vue-skills/vue-best-practices>
- Colocation principle: related code (component, its composable, its tests, its types) sits together per feature — alexop.dev, same URL.

### A6. Vue monorepo + shared design system

Feature-Sliced Design's 2025 monorepo guide is the strongest primary source:

- Split **`apps/`** (deployable units) from **`packages/`** (reusable building blocks: `ui`, `shared`, `api-client`, `config`) — <https://feature-sliced.design/blog/frontend-monorepo-explained>
- **Every package exposes an explicit `src/index.ts` public API**; the barrel is the gatekeeper — consumers import `{ Button } from "@acme/ui"`, never deep internals. `package.json` `exports` restricts the entry to `./dist/index.js`. — same URL.
- Dependency-hygiene rules: (1) apps import only package public APIs, not deep internals; (2) features don't import other features unless via a deliberate shared slice; (3) keep `shared/` small (primitives, not business logic). — same URL.
- Component library best practice: `index.ts` entry per block, colocate docs/stories, don't expose internal files — moldstud / Vue-land FAQ — <https://vue-land.github.io/faq/folder-structure>

---

## PART B — Scored gap table (convention → our tree)

Score key: **A** = meets SOTA; **B** = mostly, minor drift; **C** = material gap; **D** = misses convention. "Effort" is relative remediation cost.

| # | Convention (source) | Our tree (file:line) | Score | Effort | Note |
|---|---|---|---|---|---|
| G1 | Named-file modules over `mod.rs` (A1) | 11 `mod.rs` files: `constraint/mod.rs`, `domain/mod.rs`, `solver/mod.rs`, `csp/mod.rs`, `builder/mod.rs`, `puzzles/mod.rs`, `puzzles/sudoku/mod.rs`, `puzzles/futoshiki/mod.rs`, `solver/gac/mod.rs`, `py/mod.rs` | **C** | Med | Pure rename churn (`foo/mod.rs`→`foo.rs`); mechanically safe, git-history noise. Consistency + IDE win, no behavior change. Could gate with `self_named_module_files` lint. |
| G2 | Optional PyO3 via optional dep + feature (A2) | `Cargo.toml:15` `py = ["dep:pyo3"]`; gated `pub mod py` at `src/lib.rs:26-27` | **A** | — | Textbook. `dep:pyo3` optional dependency, feature-gated module. |
| G3 | Bindings wrap not mirror core (A2) | `py/mod.rs:1-2` "only solver behind PyO3… no Python-side solver"; py pyclasses wrap `Csp<BitsetDomain>` (`py/mod.rs` doc) | **A** | — | Core/binding separation clean. |
| G4 | PyO3 module split under 500-line budget (house rule ∩ A2) | `py/` split into `config.rs`(149) `csp.rs` `enums.rs` `errors.rs` `futoshiki_api.rs`(234) `sudoku_api.rs`(338) — all < 500 | **A** | — | Already modularized per-concern. |
| G5 | `sudoku_api.rs` — split into module or deprecate? (owner Q) | `py/sudoku_api.rs` 338 lines, single file holding `SudokuDifficulty`+`SudokuCSP`+4 free fns (`sudoku_api.rs:1-2`) | **B** | Low | Under budget, so no *forcing* need to split. But it mixes an enum, a pyclass, and free functions — a `py/sudoku/{enums,csp,api}.rs` sub-module would mirror the core's `puzzles/sudoku/` shape and the futoshiki peer. Not deprecated: it is the live Sudoku PyO3 surface (`lib.rs` re-exports via `py`). Recommend **split, not remove**. |
| G6 | wasm lean build via feature gating (A4) | `wasm/Cargo.toml:31-37` `full-mirror`/`assignment` gated; `sudoku`+`futoshiki` always-on; lean = `--no-default-features` drops serde graph | **A** | — | Exemplary. `wasm/src/lib.rs:29-40` `#[cfg(feature=…)]` on `isomorphic`/`assignment`. |
| G7 | `isomorphic.rs` still needed? (owner Q) | `wasm/src/isomorphic.rs` 460 lines, gated `full-mirror` (`lib.rs:16-19,30-31`); only in-repo refs are doc mentions + its own gate (`grep`: no lean-path consumer) | **C** | Low | It is a **PyO3-parity reference mirror** of `src/py.rs` (`isomorphic.rs:1`), excluded from the shipped lean build. No live JS consumer found in-tree (`sudoku.rs:13,32,44` explicitly *avoids* reusing it). It is dead weight to the deployed surface; kept only as reference. Candidate for **removal or extraction to an examples/reference crate** unless an external `full-mirror` consumer exists (verify with owner). Largest single wasm file. |
| G8 | Feature-folder colocation, `<script setup>` (A5) | `games/{sudoku,futoshiki}/` each colocate `composables/use*.ts`, `solver/*.ts`, `types.ts`, board component families (`FutoshikiBoard/FutoshikiCell/…`) | **A** | — | Strong per-feature colocation; component families nested (`SudokuBoard/SudokuCell/`). |
| G9 | Composable placement (shared vs feature) (A5) | Shared: `src/composables/useTheme.ts`; feature: `games/*/composables/*`; pencil: `pencil/composables/*` | **A** | — | Correct shared/feature split. |
| G10 | Design system as package w/ public `index.ts` barrel (A6) | `src/pencil/` is a de-facto design system but an **in-app folder**, not a `packages/ui`; **zero `index.ts` barrels anywhere** (`find src -name index.ts` → empty) | **C** | High | Consumers deep-import internals: `@pencil/grid/HandDrawnOutline.vue`, `@pencil/glyph/HandwrittenGlyph.vue`, `@pencil/config/pencilConfig` (grep: 11 deep pencil import sites). SOTA wants a gated public surface. Full fix (extract to `packages/pencil` + barrel) is a monorepo restructure; a lighter fix is a `pencil/index.ts` barrel + lint against deep imports. |
| G11 | Explicit boundaries / dependency hygiene (A6) | `eslint.config.js:15-75` enforces pencil↛games and sudoku↮futoshiki via `no-restricted-imports` | **B** | Low | Two *coarse* boundaries exist (directionally SOTA), but they police *cross-feature* edges, not *public-API vs internal* depth. No rule stops deep-importing pencil internals (G10). Add a public-surface rule once a barrel exists. |
| G12 | Monorepo apps/ + packages/ split (A6) | Single Vite app `csp-solver-frontend` (`package.json:2`), no root `packages/`, no workspaces | **B** | High | Defensible: one deployed SPA, two games + one aesthetic layer. Not a gap *per se* — FSD `apps/packages` split is for *multi-app* repos. Our within-`src/` feature layers (`games/`, `pencil/`, `composables/`) are the single-app analogue. Score B (not A) only because pencil lacks the packaged public surface of G10. |
| G13 | `pub(crate)` hygiene (A3-adjacent) | `lib.rs:19-25` mixes `pub mod` (adjacency, builder, constraint, domain…) with `pub(crate)` (bitscan, config, csp) | **B** | Low | Deliberate: crate-root re-exports the curated surface (`lib.rs:29-38`) while `config`/`csp`/`bitscan` stay `pub(crate)`. Reasonable; could tighten more modules to `pub(crate)` if not part of the documented API. |

---

## PART C — Direct answers to the owner's structural questions

1. **`csp-solver/src/py/sudoku_api.rs` — split or deprecate?** → **Split, don't deprecate** (G5). It is the live Sudoku PyO3 surface (re-exported through `py/mod.rs`), consumed by the tests-py wheel contracts. It's under the 500-line budget so there's no *forcing* pressure, but splitting into a `py/sudoku/` sub-module (enum / pyclass / free-fns) would restore isomorphism with the core `puzzles/sudoku/` layout and the futoshiki peer. Low effort.

2. **`csp-solver/wasm/src/isomorphic.rs` — needed?** → **Not by the shipped surface** (G7). It's a `full-mirror`-gated PyO3-parity reference (`isomorphic.rs:1`), excluded from the lean deploy build, with no in-repo lean consumer and the lean `sudoku.rs` deliberately not reusing it. Keep only if an external `full-mirror` consumer is confirmed; otherwise remove or move to a reference/example crate. Its 460 lines are the largest wasm file.

3. **Are the Python bindings optimal/comprehensive/well-structured vs SOTA?** → **Yes on structure, near-SOTA** (G2–G4). Optional-dep + feature gate, thin wrap-not-mirror, per-concern sub-modules all under budget. The only refinements: (a) the `sudoku_api.rs` internal split (G5); (b) confirm `pub`/`pub(crate)` on `py::errors` matches the intended public exception surface.

4. **Recursive-colocation edict, both stacks, long dirs → modules** → Rust side already colocates well (per-concern module dirs, all files < 605 lines). The one SOTA-idiom gap is `mod.rs` vs named-file modules (G1). Frontend colocates features well (G8/G9) but lacks packaged public surfaces / barrels for the `pencil/` design layer (G10) and depth-boundary lint (G11).

---

## PART D — Sources

Rust modules/style: <https://doc.rust-lang.org/reference/items/modules.html> · <https://doc.rust-lang.org/book/ch07-05-separating-modules-into-different-files.html> · <https://users.rust-lang.org/t/modules-named-mod-rs/81211>
Rust API guidelines: <https://rust-lang.github.io/api-guidelines/naming.html>
PyO3: <https://github.com/PyO3/pyo3/discussions/3501> · <https://github.com/PyO3/pyo3/blob/main/guide/src/faq.md> · <https://pyo3.rs/>
wasm-bindgen: <https://rustwasm.github.io/docs/wasm-bindgen/> · <https://rustwasm.github.io/docs/wasm-bindgen/print.html> · <https://generalistprogrammer.com/tutorials/wasm-bindgen-rust-crate-guide>
Vue: <https://vuejs.org/guide/reusability/composables> · <https://alexop.dev/posts/how-to-structure-vue-projects/> · <https://skills.sh/hyf0/vue-skills/vue-best-practices>
Monorepo/design-system: <https://feature-sliced.design/blog/frontend-monorepo-explained> · <https://vue-land.github.io/faq/folder-structure>
