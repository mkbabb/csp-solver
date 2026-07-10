# Pass-3 · Q3 — W1/W2 wave-ordering hazard: PyO3 0.29 + dist-info rename vs the W2 py-runtime retarget

**Lane**: Pass-3 critique fleet, question 3 of 10 (synthesis-pass1.md §6, dispatch list).
**Repo**: `CSC411_HW2_ProgrammingQuestion`, HEAD `8913023e`, read-only (worked in a throwaway `git worktree`, removed after use — `git worktree list` confirms it's gone; nothing under version control touched).

## Answer

**No collision, in either direction.** The CI lane that installs the wheel (`ci.yml` `py-runtime`, and — until W2 deletes it — `web/api/Dockerfile`) resolves the artifact with an unqualified `*.whl` glob, not a literal filename, so it is completely insulated from the dist-info rename regardless of which wave the rename lands in. The only literal reference to the old name (`sudoku_rs`) anywhere outside `csp-solver/pyproject.toml` itself is a prose command example in `web/api/CLAUDE.md:93`, and that file is deleted wholesale by W2 — so the "hazard" self-heals one wave later no matter what.

**The dist-info rename should ride W1, exactly as authored.** It shares a file (`csp-solver/pyproject.toml`) and a verification gate ("wheel functionally consistent, 108/2 green") with the PyO3 bump and `strip=true`, and L13's own audit already exercised all three together (bump + strip; rename wasn't in that exact build but touches a disjoint TOML key with zero interaction). Riding it into W2 instead would add unrelated cosmetic-metadata churn to the tranche's single highest-execution-risk wave (synthesis §4: "~2 pts — W2 execution risk... exactly where a missed grep bites") for zero benefit — it doesn't need `web/api`'s death to be safe, and nothing in the REHOMED wheel-contract tests references the dist-info name at all (verified below).

## Evidence

### 1. Repo-wide literal-reference sweep — only 4 hits, 2 of them archival

```
$ grep -rln "sudoku_rs\|sudoku-rs" . --exclude-dir=node_modules --exclude-dir=dist \
    --exclude-dir=target --exclude-dir=.git | grep -v scratchpad
web/api/CLAUDE.md                                                  # prose, dies in W2
docs/tranches/2026-07-grand-uplift/evidence/synthesis-pass1.md     # frozen archive record
docs/tranches/2026-07-grand-uplift/evidence/constraint-trait-bound-spike.md  # frozen archive
csp-solver/pyproject.toml                                          # the rename target itself
```

Nothing executable (no `.yml`, `.sh`, `.py`, `Dockerfile`) hardcodes the old name. `web/api/uv.lock` has **zero** hits for `sudoku-rs`/`csp_solver` — confirmed independently of L04's claim that the wheel is installed out-of-band (`uv pip install`, not a declared `[project.dependencies]` entry), so there is no lockfile pin that the version bump `0.1.0→0.2.0` could invalidate.

### 2. The two install sites are wildcard-glob, filename-agnostic

```
ci.yml:192:   working-directory: web/api
              run: uv pip install ../../target/wheels/*.whl

web/api/Dockerfile:60,89:
              COPY --from=rust-builder /build/wheels/*.whl /tmp/wheels/
              RUN uv pip install --python .venv/bin/python /tmp/wheels/*.whl && rm -rf /tmp/wheels
```

