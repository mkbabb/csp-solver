# Appendix C — Deferred disposition: the fold, the chronic set, the closes

The A13/A14 fold, dispositioned once. The owner mandate was **fold ALL deferred + chronic items**; exclusions permitted **only** for genuinely-trigger-blocked rows (device-gated, out-of-repo/never-push, or user-imperceptible prototype). Sources: **A13** = `audit32/A13-deferred-delineation.md` (the per-row fold shape, ledger `docs/tranches/2026-07-tranche-2/appendices/C-deferred-foldin.md` re-verified at HEAD), **A14** = `audit32/A14-chronically-deferred.md` (the cross-tranche chronic mining). Every row re-verified live at base `3b75eca2` by grep/measure.

**Shape vocabulary** (A13): FOLD-DO (land the small edit) · FOLD-DECIDE (implement-or-excise, no third defer) · FOLD-EXCISE-note (delete the consumer-less forward-decl — a no-legacy resolution that *shrinks* surface) · FOLD-MEASURE (run the gated measurement, then decide) · FOLD-VERIFY (run the held verification) · FOLD-EVALUATE (architectural spike then land) · EXCLUDE (trigger-blocked, justified).

---

## 1. The 27 folds, each mapped to its landing wave

A13's actionable set: **27 rows** — 11 engine, 12 FE/UI, 1 cross-cutting py, plus the 4-row FOLD-MEASURE cluster. Each is homed to the wave that lands it; the disposition traces to the reconciliation's unified decision set ([appendix A](A-decisions-and-kills.md)).

### Engine (Rust)

| ID | Item | Shape | Home |
|---|---|---|---|
| L25-02 | S1 TieredCostEval forward-decl note | FOLD-EXCISE-note | W3 |
| L25-03 | S2 `solve_with_warm_start` note | FOLD-EXCISE-note | W3 |
| L25-05 | S4 tracing-spans note (driver foreclosed) | FOLD-EXCISE-note | W3 |
| L25-07 | M4 `useCelestialSun` prerequisite note | FOLD-EXCISE-note (park stands) | W3 |
| L25-04 | S3 unified Constraint trait | FOLD-EVALUATE — through the sync-gate tripwire, never around it | W4 |
| L25-06 | N11 wall-clock budget + dead `Timeout` | FOLD-DECIDE → **RESERVE** (ballot Q2, R-3): variant kept with a `// reserved` note, no third defer | W4 |
| L25-17 | `optimization_mode` off the py wire | FOLD-DECIDE → note becomes permanent rationale (CLOSED) | W3 |
| L25-20 | `gac_alldiff` differential oracle | FOLD-VERIFY — stand up the oracle test | W6 |
| L25-19 | SudokuBoard `gridPaths`/`mulberry32` straddle | FOLD-EVALUATE — re-point onto `useBoilFrames`/`useBoilCache` (G3-supply confirmed) | W7/W8 |
| `propagate_stratified` | zero-caller SCC-stratified propagation | REMOVE + scoped backlog item (ballot Q2) | W3 (removal), WGATE (backlog filed) |
| stale examples | `parity_probe.rs`/`alloc_count.rs` (firm), `probe_futoshiki_gen.rs` (soft) — ~626 L | FOLD-DO (excise) | W3 |

### Frontend / pencil / UI

| ID | Item | Shape | Home |
|---|---|---|---|
| L25-29/34 | OD-2 taste placements + OD-1 dark-rim call | FOLD-DO — owner shots fired the triggers | W9/W10 (design) |
| L25-30/31/32 | Celebration 4th workstream · foil-gleam tail · grain bake hatch | FOLD-DECIDE/CONFIRM against the star shot | W9 |
| L25-33 | Band-A quantization enforcement | FOLD-EVALUATE | W7/W9 |
| L25-37/38 | Futoshiki caret · G4 a11y label | FOLD-VERIFY (confirm landed W5/W6) | W7 |
| apiError/solverError twins | genuinely-divergent owned copies per game | FOLD-EVALUATE — hoist the shared classifier to `games/shared/` (the three-home rule, Q3) | W7 |
| memoized/idle-chunked transition regen | @4× worst frame ~100-150 ms | FOLD-EVALUATE — the fix is runnable now; **G7 MEASURED** it at 99-103 ms (the only >100 ms gesture) | W8 |
| §G H7/H10 FE hardening | trigger = next FE hardening pass — this tranche is it | FOLD-DO | W7/W11 |
| C1/C2 `index.css` @layer extractions | HELD at W8 | FOLD-VERIFY → **DROP, HELD-again** (ballot Q4) — see §4 | W7 (record) |
| mobile digit pad | trigger = mobile usage evidence | FOLD-EVALUATE — build-or-formally-scope | W11 |
| `generate_templates.rs` N=5 arg-range refusal | trigger = next file touch | FOLD-DO | W3-adjacent (soft) |

