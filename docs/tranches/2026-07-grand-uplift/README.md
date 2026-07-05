# Tranche 2026-07 — Grand Uplift

**THE TRANCHE.** The exact plan/wave set to implement, refine, and align the CSP-solver stack—Rust kernel, PyO3 service, wasm deploy, Vue frontend, design system, cross-repo constellation—authored from a four-pass, ~90-agent-beat audit-and-hardening campaign. Every claim in these files carries an evidence pointer into [`evidence/`](evidence/) or [`artifacts/`](artifacts/); a reader with zero session context implements from here.

Repo baseline: `91bb8b0` (docs: constellation grand-audit fold, 2026-06-03). Severity vocabulary P0/P1/P2/P3 and disposition vocabulary SHIP/KILL/BOOK/EXCISE/FAIL-EXPLICIT/WIRE-or-EXCISE continue from the 2026-06-02 fold.

---

## 1. Provenance

| Pass | Shape | Output | Convergence |
|---|---|---|---|
| **1 — audit** | 30 read-only audit agents + synthesis: every Rust module, the FastAPI service, the frontend, wasm/morph, deploy, docs, git archaeology, 5 SOTA surveys | [`evidence/synthesis-pass1.md`](evidence/synthesis-pass1.md) — excision ledger (~40 violations), transposition spec, 14 prototype candidates | **72%** |
| **2 — prototype** | 14 prototypes + 4 research beats + 1 design spec + synthesis; all worktree-isolated, all measured | [`evidence/synthesis-pass2.md`](evidence/synthesis-pass2.md) — 13 proven / 1 partial / 0 refuted; 28-item settled ledger | **90%** |
| **2.5 — design** | Union-vs-pure-pencil interlude: SOTA, kill-gate bench, union spec + built prototype | [`evidence/design-union.md`](evidence/design-union.md), [`evidence/union-prototype.md`](evidence/union-prototype.md) | — |
| **3 — adversarial** | 3 composition rehearsals (Rust, frontend, Futoshiki spec) + 16 critiques + union verdict + synthesis | [`evidence/synthesis-pass3.md`](evidence/synthesis-pass3.md) — critique board, wave skeleton, one P0 found three times | **91%** |
| **4 — closure** | 5 closure beats: kernel soundness (R1), trait-bound spike (R2), morph excision spec, frontend + backend colocation manifests | [`evidence/kernel-soundness-closure.md`](evidence/kernel-soundness-closure.md) et al. | **95%** authoring-time |

**Convergence arithmetic** (full record: [appendix E](appendices/E-convergence-record.md)):
72 → 90 (`72 + 9 prototypes + 8 deploy + 3 cross-repo − 2 reconciliation debt`) → 91 (`90 + 4 owner answers + 3 compositions − 3 kernel-P0 − 1 B1 − 1 design residue − 0.5 service − 0.5 build churn`) → **95** (`91 + 3 R1 closed: the 3-line ac3 fix verified sufficient against the entire refuting corpus + 1 R2 closed: ThreadSafe bound honored csp-side, zero bbnf edits`). The last 5 points are post-implementation gates by construction—earned only by running the waves below.

**The P0 that shaped the campaign**: `ac3_from_variable`'s `Revision::Unsatisfiable` arm returned without pushing the constraint scope onto the undo `Trail`—prunes leaked into sibling branches, yielding silent false-UNSAT (26/113 corpus boards) and silently dropped solutions under `Pruning::Ac3` enumerate (queens8 → 45 or 5, not 92). Found independently by three Pass-3 agents; fixed and verified sufficient in Pass 4 (0/113, 92/14200, 0 completeness violations across 170 parity rows, `time_sudoku` byte-identical, revert-controls both directions). The fix ships inside [`artifacts/composed-csp-solver-v2.tgz`](artifacts/composed-csp-solver-v2.tgz)—W1's seed.

---

## 2. Wave index

Dependency notation: `←` requires. W5∥W6 run concomitant per owner ratification. Full specs in [`waves/`](waves/).

