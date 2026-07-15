# T4-W14 lane D1 record — root README + docs/*.md

Estate (exclusive, all touched, nothing else): `README.md`, `docs/algorithms.md`,
`docs/animation.md`, `docs/benchmarks.md`, `docs/bbnf-integration.md`,
`docs/optimizations.md`, `docs/sudoku.md`. Work order = `evidence/w14/c-census.md`
(supersedes the spec's anchors) + the spec's per-doc contract. No source behavior
touched; docs only. Not committed (team lead seals).

## Verified figures (RUN- or query-confirmed this pass, at HEAD `826f16e3`, 2026-07-15)

| Figure | Value | How confirmed |
|---|---|---|
| Rust triple | **208 passed, 0 failed, 0 ignored** (26 test binaries + 4 doctests) | RAN `cargo test --workspace`; summed all 28 `test result:` lines (204 across 26 binaries + 4 doctests). The old "6 ignored" is now 0 — the six `#[ignore]`d hard-9×9 stress tests were deleted (`csp-solver/tests/solver.rs:1327` comment confirms) |
| tests-py | **27 passed, 0 skipped** | Independently expanded the parametrize decorators: 12 singleton `def test_` + `test_generate_and_solve`(2) + `test_excised_tiers_reject`(3) + `test_hard_9x9`(5) + `test_solve_under_50ms`(5) = 27. Each `HARD_PUZZLES` holds 5 entries (confirmed both files) |
| e2e | **82 tests across 13 spec files** (77 default config; 4 visual-golden + 1 throttle testIgnore'd) | `grep -rEho '^\s*test\(' e2e/*.spec.ts \| wc -l` = 82; `ls e2e/*.spec.ts \| wc -l` = 13; `playwright.config.ts:11` testIgnore |
| lean wasm | **121,855 B** darwin (runner 124,091 B) | `wc -c csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm` = 121855; `dist/…csp_solver_wasm_bg-BECxa0-b.wasm` byte-identical; runner figure `ci.yml:464` |
| lean band | analytic ceiling **124,500 B**; CI gate **fail >127,500 B** | census §3; `ci.yml:444,465` |
| full module | **OPEN** — 222,436 B is a stale two-game figure, not re-measured; CI fail >240 KB / warn >230 KB | census §3; `ci.yml:427,430` |
| CI lanes | **eleven** | `ci.yml` job keys: lint, rust, py-compile, py-runtime, wasm, build-lean-wasm, twiggy, frontend, e2e, iai, cargo-audit |
| crate | source **0.5.0**, crates.io **0.5.0 published** (aligned) | census §1 confirmed by live `curl crates.io/api/v1/crates/csp-solver → max_version 0.5.0`. My own re-query was sandbox-blocked twice; the census's live-query confirmation is the contract (ruling #2) |
| wasm npm pkg | source **0.5.0**, npm **0.2.0** (SPLIT) | my own live `curl registry.npmjs.org/@mkbabb/csp-solver-wasm` → `['0.1.0','0.1.1','0.2.0']`, latest 0.2.0 |
| pencil-boil | pin **^0.9.2**, npm **0.9.2** (aligned) | my own live `curl registry.npmjs.org/@mkbabb/pencil-boil` → latest 0.9.2 |
| GAC headline | **12.6–12.7×** retained (12.58/12.73 @ `ede25188`) | census did not flag it changed; benchmarks keeps the committed-probe number |

## Per-file moves

### README.md (biggest rewrite; owner's "quite good, refined")
- **Opening (:3):** two-game → **five games** (Sudoku, Futoshiki, Thermo, Killer, KenKen); em-dashes rewritten out.
- **Directory tree:** `puzzles/` → five families; frontend `src/games/` → five dirs + `shared/`; `tests/` 14→**22 files**; docs list gains `animation`; all spaced-em tree glosses → colons/parens.
- **Architecture (:44):** 8-clause run-on split into sentences; GAC posture kept.
- **The five games:** new five-row table (one line each on what makes each a CSP, sourced from `csp-solver/src/puzzles/{thermo,killer,kenken}.rs` headers + `registry.ts`); carousel game-select prose; bank 45 boards / 32,533 B kept; live-deal + `max_solutions = 2` uniqueness for the four live games.
- **Frontend:** five game dirs; affordance list gains carousel select, undo spine (cap 200), named-technique hint, player marks (Snyder corner/center) vs peek-gated engine marks, error-check assists (off/on-demand/live), permalink split (Sudoku+Futoshiki `?board=`; Thermo/Killer/KenKen localStorage v1); fonts stated **under the SIL Open Font License** (licensing fact, no claim the OFL text ships — that's another lane); hint-grammar paragraph (technique engine sudoku+futoshiki named modules, other three solver-derived).
- **Testing:** stamp `measured at 826f16e3, Apple M5 Max, 2026-07-15`; Rust 171/0/6→**208/0/0 (26 binaries+4 doctests)**; py kept 27/0 (`deleted at W4` scrubbed); e2e 43/8→**82/13 (77 default)**.
- **CI:** relocated the byte-budget archaeology + per-lane recitation to `docs/benchmarks.md`; left an **eleven-lane** perimeter pointing there.
- **Deployment:** correctio "retired structurally, not mitigated" → "so there's no server-side solve path to secure."
- **Declarations (NEW section):** browser matrix (Chromium+Firefox; CI chromium-only; Safari known-broken), en-only, no-telemetry — sourced from `docs/precepts/declared-decisions.md`.
- **Published artifacts:** crate `0.3.0`→**0.5.0 (published)**; wasm row → **npm 0.2.0; source 0.5.0; file-linked lean build**; pencil-boil `^0.7.0`→**^0.9.2**.
- **Performance:** cut "not an inherited scratch harness" correctio; scrubbed "post-W4"/"pre-tranche"; kept 12.6–12.7× + disclosed minority cost; tightened.
- **Contributing:** INLINED the two-line flow ("Branch off master, add the change plus tests, open the PR; CI runs the same gates."), routed recipes to `csp-solver/README.md`, killed the `./CONTRIBUTING.md` dangling link (deletion stands, uncommitted).
- **Em-dash: 30 → 0** (≤12 target met; all thinned by sentence rewrite, none by blanket swap).

### docs/benchmarks.md (relocation destination)
- Scrubbed campaign framing + inlined `docs/tranches/**` paths at `:5,10,14,37,51,96` (kept plain `evidence/*.md` pointers, every number, every repro command).
- Correctio cuts: "verified sound, not merely fast" → "verified sound"; "(deeper than the retired figure implied)" cut.
- Rust triple restamped **208/0/0** @ 826f16e3; dropped the "grew from 151/0/6" tranche-III meta comment.
- **Wasm sizes** rewritten (relocated README byte-budget prose): lean **121,855 B darwin / 124,091 B runner**, analytic ceiling **124,500 B**, CI **fail >127,500 B**; old 93 KB named as the two-game ceiling; full module **OPEN** (222,436 B labeled stale, "do not quote as current", re-measure command given).
- **Em-dash: 10 → 2** (both remaining are verbatim `gac_ab_corpus` stdout inside a code fence — faithful reproduction, intentionally unchanged).

### docs/animation.md
- Pin `^0.7.0` → **^0.9.2** (:6).
- Meta-leak scrub: `(T3-W12 §6)` (:33), inlined `docs/tranches/…/W8-…` path (:46, kept `evidence/fe-composition.md §5`), "commit-stamped in the tranche evidence" (:70).
- Correctio cuts: "not an infinite wiggle swarm" (:52); "not left undocumented" + "not a stroke draw-in" (:127).
- Nintendo: `YOSHI_COLORS` gloss → **unbranded** "The color palette" (describes the config member by role; the code symbol rename is deferred — see flag below).
- On-idiom lilt at :19 preserved.
- **Em-dash: 15 → 1** (unspaced, on-idiom).

### docs/algorithms.md (KEEP, strongest doc)
- Meta-leak: "pre-tranche docs" → "earlier docs" (:47); process narration "the kernel wave closed" → "the kernel's soundness fix closed" (:14).
- Light `--` thinning on the one over-punctuated prose aside (Phase-2 residual-graph parenthetical → parens). Phase labels + genuine two-referent (:22 enqueued/not) left intact per spec.

### docs/bbnf-integration.md (KEEP, best domain-verbiage doc)
- Copula: "The solver **acts as** a dataflow fixpoint engine" → "**is** a dataflow fixpoint engine" (:16).
- Superlatives named: "the critical optimization" → "This span-parsing path is what keeps … allocation-free" (:54); "the single biggest codegen win" → "The 128-entry byte-dispatch table replaces that trial-and-error with one indexed jump" (:65).
- Thinned the one real `--verify` prose aside (the other `--` hits are literal CLI flag names, left intact).

### docs/optimizations.md (KEEP whole)
- Banned word: "cryptographically **robust**" → "cryptographically **strong**" (:60, the precise + idiomatic term).
- Thinned two prose asides (`Lambda`-excised → semicolon; profiling self-time → parens).

### docs/sudoku.md
- Meta-leak: "which the tranche landed" cut (:92) → sentence ends at "the kernel's AC-3 trail-push fix".
- Five-game truth: "The same engine drives **a second game**" (now false) → "drives four more games; Futoshiki is the closest sibling", plus a one-line Thermo/Killer/KenKen formulation pointer to the README table (minimal — the deep game-doc extension is a team-lead scope call, census flag #5).
- Fixed one spaced em-dash in prose (:88) → colon.

## Gate results (§Probes, scoped to estate)

| Gate | Result |
|---|---|
| P2 meta-leak (`tranche\|WGATE\|T[0-9]-W\|\bW[0-9]+\b\|campaign\|muster\|grand-uplift`) | **ZERO** across all 7 files |
| Nintendo/Yoshi (`grep -rniE 'yoshi\|nintendo' README.md docs/`) | **ZERO** |
| Correctio (`not (merely\|just\|only) `) | **none** |
| Copula (`acts as\|serves as\|stands as\|boasts`) | **none** |
| Em-dash budgets | README **0** (≤12), animation **1** (≤8), benchmarks **2** (both verbatim stdout) |
| Spaced em-dash in prose | **none** (the 2 in benchmarks are program stdout in a code fence) |
| Version truth (`0\.7\.0`) | **absent** everywhere in estate |
| Banned words | **none** (removed the lone "robust") |
| Stale two-game figures (86,746 / 90,602 / ≤93KB / 171 / 43 / 8 files / nine jobs / two games / 0.3.0) | **absent** (222,436 present in benchmarks only, labeled stale) |

## Flags carried to the team lead (do not decide here)
1. **`YOSHI_COLORS` symbol rename deferred** (census flag #7 rec. (c)). This lane scrubbed the branded doc phrasing (`animation.md:111`) to unbranded craft language; the exported const `YOSHI_COLORS` in `pencilConfig.ts` (imported across 4 files) keeps its name — a source-symbol rename outside this docs wave's scope. The estate Nintendo gate is ZERO regardless (no `yoshi/nintendo` token in README/docs); the residual is code-only.
2. **Full-module wasm figure OPEN** — stated in `benchmarks.md` as not re-measured this pass (CI bounds it fail >240 KB); re-measure command included. Lean 121,855 B is authoritative.
3. **`docs/sudoku.md` scope** — kept as the Sudoku(+Futoshiki-sibling) doc with a brief five-game pointer; whether to author full Thermo/Killer/KenKen sections is the team lead's call (census flag #5).
4. **crates.io 0.5.0** stamped on the census's live-query confirmation (ruling #2); my in-sandbox re-query was network-blocked. If the team lead wants a fresh independent confirmation, `curl -s https://crates.io/api/v1/crates/csp-solver` outside the sandbox.
