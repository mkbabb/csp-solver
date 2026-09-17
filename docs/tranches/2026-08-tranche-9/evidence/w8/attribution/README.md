# T9-W8 §8.1 — the attribution estate, indexed

    AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z

2026-09-17 · dist built at HEAD `58014efd` (tree at synthesis `7b0610cc`, the CI cure; no `src/`
delta) · host darwin 25.4.0 arm64, 18 cpus, six sibling lanes · identity bracketed by all
fourteen dirs, moved in none · attribution only: nothing under `src/`, `scripts/`, `.github/`,
`csp-solver/` was touched, nothing was built, nothing committed.

**Read `ATTRIBUTION.md` first**—the 8.1 table, the born-RED budgets, curve-vs-frames, the
cold→warm layers, GATE D, the gaps. Then `../cures/charters/README.md` (execution order: C01,
C02, C04 first) and `../cures/charters/8.3-device-instrument.md`. W7 reads
`../../w7/intake-from-w8.md`. Every instrument carries a one-line RUN header; all serve the
fixed dist over `vite preview` in the 4250–4260 band and none builds.

## Lanes

| lane | instruments | reads |
|---|---|---|
| **A1** bake pipeline | `bake-census.mjs` | wraps Blob → `createObjectURL` → `drawImage` → `toBlob`; names each encode's surface, ms, bytes; toggles 1 and 2 |
| | `double-bake-proof.mjs` | the discarded round, per window, with its mechanism |
| | `summarize.mjs` · `trace-summary.mjs` | fold to `bake-table.md` · main-thread self-time from a CDP trace (the 19.9 MB trace is NOT banked) |
| **A2** entry freight | `boot-freight.mjs` | board-ready + waterfall + TBT + coverage, every regime; `--cache cold\|warm\|firstvisit` |
| | `webkit-font-confirm.mjs` | the DRIVER's woff2 request/response census + `supportedEntryTypes` |
| | `ablate-templates.mjs` · `wasm-when.mjs` · `cpu-profile.mjs` | bank stubbed by route intercept · Worker + wasm timing vs ready · self-time by module (SHARES only) |
| | `coverage-attrib.mjs` · `module-map.mjs` | **do not run against the fixed dist**—the sourcemaps were deleted with the scratch build |
| | `census-bytes.mjs` · `css-shape.mjs` · `summarize-readings.mjs` | raw/br/gzip per file · at-rule + dark-scope census · medians |
| **A3** cache story | `A3-cache-probe.mjs` + `A3-run-matrix.sh` + `A3-fold.mjs` | cold / primer / warm, per-resource, bakes, object URLs, cache hits |
| | `A3-truecold-probe.mjs` · `A3-wasm-probe.mjs` | a TRUE first visit (CDP cache-disable double-counts) · wasm requests, `tCells`, `tGivens` |
| | `edge-census.sh` · `edge-bytes.sh` · `A3-live-sw-check.mjs` · `A3-live-beacon-check.mjs` | read-only live-edge headers and bytes · no service worker · the CSP-blocked CF beacon |
| **A4** drawer | `drawer-trace.mjs` | per-gesture rAF census + CDP trace bucketed onset / settle; cycle 0 apart. **Its "mobile" is dpr 1** |
| | `onset-ablate.mjs` · `gesture-geometry.mjs` · `dom-probe.mjs` · `summarize.mjs` | `inert` / class / Teleport provoked alone · movers' rects per rAF · DOM census · fold |
| **A5** first toggle | `toggle-probe.mjs` + `run-matrix.sh` + `make-tables.mjs` | N toggles: click→settle, `toBlob` count, whirl rAF census, longtask |
| | `trace-restyle.mjs` | elements restyled + main-thread event census per toggle |
| **A6** GATE D + budget | `readiness-timeline.mjs` + `summarize-readiness.mjs` | 16 cells × 3: FCP, LCP, board-ready, `firstBake`, first boil tick, drawer flip, TBT(3000). Its `.boil-frame` selector matches nothing—use `.boil-frame-layer` |
| | `toggle-and-trace.mjs` | first/second toggle blocking; Profiler busy-to-ready (BIMODAL—n ≥ 9 or don't quote) |
| | `gate-d-run1..4.txt` · `device-probe-spike.js` · `BUDGET-CANDIDATE.md` · `8.3-device-instrument-charter.md` | `ci-subset.mjs` reports · the 8.3 spike and its source charter |
| **A7** gallery in/out | `fold-frames.mjs` | rAF census + longtask + `drawImage` bake count + animation timeline |
| | `fold-geometry.mjs` · `mover-census.mjs` | GLIDE vs NO TRAVEL per frame · wraps `animate` / `finish` / `cancel`—names the killer |
| | `fold-cdp-trace.mjs` | NOT LANDED (zero trace events); banked so the gap is re-runnable |
| | `a7-fold-trace.mjs` · `runs/` | a foreign process's files; the source of no number |

## Refuters (`refute/<lane>/`)

| refuter | own instruments | the turn it took |
|---|---|---|
| **A1** | `cp-probe.mjs` | WebKit: board-ready TRUE at 115–125 ms, stamped at 397–412—the discard round starves it. Discard 799.4 → 992.8; "96 % of TBT" → 73–80 % |
| **A2** | `xablate.mjs` · `xentry-coverage.mjs` | css2x −0.5, jspad +5.7, no-worker-preload +7.0, no-font-preload −79.0 WebKit / +23.5 chromium. `prewarm()` unwired: REFUTED |
| **A3** | `R3-truecold-wasm.mjs` · `R3-wasm-single-flight.mjs` | the double wasm fetch is real on a true first visit; removable 593, not 716; edge GET ×5 |
| **A4** | `tongue-visible.mjs` · `vacated.mjs` · `loadpath.mjs` | the 459 px close jump is occluded ≈100 ms; nothing of the drawer's is on the board-ready path |
| **A5** | `critpath-ablate.mjs` | the flip's repaint IS delayed (373 vs 24 ms); free `toBlob` removes only 169.6 ms; the cache is per surface; delta restated 1,103.5 |
| **A6** | `refute-probes.mjs` (`--mode ablate\|gapsplit`) | the 2,381 ms gap is two legs (779 draw-in + 1,637 raster); sixteen poster chunks REFUTED by ablation; the dead `.boil-frame` selector |
| **A7** | `worst-frame-offset.mjs` | the fold's long frame is the BAKE frame, both directions; exit mover CONFIRMED killed; 464.6 unsourced |

## Byte census

`du -sk` is block-rounded (4 KiB a file); bytes are `stat`. Lane cap 180 KiB by `du`; refuter share 30 KiB (30,720 B) by bytes; wave cap 2,097,152 B.

| dir | files | bytes | `du -sk` KiB | note |
|---|---|---|---|---|
| `attribution/A1` | 23 | 123,188 | 168 |  |
| `attribution/A2` | 19 | 141,076 | 176 |  |
| `attribution/A3` | 20 | 125,288 | 180 | at the 180 KiB lane cap |
| `attribution/A4` | 10 | 161,598 | 180 | at the 180 KiB lane cap |
| `attribution/A5` | 11 | 142,957 | 164 |  |
| `attribution/A6` | 18 | 127,196 | 172 |  |
| `attribution/A7` | 19 | 138,094 | 160 |  |
| `attribution/refute/A1` | 8 | 25,739 | 44 |  |
| `attribution/refute/A2` | 5 | 28,504 | 44 |  |
| `attribution/refute/A3` | 14 | 29,966 | 68 |  |
| `attribution/refute/A4` | 11 | 100,693 | 120 | over its 30 KiB share |
| `attribution/refute/A5` | 17 | 114,923 | 148 | over its 30 KiB share |
| `attribution/refute/A6` | 9 | 30,445 | 52 |  |
| `attribution/refute/A7` | 11 | 83,338 | 100 | over its 30 KiB share |
| `cures/charters` | 13 | 38,414 | 56 |  |
| `attribution/ATTRIBUTION.md` + `README.md` | 2 | 32,185 | — | the synthesis |
| **wave dir `evidence/w8/`** | 210 | **1,443,604** | **1864** (1,908,736 B by blocks) | cap 2,097,152 B |

**UNDER the cap both ways**: 1,443,604 B by bytes (653,548 B free), 1,908,736 B by blocks (188,416 B free). That headroom is all 8.2 and 8.3 have. If it tightens, RE-ENCODE, don't delete—gzip the raw JSONL as A1 already did (`gunzip -c` feeds every summarizer): `A4/raw/readings.jsonl` (106,564 B), `A5/raw-all.jsonl` (92,752), `A3/raw.jsonl` (45,248), `refute/A4/raw/retake.jsonl` + `retake-6x.jsonl` (58,777), `A6/readiness.jsonl` (35,097), `refute/A5/retake-*.jsonl` (eight files, ≈ 85 KB), `refute/A7/re-*.jsonl` (≈ 68 KB). JSON lines gzip ≈ 8:1, so roughly 430 KB comes back. `w7/intake-from-w8.md` lives outside this dir and doesn't count.

## Laws this estate ran under

Attribution before any cure · the dist is fixed · serve, don't build · real Safari and iOS
forbidden (M19)—no WebKit number is a Safari number or an iOS claim · ≥ 3 windows, median,
taint named, load printed · one board-ready definition · the quality law (M09) on every
candidate · a number without a banked file is VOID.
