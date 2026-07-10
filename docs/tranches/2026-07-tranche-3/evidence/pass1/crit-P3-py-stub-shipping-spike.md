# Critique — `crit-P3-py-stub-shipping-spike`

**Target:** `proto-P3-py-stub-shipping-spike.md` · **Stance:** refute-by-default.
**Headline verdict:** the load-bearing *mechanical* discovery is **CONFIRMED by direct artifact
inspection** — but the prototype's *conclusion* ("generation is NOT needed; hand-written wins
outright") is **over-broad**, its central deliverable (the `.pyi`) is **not authorable now** (it
encodes a post-P2 surface absent from the tree), and its drift-safety net is **unwired and, pre-P2,
structurally weak**. Convergence **70%**.

## Method

I did not have to trust the prototype's quoted gate logs: its worktree
(`.claude/worktrees/wf_8f3bd831-d64-12`) and spike wheel
(`/tmp/spike-wheels-stub/csp_solver-0.3.0-cp313-cp313-macosx_11_0_arm64.whl`) still exist, so I
inspected the **actual built wheel** and cross-checked against maturin's docs and the current main
tree.

## Claim-by-claim

### C1 — "maturin's pure-Rust default emits a package folder (`csp_solver/__init__.py` + nested `.so`)" — **CONFIRMED**
`unzip -l` of the spike wheel shows `csp_solver/__init__.py` (123 B), `csp_solver/csp_solver.cpython-313-darwin.so`, not a bare top-level module. The `__init__.py` is maturin-authored: `from .csp_solver import *` + the `__all__`/`__doc__` passthrough. Docs corroborate: *"Maturin will add a necessary `__init__.py` to the package when building the wheel"* (https://www.maturin.rs/project_layout.html). No `.py` source lives in the crate (`find csp-solver -name '*.py' -not -path '*/tests-py/*'` empty). **True.**

### C2 — "maturin auto-detects a root `csp_solver.pyi` and places it as `csp_solver/__init__.pyi`, auto-adding `csp_solver/py.typed`" — **CONFIRMED**
The wheel contains `csp_solver/__init__.pyi` (3686 B, identical byte-size to the worktree's `csp-solver/csp_solver.pyi`) **and** `csp_solver/py.typed` (0 B). Docs corroborate verbatim: *"In a pure Rust project, add type stubs in a `<module_name>.pyi` file in the project root … Maturin will automatically include this file along with the required `py.typed` file for you."* The build log line *"Found type stub file at csp_solver.pyi"* is maturin's documented emit. **True.**

### C3 — "ships with ZERO pyproject/Cargo changes; auto-detection keys off `module-name == <stub stem>`" — **CONFIRMED (with one standing precondition)**
The mechanism is unconditional given the *already-committed* config: `csp-solver/pyproject.toml` sets `module-name = "csp_solver"` and the stub stem is `csp_solver`; `[lib] crate-type = ["lib"]` with maturin adding `cdylib` (Cargo.toml:52-54). Docs confirm the stub inclusion is automatic, no `[tool.maturin] include` entry. Precondition: the match `module-name == stub-stem` must hold — it does today, and any future module rename (e.g. the rejected `csp_solver._internal`) would silently break auto-detection. Non-blocking but worth a tripwire. **True.**

### C4 — the proposed metadata bump is "orthogonal (W-A)" — **CONFIRMED, but note a live inconsistency**
Correct that the stub mechanism is independent of the metadata. But the main tree already carries the split the proto calls orthogonal: `Cargo.toml` is `version = "0.3.0"` while committed `csp-solver/pyproject.toml` is `version = "0.2.0"` — so CI's `maturin build` (`.github/workflows/ci.yml:186`) currently emits a **0.2.0-labelled wheel from a 0.3.0 crate**. The stub wave that touches this file should reconcile the version, or it ships a mislabeled artifact. Pre-existing, small, but not "nothing to do."

### C5 — "pyo3-stub-gen and the mixed layout are NOT needed" — **CORRECTED (half survives, half must die)**
- *Mixed-layout rejection:* **CONFIRMED.** The wheel proves a package folder + shipped stub with a flat compiled surface and no `python-source`/`_internal` rename. The §1.4 `csp_solver.sudoku` namespacing rejection stands.
- *"Generation not needed" (blanket):* **REFUTED as over-broad.** The proto framed the choice as binary — hand-written pure layout **vs** pyo3-stub-gen **with mixed layout** — and never considered **maturin-native `maturin build --generate-stubs`** (pyo3-introspection / `experimental-inspect`), which emits generated stubs into the **same** pure-Rust package folder **without** the mixed layout (PyO3/maturin #2940, #3105; https://pyo3.rs/main/type-stub). That path directly neutralizes the hand-maintenance drift the proto itself flags as its top attack surface, at no layout cost. The proto's own evidence (the 18-symbol stubtest delta) shows the surface is mechanically introspectable. So "generation is not needed" is **not settled** — it's an unmade decision between *hand-written + stubtest-guard* and *generate-at-build*. Note the generate path is still flagged experimental, so hand-written may still win — but on **stated** grounds, not by omission.

### C6 — "tests-py stubtest step means the stub can never silently drift" — **REFUTED**
Two independent failures:
1. **Unwired.** `grep -rn stubtest` over the main tree and `.github/workflows/ci.yml` returns nothing — the guard exists only as a proto recommendation. The py-runtime lane today is build-wheel → `uv sync` → `pytest` (ci.yml:181-203); adding stubtest is net-new, unproven on the runner.
2. **Structurally weak in the exact window it's proposed for.** Pre-P2 it must run `--ignore-missing-stub` (the proto says so). That flag *by construction* suppresses "symbol present at runtime, absent from stub" — i.e. a **new `#[pyclass]` added to `src/py/` would NOT fail the gate**. So the guard cannot catch the most likely drift (surface growth) until P2 lands and the flag is dropped. "Can never silently drift" is false for the pre-P2 period.

### C7 — the hand-written `.pyi` is "the exact diff the winning path needs" — **REFUTED (not authorable now)**
The stub was authored against a **post-P2 surface that does not exist in the tree**. Current `src/py/mod.rs:38-48` still `pub use`s and `m.add_*`s **all** futoshiki symbols (`FutoshikiBoard/CSP`, `create_futoshiki_csp`, `create_random_futoshiki`, `solve_futoshiki`), plus `solve_sudoku_board`, `template_count`, and `PropagationStrategy` — every one of which the proto's stub omits (proto §"What I wrote"). The proto concedes this ("verify it against the actual post-P2 pruned build"). Consequence: the `.pyi` **cannot be authored verbatim into a wave** independent of P2; it is a P2-downstream artifact. Against the *current* wheel it would fail bidirectional stubtest on ~18 symbols — the proto's own delta count. This is the single largest convergence drag.

### C8 — GATE results (import OK / mypy strict / stubtest clean / 27 passed) — **CONFIRMED-adjacent, partly non-load-bearing**
The wheel artifact I inspected matches the gate narrative (correct files present, `py.typed` empty, METADATA 13213 B, README embedded — `csp-solver/README.md` exists, 12695 B, so `readme = "README.md"` resolves). I did not re-run GATE 1-4. Note GATE 4 ("27 passed, 2 skipped") is **not load-bearing for the stub**: a `.pyi` is compile-time typing only and cannot affect pytest runtime — it proves the wheel still works, not that the stub is correct. The `#[new] → __new__` finding (GATE 3) is a real, correctly-diagnosed pyo3 footgun and a durable authoring hazard for any hand-written stub.

### C9 — abi3 interaction "low risk, stubs are plain text" — **UNVERIFIABLE (untested)**
No `abi3` appears in `csp-solver/Cargo.toml` or workspace deps; the spike built a version-specific cp313 wheel. The reasoning (stub is text, independent of the wheel tag) is sound in principle, but the proto's own recommendation of "one build under `--features abi3`" is not executed. Genuinely low risk; leave as an open verify item, not a blocker.

## Blast-radius omissions
- **maturin-native `--generate-stubs`** entirely unconsidered (C5) — the decisive gap in the "generation not needed" conclusion.
- **P2 coupling not surfaced as a scheduling constraint** (C7): P3-stub-content is a strict downstream of P2-prune; the wave DAG must order them, and the `.pyi` can't be pre-written.
- **module-name/stub-stem coupling** (C3) has no tripwire proposed, yet a future rename silently drops the stub from the wheel — the same failure class the proto's `sync-csp-solver-vendor.sh` tripwires guard elsewhere.
- **version reconciliation** (C4) rides along but isn't called out as required.

## Convergence — 70%
Deductions from 100:
- **−15** — the deliverable `.pyi` is P2-dependent; cannot be authored verbatim now (C7).
- **−8** — "generation not needed" over-broad; maturin `--generate-stubs` (no mixed layout) unexamined, so the hand-written-vs-generated decision is unmade (C5).
- **−5** — the drift guard is unwired and, pre-P2 under `--ignore-missing-stub`, cannot catch surface growth; "can never silently drift" is false (C6).
- **−2** — abi3 interaction unverified (C9).

What IS settled and authorable now: the **path decision** — ship a stub via the pure-Rust layout, do **not** adopt the mixed layout / `_internal` rename; maturin auto-detects `csp_solver.pyi` → `__init__.pyi` and adds `py.typed` with zero `[tool.maturin]` config. That mechanical spine is proven against the real wheel and the docs. What is NOT authorable: the stub's *contents* (P2-blocked), the *generated-vs-hand-written* choice (one option unexamined), and the *CI guard* (unwired + weak pre-P2).

## kill_list (claims that must die as written)
1. "pyo3-stub-gen and the mixed layout are NOT needed" → keep only "the **mixed layout** is not needed"; the blanket rejection of **all generation** must die (maturin `--generate-stubs` is generation without mixed layout).
2. "the tests-py stubtest step means the stub can never silently drift from `src/py/`" → false: the step is unwired, and under the required `--ignore-missing-stub` it cannot catch new runtime symbols.
3. Treating the hand-written `.pyi` as "the exact diff the winning path needs" (authorable now) → it encodes a post-P2 surface absent from the tree; it is a P2-downstream artifact, not a standalone wave input.
