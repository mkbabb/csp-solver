# Critique — proto-P1-isomorphic-excision (REFUTE-BY-DEFAULT)

**Lane:** crit-proto-P1-isomorphic-excision
**Target claim:** "Excising `wasm/src/isomorphic.rs` + the full-mirror feature is fully self-contained — nothing outside the file breaks … ALL GATES GREEN."
**Method:** re-derived every material claim from the live tree (read-only; no rebuild — the main tree hosts a closing wave and wasm-pack builds are not reproducible from here). Byte-figure and test-run claims that require a compile are classified UNVERIFIABLE with a soundness argument.

## Verdict up front

The **core decision is sound**: isomorphic/full-mirror excision is self-contained *at the code-graph level* — no internal module, no test, and no shipped frontend artifact depends on the isomorphic surface. But the word **"fully"** must die: two outside-the-file residuals (CI comments) are omitted from the co-edit list, and the npm-tarball semver question is a genuine unverified external-consumer risk the prototype itself flags. Author with qualifications, not verbatim.

## Claim-by-claim

### C1 — "No internal module depends on isomorphic" → **CONFIRMED**
`sudoku.rs`/`futoshiki.rs`/`assignment.rs` import `Pruning`/`Ordering`/`SolveConfig` **from the core crate `csp_solver`**, not from the wasm isomorphic wrappers (`sudoku.rs:25,27`; `futoshiki.rs:31,35`). No module defines a colliding wasm `Pruning`/`Ordering`/`SolveConfig`/`SolveStats`/`Csp`/`PropagationStrategy`/`OptimizationMode` (grep over all three modules: zero hits). `pub use isomorphic::*;` (`lib.rs:40`) therefore re-exports names that no in-crate code path resolves against. Removing the glob cannot break name resolution. Confirmed independently.

### C2 — "No test depends on isomorphic" → **CONFIRMED**
`tests/dualization.rs:21` imports `solve_assignment_cop`/`AssignmentRequest`/`AssignmentResponse` (all in `assignment.rs`). `tests/futoshiki_parity.rs:26,27` imports core `Pruning`/`SolveConfig` and `generate_futoshiki`/`solve_futoshiki` (in `futoshiki.rs`). Neither references `Csp`/isomorphic. Tests would stay green by construction.

### C3 — line-number and edit accuracy → **CONFIRMED**
`lib.rs:30-31` (`#[cfg(feature="full-mirror")] mod isomorphic;`) and `lib.rs:39-40` (`… pub use isomorphic::*;`) exact. `Cargo.toml:38` default, `:39` full-mirror def, `:40` assignment. `solve_assignment_cop` at `assignment.rs:126` (prototype said 125-126 — off by one on the `pub fn` line, but the function is under `#[wasm_bindgen]`/`assignment` feature as claimed). Trivial slip, non-material.

### C4 — "serde stays via `assignment`, no lockfile churn" → **CONFIRMED**
`serde`/`serde-wasm-bindgen` are `optional=true` (`Cargo.toml:19-20`); `assignment = ["dep:serde-wasm-bindgen","dep:serde"]` (`:40`) keeps them in the default graph after `full-mirror` is deleted. Correct.

### C5 — "lean `--no-default-features` build byte-unaffected" → **CONFIRMED (by construction)**
isomorphic is gated `#[cfg(feature="full-mirror")]`; `full-mirror` is a *default* feature, so `--no-default-features` never compiled it. Excision cannot alter the lean artifact. On-disk `pkg/csp_solver_wasm_bg.wasm` = **90,602 B** (fresh, Jul 10 14:14), matching the prototype's lean figure. The specific SHA-256 (`44e869…`) is UNVERIFIABLE without a rebuild, but the size and the gating logic hold. Note: CLAUDE.md's "87,853 B" lean figure is the **stale** one (pre-futoshiki-in-lean); the prototype's 90,602 B is right.

### C6 — "no CI invocation uses `--features full-mirror`" → **CONFIRMED**
CI wasm clippy runs `cargo clippy -p csp-solver-wasm --target wasm32 -- -D warnings` (`ci.yml:236`, default features). Full-module twiggy build `wasm-pack build … --profile wasm-release` (`ci.yml:287`, default features) → after excision builds sudoku+futoshiki+assignment, still a valid build, still under bands. Lean build `--no-default-features` (`ci.yml:305`) unaffected. No `--features full-mirror` / `--all-features` anywhere in CI. No functional CI break.

