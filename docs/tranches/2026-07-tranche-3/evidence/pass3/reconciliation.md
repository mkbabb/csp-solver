# THE GRAND RECONCILIATION — tranche-III, one verdict

**Lane:** reconciliation (core design model) · **Closes:** PASS 3 and the tranche-III authoring loop's investigation phase.
**Inputs:** `audit32/synthesis-path-forward.md` (72%, 13-wave skeleton), `pass2/pass2-agglomeration.md`
(83%, T1–T9 + K28–K41 + RES-1..8), the six pass-3 lane reports (`pass3/{G3,G5,G6,G7,G8,G10}*.md`),
and the **OWNER BALLOT of 2026-07-10 (binding)**: Q1 = no PyPI + maximal prune (futoshiki_api.rs
REMOVED, `solve_sudoku_board` + `template_count` pruned, `PropagationStrategy` + `propagate_with`
removed, abi3 CI-only, stub `__all__`=15 as built); Q2 = core **0.4.0 ratified** (12+2+1,
`propagate_stratified` removed with a backlog item, `Timeout` RESERVED, stamps advance together);
Q3 = **three-home rule ratified** (`games/shared/` + undo/marks relocation + the eslint tripwire);
Q4 = index.css **DROP, HELD-again** (byte-identity proof banked).
**Posture:** honesty over momentum. Where the two syntheses conflict, the ballot and fresh pass-3
evidence decide; where neither speaks, the corpus's own lean plus the KISS bar decides, and every
such default is named as a default with its override window.

---

## 0. RECONCILIATION MOVES (fresh this lane — each resolves a cross-corpus conflict or gap)

**R-1 — The ballot discharges T3-W1.** All four pass-2 questions answered with the recommended
options. Consequences, folded everywhere below: audit W1 rows (a)/(b)/(c)/(d)/(e)/(g) are ANSWERED
(futoshiki_api REMOVE; propagate_stratified REMOVE + backlog item; 0.4.0 at 12+2+1;
no PyPI/abi3-CI-only; Timeout RESERVED; index.css DROP-HELD-again); pass-2 RES-1 closes; RES-3
(stub re-derivation) is **moot** — Q1 = option 1, so P2-L4's hand stub, `__all__`=15 (135 lines,
K31), and the P2-L2 combined diff stand **as built**, no re-derivation branch executes. The audit's
§2.2-D2 conflict (A21 "futoshiki_api ready to author" vs agglomeration K12) resolves in the
agglomeration's favor procedurally and in A21's direction substantively: the owner voted REMOVE.

**R-2 — The five audit-W1 rows the ballot didn't cover, closed by corpus lean + KISS (each an
owner-override window at its wave gate, none blocking authoring):**
- **(f) mod.rs → self-named-file flip:** CLOSED per pass-2 §5.5's own recommendation — a
  **post-tranche one-commit follow-up** with `clippy.self_named_module_files`; not tranche work.
- **(h) F2 star form:** default **inline star glyph** in the margin-note line — it is F2-C's
  primary text ("the star demotes to punctuation … the inline star is the subtler read",
  F2 §Formulation-C); the corner foil sticker stays the named alternative. W9 resolves in-wave
  under the F8 grammar; owner veto window = the W9 gate review. Both forms kill the collision
  (F2 §1.1), so no correctness fork rides on the choice.
