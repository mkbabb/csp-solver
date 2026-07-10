# Tranche II — Pass-1 Synthesis

**Authored 2026-07-09 · synthesis authority under the owner · repo HEAD `8913023e` (read-only).**
Base: the READY-CONDITIONAL gate (`pass1-critique/32-synthesis-readiness.md`) — its trust topology, S1–S19, §5 corrections ledger (folded verbatim, §5 below), and the T2-W0..W7+GATE skeleton. Upgraded by the eight supplemental verifications `verify-26..33` (grades A,A,A,A,A,A,A,B — all landed post-gate) and resolved by the NINE OWNER RATIFICATIONS of 2026-07-09, all at recommended. Every owner gate in the skeleton now RESOLVES; the wave set below is unconditional except where a Pass-2 prototype is the named gate.

**Standing rules inherited:** never quote an original where §5 corrects it; the stale-echo blacklist stays blacklisted; lane 24's "still live/materialized" verdicts are quote-only-with-reverification (grade C); wall-clock ms are regimes and ratios, never SLAs. The lanes-26–33 verify-then-apply authoring rule is RELAXED wherever the verifier confirmed the number — which is nearly everywhere (7 of 8 supplements graded A, most numbers byte-exact).

---

## 1. THE SETTLED DECISION SET

27 decision rows. Status: **ER** = EXECUTION-READY (settled + ratified + verified) · **PG** = PROTOTYPE-GATED · **RETIRED** = mooted by ratification. Evidence chains are one line; the full chains live in the readiness gate §1 and the verify reports.