| Wave | Scope (one line) | Depends | Headline gate |
|---|---|---|---|
| [W0](waves/W0-build-restoration.md) | CI re-enable (amended gate set incl. maturin-wheel pytest, queens-bench smoke, twiggy budgets), git hygiene (untrack 11,406 files), scripts, worktree-provisioning fix | — | all lanes green on the composed tree; clean `git status`; fresh-clone build |
| [W1](waves/W1-kernel.md) | Land composed v2 tree (kernel + soundness fix + invariance tests + py/ + ThreadSafe bound); fast-follows: `backjumping` deletion, `DomWdeg→Mrv`, `lib.rs` split | ← W0 | 0 completeness violations; 0/113 false-UNSAT; queens 92/14200; `time_sudoku` byte-identical |
| [W2](waves/W2-gac-search.md) | GAC default-ON confirmed; builder `AcFc→Ac3` + morph-lazy; chs-driver explicitly deferred; solver excisions | ← W1 | 13.4× corpus aggregate ±10%; proptest 6×256 green; `stress_n6` ≥8× |
| [W3](waves/W3-zero-alloc-profiles.md) | Zero-alloc verification on the landed tree; build-posture per the T15 refutation (no `lto=fat`; mimalloc gated on real-workload A/B + allocator-conflict fix) | ← W1 | allocs −47.8/−77.8/−78.2% reproduced; panic contract both directions |
| [W4](waves/W4-service-taxonomy.md) | FastAPI DI/envelope rebase; backend colocation `games/{sudoku,futoshiki}/`; CancelToken + `max_solutions` cap; N=5 policy; data ownership → `csp-solver/data/` + `include_dir!` | ← W1 | taxonomy smoke live (7 codes, fault-injected); typed exceptions end-to-end; docker wheel build |
| [W5](waves/W5-deploy-a.md) | Deploy Option A: CF Pages `_redirects`/`_headers`, small API origin, owner DNS actions; FastAPI = hardened reference | ← W4 | DNS clean; `/health` ~10 ms steady-state |
| [W6](waves/W6-deploy-c.md) | Deploy Option C: wasm `sudoku.rs` split + budget-fix + Worker harness; publish `@mkbabb/csp-solver-wasm`; hardened difficulty test same-commit | ← W1; ∥ W5 | 0/26 native↔wasm parity; lean ≤93 KB; 16×16-hard off-main-thread, chains=1 |
| [W7](waves/W7-frontend-topology.md) | `src/pencil` + `src/games/{sudoku,futoshiki}` topology per the fe-colocation manifest—**pencil/games naming CANONICAL**; the composed diffs' `sudoku/`+`skin/` naming is superseded (mapping stated) | ← W0 | `vue-tsc` 0; ESLint boundary 3-probe verified; build + smoke green |
| [W8](waves/W8-animation-gestalt.md) | Grain hoist, unified scheduler + BoilDivider migration, animation-vendor bucket, celebration beats 1–3 + 4th workstream, dasharray fix | ← W7 | chains=1/subscribers=10; 77 s stress flat; −72.9% raster; celebration ≤3.2 s at chains=1 |
| [W9](waves/W9-design.md) | Pure-pencil implementation (cadence bands, error fictions, tokens, a11y) + union adopt-partial (washi, hold-to-peek sans `backdrop-filter`, **PRT fix blocking**, vellum cut) | ← W8 | SSIM ≥0.98 settled/DPR≥2; PRT re-capture shows complete key; flip-test discipline |
| [W10](waves/W10-futoshiki.md) | Futoshiki product wave (owner-committed): F1 config fix, generation, adjacency validation, PyO3 + wasm + route + frontend; v1 = N=4–7, no difficulty tiers | ← W1, W4, W7, W9 | G0–G6 verbatim from the wave spec |
| [W11](waves/W11-wasm-morph.md) | Morph pre-excision prep (registry-dep verify, `point_pairs`, wasm tests) then excision to sibling repo `mkbabb/morph`; directory `morph-wasm/`, crate + npm name frozen at `morph` | phase 1 ← W2; phase 2 ← W12 | registry-only scratch build green; `jq` npm-name assertion in CI; csc411 workspace clean post-cut |
| [W12](waves/W12-release-train.md) | One ratified cross-repo window: csp-solver 0.2.0, pencil-boil 0.5.0→0.6.0, sudoku `^0.6.0` bump + scheduler-deletion tripwire, morph republish, bbnf sync-gate `--verify` + coordinated skinny edit | ← W1/W2, W7/W8, W11 ph.1 | both consumer workspaces compile; grep gate on `boilScheduler.ts`; no partially-migrated states |
| [W13](waves/W13-docs.md) | Docs rewrite: the doc-truth ledger—every number re-derived from a campaign artifact; README keeps its archaic voice, CLAUDE.md files go pithy | last | every cited number traces to an evidence file |