- **(i) A23 UI-13 conflict pedagogy:** default **KEEP + say-it** — A23's own text calls the
  grade-after-Solve model "defensible and on-soul" and supplies the fix ("the margin voice hinting
  it — 'mark it and I'll grade'", A23:66-68). W11 authors the hint; the failed-state maroon beat is
  protected (A23:96). Override window = W11 gate.
- **(j) filter-subsystem `chrome/`+`dev/` merge:** **REJECT** — the audit's own adjudication note
  ("blurs the env-gated `dev/` boundary", synthesis §2.2) is the argument; the boundary is
  load-bearing and merging adds nothing. Enters the KISS ledger (§1.6).
- **(k) A17 P6 shared wasm compile:** **DROP** — the row's own framing was "decide-or-drop, don't
  build speculatively"; no measurement demands it. KISS ledger; re-entry criterion: a measured
  duplicate-compile cost at a served size.

**R-3 — Timeout: the ballot's RESERVE supersedes the L25-06/59 binary, and the skipped-test tail
resolves with it.** The synthesis demanded wire-or-excise, "no third defer." RESERVE is neither a
wire nor a defer — it is a **permanent recorded disposition** (variant kept, `// reserved: no
constructor until cancel-driver` note, Q2 verbatim). G6 identified the two py skips as exactly this
pair (`test_budget_exceeded_error_end_to_end` + `test_csp_timeout_error_end_to_end`,
`test_wheel_contracts.py`) and proved "skipped-not-failed at HEAD, so removal loses nothing green."
Under RESERVE the variant has no constructor → the end-to-end tests are unexercisable by
construction → **W4 deletes the two skipped tests**, citing the reserve note as the record. tests-py
goes 27 passed / 0 skipped. The L25-06/59 clause is honored: one resolution, recorded, final.

**R-4 — `#storybook-texture`: settled twice, independently.** G3 (whole-history `git log -S` —
born dead at `3b83133c`, never consumed by any commit on any path) and G10 (live DOM: def present,
0 consumers) both confirm F4 and refute F7 §1.5. The audit's "ADOPT (verify-then-kill)" condition
is **discharged → KILL**, `SvgFilters.vue:163-167`, homed **W3**. F7's felt-nap plan must not cite
the filter as precedent (G10 §6c); no design wave adopts it (G3: F4/F5 rewire celestial to
`wobble-celestial`).

**R-5 — The morph census is CLEAN → three rows unblock at once.** G5: morph's single
`assignment()` call site is unconditionally group-full → it can never reach `solve_lap()`/
`hungarian::minimize` (Wall A, `builder/assignment.rs:340,275-276`); its pin `csp-solver = "0.2"`
can't auto-resolve past 0.2.x anyway (Wall B); its lockfile contains zero `hungarian`; it touches
no demoted symbol and no isomorphic surface. **W5's hungarian→KM swap, W4's pub sweep, and W3's
isomorphic excise all lose their external-consumer gate.** No coordination with morph required.

**R-6 — Audit T3-W0 collapses to a thin anchor.** Its census half is executed: npm tarball (pass-2
T1: published 0.2.0 is FULL, excision BREAKING, 0.4.0 stanza), bbnf paired arms (T2: both green,
nil differential), morph census (G5), baseline three-suite run (G6: rust 151/0/6, py 27/2, e2e
33/33, all exit 0, counts SHA-stamped — A24-G6 and A4-C12 closed jointly), byte anchors (lean wasm
90,602 B source==dist, no drift), criterion `pre-t3` baselines banked. What survives as W0: one
SHA/tree re-confirmation (G6 stamps base `3b75eca2` clean; G7/G10 stamp `5f9980c8`+dirty — a
one-command discrepancy check at wave start), plus the RES-2 re-run *stubs* that each downstream
wave executes itself.

**R-7 — G7 mints one NEW perf row and graduates two.** A17 P2/P3 → **MEASURED** (size-switch
9→16: worst frame 99–103 ms @4×/DPR2, ratio 3.6×, the only >100 ms gesture, the only remount —
the W8 fix target is now a number). **NEW W8 row: marks/peek 16×16 mount burst** (~2.7k mark
nodes, 87–91 ms @4×, ratio 2.7×; a served size; same idle-chunk/cache fix class; A17 never traced
the peek path). P1/P5's premise structurally confirmed (zero preload hints in the served head,
both runs); P4 stays a `dist/`-preview trace — the W8 gate must run against the built artifact,
not the dev server. Solve/generate confirmed felt-smooth — correctly unranked, no action.