| # | Decision | Status | Evidence chain |
|---|---|---|---|
| D1 | Abrogation IFF condition MET — wasm full user-facing parity, ≥10× at every interactive touch (~0.42 ms wasm 9×9-hard vs ~16 ms live-warm; band ~10–330×) | **ER** (R1) | L01→verify-01 (A) · L02→verify-02 (B, band corrected) · 30-repro re-run |
| D2 | Server+docker excision manifest — with `apiError.ts` SPLIT not deleted (live for wasm errors; only `useApi.ts` dead), DNS resolved (api.sudoku.babb.dev = owner box; OD-4 executed at d43fae28) | **ER** (R1) | L03→verify-03 (B, two refutations folded) · verify-31 live probes |
| D3 | KEEP PyO3 `py/`; 4 wheel-contract tests (618 L) → `csp-solver/tests-py/`; CI py-runtime retargets | **ER** (R1) | L04→verify-04 (A, exact to the line) |
| D4 | Nightly vestigial; MSRV exactly 1.88 (let-chains); stable 1.97 clean workspace+wasm+clippy `-D warnings`; pin via `rust-toolchain.toml` | **ER** (R7) | L05→verify-05 (A, 1.87-fail/1.88-pass bisected) · verify-32 independent re-run |
| D5 | PyO3 0.24.2→0.29.0 mechanical: 9 `allow_threads`→`detach` sites, wheel byte-consistent, 108/2 green; `strip=true` (−21.6% .so) | **ER** | L13→verify-13 (A, most-corroborated) · verify-32 (9/9 line numbers exact) |
| D6 | Inline-test migration zero-widening — 2 modules, 5 tests; migration already compiled in a worktree | **ER** (owner constraint 3) | L08→verify-08 (A, compiled it) |
| D7 | Substrate island excision @0.3.0: `restart.rs`+`heuristic.rs`+`nogoods.rs` (335 LOC) + `Ordering::Chs` (alias folded into the Mrv arm, off both wires) + `SolveConfig.restarts` + `SoftConstraint` + `variable.rs` `clear_log`/`reset_to` — zero live call sites, py/wasm-safe; restart-driver deferral ends foreclosed | **ER** (R4) | L06→verify-06 (A, 0 refuted) · verify-29 C2 corroborates inertness |
| D8 | Benches: `fc_chrono` panic real (`sudoku.rs:161`) → excise; stale self-baseline pathology real → baseline discipline; lattice benches exercise AC-3 not sweep → add sweep variant; lattice n=20 hang FIXED at HEAD | **ER** (iai-CI sub-item → prototype P6) | L10→verify-10 (A) · 28-contradictions C10 |
| D9 | Data bank: 116/116 boards proven correct; optimal embed = sparse+compact **81,963 B (−72.5%)** vs 298,006 B; N=5-easy = 28% of embed, UI-dead → killed outright (R1); N=4-hard bank load-bearing (>1 s gen wall) | **PG** (P1, P2; N=5 kill itself ER) | L11→verify-11 (B+, headline corrected upward) · 30-repro byte-exact |
| D10 | Backend runtime (uvicorn KEEP, wire reshape DEFER at `sudoku_api.rs`/`futoshiki_api.rs`) | **RETIRED by R1** — server excised; wire prototype (#8) dies with it | L12→verify-12 (B) · verify-13 · 28-C1 |
| D11 | Affordance slate: 6 ADOPT / 3 REJECT, bound order print→K-peek→stale-note→stat-line→undo→share-on-demand permalink→PWA-minimal→hint (hard-gated after undo); stale-note fix widened to any non-graphite tone; permalink is share-on-demand, not ambient; REJECTED: manual pencil marks (engine-domains → prototype P4), upfront hints, input-mode toggle, timer | **ER** (R3) | L14→verify-14 (A, 0 refuted, play-log corroborated) |
| D12 | Mobile: iPad-portrait clipping CRITICAL, ~11 px worse at HEAD → `md:`→`lg:`; 16×16 cells ~21.7 px (sub-44 arithmetic impossibility); logo-menu items 36.2 px; 42×32 px logo-button↔toggle contention at 375 | **ER** (R3) | L15→verify-15 (A, re-measured at HEAD) |
| D13 | glass-ui: adopt ZERO components/composables, vendor pure math only; **excise `@mkbabb/keyframes.js`** (zero imports at both HEADs; flushes transitive glass-ui+reka-ui installs) | **ER** (R8) | L16→verify-16 (B, KEEP→EXCISE flip verified) |
| D14 | FE perf wins: immutable cache headers (wasm currently max-age=0), font self-host/subset, avatar `?s=64` (104 KB→6 KB), CSP-vs-beacon fix; LCP already fine (72.0% third-party cold-load) | **ER** (subset byte-count → prototype P5; action survives either way) | L17→verify-17 (A−, WIN-2 provenance caveat) |
| D15 | pencil-boil 0.7.0: `useBoilCache<T>`, `boilLine/RectFrames` prebake, `createStrokeDrawIn`, app-local easings excise, doc fixes — every number byte-exact | **ER** | L18→verify-18 (A) |
| D16 | Repo org: 28 GB/34 stale worktrees purge + dead `java` branch delete; `apiError`/`solverError` twins DEFER stands (genuinely-owned copies) | **ER** (R5) | L19→verify-19 (A) · L23→verify-23 (B) |
| D17 | Docs: fold-not-delete into lean per-package READMEs; living-docs-rot thesis triply proven; root CLAUDE.md otherwise current | **ER** (R2) | L20→verify-20 (A−) · 28-C3/C4 |
| D18 | Deferred ledger (58 items): four mandatory edits — strike L25-28, close L25-35, re-base L25-49, add the `test_budget_exceeded_error_end_to_end` skip | **ER** | L25→verify-25 (B) |
| D19 | Prompt-recap matrix complete: 27/27 hashes real, no mandate clause orphaned; record reversals R4-inline-tests/D2-CLAUDE.md/N9-repo-split-VOID (+ now R9 never-push retired) | **ER** | L22→verify-22 (A) · 29-completeness Part A |
| D20 | Kernel perf (L26, now settled): GAC = the hot path (20–73% self-time; kernel <2%) — KEEP algorithm; **OPTIMIZE** the O(E·n_vals) adjacency scan (`gac/mod.rs:236,239` → value→index scratch); **REPLACE** the per-revise singletons `Vec` (`all_different.rs:55` — 86%/75%/~55% of malloc on gen_holedig/sudoku16/futoshiki7); **REPLACE** assignment large-n path (proven-optimal ceiling ~15–18, not the doc's "n≤~100"; n=20 burns 3.4–3.7 s budget-blown → Hungarian dispatch for group-free/pin-free, doc fix `assignment.rs:14`); CSR adjacency + Vec-indexed warm cache + mimalloc + GAC on/off policy all DEFER | **ER** | L26→verify-26 (A — fresh 35,650-sample profile within ±0.85pp; cliff deterministic, node counts exact) |
| D21 | wasm build config (L27, now settled): **KEEP `opt-level=z`** (87,853 B, 5,147 B headroom under the 93,000 raw gate); **EXCISE opt-3** (123,294 B, +30 KB bust, ~+27% off-thread sub-ms gain nobody feels); **REJECT simd128** (−3.4%, no size win); **`opt-level=s` = DEFER-as-optional** (+17%/+2.1 KB, in budget — trigger: hard-16×16 latency felt on low-power mobile; the s cell is bracketed-plausible, not rebuilt — re-derive if ever pulled); CI size comments stale → refresh 72,429→87,853 / 201,053→211,639 | **ER** | L27→verify-27 (A — endpoints rebuilt fresh, F7 actuals byte-exact; 696 B "glue delta" attribution refuted, non-material) |
| D22 | FE runtime (L28): idle is clean at HEAD (4.0–5.3% busy, ~42–45 raster ms/s, 0 dropped frames desktop AND 4×) — **KEEP everything at steady state**; the board-size-switch transition layer carries the one real cost (842 ms/s raster, 133 ms frame @4×) → extend the W8 grain-hoist to the transition layer | **PG** (P3 — the F1 fix mechanism proposed, never built; F1 row not independently re-driven) | L28→verify-28 (A — idle re-traced 30 s at HEAD, mechanism verified at source) |
| D23 | Solver SOTA (L29): REJECT slate stands wholesale — LCG/CDCL, sparse-set domains, parallel/portfolio all scale-forced rejections at ≤501 bt / ≤25-value / stateless sub-2 ms / wasm deploy; all 9 citations real (2 author garbles); §8b bitset-parallel GAC stays DEFER-prototype-gated and is user-imperceptible even at full ceiling (~0.3 ms on ~1 ms) | **ER** (nothing to build — rejections + ledger rows) | L29→verify-29 (A — every REJECT re-judged sound, zero resume-smell) |
| D24 | Headline re-cert (L30): Rust 150/0/6 across 17 binaries, Python 108/2, wasm lean 87,853 B exact / full 211,639 B (+5.27% vs CI record) — all reproduced at exact parity twice; `gac_ab_corpus` repro path CANNOT produce the timing/node numbers + hardcoded "0/113" verdict string (corpus is 112) → fix both; wheel dist-info `sudoku_rs-0.1.0` → rename; futoshiki "G1 0.67 ms" does not exist — never cite | **ER** | L30→verify-30 (A — byte/count parity on a different-load host, content-hash match) |
| D25 | Security posture (L31): CORS env-prefix P0 and API-origin exposure both CONFIRMED live — **MOOT by R1** (box service decommissioned with the server); ER residue: untrack the gitignored-but-tracked `.env` (no secret ever committed), `.env.example` dead `DEPLOY_HOST` kill | **RETIRED by R1** (+ ER residue → T2-W0) | L31→verify-31 (A — every live probe reproduced byte-for-byte) |
| D26 | Toolchain slate (L32, now settled): pin stable + `rust-version="1.88"`; Node 22→24 (22.23.1→24.18.0, npm 11.16.0); Vite 6.4.1→7 (peerDeps span ^8 on target plugin versions); **Vite 7→8 DEFER** (Rolldown — prototype P7); TS 5.7.3→**6.0.3** (last classic compiler; **7.0.2 DEFER**, GA'd 2026-07-08, Vue language-tools block); wasm-bindgen 0.2.126 + criterion 0.8.2 | **ER** (Vite-8 sub-item PG) | L32→verify-32 (A — every version/date/line-number exact on fresh registry queries) |
| D27 | FE hardening (L33, as re-judged by verify-33, the operative slate): **H1 first** (grid tint + ring bump + the `:has(input:focus-visible)` specificity bullet MANDATORY — tier-2 blue beats tier-3 red on specificity, the source-order comment at `SudokuCell.vue:251-252` is wrong, fix it too) · H3 (kill the `vbWidth=220` special-case; real gap 41.9 vs 14.4 px, not ~130) · H4 (ladder-bind wordmark+menu — token hygiene; heights already golden off-token) · H5-option-(b) (error-note scrollIntoView/toast, not a permanent 48 px board tax) · H9 (mobile marginalia clearance) · H2-**elevation-only** (popover bg + shadow-md + dark hairline; placement half overruled — it fights H5's fold budget) · H8-**centering-only** (`align-items:center` at ≥md) · H6 **shrunk** (star 2.5→~3.25rem in place; the burst overruled — breaks the graded-paper idiom) · **I2 promoted** into H7's slot (suppress the 1.2 s wordmark-reveal replay on every game swap) · H7 + H10 DEFER | **ER** (R3 ratified the ten; the design-authority amendments folded — see Residual #7 for the one-line owner confirm) | L33→verify-33 (B — 5 confirmed, 1 corrected, 0 refuted; menu is ~99 px not ~180) |

**Tally: 23 ER · 2 PG (D9, D22) · 2 RETIRED (D10, D25).** Seven Pass-2 prototypes gate the 2 PG rows plus four ER sub-items (iai-CI, font bytes, Vite 8, engine-domains booking).

---

## 2. THE WAVE SET — T2-W0..W7 + GATE, unconditional

All nine ratifications landed at recommended: every owner gate in the skeleton resolves GO. Prototype gates (P1–P7, §3) are the only remaining conditionals, and each is confined to its named beat — no wave is wholly blocked.

### T2-W0 · Gates + hygiene — opens the tranche · effort S · deps: none
- **e2e**: run at HEAD (never re-run there; "12/14" is a pre-HEAD W12 figure); fix the 2 red frame-line specs; author the first futoshiki spec; **wire into CI** (R6 GO). New specs inherit the `.controls-card button[…]` scoping discipline — the bare `aria-label` selector resolves to the hidden mobile panel and hangs (L14).
- **Literal refresh** (all proven stale): `ci.yml:269,295` size comments → 87,853/211,639 (verify-27/30 byte-exact); `gac_ab_corpus.rs` hardcoded `"0/113"` verdict → derive from `corpus.len()` (112) + repair `docs/benchmarks.md`'s "Reproducing" section (the documented command cannot produce timing/node numbers — verify-30); benchmarks.md 113→112 + the `ac3_mrv` headline; `worker.ts:5` "148-659ms" caption.
- **Hygiene**: `git rm --cached .env` (tracked-but-gitignored, verify-31 F10); kill `.env.example` dead `DEPLOY_HOST` (NXDOMAIN legacy host the deploy script was hardened against — L03).
- Gates: e2e green (full suite + futoshiki) in CI; `gac_ab_corpus` prints derived counts.
- Seeds: L21/verify-21 · L30/verify-30 · L31/verify-31 · 29-completeness G1 · L14.

### T2-W1 · Toolchain + deps — R7 resolved · effort M · deps: W0
- `rust-toolchain.toml` pinned **stable** + `rust-version = "1.88"` in both Cargo.tomls (MSRV bisected 1.87-fail/1.88-pass).
- PyO3 0.24.2→0.29.0: 9 `allow_threads`→`detach` sites (`py/csp.rs:70,78,87,108` · `py/futoshiki_api.rs:141,209` · `py/sudoku_api.rs:157,230,271`) + `strip=true`; wheel dist-info rename `sudoku_rs-0.1.0`→`csp_solver-0.2.0`.
- wasm-bindgen 0.2.126 + criterion 0.8.2 (re-verify the queens smoke); Node 24 (`ci.yml:333`; the Dockerfile citation dies in W2); Vite 6→7 + paired `@vitejs/plugin-vue`/`@tailwindcss/vite` bumps; TS →6.0.3 (7.x DEFER). Vite 7→8 only if P7 clears — a follow-on beat, not this wave.
- Gates: `cargo +stable test --workspace` 150/0/6 · pytest 108/2 on the rebuilt wheel · `npm run build` clean under vue-tsc · clippy `-D warnings` clean.
- Seeds: L05/verify-05 · L13/verify-13 · L32/verify-32 · L30/verify-30.

### T2-W2 · Abrogation execution — R1 GO, unconditional · effort L · deps: W0 (the regression net), W1
- **EXCISE**: `web/api/` (whole package — 8 app-coupled test files die with it), `docker-compose.yml`/`.override.yml`/`.prod.yml`, `web/api/Dockerfile`, `web/frontend/Dockerfile` (R1's "ALL docker files" resolves L03's DEFER), `web/nginx/`, `.dockerignore`, `scripts/deploy.sh`; trim `scripts/dev.sh` `--docker` branch (native mode is already the replacement — nothing to build).
- **SPLIT**: `apiError.ts` — keep the wasm-error surface (imported by both game boards), delete the `{error:{code,message,retryable}}` envelope parsing + `useApi.ts` in both games (verify-03's refutation of "free delete" folded).
- **REHOME**: the 4 wheel-contract files (`test_bench_compare`, `test_rust_backend`, `test_panic_contract`, `test_wheel_contracts`, 618 L) → `csp-solver/tests-py/`; retarget `ci.yml` py-runtime (`working-directory` + wheel-relative path). CI has zero Docker anywhere — the docker excision has zero CI blast radius (L03 §B2).
- **Companion edits** (each would silently red without it): `csp-solver/tests/difficulty_parity.rs:145,163` (drop the `../web/api/*` scan entries); `_headers`/`_redirects` (verify-03-flagged); doc-comment sweep `error.rs:20`, `py/mod.rs:4`, `py/sudoku_api.rs:63,189` (cosmetic, do in-pass).
- **N=5-easy retired** as a feature (the lone server-only capability — already unreachable at `vite.config.ts:30` and unrenderable past glyph G; embed excision itself is W4).
- **API box decommission** (owner-side, R1): stop sudoku's vhost + uvicorn service on the shared origin `34.197.214.67` — NOT the box or the 7-SAN LE cert, which serve six other apps (verify-31 F8). OD-4 already executed; no DNS work beyond removing `api.sudoku.babb.dev`'s A record when the service stops. The CORS P0 dies unfixed, correctly.
- Gates: `cargo test` green incl. difficulty_parity · py-runtime green from `tests-py/` · zero `web/api` grep hits outside `docs/tranches/` archives · frontend build + e2e green · live site unaffected (it never called the API).
- Seeds: L03/verify-03 · L04/verify-04 · L01/L02 (the IFF evidence) · L31/verify-31.

### T2-W3 · Kernel + test hygiene — R4 GO · effort L · deps: W1
- **Inline-test migration** exactly as verify-08 compiled it (error.rs 2-pass; sudoku generate 7→10; R13 debug/release behavior preserved) — revokes W13's two-discipline statement per owner constraint 3.
- **Substrate excision @0.3.0** (precondition: bbnf vendored-copy sync-gate check first — semver-visible pub-API removal): `restart.rs`+`heuristic.rs`+`nogoods.rs` (335 LOC), `Ordering::Chs`, `SolveConfig.restarts`, `SoftConstraint`, `variable.rs` `clear_log`/`reset_to`, `ordering.rs` doc-links. CHANGELOG + version bump.
- **Bench hygiene**: excise `fc_chrono` (panics at `sudoku.rs:161`, reproduced live); add a sweep-path lattice bench variant (drop `finalize()` — today they exercise AC-3, not BBNF's actual path); criterion `--save-baseline` discipline (the phantom −17% self-baseline pathology reproduced); iai-CI harness only if P6 clears.
- **L26 kernel beats** (all verified A, deterministic): GAC adjacency value→index scratch (`gac/mod.rs:236,239` — O(E·n_vals)→O(E), biggest on 16×16 + CostFinite); singletons `Vec` pool/fuse (`all_different.rs:55` — the W3-booked dominant residual, now quantified: up to ~1/3 of futoshiki7 wall, ~1/5 of gen_holedig); assignment Hungarian dispatch for group-free/pin-free (the `hungarian` crate is already the linked bench floor; µs vs 3.4–7.5 s budget-blown) + doc-ceiling fix at `assignment.rs:14` + surface `budget_exceeded` louder.
- Gates: full suite green (count grows with migration) · criterion no-regression vs saved baseline · malloc attribution on gen_holedig demonstrably down from 86% · assign n=20 proven-optimal via the LAP path · `gac_ab_corpus` 0/112 both modes · feature-sweep clean post-excision.
- Seeds: L08/verify-08 · L06/verify-06 · L10/verify-10 · L26/verify-26 · L29/verify-29.

### T2-W4 · Data reshape — prototype-gated (P1, P2 first) · effort M · deps: W2, P1, P2
- **N=5 bank + solutions excision** (28% of the embed, R1-ratified kill) — can land ahead of the prototypes; includes `glyphPaths`/`SIZES` consistency check.
- **Sparse+compact puzzle-only embed** (−72.5% → 81,963 B) IF P1 clears — the 81,963 B was measured by re-serialization only; `parse_puzzle_field` + the template pipeline have never been proven against sparse files.
- **N=2 (and possibly N=3) bank excision → live-gen** IF P2 clears the felt-latency budget (expected ~1.8× native; N=3-hard ~20–30 ms is exactly the number to measure).
- **KEEP the N=4-hard bank** — the >1 s native generate wall is real; the bank is load-bearing there.
- Gates: full uniqueness sweep over the surviving bank green · `cargo test` green · wasm lean size still under the 93,000 gate · new embed byte-count recorded.
- Seeds: L11/verify-11 · 30-repro · L27/verify-27.

### T2-W5 · FE perf + hardening + pencil-boil · effort L · deps: W1 (Vite 7), P3, P5
- **Transport**: immutable cache headers for hashed assets + fix the wasm `max-age=0`; avatar `?s=64` (104 KB→6 KB); CSP-vs-beacon resolution; font self-host + subset (P5 measures the real bytes — L17 WIN-2's "~67 KB" rationale is the corpus's one mixed-provenance claim; the action lands either way and feeds W6's offline story); optionally pin `Content-Type: application/wasm` in `_headers` (L27 streaming insurance).
- **Dep excision**: `@mkbabb/keyframes.js` out of package.json (R8 — zero imports; flushes transitive glass-ui + reka-ui 2.8.2 installs); vendor glass-ui pure math only, zero components/composables (D13).
- **Runtime**: transition-layer grain-hoist IF P3 clears (842 ms/s raster → target the idle band; escape hatch pre-booked at `pencilConfig.ts:170-189`); everything steady-state stays — idle is clean (verify-28).
- **Mobile** (R3): `md:`→`lg:` (iPad-portrait clipping, ~11 px worse at HEAD); 44 px tap-target floors incl. the 36.2 px logo-menu items; resolve the 42×32 px logo-button↔toggle contention at 375.
- **Hardening, the verify-33 operative slate, in order**: H1 (tint + ring + the mandatory `:has(input:focus-visible)` bullet + fix the wrong comment `SudokuCell.vue:251-252`) → H3 (`vbWidth` special-case delete + caret optical-center) → H4 (ladder-bind `HandwrittenLogo.vue:223,225,268-269,319`) → H5(b) (error-note scrollIntoView/toast) → H9 (mobile marginalia clearance) → H2-elevation-only → H8-centering-only → H6-shrunk (enlarge in place) → I2 (no wordmark-reveal replay on game swap). H7/H10 → deferred ledger.
- **pencil-boil 0.7.0** (sibling repo, in scope per owner constraint 7): `useBoilCache<T>`, `boilLine/RectFrames` prebake, `createStrokeDrawIn`, app-local easings excise, README/CONTRIBUTING/CHANGELOG fixes — every number verified byte-exact (verify-18).
- Gates: idle re-trace ≤ ~5% busy / 0 drops (verify-28 harness is the template) · size-switch raster before/after measured (P3's number) · transfer re-measured post self-host · SSIM soul-gate on the H1/H4 restyles · e2e green.
- Seeds: L17/verify-17 · L15/verify-15 · L16/verify-16 · L28/verify-28 · L33/verify-33 · L18/verify-18.

### T2-W6 · Affordances — R3 GO, the bound order · effort L · deps: W5 (fonts self-hosted before PWA precache; SW must respect the wasm cache-header fix)
Strictly in the ratified order:
1. **Print CSS** (~20 L `@media print` in `index.css` — hide chrome, black glyph strokes, strip solve-washes).
2. **K-peek input-exemption** (`t.closest('.board-cells')` — 1 line ×2 games; the guard blocks exactly the roving-tabindex resting state).
3. **Stale-note clear** — on `'idle'`, clear any **non-graphite** tone (verify-14's widening: the gold-star note goes stale by the same path).
4. **Backtracks stat-line**, both games — widen `useSolver.ts:166-172`'s return (+`backtracks`, `solutionCount`; optional worker `elapsedMs`); the payload is already on the wire (`solver.worker.ts:81`, `protocol.ts:29,32`). The cheapest high-value change in the tranche.
5. **Bounded undo** — capped `{pos,prev,next}[]` per game composable, Ctrl+Z/Ctrl+Shift+Z with `preventDefault` (also silences the native-undo phantom through the hidden inputs).
6. **Share-on-demand permalink** — `?board=` base64url written on an explicit act wearing the `SheetWashiLabel` grammar; URL wins over storage on load; Randomize/Clear drop the param.
7. **PWA-minimal** — manifest + `vite-plugin-pwa` generateSW precache only; no sync, no toasts. Honest now that fonts are self-hosted (81.6 KB to interactive today, hard offline fail).
8. **Hint tier** — `H` fills the focused cell from the peek cache, solver-ink; hard-gated AFTER undo lands. No bookkeeping, no penalties.
Plus the L14 bonus: a washi discoverability label on the hold-to-peek surface (the grammar already exists).
REJECTED, stand: manual pencil marks (engine-domains variant → P4), upfront hints, input-mode toggle, timer, anything past precache.
- Gates: one e2e spec per affordance (`.controls-card` scoping) · play-log re-run · offline reload works.
- Seeds: L14/verify-14 · L33/verify-33.

### T2-W7 · Docs + record — R2 GO · effort M · deps: all prior (docs describe the post-excision tree)
- **Fold-not-delete** per L20's disposition (2,158 L per the corrected total), adjusted for R1: root CLAUDE.md + root README → **one** root README, register rewritten (archaic-academic retired; house style, ~5% florid ceiling); `csp-solver/CLAUDE.md` → fold into existing `csp-solver/README.md`; `web/frontend/CLAUDE.md` → new `web/frontend/README.md` (correcting the Finding-3 drift in the fold); `web/api/CLAUDE.md` **dies with the package in W2** — no fold target needed (adjusts L20's pre-R1 plan).
- **EXCISE**: `csp-solver/CONTRIBUTING.md` (stale on its own central claim — fold any contributor flow into a README section); `web/frontend/ANIMATION.md` (superseded, carries drift W13's own ledger claimed fixed); `web/api/docs/csp_optimization.md` (tranche-1 P11, finally executed — moot anyway post-W2).
- **NEW**: `games/sudoku/README.md` mirroring futoshiki's (closes the §7-idiom asymmetry). **RELOCATE**: `grand-audit-2026-06-02.md` → `docs/tranches/`.
- **License coherence** (R2): root Unlicense → MIT; license fields in the npm/py manifests; coherent root/crates/npm/py.
- **Record**: the three reversals (R4 inline-tests, D2 CLAUDE.md, N9 repo-split VOID) + R9's never-push retirement (bbnf's own order STANDS) + the T2-1 de-booking; deferred-ledger fold with verify-25's four edits + the new deferrals (opt-level=s w/ felt-latency trigger, H7/H10, engine-domains booking per P4, §8b bitset-parallel GAC, TS 7.x, Vite 8 if P7 fails, mobile digit pad, apiError/solverError twins); microcopy pass (29-completeness G3); upstream flag to precepts: canonical-readme-shape's csc411 row says 4 artifacts, repo has 2.
- **Convention lines**: "Nightly toolchain" → stable-pinned; dev commands lose the Docker path.
- Gates: zero CLAUDE.md tracked · every surviving fact single-homed · zero stale-echo blacklist entries in any surviving doc · link check · register sample owner-reviewed.
- Seeds: L20/verify-20 · L23/verify-23 · L25/verify-25 · L22/verify-22.

### T2-W-GATE · Re-certification · effort S · deps: all
- Re-run the 30-repro top-10 template at final HEAD (test counts, wasm sizes, live-deploy probes, idle trace); e2e full green; benchmarks.md re-stamped with **committed** repro paths (the GAC timing probe gets committed this time — the 13.36×-class numbers currently rest on a deleted scratch harness and stay inherited-trust until then); ledger closed; convergence statement.

**Dropped from wave candidacy** (settled REJECT/DEFER/RETIRED): granian, wire reshape (dead with R1), reka/glass-ui component adoption, manual pencil marks, solve timer, simd128, opt-level=3, opt-level=s (deferred w/ trigger), divan, the L29 SOTA list, repo split (VOID per T2-1), H2-placement, H6-burst, H7, H10.

---

## 3. THE PASS-2 PROTOTYPE LIST — 7 items (readiness §4 minus the R1-mooted #8)

| P# | Prototype | The exact question | Gate to clear | Consumed by |
|---|---|---|---|---|
| P1 | Sparse+compact embed reshape | Do `parse_puzzle_field` + the template pipeline accept sparse puzzle-only files? (81,963 B was measured by re-serialization only — never built end-to-end) | Regenerate bank → rebuild → full `cargo test` + the uniqueness sweep green; embed ≤82 KB measured | T2-W4 |
| P2 | wasm-side hole-dig generate cost | The browser multiplier over native gen (expected ~1.8×; every L11 gen timing is native; L27 measured solve, not gen) | N=2/N=3 wasm gen p95 under a felt-latency budget (≤50 ms proposed) in a browser harness | T2-W4 (bank-excision option) |
| P3 | Transition-layer grain-hoist | Does extending the W8 grain-hoist to the transition layer cut the 842 ms/s raster / 133 ms @4× frame without visual regression? (mechanism proposed, never built) | Measured before/after trace (verify-28 harness) + soul/SSIM check; escape hatch `pencilConfig.ts:170-189` | T2-W5 |
| P4 | Engine-domains pencil marks | Is a `propagate`-only worker op + graphite-mark rendering feasible inside the KISS bar? (`SolverRequest` is solve/generate only — verified) | Protocol op round-trip + rendering spike; if it clears, BOOK (verify-14: first pick for tranche III), else close the ledger row | Booking decision post-W6 (W6 does NOT depend on it) |
| P5 | Font subset/self-host bytes | The actual subset woff2 bytes (WIN-2's "~67 KB for two strings" is the corpus's one mixed-provenance sizing claim) | Subset build measured; the action survives either way — only the recorded win changes | T2-W5 (and W6 PWA precache budget) |
| P6 | iai-callgrind/codspeed CI spike | Can a CI lane give deterministic instruction-count baselines? (arm64-macOS can't run Valgrind — a CI spike is the only way to know) | Green CI lane, stable counts across 2 runs | T2-W3 baseline discipline (fallback: criterion `--save-baseline`) |
| P7 | Vite 7→8 (Rolldown) | Do the custom `sudokuTemplates()` plugin + worker bundling survive the bundler swap? | Test build + e2e green under Vite 8 | T2-W1 follow-on beat (else stays DEFER) |

Struck: **#8 flat-wire reshape** — dies with R1 (the string-keyed FFI files go down with the server; the wasm path was never string-keyed at that boundary).

---

## 4. CONVERGENCE — 89%

Calibration against the tranche-1 arc (72→90→91→95): this synthesis starts far above tranche-1's Pass-1 because it sits on a completed adversarial critique layer (25/25 verified, 15 A-grade), eight supplements at 7A/1B with most numbers reproduced byte-exact, and all nine ratifications already landed — the owner-gate uncertainty that normally dominates a Pass-1 is zero here.

The missing 11 points, honestly decomposed:
- **~4 pts — the seven unrun prototypes.** P1 (embed end-to-end) and P2 (browser gen cost) gate a whole wave; P3's mechanism has never been built. Until they run, W4/W5's shapes are provisional.
- **~2 pts — W2 execution risk.** The excision manifest is verified at decision granularity, but abrogation is the tranche's largest destructive change; the companion-edit set (difficulty_parity, `_headers`/`_redirects`, CI retarget) is exactly where a missed grep bites. The owner-side box decommission is out-of-repo and only spec'd, not rehearsed.
- **~2 pts — design/taste residue.** The root-README register rewrite is judgment-heavy; the verify-33 amendments (H6 shrunk, H7→I2 swap) sit one notch beyond R3's ratified parenthetical and merit a one-line owner confirm (Residual #7).
- **~2 pts — un-re-driven measurements.** L28's F1 size-switch row wasn't independently re-driven (only its raw-JSON transcription verified); e2e has never run at HEAD; the GAC 13.36×-class ratios rest on a deleted harness until W-GATE commits a probe.
- **~1 pt — environment-bound ms.** All wall-clock claims are regimes/ratios per the 30-repro rule; any beat that hard-gates on an absolute ms will need a fresh local measurement at execution time.

---

## 5. THE CORRECTIONS/REFUTATIONS LEDGER — folded verbatim (readiness §5, unabridged)

**Refuted — blacklisted as stated:** L03 `apiError.ts` free-delete (LIVE — split) · L03 §F DNS "unresolved" (resolved; OD-4 executed) · L02 "ratios load-robust" (low end 19→11 under load) · L09 `alloc_count.rs` "hand-rolled binary construction" (uses `add_all_different`/GAC) · L12 §2a "boundary already int-keyed" (live path string-keyed in Rust) · L16 keyframes.js KEEP (zero imports; excise) · L21 `ci.yml:201` e2e comment (zero e2e anywhere — stronger) · L23 F1 stale root CLAUDE.md (phantom from the prompt snapshot) · L24 lattice hang "remains live" (fixed at W2) · L24 both W9 a11y "materialized risks" (fixed within W9's own landing commit) · L25-28 useReducedMotion retirement pending (file gone) · owner framing "early frontend lanes saw the old tree" (no frontend-sensitive lane completed pre-move). **Plus, new from the supplements:** L27's "696 B web-vs-bundler glue delta" (scratch-copy inflation; the `.wasm` is target-identical at 87,853 B — non-material).

**Corrected — quote these values, never the originals:** perf band ~10–330× · live-API warm ~16–24 ms, cold ~47 ms · wasm 9×9-hard ~0.42 ms · `allow_threads` = 9 call sites · `search.rs` = 517 · web/api tests = 12 files · edge-served wasm ≈38.6 KB (br-q11 local 32,847 B is a different thing) · dense-with-zeros files = 106 · optimal embed = 81,963 B / −72.5% · `make wasm` = 284,009 B at current toolchain · `pkg/` gitignored, not committed · e2e "12/14" = pre-HEAD figure · one-shot probes = 5 · L20 doc total = 2,158 L · session walls = 2 reset windows; hangs = 2 · L15 F7 superseded by the 42×32 px contention · glass-ui reka wrappers 8/9, reka-ui 2.8.2 transitively installed · L17 measured the d43fae28 deploy, cited 8913023e source · embed path now `csp-solver/data/sudoku_puzzles/` · `Ordering::Chs` ≡ Mrv-arm alias, off both wires · glyph ceiling in `glyphPaths.ts`. **Plus, new:** escargot ~0.72 ms/iter (L26's 0.74 ~3% high) · `assignment.rs:14` not :16 · lean z = 87,853 B (L27 F6's 88,549 was scratch-inflated) · opt-3 lean = 123,294 B · caret gap 41.9/14.4 px not ~130 · menu ~99 px not ~180 · L33's "two blue-boxed 5s" are red rings around blue ink · L32's nightly-date self-contradiction (07-09 headline vs 07-02 table; live manifest was 1.99.0-nightly 07-08 — moot once stable is pinned) · L32 doc-hit tally 9 not 6.

**Stale-echo blacklist (never quote):** "83 integration tests" · "107 Python tests" · `search.rs` 507 · "19–380×" · "~33 KB on the wire" · "0.4975 vs 0.6 ms" · the pre-`dc5bd4c4` CLAUDE.md snapshot · "futoshiki G1 0.67 ms" (does not exist in the repo — verify-30) · "0/113" (corpus is 112).

---

## 6. RESIDUAL UNKNOWNS + PASS-3 CRITIQUE-FLEET QUESTIONS

**Residual unknowns (FAIL-EXPLICIT):**
1. All seven prototype gates (§3) — each is a genuine unknown until run; P1/P2 shape a wave.
2. e2e state at HEAD — 2 known-red specs, zero futoshiki coverage; W0's first act.
3. bbnf's vendored-copy state vs the substrate excision — the sync-gate check is a W3 precondition, not yet run.
4. The GAC timing ratio provenance — 13.36×-class numbers rest on a deleted scratch harness; inherited-trust until W-GATE commits a repro probe.
5. Owner-side box decommission mechanics — the shared origin hosts six other SANs; the spec says service-only, but no rehearsal exists in-repo.
6. PWA precache vs the wasm cache-header fix — generateSW's precache-first semantics against `max-age=0`-today/immutable-tomorrow assets needs one deliberate config decision in W6.
7. The verify-33 amendments (H6 enlarge-in-place, H7→I2 swap, H2-elevation-only) extend R3's ratified parenthetical — one owner line confirms or reverts; the wave is authored to the amended slate.
8. The root-README register — taste-gated; W7 gates on an owner sample review.

**Pass-3 critique-fleet questions (dispatch as-is):**
1. **W2 manifest completeness**: re-derive the excision manifest from a fresh grep at HEAD — does the authored set (incl. `difficulty_parity.rs:145,163`, `_headers`/`_redirects`, py-runtime retarget, `dev.sh` trim) leave zero dangling references? Attack the `apiError.ts` split spec: which exact symbols are live for wasm errors?
2. **N=5 kill blast radius**: any consumer beyond the embed + SIZES + glyphPaths (py tests, data tooling, docs, benches) that references N=5/25×25?
3. **Wave-ordering hazards**: does anything in W1 (PyO3 0.29, dist-info rename) collide with W2's py-runtime retarget landing one wave later? Should the rename ride W1 or W2?
4. **W5/W6 interaction**: do the cache-header beats and the PWA precache config contradict? Specify the SW strategy for the hashed wasm asset.
5. **P1 gate sufficiency**: does the 116-board uniqueness sweep cover every `parse_puzzle_field` consumer (template pipeline, difficulty_parity, wasm gen), or does sparse-format acceptance need a wider net?
6. **Substrate semver**: is 0.3.0 right for a pub-API removal set of this shape; do the bbnf sync-gate tripwires fire; is the vendored-copy check spec'd tightly enough to be a real precondition?
7. **Affordance interlocks**: does `?board=` collide with `useUrlState` precedence, the futoshiki param-accretion quirk, or the PWA `start_url`? Does undo's `preventDefault` regress any verified keyboard behavior (K-peek exemption, roving tabindex)?
8. **Hardening slate coherence**: is the verify-33-amended slate internally consistent as authored into W5 (H1 specificity bullet vs the H1 tint values; H5(b) toast vs the `role=alert` a11y contract)? Confirm the R3/verify-33 delta needs only the one owner line (Residual #7).
9. **Kernel-beat risk**: can the singletons-Vec fuse or the adjacency scratch regress the GAC warm-start/scratch invariants (`GacScratch`, matching cache)? Name the exact invariants a W3 gate must assert.
10. **W7 fold fidelity**: sample-audit the fold plan — does any live fact in the four CLAUDE.mds lack a named destination README section? Is the W2-adjusted plan (web/api CLAUDE.md dies with the package) sound?

---

*Deliverable of record: this file. Wave count 9 (T2-W0..W7 + GATE). Decisions: 23 EXECUTION-READY · 2 PROTOTYPE-GATED · 2 RETIRED-BY-R1. Prototypes: 7. Convergence: 89%.*
