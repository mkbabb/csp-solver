# Appendix A — The unified decision set, kill ledger, KISS rejections

Every row from both prior syntheses, dispositioned once, from the grand reconciliation (pass-3) verbatim. Sources: **A** = audit synthesis §, **P** = pass-2 (T/K/RES), **G** = pass-3 lane, **ballot** = owner 2026-07-10. Legend: ADOPT (wave-homed) · DONE (landed/verified, no action) · REJECT · CLOSED (permanent recorded disposition) · DISCHARGED (ballot-answered).

---

## 1. Python surface + packaging (ballot Q1 + Q2 stamps)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| py maximal prune: getters/aliases/wrappers + `solve_sudoku_board` + `template_count` + `PropagationStrategy` + `propagate_with`; `sudoku_api.rs`→`py/sudoku.rs` + parity retarget + A21 co-edits + A6-D3 comment | A§2.2-S3, P-T3/K40, ballot Q1 | **ADOPT (ratified, maximal)** | W3 |
| `futoshiki_api.rs` | A§2.2-D2, P-K12/RES-1, ballot Q1 | **DISCHARGED → REMOVE** | W3 |
| Hand stub, `__all__`=15 as built, 135 lines; `py.typed`; pure-Rust layout auto-detect; stubtest flag-free + one-regex allowlist + module-name tripwire | P-T3/K31/K32, A§2.2-S7 | **ADOPT as built** (no re-derivation — Q1 opt 1) | W5 (lands), W3 (contents frozen post-prune) |
| abi3-py310 CI-only (opt-in feature, one cp310-abi3 wheel, 3.10/11/12 import+solve); abi3t dropped; no PyPI | P-T3, ballot Q1 | **ADOPT** | W5; bbnf `--verify` py stage re-run against the abi3 build (P-RES-4) |
| pyproject 0.2.0→0.3.0 interim stamp (live drift at HEAD, G6 §1); version-triple (crate+pyproject+wasm) → 0.4.0 together | P-T8/A2-2, G6 | **ADOPT** | W2 (interim), W3/W4 (0.4.0) |
| maturin `-i` interpreter pin (cp314 trap) | G6 (NEW) | **ADOPT** | W3 gate text + CI py-runtime |
| npm `@mkbabb/csp-solver-wasm` 0.2.0→0.4.0 BREAKING stanza (published 0.2.0 is FULL — K29; must-not-remain-0.2.0) | P-T1/K29/K30 | **ADOPT** | W3 |
| `#[pyclass(module=…)]` repr fix; runtime PRT sample | P-RES-8 | **CLOSED (declined, cosmetic)** | — |
| `py/common.rs` seam (R9) | A§3, P-RES-7 | **ADOPT (post-prune recount, adopt-with-enums or drop)** | W5 |
| L25-17 `optimization_mode` off py wire | A§2.6 | **CLOSED (note → permanent rationale)** | W3 |