**R-8 — G8: one LOW finding enters W11; one A24 concern closes N/A.** G8-P2 (futoshiki inequality
list unbounded/adjacency-unvalidated/un-deduped → reflected render-DoS; contradicts the documented
invariant at `futoshiki/types.ts:29-30`) is the W11 hardening row: enforce orthogonal adjacency,
cap at `2·n·(n-1)`, dedup, optional raw-length cap + strict size guard (G8-P3), fail-closed. CSP
completeness PASS (H1), decoders PASS (P1, 33/33 fail-closed), worker validation **N/A by
construction** (dedicated Worker — no cross-context surface; the A24 concern dies). G8-H2 folds
into the already-dispositioned A9/A17-P7 row, now **live-proven** (doubled `Cache-Control`
captured; "merges over" comment proven false — CF Pages appends). H3/H4 = INFO record lines.

**R-9 — G10 satisfies T3-W10's live-re-probe dependency; one F4 row dies.** F5 D1–D5 + CSS table,
F6 cut + D1–D4 (incl. the throttled first-select void — the ScribbleLoader exhibit), and F4's
geometry/legibility rows all **LIVE-VERIFIED**. **F4-M4 is REFUTED as stated** (theme flips ~4 ms
after click, paper snaps dark frame-1; the moon-on-light exposure exists only dawn-direction,
outgoing, smaller and briefer) — it was already optional → **DROP**, re-arguable only against the
dawn direction. Wording corrections carried into authoring: F5-D3 "instantly" → "following
microtask, ~4 ms"; D2's overlap is front-loaded muddle-then-speck.

**R-10 — G3 closes the sibling-repo questions.** pencil-boil pin already cryptographically
anchored (lockfile sha512 at 0.7.0; local HEAD `106a5a2` *is* the release state; no 0.8 exists);
the one gap is a missing `v0.7.0` tag — a **sibling-repo owner reminder**, not tranche work. M4
sun-glyph supply confirmed exactly as A14-C11 assumed (primitives exported + consumed; composable
deliberately parked — gate correctly unfired both sides, no action). F6's keyframes.js
CLOSED-REJECT now **source-verified** (maintainer covenant: scheduler untouched, three additive
releases, zero signature churn) — re-entry is a capability gap, never a version number. Adjacent:
`useBoilFrames`/`useBoilCache` shipped at 0.7.0 = the supply side for the L25-19 gridPaths
re-point (W7/W8).

**R-11 — Two NEW harness/tooling rows from G6, homed:** (a) **maturin host-interpreter trap** — a
bare build picks host 3.14 and emits an uninstallable cp314 wheel; every wheel-building step (W3
gate, CI py-runtime) pins `-i <tests-py venv python>`; (b) **e2e `:3000` fragility** — playwright's
`baseURL`+`reuseExistingServer` latches onto Vite's HMR socket when the app runs elsewhere (0/33
observed, then 33/33 at :3210); W7 pins `server.port` or asserts the target serves the SPA, and
the `hmr.port: 3000` pin (`vite.config.ts:206-209`) enters the W7 hygiene sweep (G10 §6). Process
rider: lane briefs name the app port explicitly.

**R-12 — Perf-measurement discipline (G6):** the GAC corpus headline swings 10.5–13.8× on the same
binary by machine load alone; node counts are the invariant oracle (40,513→4,678, deterministic).
**W6's before/after runs on a quiet box, asserts on node counts + narrowed minority cost**;
`--save-baseline pre-t3` is banked (note: `cargo bench --workspace -- --save-baseline` fails —
select named bench targets). The W5 assignment A/B baseline is owned by the W5 lane (G6 hit a
pathological 745 s CSP group under load — run it quiet, in-wave).

---

## 1. THE UNIFIED DECISION SET

Every row from both syntheses, dispositioned once. Sources cited as: **A** = audit synthesis §,
**P** = pass-2 (T/K/RES), **G** = pass-3 lane. Legend: ADOPT (wave-homed) · DONE (landed/verified,
no action) · REJECT · CLOSED (permanent recorded disposition) · DISCHARGED (ballot-answered).

