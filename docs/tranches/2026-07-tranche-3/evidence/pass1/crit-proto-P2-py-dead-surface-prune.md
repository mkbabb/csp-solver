# Critique — proto-P2-py-dead-surface-prune (REFUTE-BY-DEFAULT)

**Lane:** `crit-proto-P2-py-dead-surface-prune`
**Target report:** `pass1/proto-P2-py-dead-surface-prune.md`
**Method:** re-derived every material claim from the live tree (`master` @ `3b75eca2`) and from the proto's own worktree `.claude/worktrees/wf_8f3bd831-d64-11` (present, pruned, base `3b75eca2`). Ran the load-bearing gate (`cargo check --features py`) myself.

## Verdict at a glance

The **mechanical core** of the prune is real and gate-verified: the named symbols are genuinely caller-dead in the only two consumer populations that exist post-tranche-2, and the pruned worktree compiles clean under `--features py`. But the report's headline **"GO … tests-py AND the bbnf compile gate green with ZERO deaths"** overreaches on three axes it cannot substantiate locally, and it launders one **product/design amputation** (deleting the entire Futoshiki py surface) as if it were dead-code hygiene. That is the crux of the convergence gap.

---

## Claim-by-claim classification

### C1 — "tests-py has zero references to every named dead symbol." **CONFIRMED.**
Grepped `csp-solver/tests-py/*.py` (excluding `.venv`/`__pycache__`):
- `solve_sudoku_board`, `template_count`, `add_equals`, `add_less_than`, `add_greater_than`, `solve_with_given`, `propagate_with`, `PropagationStrategy`, and all 5 futoshiki symbols → **0 files each**.
- `.backtracks` attribute access → **0 hits**; `.budget_exceeded`/`.cancelled` on a `SudokuCSP` instance → **0 hits**. The only `budget_exceeded`/`cancelled` reads are on the **core** `csp.stats` (`test_wheel_contracts.py:105,155,156`), which the prune leaves untouched (`csp.rs:120-130` `SolveStats` getter is unmodified). Removing the `SudokuCSP` getters therefore cannot break a test. **Confirmed safe.**

### C2 — "the only consumers are tests-py + bbnf's compile gate (FastAPI excised)." **CONFIRMED (repo half) / UNVERIFIABLE (bbnf half).**
- `web/api` is **absent** from the tree — the FastAPI consumer is gone. No other in-repo `.py` imports `csp_solver` outside `tests-py/`. Confirmed.
- The **bbnf** half cannot be checked: `bbnf-lang` is **not present** on this machine (no `sync-csp-solver-vendor.sh` anywhere on disk). The proto's "consumer set is exactly tests-py + bbnf" and "not on PyPI ⇒ no external caller" rest on a repo that isn't here. Plausible under py-isolation (bbnf consumes the **core** lattice/propagate surface, not the py bindings), but **unverified**.

### C3 — "`cargo check --features py` clean, zero warnings." **CONFIRMED (re-ran).**
In the proto worktree I ran `cargo clean -p csp-solver && cargo check --features py`: `Finished … in 1.51s`, **zero warnings, zero errors**. The dead-field/unused-import fallout the report predicted absent is genuinely absent. Note the removal of the `SudokuCSP.cancelled` **field** (not just its getter) is not optional as the report's prose implies ("removed outright") — once the getter goes, the written-but-unread field would trip `dead_code`, which is `-D warnings` in CI. So field removal is **forced**, which also means the report's own open question "keep the field private + reserved?" would require an explicit `#[allow(dead_code)]` — a smell, not a free option.

### C4 — diff shape "5 files changed, +9/−427; futoshiki_api.rs −234." **CONFIRMED.**
Worktree `git diff --stat`: exactly `5 files changed, 9 insertions(+), 427 deletions(-)`, `futoshiki_api.rs` shown as `D` (deleted). `wc -l futoshiki_api.rs` on `master` = **234**. Per-file attribution in the report is net-vs-churn sloppy (report "sudoku_api −101 / enums −22 / mod −15" vs diffstat churn `109 / 26 / 21`) but immaterial — the net −418 is exact.

### C5 — the `to_pyerr` `Timeout` arm is SHAPE-CHANGED, cannot be py-only-removed. **CONFIRMED.**
`errors.rs:55-60` matches all four variants with **no wildcard**; `CspError::Timeout` is a live **core** variant (`error.rs:63`) feeding `code()→"TIMEOUT"` (`error.rs:94`) and `Display` (`error.rs:77`). Deleting just the arm → `E0004 non-exhaustive patterns`. The report's recommended shape (keep the arm + keep `CspTimeoutError` exported; defer "is `CspError::Timeout` itself dead?" to W-C/Q6) is correct. But this means the charter's stated scope ("remove the `to_pyerr` Timeout arm") is **not deliverable** by this lane — a carve-out from the GO, not a fulfilled item.

### C6 — "core `config.rs`/`error.rs` untouched, bbnf field-tripwire unaffected." **CONFIRMED (repo scope).**
The diff touches only `src/py/**` (all `#[cfg(feature="py")]`). `config.rs`/`error.rs` are not in the diffstat. The default (py-OFF) branch is trivially unaffected. The **bbnf** tripwire baseline claim inherits C2's UNVERIFIABLE caveat but is low-risk.

