# Prototype P3 — py stub-shipping path spike

**Lane key:** `P3-py-stub-shipping-spike` · **Verdict: GO (hand-written pure-layout stub). Mixed
layout NOT forced.**

## The one question

What is the cheapest stub path that ships a working `.pyi` in the wheel — a **hand-written
`csp_solver.pyi`** under the current pure-Rust maturin layout, or **pyo3-stub-gen** with the mixed
layout (`python-source` + module-name `csp_solver._internal` + re-export `__init__.py`)? Per the
charter: attempt hand-written FIRST; fall back to pyo3-stub-gen only if maturin will not ship the
stub from pure layout.

## What I built / probed

Worktree: `.claude/worktrees/wf_8f3bd831-d64-12` (isolated; nothing ships). Toolchain present:
`maturin 1.12.6`, `uv 0.7.15`, `cpython-3.13.5` (uv-managed; matches the tests-py cp313 ABI pin,
`tests-py/pyproject.toml:16`). Wheel target is cp313 (pyo3 0.29 extension-module, no abi3 —
`Cargo.toml`/`workspace.dependencies`).

**Key layout finding (invalidates the charter's premise).** The current layout is *already* a
package folder, not a bare top-level module. maturin's default for a pure-Rust project whose
`module-name` is a plain identifier emits:

```
csp_solver/__init__.py     # auto-generated: `from .csp_solver import *`
csp_solver/csp_solver.cpython-313-darwin.so
```

(baseline `unzip -l` of the 0.2.0 wheel; the `__init__.py` is maturin-authored, there is **no**
python source dir in the crate — `find csp-solver -name '*.py' -not -path './tests-py/*'` is empty).
maturin's docs confirm the pure-Rust stub convention: *"In a pure Rust project, add type stubs in a
`<module_name>.pyi` file in the project root … Maturin will automatically include this file along
with the required `py.typed` file"* (https://www.maturin.rs/project_layout.html). So the mixed
layout the charter worried about is **not** the only way to get a package folder — maturin already
gives us one, and stubs drop straight into it.

**What I wrote:**
- `csp-solver/csp_solver.pyi` (NEW, ~130 lines) — hand-written against the **post-P2** surface:
  all futoshiki symbols removed; `Csp.{add_equals,add_less_than,add_greater_than,solve_with_given,
  propagate_with}`, `PropagationStrategy`, `solve_sudoku_board`, `template_count`, and the
  `SudokuCSP.{backtracks alias,budget_exceeded,cancelled}` getters omitted (synthesis §1.1/§1.2).
- `csp-solver/pyproject.toml` — W-A packaging fix folded in (version `0.2.0→0.3.0`, `description`,
  `readme`, `classifiers`, `[project.urls]`). **Orthogonal to stubs** — proven below.

## Gate results (quoted)

**Build — maturin auto-detects the stub, adds `py.typed`, no config entry:**
```
$ maturin build --release -i python3.13 -o /tmp/spike-wheels-stub
📖 Found type stub file at csp_solver.pyi
📦 Built wheel … csp_solver-0.3.0-cp313-cp313-macosx_11_0_arm64.whl
$ unzip -l …0.3.0…whl
  csp_solver/__init__.py
  csp_solver/__init__.pyi      ← the stub, placed inside the package
  csp_solver/csp_solver.cpython-313-darwin.so
  csp_solver/py.typed          ← auto-added marker (empty), PEP 561
  csp_solver-0.3.0.dist-info/METADATA   (13213 B — README embedded)
```

**Minimal-diff proof — the stub ships with ZERO pyproject/Cargo changes.** Rebuilt against the
*original* minimal pyproject (only delta vs the committed baseline = the added `.pyi`):
```
📖 Found type stub file at csp_solver.pyi
  csp_solver/__init__.pyi
  csp_solver/py.typed
```
Auto-detection keys off `module-name == <stub filename stem>`, independent of version/metadata. The
W-A 0.3.0/metadata enrichment is a *separate* fix that can ride the same wave but is not required
for stubs.

**GATE 1 — fresh venv + install + import:**
```
$ uv venv --python 3.13 spike-venv && uv pip install …0.3.0…whl mypy pytest pytest-timeout
$ python -c "from csp_solver import Csp, SolveConfig, UnsatisfiableError; print('import OK')"
import OK: <class 'builtins.Csp'> <class 'builtins.SolveConfig'> <class 'csp_solver.UnsatisfiableError'>
$ python -c "import csp_solver,os;print(sorted(os.listdir(os.path.dirname(csp_solver.__file__))))"
['__init__.py', '__init__.pyi', '__pycache__', 'csp_solver.cpython-313-darwin.so', 'py.typed']
```

**GATE 2 — mypy reads the stub:**
```
$ mypy --strict spike_script.py       # exercises Csp/SolveConfig/Pruning/Ordering/sudoku fns
Success: no issues found in 1 source file
$ mypy spike_bad.py                    # deliberate type errors — proves the stub is enforced
spike_bad.py:3: error: Argument 1 to "add_variable" of "Csp" has incompatible type "str"; expected "list[int]"
spike_bad.py:4: error: Incompatible types in assignment (expression has type "SolveConfig", variable has type "int")
```

**GATE 3 — stubtest:**
```
$ python -m mypy.stubtest csp_solver --ignore-missing-stub
STUBTEST CLEAN (no errors)
```
One iteration was needed: pyo3's `#[new]` maps to Python `__new__`, not `__init__`. stubtest caught
it on `SolveConfig` (10 errors) — fixed by declaring the parameterized constructor as
`def __new__(cls, …) -> SolveConfig`. The no-arg constructors (`Csp`, `CancelToken`) pass as
`__init__(self) -> None`. After the fix: clean.

**GATE 4 — tests-py green against the wheel:**
```
$ python -m pytest -q      # csp-solver/tests-py, wheel installed in the venv
27 passed, 2 skipped in 2.30s
```

**Bonus — stubtest as a P2-completion oracle.** Without `--ignore-missing-stub` against the
*current unpruned* wheel, stubtest flags **exactly 18** symbols, and every one is a P2 prune target:
`Futoshiki{Board,CSP}`, `create_futoshiki_csp`, `create_random_futoshiki`, `solve_futoshiki`,
`Csp.{add_equals,add_less_than,add_greater_than,solve_with_given,propagate_with}`,
`PropagationStrategy`, `SudokuCSP.{backtracks,budget_exceeded,cancelled}`, `solve_sudoku_board`,
`template_count`, plus the module `__all__`. So `--ignore-missing-stub` is load-bearing *only until
P2 lands*; once the Rust surface is pruned to match, stubtest runs with **no flag** for full
bidirectional coverage. The stub and P2's prune list are the same set — a free cross-check.

## Verdict — GO, hand-written, pure layout

The hand-written `csp_solver.pyi` path **wins outright**. It clears all four gates with a
**single-file diff** (adding the stub); the mixed layout / `csp_solver._internal` rename / manual
`__init__.py` was **never forced**. pyo3-stub-gen was not needed and would add a build-time codegen
dependency + the mixed-layout churn to solve a problem maturin already solves for free at this
surface size (~15 symbols, hand-maintainable, and self-checked by the stubtest contract).

### Exact diffs the winning path needs

1. **NEW `csp-solver/csp_solver.pyi`** — the post-P2 stub (this is the whole stub-shipping cost).
2. *(orthogonal, W-A)* `csp-solver/pyproject.toml`: `version = "0.3.0"` + `description`/`readme`/
   `classifiers`/`[project.urls]`. Not required for stubs; folds cleanly into the same wave.
3. **No `[tool.maturin]` `include` entry, no Cargo.toml change.** Auto-detection suffices.
4. **tests-py addition (recommend):** a `stubtest --ignore-missing-stub` step so the stub can never
   silently drift from `src/py/`. Post-P2, drop `--ignore-missing-stub` for full coverage.

### Answer to open question Q3

**Mixed layout is NOT forced → the §1.4 `csp_solver.sudoku` namespacing rejection stands
unreopened.** The gen path's mixed-layout cost never materialized; hand-written pure layout ships
the stub with zero structural change. The compiled surface stays flat (Polars model, R1 §1.5).

## What the critique pass should attack

- **pyo3 `#[new]` → `__new__` convention** is a stub-authoring footgun: any future `#[new]` on a
  pyclass must be stubbed as `__new__`, or stubtest breaks. The tests-py stubtest step is the guard;
  confirm CI actually runs it (py-runtime lane) so drift fails loud.
- **Module `__all__`** shows up in the runtime (via the auto `__init__.py`'s
  `if hasattr(csp_solver,"__all__")`) but not the stub — currently swept by `--ignore-missing-stub`.
  Decide whether the post-P2 stub declares `__all__` explicitly (recommended: it pins the public
  surface and lets stubtest run flag-free).
- **abi3 interaction (W-A row).** This spike built a version-specific cp313 wheel. abi3 is a pure
  wheel-tag/Cargo-feature change and does not touch the `.pyi` (stubs are plain text) — but confirm
  the W-A abi3 adoption still emits the same package folder so the stub still lands. Low risk; worth
  one build under `--features abi3`.
- **Surface accuracy.** The stub was hand-derived from `src/py/*.rs`; verify it against the *actual*
  post-P2 pruned build (P2 lane) — the 18-symbol stubtest delta above is the exact reconciliation
  list, so a post-P2 `stubtest` with no flag is the acceptance test.
- **`Csp.solve` return type** is stubbed `list[dict[int,int]]` (matches `csp.rs:84` marshalling);
  `SudokuCSP.solutions` is `list[dict[str,int]]` (`sudoku_api.rs:64`). Confirm the str/int key
  asymmetry is intended surface, not a stub error.
```
```
