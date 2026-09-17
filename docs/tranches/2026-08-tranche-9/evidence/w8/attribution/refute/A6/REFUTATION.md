# T9-W8 §8.1 — ADVERSARIAL REFUTATION OF LANE A6 (GATE D AND THE BOOT BUDGET)

Refuter did not write lane A6. Attribution only; nothing under `web/frontend/src`, `scripts/`,
`.github/`, `csp-solver/` edited, no build run. Port 4257 (4256 held by a sibling lane; next free
in band, `--strictPort`), released at finish. Build identity `index-9rZPzI5DEcpe.js` / md5
`fa3d1af9870916cc728de11e97f57a90` / 43 files / 806.1 KB — identical before, served and after.

Host load 4.19 at open; retakes ran in two bands, **3.09–5.14** and **6.34–9.10**; 8.94 at close.
Lane A6's readiness matrix was itself taken at per-row load **6.18–8.03** (its own `readiness.jsonl`
stamps) — the "32.00" in its ATTRIBUTION header belongs to the GATE D block, not the matrix.

## Lens 1 — REPRODUCE. Both banked instruments ran unmodified.

`readiness-timeline.mjs` and `toggle-and-trace.mjs`, `--base http://127.0.0.1:4257`, 3 clean
windows per cell, zero tainted.

| quantity | lane | retake (load 3.1–5.1) | Δ |
| --- | --- | --- | --- |
| mob 4× unthr cold — boardReady / firstBake / TBT | 282 / 2,663 / 1,020 | 274 / 2,626 / 1,000 | ≤3 % |
| desk 4× unthr cold — firstBake / TBT | 1,880 / 221 | 1,823 / 206 | ≤7 % |
| mob 4× unthr **warm** — firstBake / TBT | 1,994 / 950 | 1,913 / 901 | ≤5 % |
| mob 6× f3g cold — firstBake / LCP / TBT | NOT MEASURED / 1,612 / 1,241 | NOT MEASURED / 1,616 / 1,236 | — |
| mob 4× toggle-1 task / blocking | 636 / 436 | 637 / 437 | +0.2 % |
| desk 4× toggle-1 task / blocking | 219 / 19 | 220 / 20 | +0.5 % |
| toggle-2 blocking, all 4 cells | 0 | 0 in 12/12 windows | — |
| drawer flip, desk 4× / mob 4× / mob 6× f3g | 75 / 116 / 175 | 68 / 105 / 186 | ≤10 % |

## Lens 2 — HOST vs BUNDLE. One column is a race; no headline is.

`profilerBusyToBoardReadyMs` is **bimodal**, not noisy — it lands near 250 or near 1,000 with
nothing between. Lane's mob-4× windows: 246 / 274 / **1011** → median 274. Refuter's, at *lower*
load: **964 / 952** / 248 → median **952**. At n=3 the median flips the story. Lane A6's note
"main-thread busy to board-ready runs the other way (mobile 274 vs desk 608)" does not survive.
Its headline (TBT 1,020 vs 221) reproduced at 1,000 vs 206 and does.

## Lens 3 — THE CRITICAL PATH.

### (a) The 2,381 ms gap is TWO legs. The lane named one.

`HandDrawnGrid.vue:255-257`: `showSteadyLayers = animState === 'drawn'`, and BOTH the baked
`<image>` siblings and the live `.boil-frame-layer` fallback sit inside that `v-if`. The bake
cannot mount before the draw-in animation completes. `refute-probes.mjs --mode gapsplit`
timestamps the first `.boil-frame-layer` and prices each leg with CDP Profiler samples:

| pose, 4× cold | load | board-ready | → drawn | → bake | leg 1 draw-in | leg 2 raster |
| --- | --- | --- | --- | --- | --- | --- |
| mobile dpr3 | 3.1–3.2 | 308 | 1,087 | 2,723 | **779** (715 busy, 647 lt) | **1,637** (920 busy, 646 lt) |
| mobile dpr3 | 6.3 | 332 | 1,122 | 2,844 | **790** (726 busy) | **1,663** (929 busy) |
| desk | 3.2–3.6 | 354 | 1,016 | 1,923 | **669** (581 busy, 449 lt) | **906** (175 busy, **0** lt) |
| desk | 6.6 | 377 | 1,070 | 1,963 | **685** (581 busy) | **890** (183 busy) |

Stable across both load bands. Leg 1 is the pencil draw-in — a designed transition, M09-protected.
The suspect "THE BAKE" owns leg 2 only: **1,637 ms mobile, 906 ms desk**, not 2,381. On desk leg 2
is 81 % idle wall clock (175 ms busy of 906), so the bake there is mostly *waiting* — headroom a
scheduling cure can take without drawing less.