## 2. Core engine structure (ballot Q2)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| Pub sweep **12+2+1** ("13" dead everywhere — K28); adjacency relocation (pure R100); green at real HEAD in worktree, full merge bar incl. wasm lane | P-T6/K28, A§2.2-S9, G5 (external-consumer clean) | **ADOPT (ratified 0.4.0)** | W4 |
| T9 sequencing: the 2 removals are `-D warnings`-forced by the demotions — ride the W4 commit or land strictly before | P-T9 | **ADOPT (DAG constraint W3→W4)** | W3/W4 |
| `propagate_stratified` REMOVE + scoped backlog item (memo as spec) | A§2.5-K1, ballot Q2 | **DISCHARGED → REMOVE** | W3 (removal), WGATE (backlog item filed) |
| `CspError::Timeout` + `CspTimeoutError` RESERVED (`// reserved: no constructor until cancel-driver`); delete the 2 skipped py tests | ballot Q2, R-3, G6 | **DISCHARGED → RESERVE** | W4 |
| `gac/mod.rs` split: seam = `gac/scratch.rs` (≈130 LOC scratch-pool, `pub(super)`, mod.rs→≈425) — NOT Tarjan (already in `matching.rs:102`, K33) | P-T6/K33, A§1.1 (the one R3 regression) | **ADOPT (corrected seam)** | W4 |
| `search.rs` 504 L: **WAIVER** (split forces the private kernel to `pub(super)` — an encapsulation regression; single-reason-to-change text settled) | P-T6, A Q8 | **CLOSED (waiver, no owner row needed)** | W4 (waiver text lands) |
| `wasm/src/errors.rs` extraction (shared `coded_error`, closes `error.rs:19` dangling ref + futoshiki→sudoku back-dep) | A§2.2 (A21-S5) | **ADOPT** | W4 |
| `ImplicationConstraint` keep-pub + in-repo test (10 tests, built + count-confirmed) | A§2.2 (A21-S6), P-T2 | **ADOPT (lands from worktree)** | W4 |
| S3 unified Constraint trait FOLD-EVALUATE — through the ThreadSafe/sync-gate tripwire, never around it | A§2.6 (L25-04) | **ADOPT** | W4 |
| `Csp::adjacency()` accessor kill (3 L; field stays) | A§2.5 (A15-K2) | **ADOPT** (sequence with the relocation) | W4 |
| `cargo doc` pre-broken at HEAD (20 errors, CI never runs it) | P-T6/RES-6 | **ADOPT — option (a)**: `-A private_intra_doc_links` internal-doc invocation + fix `invalid_html_tags` (wave-level call, not owner) | W4 |
| isomorphic.rs + `full-mirror` excise, `default=["assignment"]`, corrected co-edits incl. `ci.yml:243,302-303`; rebuild pkg/ + re-measure | A§2.2-S1, P-T1, G5 (morph never touches it) | **ADOPT** | W3 |
| Stale examples `parity_probe.rs`/`alloc_count.rs` (firm), `probe_futoshiki_gen.rs` (soft) — ~626 L | A§2.5 | **ADOPT** | W3 |
| L25-02/03/05/07 speculative forward-decl note excisions; M4 lift stays parked (supply side healthy — G3 §2b) | A§2.6, G3 | **ADOPT (notes die; park stands)** | W3 |
| bbnf combined-diff gate: both arms green, nil differential; re-run at merged HEAD + once against abi3 | P-T2/RES-2/RES-4 | **ADOPT (in-wave re-run)** | W3, W4, W5 gates |

## 3. Performance (engine + FE)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| CSR adjacency + Vec-indexed warm cache + `assigned_ns` bitset (A18 ROW-1/7) | A§2.3 | **ADOPT** — quiet-box discipline + node-count oracle per R-12 | W6 |
| GAC A/B bench + futoshiki bench + `gac_ab_corpus` 0/50 + node-count CI smoke (ROW-3); gac_alldiff differential oracle (L25-20); futoshiki correctness probe (G13); lean-band erosion stamp (ROW-6) | A§2.3/§2.6 | **ADOPT** | W6 |
| GAC on/off gate re-litigation (ROW-2) | A§2.3 | **REJECT (fresh evidence; default-ON stands)** | KISS ledger |
| mimalloc (ROW-4/L25-13) / PGO (L25-14) / opt-level=s (ROW-5) | A§2.3/§2.6 | **CLOSED (defer-closed, recorded)** | WGATE record |
| A17 P1 worker/wasm prewarm + preload injection; P5 font preload | A§2.3, G7 (premise structurally confirmed live) | **ADOPT** — payoff sized against built `dist/` in-wave | W8 |
| A17 P2+P3 `generateCellRects` extraction + LRU cache (+ the memoized-regen straddle, same fix) | A§2.3/§2.6, **G7 MEASURED** (99–103 ms @4×, the only >100 ms gesture) | **ADOPT (measured target; gate = worst frame drops below the P2 band, `probe-felt.mjs` is the instrument)** | W8 |
| **NEW: marks/peek 16×16 mount burst** (~2.7k nodes, 87–91 ms @4×) | **G7 (new row)** | **ADOPT** — same idle-chunk/cache class, adjacent to P2/P3 | W8 |
| A17 P4 Rolldown chunk pathology (`advancedChunks` re-derivation) | A§2.3, G7 (invisible on dev graph — gate runs on preview build) | **ADOPT** | W8 |
| A17 P6 shared wasm compile | A§2.3, R-2(k) | **DROP (KISS)** | ledger |
| A17 P7 / A9 / G8-H2 `.wasm` doubled Cache-Control + false "merges over" comment (now live-proven) | A§2.3/§2.7, G8 | **ADOPT (trivial)** | W2 |
| Solve / generate felt paths | G7 | **DONE (measured smooth; correctly unranked)** | — |
| Criterion `pre-t3` baselines; assignment A/B owned by the hungarian lane, quiet | G6 | **ADOPT (banked / in-wave)** | W6 / W5 |

