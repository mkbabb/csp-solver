# constraint-trait-bound-spike — Pass 4 (closure) — B1 resolution + orthogonal ac3 soundness fix

**Agent:** `constraint-trait-bound-spike` · Pass 4 · repo `CSC411_HW2_ProgrammingQuestion`
**Worktree:** `.claude/worktrees/wf_0c754e24-d3c-2` (isolated; base reset `bc37f4d`→`91bb8b0` — the known Pass-3 base-ref defect)
**Assignment:** R2 from `pass3/synthesis-pass3.md` §4 + `pass3/bbnf-vendor-blast-radius.md` B1.
**Verdict:** **HOLDS — the DO-NOT-BREAK contract is honored csp-side for B1, with zero bbnf edits.** The preferred resolution (remove `Send + Sync` from the shared `Constraint` trait, scope the bound to the PyO3 boundary) is now **prototyped and gated green**, not merely designed. The `Arc<Mutex>` B1 fallback is **not required**. B2 (the `SolveConfig` field additions) is orthogonal to the trait bound and still needs a one-line coordinated skinny edit — unavoidable regardless of B1 (§7).

**convergencePct: 95.**

---

## 0. Headline

| Item | Before spike | After spike | Gate |
|---|---|---|---|
| **B1** — `Constraint<D>: Send+Sync` supertrait vs bbnf's `!Send` `RefConstraint` | `E0277` ×2 (Send+Sync) at the `impl`/`add_constraint` site | **compiles + runs unchanged** (`obligations recorded: 1`) | ✅ |
| `cargo check --features py` (allow_threads intact) | green (baseline) | **green** (4 pre-existing cosmetic warnings, 0 err) | ✅ |
| `cargo test --workspace` | 170/170 | **170 passed / 0 failed / 6 ignored** | ✅ |
| `probe_gil.py` (heartbeat/timeout/cancel) on a built wheel | n/a | **3/3 checks pass** (74% ticks; timeout@1.002s; cancel@1.074s) | ✅ |
| `probe_gil_baseline.py` on a built wheel | n/a | **2/2 checks pass** (65% ticks; timeout@1.001s) | ✅ |
| `RefConstraint` (Rc<RefCell>) minimal-repro, **unchanged** | fails | **compiles + runs** | ✅ |
| skinny `SolveConfig` literal with `..Default::default()` | fails w/o spread | **compiles + runs** (`solutions: 1`) | ✅ |
| Fail-explicit: `!Send` `Constraint` impl **under `--features py`** | — | **rejected loudly** (`E0277`, "required by a bound in `Constraint`") | ✅ |

**Resolution class:** candidate **(b)** — a `cfg(feature = "py")`-gated marker supertrait (`ThreadSafe`), refined so the `Constraint` trait definition stays textually stable and the gate lives in exactly one place. Candidate (a) in its literal "bound only at the entry point, no cfg" form is **infeasible** (§3), and the `unsafe impl Send` variant is **rejected** on fail-explicit grounds (§3.3). The chosen shape is judged **fail-explicit-compatible and idiomatic** (§4), not a smell.

---

## 1. Setup — faithful composition of the artifact under test

Reset the worktree off the stale Pass-3 base and overlaid the composed tarball wholesale (the composed tree renames `py.rs`→`py/`, `backtrack.rs`/`backjump.rs`→`search.rs`, adds `cancel.rs`/`bitscan.rs`; a merge would leave stale modules, so a full replace is the only faithful method):

```bash
git reset --hard 91bb8b0                       # HEAD now 91bb8b0d
tar xzf pass3/composed-csp-solver.tgz -C stage-composed
rm -rf csp-solver && cp -R stage-composed/csp-solver csp-solver
```

