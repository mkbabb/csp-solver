# T9-W8 §8.1 — lane A3, THE CACHE STORY (cold → warm)

Attribution only. No cure landed. Read-only against the live edge; local readings against the
chair's fixed `dist` at HEAD `58014efd`.

    BEFORE  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
            AUDIT: build-identity — http://127.0.0.1:4254 serves the same entry (index-9rZPzI5DEcpe.js)
    AFTER   (identical — see dist-identity-BEFORE.txt / dist-identity-AFTER.txt)

Port: assigned 4252 was already held by a sibling lane's `vite preview` (PID 97088) at launch;
this lane took **4254**, still `--strictPort`, same dist, identity asserted against the served page.

Host: darwin 25.4.0. Load average start `{ 10.26 11.92 10.59 }`, matrix start `{ 6.8 }`,
matrix end `{ 7.86 7.41 8.35 }`, finish `{ 7.77 7.32 8.21 }`. Up to six sibling lanes ran
concurrently throughout; every absolute millisecond below is a contended-host number and a
PROXY. No number here is a Safari number and none is an iOS claim.

## Board-ready, the shared definition as executed

`.board-group` visible (offsetWidth‖offsetHeight‖getClientRects().length — it is `v-show`n and
both control-panel twins are always mounted) AND the first board cell's
`getBoundingClientRect()` has width>0 and height>0 AND one `requestAnimationFrame` has fired
after that; timestamped `performance.now()` (⇒ relative to navigationStart).

**There is no `.cell` class in this tree.** The cell-ish classes are `game-cell`, `sudoku-cell`,
`board-cells`, `cell-line`, `cell-native-input`, `cell-ghost`, `cell-ghost-path`. The board cell
is `.game-cell`, and that is what the probe queries. A lane querying `.cell` literally measures
nothing and its board-ready never fires.

## 1 — The edge (read-only HEADs, 2026-09-17)

Live production is the **T8.1 build** `index-CaFRLmgODqOS.js`, not HEAD's
`index-9rZPzI5DEcpe.js`. Edge *headers* are policy facts about the deploy; edge *timings* are
not this tree's timings.

Raw: `edge-live.jsonl` (`edge-census.sh` + `edge-bytes.sh`); a prior pass of this lane, two HEADs per
URL showing edge warmth, is folded into `edge-prior-pass.txt`.

| path | Cache-Control | cf-cache-status | age | wire B (gzip) | browser may cache |
|---|---|---|---|---|---|
| `/` | `public, max-age=0, must-revalidate` | **DYNAMIC** | — | 1,349 (br) | revalidate every load |
| `/assets/index-CaFRLmgODqOS.js` | `public, max-age=31536000, immutable` | HIT | 2658 | 76,662 | 1 y |
| `/assets/vue-vendor-*.js` | immutable 1 y | HIT | 2657 | 33,548 | 1 y |
| `/assets/animation-vendor-*.js` | immutable 1 y | HIT | 2625 | 4,697 | 1 y |
| `/assets/index-*.css` | immutable 1 y | HIT | 2662 | 17,682 | 1 y |
| `/assets/solver.worker-*.js` | immutable 1 y | HIT | 2664 | 4,301 | 1 y |
| `/assets/fraunces-subset-*.woff2` | immutable 1 y | HIT | 2662 | 14,636 | 1 y |
| `/assets/patrickhand-subset-*.woff2` | immutable 1 y | HIT | 2661 | 4,312 | 1 y |
| `/assets/firacode-subset-*.woff2` | immutable 1 y | HIT | 2662 | 3,624 | 1 y |
| **`/assets/csp_solver_wasm_bg-*.wasm`** | immutable 1 y | **DYNAMIC** (4/4 probes) | — | 48,561 | 1 y |
| `/favicon.svg` | `public, max-age=14400, must-revalidate` | REVALIDATED | — | 954 | 4 h + revalidate |
| `/og-card.png` | `public, max-age=14400, must-revalidate` | REVALIDATED | — | 129,217 | 4 h + revalidate |

`public/_headers` is honored exactly: `/assets/*` immutable 1 y, `/assets/*.wasm` gets its
`Content-Type: application/wasm` and no duplicated Cache-Control, index.html deliberately left
revalidating. Two facts the file does not predict:

- **The wasm never reaches the edge cache.** Every other `/assets/*` file reads HIT with a
  2,600 s age; the wasm reads DYNAMIC on 4/4 probes despite carrying the same immutable
  directive. Every first-time visitor pulls those 48,561 B from the Pages origin, not the PoP.
  Measured from this host: TTFB 0.173 s (wasm, DYNAMIC) vs 0.082–0.121 s (edge HITs) vs
  0.208–0.258 s (`/`, DYNAMIC).
