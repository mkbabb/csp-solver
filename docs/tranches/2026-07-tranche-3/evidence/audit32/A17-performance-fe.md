# A17 — PERFORMANCE (Frontend)

TRANCHE-III deep audit, FE-performance lane. Read-only. Repo HEAD `3b75eca2`.
Live site probed via curl (browser extension unavailable); local `dist/` at
`web/frontend/dist/` is **byte-identical to live** (same hashes: `index-DHwIHXRb.js`,
`vue-vendor-_m6YDthG.js`, `csp_solver_wasm_bg-DUScTLrL.wasm`), so live == committed build.

All measurements below are wire/byte facts from `https://sudoku.babb.dev` + source reads;
warm-solve timings are cited from the tranche-2 evidence I could not re-measure without a
driven browser (flagged PLAUSIBLE).

---

## Perf rows, ranked by felt-latency impact

### P1 — First-board cold start: lazy worker + wasm, no prewarm, no preload (HIGHEST felt)

**What.** On first load with no restorable board, `useSudoku.ts:412` fires
`randomize()` (fire-and-forget) at composable construction → `getRandomBoard` →
`ensureWorker()` (`useSolver.ts:63`) spawns the Worker **lazily on first call**, and the
worker's `ensureInit()` (`solver.worker.ts:42`) fetches + compiles + instantiates the wasm
**lazily on first message**. So the very first interactive board waits on the full serial
chain:

`index JS parse → mount → randomize() → Worker script fetch (solver.worker-DS2fzlRC.js,
10,549 B raw) → new Worker boot → wasm fetch (csp_solver_wasm_bg-DUScTLrL.wasm, 90,602 B
raw / 40,136 B br) → compile+instantiate → generateSudoku`.

Nothing warms this ahead of need: `index.html` (live, fetched) carries `modulepreload`
for `animation-vendor` + `vue-vendor` only — **no preload/prefetch for the worker chunk or
the wasm binary**, and the worker/wasm are not in the main entry graph (they're
`new Worker(new URL(...))` + `?url` asset), so the browser can't discover them until JS
executes. There is no `ensureWorker()`/`ensureInit()` warmup on idle.

**Impact.** This is the single largest gap between first paint and first usable board — a
serial fetch+compile of a 40 KB-br wasm module that only *starts* after the app's JS has
parsed and mounted. On a cold cache it stacks a full extra RTT + wasm compile onto
time-to-interactive-board.

**Fix directions (idiomatic).** Warm the worker on idle right after mount
(`requestIdleCallback(() => { ensureWorker(); /* worker self-init on a no-op ping */ })`),
**and/or** emit `<link rel="modulepreload" href="…solver.worker….js">` +
`<link rel="preload" as="fetch" crossorigin href="…csp_solver_wasm….wasm">` into the built
`index.html` (a small Vite `transformIndexHtml` plugin can read the emitted asset names).
wasm-bindgen `--target web` `init(url)` already uses `instantiateStreaming` — preload keeps
it on the streaming happy-path.

Cite: `web/frontend/src/games/sudoku/composables/useSudoku.ts:406-413,426`;
`web/frontend/src/games/sudoku/solver/useSolver.ts:63-83`;
`web/frontend/src/games/sudoku/solver/solver.worker.ts:41-45`; live `index.html` head.

---

### P2 — Board-size-switch @4× CPU hitch — the deferred P3 tail (HIGH felt)

**What.** The tranche-2 grain-hoist (P3 → W5) explicitly left the CPU half untouched
(`docs/tranches/2026-07-tranche-2/evidence/pass2/p3.md`: *"The 133 ms-class @4× worst frame
is NOT cut… synchronous `generateGridBoilFrames` + 256 `wobbleRect` cell-ghost regen + 256
cell/glyph mounts + 300 ms-class style recalc"*; deferred-ledger row at
`appendices/C-deferred-foldin.md:105`). This lane confirms the tail is still live at HEAD
and pins the **exact** wasteful code.

The size-switch (`useSudoku.ts:424-427` `watch(size, …)`) synchronously re-drives, on the
main thread, all of:

1. `SudokuBoard.vue:56-58` — `const cellRects = computed(() => generateGridPaths(...).cellRects)`.
   **This computed calls the FULL `generateGridPaths` and keeps only `.cellRects`.**
   `generateGridPaths` (`gridPaths.ts:54-130`) computes the frame `wobbleRect`, every
   subgrid `wobbleLine`, every cell `wobbleLine`, **and** the `boardSize²` per-cell
   `wobbleRect` ghosts (256 at 16×16, `gridPaths.ts:114-127`) — then discards frame +
   all lines. **And `generateGridPaths` has NO cache** (contrast `generateGridBoilFrames`,
   which does — see P3 below).
2. `HandDrawnGrid.vue:25-30` — `generateGridBoilFrames` (cached via `GRID_BOIL_CACHE`, so
   this one is a hit on return trips, but a cold **miss** on the first switch to a new size,
   recomputing frame+subgrid+cell lines × `frameCount`).
