# Pass-3 Q6 — Substrate semver + bbnf sync-gate tripwires + vendored-copy precondition

**Lane:** Q6 (dispatch-ready critique #6). **Verdict:** the wave-spec's semver LABEL (`@0.3.0`) holds; the precondition PROSE does not — it mis-sequences, mis-attributes the coupling axis, and under-specifies both the `SoftConstraint` removal surface and the orphaned-vendored-test hygiene. Amendment below. All evidence re-derived fresh at csc411 HEAD `8913023e` (read-only) and bbnf-lang HEAD `f8e375be` (LOCAL-ONLY, never pushed; only `--check` + read + a throwaway `cargo build --tests` run, source tree untouched).

---

## Sub-question 1 — Is `0.3.0` right for this pub-API removal set? YES.

**All eight removal targets are genuine bare-`pub` API** (fresh grep, csc411 HEAD):

| Target | Site | Kind |
|---|---|---|
| `restart` mod | `solver/mod.rs:11` `pub mod restart;` (`restart.rs` = `Luby`) | pub module |
| `heuristic` mod | `solver/mod.rs:6` (`heuristic.rs` = `ConflictHistory`) | pub module |
| `nogoods` mod | `solver/mod.rs:8` (`nogoods.rs` = `NogoodStore`) | pub module |
| `Ordering::Chs` | `ordering.rs:22` | pub enum variant |
| `SolveConfig.restarts` | `config.rs:71` `pub restarts: bool` | pub struct field |
| `SoftConstraint` | `constraint/traits.rs:218` + re-export `constraint/mod.rs:19` | pub trait |
| `clear_log` / `reset_to` | `variable.rs:69,77` | pub methods |

Removing published pub items is a **breaking change**. csc411's csp-solver is `version = "0.2.0"`, and `0.2.0` is a **tagged (`v0.2.0`), CHANGELOG-documented, published-class** version (CHANGELOG §0.2.0 explicitly: "Breaking (pre-1.0 minor-bump class)"). Under Cargo SemVer for `0.y.z`, the leftmost non-zero component is the minor, so a breaking change bumps `0.2.0 → 0.3.0`. A patch (`0.2.1`) would be a **semver violation**: it stays inside the `^0.2` (`>=0.2.0,<0.3.0`) compat range.

**It is load-bearing, not just hygiene.** The csc411 CHANGELOG names a live crates.io consumer: the excised `morph` repo "now consumes it as an ordinary crates.io dependency (`csp-solver = "0.2"`)". A `0.2.1` shipment of this removal would let morph's `^0.2` silently pick up the breaking delta. (morph only uses `assignment()`/`AssignmentBuilder`, so it wouldn't *observably* break — but the `0.3.0` label is what keeps the contract honest.) csp-solver was published at `0.1.0` (commit `aef9eae`, "publish to the @mkbabb suite"); whether `0.2.0`/`0.3.0` are actually live on the registry is a publish-time check, but the label is correct regardless.

**Wave-spec `@0.3.0` and "CHANGELOG + version bump" (W3 line 78, D7 line 22) are CORRECT and need no change.**

---

## Sub-question 2 — Do the bbnf sync-gate tripwires fire? YES — exactly one, as a WARN. Ran it.

### The actual coupling (not what the spec implies)

bbnf does **not** consume csc411 by registry version. `~/Programming/bbnf-lang/.cargo/config.toml` has `[patch.crates-io] csp-solver = { path = "crates/csp-solver" }` — a **real, git-tracked, byte-vendored copy** (180 tracked files; not a symlink, not a submodule). It is version-labelled `0.1.0` while its `src/` is pinned to a **0.2.0-era** csc411 commit — the version field is decoupled and gate-invisible. The pin is a 40-hex csc411 SHA in the vendored `Cargo.toml` description: `4568dc7ed8f06061e267633e7724a2f06b5a2926` (= the `pre-morph-excision` tag). bbnf's three consumers (`crates/core`, `crates/ir`, `crates/egraph`) declare `csp-solver = "0.1"`, resolved through the patch to the local `0.1.0`.

