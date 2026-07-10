# A14 — Chronically Deferred: cross-tranche mining

Deliverable: the *true chronic set* — items deferred in **both** tranche-1
(`docs/tranches/2026-07-grand-uplift/`) and tranche-2
(`docs/tranches/2026-07-tranche-2/`) records — with age, original rationale,
and whether tranche-III's mandate (perf / library / UI / structure) now
captures each. Read-only; every row cited. Consumes pass-1 R7
(`scratchpad/tranche3/pass1/R7-tranche-record-mining.md`), not duplicated.

---

## 0. Headline correction — the candidate list is mostly NOT chronic

The task seeded a candidate chronic set: *opt-level=s, H7/H10, TS 7.x, mobile
digit pad, apiError/solverError twins, D20 set, memoized transition regen,
bitset-parallel GAC*. **Seven of these eight are single-tranche (tranche-2-born),
not chronic.** They all originate in tranche-2 appendix C **§G "New deferrals
opened by this tranche"** (`docs/tranches/2026-07-tranche-2/appendices/C-deferred-foldin.md:96-109`)
and have **zero** presence in the tranche-1 tree. Grep proof (files matching,
tranche-1 vs tranche-2, worktrees excluded):

| Candidate | tranche-1 files | tranche-2 files | Verdict |
|---|---|---|---|
| `opt-level=s` (D21) | **0** | 4 | tranche-2-born (×1) |
| H7 / H10 (verify-33/Q8) | **0** | 10 | tranche-2-born (×1) |
| TypeScript 7.x (D26) | **0** | 5 | tranche-2-born (×1) |
| mobile digit pad (L15 chain) | **0** | 4 | tranche-2-born (×1) |
| bitset-parallel GAC (§8b, D23) | **0** | 3 | tranche-2-born (×1) |
| apiError/solverError twins (D16) | 2* | 15 | tranche-2-born (×1) |
| memoized transition regen (verify-P3-P4) | — | 1 | tranche-2-born (×1) |
| **mimalloc** (in the D20 set) | **≥1** | ≥1 | **CHRONIC ×2+** ✓ |

\* The two tranche-1 `solverError` hits (`synthesis-pass3.md:45,141`,
`W6-deploy-c.md:23`) are about *building* the Worker `solverError.ts` product
artifact, **not** a twins-unification deferral. The twins-unification deferral
is genuinely tranche-2-born (D16, §G, `C-deferred-foldin.md:103`); R7 §1 already
established it "opened this tranche." So apiError/solverError twins = ×1.

**Only mimalloc from the candidate list is truly chronic.** The rest are
freshly-booked tranche-2 items — legitimate tranche-III fold candidates, but not
"chronic" by the deferred-in-both definition. Any tranche-III authoring that
treats the candidate list as *the* chronic set imports a category error. The
D20 non-mimalloc members (CSR adjacency, Vec-indexed warm cache, GAC on/off
policy) are likewise tranche-2-born (`Q9-kernel-beat-risk.md:21,96`; `synthesis-pass1.md:35`).

---

## 1. The TRUE chronic fold set (deferred tranche-1 AND tranche-2)

Derived by intersecting tranche-1's surviving standing deferrals
(`D-deferred-foldin.md:48`) with tranche-2's dispositions (the L25 rows in
`C-deferred-foldin.md`), keeping only rows that were **DEFER/PARK in both** —
i.e. re-deferred, never landed/excised/closed by tranche-2. Cross-checked
against tranche-2's own surviving-chronic roll-up (`C-deferred-foldin.md:119`:
"L25-07, L25-12, L25-13, L25-14, L25-19, L25-20, L25-22, L25-36, L25-39").

All 14 rows verified live at HEAD.

### Engine / library (csp-solver) — the S-series + N11 + perf-infra spine