### C7 — dangling doc refs (error.rs:11, README, sudoku.rs comments) → **CONFIRMED, list INCOMPLETE**
`error.rs:11` does reference `wasm's isomorphic.rs` — dangles post-excision (correctly in the co-edit list). README/sudoku.rs/Cargo.toml residuals all verified. **BUT the co-edit list is NOT the "superset" it claims** — it omits two CI-comment residuals:
- `ci.yml:243` — "csp-solver/wasm has no [features]/full-mirror flag; serde deps are not optional; there is no --no-default-features lean" — this comment is **already stale** (contradicted by current Cargo.toml) and references full-mirror.
- `ci.yml:302-303` — "Lean deploy artifact (W6): sudoku-only surface, full-mirror compiled out" — references full-mirror; also independently stale ("sudoku-only" but futoshiki rides lean per `lib.rs:11-14`).
Non-breaking (comments), but the doc-truth/recursive-colocation edict wants them fixed in the same pass. **Blast-radius omission.**

### C8 — CI band correction ("warn >230 KB, not 215") → **CONFIRMED (content); citation loose**
Enforced band is fail >240,000 B / warn >230,000 B (`ci.yml:296-300`). CLAUDE.md's "warn >215 KB" is stale. The prototype's cited anchors `ci.yml:240,288` point at *comment* lines, not the enforcing check (that's `:296`/`:299`). Content right, line-anchor imprecise — CORRECTED.

### C9 — size deltas 222,436 → 198,652 B (−10.7%) → **UNVERIFIABLE (non-material)**
Requires a wasm-pack rebuild I can't reproduce read-only. Both figures sit under the 240 KB fail band regardless, so the GO decision does not hinge on the exact numbers — but they **must be re-measured in the authoring wave, not copied verbatim.**

### C10 — Gate 1 "20 test-result lines, 0 failed" / Gate 2 "5+9 passed" → **UNVERIFIABLE (low risk)**
Not independently reproduced (tree busy). Logically forced green by C1/C2 (excision touches nothing any test imports). Accept as plausible; do not author the exact counts as settled facts.

### C11 — "the committed pkg/ is byte-identical" framing → **CORRECTED (prototype self-corrects)**
`pkg/` is gitignored (`git check-ignore` hits; `git ls-files …/pkg/` empty) and frontend consumes it via `file:../../csp-solver/wasm/pkg` (`package.json:19`). The prototype's own shape-note fixes the charter's "committed pkg/" language and flags that **W-B must rebuild the file:-linked pkg**. Correct and important.

### C12 — npm published tarball (Q1) → **UNVERIFIABLE — the one real external-consumer risk**
CI builds the **full** module by default (`ci.yml:287`) but **no `npm publish` step exists** in CI (grep: zero) — publishing is manual/out-of-band. If npm `@mkbabb/csp-solver-wasm` 0.2.0 shipped the full module (with `class Csp`), then dropping `full-mirror` from default is a **breaking change for any external `import { Csp }` consumer** and needs a semver decision. Known consumers are safe (frontend → lean file: link, no `class Csp`; bbnf-buddy → `solveAssignmentCop` in `assignment.rs`), and `lib.rs:19` frames isomorphic as "kept for PyO3-parity reference" (not a product surface). Practical risk low, but **unconfirmed** — must fetch the npm 0.2.0 tarball's `.d.ts` before the wave lands.

## Overengineering / mandate bar
The mandate asks "is isomorphic.rs needed any longer?" The evidence answers cleanly: zero internal consumers, zero test consumers, zero shipped-artifact consumers; it exists only as a PyO3-parity mirror never wired to a live path. Deletion is the correct simplification, not overengineering. `assignment.rs` (the one live bbnf-buddy surface) is correctly excluded from the blast.

## Convergence: **77%**
Deductions:
- **−10%** npm-tarball semver risk unverified (C12) — a genuine external-consumer unknown the wave must close first.
- **−5%** co-edit list omits `ci.yml:243,302` full-mirror residuals (C7); "superset" claim false.
- **−3%** size deltas (222,436/198,652/−10.7%) unverified, must be re-measured not copied (C9).
- **−3%** wasm-crate version/semver decision (0.2.0 vs core 0.3.0) deferred to W-B, unresolved (`Cargo.toml:3`).
- **−2%** Gate 1/2 run outputs not independently reproduced (C10; low risk).

## kill_list (claims that must not be authored verbatim)
1. "fully self-contained — nothing outside the file breaks" — strike "fully": CI comment residuals + npm question are outside the file and open.
2. The co-edit list billed as a "SUPERSET of the charter's five" / complete residual sweep — it omits `ci.yml:243` and `ci.yml:302-303`.
3. Byte figures 222,436 B / 198,652 B / −10.7% as settled facts — re-measure in-wave.
4. Gate 1 "20 test-result lines" and Gate 2 "5/9 passed" as verified counts — treat as expected-green, not measured-here.
5. Band citation `ci.yml:240,288` — repoint to the enforcing check `ci.yml:296-300`.