Both use an unqualified `*.whl` glob. (The Dockerfile is moot for this question anyway — it's excised wholesale in W2 per the abrogation manifest — but it was checked to rule out a Docker-side hazard in the W1-before-W2 window too.)

### 3. Live-rebuilt the renamed wheel and proved the glob resolves under both wave orderings

In a scratch worktree (`wt-q3`, removed after use), edited `csp-solver/pyproject.toml` exactly as W1 specifies (`name = "sudoku-rs"` → `"csp_solver"`, `version = "0.1.0"` → `"0.2.0"`) and ran `maturin build --manifest-path csp-solver/Cargo.toml --interpreter python3.13 --out target/wheels`:

```
📦 Built wheel for CPython 3.13 to target/wheels/csp_solver-0.2.0-cp313-cp313-macosx_11_0_arm64.whl
```

Then simulated both CI shapes against the one artifact:

```
-- AS-AUTHORED intermediate state: W1 landed, W2 not yet (working-directory: web/api) --
$ (cd web/api && ls ../../target/wheels/*.whl)
../../target/wheels/csp_solver-0.2.0-cp313-cp313-macosx_11_0_arm64.whl

-- POST-W2 retargeted state (working-directory: csp-solver, one level shallower) --
$ (cd csp-solver && ls ../target/wheels/*.whl)
../target/wheels/csp_solver-0.2.0-cp313-cp313-macosx_11_0_arm64.whl
```

Both resolve cleanly. This also empirically corroborates the synthesis's own W2 line item — "retarget ci.yml py-runtime (working-directory + **wheel-relative path**)" — the relative path genuinely must shrink from `../../` to `../` when `working-directory` moves from `web/api` (2 levels deep) to `csp-solver` (1 level deep); W2's text already accounts for this, it isn't a gap this question surfaces.

### 4. PyO3 0.29 itself forces no CI python-version-pin change (rules out a second collision axis)

Checked whether the version bump forces any edit to the `python-version: '3.13'` pin shared by both `py-compile` and `py-runtime` — if it did, that edit would *also* need placing relative to W1/W2. L13 (`pass1/13-py-modernity.md` §1–2) built and ran the 0.29 wheel end-to-end: `pytest tests/` → **108 passed, 2 skipped**, the exact headline count, unchanged. §2 confirms PyO3 0.25+ *adds* 3.14 support without dropping 3.13 — the CI pin stays valid either way, and the `PYO3_USE_ABI3_FORWARD_COMPATIBILITY` env-var wart it excises is already CI-irrelevant (`grep` for it across every `.sh`/`.yml`/`Dockerfile` returns zero hits — it lives only in `csp-solver/CLAUDE.md` prose, line 181). No forced pin edit, no second collision axis.

### 5. Reverse-direction check — do the REHOMED wheel-contract tests (W2) reference the dist-info name?

```
$ grep -n "sudoku-rs\|sudoku_rs\|importlib.metadata\|pkg_resources\|__version__\|distribution(" \
    web/api/tests/test_wheel_contracts.py web/api/tests/test_rust_backend.py \
    web/api/tests/test_bench_compare.py web/api/tests/test_panic_contract.py
(no output — zero hits)
```

None of the 4 files W2 moves to `csp-solver/tests-py/` inspect the wheel's own dist-info/project name — they only `import csp_solver` (the module name, untouched by the rename). So the ordering is symmetric-safe: it would also be harmless (just less well-motivated, per §6 below) if the rename rode W2 instead.

### 6. `py-compile` lane is untouched by any of this

`py-compile` (`ci.yml:111-136`) is `cargo check -p csp-solver --features py` — no `maturin build`, no wheel, no `pyproject.toml [project]` table read at all. Zero interaction with the rename in either ordering.

## Trace: W1-rename-then-W2-retarget (as authored) vs. the counterfactual W2-rename

| | **A — rename rides W1 (authored)** | **B — rename rides W2 (counterfactual)** |
|---|---|---|
| End of W1 | `pyproject.toml`: `csp_solver`/`0.2.0`, `strip=true`, pyo3 0.29. Built wheel: `csp_solver-0.2.0-*.whl`. `ci.yml` still `working-directory: web/api`, glob install — **green**, filename-agnostic. `web/api/CLAUDE.md:93`'s example (`sudoku_rs-*.whl`) goes stale — prose only, nothing executes it. | `pyproject.toml`: still `sudoku-rs`/`0.1.0`, `strip=true` + pyo3 0.29 land. Wheel: `sudoku_rs-0.1.0-*.whl`. CI identically green (glob). No doc staleness yet. |
| End of W2 | `web/api/` excised (CLAUDE.md dies, staleness moot). CI retargeted to `working-directory: csp-solver`, path fixed to `../target/wheels/*.whl`. Wheel already named `csp_solver-0.2.0-*` — zero extra edit needed. | Same excision + retarget, **plus** the dist-info rename now lands in the same commit/PR as the whole-package deletion and CI rewrite — the tranche's single highest-risk wave (synthesis §4) absorbs an unrelated cosmetic-metadata edit for no functional reason. |
| Net functional risk | None. | None (same glob insulation) — but strictly worse for review isolation/bisectability: if W2 needs a partial revert, the cosmetic rename has no reason to be entangled with it. |

Both orderings are **functionally safe** — the only real difference is process hygiene, and it favors A (as authored): the rename is naturally co-verified with the other `csp-solver/pyproject.toml` edits in W1 (same gate: wheel rebuild + 108/2 green), and keeping it out of W2 keeps that wave's diff to exactly what it's already the riskiest for — the excision itself.

## Wave-spec amendment

**No amendment — holds as authored.** T2-W1's line `wheel dist-info rename sudoku_rs-0.1.0→csp_solver-0.2.0` stays in W1, unconditioned on W2.

One optional, non-blocking nit surfaced in passing (not a correctness issue, not gating): `csp-solver/CLAUDE.md:181-182` still prescribes `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop ...`, which L13 §2 shows becomes unnecessary the moment pyo3 ≥0.25 lands (i.e., the instant W1's bump lands). Since W1 is already touching the PyO3 surface and this file survives past W2 (folds into a README in W7, unlike `web/api/CLAUDE.md`), it would be tidy — but is not required — to drop that env-var prefix in the same W1 pass rather than let it sit stale until W7's doc fold. Flagging for whoever executes W1; does not change the wave boundary itself.

## Deviations from a pure "trust the corpus" pass

- Did not merely cite L13/verify-13's byte-count table — rebuilt the wheel myself from a fresh worktree with the exact rename applied, to directly observe the resulting `.whl` filename and glob resolution rather than infer it.
- Cross-checked the reverse direction (do the W2-rehomed tests depend on the pre-rename name) since the question's framing ("collide... landing one wave later") implied a two-way risk, not just forward risk.
- Excluded `docs/tranches/2026-07-grand-uplift/` hits from the "live reference" count — that's a separate, already-closed tranche's frozen evidence archive, not a live config surface; noted rather than silently dropped.
