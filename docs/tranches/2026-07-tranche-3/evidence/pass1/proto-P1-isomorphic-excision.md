# Prototype P1 — `wasm/src/isomorphic.rs` + `full-mirror` excision blast radius

**Lane key:** proto-P1-isomorphic-excision
**Worktree:** `/Users/mkbabb/.../.claude/worktrees/wf_8f3bd831-d64-10` (isolated; nothing ships)
**Toolchain:** wasm-pack 0.15.0, cargo 1.97.0-nightly, wasm-opt at `/opt/homebrew/bin/wasm-opt`

## The one question

Does excising `wasm/src/isomorphic.rs` plus the `full-mirror` feature break anything
**outside itself**? Concretely: delete `isomorphic.rs`; drop `full-mirror` from
`wasm/Cargo.toml` (`default = ["assignment"]`); remove the two cfg-gated `lib.rs` lines;
leave `assignment.rs` strictly untouched.

## What I built / probed

All four edits applied in the worktree, `assignment.rs` untouched:

1. `rm csp-solver/wasm/src/isomorphic.rs`
2. `wasm/Cargo.toml:38-40` — `default = ["full-mirror", "assignment"]` → `default = ["assignment"]`;
   deleted the `full-mirror = ["dep:serde-wasm-bindgen", "dep:serde"]` line. `serde`/`serde-wasm-bindgen`
   stay (still pulled by `assignment`, `Cargo.toml:40`) — **no lockfile churn** (the post-excision
   default build re-compiled `serde-wasm-bindgen v0.6.5`, confirming the graph is intact).
3. `wasm/src/lib.rs:30-31` — removed `#[cfg(feature = "full-mirror")] mod isomorphic;`
4. `wasm/src/lib.rs:39-40` — removed `#[cfg(feature = "full-mirror")] pub use isomorphic::*;`

Confirmed `solveAssignmentCop` lives in `assignment.rs:125-126` under the **`assignment`** feature,
independent of `full-mirror` (grep). The wasm tests consume only the assignment/futoshiki surface —
`dualization.rs:21` imports `solve_assignment_cop` from the parent crate; `futoshiki_parity.rs:26`
imports `Pruning`/`SolveConfig` from `csp_solver` (the core crate), **not** from `isomorphic`. No test
touches `class Csp`, `SolveConfig`, `SolveStats`, `PropagationStrategy`, or `OptimizationMode` (the
isomorphic-only surface). This reconfirms synthesis §0-C-α with fresh evidence.

## Gate results (quoted)

### GATE 1 — `cargo test --workspace` GREEN
```
$ cargo test --workspace
... 20 "test result: ok" lines, every one "0 failed"; largest suites 42 passed/6 ignored,
   16, 13, 13, 11, 8, 7, 7, 7, 6, 6, 6, 5, 5, 4, 4, 2 passed; Doc-tests csp_solver 4 passed
   (grep "0 failed" → 20 matches; zero "FAILED"/"error[")
```

### GATE 2 — `wasm-pack test --node` GREEN
```
$ wasm-pack test --node
  tests/dualization.rs      → test result: ok. 5 passed; 0 failed
  tests/futoshiki_parity.rs → test result: ok. 9 passed; 0 failed
  Doc-tests csp_solver_wasm → 0 tests
```

### GATE 3 — default-features build succeeds, `solveAssignmentCop` retained, size under band
```
$ wasm-pack build --target web --profile wasm-release --out-dir /tmp/pkg-post-default
  ✨ Done — pkg ready
  wasm size: 198,652 B          (baseline WITH isomorphic: 222,436 B → −23,784 B / −10.7%)
  d.ts:  solveAssignmentCop (line 239) + assignmentSentinel (139) PRESENT
         solveSudoku / solveFutoshiki PRESENT
         class Csp / SolveConfig / SolveStats / PropagationStrategy  → GONE
```
Full-module 198,652 B is under **both** CI twiggy bands — fail >240,000 B and warn >230,000 B
(`.github/workflows/ci.yml:296,240`). Baseline 222,436 B was already under the fail band; excision
also clears it further below the warn band.
**Band correction for W-G:** CLAUDE.md states "warn >215 KB" but the live CI band is **warn >230 KB**
(`ci.yml:240,288`). The synthesis §1.3 "240 KB gate" is correct; the 215 figure is stale doc.

### GATE 4 — lean `--no-default-features` byte-identical to 90,602 B
```
$ wasm-pack build --target web --profile wasm-release --no-default-features --out-dir /tmp/pkg-post-lean
  wasm size: 90,602 B
$ cmp <lean> <main-tree pkg/csp_solver_wasm_bg.wasm>  → BYTE-IDENTICAL
  SHA-256 both: 44e869b61890f58b2d2bc4682982055771fb5971ae96dcaa45302c68b3414cbf
```
Proves isomorphic never entered the lean compile (synthesis §1.3 / R3 §5 confirmed empirically).