- **`/` is DYNAMIC too**, so the first hop of *every* load — cold and warm alike — is a full
  origin round trip before a single asset can start.

**No service worker.** `navigator.serviceWorker.getRegistrations()` on the live page returns
`[]`, `controller` is null, `caches.keys()` is `[]`, and `serviceWorker|workbox|vite-plugin-pwa`
appears nowhere in `src/`, `vite.config.ts` or `package.json`. The T2-W3 abrogation holds.
Raw: `live-edge-checks.json` (`A3-live-sw-check.mjs`).

**Off-origin, uninvited**: CF Pages injects
`https://static.cloudflareinsights.com/beacon.min.js/…` into the live HTML. Our own CSP blocks
it (`requestfailed: csp`, transferSize 0, start=end=180 ms). Costs bytes in an uncacheable
document and one console violation per load; buys nothing. Raw: `live-edge-checks.json` (`A3-live-beacon-check.mjs`).

## 2 — Local dist, cold → warm

`A3-cache-probe.mjs` → `raw.jsonl` (63 readings), folded by `A3-fold.mjs` → `tables.txt`.
`A3-wasm-probe.mjs` → `wasm-raw.jsonl`. `A3-truecold-probe.mjs` → `truecold-raw.jsonl`.
Per-resource medians: `tables.txt`. Regime trace and host load: `matrix-trace.txt`. 3 windows per cell, medians reported, no window
reported `tainted` (blur/visibilitychange watched; no 1000–1300 ms lone delta seen).

**A method correction worth carrying.** CDP `Network.setCacheDisabled(true)` maps to
`LOAD_BYPASS_CACHE`: reads are bypassed but responses **are still stored**. So a two-navigation
cold→warm pair would have measured one cold and one warm correctly, but a request the page
issues twice *within one load* pays the wire twice under CDP and once in life. Hence three
navigations (cold / primer / warm — primer and warm both read cache, so warm has 6 replicates)
plus a separate **true-first-visit** probe: fresh context, cache enabled but empty, one
navigation. Wire totals below come from the true-first-visit probe; timings agree across both.

### The regime table (chromium, CDP throttles; webkit unthrottled)

Full grid in `tables.txt`. board-ready / LCP medians, ms:

| regime | cold board-ready | warm board-ready | cold LCP | warm LCP | cold wire B | warm cache hits |
|---|---|---|---|---|---|---|
| chromium 1× · unthrottled link · 1280×800 | 74.1 | 44.4 | 684 | 660 | 212,064 | 27/27 |
| chromium 4× · unthrottled link · 1280×800 | 355.4 | 211.7 | 1,968 | 1,112 | 212,064 | 27/27 |
| **chromium 4× · Fast-3G · 1280×800** | **1,385.3** | **510.5** | **2,316** | **1,412** | **212,064** | 27/27 |
| chromium 4× · Fast-3G · 390×844 (mobile) | 1,354.7 | 556.0 | 3,232 | 2,340 | 212,064 | 27/27 |
| chromium 6× · Fast-3G · 390×844 (mobile) | 1,535.9 | 669.0 | 4,388 | 2,228 | 212,064 | 27/27 |
| webkit · unthrottled · 1280×800 | 231 | 186 | 743 | 711 | 231,532 | 21/30 |
| webkit · unthrottled · 390×844 | 377 | 364 | 732 | 709 | 231,532 | 21/30 |

WebKit: **long tasks NOT MEASURED** — `PerformanceObserver.supportedEntryTypes` carries no
`longtask`, and an empty task list from an engine that cannot see tasks is not a clean boot.
WebKit's `transferSize` semantics differ from Chromium's, so its byte totals are not comparable
across engines; its cache-hit count (21/30 warm vs 1/30 cold) is the portable half.

### THE LAYER TABLE — chromium 4× CPU · Fast-3G (1.6 Mbps / 150 ms) · 1280×800

Medians of 3 windows. "Cold" = true first visit where a byte figure is quoted.

