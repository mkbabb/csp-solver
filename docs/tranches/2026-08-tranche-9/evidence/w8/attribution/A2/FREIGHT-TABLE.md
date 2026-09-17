# A2 — THE MAIN CHUNK'S FREIGHT (T9-W8 §8.1, attribution only)

Lane A2 · port 4251 · 2026-09-17 · dist FIXED at HEAD 58014efd.

```
AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
AUDIT: build-identity — http://127.0.0.1:4251 serves the same entry (index-9rZPzI5DEcpe.js)
```
before and after every reading (`identity.txt`, both lines) — the identity did not move.

**board-ready**, the wave's one definition, as this lane implements it: a *visible* `.board-group`
(not merely present — it is `v-show`n and both control-panel twins are always mounted), whose first
`.cell`-class element (`.board-cells .game-cell`) has a non-zero `getBoundingClientRect()`, plus one
`requestAnimationFrame` after that; timestamped with `performance.now()`, whose origin is
navigationStart. Implemented once, in the `INIT` string of `boot-freight.mjs`, and reused verbatim by
`coverage-attrib.mjs`, `cpu-profile.mjs`, `wasm-when.mjs`, `ablate-templates.mjs`.

Host load average ran 5.05–9.22 (1-min) across the session with up to six sibling lanes live; every
number below is a median of ≥3 clean windows, no window reported `tainted`. Wire bytes are what
`vite preview` served (gzip); brotli figures are computed at q11 (`census-bytes.mjs`) and are the
CF-edge-shaped number.

## Board-ready, by regime

| engine | CPU | network | cache | viewport | board-ready (median) | FCP | TBT to ready | n |
|---|---|---|---|---|---|---|---|---|
| chromium | 1× | unthrottled | cold (cache disabled) | 1280×800 | **71.8 ms** | 16 | 0.0 | 21 |
| chromium | 4× | unthrottled | cold | 1280×800 | **317.3 ms** | 44 | 173.0 | 3 |
| chromium | 6× | unthrottled | cold | 1280×800 | 527.6 ms | 72 | 330.0 | 3 |
| chromium | 4× | Fast-3G (1.6 Mbps/150 ms) | cold | 1280×800 | **1374.1 ms** | 828 | 157.0 | 3 |
| chromium | 4× | unthrottled | warm (2nd nav) | 1280×800 | **202.7 ms** | 208 | 68.0 | 3 |
| chromium | 1× | unthrottled | warm | 1280×800 | 52.7 ms | — | 0.0 | 3 |
| chromium | 4× | unthrottled | cold | 390×844 dpr3 touch | 292.3 ms | 44 | 145.0 | 3 |
| chromium | 1× | unthrottled | cold | 390×844 | 65.7 ms | — | 0.0 | 3 |
| chromium | 6× | Fast-3G | cold | 390×844 | 1499.4 ms | 840 | 273.0 | 3 |
| chromium | 4× | unthrottled | first visit (empty cache, cache ON) | 1280×800 | 351.9 ms | 48 | 200.0 | 3 |
| chromium | 4× | Fast-3G | first visit | 390×844 | 1382.5 ms | 828 | 166.0 | 3 |
| webkit | 1× (no CDP throttle) | unthrottled | cold | 1280×800 | 249.0 ms | 144 | **NOT MEASURED** | 3 |
| webkit | 1× | unthrottled | cold | 390×844 | 393.0 ms | 128 | **NOT MEASURED** | 3 |

WebKit TBT is NOT MEASURED, from the engine's own mouth: `PerformanceObserver.supportedEntryTypes`
in Playwright WebKit reads
`event,first-input,largest-contentful-paint,mark,measure,navigation,paint,resource` — no `longtask`
(`misc-readings.txt`). `observe({type:'longtask'})` does **not** throw there, it silently
observes nothing, so a zero-task boot from WebKit is an absence of instrument, not a clean boot. The
webkit "warm" rows are dropped: only the chromium arm primes a cache, so webkit's warm run was a
second cold context. **No webkit reading here is a Safari number and none is an iOS claim.**