### 1.1 Python surface + packaging (ballot Q1 + Q2 stamps)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| py maximal prune: getters/aliases/wrappers + `solve_sudoku_board` + `template_count` + `PropagationStrategy` + `propagate_with`; `sudoku_api.rs`→`py/sudoku.rs` + parity retarget + A21 co-edits + A6-D3 comment | A§2.2-S3, P-T3/K40, ballot Q1 | **ADOPT (ratified, maximal)** | W3 |
| `futoshiki_api.rs` | A§2.2-D2, P-K12/RES-1, ballot Q1 | **DISCHARGED → REMOVE** | W3 |
| Hand stub, `__all__`=15 as built, 135 lines; `py.typed`; pure-Rust layout auto-detect; stubtest flag-free + one-regex allowlist + module-name tripwire | P-T3/K31/K32, A§2.2-S7 | **ADOPT as built** (no re-derivation — Q1 opt 1) | W5 (lands), W3 (contents frozen post-prune) |
| abi3-py310 CI-only (opt-in feature, one cp310-abi3 wheel, 3.10/11/12 import+solve); abi3t dropped; no PyPI | P-T3, ballot Q1 | **ADOPT** | W5; bbnf `--verify` py stage re-run against the abi3 build (P-RES-4) |
| pyproject 0.2.0→0.3.0 interim stamp (live drift confirmed at HEAD, G6 §1); version-triple (crate+pyproject+wasm) → **0.4.0 together** | P-T8/A2-2, G6 | **ADOPT** | W2 (interim), W3/W4 (0.4.0) |
| maturin `-i` interpreter pin (cp314 trap) | G6 (NEW) | **ADOPT** | W3 gate text + CI py-runtime |
| npm `@mkbabb/csp-solver-wasm` 0.2.0→0.4.0 BREAKING stanza (published 0.2.0 is FULL — K29; must-not-remain-0.2.0) | P-T1/K29/K30 | **ADOPT** | W3 |
| `#[pyclass(module=…)]` repr fix; runtime PRT sample | P-RES-8 | **CLOSED (declined, cosmetic)** | — |
| `py/common.rs` seam (R9) | A§3, P-RES-7 | **ADOPT (post-prune recount, adopt-with-enums or drop)** | W5 |
| L25-17 `optimization_mode` off py wire | A§2.6 | **CLOSED (note → permanent rationale)** | W3 |

### 1.2 Core engine structure (ballot Q2)

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
| L25-02/03/05/07 speculative forward-decl note excisions; M4 lift stays parked (supply side confirmed healthy — G3 §2b) | A§2.6, G3 | **ADOPT (notes die; park stands)** | W3 |
| bbnf combined-diff gate: both arms green, nil differential; re-run at merged HEAD + once against abi3 | P-T2/RES-2/RES-4 | **ADOPT (in-wave re-run)** | W3, W4, W5 gates |

### 1.3 Performance (engine + FE)

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

### 1.4 Library (ballot-adjacent; all census gates now closed)

| Row | Sources | Disposition | Home |
|---|---|---|---|
| `hungarian` → hand-rolled O(n³) Kuhn-Munkres (proptest oracle) | A§2.4, **G5 UNBLOCKED (morph clean, two independent walls)** | **ADOPT** | W5 |
| `pathfinding::kuhn_munkres` alternative | A§2.4 | **REJECT** | ledger |
| criterion `html_reports` drop | A§2.4 | **ADOPT (low)** | W5 |
| `@lucide/vue` → two inline pencil-register glyphs; `autoprefixer` verify-then-drop; direct `esbuild` devDep drop | A§2.4 | **ADOPT** | W5 |
| knip in the frontend CI lane (subsumes A16 K3/K4 durably) | A§2.4 | **ADOPT** | W5 |
| `@vueuse/core`, `vite-plugin-pwa`, `include_dir`, iai+criterion pair, proptest, wasm glue, serde gating, pencil-boil | A§2.4 | **DONE (keep, earned)** | — |
| keyframes.js re-adoption | A§2.4, **G3 (source-verified: covenant + additive history; re-entry = capability gap only)** | **CLOSED-REJECT, strengthened** | ledger |
| pencil-boil pin | G3 | **DONE** (lockfile sha512 = the pin; rev `106a5a2`) — sibling-repo tag `v0.7.0` = owner reminder | WGATE (reminder carried) |
| `useBoilFrames`/`useBoilCache` adoption for the gridPaths/mulberry32 straddle (L25-19) | A§2.6, G3 §2d (supply confirmed at 0.7.0) | **ADOPT** | W7/W8 |