---

## 3. Owner-decision ledger

Each: the decision, the evidence, the recommended default. Everything else in this tranche is settled.

| # | Decision | Evidence | Recommended default |
|---|---|---|---|
| OD-1 | **Union final aesthetic call** — keep or drop the dark-mode laminate rim (the only remaining `backdrop-filter` question) | [`artifacts/union-screenshots/union-light-held-board.png`](artifacts/union-screenshots/union-light-held-board.png) (no visible sheet) vs [`union-dark-held-board.png`](artifacts/union-screenshots/union-dark-held-board.png) (faint rim); feature worth: [`composite-peek-light.png`](artifacts/union-screenshots/composite-peek-light.png)/[`composite-peek-dark.png`](artifacts/union-screenshots/composite-peek-dark.png) + [`motion-strip-laminate.png`](artifacts/union-screenshots/motion-strip-laminate.png); soul safety: [`composite-idle-light.png`](artifacts/union-screenshots/composite-idle-light.png)/[`composite-idle-dark.png`](artifacts/union-screenshots/composite-idle-dark.png) (SSIM 1.00000 backing, [`evidence/union-verdict.md`](evidence/union-verdict.md) §2); vellum is *not* taste—[`pencil-light-idle-panel.png`](artifacts/union-screenshots/pencil-light-idle-panel.png) vs [`union-light-idle-panel.png`](artifacts/union-screenshots/union-light-idle-panel.png) settles the cut | Ship the no-`backdrop-filter` build; recover the dark rim as a static `box-shadow`. Deletes the app's only glass surface and the whole UD4/cross-engine question ([`evidence/synthesis-pass3.md`](evidence/synthesis-pass3.md) §3) |
| OD-2 | **`SvgFilters.vue` placement blessing** — `pencil/chrome/` vs bare `pencil/` root | [`evidence/fe-colocation-manifest.md`](evidence/fe-colocation-manifest.md) §7.1—the manifest's most contestable call, flagged not silently picked | `pencil/chrome/SvgFilters.vue` (fold into the most general enumerated bucket; don't invent an unrequested one) |
| OD-3 | **Morph npm-name confirmation** — directory renames to `morph-wasm/`, Cargo package + npm name stay `morph`/`@mkbabb/morph` | [`evidence/morph-excision-spec.md`](evidence/morph-excision-spec.md) §2.3, risk R1—a literal crate rename silently republishes as `@mkbabb/morph-wasm`, breaking bbnf-buddy at runtime | Directory-only rename; freeze the package name; CI `jq` assertion guards it. Override only with a deliberate deprecation/redirect plan |
| OD-4 | **Cloudflare CNAME deletion** (ratified 2026-07-04; needs execution) — delete dangling `api.csp-solver.babb.dev`; also resolve the NXDOMAIN legacy host `mbabb.friday.institute:1022` | Pass-1 G5 (P0, takeover shape); re-verified live one month later ([`evidence/synthesis-pass2.md`](evidence/synthesis-pass2.md) D8) | Delete the record now—owner account action, blocks nothing else in W5 |
| OD-5 | **API-box choice for Option A** given the friday.institute NXDOMAIN | Deploy pricing: A ≈ $0–5/mo, C $0 marginal ([`evidence/synthesis-pass2.md`](evidence/synthesis-pass2.md) D8, Q1) | Small always-on box (Fly-class, ~$2–5/mo) for N=5-Easy + past-UI-ceiling traffic; W6 (C) retires the rest |
| OD-6 | **Release-window calendar commitment** — the one coordinated window is ratified as a shape; it needs a date | [`waves/W12-release-train.md`](waves/W12-release-train.md); single-maintainer constellation, four repos keyed off `^0.6.0` | Pick one window after W7/W8 gates go green; drips multiply partially-migrated states |
| OD-7 | **The one-line skinny edit authorization** — append `..Default::default()` to `bbnf-lang/skinny/crates/passes/src/decision_csp.rs:85`'s exhaustive `SolveConfig` literal (B2; no csp-side fix exists—`#[non_exhaustive]` breaks it *harder*) | [`evidence/constraint-trait-bound-spike.md`](evidence/constraint-trait-bound-spike.md) §7—verified in the mirror (compiles + runs, `solutions: 1`) | Authorize; land locally in bbnf-lang inside the never-push discipline, in the W12 window |
| OD-8 | **Futoshiki navigation shape** — in-app puzzle-type selector vs first-ever router | [`evidence/futoshiki-wave-spec.md`](evidence/futoshiki-wave-spec.md) §2.4—"no router, no state library" is a stated architectural convention; a `/futoshiki` path is an unstated reversal | In-app selector swapping `SudokuBoard`↔`FutoshikiBoard`; no `vue-router` |

