# A13 — Deferred Delineation (fold list, per-row shape)

Source ledger: `docs/tranches/2026-07-tranche-2/appendices/C-deferred-foldin.md` @ HEAD `3b75eca2`.
Owner mandate: **fold ALL deferred items into tranche-III**; exclusions permitted **only** for genuinely-trigger-blocked (device-gated, out-of-repo/never-push, or user-imperceptible prototype) rows — each excluded row justified below.

Method: every ledger row re-verified at HEAD by grep/measure. Rows the ledger already closed/landed/excised/foreclosed need no action and are listed once (§0). The live corpus is the DEFER / RE-BASED-booked / RECORDED / §G rows.

Shape vocabulary:
- **FOLD-DO** — concrete small edit, land it.
- **FOLD-DECIDE** — implement-or-excise; the tranche picks one (no third "defer again").
- **FOLD-EXCISE-note** — resolution is deletion of a speculative forward-decl/note; no code built (no-legacy: a consumer-less stub-note is dead doc).
- **FOLD-MEASURE** — run the gated measurement/A-B on the dev box (runnable — the trigger only gated the *decision*, not the *measurement*), then decide.
- **FOLD-VERIFY** — run the held verification (visual-diff / differential-oracle), lift or confirm the hold.
- **FOLD-EVALUATE** — architectural/structural spike then land.
- **EXCLUDE** — genuinely trigger-blocked; justification per row.

---

## 0. Already homed — no fold action (verified resolved)

Closed/landed/excised/foreclosed at HEAD, confirmed:
- **Landed**: L25-11, L25-15, L25-16 (W3), L25-18 (W1), L25-24 (W1/2), L25-27 (W4), L25-40 (W3), L25-45/L25-50 (W0), L25-51/52 (W2), L25-53 (W3), L25-54 (W7), L25-55/56/57/58, and the census row *Engine-domains pencil marks* → **LANDED W6 `b36b7b9f`** (`git log`: "T2-W6 … beat 9's pencil marks").
- **Closed/struck**: L25-25, L25-26, L25-28 (struck — file absent), L25-35, L25-47, L25-48.
- **Excised/foreclosed (permanent)**: L25-01 (restart/CHS substrate excised at 0.3.0), L25-09 (keyframes.js excised W5), L25-10 (repo-split VOID), L25-23 (N=5-M/H + N=5-Easy killed), L25-21 (opt-level=z KEEP).
- **Web/api rows now moot**: `web/api` no longer exists (server abrogated; `ls web/` → `frontend` only). L25-59's test relocated to `csp-solver/tests-py/test_wheel_contracts.py:282` — see §3.

---

## 1. FOLD — engine (Rust)

| ID | Item | Verified state @HEAD | Shape |
|---|---|---|---|
| L25-02 | S1 TieredCostEval | Forward-decl note only, `csp-solver/src/solver/optimize.rs:10-11`; `CostDomain::min_cost` `Cell` cache is the standing answer; **zero consumer** beyond builder | **FOLD-EXCISE-note** — delete the deferred-item doc block; the cache is permanent, not "pending" |
| L25-03 | S2 `solve_with_warm_start` | Forward-decl note only, `optimize.rs:19`; no consumer | **FOLD-EXCISE-note** |
| L25-05 | S4 tracing spans | `grep tracing:: src/` → **zero hits**; moot since L25-01 foreclosed the observability driver | **FOLD-EXCISE-note** (retire the row) |
| L25-04 | S3 Unified Constraint trait | Trigger = ThreadSafe/sync-gate tripwire (bbnf). Architectural, in-repo | **FOLD-EVALUATE** — assess `ConstraintEnum`↔trait unification for elegance; the sync-gate is the guardrail, not a blocker (owner favors architectural transposition) |
| L25-06 | N11 wall-clock budget in `SolveConfig` | `config.rs:70-118` has `node_budget` + `cancel` only; `CspError::Timeout` is a **dead forward-decl** (`error.rs:59-63`, zero constructing call sites) | **FOLD-DECIDE** (paired with L25-59) — either wire a true `time_budget` into `SolveConfig` and un-skip the test, or excise the dead `Timeout` variant + its skipped test. No-legacy forbids leaving the dead variant |
| L25-12 | event-lite full priority model | Chronic "still last" | **FOLD-EVALUATE** (low priority; scope + land or formally excise) |
| L25-13 | mimalloc A/B | Off by default, `csp-solver/Cargo.toml:18` + `examples/alloc_count.rs:10,247` document the allocator-slot conflict; part of D20 set | **FOLD-MEASURE** — the A/B is a dev-box run, not device-gated |
| L25-14 | PGO | Docker home died W2; native profile-gen is the only shape; trigger unfired | **FOLD-MEASURE/EVALUATE** — native PGO run is runnable locally; measure the win, land or retire |
| L25-17 | R15 `optimization_mode` off py wire | `csp-solver/src/py/config.rs:59-70` — deliberately kept off; no py cost-aware consumer | **FOLD-DECIDE** — this is a *decided design choice*, not a live deferral: convert the note to permanent rationale (close it), or expose if a py consumer is planned |
| L25-20 | `gac_alldiff` differential-oracle | Hypothesis unverified; `csp-solver/tests/assignment_proptest.rs` present | **FOLD-VERIFY** — stand up the differential oracle test this tranche |
| L25-22 | SE/HoDoKu difficulty rater | Large, unbooked, no trigger; is a library feature (in mandate) | **FOLD-SCOPE** — spike only; may re-park as too-large, but owner ordered a fold so at minimum a scoping pass |