### (b) The gallery freight is early-but-parallel. ABLATED.

`refute-probes.mjs --mode ablate`, mobile 4× cold, ablation at the network layer (no src edit).

| arm | routed | board-ready | firstBake | TBT(3000) | page errors |
| --- | --- | --- | --- | --- | --- |
| base | 0 | 282 / 289 | **2,714 / 2,618** | 1,057 / 941 | 0 |
| defer 4,000 ms | 16 | 268 / 286 | **2,633 / 2,566** | 1,012 / 929 | 0 |
| abort entirely | 16 | 280 / 289 | **2,687 / 2,660** | 1,040 / 1,018 | 0 |

(first figure n=3 at load 3.1–3.4, second n=2 at load 6.8–9.1.) Removing all sixteen moves the
bake by 27 ms / 42 ms against a 41–133 ms window spread, and moves board-ready not at all. Zero
page errors on the abort arm — the board never needed them. The arrival census reproduces exactly
(16 requests in a 5 ms burst, 16,364 B) — and it is **sixteen**, not fifteen, in the lane's own
`boot-freight-mob4x.json`.

## Lens 4 — THE LAW (M09). Refused candidates.

- **Shorten the draw-in animation** (leg 1, 669–790 ms — the largest single block the split
  exposes): REFUSED, shortens a transition.
- **Lower the grid bake's DPR cap below the WebKit-licensed 2, or drop the dpr-3 mobile raster**:
  REFUSED, thins the bake; the existing cap is licensed by a ≥0.98 SSIM floor.
- **Reduce `BOIL_CONFIG.frameCount`** so fewer poses bake: REFUSED, drops a bake.
- **Strip `grain-static` from the bake source** (`gridPoseSvg` inlines it): REFUSED, removes a
  filter; π identity and filterBudget 9 bind it.
- **Defer the gallery/poster chunks past the bake** (lane's C2): LAWFUL under M09 — it hides the
  not-yet-visible — but REFUTED ON EVIDENCE as a readiness cure by (b) above.

## Instrument findings against lane A6's own rig

- **`.boil-frame` matches nothing in this tree.** `readiness-timeline.mjs:107` uses
  `'.boil-frame-bitmap, .boil-frame'` for the boil-tick watcher; the classes that exist are
  `boil-frame-bitmap` (`HandDrawnGrid.vue:385`) and `boil-frame-layer` (`:407`). The dead selector
  is carried verbatim into `BUDGET-CANDIDATE.md`'s proposed `gates.json` `definition` string.
  `firstBoilTick` is unharmed in fact — the fallback stack is pinned to pose 0 until baked, so
  there is no pre-bake tick to miss — but the proposed config would ship a selector matching nothing.
- The lane's `RUN:` headers and its served-identity line name port **4390**, which the W8 charter
  puts out of bounds.

## Confirmed as the lane reported

**The toggle mechanism, at source.** `HandDrawnGrid.vue:214` — ``cacheKey:
`grid-${boardSize}-${subgridSize}-${isDark ? 'd' : 'l'}` ``; `pencil-boil/dist/raster.d.ts:80` —
"MUST encode theme (colors differ)." The theme token IS the cache key: a first flip to an unseen
theme must re-bake, the flip back is a cache hit. That is why the blob hrefs swap 3/3 on BOTH
toggles while the cost is first-only — the href evidence is neutral, the cache key is the proof.

**GATE D is desk-only.** `perf-rig/ci-subset.mjs:241` (`drive`) and `:449` (warm page) both open
`{ width: 1440, height: 900 }`, dpr 1. `ANCHOR_CEILING_MS` is compared against `median(anchors)`
(`:720-730`), per run not per window.

**Boot freight, re-captured** (`retake-freight.json`): the entry chunk statically imports exactly
`./vue-vendor` and `./animation-vendor`, with 13 dynamic `import()`s and no wasm reference;
`templates-CsCa30cxJEsI.js` is never fetched, `templates-LkXzF59FZu96.js` arrives at t=231; no wasm
in 6 s; `fraunces-subset` twice (t=12, t=78, 14,936 B both); `solver.worker` three times (t=12,
1112, 2080).

## Files

`identity-before/after.txt` build identity both ends · `retake-readiness.jsonl` and
`retake-toggle.jsonl` 12 readings each from the lane's own two instruments ·
`refute-probes.mjs` the merged ablate/gapsplit instrument (header says how to run it) with
`criticalpath.jsonl` / `gapsplit.jsonl` its output · `retake-freight.json` the re-captured waterfall.