---

## 4. Binding precepts

These bind every wave. They restate—not reinterpret—the owner's words. The full canon is vendored at [`docs/precepts/`](../../precepts/) (git submodule, `github.com/mkbabb/precepts`).

**Ratifications (2026-07-04)**: deploy Options **A and C concomitant** (legacy API host `mbabb.friday.institute:1022` is NXDOMAIN—owner infra action); **FastAPI kept as hardened reference**; **Futoshiki is a committed product wave** ([`evidence/futoshiki-wave-spec.md`](evidence/futoshiki-wave-spec.md)); **one coordinated cross-repo release window**; delete the dangling `api.csp-solver.babb.dev` CNAME (owner Cloudflare action); **NEVER push bbnf-lang origin** (crates.io identity, 73 commits stale).

**Edict (2026-07-05)**: recursive colocation for ALL dirs, frontend and backend, idiomatic per language; long-running flat dirs always broken into encapsulated modules; the pencil/animation layer is **`src/pencil`—never "skin"** (one UI, no multiple skins), decoupled from `src/games/{sudoku,futoshiki}` via `@pencil/*`/`@games/*` aliases; **games import pencil, never the reverse, never each other**; git hygiene (untrack the 11,406 node_modules/dist files); morph renamed + excised per [`evidence/morph-excision-spec.md`](evidence/morph-excision-spec.md).

**Aesthetic mandate (non-negotiable)**: the hand-drawn storybook soul—Yoshi's-Story crayon palette, wobbly pencil grid, hand-glyph digits, orange-sun mascot. Stationery fiction for any union element (every translucent surface names its physical object). Parameters come from [`evidence/design-refinement.md`](evidence/design-refinement.md) (pure pencil) and [`evidence/design-union.md`](evidence/design-union.md) (union tokens). Union disposition: **adopt-partial** per [`evidence/union-verdict.md`](evidence/union-verdict.md) §8—washi tooltip + hold-to-peek function (no-`backdrop-filter` build) + AttributionCard a11y fix severed as pure-pencil; vellum cut affirmatively; gleam deferred to the celebration timeline; **blocking before hold-to-peek ships: the AnswerKeyLaminate PRT opaque-render must show the full solution** ([`artifacts/union-screenshots/prt-light-held-board.png`](artifacts/union-screenshots/prt-light-held-board.png) is the defect).