## 2. FOLD — frontend / pencil / UI

Owner screenshots (`owner-shots/`: `dropdown-border.png`, `solved-star.png`, `heart.png`) map directly onto the UI-taste cluster and are treated as fired triggers.

| ID | Item | Verified state @HEAD | Shape |
|---|---|---|---|
| L25-07 | `useCelestialSun` (M4) | Speculative "prerequisite for the lift" note only, `pencil/config/pencilConfig.ts:85`; no second consumer | **FOLD-EXCISE-note** (no consumer; retire the M4 note) |
| L25-19 | SudokuBoard `gridPaths`/`mulberry32` straddle | Confirmed imports `SudokuBoard.vue:8-9,99`; legal under direction rule | **FOLD-EVALUATE** — module-boundary tidy (owner module-structure mandate) |
| L25-29 | OD-2 taste placements | Owner re-points at review | **FOLD-DO** — owner is supplying shots; apply the placements |
| L25-30 | Celebration 4th workstream | chains=1 held; `pencilConfig.ts:267-270` celebration timeline; `solved-star.png` shot | **FOLD-DECIDE** — verify-or-drop the 4th workstream against the owner star shot |
| L25-31 | Foil-gleam tail | **Ships** — `pencilConfig.ts:294-295 gleamMs:400`; `CelebrationStar.vue:10-11` unconditional, "severable by design"; `solved-star.png` shot | **FOLD-CONFIRM** — owner review confirms ship-or-drop; the drop-lever is documented |
| L25-32 | Grain geometric bake escape hatch | Booked-**unused**, `pencilConfig.ts:182-183`; transition cut already landed W5 | **FOLD-DECIDE** — exercise or excise the dead hatch (no-legacy: unused config) |
| L25-33 | Band-A quantization enforcement | `pencilConfig.ts:39 quantizeGridMs:[125,150,175]`; scheduler tick-multiple residual | **FOLD-EVALUATE** — enforce quantization at the scheduler or confirm on-grid |
| L25-34 | OD-1 dark-rim taste call | No-glass default; **`dropdown-border.png`** owner shot is exactly this | **FOLD-DO** — owner taste call fired via the dropdown-border shot |
| L25-37/38 | Futoshiki caret / G4 a11y label | Ledger folded to W5/W6 already; re-verify at HEAD | **FOLD-VERIFY** (confirm landed, else FOLD-DO) |
| — (§G) H7, H10 | FE hardening items | Trigger = next FE hardening pass — **this tranche is it** | **FOLD-DO** — run the hardening pass (owner UI mandate) |
| — (§G) apiError/solverError twins | **Genuinely divergent owned copies** per game — `games/{sudoku,futoshiki}/solver/{apiError,solverError}.ts` (diff confirms 60-90% divergent prose); cross-game import is ESLint-forbidden | **FOLD-EVALUATE** — hoist the shared classifier to a non-game shared module (respects the boundary; exactly the "architectural transposition for simplicity" the owner wants) |
| — (§G) Memoized/idle-chunked transition regen | @4× worst frame ~100-150 ms (`generateGridBoilFrames` + 256 `wobbleRect`) | **FOLD-EVALUATE** — implement memoization; the fix is runnable now (only the *trigger* referenced user-felt) |
| — (§G) Mobile digit pad | Trigger = mobile usage evidence | **FOLD-EVALUATE** — real input-affordance gap under the UI mandate; build or formally scope |
| — (§G) C1/C2 `index.css` `@layer` extractions | **HELD at W8** `c14995eb`; both rules in `@layer utilities`/`base` (`index.css:230,409-427`); held because automated gates can't prove layer-merge behavior-identity | **FOLD-VERIFY** — run the visual-diff pass this tranche → lift the hold or confirm-keep |
| — (§G) `generate_templates.rs` N=5 arg-range refusal | `examples/generate_templates.rs` present; N=5 rejected at API per `generate.rs:110,129-133`; trigger = next file touch | **FOLD-DO** — touch the file, add the arg-range refusal (small) |

