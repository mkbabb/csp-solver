# T3-W0 — Anchor

**Opens the tranche as a thin anchor: reconfirm the authoring base, then carry the banked evidence forward.** The audit skeleton filed a full baseline+census wave here; pass-3 executed both halves, so W0 collapses to one SHA/tree reconfirmation plus the evidence hand-off. Everything the audit T3-W0 named (the three-suite baseline, the byte re-measure, the npm-tarball inspection, the morph census, the paired bbnf arms, the criterion `pre-t3` baselines) is **DONE** — recorded below as pre-satisfied gates with their artifact paths. The RES-2 in-wave re-run *stubs* are not W0's to run; each downstream wave executes its own at its own merged HEAD.

**Dependencies**: none. **Effort**: S.

---

## Scope

### The one live action — SHA/tree reconfirmation

Two pass-3 stamps disagree on the working state and must be reconciled before authoring executes against a moving tree:

- **G6 stamped base `3b75eca2595de26d5e60718f31bf46bc5ebfe25a`** (master), working tree **CLEAN** (`git status --short` = 0 lines) — the session-start gitStatus snapshot was stale (G6 §Base commit).
- **G7/G10 stamped `5f9980c8`+dirty** (later HEAD, live dev-server captures).

**Action:** one `git status && git log -1` at wave start. Stamp the authoring base SHA. If HEAD has advanced past `3b75eca2`, the RES-2 integers (merge bar, byte figures, bbnf arms) are worktree-local to `3b75eca2` and re-run in their owning waves — the mechanics carry, only the SHA/integers refresh (P2-RES-2).

### Evidence dir — opened under the G2 policy, from day one

Open `docs/tranches/2026-07-tranche-3/evidence/` under the A24-G2 record-hygiene policy (LFS or prune-to-load-bearing; the tranche-II corpus was 47 MB / 287 files / 115 PNGs — do not repeat). Carry the banked pass-3 artifacts:

- `pass3/g6/` — `rust-test.log` (151/0/6), `pytest.log` (27/2, fresh cp313 wheel), `e2e-3210.log` (33/33), `gac_timing_probe.log`, `criterion3.log`, and `target/criterion/*/pre-t3/` baselines.
- `pass3/g7-harness` + `g7-shots`, `pass3/g10-harness` + `g10-shots`, `pass3/fuzz.mjs` (G8's 33-case decoder fuzz), `pass3/a23-harness`, `pass3/f4-harness`.
- The G5 morph-census record (morph HEAD `b1192863`, lockfile `hungarian`-count 0).

## Pre-satisfied gates (executed in pass-3; recorded here, not re-run in W0)

| Gate | Value | Artifact |
|---|---|---|
| Baseline three-suite | rust **151/0/6** (18 harnesses), py **27/2** (fresh wheel), e2e **33/33** — all exit 0 at `3b75eca2` | G6 §The three suites; `pass3/g6/{rust-test,pytest,e2e-3210}.log` |
| Byte re-measure | lean wasm **90,602 B**, `pkg/` source == `dist/` (no build-path drift); full-module 222,436→198,652 B (−10.69%), `Cargo.lock` unchanged | P2-L1 §4, G6 §Byte anchors |
| npm-tarball census | published `@mkbabb/csp-solver-wasm@0.2.0` is **FULL** (7 isomorphic exports in the d.ts); excision is **BREAKING**; 0.4.0 stanza drafted | P2-L1 §1–2 |
| morph census | **CLEAN** — one `assignment()` call site, group-full, never reaches `hungarian::minimize`; lockfile `hungarian`-count 0; pin `csp-solver = "0.2"` | G5 (see R-5) |
| bbnf paired arms | both green, nil differential (baseline `3b75eca2`, treatment `be044e41`), 4/4 compile stages, lattice 16/16 | P2-L2 §2 (see R-6) |
| criterion `pre-t3` | banked under `target/criterion/*/pre-t3/` (named bench targets; `--workspace -- --save-baseline` **fails**, forwarded to the lib libtest harness) | G6 §Criterion |

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W0):

| Gate | Value |
|---|---|
| Anchor | base SHA stamped; evidence dir opened under the G2 policy |

## Seeds

- [`pass3/G6-baseline-run.md`](../evidence/pass3/G6-baseline-run.md) — the three-suite run, SHA-stamped counts, the five downstream findings, the `pre-t3` baseline procedure.
- [`pass3/G5-morph-census.md`](../evidence/pass3/G5-morph-census.md) — the CLEAN verdict, two independent walls.
- `pass2/P2-L1.md` (npm tarball + byte re-measure), `pass2/P2-L2.md` (bbnf paired arms).
- The reconciliation R-6 (W0-collapse rationale) and R-1..R-12 (banked-evidence provenance).

## Residual risks

- The base SHA is the only thing W0 fixes; if HEAD moves during authoring, RES-2 re-runs are the safety net — but they live in W3/W4/W5, not here. W0 must not become a second baseline lane.
- Session-scoped scratchpad: the pass-1/pass-2 corpus at `.../scratchpad/tranche3/` will not survive cleanup. The load-bearing conclusions are folded into the reconciliation and this tranche's `evidence/`; the evidence dir opened here is the durable home.