### Bonus — clippy clean both branches
```
$ cargo clippy -p csp-solver-wasm --all-targets          → Finished, 0 warnings
$ cargo clippy -p csp-solver-wasm --no-default-features   → Finished, 0 warnings
```

## Verdict: **GO**

Excision is fully self-contained. Nothing outside `isomorphic.rs` breaks: workspace tests green,
node wasm tests green, both feature branches compile clean, `solveAssignmentCop`/`assignmentSentinel`
preserved, lean artifact bit-for-bit unchanged, full module shrinks ~10.7%. `assignment.rs` untouched.

### One shape note (not a blocker)
The charter/synthesis call the 90,602 B reference "the **committed** `pkg/`". `pkg/` is **gitignored**
(`git check-ignore csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` → hit; `git ls-files …/pkg/` → empty).
The 90,602 B artifact is the **file:-linked** build the frontend consumes live
(`web/frontend/package.json:19` → `file:../../csp-solver/wasm/pkg`), not a git blob. Byte-identity
still holds against it. **W-B must rebuild and refresh that file:-linked `pkg/`** after the edit so the
frontend keeps resolving — the lean build is byte-identical so the FE is unaffected, but the pkg dir is
a live, ignored, hand-refreshed artifact.

## Doc-site co-edit list for W-B (SUPERSET of the charter's five)

Charter named: `wasm/README.md:18,76,106`, `lib.rs:16-19`, `Cargo.toml:6`. Grep surfaced more residuals
(all `file:line` verified post-excision, excluding `pkg/`/`target/`):

| File:line | Reference | Disposition |
|---|---|---|
| `wasm/Cargo.toml:6` | description "…isomorphic mirror of the Python binding" | rewrite description |
| `wasm/Cargo.toml:34` | `# full-mirror = the generic Csp/SolveConfig/SolveStats mirror` (stale features comment, survives my edit) | delete line |
| `wasm/src/lib.rs:16-19` | `isomorphic` layer bullet in module doc | delete bullet |
| `wasm/README.md:18` | `isomorphic` (feature `full-mirror`) surface bullet | delete |
| `wasm/README.md:24` | `default = ["full-mirror", "assignment"]` literal | update to `["assignment"]` |
| `wasm/README.md:76` | "available only in the `full-mirror` build" + Csp example (76-91) | delete section |
| `wasm/README.md:106` | layout tree `isomorphic.rs` row | delete row |
| `wasm/src/sudoku.rs:13,32-33,44` | 4 comments citing `isomorphic.rs`/`isomorphic::errors`/`full-mirror` as the rationale for sudoku.rs being self-contained — now **dangling** (the file they contrast against is gone) | reword to drop the dead contrast |
| `csp-solver/README.md:53` | parent-crate README: "the `full-mirror` feature adds the generic `Csp` builder" | delete clause |
| `csp-solver/src/error.rs:11` | core doc: "downstream binding (`py/`, wasm's `isomorphic.rs`)" — **dangling** file ref | drop the wasm arm |
| `wasm/CHANGELOG.md:7-8,27,34` | historical 0.1.0/0.2.0 entries | keep as history; add a new removal entry |
| `csp-solver/CHANGELOG.md:76` | historical | keep; note removal in new entry |

**NOT co-edit targets** (English adjective "isomorphic", not the module): `config.rs:52`,
`domain/bitset.rs:1`, `py/futoshiki_api.rs:4`.

## What the critique pass should attack

1. **Q1 — the published npm tarball.** I can verify only the *local* file:-linked `pkg/` (it is the
   **lean** build: d.ts has `solveSudoku`/`solveFutoshiki` only, no `class Csp`). I cannot fetch the
   published **npm 0.2.0** tarball from this worktree. If npm shipped the *full* module (has `class
   Csp`), excising `full-mirror` is a breaking npm change needing a semver bump. Critique must confirm
   the npm tarball's d.ts before W-B lands.
2. **Doc drift, pre-existing.** `wasm/README.md:49` claims "The committed `pkg/` is the default
   (full-feature) build" — but the actual file:-linked `pkg/` is the **lean** build (verified: no
   `class Csp`). This contradiction predates the tranche; it surfaces during the co-edit and should be
   corrected in the same pass.
3. **Version stamp.** `wasm/Cargo.toml:3` is still `0.2.0` while the core crate is `0.3.0`
   (`csp-solver/Cargo.toml`). The bump decision rides W-B — flag whether the wasm crate version tracks
   the workspace or stays independent (it's `publish = false`, so npm version is set elsewhere).
4. **serde retention.** Confirmed `serde`/`serde-wasm-bindgen` stay via `assignment` — no lockfile
   churn. If a future wave ever drops `assignment` too, the lean build already excludes serde; nothing
   to pre-empt now.
5. **bbnf-buddy consumer.** Reconfirmed the mirror has zero consumers: `solveAssignmentCop` (the one
   bbnf-buddy import) is in `assignment.rs`, not `isomorphic.rs`. Critique need only re-verify no
   out-of-tree code imports the generic `Csp`/`SolveConfig` from the wasm package.