## 3. FOLD — cross-cutting (py test + budget)

| ID | Item | Verified state @HEAD | Shape |
|---|---|---|---|
| L25-59 | `test_budget_exceeded_error_end_to_end` permanent skip | `csp-solver/tests-py/test_wheel_contracts.py:282`, body `pass`; skip reason narrates the dead `CspError::Timeout` forward-decl | **FOLD-DECIDE (with L25-06)** — wire `time_budget` → un-skip, **or** excise dead `Timeout` variant → delete the skipped test. One dead-code resolution, not two |

## 4. FOLD-MEASURE cluster (perf, dev-box runnable — NOT device-gated)

These read as "trigger-blocked" but the trigger gated the *decision*, not the *measurement*. Owner perf mandate → run them.

| Item | Source | Shape |
|---|---|---|
| D20 set: CSR adjacency · Vec-indexed warm cache · mimalloc · GAC on/off policy | D20 | **FOLD-MEASURE** — run the real-workload A/B suite, decide each |
| wasm `opt-level=s` (+17% solve, +2.1 KB, in-budget) | D21 | **FOLD-MEASURE** — "re-derive the s cell before pulling" is a runnable rebuild; decide s-vs-z |
| L25-36 Futoshiki N=7/N=8 cliff | tranche-1 F2 | **FOLD-MEASURE** — re-run F2 to document the current cliff (behaviorally frozen, but the number is stampable) |
| N=3-hard bank excision (3,591 B) | verify-P1-P2 | **FOLD-MEASURE** — run gen p95; excise if ≤50 ms clears, else keep with a stamped rationale (the run "was never made" per W-GATE) |

---

## 5. EXCLUDE — genuinely trigger-blocked (justified)

| Item | Justification for exclusion |
|---|---|
| **L25-08** morph Float64Array wire; **L25-41** bbnf-buddy bump; **L25-42/43/44** morph publish/CI/remote; **L25-46** morph tier1_resample | **OUT-OF-REPO** — live in `mkbabb/morph` / bbnf-buddy post-excision; csc411 cannot land them |
| **L25-39** bbnf lattice behavioral confluence; **§G** Vendored-test prune completeness | **OUT-OF-REPO + never-push standing order** — belong to bbnf-lang's own sync-gate cycle; csc411 is source-of-truth but never pushes bbnf |
| **§8b bitset-parallel GAC** (D23) | **User-imperceptible + prototype-gated** — ~0.3 ms on ~1 ms even at full ceiling; folding builds speculative parallelism with no observable benefit. Owner perf mandate is about *felt* performance; this fails that bar |
| **TypeScript 7.x** (D26) | **Upstream toolchain block** — `package.json` at `typescript ~6.0.3`, `vue-tsc ^3.3.7`; the TS7 native compiler needs Vue language-tools support that does not yet exist. Genuinely external, not a decision csc411 can force |

Note: L25-02/03/05/07 are *not* excluded despite "trigger unfired" — their fold shape is **excision of the speculative note** (no-legacy resolution), which the tranche can do unilaterally. Exclusion is reserved for out-of-repo / imperceptible / upstream-blocked only.

---

## 6. Fold-list summary

- **FOLD (actionable this tranche): 27 rows** — 11 engine, 12 FE/UI, 1 cross-cutting py, plus the 4-row FOLD-MEASURE cluster (with wasm-s and N=3 counted once each here).
- **EXCLUDE (justified trigger-blocked): 4 clusters** — out-of-repo (morph ×5 + bbnf ×2), §8b parallel GAC (imperceptible), TS7.x (upstream).
- **No-op (already homed): ~30 rows** — §0.
- **Highest-leverage folds under the owner mandate**: L25-06+L25-59 (kill the dead `Timeout` path or wire the budget), apiError/solverError twin unification (module elegance), C1/C2 `@layer` visual-diff (lift the last W8 hold), D20 FOLD-MEASURE cluster (perf), and the UI-taste trio L25-29/34/30 keyed to the owner's three shots.
- **Structural motif**: the "trigger unfired" engine stubs (L25-02/03/05/07) are all **note-excisions**, not builds — folding them *shrinks* the surface, aligning fold-all with no-legacy.
