# T3-W8 — FE perf

**The two felt hitches G7 measured get their fix, the cold-start chain gets warmed and preloaded, and the Rolldown chunk husk gets re-derived — every payoff sized against the built `dist/`, never the dev server.** A17 ranked seven rows off wire/byte forensics; G7 drove the browser and turned two of them into numbers (size-switch 99–103 ms @4×, the only >100 ms gesture; a NEW marks/peek burst A17 never traced) and confirmed the cold-start premise structurally. This wave lands the fixes and asserts them with G7's own instrument. **P6 is dropped (KISS, R-2k).**

**Dependencies**: ← W7 — the L25-19 re-point onto `useBoilFrames`/`useBoilCache` lands first, so the cellRects cache measures against the library primitives, not the hand-rolled `GRID_BOIL_CACHE` it's mirroring. **Effort**: M.

---

## Scope

### The size-switch fix — cellRects extraction + LRU (A17 P2/P3, G7 MEASURED)

G7's sharpest row: `9→16` is the **only** gesture that remounts cells (175 mount-mutations landing 256 `.sudoku-cell`s; every other gesture is `mounts: 0`) and the **only** one to cross 100 ms — unthrottled 28 ms → **4× 99–103 ms, ratio ~3.6×** (`felt-results.json`, N=2, both samples). The mechanism is exactly A17 P2: `SudokuBoard.vue:56-58` `cellRects = computed(() => generateGridPaths(...).cellRects)` calls the **full** `generateGridPaths` (`gridPaths.ts:54-130` — frame `wobbleRect` + every subgrid/cell `wobbleLine` + the `boardSize²` per-cell ghost rects) and **keeps only `.cellRects`**, discarding the frame + all lines, **with no cache** (contrast `generateGridBoilFrames`'s `GRID_BOIL_CACHE`, `gridPaths.ts:31-41`). A 9→16 switch pays 256 uncached ghost regens + a redundant full frame/line pass thrown away + a boil-frame cold miss + 256 mounts in one synchronous main-thread burst.

