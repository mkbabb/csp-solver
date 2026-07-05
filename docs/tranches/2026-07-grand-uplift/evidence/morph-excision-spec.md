# Morph Excision — Wave Spec (Pass 4, closure)

**Agent**: `morph-excision-spec` · Pass 4 · **Date**: 2026-07-05
**Repo**: `CSC411_HW2_ProgrammingQuestion` @ `91bb8b0` (primary tree read-only throughout; `git log -1` re-verified clean, no stale-worktree defect on this beat)
**Sibling repos read** (read-only, never pushed): `/Users/mkbabb/Programming/bbnf-buddy` (npm consumer of `@mkbabb/morph`), `/Users/mkbabb/Programming/bbnf-lang` (spot-checked for morph references — none found)
**Inputs**: `pass1/wasm-morph-totality.md`, `pass2/morph-lazy-cost.md`, `pass2/bbnf-sync-gate.md`, `pass3/builder-ac3-x-morph-lazy.md`, `pass3/synthesis-pass3.md` (W9/W10 skeleton), direct reads of `csp-solver/{morph-core,wasm-morph,wasm}/Cargo.toml`, `csp-solver/CHANGELOG.md`, `csp-solver/.github/workflows/{ci,release}.yml`, `git log`, `gh repo view`, and bbnf-buddy's `package.json` / `package-lock.json` / `src/composables/wasm/morph.ts` / `src/forms/align-types.ts`.

**Verdict in one line**: the excision is small, low-risk, and largely pre-plumbed — `morph-core`'s `Cargo.toml` already carries the version-pinned dependency shape the excision needs, the consumer (`bbnf-buddy`) is **already** a registry dependency (the "file: dep" framing in prior intel is stale, corrected below), and the whole motion is **independent of** the separately-scoped "csp-solver → its own repo" motion from `bbnf-sync-gate.md`. Two naming ambiguities in the brief needed resolution (documented, not silently picked) and one scope item (the Float64Array typed-array wire) is recommended **out** of the gating path because it is unbuilt and unmeasured.

---

## 0. Premise corrections (read this before the plan — it changes what "migration" means)

Attacking the brief's own framing first, since two of its background assumptions are stale:

1. **"bbnf-buddy file:-dep migration" — there is no file: dep to migrate.** Direct read of `bbnf-buddy/package.json` (`"@mkbabb/morph": "^0.1.1"`) and `package-lock.json` (resolves `@mkbabb/morph` as a registry-versioned entry, not a `file:` specifier) confirms `wasm-morph-totality.md`'s own correction (§4 there): bbnf-buddy has consumed `@mkbabb/morph` from the **npm registry** since it was first published (commit `aef9eae`, 2026-05-28). `node_modules/@mkbabb/morph` is a real installed directory (`README.md`, `morph.d.ts`, `morph.js`, `morph_bg.wasm`, `package.json` — no symlink). The "file: dep" phrasing traces to one **historical commit message** in this repo — `871792e4 feat(wasm-morph): wasm-pack build + bbnf-buddy file: dep` — describing the *original* prototype wiring before the npm publish existed; bbnf-buddy's own (separate, unversioned-here) history moved it to the registry range once `@mkbabb/morph@0.1.1` went live, and that's what's on disk today. **There is nothing to migrate on this axis** — npm dependency resolution is already decoupled from the crate's git location; the excision changes *where the source lives*, not *how bbnf-buddy fetches the built artifact*.
2. **The morph excision is architecturally independent of the "csp-solver → its own repo" motion** (`bbnf-sync-gate.md` §3, deferred to "next tranche," gated on the stale-`mkbabb/csp-solver`-remote landmine). That motion is about `csp-solver/` (the whole ~16.8K-line workspace directory) getting its own git history and GitHub remote. This spec is about `csp-solver/morph-core` + `csp-solver/wasm-morph` — two much smaller, much younger sub-crates — moving to a *different*, *new* repo (`morph`) that depends on `csp-solver` **the same way any third-party crate would**: via `crates.io`, a version range, zero path coupling, zero git-history coupling. `csp-solver@0.1.0` is **already live on crates.io** (confirmed independently today: `gh repo view mkbabb/csp-solver --json pushedAt` → still `2026-03-18`, i.e. unchanged since `bbnf-sync-gate.md`'s own check; the crate itself publishes from CI on tag push, orthogonal to whether the *directory* ever gets its own remote). **The morph excision does not need to wait for the csp-solver repo-split to land**, and does not need to touch `origin` at all. Keep these two motions in separate PRs/decisions; conflating them was the one place the brief's phrasing could mislead an implementer into over-scoping this tranche.
3. **`bbnf-lang` (the other sibling, Rust) has zero relationship to morph.** Direct grep of `bbnf-lang` for `morph` (excluding `target/`) hits only `isomorphic*`/`morphism`-adjacent false positives (`bbnf-path-ts/tests/isomorphic_path_error.rs`, etc.) — no vendored copy, no dependency, no reference. `bbnf-sync-gate.md`'s entire sync-gate/DO-NOT-BREAK apparatus is about `csp-solver`'s core solver surface vendored into `bbnf-lang/crates/csp-solver`; it says nothing about morph and nothing there needs updating for this excision.
4. **Naming ambiguity in the brief, resolved with a recommendation, not silently picked.** The top-level directive reads "rename wasm-morph -> morph"; item (1) of the assignment reads "crates morph-core + **morph-wasm** (renamed from wasm-morph)." These aren't the same target. Resolution (§2.2) recommends **directory** `morph-wasm/`, Cargo **package/lib name unchanged at `morph`** — reasoning below. Flagging this explicitly because a literal "rename the crate to `morph-wasm`" reading has a real, unverified risk of silently renaming the published npm package (§2.2, §6 risk R1).

---

## 1. Target repo shape

### 1.1 Layout

```
morph/                              (new repo, root)
├── Cargo.toml                      # [workspace] members = ["morph-core", "morph-wasm"]
├── CHANGELOG.md                    # repo-level: excision provenance + cross-crate release notes
├── README.md                       # what this repo is, how it relates to csp-solver (crates.io dep, not a fork)
├── LICENSE                         # MIT, carried over verbatim
├── .github/workflows/
│   ├── ci.yml                      # NEW — see §1.4, nothing like this exists today
│   └── release.yml                 # adapted from csp-solver's (crates.io flow drops to 1 crate; npm flow drops to 1 pkg)
├── morph-core/
│   ├── Cargo.toml                  # csp-solver = "0.2"  (registry-only, NO path key)
│   ├── CHANGELOG.md                # per-crate — owner edict requirement
│   ├── src/{lib,align/{mod,tier1,tier2,pairwise},bezier,contour,procrustes,resample,scratch,signature,types}.rs
│   ├── tests/{align,geometry_proptest,primitives}.rs
│   └── benches/{align,primitives}.rs
└── morph-wasm/                      # renamed from wasm-morph (directory only — see §2.2)
    ├── Cargo.toml                  # [package] name = "morph" (UNCHANGED — see §2.2); morph-core = { path = "../morph-core" }
    ├── CHANGELOG.md                # per-crate
    ├── Makefile                    # wasm-pack build; drop the pkg/.gitignore-strip (P3 nit from wasm-morph-totality — pkg/ is gitignored correctly already, strip is vestigial)
    ├── src/{lib,wire}.rs
    └── pkg/                        # build output, gitignored (unchanged policy — this crate already does it right)
```

Two crates, matching the owner edict's naming: `morph-core` (pure Rust, no wasm-bindgen, unchanged name — it's already correctly named and already the more mature/larger of the two) and `morph-wasm` (the wasm-bindgen wire layer, directory renamed from `wasm-morph` for prefix symmetry with `morph-core`).

