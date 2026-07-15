# T4-W14 — Lane V, the enforcement pass (consolidated gate ledger)

Verdict: **RED**. Two defects survive at gate SHA `826f16e3` (master, 2026-07-15).
Every other probe is green. I trusted no lane; the census + three D-records were
claims, re-run verbatim below. Fable register readthrough clean.

---

## VERDICT: RED — two defects, both fixable in-remit before seal

### RED-1 — confident-but-wrong byte stamp (truth trace)

`README.md:58` states the embedded bank is **32,533 B**; the measured value is
**32,095 B** and the sibling doc `csp-solver/README.md:192` already carries the
correct 32,095 B. Two shipped docs disagree on one fact, and the root README
carries the stale pre-restamp figure ("32,533 B / N=4 sparse", named stale by the
census §4 and D2).

- Probe: `find csp-solver/data/sudoku_puzzles -type f -exec cat {} + | wc -c` → **32095** (45 files).
- This is exactly the defect class the wave charter names ("a confident-but-wrong
  stamp is THE defect this wave kills"). D1's record (`d1-record.md:31`) says it
  "kept" 32,533 B while D2 restamped to 32,095 B — the inconsistency shipped.
- Remediation: `README.md:58` 32,533 B → **32,095 B** (match `csp-solver/README.md:192`).

### RED-2 — the wave's own new file reds the CI prettier gate (behavior/gate drift)

`web/frontend/src/assets/fonts/LICENSES.md` (added by the OFL lane, D3) fails
`prettier --check src/`, which IS `npm run lint` — the **final step of the CI
`frontend` lane** (`.github/workflows/ci.yml`, "prettier (repo-pinned format
check)"). The wave introduced a file under `src/` that breaks the format gate.

- Probe: `cd web/frontend && npm run lint` → `[warn] src/assets/fonts/LICENSES.md` / "Code style issues found" (non-zero).
- The three `OFL-*.txt` and the `.woff2` are skipped (prettier infers no parser and
  the directory glob passes over them); only the `.md` is caught.
- Remediation: `cd web/frontend && npx prettier --write src/assets/fonts/LICENSES.md`
  (pure formatting, no content change). Content itself is register-clean and accurate.

---

## Probe ledger (all others GREEN)

| Gate | Probe | Result |
|---|---|---|
| meta-leak zero | §Probes P2 grep across README/docs/*.md/csp-solver README+CHANGELOG/wasm README+CHANGELOG/.pyi + pencil-boil README+CHANGELOG | **ZERO** (PASS) |
| correctio | `not (merely\|just\|only)` across shipped docs | **empty** (PASS) |
| copula | `acts as\|serves as\|stands as\|boasts` | **empty** (PASS) |
| banned words | delve/tapestry/testament/robust/… across shipped docs | **empty** (PASS) |
| em-dash README | `grep -o '—' \| wc -l` | **0** ≤ 12 (PASS) |
| em-dash csp-solver/README | same | **11** ≤ 20 (PASS; the 11 are the exempted API-list separators) |
| em-dash animation | same | **1** ≤ 8 (PASS) |
| em-dash benchmarks | same | **2** (both verbatim `gac_ab_corpus` stdout in a fence) (PASS) |
| em-dash wasm/README | same | **0** (PASS) |
| em-dash pencil-boil CHANGELOG | per-paragraph density | **≤ 2/para** every paragraph (PASS) |
| version 0.7.0 stale | `grep -n '0\.7\.0' docs/animation.md README.md` | **empty** (PASS) |
| crate version | crates.io sparse index re-query | **0.5.0 published** (versions 0.1.0–0.5.0), README:125 matches (PASS) |
| wasm npm version | `registry.npmjs.org/@mkbabb/csp-solver-wasm` re-query | **0.2.0** latest; README:126 states the source/registry split honestly (PASS) |
| pencil-boil version | `registry.npmjs.org/@mkbabb/pencil-boil` re-query | **0.9.2**; README:127 `^0.9.2` (PASS) |
| Nintendo (shipped docs) | `grep -rniE 'yoshi\|nintendo' README.md docs/*.md` | **ZERO** (PASS) |
| Nintendo (web/frontend/src) | same | 11 hits, **all `YOSHI_COLORS` symbol** (deferred rename, census §7.1 / D-lane flags — NOT a lane-V RED; branded prose is zero) |
| Rust triple | `cargo test --workspace` (I ran it) | **208 passed / 0 failed / 0 ignored**, 26 binaries + 4 doctests; README:90 matches (PASS) |
| unit | `npm run test:unit` (I ran it) | **307 passed / 29 files** (PASS) |
| e2e count | `grep -rEho '^\s*test(' e2e/*.spec.ts \| wc -l` ; `ls e2e/*.spec.ts \| wc -l` | **82 / 13**; README:96 matches (PASS) |
| CI lanes | job keys in ci.yml | **11** (lint,rust,py-compile,py-runtime,wasm,build-lean-wasm,twiggy,frontend,e2e,iai,cargo-audit); README:109 "eleven" (PASS) |
| tests/ dir | `ls csp-solver/tests/*.rs \| wc -l` | **22**; README:20 "22 files" (PASS) |
| lean wasm bytes | `wc -c csp-solver/wasm/pkg/…_bg.wasm` ; dist asset | **121,855 B**, dist byte-identical; consistent across README/benchmarks/wasm README+CHANGELOG (PASS) |
| lean band story | 121,855 B measured / 124,500 B analytic ceiling / 127,500 B CI gate / 93 KB = two-game band | consistent everywhere (PASS) |
| OFL | 3 `OFL-*.txt` verbatim (copyright lines intact) + `LICENSES.md` manifest beside the 3 woff2 | present (PASS content; see RED-2 for the format gate) |
| CONTRIBUTING | inline flow at README:151, no dangling `./CONTRIBUTING.md` link, `D CONTRIBUTING.md` deletion stands | resolved (PASS) |
| declarations | browser matrix / en-only / no-telemetry at README:115-119 | all three present (PASS) |
| ?board= split | source: sudoku+futoshiki own `?board=`; thermo/killer/kenken localStorage-only v1 | README:62 states it correctly (PASS) |
| behavior drift | `git diff --stat` + per-file diff | docs/CHANGELOGs/.pyi/licenses + 4 **comment-only** source files; `_headers` policy lines byte-identical (PASS) |
| frontend battery | vue-tsc --noEmit / lint:eslint / lint:knip / test:unit / build | all exit 0 **except `npm run lint` (prettier)** → RED-2 |
| cargo | `cargo test --workspace` | exit 0, 208/0/0, zero warnings (PASS) |

---

## Team-lead outstanding (surfaced by the census + D-lanes, ledgered, not lane-V REDs)

1. **`YOSHI_COLORS` symbol rename deferred** (census §7.1 rec. c). Branded *prose*
   is at zero across docs + source comments; the exported const `YOSHI_COLORS`
   (`pencilConfig.ts:17`, imported in 4 files) keeps its name — a cross-file
   source-symbol change outside this docs/comments wave. The `web/frontend/src`
   Nintendo gate cannot reach literal zero until it rides a source lane.
2. **Version-discipline divergence** (D2 flag #1). crates.io `0.5.0` published at
   the WM seal, *before* W11/W13 landed the five-family surface; the published
   0.5.0 tarball does not contain those five families. The docs are careful not to
   claim otherwise (they describe HEAD source; registry lines stay factual). Clean
   fix is a 0.6.0 bump + five-family CHANGELOG row — a source/release change out of
   this wave.
3. **Full-module wasm figure OPEN** (census §3). 222,436 B is a stale two-game
   figure; `benchmarks.md` states it as not re-measured this pass (CI bounds it fail
   >240 KB). Lean 121,855 B is authoritative.
4. **CONTRIBUTING deletion** — the team lead commits the staged `D CONTRIBUTING.md`
   at seal (ruling #1); this wave left it uncommitted by design.
5. **tests-py 27/0 not re-run** (needs a maturin wheel build); kept on the static
   parametrize count + census corroboration. The Rust triple WAS run (208/0/0).

## Method note

No tree modified by lane V (enforcement adjudicates, D-lanes rewrite, team lead
seals). Registries re-queried independently (crates.io via sparse index; npm via
registry.npmjs.org). `cargo test --workspace` and the full frontend battery run
once each at this HEAD. Both REDs are trivial, in-remit, no-behavior fixes to be
applied by the owning lane / team lead before seal.