Cache delta (the 8.1 "cache story" for this lane's half): 4× desk, cold 317.3 → warm 202.7 ms.
The saving is transfer, not work — TBT 173 → 68 ms and 183,194 encoded bytes → ~0 on the wire.

## The boot waterfall (chromium 4×, cold, desk, one representative window)

Everything before board-ready, `SUMMARIES.txt`:

| asset | initiator | fetched (ms) | encoded (gzip) |
|---|---|---|---|
| index-9rZPzI5DEcpe.js | script | 6→13 | 73,484 |
| index-BMuoFtzKf9_k.css | link (render-blocking) | 7→10 | 18,909 |
| vue-vendor | modulepreload | 7→11 | 33,562 |
| animation-vendor | modulepreload | 7→9 | 4,698 |
| solver.worker | modulepreload | 7→9 | 4,303 |
| fraunces-subset.woff2 | link preload | 7→10 | 14,636 |
| patrickhand-subset.woff2 | link preload | 7→10 | 4,312 |
| firacode-subset.woff2 | link preload | 7→9 | 3,624 |
| **fraunces-subset.woff2 (2nd)** | **fetch — `bakeFace()`** | 95→97 | 14,636 |
| templates-LkXzF59FZu96.js (sudoku bank) | dynamic import | 260→262 | 4,932 |
| avatar.png (AttributionCard) | img | 326→327 | 6,098 |

**183,194 encoded bytes** cross before board-ready. No `.wasm` — see below.

## THE FREIGHT TABLE

Executed-by-board-ready measured with CDP `Profiler.startPreciseCoverage` (detailed) folded onto
source modules through the scratch-bundle sourcemaps (`coverage-attrib.mjs`, `SUMMARIES.txt`).
Coverage instrumentation inflates board-ready (762–884 ms vs 317 ms without) — the *byte* facts hold,
the ready timestamp inside a coverage window does not.

| item | bytes raw / brotli | fetched at (4× cold desk) | used by board-ready | freight (unused-at-ready) | mechanism cure it shapes | expected move on readiness |
|---|---|---|---|---|---|---|
| **entry `index-*.js`** | 215,299 / 62,465 | 6→13 ms | 113,166 / 215,322 chars = **52.6 %** | **102,156 chars (~29.6 KB brotli)** | split by *first view*, not by vendor | see rows below |
| ├ `pencil/chrome/GameGallery/*` (GameGallery.vue, useCarouselGlide, GameCard, StagingBand) | 20,251 / ~5,876 | rides the entry chunk | 1,277 = **6 %** | **18,974 (~5,505 br)** | `defineAsyncComponent` the gallery, prefetch on idle after board-ready | −bytes on the render-blocking chunk; readiness move UNMEASURED (needs a rebuild — 8.2) |
| ├ `games/shared/techniqueEngine.ts` | 7,058 / ~2,048 | rides the entry chunk | 183 = **3 %** | **6,875 (~1,995 br)** | `import()` behind the first assist/technique request | same shape |
| ├ `games/shared/useSession.ts` (multiplayer) | 5,456 / ~1,583 | rides the entry chunk | 721 = **13 %** | 4,735 | `import()` behind joining/hosting a session | same shape |
| ├ `games/shared/useUndoHistory.ts` | 2,604 / ~756 | rides the entry chunk | 289 = **11 %** | 2,315 | leave; the M11 widening lands here | — |
| ├ `games/shared` (whole family) | 99,851 / ~28,970 | rides the entry chunk | 42,845 = **43 %** | 57,006 | — | — |
| ├ `pencil/celestial/DarkModeToggle.vue` | 10,146 / ~2,944 | rides the entry chunk | 9,382 = **92 %** | 764 | none — it is on the boot path and it runs | — |
| **`vue-vendor`** | 85,198 / 30,309 | 7→11 ms (modulepreload) | 44,852 / 85,250 = **53 %** | 40,398 | none available (framework) | — |
| **`animation-vendor` (pencil-boil)** | 11,649 / 4,264 | 7→9 ms (modulepreload) | 8,312 / 11,703 = **71 %** | 3,391 | none — it is the boot path (see CPU below) | — |
| **`index-*.css`** | 93,735 / 16,427 | 7→10 ms, **render-blocking** | **45,341 / 93,735 = 48.4 %** (median of 5) | **48,394 B (~8.5 KB br)** | critical-CSS split: inline the board+masthead rules, defer the gallery/poster/celebration rules | UNMEASURED; the sheet is fetched in 3 ms locally, so the move is a slow-link/parse one |
| ├ dark theme's share of that sheet | **1,433 B (1.5 %)** | — | — | — | **none — dark mode is not CSS freight** | — |
| **`solver.worker-*.js`** | 22,689 / 3,700 | 7→9 ms (**modulepreload**) | **0 % — nothing runs from it before board-ready** | 22,689 raw / 3,700 br | keep the preload but move it off the boot burst (`rel=prefetch`, or preload on idle) | ~0 ms at ready; −3.7 KB br from the boot burst |
| **`csp_solver_wasm_bg.wasm`** | 123,336 / 41,230 | **never before board-ready — 0 of 45 windows** | n/a | **not boot freight** | none needed | — |
| **`templates-LkXzF…js` (sudoku bank)** | 18,164 / 4,327 | 260→262 ms — **before ready in 39/45 windows** | 17,987 / 18,215 = **99 % evaluated, 0 boards used** at the default 9×9 tier | 18,164 raw / 4,327 br of board literal the default deal never reads | hoist the 137-byte `TIER_SOURCE` table out of the bank module; keep `import()` of `TEMPLATE_BANK` behind `tierSource(...) === 'bank'` | **MEASURED: −0.1 ms (nil).** Byte cure only: −4.9 KB on the wire, one fewer request |
| **`templates-CsCa…js` (thermo bank)** | 24,595 / 6,073 | **never — 0/45 windows** | n/a | not boot freight | none needed | — |
| **fraunces-subset.woff2** | 14,636 / 14,639 (already compressed) | 7→10 ms preload **and 95→97 ms again via `bakeFace()`** | yes (wordmark) | see font row below | see font row | see font row |
| **avatar.png** (AttributionCard) | 6,098 | 326→327 ms — inside the boot window | not needed for the board | 6,098 | `loading="lazy"` / defer past board-ready | ~0 ms; one fewer boot request |

Entry-chunk source attribution (all 125 rows) is banked in `module-map.jsonl`; per-family rollup in
`SUMMARIES.txt`. W4 §4.4 **has landed on this dist**: neither template bank rides the entry
chunk — both are their own chunks, and thermo's is never fetched at boot.

## THE FONTS' DOUBLE LIFE — the lane's sharpest finding

Counted from the driver's own request stream, HTTP status per response, cold boot
(`misc-readings.txt`, `misc-readings.txt`):

| engine | firacode | patrickhand | fraunces | redundant font bytes |
|---|---|---|---|---|
| chromium | 1 × 200 | 1 × 200 | 2 × 200 (2nd = 300 B, memory-cache hit) | ~300 B |
| **webkit** | **2 × 200** | **2 × 200** | **3 × 200** | **37,808 B (22,872 preload-miss + 14,936 bake)** |

WebKit fetches each subset **twice**: once as `initiatorType: "link"` (the `head-hints` preload, at
22 ms) and again as `initiatorType: "css"` (the `@font-face`, at 130 ms), each a full 200 with the
whole body — i.e. WebKit does **not** consume the `<link rel=preload as=font crossorigin>` for the
`@font-face` request at all, so the preload buys nothing there and the real face does not start
arriving until 130 ms. Chromium consumes it. Reproduced 9/9 webkit windows.

The third fraunces fetch is `HandwrittenLogo.vue`'s `bakeFace()` (`loadBakeFace`, `fetch(frauncesUrl,
{credentials:'omit'})` → chunked `String.fromCharCode` → `btoa` → `data:font/woff2;base64,…`):

- true first visit (empty cache, cache **on**): 300 B header-only hit, ~1 ms unthrottled
  (`SUMMARIES.txt`) — **not** a byte cost;
- cache **disabled** (hard reload / the charter's cold regime): a full second **14,936 B** download;
- under emulated Fast-3G the second fetch reads 1158→1313 ms (155 ms) even as a cache hit, which is
  the emulator charging RTT on a cached response — flagged, not claimed.

*Not* a quality-law candidate: nothing here proposes dropping a subset or the bake.

## THE WASM AND THE WORKER — on boot, or on first deal?

`wasm-when-4x.jsonl` (CDP request stream, worker targets auto-attached, 4× cold):

- `solver.worker-*.js` is **modulepreloaded at 16 ms on every boot** (45/45 windows) — the chunk
  travels on the boot path;
- the first `Worker` is **constructed at 762 ms wall, after board-ready (760 ms wall / 392.8 ms
  page-relative)**; the second at 1186 ms — the transport's documented two-instance design;
- `csp_solver_wasm_bg-*.wasm` is first requested at **1071 ms wall, after board-ready**, from inside
  the Worker (`instantiateStreaming`; the document-level preload is deliberately absent per
  vite.config's `head-hints` note, and the reading confirms a single GET, no double-fetch warning);
- **0 of 45 boot windows fetched the wasm before board-ready.** The wasm is on the path to the
  **first deal**, never to board-ready.
- `transport.ts` exports `prewarm()` ("spin the worker up … while idle") and **nothing in `src/`
  calls it** — the only callers are `transport.test.ts`. The documented idle prewarm is not wired in
  the product. That is a pre-warming seam already built and unused (8.2's cheapest lever, and a
  MECHANISM cure by the letter of M09).

## MAIN-THREAD SELF-TIME ON THE COLD PATH (corroboration, not this lane's cure)

CDP sampling profile, 100 µs, navigation → board-ready, 4× cold desk, 3 windows
(`SUMMARIES.txt`). The profiled window runs wider than board-ready (Profiler.start precedes
navigation, waitForFunction trails it), so these are **shares**, not absolute cold-path ms:

| share of profiled JS self-time | module |
|---|---|
| **53 %** | `@mkbabb/pencil-boil/dist/raster.js` — the bake pipeline |
| 9 % | `@vueuse/core` |
| 6 % | `@vue/runtime-core` |
| 2 % | `games/shared/GameControlPanel.vue` |
| 1.7 % | `pencil/chrome/HandwrittenLogo.vue` |

The bake pipeline owns the cold path's CPU by a factor of five over anything else. That is lane A1's
suspect and this lane does not claim it; it is recorded here because the freight lane's own items
(gallery, technique engine, session, banks) are **bytes**, not milliseconds, and the readiness number
will not move until the raster work does.

## Instruments (every one rerunnable, header says how)

| file | what |
|---|---|
| `census-bytes.mjs` | raw/brotli(q11)/gzip per dist file → `misc-readings.txt` |
| `module-map.mjs` | sourcemap → per-source-module bytes of a built chunk → `module-map.jsonl`, `SUMMARIES.txt` |
| `boot-freight.mjs` | board-ready + resource waterfall + longtasks + JS/CSS coverage, all regimes, both engines |
| `coverage-attrib.mjs` | `Profiler.startPreciseCoverage` + `CSS.startRuleUsageTracking` stopped at board-ready, folded onto source modules |
| `cpu-profile.mjs` | CDP sampling profile navigation→board-ready, self-time by source module |
| `wasm-when.mjs` | when the Worker is constructed and the wasm fetched, vs board-ready and vs first deal |
| `ablate-templates.mjs` | read-only route-intercept ablation of the sudoku bank, interleaved base/ablated |
| `webkit-font-confirm.mjs` | driver-side woff2 request counts + `supportedEntryTypes`, per engine |
| `css-shape.mjs` | at-rule/dark-block byte census of the render-blocking sheet |
| `summarize-readings.mjs` | medians per regime from any readings JSONL |

The analysis bundle (`scratch-dist`, built with `--outDir` into this directory and `--sourcemap`) was
byte-identical to the shipped dist modulo the appended `sourceMappingURL` comment
(`SUMMARIES.txt`), so every sourcemap attribution above is exact for the shipped bytes.
It was deleted after the tables were banked, per the evidence cap. `web/frontend/dist` and
`src/games/sudoku/data/templates.ts` were verified unchanged across it.

## Not landed

- CSS rule usage **at first paint, distinct from board-ready**: the FCP-stop arm raced past FCP
  before coverage could be taken, so all five CSS readings are at/after board-ready.
- The readiness move of the gallery / technique-engine / session splits: they cannot be ablated by
  route interception (they are inside the entry chunk), and this wave forbids a rebuild of `dist`.
  Those rows carry byte facts and a named cure, not a promised millisecond.
- Real Safari and real iOS: forbidden in this session (M19). Device numbers arrive only from 8.3.

## Where the evidence lives

`SUMMARIES.txt` concatenates every derived table (regime medians, boot waterfall, font timings,
freight rollups, CSS shape, ablation result, CPU-profile shares, scratch-vs-dist identity proof, host
load log, and the note on the first matrix run that zsh word-splitting collapsed into 21 identical
1x windows — kept as the large-N 1x baseline). `misc-readings.txt` concatenates the small raw
outputs (dist byte census, CSS coverage per window, CPU-profile JSONL, the ablation JSONL, the
coverage window, the per-engine font-confirm JSON, the first-visit readings). Per-window raws live in
`readings-chromium.jsonl`, `readings-chromium-1x-cold-desk-21w.jsonl`, `readings-webkit.jsonl`,
`wasm-when-4x.jsonl`; the full resource waterfall is kept on the first window of each regime and
summarised on the rest, to hold this lane's 180 KiB share of the wave cap (`du -sk` = 176).

