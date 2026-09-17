# T9-W8 §8.1 · lane A1 — THE BAKE PIPELINE AT FIRST PAINT

Attribution only. Nothing under `src/` was touched; no cure lands in 8.1.

**The dist is the chair's, unmoved.** `dist-identity-before.txt` and `dist-identity-after.txt`
both read `index-9rZPzI5DEcpe.js · index.html md5 fa3d1af9870916cc728de11e97f57a90 · 43 files /
806.1 KB`, served-vs-disk asserted on :4250 at both ends. No build ran in this lane.

**Host.** darwin 25.4.0, up to six sibling lanes concurrent. Load average is printed at the
start and finish of every reading block in `bake-table.md`; readings were taken between
load 4.2 and 7.7 except the 1×/cold/desk block, which opened at 7.70.

| file | what it is |
| --- | --- |
| `bake-census.mjs` | the instrument — Playwright + an `addInitScript` that wraps the whole raster chain, plus a `PerformanceObserver` and a rAF-gap sampler. Header line says how to run it. |
| `summarize.mjs` | folds a run's JSONL into the bake table |
| `double-bake-proof.mjs` | prices the discarded round and names which of the two mechanisms produced it |
| `trace-summary.mjs` | main-thread self-time out of the CDP `devtools.timeline` capture |
| `bake-table.md` | THE TABLE — 10 regimes, 3 windows each, medians |
| `double-bake-proof.txt` | the discarded round, per window, with its mechanism |
| `trace-4x-cold-summary.txt` | the 4×/Fast-3G/cold trace, summarized |
| `raw/*.jsonl.gz` | the raw readings (gzipped for the evidence cap; `gunzip -c` and feed to `summarize.mjs`) |
| `dist-identity-{before,after}.txt` | the build-identity lines |

The 19.9 MB trace itself was NOT banked — it is 10× the whole wave's byte cap. Re-capture with
`bake-census.mjs --trace <path>`; the summary is the banked artifact.

## Board-ready, the wave's one definition

`.board-group` VISIBLE (it is `v-show`n — a presence check samples an invisible board) AND the
first `.cell`-class element inside it has a non-zero `getBoundingClientRect` AND one
`requestAnimationFrame` has fired after that; stamped `performance.now()`, i.e. relative to
navigationStart. Implemented once, in `bake-census.mjs`'s `poll()`.

## How a surface gets its name

Production minifies component names away, so the surface is read off the pose SVG's own bytes
at the `Blob` constructor: `grain-static` → grid, `<text` → logo, `wobble-celestial` +
`r="48"` → toggle-sun, otherwise toggle-moon. The url→canvas chain is then followed through
`createObjectURL` → `drawImage` → `toBlob`, so every encode's ms and PNG byte count is
attributed to a named surface with no guessing.

## What the numbers say

1. **No bake is render-blocking for board-ready on chromium** — every `toBlob` starts after it,
   in all seven chromium regimes. **On WebKit the grid's first round starts BEFORE board-ready**
   (t_start 167 vs board-ready 451, desk cold) and board-ready lands within 4 ms of that round's
   last encode. WebKit is the engine iOS runs.
2. **The bake pipeline is 2,051 ms of blocking main-thread encode** at 4×/Fast-3G/cold/desk,
   against a 1,387 ms board-ready — i.e. the board reads "ready" and then the main thread is
   busy for another ~2.5 s. The grid alone is 1,672 ms of it.
3. **Half of it is thrown away.** Every cold boot bakes the grid and both celestials TWICE;
   the first round is discarded before a pixel of it is shown. Chromium's two rounds are
   byte-identical (`double-bake-proof.txt`), so "the same bitmap bytes, later" is available by
   construction.
4. **The FIRST dark toggle re-bakes 8 poses** (grid 4 + logo 4 — the two surfaces whose
   `cacheKey` carries the theme token) for 905 ms of blocking main thread and 1,282 ms to
   settle at 4×. **The SECOND toggle re-bakes nothing** — pencil-boil 0.12's size-keyed stack
   cache (`DEFAULT_POSE_CACHE` 4) serves the light stacks whole. That asymmetry is the owner's
   "first page load poor, subsequent invocations better" read at the mechanism.
5. **The HTTP cache buys the network, not the bake.** Warm 4×/Fast-3G board-ready 571 ms vs
   cold 1,387 ms — an 816 ms delta that is entirely fetch and parse. The encode work is
   unchanged (1,888 ms warm vs 2,051 ms cold): object URLs are per-document, so no reload
   inherits a single baked byte.