| layer | cold ms | warm ms | delta | mechanism | free for a cold visitor |
|---|---|---|---|---|---|
| **HTML first hop** | live edge TTFB 208–258 ms, `cf DYNAMIC` | same — `max-age=0` | **0** | edge refuses to cache the document; browser must revalidate | let the PoP hold it with revalidation: −120…−150 ms on this host's link, every visitor |
| **critical JS+CSS** (131,853 B: index 73,484 · vue-vendor 33,562 · animation-vendor 4,698 · css 18,909) | last byte **1,114.2** | last byte **343.7** (1,200 B = header allowance) | **−770.5** | HTTP cache, `immutable` 1 y | nothing more — the layer is already optimally cached |
| **fonts** (3 woff2, 22,572 B) | last font byte 1,385.3 · `fonts.ready` 1,414.6 | 637.1 · 848.9 | **−565.7** (ready) | HTTP cache | parse is ~29 ms cold at 4×; the delta is fetch, not parse |
| **wasm** (123,336 B on disk, 48,561 B gz) | **2** fetches, first at 2,123 ms wall; body off the wire 193 ms + 716 ms | **1** fetch; body **0.1–0.4 ms** (cache) | fetch interval **350 → 157** | HTTP cache + one fewer worker | edge-cache the wasm; single-flight the module |
| **bakes** (`toBlob` → `createObjectURL`) | **28** bakes / 56 object URLs, span 1,459.5→2,328.1 = **868.6 ms** | **28** bakes / 56 object URLs, span 575.4→1,388.0 = **812.6 ms** | **−56 ms (≈0)** | **none — the pose-stack cache is an in-memory `Map`; nothing persists** | persist the stacks; defer the not-yet-visible ones |
| **main-thread blocking** (longtask) | 10 tasks / **701 ms** | 10 tasks / **601 ms** | **−100 ms** | only the font-gate's cold re-bake | the compute layer is paid in full on every load |
| **board-ready** | **1,385.3** | **510.5** | **−874.8 (−63 %)** | — | — |
| **time-to-givens** (first `.game-cell` carrying text) | **3,048.4** | **485.3** | **−2,563 (−84 %)** | wasm cache + one fewer worker + an unclogged main thread | — |
| lazy poster chunks (16 files, ~16 KB) | 2,115 → 2,772 | 1,237 → 1,730 | — | already deferred; lands on top of the wasm fetch | — |

Wire, true first visit vs warm: **188,822 B over 29 requests → ~0 B over 27 requests**
(27/27 served from the HTTP cache; Chromium bills a ~300 B header allowance per hit, so
`transferSize === 0` finds nothing and `transferSize <= 300` is the correct test).

### What the delta says, layer by layer

- **Network is the whole warm win at board-ready.** 131,853 B of critical JS+CSS at 1.6 Mbps is
  ≈0.66 s of transfer; the fonts add 22,572 B behind it. The 874.8 ms board-ready delta sits
  inside that transfer window, and the compute layer contributes 100 of it.
- **Compute is not memoized across loads, at all.** 28 `toBlob` encodes and 56
  `createObjectURL` mints run identically cold and warm in every chromium regime
  (`bakes` column, 5 chromium regimes × 2 states). `pencil-boil/dist/vue.js` keeps the pose stacks in a
  module-level `Map` keyed by `stackKey(size, dpr, theme)` — page-lifetime only. Nothing in
  `src/` or in pencil-boil writes to IndexedDB or Cache Storage (grep: 0 sites; the four
  `localStorage` writers are the drawer flag, the staging ledger, player identity and board
  persistence). **The warm win is network-only, and this is the proof.**
- **0 of 28 bakes complete before board-ready** in every chromium reading. The bake burst is not
  render-blocking for board-ready — it is what saturates the window *after* it, and it is what
  pushes the wasm fetch out to 2,123 ms on the cold path.
- **The wasm is fetched and compiled twice on the cold path.** 2 wasm requests and 3
  `solver.worker-*.js` requests cold, 1 and 2 warm, 3/3 windows, both probes. The board shows
  empty cells at 1,341 ms and the givens only at 3,048 ms — **1,714 ms of visibly blank board**
  that the warm load does not have (warm: cells and givens land in the same frame, gap 0.0 ms).
- **The font double-life is a fetch and a base64 encode, not a second download.**
  `HandwrittenLogo.vue:35` does `fetch(frauncesUrl, {credentials:"omit"})` and base64s the
  14,636 B subset into a `data:font/woff2` face for the bake. On a true first visit that fetch
  is a **cache hit** off the `<link rel=preload>` (transferSize 300 at 1,168→1,327 ms) — so it
  costs ~159 ms of wall and one main-thread base64 of 14,636 B, not 14,636 B of wire. The
  212,064 B figure in `raw.jsonl`'s cold rows counts it as a second download and is a CDP
  artifact; 188,822 B is the number a visitor pays.
- **The 16×16 template bank is already off the critical path**: `templates-*.js` is 4,932 B,
  requested at 1,318 ms cold — after board-ready, in its own chunk.

### The owner's sentence, as numbers on this tree

"Subsequent invocations are better" — chromium 4× / Fast-3G / 1280×800, a proxy:
board-ready 1,385 → 511 ms (−63 %), LCP 2,316 → 1,412 ms (−39 %), time-to-givens
3,048 → 485 ms (−84 %), wire 188,822 → ~0 B.

"But could be improved dramatically" — the same pair: bakes 28 → 28 (0 %), object URLs 56 → 56
(0 %), main-thread blocking 701 → 601 ms (−14 %). **Every millisecond of compute is paid in
full on the warm load.** A returning visitor saves the network and nothing else.