| # | Item | tranche-1 → tranche-2 IDs | Age | HEAD verification |
|---|---|---|---|---|
| C1 | **S1 TieredCostEval** | D:S1 → L25-02 | ×2 (pre-tranche-1 "documented crate extension") | `CostDomain`/`OptimizationMode` substrate live: `csp-solver/src/domain/cost_finite.rs`, `solver/optimize.rs`, `config.rs`. Trigger (a cost-eval consumer beyond the builder) unfired. `C-deferred-foldin.md:10` |
| C2 | **S2 solve_with_warm_start** | D:S2 → L25-03 | ×2 | `warm_start` grep hits are the pre-seeded `Feasibility` adjacent substrate (`solver/search.rs`, `csp/solve.rs`), not the warm-start API. Trigger unfired. `C-deferred-foldin.md:11` |
| C3 | **S3 Unified Constraint trait** | D:S3 → L25-04 | ×2 | Gate-locked: `ThreadSafe` marker + sync-gate tripwire intact at `constraint/traits.rs:44-53` (R7 §5 verified). Reopens only *through* the gate. `C-deferred-foldin.md:12` |
| C4 | **S4 tracing spans** | D:S4 → L25-05 | ×2 | Confirmed never adopted: `grep tracing csp-solver/Cargo.toml csp-solver/src/` → **empty**. Driver foreclosed (chs-driver excised at 0.3.0), so the L25-01 observability note is moot. `C-deferred-foldin.md:13` |
| C5 | **N11 wall-clock budget in SolveConfig** | D:N11 → L25-06 | ×2 | `config.rs:78` ships `node_budget: Option<u64>` (node-count only); true wall-clock semantics unbuilt. **RE-BASED**: post-R1 the wasm/Worker path owns budgets. `C-deferred-foldin.md:14` |
| C6 | **event-lite full priority model** | D → L25-12 | ×2 | No `EventLite`/priority queue in `solver/`. "still last." `C-deferred-foldin.md:20`; tranche-1 origin `grand-uplift/D-deferred-foldin.md:48` + `C-sota-adoption.md` |
| C7 | **mimalloc A/B** (D20 set) | D (line 48) → L25-13 (D20) | ×2, marked "(chronic)" | **NOT a dependency** — `Cargo.toml:16-18` documents it only as a *future* `#[global_allocator]` the `alloc-count` feature reserves the slot against. DEFER per D20: the verified L26 profile re-prioritized the kernel beats (landed W3); mimalloc stays behind a real-workload A/B. `C-deferred-foldin.md:21` |
| C8 | **PGO** | (grand-uplift) → L25-14 | ×2, re-scoped | **RE-SCOPED**: Docker-stage home died in W2; only a native profile-gen path remains viable; trigger unfired. `C-deferred-foldin.md:22` |
| C9 | **gac_alldiff differential-oracle** | (tranche-1 read) → L25-20 | ×2, tripwire | `tests/gac_kernel_beats.rs` exists but no differential oracle vs a reference solver. bbnf's *vendored* `tests/gac.rs` rotted against 0.2.0 (pruned W3); the csc411-side read stays booked. `C-deferred-foldin.md:33` |
| C10 | **SE/HoDoKu-class difficulty rater** | (tranche-1) → L25-22 | ×2 | No rater in `csp-solver/src/` (grep for HoDoKu/rate_difficulty → empty). "large, unbooked, no trigger." `C-deferred-foldin.md:35` |

### UI / frontend

