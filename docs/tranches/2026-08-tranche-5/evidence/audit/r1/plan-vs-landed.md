# R1 — PLAN-VS-LANDED matrix

**Audit stance:** nothing in any prior close is assumed honest. Every LANDED verdict below carries a
commit SHA, a `file:line`, or a command+output excerpt taken from this tree. Where a claim could not
be re-derived from the repo or the GitHub API, the row reads **UNKNOWN** — never a guess.

**Audit HEAD:** `71456713d9f7361af80f09e1a456fc9787507e78` (`CI-RED 30690204551: the empty bake is
the runner's…`, 2026-08-01). 465 commits on `master`, working tree clean at audit open.

**Corpus audited:** `docs/tranches/2026-07-grand-uplift/**` (README, waves W0–W13, appendices A–E),
`docs/tranches/2026-07-tranche-2/**` (README, waves T2-W0–W8+WGATE, appendices A–D),
`docs/tranches/2026-07-tranche-3/**` (README, waves T3-W0/W2–W13+WGATE, appendices A–D),
`docs/tranches/2026-07-tranche-4/**` (README, 15 wave specs + WM + WU, appendix A, `WGATE-record.md`),
`docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/**` (charter, P-W2/W3/W4, evidence),
`docs/tranches/EVIDENCE-POLICY.md`.

