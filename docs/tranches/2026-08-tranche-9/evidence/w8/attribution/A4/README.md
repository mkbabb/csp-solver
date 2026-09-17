# A4 — THE DRAWER'S JANK (M02), the instruments

T9-W8 §8.1, attribution only. 2026-09-17, HEAD `58014efd`. Nothing under `web/frontend/src`
was touched; the served dist was read, never rebuilt.

## Build identity — bracketing every reading

```
AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
AUDIT: build-identity — http://127.0.0.1:4253 serves the same entry (index-9rZPzI5DEcpe.js)
```

Identical before and after the whole reading set (`build-identity.txt`). It matches the
chair's pre-launch line to the byte, so no lane rebuilt under this one.

Server: `npx vite preview --outDir dist --port 4253 --strictPort --host 127.0.0.1`, killed on
exit. Board state pinned on the URL (`?game=sudoku&size=3&difficulty=EASY`) — the estate
persists board state per origin, so an unpinned run measures whatever the last run left.

## Board-ready — the wave's one definition

`.board-group` **visible** (not merely present — it is `v-show`n and both control-panel twins
are always mounted) AND the first cell-class element's `getBoundingClientRect()` is non-zero
AND one `requestAnimationFrame` has fired after that; timestamped with `performance.now()`,
whose origin is navigationStart. **Selector note**: this estate's cell class is `.game-cell`
inside `.board-cells`; a bare `.cell` matches nothing here, so the lookup is
`.board-cells .game-cell` and visibility is the rig's own `isVisible` (client rects, plus
`visibility`/`display`/`opacity`).

## The three instruments

| file | what it reads | rerun |
| --- | --- | --- |
| `drawer-trace.mjs` | per-gesture frame census (rAF deltas: long33/long50/max-consecutive/worst + its index) and, on chromium, a CDP trace bucketed into `open` / `close` and the sub-windows `openOnset` / `closeOnset` / `closeSettle` — RecalcStyle ms **and its restyled-element count**, Layout ms + dirtyObjects, Paint, Raster, Composite | `node drawer-trace.mjs --engine chromium --regime mobile --cpu 4 --cycles 3 --port 4253 --out raw/x.jsonl` |
| `onset-ablate.mjs` | the onset frame split into its three co-located causes, each provoked ALONE in the live page: the `inert` flip on `.board-cells`, the `html.drawer-closed` toggle, the tongue's Teleport, plus a forced-layout-only control | `node onset-ablate.mjs --regime mobile --cpu 4 --port 4253 --out raw/y.jsonl` |
| `gesture-geometry.mjs` | the movers' own rects sampled once per rAF across a gesture — max single-frame jump and every discontinuity (berth change, visibility flip). A frame census says frames LANDED; this says whether what they drew MOVED | `node gesture-geometry.mjs --engine webkit --regime mobile --port 4253 --out raw/z.jsonl` |

All three resolve playwright out of `web/frontend/node_modules` and take `--port`. All readings are JSON lines in `raw/readings.jsonl`, one row per window, each carrying a
`src` field naming the run that produced it; `summarize.mjs` folds them into `raw/summary.txt`,
which is where every number the lane quotes can be read back.

## Engines, regimes, and what each may say

- **chromium** — CDP `Emulation.setCPUThrottlingRate` at 1× / **4× (the rig's GATE D rate, the
  mid-device proxy)** / 6×; `Network.emulateNetworkConditions` for the one Fast-3G-class cold
  run; `PerformanceObserver` longtask available.
- **webkit** — unthrottled only. **NO `longtask` entry type and no trace**: every per-subsystem
  ms figure below is `NOT MEASURED` on webkit, and the engine's empty task list is not a clean
  gesture. Its rAF gap census and its geometry sampling are real; nothing else is.
- **Real Safari and real iOS are absent from this lane by M19.** No number here is a Safari
  number and none is an iOS claim. The device readings belong to 8.3's owner-run instrument.
- Viewports: `desk` 1280×800; `mobile` 390×844 with `hasTouch` + `isMobile`.

## Host discipline

Six sibling lanes shared this machine. `raw/loadavg.txt` banks the 1-minute load at the start
and finish of every set:

```
LOAD-START { 5.14 5.48 6.00 }        (aborted v1 matrix)
LOAD-START(matrix v2) { 3.27 4.75 5.64 } … LOAD-END(matrix v2) { 3.60 4.53 5.49 }
LOAD-START(first-gesture) { 9.10 5.91 5.71 } … LOAD-END { 9.51 6.36 5.88 }
LOAD-FINISH { 8.78 6.49 5.94 }
```

The first-gesture claim was re-taken (`src: first-gesture-retake-*`, loads 8.64–9.12) and
compared against the matrix's own cycle-0 rows, taken at load 3.2–3.6. The 6× first-open frame
reads 49.1 ms at load 3.2 and 49.2–59.0 ms at load 8.6–9.5 — it reproduces across the spread,
so it is a fact about the surface and not about the host. Three cycles per reading, median
reported; no window reported `tainted` (blur/visibilitychange watch armed throughout), and no
1000–1300 ms lone delta appeared inside any gesture window.

## Traps this lane earned

1. **Playwright does not call a string that merely *looks* like a function.** `page.evaluate(FN_STRING)`
   evaluates the expression and hands back a function object, which serialises as `undefined` —
   a board-ready wait written that way never waits at all and reports a number anyway. Every
   in-page call here is `page.evaluate(\`(${FN})()\`)`.
2. **The gesture windows are named by ORDER, not by direction.** The desk drawer's persisted
   default is OPEN, the mobile dock always lands CLOSED (G3), so the FIRST click is a *close* on
   desk and an *open* on mobile. The `expandedTrail` travels with every row for exactly this
   reason; read direction off the trail, never off the window's name. `raw/summary.txt` relabels every row by measured direction.
3. **Trace windows must overlap.** `openOnset ⊂ open`, so the bucketer accumulates into every
   matching window rather than the first one.
4. **The first gesture of a page's life is a different measurement.** The sheet is
   `visibility: hidden` until it opens, so its content rasters inside gesture one. Cycle 0 and
   cycles 1–2 are reported apart; a 3-cycle median hides the defect.
5. `--net fast3g` is refused on webkit rather than silently taken unthrottled.