Verified the overlay is the real composed tree, pre-spike:
- stale `src/py.rs`, `src/solver/backtrack.rs` **absent**; `src/py/mod.rs`, `src/solver/search.rs`, `src/cancel.rs` **present**.
- `constraint/traits.rs:26` = `pub trait Constraint<D: Domain>: Debug + Send + Sync {` (the B1 supertrait, live).
- The only pristine files dropped by the tarball are the stale replaced modules (correct) plus `wasm/pkg/*`, `wasm-morph/pkg/*` build outputs — the known hygiene gap already flagged in `synthesis-pass3.md` §4; irrelevant to every Rust gate here.

**Orthogonal ac3 soundness fix applied** (`csp-solver/src/solver/ac3.rs`, `ac3_from_variable`'s `Revision::Unsatisfiable` arm — the P0 from `gac-default-on.md` §2.5; I run in parallel with blocker-1 and land it independently in my worktree as instructed):

```rust
Revision::Unsatisfiable => {
    // AllDifferent's singleton loop / propagate_gac_core may prune several
    // scope vars before one domain empties and returns Unsatisfiable mid-loop;
    // those prunes were recorded on each var's undo log but NOT pushed onto the
    // kernel Trail, so Trail::undo_to never restored them (silent false-UNSAT).
    let scope = constraints[idx].scope();
    for &v in scope { trail.push(v); }
    return Some(idx);
}
```

This mirrors the existing `Changed` arm's scope-push exactly. Its effect is verified end-to-end at §6 (the wheel enumerate now returns `n_solutions=69643`, the post-fix count from `gil-liberation-completeness`, not the pre-fix `221`).

---

## 2. The mechanism — why the supertrait exists, why it bites, what "scoping" must overcome

`csp-solver` stores custom constraints in one monomorphic enum variant:

```rust
// constraint/dispatch.rs
pub enum ConstraintEnum<D: Domain> { NotEqual(..), AllDifferent(..), .., Custom(Box<dyn Constraint<D>>) }
// lib.rs
pub fn add_constraint(&mut self, c: impl Constraint<D> + 'static) {
    self.constraints.push(ConstraintEnum::Custom(Box::new(c)));   // every external constraint lands here
}
```

`Csp<D>` holds `Vec<ConstraintEnum<D>>`. PyO3 (0.24) crosses `Python::allow_threads(|| self.inner.solve(..))` (in `py/csp.rs` / `py/sudoku_api.rs`), whose closure captures `&mut Csp<BitsetDomain>` and must be `Ungil` — blanket-implemented for `Send`. So `allow_threads` requires **`Csp<BitsetDomain>: Send`**, hence `Box<dyn Constraint<D>>: Send`, hence the trait object must be `Send`.

The composed tree obtained that by making `Send + Sync` a **supertrait** of `Constraint`: a trait object `dyn Constraint<D>` inherits the auto-traits in its trait's transitive supertrait closure, so `Constraint: Send + Sync` ⟹ `dyn Constraint: Send + Sync` ⟹ `Csp: Send`. This is the **only** reason the supertrait is there (its own doc admitted "so `Csp<D>` can cross `allow_threads`").

**The bite (B1):** the supertrait is a hard requirement on *every* implementor. bbnf-lang's `RefConstraint` holds `sink: Rc<RefCell<Vec<TypeObligation>>>` — `Rc` is `!Send`, `RefCell` is `!Sync` — so `impl Constraint<TypeDomain> for RefConstraint` is rejected (`E0277`), and transitively so is `csp.add_constraint(RefConstraint::new(..))`. The blast report enumerated all 21 bbnf constraint impls and 6 domain families: `RefConstraint` is the **sole** `!Send`/`!Sync` constraint in all of bbnf.

**What any "scoping" fix must overcome:** the `Custom` box type is a *single monomorphic type* shared by both consumers. It must be simultaneously `!Send`-tolerant (bbnf stores `RefConstraint` in it) and `Send` (py's `allow_threads` needs `Csp: Send`). One concrete type cannot be both. This is the crux the spike has to resolve.

---

## 3. Candidate evaluation — (a) is infeasible in its literal form, (b) is the honest fix

### 3.1 Candidate (a) — "`Send+Sync` only at the py entry / trait-object site," no cfg
**Infeasible as literally stated.** A bound at the `allow_threads` entry cannot make an *inherently* `!Send` type `Send`: `Csp<BitsetDomain>` is `!Send` at its *definition* the instant `ConstraintEnum::Custom(Box<dyn Constraint<D>>)` is `!Send`. You cannot re-assert Send-ness at a call site for a type that isn't. The `Send` requirement propagates back to the *type of the box*, which is fixed once, at the enum. So (a) can only be realized by changing that box type — which lands you in (b) (cfg) or the unsafe variant (§3.3), or an invasive generic (§3.4). Reconciled against `pyo3-liberation.md`: that design wraps the *whole* `&mut Csp` in `allow_threads` (construction + search), so there is no narrower Send surface to bound — the entire `Csp` must be `Send`.

### 3.2 Candidate (b) — cfg(feature="py")-gated marker supertrait — **CHOSEN**
Keep the `Constraint` trait definition stable; replace the raw `Send + Sync` supertrait with a marker whose *content* is cfg-gated:

```rust
#[cfg(feature = "py")]     pub trait ThreadSafe: Send + Sync {}
#[cfg(feature = "py")]     impl<T: Send + Sync> ThreadSafe for T {}
#[cfg(not(feature = "py"))] pub trait ThreadSafe {}
#[cfg(not(feature = "py"))] impl<T> ThreadSafe for T {}

pub trait Constraint<D: Domain>: Debug + ThreadSafe { .. }
```

- **Under `--features py`:** `ThreadSafe` ≡ `Send + Sync`. The transitive supertrait chain `Constraint → ThreadSafe → Send/Sync` makes `dyn Constraint<D>: Send + Sync`, so `Csp<D>: Send` and `allow_threads` compiles unchanged. A `!Send` constraint is rejected at its `impl` site (fail-explicit — §5, §6).
- **Under default (bbnf's build):** `ThreadSafe` is blanket-impl'd for **all** `T`, so the effective bound on `Constraint` is **exactly `Debug`** — *byte-semantically identical to pristine `91bb8b0`'s `pub trait Constraint<D: Domain>: Debug`*. Every constraint impl that compiled at `91bb8b0` compiles here. `RefConstraint` compiles unchanged; zero bbnf edits.

This is the "cfg-gated bound alias inert in the vendored copy" the assignment named, refined so the gate is one localized block and the public trait signature reads clean.

### 3.3 Rejected alternative — `unsafe impl Send for PyCsp(Csp<..>)`
A py-only newtype with `unsafe impl Send` would also make `allow_threads` compile without touching the trait. **Rejected:** it is an *unchecked* promise. It compiles *silently* whether or not the stored constraints are truly `Send` — the exact opposite of the fail-explicit precept. If any py-reachable path ever boxed a genuinely `!Send` constraint, it would be undefined behavior with no diagnostic. The cfg marker instead makes the **compiler prove** Send-ness under `py` and **fail loudly** when it can't (§5). Strictly more honest; `pyo3-liberation.md` §8 independently declined `unsafe` for the same reason.

### 3.4 Rejected alternative — generic `ConstraintEnum<D, C = Box<dyn Constraint<D>>>`
A second type parameter for the box would scope Send-ness *without* cfg (py monomorphizes to `Box<dyn Constraint<D> + Send + Sync>`, bbnf to the plain box). **Rejected as disproportionate:** it threads a new type parameter through `Csp`, `add_constraint`, and every search/propagate signature — a large invasive refactor rippling across the whole solver — to achieve exactly the scoping the 30-line cfg marker achieves locally.

---

## 4. Judging (b) against the fail-explicit precept — justified, not a smell

The precept the assignment cites: *"conditional trait surfaces are a smell; justify or reject."* Judgment: **justified**, on four grounds.

1. **The public `Constraint` trait surface does not vary.** Both configurations expose `pub trait Constraint<D: Domain>: Debug + ThreadSafe`. Only the *content* of the `ThreadSafe` marker changes. bbnf never names `ThreadSafe`; the supertrait obligation is discharged automatically by the blanket impl. So there is no divergent *API* to reason about — the divergence is one internal capability bound.
2. **The bound and its sole reason appear and disappear together.** `Send + Sync` on constraints exists *only* to serve `allow_threads`, which is compiled *only* under `py`. Gating the bound behind the same feature that pulls in `pyo3` is *coherent*, not arbitrary — it is the standard Rust idiom for "this capability is required only when the threading/parallel feature is on" (cf. crates that gate `Send + Sync` behind a `sync`/`parallel`/`rayon` feature). An *incoherent* conditional surface would gate the bound on something unrelated to its purpose; this gates it on its exact cause.
3. **It is fail-explicit, not a fallback.** A cfg that changes a *compile-time* bound is checked by the compiler in *both* configurations (provided CI builds both — §8). It never silently degrades at runtime and never picks a weaker path on failure. Under `py`, a `!Send` constraint is a hard compile error at the offending `impl` (§5). The smell the precept guards against — silent runtime divergence — is absent.
4. **The residual risk (config drift) is exactly what the sync gate closes.** The one genuine hazard of cfg-gated bounds is that code compiling under one config fails under the other (the B1/B2 failure class itself). The enforced-compile sync gate (§8) building **both** configs is the mitigation, and it is mandatory either way.

Net: (b) is the idiomatic feature-gated-capability pattern, made honest by compiling both configs. Accepted.

---

## 5. Gate: minimal-repro consumers (the DO-NOT-BREAK contract)

Consumers point at the **worktree's spiked `csp-solver`** (default features — bbnf never enables `py`), using the exact shapes from `pass3/blast/repro/`.

**BEFORE the spike** — B1 reproduced against the composed tree (`consumer-ref` = the unchanged `_consumer_main.rs`, `Rc<RefCell>` `RefConstraint`):
```
error[E0277]: `Rc<RefCell<Vec<u32>>>` cannot be shared between threads safely
error[E0277]: `Rc<RefCell<Vec<u32>>>` cannot be sent between threads safely
error: could not compile `consumer-ref` (bin "consumer_ref") due to 2 previous errors
```

**AFTER the spike** — default features (= bbnf's build):
```
=== consumer-ref: RefConstraint Rc<RefCell> shape UNCHANGED ===
    Finished `dev` profile ... in 0.54s
obligations recorded: 1                              # compiles AND runs, source byte-unchanged

=== consumer-skinny: SolveConfig { .. ..Default::default() } ===
    Finished `dev` profile ... in 0.57s
skinny-mirror solutions: 1  shape0=0                 # compiles AND runs
```

**Fail-explicit** — a consumer enabling `csp-solver/py` *and* impl'ing `Constraint` for the `!Send` `RefConstraint` (`cargo check`):
```
error[E0277]: `Rc<RefCell<Vec<u32>>>` cannot be shared between threads safely
37 | impl Constraint<MyDomain> for RefConstraint {
   |                               ^^^^^^^^^^^^^ ... cannot be shared between threads safely
note: required by a bound in `Constraint`
error: could not compile `consumer-py-failexplicit` (bin "fe") due to 2 previous errors
```
Under `py`, the `!Send` impl is rejected loudly at line 37 — never a silent downgrade. This is the compiler-proven honesty that distinguishes (b) from the `unsafe` route.

**Effect-equivalence check** — bbnf's non-py bound == pristine:
```
git show 91bb8b0:.../traits.rs → pub trait Constraint<D: Domain>: Debug {
spike (not(py))               → Debug + ThreadSafe,  ThreadSafe blanket ∀T  ≡  Debug
```
The bbnf-facing trait requirement under the spike is *semantically identical* to `91bb8b0`. This is why the fix generalizes beyond `RefConstraint`: any impl that compiled at pristine compiles under the spike's default build.

---

## 6. Gate: `--features py` + `--workspace` + built-wheel probes

All commands run in the worktree; nothing pushed; wheel built into a scratch `uv` venv, never into the tracked tree.

**`cargo check --features py`** (spike must keep `allow_threads` compiling):
```
PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 cargo check --features py
    Finished `dev` profile ... in 5.12s      # 4 pre-existing non_camel_case_types warnings, 0 errors
```

**`cargo test --workspace`** (default features):
```
TOTAL passed=170 failed=0 ignored=6          # matches the composed-tree baseline exactly
```

**Wheel** (`maturin develop --release --features py`, cp314):
```
📦 Built wheel for CPython 3.14 ... sudoku_rs-0.1.0-cp314-cp314-macosx_11_0_arm64.whl
🛠 Installed sudoku-rs-0.1.0
```

**`probe_gil.py`** (the fixed-boundary suite — 3 checks) against the spiked wheel:
```
Probe 1 heartbeat during solve_sudoku_board():
  wall=4.202s heartbeat_ticks=310 (expected~420)   GIL held? no -- allow_threads working
  backtracks=1074083 budget_exceeded=True n_solutions=69643
Probe 2 asyncio.wait_for(timeout=1.0): timeout fired=True at wall=1.002s; 10 concurrent ticks
Probe 3 CancelToken: cancel() at t=1.002s, returned t=1.074s, cancelled=True budget_exceeded=False -> YES
```

**`probe_gil_baseline.py`** (the `create_sudoku_csp` + `solve_sudoku` path) against the spiked wheel:
```
Probe 1: wall=3.885s heartbeat_ticks=254 (expected~388) ratio=0.654 (not starved) n_solutions=69643
Probe 2: timeout fired=True at wall=1.001s; 10 concurrent ticks
```

Reading: `allow_threads` is intact after the spike on **both** py entry points — the heartbeat runs ~65–74% of expected ticks during a ~4s off-GIL solve (vs the ~0.2% starvation the pristine no-`allow_threads` build shows), the 1.0s timeout fires on time, and cancellation stops the search early with `cancelled=True`. The `n_solutions=69643` figure is the post-ac3-fix enumerate count, so the wheel simultaneously validates the orthogonal soundness fix end-to-end. (The `[no allow_threads]` label in the baseline script is historical — the composed tree's `solve_sudoku` already carries `allow_threads`, so it too releases the GIL.)

---

## 7. B2 is orthogonal and needs a one-line coordinated skinny edit — no csp-side fix exists

B2 is *not* a trait-bound problem and is outside this spike's B1 remit, but the contract accounting must state it. `SolveConfig` gained `restarts: bool` + `cancel: Option<CancelToken>` and is not `#[non_exhaustive]`; skinny's `crates/passes/src/decision_csp.rs:85` uses an **exhaustive literal without `..Default::default()`** → `E0063`. The root consumer (`csp_strategy/mod.rs:598`) already spreads `..default()` and survives.

- **csp-side `#[non_exhaustive]` does NOT rescue skinny.** A `#[non_exhaustive]` struct *cannot be constructed with a struct literal from another crate at all* — skinny's current exhaustive literal breaks *harder*, not less. So B2 requires the skinny edit **regardless of any csp-side change**.
- **Fix (verified in the mirror):** append `..Default::default()` to the skinny literal. The `consumer-skinny` mirror at §5 uses exactly this and compiles + runs (`solutions: 1`). It is a **coordinated bbnf/skinny edit** (one line), inside the never-push discipline — I can verify the shape but cannot land it in the bbnf repo.

**Contract accounting:** B1 = honored **csp-side** by this spike (zero bbnf edits). B2 = booked as a **coordinated one-line bbnf/skinny edit** that no csp-side change can absorb. The tranche document books these as two different things, exactly as `synthesis-pass3.md` §4 R2 anticipated.

---

## 8. Enforced-compile sync-gate spec (root + skinny as first-class members)

The existing `scripts/sync-csp-solver-vendor.sh --check` (per `pass2/bbnf-sync-gate.md`) is a **text-diff provenance gate**: it `diff`s the vendored `src/` against `git show <pin>:csp-solver/src` and fails on drift. It proves *"the copy matches the pin"* — orthogonal to *"the pinned code still builds its consumers."* When csc411 re-vendors this rewrite and bumps the pin, `--check` passes byte-for-byte while B1 (root) and B2 (skinny) would fail to compile. It catches neither. The gate must gain an **enforced compile stage** and a **structural tripwire**. This is the spec (lands in bbnf-lang; csc411 stays the untouched source of truth; **never push bbnf origin**).

### 8.1 New enforced compile stage — `--verify` (run in CI *and* the pre-push hook), fail-loud

```bash
# scripts/sync-csp-solver-vendor.sh --verify   (in addition to --check's text diff)
set -euo pipefail

# (1) ROOT workspace — the CI-gated consumer. Compiles bbnf-ir's RefConstraint (B1).
cargo check -p bbnf -p bbnf-ir -p egraph            # default features (py OFF) — bbnf's real config

# (2) SKINNY — a SEPARATE workspace, unreachable from every root alias
#     (iter-check-full, iter-test-leaf). This is the un-CI-gated landmine. NON-NEGOTIABLE.
( cd skinny && cargo check -p passes )              # catches B2's SolveConfig E0063

# (3) The vendored csp-solver crate itself, BOTH cfg branches — because the fix is
#     cfg-gated, drift can hide in either branch. This is the mitigation the cfg approach requires.
( cd crates/csp-solver && cargo check )             # default (not(py))  -> bbnf's branch
( cd crates/csp-solver && cargo check --features py ) # py branch — proves the marker still yields Csp: Send
```

Rationale, from the two breaks:
- **Root** compiling `bbnf-ir` reaches `impl Constraint for RefConstraint` — the only place B1 surfaces. A text diff never does.
- **Skinny is a distinct workspace**, invisible to `iter-test-leaf` (`-p bbnf-ir -p egraph -p csp-solver -p bbnf-ser`) and every other root alias. It must be a **first-class member of the gate's build set** — its `cargo check -p passes` is the *only* command anywhere that catches B2. The pass-2 spec named `decision_csp.rs` in prose but no automation reached it; this closes that.
- **Both cfg branches of the vendored crate** must build, precisely because the B1 fix is cfg-gated. `--features py` here also guards the marker's transitive-`Send` property (`Csp: Send`) against future edits that would silently break `allow_threads`. (csc411 additionally runs `cargo check --features py` + `cargo test --workspace` on every field/trait change — the standing W0 rule.)

### 8.2 Structural pre-build tripwire (fast, runs before the slow consumer compiles)

Flag the two mechanical break-classes at the diff, before the expensive builds:

1. **Trait-surface tripwire.** Any supertrait on `Constraint` / `Domain` / `LatticeDomain` other than the allow-list `{Debug, ThreadSafe}` (or a declared, cfg-gated marker) — in particular a raw `Send`/`Sync` re-added unconditionally, or any new non-cfg-gated supertrait:
   ```bash
   grep -REn 'pub trait (Constraint|Domain|LatticeDomain)[^:{]*:[^{]*\b(Send|Sync)\b' \
       crates/csp-solver/src && fail "raw Send/Sync back on a shared trait — scope it to `py` via ThreadSafe"
   # and: warn on any supertrait token outside {Debug, ThreadSafe} on those three traits.
   ```
2. **Field-add tripwire.** Any new public field on `SolveConfig` / `SolveStats` (the B2 class):
   ```bash
   # structural: compare the field set of SolveConfig/SolveStats vs the pinned rev; a delta warns
   # BEFORE the compile, and reminds that every downstream literal must spread ..Default::default().
   ```
   Standing rule (already in W0): a `SolveConfig`/`SolveStats` field add sweeps all exhaustive literals or uses `..Default::default()`; consider `#[non_exhaustive]` for *future* additions (it does not retroactively fix a live exhaustive literal).

### 8.3 Promote advisory → enforcement
`--update`'s step-2/3 printed reminders ("run `cargo iter-test-leaf`", "re-verify skinny compiles") become the **enforced `--verify` stage** above — text advice contradicted the spec's own fail-loud precept. Both `--check` (drift) and `--verify` (build) ship; the pre-push hook runs both.

**Gate membership, restated:** `{root: bbnf, bbnf-ir, egraph}` ∪ `{skinny: passes}` ∪ `{vendored csp-solver × (default, py)}` — skinny first-class, both cfg branches first-class.

---

## 9. Honest limitations (the residual behind convergencePct: 95)

1. **Minimal reproductions, not bbnf's actual tree.** As in the blast report, a real full-workspace bbnf build is out of reach in this harness (the `rsync` blows past 21 GB; `bbnf-ir` needs sibling repos `../pprint`, `../parse-that` + the proc-macro graph; never-push discipline). I compiled the *exact* `RefConstraint` (Rc<RefCell>) and skinny `SolveConfig`/`LambdaConstraint` shapes against the *real spiked crate*, and proved the non-py bound is *semantically identical to pristine `91bb8b0`* (§5) — which upgrades the argument from "RefConstraint compiles" to "any impl that compiled at pristine compiles" — but bbnf's other 20 impls / 6 domains / real `decision_csp.rs` were not compiled here. The `ThreadSafe`-vacuous-under-non-py equivalence makes a surprise unlikely; it is not zero.
2. **B2 is a bbnf-side edit I cannot land** (never-push). Verified in the mirror; booked as coordinated (§7).
3. **The spike adds one new public item** (`pub trait ThreadSafe`) to the vendored crate. Inert for bbnf (never named; discharged by the blanket impl), but a new surface — the sync-gate trait-surface allow-list (§8.2) names it explicitly so it is intentional, not accidental drift.
4. **Behavioral equivalence of the composition's *other* changes** (blame-signal revise, static cascade) is the blast report's separate residual (argued-confluent for bbnf's monotonic-lattice sweep), untouched by this B1 spike and unexecuted here.

None of these reopen the B1 decision; they bound how strongly the tranche may claim the *full* bbnf tree is proven green versus the *exact consumer shapes* proven green.

---

## 10. Deliverables

- **Spike diff:** `pass4/constraint-trait-bound-spike.diff` (81 lines; two files — `constraint/traits.rs` cfg-gated `ThreadSafe` marker + `solver/ac3.rs` 3-line soundness fix). `diff -rq stage-composed/csp-solver/src worktree/csp-solver/src` confirms **only these two files** differ from the composed tree — no accidental edits.
- **Sync-gate spec:** §8 (enforced `--verify` compile stage: root ∪ skinny ∪ vendored-crate×{default,py}; structural trait-surface + field-add tripwires; advisory→enforcement).
- **Verdict:** B1 **honored csp-side** via the cfg-gated marker, zero bbnf edits; `Arc<Mutex>` B1 fallback **not required**. B2 **needs the coordinated one-line skinny `..Default::default()` edit** (no csp-side fix exists). The false "purely additive" doc claim is deleted and replaced with the accurate rationale.

**convergencePct: 95** — the preferred resolution is prototyped and every required gate is green with measured evidence; the residual is the un-executed full-bbnf-workspace compile (harness/never-push bound) and B2's necessarily-bbnf-side one-liner.