3. `boardSize²` cell-component mounts + the Tailwind grid-template recalc.

So a 9→16 switch pays **256 uncached `wobbleRect` ghost regens + a redundant full
frame/line wobble pass that is immediately thrown away + a boil-frame cold miss + 256
mounts**, all in one synchronous main-thread burst → the ~100–150 ms worst frame.

**Fix directions.** (a) Give `cellRects` its own generator + LRU cache (mirror
`GRID_BOIL_CACHE`), so `generateGridPaths`'s discarded line work never runs for the ghost
path; (b) idle-chunk the ghost regen (`requestIdleCallback` per-row, or generate on the
worker); (c) at minimum, memoize `generateGridPaths` keyed on `(boardSize,subgridSize,
viewBoxSize,seed)` — the switch always recomputes it from scratch today.

Cite: `web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue:54-58,400`;
`web/frontend/src/pencil/grid/gridPaths.ts:54-130` (no cache) vs `:202-295` (cached);
same shape in Futoshiki `FutoshikiBoard.vue:66-67,448`.

---

### P3 — Redundant double wobble-line computation on every board mount/switch (MED)

**What.** Two independent code paths compute the SAME static frame + subgrid + cell
`wobbleLine`s on every mount:

- `HandDrawnGrid.vue` → `generateGridBoilFrames(...)` (`gridPaths.ts:202`) — computes the
  frame + all grid lines (× `frameCount` boil variants).
- `SudokuBoard.vue` → `generateGridPaths(...)` (`gridPaths.ts:54`) — computes the frame +
  all grid lines **again**, uses only `.cellRects`, discards the rest.

The base geometry (frame + lines at frame-0) is derived twice from scratch. `generateGridPaths`
is the pure-waste half — everything but `cellRects` is dead output.

**Fix.** Extract a `generateCellRects(boardSize, subgridSize, viewBoxSize, seed)` that emits
ONLY the ghost rects; have the boil-frame path expose its frame-0 base points for anyone who
needs the static lines. Removes one full frame+line wobble pass per mount.

Cite: `gridPaths.ts:54-130` and `:202-295`; consumers `SudokuBoard.vue:56`,
`HandDrawnGrid.vue:26`.

**Memoization-shape summary (asked explicitly).** `generateGridBoilFrames` → LRU
`GRID_BOIL_CACHE` (max 24, keyed on every param, `gridPaths.ts:31-41`) — sound.
`generateGridPaths`/`cellRects` → **no cache**; only the Vue `computed` memoizes it, and a
size switch invalidates that computed and re-runs the full uncached call. This is the
memoization gap that feeds P2/P3.

---

### P4 — Bundle chunk-split pathology under Rolldown (MED felt / cache-intent DEFEATED)

**What.** `vite.config.ts` `manualChunks` intends: `@vue/*`+`vue` → `vue-vendor`,
pencil-boil → `animation-vendor`. Under Rolldown (Vite 8's default bundler, where
function-form manualChunks is a **hint**, not a strict assignment), the produced graph is
inverted and the split is cosmetic:

| chunk | raw | br | reality (from import/string forensics on `dist/assets/`) |
|---|--:|--:|---|
| `animation-vendor` | 67,285 | 27,377 | **holds Vue's runtime** (`beforeCreate` lifecycle strings live here, not in vue-vendor) fused with pencil-boil; imports no local chunk (the true base) |
| `index` | 108,038 | 36,614 | app code; imports **60** symbols from `animation-vendor`, only **5** from `vue-vendor` |
| `vue-vendor` | 8,475 | 3,937 | an 8.5 KB **husk**; exports 5 symbols, and itself **imports ~20 symbols from `animation-vendor`** |

So the load graph is `index → vue-vendor → animation-vendor`, a 3-hop indirection where the
"vue vendor" chunk is nearly empty and *depends on* the animation chunk that actually carries
Vue. **The cache-isolation goal is defeated:** Vue's stable runtime is co-bundled with
pencil-boil (a dep that bumped 0.6→0.7 this tranche and will bump again), so every
pencil-boil release re-downloads Vue and vice versa; the `vue-vendor` request is pure
overhead (extra RTT for 3.9 KB that could be inlined).

Forensics:
- `grep 'from"./animation-vendor…"' index-DHwIHXRb.js` → 60 imported symbols.
- `grep 'from"./vue-vendor…"' index-DHwIHXRb.js` → `import{a,i,n,r,t}` — 5 symbols, 1 stmt.
- `vue-vendor-_m6YDthG.js` imports 20+ symbols `from"./animation-vendor…"`.
- `beforeCreate` (Vue runtime option-merge string) present in `animation-vendor`, absent in
  `vue-vendor` and `index`.

**Fix.** Re-derive chunking for Rolldown — either drop `manualChunks` and configure
Rolldown's `advancedChunks` (its supported grouping API) to force a clean `vue` group, or
verify the function-form actually lands `@vue/*` where intended (it does not today). The
current split ships an extra request with negative cache value.

