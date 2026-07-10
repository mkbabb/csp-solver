# R1 — PyO3 + Python-native-extension SOTA (July 2026) vs `csp-solver/src/py/`

Lane: PASS-1 web research. Read-only. Every codebase claim is `file:line`; every web claim is a URL.

## Part 1 — The SOTA convention set (cited)

### 1.1 Declarative `#[pymodule]` and submodule organization (PyO3 0.29-era)

- The **declarative module** form is the current idiom: declare classes/functions/constants/submodules *inline*, letting the `#[pymodule]` macro auto-set each `#[pyclass]`'s `module` attribute. Nested `#[pymodule]` fns are auto-treated as submodules (no `PyInit_` entrypoint emitted). Source: [PyO3 module guide](https://pyo3.rs/main/module), [guide/src/module.md](https://github.com/PyO3/pyo3/blob/main/guide/src/module.md).
- For a submodule to correctly stamp its children's `__module__` (e.g. `csp_solver.sudoku`), the child `#[pymodule]` must carry `#[pymodule(submodule)]`. Without it, submodule `#[pyclass]` module attributes are "not considered covered." Source: [issue #4286](https://github.com/PyO3/pyo3/issues/4286), [PR #4301](https://github.com/PyO3/pyo3/pull/4301).
- Inline exports use `#[pymodule_export]` on functions and classes. Override the Python-visible name with `#[pyo3(name = "...")]`. Source: [module guide](https://pyo3.rs/main/module).
- The **procedural** form (a `fn(m: &Bound<'_, PyModule>)` body calling `m.add_class`/`m.add_function`) is still fully supported and is what large production crates predominantly ship, but new code is nudged toward declarative for the auto-`__module__` correctness. Source: [module guide](https://pyo3.rs/main/module).
- **Submodule caveat that shapes the mega-vs-split decision:** native submodules created via `add_submodule` are *not* real Python packages — `import parent.child` doesn't work unless you also register them in `sys.modules`; they're only reachable as attributes. Source: [discussion #3591 "General issues with submodules"](https://github.com/PyO3/pyo3/discussions/3591). This is why most projects keep the *compiled* surface flat and build the package namespace in a Python `__init__.py` shim.

### 1.2 `Bound<'py>` API norms

- The `Bound<'py, T>` smart pointer is the norm; the old GIL-Ref API (`&PyModule`, `Python::acquire_gil`) is removed. Module fns take `&Bound<'_, PyModule>`; `py.get_type::<T>()` returns a `Bound`. Our code already uses this shape (`m: &Bound<'_, PyModule>`, `m.py().get_type::<...>()`) — `csp-solver/src/py/mod.rs:53,79`. Source: [PyO3 changelog](https://pyo3.rs/main/changelog.html), [PyModule prelude docs](https://mejrs.github.io/pyo3/internal/doc/pyo3/prelude/struct.PyModule.html).
- GIL release is now `py.detach(|| ...)` (renamed from `allow_threads`); our code uses the new spelling throughout (`csp.rs:70,78,87`; `sudoku_api.rs:162`). This confirms 0.29-era API usage.

### 1.3 Type stubs (`.pyi`) — the biggest SOTA lever

- **`pyo3-stub-gen`** (Jij-Inc) is the de-facto stub generator: annotate `#[gen_stub_pyclass]`/`#[gen_stub_pyfunction]`, run a small `gen_stub` binary, emit `*.pyi`. Maturin auto-includes the stub in the wheel. It can also emit Sphinx API docs from the same Rust type metadata. Min Python 3.10. Source: [pyo3-stub-gen GitHub](https://github.com/Jij-Inc/pyo3-stub-gen), [crates.io](https://crates.io/crates/pyo3-stub-gen), [docs.rs](https://docs.rs/pyo3-stub-gen).
- PyO3 itself now documents stub generation + **introspection** as a first-class concern (a newer built-in path is emerging alongside pyo3-stub-gen). Source: [PyO3 "Type stub generation and introspection"](https://pyo3.rs/main/type-stub), [Appendix C: Python typing hints](https://pyo3.rs/main/python-typing-hints.html).
- **What top projects ship:** Polars, pydantic-core, cryptography, and Ruff are all PyO3-in-production; the mature ones ship hand-maintained or generated `.pyi` alongside a Python package shim. `stubtest` is run in CI with `--ignore-missing-stub` because maturin's internal `.so` re-exports into `__init__` confuse the stub matcher. Source: [PyO3 v0.28 shipping guide (Nandann)](https://www.nandann.com/blog/rust-pyo3-python-extensions-guide), [maturin discussion #2486](https://github.com/PyO3/maturin/discussions/2486), [maturin RFC #3090 automated stub gen](https://github.com/PyO3/maturin/issues/3090).

### 1.4 abi3 vs versioned ABI — the 2026 landscape

- 2026 posture after **PEP 803** (steering-council approved): distribute, per OS/arch, three wheels — an `abi3` wheel at your **minimum** supported Python, a `cp314t` version-specific wheel for free-threaded 3.14, and an `abi3t` wheel (new stable ABI for free-threaded builds) built against 3.15's limited API for forward compatibility to 3.15+. Source: [PEP 803](https://peps.python.org/pep-0803/), [PyO3 building-and-distribution](https://pyo3.rs/main/building-and-distribution).
- Free-threaded builds use a wholly new ABI; `abi3` alone is *ignored with a warning* under a free-threaded interpreter (no limited-API equivalent existed pre-PEP-803). Enabling both `abi3` + `abi3t` PyO3 features yields `abi3` for ≤3.14 targets and `abi3t` for ≥3.15. Source: [PyO3 free-threading guide](https://pyo3.rs/v0.29.0/free-threading), [PyO3 features reference](https://pyo3.rs/main/features).
- Practical implication: a project that ships **no** `abi3` feature builds one wheel *per* CPython minor (cp310…cp313), multiplying the CI matrix. abi3 collapses that to a single forward-compatible wheel at the cost of a slightly narrower API. For a solver crate that uses only stable-API surface, abi3 is the low-friction default.

### 1.5 Maturin layout / metadata conventions

- **Pure-Rust extension** (no Python source): package name == module name is fine; maturin builds a single compiled module. Source: [maturin project_layout](https://www.maturin.rs/project_layout.html).
- **Mixed layout** (any Python shim, incl. a `.pyi` stub package or `__init__.py` namespace): put Python under `python-source = "python"` and name the compiled module `<pkg>._internal` (underscore prefix) so IDEs don't confuse the pure-Python package with the native module, and so end users are nudged to the Python API not the raw `.so`. Source: [maturin project_layout](https://www.maturin.rs/project_layout.html), [Medium: mixed Rust/Python](https://medium.com/@MatthieuL49/a-mixed-rust-python-project-24491e2af424).
- Module name resolves from pyproject `project.name` over Cargo `package.name`. Source: [maturin PR #1608](https://github.com/PyO3/maturin/pull/1608).
- **Polars' shape** as the reference multi-domain project: the bindings crate is named `py-polars`/`polars-python` (distinct from the wrapped `polars`), but the *Python* package and module are both `polars`; a thin Python API layer dynamically loads one of several compiled runtimes. The compiled surface stays flat; domain extensions (`polars-distance`, `polars-geo`, `polars-ml`) are *separately-installable* packages, not submodules of one mega-`.so`. Source: [Polars install/runtime (DeepWiki)](https://deepwiki.com/pola-rs/polars/1.3-installation-and-runtime-selection), [pypi polars](https://pypi.org/project/polars/).

### 1.6 Naming conventions

- `#[pyclass]` types → **PascalCase** (`SolveConfig`, `CancelToken`). `#[pyfunction]` → **snake_case** (`create_sudoku_csp`). Exception classes → PascalCase ending in `Error`. Enum *members*: Python's own `enum.Enum` idiom is UPPER_CASE members, so `AC3`/`FAIL_FIRST` are Pythonic even though they read oddly from Rust. Source: [PyO3 exception guide](https://github.com/PyO3/pyo3/blob/main/guide/src/exception.md), general PEP 8.
- **Error export idiom:** `create_exception!(module, Name, BaseClass, "docstring")` then add to the module; a `From<MyError> for PyErr` impl centralizes variant→class mapping so call sites just `?`. Exception hierarchies (a common base) are an active ask. Source: [create_exception docs.rs](https://docs.rs/pyo3/latest/pyo3/macro.create_exception.html), [issue #3452 exception hierarchy](https://github.com/PyO3/pyo3/issues/3452).
- **Factory idiom (mega vs submodule):** two live patterns — module-level factory functions (`csp_solver.create_sudoku_csp(...)`) vs `@classmethod` constructors / submodule namespacing (`csp_solver.sudoku.create(...)`). Top projects prefer *namespaced submodules per domain once a domain grows past a handful of symbols*, exposed via a Python `__init__.py` that imports from the flat native module. Source: [module guide](https://pyo3.rs/main/module), Polars extension model above.

## Part 2 — Scored assessment of our `csp-solver/src/py/`

Directory: `mod.rs` (89), `enums.rs` (72), `config.rs` (149), `csp.rs` (131), `errors.rs` (68), `sudoku_api.rs` (338), `futoshiki_api.rs` (234). All under the 500-line house budget. PyO3 pinned `0.29`, `extension-module` only (`Cargo.toml:24` workspace root). Module registered at `lib.rs:30` (`pub mod py`), single flat `#[pymodule] csp_solver` (`mod.rs:52-88`).

| Dimension | SOTA target | Our shape | Score /5 | Evidence |
|---|---|---|---|---|
| Module decomposition | one file per domain, <500 ln | 7 files by concern (enums/config/csp/errors + 2 domain APIs) | **5** | `mod.rs:33-38` |
| `Bound<'py>` API | mandatory | fully adopted incl. `py.detach` | **5** | `mod.rs:53`, `csp.rs:68-87`, `sudoku_api.rs:162` |
| Error export | `create_exception!` + central `From` | exactly this, 4 typed classes, one `From<CspError>` | **5** | `errors.rs:24-68` |
| pyclass/pyfn naming | PascalCase/snake_case | correct; enums UPPER_CASE members (Pythonic) | **5** | `enums.rs:12-19`, `sudoku_api.rs:88-90` |
| GIL discipline | release for native work | `py.detach` around every solve/generate | **5** | `csp.rs:87`, `sudoku_api.rs:162,234,275` |
| `.pyi` type stubs | pyo3-stub-gen, shipped in wheel | **NONE** — zero `.pyi` in the crate | **0** | `find … -name '*.pyi'` → empty |
| abi3 posture | abi3 (+abi3t) for min ver | version-specific only (`extension-module`, no `abi3`) | **2** | `Cargo.toml:24` |
| Maturin metadata correctness | pyproject version tracks crate | pyproject `version = "0.2.0"` vs crate `0.3.0` — **drift** | **1** | `pyproject.toml:7` vs `Cargo.toml:3` |
| module-name hygiene | `_internal` if any Py shim | pure-Rust, name==module — OK *as pure-Rust*, but blocks stub packaging without a `python-source` shim | **3** | `pyproject.toml:6,13` |
| Declarative `#[pymodule]` | emerging norm | procedural `m.add_*` form | **4** (valid, not deprecated) | `mod.rs:52-88` |
| Domain split (mega vs submodule) | submodule per domain once large | one flat module; 20+ symbols incl. sudoku+futoshiki+core all top-level | **3** | `mod.rs:54-87` |

**Aggregate: 42/55 (76%).** The internal decomposition, error taxonomy, GIL discipline, and Bound-API adoption are at or above SOTA. The deficits are all in *packaging/distribution*, not code structure.

### Concrete defects found (substantiated)

1. **Version drift — packaging bug.** `pyproject.toml:7` declares `version = "0.2.0"`; the crate is `0.3.0` (`Cargo.toml:3`). A maturin build stamps the wheel `0.2.0`, contradicting the published-crate version and the tranche-2 "csp-solver is 0.3.0" landing. Also `pyproject.toml` carries **no `[project.urls]`, no description, no classifiers, no authors** — thin dist-info vs SOTA (`pyproject.toml:1-13`).

2. **No type stubs at all.** Zero `.pyi` files. Every consumer (bbnf-lang's py-isolated compile gate, `tests-py/` wheel contracts at `csp-solver/tests-py/test_wheel_contracts.py`) gets *no* editor completion or `mypy` surface for `Csp`, `SolveConfig`, the four exceptions, or the domain APIs. This is the single largest gap vs polars/pydantic-core/cryptography. Remediation: adopt `pyo3-stub-gen`, which requires a mixed layout (add `python-source`, rename module `csp_solver._internal`, re-export in `__init__.py`).

3. **abi3 absent.** `extension-module` without `abi3` (`Cargo.toml:24`) forces a per-minor wheel matrix. The crate uses only stable-API surface, so `abi3` at `requires-python = ">=3.10"` (`pyproject.toml:8`) would collapse the matrix to one wheel; PEP-803 `abi3t` is the forward path for free-threaded 3.14+/3.15.

### Direct answers to the owner's binding questions

- **"Should `sudoku_api.rs` be split into a sudoku module or removed as deprecated?"** — It is **not deprecated**: it is live-tested by `tests-py/` wheel contracts and mirrors `futoshiki_api.rs`. It is the largest py file (338 ln) but under budget. The SOTA move is *not* deletion; it's **namespacing per domain** — a `py/sudoku/` submodule (`mod.rs` + `api.rs` + a future `types.rs`) exposed to Python as a real `csp_solver.sudoku` subpackage via a `python-source` `__init__.py` shim (native submodules alone don't support `import csp_solver.sudoku` — [discussion #3591](https://github.com/PyO3/pyo3/discussions/3591)). Same for futoshiki. That satisfies the recursive-colocation edict and the domain-split SOTA simultaneously. A pure in-`.so` `#[pymodule(submodule)]` split gets the `__module__` stamping but not import-ability, so pair it with the Python shim.

- **Are the bindings "optimal, comprehensive, structured well"?** — *Code structure:* yes, at/above SOTA (76% aggregate, all deductions in packaging). *Comprehensive/optimal for distribution:* no — missing `.pyi`, abi3, and a version-synced/enriched pyproject are the three gaps that separate this from a polars-class shipped extension.

## Prototype-worthy recommendations for later passes (not implemented here)
- Add `pyo3-stub-gen`; emit `csp_solver.pyi` (or per-submodule stubs) into a `python-source` package. Ships editor + `mypy` surface for all consumers.
- Convert to mixed layout: `module-name = "csp_solver._internal"`, `python-source = "python"`, `python/csp_solver/__init__.py` re-exporting the flat native symbols and building the `csp_solver.sudoku` / `csp_solver.futoshiki` namespaces.
- Add `abi3` PyO3 feature at py310; plan `abi3t` for the free-threaded wheel.
- Fix `pyproject.toml` version→0.3.0 and enrich dist-info (description, urls, classifiers).
- Optionally migrate `#[pymodule] csp_solver` to the declarative form with `#[pymodule(submodule)]` children for auto-`__module__` stamping.

## Sources
- PyO3 module guide — https://pyo3.rs/main/module · https://github.com/PyO3/pyo3/blob/main/guide/src/module.md
- Submodule caveats — https://github.com/PyO3/pyo3/discussions/3591 · https://github.com/PyO3/pyo3/issues/4286 · https://github.com/PyO3/pyo3/pull/4301
- Stubs — https://github.com/Jij-Inc/pyo3-stub-gen · https://crates.io/crates/pyo3-stub-gen · https://docs.rs/pyo3-stub-gen · https://pyo3.rs/main/type-stub · https://pyo3.rs/main/python-typing-hints.html · https://www.nandann.com/blog/rust-pyo3-python-extensions-guide · https://github.com/PyO3/maturin/discussions/2486 · https://github.com/PyO3/maturin/issues/3090
- ABI — https://peps.python.org/pep-0803/ · https://pyo3.rs/v0.29.0/free-threading · https://pyo3.rs/main/building-and-distribution · https://pyo3.rs/main/features
- Maturin layout — https://www.maturin.rs/project_layout.html · https://github.com/PyO3/maturin/pull/1608 · https://medium.com/@MatthieuL49/a-mixed-rust-python-project-24491e2af424
- Polars — https://deepwiki.com/pola-rs/polars/1.3-installation-and-runtime-selection · https://pypi.org/project/polars/
- Exceptions — https://github.com/PyO3/pyo3/blob/main/guide/src/exception.md · https://docs.rs/pyo3/latest/pyo3/macro.create_exception.html · https://github.com/PyO3/pyo3/issues/3452