### 1.5 Frontend structure (ballot Q3) + legacy kills

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

### 1.6 The unified KISS rejection ledger (standing; nothing here re-enters without its named re-entry criterion)

S10-agg set verbatim (py dir splits, `csp_solver.sudoku` namespacing + mixed layout, declarative
`#[pymodule]`, constraint-family subdirs, mod.rs-rename as wave row, full `packages/pencil`
extraction, `pencilConfig.ts` split, isomorphic drift-assertion test, **wasm crate split**) ·
root pencil barrel (K41, bundle-risky) · keyframes.js re-adoption (source-verified,
re-entry = numeric path morphing / spring physics) · dynamic GAC disable heuristic + new on/off
gate (A18 ROW-2) · bitset-parallel GAC · mimalloc / PGO / opt-level=s (defer-closed on evidence) ·
`pathfinding` as the LAP replacement · F5 Alt-A eclipse + Alt-B 3D page-flip · F2-B star scatter ·
WAAPI third timing authority · **A17-P6 shared wasm compile** (R-2k) · **`chrome/`+`dev/` filter
merge** (R-2j) · index.css partials (**HELD-again**, ballot Q4, same-trigger reopen) ·
abi3t (ballot Q1) · hand-maintained kill lists where knip is the gate · `#[pyclass(module=…)]`
repr churn + runtime PRT sample (RES-8) · mod.rs flip **as tranche work** (post-tranche follow-up
per §5.5).

### 1.7 Design (F1–F8 + A23, as G10-verified)

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

### 1.8 Security (G8) — new since both syntheses

| Row | Disposition | Home |
|---|---|---|
| G8-P2 futoshiki inequality hardening (adjacency + `2·n·(n-1)` cap + dedup + optional raw-length cap) + `types.ts:29-30` doc-truth fix | **ADOPT (LOW, the one finding)** | W11 |
| G8-H1/P1/W1 clean bill (CSP complete, decoders fail-closed 33/33, worker N/A) + H3/H4/P3 INFO notes | **DONE (record the clean bill)** | WGATE record |
| `fuzz.mjs` re-run incl. new bounded cases | **ADOPT (gate)** | W11 gate |

### 1.9 Doc truth, record, CI (A§2.7 + G6 stamps)

All ADOPT into W2 unless noted: README:113 GAC headline retruthing + Appendix-A blacklist triplet ·
0.3.0 publish-status ×2 · CONTRIBUTING restore + wasm LICENSE + install matrix + SHA stamps +
em-dash/epanorthosis pass · `gac_ab_corpus.rs` comment · `_headers` wasm stanza (A9/P7/H2, now
live-proven) · `tests-py` count stamped (27/2 → **27/0 post-W4**, R-3) · MEMORY live-site
reconcile (supersession confirmed) · CI 8→9 lane count + compile-graph dedup + abi3
matrix-collapse scored · A24-G2 evidence policy (47 MB/287 files) + tranche-III evidence dir under
it from day one · G6's stamped baseline (rust 151/0/6 across 18 harnesses, py 27/2, e2e 33/33 at
the base SHA) is the citable figure set — the stale CLAUDE.md cache (150/17/87,853) is dead ·
RES-5 memo three-site "13"→12+2+1 edit before archival · RES-6 C5 advisory recorded (stub
apparatus kept without PyPI: tests-py + editor types justify it — now the recorded call under
ballot Q1).

### 1.10 Kill-ledger addenda (continues K1–K41)

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

---

## 2. THE FINAL WAVE SET — one DAG