Cite: `web/frontend/vite.config.ts` (`build.rollupOptions.output.manualChunks`, the comment
already notes Rolldown quirks); `web/frontend/dist/assets/*` byte/import analysis.

---

### P5 — No font preload → wordmark FOUT gated behind render-blocking CSS (MED-LOW)

**What.** Three self-hosted subset woff2 — `fraunces-subset` (9,772 B),
`patrickhand-subset` (4,312 B), `firacode-subset` (3,624 B) — are declared only via
`@font-face` in `index.css` (`index-Bykbkkbm.css`, 47,775 B raw / 10,894 B br, a
render-blocking `<link rel=stylesheet>`). `index.html` has **no `<link rel="preload"
as="font" crossorigin>`**. Discovery chain: HTML → block on CSS fetch+parse → discover
@font-face → fetch woff2. The hand-drawn Patrick Hand / Fraunces wordmark is the aesthetic
centerpiece, so late discovery = FOUT on the signature text.

**Fix.** Preload the 2–3 subset faces in the built `index.html` head (same
`transformIndexHtml` plugin as P1; the names are content-hashed so inject at build). Total
preload budget ~17.7 KB — trivial, and it parallelizes with CSS instead of chaining after it.

Cite: live `index.css` `@font-face` refs (`firacode/fraunces/patrickhand-subset-*.woff2`);
live `index.html` head (no preload); `_headers` `font-src 'self'` (P5 tranche-2).

---

### P6 — Two wasm worker instantiations across games; one wasm compile paid twice (LOW)

**What.** Sudoku and Futoshiki each own a worker (`solver.worker-DS2fzlRC.js` 10,549 B and
`solver.worker-BqxFRgkr.js` 10,720 B), and **both `init()` the same shared wasm binary**
(`csp_solver_wasm_bg-DUScTLrL.wasm` — confirmed identical hash referenced from both worker
chunks). The 40 KB-br fetch is a cache-hit on the 2nd game, but `compile`+`instantiate` is
paid a second time on first game switch. wasm-bindgen `--target web` recompiles per worker.

**Fix (elegant, optional).** Compile once (`WebAssembly.compileStreaming` → a shared
`Module` passed into both workers' `init({ module })`), or serve both games from one shared
worker (the games already never cross-import; the protocol is uniform). Small win, but it's
the kind of "one binary, one compile" isomorphism the owner mandate favors.

Cite: `solver.worker.ts:26-45`; both worker chunks' `.wasm` ref (identical hash).

---

### P7 — Doubled `Cache-Control` header on `.wasm` (COSMETIC)

Live `csp_solver_wasm_bg-…wasm` returns
`cache-control: public, max-age=31536000, immutable, public, max-age=31536000, immutable` —
the value is emitted twice because both the `/assets/*` and `/assets/*.wasm` stanzas in
`public/_headers` set it. Functionally harmless (identical values), but sloppy; drop
`Cache-Control` from the `.wasm` stanza (let the `/assets/*` rule provide it; keep only
`Content-Type: application/wasm` in the specific stanza).

Cite: `web/frontend/public/_headers` (two stanzas) vs live response header.

---

## Warm round-trip (wire) — what I could and couldn't measure

- **Transfers are zero-copy.** Requests/responses move `Uint32Array` buffers as
  transferables (`useSolver.ts:88,133,160,193`; `solver.worker.ts:91,107,120`), so
  postMessage cost is structured-clone of small scalar metadata only — negligible.
- **Solve elapsed is measured in-worker** (`solver.worker.ts:74-76`, `elapsedMs` on the
  wire) — good instrumentation already exists; the FE could surface a p50/p95 HUD from it.
- **Warm generate p95 ≤ 24 ms** for all served tiers per tranche-2
  `docs/tranches/2026-07-tranche-2/evidence/pass2/P2.md` (cited, not re-measured — PLAUSIBLE
  without a driven browser). Warm round-trip felt cost is dominated by P1's cold-start, not
  by steady-state wasm compute.
- Could **not** capture the live network waterfall timeline or DevTools frame traces — the
  Claude browser extension was not connected this session; all live facts are curl-derived
  (sizes, encodings, cache headers, asset graph).

## Felt-latency ranking (one line each)
1. **P1** cold worker+wasm on first board — serial 40 KB-br compile after mount, no prewarm.
2. **P2** size-switch @4× CPU hitch — 256 uncached `wobbleRect` regens + discarded line pass.
3. **P3** double wobble-line compute per mount — `generateGridPaths` is half dead output.
4. **P4** Rolldown chunk split defeated — `vue-vendor` husk, Vue fused into pencil-boil chunk.
5. **P5** no font preload — wordmark FOUT chained behind render-blocking CSS.
6. **P6** two wasm compiles across games — one shared binary, compiled twice.
7. **P7** doubled `.wasm` Cache-Control header — cosmetic.