**Verdict vocabulary.** **LANDED** — the promise is discharged and the evidence is in this tree or in
git/CI. **PARTIAL** — some of it landed; what did not is named. **NOT-LANDED** — promised, absent, no
retirement rationale. **RETIRED-WITH-RATIONALE** — killed on the record with the rationale quoted.
**BANKED** — deferred with an owner + named trigger (the estate's own legal disposition).
**UNKNOWN** — not verifiable from this repo.

**Row census: 214 rows.** 151 LANDED · 17 PARTIAL · 3 NOT-LANDED · 24 RETIRED-WITH-RATIONALE ·
12 BANKED · 7 UNKNOWN.

---

## 0. Instruments used

| Instrument | What it establishes |
|---|---|
| `git log -1 --format='%h %s' <sha>` over all 34 cited SHAs | every claimed seal/landing SHA resolves to the commit the record names (§1.1, §2.1, §3.1, §4.1) |
| `gh run view <id> --json conclusion,headSha,jobs` over 12 cited run IDs | every WGATE-cited CI run is `success` at the headSha the record names |
| `git grep -c "test(" <sha> -- 'web/frontend/e2e/*.spec.ts'` | e2e census re-derived independently at four historical SHAs |
| `git show <sha>:<path>` | doc/config truth re-read at the gate SHA, not at HEAD |
| `find`/`stat` over `docs/tranches/**` | declared-capture existence + EVIDENCE-POLICY byte budgets |
| `grep -rn` over `csp-solver/src`, `web/frontend/src`, `.github/workflows/ci.yml` | excision-ledger symbols, gate implementations, version stamps |

---

## 1. Tranche 2026-07 — Grand Uplift

Plan of record: `docs/tranches/2026-07-grand-uplift/README.md`. Baseline `91bb8b0`.

### 1.1 Wave index (README §2) — 14 rows

| Wave | Promise (headline gate) | Verdict | Evidence |
|---|---|---|---|
| W0 | CI re-enable, git hygiene (untrack 11,406 files), scripts, worktree-provisioning | **LANDED** | `6c547e34` "chore: git hygiene — untrack web/frontend/{node_modules,dist}"; `.github/workflows/ci.yml` present and running (run 30691714480 at HEAD, `success`) |
| W1 | Land composed v2 kernel + soundness fix + invariance tests + ThreadSafe; `lib.rs` split | **LANDED** | `4adab144` "refactor(kernel): W1 lib.rs colocation split — 37L facade"; `csp-solver/src/lib.rs` + `csp-solver/src/{solver,domain,constraint,csp,builder,puzzles,py}/` modules present |
| W2 | GAC default-ON; builder `AcFc→Ac3`; solver excisions | **LANDED** | `grep -rn 'min_conflicts\|CardinalityConstraint\|ConstraintEnum::Lambda\|NogoodStore\|backjumping\|DomWdeg' csp-solver/` → **0 hits each**; `.github/workflows/ci.yml:31-36` runs `gac_ab_corpus` as a gate |
| W3 | Zero-alloc verification; no `lto=fat`; mimalloc gated | **LANDED (as a REJECT posture)** | `Cargo.toml:89-92` "NO lto=fat / codegen-units=1 / strip — the T15 refutation stands"; no `mimalloc` symbol anywhere in `Cargo.toml`/`csp-solver/Cargo.toml` |
| W4 | FastAPI DI/envelope, backend colocation, N=5 policy, data → `csp-solver/data/` + `include_dir!` | **PARTIAL → later RETIRED** | data half LANDED: `csp-solver/data/` = 45 files / 32,095 B (`find … \| wc -l`, `stat -f %z` sum). Service half RETIRED at T2-W2 `98fe2562` "abrogation — the server, docker, and nginx go" (rationale quoted §2.1/R1) |
| W5 | Deploy Option A (CF Pages `_redirects`/`_headers`, small API origin, DNS) | **PARTIAL** | `web/frontend/public/_redirects` + `_headers` present. API-origin half RETIRED with the server (T2-R1). DNS/CNAME half **UNKNOWN** (owner Cloudflare account, not observable here) |
| W6 | Deploy Option C: wasm `sudoku.rs` split, publish `@mkbabb/csp-solver-wasm`, lean ≤93 KB | **LANDED, band superseded** | `csp-solver/wasm/` present at `version = "0.6.0"`; lean band re-cut for five games to 127,500 B (`ci.yml:444,465`) — the ≤93 KB figure is superseded on the record, not silently moved (`ci.yml:373`) |
| W7 | `src/pencil` + `src/games/*` topology; pencil/games naming CANONICAL | **LANDED** | `web/frontend/src/pencil/` and `web/frontend/src/games/{sudoku,futoshiki,thermo,killer,kenken,shared}/` both exist; no `skin/` anywhere |
| W8 | Grain hoist, unified scheduler, BoilDivider migration, celebration beats | **LANDED, superseded twice** | superseded by T3-W13 pose stacks (`bbeb2b87`) and again by P1's deletion cure (`6b8c1ffd`); the divider survives as the one Apple-frozen exception, `filterBudget.ts:BEAT_DRIVEN` |
| W9 | Pure-pencil + union adopt-partial (washi, hold-to-peek, PRT fix blocking, vellum cut) | **LANDED** | `src/pencil/sheet/AnswerKeyLaminate.vue`, `SheetWashiLabel.vue` present; no `backdrop-filter` build shipped (union verdict §8 adopt-partial) |
| W10 | Futoshiki product wave, v1 = N=4–7, no difficulty tiers | **LANDED, then superseded** | `src/games/futoshiki/` present; the "no tiers" clause was overturned on the record at T4-W6 (`d4faa412` "the futoshiki axis") — `csp-solver/tests/futoshiki_difficulty.rs` exists |
| W11 | Morph excision to `mkbabb/morph`; crate + npm name frozen | **LANDED** | tag `pre-morph-excision` present; `d9781e29` "release(w12): the window closes — pencil-boil ^0.6.0 swap, morph…"; no `morph` dir in tree |
| W12 | One ratified cross-repo window (csp-solver 0.2.0, pencil-boil 0.5.0→0.6.0, bbnf sync-gate) | **LANDED** | `d9781e29`; bbnf half is out-of-repo — **UNKNOWN** in this checkout (never-push order; §5.3) |
| W13 | Docs rewrite; every cited number traces to an evidence file | **LANDED, superseded by T4-W14** | `dc5bd4c4` "docs: W13 — the doc-truth ledger, all 15 rows closed" |

### 1.2 Owner-decision ledger (README §3) — 8 rows

| # | Decision | Verdict | Evidence |
|---|---|---|---|
| OD-1 | dark-mode laminate rim keep/drop | **RETIRED-WITH-RATIONALE** | T2 appendix C L25-34: "**DEFER** — no-glass default safe"; no `backdrop-filter` in the shipped tree |
| OD-2 | `SvgFilters.vue` placement | **LANDED** | `web/frontend/src/pencil/chrome/SvgFilters.vue` exists — the recommended default |
| OD-3 | morph npm-name confirmation (dir renames, package name frozen) | **LANDED** | tag `pre-morph-excision`; excision commit `d9781e29`. Registry state out-of-repo — **UNKNOWN** |
| OD-4 | Cloudflare CNAME deletion | **LANDED per record, UNVERIFIABLE here** | T2 appendix A row 2: "DNS/App-Runner 'unresolved' (resolved; OD-4 executed at `d43fae28`)"; `d43fae28` resolves ("deploy: OD-4 executed + full Pages cutover"). Live DNS state not observable from this repo → **UNKNOWN** |
| OD-5 | API-box choice for Option A | **RETIRED-WITH-RATIONALE** | T3 appendix B §1: "**OBSOLETED ×5** — all downstream of T2-W2's server abrogation (`98fe2562`)" |
| OD-6 | release-window calendar date | **LANDED** | discharged by the `d9781e29` window |
| OD-7 | bbnf skinny one-line edit authorization | **UNKNOWN** | out-of-repo (`bbnf-lang`, never-push). T3 appendix B §1 lists it among "three rows unverifiable from this repo" — the record itself concedes this |
| OD-8 | Futoshiki navigation shape (in-app selector, no router) | **LANDED, then superseded** | no `vue-router` in `web/frontend/package.json`; the selector became the carousel at T4-W12 `3781ec14` |

### 1.3 Appendix A — excision ledger (52 rows; the 16 verifiable Rust rows re-derived)

| # | Item | Verdict | Evidence |
|---|---|---|---|
| R1 | `ConstraintEnum::Lambda` zero constructors → EXCISE-or-WIRE | **LANDED (excised)** | `grep -rn 'ConstraintEnum::Lambda' csp-solver/` → 0 |
| R2 | `CardinalityConstraint` dead → EXCISE | **LANDED** | `grep -rn 'CardinalityConstraint' csp-solver/` → 0 |
| R3 | `propagate_gac_alldiff` duplication → unify | **LANDED** | `csp-solver/src/solver/gac/` module tree present, no duplicate entry points |
| R4 | `NogoodStore` orphaned → substrate + canaries | **RETIRED-WITH-RATIONALE** | T2 appendix C L25-01: "**FORECLOSED by R4** — the substrate itself is excised at 0.3.0 (W3); the deferral ends". `grep -rn 'NogoodStore' csp-solver/` → 0 |
| R5 | `min_conflicts` silent fallback → EXCISE | **LANDED** | `grep -rn 'min_conflicts' csp-solver/` → 0 |
| R6 | `SoftLambdaConstraint` penalty discarded | **LANDED then excised** | resolved at W1; the whole soft island excised at T2-W3 `ed07ba6b` |
| R7 | `BitsetDomain` release aliasing behind `debug_assert!` | **LANDED** | `csp-solver/src/domain/bitset.rs:27-28` — "This is a **release-mode** `assert!`, not a `debug_assert!` (R7)"; `bitset.rs:39` `assert!(v < 128, …)` |
| R8 | `AssignmentError` `Infeasible`/budget conflation → add `BudgetExceeded` | **LANDED** | `grep -rn 'BudgetExceeded' csp-solver/` → 25 hits |
| R9 | `finalize()` panic + VarId panic across FFI → typed exceptions | **LANDED** | `csp-solver/src/py/errors.rs` present; `csp-solver/tests-py/test_panic_contract.py` present |
| R10 | `tests/optimize.rs` duplicate `CostFiniteDomain` | **LANDED** | `csp-solver/tests/optimize.rs:10-13` — "R10: this file used to hand-roll its own `CostFiniteDomain` … That duplicate was excised; the tests now exercise the real type" |
| R11 | `FiniteDomain::iter` dead-weight overrides | **LANDED** (resolved by rework) | zero-alloc capture rework, in the W1 seed |
| R12 | `generate_from_template`/`apply_random_transform` byte-identical twins | **LANDED** | `grep -rn 'generate_from_template' csp-solver/` → 0; `apply_random_transform` survives as the single home (7 hits) |
| R13 | `difficulty` discarded on the template fast path | **LANDED** | debug-gated consistency assert, W4 data ownership; `csp-solver/tests/difficulty_parity.rs` present |
| R14 | `sudoku_solutions/` bank read by nothing → EXCISE | **LANDED** | `csp-solver/data/` holds only `sudoku_puzzles`; 45 files / 32,095 B |
| R15 | `optimization_mode` absent from the py wire | **RETIRED-WITH-RATIONALE** | `csp-solver/src/py/config.rs:59` — "**`optimization_mode` is deliberately kept off the py wire (settled).**" `:70` states the default it stays at. T3 appendix A: "**CLOSED (note → permanent rationale)**" |
| R16 | `SolveConfig::default()` = the 7.6 s pathology → Ac3+FailFirst default | **LANDED** | GAC default-ON + Ac3 gated in CI (`ci.yml:31-36`) |
| P1–P12 | Python-service rows (dead generators, `except Exception`, slowapi, numpy, naming) | **RETIRED-WITH-RATIONALE ×11 / LANDED ×1** | the whole service was excised at T2-W2 `98fe2562` under R1 "FULL ABROGATION"; `web/` now contains only `frontend`. P11 (changelog for the deleted Python solver) LANDED via the W13 sweep |
| F1–F11 | Frontend rows (dead decorative subtree, shadcn, FilterTuner, autoprefixer, `@mkbabb/value.js`, dual mounts, prettier config) | **LANDED (11/11)** | `src/pencil/dev/FilterTuner.vue` is DEV-gated; no `value.js`/`autoprefixer`/shadcn in `web/frontend/package.json`; `.prettierrc.json` present (F8 — and see §6.L4 for the doc that still documents the pre-fix script) |
| W1–W7 (wasm/morph) | isomorphic mirror, `node_budget_ms`, tracked `pkg/`, correspondence hints, `NEXT_ID`, Procrustes, buddy docstring | **LANDED / out-of-repo** | `isomorphic` survives only in CHANGELOG history rows (`csp-solver/CHANGELOG.md:111-118`, `csp-solver/wasm/CHANGELOG.md:32-41` document the BREAKING excision); morph rows are out-of-repo — **UNKNOWN** |
| G1–G6 | 11,406 tracked artifacts, broken dev.sh, CI disabled, prod compose, dangling CNAME, docs lying | **LANDED ×5 / UNKNOWN ×1** | G1 `6c547e34`; G2 `scripts/dev.sh` present; G3 CI live; G4 dead with the server; G5 → OD-4 **UNKNOWN**; G6 → `dc5bd4c4` |

### 1.4 Appendix B — prompt recap (itself an audit subject) — 24 rows

Appendix B's own claim, `B-prompt-recap.md:140`: *"**Nothing in any prior mandate is unaccounted for.** Rows
marked HELD need no work; every other row has a wave."* Re-derived:

| # | Mandate | Appendix B status | Verdict at HEAD | Evidence |
|---|---|---|---|---|
| R1 | Port solver Py→Rust, isomorphic API | SPECIFIED W1/W13 | **LANDED, narrowed** | `csp-solver/src/py/` (5 files) + `tests-py/`; the isomorphic-API half moot post-abrogation (T3 appendix B §1) |
| R2 | Devirtualize constraint dispatch | SPECIFIED W2 | **LANDED** | `csp-solver/src/constraint/dispatch.rs:31-32` — `CageSum`/`CageProduct` as enum variants |
| R3 | No god modules (>500 L) | SPECIFIED | **PARTIAL** | T3 appendix B §1 records the one regression (`gac/mod.rs` 470→555) homed to T3-W4; `csp-solver/src/solver/gac/` is now a split module dir. `search.rs` waiver is on the record (T3 appendix A §2) |
| R4 | No test files in src/ | HELD (2 exceptions) | **REVERSED then LANDED** | T2 reversal "inline tests REVOKED"; `ed07ba6b`; `csp-solver/tests/` holds 22 files / 191 `#[test]` |
| R5 | Delete legacy Python solver | SPECIFIED W13 | **LANDED** | `dc5bd4c4` |
| R6 | web/ restructure | SPECIFIED W0 | **LANDED** | `web/frontend/` only |
| R7 | Fail explicitly, no silent handling | SPECIFIED (appendix A) | **LANDED** | discharged item-by-item, §1.3 |
| R8 | Decouple pencil UI from CSP domain | SPECIFIED W7 | **LANDED** | `web/frontend/eslint.config.js` boundary blocks; `@pencil/*`/`@games/*` aliases |
| R9 | PRM across all animation loops | SPECIFIED W8/W12 | **LANDED** | PRM parity gates carried through T3-W13 and T4 |
| R10 | Shared skin → pencil-boil, never glass-ui | HELD + SHARPENED | **LANDED** | no `glass-ui` import in `web/frontend/package.json` |
| R11 | COP support | SPECIFIED W2 | **LANDED** | `csp-solver/tests/optimize.rs`, `cost_finite.rs` |
| R12 | wasm bindings solver+morph | SPECIFIED W6/W11 | **LANDED** | `csp-solver/wasm/`; morph out-of-repo |
| R13 | Publish to @mkbabb suite | SPECIFIED W12 | **LANDED** | `csp-solver 0.6.0` per `csp-solver/README.md:24-25`; registry state not re-queried here → the *published* half is **UNKNOWN** from this checkout |
| M1/M1b/M1c | keyframes/value/pencil-boil spec+lock | SPECIFIED W7/W12 | **LANDED then RETIRED** | `keyframes.js` **RETIRED** at T4 (WGATE §3.2, rationale: "a second animation brain is the rejected covenant") |
| M2 | pencil-boil reactive-PRM teardown (chronic ×3) | SPECIFIED W12 | **LANDED** | out-of-repo release; consumer pins `^0.10.1` (`web/frontend/package.json:36`) |
| M3 | Controls-LEFT | HELD | **LANDED (exemption)** | no work owed |
| M4/M4b | Sun mascot / `useCelestialSun` | PARKED, re-booked | **BANKED** | T2 appendix C L25-07: "**DEFER** — trigger = a real second consumer"; trigger unfired |
| M5/M5b | DNS tuple / security headers | SPECIFIED W5 | **PARTIAL** | `web/frontend/public/_headers` present (headers half LANDED); DNS half **UNKNOWN** |
| D1 | Docs isomorphic with code | SPECIFIED W13 | **PARTIAL — see §6.L4** | root README + `docs/*.md` + `csp-solver/README.md` are current; `web/frontend/README.md` is not |
| D2 | Root CLAUDE.md reflects web/ | SPECIFIED W13 | **RETIRED-WITH-RATIONALE** | T3 appendix B §1: "**OBSOLETED** — CLAUDE.mds folded to READMEs at T2-W7 `ede25188`" |
| G1 | No build artifacts tracked | SPECIFIED W0 | **LANDED** | `6c547e34` |
| C1 | Deferred extensions documented | HELD | **LANDED** | appendix D + T2 appendix C + T3 appendix C + T4 §4 |
| C2 | CHANGELOG coverage | SPECIFIED W11/W13 | **LANDED** | `csp-solver/CHANGELOG.md`, `csp-solver/wasm/CHANGELOG.md` |
| 2026-07-04 ratifications (7) + 2026-07-05 edict (6) | discharge tables | **LANDED ×11 / RETIRED ×2** | Deploy-A and FastAPI-reference rows RETIRED at T2-W2 (`98fe2562`); the rest verified in §1.1/§1.2 |

**Appendix B verdict: the "nothing unaccounted for" claim holds as a *homing* claim** — every row does
carry a wave. It does **not** hold as a landing claim without the five obsoletions T3's own a3 lane
later had to add (`T3/appendices/B-prompt-recap.md:165`). Appendix B never marked them; T3 did. Booked
as a record-lag row, not a lie (§6 discussion, L2).

### 1.5 Appendix C — SOTA adoption (28 rows, sampled 8)

| Technique | Final verdict promised | At HEAD | Evidence |
|---|---|---|---|
| CHS / dynamic wdeg | ADAPT — opt-in only, never the sudoku default | **RETIRED-WITH-RATIONALE** | driver foreclosed at T2-R4; `grep DomWdeg csp-solver/` → 0 |
| Luby restarts + phase saving | substrate landed, driver deferred | **RETIRED-WITH-RATIONALE** | T2 appendix C L25-01 "FORECLOSED by R4 … the deferral ends" |
| GAC (Régin) on AllDifferent | ADOPTED, default ON | **LANDED** | `ci.yml:31-36` gates `gac_ab_corpus` 0/50 + the node-count spine |
| `lto=fat`/`cu=1`/`strip` | **REJECT** | **LANDED as REJECT** | `Cargo.toml:89-92` states the refutation and the posture |
| mimalloc | GATED behind a real-workload A/B | **BANKED** | zero `mimalloc` symbols; T2 L25-13 "DEFER per D20" |
| iai-callgrind CI gate | REMAINS BOOKED (never executed) | **LANDED** | promoted at T2 L25-11 "LANDS → W3"; `ci.yml:661-698` job `iai` with `csp-solver/benches/iai_queens.baseline` + `iai_gate.sh` on disk |
| twiggy + CI size budget | ADOPTED | **LANDED** | `ci.yml:377` job `twiggy`; lean band `ci.yml:444,465` |
| Grain hoist / shared scheduler / filter ticks | ADOPTED | **LANDED then superseded** | superseded by the P1 deletion cure; `filterBudget.ts` is the successor invariant |

### 1.6 Appendix D — deferred fold-in (itself an audit subject) — 24 rows

Appendix D's claim, `D-deferred-foldin.md:248`: *"After this tranche the chronic list is empty."*
Re-derived against the successor ledgers:

| ID | Promised fold | Verdict | Evidence |
|---|---|---|---|
| M1 / M1b / M1c | → W7 / W7 / W12 | **LANDED** | `d9781e29`; keyframes.js later RETIRED |
| M2 | → W12, own changeset | **LANDED** | consumer at `^0.10.1` |
| M3 | exemption re-recorded | **LANDED** | no work |
| M4 | PARKED, trigger = a real second consumer | **BANKED, trigger still unfired** | T2 L25-07, T3 appendix C |
| M4b | → W12 train order | **LANDED** | `d9781e29` |
| M5 / M5b | → W5 + OD-4 | **PARTIAL** | headers LANDED (`public/_headers`); DNS **UNKNOWN** |
| S1 TieredCostEval | RE-BOOKED | **RETIRED-WITH-RATIONALE** | T3 appendix C: FOLD-EXCISE-note → W3 (the forward-decl note deleted; surface shrinks) |
| S2 `solve_with_warm_start` | RE-BOOKED | **RETIRED-WITH-RATIONALE** | same — T3 W3 note excision |
| S3 Unified Constraint trait | RE-SCOPED through the sync gate | **LANDED (evaluated)** | T3 appendix A §2 "S3 unified Constraint trait FOLD-EVALUATE … ADOPT → W4" |
| S4 tracing spans | RE-BOOKED | **RETIRED-WITH-RATIONALE** | T3 W3 note excision ("driver foreclosed") |
| N1 | node_budget half-migration | **LANDED** | `BudgetExceeded` live (25 hits) |
| N2 / N3 | dom/wdeg + NogoodStore substrate, driver deferred | **RETIRED-WITH-RATIONALE** | foreclosed at T2-R4; both symbols grep-zero |
| N4 | GAC default-ON | **LANDED** | `ci.yml:31-36` |
| N5 | `isomorphic.rs` settled | **LANDED (excised)** | `d78fef8e` "T3-W3: dead surface — isomorphic excised" |
| N6 | `min_conflicts` EXCISE | **LANDED** | grep-zero |
| N7 | Futoshiki product surface | **LANDED** | `src/games/futoshiki/` |
| N8 | N=5 BOUNDED | **RETIRED-WITH-RATIONALE** | T2 L25-23: "**EXCISED permanent** — and R1 now kills N=5-Easy too … the do-not-reopen clause covers all of 25×25" |
| N9 | bbnf sync gate + repo split re-booked next tranche | **RETIRED-WITH-RATIONALE** | T2 reversal `R4`/`N9-repo-split`: "**VOID** + the **T2-1 de-booking** … The demo **stays in this repo**" |
| N10 | grain hoist + scheduler batching | **LANDED** | superseded by P1 |
| N11 | wall-clock budget in `SolveConfig` | **BANKED** | T2 L25-06 "RE-BASED DEFER"; trigger = a caller needs true wall-time — unfired |
| chronic roll-up | "the chronic list is empty" | **HOLDS** | T2 appendix C §"Chronic roll-up" re-checked at `c14995eb`; T3 appendix C re-verified at `3b75eca2`; T4 §4a carried the three survivors as DISEASE rows with terminal dispositions (WGATE §3.1) |

**Appendix D verdict: the folds happened.** Nine of the 24 rows were folded harder than promised (the
S-series and N2/N3 went from "re-booked" to *excised on the record*), which is a strictly better
disposition than the appendix wrote. No appendix-D row is silently open.

### 1.7 Appendix E — the 5 named residuals

| # | Residual | Verdict | Evidence |
|---|---|---|---|
| 1 | design/frontend gate residue (grain envelope, celebration 4th workstream, PRT fix, OD-1) | **PARTIAL** | PRT + celebration LANDED; grain envelope superseded by the P1 deletion cure; OD-1 DEFERRED with rationale (T2 L25-34); celebration 4th workstream **BANKED** (T2 L25-30 "verify-or-drop stays booked, non-blocking") |
| 2 | service residue (taxonomy/DI port) | **RETIRED-WITH-RATIONALE** | abrogated at `98fe2562` |
| 3 | build churn (mimalloc A/B + `alloc_count.rs` conflict) | **BANKED** | trigger unfired; `alloc_count.rs` gone with the stale-examples sweep (T3 appendix A §2) |
| 4 | renamed-tree gates (`pencil/`+`games/` never built) | **LANDED** | the tree builds in CI (`ci.yml` job `frontend`, run 30691714480 `success`) |
| 5 | cross-repo full-graph compile inside bbnf | **UNKNOWN** | never-push order; not observable here. The record concedes the same (T3 appendix B §1: "three rows unverifiable from this repo") |

---

## 2. Tranche II (2026-07-tranche-2)

### 2.1 Wave index (README §3) — 10 rows. Every landing SHA re-resolved.

| Wave | Claimed SHA | Resolves to | Verdict |
|---|---|---|---|
| T2-W0 gates+hygiene | `7c245bed` | "T2-W0: gates + hygiene — e2e green + into CI, literals trued" | **LANDED** |
| T2-W1 toolchain+deps | `5f9980c8` | "T2-W1: toolchain + deps SOTA — stable pin, PyO3 0.29, Vite 8" | **LANDED** |
| T2-W2 abrogation | `98fe2562` | "T2-W2: abrogation — the server, docker, and nginx go; wasm is…" | **LANDED** — `web/` = `frontend` only |
| T2-W3 kernel+tests | `ed07ba6b` + `260bfe0f` | both resolve; fixup = "un-strip the bench profile — iai toggle needs syms" | **LANDED** |
| T2-W4 data reshape | `22514bae` + `54aa94a5` | both resolve | **LANDED** — bank 45 files / 32,095 B |
| T2-W5 FE perf+hardening | `49506bf8` | "fonts self-host, grain hoist, Q8…" | **LANDED** |
| T2-W6 affordances | `b36b7b9f` | "the bound order, PWA-minimal, and beat 9" | **PARTIAL** — the PWA half RETIRED at T4-W3 (§4.1) |
| T2-W7 docs+record | `ede25188` | "CLAUDE.mds folded to READMEs, MIT, the…" | **LANDED** — zero `CLAUDE.md` tracked (repo has none by design) |
| T2-W8 colocation | `c14995eb` | "grand recursive colocation — per-game solver/ modules" | **LANDED** |
| T2-WGATE | `3b75eca2` | "T2-WGATE: re-certification — first-party GAC probe, ledger cl…" | **LANDED** |

**Independent count check at `3b75eca2`:** `git grep -c "test(" 3b75eca2 -- 'web/frontend/e2e/*.spec.ts'`
→ **5 files / 33 total**, matching the T3 README's cited "e2e 33/33" at that base. The T2 close's own
count claim reproduces.

### 2.2 Ratifications R1–R9 (README §2) — 9 rows

| R | Verdict | Evidence |
|---|---|---|
| R1 full abrogation | **LANDED** | `98fe2562`; `apiError.ts` split not deleted (T2 appendix A row 1 corrected the "free-delete" claim before it shipped — the ledger caught its own lane) |
| R2 fold + MIT | **LANDED** | `LICENSE` at root; `ede25188`; zero `CLAUDE.md` tracked |
| R3 wholesale affordances (8 items + hardening ten) | **PARTIAL** | 7/8 LANDED; "minimal PWA" RETIRED at T4-W3 with rationale (§4.1). Hardening H7/H10 **BANKED** with owner+trigger (T2 appendix C §G) |
| R4 substrate island excised @0.3.0 | **LANDED** | restart/CHS/nogoods/SoftConstraint all grep-zero |
| R5 worktree purge + `java` branch delete | **PARTIAL — half REVERSED** | worktree half LANDED (T4-W0, 44 orphan branches pruned); `java`-delete half **REVERSED**, quoted: *"The java branch STAYS"*. Verified: `git branch -a` shows `java` and `remotes/origin/java` present |
| R6 e2e into CI | **LANDED** | `ci.yml:564` job `e2e` |
| R7 stable pin + MSRV 1.88 | **LANDED** | `rust-toolchain.toml` at root |
| R8 keyframes.js excision | **LANDED then terminally RETIRED** | no `@mkbabb/keyframes.js` in `web/frontend/package.json`; WGATE §3.2 terminal row |
| R9 never-push (csp-solver) RETIRED | **LANDED** | tags `v0.2.0`, `v0.3.0` present on origin |

### 2.3 Appendix A corrections ledger — 14 refutations + Pass-3 additions

**LANDED as a governing instrument.** Spot-check: row 12 struck `useReducedMotion.ts` retirement as a
phantom — `find web/frontend/src -name 'useReducedMotion*'` returns nothing, i.e. the correction was
right and the original row was the lie. Row 2 (OD-4 resolved at `d43fae28`) resolves. This appendix is
the single healthiest artifact in the corpus: it blacklists its own campaign's false claims by name.

### 2.4 Appendix B (prompt recap) + Appendix C (deferred fold-in) — audit subjects

- **Appendix B**, `B-prompt-recap.md:169`: *"Nothing in either campaign's ask-set lacks a row above."*
  **HOLDS** — its 9 class-B constraints and 9 ratifications all carry a wave, and T3's a2 lane
  independently re-verified 9/9 and 8/9 against the landed tree (`T3/appendices/B-prompt-recap.md:171`).
  The one un-landed row (R5) is correctly marked owner-deferred, not landed.
- **Appendix C**, 59 rows + §G new deferrals: **every row homed**, and the §"W-GATE close — roll-up
  re-check (`c14995eb`)" re-checked itself at final HEAD. Spot-checks: L25-11 iai → `ci.yml:661` job
  `iai` **LANDED**; L25-45 tracked `.env` → `git ls-files .env` empty **LANDED**; L25-50 e2e into CI
  **LANDED**; C1/C2 `index.css` `@layer` extractions **BANKED at W8 with the hold rationale quoted**
  and still held at T3 ballot Q4 ("**Drop** — HELD-again record lands"). No orphan found.

---

## 3. Tranche III (2026-07-tranche-3)

### 3.1 Wave index (README §3) — 14 rows

| Wave | Verdict | Evidence |
|---|---|---|
| T3-W0 anchor | **LANDED** | `evidence/W0-execution-anchor.md` on disk |
| T3-W1 | **RETIRED-WITH-RATIONALE** | README §3: *"T3-W1 is **retired from the DAG — the OWNER BALLOT of 2026-07-10 IS its output**"*; the numbering gap is deliberate and stated |
| T3-W2 packaging + doc truth | **LANDED** | `public/_headers` present |
| T3-W3 dead surface (0.4.0 begins) | **LANDED** | `d78fef8e` "isomorphic excised, py pruned to the ba…"; `csp-solver/src/py/` = 5 files, no `futoshiki_api.rs`, no `sudoku_api.rs` (renamed to `py/sudoku.rs` ✓) |
| T3-W4 core structure 0.4.0 | **LANDED** | `csp-solver/src/solver/gac/` split; `csp-solver/wasm/src/errors.rs` per T3 appendix A §2 |
| T3-W5 library | **LANDED** | `csp-solver/tests-py/stubtest_allowlist.txt` on disk; `csp-solver/tests/assignment_proptest.rs` present |
| T3-W6 engine perf | **LANDED** | `csp-solver/examples/gac_timing_probe.rs` + `gac_ab_corpus.rs` both on disk; `ci.yml:31-36` gates the node-count spine |
| T3-W7 FE structure (three-home rule) | **LANDED** | `src/games/shared/` exists with `useAnswerKeyPeek.ts`, `scene.css`, `types.ts`, `constants.ts`, `useUndoHistory.ts`, `usePencilMarks.ts`, `useButtonAnimation.ts` — exactly the ballot-Q3 file set; `useTheme.ts` stayed in `src/composables/` ✓ |
| T3-W8 FE perf | **LANDED** | `evidence/pass3/g7-harness/` banked per PATHS.md |
| T3-W9 design gold move | **LANDED** | `src/pencil/chrome/CelebrationStar.vue`, `AttributionCard/CrayonHeart.vue`, `heartPaths.ts` |
| T3-W10 sky + page | **LANDED** | `src/pencil/celestial/DarkModeToggle.vue` |
| T3-W11 UI + security | **PARTIAL** | UI rows LANDED; **the ratified "digit pad = BUILD" was built (`53398825` "T3-W11 fixup: pin the digit-pad spec to chromium") and then wholly REVERSED at T4-WM** — rationale quoted §4.1/E8 |
| T3-W12 owner-audit addendum | **LANDED** | `b4d7aedf` "T3-W12: the owner-audit addendum — the grade moves into the m…" |
| T3-W13 motion-perf recut | **LANDED** | `bbeb2b87`; CI run **29181782302 = `success` at `bbeb2b87`** (verified via `gh run view`) |
| T3-WGATE | **LANDED** | `d0893614` "T3-WGATE: record + recert — the tranche closes, the ledger ho…" |

**Independent count check at `bbeb2b87`:** `git grep -c "test(" bbeb2b87` → **8 files / 44 total**,
matching the T3 record's "e2e 44/44". Reproduces exactly.

### 3.2 Ballot Q1–Q4 + the three non-blocking defaults — 7 rows

| Row | Verdict | Evidence |
|---|---|---|
| Q1 py wheel (maximal prune, `futoshiki_api` REMOVE) | **LANDED** | `csp-solver/src/py/` = `config.rs, csp.rs, enums.rs, errors.rs, sudoku.rs` — no `futoshiki_api.rs`, no `sudoku_api.rs` |
| Q2 core 0.4.0 (12+2+1, `propagate_stratified` REMOVE, Timeout RESERVE) | **LANDED** | `grep -rn 'propagate_stratified' csp-solver/` → 0 |
| Q3 FE three-home rule | **LANDED** | §3.1 T3-W7 row |
| Q4 index.css **Drop**/HELD-again | **RETIRED-WITH-RATIONALE** | quoted: *"**Drop** — HELD-again record lands; `index.css` stays monolithic … hold re-opens on the same trigger"*; `src/assets/index.css` is monolithic (802+ lines) at HEAD |
| default 1 — F2 inline star | **LANDED** | ratified at default 2026-07-10 |
| default 2 — UI-13 keep grade-after-Solve | **LANDED** | `src/games/shared/DifficultyTally.vue` |
| default 3 — `mod.rs` flip post-tranche | **LANDED at T4-W4** | `Cargo.toml:61` `mod_module_files = "deny"`; `find csp-solver/src -name mod.rs` → **0** |

### 3.3 Appendix B (prompt recap, three campaigns) — audit subject

`T3/appendices/B-prompt-recap.md:272`: *"**No ORPHAN rows** — every ask carries a … disposition."*
**HOLDS**, and this appendix is the one that *corrected* its predecessor: §1 added the five obsoletions
tranche-1's appendix B never carried, and §6 (added at T4-W0) absorbed E1–E7 into row grammar. E1–E7
verdicts re-checked: E1 java-STAYS ✓ (`git branch -a`), E2→`b4d7aedf` ✓, E3/E4→`bbeb2b87` ✓,
E6 OOM→`65425697` ✓ ("deploy pipeline: pin wrangler 4.110.0 + npm run deploy"), E7→T4-W1 ✓.

### 3.4 Appendix C (deferred disposition) — 27 folds + chronic set

**LANDED.** Spot-checks: the four FOLD-EXCISE-note rows (L25-02/03/05/07) — all four forward-decl
notes are gone from `csp-solver/src` (grep-zero for `TieredCostEval`, `solve_with_warm_start`,
`tracing`, `useCelestialSun`). L25-04 S3 FOLD-EVALUATE → adopted at W4. The exclusions are each
justified as trigger-blocked (device-gated / out-of-repo / user-imperceptible), which is the only
exclusion class the mandate permitted.

---

## 4. Tranche IV (2026-07-tranche-4)

### 4.1 Wave index + seal chain (README §2, WGATE §1) — 17 rows. Every seal SHA and CI run re-verified.

| Wave | Seal SHA | Resolves | Cited CI run | `gh run view` result |
|---|---|---|---|---|
| W0 | `429e7983` | ✓ "record + estate truth — the phantom debt dies" | 29219288631 | **success @ 429e7983** |
| W1 | `c78cee9d` | ✓ "bake once, swap forever — the WebKit cure lands at 98…" | batch-pushed (declared) | n/a — declared, not claimed |
| W2 | `0ea30223` | ✓ "tests + gates re-founded — every vacuous green now bit…" | batch-pushed (declared) | n/a |
| W3 | `7393e7df` | ✓ "the PWA comes out whole, the share path stops lying" | carried green (declared) | n/a |
| W4 | `54b1bcb5` + `c1dc6f20` | ✓ both | carried green (declared) | n/a |
| W5 | `33066681` (+`8c6af343`) | ✓ both | 29229784491 | **success @ 8c6af343** |
| W6 | `d4faa412` (+`602c8de9`) | ✓ | 29240187169 | **success @ 3b587b86** |
| WM | `b8acf3f7` (auth. `c2dd6476`) | ✓ both | 29240187169 | **success @ 3b587b86** |
| W7 | `6cad6327` (+`7e03c5dc`) | ✓ | 29267934350 | **success @ 7e03c5dc** |
| W9 | `8875d261` | ✓ | 29276164982 | **success @ df013a36** |
| W8 | `df013a36` | ✓ | 29276164982 | **success @ df013a36** |
| WU | `766aa068` (auth. `ae2517c2`) | ✓ | 29284479290 | **success @ 766aa068** |
| W10 | `7d51f562` | ✓ | 29291214817 | **success @ 7d51f562** |
| W11 | `38d3f223` | ✓ | 29426026443 | **success @ 38d3f223** |
| W13 | `f8950257` | ✓ | 29445645304 | **success @ 1056cb18** |
| W12 | `3781ec14` (+`1056cb18`,`826f16e3`) | ✓ | 29445645304 → 29446086277 | **success @ 826f16e3** |
| W14 | `d70073f3` | ✓ | **29449438899** | **success @ d70073f3, 11/11 jobs `success`** |
| WGATE | `aa77860e` | ✓ | 29451091818 | **success @ aa77860e** |

**Verdict: LANDED, and the seal chain is honest.** The record discloses up front (`WGATE-record.md:13`)
that *"Several intermediate seals landed red … and were carried green within the session by an
addendum"* — and the cited runs are indeed at the addendum SHAs, not the seal SHAs, which is exactly
what the disclosure says. No run ID is fabricated; none is `failure`.

### 4.2 The 15 waves' headline deliverables — 17 rows

| Wave | Promise | Verdict | Evidence |
|---|---|---|---|
| W0 | 9 dependabot alerts → 0; java-STAYS; ballots tabled; 55 MB shed | **LANDED** | `git branch -a` shows `java` + `origin/java`; tags `v0.2.0`,`v0.3.0`,`pre-morph-excision`; alert state not observable here → dismissal half **UNKNOWN** |
| W1 | bake-once bitmap pose cache; pencil-boil 0.9.0; browser SSIM harness | **LANDED then superseded by P1** | `src/pencil/**/rasterPose.ts` machinery referenced by `filterBudget.ts`; superseded cure at `6b8c1ffd` |
| W2 | every gate able to fail; π/DELTA golden system; CI compute-cost DAG | **LANDED** | `e2e/goldens/` = 8 PNGs (4 darwin + 4 linux, exactly "4 pairs"); `ci.yml:52` documents the DAG; `scripts/check-golden-bytes.mjs` exists |
| W3 | PWA out whole; OG meta; clipboard truth; version byte | **LANDED** | `grep -rn 'serviceWorker\|workbox\|vite-plugin-pwa' src vite.config.ts package.json` → **0 hits**; no `manifest` in `index.html`; **6** `og:` tags in `web/frontend/index.html` |
| W4 | dead surface out; one deep-import grammar; prettier + knip DISEASE; `mod.rs` flip | **LANDED** | `.prettierrc.json` present; `package.json:18` `"lint": "prettier --check src/"`; `knip.json` present; `Cargo.toml:61` `mod_module_files = "deny"`; zero `mod.rs` |
| W5 | kill the CVE; TS lag; engines; Makefile truth | **LANDED** | `ci.yml:767` job `cargo-audit`; pencil-boil pinned (now `^0.10.1`) |
| W6 | futoshiki difficulty axis; 16×16 label-inversion dies | **LANDED** | `csp-solver/tests/futoshiki_difficulty.rs`; `csp-solver/examples/zzz_gen_truth_probe.rs`; `csp-solver/README.md:181` "futoshiki/ … (Difficulty axis since 0.5.0)" |
| W7 | pure-TS technique engine; hint says why; grade = hardest technique | **LANDED** | `src/games/shared/techniqueEngine.ts` + `.test.ts`, `techniqueVoice.ts` + `.test.ts` |
| W8 | editable marks, error-check mode, persistent candidates, peer highlight, attribution parity | **LANDED** | `src/games/shared/useUserMarks.ts`, `useAssists.ts`, `CheckStatus.vue`, `AttributionCard/` — all game-agnostic in `games/shared/` as promised |
| W9 | progress border; tally shows hardest technique | **LANDED** | `src/games/shared/DifficultyTally.vue`, `solveTally.ts` |
| W10 | easing family → CSS vars; laminate on one glass curve; four a11y hard gates | **LANDED** | theme key: `src/composables/useTheme.ts:9` `storageKey: "sudoku-color-scheme"` — matches the **wave spec** (`T4-W10…md:55,94`), not README §4b's `csp-color-scheme` (§6.L5) |
| W11 | `defineGame<TBoard,TCell,TClue>` + Rust `PuzzleClass`; ~1,600–1,900 net LOC removed | **LANDED** | `src/games/registry.ts:121` `export function defineGame<TBoard, TCell extends Component, TClue>(`; `csp-solver/src/puzzles/class.rs:22` `pub trait PuzzleClass {`. LOC-delta claim not re-derived → **UNKNOWN** |
| W12 | carousel; game #3 is a data row | **LANDED** | `src/games/registry.ts:GAMES` = 5 cards; `useFlipGlide.ts`, `PosterBoard.vue`, `useGameGallery.ts` |
| W13 | Thermo + Killer + KenKen on two n-ary cage primitives | **LANDED** | `csp-solver/src/constraint/dispatch.rs:31-32` `CageSum`/`CageProduct` variants; `csp-solver/tests/{cage,killer,kenken,thermo,thermo_acceptance,puzzle_class}.rs`; `src/games/{thermo,killer,kenken}/` |
| W14 | every product doc under MIKE-STYLE, zero meta, truth re-stamped | **PARTIAL — the scope excludes a product doc that is stale (§6.L4)** | root README, `docs/*.md`, `csp-solver/README.md` all clean: `grep -n '0\.7\.0' docs/animation.md README.md csp-solver/README.md` → **empty**. `web/frontend/README.md` was never in the gate's scope and is stale on three axes |
| WM | pad abrogated for native bounded entry; touch affordances; long-press | **LANDED** | `SudokuCell.vue:121` `inputmode="numeric"`; `SudokuCell.test.ts:56` *"inputmode is a static 'numeric' — no path that suppresses the OS keyboard survives"*; `useLongPress.ts`, `honestHaptics.ts` |
| WU | one tagged delta log, cap 200, dirty-gated confirms, staged Deal | **LANDED** | `src/games/shared/useUndoHistory.ts:45` `const UNDO_CAP = 200;`; `useDirtyBoard.ts`, `useStagingBridge.ts` |

### 4.3 Ballots B1–B5 (README §3, WGATE §4) — 5 rows

| Ballot | Recorded outcome | Verdict | Evidence |
|---|---|---|---|
| B1 repo estate — prune + size policy | EXECUTED at W0, 55 MB shed | **PARTIAL — the policy shipped, the enforcement did not (§6.L1)** | `docs/tranches/EVIDENCE-POLICY.md` exists and is ratified; the prune LANDED. The declared enforcement gate does not exist and the tranche-4 evidence dir breaches its own caps |
| B2 core 0.4.0 publish | PUBLISHED 0.4.0 at W0 **and** 0.5.0 at WM | **LANDED (in-tree half)** | source now `0.6.0` (`csp-solver/Cargo.toml:3`); registry state not queried here → **UNKNOWN** |
| B3 non-goals retired | dailies/streaks, stats/leaderboards, timers RETIRED | **RETIRED-WITH-RATIONALE** | quoted rationale WGATE §3.4: *"needs dated-puzzle infra + persistent identity; the streak-pressure frame is the engagement stack the product defines itself against"*; re-entry criterion recorded. No such surface in `src/` |
| B4 new-game set | Thermo + Killer + KenKen shipped; crosswords retired | **LANDED + RETIRED-WITH-RATIONALE** | 5 games in `registry.ts`; crosswords retired on *"two verified walls: a real per-length word bank overflows the u128 domain ceiling (`bitset.rs:38`), and clue authoring is non-CSP/NLP"* — the `u128` ceiling is real (`csp-solver/src/domain/bitset.rs:39` `assert!(v < 128, …)`) |
| B5 owner-taste sheaf (15 rows) | RATIFIED 2026-07-15 as shipped | **LANDED** | each row's tree default named; rows 11–15 traceable to `3781ec14` |

### 4.4 Disposition ledger (README §4 → WGATE §3) — "closes 100%" — 26 rows

| Section | Rows | Verdict |
|---|---|---|
| §4a DISEASE (3) | prettier global-shadow · W8 idle-chunking · 9 phantom alerts | **LANDED ×2, UNKNOWN ×1** — prettier: `.prettierrc.json` + `package.json:18` `--check`; idle-chunking DECIDED-retire-with-measurement; alert dismissal not observable here |
| §4b orphans (7) | 0.4.0 publish · `mod.rs` flip · GPU tile · `propagate_stratified` · `keyframes.js` · **theme localStorage key** · bbnf cadence | **6 carry terminal WGATE rows; the theme-key row does not (§6.L5)** — `grep -n 'localStorage\|storageKey\|color-scheme' WGATE-record.md` returns only the P1 §9.1 residual prose, no §3.2 row |
| §4c prompt recap (33 rows G1→M10, E1–E9) | every ask terminal | **LANDED** — E1 java ✓, E6 OOM→`65425697` ✓, E8→WM ✓, E9→WU ✓, M7 split across W4/W2/W3/W5/W10/W14 ✓, M8 crosswords retired ✓, M10 `defineGame` ✓ |
| §4d estate closures (4) | java stays · 44 branches pruned · `v0.3.0` tag · bloat | **LANDED** — `git tag` shows `v0.3.0`; `git branch -a` shows one surviving `worktree-wf_34cf008e-c2c-17` exactly as WGATE §3.3 says ("KEPT — unlanded mimalloc/profile-split attack work, ledgered") |
| §4e x1 tier + non-goals (8) | 5 BUILD + 3 RETIRE | **LANDED / RETIRED-WITH-RATIONALE** — §4.2 W8 row |
| §4f banked/retired games (10) | 5 BANK + 5 RETIRE (incl. crosswords) | **BANKED ×5 / RETIRED-WITH-RATIONALE ×5** — each carries its trigger or wall verbatim |

### 4.5 WGATE §2 counts re-stamped — 11 rows, independently re-derived where possible

| Figure | WGATE claim | This audit's re-derivation | Verdict |
|---|---|---|---|
| e2e | **83 static / 13 files**, 82 executed | `git grep -c "test(" d70073f3 -- 'web/frontend/e2e/*.spec.ts'` → **files=13 total=83** | **CONFIRMED** |
| goldens | 4 pairs / 8 PNGs | `ls e2e/goldens/` → 8 files, 4 darwin + 4 linux | **CONFIRMED** |
| embedded bank | 45 files / 32,095 B | `git ls-tree -r d70073f3 --name-only \| grep -c '^csp-solver/data/'` → **45**; `stat` sum at HEAD → **32095** | **CONFIRMED** |
| CI shape | 11 jobs, all success | `git show d70073f3:.github/workflows/ci.yml \| grep -cE '^    [a-zA-Z0-9_-]+:$'` → 13 lines, minus the 2 `on:` triggers = **11 jobs**; `gh run view 29449438899` → **11 × success** | **CONFIRMED** |
| rust triple | 208/0/0 | not re-run (no build permitted in this audit) | **UNKNOWN** |
| tests-py | 27/0 | `csp-solver/tests-py/` holds 4 test modules; count not re-run | **UNKNOWN** |
| FE unit | 307 tests / 29 files | not re-run | **UNKNOWN** |
| lean wasm | 121,855 B darwin / 124,091 B runner, fail >127,500 | `ci.yml:444,465` encodes `fail >127,500` and the 124,091 B runner figure verbatim | **CONFIRMED (as config)** |
| full-module wasm | 227,385 B; "the ci.yml 222,436 B comment is stale (banked)" | `ci.yml:406` still reads "222,436 B full / 90,602 B lean" | **CONFIRMED-as-disclosed** — the staleness is booked, not hidden |
| versions | crate/wasm/pkg 0.5.0 · pyproject 0.4.0 · pencil-boil ^0.9.2 | all now 0.6.0 (`csp-solver/Cargo.toml:3`, `wasm/Cargo.toml:3`, `pyproject.toml:7`, `wasm/pkg/package.json`) per the §5 EXECUTED row | **CONFIRMED, superseded upward** |
| F-1 / F-2 | two version-truth flags | F-1: `test.skip` audit — the only two hits are a *comment* (`e2e/affordances.spec.ts:158`) and a runtime engine guard (`e2e/wordmark-integrity.spec.ts:151`), not a static skip; consistent with "No `test.skip` exists in the tree". F-2 closed at `cb3c7f5f` | **CONFIRMED** |

### 4.6 WGATE §5 banked rows — 7 rows

| Row | Trigger | Verdict |
|---|---|---|
| wasm wire-dedup | a sixth game, or a solver wire >12k | **BANKED, unfired** |
| crates.io 0.6.0 + pyproject parity | EXECUTED 2026-07-15 `cb3c7f5f` | **LANDED** — `csp-solver/pyproject.toml:7` `version = "0.6.0"` |
| `YOSHI_COLORS` rename | one atomic change | **BANKED, unfired** — symbol still in 5 files (`pencilConfig.ts`, `CelebrationStar.vue`, `CrayonHeart.vue`, `heartPaths.ts`, `DarkModeToggle.vue`) — consistent with a banked row |
| full-module wasm re-measure | next size-touching wave | **BANKED** — `ci.yml:406` comment still stale; no size-touching wave since |
| `?board=` for thermo/killer/kenken | v1 extension | **BANKED, honestly wired** — `ThermoGame.vue:60`, `KillerGame.vue:52`, `KenKenGame.vue:53` each carry "`?board=` is v1-deferred (writeShareUrl no-op)"; the root README:62 states the same split in prose |
| W8 mount idle-chunking residual | a mid-device above-band trace | **BANKED** |
| `docs/sudoku.md` deep sections for the three new games | **"the games ship"** | **NOT-LANDED — the trigger had already fired at bank time (§6.L3)** — `grep -n '^## ' docs/sudoku.md` shows no thermo/killer/kenken section |

---

## 5. The P1 Safari/iOS patch (2026-07-31)

Plan: `patches/p1-safari-ios-performance/README.md`; waves `p-w2`, `p-w3`, `p-w4`; record: WGATE §9.1.

### 5.1 Wave rows — 3 rows (there is no P-W1; the DAG names `r1─r2─r3` research, which is stated)

| Wave | Promise | Verdict | Evidence |
|---|---|---|---|
| P-W2 | pencil-boil 0.10.0 + the A/B/C ballot ruled | **LANDED** | `a46c86e6` "P1-W2 seal: pencil-boil 0.10.0 cut (capture intrinsic + zero-box guard); G2.4 ruled C/C/C" |
| P-W3 | the app cure, net-negative LOC, the budget | **LANDED** | `6b8c1ffd` "delete the glyph/icon/loader/panel reference filters + land the counted budget"; `d8942ced`, `387cceea`, `ac59be9d`, `c2628b32` |
| P-W4 | rig battery, deploy per seal, WGATE §9 addendum | **LANDED** | `117c18ef`, `0642e098`, `646c82ad`, `c9cd957a`, `23e3dc00`, `6800af04` |

### 5.2 The countable invariant + gates — 8 rows

| Promise | Verdict | Evidence |
|---|---|---|
| `filterBudget.ts` as one typed exact-match allowlist | **LANDED** | `src/pencil/config/filterBudget.ts` — `PER_CELL = []`, `BEAT_DRIVEN` = 1 row × 4, `HTML_BOXES = []`, `TRANSIENT` = 2+2+1 |
| total 9, ceiling ≤14 | **LANDED** | `FILTER_BUDGET_TOTAL` sums to **9**; `FILTER_BUDGET_CEILING = 14` |
| `e2e/filter-census.spec.ts` against the built dist, exact-match both directions | **LANDED, and the gate can red** | `filter-census.spec.ts:225` `.toBe(FILTER_BUDGET_TOTAL)`; `:252` `expect(injected).toBe(true)` and `:258` *"control raises the total by exactly one"* — a live negative control, i.e. **not** a vacuous gate |
| second census at 393×699 coarse/dpr3 | **LANDED** | `filterBudget.ts` header: *"it is now MEASURED and GATED … a second time at 393×699 coarse/dpr3 and requires the same rows and the same total (9 / 9, both engines)"*; union-area rows `row: 45315` / `coarse: 6488` with a 2% tolerance |
| fill-mode secondary census | **LANDED** | `FILL_ALLOWLIST` = 12 rows, each with its retained end state; `filter-census.spec.ts:495` `.toEqual(...)` |
| `theme-bake-freshness.spec.ts` (the toggle-then-assert-ink gate) | **LANDED** | file on disk; `c9cd957a` |
| `gates.json` committed in the cure-merge commit (lessons rule 2) | **PARTIAL, self-disclosed** | `117c18ef` subject: *"gates.json — the wave's thresholds as config (owed by the cure-merge commit per lessons rule 2; landed one commit late, recorded)"* — the violation names itself |
| `lint:ink` wired into CI | **LANDED** | `package.json:21` + `ci.yml:553` `run: npm run lint:ink` (landed at `8fcafd7b`, whose own subject concedes *"the script has existed for a pass and nothing ran it"*) |

### 5.3 Refusals + residuals — 12 refusals, 5 residuals

**LANDED as a record.** Every refusal in `patches/…/README.md §Refused` carries a number and a
re-trigger; every P-W4 residual carries a trigger. Spot-check: the divider exception is the single
`BEAT_DRIVEN` row and its comment names both retirement triggers verbatim (*"(a) a successful bake
retry … (b) a Chromium red here"*). The Apple freeze is real: `fb15253d` "Safari curve: pin the
divider's live grain poses on Apple WebKit".

### 5.4 §9 → §9.1 — the self-demotion

`WGATE-record.md:239`: *"The owner overruled §9's 19/19 … §9's final-curves row is hereby demoted to
what it was — a headless-proxy verdict, the exact instrument the estate's own README §perf had already
footnoted as non-citable."* **This is a confessed close-class lie, correctly booked.** It is counted in
§6 as L0 — disclosed, not found.

### 5.5 E8 — the one open owner row

**NOT-LANDED, correctly scoped.** `p-w4…md §E8`: *"No sim number closes an iPhone claim … E8 device
smoke on a real iPhone is named in the record as **blocking the iOS claim**."* WGATE §9.1 repeats it.
The platform claim is scoped to "desktop Safari 26.4 + iOS 26 simulator" everywhere it appears. This is
the model of an honest open row.

---

## 6. LIES-FOUND

Six rows. Each names the mechanism from the close-class list, the exact claim, and the counter-evidence.

### L0 — (disclosed, not found) §9's 19/19 as a Safari claim — *proxy-≠-surface*
`WGATE-record.md:233` originally shipped "19/19 … Safari desktop 80–98 fps"; `:239` demotes it. Booked
here only so the census is honest: the estate found and confessed this one itself. **No action.**

### L1 — EVIDENCE-POLICY declares an enforcement gate that does not exist, and the tranche it governs breaches its own caps — *vacuous-green gate*

**Claim.** `docs/tranches/EVIDENCE-POLICY.md:13`: *"**Enforcement.** A violation—an uncropped viewport,
an over-cap image, an image standing in for text—blocks the wave gate. **The gate greps the wave's
evidence dir for `*.png`, sums bytes, and fails on breach.**"* `:10` sets the per-image cap at ≤150 KB,
`:11` the per-wave cap at ≤2 MB. WGATE §4/B1 records it **EXECUTED**, and README §6 asserts the
tranche-4 evidence dir is *"**`.md` only, 45 files / 648 KB**"*.

**Counter-evidence.**
1. **No such gate exists.** The only image-byte gate in the repo is
   `web/frontend/scripts/check-golden-bytes.mjs:21` — `const GOLDENS_DIR = join(FRONTEND_ROOT, 'e2e', 'goldens');`
   and `:42` `collectPngs(GOLDENS_DIR)`. It never reads `docs/tranches/**`.
   `grep -rn "EVIDENCE-POLICY\|evidence.*png" .github scripts web/frontend/scripts` returns hits only
   inside that goldens-scoped script.
2. **The governed dir breaches both caps.** `find docs/tranches/2026-07-tranche-4 -name '*.png' -size +150k | wc -l`
   → **31 images over the per-image cap**, largest `evidence/w13/killer-furniture-face.png` at
   **375,931 B** (2.5× the cap). Per-wave sums: `evidence/w12` **4.12 MB**, `evidence/w10` **4.03 MB**,
   `evidence/w13` **2.46 MB** — all over the 2 MB per-wave cap.
3. **The named "uncropped viewport" violation ships by filename.**
   `evidence/w10/parity-sudoku-dark-full.png` (310,453 B), `parity-sudoku-light-full.png` (292,795 B),
   `parity-futoshiki-dark-full.png` (271,130 B) and five more `*-full*.png` siblings. All tracked
   (`git ls-files` confirms).
4. **README §6's `.md`-only claim is false at HEAD.** `find docs/tranches/2026-07-tranche-4/evidence -type f ! -name '*.md' | wc -l`
   → **210**; `.md` count **127**; `du -sk` → **16.9 MB** against the declared 648 KB.

**Severity.** The policy that closed FAM-15 ("estate — bloat") is unenforced by construction, and the
first tranche it governed exceeded it by 8× on the file-count axis. FAM-15's "CLOSED" is a
per-mechanism green over a gestalt-broken row.

### L2 — W14's doc-truth gate is scope-narrowed around the one product doc that is stale — *vacuous-green gate + scope smuggling*

**Claim.** `T4-W14-docs-reformulation.md:80` states the version-truth gate as
*"`grep -n '0\.7\.0' docs/animation.md README.md` returns two hits today (RED); after, empty."*
`:147` closes it: *"registry honesty … pencil-boil **0.9.2** aligned (frontend pins ^0.9.2); no
unconfirmed stamp anywhere."* WGATE §8 repeats: *"the version table matches source and registry."*
FAM-8 (doc-truth) is marked **CLOSED**.

**Counter-evidence, taken at the gate SHA itself.**
```
$ git show d70073f3:web/frontend/README.md | grep -n "pencil-boil"
11:[`@mkbabb/pencil-boil`](https://github.com/mkbabb/pencil-boil) `^0.7.0`. The full
$ git show d70073f3:web/frontend/package.json | grep -n "pencil-boil"
34:    "@mkbabb/pencil-boil": "^0.9.2",
```
The gate greps exactly two files — `docs/animation.md` and the root `README.md`. `web/frontend/README.md`
carries the identical stale `0.7.0` string and was outside the grep. The wave's close row §147
enumerates its gated corpus — *"README, docs/\*.md, both csp-solver READMEs + CHANGELOGs, `.pyi`,
`_headers`, pencil-boil README + CHANGELOG"* — and the frontend per-package README is absent from it,
even though T2-R2 (`ede25188`) is precisely the ruling that made per-package READMEs the product docs.

**Aggravating:** the file was *edited by the very wave that bumped the version*:
`git log -1 -- web/frontend/README.md` → `33066681 2026-07-13 T4-W5: currency — the CVE dies at 0.9.1`.
W5 touched the file and left `^0.7.0` standing.

### L3 — a row banked at WGATE whose trigger had already fired — *re-booked chronic*

**Claim.** `WGATE-record.md:177`: banked row *"`docs/sudoku.md` deep sections for the three new games"*,
re-entry trigger *"**the games ship**; the deep-doc sections are the follow-on."* README §4 binds:
*"**Re-booking is forbidden** — no row says 'later' without a name."*

**Counter-evidence.** The games shipped at W13 `f8950257` (2026-07-15), **before** WGATE `aa77860e`.
The trigger was fired at the moment the row was written. At HEAD, `grep -n '^## ' docs/sudoku.md` yields
`CSP Formulation · Template-Based Generation · Symmetry Group · Hole-Digging Generation · Solve
Configuration · Web Integration · Futoshiki and the wider family` — no Thermo/Killer/KenKen section.
A banked row with a pre-fired trigger is a deferral wearing a trigger's clothes.

### L4 — the frontend per-package README describes a two-game app with a retired lint contract — *declared-capture missing / doc-truth over a shipped surface*

**Claim.** M7/W14: *"ALL docs re-formulated"*; FAM-8 **CLOSED**; W4's prettier DISEASE row **DECIDED-build**
with *"`lint` re-pointed off bare `--write` to `--check`"*.

**Counter-evidence — `web/frontend/README.md`, 154 lines, at HEAD:**
| line | text | tree truth |
|---|---|---|
| `:1` | `# csp-solver frontend — Sudoku + Futoshiki` | five games (`src/games/registry.ts:GAMES`) |
| `:5-6` | *"**Two games** — Sudoku (default) and Futoshiki (async-loaded, `?game=futoshiki`)"* | five cards: sudoku, futoshiki, thermo, killer, kenken |
| `:11` | `` `^0.7.0` `` | `package.json:36` `"@mkbabb/pencil-boil": "^0.10.1"` |
| `:23` | `npm run lint  # prettier --write src/` | `package.json:18` `"lint": "prettier --check src/"` — the README documents the **exact bare `--write` the DISEASE row was opened to kill** |
| `:38` | *"App.vue # Root: game selector (sudoku/futoshiki)"* | the dropdown was retired for the carousel at W12 (B5 row 14, "wordmark opens the gallery + dropdown retirement") |
| file tree §`:36-60` | no `games/shared/`, no `registry.ts`, no thermo/killer/kenken | those dirs are the tranche's headline deliverable |

`grep -n "thermo\|killer\|kenken\|carousel\|gallery\|shared/" web/frontend/README.md` → **zero hits.**
Two whole tranches of product (T4-W11/W12/W13) are invisible in the document that names the frontend.

**Also live at HEAD (post-P1 drift, smaller):** root `README.md:127` `| @mkbabb/pencil-boil | npm
(frontend dep) | ^0.9.2 |` against `package.json:36` `^0.10.1` — while P-W4 gate **G4.4 "version
parity … README … all agree"** is recorded **PASS** twice in the P-W4 execution record.

### L5 — WGATE's "closes 100%" omits an orphan row its own plan booked — *ledger-completeness over-claim*

**Claim.** `WGATE-record.md:3` and `:217`: *"The disposition ledger closes at 100%—every chronic,
deferred, partial, and prompt-recap row carries a terminal disposition."* README §4b books seven orphan
deferrals, each requiring a terminal DECIDED row.

**Counter-evidence.** `grep -n "localStorage\|storageKey\|color-scheme\|namespac" docs/tranches/2026-07-tranche-4/WGATE-record.md`
returns **only** line 175 (the unrelated `?board=` banked row) and line 251 (P1 §9.1 prose about rig
drift). The README §4b orphan — *"theme `localStorage` key un-namespaced … **BANK → W10** … Booked at W4
(FAM-7/r4) so it isn't dropped"* — has **no row in WGATE §3.2**. It is the one §4b orphan of seven that
never got its terminal record. (The work itself did land — `src/composables/useTheme.ts:9`
`storageKey: "sudoku-color-scheme"` — so this is a ledger defect, not a code defect. Note also the key
shipped is the **wave spec's** `sudoku-color-scheme` (`T4-W10…md:55,94`), not README §4b's
`csp-color-scheme`; the two plan documents disagree and neither reconciles the other.)

### L6 — "CI green throughout" for a chain whose named terminal commit is CI-red — *green-over-broken*

**Claim.** `WGATE-record.md:255`: *"Waves W2/W3/W4 sealed in-tree (`a46c86e6` → `23e3dc00`, **CI green
throughout**, incl. the census and toggle-ink gates born-RED). The patch closes."*

**Counter-evidence.**
```
$ gh run view 30663024986 --json conclusion,headSha,jobs
failure   23e3dc000500cc5128d475d2b97eca08f04054fe
  py-compile success · py-runtime success · build-lean-wasm success · lint success
  iai success · cargo-audit success · wasm success · rust success · twiggy success
  frontend success · e2e FAILURE
```
`23e3dc00` is the exact SHA the sentence names as the chain's terminal, and its run is `failure` on the
`e2e` job. The *next* commit — `6800af04`, the actual seal — is `success` (run 30663743674). The honest
sentence is "red at `23e3dc00`, carried green at the seal `6800af04`", which is the disclosure grammar
the main WGATE §1 uses for W3/W4/W5/W6/WM/W12. §9.1 dropped it.

---

## 7. Cleared suspicions — the checks that came back honest

Recorded so the empty half of the LIES section is earned rather than asserted.

| Suspicion | Check | Result |
|---|---|---|
| fabricated CI run IDs | 12 WGATE-cited run IDs through `gh run view` | **all `success`, all headSha match** |
| fabricated seal SHAs | 34 cited SHAs through `git log -1` | **34/34 resolve to the named commit** (the one non-resolver, `ecfe7177`, is a Cloudflare *deployment* id, correctly typed as such in T3 §3b) |
| inflated e2e counts | `git grep -c "test("` at `3b75eca2`, `65425697`, `bbeb2b87`, `d70073f3` | **33 / 44 / 44 / 83** — every cited figure reproduces exactly |
| vacuous `filter-census` gate | read the assertions | **has a live injected negative control** (`:252,258`) — it can red |
| declared captures missing on disk | grand-uplift's "10 decisive captures", T3's "five audit shots"+"three design PNGs", P1's soul artifacts | **10/10, 5/5, 3/3 present**; P1's `soul-glyph-bake/` + `goldens-before-after/` both on disk |
| golden re-baselining to hide movement | P1 `evidence/p1/README.md §goldens-before-after` | *"All four moved in BYTES. Zero pixels moved past threshold. Nothing was re-minted."* — and it re-ran at `maxDiffPixelRatio: 0` / `threshold: 0.2`, tighter than shipped. **Honest** |
| masked fallback in the P1 cure | `filterBudget.ts` BEAT_DRIVEN | the one exception is **named, counted, and carries two retirement triggers**; the Apple gate is a real commit (`fb15253d`) |
| PWA "abrogated" but still shipping | `grep -rn 'serviceWorker\|workbox\|vite-plugin-pwa'` + `index.html` manifest | **zero hits, no manifest** |
| alias smuggling in the excision ledger | 16 Rust symbols grepped | **12 grep-zero, 4 present with an explicit in-code rationale comment naming the ledger row (R7, R10, R15)** |
| a chronic quietly re-booked at T2/T3 | T2 appendix C roll-up + T3 appendix C | **both re-check themselves at their own final HEAD**; the survivors are trigger-bound |
| the T4 WGATE's F-1 "no `test.skip`" | grepped | the two hits are a comment and a runtime engine guard, **not static skips** |

---

## 8. UNKNOWN — 7 rows this repo cannot settle

| Row | Why |
|---|---|
| OD-4 / M5 Cloudflare CNAME + DNS tuple | owner account state, not observable from the checkout |
| OD-3 / R13 registry publication facts (crates.io, npm) | not re-queried; source stamps verified, registry not |
| OD-7 bbnf skinny edit + N9/E5 bbnf full-workspace compile | never-push, out-of-repo — the record concedes the same |
| W0 dependabot alert dismissal (9 → 0) | GitHub security-tab state, not fetched |
| WGATE rust 208/0/0, tests-py 27/0, FE unit 307/29 | no build/test run permitted in this audit; CI run 29449438899 is `success`, which is corroboration but not re-derivation |
| W11 "~1,600–1,900 net LOC removed" | not re-derived |
| E8 iPhone device smoke | hardware, owner-homed; correctly scoped in the record |

---

## 9. What the next tranche inherits

1. **L1** — write the evidence-dir byte gate the policy already declares, or amend the policy to what
   the estate actually enforces. Today the text and the tree disagree by 8× in file count.
2. **L2/L4** — `web/frontend/README.md` is a product doc outside every doc-truth sweep. Either fold it
   into the W14 corpus and re-stamp it, or delete it and let the root README carry the frontend.
3. **L5** — the theme-key orphan needs its terminal row, and README §4b vs `T4-W10…md:55` need one key.
4. **L6** — the "carried green" grammar the main WGATE uses should bind the addendum sections too.
5. **L3** — `docs/sudoku.md` owes three deep sections; the trigger fired two weeks ago.
6. **Live at HEAD:** the last four pushes include three `failure` runs (`30684983201`, `30687323601`,
   `30690204551`) with fix commits on top; the current tip `71456713` is `success` (run 30691714480).
   The design-loop pass-3/4 work post-dating the P1 seal has **no plan document in
   `docs/tranches/**`** — `git rev-list 6800af04..HEAD --count` → **42 commits**
   (`b4e2c447`…`71456713`), and `git diff --name-only 6800af04..HEAD -- docs/` returns **empty**: not
   one line of the tranche corpus moved for 42 commits of shipped work. No wave spec, no gate table,
   no record in the corpus this audit was pointed at.

ROW-COMPLETE
