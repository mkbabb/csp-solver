# W1 — Kernel

**The substrate every Rust wave builds on.** Lands the composed, soundness-verified v2 tree—unified search kernel, GAC, restart substrate, zero-alloc hot path, `py/` split with typed exceptions, the ThreadSafe trait bound—then executes the byte-neutral fast-follows and the Rust colocation splits.

**Dependencies**: ← W0. R1 and R2 are **closed** (Pass 4); no soundness caveat remains on this wave's foundation. **Effort**: L (3–7 days incl. verification reruns).

---

## Scope (file-level)

### 1. Land the composed v2 tree

Seed: [`../artifacts/composed-csp-solver-v2.tgz`](../artifacts/composed-csp-solver-v2.tgz) (extract-over; review delta via [`../artifacts/kernel-soundness-closure.diff.gz`](../artifacts/kernel-soundness-closure.diff.gz)). Contents, already composed in the verified order (kernel → gac → chs-substrate → zero-alloc → py-split; [`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 T5):

- **New**: `src/solver/{search,restart,heuristic}.rs`, `src/solver/gac/{mod,matching}.rs`, `src/py/{mod,config,csp,enums,errors,sudoku_api}.rs`, `src/{error,cancel,bitscan}.rs`, `tests/solution_set_invariance.rs`, the CI queens-smoke step.
- **Deleted**: `src/py.rs`, `src/solver/backtrack.rs`, `src/solver/backjump.rs` (CBJ excised—Pass-2 D3).
- **The P0 fix**: `src/solver/ac3.rs::ac3_from_variable`, `Revision::Unsatisfiable` arm pushes the constraint scope onto the `Trail` before returning—mirrors the `Changed` arm ([`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §0).
- **Unified propagation signature** (decided once, up front—it exists in no single prototype diff): `forward_check`/`ac_fc`/`ac3_from_variable` take trail + blame `Option<usize>` + `&mut BitsetWorklist` + `'static`; scratch folded into the Kernel spine (`Kernel`/`SearchParams` own the worklist and cancel state).
- **ThreadSafe bound** (R2): apply the `constraint/traits.rs` hunk of [`../artifacts/constraint-trait-bound-spike.diff.gz`](../artifacts/constraint-trait-bound-spike.diff.gz)—the ac3 hunk is already in v2. `pub trait Constraint<D: Domain>: Debug + ThreadSafe` with the cfg(feature="py")-gated blanket-impl marker; under default features the effective bound is exactly `Debug`, byte-semantically identical to pristine ([`constraint-trait-bound-spike.md`](../evidence/constraint-trait-bound-spike.md) §3.2). Delete the false "purely additive" doc-comment; replace with the accurate rationale.
- Land the 11 exported restart/nogood canary tests (`pass3/restart_nogood_soundness.tests.rs`)—the 3 `witness_*` tests are green today and flip red the day a restart driver lands, forcing re-proof ([`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #4).

### 2. Fast-follows (same wave, separate commits)

- **`SolveConfig::backjumping` deletion**—confirmed byte-neutral (same sha256 output) by the kernel-behavior critique; ~60 test-literal edits; `parity_probe.rs` + `solution_set_invariance.rs` sweep with them ([`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §7.5).
- **`Ordering::DomWdeg → Mrv` rename**—the name is a proven misnomer (weights frozen at 1.0; `Chs ≡ DomWdeg` bit-for-bit; Pass-2 D6). Semver-relevant: feeds W12's 0.2.0 rationale.
- **`SolveConfig::default()` values change** (Chronological → FailFirst-family)—**bbnf-coordination-gated** (Pass-2 D6: two live `finalize()+solve_optimized()` consumers); executes only inside W12's sync-gate window.
- **`#[non_exhaustive]`**: deliberately NOT applied—it breaks skinny's live exhaustive literal *harder*, not less ([`constraint-trait-bound-spike.md`](../evidence/constraint-trait-bound-spike.md) §7); reconsider for future-only additions post-0.2.0.
- Fix the 3 composition clippy residuals (W0's `-D warnings` blocker).

### 3. Pass-1 ledger items verified still open in the v2 tree (booked here; see [appendix A](../appendices/A-excision-ledger.md))

- **R7 (P0-class, FAIL-EXPLICIT)**: `BitsetDomain` still guards its `0..128` invariant with `debug_assert!` only—release builds silently alias `v ≥ 128` to `v mod 128`, reachable from published py/wasm bindings (verified in v2: `domain/bitset.rs:28,41`). Land a release-mode check or type-level guarantee + fix the wasm doc claiming `0..u32::MAX`.

### 4. Rust colocation (per [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.2/§2.4/§2.12)

- **`lib.rs` split** (567 L → 4 files): `lib.rs` (~40 L decls + re-exports), `config.rs` (~135 L: `Pruning`, `PropagationStrategy`, `OptimizationMode`, `SolveConfig`+Default, `SolveStats`, `Csp` struct), `csp/mod.rs` (~120 L builder surface), `csp/solve.rs` (~280 L dispatch). `Unsatisfiable` colocates with `csp/solve.rs` (its sole consumer)—the manifest's flagged coin-flip, resolved to its stated mild preference.
- **Tests-of-record doc-comments**: one line per `src/` module naming its `tests/` file(s), per the manifest's measured table (§2.4). Never test code moving into `src/`; `error.rs`'s 16-line inline whitebox `mod tests` stays (the CLAUDE.md precept amendment rides W13).

## Acceptance gates (all previously measured—reproduce on the landed tree)

| Gate | Proven value | Evidence |
|---|---|---|
| `cargo test --workspace` | 176 passed / 0 failed (26 binaries) | [`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §1 |
| `time_sudoku` byte-identical | AC3+FF 62bt/962prop · 3/293 · 105/1539; FC 207/789, 0/242, 501/1765 | ibid. §5, `pass4/time_sudoku-postfix.txt` |
| Parity matrix ([`../artifacts/parity_probe.rs`](../artifacts/parity_probe.rs)) | 146 byte-identical · 19 Ac3 count-drift **same sethash** · 1 budget-truncated · 2 `max=1` membership-proven · **0 completeness violations**; queens8=92, futoshiki_loose=288 across all 12 Pruning×Ordering at `budget=false` | ibid. §2, `pass4/parity-composed-postfix.txt` |
| Queens bench asserts | `cargo bench --bench queens` exit 0—92/14200 asserts pass (pre-fix: panicked `left: 5, right: 92`) | ibid. §3, `pass4/queens-bench-postfix.txt` |
| GAC corpus ([`../artifacts/gac_ab_corpus.rs`](../artifacts/gac_ab_corpus.rs)) | **0/113 false-UNSAT** both GAC states (revert-control: 26/113 reproduces) | ibid. §4 |
| `cargo check --features py` | green under Python ≤3.13; wheel probes 3/3 + 2/2 (heartbeat 74%/65%, timeout @1.001–1.002 s, cancel works) | [`constraint-trait-bound-spike.md`](../evidence/constraint-trait-bound-spike.md) §6 |
| Consumer repros | `RefConstraint` (`Rc<RefCell>`) compiles + runs **unchanged** under default features; skinny mirror w/ spread compiles + runs; `!Send` impl under `py` rejected loudly (E0277 at the impl site) | ibid. §5 |
| Criterion | re-baselined vs `91bb8b0`, disclosing the ~1.8× al_escargot wall regression (370→677 µs, byte-identical counts—GAC constant cost, accepted) | [`kernel-behavior-preservation.md`](../evidence/kernel-behavior-preservation.md); [`synthesis-pass3.md`](../evidence/synthesis-pass3.md) §1 #1 |

**Claim discipline**: the kernel is "sudoku-parity-preserving + sound-and-faster COP + verified-sound Ac3 enumerate"—never "behavior-preserving" (refuted; Ac3 rows on mixed constraints count-drift with identical solution sets by design of GAC).

## Seed artifacts

| Artifact | Use |
|---|---|
| `composed-csp-solver-v2.tgz` | **re-apply** (extract-over `csp-solver/`, then delete the 3 stale replaced modules; the tarball's `pkg/` files are preserved `91bb8b0` build outputs—CI's wasm-pack lane rebuilds at release, [`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §7.4) |
| `constraint-trait-bound-spike.diff.gz` | re-apply the `traits.rs` hunk only |
| `parity_probe.rs`, `gac_ab_corpus.rs` | verification probes—compile as examples, run, compare to the postfix baselines |
| backjumping deletion, Mrv rename, `lib.rs` split | **re-derive** (mechanical; no prototype diff—line ranges in [`be-colocation-manifest.md`](../evidence/be-colocation-manifest.md) §2.2) |

## Residual risks

- py-wheel runtime evidence (172/172, 4 typed exceptions end-to-end) is from a 3.13 host pre-closure; the v2 tree was compile-verified only under 3.12—**W0's maturin lane is the runtime gate** ([`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md) §7.6).
- The `lib.rs` split is spec-only (never compiled as split)—do it after the gates above are green, then re-run the workspace suite.
- Full-bbnf-workspace compile remains unexecuted (harness + never-push bound); the exact consumer shapes are proven, the other 20 impls/6 domains argued by the pristine-equivalence proof ([`constraint-trait-bound-spike.md`](../evidence/constraint-trait-bound-spike.md) §9.1). W12's `--verify` stage is the closing gate.