### 1.2 npm packaging — unchanged identity

The published npm package stays `@mkbabb/morph`, emitting `morph.js` / `morph_bg.wasm` / `morph.d.ts`, exactly as today (`csp-solver/wasm-morph/pkg/package.json`, read directly: `"name": "@mkbabb/morph"`, `"module": "morph.js"`, `"types": "morph.d.ts"`). Nothing about the excision requires or should touch this — bbnf-buddy's `"@mkbabb/morph": "^0.1.1"` keeps resolving against the same registry name regardless of which git repo builds the tarball. See §2.2 for why the Cargo package name must stay `morph` to keep this true by construction, not by discipline.

### 1.3 Per-crate CHANGELOGs

Today there is **one** `csp-solver/CHANGELOG.md` covering all four artifacts (`csp-solver`, `morph-core`, `@mkbabb/csp-solver-wasm`, `@mkbabb/morph`) under a single `0.1.0` entry (confirmed by direct read). Split at excision time:

- `csc411/csp-solver/CHANGELOG.md` — keep, but trim to the two artifacts that stay (`csp-solver`, `@mkbabb/csp-solver-wasm`); the `morph-core`/`@mkbabb/morph` 0.1.0 entries stay as *historical* record (they really did ship from this repo) with a forward pointer: "morph-core and @mkbabb/morph moved to github.com/mkbabb/morph at commit `<excision-sha>`; see that repo for changes past 0.1.0/0.1.1."
- `morph/morph-core/CHANGELOG.md` (new) — seeded with a `0.1.0` entry reconstructing the pre-excision history (the 9 commits enumerated in §4.2) as "inherited from csc411," then the excision's own version bump as the first real entry.
- `morph/morph-wasm/CHANGELOG.md` (new) — same pattern, seeded from `0.1.1`.

Lockstep policy: `morph-core` and `morph-wasm` bump together within the new repo (one wraps the other 1:1, same pattern the wasm-morph-totality audit flagged as a P3 nicety worth codifying) — but **not** in lockstep with `csp-solver`'s own version number. `csp-solver` is an ordinary external dependency pinned by a semver range; there's no reason for `morph-core`'s version to track it (nothing in the ecosystem expects that, and forcing it invites confusion the day one side needs an off-cycle patch).

### 1.4 CI — build from scratch, nothing to port

Direct read of `csp-solver/.github/workflows/ci.yml`: it runs `fmt`/`clippy`/`build`/`test` over the whole workspace, plus a bare `wasm-pack build wasm --scope mkbabb` / `wasm-pack build wasm-morph --scope mkbabb` (build only — **no `wasm-pack test`, no size budget, no criterion gate** anywhere in the file; confirmed by full read). The owner-edict's "CI (wasm-pack test, twiggy budget, criterion)" is net-new work, not a port:

```yaml
# morph/.github/workflows/ci.yml (new)
jobs:
  rust:
    steps:
      - cargo fmt --all --check
      - cargo clippy --workspace --all-targets -- -D warnings
      - cargo build --workspace
      - cargo test --workspace              # 31 morph-core tests (7 align + 7 proptest + 17 primitives) confirmed live today
      - cargo bench --workspace --no-run     # compile-check the criterion harnesses (align.rs, primitives.rs already exist)

  wasm:
    steps:
      - wasm-pack build morph-wasm --scope mkbabb
      - wasm-pack test --node morph-wasm      # NEW — zero wasm-bindgen-test call sites exist today despite the dev-dependency being declared (Cargo.toml already lists wasm-bindgen-test = "0.3"; nobody wrote a #[wasm_bindgen_test] yet — write at minimum: init + a round-trip alignForms() smoke, and a point_pairs-forwarding regression test per §4.1)
      - cargo install twiggy --locked          # NEW
      - twiggy top -n 25 morph-wasm/pkg/morph_bg.wasm
      - size-budget check: fail if morph_bg.wasm (pre-wasm-opt release build) exceeds a recorded baseline by >10% (first CI run establishes the baseline — there is no prior twiggy measurement for this specific artifact to inherit; sota-wasm.md's own twiggy numbers are for the *other* wasm crate, csp_solver_wasm.wasm, not morph)
```

`wasm-pack test` needs an actual test to run — right now `wasm-morph/src/**` has zero `#[wasm_bindgen_test]` functions (confirmed: `grep -rn wasm_bindgen_test csp-solver/wasm-morph/src` → no hits, despite the dev-dependency being declared). This tranche should write at least one (round-trip `alignForms()` +, once §4.1 lands, a `point_pairs`-forwarding regression) — otherwise "wasm-pack test" in CI is a green no-op.

### 1.5 `release.yml` — split, not ported wholesale

Today's `csp-solver/.github/workflows/release.yml` (read in full) runs two flows on one tag push: crates.io (`csp-solver` publish → sleep 60 → `morph-core` publish, dependency-ordered because `morph-core`'s registry pin needs the index to have settled) and npm (`@mkbabb/csp-solver-wasm` + `@mkbabb/morph`, parallel, no shared upstream). Post-excision, `morph`'s own `release.yml` only needs:

```yaml
crates-io:
  - cargo test --workspace
  - cargo publish -p morph-core     # csp-solver already resolves from the registry — no sleep/ordering needed, it's cross-repo now
npm:
  - wasm-pack build morph-wasm --release --scope mkbabb
  - npm publish (working-directory morph-wasm/pkg)
```

The `sleep 60` "wait for the index to settle" step disappears entirely from morph's side — that was only needed because `csp-solver` and `morph-core` published from the *same* CI run in the *same* repo. Cross-repo, the ordering constraint becomes a **release-sequencing rule**, not a CI step: `csp-solver 0.2.0` must be live on crates.io *before* `morph`'s own tag is pushed (§4, sequencing).

---

## 2. Dependency direction

### 2.1 csp-solver via crates.io — version target and why 0.2.0

`morph-core/Cargo.toml` today already reads:

```toml
csp-solver = { version = "0.1.0", path = ".." }
```

This is the *standard* Cargo idiom for "resolve locally via the path when it's a workspace member, resolve via the registry version when it's consumed standalone" — meaning **the version-dep half of this work is already done**. Excision day's only change here is (a) delete the `path = ".."` key, (b) bump the version requirement to whatever `csp-solver` publishes as its next release.

The brief names that release **`0.2.0`**, published post-kernel in the coordinated release window (W10 per `synthesis-pass3.md`). Cross-checked against what the kernel wave (W1/W2) actually changes, per `synthesis-pass3.md` §1/§5 and `bbnf-sync-gate.md` §2.3-2.4:

- `Ordering::DomWdeg` → `Ordering::Mrv` rename — a breaking public-enum-variant rename, unconditionally requires a semver bump regardless of caller style.
- `SolveConfig`'s `backjumping` field deletion — breaks any external crate that constructs `SolveConfig` via an **exhaustive** struct literal (no `..Default::default()` spread) — confirmed exactly this class of break already bit `bbnf-lang/skinny/decision_csp.rs` (T14/B2, E0063) for a *different* field addition; a field *removal* is the same break in reverse.
- `SolveConfig::default()`'s *values* changing (Chronological→FailFirst-family, node_budget) — behavior-visible even where the shape doesn't break.

All three are exactly the class of change Cargo's pre-1.0 SemVer convention treats as a *minor* bump (0.1.x → 0.2.0). **0.2.0 is self-consistent with the known kernel-wave diff**, not an arbitrary number — worth stating plainly since "which version" was asked directly.

**Sequencing dependency this spec does not control**: `csp-solver 0.2.0` cannot actually publish until `synthesis-pass3.md`'s R1 (kernel-soundness-closure, the `ac3_from_variable` trail-undo fix + re-verified parity matrix) and W1/W2 land — those are tracked elsewhere (pass-4 residuals, not this beat's to close). The morph excision's crates.io leg is *ready* the moment 0.2.0 is live; it is not itself gating or gated by R1/R2's *content*, only by their *landing*.