## 4. Library (ballot-adjacent; all census gates now closed)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| `hungarian` → hand-rolled O(n³) Kuhn-Munkres (proptest oracle) | A§2.4, **G5 UNBLOCKED (morph clean, two independent walls)** | **ADOPT** | W5 |
| `pathfinding::kuhn_munkres` alternative | A§2.4 | **REJECT** | ledger |
| criterion `html_reports` drop | A§2.4 | **ADOPT (low)** | W5 |
| `@lucide/vue` → two inline pencil-register glyphs; `autoprefixer` verify-then-drop; direct `esbuild` devDep drop | A§2.4 | **ADOPT** | W5 |
| knip in the frontend CI lane (subsumes A16 K3/K4 durably) | A§2.4 | **ADOPT** | W5 |
| `@vueuse/core`, `vite-plugin-pwa`, `include_dir`, iai+criterion pair, proptest, wasm glue, serde gating, pencil-boil | A§2.4 | **DONE (keep, earned)** | — |
| keyframes.js re-adoption | A§2.4, **G3 (source-verified: covenant + additive history; re-entry = capability gap only)** | **CLOSED-REJECT, strengthened** | ledger |
| pencil-boil pin | G3 | **DONE** (lockfile sha512 = the pin; rev `106a5a2`) — sibling tag `v0.7.0` = owner reminder | WGATE (reminder carried) |
| `useBoilFrames`/`useBoilCache` adoption for the gridPaths/mulberry32 straddle (L25-19) | A§2.6, G3 §2d (supply confirmed at 0.7.0) | **ADOPT** | W7/W8 |

## 5. Frontend structure (ballot Q3) + legacy kills

