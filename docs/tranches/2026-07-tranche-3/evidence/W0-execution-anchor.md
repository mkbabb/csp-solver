# T3-W0 — execution anchor stamp

**Execution base: `0c044ef6`** (docs(tranche-3): ratification round 2), stamped 2026-07-10, Apple M5 Max.

- `git status --short` → **clean** (0 lines). The G6-vs-G7 stamp discrepancy the wave names is resolved: G6's "clean at `3b75eca2`" was correct; G7/G10's `5f9980c8`+dirty stamps were mid-campaign captures, superseded.
- `git diff --stat 3b75eca2..0c044ef6` → **128 files, 15,562 insertions, ALL under `docs/tranches/2026-07-tranche-3/`** — the delta between the G6 baseline SHA and the execution base is docs-only. The code tree is byte-identical to `3b75eca2`, so the G6 baseline (rust **151/0/6** across 18 harnesses · tests-py **27/2** · e2e **33/33** · lean wasm **90,602 B** source==dist) carries to this base without re-run — the RES-2 best case: no integer refresh owed until a wave itself moves code.
- Evidence dir: **111 files, 1.9 MB**, opened under the A24-G2 policy at authoring (`evidence/PATHS.md` carries the pruning ledger). Pre-satisfied.
- The six pre-satisfied gates (baseline three-suite, byte re-measure, npm-tarball census, morph census, bbnf paired arms, criterion `pre-t3`) stand as recorded in the wave file with their artifact paths.

| Gate (verbatim) | Result |
|---|---|
| base SHA stamped; evidence dir opened under the G2 policy | **PASS** — this file is the stamp; evidence/ verified 111 files / 1.9 MB |