**Consequence for semver:** the `0.2.0 → 0.3.0` bump is *invisible* to bbnf. `--update` rsyncs only `src/`+`data/`+`tests(--existing)` and rewrites only the SHA pin — it never touches the vendored `version` field. So the bump neither propagates nor trips anything. What trips the gate is the *content* delta, caught at re-vendor time.

### The gate: `scripts/sync-csp-solver-vendor.sh` (+ enforced by `scripts/hooks/pre-push`)

- `--check` — `git archive`-extract the pinned rev, byte-diff vendored `src/`+`data/`. **Ran it live: PASS** — "crates/csp-solver/{src,data} match csc411@4568dc7… byte-for-byte." (Note: `tests/` is *not* diffed.)
- `--verify` — two structural tripwires + a compile matrix {root `bbnf`+`bbnf-ir`+`egraph`} ∪ {`skinny` `passes` — separate workspace} ∪ {vendored csp-solver × (default, py-isolated)} + `cargo test --test lattice`.

### Tripwire results — ran the real gate logic against a scratch excised tree

Copied the vendored `src/`, applied the D7 excision (removed `restarts` field + its Default line, the three `pub mod` lines + files, the `Chs,` variant), then ran both `verify_tripwires` checks verbatim:

- **Tripwire (1) — raw `Send/Sync` on `Constraint`/`Domain`/`LatticeDomain`:** does **NOT** fire. The excision adds no auto-trait bounds; `SoftConstraint` is a *distinct* trait. ✓ expected.
- **Tripwire (2) — `SolveConfig`/`SolveStats` field-set vs `scripts/.csp-solver-fields.baseline`:** **FIRES.** The baseline lists `restarts`; the diff emits `> restarts` (deletion). This is the **WARN** class (not a hard fail). The gate's own message points the human at the exact downstream consumer to sweep — `skinny/crates/passes/src/decision_csp.rs` — and requires refreshing the baseline file to re-green future `--verify` runs.

### The WARN is fully absorbed — no hard compile break anywhere

- `skinny/crates/passes/src/decision_csp.rs:85` builds `SolveConfig { pruning, ordering, node_budget, ..Default::default() }` — **non-exhaustive**, no explicit `restarts:`. Its own comment already records prior SolveConfig field-churn hardening ("csc411 W1 deleted `SolveConfig::backjumping` and added `restarts`/`cancel` … the `..Default::default()` spread"). Removing `restarts` is transparent here.
- bbnf **production** code (core/ir/egraph/skinny `src/`) references **zero** of the eight removed symbols (`restarts`, `SoftConstraint`, `clear_log`, `reset_to`, `Ordering::Chs`, `nogoods`, `restart`, `heuristic` — all grep-clean; every `Ordering` hit is `std::cmp::Ordering`).
- The removed island is **self-contained**: `Luby`, `NogoodStore`, `ConflictHistory` appear *nowhere* outside their three files, so bbnf's separate CI-gated `crates/ir/tests/substrate_audit.rs` zero-caller test cannot newly-fire (removing a self-contained island drops decls + refs together; no survivor loses its last caller).
- bbnf's live `OptimizationMode::MinimizeCost` COP path (heavy in `crates/ir/src/passes/csp_strategy/mod.rs`) draws cost from **`CostDomain::cost` via `DomainCostEval`** (`optimize.rs`), **not** `SoftConstraint`. So `OptimizationMode`/`CostDomain` (survivors) are cleanly separable from the excised soft surface. ✓

**So: the field-set tripwire fires (WARN, on `restarts`), the gate's green consumer-compile path stays green, and the excision is inert to every real bbnf consumer.**

---

## Sub-question 3 — Is the vendored-copy precondition spec'd tightly enough? NO.

The gate exists and is well-built; the wave-spec's one-clause gesture at it is loose in five concrete ways, and two of those are load-bearing.

1. **Sequencing is inverted.** W3 says "sync-gate check **first**." The gate cannot meaningfully run before the excision exists — there is no `0.3.0` rev to vendor yet. The real order is **post-commit, bbnf-side**: (a) csc411 excises + bumps `0.3.0` + CHANGELOG; (b) `./scripts/sync-csp-solver-vendor.sh --update <0.3.0-rev>` re-vendors + re-pins; (c) `--verify` runs the field-set WARN; (d) refresh `scripts/.csp-solver-fields.baseline`, confirm the `decision_csp.rs` `..Default::default()` sweep (already satisfied); (e) commit. **LOCAL-ONLY — bbnf-lang is under a standing never-push order.**

