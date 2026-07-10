# T2-W1 Lane C — Currency Ledger

Commit context: `7c245bed` (working tree — Lane R/P/F edits present, uncommitted at
lane-C time; orchestrator commits the wave after gates pass). Machine: macOS 26.4.1,
Darwin 25.4.0, arm64 (Apple Silicon). Stamped 2026-07-10.

Toolchain versions at measurement: `rustc 1.97.0 (2d8144b78 2026-07-07)`,
`cargo 1.97.0 (c980f4866 2026-06-30)`, `node v26.0.0`, `npm 11.12.1`,
`uv 0.7.15 (4ed9c5791 2025-06-25)`, `python 3.14.5` (host interpreter; CI pins 3.13
— see `.github/workflows/ci.yml` py-compile/py-runtime lanes).

Every number below traces to the quoted command that produced it, re-run in this
tree by Lane C.

## (a) Rust — `cargo outdated`, workspace

```
$ cargo +stable outdated --workspace
All dependencies are up to date, yay!

$ cargo +stable outdated --workspace --root-deps-only
All dependencies are up to date, yay!
```

Green. Traces to Lane R's own `cargo +stable outdated --root-deps-only --exit-code 1`
re-run (`T2-W1-laneR-rust-toolchain.md`), which found only `pyo3 0.24.2 -> 0.29.0`
outstanding (plus pyo3-only transitives: `pyo3-build-config`, `pyo3-ffi`,
`pyo3-macros`, `pyo3-macros-backend`, and the removed-upstream `indoc` /
`memoffset` / `unindent` / `target-lexicon` / `autocfg` / `once_cell` shims). Lane P
landed the 0.24.2 -> 0.29.0 bump; re-running `cargo outdated` against the current
tree (pyo3 now hoisted to `[workspace.dependencies]` at `0.29`) confirms zero
outstanding entries workspace-wide.

## (b) Frontend — `npm outdated`, `web/frontend`

```
$ cd web/frontend && npm outdated
Package     Current  Wanted  Latest  Location                 Depended by
typescript    6.0.3   6.0.3   7.0.2  node_modules/typescript  frontend
```

One entry, justified-hold: TypeScript 7.0.2 is deliberately deferred per Lane F's
own note (`T2-W1-laneF-frontend-currency.md`) — `vue-tsc` bumped 2.2 → 3.3.7 lands
TS-6 support only; TS 7 support is a distinct, not-yet-landed `vue-tsc` bump. All
other frontend deps (vite 8.1.4, @vitejs/plugin-vue 6.0.7, tailwindcss 4.3.2,
playwright 1.61.1, vue 3.5.39, @vueuse/core 14, typescript 6.0.3) are current at
their `Wanted == Latest` ceiling.

## (c) Python — `csp-solver/pyproject.toml` + `web/api`, under uv

`csp-solver/pyproject.toml` carries no runtime Python deps (`build-system.requires
= ["maturin>=1.0,<2.0"]` only — current, no ceiling). `web/api`:

```
$ cd web/api && uv lock --check
Resolved 41 packages in 7ms

$ uv pip list --outdated
Package           Version   Latest    Type
----------------- --------- --------- -----
anyio             4.12.1    4.14.1    wheel
certifi           2026.2.25 2026.6.17 wheel
click             8.3.1     8.4.2     wheel
fastapi           0.133.1   0.139.0   wheel
httptools         0.7.1     0.8.0     wheel
idna              3.11      3.18      wheel
librt             0.8.1     0.13.0    wheel
mypy              1.19.1    2.2.0     wheel
packaging         26.0      26.2      wheel
pathspec          1.0.4     1.1.1     wheel
pydantic          2.12.5    2.13.4    wheel
pydantic-core     2.41.5    2.47.0    wheel
pygments          2.19.2    2.20.0    wheel
pytest            9.0.2     9.1.1     wheel
pytest-asyncio    1.3.0     1.4.0     wheel
python-dotenv     1.2.1     1.2.2     wheel
ruff              0.15.4    0.15.21   wheel
slowapi           0.1.9     0.1.10    wheel
starlette         0.52.1    1.3.1     wheel
typing-extensions 4.15.0    4.16.0    wheel
uvicorn           0.41.0    0.51.0    wheel
watchfiles        1.1.1     1.2.0     wheel
wrapt             2.1.1     2.2.2     wheel
```

