# T9-W8 §8.1 lane A6 — GATE D AND THE BOOT BUDGET

Attribution only. No cure landed. Nothing under `web/frontend/src`, `scripts/`, `.github/` or
`csp-solver/` was edited. HEAD `58014efd`, 2026-09-17, darwin, 18 cpus.

**BUILD IDENTITY, both ends — UNCHANGED, so the readings stand.**

```
before  AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
after   AUDIT: build-identity — dist entry index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files / 806.1 KB · newest mtime 2026-09-17T17:53:45.987Z
        AUDIT: build-identity — http://127.0.0.1:4390 serves the same entry (index-9rZPzI5DEcpe.js)
```

No build was run. Ports used and released: 4390 (`ci-subset.mjs`'s own server, then
`vite preview`). Host load at the lane's start `32.00 / 12.64 / 9.91`, at finish
`3.90 / 6.21 / 7.70`. Up to six sibling lanes ran concurrently.

**BOARD-READY, the one definition used everywhere below**: `.board-group` VISIBLE (it is
`v-show`n and both control-panel twins are always mounted, so presence is not enough) AND the
first `.cell`-class element's `getBoundingClientRect()` has non-zero size AND one rAF has
fired after that — `performance.now()`, i.e. ms since navigationStart.

---

## 1. GATE D, executed on this tree

`node perf-rig/ci-subset.mjs`, no `--build`, four runs interleaved with load readings.

| run | file | load start → finish | chromium median bootTbt | anchors (min-of-3, ms) | webkit | exit | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `gate-d-run1.txt` | 32.00 → 29.50 | **373 ms** | NOT REPORTED | NOT MEASURED | 1 | GATE D PASS; GATE B breach (idle 125.5 < 130.68) — a HOST fact at load 32, not a bundle fact |
| 2 | `gate-d-run2.txt` | 12.57 → 7.82 | **413 ms** | 118 / 146 / **876** | NOT MEASURED | 0 | GREEN |
| 3 | `gate-d-run3.txt` | 7.68 → 7.81 | VOID | — | NOT MEASURED | 2 | chromium leg discarded whole on one control window; GATE D ungradable |
| 4 | `gate-d-run4.txt` | 11.05 → 5.11 | **242 ms** | 117 / 117 / 119 | NOT MEASURED | 0 | GREEN, cleanest anchors |

**GATE D on this tree: median of the three graded medians = 373 ms** against
`boot.tbt.maxTbtMs` 1750 (4× CPU, 3000 ms window) — **21 % of budget, 1,377 ms of headroom.**
Task census 10–11 per boot window, longest task 206–261 ms.

WebKit prints **NOT MEASURED** in every run and is never a pass: `PerformanceObserver`
supported entry types carry no `longtask` in WebKit, and an empty task list from an engine
that cannot see tasks is not a clean boot. Its host CPU anchor read 42–45 ms at 1× in three
of four runs and 1046 ms once (run 1, load 32) — the contention tell.

**These are the DARWIN BASIS for the WGATE restamp row, and they do not restamp anything.**
`gates.json`'s own note binds the restamp: 1750 is PROVISIONAL, "RESTAMP AT WGATE at n≥3
*runner* readings". Runner readings are ubuntu (1276 / 1333 ms on a clean tree); darwin at
T7-W3 read 256 / 309 / 373 ms on a calm box. This lane's 242 / 373 / 413 sits inside that same
darwin band, which is evidence the bundle has not regressed since T7-W3 and evidence of
nothing about the runner's floor.

### Two instrument findings GATE D's own executor carries

