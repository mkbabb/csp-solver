# T4-W11 · Lane CEN — THE BASELINE (merged-HEAD truth)

Measured at the wave base **`7d51f562`** (T4-W10 sealed; beneath it WU undo spine, W9 border/tally,
W8 marks/assists, W7 technique engine — all tracked in-tree). `cloc 2.08`, BSD `comm`, `shasum`,
Playwright, Chromium CDP. Darwin (`darwin 25.4.0`, node v26). **No `src/` or `csp-solver/src/` edit —
evidence only.** Every integer here supersedes the spec's stale `65425697` figures (K10/K18).

> **The spec's census was taken MANY waves ago (`65425697`).** Since then W6/W7/W8/W9/WU/W10 grew
> both game dirs. The numbers below are the LIVE reservoir; the gates bind to *these*.

---

## 0. Tree state + concurrency caveat (READ FIRST)

- Clean base = `7d51f562` (branch `master` tip = HEAD). The one benign working-tree deviation at
  session start: `CONTRIBUTING.md` deleted at repo root — outside `games/**`, `e2e/`, `csp-solver/`;
  affects nothing measured here.
- **A concurrent W11 RS lane is mutating `csp-solver/` LIVE.** Its files landed in the working tree
  *mid-session*: `csp-solver/src/puzzles/class.rs` (@19:12), `csp-solver/tests/puzzle_class.rs`
  (@19:15), and an `rs-puzzleclass.md` in this dir (@19:18) — none are mine. The RS lane is **Rust-only**;
  it touches **no** `web/frontend/**`, so the entire FE census/goldens/perf below is uncontaminated.
- **My rust census ran @19:07, BEFORE that contamination** — the 174 count is clean-base truth.
  **V/R must measure the rust invariant against clean `7d51f562` (or the sealed row SHA), never the
  live working tree** — the RS lane's `puzzle_class.rs` adds NEW tests (additive; not an edit of the 174).

---

## 1. THE TWIN CENSUS (`comm -12`, code-only sorted) @ `7d51f562`

**Probe portability fix (load-bearing):** x6 §Probes' `codeonly` uses GNU `\s`, which **BSD/darwin sed
under-strips** (no `gsed` on this host) — indented and column-0 `//`/`*` comment blocks SURVIVE,
inflating every count. The canonical CEN filter replaces `\s`→`[[:space:]]` (**CORR**); verified 0
comment/blank survivors. RAW (x6-verbatim) is kept only for traceability to the spec's 453/95/… figures.
Recipe: `docs/…/w11/cen-census.sh` (emits both). The gate binds to the DELTA under the SAME filter
before/after; **CORR is that filter.**

| Twin pair | CORR A (sudoku) | CORR B (futo) | id (mult) | id (uniq/dedup) | % of smaller | RAW A/B/id (x6-verbatim) |
|---|---:|---:|---:|---:|---:|---|
| `ControlPanel.vue` | 866 | 847 | **781** | 439 | 92.2% | 891 / 875 / 785 |
| `SolverErrorNote.vue` | 102 | 102 | **101** | 79 | 99.0% | 113 / 109 / 103 |
| `Cell.vue` (Sudoku/Futoshiki) | 607 | 596 | **528** | 349 | 88.6% | 644 / 633 / 536 |
| `Board.vue` | 674 | 648 | **529** | 397 | 81.6% | 747 / 714 / 547 |
| `use<Game>.ts` | 582 | 606 | **544** | 364 | 93.5% | 760 / 747 / 576 |
| `Game.vue` (scene) | 200 | 192 | **96** | 77 | 50.0% | 209 / 204 / 99 |
| `conflicts.ts` | 53 | 53 | **40** | 32 | 75.5% | 72 / 71 / 45 |
| **TOTAL** | | | **2,619** | **1,737** | | |

- **Live identical mass (CORR, multiplicity) = 2,619** vs the spec's ~2,100–2,200 → the reservoir GREW ~22%.
- **Dedup (unique) identical mass = 1,737**; the **882-line gap = trivial-structural inflation (34%)**
  (repeated `}`, `>`, `</div>`, `return`, tag closers). This is the honest lower bound of extractable
  meaningful duplication, and **x6's assumed 15–20% discount understated the trivial floor.**
- Every per-pair verdict from the spec holds directionally; ControlPanel/SolverErrorNote/Cell/use<Game>
  are now **≥88% identical** (higher than the spec, as W8/WU/W10 added byte-identical undo/marks/assists
  wiring to both twins). `Game.vue` softened to 50% (scene scaffold divergence widened).

### cloc by game dir (code lines) @ `7d51f562` — the net-floor baseline

