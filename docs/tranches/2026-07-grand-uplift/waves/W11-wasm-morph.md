# W11 — Morph: pre-excision prep + excision to `mkbabb/morph`

**Two phases, deliberately decoupled**: (1) land the morph-core improvements *inside csc411* so they travel with the crate; (2) cut `morph-core` + `wasm-morph` to a fresh sibling repo. [`morph-excision-spec.md`](../evidence/morph-excision-spec.md) is the spec of record—including its premise corrections: **there is no `file:` dep to migrate** (bbnf-buddy consumes `@mkbabb/morph` from the npm registry since `aef9eae`), and the excision is **independent of the csp-solver repo split** (next tranche).

**Dependencies**: phase 1 ← W2 (the align decomposition verified on the composed base); phase 2 ← W12 (`csp-solver 0.2.0` must be live on crates.io first). **Effort**: phase 1 S–M (1–2 days); phase 2 S (≤1 day, mostly checklist).

---

## Phase 1 — this tranche, in csc411 (safe regardless of excision timing; spec §3.1)

- **Registry-dep readiness, verify don't rebuild**: `morph-core/Cargo.toml` already carries the dual-spec idiom (`csp-solver = { version = "0.1.0", path = ".." }`). Extract a scratch copy outside the workspace, strip the `path` key, build + test against the **live crates.io** release—proves zero path-only leakage before excision day, when there's no path dep to debug against.
- **Land the `align.rs` decomposition for real** (`pass2/morph-lazy-cost.diff`, re-verified under the composed kernel by `pass3/builder-ac3-x-morph-lazy.md`): `align.rs` (512 L) → `align/{mod,tier1,tier2,pairwise}.rs` (80/112/137/202 L), centroid memoization, real scratch arena, lazy cost-matrix. Do it **before** the move so the decomposition + its coverage travel with the crate.
- **`point_pairs` wire-through (Rust side)**: `WireHints` gains `point_pairs: Vec<WirePointPair>` (`#[serde(default)]`, camelCase—field names verified identical to bbnf-buddy's already-declared `CorrespondenceHints.pointPairs`); `convert_hints` maps into `morph_core::PointHintPair`. Additive, wire-compatible. Closes Pass-1 W4's silently-dropped-hints FAIL-EXPLICIT.
- **Write the first `#[wasm_bindgen_test]`s** (zero exist today despite the declared dev-dependency): `alignForms()` round-trip smoke + a `point_pairs`-forwarding regression—same PR as any CI step that runs them (spec R6: never land the gate and the test separately).
- CHANGELOG split prep (§1.3); `Makefile` drops the vestigial `pkg/.gitignore`-strip.
- **Deferred, contra a literal brief reading (spec §3.1, R7)**: the Float64Array typed-array wire—spec'd, unbuilt, unmeasured; it becomes the *first post-excision PR* once the new repo's CI can gate it.

## Phase 2 — excision day (atomic; spec §3.2–§3.4)

1. New repo `mkbabb/morph` (confirmed not to exist yet—clean slate): `morph-core/` + **`morph-wasm/`** (directory renamed from `wasm-morph/`; **Cargo `[package] name = "morph"` and npm `@mkbabb/morph` UNCHANGED**—OD-3; `wasm-pack` derives the npm name from the package name, so a crate rename would silently republish as `@mkbabb/morph-wasm` and break every bbnf-buddy import at runtime, spec R1).
2. `morph-core/Cargo.toml`: strip `path = ".."`; `csp-solver = "0.2"` (0.2.0 is self-consistent with the kernel wave's breaking surface: `Mrv` rename, `backjumping` removal, default changes—spec §2.1). **If 0.2.0 isn't live, excision day does not proceed.** The consumed API surface is one call site (`csp_solver::assignment()` + 7 builder methods + `AssignmentSolution.assign`)—stable post-kernel on structural *and* adversarially-measured grounds (spec §2.2).
3. New root workspace + `README`/`CHANGELOG`/`LICENSE` + CI (**net-new**, nothing to port): fmt/clippy/build/test (31 morph-core tests live today) + bench compile-check; wasm lane: `wasm-pack build` + `wasm-pack test --node` + twiggy with a first-run baseline + >10% budget + **`jq -e '.name == "@mkbabb/morph"' morph-wasm/pkg/package.json`** (the R1 tripwire). `release.yml` split—no `sleep 60` (cross-repo ordering is a sequencing rule, gated by a `cargo search csp-solver` pre-flight, R2).
4. In csc411: delete both directories; trim workspace `members` to `["csp-solver", "csp-solver/wasm"]`; regenerate `Cargo.lock`; `cargo build --workspace` + `cargo metadata` clean **before** the deletion commit is done (R4); Docker unaffected (verified: `web/api/Dockerfile` copies `csp-solver/` wholesale, no morph paths).
5. Tag the pre-deletion commit **`pre-morph-excision`**—the permanent archaeology pointer.
6. **Fresh cut, not history filter** (spec §3.3—evidence-specific, not a blanket policy): 9 commits total, 8 cleanly scoped, ~3,100 lines/21 files, no external consumer of the git history; initial commit message states provenance ("Import morph-core + morph-wasm from csc411 @ `<pre-morph-excision sha>`"). Explicitly the *opposite* of the lean for the full csp-solver split (16.8K lines, real multi-month history).
7. `@mkbabb/morph` republish (recommend 0.2.0) rides W12's window; bbnf-buddy's one-liner (`pointPairs: req.hints.pointPairs ?? []` + range bump) is an ordinary sibling-repo dep bump, not excision mechanics.
8. **Owner action (spec R5)**: provision `CARGO_REGISTRY_TOKEN` + `NPM_TOKEN` on the new repo before the first tag push.

## Acceptance gates

| Gate | Value | Evidence |
|---|---|---|
| Registry-only build | scratch morph-core builds + tests against crates.io csp-solver, zero path leakage | spec §3.1 (the pre-cut insurance) |
| Decomposition | 170/170 workspace + proptest oracle green + ≥4× pipeline-bound corpus (measured 10.2–12×) | `pass2/morph-lazy-cost.md`, `pass3/builder-ac3-x-morph-lazy.md` |
| wasm tests | ≥1 real `#[wasm_bindgen_test]` incl. point_pairs forwarding—never a green no-op | spec R6 |
| npm identity | the `jq` assertion in CI; `pkg/package.json` name = `@mkbabb/morph` | spec R1 |
| csc411 post-cut | `cargo build --workspace` + `cargo metadata` + Docker build clean | spec R4 |
| New-repo CI | all lanes green on first push; twiggy baseline recorded | spec §1.4 |

## Seed artifacts

- `pass2/morph-lazy-cost.diff` — applies clean on the composed base (verified); re-apply.
- [`morph-excision-spec.md`](../evidence/morph-excision-spec.md) — the full checklist, risk table R1–R7, rollback ladder (every step independently reversible; nothing live to cut over).

## Residual risks

- R1 (npm rename) is mitigated but stays the highest-impact failure—the CI assertion is the backstop; OD-3 is the owner's chance to override *deliberately*.
- R2 (publish ordering) fails loud (crates.io rejects deps on unpublished versions)—wasted CI minutes, not corruption.
- The spec doesn't re-verify that W1/W2 landed—phase 2's pre-flight (`cargo search csp-solver` showing 0.2.0) is the enforcement.