**Standing engineering rules** (earned by campaign evidence): any `SolveConfig`/`SolveStats` field change sweeps all exhaustive literals or uses `..Default::default()`; `cargo test --workspace` between every integration step, never per-crate; diffs targeting composition-deleted files are **ported, not applied**; post-move reconciliation = the union of patch file lists **plus** every new file the move itself created touching the same primitive ([`evidence/fe-composition.md`](evidence/fe-composition.md) §4c); `max_solutions=1` under `Ac3` is a satisfiability probe, not a canonical-solution selector ([`evidence/kernel-soundness-closure.md`](evidence/kernel-soundness-closure.md) §7.2).

---

## 5. Artifact map

**[`evidence/`](evidence/)** — verbatim copies (unmodified) of the load-bearing campaign reports:

| File | Role |
|---|---|
| `synthesis-pass1.md` / `synthesis-pass2.md` / `synthesis-pass3.md` | The synthesis chain: 72% → 90% → 91% |
| `kernel-soundness-closure.md` | R1 closed—3-line ac3 fix verified sufficient (96%) |
| `constraint-trait-bound-spike.md` | R2 closed—ThreadSafe cfg-gated marker, B1 honored csp-side (95%) |
| `morph-excision-spec.md` | W11's spec (90%) |
| `fe-colocation-manifest.md` | W7's path authority (88%)—pencil/games canonical naming |
| `be-colocation-manifest.md` | W1/W4/W6 colocation authority (88%) |
| `futoshiki-wave-spec.md` | W10's spec, incl. the F1 config-fix precondition |
| `design-refinement.md` | W9's pure-pencil spec |
| `design-union.md` / `union-prototype.md` / `union-verdict.md` | The union track: spec → build → adopt-partial verdict |
| `fe-composition.md` | The frontend integration rehearsal (93%)—corrected apply order |
| `kernel-behavior-preservation.md` | The critique that refuted "behavior-preserving" and found the enumerate drop |

**[`artifacts/`](artifacts/)** — seed material:

| File | Role |
|---|---|
| `composed-csp-solver-v2.tgz` | **W1's seed** — composed tree + soundness fix + invariance test + py/errors reconciliation + wasm `pkg/` (155 entries; 176/0 tests) |
| `kernel-soundness-closure.diff.gz` | Full `91bb8b0` → v2 delta (6,965 lines) for review |
| `constraint-trait-bound-spike.diff.gz` | ThreadSafe marker + ac3 fix (81 lines; apply only the `traits.rs` hunk onto v2—the ac3 hunk is already in) |
| `composed-rust.diff.gz` | Pass-3 composed Rust delta — **superseded by the v2 tarball** (carries the pre-fix P0); historical reference only |
| `composed-frontend.diff.gz` | W7/W8's content source — **paths superseded**: authored against `sudoku/`+`skin/`; re-author at `games/sudoku/`+`pencil/` per the manifest |
| `composed-frontend-with-union.diff.gz` | Same, + union variant — W9's content source, same path caveat; `skin.ts` and vellum hunks are cut, not ported |
| `parity_probe.rs` / `gac_ab_corpus.rs` | W1's verification probes (170-row parity matrix; 113-board corpus) |
| `difficulty_parity.hardened.rs` | W6's hardened two-test—lands in the same commit as `wasm/src/sudoku.rs` |
| `union-screenshots/` | The 10 decisive captures for OD-1 (curated from 54). Committable only via `docs/tranches/.gitignore` (`!**/*.png`)—the root `*.png` mask otherwise drops all 10 on `git add`; the negation rides the tranche commit and W0's hygiene step preserves it |

**[`appendices/`](appendices/)**: [A — excision ledger](appendices/A-excision-ledger.md) · [B — prompt recap](appendices/B-prompt-recap.md) · [C — SOTA adoption](appendices/C-sota-adoption.md) · [D — deferred fold-in](appendices/D-deferred-foldin.md) · [E — convergence record](appendices/E-convergence-record.md).

Scratchpad artifacts not copied here (diffs for grain/scheduler/two-layer/morph-lazy, probe outputs, fusion-bench traces) live in the campaign scratchpad under `grand-audit/pass{1,2,25,3,4}/`; each wave file names the ones it seeds from. If the scratchpad is gone, every such diff is re-derivable from its report—the reports are all in `evidence/`.