| # | Item | IDs | Age | HEAD verification |
|---|---|---|---|---|
| C11 | **M4 useCelestialSun** (pencil-boil sun-glyph export) | 2026-06-02:BOOK → tranche-1 M4 → L25-07 | **×3 — the oldest chronic** | Born in `docs/tranches/grand-audit-2026-06-02.md:80` (orange-sun mascot → pencil-boil, ≥2-consumer gate). PARKED on a **failed gate**, not neglect: no real 2nd consumer wants the sun glyph. `C-deferred-foldin.md:15` |
| C12 | **SudokuBoard gridPaths/mulberry32 straddle** | (tranche-1) → L25-19 | ×2, marked "(chronic)" | `mulberry32`/`gridPaths` still straddle `games/sudoku/SudokuBoard/SudokuBoard.vue` (+ `pencil/grid/HandDrawnGrid/`). Legal under the direction rule; "re-point cheaply if a wave touches the file." `C-deferred-foldin.md:32` |
| C13 | **Futoshiki N=7/N=8 cliff** | (tranche-1) → L25-36 | ×2, marked "(chronic)" | Futoshiki N is live surface (`games/futoshiki/types.ts`, `useFutoshiki.ts`). Behaviorally node-frozen (Q9 P5) — re-measure only fires on a propagation-strength change. `C-deferred-foldin.md:54` |

### Out-of-repo / bbnf (chronic but outside the mandate's reach)

| # | Item | IDs | Age | Note |
|---|---|---|---|---|
| C14 | **bbnf lattice behavioral confluence** | (tranche-1) → L25-39 | ×2 | `--verify`'s test stage is the practical check; never-push-bound. Out of csc411 authoring reach. `C-deferred-foldin.md:57` |
| — | morph Float64Array wire; morph publish/CI/remote; keyframes engine export-split | L25-08, L25-41–46, L25-09 | ×2 | All **OUT-OF-REPO** post-excision (`mkbabb/morph`) or **MOOT** (keyframes.js excised wholesale W5, R8). Not tranche-III work. `C-deferred-foldin.md:16-17,64-67` |

**Note on excised chronics (closed, do NOT re-open as chronic):** L25-01
restart/CHS driver (×2, FORECLOSED — substrate excised at 0.3.0), L25-10
csp-solver repo split (×2, EXCISED VOID), L25-23 N=5 Medium/Hard (chronic
re-litigation, EXCISED permanent, do-not-reopen clause). L25-11 iai-callgrind
(chronic, never-executed) **landed W3**. L25-45 tracked `.env` (chronic
W0→W5→live) **landed W0**. These are chronic-history rows that tranche-2 *closed*
— citing them as open chronics would be a regression.

---

## 2. Mandate-capture assessment (tranche-III: perf / library / UI / structure)

Does tranche-III's mandate — *performance, library, UI, module structure; no
legacy code; idiomatic gestalt; architectural transpositions for elegance* — now
**capture** (i.e. supply a reason to action) each chronic item, or does the item
still lack its own trigger?