Audit T3-W0..W11+WGATE reconciled with pass-2 W-A..W-G. Mapping: W-A→{W1 discharged, W2} ·
W-B→W3 · W-C→W4 · W-D→W5 · W-E/W-F→W7 · W-G→WGATE. W1 is **retired from the DAG** (ballot
2026-07-10 = its output, delivered). Effort: S ≤ half-day-equiv, M = wave-day, L = multi-day.

| Wave | Contents (delta vs audit skeleton in bold) | Effort | Depends | Gate (verbatim-ready) |
|---|---|---|---|---|
| **T3-W0 — anchor** | Re-confirm authoring base SHA + tree state (**G6 `3b75eca2`-clean vs G7/G10 `5f9980c8`+dirty — one `git status && git log -1`**); carry banked evidence (G5 census, G6 logs + `pre-t3` baselines, G7/G8/G10 harnesses); **everything else the audit filed here is DONE** (T1/T2/G5/G6) | S | — | base SHA stamped; evidence dir opened under the G2 policy |
| **T3-W2 — packaging + doc truth** | §1.9 batch; pyproject 0.2.0→0.3.0 interim; `_headers` fix (**now live-proven, G8-H2**); **G6 baseline counts are the stamp source** | S–M | W0 | blacklist grep-zero incl. retired triplet; wheel METADATA inspected; `curl -sSI …wasm` shows single Cache-Control after redeploy (or noted as pending-Pages) |
| **T3-W3 — dead surface (0.4.0 begins)** | S1 isomorphic excise + co-edits; **py maximal prune per ballot Q1 incl. futoshiki_api REMOVE**; `py/sudoku.rs` rename + parity retarget; `propagate_stratified` REMOVE; A15-K2 + stale examples; A16 K1a/K2a/K3 + A6-D2/D3; L25-02/03/05/07 note excisions; **`#storybook-texture` KILL (R-4)**; npm 0.4.0 BREAKING stanza; **T9: the 2 forced removals ride here or in W4's commit, never after** | M | W2 | rebuild pkg/ + re-measure full-module bytes; `maturin build -i <tests-py venv>` wheel + tests-py green; **bbnf `--update && --verify` green at merged HEAD**; stub `__all__`=15 asserts post-prune surface |
| **T3-W4 — core structure 0.4.0** | 12+2+1 sweep + adjacency relocation; `wasm/src/errors.rs`; ImplicationConstraint tests land; **`gac/scratch.rs` split (K33 seam)**; **search.rs waiver text**; **Timeout RESERVE note + delete 2 skipped py tests (R-3)**; S3 trait FOLD-EVALUATE through the sync gate; **version-triple → 0.4.0 together (T8)**; **cargo doc option (a)** | M–L | W3 | `cargo test --workspace` + queens `--test` + `check --features py` + clippy `-D warnings` + `wasm-pack test --node` + the internal-doc invocation; **bbnf gate re-run**; tests-py **27/0** |
| **T3-W5 — library** | hungarian→KM (**G5-unblocked**; quiet-box A/B baseline in-lane per G6); abi3 CI-only + hand stub + stubtest lane + module-name tripwire (**as built, Q1**); **bbnf py-stage vs abi3 build (RES-4)**; criterion `html_reports` drop; lucide-inline + autoprefixer verify-drop + esbuild drop; knip CI lane; **maturin `-i` pin in CI py-runtime (R-11a)**; R9 recount | M | W3 (pruned tree), W0 | `assignment_proptest` green on hand impl; cp310-abi3 wheel + tests-py + 3.10/11/12 import-solve; stubtest fails-loud proof re-shown; knip lane green |
| **T3-W6 — engine perf** | CSR + Vec cache + `assigned_ns` (ROW-1/7); GAC A/B + futoshiki bench + `gac_ab_corpus` 0/50 + node-count CI smoke (ROW-3); gac_alldiff oracle (L25-20); G13 probe; lean-band stamp (ROW-6); **quiet-box + node-count-oracle discipline (R-12); `--baseline pre-t3` (named targets, never `--workspace`)** | M | W4 (∥ FE chain) | `gac_timing_probe` before/after on a quiet box: minority cost narrows, node counts invariant; new CI lanes green |
| **T3-W7 — FE structure** | SudokuGame extraction + peek composable + scene CSS; **three-home rule per ballot Q3 (games/shared/ + undo/marks relocation + tripwire)**; god-composable pulls + **subdir barrels (K41)** + flat-config append; base64url hoist; classifyError rename + K1b; icons regroup; e2e sweep + **D3 throttled-void gate (G10 exhibit)**; L25-19 re-point onto `useBoilFrames`/`useBoilCache` (**G3-5**); **playwright/:3000 + hmr.port hardening (R-11b)**; **index.css HELD-again record (ballot Q4)**; polish tier last | L | W2 (ballot pre-folded) | vue-tsc + eslint-boundaries (tripwire negative control) + build chunk-shape parity + full e2e (33 + new) + **reduced-motion AE=0 parity bound (K38)** |
| **T3-W8 — FE perf** | P1 prewarm + preload injection; P5 font preload; P2/P3 cellRects + LRU (**measured target: <P2-band from 99–103 ms @4×**); **NEW marks/peek 16×16 burst row (R-7)**; P4 `advancedChunks` **against preview build**; ~~P6~~ dropped | M | W7 | **driven cold-cache before/after vs built `dist/` (G7's `probe-felt.mjs`)**; size-switch + marks worst frames assert below band |
| **T3-W9 — design: the gold move** | F8 steps 1–3 as F7-amended; F2-C + felt heart (variant family, YOSHI_COLORS wired, dark exception); F3 block + meta; UI-10 deepening; **star form: inline default, owner veto at this gate (R-2h)**; PRM gate `index.css:302` | L | W7, W2 (tokens) | a23-harness probes 1/2/5 green; contrast ledger re-computed; F8 grammar checklist over every touched surface |
| **T3-W10 — design: sky + page** | F5 set-and-rise (microtask wording, R-9); F4 slight pass **minus M4 (K43)**; celestial palette rewire (primitives only — the composable stays parked, G3); F6 page-turn + D1/D2/D3; F1 px-native outline all hosts incl. 375 | L | W9 (tokens); **G10 dependency SATISFIED** | PRM variants exercised; band ledger (800 ms→≈1.25 s row); F1 verified at 375; page-turn ≈1.05 s traced |
| **T3-W11 — UI completeness + security** | A23 UI-4/5/6/7/8/9/11/12; **UI-13 keep+hint (R-2i), veto window here**; mobile digit pad build-or-scope; **G8-P2 decoder hardening + types.ts doc-truth (R-8)**; G8-P3 strict size guard optional | M | W9/W10 | probe suite green; `fuzz.mjs` re-run — 100k-pairs / non-adjacent / dup cases now fail closed |
| **T3-WGATE — record + recert** | Doc re-sweep; convergence appendix; evidence dir per G2; cron `efaae137` CronDelete; **RES-5 memo edit**; backlog item for `propagate_stratified` wire-in filed; defer-closed records (mimalloc/PGO/opt-s); G8 clean bill + INFO notes; **owner reminders carried: R5 worktree purge + pencil-boil `v0.7.0` tag at `106a5a2` (G3)**; mod.rs post-tranche follow-up noted | S | all | blacklist grep-zero; counts re-stamped at gate SHA; tests-py reads 27/0 |

**Sequencing.** W0→W2→W3→W4→{W5, W6}; W7 starts after W2 (ballot pre-folded; independent of the
Rust chain) → W8, W7→W9→W10→W11→WGATE. W6 ∥ the FE chain. T9's constraint binds W3→W4 (removals
ride or strictly precede the demotions — a bare W4 cannot compile). W3 before W5 is load-bearing
(stub + sweep operate on the pruned tree). Design trio order = F8's internal dependency order.