### 2.2 The exact API surface morph consumes — enumerated, not asserted

Direct grep of every `.rs` file in `morph-core/{src,tests,benches}` for `csp_solver::` turns up **exactly one call site**:

```rust
// morph-core/src/align.rs:275 (align/tier2.rs post-decomposition)
let mut builder = csp_solver::assignment()
    .rows(n_src)
    .cols(n_tgt)
    .cost(|i, k| cost_matrix_ref[i * n_tgt + k])
    .row_group(|i| row_groups_ref[i])
    .col_group(|k| col_groups_ref[k])
    .unmatch_penalty(UNMATCH_PENALTY);
// + .pin(row, col) in a loop
let solution = builder.solve().expect("alignment CSP must be solvable");
// then only `solution.assign[i]` (a Vec<i32>) is read
```

The full surface, confirmed by grep + read of `csp-solver/src/builder/{assignment.rs,mod.rs}`:

| Item | Kind | Used how |
|---|---|---|
| `csp_solver::assignment()` | free fn | entry point, returns `AssignmentBuilder` |
| `AssignmentBuilder::{rows, cols, cost, row_group, col_group, pin, unmatch_penalty, solve}` | fluent builder methods | all 7 called; `.node_budget()` (an 8th, exists) is **not** used — morph-core takes the crate's default budget |
| `AssignmentSolution.assign: Vec<i32>` | struct field | only field read (indexed per-row; `k < 0` checked inline for the unmatched sentinel — morph-core does **not** import `csp_solver::SENTINEL`, it hardcodes the `< 0` check itself; a tiny missed-reuse opportunity, not a stability concern) |

**Not used at all**: `AssignmentError`'s variants (morph-core `.expect()`s the `Result` rather than matching it — meaning it's *not* exposed to the P0 `Infeasible`/budget-exhaustion ambiguity `rust-cop-builder.md` flags, because it never inspects the error), `SENTINEL`, `Csp`, `SolveConfig`, `Pruning`, `OptimizationMode`, `CostFiniteDomain`, or any constraint/domain type. Everything below `AssignmentBuilder::solve()`'s public signature is internal to `csp-solver` and invisible to morph-core.

**Is this surface stable post-kernel?** Yes, on two independent grounds:

1. **Structural**: `builder/assignment.rs:402-409` (read directly) builds its internal `SolveConfig` via `..SolveConfig::default()` spread, not an exhaustive literal — field adds/removals to `SolveConfig` are absorbed silently at this call site; `AssignmentBuilder`'s own public method signatures (`rows`/`cols`/`cost`/`row_group`/`col_group`/`pin`/`unmatch_penalty`/`solve`) are untouched by any kernel-wave change (the `AcFc→Ac3` pruning swap, the trail-undo fix, GAC default-on, the `DomWdeg→Mrv` rename) — all of those are internal to what happens *inside* `solve()`'s body, not its signature.
2. **Empirical**: `builder-ac3-x-morph-lazy.md` (Pass 3) already ran exactly this composition — kernel trail + GAC + `AcFc→Ac3` + `morph-lazy-cost`'s decomposed `align/` module, all together — against the crate's own `AssignmentBuilder` proptest correctness oracle (6 properties × 256 brute-force-checked cases: `prop_single_row`, `prop_rectangular_matches_bruteforce`, `prop_unmatched_penalty_monotone`, `prop_pins_respected`, `prop_roles_partition`, `prop_square_matches_bruteforce`) — **all green**, plus the full 170/170 workspace suite. That critique's one finding (tie-break selection differs on a *symmetric-cost* synthetic corpus case, `stress_n6`) was proven to be a property of the `Ac3` pruning wiring alone, not an interaction defect, and both the old and new selections were independently brute-forced to the same optimal cost. **This is the strongest evidence available that the surface morph depends on survives the kernel wave**, because it isn't argued from the API shape alone — it was adversarially measured.

One doc nit riding along for free: `builder/assignment.rs`'s own module doc-comment (the block quoted in `builder-ac3-x-morph-lazy.md` §6, note 5a) still says `Pruning::AcFc` after the code switched to `Ac3` — already flagged for the docs-accuracy ledger (W2/W11); no action needed from this beat beyond not re-introducing it.

### 2.3 The `morph` Cargo package name — the naming decision, made explicit

The excision's crate-rename instruction is ambiguous between the top-level phrasing ("wasm-morph → morph") and item (1)'s ("morph-wasm, renamed from wasm-morph"). **Recommendation: rename only the directory** (`wasm-morph/` → `morph-wasm/`), leave `Cargo.toml`'s `[package] name = "morph"` / `[lib] name = "morph"` **unchanged**.