- **`ANCHOR_CEILING_MS` is checked on the MEDIAN, not per window** (`ci-subset.mjs:721-730`).
  Run 2 took a window whose anchor read 876 ms — 2.5× the 350 ms admissibility ceiling, i.e.
  a window the host was not computing fast enough to grade — and that window's TBT (2204 ms,
  **over the 1750 ms threshold**, longest task 1453 ms) was carried into the median because the
  median anchor (146) was clean. At n=3 the median is the middle value, so two starved windows
  out of three would put a HOST fact on the wrong side of a BUNDLE gate. The gate's own
  control-validity doctrine ("a contended boot TBT is graded as a bundle fact… the cure is a
  control, not a bigger number") argues for the per-window form.
- **A single control-window stall discards the whole chromium leg, boot TBT included** (run 3:
  "no rafCeiling line on window 3 (done=false)" → engine leg dropped → "boot TBT measured on
  no engine" → exit 2). The three bootTbt windows of that run had nothing to do with the
  rafCeiling control and were never graded. This is the same shape T7-W6 cured for the
  *breach* case (grade everything measured before taking an exit) left uncured for the
  *instrument-failure* case.
- **GATE D measures the DESK POSE ONLY.** `ci-subset.mjs:241/449` opens every page at
  `{ width: 1440, height: 900 }`, dpr 1. The mobile pose reads 4.6× the boot TBT at the same
  4× rate (§2) and is unpriced by any gate in `gates.json`.

## 2. The readiness timeline

`readiness-timeline.mjs` (banked, rerunnable; header says how). 16 cells × 3 windows = 48
readings, `readiness.jsonl`; medians in `readiness-table.md`. Zero tainted windows.
Cold = CDP `Network.setCacheDisabled`; Fast-3G-class = 1.6 Mbps / 750 kbps / 150 ms RTT via
`Network.emulateNetworkConditions`; warm = the second navigation with cache enabled.
Chromium CPU throttling via `Emulation.setCPUThrottlingRate` **before** the navigation.
**WebKit takes no CDP: its rows are UNTHROTTLED CPU and UNTHROTTLED LINK, and they are not
Safari numbers and not an iOS claim.**

| cell | firstPaint | FCP | LCP | **board-ready** | firstBake | **firstBoilTick** | drawer flip | TBT(3000) | busy→BR | rAF-gap proxy |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| desk cr 1× f3g cold | 836 | 836 | 1840 | 1220 | 1812 | 2037 | 34 | 1 | 51 | 678 |
| desk cr **4×** f3g cold | 864 | 864 | 2580 | 1482 | 2570 | 2698 | 81 | 296 | 318 | 1257 |
| desk cr 6× f3g cold | 872 | 872 | 3116 | 1624 | 3104 | 3226 | 185 | 647 | 459 | 1688 |
| desk cr 1× unthr cold | 84 | 84 | 692 | 81 | 674 | 899 | 32 | 2 | 52 | 71 |
| desk cr **4×** unthr cold | 32 | 32 | 1892 | 314 | 1880 | 2067 | 75 | 221 | 280 | 564 |
| desk cr 6× unthr cold | 472 | 472 | 2488 | 471 | 2453 | 2592 | 101 | 646 | 434 | 1083 |
| desk cr 4× unthr **warm** | 220 | 220 | 1164 | 229 | 1158 | 1289 | 67 | 131 | 187 | 496 |
| desk cr 1× unthr **warm** | 12 | 12 | 652 | 46 | 641 | 894 | 28 | 0 | 0 | 47 |
| mob cr 1× f3g cold | 848 | 848 | 1820 | 1204 | 1800 | 2034 | 56 | 0 | 0 | 834 |
| mob cr **4×** f3g cold | 852 | 852 | 3224 | 1396 | 3214 | **3317** | 105 | 994 | 239 | 1821 |
| mob cr 6× f3g cold | 864 | 864 | 1612 | 1541 | **NOT MEASURED** | **NOT MEASURED** | 175 | 1241 | 375 | 1838 |
| mob cr **4×** unthr cold | 32 | 32 | 2684 | 282 | 2663 | 2813 | 116 | **1020** | 250 | 1268 |
| mob cr 4× unthr **warm** | 196 | 196 | 2000 | 206 | 1994 | 2164 | 119 | **950** | 121 | 1171 |
| desk wk 1× unthr cold | NOT MEASURED | 134 | 754 | 232 | 737 | 919 | 56 | NOT MEASURED | NOT MEASURED | 195 |
| mob wk 1× unthr cold | NOT MEASURED | 113 | 729 | 359 | 712 | 912 | 69 | NOT MEASURED | NOT MEASURED | 339 |
| desk wk 1× unthr **warm** | NOT MEASURED | 13 | 706 | 180 | 690 | 907 | 56 | NOT MEASURED | NOT MEASURED | 146 |

All figures ms, median of 3 clean windows. WebKit's `firstPaint` is NOT MEASURED because
**Safari/WebKit ships no `first-paint` paint entry**, only FCP — never reported as 0.
TBT and `busy→BR` are NOT MEASURED on WebKit for want of `longtask`; the rAF-gap column is the
only proxy that engine can offer and is never called TBT.

### What the table says

1. **BOARD-READY IS NOT THE PROBLEM. THE BAKE IS.** At chromium 4× unthrottled the board reads
   ready at 282–314 ms and the boil bake does not land until 1,880 ms (desk) / 2,663 ms
   (mobile). The board sits up, ready and undrawn, for **1,566 ms on desk and 2,381 ms on
   mobile**. That gap is the owner's "poor for drawing" (T9-M06).
2. **LCP IS THE BAKE.** In all sixteen cells `lcpMs` and `firstBakeMs` are within ~20 ms of
   each other. The app's Largest Contentful Paint element is the baked pose bitmap, so LCP is
   a *restatement* of the bake and not an independent metric.
3. **THE MOBILE POSE COSTS 4.6× THE BLOCKING AT THE SAME CPU RATE.** 390×844 dpr 3 vs
   1280×800 dpr 1, same throttle, same link, same bundle: TBT(3000) 1,020 vs 221 ms; bake
   2,663 vs 1,880 ms. Main-thread busy *to board-ready* is the other way round (mobile 274 ms
   vs desk 608 ms at 4×, `toggle-table.md`) because desk boots with the drawer already
   expanded — the mobile cost lands **after** board-ready, in the dpr-3 raster.
4. **THE CACHE BUYS THE TRANSPORT, NOT THE BAKE — and on mobile it buys almost nothing.**
   This is §8.1's "cache story", measured. Desk 4×: cold→warm bake 1,880→1,158 ms (−38 %),
   TBT 221→131 (−41 %). Mobile 4×: bake 2,663→1,994 (−25 %), **TBT 1,020→950 (−7 %)**. The
   owner's "subsequent invocations are better" is real and it is mostly the HTTP cache; the
   raster is CPU and it is paid again every load.
5. **AT 6× ON A FAST-3G-CLASS LINK THE MOBILE BAKE DOES NOT ARRIVE AT ALL** inside the 3.6 s
   observation window — `firstBake` and `firstBoilTick` are NOT MEASURED in all three windows.
   The LCP 1,612 ms in that row is a pre-bake element.
6. **THE DRAWER'S STATE FLIP ALONE COSTS 75–185 ms at ≥4×** (dispatch → `aria-expanded="true"`
   → 2 rAF; measured after the boot window so it cannot perturb the TBT the same load reports).
   At 1× it is 28–34 ms. This is the flip's latency, not its frame curve — M02's frame-time
   probe is a separate gate.

## 3. The dark-mode toggle re-bake (§8.1's shaped suspect) — CONFIRMED

`toggle-and-trace.mjs` → `toggle-trace.jsonl` → `toggle-table.md`. Cold cache, CDP throttle,
3 clean windows per cell. The tell is the `href` set of the `<image class="boil-frame-bitmap">`
siblings: they are `blob:` URLs minted by the pose bake, so a re-bake replaces all four.

| cell | board-ready | profiler busy→BR | wall→BR | busy % | **toggle 1 task / BLOCKING** | **toggle 2 task / BLOCKING** | hrefs replaced t1 | t2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| desk 1× | 78 | 65 | 87 | 75 % | 0 / 0 | 0 / 0 | 3/3 | 3/3 |
| desk 4× | 367 | 608 | 743 | 82 % | 219 / 19 | 0 / 0 | 3/3 | 3/3 |
| mob 1× | 83 | 69 | 92 | 75 % | 0 / 0 | 0 / 0 | 3/3 | 3/3 |
| **mob 4×** | 321 | 274 | 361 | 76 % | **636 / 436** | **0 / 0** | 3/3 | 3/3 |

**The first dark-mode toggle costs 636 ms of main-thread task time and 436 ms of blocking at
the mobile pose / 4× CPU. The second costs zero.** The blob hrefs are re-minted on *every*
toggle (3/3 both times, in all four cells), so the mount is unconditional — but the *raster* is
first-only, which is the signature of a per-theme bake cache that has never seen the other
theme. This is exactly the shape §8.1 named, and it is the one suspect that answers the
owner's "dark mode toggle… is poor" directly.

Main-thread busy to board-ready, from CDP `Profiler` samples rather than `longtask` (which
only sees tasks over 50 ms and therefore floors the figure): **75–82 % of the wall clock to
board-ready is main-thread busy** in every cell.

## 4. The boot freight, named

`boot-freight-mob4x.json` — the full resource waterfall, mobile 390×844 dpr 3, 4× CPU, cache
disabled, 6 s observation.

- **The entry chunk statically imports exactly two things**: `vue-vendor` and
  `animation-vendor`. Everything else in `dist/assets` is a dynamic `import()`. §8.1's
  hypothesis that "the 16×16 template bank rides the entry chunk" is **REFUTED at this HEAD**:
  `templates-CsCa30cxJEsI.js` (24 KB, the larger bank) is never fetched on boot at all, and
  `templates-LkXzF59FZu96.js` (5.2 KB) arrives at t=466 ms as its own chunk.
- **The wasm solver does NOT init on boot.** `csp_solver_wasm_bg-BJYevEYE.wasm` (120 KB) does
  not appear in six seconds of cold mobile boot. §8.1's "wasm init on boot vs on first deal" —
  answered: first deal. `solver.worker-DyhLjsTj.js` is modulepreloaded and requested three
  times (t=46, 1344, 2309) for one worker.
- **Fifteen requests land in five milliseconds at t≈2067–2072**: all five game posters, their
  CSS, three `clue-*` chunks, `CageOverlay`, `ThermoTube`, `PosterBoard`, `wire`. ~17 KB of
  bytes but fifteen module evaluations, landing *inside* the boot window and ~600 ms before the
  bake. None of it is visible at first paint — the gallery deck is not on screen.
- **`fraunces-subset-qp6ShjBRhfYB.woff2` is requested twice** (t=47 preload, t=266 again,
  14,936 B both times). Under a cold or disabled cache that is a second transfer of the same
  subset; a preload consumed once is requested once.
- First 53 ms of the waterfall: entry 73.8 KB + vue-vendor 33.9 + css 19.2 + animation-vendor
  5.0 + three font subsets 23.5 + solver.worker 4.6 ≈ 165 KB, all `modulepreload`ed or
  `preload`ed from `index.html`. `<div id="app">` is empty — there is no inline shell, so
  first paint waits on the whole of that.

## 5. Files

| file | what |
| --- | --- |
| `gate-d-run1..4.txt` | the four GATE D runs, whole report text, load stamped at both ends |
| `readiness-timeline.mjs` | the readiness instrument (rerunnable; header says how) |
| `readiness.jsonl` · `readiness-table.md` | 48 raw readings · medians |
| `summarize-readiness.mjs` | the folder for both |
| `toggle-and-trace.mjs` · `toggle-trace.jsonl` · `toggle-table.md` | the re-bake + profiler lane |
| `boot-freight-mob4x.json` | the cold mobile waterfall |
| `8.3-device-instrument-charter.md` · `device-probe-spike.js` | §8.3's owner-run instrument |
| `dist-identity-before.txt` · `dist-identity-after.txt` | the build-identity assertion, both ends; the `after` file carries the served-vs-disk arm |

**Deleted to hold the 180 KiB lane cap** (`du -sk` reads 172): `readiness.mjs`, a PRIOR A6
artifact timestamped 13:59 local, before this session opened at 14:16 — it was never run here
and no number above came from it; `dist-identity-mid-served.txt`, whose line is reproduced
verbatim in the header of this file and in `dist-identity-after.txt`; and the two run logs,
whose per-cell load stamps are carried on every row of `readiness.jsonl` and
`toggle-trace.jsonl`.
