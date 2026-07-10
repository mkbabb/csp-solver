# LANE R3 — Codebase Dissection: `csp-solver/wasm/src/isomorphic.rs`

Repo: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`
Scope: read-only. Every claim cites `file:line` (codebase) or a prior tranche artifact.

## Verdict (owner's question: "is it needed any longer?")

**No — not by any live consumer.** `isomorphic.rs` is a 460-line, feature-gated
(`full-mirror`), **zero-consumer, zero-test** generic mirror of the PyO3 surface. It is
**already compiled out of the shipped lean artifact** and out of everything the frontend
imports. **Recommended disposition: EXCISE** (delete the file + the `full-mirror` feature),
with "flip `full-mirror` out of `default`" as the minimal fallback. **All three options leave
the 93 KB lean band untouched** — isomorphic never enters that build.

---

## 1. What it is

`isomorphic.rs` (460 L — `wc -l`, was 632 L pre-W6) is the generic wasm-bindgen mirror of the
PyO3 binding surface. Its own docstring: "Isomorphic mirror of `csp-solver/src/py.rs`. Every
`#[pyclass]` becomes `#[wasm_bindgen]`…" (`isomorphic.rs:1-22`). Seven exported types
(`grep pub struct/enum`):

| Symbol | `isomorphic.rs` | Role |
|---|---|---|
| `Pruning` | :51 | enum mirror of `csp_solver::Pruning` |
| `Ordering` | :79 | enum mirror of `csp_solver::ordering::Ordering` |
| `PropagationStrategy` | :104 | enum mirror |
| `OptimizationMode` | :132 | enum — note: **not even exposed by `py.rs`** (`isomorphic.rs:124-128` says the wasm binding "goes one step further… to drive `solve_optimized` paths in commit C5") |
| `SolveConfig` | :162 | getter/setter mirror |
| `SolveStats` | :267 | read-only getter mirror |
| `Csp` | :315 | generic `Csp<BitsetDomain>` — `addVariable`/`addNotEqual`/`addAllDifferent`/`addEquals`/`addLessThan`/`addGreaterThan`/`finalize`/`propagate`/`solve`/`solveWithGiven` |

It is gated behind the `full-mirror` cargo feature (`lib.rs:30-31,39-40`;
`Cargo.toml:38-39`), which pulls in `serde-wasm-bindgen` + `serde` (`Cargo.toml:39`).
lib.rs states it is "Kept for PyO3-parity reference; excluded from the lean deploy build"
(`lib.rs:19`).

## 2. History (`git log --follow`)

- `910b6207` — scaffolded with the crate: "isomorphic mirror" born as a single god-module.
- `69ff7f71` (W1) — `py/` split upstream; mirror tracked it.
- `5530bacb` (W6, tranche-2) — "client-wasm solve: lean artifact, Worker harness" —
  introduced the `[features]`/`full-mirror` gate and the always-on `sudoku.rs`; the
  Sudoku-specific bindings were **carved OUT of `isomorphic.rs` into `sudoku.rs`** here.
  This is the W6 split the `be-colocation-manifest.md:284-285` recommended (632 L → ~420 L
  generic + ~165 L sudoku). It **already landed.**
- `ed07ba6b` (W3) — substrate excise @0.3.0 (touched, not restructured).
- Post-W6 the file is generic-only; `sudoku.rs` (299 L) and `futoshiki.rs` (346 L) are the
  always-on purpose-built flat-wire surfaces.

## 3. Who consumes it — nobody

**Frontend workers** import only the purpose-built flat-wire fns, never the generic mirror:
- `web/frontend/src/games/sudoku/solver/solver.worker.ts:26-31` imports `init`, `solveSudoku`, `generateSudoku`; calls `solveSudoku(...)` (:75).
- `web/frontend/src/games/futoshiki/solver/solver.worker.ts:14-18` imports `solveFutoshiki`, `generateFutoshiki`; calls `solveFutoshiki(...)` (:54).
- Repo-wide grep for `new Csp`, `solveWithGiven`, `addAllDifferent`, `SolveConfig`, `isomorphic`, `full-mirror` across `web/frontend/src`: **zero hits** except one doc-comment mention of `SolveConfig::default()` in `useSolver.ts:144` (prose, not an import).