| # | Item | Mandate axis | Captured? | Reasoning |
|---|---|---|---|---|
| C3 | S3 Unified Constraint trait | **structure** | **YES (strong)** | This is precisely an "architectural transposition for elegance/simplicity." The mandate is the trigger the deferral lacked — *but* it must land **through** the `ThreadSafe`/sync-gate tripwire (`traits.rs:44-53`), never around it. High-value structural fold. |
| C12 | gridPaths/mulberry32 straddle | **structure/UI** | **YES (strong)** | Colocation/encapsulation is the mandate's core; a cheap re-point. Tranche-III's "no legacy, idiomatic" bar directly captures a known cross-layer straddle. |
| C7 | mimalloc A/B | **perf** | **partial** | Perf mandate captures the *question*, but D20's own verified profile says the kernel beats (singletons `Vec`) were the real levers — already landed W3. mimalloc is low-ROI until a real-workload A/B trigger fires. Worth a *decision* (adopt-or-close), not a blind adopt. |
| C8 | PGO | **perf** | **partial** | Re-scoped to native profile-gen only. Mandate could authorize a native profile harness, but no evidence it beats the current opt-level=z lean-wasm target. Decision, not action. |
| C6 | event-lite priority model | **perf** | **weak** | User-imperceptible; "still last." Perf mandate technically covers it but ROI is near-zero for served sizes. |
| C1 | S1 TieredCostEval | **library** | **weak** | Library-surface question — but no consumer beyond the builder, and server-abrogation removed the COP route surface. Tranche-III could *close* it (prune the dead COP surface) rather than build it — that's the more idiomatic move. |
| C2 | S2 solve_with_warm_start | **library** | **weak** | Trigger unfired; same close-or-keep call as S1. The `Feasibility` substrate is the adjacent shape if ever built. |
| C4 | S4 tracing spans | **library** | **weak** | Driver foreclosed (chs excised); observability need moot. Candidate for permanent close, not fold. |
| C5 | N11 wall-clock budget | **library** | **weak/moot** | Post-server-abrogation the Worker owns budgets; the wall-clock need is largely retired. Candidate for close. |
| C11 | M4 useCelestialSun | **UI/library** | **conditional** | UI+library mandate captures it *iff* a real 2nd consumer (fourier/bbnf wanting the sun glyph) exists — the mandate doesn't manufacture the consumer. Still gated on the ≥2-consumer trigger. Oldest chronic (×3) but healthily parked. |
| C13 | Futoshiki N=7/N=8 cliff | **perf/product** | **conditional** | Node-frozen; re-measure only on a strength change. If tranche-III changes propagation strength (e.g. the bitset-parallel GAC candidate), this fires as a rider. |
| C9 | gac_alldiff oracle | testing | **no** | Correctness/testing, not a perf/UI/structure axis. Booked, tripwire-guarded. |
| C10 | SE/HoDoKu rater | product | **no** | Large, unbooked, no trigger; outside the four axes. |
| C14 | bbnf lattice confluence | out-of-repo | **no** | Never-push-bound; not csc411 authoring. |

**Mandate-captured chronic fold list (action-worthy this tranche), ranked:**

1. **C3 S3 Unified Constraint trait** — structure; strong capture; gate-routed.
2. **C12 gridPaths/mulberry32 straddle** — structure/UI; strong capture; cheap.
3. **C1/C2/C4/C5 (S1/S2/S4/N11)** — library; the idiomatic move is
   **decide-and-often-close**, not build: the server abrogation + chs-driver
   excision retired most of their triggers. A single "chronic library-surface
   disposition" pass could close S4 and N11 outright and put S1/S2 to an
   explicit keep-or-prune call. This is the highest-leverage fold — it *empties*
   four chronic rows.
4. **C7 mimalloc / C8 PGO** — perf; capture the *decision* (adopt-or-close
   with the D20 profile as evidence), not a blind adopt.

**Chronic items the mandate does NOT capture (leave trigger-bound):** C6, C9,
C10, C13, C14, C11 (until 2nd consumer). C11 (useCelestialSun) is the standout —
×3, the oldest, but its park is on a *documented failed gate* with a named
re-trigger, the correct disposition; tranche-III should not force it.

---

## 3. One-paragraph fold recommendation for tranche-III authoring

The genuine chronic set is the **S-series library spine (S1/S2/S3/S4) + N11 +
the perf-infra pair (mimalloc/PGO) + three FE/product straddles (gridPaths,
useCelestialSun, Futoshiki cliff) + two engine tests/raters**, not the
tranche-2-born candidate list. Of these, tranche-III's structure mandate
*strongly* captures only **S3 (unified Constraint trait, gate-routed)** and
**C12 (gridPaths straddle, cheap re-point)**; its library mandate is best spent
**closing** the now-trigger-retired S4/N11 and putting S1/S2 to an explicit
keep-or-prune call (server abrogation killed most of their reasons to exist);
its perf mandate should *decide* mimalloc/PGO against the existing D20 profile
rather than adopt blind. Everything else (event-lite, difficulty rater,
Futoshiki cliff, useCelestialSun, bbnf confluence, out-of-repo morph/keyframes)
stays healthily trigger-bound — the mandate supplies no fresh trigger, and
tranche-2's roll-up already verified each carries owner + trigger with zero
orphans (`C-deferred-foldin.md:127`).