- **Extract `generateCellRects(boardSize, subgridSize, viewBoxSize, seed)`** emitting ONLY the ghost rects (`gridPaths.ts` new fn beside `:54`), backed by an **LRU mirroring `GRID_BOIL_CACHE`** (max 24, keyed on every param). The discarded line work never runs for the ghost path again.
- Both boards re-point: `SudokuBoard.vue:56`, `FutoshikiBoard.vue:66-67` (identical shape at `:448`). P3's "double wobble-line compute" dissolves with the extraction — `generateGridPaths`'s pure-waste half stops being called for `cellRects`.
- **The memoized-regen straddle is the same fix** (A§2.6): the Vue `computed` is the only memo today and a size switch invalidates it; the LRU survives the invalidation.
- **Measured gate target**: the size-switch worst frame drops **below the P2 band** (from 99–103 ms @4×). `probe-felt.mjs` is the before/after instrument (G7's harness, reusable).

### NEW row — marks/peek 16×16 mount burst (G7, R-7)

A17's ranking (P1–P7) never covered the peek/marks path. G7 traced it: `K` → `setMarksActive` → `refreshMarks(0)` → `propagateBoard` worker round-trip → candidate mini-grids mounted across every empty cell. At 16×16 that's **~2,700 mark nodes**, a **4× worst frame of 87–91 ms, ratio ~2.7×** — the second-largest CPU-sensitive burst. It matters because A23 calls hold-to-peek "the app's best moment," **N=4/16×16 is a served in-browser size** (user-reachable on the deployed web path), and the worker round-trip is off-thread — the entire felt cost is the main-thread mark-grid mount.

- **Same fix class as P2**: idle-chunk the mount (`requestIdleCallback` per row) or cap/virtualize mark rendering at 16×16. Adjacent to the cellRects work, one wave.
- 9×9 marks/peek is essentially free (ratio ~1.2×, worst ≤36 ms @4×, `over50/over100 = 0`) — **every felt problem is 16×16-specific**. Fix targets the large served size, not the default.
- Gate: the marks-burst worst frame asserts below the same band; `probe-felt.mjs` covers it.

### Cold-start prewarm + preload injection (A17 P1/P5, G7 structurally confirmed)

G7's head-hint census, both runs: the served `index.html` carries **zero `modulepreload`, zero wasm preload, zero worker `modulepreload`, zero font preload** — corroborating P1 (no worker/wasm prewarm) and P5 (no font preload) at source. The worker + wasm boot lazily on first message (`useSolver.ts:63-83` `ensureWorker` lazy; `solver.worker.ts:41-45` `ensureInit` fetch+compile+instantiate on first message), so the first interactive board waits on the full serial chain after mount (`useSudoku.ts:406-413` fires `randomize()` at construction).

- **Warm on idle**: `requestIdleCallback(() => ensureWorker())` after mount + a no-op ping so the worker self-inits the wasm ahead of need (P1 fix direction).
- **Inject head hints at build**: a small Vite `transformIndexHtml` plugin reads the emitted content-hashed asset names and emits `<link rel="modulepreload" href="…solver.worker….js">` + `<link rel="preload" as="fetch" crossorigin href="…csp_solver_wasm….wasm">` (keeps wasm-bindgen's `instantiateStreaming` on the streaming happy-path) + `<link rel="preload" as="font" crossorigin>` for the three subset woff2 (`fraunces`/`patrickhand`/`firacode`-subset, ~17.7 KB total, declared only via `@font-face` in `index.css` today — the hand-drawn wordmark is the aesthetic centerpiece, late-discovery FOUT).
- **The millisecond payoff is unmade until measured** and must be sized against the **built `dist/`** — localhost dev fetch is instant, so G7's cold-start TTI (112–372 ms) is Vite dep-cache warmth, not a production proxy. The wave's cold-cache before/after runs on a preview/prod build.

### P4 Rolldown chunk pathology — `advancedChunks`, against the preview build (A17 P4)

`vite.config.ts` `manualChunks` intends `@vue/* + vue → vue-vendor`, pencil-boil → `animation-vendor`; under Rolldown (Vite 8's default, where function-form `manualChunks` is a hint) the graph inverts: `animation-vendor` **holds Vue's runtime** fused with pencil-boil, `vue-vendor` is an 8.5 KB husk exporting 5 symbols that itself imports ~20 from `animation-vendor`, and `index` imports 60 symbols from `animation-vendor` vs 5 from `vue-vendor` (A17 forensics: `beforeCreate` option-merge string lives in `animation-vendor`, absent from `vue-vendor`/`index`). The cache-isolation goal is defeated — every pencil-boil release re-downloads Vue.

- **Re-derive chunking for Rolldown**: drop `manualChunks` for `advancedChunks` (Rolldown's supported grouping API) forcing a clean `vue` group, or verify the function-form lands `@vue/*` where intended (it does not today).
- **G7 proved this is invisible on the unbundled dev graph** — the gate runs against a **preview/`dist/` build**, asserting the produced chunk graph puts Vue's runtime in its own cache-stable group and drops the husk request.

### P6 — DROPPED (KISS, R-2k)

Shared wasm compile across the two workers (compile once, pass a shared `Module`): dropped. Re-entry criterion: a **measured** duplicate-compile cost at a served size (the current cost is one extra compile on first game-switch, a cache-hit fetch — unmeasured, small). Enters the KISS ledger (appendix A §10).

## Gates

Verbatim from the reconciliation (§2 DAG, T3-W8):

| Gate | Value |
|---|---|
| Headline | driven cold-cache before/after vs the built `dist/` (G7's `probe-felt.mjs`); size-switch + marks worst frames assert **below the P2 band** (from 99–103 / 87–91 ms @4×) |

Component checks:

| Gate | Value |
|---|---|
| size-switch | `probe-felt.mjs` 9→16 @4×/DPR2, N≥2: worst frame < the 99–103 ms band; ratio drops from ~3.6× |
| marks burst | `probe-felt.mjs` marks/peek 16×16 @4×: worst frame < the 87–91 ms band |
| cold-start | preview/`dist/` cold-cache TTI-to-first-cell before/after; head carries the injected worker/wasm/font hints (census flips from zero) |
| chunk graph | preview build: Vue runtime in its own group, the `vue-vendor` husk request gone (P4 re-derivation, not the dev graph) |
| parity | no functional regression — full e2e still green (the fixes are cache/idle-chunk/head-hint, no behavior change) |

## Seeds

- [`pass3/G7-felt-perf-trace.md`](../evidence/pass3/G7-felt-perf-trace.md) — the measured trace: size-switch 99–103 ms / marks 87–91 ms @4×, the remount-vs-value-update distinction, the head-hint census (both runs), the dev-server caveats, `probe-felt.mjs` as the before/after instrument.
- [`audit32/A17-performance-fe.md`](../evidence/audit32/A17-performance-fe.md) — P1–P7 with file:line anchors (`gridPaths.ts:54-130` no-cache vs `:202-295` cached; the P4 import forensics; the P1 serial chain).
- [`pass3/G3-pencil-boil-pin.md`](../evidence/pass3/G3-pencil-boil-pin.md) §2d — `useBoilFrames`/`useBoilCache` shipped at 0.7.0, the L25-19 supply W7 re-points onto (sequence W7→W8).

## Residual risks

- **The headline numbers do not exist until measured under discipline** (R-7/R-12) — the before/after IS the wave's gate; the target (below the P2 band) is the assertion, the delta is discovered in-wave.
- **The 4× throttle is a mid-device floor, not the real multiplier** (G7): real mid-range mobile single-thread is ~6–20× slower, so a fix that clears the band at 4× on the M5 Max is necessary, not sufficient — verify the served large sizes on a real mid device if one is reachable.
- **P1/P5's payoff is a `dist/` measurement, not a dev one** — G7 confirmed the *mechanism* (nothing warms the chain), not a production millisecond count; a W8 that measures cold-start on the dev server measures Vite, not the app (the explicit trap G7 flagged).
- **P4 is unmeasurable pre-build** — the dev graph is unbundled; the only honest gate is the preview/`dist/` chunk graph, and the re-derivation must not scope-creep into a full bundler rewrite (force the one `vue` group, verify, stop).
- The L25-19 re-point (W7) and the cellRects LRU share the board frame-cache surface — if W7's re-point slips, W8 measures against the hand-rolled cache and the LRU comparison is muddied; land W7 first.