| Dir | files | code @7d51f562 | code @65425697 (spec) | Δ |
|---|---:|---:|---:|---:|
| `games/sudoku` | 21 | **4,309** | 2,555 | +1,754 |
| `games/futoshiki` | 21 | **4,445** | 2,504 | +1,941 |
| `games/shared` | 35 | **3,524** | 762 | +2,762 |
| **games total** | 77 | **12,278** | 5,821 | **+6,457** |

The dirs grew +6,457 code lines (features + tests + technique engine), so **"net removed vs `65425697`"
is now meaningless** — the floor is rebased to the CEN `12,278` baseline (§4). Twin-file cloc mass:
sudoku-7 = **2,854**, futoshiki-7 = **2,874**, combined 14 files = **5,728** cloc.

---

## 2. THE INVARIANT STAMP (unedited across every row)

### e2e — authoritative `playwright test --list` per config

| Config | cases | spec files |
|---|---:|---|
| `playwright.config.ts` (DEFAULT suite) | **63** | 9 |
| `playwright-golden.config.ts` | **4** | 1 (`visual-golden`) |
| `playwright-throttle.config.ts` | **1** | 1 (`throttled-void`) |
| **`test(`/`it(` across ALL 11 specs** | **68** | 11 |

The DEFAULT suite (`63`) **supersedes the spec's "44"** (the suite grew via WU/W8/W9/W10). Default-suite
spec files (9): `affordances, drawer, futoshiki, mobile-affordances, mobile-platform, permalink,
share-truth, sudoku-interaction, visual-regression`. Default config `testIgnore`s `visual-golden` +
`throttled-void` (they run under their own configs). Per-spec `test(`/`it(`: affordances 10, drawer 6,
futoshiki 4, mobile-affordances 10, mobile-platform 8, permalink 6, share-truth 5, sudoku-interaction 7,
visual-regression 7, throttled-void 1, visual-golden 4.

### e2e spec + config SHA-256 (V proves zero edits against these)

```
8bbaa115d2b86724789ac14e7e407d9916f5a7320cd1973e9f21793c5f484ef1  e2e/affordances.spec.ts
db2649770666eaa2cf8e9b27e751c4bd96ea7bb7db433d2349e0f75d30eb8631  e2e/drawer.spec.ts
c3744c42bd7446422e6b57d4be78a36a72853ff5fd2401e652f7fcb2782e06ae  e2e/futoshiki.spec.ts
7f66c665dc86830d65e968750f14893ed6805ea7e9c04b8b679b8222e8169357  e2e/mobile-affordances.spec.ts
d54f3d86db5d350d7f0c7dc6853c27685a60e7b847d249a02e613df3c2988b40  e2e/mobile-platform.spec.ts
0ccc3c79394a69ab718ed7b3c7171f4d0a6cddc964eefc1538283efa803ea8d4  e2e/permalink.spec.ts
d65b6eed1b7e544136bdfb977e76c0d72a6dc07c91da96355399021acbf7737f  e2e/share-truth.spec.ts
2527afce9507e9a8d8e231ffce3eb404806d4989a47f5f12ab1bb152975ca570  e2e/sudoku-interaction.spec.ts
b15c9d056e03c43f30274f2eb1342349b7f7c421701a26c9e8c9f6f0fc30a1a3  e2e/throttled-void.spec.ts
0a2561e0480a68946a00283100e329bd20dc34c15b83811e7a755525597a6a96  e2e/visual-golden.spec.ts
6049ddd1e74fba09db204bee06944b81be39d64e129ee34a2fb588b4b53fb253  e2e/visual-regression.spec.ts
f1d4ee9dd4f8e569593a6774e8541d1222594c3678de039649b907be75b65673  e2e/global-setup.ts
21b58d5f684c320a6bbceabf8e0078849966066835771468978b053bf230a7b3  playwright.config.ts
3fdbaf082b0b1933d0dd9f1c7695311c7eb205241dc51ab63375f9584b4fe496  playwright-golden.config.ts
21ef52042d3961c1ad5603b711e8762f47e090cfb4ab769ee8a5a3e5ba2616a1  playwright-throttle.config.ts
```

### rust — clean-base census (ran @19:07, pre-contamination)

- **174 unit+integration tests** across **20 test binaries** + **2 doc-test harnesses** — matches the
  spec's 174 exactly. Full list: `w11/cen-rust-list.txt`; per-binary `Running` lines in `.err.txt`.
- Recipe: `cargo test --workspace -- --list` from repo root; count = `grep -c ': test$'`.
- Invariant = these **174 stay green, unedited**. The concurrent RS lane's `puzzle_class.rs` ADDS tests
  for the new `PuzzleClass` trait (additive facility, not an invariant edit) — V verifies the 174
  original tests unchanged + green on the clean row SHA.

---

## 3. GOLDEN + PERF BASELINES (built dist, served `:4585`, killed after)