---

## 3. CONVERGENCE — **91%, author-ready**

**Method:** wave-effort weighting continuous with pass-1 (64) and pass-2 (83). Per-wave
convergence-to-authoring scored on: scope fully ratified? evidence live/measured? residue
in-wave-executable?

| Wave | Weight | Conv. | Weighted | Sub-100 residue (all in-wave-executable) |
|---|---|---|---|---|
| W0 | 1.0 | 90 | 90 | one-command SHA/tree reconfirm (G6-vs-G7 stamp discrepancy) |
| W2 | 1.5 | 96 | 144 | Pages-side header fix lands only on owner redeploy (recorded either way) |
| W3 | 2.0 | 95 | 190 | bbnf re-run + byte re-measure at merged HEAD (mechanics proven, T2/K30) |
| W4 | 2.5 | 93 | 232.5 | merge bar re-run at HEAD (worktree-proven); doc option (a) execution |
| W5 | 2.0 | 90 | 180 | quiet-box assignment A/B; abi3-arm bbnf re-run (RES-4) |
| W6 | 2.0 | 88 | 176 | quiet-box before/after — the number is unmade until measured; oracle + baseline banked |
| W7 | 3.0 | 92 | 276 | gate integers refresh (K10/K18); tripwire negative control re-run |
| W8 | 2.0 | 87 | 174 | dist-preview trace (P4 unmeasurable pre-build); before/after is the wave's own gate |
| W9 | 3.0 | 90 | 270 | star-form default executes in-wave under F8 grammar (veto window at gate) |
| W10 | 3.0 | 92 | 276 | live premises all verified (G10); execution + PRM/band gates remain |
| W11 | 2.0 | 93 | 186 | UI-13 default executes in-wave (veto window); fuzz re-run is the wave gate |
| WGATE | 1.0 | 95 | 95 | RES-5 edit + stamps at gate SHA |
| **Σ** | **25.0** | | **2289.5** | |