Reasoning: `wasm-pack build --scope mkbabb` derives the emitted npm package name from the Cargo `[package].name` field (kebab-cased), not from the directory it's invoked in — this is exactly why today's directory `wasm-morph/` already emits `@mkbabb/morph`, not `@mkbabb/wasm-morph` (confirmed directly: `pkg/package.json` name is `@mkbabb/morph`, and `Cargo.toml`'s `[package] name` is already `"morph"` — the directory and the crate name have **never** matched, and that mismatch is exactly what makes the npm identity stable). If the crate itself were renamed to `morph-wasm`, the default `wasm-pack` emit would become `@mkbabb/morph-wasm` — a breaking npm package rename with no upstream benefit, landing on every consumer (bbnf-buddy's `import ... from "@mkbabb/morph/morph.js"`) silently unless caught. Keeping the directory/crate-name split (already the established pattern in this very workspace — `csp-solver/wasm/` holds a crate named `csp-solver-wasm`, a different name from its folder) gets the requested "morph-wasm" clarity in the filesystem/repo layout without touching the one name that's actually externally load-bearing. **This is a deliberate departure from a literal "rename to morph-wasm" reading — flag for owner override if the intent really was an npm package rename** (in which case it needs its own deprecation/redirect plan for `@mkbabb/morph`, not a silent rename).

---

## 3. Sequencing

### 3.1 This tranche (in `csc411`, before excision — safe to land regardless of when excision day happens)

| Item | Status today | Action this tranche |
|---|---|---|
| **path-dep → version-dep readiness** | Already half-done — `morph-core/Cargo.toml` carries `csp-solver = { version = "0.1.0", path = ".." }` (dual-spec, the exact idiom needed). | Verify, don't rebuild: extract a scratch copy of `morph-core/` outside the workspace, strip the `path` key, point `csp-solver = "0.1"` at the **live crates.io** release, `cargo build`/`cargo test` against it. This proves zero path-only leakage (no dev-dependency, no workspace-inherited profile, no feature-flag surprise — `csp-solver`'s `py` feature is off by default and morph-core never enables it) *before* excision day, when there's no going back to a path dep to debug against. Cheap (an afternoon), catches a class of failure that's otherwise only discoverable post-cut. |
| **`align.rs` decomposition per morph-lazy-cost** | Prototyped and verified (`pass2/morph-lazy-cost.md`, re-verified under the composed kernel base in `pass3/builder-ac3-x-morph-lazy.md`): `align.rs` (512L) → `align/{mod,tier1,tier2,pairwise}.rs` (80/112/137/202L), centroid memoization, real scratch arena, lazy cost-matrix scoring. 170/170 workspace tests, proptest oracle green, ≥4× on every pipeline-bound corpus case. | Land the prototype's diff (or its equivalent) for real — this is currently throwaway-prototype code, not merged. Do it **before** excision so the decomposition (and its own test/bench coverage) travels with the crate into the new repo already landed, rather than being a fresh cut with an over-500-line `align.rs` that then needs its own PR in the new repo with a cold CI. |
| **`point_pairs` wire-through (Rust side)** | Built in the `morph-lazy-cost` prototype: `WireHints` gains `point_pairs: Vec<WirePointPair>` (`#[serde(default)]`, camelCase — `sourceSubpath`/`targetSubpath`/`sourceIndex`/`targetIndex`, verified to match `bbnf-buddy/src/forms/align-types.ts`'s **already-declared** `CorrespondenceHints.pointPairs` field names exactly), `convert_hints` maps them into `morph_core::PointHintPair`. | Land alongside the decomposition (same file is open either way). This is additive and wire-compatible (`#[serde(default)]` means old callers omitting `pointPairs` keep working) — safe to ship as a minor bump. |
| **Float64Array typed-array wire (P2-G)** | **Spec'd only, not built** — `pass2/morph-lazy-cost.md` §5b explicitly verdicts it "ADAPT, not urgent... ship it when the wire layer is next opened, not standalone." No measured wasm-bindgen typed-array benchmark exists for this crate. | **Recommend deferring past this tranche**, contra the brief's framing of it as part of "decoupling prep." Reasoning: (a) it doesn't touch dependency direction at all — this is a pure wire-format optimization, orthogonal to the excision; (b) landing an *unmeasured* architecture change in the same tranche as a repo move compounds two independently risky changes into one; (c) the crate's own CI (wasm-pack test, twiggy budget — §1.4, itself new this tranche) doesn't exist yet to catch a regression in it. Treat it as the **first post-excision PR** in the new repo, once its CI is live to gate it properly. This is a scope narrowing versus a literal reading of the brief — noted here rather than silently absorbed. |
| **CHANGELOG split prep** | N/A | Can be drafted now (per-crate CHANGELOG.md content, §1.3) and simply moved on excision day — no reason to wait. |

### 3.2 Excision day (atomic, in the new `morph` repo)

1. **Directory move + rename, in one commit**: `csp-solver/morph-core/` → `morph-core/`; `csp-solver/wasm-morph/` → `morph-wasm/` (§2.3 — directory only, Cargo package name `morph` unchanged). This is the "rides the excision, not before" instruction, honored literally: nothing in §3.1 touches the directory name.
2. Strip the `path = ".."` key from `morph-core/Cargo.toml`'s `csp-solver` dependency; set `csp-solver = "0.2"` (assuming §2.1's 0.2.0 is live by this point — if it isn't yet, excision day should not proceed; see §5 rollback).
3. New root `Cargo.toml` (`[workspace] members = ["morph-core", "morph-wasm"]`), new `CHANGELOG.md`/`README.md`/`LICENSE`/`.github/workflows/{ci,release}.yml` per §1.
4. In `csc411`: delete `csp-solver/morph-core/` and `csp-solver/wasm-morph/`; trim the workspace `Cargo.toml`'s `members` list to `["csp-solver", "csp-solver/wasm"]` (confirmed `csp-solver/wasm` — the *other* wasm crate, `csp-solver-wasm` — has zero dependency on morph-core; it depends only on `csp-solver` itself, path-only, and stays put). Regenerate `Cargo.lock`. Verify `cargo build --workspace` and the Docker build (`web/api/Dockerfile:29` does `COPY csp-solver/ /build/csp-solver/` wholesale — confirmed it doesn't reference `morph-core`/`wasm-morph` by path anywhere, so deleting the subdirectories is transparent to the Docker build, no Dockerfile edit needed).
5. Tag the pre-deletion commit in `csc411` (e.g. `pre-morph-excision`) — permanent, cheap, and the entire archaeology story for "what did morph-core look like in csc411" without needing any history imported into the new repo (§4.2).

