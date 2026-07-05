# W0 — Build restoration, CI, git hygiene

**First; everything gates through it.** Restores the disabled CI with the campaign-amended gate set, executes the G1/G2 hygiene items, and fixes the worktree-provisioning defect that cost every Pass-3/4 agent a reset.

**Dependencies**: none. **Effort**: M (1–3 days).

---

## Scope (file-level)

### CI re-enable (Pass-1 G3, amended through Pass 4)

`.github/workflows/deploy.yml.disabled` → live workflow(s). Lanes, each with its provenance:

| Lane | Command | Why it exists |
|---|---|---|
| py compile | `cargo check --features py` under **Python ≤3.13** (PyO3 0.24 ceiling; host 3.14 fails—[`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §7.6) | the historical break class (Pass-1 N1) |
| workspace | `cargo test --workspace`—never per-crate between integration steps | the wasm `SolveConfig` E0063 break was invisible to per-crate tests ([`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 T5 amendment 4) |
| **queens-bench smoke** | `cargo bench --bench queens -- --test` (~2.1 s, runs each closure once) | the **only** lane that executes the bench-embedded `assert_eq!(92/14200)` ground truth—`cargo test` never runs benches ([`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §6) |
| wasm | `wasm-pack test --node` + clippy `--target wasm32-unknown-unknown` | Pass-1 G3 set |
| twiggy budgets | full module fail >240 KB / warn >215 KB; separate ~93 KB lean-sudoku budget | measured artifact bands (Pass-2 prototype 6: 92,897 B raw / 37,261 B gzip lean) |
| frontend | `npm ci --dry-run`; `vue-tsc` | Pass-2 prototype 8 (EUSAGE was P0) |
| **py runtime** | maturin wheel build → `uv run pytest` | the runtime gate for typed exceptions and GIL probes—compile-check alone is insufficient ([`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §7.6) |
| clippy | `-D warnings` | 3 pre-existing composition residuals block this lane until W1 fixes them (`gac/mod.rs:192`, `search.rs:246` collapsible-if; `tests/assignment_proptest.rs:42`)—documented here, fixed there |

Lanes that land later but are **reserved now**: the solution-set-invariance test + restart/nogood canaries ride W1's tree; the hardened difficulty-parity pair rides W6 (same commit as `wasm/src/sudoku.rs`).

### Build posture (standing, per the T15 refutation)

- **Default release profile retained. No `lto=fat`/`codegen-units=1`/`strip`**—the 10–25% claim was load-average-50 contention noise; quiet-host rerun shows `lto=fat+cu=1+strip` alone is **+16–17% slower** and the combined package nets ≈0% ([`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #14; W3 carries the full posture).
- **wasm-opt three-file atomicity** lands here (CI needs it): `--enable-nontrapping-float-to-int` appended, duplicate wasm-opt array under `[...profile.custom]`, `wasm-pack ≥0.14` floor, workspace-root-only `[profile.wasm-release]` (Pass-2 D9; the strip↔wasm-opt hazard reproduced on the real crates twice).
- **Panic contract tests** in the wheel lane: unwind → `PanicException` catchable; forced abort → SIGABRT negative control (Pass-2 prototype 7, verified both directions).
- Standing rule (enforced by review + the W12 tripwire): `SolveConfig`/`SolveStats` field adds sweep all exhaustive literals or use `..Default::default()`.

### Git hygiene (Pass-1 G1/G2 + Pass-3 W12 items)

- **Untrack 11,406 files** (169 MB of `web/frontend/node_modules/` + `dist/`): `git rm -r --cached`, re-anchor `.gitignore` globs to the `web/` layout, add `.dockerignore`. The stale-`dist/` false alarm in [`fe-composition.md`](../evidence/fe-composition.md) §5 is the cautionary tale. Sequence with (not after) the frontend lockfile heal—W7 seeds assume a clean tree.
- **Preserve the tranche-PNG negation** (P1 if lost): the root `*.png` mask (`.gitignore:35`) silently drops every tranche PNG on `git add`—pre-fix, staging `docs/tranches/` added 44 files and zero of the 10 OD-1 captures (`git add --dry-run`, measured 2026-07-05). `docs/tranches/.gitignore` (`!**/*.png`) re-includes them (post-fix: 55 adds, 10 PNGs) and rides the tranche commit. The re-anchor keeps this negation intact however the root globs are rewritten—those captures are the sole evidence for OD-1 and the PRT blocking defect ([`../artifacts/union-screenshots/`](../artifacts/union-screenshots/)).
- **Ignore `.claude/`**: harness session infra (worktree checkouts, thousands of files) is untracked and unignored (`git check-ignore .claude/worktrees` exits 1)—a naive `git add -A` at repo root sweeps it in. Add `.claude/` to the re-anchored root `.gitignore`.
- **`scripts/dev.sh` + `scripts/deploy.sh`**: rewrite against the `web/` layout; FAIL-EXPLICIT—no silent default to the dead NXDOMAIN host (Pass-1 G2).
- **`docker-compose.prod.yml`**: committed, versioned prod defaults per the ratified deploy topology (Pass-1 G4; W5 finalizes values).
- **Worktree base-ref provisioning fix**: every Pass-3/4 agent found worktrees at stale `bc37f4d` (73 commits behind) and had to reset—fix the provisioning script/convention so new worktrees branch from current `master`.
- **`web/api/src/app/data/sample_input.txt`**: EXCISE (dead CLI-format fixture, zero references—Pass-1 rust-puzzles P2; W10 gets its wire shape from Pydantic models, never this format).

## Acceptance gates

1. All CI lanes green on the W1 composed tree (the tranche's first real integration exercises them).
2. CI wall-time budget recorded per lane. The wheel lane is the honest cost center; the measured +36–40% cold penalty applies **only if** release profiles are ever adopted (they aren't—[`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #14).
3. `git status` clean post-untrack; `git ls-files -- 'docs/tranches/**/*.png'` returns exactly 10 (the negation survived the re-anchor); fresh-clone `docker compose build` + `npm ci` + `cargo test --workspace` all work.

## Seed artifacts

- Gate-set text: [`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §5 W0, amended by [`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §6/§7.
- The queens smoke lane already exists as a workflow step inside [`../artifacts/composed-csp-solver-v2.tgz`](../artifacts/composed-csp-solver-v2.tgz) (`csp-solver/.github/workflows/ci.yml`)—re-apply, don't re-derive.
- Everything else (untracking, scripts, compose defaults) is re-derived; no prototype diff exists for hygiene by design.

## Residual risks

- The wheel lane needs a pinned Python ≤3.13 in CI images—unverified on the actual runner (only on dev hosts).
- Untracking is a large, noisy commit; do it in its own commit with nothing else, or archaeology suffers.
- `wasm-pack test --node` is a green no-op for `wasm-morph` until W11 writes its first `#[wasm_bindgen_test]` ([`morph-excision-spec.md`](../evidence/morph-excision-spec.md) R6)—scope this lane to `wasm/` until then.