**2289.5 / 25.0 = 91.58 → 91% (floored).** The 19→8-point advance over pass-2 is earned by the
ballot (all four questions answered, closing the coherence C2/C3 deductions, crit-py's R2 −8, and
crit-be's symmetric −5) and by the five A24 gap-lanes executing (G5 clean, G6 observed-green +
SHA-stamped, G7 measured, G8 passed-with-one-LOW, G10 live-verified with one row killed).

**Author-ready: YES, per the stated criterion.** Every remaining sub-100 row above is a gate the
owning wave itself runs — re-runs at merged HEAD (RES-2/RES-4), quiet-box measurements (W5/W6),
the dist-preview trace (W8), the RES-5 edit (WGATE) — or a corpus-lean default that executes
in-wave with an owner-veto window at that wave's gate (star form, UI-13). **No design unknown and
no owner unknown gates the authoring of any wave document.** Zero deferrals minted; the KISS
ledger (§1.6) is closed and unified.

**Not 100 because** (honest residue): the integers are worktree/load-local until the waves re-run
them; W6/W8's headline numbers do not exist until measured under discipline; and three defaults
(star form, UI-13, M4-drop) carry veto windows rather than signatures. None of these can be closed
by another investigation pass — only by authoring and executing the waves. This is what
100%-convergence-for-authoring means here: the loop has nothing left to investigate.

**Owner-side reminders carried to WGATE (actions, not questions — none gate authoring):**
R5 worktree purge + `java` branch delete (standing, owner-side) · pencil-boil `v0.7.0` tag at
`106a5a2` (sibling repo, G3) · CF Pages redeploy picks up the `_headers` fix when it next ships.

**Non-blocking owner-veto windows (defaults applied, exercisable at the named gate):**
1. F2 star form — inline glyph (default) vs corner foil sticker — W9 gate.
2. UI-13 — keep grade-after-Solve + margin hint (default) vs immediate conflict marking — W11 gate.
3. mod.rs self-named-file flip — post-tranche follow-up (default) vs fold into W4 — WGATE note.

*Report by the reconciliation lane. One decision set, one DAG, one ledger; every disposition names
its sources; 91% floored; the loop closes here and authoring begins.*