2. **Wrong coupling axis.** "semver-visible pub-API removal" mis-describes it. bbnf's vendored consumption is **SHA-pinned + byte-diffed + field-set-gated**, not version-keyed; the `0.3.0` bump is invisible to it. The semver bump matters for the crates.io `morph` consumer, *not* for the bbnf gate.

3. **`SoftConstraint` is under-specified — it is a 5-part island, not one trait.** A literal "remove `SoftConstraint`" that leaves the rest won't compile. The full removal surface: `SoftConstraint` trait (`traits.rs:218`) + `SoftLambdaConstraint` (`constraint/soft.rs`, whole file) + `pub use soft::SoftLambdaConstraint` (`mod.rs:18`) + `ConstraintEnum::Soft(SoftLambdaConstraint<D>)` dispatch variant (`dispatch.rs:24`) + `Csp::add_soft_constraint` (`csp/mod.rs:56`). Plus the test `csp-solver/tests/optimize.rs` must be **trimmed** (drop the SoftConstraint cases; **keep** the CostDomain cases — bbnf's live path). (Primarily Q1/Q9 manifest territory, but it lands here because bbnf's `--verify [3/4]/[4/4]` lib-compile is the backstop that catches an incomplete soft excision.)

4. **The field-set tripwire is a WARN, not a hard fail, and requires a baseline refresh.** The spec's word "check" implies a hard gate; whoever runs it must know to (a) expect the `> restarts` WARN and (b) edit `scripts/.csp-solver-fields.baseline` (delete the `restarts` line) or every future `--verify` keeps warning.

5. **Orphaned curated vendored tests — the gate's deliberate blind spot.** `--update` uses `rsync -a --existing` (no `--delete`) for `tests/`, and `--verify` compiles only `--test lattice` + the lib + consumers — **it never compiles the other vendored test targets.** Proof this is already real, not hypothetical: `cargo build --tests` in the pristine vendored crate **fails today at bbnf HEAD** — `tests/local_search.rs` (`solver::local_search::min_conflicts`, excised in csc411 0.2.0) and `tests/gac.rs` (`solver::gac_alldiff`) are unresolved-import broken and have silently rotted because earlier csc411 excisions were never propagated to bbnf's curated tests. The W3 excision **adds `tests/nogoods.rs`** (`NogoodStore`) to that rotted pile. This does not break the gate's green path (by design it routes around test-target drift), but "re-vendor is `--verify`-green" ≠ "the vendored crate's tests compile." A conscientious re-vendor should prune the orphaned curated tests (`nogoods.rs` after W3; and, while there, the already-dead `local_search.rs`/`gac.rs`).

**Net:** the precondition is *directionally* right — there IS a vendored copy, there IS an enforced gate, it DOES need running — but as authored it is a gesture, not an executable precondition, and it hides both the SoftConstraint island size and the orphaned-test rot.

---

## Evidence index (all fresh)

- csc411 `csp-solver/Cargo.toml` `version=0.2.0`; `CHANGELOG.md` §0.2.0 (breaking, tagged `v0.2.0`) + morph `csp-solver="0.2"` note; publish commit `aef9eae` (`csp-solver@0.1.0`).
- Removal-target `pub` sites (grep, csc411 HEAD): listed table above.
- bbnf `.cargo/config.toml` `[patch.crates-io] csp-solver = {path="crates/csp-solver"}`; vendored `Cargo.toml` `version=0.1.0` + 40-hex pin `4568dc7…`; consumers `csp-solver="0.1"` in core/ir/egraph.
- `scripts/sync-csp-solver-vendor.sh` (`--check`/`--update`/`--verify`, `verify_tripwires`), `scripts/hooks/pre-push`, `scripts/.csp-solver-fields.baseline` (lists `restarts`).
- **Live `--check`: PASS** (byte-faithful to pin). **Scratch-excised-tree tripwire run:** (1) no-fire, (2) FIRE `> restarts`.
- `skinny/.../decision_csp.rs:85-96` `..Default::default()` + prior-churn comment; bbnf production zero-references to all 8 removed symbols; island self-containment (`Luby`/`NogoodStore`/`ConflictHistory` nowhere outside their files); `csp_strategy/mod.rs` COP via `CostDomain::cost`.
- **Pre-existing vendored-test rot proven:** `cargo build --tests` in `~/Programming/bbnf-lang/crates/csp-solver` → `error[E0432]` unresolved `solver::local_search`, `solver::gac_alldiff`. bbnf source tree left untouched.

---

## EXACT WAVE-SPEC AMENDMENT

Replace T2-W3's substrate-excision bullet (synthesis line 78) with:

> - **Substrate excision → csp-solver `0.3.0`** (breaking pub-API removal from tagged `v0.2.0`; correct minor-bump for a `0.x` crate — protects the crates.io `morph` `csp-solver="0.2"` consumer). Remove: `restart.rs`+`heuristic.rs`+`nogoods.rs` (335 LOC) with their three `solver/mod.rs` `pub mod` lines; `Ordering::Chs` (`ordering.rs:22`); `SolveConfig.restarts` (`config.rs:71` + its `Default` line); the **`SoftConstraint` island** — `SoftConstraint` trait (`traits.rs:218`) + its `constraint/mod.rs:19` re-export + `SoftLambdaConstraint`/`constraint/soft.rs` (whole file) + `mod.rs:18` re-export + `ConstraintEnum::Soft` (`dispatch.rs:24`) + `Csp::add_soft_constraint` (`csp/mod.rs:56`) — **keep `OptimizationMode`/`CostDomain`/`DomainCostEval` (bbnf's live `MinimizeCost` path)**; `variable.rs` `clear_log`/`reset_to`; `ordering.rs` doc-links. Trim (do not delete) `csp-solver/tests/optimize.rs` to drop the SoftConstraint cases and keep the CostDomain cases; delete `tests/nogoods.rs`, `tests/restart_nogood_soundness.rs`. **CHANGELOG `0.3.0` entry + version bump.**
>   - **bbnf vendored-copy sync — LOCAL-ONLY (bbnf-lang is never-push), run AFTER the csc411 excision commits, not before:** `cd ~/Programming/bbnf-lang && ./scripts/sync-csp-solver-vendor.sh --update <0.3.0-rev>` (re-vendors `src/`+`data/`+`tests(--existing)`, rewrites the SHA pin; the vendored `version=0.1.0` label is intentionally left untouched and decoupled), then `--verify`. Expect the field-set tripwire to **WARN** (not fail) on the removed `restarts` field — the sole downstream literal (`skinny/crates/passes/src/decision_csp.rs`) already spreads `..Default::default()`, so it absorbs cleanly; then **delete the `restarts` line from `scripts/.csp-solver-fields.baseline`** to re-green future runs. `--verify`'s consumer-compile matrix (root `bbnf`/`bbnf-ir`/`egraph` ∪ skinny `passes` ∪ vendored csp-solver × {default, py-isolated} + `--test lattice`) is the independent backstop that catches any incomplete SoftConstraint excision. **Note the gate's known blind spot:** `--update`'s `rsync --existing` (no `--delete`) plus `--verify`'s lattice-only test compile do NOT cover the other vendored test targets — which are already rotted at HEAD (`tests/local_search.rs`, `tests/gac.rs` fail to build against upstream 0.2.0 excisions). Prune the newly-orphaned `tests/nogoods.rs` (and, opportunistically, the already-dead `local_search.rs`/`gac.rs`) in the re-vendor commit.

Rationale for each delta: (semver label) holds — unchanged; ("check first" → post-commit local-only sequence) fixes the inverted ordering; ("semver-visible" → SHA-pinned/field-set-gated) fixes the coupling-axis mis-attribution; (SoftConstraint → the 5-part island + optimize.rs trim + OptimizationMode-keep) fixes the under-specified removal surface; (WARN + baseline refresh + orphaned-test prune) fixes the two hygiene gaps the terse "sync-gate check" hid.