Lockfile resolves clean (`uv lock --check` green — no drift between
`pyproject.toml`/`dependency-groups` and `uv.lock`). 23 packages sit behind
latest. Justified-hold, whole-file: T2-W1's landed tracks this wave are Rust
toolchain (Lane R), pyo3 (Lane P), and frontend (Lane F) — `web/api` was untouched
by any track. Per the binding tranche-2 override (conditional python-server
abrogation — the FastAPI+docker stack's disposition is decided at W2, py bindings
are kept regardless), bumping `web/api`'s 23 packages now would be work redone or
discarded depending on that W2 call. `starlette` 0.52.1 → 1.3.1 in particular is a
major-version jump coupled to `fastapi`/`uvicorn` compatibility (fastapi 0.139.0 is
the version that requires starlette's 1.x line) — not a safe isolated patch, it's a
three-package coordinated bump that belongs with whatever W2 decides for the stack,
not fragmented into this wave. The other 22 are ordinary trailing-latest drift, not
p0 security items in themselves (see the dependabot mapping below for the ones that
are).

## (d) Dependabot triage — `gh api repos/mkbabb/csp-solver/dependabot/alerts --paginate`

```
$ gh api repos/mkbabb/csp-solver/dependabot/alerts --paginate --jq \
    '.[] | select(.state=="open") | [.number, .security_advisory.severity, .dependency.package.ecosystem, .dependency.package.name, .dependency.manifest_path, .security_vulnerability.first_patched_version.identifier] | @tsv'
```

returns 21 open alerts (8 high, 11 moderate, 2 low), matching the wave brief
exactly. (One further alert, #61 `brace-expansion`, is `auto_dismissed` — GitHub
closed it itself once the transitive resolved past the patched line; not counted
in the 21.) Full triage:

### fixed-by-this-wave — npm (8 alerts, Lane F's vite/postcss chain)

| # | severity | package | patched-at | now (verified in this tree) |
|---|---|---|---|---|
| 67 | moderate | vite | 6.4.3 | 8.1.4 |
| 66 | high | vite | 6.4.3 | 8.1.4 |
| 65 | moderate | postcss | 8.5.10 | 8.5.16 |
| 64 | moderate | vite | 6.4.2 | 8.1.4 |
| 63 | high | vite | 6.4.2 | 8.1.4 |
| 62 | high | defu | 6.1.5 | **removed** — Lane F's vite 8.1.4/vitest chain bump dropped `defu` from the dependency graph entirely (`node -e "require('./package-lock.json')…"` finds no `defu` entry) |
| 60 | moderate | picomatch | 4.0.4 | 4.0.5 |
| 59 | high | picomatch | 4.0.4 | 4.0.5 |

Verified against `web/frontend/package-lock.json` and installed `node_modules/*/package.json`
directly (`node -p "require('./node_modules/<pkg>/package.json').version"`), not
just `npm outdated`. All 8 resolve once GitHub rescans the pushed lockfile.

### fixed-by-this-wave — rust/pyo3 (4 alerts, Lane P)

| # | severity | package | patched-at | now |
|---|---|---|---|---|
| 49 | moderate | pyo3 | 0.29.0 | 0.29.0 (`csp-solver/Cargo.toml` + `Cargo.lock`, GHSA-chgr-c6px-7xpp) |
| 48 | high | pyo3 | 0.29.0 | 0.29.0 (GHSA-36hh-v3qg-5jq4) |
| 47 | moderate | pyo3 | 0.29.0 | 0.29.0 (`Cargo.lock` copy of #49) |
| 46 | high | pyo3 | 0.29.0 | 0.29.0 (`Cargo.lock` copy of #48) |

Lane P's 0.24.2 → 0.29.0 bump lands exactly at the patched floor for both
advisories (missing-`Sync`-bound `PyCFunction::new_closure` closures and the
`BoundTupleIterator::nth_back` OOB read — both named in the 0.29 changelog). Alert
pairs (49/47, 48/46) are the same advisory reported once against the manifest path
and once against the lockfile path; both close on the same bump.

### justified-hold — pip / web-api (9 alerts, stack untouched this wave)

| # | severity | package | patched-at | current | note |
|---|---|---|---|---|---|
| 58 | high | starlette | 1.3.1 | 0.52.1 | major-version bump, coupled to fastapi/uvicorn — see (c) |
| 57 | low | Starlette | 1.3.0 | 0.52.1 | same starlette bump as #58 |
| 56 | high | starlette | 1.1.0 | 0.52.1 | same |
| 55 | moderate | starlette | 1.1.0 | 0.52.1 | same |
| 54 | moderate | starlette | 1.0.1 | 0.52.1 | same |
| 53 | moderate | idna | 3.15 | 3.11 | trivial patch, travels with the coordinated web/api pass below |
| 52 | moderate | python-dotenv | 1.2.2 | 1.2.1 | trivial patch, ditto |
| 51 | moderate | pytest | 9.0.3 | 9.0.2 | trivial patch, ditto |
| 50 | low | Pygments | 2.20.0 | 2.19.2 | trivial patch, ditto |

All 9 confined to `web/api/uv.lock`, a stack this wave's three landed tracks
(Rust/PyO3/Frontend) never touch. Per the binding conditional-abrogation override,
`web/api`'s FastAPI+docker disposition is a W2 decision; bumping now risks doing
work that's discarded (if abrogated) or redone (if the surface changes shape).
`idna`/`python-dotenv`/`pytest`/`Pygments` are safe isolated patches with no coupled
semver risk — kept together with the starlette/fastapi/uvicorn coordinated bump
rather than fragmented, so the whole stack moves in one W2-scoped pass instead of
partial currency now and a second partial pass later.

## Totals

- Rust workspace: 0 outstanding (`cargo outdated` green).
- Frontend: 1 outstanding, justified-hold (TS 7 deferred, matches Lane F's own note).
- Python (web/api): 23 outstanding via `uv pip list --outdated`; 9 of those also
  carry open Dependabot advisories, all justified-hold (untouched-stack + W2
  abrogation binding).
- Dependabot: 21 open alerts total — 12 fixed-by-this-wave (8 npm + 4 rust/pyo3),
  9 justified-hold (all pip/web-api). 8 high / 11 moderate / 2 low accounted for
  in full; 0 unclassified.