### 3.3 History filter vs. fresh cut — recommend **fresh cut**

Evidence gathered directly (not inferred) on the morph-specific history, deliberately contrasted with `bbnf-sync-gate.md`'s different recommendation for the *full* `csp-solver` split:

```
$ git log --oneline -- csp-solver/morph-core csp-solver/wasm-morph
aef9eae9 chore(release): publish to the @mkbabb suite — crates.io + npm
69d7330a docs(solver): document deferred extensions + add bench-compare harness
365bf296 feat(bench): criterion benchmarks for morph-core align + primitives
0e9242eb test(morph-core): proptest for geometry primitives
871792e4 feat(wasm-morph): wasm-pack build + bbnf-buddy file: dep
9a663703 feat(wasm-morph): scaffold csp-solver-wasm-morph sub-crate + wire types
5658984f feat(morph-core): port signature + align orchestration with native AssignmentBuilder
e161e377 feat(morph-core): port geometry primitives (bezier, contour, resample, procrustes)
3870769f feat(morph-core): scaffold workspace member with core types
```

Nine commits, total. Per-commit `git show --stat`, eight of the nine touch **only** files under `csp-solver/morph-core/` or `csp-solver/wasm-morph/` (plus trivial one-line `Cargo.toml` workspace-member additions in the first two). The ninth (`aef9eae9`, the publish commit) is a genuine cross-cutting release commit touching root `csp-solver/` files (`CHANGELOG.md`, `LICENSE`, `README.md`, `.github/workflows/*`) and the *unrelated* `csp-solver/wasm/` crate in the same commit — none of those paths are inside the morph excision boundary, so a path-scoped extraction tool would simply drop them from that commit's replayed diff (expected, harmless — the new repo needs its own fresh `README.md`/`CHANGELOG.md`/`LICENSE` regardless, per §1).

Given: (a) nine commits total, cleanly scoped except for one release commit whose non-morph hunks are naturally excluded by any path filter anyway; (b) ~3,100 lines of Rust across 21 tracked files — a small tree by any measure; (c) the crate has never had its own GitHub remote, CI identity, or external consumer of its *git history specifically* (npm/crates.io consumers see published tarballs, never `git blame`; confirmed `bbnf-lang` doesn't vendor morph-core at all, unlike its `csp-solver` vendoring, so there's no sync-gate-style history dependency to preserve either); (d) nobody has ever `git blame`d this code across a release boundary — **a fresh cut is the right call here**, in explicit contrast to `bbnf-sync-gate.md`'s lean toward preserving history for the *full* `csp-solver` split (that tree is ~16.8K lines, has a real multi-month history, and already has a public GitHub identity worth reconciling rather than abandoning). Different sizes, different histories, different answers — this isn't a blanket "always fresh-cut repo splits" policy, it's specific to morph's evidence.

**Mechanics**: single initial commit in the new repo, message states provenance (`"Import morph-core + morph-wasm from csc411 @ <pre-morph-excision tag sha>"`), README states the same. The `pre-morph-excision` tag left in `csc411` (§3.2 step 5) is the permanent pointer for anyone who wants the pre-excision commit-by-commit history — `git log pre-morph-excision -- csp-solver/morph-core` works forever in the original repo without needing anything replayed. This avoids installing/learning `git filter-repo` or `git subtree split` for a tree this small, and avoids the one real footgun of history-preserving extraction (accidentally dragging in the `aef9eae9` commit's unrelated `wasm/` hunks if the path filter is even slightly mis-scoped).

### 3.4 `@mkbabb/morph` republish

Once the new repo's CI is live and `morph-core`'s decomposition/point_pairs changes (§3.1) have landed *before* the move (recommended) or are re-applied *after* (if sequencing forces it): tag-push `morph`'s own `release.yml` (§1.5). This republishes `@mkbabb/morph` at whatever the next version is (recommend `0.2.0` for morph-wasm too, reflecting the point_pairs wire addition + the repo move itself — a real, user-visible change to the package's provenance even though the wire format is backward compatible). bbnf-buddy then needs exactly **one** line changed in its own repo (out of scope here, cited for completeness): `src/composables/wasm/morph.ts:162`'s `wireRequest.hints` object gains `pointPairs: req.hints.pointPairs ?? []` (the TS type already declares this field, per `align-types.ts`, confirmed field-name-identical to the Rust wire shape — this was always a one-line gap, not a design problem) — plus bumping `package.json`'s `"@mkbabb/morph"` range to include the new version. **This is an ordinary dependency bump in a sibling repo, not part of the excision's mechanics** — the excision doesn't require it to happen in lockstep, it's just the reason a republish is worth doing at all.