### Cross-cutting (py)

| ID | Item | Shape | Home |
|---|---|---|---|
| L25-59 | `test_budget_exceeded_error_end_to_end` permanent skip | FOLD-DECIDE (with L25-06) — under RESERVE the variant has no constructor, so the two skipped tests are unexercisable → **delete both** | W4 (tests-py 27/2 → **27/0**) |

### The FOLD-MEASURE cluster (perf, dev-box-runnable — the trigger gated the *decision*, not the *measurement*)

| Item | Shape | Disposition |
|---|---|---|
| D20 set: CSR adjacency · Vec-indexed warm cache · GAC on/off policy | FOLD-MEASURE | ADOPT (CSR + Vec cache + `assigned_ns`) → W6; GAC on/off **REJECT** (default-ON stands, fresh evidence) |
| mimalloc / PGO / wasm `opt-level=s` | FOLD-MEASURE | **defer-closed** — see §3 |
| L25-36 Futoshiki N=7/N=8 cliff | FOLD-MEASURE | node-frozen; re-measure only on a strength change (chronic C13, still trigger-bound) |
| N=3-hard bank excision (3,591 B) | FOLD-MEASURE | device-gated (never run — the tranche-2 residual stands; conservative KEEP shipped) |

## 2. The true chronic set — deferred in BOTH prior tranches (A14)

A14's headline correction: **the candidate chronic list is mostly NOT chronic.** Seven of the eight seeded candidates (opt-level=s, H7/H10, TS 7.x, mobile digit pad, apiError/solverError twins, D20-set members, memoized regen) are **tranche-2-born** — zero presence in the tranche-1 tree (grep-proven). Only **mimalloc** from that list is chronic-in-both. Treating the candidate list as *the* chronic set imports a category error.

The genuine chronic set — intersecting tranche-1's surviving standing deferrals with tranche-2's re-deferred L25 rows (both-tranches DEFER/PARK), all 14 verified live at HEAD:

| # | Item | Age | Mandate capture | Disposition |
|---|---|---|---|---|
| C3 | S3 unified Constraint trait | ×2 | **structure (strong)** — the mandate IS the trigger the deferral lacked | FOLD-EVALUATE → W4, gate-routed |
| C12 | gridPaths/mulberry32 straddle | ×2 | **structure/UI (strong)** — cheap re-point | FOLD-EVALUATE → W7/W8 |
| C1/C2 | S1 TieredCostEval · S2 warm_start | ×2 | **library (weak)** — server abrogation retired the COP-route trigger | FOLD-EXCISE-note (the idiomatic move is *close*, not build) → W3 |
| C4/C5 | S4 tracing · N11 wall-clock | ×2 | **library (weak/moot)** — driver foreclosed; Worker owns budgets | S4 excise-note (W3); N11 → RESERVE (W4) |
| C7/C8 | mimalloc · PGO | ×2 | **perf (partial)** — capture the *decision*, not a blind adopt | defer-closed (§3) |
| C6 | event-lite priority model | ×2 | **perf (weak)** — user-imperceptible, "still last" | trigger-bound (unfolded) |
| C9/C10 | gac_alldiff oracle · SE/HoDoKu rater | ×2 | **no** (testing / product, off-axis) | oracle → W6; rater trigger-bound |
| C11 | M4 `useCelestialSun` | **×3 — the oldest** | **UI/library (conditional)** — needs a real 2nd consumer | healthily parked on a *documented failed gate*; the note dies (L25-07), the park stands (G3 §2b) |
| C13 | Futoshiki N=7/N=8 cliff | ×2 | **perf/product (conditional)** | node-frozen; fires only on a strength change |
| C14 | bbnf lattice confluence | ×2 | out-of-repo | never-push-bound; not csc411 authoring |

**The highest-leverage chronic fold** (A14 §3): the structure mandate *strongly* captures only C3 and C12; the library mandate is best spent **closing** the trigger-retired S4/N11 and putting S1/S2 to an explicit keep-or-prune call — a single disposition pass that *empties four chronic rows* rather than building them. This is the fold-all mandate reconciled with no-legacy: the idiomatic resolution of a consumer-less deferral is deletion.