### C7 — "fresh wheel builds; 27 passed / 2 skipped, identical to baseline; 16 module symbols." **UNVERIFIABLE (not re-run) / plausible.**
Did not rebuild the wheel or introspect it here (maturin round-trip out of scope for a read-cheap critique). The symbol count is consistent with the surviving `mod.rs` registrations. The "wheel builds as `0.2.0`" while the crate is `0.3.0` is a **real** known bug the report correctly flags as W-A scope — and it means this gate result is **stamp-blind**: it cannot have exercised any version-gated test, so "identical to baseline" does not certify version behavior.

---

## Blast-radius omissions & overengineering (the REFUTE substance)

### R1 — Futoshiki deletion is a product amputation, not dead-code. **REFUTE as a settled action.**
The report deletes the **entire** Futoshiki py surface (234 LOC: `FutoshikiCSP`, `FutoshikiBoard`, `create_futoshiki_csp`, `solve_futoshiki`, `create_random_futoshiki`, `inequalities`/`board_size` getters) and files it under "caller-dead ⇒ safe." Two problems:
1. **"caller-dead in the current shipped consumer set" ≠ "should be deleted."** Gate-greenness proves *nothing-breaks*; it says nothing about whether the surface *should* exist. The bbnf compile gate is compile-only — it stays green whether or not Futoshiki exists, so it is **incapable of voting** on this deletion.
2. It **contradicts the owner's mandate verbatim**: "are the python bindings … **comprehensive**." Sudoku and Futoshiki are the two co-equal shipped games (CLAUDE.md: Futoshiki surfaces = "Rust, PyO3, wasm, API, frontend"). Amputating one game's py surface while keeping the other's makes the bindings *less* comprehensive and asymmetric. The mandate names **`sudoku_api.rs`**'s fate as the open question ("split into a sudoku module or removed as deprecated?") — it does **not** authorize deleting `futoshiki_api.rs`. This is an unratified design call wearing dead-code clothing.

### R2 — Bundling collapses three distinct risk classes under one "GO."
The charter lumps: (a) pure mechanical-dead (the `backtracks` alias, the two getters — zero-consumer, warning-forced); (b) convenience-fn removal (`solve_sudoku_board`, `template_count` — dead but a deliberate ergonomics surface someone authored); (c) design-laden removal of caller control (`PropagationStrategy` + `propagate_with` strip explicit strategy selection from Python — a *capability* reduction, not just dead code); plus (d) the R1 amputation. A tranche wave should **stage by risk**, not ship one monolithic GO that hides (c)/(d) behind (a)'s greenness.

### R3 — Not standalone-landable: coupled to W-A and W-B.
The report's own points #4/#5 concede the gate must be **re-run** after W-A (0.2.0→0.3.0 wheel-version fix) and after W-B (abi3-at-py310), because all three touch the same wheel. So "GO now" is really "GO conditional on re-running this exact gate twice more." That is not a settled-to-author state.

### R4 — bbnf gate greenness is conditional on a re-vendor.
Point #6 correctly notes the real bbnf gate **text-diffs** vendored `src/` against the pinned rev; a prune makes that diff **fail** until `--update` re-vendors. So "the bbnf compile gate is green" is false against the current pin and true only after a re-vendor step that isn't part of this lane. The headline should read "*will be* green after re-vendor," not "green."

---

## Convergence: **56%**

Starting from 100 (author-verbatim-now), deductions:

| Δ | Reason |
|---|---|
| −16 | **Futoshiki deletion (R1)** is an unratified product-surface amputation, not dead-code; contradicts the "comprehensive bindings" mandate and is un-votable by the compile gate. Must revert to an open design question, not a GO action. |
| −8 | **bbnf consumer-truth UNVERIFIABLE locally** (bbnf-lang absent) + gate greenness **conditional on `--update` re-vendor** (report #6). "green" is not demonstrated against the current pin. |
| −7 | **Not standalone-landable**: coupled to W-A (version-stamp fix) and W-B (abi3); report itself requires re-running this gate on both wheels (#4,#5). |
| −5 | **Timeout arm** shape-changed and deferred to W-C/Q6 — carved out of the GO, so the charter's stated scope isn't one deliverable wave. |
| −4 | **`cancelled` remove-vs-reserve** left open; reserving would need `#[allow(dead_code)]` (the "keep private + reserved" option isn't free, contra the report's framing). |
| −4 | **Bundling/overengineering (R2)**: mechanical-dead, convenience-removal, and capability-removal (`PropagationStrategy`) shipped under one verdict; a wave must stage by risk. |

Settled-and-ready (the ~56% that *can* be authored): removal of the `SudokuCSP.backtracks()` alias + the two `SudokuCSP` getters (+ forced field removal), and removal of the caller-dead `Csp` convenience/constraint helpers — all gate-verified compile-clean with zero test consumers. Everything design-laden or cross-wave-coupled is not.

---

## kill_list (claims that must die)

1. **"VERDICT: GO … tests-py AND the bbnf compile gate green with ZERO deaths."** The bbnf half is UNVERIFIABLE locally and false against the current pin until `--update` re-vendors (report's own #6). Demote to "tests-py green; bbnf green *after re-vendor*, pending bbnf-lang verification."
2. **Deleting `futoshiki_api.rs` (234 LOC) as a safe dead-surface prune.** It's an unratified amputation of a co-equal game's binding surface that cuts against the "comprehensive" mandate; the compile gate cannot vote on it. Must revert to an open design question.
3. **"the R4 prediction holds" (blanket).** Holds for tests-py only; not demonstrated for the bbnf consumer.
4. **Implicit "not on PyPI ⇒ consumer set is exactly tests-py + bbnf" as closed.** The bbnf side is unchecked here; assert it as pending, not settled.