| Row | Sources | Disposition | Home |
|---|---|---|---|
| **Three-home rule** ratified: NEW `src/games/shared/` (peek, scene.css, types, constants, + relocate `useUndoHistory`/`usePencilMarks`, + `useButtonAnimation`); `celebration.ts` stays pencil (census-proven, K35); `useTheme` stays `src/composables/`; ~10-line eslint tripwire | P-K35/K39, ballot Q3 | **DISCHARGED → ADOPT** | W7 |
| `SudokuGame.vue` extraction (App.vue→pure shell) + `useAnswerKeyPeek` + scene CSS `<style scoped src>`; eager/lazy asymmetry ratified; structural-mirror never byte-mirror | A§2.2-S8, P-T4 | **ADOPT** | W7 |
| `awaitTickBeforeActivate` = proven no-op → delete, composable ships branch-free (K19→UNNECESSARY; K36 wording fix) | P-T4 | **ADOPT** | W7 |
| `SolveState`/`SolveStats` twins → `games/shared/types.ts` hoist; `.board-cells` shared constant; scene.css class-contract header | P-T4 | **ADOPT** | W7 |
| God-composable extractions (50/81-line pulls from the 482/472 twins) + **subdir barrels** (`@pencil/chrome`, `@pencil/grid` — root barrel dead, K41) + depth lint with flat-config append discipline; 6 external deep sites (K37) | P-T5/K37/K38/K41 | **ADOPT** | W7 |
| `apiError.ts`→`classifyError.ts` rename + K1b four-variant prune; K1a `'UNSATISFIABLE'`→`'UNSAT'` ×2 (1-line correctness) | A§2.5 (A16), P-T5 | **ADOPT** (K1a rides W3's mechanical batch; rename+prune ride W7) | W3 / W7 |
| A16 K2a `MOTION` const delete; K2b `YOSHI_COLORS` **ADOPT-AS-WIRE** (F7 consumes it); `.fira-code` orphan + 11 type exports (knip is the durable gate); A6-D2 `.env.example` reduce/delete + `FRONTEND_PORT` truthing | A§2.5 | **ADOPT** | W3 (kills), W9 (wire) |
| `#storybook-texture` filter def | R-4 (G3+G10) | **KILL** | W3 |
| Icons regroup `pencil/chrome/icons/`; e2e sweep (`round9`→feature register, artifact names, `.mjs` outlier) | A§2.2 (A22-2c/3) | **ADOPT** | W7 |
| Filter-subsystem `chrome/`+`dev/` merge | A§2.2, R-2(j) | **REJECT (boundary load-bearing)** | ledger |
| index.css @layer partials (C1/C2/Q9/R8) | A§2.2/§2.6, P-T7, **ballot Q4** | **DISCHARGED → DROP, HELD-again** — record lands, monolith stays, byte-identity bundle + font-URL guard banked, same-trigger reopen | W7 (record) |
| Playwright `:3000` hardening + `hmr.port` pin review; lane briefs name the app port | G6/G10 (NEW) | **ADOPT** | W7 (+ process note) |
| Glyph/grid pattern consistency, `pencil/types.ts` colocation, `pencil/README.md` | A§2.2 (A22-2d) | **ADOPT (polish tier, last-or-defer)** | W7 tail |
| Composable-home rule documentation (Q7) | A§2.2, ballot Q3 | **DISCHARGED** (the three-home rule IS the documented rule) | W7 |

## 6. Design (F1–F8 + A23, as G10-verified)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| F8 gold-as-fifth-crayon, two-tier + red ink, "earned light" grammar, **amended by the F7 re-fold** (F7's variant family IS step-3's felt heart; dark-mode exception fixes the maroon read); F7's storybook citation struck (R-4) | A§2.1, G10 §5 | **ADOPT (capstone)** | W9 |
| F2-C on A's substrate: token truthing (`--color-gold-star` real gold per theme), collision killed by geometry, merged margin line, felt heart bounce+blink, PRM gate on `index.css:302` | A§2.1 | **ADOPT** | W9 |
| F2 star form | R-2(h) | **default INLINE star glyph** (F2-C primary text); corner foil = named alternative; owner veto at W9 gate | W9 |
| F3 completion-block hoist + MarginNote `meta` + caption rung + ink-level color-mix + drop `user-select:none`; kills the statLine twins | A§2.1 | **ADOPT** | W9 |
| F7 CrayonHeart variant family + `heartPaths.ts` colocated + YOSHI_COLORS wired (supersedes A16-K2b kill) | A§2.1 | **ADOPT** | W9 |
| UI-10 solved-rainbow deepening (light theme, solver-ink register) | A§2.1 | **ADOPT (design-resolve)** | W9 |
| F4 slight pass W1/S1–S3/M1–M3 + filter-on-both-icons — **live-verified**; S4/M4 optional; **M4 DROPPED** (refuted-as-stated, R-9); S5 = one-line pencil-boil upstream edit | A§2.1, G10 §1 | **ADOPT (M4 dead)** | W10 |
| F5 "Set and Rise" ≈1.25 s Band-D, deferred flip at crossover, star ignite, PRM immediate-flip — premises **live-verified D1–D5**; wording: flip = following microtask ~4 ms | A§2.1, G10 §2 | **ADOPT** | W10 |
| F6 page-turn ≈1.05 s + D1 menu-leave + D2 `animatingCells` clear + D3 chunk preload — **live-verified incl. throttled void** (`first-select-void-400ms.png` = the W7 e2e gate exhibit) | A§2.1, G10 §3 | **ADOPT** | W10 (D3 gate exhibit → W7 e2e) |
| F1 px-native HandDrawnOutline + radius-aware wobble + one-edge ownership + R5 transform truthing; every host incl. 375 | A§2.1 | **ADOPT (pixel-measured lane)** | W10 |
| A23 UI-4/5 (touch peek + labels), UI-6 (focus into invisible card), UI-7 (K-peek from cell focus + legend), UI-8/9/11/12 (title/h1, washi collision, futoshiki margin bug, inactive-tab) | A§2.1 | **ADOPT** | W11 |
| UI-13 conflict pedagogy | R-2(i) | **KEEP + say-it hint** (A23's lean); owner veto at W11 gate | W11 |
| Mobile digit pad | A§2.6 | **ADOPT (build-or-formally-scope)** | W11 |
| A24-G10 evidence-footing process rule (tag live-verified vs code-inferred) | A§2.1, G10 §5 ledger | **DONE (ledger authored)** — carry the discipline into wave authoring | all design waves |

## 7. Security (G8) — new since both syntheses

| Row | Disposition | Home |
|---|---|---|
| G8-P2 futoshiki inequality hardening (adjacency + `2·n·(n-1)` cap + dedup + optional raw-length cap) + `types.ts:29-30` doc-truth fix | **ADOPT (LOW, the one finding)** | W11 |
| G8-H1/P1/W1 clean bill (CSP complete, decoders fail-closed 33/33, worker N/A) + H3/H4/P3 INFO notes | **DONE (record the clean bill)** | WGATE record |
| `fuzz.mjs` re-run incl. new bounded cases | **ADOPT (gate)** | W11 gate |

## 8. Doc truth, record, CI (A§2.7 + G6 stamps)

All ADOPT into W2 unless noted: README:113 GAC headline retruthing + Appendix-A blacklist triplet · 0.3.0 publish-status ×2 · CONTRIBUTING restore + wasm LICENSE + install matrix + SHA stamps + em-dash/epanorthosis pass · `gac_ab_corpus.rs` comment · `_headers` wasm stanza (A9/P7/H2, now live-proven) · `tests-py` count stamped (27/2 → **27/0 post-W4**, R-3) · MEMORY live-site reconcile (supersession confirmed) · CI 8→9 lane count + compile-graph dedup + abi3 matrix-collapse scored · A24-G2 evidence policy (47 MB/287 files) + tranche-III evidence dir under it from day one · G6's stamped baseline (rust 151/0/6 across 18 harnesses, py 27/2, e2e 33/33 at the base SHA) is the citable figure set — the stale CLAUDE.md cache (150/17/87,853) is dead · RES-5 memo three-site "13"→12+2+1 edit before archival · RES-6 C5 advisory recorded (stub apparatus kept without PyPI: tests-py + editor types justify it — the recorded call under ballot Q1).

---

## 9. The kill ledger — K42–K49 (continues K1–K41)

| # | Dead claim | Killed by | Replacement |
|---|---|---|---|
| K42 | F7 §1.5 "`#storybook-texture` celestial-used" | G3 (history grep) + G10 (live DOM), independently | Born-dead def; KILL in W3; celestial uses `wobble-celestial` |
| K43 | F4-M4 "incoming moon ghosts over light paper" | G10 (flip ~4 ms, paper snaps frame-1) | Dawn-direction outgoing only, smaller/briefer; row dropped (was optional) |
| K44 | "wasm worker message validation" as a W11 work item (A24) | G8-W1 | Dedicated Worker — no cross-context surface; N/A by construction |
| K45 | Stale CLAUDE.md counts (150/17 binaries/87,853 B) as citable | G6 | 151/0/6 across 18 harnesses; lean 90,602 B source==dist |
| K46 | ":3000 is the app" (lane-brief premise) | G10 §0 + G6 | :3000 = Vite HMR socket (426); the app is the `--port`-bound instance; brief-writing rule adopted |
| K47 | "futoshiki wire boundary rejects non-adjacent pairs" (`types.ts:29-30`) | G8-P2 fuzz | No such rejection at HEAD; W11 makes the doc true by making the code true |
| K48 | K10's residual "full-module byte figures are facts" | P-K30, carried | Transient; re-measure in W3 (unchanged, restated for wave text) |
| K49 | "morph census unknown gates three rows" (A§4-Q3) | G5 | CLEAN — two independent walls; three rows unblocked |

**K28–K41** (pass-2) and **K1–K27** (pass-1) stand as authored; the load-bearing ones carried into wave text: K28 (12+2+1 everywhere), K29 (published npm 0.2.0 is FULL → excision BREAKING), K30 (full-module bytes transient, re-measure in-wave), K31 (stub 135 lines), K33 (gac seam = scratch.rs, not Tarjan), K35 (celebration.ts is pencil-domain), K37 (6 external deep sites), K38 (reduced-motion AE=0 parity bound), K39 (three-home rule owner-ratified), K41 (root pencil barrel dead — subdir barrels).

---

## 10. The unified KISS rejection ledger (standing; nothing re-enters without its named re-entry criterion)

The S10-agg set verbatim: py dir splits · `csp_solver.sudoku` namespacing + mixed layout · declarative `#[pymodule]` · constraint-family subdirs · mod.rs-rename as a wave row · full `packages/pencil` extraction · `pencilConfig.ts` split · isomorphic drift-assertion test · **wasm crate split** (the lean/full boundary is already Cargo features). Plus:

- root pencil barrel (K41, bundle-risky)
- keyframes.js re-adoption (source-verified; re-entry = numeric path morphing / spring physics, never a version number)
- dynamic GAC disable heuristic + a new on/off gate (A18 ROW-2)
- bitset-parallel GAC (user-imperceptible)
- mimalloc / PGO / opt-level=s (defer-closed on evidence)
- `pathfinding` as the LAP replacement
- F5 Alt-A eclipse + Alt-B 3D page-flip · F2-B star scatter · WAAPI third timing authority
- **A17-P6 shared wasm compile** (R-2k; re-entry = a measured duplicate-compile cost at a served size)
- **`chrome/`+`dev/` filter merge** (R-2j; the env-gated boundary is load-bearing)
- index.css partials (**HELD-again**, ballot Q4, same-trigger reopen)
- abi3t (ballot Q1)
- hand-maintained kill lists where knip is the gate
- `#[pyclass(module=…)]` repr churn + runtime PRT sample (RES-8)
- mod.rs flip **as tranche work** (post-tranche follow-up per §5.5)