---

## 4. What stays in `csc411`

**Nothing morph-related stays except the one thing that was never morph-specific to begin with**: `csp-solver::assignment()` / `AssignmentBuilder` (`csp-solver/src/builder/assignment.rs`) is core, general-purpose bipartite-assignment COP infrastructure — it has **two** consumers today, not one:

1. `morph-core` (excising) — the consumer this spec is about.
2. `csp-solver/wasm/src/assignment.rs` (the **other** wasm crate, `csp-solver-wasm`, package `@mkbabb/csp-solver-wasm`) — wraps `AssignmentBuilder` directly for a *different* bbnf-buddy import (`solveAssignmentCop`/`assignmentSentinel`, per `sota-wasm.md` F1a's own grep). This crate stays in `csc411` — confirmed zero dependency on `morph-core`/`wasm-morph` (its `Cargo.toml` depends only on `csp-solver = { path = ".." }`), so it is entirely unaffected by the excision.

So: `AssignmentBuilder` stays because it's genuinely core (owned by `csp-solver`, consumed by two independent callers, one of which — `csp-solver/wasm` — isn't moving). Everything that *wraps* it for the specific glyph-alignment use case (`morph-core`, `wasm-morph`/`morph-wasm`) leaves. `web/frontend` (the Vue sudoku app) has **zero** references to morph — the two `grep` hits for the string "morph" in that tree (`glyphPaths.ts`, `glyphAnimations.ts`) are the English word ("path morph on hover"), not the package; confirmed by reading both lines directly. Morph is exclusively a `bbnf-buddy` concern; `csc411`'s only relationship to it is as the *former* host of its source.

---