Recipe: `cd web/frontend && npm run build && npx vite preview --port 4585 --strictPort`;
`PLAYWRIGHT_BASE_URL=http://localhost:4585`. **Never touched `:3000`/`:3001`** (owner's; `:3000` was the
owner's, left running). Golden config skips its `:3000` webServer when `PLAYWRIGHT_BASE_URL` is set;
visual-regression was run under a **temp webServer-free config** (in-tree, removed after) since the
default config's webServer is unconditional on `:3000`.

### Darwin visual goldens — 4/4, with a PRE-EXISTING logo-light flake

- `npm run test:golden` (external base `:4585`): **4/4 GREEN** the vast majority of runs.
- **Flake characterization (owner-relevant):** across 15 full-suite runs, **13 clean / 2 fails**, both
  on **`logo-light-darwin`** (the feTurbulence-baked wordmark crest — the config's own comment flags its
  raster noise). **In isolation `logo-light` passed 10/10.** The flake surfaces only under full-suite
  DPR2 raster contention and clears on retry. **Config has `retries: 0`** → a single-shot run has a
  ~13% chance of a spurious `logo-light` red **at the untouched base.**
- **Guidance for R3/R4/V:** goldens invariant = **4/4**. A lone `logo-light` fail is **baseline noise,
  not an extraction regression** — confirm by isolated re-run (`-g "logo wordmark"`) or a repeat. Only a
  fail that persists in isolation, or a fail on `cell-light`/`grid-corner-light`/`toggle-crest-dark`
  (all 15/15 stable), is a real pixel regression. 4 committed darwin PNGs: `cell-light`,
  `grid-corner-light`, `logo-light`, `toggle-crest-dark`.

### visual-regression suite — 7/7 GREEN

All 7 DOM/interaction cases pass against the dist (write-only `page.screenshot()`, no golden asserts).

### Idle-paint baseline (CDP) — the owner P0 idle-0-paint invariant HOLDS

Recipe: `w11/cen-idle-paint.mjs <url> <sudoku|futoshiki> [idleMs]` — Chromium headless DPR2/1440×900,
CDP `Performance.getMetrics` deltas + CDP `Tracing` (main-thread `Paint` events) over a 5 s idle window
on a **dealt board**, plus in-page rAF fps + boil-beat class-mutation rate. Raw runs: `w11/cen-idle-paint.json`.

| Metric (5 s idle, dealt board) | Sudoku | Futoshiki |
|---|---:|---:|
| **main-thread paints (trace)** | **0** | **0** |
| Layout events (trace) / `LayoutCount` Δ | 0 / 0 | 0 / 0 |
| `RecalcStyleCount` Δ | **~40** | **~40** |
| boil beats/sec (class-mut/2) | ~16 | ~16 |
| boil class mutations | 160 | 160 |
| rAF fps | ~133 | ~133 |

- **Steady-state paints = 0** both games → the idle-0-paint invariant is intact at base. The boil runs as
  **compositor-only opacity swaps** over 4 live filter layers (`g.boil-frame-layer`, `liveCount=4`); it
  produces **`RecalcStyleCount` Δ ≈ 40 / 5 s (the boil beat, ~8/s batched) and 160 class-mutations, but
  ZERO paints** — that is the grain-hoist optimization working.
- **`RecalcStyleCount` Δ ≈ 40 is the cell-shell perf tripwire (Row 3, owner P0):** a wrapper component
  that adds a vnode/reactivity layer on the hot cell path would raise paints and/or push RecalcΔ above ~40.
  Bank ≈40 as the steady-state floor; post-extract must not exceed it.
- **rAF fps ≈ 133 is a headless-Chromium artifact** (no vsync cap) — NOT a display figure; use boil
  beats/sec (~16) as the boil cadence.
- **Caveat:** futoshiki auto-randomizes off-thread (Worker); if the settle window is short its deal-tail
  paints (~16–34) can leak into the window (2 of 6 runs). Re-run / lengthen settle to reach the 0-paint
  steady state.

---

## 4. THE RESTATED NET-LOC FLOOR (the gate binds to THIS)

The spec's `≥1,600` floor was drawn from the `65425697` reservoir. Restating per the mandate formula
**`floor = live_identical_mass × r3_discount`**, with LIVE numbers and the EMPIRICALLY-measured discount:

- **live identical mass (CORR, multiplicity) = 2,619** codeonly (x6's summation method).
- **r3 discount:** x6 assumed 15–20% (×0.80–0.85). The **measured trivial-structural inflation is 34%**
  (dedup 1,737 vs mult 2,619) → the honest discount is **×0.66**. `2,619 × 0.66 = 1,729` codeonly
  ≈ the dedup core (1,737) ≈ **x6's original ~1,700 honest reservoir**. The meaningful duplication is
  **stable**; the reservoir's 22% growth was almost entirely trivial-structural.
- **codeonly → cloc factor = 0.935** (twin files: 5,728 cloc / 6,128 codeonly). `1,729 × 0.935 ≈ 1,617` cloc.
- **Honest net-removable band (cloc):** ~**1,440** (dedup-conservative: one shared copy + both furniture
  slots + glue) to ~**2,270** (multiplicity-optimistic). The spec's 1,600 sits inside this band, at the
  dedup-meaningful core.

### BINDING FLOOR (restated)

> **≥ 1,600 net cloc code-lines removed from `web/frontend/src/games/**` vs the CEN `7d51f562`
> baseline of `12,278`** — i.e. **`cloc(games/**) ≤ 10,678`** at the row gate SHA, measured by
> `cen-census.sh`'s exact cloc invocation before/after. Net is taken across **all three dirs
> (sudoku + futoshiki + shared)** so the gate enforces real deletion, not relocation into a fatter shell.

The floor **stays ≥1,600** (not lowballed, not inflated): the live-number derivation with the measured
34% discount lands at ~1,617 cloc — the same place, because the growth was trivial while the meaningful
core held. **SAID SO:** the basis is now the live reservoir (2,619 mult / 1,737 dedup) and the CEN
baseline, not the stale spec figures. If an extraction lands below 1,600, that is the dedup-conservative
bound (~1,440) biting, not a moved target — but the binding floor is **≥1,600 net cloc, rebased**.

---

## 5. BORN-RED gate probes (the duplication is live today)

| Gate | Probe | Result @ `7d51f562` |
|---|---|---|
| twin reservoir | `cen-census.sh` (CORR) | ControlPanel **781**, Cell **528**, Board **529**, SolverErrorNote **101** identical (RED) |
| doubled keyframes | `for k in sharePop eraserScrub note-slide-in note-fade-in marks-fade-in ghost-draw-on; do grep -rln "@keyframes $k" src; done` | **2 files each** (all 6 RED) |
| contract exists (FE) | `grep -rl defineGame web/frontend/src` ; `ls src/games/registry.ts` | **0 files / ABSENT** (RED) |
| contract exists (Rust) | `git cat-file -e 7d51f562:csp-solver/src/puzzles/class.rs` ; `git show 7d51f562:…/lib.rs \| grep PuzzleClass` | **absent in `7d51f562`** → `PuzzleClass` **RED at clean base** (matches spec). *(A concurrent RS lane is landing it live in the working tree — that is the W11 Rust keystone in progress, NOT the base.)* |
| contract acceptance | third-game (W13 Thermo) stub compiling zero-shell-edit | no third game today (RED) |

Doubled-keyframe file map: `sharePop`/`eraserScrub` → both `ControlPanel.vue`; `note-slide-in`/`note-fade-in`
→ both `SolverErrorNote.vue`; `marks-fade-in`/`ghost-draw-on` → both `Cell.vue`.

---

## 6. Probe recipes banked (re-run verbatim)

| File | What it does |
|---|---|
| `w11/cen-census.sh` | twin census (CORR + RAW) + cloc by game dir — run from anywhere |
| `w11/cen-idle-paint.mjs` | CDP idle paints/layouts/recalcs + boil-fps, per game — `node … <url> <game> [idleMs]` |
| `w11/cen-idle-paint.json` | 6 banked idle-paint runs (3/game) |
| `w11/cen-rust-list.txt` / `.err.txt` | clean-base `cargo test --workspace -- --list` (174) |
| `w11/cen-build.log` / `cen-preview.log` | dist build + preview server logs |
| `w11/cen-golden-flake.log` | (empty — no fail captured in the 8-run batch; flake detailed in §3) |

### The 6 stamps R3/R4/V inherit

1. **Twin reservoir** (CORR): CP 781 · SEN 101 · Cell 528 · Board 529 · use<Game> 544 · Game 96 · conflicts 40.
2. **cloc games/** = 12,278** (sudoku 4,309 / futoshiki 4,445 / shared 3,524).
3. **e2e invariant** = 63 default / 4 golden / 1 throttle (68 total `test(`); 15 SHA-256 banked.
4. **rust invariant** = 174 tests (clean base; measure off `7d51f562`, not the RS-lane-dirty tree).
5. **goldens** 4/4 (logo-light ~13% base flake — retry, don't re-baseline) · **visual-regression** 7/7 ·
   **idle paints = 0** both games · **RecalcΔ ≈ 40/5s** cell-shell tripwire · boil ~16 beats/s.
6. **Net-LOC floor** = **≥1,600 net cloc removed vs 12,278 → ≤10,678** (rebased, derived from live 2,619
   mult × 0.66 measured-discount × 0.935 codeonly→cloc ≈ 1,617).
