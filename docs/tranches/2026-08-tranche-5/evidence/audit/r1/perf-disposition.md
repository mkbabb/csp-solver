# perf-disposition — the 29 audit rows, the designed-not-built ledger, the gate map

**Lane:** T5 audit r1 · performance-rows auditor. **Read-only**: no source, config, process or
port touched; nothing committed, deployed or published.

**Tree stamp.** HEAD `71456713` (2026-08-01, "CI-RED 30690204551: the empty bake is the runner's").
The audited pre-execution perf audit is stamped `ed35b347` (2026-07-12, "T4 §7: the pre-execution
perf audit stamped — 29 rows, zero refutations"); the P1 Safari/iOS patch runs
`a46c86e6` → `23e3dc00` with seal `6800af04` (all verified present via `git log -1`).

**Sources read in full.** `docs/tranches/2026-07-tranche-4/evidence/perf/{p1-safari-load,
p2-solver-backend,p3-wasm-facilities,crit-perf-audit}.md`;
`docs/tranches/2026-07-tranche-4/patches/p1-safari-ios-performance/{README.md,gates.json,
waves/p-w2-pencil-boil.md,waves/p-w3-adoption.md,waves/p-w4-validate-deploy.md,
evidence/research/r3-cure-design.md,evidence/p1/README.md}`;
`docs/tranches/2026-07-tranche-4/{README.md §7,WGATE-record.md §3.1/§9.1}`.

**Row count.** 29 = p1 7 + p2 10 + p3 12, per `crit-perf-audit.md:180-185` (the tally table).

**Live-tree caveat, disclosed.** `docs/tranches/2026-08-tranche-5/evidence/design-loop/` went
from absent to 2218 files *during* this pass (a concurrent lane writing pass-3/pass-4 evidence;
`git status --short` reports the whole path `??`). §2 row DNB-14 and §4 depend on that tree and
are stamped as of this read.

---

## 1. THE 29 ROWS — stated disposition then, landed status now

Legend: **LANDED** = the disposition's own action is present in tree/git · **PARTIAL** = the
action landed but a stated clause of it did not, or a superseding record contradicts it ·
**UNADDRESSED** = no trace. Rows dispositioned CLEAN or REJECTED carry a *no-action* obligation;
they are LANDED when the tree still holds the certified state and nothing was silently changed.

### 1.1 p1-safari-load — 7 rows

| # | row | stated disposition (then) | status | evidence |
|---|---|---|---|---|
| p1-1 | CPU gate re-anchor / measurement truth | `[NEW-ROW]` — drop "208% top-interval", anchor two numbers. Crit **CORRECTED**: it is a FOLD-INTO-W1 gate-wording fix; keep the real-Safari ~175–194% headline; reject re-anchoring to ~640% playwright | **PARTIAL** | The re-anchor landed at the tranche level: `docs/tranches/2026-07-tranche-4/README.md:223` — "real-Safari ~175–194% GPU-process CPU is the citable severity (playwright-headless ~640% cputime-delta is a proxy footnote)". It did **not** land in the owning wave file: `waves/T4-W1-perf-bake-once.md:15,81,87,138` still carry "≈ 208% (top-interval)" as the gate anchor, incl. the `webkit-cpu` gate row (`:87`) the crit named. Kill-list item 2 ("strike the [NEW-ROW] class → FOLD-INTO-W1") is honoured by README §7 folding it into the W1 bullet |
| p1-2 | 16×16 deal render hitch = D7/W8 mount idle-chunking | `[FOLD-W1]` — crit **CONFIRMED**; README §7 resolved it **FOLD into W1's raster-stack mount path, not retire** | **PARTIAL — contradicted in the record of record** | `README.md:223` says FOLD-not-retire; `WGATE-record.md:75` closes the same D7/W8 row as **"DECIDED-retire-with-measurement"** citing `T4-W1-perf-bake-once.md` §W8-idle-chunking. Two in-tree records, opposite dispositions, same row. The *measurement* obligation landed (89 ms@1× / 355 ms@4× banked); the fold did not. Note the later P1 patch re-attributed a neighbouring stall to the raster-stack re-bake (§2 DNB-14), so the retire rationale is now contestable |
| p1-3 | WebKit grid boil raster-latency-bound under load | `[FOLD-W1]` — the bitmap pose cache attacks the true bottleneck | **LANDED** | W1's bake shipped and the *superseding* P1 patch re-measured the true root cause on real Safari: `WGATE-record.md:243` — 63–81 live glyph filters, cured by deletion; production idle 97.6–97.8 fps, GPU 10.4 → 4.24 CPU-s/30 s idle (`WGATE-record.md:247`) |
| p1-4 | Toggle/Bloom degrades first under Chromium load | `[REJECTED-quality]` — banked datum, no action | **LANDED (no-action honoured)** | The Bloom survives untouched; P-W3 `waves/p-w3-adoption.md:120-127` records that Group B's `transition:none` does **not** touch the `@keyframes` Bloom (button scale 0.941@45 ms → 1@135 ms measured). No thinning of the live warp anywhere |
| p1-5 | Cold-load unaffected by precache death | `[CLEAN]` — W3-confirming, no W1/W5 action | **LANDED (no-action)** | No SW/precache re-introduction; nothing in the P1 waves or CI touches the cold path. Crit marked this CONFIRMED-plausible and did not re-run it (Slow-3G rig); no in-tree contradiction |
| p1-6 | Preload hygiene — per-game-worker-only + single wasm fetch | `[FOLD-W1]` | **LANDED** | `web/frontend/vite.config.ts:148-170` — modulepreloads **only** the active game's worker chunk, and the plugin **throws** if the `solveSudoku` discriminator matches ≠1 worker (`:166`), so drift reds the build. `:171-175` — the wasm `<link rel=preload as=fetch>` is deliberately absent with the reason written (a Worker cannot consume the document preload cache) |
| p1-7 | idle-solved stays GPU-pinned + the murmur's full-viewport damage | `[FOLD-W1]` | **LANDED** | The murmur's grain re-raster died with the filter itself: `src/pencil/glyph/HandwrittenGlyph.vue:50-51` — "the glyph's `url(#grain-static)` reference filter and the whole `grainOn` hoist apparatus are GONE" (commit `6b8c1ffd`). `contain: paint` retained per the P-W3 inventory |

### 1.2 p2-solver-backend — 10 rows

| # | row | stated disposition (then) | status | evidence |
|---|---|---|---|---|
| p2-1 | P2-SPINE — node spine 40513→4678 + GAC 13.84× | `CLEAN`; crit **CORRECTED** — bank the deterministic node ratio **8.66×**, retire the wall multiplier from citation | **LANDED** | `docs/benchmarks.md:21` — "Search nodes, off → on \| 40,513 → 4,678 (8.66× fewer) \| ibid. (deterministic)". Grep for `13.84`/`12.84` across `docs/*.md` + `README.md` returns **zero** — the load-variant wall figure is gone from every citing surface |
| p2-2 | P2-GEN16 — 16×16 is corpus fast-path, not a stall | `CLEAN` (refutes the stall hypothesis) | **LANDED** | README §7 records the refutation ("16×16 is a corpus fast-path — the stall hypothesis is refuted", `README.md:230`). Embedded template bank still ships (`include_dir!` surface, MEMORY key-patterns) |
| p2-3 | P2-GENREUSE — reuse the CSP skeleton across hole candidates | `NEW-ROW (→W6)`; crit **CORRECTED** the gain to "large alloc / modest once-per-deal wall", identity-gated | **LANDED** | `csp-solver/src/puzzles/sudoku/generate.rs:266-276` — "Build the finalized CSP skeleton once … reuse it. This elides the per-candidate `Csp::new`/`add_all_different`/…", `let mut csp = sudoku_csp_skeleton(n);`. Also at `:373,:390` (the `PuzzleClass` deal paths). `sudoku_csp_skeleton` imported at `:12`. The identity argument is written into the comment at `:274` |
| p2-4 | P2-VALUES — per-node `values` Vec → SmallVec | `NEW-ROW` (small) | **LANDED (mechanism substituted, honestly)** | `csp-solver/src/solver/search.rs:~250` — "Per-node value snapshot: taken inline (no heap) for any domain that fits the 16-slot buffer … larger domains spill to the heap exactly as the former `Vec` did. Same values in the same iteration order". Shipped as an inline 16-slot buffer rather than the named `SmallVec` type; `smallvec` is nonetheless a workspace dep (`Cargo.toml:35`, `csp-solver/Cargo.toml:32`). Gain and identity clause both satisfied |
| p2-5 | P2-MRV — precompute frozen wdeg | `NEW-ROW (low)` | **LANDED** | `csp-solver/src/ordering.rs:22-48` `precompute_var_wdeg`; `:83-90` "Mrv branches on `dom / wdeg`; `wdeg` is the precomputed frozen sum". The row's *latent hazard* clause landed too as a written invariant: `:34-37` "**Frozen-weight invariant.** If a later tranche wires dom/wdeg bumping … it must recompute — or incrementally patch — the affected `var_wdeg` entries" |
| p2-6 | P2-GACCORE — Régin core at optimum | `CLEAN` | **LANDED (no-action)** | No lever taken; the core (`propagate_gac_core`, pooled `GacScratch`, flat CSR) is still the largest twiggy item per p3-r2 and unmodified in intent. No contradicting change found |
| p2-7 | P2-TLSCRATCH — `with_singleton_buf` thread-local | `CLEAN` (uncertain gain, touches revise() API) | **LANDED (no-action)** | `csp-solver/src/constraint/scratch.rs` still holds the sanctioned T3/L26 thread-local shape; no kernel-owned rewrite landed |
| p2-8 | P2-RELPROFILE — native release LTO/cgu/strip | `CLEAN` (W5-homed; T15 refutation stands) | **LANDED** | `Cargo.toml:67,91-92` still documents the refutation in place — "override `strip` back off (see the D9 strip↔wasm-opt hazard note)"; "…hard-breaking the `-Oz` wasm-opt pass (the D9 strip↔wasm-opt hazard, reproduced on the real crates twice)" |
| p2-9 | P2-PGO | `CLEAN` (rejected on cost) | **LANDED (no-action)** | No PGO flow anywhere in `Cargo.toml` or `.github/workflows/ci.yml` |
| p2-10 | P2-GENSHORT — dig short-circuit / reorder | `REJECTED-quality` | **LANDED (no-action)** | The dig retains its uniqueness-by-construction shape; `generate.rs` reuse row (p2-3) explicitly preserves the dig sequence rather than reordering it (`:274` "which the reuse cannot perturb") |

### 1.3 p3-wasm-facilities — 12 rows

| # | row | stated disposition (then) | status | evidence |
|---|---|---|---|---|
| p3-r1 | size truth lean 86,746 / full 188,095 B | `CLEAN` | **LANDED, figures superseded** | Both bands are gate-enforced today, but the audited *numbers* are two-game-era. Current lean on disk = **122,385 B** (`csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm`), against the five-game band `fail >127,500 B` (`ci.yml:444-467`). Full band `fail >240 KB / warn >230 KB` (`ci.yml:419-431`). The CLEAN disposition (no prune) holds; any citation of "86,746 B" as current is stale |
| p3-r2 | twiggy top-10, no clean prune | `CLEAN` | **LANDED (no-action)** | No prune attempted; twiggy still runs in CI at `ci.yml:419` (`twiggy top -n 25 … \|\| true` — informational, the *band* is the gate) |
| p3-r3 | panic/console_error_panic_hook prune | `REJECTED-quality` | **LANDED (no-action honoured)** | `csp-solver/wasm/src/lib.rs:60-67` still installs it ("so a Rust panic surfaces as a…", `console_error_panic_hook::set_once()`); dep retained at `csp-solver/wasm/Cargo.toml:21` |
| p3-r4 | instantiate cost 0.163 + 0.036 ms | `CLEAN` | **LANDED (no-action)** | No change to the instantiate path; `prewarm()` on idle callback still the shipped shape |
| p3-r5 | propagate chatty path, 150 ms debounce, zero-copy | `CLEAN` | **LANDED (no-action)** | Debounce + hold-to-peek gate unchanged; no JSON introduced on any hot path |
| p3-r6 | deal path flat Uint32Array, once/board | `CLEAN` | **LANDED (no-action)** | — |
| p3-r7 | flat typed-array protocol already in place | `CLEAN` | **LANDED (no-action)** | — |
| p3-r8 | SIMD | `REJECTED` (measured no-op + capability floor) | **LANDED (no-action)** | No `target-feature=+simd128` in any shipped recipe: `ci.yml` lean build uses the EXACT ship recipe (`:360`), `csp-solver/wasm/Cargo.toml:62-63` `wasm-opt = ["-Oz", "--enable-nontrapping-float-to-int"]` only |
| p3-r9 | bulk-memory flag redundant | `FOLD-W5` | **LANDED** | `csp-solver/wasm/Cargo.toml:56-57` — "`--enable-bulk-memory` is **RETIRED**: rustc 1.97 enables bulk-memory in its default wasm32 target features"; the flag is absent from the live array at `:63` |
| p3-r10 | reference-types / multi-value byte-identical | `CLEAN` | **LANDED (no-action)** | Neither flag present in the wasm-opt array (`:63`) |
| p3-r11 | wasm-opt `-Oz` smallest and fastest | `CLEAN` | **LANDED** | `-Oz` is still the first element of the live wasm-opt array (`csp-solver/wasm/Cargo.toml:63`); `:50` records the measured `.profile.custom` dependency (86,734 → 87,496 B if dropped) |
| p3-r12 | threads (rayon + SAB) | `REJECTED` (COOP/COEP cost) | **LANDED (no-action honoured)** | `grep -rn "Cross-Origin" web/frontend/public/_headers` returns **nothing** — no COOP/COEP headers were added, so the rejection's premise is intact |

### 1.4 Row tally

| status | p1 | p2 | p3 | Σ |
|---|--:|--:|--:|--:|
| LANDED | 5 | 10 | 12 | **27** |
| PARTIAL | 2 | 0 | 0 | **2** |
| UNADDRESSED | 0 | 0 | 0 | **0** |

Both PARTIALs are **record defects, not code defects** (p1-1 a stale gate anchor left in the
owning wave file; p1-2 two in-tree records closing the same row opposite ways). No row's
*engineering* action is missing.

---

## 2. DESIGNED-NOT-BUILT LEDGER

Every cure that was specified to the level of an API, a file, or a named edit and then not
built. Each row carries where it was designed, why it wasn't built, its named re-entry trigger
(where one exists), and the tree proof that it is absent. Library absence verified against the
resolved package: `web/frontend/node_modules/@mkbabb/pencil-boil@0.10.1/src/` ships exactly
`{boilHoldGate, celestial, easings, frames, index, path, random, raster, vue}.ts` — no
`engine.ts`, no `governor.ts`, no `poseLayers.ts`, no `grain.ts`.

| id | designed item | designed at | why not built | trigger | absence proof |
|---|---|---|---|---|---|
| DNB-1 | **F3 `src/grain.ts`** — `GrainConfig`, `grainNoise`, `bakeGrainPoints`, `grainStrokeD(d, grain, seed)`, ~140 LOC, fixed per-char sample count invariant | `p-w2-pencil-boil.md:27-35` (conditional on the ballot) | G2.4 ruled **C/C/C**; the bake was refuted by its own artifact (SSIM ranked clean deletion closer to the incumbent than the bake in all four engine×theme cells) | reopening the glyph-grain question | `grep grainStrokeD` over pencil-boil `src/` = 0 hits; `p-w2-pencil-boil.md:96` "**F3 (grain.ts) is therefore never built**" |
| DNB-2 | **Candidate A — `src/engine.ts`**: `EngineProfile` (5 capability fields), `engineProfile()`, `useEngineProfile()`, `setEngineProfile()`, `BoilCapability`, `profiledFrameCount(base, need)`; ~80 LOC + 4 call sites | `r3-cure-design.md:469-528` (full signature block) | Refused — "two consumers, both shipped and working; substrate wearing an API" | **a third engine-gated surface** | `README.md:60-62`; `grep engineProfile\|profiledFrameCount` pencil-boil `src/` = 0 hits |
| DNB-3 | **Candidate B — `src/poseLayers.ts`**: `PoseLayer` iface + `usePoseLayers(stack, opts)` (HTML-box pose hoist), ~120 LOC library + 4 surfaces re-templated | `r3-cure-design.md:574-604` | **Falsified by measurement** — ablation `a2` (pinning the grid's bitmap flips) bought +0.5 fps and zero GPU seconds; post-cure idle sits at the display ceiling | none (dead) | `README.md:63-65`; `grep usePoseLayers` = 0 hits |
| DNB-4 | **Candidate C — `src/governor.ts`**: `BeatGovernorOptions`/`BeatGovernor`/`installBeatGovernor`, `idleParkMs`, wake-signal set, ~60 LOC + one `App.vue` install | `r3-cure-design.md:606-649` | Refused — its prize was the idle beat train, and the deletion cure already takes idle to the ceiling (98.44 desktop / 60.03 sim, long33 0) | **a real iPhone idling below 55 fps at default state post-P-W3** | `README.md:66-70`; `grep installBeatGovernor` = 0 hits |
| DNB-5 | **`schedulerDebugInfo()` gains `governed` + `parkedByGovernor`** — the rig's discriminator between idle-parked and between-beats-parked | `r3-cure-design.md:651-652` | strictly downstream of DNB-4 | with DNB-4 | not in pencil-boil `src/`; the app's only relation to the symbol is the prod-shake gate that asserts it *absent* from the bundle (`scripts/check-prod-shake.mjs:25`) |
| DNB-6 | **`RasterStackHandle.urls` + `resetUrls()` fold** — move the ImageBitmap→objectURL→atomic-swap→revoke lifecycle (hand-rolled 3× in the app) into `useRasterStack` | `r3-cure-design.md:530-557` (full doc-commented iface) | Refused — "real duplication … but working, defect-free, and 0.10.0 already changes what every bake captures — two variables, one bake" | **the next pose-stack consumer, or the first URL leak** | `README.md:65-66`; `grep resetUrls` pencil-boil `src/` = 0 hits |
| DNB-7 | **`RasterStackOptions.dpr` defaulting to `min(devicePixelRatio, engineProfile().maxBakeDpr)`** — the T4-WM grid DPR cap generalized so a surface opts *out* | `r3-cure-design.md:562-571` | downstream of DNB-2; and the DPR cap itself was refused (DNB-9) | with DNB-2/DNB-9 | pencil-boil `vue.ts` takes `dpr` but derives no profile default |
| DNB-8 | **Candidate E — the WAAPI accelerated beat**: per-layer infinite `opacity` animation, `steps(n)`, one module-level pinned `startTime` | `r3-cure-design.md:410-429` (booked, not built, by its own author) | Refused — downstream of DNB-3, and ~24 permanently promoted layers is the residency failure `a13` already measured as a mobile regression | after B lands **and** with an iOS layer-residency budget in hand | `README.md:71-72`; no WAAPI beat driver in `src/pencil/composables/boilBeat.ts` |
| DNB-9 | **Logo/toggle DPR cap** (§4.6's ~1.8 MB iOS residency win) | `r3-cure-design.md:247-253` | Refused — "mark 4 is the owner saying these are too soft; capping trades the sharpness being shipped" | **E7 — a device layer/backing-store census** | `README.md:80-81`; the Apple cap remains grid-only (`p-w3-adoption.md:184` "the Apple DPR-cap asymmetry stand[s] as the wave directed") |
| DNB-10 | **`@animationend.self` class drop** on the revealed cell (the second half of r3 §4.1) | `r3-cure-design.md:168-177` | Refused — "trades 81 finished animation objects for 81 listeners; the retained *effect* is what promotes, and `backwards` removes the effect". Only the fill-mode half shipped | the re-reveal replay wrinkle (hint-then-Solve) is **banked as its own defect with a trigger** | `README.md:75-77`; `src/assets/index.css:695` carries `animation-fill-mode: backwards` and no `animationend` handler exists on the cell root |
| DNB-11 | **Clearing `animatingCells`** | `r3-cure-design.md:171-173` | Refused — breaks the `celebrating` derivation; "the fill cure lives in CSS, never the store" | none | `README.md:78`; `useGameState` untouched by P-W3 |
| DNB-12 | **Outline bake (E3)** — bake `HandDrawnOutline`'s 3–4 instances (the largest remaining per-beat dirty area, ~2.09 Mpx each at iPhone DPR3) | `r3-cure-design.md:300-303, 672-674` | Refused against a number — ablation `a9`, the estate-wide upper bound, moved idle **+2.9 at a ±2 noise floor**. "Not the bill" | none stated | `README.md:82-83` |
| DNB-13 | **The control-panel twin `v-if`** (banked conditional) | `p-w3-adoption.md:35-37` | **BUILT — trigger fired.** Listed here only to close the ledger honestly | — | shipped at `0642e098` ("the banked panel-twin conditional ships — its trigger fired"); census 14 → 9 (`p-w4-validate-deploy.md:40-43`) |
| DNB-14 | **`rasterizePoseToBlob()` upstream in pencil-boil** — hand back `canvas.toBlob()` directly, deleting one full `ImageBitmap` copy (79–195 ms) and one PNG encode (87–115 ms) from **every bake in the estate**, pixel-identical | `docs/tranches/2026-08-tranche-5/evidence/design-loop/pass3/stall-attribution-report.md:226-235` (Option C, "the real cure") — the drawer-driven raster-stack re-bake stall | Explicitly out of lane: "**Not this repo. Not this lane.** `pencil-boil` is a published package (0.10.1); this is an upstream row with its own version bump" | ranked **recommendation #1** (`:239-240`) — unblocked, awaiting an upstream cut | `grep rasterizePoseToBlob` pencil-boil `src/` = 0 hits; the only hit in the whole tree is the design doc itself |
| DNB-15 | **Drawer stall Option A** (in-repo resample cure, gated on an SSIM run) and **Option B** (pixel-identical, buys it with residency) | same report, `:241-244` | A "once the resample is measured rather than argued"; B "only if A's SSIM fails" | A's SSIM gate being run | neither built; recommendation order is C → A → B |
| DNB-16 | **Experiment E7** — WebKit layer count + backing-store bytes on a real iPhone | `r3-cure-design.md:681-683` | never run (no device rig) | it is itself DNB-9's trigger | no device evidence anywhere under `patches/p1-safari-ios-performance/evidence/` |
| DNB-17 | **E8 — owner device smoke on a real iPhone** | `p-w4-validate-deploy.md:58-63`; `README.md:115-116` | owner-homed row; **blocks the iOS claim** | owner action | `WGATE-record.md:251` "still open and still the only thing that closes an iOS claim"; MEMORY Active Campaign carries it |

**Designed-not-built count: 16** (DNB-13 excluded — it shipped).
Of these, **9 are refused-against-a-number with a named trigger** (DNB-2/3/4/6/8/9/10/12 + DNB-11
refused without a trigger), **1 was decided-by-not-building** (DNB-1, the ballot), **1 is a live
upstream recommendation with no owner** (DNB-14 — the only row here that is *recommended* rather
than refused), and **2 are unrun experiments** (DNB-16/17).

---

## 3. PERF POSTURE CLAIMS vs GATES THAT CAN FAIL

For each posture claim currently asserted in the tree: is it enforced by something that reds?

### 3.1 Enforced — gate identified, failure path verified

| claim | gate | can it fail? | evidence |
|---|---|---|---|
| **filterBudget allowlist** — exact-match per-selector population, `perCell 0`, total 9 at a ≤14 ceiling | `e2e/filter-census.spec.ts` (498 LOC) via `playwright-throttle.config.ts` projects `filter-census-chromium` + `filter-census-webkit`, `retries: 0`, run in CI at `ci.yml:629-631` (`npm run test:e2e:throttle`) | **YES — proven by construction.** `expect(hits.length).toBe(FILTER_BUDGET_TOTAL)` (`:225`) is exact-match, not a ceiling, so a *retiring* filter reds too; `expect(hits.length).toBeLessThanOrEqual(FILTER_BUDGET_CEILING)` (`:226`); and a **positive control injects a filter and asserts the total rises by exactly one** (`:252-260`) — the instrument proves itself able to red every run | `src/pencil/config/filterBudget.ts:155-156` (`FILTER_BUDGET_TOTAL`, `FILTER_BUDGET_CEILING = 14`); runs against the **built dist** (`dist-throttle`, port 4188) |
| **fill-mode census** (the `cell-reveal` tripwire) | same spec — rendered census (zero animations whose fill supplies a computed transform) + source census vs `FILL_ALLOWLIST` (`:495` `toEqual`) | **YES** — born-RED at base: 63 retained fills / 15 source sites (`p-w3-adoption.md:86-87`) | `e2e/filter-census.spec.ts:446,495` |
| **lean wasm size band** | `ci.yml:444-467` — `RAW=$(wc -c < …); if [ "$RAW" -gt 127500 ]; then … exit 1` | **YES** — hard `exit 1`, measured on the **exact ship artifact** downloaded from `build-lean-wasm` (not a twiggy proxy) | current on-disk lean = 122,385 B; band headroom ~4.0% |
| **full wasm size band** | `ci.yml:419-431` — fail >240,000 B, warn >230,000 B | **YES** (fail path `exit 1`; the warn tier is advisory only) | — |
| **preload hygiene** | `vite.config.ts:157-170` — the `head-hints` plugin **throws at build time** if the `solveSudoku` discriminator matches ≠1 worker chunk | **YES** — build-time throw, so drift reds `npm run build` and every CI lane downstream | "…rather than silently preloading" (`:155`) |
| **wordmark integrity** (P1 G3.4) | `e2e/wordmark-integrity.spec.ts`, project `wordmark-webkit`, built dist | **YES** — born-RED 6/6 at base (`p-w3-adoption.md:90`). Carries `retries: 1` with the reason written into the config (asynchronous bake; a retried pass reports as flaky) | `playwright-throttle.config.ts` |
| **theme-bake freshness** (toggle-ink) | `e2e/theme-bake-freshness.spec.ts`, both engines, `retries: 0` | **YES** — born-RED, landed `c9cd957a` | — |
| **dev-probe tree-shake** | `scripts/check-prod-shake.mjs:25` — `FORBIDDEN = ['FilterTuner','rafInstrumentation','schedulerDebugInfo']`, `process.exit(1)` on presence | **YES** | `ci.yml:637-639` |
| **golden discipline** | `visual-golden.spec.ts` (linux crops) + `npm run test:golden:bytes` | **YES** | `ci.yml:611-617` |
| **GAC node-count spine** | `ci.yml:140` "GAC corpus node-count smoke (0/50 false-UNSAT + 4,153,388→8,222 spine)" | **YES** | the deterministic oracle p2-1 told the estate to bank |

### 3.2 NO GATE — regressions would ship silently

| perf surface | what asserts it today | risk |
|---|---|---|
| **Every frame-timing number the P1 patch seals on** — desktop idle ≥97 fps / long33 == 0, deal ≥96, solveCelebration ≥95, themeToggle ≥85, galleryGlide ≥83; sim idle ≥59, gallery ≥49, theme ≥45; **GPU ≤4.5 CPU-s per 30 s idle** — all committed as thresholds in `patches/p1-safari-ios-performance/gates.json` | **NOTHING IN CI.** `grep -niE "fps\|long33\|jank\|lighthouse"` over `.github/workflows/ci.yml` returns only the two *size* budget step names. The instruments are `run-safari.sh`, `sim-matrix.sh`, `cpu-attrib.sh`, `matrix.sh`, `summarize.mjs`, `probe.js` — **none exist in the repo**; `p-w3-adoption.md:188` says so outright ("`probe.js` gained `hoverSweep` + `solveWindow` (**scratchpad only, not the repo**)") | **HIGHEST.** `gates.json` is a committed threshold file with no executor. A regression to 79 fps idle would pass every CI lane. The filter census is a good *proxy* for the cured mechanism, but lessons rule "proxy ≠ surface" applies verbatim: a new perf defect with zero new filters is invisible |
| **Scheduler park** ("the one chain parks on hidden"; idle 0 paints / 7.99 fps prod, T3-W13) | Documented only: `src/pencil/composables/boilBeat.ts:17` "Tab visibility: the one chain parks on hidden; the beat simply stops arriving." **No unit test and no e2e asserts it** — no `*.test.ts` under `src/pencil/composables/`, and `grep park` over `src/**/*.test.ts` yields only unrelated hits. The park lives upstream in pencil-boil, whose own tests are not in this repo's CI | **HIGH.** A regression that keeps the chain alive on `visibilitychange` (or an upstream bump that drops the behaviour) reds nothing here. Note the app's only CI relation to `schedulerDebugInfo` is a gate asserting it is **absent** from the bundle — the introspection that could test the park is deliberately shaken out |
| **JS bundle size** | none — no byte band on `dist/` assets anywhere in `ci.yml` (the two bands are both wasm) | **MEDIUM.** The wasm is gated to ±4%; the JS/CSS that actually renders the boil is ungated |
| **The union filter *area*** | `FILTER_BUDGET_UNION_AREA` + `FILTER_BUDGET_AREA_TOLERANCE = 0.02` exist in `filterBudget.ts:172-180` and are asserted by the census (a second regime at 393×699 coarse/dpr3, `:28`) | **LOW** — this one *is* gated; noted because it is the only area-based perf assertion in the estate |
| **The gallery-fold ~150–176 ms frame, the theme swap's two ~125 ms repaints, `undoBurst`'s ~55 fps floor** | booked as residuals with triggers (`p-w4-validate-deploy.md:28-56`), no gate by design | **ACCEPTED** — each carries a named re-entry trigger; flagged only so the absence reads as chosen |
| **Rig instrument drift** | `p-w4-validate-deploy.md:46-54` — the identical bundle slid galleryGlide 85.16→81.33 and themeToggle 88.88→82.60 over 23 minutes (18 runs, monotone) while idle held. Booked as an "instrument law": those cells adjudicate interleaved-or-quiesced only | **STRUCTURAL** — even if the fps gates were wired into CI, two of them have margins (1–3 fps) below the instrument's own drift (~4 fps/20 min). Any future perf CI must quiesce or interleave, not just run |

**Net:** the P1 patch's *mechanism* invariant is well gated (exact-match census, both engines,
built dist, self-proving control). Its *outcome* claims — every fps and CPU-second number in
`gates.json` and in `WGATE-record.md` §9.1 — have **no executable gate at all**.

---

## 4. PERF EVIDENCE REFERENCED BY RECORDS BUT MISSING ON DISK

Checked against the exact paths the records give. Present-and-verified artifacts are listed last.

| # | referenced artifact | cited at | on disk? |
|---|---|---|---|
| M-1 | p1's eight banked probes — `lib.mjs`, `webkit-baseline.mjs`, `cpu-crossmethod.mjs`, `safari-real.mjs`, `chromium-load.mjs`, `deal16.mjs`, `webkit-hostload.mjs`, `coldload.mjs` — "Every recipe rerunnable **in this dir**" | `p1-safari-load.md:10, 186-195` | **MISSING.** `docs/tranches/2026-07-tranche-4/evidence/perf/` contains exactly four `.md` files and nothing else |
| M-2 | p2's probe crate `scratchpad/tranche4/perf/probe/` (`gen_timing`, `alloc_census`, `hot_loop`) | `p2-solver-backend.md:7-12` | **MISSING** — `scratchpad/` holds only `tranche3/w10-f1-shots`; `scratchpad/tranche4` does not exist |
| M-3 | p2's `sample` profiles `scratchpad/tranche4/perf/sample-solve16.txt`, `sample-gen9m.txt` — the source of the §(c) top-5 self-time tables | `p2-solver-backend.md:12-13, 67, 75` | **MISSING** (same parent) |
| M-4 | p3's build/analysis trees `builds/{lean,full,node-base,node-simd}`, `analysis/lean-named*`, `wopt/out/` (the -O0…-Oz sweep), `bench-instantiate.mjs`, `bench-solve.mjs` | `p3-wasm-facilities.md:6-7, 170-187` | **MISSING** — no `builds/`, `analysis/` or `wopt/` anywhere outside `node_modules` |
| M-5 | crit's fresh probe builds `crit-node-base/`, `crit-node-simd/`, preview log `crit-preview.log` | `crit-perf-audit.md:8-9` | **MISSING** |
| M-6 | P-W2's ballot artifacts — `perf-rig/ballot/` (`BALLOT-SUMMARY.md`, `ballot.html` on :4895, contact sheets in `out/`), and `perf-rig/ballot/out-pw3/` (the "full-resolution originals" the retained PNGs were quantized from) | `p-w2-pencil-boil.md:98-100`; `evidence/p1/README.md:13-17` | **MISSING** — no `perf-rig` directory exists in the repo. The *derived* contact sheets survive (see below); their originals and the generating instrument (`contact-sheet.mjs`, `ballot-server.mjs`, `variant-a0.css`) do not |
| M-7 | P-W2's fresh-base ballot runs `perf-rig/runs/{base,ballot-c-glyph}-rfb{1..3}` — the G2.5 GREEN evidence (C idle 98.60/98.54/98.30) | `p-w2-pencil-boil.md:109` | **MISSING** |
| M-8 | P-W3's rig runs `pw3base-c1..c3`, `pw3post-p1..p3`, `pw3-gb1/gb2`, plus the discarded instrument-bug runs `pw3-base-1..3` / `pw3base-b1..b3` "kept as failure-mode records" | `p-w3-adoption.md:188-191` | **MISSING** — the record says they were kept; nothing in-tree keeps them |
| M-9 | P-W4's battery outputs behind every `gates.json` row (G4.1 idle 97.72/long33 0 … G4.3 4.24 CPU-s) | `p-w4-validate-deploy.md:66-81`; `WGATE-record.md:247` | **MISSING** — no run artifacts, no `summarize.mjs` output, under the patch's `evidence/` |
| M-10 | `design-loop/pass2/laneD-shots/` (the font-decision renders, cited beside the row that ships the B2 subset) | `p-w2-pencil-boil.md:113-114` | **MISSING** — the sibling `design-loop/pass2/font-decision-row.md` **is** present (as of this read; the whole `design-loop/` tree is untracked, `git status` `??`), but `laneD-shots/` is not |

**Present and verified** (so the absences above read as specific, not blanket): the retained
soul artifacts `evidence/p1/soul-glyph-bake/{chromium,webkit}-{light,dark}/{board-1x,chars-1x,
loupe-4x}.png`, both `*-controls/negative-control.png`, and `ssim.json` — 15 files; the four
golden BEFORE/AFTER pairs in `evidence/p1/goldens-before-after/` — 8 files; the three research
reports `evidence/research/r{1,2,3}-*.md`; `gates.json`; the three wave files; and the two
solver examples the p2 rows are rerun from (`csp-solver/examples/gac_ab_corpus.rs`,
`gac_timing_probe.rs`).

**The pattern.** Every *derived, reviewable* artifact was banked into `docs/`; every *rig,
instrument and raw run* was left in scratchpad and is gone. That is exactly the asymmetry §3.2
names: the numbers that have no gate also have no surviving instrument, so neither can be
re-derived at citation (lessons rule "numbers re-derived at citation") nor re-run on a
regression. Ten missing groups; none of them is a deleted *conclusion*, all of them are deleted
*means of checking one*.

---

## 5. HEADLINE

1. **29/29 rows accounted: 27 LANDED, 2 PARTIAL, 0 UNADDRESSED.** No engineering action from
   the pre-execution audit is missing from the tree. Both PARTIALs are record defects — a stale
   `208% top-interval` anchor left in `T4-W1-perf-bake-once.md:15,81,87,138`, and the D7/W8 row
   closed **FOLD** in `README.md:223` and **retire** in `WGATE-record.md:75`.
2. **16 designed-not-built items**, of which 9 are refused-against-a-number with named triggers
   (the discipline is intact), 1 was decided by not building it (F3/grain.ts, on the ballot),
   2 are unrun experiments (E7 device census, E8 device smoke — the latter still blocking the
   iOS claim), and **1 is a live, recommended, ownerless upstream row**: `rasterizePoseToBlob`
   in pencil-boil, ranked recommendation #1 against 79–195 ms + 87–115 ms per bake, estate-wide,
   pixel-identical.
3. **The filter budget is genuinely gated** — exact-match in both engines against the built
   dist, `retries: 0`, with a positive control that proves the instrument can red every run.
   The two wasm size bands are hard `exit 1`. Preload hygiene throws at build time.
4. **Every fps and GPU-second claim the patch sealed on has no gate.** `gates.json` is a
   committed threshold file with no executor in CI; the rig that produced its numbers was never
   committed. The scheduler park has no test on either side of the package boundary.
5. **Ten groups of perf evidence referenced by the records are absent from disk** — all of them
   instruments and raw runs, none of them conclusions.

ROW-COMPLETE