## 3. The defer-closed set — mimalloc / PGO / opt-level-s

Three perf rows the reconciliation marks **CLOSED (defer-closed, recorded)** — homed to the WGATE record, not a work wave. The reasons, on evidence:

- **mimalloc** (C7, chronic ×2) — the D20 profile's own verified finding is that the *kernel beats* (singleton `Vec`s) were the real levers, already landed at T2-W3. mimalloc stays behind a real-workload A/B that no served size demands; it's also allocator-slot-conflicted with the `alloc-count` feature. Capture the decision (adopt-or-close), not a blind adopt → **close**.
- **PGO** (C8, re-scoped) — the Docker-stage home died at T2-W2; only a native profile-gen path remains, and no evidence it beats the current `opt-level=z` lean-wasm target. **Close.**
- **wasm `opt-level=s`** (D21, tranche-2-born) — +17% solve for +2.1 KB, in-budget; a runnable rebuild, but the lean artifact's whole reason is minimum bytes at the served ceiling. The `s`-vs-`z` cell doesn't earn the solve-time regression. **Close.**

All three enter the KISS ledger with named re-entry criteria (a measured duplicate cost at a served size, or a real-workload A/B trigger) — [appendix A §10](A-decisions-and-kills.md). GAC on/off re-litigation (D20's fourth member) is likewise **REJECT** — fresh evidence, default-ON stands.

## 4. The index.css HELD-again record (ballot Q4)

The C1/C2 `@layer`-partials extraction — chronic in the fold list, held at T2-W8 because automated gates can't prove layer-merge behavior-identity. Pass-2 (P2-T7/P2-L8) built **both** branches end-to-end; the owner ballot answered Q4 at the recommended option: **DROP, HELD-again.**

- **`index.css` stays monolithic.** The @import manifest + theme/utilities/print partials are not adopted.
- **The proof is banked, not discarded** — the byte-identity bundle (all four shas confirmed, including the distinct pre-fix `42c6c83f…` proving a real debug cycle) and the built font-URL smoke guard (validated PASS/FAIL/PASS against three real build states) live in the evidence dir. If the trigger re-fires, the work is done, not re-derived.
- **The hold re-opens on the same trigger only** — the critique default that decided it: net-zero runtime benefit against one new silent-404 footgun class, under the "long dirs" threshold. Same-trigger reopen, no new work either way.

The record lands in W7; this appendix is its durable home.

## 5. EXCLUDE — genuinely trigger-blocked (A13 §5, justified)

The only rows the fold-all mandate does **not** capture, each justified:

| Cluster | Justification |
|---|---|
| L25-08/41/42/43/44/46 (morph wires, publish/CI/remote, tier1_resample) · L25-39 bbnf lattice confluence · vendored-test prune | **OUT-OF-REPO + never-push** — live in `mkbabb/morph` / bbnf-lang's own sync-gate cycle; csc411 cannot land them |
| §8b bitset-parallel GAC (D23) | **user-imperceptible + prototype-gated** — ~0.3 ms on ~1 ms even at ceiling; the perf mandate is about *felt* performance, which this fails |
| TypeScript 7.x (D26) | **upstream toolchain block** — the TS7 native compiler needs Vue language-tools support that doesn't yet exist; not a decision csc411 can force |

**Note (A13):** the "trigger unfired" engine stubs (L25-02/03/05/07) are *not* excluded — their fold shape is note-excision, which the tranche does unilaterally. Exclusion is reserved for out-of-repo / imperceptible / upstream-blocked only.

## 6. Fold summary

- **27 rows folded** and wave-homed (§1) — 11 engine, 12 FE/UI, 1 cross-cutting py, + the 4-row MEASURE cluster.
- **14-row true chronic set** (§2) — the structure mandate strongly captures C3 + C12; the library mandate *empties* S1/S2/S4/N11 by closing not building; the rest stay trigger-bound-healthy (C11, the ×3 oldest, correctly parked on a named failed gate).
- **3 defer-closed** (§3, mimalloc/PGO/opt-s) with reasons + re-entry criteria.
- **index.css DROP, HELD-again** (§4) — proof banked, same-trigger reopen.
- **4 EXCLUDE clusters** (§5), each justified.
- **~30 no-op rows** already homed by tranche-2 (A13 §0) — not re-opened.

**Zero deferrals minted.** Every row lands, closes, or excludes with a justification; nothing re-books to a fourth tranche.