## 5. Risk table + rollback

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Literal "rename to morph-wasm" is read as a **Cargo package rename**, silently flipping the emitted npm package from `@mkbabb/morph` to `@mkbabb/morph-wasm` on the next `wasm-pack build`. | Medium (the ambiguity is real, §2.3) | High — breaks every existing `bbnf-buddy` import (`@mkbabb/morph/morph.js`) with no compiler error, only a runtime "module not found" | This spec's explicit recommendation (§2.3): directory rename only, package name frozen at `morph`. Add a CI assertion (`jq -e '.name == "@mkbabb/morph"' morph-wasm/pkg/package.json`) so any future accidental rename fails loud in CI rather than silently at publish. |
| R2 | `morph-core 0.2.0` is tagged/published **before** `csp-solver 0.2.0` is actually live on crates.io (the cross-repo analogue of the same-repo `sleep 60` the current `release.yml` uses). | Medium — the two releases are now in different CI systems with no shared lock | `cargo publish -p morph-core` fails outright (crates.io's own dependency-resolution gate rejects publishing against an unpublished version) — this fails loud, not silently, so the actual risk is wasted CI minutes and a confusing error, not a corrupted release. Mitigation: a manual pre-flight check (`cargo search csp-solver` or the crates.io API) as the first step of morph's `release.yml`, gating the rest of the job. |
| R3 | Fresh-cut history loss is regretted later (someone wants pre-excision `git blame` on `align.rs`'s original TS-port commit). | Low (per §3.3's evidence — nobody has needed it in the crate's 6-week life) | Low — recoverable | `pre-morph-excision` tag in `csc411`, referenced in the new repo's README/initial commit message. Zero cost to leave in place indefinitely. |
| R4 | `csc411`'s workspace `Cargo.toml` `members` list isn't trimmed after directory deletion, or `Cargo.lock` carries stale `morph-core`/`morph` entries. | Medium (easy to forget in a directory-deletion PR) | Build break (`cargo build --workspace` fails with "path does not exist") — loud, not silent, but blocks every subsequent `csc411` Rust change until fixed | Explicit gate in the excision-day checklist (§3.2 step 4): `cargo build --workspace` and `cargo metadata` both clean, run *before* the deletion commit is considered done. |
| R5 | CI secrets (`CARGO_REGISTRY_TOKEN`, `NPM_TOKEN`) for the new `morph` repo don't exist yet — today they live in whatever GitHub identity hosts `csc411`'s Actions, not a not-yet-created `mkbabb/morph`. | High (this is a fresh repo, provisioning is mandatory, not automatic) | Release CI fails on first tag push if forgotten | Explicit owner action, called out (not silently assumed): provision both secrets on the new `mkbabb/morph` GitHub repo before the first tag push. Confirmed via `gh repo view mkbabb/morph` today: **the repo does not exist yet** (`GraphQL: Could not resolve to a Repository with the name 'mkbabb/morph'`) — a clean slate, no naming collision, but also nothing pre-provisioned. |
| R6 | `wasm-pack test` is added to CI (§1.4) but zero `#[wasm_bindgen_test]` functions exist in `wasm-morph/src` today — the gate is a green no-op unless someone writes tests. | High if skipped | Medium — a false sense of CI coverage | Write the minimum viable test (round-trip `alignForms()` smoke + a `point_pairs`-forwarding regression, §1.4/§3.1) in the same PR that adds the CI step — don't land the gate and the test in separate PRs, or the gap persists silently between them. |
| R7 | The Float64Array typed-array wire format (deferred, §3.1) gets scope-creeped back into "decoupling prep" by a future agent re-reading the original brief literally rather than this spec's amendment. | Low-medium | Medium — compounds an unmeasured architecture change with the repo move | This document's §3.1 entry is the explicit record of the narrowing; cite it if re-litigated. |

**Rollback**: at every step this is a series of independently-reversible git operations, not a live-system migration — there's no runtime cutover to roll back. If excision day is aborted partway: (a) before the `csc411` deletion commit lands, nothing has changed in `csc411` at all — the new repo can simply be discarded; (b) after the `csc411` deletion commit lands but before `morph-core 0.2.0` publishes, `csc411`'s own `git revert` of the deletion commit restores the directories and the workspace member list in one operation, and the new (unpublished) repo is discarded; (c) once `morph-core`/`morph-wasm` have published new versions from the new repo, rollback is no longer a "revert" question — it becomes "does anyone need to downgrade a published version," which is a normal semver-yank decision, not specific to this excision.

---

## 6. Self-attack summary (what I checked to break this spec, and what survived)

- **Checked**: does the excision's crates.io leg actually need the full csp-solver repo-split to land first? — **No**, verified `csp-solver@0.1.0` publishes independently of the directory's own git remote; the two motions are decoupled (§0.2).
- **Checked**: is there a `file:` dependency anywhere that needs migrating? — **No**, corrected against direct reads of `bbnf-buddy`'s `package.json`/`package-lock.json`/`node_modules` (§0.1).
- **Checked**: does renaming the wasm crate risk the published npm identity? — **Yes, if the Cargo package name is touched** — resolved by recommending directory-only rename (§2.3), flagged as a deliberate scope narrowing rather than silently picked.
- **Checked**: is the AssignmentBuilder surface morph depends on actually stable post-kernel, or just structurally plausible? — verified against an actual adversarial composition test (`builder-ac3-x-morph-lazy.md`'s brute-force proptest oracle under the full composed kernel+GAC+Ac3 tree), not just API-shape inspection (§2.2).
- **Checked**: does the Docker build reference morph-core/wasm-morph paths that would break on deletion? — **No**, confirmed `web/api/Dockerfile` copies `csp-solver/` wholesale (§4).
- **Checked**: is history-filter extraction actually warranted here, or is that cargo-culted from the bigger csp-solver-split recommendation? — measured directly (9 commits, clean scoping) and recommended the *opposite* of `bbnf-sync-gate.md`'s lean for the bigger split, with the size/history/consumer differences stated explicitly (§3.3) rather than silently inheriting that beat's conclusion.
- **Not independently re-verified this pass** (out of scope, flagged not silently skipped): whether `csp-solver 0.2.0` and R1/R2 (kernel-soundness-closure, trait-bound spike) have actually landed by the time this spec is executed — this document specs the excision assuming those pass-4 residuals close on their own track; it does not re-litigate them.

---

## Appendix — commands run for this spec (representative, all read-only against tracked state)

```bash
git log -1 --oneline                                             # verify no stale-worktree defect
git status --short | head -20

find csp-solver -maxdepth 2 -type d
cat csp-solver/Cargo.toml csp-solver/morph-core/Cargo.toml csp-solver/wasm-morph/Cargo.toml
cat csp-solver/wasm-morph/pkg/package.json csp-solver/wasm-morph/README.md
wc -l csp-solver/morph-core/src/*.rs csp-solver/wasm-morph/src/*.rs

grep -n "csp_solver::" csp-solver/morph-core/src/*.rs
grep -n "pub fn\|pub struct" csp-solver/src/builder/assignment.rs
grep -n "pub use" csp-solver/src/lib.rs csp-solver/src/builder/mod.rs

git log --oneline -- csp-solver/morph-core csp-solver/wasm-morph
for c in <9 commit shas>; do git show --stat --format="" $c; done   # confirm scoping, esp. aef9eae9

cat csp-solver/.github/workflows/ci.yml csp-solver/.github/workflows/release.yml
cat csp-solver/CHANGELOG.md

grep -n "COPY\|csp-solver" web/api/Dockerfile
grep -rln "morph-core\|wasm-morph" web/api web/frontend/package.json docker-compose*.yml scripts/*.sh

# sibling repos, read-only
cat /Users/mkbabb/Programming/bbnf-buddy/package.json | grep morph
grep -A5 '"@mkbabb/morph"' /Users/mkbabb/Programming/bbnf-buddy/package-lock.json
ls -la /Users/mkbabb/Programming/bbnf-buddy/node_modules/@mkbabb/morph
cat /Users/mkbabb/Programming/bbnf-buddy/src/composables/wasm/morph.ts
cat /Users/mkbabb/Programming/bbnf-buddy/src/forms/align-types.ts
grep -rln "morph" /Users/mkbabb/Programming/bbnf-lang --include="*.toml" --include="*.rs" | grep -v target

gh repo view mkbabb/morph --json name,pushedAt          # confirms repo doesn't exist yet — clean slate
gh repo view mkbabb/csp-solver --json name,pushedAt      # re-confirms the bbnf-sync-gate landmine is unchanged today
```