**The frontend links the lean build**: `web/frontend/package.json:19` →
`file:../../csp-solver/wasm/pkg`. The committed `pkg/csp_solver_wasm_bg.wasm` is **90,602 B**
(`ls`), byte-identical to the twiggy **lean** measure (`ci.yml` "lean artifact… measured
90,602 B"). Grep of `pkg/csp_solver_wasm.d.ts` finds **no `class Csp`, no `solveAssignmentCop`,
no `class SolveConfig`** — only `solveSudoku` (:248) and `solveFutoshiki` (:230). So the
shipped artifact **does not contain the isomorphic surface at all.**

**wasm tests** do not exercise it:
- `tests/dualization.rs:21` imports `AssignmentRequest/AssignmentResponse/solve_assignment_cop` — that is `assignment.rs`, not isomorphic.
- `tests/futoshiki_parity.rs:26` imports `csp_solver::{Pruning, SolveConfig}` — the **parent crate**, used to cross-check the wasm `solveFutoshiki` output, not the wasm `isomorphic::Csp`.
- No test constructs the wasm `Csp`, `SolveConfig`, or any isomorphic enum.

**Constellation-wide**: prior tranche-2 evidence corroborates —
`synthesis-pass1.md:43` "`isomorphic.rs` (632 L, 16 exports…) has **zero consumers
constellation-wide**"; `synthesis-pass1.md:233` (N5) classes it "abandoned-in-progress
feature… superseded by morph-core's native path"; `synthesis-pass1.md:118` (W1)
"WIRE-or-EXCISE — fate decided by prototype 6." Prototype 6 shipped **Option C via
purpose-built `sudoku.rs`/`futoshiki.rs`, not the generic mirror** — `futoshiki-wave-spec.md:109`
explicitly **rejected** the generic-`Csp`-client-assembled path (option (a),
`isomorphic.rs:328-464`) in favor of a purpose-built module. The generic path lost.

## 4. What tranche-2 changed around it

- **W2 API abrogation** — killed the FastAPI/PyO3 web path. isomorphic never served the API
  (the API used PyO3 `py/`, not wasm); irrelevant to isomorphic's fate directly, but it
  removed the last "symmetry with a server" narrative that motivated a JS-side generic mirror.
- **W6 lean artifact + feature gate** — the decisive change: `full-mirror` gate added,
  `sudoku.rs` split out, `--no-default-features` lean build established (`Cargo.toml:36-38`,
  `ci.yml` twiggy lean lane). This is what made isomorphic **excluded from the deployed
  bundle** (`lib.rs:19`).
- **W6 propagate ops (beat-9)** — grew the lean band +2,839 B (`ci.yml` twiggy note,
  87,763 → 90,602 B). These ops live in `sudoku.rs`/upstream, **not** isomorphic; isomorphic
  only carries them transitively in the *full* module.

## 5. Feature gating & the 93 KB band — per option

- Lean deploy build = `wasm-pack build … --no-default-features` (`Cargo.toml:36-38`;
  `ci.yml` "lean sudoku artifact" step). It compiles **`sudoku` + `futoshiki` only** —
  isomorphic (`full-mirror`) and assignment are **out**. Lean measures 90,602 B against the
  **fail >93,000 B** gate (`ci.yml`).
- Full module = default features (Makefile `wasm` target builds default;
  `ci.yml` twiggy "full module" step) = 220,554 B, fail >240 KB / warn >230 KB. isomorphic
  contributes here.
- **Every disposition below leaves the 93 KB lean band byte-identical** — isomorphic is not in
  that compile. Excise only moves the *full* 240 KB band (downward, safely).

## 6. Disposition options + blast radii

### Option A — EXCISE (recommended)
Delete `isomorphic.rs`; delete the `full-mirror` feature.
- **Files**: remove `isomorphic.rs`; `lib.rs:30-31,39-40` cfg lines; `Cargo.toml:38-39`
  `full-mirror` entry (change `default = ["full-mirror","assignment"]` → `["assignment"]`).
- **serde stays** — `assignment` also enables `dep:serde-wasm-bindgen`+`dep:serde`
  (`Cargo.toml:40`), and assignment stays (§below). No dependency removal, no lockfile churn.
- **Lean band**: unaffected (90,602 B).
- **Full band**: shrinks (isomorphic + its serde-json codepaths drop from the default build);
  stays well under 240 KB.
- **Consumer breakage**: none — zero consumers repo/constellation-wide (§3).
- **Test breakage**: none — no test touches it (§3).
- **Loss**: the "PyO3-parity reference" (`lib.rs:19`). This is **documentary only** — there is
  no automated parity assertion between wasm `Csp` and py `Csp`; `py/` is the source of truth
  with real wheel tests (`ci.yml` py-runtime lane). Docs to update: `wasm/README.md:18,76,106`,
  `lib.rs:16-19`, `CHANGELOG.md`.
- **Note vs. `assignment.rs`**: assignment *also* has "no production call site"
  (`synthesis-pass1.md:43`) BUT has a wasm test (`dualization.rs`), a documented sibling
  consumer (bbnf-buddy/morph), and an explicit **keep** mandate (`morph-excision-spec.md §4`,
  cited `be-colocation-manifest.md:210`). isomorphic has **none** of these three — it is the
  strictly weaker case. Do not conflate their fates.

### Option B — FOLD into `sudoku.rs` + `futoshiki.rs` (reject)
Regressive. isomorphic is the **generic** config/enum/`Csp` mirror; sudoku/futoshiki are
game-specific flat-wire surfaces. Folding a generic mirror into game modules would (a) violate
the re-affirmed colocation edict (game-specific isolation — the W6 split moved the *opposite*
direction, `be-colocation-manifest.md:284-285`), (b) duplicate the four enums across two files
or force a shared third file anyway, (c) drag `full-mirror`/serde into the always-on lean
modules and **break the 93 KB band**. Reject outright.

### Option C — KEEP as-is (status quo, feature-gated)
- **Rationale for keeping**: cheap (compiled out of lean/deploy); a latent generic-solver
  surface if a future JS consumer wants arbitrary CSPs beyond the two games; nominal
  PyO3-parity documentation.
- **Cost**: a 460-line untested, unconsumed module + a whole `full-mirror` feature axis that
  the default `wasm-pack build`/Makefile and the full-module CI band still compile and must
  keep green. Carries `OptimizationMode` for a "commit C5" (`isomorphic.rs:127-128`) that never
  arrived. Violates the tranche-III "no dead code / god-module" hygiene the owner is invoking.
- Verdict: weakest option; keep only if the owner asserts an imminent generic-JS consumer.

## 7. "If partially, which parts?"

No proper subset is live. All seven exports form one coherent generic mirror with a **single**
(documentary) consumer story and **zero** code consumers. There is no enum or method with an
independent live caller to preserve. It is whole-unit excise or whole-unit keep.

## 8. One-line recommendation

**Excise `isomorphic.rs` and the `full-mirror` feature** (Option A). Zero consumer/test
breakage, zero effect on the 93 KB lean band, shrinks the full-module band, and retires a
460-line dead mirror whose only claimed value (PyO3 parity) is documentary and better served by
`py/` + its wheel tests. Keep `assignment.rs` — its disposition is separate and already
mandated (`morph-excision-spec.md §4`).
